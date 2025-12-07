/**
 * Componente para selecionar método de pagamento
 * Suporta Apple Pay, Google Pay e outros APMs
 */

'use client'

import { useState, useEffect } from 'react'
import { CreditCard, Smartphone, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'

interface PaymentMethod {
  id: string
  name: string
}

interface PaymentMethodSelectorProps {
  checkoutId: string
  onSelect: (methodId: string) => void
  onError?: (error: string) => void
  language?: 'pt' | 'es' | 'en'
}

const translations = {
  pt: {
    title: 'Escolha o método de pagamento',
    loading: 'Carregando métodos...',
    error: 'Erro ao carregar métodos de pagamento',
    applePay: 'Apple Pay',
    googlePay: 'Google Pay',
    card: 'Cartão de Crédito',
    paypal: 'PayPal',
  },
  es: {
    title: 'Elige el método de pago',
    loading: 'Cargando métodos...',
    error: 'Error al cargar métodos de pago',
    applePay: 'Apple Pay',
    googlePay: 'Google Pay',
    card: 'Tarjeta de Crédito',
    paypal: 'PayPal',
  },
  en: {
    title: 'Choose payment method',
    loading: 'Loading methods...',
    error: 'Error loading payment methods',
    applePay: 'Apple Pay',
    googlePay: 'Google Pay',
    card: 'Credit Card',
    paypal: 'PayPal',
  },
}

export function PaymentMethodSelector({
  checkoutId,
  onSelect,
  onError,
  language = 'pt',
}: PaymentMethodSelectorProps) {
  const [methods, setMethods] = useState<PaymentMethod[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadPaymentMethods()
  }, [checkoutId])

  const loadPaymentMethods = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/sumup/payment-methods?checkout_id=${checkoutId}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao carregar métodos')
      }

      setMethods(data.paymentMethods || [])
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : translations[language].error
      setError(errorMessage)
      onError?.(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const getMethodIcon = (methodId: string) => {
    switch (methodId) {
      case 'apple_pay':
        return '🍎'
      case 'google_pay':
        return '💳'
      case 'card':
        return <CreditCard className="w-5 h-5" />
      case 'paypal':
        return '💙'
      default:
        return <Smartphone className="w-5 h-5" />
    }
  }

  const getMethodName = (methodId: string, methodName: string) => {
    const t = translations[language]
    switch (methodId) {
      case 'apple_pay':
        return t.applePay
      case 'google_pay':
        return t.googlePay
      case 'card':
        return t.card
      case 'paypal':
        return t.paypal
      default:
        return methodName
    }
  }

  const t = translations[language]

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-6 h-6 animate-spin text-yellow-400" />
        <span className="ml-2 text-white/70">{t.loading}</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4">
        <p className="text-red-400 text-sm">{error}</p>
      </div>
    )
  }

  if (methods.length === 0) {
    return (
      <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-4">
        <p className="text-yellow-400 text-sm">
          Nenhum método de pagamento disponível no momento.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-bold text-white mb-4">{t.title}</h3>
      
      <div className="grid grid-cols-1 gap-3">
        {methods.map((method) => (
          <motion.button
            key={method.id}
            onClick={() => onSelect(method.id)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-4 flex items-center gap-4 transition-all"
          >
            <div className="text-2xl">
              {getMethodIcon(method.id)}
            </div>
            <div className="flex-1 text-left">
              <p className="text-white font-semibold">
                {getMethodName(method.id, method.name)}
              </p>
            </div>
            <div className="text-white/50">
              →
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  )
}

