#!/bin/bash

# 🌐 Goldmonkey Web Initializer v2.0
# Inicializa projetos Next.js + Vercel com padrão Ultra-Pro
# Suporta templates industry-specific
# Uso: ./scripts/init-next-web.sh nome-do-projeto [--industry restaurant]

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Emojis
ROCKET="🚀"
CHECK="✅"
FOLDER="📁"
PACKAGE="📦"
CONFIG="⚙️"
PAINT="🎨"
LOCK="🔐"
FIRE="🔥"
RESTAURANT="🍽️"

# Parse arguments
PROJECT_NAME=$1
INDUSTRY=""

# Check for --industry flag
if [ "$2" == "--industry" ] && [ -n "$3" ]; then
    INDUSTRY=$3
fi

# Banner
echo -e "${PURPLE}"
echo "╔════════════════════════════════════════╗"
echo "║   GOLDMONKEY WEB INITIALIZER v2.0     ║"
echo "║   Next.js 15 + Vercel Ultra-Pro       ║"
echo "╚════════════════════════════════════════╝"
echo -e "${NC}"

# Verificar se nome do projeto foi fornecido
if [ -z "$PROJECT_NAME" ]; then
    echo -e "${RED}❌ Erro: Nome do projeto não fornecido${NC}"
    echo -e "${YELLOW}Uso: ./scripts/init-next-web.sh nome-do-projeto [--industry restaurant]${NC}"
    exit 1
fi

PROJECT_DIR="$HOME/Projects/$PROJECT_NAME"

# Display industry template info
if [ -n "$INDUSTRY" ]; then
    echo -e "${CYAN}${RESTAURANT} Template: ${YELLOW}$INDUSTRY${NC}"
fi

echo -e "${CYAN}${ROCKET} Iniciando criação do projeto: ${YELLOW}$PROJECT_NAME${NC}\n"

# 1. Criar diretório do projeto
echo -e "${BLUE}${FOLDER} Criando estrutura de diretórios...${NC}"
if [ -d "$PROJECT_DIR" ]; then
    echo -e "${RED}❌ Erro: Diretório $PROJECT_DIR já existe${NC}"
    exit 1
fi
mkdir -p "$PROJECT_DIR"
cd "$PROJECT_DIR"
echo -e "${GREEN}${CHECK} Diretório criado: $PROJECT_DIR${NC}\n"

# 2. Inicializar Git
echo -e "${BLUE}${FOLDER} Inicializando Git...${NC}"
git init
echo -e "${GREEN}${CHECK} Git inicializado${NC}\n"

# 3. Criar Next.js app
echo -e "${BLUE}${PACKAGE} Criando aplicação Next.js...${NC}"
npx create-next-app@latest . --typescript --tailwind --app --src-dir=false --import-alias="@/*" --no-git
echo -e "${GREEN}${CHECK} Next.js instalado${NC}\n"

# 4. Instalar dependências adicionais
echo -e "${BLUE}${PACKAGE} Instalando dependências Goldmonkey...${NC}"
npm install framer-motion

# Industry-specific dependencies
if [ "$INDUSTRY" == "restaurant" ]; then
    echo -e "${CYAN}${RESTAURANT} Instalando dependências de restaurante...${NC}"
    npm install lucide-react qrcode.react
fi

npm install -D @vercel/analytics @vercel/speed-insights
echo -e "${GREEN}${CHECK} Dependências instaladas${NC}\n"

# 5. Criar estrutura de pastas base
echo -e "${BLUE}${FOLDER} Criando estrutura de pastas Goldmonkey...${NC}"
mkdir -p components/ui
mkdir -p components/layout
mkdir -p lib
mkdir -p public/images
mkdir -p public/fonts
mkdir -p styles

