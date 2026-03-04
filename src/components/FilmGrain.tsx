import { useEffect, useRef } from 'react'

const GRAIN_SIZE = 100
const IS_MOBILE = typeof window !== 'undefined' && window.innerWidth < 768
const FPS = IS_MOBILE ? 12 : 24

export function FilmGrain() {
  if (IS_MOBILE) return null

  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    canvas.width = GRAIN_SIZE
    canvas.height = GRAIN_SIZE
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const imageData = ctx.createImageData(GRAIN_SIZE, GRAIN_SIZE)
    const pixels = imageData.data
    let frameId: number

    const render = () => {
      for (let i = 0; i < pixels.length; i += 4) {
        const v = Math.random() * 255
        pixels[i] = v
        pixels[i + 1] = v
        pixels[i + 2] = v
        pixels[i + 3] = 18
      }
      ctx.putImageData(imageData, 0, 0)
    }

    let last = 0
    const interval = 1000 / FPS

    const tick = (now: number) => {
      frameId = requestAnimationFrame(tick)
      if (now - last < interval) return
      last = now
      render()
    }

    frameId = requestAnimationFrame(tick)

    return () => cancelAnimationFrame(frameId)
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 100,
        opacity: 0.45,
        mixBlendMode: 'overlay',
        imageRendering: 'pixelated',
      }}
    />
  )
}
