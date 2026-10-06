import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import { once } from 'node:events'
import { chromium } from 'playwright'
import { createAppServer } from '../server.mjs'

const data = JSON.parse(await fs.readFile('src/mediaContent.json', 'utf8'))
let server
let base = process.env.TEST_ORIGIN
if (!base) {
  server = createAppServer(); server.listen(0, '127.0.0.1'); await once(server, 'listening')
  base = `http://127.0.0.1:${server.address().port}`
}
const browser = await chromium.launch({ headless: true, channel: process.env.PLAYWRIGHT_CHANNEL || 'chrome' })
const errors = []
try {
  for (const width of [1440, 820, 390]) {
    const context = await browser.newContext({ viewport: { width, height: 1000 } })
    const page = await context.newPage()
    page.on('pageerror', e => errors.push(e.message))
    const thirdParty = []
    page.on('request', request => { if (/youtube|ytimg|googlevideo/.test(request.url())) thirdParty.push(request.url()) })
    await page.goto(`${base}/media`)
    await page.waitForTimeout(300)
    assert.equal(await page.locator('[data-media-article]').count(), 9)
    assert.equal(await page.locator('[data-media-video]').count(), 15)
    assert.equal(await page.locator('iframe').count(), 0)
    assert.deepEqual(thirdParty, [], 'No YouTube/thumbnail requests before consent')
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, `No overflow at ${width}`)
    const nav = page.locator('nav[aria-label="Main navigation"]')
    if(width===390){
      await page.getByRole('button',{name:'Open navigation',exact:true}).click()
      assert.equal(await nav.getByRole('link',{name:'Media',exact:true}).isVisible(),true)
      await page.getByRole('button',{name:'Close navigation',exact:true}).click()
    }
    await page.locator('.theme-toggle').click()
    assert.equal(await page.locator('html').getAttribute('data-theme'),'dark')
    if(process.env.EVIDENCE_DIR && width===390) await page.screenshot({path:`${process.env.EVIDENCE_DIR}/media-dark-390.png`})
    await page.locator('.theme-toggle').click()
    // Header navigation must stay in bounds at intermediate desktop widths.
    if (width > 760) {
      const rect = await nav.boundingBox()
      if (rect) assert.ok(rect.x + rect.width <= width, 'Header fits')
    }
    for (const a of data.articles) assert.ok(await page.locator(`[id="${a.id}"] a[href="${a.url}"]`).count() >= 1)
    for (const v of data.videos) assert.equal(await page.locator(`[id="${v.id}"] a[href="${v.url}"]`).count(), 1)
    await page.getByLabel('Topic', {exact:true}).selectOption('Motorsport')
    assert.equal(await page.locator('[data-media-video]').count(), 3)
    assert.match(await page.locator('[data-media-video]').first().innerText(), /Uploaded September 30, 2026[\s\S]*Driven: May 2023/)
    await page.getByLabel('Find a video').fill('no-such-video-987')
    assert.equal(await page.locator('[data-media-video]').count(), 0)
    await page.getByRole('button', {name:'Reset video filters'}).click()
    await page.getByLabel('Find a video').fill('Arduino')
    assert.equal(await page.locator('[data-media-video]').count(), 1)
    // Stub the remote frame; we test consent and controls, not YouTube availability.
    await page.route('https://www.youtube-nocookie.com/**', route => route.fulfill({contentType:'text/html',body:'<p>Video test frame</p>'}))
    await page.getByRole('button', {name:'Load YouTube video: Arduino labs',exact:true}).click()
    assert.equal(await page.locator('iframe').count(), 1)
    assert.equal(await page.locator('iframe').getAttribute('src'), data.videos.at(-1).embed_url)
    await page.getByRole('button', {name:'Close video',exact:true}).click()
    assert.equal(await page.locator('iframe').count(), 0)
    await page.getByLabel('Find a video').fill('')
    if (process.env.EVIDENCE_DIR) {
      await fs.mkdir(process.env.EVIDENCE_DIR, {recursive:true})
      await page.evaluate(() => scrollTo(0,0))
      await page.screenshot({path:`${process.env.EVIDENCE_DIR}/media-${width}.png`,fullPage:true})
      await page.locator('#videos').evaluate(e=>e.scrollIntoView({block:'start',behavior:'instant'}))
      await page.screenshot({path:`${process.env.EVIDENCE_DIR}/videos-${width}.png`})
    }
    await page.goto(`${base}/collection/media#entry-0-0`)
    assert.ok(await page.locator('#entry-0-0').count(), 'Legacy media anchors survive')
    assert.ok(await page.locator('a[href="/media"]').count(), 'Legacy page links to dedicated media page')
    await page.goto(`${base}/media#video-GNboj6JfDeI`)
    await page.waitForFunction(() => document.activeElement?.id === 'video-GNboj6JfDeI')
    assert.equal(await page.locator('[data-media-video]').count(),15)
    for (const path of ['/','/about','/software','/beyond']) {
      await page.goto(base+path)
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, `${path}: no overflow at ${width}`)
      assert.ok(await page.locator('a[href^="/media"]').count(), `${path}: reciprocal link`)
      if(process.env.EVIDENCE_DIR && width!==820) await page.screenshot({path:`${process.env.EVIDENCE_DIR}/${path.slice(1)||'home'}-${width}.png`,fullPage:true})
    }
    console.log(`PASS ${width}px: 9 editions, 15 videos, filters/search/reset, consent/no prefetch, close/fallback, legacy route, deep links, reciprocal links, overflow, screenshots.`)
    await context.close()
  }
  // Validate every related media URL and fragment against actual prerendered documents.
  const links = new Set([...data.articles,...data.videos,...data.profiles].flatMap(x=>x.related_pages))
  for (const link of links) {
    const [path,hash] = link.split('#')
    const response=await fetch(base+path); assert.equal(response.status,200,link)
    if(hash) assert.ok((await response.text()).includes(`id="${hash}"`),link)
  }
  assert.deepEqual(errors,[])
  console.log(`PASS ${links.size} contextual route/fragment destinations and no browser errors.`)
} finally {
  await browser.close()
  if(server){server.close();await once(server,'close')}
}
