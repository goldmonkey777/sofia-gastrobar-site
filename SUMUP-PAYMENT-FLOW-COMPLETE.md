# 🔄 Fluxo Completo de Pagamento SumUp - Sofia Gastrobar

## 📊 Visão Geral do Sistema

Este documento mostra o fluxo COMPLETO de pagamento, desde o clique do cliente até a confirmação final.

---

## 🎬 Cenário 1: Turista Europeu com Google Pay (Desktop)

```
┌─────────────────────────────────────────────────────────────────────┐
│ PARTE 1: Cliente faz reserva                                        │
└─────────────────────────────────────────────────────────────────────┘

1️⃣ Cliente acessa: https://sofiagastrobaribiza.com/reservas
   ├─ Preenche formulário:
   │  ├─ Nome: "Hans Schmidt"
   │  ├─ Email: "hans@example.com"
   │  ├─ Telefone: "+49 123 456"
   │  ├─ Data: 15/12/2025
   │  ├─ Hora: 20:00
   │  └─ Pessoas: 4
   └─ Clica em [Fazer Reserva]

2️⃣ Frontend cria reserva:
   POST /api/reservas
   {
     "name": "Hans Schmidt",
     "email": "hans@example.com",
     "phone": "+49 123 456",
     "date": "2025-12-15",
     "time": "20:00",
     "numberOfPeople": 4
   }

3️⃣ Backend:
   ├─ Salva reserva no Supabase
   │  └─ ID: abc-123-def-456
   │     payment_status: 'pending'
   │     created_at: 2025-12-07T10:00:00Z
   │
   └─ Cria Payment Link SumUp:
      POST https://api.sumup.com/v0.1/checkouts
      {
        "amount": "24.00",           // 4 pessoas × 6€
        "currency": "EUR",
        "description": "Reserva Sofia Gastrobar – 15/12 20:00 – 4 pessoas",
        "redirect_url": "https://sofiagastrobaribiza.com/api/sumup/callback?reservation_id=abc-123-def-456",
        "reference": "res_abc-123-def-456",
        "payment_type": "any",        // ← Google/Apple Pay habilitado!
        "personal_details": {
          "email": "contact@goldmonkey.studio"
        }
      }

4️⃣ SumUp responde:
   {
     "id": "sumup-checkout-xyz789",
     "status": "PENDING",
     "checkout_url": "https://pay.sumup.com/q/abc123xyz"
   }

5️⃣ Frontend redireciona cliente:
   window.location.href = "https://pay.sumup.com/q/abc123xyz"

┌─────────────────────────────────────────────────────────────────────┐
│ PARTE 2: Cliente na página SumUp                                    │
└─────────────────────────────────────────────────────────────────────┘

6️⃣ Cliente vê SumUp Payment Page:
   ┌──────────────────────────────────────────┐
   │  🍽️ Sofia Gastrobar                      │
   │  ─────────────────────────────────────   │
   │                                          │
   │  Reserva – 15/12 20:00 – 4 pessoas      │
   │                                          │
   │  Total: €24.00                           │
   │                                          │
   │  ┌────────────────────────────────────┐ │
   │  │  💳 Cartão de Crédito/Débito       │ │
   │  └────────────────────────────────────┘ │
   │                                          │
   │  ┌────────────────────────────────────┐ │
   │  │  📱 Google Pay                     │ │ ← Disponível!
   │  └────────────────────────────────────┘ │
   │                                          │
   │  ┌────────────────────────────────────┐ │
   │  │  🍎 Apple Pay                      │ │ ← Disponível!
   │  └────────────────────────────────────┘ │
   │                                          │
   │  🔒 Pagamento seguro                    │
   └──────────────────────────────────────────┘

7️⃣ Cliente clica em [Google Pay]
   ├─ Browser abre Google Pay popup
   ├─ Hans seleciona cartão salvo
   ├─ Confirma com biometria/PIN
   └─ Pagamento processado (2-3 segundos)

8️⃣ SumUp processa pagamento:
   ├─ Valida com banco emissor
   ├─ Aprova transação
   ├─ Gera transaction_code: "TXABC123XYZ"
   └─ Marca checkout como PAID

┌─────────────────────────────────────────────────────────────────────┐
│ PARTE 3: Callback e atualização de status                           │
└─────────────────────────────────────────────────────────────────────┘

9️⃣ SumUp redireciona cliente:
   Browser → https://sofiagastrobaribiza.com/api/sumup/callback?
             reservation_id=abc-123-def-456&
             checkout_id=sumup-checkout-xyz789&
             status=PAID

🔟 Callback API executa:
   GET /api/sumup/callback

   ├─ Extrai parâmetros:
   │  ├─ reservation_id: abc-123-def-456
   │  ├─ checkout_id: sumup-checkout-xyz789
   │  └─ status: PAID
   │
   ├─ Atualiza Supabase:
   │  UPDATE reservations
   │  SET payment_status = 'paid',
   │      transaction_code = 'TXABC123XYZ',
   │      updated_at = NOW()
   │  WHERE id = 'abc-123-def-456'
   │
   └─ Redireciona cliente:
      → /reservas/confirmacao?status=paid&reservation_id=abc-123-def-456

1️⃣1️⃣ Cliente vê página de confirmação:
   ┌──────────────────────────────────────────┐
   │  ✅ Pagamento Confirmado!                │
   │  ─────────────────────────────────────   │
   │                                          │
   │  Sua reserva foi confirmada com sucesso! │
   │                                          │
   │  📅 Data: 15/12/2025 às 20:00           │
   │  👥 Pessoas: 4                           │
   │  💶 Valor pago: €24.00                   │
   │                                          │
   │  📧 Confirmação enviada para:            │
   │     hans@example.com                     │
   │                                          │
   │  📱 WhatsApp de confirmação em breve     │
   │                                          │
   │  ┌────────────────────────────────────┐ │
   │  │  🏠 Voltar ao Início                │ │
   │  └────────────────────────────────────┘ │
   └──────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│ PARTE 4: Webhook (em paralelo)                                      │
└─────────────────────────────────────────────────────────────────────┘

1️⃣2️⃣ SumUp envia webhook (logo após pagamento):
   POST https://sofiagastrobaribiza.com/api/sumup/webhook
   Headers:
     X-SumUp-Signature: sha256=abc123...
   Body:
     {
       "event_type": "CHECKOUT.COMPLETED",
       "checkout_id": "sumup-checkout-xyz789",
       "amount": "24.00",
       "currency": "EUR",
       "status": "PAID",
       "transaction_code": "TXABC123XYZ",
       "merchant_code": "MNAAKKUV",
       "reference": "res_abc-123-def-456",
       "timestamp": "2025-12-07T10:02:30Z"
     }

1️⃣3️⃣ Webhook handler:
   ├─ Valida assinatura HMAC-SHA256
   ├─ Verifica que evento é CHECKOUT.COMPLETED
   ├─ Extrai reference: res_abc-123-def-456
   ├─ Atualiza Supabase (double-check):
   │  UPDATE reservations
   │  SET payment_status = 'paid',
   │      transaction_code = 'TXABC123XYZ',
   │      webhook_received = true
   │  WHERE id = 'abc-123-def-456'
   │
   └─ Responde 200 OK para SumUp

1️⃣4️⃣ Backend envia confirmações:
   ├─ Email para hans@example.com
   │  "✅ Reserva confirmada para 15/12 às 20:00"
   │
   └─ WhatsApp para +49 123 456
      "Olá Hans! Sua reserva está confirmada..."
```

