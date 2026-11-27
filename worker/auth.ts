import { createRemoteJWKSet, jwtVerify, type JWTVerifyGetKey } from 'jose'

export type AccessEnv = { ACCESS_TEAM_DOMAIN?: string; ACCESS_AUD?: string; ADMIN_EMAILS?: string }
const keySets = new Map<string, ReturnType<typeof createRemoteJWKSet>>()
export class HttpError extends Error {
  constructor(public status: number, message: string) { super(message) }
}
export async function authorize(request: Request, env: AccessEnv, keyResolver?: JWTVerifyGetKey): Promise<string> {
  if (!env.ACCESS_TEAM_DOMAIN || !env.ACCESS_AUD || !env.ADMIN_EMAILS) throw new HttpError(503, 'Admin sign-in is not configured yet. Follow ADMIN_SETUP.md in the GitHub repository.')
  let issuer: URL
  try { issuer = new URL(env.ACCESS_TEAM_DOMAIN) } catch { throw new HttpError(503, 'Admin sign-in configuration is invalid.') }
  if (issuer.protocol !== 'https:' || !/^[a-z0-9-]+\.cloudflareaccess\.com$/.test(issuer.hostname) || issuer.port || issuer.username || issuer.password || issuer.pathname !== '/' || issuer.search || issuer.hash) throw new HttpError(503, 'Admin sign-in configuration is invalid.')
  const token = request.headers.get('Cf-Access-Jwt-Assertion')
  if (!token) throw new HttpError(401, 'Sign in with your approved email address to continue.')
  try {
    let keys = keyResolver ?? keySets.get(issuer.origin)
    if (!keys) {
      const remoteKeys = createRemoteJWKSet(new URL('/cdn-cgi/access/certs', issuer))
      keySets.set(issuer.origin, remoteKeys)
      keys = remoteKeys
    }
    const { payload } = await jwtVerify(token, keys, {
      issuer: issuer.origin, audience: env.ACCESS_AUD, algorithms: ['RS256'], requiredClaims: ['exp', 'iat', 'sub', 'email'],
    })
    const email = typeof payload.email === 'string' ? payload.email.toLowerCase() : ''
    const allowed = env.ADMIN_EMAILS.split(',').map(value => value.trim().toLowerCase()).filter(Boolean)
    if (!email || !allowed.includes(email)) throw new Error('Not an admin')
    return email
  } catch { throw new HttpError(403, 'This sign-in is invalid, expired, or not authorized to edit the website.') }
}
