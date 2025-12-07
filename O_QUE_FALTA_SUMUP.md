# 🔴 O QUE FALTA CONFIGURAR NO SUMUP

**Status Atual:** ❌ **SumUp retornando checkout MOCK**  
**Problema:** Sistema não está configurado corretamente

---

## 📋 CHECKLIST - O QUE FALTA

### ✅ 1. OBTER API KEY DO SUMUP (OBRIGATÓRIO)

**Passo a passo:**

1. **Acessar SumUp Dashboard:**
   - URL: https://me.sumup.com
   - Fazer login com a conta do Sofia Gastrobar

2. **Navegar para Developer Settings:**
   - Ir em **Settings** (Configurações)
   - Procurar por **Developer** ou **API** ou **Applications**
   - Ou acessar diretamente: https://me.sumup.com/developers

3. **Criar API Key:**
   - Clicar em **"Create API Key"** ou **"New API Key"**
   - Dar um nome (ex: "Sofia Gastrobar Website")
   - Copiar a **API Key** gerada
   - ⚠️ **IMPORTANTE:** A API Key começa com `sup_sk_...`
   - ⚠️ **IMPORTANTE:** Copie e guarde em local seguro (só aparece uma vez)

4. **Verificar Permissões:**
   - A API Key deve ter permissão para:
     - ✅ Criar checkouts
     - ✅ Processar pagamentos
     - ✅ Verificar status de pagamentos

---

### ✅ 2. CONFIGURAR NO VERCEL (OBRIGATÓRIO)

**Passo a passo:**

1. **Acessar Vercel Dashboard:**
   - URL: https://vercel.com
   - Fazer login
   - Selecionar projeto: **sofia-gastrobar-site**

2. **Ir em Environment Variables:**
   - Clicar em **Settings** (no menu lateral)
   - Clicar em **Environment Variables**

3. **Adicionar SUMUP_API_KEY:**
   - Clicar em **"Add New"**
   - **Key:** `SUMUP_API_KEY`
   - **Value:** Colar a API Key copiada do SumUp (começa com `sup_sk_...`)
   - **Environments:** Marcar TODOS:
     - ✅ Production
     - ✅ Preview
     - ✅ Development
   - Clicar em **Save**

4. **Verificar se está configurada:**
   - Deve aparecer na lista de variáveis
   - Deve estar marcada para Production

---

### 🟡 3. OPCIONAL: MERCHANT CODE (RECOMENDADO)

**O que é:**
- Código único do seu negócio no SumUp
- Melhora a integração do Google Pay
- Facilita identificação de pagamentos

**Como obter:**
1. No SumUp Dashboard, procurar por **"Merchant Code"** ou **"Merchant ID"**
2. Copiar o código (geralmente é um número ou string)
3. Adicionar no Vercel como `SUMUP_MERCHANT_CODE`

**Configurar no Vercel:**
- Key: `SUMUP_MERCHANT_CODE`
- Value: (código do merchant)
- Environments: Production, Preview, Development

---

### 🟡 4. OPCIONAL: WEBHOOK (RECOMENDADO)

**O que é:**
- Notificações automáticas quando pagamento é confirmado
- Melhora a experiência do usuário
- Confirmação automática de pagamentos

**Como configurar:**

1. **No SumUp Dashboard:**
   - Ir em **Settings > Webhooks**
   - Clicar em **"Add Webhook"**
   - **URL:** `https://sofiagastrobaribiza.com/api/sumup/webhook`
   - **Eventos:** Selecionar:
     - ✅ `payment.succeeded`
     - ✅ `payment.failed`
     - ✅ `payment.cancelled`
   - Copiar **Webhook Secret**

2. **No Vercel:**
   - Adicionar variável: `SUMUP_WEBHOOK_SECRET`
   - Value: (webhook secret copiado)
   - Environments: Production, Preview, Development

---

## 🔍 VERIFICAÇÃO RÁPIDA

### No SumUp Dashboard, você precisa ter:

