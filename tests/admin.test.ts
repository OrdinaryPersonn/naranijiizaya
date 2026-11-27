import { test } from 'node:test'
import assert from 'node:assert/strict'
import { DatabaseSync } from 'node:sqlite'
import { authorize } from '../worker/auth'
import worker, { createHandler, type Env } from '../worker/index'
import { DEFAULT_CONTENT, parseContent } from '../src/data/editableContent'

const origin = 'https://naranijiizaya.org'
function environment() {
  const sqlite = new DatabaseSync(':memory:')
  function binding() {
    return {
      prepare(sql: string) {
        let values: (string | number)[] = []
        const statement = {
          bind(...args: (string | number)[]) { values = args; return statement },
          async run() { const result = sqlite.prepare(sql).run(...values); return { success: true, meta: { changes: result.changes } } },
          async first() { return sqlite.prepare(sql).get(...values) ?? null },
        }
        return statement
      },
    } as unknown as D1Database
  }
  const env = { CONTENT_DB: binding(), ASSETS: { fetch: async () => new Response('<html>website</html>', { headers: { 'Content-Type': 'text/html' } }) } } as unknown as Env
  return { env, sqlite, binding }
}
const signedIn = createHandler(async () => 'editor@example.org')
const get = (path = '/api/content') => new Request(origin + path)
function put(content: unknown, revision = 0, headers: Record<string, string> = {}) {
  return new Request(origin + '/api/admin/content', { method: 'PUT', headers: { Origin: origin, 'Content-Type': 'application/json', ...headers }, body: JSON.stringify({ content, revision }) })
}

test('saved prices, visibility and contacts persist across reads and reinitialization; stale saves are rejected', async () => {
  const { env, sqlite, binding } = environment()
  const initial = await (await signedIn(get(), env)).json() as any
  assert.deepEqual(initial.content, DEFAULT_CONTENT)
  const content = structuredClone(DEFAULT_CONTENT)
  content.products[0].price = 99000
  content.products[1].visible = false
  content.contact.phone = '+976 99112233'
  const savedResponse = await signedIn(put(content), env)
  assert.equal(savedResponse.status, 200)
  assert.equal(savedResponse.headers.get('Cache-Control'), 'no-store')
  const saved = await savedResponse.json() as any
  assert.equal(saved.revision, 1)
  assert.deepEqual(saved.content, content)
  // A new binding simulates a fresh deployment. INSERT OR IGNORE must preserve edits.
  env.CONTENT_DB = binding()
  const live = await (await signedIn(get(), env)).json() as any
  assert.deepEqual(live.content, content)
  assert.equal(live.revision, 1)
  assert.equal('updated_by' in live, false)
  assert.equal((await signedIn(put(DEFAULT_CONTENT, 0), env)).status, 409)
  assert.equal((await signedIn(put(content, 1), env)).status, 200)
  assert.equal(sqlite.prepare('SELECT updated_by FROM site_content').get()?.updated_by, 'editor@example.org')
  sqlite.close()
})

test('public content is read-only and every private API fails closed on all hostnames', async () => {
  const { env, sqlite } = environment()
  assert.equal((await worker.fetch(get(), env)).status, 200)
  for (const host of [origin, 'https://www.naranijiizaya.org', 'https://naranijiizaya.yanjka409.workers.dev']) {
    for (const path of ['/api/admin/content', '/api/admin/unknown']) {
      const response = await worker.fetch(new Request(host + path), env)
      assert.equal(response.status, 503)
      assert.equal(response.headers.get('Cache-Control'), 'no-store')
    }
  }
  const response = await worker.fetch(new Request(origin + '/api/content', { method: 'PUT', body: '{}' }), env)
  assert.equal(response.status, 405)
  assert.equal((await worker.fetch(get('/api/missing'), env)).status, 404)
  sqlite.close()
})

