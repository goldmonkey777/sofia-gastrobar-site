/**
 * Página de Confirmação de Pagamento da Mesa
 * Exibe status após pagamento da conta
 */

'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useParams } from 'next/navigation'
import { PaymentStatus } from '@/components/payment/PaymentStatus'
import { Home, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { useLanguage } from '@/hooks/useLanguage'
import { translate } from '@/lib/i18n'

function MesaPagoContent() {
  const params = useParams()
  const searchParams = useSearchParams()
  const tableId = params.id as string
  const orderId = searchParams.get('order_id')
  const paymentStatus = searchParams.get('status') || 'pending'
  const { language } = useLanguage()
  
  const [status, setStatus] = useState<'pending' | 'paid' | 'failed' | 'expired' | 'cancelled'>(
    paymentStatus as any || 'pending'
  )

  useEffect(() => {
    // Verificar status do pagamento periodicamente
    if (orderId && status === 'pending') {
      const interval = setInterval(async () => {
        try {
          // Verificar status via API (se implementado)
          // Por enquanto, usar o status da URL
          if (paymentStatus === 'paid') {
            setStatus('paid')
            clearInterval(interval)
          }
        } catch (error) {
          console.error('Erro ao verificar status:', error)
        }
      }, 3000) // Verificar a cada 3 segundos

      return () => clearInterval(interval)
    }
  }, [orderId, status, paymentStatus])

  const translations = {
    paidMessage: {
      pt: 'Pagamento confirmado! Sua conta foi paga com sucesso. Obrigado!',
      es: '¡Pago confirmado! Su cuenta ha sido pagada con éxito. ¡Gracias!',
      en: 'Payment confirmed! Your bill has been paid successfully. Thank you!',
    },
    backToTable: {
      pt: 'Voltar à Mesa',
      es: 'Volver a la Mesa',
      en: 'Back to Table',
    },
    backToHome: {
      pt: 'Voltar ao Início',
      es: 'Volver al Inicio',
      en: 'Back to Home',
    },
    tryAgain: {
      pt: 'Tentar Novamente',
      es: 'Intentar de Nuevo',
      en: 'Try Again',
    },
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        <PaymentStatus 
          status={status}
          message={
            status === 'paid' 
              ? translate(translations.paidMessage, language)
              : undefined
          }
        />

        {status === 'paid' && (
          <div className="mt-8 space-y-4 text-center">
            {tableId && (
              <Link
                href={`/mesa/${tableId}`}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-bold py-3 px-6 rounded-xl hover:from-yellow-400 hover:to-yellow-500 transition-all"
              >
                <CheckCircle className="w-5 h-5" />
                {translate(translations.backToTable, language)}
              </Link>
            )}
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-6 rounded-xl transition-all ml-4"
            >
              <Home className="w-5 h-5" />
              {translate(translations.backToHome, language)}
            </Link>
          </div>
        )}

        {status === 'failed' && (
          <div className="mt-8 text-center">
            <Link
              href={`/mesa/${tableId}`}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-bold py-3 px-6 rounded-xl hover:from-yellow-400 hover:to-yellow-500 transition-all"
            >
              {translate(translations.tryAgain, language)}
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default function MesaPagoPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black flex items-center justify-center">
        <div className="text-white">Carregando...</div>
      </div>
    }>
      <MesaPagoContent />
    </Suspense>
  )
}

