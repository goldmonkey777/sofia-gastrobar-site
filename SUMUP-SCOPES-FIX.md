# ⚠️ Problema: Scope "payments" Faltando

## 🔍 O Que Aconteceu

Seu teste de autenticação foi bem-sucedido ✅, mas ao tentar criar um Payment Link, a API SumUp retornou:

```
403 Forbidden: Insufficient scopes, requires [payments]
```

**Scopes atuais**:
- `transactions.history`
- `user.app-settings`
- `user.profile_readonly`
- `user.subaccounts`
- `products`
- `invoices.read`
- `invoices.write`
- `accounting.read`
- `accounting.write`
- `readers.read`
- `readers.write`

**Scope necessário**: `payments` ❌ (FALTANDO!)

---

## ✅ Como Resolver

### Opção 1: Adicionar Scope "payments" na Aplicação (RECOMENDADO)

1. **Acesse SumUp Developer Portal**
   - URL: https://developer.sumup.com
   - Login com: contact@goldmonkey.studio ou redle82@gmail.com

2. **Vá em Applications**
   - Encontre: "Sofia Gastrobar Website"
   - ID: `CCCXGCA3P`

3. **Editar Scopes**
   - Clique em "Edit Application"
   - Na seção **"Scopes"** ou **"Permissions"**
   - ✅ Marque: **`payments`**
   - ✅ Marque também: **`payment_instruments`** (opcional, mas recomendado)

4. **Salvar e Gerar Novo Token**
   - Clique em "Save"
   - Pode ser necessário gerar um novo **Client Secret**
   - Se gerar novo secret, atualize `.env.local`

### Opção 2: Usar Merchant Code (SEM OAuth)

Se você não conseguir adicionar o scope `payments`, pode usar autenticação via **Merchant Code** diretamente:

**No `.env.local`**:
```bash
# Remover ou deixar vazio (opcional):
# SUMUP_CLIENT_ID=
# SUMUP_CLIENT_SECRET=

# Usar apenas Merchant Code:
SUMUP_MERCHANT_CODE=MNAAKKUV

# Obter Access Token manualmente:
SUMUP_ACCESS_TOKEN=seu_access_token_aqui
```

**Como obter Access Token manualmente**:

1. Acesse: https://me.sumup.com/developers
2. Vá em "API Credentials"
3. Clique em "Generate Access Token"
4. Copie o token
5. Cole em `SUMUP_ACCESS_TOKEN=`

**⚠️ Desvantagem**: Access tokens manuais expiram (geralmente após 30 dias). Você precisará gerar um novo token periodicamente.

---

## 🎯 Fluxo de Autenticação SumUp

### Método 1: OAuth Client Credentials (IDEAL)

```
App → POST /token (client_id + client_secret)
     ↓
SumUp valida credenciais
     ↓
Retorna Access Token com scopes configurados
     ↓
App usa token em todas as requests
```

**Vantagens**:
- ✅ Token renova automaticamente
- ✅ Mais seguro
- ✅ Scopes controlados pela aplicação

**Desvantagens**:
- ❌ Requer configuração correta de scopes no portal

### Método 2: Merchant Code + Access Token Manual

```
Você → SumUp Portal → Generate Token
     ↓
Copia token manualmente
     ↓
Cola em .env.local
     ↓
App usa token diretamente
```

**Vantagens**:
- ✅ Rápido de configurar
- ✅ Não depende de OAuth

**Desvantagens**:
- ❌ Token expira (precisa renovar manualmente)
- ❌ Menos seguro (token fixo)

---

## 🔧 Código Atualizado para Suportar Ambos Métodos

O código atual já suporta ambos os métodos! Veja como funciona:

**`src/modules/sumup-integration/lib/sumup.ts`**:

```typescript
async function getAccessToken(): Promise<string> {
  // Método 1: Se tem token manual, usar
  const existingToken = process.env.SUMUP_ACCESS_TOKEN
  if (existingToken) {
    return existingToken
  }

  // Método 2: OAuth com client_credentials
  const clientId = process.env.SUMUP_CLIENT_ID
  const clientSecret = process.env.SUMUP_CLIENT_SECRET

  if (!clientId || !clientSecret) {
    throw new Error('SUMUP_NOT_CONFIGURED')
  }

  const response = await fetch('https://api.sumup.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: clientId,
      client_secret: clientSecret,
      scope: 'payments payment_instruments', // ← Scopes solicitados
    }),
  })

  const data = await response.json()
  return data.access_token
}
```

---

## ✅ Teste Rápido

### Verificar Scopes do Token Atual

```bash
npx tsx test-sumup-auth.ts
```

**Se aparecer**:
```
✅ Autenticação bem-sucedida!
✅ Payment Link criado com sucesso!
```
→ **Scopes corretos!** ✅

**Se aparecer**:
```
❌ Falha ao criar Payment Link!
403 Forbidden: Insufficient scopes, requires [payments]
```
→ **Falta scope `payments`** ❌

---

## 🚀 Passo a Passo Recomendado

### Opção A: Adicionar Scope (Melhor solução)

1. Vá em https://developer.sumup.com
2. Edite "Sofia Gastrobar Website"
3. Adicione scope `payments`
4. Salve
5. Teste: `npx tsx test-sumup-auth.ts`

### Opção B: Usar Token Manual (Solução rápida)

1. Vá em https://me.sumup.com/developers
2. Clique em "Generate Access Token"
3. Copie o token
4. Edite `.env.local`:
   ```bash
   SUMUP_ACCESS_TOKEN=sup_sk_abc123xyz...
   ```
5. Teste: `npx tsx test-sumup-auth.ts`

---

## 📊 Status Atual

| Item | Status |
|------|--------|
| Client ID | ✅ Configurado |
| Client Secret | ✅ Configurado |
| Merchant Code | ✅ Configurado (MNAAKKUV) |
| OAuth Autenticação | ✅ Funcionando |
| Scope `payments` | ❌ FALTANDO |

**Próximo passo**: Adicionar scope `payments` no SumUp Developer Portal!

---

## 💡 Referências

- [SumUp OAuth Scopes](https://developer.sumup.com/docs/api/authorization)
- [SumUp API Credentials](https://me.sumup.com/developers)
- [Payment Links API](https://developer.sumup.com/docs/api/checkout-links)

---

**Última atualização**: 2025-12-07
**Status**: ⚠️ Aguardando configuração de scope `payments`
