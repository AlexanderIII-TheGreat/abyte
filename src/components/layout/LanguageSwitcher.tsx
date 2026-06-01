'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { locales, localeNames } from '@/i18n'
import type { Locale } from '@/i18n/config'

interface LanguageSwitcherProps {
  locale: Locale
}

export function LanguageSwitcher({ locale }: LanguageSwitcherProps) {
  const pathname = usePathname()

  const basePathname = pathname?.replace(/^\/(en|id)/, '') || '/'

  return (
    <div className="flex items-center gap-1" role="group" aria-label="Language selection">
      {locales.map((l) => {
        const isActive = l === locale
        return (
          <Link
            key={l}
            href={`/${l}${basePathname}`}
            className={`px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors ${
              isActive
                ? 'bg-primary-100 text-primary-700'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
            }`}
            aria-current={isActive ? 'true' : undefined}
            hrefLang={l}
          >
            {l.toUpperCase()}
          </Link>
        )
      })}
    </div>
  )
}
