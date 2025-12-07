/**
 * Complete Payment Checkout Component
 * Integração completa com Apple Pay, Google Pay e Cartão
 * Funciona mesmo sem SumUp configurado (cria checkout mock)
 */

'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CreditCard, Loader2, CheckCircle, AlertCircle } from 'lucide-react'
import { ApplePayButton } from './ApplePayButton'
import { GooglePayButton } from './GooglePayButton'

interface CompletePaymentCheckoutProps {
  amount: number
  currency?: string
  description: string
  orderId: string
  orderType: 'delivery' | 'reservation' | 'table'
  customerEmail?: string
  customerName?: string
  redirectUrl?: string
  onSuccess?: () => void
  onError?: (error: string) => void
  language?: 'pt' | 'es' | 'en'
}

const translations = {
  pt: {
    title: 'Confirmar Pagamento',
    description: 'Descrição',
    total: 'Total',
    processing: 'Processando...',
    payNow: 'Pagar Agora',
    or: 'ou',
    securePayment: 'Pagamento seguro processado por SumUp',
    error: 'Erro ao processar pagamento',
    creatingCheckout: 'Preparando pagamento...',
  },
  es: {
    title: 'Confirmar Pago',
    description: 'Descripción',
    total: 'Total',
    processing: 'Procesando...',
    payNow: 'Pagar Ahora',
    or: 'o',
    securePayment: 'Pago seguro procesado por SumUp',
    error: 'Error al procesar pago',
    creatingCheckout: 'Preparando pago...',
  },
  en: {
    title: 'Confirm Payment',
    description: 'Description',
    total: 'Total',
    processing: 'Processing...',
    payNow: 'Pay Now',
    or: 'or',
    securePayment: 'Secure payment processed by SumUp',
    error: 'Error processing payment',
    creatingCheckout: 'Preparing payment...',
  },
}

