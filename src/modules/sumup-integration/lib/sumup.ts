/**
 * SumUp API Client
 * Geração de links de pagamento e gestão de transações
 * Usando SDK oficial @sumup/sdk
 */

import { 
  CreatePaymentLinkParams, 
  SumUpPaymentLink, 
  PaymentMethod, 
  ProcessCheckoutParams, 
  ProcessedCheckout,
  ProcessCheckoutWithApplePayParams,
  ProcessCheckoutWithGooglePayParams,
  ApplePayToken,
  GooglePayToken
} from './types'

const SUMUP_API_BASE = 'https://api.sumup.com/v0.1'
const SUMUP_CHECKOUT_BASE = 'https://pay.sumup.com'

/**
 * SDK oficial @sumup/sdk está instalado mas a API ainda usa chamadas diretas
 * para maior compatibilidade. O SDK pode ser usado no futuro quando necessário.
 * 
 * Documentação: https://developer.sumup.com/api/sdks
 */

/**
 * Verifica se SumUp está configurado
 * Verifica em runtime se as variáveis têm valores válidos
 */
export function isSumUpConfigured(): boolean {
  const apiKey = process.env.SUMUP_API_KEY?.trim()
  const accessToken = process.env.SUMUP_ACCESS_TOKEN?.trim()
  const clientId = process.env.SUMUP_CLIENT_ID?.trim()
  const clientSecret = process.env.SUMUP_CLIENT_SECRET?.trim()
  
  const isConfigured = !!(
    (apiKey && apiKey.length > 10) || 
    (accessToken && accessToken.length > 10) ||
    (clientId && clientId.length > 5 && clientSecret && clientSecret.length > 5)
  )
  
  // Log detalhado para diagnóstico
  if (!isConfigured) {
    console.warn('[SumUp] isSumUpConfigured: false', {
      hasApiKey: !!apiKey,
      apiKeyLength: apiKey?.length || 0,
      hasAccessToken: !!accessToken,
      accessTokenLength: accessToken?.length || 0,
      hasClientId: !!clientId,
      clientIdLength: clientId?.length || 0,
      hasClientSecret: !!clientSecret,
      clientSecretLength: clientSecret?.length || 0,
      nodeEnv: process.env.NODE_ENV,
      vercelEnv: process.env.VERCEL_ENV,
    })
  }
  
  return isConfigured
}

/**
 * Obtém access token do SumUp
 */
