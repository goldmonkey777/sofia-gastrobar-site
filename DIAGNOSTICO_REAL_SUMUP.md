# 🔍 DIAGNÓSTICO REAL - Problema SumUp

**Data:** 2025-12-07  
**Análise:** Verificando se é cache ou problema de credenciais

---

## 📊 ANÁLISE DO ERRO

### Erro que aparece:
```
1. "pay_to_email or merchant_code" - Erro de VALIDAÇÃO da API SumUp
2. "SUMUP_NOT_CONFIGURED" - Aparece quando tenta OAuth
```

### O que isso significa:

**Cenário 1: Problema de Credenciais**
- API_KEY inválida ou expirada
- API_KEY não está sendo lida em runtime
- Credenciais OAuth não estão disponíveis quando tenta fallback

**Cenário 2: Problema de Payload**
- `pay_to_email` não está sendo enviado no payload
- Código antigo ainda está sendo usado (cache)
- Lógica de adicionar `pay_to_email` não está funcionando

**Cenário 3: Problema de API SumUp**
- API SumUp rejeitando o `pay_to_email` enviado
- Formato do email incorreto
- API_KEY não tem permissão para criar checkouts

---

## ✅ VERIFICAÇÕES NECESSÁRIAS

### 1. Verificar Logs do Vercel

**O que procurar:**
```
[SumUp Debug] Config Check:
  - isConfigured: true/false?
  - hasApiKey: true/false?
  - apiKeyLength: ? (deve ser > 10)
  - clientIdPrefix: ? (deve começar com 'cc_')
```

**Se `isConfigured: false`:**
- ❌ Problema de CREDENCIAIS
- As variáveis não estão sendo lidas em runtime
- Pode ser cache OU variáveis não configuradas corretamente

**Se `isConfigured: true`:**
- ✅ Credenciais estão sendo detectadas
- Problema pode ser:
  - API_KEY inválida/expirada
  - Payload não está sendo enviado corretamente
  - API SumUp rejeitando

---

### 2. Verificar Payload Enviado

**O que procurar:**
```
[SumUp] 📤 Payload completo que será enviado:
  - Deve ter "pay_to_email": "info@sofiagastrobaribiza.com"
  - OU "merchant_code": "..."
```

**Se `pay_to_email` NÃO está no payload:**
- ❌ Código não está aplicando a correção
- Pode ser cache OU lógica incorreta

**Se `pay_to_email` ESTÁ no payload:**
- ✅ Código está correto
- Problema pode ser:
  - API SumUp rejeitando o email
  - API_KEY não tem permissão
  - Formato incorreto

---

### 3. Verificar Resposta da API

**O que procurar:**
```
[SumUp] 📥 Response status: 400/401/403/200?
```

**Status 400 (Bad Request):**
- Erro de validação
- Payload incorreto
- Campo faltando ou inválido

**Status 401/403 (Unauthorized/Forbidden):**
- API_KEY inválida ou expirada
- API_KEY não tem permissão
- Problema de AUTENTICAÇÃO

**Status 200 (OK):**
- ✅ Funcionou!

---

## 🎯 PRÓXIMOS PASSOS

### 1. Verificar Logs no Vercel

1. Acessar: Vercel Dashboard > Deployments > [último] > Functions
2. Procurar por: `[SumUp Debug] Config Check`
3. Verificar:
   - `isConfigured: true/false?`
   - `hasApiKey: true/false?`
   - `apiKeyLength: ?`

### 2. Verificar Payload

1. Procurar por: `[SumUp] 📤 Payload completo`
2. Verificar se `pay_to_email` está presente
3. Verificar formato do payload

### 3. Verificar Resposta

1. Procurar por: `[SumUp] 📥 Response status`
2. Verificar status code
3. Verificar mensagem de erro

---

## 💡 CONCLUSÃO

**NÃO posso ter certeza sem ver os logs reais do Vercel!**

Preciso verificar:
- ✅ Se as credenciais estão sendo detectadas (`isConfigured`)
- ✅ Se o payload está sendo enviado corretamente (`pay_to_email`)
- ✅ Qual é o status da resposta da API SumUp

**Possíveis causas:**
1. **Cache** - Código antigo ainda sendo usado
2. **Credenciais** - API_KEY inválida ou não sendo lida
3. **Payload** - `pay_to_email` não está sendo enviado
4. **API SumUp** - Rejeitando o email ou API_KEY sem permissão

---

**Próximo passo:** Verificar logs reais do Vercel para diagnosticar corretamente.

