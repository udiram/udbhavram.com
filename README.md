# UdbhavRam.com

Personal website for [udbhavram.com](https://udbhavram.com), built with React, TypeScript, and Vite and deployed through the existing GitHub → Railway project.

## Development and verification

Use Node.js 22.

```bash
npm ci
npm run dev
```

```bash
npm run build
npm run lint
npm run test:audit
npm run test:server
npm run test:pages
npm run test:presentations
npm run start
```

`test:pages` checks the built production output; run the build first. `npm run audit:site` additionally checks public outbound links and reports unavailable or bot-blocked sources for manual review.

## Pages and content

The site contains 22 prerendered routes: the homepage, biography and public CV, research, publications, software, life beyond the lab, media, a searchable collection, seven research case studies, and seven collection chapters with 96 historical non-presentation records and 27 reconciled presentation/outreach records.

- `src/routeMeta.json`: route titles and descriptions
- `src/expandedContent.ts`: research stories and career timeline
- `src/bibliography.json`: full publication citations
- `src/portfolioContent.ts`: historical collection, with dated claims kept in context
- `src/personalPhotos.json`: authentic personal photographs and captions
- `public/downloads/`: public-facing October 2026 CV
- [`CONTENT_SOURCES.md`](CONTENT_SOURCES.md): source ledger

`npm run build` writes per-route HTML, production canonical URLs, robots.txt, sitemap.xml, and a custom 404 document. The Node server serves those route documents directly, so links work on a fresh visit and useful content is available before JavaScript loads. Collection search and topic choices persist in the URL; the selected theme persists locally.

## Production deployment

The existing Railway service `udbhavram-com` tracks `main` in `udiram/udbhavram.com`. Authorized pushes to that branch trigger its deployment. Railway uses the existing `railway.toml` build command, starts `npm run start`, and checks `/` for health. Verify the deployed commit and direct routes after release.

The current domains, provider, analytics, and DNS configuration are retained. No new project or DNS changes are needed for normal updates.

## Presentation inventory

`src/presentations.json` is the canonical event inventory. It feeds the homepage selection, publications page, research collection, search, and public CV. The 27 records comprise 26 discrete event/remarks records (including one scheduled seminar with delivery unverified) and one SCEC outreach aggregate. They must not be described as 27 delivered talks or an exhaustive lifetime record. Presenter, coauthor, digital-only, approximate-date and source-status distinctions must remain visible. Awards belong to their event, and repeated studies at different conferences retain separate IDs.

CV authoring files are maintained outside the public checkout. After regenerating the public PDF from the inventory and bibliography, update `public/downloads/public-cv-manifest.json`. The regression check verifies source hashes, PDF hash, and each event permalink to catch stale or incomplete CV updates. Download URLs include the PDF content hash to avoid stale browser caches.

## Presentation permalink regression

After building, run `npx playwright install chromium` once, then `npm run test:permalinks`. To use an installed Chrome browser, run `PLAYWRIGHT_CHANNEL=chrome npm run test:permalinks`. The test starts its own production server; set `TEST_ORIGIN=https://udbhavram.com` to verify a deployed release instead.

The test checks every presentation permalink on desktop and mobile: repeated clicks, copied URLs in fresh tabs, reload, focus/highlight, collection links, filtered and paginated search, Back/Forward, legacy anchors, and targets inside closed disclosures. Permalinks point to the public record; source, PDF, and recording links remain separate.


## Media collection

`src/mediaContent.json` contains nine verified article editions/mentions in six story groups, fifteen public YouTube videos, one essay link, and four institutional listings. `/media` adds two public building-note threads. Original/adapted article editions share a group. Video upload dates and event dates are independent; the May 2023 onboard runs were uploaded September 30, 2026. Metadata and descriptions were checked, not full transcripts. Medium full text was unavailable, and the currently unavailable Scholar link is omitted.

The dedicated page is linked throughout the site; `/collection/media` and its old record anchors remain available. Videos use consent controls: no YouTube frame or thumbnail request is made before the user loads a video. An external watch link remains available independently. `npm run test:media` checks filters, empty/reset states, consent/unload, link destinations, legacy compatibility, contextual fragments, navigation and theme, and responsive overflow at 1440, 820, and 390 pixels. Set `EVIDENCE_DIR` for screenshots or `TEST_ORIGIN` to test production.