async function getAccessToken(): Promise<string> {
  const clientId = process.env.SUMUP_CLIENT_ID
  const clientSecret = process.env.SUMUP_CLIENT_SECRET

  console.log('[SumUp OAuth] getAccessToken called', {
    hasClientId: !!clientId,
    hasClientSecret: !!clientSecret,
    clientIdPrefix: clientId?.substring(0, 10) || 'none',
  })

  if (!clientId || !clientSecret) {
    console.error('[SumUp OAuth] Missing credentials')
    throw new Error('SUMUP_NOT_CONFIGURED')
  }

  // Se já temos um token válido, retornar
  const existingToken = process.env.SUMUP_ACCESS_TOKEN
  if (existingToken) {
    console.log('[SumUp OAuth] Using existing token')
    return existingToken
  }

  // Caso contrário, fazer OAuth (simplificado - em produção usar refresh token)
  console.log('[SumUp OAuth] Requesting new token from:', `${SUMUP_API_BASE}/token`)
  
  try {
    const response = await fetch(`${SUMUP_API_BASE}/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: clientId,
        client_secret: clientSecret,
      }),
    })

    console.log('[SumUp OAuth] Token response status:', response.status, response.statusText)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('[SumUp OAuth] Token request failed:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText,
      })
      throw new Error(`Falha ao obter access token do SumUp: ${response.status} ${errorText}`)
    }

    const data = await response.json()
    console.log('[SumUp OAuth] Token obtained successfully')
    return data.access_token
  } catch (error) {
    console.error('[SumUp OAuth] Error in getAccessToken:', error)
    throw error
  }
}

/**
 * Cria um link de pagamento SumUp
 * Usa SDK oficial quando disponível, fallback para API direta
 */
export async function createPaymentLink(
  params: CreatePaymentLinkParams
): Promise<SumUpPaymentLink> {
  const {
    amount,
    currency = 'EUR',
    description,
    redirectUrl,
    expiresIn = 3600, // 1 hora padrão
    reference,
  } = params

  // Usar API_KEY ou ACCESS_TOKEN diretamente (mais simples e compatível)
  const apiKey = process.env.SUMUP_API_KEY || process.env.SUMUP_ACCESS_TOKEN
  
  if (apiKey) {
    try {
      const merchantCode = process.env.SUMUP_MERCHANT_CODE || ''
      // Usar email do negócio como alternativa se merchant_code não estiver disponível
      const payToEmail = process.env.SUMUP_PAY_TO_EMAIL || 'info@sofiagastrobaribiza.com'
      
      // Calcular data de expiração
      const expiresAt = new Date()
      expiresAt.setSeconds(expiresAt.getSeconds() + expiresIn)

      // Preparar payload - usar merchant_code se disponível, senão usar pay_to_email
      const checkoutPayload: any = {
        amount: amount.toFixed(2),
        currency: currency || 'EUR',
        description,
        redirect_url: redirectUrl,
        ...(reference && { checkout_reference: reference }),
        valid_until: expiresAt.toISOString(),
      }
      
      // Priorizar merchant_code, mas usar pay_to_email como fallback
      if (merchantCode) {
        checkoutPayload.merchant_code = merchantCode
        console.log('[SumUp] ✅ Usando merchant_code:', merchantCode.substring(0, 10) + '...')
      } else {
        checkoutPayload.pay_to_email = payToEmail
        console.log('[SumUp] ✅ Usando pay_to_email:', payToEmail)
      }

      console.log('[SumUp] 📤 Payload completo que será enviado:', JSON.stringify(checkoutPayload, null, 2))
      console.log('[SumUp] Creating checkout with:', {
        hasMerchantCode: !!merchantCode,
        hasPayToEmail: !!checkoutPayload.pay_to_email,
        payToEmail: checkoutPayload.pay_to_email || 'none',
        payloadKeys: Object.keys(checkoutPayload),
      })

      // Criar checkout via API direta com API_KEY
      const response = await fetch(`${SUMUP_API_BASE}/checkouts`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(checkoutPayload),
      })
      
      console.log('[SumUp] 📥 Response status:', response.status, response.statusText)

      if (!response.ok) {
        const errorText = await response.text()
        let errorData: any = {}
        try {
          errorData = JSON.parse(errorText)
        } catch {
          errorData = { message: errorText }
        }
        
        console.error('[SumUp] Erro ao criar checkout com API_KEY:', {
          status: response.status,
          statusText: response.statusText,
          error: errorData,
          hasMerchantCode: !!merchantCode,
          merchantCodeLength: merchantCode?.length || 0,
          hasPayToEmail: !!checkoutPayload.pay_to_email,
          payToEmail: checkoutPayload.pay_to_email || 'none',
          errorParam: errorData.param,
          errorMessage: errorData.message,
          fullErrorText: errorText,
        })
        
        // Se erro de validação sobre merchant_code ou pay_to_email, não tentar OAuth
        const isMerchantCodeError = 
          errorData.param?.includes('merchant_code') || 
          errorData.param?.includes('pay_to_email') ||
          errorData.message?.includes('merchant_code') || 
          errorData.message?.includes('pay_to_email') ||
          errorText.includes('merchant_code') ||
          errorText.includes('pay_to_email')
        
        console.log('[SumUp] Verificando tipo de erro:', {
          isMerchantCodeError,
          errorParam: errorData.param,
          errorMessage: errorData.message,
          errorText: errorText.substring(0, 200),
        })
        
        if (isMerchantCodeError) {
          const errorMsg = `SUMUP_MERCHANT_CODE_REQUIRED: ${errorData.message || errorText}. Payload enviado: ${JSON.stringify({ hasMerchantCode: !!merchantCode, hasPayToEmail: !!checkoutPayload.pay_to_email, payToEmail: checkoutPayload.pay_to_email })}`
          console.error('[SumUp] ❌ Erro de merchant_code/pay_to_email detectado. NÃO tentando OAuth. Lançando erro:', errorMsg)
          throw new Error(errorMsg)
        }
        
        // Se erro de autenticação, não tentar OAuth (API Key pode estar incorreta)
        if (response.status === 401 || response.status === 403) {
          throw new Error(`SUMUP_API_KEY inválida ou expirada (${response.status}). Verifique no Vercel Dashboard.`)
        }
        
        throw new Error(`Falha ao criar link SumUp: ${errorText}`)
      }

      const checkoutData = await response.json()

      return {
        id: checkoutData.id || checkoutData.checkout_reference || '',
        merchant_code: merchantCode || checkoutData.merchant_code || '',
        amount,
        currency: currency || 'EUR',
        description,
        redirect_url: redirectUrl,
        status: (checkoutData.status || 'PENDING') as SumUpPaymentLink['status'],
        created_at: checkoutData.date || new Date().toISOString(),
        expires_at: checkoutData.valid_until || expiresAt.toISOString(),
      }
    } catch (error) {
      console.error('[SumUp] Erro ao criar checkout com API_KEY:', error)
      
      const errorMessage = error instanceof Error ? error.message : String(error)
      
      // Se erro de validação (merchant_code), não tentar OAuth - lançar erro direto
      if (
        errorMessage.includes('SUMUP_MERCHANT_CODE_REQUIRED') ||
        errorMessage.includes('merchant_code') ||
        errorMessage.includes('pay_to_email')
      ) {
        console.error('[SumUp] Erro de merchant_code detectado no catch. Não tentando OAuth.')
        throw error
      }
      
      // Se erro de autenticação, não tentar OAuth (API Key pode estar incorreta)
      if (
        errorMessage.includes('401') || 
        errorMessage.includes('403') || 
        errorMessage.includes('Unauthorized') ||
        errorMessage.includes('SUMUP_API_KEY inválida')
      ) {
        console.error('[SumUp] Erro de autenticação detectado. Não tentando OAuth.')
        throw error
      }
      
      // Se outro erro, tentar OAuth se disponível (apenas para erros não críticos)
      console.warn('[SumUp] Erro não crítico. Tentando OAuth como fallback...')
    }
  }

  // Se não tem API_KEY, tentar OAuth apenas se tiver credenciais
  const hasOAuthCredentials = process.env.SUMUP_CLIENT_ID && process.env.SUMUP_CLIENT_SECRET
  
  console.log('[SumUp] Checking OAuth fallback:', {
    hasOAuthCredentials,
    hasClientId: !!process.env.SUMUP_CLIENT_ID,
    hasClientSecret: !!process.env.SUMUP_CLIENT_SECRET,
  })
  
  if (hasOAuthCredentials) {
    try {
      console.log('[SumUp OAuth] Attempting to get access token...')
      const accessToken = await getAccessToken()
      console.log('[SumUp OAuth] Access token obtained, creating checkout...')
      
      const merchantCode = process.env.SUMUP_MERCHANT_CODE || ''
      // Usar email do negócio como alternativa se merchant_code não estiver disponível
      const payToEmail = process.env.SUMUP_PAY_TO_EMAIL || 'info@sofiagastrobaribiza.com'

      // Calcular data de expiração
      const expiresAt = new Date()
      expiresAt.setSeconds(expiresAt.getSeconds() + expiresIn)

      // Preparar payload - usar merchant_code se disponível, senão usar pay_to_email
      const checkoutPayload: any = {
        amount: amount.toFixed(2),
        currency,
        description,
        redirect_url: redirectUrl,
        ...(reference && { checkout_reference: reference }),
        valid_until: expiresAt.toISOString(),
      }
      
      // Priorizar merchant_code, mas usar pay_to_email como fallback
      if (merchantCode) {
        checkoutPayload.merchant_code = merchantCode
      } else {
        checkoutPayload.pay_to_email = payToEmail
      }
      
      console.log('[SumUp OAuth] Creating checkout with:', {
        hasMerchantCode: !!merchantCode,
        hasPayToEmail: !!checkoutPayload.pay_to_email,
        payToEmail: checkoutPayload.pay_to_email || 'none',
      })

      console.log('[SumUp OAuth] Creating checkout with payload:', {
        ...checkoutPayload,
        redirect_url: redirectUrl.substring(0, 50) + '...',
      })

      // Criar link via API SumUp
      const response = await fetch(`${SUMUP_API_BASE}/checkouts`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(checkoutPayload),
      })

      console.log('[SumUp OAuth] Checkout response status:', response.status, response.statusText)

      if (!response.ok) {
        const error = await response.text()
        console.error('[SumUp OAuth] Checkout creation failed:', {
          status: response.status,
          statusText: response.statusText,
          error,
        })
        throw new Error(`Falha ao criar link SumUp: ${response.status} ${error}`)
      }

      const data = await response.json()
      console.log('[SumUp OAuth] Checkout created successfully:', data.id)

      return {
        id: data.id,
        merchant_code: merchantCode || data.merchant_code || '',
        amount,
        currency,
        description,
        redirect_url: redirectUrl,
        status: (data.status || 'PENDING') as SumUpPaymentLink['status'],
        created_at: data.date || new Date().toISOString(),
        expires_at: data.valid_until || expiresAt.toISOString(),
      }
    } catch (error) {
      console.error('[SumUp OAuth] Error creating checkout:', error)
      throw error
    }
  }

  // Se chegou aqui, não tem nenhuma credencial configurada
  const allSumUpEnvKeys = Object.keys(process.env).filter(k => k.includes('SUMUP'))
  console.error('[SumUp] Nenhuma credencial configurada:', {
    hasApiKey: !!process.env.SUMUP_API_KEY,
    hasAccessToken: !!process.env.SUMUP_ACCESS_TOKEN,
    hasClientId: !!process.env.SUMUP_CLIENT_ID,
    hasClientSecret: !!process.env.SUMUP_CLIENT_SECRET,
    allSumUpEnvKeys,
    envValues: Object.fromEntries(
      allSumUpEnvKeys.map(key => [
        key,
        key.includes('SECRET') || key.includes('KEY')
          ? `${process.env[key]?.substring(0, 10)}... (length: ${process.env[key]?.length || 0})`
          : process.env[key]
      ])
    ),
    nodeEnv: process.env.NODE_ENV,
    vercelEnv: process.env.VERCEL_ENV,
  })
  
  throw new Error('SUMUP_NOT_CONFIGURED: Configure SUMUP_API_KEY ou SUMUP_CLIENT_ID/SUMUP_CLIENT_SECRET no Vercel')
}

/**
 * Cria link de pagamento para reserva
 */
export async function createReservationPaymentLink(
  reservationId: string,
  numberOfPeople: number,
  date: string,
  time: string
): Promise<SumUpPaymentLink> {
  const amount = numberOfPeople * 6 // 6€ por pessoa
  const description = `Reserva Sofia Gastrobar – ${date} ${time} – ${numberOfPeople} pessoa${numberOfPeople > 1 ? 's' : ''}`
  const redirectUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://sofiagastrobaribiza.com'}/reservas/confirmacao?reservation_id=${reservationId}`

  return createPaymentLink({
    amount,
    currency: 'EUR',
    description,
    redirectUrl,
    expiresIn: 3600, // 1 hora
    reference: `RESERVATION_${reservationId}`,
  })
}

/**
 * Cria link de pagamento para mesa
 */
export async function createTablePaymentLink(
  tableId: string,
  orderId: string,
  totalAmount: number
): Promise<SumUpPaymentLink> {
  const description = `Conta Mesa ${tableId} – Pedido ${orderId}`
  const redirectUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://sofiagastrobaribiza.com'}/mesa/${tableId}/pago`

  return createPaymentLink({
    amount: totalAmount,
    currency: 'EUR',
    description,
    redirectUrl,
    expiresIn: 1800, // 30 minutos
    reference: `TABLE_${tableId}_${orderId}`,
  })
}

/**
 * Cria link de pagamento para delivery
 */
export async function createDeliveryPaymentLink(
  deliveryId: string,
  totalAmount: number,
  deliveryFee: number
): Promise<SumUpPaymentLink> {
  const description = `Delivery Sofia Gastrobar – Pedido ${deliveryId}`
  const redirectUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://sofiagastrobaribiza.com'}/delivery/confirmacao?delivery_id=${deliveryId}`

  return createPaymentLink({
    amount: totalAmount + deliveryFee,
    currency: 'EUR',
    description,
    redirectUrl,
    expiresIn: 1800, // 30 minutos
    reference: `DELIVERY_${deliveryId}`,
  })
}

/**
 * Verifica status de um pagamento
 */
export async function getPaymentStatus(paymentLinkId: string): Promise<SumUpPaymentLink['status']> {
  // Usar API direta com API_KEY ou ACCESS_TOKEN
  const apiKey = process.env.SUMUP_API_KEY || process.env.SUMUP_ACCESS_TOKEN
  
  if (!apiKey) {
    // Fallback: tentar OAuth
    const accessToken = await getAccessToken()
    const response = await fetch(`${SUMUP_API_BASE}/checkouts/${paymentLinkId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    })

    if (!response.ok) {
      throw new Error('Falha ao verificar status do pagamento')
    }

    const data = await response.json()
    return (data.status || 'PENDING') as SumUpPaymentLink['status']
  }

  // Usar API_KEY diretamente
  const response = await fetch(`${SUMUP_API_BASE}/checkouts/${paymentLinkId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
    },
  })

  if (!response.ok) {
    throw new Error('Falha ao verificar status do pagamento')
  }

  const data = await response.json()
  return (data.status || 'PENDING') as SumUpPaymentLink['status']
}

/**
 * Gera URL do checkout SumUp
 */
export function getCheckoutUrl(paymentLinkId: string): string {
  return `${SUMUP_CHECKOUT_BASE}/checkout/${paymentLinkId}`
}

/**
 * Obtém métodos de pagamento disponíveis para um checkout
 * Documentação: https://developer.sumup.com/online-payments/apm/integration-guide
 */
export async function getAvailablePaymentMethods(checkoutId: string): Promise<PaymentMethod[]> {
  const apiKey = process.env.SUMUP_API_KEY || process.env.SUMUP_ACCESS_TOKEN
  
  if (!apiKey) {
    const accessToken = await getAccessToken()
    const response = await fetch(`${SUMUP_API_BASE}/checkouts/${checkoutId}/payment-methods`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    })

    if (!response.ok) {
      throw new Error('Falha ao obter métodos de pagamento')
    }

    const data = await response.json()
    return data.items || []
  }

  const response = await fetch(`${SUMUP_API_BASE}/checkouts/${checkoutId}/payment-methods`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
    },
  })

  if (!response.ok) {
    throw new Error('Falha ao obter métodos de pagamento')
  }

  const data = await response.json()
  return data.items || []
}

