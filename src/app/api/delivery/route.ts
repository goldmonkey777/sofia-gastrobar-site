import { NextRequest, NextResponse } from 'next/server'
import { createDeliveryOrder, getDeliveryOrder, updateDeliveryOrderStatus } from '@/lib/db/mock'
import type { CreateDeliveryOrderInput } from '@/lib/db/types'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validação básica
    if (!body.customerName || !body.customerPhone || !body.address || !body.zone || !body.items) {
      return NextResponse.json(
        { error: 'Campos obrigatórios: customerName, customerPhone, address, zone, items' },
        { status: 400 }
      )
    }

    // Validar items
    if (!Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json(
        { error: 'Items deve ser um array não vazio' },
        { status: 400 }
      )
    }

    // Validar cada item
    for (const item of body.items) {
      if (!item.id || !item.name || typeof item.price !== 'number' || typeof item.quantity !== 'number') {
        return NextResponse.json(
          { error: 'Cada item deve ter: id, name, price (number), quantity (number)' },
          { status: 400 }
        )
      }
      if (item.quantity < 1) {
        return NextResponse.json(
          { error: 'Quantidade deve ser maior que 0' },
          { status: 400 }
        )
      }
    }

    // Validar zona
    const validZones = ['sant-antoni', 'ibiza-town', 'san-jose', 'santa-eulalia', 'other']
    if (!validZones.includes(body.zone)) {
      return NextResponse.json(
        { error: `Zona inválida. Zonas válidas: ${validZones.join(', ')}` },
        { status: 400 }
      )
    }

    // Validar deliveryTime
    if (body.deliveryTime === 'scheduled' && !body.scheduledTime) {
      return NextResponse.json(
        { error: 'scheduledTime é obrigatório quando deliveryTime é "scheduled"' },
        { status: 400 }
      )
    }

    const input: CreateDeliveryOrderInput = {
      customerName: body.customerName.trim(),
      customerPhone: body.customerPhone.trim(),
      customerEmail: body.customerEmail?.trim().toLowerCase(),
      address: body.address.trim(),
      zone: body.zone,
      items: body.items.map((item: any) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        notes: item.notes?.trim(),
      })),
      deliveryTime: body.deliveryTime || 'now',
      scheduledTime: body.scheduledTime,
      notes: body.notes?.trim(),
    }

    const order = await createDeliveryOrder(input)

    // TODO: Enviar para ChefIApp OS
    // TODO: Gerar link de pagamento SumUp
    // TODO: Enviar confirmação via WhatsApp

    return NextResponse.json({
      success: true,
      message: 'Pedido de delivery criado com sucesso!',
      order,
    })
  } catch (error) {
    console.error('Error creating delivery order:', error)
    return NextResponse.json(
      { error: 'Erro ao criar pedido de delivery', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const orderId = searchParams.get('id')

    if (orderId) {
      const order = await getDeliveryOrder(orderId)
      if (!order) {
        return NextResponse.json(
          { error: 'Pedido não encontrado' },
          { status: 404 }
        )
      }
      return NextResponse.json({
        success: true,
        order,
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Use ?id=ORDER_ID para buscar um pedido específico',
    })
  } catch (error) {
    console.error('Error fetching delivery order:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar pedido', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, status } = body

    if (!id || !status) {
      return NextResponse.json(
        { error: 'Campos obrigatórios: id, status' },
        { status: 400 }
      )
    }

    const validStatuses = ['pending', 'confirmed', 'preparing', 'out-for-delivery', 'delivered', 'cancelled']
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: `Status inválido. Status válidos: ${validStatuses.join(', ')}` },
        { status: 400 }
      )
    }

    const order = await updateDeliveryOrderStatus(id, status)
    if (!order) {
      return NextResponse.json(
        { error: 'Pedido não encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Status do pedido atualizado',
      order,
    })
  } catch (error) {
    console.error('Error updating delivery order:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar pedido', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

