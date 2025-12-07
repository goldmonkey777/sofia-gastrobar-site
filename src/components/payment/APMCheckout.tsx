/**
 * Componente para processar checkout com APM (Apple Pay, Google Pay, etc.)
 * Lida com redirect flows e artifact flows
 */

'use client'

import { useState } from 'react'
import { Loader2, AlertCircle, CheckCircle, QrCode, ExternalLink } from 'lucide-react'
import { motion } from 'framer-motion'

interface APMCheckoutProps {
  checkoutId: string
  paymentType: string
  personalDetails?: {
    email?: string
    first_name?: string
    last_name?: string
    country?: string
  }
  onSuccess?: () => void
  onError?: (error: string) => void
  language?: 'pt' | 'es' | 'en'
}

const translations = {
  pt: {
    processing: 'Processando pagamento...',
    redirecting: 'Redirecionando...',
    success: 'Pagamento processado com sucesso!',
    error: 'Erro ao processar pagamento',
    pixCode: 'Código PIX',
    pixQR: 'QR Code PIX',
    boletoCode: 'Código de Barras',
    boletoInvoice: 'Boleto',
    validUntil: 'Válido até',
    copyCode: 'Copiar código',
    openInvoice: 'Abrir boleto',
    viewQR: 'Ver QR Code',
  },
  es: {
    processing: 'Procesando pago...',
    redirecting: 'Redirigiendo...',
    success: '¡Pago procesado con éxito!',
    error: 'Error al procesar el pago',
    pixCode: 'Código PIX',
    pixQR: 'QR Code PIX',
    boletoCode: 'Código de Barras',
    boletoInvoice: 'Boleto',
    validUntil: 'Válido hasta',
    copyCode: 'Copiar código',
    openInvoice: 'Abrir boleto',
    viewQR: 'Ver QR Code',
  },
  en: {
    processing: 'Processing payment...',
    redirecting: 'Redirecting...',
    success: 'Payment processed successfully!',
    error: 'Error processing payment',
    pixCode: 'PIX Code',
    pixQR: 'PIX QR Code',
    boletoCode: 'Barcode',
    boletoInvoice: 'Invoice',
    validUntil: 'Valid until',
    copyCode: 'Copy code',
    openInvoice: 'Open invoice',
    viewQR: 'View QR Code',
  },
}

