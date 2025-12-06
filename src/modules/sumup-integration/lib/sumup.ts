/**
 * SumUp API Client
 * Geração de links de pagamento e gestão de transações
 */

import { CreatePaymentLinkParams, SumUpPaymentLink, PaymentContext } from './types'

const SUMUP_API_BASE = 'https://api.sumup.com/v0.1'
const SUMUP_CHECKOUT_BASE = 'https://pay.sumup.com'

/**
 * Verifica se SumUp está configurado
 */
export function isSumUpConfigured(): boolean {
  return !!(
    process.env.SUMUP_CLIENT_ID &&
    process.env.SUMUP_CLIENT_SECRET &&
    (process.env.SUMUP_ACCESS_TOKEN || process.env.SUMUP_MERCHANT_CODE)
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
  return data.status
}

/**
 * Gera URL do checkout SumUp
 */
export function getCheckoutUrl(paymentLinkId: string): string {
  return `${SUMUP_CHECKOUT_BASE}/checkout/${paymentLinkId}`
}

