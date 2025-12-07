# 🎯 Como Adicionar Scope "payments" no SumUp

## 📋 Passo a Passo Completo

### 1️⃣ Acessar SumUp Developer Portal

1. Abra o navegador
2. Vá para: **https://developer.sumup.com**
3. Clique em **"Login"** (canto superior direito)
4. Faça login com:
   - **Email**: `contact@goldmonkey.studio` (ou `redle82@gmail.com`)
   - **Senha**: (sua senha do SumUp)

---

### 2️⃣ Encontrar Sua Aplicação

1. Após login, você verá o **Dashboard**
2. No menu lateral esquerdo, clique em **"Applications"** ou **"My Apps"**
3. Você verá a aplicação: **"Sofia Gastrobar Website"**
   - **ID**: `CCCXGCA3P`
   - **Type**: Web

---

### 3️⃣ Editar a Aplicação

1. Clique no nome da aplicação: **"Sofia Gastrobar Website"**
2. Você verá os detalhes da aplicação:
   ```
   Nome: Sofia Gastrobar Website
   Tipo: Web
   Client ID: cc_classic_tJ4Foi5duE73BR7IzfuMcE0fHkPyF
   Redirect URIs: https://sofiagastrobaribiza.com/api/sumup/callback
   CORS URIs: https://sofiagastrobaribiza.com
   ```

3. Procure pelo botão **"Edit"** ou **"Settings"** (geralmente no canto superior direito)
4. Clique em **"Edit"**

---

### 4️⃣ Adicionar Scope "payments"

Agora você verá um formulário de edição. Procure pela seção chamada:
- **"Scopes"** OU
- **"Permissions"** OU
- **"API Permissions"** OU
- **"OAuth Scopes"**

**Você verá uma lista de checkboxes como esta**:

```
☐ transactions.history     (Ler histórico de transações)
☐ user.app-settings        (Configurações do usuário)
☐ user.profile_readonly    (Perfil do usuário - leitura)
☐ products                 (Gerenciar produtos)
☐ invoices.read            (Ler faturas)
☐ invoices.write           (Escrever faturas)
☐ accounting.read          (Ler dados contábeis)
☐ accounting.write         (Escrever dados contábeis)
☐ readers.read             (Ler leitores de cartão)
☐ readers.write            (Escrever leitores de cartão)
☑ payments                 (Criar e gerenciar pagamentos) ← MARQUE ESTE!
☐ payment_instruments      (Gerenciar instrumentos de pagamento)
```

**Ação**:
1. ✅ **Marque a checkbox** `payments`
2. ✅ **Marque também** `payment_instruments` (opcional, mas recomendado)

---

### 5️⃣ Salvar Alterações

1. Role até o final da página
2. Clique no botão **"Save"** ou **"Update Application"**
3. Aguarde a confirmação: ✅ "Application updated successfully"

---

### 6️⃣ Testar se Funcionou

Agora volte para o terminal e execute:

```bash
npx tsx test-sumup-auth.ts
```

**Resultado esperado**:

```
🔑 Testando Credenciais SumUp
============================================================

📋 Variáveis de Ambiente:
   CLIENT_ID: ✅ Configurado
   CLIENT_SECRET: ✅ Configurado
   MERCHANT_CODE: ✅ Configurado (MNAAKKUV)

🔄 Testando autenticação OAuth com SumUp...
   Status: 200 OK
✅ Autenticação bem-sucedida!
   Access Token: ✅ Recebido
   Tipo: Bearer
   Expira em: 3600 segundos

🔄 Testando criação de Payment Link...
   Status: 200 OK                              ← DEVE SER 200, NÃO 403!
✅ Payment Link criado com sucesso!            ← DEVE APARECER ESTA MENSAGEM!
   ID: abc123xyz
   Status: PENDING
   Checkout URL: https://pay.sumup.com/abc123xyz

============================================================
✅ TODOS OS TESTES PASSARAM!
============================================================

🎉 Sistema SumUp está configurado corretamente!
   ✅ Google Pay habilitado
   ✅ Apple Pay habilitado
   ✅ Payment Links funcionando
   ✅ Callback URL configurado
```

---

## 🔄 Alternativa: Se Não Encontrar "Scopes"

Se você **não encontrar** a seção "Scopes" na edição da aplicação, pode ser que:

### Opção A: Scopes estão em outra tela

1. Volte para a lista de aplicações
2. Procure por um ícone de **"⚙️ Settings"** ou **"🔒 Permissions"**
3. Clique e procure pela lista de scopes

### Opção B: Usar Access Token Manual

Se realmente não conseguir adicionar o scope, use um Access Token manual:

1. **Acesse**: https://me.sumup.com/developers
2. Você verá: **"API Credentials"** ou **"Generate Access Token"**
3. Clique em **"Generate New Token"** ou **"Create Access Token"**
4. **Marque os scopes**:
   - ✅ `payments`
   - ✅ `payment_instruments`
5. Clique em **"Generate Token"**
6. Copie o token (começa com `sup_sk_...`)
7. Abra `.env.local` e adicione:
   ```bash
   SUMUP_ACCESS_TOKEN=sup_sk_...cole_o_token_aqui...
   ```
8. Salve o arquivo
9. Teste: `npx tsx test-sumup-auth.ts`

**⚠️ Desvantagem**: Você precisará renovar o token manualmente quando expirar (geralmente 30 dias).

---

## 🎬 Vídeo Tutorial (se disponível)

Se você ainda tiver dificuldades, a SumUp tem vídeos tutoriais:

- **YouTube**: Procure por "SumUp Developer OAuth Scopes"
- **Documentação**: https://developer.sumup.com/docs/api/authorization

---

## 💬 Suporte SumUp

Se nada funcionar, entre em contato com o suporte:

- **Email**: integration@sumup.com
- **Chat**: No Developer Portal (ícone de chat no canto inferior direito)
- **Diga**: "Preciso adicionar o scope 'payments' na minha aplicação CCCXGCA3P"

---

## ✅ Checklist Final

Antes de sair do Developer Portal, confirme:

- [ ] Scope `payments` está marcado
- [ ] Scope `payment_instruments` está marcado (opcional)
- [ ] Redirect URI está: `https://sofiagastrobaribiza.com/api/sumup/callback`
- [ ] CORS URI está: `https://sofiagastrobaribiza.com`
- [ ] Clicou em "Save"
- [ ] Testou: `npx tsx test-sumup-auth.ts`
- [ ] Viu: ✅ Payment Link criado com sucesso!

---

## 🎉 Pronto!

Depois de adicionar o scope, seu sistema estará **100% funcional** e pronto para processar pagamentos com:

- ✅ Google Pay
- ✅ Apple Pay
- ✅ Cartões de crédito/débito
- ✅ Deep links mobile
- ✅ Callbacks automáticos

**Última atualização**: 2025-12-07
**Dificuldade**: ⭐ Fácil (2 minutos)
