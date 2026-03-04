import type { RoadmapData } from '../content'

interface RoadmapSectionProps {
  progress: number
  data: RoadmapData
}

function fadeIn(progress: number, start: number, duration: number = 0.04): number {
  if (progress < start) return 0
  if (progress > start + duration) return 1
  return (progress - start) / duration
}

export function RoadmapSection({ progress, data }: RoadmapSectionProps) {
  const font: React.CSSProperties = {
    fontFamily: "'IBM Plex Mono', monospace",
    color: '#ffffff',
  }

  // Phase 1: year1 appears (0.0 - 0.55)
  const yearOpacity = fadeIn(progress, 0.0)
  const toolsOpacity = fadeIn(progress, 0.42)

  // Phase 2: morph to year2 (0.55 - 0.65)
  const morphT = fadeIn(progress, 0.65, 0.06)
  const showYear2 = morphT > 0

  // Phase 3: year2 content + typing dots
  const content2Opacity = fadeIn(progress, 0.78)
  const dotsOpacity = fadeIn(progress, 0.93)

  return (
    <>
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(to right, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.7) 40%, rgba(0,0,0,0.4) 70%, rgba(0,0,0,0.1) 100%)',
        pointerEvents: 'none',
      }} />

      <div style={{
        position: 'absolute',
        top: '10%',
        left: '6%',
        maxWidth: 'clamp(340px, 44vw, 580px)',
        pointerEvents: 'none',
        ...font,
      }}>
        {/* Year */}
        <div style={{
          opacity: yearOpacity,
          fontSize: 'clamp(48px, 7vw, 96px)',
          fontWeight: 500,
          letterSpacing: -2,
          lineHeight: 1,
          marginBottom: 'clamp(20px, 4vh, 40px)',
          textShadow: '0 2px 20px rgba(0,0,0,0.5)',
          transition: 'none',
        }}>
          {showYear2 ? data.year2 : data.year1}
        </div>

        {/* Categories - year1 or year2 */}
        {!showYear2 && data.year1Items.map((item, i) => {
          const rowOpacity = fadeIn(progress, 0.06 + i * 0.07)
          return (
            <div key={item.category} style={{
              opacity: rowOpacity,
              transform: `translateY(${(1 - rowOpacity) * 8}px)`,
              marginBottom: 'clamp(12px, 2vh, 20px)',
            }}>
              <div style={{
                fontSize: 'clamp(14px, 1.6vw, 20px)',
                fontWeight: 500,
                letterSpacing: 1,
                marginBottom: 3,
              }}>
                {item.category}
              </div>
              <div style={{
                fontSize: 'clamp(10px, 1.1vw, 13px)',
                fontWeight: 400,
                color: 'rgba(255,255,255,0.5)',
                lineHeight: 1.5,
              }}>
                {item.projects}
              </div>
            </div>
          )
        })}

        {/* Tools count */}
        {!showYear2 && (
          <div style={{
            opacity: toolsOpacity,
            marginTop: 'clamp(8px, 2vh, 16px)',
            fontSize: 'clamp(12px, 1.3vw, 16px)',
            fontWeight: 500,
            letterSpacing: 2,
            color: 'rgba(255,255,255,0.6)',
          }}>
            {data.year1ToolsCount}
          </div>
        )}

        {/* Year2 content */}
        {showYear2 && (
          <>
            {data.year2Items.map((item) => (
              <div key={item.category} style={{
                opacity: content2Opacity,
                transform: `translateY(${(1 - content2Opacity) * 8}px)`,
                marginBottom: 'clamp(12px, 2vh, 20px)',
              }}>
                <div style={{
                  fontSize: 'clamp(14px, 1.6vw, 20px)',
                  fontWeight: 500,
                  letterSpacing: 1,
                  marginBottom: 3,
                }}>
                  {item.category}
                </div>
                <div style={{
                  fontSize: 'clamp(10px, 1.1vw, 13px)',
                  fontWeight: 400,
                  color: 'rgba(255,255,255,0.5)',
                  lineHeight: 1.5,
                }}>
                  {item.projects}
                </div>
              </div>
            ))}

            {/* Typing dots */}
            <div style={{
              opacity: dotsOpacity,
              marginTop: 'clamp(16px, 3vh, 32px)',
              fontSize: 'clamp(36px, 5vw, 64px)',
              fontWeight: 700,
              letterSpacing: 12,
              color: '#ffffff',
              textShadow: '0 0 20px rgba(255,255,255,0.5)',
            }}>
              <style>{`
                @keyframes blink {
                  0%, 20% { opacity: 0.2; }
                  40% { opacity: 1; }
                  60%, 100% { opacity: 0.2; }
                }
              `}</style>
              <span style={{ animation: 'blink 1.4s ease-in-out infinite' }}>.</span>
              <span style={{ animation: 'blink 1.4s ease-in-out 0.2s infinite' }}>.</span>
              <span style={{ animation: 'blink 1.4s ease-in-out 0.4s infinite' }}>.</span>
            </div>
          </>
        )}
      </div>
    </>
  )
}
