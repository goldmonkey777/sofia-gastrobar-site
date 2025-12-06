# 🔍 DIAGNÓSTICO - SumUp Não Configurado

**Data:** 2025-01-27  
**Problema:** Sistema mostra "SumUp não configurado" mesmo com variáveis no Vercel

---

## 🐛 PROBLEMA

O sistema está detectando que o SumUp não está configurado, mesmo que as variáveis estejam configuradas no Vercel.

---

## ✅ VARIÁVEIS NO VERCEL

Verificado via CLI:
- ✅ `SUMUP_API_KEY` - Production, Preview, Development
- ✅ `NEXT_PUBLIC_SUMUP_API_KEY` - Production, Preview, Development
- ✅ `NEXT_PUBLIC_SITE_URL` - Production, Preview, Development

---

## 🔍 POSSÍVEIS CAUSAS

### 1. Variáveis Adicionadas Após Deploy
**Problema:** Se as variáveis foram adicionadas depois do último deploy, elas não estarão disponíveis.

**Solução:**
- Fazer um novo deploy após adicionar as variáveis
- Ou aguardar o próximo auto-deploy

### 2. Variáveis Não Estão em Production
**Problema:** Variáveis podem estar apenas em Preview/Development.

**Solução:**
- Verificar no Vercel Dashboard
- Garantir que estão marcadas para **Production**

### 3. Nome da Variável Incorreto
**Problema:** Pode haver diferença entre maiúsculas/minúsculas.

**Solução:**
- Verificar se é exatamente `SUMUP_API_KEY` (não `sumup_api_key`)

### 4. Cache do Vercel
**Problema:** Vercel pode estar usando cache antigo.

**Solução:**
- Fazer redeploy forçado
- Limpar cache do Vercel

---

## 🔧 SOLUÇÃO IMPLEMENTADA

Adicionei logs de debug detalhados que vão mostrar:
- Se `SUMUP_API_KEY` está sendo lida
- Tamanho da chave (para verificar se está completa)
- Prefixo da chave (para verificar se está correta)
- Todas as variáveis SUMUP disponíveis

---

## 📋 COMO VERIFICAR

### Opção 1: Ver Logs do Vercel
1. Acessar: https://vercel.com
2. Projeto: `sofia-gastrobar-site`
3. **Deployments** > Último deploy
4. **Functions** > `/api/sumup/create-checkout`
5. Ver logs e procurar por `[SumUp Debug]`

### Opção 2: Testar Localmente
```bash
# Verificar se variáveis estão no .env.local
cat .env.local | grep SUMUP

# Testar API localmente
npm run dev
# Fazer um pedido e verificar logs do servidor
```

### Opção 3: Verificar Variáveis no Vercel Dashboard
1. Acessar: https://vercel.com
2. Projeto: `sofia-gastrobar-site`
3. **Settings** > **Environment Variables**
4. Verificar se `SUMUP_API_KEY` está:
   - ✅ Marcada para **Production**
   - ✅ Com o valor correto
   - ✅ Sem espaços extras

---

## 🚀 PRÓXIMOS PASSOS

1. **Verificar logs do Vercel** (após próximo deploy)
2. **Confirmar variáveis** no Dashboard
3. **Fazer redeploy** se necessário
4. **Testar novamente** após deploy

---

## ⚠️ IMPORTANTE

**Limite de Deploy do Vercel:**
- Atingido limite de 100 deploys/dia (plano gratuito)
- Precisa aguardar ou fazer deploy via Dashboard/Git push

**Alternativa:**
- Fazer commit e push para GitHub
- Vercel fará deploy automático
- Ou aguardar próximo ciclo (24h)

---

**Goldmonkey Studio**  
**Diagnóstico:** 2025-01-27

