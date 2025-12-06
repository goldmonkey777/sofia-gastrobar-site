/**
 * SumUp Webhook Handler
 * Processa eventos de pagamento do SumUp
 */

import { SumUpWebhookEvent } from './types'
import crypto from 'crypto'

/**
 * Verifica assinatura do webhook SumUp
 */
function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  const hmac = crypto.createHmac('sha256', secret)
  hmac.update(payload)
  const calculatedSignature = hmac.digest('hex')

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(calculatedSignature)
  )
}

/**
 * Processa webhook do SumUp
 */
export async function handleSumUpWebhook(request: Request): Promise<Response> {
  try {
    // Obter assinatura do header
    const signature = request.headers.get('x-sumup-signature')
    const webhookSecret = process.env.SUMUP_WEBHOOK_SECRET

    if (!signature || !webhookSecret) {
      return new Response('Unauthorized', { status: 401 })
    }

    // Ler payload
    const payload = await request.text()

    // Verificar assinatura
    if (!verifyWebhookSignature(payload, signature, webhookSecret)) {
      return new Response('Invalid signature', { status: 401 })
    }

    // Parse do evento
    const event: SumUpWebhookEvent = JSON.parse(payload)

    // Processar evento baseado no tipo
    switch (event.event_type) {
      case 'payment.succeeded':
        await handlePaymentSuccess(event)
        break

      case 'payment.failed':
        await handlePaymentFailed(event)
        break

      case 'payment.cancelled':
        await handlePaymentCancelled(event)
        break

      default:
        console.log('Evento desconhecido:', event.event_type)
    }

    return new Response('OK', { status: 200 })
  } catch (error) {
    console.error('Erro ao processar webhook SumUp:', error)
    return new Response('Internal Server Error', { status: 500 })
  }
}

/**
 * Processa pagamento bem-sucedido
 */
async function handlePaymentSuccess(event: SumUpWebhookEvent) {
  const { data } = event
  const reference = data.reference || ''

  // Determinar tipo de pagamento pelo reference
  if (reference.startsWith('RESERVATION_')) {
    const reservationId = reference.replace('RESERVATION_', '')
    await updateReservationPayment(reservationId, 'paid', data.amount)
    
    // Enviar para ChefIApp OS
    await notifyChefIAppOS('reservation_confirmed', {
      reservationId,
      prepaidAmount: data.amount,
    })
  } else if (reference.startsWith('TABLE_')) {
    const [tableId, orderId] = reference.replace('TABLE_', '').split('_')
    await updateTablePayment(tableId, orderId, 'paid', data.amount)
    
    // Notificar garçom
    await notifyChefIAppOS('table_paid', {
      tableId,
      orderId,
      amount: data.amount,
    })
  } else if (reference.startsWith('DELIVERY_')) {
    const deliveryId = reference.replace('DELIVERY_', '')
    await updateDeliveryPayment(deliveryId, 'paid', data.amount)
    
    // Notificar cozinha
    await notifyChefIAppOS('delivery_confirmed', {
      deliveryId,
      amount: data.amount,
    })
  }
}

/**
 * Processa pagamento falhado
 */
async function handlePaymentFailed(event: SumUpWebhookEvent) {
  const { data } = event
  const reference = data.reference || ''

  if (reference.startsWith('RESERVATION_')) {
    const reservationId = reference.replace('RESERVATION_', '')
    await updateReservationPayment(reservationId, 'failed', 0)
  }
}

/**
 * Processa pagamento cancelado
 */
async function handlePaymentCancelled(event: SumUpWebhookEvent) {
  const { data } = event
  const reference = data.reference || ''

  if (reference.startsWith('RESERVATION_')) {
    const reservationId = reference.replace('RESERVATION_', '')
    await updateReservationPayment(reservationId, 'cancelled', 0)
  }
}

/**
 * Atualiza status de pagamento da reserva no Supabase
 */
async function updateReservationPayment(
  reservationId: string,
  status: 'paid' | 'failed' | 'cancelled',
  amount: number
) {
  // TODO: Implementar atualização no Supabase
  // Por enquanto, usar mock database
  const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/reservas/${reservationId}/payment`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      status,
      prepaidAmount: amount,
      paidAt: status === 'paid' ? new Date().toISOString() : null,
    }),
  })

  if (!response.ok) {
    throw new Error('Falha ao atualizar pagamento da reserva')
  }
}

/**
 * Atualiza status de pagamento da mesa
 */
async function updateTablePayment(
  tableId: string,
  orderId: string,
  status: 'paid',
  amount: number
) {
  // TODO: Implementar atualização no Supabase
  const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/pedidos/${orderId}/payment`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      status,
      amount,
      paidAt: new Date().toISOString(),
    }),
  })

  if (!response.ok) {
    throw new Error('Falha ao atualizar pagamento da mesa')
  }
}

/**
 * Atualiza status de pagamento do delivery
 */
async function updateDeliveryPayment(
  deliveryId: string,
  status: 'paid',
  amount: number
) {
  // TODO: Implementar atualização no Supabase
  const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/delivery/${deliveryId}/payment`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      status,
      amount,
      paidAt: new Date().toISOString(),
    }),
  })

  if (!response.ok) {
    throw new Error('Falha ao atualizar pagamento do delivery')
  }
}

/**
 * Notifica ChefIApp OS sobre eventos
 */
async function notifyChefIAppOS(eventType: string, data: any) {
  const chefIAppUrl = process.env.CHEFIAPP_OS_API_URL
  const chefIAppKey = process.env.CHEFIAPP_OS_API_KEY

  if (!chefIAppUrl || !chefIAppKey) {
    console.log('ChefIApp OS não configurado, pulando notificação')
    return
  }

  try {
    await fetch(`${chefIAppUrl}/webhooks/sofia`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${chefIAppKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        event: eventType,
        data,
        timestamp: new Date().toISOString(),
      }),
    })
  } catch (error) {
    console.error('Erro ao notificar ChefIApp OS:', error)
  }
}

