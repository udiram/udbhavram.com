import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import { once } from 'node:events'
import { chromium } from 'playwright'
import { createServer as createViteServer } from 'vite'
import { createAppServer } from '../server.mjs'

const rejectedAssets = ['/assets/stories/community-music-2025.webp', '/assets/stories/outdoor-gathering-2025.webp']
for (const asset of rejectedAssets) await assert.rejects(fs.stat(`public${asset}`))

const requiredExperienceIds = ['waaw', 'synth-med', 'mcmaster-yoga', 'mac-formula-electric', 'jspg-ambassador', 'zone01', 'frc-4939', 'sparkin-stem']
const requiredProjectIds = ['genomic-dose-model', 'f1-lap-simulation', 'driving-agents', 'monai-contribution', 'openhands-contribution']
const requiredAwardIds = ['ap-scholar', 'spark-runner-up', 'padi-advanced-open-water', 'padi-enriched-air', 'ssi-open-water']

const vite = await createViteServer({ server: { middlewareMode: true, hmr: false }, appType: 'custom' })
let experienceRecords
let projectRecords
let awardRecords
try {
  const identity = await vite.ssrLoadModule('/src/identityContent.ts')
  const content = await vite.ssrLoadModule('/src/contentRegistry.ts')
  const software = await vite.ssrLoadModule('/src/softwareContent.ts')
  experienceRecords = identity.experienceRecords
  projectRecords = identity.projectRecords
  awardRecords = identity.awardRecords

  for (const [label, records] of [['experience', experienceRecords], ['project', projectRecords], ['award', awardRecords]]) {
    assert.equal(new Set(records.map(record => record.id)).size, records.length, `${label} IDs are unique`)
    assert.ok(records.every(record => record.sources.length > 0 && record.sources.every(source => source.label.trim() && source.href.trim())), `${label} records all have labelled sources`)
  }
  for (const id of requiredExperienceIds) assert.ok(experienceRecords.some(record => record.id === id), `experience coverage retains ${id}`)
  for (const id of requiredProjectIds) assert.ok(projectRecords.some(record => record.id === id), `project coverage retains ${id}`)
  for (const id of requiredAwardIds) assert.ok(awardRecords.some(record => record.id === id), `award coverage retains ${id}`)
  assert.equal(projectRecords.filter(record => record.id.startsWith('software-')).length, software.softwareProjects.length, 'every canonical software project appears in the institution-connected index')

  const registryIds = new Set(content.publicContentRegistry.map(item => item.id))
  for (const record of experienceRecords) assert.ok(registryIds.has(`experience:${record.id}`), `${record.id} resolves in discovery`)
  for (const record of projectRecords.filter(record => !record.id.startsWith('software-'))) assert.ok(registryIds.has(`project:${record.id}`), `${record.id} resolves in discovery`)
  for (const record of awardRecords) assert.ok(registryIds.has(`award:${record.id}`), `${record.id} resolves in discovery`)
  for (const project of software.softwareProjects) {
    assert.ok(registryIds.has(`software:${project.id}`), `${project.id} keeps its canonical software identity`)
    assert.equal(registryIds.has(`project:software-${project.id}`), false, `${project.id} has no duplicate project identity`)
  }

  const coverage = await fs.readFile('IDENTITY_SOURCE_COVERAGE.md', 'utf8')
  for (const record of [...experienceRecords, ...projectRecords, ...awardRecords]) assert.match(coverage, new RegExp(`\\b${record.id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`), `${record.id} appears in the release coverage ledger`)
  console.log(`PASS coverage: ${experienceRecords.length} experience, ${projectRecords.length} project, and ${awardRecords.length} recognition records are sourced, ledgered, unique, and resolvable.`)
} finally {
  await vite.close()
}

const server = createAppServer()
server.listen(0, '127.0.0.1')
await once(server, 'listening')
const base = `http://127.0.0.1:${server.address().port}`
const browser = await chromium.launch({ headless: true, channel: process.env.PLAYWRIGHT_CHANNEL || 'chrome' })

