# ⚠️ SUMUP_MERCHANT_CODE OBRIGATÓRIO

**Erro detectado:** A API SumUp está exigindo `merchant_code` ou `pay_to_email` no payload do checkout.

---

## 🔴 PROBLEMA

A API SumUp retornou o seguinte erro:

```
{
  "error_code": "INVALID",
  "message": "Validation error",
  "param": "pay_to_email or merchant_code"
}
```

Isso significa que **é obrigatório** enviar `merchant_code` ou `pay_to_email` ao criar um checkout.

---

## ✅ SOLUÇÃO

### 1. Obter Merchant Code do SumUp

1. **Acessar SumUp Dashboard:**
   - URL: https://me.sumup.com
   - Fazer login com a conta do Sofia Gastrobar

2. **Encontrar Merchant Code:**
   - Ir em **Settings** (Configurações)
   - Procurar por **"Merchant Code"** ou **"Merchant ID"**
   - Ou procurar em **Account Details** ou **Business Information**
   - O Merchant Code geralmente é um número ou string alfanumérica

3. **Alternativa - Email do Negócio:**
   - Se não encontrar Merchant Code, pode usar o email do negócio
   - Mas Merchant Code é preferível

---

### 2. Configurar no Vercel

1. **Acessar Vercel Dashboard:**
   - URL: https://vercel.com
   - Fazer login
   - Selecionar projeto: **sofia-gastrobar-site**

2. **Adicionar Variável:**
   - Ir em **Settings** > **Environment Variables**
   - Clicar em **"Add New"**
   - **Key:** `SUMUP_MERCHANT_CODE`
   - **Value:** Colar o Merchant Code obtido do SumUp
   - **Environments:** Marcar TODOS:
     - ✅ Production
     - ✅ Preview
     - ✅ Development
   - Clicar em **Save**

3. **Verificar:**
   - Deve aparecer na lista de variáveis
   - Deve estar marcada para Production

---

### 3. Fazer Rebuild Forçado

⚠️ **IMPORTANTE:** Após adicionar a variável, fazer rebuild forçado (sem cache):

1. Vercel Dashboard > **Deployments**
2. Clicar nos **3 pontos** do último deploy
3. Clicar em **"Redeploy"**
4. ⚠️ **DESMARCAR** "Use existing Build Cache"
5. Clicar em **"Redeploy"**
6. Aguardar (2-3 minutos)

---

## 🧪 TESTAR APÓS CONFIGURAR

1. **Aguardar deploy** (2-3 minutos)
2. **Fazer pedido de teste:**
   - Acessar: `https://sofiagastrobaribiza.com/delivery`
   - Fazer um pedido
   - Clicar em "Confirm and Pay"
3. **Verificar logs no Vercel:**
   - Deve aparecer `hasMerchantCode: true`
   - Não deve mais dar erro de validação

---

## 📊 VERIFICAÇÃO

### No Vercel Dashboard, verificar:

- [ ] `SUMUP_MERCHANT_CODE` configurada
- [ ] Valor não está vazio
- [ ] Marcada para **Production**
- [ ] Rebuild forçado feito (sem cache)

### Nos Logs do Vercel, verificar:

- [ ] `hasMerchantCode: true` ✅
- [ ] Não aparece erro `"pay_to_email or merchant_code"` ✅
- [ ] Checkout criado com sucesso ✅

---

## 🔍 ONDE ENCONTRAR O MERCHANT CODE

### Opção 1: SumUp Dashboard

1. Login em https://me.sumup.com
2. Settings > Account Details
3. Procurar por "Merchant Code" ou "Merchant ID"

### Opção 2: Email do SumUp

- Verificar emails do SumUp
- Pode conter o Merchant Code

### Opção 3: Suporte SumUp

- Se não encontrar, contatar suporte do SumUp
- Eles podem fornecer o Merchant Code

---

## ⚠️ NOTA IMPORTANTE

**O sistema está funcionando corretamente!** O problema é apenas que a API SumUp exige `merchant_code` para criar checkouts. Após configurar `SUMUP_MERCHANT_CODE` no Vercel e fazer rebuild forçado, tudo deve funcionar perfeitamente.

---

**Goldmonkey Studio**  
**Última atualização:** 2025-12-07

