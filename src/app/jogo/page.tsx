'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Home, RotateCcw, Trophy } from 'lucide-react'
import Link from 'next/link'

export default function JogoPage() {
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [playerY, setPlayerY] = useState(250)
  const [obstacles, setObstacles] = useState<{ x: number; y: number; type: 'good' | 'bad' }[]>([])
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const saved = localStorage.getItem('sofia-highscore')
    if (saved) setHighScore(parseInt(saved))
  }, [])

  useEffect(() => {
    if (!isPlaying || gameOver) return

    const interval = setInterval(() => {
      setObstacles(prev => {
        const newObstacles = prev
          .map(obs => ({ ...obs, x: obs.x - 5 }))
          .filter(obs => obs.x > -50)

        if (Math.random() < 0.02) {
          newObstacles.push({
            x: 800,
            y: Math.random() * 400 + 50,
            type: Math.random() < 0.7 ? 'good' : 'bad',
          })
        }

        return newObstacles
      })
    }, 50)

    return () => clearInterval(interval)
  }, [isPlaying, gameOver])

  useEffect(() => {
    if (!isPlaying || gameOver) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, 800, 600)

    // Draw Sofia (turtle)
    ctx.fillStyle = '#4ECDC4'
    ctx.beginPath()
    ctx.arc(100, playerY, 25, 0, Math.PI * 2)
    ctx.fill()

    // Draw shell
    ctx.fillStyle = '#95E1D3'
    ctx.beginPath()
    ctx.arc(100, playerY - 10, 15, 0, Math.PI * 2)
    ctx.fill()

    // Draw obstacles
    obstacles.forEach(obs => {
      ctx.fillStyle = obs.type === 'good' ? '#FFD700' : '#FF6B6B'
      ctx.beginPath()
      ctx.arc(obs.x, obs.y, 20, 0, Math.PI * 2)
      ctx.fill()

      // Check collision
      const distance = Math.sqrt((obs.x - 100) ** 2 + (obs.y - playerY) ** 2)
      if (distance < 40) {
        if (obs.type === 'good') {
          setScore(s => s + 10)
          setObstacles(prev => prev.filter(o => o !== obs))
        } else {
          setGameOver(true)
          if (score > highScore) {
            setHighScore(score)
            localStorage.setItem('sofia-highscore', score.toString())
          }
        }
      }
    })

    // Draw background
    ctx.fillStyle = '#E8F5E9'
    ctx.fillRect(0, 0, 800, 600)
  }, [obstacles, playerY, isPlaying, gameOver, score, highScore])

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return

    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top
    setPlayerY(Math.max(30, Math.min(570, y)))
  }

  const startGame = () => {
    setIsPlaying(true)
    setGameOver(false)
    setScore(0)
    setObstacles([])
    setPlayerY(250)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <Link href="/" className="flex items-center gap-2 text-primary hover:text-primary/80">
              <Home className="w-5 h-5" />
              <span className="font-semibold">Voltar</span>
            </Link>
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900">A Ilha Mágica de Sofia 🐢</h1>
              <p className="text-gray-600">Colete ingredientes, evite obstáculos!</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">High Score</div>
              <div className="text-2xl font-bold text-accent">{highScore}</div>
            </div>
          </div>

          {/* Score */}
          <div className="text-center mb-4">
            <div className="text-4xl font-bold text-primary">{score}</div>
            <div className="text-sm text-gray-600">Pontos</div>
          </div>

          {/* Game Canvas */}
          <div className="relative">
            <canvas
              ref={canvasRef}
              width={800}
              height={600}
              onMouseMove={isPlaying && !gameOver ? handleMove : undefined}
              onTouchMove={isPlaying && !gameOver ? handleMove : undefined}
              className="w-full border-4 border-primary rounded-xl cursor-none bg-gradient-to-b from-sky-200 to-green-200"
            />

            {/* Start/Game Over Overlay */}
            {(!isPlaying || gameOver) && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-xl"
              >
                <div className="text-center text-white p-8">
                  {gameOver ? (
                    <>
                      <h2 className="text-4xl font-bold mb-4">Fim de Jogo! 🎮</h2>
                      <div className="text-6xl font-bold mb-4">{score}</div>
                      <div className="text-xl mb-6">
                        {score > highScore && '🎉 Novo Recorde! 🎉'}
                        {score === highScore && 'Igualou o recorde!'}
                        {score < highScore && `Recorde: ${highScore}`}
                      </div>
                    </>
                  ) : (
                    <>
                      <h2 className="text-4xl font-bold mb-4">Pronto para jogar? 🐢</h2>
                      <p className="text-xl mb-6">Mova o mouse/dedo para controlar Sofia!</p>
                      <p className="text-lg mb-6">
                        🟡 Colete ingredientes dourados (+10pts)<br />
                        🔴 Evite obstáculos vermelhos!
                      </p>
                    </>
                  )}

                  <button
                    onClick={startGame}
                    className="bg-gradient-to-r from-primary to-accent text-white px-8 py-4 rounded-full text-xl font-bold hover:scale-105 transition-transform flex items-center gap-2 mx-auto"
                  >
                    {gameOver ? <RotateCcw className="w-6 h-6" /> : <Trophy className="w-6 h-6" />}
                    {gameOver ? 'Jogar Novamente' : 'Começar Jogo'}
                  </button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Instructions */}
          <div className="mt-6 grid grid-cols-2 gap-4 text-sm text-gray-600">
            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="font-bold text-yellow-800 mb-2">🟡 Ingredientes</div>
              <div>Colete os círculos dourados para ganhar pontos!</div>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <div className="font-bold text-red-800 mb-2">🔴 Obstáculos</div>
              <div>Evite os círculos vermelhos ou perde!</div>
            </div>
          </div>

          {/* Rewards */}
          {score >= 100 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="mt-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white p-6 rounded-xl text-center"
            >
              <div className="text-2xl font-bold mb-2">🎉 Parabéns! 🎉</div>
              <div>Você ganhou um cupom de 5% de desconto!</div>
              <div className="text-sm mt-2 opacity-90">Mostre esta tela ao garçom</div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