test('validation rejects negative prices, fractions, duplicate IDs, bad visibility, oversized fields and unsafe links', () => {
  for (const price of [-1, 0, 1.5, Infinity, 100000001, '100']) {
    const content = structuredClone(DEFAULT_CONTENT) as any
    content.products[0].price = price
    assert.throws(() => parseContent(content), /Prices/)
  }
  const duplicate = structuredClone(DEFAULT_CONTENT)
  duplicate.products[1].id = '01'
  assert.throws(() => parseContent(duplicate), /unique/)
  const invisible = structuredClone(DEFAULT_CONTENT) as any
  invisible.products[0].visible = 'false'
  assert.throws(() => parseContent(invisible), /visibility/)
  for (const link of ['javascript:alert(1)', 'http://example.org', 'https://name:password@example.org']) {
    const content = structuredClone(DEFAULT_CONTENT)
    content.contact.shopOrderUrl = link
    assert.throws(() => parseContent(content), /https/)
  }
  const tooLong = structuredClone(DEFAULT_CONTENT)
  tooLong.contact.address = 'x'.repeat(501)
  assert.throws(() => parseContent(tooLong))
})

test('server rejects cross-site writes, invalid payloads and oversized updates without changing content', async () => {
  const { env, sqlite } = environment()
  assert.equal((await signedIn(put(DEFAULT_CONTENT, 0, { Origin: 'https://attacker.example' }), env)).status, 403)
  assert.equal((await signedIn(put(DEFAULT_CONTENT, 0, { 'Sec-Fetch-Site': 'cross-site' }), env)).status, 403)
  assert.equal((await signedIn(put(DEFAULT_CONTENT, 0, { 'Content-Type': 'text/plain' }), env)).status, 415)
  assert.equal((await signedIn(put({ ...DEFAULT_CONTENT, products: [] }), env)).status, 400)
  assert.equal((await signedIn(put(DEFAULT_CONTENT, -1), env)).status, 400)
  const large = new Request(origin + '/api/admin/content', { method: 'PUT', headers: { Origin: origin, 'Content-Type': 'application/json' }, body: 'x'.repeat(17000) })
  assert.equal((await signedIn(large, env)).status, 413)
  assert.equal((await (await signedIn(get(), env)).json() as any).revision, 0)
  sqlite.close()
})

test('admin sign-in page is public without caching; missing storage returns an error instead of success', async () => {
  const { env, sqlite } = environment()
  const page = await worker.fetch(get('/admin'), env)
  assert.equal(page.status, 200)
  assert.equal(page.headers.get('Cache-Control'), 'no-store')
  assert.equal(page.headers.get('X-Robots-Tag'), 'noindex, nofollow')
  assert.equal((await signedIn(get(), { ...env, CONTENT_DB: undefined })).status, 503)
  sqlite.close()
})

const testPassword = 'test-only-long-admin-password-123'
function login(password: string, headers: Record<string, string> = {}) {
  return new Request(origin + '/api/admin/login', { method: 'POST', headers: { Origin: origin, 'Content-Type': 'application/json', ...headers }, body: JSON.stringify({ password }) })
}
const withCookie = (cookie: string, host = origin) => new Request(host + '/api/admin/content', { headers: { Cookie: cookie } })

test('password login issues a secure opaque session, supports writes, and logout revokes replay', async () => {
  const { env, sqlite } = environment()
  env.ADMIN_PASSWORD = testPassword
  const wrong = await worker.fetch(login('incorrect'), env)
  assert.equal(wrong.status, 401)
  assert.equal(wrong.headers.has('Set-Cookie'), false)
  const response = await worker.fetch(login(testPassword), env)
  assert.equal(response.status, 200)
  const header = response.headers.get('Set-Cookie')!
  for (const flag of ['__Host-naran_admin=', 'HttpOnly', 'Secure', 'SameSite=Strict', 'Path=/', 'Max-Age=28800']) assert.ok(header.includes(flag))
  assert.ok(!header.includes('Domain='))
  assert.ok(!header.includes(testPassword))
  assert.deepEqual(await response.json(), { ok: true })
  const cookie = header.split(';')[0]
  assert.equal((await worker.fetch(withCookie(cookie), env)).status, 200)
  const updated = structuredClone(DEFAULT_CONTENT)
  updated.products[0].price = 123456
  assert.equal((await worker.fetch(put(updated, 0, { Cookie: cookie }), env)).status, 200)
  assert.equal(sqlite.prepare('SELECT updated_by FROM site_content').get()?.updated_by, 'admin')
  const stored = sqlite.prepare('SELECT * FROM admin_sessions').get()!
  assert.ok(!JSON.stringify(stored).includes(cookie.split('=')[1]))
  assert.ok(!JSON.stringify(stored).includes(testPassword))
  const logout = await worker.fetch(new Request(origin + '/api/admin/logout', { method: 'POST', headers: { Origin: origin, 'Content-Type': 'application/json', Cookie: cookie }, body: '{}' }), env)
  assert.equal(logout.status, 200)
  assert.ok(logout.headers.get('Set-Cookie')?.includes('Max-Age=0'))
  assert.equal((await worker.fetch(withCookie(cookie), env)).status, 401)
  sqlite.close()
})

