interface AchievementOverlayProps {
  progress: number
}

const ENTER = 0.6721   // frame 1355
const EXIT = 0.7445    // frame 1501
const TOTAL = EXIT - ENTER
const FADE_OUT_START = 0.88

function fadeIn(local: number, start: number, duration: number = 0.06): number {
  if (local < start) return 0
  if (local > start + duration) return 1
  return (local - start) / duration
}

export function AchievementOverlay({ progress }: AchievementOverlayProps) {
  if (progress < ENTER || progress > EXIT) return null

  const local = (progress - ENTER) / TOTAL

  const globalFadeOut = local > FADE_OUT_START
    ? Math.max(0, 1 - (local - FADE_OUT_START) / (1 - FADE_OUT_START))
    : 1

  const labelOpacity = fadeIn(local, 0.0)
  const titleOpacity = fadeIn(local, 0.12)
  const bodyOpacity = fadeIn(local, 0.35)

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
      <div style={{ maxWidth: '700px' }}>
        {/* Section label */}
        <div style={{
          opacity: labelOpacity,
          transform: `translateY(${(1 - labelOpacity) * 10}px)`,
          fontFamily: "'IBM Plex Mono', monospace",
          fontWeight: 700,
          fontSize: 'clamp(10px, 1.3vw, 15px)',
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
          <span style={{ color: '#d4a843', fontWeight: 600 }}>WeightCopier</span>
          {' — we built the weapon AND the detection system. Automated weight-setting strategies that exposed the vulnerability, then helped close it.'}
        </div>
      </div>
    </div>
  )
}
