# 📋 COMO VER LOGS NO VERCEL

**Guia passo a passo para acessar logs do SumUp no Vercel**

---

## 🚀 MÉTODO 1: Via Dashboard (Mais Fácil)

### Passo a Passo:

1. **Acessar Vercel Dashboard**
   - URL: https://vercel.com
   - Fazer login se necessário

2. **Selecionar Projeto**
   - Clicar em **"sofia-gastrobar-site"** (ou procurar na lista)

3. **Ir para Deployments**
   - No menu superior, clicar em **"Deployments"**
   - Ou acessar diretamente: https://vercel.com/goldmonkeys-projects/sofia-gastrobar-site/deployments

4. **Selecionar Último Deploy**
   - Clicar no deploy mais recente (geralmente o primeiro da lista)
   - O deploy terá status: ✅ Ready, 🟡 Building, ou ❌ Error

5. **Acessar Logs**
   - No deploy selecionado, procurar por:
     - **"Functions"** (no topo ou no menu lateral)
     - Ou **"Runtime Logs"** 
     - Ou clicar em **"View Function Logs"**

6. **Procurar Logs do SumUp**
   - Na lista de funções, procurar por:
     - `/api/sumup/create-checkout`
     - Ou qualquer função que comece com `/api/sumup/`
   - Clicar na função para ver os logs

7. **Filtrar Logs**
   - Procurar por: `[SumUp Debug]` ou `[SumUp]`
   - Ou ver todos os logs da função

---

## 🔍 MÉTODO 2: Via CLI (Terminal)

### Ver Logs do Último Deploy:

```bash
# Ver logs do último deploy
vercel logs

# Ver logs de uma função específica
vercel logs --follow

# Ver logs em tempo real
vercel logs --follow --output raw
```

### Ver Logs de um Deploy Específico:

```bash
# Listar deploys
vercel ls

# Ver logs de um deploy específico
vercel logs [deployment-url]
```

---

## 📱 MÉTODO 3: Via URL Direta

### Acessar Diretamente:

1. **URL Base:**
   ```
   https://vercel.com/goldmonkeys-projects/sofia-gastrobar-site
   ```

2. **Deployments:**
   ```
   https://vercel.com/goldmonkeys-projects/sofia-gastrobar-site/deployments
   ```

3. **Settings (Variáveis):**
   ```
   https://vercel.com/goldmonkeys-projects/sofia-gastrobar-site/settings/environment-variables
   ```

---

## 🔎 O QUE PROCURAR NOS LOGS

### Logs de Debug do SumUp:

Procure por estas mensagens nos logs:

1. **`[SumUp Debug] Config Check:`**
   - Mostra se está configurado
   - Lista variáveis disponíveis
   - Tamanho da API Key

2. **`[SumUp] Configurado. Criando checkout real...`**
   - Significa que detectou as variáveis
   - Está tentando criar checkout

3. **`[SumUp] Não configurado. Criando checkout mock.`**
   - Significa que não encontrou variáveis
   - Está criando checkout mock

4. **`[SumUp] Checkout criado com sucesso:`**
   - Checkout foi criado corretamente
   - Tudo funcionando!

5. **`[SumUp] Erro ao criar checkout:`**
   - Erro ao criar checkout
   - Ver mensagem de erro específica

---

## 🐛 EXEMPLO DE LOGS ESPERADOS

### Se SumUp ESTÁ Configurado:

```
[SumUp Debug] Config Check: {
  isConfigured: true,
  hasApiKey: true,
  hasAccessToken: false,
  hasClientId: false,
  hasClientSecret: false,
  apiKeyLength: 48,
  apiKeyPrefix: 'sup_sk_HpNK',
  envKeys: ['SUMUP_API_KEY', 'NEXT_PUBLIC_SUMUP_API_KEY']
}
[SumUp] Configurado. Criando checkout real...
[SumUp] Checkout criado com sucesso: abc123-def456-ghi789
```

### Se SumUp NÃO Está Configurado:

```
[SumUp Debug] Config Check: {
  isConfigured: false,
  hasApiKey: false,
  hasAccessToken: false,
  hasClientId: false,
  hasClientSecret: false,
  apiKeyLength: 0,
  apiKeyPrefix: 'none',
  envKeys: []
}
[SumUp] Não configurado. Criando checkout mock.
```

---

## ⚠️ PROBLEMAS COMUNS

### 1. Não Vejo Logs
- **Causa:** Deploy ainda não terminou
- **Solução:** Aguardar deploy completar

### 2. Logs Vazios
- **Causa:** Função ainda não foi chamada
- **Solução:** Fazer um pedido de teste primeiro

### 3. Não Vejo `[SumUp Debug]`
- **Causa:** Código antigo ainda está em produção
- **Solução:** Aguardar novo deploy ou verificar se commit foi feito

### 4. Logs Mostram Erro
- **Causa:** Variáveis não estão configuradas ou incorretas
- **Solução:** Verificar variáveis no Settings > Environment Variables

---

## 🎯 CHECKLIST RÁPIDO

- [ ] Acessar Vercel Dashboard
- [ ] Selecionar projeto `sofia-gastrobar-site`
- [ ] Ir em Deployments
- [ ] Clicar no último deploy
- [ ] Abrir Functions ou Runtime Logs
- [ ] Procurar por `/api/sumup/create-checkout`
- [ ] Ver logs e procurar por `[SumUp Debug]`
- [ ] Verificar se `hasApiKey: true`
- [ ] Verificar se `isConfigured: true`

---

## 📞 PRÓXIMOS PASSOS

Após ver os logs:

1. **Se `isConfigured: false`:**
   - Verificar variáveis no Settings
   - Confirmar que estão em Production
   - Fazer redeploy se necessário

2. **Se `isConfigured: true` mas erro:**
   - Ver mensagem de erro específica
   - Verificar se API Key está correta
   - Verificar se conta SumUp está ativa

3. **Se tudo OK:**
   - Testar checkout novamente
   - Verificar se botões aparecem
   - Testar pagamento real

---

**Goldmonkey Studio**  
**Guia criado:** 2025-01-27

