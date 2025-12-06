# ✅ Configuração SumUp - COMPLETA

**Data:** 2025-01-27  
**Status:** ✅ API Key configurada localmente

---

## ✅ O QUE JÁ FOI FEITO

### 1. SDK Instalado
- ✅ `@sumup/sdk@0.0.8` instalado
- ✅ Código atualizado para usar API Key

### 2. API Key Configurada (Local)
- ✅ `SUMUP_API_KEY` adicionada ao `.env.local`
- ✅ Arquivo `.env.local` está no `.gitignore` (seguro)

---

## 🔴 O QUE VOCÊ PRECISA FAZER AGORA

### ⚠️ IMPORTANTE: Configurar no Vercel (Produção)

A API Key está configurada **apenas localmente**. Para funcionar em produção, você precisa:

1. **Acessar Vercel Dashboard:**
   - https://vercel.com
   - Selecionar projeto: `sofia-gastrobar-site`

2. **Adicionar Variável de Ambiente:**
   - Ir em **Settings > Environment Variables**
   - Clicar em **Add New**
   - **Key:** `SUMUP_API_KEY`
   - **Value:** `sup_sk_HpNK1TKk2HuuDDfkctixqSKWaBXF70gNc`
   - **Environments:** ✅ Production, ✅ Preview, ✅ Development
   - Clicar em **Save**

3. **Fazer Deploy:**
   - Após adicionar a variável, fazer um novo deploy
   - Ou aguardar o próximo auto-deploy

---

## 🧪 TESTAR

### Teste Local:
```bash
# Reiniciar servidor se estiver rodando
npm run dev
```

1. Acessar: http://localhost:3000/reservas
2. Preencher formulário de reserva
3. Verificar se aparece botão de pagamento SumUp
4. Clicar e verificar se redireciona para SumUp

### Teste em Produção:
1. Após configurar no Vercel
2. Acessar: https://sofiagastrobaribiza.com/reservas
3. Fazer uma reserva de teste
4. Verificar se o pagamento funciona

---

## 🔒 SEGURANÇA

✅ **API Key está protegida:**
- `.env.local` está no `.gitignore`
- Não será commitada no Git
- Apenas você tem acesso local

⚠️ **Lembre-se:**
- Nunca compartilhe a API Key publicamente
- Não commite o `.env.local`
- Use variáveis de ambiente no Vercel (não hardcode)

---

## 📋 PRÓXIMOS PASSOS (Opcional)

### Para funcionalidade completa:

1. **Configurar Webhook:**
   - URL: `https://sofiagastrobaribiza.com/api/sumup/webhook`
   - Eventos: `payment.succeeded`, `payment.failed`, `payment.cancelled`
   - Adicionar `SUMUP_WEBHOOK_SECRET` ao `.env.local` e Vercel

2. **Configurar Merchant Code:**
   - Obter do SumUp Dashboard
   - Adicionar `SUMUP_MERCHANT_CODE` (opcional)

---

## ✅ CHECKLIST FINAL

- [x] SDK instalado
- [x] API Key obtida
- [x] API Key adicionada ao `.env.local` (local)
- [ ] **API Key adicionada ao Vercel (produção)** ← **FAZER AGORA**
- [ ] Servidor reiniciado (se necessário)
- [ ] Teste local realizado
- [ ] Teste em produção realizado

---

## 🆘 SE ALGO NÃO FUNCIONAR

### Erro: "SUMUP_NOT_CONFIGURED"
- Verificar se `.env.local` tem `SUMUP_API_KEY`
- Reiniciar servidor: `npm run dev`
- Em produção: verificar no Vercel Dashboard

### Erro: "Invalid API Key"
- Verificar se a chave está correta
- Verificar se não tem espaços extras
- Verificar se a conta SumUp está ativa

---

**Goldmonkey Studio**  
**Última atualização:** 2025-01-27

