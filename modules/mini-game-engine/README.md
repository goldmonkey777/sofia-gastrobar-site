# 🎮 Mini-Game Engine Module

Módulo Goldmonkey para criação de mini-jogos 2D em Canvas.

## Features

- ✅ Engine 2D baseado em Canvas API
- ✅ Sistema de física simples (gravity, collision)
- ✅ Game loop otimizado (60fps)
- ✅ Score system com persistência
- ✅ Sprite animation system
- ✅ Audio integration (opcional)

## Usage

```typescript
import { GameEngine } from '@/modules/mini-game-engine/engine/GameEngine'
import { IslandAdventure } from '@/modules/mini-game-engine/games/island-adventure'

function GamePage() {
  return <IslandAdventure />
}
```

## Architecture

```
engine/
├── GameLoop.ts        → Core game loop (requestAnimationFrame)
├── Physics.ts         → Gravity, collision detection
├── Sprite.ts          → Sprite rendering and animation
└── Audio.ts           → Sound effects manager

games/
└── island-adventure/  → "A Ilha Mágica de Sofia" game
    ├── Game.tsx       → Main game component
    ├── Player.ts      → Sofia character logic
    ├── Obstacle.ts    → Obstacles (rocks, crabs)
    └── Collectible.ts → Items to collect
```

## Game Example: Island Adventure

Sofia (tartaruga) navega pela ilha coletando ingredientes:
- **Movimento**: Touch/Keyboard
- **Objetivo**: Coletar tomates, pimentões, peixes
- **Obstáculos**: Caranguejos, rochas
- **Pontuação**: Ingredientes (+10), Tempo (+1/s), Combos (+50)

## Integration

### 1. Create game route

```typescript
// app/jogo/page.tsx
import { IslandAdventure } from '@/modules/mini-game-engine/games/island-adventure'

export default function JogoPage() {
  return <IslandAdventure />
}
```

### 2. Link from table page

```typescript
<Link href="/jogo">Jogar Mini-Jogo</Link>
```

## Configuration

```bash
# .env.local
NEXT_PUBLIC_ENABLE_MINI_GAME=true
```

## Performance

- Canvas size: 800x600 (scaled to fit)
- Target FPS: 60
- Mobile optimized (touch controls)
- Pause on blur (save battery)

## Customization

Crie seu próprio jogo extendendo a base engine:

```typescript
import { GameEngine } from '@/modules/mini-game-engine/engine/GameEngine'

class MyGame extends GameEngine {
  init() {
    // Setup your game
  }

  update(deltaTime: number) {
    // Update game logic
  }

  render(ctx: CanvasRenderingContext2D) {
    // Draw game
  }
}
```
