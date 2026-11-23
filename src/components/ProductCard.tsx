import { useState } from 'react'
import type { PRODUCT_GROUPS } from '../data/merch'
import { SHOP_COPY } from '../data/shopCopy'
import type { Locale } from '../i18n/types'

export function ProductCard({ group, locale }: { group: typeof PRODUCT_GROUPS[number]; locale: Locale }) {
  const [selectedId, setSelectedId] = useState(group.variants[0].id)
  const product = group.variants.find(variant => variant.id === selectedId) ?? group.variants[0]
  const c = SHOP_COPY[locale]
  const name = c.productNames[group.name]

  return <article className="product-card">
    <a className={`product-image${product.id === '16' ? ' product-image--cropped' : ''}`} href={product.image} target="_blank" rel="noreferrer" aria-label={`${name} — ${c.item} #${product.id}`}>
      <div className="product-photo-frame"><img src={product.image} alt={`${name} #${product.id} — BANJU 88 × Наран Ижий Заяа`} loading="lazy" width="2048" height="2048"/></div>
    </a>
    <div className="product-caption"><h3>{name}</h3><strong>₮{group.price.toLocaleString('en-US')}</strong></div>
    {group.variants.length > 1
      ? <div className="product-variant-list" role="group" aria-label={`${name} — ${c.variants}`}>
          {group.variants.map(variant => <button
            type="button"
            className="product-variant"
            key={variant.id}
            aria-label={`${c.item} #${variant.id}`}
            aria-pressed={variant.id === product.id}
            onClick={() => setSelectedId(variant.id)}
          >
            <span>#{variant.id}</span>
          </button>)}
        </div>
      : <span className="product-number">#{product.id}</span>}
  </article>
}
