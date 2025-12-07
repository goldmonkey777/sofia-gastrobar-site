/**
 * API Route para processar checkout com Google Pay (integração direta)
 * Documentação: https://developer.sumup.com/online-payments/apm/google-pay
 */

import { NextRequest, NextResponse } from 'next/server'
import { processCheckoutWithGooglePay } from '@/modules/sumup-integration/lib/sumup'
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
    const { checkoutId, googlePayToken } = body

    if (!checkoutId || !googlePayToken) {
      return NextResponse.json(
        { success: false, error: 'checkoutId e googlePayToken são obrigatórios' },
        { status: 400 }
      )
    }

    const processed = await processCheckoutWithGooglePay({
      checkoutId,
      googlePayToken,
    })

    return NextResponse.json({ 
      success: true, 
      checkout: processed 
    })
  } catch (error: any) {
    console.error('Erro ao processar Google Pay:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

