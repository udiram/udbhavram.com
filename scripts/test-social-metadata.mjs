import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const origin = 'https://udbhavram.com'
const imagePath = '/assets/optimized/udbhav-ram-portrait-social-2026.jpg'
const imageUrl = `${origin}${imagePath}`
const imageAlt = 'Portrait of Udbhav Ram outside McMaster University Hall'
const rejectedDefault = '/assets/sourced/mcmaster-employer-awards-hero.jpg'

function metaContent(html, attribute, value) {
  const escapedValue = value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return html.match(new RegExp(`<meta\\s+${attribute}="${escapedValue}"\\s+content="([^"]+)"\\s*\\/>`))?.[1]
}

function jpegDimensions(buffer) {
  assert.equal(buffer[0], 0xff, 'Social preview image is a JPEG')
  assert.equal(buffer[1], 0xd8, 'Social preview image has a JPEG start marker')
  let offset = 2
  while (offset < buffer.length) {
    if (buffer[offset] !== 0xff) break
    const marker = buffer[offset + 1]
    const length = buffer.readUInt16BE(offset + 2)
    if (marker >= 0xc0 && marker <= 0xc3) {
      return { height: buffer.readUInt16BE(offset + 5), width: buffer.readUInt16BE(offset + 7) }
    }
    offset += 2 + length
  }
  throw new Error('Could not read social preview JPEG dimensions')
}

const source = await readFile(`public${imagePath}`)
assert.deepEqual(jpegDimensions(source), { width: 1200, height: 630 })

const routes = JSON.parse(await readFile('src/routeMeta.json', 'utf8'))
const documents = [
  ...Object.keys(routes).map((route) => ({
    route,
    file: route === '/' ? 'dist/index.html' : `dist${route}/index.html`,
  })),
  { route: '/404', file: 'dist/404.html' },
]

for (const { route, file } of documents) {
  const html = await readFile(file, 'utf8')
  assert.equal(metaContent(html, 'property', 'og:image'), imageUrl, `${route}: correct Open Graph image`)
  assert.equal(metaContent(html, 'property', 'og:image:secure_url'), imageUrl, `${route}: secure Open Graph image`)
  assert.equal(metaContent(html, 'property', 'og:image:type'), 'image/jpeg', `${route}: Open Graph MIME type`)
  assert.equal(metaContent(html, 'property', 'og:image:width'), '1200', `${route}: Open Graph width`)
  assert.equal(metaContent(html, 'property', 'og:image:height'), '630', `${route}: Open Graph height`)
  assert.equal(metaContent(html, 'property', 'og:image:alt'), imageAlt, `${route}: accurate Open Graph alt text`)
  assert.equal(metaContent(html, 'name', 'twitter:image'), imageUrl, `${route}: correct Twitter image`)
  assert.equal(metaContent(html, 'name', 'twitter:image:alt'), imageAlt, `${route}: accurate Twitter alt text`)
  assert.ok(!html.includes(rejectedDefault), `${route}: rejected group photo is not default metadata`)
}

console.log(`Passed: ${documents.length} generated documents use the verified 1200x630 portrait for Open Graph and Twitter cards.`)
