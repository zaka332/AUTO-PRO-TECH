// خادم معاينة ثابت مع دعم SPA — يخدم dist ويحوّل أي مسار إلى index.html
import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import { extname, join, normalize } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(fileURLToPath(new URL('.', import.meta.url)), '..', 'dist')
const PORT = process.env.PORT || 4173

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.json': 'application/json',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.webm': 'video/webm',
}

createServer(async (req, res) => {
  try {
    let path = decodeURIComponent(new URL(req.url, 'http://x').pathname)
    if (path.endsWith('/')) path += 'index.html'
    const file = normalize(join(ROOT, path))
    if (!file.startsWith(ROOT)) { res.writeHead(403); return res.end() }
    const data = await readFile(file).catch(() => null)
    if (data) {
      res.writeHead(200, { 'Content-Type': MIME[extname(file)] || 'application/octet-stream' })
      return res.end(data)
    }
    // SPA fallback
    const index = await readFile(join(ROOT, 'index.html'))
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
    res.end(index)
  } catch {
    res.writeHead(500)
    res.end('error')
  }
}).listen(PORT, () => console.log(`AutoProTech preview: http://localhost:${PORT}`))
