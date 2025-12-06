/**
 * API Route para verificar status da reserva
 */

import { NextRequest, NextResponse } from 'next/server'
import { getReservationById } from '@/lib/db/mock'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const reservation = getReservationById(id)

    if (!reservation) {
      return NextResponse.json(
        { error: 'Reserva não encontrada' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      id: reservation.id,
      status: reservation.paymentStatus || reservation.status,
      prepaidAmount: reservation.prepaidAmount || 0,
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

