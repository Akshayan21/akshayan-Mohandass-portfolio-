import { createRequire } from 'node:module';
import { createServer } from 'node:http';
import { readFileSync, mkdirSync } from 'node:fs';
import { resolve, extname } from 'node:path';
import assert from 'node:assert/strict';
const require=createRequire(import.meta.url);
const {chromium}=require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const root=resolve('dist');
const server=createServer((req,res)=>{
  const url=new URL(req.url,'http://localhost');
  let path=resolve(root,'.'+decodeURIComponent(url.pathname));
  if(!path.startsWith(root)){res.writeHead(403).end();return;}
  if(url.pathname.endsWith('/')) path+='/index.html';
  try{res.setHeader('Content-Type',({'.html':'text/html','.js':'application/javascript','.css':'text/css','.woff2':'font/woff2','.svg':'image/svg+xml'})[extname(path)] || 'application/octet-stream');res.end(readFileSync(path));}catch{res.writeHead(404).end();}
});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
let browser;
try{
  browser=await chromium.launch({headless:true,...(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{})});
  const page=await browser.newPage();
  const errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  const origin=`http://127.0.0.1:${server.address().port}`;
  mkdirSync('test-results',{recursive:true});
  for(const {width,height} of [{width:320,height:900},{width:390,height:844},{width:768,height:900},{width:1000,height:600},{width:1280,height:720},{width:1440,height:1000}]){
    await page.setViewportSize({width,height});
    await page.goto(origin+'/ui-ux-design/');
    await page.evaluate(()=>document.fonts.ready);
    assert.equal(await page.locator('.product-detail-journey li').count(),6);
    assert.equal(await page.locator('.product-detail-deliverables li').count(),9);
    assert.equal(await page.locator('.benefit-card').count(),5);
    assert.equal(await page.locator('.starting-stack-card').count(),4);
    assert.equal(await page.locator('.product-decision-steps > p:has(strong)').count(),5);
    assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`No overflow at ${width}x${height}`);
    if(width>=1000){
      await page.waitForSelector('.benefit-sequence.is-pinned');
      const sequence=page.locator('.benefit-sequence');
      const start=await sequence.evaluate(el=>el.parentElement.getBoundingClientRect().top+scrollY-24);
      await page.evaluate(top=>window.scrollTo({top,behavior:'instant'}),start+600);
      await page.waitForFunction(()=>new DOMMatrix(getComputedStyle(document.querySelector('.benefit-track')).transform).m41 < -200);
      await page.locator('.benefit-card').last().focus();
      await page.waitForFunction(()=>{const rect=document.querySelector('.benefit-card:last-child').getBoundingClientRect();return rect.left>=0 && rect.right<=innerWidth+1;});
      const clipped=await page.locator('.benefit-card').evaluateAll(cards=>cards.some(card=>card.scrollHeight>card.clientHeight+1));
      assert(!clipped,`Method panels fit at ${width}x${height}`);
      await page.screenshot({path:`test-results/product-method-${width}.png`});
      const stack=page.locator('.starting-stack');
      await page.waitForSelector('.starting-stack.is-stacking');
      const top=await stack.locator('.starting-stack-card').nth(1).evaluate(el=>el.getBoundingClientRect().top+scrollY-70);
      await page.evaluate(top=>window.scrollTo({top,behavior:'instant'}),top);
      await page.waitForFunction(()=>new DOMMatrix(getComputedStyle(document.querySelector('.starting-stack-card')).transform).a<.995);
      assert(!(await stack.locator('.starting-stack-card').evaluateAll(cards=>cards.some(card=>card.scrollHeight>card.clientHeight+1))),`Stack copy fits at ${width}x${height}`);
    }else assert.equal(await page.locator('.is-pinned, .is-stacking').count(),0);
    for(const id of ['section-0','section-2','section-4','section-5']){
      await page.locator('#'+id).evaluate(el=>el.scrollIntoView({block:'start',behavior:'instant'}));
      await page.waitForTimeout(850);
      await page.screenshot({path:`test-results/product-${id}-${width}.png`});
    }
  }
  const cta=page.locator('.benefit-card').last().locator('a');
  const url=new URL(await cta.getAttribute('href'),origin);
  assert.equal(url.searchParams.get('service'),'Product UI/UX design');
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.waitForFunction(()=>!document.querySelector('.is-pinned, .is-stacking'));
  assert.equal(await page.locator('.benefit-card:visible').count(),5);
  assert.equal(await page.locator('.starting-stack-card:visible').count(),4);
  const plain=await browser.newPage({javaScriptEnabled:false});
  await plain.goto(origin+'/ui-ux-design/');
  assert.equal(await plain.locator('.benefit-card:visible').count(),5);
  assert.equal(await plain.locator('.starting-stack-card:visible').count(),4);
  await page.goto(url.href);
  assert.equal(await page.locator('input[name=service]:checked').inputValue(),'Product UI/UX design');
  assert.deepEqual(errors,[]);
  console.log('Product layouts passed: six viewports, horizontal movement, keyboard navigation, card fit and stacking, reduced motion, no-JS content, and product enquiry preselection.');
}finally{await browser?.close();server.close();}
