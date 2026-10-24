import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import path from 'node:path'
import { once } from 'node:events'
import { chromium } from 'playwright'
import { createAppServer } from '../server.mjs'

const server = createAppServer()
server.listen(0, '127.0.0.1')
await once(server, 'listening')
const base = `http://127.0.0.1:${server.address().port}`
const browser = await chromium.launch({ headless: true, channel: process.env.PLAYWRIGHT_CHANNEL || 'chrome' })
const evidence = process.env.EVIDENCE_DIR
if (evidence) await fs.mkdir(evidence, { recursive: true })

try {
  for (const width of [1440, 820, 390, 320]) {
    const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: width === 320 ? 'reduce' : 'no-preference' })
    const page = await context.newPage()
    const errors = []
    page.on('pageerror', error => errors.push(error.message))
    await page.goto(base)

    assert.match(await page.locator('.hero h1').innerText(), /intersection of physics, medicine, and software/)
    assert.match(await page.locator('.hero-copy p').innerText(), /Medical Physics PhD student at UW–Madison/)
    assert.equal(await page.locator('.hero a[href="#featured-work"]').count(), 1)
    assert.equal(await page.locator('#featured-work .home-software-project').count(), 3)
    assert.deepEqual(await page.locator('.home-software-project h3').allTextContents(), ['CT Forge', 'VoxelWeave Designer', 'RSNA Explorer'])
    assert.match(await page.locator('.desk-strip').innerText(), /Editorial snapshot · October 24, 2026/i)
    assert.match(await page.locator('.desk-strip').innerText(), /selection of public projects, as of October 2026/i)
    assert.match(await page.locator('.curated-motorsport').innerText(), /Arrow McLaren IndyCar/)
    for (const selector of ['.ct-demo', '.home-software', '.desk-strip']) {
      assert.doesNotMatch(await page.locator(selector).innerText(), /Motorsport|racing/i, `${selector} does not add a new racing promotion`)
    }
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, `home has no overflow at ${width}px`)

    const firstReveal = page.locator('#featured-work .home-reveal').first()
    if (width === 320) {
      assert.equal(await page.evaluate(() => matchMedia('(prefers-reduced-motion: reduce)').matches), true)
      assert.equal(await firstReveal.evaluate(element => getComputedStyle(element).opacity), '1', 'reduced-motion content remains visible before entry')
      assert.equal(await firstReveal.evaluate(element => getComputedStyle(element).animationName), 'none')
    } else {
      await page.waitForFunction(() => document.documentElement.classList.contains('home-motion-ready'))
      await page.waitForTimeout(750)
      assert.equal(await firstReveal.getAttribute('data-revealed'), null, 'below-fold motion waits for viewport entry')
      assert.equal(await firstReveal.evaluate(element => Number(getComputedStyle(element).opacity) < 0.1), true)
    }

    const primaryCta = page.locator('.hero a[href="#featured-work"]')
    await primaryCta.focus()
    await primaryCta.press('Enter')
    await page.waitForFunction(() => document.activeElement?.id === 'featured-work')
    assert.equal(await page.evaluate(() => location.hash), '#featured-work')
    await page.waitForFunction(() => document.querySelector('#featured-work .home-reveal')?.getAttribute('data-revealed') === 'true')
    assert.equal(await firstReveal.getAttribute('data-revealed'), 'true', 'featured work reveals on entry')
    await page.keyboard.press('Tab')
    assert.equal(await page.evaluate(() => document.activeElement?.classList.contains('home-software-image')), true, 'next Tab proceeds into featured work')

    const slider = page.getByRole('slider', { name: 'Slice' })
    await slider.focus()
    const initialSlice = Number(await slider.inputValue())
    await slider.press('ArrowRight')
    assert.equal(Number(await slider.inputValue()), initialSlice + 1, 'keyboard changes the phantom slice')
    assert.equal(await page.locator('.ct-canvas').getAttribute('data-slice'), String(initialSlice + 1), 'slice state reaches the rendered phantom')

    if (width === 1440) {
      const geometrySignatures = new Set()
      for (const value of ['0', '48', '95']) {
        await slider.fill(value)
        const geometry = await page.locator('.ct-canvas').evaluate(element => {
          const fillPath = element.querySelector('[data-structure="right-organ"]')
          const contourPath = element.querySelector('[data-contour-structure="right-organ"]')
          const fillEllipse = element.querySelector('[data-structure="left-organ"]')
          const contourEllipse = element.querySelector('[data-contour-structure="left-organ"]')
          return {
            fillPath: fillPath?.getAttribute('d'),
            contourPath: contourPath?.getAttribute('d'),
            fillCx: fillEllipse?.getAttribute('cx'),
            contourCx: contourEllipse?.getAttribute('cx'),
            fillCy: fillEllipse?.getAttribute('cy'),
            contourCy: contourEllipse?.getAttribute('cy'),
          }
        })
        assert.equal(geometry.fillPath, geometry.contourPath, `right contour matches its structure at slice ${value}`)
        assert.equal(geometry.fillCx, geometry.contourCx, `left contour x matches at slice ${value}`)
        assert.equal(geometry.fillCy, geometry.contourCy, `left contour y matches at slice ${value}`)
        geometrySignatures.add(JSON.stringify(geometry))
      }
      assert.equal(geometrySignatures.size, 3, 'synthetic geometry changes at both endpoints and midpoint')
      await slider.fill('48')
    }

    const contour = page.getByRole('checkbox', { name: 'Show contour' })
    assert.equal(await contour.isChecked(), true)
    await contour.focus()
    await contour.press('Space')
    assert.equal(await contour.isChecked(), false)
    assert.equal(await page.locator('.ct-contour').count(), 0, 'contour control changes the rendered overlay')
    await page.locator('.contour-control').click({ position: { x: 62, y: 11 } })
    assert.equal(await contour.isChecked(), true, 'pointer interaction restores the contour')

    const box = await slider.boundingBox()
    assert.ok(box && box.width > 90, 'range control has a usable pointer target')
    assert.equal(await slider.isEnabled(), true, 'native range remains available to pointer and touch input')

    assert.deepEqual(errors, [])
    if (evidence) await page.screenshot({ path: path.join(evidence, `homepage-${width}-light.png`), fullPage: true })
    await context.close()
  }

  const noJsContext = await browser.newContext({ viewport: { width: 390, height: 900 }, javaScriptEnabled: false })
  const noJsPage = await noJsContext.newPage()
  await noJsPage.goto(base)
  assert.match(await noJsPage.locator('.hero h1').innerText(), /intersection of physics, medicine, and software/)
  assert.equal(await noJsPage.locator('#featured-work .home-reveal').first().evaluate(element => getComputedStyle(element).opacity), '1', 'no-JS homepage content remains visible')
  await noJsContext.close()

  console.log('PASS homepage: hero focus flow, aligned synthetic CT geometry and controls, viewport entry/no-JS/reduced-motion behavior, source-backed projects, preserved motorsport, dated desk strip, and 1440/820/390/320 responsive layouts.')
} finally {
  await browser.close()
  server.close()
  await once(server, 'close')
}
