/**
 * Modo DJ - Escolha a Música
 * Integrado na experiência da mesa
 * Spotify como motor por baixo
 */

'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Music, Info, Headphones, Clock } from 'lucide-react'
import { useLanguage } from '@/hooks/useLanguage'
import { translate } from '@/lib/i18n'
import { SpotifyPlaylistEmbed } from '@/components/spotify/SpotifyPlaylistEmbed'
import { getCurrentHour } from '@/lib/menuHelpers'

interface DJModeProps {
  tableId: string
}

// Perfil oficial do Spotify do Sofia Gastrobar Ibiza
const SPOTIFY_PROFILE_URL = 'https://open.spotify.com/user/316axpbhhlk3dy6duqdfctbbec2y'

// URLs do Spotify (via env vars)
// Se não configuradas, usa o perfil como fallback
const SUNSET_EMBED = process.env.NEXT_PUBLIC_SPOTIFY_SUNSET_EMBED_URL || ''
const SUNSET_OPEN = process.env.NEXT_PUBLIC_SPOTIFY_SUNSET_OPEN_URL || SPOTIFY_PROFILE_URL
const NIGHT_EMBED = process.env.NEXT_PUBLIC_SPOTIFY_NIGHT_EMBED_URL || ''
const NIGHT_OPEN = process.env.NEXT_PUBLIC_SPOTIFY_NIGHT_OPEN_URL || SPOTIFY_PROFILE_URL
const BREAKFAST_EMBED = process.env.NEXT_PUBLIC_SPOTIFY_BREAKFAST_EMBED_URL || ''
const BREAKFAST_OPEN = process.env.NEXT_PUBLIC_SPOTIFY_BREAKFAST_OPEN_URL || SPOTIFY_PROFILE_URL

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
    pt: 'Participe do som do Sofia. Escolha até 2 músicas para a playlist do momento. Elas entram na fila, sem interromper a música atual.',
    es: 'Participa del sonido del Sofia. Elige hasta 2 canciones para la playlist del momento. Entran en la cola, sin interrumpir la música actual.',
    en: 'Participate in Sofia\'s sound. Choose up to 2 songs for the current playlist. They join the queue, without interrupting current music.',
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
  tip: {
    pt: '💡 Dica: A música entra na fila e toca em ordem. Não interrompe o som atual!',
    es: '💡 Consejo: La música entra en la cola y suena en orden. ¡No interrumpe el sonido actual!',
    en: '💡 Tip: Songs join the queue and play in order. Doesn\'t interrupt current music!',
  },
  breakfastTitle: {
    pt: 'Breakfast Flow ☕',
    es: 'Breakfast Flow ☕',
    en: 'Breakfast Flow ☕',
  },
  breakfastDesc: {
    pt: 'De manhã, energia suave, café, sol nascendo e boa conversa.',
    es: 'Por la mañana, energía suave, café, sol naciente y buena conversación.',
    en: 'Morning vibes, soft energy, coffee, rising sun and good conversation.',
  },
  sunsetTitle: {
    pt: 'Sunset Sessions 🌅',
    es: 'Sunset Sessions 🌅',
    en: 'Sunset Sessions 🌅',
  },
  sunsetDesc: {
    pt: 'Fim de tarde em Sant Antoni, céu laranja, drinks e alma leve.',
    es: 'Final de tarde en Sant Antoni, cielo naranja, copas y alma ligera.',
    en: 'Late afternoon in Sant Antoni, orange sky, drinks and light soul.',
  },
  nightTitle: {
    pt: 'Night Vibes 🔥',
    es: 'Night Vibes 🔥',
    en: 'Night Vibes 🔥',
  },
  nightDesc: {
    pt: 'Quando a noite cai e o Sofia acende.',
    es: 'Cuando cae la noche y el Sofia se enciende.',
    en: 'When night falls and Sofia lights up.',
  },
}

export function DJMode({ tableId }: DJModeProps) {
  const { language, isReady } = useLanguage()
  const [showRules, setShowRules] = useState(false)
  const currentHour = getCurrentHour()

  if (!isReady) return null

  // Determinar qual playlist mostrar baseado no horário
  const getActivePlaylist = () => {
    if (currentHour >= 8 && currentHour < 12) {
      // Breakfast
      return {
        embedUrl: BREAKFAST_EMBED,
        openUrl: BREAKFAST_OPEN,
        title: translate(translations.breakfastTitle, language),
        description: translate(translations.breakfastDesc, language),
      }
    } else if (currentHour >= 17 || currentHour < 1) {
      // Night (17h-1h)
      return {
        embedUrl: NIGHT_EMBED,
        openUrl: NIGHT_OPEN,
        title: translate(translations.nightTitle, language),
        description: translate(translations.nightDesc, language),
      }
    } else {
      // Sunset (12h-17h)
      return {
        embedUrl: SUNSET_EMBED,
        openUrl: SUNSET_OPEN,
        title: translate(translations.sunsetTitle, language),
        description: translate(translations.sunsetDesc, language),
      }
    }
  }

  const activePlaylist = getActivePlaylist()

  // Se não tiver embed configurado, mostrar botão para abrir perfil
  if (!activePlaylist.embedUrl) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-purple-900/20 via-pink-900/20 to-yellow-900/20 border border-white/10 rounded-2xl p-6 mb-6"
      >
        <div className="flex items-start gap-4 mb-4">
          <div className="bg-yellow-500/20 p-3 rounded-xl">
            <Headphones className="w-6 h-6 text-yellow-500" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-white mb-1">
              {translate(translations.title, language)}
            </h2>
            <p className="text-white/70 text-sm flex items-center gap-2">
              <Clock className="w-4 h-4" />
              {translate(translations.subtitle, language)}
            </p>
          </div>
        </div>
        <p className="text-white/80 text-sm mb-6 leading-relaxed">
          {translate(translations.description, language)}
        </p>
        
        {/* Botão para abrir perfil do Spotify */}
        <a
          href={SPOTIFY_PROFILE_URL}
          target="_blank"
          rel="noreferrer"
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-full bg-[#1DB954] hover:bg-[#1ed760] text-white font-medium transition-colors shadow-lg shadow-[#1DB954]/20"
        >
          <Music className="w-5 h-5" />
          <span>Abrir Perfil no Spotify</span>
        </a>
        
        <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
          <p className="text-yellow-400 text-xs">
            💡 Configure as URLs de embed no .env.local para ver a playlist diretamente aqui
          </p>
        </div>
      </motion.div>
    )
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
          <p className="text-white/70 text-sm flex items-center gap-2">
            <Clock className="w-4 h-4" />
            {translate(translations.subtitle, language)}
          </p>
        </div>
      </div>

      {/* Description */}
      <p className="text-white/80 text-sm mb-6 leading-relaxed">
        {translate(translations.description, language)}
      </p>

      {/* Spotify Playlist Embed */}
      <div className="mb-4">
        <SpotifyPlaylistEmbed
          title={activePlaylist.title}
          description={activePlaylist.description}
          embedUrl={activePlaylist.embedUrl}
          openUrl={activePlaylist.openUrl}
        />
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
