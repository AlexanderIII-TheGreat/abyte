import type { Metadata } from 'next'
import Link from 'next/link'
import { SITE_CONFIG } from '@/lib/constants'
import { getTranslations } from '@/i18n'
import type { Locale } from '@/i18n/config'

interface AboutPageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({
  params,
}: AboutPageProps): Promise<Metadata> {
  const { locale: localeStr } = await params
  const locale = localeStr as Locale
  const t = getTranslations(locale)

  return {
    title: t.meta.aboutTitle,
    description: t.meta.aboutDescription,
    openGraph: {
      title: `${t.meta.aboutTitle} | ${SITE_CONFIG.name}`,
      description: t.meta.aboutDescription,
      url: `${SITE_CONFIG.url}/${locale}/about`,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${t.meta.aboutTitle} | ${SITE_CONFIG.name}`,
      description: t.meta.aboutDescription,
    },
    alternates: {
      canonical: `${SITE_CONFIG.url}/${locale}/about`,
    },
  }
}

export default async function AboutPage({ params }: AboutPageProps) {
  const { locale: localeStr } = await params
  const locale = localeStr as Locale
  const t = getTranslations(locale)

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      <header className="mb-12">
        <h1 className="text-3xl sm:text-4xl font-display font-bold text-gray-900 tracking-tight mb-6">
          {t.about.title}
        </h1>
        <div className="w-20 h-1 bg-primary-600 rounded-full" />
      </header>

      <div className="prose-article">
        <h2>{t.about.missionTitle}</h2>
        <p>
          <strong>{SITE_CONFIG.name}</strong> {t.about.missionParagraph}
        </p>

        <h2>{t.about.whatYouFindTitle}</h2>
        <p>{t.about.whatYouFindIntro}</p>
        <ul>
          <li>
            <strong>Web Development</strong> — Modern frameworks, performance
            optimization, and best practices for building production-grade
            applications.
          </li>
          <li>
            <strong>System Design</strong> — Architecture patterns, scalability
            strategies, and distributed systems concepts.
          </li>
          <li>
            <strong>DevOps</strong> — CI/CD pipelines, containerization, cloud
            infrastructure, and deployment strategies.
          </li>
          <li>
            <strong>AI & Machine Learning</strong> — Practical applications of
            LLMs, RAG pipelines, and emerging AI technologies.
          </li>
          <li>
            <strong>Career Growth</strong> — Soft skills, leadership, and
            professional development for engineers.
          </li>
        </ul>

        <h2>{t.about.authorTitle}</h2>
        <p>{t.about.authorParagraph1}</p>
        <p>{t.about.authorParagraph2}</p>

        <h2>{t.about.connectTitle}</h2>
        <p>{t.about.connectParagraph}</p>
        <ul>
          <li>
            <a
              href={SITE_CONFIG.author.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              {t.about.portfolioLabel}
            </a>
          </li>
          <li>
            <a
              href={SITE_CONFIG.links.github}
              target="_blank"
              rel="noopener noreferrer"
            >
              {t.about.githubLabel}
            </a>
          </li>
          <li>
            <a
              href={SITE_CONFIG.links.twitter}
              target="_blank"
              rel="noopener noreferrer"
            >
              {t.about.twitterLabel}
            </a>
          </li>
        </ul>
      </div>

      <div className="mt-12 pt-8 border-t border-gray-100">
        <Link
          href={`/${locale}`}
          className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
        >
          {t.about.backToHome}
        </Link>
      </div>
    </div>
  )
}
