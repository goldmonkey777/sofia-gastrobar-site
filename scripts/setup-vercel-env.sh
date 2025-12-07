#!/bin/bash

# Script interativo para configurar variáveis de ambiente no Vercel
# Uso: ./scripts/setup-vercel-env.sh

set -e

echo "🚀 Configuração de Variáveis de Ambiente - Vercel"
echo "=================================================="
echo ""

# Verificar se está logado
if ! vercel whoami &>/dev/null; then
    echo "❌ Você não está logado no Vercel"
    echo "Execute: vercel login"
    exit 1
fi

echo "✅ Logado no Vercel como: $(vercel whoami)"
echo ""

# Valores
SUMUP_API_KEY="sup_sk_HpNK1TKk2HuuDDfkctixqSKWaBXF70gNc"
SITE_URL="https://sofiagastrobaribiza.com"

echo "📝 Variáveis que serão adicionadas:"
echo "  1. SUMUP_API_KEY"
echo "  2. NEXT_PUBLIC_SITE_URL"
echo ""

read -p "Continuar? (s/n): " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[SsYy]$ ]]; then
    echo "Cancelado."
    exit 0
fi

echo ""
echo "🔧 Adicionando variáveis..."
echo ""

# SUMUP_API_KEY
echo "1️⃣  Adicionando SUMUP_API_KEY..."
echo "   Valor: ${SUMUP_API_KEY:0:20}..."
vercel env add SUMUP_API_KEY production <<< "$SUMUP_API_KEY" || echo "   ⚠️  Pode já existir em production"
vercel env add SUMUP_API_KEY preview <<< "$SUMUP_API_KEY" || echo "   ⚠️  Pode já existir em preview"
vercel env add SUMUP_API_KEY development <<< "$SUMUP_API_KEY" || echo "   ⚠️  Pode já existir em development"

echo ""

# NEXT_PUBLIC_SITE_URL
echo "2️⃣  Adicionando NEXT_PUBLIC_SITE_URL..."
echo "   Valor: $SITE_URL"
vercel env add NEXT_PUBLIC_SITE_URL production <<< "$SITE_URL" || echo "   ⚠️  Pode já existir em production"
vercel env add NEXT_PUBLIC_SITE_URL preview <<< "$SITE_URL" || echo "   ⚠️  Pode já existir em preview"
vercel env add NEXT_PUBLIC_SITE_URL development <<< "$SITE_URL" || echo "   ⚠️  Pode já existir em development"

echo ""
echo "✅ Configuração concluída!"
echo ""
echo "📋 Próximos passos:"
echo "   1. Verificar no Vercel Dashboard"
echo "   2. Fazer deploy: vercel --prod"
echo "   3. Ou aguardar auto-deploy do Git"
echo ""

