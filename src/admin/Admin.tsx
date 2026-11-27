import { useEffect, useState, type FormEvent } from 'react'
import { parseContent, parseSnapshot, type ContentSnapshot, type EditableContent, type ContactDetails } from '../data/editableContent'
import { PRODUCT_GROUPS } from '../data/merch'
import { SHOP_COPY } from '../data/shopCopy'
import './admin.css'
import { AdminLogin } from './AdminLogin'

const copy = {
  en: {
    title: 'Manage your website', intro: 'Update prices and contact details. Saved changes appear on the live website.',
    products: 'Products', productsHelp: 'Prices apply to every item number in the group. Hide a group to remove it from the shop.',
    price: 'Price (₮)', visible: 'Show in shop', hidden: 'Hidden', contact: 'Contact & links',
    contactHelp: 'Leave a field empty to hide it. Use full https:// links.',
    email: 'Email', phone: 'Phone number', address: 'Address', shopOrderUrl: 'Order / Messenger link',
    facebook: 'Facebook', instagram: 'Instagram', youtube: 'YouTube',
    save: 'Save changes', saving: 'Saving…', saved: 'Saved. Your changes are live.', unsaved: 'You have unsaved changes.',
    unchanged: 'No unsaved changes', loading: 'Loading your website settings…', retry: 'Reload latest',
    reloadConfirm: 'Discard your unsaved edits and load the latest saved version?', website: 'View website', signout: 'Sign out',
    loadError: 'Could not load the editor. Your sign-in may have expired. Reload to sign in again.',
    saveError: 'Could not save. Your edits are still here; check your connection and try again.', lastSaved: 'Last saved', items: 'Items',
  },
  mn: {
    title: 'Вэбсайтаа удирдах', intro: 'Үнэ болон холбоо барих мэдээллээ шинэчилнэ үү. Хадгалсан өөрчлөлт вэбсайтад шууд харагдана.',
    products: 'Бараа', productsHelp: 'Үнэ нь тухайн бүлгийн бүх бараанд үйлчилнэ. Бүлгийг нуувал дэлгүүрт харагдахгүй.',
    price: 'Үнэ (₮)', visible: 'Дэлгүүрт харуулах', hidden: 'Нуусан', contact: 'Холбоо барих мэдээлэл',
    contactHelp: 'Хоосон талбар вэбсайтад харагдахгүй. Холбоосыг https://-ээр бүтэн оруулна уу.',
    email: 'И-мэйл', phone: 'Утасны дугаар', address: 'Хаяг', shopOrderUrl: 'Захиалга / Messenger холбоос',
    facebook: 'Facebook', instagram: 'Instagram', youtube: 'YouTube',
    save: 'Хадгалах', saving: 'Хадгалж байна…', saved: 'Хадгаллаа. Өөрчлөлт вэбсайтад орлоо.', unsaved: 'Хадгалаагүй өөрчлөлт байна.',
    unchanged: 'Бүх өөрчлөлт хадгалагдсан', loading: 'Мэдээллийг ачаалж байна…', retry: 'Сүүлийн хувилбарыг ачаалах',
    reloadConfirm: 'Хадгалаагүй өөрчлөлтөө орхиж, сүүлийн хувилбарыг ачаалах уу?', website: 'Вэбсайт үзэх', signout: 'Гарах',
    loadError: 'Удирдлагын хэсгийг ачаалж чадсангүй. Дахин ачаалж нэвтэрнэ үү.',
    saveError: 'Хадгалж чадсангүй. Таны өөрчлөлт хэвээр байна. Холболтоо шалгаад дахин оролдоно уу.', lastSaved: 'Сүүлд хадгалсан', items: 'Барааны дугаар',
  },
}

