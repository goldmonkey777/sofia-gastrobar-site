/**
 * Spotify Playlist Embed - Componente para embedar playlists colaborativas
 * Integrado com o Modo DJ do Sofia
 */

'use client'

import { ExternalLink } from 'lucide-react'
import { useLanguage } from '@/hooks/useLanguage'
import { translate } from '@/lib/i18n'

type SpotifyPlaylistEmbedProps = {
  title: string
  description?: string
  embedUrl: string
  openUrl: string
  className?: string
}

const translations = {
  openInSpotify: {
    pt: 'Abrir no Spotify',
    es: 'Abrir en Spotify',
    en: 'Open in Spotify',
  },
  addMusic: {
    pt: 'Adicione até',
    es: 'Agrega hasta',
    en: 'Add up to',
  },
  songs: {
    pt: 'músicas',
    es: 'canciones',
    en: 'songs',
  },
  toQueue: {
    pt: 'à fila',
    es: 'a la cola',
    en: 'to the queue',
  },
  smoothEntry: {
    pt: 'A música entra suave, sem interromper o som atual.',
    es: 'La música entra suave, sin interrumpir el sonido actual.',
    en: 'Songs join smoothly, without interrupting current music.',
  },
}

export function SpotifyPlaylistEmbed({
  title,
  description,
  embedUrl,
  openUrl,
  className = '',
}: SpotifyPlaylistEmbedProps) {
  const { language, isReady } = useLanguage()

  if (!isReady) return null

  return (
    <section className={`w-full max-w-xl mx-auto my-6 px-4 ${className}`}>
      <h2 className="text-xl font-bold mb-1 flex items-center gap-2 text-white">
        🎧 {title}
      </h2>

      {description && (
        <p className="text-sm text-white/60 mb-4 leading-relaxed">
          {description}
        </p>
      )}

      <div className="rounded-xl overflow-hidden border border-white/10 bg-black/40 shadow-lg">
        <iframe
          src={embedUrl}
          width="100%"
          height="380"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
          style={{ border: 'none' }}
          className="w-full"
        />
      </div>

      <div className="mt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <a
          href={openUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-[#1DB954] hover:bg-[#1ed760] text-white font-medium transition-colors shadow-lg shadow-[#1DB954]/20"
        >
          <span>{translate(translations.openInSpotify, language)}</span>
          <ExternalLink className="w-4 h-4" />
        </a>

        <p className="text-xs text-white/50 leading-tight text-left sm:text-right max-w-[200px]">
          {translate(translations.addMusic, language)}{' '}
          <strong className="text-white/80">2</strong>{' '}
          {translate(translations.songs, language)}{' '}
          {translate(translations.toQueue, language)}.
          <br />
          <span className="text-yellow-400/80">✨</span>{' '}
          {translate(translations.smoothEntry, language)}
        </p>
      </div>
    </section>
  )
}

