import { useEffect, useState, useCallback, useRef } from 'react'
import { useIsMobile } from '../hooks/useIsMobile'

interface LoadingScreenProps {
  visible: boolean
  onReady: () => void
  loadProgress: number
  framesReady: boolean
}

const MAX_WAIT = 8000
const MIN_DISPLAY = 400

export function LoadingScreen({ visible, onReady, loadProgress, framesReady }: LoadingScreenProps) {
  const isMobile = useIsMobile()
  const [opacity, setOpacity] = useState(1)
  const [mounted, setMounted] = useState(true)
  const [showPlay, setShowPlay] = useState(false)
  const dismissedRef = useRef(false)

  const dismiss = useCallback(() => {
    if (dismissedRef.current) return
    dismissedRef.current = true
    setOpacity(0)
    onReady()
    setTimeout(() => setMounted(false), 1000)
  }, [onReady])

  // Desktop: auto-dismiss when sparse frames ready (or timeout)
  useEffect(() => {
    if (isMobile) return

    if (framesReady) {
      const t = setTimeout(dismiss, MIN_DISPLAY)
      return () => clearTimeout(t)
    }

    // Safety timeout — don't block forever on slow connections
    const timeout = setTimeout(dismiss, MAX_WAIT)
    return () => clearTimeout(timeout)
  }, [isMobile, framesReady, dismiss])

  // Mobile: show play button when frames ready (or timeout)
  useEffect(() => {
    if (!isMobile) return

    if (framesReady) {
      const t = setTimeout(() => setShowPlay(true), 200)
      return () => clearTimeout(t)
    }

    const timeout = setTimeout(() => setShowPlay(true), MAX_WAIT)
    return () => clearTimeout(timeout)
  }, [isMobile, framesReady])

  if (!mounted) return null

  const percent = Math.round(loadProgress * 100)

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      zIndex: 200,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#0a0a0a',
      fontFamily: "'IBM Plex Mono', monospace",
      opacity,
      transition: 'opacity 1s ease-out',
      pointerEvents: visible ? 'auto' : 'none',
    }}>
      <div style={{ textAlign: 'center' }}>
        {showPlay ? (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 'clamp(12px, 3vw, 20px)',
          }}>
            <div style={{
              fontSize: 'clamp(11px, 1.4vw, 14px)',
              color: 'rgba(255,255,255,0.5)',
              letterSpacing: 4,
              textTransform: 'uppercase',
            }}>
              Tap to explore
            </div>
            <button
              aria-label="Rozpocznij"
              onClick={dismiss}
              style={{
                background: 'none',
                border: '1px solid rgba(255,255,255,0.3)',
                borderRadius: '50%',
                width: 'clamp(64px, 12vw, 80px)',
                height: 'clamp(64px, 12vw, 80px)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'border-color 0.3s',
              }}
            >
              <svg width="28" height="32" viewBox="0 0 28 32" fill="none">
                <path d="M2 1.5L26 16L2 30.5V1.5Z" fill="rgba(255,255,255,0.8)" stroke="none" />
              </svg>
            </button>
            <div style={{
              fontSize: 'clamp(9px, 1.2vw, 12px)',
              color: 'rgba(255,255,255,0.35)',
              letterSpacing: 2,
            }}>
              Church of Rao
            </div>
          </div>
        ) : (
          <>
            <div style={{
              fontSize: 'clamp(11px, 1.4vw, 14px)',
              color: 'rgba(255,255,255,0.6)',
              letterSpacing: 6,
              textTransform: 'uppercase',
              marginBottom: 20,
            }}>
              Loading
            </div>
            <div style={{
              width: 120,
              height: 1,
              background: 'rgba(255,255,255,0.1)',
              margin: '0 auto',
              overflow: 'hidden',
              borderRadius: 1,
            }}>
              <div style={{
                width: `${percent}%`,
                height: '100%',
                background: 'rgba(255,255,255,0.5)',
                borderRadius: 1,
                transition: 'width 0.15s ease-out',
              }} />
            </div>
            <div style={{
              fontSize: 'clamp(9px, 1vw, 11px)',
              color: 'rgba(255,255,255,0.3)',
              marginTop: 12,
              letterSpacing: 2,
            }}>
              {percent}%
            </div>
          </>
        )}
      </div>
    </div>
  )
}
