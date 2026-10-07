import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import { once } from 'node:events'
import { chromium } from 'playwright'
import { createAppServer } from '../server.mjs'

const data = JSON.parse(await fs.readFile('src/mediaContent.json', 'utf8'))
const lapEvidence = JSON.parse(await fs.readFile('scripts/lap-validation-evidence.json', 'utf8'))
let server
let base = process.env.TEST_ORIGIN
if (!base) {
  server = createAppServer(); server.listen(0, '127.0.0.1'); await once(server, 'listening')
  base = `http://127.0.0.1:${server.address().port}`
}
const browser = await chromium.launch({ headless: true, channel: process.env.PLAYWRIGHT_CHANNEL || 'chrome' })
const errors = []
try {
  for (const width of [1440, 1280, 1024, 820, 390]) {
    const context = await browser.newContext({ viewport: { width, height: 1000 } })
    const page = await context.newPage()
    await page.addInitScript(() => {
      class FakePlayer {
        constructor(element, options) {
          this.time = 0; this.state = 5; this.options = options
          const frame = document.createElement('iframe'); frame.title = 'Mock YouTube player'; element.append(frame)
          window.__ytFake = {
            play: () => { this.state = 1; this.options.events.onStateChange({data:1,target:this}) },
            pause: () => { this.state = 2; this.options.events.onStateChange({data:2,target:this}) },
            buffer: () => { this.state = 3; this.options.events.onStateChange({data:3,target:this}) },
            setRate: value => { this.rate = value },
            advanceWall: value => { if(this.state===1) this.time += value * (this.rate || 1) },
            advance: value => { if(this.state===1) this.time += value },
            seek: value => this.seekTo(value),
            time: () => this.time,
          }
          setTimeout(() => options.events.onReady({target:this}), 300)
        }
        destroy() { this.destroyed = true }
        getCurrentTime() { return this.time }
        seekTo(value) { this.time = value; this.state = 2; this.options.events.onStateChange({data:2,target:this}) }
      }
      window.YT = {Player: FakePlayer}
    })
    page.on('pageerror', e => errors.push(e.message))
    const thirdParty = []
    page.on('request', request => { if (/youtube|ytimg|googlevideo/.test(request.url())) thirdParty.push(request.url()) })
    await page.goto(`${base}/media`)
    await page.waitForTimeout(300)
    assert.equal(await page.locator('[data-media-article]').count(), 9)
    assert.equal(await page.locator('[data-media-video]').count(), 15)
    assert.equal(await page.locator('iframe').count(), 0)
    assert.deepEqual(thirdParty, [], 'No YouTube/thumbnail requests before consent')
    assert.equal(await page.locator('.video-load img[src^="/assets/media/video-thumbnails/"]').count(), 15)
    assert.equal(await page.locator('#lap-companion').count(), 1)
    assert.match(await page.locator('#lap-companion').innerText(), /Approximate track position/i)
    assert.match(await page.locator('#lap-companion').innerText(), /speed, steering angle, RPM, throttle, or brake channels/i)
    assert.match(await page.locator('.telemetry-panel').innerText(), /qualitative inference[\s\S]*not a wheel measurement or calibrated probability/i)
    assert.doesNotMatch(await page.locator('.telemetry-panel').innerText(), /confidence is \d+%/i)
    assert.equal(await page.locator('.registration-grid figure').count(), 7)
    assert.match(await page.locator('.registration-evidence').innerText(), /seven visible anchors/i)
    const corneringLines = page.locator('.telemetry-chart .steering-line')
    assert.ok(await corneringLines.count() >= 2, 'cornering chart spans the supported driving intervals around the excursion gap')
    const corneringPoints = await corneringLines.evaluateAll(lines => lines.reduce((total, line) => total + (line.getAttribute('points')?.trim().split(/\s+/).length || 0), 0))
    assert.ok(corneringPoints > 300, `cornering chart is dense (${corneringPoints} plotted samples)`)
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, `No overflow at ${width}`)
    const nav = page.locator('nav[aria-label="Main navigation"]')
    if(width===390){
      await page.getByRole('button',{name:'Open navigation',exact:true}).click()
      assert.equal(await nav.getByRole('link',{name:'Media',exact:true}).isVisible(),true)
      await page.getByRole('button',{name:'Close navigation',exact:true}).click()
    }
    await page.locator('.theme-toggle').click()
    assert.equal(await page.locator('html').getAttribute('data-theme'),'dark')
    if(process.env.EVIDENCE_DIR && width===390) await page.screenshot({path:`${process.env.EVIDENCE_DIR}/media-dark-390.png`})
    await page.locator('.theme-toggle').click()
    // Header navigation must stay in bounds at intermediate desktop widths.
    if (width > 760) {
      const rect = await nav.boundingBox()
      if (rect) assert.ok(rect.x + rect.width <= width, 'Header fits')
    }
    for (const a of data.articles) assert.ok(await page.locator(`[id="${a.id}"] a[href="${a.url}"]`).count() >= 1)
    for (const v of data.videos) assert.equal(await page.locator(`[id="${v.id}"] a[href="${v.url}"]`).count(), 1)
    await page.getByLabel('Topic', {exact:true}).selectOption('Motorsport')
    assert.equal(await page.locator('[data-media-video]').count(), 3)
    assert.match(await page.locator('[data-media-video]').first().innerText(), /Uploaded September 30, 2026[\s\S]*Driven: May 2023/)
    await page.getByLabel('Find a video').fill('no-such-video-987')
    assert.equal(await page.locator('[data-media-video]').count(), 0)
    await page.getByRole('button', {name:'Reset video filters'}).click()
    await page.getByLabel('Find a video').fill('Arduino')
    assert.equal(await page.locator('[data-media-video]').count(), 1)
    // Stub the remote frame; we test consent and controls, not YouTube availability.
    await page.route('https://www.youtube-nocookie.com/**', route => route.fulfill({contentType:'text/html',body:'<p>Video test frame</p>'}))
    await page.getByRole('button', {name:'Load YouTube video: Arduino labs',exact:true}).click()
    assert.equal(await page.locator('iframe').count(), 1)
    assert.equal(await page.locator('iframe').getAttribute('src'), data.videos.at(-1).embed_url)
    await page.getByRole('button', {name:'Close video',exact:true}).click()
    assert.equal(await page.locator('iframe').count(), 0)
    await page.getByLabel('Find a video').fill('')
    // The annotated lap view has its own explicit consent boundary and seek controls.
    await page.locator('.lap-timeline button').nth(2).click()
    assert.match(await page.locator('.lap-now').innerText(), /Observed at 0:00/i)
    assert.match(await page.locator('.lap-now').innerText(), /5:25 is queued/)
    assert.equal(await page.locator('#lap-companion iframe').count(), 1)
    await page.waitForTimeout(650)
    assert.match(await page.locator('.lap-now').innerText(), /Observed at 5:25 · paused/i)
    assert.match(await page.locator('.lap-now').innerText(), /Lap 1 · 2:20/)
    assert.equal(await page.locator('.track-marker').getAttribute('data-lap'), '1')
    const layout = await page.evaluate(() => {
      const grid = document.querySelector('.lap-grid')
      const video = document.querySelector('.lap-video')
      const panel = document.querySelector('.lap-map-panel')
      const readout = document.querySelector('.lap-readout')
      const box = element => { const rect = element?.getBoundingClientRect(); return rect ? {x: rect.x, y: rect.y, width: rect.width, height: rect.height} : null }
      return {
        grid: box(grid), video: box(video), panel: box(panel),
        panelOverflow: panel ? panel.scrollWidth - panel.clientWidth : 999,
        readoutOverflow: readout ? readout.scrollWidth - readout.clientWidth : 999,
      }
    })
    assert.ok(layout.panel.width >= 320, `${width}px: map panel remains useful (${layout.panel.width.toFixed(1)}px)`)
    assert.ok(layout.panelOverflow <= 1, `${width}px: map panel has no horizontal overflow`)
    assert.ok(layout.readoutOverflow <= 1, `${width}px: lap readout has no horizontal overflow`)
    if (width > 1100) {
      assert.ok(layout.video.width < layout.grid.width * .75, `${width}px: real-player column cannot starve the map`)
      assert.ok(layout.panel.x > layout.video.x, `${width}px: player and map remain side by side`)
    } else {
      assert.ok(layout.panel.y > layout.video.y + layout.video.height - 1, `${width}px: player and map stack cleanly`)
    }
    if (process.env.EVIDENCE_DIR) await page.locator('.lap-grid').screenshot({path:`${process.env.EVIDENCE_DIR}/lap-loaded-${width}.png`})
    await page.evaluate(() => window.__ytFake.play())
    await page.evaluate(() => window.__ytFake.setRate(2))
    await page.evaluate(() => window.__ytFake.advanceWall(10))
    await page.waitForTimeout(350)
    assert.match(await page.locator('.lap-now').innerText(), /Observed at 5:45 · playing/i)
    assert.ok(Number(await page.locator('.track-marker').getAttribute('data-progress')) > .15)
    await page.evaluate(() => window.__ytFake.buffer())
    const bufferedTime = await page.evaluate(() => window.__ytFake.time())
    await page.evaluate(() => window.__ytFake.advanceWall(10))
    await page.waitForTimeout(300)
    assert.equal(await page.evaluate(() => window.__ytFake.time()), bufferedTime, 'Buffering does not invent elapsed time')
    await page.evaluate(() => window.__ytFake.seek(677))
    await page.waitForTimeout(100)
    assert.match(await page.locator('.lap-now').innerText(), /Off-circuit excursion/i)
    assert.equal(await page.locator('.track-marker').count(), 0)
    assert.equal(await page.locator('.position-unavailable').count(), 1)
    await page.evaluate(() => window.__ytFake.seek(839))
    await page.waitForTimeout(100)
    assert.equal(await page.locator('.track-marker').count(), 0, 'Partial lap does not advance beyond its last registered landmark')
    assert.match(await page.locator('.lap-now').innerText(), /unresolved/i)
    if (width === 1440) {
      await page.locator('.heldout-evidence summary').click()
      assert.match(await page.locator('.heldout-evidence').innerText(), /16 unused frames · 100% semantic agreement/i)
      assert.equal(await page.locator('.heldout-evidence figure').count(), lapEvidence.outOfSampleCases.length)
      for (const testCase of lapEvidence.calibrationCases) {
        await page.evaluate(time => window.__ytFake.seek(time), testCase.time)
        await page.waitForTimeout(30)
        if (testCase.expectedCornering === null) {
          assert.equal(await page.locator('.track-marker').count(), 0, `${testCase.time}s has no invented position`)
          continue
        }
        const result = await page.evaluate(() => {
          const marker = document.querySelector('.track-marker')
          const path = document.querySelector('.track-measure')
          const progress = Number(marker?.getAttribute('data-progress'))
          const length = path.getTotalLength()
          const point = fraction => path.getPointAtLength(Math.max(0, Math.min(length, fraction * length)))
          const before = point(progress - 8 / length), center = point(progress), after = point(progress + 8 / length)
          const cross = (center.x - before.x) * (after.y - center.y) - (center.y - before.y) * (after.x - center.x)
          return { progress, cross }
        })
        assert.ok(result.progress >= testCase.expectedProgress[0] && result.progress <= testCase.expectedProgress[1], `${testCase.time}s map range`)
        if (testCase.expectedCornering === 'left') assert.ok(result.cross < -5, `${testCase.time}s visible left maps to left-bending geometry (${result.cross})`)
        if (testCase.expectedCornering === 'right') assert.ok(result.cross > 5, `${testCase.time}s visible right maps to right-bending geometry (${result.cross})`)
        if (testCase.expectedCornering === 'straight') assert.ok(Math.abs(result.cross) < 8, `${testCase.time}s visible straight maps to straight geometry (${result.cross})`)
      }
      for (const testCase of lapEvidence.occlusionCases) {
        await page.evaluate(time => window.__ytFake.seek(time), testCase.time)
        await page.waitForTimeout(30)
        assert.match(await page.locator('.wheel-observation').innerText(), /not sampled/i, `${testCase.time}s occlusion is suppressed`)
      }
      for (const testCase of lapEvidence.outOfSampleCases) {
        await page.evaluate(time => window.__ytFake.seek(time), testCase.time)
        await page.waitForTimeout(30)
        assert.match(await page.locator('.telemetry-values').innerText(), new RegExp(`Cornering ${testCase.expectedCornering}`, 'i'), `${testCase.time}s out-of-sample cornering`)
      }
    }
    await page.evaluate(() => window.__ytFake.pause())
    const pausedTime = await page.evaluate(() => window.__ytFake.time())
    await page.waitForTimeout(400)
    assert.equal(await page.evaluate(() => window.__ytFake.time()), pausedTime)
    assert.match(await page.locator('.lap-now').innerText(), /paused/i)
    await page.locator('#lap-companion').getByRole('button', {name:'Close video'}).click()
    assert.equal(await page.locator('#lap-companion iframe').count(), 0)
    if (process.env.EVIDENCE_DIR) {
      await fs.mkdir(process.env.EVIDENCE_DIR, {recursive:true})
      await page.evaluate(() => scrollTo(0,0))
      await page.screenshot({path:`${process.env.EVIDENCE_DIR}/media-${width}.png`,fullPage:true})
      await page.locator('#videos').evaluate(e=>e.scrollIntoView({block:'start',behavior:'instant'}))
      await page.screenshot({path:`${process.env.EVIDENCE_DIR}/videos-${width}.png`})
    }
    await page.goto(`${base}/collection/media#entry-0-0`)
    assert.ok(await page.locator('#entry-0-0').count(), 'Legacy media anchors survive')
    assert.ok(await page.locator('a[href="/media"]').count(), 'Legacy page links to dedicated media page')
    await page.goto(`${base}/media#video-GNboj6JfDeI`)
    await page.waitForFunction(() => document.activeElement?.id === 'video-GNboj6JfDeI')
    assert.equal(await page.locator('[data-media-video]').count(),15)
    for (const path of ['/','/about','/software','/beyond']) {
      await page.goto(base+path)
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, `${path}: no overflow at ${width}`)
      assert.ok(await page.locator('a[href^="/media"]').count(), `${path}: reciprocal link`)
      if(process.env.EVIDENCE_DIR && width!==820) await page.screenshot({path:`${process.env.EVIDENCE_DIR}/${path.slice(1)||'home'}-${width}.png`,fullPage:true})
    }
    console.log(`PASS ${width}px: 9 editions, 15 videos, filters/search/reset, consent/no prefetch, close/fallback, legacy route, deep links, reciprocal links, overflow, screenshots.`)
    await context.close()
  }
  // A stalled API script must time out, clear its cached promise, and succeed on retry.
  {
    const context = await browser.newContext({ viewport: { width: 900, height: 900 } })
    const page = await context.newPage()
    await page.addInitScript(() => { window.__YT_API_TIMEOUT_MS = 75 })
    let attempts = 0
    await page.route('https://www.youtube.com/iframe_api', async route => {
      attempts += 1
      if (attempts === 1) return route.fulfill({ contentType: 'application/javascript', body: '/* callback intentionally omitted */' })
      return route.fulfill({ contentType: 'application/javascript', body: `
        window.YT={Player:class{constructor(element,options){this.time=0;this.options=options;const frame=document.createElement('iframe');frame.title='Recovered YouTube player';element.append(frame);setTimeout(()=>options.events.onReady({target:this}),0)}destroy(){}getCurrentTime(){return this.time}seekTo(value){this.time=value;this.options.events.onStateChange({data:2,target:this})}}};
        window.onYouTubeIframeAPIReady();
      ` })
    })
    await page.goto(`${base}/media#lap-companion`)
    await page.locator('.lap-timeline button').nth(2).click()
    await page.getByRole('button', { name: 'Try loading again' }).waitFor()
    assert.match(await page.locator('.lap-error').innerText(), /could not load/i)
    assert.equal(await page.locator('script[data-lap-companion-api]').count(), 0, 'Failed API script is removed')
    await page.getByRole('button', { name: 'Try loading again' }).click()
    await page.waitForFunction(() => document.querySelector('.lap-now')?.textContent?.includes('Observed at 5:25 · paused'))
    assert.equal(attempts, 2, 'Retry requests a fresh API script')
    assert.equal(await page.locator('#lap-companion iframe').count(), 1)
    await context.close()
    console.log('PASS YouTube API timeout clears the cached failure and retry reaches ready state.')
  }
  // Validate every related media URL and fragment against actual prerendered documents.
  const links = new Set([...data.articles,...data.videos,...data.profiles].flatMap(x=>x.related_pages))
  for (const link of links) {
    const [path,hash] = link.split('#')
    const response=await fetch(base+path); assert.equal(response.status,200,link)
    if(hash) assert.ok((await response.text()).includes(`id="${hash}"`),link)
  }
  assert.deepEqual(errors,[])
  console.log(`PASS ${links.size} contextual route/fragment destinations and no browser errors.`)
} finally {
  await browser.close()
  if(server){server.close();await once(server,'close')}
}
