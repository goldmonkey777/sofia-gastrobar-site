/**
 * Página de Confirmação de Delivery
 * Exibe status após pagamento
 */

'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { PaymentStatus } from '@/components/payment/PaymentStatus'
import { Home } from 'lucide-react'
import Link from 'next/link'

function DeliveryConfirmacaoContent() {
  const searchParams = useSearchParams()
  const deliveryId = searchParams.get('delivery_id')
  const paymentStatus = searchParams.get('status') || 'pending'
  
  const [status, setStatus] = useState<'pending' | 'paid' | 'failed' | 'expired' | 'cancelled'>(
    paymentStatus as any || 'pending'
  )

  useEffect(() => {
    // Verificar status do pagamento periodicamente
    if (deliveryId && status === 'pending') {
      const interval = setInterval(async () => {
        try {
          const response = await fetch(`/api/delivery/${deliveryId}/status`)
          const data = await response.json()
          
          if (data.status === 'paid') {
            setStatus('paid')
            clearInterval(interval)
          } else if (data.status === 'failed' || data.status === 'cancelled') {
            setStatus(data.status)
            clearInterval(interval)
          }
        } catch (error) {
          console.error('Erro ao verificar status:', error)
        }
      }, 3000) // Verificar a cada 3 segundos

      return () => clearInterval(interval)
    }
  }, [deliveryId, status])

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        <PaymentStatus 
          status={status}
          message={
            status === 'paid' 
              ? 'Seu pedido foi confirmado e será preparado em breve. Você receberá atualizações por WhatsApp.'
              : undefined
          }
        />

        {status === 'paid' && (
          <div className="mt-8 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-bold py-3 px-6 rounded-xl hover:from-yellow-400 hover:to-yellow-500 transition-all"
            >
              <Home className="w-5 h-5" />
              Voltar ao Início
            </Link>
          </div>
        )}

        {status === 'failed' && (
          <div className="mt-8 text-center">
            <Link
              href="/delivery"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-bold py-3 px-6 rounded-xl hover:from-yellow-400 hover:to-yellow-500 transition-all"
            >
              Tentar Novamente
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default function DeliveryConfirmacaoPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black flex items-center justify-center">
        <div className="text-white">Carregando...</div>
      </div>
    }>
      <DeliveryConfirmacaoContent />
    </Suspense>
  )
}

