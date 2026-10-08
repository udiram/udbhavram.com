import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import { once } from 'node:events'
import { createAppServer } from '../server.mjs'
import { chromium } from 'playwright'

const inventory=JSON.parse(await fs.readFile('src/presentations.json','utf8'))
const ids=inventory.events.map(e=>e.id)
let server
let base=process.env.TEST_ORIGIN
if(!base){server=createAppServer();server.listen(0,'127.0.0.1');await once(server,'listening');base=`http://127.0.0.1:${server.address().port}`}
const browser=await chromium.launch({headless:true,channel:process.env.PLAYWRIGHT_CHANNEL||'chrome'})
const errors=[]
async function targeted(page,id){
 await page.waitForFunction(id=>{const t=document.getElementById(id);if(!t)return false;const r=t.getBoundingClientRect(),header=document.querySelector('.site-header').getBoundingClientRect();return t.dataset.permalinkTarget==='true'&&document.activeElement===t&&r.top>=header.bottom&&r.top<innerHeight-60},id,{timeout:5000})
 const outline=await page.locator(`[id="${id}"]`).evaluate(e=>getComputedStyle(e).outlineStyle)
 assert.equal(outline,'solid',`${id}: visible target outline`)
}
try{
 for(const width of [1440,390]){
  const context=await browser.newContext({viewport:{width,height:900}})
  context.on('page',page=>page.on('pageerror',e=>errors.push(e.message)))
  const page=await context.newPage()
  await page.goto(`${base}/publications`)
  assert.equal(await page.locator('[data-presentation-id]').count(),27)
  for(const id of ids){
   const link=page.locator(`[id="${id}"] a[aria-label^="Permalink to "]`)
   const href=await link.getAttribute('href');assert.equal(href,`/publications#${id}`)
   await link.click();await targeted(page,id)
   // Re-click the identical hash: hashchange does not fire for this case.
   await link.click();await targeted(page,id)
   // A copied permalink must work on an entirely fresh page, then reload.
   const fresh=await context.newPage();await fresh.goto(base+href);await targeted(fresh,id)
   await fresh.reload();await targeted(fresh,id);await fresh.close()
  }
  console.log(`PASS ${width}px: all27 permalink clicks, same-hash clicks, copied URLs in fresh tabs, reload and visible focus/highlight.`)
  for(const id of ids){
   await page.goto(`${base}/collection/research-record#${id}`);await targeted(page,id)
   await page.locator(`[id="${id}"] a[aria-label^="Permalink to "]`).click();await page.waitForURL(`${base}/publications#${id}`);await targeted(page,id)
  }
  console.log(`PASS ${width}px: all27 collection permalinks and cross-page targets.`)
  await page.goto(`${base}/collection?topic=presentations&q=CAP`)
  await page.locator('.search-results h2 a').first().click()
  const searchTarget=new URL(page.url()).hash.slice(1);await targeted(page,searchTarget)
  await page.goBack();assert.equal(await page.locator('#collection-search').inputValue(),'CAP')
  await page.goForward();await targeted(page,searchTarget)
  await page.goto(`${base}/collection?topic=presentations&page=3`)
  await page.waitForFunction(()=>document.querySelector('.pagination')?.textContent.includes('Page 3'))
  const pagedHref=await page.locator('.search-results h2 a').first().getAttribute('href')
  await page.locator('.search-results h2 a').first().click();await targeted(page,pagedHref.split('#')[1])
  await page.goBack();await page.waitForFunction(()=>document.querySelector('.pagination')?.textContent.includes('Page 3'))
  await page.goForward();await targeted(page,pagedHref.split('#')[1])
  await page.goto(`${base}/publications#${ids[0]}`);await targeted(page,ids[0])
  await page.locator(`[id="${ids[1]}"] a[aria-label^="Permalink to "]`).click();await targeted(page,ids[1])
  await page.goBack();await targeted(page,ids[0]);await page.goForward();await targeted(page,ids[1])
  await page.goto(`${base}/collection/research-record#entry-2-2`);await targeted(page,'cumpc-2022-abdominal-segmentation')
  await page.goto(`${base}/#publications`);await page.waitForFunction(()=>document.querySelector('.publications-disclosure')?.open)
  assert.ok(await page.locator('#publications').isVisible())
  console.log(`PASS ${width}px: filtered/paginated results, Back/Forward, old anchors and collapsed content.`)
  await context.close()
 }
 assert.deepEqual(errors,[])
 console.log('All permalink regressions passed; no JavaScript exceptions.')
}finally{await browser.close();if(server){server.close();await once(server,'close')}}
