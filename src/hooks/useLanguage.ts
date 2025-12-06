/**
 * Hook para gerenciar idioma
 */

'use client'

import { useState, useEffect } from 'react'
import { Language, detectLanguage, setLanguage as saveLanguage, DEFAULT_LANGUAGE } from '@/lib/i18n'

export function useLanguage() {
  const [language, setLanguageState] = useState<Language>(DEFAULT_LANGUAGE)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    // Detectar idioma apenas no client
    const detected = detectLanguage()
    setLanguageState(detected)
    setIsReady(true)
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    saveLanguage(lang)
  }

  return {
    language,
    setLanguage,
    isReady,
  }
}

