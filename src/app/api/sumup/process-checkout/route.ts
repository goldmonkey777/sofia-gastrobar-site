/**
 * API Route para processar checkout com método de pagamento específico
 * Suporta Apple Pay, Google Pay e outros APMs
 * Documentação: https://developer.sumup.com/online-payments/apm/integration-guide
 */

import { NextRequest, NextResponse } from 'next/server'
import { processCheckout } from '@/modules/sumup-integration/lib/sumup'
import { isSumUpConfigured } from '@/modules/sumup-integration/lib/sumup'

export async function POST(request: NextRequest) {
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
    const { checkoutId, paymentType, personalDetails } = body

    if (!checkoutId || !paymentType) {
      return NextResponse.json(
        { success: false, error: 'checkoutId e paymentType são obrigatórios' },
        { status: 400 }
      )
    }

    const processed = await processCheckout({
      checkoutId,
      paymentType,
      personalDetails,
    })

    return NextResponse.json({ 
      success: true, 
      checkout: processed 
    })
  } catch (error: any) {
    console.error('Erro ao processar checkout:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

