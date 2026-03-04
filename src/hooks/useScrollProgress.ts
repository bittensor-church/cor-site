import { useCallback, useEffect, useRef, useState } from 'react'

interface ScrollData {
  progress: number
  sectionIndex: number
  sectionProgress: number
}

interface ScrollState extends ScrollData {
  setProgress: (p: number) => void
}

export function useScrollProgress(sectionCount: number): ScrollState {
  const [state, setState] = useState<ScrollData>({
    progress: 0,
    sectionIndex: 0,
    sectionProgress: 0,
  })

  const targetRef = useRef(0)
  const currentRef = useRef(0)
  const rafRef = useRef(0)
  const lastTouchYRef = useRef(0)

  const setProgress = useCallback((p: number) => {
    targetRef.current = Math.max(0, Math.min(1, p))
  }, [])

  useEffect(() => {
    const scrollSpeed = 0.0003
    const smoothing = 0.07
    const maxDelta = 60

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()
      const clamped = Math.max(-maxDelta, Math.min(maxDelta, e.deltaY))
      targetRef.current += clamped * scrollSpeed
      targetRef.current = Math.max(0, Math.min(1, targetRef.current))
    }

    const handleTouchStart = (e: TouchEvent) => {
      lastTouchYRef.current = e.touches[0].clientY
    }

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault()
      const currentY = e.touches[0].clientY
      const delta = lastTouchYRef.current - currentY
      lastTouchYRef.current = currentY
      const clamped = Math.max(-maxDelta, Math.min(maxDelta, delta))
      targetRef.current += clamped * scrollSpeed * 1.5
      targetRef.current = Math.max(0, Math.min(1, targetRef.current))
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      const step = 0.02
      switch (e.key) {
        case 'ArrowDown':
        case 'PageDown':
        case ' ':
          e.preventDefault()
          targetRef.current = Math.min(1, targetRef.current + step)
          break
        case 'ArrowUp':
        case 'PageUp':
          e.preventDefault()
          targetRef.current = Math.max(0, targetRef.current - step)
          break
        case 'Home':
          e.preventDefault()
          targetRef.current = 0
          break
        case 'End':
          e.preventDefault()
          targetRef.current = 1
          break
      }
    }

    const animate = () => {
      rafRef.current = requestAnimationFrame(animate)

      const prev = currentRef.current
      currentRef.current += (targetRef.current - currentRef.current) * smoothing

      if (Math.abs(currentRef.current - prev) > 0.0001) {
        const p = currentRef.current
        const rawIndex = p * sectionCount
        const sectionIndex = Math.min(sectionCount - 1, Math.floor(rawIndex))
        const sectionProgress = rawIndex - sectionIndex

        setState({
          progress: p,
          sectionIndex,
          sectionProgress: Math.min(1, sectionProgress),
        })
      }
    }

    document.addEventListener('wheel', handleWheel, { passive: false })
    document.addEventListener('touchstart', handleTouchStart, { passive: true })
    document.addEventListener('touchmove', handleTouchMove, { passive: false })
    document.addEventListener('keydown', handleKeyDown)
    rafRef.current = requestAnimationFrame(animate)

    return () => {
      document.removeEventListener('wheel', handleWheel)
      document.removeEventListener('touchstart', handleTouchStart)
      document.removeEventListener('touchmove', handleTouchMove)
      document.removeEventListener('keydown', handleKeyDown)
      cancelAnimationFrame(rafRef.current)
    }
  }, [sectionCount])

  return { ...state, setProgress }
}
