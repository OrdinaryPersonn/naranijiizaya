const photos = import.meta.glob('../../shop/*.jpg', { eager: true, query: '?url', import: 'default' }) as Record<string, string>

// Keep each variant's original item number for payment references.
export const PRODUCT_GROUPS = [
  { ids: ['01', '02'], name: 'bundle', price: 88800 },
  { ids: ['03'], name: 'cup', price: 58800 },
  { ids: ['04', '05'], name: 'tote', price: 18800 },
  { ids: ['06', '07', '08', '09'], name: 'tote', price: 28800 },
  { ids: ['10', '11', '12', '13', '14', '15', '16'], name: 'pillbox', price: 18800 },
].map(group => ({
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
