import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import path from 'node:path'
import { once } from 'node:events'
import { chromium } from 'playwright'
import { createAppServer } from '../server.mjs'
import { createHash } from 'node:crypto'

const routes = Object.keys(JSON.parse(await fs.readFile('src/routeMeta.json', 'utf8')))
const server = createAppServer()
server.listen(0, '127.0.0.1')
await once(server, 'listening')
const base = `http://127.0.0.1:${server.address().port}`
const browser = await chromium.launch({ headless: true, channel: process.env.PLAYWRIGHT_CHANNEL || 'chrome' })
const evidence = process.env.EVIDENCE_DIR
const viewports = [
  { width: 1440, height: 900, label: 'desktop' },
  { width: 820, height: 1000, label: 'tablet' },
  { width: 390, height: 844, label: 'mobile' },
]
if (evidence) {
  await fs.mkdir(evidence, { recursive: true })
  const bundles = (await fs.readdir('dist/assets')).filter(file => /^index-.*\.js$/.test(file)).sort()
  const bundleHashes = Object.fromEntries(await Promise.all(bundles.map(async file => [file, createHash('sha256').update(await fs.readFile(path.join('dist/assets', file))).digest('hex')])))
  await fs.writeFile(path.join(evidence, 'manifest.json'), JSON.stringify({ generatedAt: new Date().toISOString(), routes, viewports, themes: ['light', 'dark'], bundleHashes }, null, 2))
}

const captures = {
  '/experience': '#synth-med',
  '/awards': '#ethos-course',
  '/research': '.study-index-row:has(a[href="/research/organ-segmentation"])',
  '/research/organ-segmentation': '.study-hero',
  '/beyond': '#equestrian',
}

try {
  for (const viewport of viewports) {
    const { width, height, label } = viewport
    for (const theme of ['light', 'dark']) {
      const context = await browser.newContext({ viewport: { width, height } })
      await context.addInitScript(value => localStorage.setItem('udbhav-theme', value), theme)
      const page = await context.newPage()
      const errors = []
      page.on('pageerror', error => errors.push(error.message))
      for (const route of routes) {
        await page.goto(base + route, { waitUntil: 'networkidle' })
        await page.locator('h1').waitFor()
        await page.evaluate(() => document.querySelectorAll('img').forEach(image => { image.loading = 'eager' }))
        assert.equal(await page.locator('html').getAttribute('data-theme'), theme, `${route}: ${theme} theme applies`)
        await page.evaluate(async () => {
          const step = Math.max(400, innerHeight * .8)
          for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
            scrollTo(0, y)
            await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))
          }
          await document.fonts.ready
          await Promise.all([...document.images].map(async image => {
            if (!image.complete) await new Promise(resolve => {
              const finish = () => resolve(undefined)
              image.addEventListener('load', finish, { once: true })
              image.addEventListener('error', finish, { once: true })
              setTimeout(finish, 500)
            })
            if (image.naturalWidth > 0) await image.decode?.().catch(() => undefined)
          }))
          scrollTo(0, 0)
          await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))
        })
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), true, `${route}: no horizontal overflow at ${width}px ${theme}`)
        const incompleteImages = await page.locator('img').evaluateAll(images => images.filter(image => !image.complete).map(image => image.getAttribute('src')))
        assert.deepEqual(incompleteImages, [], `${route}: every image reached a complete state at ${width}px ${theme}`)
        const brokenImages = await page.locator('img').evaluateAll(images => images.filter(image => image.complete && image.naturalWidth === 0).map(image => image.getAttribute('src')))
        assert.deepEqual(brokenImages, [], `${route}: local images load at ${width}px ${theme}`)
        const nestedInteractive = await page.locator('a a, a button, button a').count()
        assert.equal(nestedInteractive, 0, `${route}: no nested interactive controls`)
        const h1 = page.locator('h1')
        assert.equal(await h1.isVisible(), true, `${route}: visible primary heading`)
        if (evidence) {
          const slug = route.replaceAll('/', '-').replace(/^-/, '') || 'home'
          await page.evaluate(() => scrollTo(0, 0))
          await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))))
          await page.screenshot({ path: path.join(evidence, `${slug}-${width}x${height}-${theme}-top.png`) })
          if (captures[route]) {
            const target = page.locator(captures[route])
            await target.evaluate(element => scrollTo({ top: element.getBoundingClientRect().top + scrollY - 90 }))
            await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))))
            await page.screenshot({ path: path.join(evidence, `${slug}-${width}x${height}-${theme}-section.png`) })
          }
        }
      }
      assert.deepEqual(errors, [], `${width}px ${theme}: no page exceptions`)
      await context.close()
      console.log(`PASS ${label} ${width}x${height} ${theme}: ${routes.length} primary routes, decoded images, headings, interaction nesting, and overflow.`)
    }
  }
} finally {
  await browser.close()
  await new Promise(resolve => server.close(resolve))
}
