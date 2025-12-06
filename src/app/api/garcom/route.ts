import { NextRequest, NextResponse } from 'next/server'
import { isValidTableId } from '@/lib/tables'

// Simulated database/state (in production, use real database)
const calls: Record<string, { tableId: string; action: string; timestamp: number }[]> = {}

// Tipos para as ações permitidas
type Action = 'call' | 'bill'

interface RequestBody {
  tableId: string
  action: Action
}

/**
 * Valida o corpo da requisição
 */
function validateRequest(body: unknown): { valid: boolean; error?: string; data?: RequestBody } {
  if (!body || typeof body !== 'object') {
    return { valid: false, error: 'Request body is required' }
  }

  const { tableId, action } = body as Partial<RequestBody>

  if (!tableId || typeof tableId !== 'string' || tableId.trim() === '') {
    return { valid: false, error: 'tableId is required and must be a non-empty string' }
  }

  if (!action || typeof action !== 'string' || !['call', 'bill'].includes(action)) {
    return { valid: false, error: 'action is required and must be either "call" or "bill"' }
  }

  if (!isValidTableId(tableId)) {
    return { valid: false, error: `Table with id "${tableId}" not found` }
  }

  return { valid: true, data: { tableId: tableId.trim(), action: action as Action } }
}

export async function POST(request: NextRequest) {
  try {
    let body: unknown
    try {
      body = await request.json()
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      )
    }

    const validation = validateRequest(body)
    if (!validation.valid || !validation.data) {
      return NextResponse.json(
        { error: validation.error || 'Invalid request' },
        { status: 400 }
      )
    }

    const { tableId, action } = validation.data

    // Store the call (in production, save to database)
    if (!calls[tableId]) {
      calls[tableId] = []
    }

    const callRecord = {
      tableId,
      action,
      timestamp: Date.now(),
    }

    calls[tableId].push(callRecord)

    // Log for debugging (in production, send notification to staff)
    const actionLabel = action === 'call' ? '🔔 Chamar garçom' : '💳 Pedir conta'
    console.log(`[Mesa ${tableId}] ${actionLabel} - ${new Date(callRecord.timestamp).toISOString()}`)

    return NextResponse.json({
      success: true,
      message: action === 'call' ? 'Garçom chamado com sucesso!' : 'Conta solicitada!',
      tableId,
      action,
      timestamp: callRecord.timestamp,
    })
  } catch (error) {
    console.error('Error processing request:', error)
    return NextResponse.json(
      { error: 'Internal server error', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const tableId = searchParams.get('tableId')

    // Se um tableId específico foi fornecido
    if (tableId) {
      if (!isValidTableId(tableId)) {
        return NextResponse.json(
          { error: `Table with id "${tableId}" not found` },
          { status: 404 }
        )
      }

      const tableCalls = calls[tableId] || []
      return NextResponse.json({
        tableId,
        calls: tableCalls,
        count: tableCalls.length,
      })
    }

    // Retorna estatísticas gerais
    const allCalls = Object.values(calls).flat()
    const tablesWithCalls = Object.keys(calls).filter(id => calls[id].length > 0)

    return NextResponse.json({
      totalCalls: allCalls.length,
      tablesWithCalls: tablesWithCalls.length,
      tables: tablesWithCalls,
      summary: tablesWithCalls.map(id => ({
        tableId: id,
        count: calls[id].length,
        lastCall: calls[id][calls[id].length - 1]?.timestamp || null,
      })),
    })
  } catch (error) {
    console.error('Error fetching calls:', error)
    return NextResponse.json(
      { error: 'Internal server error', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
