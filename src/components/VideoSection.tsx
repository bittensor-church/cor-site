import { useEffect, useRef, useCallback } from 'react'

interface VideoSectionProps {
  frameDir: string
  frameCount: number
  audioSrc?: string
  active: boolean
  shouldLoad: boolean
  sectionProgress: number
  children?: React.ReactNode
}

const FADE_DURATION = 800

export function VideoSection({ frameDir, frameCount, audioSrc, active, shouldLoad, sectionProgress, children }: VideoSectionProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  const framesRef = useRef<(HTMLImageElement | null)[]>([])
  const lastFrameRef = useRef(-1)
  const fadeIntervalRef = useRef<number | null>(null)

  const LOAD_WINDOW = 150

  const drawFrame = useCallback((index: number) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const frame = framesRef.current[index]
    if (!frame) return

    const ctx = canvas.getContext('2d', { alpha: false })
    if (!ctx) return
    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = 'high'

    // Resize canvas to match container
    const rect = canvas.getBoundingClientRect()
    const dpr = Math.min(window.devicePixelRatio, 2)
    const w = rect.width * dpr
    const h = rect.height * dpr

    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w
      canvas.height = h
    }

    // Cover fit (like objectFit: 'cover')
    const imgRatio = frame.width / frame.height
    const canvasRatio = w / h

    let drawW: number, drawH: number, drawX: number, drawY: number
    if (imgRatio > canvasRatio) {
      drawH = h
      drawW = h * imgRatio
      drawX = (w - drawW) / 2
      drawY = 0
    } else {
      drawW = w
      drawH = w / imgRatio
      drawX = 0
      drawY = (h - drawH) / 2
    }

    ctx.drawImage(frame, drawX, drawY, drawW, drawH)
  }, [])

  // Windowed frame loading — load ±LOAD_WINDOW frames around current position
  useEffect(() => {
    if (!shouldLoad) return

    const currentFrame = Math.min(
      Math.floor(sectionProgress * frameCount),
      frameCount - 1
    )

    const start = Math.max(0, currentFrame - LOAD_WINDOW)
    const end = Math.min(frameCount - 1, currentFrame + LOAD_WINDOW)

    if (framesRef.current.length === 0) {
      framesRef.current = new Array(frameCount).fill(null)
    }

    for (let i = start; i <= end; i++) {
      if (framesRef.current[i] !== null) continue

      const img = new Image()
      img.src = `${frameDir}/f_${String(i + 1).padStart(4, '0')}.webp`
      const frameIndex = i
      img.onload = () => {
        framesRef.current[frameIndex] = img
        if (frameIndex === currentFrame && canvasRef.current) {
          drawFrame(frameIndex)
        }
      }
    }
  }, [shouldLoad, sectionProgress, frameDir, frameCount, drawFrame])

  // Draw frame on progress change
  useEffect(() => {
    const frameIndex = Math.min(
      Math.floor(sectionProgress * frameCount),
      frameCount - 1
    )

    if (frameIndex === lastFrameRef.current) return
    lastFrameRef.current = frameIndex

    drawFrame(frameIndex)
  }, [sectionProgress, frameCount, drawFrame])

  // Handle resize + DPR change (browser zoom)
  useEffect(() => {
    const onResize = () => {
      if (lastFrameRef.current >= 0) {
        drawFrame(lastFrameRef.current)
      }
    }
    window.addEventListener('resize', onResize)

    // Listen for DPR changes (browser zoom)
    const dprQuery = window.matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`)
    const onDprChange = () => {
      if (lastFrameRef.current >= 0) drawFrame(lastFrameRef.current)
    }
    dprQuery.addEventListener('change', onDprChange)

    return () => {
      window.removeEventListener('resize', onResize)
      dprQuery.removeEventListener('change', onDprChange)
    }
  }, [drawFrame])

  // Audio fade (uses requestAnimationFrame for battery efficiency)
  const fadeAudio = useCallback((targetVolume: number, onComplete?: () => void) => {
    const audio = audioRef.current
    if (!audio) return

    if (fadeIntervalRef.current !== null) {
      cancelAnimationFrame(fadeIntervalRef.current)
    }

    const startVolume = audio.volume
    const startTime = performance.now()

    const tick = (now: number) => {
      const elapsed = now - startTime
      const t = Math.min(1, elapsed / FADE_DURATION)
      audio.volume = Math.max(0, Math.min(1, startVolume + (targetVolume - startVolume) * t))

      if (t < 1) {
        fadeIntervalRef.current = requestAnimationFrame(tick)
      } else {
        fadeIntervalRef.current = null
        audio.volume = targetVolume
        onComplete?.()
      }
    }

    fadeIntervalRef.current = requestAnimationFrame(tick)
  }, [])

  // Audio play/pause
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    if (active) {
      audio.currentTime = 0
      audio.volume = 0
      audio.play().catch(() => {})
      fadeAudio(0.5)
    } else {
      fadeAudio(0, () => {
        audio.pause()
      })
    }

    return () => {
      if (fadeIntervalRef.current !== null) {
        cancelAnimationFrame(fadeIntervalRef.current)
        fadeIntervalRef.current = null
      }
    }
  }, [active, fadeAudio])

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      opacity: active ? 1 : 0,
      transition: 'opacity 0.6s ease-out',
      pointerEvents: active ? 'auto' : 'none',
    }}>
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
        }}
      />

      {audioSrc && shouldLoad && (
        <audio
          ref={audioRef}
          src={audioSrc}
          loop
          preload={active ? 'auto' : 'none'}
        />
      )}

      {/* Vignette overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse 80% 70% at center, transparent 40%, rgba(0,0,0,0.6) 100%)',
        pointerEvents: 'none',
      }} />

      {/* Text overlays */}
      {active && children}
    </div>
  )
}
