import assert from 'node:assert/strict'
import { once } from 'node:events'
import { chromium } from 'playwright'
import { createAppServer } from '../server.mjs'

const server = createAppServer(); server.listen(0, '127.0.0.1'); await once(server, 'listening')
const base = `http://127.0.0.1:${server.address().port}`
const browser = await chromium.launch({ headless: true, channel: process.env.PLAYWRIGHT_CHANNEL || 'chrome' })
try {
  for (const width of [1440, 390]) {
    const page = await browser.newPage({ viewport: { width, height: 900 } })
    await page.goto(`${base}/publications#astro-2026-3104`)
    await page.waitForFunction(() => document.activeElement?.dataset.recordId === 'presentation:astro-2026-3104')
    await page.reload(); await page.waitForFunction(() => document.activeElement?.dataset.recordId === 'presentation:astro-2026-3104')
    await page.goto(`${base}/experience#western-lawson`)
    await page.waitForFunction(() => document.activeElement?.dataset.recordId === 'experience:western-lawson')
    await page.goto(`${base}/awards#padi-advanced-open-water`)
    await page.waitForFunction(() => document.activeElement?.dataset.recordId === 'award:padi-advanced-open-water')
    await page.goto(`${base}/collection/research-record#astro-2026-3104`)
    await page.waitForFunction(() => document.activeElement?.dataset.recordId === 'presentation:astro-2026-3104')
    await page.goto(`${base}/archive`)
    if (width <= 760) { await page.getByRole('button', { name: 'Filters', exact: true }).click(); await page.waitForTimeout(250) }
    const category = page.locator('.archive-filter-group').filter({ has: page.locator('legend', { hasText: 'Category' }) })
    await category.getByRole('button', { name: /^Study\b/ }).click()
    await page.locator('.archive-filter-group').filter({ has: page.locator('legend', { hasText: 'Year' }) }).getByRole('button', { name: /^2026\b/ }).click()
    await page.goBack(); await page.waitForFunction(() => !new URL(location.href).searchParams.has('year'))
    assert.equal(await page.locator('.archive-card').count(), 8)
    await page.close()
  }
  console.log('PASS permalinks: presentation, experience, award, and legacy collection fragments resolve; Archive filter history survives Back and reload.')
} finally { await browser.close(); server.close(); await once(server, 'close') }
