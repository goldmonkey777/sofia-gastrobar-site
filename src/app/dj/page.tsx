'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Home, Play, Pause, SkipForward, SkipBack, Volume2, Maximize, Music } from 'lucide-react'
import Link from 'next/link'
import { useAudioVisualizer } from '@/hooks/useAudioVisualizer'

export default function DJPage() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0)

  const tracks = [
    {
      title: 'Summer Breeze',
      artist: 'Ibiza Sunset',
      url: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=summer-breeze-113862.mp3', // Free for commercial use
      duration: '02:37'
    },
    {
      title: 'Deep Urban',
      artist: 'Lounge City',
      url: 'https://cdn.pixabay.com/download/audio/2022/10/25/audio_5103c81411.mp3?filename=deep-urban-124683.mp3',
      duration: '02:15'
    },
    {
      title: 'Chillout Lounge',
      artist: 'Sofia Vibes',
      url: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d4613f578c.mp3?filename=chillout-lounge-13229.mp3',
      duration: '04:05'
    },
  ]

  const {
    audioRef,
    isPlaying,
    togglePlay,
    volume,
    setVolume,
    frequencyData,
    currentTime,
    duration,
    seek,
    onLoadedMetadata,
    onEnded
  } = useAudioVisualizer(tracks[currentTrackIndex].url, { fftSize: 64 })

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % tracks.length)
  }

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + tracks.length) % tracks.length)
  }

  // Handle auto-next (optional, can be added to onEnded in hook but done here for simplicity)
  const handleTrackEnd = () => {
    onEnded()
    nextTrack()
    // Auto-play next track could be implemented here if desired, 
    // but browsers often block uninitiated play. 
    // Usually requires user interaction or continuous context.
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
    } else {
      document.exitFullscreen()
    }
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-950 to-black text-white overflow-hidden relative">
      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        crossOrigin="anonymous"
        onLoadedMetadata={onLoadedMetadata}
        onEnded={handleTrackEnd}
      />

      {/* Decorative Background Glows */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-600/30 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/20 rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 py-6 flex flex-col min-h-screen">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 z-10">
          <Link href="/" className="flex items-center gap-2 text-white/60 hover:text-white transition-colors group">
            <div className="p-2 bg-white/5 rounded-full group-hover:bg-white/10">
              <Home className="w-5 h-5" />
            </div>
            <span className="font-medium">Voltar</span>
          </Link>

          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-200 to-purple-200">
              Sofia Radio
            </h1>
            <div className="flex items-center justify-center gap-2 text-xs uppercase tracking-widest text-white/50 mt-1">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Ao Vivo
            </div>
          </div>

          <button
            onClick={toggleFullscreen}
            className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
          >
            <Maximize className="w-5 h-5" />
          </button>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col items-center justify-center w-full max-w-4xl mx-auto gap-12">

          {/* Visualizer & Mascot */}
          <div className="w-full relative">
            <motion.div
              className="relative z-10 flex flex-col items-center justify-center py-10"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              {/* Mascot */}
              <motion.div
                animate={{
                  scale: isPlaying ? [1, 1.05, 1] : 1,
                  rotate: isPlaying ? [0, 2, -2, 0] : 0,
                }}
                transition={{
                  duration: 0.5, // Faster beat
                  repeat: isPlaying ? Infinity : 0,
                  ease: 'easeInOut',
                }}
                className="text-center mb-12 drop-shadow-[0_0_35px_rgba(255,255,255,0.3)]"
              >
                <div className="text-9xl filter drop-shadow-lg transform transition-transform duration-300 hover:scale-110 cursor-pointer" onClick={togglePlay}>
                  🐢
                </div>
              </motion.div>

              {/* Bars */}
              <div className="flex items-end justify-center gap-[4px] h-32 w-full max-w-2xl px-4">
                {frequencyData.map((height, i) => (
                  <motion.div
                    key={i}
                    animate={{
                      height: `${Math.max(4, height)}%`,
                      backgroundColor: height > 80 ? '#fbbf24' : height > 50 ? '#c084fc' : '#4f46e5'
                    }}
                    transition={{ type: "tween", ease: "linear", duration: 0.1 }}
                    className="w-full rounded-t-full opacity-90 shadow-[0_0_10px_rgba(192,132,252,0.4)]"
                  />
                ))}
              </div>
            </motion.div>
          </div>

          {/* Player Controls Card */}
          <div className="w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-10 shadow-2xl">
            {/* Track Info */}
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-2 text-white/90">{tracks[currentTrackIndex].title}</h2>
              <p className="text-lg text-white/60">{tracks[currentTrackIndex].artist}</p>
            </div>

            {/* Progress Bar */}
            <div className="mb-8 group">
              <div
                className="h-2 bg-white/10 rounded-full cursor-pointer overflow-hidden relative"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  const percent = x / rect.width;
                  seek(percent * duration);
                }}
              >
                <motion.div
                  style={{ width: `${(currentTime / duration) * 100 || 0}%` }}
                  className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-amber-400 absolute top-0 left-0"
                />
                {/* Hover effect indicator could go here */}
              </div>
              <div className="flex justify-between text-xs text-white/40 mt-2 font-mono">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration || 0)}</span>
              </div>
            </div>

            {/* Playback Buttons */}
            <div className="flex items-center justify-center gap-6 md:gap-10 mb-8">
              <button
                onClick={prevTrack}
                className="p-4 text-white/60 hover:text-white hover:bg-white/5 rounded-full transition-all"
              >
                <SkipBack className="w-8 h-8" />
              </button>

              <button
                onClick={togglePlay}
                className="bg-white text-black p-6 rounded-full hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(255,255,255,0.3)]"
              >
                {isPlaying ? <Pause className="w-8 h-8 md:w-10 md:h-10 fill-current" /> : <Play className="w-8 h-8 md:w-10 md:h-10 fill-current ml-1" />}
              </button>

              <button
                onClick={nextTrack}
                className="p-4 text-white/60 hover:text-white hover:bg-white/5 rounded-full transition-all"
              >
                <SkipForward className="w-8 h-8" />
              </button>
            </div>

            {/* Volume & Playlist Toggle */}
            <div className="flex items-center gap-4 max-w-xs mx-auto">
              <Volume2 className="w-5 h-5 text-white/50" />
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="flex-1 h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
              />
            </div>
          </div>

          {/* Mini Playlist */}
          <div className="w-full max-w-4xl opacity-80 hover:opacity-100 transition-opacity">
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x">
              {tracks.map((track, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentTrackIndex(idx)}
                  className={`flex flex-col items-start min-w-[160px] p-4 rounded-xl border snap-start transition-all ${currentTrackIndex === idx
                      ? 'bg-white/10 border-amber-400/50'
                      : 'bg-white/5 border-transparent hover:bg-white/10'
                    }`}
                >
                  <div className="mb-2 p-2 bg-white/5 rounded-lg">
                    <Music className={`w-6 h-6 ${currentTrackIndex === idx ? 'text-amber-400' : 'text-white/40'}`} />
                  </div>
                  <div className="text-sm font-bold truncate w-full text-left">{track.title}</div>
                  <div className="text-xs text-white/50 truncate w-full text-left">{track.artist}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
