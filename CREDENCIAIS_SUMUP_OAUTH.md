# 🔐 CREDENCIAIS SUMUP OAuth - CONFIGURAR NO VERCEL

**Arquivo:** `Sofia Gastrobar Website (2).json`  
**Data:** 2025-01-27  
**Tipo:** OAuth Application

---

## 📋 CREDENCIAIS OBTIDAS

### Client ID:
```
cc_classic_zOTBmCHLzuk68xVgc1w1qQzHqp0Mq
```

### Client Secret:
```
cc_sk_classic_8QlaIX8LYrNgrQrFI7HEwgOnrDti5KNxdK1ywL8urQHqIXyDej
```

### Application ID:
```
CCCXGCSS2
```

### Redirect URIs Configurados:
- `https://sofiagastrobaribiza.com/api/sumup/callback`

---

## ⚙️ CONFIGURAR NO VERCEL

### Passo 1: Acessar Vercel Dashboard
1. URL: https://vercel.com
2. Projeto: `sofia-gastrobar-site`
3. Settings > Environment Variables

### Passo 2: Adicionar SUMUP_CLIENT_ID
- **Key:** `SUMUP_CLIENT_ID`
- **Value:** `cc_classic_zOTBmCHLzuk68xVgc1w1qQzHqp0Mq`
- **Environments:** ✅ Production, ✅ Preview, ✅ Development
- **Save**

### Passo 3: Adicionar SUMUP_CLIENT_SECRET
- **Key:** `SUMUP_CLIENT_SECRET`
- **Value:** `cc_sk_classic_8QlaIX8LYrNgrQrFI7HEwgOnrDti5KNxdK1ywL8urQHqIXyDej`
- **Environments:** ✅ Production, ✅ Preview, ✅ Development
- **Save**

---

## 🔄 COMO O SISTEMA FUNCIONA

O sistema suporta **2 métodos de autenticação**:

### Método 1: API Key (Prioritário)
- Variável: `SUMUP_API_KEY`
- Mais simples e direto
- Se configurada, será usada primeiro

### Método 2: OAuth (Fallback)
- Variáveis: `SUMUP_CLIENT_ID` + `SUMUP_CLIENT_SECRET`
- Usado se API Key não estiver configurada
- Sistema faz OAuth automaticamente para obter Access Token

**Com essas credenciais OAuth, o sistema já deve funcionar!**

---

## ✅ VERIFICAÇÃO

Após configurar no Vercel:

1. **Fazer Redeploy:**
   - Vercel Dashboard > Deployments
   - Clicar nos 3 pontos do último deploy
   - "Redeploy"

2. **Verificar Logs:**
   - Deployments > [último deploy] > Functions
   - Procurar por `[SumUp Debug]`
   - Deve mostrar:
     - `hasClientId: true` ✅
     - `hasClientSecret: true` ✅
     - `isConfigured: true` ✅

3. **Testar:**
   - Acessar: `https://sofiagastrobaribiza.com/delivery`
   - Fazer pedido de teste
   - Verificar se checkout é real (não mock)

---

## 🔒 SEGURANÇA

⚠️ **IMPORTANTE:**
- Essas credenciais são **SENSÍVEIS**
- Não commitar no Git
- Não compartilhar publicamente
- Manter apenas no Vercel (Environment Variables)

---

## 📝 STATUS

- [x] Credenciais obtidas do SumUp
- [ ] Configuradas no Vercel (fazer agora)
- [ ] Redeploy feito
- [ ] Testado e funcionando

---

**Goldmonkey Studio**  
**Configuração:** 2025-01-27

