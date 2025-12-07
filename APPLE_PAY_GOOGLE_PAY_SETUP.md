# 🍎💳 Apple Pay & Google Pay - SumUp Integration

**Data:** 2025-01-27  
**Status:** ✅ Integração direta implementada conforme documentação oficial

**Documentação:**
- [SumUp APM Guide](https://developer.sumup.com/online-payments/apm/integration-guide)
- [Apple Pay Direct Integration](https://developer.sumup.com/online-payments/apm/apple-pay)
- [Google Pay Direct Integration](https://developer.sumup.com/online-payments/apm/google-pay)

---

## ✅ O QUE FOI IMPLEMENTADO

### 1. Funções de API
- ✅ `getAvailablePaymentMethods()` - Obtém métodos disponíveis
- ✅ `processCheckout()` - Processa checkout com método específico
- ✅ API Routes criadas:
  - `/api/sumup/payment-methods` - GET métodos disponíveis
  - `/api/sumup/process-checkout` - POST processar checkout

### 2. Tipos TypeScript
- ✅ `PaymentMethod` - Interface para métodos de pagamento
- ✅ `ProcessCheckoutParams` - Parâmetros para processar checkout
- ✅ `ProcessedCheckout` - Resposta do checkout processado
- ✅ `NextStep` - Para fluxos de redirect

### 3. Arquivo Apple Pay
- ✅ `apple-developer-merchantid-domain-association` configurado
- ✅ Acessível em: `/.well-known/apple-developer-merchantid-domain-association`

---

## 📋 COMO FUNCIONA

### Fluxo Básico

1. **Criar Checkout** (já implementado)
   ```typescript
   const checkout = await createPaymentLink({...})
   ```

2. **Obter Métodos Disponíveis**
   ```typescript
   const methods = await getAvailablePaymentMethods(checkout.id)
   // Retorna: ['card', 'apple_pay', 'google_pay', ...]
   ```

3. **Processar com Método Específico**
   ```typescript
   const processed = await processCheckout({
     checkoutId: checkout.id,
     paymentType: 'apple_pay', // ou 'google_pay'
     personalDetails: {
       email: 'cliente@email.com',
       first_name: 'João',
       last_name: 'Silva',
     }
   })
   ```

4. **Lidar com Resposta**
   - Se `status === 'PENDING'` e `next_step` existe → Redirect flow
   - Se `status === 'PAID'` → Pagamento concluído
   - Se `boleto`, `pix`, `qr_code_pix` existem → Artifact flow

---

## 🔄 FLUXOS SUPORTADOS

### Redirect Flow (Apple Pay, Google Pay, Blik, etc.)
```typescript
if (processed.next_step) {
  // Redirecionar para URL
  if (processed.next_step.method === 'GET') {
    window.location.href = processed.next_step.url
  } else if (processed.next_step.method === 'POST') {
    // Fazer POST com payload
  }
}
```

### Artifact Flow (Boleto, PIX)
```typescript
if (processed.pix) {
  // Mostrar QR code ou código PIX
  const qrCode = processed.pix.artefacts.find(a => a.name === 'barcode')
  const code = processed.pix.artefacts.find(a => a.name === 'code')
}
```

---

## 🍎 APPLE PAY - Integração Direta

### Requisitos
- ✅ Arquivo de associação configurado: `/.well-known/apple-developer-merchantid-domain-association`
- ✅ Merchant ID configurado no Apple Developer
- ✅ Apple Pay habilitado no SumUp Dashboard
- ✅ Domínio verificado no Apple Developer

### Componente React
```tsx
import { ApplePayButton } from '@/components/payment/ApplePayButton'

<ApplePayButton
  checkoutId={checkout.id}
  amount={18.00}
  currency="EUR"
  countryCode="ES"
  onSuccess={() => console.log('Pagamento concluído!')}
  onError={(error) => console.error(error)}
/>
```

### Fluxo Completo
1. **Criar checkout** (já implementado)
2. **Componente ApplePayButton**:
   - Verifica disponibilidade automaticamente
   - Cria sessão Apple Pay
   - Valida merchant via `/api/sumup/apple-pay-session`
   - Processa pagamento via `/api/sumup/apple-pay`
   - Lida com sucesso/erro automaticamente

### API Routes Criadas
- `PUT /api/sumup/apple-pay-session` - Validação do merchant
- `POST /api/sumup/apple-pay` - Processar pagamento

---

## 💳 GOOGLE PAY - Integração Direta

### Requisitos
- ✅ Google Pay habilitado no SumUp Dashboard
- ✅ Domínio verificado no Google Pay Console
- ✅ Merchant ID do Google (opcional, mas recomendado)
- ✅ Merchant Code do SumUp

### Componente React
```tsx
import { GooglePayButton } from '@/components/payment/GooglePayButton'

<GooglePayButton
  checkoutId={checkout.id}
  amount={18.00}
  currency="EUR"
  merchantCode="SEU_MERCHANT_CODE"
  merchantId="SEU_GOOGLE_MERCHANT_ID" // Opcional
  merchantName="Sofia Gastrobar"
  onSuccess={() => console.log('Pagamento concluído!')}
  onError={(error) => console.error(error)}
/>
```

### Fluxo Completo
1. **Carregar Google Pay API** (automático via Script)
2. **Componente GooglePayButton**:
   - Verifica disponibilidade automaticamente
   - Inicializa PaymentsClient
   - Cria payment data request
   - Processa pagamento via `/api/sumup/google-pay`
   - Lida com redirect flows automaticamente

### API Routes Criadas
- `POST /api/sumup/google-pay` - Processar pagamento

### ⚠️ IMPORTANTE
- **Environment:** Sempre usar `PRODUCTION` (mesmo em testes)
- **Testing:** Não é possível testar localmente, usar staging
- **Screenshots:** Para onboarding, usar `#sumup-widget:google-pay-demo-mode` na URL

---

## 📋 MÉTODOS DISPONÍVEIS

Conforme documentação do SumUp:
- `card` - Cartão de crédito/débito
- `apple_pay` - Apple Pay
- `google_pay` - Google Pay
- `paypal` - PayPal
- `blik` - Blik (Polônia)
- `ideal` - iDEAL (Holanda)
- `bancontact` - Bancontact (Bélgica)
- `satispay` - Satispay (Itália)
- `p24` - Przelewy24 (Polônia)
- `pix` - PIX (Brasil)
- `qr_code_pix` - QR Code PIX
- `boleto` - Boleto (Brasil)
- `eps` - EPS (Áustria)
- `mybank` - MyBank (Itália)

**Nota:** A lista pode variar por checkout, moeda e valor.

---

## 🧪 TESTAR

### 1. Obter Métodos Disponíveis
```bash
curl "https://sofiagastrobaribiza.com/api/sumup/payment-methods?checkout_id=CHECKOUT_ID"
```

### 2. Processar com Apple Pay
```bash
curl -X POST https://sofiagastrobaribiza.com/api/sumup/process-checkout \
  -H "Content-Type: application/json" \
  -d '{
    "checkoutId": "CHECKOUT_ID",
    "paymentType": "apple_pay",
    "personalDetails": {
      "email": "teste@email.com"
    }
  }'
```

---

## 📚 DOCUMENTAÇÃO OFICIAL

- **SumUp APM Overview:** https://developer.sumup.com/online-payments/apm/
- **SumUp APM Integration Guide:** https://developer.sumup.com/online-payments/apm/integration-guide
- **Apple Pay Direct Integration:** https://developer.sumup.com/online-payments/apm/apple-pay
- **Google Pay Direct Integration:** https://developer.sumup.com/online-payments/apm/google-pay

## ✅ COMPONENTES CRIADOS

### 1. PaymentMethodSelector
- Lista métodos disponíveis dinamicamente
- Permite seleção de método de pagamento
- Suporta todos os APMs do SumUp

### 2. APMCheckout
- Processa checkout com método específico
- Lida com redirect flows automaticamente
- Lida com artifact flows (PIX, Boleto)

### 3. ApplePayButton
- Integração direta do Apple Pay
- Validação automática do merchant
- Processamento completo do fluxo

### 4. GooglePayButton
- Integração direta do Google Pay
- Carregamento automático da API
- Processamento completo do fluxo

## 🔧 API ROUTES CRIADAS

- `GET /api/sumup/payment-methods` - Lista métodos disponíveis
- `POST /api/sumup/process-checkout` - Processa checkout com APM genérico
- `PUT /api/sumup/apple-pay-session` - Validação do merchant Apple Pay
- `POST /api/sumup/apple-pay` - Processa checkout com Apple Pay
- `POST /api/sumup/google-pay` - Processa checkout com Google Pay

---

## 🔒 SEGURANÇA

✅ **Tudo seguro:**
- Métodos verificados via API SumUp
- Dados pessoais enviados apenas quando necessário
- Redirects validados pelo SumUp

---

**Goldmonkey Studio**  
**Implementado em:** 2025-01-27

