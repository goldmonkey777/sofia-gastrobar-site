/**
 * API Route para criar links de pagamento SumUp
 */

import { NextRequest, NextResponse } from 'next/server'
import { createPaymentLink, createReservationPaymentLink, createTablePaymentLink, createDeliveryPaymentLink } from '@/modules/sumup-integration/lib/sumup'

export async function POST(request: NextRequest) {
  try {
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
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

