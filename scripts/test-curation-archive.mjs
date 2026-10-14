import assert from 'node:assert/strict'
import { once } from 'node:events'
import fs from 'node:fs/promises'
import path from 'node:path'
import { chromium } from 'playwright'
import { createServer as createViteServer } from 'vite'
import { createAppServer } from '../server.mjs'

const vite = await createViteServer({ server: { middlewareMode: true, hmr: false }, appType: 'custom' })
let archiveRecords
let expectedNewest
try {
  const [archive, identity, content, portfolio, mediaModule, bibliographyModule, presentationModule, softwareModule, studiesModule] = await Promise.all([
    vite.ssrLoadModule('/src/archiveData.ts'), vite.ssrLoadModule('/src/identityContent.ts'), vite.ssrLoadModule('/src/contentRegistry.ts'),
    vite.ssrLoadModule('/src/portfolioContent.ts'), vite.ssrLoadModule('/src/mediaContent.json'), vite.ssrLoadModule('/src/bibliography.json'),
    vite.ssrLoadModule('/src/presentationData.ts'), vite.ssrLoadModule('/src/softwareContent.ts'), vite.ssrLoadModule('/src/expandedContent.ts'),
  ])
  archiveRecords = archive.archiveRecords
  const byId = new Map(archiveRecords.map(record => [record.id, record]))
  assert.equal(archiveRecords.length, content.publicContentRegistry.length, 'Archive adapts the complete canonical registry')
  assert.equal(new Set(archiveRecords.map(record => record.id)).size, archiveRecords.length, 'record IDs are unique')
  assert.equal(new Set(archiveRecords.map(record => record.anchor)).size, archiveRecords.length, 'canonical anchors are collision-free')
  assert.ok(archiveRecords.every(record => Object.isFrozen(record) && Object.isFrozen(record.sources)), 'adapted records and source arrays are immutable')

  for (const record of identity.experienceRecords) {
    const adapted = byId.get(`experience:${record.id}`)
    assert.ok(adapted, `${record.id} is archived`)
    for (const work of record.work) assert.ok(adapted.details.includes(work), `${record.id} preserves work: ${work}`)
    for (const source of record.sources) assert.ok(adapted.sources.some(candidate => candidate.href === source.href), `${record.id} preserves ${source.href}`)
    if (record.note) assert.ok(adapted.notes.includes(record.note), `${record.id} preserves its note`)
  }
  for (const project of identity.projectRecords) {
    const id = project.id.startsWith('software-') ? `software:${project.id.slice('software-'.length)}` : `project:${project.id}`
    const adapted = byId.get(id)
    assert.ok(adapted?.details.includes(project.outcome), `${id} preserves its outcome`)
    for (const source of project.sources) assert.ok(adapted.sources.some(candidate => candidate.href === source.href), `${id} preserves ${source.href}`)
  }
  for (const collection of portfolio.portfolioCollections) for (const group of collection.groups) for (const item of group.items) {
    const id = content.resolveCollectionRecordContentId(collection.id, item)
    const adapted = byId.get(id)
    assert.ok(adapted, `${collection.id}/${item.title} resolves to ${id}`)
    assert.ok(adapted.details.includes(`Collection record title: ${item.title}`), `${id} preserves the original collection title`)
    if (item.detail) assert.ok(adapted.details.includes(item.detail), `${id} preserves historical detail`)
    if (item.note) assert.ok(adapted.notes.includes(item.note), `${id} preserves historical note`)
    assert.ok(adapted.sources.some(source => source.href === collection.source), `${id} retains collection provenance`)
  }
  const media = mediaModule.default
  for (const group of new Set(media.articles.map(article => article.story_group))) {
    const adapted = byId.get(`media:article:${group}`)
    for (const article of media.articles.filter(candidate => candidate.story_group === group)) {
      assert.ok(adapted.sources.some(source => source.href === article.url), `${group} preserves ${article.url}`)
      assert.ok(adapted.details.some(detail => detail.includes(article.title)), `${group} preserves edition title: ${article.title}`)
      assert.ok(adapted.details.some(detail => detail.includes(article.summary)), `${group} preserves edition summary: ${article.summary}`)
    }
  }
  assert.ok(media.videos.every(video => byId.get(`media:video:${video.id}`).date), 'every video has a typed date')
  for (const paper of bibliographyModule.default) {
    const adapted = byId.get(`paper:${paper.id}`)
    assert.equal(adapted.date, paper.online_date)
    assert.ok(adapted.details.some(detail => detail.includes(paper.authors[0])))
    assert.ok(adapted.details.some(detail => detail.includes(paper.issue_date)))
  }
  assert.ok(byId.get('collection:activities-service:equestrian-sport').sources.some(source => source.href === 'https://theamericancowboyacademy.com/'), 'riding record preserves ACA source')
  assert.ok(byId.get('collection:activities-service:equestrian-sport').details.some(detail => /lesson barn/.test(detail)), 'riding record preserves Beyond narrative')
  const collectionItem = (collectionId, title) => portfolio.portfolioCollections.find(collection => collection.id === collectionId).groups.flatMap(group => group.items).find(item => item.title === title)
  assert.equal(content.resolveCollectionRecordContentId('media', collectionItem('media', "Udbhav Ram’s co-op supervisors flew in from Alabama to give him an award")), 'media:article:coop-award-2026', 'co-op article resolves by explicit entity equivalence')
  assert.equal(content.resolveCollectionRecordContentId('media', collectionItem('media', 'Convocation countdown with Udbhav Ram')), 'media:article:convocation-2026', 'convocation article resolves to its media entity')
  assert.equal(content.resolveCollectionRecordContentId('research-record', collectionItem('research-record', 'Ethos adaptive partial-breast irradiation contour variability')), 'project:adaptive-breast', 'adaptive-breast project does not collapse into the ASTRO profile')
  assert.ok(!byId.get('presentation:spscon-2025-poster21-ethos').details.some(detail => detail.includes('co-op supervisors flew in')), 'shared evidence does not merge the co-op article into the SPS presentation')
  assert.ok(!byId.get('presentation:uab-mcmaster-mou-remarks').details.some(detail => detail.includes('Convocation countdown')), 'shared evidence does not merge the convocation article into the partnership remarks')
  assert.ok(!byId.get('media:profile:astro-profile').details.some(detail => detail.includes('Ethos adaptive partial-breast')), 'shared evidence does not merge the adaptive-breast project into the ASTRO profile')
  assert.equal(archive.archiveAsOfDate, '2026-10-14', 'present-tense ranges use the documented source-audit date')
  assert.deepEqual(byId.get('experience:uab-research-collaborator').years, ['2026', '2025', '2024', '2023', '2022', '2021'], 'multi-year roles participate in every applicable year facet')
  assert.equal(byId.get('experience:uab-research-collaborator').date, archive.archiveAsOfDate)
  assert.deepEqual(byId.get('experience:mcmaster-membrane-lab').years, ['2022', '2021', '2020', '2019'])
  assert.equal(byId.get('experience:mcmaster-membrane-lab').date, '2022-08')
  assert.deepEqual(byId.get('experience:mac-formula-electric').years, ['2024', '2023', '2022', '2021'])
  assert.equal(byId.get('experience:mac-formula-electric').date, '2024-01')
  assert.deepEqual(byId.get('experience:western-lawson').institutions, ['Western University', 'Lawson Health Research Institute'])
  assert.deepEqual(byId.get('project:optical-brain').institutions, ['Western University', 'Lawson Health Research Institute'])
  assert.deepEqual(byId.get('project:stem-outreach').institutions, ['Robotique Zone01', 'FIRST Robotics Competition Team 4939', 'Sparkin’ STEM'])
  assert.deepEqual(byId.get('project:monai-contribution').institutions, ['Project MONAI'])
  assert.deepEqual(byId.get('media:profile:astro-profile').institutions, ['American Society for Radiation Oncology'])
  assert.deepEqual(byId.get('experience:uab-research-collaborator').institutions, ['University of Alabama at Birmingham'])
  const institutionPollutants = new Set(['open source', 'Radiation Oncology', 'UAB partnership', 'ASTRO 2026', 'Lawson', 'Zone01', 'FRC 4939'])
  assert.ok(archiveRecords.flatMap(record => record.institutions).every(value => !institutionPollutants.has(value) && !/record|historical|independent|present|chapter/i.test(value)), 'institution facets contain normalized named organizations only')
  assert.equal(archive.archiveStats.records, archiveRecords.length)
  assert.equal(archive.archiveStats.years, new Set(archiveRecords.flatMap(record => record.years)).size)
  assert.equal(archive.archiveStats.institutions, new Set(archiveRecords.flatMap(record => record.institutions)).size)
  assert.equal(archive.legacyArchiveTargetIds.get('/media#mcmaster-coop-original-2026'), 'media:article:coop-award-2026')
  assert.equal(archive.legacyArchiveTargetIds.get('/collection/research-record#astro-2026-3104'), 'presentation:astro-2026-3104')
  assert.equal(archive.legacyArchiveTargetIds.get('/publications#paper-ethos-2025'), 'paper:ethos-2025')
  assert.equal(studiesModule.studies.length, 8)
  assert.equal(softwareModule.softwareProjects.length, 9)
  assert.equal(presentationModule.presentations.length, 27)
  expectedNewest = archiveRecords.toSorted((a, b) => a.date === null ? b.date === null ? a.title.localeCompare(b.title) : 1 : b.date === null ? -1 : b.date.localeCompare(a.date) || a.title.localeCompare(b.title)).map(record => record.id)
} finally { await vite.close() }

