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
  for(const width of [320,390,768,1024,1440,1920]){
    await page.setViewportSize({width,height:1000});
    await page.emulateMedia({reducedMotion:'reduce'});
    await page.goto('http://127.0.0.1:4322/website-design-development/');
    await page.evaluate(()=>document.fonts.ready);
    assert.equal(await page.locator('.questions-list li').count(),5);
    assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`Overflow at ${width}`);
    await page.locator('.enquiry-questions').evaluate(el=>el.scrollIntoView({block:'start',behavior:'instant'}));
    await page.screenshot({path:`test-results/enquiry-questions-${width}.png`});
    console.log(`Questions section passed at ${width}px`);
  }
  assert.deepEqual(errors,[]);
} finally { await browser?.close(); server.close(); }
