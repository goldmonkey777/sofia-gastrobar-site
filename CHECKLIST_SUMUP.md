# ✅ CHECKLIST - O QUE VOCÊ PRECISA FAZER AGORA

**Para o sistema de pagamentos SumUp funcionar, você precisa:**

---

## 🔴 OBRIGATÓRIO (Para funcionar)

### 1️⃣ Criar Conta SumUp
- [ ] Acessar: https://sumup.com
- [ ] Criar conta de negócio
- [ ] Completar verificação de identidade
- [ ] Configurar conta bancária

### 2️⃣ Obter API Key (Método Mais Simples)

**Opção A: API Key (Recomendado)**
- [ ] Acessar SumUp Dashboard: https://me.sumup.com
- [ ] Ir em **Settings > API** ou **Developer > Applications**
- [ ] Criar uma nova **API Key**
- [ ] Copiar a API Key (começa com `sup_sk_...`)

**Opção B: OAuth (Alternativo)**
- [ ] Acessar SumUp Dashboard
- [ ] Ir em **Settings > API**
- [ ] Criar uma nova aplicação
- [ ] Copiar **Client ID** e **Client Secret**
- [ ] Gerar **Access Token**

### 3️⃣ Configurar Variáveis de Ambiente

**Local (Desenvolvimento):**
- [ ] Criar arquivo `.env.local` na raiz do projeto
- [ ] Adicionar uma das opções abaixo:

```env
# OPÇÃO 1: API Key (Mais Simples - Recomendado)
SUMUP_API_KEY=sup_sk_sua_api_key_aqui

# OU OPÇÃO 2: OAuth
SUMUP_CLIENT_ID=seu_client_id
SUMUP_CLIENT_SECRET=seu_client_secret
SUMUP_ACCESS_TOKEN=seu_access_token
```

**Produção (Vercel):**
- [ ] Acessar Vercel Dashboard: https://vercel.com
- [ ] Selecionar projeto `sofia-gastrobar-site`
- [ ] Ir em **Settings > Environment Variables**
- [ ] Adicionar `SUMUP_API_KEY` (ou as variáveis OAuth)
- [ ] Selecionar **Production, Preview, Development**
- [ ] Salvar

### 4️⃣ Reiniciar Servidor
- [ ] Parar o servidor local (Ctrl+C)
- [ ] Executar: `npm run dev`
- [ ] Testar fazendo uma reserva ou pedido de delivery

---

## 🟡 RECOMENDADO (Para funcionar completo)

### 5️⃣ Configurar Webhook (Para confirmação automática)
- [ ] Acessar SumUp Dashboard
- [ ] Ir em **Settings > Webhooks**
- [ ] Clicar em **Add Webhook**
- [ ] URL: `https://sofiagastrobaribiza.com/api/sumup/webhook`
- [ ] Eventos: `payment.succeeded`, `payment.failed`, `payment.cancelled`
- [ ] Copiar **Webhook Secret**
- [ ] Adicionar ao `.env.local`: `SUMUP_WEBHOOK_SECRET=seu_secret`

### 6️⃣ Configurar Merchant Code (Opcional)
- [ ] Obter Merchant Code do SumUp Dashboard
- [ ] Adicionar ao `.env.local`: `SUMUP_MERCHANT_CODE=seu_merchant_code`

---

## 🟢 OPCIONAL (Melhorias futuras)

- [ ] Configurar ChefIApp OS Integration
- [ ] Configurar redirect URI customizado
- [ ] Testar em ambiente sandbox primeiro

---

## 🧪 TESTAR

### Teste Rápido:
1. [ ] Fazer uma reserva em `/reservas`
2. [ ] Verificar se aparece o botão de pagamento
3. [ ] Clicar e verificar se redireciona para SumUp
4. [ ] (Opcional) Fazer um pagamento de teste

### Se aparecer erro "SUMUP_NOT_CONFIGURED":
- [ ] Verificar se `.env.local` existe
- [ ] Verificar se a variável está escrita corretamente
- [ ] Reiniciar o servidor
- [ ] Em produção: verificar no Vercel Dashboard

---

## 📝 RESUMO RÁPIDO

**Mínimo necessário para funcionar:**

1. ✅ Conta SumUp criada
2. ✅ API Key obtida
3. ✅ `SUMUP_API_KEY` adicionada ao `.env.local` (local)
4. ✅ `SUMUP_API_KEY` adicionada ao Vercel (produção)
5. ✅ Servidor reiniciado

**Pronto! O sistema deve funcionar.**

---

## 🔗 Links Úteis

- **SumUp Dashboard:** https://me.sumup.com
- **SumUp Developer Docs:** https://developer.sumup.com
- **Vercel Dashboard:** https://vercel.com
- **Documentação Completa:** Ver `SETUP_SUMUP.md`

---

**Última atualização:** 2025-01-27  
**Goldmonkey Studio**

