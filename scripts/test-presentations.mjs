import assert from 'node:assert/strict'
import { once } from 'node:events'
import { chromium } from 'playwright'
import { createAppServer } from '../server.mjs'
import inventory from '../src/presentations.json' with { type: 'json' }

const ids = inventory.events.map(event => event.id)
assert.equal(ids.length, 27)
assert.equal(new Set(ids).size, 27)
const server = createAppServer(); server.listen(0, '127.0.0.1'); await once(server, 'listening')
const base = `http://127.0.0.1:${server.address().port}`
const browser = await chromium.launch({ headless: true, channel: process.env.PLAYWRIGHT_CHANNEL || 'chrome' })
try {
  const page = await browser.newPage({ viewport: { width: 1200, height: 900 } })
  await page.goto(`${base}/research#presentations`)
  assert.deepEqual((await page.locator('#presentations [data-presentation-id]').evaluateAll(elements => elements.map(element => element.dataset.presentationId))).sort(), [...ids].sort())
  await page.goto(`${base}/publications`)
  assert.deepEqual((await page.locator('[data-presentation-id]').evaluateAll(elements => elements.map(element => element.dataset.presentationId))).sort(), [...ids].sort())
  await page.goto(`${base}/archive?category=Presentation`)
  assert.equal(await page.locator('.archive-card').count(), 27)
  assert.deepEqual((await page.locator('.archive-card').evaluateAll(elements => elements.map(element => element.id))).sort(), ids.map(id => `archive-presentation-${id}`).sort())
  console.log('PASS presentations: all 27 stable records render on Research, the legacy publications route, and the filtered Archive.')
} finally { await browser.close(); server.close(); await once(server, 'close') }