**⏱️ TEMPO TOTAL: ~30-60 segundos**

---

## 🎬 Cenário 2: Turista Americano com Apple Pay (iPhone)

```
┌─────────────────────────────────────────────────────────────────────┐
│ PARTE 1: Cliente em iPhone Safari                                   │
└─────────────────────────────────────────────────────────────────────┘

1️⃣ Cliente acessa site no iPhone Safari:
   https://sofiagastrobaribiza.com/reservas

2️⃣ Preenche formulário:
   ├─ Nome: "John Smith"
   ├─ 2 pessoas
   ├─ 16/12/2025 às 21:00
   └─ Clica [Fazer Reserva]

3️⃣ Sistema cria reserva (ID: xyz-789-abc)
   └─ Gera payment link SumUp

4️⃣ Frontend detecta iOS:
   ├─ PaymentCheckout.tsx: isIOS() → true
   ├─ Mostra badge:
   │  "🍎 Pagamento via App SumUp (iOS)"
   │  "Mais rápido e seguro"
   └─ Botão: [📱 Pagar €12.00 Agora]

┌─────────────────────────────────────────────────────────────────────┐
│ PARTE 2: Tentativa de Deep Link (se app instalado)                  │
└─────────────────────────────────────────────────────────────────────┘

5️⃣ Cliente clica [Pagar]:

   A) Se app SumUp INSTALADO:
      ├─ Browser tenta: sumupmerchant://pay/1.0?
      │                  amount=12.00&
      │                  currency=EUR&
      │                  title=Reserva...&
      │                  foreign-tx-id=res_xyz-789-abc&
      │                  callbacksuccess=https://sofiagastrobaribiza.com/api/sumup/callback?success=true
      │
      ├─ iOS abre app SumUp (1-2s)
      │  ┌────────────────────────────────┐
      │  │ 📱 SumUp                       │
      │  │────────────────────────────────│
      │  │ Sofia Gastrobar                │
      │  │ Reserva – 16/12 21:00          │
      │  │                                │
      │  │ Total: €12.00                  │
      │  │                                │
      │  │ [🍎 Apple Pay]                 │
      │  │ [💳 Cartão]                    │
      │  └────────────────────────────────┘
      │
      ├─ John clica [Apple Pay]
      ├─ Face ID confirma (1s)
      ├─ Pagamento processado (2s)
      │
      └─ App chama callback:
         safari: https://sofiagastrobaribiza.com/api/sumup/callback?
                 success=true&
                 txcode=TXDEF456&
                 foreign-tx-id=res_xyz-789-abc

   B) Se app SumUp NÃO instalado:
      ├─ Deep link falha (timeout 2s)
      ├─ Fallback para web:
      │  window.location.href = "https://pay.sumup.com/q/xyz123"
      │
      └─ Continua como cenário 1 (web payment)

┌─────────────────────────────────────────────────────────────────────┐
│ PARTE 3: Callback processa (cenário A - app instalado)              │
└─────────────────────────────────────────────────────────────────────┘

6️⃣ Callback API recebe:
   GET /api/sumup/callback?
       success=true&
       txcode=TXDEF456&
       foreign-tx-id=res_xyz-789-abc

   ├─ Extrai: res_xyz-789-abc → reservation_id: xyz-789-abc
   ├─ Atualiza Supabase:
   │  payment_status: 'paid'
   │  transaction_code: 'TXDEF456'
   │
   └─ Redireciona:
      → /reservas/confirmacao?status=paid&reservation_id=xyz-789-abc

7️⃣ Safari mostra confirmação:
   ✅ Pagamento Confirmado!

8️⃣ Webhook SumUp confirma (paralelo):
   POST /api/sumup/webhook
   └─ Double-check: payment_status = 'paid'
```

