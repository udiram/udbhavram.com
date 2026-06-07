import fs from 'node:fs/promises'
import path from 'node:path'

const root = process.cwd()
const appPath = path.join(root, 'src/App.tsx')
const appSource = await fs.readFile(appPath, 'utf8')

const localAssets = [
  ...new Set([...appSource.matchAll(/['"](?<asset>\/assets\/[^'"]+)['"]/g)].map((match) => match.groups.asset)),
].sort()

const externalUrls = [
  ...new Set([...appSource.matchAll(/https?:\/\/[^'"\s)]+/g)].map((match) => match[0])),
].sort()

const imageAssetBlocks = [...appSource.matchAll(/(?<key>\w+):\s*{\s*src:\s*'(?<src>\/assets\/[^']+)',\s*alt:\s*'(?<alt>[^']*)'[\s\S]*?source:\s*'(?<source>https?:\/\/[^']+)'/g)]
  .map((match) => match.groups)

async function imageSize(filePath) {
  const buffer = await fs.readFile(filePath)

  if (buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) {
    return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20), type: 'png' }
  }

  if (buffer[0] === 0xff && buffer[1] === 0xd8) {
    let offset = 2
    while (offset < buffer.length) {
      if (buffer[offset] !== 0xff) break
      const marker = buffer[offset + 1]
      const length = buffer.readUInt16BE(offset + 2)
      if (marker >= 0xc0 && marker <= 0xc3) {
        return { height: buffer.readUInt16BE(offset + 5), width: buffer.readUInt16BE(offset + 7), type: 'jpg' }
      }
      offset += 2 + length
    }
  }

  if (buffer.subarray(0, 4).toString('ascii') === 'RIFF' && buffer.subarray(8, 12).toString('ascii') === 'WEBP') {
    const chunk = buffer.subarray(12, 16).toString('ascii')
    if (chunk === 'VP8X') return { width: buffer.readUIntLE(24, 3) + 1, height: buffer.readUIntLE(27, 3) + 1, type: 'webp' }
    if (chunk === 'VP8 ') return { width: buffer.readUInt16LE(26) & 0x3fff, height: buffer.readUInt16LE(28) & 0x3fff, type: 'webp' }
    if (chunk === 'VP8L') return {
      width: 1 + (((buffer[22] & 0x3f) << 8) | buffer[21]),
      height: 1 + (((buffer[24] & 0x0f) << 10) | (buffer[23] << 2) | ((buffer[22] & 0xc0) >> 6)),
      type: 'webp',
    }
  }

  return { width: 0, height: 0, type: 'unknown' }
}

async function checkUrl(url) {
  if (url.startsWith('mailto:')) return { url, status: 'skipped-mailto' }

  const headers = { 'user-agent': 'Mozilla/5.0 audit-site' }

  try {
    let response = await fetch(url, { method: 'HEAD', redirect: 'follow', signal: AbortSignal.timeout(12_000), headers })
    if ([403, 405, 429, 999].includes(response.status)) {
      response = await fetch(url, { method: 'GET', redirect: 'follow', signal: AbortSignal.timeout(12_000), headers })
    }
    if (response.status >= 500) {
      await new Promise((resolve) => setTimeout(resolve, 500))
      response = await fetch(url, { method: 'GET', redirect: 'follow', signal: AbortSignal.timeout(12_000), headers })
    }

    const status = response.status
    const gated = [403, 429, 999].includes(status)
    const browserSensitive = status >= 500 && /aapm\.confex\.com/.test(url)
    return { url, status, ok: (status >= 200 && status < 400) || gated || browserSensitive, gated, browserSensitive }
  } catch (error) {
    return { url, ok: false, error: error instanceof Error ? error.message : String(error) }
  }
}

const assetResults = []
for (const asset of localAssets) {
  const filePath = path.join(root, 'public', asset)
  try {
    await fs.access(filePath)
    if (path.extname(filePath).toLowerCase() === '.pdf') {
      const stat = await fs.stat(filePath)
      assetResults.push({ asset, ok: stat.size > 0, width: stat.size, height: 1, type: 'pdf' })
      continue
    }
    const size = await imageSize(filePath)
    assetResults.push({ asset, ok: size.width >= 120 && size.height >= 80, ...size })
  } catch (error) {
    assetResults.push({ asset, ok: false, error: error instanceof Error ? error.message : String(error) })
  }
}

const metadataResults = imageAssetBlocks.map((asset) => ({
  key: asset.key,
  src: asset.src,
  ok: asset.alt.trim().length >= 12 && asset.source.startsWith('https://'),
  hasAlt: asset.alt.trim().length >= 12,
  hasSource: asset.source.startsWith('https://'),
}))

const linkResults = []
for (const url of externalUrls) {
  linkResults.push(await checkUrl(url))
}

const missingAssets = assetResults.filter((result) => !result.ok)
const missingMetadata = metadataResults.filter((result) => !result.ok)
const badLinks = linkResults.filter((result) => !result.ok)

console.log(`Local assets checked: ${assetResults.length}`)
console.log(`Image metadata blocks checked: ${metadataResults.length}`)
console.log(`External URLs checked: ${linkResults.length}`)

const gatedLinks = linkResults.filter((result) => result.gated || result.browserSensitive)
if (gatedLinks.length) {
  console.log('\nReachable only through browser/gated responses:')
  gatedLinks.forEach((result) => console.log(`- ${result.status} ${result.url}`))
}

if (missingAssets.length || missingMetadata.length || badLinks.length) {
  if (missingAssets.length) {
    console.log('\nLocal image issues:')
    missingAssets.forEach((result) => console.log(`- ${result.asset} ${result.width ?? '?'}x${result.height ?? '?'} ${result.error ?? ''}`))
  }
  if (missingMetadata.length) {
    console.log('\nImage metadata issues:')
    missingMetadata.forEach((result) => console.log(`- ${result.key} ${result.src}`))
  }
  if (badLinks.length) {
    console.log('\nExternal link issues:')
    badLinks.forEach((result) => console.log(`- ${result.status ?? 'ERR'} ${result.url} ${result.error ?? ''}`))
  }
  process.exit(1)
}

console.log('\nAudit passed.')
