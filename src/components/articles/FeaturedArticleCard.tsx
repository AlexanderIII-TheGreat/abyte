import Link from 'next/link'
import type { Article } from '@/types'
import { formatDate } from '@/lib/utils'
import type { Locale } from '@/i18n/config'

interface FeaturedArticleCardProps {
  article: Article
  locale?: Locale
}

export function FeaturedArticleCard({ article, locale }: FeaturedArticleCardProps) {
  const prefix = locale ? `/${locale}` : ''
  return (
    <article className="group relative">
      <Link
        href={`${prefix}/articles/${article.slug}`}
        className="block"
        aria-label={`Read featured article: ${article.title}`}
      >
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8 items-center">
          {/* Cover Image */}
          <div className="relative aspect-[16/10] bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl overflow-hidden order-2 md:order-1">
            {article.coverImage ? (
              <img
                src={article.coverImage}
                alt={article.coverImageAlt || article.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <svg
                  className="w-16 h-16 text-primary-300"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1}
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z"
                />
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
          <div className="order-1 md:order-2">
            <div className="flex items-center gap-2 mb-3">
              <time
                dateTime={article.datePublished}
                className="text-xs text-gray-500"
              >
                {formatDate(article.datePublished)}
              </time>
            </div>
            <h2 className="text-2xl lg:text-3xl font-display font-bold text-gray-900 group-hover:text-primary-600 transition-colors mb-3">
              {article.title}
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4 line-clamp-3">
              {article.description}
            </p>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
                <span className="text-xs font-bold text-white">
                  {article.author.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .slice(0, 2)}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {article.author.name}
                </p>
                <p className="text-xs text-gray-500">{article.readingTime}</p>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </article>
  )
}
