/**
 * Página DJ - Sofia Magic DJ™
 * Playlists colaborativas do Spotify por horário
 */

'use client'

import { SpotifyPlaylistEmbed } from '@/components/spotify/SpotifyPlaylistEmbed'
import { useLanguage } from '@/hooks/useLanguage'
import { translate } from '@/lib/i18n'
import Link from 'next/link'
import { Home } from 'lucide-react'

const SUNSET_EMBED = process.env.NEXT_PUBLIC_SPOTIFY_SUNSET_EMBED_URL || ''
const SUNSET_OPEN = process.env.NEXT_PUBLIC_SPOTIFY_SUNSET_OPEN_URL || ''
const NIGHT_EMBED = process.env.NEXT_PUBLIC_SPOTIFY_NIGHT_EMBED_URL || ''
const NIGHT_OPEN = process.env.NEXT_PUBLIC_SPOTIFY_NIGHT_OPEN_URL || ''
const BREAKFAST_EMBED = process.env.NEXT_PUBLIC_SPOTIFY_BREAKFAST_EMBED_URL || ''
const BREAKFAST_OPEN = process.env.NEXT_PUBLIC_SPOTIFY_BREAKFAST_OPEN_URL || ''

const translations = {
  title: {
    pt: 'Sofia Magic DJ™',
    es: 'Sofia Magic DJ™',
    en: 'Sofia Magic DJ™',
  },
  subtitle: {
    pt: 'Participe do som do Sofia. Escolha até 2 músicas para a playlist do momento. Elas entram na fila, sem interromper a música atual.',
    es: 'Participa del sonido del Sofia. Elige hasta 2 canciones para la playlist del momento. Entran en la cola, sin interrumpir la música actual.',
    en: 'Participate in Sofia\'s sound. Choose up to 2 songs for the current playlist. They join the queue, without interrupting current music.',
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

export default function DjPage() {
  const { language, isReady } = useLanguage()

  if (!isReady) return null

  return (
    <main className="min-h-screen bg-black text-white pb-16">
      {/* Header */}
      <header className="bg-black/95 backdrop-blur-sm border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link href="/" className="flex items-center gap-2 text-yellow-500 hover:text-yellow-400">
            <Home className="w-5 h-5" />
            <span className="font-bold text-sm">Sofia</span>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-3xl mx-auto pt-10 px-4 text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          {translate(translations.title, language)}
        </h1>
        <p className="text-sm text-white/60 mb-6 leading-relaxed max-w-2xl mx-auto">
          {translate(translations.subtitle, language)}
        </p>
      </section>

      {/* Playlists */}
      <div className="space-y-8">
        {/* Breakfast */}
        {BREAKFAST_EMBED && BREAKFAST_OPEN && (
          <SpotifyPlaylistEmbed
            title={translate(translations.breakfastTitle, language)}
            description={translate(translations.breakfastDesc, language)}
            embedUrl={BREAKFAST_EMBED}
            openUrl={BREAKFAST_OPEN}
          />
        )}

        {/* Sunset */}
        {SUNSET_EMBED && SUNSET_OPEN && (
          <SpotifyPlaylistEmbed
            title={translate(translations.sunsetTitle, language)}
            description={translate(translations.sunsetDesc, language)}
            embedUrl={SUNSET_EMBED}
            openUrl={SUNSET_OPEN}
          />
        )}

        {/* Night */}
        {NIGHT_EMBED && NIGHT_OPEN && (
          <SpotifyPlaylistEmbed
            title={translate(translations.nightTitle, language)}
            description={translate(translations.nightDesc, language)}
            embedUrl={NIGHT_EMBED}
            openUrl={NIGHT_OPEN}
          />
        )}

        {/* Mensagem se não tiver playlists configuradas */}
        {!BREAKFAST_EMBED && !SUNSET_EMBED && !NIGHT_EMBED && (
          <div className="max-w-xl mx-auto px-4">
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-6 text-center">
              <p className="text-yellow-400 text-sm mb-2">
                ⚙️ Configure as variáveis de ambiente do Spotify
              </p>
              <p className="text-white/60 text-xs">
                Veja SPOTIFY_SETUP.md para instruções
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
