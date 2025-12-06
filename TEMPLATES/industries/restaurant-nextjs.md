# 🍽️ Goldmonkey Restaurant Template - Next.js Full-Stack
## Full Restaurant Starter - Next.js 15 + Vercel + Modules Layer

> **Template Industry-Specific para Restaurantes Modernos**
>
> Este template herda do `web-nextjs-vercel.md` base e adiciona features específicas para restaurantes digitais inteligentes do ecossistema Goldmonkey.

---

## 🎯 Objetivo

Transformar qualquer restaurante em uma **experiência digital fluida, mágica e escalável** com:
- Sistema de QR por mesa
- Menu digital interativo
- Mini-jogos para engajamento
- Modo DJ/Ambiente musical
- Integração com pagamentos
- Missões e gamificação

---

## 📋 Stack Completa

**Herda de `web-nextjs-vercel.md`:**
- Next.js 15+ (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion
- Vercel Deploy

**Adiciona para Restaurantes:**
- Lucide Icons (ícones modernos)
- QR Code Generator (`qrcode.react`)
- Canvas API (para mini-jogos)
- Local Storage (persistência de sessão)
- Geolocation API (detecção de mesa opcional)

---

## 🏗️ Estrutura de Pastas Restaurant-Specific

```
restaurant-name/
├── app/
│   ├── layout.tsx                  # Root layout
│   ├── page.tsx                    # Home/Hero
│   │
│   ├── cardapio/                   # Menu digital
│   │   ├── page.tsx
│   │   └── [categoria]/
│   │       └── page.tsx
│   │
│   ├── mesa/                       # QR Table System
│   │   └── [id]/
│   │       └── page.tsx            # Página dinâmica por mesa
│   │
│   ├── jogo/                       # Mini-game
│   │   └── page.tsx
│   │
│   ├── dj/                         # DJ Mode
│   │   └── page.tsx
│   │
│   ├── missoes/                    # Gamification
│   │   └── page.tsx
│   │
│   └── api/                        # API Routes
│       ├── mesa/
│       │   └── [id]/
│       │       └── route.ts        # Mesa status API
│       ├── pedidos/
│       │   └── route.ts
│       └── garcom/
│           └── route.ts            # Call waiter API
│
├── components/
│   ├── ui/                         # Base components (do template genérico)
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   └── Container.tsx
│   │
│   ├── layout/                     # Layout components
│   │   ├── Hero.tsx                # Hero section para restaurante
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   │
│   ├── menu/                       # Menu-specific components
│   │   ├── CategoryTabs.tsx
│   │   ├── DishCard.tsx
│   │   ├── MenuGrid.tsx
│   │   └── CategorySection.tsx
│   │
│   ├── mesa/                       # Table/QR components
│   │   ├── QRDisplay.tsx
│   │   ├── TableActions.tsx
│   │   ├── CallWaiterButton.tsx
│   │   └── TableStatus.tsx
│   │
│   ├── game/                       # Game components
│   │   ├── GameCanvas.tsx
│   │   ├── GameControls.tsx
│   │   └── ScoreBoard.tsx
│   │
│   └── dj/                         # DJ Mode components
│       ├── DJVisualizer.tsx
│       ├── MascotAnimation.tsx
│       └── EqualizerBars.tsx
│
├── modules/                        # Módulos plugáveis Goldmonkey
│   ├── qr-table-system/
│   │   ├── README.md
│   │   ├── types.ts
│   │   ├── hooks/
│   │   │   ├── useTableSession.ts
│   │   │   └── useCallWaiter.ts
│   │   └── utils/
│   │       └── tableHelpers.ts
│   │
│   ├── mini-game-engine/
│   │   ├── README.md
│   │   ├── types.ts
│   │   ├── engine/
│   │   │   ├── GameLoop.ts
│   │   │   └── Physics.ts
│   │   └── games/
│   │       └── island-adventure/
│   │
│   ├── dj-mode/
│   │   ├── README.md
│   │   ├── types.ts
│   │   └── audio/
│   │       └── visualizer.ts
│   │
│   └── sumup-integration/
│       ├── README.md
│       ├── types.ts
│       └── api/
│           └── checkout.ts
│
├── lib/
│   ├── utils.ts
│   ├── constants.ts
│   ├── menu-data.ts                # Menu structure
│   └── table-config.ts             # Table configuration
│
├── public/
│   ├── images/
│   │   ├── logo.png
│   │   ├── hero/
│   │   ├── dishes/
│   │   └── game/
│   ├── fonts/
│   └── qr/                         # Generated QR codes
│
└── data/
    ├── menu.json                   # Menu items database
    └── tables.json                 # Table configuration
```

---

## 🎨 Design System Restaurant

### Colors (Tailwind Config)

```typescript
// tailwind.config.ts extension for restaurants
theme: {
  extend: {
    colors: {
      // Restaurant-specific palette
      primary: '#FF6B35',      // Warm orange/coral
      secondary: '#004E89',    // Deep blue
      accent: '#F7B801',       // Golden yellow
      background: '#F8F9FA',   // Light neutral
      surface: '#FFFFFF',
      text: {
        primary: '#1A1A1A',
        secondary: '#6B7280',
      },
      // Semantic colors
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
      info: '#3B82F6',
    },
  },
}
```

### Typography

```typescript
fontFamily: {
  display: ['Playfair Display', 'serif'],  // Headers
  body: ['Inter', 'sans-serif'],           // Body text
  menu: ['Montserrat', 'sans-serif'],      // Menu items
},
```

---

## 🧩 Componentes Restaurant-Specific

### 1. Hero Component (`components/layout/Hero.tsx`)

```typescript
'use client'

import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import Image from 'next/image'
import Button from '@/components/ui/Button'

export default function Hero() {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero/restaurant.jpg"
          alt="Restaurant"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 text-center text-white px-4"
      >
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="font-display text-5xl md:text-7xl font-bold mb-6"
        >
          Bem-vindo ao
          <br />
          <span className="text-accent">Nome do Restaurante</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto"
        >
          Uma experiência gastronômica única
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="flex gap-4 justify-center"
        >
          <Button variant="primary" size="lg">
            Ver Cardápio
          </Button>
          <Button variant="outline" size="lg">
            Reservar Mesa
          </Button>
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <ChevronDown className="w-8 h-8 text-white" />
      </motion.div>
    </section>
  )
}
```

### 2. DishCard Component (`components/menu/DishCard.tsx`)

```typescript
'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Euro } from 'lucide-react'

interface DishCardProps {
  name: string
  description: string
  price: number
  image: string
  category: string
  allergens?: string[]
}

export default function DishCard({
  name,
  description,
  price,
  image,
  category,
  allergens,
}: DishCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-surface rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
    >
      {/* Image */}
      <div className="relative h-48 w-full">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover"
        />
        <div className="absolute top-4 right-4 bg-accent text-white px-3 py-1 rounded-full text-sm font-semibold">
          {category}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="font-menu text-xl font-bold mb-2 text-text-primary">
          {name}
        </h3>
        <p className="text-text-secondary text-sm mb-4 line-clamp-2">
          {description}
        </p>

        {/* Allergens */}
        {allergens && allergens.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {allergens.map((allergen) => (
              <span
                key={allergen}
                className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
              >
                {allergen}
              </span>
            ))}
          </div>
        )}

        {/* Price */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-primary font-bold text-2xl">
            <Euro className="w-5 h-5" />
            <span>{price.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
```

### 3. CallWaiterButton (`components/mesa/CallWaiterButton.tsx`)

```typescript
'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, CheckCircle, XCircle } from 'lucide-react'
import Button from '@/components/ui/Button'

interface CallWaiterButtonProps {
  tableId: string
}

export default function CallWaiterButton({ tableId }: CallWaiterButtonProps) {
  const [status, setStatus] = useState<'idle' | 'calling' | 'success' | 'error'>('idle')

  const handleCall = async () => {
    setStatus('calling')

    try {
      const response = await fetch('/api/garcom', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tableId, action: 'call' }),
      })

      if (response.ok) {
        setStatus('success')
        setTimeout(() => setStatus('idle'), 3000)
      } else {
        setStatus('error')
        setTimeout(() => setStatus('idle'), 3000)
      }
    } catch (error) {
      setStatus('error')
      setTimeout(() => setStatus('idle'), 3000)
    }
  }

  return (
    <div className="relative">
      <Button
        onClick={handleCall}
        disabled={status === 'calling'}
        variant={status === 'success' ? 'secondary' : 'primary'}
        className="w-full"
      >
        <AnimatePresence mode="wait">
          {status === 'idle' && (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2"
            >
              <Bell className="w-5 h-5" />
              <span>Chamar Garçom</span>
            </motion.div>
          )}
          {status === 'calling' && (
            <motion.div
              key="calling"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              Chamando...
            </motion.div>
          )}
          {status === 'success' && (
            <motion.div
              key="success"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2"
            >
              <CheckCircle className="w-5 h-5" />
              <span>Chamado enviado!</span>
            </motion.div>
          )}
          {status === 'error' && (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2"
            >
              <XCircle className="w-5 h-5" />
              <span>Erro. Tente novamente</span>
            </motion.div>
          )}
        </AnimatePresence>
      </Button>
    </div>
  )
}
```

---

## 📦 Módulos Plugáveis (Goldmonkey Layer 2.5)

### 1. QR Table System

**Localização**: `modules/qr-table-system/`

**Features**:
- Geração de QR codes únicos por mesa
- Página dinâmica `/mesa/[id]`
- Detecção automática de mesa via URL
- Botões de ação (Chamar garçom, Pedir conta, Cancelar)
- Estado persistente com localStorage
- Notificações em tempo real (opcional com websockets)

**Uso**:
```typescript
import { useTableSession } from '@/modules/qr-table-system/hooks/useTableSession'

const { tableId, isActive, actions } = useTableSession()
```

---

### 2. Mini-Game Engine

**Localização**: `modules/mini-game-engine/`

**Features**:
- Engine 2D baseado em Canvas
- Sistema de física simples
- Detecção de colisões
- Score system
- Persistência de progresso
- Leaderboard (opcional)

**Estrutura de Jogo**:
```typescript
interface GameState {
  player: {
    x: number
    y: number
    score: number
    lives: number
  }
  obstacles: Obstacle[]
  collectibles: Collectible[]
  isRunning: boolean
  isPaused: boolean
}
```

**Exemplo de Jogo**: "A Ilha Mágica de Sofia"
- Mascote Sofia navegando pela ilha
- Coletar ingredientes
- Evitar obstáculos
- Pontuação baseada em tempo e coleta

---

### 3. DJ Mode

**Localização**: `modules/dj-mode/`

**Features**:
- Visualizador de áudio animado
- Animação do mascote sincronizada
- Equalizer bars com Framer Motion
- Playlist controlada
- Modo fullscreen
- Efeitos visuais imersivos

**Componente Principal**:
```typescript
interface DJModeProps {
  mascotImage: string
  audioSource?: string
  visualizerType: 'bars' | 'wave' | 'circular'
}
```

---

### 4. SumUp Integration

**Localização**: `modules/sumup-integration/`

**Features**:
- Checkout via API SumUp
- Cálculo automático de conta por mesa
- Split payment (divisão de conta)
- Confirmação de pagamento
- Redirect pós-pagamento

**API Route**:
```typescript
// app/api/checkout/route.ts
export async function POST(request: Request) {
  const { tableId, amount, items } = await request.json()

  // Integration with SumUp API
  const checkoutUrl = await createSumUpCheckout({
    amount,
    description: `Mesa ${tableId} - Restaurante`,
    returnUrl: `${process.env.NEXT_PUBLIC_APP_URL}/mesa/${tableId}?payment=success`,
  })

  return Response.json({ checkoutUrl })
}
```

---

## 🎯 Fluxo do Cliente (User Journey)

```
1. Cliente chega ao restaurante
   ↓
2. Escaneia QR da mesa
   ↓
3. Abre página /mesa/[id]
   ↓
4. Vê menu digital animado
   ↓
5. Pode:
   • Ver cardápio completo
   • Chamar garçom
   • Pedir conta
   • Jogar mini-game
   • Entrar no modo DJ
   ↓
6. Realiza pedido com garçom
   ↓
7. Enquanto espera: joga ou explora
   ↓
8. Paga via SumUp integrado
   ↓
9. Deixa avaliação/feedback
   ↓
10. Participa de missões gamificadas
```

---

## 🔐 Environment Variables

```bash
# Restaurant Info
NEXT_PUBLIC_RESTAURANT_NAME="Nome do Restaurante"
NEXT_PUBLIC_RESTAURANT_PHONE="+XX XXX XXX XXX"
NEXT_PUBLIC_RESTAURANT_EMAIL="contato@restaurante.com"
NEXT_PUBLIC_RESTAURANT_ADDRESS="Endereço completo"

# Social Media
NEXT_PUBLIC_INSTAGRAM="@username"
NEXT_PUBLIC_FACEBOOK="username"

# Payment Integration
NEXT_PUBLIC_SUMUP_API_KEY=""
SUMUP_SECRET_KEY=""

# Features Flags
NEXT_PUBLIC_ENABLE_MINI_GAME=true
NEXT_PUBLIC_ENABLE_DJ_MODE=true
NEXT_PUBLIC_ENABLE_QR_TABLES=true

# Analytics
NEXT_PUBLIC_GA_ID=""
```

---

## 📊 Data Structures

### Menu Data (`data/menu.json`)

```json
{
  "categories": [
    {
      "id": "tapas",
      "name": "Tapas",
      "icon": "utensils",
      "dishes": [
        {
          "id": "001",
          "name": "Patatas Bravas",
          "description": "Batatas rústicas com molho picante",
          "price": 6.50,
          "image": "/images/dishes/patatas-bravas.jpg",
          "allergens": ["glúten"],
          "vegetarian": true,
          "spicy": true
        }
      ]
    }
  ]
}
```

### Table Config (`data/tables.json`)

```json
{
  "tables": [
    {
      "id": "01",
      "number": 1,
      "capacity": 4,
      "qrCode": "/qr/mesa-01.png",
      "location": "Sala principal"
    }
  ]
}
```

---

## 🚀 Scripts de Deploy

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "generate-qr": "node scripts/generate-qr-codes.js"
  }
}
```

---

## 🎨 Animações Padrão Restaurant

```typescript
// Framer Motion variants
export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
}

