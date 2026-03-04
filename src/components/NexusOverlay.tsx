interface NexusOverlayProps {
  progress: number
}

const ENTER = 0.8698   // frame 1884
const EXIT = 0.9441    // frame 2045
const TOTAL = EXIT - ENTER

const SHADOW = '0 1px 8px rgba(0,0,0,0.7)'

const BASE_FONT: React.CSSProperties = {
  fontFamily: "'IBM Plex Mono', monospace",
  textShadow: SHADOW,
}

function fadeIn(t: number, start: number, duration: number = 0.12): number {
  if (t < start) return 0
  if (t > start + duration) return 1
  return (t - start) / duration
}

export function NexusOverlay({ progress }: NexusOverlayProps) {
  if (progress < ENTER || progress > EXIT) return null

  const local = (progress - ENTER) / TOTAL

  // Fade in elements with stagger
  const labelOp = fadeIn(local, 0.0, 0.1)
  const titleOp = fadeIn(local, 0.08, 0.1)
  const bodyOp = fadeIn(local, 0.18, 0.12)

  // Fade out everything at the end
  const fadeOut = local > 0.82
    ? Math.max(0, 1 - (local - 0.82) / 0.18)
    : 1

  const globalOp = fadeOut
  if (globalOp <= 0) return null

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      pointerEvents: 'none',
      zIndex: 5,
      opacity: globalOp,
    }}>
      {/* Book page container — centered, sized to match open book pages */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 'clamp(6px, 1.5vh, 16px)',
        maxWidth: 'clamp(280px, 42vw, 520px)',
        padding: 'clamp(16px, 3vh, 40px) clamp(12px, 2vw, 32px)',
        textAlign: 'center',
      }}>
        {/* FIXING THE BOTTLENECK IN 2026 */}
        <div style={{
          ...BASE_FONT,
          opacity: labelOp,
          transform: `translateY(${(1 - labelOp) * 8}px)`,
          fontSize: 'clamp(8px, 1vw, 12px)',
          fontWeight: 500,
          color: 'rgba(180, 160, 120, 0.9)',
          letterSpacing: 'clamp(2px, 0.4vw, 5px)',
          textTransform: 'uppercase',
          textShadow: '0 1px 4px rgba(0,0,0,0.5)',
          willChange: 'opacity, transform',
        }}>
          Fixing the bottleneck in 2026
        </div>

        {/* NEXUS */}
        <div style={{
          ...BASE_FONT,
          opacity: titleOp,
          transform: `translateY(${(1 - titleOp) * 8}px)`,
          fontSize: 'clamp(28px, 4.5vw, 56px)',
          fontWeight: 700,
          color: '#d4a843',
          letterSpacing: 'clamp(4px, 0.8vw, 10px)',
          textTransform: 'uppercase',
          lineHeight: 1,
          textShadow: '0 2px 12px rgba(0,0,0,0.6), 0 0 20px rgba(212, 168, 67, 0.3)',
          willChange: 'opacity, transform',
          marginBottom: 'clamp(4px, 1vh, 12px)',
        }}>
          Nexus
        </div>

        {/* Body text — styled to look like it belongs on the book page */}
        <div style={{
          ...BASE_FONT,
          opacity: bodyOp,
          transform: `translateY(${(1 - bodyOp) * 8}px)`,
          fontSize: 'clamp(9px, 1.15vw, 14px)',
          fontWeight: 400,
          color: 'rgba(220, 210, 185, 0.9)',
          letterSpacing: 'clamp(0.3px, 0.05vw, 0.8px)',
          lineHeight: 1.7,
          textShadow: '0 1px 6px rgba(0,0,0,0.5)',
          willChange: 'opacity, transform',
        }}>
          Building a subnet today means solving the same infrastructure problems every other team already solved. Nexus eliminates that. It's a framework that ships weight management, security, observability, and GPU orchestration as defaults — so you only write the code that matters.
        </div>
      </div>
    </div>
  )
}
