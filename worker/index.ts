import { parseContent, type ContentSnapshot } from '../src/data/editableContent'
import { authorize, signIn, signOut, HttpError, type AuthEnv } from './auth'
import { database } from './storage'

export type Env = AuthEnv & { ASSETS: Fetcher }
type Row = { content: string; revision: number; updated_at: string | null }
function snapshot(row: Row): ContentSnapshot {
  return { content: parseContent(JSON.parse(row.content)), revision: row.revision, updatedAt: row.updated_at }
}
function json(value: unknown, status = 200): Response {
  return Response.json(value, { status, headers: { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff',
    'X-Robots-Tag': 'noindex', 'Vary': 'Cookie' } })
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
      if (url.pathname === '/api/admin/login' || url.pathname === '/api/admin/logout') {
        if (request.method !== 'POST') throw new HttpError(405, 'Method not allowed.')
        if (request.headers.get('Origin') !== url.origin || request.headers.get('Sec-Fetch-Site') === 'cross-site') throw new HttpError(403, 'Sign in or out from this website’s admin page.')
        const body = await readJson(request)
        const setCookie = url.pathname.endsWith('/login')
          ? await signIn(request, env, body && typeof body === 'object' && 'password' in body ? body.password : undefined)
          : await signOut(request, env)
        const response = json({ ok: true })
        response.headers.set('Set-Cookie', setCookie)
        return response
      }
      // The page is a public sign-in shell; every private API request requires a session.
      if (adminApi) email = await authenticate(request, env)
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
      if (error instanceof HttpError) {
        const response = json({ error: error.message }, error.status)
        if (error.status === 429) response.headers.set('Retry-After', '900')
        return response
      }
      console.error('Content service failed', error instanceof Error ? error.message : 'Unknown error')
      return json({ error: 'Content is temporarily unavailable. Please try again.' }, 503)
    }
  }
}
export default { fetch: createHandler() }