# Industry-specific structure
if [ "$INDUSTRY" == "restaurant" ]; then
    echo -e "${CYAN}${RESTAURANT} Criando estrutura de restaurante...${NC}"
    mkdir -p components/menu
    mkdir -p components/mesa
    mkdir -p components/game
    mkdir -p components/dj
    mkdir -p modules/qr-table-system
    mkdir -p modules/mini-game-engine
    mkdir -p modules/dj-mode
    mkdir -p modules/sumup-integration
    mkdir -p data
    mkdir -p public/images/dishes
    mkdir -p public/images/hero
    mkdir -p public/qr
    mkdir -p app/cardapio
    mkdir -p app/mesa
    mkdir -p app/jogo
    mkdir -p app/dj
fi

echo -e "${GREEN}${CHECK} Estrutura criada${NC}\n"

# 6. Criar arquivos base
echo -e "${BLUE}${PAINT} Criando componentes base...${NC}"

# Button Component
cat > components/ui/Button.tsx << 'EOF'
'use client'

import { ButtonHTMLAttributes, ReactNode } from 'react'
import { motion } from 'framer-motion'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}: ButtonProps) {
  const baseStyles = 'font-semibold rounded-lg transition-all duration-200'

  const variants = {
    primary: 'bg-black text-white hover:bg-gray-800',
    secondary: 'bg-gray-200 text-black hover:bg-gray-300',
    outline: 'border-2 border-black text-black hover:bg-black hover:text-white',
  }

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  }

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  )
}
EOF

# Container Component
cat > components/layout/Container.tsx << 'EOF'
import { ReactNode } from 'react'

interface ContainerProps {
  children: ReactNode
  className?: string
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
}

export default function Container({
  children,
  className = '',
  maxWidth = 'xl',
}: ContainerProps) {
  const maxWidths = {
    sm: 'max-w-screen-sm',
    md: 'max-w-screen-md',
    lg: 'max-w-screen-lg',
    xl: 'max-w-screen-xl',
    '2xl': 'max-w-screen-2xl',
    full: 'max-w-full',
  }

  return (
    <div className={`mx-auto px-4 sm:px-6 lg:px-8 ${maxWidths[maxWidth]} ${className}`}>
      {children}
    </div>
  )
}
EOF

# Utils
cat > lib/utils.ts << 'EOF'
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
EOF

echo -e "${GREEN}${CHECK} Componentes base criados${NC}\n"

# Restaurant-specific components
if [ "$INDUSTRY" == "restaurant" ]; then
    echo -e "${CYAN}${RESTAURANT} Criando componentes de restaurante...${NC}"

    # Menu data structure
    cat > data/menu.json << 'EOF'
{
  "categories": [
    {
      "id": "tapas",
      "name": "Tapas",
      "icon": "utensils",
      "dishes": []
    },
    {
      "id": "principais",
      "name": "Pratos Principais",
      "icon": "chef-hat",
      "dishes": []
    },
    {
      "id": "sobremesas",
      "name": "Sobremesas",
      "icon": "cake",
      "dishes": []
    },
    {
      "id": "bebidas",
      "name": "Bebidas",
      "icon": "glass-water",
      "dishes": []
    }
  ]
}
EOF

    # Tables configuration
    cat > data/tables.json << 'EOF'
{
  "tables": [
    {
      "id": "01",
      "number": 1,
      "capacity": 4,
      "location": "Sala principal"
    }
  ]
}
EOF

    echo -e "${GREEN}${CHECK} Estrutura de dados criada${NC}\n"
fi

# 7. Criar .env.example
echo -e "${BLUE}${LOCK} Criando template de variáveis de ambiente...${NC}"

if [ "$INDUSTRY" == "restaurant" ]; then
    cat > .env.example << 'EOF'
# App
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Restaurant Info
NEXT_PUBLIC_RESTAURANT_NAME="Nome do Restaurante"
NEXT_PUBLIC_RESTAURANT_PHONE=""
NEXT_PUBLIC_RESTAURANT_EMAIL=""
NEXT_PUBLIC_RESTAURANT_ADDRESS=""

# Social Media
NEXT_PUBLIC_INSTAGRAM=""
NEXT_PUBLIC_FACEBOOK=""

# Payment Integration
NEXT_PUBLIC_SUMUP_API_KEY=""
SUMUP_SECRET_KEY=""

