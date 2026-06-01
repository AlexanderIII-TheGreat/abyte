import { locales, defaultLocale, localeNames, ogLocales } from './config'
import type { Locale } from './config'
import type { Translations } from './types'
import { en } from './locales/en'
import { id } from './locales/id'

const translations: Record<Locale, Translations> = { en, id }

export function getTranslations(locale: Locale): Translations {
  return translations[locale] ?? translations[defaultLocale]
}

export { locales, defaultLocale, localeNames, ogLocales }
export type { Locale, Translations }