/**
 * Processa um checkout com método de pagamento específico
 * Suporta Apple Pay, Google Pay e outros APMs
 * Documentação: https://developer.sumup.com/online-payments/apm/integration-guide
 */
export async function processCheckout(params: ProcessCheckoutParams): Promise<ProcessedCheckout> {
  const { checkoutId, paymentType, personalDetails } = params
  const apiKey = process.env.SUMUP_API_KEY || process.env.SUMUP_ACCESS_TOKEN

  const body: any = {
    payment_type: paymentType,
  }

  if (personalDetails) {
    // Formatar personal_details conforme documentação SumUp
    body.personal_details = {
      ...(personalDetails.email && { email: personalDetails.email }),
      ...(personalDetails.first_name && { first_name: personalDetails.first_name }),
      ...(personalDetails.last_name && { last_name: personalDetails.last_name }),
      ...(personalDetails.tax_id && { tax_id: personalDetails.tax_id }),
      ...(personalDetails.address && { address: personalDetails.address }),
    }
  }

  let response: Response

  if (apiKey) {
    response = await fetch(`${SUMUP_API_BASE}/checkouts/${checkoutId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
  } else {
    const accessToken = await getAccessToken()
    response = await fetch(`${SUMUP_API_BASE}/checkouts/${checkoutId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
  }

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Falha ao processar checkout: ${error}`)
  }

  const data = await response.json()

  return {
    id: data.id,
    status: data.status,
    next_step: data.next_step,
    boleto: data.boleto,
    pix: data.pix,
    qr_code_pix: data.qr_code_pix,
  }
}

/**
 * Cria sessão de validação do Apple Pay
 * Documentação: https://developer.sumup.com/online-payments/apm/apple-pay
 */
export async function createApplePaySession(
  checkoutId: string,
  validateUrl: string,
  context: string
): Promise<{ merchantSession: any }> {
  const apiKey = process.env.SUMUP_API_KEY || process.env.SUMUP_ACCESS_TOKEN

  const body = {
    target: validateUrl,
    context: context,
  }

  let response: Response

  if (apiKey) {
    response = await fetch(`${SUMUP_API_BASE}/checkouts/${checkoutId}/apple-pay-session`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
  } else {
    const accessToken = await getAccessToken()
    response = await fetch(`${SUMUP_API_BASE}/checkouts/${checkoutId}/apple-pay-session`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
  }

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Falha ao criar sessão Apple Pay: ${error}`)
  }

  const data = await response.json()
  return { merchantSession: data }
}

