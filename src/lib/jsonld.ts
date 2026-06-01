import type { Article } from '@/types'
import { SITE_CONFIG } from './constants'

export function generateArticleJsonLd(article: Article, locale: string = 'en') {
  const articleUrl = `${SITE_CONFIG.url}/${locale}/articles/${article.slug}`

  return {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: article.title,
    description: article.description,
    image: {
      '@type': 'ImageObject',
      url: article.coverImage,
      width: 1200,
      height: 630,
    },
    datePublished: article.datePublished,
    dateModified: article.dateModified,
    author: {
      '@type': 'Person',
      '@id': `${SITE_CONFIG.url}/#person`,
      name: article.author.name,
      url: article.author.url,
      image: article.author.avatar ? `${SITE_CONFIG.url}${article.author.avatar}` : undefined,
    },
    publisher: {
      '@type': 'Organization',
      '@id': `${SITE_CONFIG.url}/#organization`,
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.url,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_CONFIG.url}/abyte-logo.png`,
        width: 200,
        height: 60,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': articleUrl,
    },
    url: articleUrl,
    wordCount: article.content.split(/\s+/).length,
    articleSection: article.category.name,
    keywords: article.tags.join(', '),
    proficiencyLevel: 'Intermediate',
    inLanguage: locale === 'id' ? 'id-ID' : 'en-US',
    isPartOf: {
      '@type': 'WebSite',
      '@id': `${SITE_CONFIG.url}/#website`,
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.url,
    },
    about: {
      '@type': 'Thing',
      name: article.category.name,
    },
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['h1', 'article .article-content p'],
    },
  }
}

export function generateWebsiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_CONFIG.url}/#website`,
    name: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    url: SITE_CONFIG.url,
    author: {
      '@type': 'Person',
      name: SITE_CONFIG.author.name,
      url: SITE_CONFIG.author.url,
    },
    publisher: {
      '@type': 'Organization',
      '@id': `${SITE_CONFIG.url}/#organization`,
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.url,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_CONFIG.url}/abyte-logo.png`,
      },
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_CONFIG.url}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }
}

export function generatePersonJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${SITE_CONFIG.url}/#person`,
    name: SITE_CONFIG.author.name,
    url: SITE_CONFIG.author.url,
    jobTitle: SITE_CONFIG.author.role,
    description: SITE_CONFIG.author.bio,
    image: `${SITE_CONFIG.url}/author-avatar.png`,
    worksFor: {
      '@type': 'Organization',
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.url,
    },
    knowsAbout: [
      'Web Development',
      'Software Engineering',
      'System Design',
      'DevOps',
      'AI & Machine Learning',
    ],
    sameAs: [
      SITE_CONFIG.links.portfolio,
      SITE_CONFIG.links.github,
      SITE_CONFIG.links.twitter,
    ],
  }
}

export function generateBreadcrumbJsonLd(
  items: Array<{ name: string; url: string }>
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}
