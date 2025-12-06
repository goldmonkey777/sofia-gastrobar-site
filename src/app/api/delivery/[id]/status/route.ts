/**
 * API Route para verificar status do delivery
 */

import { NextRequest, NextResponse } from 'next/server'
import { getDeliveryOrder } from '@/lib/db/mock'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const order = await getDeliveryOrder(id)

    if (!order) {
      return NextResponse.json(
        { error: 'Pedido não encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      id: order.id,
      status: order.paymentStatus || order.status,
      total: order.total,
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

