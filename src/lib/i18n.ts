/**
 * Sistema Multilíngue - Sofia Gastrobar
 * Suporte para PT, ES, EN (expandível)
 */

export type Language = 'pt' | 'es' | 'en'

export const DEFAULT_LANGUAGE: Language = 'en' // Turistas em Ibiza = inglês default

export const SUPPORTED_LANGUAGES: Language[] = ['pt', 'es', 'en']

export const LANGUAGE_NAMES: Record<Language, string> = {
  pt: 'Português',
  es: 'Español',
  en: 'English',
}

export const LANGUAGE_FLAGS: Record<Language, string> = {
  pt: '🇧🇷',
  es: '🇪🇸',
  en: '🇬🇧',
}

/**
 * Detecta idioma do navegador ou usa default
 */
export function detectLanguage(): Language {
  if (typeof window === 'undefined') return DEFAULT_LANGUAGE

  const stored = localStorage.getItem('sofia-language') as Language | null
  if (stored && SUPPORTED_LANGUAGES.includes(stored)) {
    return stored
  }

  const browserLang = navigator.language.split('-')[0] as Language
  if (SUPPORTED_LANGUAGES.includes(browserLang)) {
    return browserLang
  }

  return DEFAULT_LANGUAGE
}

/**
 * Salva preferência de idioma
 */
export function setLanguage(lang: Language) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('sofia-language', lang)
  }
}

/**
 * Traduz texto baseado em objeto multilíngue
 */
export function translate<T extends Record<Language, string>>(
  text: T,
  lang: Language
): string {
  return text[lang] || text[DEFAULT_LANGUAGE]
}

