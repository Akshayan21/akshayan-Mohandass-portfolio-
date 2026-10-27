import matter from 'gray-matter';
import { marked } from 'marked';
const sources = import.meta.glob<string>('../../0[1-4]-*.md', { query: '?raw', import: 'default', eager: true });
export const files = ['01-homepage.md','02-website-design-development.md','03-startup-landing-pages.md','04-ui-ux-design.md'];
export const services = ['Business website design and development','Startup landing page','Product UI/UX design','Existing website improvements','Ongoing support','Help defining the project'];
export const html = (text: string) => marked.parse(text, { async: false }) as string;
export function page(index: number) {
  const { data, content } = matter(sources[`../../${files[index]}`]);
  const title = content.match(/^# (.+)$/m)?.[1] || '';
  const cleaned = content.slice(content.indexOf(`# ${title}`) + title.length + 3).trim();
  const parts = cleaned.split(/^## /m);
  const clean = (s: string) => s.replace(/^\*\*Primary button:\*\* (?!\[).*$/gm,'').replace(/^\*\*(?:Section ID):\*\*.*$/gm,'').replace(/^\*\*(?:Primary button|Secondary link|Button):\*\*\s*/gm,'');
  const hero = clean(parts.shift() || '');
  const sections = parts.map((part, n) => {
    const [heading, ...lines] = part.split('\n');
    const body = clean(lines.join('\n').trim());
    let id = lines.join('\n').match(/\*\*Section ID:\*\* (\w+)/)?.[1];
    if (heading.startsWith('Website design, development')) id = 'services';
    const kind = id === 'contact' ? 'contact' : heading.startsWith('Questions') ? 'faq' : id === 'work' ? 'work' : id === 'services' ? 'services' : id === 'about' ? 'about' : 'text';
    const blocks = body.split(/^### /m);
    const intro = blocks.shift() || '';
    const cards = blocks.map(block => { const [title,...rest] = block.split('\n'); return {title, body: rest.join('\n').trim()}; });
    return {heading,body,id: id || `section-${n}`,kind,intro,cards};
  }).filter(s => s.heading !== 'Footer');
  return {data, title, hero, sections};
}
