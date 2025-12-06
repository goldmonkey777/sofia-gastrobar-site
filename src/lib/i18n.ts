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
 * Detecta idioma do telefone/navegador automaticamente
 * Prioriza idioma do sistema, ignora localStorage para turistas
 */
export function detectLanguage(): Language {
  if (typeof window === 'undefined') return DEFAULT_LANGUAGE

  // Prioriza idioma do sistema do telefone
  const systemLang = navigator.language.toLowerCase()
  
  // Tenta match completo primeiro (ex: pt-BR, es-ES, en-US)
  for (const lang of SUPPORTED_LANGUAGES) {
    if (systemLang.startsWith(lang)) {
      return lang
    }
  }
  
  // Tenta match parcial (ex: pt, es, en)
  const browserLang = systemLang.split('-')[0] as Language
  if (SUPPORTED_LANGUAGES.includes(browserLang)) {
    return browserLang
  }

  // Fallback: inglês (maioria dos turistas em Ibiza)
  return DEFAULT_LANGUAGE
}

/**
 * Salva preferência de idioma (opcional - para override manual)
 */
export function setLanguage(lang: Language) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('sofia-language', lang)
  }
}

/**
 * Reseta para usar idioma do sistema (remove override manual)
 */
export function resetToSystemLanguage() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('sofia-language')
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

