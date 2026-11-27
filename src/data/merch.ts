import { PRODUCT_DEFINITIONS } from './editableContent'
const photos = import.meta.glob('../../shop/*.jpg', { eager: true, query: '?url', import: 'default' }) as Record<string, string>

// Keep each variant's original item number for payment references.
export const PRODUCT_GROUPS = PRODUCT_DEFINITIONS.map(group => ({
  id: group.ids[0],
  name: group.name,
  price: group.price,
  variants: group.ids.map(id => ({
    id,
    image: photos[`../../shop/${Number(id)}.jpg`],
  })),
}))

export { default as qpayQr } from '../../shop/627c574e-3220-4957-9a25-d3985c69e6dd.jpeg'
export { default as alipayQr } from '../../shop/ba94c3f8-02af-41d7-81f7-85f136e80e9c.jpeg'
