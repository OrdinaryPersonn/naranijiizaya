const photos = import.meta.glob('../../shop/*.jpg', { eager: true, query: '?url', import: 'default' }) as Record<string, string>

// Item numbers match the original photo filenames and payment references.
export const PRODUCTS = Array.from({ length: 16 }, (_, index) => ({
  id: String(index + 1).padStart(2, '0'),
  image: photos[`../../shop/${index + 1}.jpg`],
  price: 20000,
}))

export { default as qpayQr } from '../../shop/627c574e-3220-4957-9a25-d3985c69e6dd.jpeg'
export { default as alipayQr } from '../../shop/ba94c3f8-02af-41d7-81f7-85f136e80e9c.jpeg'