**⏱️ TEMPO TOTAL: ~5-10 segundos ⚡**

---

## 🎬 Cenário 3: Delivery com Pagamento Antecipado

```
┌─────────────────────────────────────────────────────────────────────┐
│ PARTE 1: Cliente faz pedido delivery                                │
└─────────────────────────────────────────────────────────────────────┘

1️⃣ Cliente em Android Chrome:
   https://sofiagastrobaribiza.com/delivery

2️⃣ Monta pedido:
   ├─ 2x Paella Valenciana: €24.00
   ├─ 1x Sangria Jarra: €12.00
   ├─ Subtotal: €36.00
   └─ Taxa entrega: €3.00
      TOTAL: €39.00

3️⃣ Seleciona pagamento:
   └─ [✓] Pagar Agora (obrigatório para delivery)

4️⃣ Sistema cria pedido (ID: del_001):
   └─ Gera payment link:
      POST /api/sumup/payment-link
      {
        "type": "delivery",
        "deliveryId": "del_001",
        "totalAmount": 36.00,
        "deliveryFee": 3.00
      }

5️⃣ Backend cria payment link:
   {
     "amount": "39.00",
     "description": "Delivery Sofia Gastrobar – Pedido del_001",
     "redirect_url": "https://sofiagastrobaribiza.com/api/sumup/callback?delivery_id=del_001",
     "reference": "del_del_001",
     "payment_type": "any"
   }

┌─────────────────────────────────────────────────────────────────────┐
│ PARTE 2: Pagamento Mobile (Android)                                 │
└─────────────────────────────────────────────────────────────────────┘

6️⃣ Cliente em Android:
   ├─ Detectado: isAndroid() → true
   ├─ Badge: "🤖 Pagamento via App SumUp (Android)"
   └─ Clica: [📱 Pagar €39.00 Agora]

7️⃣ Se app SumUp instalado:
   ├─ Intent URL: sumupmerchant://pay/1.0?...
   ├─ App abre
   ├─ Google Pay confirma (biometria)
   └─ Callback:
      https://sofiagastrobaribiza.com/api/sumup/callback?
      smp-status=success&
      smp-tx-code=TXGHI789&
      foreign-tx-id=del_del_001

8️⃣ Callback API:
   ├─ Extrai: del_del_001 → delivery_id: del_001
   ├─ Atualiza pedido:
   │  UPDATE delivery_orders
   │  SET payment_status = 'paid',
   │      transaction_code = 'TXGHI789'
   │  WHERE id = 'del_001'
   │
   └─ Redireciona:
      → /delivery/confirmacao?status=paid&order_id=del_001

┌─────────────────────────────────────────────────────────────────────┐
│ PARTE 3: Confirmação e preparo                                      │
└─────────────────────────────────────────────────────────────────────┘

9️⃣ Cliente vê confirmação:
   ✅ Pagamento Confirmado!
   🍽️ Seu pedido está sendo preparado
   ⏱️ Tempo estimado: 30-40 minutos

🔟 Backend notifica cozinha:
   ├─ Alert no painel admin
   ├─ Email para cozinha
   └─ Status: PAID → EM_PREPARO

1️⃣1️⃣ Webhook confirma (paralelo):
   └─ Double-check payment_status
```

