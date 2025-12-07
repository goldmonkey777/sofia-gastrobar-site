/**
 * SumUp Integration Types
 */

export interface SumUpPaymentLink {
  id: string
  merchant_code: string
  amount: number
  currency: string
  description: string
  redirect_url: string
  status: 'PENDING' | 'PAID' | 'EXPIRED' | 'CANCELLED'
  created_at: string
  expires_at: string
}

export interface CreatePaymentLinkParams {
  amount: number
  currency?: string
  description: string
  redirectUrl: string
  expiresIn?: number // segundos
  reference?: string
  enableGooglePay?: boolean // Habilitar Google Pay
  enableApplePay?: boolean // Habilitar Apple Pay
  paymentType?: 'card' | 'any' // Tipo de pagamento permitido
}

export interface SumUpWebhookEvent {
  event_type: 'payment.succeeded' | 'payment.failed' | 'payment.cancelled'
  event_id: string
  timestamp: string
  data: {
    id: string
    transaction_code: string
    amount: number
    currency: string
    status: 'SUCCESSFUL' | 'FAILED' | 'CANCELLED'
    payment_type: string
    merchant_code: string
    reference?: string
  }
}

export interface PaymentContext {
  type: 'reservation' | 'table' | 'delivery' | 'dj' | 'experience'
  referenceId: string // ID da reserva, mesa, pedido, etc.
  amount: number
  description: string
  metadata?: Record<string, any>
}

export interface ReservationPayment {
  reservationId: string
  numberOfPeople: number
  prepaidAmount: number // 6€ * pessoas
  paymentLinkId?: string
  paymentStatus: 'pending' | 'paid' | 'expired' | 'cancelled'
  paidAt?: string
}

export interface TablePayment {
  tableId: string
  orderId: string
  totalAmount: number
  paymentLinkId?: string
  paymentStatus: 'pending' | 'paid' | 'expired'
  paidAt?: string
}

export interface DeliveryPayment {
  deliveryId: string
  totalAmount: number
  deliveryFee: number
  paymentLinkId?: string
  paymentStatus: 'pending' | 'paid' | 'expired'
  paidAt?: string
}

