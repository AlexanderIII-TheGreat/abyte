import { notFound } from 'next/navigation'
import prisma from '@/lib/db'
import { ArticleForm } from '@/components/admin/ArticleForm'

export default async function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const [article, categories, authors] = await Promise.all([
    prisma.article.findUnique({
      where: { id },
      include: {
        translations: true,
        tags: { include: { tag: { include: { translations: { where: { languageCode: 'en' } } } } } },
      },
    }),
    prisma.category.findMany({
      include: { translations: { where: { languageCode: 'en' } } },
      orderBy: { slug: 'asc' },
    }),
    prisma.author.findMany({
      include: { translations: { where: { languageCode: 'en' } } },
    }),
  ])

  if (!article) notFound()

  const formattedCategories = categories.map((c: { id: string; slug: string; translations: { name: string }[] }) => ({
    id: c.id,
    slug: c.slug,
    name: c.translations[0]?.name ?? c.slug,
  }))

  const formattedAuthors = authors.map((a: { id: string; name: string }) => ({
    id: a.id,
    name: a.name,
  }))

  const articleData = {
    id: article.id,
    slug: article.slug,
    coverImage: article.coverImage,
    featured: article.featured,
    datePublished: article.datePublished.toISOString(),
    categoryId: article.categoryId,
    authorId: article.authorId,
    translations: article.translations.map((t) => ({
      languageCode: t.languageCode,
      title: t.title,
      description: t.description,
      content: t.content,
      coverImageAlt: t.coverImageAlt,
      readingTime: t.readingTime,
    })),
    tags: article.tags.map((at) => at.tag.translations[0]?.name ?? at.tag.slug),
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-display font-bold text-gray-900">Edit Artikel</h2>
        <p className="text-sm text-gray-500 mt-1">/{article.slug}</p>
      </div>
      <ArticleForm
        initialData={articleData}
        categories={formattedCategories}
        authors={formattedAuthors}
      />
    </div>
  )
}
