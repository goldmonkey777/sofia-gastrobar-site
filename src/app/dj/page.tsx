'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Home, Play, Pause, SkipForward, Volume2, Maximize } from 'lucide-react'
import Link from 'next/link'

export default function DJPage() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(70)
  const [currentTrack, setCurrentTrack] = useState(0)
  const [bars, setBars] = useState(Array(32).fill(0))

  const tracks = [
    { title: 'Mediterranean Sunset', artist: 'Ibiza Sounds', duration: '4:32' },
    { title: 'Balearic Breeze', artist: 'Chill Collective', duration: '5:18' },
    { title: 'Sofia\'s Island', artist: 'Lounge Masters', duration: '6:05' },
  ]

  useEffect(() => {
    if (!isPlaying) return

    const interval = setInterval(() => {
      setBars(Array(32).fill(0).map(() => Math.random() * 100))
    }, 100)

    return () => clearInterval(interval)
  }, [isPlaying])

  const togglePlay = () => setIsPlaying(!isPlaying)

  const nextTrack = () => {
    setCurrentTrack((currentTrack + 1) % tracks.length)
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
    } else {
      document.exitFullscreen()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 text-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <Link href="/" className="flex items-center gap-2 text-white/80 hover:text-white">
            <Home className="w-5 h-5" />
            <span className="font-semibold">Voltar</span>
          </Link>
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-2">🎵 Modo DJ</h1>
            <p className="text-white/70">Vibe do Sofia Gastrobar</p>
          </div>
          <button
            onClick={toggleFullscreen}
            className="flex items-center gap-2 text-white/80 hover:text-white"
          >
            <Maximize className="w-5 h-5" />
            <span className="font-semibold">Fullscreen</span>
          </button>
        </div>

        {/* Visualizer */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-black/30 backdrop-blur-sm rounded-3xl p-8 mb-8"
        >
          {/* Animated Mascot */}
          <motion.div
            animate={{
              scale: isPlaying ? [1, 1.1, 1] : 1,
              rotate: isPlaying ? [0, 5, -5, 0] : 0,
            }}
            transition={{
              duration: 2,
              repeat: isPlaying ? Infinity : 0,
              ease: 'easeInOut',
            }}
            className="text-center mb-8"
          >
            <div className="text-9xl">🐢</div>
            <div className="text-2xl font-bold mt-4">Sofia está {isPlaying ? 'dançando' : 'esperando'}!</div>
          </motion.div>

          {/* Equalizer Bars */}
          <div className="flex items-end justify-center gap-2 h-64">
            {bars.map((height, i) => (
              <motion.div
                key={i}
                animate={{ height: isPlaying ? `${height}%` : '10%' }}
                transition={{ duration: 0.1 }}
                className="w-4 bg-gradient-to-t from-primary via-accent to-purple-500 rounded-t-full"
                style={{ minHeight: '10%' }}
              />
            ))}
          </div>
        </motion.div>

        {/* Player Controls */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
          {/* Track Info */}
          <div className="text-center mb-6">
            <div className="text-3xl font-bold mb-2">{tracks[currentTrack].title}</div>
            <div className="text-xl text-white/70">{tracks[currentTrack].artist}</div>
            <div className="text-sm text-white/50 mt-2">{tracks[currentTrack].duration}</div>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
              <motion.div
                animate={{ width: isPlaying ? '100%' : '0%' }}
                transition={{ duration: 30, ease: 'linear' }}
                className="h-full bg-gradient-to-r from-primary to-accent"
              />
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-8 mb-6">
            <button
              onClick={togglePlay}
              className="bg-gradient-to-r from-primary to-accent p-6 rounded-full hover:scale-110 transition-transform shadow-xl"
            >
              {isPlaying ? (
                <Pause className="w-8 h-8" />
              ) : (
                <Play className="w-8 h-8 ml-1" />
              )}
            </button>

            <button
              onClick={nextTrack}
              className="bg-white/20 p-4 rounded-full hover:bg-white/30 transition-colors"
            >
              <SkipForward className="w-6 h-6" />
            </button>
          </div>

          {/* Volume */}
          <div className="flex items-center gap-4 max-w-md mx-auto">
            <Volume2 className="w-5 h-5 text-white/70" />
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={(e) => setVolume(parseInt(e.target.value))}
              className="flex-1 h-2 bg-white/20 rounded-full appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, rgb(var(--primary)) 0%, rgb(var(--primary)) ${volume}%, rgba(255,255,255,0.2) ${volume}%, rgba(255,255,255,0.2) 100%)`,
              }}
            />
            <span className="text-white/70 font-semibold w-12 text-right">{volume}%</span>
          </div>
        </div>

        {/* Playlist */}
        <div className="mt-8 bg-white/10 backdrop-blur-sm rounded-2xl p-6">
          <h2 className="text-2xl font-bold mb-4">Playlist</h2>
          <div className="space-y-3">
            {tracks.map((track, index) => (
              <button
                key={index}
                onClick={() => setCurrentTrack(index)}
                className={`w-full text-left p-4 rounded-lg transition-all ${
                  currentTrack === index
                    ? 'bg-gradient-to-r from-primary/30 to-accent/30'
                    : 'bg-white/5 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold">{track.title}</div>
                    <div className="text-sm text-white/70">{track.artist}</div>
                  </div>
                  <div className="text-sm text-white/50">{track.duration}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
