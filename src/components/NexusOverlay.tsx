interface NexusOverlayProps {
  progress: number
}

const ENTER = 0.8698   // frame 1884
const EXIT = 0.9441    // frame 2045
const TOTAL = EXIT - ENTER

const INK_FONT: React.CSSProperties = {
  fontFamily: "'Georgia', 'Times New Roman', serif",
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
      mixBlendMode: 'multiply',
    }}>
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
          ...INK_FONT,
          opacity: labelOp,
          transform: `translateY(${(1 - labelOp) * 8}px)`,
          fontSize: 'clamp(9px, 1.1vw, 13px)',
          fontWeight: 400,
          fontStyle: 'italic',
          color: 'rgb(60, 45, 30)',
          letterSpacing: 'clamp(2px, 0.4vw, 5px)',
          textTransform: 'uppercase',
          willChange: 'opacity, transform',
        }}>
          Fixing the bottleneck in 2026
        </div>

        {/* NEXUS */}
        <div style={{
          ...INK_FONT,
          opacity: titleOp,
          transform: `translateY(${(1 - titleOp) * 8}px)`,
          fontSize: 'clamp(32px, 5vw, 64px)',
          fontWeight: 700,
          color: 'rgb(35, 25, 15)',
          letterSpacing: 'clamp(4px, 0.8vw, 12px)',
          textTransform: 'uppercase',
          lineHeight: 1,
          willChange: 'opacity, transform',
          marginBottom: 'clamp(4px, 1vh, 12px)',
        }}>
          Nexus
        </div>

        {/* Body text — ink on page */}
        <div style={{
          ...INK_FONT,
          opacity: bodyOp,
          transform: `translateY(${(1 - bodyOp) * 8}px)`,
          fontSize: 'clamp(10px, 1.2vw, 15px)',
          fontWeight: 400,
          color: 'rgb(50, 38, 25)',
          lineHeight: 1.8,
          willChange: 'opacity, transform',
        }}>
          Building a subnet today means solving the same infrastructure problems every other team already solved. Nexus eliminates that. It&#39;s a framework that ships weight management, security, observability, and GPU orchestration as defaults — so you only write the code that matters.
        </div>
      </div>
    </div>
  )
}
