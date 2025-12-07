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

export interface PaymentMethod {
  id: string // 'card', 'apple_pay', 'google_pay', etc.
  name: string // 'Credit Card', 'Apple Pay', 'Google Pay'
}

export interface ProcessCheckoutParams {
  checkoutId: string
  paymentType: string // 'card', 'apple_pay', 'google_pay', etc.
  personalDetails?: {
    email?: string
    first_name?: string
    last_name?: string
    tax_id?: string
    address?: {
      country?: string
      city?: string
      line1?: string
      postal_code?: string
      state?: string
    }
  }
}

export interface NextStep {
  url: string
  method: 'GET' | 'POST'
  payload?: Record<string, any>
}

export interface ProcessedCheckout {
  id: string
  status: 'PENDING' | 'PAID' | 'FAILED' | 'EXPIRED' | 'CANCELLED'
  next_step?: NextStep
  boleto?: {
    barcode: string
    url: string
    valid_until: string
    artefacts: Array<{
      name: string
      content_type: string
      location: string
      content?: string
      created_at: string
    }>
  }
  pix?: {
    artefacts: Array<{
      name: string
      content_type: string
      location: string
      content?: string
      created_at: string
    }>
  }
  qr_code_pix?: {
    artefacts: Array<{
      name: string
      content_type: string
      location: string
      content?: string
      created_at: string
    }>
  }
}

// Métodos de pagamento disponíveis conforme documentação SumUp
export type PaymentMethodId = 
  | 'card'
  | 'ideal'
  | 'bancontact'
  | 'boleto'
  | 'eps'
  | 'mybank'
  | 'satispay'
  | 'blik'
  | 'p24'
  | 'pix'
  | 'qr_code_pix'
  | 'apple_pay'
  | 'paypal'
  | 'google_pay'

// Apple Pay Types
export interface ApplePayToken {
  paymentData: {
    data: string
    signature: string
    header: {
      publicKeyHash: string
      ephemeralPublicKey: string
      transactionId: string
    }
    version: string
  }
  paymentMethod: {
    displayName: string
    network: string
    type: string
  }
  transactionIdentifier: string
}

export interface ProcessCheckoutWithApplePayParams {
  checkoutId: string
  applePayToken: ApplePayToken
}

// Google Pay Types
export interface GooglePayToken {
  apiVersion: number
  apiVersionMinor: number
  paymentMethodData: {
    description: string
    tokenizationData: {
      type: string
      token: string
    }
    type: string
    info: {
      cardNetwork: string
      cardDetails: string
    }
  }
}

export interface ProcessCheckoutWithGooglePayParams {
  checkoutId: string
  googlePayToken: GooglePayToken
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

