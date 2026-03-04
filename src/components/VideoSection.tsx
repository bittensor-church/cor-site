import { useEffect, useRef, useCallback } from 'react'

interface VideoSectionProps {
  src: string
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
  const loadedRef = useRef(false)

  // Preload frames
  useEffect(() => {
    if (!shouldLoad || loadedRef.current) return
    loadedRef.current = true

    const frames: (HTMLImageElement | null)[] = new Array(frameCount).fill(null)
    framesRef.current = frames

    for (let i = 0; i < frameCount; i++) {
      const img = new Image()
      img.src = `${frameDir}/f_${String(i + 1).padStart(4, '0')}.webp`
      img.onload = () => {
        frames[i] = img
        // Draw first frame once loaded
        if (i === 0 && canvasRef.current) {
          drawFrame(0)
        }
      }
    }
  }, [shouldLoad, frameDir, frameCount])

  const drawFrame = useCallback((index: number) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const frame = framesRef.current[index]
    if (!frame) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

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

  // Handle resize
  useEffect(() => {
    const onResize = () => {
      if (lastFrameRef.current >= 0) {
        drawFrame(lastFrameRef.current)
      }
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [drawFrame])

  // Audio fade
  const fadeAudio = useCallback((targetVolume: number, onComplete?: () => void) => {
    const audio = audioRef.current
    if (!audio) return

    if (fadeIntervalRef.current !== null) {
      clearInterval(fadeIntervalRef.current)
    }

    const startVolume = audio.volume
    const steps = FADE_DURATION / 16
    const volumeStep = (targetVolume - startVolume) / steps
    let step = 0

    fadeIntervalRef.current = window.setInterval(() => {
      step++
      const newVolume = Math.max(0, Math.min(1, startVolume + volumeStep * step))
      audio.volume = newVolume

      if (step >= steps) {
        if (fadeIntervalRef.current !== null) {
          clearInterval(fadeIntervalRef.current)
          fadeIntervalRef.current = null
        }
        audio.volume = targetVolume
        onComplete?.()
      }
    }, 16)
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
        clearInterval(fadeIntervalRef.current)
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
        background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.6) 100%)',
        pointerEvents: 'none',
      }} />

      {/* Text overlays */}
      {active && children}
    </div>
  )
}
