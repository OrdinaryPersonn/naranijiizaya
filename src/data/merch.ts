export type Product = {
  id: string
  name: string
  description: string
  price: string
  currency: string
  images: string[]
  variants: string[]
  availability: 'coming-soon' | 'available'
  featured: boolean
  purchaseUrl: string
  status: 'development-placeholder' | 'published'
}

/** DEVELOPMENT PLACEHOLDERS. Replace with approved products and prices before launch. */
export const PRODUCTS: Product[] = [
  { id: 'tee', name: 'Тэмдэгтэй футболк', description: 'Брэндийн энгийн, биед эвтэйхэн өдөр тутмын загвар.', price: '', currency: 'MNT', images: ['/images/merch-placeholder.svg'], variants: ['Размер TBD'], availability: 'coming-soon', featured: true, purchaseUrl: '', status: 'development-placeholder' },
  { id: 'cap', name: 'Нарны малгай', description: 'Зөөлөн өнгө, энгийн тэмдэглэгээтэй загварын санаа.', price: '', currency: 'MNT', images: ['/images/merch-placeholder.svg'], variants: ['Размер TBD'], availability: 'coming-soon', featured: false, purchaseUrl: '', status: 'development-placeholder' },
  { id: 'tote', name: 'Даавуун цүнх', description: 'Өдөр тутамд ашиглахад зориулсан дахин хэрэглэгдэх цүнхний санаа.', price: '', currency: 'MNT', images: ['/images/merch-placeholder.svg'], variants: [], availability: 'coming-soon', featured: false, purchaseUrl: '', status: 'development-placeholder' },
  { id: 'pin', name: 'Нарны тэмдэг', description: 'Дэмжлэгээ илэрхийлэх жижиг аксессуарын санаа.', price: '', currency: 'MNT', images: ['/images/merch-placeholder.svg'], variants: [], availability: 'coming-soon', featured: false, purchaseUrl: '', status: 'development-placeholder' },
]
