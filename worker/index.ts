import { DEFAULT_CONTENT, parseContent, type ContentSnapshot } from '../src/data/editableContent'
import { authorize, HttpError, type AccessEnv } from './auth'

export type Env = AccessEnv & { CONTENT_DB?: D1Database; ASSETS: Fetcher }
type Row = { content: string; revision: number; updated_at: string | null }
const initialized = new WeakMap<D1Database, Promise<void>>()
async function database(env: Env): Promise<D1Database> {
  if (!env.CONTENT_DB) throw new HttpError(503, 'Website content storage is not configured yet.')
  const db = env.CONTENT_DB
  let ready = initialized.get(db)
  if (!ready) {
    ready = (async () => {
      // Additive, idempotent initialization. Deployments never replace saved content.
      await db.prepare(`CREATE TABLE IF NOT EXISTS site_content (
        id INTEGER PRIMARY KEY CHECK (id = 1), content TEXT NOT NULL,
        revision INTEGER NOT NULL DEFAULT 0, updated_at TEXT, updated_by TEXT
      )`).run()
      await db.prepare('INSERT OR IGNORE INTO site_content (id, content, revision) VALUES (1, ?, 0)').bind(JSON.stringify(DEFAULT_CONTENT)).run()
    })()
    initialized.set(db, ready)
  }
  try { await ready } catch (error) { initialized.delete(db); throw error }
  return db
}
function snapshot(row: Row): ContentSnapshot {
  return { content: parseContent(JSON.parse(row.content)), revision: row.revision, updatedAt: row.updated_at }
}
function json(value: unknown, status = 200): Response {
  return Response.json(value, { status, headers: { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff',
    'X-Robots-Tag': 'noindex', 'Vary': 'Cookie, Cf-Access-Jwt-Assertion' } })
}
async function readJson(request: Request): Promise<unknown> {
  if (request.headers.get('Content-Type')?.split(';')[0].trim() !== 'application/json') throw new HttpError(415, 'Send JSON content.')
  if (Number(request.headers.get('Content-Length')) > 16384) throw new HttpError(413, 'The update is too large.')
  const reader = request.body?.getReader()
  if (!reader) throw new HttpError(400, 'An update is required.')
  const chunks: Uint8Array[] = []
  let length = 0
  while (true) {
    const { value, done } = await reader.read()
    if (done) break
    length += value.length
    if (length > 16384) { await reader.cancel(); throw new HttpError(413, 'The update is too large.') }
    chunks.push(value)
  }
  const bytes = new Uint8Array(length)
  let offset = 0
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length }
  try { return JSON.parse(new TextDecoder().decode(bytes)) } catch { throw new HttpError(400, 'Invalid JSON.') }
}
export function createHandler(authenticate = authorize) {
  return async function fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url)
    const adminPage = url.pathname === '/admin' || url.pathname.startsWith('/admin/')
    const adminApi = url.pathname === '/api/admin' || url.pathname.startsWith('/api/admin/')
    try {
      let email = ''
      // Authorization applies to every private path on every hostname, including workers.dev.
      if (adminPage || adminApi) email = await authenticate(request, env)
      if (adminPage) {
        if (!['GET', 'HEAD'].includes(request.method)) throw new HttpError(405, 'Method not allowed.')
        const page = await env.ASSETS.fetch(new Request(new URL('/', url), { method: request.method }))
        const response = new Response(page.body, page)
        response.headers.set('Cache-Control', 'no-store')
        response.headers.set('X-Robots-Tag', 'noindex, nofollow')
        response.headers.set('Content-Security-Policy', "frame-ancestors 'none'")
        return response
      }
      if (url.pathname === '/api/content' || url.pathname === '/api/admin/content') {
        if (request.method === 'GET') {
          const db = await database(env)
          const row = await db.prepare('SELECT content, revision, updated_at FROM site_content WHERE id = 1').first<Row>()
          if (!row) throw new Error('Content row is missing')
          return json(snapshot(row))
        }
        if (url.pathname !== '/api/admin/content' || request.method !== 'PUT') throw new HttpError(405, 'Method not allowed.')
        if (request.headers.get('Origin') !== url.origin || request.headers.get('Sec-Fetch-Site') === 'cross-site') throw new HttpError(403, 'Save changes from this website’s admin page.')
        const body = await readJson(request)
        if (!body || typeof body !== 'object' || !('content' in body) || !('revision' in body) || !Number.isSafeInteger(body.revision) || (body.revision as number) < 0) throw new HttpError(400, 'A valid content revision is required.')
        let content
        try { content = parseContent(body.content) } catch (error) { throw new HttpError(400, (error as Error).message) }
        const db = await database(env)
        const row = await db.prepare(`UPDATE site_content SET content = ?, revision = revision + 1, updated_at = ?, updated_by = ?
          WHERE id = 1 AND revision = ? RETURNING content, revision, updated_at`)
          .bind(JSON.stringify(content), new Date().toISOString(), email, body.revision).first<Row>()
        if (!row) throw new HttpError(409, 'Someone saved changes since you opened this page. Reload the latest version before editing again.')
        return json(snapshot(row))
      }
      if (url.pathname === '/api' || url.pathname.startsWith('/api/')) throw new HttpError(404, 'Not found.')
      return env.ASSETS.fetch(request)
    } catch (error) {
      if (error instanceof HttpError) return json({ error: error.message }, error.status)
      console.error('Content service failed', error instanceof Error ? error.message : 'Unknown error')
      return json({ error: 'Content is temporarily unavailable. Please try again.' }, 503)
    }
  }
}
export default { fetch: createHandler() }
