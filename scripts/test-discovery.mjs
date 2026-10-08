import assert from 'node:assert/strict'
import { once } from 'node:events'
import { mkdir } from 'node:fs/promises'
import { chromium } from 'playwright'
import { createServer as createViteServer } from 'vite'
import { createAppServer } from '../server.mjs'

const vite = await createViteServer({ server: { middlewareMode: true, hmr: false }, appType: 'custom' })
let registry
let archiveCases
try {
  const content = await vite.ssrLoadModule('/src/contentRegistry.ts')
  const relations = await vite.ssrLoadModule('/src/contentRelations.ts')
  const search = await vite.ssrLoadModule('/src/searchRanking.ts')
  const portfolio = await vite.ssrLoadModule('/src/portfolioContent.ts')
  registry = content.publicContentRegistry
  assert.equal(new Set(registry.map(item => item.id)).size, registry.length, 'registry IDs are unique')
  assert.equal(registry.filter(item => item.kind === 'Software').length, 9, 'all nine software projects are indexed')
  assert.equal(registry.filter(item => item.id.startsWith('media:article:')).length, 6, 'article editions are deduplicated by story group')
  assert.ok(registry.every(item => item.href.startsWith('/')), 'every search destination is an internal canonical href')
  const byId = new Map(registry.map(item => [item.id, item]))
  for (const [study, items] of Object.entries(relations.studyRelations)) {
    assert.ok(items.length > 0, `${study} has curated relationships`)
    for (const item of items) assert.ok(byId.has(item.id), `${study}: ${item.id} resolves`)
  }
  assert.equal(search.rankContent('physician segmentation', 'All')[0]?.id, 'study:organ-segmentation')
  assert.equal(search.rankContent('physician segmentation', 'All').some(item => item.id === 'collection:research-record:abdominal-organ-auto-segmentation'), false, 'canonical studies suppress source-identical historical echoes')
  assert.ok(search.rankContent('explorer', 'Software').every(item => item.kind === 'Software'))
  for (const kind of ['Study', 'Software', 'Paper', 'Presentation', 'Media', 'Collection']) {
    const defaults = search.rankContent('', kind)
    assert.ok(defaults.length > 0 && defaults.length <= 6, `${kind} has bounded empty-query defaults`)
    assert.ok(defaults.every(item => item.kind === kind), `${kind} defaults stay in category`)
  }
  assert.deepEqual(search.rankContent('no-such-portfolio-result-zz', 'All'), [])
  const archiveRecords = portfolio.portfolioCollections.flatMap(collection => collection.groups.flatMap((group, groupIndex) => group.items.map((item, itemIndex) => {
    const rawId = item.presentationId ? `presentation:${item.presentationId}` : content.collectionRecordContentId(collection.id, item)
    const resolvedId = content.resolveCollectionRecordContentId(collection.id, item)
    assert.ok(byId.has(resolvedId), `${collection.id}/${groupIndex}/${itemIndex}: ${resolvedId} resolves`)
    return { collectionId: collection.id, groupIndex, itemIndex, title: item.title, rawId, resolvedId }
  })))
  archiveCases = {
    historical: archiveRecords.find(item => item.rawId === item.resolvedId && item.resolvedId.startsWith('collection:')),
    canonical: archiveRecords.find(item => item.rawId !== item.resolvedId),
    byCollection: Object.fromEntries(portfolio.portfolioCollections.map(collection => [collection.id, archiveRecords.filter(item => item.collectionId === collection.id).map(item => item.resolvedId)])),
  }
  assert.ok(archiveCases.historical && archiveCases.canonical, 'archive includes historical-only and canonical duplicate cases')
  console.log(`PASS registry: ${registry.length} unique source-derived records, all archive saves resolve, category defaults are bounded, and ranking/relations/no-result behavior hold.`)
} finally {
  await vite.close()
}

const server = createAppServer()
server.listen(0, '127.0.0.1')
await once(server, 'listening')
const base = `http://127.0.0.1:${server.address().port}`
const browser = await chromium.launch({ headless: true, ...(process.env.PLAYWRIGHT_CHANNEL ? { channel: process.env.PLAYWRIGHT_CHANNEL } : {}) })
const errors = []
const screenshotDir = process.env.DISCOVERY_SCREENSHOTS_DIR
if (screenshotDir) await mkdir(screenshotDir, { recursive: true })