const server = createAppServer(); server.listen(0, '127.0.0.1'); await once(server, 'listening')
const base = `http://127.0.0.1:${server.address().port}`
const browser = await chromium.launch({ headless: true, channel: process.env.PLAYWRIGHT_CHANNEL || 'chrome' })
const errors = []
const observeRuntime = page => {
  page.on('pageerror', error => errors.push(`pageerror: ${error.message}`))
  page.on('console', message => { if (message.type() === 'error' || message.type() === 'warning') errors.push(`console ${message.type()}: ${message.text()}`) })
}
const evidence = process.env.EVIDENCE_DIR
if (evidence) await fs.mkdir(evidence, { recursive: true })
try {
  const context = await browser.newContext({ viewport: { width: 1200, height: 900 } })
  const page = await context.newPage(); observeRuntime(page)
  await page.goto(base)
  assert.equal(await page.locator('.curated-research, .curated-motorsport').locator('a[href^="/archive"]').count(), 0, 'home body does not send readers into the Archive')
  assert.notEqual(await page.locator('.hero p').innerText(), await page.locator('.curated-research .section-heading p').innerText(), 'research intro does not repeat the hero')
  await page.goto(`${base}/about`)
  assert.equal(await page.locator('.curated-experience-list > li').count(), 10)
  assert.doesNotMatch(await page.locator('main').innerText(), /merge map|source IDs|database/i)

  await page.goto(`${base}/archive?sort=bogus&view=bogus&year=1901&institution=Nowhere`)
  await page.waitForURL(`${base}/archive`)
  if (evidence) await page.screenshot({ path: path.join(evidence, 'archive-default-1200-light.png') })
  assert.equal(page.url(), `${base}/archive`, 'invalid state canonicalizes to defaults')
  assert.deepEqual(await page.locator('.archive-card').evaluateAll(cards => cards.map(card => card.dataset.recordId)), expectedNewest, 'newest sort uses typed dates and leaves undated records last')
  await page.locator('.archive-display-controls select').selectOption('alpha')
  assert.match(page.url(), /sort=alpha/); assert.match(page.url(), /view=list/)
  const alphaTitles = await page.locator('.archive-card h2').allTextContents()
  assert.deepEqual(alphaTitles, [...alphaTitles].sort((a, b) => a.localeCompare(b)), 'alphabetical order is exact')
  await page.getByRole('button', { name: 'Timeline' }).click()
  assert.doesNotMatch(page.url(), /sort=/); assert.doesNotMatch(page.url(), /view=/)

  await page.goto(`${base}/archive?category=Study&year=2026&q=RadKev`)
  assert.equal(await page.locator('.archive-card').count(), 1)
  if (evidence) await page.screenshot({ path: path.join(evidence, 'archive-filtered-1200-light.png') })
  await page.reload(); assert.equal(await page.locator('.archive-card').count(), 1, 'full effective state survives reload')
  await page.getByRole('button', { name: 'List' }).click(); await page.goBack()
  assert.equal(await page.getByRole('button', { name: 'Timeline' }).getAttribute('aria-pressed'), 'true', 'Back restores view state')

  const westernAnchor = '#archive-experience-western-lawson'
  await page.goto(`${base}/archive?sort=alpha&view=list${westernAnchor}`)
  await page.waitForFunction(() => document.activeElement?.dataset.recordId === 'experience:western-lawson')
  assert.equal(page.url(), `${base}/archive?sort=alpha&view=list${westernAnchor}`)
  assert.equal(await page.getByRole('button', { name: 'List', exact: true }).getAttribute('aria-pressed'), 'true')
  await page.getByRole('button', { name: 'Timeline' }).click()
  assert.equal(page.url(), `${base}/archive`)
  await page.goBack()
  await page.waitForFunction(() => document.activeElement?.dataset.recordId === 'experience:western-lawson')
  assert.equal(page.url(), `${base}/archive?sort=alpha&view=list${westernAnchor}`, 'Back preserves record URL sort and view')
  assert.equal(await page.getByRole('button', { name: 'List', exact: true }).getAttribute('aria-pressed'), 'true')
  await page.goForward()
  assert.equal(page.url(), `${base}/archive`, 'Forward restores the later timeline state')
  assert.equal(await page.getByRole('button', { name: 'Timeline' }).getAttribute('aria-pressed'), 'true')

  await page.goto(`${base}/archive?category=Experience&q=Lawson&sort=alpha&view=list${westernAnchor}`)
  await page.waitForFunction(() => document.activeElement?.dataset.recordId === 'experience:western-lawson')
  assert.match(page.url(), /category=Experience/)
  assert.match(page.url(), /q=Lawson/)
  assert.match(page.url(), /sort=alpha&view=list/, 'compatible filters remain on a focused record URL')
  await page.goto(`${base}/archive?category=Experience&q=RadKev&sort=alpha&view=list${westernAnchor}`)
  await page.waitForFunction(() => document.activeElement?.dataset.recordId === 'experience:western-lawson')
  assert.doesNotMatch(page.url(), /q=/, 'only an incompatible search is cleared to reveal the record')
  assert.match(page.url(), /category=Experience/, 'compatible category survives record reveal')

  await page.goto(`${base}/experience?category=Award#western-lawson`)
  await page.waitForFunction(() => document.activeElement?.dataset.recordId === 'experience:western-lawson')
  assert.equal(page.url(), `${base}/archive#archive-experience-western-lawson`, 'legacy target clears incompatible filters and canonicalizes')
  await page.goto(`${base}/media#mcmaster-coop-original-2026`)
  await page.waitForFunction(() => document.activeElement?.dataset.recordId === 'media:article:coop-award-2026')
  assert.match(page.url(), /#archive-media-article-coop-award-2026$/)
  await page.goto(`${base}/publications#paper-ethos-2025`)
  await page.waitForFunction(() => document.activeElement?.dataset.recordId === 'paper:ethos-2025')
  assert.match(page.url(), /#archive-paper-ethos-2025$/)
  await page.goto(`${base}/publications#recent-presentations`)
  await page.waitForURL(`${base}/research#presentations`)
  assert.equal(await page.locator('#presentations').count(), 1, 'legacy publication sections remain owned by Research')
  await page.goto(`${base}/media#writing`)
  await page.waitForFunction(() => document.activeElement?.dataset.recordId?.startsWith('media:writing:'))
  assert.match(page.url(), /\/archive\?category=Media#archive-media-writing-/, 'compatible legacy category remains while the record is revealed')
  await page.goto(`${base}/experience#project-index`)
  await page.waitForFunction(() => document.activeElement?.dataset.recordId?.startsWith('project:'))
  await page.goto(`${base}/collection/activities-service#entry-1-3`)
  await page.waitForFunction(() => document.activeElement?.dataset.recordId === 'collection:activities-service:equestrian-sport')
  await page.getByRole('button', { name: /Link to Equestrian sport/ }).click()
  await page.waitForFunction(() => document.activeElement?.dataset.recordId === 'collection:activities-service:equestrian-sport')
  await page.getByRole('button', { name: /Link to Equestrian sport/ }).click()
  await page.waitForFunction(() => document.activeElement?.dataset.recordId === 'collection:activities-service:equestrian-sport')
  assert.equal(await page.locator('[data-record-id="collection:activities-service:equestrian-sport"]').evaluate(element => element === document.activeElement), true, 'same-hash activation still focuses the card')

  await page.goto(`${base}/collection?topic=presentations`)
  await page.waitForURL(/category=Presentation/)
  assert.match(page.url(), /category=Presentation/)
  assert.ok(await page.locator('.archive-card').count() > 0)
  await page.goto(`${base}/collection/engineering-projects`)
  await page.waitForURL(/\/archive\?q=/)
  assert.match(decodeURIComponent(page.url()), /q=Engineering\+and\+projects|q=Engineering and projects/)
  assert.ok(await page.locator('.archive-card').count() > 0)
  await context.close()

  const mobileContext = await browser.newContext({ viewport: { width: 390, height: 844 } })
  const mobile = await mobileContext.newPage(); observeRuntime(mobile)
  await mobile.goto(`${base}/archive`)
  await mobile.keyboard.press('Shift+/')
  assert.notEqual(await mobile.locator('#archive-search').evaluate(element => element === document.activeElement), true, 'modified slash does not steal focus')
  await mobile.keyboard.press('/')
  assert.equal(await mobile.locator('#archive-search').evaluate(element => element === document.activeElement), true)
  const trigger = mobile.getByRole('button', { name: 'Filters', exact: true }); await trigger.click()
  const dialog = mobile.getByRole('dialog', { name: 'Filter the archive' })
  assert.equal(await dialog.getAttribute('aria-modal'), 'true')
  assert.equal(await mobile.locator('.archive-hero').getAttribute('inert'), '')
  assert.equal(await mobile.evaluate(() => document.body.style.overflow), 'hidden')
  if (evidence) await mobile.screenshot({ path: path.join(evidence, 'archive-drawer-390-light.png') })
  await dialog.locator('button').last().focus(); await mobile.keyboard.press('Tab')
  assert.equal(await dialog.locator('button').first().evaluate(element => element === document.activeElement), true, 'Tab wraps inside drawer')
  await mobile.keyboard.press('Shift+Tab')
  assert.equal(await dialog.locator('button').last().evaluate(element => element === document.activeElement), true, 'Shift+Tab wraps inside drawer')
  await mobile.keyboard.press('Escape')
  assert.equal(await trigger.evaluate(element => element === document.activeElement), true)
  assert.equal(await dialog.count(), 0, 'closed drawer is hidden')
  assert.equal(await mobile.locator('.archive-hero').getAttribute('inert'), null)
  assert.equal(await mobile.evaluate(() => document.body.style.overflow), '')
  await trigger.click(); await mobile.locator('.archive-filter-scrim').click({ position: { x: 10, y: 10 } }); assert.equal(await trigger.evaluate(element => element === document.activeElement), true, 'scrim closure restores focus')
  await trigger.click(); await mobile.setViewportSize({ width: 900, height: 844 }); assert.equal(await mobile.locator('.archive-filters.is-open').count(), 0, 'desktop resize exits modal state')
  await mobileContext.close()
  if (evidence) {
    const darkDesktopContext = await browser.newContext({ viewport: { width: 1200, height: 900 } })
    await darkDesktopContext.addInitScript(() => localStorage.setItem('udbhav-theme', 'dark'))
    const darkDesktop = await darkDesktopContext.newPage(); observeRuntime(darkDesktop)
    await darkDesktop.goto(`${base}/archive`)
    assert.equal(await darkDesktop.locator('html').getAttribute('data-theme'), 'dark')
    await darkDesktop.screenshot({ path: path.join(evidence, 'archive-default-1200-dark.png') })
    await darkDesktopContext.close()

    const darkMobileContext = await browser.newContext({ viewport: { width: 390, height: 844 } })
    await darkMobileContext.addInitScript(() => localStorage.setItem('udbhav-theme', 'dark'))
    const darkMobile = await darkMobileContext.newPage(); observeRuntime(darkMobile)
    await darkMobile.goto(`${base}/archive`)
    await darkMobile.getByRole('button', { name: 'Filters', exact: true }).click()
    assert.equal(await darkMobile.getByRole('dialog', { name: 'Filter the archive' }).getAttribute('aria-modal'), 'true')
    await darkMobile.screenshot({ path: path.join(evidence, 'archive-drawer-390-dark.png') })
    await darkMobileContext.close()
  }
  assert.deepEqual(errors, [])
  console.log('PASS curation/archive: lossless source adaptation, typed facets and counts, collision-free routing, canonical URL state, exact sorting, keyboard drawer behavior, and voice constraints.')
} finally { await browser.close(); server.close(); await once(server, 'close') }