# Features Flags
NEXT_PUBLIC_ENABLE_MINI_GAME=true
NEXT_PUBLIC_ENABLE_DJ_MODE=true
NEXT_PUBLIC_ENABLE_QR_TABLES=true

# Analytics
NEXT_PUBLIC_GA_ID=""
EOF
else
    cat > .env.example << 'EOF'
# App
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Database (exemplo)
DATABASE_URL=

# API Keys (exemplo)
NEXT_PUBLIC_API_KEY=

# Analytics (exemplo)
NEXT_PUBLIC_GA_ID=
EOF
fi

cp .env.example .env.local
echo -e "${GREEN}${CHECK} Arquivos .env criados${NC}\n"

# 8. Atualizar .gitignore
echo -e "${BLUE}${CONFIG} Atualizando .gitignore...${NC}"
cat >> .gitignore << 'EOF'

# Environment variables
.env.local
.env*.local

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db
EOF
echo -e "${GREEN}${CHECK} .gitignore atualizado${NC}\n"

# 9. Atualizar Tailwind config
echo -e "${BLUE}${PAINT} Configurando Tailwind com animações Goldmonkey...${NC}"

if [ "$INDUSTRY" == "restaurant" ]; then
    cat > tailwind.config.ts << 'EOF'
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FF6B35',
        secondary: '#004E89',
        accent: '#F7B801',
        background: '#F8F9FA',
        surface: '#FFFFFF',
        text: {
          primary: '#1A1A1A',
          secondary: '#6B7280',
        },
      },
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        body: ['Inter', 'sans-serif'],
        menu: ['Montserrat', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}

export default config
EOF
else
    cat > tailwind.config.ts << 'EOF'
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}

export default config
EOF
fi

echo -e "${GREEN}${CHECK} Tailwind configurado${NC}\n"

# 10. Criar README
echo -e "${BLUE}${FOLDER} Criando README...${NC}"

if [ "$INDUSTRY" == "restaurant" ]; then
    cat > README.md << EOF
# $PROJECT_NAME

Projeto criado com o **Goldmonkey Restaurant Template** - Full-Stack Restaurant Starter.

## Stack

- Next.js 15+
- TypeScript
- Tailwind CSS
- Framer Motion
- Lucide Icons
- Vercel

## Features

- 🍽️ Menu digital interativo
- 📱 Sistema QR por mesa
- 🎮 Mini-jogo integrado
- 🎵 Modo DJ
- 💳 Integração com pagamentos
- 🎯 Sistema de missões

## Começando