async function openSearch(page) {
  await page.getByRole('button', { name: 'Search site' }).click()
  const input = page.locator('#global-search')
  await input.waitFor()
  assert.equal(await input.evaluate(element => element === document.activeElement), true, 'search input receives focus')
  return input
}

try {
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } })
  const page = await context.newPage()
  page.on('pageerror', error => errors.push(error.message))
  await page.goto(base)
  assert.equal((await page.evaluate(() => performance.getEntriesByType('resource').map(entry => entry.name).filter(name => name.includes('SearchDialog')))).length, 0, 'search chunk is not loaded initially')
  const input = await openSearch(page)
  assert.equal(await page.getByRole('searchbox', { name: 'Search the portfolio' }).count(), 1, 'search input has an explicit accessible name')
  assert.equal(await page.locator('main').getAttribute('inert'), '', 'main content is inert while the modal is open')
  assert.equal(await page.locator('.header-inner').getAttribute('inert'), '', 'header controls are inert while the modal is open')
  assert.ok((await page.evaluate(() => performance.getEntriesByType('resource').map(entry => entry.name).filter(name => name.includes('SearchDialog')))).length > 0, 'search chunk loads on demand')
  await input.fill('physician segmentation')
  await page.waitForFunction(() => document.querySelector('[data-search-id="study:organ-segmentation"]'))
  if (screenshotDir) await page.screenshot({ path: `${screenshotDir}/search-light-1440.png` })
  await page.locator('[data-search-id="study:organ-segmentation"] .save-button').click()
  assert.equal(await page.locator('[data-search-id="study:organ-segmentation"] .save-button').getAttribute('aria-pressed'), 'true')
  await page.keyboard.press('Escape')
  assert.equal(await page.getByRole('button', { name: 'Search site' }).evaluate(element => element === document.activeElement), true, 'Escape restores focus')
  assert.equal(await page.locator('main').getAttribute('inert'), null, 'main content is restored after closing the modal')

  await page.keyboard.press('Meta+K')
  await page.locator('#global-search').fill('explorer')
  await page.getByRole('button', { name: 'Software', exact: true }).click()
  assert.ok(await page.locator('[data-search-id^="software:"]').count() >= 2, 'category filter keeps software results')
  await page.locator('#global-search').fill('zzzz-no-result')
  await page.getByText(/No matches for/).waitFor()
  await page.getByRole('button', { name: 'Clear search' }).click()
  for (const kind of ['Paper', 'Presentation', 'Collection']) {
    await page.getByRole('button', { name: kind, exact: true }).click()
    assert.ok(await page.locator(`[data-search-id] .meta`).filter({ hasText: kind }).count() > 0, `${kind} has empty-query browse results`)
  }
  await page.getByRole('button', { name: 'Close search' }).click()

  await page.goto(`${base}/reading-list`)
  await page.locator('[data-reading-id="study:organ-segmentation"]').waitFor()
  await page.reload()
  await page.locator('[data-reading-id="study:organ-segmentation"]').waitFor()
  await page.evaluate(() => Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: value => { window.__copiedReadingList = value; return Promise.resolve() } } }))
  await page.getByRole('button', { name: 'Copy share link' }).click()
  await page.getByText('Link copied.').waitFor()
  assert.match(await page.evaluate(() => window.__copiedReadingList), /reading-list\?list=study%3Aorgan-segmentation/)
  if (screenshotDir) await page.screenshot({ path: `${screenshotDir}/reading-list-light-1440.png` })
  console.log('PASS search and save: lazy load, multiword ranking, category/no-result controls, focus restoration, persistence, and reload.')

  const second = await context.newPage()
  second.on('pageerror', error => errors.push(error.message))
  await second.goto(`${base}/reading-list`)
  await page.goto(base)
  await openSearch(page)
  await page.locator('#global-search').fill('ProtocolIQ')
  await page.locator('[data-search-id="software:protocoliq"] .save-button').click()
  await second.locator('[data-reading-id="software:protocoliq"]').waitFor({ timeout: 5000 })
  console.log('PASS storage event: a save in one tab appeared in the open reading list in another tab.')

  const storedBeforeShare = await second.evaluate(() => localStorage.getItem('udbhav-reading-list:v1'))
  const sharedIds = ['paper:ethos-2025', 'paper:ethos-2025', ...Array.from({ length: 25 }, (_, index) => `unknown:${index}`)]
  await second.goto(`${base}/reading-list?list=${sharedIds.map(encodeURIComponent).join(',')}`)
  assert.equal(await second.locator('.shared-list [data-reading-id="paper:ethos-2025"]').count(), 1)
  assert.equal(await second.evaluate(() => localStorage.getItem('udbhav-reading-list:v1')), storedBeforeShare, 'opening a shared link does not mutate own list')
  await second.getByText(/duplicate ID was removed/).waitFor()
  await second.getByText(/first 24 IDs/).waitFor()
  await second.getByText(/unknown IDs were ignored/).waitFor()
  await second.getByRole('button', { name: 'Merge into my list' }).click()
  await second.locator('[data-reading-id="paper:ethos-2025"]').last().waitFor()

  await second.evaluate(() => Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: () => Promise.reject(new Error('blocked')) } }))
  await second.getByRole('button', { name: 'Copy share link' }).click()
  await second.getByText('Copy was blocked. The link is selected below.').waitFor()
  const shareUrl = await second.getByLabel('Reading list share link').inputValue()
  const freshContext = await browser.newContext({ viewport: { width: 820, height: 900 } })
  const fresh = await freshContext.newPage()
  fresh.on('pageerror', error => errors.push(error.message))
  await fresh.goto(shareUrl)
  assert.equal(await fresh.locator('.shared-list [data-reading-id]').count(), 3, 'fresh context sees the shared list without merging it')
  await fresh.locator('.shared-list [data-reading-id="paper:ethos-2025"] h2 a').click()
  await fresh.waitForURL(/\/publications#paper-ethos-2025$/)
  await freshContext.close()
  await second.getByRole('button', { name: 'Remove ProtocolIQ' }).click()
  assert.equal(await second.locator('section[aria-labelledby="own-list-title"] [data-reading-id="software:protocoliq"]').count(), 0)
  await second.getByRole('button', { name: 'Clear list' }).click()
  await second.getByText('Nothing saved yet.').waitFor()
  console.log('PASS sharing: dedupe/bounds/unknown feedback, isolation, explicit merge, clipboard fallback, fresh context, and destination navigation.')

  await second.goto(base)
  await second.evaluate(() => localStorage.setItem('udbhav-reading-list:v1', '{broken'))
  await second.goto(`${base}/reading-list`)
  await second.getByText(/could not be read/).waitFor()
  await context.close()

  const archiveContext = await browser.newContext({ viewport: { width: 1100, height: 900 } })
  const archive = await archiveContext.newPage()
  archive.on('pageerror', error => errors.push(error.message))
  const registryIds = new Set(registry.map(item => item.id))
  for (const [collectionId, expectedIds] of Object.entries(archiveCases.byCollection)) {
    await archive.goto(`${base}/collection/${collectionId}`)
    const ids = await archive.locator('.collection-layout [data-save-id]').evaluateAll(elements => elements.map(element => element.dataset.saveId))
    assert.deepEqual(ids.sort(), [...expectedIds].sort(), `${collectionId} chapter renders every expected save ID`)
    assert.ok(ids.every(id => registryIds.has(id)), `${collectionId} chapter renders only resolvable save IDs`)
    const searchIds = []
    for (let pageNumber = 1; pageNumber <= Math.ceil(expectedIds.length / 12); pageNumber += 1) {
      await archive.goto(`${base}/collection?topic=${collectionId}&page=${pageNumber}`)
      searchIds.push(...await archive.locator('.search-results [data-save-id]').evaluateAll(elements => elements.map(element => element.dataset.saveId)))
    }
    assert.deepEqual(searchIds.sort(), [...expectedIds].sort(), `${collectionId} archive search renders every expected save ID`)
  }
  for (const item of [archiveCases.historical, archiveCases.canonical]) {
    await archive.goto(`${base}/collection/${item.collectionId}`)
    await archive.locator(`[data-save-id="${item.resolvedId}"]`).first().click()
    await archive.goto(`${base}/collection?q=${encodeURIComponent(item.title)}`)
    assert.ok(await archive.locator(`[data-save-id="${item.resolvedId}"]`).count() > 0, `${item.title} resolves in archive search`)
  }
  await archive.goto(`${base}/reading-list`)
  await archive.locator(`[data-reading-id="${archiveCases.historical.resolvedId}"]`).waitFor()
  await archive.locator(`[data-reading-id="${archiveCases.canonical.resolvedId}"]`).waitFor()
  await archive.reload()
  assert.equal(await archive.locator('[data-reading-id]').count(), 2, 'historical and canonical archive saves survive reload')
  const archiveShare = await archive.getByLabel('Reading list share link').inputValue()
  assert.ok(archiveShare.includes(encodeURIComponent(archiveCases.historical.resolvedId)) && archiveShare.includes(encodeURIComponent(archiveCases.canonical.resolvedId)), 'archive share link contains both canonical IDs')
  await archiveContext.close()
  console.log('PASS archive identity: every chapter and archive-search save resolves; historical and canonical duplicates survive search, reload, and sharing.')

  const blockedContext = await browser.newContext({ viewport: { width: 820, height: 900 } })
  await blockedContext.addInitScript(() => Object.defineProperty(window, 'localStorage', { configurable: true, get() { throw new Error('blocked') } }))
  const blocked = await blockedContext.newPage()
  blocked.on('pageerror', error => errors.push(error.message))
  await blocked.goto(base)
  await openSearch(blocked)
  await blocked.locator('#global-search').fill('ProtocolIQ')
  await blocked.locator('[data-search-id="software:protocoliq"] .save-button').click()
  assert.equal(await blocked.locator('[data-search-id="software:protocoliq"] .save-button').getAttribute('aria-pressed'), 'true')
  await blocked.locator('[data-search-id="software:protocoliq"] .save-feedback').getByText(/only for this tab/).waitFor()
  await blocked.locator('.search-dialog-footer a[href="/reading-list"]').click()
  await blocked.locator('[data-reading-id="software:protocoliq"]').waitFor()
  await blockedContext.close()

  const quotaContext = await browser.newContext({ viewport: { width: 820, height: 900 } })
  await quotaContext.addInitScript(() => {
    const original = Storage.prototype.setItem
    Storage.prototype.setItem = function (key, value) {
      if (key === 'udbhav-reading-list:v1') throw new DOMException('Quota exceeded', 'QuotaExceededError')
      return original.call(this, key, value)
    }
  })
  const quota = await quotaContext.newPage()
  quota.on('pageerror', error => errors.push(error.message))
  await quota.goto(base)
  await openSearch(quota)
  await quota.locator('#global-search').fill('ProtocolIQ')
  await quota.locator('[data-search-id="software:protocoliq"] .save-button').click()
  assert.equal(await quota.locator('[data-search-id="software:protocoliq"] .save-button').getAttribute('aria-pressed'), 'true')
  await quota.locator('[data-search-id="software:protocoliq"] .save-feedback').getByText(/only for this tab/).waitFor()
  await quota.locator('.search-dialog-footer a[href="/reading-list"]').click()
  await quota.locator('[data-reading-id="software:protocoliq"]').waitFor()
  await quotaContext.close()
  console.log('PASS storage failures: blocked and quota-limited saves warn in place and survive full same-tab navigation.')

  const recoveryContext = await browser.newContext({ viewport: { width: 820, height: 900 } })
  const recovery = await recoveryContext.newPage()
  recovery.on('pageerror', error => errors.push(error.message))
  await recovery.goto(base)
  await recovery.evaluate(() => localStorage.setItem('udbhav-reading-list:v1', JSON.stringify({ version: 1, ids: ['study:organ-segmentation'] })))
  await recoveryContext.addInitScript(() => {
    const original = Storage.prototype.setItem
    window.__allowPersistentReadingListWrites = false
    Storage.prototype.setItem = function (key, value) {
      if (key === 'udbhav-reading-list:v1' && !window.__allowPersistentReadingListWrites) throw new DOMException('Quota exceeded', 'QuotaExceededError')
      return original.call(this, key, value)
    }
  })
  await recovery.reload()
  await openSearch(recovery)
  await recovery.locator('#global-search').fill('ProtocolIQ')
  await recovery.locator('[data-search-id="software:protocoliq"] .save-button').click()
  assert.deepEqual(await recovery.evaluate(() => JSON.parse(sessionStorage.getItem('udbhav-reading-list:visit:v1')).ids), ['study:organ-segmentation', 'software:protocoliq'], 'tab fallback starts from the persistent list')
  await recovery.locator('.search-dialog-footer a[href="/reading-list"]').click()
  assert.equal(await recovery.locator('[data-reading-id]').count(), 2, 'tab fallback overrides the stale persistent list after navigation')
  await recovery.locator('[data-reading-id="study:organ-segmentation"] button').click()
  await recovery.goto(base)
  await recovery.goto(`${base}/reading-list`)
  assert.equal(await recovery.locator('[data-reading-id="study:organ-segmentation"]').count(), 0, 'fallback removal survives navigation')
  assert.equal(await recovery.locator('[data-reading-id="software:protocoliq"]').count(), 1)
  await recovery.getByRole('button', { name: 'Clear list' }).click()
  await recovery.goto(base)
  await recovery.goto(`${base}/reading-list`)
  await recovery.getByText('Nothing saved yet.').waitFor()
  assert.equal(await recovery.evaluate(() => JSON.parse(sessionStorage.getItem('udbhav-reading-list:visit:v1')).ids.length), 0, 'explicitly empty fallback overrides stale persistent data')
  await openSearch(recovery)
  await recovery.locator('#global-search').fill('ProtocolIQ')
  await recovery.evaluate(() => { window.__allowPersistentReadingListWrites = true })
  await recovery.locator('[data-search-id="software:protocoliq"] .save-button').click()
  assert.equal(await recovery.evaluate(() => sessionStorage.getItem('udbhav-reading-list:visit:v1')), null, 'successful persistent write clears the tab fallback')
  assert.deepEqual(await recovery.evaluate(() => JSON.parse(localStorage.getItem('udbhav-reading-list:v1')).ids), ['software:protocoliq'])
  await recovery.locator('.search-dialog-footer a[href="/reading-list"]').click()
  await recovery.locator('[data-reading-id="software:protocoliq"]').waitFor()
  await recoveryContext.close()
  console.log('PASS fallback authority: add/remove/clear beat stale persistent data across navigation, and a recovered local write retires the fallback.')

  const pageOnlyContext = await browser.newContext({ viewport: { width: 820, height: 900 } })
  await pageOnlyContext.addInitScript(() => {
    Object.defineProperty(window, 'localStorage', { configurable: true, get() { throw new Error('blocked') } })
    Object.defineProperty(window, 'sessionStorage', { configurable: true, get() { throw new Error('blocked') } })
  })
  const pageOnly = await pageOnlyContext.newPage()
  pageOnly.on('pageerror', error => errors.push(error.message))
  await pageOnly.goto(base)
  await openSearch(pageOnly)
  await pageOnly.locator('#global-search').fill('ProtocolIQ')
  await pageOnly.locator('[data-search-id="software:protocoliq"] .save-button').click()
  const visitLink = pageOnly.getByRole('link', { name: 'Open or share this visit’s list' })
  await visitLink.waitFor()
  assert.match(await visitLink.getAttribute('href'), /reading-list\?list=software%3Aprotocoliq/)
  await visitLink.click()
  await pageOnly.locator('.shared-list [data-reading-id="software:protocoliq"]').waitFor()
  assert.equal(await pageOnly.locator('section[aria-labelledby="own-list-title"] [data-reading-id]').count(), 0, 'page-only recovery opens a separate shared list without auto-merging')
  await pageOnlyContext.close()
  console.log('PASS page-only recovery: when both stores fail, a visible ID-only link opens a shareable separate list through real navigation.')

  const staleContext = await browser.newContext({ viewport: { width: 820, height: 900 } })
  const stale = await staleContext.newPage()
  stale.on('pageerror', error => errors.push(error.message))
  await stale.goto(base)
  await stale.evaluate(() => localStorage.setItem('udbhav-reading-list:v1', JSON.stringify({ version: 1, ids: ['unknown:only'] })))
  await stale.goto(`${base}/reading-list`)
  await stale.getByText(/unknown saved ID was ignored/).waitFor()
  await stale.getByRole('button', { name: 'Clear list' }).click()
  await stale.getByText('Nothing saved yet.').waitFor()
  await stale.evaluate(() => localStorage.setItem('udbhav-reading-list:v1', JSON.stringify({ version: 1, ids: ['unknown:mixed', 'study:organ-segmentation'] })))
  await stale.reload()
  await stale.locator('[data-reading-id="study:organ-segmentation"]').waitFor()
  await stale.getByText(/unknown saved ID was ignored/).waitFor()
  await stale.goto(base)
  await openSearch(stale)
  await stale.locator('#global-search').fill('ProtocolIQ')
  await stale.locator('[data-search-id="software:protocoliq"] .save-button').click()
  await stale.getByText(/outdated saved item was discarded/).waitFor()
  await stale.locator('.search-dialog-footer a[href="/reading-list"]').click()
  assert.equal(await stale.locator('[data-reading-id]').count(), 2, 'valid save succeeds after stale ID cleanup')

  const fullIds = registry.slice(0, 24).map(item => item.id)
  const capacityTarget = registry.find(item => !fullIds.includes(item.id) && item.kind === 'Media')
  assert.ok(capacityTarget, 'capacity test has an unsaved media target')
  await stale.evaluate(ids => localStorage.setItem('udbhav-reading-list:v1', JSON.stringify({ version: 1, ids })), fullIds)
  await stale.goto(`${base}${capacityTarget.href}`)
  const capacityButton = stale.locator(`[data-save-id="${capacityTarget.id}"]`).first()
  await capacityButton.waitFor()
  await capacityButton.click()
  await stale.getByText(`A reading list can contain up to 24 items.`).first().waitFor()
  assert.equal(await capacityButton.getAttribute('aria-pressed'), 'false', 'capacity limit does not claim the extra item was saved')
  await staleContext.close()
  console.log('PASS stale/capacity handling: unknown-only lists can clear, mixed lists self-heal on save, and full lists warn at the save surface.')

  if (screenshotDir) {
    const darkContext = await browser.newContext({ viewport: { width: 1280, height: 900 }, colorScheme: 'dark' })
    const darkPage = await darkContext.newPage()
    await darkPage.goto(base)
    await darkPage.evaluate(() => localStorage.setItem('udbhav-theme', 'dark'))
    await darkPage.reload()
    await openSearch(darkPage)
    await darkPage.locator('#global-search').fill('ProtocolIQ')
    await darkPage.screenshot({ path: `${screenshotDir}/search-dark-1280.png` })
    await darkContext.close()

    const tabletContext = await browser.newContext({ viewport: { width: 820, height: 900 } })
    const tablet = await tabletContext.newPage()
    await tablet.goto(`${base}/research/radiosurgery-planning#study-sources`)
    await tablet.locator('.curated-related').scrollIntoViewIfNeeded()
    await tablet.screenshot({ path: `${screenshotDir}/study-connections-820.png` })
    await tabletContext.close()
  }

  const mobileContext = await browser.newContext({ viewport: { width: 390, height: 844 } })
  const mobile = await mobileContext.newPage()
  mobile.on('pageerror', error => errors.push(error.message))
  await mobile.goto(base)
  await mobile.getByRole('button', { name: 'Open navigation' }).click()
  assert.equal(await mobile.locator('#main-navigation').getAttribute('class'), 'is-open')
  await mobile.keyboard.press('Meta+K')
  await mobile.locator('#global-search').waitFor()
  assert.equal(await mobile.locator('#main-navigation').getAttribute('class'), '')
  await mobile.locator('.search-dialog-footer a[href="/reading-list"]').focus()
  await mobile.keyboard.press('Tab')
  assert.equal(await mobile.getByRole('button', { name: 'Close search' }).evaluate(element => element === document.activeElement), true, 'focus wraps within dialog')
  if (screenshotDir) await mobile.screenshot({ path: `${screenshotDir}/search-mobile-390.png` })
  await mobile.keyboard.press('Escape')
  assert.equal(await mobile.getByRole('button', { name: 'Search site' }).evaluate(element => element === document.activeElement), true)
  assert.equal(await mobile.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, 'mobile page has no horizontal overflow')
  await mobileContext.close()
  assert.deepEqual(errors, [])
  console.log('PASS accessibility/mobile: menu conflict, keyboard shortcut, focus trap, Escape restoration, and 390px overflow.')
} finally {
  await browser.close()
  server.close()
  await once(server, 'close')
}
