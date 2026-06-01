import Link from 'next/link'
import prisma from '@/lib/db'
import { DeleteArticleButton } from '@/components/admin/DeleteArticleButton'
import { ArticleListPreviewButton } from '@/components/admin/ArticleListPreviewButton'

export default async function AdminArticlesPage() {
  const articles = await prisma.article.findMany({
    orderBy: { datePublished: 'desc' },
    include: {
      translations: { where: { languageCode: 'en' } },
      category: { include: { translations: { where: { languageCode: 'en' } } } },
      author: { include: { translations: { where: { languageCode: 'en' } } } },
    },
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl md:text-2xl font-display font-bold text-gray-900">Artikel</h2>
          <p className="text-sm text-gray-500 mt-1">{articles.length} artikel ditemukan</p>
        </div>
        <Link
          href="/admin/articles/new"
          className="px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors text-sm flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          <span className="hidden sm:inline">Artikel Baru</span>
          <span className="sm:hidden">Baru</span>
        </Link>
      </div>

      {articles.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 px-5 py-16 text-center">
          <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-1">Belum ada artikel</h3>
          <p className="text-sm text-gray-500 mb-4">Buat artikel pertama untuk memulai</p>
          <Link
            href="/admin/articles/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors text-sm"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Buat Artikel
          </Link>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Judul</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                  <th className="text-right px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {articles.map((article) => {
                  const en = article.translations[0]
                  const catName = article.category.translations[0]?.name ?? article.category.slug
                  return (
                    <tr key={article.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-3.5">
                        <p className="text-sm font-medium text-gray-900 truncate max-w-xs">
                          {en?.title ?? article.slug}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">/{article.slug}</p>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="inline-flex px-2 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-700">
                          {catName}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        {article.featured ? (
                          <span className="inline-flex px-2 py-0.5 rounded-md text-xs font-medium bg-primary-50 text-primary-700">
                            Featured
                          </span>
                        ) : (
                          <span className="inline-flex px-2 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-600">
                            Normal
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-sm text-gray-500">
                        {new Date(article.datePublished).toLocaleDateString('id-ID')}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <ArticleListPreviewButton article={article} />
                          <Link
                            href={`/admin/articles/${article.id}`}
                            className="px-3 py-1.5 text-xs font-medium text-primary-600 hover:bg-primary-50 rounded-md transition-colors"
                          >
                            Edit
                          </Link>
                          <DeleteArticleButton articleId={article.id} />
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-3">
            {articles.map((article) => {
              const en = article.translations[0]
              const catName = article.category.translations[0]?.name ?? article.category.slug
              return (
                <div key={article.id} className="bg-white rounded-xl border border-gray-200 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {en?.title ?? article.slug}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">/{article.slug}</p>
                    </div>
                    {article.featured && (
                      <span className="flex-shrink-0 inline-flex px-2 py-0.5 rounded-md text-xs font-medium bg-primary-50 text-primary-700">
                        Featured
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-3">
                    <span className="inline-flex px-2 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-700">
                      {catName}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(article.datePublished).toLocaleDateString('id-ID')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
                    <ArticleListPreviewButton article={article} />
                    <Link
                      href={`/admin/articles/${article.id}`}
                      className="flex-1 text-center px-3 py-1.5 text-xs font-medium text-primary-600 hover:bg-primary-50 rounded-md transition-colors"
                    >
                      Edit
                    </Link>
                    <DeleteArticleButton articleId={article.id} />
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
