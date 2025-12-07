# 🔧 SOLUÇÃO - SUMUP_NOT_CONFIGURED

**Problema:** Erro `SUMUP_NOT_CONFIGURED` mesmo com variáveis configuradas no Vercel

**Logs mostram:**
```
Erro ao criar checkout SumUp: Error: SUMUP_NOT_CONFIGURED
```

---

## 🔍 DIAGNÓSTICO

### Variáveis Configuradas no Vercel:
✅ `SUMUP_CLIENT_ID` - Production (6m ago)  
✅ `SUMUP_CLIENT_SECRET` - Production (6m ago)  
✅ `SUMUP_API_KEY` - Production (3h ago)  
✅ `NEXT_PUBLIC_SUMUP_API_KEY` - Production (3h ago)

### Problema:
As variáveis estão configuradas, mas **não estão sendo lidas em runtime**.

---

## 🛠️ SOLUÇÕES

### Solução 1: Forçar Rebuild (Mais Provável)

O Next.js pode ter cacheado o build sem as variáveis. Precisa fazer rebuild:

1. **Acessar Vercel Dashboard:**
   - https://vercel.com/goldmonkeys-projects/sofia-gastrobar-site/deployments

2. **Fazer Redeploy Forçado:**
   - Clicar nos 3 pontos do último deploy
   - Clicar em **"Redeploy"**
   - ⚠️ **IMPORTANTE:** Marcar **"Use existing Build Cache"** como **DESMARCADO**
   - Clicar em **"Redeploy"**

3. **Aguardar deploy completar** (2-3 minutos)

### Solução 2: Verificar se Variáveis Estão em Production

1. **Acessar Vercel Dashboard:**
   - Settings > Environment Variables

2. **Verificar cada variável:**
   - `SUMUP_CLIENT_ID` - Deve estar marcada para **Production**
   - `SUMUP_CLIENT_SECRET` - Deve estar marcada para **Production**
   - `SUMUP_API_KEY` - Deve estar marcada para **Production**

3. **Se não estiver marcada:**
   - Clicar na variável
   - Marcar **Production**
   - Salvar
   - Fazer redeploy

### Solução 3: Verificar Logs Detalhados

Após o deploy, verificar logs:

1. **Acessar:** Vercel Dashboard > Deployments > [último] > Functions
2. **Procurar por:** `[SumUp Debug] Config Check`
3. **Verificar:**
   ```json
   {
     "hasClientId": true/false,
     "hasClientSecret": true/false,
     "allSumUpEnvKeys": [...],
     "envValues": {...}
   }
   ```

**Se `hasClientId: false`:**
- Variáveis não estão sendo carregadas
- Fazer rebuild forçado (Solução 1)

**Se `hasClientId: true` mas ainda dá erro:**
- Problema no OAuth
- Verificar logs `[SumUp OAuth]`

---

## 🔄 PRÓXIMOS PASSOS

### 1. Fazer Rebuild Forçado (AGORA)
- Vercel Dashboard > Deployments > Redeploy
- **DESMARCAR** "Use existing Build Cache"
- Aguardar deploy

### 2. Testar Novamente
- Acessar: `https://sofiagastrobaribiza.com/delivery`
- Fazer pedido
- Clicar em "Confirm and Pay"

### 3. Verificar Logs
- Procurar por `[SumUp Debug] Config Check`
- Ver se `hasClientId: true`

### 4. Se Ainda Não Funcionar
- Compartilhar logs completos
- Verificar se há erro específico no OAuth

---

## ⚠️ IMPORTANTE

**O problema mais comum é:**
- Build cacheado sem as variáveis
- Variáveis não marcadas para Production
- Redeploy sem rebuild forçado

**Solução mais provável:**
- Fazer redeploy **SEM** usar cache de build

---

**Goldmonkey Studio**  
**Solução:** 2025-01-27

