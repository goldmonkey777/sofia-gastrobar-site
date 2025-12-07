/**
 * Componente para integração direta do Google Pay
 * Documentação: https://developer.sumup.com/online-payments/apm/google-pay
 */

'use client'

import { useState, useEffect } from 'react'
import { Loader2, AlertCircle } from 'lucide-react'
import Script from 'next/script'

interface GooglePayButtonProps {
  checkoutId: string
  amount: number
  currency?: string
  merchantCode: string
  merchantId?: string // Google Merchant ID (opcional)
  merchantName?: string
  onSuccess?: () => void
  onError?: (error: string) => void
  language?: 'pt' | 'es' | 'en'
}

// Google Pay types declarados em src/types/google-maps.d.ts

const translations = {
  pt: {
    notAvailable: 'Google Pay não está disponível',
    processing: 'Processando...',
    error: 'Erro ao processar Google Pay',
    loading: 'Carregando Google Pay...',
  },
  es: {
    notAvailable: 'Google Pay no está disponible',
    processing: 'Procesando...',
    error: 'Error al procesar Google Pay',
    loading: 'Cargando Google Pay...',
  },
  en: {
    notAvailable: 'Google Pay is not available',
    processing: 'Processing...',
    error: 'Error processing Google Pay',
    loading: 'Loading Google Pay...',
  },
}

export function GooglePayButton({
  checkoutId,
  amount,
  currency = 'EUR',
  merchantCode,
  merchantId,
  merchantName = 'Sofia Gastrobar',
  onSuccess,
  onError,
  language = 'pt',
}: GooglePayButtonProps) {
  const [isReady, setIsReady] = useState(false)
  const [isAvailable, setIsAvailable] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [paymentsClient, setPaymentsClient] = useState<any>(null)

  useEffect(() => {
    if (typeof window !== 'undefined' && window.google?.payments?.api) {
      initializeGooglePay()
    }
  }, [])

  const initializeGooglePay = () => {
    if (!window.google?.payments?.api) {
      setIsAvailable(false)
      setIsReady(true)
      return
    }

    try {
      const client = new window.google.payments.api.PaymentsClient({
        environment: 'PRODUCTION', // IMPORTANTE: usar PRODUCTION mesmo em testes
      })

      setPaymentsClient(client)

      // Verificar se está disponível
      client.isReadyToPay({
        apiVersion: 2,
        apiVersionMinor: 0,
        allowedPaymentMethods: [
          {
            type: 'CARD',
            parameters: {
              allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
              allowedCardNetworks: ['MASTERCARD', 'VISA'],
            },
          },
        ],
      }).then((response: any) => {
        setIsAvailable(response.result)
        setIsReady(true)
      }).catch(() => {
        setIsAvailable(false)
        setIsReady(true)
      })
    } catch (err) {
      console.error('Erro ao inicializar Google Pay:', err)
      setIsAvailable(false)
      setIsReady(true)
    }
  }

  const handleGooglePay = async () => {
    if (!paymentsClient || !isAvailable) {
      setError(translations[language].notAvailable)
      return
    }

    try {
      setIsProcessing(true)
      setError(null)

      // 1. Criar base request
      const baseRequest = {
        apiVersion: 2,
        apiVersionMinor: 0,
        merchantInfo: {
          ...(merchantId && { merchantId }),
          merchantName,
        },
        allowedPaymentMethods: [
          {
            type: 'CARD',
            parameters: {
              allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
              allowedCardNetworks: ['MASTERCARD', 'VISA'],
            },
            tokenizationSpecification: {
              type: 'PAYMENT_GATEWAY',
              parameters: {
                gateway: 'sumup',
                gatewayMerchantId: merchantCode,
              },
            },
          },
        ],
      }

      // 2. Criar payment data request
      const paymentDataRequest = {
        ...baseRequest,
        transactionInfo: {
          totalPriceStatus: 'FINAL',
          totalPriceLabel: 'Total',
          totalPrice: amount.toFixed(2),
          currencyCode: currency,
          countryCode: 'ES', // Espanha (Ibiza)
        },
      }

      // 3. Carregar payment data
      const paymentData = await paymentsClient.loadPaymentData(paymentDataRequest)

      // 4. Processar checkout com Google Pay
      const response = await fetch('/api/sumup/google-pay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          checkoutId,
          googlePayToken: paymentData,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao processar pagamento')
      }

      // 5. Verificar status
      if (data.checkout.status === 'PAID') {
        onSuccess?.()
      } else if (data.checkout.next_step) {
        // Redirect flow
        if (data.checkout.next_step.method === 'GET') {
          window.location.href = data.checkout.next_step.url
        } else if (data.checkout.next_step.method === 'POST') {
          // Criar form e submeter
          const form = document.createElement('form')
          form.method = 'POST'
          form.action = data.checkout.next_step.url
          
          if (data.checkout.next_step.payload) {
            Object.entries(data.checkout.next_step.payload).forEach(([key, value]) => {
              const input = document.createElement('input')
              input.type = 'hidden'
              input.name = key
              input.value = String(value)
              form.appendChild(input)
            })
          }
          
          document.body.appendChild(form)
          form.submit()
        }
      } else {
        throw new Error('Pagamento não foi concluído')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : translations[language].error
      setError(errorMessage)
      onError?.(errorMessage)
    } finally {
      setIsProcessing(false)
    }
  }

  const t = translations[language]

  return (
    <>
      {/* Carregar Google Pay API */}
      <Script
        src="https://pay.google.com/gp/p/js/pay.js"
        onLoad={() => {
          // Aguardar um pouco para garantir que a API está carregada
          setTimeout(() => {
            if (window.google?.payments?.api) {
              initializeGooglePay()
            }
          }, 100)
        }}
      />

      {!isReady && (
        <div className="flex items-center justify-center p-4">
          <Loader2 className="w-5 h-5 animate-spin text-yellow-400" />
          <span className="ml-2 text-white/70 text-sm">{t.loading}</span>
        </div>
      )}

      {isReady && isAvailable && (
        <div className="space-y-2">
          <button
            onClick={handleGooglePay}
            disabled={isProcessing}
            id="google-pay-button"
            className="w-full bg-white text-black rounded-lg py-3 px-4 flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>{t.processing}</span>
              </>
            ) : (
              <span>Google Pay</span>
            )}
          </button>

          {error && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400" />
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}
        </div>
      )}
    </>
  )
}

