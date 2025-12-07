# 🚨 INSTRUÇÕES URGENTES - REBUILD FORÇADO NO VERCEL

**PROBLEMA:** O código está correto, mas o deploy não está aplicando as mudanças devido ao build cache.

**SOLUÇÃO:** Fazer rebuild forçado **MANUALMENTE** no Vercel Dashboard.

---

## 📋 PASSOS DETALHADOS

### 1. Acessar Vercel Dashboard

1. Abrir navegador
2. Acessar: **https://vercel.com**
3. Fazer login
4. Selecionar projeto: **sofia-gastrobar-site**

---

### 2. Ir para Deployments

1. No menu lateral, clicar em **"Deployments"**
2. Ver lista de deploys
3. Encontrar o **último deploy** (mais recente)

---

### 3. Fazer Redeploy FORÇADO

1. No último deploy, clicar nos **3 pontos** (⋯) no canto superior direito
2. Clicar em **"Redeploy"**
3. ⚠️ **CRÍTICO:** Na janela que abrir, **DESMARCAR** a opção:
   - ❌ **"Use existing Build Cache"**
4. Clicar em **"Redeploy"**
5. Aguardar (2-3 minutos)

---

### 4. Verificar se Funcionou

1. Após deploy completar, acessar: **https://sofiagastrobaribiza.com/delivery**
2. Fazer pedido de teste
3. Clicar em **"Confirm and Pay"**
4. **NÃO deve mais dar erro de validação**

---

## 🔍 VERIFICAR LOGS

1. Vercel Dashboard > **Deployments** > [último deploy] > **Functions**
2. Procurar por: `[SumUp] 📤 Payload completo`
3. Deve mostrar: `"pay_to_email": "info@sofiagastrobaribiza.com"`

---

## ⚠️ SE AINDA NÃO FUNCIONAR

1. **Verificar logs:**
   - Ver se `pay_to_email` está no payload
   - Ver se erro está sendo detectado

2. **Verificar variáveis:**
   - Settings > Environment Variables
   - Confirmar que `SUMUP_API_KEY` está configurada

3. **Tentar novamente:**
   - Fazer outro rebuild forçado
   - Aguardar mais tempo (às vezes leva 5 minutos)

---

## 📞 CONTATO

Se após rebuild forçado ainda não funcionar, verificar:
- Logs do Vercel
- Payload enviado
- Erro retornado pela API SumUp

---

**IMPORTANTE:** O código está correto. O problema é apenas que o build cache está impedindo a aplicação das mudanças. O rebuild forçado (sem cache) deve resolver.

