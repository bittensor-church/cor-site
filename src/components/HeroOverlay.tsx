interface HeroOverlayProps {
  progress: number
}

const ENTER = 0.01    // frame ~20
const EXIT = 0.092    // frame ~185
const TOTAL = EXIT - ENTER

// Timing within the section (0-1 normalized)
const SUBTITLE_IN = 0.2
const SUBTITLE_FULL = 0.35
const BODY_IN = 0.4
const BODY_FULL = 0.55
const FADE_OUT_START = 0.8

function calcOpacity(localProgress: number, inStart: number, inEnd: number): number {
  if (localProgress < inStart) return 0
  if (localProgress < inEnd) return (localProgress - inStart) / (inEnd - inStart)
  if (localProgress < FADE_OUT_START) return 1
  return Math.max(0, 1 - (localProgress - FADE_OUT_START) / (1 - FADE_OUT_START))
}

function calcTranslateY(localProgress: number, inStart: number, inEnd: number): number {
  if (localProgress < inStart) return 12
  if (localProgress < inEnd) {
    const t = (localProgress - inStart) / (inEnd - inStart)
    return 12 * (1 - t)
  }
  if (localProgress < FADE_OUT_START) return 0
  const t = (localProgress - FADE_OUT_START) / (1 - FADE_OUT_START)
  return -12 * t
}

export function HeroOverlay({ progress }: HeroOverlayProps) {
  if (progress < ENTER || progress > EXIT) return null

  const local = (progress - ENTER) / TOTAL

  const subtitleOpacity = calcOpacity(local, SUBTITLE_IN, SUBTITLE_FULL)
  const subtitleY = calcTranslateY(local, SUBTITLE_IN, SUBTITLE_FULL)

  const bodyOpacity = calcOpacity(local, BODY_IN, BODY_FULL)
  const bodyY = calcTranslateY(local, BODY_IN, BODY_FULL)

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
      {/* INDEPENDENT BUILDERS subtitle */}
      <div style={{
        opacity: subtitleOpacity,
        transform: `translateY(${subtitleY}px)`,
        fontFamily: "'IBM Plex Mono', monospace",
        fontWeight: 500,
        fontSize: 'clamp(9px, 1.3vw, 16px)',
        color: '#d4a843',
        letterSpacing: 'clamp(3px, 0.5vw, 7px)',
        textTransform: 'uppercase',
        textAlign: 'center',
        borderBottom: '1px solid rgba(212, 168, 67, 0.5)',
        paddingBottom: 'clamp(8px, 1.5vh, 16px)',
        marginBottom: 'clamp(20px, 4vh, 48px)',
        textShadow: '0 2px 12px rgba(0,0,0,0.6)',
        willChange: 'opacity, transform',
      }}>
        Independent builders of the Bittensor infrastructure
      </div>

      {/* Body text */}
      <div style={{
        opacity: bodyOpacity,
        transform: `translateY(${bodyY}px)`,
        fontFamily: "'IBM Plex Mono', monospace",
        fontWeight: 400,
        fontSize: 'clamp(12px, 1.6vw, 20px)',
        color: 'rgba(255, 255, 255, 0.85)',
        letterSpacing: 'clamp(1px, 0.15vw, 2px)',
        lineHeight: 1.7,
        textAlign: 'center',
        maxWidth: '750px',
        textShadow: '0 2px 12px rgba(0,0,0,0.6)',
        willChange: 'opacity, transform',
      }}>
        We are the Church of Rao. An independent team of builders engineering
        the critical tooling, simulations, and smart contracts that power the
        decentralized AI foundry.
      </div>
    </div>
  )
}
