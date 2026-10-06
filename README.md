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
npm run start
```

`test:pages` checks the built production output; run the build first. `npm run audit:site` additionally checks public outbound links and reports unavailable or bot-blocked sources for manual review.

## Pages and content

The site contains 21 prerendered routes: the homepage, biography and public CV, research, publications, software, life beyond the lab, a searchable collection, seven research case studies, and seven collection chapters preserving 108 historical entries.

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
