"use client"

import { useEffect, useRef } from "react"

interface Particle {
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  life: number
  maxLife: number
  hue: number
}

export function CursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const mouseRef = useRef({ x: 0, y: 0 })
  const animationFrameRef = useRef<number>()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Canvas boyutunu ayarla
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Mouse hareketini takip et
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }

      // Her mouse hareketi için yeni partiküller oluştur
      for (let i = 0; i < 3; i++) {
        const angle = Math.random() * Math.PI * 2
        const speed = Math.random() * 3 + 1
        const size = Math.random() * 4 + 2

        particlesRef.current.push({
          x: e.clientX,
          y: e.clientY,
          size: size,
          speedX: Math.cos(angle) * speed,
          speedY: Math.sin(angle) * speed,
          life: 1,
          maxLife: Math.random() * 40 + 40,
          hue: Math.random() * 20, // Kırmızı tonları için 0-20 arası
        })
      }
    }

    window.addEventListener("mousemove", handleMouseMove)

    // Animasyon döngüsü
    const animate = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.1)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Partikülleri güncelle ve çiz
      particlesRef.current = particlesRef.current.filter((particle) => {
        particle.x += particle.speedX
        particle.y += particle.speedY
        particle.speedY += 0.1 // Yerçekimi efekti
        particle.life++

        const alpha = 1 - particle.life / particle.maxLife

        if (particle.life < particle.maxLife) {
          // Patlangaç efekti için gradient
          const gradient = ctx.createRadialGradient(particle.x, particle.y, 0, particle.x, particle.y, particle.size)
          gradient.addColorStop(0, `hsla(${particle.hue}, 100%, 60%, ${alpha})`)
          gradient.addColorStop(0.5, `hsla(${particle.hue}, 100%, 50%, ${alpha * 0.5})`)
          gradient.addColorStop(1, `hsla(${particle.hue}, 100%, 40%, 0)`)

          ctx.fillStyle = gradient
          ctx.beginPath()
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
          ctx.fill()

          // Parlama efekti
          ctx.shadowBlur = 15
          ctx.shadowColor = `hsl(${particle.hue}, 100%, 50%)`
          ctx.fillStyle = `hsla(${particle.hue}, 100%, 70%, ${alpha * 0.8})`
          ctx.beginPath()
          ctx.arc(particle.x, particle.y, particle.size * 0.5, 0, Math.PI * 2)
          ctx.fill()
          ctx.shadowBlur = 0

          return true
        }
        return false
      })

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      window.removeEventListener("mousemove", handleMouseMove)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [])

  return (
    <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-50" style={{ mixBlendMode: "screen" }} />
  )
}
