import type { DevCallLine } from '../content'

interface DevCallsSectionProps {
  progress: number
  lines: DevCallLine[]
}

function fadeIn(progress: number, start: number, duration: number = 0.06): number {
  if (progress < start) return 0
  if (progress > start + duration) return 1
  return (progress - start) / duration
}

export function DevCallsSection({ progress, lines }: DevCallsSectionProps) {
  return (
    <>
      {/* Bottom gradient for readability on bright trunk */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.7) 30%, rgba(0,0,0,0.2) 55%, transparent 75%)',
        pointerEvents: 'none',
      }} />

      <div style={{
        position: 'absolute',
        bottom: '10%',
        left: '6%',
        maxWidth: 'clamp(360px, 50vw, 640px)',
        pointerEvents: 'none',
        fontFamily: "'IBM Plex Mono', monospace",
      }}>
        {lines.map((line) => {
          const opacity = fadeIn(progress, line.start)
          return (
            <div
              key={line.text}
              style={{
                opacity,
                transform: `translateY(${(1 - opacity) * 10}px)`,
                fontSize: line.isTitle
                  ? 'clamp(20px, 2.8vw, 36px)'
                  : 'clamp(16px, 2.2vw, 28px)',
                fontWeight: line.isTitle ? 500 : 300,
                color: line.isTitle ? '#ffffff' : 'rgba(255,255,255,0.8)',
                lineHeight: 1.3,
                marginBottom: line.isTitle
                  ? 'clamp(24px, 5vh, 48px)'
                  : 'clamp(10px, 2vh, 20px)',
                letterSpacing: line.isTitle ? -0.3 : 0.3,
                textShadow: '0 2px 12px rgba(0,0,0,0.8)',
              }}
            >
              {line.text}
            </div>
          )
        })}
      </div>
    </>
  )
}
