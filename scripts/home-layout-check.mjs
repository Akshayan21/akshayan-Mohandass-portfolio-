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
  for(const width of [320,390,768,1000,1440]){
    await page.setViewportSize({width,height:900});
    await page.goto(origin);
    await page.evaluate(()=>document.fonts.ready);
    assert.equal(await page.locator('.home-story').count(),2);
    assert.equal(await page.locator('.home-process .starting-stack-card').count(),4);
    assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`No overflow at ${width}`);
    for(const index of [0,1]){
      const story=page.locator('.home-story').nth(index);
      await story.evaluate(el=>window.scrollTo({top:el.getBoundingClientRect().top+scrollY-30,behavior:'instant'}));
      await page.waitForTimeout(1200);
      await page.screenshot({path:`test-results/home-story-${index}-${width}.png`});
    }
    if(width>=1000){
      await page.waitForSelector('.home-process .is-stacking');
      const cards=page.locator('.home-process .starting-stack-card');
      const top=await cards.nth(1).evaluate(el=>el.getBoundingClientRect().top+scrollY-70);
      await page.evaluate(top=>window.scrollTo({top,behavior:'instant'}),top);
      await page.waitForFunction(()=>new DOMMatrix(getComputedStyle(document.querySelector('.home-process .starting-stack-card')).transform).a<.995);
      await page.screenshot({path:`test-results/home-process-${width}.png`});
    }else assert.equal(await page.locator('.home-process .is-stacking').count(),0);
  }
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.waitForFunction(()=>!document.querySelector('.home-process .is-stacking'));
  assert.equal(await page.locator('.home-process .starting-stack-card:visible').count(),4);
  for(const piece of await page.locator('[data-story-piece]').all()) assert.equal(await piece.evaluate(el=>getComputedStyle(el).transform),'none');
  const plain=await browser.newPage({javaScriptEnabled:false});
  await plain.goto(origin);
  assert.equal(await plain.locator('.home-story:visible').count(),2);
  assert.equal(await plain.locator('.home-process .starting-stack-card:visible').count(),4);
  assert.deepEqual(errors,[]);
  console.log('Home layout passed: 5 widths, animated story panels, sticky stack scaling, reduced-motion cleanup, no-JS content, no browser errors.');
}finally{await browser?.close();server.close();}
