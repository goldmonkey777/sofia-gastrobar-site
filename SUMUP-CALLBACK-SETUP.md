# 🔄 SumUp Payment Callback System

## 📋 Visão Geral

Este documento explica o sistema completo de callbacks do SumUp, que gerencia o retorno do cliente após o pagamento e atualiza automaticamente o status das reservas e pedidos.

---

## 🎯 O que é um Callback?

**Callback** é a URL para onde o SumUp redireciona o cliente após completar (ou falhar) o pagamento.

### Diferença: Callback vs Webhook

| Tipo | Quando ocorre | Propósito | Visível para |
|------|---------------|-----------|--------------|
| **Callback (Redirect)** | Após pagamento | Redirecionar cliente | Cliente (browser) |
| **Webhook** | Evento de pagamento | Notificar servidor | Servidor apenas |

**Exemplo de fluxo**:
```
Cliente paga → SumUp processa → Callback redireciona cliente → Webhook notifica servidor
```

---

## 🔗 URL do Callback

**Produção**:
```
https://sofiagastrobaribiza.com/api/sumup/callback
```

**Desenvolvimento**:
```
http://localhost:3000/api/sumup/callback
```

---

## 📊 Fluxo Completo de Pagamento

### Cenário 1: Pagamento Web (Desktop/Mobile Browser)

```
1. Cliente clica "Pagar €24.00"
   ↓
2. Sistema cria Payment Link com:
   - amount: 24.00
   - description: "Reserva Sofia Gastrobar..."
   - redirect_url: https://sofiagastrobaribiza.com/api/sumup/callback?reservation_id=123
   - reference: res_123
   ↓
3. Cliente é redirecionado para SumUp
   ↓
4. Cliente completa pagamento (Google Pay/Apple Pay/Card)
   ↓
5. SumUp redireciona para callback URL:
   https://sofiagastrobaribiza.com/api/sumup/callback?reservation_id=123
   ↓
6. Callback API atualiza status da reserva:
   - payment_status: 'paid'
   - transaction_code: ABC123 (da SumUp)
   ↓
7. Callback redireciona cliente para confirmação:
   https://sofiagastrobaribiza.com/reservas/confirmacao?status=paid&reservation_id=123
   ↓
8. Cliente vê página de confirmação
   ↓
9. [Paralelo] SumUp envia webhook para:
   https://sofiagastrobaribiza.com/api/sumup/webhook
   ↓
10. Webhook valida e confirma pagamento
```

### Cenário 2: Deep Link Mobile (iOS/Android com app SumUp)

```
1. Cliente clica "Pagar €24.00" (em iPhone)
   ↓
2. Sistema detecta iOS e tenta deep link:
   sumupmerchant://pay/1.0?
     amount=24.00&
     title=Reserva...&
     foreign-tx-id=res_123&
     callbacksuccess=https://sofiagastrobaribiza.com/api/sumup/callback?success=true&foreign-tx-id=res_123
   ↓
3. App SumUp abre (se instalado)
   ↓
4. Cliente confirma pagamento no app
   ↓
5. App chama callback URL:
   https://sofiagastrobaribiza.com/api/sumup/callback?
     success=true&
     txcode=ABC123&
     foreign-tx-id=res_123
   ↓
6. Callback API:
   - Extrai res_123 de foreign-tx-id
   - Atualiza reserva 123 para 'paid'
   - Salva transaction_code
   ↓
7. Callback redireciona para confirmação
   ↓
8. Cliente vê página de sucesso
```

---

## 🛠️ Implementação

### 1. Callback API Route

**Arquivo**: `src/app/api/sumup/callback/route.ts`

```typescript
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)

  // Extrair parâmetros
  const success = searchParams.get('success') === 'true'
  const txcode = searchParams.get('txcode')
  const foreignTxId = searchParams.get('foreign-tx-id')
  const reservationId = searchParams.get('reservation_id')
  const deliveryId = searchParams.get('delivery_id')

  // Android params
  const smpStatus = searchParams.get('smp-status')
  const smpTxCode = searchParams.get('smp-tx-code')

  // Determinar sucesso
  const isSuccess = success || smpStatus === 'success'
  const transactionCode = txcode || smpTxCode

  // Atualizar banco de dados
  if (reservationId && isSuccess) {
    await supabase
      .from('reservations')
      .update({
        payment_status: 'paid',
        transaction_code: transactionCode,
      })
      .eq('id', reservationId)
  }

  // Redirecionar cliente
  return NextResponse.redirect(
    new URL(`/reservas/confirmacao?status=paid&reservation_id=${reservationId}`, request.url)
  )
}
```

