import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { readFile } from 'node:fs/promises'
import { once } from 'node:events'
import { chromium } from 'playwright'
import { createServer as createViteServer } from 'vite'
import { createAppServer } from '../server.mjs'
import media from '../src/mediaContent.json' with { type: 'json' }

const vite = await createViteServer({ server: { middlewareMode: true, hmr: false }, appType: 'custom' })
let studies
try {
  ;({ studies } = await vite.ssrLoadModule('/src/expandedContent.ts'))
  assert.equal(studies.length, 8)
  assert.equal(studies[0].slug, 'radkev')
  assert.equal(studies[0].status, 'medRxiv preprint · submitting author')
  assert.ok(studies[0].sources.some(source => source.href === 'https://doi.org/10.64898/2026.10.07.26364991'))
  const hashes = await Promise.all(studies.map(async study => createHash('sha256').update(await readFile(`public${study.image.src}`)).digest('hex')))
  assert.equal(new Set(hashes).size, studies.length)
} finally { await vite.close() }

const server = createAppServer(); server.listen(0, '127.0.0.1'); await once(server, 'listening')
const base = `http://127.0.0.1:${server.address().port}`
const browser = await chromium.launch({ headless: true, channel: process.env.PLAYWRIGHT_CHANNEL || 'chrome' })
try {
  const page = await browser.newPage({ viewport: { width: 1200, height: 900 } })
  const errors = []
  page.on('pageerror', error => errors.push(error.message))
  await page.goto(`${base}/research`)
  assert.match(await page.locator('.research-hero').innerText(), /RadKev/)
  assert.equal(await page.locator('.study-index-row').count(), 7)
  assert.match(await page.locator('#journal-articles').innerText(), /This preprint has not been peer reviewed/)
  for (const study of studies) {
    await page.goto(`${base}/research/${study.slug}`)
    assert.equal(await page.locator('.study-prose .prose').count(), study.sections.length + 1)
    assert.equal(await page.locator('.study-hero img').getAttribute('src'), study.image.src)
    assert.equal(await page.locator('.study-hero img').evaluate(element => getComputedStyle(element).objectFit), 'contain', `${study.slug} art is not cropped`)
    const expected = media.videos.filter(video => video.related_pages.includes(`/research/${study.slug}`))
    assert.equal(await page.locator('.study-prose .study-video-set [data-media-video]').count(), expected.length, `${study.slug} exposes every related recording`)
    for (const video of expected) {
      const card = page.locator(`#${video.id}`)
      assert.equal(await card.locator(`img[src="/assets/media/video-thumbnails/${video.video_id}.jpg"]`).count(), 1)
      assert.equal(await card.locator('iframe').count(), 0, 'YouTube is not embedded before consent')
      assert.equal(await card.locator(`a[href="${video.url}"]`).count(), 1)
    }
  }
  const consentStudy = studies.find(study => media.videos.some(video => video.related_pages.includes(`/research/${study.slug}`)))
  await page.goto(`${base}/research/${consentStudy.slug}`)
  const firstVideo = page.locator('.study-prose [data-media-video]').first()
  await firstVideo.getByRole('button', { name: /Load YouTube video/ }).click()
  assert.equal(await firstVideo.locator('iframe').count(), 1, 'explicit activation loads the embed')
  await firstVideo.getByRole('button', { name: 'Close video' }).click()
  assert.equal(await firstVideo.locator('iframe').count(), 0, 'closing removes the embed')

  await page.setViewportSize({ width: 390, height: 844 })
  for (const study of studies) {
    await page.goto(`${base}/research/${study.slug}`)
    const hero = page.locator('.study-hero img')
    await hero.evaluate(async element => { if (!element.complete) await new Promise(resolve => element.addEventListener('load', resolve, { once: true })); await element.decode?.() })
    const box = await hero.boundingBox()
    assert.ok(box && box.y < 844 && box.y + box.height > 0, `${study.slug} art enters the first mobile viewport`)
    assert.equal(await page.locator('.study-sidebar').evaluate(element => element.getBoundingClientRect().top > document.querySelector('.study-prose').getBoundingClientRect().top), true, `${study.slug} navigation follows evidence on mobile`)
  }
  assert.deepEqual(errors, [])
  console.log('PASS research: RadKev leads eight source-grounded case studies with distinct uncropped visuals, exact recording coverage, click-to-load consent, and mobile evidence ordering.')
} finally { await browser.close(); server.close(); await once(server, 'close') }
