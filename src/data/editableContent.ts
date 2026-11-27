import { SITE_CONFIG } from '../config/site'

export const PRODUCT_DEFINITIONS = [
  { ids: ['01', '02'], name: 'bundle', price: 88800 },
  { ids: ['03'], name: 'cup', price: 58800 },
  { ids: ['04', '05'], name: 'tote', price: 18800 },
  { ids: ['06', '07', '08', '09'], name: 'tote', price: 28800 },
  { ids: ['10', '11', '12', '13', '14', '15', '16'], name: 'pillbox', price: 18800 },
]
export type ContactDetails = {
  email: string; phone: string; address: string; shopOrderUrl: string
  facebook: string; instagram: string; youtube: string
}
export type EditableContent = {
  products: { id: string; price: number; visible: boolean }[]
  contact: ContactDetails
}
export type ContentSnapshot = { content: EditableContent; revision: number; updatedAt: string | null }
export const DEFAULT_CONTENT: EditableContent = {
  products: PRODUCT_DEFINITIONS.map(group => ({ id: group.ids[0], price: group.price, visible: true })),
  contact: { email: SITE_CONFIG.email, phone: SITE_CONFIG.phone, address: SITE_CONFIG.address,
    shopOrderUrl: SITE_CONFIG.shopOrderUrl, ...SITE_CONFIG.socials },
}
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}
// Validate on the server as well as in the editor. Never accept arbitrary HTML or URL schemes.
export function parseContent(value: unknown): EditableContent {
  if (!isRecord(value) || !Array.isArray(value.products) || !isRecord(value.contact)) throw new Error('Products and contact details are required.')
  const inputProducts = value.products
  const ids = PRODUCT_DEFINITIONS.map(group => group.ids[0])
  if (inputProducts.length !== ids.length) throw new Error('All product groups must be included.')
  const products = ids.map(id => {
    const matches = inputProducts.filter((p: unknown) => isRecord(p) && p.id === id)
    const product = matches[0]
    if (matches.length !== 1 || !isRecord(product)) throw new Error('Product groups must have unique, valid IDs.')
    if (typeof product.price !== 'number' || !Number.isSafeInteger(product.price) || product.price < 1 || product.price > 100000000) throw new Error('Prices must be whole tugrik amounts between 1 and 100,000,000.')
    if (typeof product.visible !== 'boolean') throw new Error('Product visibility must be true or false.')
    return { id, price: product.price, visible: product.visible }
  })
  const contact = {} as ContactDetails
  for (const key of Object.keys(DEFAULT_CONTENT.contact) as (keyof ContactDetails)[]) {
    const field = value.contact[key]
    if (typeof field !== 'string' || field.length > (key === 'address' ? 500 : 300)) throw new Error(`Please enter a valid ${key}.`)
    contact[key] = field.trim()
  }
  if (contact.email && !/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(contact.email)) throw new Error('Please enter a valid email address.')
  if (contact.phone && !/^\+?[\d ()-]{4,30}$/.test(contact.phone)) throw new Error('Please enter a valid phone number.')
  for (const key of ['shopOrderUrl', 'facebook', 'instagram', 'youtube'] as const) {
    if (!contact[key]) continue
    let url: URL
    try { url = new URL(contact[key]) } catch { throw new Error(`${key} must be a full https:// link.`) }
    if (url.protocol !== 'https:' || url.username || url.password) throw new Error(`${key} must be a full https:// link without a password.`)
  }
  return { products, contact }
}
export function parseSnapshot(value: unknown): ContentSnapshot {
  if (!isRecord(value) || !Number.isSafeInteger(value.revision) || (value.revision as number) < 0 ||
      !(value.updatedAt === null || typeof value.updatedAt === 'string')) throw new Error('Invalid content response.')
  return { content: parseContent(value.content), revision: value.revision as number, updatedAt: value.updatedAt as string | null }
}
