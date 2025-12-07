/**
 * Componente para integração direta do Apple Pay
 * Documentação: https://developer.sumup.com/online-payments/apm/apple-pay
 */

'use client'

import { useState, useEffect } from 'react'
import { Loader2, AlertCircle } from 'lucide-react'

interface ApplePayButtonProps {
  checkoutId: string
  amount: number
  currency?: string
  countryCode?: string
  onSuccess?: () => void
  onError?: (error: string) => void
  language?: 'pt' | 'es' | 'en'
}

declare global {
  interface Window {
    ApplePaySession?: any
  }
}

const translations = {
  pt: {
    notAvailable: 'Apple Pay não está disponível neste dispositivo',
    processing: 'Processando...',
    error: 'Erro ao processar Apple Pay',
  },
  es: {
    notAvailable: 'Apple Pay no está disponible en este dispositivo',
    processing: 'Procesando...',
    error: 'Error al procesar Apple Pay',
  },
  en: {
    notAvailable: 'Apple Pay is not available on this device',
    processing: 'Processing...',
    error: 'Error processing Apple Pay',
  },
}

export function ApplePayButton({
  checkoutId,
  amount,
  currency = 'EUR',
  countryCode = 'ES', // Espanha (Ibiza)
  onSuccess,
  onError,
  language = 'pt',
}: ApplePayButtonProps) {
  const [isAvailable, setIsAvailable] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Verificar se Apple Pay está disponível
    if (typeof window !== 'undefined' && window.ApplePaySession) {
      const canMakePayments = window.ApplePaySession.canMakePayments()
      setIsAvailable(canMakePayments)
    }
  }, [])

  const handleApplePay = async () => {
    if (!window.ApplePaySession) {
      setError(translations[language].notAvailable)
      return
    }

    try {
      setIsProcessing(true)
      setError(null)

      // 1. Criar Apple Payment Request
      const paymentRequest = {
        countryCode,
        currencyCode: currency,
        merchantCapabilities: ['supports3DS'],
        supportedNetworks: ['masterCard', 'visa', 'amex'],
        total: {
          label: 'Sofia Gastrobar',
          amount: amount.toFixed(2),
          type: 'final' as const,
        },
      }

      // 2. Criar sessão Apple Pay
      const session = new window.ApplePaySession(3, paymentRequest)

      // 3. Handler para validar merchant
      session.onvalidatemerchant = async (event: any) => {
        try {
          const response = await fetch('/api/sumup/apple-pay-session', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              checkoutId,
              validateUrl: event.validationURL,
              context: window.location.hostname,
            }),
          })

          const data = await response.json()

          if (!response.ok) {
            throw new Error(data.error || 'Erro ao validar merchant')
          }

          // 4. Completar validação
          session.completeMerchantValidation(data.merchantSession)
        } catch (err) {
          session.abort()
          const errorMessage = err instanceof Error ? err.message : translations[language].error
          setError(errorMessage)
          onError?.(errorMessage)
          setIsProcessing(false)
        }
      }

      // 5. Handler para autorização de pagamento
      session.onpaymentauthorized = async (event: any) => {
        try {
          // 6. Processar checkout com token Apple Pay
          const response = await fetch('/api/sumup/apple-pay', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              checkoutId,
              applePayToken: event.payment,
            }),
          })

          const data = await response.json()

          if (!response.ok) {
            throw new Error(data.error || 'Erro ao processar pagamento')
          }

          // 7. Completar pagamento
          if (data.checkout.status === 'PAID') {
            session.completePayment(window.ApplePaySession.STATUS_SUCCESS)
            onSuccess?.()
          } else {
            session.completePayment(window.ApplePaySession.STATUS_FAILURE)
            throw new Error('Pagamento não foi concluído')
          }
        } catch (err) {
          session.completePayment(window.ApplePaySession.STATUS_FAILURE)
          const errorMessage = err instanceof Error ? err.message : translations[language].error
          setError(errorMessage)
          onError?.(errorMessage)
        } finally {
          setIsProcessing(false)
        }
      }

      // 8. Iniciar sessão
      session.begin()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : translations[language].error
      setError(errorMessage)
      onError?.(errorMessage)
      setIsProcessing(false)
    }
  }

  const t = translations[language]

  if (!isAvailable) {
    return null // Não mostrar botão se não estiver disponível
  }

  return (
    <div className="space-y-2">
      <button
        onClick={handleApplePay}
        disabled={isProcessing}
        className="w-full bg-black text-white rounded-lg py-3 px-4 flex items-center justify-center gap-2 hover:bg-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        style={{
          // Estilo Apple Pay oficial
          WebkitAppearance: '-apple-pay-button' as any,
          appearance: '-apple-pay-button' as any,
        }}
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>{t.processing}</span>
          </>
        ) : (
          <span>Apple Pay</span>
        )}
      </button>

      {error && (
        <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400" />
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}
    </div>
  )
}

