import { PRODUCTS, qpayQr, alipayQr } from '../data/merch'
import { SHOP_COPY } from '../data/shopCopy'
import { SITE_CONFIG } from '../config/site'
import type { Locale } from '../i18n/types'
import { SectionHeading } from './SectionHeading'

export function ShopSection({ locale }: { locale: Locale }) {
  const c = SHOP_COPY[locale]
  const money = (amount: number) => `₮${amount.toLocaleString('en-US')}`
  return <section className="section shop-section" id="shop"><div className="shell">
    <SectionHeading eyebrow="BANJU 88 × НАРАН ИЖИЙ ЗАЯА" title={c.title} body={c.body}/>
    <div className="shop-intro"><div><ul>{c.contents.map(content => <li key={content}>{content}</li>)}</ul><p className="shop-impact">{c.impact}</p></div><div><p>{c.bulk}</p><a className="button button--outline" href={SITE_CONFIG.socials.facebook} target="_blank" rel="noreferrer">{c.contact}</a></div></div>
    <div className="shop-grid">{PRODUCTS.map(product => <article className="product-card" key={product.id}>
      <a className="product-image" href={product.image} target="_blank" rel="noreferrer" aria-label={`${c.item} #${product.id}`}><img src={product.image} alt={`${c.item} #${product.id} — BANJU 88 × Наран Ижий Заяа`} loading="lazy" width="2048" height="2048"/><span>#{product.id}</span></a>
      <div className="product-body"><div className="product-title-row"><h3>{c.item} #{product.id}</h3><strong>{money(product.price)}</strong></div>
      </div>
    </article>)}</div>
    <div className="shop-payment" id="shop-payment"><div className="shop-payment-copy"><h3>{c.payment}</h3><p>{c.instructions}</p>
      <ol className="shop-payment-steps">{c.steps.map(step => <li key={step}>{step}</li>)}</ol>
      <div className="shop-payment-example"><strong>{c.exampleLabel}</strong><p>{c.example}</p><span>{c.exampleHelp}</span></div>
      <p className="shop-payment-note">{c.note}</p>
    </div><div className="shop-qr-grid">{[{ name: 'QPay', image: qpayQr }, { name: 'Alipay', image: alipayQr }].map(method => <figure key={method.name}><figcaption>{method.name}</figcaption><a href={method.image} target="_blank" rel="noreferrer"><img src={method.image} alt={`${method.name} QR`} loading="lazy"/><span>{c.open}</span></a></figure>)}</div></div>
  </div></section>
}
