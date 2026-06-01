import prisma from '@/lib/db'
import Link from 'next/link'

export default async function AdminDashboard() {
  const [articleCount, categoryCount, tagCount] = await Promise.all([
    prisma.article.count(),
    prisma.category.count(),
    prisma.tag.count(),
  ])

  const recentArticles = await prisma.article.findMany({
    take: 5,
    orderBy: { datePublished: 'desc' },
    include: {
      translations: { where: { languageCode: 'en' } },
      category: { include: { translations: { where: { languageCode: 'en' } } } },
    },
  })

  const stats = [
    {
      label: 'Artikel',
      value: articleCount,
      href: '/admin/articles',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
      ),
      gradient: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
    },
    {
      label: 'Kategori',
      value: categoryCount,
      href: '/admin/categories',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
        </svg>
      ),
      gradient: 'from-emerald-500 to-emerald-600',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-600',
    },
    {
      label: 'Tags',
      value: tagCount,
      href: '#',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
        </svg>
      ),
      gradient: 'from-amber-500 to-amber-600',
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-600',
    },
  ]

  return (
    <div>
      <div className="mb-6 md:mb-8">
        <h2 className="text-xl md:text-2xl font-display font-bold text-gray-900">Dashboard</h2>
        <p className="text-sm text-gray-500 mt-1">Selamat datang di abyte panel</p>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3 mb-6 md:mb-8">
        <Link
          href="/admin/articles/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors text-sm"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Artikel Baru
        </Link>
        <Link
          href="/admin/categories"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-gray-700 font-medium rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-sm"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Kategori Baru
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 md:mb-8">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="group bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md hover:border-gray-300 transition-all duration-200"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.gradient} flex items-center justify-center text-white shadow-sm`}>
                {stat.icon}
              </div>
              <span className={`text-xs font-medium ${stat.textColor} ${stat.bgColor} px-2.5 py-1 rounded-md`}>
                {stat.label}
              </span>
            </div>
            <p className="text-3xl font-bold text-gray-900 group-hover:text-gray-700 transition-colors">{stat.value}</p>
          </Link>
        ))}
      </div>

      {/* Recent Articles */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-medium text-gray-900">Artikel Terbaru</h3>
          <Link
            href="/admin/articles"
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            Lihat semua
          </Link>
        </div>
        {recentArticles.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
            <p className="text-sm text-gray-500">Belum ada artikel</p>
            <Link href="/admin/articles/new" className="text-sm text-primary-600 hover:text-primary-700 font-medium mt-1 inline-block">
              Buat artikel pertama
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {recentArticles.map((article) => {
              const en = article.translations[0]
              const catName = article.category.translations[0]?.name ?? article.category.slug
              return (
                <Link
                  key={article.id}
                  href={`/admin/articles/${article.id}`}
                  className="flex items-center justify-between px-5 py-3.5 hover:bg-gray-50 transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 truncate">{en?.title ?? article.slug}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{catName}</p>
                  </div>
                  <span className="text-xs text-gray-400 ml-4 flex-shrink-0">
                    {new Date(article.datePublished).toLocaleDateString('id-ID')}
                  </span>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