- [ ] Conta SumUp ativa e verificada
- [ ] API Key criada (começa com `sup_sk_...`)
- [ ] Permissões corretas na API Key
- [ ] (Opcional) Merchant Code anotado
- [ ] (Opcional) Webhook configurado

### No Vercel Dashboard, você precisa ter:

- [ ] `SUMUP_API_KEY` configurada
- [ ] Valor começa com `sup_sk_...`
- [ ] Marcada para **Production**
- [ ] (Opcional) `SUMUP_MERCHANT_CODE` configurada
- [ ] (Opcional) `SUMUP_WEBHOOK_SECRET` configurada

---

## 🧪 COMO TESTAR SE ESTÁ FUNCIONANDO

### 1. Verificar Logs no Vercel:

1. Acessar: Vercel Dashboard > Deployments > [último deploy] > Functions
2. Procurar por `[SumUp Debug]` nos logs
3. Verificar:
   - `hasApiKey: true` ✅
   - `isConfigured: true` ✅
   - `apiKeyPrefix: sup_sk_...` ✅

### 2. Testar Pagamento:

1. Acessar: `https://sofiagastrobaribiza.com/delivery`
2. Fazer um pedido de teste
3. Clicar em "Confirm and Pay"
4. **Se funcionar:** Deve aparecer botões de Apple Pay, Google Pay e Cartão
5. **Se não funcionar:** Ainda mostra "SumUp não configurado"

---

## ❌ PROBLEMAS COMUNS

### Problema 1: "SumUp não configurado"
**Causa:** `SUMUP_API_KEY` não está no Vercel ou está vazia  
**Solução:** Adicionar `SUMUP_API_KEY` no Vercel Dashboard

### Problema 2: "401 Unauthorized"
**Causa:** API Key inválida ou expirada  
**Solução:** Criar nova API Key no SumUp e atualizar no Vercel

### Problema 3: "Checkout mock criado"
**Causa:** `isSumUpConfigured()` retorna `false`  
**Solução:** Verificar se `SUMUP_API_KEY` está configurada e fazer redeploy

### Problema 4: Botão não funciona
**Causa:** Checkout é mock (SumUp não configurado)  
**Solução:** Configurar `SUMUP_API_KEY` corretamente

---

## 📝 RESUMO - O QUE FAZER AGORA

### Passo 1: Obter API Key
1. Acessar: https://me.sumup.com/developers
2. Criar nova API Key
3. Copiar (começa com `sup_sk_...`)

### Passo 2: Configurar no Vercel
1. Acessar: https://vercel.com
2. Projeto: sofia-gastrobar-site
3. Settings > Environment Variables
4. Adicionar: `SUMUP_API_KEY` = (sua API key)
5. Marcar: Production, Preview, Development
6. Salvar

### Passo 3: Fazer Redeploy
1. No Vercel Dashboard, ir em Deployments
2. Clicar nos 3 pontos do último deploy
3. Clicar em "Redeploy"
4. Aguardar deploy completar

### Passo 4: Testar
1. Acessar: `https://sofiagastrobaribiza.com/delivery`
2. Fazer pedido de teste
3. Verificar se aparece checkout real (não mock)

---

## 🔗 LINKS ÚTEIS

- **SumUp Dashboard:** https://me.sumup.com
- **SumUp Developer Portal:** https://me.sumup.com/developers
- **SumUp API Docs:** https://developer.sumup.com/api
- **Vercel Dashboard:** https://vercel.com/goldmonkeys-projects/sofia-gastrobar-site
- **Vercel Environment Variables:** https://vercel.com/goldmonkeys-projects/sofia-gastrobar-site/settings/environment-variables

---

## ✅ CHECKLIST FINAL

Antes de testar, confirme:

- [ ] API Key obtida do SumUp Dashboard
- [ ] `SUMUP_API_KEY` adicionada no Vercel
- [ ] Variável marcada para Production
- [ ] Redeploy feito no Vercel
- [ ] Logs verificados (deve mostrar `hasApiKey: true`)

**Se tudo estiver ✅, o sistema deve funcionar!**

---

**Goldmonkey Studio**  
**Última atualização:** 2025-01-27

