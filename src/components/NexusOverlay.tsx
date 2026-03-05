interface NexusOverlayProps {
  progress: number
}

const ENTER = 0.8698   // frame 1884
const EXIT = 0.9441    // frame 2045
const TOTAL = EXIT - ENTER

const SHADOW = '0 2px 12px rgba(0,0,0,0.6)'

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

  const labelOp = fadeIn(local, 0.0, 0.1)
  const titleOp = fadeIn(local, 0.08, 0.1)
  const bodyOp = fadeIn(local, 0.18, 0.12)

  const fadeOut = local > 0.82
    ? Math.max(0, 1 - (local - 0.82) / 0.18)
    : 1

  if (fadeOut <= 0) return null

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      pointerEvents: 'none',
      zIndex: 5,
      opacity: fadeOut,
      padding: '0 8%',
    }}>
      <div style={{
        background: 'rgba(0, 0, 0, 0.45)',
        backdropFilter: 'blur(8px)',
        borderRadius: 12,
        padding: 'clamp(20px, 4vh, 40px) clamp(24px, 4vw, 48px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 'clamp(8px, 2vh, 20px)',
        maxWidth: 'clamp(300px, 50vw, 600px)',
        textAlign: 'center' as const,
      }}>
        {/* FIXING THE BOTTLENECK IN 2026 */}
        <div style={{
          ...BASE_FONT,
          opacity: labelOp,
          transform: `translateY(${(1 - labelOp) * 10}px)`,
          fontSize: 'clamp(10px, 1.3vw, 15px)',
          fontWeight: 700,
          color: '#d4a843',
          letterSpacing: 'clamp(4px, 0.8vw, 10px)',
          textTransform: 'uppercase',
          willChange: 'opacity, transform',
        }}>
          Fixing the bottleneck in 2026
        </div>

        {/* NEXUS */}
        <div style={{
          ...BASE_FONT,
          opacity: titleOp,
          transform: `translateY(${(1 - titleOp) * 10}px)`,
          fontSize: 'clamp(28px, 4.5vw, 60px)',
          fontWeight: 700,
          color: '#ffffff',
          letterSpacing: 'clamp(4px, 0.8vw, 12px)',
          textTransform: 'uppercase',
          lineHeight: 1,
          willChange: 'opacity, transform',
        }}>
          Nexus
        </div>

        {/* Body text */}
        <div style={{
          ...BASE_FONT,
          opacity: bodyOp,
          transform: `translateY(${(1 - bodyOp) * 10}px)`,
          fontSize: 'clamp(11px, 1.2vw, 15px)',
          fontWeight: 400,
          color: 'rgba(255, 255, 255, 0.7)',
          lineHeight: 1.7,
          willChange: 'opacity, transform',
        }}>
          Building a subnet today means solving the same infrastructure problems every other team already solved. Nexus eliminates that. It&#39;s a framework that ships weight management, security, observability, and GPU orchestration as defaults — so you only write the code that matters.
        </div>
      </div>
    </div>
  )
}
