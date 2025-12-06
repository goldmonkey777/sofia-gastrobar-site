# 🌟 Sofia Gastrobar - Layer 3: Project-Specific Instructions

> **Documentação exclusiva para o projeto Sofia Gastrobar**
>
> Este arquivo complementa os templates Layer 1 (Universal) e Layer 2.5 (Restaurant) com instruções específicas do Sofia.

---

## 🎯 Visão do Projeto

**Sofia Gastrobar** é o **primeiro restaurante digital do Império Goldmonkey**.

Não é apenas um site — é uma **experiência gastronômica digital completa** que combina:
- Menu interativo e visual
- Sistema QR por mesa
- Mini-jogo "A Ilha Mágica de Sofia" (mascote Sofia)
- Modo DJ com música ambiente
- Integração com SumUp e Last App
- Gamificação com missões

---

## 📍 Contexto

### Localização
- **Nome**: Sofia Gastrobar
- **Tipo**: Tapas Bar & Restaurant
- **Localização**: Ibiza, Espanha
- **Conceito**: Gastronomia espanhola moderna com experiência digital

### Mascote
- **Nome**: Sofia (a tartaruga)
- **Personalidade**: Amigável, aventureira, simpática
- **Papel**: Guia digital do restaurante
- **Aparições**: Mini-jogo, modo DJ, onboarding

---

## 🏗️ Arquitetura do Projeto

### Stack Base
- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion
- Lucide Icons
- Vercel (deploy)

### Templates Herdados
1. **Layer 1**: `~/.claude/CLAUDE.md` (Princípios universais)
2. **Layer 2**: `TEMPLATES/web-nextjs-vercel.md` (Base Next.js)
3. **Layer 2.5**: `TEMPLATES/industries/restaurant-nextjs.md` (Restaurant features)
4. **Layer 3**: Este arquivo (Sofia-specific)

---

## 🎨 Identidade Visual Sofia

### Paleta de Cores

```typescript
colors: {
  // Primary - Coral/Laranja vibrante (energia mediterrânea)
  primary: '#FF6B35',

  // Secondary - Azul profundo (mar de Ibiza)
  secondary: '#004E89',

  // Accent - Dourado/Amarelo (pôr do sol de Ibiza)
  accent: '#F7B801',

  // Background - Neutro claro
  background: '#F8F9FA',
  surface: '#FFFFFF',

  // Text
  text: {
    primary: '#1A1A1A',
    secondary: '#6B7280',
  },

  // Sofia (mascote)
  sofia: {
    shell: '#4ECDC4',      // Verde-água (casco da tartaruga)
    body: '#95E1D3',       // Verde claro
    accent: '#F38181',     // Coral suave
  }
}
```

### Tipografia

```typescript
fontFamily: {
  display: ['Playfair Display', 'serif'],  // Títulos e hero
  body: ['Inter', 'sans-serif'],           // Corpo de texto
  menu: ['Montserrat', 'sans-serif'],      // Itens do cardápio
}
```

### Logo
- **Localização**: `/public/images/logo-sofia.png`
- **Formato**: PNG transparente
- **Tamanhos**: Logo principal (400x400), Favicon (64x64)

---

## 📱 Estrutura de Rotas

```
/                          → Home (Hero + CTA)
/cardapio                  → Menu completo com tabs
  /cardapio/tapas          → Categoria Tapas
  /cardapio/hamburguesas   → Categoria Hamburguesas
  /cardapio/principais     → Pratos principais
  /cardapio/sobremesas     → Sobremesas
  /cardapio/bebidas        → Bebidas

/mesa/[id]                 → Página QR dinâmica por mesa
  /mesa/01                 → Mesa 01
  /mesa/02                 → Mesa 02
  ...

/jogo                      → Mini-jogo "A Ilha Mágica de Sofia"
/dj                        → Modo DJ (música + visualizador)
/missoes                   → Sistema de missões e rewards
/sobre                     → História do Sofia Gastrobar
```

---

