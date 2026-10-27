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
await new Promise(r => server.listen(4322,'127.0.0.1',r));
let browser;
try {
  browser = await chromium.launch({headless:true, ...(process.env.CHROME_PATH ? {executablePath:process.env.CHROME_PATH} : {})});
  const context = await browser.newContext();
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror',e=>errors.push(e.message));
  mkdirSync('test-results',{recursive:true});
  const widths=[320,360,390,430,600,760,768,820,999,1000,1024,1099,1100,1280,1440,1920,2560];
  for(const width of widths){
    await page.setViewportSize({width,height:900});
    for(const route of ['', 'website-design-development/', 'startup-landing-pages/', 'ui-ux-design/']){
      await page.goto(`http://127.0.0.1:4322/${route}`);
      await page.evaluate(()=>document.fonts.ready);
      await page.waitForTimeout(250);
      assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`Page overflow: ${width} ${route}`);
      const bad=await page.locator('.site-header, .hero h1, .enquiry, .enquiry-service-surface, .contact-email, footer').evaluateAll(els=>els.filter(el=>{const r=el.getBoundingClientRect();return r.width && (r.left < -1 || r.right>innerWidth+1)}).map(el=>el.className));
      assert.deepEqual(bad,[],`Component overflow: ${width} ${route}`);
      if(await page.locator('#enquiry').count()){
      await page.locator('#enquiry').scrollIntoViewIfNeeded();
      await page.locator('input[name=name]').fill('Responsive check');
      await page.locator('textarea[name=brief]').fill('Checking the responsive form.');
      await page.locator('.enquiry-service-option').nth(2).click();
      assert.equal(await page.locator('input[name=service]:checked').inputValue(),'Product UI/UX design');
      assert(await page.locator('#enquiry').evaluate(el=>el.checkValidity()));
      }
      if(!route && [320,390,768,1024,1440,2560].includes(width)){
        await page.emulateMedia({reducedMotion:'reduce'});
        await page.locator('#contact').scrollIntoViewIfNeeded();
        await page.screenshot({path:`test-results/responsive-contact-${width}.png`,fullPage:false});
        await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));
        await page.screenshot({path:`test-results/responsive-home-${width}.png`});
        await page.emulateMedia({reducedMotion:'no-preference'});
      }
    }
    console.log(`Four routes and form passed at ${width}px`);
  }
  for(const size of [{width:844,height:390},{width:1024,height:600},{width:1280,height:720}]){
    await page.setViewportSize(size);
    await page.goto('http://127.0.0.1:4322/');
    assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`Landscape overflow: ${JSON.stringify(size)}`);
    await page.locator('#contact').scrollIntoViewIfNeeded();
    await page.screenshot({path:`test-results/responsive-landscape-${size.width}x${size.height}.png`});
  }
  await page.setViewportSize({width:390,height:844});
  await page.goto('http://127.0.0.1:4322/');
  await page.getByRole('button',{name:'Menu'}).click();
  assert.equal(await page.getByRole('button',{name:'Menu'}).getAttribute('aria-expanded'),'true');
  await page.keyboard.press('Escape');
  assert.equal(await page.getByRole('button',{name:'Menu'}).getAttribute('aria-expanded'),'false');
  await page.goto('http://127.0.0.1:4322/?service=Startup%20landing%20page');
  assert.equal(await page.locator('input[name=service]:checked').inputValue(),'Startup landing page');
  await page.locator('input[name=service]:checked').focus();
  await page.keyboard.press('ArrowRight');
  assert.equal(await page.locator('input[name=service]:checked').inputValue(),'Product UI/UX design');
  assert.deepEqual(errors,[]);
  console.log('Responsive checks passed: 68 route/width combinations, 3 landscape sizes, mobile menu, form selection, service preselection, keyboard navigation, no browser errors.');
} finally { await browser?.close(); server.close(); }
