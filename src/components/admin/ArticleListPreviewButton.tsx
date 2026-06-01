'use client'

import { useState } from 'react'
import { ArticleContent } from '@/components/articles/ArticleContent'
import { formatDate } from '@/lib/utils'

interface ArticleListPreviewButtonProps {
  article: {
    id: string
    slug: string
    coverImage: string
    featured: boolean
    datePublished: string | Date
    translations: Array<{
      languageCode: string
      title: string
      description: string
      content: string
      readingTime: string
    }>
    category: {
      translations: Array<{ name: string }>
      slug: string
    }
    author: {
      name: string
      translations: Array<Record<string, unknown>>
    }
  }
}

export function ArticleListPreviewButton({ article }: ArticleListPreviewButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'en' | 'id'>('en')

  const translation = article.translations.find(t => t.languageCode === activeTab) || article.translations[0]
  const categoryName = article.category.translations[0]?.name ?? article.category.slug
  const authorName = article.author.name
  const tags: string[] = []

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
        title="Preview"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        </svg>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/60" onClick={() => setIsOpen(false)} />
          <div className="relative ml-auto w-full max-w-4xl bg-white h-full overflow-y-auto shadow-2xl">
            {/* Preview Header */}
            <div className="sticky top-0 z-20 bg-white border-b border-gray-200 px-6 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h2 className="text-sm font-semibold text-gray-900">Preview</h2>
                  <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-0.5">
                    <button
                      onClick={() => setActiveTab('en')}
                      className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                        activeTab === 'en' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      EN
                    </button>
                    <button
                      onClick={() => setActiveTab('id')}
                      className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                        activeTab === 'id' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      ID
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* ===== Hero Section (matches article page) ===== */}
            <header className="relative bg-gray-900 overflow-hidden">
              {article.coverImage ? (
                <div className="absolute inset-0">
                  <img src={article.coverImage} alt="" className="w-full h-full object-cover opacity-25 scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-b from-gray-900/60 via-gray-900/75 to-gray-900" />
                </div>
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-primary-900 via-gray-900 to-gray-950" />
              )}

              <div className="relative px-6 sm:px-8 pt-8 pb-16">
                {/* Category */}
                <div className="mb-5">
                  <span className="inline-flex items-center px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider bg-primary-600 text-white rounded-full">
                    {categoryName}
                  </span>
                </div>

                {/* Title */}
                <h1 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight mb-4 leading-[1.15]">
                  {translation?.title || article.slug}
                </h1>

                {/* Description */}
                {translation?.description && (
                  <p className="text-base text-gray-300 leading-relaxed mb-8 max-w-2xl">
                    {translation.description}
                  </p>
                )}

                {/* Author & Meta */}
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center ring-2 ring-white/20">
                    <span className="text-sm font-bold text-white">
                      {authorName.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{authorName}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <time>{formatDate(String(article.datePublished))}</time>
                      <span aria-hidden="true">&middot;</span>
                      <span>{translation?.readingTime || '5 min'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </header>

            {/* Cover Image (if exists) */}
            {article.coverImage && (
              <div className="px-6 sm:px-8 -mt-8 relative z-10 mb-12">
                <img
                  src={article.coverImage}
                  alt={translation?.title || article.slug}
                  className="w-full rounded-2xl object-cover shadow-2xl ring-1 ring-gray-900/5 aspect-[16/9]"
                />
              </div>
            )}

            {/* ===== Article Body ===== */}
            <article className="px-6 sm:px-8 pb-16">
              {translation?.content ? (
                <ArticleContent content={translation.content} />
              ) : (
                <p className="text-gray-400 italic py-10">Belum ada konten</p>
              )}

              {/* Tags */}
              {tags.length > 0 && (
                <div className="mt-14 pt-8 border-t border-gray-200">
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-3.5 py-1.5 text-xs font-medium bg-gray-100 text-gray-700 rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Author Box */}
              <div className="mt-14 p-6 bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-2xl border border-gray-100">
                <div className="flex items-start gap-5">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center shrink-0">
                    <span className="text-lg font-bold text-white">
                      {authorName.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-primary-600 uppercase tracking-wider font-semibold mb-1">
                      Ditulis oleh
                    </p>
                    <p className="text-lg font-display font-bold text-gray-900 mb-2">
                      {authorName}
                    </p>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </div>
      )}
    </>
  )
}
