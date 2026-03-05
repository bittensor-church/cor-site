interface VisionOverlayProps {
  progress: number
}

const ENTER = 0.7849   // frame 1700
const PHASE2 = 0.8449  // frame 1830 — everything fades except headline
const EXIT = 0.9003    // frame 1950
const TOTAL_P1 = PHASE2 - ENTER
const TOTAL_P2 = EXIT - PHASE2

const SHADOW = '0 2px 12px rgba(0,0,0,0.6)'

const BASE_FONT: React.CSSProperties = {
  fontFamily: "'IBM Plex Mono', monospace",
  textShadow: SHADOW,
}

function fadeIn(t: number, start: number, duration: number = 0.15): number {
  if (t < start) return 0
  if (t > start + duration) return 1
  return (t - start) / duration
}

export function VisionOverlay({ progress }: VisionOverlayProps) {
  if (progress < ENTER || progress > EXIT) return null

  // Phase 1: all text visible (f_1700 → f_1830)
  const inPhase1 = progress < PHASE2
  const local1 = inPhase1 ? (progress - ENTER) / TOTAL_P1 : 1

  // Phase 2: only headline stays (f_1830 → f_1950)
  const local2 = !inPhase1 ? (progress - PHASE2) / TOTAL_P2 : 0

  // Surrounding text opacity: fade in during phase1, fade out at PHASE2
  const surroundOpacity = inPhase1
    ? fadeIn(local1, 0, 0.1)
    : Math.max(0, 1 - local2 / 0.15)

  // Headline highlight: ramps up through phase1 scroll
  const highlightT = inPhase1 ? Math.min(1, local1 / 0.8) : 1

  // Headline opacity: always visible once entered, fades out at end of phase2
  const headlineOpacity = inPhase1
    ? fadeIn(local1, 0, 0.1)
    : local2 > 0.8
      ? Math.max(0, 1 - (local2 - 0.8) / 0.2)
      : 1

  if (headlineOpacity <= 0) return null

  // Headline color interpolation: white → gold as it highlights
  const headlineColor = `rgb(${Math.round(255 - highlightT * 43)}, ${Math.round(255 - highlightT * 87)}, ${Math.round(255 - highlightT * 188)})`
  // At highlightT=1: rgb(212, 168, 67) = #d4a843

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      pointerEvents: 'none',
      zIndex: 5,
      padding: '0 8%',
    }}>
      <div style={{
        background: 'rgba(0, 0, 0, 0.45)',
        backdropFilter: 'blur(8px)',
        borderRadius: 12,
        padding: 'clamp(20px, 4vh, 40px) clamp(24px, 4vw, 48px)',
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'center',
        gap: 'clamp(8px, 2vh, 20px)',
      }}>
      {/* Transparency & Security */}
      <div style={{
        ...BASE_FONT,
        opacity: surroundOpacity,
        transform: `translateY(${(1 - surroundOpacity) * 10}px)`,
        fontSize: 'clamp(12px, 1.5vw, 18px)',
        fontWeight: 400,
        color: 'rgba(255, 255, 255, 0.7)',
        letterSpacing: 'clamp(2px, 0.4vw, 6px)',
        textTransform: 'uppercase',
        willChange: 'opacity, transform',
      }}>
        Transparency & Security
      </div>

      {/* Onchain Intelligence */}
      <div style={{
        ...BASE_FONT,
        opacity: surroundOpacity,
        transform: `translateY(${(1 - surroundOpacity) * 10}px)`,
        fontSize: 'clamp(12px, 1.5vw, 18px)',
        fontWeight: 400,
        color: 'rgba(255, 255, 255, 0.7)',
        letterSpacing: 'clamp(2px, 0.4vw, 6px)',
        textTransform: 'uppercase',
        willChange: 'opacity, transform',
      }}>
        Onchain Intelligence
      </div>

      {/* MORE CAPABLE SUBNETS FASTER — highlights during scroll */}
      <div style={{
        ...BASE_FONT,
        opacity: headlineOpacity,
        fontSize: 'clamp(24px, 4vw, 56px)',
        fontWeight: 700,
        color: headlineColor,
        letterSpacing: 'clamp(3px, 0.6vw, 8px)',
        textTransform: 'uppercase',
        textAlign: 'center',
        lineHeight: 1.2,
        marginTop: 'clamp(8px, 2vh, 20px)',
        marginBottom: 'clamp(8px, 2vh, 20px)',
        textShadow: highlightT > 0.5
          ? `0 0 ${20 * highlightT}px rgba(212, 168, 67, ${0.4 * highlightT}), ${SHADOW}`
          : SHADOW,
        willChange: 'opacity, color, text-shadow',
      }}>
        More capable subnets faster
      </div>

      {/* Smart contract integration */}
      <div style={{
        ...BASE_FONT,
        opacity: surroundOpacity,
        transform: `translateY(${(1 - surroundOpacity) * -10}px)`,
        fontSize: 'clamp(12px, 1.5vw, 18px)',
        fontWeight: 400,
        color: 'rgba(255, 255, 255, 0.7)',
        letterSpacing: 'clamp(2px, 0.4vw, 6px)',
        textTransform: 'uppercase',
        willChange: 'opacity, transform',
      }}>
        Smart contract integration
      </div>
      </div>
    </div>
  )
}
