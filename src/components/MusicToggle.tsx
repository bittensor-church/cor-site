import { useRef, useState, useCallback, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { SocialIconRow } from './SocialIcons'

const FADE_MS = 800

interface MusicToggleProps {
  progress?: number
}

export function MusicToggle({ progress = 0 }: MusicToggleProps) {
  const showSocial = progress < 0.05 || progress > 0.97
  const audioRef = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)
  const [started, setStarted] = useState(false)
  const fadeRef = useRef<number | null>(null)

  const fadeAudio = useCallback((target: number, onDone?: () => void) => {
    const audio = audioRef.current
    if (!audio) return

    if (fadeRef.current !== null) cancelAnimationFrame(fadeRef.current)

    const startVol = audio.volume
    const startTime = performance.now()

    const tick = (now: number) => {
      const elapsed = now - startTime
      const t = Math.min(1, elapsed / FADE_MS)
      audio.volume = Math.max(0, Math.min(1, startVol + (target - startVol) * t))

      if (t < 1) {
        fadeRef.current = requestAnimationFrame(tick)
      } else {
        fadeRef.current = null
        audio.volume = target
        onDone?.()
      }
    }

    fadeRef.current = requestAnimationFrame(tick)
  }, [])

  const toggle = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return

    if (!started) {
      audio.volume = 0
      audio.play().catch(() => {})
      fadeAudio(0.35)
      setStarted(true)
      setPlaying(true)
    } else if (playing) {
      fadeAudio(0, () => { audio.pause() })
      setPlaying(false)
    } else {
      audio.play().catch(() => {})
      fadeAudio(0.35)
      setPlaying(true)
    }
  }, [started, playing, fadeAudio])

  useEffect(() => {
    return () => {
      if (fadeRef.current !== null) cancelAnimationFrame(fadeRef.current)
    }
  }, [])

  return createPortal(
    <>
      <audio
        ref={audioRef}
        src="/assets/audio/bg-music.mp3"
        loop
        preload="auto"
      />
      <div style={{
        position: 'fixed',
        bottom: 'clamp(16px, 3vh, 32px)',
        right: 'clamp(16px, 3vw, 32px)',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: 8,
      }}>
      {/* Social icons — hidden during overlay sections */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 6,
        opacity: showSocial ? 1 : 0,
        transition: 'opacity 0.4s ease',
        pointerEvents: showSocial ? 'auto' : 'none',
      }}>
        <span style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: 'clamp(8px, 0.9vw, 11px)',
          letterSpacing: 2,
          textTransform: 'uppercase',
          color: 'rgba(255, 255, 255, 0.6)',
        }}>
          Follow us
        </span>
        <SocialIconRow
          size={16}
          gap="4px"
          iconColor="rgba(255, 255, 255, 0.4)"
          showBorder={false}
        />
      </div>
      {/* Music button */}
      <button
        aria-label={playing ? 'Wycisz muzykę' : 'Włącz muzykę'}
        onClick={toggle}
        style={{
          background: 'rgba(0, 0, 0, 0.4)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          borderRadius: 8,
          padding: 'clamp(10px, 1.5vh, 14px) clamp(12px, 2vw, 16px)',
          minHeight: 44,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          backdropFilter: 'blur(8px)',
          transition: 'background 0.3s ease, border-color 0.3s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(0, 0, 0, 0.6)'
          e.currentTarget.style.borderColor = 'rgba(212, 168, 67, 0.4)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(0, 0, 0, 0.4)'
          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)'
        }}
      >
        {/* Speaker icon */}
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke={playing ? '#d4a843' : 'rgba(255,255,255,0.5)'}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ transition: 'stroke 0.3s ease' }}
        >
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          {playing ? (
            <>
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
            </>
          ) : (
            <>
              <line x1="23" y1="9" x2="17" y2="15" />
              <line x1="17" y1="9" x2="23" y2="15" />
            </>
          )}
        </svg>
        <span style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: 'clamp(10px, 1.1vw, 13px)',
          letterSpacing: 1,
          textTransform: 'uppercase',
          color: playing ? '#d4a843' : 'rgba(255,255,255,0.5)',
          transition: 'color 0.3s ease',
        }}>
          {playing ? 'on' : 'off'}
        </span>
      </button>
      </div>
    </>,
    document.body,
  )
}
