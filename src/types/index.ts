export interface Author {
  name: string
  role: string
  avatar: string
  bio: string
  url: string
}

export interface Category {
  name: string
  slug: string
  description: string
}

export interface Article {
  id: string
  slug: string
  title: string
  description: string
  content: string
  coverImage: string
  coverImageAlt: string
  datePublished: string
  dateModified: string
  readingTime: string
  category: Category
  tags: string[]
  author: Author
  featured: boolean
}

export interface SiteConfig {
  name: string
  description: string
  url: string
  ogImage: string
  author: Author
  links: {
    twitter: string
    github: string
    portfolio: string
  }
}
