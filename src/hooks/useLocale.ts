'use client'

import { useState, useEffect } from 'react'
import type { Locale } from '@/i18n/config'
import { locales, defaultLocale } from '@/i18n/config'
import { getTranslations } from '@/i18n'
import type { Translations } from '@/i18n/types'

export function useLocale() {
  const [locale, setLocale] = useState<Locale>(defaultLocale)
  const [t, setT] = useState<Translations>(getTranslations(defaultLocale))

  useEffect(() => {
    const match = document.cookie.match(/NEXT_LOCALE=([^;]+)/)
    if (match && locales.includes(match[1] as Locale)) {
      const detected = match[1] as Locale
      setLocale(detected)
      setT(getTranslations(detected))
    } else {
      const browserLang = navigator.language.split('-')[0]
      if (locales.includes(browserLang as Locale)) {
        const detected = browserLang as Locale
        setLocale(detected)
        setT(getTranslations(detected))
      }
    }
  }, [])

  return { locale, t }
}
