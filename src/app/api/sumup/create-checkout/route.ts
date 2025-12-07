/**
 * API Route para criar checkout SumUp
 * Usado para Apple Pay, Google Pay e pagamentos diretos
 */

import { NextRequest, NextResponse } from 'next/server'
import { createPaymentLink } from '@/modules/sumup-integration/lib/sumup'
import { isSumUpConfigured } from '@/modules/sumup-integration/lib/sumup'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { amount, currency, description, redirect_url, reference } = body

    if (!amount || !description) {
      return NextResponse.json(
        { success: false, error: 'amount e description são obrigatórios' },
        { status: 400 }
      )
    }

    // Debug: verificar configuração do SumUp
    const isConfigured = isSumUpConfigured()
    const hasApiKey = !!process.env.SUMUP_API_KEY
    const hasAccessToken = !!process.env.SUMUP_ACCESS_TOKEN
    const hasClientId = !!process.env.SUMUP_CLIENT_ID
    const hasClientSecret = !!process.env.SUMUP_CLIENT_SECRET

    console.log('[SumUp Debug] Config Check:', {
      isConfigured,
      hasApiKey,
      hasAccessToken,
      hasClientId,
      hasClientSecret,
      apiKeyLength: process.env.SUMUP_API_KEY?.length || 0,
      clientIdPrefix: process.env.SUMUP_CLIENT_ID?.substring(0, 15) || 'none',
      clientSecretPrefix: process.env.SUMUP_CLIENT_SECRET?.substring(0, 15) || 'none',
      envKeys: Object.keys(process.env).filter(k => k.includes('SUMUP')),
    })

    // Se SumUp não está configurado, retornar checkout mock
    if (!isConfigured) {
      console.warn('[SumUp] Não configurado. Criando checkout mock.')
      return NextResponse.json({
        success: true,
        checkout: {
          id: `mock_${Date.now()}_${reference || 'checkout'}`,
          merchant_code: '',
          amount,
          currency: currency || 'EUR',
          description,
          redirect_url: redirect_url || '',
          status: 'PENDING',
          created_at: new Date().toISOString(),
          expires_at: new Date(Date.now() + 3600000).toISOString(),
        },
      })
    }

    console.log('[SumUp] Configurado. Criando checkout real...')

    // Criar checkout real
    try {
      console.log('[SumUp] Tentando criar checkout com:', {
        amount,
        currency: currency || 'EUR',
        hasApiKey: !!process.env.SUMUP_API_KEY,
        apiKeyPrefix: process.env.SUMUP_API_KEY?.substring(0, 10) || 'none',
      })

      const paymentLink = await createPaymentLink({
        amount,
        currency: currency || 'EUR',
        description,
        redirectUrl: redirect_url || `${process.env.NEXT_PUBLIC_SITE_URL || 'https://sofiagastrobaribiza.com'}/`,
        expiresIn: 3600,
        reference,
      })

      console.log('[SumUp] Checkout criado com sucesso:', paymentLink.id)
      return NextResponse.json({
        success: true,
        checkout: paymentLink,
      })
    } catch (error: any) {
      console.error('[SumUp] Erro ao criar checkout:', error)
      console.error('[SumUp] Error details:', {
        message: error.message,
        stack: error.stack,
        isConfigured,
        hasApiKey,
        envKeys: Object.keys(process.env).filter(k => k.includes('SUMUP')),
      })
      
      // Se erro de configuração, retornar checkout mock
      if (error.message?.includes('SUMUP_NOT_CONFIGURED')) {
        console.warn('[SumUp] Retornando checkout mock devido a configuração ausente')
        return NextResponse.json({
          success: true,
          checkout: {
            id: `mock_${Date.now()}_${reference || 'checkout'}`,
            merchant_code: '',
            amount,
            currency: currency || 'EUR',
            description,
            redirect_url: redirect_url || '',
            status: 'PENDING',
            created_at: new Date().toISOString(),
            expires_at: new Date(Date.now() + 3600000).toISOString(),
          },
        })
      }
      
      // Outros erros: retornar erro real
      return NextResponse.json({
        success: false,
        error: error.message || 'Erro ao criar checkout SumUp',
        message: 'Não foi possível criar o checkout. Verifique se o SumUp está configurado corretamente.',
        debug: {
          isConfigured,
          hasApiKey,
          errorMessage: error.message,
        },
      }, { status: 500 })
    }
  } catch (error: any) {
    console.error('Erro ao criar checkout:', error)
    
    // Retornar checkout mock em caso de erro
    const body = await request.json().catch(() => ({}))
    return NextResponse.json({
      success: true,
      checkout: {
        id: `mock_${Date.now()}_${body.reference || 'checkout'}`,
        merchant_code: '',
        amount: body.amount || 0,
        currency: body.currency || 'EUR',
        description: body.description || '',
        redirect_url: body.redirect_url || '',
        status: 'PENDING',
        created_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 3600000).toISOString(),
      },
    })
  }
}

