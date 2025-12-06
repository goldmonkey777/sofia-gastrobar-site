# 🌐 Configuração do Domínio sofiagastrobaribiza.com

## Status Atual
- ✅ Projeto deployado: `sofia-gastrobar-site`
- ✅ Domínios adicionados via CLI ao projeto
- ⚠️ Pode haver conflito se o domínio estiver em outro projeto/time

## Passos para Configurar no Dashboard

### 1. Acesse o Projeto Correto
1. Vá para: https://vercel.com/goldmonkeys-projects/sofia-gastrobar-site/settings/domains
2. Ou navegue: **Dashboard → sofia-gastrobar-site → Settings → Domains**

### 2. Verifique os Domínios
Você deve ver:
- `sofiagastrobaribiza.com`
- `www.sofiagastrobaribiza.com`

### 3. Se os Domínios Estiverem em Outro Projeto
Se aparecer erro ou os domínios estiverem no projeto `sofia-gastrobar-ibiza`:

**Opção A - Mover Domínios:**
1. No projeto antigo (`sofia-gastrobar-ibiza`):
   - Settings → Domains
   - Clique em "Remove" nos domínios
   - Confirme a remoção

2. No projeto novo (`sofia-gastrobar-site`):
   - Settings → Domains
   - Clique em "Add Domain"
   - Digite: `sofiagastrobaribiza.com`
   - Selecione "Production" environment
   - Repita para `www.sofiagastrobaribiza.com`

**Opção B - Usar o Projeto Existente:**
Se preferir usar o projeto `sofia-gastrobar-ibiza`:
1. Faça deploy nesse projeto:
   ```bash
   # No diretório do projeto
   vercel --prod
   ```
2. Verifique se os domínios já estão conectados

### 4. Configurar Redirect (Opcional)
- **sofiagastrobaribiza.com** → Redirect para **www.sofiagastrobaribiza.com** (307)
- **www.sofiagastrobaribiza.com** → Production (sem redirect)

### 5. Verificar DNS
Após configurar, verifique os registros DNS:

**CNAME (Recomendado):**
```
Tipo: CNAME
Nome: @ ou sofiagastrobaribiza.com
Valor: cname.vercel-dns.com
TTL: Auto ou 3600
```

**Para www:**
```
Tipo: CNAME
Nome: www
Valor: cname.vercel-dns.com
TTL: Auto ou 3600
```

### 6. Aguardar Propagação
- DNS: 5 minutos a 48 horas (geralmente < 1 hora)
- SSL: Automático pelo Vercel (pode levar alguns minutos)

## Verificação

Após configurar, teste:

```bash
# Testar domínio principal
curl -I https://sofiagastrobaribiza.com

# Testar www
curl -I https://www.sofiagastrobaribiza.com

# Deve retornar HTTP 200 ou 307 (redirect)
```

## Troubleshooting

### Erro 404
- Verifique se o domínio está conectado ao ambiente "Production"
- Verifique se há um deploy recente
- Aguarde alguns minutos após salvar

### Erro 403 (Access Denied)
- O domínio pode estar em outro projeto/time
- Remova do projeto antigo e adicione ao novo

### SSL não funciona
- Aguarde alguns minutos (Vercel gera automaticamente)
- Verifique se o DNS está configurado corretamente

## Comandos Úteis

```bash
# Ver projetos
vercel ls

# Ver domínios do projeto
vercel domains ls

# Fazer deploy
vercel --prod

# Ver logs do deploy
vercel inspect [deployment-url] --logs
```

---

**Última atualização:** Após deploy em `sofia-gastrobar-site`

