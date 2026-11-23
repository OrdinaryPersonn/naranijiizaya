import { PRODUCT_GROUPS } from '../data/merch'
import { SHOP_COPY } from '../data/shopCopy'
import { SITE_CONFIG } from '../config/site'
import type { Locale } from '../i18n/types'
import { SectionHeading } from './SectionHeading'
import { ProductCard } from './ProductCard'

export function ShopSection({ locale }: { locale: Locale }) {
  const c = SHOP_COPY[locale]
  return <section className="section shop-section" id="shop"><div className="shell">
    <SectionHeading eyebrow="BANJU 88 × НАРАН ИЖИЙ ЗАЯА" title={c.title} body={c.body}/>
    <div className="shop-intro"><div><ul>{c.contents.map(content => <li key={content}>{content}</li>)}</ul><p className="shop-impact">{c.impact}</p></div><div><p>{c.bulk}</p><a className="button button--outline" href={SITE_CONFIG.shopOrderUrl} target="_blank" rel="noreferrer">{c.contact}</a></div></div>
    <div className="shop-grid">{PRODUCT_GROUPS.map(group => <ProductCard key={group.id} group={group} locale={locale}/>)}</div>
  </div></section>
}
