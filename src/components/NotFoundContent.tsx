'use client'

import Link from 'next/link'
import { useLocale } from '@/hooks/useLocale'

export function NotFoundContent() {
  const { t, locale } = useLocale()

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center">
        <p className="text-6xl font-display font-bold text-primary-600 mb-4">
          404
        </p>
        <h1 className="text-2xl font-display font-bold text-gray-900 mb-2">
          {t.notFound.title}
        </h1>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          {t.notFound.description}
        </p>
        <Link
          href={`/${locale}`}
          className="inline-flex items-center px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
        >
          {t.notFound.backToHome}
        </Link>
      </div>
    </div>
  )
}
