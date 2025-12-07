# 🍎 Apple Pay Setup - Sofia Gastrobar

**Data:** 2025-01-27  
**Status:** ✅ Arquivo de associação configurado

---

## ✅ O QUE FOI CONFIGURADO

### Arquivo de Associação do Domínio
- ✅ Arquivo copiado para: `public/.well-known/apple-developer-merchantid-domain-association`
- ✅ Acessível em: `https://sofiagastrobaribiza.com/.well-known/apple-developer-merchantid-domain-association`

---

## 📋 O QUE É ISSO?

O arquivo `apple-developer-merchantid-domain-association` é necessário para:
- ✅ Verificar que você é o proprietário do domínio
- ✅ Habilitar Apple Pay no seu site
- ✅ Permitir que clientes usem Apple Pay para pagamentos

---

## 🔍 VERIFICAR SE ESTÁ FUNCIONANDO

Após o deploy, verifique se o arquivo está acessível:

```bash
curl https://sofiagastrobaribiza.com/.well-known/apple-developer-merchantid-domain-association
```

Ou acesse diretamente no navegador:
- https://sofiagastrobaribiza.com/.well-known/apple-developer-merchantid-domain-association

---

## 📋 PRÓXIMOS PASSOS

### 1. Verificar no Apple Developer
1. Acessar: https://developer.apple.com
2. Ir em **Certificates, Identifiers & Profiles**
3. Verificar se o domínio está verificado
4. Verificar se o Merchant ID está configurado

### 2. Configurar no SumUp (se necessário)
- Verificar se o Apple Pay está habilitado na conta SumUp
- Verificar se o Merchant ID está configurado no SumUp

### 3. Testar Apple Pay
1. Acessar o site em um dispositivo iOS
2. Fazer uma reserva ou pedido
3. Verificar se aparece a opção Apple Pay
4. Testar um pagamento

---

## 🔒 SEGURANÇA

✅ **Arquivo público:**
- Este arquivo é público por design
- Precisa estar acessível sem autenticação
- Não contém informações sensíveis

---

## 📚 DOCUMENTAÇÃO

- **Apple Pay Web:** https://developer.apple.com/apple-pay/
- **SumUp Apple Pay:** Verificar documentação do SumUp

---

**Goldmonkey Studio**  
**Configurado em:** 2025-01-27

