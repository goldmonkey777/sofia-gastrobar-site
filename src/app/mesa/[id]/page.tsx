/**
 * Página da Mesa - Menu Direto
 * Mobile-First, carregamento instantâneo, multilíngue
 * 
 * Quando turista escaneia QR da mesa → entra direto no menu
 */

'use client'

import { useParams } from 'next/navigation'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Bell, FileText, Home, Clock, Globe } from 'lucide-react'
import Link from 'next/link'
import { useTableSession } from '@/modules/qr-table-system/hooks/useTableSession'
import { useCallWaiter } from '@/modules/qr-table-system/hooks/useCallWaiter'
import { formatTableNumber } from '@/modules/qr-table-system/utils/tableHelpers'
import { TableMenu } from '@/components/menu/TableMenu'
import { LanguageSelector } from '@/components/ui/LanguageSelector'
import { DJMode } from '@/components/dj/DJMode'
import { useLanguage } from '@/hooks/useLanguage'
import { translate } from '@/lib/i18n'

export default function MesaPage() {
  const params = useParams()
  const tableId = params.id as string
  const { language, isReady } = useLanguage()
  const [showActions, setShowActions] = useState(false)

  // Usar hooks modulares
  const {
    table,
    isActive,
    sessionDurationFormatted,
  } = useTableSession({ tableId, autoStart: true })

  const {
    callStatus,
    billStatus,
    callWaiter,
    requestBill,
  } = useCallWaiter({
    tableId,
    onSuccess: () => {
      // Feedback visual já está no componente
    },
    onError: (error) => {
      console.error('Error:', error)
    },
  })

  if (!table) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">
            {translate(
              { pt: 'Mesa não encontrada', es: 'Mesa no encontrada', en: 'Table not found' },
              language
            )}
          </h1>
          <Link href="/" className="text-yellow-500 hover:text-yellow-400">
            {translate(
              { pt: 'Voltar ao início', es: 'Volver al inicio', en: 'Back to home' },
              language
            )}
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header Fixo - Minimalista */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-black/95 backdrop-blur-sm border-b border-white/10 sticky top-0 z-50"
      >
        <div className="max-w-2xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-yellow-500 hover:text-yellow-400">
              <Home className="w-5 h-5" />
              <span className="font-bold text-sm">Sofia</span>
            </Link>
            
            <div className="flex items-center gap-3">
              {/* Mesa */}
              <div className="text-center">
                <div className="text-lg font-bold text-white">{formatTableNumber(table)}</div>
                {isActive && (
                  <div className="text-xs text-white/60 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {sessionDurationFormatted}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Menu Direto - Sem página intermediária */}
      <div className="max-w-2xl mx-auto pb-24">
        <TableMenu tableId={tableId} />
        
        {/* Modo DJ - Integrado na experiência da mesa */}
        <div className="px-4 mt-8">
          <DJMode tableId={tableId} />
        </div>
      </div>

      {/* Botões de Ação Fixos (Bottom Sheet) */}
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-xl border-t border-white/10 z-50"
      >
        {/* Toggle Actions */}
        <button
          onClick={() => setShowActions(!showActions)}
          className="w-full px-4 py-3 flex items-center justify-center gap-2 text-white/80 hover:text-white transition-colors"
        >
          <span className="text-sm font-medium">
            {translate(
              { pt: 'Ações', es: 'Acciones', en: 'Actions' },
              language
            )}
          </span>
          <motion.div
            animate={{ rotate: showActions ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </motion.div>
        </button>

        {/* Actions Panel */}
        {showActions && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="px-4 pb-4 space-y-2"
          >
            {/* Call Waiter */}
            <button
              onClick={callWaiter}
              disabled={callStatus === 'calling'}
              className={`
                w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-black
                rounded-xl p-4 shadow-lg
                flex items-center gap-3
                hover:from-yellow-400 hover:to-yellow-500 transition-all
                disabled:opacity-50 disabled:cursor-not-allowed
                ${callStatus === 'success' ? 'bg-green-500' : ''}
                ${callStatus === 'error' ? 'bg-red-500' : ''}
              `}
            >
              <Bell className={`w-6 h-6 ${callStatus === 'calling' ? 'animate-bounce' : ''}`} />
              <div className="text-left flex-1">
                <div className="font-bold">
                  {callStatus === 'calling' && translate(
                    { pt: 'Chamando...', es: 'Llamando...', en: 'Calling...' },
                    language
                  )}
                  {callStatus === 'success' && translate(
                    { pt: 'Garçom chamado!', es: '¡Camarero llamado!', en: 'Waiter called!' },
                    language
                  )}
                  {callStatus === 'error' && translate(
                    { pt: 'Erro. Tente novamente', es: 'Error. Intenta de nuevo', en: 'Error. Try again' },
                    language
                  )}
                  {callStatus === 'idle' && translate(
                    { pt: 'Chamar Garçom', es: 'Llamar Camarero', en: 'Call Waiter' },
                    language
                  )}
                </div>
                {callStatus === 'success' && (
                  <div className="text-sm opacity-90">
                    {translate(
                      { pt: 'Chegaremos em instantes', es: 'Llegaremos en un momento', en: 'We\'ll be there shortly' },
                      language
                    )}
                  </div>
                )}
              </div>
            </button>

            {/* Request Bill */}
            <button
              onClick={requestBill}
              disabled={billStatus === 'calling'}
              className={`
                w-full bg-white/10 hover:bg-white/20 text-white
                rounded-xl p-4
                flex items-center gap-3
                transition-all
                disabled:opacity-50 disabled:cursor-not-allowed
                ${billStatus === 'success' ? 'bg-green-500' : ''}
                ${billStatus === 'error' ? 'bg-red-500' : ''}
              `}
            >
              <FileText className={`w-6 h-6 ${billStatus === 'calling' ? 'animate-pulse' : ''}`} />
              <div className="text-left flex-1">
                <div className="font-bold">
                  {billStatus === 'calling' && translate(
                    { pt: 'Solicitando...', es: 'Solicitando...', en: 'Requesting...' },
                    language
                  )}
                  {billStatus === 'success' && translate(
                    { pt: 'Conta solicitada!', es: '¡Cuenta solicitada!', en: 'Bill requested!' },
                    language
                  )}
                  {billStatus === 'error' && translate(
                    { pt: 'Erro. Tente novamente', es: 'Error. Intenta de nuevo', en: 'Error. Try again' },
                    language
                  )}
                  {billStatus === 'idle' && translate(
                    { pt: 'Pedir a Conta', es: 'Pedir la Cuenta', en: 'Request Bill' },
                    language
                  )}
                </div>
              </div>
            </button>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}
