import talksData from '@/content/talks/talks.json'

export type Talk = {
  id: number
  title: string
  venue: string
  date: string
  description?: string
  videoUrl?: string
  slidesUrl?: string
  thumbnailUrl?: string
  duration?: string
}

export const talks: Talk[] = talksData.talks