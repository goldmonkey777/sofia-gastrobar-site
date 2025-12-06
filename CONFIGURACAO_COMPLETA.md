# ✅ CONFIGURAÇÃO COMPLETA - Sofia Gastrobar

**Data:** 2025-01-27  
**Status:** Configuração automatizada

---

## ✅ O QUE FOI CONFIGURADO

### 1. SumUp Integration
- ✅ SDK instalado: `@sumup/sdk@0.0.8`
- ✅ API Key configurada localmente: `.env.local`
- ✅ Código atualizado para usar API Key

### 2. Variáveis de Ambiente Locais
- ✅ `SUMUP_API_KEY` adicionada ao `.env.local`
- ✅ Arquivo protegido no `.gitignore`

### 3. Scripts de Configuração
- ✅ Script criado: `scripts/configure-vercel.sh`
- ✅ Documentação completa criada

---

## 🔴 CONFIGURAÇÃO NO VERCEL (PRODUÇÃO)

### Opção 1: Via Dashboard (Recomendado)

1. **Acessar Vercel Dashboard:**
   - https://vercel.com
   - Selecionar projeto: `sofia-gastrobar-site`

2. **Adicionar Variáveis:**
   - Ir em **Settings > Environment Variables**
   - Adicionar as seguintes variáveis:

```env
SUMUP_API_KEY=sup_sk_HpNK1TKk2HuuDDfkctixqSKWaBXF70gNc
NEXT_PUBLIC_SITE_URL=https://sofiagastrobaribiza.com
```

3. **Configurar para todos os ambientes:**
   - ✅ Production
   - ✅ Preview
   - ✅ Development

4. **Salvar e fazer deploy**

### Opção 2: Via CLI (Automático)

```bash
# Se estiver logado no Vercel
vercel env add SUMUP_API_KEY production preview development
# Colar: sup_sk_HpNK1TKk2HuuDDfkctixqSKWaBXF70gNc

vercel env add NEXT_PUBLIC_SITE_URL production preview development
# Colar: https://sofiagastrobaribiza.com
```

Ou usar o script:
```bash
./scripts/configure-vercel.sh
```

---

## 🧪 TESTAR CONFIGURAÇÃO

### Teste Local:
```bash
npm run dev
```

1. Acessar: http://localhost:3000/reservas
2. Fazer uma reserva de teste
3. Verificar se aparece botão de pagamento SumUp
4. Verificar se redireciona para SumUp

### Teste em Produção:
1. Após configurar no Vercel
2. Acessar: https://sofiagastrobaribiza.com/reservas
3. Fazer uma reserva de teste
4. Verificar se o pagamento funciona

---

## 📋 CHECKLIST FINAL

### Local (Desenvolvimento)
- [x] SDK instalado
- [x] API Key no `.env.local`
- [x] Servidor pode ser iniciado

### Produção (Vercel)
- [ ] `SUMUP_API_KEY` adicionada ao Vercel
- [ ] `NEXT_PUBLIC_SITE_URL` adicionada ao Vercel
- [ ] Variáveis configuradas para todos os ambientes
- [ ] Deploy realizado
- [ ] Teste em produção realizado

---

## 🔒 SEGURANÇA

✅ **API Key protegida:**
- `.env.local` no `.gitignore`
- Não será commitada
- Apenas você tem acesso

⚠️ **Lembre-se:**
- Nunca compartilhe a API Key
- Use variáveis de ambiente no Vercel
- Não hardcode valores sensíveis

---

## 🆘 TROUBLESHOOTING

### Erro: "SUMUP_NOT_CONFIGURED"
- Verificar se `.env.local` tem `SUMUP_API_KEY`
- Reiniciar servidor: `npm run dev`
- Em produção: verificar no Vercel Dashboard

### Erro: "Invalid API Key"
- Verificar se a chave está correta
- Verificar se não tem espaços extras
- Verificar se a conta SumUp está ativa

### Variáveis não aparecem no Vercel
- Verificar se está no projeto correto
- Verificar se selecionou todos os ambientes
- Fazer novo deploy após adicionar variáveis

---

## 📚 DOCUMENTAÇÃO

- **Setup SumUp:** `SETUP_SUMUP.md`
- **Checklist:** `CHECKLIST_SUMUP.md`
- **Configuração Completa:** `CONFIGURACAO_SUMUP_COMPLETA.md`
- **Deploy:** `DEPLOY.md`

---

**Goldmonkey Studio**  
**Última atualização:** 2025-01-27

