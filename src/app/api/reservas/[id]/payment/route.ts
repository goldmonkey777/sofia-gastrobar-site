/**
 * API Route para atualizar status de pagamento da reserva
 */

import { NextRequest, NextResponse } from 'next/server'
import { updateReservationPayment } from '@/lib/db/mock'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { status, prepaidAmount, paymentLinkId } = body

    const reservation = await updateReservationPayment(
      id,
      status,
      prepaidAmount,
      paymentLinkId
    )

    if (!reservation) {
      return NextResponse.json(
        { error: 'Reserva não encontrada' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, reservation })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

