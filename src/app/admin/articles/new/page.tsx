import prisma from '@/lib/db'
import { ArticleForm } from '@/components/admin/ArticleForm'

export default async function NewArticlePage() {
  const [categories, authors] = await Promise.all([
    prisma.category.findMany({
      include: { translations: { where: { languageCode: 'en' } } },
      orderBy: { slug: 'asc' },
    }),
    prisma.author.findMany({
      include: { translations: { where: { languageCode: 'en' } } },
    }),
  ])

  const formattedCategories = categories.map((c) => ({
    id: c.id,
    slug: c.slug,
    name: c.translations[0]?.name ?? c.slug,
  }))

  const formattedAuthors = authors.map((a) => ({
    id: a.id,
    name: a.name,
  }))

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-display font-bold text-gray-900">Artikel Baru</h2>
        <p className="text-sm text-gray-500 mt-1">Buat artikel baru dengan terjemahan EN/ID</p>
      </div>
      <ArticleForm categories={formattedCategories} authors={formattedAuthors} />
    </div>
  )
}