async function openSearchResult(page, query, id) {
  await page.getByRole('button', { name: 'Search site' }).click()
  await page.locator('#global-search').fill(query)
  const link = page.locator(`[data-search-id="${id}"] > a`)
  await link.waitFor()
  await link.click()
}

async function expectFocusedVisible(page, id) {
  await page.waitForFunction(targetId => {
    const target = document.getElementById(targetId)
    const header = document.querySelector('.site-header')?.getBoundingClientRect()
    if (!target || !header || document.querySelector('.search-dialog') || document.activeElement !== target) return false
    const rect = target.getBoundingClientRect()
    return rect.top >= header.bottom - 1 && rect.top < innerHeight - 80
  }, id)
}

try {
  for (const width of [1440, 1280, 820, 390]) {
    const page = await browser.newPage({ viewport: { width, height: 900 } })
    const errors = []
    page.on('pageerror', error => errors.push(error.message))

    await page.goto(base)
    assert.equal(await page.locator('.home-award-list > a').count(), 3)
    assert.match(await page.locator('.home-awards').innerText(), /Milestones[\s\S]*along the way/i)
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true)

    await page.goto(`${base}/experience#western-lawson`)
    assert.match(await page.locator('h1').innerText(), /Where the work\s+took shape/i)
    assert.equal(await page.locator('.identity-row').count(), experienceRecords.length)
    assert.equal(await page.locator('.project-record').count(), projectRecords.length)
    assert.equal(await page.locator('header a[href="/experience"]').count(), 1)
    await expectFocusedVisible(page, 'western-lawson')
    await page.getByLabel('Search experience').fill('Western')
    assert.equal(await page.locator('.identity-row').count(), 1)
    assert.equal(await page.locator('.project-record').count(), projectRecords.length, 'experience filters do not change the project index')
    assert.match(await page.locator('#western-lawson').innerText(), /August 2022–January 2023/)
    await page.getByLabel('Search projects').fill('MONAI')
    assert.equal(await page.locator('.project-record').count(), 2)
    assert.equal(await page.locator('.identity-row').count(), 1, 'project filters do not change experience records')
    assert.match(await page.locator('#project-monai-contribution').innerText(), /Project MONAI/)
    await page.getByLabel('Search experience').fill('Arrow McLaren')
    await page.getByRole('button', { name: 'Service', exact: true }).click()
    assert.equal(await page.locator('#western-lawson').count(), 0)
    await openSearchResult(page, 'Western', 'experience:western-lawson')
    await expectFocusedVisible(page, 'western-lawson')
    assert.equal(await page.getByLabel('Search experience').inputValue(), '')
    assert.equal(await page.locator('[aria-label="experience categories"]').getByRole('button', { name: 'All', exact: true }).getAttribute('aria-pressed'), 'true')
    if (process.env.EVIDENCE_DIR) {
      await fs.mkdir(process.env.EVIDENCE_DIR, { recursive: true })
      await page.screenshot({ path: `${process.env.EVIDENCE_DIR}/experience-deep-link-${width}-light.png` })
    }

    await page.goto(`${base}/experience#project-monai-contribution`)
    await expectFocusedVisible(page, 'project-monai-contribution')
    await page.getByLabel('Search projects').fill('Formula')
    await page.locator('[aria-label="projects categories"]').getByRole('button', { name: 'Engineering', exact: true }).click()
    assert.equal(await page.locator('#project-monai-contribution').count(), 0)
    await openSearchResult(page, 'Project MONAI', 'project:monai-contribution')
    await expectFocusedVisible(page, 'project-monai-contribution')
    assert.equal(await page.getByLabel('Search projects').inputValue(), '')
    assert.equal(await page.locator('[aria-label="projects categories"]').getByRole('button', { name: 'All', exact: true }).getAttribute('aria-pressed'), 'true')

    if (width === 1440) {
      await page.getByLabel('Search projects').fill('RadKev')
      const canonicalSave = page.locator('[data-save-id="software:radkev"]')
      assert.equal(await canonicalSave.count(), 1)
      await canonicalSave.click()
      await page.goto(`${base}/reading-list`)
      const savedLink = page.locator('[data-reading-id="software:radkev"] h2 a')
      await savedLink.waitFor()
      await savedLink.click()
      await page.waitForURL(/\/software#software-radkev$/)
      await page.locator('#software-radkev').waitFor()
    }

    await page.goto(`${base}/awards#ap-scholar`)
    assert.equal(await page.locator('.award-row').count(), awardRecords.length)
    assert.match(await page.locator('#ap-scholar').innerText(), /AP Scholar with Distinction/)
    assert.match(await page.locator('#employer-year').innerText(), /Recipient: Carlos Cardenas/)
    assert.equal(await page.locator('.identity-evidence-note').count(), 0)
    await expectFocusedVisible(page, 'ap-scholar')
    await page.getByLabel('Search awards').fill('Blue Ribbon')
    await page.getByRole('button', { name: 'Training & certification', exact: true }).click()
    assert.equal(await page.locator('#ap-scholar').count(), 0)
    await openSearchResult(page, 'AP Scholar', 'award:ap-scholar')
    await expectFocusedVisible(page, 'ap-scholar')
    assert.equal(await page.getByLabel('Search awards').inputValue(), '')
    assert.equal(await page.locator('[aria-label="awards categories"]').getByRole('button', { name: 'All', exact: true }).getAttribute('aria-pressed'), 'true')
    assert.equal(await page.locator('.award-row').count(), awardRecords.length)
    await page.goto(`${base}/awards#employer-year`)
    await expectFocusedVisible(page, 'employer-year')
    if (process.env.EVIDENCE_DIR) await page.screenshot({ path: `${process.env.EVIDENCE_DIR}/awards-ownership-${width}-light.png` })

    await page.goto(`${base}/beyond`)
    const scuba = page.locator('#scuba img[src="/assets/personal/activities-scuba.webp"]')
    assert.equal(await scuba.count(), 1)
    assert.deepEqual(await scuba.evaluate(image => ({ naturalWidth: image.naturalWidth, naturalHeight: image.naturalHeight })), { naturalWidth: 225, naturalHeight: 124 })
    assert.equal(await page.locator('#equestrian img[src="/assets/personal/activities-10.webp"]').count(), 1)
    assert.match(await page.locator('#equestrian').innerText(), /American Cowboy Academy/)
    assert.doesNotMatch(await page.locator('.signature-pursuits').innerText(), /professional rodeo/i)
    for (const asset of rejectedAssets) assert.equal((await page.request.get(`${base}${asset}`)).status(), 404)

    if (process.env.EVIDENCE_DIR) {
      await fs.mkdir(process.env.EVIDENCE_DIR, { recursive: true })
      await page.locator('.signature-pursuits').evaluate(element => element.scrollIntoView({ block: 'start', behavior: 'instant' }))
      await page.screenshot({ path: `${process.env.EVIDENCE_DIR}/beyond-pursuits-${width}-light.png` })
      await page.getByRole('button', { name: 'Switch to dark mode' }).click()
      await page.screenshot({ path: `${process.env.EVIDENCE_DIR}/beyond-pursuits-${width}-dark.png` })
      await page.goto(base)
      await page.locator('.home-awards').evaluate(element => element.scrollIntoView({ block: 'start', behavior: 'instant' }))
      await page.screenshot({ path: `${process.env.EVIDENCE_DIR}/home-awards-${width}-dark.png` })
    }
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true)
    assert.deepEqual(errors, [])
    await page.close()
    console.log(`PASS ${width}px: identity filters/deep links, canonical saves, awards, source media, home recognition, and overflow.`)
  }
} finally {
  await browser.close()
  server.close()
  await once(server, 'close')
}
