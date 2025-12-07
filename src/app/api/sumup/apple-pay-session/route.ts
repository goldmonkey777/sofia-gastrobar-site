/**
 * API Route para criar sessão de validação do Apple Pay
 * Documentação: https://developer.sumup.com/online-payments/apm/apple-pay
 */

import { NextRequest, NextResponse } from 'next/server'
import { createApplePaySession } from '@/modules/sumup-integration/lib/sumup'
import { isSumUpConfigured } from '@/modules/sumup-integration/lib/sumup'

export async function PUT(request: NextRequest) {
  try {
    if (!isSumUpConfigured()) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'SUMUP_NOT_CONFIGURED',
          message: 'SumUp não está configurado.'
        },
        { status: 503 }
      )
    }

    const body = await request.json()
    const { checkoutId, validateUrl, context } = body

    if (!checkoutId || !validateUrl || !context) {
      return NextResponse.json(
        { success: false, error: 'checkoutId, validateUrl e context são obrigatórios' },
        { status: 400 }
      )
    }

    const session = await createApplePaySession(checkoutId, validateUrl, context)

    return NextResponse.json({ 
      success: true, 
      merchantSession: session.merchantSession 
    })
  } catch (error: any) {
    console.error('Erro ao criar sessão Apple Pay:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