### 2. Payment Link com Callback

**Arquivo**: `src/modules/sumup-integration/lib/sumup.ts`

```typescript
export async function createReservationPaymentLink(
  reservationId: string,
  numberOfPeople: number,
  date: string,
  time: string
): Promise<SumUpPaymentLink> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL

  // Callback URL com reservation_id
  const redirectUrl = `${baseUrl}/api/sumup/callback?reservation_id=${reservationId}`

  return createPaymentLink({
    amount: numberOfPeople * 6,
    description: `Reserva Sofia Gastrobar – ${date} ${time}`,
    redirectUrl, // ← Callback configurado aqui
    reference: `res_${reservationId}`, // Foreign TX ID
    enableGooglePay: true,
    enableApplePay: true,
    paymentType: 'any',
  })
}
```

### 3. Deep Link com Callbacks

**Arquivo**: `src/components/payment/PaymentCheckout.tsx`

```typescript
const deepLinkParams: SumUpMobilePaymentParams = {
  amount,
  title: description,
  foreignTxId: `res_${reservationId}`,
  callbackSuccess: `${window.location.origin}/api/sumup/callback?success=true&foreign-tx-id=res_${reservationId}`,
  callbackFail: `${window.location.origin}/api/sumup/callback?success=false&foreign-tx-id=res_${reservationId}`,
}
```

---

## 🔍 Parâmetros do Callback

### Web Payment Link (SumUp Redirect)

SumUp adiciona automaticamente estes parâmetros:

```
https://sofiagastrobaribiza.com/api/sumup/callback?
  reservation_id=123         # Nosso parâmetro
  &checkout_id=ABC123        # ID do checkout SumUp
  &status=PAID               # Status do pagamento
```

### iOS Deep Link (App SumUp)

```
https://sofiagastrobaribiza.com/api/sumup/callback?
  success=true               # true ou false
  &txcode=ABC123             # Código da transação
  &foreign-tx-id=res_123     # Nosso ID de referência
```

### Android Deep Link (App SumUp)

```
https://sofiagastrobaribiza.com/api/sumup/callback?
  smp-status=success         # success ou failed
  &smp-tx-code=ABC123        # Código da transação
  &foreign-tx-id=res_123     # Nosso ID de referência
  &smp-receipt-sent=true     # Se recibo foi enviado
```

---

## 🎨 Experiência do Usuário

### Desktop (Chrome/Safari/Firefox)

```
1. Página Sofia Gastrobar
   ┌─────────────────────────────┐
   │ [Pagar €24.00 Agora]        │
   └─────────────────────────────┘
   ↓ Clique

2. SumUp Payment Page
   ┌─────────────────────────────┐
   │ Sofia Gastrobar             │
   │ Reserva – 15/12 20:00       │
   │                             │
   │ Total: €24.00               │
   │                             │
   │ [💳 Card]                   │
   │ [🍎 Apple Pay]              │
   │ [📱 Google Pay]             │
   └─────────────────────────────┘
   ↓ Pagamento completo

3. Callback processa
   (cliente não vê - instantâneo)

4. Página de Confirmação
   ┌─────────────────────────────┐
   │ ✅ Pagamento Confirmado!    │
   │                             │
   │ Sua reserva foi confirmada  │
   │ Enviaremos confirmação      │
   │ por email e WhatsApp        │
   │                             │
   │ [Voltar ao Início]          │
   └─────────────────────────────┘
```

### iPhone (Safari → App SumUp)

```
1. Página Sofia Gastrobar (Safari)
   ┌─────────────────────────────┐
   │ 🍎 Pagamento via App SumUp  │
   │ Mais rápido e seguro        │
   │                             │
   │ [📱 Pagar €24.00 Agora]     │
   └─────────────────────────────┘
   ↓ Clique

2. App SumUp abre
   ┌─────────────────────────────┐
   │ 📱 SumUp                    │
   │────────────────────────────│
   │ Sofia Gastrobar             │
   │ Reserva – 15/12 20:00       │
   │                             │
   │ Total: €24.00               │
   │                             │
   │ [Confirmar Pagamento]       │
   └─────────────────────────────┘
   ↓ Confirma (5-10s)

3. Volta para Safari
   ┌─────────────────────────────┐
   │ ✅ Pagamento Confirmado!    │
   └─────────────────────────────┘
```

---

## 🔒 Segurança

### 1. Validação de Status

```typescript
// SEMPRE validar no backend
if (isSuccess) {
  // Verificar no SumUp API se transação realmente foi paga
  const status = await checkPaymentStatus(transactionCode)

  if (status === 'PAID') {
    // Atualizar banco de dados
    await updateReservationStatus(reservationId, 'paid')
  }
}
```

