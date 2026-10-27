# Design reference library

Prepared for Akshayan Mohandass on **27 October 2026**. This is a research artifact, not a change to the portfolio.

Open [the interactive reference board](./index.html) in a browser. It works locally without a build or external assets. Search and filter by section or priority; expand each card for a viewing task, adaptation idea, caveat and inspection status. Color strips are interpretive mood cues, not screenshots or extracted brand palettes. Live-site links are the visual and animation references.

## Start with these three

1. [Dennis Snellenberg](https://dennissnellenberg.com/) — the closest freelance designer/developer comparison. Start with [Contact](https://dennissnellenberg.com/contact) for spacious field rows and visible direct contact.
2. [Exo Ape](https://www.exoape.com/) — the principal reference for elegance, visual hierarchy and a quieter editorial rhythm. Also inspect [Contact](https://www.exoape.com/contact).
3. [Studio Freight](https://studiofreight.com/) — study project composition and the relationship between image movement and titles.

These are recommendations for fit, not a ranking of the sites' quality. Use one dominant direction and borrow specific principles from the others.

## Reference map

| Reference | Best use | Inspection |
|---|---|---|
| [Dennis Snellenberg](https://dennissnellenberg.com/) | Contact, freelance positioning, closing CTA | Home, footer and contact viewed on desktop |
| [Exo Ape](https://www.exoape.com/) | Elegant hierarchy, hero, image-led work | Hero and scrolled state viewed; contact structure checked |
| [Studio Freight](https://studiofreight.com/) | Project composition and transitions | Opening mosaic and scrolled composition viewed |
| [Studiogusto](https://www.studiogusto.com/) | Media, typography, editorial contrast | Opening and scrolled state viewed |
| [Hovercraft Studio](https://www.hovercraftstudio.com/work) | Image proportions and project metadata | Work index viewed; motion audit incomplete |
| [Lusion](https://lusion.co/) | Distinctive motion and abstract identity | Opening 3D scene viewed; deeper behavior untested |
| [Unseen Studio](https://unseen.co/) | Signature motif and atmosphere | Entry screen viewed; world not entered |
| [Locomotive](https://locomotive.ca/en) | Follow-up reference for typography and pacing | Page content retrieved; browser verification blocked inspection |

Unseen's immersive experience is described by the [WordPress showcase](https://wordpress.org/showcase/unseen-studio/). It was not independently tested beyond the entry screen. Locomotive stays in the pending queue. No CAPTCHA or verification was bypassed.

## Proposed directions

### A. Quiet editorial craft — recommended

Use Exo Ape's hierarchy and breathing room, Dennis's clarity of enquiry, and our existing cobalt identity. Give authentic project screenshots more space. Keep one memorable scroll sequence and let other sections read naturally. This is the strongest fit for a solo designer/developer serving businesses and founders.

### B. Expressive project gallery

Use Studio Freight's composition as a starting point and Hovercraft's image proportions as a counterbalance. Let projects supply the visual variety. This requires authentic screenshots and careful cropping; the current abstract project panels cannot establish the same credibility.

### C. A restrained immersive accent

Use Lusion and Unseen to inform one original SVG or lightweight visual motif. Keep navigation, services and enquiries conventional. This direction is useful only if the accent communicates our identity; it does not justify adding a 3D stack.

These directions are proposals. No redesign is selected or implemented by this document.

## Apply references by section

| Section | Lead reference | Proposed adaptation |
|---|---|---|
| Hero | Exo Ape | Fewer competing elements; intentional type scale; one visual anchor |
| Services | Dennis + existing content | Preserve clear choices; shorten pinned time; keep details readable |
| Projects | Studio Freight + Hovercraft | Authentic imagery, varied crops, stable titles and project stages |
| About | Dennis + existing identity | Personal introduction, restrained motif, visible professional-background link |
| Contact | Dennis Contact + Exo Ape Contact | Strong invitation, visible email alternative and spacious form rows |
| Footer | Dennis | A deliberate closing moment with a direct next step |

The services adaptation is our design inference, not a claim that Dennis has our scroll-driven service selector. Similarly, none of these references is claimed to use the exact horizontal sequence currently in this portfolio.

## Suggested motion vocabulary

These are starting values for our implementation, **not measured timings from the references**.

| Pattern | Starting treatment | Appropriate use |
|---|---|---|
| Content entrance | 12–20px translation, 0.5–0.75s, `power3.out` | Section introduction; once, not every sentence |
| Panel change | 0.25–0.35s outgoing fade, 0.55–0.7s incoming content, 0.04–0.06s stagger | Services; keep the surface stable |
| Horizontal gallery | Linear track, 0.8–1.1s scrub, restrained near-edge settling | One project sequence on roomy viewports |
| Link feedback | 0.2–0.3s, 2–4px arrow movement | Pointer hover and keyboard focus |
| Form feedback | 0.2–0.35s state change; no moving input under focus | Focus, valid/invalid state, prepared enquiry |
| Decorative parallax | 12–24px maximum | Abstract artwork, never essential labels |

Keep native page scrolling, interruptible navigation and visible focus. Reduced motion should preserve the entire experience without animated movement. Short or narrow screens should avoid pins that make a panel unreadable. Do not animate the form away while someone is typing.

## Current portfolio implications

- Services and Projects already both pin. Adding another pinned About or Contact sequence would compete for attention; the next pass should consider reducing repetition rather than increasing pin count.
- The project evidence is currently typography and geometry. Authentic project screenshots are the largest visual opportunity.
- Repeated oversized headlines and the same upward reveal can flatten the hierarchy. Assign a different role to each section.
- About already provides contrast through cobalt. Contact needs a clear continuation, not another unrelated visual style.
- The interrupted contact redesign has not been implemented. The form retains its existing email preparation and copy fallback.

## Review before the next implementation

1. Review the three core sites, using the card-specific viewing tasks.
2. Select a dominant direction (A, B or C) and one contact reference.
3. Identify the precise pattern to adapt and why it helps the visitor.
4. Confirm the imagery needed and retain the approved content and project stages.
5. Implement one coherent pass and verify mobile, keyboard, reduced motion and enquiry behavior.

No imported site copy, logos, portraits, credentials, testimonials or third-party project images should be used as our own. Reference sites are external, can change, and have not received a full mobile, accessibility, performance or technology audit here. GSAP recipes above describe our proposed approach; they are not assertions about those sites' implementation stacks.

## Files

- `references.json`: reusable source data, links, categories and inspection notes.
- `index.html`: self-contained searchable/filterable board, generated from that data.
- `build-board.mjs`: run `node design-references/build-board.mjs` after updating the JSON.

The portfolio source files and original content Markdown are unchanged by this research task.
