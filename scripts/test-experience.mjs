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
    const errors = []; page.on('pageerror', error => errors.push(error.message))
    await page.goto(base)
    assert.deepEqual(await page.locator('#main-navigation a').allTextContents(), ['Home', 'About', 'Research', 'Software', 'Archive'])
    assert.deepEqual((await page.locator('.hero a').allTextContents()).map(text => text.trim()), ['Explore my work', 'About me'])
    assert.equal(await page.locator('.first-visit, .home-presentations, .workbench, .home-awards, .explore-more, .contact-section').count(), 0)
    assert.equal(await page.locator('.ct-demo, .home-software, .desk-strip').count(), 3)
    assert.equal(await page.locator('.home-software-project').count(), 3)
    assert.equal(await page.locator('.curated-research-grid > article').count(), 3)
    assert.match(await page.locator('.curated-motorsport').innerText(), /Arrow McLaren IndyCar/)
    assert.deepEqual(await page.locator('.page-footer nav a').allTextContents(), ['Email', 'GitHub', 'LinkedIn', 'Google Scholar', 'Archive'])
    await page.goto(`${base}/about`)
    assert.equal(await page.locator('.curated-experience-list > li').count(), 10)
    await page.goto(`${base}/software`)
    const softwareText = await page.locator('main').innerText()
    for (const name of ['CT Forge', 'ProtocolIQ', 'RadKev', 'VoxelWeave Designer', 'MedPhysBench', 'RSNA Explorer']) assert.ok(softwareText.includes(name))
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true)
    assert.deepEqual(errors, [])
    await page.close()
  }
  console.log('PASS curated site: short home, exact navigation, shared contact footer, 10-card About experience, software ownership, and responsive overflow.')
} finally { await browser.close(); server.close(); await once(server, 'close') }
