# 🔧 Configuração do SumUp - Sofia Gastrobar

**Guia completo para configurar o sistema de pagamentos SumUp**

---

## ⚠️ IMPORTANTE

O sistema de pagamentos SumUp **NÃO está configurado por padrão**. Você precisa configurar as variáveis de ambiente antes de usar os pagamentos online.

---

## 📋 Passo 1: Criar Conta SumUp

1. Acesse: https://sumup.com
2. Crie uma conta de negócio
3. Complete a verificação de identidade
4. Configure sua conta bancária

---

## 📋 Passo 2: Obter Credenciais

Após criar a conta, você precisa obter:

1. **Client ID** (Application ID)
2. **Client Secret** (Application Secret)
3. **Access Token** (ou Merchant Code)

### Como obter:

1. Acesse o **SumUp Dashboard**
2. Vá em **Settings > API**
3. Crie uma nova aplicação
4. Copie o **Client ID** e **Client Secret**
5. Gere um **Access Token** (ou use o Merchant Code)

---

## 📋 Passo 3: Configurar Variáveis de Ambiente

### Arquivo `.env.local`

Crie ou edite o arquivo `.env.local` na raiz do projeto:

```env
# SumUp Integration (OBRIGATÓRIO para pagamentos)
SUMUP_CLIENT_ID=seu_client_id_aqui
SUMUP_CLIENT_SECRET=seu_client_secret_aqui
SUMUP_ACCESS_TOKEN=seu_access_token_aqui
SUMUP_MERCHANT_CODE=seu_merchant_code_aqui
SUMUP_WEBHOOK_SECRET=seu_webhook_secret_aqui
SUMUP_REDIRECT_URI=https://sofiagastrobaribiza.com/api/sumup/callback

# ChefIApp OS Integration (Opcional)
CHEFIAPP_OS_API_URL=https://api.chefiapp.com
CHEFIAPP_OS_API_KEY=sua_api_key_aqui

# Site URL
NEXT_PUBLIC_SITE_URL=https://sofiagastrobaribiza.com
```

### Variáveis Obrigatórias

- ✅ `SUMUP_CLIENT_ID` - ID da aplicação SumUp
- ✅ `SUMUP_CLIENT_SECRET` - Secret da aplicação SumUp
- ✅ `SUMUP_ACCESS_TOKEN` OU `SUMUP_MERCHANT_CODE` - Token de acesso ou código do merchant

### Variáveis Opcionais (mas recomendadas)

- `SUMUP_WEBHOOK_SECRET` - Secret para validar webhooks
- `SUMUP_REDIRECT_URI` - URL de redirecionamento após pagamento

---

## 📋 Passo 4: Configurar Webhook no SumUp

1. Acesse o **SumUp Dashboard**
2. Vá em **Settings > Webhooks**
3. Clique em **Add Webhook**
4. Configure:
   - **URL:** `https://sofiagastrobaribiza.com/api/sumup/webhook`
   - **Events:** Selecione:
     - `payment.succeeded`
     - `payment.failed`
     - `payment.cancelled`
5. Copie o **Webhook Secret** e adicione ao `.env.local`

---

## 📋 Passo 5: Configurar no Vercel (Produção)

1. Acesse o **Vercel Dashboard**
2. Vá em **Settings > Environment Variables**
3. Adicione todas as variáveis do `.env.local`
4. **IMPORTANTE:** Configure para todos os ambientes (Production, Preview, Development)

---

## 🧪 Testar Configuração

### Teste Local

1. Configure o `.env.local`
2. Reinicie o servidor: `npm run dev`
3. Tente fazer uma reserva ou pedido de delivery
4. Verifique se o link de pagamento é gerado

### Teste em Produção

1. Configure as variáveis no Vercel
2. Faça deploy
3. Teste em produção

---

## ❌ Erro: "SUMUP_NOT_CONFIGURED"

Se você ver este erro, significa que:

1. ❌ As variáveis de ambiente não estão configuradas
2. ❌ O arquivo `.env.local` não existe
3. ❌ As variáveis estão com nomes incorretos
4. ❌ O servidor não foi reiniciado após adicionar as variáveis

### Solução:

1. Verifique se o arquivo `.env.local` existe
2. Verifique se os nomes das variáveis estão corretos
3. Reinicie o servidor: `npm run dev`
4. Em produção, verifique no Vercel Dashboard

---

## 🔒 Segurança

⚠️ **NUNCA** commite o arquivo `.env.local` no Git!

O arquivo `.env.local` já está no `.gitignore` e não será commitado.

---

## 📞 Suporte

Se tiver problemas:

1. Verifique a documentação do SumUp: https://developer.sumup.com
2. Verifique os logs do servidor
3. Entre em contato com o suporte SumUp

---

## ✅ Checklist de Configuração

- [ ] Conta SumUp criada e verificada
- [ ] Client ID e Client Secret obtidos
- [ ] Access Token ou Merchant Code configurado
- [ ] Webhook configurado no SumUp
- [ ] Variáveis adicionadas ao `.env.local`
- [ ] Variáveis adicionadas ao Vercel (produção)
- [ ] Servidor reiniciado
- [ ] Teste realizado com sucesso

---

**Goldmonkey Studio - Configuração SumUp**

