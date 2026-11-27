import { PRODUCT_GROUPS } from '../data/merch'
import { SHOP_COPY } from '../data/shopCopy'
import { useSiteContent } from '../content/ContentProvider'
import type { Locale } from '../i18n/types'
import { SectionHeading } from './SectionHeading'
import { ProductCard } from './ProductCard'

export function ShopSection({ locale }: { locale: Locale }) {
  const c = SHOP_COPY[locale]
  const { content, loading, error, reload } = useSiteContent()
  const groups = content ? PRODUCT_GROUPS.flatMap(group => {
    const saved = content.products.find(product => product.id === group.id)
    return saved?.visible ? [{ ...group, price: saved.price }] : []
  }) : []
  const messages = {
    mn: ['Үнийг ачаалж байна…', 'Барааны мэдээлэл түр боломжгүй байна.', 'Дахин оролдох', 'Одоогоор худалдаанд байгаа бараа алга.'],
    en: ['Loading prices…', 'Product details are temporarily unavailable.', 'Try again', 'No products are currently available.'],
    zh: ['正在加载价格…', '商品信息暂时无法加载。', '重试', '目前没有在售商品。'],
    ru: ['Загрузка цен…', 'Информация о товарах временно недоступна.', 'Повторить', 'Сейчас нет товаров в продаже.'],
  }[locale]
  return <section className="section shop-section" id="shop"><div className="shell">
    <SectionHeading eyebrow="BANJU 88 × НАРАН ИЖИЙ ЗАЯА" title={c.title} body={c.body}/>
    <div className="shop-intro">
      <ul className="shop-intro-products">{c.contents.map(content => <li key={content}>{content}</li>)}</ul>
      <p className="shop-impact">{c.impact}</p>
      {content?.contact.shopOrderUrl && <a className="button button--outline shop-contact" href={content.contact.shopOrderUrl} target="_blank" rel="noreferrer">{c.contact}</a>}
    </div>
    {loading && !content && <p role="status">{messages[0]}</p>}
    {error && <div role="status"><p>{messages[1]}</p><button className="button button--outline" onClick={reload}>{messages[2]}</button></div>}
    {content && groups.length === 0 && <p>{messages[3]}</p>}
    <div className="shop-grid">{groups.map(group => <ProductCard key={group.id} group={group} locale={locale} orderUrl={content?.contact.shopOrderUrl ?? ''}/>)}</div>
  </div></section>
}