## 🍽️ Cardápio Sofia (data/menu.json)

### Categorias

1. **Tapas Tradicionais**
   - Patatas Bravas
   - Croquetas de Jamón
   - Pimientos de Padrón
   - Tortilla Española
   - Gambas al Ajillo

2. **Hamburguesas Gourmet**
   - Sofia Burger (signature)
   - Ibiza Sunset Burger
   - Mediterranean Veggie
   - Spicy Chorizo Burger

3. **Pratos Principais**
   - Paella Valenciana
   - Arroz Negro
   - Pulpo a la Gallega
   - Secreto Ibérico

4. **Sobremesas**
   - Crema Catalana
   - Tarta de Santiago
   - Flan Caseiro
   - Churros com Chocolate

5. **Bebidas**
   - Vinhos espanhóis
   - Sangria (branca e tinta)
   - Cervezas artesanais
   - Cocktails signature

---

## 🎮 Mini-Jogo: "A Ilha Mágica de Sofia"

### Conceito
- **Gênero**: Adventure 2D (estilo endless runner simplificado)
- **Personagem**: Sofia (a tartaruga)
- **Objetivo**: Coletar ingredientes pela ilha de Ibiza
- **Mecânica**:
  - Movimento horizontal (toques ou teclado)
  - Pular obstáculos
  - Coletar itens (tomates, pimentões, peixes)
  - Evitar caranguejos e rochas

### Sistema de Pontuação
- **Ingredientes coletados**: +10 pontos cada
- **Tempo sobrevivido**: +1 ponto/segundo
- **Combo**: Coletar 3 seguidos = +50 bonus
- **High Score**: Persistido em localStorage

### Rewards
- **100 pontos**: Cupom 5% de desconto
- **500 pontos**: Sobremesa grátis
- **1000 pontos**: Entrada grátis na próxima visita

### Tecnologia
- Canvas API (HTML5)
- Sprite sheets para Sofia
- Physics simples (gravity + collision)
- Sound effects (opcional)

---

## 🎵 Modo DJ

### Features
- **Visualizador de áudio** (bars equalizer)
- **Animação da Sofia** (dançando ao ritmo)
- **Controles**:
  - Play/Pause
  - Próxima música
  - Volume
- **Playlist**: Músicas ambiente mediterrâneas
- **Efeitos visuais**: Gradientes animados, partículas

### Implementação
```typescript
// Usar Web Audio API
const audioContext = new AudioContext()
const analyser = audioContext.createAnalyser()
analyser.fftSize = 256

// Framer Motion para visualizador
<motion.div
  animate={{ scaleY: amplitude }}
  transition={{ duration: 0.1 }}
/>
```

---

## 📋 Sistema QR por Mesa

### Configuração de Mesas (data/tables.json)

```json
{
  "tables": [
    {
      "id": "01",
      "number": 1,
      "capacity": 4,
      "location": "Sala principal",
      "qrCode": "/qr/mesa-01.png"
    },
    {
      "id": "02",
      "number": 2,
      "capacity": 2,
      "location": "Terraço",
      "qrCode": "/qr/mesa-02.png"
    }
    // ... até mesa 20
  ]
}
```

### Funcionalidades por Mesa

#### `/mesa/[id]` deve ter:

1. **Identificação visual**
   - Número da mesa grande
   - Localização
   - Capacidade

2. **Ações rápidas**
   ```typescript
   <CallWaiterButton tableId={id} />
   <RequestBillButton tableId={id} />
   <CancelRequestButton tableId={id} />
   ```

3. **Navegação**
   - Ver cardápio completo
   - Jogar mini-jogo
   - Entrar no modo DJ
   - Ver missões ativas

4. **Status da mesa**
   - Última chamada do garçom
   - Pedidos em aberto (se integrado)
   - Tempo na mesa

---

## 🎯 Sistema de Missões

### Tipos de Missões

#### Missões Diárias
- "Experimente 3 Tapas diferentes" → Cupom 10%
- "Jogue o mini-jogo e atinja 200 pontos" → Bebida grátis
- "Compartilhe nas redes sociais" → Entrada grátis

