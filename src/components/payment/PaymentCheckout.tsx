/**
 * Payment Checkout Component
 * Exibe resumo do pagamento e botão para pagar
 */

'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { CreditCard, Loader2, CheckCircle, AlertCircle } from 'lucide-react'
import { getCheckoutUrl } from '@/modules/sumup-integration/lib/sumup'

interface PaymentCheckoutProps {
  amount: number
  description: string
  paymentLinkId: string
  onSuccess?: () => void
  onError?: (error: string) => void
}

export function PaymentCheckout({
  amount,
  description,
  paymentLinkId,
  onSuccess,
  onError,
}: PaymentCheckoutProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handlePayment = async () => {
    setIsProcessing(true)
    setError(null)

    try {
      // Obter URL do checkout
      const checkoutUrl = getCheckoutUrl(paymentLinkId)
      
      // Redirecionar para SumUp
      window.location.href = checkoutUrl
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
            <CreditCard className="w-5 h-5" />
            <span>Pagar €{amount.toFixed(2)} Agora</span>
          </>
        )}
      </button>

      <p className="text-white/50 text-xs text-center mt-4">
        Pagamento seguro processado por SumUp
      </p>
    </div>
  )
}

