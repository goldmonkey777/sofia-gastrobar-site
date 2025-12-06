# 🚀 Guia de Deploy - Sofia Gastrobar Ibiza

## Domínio de Produção
**sofiagastrobaribiza.com**

## Pré-requisitos
- Conta no [Vercel](https://vercel.com)
- Repositório Git (GitHub, GitLab ou Bitbucket)
- Domínio configurado

## Deploy via Vercel

### 1. Conectar Repositório
1. Acesse [vercel.com](https://vercel.com)
2. Clique em "Add New Project"
3. Importe o repositório do GitHub/GitLab
4. Configure:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./` (raiz do projeto)
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

### 2. Variáveis de Ambiente
No dashboard do Vercel, vá em **Settings → Environment Variables** e adicione:

```bash
# App
NEXT_PUBLIC_APP_URL=https://sofiagastrobaribiza.com

# Restaurant Info
NEXT_PUBLIC_RESTAURANT_NAME="Sofia Gastrobar Ibiza"
NEXT_PUBLIC_RESTAURANT_PHONE="+34 611 48 77 73"
NEXT_PUBLIC_RESTAURANT_EMAIL=""
NEXT_PUBLIC_RESTAURANT_ADDRESS="Carrer des Caló, 109, 07829 Sant Agustí des Vedrà, Illes Balears, Spain"

# Social Media
NEXT_PUBLIC_INSTAGRAM="sofia_gastrobar_ibiza"
NEXT_PUBLIC_FACEBOOK=""

# Payment Integration (SumUp)
NEXT_PUBLIC_SUMUP_API_KEY=""
SUMUP_SECRET_KEY=""

# Feature Flags
NEXT_PUBLIC_ENABLE_MINI_GAME=true
NEXT_PUBLIC_ENABLE_DJ_MODE=true
NEXT_PUBLIC_ENABLE_QR_TABLES=true

# Analytics
NEXT_PUBLIC_GA_ID=""
```

### 3. Configurar Domínio Customizado
1. No Vercel, vá em **Settings → Domains**
2. Adicione: `sofiagastrobaribiza.com`
3. Configure os registros DNS conforme instruções:
   - **Tipo A**: Apontar para IP do Vercel
   - **Tipo CNAME**: Apontar para `cname.vercel-dns.com`
   - **Tipo AAAA**: Para IPv6 (opcional)

### 4. Deploy Automático
- **Branch `main`**: Deploy automático em produção
- **Outras branches**: Preview deploys

## Deploy Manual via CLI

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy para produção
vercel --prod

# Ou apenas preview
vercel
```

## Verificações Pós-Deploy

### ✅ Checklist
- [ ] Site acessível em `https://sofiagastrobaribiza.com`
- [ ] HTTPS funcionando (certificado SSL automático)
- [ ] Página inicial carregando corretamente
- [ ] Páginas de mesa funcionando (`/mesa/01`, etc.)
- [ ] API de garçom funcionando (`/api/garcom`)
- [ ] Imagens carregando (Unsplash)
- [ ] Analytics funcionando (Vercel Analytics)
- [ ] Speed Insights ativo

### Testar Rotas
```bash
# Página inicial
https://sofiagastrobaribiza.com

# Página de mesa
https://sofiagastrobaribiza.com/mesa/01

# API
https://sofiagastrobaribiza.com/api/garcom
```

## Performance

O projeto está otimizado com:
- ✅ Next.js Image Optimization
- ✅ Static Generation quando possível
- ✅ Compressão habilitada
- ✅ Headers de segurança
- ✅ Vercel Analytics
- ✅ Speed Insights

## Troubleshooting

### Erro 404 em rotas dinâmicas
- Verificar se `vercel.json` está configurado corretamente
- Verificar se as rotas estão em `src/app/`

### Imagens não carregam
- Verificar `next.config.ts` - `remotePatterns` configurado
- Verificar se o domínio está na whitelist

### Build falha
- Verificar logs no Vercel
- Testar build local: `npm run build`
- Verificar dependências: `npm install`

## Suporte

Para problemas de deploy, verificar:
- [Vercel Docs](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)

---

**Desenvolvido por Goldmonkey Studio**

