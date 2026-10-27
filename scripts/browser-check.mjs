import { createRequire } from 'node:module';
import { createServer } from 'node:http';
import { readFileSync, mkdirSync } from 'node:fs';
import { resolve, extname } from 'node:path';
import assert from 'node:assert/strict';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const root = resolve('dist');
const server = createServer((req,res) => {
  const url = new URL(req.url,'http://localhost');
  let path = resolve(root, '.' + decodeURIComponent(url.pathname));
  if(!path.startsWith(root)) { res.writeHead(403).end(); return; }
  if(url.pathname.endsWith('/')) path += '/index.html';
  try { const type = {'.html':'text/html','.css':'text/css','.js':'application/javascript','.svg':'image/svg+xml','.woff2':'font/woff2'}[extname(path)] || 'application/octet-stream'; res.writeHead(200,{'Content-Type':type}); res.end(readFileSync(path)); } catch { res.writeHead(404).end(); }
});
await new Promise(r => server.listen(0,'127.0.0.1',r));
const origin=`http://127.0.0.1:${server.address().port}`;
let browser;
try {
  browser = await chromium.launch({headless:true, ...(process.env.CHROME_PATH ? {executablePath:process.env.CHROME_PATH} : {})});
  const context = await browser.newContext();
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror',e=>errors.push(e.message));
  mkdirSync('test-results',{recursive:true});
  for(const size of [{width:1000,height:500},{width:1280,height:650},{width:1280,height:720},{width:1536,height:864}]){
    await page.setViewportSize(size);
    await page.goto(origin+'/');
    await page.waitForSelector('.service-explorer.is-interactive');
    await page.waitForSelector('.service-explorer.is-scroll-driven');
    const geometry=await page.locator('.service-explorer').evaluate(el=>({start:el.parentElement.getBoundingClientRect().top+scrollY-32,height:el.getBoundingClientRect().height}));
    assert(geometry.height<=size.height-60,'Service sequence fits short viewport');
    for(const index of [0,1,2,3,0]){
      await page.evaluate(({start,index})=>window.scrollTo({top:start+innerHeight*4*.8*(index+.25)/4,behavior:'instant'}),{start:geometry.start,index});
      await page.waitForFunction(index=>document.querySelector(`#service-choice-${index}`).getAttribute('aria-expanded')==='true',index);
      await page.waitForFunction(()=>!document.querySelector('.service-transition-ghost'));
      const fit=await page.locator(`#service-panel-${index}`).evaluate(el=>({content:el.scrollHeight,available:el.clientHeight,overflow:getComputedStyle(el).overflowY}));
      assert(fit.content<=fit.available+1,`Panel fits without inner scrolling at ${size.width}x${size.height}, service ${index}: ${JSON.stringify(fit)}`);
      assert(!['auto','scroll'].includes(fit.overflow),'No internal scrolling');
      assert(await page.evaluate(()=>[...document.querySelectorAll('.service-transition-ghost')].every(el=>el.getBoundingClientRect().right<=innerWidth+1)),'Crossfade stays within viewport');
    }
    await page.waitForFunction(()=>!document.querySelector('.service-transition-ghost') && [...document.querySelectorAll('#service-panel-0 .service-panel-copy > *')].every(el=>getComputedStyle(el).opacity==='1'));
    await page.locator('#service-panel-0').evaluate(el=>el.scrollTop=el.scrollHeight);
    assert(await page.locator('#service-panel-0 a').isVisible());
    await page.screenshot({path:`test-results/services-${size.width}x${size.height}.png`});
    console.log(`Service scroll verified at ${size.width}x${size.height}`);
  }
  for(const width of [320,360,390,430,600,760,768,820,999,1000,1024,1099,1100,1280,1440,1920,2560]) {
    await page.setViewportSize({width,height:1000});
    for(const route of ['','website-design-development/','startup-landing-pages/','ui-ux-design/']) {
      await page.goto(`${origin}/${route}`);
      await page.evaluate(()=>document.fonts.ready);
      const overflow = await page.evaluate(()=>[...document.querySelectorAll('body *')].filter(el=>el.getBoundingClientRect().right>innerWidth+1 && getComputedStyle(el).position!=='absolute').map(el=>({tag:el.tagName,cls:el.className,width:el.getBoundingClientRect().width})).slice(0,8));
      assert(await page.evaluate(()=>document.documentElement.scrollWidth <= innerWidth), `No overflow: ${width} ${route} ${JSON.stringify(overflow)}`);
      assert.equal(await page.locator('h1').count(),1);
    }
    await page.goto(origin+'/');
    await page.screenshot({path:`test-results/home-${width}.png`});
  }
  await page.setViewportSize({width:1440,height:1000});
  await page.goto(origin+'/');
  await page.waitForSelector('.service-explorer.is-interactive');
  await page.waitForSelector('.service-explorer.is-scroll-driven');
  const serviceStart = await page.locator('.service-explorer').evaluate(el=>el.parentElement.getBoundingClientRect().top+scrollY-32);
  for(const index of [0,1,2,3,1,0]){
    await page.evaluate(({start,index})=>window.scrollTo({top:start+innerHeight*4*.8*(index+.25)/4,behavior:'instant'}),{start:serviceStart,index});
    await page.waitForFunction(index=>document.querySelector(`#service-choice-${index}`).getAttribute('aria-expanded')==='true',index);
    assert(await page.locator(`#service-panel-${index}`).isVisible());
  }
  for(let index=0;index<4;index++){
    await page.locator(`#service-choice-${index}`).click();
    assert.equal(await page.locator('.service-panel:not([aria-hidden="true"]):visible').count(),1);
    assert.equal(await page.locator(`#service-choice-${index}`).getAttribute('aria-expanded'),'true');
    assert(await page.locator(`#service-panel-${index}`).isVisible());
  }
  await page.locator('#service-choice-0').focus();
  await page.keyboard.press('ArrowDown');
  assert.equal(await page.locator('#service-choice-1').getAttribute('aria-expanded'),'true');
  await page.locator('#service-choice-0').click();
  await page.waitForFunction(()=>!document.querySelector('.service-transition-ghost') && [...document.querySelectorAll('#service-panel-0 h3, #service-panel-0 .service-panel-copy > *')].every(el=>getComputedStyle(el).opacity==='1'));
  await page.evaluate(()=>document.querySelector('#services').scrollIntoView({block:'start',behavior:'instant'}));
  await page.screenshot({path:'test-results/services-desktop.png'});
  await page.waitForSelector('#work.is-horizontal');
  await page.evaluate(()=>document.fonts.ready);
  await page.evaluate(()=>{const section=document.querySelector('#work');window.scrollTo({top:section.getBoundingClientRect().top+scrollY+700,behavior:'instant'});});
  await page.waitForFunction(()=>new DOMMatrix(getComputedStyle(document.querySelector('#work .content-grid')).transform).m41 < -300);
  await page.screenshot({path:'test-results/work-horizontal.png'});
  await page.evaluate(()=>{const section=document.querySelector('#work');window.scrollTo({top:section.parentElement.getBoundingClientRect().top+scrollY,behavior:'instant'});});
  await page.waitForFunction(()=>document.querySelector('[data-work-prev]').disabled);
  await page.locator('[data-work-next]').click();
  await page.waitForFunction(()=>document.querySelector('[data-work-counter]').textContent.startsWith('02'));
  await page.waitForFunction(()=>{const track=document.querySelector('#work .content-grid');const cards=track.querySelectorAll('.content-card');return Math.abs(new DOMMatrix(getComputedStyle(track).transform).m41+cards[1].offsetLeft-cards[0].offsetLeft)<5;});
  await page.locator('#work .content-card:last-child a').focus();
  await page.waitForFunction(()=>{const rect=document.querySelector('#work .content-card:last-child a').getBoundingClientRect();return rect.left>=0 && rect.right<=innerWidth;});
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.waitForFunction(()=>!document.querySelector('#work.is-horizontal') && !document.querySelector('.pin-spacer'));
  assert.equal(await page.locator('.service-explorer.is-scroll-driven').count(),0);
  assert.equal(await page.locator('#work.is-horizontal').count(),0);
  assert.equal(await page.locator('.pin-spacer').count(),0);
  await page.emulateMedia({reducedMotion:'no-preference'});
  await page.setViewportSize({width:390,height:844});
  await page.waitForFunction(()=>!document.querySelector('#work.is-horizontal'));
  assert.equal(await page.locator('#work.is-horizontal').count(),0);
  await page.goto(origin+'/');
  assert.equal(await page.locator('.service-explorer.is-scroll-driven').count(),0);
  await page.locator('#service-choice-2').click();
  assert(await page.locator('#service-panel-2').isVisible());
  assert.equal(await page.locator('.service-panel:not([aria-hidden="true"]):visible').count(),1);
  await page.waitForFunction(()=>[...document.querySelectorAll('#service-panel-2 h3, #service-panel-2 .service-panel-copy > *')].every(el=>getComputedStyle(el).opacity==='1'));
  await page.evaluate(()=>document.querySelector('#service-choice-2').scrollIntoView({block:'start',behavior:'instant'}));
  await page.screenshot({path:'test-results/services-mobile.png'});
  await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));
  await page.getByRole('button',{name:'Menu'}).click();
  assert.equal(await page.getByRole('button',{name:'Menu'}).getAttribute('aria-expanded'),'true');
  await page.keyboard.press('Escape');
  assert.equal(await page.getByRole('button',{name:'Menu'}).getAttribute('aria-expanded'),'false');
  await page.goto(origin+'/startup-landing-pages/');
  await page.getByRole('link',{name:'Tell me about your launch'}).click();
  assert.equal(await page.locator('input[name=service]:checked').inputValue(),'Startup landing page');
  assert.equal(await page.locator('#enquiry').evaluate(form=>form.checkValidity()),false);
  assert(!(await page.locator('#enquiry-result').isVisible()));
  await page.locator('input[name=name]').fill('Test & Name');
  assert.equal(await page.locator('input[name=name]').evaluate(el=>getComputedStyle(el.closest('.form-grid')).opacity),'1');
  await page.locator('textarea[name=brief]').fill('A launch brief with & and ? and new lines.');
  await page.getByRole('button',{name:'Prepare my enquiry'}).click();
  assert(await page.locator('#enquiry-result').isVisible());
  assert((await page.locator('#prepared-enquiry').inputValue()).includes('Test & Name'));
  await page.evaluate(()=>Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async()=>{throw new Error('Denied');}}}));
  await page.getByRole('button',{name:'Copy my enquiry'}).click();
  assert((await page.locator('#enquiry-status').textContent()).includes('selected'));
  await page.evaluate(()=>Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async(text)=>{window.__copied=text;}}}));
  await page.getByRole('button',{name:'Copy my enquiry'}).click();
  assert((await page.locator('#enquiry-status').textContent()).includes('has been copied'));
  await page.locator('.faq summary').first().click();
  await page.waitForFunction(()=>{const answer=document.querySelector('.faq-answer');return answer.style.height==='' && answer.closest('details').open;});
  await page.locator('.faq summary').first().click();
  await page.locator('.faq summary').first().click();
  await page.locator('.faq summary').first().click();
  await page.waitForFunction(()=>!document.querySelector('.faq details').open);
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto(origin+'/');
  assert.equal(await page.locator('h1').evaluate(el=>getComputedStyle(el).opacity),'1');
  const questions=page.locator('.faq summary');
  await questions.nth(0).click();
  assert.equal(await page.locator('.faq details[open]').count(),1);
  await questions.nth(1).focus();
  await page.keyboard.press('Enter');
  await page.waitForFunction(()=>document.querySelectorAll('.faq details[open]').length===1 && document.querySelectorAll('.faq details')[1].open);
  await page.keyboard.press('Space');
  await page.waitForFunction(()=>document.querySelectorAll('.faq details[open]').length===0);
  assert.equal(await page.locator('.about-fields > a').count(),4);
  assert((await page.locator('.about-story').textContent()).includes('You’ll work directly with me'));
  for(const width of [1440,390]){
    await page.setViewportSize({width,height:1000});
    await page.locator('#about').evaluate(el=>el.scrollIntoView({block:'start',behavior:'instant'}));
    assert.equal(await page.locator('.about-story h3').evaluate(el=>getComputedStyle(el).opacity),'1');
    await page.screenshot({path:`test-results/about-${width}.png`});
    await page.locator('#contact').evaluate(el=>el.scrollIntoView({block:'start',behavior:'instant'}));
    assert(await page.locator('.contact-email a').isVisible());
    assert.equal(await page.locator('.contact-email a').getAttribute('href'),'mailto:akshayanmohandass@gmail.com');
    await page.screenshot({path:`test-results/contact-${width}.png`});
    await page.locator('.faq').evaluate(el=>el.scrollIntoView({block:'start',behavior:'instant'}));
    await page.locator('.faq summary').first().click();
    await page.screenshot({path:`test-results/faq-${width}.png`});
    await page.locator('.faq summary').first().click();
  }
  const nojs = await browser.newContext({javaScriptEnabled:false});
  const plain = await nojs.newPage();
  await plain.goto(origin+'/');
  assert(await plain.locator('h1').isVisible());
  assert.equal(await plain.locator('.service-panel:visible').count(),4);
  await plain.locator('.faq summary').first().click();
  assert.equal(await plain.locator('.faq details[open]').count(),1);
  assert.deepEqual(errors,[]);
  console.log('Browser checks passed: all routes at 17 widths, mobile menu, service preselection, enquiry preparation, both clipboard paths, reduced motion, no-JS content and FAQ, no browser errors.');
} finally { await browser?.close(); server.close(); }
