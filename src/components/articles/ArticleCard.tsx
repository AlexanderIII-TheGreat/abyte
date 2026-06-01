import Link from 'next/link'
import type { Article } from '@/types'
import { formatDate } from '@/lib/utils'
import type { Locale } from '@/i18n/config'

interface ArticleCardProps {
  article: Article
  locale?: Locale
}

export function ArticleCard({ article, locale }: ArticleCardProps) {
  const prefix = locale ? `/${locale}` : ''
  return (
    <article className="group">
      <Link
        href={`${prefix}/articles/${article.slug}`}
        className="block"
        aria-label={`Read article: ${article.title}`}
      >
        {/* Cover Image */}
        <div className="relative aspect-[16/10] bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl overflow-hidden mb-4">
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
                className="w-12 h-12 text-primary-200"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1}
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z"
                />
              </svg>
            </div>
          )}
        </div>

        {/* Content */}
        <div>
          <h3 className="text-lg font-display font-bold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2 mb-2">
            {article.title}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-2 mb-3">
            {article.description}
          </p>
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <time dateTime={article.datePublished}>
              {formatDate(article.datePublished)}
            </time>
            <span aria-hidden="true">&middot;</span>
            <span>{article.readingTime}</span>
          </div>
        </div>
      </Link>
    </article>
  )
}