export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

export const scaleIn = {
  initial: { scale: 0.9, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  exit: { scale: 0.9, opacity: 0 },
}
```

---

## 📱 Mobile-First Considerations

- Touch-friendly buttons (min 44x44px)
- Swipeable menu categories
- Bottom navigation for key actions
- Pull-to-refresh for menu updates
- Offline-first with service workers
- PWA installable

---

## 🏆 Best Practices Restaurant-Specific

### 1. Performance
- Optimize food images (WebP format)
- Lazy load menu sections
- Prefetch critical routes
- Cache menu data locally

### 2. UX
- Clear call-to-actions
- Visual feedback on all interactions
- Error states bem definidos
- Loading states suaves

### 3. Accessibility
- Alt text em todas as imagens de pratos
- ARIA labels em botões de ação
- Contraste adequado
- Suporte a navegação por teclado

### 4. SEO
- Schema.org Restaurant markup
- Meta tags dinâmicas por página
- Sitemap com todas as categorias
- Open Graph images para shares

---

## 🧪 Testing Checklist

- [ ] QR codes funcionam em todos os devices
- [ ] Menu carrega rápido (<2s)
- [ ] Call waiter funciona offline (queue)
- [ ] Pagamento redireciona corretamente
- [ ] Mini-game não trava em mobile
- [ ] DJ Mode funciona em Safari iOS
- [ ] Todas as imagens têm fallbacks
- [ ] Dark mode (opcional)

---

## 🔄 Deployment Flow

1. **Development**: `npm run dev`
2. **QR Generation**: `npm run generate-qr`
3. **Build**: `npm run build`
4. **Deploy**: Push to `main` → Auto-deploy Vercel
5. **Monitor**: Vercel Analytics + Speed Insights

---

## 📚 Recursos Restaurant-Specific

- [Schema.org Restaurant](https://schema.org/Restaurant)
- [QR Code Best Practices](https://www.qr-code-generator.com/qr-code-marketing/qr-codes-basics/)
- [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
- [Canvas API Games](https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection)

---

## 🏛️ Filosofia do Template

> **Este template não é um site — é uma plataforma restaurativa digital.**

Um portal para transformar qualquer restaurante numa experiência fluida, mágica e inteligente.

- **Feito para escalar** → Reutilizável para múltiplos restaurantes
- **Feito para divertir** → Gamificação e interatividade
- **Feito para funcionar** → Testado na vida real

---

## 🎯 Próximos Passos Após Instalação

1. **Personalizar dados**: Editar `data/menu.json` e `data/tables.json`
2. **Upload de imagens**: Adicionar fotos em `/public/images/dishes/`
3. **Gerar QR Codes**: Rodar `npm run generate-qr`
4. **Configurar Env Vars**: Copiar `.env.example` → `.env.local`
5. **Deploy**: Conectar no Vercel
6. **Testar**: Escanear QR e testar todas as features
7. **Monitorar**: Acompanhar analytics e feedback

---

**Criado por**: Goldmonkey Empire
**Versão**: 1.0.0
**Última atualização**: 2025-12-06

**Template Restaurant Starter - Layer 2.5 (Industry-Specific)**

---

**Para inicializar um restaurante com este template:**
```bash
./scripts/init-next-web.sh nome-restaurante --industry restaurant
```
