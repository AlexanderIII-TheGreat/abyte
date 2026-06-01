'use client'

import { useLocale } from '@/hooks/useLocale'

export function NewsletterForm() {
  const { t } = useLocale()

  return (
    <form
      className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
      onSubmit={(e) => e.preventDefault()}
    >
      <label htmlFor="newsletter-email" className="sr-only">
        {t.newsletter.emailLabel}
      </label>
      <input
        type="email"
        id="newsletter-email"
        placeholder={t.newsletter.placeholder}
        className="flex-1 px-4 py-3.5 rounded-xl border border-white/20 bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
        required
      />
      <button
        type="submit"
        className="px-6 py-3.5 bg-white text-gray-900 font-semibold rounded-xl hover:bg-gray-100 transition-colors text-sm"
      >
        {t.newsletter.subscribe}
      </button>
    </form>
  )
}
