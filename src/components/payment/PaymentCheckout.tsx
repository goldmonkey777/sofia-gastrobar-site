/**
 * Payment Checkout Component
 * Exibe resumo do pagamento e botão para pagar
 * Suporta deep links nativos para iOS/Android (mais rápido!)
 */

'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { CreditCard, Loader2, CheckCircle, AlertCircle, Smartphone } from 'lucide-react'
import { getCheckoutUrl } from '@/modules/sumup-integration/lib/sumup'
import {
  isMobile,
  isIOS,
  isAndroid,
  smartPaymentRedirect,
  type SumUpMobilePaymentParams,
} from '@/modules/sumup-integration/lib/mobile-deep-links'

interface PaymentCheckoutProps {
  amount: number
  description: string
  paymentLinkId: string
  foreignTxId?: string // ID para rastrear transação (ex: reservationId)
  onSuccess?: () => void
  onError?: (error: string) => void
  preferDeepLink?: boolean // Preferir deep link nativo (padrão: true em mobile)
}

export function PaymentCheckout({
  amount,
  description,
  paymentLinkId,
  foreignTxId,
  onSuccess,
  onError,
  preferDeepLink = true,
}: PaymentCheckoutProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [deviceType, setDeviceType] = useState<'desktop' | 'ios' | 'android' | 'mobile'>('desktop')

  // Detectar device type
  useEffect(() => {
    if (isIOS()) {
      setDeviceType('ios')
    } else if (isAndroid()) {
      setDeviceType('android')
    } else if (isMobile()) {
      setDeviceType('mobile')
    } else {
      setDeviceType('desktop')
    }
  }, [])

  const handlePayment = async () => {
    setIsProcessing(true)
    setError(null)

    try {
      // URL do checkout web (fallback)
      const checkoutUrl = getCheckoutUrl(paymentLinkId)

      // Se não for mobile ou não preferir deep link, usar web
      if (!isMobile() || !preferDeepLink) {
        window.location.href = checkoutUrl
        return
      }

      // Preparar parâmetros para deep link
      const deepLinkParams: SumUpMobilePaymentParams = {
        amount,
        currency: 'EUR',
        title: description,
        foreignTxId: foreignTxId || paymentLinkId,
        callbackSuccess: `${window.location.origin}/api/sumup/callback?success=true&foreign-tx-id=${foreignTxId || paymentLinkId}`,
        callbackFail: `${window.location.origin}/api/sumup/callback?success=false&foreign-tx-id=${foreignTxId || paymentLinkId}`,
        skipScreenSuccess: true,
      }

      // Usar estratégia inteligente (deep link com fallback para web)
      await smartPaymentRedirect(deepLinkParams, checkoutUrl, {
        preferDeepLink: true,
        showInstallPrompt: true,
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao processar pagamento'
      setError(errorMessage)
      setIsProcessing(false)
      onError?.(errorMessage)
    }
  }

  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <CreditCard className="w-6 h-6 text-yellow-400" />
        <h3 className="text-xl font-bold text-white">Confirmar Pagamento</h3>
      </div>

      {/* Resumo */}
      <div className="bg-black/30 rounded-xl p-4 mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-white/70">Descrição:</span>
          <span className="text-white font-medium text-sm">{description}</span>
        </div>
        <div className="flex justify-between items-center pt-2 border-t border-white/10">
          <span className="text-white font-semibold">Total:</span>
          <span className="text-yellow-400 font-bold text-xl">€{amount.toFixed(2)}</span>
        </div>
      </div>

      {/* Aviso */}
      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-6">
        <p className="text-yellow-400 text-sm">
          Este valor será totalmente descontado da sua conta no momento do consumo.
        </p>
      </div>

      {/* Erro */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-6 flex items-center gap-3"
        >
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
          <p className="text-red-400 text-sm">{error}</p>
        </motion.div>
      )}

      {/* Badge de método de pagamento (mobile) */}
      {deviceType !== 'desktop' && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 mb-4 flex items-center gap-3"
        >
          <Smartphone className="w-5 h-5 text-blue-400 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-blue-400 text-sm font-medium">
              {deviceType === 'ios' && '🍎 Pagamento via App SumUp (iOS)'}
              {deviceType === 'android' && '🤖 Pagamento via App SumUp (Android)'}
              {deviceType === 'mobile' && '📱 Pagamento Mobile Otimizado'}
            </p>
            <p className="text-blue-400/70 text-xs mt-1">
              Mais rápido e seguro que pagamento web
            </p>
          </div>
        </motion.div>
      )}

      {/* Botão de Pagamento */}
      <button
        onClick={handlePayment}
        disabled={isProcessing}
        className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-bold py-4 px-8 rounded-xl hover:from-yellow-400 hover:to-yellow-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-yellow-500/20 flex items-center justify-center gap-3"
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Processando...</span>
          </>
        ) : (
          <>
            {deviceType !== 'desktop' ? (
              <Smartphone className="w-5 h-5" />
            ) : (
              <CreditCard className="w-5 h-5" />
            )}
            <span>Pagar €{amount.toFixed(2)} Agora</span>
          </>
        )}
      </button>

      <p className="text-white/50 text-xs text-center mt-4">
        Pagamento seguro processado por SumUp
        {deviceType !== 'desktop' && (
          <span className="block mt-1 text-blue-400/70">
            {deviceType === 'ios' && 'Abre no app SumUp (se instalado)'}
            {deviceType === 'android' && 'Abre no app SumUp (se instalado)'}
          </span>
        )}
      </p>
    </div>
  )
}

