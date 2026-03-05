interface ProblemsOverlayProps {
  progress: number
}

const ENTER = 0.2844   // frame 616
const EXIT = 0.3325    // frame 720
const TOTAL = EXIT - ENTER

const PROBLEMS = [
  {
    name: 'Protocol Fairness & Network Safety',
    description: 'Improving incentive alignment, protecting participants, and increasing consensus resilience.',
  },
  {
    name: 'Transparency & Governance Visibility',
    description: 'Making network behavior, governance principles, and ecosystem activity observable and understandable.',
  },
  {
    name: 'Subnet Development & Operations',
    description: 'Providing infrastructure and tooling for building, deploying, and reliably operating subnets.',
  },
]

// Each item gets an equal slice for its fade-in, then stays visible
const ITEM_IN_DURATION = 0.12
const FADE_OUT_START = 0.85

function getItemEntryStart(index: number): number {
  // Stagger items across 0..0.7 of local progress
  return (index / PROBLEMS.length) * 0.7
}

export function ProblemsOverlay({ progress }: ProblemsOverlayProps) {
  if (progress < ENTER || progress > EXIT) return null

  const local = (progress - ENTER) / TOTAL

  // Global fade-out
  const globalFadeOut = local > FADE_OUT_START
    ? Math.max(0, 1 - (local - FADE_OUT_START) / (1 - FADE_OUT_START))
    : 1

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
        background: 'rgba(0, 0, 0, 0.45)',
        backdropFilter: 'blur(8px)',
        borderRadius: 12,
        padding: 'clamp(20px, 4vh, 40px) clamp(24px, 4vw, 48px)',
      }}>
      {/* Header */}
      <div style={{
        opacity: Math.min(1, local / 0.05),
        transform: `translateY(${Math.max(0, 10 * (1 - local / 0.05))}px)`,
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
        Problems
      </div>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'clamp(10px, 2vh, 20px)',
        maxWidth: 'clamp(300px, 85vw, 800px)',
      }}>
        {PROBLEMS.map((problem, i) => {
          const entryStart = getItemEntryStart(i)
          const entryEnd = entryStart + ITEM_IN_DURATION

          let opacity = 0
          let translateY = 14
          let translateX = -8

          if (local >= entryStart) {
            if (local < entryEnd) {
              const t = (local - entryStart) / (entryEnd - entryStart)
              opacity = t
              translateY = 14 * (1 - t)
              translateX = -8 * (1 - t)
            } else {
              opacity = 1
              translateY = 0
              translateX = 0
            }
          }

          return (
            <div
              key={i}
              style={{
                opacity,
                transform: `translate(${translateX}px, ${translateY}px)`,
                display: 'flex',
                alignItems: 'flex-start',
                gap: 'clamp(8px, 1.2vw, 16px)',
                willChange: 'opacity, transform',
              }}
            >
              <span style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontWeight: 600,
                fontSize: 'clamp(14px, 2vw, 26px)',
                color: '#d4a843',
                minWidth: 'clamp(24px, 3vw, 36px)',
                textShadow: '0 2px 12px rgba(0,0,0,0.6)',
                lineHeight: 1.3,
              }}>
                {i + 1}.
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(2px, 0.5vh, 6px)' }}>
                <span style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontWeight: 600,
                  fontSize: 'clamp(13px, 1.8vw, 24px)',
                  color: '#ffffff',
                  letterSpacing: 'clamp(1px, 0.2vw, 3px)',
                  textTransform: 'uppercase',
                  textShadow: '0 2px 12px rgba(0,0,0,0.6)',
                  overflowWrap: 'break-word' as const,
                  lineHeight: 1.3,
                }}>
                  {problem.name}
                </span>
                <span style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontWeight: 400,
                  fontSize: 'clamp(10px, 1.2vw, 17px)',
                  color: 'rgba(212, 168, 67, 0.7)',
                  fontStyle: 'italic',
                  textShadow: '0 2px 12px rgba(0,0,0,0.6)',
                  lineHeight: 1.4,
                }}>
                  {problem.description}
                </span>
              </div>
            </div>
          )
        })}
      </div>
      </div>
    </div>
  )
}
