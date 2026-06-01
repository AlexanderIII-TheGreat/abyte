import { defaultLocale } from '@/i18n/config'
import { SITE_CONFIG } from '@/lib/constants'
import { AnalyticsScript } from '@/components/analytics/AnalyticsScript'
import './globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang={defaultLocale} className="scroll-smooth" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#2563eb" />
        <meta name="author" content={SITE_CONFIG.author.name} />
      </head>
      <body className="min-h-screen flex flex-col bg-white">
        <AnalyticsScript />
        {children}
      </body>
    </html>
  )
}
