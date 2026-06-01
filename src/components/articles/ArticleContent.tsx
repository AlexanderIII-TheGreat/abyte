import { markdownToHtml } from '@/lib/markdown'

interface ArticleContentProps {
  content: string
}

export function ArticleContent({ content }: ArticleContentProps) {
  const html = markdownToHtml(content)

  return (
    <div
      className="prose-article"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
