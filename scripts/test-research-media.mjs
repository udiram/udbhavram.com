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
  const hashes = await Promise.all(studies.filter(study => study.image).map(async study => createHash('sha256').update(await readFile(`public${study.image.src}`)).digest('hex')))
  assert.equal(new Set(hashes).size, studies.length - 1)
  assert.equal(studies.find(study => study.slug === 'amyloid-membranes').image, undefined, 'the amyloid study reproduces no figure')
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
  assert.equal(await page.locator('.study-index-row').filter({ has: page.locator('h2 a[href="/research/organ-segmentation"]') }).locator('.organ-figure-gallery img').count(), 3, 'organ study index shows exactly three published figures')
  assert.match(await page.locator('#journal-articles').innerText(), /This preprint has not been peer reviewed/)
  for (const study of studies) {
    await page.goto(`${base}/research/${study.slug}`)
    assert.equal(await page.locator('.study-prose .prose').count(), study.sections.length + 1)
    if (study.slug === 'organ-segmentation') {
      assert.deepEqual(await page.locator('.study-hero .organ-figure-gallery img').evaluateAll(images => images.map(image => image.getAttribute('src'))), [2, 3, 4].map(figure => `/assets/sourced/organ-segmentation-figure-${figure}.jpg`))
    } else if (study.image) {
      assert.equal(await page.locator('.study-hero img').first().getAttribute('src'), study.image.src)
      assert.equal(await page.locator('.study-hero img').first().evaluate(element => getComputedStyle(element).objectFit), 'contain', `${study.slug} art is not cropped`)
    }
    assert.ok(await page.locator('.research-material-shelf .research-material-card').count(), `${study.slug} has directly linked public materials`)
    const expected = media.videos.filter(video => video.related_pages.includes(`/research/${study.slug}`))
    assert.equal(await page.locator('.study-prose .study-video-set [data-media-video]').count(), expected.length, `${study.slug} exposes every related recording`)
    for (const video of expected) {
      const card = page.locator(`#${video.id}`)
      assert.equal(await card.locator(`img[src="/assets/media/video-thumbnails/${video.video_id}.jpg"]`).count(), 1)
      assert.equal(await card.locator('iframe').count(), 0, 'YouTube is not embedded before consent')
      assert.equal(await card.locator(`a[href="${video.url}"]`).count(), 1)
    }
  }
  await page.goto(`${base}/research/adaptive-breast-radiotherapy`)
  assert.equal(await page.locator('.research-material-card img[src="/assets/sourced/astro-2026-contouring-uncertainty-poster.webp"]').count(), 1, 'ASTRO uses the exact ASTRO poster')
  assert.equal(await page.locator('.research-material-card img[src="/assets/sourced/aapm-2026-adaptive-poster.jpg"]').count(), 1, 'AAPM remains a distinct event version')
  assert.match(await page.locator('.study-prose').innerText(), /392 edits/)
  assert.match(await page.locator('.study-prose').innerText(), /2 mm for radiation oncologists and physicists/)
  await page.goto(`${base}/research/brain-metastases-follow-up`)
  assert.equal(await page.locator('.study-hero img').first().getAttribute('src'), '/assets/sourced/brain-followup-published-figure-5.jpg')
  await page.goto(`${base}/research/amyloid-membranes`)
  // The amyloid study is a citation card in the same frame: no reproduced figure, no lightbox.
  const citation = page.locator('.study-hero .pub-citation')
  assert.equal(await page.locator('.study-hero img').count(), 0)
  assert.equal(await citation.getByRole('button').count(), 0)
  assert.equal(await citation.locator('.pub-tag').innerText(), 'Publication')
  assert.match(await citation.locator('.pub-citation-title').innerText(), /β-Carotene, and Epigallocatechin Gallate \(EGCG\) on Amyloid-β\s*25–35 Aggregation in Synthetic Brain Membranes$/)
  assert.equal(await citation.locator('.pub-citation-authors').innerText(), 'Gastaldo, Himbert, Ram, Rheinstädter')
  assert.equal(await citation.locator('.pub-citation-authors strong').innerText(), 'Ram')
  assert.equal(await citation.getByRole('link', { name: 'Read the paper' }).getAttribute('href'), 'https://doi.org/10.1002/mnfr.202000632')
  assert.deepEqual(await citation.locator('tbody th').allInnerTexts(), ['Resveratrol', 'Caffeine', 'β-Carotene', 'EGCG'])
  assert.doesNotMatch(await page.content(), /amyloid-paper-figure-4/)
  // Published figures share one frame and open in a focus-trapped lightbox.
  for (const [slug, heading, credit] of [
    ['brain-metastases-follow-up', 'Figure 5 · Contours carried into follow-up MRI', /doi:10\.1093\/nop\/npaf126 · CC BY-NC 4\.0/],
  ]) {
    await page.goto(`${base}/research/${slug}`)
    const figure = page.locator('.study-hero .pub-figure')
    assert.equal(await figure.locator('.pub-head strong').innerText(), heading)
    assert.match(await figure.locator('.pub-credit').innerText(), credit)
    const plate = figure.getByRole('button', { name: /^Open Figure \d full size$/ })
    assert.equal(await plate.evaluate(element => getComputedStyle(element).backgroundColor), 'rgb(255, 255, 255)', 'the plate stays white')
    await plate.click()
    const dialog = page.getByRole('dialog', { name: heading })
    await dialog.waitFor()
    assert.equal(await dialog.evaluate(element => element.matches(':modal')), true, 'lightbox is modal, so focus stays inside it')
    await dialog.getByRole('button', { name: 'Zoom in' }).click()
    await dialog.getByRole('button', { name: /Zoom level 12\d percent/ }).waitFor()
    await page.keyboard.press('Escape')
    await dialog.waitFor({ state: 'detached' })
    assert.equal(await plate.evaluate(element => element === document.activeElement), true, 'focus returns to the plate')
  }
  await page.goto(`${base}/research/amyloid-membranes`)
  assert.equal(await page.getByRole('table', { name: 'Reading guide: what the paper reports for each compound' }).locator('tbody tr').count(), 4)
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
    const hero = page.locator(study.image ? '.study-hero img' : '.study-hero .pub-citation-mat').first()
    if (study.image) await hero.evaluate(async element => { if (!element.complete) await new Promise(resolve => element.addEventListener('load', resolve, { once: true })); await element.decode?.() })
    const box = await hero.boundingBox()
    assert.ok(box && box.y < 844 && box.y + box.height > 0, `${study.slug} art enters the first mobile viewport`)
    assert.equal(await page.locator('.study-sidebar').evaluate(element => element.getBoundingClientRect().top > document.querySelector('.study-prose').getBoundingClientRect().top), true, `${study.slug} navigation follows evidence on mobile`)
  }
  assert.deepEqual(errors, [])
  console.log('PASS research: eight source-grounded case studies expose direct paper/event/recording/code materials; ASTRO and AAPM remain distinct, published figures replace schematics, organ segmentation shows exactly three figures, and recording consent/mobile ordering remain intact.')
} finally { await browser.close(); server.close(); await once(server, 'close') }
