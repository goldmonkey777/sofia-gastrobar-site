# 🚀 SumUp Integration - Quick Start Guide

## ⚡ Como Configurar em 5 Minutos

### 1. Obter Credenciais SumUp

1. Acesse: https://developer.sumup.com/
2. Crie uma aplicação
3. Obtenha:
   - Client ID
   - Client Secret
   - Merchant Code

### 2. Configurar Variáveis de Ambiente

**Desenvolvimento Local** (.env.local):
```bash
SUMUP_CLIENT_ID=seu_client_id_aqui
SUMUP_CLIENT_SECRET=seu_client_secret_aqui
SUMUP_MERCHANT_CODE=seu_merchant_code_aqui
SUMUP_WEBHOOK_SECRET=$(openssl rand -hex 32)
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**Produção** (Vercel):
```bash
# Settings > Environment Variables
SUMUP_CLIENT_ID=seu_client_id_aqui
SUMUP_CLIENT_SECRET=seu_client_secret_aqui
SUMUP_MERCHANT_CODE=seu_merchant_code_aqui
SUMUP_WEBHOOK_SECRET=seu_webhook_secret_seguro
NEXT_PUBLIC_SITE_URL=https://sofiagastrobaribiza.com
```

### 3. Configurar Webhook no Dashboard SumUp

URL do Webhook:
```
https://sofiagastrobaribiza.com/api/sumup/webhook
```

Eventos para assinar:
- `payment.succeeded`
- `payment.failed`
- `payment.cancelled`

### 4. Testar

```bash
# Instalar dependências
npm install

# Rodar servidor
npm run dev

# Rodar testes
npx tsx test-sumup-system.ts

# Ver relatório
cat SUMUP-TEST-REPORT.md
```

---

## 📚 Como Usar no Código

### Criar Link de Pagamento para Reserva

```typescript
const response = await fetch('/api/sumup/payment-link', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    type: 'reservation',
    reservationId: 'res-123',
    numberOfPeople: 4,
    date: '2025-12-15',
    time: '20:00',
  }),
})

const { paymentLink } = await response.json()
// Redirecionar para: https://pay.sumup.com/checkout/${paymentLink.id}
```

### Criar Link de Pagamento para Delivery

```typescript
const response = await fetch('/api/sumup/payment-link', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    type: 'delivery',
    deliveryId: 'del-456',
    totalAmount: 35.00,
    deliveryFee: 3.00,
  }),
})

const { paymentLink } = await response.json()
```

### Usar Componente de Checkout

```tsx
import { PaymentCheckout } from '@/components/payment/PaymentCheckout'

<PaymentCheckout
  amount={24.00}
  description="Reserva Sofia Gastrobar – 15/12 20:00 – 4 pessoas"
  paymentLinkId={paymentLink.id}
  onSuccess={() => {
    // Pagamento confirmado
    router.push('/confirmacao')
  }}
  onError={(error) => {
    // Tratar erro
    alert(error)
  }}
/>
```

---

## 🔒 Segurança

### Webhook Signature Validation

O sistema verifica automaticamente a assinatura HMAC-SHA256 de todos os webhooks:

```typescript
// Feito automaticamente em /api/sumup/webhook
const signature = request.headers.get('x-sumup-signature')
const isValid = verifyWebhookSignature(payload, signature, secret)
```

### Sanitização de Inputs

Todos os inputs são validados e sanitizados:

```typescript
// Email
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
if (!emailRegex.test(email)) throw new Error('Email inválido')

// Trim e lowercase
email: body.email.trim().toLowerCase()

// Validação de números
if (guests < 1 || guests > 20) throw new Error('Inválido')
```

---

## 🔄 Fluxos de Pagamento

### Fluxo Reserva

```
1. POST /api/reservas
   → Cria reserva

2. POST /api/sumup/payment-link
   → Cria link de pagamento (6€ × pessoas)

3. Redirect → https://pay.sumup.com/checkout/{id}
   → Cliente paga

4. Webhook → POST /api/sumup/webhook
   → Confirma pagamento

5. Atualiza status → POST /api/reservas/{id}/payment
   → Marca como pago
```

### Fluxo Delivery

```
1. POST /api/delivery
   → Cria pedido

2. POST /api/sumup/payment-link
   → Cria link de pagamento (subtotal + taxa)

3. Redirect → SumUp
   → Cliente paga

4. Webhook → Confirma
   → Notifica cozinha
```

---

## 🐛 Troubleshooting

### Erro: "SUMUP_NOT_CONFIGURED"

**Causa**: Variáveis de ambiente não configuradas

**Solução**:
```bash
# Verificar se variáveis existem
echo $SUMUP_CLIENT_ID
echo $SUMUP_CLIENT_SECRET

# Se vazio, configurar em .env.local
```

### Webhook retorna 401

**Causa**: Assinatura inválida ou `SUMUP_WEBHOOK_SECRET` não configurado

**Solução**:
1. Verificar que `SUMUP_WEBHOOK_SECRET` está configurado
2. Usar o mesmo secret no dashboard SumUp
3. Verificar que o header `x-sumup-signature` está presente

### Pagamento não confirma

**Causa**: Webhook não está sendo chamado

**Solução**:
1. Verificar URL do webhook no dashboard SumUp
2. Verificar logs do Vercel: `vercel logs`
3. Testar webhook manualmente:

```bash
curl -X POST https://seu-site.com/api/sumup/webhook \
  -H "Content-Type: application/json" \
  -H "x-sumup-signature: YOUR_SIGNATURE" \
  -d '{"event_type":"payment.succeeded",...}'
```

---

## 📊 Monitoramento

### Logs Importantes

```typescript
// Pagamento criado
console.log('Payment link created:', {
  reservationId,
  amount,
  paymentLinkId,
})

// Webhook recebido
console.log('Webhook received:', {
  event_type,
  reference,
  amount,
  status,
})

// Erro
console.error('Payment error:', error)
```

### Métricas para Monitorar

- Taxa de conversão (reservas → pagamentos)
- Tempo médio de pagamento
- Taxa de falha de webhooks
- Erros de validação

---

## 🧪 Testes

### Rodar Todos os Testes

```bash
npx tsx test-sumup-system.ts
```

### Testar Endpoint Específico

```bash
# Criar reserva
curl -X POST http://localhost:3000/api/reservas \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "phone": "+34600000000",
    "date": "2025-12-15",
    "time": "20:00",
    "guests": 4
  }'

# Criar payment link
curl -X POST http://localhost:3000/api/sumup/payment-link \
  -H "Content-Type: application/json" \
  -d '{
    "type": "reservation",
    "reservationId": "res-123",
    "numberOfPeople": 4,
    "date": "2025-12-15",
    "time": "20:00"
  }'
```

---

## 📞 Suporte

- **Documentação SumUp**: https://developer.sumup.com/docs
- **Suporte SumUp**: support@sumup.com
- **Status Page**: https://status.sumup.com
- **Relatório de Testes**: SUMUP-TEST-REPORT.md

---

## ✅ Checklist de Deploy

Antes de fazer deploy para produção:

- [ ] Credenciais SumUp configuradas
- [ ] Webhook URL configurada no dashboard
- [ ] `SUMUP_WEBHOOK_SECRET` configurado e seguro
- [ ] `NEXT_PUBLIC_SITE_URL` correto
- [ ] Testes executados e passando
- [ ] Teste de pagamento real (€0.50)
- [ ] Logs de webhook funcionando
- [ ] Monitoramento configurado

---

**Última atualização**: 2025-12-06
**Versão**: 1.0.0
