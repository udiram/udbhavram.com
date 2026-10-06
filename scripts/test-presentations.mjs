import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'

const source = await readFile('src/presentations.json')
const inventory = JSON.parse(source)
const events = inventory.events
const ids = events.map(e=>e.id)
assert.equal(events.length,27)
assert.equal(new Set(ids).size,27,'Every record has one stable ID')
assert.equal(events.filter(e=>e.recordType!=='outreach_aggregate').length,26)
assert.equal(events.filter(e=>e.recordType==='outreach_aggregate').length,1)
assert.equal(events.filter(e=>e.id.startsWith('aapm-')).length,9)
assert.equal(events.filter(e=>e.id.startsWith('astro-')).length,2)
assert.equal(events.find(e=>e.id==='mcmaster-scec-outreach-through-march-2026').completedTalkCount,4)
assert.match(events.find(e=>e.id==='aiims-2026-researchers-perspective').status,/delivery not independently verified/)
assert.match(events.find(e=>e.id==='astro-2026-3044').presenter,/Yogesh Kumar/)
assert.match(events.find(e=>e.id==='rss-2025-ethos').presenter,/Carlos E. Cardenas/)
for (const id of ['aapm-2025-20068','aapm-2026-27281']) {
  const e=events.find(e=>e.id===id);assert.equal(e.type,'digital-only poster');assert.ok(e.date.includes('/'))
}
for (const event of events) for (const s of event.sources) assert.ok(s.url.startsWith('https://'),'Only public HTTPS source URLs')
for (const route of ['publications','collection/research-record']) {
  const html=await readFile(`dist/${route}/index.html`,'utf8')
  for (const id of ids) assert.equal(html.split(`data-presentation-id="${id}"`).length-1,1,`${route}: ${id} appears exactly once`)
  assert.ok(html.includes('Scheduled talk; delivery not independently verified'))
  assert.ok(html.includes('Four completed talks reported by the speaker'))
}
const manifest=JSON.parse(await readFile('public/downloads/public-cv-manifest.json','utf8'))
const hash=b=>createHash('sha256').update(b).digest('hex')
assert.deepEqual([...manifest.presentationIds].sort(),[...ids].sort(),'CV event parity')
assert.equal(manifest.presentationSourceSha256,hash(source),'Regenerate CV after presentation changes')
assert.equal(manifest.publicationSourceSha256,hash(await readFile('src/bibliography.json')),'Regenerate CV after publication changes')
assert.equal(manifest.pdfSha256,hash(await readFile('public/downloads/Udbhav_Ram_Public_CV_October_2026.pdf')))
const pdf=(await readFile('public/downloads/Udbhav_Ram_Public_CV_October_2026.pdf')).toString('latin1')
for (const id of ids) assert.ok(pdf.includes(`https://udbhavram.com/publications#${id}`),`PDF has event permalink: ${id}`)
const home=await readFile('dist/index.html','utf8')
assert.ok(home.includes(`.pdf?v=${manifest.pdfSha256.slice(0,12)}`),'CV cache version changes with content')
console.log('Passed: 27 stable records, 26 discrete/1 aggregate,9 AAPM,2 ASTRO, qualified roles/dates, page parity, PDF links and CV source/content hashes.')