export function APMCheckout({
  checkoutId,
  paymentType,
  personalDetails,
  onSuccess,
  onError,
  language = 'pt',
}: APMCheckoutProps) {
  const [processing, setProcessing] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const processPayment = async () => {
    try {
      setProcessing(true)
      setError(null)

      const response = await fetch('/api/sumup/process-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          checkoutId,
          paymentType,
          personalDetails,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || translations[language].error)
      }

      setResult(data.checkout)

      // Se tem next_step, é redirect flow
      if (data.checkout.next_step) {
        handleRedirect(data.checkout.next_step)
      } else if (data.checkout.status === 'PAID') {
        // Pagamento já foi concluído
        onSuccess?.()
      }
      // Se tem pix, boleto, qr_code_pix, é artifact flow (já está no result)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : translations[language].error
      setError(errorMessage)
      onError?.(errorMessage)
    } finally {
      setProcessing(false)
    }
  }

  const handleRedirect = (nextStep: { url: string; method: string; payload?: any }) => {
    if (nextStep.method === 'GET') {
      window.location.href = nextStep.url
    } else if (nextStep.method === 'POST') {
      // Criar form e submeter
      const form = document.createElement('form')
      form.method = 'POST'
      form.action = nextStep.url
      
      if (nextStep.payload) {
        Object.entries(nextStep.payload).forEach(([key, value]) => {
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
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    // TODO: Mostrar toast de sucesso
  }

  const t = translations[language]

  // Se ainda não processou, mostrar botão
  if (!result && !processing) {
    return (
      <button
        onClick={processPayment}
        className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-bold py-4 px-8 rounded-xl hover:from-yellow-400 hover:to-yellow-500 transition-all shadow-lg shadow-yellow-500/20"
      >
        {t.processing}
      </button>
    )
  }

  // Processando
  if (processing) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-6 h-6 animate-spin text-yellow-400" />
        <span className="ml-2 text-white/70">{t.processing}</span>
      </div>
    )
  }

  // Erro
  if (error) {
    return (
      <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 flex items-center gap-3">
        <AlertCircle className="w-5 h-5 text-red-400" />
        <p className="text-red-400 text-sm">{error}</p>
      </div>
    )
  }

  // Redirect flow
  if (result.next_step) {
    return (
      <div className="bg-blue-500/20 border border-blue-500/50 rounded-lg p-4">
        <div className="flex items-center gap-3 mb-2">
          <ExternalLink className="w-5 h-5 text-blue-400" />
          <p className="text-blue-400 font-semibold">{t.redirecting}</p>
        </div>
        <p className="text-white/70 text-sm">
          Você será redirecionado para finalizar o pagamento...
        </p>
      </div>
    )
  }

  // Artifact flow - PIX
  if (result.pix) {
    const code = result.pix.artefacts.find((a: any) => a.name === 'code')
    const qrCode = result.pix.artefacts.find((a: any) => a.name === 'barcode')

    return (
      <div className="space-y-4">
        <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4">
          <div className="flex items-center gap-3 mb-3">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <p className="text-green-400 font-semibold">{t.pixQR}</p>
          </div>
          
          {qrCode && (
            <div className="mb-4">
              <img 
                src={qrCode.location} 
                alt="QR Code PIX" 
                className="w-full max-w-xs mx-auto rounded-lg"
              />
            </div>
          )}
          
          {code && (
            <div className="space-y-2">
              <p className="text-white/70 text-sm">{t.pixCode}:</p>
              <div className="bg-black/30 rounded-lg p-3 flex items-center justify-between">
                <code className="text-white text-xs break-all">{code.content}</code>
                <button
                  onClick={() => copyToClipboard(code.content)}
                  className="ml-2 text-yellow-400 hover:text-yellow-300 text-sm"
                >
                  {t.copyCode}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Artifact flow - Boleto
  if (result.boleto) {
    const code = result.boleto.artefacts.find((a: any) => a.name === 'code')
    const invoice = result.boleto.artefacts.find((a: any) => a.name === 'invoice')

    return (
      <div className="space-y-4">
        <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-4">
          <div className="flex items-center gap-3 mb-3">
            <CheckCircle className="w-5 h-5 text-yellow-400" />
            <p className="text-yellow-400 font-semibold">{t.boletoInvoice}</p>
          </div>
          
          {code && (
            <div className="mb-4 space-y-2">
              <p className="text-white/70 text-sm">{t.boletoCode}:</p>
              <div className="bg-black/30 rounded-lg p-3 flex items-center justify-between">
                <code className="text-white text-xs break-all">{code.content}</code>
                <button
                  onClick={() => copyToClipboard(code.content)}
                  className="ml-2 text-yellow-400 hover:text-yellow-300 text-sm"
                >
                  {t.copyCode}
                </button>
              </div>
            </div>
          )}
          
          {invoice && (
            <a
              href={invoice.location}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-yellow-400 hover:text-yellow-300 text-sm"
            >
              <ExternalLink className="w-4 h-4" />
              {t.openInvoice}
            </a>
          )}
          
          {result.boleto.valid_until && (
            <p className="text-white/50 text-xs mt-3">
              {t.validUntil}: {new Date(result.boleto.valid_until).toLocaleString(language)}
            </p>
          )}
        </div>
      </div>
    )
  }

  // Pagamento concluído
  if (result.status === 'PAID') {
    return (
      <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4 flex items-center gap-3">
        <CheckCircle className="w-5 h-5 text-green-400" />
        <p className="text-green-400 font-semibold">{t.success}</p>
      </div>
    )
  }

  return null
}

