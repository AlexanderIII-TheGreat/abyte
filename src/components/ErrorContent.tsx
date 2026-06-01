'use client'

import { useLocale } from '@/hooks/useLocale'

export function ErrorContent({ reset }: { reset: () => void }) {
  const { t } = useLocale()

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center">
        <p className="text-6xl font-display font-bold text-primary-600 mb-4">
          500
        </p>
        <h1 className="text-2xl font-display font-bold text-gray-900 mb-2">
          {t.error.title}
        </h1>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          {t.error.description}
        </p>
        <button
          onClick={reset}
          className="inline-flex items-center px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
        >
          {t.error.tryAgain}
        </button>
      </div>
    </div>
  )
}
