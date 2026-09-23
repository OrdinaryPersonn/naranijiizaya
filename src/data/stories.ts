export type Story = {
  id: string
  photo: string
  name: string
  age?: number
  headline: string
  excerpt: string
  fullStory: string
  cancerCategory?: string
  language: 'mn' | 'en' | 'zh' | 'ru'
  published: boolean
  consentConfirmed: boolean
}

/** No fictional patients are included. Add only approved, consented stories. */
export const STORIES: Story[] = [
  {
    id: 'story-placeholder',
    photo: '/images/story-placeholder.svg',
    name: 'TODO_REPLACE_WITH_APPROVED_REAL_STORY',
    headline: 'Энд удахгүй бодит түүх нэмэгдэнэ.',
    excerpt: 'Манай хамт олны гишүүдийн зөвшөөрөгдсөн, бодит туршлагыг энд хүндэтгэлтэйгээр хуваалцана.',
    fullStory: '',
    language: 'mn',
    published: false,
    consentConfirmed: false,
  },
]

export const displayableStories = STORIES.filter((story) => story.published && story.consentConfirmed)
