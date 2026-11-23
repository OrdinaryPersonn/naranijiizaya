import { qpayQr, alipayQr } from '../data/merch'
import { SHOP_COPY } from '../data/shopCopy'
import type { Locale } from '../i18n/types'

export function PaymentQrCodes({ locale }: { locale: Locale }) {
  const c = SHOP_COPY[locale]
  return <div className="shop-qr-grid">{[
    { id: 'qpay', name: 'QPay', image: qpayQr, instructions: c.qpayScan },
    { id: 'alipay', name: 'Alipay / 支付宝', image: alipayQr, instructions: c.alipayScan },
  ].map(method => <figure className={`shop-qr-card shop-qr-card--${method.id}`} key={method.id}>
    <figcaption><strong>{method.name}</strong><span>{method.instructions}</span></figcaption>
    <a href={method.image} target="_blank" rel="noreferrer"><img src={method.image} alt={`${method.name} QR`} loading="lazy" width="576" height="576"/><span>{method.name} — {c.open}</span></a>
  </figure>)}</div>
}
