# Codex implementation brief

## Objective

Implement a separate freelance portfolio for Akshayan Mohandass using the four accompanying page files. This is a future implementation handoff; generating these Markdown files does not authorize changing or publishing an existing site during this content task.

## Non-negotiable content requirements

1. Leave the career portfolio at https://akshayn-mohandass.vercel.app/ unchanged.
2. Target small/local businesses and startup founders across India. “Local businesses” describes a customer type, not a single-city search strategy.
3. Give website design/development and product UI/UX design equal importance.
4. Do not display prices, starting prices, package fee ranges, or an internal commercial target. A free-text prospect budget field is intentional and may remain.
5. Use the supplied name and public business email exactly. Do not invent a studio name, telephone number, address, city, availability, response-time promise, testimonials, metrics, or years of experience.
6. Do not imply that all showcased product work was freelance client work or that it proves website conversion results.
7. Preserve project status: PayDart is a functional prototype; FamConnect is a Figma prototype; PregTrack is published on Google Play; Staffezee is described as a live customer product in its linked case study.
8. Do not claim a prototype is validated, a financial prototype is production-ready, or performance improved without evidence.
9. Keep copy specific and readable. Do not add repetitive keyword phrases, generic superlatives, or invented guarantees.

## Page mapping and semantic structure

- `/`: `01-homepage.md`
- `/website-design-development/`: `02-website-design-development.md`
- `/startup-landing-pages/`: `03-startup-landing-pages.md`
- `/ui-ux-design/`: `04-ui-ux-design.md`

Read YAML front matter into page metadata. Do not render it as page content. Use the supplied page headline as the H1 and preserve a logical H2/H3 hierarchy. Treat “Section ID,” “Button,” “Placeholder,” and similar markers as implementation annotations, not visible labels.

On the homepage, create IDs `work`, `services`, `about`, and `contact`. On the website and landing-page service pages, create `included`. On the UI/UX page, create `work`.

Shared navigation mapping:

- Brand/home → `/`
- Work → `/#work`
- Services → `/#services`
- Website Design → `/website-design-development/`
- Product Design → `/ui-ux-design/`
- About → `/#about`
- Contact → `/#contact`

Ensure the landing-page service is also discoverable from navigation or an accessible services menu, as well as homepage and related-service links.

## Contact interaction

- Use the full enquiry labels and choices in the homepage file.
- Prepare a `mailto:` message to `akshayanmohandass@gmail.com` with an encoded subject and body.
- Do not send automatically, store submissions, or imply server delivery.
- Provide the copy-enquiry fallback and accurate status feedback.
- Service-page CTAs can preselect the relevant service when reaching the homepage form. Ensure the interaction works on a direct visit as well as client-side navigation.
- Keep visible direct-email access as an alternative.
- Do not invent a booking link, WhatsApp number, or form backend.

Public LinkedIn link previously used: https://www.linkedin.com/in/akshayan-mohandass- . Confirm it remains the correct profile before publishing; omit if it cannot be confirmed.

## SEO implementation requirements

- Use the supplied unique SEO titles and descriptions. Search engines may display different snippets; do not promise specific rankings or snippets.
- Keep important copy in crawlable HTML rather than images or canvas.
- Use distinct pages with the specified routes and descriptive internal links.
- Resolve the production domain before setting absolute canonical, Open Graph, sitemap, or structured-data URLs. Never invent a production domain.
- Use a self-referencing canonical for each final public page.
- Add an XML sitemap containing the four canonical, indexable pages when public launch is authorized.
- Check that authentication, robots directives, and `noindex` settings match the intended audience. Private review sites are not SEO launch-ready. Do not make an existing private site public merely to pass an SEO check.
- Add accurate Person/WebSite structured data if appropriate. Include only supported identity and public profile facts; do not invent a physical business address or ratings.
- Do not assume FAQ rich results are available. The FAQs are useful visible content regardless of search-result treatment.
- Career-site case studies are external evidence links, not internal links for the freelance domain. Do not copy their full contents onto this site without a separate content decision.
- Use descriptive alt text for informative images and empty alt text for decorative images. Do not keyword-stuff alt text.
- Do not create near-duplicate city pages or add unverified location claims.
- Search Console verification requires the appropriate property/account access. Do not fabricate verification codes or report submission without completing it.

## Assets and evidence

Use authentic, permission-cleared screenshots and project assets where available. If only an illustration can be used, label it as illustrative and do not present it as the product UI. Flag missing assets instead of inventing case-study evidence.

## Verification before a future handoff

- All four routes load directly and after refresh.
- Metadata and canonicals match their pages and final domain.
- Shared navigation, section links, service CTAs, and external case studies work.
- Enquiry preparation and copy fallback work; no automatic message is sent.
- Phone and desktop layouts remain readable with keyboard-accessible controls.
- No public prices, invented claims, placeholder links, or unverified location details remain.
- Report any unavailable visual, technical, or indexing verification honestly.
