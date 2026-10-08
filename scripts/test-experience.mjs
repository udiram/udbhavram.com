import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import { once } from 'node:events'
import { chromium } from 'playwright'
import { createAppServer } from '../server.mjs'

let server
let base = process.env.TEST_ORIGIN
if (!base) {
  server = createAppServer()
  server.listen(0, '127.0.0.1')
  await once(server, 'listening')
  base = `http://127.0.0.1:${server.address().port}`
}

const browser = await chromium.launch({ headless: true, channel: process.env.PLAYWRIGHT_CHANNEL || 'chrome' })
try {
  for (const width of [1440, 390]) {
    const page = await browser.newPage({ viewport: { width, height: 900 } })
    const errors = []
    page.on('pageerror', error => errors.push(error.message))

    await page.goto(`${base}/`)
    assert.equal(await page.locator('.first-visit-stops li').count(), 4)
    assert.match(await page.locator('.first-visit').innerText(), /90-second route/i)
    await page.getByLabel('Looking for something specific?').fill('adaptive radiotherapy')
    await Promise.all([
      page.waitForURL(/\/collection\?q=adaptive(?:%20|\+)radiotherapy$/),
      page.getByRole('button', { name: 'Search the collection' }).click(),
    ])
    assert.match(await page.getByRole('status').innerText(), /matching entries/)

    await page.goto(`${base}/research`)
    assert.equal(await page.getByRole('button', { name: /check|decision/ }).count(), 3)
    await page.getByRole('button', { name: 'Meaning check' }).click()
    assert.equal(await page.getByRole('button', { name: 'Meaning check' }).getAttribute('aria-pressed'), 'true')
    assert.match(await page.locator('.explainer-result').innerText(), /Meaning still needs comparison/)
    await page.getByRole('button', { name: 'Meaning check' }).press('Tab')
    await page.getByRole('button', { name: 'Workflow decision' }).press('Enter')
    assert.match(await page.locator('.explainer-result').innerText(), /Route uncertain cases to review/)
    if (process.env.EVIDENCE_DIR) {
      await fs.mkdir(process.env.EVIDENCE_DIR, { recursive: true })
      await page.locator('.research-explainer').evaluate(element => element.scrollIntoView({ block: 'center', behavior: 'instant' }))
      await page.screenshot({ path: `${process.env.EVIDENCE_DIR}/research-explainer-${width}.png` })
    }

    await page.goto(`${base}/software`)
    assert.equal(await page.locator('.software-preview').count(), 8)
    const softwareText = (await page.locator('.software-showcase, #conference-tools').allInnerTexts()).join('\n')
    for (const name of ['CT Forge', 'ProtocolIQ', 'RadKev', 'VoxelWeave Designer', 'MedPhysBench', 'Glioblastoma analysis', 'RSNA Explorer', 'OncoScout2026', 'AAPM 2026 Explorer']) {
      assert.ok(softwareText.includes(name), `Software page retains ${name}`)
    }
    assert.match(await page.locator('#ct-forge').innerText(), /July 2026/)
    assert.match(await page.locator('#ct-forge').innerText(), /Historical interface; device status shown reflects the capture/)
    assert.match(await page.locator('#ct-forge').innerText(), /check compute and jobs/i)
    assert.match(await page.locator('.software-showcase').innerText(), /UW–MADISON/i)
    assert.match(await page.locator('#conference-tools').innerText(), /946 sessions and 6,931 presentations/)
    assert.equal(await page.locator('#ct-forge a[href="/media#writing"]').count(), 0)
    assert.equal(await page.locator('a[href="https://github.com/udiram/ProtocolIQ"]').count(), 0)
    for (const src of await page.locator('.software-preview img').evaluateAll(images => images.map(image => image.getAttribute('src')))) {
      assert.equal((await fetch(base + src)).status, 200)
    }
    if (process.env.EVIDENCE_DIR) {
      await page.locator('#ct-forge').evaluate(element => element.scrollIntoView({ block: 'start', behavior: 'instant' }))
      await page.waitForFunction(() => [...document.querySelectorAll('#ct-forge img')].every(image => image.complete && image.naturalWidth > 0))
      await page.screenshot({ path: `${process.env.EVIDENCE_DIR}/software-ct-forge-${width}.png` })
      await page.locator('#conference-tools').evaluate(element => element.scrollIntoView({ block: 'start', behavior: 'instant' }))
      await page.waitForFunction(() => [...document.querySelectorAll('#conference-tools img')].every(image => image.complete && image.naturalWidth > 0))
      await page.screenshot({ path: `${process.env.EVIDENCE_DIR}/software-conference-${width}.png` })
    }
    await page.goto(`${base}/beyond`)
    assert.equal(await page.locator('.signature-pursuit img').count(), 2)
    assert.match(await page.locator('.signature-pursuits').innerText(), /Scuba diving/)
    assert.match(await page.locator('.signature-pursuits').innerText(), /Equestrian life/)
    if (process.env.EVIDENCE_DIR) {
      await page.locator('.signature-pursuits').evaluate(element => element.scrollIntoView({ block: 'start', behavior: 'instant' }))
      await page.screenshot({ path: `${process.env.EVIDENCE_DIR}/personal-stories-${width}.png` })
    }
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true)
    assert.deepEqual(errors, [])
    await page.close()
    console.log(`PASS ${width}px: first-visit route/search, research review interaction, software evidence labels/assets, and overflow.`)
  }
} finally {
  await browser.close()
  if (server) { server.close(); await once(server, 'close') }
}
