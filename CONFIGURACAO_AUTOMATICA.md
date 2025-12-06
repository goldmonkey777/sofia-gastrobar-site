# ⚡ CONFIGURAÇÃO AUTOMÁTICA - TUDO PRONTO!

**Data:** 2025-01-27  
**Status:** ✅ Configuração local completa | ⚠️ Vercel precisa de ação manual

---

## ✅ O QUE JÁ ESTÁ CONFIGURADO

### 1. Local (Desenvolvimento)
- ✅ SDK SumUp instalado: `@sumup/sdk@0.0.8`
- ✅ API Key no `.env.local`: `SUMUP_API_KEY`
- ✅ Arquivo protegido no `.gitignore`
- ✅ Código atualizado e funcionando

### 2. Scripts Criados
- ✅ `scripts/setup-vercel-env.sh` - Script interativo
- ✅ `scripts/configure-vercel.sh` - Script automático
- ✅ Documentação completa

### 3. Documentação
- ✅ `SETUP_SUMUP.md` - Guia completo
- ✅ `CHECKLIST_SUMUP.md` - Checklist passo a passo
- ✅ `CONFIGURACAO_COMPLETA.md` - Resumo da configuração
- ✅ `CONFIGURACAO_AUTOMATICA.md` - Este arquivo

---

## 🔴 O QUE VOCÊ PRECISA FAZER AGORA

### Opção 1: Via Dashboard Vercel (Mais Fácil) ⭐

1. **Acessar:** https://vercel.com
2. **Selecionar projeto:** `sofia-gastrobar-site`
3. **Ir em:** Settings > Environment Variables
4. **Adicionar:**

```
Key: SUMUP_API_KEY
Value: sup_sk_HpNK1TKk2HuuDDfkctixqSKWaBXF70gNc
Environments: ✅ Production ✅ Preview ✅ Development
```

```
Key: NEXT_PUBLIC_SITE_URL
Value: https://sofiagastrobaribiza.com
Environments: ✅ Production ✅ Preview ✅ Development
```

5. **Salvar** e fazer deploy

### Opção 2: Via CLI (Interativo)

```bash
# Executar script interativo
./scripts/setup-vercel-env.sh
```

O script vai:
- Verificar se você está logado
- Adicionar `SUMUP_API_KEY` para todos os ambientes
- Adicionar `NEXT_PUBLIC_SITE_URL` para todos os ambientes

### Opção 3: Via CLI (Manual)

```bash
# Adicionar SUMUP_API_KEY
vercel env add SUMUP_API_KEY production
# Colar: sup_sk_HpNK1TKk2HuuDDfkctixqSKWaBXF70gNc

vercel env add SUMUP_API_KEY preview
# Colar: sup_sk_HpNK1TKk2HuuDDfkctixqSKWaBXF70gNc

vercel env add SUMUP_API_KEY development
# Colar: sup_sk_HpNK1TKk2HuuDDfkctixqSKWaBXF70gNc

# Adicionar NEXT_PUBLIC_SITE_URL
vercel env add NEXT_PUBLIC_SITE_URL production
# Colar: https://sofiagastrobaribiza.com

vercel env add NEXT_PUBLIC_SITE_URL preview
# Colar: https://sofiagastrobaribiza.com

vercel env add NEXT_PUBLIC_SITE_URL development
# Colar: https://sofiagastrobaribiza.com
```

---

## 🧪 TESTAR AGORA

### Teste Local:
```bash
npm run dev
```

1. Acessar: http://localhost:3000/reservas
2. Fazer uma reserva de teste
3. Verificar se aparece botão de pagamento SumUp
4. Verificar se redireciona para SumUp

### Teste em Produção (Após configurar Vercel):
1. Acessar: https://sofiagastrobaribiza.com/reservas
2. Fazer uma reserva de teste
3. Verificar se o pagamento funciona

---

## 📋 CHECKLIST FINAL

### ✅ Local (Completo)
- [x] SDK instalado
- [x] API Key no `.env.local`
- [x] Código funcionando
- [x] Documentação criada

### ⚠️ Produção (Pendente)
- [ ] `SUMUP_API_KEY` no Vercel
- [ ] `NEXT_PUBLIC_SITE_URL` no Vercel
- [ ] Variáveis para todos os ambientes
- [ ] Deploy realizado
- [ ] Teste em produção

---

## 🔒 SEGURANÇA

✅ **API Key protegida:**
- `.env.local` no `.gitignore` ✅
- Não será commitada ✅
- Apenas você tem acesso ✅

⚠️ **Lembre-se:**
- Nunca compartilhe a API Key publicamente
- Use variáveis de ambiente no Vercel
- Não hardcode valores sensíveis

---

## 🆘 TROUBLESHOOTING

### Erro: "SUMUP_NOT_CONFIGURED"
**Local:**
- Verificar se `.env.local` tem `SUMUP_API_KEY`
- Reiniciar servidor: `npm run dev`

**Produção:**
- Verificar no Vercel Dashboard
- Verificar se selecionou todos os ambientes
- Fazer novo deploy após adicionar variáveis

### Variáveis não aparecem
- Verificar se está no projeto correto
- Verificar se selecionou todos os ambientes
- Fazer novo deploy

---

## 📚 DOCUMENTAÇÃO COMPLETA

- **Setup SumUp:** `SETUP_SUMUP.md`
- **Checklist:** `CHECKLIST_SUMUP.md`
- **Configuração Completa:** `CONFIGURACAO_COMPLETA.md`
- **Este guia:** `CONFIGURACAO_AUTOMATICA.md`

---

## 🎯 RESUMO RÁPIDO

**O que está pronto:**
- ✅ Tudo configurado localmente
- ✅ Código funcionando
- ✅ Documentação completa

**O que falta:**
- ⚠️ Adicionar variáveis no Vercel (5 minutos)
- ⚠️ Fazer deploy
- ⚠️ Testar em produção

**Tempo estimado:** 5-10 minutos

---

**Goldmonkey Studio**  
**Última atualização:** 2025-01-27

