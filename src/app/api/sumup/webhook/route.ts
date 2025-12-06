/**
 * SumUp Webhook Endpoint
 * Recebe eventos de pagamento do SumUp
 */

import { handleSumUpWebhook } from '@/modules/sumup-integration/lib/webhook'

export async function POST(request: Request) {
  return handleSumUpWebhook(request)
}

// Desabilitar body parsing para verificar assinatura
export const runtime = 'nodejs'

