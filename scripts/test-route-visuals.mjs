import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import path from 'node:path'
import { once } from 'node:events'
import { chromium } from 'playwright'
import { createAppServer } from '../server.mjs'

const server = createAppServer(); server.listen(0, '127.0.0.1'); await once(server, 'listening')
const base = `http://127.0.0.1:${server.address().port}`
const browser = await chromium.launch({ headless: true, channel: process.env.PLAYWRIGHT_CHANNEL || 'chrome' })
const routes = ['/', '/about', '/research', '/research/radkev', '/software', '/archive', '/missing-page']
const errors = []
const evidence = process.env.EVIDENCE_DIR
if (evidence) await fs.mkdir(evidence, { recursive: true })
try {
  for (const width of [1440, 820, 390]) {
    for (const theme of ['light', 'dark']) {
      const context = await browser.newContext({ viewport: { width, height: 900 } })
      await context.addInitScript(value => { if (!localStorage.getItem('udbhav-theme')) localStorage.setItem('udbhav-theme', value) }, theme)
      const page = await context.newPage()
      page.on('pageerror', error => errors.push(`${width}/${theme}: ${error.message}`))
      for (const route of routes) {
        await page.goto(base + route)
        assert.ok((await page.locator('h1').first().innerText()).trim(), `${route} has a visible page heading`)
        assert.equal(await page.locator('html').getAttribute('data-theme'), theme, `${route} restores ${theme} from localStorage`)
        assert.equal(await page.locator('.page-footer').count(), 1, `${route} has the shared footer`)
        assert.equal(await page.locator('vite-error-overlay').count(), 0, `${route} has no framework overlay`)
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, `${route} has no horizontal overflow at ${width}px`)
        await page.evaluate(async () => {
          document.querySelectorAll('img').forEach(image => { image.loading = 'eager' })
          await Promise.all([...document.images].map(async image => {
            if (!image.complete) await new Promise(resolve => { image.addEventListener('load', resolve, { once: true }); image.addEventListener('error', resolve, { once: true }) })
            if (image.naturalWidth > 0) await image.decode?.()
          }))
        })
        assert.deepEqual(await page.locator('img').evaluateAll(images => images.filter(image => !image.complete || image.naturalWidth === 0).map(image => image.getAttribute('src'))), [], `${route} images load and decode`)
        if (evidence) {
          const slug = route.replaceAll('/', '-').replace(/^-/, '') || 'home'
          await page.screenshot({ path: path.join(evidence, `${slug}-${width}-${theme}.png`) })
        }
      }
      await page.goto(base)
      await page.getByRole('button', { name: `Switch to ${theme === 'light' ? 'dark' : 'light'} mode` }).click()
      const toggled = theme === 'light' ? 'dark' : 'light'
      assert.equal(await page.locator('html').getAttribute('data-theme'), toggled, 'theme control changes the rendered theme')
      assert.equal(await page.evaluate(() => localStorage.getItem('udbhav-theme')), toggled, 'theme control persists the preference')
      await page.reload()
      assert.equal(await page.locator('html').getAttribute('data-theme'), toggled, 'theme preference survives reload')
      await context.close()
    }
  }
  assert.deepEqual(errors, [])
  console.log('PASS route visuals: Home, About, Research, RadKev detail, Software, Archive, and 404 render in light/dark at 1440, 820, and 390px with decoded images, persisted themes, no overlays, runtime errors, missing footer, or horizontal overflow.')
} finally { await browser.close(); server.close(); await once(server, 'close') }
