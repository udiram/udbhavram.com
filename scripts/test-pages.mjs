import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { once } from 'node:events'
import { createAppServer } from '../server.mjs'

const routes = JSON.parse(await readFile(new URL('../src/routeMeta.json', import.meta.url), 'utf8'))
const server = createAppServer()
server.listen(0, '127.0.0.1')
await once(server, 'listening')
const base = `http://127.0.0.1:${server.address().port}`
const escape = value => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
try {
  for (const [route, meta] of Object.entries(routes)) {
    for (const path of new Set([route, `${route.replace(/\/$/, '')}/`])) {
      const response = await fetch(base + path)
      const html = await response.text()
      assert.equal(response.status, 200, path)
      assert.equal(response.headers.get('cache-control'), 'no-cache', path)
      assert.ok(html.includes(`<title>${escape(meta.title)}</title>`), path)
      assert.ok(html.includes(`<link rel="canonical" href="https://udbhavram.com${route}"`), path)
      assert.ok(html.includes('<h1'), `Prerendered content: ${path}`)
      assert.ok(!html.includes('noindex'), `Indexable: ${path}`)
    }
  }
  const robots = await (await fetch(`${base}/robots.txt`)).text()
  assert.ok(robots.includes('Allow: /'))
  assert.ok(robots.includes('Sitemap: https://udbhavram.com/sitemap.xml'))
  const sitemap = await (await fetch(`${base}/sitemap.xml`)).text()
  assert.equal((sitemap.match(/<loc>/g) || []).length, Object.keys(routes).length)
  const missing = await fetch(`${base}/missing-page`, { headers: { Accept: 'text/html' } })
  assert.equal(missing.status, 404)
  assert.ok((await missing.text()).includes('noindex, follow'))
  const cv = await fetch(`${base}/downloads/Udbhav_Ram_Public_CV_October_2026.pdf`)
  assert.equal(cv.status, 200)
  assert.equal(cv.headers.get('content-type'), 'application/pdf')
  console.log(`Passed: ${Object.keys(routes).length} production route documents, trailing slashes, metadata, indexing, sitemap, 404, and CV.`)
} finally {
  server.close()
  await once(server, 'close')
}