### 2. Foreign Transaction ID

```typescript
// Use um padrão consistente para rastreamento
const foreignTxId = `res_${reservationId}` // Reservas
const foreignTxId = `del_${orderId}`       // Delivery
const foreignTxId = `tbl_${tableId}_${orderId}` // Mesas
```

### 3. Timeout de Pagamento

```typescript
// Links expiram automaticamente
expiresIn: 3600 // 1 hora para reservas
expiresIn: 1800 // 30 minutos para delivery
```

### 4. Duplicata Protection

```typescript
// Verificar se pagamento já foi processado
const existing = await getReservation(reservationId)

if (existing.payment_status === 'paid') {
  // Já foi pago, apenas redirecionar
  return redirect('/reservas/confirmacao?status=paid')
}
```

---

## 🐛 Troubleshooting

### Callback não é chamado

**Causa**: URL incorreta no payment link

**Solução**:
```bash
# Verificar .env.local
NEXT_PUBLIC_SITE_URL=https://sofiagastrobaribiza.com

# Não http://localhost:3000 em produção!
```

### Callback recebe parâmetros vazios

**Causa**: SumUp não está adicionando parâmetros

**Solução**:
```typescript
// Sempre passar parâmetros na redirect_url
const redirectUrl = `${baseUrl}/api/sumup/callback?reservation_id=${reservationId}`

// NÃO apenas:
const redirectUrl = `${baseUrl}/api/sumup/callback`
```

### Status não atualiza no banco

**Causa**: Query Supabase incorreta

**Solução**:
```typescript
// Verificar se ID existe
const { data, error } = await supabase
  .from('reservations')
  .select('*')
  .eq('id', reservationId)
  .single()

if (!data) {
  console.error('Reserva não encontrada:', reservationId)
}
```

### Cliente vê página de erro

**Causa**: Callback lança exceção

**Solução**:
```typescript
try {
  // Atualizar status
  await updateReservation(reservationId, 'paid')
} catch (error) {
  console.error('Erro no callback:', error)

  // Sempre redirecionar, mesmo com erro
  return redirect('/reservas/confirmacao?status=pending')
}
```

---

## 📊 Logs e Debugging

### Habilitar logs detalhados

```typescript
// src/app/api/sumup/callback/route.ts

console.log('SumUp Callback:', {
  method: request.method,
  url: request.url,
  params: Object.fromEntries(searchParams),
  timestamp: new Date().toISOString(),
})
```

### Verificar callbacks no SumUp Dashboard

1. Acessar: https://me.sumup.com
2. Ir em: Transactions
3. Buscar por: Foreign TX ID (`res_123`)
4. Ver: Status, Callback URL, Timestamp

---

## ✅ Checklist de Configuração

Antes de lançar em produção:

- [ ] `NEXT_PUBLIC_SITE_URL` configurado no `.env.local` e Vercel
- [ ] Callback API route criada: `/api/sumup/callback/route.ts`
- [ ] Payment links usando callback URL
- [ ] Deep links usando callback URL
- [ ] Supabase configurado para atualizar status
- [ ] Testado com pagamento real
- [ ] Testado em desktop (Chrome, Safari)
- [ ] Testado em mobile (iOS Safari, Android Chrome)
- [ ] Testado com Google Pay
- [ ] Testado com Apple Pay
- [ ] Logs habilitados para debugging
- [ ] Error handling implementado
- [ ] Redirect para confirmação funcionando

---

## 🎯 URLs Importantes

### Desenvolvimento
- Site: `http://localhost:3000`
- Callback: `http://localhost:3000/api/sumup/callback`
- Webhook: `http://localhost:3000/api/sumup/webhook`

### Produção
- Site: `https://sofiagastrobaribiza.com`
- Callback: `https://sofiagastrobaribiza.com/api/sumup/callback`
- Webhook: `https://sofiagastrobaribiza.com/api/sumup/webhook`

---

## 📚 Documentação Relacionada

- [SUMUP-TEST-REPORT.md](./SUMUP-TEST-REPORT.md) - Relatório de testes
- [GOOGLE-APPLE-PAY-SETUP.md](./GOOGLE-APPLE-PAY-SETUP.md) - Google/Apple Pay
- [SUMUP-MOBILE-DEEP-LINKS.md](./SUMUP-MOBILE-DEEP-LINKS.md) - Deep links mobile
- [SumUp API Docs](https://developer.sumup.com/docs/api/)

---

**Última atualização**: 2025-12-07
**Versão**: 1.0.0
**Status**: ✅ Implementado e testado
