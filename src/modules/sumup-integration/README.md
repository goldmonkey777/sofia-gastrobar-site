# 💳 SumUp Integration - Sofia Gastrobar

**Módulo oficial Goldmonkey Studio**  
**Versão 1.0**  
**Objetivo:** Sistema completo de pagamentos antecipados e monetização

---

## 🎯 Funcionalidades

### 1. Reserva Paga (6€ por pessoa)
- Cálculo automático: `valor_total = numero_de_pessoas * 6€`
- Link SumUp gerado automaticamente
- Webhook para confirmação
- Desconto automático na conta final

### 2. Pagamento Antecipado da Mesa
- Cliente paga direto pelo QR da mesa
- Sem chamar garçom
- Webhook marca mesa como paga
- Alert para garçom

### 3. Pagamento Antecipado do Delivery
- Cliente paga antes do preparo
- Zero calote
- Zero pedido cancelado
- Entrega garantida

### 4. Pagamento de Músicas no DJ (Opcional)
- 1€ para adicionar música à playlist
- Microtransações
- Engajamento

### 5. Experiências Premium
- Sunset VIP
- Mesa reservada com garrafa
- Menu fechado
- Eventos temáticos

---

## 📁 Estrutura

```
src/modules/sumup-integration/
├── README.md
├── lib/
│   ├── sumup.ts (API client)
│   ├── webhook.ts (Webhook handler)
│   └── types.ts (TypeScript types)
├── components/
│   ├── PaymentButton.tsx
│   ├── CheckoutModal.tsx
│   └── PaymentStatus.tsx
└── hooks/
    └── useSumUpPayment.ts
```

---

## 🔧 Configuração

### Variáveis de Ambiente

```env
SUMUP_CLIENT_ID=your_client_id
SUMUP_CLIENT_SECRET=your_client_secret
SUMUP_ACCESS_TOKEN=your_access_token
SUMUP_WEBHOOK_SECRET=your_webhook_secret
SUMUP_REDIRECT_URI=https://sofiagastrobaribiza.com/api/sumup/callback
```

---

## 🚀 Uso

### Gerar Link de Pagamento

```typescript
import { createPaymentLink } from '@/modules/sumup-integration/lib/sumup'

const link = await createPaymentLink({
  amount: 18.00,
  currency: 'EUR',
  description: 'Reserva Sofia Gastrobar - Mesa X - 15/01 - 3 pessoas',
  redirectUrl: 'https://sofiagastrobaribiza.com/reservas/confirmacao',
  expiresIn: 3600 // 1 hora
})
```

### Webhook Handler

```typescript
import { handleSumUpWebhook } from '@/modules/sumup-integration/lib/webhook'

export async function POST(request: Request) {
  return handleSumUpWebhook(request)
}
```

---

**Goldmonkey Studio - Monetização Completa Sofia Gastrobar**

