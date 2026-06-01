import type { Metadata } from 'next'
import { getAllArticles } from '@/lib/articles'
import { SITE_CONFIG } from '@/lib/constants'
import { getTranslations } from '@/i18n'
import type { Locale } from '@/i18n/config'
import { ArticleCard } from '@/components/articles/ArticleCard'

interface ArticlesPageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({
  params,
}: ArticlesPageProps): Promise<Metadata> {
  const { locale: localeStr } = await params
  const locale = localeStr as Locale
  const t = getTranslations(locale)

  return {
    title: t.meta.articlesTitle,
    description: t.meta.articlesDescription,
    openGraph: {
      title: `${t.meta.articlesTitle} | ${SITE_CONFIG.name}`,
      description: t.meta.articlesDescription,
      url: `${SITE_CONFIG.url}/${locale}/articles`,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${t.meta.articlesTitle} | ${SITE_CONFIG.name}`,
      description: t.meta.articlesDescription,
    },
    alternates: {
      canonical: `${SITE_CONFIG.url}/${locale}/articles`,
    },
  }
}

export default async function ArticlesPage({ params }: ArticlesPageProps) {
  const { locale: localeStr } = await params
  const locale = localeStr as Locale
  const t = getTranslations(locale)
  const articles = await getAllArticles(locale)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      <header className="mb-12">
        <h1 className="text-3xl sm:text-4xl font-display font-bold text-gray-900 tracking-tight mb-4">
          {t.articles.allTitle}
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl">
          {t.articles.allDescription}
        </p>
      </header>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} locale={locale} />
        ))}
      </div>
    </div>
  )
}
