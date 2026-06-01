import type { MetadataRoute } from 'next'
import { getAllArticles, getAllCategories } from '@/lib/articles'
import { SITE_CONFIG } from '@/lib/constants'
import { locales } from '@/i18n/config'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const urls: MetadataRoute.Sitemap = []

  for (const locale of locales) {
    const [articles, categories] = await Promise.all([
      getAllArticles(locale),
      getAllCategories(locale),
    ])

    // Home page
    urls.push({
      url: `${SITE_CONFIG.url}/${locale}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    })

    // Articles list
    urls.push({
      url: `${SITE_CONFIG.url}/${locale}/articles`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    })

    // About page
    urls.push({
      url: `${SITE_CONFIG.url}/${locale}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    })

    // Author page
    urls.push({
      url: `${SITE_CONFIG.url}/${locale}/author`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    })

    // Category pages
    for (const category of categories) {
      urls.push({
        url: `${SITE_CONFIG.url}/${locale}/categories/${category.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.6,
      })
    }

    // Article pages
    for (const article of articles) {
      urls.push({
        url: `${SITE_CONFIG.url}/${locale}/articles/${article.slug}`,
        lastModified: new Date(article.dateModified),
        changeFrequency: 'weekly',
        priority: 0.8,
      })
    }
  }

  return urls
}
