import Link from 'next/link'
import { getAllArticles, getFeaturedArticles, getAllCategories } from '@/lib/articles'
import { FeaturedArticleCard } from '@/components/articles/FeaturedArticleCard'
import { ArticleCard } from '@/components/articles/ArticleCard'
import { NewsletterForm } from '@/components/ui/NewsletterForm'
import { getTranslations } from '@/i18n'
import type { Locale } from '@/i18n/config'

interface HomePageProps {
  params: Promise<{ locale: string }>
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale: localeStr } = await params
  const locale = localeStr as Locale
  const t = getTranslations(locale)

  const [featured, allArticles, categories] = await Promise.all([
    getFeaturedArticles(locale),
    getAllArticles(locale),
    getAllCategories(locale),
  ])
  const latestArticles = allArticles.filter((a) => !a.featured).slice(0, 6)

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-gray-50 to-white">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-100/40 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary-50/60 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/4" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 lg:pt-20 lg:pb-28">
          <div className="lg:grid lg:grid-cols-12 lg:gap-16 items-center">
            {/* Left content */}
            <div className="lg:col-span-7 mb-12 lg:mb-0">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary-50 border border-primary-100 rounded-full text-sm font-medium text-primary-700 mb-6">
                <span className="w-2 h-2 rounded-full bg-primary-500" />
                {t.hero.headingHighlight}
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-[4.25rem] font-display font-bold text-gray-900 tracking-tight mb-6 leading-[1.1]">
                {t.hero.headingPrefix}
              </h1>
              <p className="text-lg lg:text-xl text-gray-500 leading-relaxed mb-10 max-w-xl">
                {t.hero.description}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href={`/${locale}/articles`}
                  className="inline-flex items-center justify-center px-6 py-3.5 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors text-sm"
                >
                  {t.articles.viewAll}
                  <svg className="ml-2 w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </Link>
                <div className="flex flex-wrap gap-2">
                  {categories.slice(0, 3).map((category) => (
                    <Link
                      key={category.slug}
                      href={`/${locale}/categories/${category.slug}`}
                      className="inline-flex items-center px-4 py-3.5 text-sm font-medium bg-white text-gray-700 rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all"
                    >
                      {t.categories.names[category.slug] ?? category.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Right - Featured article preview */}
            {featured.length > 0 && (
              <div className="lg:col-span-5">
                <Link
                  href={`/${locale}/articles/${featured[0].slug}`}
                  className="group block"
                >
                  <div className="relative bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-lg transition-shadow">
                    {/* Image */}
                    <div className="relative aspect-[16/10] bg-gradient-to-br from-primary-50 to-primary-100">
                      {featured[0].coverImage ? (
                        <img
                          src={featured[0].coverImage}
                          alt={featured[0].coverImageAlt || featured[0].title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <svg className="w-16 h-16 text-primary-200" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z" />
                          </svg>
                        </div>
                      )}
                      <div className="absolute top-4 left-4">
                        <span className="inline-flex items-center px-3 py-1 text-xs font-semibold bg-primary-600 text-white rounded-full">
                          Featured
                        </span>
                      </div>
                    </div>
                    {/* Content */}
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="inline-flex items-center px-2.5 py-0.5 text-xs font-medium bg-primary-50 text-primary-700 rounded-full">
                          {featured[0].category.name}
                        </span>
                      </div>
                      <h2 className="text-xl font-display font-bold text-gray-900 group-hover:text-primary-600 transition-colors mb-2 line-clamp-2">
                        {featured[0].title}
                      </h2>
                      <p className="text-sm text-gray-500 line-clamp-2 mb-4">
                        {featured[0].description}
                      </p>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
                          <span className="text-xs font-bold text-white">
                            {featured[0].author.name
                              .split(' ')
                              .map((n) => n[0])
                              .join('')
                              .slice(0, 2)}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{featured[0].author.name}</p>
                          <p className="text-xs text-gray-500">{featured[0].readingTime}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Featured Articles */}
      {featured.length > 1 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-2xl lg:text-3xl font-display font-bold text-gray-900">
                {t.featured.sectionTitle}
              </h2>
              <p className="text-sm text-gray-500 mt-1">Artikel pilihan dari tim kami</p>
            </div>
          </div>
          <div className="space-y-16">
            {featured.slice(1).map((article) => (
              <FeaturedArticleCard key={article.id} article={article} locale={locale} />
            ))}
          </div>
        </section>
      )}

      {/* Latest Articles */}
      <section className="bg-gray-50/50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-2xl lg:text-3xl font-display font-bold text-gray-900">
                {t.articles.latestTitle}
              </h2>
              <p className="text-sm text-gray-500 mt-1">Artikel terbaru dari kami</p>
            </div>
            <Link
              href={`/${locale}/articles`}
              className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors"
            >
              {t.articles.viewAll}
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {latestArticles.map((article) => (
              <ArticleCard key={article.id} article={article} locale={locale} />
            ))}
          </div>
          <div className="mt-12 text-center sm:hidden">
            <Link
              href={`/${locale}/articles`}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors"
            >
              {t.articles.viewAll}
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-900 to-primary-900" />
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary-600/20 rounded-full blur-[100px]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 border border-white/10 rounded-full text-sm font-medium text-primary-300 mb-6">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
              Newsletter
            </div>
            <h2 className="text-3xl lg:text-4xl font-display font-bold text-white mb-4">
              {t.newsletter.title}
            </h2>
            <p className="text-gray-400 mb-10 text-lg">
              {t.newsletter.description}
            </p>
            <NewsletterForm />
          </div>
        </div>
      </section>
    </>
  )
}