\`\`\`bash
# Desenvolvimento
npm run dev

# Build
npm run build

# Produção
npm start
\`\`\`

Abra [http://localhost:3000](http://localhost:3000) no navegador.

## Estrutura

\`\`\`
/app          → Rotas (home, cardapio, mesa, jogo, dj)
/components   → Componentes reutilizáveis
/modules      → Módulos plugáveis Goldmonkey
/data         → Menu e configurações
/public       → Assets estáticos
\`\`\`

## Módulos

- **QR Table System**: Sistema de mesa com QR
- **Mini-Game Engine**: Engine de jogos 2D
- **DJ Mode**: Modo DJ com visualizador
- **SumUp Integration**: Integração de pagamento

## Deploy

\`\`\`bash
vercel
\`\`\`

---

Criado com 💛 por **Goldmonkey Empire**
Template: Restaurant Full-Stack v1.0
EOF
else
    cat > README.md << EOF
# $PROJECT_NAME

Projeto criado com o **Goldmonkey Web Template** - Padrão Ultra-Pro.

## Stack

- Next.js 15+
- TypeScript
- Tailwind CSS
- Framer Motion
- Vercel

## Começando

\`\`\`bash
# Desenvolvimento
npm run dev

# Build
npm run build

# Produção
npm start
\`\`\`

Abra [http://localhost:3000](http://localhost:3000) no navegador.

## Estrutura

\`\`\`
/app          → Rotas e páginas
/components   → Componentes reutilizáveis
  /ui         → Componentes base (Button, Card, etc)
  /layout     → Componentes de layout (Header, Footer, etc)
/lib          → Utilities e helpers
/public       → Assets estáticos
\`\`\`

## Deploy

\`\`\`bash
vercel
\`\`\`

---

Criado com 💛 por **Goldmonkey Empire**
EOF
fi

echo -e "${GREEN}${CHECK} README criado${NC}\n"

# 11. Criar primeiro commit
echo -e "${BLUE}${FOLDER} Criando commit inicial...${NC}"
git add .

if [ "$INDUSTRY" == "restaurant" ]; then
    git commit -m "feat: Initialize Goldmonkey Restaurant Project

✨ Features:
- Next.js 15 + App Router
- TypeScript + Tailwind CSS
- Framer Motion animations
- Restaurant-specific structure
- QR Table System setup
- Mini-Game Engine setup
- DJ Mode setup
- Menu data structure
- Base UI components

🏗️ Structure:
- /components/menu - Menu components
- /components/mesa - Table components
- /modules - Pluggable Goldmonkey modules
- /data - Menu and tables configuration

🚀 Generated with Goldmonkey Restaurant Template v1.0"
else
    git commit -m "feat: Initialize Goldmonkey Web Project

✨ Features:
- Next.js 15 + App Router
- TypeScript + Tailwind CSS
- Framer Motion animations
- Goldmonkey component structure
- Base UI components (Button, Container)
- Environment variables setup
- Vercel deployment ready

🏗️ Structure:
- /components/ui - Base components
- /components/layout - Layout components
- /lib - Utilities
- Tailwind config with custom animations

🚀 Generated with Goldmonkey Web Template v2.0"
fi

echo -e "${GREEN}${CHECK} Commit inicial criado${NC}\n"

# 12. Finalização
echo -e "${GREEN}"
echo "╔════════════════════════════════════════╗"
echo "║   ${FIRE} PROJETO CRIADO COM SUCESSO! ${FIRE}   ║"
echo "╚════════════════════════════════════════╝"
echo -e "${NC}"

echo -e "${CYAN}📍 Localização: ${YELLOW}$PROJECT_DIR${NC}"
echo -e "${CYAN}🌐 Projeto: ${YELLOW}$PROJECT_NAME${NC}"

if [ -n "$INDUSTRY" ]; then
    echo -e "${CYAN}${RESTAURANT} Template: ${YELLOW}$INDUSTRY${NC}"
fi

echo ""

echo -e "${PURPLE}Próximos passos:${NC}"
echo -e "${YELLOW}1.${NC} cd $PROJECT_DIR"
echo -e "${YELLOW}2.${NC} npm run dev"
echo -e "${YELLOW}3.${NC} Abra http://localhost:3000"

if [ "$INDUSTRY" == "restaurant" ]; then
    echo -e "${YELLOW}4.${NC} Configure data/menu.json com seu cardápio"
    echo -e "${YELLOW}5.${NC} Configure data/tables.json com suas mesas"
    echo -e "${YELLOW}6.${NC} Adicione imagens em public/images/dishes/"
fi

echo -e "${YELLOW}7.${NC} Comece a criar! 🎨\n"

echo -e "${BLUE}Deploy (opcional):${NC}"
echo -e "${YELLOW}•${NC} vercel (primeiro deploy + link repo)"
echo -e "${YELLOW}•${NC} Configurar domínio no dashboard Vercel"
echo -e "${YELLOW}•${NC} Adicionar env vars no Vercel\n"

if [ "$INDUSTRY" == "restaurant" ]; then
    echo -e "${CYAN}${RESTAURANT} Documentação: TEMPLATES/industries/restaurant-nextjs.md${NC}\n"
else
    echo -e "${CYAN}📚 Documentação: TEMPLATES/web-nextjs-vercel.md${NC}\n"
fi

echo -e "${GREEN}${FIRE} Goldmonkey Empire - Build Like a Pro ${FIRE}${NC}\n"

# Opcional: abrir no Cursor
read -p "Abrir projeto no Cursor? (y/N) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    cd "$PROJECT_DIR"
    cursor .
fi
