export type Locale = 'mn' | 'en' | 'zh' | 'ru'
export type Translation = {
  langName: string
  htmlLang: string
  nav: { diagnosis: string; guide: string; stories: string; about: string; join: string; shop: string }
  hero: { eyebrow: string; title: string; body: string; primary: string; secondary: string; note: string }
  diagnosis: { eyebrow: string; title: string; body: string; stepLabel: string; checklistTitle: string; checklistBody: string; checklistButton: string; print: string; checklistItems: string[]; journeyTitles: string[]; journeyBodies: string[] }
  guide: { eyebrow: string; title: string; body: string; disclaimer: string; sourceLabel: string; categories: { title: string; body: string }[] }
  stories: { eyebrow: string; title: string; body: string; placeholder: string; consent: string }
  about: { eyebrow: string; title: string; valuesLabel: string; missionLabel: string; visionLabel: string; historyLabel: string; teamLabel: string }
  join: { eyebrow: string; title: string; body: string; volunteerTitle: string; volunteerBody: string; volunteerButton: string; volunteerSoon: string; donationTitle: string; donationBody: string; donationButton: string; donationSoon: string }
  shop: { eyebrow: string; title: string; body: string; soon: string; placeholder: string; noPrice: string }
  modal: { title: string; close: string; qrAlt: string; missing: string; bank: string; accountName: string; accountNumber: string; instructions: string }
  footer: { support: string; privacy: string; disclaimer: string; rights: string; references: string; sourceIntro: string }
  common: { learnMore: string; comingSoon: string; menu: string; menuClose: string; sunMark: string; externalLink: string }
  seo: { title: string; description: string }
}
