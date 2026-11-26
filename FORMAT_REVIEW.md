# Portfolio formatting review

Date: October 26, 2026. Requested outcome: clean, minimal, modern, and immediately understandable to a first-time visitor. Work page by page and element by element.

## Direction and boundaries

Reading this as a researcher/builder portfolio for collaborators and hiring readers. Favor a restrained, contemporary interface with real research and software artifacts. DESIGN_VARIANCE: 5; MOTION_INTENSITY: 3; VISUAL_DENSITY: 3. These replace PRODUCT.md's older preference for increased visual intensity for this request.

Use the existing React, native CSS, and Phosphor implementation. Apply ui-styling's semantic components, tokens, responsive layout, and accessibility principles without introducing a new styling stack for formatting fixes. Apply minimalist-ui's flat surfaces and restrained spacing; Impeccable's readability and hierarchy; design-taste-frontend's audit-first preservation rules. Preserve actual work, source links, scientific limitations, the green brand accent, wordmark, URL structure, anchor IDs, primary navigation labels, and search/save functionality. Authentic existing assets take precedence over generated or stock decoration.

## Evidence and limits

Read App.tsx, App.css, DetailPages.tsx, Details.css, HomeSoftware.tsx, OnMyDesk.tsx, RealCtViewer.tsx, package.json, PRODUCT.md, and route metadata. Rendered the working tree on a dedicated Vite server at http://127.0.0.1:5188, using isolated Playwright contexts. Initial captures covered the homepage at 1440 and 390 px in light mode and 1440 px in dark mode, plus desktop About, Research, Software, and Archive.

Initial full-page screenshots: /tmp/portfolio-format-audit/home-desktop.png, home-mobile.png, home-dark.png, about.png, research.png, software.png, archive.png. These are audit captures, not acceptance evidence. Lazy images below the initial viewport had not all loaded; blank image slots in those captures do not establish broken assets. Subsequent scrolling captures overlapped Sol's active edits and encountered a transient ResearchMaterials.tsx parse error; they are invalid visual evidence and must not be used for acceptance.

Measured baseline: header 89 px high at 1440 px; homepage H1 78 px with approximately four lines and 318 px total height; hero 760 px high; CT section about 1161 px high. Research was about 19,033 px tall, Software 9,327 px, Archive 28,234 px at 1440x900. Homepage had no horizontal document overflow at 1440 or 390 px. Length is a diagnostic signal, not a target to meet by deleting evidence.

## Pass 1: shared shell and homepage

1. Header: reduce desktop height to 64-76 px. Keep brand/nav/actions aligned on one line; use the compact menu before collision at intermediate widths. Preserve existing labels and accessible search, saved list, theme, and menu actions. Ensure a new visitor can understand the saved-list utility through accessible/visible wording without changing primary navigation.
2. Hero: replace the paragraph-sized display headline with a short introduction and a clear research/building focus. Introduce full name and nickname unambiguously. Keep UW-Madison PhD context. Target two display lines at desktop with a concise supporting sentence, and place primary/secondary actions together with the copy. Keep the real portrait at an intentional crop and scale. Avoid tight tracking below -0.04em. Preserve #home and the #featured-work route.
3. CT section: explain why this example is on the portfolio. Keep actual MSD CT, exact reference mask, source/license and the distinction between reference contour and model prediction. Reduce section and title scale. Keep page surface consistent with its selected theme; a dark medical image viewport is appropriate, a whole inverted page section is unnecessary. Slider, toggle, image state, orientation and error/retry must remain legible and functional.
4. Featured software: a simple heading such as 'Selected software' and short introductory line should precede the work. Stack heading and explanation together; remove floating right-column explanatory text. Reduce oversized screenshots and avoid a large empty area below the lead project. Keep actual captures, project boundaries and evidence; put detailed caveats next to the relevant artifact or on the detail page rather than hiding them. Preserve three featured tools and their destination links.
5. Research: plain study-topic titles should tell a new visitor what each project concerns. Keep precise publication names in the records. Reduce display scale and repeated metadata; preserve preprint/publication status and direct source actions. Avoid repeating a lead split and identical three-card scaffold. Do not trim scientific meaning merely to hit copy length limits.
6. Motorsport: keep its position and actual image. Shorten homepage prose to the role and what was built, with a clear link to the full story. Preserve verified dates and role; do not infer current work or employment.
7. Current projects: 'On my desk' repeats featured work and adds editorial metadata. Distill to a small, explicitly dated 'Current projects' section or another clear concise presentation; preserve the snapshot's actual date rather than inventing a fresh update. Make the purpose and destination of each link clear.
8. Footer: align links and metadata, reduce redundant spacing, and resolve the stale 'Updated October 14' claim from an actual content date or omit the general update claim. Keep contact/social destinations and full wordmark.
9. Motion/theme: content must remain visible before observers fire; remove visibility gating from the existing home reveal implementation. Respect reduced motion. Default to system color scheme only when no explicit saved preference exists. Preserve the manual toggle and readable states in both themes.
10. CSS: consolidate conflicting selectors in the touched scope instead of adding another layer of late overrides. Shared shell fixes must be checked on About/Research/Software/Archive before acceptance.

