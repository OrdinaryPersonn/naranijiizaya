import { useState, type FormEvent } from 'react'

export function AdminLogin({ locale, onSignedIn }: { locale: 'mn' | 'en'; onSignedIn: () => void }) {
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const t = locale === 'mn' ? {
    title: 'Удирдлагын хэсэгт нэвтрэх', help: 'Вэбсайтын удирдлагын нууц үгээ оруулна уу.', password: 'Нууц үг',
    signIn: 'Нэвтрэх', signingIn: 'Нэвтэрч байна…', failed: 'Нэвтэрч чадсангүй. Дахин оролдоно уу.',
  } : {
    title: 'Admin sign-in', help: 'Enter your website admin password to continue.', password: 'Password',
    signIn: 'Sign in', signingIn: 'Signing in…', failed: 'Could not sign in. Please try again.',
  }
  async function submit(event: FormEvent) {
    event.preventDefault()
    if (busy) return
    setBusy(true); setError('')
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 15000)
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }), signal: controller.signal,
      })
      const body = await response.json().catch(() => null)
      if (!response.ok || body?.ok !== true) throw new Error(body?.error || t.failed)
      setPassword(''); onSignedIn()
    } catch (error) { setError(error instanceof Error && error.name !== 'AbortError' ? error.message : t.failed) }
    finally { clearTimeout(timer); setBusy(false) }
  }
  return <section className="admin-section admin-login" aria-labelledby="login-title">
    <h2 id="login-title">{t.title}</h2><p className="admin-help">{t.help}</p>
    <form onSubmit={submit}><label>{t.password}<input type="password" name="password" autoComplete="current-password" required maxLength={1024} value={password} disabled={busy} onChange={event => setPassword(event.target.value)}/></label>
      <button type="submit" disabled={busy || !password}>{busy ? t.signingIn : t.signIn}</button>
      {error && <div className="admin-notice" role="alert">{error}</div>}
    </form>
  </section>
}
