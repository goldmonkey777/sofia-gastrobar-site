# 💳 SumUp Integration Module

Módulo Goldmonkey para integração com pagamentos SumUp.

## Features

- ✅ Checkout via API SumUp
- ✅ Cálculo automático de conta por mesa
- ✅ Split payment (divisão de conta)
- ✅ Confirmação de pagamento
- ✅ Redirect pós-pagamento
- ✅ Webhook handling

## Setup

### 1. Obter credenciais SumUp

1. Criar conta em [SumUp](https://www.sumup.com/)
2. Acessar [Developer Dashboard](https://developer.sumup.com/)
3. Criar aplicação e obter:
   - API Key
   - Merchant Code
   - Secret Key (para webhooks)

### 2. Configurar environment variables

```bash
# .env.local
NEXT_PUBLIC_SUMUP_API_KEY="your_api_key"
SUMUP_MERCHANT_CODE="your_merchant_code"
SUMUP_SECRET_KEY="your_secret_key"
```

## Usage

### Create Checkout

```typescript
import { createCheckout } from '@/modules/sumup-integration/api/checkout'

const handlePayment = async () => {
  const checkout = await createCheckout({
    tableId: '01',
    amount: 45.50,
    items: [
      { name: 'Patatas Bravas', price: 6.50, quantity: 2 },
      { name: 'Sangria', price: 16.50, quantity: 2 },
    ],
  })

  // Redirecionar para checkout SumUp
  window.location.href = checkout.checkoutUrl
}
```

### API Route Example

```typescript
// app/api/checkout/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const { tableId, amount, items } = await request.json()

  const checkoutUrl = await fetch('https://api.sumup.com/v0.1/checkouts', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.SUMUP_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      checkout_reference: `mesa-${tableId}-${Date.now()}`,
      amount,
      currency: 'EUR',
      merchant_code: process.env.SUMUP_MERCHANT_CODE,
      description: `Mesa ${tableId} - Sofia Gastrobar`,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/mesa/${tableId}?payment=success`,
    }),
  }).then(res => res.json())

  return NextResponse.json({ checkoutUrl: checkoutUrl.checkout_url })
}
```

## Webhook Handler

```typescript
// app/api/webhooks/sumup/route.ts
import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('x-sumup-signature')

  // Verificar assinatura
  const expectedSignature = crypto
    .createHmac('sha256', process.env.SUMUP_SECRET_KEY!)
    .update(body)
    .digest('hex')

  if (signature !== expectedSignature) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  const event = JSON.parse(body)

  // Processar evento
  if (event.event_type === 'CHECKOUT_COMPLETED') {
    // Pagamento confirmado
    const { checkout_reference, amount, status } = event.data

    // Atualizar status da mesa, enviar confirmação, etc.
  }

  return NextResponse.json({ received: true })
}
```

## Split Payment

```typescript
interface SplitPaymentOptions {
  tableId: string
  totalAmount: number
  splitCount: number // Número de pessoas
}

export async function createSplitCheckouts(options: SplitPaymentOptions) {
  const amountPerPerson = options.totalAmount / options.splitCount

  const checkouts = await Promise.all(
    Array.from({ length: options.splitCount }).map((_, i) =>
      createCheckout({
        tableId: options.tableId,
        amount: amountPerPerson,
        items: [{ name: `Parte ${i + 1}/${options.splitCount}`, price: amountPerPerson, quantity: 1 }],
      })
    )
  )

  return checkouts
}
```

## Payment Flow

```
1. Cliente solicita conta
   ↓
2. Sistema calcula total da mesa
   ↓
3. Cria checkout na SumUp API
   ↓
4. Redireciona para SumUp payment page
   ↓
5. Cliente paga (cartão, Apple Pay, Google Pay)
   ↓
6. SumUp processa pagamento
   ↓
7. Webhook notifica sistema
   ↓
8. Sistema confirma e libera mesa
   ↓
9. Cliente é redirecionado de volta (/mesa/[id]?payment=success)
```

## Error Handling

```typescript
try {
  const checkout = await createCheckout(...)
} catch (error) {
  if (error.code === 'INSUFFICIENT_FUNDS') {
    // Cartão recusado
  } else if (error.code === 'INVALID_MERCHANT') {
    // Configuração incorreta
  }
  // Handle error
}
```

## Testing

### Test Mode
SumUp fornece ambiente de testes:

```bash
# .env.local (test)
NEXT_PUBLIC_SUMUP_API_KEY="test_api_key"
SUMUP_MERCHANT_CODE="test_merchant"
```

### Test Cards
- **Sucesso**: 4242 4242 4242 4242
- **Falha**: 4000 0000 0000 0002

## Configuration

```bash
# .env.local
NEXT_PUBLIC_SUMUP_API_KEY="your_api_key"
SUMUP_MERCHANT_CODE="your_merchant_code"
SUMUP_SECRET_KEY="your_secret_key"
NEXT_PUBLIC_APP_URL="https://sofiagastrobar.com"
```

## Resources

- [SumUp API Docs](https://developer.sumup.com/docs/)
- [Checkout API](https://developer.sumup.com/docs/api/checkouts)
- [Webhooks](https://developer.sumup.com/docs/webhooks)

## Security

⚠️ **NEVER** expose `SUMUP_SECRET_KEY` to client
- Use apenas em server-side code
- Valide sempre a assinatura de webhooks
- Use HTTPS em produção
