'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { SITE_CONFIG } from '@/lib/constants'
import { getTranslations } from '@/i18n'
import { LanguageSwitcher } from './LanguageSwitcher'
import type { Locale } from '@/i18n/config'
import type { Category } from '@/types'

interface HeaderProps {
  locale: Locale
  categories: Category[]
}

export function Header({ locale, categories }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const t = getTranslations(locale)

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
      <nav
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        aria-label={t.nav.mainNavLabel}
      >
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href={`/${locale}`}
            className="flex items-center gap-2.5 shrink-0"
            aria-label={`${SITE_CONFIG.name} homepage`}
          >
            <Image
              src="/abyte-logo.png"
              alt={`${SITE_CONFIG.name} logo`}
              width={36}
              height={36}
              className="rounded-lg"
              priority
            />
            <span className="text-xl font-display font-bold text-gray-900 tracking-tight">
              {SITE_CONFIG.name}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            <Link
              href={`/${locale}`}
              className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 rounded-lg hover:bg-primary-50 transition-colors"
            >
              {t.nav.home}
            </Link>
            {categories.slice(0, 4).map((category) => (
              <Link
                key={category.slug}
                href={`/${locale}/categories/${category.slug}`}
                className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 rounded-lg hover:bg-primary-50 transition-colors"
              >
                {t.categories.names[category.slug] ?? category.name}
              </Link>
            ))}
            <Link
              href={`/${locale}/about`}
              className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 rounded-lg hover:bg-primary-50 transition-colors"
            >
              {t.nav.about}
            </Link>
            <Link
              href={`/${locale}/author`}
              className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 rounded-lg hover:bg-primary-50 transition-colors"
            >
              {t.nav.author}
            </Link>
            <div className="ml-2 pl-2 border-l border-gray-200">
              <LanguageSwitcher locale={locale} />
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? t.nav.closeMenu : t.nav.openMenu}
          >
            {mobileMenuOpen ? (
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <div className="flex flex-col gap-1">
              <Link
                href={`/${locale}`}
                className="px-3 py-2.5 text-sm font-medium text-gray-700 hover:text-primary-600 rounded-lg hover:bg-primary-50 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t.nav.home}
              </Link>
              {categories.map((category) => (
                <Link
                  key={category.slug}
                  href={`/${locale}/categories/${category.slug}`}
                  className="px-3 py-2.5 text-sm font-medium text-gray-700 hover:text-primary-600 rounded-lg hover:bg-primary-50 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t.categories.names[category.slug] ?? category.name}
                </Link>
              ))}
              <Link
                href={`/${locale}/about`}
                className="px-3 py-2.5 text-sm font-medium text-gray-700 hover:text-primary-600 rounded-lg hover:bg-primary-50 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t.nav.about}
              </Link>
              <Link
                href={`/${locale}/author`}
                className="px-3 py-2.5 text-sm font-medium text-gray-700 hover:text-primary-600 rounded-lg hover:bg-primary-50 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t.nav.author}
              </Link>
              <div className="px-3 py-2">
                <LanguageSwitcher locale={locale} />
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
