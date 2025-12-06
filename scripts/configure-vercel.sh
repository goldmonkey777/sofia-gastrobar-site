#!/bin/bash

# Script para configurar variáveis de ambiente no Vercel
# Uso: ./scripts/configure-vercel.sh

set -e

echo "🚀 Configurando variáveis de ambiente no Vercel..."
echo ""

# Verificar se está logado no Vercel
if ! vercel whoami &>/dev/null; then
    echo "❌ Você não está logado no Vercel"
    echo "Execute: vercel login"
    exit 1
fi

echo "✅ Logado no Vercel"
echo ""

# API Key do SumUp
SUMUP_API_KEY="sup_sk_HpNK1TKk2HuuDDfkctixqSKWaBXF70gNc"

# Site URL
SITE_URL="https://sofiagastrobaribiza.com"

echo "📝 Adicionando variáveis de ambiente..."
echo ""

# Adicionar SUMUP_API_KEY
echo "1. Adicionando SUMUP_API_KEY..."
vercel env add SUMUP_API_KEY production preview development <<< "$SUMUP_API_KEY" || {
    echo "⚠️  SUMUP_API_KEY pode já existir. Continuando..."
}

# Adicionar NEXT_PUBLIC_SITE_URL
echo "2. Adicionando NEXT_PUBLIC_SITE_URL..."
vercel env add NEXT_PUBLIC_SITE_URL production preview development <<< "$SITE_URL" || {
    echo "⚠️  NEXT_PUBLIC_SITE_URL pode já existir. Continuando..."
}

echo ""
echo "✅ Variáveis de ambiente configuradas!"
echo ""
echo "📋 Próximos passos:"
echo "   1. Verificar no Vercel Dashboard: https://vercel.com"
echo "   2. Fazer deploy: vercel --prod"
echo "   3. Ou aguardar auto-deploy do Git"
echo ""

