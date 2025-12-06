/**
 * Página de Confirmação de Reserva
 * Exibe status após pagamento
 */

'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { PaymentStatus } from '@/components/payment/PaymentStatus'
import { CheckCircle, Home } from 'lucide-react'
import Link from 'next/link'

export default function ReservaConfirmacaoPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const reservationId = searchParams.get('reservation_id')
  const paymentStatus = searchParams.get('status') || 'pending'
  
  const [status, setStatus] = useState<'pending' | 'paid' | 'failed' | 'expired' | 'cancelled'>(
    paymentStatus as any || 'pending'
  )

  useEffect(() => {
    // Verificar status do pagamento periodicamente
    if (reservationId && status === 'pending') {
      const interval = setInterval(async () => {
        try {
          const response = await fetch(`/api/reservas/${reservationId}/status`)
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
  }, [reservationId, status])

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        <PaymentStatus 
          status={status}
          message={
            status === 'paid' 
              ? 'Sua reserva foi confirmada! Enviaremos uma confirmação por e-mail e WhatsApp em breve.'
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
              href="/reservas"
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

