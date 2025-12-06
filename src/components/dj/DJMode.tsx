/**
 * Modo DJ - Escolha a Música
 * Integrado na experiência da mesa
 * Apple Music como motor por baixo
 */

'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Music, ExternalLink, Info, Sparkles, Headphones } from 'lucide-react'
import { useLanguage } from '@/hooks/useLanguage'
import { translate } from '@/lib/i18n'
import { QRCode } from '@/components/ui/QRCode'

interface DJModeProps {
  tableId: string
}

// Link da playlist colaborativa do Apple Music
// TODO: Substituir pelo link real quando criar a playlist
const APPLE_MUSIC_PLAYLIST_URL = 'https://music.apple.com/playlist/sofia-sunset-sessions'

const translations = {
  title: {
    pt: '🎧 Sofia Magic DJ™',
    es: '🎧 Sofia Magic DJ™',
    en: '🎧 Sofia Magic DJ™',
  },
  subtitle: {
    pt: 'Escolha a Próxima Música',
    es: 'Elige la Próxima Canción',
    en: 'Choose the Next Song',
  },
  description: {
    pt: 'Aqui você pode participar do som da casa. Escolha até 2 músicas para entrar na fila da playlist oficial do Sofia. A música toca em ordem, sem interromper a vibe atual.',
    es: 'Aquí puedes participar del sonido de la casa. Elige hasta 2 canciones para entrar en la cola de la playlist oficial del Sofia. La música suena en orden, sin interrumpir el ambiente actual.',
    en: 'Here you can participate in the house sound. Choose up to 2 songs to join the queue of Sofia\'s official playlist. Songs play in order, without interrupting the current vibe.',
  },
  openPlaylist: {
    pt: 'Abrir Playlist no Apple Music',
    es: 'Abrir Playlist en Apple Music',
    en: 'Open Playlist in Apple Music',
  },
  rulesTitle: {
    pt: 'Regras do Modo DJ',
    es: 'Reglas del Modo DJ',
    en: 'DJ Mode Rules',
  },
  rule1: {
    pt: 'Máximo 2 músicas por pessoa',
    es: 'Máximo 2 canciones por persona',
    en: 'Maximum 2 songs per person',
  },
  rule2: {
    pt: 'Mantenha o clima chill e relaxante',
    es: 'Mantén el ambiente relajante',
    en: 'Keep it chill and relaxing',
  },
  rule3: {
    pt: 'Evite músicas explícitas ou agressivas',
    es: 'Evita canciones explícitas o agresivas',
    en: 'Avoid explicit or aggressive songs',
  },
  rule4: {
    pt: 'A casa pode pular músicas que quebrem o clima',
    es: 'La casa puede saltar canciones que rompan el ambiente',
    en: 'The house may skip songs that break the vibe',
  },
  qrLabel: {
    pt: 'Escaneie para abrir no Apple Music',
    es: 'Escanea para abrir en Apple Music',
    en: 'Scan to open in Apple Music',
  },
  tip: {
    pt: '💡 Dica: A música entra na fila e toca em ordem. Não interrompe o som atual!',
    es: '💡 Consejo: La música entra en la cola y suena en orden. ¡No interrumpe el sonido actual!',
    en: '💡 Tip: Songs join the queue and play in order. Doesn\'t interrupt current music!',
  },
}

export function DJMode({ tableId }: DJModeProps) {
  const { language, isReady } = useLanguage()
  const [showRules, setShowRules] = useState(false)

  if (!isReady) return null

  const handleOpenPlaylist = () => {
    // Abre Apple Music (deep link funciona no iOS, fallback para web)
    window.open(APPLE_MUSIC_PLAYLIST_URL, '_blank')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-purple-900/20 via-pink-900/20 to-yellow-900/20 border border-white/10 rounded-2xl p-6 mb-6"
    >
      {/* Header */}
      <div className="flex items-start gap-4 mb-4">
        <div className="bg-yellow-500/20 p-3 rounded-xl">
          <Headphones className="w-6 h-6 text-yellow-500" />
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-white mb-1">
            {translate(translations.title, language)}
          </h2>
          <p className="text-white/70 text-sm">
            {translate(translations.subtitle, language)}
          </p>
        </div>
      </div>

      {/* Description */}
      <p className="text-white/80 text-sm mb-6 leading-relaxed">
        {translate(translations.description, language)}
      </p>

      {/* Main Action Button */}
      <button
        onClick={handleOpenPlaylist}
        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg shadow-purple-500/20 mb-4 flex items-center justify-center gap-3"
      >
        <Music className="w-5 h-5" />
        <span>{translate(translations.openPlaylist, language)}</span>
        <ExternalLink className="w-4 h-4" />
      </button>

      {/* QR Code */}
      <div className="bg-black/40 rounded-xl p-4 mb-4">
        <div className="flex flex-col items-center">
          <QRCode 
            value={APPLE_MUSIC_PLAYLIST_URL} 
            size={120} 
            showLabel={false}
          />
          <p className="text-white/60 text-xs text-center mt-2 max-w-[140px]">
            {translate(translations.qrLabel, language)}
          </p>
        </div>
      </div>

      {/* Rules Toggle */}
      <button
        onClick={() => setShowRules(!showRules)}
        className="w-full flex items-center justify-between text-white/70 hover:text-white text-sm transition-colors mb-2"
      >
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4" />
          <span>{translate(translations.rulesTitle, language)}</span>
        </div>
        <motion.div
          animate={{ rotate: showRules ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </motion.div>
      </button>

      {/* Rules Panel */}
      {showRules && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="bg-black/20 rounded-lg p-4 space-y-2"
        >
          <div className="flex items-start gap-2 text-white/80 text-sm">
            <span className="text-yellow-500">•</span>
            <span>{translate(translations.rule1, language)}</span>
          </div>
          <div className="flex items-start gap-2 text-white/80 text-sm">
            <span className="text-yellow-500">•</span>
            <span>{translate(translations.rule2, language)}</span>
          </div>
          <div className="flex items-start gap-2 text-white/80 text-sm">
            <span className="text-yellow-500">•</span>
            <span>{translate(translations.rule3, language)}</span>
          </div>
          <div className="flex items-start gap-2 text-white/80 text-sm">
            <span className="text-yellow-500">•</span>
            <span>{translate(translations.rule4, language)}</span>
          </div>
        </motion.div>
      )}

      {/* Tip */}
      <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
        <p className="text-yellow-400 text-xs leading-relaxed">
          {translate(translations.tip, language)}
        </p>
      </div>
    </motion.div>
  )
}

