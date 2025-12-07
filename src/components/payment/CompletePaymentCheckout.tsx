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

      {/* Aviso se SumUp não configurado */}
      {checkoutId?.startsWith('mock_') && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-4 mb-6"
        >
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-yellow-400 font-semibold text-sm mb-1">
                {language === 'pt' ? 'SumUp não configurado' : language === 'es' ? 'SumUp no configurado' : 'SumUp not configured'}
              </p>
              <p className="text-yellow-300/80 text-xs mb-3">
                {language === 'pt' 
                  ? 'O sistema de pagamento não está configurado. Entre em contato via WhatsApp para finalizar seu pedido.'
                  : language === 'es'
                  ? 'El sistema de pago no está configurado. Contáctanos por WhatsApp para finalizar tu pedido.'
                  : 'Payment system is not configured. Contact us via WhatsApp to complete your order.'}
              </p>
              <a
                href={`https://wa.me/34611487773?text=${encodeURIComponent(
                  language === 'pt'
                    ? `Olá! Gostaria de finalizar meu pedido. Total: €${amount.toFixed(2)}. ${description}`
                    : language === 'es'
                    ? `¡Hola! Me gustaría finalizar mi pedido. Total: €${amount.toFixed(2)}. ${description}`
                    : `Hello! I would like to complete my order. Total: €${amount.toFixed(2)}. ${description}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                {language === 'pt' ? 'Finalizar via WhatsApp' : language === 'es' ? 'Finalizar por WhatsApp' : 'Complete via WhatsApp'}
              </a>
            </div>
          </div>
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

        {/* Cartão de Crédito - Só mostrar se não for mock */}
        {availableMethods.includes('card') && !checkoutId?.startsWith('mock_') && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              console.log('[Payment] Button clicked', { checkoutId, isProcessing })
              handleCardPayment()
            }}
            disabled={isProcessing || !checkoutId}
            className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-bold py-4 px-8 rounded-xl hover:from-yellow-400 hover:to-yellow-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-yellow-500/20 flex items-center justify-center gap-3"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>{t.processing}</span>
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

