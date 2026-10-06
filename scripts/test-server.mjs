import assert from 'node:assert/strict'
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { createAppServer } from '../server.mjs'

const testRoot = await mkdtemp(join(tmpdir(), 'udbhavram-server-'))
await writeFile(join(testRoot, 'index.html'), '<!doctype html><title>Portfolio</title><main>Portfolio shell</main>')
await writeFile(join(testRoot, 'robots.txt'), 'User-agent: *\nAllow: /\n')
await writeFile(join(testRoot, 'app.js'), 'console.log("portfolio")')
await mkdir(join(testRoot, 'assets'))

const server = createAppServer({ distRoot: testRoot })
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve))
const address = server.address()
const origin = `http://127.0.0.1:${address.port}`

async function request(pathname, init) {
  return fetch(`${origin}${pathname}`, init)
}

try {
  const home = await request('/')
  assert.equal(home.status, 200)
  assert.match(home.headers.get('content-type'), /^text\/html/)
  assert.match(await home.text(), /Portfolio shell/)

  const navigation = await request('/research', { headers: { accept: 'text/html' } })
  assert.equal(navigation.status, 200)
  assert.match(await navigation.text(), /Portfolio shell/)

  await mkdir(join(testRoot, 'research', 'study'), { recursive: true })
  await writeFile(join(testRoot, 'research', 'index.html'), '<title>Research index</title>')
  await writeFile(join(testRoot, 'research', 'study', 'index.html'), '<title>Study detail</title>')
  for (const route of ['/research', '/research/']) {
    const page = await request(route)
    assert.equal(page.status, 200)
    assert.match(await page.text(), /Research index/)
  }
  for (const route of ['/research/study', '/research/study/']) {
    const page = await request(route)
    assert.equal(page.status, 200)
    assert.match(await page.text(), /Study detail/)
    assert.equal(page.headers.get('cache-control'), 'no-cache')
  }
  await writeFile(join(testRoot, '404.html'), '<title>Page not found</title>')
  const unknownPage = await request('/unknown-page', { headers: { accept: 'text/html' } })
  assert.equal(unknownPage.status, 404)
  assert.match(await unknownPage.text(), /Page not found/)
  assert.equal(unknownPage.headers.get('cache-control'), 'no-cache')
  const unknownHead = await request('/unknown-page', { method: 'HEAD', headers: { accept: 'text/html' } })
  assert.equal(unknownHead.status, 404)
  assert.equal(await unknownHead.text(), '')

  const missingAsset = await request('/assets/missing.js', { headers: { accept: '*/*' } })
  assert.equal(missingAsset.status, 404)
  assert.equal(await missingAsset.text(), 'Not found')

  for (const pathname of ['/assets', '/assets/']) {
    const directory = await request(pathname, { headers: { accept: 'text/html' } })
    assert.equal(directory.status, 404)
    assert.equal(await directory.text(), 'Not found')

    const headDirectory = await request(pathname, { method: 'HEAD', headers: { accept: 'text/html' } })
    assert.equal(headDirectory.status, 404)
    assert.equal(await headDirectory.text(), '')
  }

  const malformed = await request('/%E0%A4%A')
  assert.equal(malformed.status, 400)

  const head = await request('/robots.txt', { method: 'HEAD' })
  assert.equal(head.status, 200)
  assert.match(head.headers.get('content-type'), /^text\/plain/)
  assert.equal(await head.text(), '')

  const headNavigation = await request('/research', { method: 'HEAD', headers: { accept: 'text/html' } })
  assert.equal(headNavigation.status, 200)
  assert.match(headNavigation.headers.get('content-type'), /^text\/html/)
  assert.equal(await headNavigation.text(), '')

  const post = await request('/', { method: 'POST' })
  assert.equal(post.status, 405)
  assert.equal(post.headers.get('allow'), 'GET, HEAD')

  console.log('Server regression checks passed.')
} finally {
  await new Promise((resolve, reject) => server.close((error) => (error ? reject(error) : resolve())))
  await rm(testRoot, { recursive: true, force: true })
}
