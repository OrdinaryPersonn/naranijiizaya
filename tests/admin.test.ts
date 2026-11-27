import { test } from 'node:test'
import assert from 'node:assert/strict'
import { DatabaseSync } from 'node:sqlite'
import { generateKeyPair, exportJWK, createLocalJWKSet, SignJWT } from 'jose'
import { authorize, HttpError } from '../worker/auth'
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

test('public content is read-only and every private route fails closed on all hostnames', async () => {
  const { env, sqlite } = environment()
  assert.equal((await worker.fetch(get(), env)).status, 200)
  for (const host of [origin, 'https://www.naranijiizaya.org', 'https://naranijiizaya.yanjka409.workers.dev']) {
    for (const path of ['/admin', '/admin/', '/api/admin/content', '/api/admin/unknown']) {
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

test('an authenticated admin page is served without caching; missing storage returns an error instead of success', async () => {
  const { env, sqlite } = environment()
  const page = await signedIn(get('/admin'), env)
  assert.equal(page.status, 200)
  assert.equal(page.headers.get('Cache-Control'), 'no-store')
  assert.equal(page.headers.get('X-Robots-Tag'), 'noindex, nofollow')
  assert.equal((await signedIn(get(), { ...env, CONTENT_DB: undefined })).status, 503)
  sqlite.close()
})

test('real JWT verification enforces signature, issuer, audience, expiration and allowed email', async () => {
  const { publicKey, privateKey } = await generateKeyPair('RS256')
  const jwk = await exportJWK(publicKey)
  jwk.kid = 'test-key'
  const keys = createLocalJWKSet({ keys: [jwk] })
  const env = { ACCESS_TEAM_DOMAIN: 'https://test-team.cloudflareaccess.com', ACCESS_AUD: 'expected-app', ADMIN_EMAILS: 'editor@example.org' }
  async function token(overrides: Record<string, unknown> = {}, signingKey = privateKey) {
    return new SignJWT({ email: 'editor@example.org', iss: env.ACCESS_TEAM_DOMAIN, aud: env.ACCESS_AUD, sub: 'user-id', iat: Math.floor(Date.now() / 1000), exp: Math.floor(Date.now() / 1000) + 300, ...overrides })
      .setProtectedHeader({ alg: 'RS256', kid: 'test-key' }).sign(signingKey)
  }
  const request = (value: string) => new Request(origin + '/api/admin/content', { headers: { 'Cf-Access-Jwt-Assertion': value } })
  assert.equal(await authorize(request(await token()), env, keys), 'editor@example.org')
  await assert.rejects(authorize(get('/admin'), env, keys), (e: HttpError) => e.status === 401)
  for (const overrides of [{ email: 'other@example.org' }, { aud: 'other-app' }, { iss: 'https://attacker.example' }, { exp: 1 }, { nbf: Math.floor(Date.now() / 1000) + 3600 }]) {
    await assert.rejects(authorize(request(await token(overrides)), env, keys), (e: HttpError) => e.status === 403)
  }
  const wrong = await generateKeyPair('RS256')
  await assert.rejects(authorize(request(await token({}, wrong.privateKey)), env, keys), (e: HttpError) => e.status === 403)
  await assert.rejects(authorize(request(await token()), { ...env, ACCESS_AUD: '' }, keys), (e: HttpError) => e.status === 503)
})