**⏱️ TEMPO TOTAL: ~8-15 segundos**

---

## 📊 Comparação de Performance

| Método | Device | Passos | Tempo | UX |
|--------|--------|--------|-------|-----|
| **Web + Google Pay** | Desktop | 6 cliques | 30-45s | ⭐⭐⭐⭐ |
| **Web + Apple Pay** | Desktop | 6 cliques | 30-45s | ⭐⭐⭐⭐ |
| **Web + Card** | Desktop | 8+ cliques | 45-60s | ⭐⭐⭐ |
| **Deep Link + Google Pay** | Android | 3 cliques | 5-10s | ⭐⭐⭐⭐⭐ |
| **Deep Link + Apple Pay** | iOS | 3 cliques | 5-10s | ⭐⭐⭐⭐⭐ |
| **Web Fallback** | Mobile | 6 cliques | 30-45s | ⭐⭐⭐⭐ |

---

## ✅ Pontos de Validação

### 1️⃣ Antes do Pagamento
- ✅ Formulário validado
- ✅ Disponibilidade verificada
- ✅ Preço calculado corretamente

### 2️⃣ Durante o Pagamento
- ✅ Payment link gerado com sucesso
- ✅ Google/Apple Pay habilitados
- ✅ Device detectado (mobile/desktop)
- ✅ Deep link tentado (se mobile)

### 3️⃣ Após o Pagamento
- ✅ Callback recebido
- ✅ Status atualizado no Supabase
- ✅ Cliente redirecionado
- ✅ Confirmação exibida

### 4️⃣ Webhook (Confirmação Final)
- ✅ Webhook recebido
- ✅ Assinatura validada
- ✅ Double-check de status
- ✅ Notificações enviadas

---

## 🔐 Segurança em Cada Etapa

### Payment Link Creation
```typescript
// Validar ANTES de criar link
if (numberOfPeople < 1 || numberOfPeople > 20) {
  throw new Error('Número de pessoas inválido')
}

if (amount <= 0) {
  throw new Error('Valor inválido')
}
```

### Callback Handling
```typescript
// Validar parâmetros
if (!reservationId || !isSuccess) {
  return redirect('/error')
}

// Verificar se existe
const reservation = await getReservation(reservationId)
if (!reservation) {
  return redirect('/not-found')
}

// Prevenir duplicatas
if (reservation.payment_status === 'paid') {
  return redirect('/already-paid')
}
```

### Webhook Validation
```typescript
// Validar assinatura HMAC
const signature = request.headers.get('X-SumUp-Signature')
const calculatedSig = calculateHMAC(body, WEBHOOK_SECRET)

if (signature !== calculatedSig) {
  return new Response('Invalid signature', { status: 401 })
}
```

---

## 📈 Métricas Importantes

### Tracking de Conversão
```typescript
// Analytics em cada etapa
analytics.track('reservation_started', { numberOfPeople })
analytics.track('payment_initiated', { amount, method: 'sumup' })
analytics.track('payment_completed', { transactionCode, timeToComplete })
analytics.track('confirmation_viewed', { reservationId })
```

### KPIs do Sistema
- **Taxa de conversão**: % que completa pagamento
- **Tempo médio**: Tempo do clique até confirmação
- **Método preferido**: Google Pay vs Apple Pay vs Card
- **Taxa de deep link**: % que usa app vs web
- **Taxa de sucesso**: % de pagamentos bem-sucedidos

---

**Última atualização**: 2025-12-07
**Status**: ✅ Sistema completo implementado
**Performance**: 5-10s (deep link) | 30-60s (web)
