import type { Metadata } from 'next'
import Link from 'next/link'
import { SITE_CONFIG, AUTHOR } from '@/lib/constants'
import { generatePersonJsonLd } from '@/lib/jsonld'
import { getTranslations } from '@/i18n'
import type { Locale } from '@/i18n/config'
import { getAllArticles } from '@/lib/articles'
import { ArticleCard } from '@/components/articles/ArticleCard'

interface AuthorPageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: AuthorPageProps): Promise<Metadata> {
  const { locale } = await params
  const t = getTranslations(locale as Locale)
  const authorUrl = `${SITE_CONFIG.url}/${locale}/author`

  return {
    title: `${AUTHOR.name} — ${AUTHOR.role}`,
    description: AUTHOR.bio,
    authors: [{ name: AUTHOR.name, url: AUTHOR.url }],
    robots: { index: true, follow: true },
    openGraph: {
      type: 'profile',
      title: `${AUTHOR.name} — ${AUTHOR.role}`,
      description: AUTHOR.bio,
      url: authorUrl,
      siteName: SITE_CONFIG.name,
      firstName: AUTHOR.name.split(' ')[0],
      lastName: AUTHOR.name.split(' ').slice(1).join(' '),
      username: 'abyte',
      gender: 'male',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${AUTHOR.name} — ${AUTHOR.role}`,
      description: AUTHOR.bio,
    },
    alternates: {
      canonical: authorUrl,
    },
  }
}

export default async function AuthorPage({ params }: AuthorPageProps) {
  const { locale: localeStr } = await params
  const locale = localeStr as Locale
  const t = getTranslations(locale)
  const articles = await getAllArticles(locale)

  const personJsonLd = generatePersonJsonLd()

  // Stats
  const totalArticles = articles.length
  const categories = [...new Set(articles.map(a => a.category.name))]
  const totalWords = articles.reduce((sum, a) => sum + a.content.split(/\s+/).length, 0)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        {/* Author Hero */}
        <div className="text-center mb-16">
          <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center mx-auto mb-6 ring-4 ring-white shadow-lg">
            <span className="text-3xl lg:text-4xl font-bold text-white">
              {AUTHOR.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
            </span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-display font-bold text-gray-900 mb-3">
            {AUTHOR.name}
          </h1>
          <p className="text-lg text-primary-600 font-medium mb-4">{AUTHOR.role}</p>
          <p className="text-gray-600 leading-relaxed max-w-2xl mx-auto mb-6">
            {AUTHOR.bio}
          </p>
          <div className="flex items-center justify-center gap-4">
            <a
              href={AUTHOR.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-sm transition-all"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
              </svg>
              Portfolio
            </a>
            <a
              href={SITE_CONFIG.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-sm transition-all"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              GitHub
            </a>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-16">
          <div className="text-center p-4 bg-white rounded-xl border border-gray-200">
            <p className="text-2xl font-bold text-gray-900">{totalArticles}</p>
            <p className="text-xs text-gray-500 mt-1">Artikel</p>
          </div>
          <div className="text-center p-4 bg-white rounded-xl border border-gray-200">
            <p className="text-2xl font-bold text-gray-900">{categories.length}</p>
            <p className="text-xs text-gray-500 mt-1">Kategori</p>
          </div>
          <div className="text-center p-4 bg-white rounded-xl border border-gray-200">
            <p className="text-2xl font-bold text-gray-900">{Math.round(totalWords / 1000)}k</p>
            <p className="text-xs text-gray-500 mt-1">Kata</p>
          </div>
        </div>

        {/* Author Articles */}
        <div>
          <h2 className="text-2xl font-display font-bold text-gray-900 mb-8">
            Artikel oleh {AUTHOR.name}
          </h2>
          <div className="grid sm:grid-cols-2 gap-8">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} locale={locale} />
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
