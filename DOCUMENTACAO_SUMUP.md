# 💳 Documentação Completa - Sistema de Monetização SumUp

**Sofia Gastrobar - Goldmonkey Studio**  
**Versão 1.0**

---

## 🎯 Visão Geral

Sistema completo de pagamentos antecipados integrado com SumUp, permitindo:

- ✅ Reservas pagas (6€ por pessoa)
- ✅ Pagamento antecipado da mesa
- ✅ Pagamento antecipado do delivery
- ✅ Pagamento de músicas no DJ (opcional)
- ✅ Experiências premium

---

## 📋 Funcionalidades Implementadas

### 1. Reserva Paga (6€ por pessoa)

**Fluxo Completo:**

1. Cliente preenche formulário de reserva
2. Sistema calcula: `valor_total = numero_de_pessoas * 6€`
3. Exibe aviso: "Para confirmar sua reserva, cobramos 6€ por pessoa. Este valor será totalmente descontado da sua conta no momento do consumo."
4. Gera link SumUp automaticamente
5. Cliente paga via SumUp
6. Webhook confirma pagamento
7. Reserva confirmada automaticamente
8. Notificação para ChefIApp OS

**Arquivos:**
- `src/app/reservas/page.tsx` (formulário atualizado)
- `src/components/payment/PaymentCheckout.tsx` (UI de pagamento)
- `src/app/reservas/confirmacao/page.tsx` (página de confirmação)

---

### 2. Módulo SumUp Integration

**Estrutura:**
```
src/modules/sumup-integration/
├── README.md
├── lib/
│   ├── sumup.ts (API client)
│   ├── webhook.ts (Webhook handler)
│   └── types.ts (TypeScript types)
```

**Funcionalidades:**
- Geração automática de links de pagamento
- Suporte para diferentes tipos (reserva, mesa, delivery)
- Webhook handler completo
- Verificação de status de pagamento

---

### 3. APIs Criadas

#### `/api/sumup/payment-link`
Cria links de pagamento SumUp

**Request:**
```json
{
  "type": "reservation",
  "reservationId": "123",
  "numberOfPeople": 3,
  "date": "2025-01-20",
  "time": "20:00"
}
```

**Response:**
```json
{
  "success": true,
  "paymentLink": {
    "id": "link_123",
    "amount": 18.00,
    "currency": "EUR",
    "description": "Reserva Sofia Gastrobar...",
    "redirect_url": "https://...",
    "status": "PENDING"
  }
}
```

#### `/api/sumup/webhook`
Recebe eventos de pagamento do SumUp

**Eventos suportados:**
- `payment.succeeded`
- `payment.failed`
- `payment.cancelled`

#### `/api/reservas/[id]/payment`
Atualiza status de pagamento da reserva

#### `/api/reservas/[id]/status`
Verifica status da reserva e pagamento

---

### 4. Database Schema

**Reservation (atualizado):**
```typescript
{
  id: string
  // ... campos existentes
  prepaidAmount?: number // 6€ * pessoas
  paymentLinkId?: string // ID do link SumUp
  paymentStatus?: 'pending' | 'paid' | 'failed' | 'expired' | 'cancelled'
  paidAt?: string // ISO timestamp
}
```

---

## 🔧 Configuração

### Variáveis de Ambiente

Adicione ao `.env.local`:

```env
# SumUp Integration
SUMUP_CLIENT_ID=your_client_id
SUMUP_CLIENT_SECRET=your_client_secret
SUMUP_ACCESS_TOKEN=your_access_token
SUMUP_MERCHANT_CODE=your_merchant_code
SUMUP_WEBHOOK_SECRET=your_webhook_secret
SUMUP_REDIRECT_URI=https://sofiagastrobaribiza.com/api/sumup/callback

# ChefIApp OS Integration
CHEFIAPP_OS_API_URL=https://api.chefiapp.com
CHEFIAPP_OS_API_KEY=your_api_key

# Site URL
NEXT_PUBLIC_SITE_URL=https://sofiagastrobaribiza.com
```

### Configurar Webhook no SumUp

1. Acesse o dashboard SumUp
2. Vá em Settings > Webhooks
3. Adicione URL: `https://sofiagastrobaribiza.com/api/sumup/webhook`
4. Selecione eventos:
   - `payment.succeeded`
   - `payment.failed`
   - `payment.cancelled`
5. Copie o `webhook_secret` e adicione ao `.env.local`

---

## 🚀 Próximos Passos

### Implementar (Pendente)

1. **Pagamento Antecipado da Mesa** (`/mesa/[id]`)
   - Botão "Pagar Agora"
   - Gera link SumUp com total da conta
   - Webhook marca mesa como paga
   - Alerta para garçom

2. **Pagamento Antecipado do Delivery**
   - Cliente paga antes do preparo
   - Zero calote
   - Entrega garantida

3. **Desconto Automático na Conta Final**
   - ChefIApp OS verifica `prepaidAmount`
   - Aplica desconto: `total_final = total_consumo - prepaid`

4. **Integração ChefIApp OS**
   - Notificações em tempo real
   - Sincronização de status
   - Dashboard atualizado

---

## 📊 Benefícios

### Para o Restaurante

- ✅ Zero calote em reservas
- ✅ Redução de no-show em até 80%
- ✅ Fluxo de caixa antecipado
- ✅ Automação completa
- ✅ Menos carga para garçons

### Para o Cliente

- ✅ Conveniência (paga uma vez)
- ✅ Desconto automático na conta
- ✅ Reserva garantida
- ✅ Processo rápido e seguro

---

## 🔒 Segurança

- ✅ Webhook signature verification
- ✅ HTTPS obrigatório
- ✅ Tokens seguros em variáveis de ambiente
- ✅ Validação de dados em todas as APIs

---

## 📝 Notas Importantes

1. **Valor do prepaid:** Atualmente fixo em 6€ por pessoa. Pode ser configurável no futuro.

2. **Desconto automático:** Ainda não implementado. Será feito na integração com ChefIApp OS.

3. **No-show:** Se cliente não comparecer, o restaurante lucra 100% da reserva (política de cancelamento a definir).

4. **Expiração:** Links de pagamento expiram em 1 hora (reservas) ou 30 minutos (mesa/delivery).

---

**Goldmonkey Studio - Sistema de Monetização Completo**