#### Missões Semanais
- "Visite 3 vezes na semana" → Prato principal grátis
- "Traga um amigo" → Sobremesa grátis para ambos

#### Conquistas
- "Primeira visita" → Badge Sofia Explorer
- "10 visitas" → Badge Sofia Regular
- "High Score 1000+" → Badge Sofia Champion

### Implementação
```typescript
interface Mission {
  id: string
  title: string
  description: string
  reward: string
  progress: number
  goal: number
  type: 'daily' | 'weekly' | 'achievement'
  icon: string
}
```

---

## 💳 Integrações

### SumUp (Pagamentos)
```typescript
// Checkout URL generation
const checkoutUrl = await createSumUpCheckout({
  amount: total,
  currency: 'EUR',
  description: `Mesa ${tableId} - Sofia Gastrobar`,
  merchant_code: process.env.SUMUP_MERCHANT_CODE,
  return_url: `${baseUrl}/mesa/${tableId}?payment=success`,
})
```

### Last App (TPV Integration)
- Sincronização de pedidos
- Status de preparação
- Notificações ao cliente

---

## 🔧 Environment Variables

```bash
# Restaurant Info
NEXT_PUBLIC_RESTAURANT_NAME="Sofia Gastrobar"
NEXT_PUBLIC_RESTAURANT_PHONE="+34 XXX XXX XXX"
NEXT_PUBLIC_RESTAURANT_EMAIL="info@sofiagastrobar.com"
NEXT_PUBLIC_RESTAURANT_ADDRESS="Calle X, Ibiza, España"

# Social Media
NEXT_PUBLIC_INSTAGRAM="@sofiagastrobar"
NEXT_PUBLIC_FACEBOOK="sofiagastrobar"

# Payment
NEXT_PUBLIC_SUMUP_API_KEY="your_api_key"
SUMUP_MERCHANT_CODE="your_merchant_code"

# Last App Integration
LAST_APP_API_KEY="your_api_key"
LAST_APP_RESTAURANT_ID="your_restaurant_id"

# Features
NEXT_PUBLIC_ENABLE_MINI_GAME=true
NEXT_PUBLIC_ENABLE_DJ_MODE=true
NEXT_PUBLIC_ENABLE_QR_TABLES=true
NEXT_PUBLIC_ENABLE_MISSIONS=true

# Analytics
NEXT_PUBLIC_GA_ID="G-XXXXXXXXXX"
NEXT_PUBLIC_VERCEL_ANALYTICS=true
```

---

## 🎨 Componentes Específicos Sofia

### SofiaCharacter Component
```typescript
// components/game/SofiaCharacter.tsx
interface SofiaProps {
  position: { x: number; y: number }
  state: 'idle' | 'walking' | 'jumping' | 'celebrating'
  direction: 'left' | 'right'
}
```

### MissionCard Component
```typescript
// components/missoes/MissionCard.tsx
interface MissionCardProps {
  mission: Mission
  onClaim?: () => void
}
```

### MenuCategoryTabs Component
```typescript
// components/menu/CategoryTabs.tsx
// Tabs para: Tapas, Hamburguesas, Principais, Sobremesas, Bebidas
```

---

## 📊 Analytics & Tracking

### Eventos Importantes

```typescript
// Track no Google Analytics
trackEvent('page_view', { page: '/cardapio' })
trackEvent('call_waiter', { table_id: '01' })
trackEvent('game_start', { table_id: '01' })
trackEvent('game_end', { score: 450, table_id: '01' })
trackEvent('mission_complete', { mission_id: 'daily_tapas' })
trackEvent('checkout_initiated', { amount: 45.50, table_id: '01' })
```

---

## 🚀 Deployment

### Domínio
- **Produção**: `sofiagastrobar.com`
- **Staging**: `staging.sofiagastrobar.com`

### Vercel Configuration
- Auto-deploy de `main` branch
- Preview deploys para todas as branches
- Environment variables configuradas
- Analytics habilitado
- Speed Insights habilitado