## Later page order

After a coherent homepage candidate, review each page separately:

- About, then Experience and Awards: biography scan path, CV action, timeline labels, selected versus complete history, portrait layout, excessive prose and repeated institutional marks.
- Research index, then each of the eight study routes: clear topic, short plain-language problem and contribution, relevant real figure, coherent paper/poster/talk/code materials, and explicit status/limitations. The hub should introduce studies; detail pages hold the full account.
- Software: clear tool purpose, realistic screenshot sizes, project status, consistent actions, screenshot/copy alignment, and grouping without excessive vertical repetition.
- Publications: readable bibliographic and presentation records, clear presenter/author distinctions, event versions, material actions and sensible grouping.
- Archive and legacy Collection routes: preserve all records and deep links, clarify search/filter behavior, progressively reveal or paginate long results while retaining permalink access. Do not silently delete or merge provenance.
- Beyond, Media, Reading list, search and empty states: understandable labels, caption/image alignment, keyboard operation, saved state, error/empty state, and mobile layout.

## Acceptance evidence

For each completed pass, record actual changed files and tests. Run build/lint and the relevant existing behavior suites. Update stale tests only to assert intentional new behavior, especially the real CT replacement and always-visible content; do not preserve tests that require hidden content or synthetic geometry. Independently inspect rendered output at 1440, 1024, 768, 390 and 320 px, in both themes and reduced motion; scroll through so lazy media loads. Check overflow, nav fit, desktop headline lines, action wrapping, image loading, readable controls, keyboard focus and contrast. Run Lighthouse and distinguish observed performance from unmeasured targets. Do not call the whole site finished after homepage checks.

## Current ownership and review cadence

The user superseded the delegation on October 26: "i want you to do this pass yourself, and then go back and forth with me for the next pass on each and every element on each page." Chat 01a1792e-08b5-7351-a2bc-2f48753f6a6f now owns implementation and validation of this formatting pass. Both existing chats were told to stop editing and releasing it. Preserve their scientific/source corrections already in the working tree. The current candidate stays local for the user's element-by-element review, starting with the navigation and homepage. Do not delegate this pass or automatically proceed through all page refinements. The next pass proceeds with the user one element at a time.

## Previous ownership (superseded for formatting)

Sol implementation chat: 01a16c49-9016-7d00-b073-78b5f685f09f. Persistent Astra advisor/reviewer: 01a16469-cc16-75b1-b8f4-f1fc61e24e8a. Current read-only audit/request chat: 01a1792e-08b5-7351-a2bc-2f48753f6a6f. Same local checkout; no worktree. Sol is already implementing real CT/source-fidelity/research-material corrections and retains all application-file ownership. This audit adds the user's visual direction and phased acceptance criteria; it must not undo the active corrections. The original advisor retains independent acceptance and release coordination under the user's existing deployment instruction.

## First local candidate

The current chat implemented the shared shell and homepage directly. Preview: http://127.0.0.1:5190/. Nothing was committed, pushed or deployed. Homepage styles are consolidated in src/Home.css. The next review begins with the header wordmark, then proceeds through navigation, utilities, the hero and each subsequent element with the user before advancing to other pages.

Build, lint, homepage interaction, curated-site, discovery and 27-route document checks passed. Rendered checks passed at 1440, 1024, 768, 390 and 320 px in both themes. Evidence and detailed limits: /tmp/portfolio-local-pass/QA.md and responsive-qa.json. Screenshots: /tmp/portfolio-local-pass/final-desktop.png, final-mobile.png and final-dark.png.

Performance remains open: local production-build Lighthouse mobile simulation scored 59 for performance and 100 for accessibility, with LCP 8.6 s, zero total blocking time and zero CLS. The shared JavaScript bundle still includes non-home content. This candidate does not meet the performance target and the remaining pages have not received their own formatting passes.
