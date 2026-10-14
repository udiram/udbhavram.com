import assert from 'node:assert/strict'
import { once } from 'node:events'
import { chromium } from 'playwright'
import { createServer as createViteServer } from 'vite'
import { createAppServer } from '../server.mjs'

const vite = await createViteServer({ server: { middlewareMode: true, hmr: false }, appType: 'custom' })
let registry
try {
  const content = await vite.ssrLoadModule('/src/contentRegistry.ts')
  const search = await vite.ssrLoadModule('/src/searchRanking.ts')
  registry = content.publicContentRegistry
  assert.equal(registry.length, 234)
  assert.equal(new Set(registry.map(item => item.id)).size, registry.length)
  assert.equal(search.rankContent('physician segmentation', 'All')[0]?.id, 'study:organ-segmentation')
  assert.ok(search.rankContent('RadKev', 'All').some(item => item.id === 'study:radkev'))
} finally { await vite.close() }

const server = createAppServer(); server.listen(0, '127.0.0.1'); await once(server, 'listening')
const base = `http://127.0.0.1:${server.address().port}`
const browser = await chromium.launch({ headless: true, channel: process.env.PLAYWRIGHT_CHANNEL || 'chrome' })
const errors = []
try {
  const context = await browser.newContext({ viewport: { width: 1200, height: 900 } })
  const page = await context.newPage(); page.on('pageerror', error => errors.push(error.message))
  await page.goto(base)
  assert.equal((await page.evaluate(() => performance.getEntriesByType('resource').filter(entry => entry.name.includes('SearchDialog')).length)), 0, 'search code is lazy')
  await page.getByRole('button', { name: 'Search site' }).click()
  assert.equal(await page.locator('#global-search').evaluate(element => element === document.activeElement), true)
  assert.equal(await page.locator('main').getAttribute('inert'), '')
  assert.equal(await page.locator('.header-inner').getAttribute('inert'), '')
  await page.locator('#global-search').fill('RadKev')
  assert.ok(await page.locator('[data-search-id="study:radkev"]').count() > 0)
  await page.locator('[data-search-id="study:radkev"] [data-save-id]').click()
  await page.keyboard.press('Escape')
  assert.equal(await page.getByRole('button', { name: 'Search site' }).evaluate(element => element === document.activeElement), true)
  assert.equal(await page.locator('main').getAttribute('inert'), null)
  await page.goto(`${base}/archive`)
  const saveIds = await page.locator('.archive-card [data-save-id]').evaluateAll(elements => elements.map(element => element.dataset.saveId))
  assert.equal(saveIds.length, registry.length)
  assert.deepEqual([...saveIds].sort(), registry.map(item => item.id).sort())
  await page.goto(`${base}/reading-list`)
  await page.locator('[data-reading-id="study:radkev"]').waitFor()
  await page.reload(); await page.locator('[data-reading-id="study:radkev"]').waitFor()
  await page.evaluate(() => Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: value => { window.__copied = value; return Promise.resolve() } } }))
  await page.getByRole('button', { name: 'Copy share link' }).click()
  assert.match(await page.evaluate(() => window.__copied), /reading-list\?list=study%3Aradkev/)

  const second = await context.newPage(); second.on('pageerror', error => errors.push(error.message))
  await second.goto(`${base}/reading-list`)
  await page.goto(base); await page.getByRole('button', { name: 'Search site' }).click(); await page.locator('#global-search').fill('ProtocolIQ')
  await page.locator('[data-search-id="software:protocoliq"] [data-save-id]').click()
  await second.locator('[data-reading-id="software:protocoliq"]').waitFor({ timeout: 5000 })
  const stored = await second.evaluate(() => localStorage.getItem('udbhav-reading-list:v1'))
  await second.goto(`${base}/reading-list?list=paper%3Aethos-2025,paper%3Aethos-2025,unknown%3Aone`)
  assert.equal(await second.locator('.shared-list [data-reading-id="paper:ethos-2025"]').count(), 1)
  assert.equal(await second.evaluate(() => localStorage.getItem('udbhav-reading-list:v1')), stored, 'shared view does not mutate the saved list')
  await second.getByText(/duplicate ID was removed/).waitFor()
  await second.getByText(/unknown ID was ignored/).waitFor()
  await second.getByRole('button', { name: 'Merge into my list' }).click()
  await second.locator('section[aria-labelledby="own-list-title"] [data-reading-id="paper:ethos-2025"]').waitFor()
  await context.close()

  const blockedContext = await browser.newContext({ viewport: { width: 820, height: 900 } })
  await blockedContext.addInitScript(() => Object.defineProperty(window, 'localStorage', { configurable: true, get() { throw new Error('blocked') } }))
  const blocked = await blockedContext.newPage(); blocked.on('pageerror', error => errors.push(error.message))
  await blocked.goto(base); await blocked.getByRole('button', { name: 'Search site' }).click(); await blocked.locator('#global-search').fill('ProtocolIQ')
  await blocked.locator('[data-search-id="software:protocoliq"] [data-save-id]').click()
  await blocked.locator('[data-search-id="software:protocoliq"] .save-feedback').getByText(/only for this tab/).waitFor()
  await blockedContext.close()

  const mobileContext = await browser.newContext({ viewport: { width: 390, height: 844 } })
  const mobile = await mobileContext.newPage(); mobile.on('pageerror', error => errors.push(error.message))
  await mobile.goto(base); await mobile.getByRole('button', { name: 'Open navigation' }).click(); await mobile.keyboard.press('Meta+K')
  assert.equal(await mobile.locator('#main-navigation').getAttribute('class'), '')
  await mobile.locator('.search-dialog-footer a[href="/reading-list"]').focus(); await mobile.keyboard.press('Tab')
  assert.equal(await mobile.getByRole('button', { name: 'Close search' }).evaluate(element => element === document.activeElement), true, 'search dialog traps focus')
  await mobile.keyboard.press('Escape')
  assert.equal(await mobile.getByRole('button', { name: 'Search site' }).evaluate(element => element === document.activeElement), true)
  await mobileContext.close()
  assert.deepEqual(errors, [])
  console.log('PASS discovery: lazy modal accessibility, ranking, every Archive save identity, persistence, cross-tab storage, shared-list isolation/merge, blocked-storage fallback, and mobile focus handling.')
} finally { await browser.close(); server.close(); await once(server, 'close') }
