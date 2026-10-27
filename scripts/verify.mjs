import { readFileSync, existsSync } from 'node:fs';
import assert from 'node:assert/strict';
const routes = ['', 'website-design-development/', 'startup-landing-pages/', 'ui-ux-design/'];
const pages = new Map(routes.map(route => [route, readFileSync(`dist/${route}index.html`, 'utf8')]));
const titles = new Set();
for (const [route, html] of pages) {
  assert.equal((html.match(/<h1(?:\s[^>]*)?>/g) || []).length, 1, `${route}: one H1`);
  assert(!/Section ID:|Primary button:|Secondary link:|Placeholder:/.test(html), `${route}: editorial markers hidden`);
  assert(/name="description" content="[^"]+"/.test(html), `${route}: description`);
  const title = html.match(/<title>(.*?)<\/title>/)?.[1];
  assert(title, `${route}: title`); titles.add(title);
  for (const [, href] of html.matchAll(/href="(\/[^"?]*)(?:\?[^"#]*)?"/g)) {
    const [path, hash] = href.split('#');
    if (/\.[a-z]+$/i.test(path)) { assert(existsSync(`dist${path}`), `Asset exists: ${href}`); continue; }
    const target = pages.get(path.replace(/^\//,''));
    assert(target, `Route exists: ${href}`);
    if(hash) assert(target.includes(`id="${hash}"`), `Anchor exists: ${href}`);
  }
}
assert.equal(titles.size, 4, 'Unique SEO titles');
const home = pages.get('');
for(const id of ['work','services','about','contact']) assert(home.includes(`id="${id}"`));
for(const text of ['Functional prototype; not a production payment system.','High-fidelity Figma prototype.','Published on Google Play.','Live customer product, as documented in the case study.']) assert(home.includes(text), text);
assert(home.includes('Nothing is sent until you send it.'));
console.log('Verified four routes, metadata, internal links, section anchors, editorial markers, project stages, and enquiry disclosure.');