---

## 📝 Convenções de Código Sofia

### Nomenclatura
- Componentes: PascalCase (`SofiaCharacter`, `MenuCard`)
- Arquivos: kebab-case para rotas (`mesa/[id]/page.tsx`)
- Funções: camelCase (`trackGameScore`, `callWaiter`)
- Constantes: UPPER_SNAKE_CASE (`MAX_SCORE`, `TABLE_COUNT`)

### Estrutura de Commits
```
feat(menu): Add Hamburguesas category with items
fix(qr): Fix table ID recognition on iOS Safari
refactor(game): Optimize collision detection
docs(readme): Update setup instructions
```

---

## 🎯 Prioridades de Features

### MVP (Fase 1) ✅
- [x] Home page com hero
- [x] Menu completo com categorias
- [x] Páginas QR por mesa
- [x] Sistema de chamar garçom
- [x] Deploy em produção

### Fase 2 (Em desenvolvimento)
- [ ] Mini-jogo "A Ilha Mágica de Sofia"
- [ ] Modo DJ com visualizador
- [ ] Sistema de missões básico
- [ ] Integração SumUp

### Fase 3 (Futuro)
- [ ] Integração Last App (TPV)
- [ ] Sistema de reservas
- [ ] Programa de fidelidade
- [ ] App PWA instalável
- [ ] Notificações push

---

## 🐛 Issues Conhecidos & Soluções

### Issue 1: QR não funciona no iOS Safari
**Solução**: Usar HTTPS obrigatório + verificar permissions

### Issue 2: Game lag em dispositivos antigos
**Solução**: Implementar graphics quality toggle

### Issue 3: Tailwind purge removendo classes dinâmicas
**Solução**: Safelist no tailwind.config.ts

---

## 📚 Recursos Específicos

- **Sprites Sofia**: `/public/images/game/sofia-sprites.png`
- **Hero Image**: `/public/images/hero/sofia-restaurant.jpg`
- **Menu Images**: `/public/images/dishes/[item-name].jpg`
- **Audio**: `/public/audio/background-music.mp3`
- **Fonts**: Playfair Display, Inter, Montserrat (Google Fonts)

---

## 🏆 Métricas de Sucesso

### KPIs
- Tempo médio no site: > 5 minutos
- Taxa de conversão QR → Menu: > 80%
- Engajamento mini-jogo: > 30% dos visitantes
- Chamadas de garçom via QR: > 50% das mesas
- NPS (Net Promoter Score): > 8/10

---

## 🤝 Colaboração

### Equipe
- **Desenvolvedor Principal**: Goldmonkey Studio
- **Cliente**: Sofia Gastrobar
- **Designer**: (TBD)

### Comunicação
- Updates semanais
- Feedback via GitHub Issues
- Demos quinzenais

---

## 📖 Histórico de Versões

### v1.0.0 (2025-12-06) - MVP Launch
- Home page completa
- Menu digital funcional
- Sistema QR por mesa
- Deploy em produção

### v1.1.0 (Planejado) - Interactive Features
- Mini-jogo Sofia
- Modo DJ
- Sistema de missões

### v1.2.0 (Planejado) - Integrations
- SumUp payments
- Last App TPV
- Analytics avançado

---

**Criado por**: Goldmonkey Empire
**Projeto**: Sofia Gastrobar
**Template Base**: Restaurant Full-Stack v1.0
**Última atualização**: 2025-12-06
**Status**: Em desenvolvimento

---

## 🎯 Next Steps

Quando trabalhar no projeto Sofia, sempre:

1. ✅ Verificar este arquivo primeiro
2. ✅ Seguir padrões do template restaurant
3. ✅ Manter Layer 3 separado de Layer 2/1
4. ✅ Documentar decisões importantes aqui
5. ✅ Testar em dispositivos móveis (maioria dos usuários)

---

**Sofia Gastrobar** - Onde gastronomia encontra tecnologia 🍽️✨
