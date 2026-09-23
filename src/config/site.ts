/**
 * Replace organization-specific values here before launch.
 * Empty strings intentionally hide unconfigured contact, social, payment, and form details.
 */
export const SITE_CONFIG = {
  organizationName: 'Наран Ижий Заяа НҮТББ',
  shortName: 'Наран Ижий Заяа',
  siteUrl: '', // TODO_REPLACE_PRODUCTION_DOMAIN
  email: '', // TODO_REPLACE_EMAIL
  phone: '', // TODO_REPLACE_PHONE
  address: '', // TODO_REPLACE_ADDRESS
  logoPath: '', // Add the official logo when supplied; otherwise display the organization name.
  volunteerFormUrl: '', // TODO_REPLACE_VOLUNTEER_FORM
  donation: {
    qrImage: '', // TODO_REPLACE_DONATION_QR
    bankName: '', // TODO_REPLACE_BANK_INFORMATION
    accountName: '', // TODO_REPLACE_BANK_INFORMATION
    accountNumber: '', // TODO_REPLACE_BANK_INFORMATION
    instructions: '', // TODO_REPLACE_BANK_INFORMATION
  },
  socials: {
    facebook: 'https://www.facebook.com/profile.php?id=100063611737141',
    instagram: '', // TODO_REPLACE_SOCIAL_LINK
    youtube: '', // TODO_REPLACE_SOCIAL_LINK
  },
  privacyUrl: '', // TODO_REPLACE_PRIVACY_URL
} as const

export type SiteConfig = typeof SITE_CONFIG
