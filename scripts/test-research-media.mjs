import assert from 'node:assert/strict'
import { once } from 'node:events'
import fs from 'node:fs/promises'
import path from 'node:path'
import { createHash } from 'node:crypto'
import { chromium } from 'playwright'
import { createAppServer } from '../server.mjs'
import media from '../src/mediaContent.json' with { type: 'json' }

const server = createAppServer()
server.listen(0, '127.0.0.1')
await once(server, 'listening')
const base = `http://127.0.0.1:${server.address().port}`
const browser = await chromium.launch({ headless: true, channel: process.env.PLAYWRIGHT_CHANNEL || 'chrome' })

const studies = [
  ['adaptive-breast-radiotherapy', '/assets/sourced/aapm-2026-adaptive-poster.jpg'],
  ['clinical-language-models', '/assets/optimized/aapm-2025-tg263-poster.webp'],
  ['radiosurgery-planning', '/assets/optimized/uab-presentation.webp'],
  ['organ-segmentation', '/assets/sourced/organ-segmentation-figure-3.jpg'],
  ['brain-metastases-follow-up', '/assets/sourced/brain-followup-workflow.svg'],
  ['lung-beam-energy', '/assets/sourced/aapm-2025-lung-6x10x-poster.webp'],
  ['amyloid-membranes', '/assets/sourced/amyloid-membrane-schematic.svg'],
]

const hashes = await Promise.all(studies.map(async ([, image]) => createHash('sha256').update(await fs.readFile(path.join('public', image.replace(/^\//, '')))).digest('hex')))
assert.equal(new Set(hashes).size, studies.length, 'every research visual has distinct file content')

try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } })
  const errors = []
  page.on('pageerror', error => errors.push(error.message))
  await page.goto(`${base}/research`)
  assert.equal(await page.locator('.research-hero img[src="/assets/sourced/aapm-2026-adaptive-poster.jpg"]').count(), 1, 'the first screen leads with the latest study poster')
  assert.equal(await page.locator('.research-index .study-index-row').count(), studies.length - 1)
  assert.equal(await page.locator('.research-index img[src="/assets/optimized/clinical-imaging-collage.webp"]').count(), 0, 'generic homepage collage is absent from research studies')
  assert.ok(await page.locator('.research-index').evaluate((index, explainer) => index.compareDocumentPosition(document.querySelector(explainer)) & Node.DOCUMENT_POSITION_FOLLOWING, '.research-explainer-band'), 'studies precede the explainer')

  for (const [slug, image] of studies) {
    if (slug === 'adaptive-breast-radiotherapy') continue
    const row = page.locator('.study-index-row', { has: page.locator(`a[href="/research/${slug}"]`) })
    assert.equal(await row.locator(`:scope > .page-photo img[src="${image}"]`).count(), 1, `${slug} uses its grounded visual`)
    assert.equal(await row.locator(`:scope > .page-photo img[src="${image}"]`).evaluate(element => getComputedStyle(element).objectFit), 'contain', `${slug} research art is not cropped on the index`)
    const path = `/research/${slug}`
    const expected = media.videos.filter(video => video.related_pages.includes(path))
    assert.equal(await row.locator('[data-media-video]').count(), expected.length, `${slug} exposes every applicable recording on the index`)
    for (const video of expected) {
      const card = row.locator(`#${video.id}`)
      assert.equal(await card.locator(`img[src="/assets/media/video-thumbnails/${video.video_id}.jpg"]`).count(), 1)
      assert.match(await card.innerText(), new RegExp(video.duration.replace(':', '\\:')))
      assert.equal(await card.locator(`a[href="${video.url}"]`).count(), 1)
      assert.equal(await card.locator('iframe').count(), 0, 'YouTube is not contacted before activation')
    }
  }

  const broad = media.videos.filter(video => video.related_pages.includes('/research'))
  assert.equal(await page.locator('.research-recordings [data-media-video]').count(), broad.length)

  for (const [slug, image] of studies) {
    await page.goto(`${base}/research/${slug}`)
    const heroArt = page.locator(`.study-hero > .page-photo img[src="${image}"]`)
    assert.equal(await heroArt.count(), 1)
    assert.equal(await heroArt.evaluate(element => getComputedStyle(element).objectFit), 'contain', `${slug} detail art is not cropped`)
    const expected = media.videos.filter(video => video.related_pages.includes(`/research/${slug}`))
    assert.equal(await page.locator('.study-prose .study-video-set [data-media-video]').count(), expected.length)
  }

  await page.setViewportSize({ width: 390, height: 844 })
  for (const [slug, image] of studies) {
    await page.goto(`${base}/research/${slug}`)
    const heroArt = page.locator(`.study-hero > .page-photo img[src="${image}"]`)
    await heroArt.evaluate(async element => { if (!element.complete) await new Promise(resolve => element.addEventListener('load', resolve, { once: true })); await element.decode?.() })
    const box = await heroArt.boundingBox()
    assert.ok(box && box.y < 844 && box.y + box.height > 0, `${slug} art enters the first 390x844 viewport`)
    assert.equal(await page.locator('.study-sidebar').evaluate(element => element.getBoundingClientRect().top > document.querySelector('.study-prose').getBoundingClientRect().top), true, `${slug} secondary navigation follows the main evidence on mobile`)
  }
  assert.deepEqual(errors, [])
  console.log('PASS research: seven unique grounded visuals, exact recording coverage, local previews, durations, fallbacks, and click-to-load privacy.')
  await page.close()
} finally {
  await browser.close()
  await new Promise(resolve => server.close(resolve))
}
