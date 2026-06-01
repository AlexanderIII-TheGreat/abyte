import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { SITE_CONFIG } from '@/lib/constants'
import { getArticlesByCategory, getAllCategories } from '@/lib/articles'
import { getTranslations } from '@/i18n'
import type { Locale } from '@/i18n/config'
import { ArticleCard } from '@/components/articles/ArticleCard'

interface CategoryPageProps {
  params: Promise<{ locale: string; slug: string }>
}

export async function generateStaticParams() {
  const categories = await getAllCategories('en')
  return categories.map((category) => ({ slug: category.slug }))
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug, locale: localeStr } = await params
  const locale = localeStr as Locale
  const t = getTranslations(locale)
  const categories = await getAllCategories(locale)
  const category = categories.find((c) => c.slug === slug)
  if (!category) return {}

  const categoryName = category.name
  const categoryDescription = category.description

  return {
    title: categoryName,
    description: categoryDescription,
    openGraph: {
      title: `${categoryName} | ${SITE_CONFIG.name}`,
      description: categoryDescription,
      url: `${SITE_CONFIG.url}/${locale}/categories/${slug}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${categoryName} | ${SITE_CONFIG.name}`,
      description: categoryDescription,
    },
    alternates: {
      canonical: `${SITE_CONFIG.url}/${locale}/categories/${slug}`,
    },
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug, locale: localeStr } = await params
  const locale = localeStr as Locale
  const t = getTranslations(locale)
  const categories = await getAllCategories(locale)
  const category = categories.find((c) => c.slug === slug)

  if (!category) {
    notFound()
  }

  const categoryName = category.name
  const categoryDescription = category.description
  const articles = await getArticlesByCategory(locale, slug)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      <header className="mb-12">
        <h1 className="text-3xl sm:text-4xl font-display font-bold text-gray-900 tracking-tight mb-4">
          {categoryName}
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl">{categoryDescription}</p>
      </header>

      {articles.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} locale={locale} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-gray-500">
            {t.categories.emptyState}
          </p>
        </div>
      )}
    </div>
  )
}