export function CompletePaymentCheckout({
  amount,
  currency = 'EUR',
  description,
  orderId,
  orderType,
  customerEmail,
  customerName,
  redirectUrl,
  onSuccess,
  onError,
  language = 'pt',
}: CompletePaymentCheckoutProps) {
  const [checkoutId, setCheckoutId] = useState<string | null>(null)
  const [isCreatingCheckout, setIsCreatingCheckout] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [availableMethods, setAvailableMethods] = useState<string[]>([])
  const [merchantCode, setMerchantCode] = useState<string>('')

  const t = translations[language]

  // Criar checkout ao montar componente
  useEffect(() => {
    createCheckout()
  }, [])

  const createCheckout = async () => {
    try {
      setIsCreatingCheckout(true)
      setError(null)

      console.log('[Payment] Creating checkout...', { amount, currency, description, orderId, orderType })

      // Criar checkout via API
      const response = await fetch('/api/sumup/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          currency,
          description,
          redirect_url: redirectUrl || `${window.location.origin}/${orderType}/confirmacao?order_id=${orderId}&status=paid`,
          reference: `${orderType.toUpperCase()}_${orderId}`,
        }),
      })

      const data = await response.json()
      console.log('[Payment] Checkout response:', { status: response.status, data })

      if (!response.ok) {
        // Se SumUp não está configurado, criar checkout mock
        if (data.error === 'SUMUP_NOT_CONFIGURED' || data.error?.includes('SUMUP_NOT_CONFIGURED')) {
          console.warn('[Payment] SumUp not configured, creating mock checkout')
          const mockCheckoutId = `mock_${Date.now()}_${orderId}`
          setCheckoutId(mockCheckoutId)
          setAvailableMethods(['apple_pay', 'google_pay', 'card'])
          setIsCreatingCheckout(false)
          return
        }
        throw new Error(data.error || 'Erro ao criar checkout')
      }

      if (!data.checkout || !data.checkout.id) {
        throw new Error('Checkout criado mas sem ID válido')
      }

      console.log('[Payment] Checkout created successfully:', data.checkout.id)
      setCheckoutId(data.checkout.id)
      setMerchantCode(data.checkout.merchant_code || '')

      // Obter métodos disponíveis
      if (data.checkout.id) {
        try {
          const methodsResponse = await fetch(`/api/sumup/payment-methods?checkout_id=${data.checkout.id}`)
          if (methodsResponse.ok) {
            const methodsData = await methodsResponse.json()
            console.log('[Payment] Available methods:', methodsData.methods)
            setAvailableMethods(methodsData.methods?.map((m: any) => m.id) || ['card', 'apple_pay', 'google_pay'])
          } else {
            // Fallback: assumir que Apple Pay e Google Pay estão disponíveis
            console.warn('[Payment] Could not fetch payment methods, using defaults')
            setAvailableMethods(['card', 'apple_pay', 'google_pay'])
          }
        } catch (err) {
          console.error('[Payment] Error fetching payment methods:', err)
          setAvailableMethods(['card', 'apple_pay', 'google_pay'])
        }
      }

      setIsCreatingCheckout(false)
    } catch (err) {
      console.error('[Payment] Error creating checkout:', err)
      const errorMessage = err instanceof Error ? err.message : t.error
      setError(errorMessage)
      setIsCreatingCheckout(false)
      onError?.(errorMessage)
    }
  }

  const handleCardPayment = async () => {
    console.log('[Payment] handleCardPayment called', { checkoutId, isMock: checkoutId?.startsWith('mock_') })
    
    if (!checkoutId) {
      console.error('[Payment] No checkoutId available')
      setError('Erro: Checkout não foi criado. Tente novamente.')
      return
    }

    // Se é checkout mock, não pode processar
    if (checkoutId.startsWith('mock_')) {
      console.warn('[Payment] Mock checkout detected, cannot process')
      setError('SumUp não está configurado. Por favor, configure as variáveis de ambiente SUMUP_API_KEY no Vercel.')
      setIsProcessing(false)
      onError?.('SumUp não está configurado')
      return
    }

    setIsProcessing(true)
    setError(null)

    try {
      // Verificar se checkoutId é válido
      if (!checkoutId || checkoutId.trim() === '') {
        throw new Error('Checkout ID inválido')
      }

      // Redirecionar para SumUp checkout page
      const checkoutUrl = `https://pay.sumup.com/checkout/${checkoutId}`
      console.log('[Payment] Redirecting to:', checkoutUrl)
      
      // Usar window.open para abrir em nova aba (melhor UX) ou window.location.href
      window.location.href = checkoutUrl
    } catch (err) {
      console.error('[Payment] Error in handleCardPayment:', err)
      const errorMessage = err instanceof Error ? err.message : t.error
      setError(errorMessage)
      setIsProcessing(false)
      onError?.(errorMessage)
    }
  }

  const handlePaymentSuccess = () => {
    setIsProcessing(false)
    onSuccess?.()
  }

  const handlePaymentError = (errorMessage: string) => {
    setError(errorMessage)
    setIsProcessing(false)
    onError?.(errorMessage)
  }

  if (isCreatingCheckout) {
    return (
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
        <div className="flex items-center justify-center gap-3 py-8">
          <Loader2 className="w-6 h-6 animate-spin text-yellow-400" />
          <span className="text-white/70">{t.creatingCheckout}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <CreditCard className="w-6 h-6 text-yellow-400" />
        <h3 className="text-xl font-bold text-white">{t.title}</h3>
      </div>

      {/* Resumo */}
      <div className="bg-black/30 rounded-xl p-4 mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-white/70">{t.description}:</span>
          <span className="text-white font-medium text-sm">{description}</span>
        </div>
        <div className="flex justify-between items-center pt-2 border-t border-white/10">
          <span className="text-white font-semibold">{t.total}:</span>
          <span className="text-yellow-400 font-bold text-xl">€{amount.toFixed(2)}</span>
        </div>
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

      {/* Métodos de Pagamento */}
      <div className="space-y-4">
        {/* Apple Pay */}
        {checkoutId && !checkoutId.startsWith('mock_') && availableMethods.includes('apple_pay') && (
          <ApplePayButton
            checkoutId={checkoutId}
            amount={amount}
            currency={currency}
            countryCode="ES"
            onSuccess={handlePaymentSuccess}
            onError={handlePaymentError}
            language={language}
          />
        )}

        {/* Google Pay */}
        {checkoutId && !checkoutId.startsWith('mock_') && availableMethods.includes('google_pay') && merchantCode && (
          <GooglePayButton
            checkoutId={checkoutId}
            amount={amount}
            currency={currency}
            merchantCode={merchantCode}
            merchantName="Sofia Gastrobar"
            onSuccess={handlePaymentSuccess}
            onError={handlePaymentError}
            language={language}
          />
        )}

        {/* Divider */}
        {(availableMethods.includes('apple_pay') || availableMethods.includes('google_pay')) && availableMethods.includes('card') && (
          <div className="flex items-center gap-4 my-4">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-white/50 text-sm">{t.or}</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>
        )}

        {/* Cartão de Crédito */}
        {availableMethods.includes('card') && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              console.log('[Payment] Button clicked', { checkoutId, isProcessing })
              handleCardPayment()
            }}
            disabled={isProcessing || !checkoutId || checkoutId?.startsWith('mock_')}
            className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-bold py-4 px-8 rounded-xl hover:from-yellow-400 hover:to-yellow-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-yellow-500/20 flex items-center justify-center gap-3"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>{t.processing}</span>
              </>
            ) : checkoutId?.startsWith('mock_') ? (
              <>
                <AlertCircle className="w-5 h-5" />
                <span>SumUp não configurado</span>
              </>
            ) : !checkoutId ? (
              <>
                <AlertCircle className="w-5 h-5" />
                <span>Criando checkout...</span>
              </>
            ) : (
              <>
                <CreditCard className="w-5 h-5" />
                <span>{t.payNow} €{amount.toFixed(2)}</span>
              </>
            )}
          </button>
        )}
      </div>

      <p className="text-white/50 text-xs text-center mt-4">
        {t.securePayment}
      </p>
    </div>
  )
}

