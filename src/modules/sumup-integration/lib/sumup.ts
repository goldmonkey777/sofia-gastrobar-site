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
 */
export function isSumUpConfigured(): boolean {
  // SDK oficial usa SUMUP_API_KEY ou podemos usar SUMUP_ACCESS_TOKEN
  return !!(
    process.env.SUMUP_API_KEY || 
    process.env.SUMUP_ACCESS_TOKEN ||
    (process.env.SUMUP_CLIENT_ID && process.env.SUMUP_CLIENT_SECRET)
  )
}

/**
 * Obtém access token do SumUp
 */
async function getAccessToken(): Promise<string> {
  const clientId = process.env.SUMUP_CLIENT_ID
  const clientSecret = process.env.SUMUP_CLIENT_SECRET

  if (!clientId || !clientSecret) {
    throw new Error('SUMUP_NOT_CONFIGURED')
  }

  // Se já temos um token válido, retornar
  const existingToken = process.env.SUMUP_ACCESS_TOKEN
  if (existingToken) {
    return existingToken
  }

  // Caso contrário, fazer OAuth (simplificado - em produção usar refresh token)
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

  if (!response.ok) {
    throw new Error('Falha ao obter access token do SumUp')
  }

  const data = await response.json()
  return data.access_token
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
      
      // Calcular data de expiração
      const expiresAt = new Date()
      expiresAt.setSeconds(expiresAt.getSeconds() + expiresIn)

      // Criar checkout via API direta com API_KEY
      const response = await fetch(`${SUMUP_API_BASE}/checkouts`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amount.toFixed(2),
          currency: currency || 'EUR',
          description,
          redirect_url: redirectUrl,
          ...(merchantCode && { merchant_code: merchantCode }),
          ...(reference && { checkout_reference: reference }),
          valid_until: expiresAt.toISOString(),
        }),
      })

      if (!response.ok) {
        const error = await response.text()
        throw new Error(`Falha ao criar link SumUp: ${error}`)
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
      console.warn('Erro ao criar checkout com API_KEY, tentando OAuth:', error)
      // Fallback para OAuth
    }
  }

  // Se não tem API_KEY, tentar OAuth apenas se tiver credenciais
  const hasOAuthCredentials = process.env.SUMUP_CLIENT_ID && process.env.SUMUP_CLIENT_SECRET
  
  if (hasOAuthCredentials) {
    try {
      const accessToken = await getAccessToken()
      const merchantCode = process.env.SUMUP_MERCHANT_CODE || ''

      // Calcular data de expiração
      const expiresAt = new Date()
      expiresAt.setSeconds(expiresAt.getSeconds() + expiresIn)

      // Criar link via API SumUp
      const response = await fetch(`${SUMUP_API_BASE}/checkouts`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amount.toFixed(2),
          currency,
          description,
          redirect_url: redirectUrl,
          merchant_code: merchantCode,
          reference,
          expiry_date: expiresAt.toISOString(),
        }),
      })

      if (!response.ok) {
        const error = await response.text()
        throw new Error(`Falha ao criar link SumUp: ${error}`)
      }

      const data = await response.json()

      return {
        id: data.id,
        merchant_code: merchantCode,
        amount,
        currency,
        description,
        redirect_url: redirectUrl,
        status: 'PENDING',
        created_at: new Date().toISOString(),
        expires_at: expiresAt.toISOString(),
      }
    } catch (error) {
      console.error('Erro ao criar checkout com OAuth:', error)
      throw error
    }
  }

  // Se chegou aqui, não tem nenhuma credencial configurada
  console.error('[SumUp] Nenhuma credencial configurada:', {
    hasApiKey: !!process.env.SUMUP_API_KEY,
    hasAccessToken: !!process.env.SUMUP_ACCESS_TOKEN,
    hasClientId: !!process.env.SUMUP_CLIENT_ID,
    hasClientSecret: !!process.env.SUMUP_CLIENT_SECRET,
    allEnvKeys: Object.keys(process.env).filter(k => k.includes('SUMUP')),
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

