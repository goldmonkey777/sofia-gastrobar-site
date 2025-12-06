/**
 * API Route para processar checkout com Apple Pay (integração direta)
 * Documentação: https://developer.sumup.com/online-payments/apm/apple-pay
 */

import { NextRequest, NextResponse } from 'next/server'
import { processCheckoutWithApplePay } from '@/modules/sumup-integration/lib/sumup'
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
    const { checkoutId, applePayToken } = body

    if (!checkoutId || !applePayToken) {
      return NextResponse.json(
        { success: false, error: 'checkoutId e applePayToken são obrigatórios' },
        { status: 400 }
      )
    }

    const processed = await processCheckoutWithApplePay({
      checkoutId,
      applePayToken,
    })

    return NextResponse.json({ 
      success: true, 
      checkout: processed 
    })
  } catch (error: any) {
    console.error('Erro ao processar Apple Pay:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

