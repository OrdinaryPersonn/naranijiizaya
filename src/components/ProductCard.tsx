import { useEffect, useRef, useState } from 'react'
import type { PRODUCT_GROUPS } from '../data/merch'
import { SHOP_COPY } from '../data/shopCopy'
import type { Locale } from '../i18n/types'
import { Icon } from './Icon'
import { SITE_CONFIG } from '../config/site'

export function ProductCard({ group, locale }: { group: typeof PRODUCT_GROUPS[number]; locale: Locale }) {
  const [selectedId, setSelectedId] = useState(group.variants[0].id)
  const variantListRef = useRef<HTMLDivElement>(null)
  const product = group.variants.find(variant => variant.id === selectedId) ?? group.variants[0]
  const c = SHOP_COPY[locale]
  const name = c.productNames[group.name]
  const moveVariant = (direction: number) => {
    const index = group.variants.findIndex(variant => variant.id === selectedId)
    setSelectedId(group.variants[(index + direction + group.variants.length) % group.variants.length].id)
  }

  useEffect(() => {
    const list = variantListRef.current
    const selected = list?.querySelector<HTMLElement>('[aria-pressed="true"]')
    if (list && selected) list.scrollTo({
      left: selected.offsetLeft - (list.clientWidth - selected.offsetWidth) / 2,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
    })
  }, [selectedId])

  return <article className="product-card">
    <a className={`product-image${product.id === '16' ? ' product-image--cropped' : ''}`} href={product.image} target="_blank" rel="noreferrer" aria-label={`${name} — ${c.item} #${product.id}`}>
      <div className="product-photo-frame"><img src={product.image} alt={`${name} #${product.id} — BANJU 88 × Наран Ижий Заяа`} loading="lazy" width="2048" height="2048"/></div>
    </a>
    <div className="product-caption"><h3>{name}</h3><strong>₮{group.price.toLocaleString('en-US')}</strong></div>
    {group.variants.length > 1 && <>
      <button type="button" className="product-variant-arrow product-variant-arrow--previous" aria-label={c.previousVariant} onClick={() => moveVariant(-1)}><Icon name="chevron" size={18}/></button>
      <button type="button" className="product-variant-arrow product-variant-arrow--next" aria-label={c.nextVariant} onClick={() => moveVariant(1)}><Icon name="chevron" size={18}/></button>
      <span className="sr-only" aria-live="polite" aria-atomic="true">{name} — {c.item} #{product.id}</span>
    </>}
    <div className="product-controls">
    {group.variants.length > 1
      ? <div className="product-variant-list" ref={variantListRef} role="group" aria-label={`${name} — ${c.variants}`}>
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
      <a className="product-buy" href={SITE_CONFIG.shopOrderUrl} target="_blank" rel="noopener noreferrer" aria-label={`${c.buy}: ${name} #${product.id}`}>{c.buy}</a>
    </div>
  </article>
}
