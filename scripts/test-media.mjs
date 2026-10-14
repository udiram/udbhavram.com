import assert from 'node:assert/strict'
import { once } from 'node:events'
import { chromium } from 'playwright'
import media from '../src/mediaContent.json' with { type: 'json' }
import { createAppServer } from '../server.mjs'

const articleGroups = new Set(media.articles.map(article => article.story_group))
const expected = articleGroups.size + media.videos.length + media.profiles.length + media.writing.length
assert.equal(expected, 26)
assert.ok(media.videos.every(video => video.url && video.title && video.summary))
assert.ok(media.articles.every(article => article.url && article.publisher && article.summary))

const server = createAppServer(); server.listen(0, '127.0.0.1'); await once(server, 'listening')
const base = `http://127.0.0.1:${server.address().port}`
const browser = await chromium.launch({ headless: true, channel: process.env.PLAYWRIGHT_CHANNEL || 'chrome' })
try {
  const page = await browser.newPage({ viewport: { width: 1200, height: 900 } })
  await page.goto(`${base}/media`)
  assert.equal(await page.locator('.archive-card').count(), expected)
  assert.equal(await page.locator('.archive-card details').count(), expected)
  assert.equal(await page.locator('.archive-card img').evaluateAll(images => images.every(image => image.loading === 'lazy')), true)
  await page.locator('#archive-search').fill('Formula LGB')
  assert.ok(await page.locator('.archive-card').count() > 0)
  await page.goto(`${base}/about`)
  assert.ok(await page.locator('.media-related a').count() > 0, 'selected media remains folded into About')
  console.log('PASS media: 26 deduplicated source records live in the Archive, remain searchable and lazy-loaded, and selected public stories remain on About.')
} finally { await browser.close(); server.close(); await once(server, 'close') }
