/**
 * Hook para gerenciar idioma
 * Segue automaticamente o idioma do telefone
 */

'use client'

import { useState, useEffect } from 'react'
import { Language, detectLanguage, setLanguage as saveLanguage, DEFAULT_LANGUAGE } from '@/lib/i18n'

export function useLanguage() {
  const [language, setLanguageState] = useState<Language>(DEFAULT_LANGUAGE)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    // Detectar idioma do telefone automaticamente
    const detected = detectLanguage()
    setLanguageState(detected)
    setIsReady(true)
    
    // Opcional: escutar mudanças de idioma do sistema
    // (alguns navegadores não suportam, mas não faz mal)
    const handleLanguageChange = () => {
      const newLang = detectLanguage()
      if (newLang !== language) {
        setLanguageState(newLang)
      }
    }
    
    // Tentar escutar mudanças (não suportado em todos os browsers)
    if (typeof window !== 'undefined' && 'addEventListener' in window) {
      window.addEventListener('languagechange', handleLanguageChange)
      return () => {
        window.removeEventListener('languagechange', handleLanguageChange)
      }
    }
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

