# Development and handoff

## Run locally

```sh
npm install
npm run dev
```

`npm run build` runs Astro/TypeScript checks and produces static files in `dist/`. `npm run preview` serves that build.

`npm test` verifies generated routes, unique metadata, local links, anchors, project stages, and hidden editorial annotations after a build. `scripts/browser-check.mjs` runs the interaction and responsive checks with Playwright; install Playwright locally or provide `PLAYWRIGHT_MODULE` pointing to an existing installation. `CHROME_PATH` optionally selects an installed Chrome executable.

## Content and stack

Astro, strict TypeScript, Tailwind CSS 4 through its Vite plugin, and GSAP with ScrollTrigger. Fonts are bundled locally. The four original page Markdown files remain the source of page copy and SEO metadata. Shared UI interprets the editorial annotations rather than displaying them. Original Markdown files and the existing career website are unchanged.

Project panels are decorative typography and geometry, not product screenshots. Authentic project imagery was not supplied. LinkedIn is omitted pending verification.

## Public launch

No deployment has been performed. Set `SITE_URL` to the confirmed production origin in the build environment only when public launch is authorized. This enables absolute self-referencing canonicals, Open Graph page URLs, a four-page sitemap, and crawl permission in robots.txt. Without `SITE_URL`, robots.txt disallows crawling and no production URLs are invented. Robots.txt is not access control; protect private review deployments through the hosting provider. Confirm hosting authentication and indexing settings before launch. Search Console setup requires account access and is not completed here.

## Enquiries

The contact section follows the selected quiet editorial direction: question-led field rows informed by Dennis Snellenberg's contact layout, with the spacious hierarchy and restraint studied in Exo Ape. The implementation uses the portfolio's own typography, cobalt accent, approved copy and email behavior. Desktop pairs the form with a direct-email sidebar; mobile places the introduction before the form. One-time GSAP reveals finish immediately on field focus or validation and revert for reduced motion. The form is not pinned or moved while typing.

The form validates required name and project description, composes a local mailto link, and exposes a readonly brief with a clipboard fallback. Nothing is stored or sent by the website. Service-page CTAs preselect the service using a query parameter on direct homepage navigation. Email delivery depends on the visitor sending the message in their email client.

## Scroll interactions

The Services sequence supports desktop viewports at least 1000px wide and 500px tall, with motion enabled. Panels fit the browser height using a compact two-column explanation/deliverables layout, with the starting point and CTA beneath. There is no internal panel scrolling or clipped copy. Fit checks cover every service at 1000×500, 1280×650, 1280×720 and 1536×864. Dimensions recalculate when ScrollTrigger refreshes. Mobile and reduced-motion modes retain the manual service selector with natural-height panels.

The homepage selected-projects section uses a GSAP ScrollTrigger pin and horizontal track on viewports at least 1100px wide and 850px tall, with no reduced-motion preference. Vertical scrolling drives horizontal movement with linear easing and scrub smoothing. Previous/next controls, a visual progress line, and a continue-below link supplement scrolling. Focusing a project link brings its card into view. Smaller viewports, reduced motion, and JavaScript-disabled browsers retain the original vertical grid. GSAP matchMedia reverts the pin and transforms when conditions change. Introductory text sections have small scroll-linked heading and accent movements without hiding content.

The browser checks cover horizontal movement, keyboard access to the final project, reduced-motion cleanup, and responsive cleanup in addition to the original checks.

## Verification completed

- Astro 7.4.2 build and strict diagnostics: zero errors, warnings, or hints.
- Dependency audit after upgrade: zero known vulnerabilities.
- Generated-site content and internal-link checks passed.
- Browser checks passed on all four routes at 320, 390, 768, and 1440 pixels without horizontal page overflow.
- Mobile menu, Escape dismissal, service preselection, enquiry preparation, clipboard success and failure paths, reduced-motion visibility, and JavaScript-disabled content/FAQ checks passed without browser errors.
- All four supplied career-site case-study URLs returned HTTP 200 on 27 October 2026. This confirms reachability, not independent verification of their claims.
- Production hosting, actual delivery through a visitor's email application, Search Console, and live indexing remain unverified.

## Responsive verification — 27 October 2026

`node scripts/responsive-check.mjs` runs the responsive browser matrix. It uses the same `PLAYWRIGHT_MODULE` and `CHROME_PATH` environment variables as the existing browser checks.

Verified all four routes at 320, 360, 390, 430, 600, 760, 768, 820, 999, 1000, 1024, 1099, 1100, 1280, 1440, 1920, and 2560 CSS pixels wide (900px high), plus landscape windows at 844×390, 1024×600, and 1280×720. Checks include page and key component overflow, homepage form validity and service selection, mobile menu dismissal, service URL preselection, keyboard radio selection, and browser errors. Representative screenshots are saved under `test-results/responsive-*.png`.

These results use desktop Chrome viewport emulation. Physical iOS Safari and Android devices were not tested.
