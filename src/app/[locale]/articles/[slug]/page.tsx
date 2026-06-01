import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getAllArticles, getArticleBySlug, getRelatedArticles } from '@/lib/articles'
import { generateArticleJsonLd, generateBreadcrumbJsonLd } from '@/lib/jsonld'
import { formatDate } from '@/lib/utils'
import { SITE_CONFIG } from '@/lib/constants'
import { getTranslations } from '@/i18n'
import type { Locale } from '@/i18n/config'
import { ArticleContent } from '@/components/articles/ArticleContent'
import { RelatedArticles } from '@/components/articles/RelatedArticles'

interface ArticlePageProps {
  params: Promise<{ locale: string; slug: string }>
}

export async function generateStaticParams() {
  const articles = await getAllArticles('en')
  return articles.map((article) => ({ slug: article.slug }))
}

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { slug, locale: localeStr } = await params
  const locale = localeStr as Locale
  const article = await getArticleBySlug(locale, slug)
  if (!article) return {}

  return {
    title: article.title,
    description: article.description,
    authors: [{ name: article.author.name, url: article.author.url }],
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      type: 'article',
      title: article.title,
      description: article.description,
      url: `${SITE_CONFIG.url}/${locale}/articles/${article.slug}`,
      siteName: SITE_CONFIG.name,
      publishedTime: article.datePublished,
      modifiedTime: article.dateModified,
      authors: [article.author.name],
      tags: article.tags,
      images: [
        {
          url: article.coverImage,
          width: 1200,
          height: 630,
          alt: article.coverImageAlt,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.description,
      images: [article.coverImage],
    },
    alternates: {
      canonical: `${SITE_CONFIG.url}/${locale}/articles/${article.slug}`,
    },
  }
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug, locale: localeStr } = await params
  const locale = localeStr as Locale
  const t = getTranslations(locale)
  const article = await getArticleBySlug(locale, slug)

  if (!article) {
    notFound()
  }

  const related = await getRelatedArticles(locale, slug, 3)
  const articleJsonLd = generateArticleJsonLd(article, locale)
  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: t.articles.breadcrumbHome, url: `${SITE_CONFIG.url}/${locale}` },
    { name: t.articles.breadcrumbArticles, url: `${SITE_CONFIG.url}/${locale}/articles` },
    {
      name: article.title,
      url: `${SITE_CONFIG.url}/${locale}/articles/${article.slug}`,
    },
  ])

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleJsonLd),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd),
        }}
      />

      {/* Hero Section */}
      <header className="relative bg-gray-900 overflow-hidden">
        {/* Cover Image Background */}
        {article.coverImage ? (
          <div className="absolute inset-0">
            <img
              src={article.coverImage}
              alt=""
              className="w-full h-full object-cover opacity-25 scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-gray-900/60 via-gray-900/75 to-gray-900" />
          </div>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary-900 via-gray-900 to-gray-950" />
        )}

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-20 lg:pt-14 lg:pb-28">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-10">
            <ol className="flex items-center gap-2 text-sm">
              <li>
                <Link href={`/${locale}`} className="text-gray-400 hover:text-white transition-colors">
                  {t.articles.breadcrumbHome}
                </Link>
              </li>
              <li aria-hidden="true">
                <svg className="w-3 h-3 text-gray-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </li>
              <li>
                <Link
                  href={`/${locale}/categories/${article.category.slug}`}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {t.categories.names[article.category.slug] ?? article.category.name}
                </Link>
              </li>
              <li aria-hidden="true">
                <svg className="w-3 h-3 text-gray-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </li>
              <li className="text-gray-300 truncate max-w-[250px]">
                {article.title}
              </li>
            </ol>
          </nav>

          {/* Two-column layout on desktop */}
          <div className="lg:grid lg:grid-cols-12 lg:gap-12 items-end">
            <div className="lg:col-span-7">
              {/* Category */}
              <div className="mb-5">
                <Link
                  href={`/${locale}/categories/${article.category.slug}`}
                  className="inline-flex items-center px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider bg-primary-600 text-white rounded-full hover:bg-primary-500 transition-colors"
                >
                  {t.categories.names[article.category.slug] ?? article.category.name}
                </Link>
              </div>

              {/* Title */}
              <h1 className="text-3xl sm:text-4xl lg:text-[2.75rem] xl:text-5xl font-display font-bold text-white tracking-tight mb-5 leading-[1.15]">
                {article.title}
              </h1>

              {/* Description */}
              <p className="text-base lg:text-lg text-gray-300 leading-relaxed mb-8 max-w-2xl article-description">
                {article.description}
              </p>

              {/* Author & Meta */}
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center ring-2 ring-white/20">
                  <span className="text-sm font-bold text-white">
                    {article.author.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .slice(0, 2)}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">
                    <Link
                      href={`/${locale}/author`}
                      className="hover:text-primary-300 transition-colors"
                    >
                      {article.author.name}
                    </Link>
                  </p>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <time dateTime={article.datePublished}>
                      {formatDate(article.datePublished)}
                    </time>
                    <span aria-hidden="true">&middot;</span>
                    <span>{article.readingTime}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Cover Image - right column on desktop */}
            {article.coverImage && (
              <div className="lg:col-span-5 mt-10 lg:mt-0">
                <div className="relative">
                  <img
                    src={article.coverImage}
                    alt={article.coverImageAlt || article.title}
                    className="w-full rounded-2xl object-cover shadow-2xl ring-1 ring-white/10 aspect-[4/3]"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Article Body */}
      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <ArticleContent content={article.content} />

        {/* Tags */}
        <div className="mt-14 pt-8 border-t border-gray-200">
          <div className="flex flex-wrap gap-2">
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-3.5 py-1.5 text-xs font-medium bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Author Box */}
        <address className="mt-14 p-8 lg:p-10 bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-2xl border border-gray-100 not-italic">
          <div className="flex flex-col sm:flex-row items-start gap-6">
            <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center shrink-0">
              <span className="text-xl lg:text-2xl font-bold text-white">
                {article.author.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .slice(0, 2)}
              </span>
            </div>
            <div className="flex-1">
              <p className="text-xs text-primary-600 uppercase tracking-wider font-semibold mb-1.5">
                {t.articles.craftedBy}
              </p>
              <Link
                href={`/${locale}/author`}
                className="text-xl lg:text-2xl font-display font-bold text-gray-900 mb-2 hover:text-primary-600 transition-colors"
              >
                {article.author.name}
              </Link>
              <p className="text-sm lg:text-base text-gray-600 leading-relaxed mb-5">{article.author.bio}</p>
              <div className="flex items-center gap-4">
                <Link
                  href={`/${locale}/author`}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors"
                >
                  Semua artikel
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </Link>
                <a
                  href={article.author.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-600 hover:text-gray-700 transition-colors"
                >
                  {t.articles.viewPortfolio}
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </address>
      </article>

      {/* Related Articles */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-gray-100">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-2xl lg:text-3xl font-display font-bold text-gray-900">
            {t.articles.relatedTitle}
          </h2>
        </div>
        <RelatedArticles articles={related} locale={locale} />
      </div>
    </>
  )
}
