import assert from 'node:assert/strict'
import { once } from 'node:events'
import { chromium } from 'playwright'
import { createServer as createViteServer } from 'vite'
import { createAppServer } from '../server.mjs'

const vite = await createViteServer({ server: { middlewareMode: true, hmr: false }, appType: 'custom' })
let experienceRecords
let projectRecords
let awardRecords
try {
  const [identity, registry, curated] = await Promise.all([
    vite.ssrLoadModule('/src/identityContent.ts'),
    vite.ssrLoadModule('/src/contentRegistry.ts'),
    vite.ssrLoadModule('/src/curatedExperience.ts'),
  ])
  ;({ experienceRecords, projectRecords, awardRecords } = identity)
  assert.deepEqual([experienceRecords.length, projectRecords.length, awardRecords.length], [30, 30, 31])
  for (const [label, records] of [['experience', experienceRecords], ['project', projectRecords], ['award', awardRecords]]) {
    assert.equal(new Set(records.map(record => record.id)).size, records.length, `${label} IDs are unique`)
    assert.ok(records.every(record => record.sources.length > 0), `${label} records keep sources`)
  }
  const registryIds = new Set(registry.publicContentRegistry.map(item => item.id))
  assert.ok(experienceRecords.every(record => registryIds.has(`experience:${record.id}`)))
  assert.ok(projectRecords.filter(record => !record.id.startsWith('software-')).every(record => registryIds.has(`project:${record.id}`)))
  assert.ok(awardRecords.every(record => registryIds.has(`award:${record.id}`)))
  assert.equal(curated.curatedExperiences.length, 10)
  assert.ok(curated.curatedExperiences.flatMap(item => item.sourceIds).every(id => experienceRecords.some(record => record.id === id)))
  console.log('PASS identity coverage: 30 experience, 30 project, and 31 award source records remain unique, sourced, and resolvable; 10 curated cards map to valid source IDs.')
} finally { await vite.close() }

const server = createAppServer(); server.listen(0, '127.0.0.1'); await once(server, 'listening')
const base = `http://127.0.0.1:${server.address().port}`
const browser = await chromium.launch({ headless: true, channel: process.env.PLAYWRIGHT_CHANNEL || 'chrome' })
try {
  for (const width of [1440, 390]) {
    const page = await browser.newPage({ viewport: { width, height: 900 } })
    await page.goto(`${base}/about`)
    assert.equal(await page.locator('.curated-experience-list > li').count(), 10)
    assert.equal(await page.locator('#recognition-about article').count(), 3)
    assert.match(await page.locator('#timeline').innerText(), /full experience record/i)
    assert.doesNotMatch(await page.locator('#timeline').innerText(), /merge|source IDs|database/i)
    await page.goto(`${base}/experience#western-lawson`)
    await page.waitForFunction(() => document.activeElement?.dataset.recordId === 'experience:western-lawson')
    assert.match(page.url(), /\/archive\?category=Experience#archive-experience-western-lawson$/)
    assert.equal(await page.locator('[data-record-id="experience:western-lawson"]').count(), 1)
    await page.goto(`${base}/awards#padi-advanced-open-water`)
    await page.waitForFunction(() => document.activeElement?.dataset.recordId === 'award:padi-advanced-open-water')
    assert.match(page.url(), /\/archive\?category=Award#archive-award-padi-advanced-open-water$/)
    assert.equal(await page.locator('[data-record-id="award:padi-advanced-open-water"]').count(), 1)
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true)
    await page.close()
  }
  console.log('PASS identity UI: About owns the 10-card short version; legacy experience and award URLs resolve to complete Archive records at desktop and mobile widths.')
} finally { await browser.close(); server.close(); await once(server, 'close') }
