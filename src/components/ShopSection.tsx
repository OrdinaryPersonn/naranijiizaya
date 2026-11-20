import { useRef, useState } from 'react'
import { PRODUCTS, qpayQr, alipayQr } from '../data/merch'
import { SHOP_COPY } from '../data/shopCopy'
import { SITE_CONFIG } from '../config/site'
import type { Locale } from '../i18n/types'
import { SectionHeading } from './SectionHeading'

export function ShopSection({ locale }: { locale: Locale }) {
  const c = SHOP_COPY[locale]
  const [item, setItem] = useState(PRODUCTS[0].id)
  const [phone, setPhone] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [status, setStatus] = useState<'copied' | 'failed' | ''>('')
  const phoneRef = useRef<HTMLInputElement>(null)
  const validPhone = /^\+?[\d\s()-]{6,24}$/.test(phone.trim()) && phone.replace(/\D/g, '').length >= 6
  const reference = validPhone ? `${phone.trim()} / #${item} / x${quantity}` : ''
  const money = (amount: number) => `₮${amount.toLocaleString('en-US')}`
  return <section className="section shop-section" id="shop"><div className="shell">
    <SectionHeading eyebrow="BANJU 88 × НАРАН ИЖИЙ ЗАЯА" title={c.title} body={c.body}/>
    <div className="shop-intro"><div><ul>{c.contents.map(content => <li key={content}>{content}</li>)}</ul><p className="shop-impact">{c.impact}</p></div><div><p>{c.bulk}</p><a className="button button--outline" href={SITE_CONFIG.socials.facebook} target="_blank" rel="noreferrer">{c.contact}</a></div></div>
    <div className="shop-grid">{PRODUCTS.map(product => <article className="product-card" key={product.id}>
      <a className="product-image" href={product.image} target="_blank" rel="noreferrer" aria-label={`${c.item} #${product.id}`}><img src={product.image} alt={`${c.item} #${product.id} — BANJU 88 × Наран Ижий Заяа`} loading="lazy" width="2048" height="2048"/><span>#{product.id}</span></a>
      <div className="product-body"><div className="product-title-row"><h3>{c.item} #{product.id}</h3><strong>{money(product.price)}</strong></div>
      <button className="button button--primary" type="button" onClick={() => { setItem(product.id); setStatus(''); document.getElementById('shop-payment')?.scrollIntoView({ behavior: 'smooth' }); phoneRef.current?.focus({ preventScroll: true }) }}>{c.choose}</button></div>
    </article>)}</div>
    <div className="shop-payment" id="shop-payment"><div className="shop-payment-copy"><h3>{c.payment}</h3><p>{c.instructions}</p>
      <form onSubmit={async event => { event.preventDefault(); if (!validPhone) { phoneRef.current?.focus(); return } try { await navigator.clipboard.writeText(reference); setStatus('copied') } catch { setStatus('failed') } }}>
        <div className="shop-fields"><label>{c.item}<select value={item} onChange={event => { setItem(event.target.value); setStatus('') }}>{PRODUCTS.map(product => <option key={product.id} value={product.id}>{c.item} #{product.id}</option>)}</select></label>
        <label>{c.quantity}<select value={quantity} onChange={event => { setQuantity(Number(event.target.value)); setStatus('') }}>{Array.from({ length: 20 }, (_, index) => <option key={index + 1} value={index + 1}>{index + 1}</option>)}</select></label></div>
        <label>{c.phone}<input ref={phoneRef} type="tel" autoComplete="tel" required minLength={6} maxLength={24} value={phone} placeholder="99112233" onChange={event => { setPhone(event.target.value); setStatus('') }}/></label>
        <div className="shop-total"><span>{c.total}</span><strong>{money(20000 * quantity)}</strong></div>
        <label>{c.reference}<input readOnly value={reference} placeholder="99112233 / #01 / x1" onFocus={event => event.target.select()}/></label>
        <button className="button button--primary" type="submit" disabled={!validPhone}>{c.copy}</button><p className="shop-copy-status" role="status">{status ? c[status] : ''}</p>
      </form><p className="shop-payment-note">{c.note}</p>
    </div><div className="shop-qr-grid">{[{ name: 'QPay', image: qpayQr }, { name: 'Alipay', image: alipayQr }].map(method => <figure key={method.name}><figcaption>{method.name}</figcaption><a href={method.image} target="_blank" rel="noreferrer"><img src={method.image} alt={`${method.name} QR`} loading="lazy"/><span>{c.open}</span></a></figure>)}</div></div>
  </div></section>
}
