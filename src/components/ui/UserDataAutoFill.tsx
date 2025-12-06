/**
 * UserDataAutoFill Component
 * Botão para preencher automaticamente dados do usuário
 * Usa dados salvos no telefone/navegador
 */

'use client'

import { useState } from 'react'
import { User, Loader2, CheckCircle } from 'lucide-react'
import { useUserData } from '@/hooks/useUserData'
import { useLanguage } from '@/hooks/useLanguage'
import { translate } from '@/lib/i18n'

interface UserDataAutoFillProps {
  onFill: (data: { name?: string; email?: string; phone?: string; address?: string }) => void
  className?: string
}

const translations = {
  fillData: {
    pt: 'Preencher com Meus Dados',
    es: 'Rellenar con Mis Datos',
    en: 'Fill with My Data',
  },
  loading: {
    pt: 'Carregando...',
    es: 'Cargando...',
    en: 'Loading...',
  },
  filled: {
    pt: 'Dados preenchidos!',
    es: '¡Datos rellenados!',
    en: 'Data filled!',
  },
  noData: {
    pt: 'Nenhum dado salvo encontrado',
    es: 'No se encontraron datos guardados',
    en: 'No saved data found',
  },
}

export function UserDataAutoFill({ onFill, className = '' }: UserDataAutoFillProps) {
  const { language, isReady } = useLanguage()
  const { userData, loading, loadUserData } = useUserData({ autoLoad: false })
  const [isFilled, setIsFilled] = useState(false)

  if (!isReady) return null

  const handleFill = async () => {
    if (userData.name || userData.email || userData.phone || userData.address) {
      onFill({
        name: userData.name || undefined,
        email: userData.email || undefined,
        phone: userData.phone || undefined,
        address: userData.address || undefined,
      })
      setIsFilled(true)
      setTimeout(() => setIsFilled(false), 2000)
    } else {
      // Tentar carregar dados
      await loadUserData()
      if (userData.name || userData.email || userData.phone || userData.address) {
        onFill({
          name: userData.name || undefined,
          email: userData.email || undefined,
          phone: userData.phone || undefined,
          address: userData.address || undefined,
        })
        setIsFilled(true)
        setTimeout(() => setIsFilled(false), 2000)
      } else {
        alert(translate(translations.noData, language))
      }
    }
  }

  const hasData = userData.name || userData.email || userData.phone || userData.address

  return (
    <button
      type="button"
      onClick={handleFill}
      disabled={loading}
      className={`flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm ${className}`}
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          {translate(translations.loading, language)}
        </>
      ) : isFilled ? (
        <>
          <CheckCircle className="w-4 h-4 text-green-500" />
          {translate(translations.filled, language)}
        </>
      ) : (
        <>
          <User className="w-4 h-4" />
          {translate(translations.fillData, language)}
        </>
      )}
    </button>
  )
}

