# 🎵 DJ Mode Module

Módulo Goldmonkey para modo DJ com visualizador de áudio.

## Features

- ✅ Visualizador de áudio animado (bars/wave/circular)
- ✅ Animação do mascote sincronizada com música
- ✅ Controles de player (play, pause, próxima, volume)
- ✅ Fullscreen mode
- ✅ Efeitos visuais (gradientes, partículas)
- ✅ Playlist configurável

## Usage

```typescript
import { DJVisualizer } from '@/modules/dj-mode/components/DJVisualizer'
import { MascotAnimation } from '@/modules/dj-mode/components/MascotAnimation'

function DJPage() {
  return (
    <div>
      <DJVisualizer
        audioSource="/audio/background-music.mp3"
        visualizerType="bars"
      />
      <MascotAnimation mascotImage="/images/sofia.png" />
    </div>
  )
}
```

## Components

### DJVisualizer
Visualizador de áudio com diferentes estilos:
- **bars**: Barras equalizador (clássico)
- **wave**: Onda de frequência
- **circular**: Visualização circular

### MascotAnimation
Animação do mascote que responde ao áudio:
- Dança ao ritmo da música
- Escala com amplitude
- Expressões faciais (opcional)

### EqualizerBars
Barras de equalizar com Framer Motion

## Web Audio API

```typescript
// Exemplo de setup
const audioContext = new AudioContext()
const analyser = audioContext.createAnalyser()
analyser.fftSize = 256

const bufferLength = analyser.frequencyBinCount
const dataArray = new Uint8Array(bufferLength)

// No render loop
analyser.getByteFrequencyData(dataArray)
// Use dataArray para visualização
```

## Playlist Configuration

```typescript
// lib/dj-playlist.ts
export const playlist = [
  {
    id: '1',
    title: 'Mediterranean Vibes',
    artist: 'Ibiza Sounds',
    url: '/audio/track-1.mp3',
    duration: 180,
  },
  // ...
]
```

## Fullscreen Mode

```typescript
const handleFullscreen = () => {
  if (document.fullscreenElement) {
    document.exitFullscreen()
  } else {
    document.documentElement.requestFullscreen()
  }
}
```

## Configuration

```bash
# .env.local
NEXT_PUBLIC_ENABLE_DJ_MODE=true
```

## Assets Required

- Audio files: `/public/audio/*.mp3`
- Mascot images: `/public/images/sofia-*.png`
- Background visuals: Optional

## Performance Tips

- Use `requestAnimationFrame` for smooth animations
- Limit particles count on mobile (<100)
- Pause visualization when tab is not visible
- Preload audio files

## Mobile Considerations

- Touch controls (tap to play/pause)
- Auto-play might be blocked (require user interaction)
- Reduce visual complexity on low-end devices
- Landscape orientation recommended
