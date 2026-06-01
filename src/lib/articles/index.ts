import prisma from '../db'
import type { Article, Category } from '@/types'

// Helper function to dynamically construct translations filter based on locale
const articleIncludes = (locale: string) => ({
  translations: {
    where: { languageCode: locale },
  },
  category: {
    include: {
      translations: {
        where: { languageCode: locale },
      },
    },
  },
  author: {
    include: {
      translations: {
        where: { languageCode: locale },
      },
    },
  },
  tags: {
    include: {
      tag: {
        include: {
          translations: {
            where: { languageCode: locale },
          },
        },
      },
    },
  },
})

// Auto-calculate reading time from word count (~200 words/min)
function calculateReadingTime(content: string, locale: string): string {
  const words = content.trim().split(/\s+/).filter(w => w.length > 0).length
  const minutes = Math.max(1, Math.ceil(words / 200))
  return locale === 'id' ? `${minutes} menit baca` : `${minutes} min read`
}

// Helper to map DB models to Article interface
function mapToArticle(item: any, locale: string): Article {
  const translation = item.translations[0] ?? {
    title: '',
    description: '',
    content: '',
    coverImageAlt: '',
    readingTime: '',
  }

  const categoryTranslation = item.category.translations[0] ?? {
    name: item.category.slug,
    description: '',
  }

  const authorTranslation = item.author.translations[0] ?? {
    role: '',
    bio: '',
  }

  return {
    id: item.id,
    slug: item.slug,
    title: translation.title,
    description: translation.description,
    content: translation.content,
    coverImage: item.coverImage,
    coverImageAlt: translation.coverImageAlt,
    datePublished: item.datePublished.toISOString().split('T')[0],
    dateModified: item.dateModified.toISOString().split('T')[0],
    readingTime: calculateReadingTime(translation.content, locale),
    featured: item.featured,
    category: {
      slug: item.category.slug,
      name: categoryTranslation.name,
      description: categoryTranslation.description,
    },
    author: {
      name: item.author.name,
      role: authorTranslation.role,
      avatar: item.author.avatar,
      bio: authorTranslation.bio,
      url: item.author.url,
    },
    tags: item.tags.map((t: any) => t.tag.translations[0]?.name ?? t.tag.slug),
  }
}

export async function getAllCategories(locale: string): Promise<Category[]> {
  const categories = await prisma.category.findMany({
    include: {
      translations: {
        where: { languageCode: locale },
      },
    },
    orderBy: { slug: 'asc' },
  })
  return categories.map((c) => ({
    slug: c.slug,
    name: c.translations[0]?.name ?? c.slug,
    description: c.translations[0]?.description ?? '',
  }))
}

export async function getAllArticles(locale: string): Promise<Article[]> {
  const articles = await prisma.article.findMany({
    include: articleIncludes(locale),
    orderBy: {
      datePublished: 'desc',
    },
  })
  return articles.map((a) => mapToArticle(a, locale))
}

export async function getFeaturedArticles(locale: string): Promise<Article[]> {
  const articles = await prisma.article.findMany({
    where: {
      featured: true,
    },
    include: articleIncludes(locale),
    orderBy: {
      datePublished: 'desc',
    },
  })
  return articles.map((a) => mapToArticle(a, locale))
}

export async function getArticleBySlug(locale: string, slug: string): Promise<Article | undefined> {
  const article = await prisma.article.findUnique({
    where: {
      slug,
    },
    include: articleIncludes(locale),
  })
  if (!article) return undefined
  return mapToArticle(article, locale)
}

export async function getArticlesByCategory(locale: string, categorySlug: string): Promise<Article[]> {
  const articles = await prisma.article.findMany({
    where: {
      category: {
        slug: categorySlug,
      },
    },
    include: articleIncludes(locale),
    orderBy: {
      datePublished: 'desc',
    },
  })
  return articles.map((a) => mapToArticle(a, locale))
}

export async function getRelatedArticles(
  locale: string,
  currentSlug: string,
  limit = 3
): Promise<Article[]> {
  const current = await prisma.article.findUnique({
    where: { slug: currentSlug },
    include: {
      category: true,
      tags: {
        include: { tag: true },
      },
    },
  })
  if (!current) return []

  const currentCategorySlug = current.category.slug
  const currentTagSlugs = current.tags.map((t) => t.tag.slug)

  const candidates = await prisma.article.findMany({
    where: {
      slug: { not: currentSlug },
    },
    include: articleIncludes(locale),
  })

  return candidates
    .map((a) => {
      const mapped = mapToArticle(a, locale)
      const isSameCategory = a.category.slug === currentCategorySlug
      const matchingTagsCount = a.tags.filter((t) => currentTagSlugs.includes(t.tag.slug)).length
      const score = (isSameCategory ? 2 : 0) + matchingTagsCount
      return { mapped, score }
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.mapped)
}
