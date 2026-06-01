import type { Article } from '@/types'
import { ArticleCard } from './ArticleCard'
import type { Locale } from '@/i18n/config'

interface RelatedArticlesProps {
  articles: Article[]
  locale?: Locale
}

export function RelatedArticles({ articles, locale }: RelatedArticlesProps) {
  if (articles.length === 0) return null

  return (
    <section aria-label="Related articles">
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} locale={locale} />
        ))}
      </div>
    </section>
  )
}
