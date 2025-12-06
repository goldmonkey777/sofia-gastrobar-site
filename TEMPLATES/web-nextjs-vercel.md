# 🌐 Goldmonkey Web Template - Next.js + Vercel
## Padrão Ultra-Pro para Projetos Web do Império

---

## 📋 Stack Oficial

- **Framework**: Next.js 15+ (App Router)
- **Styling**: Tailwind CSS 3+
- **Animations**: Framer Motion
- **Deployment**: Vercel
- **Package Manager**: npm (pode usar pnpm/yarn se preferir)
- **TypeScript**: Habilitado por padrão

---

## 🏗️ Estrutura de Pastas Goldmonkey

```
project-name/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page
│   ├── globals.css         # Global styles + Tailwind
│   ├── api/                # API routes
│   └── (routes)/           # Organized routes
│
├── components/
│   ├── ui/                 # Componentes base reutilizáveis
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   └── ...
│   │
│   ├── layout/             # Componentes de layout
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── Navigation.tsx
│   │   └── Container.tsx
│   │
│   └── modules/            # Features específicas (plugáveis)
│       └── (project-specific modules here)
│
├── lib/
│   ├── utils.ts            # Utility functions
│   ├── constants.ts        # Constants
│   └── types.ts            # TypeScript types
│
├── public/
│   ├── images/
│   ├── fonts/
│   └── favicon.ico
│
├── styles/
│   └── (optional CSS modules)
│
├── .env.example            # Environment variables template
├── .env.local              # Local env (gitignored)
├── .gitignore
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## ⚙️ Configurações Padrão

### 1. Next.js Config (`next.config.js`)

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // Otimizações
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
}

module.exports = nextConfig
```

### 2. Tailwind Config (`tailwind.config.ts`)

```typescript
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
        // Defina sua paleta aqui
      },
      fontFamily: {
        // Defina suas fontes aqui
      },
      animation: {
        // Animações customizadas
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
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
      },
    },
  },
  plugins: [],
}

export default config
```

### 3. TypeScript Config (`tsconfig.json`)

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"],
      "@/components/*": ["./components/*"],
      "@/lib/*": ["./lib/*"],
      "@/styles/*": ["./styles/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

---

## 📦 Dependências Padrão

### Dependencies
```json
{
  "next": "^15.0.0",
  "react": "^18.3.0",
  "react-dom": "^18.3.0",
  "framer-motion": "^11.0.0"
}
```

### DevDependencies
```json
{
  "typescript": "^5.3.0",
  "@types/node": "^20.10.0",
  "@types/react": "^18.2.0",
  "@types/react-dom": "^18.2.0",
  "tailwindcss": "^3.4.0",
  "postcss": "^8.4.0",
  "autoprefixer": "^10.4.0",
  "eslint": "^8.56.0",
  "eslint-config-next": "^15.0.0"
}
```

---

## 🎨 Componentes Base (UI Kit)

### Button Component (`components/ui/Button.tsx`)

```typescript
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
```

### Container Component (`components/layout/Container.tsx`)

```typescript
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
```

---

## 🔍 SEO Padrão

### Root Layout (`app/layout.tsx`)

```typescript
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Project Name',
    template: '%s | Project Name',
  },
  description: 'Project description',
  keywords: ['keyword1', 'keyword2'],
  authors: [{ name: 'Goldmonkey' }],
  creator: 'Goldmonkey',
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://yoursite.com',
    title: 'Project Name',
    description: 'Project description',
    siteName: 'Project Name',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Project Name',
    description: 'Project description',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}
```

---

## 🚀 Deployment (Vercel)

### 1. Conectar repositório ao Vercel
```bash
vercel
```

### 2. Configurar variáveis de ambiente no dashboard
- Ir para Project Settings → Environment Variables
- Adicionar todas as variáveis do `.env.example`

### 3. Deploy automático
- Push para `main` → deploy automático em produção
- Push para outras branches → preview deploy

### 4. Domínio customizado
- Project Settings → Domains
- Adicionar domínio
- Configurar DNS conforme instruções

---

## 📊 Analytics & Performance

### Vercel Analytics (recomendado)
```typescript
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

### Speed Insights
```typescript
import { SpeedInsights } from '@vercel/speed-insights/next'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <SpeedInsights />
      </body>
    </html>
  )
}
```

---

## 🔐 Environment Variables

### `.env.example`
```bash
# App
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Database (exemplo)
DATABASE_URL=

# API Keys (exemplo)
NEXT_PUBLIC_API_KEY=

# Analytics (exemplo)
NEXT_PUBLIC_GA_ID=
```

---

## 🎯 Best Practices Goldmonkey

### 1. Performance
- Use `next/image` para todas as imagens
- Use `next/font` para fontes otimizadas
- Implemente lazy loading com `dynamic()`
- Use Server Components sempre que possível

### 2. Acessibilidade
- Sempre adicione `alt` em imagens
- Use semantic HTML
- Teste com navegação por teclado
- Mantenha contraste adequado

### 3. SEO
- Defina metadata em cada página
- Use tags semânticas (`<header>`, `<main>`, `<footer>`)
- Implemente structured data quando relevante
- Otimize Core Web Vitals

### 4. Code Quality
- Use TypeScript strict mode
- Mantenha componentes pequenos e focados
- Siga o princípio DRY (Don't Repeat Yourself)
- Documente funções complexas

### 5. Git Flow
- `main` → produção (protegida)
- `develop` → staging
- Feature branches → `feature/nome-da-feature`
- Commits semânticos: `feat:`, `fix:`, `docs:`, `refactor:`

---

## 🔧 Scripts Úteis

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit"
  }
}
```

---

## 📚 Recursos Adicionais

- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Framer Motion Docs](https://www.framer.com/motion/)
- [Vercel Docs](https://vercel.com/docs)

---

## 🏆 Template Goldmonkey

Este template representa o padrão de excelência Goldmonkey para projetos web.

**Criado por**: Goldmonkey Empire
**Última atualização**: 2025-12-06
**Versão**: 1.0.0

---

**Para inicializar um projeto com este template, use:**
```bash
./scripts/init-next-web.sh nome-do-projeto
```
