import { useState } from 'react'
import type { PRODUCT_GROUPS } from '../data/merch'
import { SHOP_COPY } from '../data/shopCopy'
import type { Locale } from '../i18n/types'

export function ProductCard({ group, locale }: { group: typeof PRODUCT_GROUPS[number]; locale: Locale }) {
  const [selectedId, setSelectedId] = useState(group.variants[0].id)
  const product = group.variants.find(variant => variant.id === selectedId) ?? group.variants[0]
  const c = SHOP_COPY[locale]
  const variantsLabelId = `product-variants-${group.id}`

  return <article className="product-card">
    <a className={`product-image${product.id === '16' ? ' product-image--cropped' : ''}`} href={product.image} target="_blank" rel="noreferrer" aria-label={`${c.item} #${product.id}`}>
      <img src={product.image} alt={`${c.item} #${product.id} — BANJU 88 × Наран Ижий Заяа`} loading="lazy" width="2048" height="2048"/>
      <span>#{product.id}</span>
    </a>
    <div className="product-body">
      <div className="product-title-row" aria-live="polite" aria-atomic="true"><h3>{c.item} #{product.id}</h3><strong>₮{product.price.toLocaleString('en-US')}</strong></div>
      {group.variants.length > 1 && <div className="product-variants">
        <span className="product-variants-label" id={variantsLabelId}>{c.variants} · {group.variants.length}</span>
        <div className="product-variant-list" role="group" aria-labelledby={variantsLabelId}>
          {group.variants.map(variant => <button
            type="button"
            className="product-variant"
            key={variant.id}
            aria-label={`${c.item} #${variant.id}`}
            aria-pressed={variant.id === product.id}
            onClick={() => setSelectedId(variant.id)}
          >
            <img src={variant.image} alt="" loading="lazy" width="64" height="64"/>
            <span>#{variant.id}</span>
          </button>)}
        </div>
      </div>}
    </div>
  </article>
}
