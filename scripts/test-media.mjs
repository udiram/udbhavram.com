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
    await page.addInitScript(() => {
      class FakePlayer {
        constructor(element, options) {
          this.time = 0; this.state = 5; this.options = options
          const frame = document.createElement('iframe'); frame.title = 'Mock YouTube player'; element.append(frame)
          window.__ytFake = {
            play: () => { this.state = 1; this.options.events.onStateChange({data:1,target:this}) },
            pause: () => { this.state = 2; this.options.events.onStateChange({data:2,target:this}) },
            advance: value => { if(this.state===1) this.time += value },
            time: () => this.time,
          }
          setTimeout(() => options.events.onReady({target:this}), 300)
        }
        destroy() { this.destroyed = true }
        getCurrentTime() { return this.time }
        seekTo(value) { this.time = value; this.state = 2; this.options.events.onStateChange({data:2,target:this}) }
      }
      window.YT = {Player: FakePlayer}
    })
    page.on('pageerror', e => errors.push(e.message))
    const thirdParty = []
    page.on('request', request => { if (/youtube|ytimg|googlevideo/.test(request.url())) thirdParty.push(request.url()) })
    await page.goto(`${base}/media`)
    await page.waitForTimeout(300)
    assert.equal(await page.locator('[data-media-article]').count(), 9)
    assert.equal(await page.locator('[data-media-video]').count(), 15)
    assert.equal(await page.locator('iframe').count(), 0)
    assert.deepEqual(thirdParty, [], 'No YouTube/thumbnail requests before consent')
    assert.equal(await page.locator('.video-load img[src^="/assets/media/video-thumbnails/"]').count(), 15)
    assert.equal(await page.locator('#lap-companion').count(), 1)
    assert.match(await page.locator('#lap-companion').innerText(), /Static redraw/)
    assert.match(await page.locator('#lap-companion').innerText(), /No GPS, speed, throttle, brake, or lap-time telemetry is claimed/)
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
    // The annotated lap view has its own explicit consent boundary and seek controls.
    await page.locator('.lap-timeline button').nth(1).click()
    assert.match(await page.locator('.lap-now').innerText(), /Observed at 0:00/i)
    assert.match(await page.locator('.lap-now').innerText(), /2:32 is queued/)
    assert.equal(await page.locator('#lap-companion iframe').count(), 1)
    await page.waitForTimeout(650)
    assert.match(await page.locator('.lap-now').innerText(), /Observed at 2:32 · paused/i)
    assert.match(await page.locator('.lap-now').innerText(), /Leaving the garage/)
    await page.evaluate(() => window.__ytFake.play())
    await page.evaluate(() => window.__ytFake.advance(63))
    await page.waitForTimeout(350)
    assert.match(await page.locator('.lap-now').innerText(), /Observed at 3:35 · playing/i)
    assert.match(await page.locator('.lap-now').innerText(), /Open track/)
    await page.evaluate(() => window.__ytFake.pause())
    const pausedTime = await page.evaluate(() => window.__ytFake.time())
    await page.waitForTimeout(400)
    assert.equal(await page.evaluate(() => window.__ytFake.time()), pausedTime)
    assert.match(await page.locator('.lap-now').innerText(), /paused/i)
    await page.locator('#lap-companion').getByRole('button', {name:'Close video'}).click()
    assert.equal(await page.locator('#lap-companion iframe').count(), 0)
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
  // A stalled API script must time out, clear its cached promise, and succeed on retry.
  {
    const context = await browser.newContext({ viewport: { width: 900, height: 900 } })
    const page = await context.newPage()
    await page.addInitScript(() => { window.__YT_API_TIMEOUT_MS = 75 })
    let attempts = 0
    await page.route('https://www.youtube.com/iframe_api', async route => {
      attempts += 1
      if (attempts === 1) return route.fulfill({ contentType: 'application/javascript', body: '/* callback intentionally omitted */' })
      return route.fulfill({ contentType: 'application/javascript', body: `
        window.YT={Player:class{constructor(element,options){this.time=0;this.options=options;const frame=document.createElement('iframe');frame.title='Recovered YouTube player';element.append(frame);setTimeout(()=>options.events.onReady({target:this}),0)}destroy(){}getCurrentTime(){return this.time}seekTo(value){this.time=value;this.options.events.onStateChange({data:2,target:this})}}};
        window.onYouTubeIframeAPIReady();
      ` })
    })
    await page.goto(`${base}/media#lap-companion`)
    await page.locator('.lap-timeline button').nth(1).click()
    await page.getByRole('button', { name: 'Try loading again' }).waitFor()
    assert.match(await page.locator('.lap-error').innerText(), /could not load/i)
    assert.equal(await page.locator('script[data-lap-companion-api]').count(), 0, 'Failed API script is removed')
    await page.getByRole('button', { name: 'Try loading again' }).click()
    await page.waitForFunction(() => document.querySelector('.lap-now')?.textContent?.includes('Observed at 2:32 · paused'))
    assert.equal(attempts, 2, 'Retry requests a fresh API script')
    assert.equal(await page.locator('#lap-companion iframe').count(), 1)
    await context.close()
    console.log('PASS YouTube API timeout clears the cached failure and retry reaches ready state.')
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
