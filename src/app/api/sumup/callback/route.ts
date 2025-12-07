/**
 * SumUp Payment Callback Endpoint
 * Handles redirect after payment completion
 *
 * Este endpoint é chamado quando:
 * 1. Cliente completa pagamento no SumUp (redirect_url)
 * 2. Deep link retorna para o site (callbackSuccess/callbackFail)
 *
 * URL: https://sofiagastrobaribiza.com/api/sumup/callback
 */

import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)

  // Parâmetros possíveis:
  // - success: true/false (do deep link)
  // - txcode: transaction code (iOS deep link)
  // - foreign-tx-id: ID customizado (geralmente res_XXXXX)
  // - smp-status: success/failed (Android deep link)
  // - smp-tx-code: transaction code (Android)
  // - reservation_id: ID da reserva (nosso parâmetro customizado)
  // - delivery_id: ID do pedido delivery (nosso parâmetro customizado)

  const success = searchParams.get('success') === 'true'
  const txcode = searchParams.get('txcode')
  const foreignTxId = searchParams.get('foreign-tx-id')
  const reservationId = searchParams.get('reservation_id')
  const deliveryId = searchParams.get('delivery_id')

  // Android callback params
  const smpStatus = searchParams.get('smp-status')
  const smpTxCode = searchParams.get('smp-tx-code')

  // Determinar sucesso (iOS ou Android)
  const isSuccess = success || smpStatus === 'success'
  const transactionCode = txcode || smpTxCode

  console.log('SumUp Callback:', {
    success: isSuccess,
    transactionCode,
    foreignTxId,
    reservationId,
    deliveryId,
  })

  try {
    // Se for uma reserva
    if (reservationId) {
      if (isSuccess) {
        // Atualizar status da reserva para 'paid'
        const { error } = await supabase
          .from('reservations')
          .update({
            payment_status: 'paid',
            transaction_code: transactionCode,
            updated_at: new Date().toISOString(),
          })
          .eq('id', reservationId)

        if (error) {
          console.error('Erro ao atualizar reserva:', error)
          return NextResponse.redirect(
            new URL(`/reservas/confirmacao?status=failed&reservation_id=${reservationId}`, request.url)
          )
        }

        // Redirecionar para página de confirmação
        return NextResponse.redirect(
          new URL(`/reservas/confirmacao?status=paid&reservation_id=${reservationId}`, request.url)
        )
      } else {
        // Pagamento falhou
        return NextResponse.redirect(
          new URL(`/reservas/confirmacao?status=failed&reservation_id=${reservationId}`, request.url)
        )
      }
    }

    // Se for um pedido delivery
    if (deliveryId) {
      if (isSuccess) {
        // Atualizar status do pedido para 'paid'
        const { error } = await supabase
          .from('delivery_orders')
          .update({
            payment_status: 'paid',
            transaction_code: transactionCode,
            updated_at: new Date().toISOString(),
          })
          .eq('id', deliveryId)

        if (error) {
          console.error('Erro ao atualizar pedido delivery:', error)
          return NextResponse.redirect(
            new URL(`/delivery/confirmacao?status=failed&order_id=${deliveryId}`, request.url)
          )
        }

        // Redirecionar para página de confirmação
        return NextResponse.redirect(
          new URL(`/delivery/confirmacao?status=paid&order_id=${deliveryId}`, request.url)
        )
      } else {
        // Pagamento falhou
        return NextResponse.redirect(
          new URL(`/delivery/confirmacao?status=failed&order_id=${deliveryId}`, request.url)
        )
      }
    }

    // Se não tiver reservationId nem deliveryId, tentar recuperar pelo foreign_tx_id
    if (foreignTxId) {
      // Foreign TX ID format: res_123 ou del_456
      const [type, id] = foreignTxId.split('_')

      if (type === 'res') {
        return NextResponse.redirect(
          new URL(
            `/reservas/confirmacao?status=${isSuccess ? 'paid' : 'failed'}&reservation_id=${id}`,
            request.url
          )
        )
      }

      if (type === 'del') {
        return NextResponse.redirect(
          new URL(
            `/delivery/confirmacao?status=${isSuccess ? 'paid' : 'failed'}&order_id=${id}`,
            request.url
          )
        )
      }
    }

    // Fallback genérico
    return NextResponse.redirect(
      new URL(
        `/?payment=${isSuccess ? 'success' : 'failed'}`,
        request.url
      )
    )
  } catch (error) {
    console.error('Erro no callback SumUp:', error)

    // Redirecionar para home com erro
    return NextResponse.redirect(
      new URL('/?payment=error', request.url)
    )
  }
}

// Permitir POST também (caso SumUp envie POST)
export async function POST(request: Request) {
  return GET(request)
}
