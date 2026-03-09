import { fadeIn } from '../utils/animations'

interface AchievementOverlayProps {
  progress: number
}

const ENTER = 0.4617   // frame 1000
const EXIT = 0.5125    // frame 1110
const TOTAL = EXIT - ENTER
const FADE_OUT_START = 0.88

export function AchievementOverlay({ progress }: AchievementOverlayProps) {
  if (progress < ENTER || progress > EXIT) return null

  const local = (progress - ENTER) / TOTAL

  const globalFadeOut = local > FADE_OUT_START
    ? Math.max(0, 1 - (local - FADE_OUT_START) / (1 - FADE_OUT_START))
    : 1

  const labelOpacity = fadeIn(local, 0.0, 0.06)
  const titleOpacity = fadeIn(local, 0.12, 0.06)
  const bodyOpacity = fadeIn(local, 0.35, 0.06)

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      pointerEvents: 'none',
      zIndex: 5,
      paddingLeft: '8%',
      paddingRight: '8%',
      opacity: globalFadeOut,
    }}>
      <div style={{
        maxWidth: '700px',
        background: 'rgba(0, 0, 0, 0.45)',
        backdropFilter: 'blur(8px)',
        borderRadius: 12,
        padding: 'clamp(20px, 4vh, 40px) clamp(24px, 4vw, 48px)',
        opacity: labelOpacity,
        transition: 'opacity 0.3s ease',
      }}>
        {/* Section label */}
        <div style={{
          opacity: labelOpacity,
          transform: `translateY(${(1 - labelOpacity) * 10}px)`,
          fontFamily: "'IBM Plex Mono', monospace",
          fontWeight: 700,
          fontSize: 'clamp(10px, 1.3vw, 17px)',
          color: '#d4a843',
          letterSpacing: 'clamp(4px, 0.8vw, 10px)',
          textTransform: 'uppercase',
          textShadow: '0 2px 12px rgba(0,0,0,0.6)',
          marginBottom: 'clamp(16px, 3vh, 32px)',
          willChange: 'opacity, transform',
        }}>
          Biggest 2025 Achievement
        </div>

        {/* Title */}
        <div style={{
          opacity: titleOpacity,
          transform: `translateY(${(1 - titleOpacity) * 12}px)`,
          fontFamily: "'IBM Plex Mono', monospace",
          fontWeight: 500,
          fontSize: 'clamp(22px, 3.2vw, 42px)',
          color: '#ffffff',
          letterSpacing: 'clamp(2px, 0.3vw, 4px)',
          lineHeight: 1.3,
          textShadow: '0 2px 12px rgba(0,0,0,0.6)',
          marginBottom: 'clamp(24px, 4vh, 48px)',
          willChange: 'opacity, transform',
        }}>
          The weight copying war. We won.
        </div>

        {/* Body */}
        <div style={{
          opacity: bodyOpacity,
          transform: `translateY(${(1 - bodyOpacity) * 10}px)`,
          fontFamily: "'IBM Plex Mono', monospace",
          fontWeight: 400,
          fontSize: 'clamp(12px, 1.5vw, 18px)',
          color: 'rgba(255, 255, 255, 0.85)',
          letterSpacing: 'clamp(0.5px, 0.1vw, 1.5px)',
          lineHeight: 1.7,
          textShadow: '0 2px 12px rgba(0,0,0,0.6)',
          willChange: 'opacity, transform',
        }}>
          We built the weapons, spreaded awareness and offered guidance. Step by step the weight-copying stopped being a discussion point. Still, Liquid Alpha 2.1 is ready to be unleashed.
        </div>
      </div>
    </div>
  )
}
