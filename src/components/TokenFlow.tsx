import type { TokenFlowData } from '../content'

interface TokenFlowProps {
  progress: number
  data: TokenFlowData
}

function fadeIn(progress: number, start: number, duration: number = 0.04): number {
  if (progress < start) return 0
  if (progress > start + duration) return 1
  return (progress - start) / duration
}

export function TokenFlow({ progress, data }: TokenFlowProps) {
  const font: React.CSSProperties = {
    fontFamily: "'IBM Plex Mono', monospace",
    color: '#ffffff',
  }

  const titleOpacity = fadeIn(progress, 0.0)
  const totalOpacity = fadeIn(progress, 0.10)
  const inflowOpacity = fadeIn(progress, 0.22)

  // Inflow number morphs to net
  const morphProgress = fadeIn(progress, 0.32, 0.06)
  const showDelta = morphProgress > 0

  const tableHeaderOpacity = fadeIn(progress, 0.40)

  return (
    <div style={{
      position: 'absolute',
      top: '12%',
      left: '5%',
      maxWidth: 'clamp(300px, 42vw, 560px)',
      pointerEvents: 'none',
      ...font,
    }}>
      {/* Title */}
      <div style={{
        opacity: titleOpacity,
        transform: `translateY(${(1 - titleOpacity) * 10}px)`,
        fontSize: 'clamp(11px, 1.3vw, 15px)',
        fontWeight: 300,
        letterSpacing: 3,
        textTransform: 'uppercase',
        color: 'rgba(255,255,255,0.5)',
        marginBottom: 'clamp(16px, 3vh, 32px)',
      }}>
        {data.title}
      </div>

      {/* Total outflow - big number */}
      <div style={{
        opacity: totalOpacity,
        transform: `translateY(${(1 - totalOpacity) * 12}px)`,
        marginBottom: 'clamp(8px, 1.5vh, 16px)',
      }}>
        <div style={{
          fontSize: 'clamp(10px, 1.1vw, 13px)',
          fontWeight: 400,
          letterSpacing: 2,
          color: 'rgba(255,255,255,0.4)',
          textTransform: 'uppercase',
          marginBottom: 4,
        }}>
          {data.totalOutflowLabel}
        </div>
        <div style={{
          fontSize: 'clamp(36px, 5vw, 64px)',
          fontWeight: 500,
          letterSpacing: -1,
          lineHeight: 1,
          textShadow: '0 2px 20px rgba(255,255,255,0.15)',
        }}>
          {data.totalOutflowAmount} <span style={{ fontSize: '0.5em', fontWeight: 300, letterSpacing: 2 }}>{data.totalOutflowUnit}</span>
        </div>
      </div>

      {/* Inflow -> Delta morph */}
      <div style={{
        opacity: inflowOpacity,
        transform: `translateY(${(1 - inflowOpacity) * 10}px)`,
        marginBottom: 'clamp(20px, 4vh, 40px)',
        overflow: 'hidden',
      }}>
        <div style={{
          fontSize: 'clamp(10px, 1.1vw, 13px)',
          fontWeight: 400,
          letterSpacing: 2,
          color: 'rgba(255,255,255,0.4)',
          textTransform: 'uppercase',
          marginBottom: 4,
        }}>
          {showDelta ? data.netLabel : data.inflowLabel}
        </div>
        <div style={{
          fontSize: 'clamp(24px, 3.5vw, 44px)',
          fontWeight: 500,
          letterSpacing: -1,
          lineHeight: 1,
          color: showDelta ? data.netColor : '#ffffff',
          transition: 'color 0.4s ease',
        }}>
          {showDelta ? (
            <>{data.netAmount} <span style={{ fontSize: '0.5em', fontWeight: 300, letterSpacing: 2 }}>{data.netUnit}</span></>
          ) : (
            <>{data.inflowAmount} <span style={{ fontSize: '0.5em', fontWeight: 300, letterSpacing: 2 }}>{data.inflowUnit}</span></>
          )}
        </div>
        {showDelta && (
          <div style={{
            fontSize: 'clamp(9px, 1vw, 12px)',
            color: `${data.netColor}99`,
            marginTop: 4,
            opacity: morphProgress,
            letterSpacing: 1,
          }}>
            {data.netSubtext}
          </div>
        )}
      </div>

      {/* Table */}
      <div style={{
        opacity: tableHeaderOpacity,
        transform: `translateY(${(1 - tableHeaderOpacity) * 10}px)`,
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(255,255,255,0.15)',
          paddingBottom: 6,
          marginBottom: 8,
          fontSize: 'clamp(8px, 0.9vw, 11px)',
          fontWeight: 400,
          letterSpacing: 2,
          color: 'rgba(255,255,255,0.35)',
          textTransform: 'uppercase',
        }}>
          <span>Category</span>
          <span>Projects</span>
        </div>

        {/* Rows */}
        {data.categories.map((cat, i) => {
          const rowStart = 0.46 + i * 0.09
          const rowOpacity = fadeIn(progress, rowStart)

          return (
            <div
              key={cat.name}
              style={{
                opacity: rowOpacity,
                transform: `translateY(${(1 - rowOpacity) * 8}px)`,
                borderBottom: '1px solid rgba(255,255,255,0.06)',
                paddingBottom: 'clamp(6px, 1vh, 10px)',
                marginBottom: 'clamp(6px, 1vh, 10px)',
              }}
            >
              <div style={{
                fontSize: 'clamp(12px, 1.4vw, 16px)',
                fontWeight: 500,
                letterSpacing: 1,
                marginBottom: 3,
              }}>
                {cat.name}
              </div>
              <div style={{
                fontSize: 'clamp(10px, 1.1vw, 14px)',
                fontWeight: 400,
                color: 'rgba(255,255,255,0.55)',
                letterSpacing: 0.5,
                lineHeight: 1.4,
              }}>
                {cat.projects}
              </div>
            </div>
          )
        })}

        {/* Total row */}
        {(() => {
          const totalRowOpacity = fadeIn(progress, 0.92)
          return (
            <div style={{
              opacity: totalRowOpacity,
              transform: `translateY(${(1 - totalRowOpacity) * 8}px)`,
              borderTop: '1px solid rgba(255,255,255,0.25)',
              paddingTop: 'clamp(8px, 1.2vh, 12px)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
            }}>
              <span style={{
                fontSize: 'clamp(13px, 1.5vw, 18px)',
                fontWeight: 500,
                letterSpacing: 2,
              }}>
                {data.totalLabel}
              </span>
              <span style={{
                fontSize: 'clamp(16px, 2vw, 24px)',
                fontWeight: 500,
              }}>
                {data.totalAmount}
              </span>
            </div>
          )
        })()}
      </div>
    </div>
  )
}