export default function Admin() {
  const [locale, setLocale] = useState<'mn' | 'en'>('mn')
  const [snapshot, setSnapshot] = useState<ContentSnapshot | null>(null)
  const [draft, setDraft] = useState<EditableContent | null>(null)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [needsLogin, setNeedsLogin] = useState(false)
  const [conflict, setConflict] = useState(false)
  const [loadVersion, setLoadVersion] = useState(0)
  const [signingOut, setSigningOut] = useState(false)
  const t = copy[locale]
  const dirty = !!draft && JSON.stringify(draft) !== JSON.stringify(snapshot?.content)

  useEffect(() => {
    document.title = 'Admin — Наран Ижий Заяа'
    document.documentElement.lang = locale
  }, [locale])
  useEffect(() => {
    let active = true
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 10000)
    fetch('/api/admin/content', { cache: 'no-store', credentials: 'same-origin', signal: controller.signal })
      .then(async response => {
        if (!response.ok || !response.headers.get('Content-Type')?.includes('application/json')) {
          if (active && (response.status === 401 || response.status === 503)) setNeedsLogin(true)
          const body = await response.json().catch(() => null)
          throw new Error(body?.error || 'Please reload to sign in again.')
        }
        const data = parseSnapshot(await response.json())
        if (active) { setSnapshot(data); setDraft(structuredClone(data.content)); setNeedsLogin(false); setError('') }
      }).catch(e => { if (active) setError(e instanceof Error ? e.message : 'Unable to load settings.') })
      .finally(() => { clearTimeout(timer); if (active) setLoading(false) })
    return () => { active = false; clearTimeout(timer); controller.abort() }
  }, [loadVersion])
  useEffect(() => {
    const warn = (event: BeforeUnloadEvent) => { if (dirty) { event.preventDefault(); event.returnValue = '' } }
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [dirty])

  const update = (next: EditableContent) => { setDraft(next); setSaved(false); if (!conflict) setError('') }
  const reload = () => { if (!dirty || window.confirm(t.reloadConfirm)) window.location.reload() }
  function signedIn() {
    setNeedsLogin(false); setError('')
    if (!draft) { setLoading(true); setLoadVersion(value => value + 1) }
  }
  async function logout() {
    if (dirty && !window.confirm(t.reloadConfirm)) return
    setSigningOut(true)
    try {
      const response = await fetch('/api/admin/logout', {
        method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, body: '{}',
        signal: AbortSignal.timeout(10000),
      })
      if (!response.ok) throw new Error('Could not sign out. Please try again.')
      setDraft(null); setSnapshot(null); setNeedsLogin(true); setSaved(false); setError(''); setConflict(false)
    } catch (error) { setError((error as Error).message) }
    finally { setSigningOut(false) }
  }
  async function save(event: FormEvent) {
    event.preventDefault()
    if (!draft || !snapshot || saving || conflict || needsLogin || signingOut) return
    let content: EditableContent
    try { content = parseContent(draft) } catch (e) { setError((e as Error).message); return }
    setSaving(true); setError(''); setSaved(false)
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 15000)
    try {
      const response = await fetch('/api/admin/content', {
        method: 'PUT', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, revision: snapshot.revision }), signal: controller.signal,
      })
      if (response.status === 409) setConflict(true)
      if (response.status === 401 || response.status === 403 || response.redirected) setNeedsLogin(true)
      const body = await response.json().catch(() => null)
      if (!response.ok || !body) throw new Error(body?.error || t.saveError)
      const data = parseSnapshot(body)
      setSnapshot(data); setDraft(structuredClone(data.content)); setSaved(true)
    } catch (e) { setError(e instanceof Error && e.name !== 'AbortError' ? e.message : t.saveError) }
    finally { clearTimeout(timer); setSaving(false) }
  }

  return <div className="admin-app">
    <header className="admin-header"><a className="admin-brand" href="/">Наран Ижий Заяа <span>ADMIN</span></a>
      <nav aria-label="Admin navigation"><a href="/" target="_blank" rel="noreferrer">{t.website}</a><button type="button" className="admin-signout" disabled={!draft || saving || signingOut} onClick={logout}>{t.signout}</button>
        <select aria-label="Language" value={locale} onChange={e => setLocale(e.target.value as 'mn' | 'en')}><option value="mn">Монгол</option><option value="en">English</option></select>
      </nav></header>
    <main className="admin-main" id="main-content"><div className="admin-intro"><p className="admin-eyebrow">НҮТББ · WEBSITE SETTINGS</p><h1>{t.title}</h1><p>{t.intro}</p></div>
      {loading && <p role="status">{t.loading}</p>}
      {!loading && !draft && !needsLogin && <div className="admin-notice" role="alert"><p>{error || t.loadError}</p><button type="button" onClick={reload}>{t.retry}</button></div>}
      {!loading && needsLogin && <AdminLogin locale={locale} onSignedIn={signedIn}/>}
      {draft && <form onSubmit={save}>
        <fieldset disabled={saving || needsLogin || signingOut} className="admin-fields"><legend className="admin-sr-only">{t.title}</legend>
          <section className="admin-section"><h2>{t.products}</h2><p className="admin-help">{t.productsHelp}</p><div className="admin-products">
            {PRODUCT_GROUPS.map(group => {
              const product = draft.products.find(item => item.id === group.id)!
              return <article className={`admin-product${product.visible ? '' : ' admin-product--hidden'}`} key={group.id}>
                <img src={group.variants[0].image} alt={SHOP_COPY[locale].productNames[group.name]} width="100" height="100"/>
                <div className="admin-product-info"><h3>{SHOP_COPY[locale].productNames[group.name]}</h3><p>{t.items}: {group.variants.map(item => `#${item.id}`).join(', ')}</p></div>
                <label className="admin-price">{t.price}<input aria-label={`${SHOP_COPY[locale].productNames[group.name]} #${group.id} ${t.price}`} type="number" inputMode="numeric" min="1" max="100000000" step="1" required value={product.price || ''} onChange={e => update({ ...draft, products: draft.products.map(item => item.id === group.id ? { ...item, price: Number(e.target.value) } : item) })}/></label>
                <label className="admin-visibility"><input type="checkbox" checked={product.visible} onChange={e => update({ ...draft, products: draft.products.map(item => item.id === group.id ? { ...item, visible: e.target.checked } : item) })}/><span>{t.visible}</span></label>
              </article>
            })}
          </div></section>
          <section className="admin-section"><h2>{t.contact}</h2><p className="admin-help">{t.contactHelp}</p><div className="admin-contact">
            {(Object.keys(draft.contact) as (keyof ContactDetails)[]).map(key => <label key={key} className={key === 'address' || key === 'shopOrderUrl' ? 'admin-wide' : ''}>{t[key]}
              {key === 'address' ? <textarea rows={3} maxLength={500} value={draft.contact[key]} onChange={e => update({ ...draft, contact: { ...draft.contact, [key]: e.target.value } })}/> :
                <input type={key === 'email' ? 'email' : key === 'phone' ? 'tel' : 'url'} maxLength={300} value={draft.contact[key]} placeholder={key === 'email' ? 'hello@example.org' : key === 'phone' ? '+976 …' : 'https://'} onChange={e => update({ ...draft, contact: { ...draft.contact, [key]: e.target.value } })}/>}
            </label>)}
          </div></section>
        </fieldset>
        <div className="admin-savebar"><div aria-live="polite"><p className={saved ? 'admin-success' : ''}>{saved ? t.saved : dirty ? t.unsaved : t.unchanged}</p>{snapshot?.updatedAt && <small>{t.lastSaved}: {new Date(snapshot.updatedAt).toLocaleString(locale === 'mn' ? 'mn-MN' : 'en-US')}</small>}</div><button type="submit" disabled={!dirty || saving || conflict || needsLogin || signingOut}>{saving ? t.saving : t.save}</button></div>
        {error && <div className="admin-notice" role="alert"><p>{error}</p>{(conflict || needsLogin) && <button type="button" onClick={reload}>{t.retry}</button>}</div>}
      </form>}
    </main>
  </div>
}
