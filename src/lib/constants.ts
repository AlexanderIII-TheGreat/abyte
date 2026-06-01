import type { SiteConfig, Author } from '@/types'

export const AUTHOR: Author = {
  name: 'Abiyyu Abidiffatir Al Majid',
  role: 'Founder abyte',
  avatar: '/images/author-avatar.jpg',
  bio: 'Founder of abyte — tech blog yang didedikasikan untuk berbagi pengetahuan tentang web development, software engineering, dan teknologi modern. Dengan pengalaman di industri software, saya menulis artikel mendalam yang membantu engineer membangun software yang lebih baik.',
  url: 'https://a2mdev.site',
}

export const SITE_CONFIG: SiteConfig = {
  name: 'abyte',
  description:
    'abyte — A modern tech blog delivering in-depth articles on web development, software engineering, system design, and emerging technologies. Crafted by Abiyyu Abidiffatir Al Majid.',
  url: 'https://abyte.id',
  ogImage: '/og.png',
  author: AUTHOR,
  links: {
    twitter: 'https://twitter.com/abyte',
    github: 'https://github.com/abyte',
    portfolio: 'https://a2mdev.site',
  },
}

