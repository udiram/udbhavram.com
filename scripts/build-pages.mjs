import fs from 'node:fs'
import path from 'node:path'
import { createServer } from 'vite'
import { renderToString } from 'react-dom/server'
import { createElement } from 'react'
const routes = JSON.parse(fs.readFileSync('src/routeMeta.json', 'utf8'))
const original = fs.readFileSync('dist/index.html', 'utf8')
const origin = 'https://udbhavram.com'
const escape = (s) =>
  s
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
function pageFor(route, meta) {
  return original
    .replace(/<title>.*?<\/title>/s, `<title>${escape(meta.title)}</title>`)
    .replace(
      /<meta\s+name="description"\s+content="[^"]*"\s*\/>/s,
      `<meta name="description" content="${escape(meta.description)}" />`,
    )
    .replace(
      /<meta\s+property="og:title"\s+content="[^"]*"\s*\/>/s,
      `<meta property="og:title" content="${escape(meta.title)}" />`,
    )
    .replace(
      /<meta\s+property="og:description"\s+content="[^"]*"\s*\/>/s,
      `<meta property="og:description" content="${escape(meta.description)}" />`,
    )
    .replace(
      /<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/>/s,
      `<meta name="twitter:title" content="${escape(meta.title)}" />`,
    )
    .replace(
      /<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/>/s,
      `<meta name="twitter:description" content="${escape(meta.description)}" />`,
    )
    .replace(
      /<meta\s+property="og:url"\s+content="[^"]*"\s*\/>/s,
      `<meta property="og:url" content="${origin + route}" />`,
    )
    .replace(
      /<link rel="canonical" href="[^"]*"\s*\/>/,
      `<link rel="canonical" href="${origin + route}" />`,
    )
}
const renderer = await createServer({
  server: { middlewareMode: true },
  appType: 'custom',
})
try {
  const { default: App } = await renderer.ssrLoadModule('/src/App.tsx')
  for (const [route, meta] of Object.entries(routes)) {
    globalThis.window = { location: { pathname: route, search: '', hash: '' } }
    const body = renderToString(createElement(App))
    const dest =
      route === '/' ? 'dist/index.html' : path.join('dist', route, 'index.html')
    fs.mkdirSync(path.dirname(dest), { recursive: true })
    fs.writeFileSync(
      dest,
      pageFor(route, meta).replace(
        '<div id="root"></div>',
        `<div id="root">${body}</div>`,
      ),
    )
  }
  globalThis.window = { location: { pathname: '/404', search: '', hash: '' } }
  const notFoundBody = renderToString(createElement(App))
  fs.writeFileSync(
    'dist/404.html',
    pageFor('/404', {
      title: 'Page not found | Udbhav Ram',
      description: 'Explore Udbhav Ram’s biography, research, and collection.',
    })
      .replace('<div id="root"></div>', `<div id="root">${notFoundBody}</div>`)
      .replace(
        '</head>',
        '<meta name="robots" content="noindex, follow" />\n</head>',
      ),
  )
} finally {
  await renderer.close()
  delete globalThis.window
}
fs.writeFileSync(
  'dist/robots.txt',
  `User-agent: *\nAllow: /\n\nSitemap: ${origin}/sitemap.xml\n`,
)
fs.writeFileSync(
  'dist/sitemap.xml',
  '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' +
    Object.keys(routes)
      .map(
        (route) =>
          `<url><loc>${origin + route}</loc><lastmod>2026-10-05</lastmod></url>`,
      )
      .join('') +
    '</urlset>',
)
console.log(
  `Generated ${Object.keys(routes).length} route documents with page-specific metadata`,
)
