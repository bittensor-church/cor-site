interface SupportOverlayProps {
  progress: number
}

const ENTER = 0.9695   // frame 2100
const EXIT = 1.0       // frame 2166

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

export function SupportOverlay({ progress }: SupportOverlayProps) {
  if (progress < ENTER || progress > EXIT) return null

  const local = (progress - ENTER) / (EXIT - ENTER)

  const titleOp = fadeIn(local, 0.0, 0.15)
  const walletOp = fadeIn(local, 0.2, 0.15)

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
        gap: 'clamp(16px, 3vh, 32px)',
      }}>
      {/* Support us */}
      <div style={{
        ...BASE_FONT,
        opacity: titleOp,
        transform: `translateY(${(1 - titleOp) * 12}px)`,
        fontSize: 'clamp(28px, 4.5vw, 56px)',
        fontWeight: 600,
        color: '#d4a843',
        letterSpacing: 'clamp(4px, 0.8vw, 10px)',
        textTransform: 'uppercase',
        textAlign: 'center',
        willChange: 'opacity, transform',
      }}>
        Support us
      </div>

      {/* Wallet address */}
      <div style={{
        ...BASE_FONT,
        opacity: walletOp,
        transform: `translateY(${(1 - walletOp) * 10}px)`,
        fontSize: 'clamp(10px, 1.2vw, 15px)',
        fontWeight: 400,
        color: 'rgba(255, 255, 255, 0.75)',
        letterSpacing: 'clamp(1px, 0.15vw, 2px)',
        textAlign: 'center',
        wordBreak: 'break-all',
        maxWidth: 'clamp(300px, 60vw, 700px)',
        pointerEvents: 'auto',
        cursor: 'text',
        userSelect: 'all',
        willChange: 'opacity, transform',
      }}>
        XXXXXXXX
      </div>
      </div>
    </div>
  )
}
