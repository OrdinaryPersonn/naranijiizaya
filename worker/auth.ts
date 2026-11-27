import { database, type StorageEnv } from './storage'
import { HttpError } from './errors'
export { HttpError } from './errors'

export type AuthEnv = StorageEnv & { ADMIN_PASSWORD?: string }
const COOKIE = '__Host-naran_admin'
const SESSION_SECONDS = 8 * 60 * 60
const WINDOW_MS = 15 * 60 * 1000
const encoder = new TextEncoder()
const hex = (bytes: ArrayBuffer) => Array.from(new Uint8Array(bytes), byte => byte.toString(16).padStart(2, '0')).join('')
const hash = async (value: string) => hex(await crypto.subtle.digest('SHA-256', encoder.encode(value)))
const hmacKey = (secret: string) => crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify'])
function password(env: AuthEnv): string {
  if (!env.ADMIN_PASSWORD || env.ADMIN_PASSWORD.length < 16 || env.ADMIN_PASSWORD.length > 1024) {
    throw new HttpError(503, 'Set an ADMIN_PASSWORD secret of at least 16 characters in this Worker’s Cloudflare settings to enable sign-in.')
  }
  return env.ADMIN_PASSWORD
}
function sessionToken(request: Request): string | null {
  const token = request.headers.get('Cookie')?.split(';').map(value => value.trim()).find(value => value.startsWith(`${COOKIE}=`))?.slice(COOKIE.length + 1)
  return token && /^[A-Za-z0-9_-]{43}$/.test(token) ? token : null
}
function cookie(value: string, maxAge: number): string {
  return `${COOKIE}=${value}; Path=/; Secure; HttpOnly; SameSite=Strict; Max-Age=${maxAge}`
}
const sessionMessage = (request: Request, token: string) => encoder.encode(`v1:${new URL(request.url).origin}:${token}`)

export async function signIn(request: Request, env: AuthEnv, submitted: unknown): Promise<string> {
  const expected = password(env)
  const db = await database(env)
  const now = Date.now()
  // Cloudflare supplies CF-Connecting-IP. Missing IPs share one bucket, never bypass the limit.
  const key = await hash(`admin-login:${request.headers.get('CF-Connecting-IP') || 'unknown'}`)
  await db.prepare('DELETE FROM admin_login_attempts WHERE reset_at <= ?').bind(now).run()
  const attempt = await db.prepare(`INSERT INTO admin_login_attempts (key, attempts, reset_at) VALUES (?, 1, ?)
    ON CONFLICT (key) DO UPDATE SET attempts = attempts + 1 RETURNING attempts`).bind(key, now + WINDOW_MS).first<{ attempts: number }>()
  if (!attempt || attempt.attempts > 10) throw new HttpError(429, 'Too many sign-in attempts. Wait 15 minutes and try again.')
  if (typeof submitted !== 'string' || submitted.length > 1024) throw new HttpError(401, 'Incorrect password.')
  // HMAC verification provides a constant-time comparison; no password is written to D1.
  const comparisonKey = await crypto.subtle.importKey('raw', crypto.getRandomValues(new Uint8Array(32)), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify'])
  const expectedTag = await crypto.subtle.sign('HMAC', comparisonKey, encoder.encode(expected))
  if (!await crypto.subtle.verify('HMAC', comparisonKey, expectedTag, encoder.encode(submitted))) throw new HttpError(401, 'Incorrect password.')
  const token = btoa(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(32)))).replaceAll('+', '-').replaceAll('/', '_').replaceAll('=', '')
  const tag = hex(await crypto.subtle.sign('HMAC', await hmacKey(expected), sessionMessage(request, token)))
  await db.prepare('DELETE FROM admin_sessions WHERE expires_at <= ?').bind(now).run()
  await db.prepare('INSERT INTO admin_sessions (token_hash, password_tag, expires_at) VALUES (?, ?, ?)')
    .bind(await hash(token), tag, now + SESSION_SECONDS * 1000).run()
  return cookie(token, SESSION_SECONDS)
}

export async function authorize(request: Request, env: AuthEnv): Promise<string> {
  const secret = password(env)
  const token = sessionToken(request)
  if (!token) throw new HttpError(401, 'Sign in to edit the website.')
  const db = await database(env)
  const row = await db.prepare('SELECT password_tag, expires_at FROM admin_sessions WHERE token_hash = ?')
    .bind(await hash(token)).first<{ password_tag: string; expires_at: number }>()
  if (!row || row.expires_at <= Date.now() || !/^[0-9a-f]{64}$/.test(row.password_tag)) throw new HttpError(401, 'Your session has expired. Sign in again.')
  const signature = Uint8Array.from(row.password_tag.match(/../g)!, value => parseInt(value, 16))
  // Binding the session to the current password also invalidates sessions after a password change.
  if (!await crypto.subtle.verify('HMAC', await hmacKey(secret), signature, sessionMessage(request, token))) throw new HttpError(401, 'Your session has expired. Sign in again.')
  return 'admin'
}

export async function signOut(request: Request, env: AuthEnv): Promise<string> {
  const token = sessionToken(request)
  if (token) {
    const db = await database(env)
    await db.prepare('DELETE FROM admin_sessions WHERE token_hash = ?').bind(await hash(token)).run()
  }
  return cookie('', 0)
}