test('sessions reject forgery, alternate hosts, expiration and password rotation', async () => {
  const { env, sqlite } = environment()
  env.ADMIN_PASSWORD = testPassword
  const response = await worker.fetch(login(testPassword), env)
  const cookie = response.headers.get('Set-Cookie')!.split(';')[0]
  for (const host of ['https://www.naranijiizaya.org', 'https://naranijiizaya.yanjka409.workers.dev']) {
    assert.equal((await worker.fetch(withCookie(cookie, host), env)).status, 401)
  }
  assert.equal((await worker.fetch(withCookie('__Host-naran_admin=' + 'a'.repeat(43)), env)).status, 401)
  assert.equal((await worker.fetch(new Request(origin + '/api/admin/content', { headers: { 'Cf-Access-Jwt-Assertion': 'old-access-header' } }), env)).status, 401)
  env.ADMIN_PASSWORD = 'a-different-long-admin-password'
  assert.equal((await worker.fetch(withCookie(cookie), env)).status, 401)
  env.ADMIN_PASSWORD = testPassword
  sqlite.prepare('UPDATE admin_sessions SET expires_at = 1').run()
  assert.equal((await worker.fetch(withCookie(cookie), env)).status, 401)
  await assert.rejects(authorize(get(), env))
  sqlite.close()
})

test('sign-in is rate limited across handler instances and all hostnames', async () => {
  const { env, sqlite, binding } = environment()
  env.ADMIN_PASSWORD = testPassword
  for (let attempt = 0; attempt < 10; attempt++) {
    assert.equal((await worker.fetch(login('wrong'), env)).status, 401)
  }
  env.CONTENT_DB = binding()
  const blocked = await createHandler()(login(testPassword), env)
  assert.equal(blocked.status, 429)
  assert.equal(blocked.headers.get('Retry-After'), '900')
  const otherHost = new Request('https://www.naranijiizaya.org/api/admin/login', { method: 'POST', headers: { Origin: 'https://www.naranijiizaya.org', 'Content-Type': 'application/json' }, body: JSON.stringify({ password: testPassword }) })
  assert.equal((await worker.fetch(otherHost, env)).status, 429)
  sqlite.prepare('UPDATE admin_login_attempts SET reset_at = 1').run()
  assert.equal((await worker.fetch(login(testPassword), env)).status, 200)
  sqlite.close()
})

test('sign-in requires a configured strong secret, same-origin JSON and POST', async () => {
  const { env, sqlite } = environment()
  assert.equal((await worker.fetch(login(testPassword), env)).status, 503)
  env.ADMIN_PASSWORD = 'short'
  assert.equal((await worker.fetch(login('short'), env)).status, 503)
  env.ADMIN_PASSWORD = testPassword
  assert.equal((await worker.fetch(login(testPassword, { Origin: 'https://attacker.example' }), env)).status, 403)
  assert.equal((await worker.fetch(login(testPassword, { 'Content-Type': 'text/plain' }), env)).status, 415)
  assert.equal((await worker.fetch(get('/api/admin/login'), env)).status, 405)
  assert.equal((await worker.fetch(get('/api/admin/logout'), env)).status, 405)
  assert.equal((await worker.fetch(login(testPassword, { 'Sec-Fetch-Site': 'cross-site' }), env)).status, 403)
  sqlite.close()
})
