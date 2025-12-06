/**
 * API Route para criar links de pagamento SumUp
 */

import { NextRequest, NextResponse } from 'next/server'
import { createPaymentLink, createReservationPaymentLink, createTablePaymentLink, createDeliveryPaymentLink } from '@/modules/sumup-integration/lib/sumup'

import { isSumUpConfigured } from '@/modules/sumup-integration/lib/sumup'

export async function POST(request: NextRequest) {
  try {
    // Verificar se SumUp está configurado
    if (!isSumUpConfigured()) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'SUMUP_NOT_CONFIGURED',
          message: 'SumUp não está configurado. Configure as variáveis de ambiente SUMUP_CLIENT_ID, SUMUP_CLIENT_SECRET e SUMUP_ACCESS_TOKEN ou SUMUP_MERCHANT_CODE.'
        },
        { status: 503 }
      )
    }

    const body = await request.json()
    const { type, ...params } = body

    let paymentLink

    switch (type) {
      case 'reservation':
        paymentLink = await createReservationPaymentLink(
          params.reservationId,
          params.numberOfPeople,
          params.date,
          params.time
        )
        break

      case 'table':
        paymentLink = await createTablePaymentLink(
          params.tableId,
          params.orderId,
          params.totalAmount
        )
        break

      case 'delivery':
        paymentLink = await createDeliveryPaymentLink(
          params.deliveryId,
          params.totalAmount,
          params.deliveryFee
        )
        break

      default:
        paymentLink = await createPaymentLink({
          amount: params.amount,
          currency: params.currency || 'EUR',
          description: params.description,
          redirectUrl: params.redirectUrl,
          expiresIn: params.expiresIn || 3600,
          reference: params.reference,
        })
    }

    return NextResponse.json({ success: true, paymentLink })
  } catch (error: any) {
    console.error('Erro ao criar link de pagamento:', error)
    
    // Tratar erro específico de configuração
    if (error.message === 'SUMUP_NOT_CONFIGURED') {
      return NextResponse.json(
        { 
          success: false, 
          error: 'SUMUP_NOT_CONFIGURED',
          message: 'SumUp não está configurado. Configure as variáveis de ambiente.'
        },
        { status: 503 }
      )
    }

    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

