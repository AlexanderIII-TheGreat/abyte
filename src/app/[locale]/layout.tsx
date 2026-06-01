import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { SITE_CONFIG } from '@/lib/constants'
import { generateWebsiteJsonLd, generatePersonJsonLd } from '@/lib/jsonld'
import { getAllCategories } from '@/lib/articles'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { AnalyticsScript } from '@/components/analytics/AnalyticsScript'
import { getTranslations, locales, ogLocales } from '@/i18n'
import type { Locale } from '@/i18n/config'

interface LocaleLayoutProps {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale: localeStr } = await params
  const locale = localeStr as Locale
  if (!locales.includes(locale)) return {}

  const t = getTranslations(locale)
  const baseUrl = SITE_CONFIG.url

  return {
    metadataBase: new URL(baseUrl),
    title: {
      default: t.meta.homeTitle,
      template: `%s | ${SITE_CONFIG.name}`,
    },
    description: t.meta.homeDescription,
    authors: [{ name: SITE_CONFIG.author.name, url: SITE_CONFIG.author.url }],
    creator: SITE_CONFIG.author.name,
    publisher: SITE_CONFIG.name,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      type: 'website',
      locale: ogLocales[locale],
      alternateLocale: locales
        .filter((l) => l !== locale)
        .map((l) => ogLocales[l]),
      url: `${baseUrl}/${locale}`,
      siteName: SITE_CONFIG.name,
      title: t.meta.homeTitle,
      description: t.meta.homeDescription,
      images: [
        {
          url: SITE_CONFIG.ogImage,
          width: 1200,
          height: 630,
          alt: SITE_CONFIG.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: t.meta.homeTitle,
      description: t.meta.homeDescription,
      images: [SITE_CONFIG.ogImage],
      creator: '@abyte',
    },
    alternates: {
      canonical: `${baseUrl}/${locale}`,
      languages: Object.fromEntries(
        locales.map((l) => [l, `${baseUrl}/${l}`])
      ),
    },
  }
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale: localeStr } = await params
  if (!locales.includes(localeStr as Locale)) notFound()

  const locale = localeStr as Locale
  const websiteSchema = generateWebsiteJsonLd()
  const personSchema = generatePersonJsonLd()
  const categories = await getAllCategories(locale)

  return (
    <>
      <Header locale={locale} categories={categories} />
      <main className="flex-1">{children}</main>
      <Footer locale={locale} categories={categories} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(personSchema),
        }}
      />
      <AnalyticsScript />
    </>
  )
}
