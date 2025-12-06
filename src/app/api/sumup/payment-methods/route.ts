/**
 * API Route para obter métodos de pagamento disponíveis
 * Documentação: https://developer.sumup.com/online-payments/apm/integration-guide
 */

import { NextRequest, NextResponse } from 'next/server'
import { getAvailablePaymentMethods } from '@/modules/sumup-integration/lib/sumup'
import { isSumUpConfigured } from '@/modules/sumup-integration/lib/sumup'

export async function GET(request: NextRequest) {
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

    const { searchParams } = new URL(request.url)
    const checkoutId = searchParams.get('checkout_id')

    if (!checkoutId) {
      return NextResponse.json(
        { success: false, error: 'checkout_id é obrigatório' },
        { status: 400 }
      )
    }

    const paymentMethods = await getAvailablePaymentMethods(checkoutId)

    return NextResponse.json({ 
      success: true, 
      paymentMethods 
    })
  } catch (error: any) {
    console.error('Erro ao obter métodos de pagamento:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

