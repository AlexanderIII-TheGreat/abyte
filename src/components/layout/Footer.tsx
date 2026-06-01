import Link from 'next/link'
import Image from 'next/image'
import { SITE_CONFIG } from '@/lib/constants'
import { getTranslations } from '@/i18n'
import type { Locale } from '@/i18n/config'
import type { Category } from '@/types'

interface FooterProps {
  locale: Locale
  categories: Category[]
}

export function Footer({ locale, categories }: FooterProps) {
  const currentYear = new Date().getFullYear()
  const t = getTranslations(locale)

  return (
    <footer className="bg-gray-50 border-t border-gray-100" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href={`/${locale}`} className="flex items-center gap-2.5" aria-label="Home">
              <Image
                src="/abyte-logo.png"
                alt={`${SITE_CONFIG.name} logo`}
                width={32}
                height={32}
                className="rounded-lg"
              />
              <span className="text-lg font-display font-bold text-gray-900">
                {SITE_CONFIG.name}
              </span>
            </Link>
            <p className="mt-4 text-sm text-gray-600 leading-relaxed max-w-xs">
              {t.footer.description}
            </p>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              {t.footer.categoriesLabel}
            </h3>
            <nav aria-label={t.footer.categoryLinksLabel}>
              <ul className="space-y-3">
                {categories.map((category) => (
                  <li key={category.slug}>
                    <Link
                      href={`/${locale}/categories/${category.slug}`}
                      className="text-sm text-gray-600 hover:text-primary-600 transition-colors"
                    >
                      {t.categories.names[category.slug] ?? category.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              {t.footer.linksLabel}
            </h3>
            <nav aria-label={t.footer.siteLinksLabel}>
              <ul className="space-y-3">
                <li>
                  <Link
                    href={`/${locale}/about`}
                    className="text-sm text-gray-600 hover:text-primary-600 transition-colors"
                  >
                    {t.footer.about}
                  </Link>
                </li>
                <li>
                  <a
                    href={SITE_CONFIG.author.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-gray-600 hover:text-primary-600 transition-colors"
                  >
                    {t.footer.portfolio}
                  </a>
                </li>
                <li>
                  <a
                    href={SITE_CONFIG.links.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-gray-600 hover:text-primary-600 transition-colors"
                  >
                    {t.footer.github}
                  </a>
                </li>
              </ul>
            </nav>
          </div>

          {/* Author */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              {t.footer.authorLabel}
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              {t.footer.craftedBy}{' '}
              <a
                href={SITE_CONFIG.author.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-primary-600 hover:text-primary-700 transition-colors"
              >
                {SITE_CONFIG.author.name}
              </a>
            </p>
            <p className="mt-1 text-sm text-gray-500">{SITE_CONFIG.author.role}</p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500">
              &copy; {currentYear} {SITE_CONFIG.name}. {t.footer.rightsReserved}
            </p>
            <div className="flex items-center gap-4">
              <a
                href={SITE_CONFIG.links.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-primary-600 transition-colors"
                aria-label="Twitter"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href={SITE_CONFIG.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-primary-600 transition-colors"
                aria-label="GitHub"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
