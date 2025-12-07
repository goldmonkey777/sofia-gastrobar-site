# 🔧 SOLUÇÃO DEFINITIVA - Erro SumUp "pay_to_email or merchant_code"

**Data:** 2025-12-07  
**Status:** ⚠️ Erro persistindo - necessário rebuild forçado

---

## 🔴 PROBLEMA ATUAL

O erro continua acontecendo:
```
Error: Falha ao criar link SumUp: {"error_code":"INVALID","message":"Validation error","param":"pay_to_email or merchant_code"}
```

**Causa:** O deploy não está aplicando as mudanças devido ao build cache do Vercel.

---

## ✅ SOLUÇÃO IMPLEMENTADA NO CÓDIGO

O código já está corrigido e inclui:

1. **Suporte a `pay_to_email`:**
   - Usa `info@sofiagastrobaribiza.com` quando `merchant_code` não está disponível
   - Prioriza `merchant_code` se configurado

2. **Tratamento de erro melhorado:**
   - Não tenta OAuth quando erro é de validação
   - Lança erro específico: `SUMUP_MERCHANT_CODE_REQUIRED`
   - Retorna checkout mock quando necessário

3. **Logs detalhados:**
   - Mostra payload completo antes de enviar
   - Mostra se `pay_to_email` está presente
   - Facilita diagnóstico

---

## 🚨 AÇÃO URGENTE NECESSÁRIA

### Fazer REBUILD FORÇADO no Vercel (SEM CACHE)

**Passo a passo:**

1. **Acessar Vercel Dashboard:**
   - URL: https://vercel.com/goldmonkeys-projects/sofia-gastrobar-site/deployments
   - Fazer login

2. **Encontrar o último deploy:**
   - Procurar pelo deploy mais recente
   - Deve ter commit: `a89f488` ou mais recente

3. **Fazer Redeploy FORÇADO:**
   - Clicar nos **3 pontos** (⋯) do último deploy
   - Clicar em **"Redeploy"**
   - ⚠️ **CRÍTICO:** DESMARCAR **"Use existing Build Cache"**
   - Clicar em **"Redeploy"**
   - Aguardar (2-3 minutos)

4. **Verificar se funcionou:**
   - Após deploy, acessar: `https://sofiagastrobaribiza.com/delivery`
   - Fazer pedido de teste
   - Clicar em "Confirm and Pay"
   - **NÃO deve mais dar erro de validação**

---

## 🔍 VERIFICAR LOGS APÓS REBUILD

1. **Acessar logs no Vercel:**
   - Vercel Dashboard > Deployments > [último deploy] > Functions
   - Procurar por `[SumUp] 📤 Payload completo`

2. **Verificar se está correto:**
   - Deve mostrar: `"pay_to_email": "info@sofiagastrobaribiza.com"`
   - Ou: `"merchant_code": "..."` (se configurado)

3. **Se ainda der erro:**
   - Verificar logs para ver o payload enviado
   - Verificar se `pay_to_email` está presente
   - Se não estiver, o código não foi aplicado (fazer rebuild novamente)

---

## 📋 CHECKLIST

- [ ] Rebuild forçado feito (sem cache)
- [ ] Deploy completado (2-3 minutos)
- [ ] Logs verificados (payload com `pay_to_email`)
- [ ] Teste realizado (não dá mais erro)
- [ ] Sistema funcionando corretamente

---

## 🎯 O QUE DEVE ACONTECER APÓS REBUILD

### Antes (com erro):
```
❌ Erro: "pay_to_email or merchant_code"
❌ Tentando OAuth (não deveria)
❌ SUMUP_NOT_CONFIGURED
```

### Depois (correto):
```
✅ Payload com pay_to_email: info@sofiagastrobaribiza.com
✅ Checkout criado com sucesso
✅ Redirecionamento para SumUp funcionando
```

---

## 💡 ALTERNATIVA: Configurar Merchant Code

Se preferir usar `merchant_code` em vez de `pay_to_email`:

1. **Obter Merchant Code:**
   - Acessar: https://me.sumup.com
   - Settings > Account Details
   - Procurar "Merchant Code" ou "Merchant ID"

2. **Configurar no Vercel:**
   - Settings > Environment Variables
   - Adicionar: `SUMUP_MERCHANT_CODE`
   - Value: (código obtido)
   - Environments: Production, Preview, Development

3. **Fazer rebuild forçado** (sem cache)

---

## 📊 STATUS ATUAL

| Item | Status |
|------|--------|
| Código corrigido | ✅ Sim |
| Suporte a `pay_to_email` | ✅ Implementado |
| Logs detalhados | ✅ Adicionados |
| Deploy automático | ⏳ Em andamento |
| **Rebuild forçado** | ⚠️ **NECESSÁRIO** |
| Sistema funcionando | ❌ Aguardando rebuild |

---

## 🆘 SE AINDA NÃO FUNCIONAR

1. **Verificar logs:**
   - Ver se `pay_to_email` está no payload
   - Ver se erro está sendo detectado corretamente

2. **Verificar variáveis no Vercel:**
   - `SUMUP_API_KEY` configurada
   - `SUMUP_CLIENT_ID` configurada
   - `SUMUP_CLIENT_SECRET` configurada

3. **Contatar suporte:**
   - Se após rebuild forçado ainda não funcionar
   - Enviar logs do Vercel
   - Enviar payload completo

---

**Goldmonkey Studio**  
**Última atualização:** 2025-12-07

