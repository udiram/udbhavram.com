# UdbhavRam.com

Personal website for `udbhavram.com`, built as a static React/Vite site and configured for Railway.

## Local development

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
npm run start
```

Railway uses `railway.toml`:

- Build: `npm ci && npm run build`
- Start: `npm run start`
- Health check: `/`

## Deploy on Railway

1. Push this repo to GitHub.
2. In Railway, create a new project from the GitHub repo.
3. Railway should detect the `railway.toml` config and deploy the Vite build.
4. Confirm the Railway-provided domain loads.
5. Add `udbhavram.com` and `www.udbhavram.com` as custom domains in Railway.
6. Copy the DNS records Railway gives you into Spaceship DNS.
7. Wait for DNS and certificate provisioning, then verify both domains.

## Spaceship DNS notes

Use the exact records Railway shows after adding the custom domain. Usually:

- `www` is a `CNAME` pointing to the Railway target.
- The apex/root domain `udbhavram.com` may need an `ALIAS`, `ANAME`, or CNAME-flattened record if Spaceship supports it. If Spaceship only offers normal `CNAME` for subdomains, point `www` first and use Railway/Spaceship forwarding or move DNS to a provider with apex flattening.
- Railway may also provide a `TXT` record for verification. Add it exactly as shown.

Do not delete existing email-related DNS records if you later add mailbox hosting.

## Content sources

The first pass uses content from the previous Google Site and the UAB Heersink School of Medicine profile. Replace or tighten project/publication copy as the site becomes the canonical version.
