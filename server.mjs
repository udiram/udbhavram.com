import { createReadStream, existsSync } from 'node:fs'
import { extname, join, normalize } from 'node:path'
import { createServer } from 'node:http'

const port = Number(process.env.PORT || 4173)
const host = process.env.HOST || '0.0.0.0'
const distRoot = join(process.cwd(), 'dist')

const contentTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.pdf': 'application/pdf',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8',
  '.webp': 'image/webp',
  '.xml': 'application/xml; charset=utf-8',
}

function resolveRequestPath(url = '/') {
  const pathname = decodeURIComponent(new URL(url, 'http://localhost').pathname)
  const normalized = normalize(pathname).replace(/^(\.\.[/\\])+/, '')
  const candidate = join(distRoot, normalized === '/' ? 'index.html' : normalized)

  if (existsSync(candidate)) return candidate
  return join(distRoot, 'index.html')
}

createServer((request, response) => {
  const filePath = resolveRequestPath(request.url)
  const fileName = filePath.split('/').at(-1)
  const isMutableDocument = fileName === 'index.html' || fileName === 'robots.txt' || fileName === 'sitemap.xml'
  response.setHeader('Content-Type', contentTypes[extname(filePath)] || 'application/octet-stream')
  response.setHeader('Cache-Control', isMutableDocument ? 'no-cache' : 'public, max-age=31536000, immutable')
  createReadStream(filePath).pipe(response)
}).listen(port, host, () => {
  console.log(`udbhavram.com listening on ${host}:${port}`)
})
