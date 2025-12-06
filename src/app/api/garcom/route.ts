import { NextRequest, NextResponse } from 'next/server'

// Simulated database/state (in production, use real database)
const calls: Record<string, { tableId: string; action: string; timestamp: number }[]> = {}

export async function POST(request: NextRequest) {
  try {
    const { tableId, action } = await request.json()

    if (!tableId || !action) {
      return NextResponse.json(
        { error: 'Missing tableId or action' },
        { status: 400 }
      )
    }

    // Store the call (in production, save to database)
    if (!calls[tableId]) {
      calls[tableId] = []
    }

    calls[tableId].push({
      tableId,
      action,
      timestamp: Date.now(),
    })

    // Log for debugging (in production, send notification to staff)
    console.log(`[Mesa ${tableId}] ${action === 'call' ? '🔔 Chamar garçom' : '💳 Pedir conta'}`)

    return NextResponse.json({
      success: true,
      message: action === 'call' ? 'Garçom chamado com sucesso!' : 'Conta solicitada!',
      tableId,
      action,
    })
  } catch (error) {
    console.error('Error processing request:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const tableId = searchParams.get('tableId')

  if (tableId && calls[tableId]) {
    return NextResponse.json({
      calls: calls[tableId],
      count: calls[tableId].length,
    })
  }

  return NextResponse.json({
    totalCalls: Object.values(calls).flat().length,
    tables: Object.keys(calls),
  })
}
