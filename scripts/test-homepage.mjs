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
const ctManifest = JSON.parse(await fs.readFile(new URL('../public/assets/ct-spleen/manifest.json', import.meta.url), 'utf8'))

try {
  for (const width of [1440, 1024, 768, 390, 320]) {
    const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: width === 320 ? 'reduce' : 'no-preference' })
    const page = await context.newPage()
    const errors = []
    page.on('pageerror', error => errors.push(error.message))
    await page.goto(base)

    assert.match(await page.locator('.hero h1').innerText(), /I’m Udi\.\s*I build research tools\./)
    assert.match(await page.locator('.hero-copy p').innerText(), /Medical Physics PhD student at UW-Madison/)
    assert.equal(await page.locator('.hero a[href="#featured-work"]').count(), 1)
    assert.equal(await page.locator('#featured-work .home-software-project').count(), 3)
    assert.deepEqual(await page.locator('.home-software-project h3').allTextContents(), ['CT Forge', 'VoxelWeave Designer', 'RSNA Explorer'])
    assert.match(await page.locator('.desk-strip').innerText(), /Public project snapshot, October 24, 2026/i)
    assert.match(await page.locator('.curated-motorsport').innerText(), /Arrow McLaren IndyCar/)
    for (const selector of ['.ct-demo', '.home-software', '.desk-strip']) {
      assert.doesNotMatch(await page.locator(selector).innerText(), /Motorsport|racing/i, `${selector} does not add a new racing promotion`)
    }
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, `home has no overflow at ${width}px`)

    const firstReveal = page.locator('#featured-work .home-reveal').first()
    assert.equal(await firstReveal.evaluate(element => getComputedStyle(element).opacity), '1', 'below-fold work stays visible without an observer')
    const headerHeight = await page.locator('.site-header').evaluate(element => element.getBoundingClientRect().height)
    assert.ok(headerHeight <= 80, 'header remains compact')
    if (width >= 1024) {
      const headingLines = await page.locator('.hero h1').evaluate(element => element.getBoundingClientRect().height / Number.parseFloat(getComputedStyle(element).lineHeight))
      assert.ok(headingLines <= 2.1, 'desktop heading fits two lines')
    }
    const heroAction = await page.locator('.hero a.button').boundingBox()
    assert.ok(heroAction.y + heroAction.height < 900, 'primary action is visible in the initial viewport')

    const primaryCta = page.locator('.hero a[href="#featured-work"]')
    await primaryCta.focus()
    await primaryCta.press('Enter')
    await page.waitForFunction(() => document.activeElement?.id === 'featured-work')
    assert.equal(await page.evaluate(() => location.hash), '#featured-work')
    await page.keyboard.press('Tab')
    assert.equal(await page.evaluate(() => document.activeElement?.classList.contains('home-software-image')), true, 'next Tab proceeds into featured work')

    const slider = page.getByRole('slider', { name: 'Slice' })
    await slider.focus()
    const initialSlice = Number(await slider.inputValue())
    await slider.press('ArrowRight')
    assert.equal(Number(await slider.inputValue()), initialSlice + 1, 'keyboard changes the real CT slice')
    assert.equal(await page.locator('.ct-canvas').getAttribute('data-slice'), String(initialSlice + 1), 'slice state reaches the rendered CT')
    assert.equal(await slider.getAttribute('max'), String(ctManifest.frames.length - 1))
    assert.match(await page.locator('.ct-figure figcaption').innerText(), /Medical Segmentation Decathlon/)
    assert.match(await page.locator('.ct-demo-copy').innerText(), /not a model prediction/)

    if (width === 1440) {
      const failedSrc = ctManifest.frames[0].src
      await page.route(`**${failedSrc}`, route => route.abort())
      await slider.fill('0')
      await page.getByRole('alert').waitFor()
      assert.match(await page.getByRole('alert').innerText(), /could not load/)
      await page.unroute(`**${failedSrc}`)
      await page.getByRole('button', { name: 'Try again' }).click()
      await page.locator('.ct-canvas[data-loading="false"] img').waitFor()

      for (const value of ['0', String(ctManifest.display.defaultIndex), String(ctManifest.frames.length - 1)]) {
        await slider.fill(value)
        await page.locator('.ct-canvas[data-loading="false"] img').waitFor()
        const renderedPaths = await page.locator('.ct-contour path').evaluateAll(paths => paths.map(path => path.getAttribute('d')))
        assert.deepEqual(renderedPaths, ctManifest.frames[Number(value)].contours.map(contour => contour.d), `reference paths match the published manifest at viewer slice ${value}`)
        assert.equal(new URL(await page.locator('.ct-canvas img').getAttribute('src'), base).pathname, ctManifest.frames[Number(value)].src)
        assert.equal(await page.locator('.ct-canvas').getAttribute('data-source-slice'), String(ctManifest.frames[Number(value)].sourceSlice))
      }
      await slider.fill(String(ctManifest.display.defaultIndex))
      await page.locator('.ct-canvas[data-loading="false"] img').waitFor()

      // Window presets: a real radio group, also reachable on keys 1 to 3 while the viewer has focus.
      const defaultFrame = ctManifest.frames[ctManifest.display.defaultIndex]
      const presets = page.getByRole('radiogroup', { name: 'Window preset' })
      assert.deepEqual(await presets.getByRole('radio').evaluateAll(inputs => inputs.map(input => input.value)), ctManifest.display.presets.map(preset => preset.id))
      await slider.focus()
      await page.keyboard.press('3')
      await page.locator('.ct-canvas[data-preset="bone"][data-loading="false"]').waitFor()
      assert.equal(new URL(await page.locator('.ct-canvas img').getAttribute('src'), base).pathname, defaultFrame.sources.bone)
      assert.match(await page.locator('.ct-mark-window').innerText(), /W 1800 · L 400/)
      await presets.getByRole('radio', { name: 'Narrow' }).click()
      await page.locator('.ct-canvas[data-preset="narrow"][data-loading="false"]').waitFor()
      await slider.focus()
      await slider.press('PageDown')
      assert.equal(Number(await slider.inputValue()), ctManifest.display.defaultIndex - 5, 'PageDown steps five slices')
      await slider.press('End')
      assert.equal(Number(await slider.inputValue()), ctManifest.frames.length - 1)
      await slider.fill(String(ctManifest.display.defaultIndex))
      await page.keyboard.press('1')
      await page.locator('.ct-canvas[data-preset="soft"][data-loading="false"]').waitFor()
      assert.match(await page.locator('.ct-readout').innerText(), new RegExp(`Slice ${ctManifest.display.defaultIndex + 1} / ${ctManifest.frames.length} · z ${defaultFrame.zMm.toFixed(1)} mm`))

      // HU readout: the stored voxel value, fetched on the first pointer move.
      // Focus moves scroll the page smoothly; measure the image only once it is still.
      await page.evaluate(async () => { let last = -1; while (last !== scrollY) { last = scrollY; await new Promise(resolve => setTimeout(resolve, 120)) } })
      const stage = await page.locator('.ct-image-stage').boundingBox()
      const crop = ctManifest.display.crop
      await page.mouse.move(stage.x + (388.5 / crop.w) * stage.width, stage.y + ((296.5 - crop.y0) / crop.h) * stage.height)
      await page.locator('.ct-hu').waitFor()
      assert.equal(await page.locator('.ct-hu').innerText(), '122 HU · spleen', 'readout is the source voxel inside the reference label')
      await page.mouse.move(stage.x + (10.5 / crop.w) * stage.width, stage.y + stage.height / 2)
      await page.waitForFunction(() => /^-\d+ HU$/.test(document.querySelector('.ct-hu')?.textContent ?? ''))
      await page.keyboard.press('Escape')
      assert.equal(await page.locator('.ct-hu').count(), 0, 'Escape hides the readout')
      await page.mouse.move(0, 0)
    }

    const contour = page.getByRole('switch', { name: 'Show contour' })
    assert.equal(await contour.isChecked(), true)
    await contour.focus()
    await contour.press('Space')
    assert.equal(await contour.isChecked(), false)
    assert.equal(await page.locator('.ct-contour').count(), 0, 'contour control changes the rendered overlay')
    await page.locator('.contour-control').click({ position: { x: 62, y: 22 } })
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
  assert.match(await noJsPage.locator('.hero h1').innerText(), /I’m Udi\.\s*I build research tools\./)
  assert.equal(await noJsPage.locator('#featured-work .home-reveal').first().evaluate(element => getComputedStyle(element).opacity), '1', 'no-JS homepage content remains visible')
  assert.equal(await noJsPage.locator('.ct-viewer img').getAttribute('src'), ctManifest.frames[ctManifest.display.defaultIndex].src, 'no-JS output includes the default real CT image')
  assert.ok(await noJsPage.locator('.ct-contour path').count(), 'no-JS output includes the matched reference contour')
  await noJsContext.close()

  console.log('PASS homepage: hero focus flow, exact real CT/reference-mask frames, loading failure/retry, keyboard/pointer controls, no-JS/reduced-motion behavior, source-backed projects, preserved motorsport, dated desk strip, and 1440/1024/768/390/320 responsive layouts.')
} finally {
  await browser.close()
  server.close()
  await once(server, 'close')
}
