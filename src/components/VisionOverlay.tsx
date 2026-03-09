import { fadeIn } from '../utils/animations'
import { BASE_FONT, SHADOW } from '../utils/styles'

interface VisionOverlayProps {
  progress: number
}

const ENTER = 0.7849   // frame 1700
const PHASE2 = 0.8449  // frame 1830 — everything fades except headline
const EXIT = 0.8690    // frame 1882 — clear before Nexus enters at 0.8698
const TOTAL_P1 = PHASE2 - ENTER
const TOTAL_P2 = EXIT - PHASE2

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

  // Headline opacity: always visible once entered, fades out at end of phase2
  const headlineOpacity = inPhase1
    ? fadeIn(local1, 0, 0.1)
    : local2 > 0.8
      ? Math.max(0, 1 - (local2 - 0.8) / 0.2)
      : 1

  if (headlineOpacity <= 0) return null

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
        opacity: Math.max(surroundOpacity, headlineOpacity),
        transition: 'opacity 0.3s ease',
      }}>
      {/* Section label */}
      <div style={{
        ...BASE_FONT,
        opacity: surroundOpacity,
        transform: `translateY(${(1 - surroundOpacity) * 10}px)`,
        fontSize: 'clamp(18px, 2.5vw, 36px)',
        fontWeight: 700,
        color: '#d4a843',
        letterSpacing: 'clamp(4px, 0.8vw, 10px)',
        textTransform: 'uppercase',
        willChange: 'opacity, transform',
      }}>
        Next Chapter
      </div>

      {/* Transparency & Security */}
      <div style={{
        ...BASE_FONT,
        opacity: surroundOpacity,
        transform: `translateY(${(1 - surroundOpacity) * 10}px)`,
        fontSize: 'clamp(12px, 1.5vw, 18px)',
        fontWeight: 400,
        color: 'rgba(255, 255, 255, 0.85)',
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
        color: 'rgba(255, 255, 255, 0.85)',
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
        fontSize: 'clamp(20px, 3.2vw, 44px)',
        fontWeight: 700,
        color: '#d4a843',
        letterSpacing: 'clamp(3px, 0.6vw, 8px)',
        textTransform: 'uppercase',
        textAlign: 'center',
        lineHeight: 1.2,
        marginTop: 'clamp(8px, 2vh, 20px)',
        marginBottom: 'clamp(8px, 2vh, 20px)',
        textShadow: `0 0 20px rgba(212, 168, 67, 0.4), ${SHADOW}`,
        willChange: 'opacity',
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
        color: 'rgba(255, 255, 255, 0.85)',
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
