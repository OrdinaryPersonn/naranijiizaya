export type MedicalReference = {
  id: string
  title: string
  organization: string
  url: string
  lastReviewed: string
  reviewNeeded: boolean
  scope: 'general' | 'mongolia'
}

/** Review this list with a qualified reviewer before public launch. */
export const MEDICAL_REFERENCES: MedicalReference[] = [
  { id: 'nci-questions', title: 'Questions to Ask Your Doctor about Cancer', organization: 'National Cancer Institute', url: 'https://www.cancer.gov/about-cancer/coping/questions', lastReviewed: '2026-09-10', reviewNeeded: true, scope: 'general' },
  { id: 'acs-questions', title: 'Questions to Ask When You’ve Been Diagnosed With Cancer', organization: 'American Cancer Society', url: 'https://www.cancer.org/content/dam/cancer-org/cancer-control/en/worksheets/questions-to-ask-about-my-cancer.pdf', lastReviewed: '2026-09-10', reviewNeeded: true, scope: 'general' },
  { id: 'macmillan-questions', title: 'Questions to ask your healthcare team', organization: 'Macmillan Cancer Support', url: 'https://www.macmillan.org.uk/cancer-information-and-support/treatment/your-treatment-options/questions-to-ask-your-healthcare-team', lastReviewed: '2026-09-10', reviewNeeded: true, scope: 'general' },
  { id: 'cruk', title: 'Cancer diagnosis and support information', organization: 'Cancer Research UK', url: 'https://www.cancerresearchuk.org/about-cancer', lastReviewed: '2026-09-10', reviewNeeded: true, scope: 'general' },
  { id: 'canadian-cancer-society', title: 'Cancer support resources', organization: 'Canadian Cancer Society', url: 'https://cancer.ca/en/living-with-cancer', lastReviewed: '2026-09-10', reviewNeeded: true, scope: 'general' },
  { id: 'cancer-council', title: 'Questions to ask your doctor', organization: 'Cancer Council Australia', url: 'https://www.cancer.org.au/cancer-information/finding-and-preparing-for-cancer-appointments/questions-to-ask-your-doctor', lastReviewed: '2026-09-10', reviewNeeded: true, scope: 'general' },
  { id: 'who-cancer', title: 'Cancer fact sheet', organization: 'World Health Organization', url: 'https://www.who.int/news-room/fact-sheets/detail/cancer', lastReviewed: '2026-09-10', reviewNeeded: true, scope: 'general' },
  { id: 'mongolian-ncc', title: 'Хавдар судлалын үндэсний төвийн албан ёсны мэдээлэл', organization: 'Хавдар Судлалын Үндэсний Төв', url: 'https://www.cancer-center.gov.mn/', lastReviewed: '2026-09-10', reviewNeeded: true, scope: 'mongolia' },
]
