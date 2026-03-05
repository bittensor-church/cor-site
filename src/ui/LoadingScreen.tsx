import { useEffect, useState, useCallback } from 'react'
import { useIsMobile } from '../hooks/useIsMobile'

interface LoadingScreenProps {
  visible: boolean
  onReady: () => void
}

export function LoadingScreen({ visible, onReady }: LoadingScreenProps) {
  const isMobile = useIsMobile()
  const [opacity, setOpacity] = useState(1)
  const [mounted, setMounted] = useState(true)
  const [showPlay, setShowPlay] = useState(false)

  const dismiss = useCallback(() => {
    setOpacity(0)
    onReady()
    setTimeout(() => setMounted(false), 1000)
  }, [onReady])

  useEffect(() => {
    if (isMobile) {
      // On mobile, show play button after brief delay
      const t = setTimeout(() => setShowPlay(true), 600)
      return () => clearTimeout(t)
    }

    // Desktop: auto-dismiss when video ready or timeout
    let done = false
    const finish = () => {
      if (done) return
      done = true
      setTimeout(dismiss, 400)
    }

    const video = document.querySelector('video[src*="intro"]') as HTMLVideoElement | null
    if (video) {
      video.addEventListener('canplay', finish, { once: true })
      video.addEventListener('loadeddata', finish, { once: true })
    }

    const timeout = setTimeout(finish, 4000)

    if (document.readyState === 'complete') {
      setTimeout(finish, 800)
    } else {
      window.addEventListener('load', () => setTimeout(finish, 800), { once: true })
    }

    return () => clearTimeout(timeout)
  }, [dismiss])

  if (!mounted) return null

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
          <button
            aria-label="Rozpocznij"
            onClick={dismiss}
            style={{
              background: 'none',
              border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: '50%',
              width: 80,
              height: 80,
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
        ) : (
          <>
            <div style={{
              fontSize: 'clamp(11px, 1.4vw, 14px)',
              color: 'rgba(255,255,255,0.6)',
              letterSpacing: 6,
              textTransform: 'uppercase',
            }}>
              Loading
            </div>
            <div style={{
              width: 80,
              height: 1,
              background: 'rgba(255,255,255,0.1)',
              margin: '20px auto 0',
              overflow: 'hidden',
              borderRadius: 1,
            }}>
              <div style={{
                width: '30%',
                height: '100%',
                background: 'rgba(255,255,255,0.5)',
                borderRadius: 1,
                animation: 'loadSlide 1.2s ease-in-out infinite',
              }} />
            </div>
          </>
        )}
        <style>{`
          @keyframes loadSlide {
            0% { transform: translateX(-100%); }
            50% { transform: translateX(333%); }
            100% { transform: translateX(-100%); }
          }
        `}</style>
      </div>
    </div>
  )
}
