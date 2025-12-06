/**
 * Seletor de Idioma - Mobile-First
 */

'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Globe, ChevronDown } from 'lucide-react'
import { useLanguage } from '@/hooks/useLanguage'
import { SUPPORTED_LANGUAGES, LANGUAGE_NAMES, LANGUAGE_FLAGS } from '@/lib/i18n'
import type { Language } from '@/lib/i18n'

export function LanguageSelector() {
  const { language, setLanguage, isReady } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)

  if (!isReady) return null

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white text-sm font-medium transition-colors"
      >
        <Globe className="w-4 h-4" />
        <span>{LANGUAGE_FLAGS[language]}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full right-0 mt-2 bg-black/95 backdrop-blur-xl border border-white/20 rounded-xl overflow-hidden z-50 min-w-[180px]"
            >
              {SUPPORTED_LANGUAGES.map(lang => (
                <button
                  key={lang}
                  onClick={() => {
                    setLanguage(lang)
                    setIsOpen(false)
                  }}
                  className={`w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-white/10 transition-colors ${
                    language === lang ? 'bg-yellow-500/20 text-yellow-500' : 'text-white'
                  }`}
                >
                  <span className="text-xl">{LANGUAGE_FLAGS[lang]}</span>
                  <span className="font-medium">{LANGUAGE_NAMES[lang]}</span>
                  {language === lang && (
                    <span className="ml-auto text-yellow-500">✓</span>
                  )}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

