import { NextRequest, NextResponse } from 'next/server'
import {
  createTableOrder,
  getTableOrder,
  getTableOrdersByTable,
  updateTableOrderStatus,
} from '@/lib/db/mock'
import type { CreateTableOrderInput } from '@/lib/db/types'
import { isValidTableId } from '@/lib/tables'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validação básica
    if (!body.tableId || !body.items) {
      return NextResponse.json(
        { error: 'Campos obrigatórios: tableId, items' },
        { status: 400 }
      )
    }

    // Validar mesa
    if (!isValidTableId(body.tableId)) {
      return NextResponse.json(
        { error: `Mesa "${body.tableId}" não encontrada` },
        { status: 404 }
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

    const input: CreateTableOrderInput = {
      tableId: body.tableId.trim(),
      items: body.items.map((item: any) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        notes: item.notes?.trim(),
      })),
      notes: body.notes?.trim(),
    }

    const order = await createTableOrder(input)

    // TODO: Enviar para ChefIApp OS
    // TODO: Notificar cozinha
    // TODO: Atualizar status da mesa

    return NextResponse.json({
      success: true,
      message: 'Pedido criado com sucesso!',
      order,
    })
  } catch (error) {
    console.error('Error creating table order:', error)
    return NextResponse.json(
      { error: 'Erro ao criar pedido', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const orderId = searchParams.get('id')
    const tableId = searchParams.get('tableId')

    if (orderId) {
      const order = await getTableOrder(orderId)
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

    if (tableId) {
      if (!isValidTableId(tableId)) {
        return NextResponse.json(
          { error: `Mesa "${tableId}" não encontrada` },
          { status: 404 }
        )
      }
      const orders = await getTableOrdersByTable(tableId)
      return NextResponse.json({
        success: true,
        tableId,
        orders,
        count: orders.length,
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Use ?id=ORDER_ID ou ?tableId=TABLE_ID para buscar pedidos',
    })
  } catch (error) {
    console.error('Error fetching table orders:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar pedidos', message: error instanceof Error ? error.message : 'Unknown error' },
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

    const validStatuses = ['pending', 'confirmed', 'preparing', 'ready', 'served', 'paid', 'cancelled']
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: `Status inválido. Status válidos: ${validStatuses.join(', ')}` },
        { status: 400 }
      )
    }

    const order = await updateTableOrderStatus(id, status)
    if (!order) {
      return NextResponse.json(
        { error: 'Pedido não encontrado' },
        { status: 404 }
      )
    }

    // TODO: Notificar cliente quando status mudar (WebSocket/SSE)

    return NextResponse.json({
      success: true,
      message: 'Status do pedido atualizado',
      order,
    })
  } catch (error) {
    console.error('Error updating table order:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar pedido', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

