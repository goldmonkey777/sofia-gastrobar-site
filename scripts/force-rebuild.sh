#!/bin/bash
# Script para forçar rebuild no Vercel sem cache

TIMESTAMP=$(date +%s)
echo "CACHE_BUST_${TIMESTAMP}" > .vercelignore
echo "# Este arquivo força o Vercel a fazer rebuild completo" >> .vercelignore
echo "# Se este arquivo mudar, o cache é invalidado" >> .vercelignore
echo "" >> .vercelignore

git add .vercelignore
git commit -m "fix: Force rebuild - cache buster ${TIMESTAMP}"
git push origin main

echo ""
echo "✅ Cache buster atualizado e commit enviado!"
echo "🔄 Vercel deve detectar a mudança em 1-2 minutos"
echo ""
echo "💡 Se não iniciar automaticamente:"
echo "   - Vá no Vercel Dashboard"
echo "   - Clique em 'Redeploy' no último deploy"
echo "   - DESMARQUE 'Use existing Build Cache'"
echo "   - Clique em 'Redeploy'"

