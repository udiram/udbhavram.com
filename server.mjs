import { createReadStream } from 'node:fs'
import { stat } from 'node:fs/promises'
import { createServer } from 'node:http'
import { extname, resolve, sep } from 'node:path'
import { pathToFileURL } from 'node:url'

const defaultDistRoot = resolve(process.cwd(), 'dist')

const contentTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.pdf': 'application/pdf',
  '.png': 'image/png',
  '.svg': 'image/svg+xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.webp': 'image/webp',
  '.xml': 'application/xml; charset=utf-8',
}

function acceptsHtml(request) {
  return (request.headers.accept ?? '').split(',').some((value) => value.trim().startsWith('text/html'))
}

function sendText(response, statusCode, message) {
  response.writeHead(statusCode, {
    'Cache-Control': 'no-store',
    'Content-Type': 'text/plain; charset=utf-8',
  })
  response.end(message)
}

function parsePathname(requestUrl = '/') {
  const encodedPathname = new URL(requestUrl, 'http://localhost').pathname
  const pathname = decodeURIComponent(encodedPathname)
  if (pathname.includes('\0')) throw new URIError('Invalid null byte')
  return pathname
}

async function resolveRequestFile(request, distRoot) {
  const pathname = parsePathname(request.url)
  const relativePath = pathname === '/' ? 'index.html' : `.${pathname}`
  const candidate = resolve(distRoot, relativePath)
  const insideDist = candidate === distRoot || candidate.startsWith(`${distRoot}${sep}`)

  if (!insideDist) return { status: 400 }

  try {
    const candidateStat = await stat(candidate)
    if (candidateStat.isFile()) return { filePath: candidate, status: 200 }
    if (candidateStat.isDirectory()) {
      try {
        const indexPath = resolve(candidate, 'index.html')
        if ((await stat(indexPath)).isFile()) return { filePath: indexPath, status: 200 }
      } catch (error) {
        if (error?.code !== 'ENOENT' && error?.code !== 'ENOTDIR') throw error
      }
    }
    return { status: 404 }
  } catch (error) {
    if (error?.code !== 'ENOENT' && error?.code !== 'ENOTDIR') throw error
  }

  const isNavigation = acceptsHtml(request) && extname(pathname) === ''
  if (isNavigation) {
    const notFoundPath = resolve(distRoot, '404.html')
    try {
      if ((await stat(notFoundPath)).isFile()) return { filePath: notFoundPath, status: 404 }
    } catch (error) {
      if (error?.code !== 'ENOENT') throw error
    }
    return { filePath: resolve(distRoot, 'index.html'), status: 200 }
  }

  return { status: 404 }
}

export function createAppServer({ distRoot = defaultDistRoot } = {}) {
  const absoluteDistRoot = resolve(distRoot)

  return createServer(async (request, response) => {
    response.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin')
    response.setHeader('X-Content-Type-Options', 'nosniff')

    if (request.method !== 'GET' && request.method !== 'HEAD') {
      response.setHeader('Allow', 'GET, HEAD')
      sendText(response, 405, 'Method not allowed')
      return
    }

    let resolvedRequest
    try {
      resolvedRequest = await resolveRequestFile(request, absoluteDistRoot)
    } catch (error) {
      if (error instanceof URIError) {
        sendText(response, 400, 'Malformed request path')
        return
      }
      console.error('Failed to resolve request', error)
      sendText(response, 500, 'Internal server error')
      return
    }

    if (!resolvedRequest.filePath) {
      sendText(response, resolvedRequest.status, resolvedRequest.status === 400 ? 'Invalid request path' : 'Not found')
      return
    }

    const filePath = resolvedRequest.filePath
    const fileName = filePath.split(sep).at(-1)
    const isMutableDocument = extname(filePath) === '.html' || fileName === 'robots.txt' || fileName === 'sitemap.xml'
    response.statusCode = resolvedRequest.status
    response.setHeader('Content-Type', contentTypes[extname(filePath).toLowerCase()] || 'application/octet-stream')
    response.setHeader('Cache-Control', isMutableDocument ? 'no-cache' : 'public, max-age=31536000, immutable')

    if (request.method === 'HEAD') {
      response.end()
      return
    }

    const stream = createReadStream(filePath)
    stream.on('error', (error) => {
      console.error(`Failed to stream ${filePath}`, error)
      if (!response.headersSent) sendText(response, 500, 'Internal server error')
      else response.destroy(error)
    })
    stream.pipe(response)
  })
}

const executedPath = process.argv[1] ? pathToFileURL(resolve(process.argv[1])).href : ''
if (import.meta.url === executedPath) {
  const port = Number(process.env.PORT || 4173)
  const host = process.env.HOST || '0.0.0.0'
  createAppServer().listen(port, host, () => {
    console.log(`udbhavram.com listening on ${host}:${port}`)
  })
}