/**
 * Processa checkout com Apple Pay (integração direta)
 * Documentação: https://developer.sumup.com/online-payments/apm/apple-pay
 */
export async function processCheckoutWithApplePay(
  params: ProcessCheckoutWithApplePayParams
): Promise<ProcessedCheckout> {
  const { checkoutId, applePayToken } = params
  const apiKey = process.env.SUMUP_API_KEY || process.env.SUMUP_ACCESS_TOKEN

  const body = {
    payment_type: 'apple_pay',
    apple_pay: {
      token: applePayToken,
    },
  }

  let response: Response

  if (apiKey) {
    response = await fetch(`${SUMUP_API_BASE}/checkouts/${checkoutId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
  } else {
    const accessToken = await getAccessToken()
    response = await fetch(`${SUMUP_API_BASE}/checkouts/${checkoutId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
  }

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Falha ao processar Apple Pay: ${error}`)
  }

  const data = await response.json()

  return {
    id: data.id,
    status: data.status,
    next_step: data.next_step,
    boleto: data.boleto,
    pix: data.pix,
    qr_code_pix: data.qr_code_pix,
  }
}

/**
 * Processa checkout com Google Pay (integração direta)
 * Documentação: https://developer.sumup.com/online-payments/apm/google-pay
 */
export async function processCheckoutWithGooglePay(
  params: ProcessCheckoutWithGooglePayParams
): Promise<ProcessedCheckout> {
  const { checkoutId, googlePayToken } = params
  const apiKey = process.env.SUMUP_API_KEY || process.env.SUMUP_ACCESS_TOKEN

  const body = {
    payment_type: 'google_pay',
    google_pay: googlePayToken,
  }

  let response: Response

  if (apiKey) {
    response = await fetch(`${SUMUP_API_BASE}/checkouts/${checkoutId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
  } else {
    const accessToken = await getAccessToken()
    response = await fetch(`${SUMUP_API_BASE}/checkouts/${checkoutId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
  }

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Falha ao processar Google Pay: ${error}`)
  }

  const data = await response.json()

  return {
    id: data.id,
    status: data.status,
    next_step: data.next_step,
    boleto: data.boleto,
    pix: data.pix,
    qr_code_pix: data.qr_code_pix,
  }
}

