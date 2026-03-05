const NAV_ITEMS = [
  { label: 'Intro', target: 0.055 },
  { label: 'Problems', target: 0.313 },
  { label: '2025 Highlights', target: 0.483 },
  { label: 'Team & Projects', target: 0.549 },
  { label: 'Vision', target: 0.791 },
  { label: 'Nexus', target: 0.893 },
  { label: 'Support Us', target: 0.981 },
] as const

interface SideNavProps {
  progress: number
  onNavigate: (progress: number) => void
}

function getActiveIndex(progress: number): number {
  for (let i = NAV_ITEMS.length - 1; i > 0; i--) {
    const mid = (NAV_ITEMS[i - 1].target + NAV_ITEMS[i].target) / 2
    if (progress >= mid) return i
  }
  return 0
}

function getScale(i: number, activeIndex: number): number {
  const distance = Math.abs(i - activeIndex)
  if (distance === 0) return 1
  if (distance === 1) return 0.88
  if (distance === 2) return 0.78
  return 0.72
}

function getOpacity(i: number, activeIndex: number): number {
  const distance = Math.abs(i - activeIndex)
  if (distance === 0) return 1
  if (distance === 1) return 0.7
  if (distance === 2) return 0.45
  return 0.3
}

function getDotSize(i: number, activeIndex: number): number {
  const distance = Math.abs(i - activeIndex)
  if (distance === 0) return 10
  if (distance === 1) return 8
  return 6
}

const IS_MOBILE = typeof window !== 'undefined' && window.innerWidth < 600

export function SideNav({ progress, onNavigate }: SideNavProps) {
  const activeIndex = getActiveIndex(progress)

  return (
    <nav
      style={{
        position: 'absolute',
        right: 'clamp(16px, 3vw, 32px)',
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 20,
        display: 'flex',
        flexDirection: 'column',
        gap: 28,
        alignItems: 'flex-end',
        pointerEvents: 'none',
        opacity: progress < 0.005 ? 0 : 1,
        transition: 'opacity 0.6s ease-out',
      }}
    >
      {NAV_ITEMS.map((item, i) => {
        const isActive = i === activeIndex
        const scale = getScale(i, activeIndex)
        const opacity = getOpacity(i, activeIndex)
        const dotSize = getDotSize(i, activeIndex)

        return (
          <button
            key={item.label}
            onClick={() => onNavigate(item.target)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              background: 'none',
              border: 'none',
              padding: '10px 8px',
              cursor: 'pointer',
              pointerEvents: 'auto',
              transform: `scale(${scale})`,
              transformOrigin: 'right center',
              opacity,
              transition: 'all 0.4s ease',
            }}
          >
            {!IS_MOBILE && (
              <span
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: 'clamp(11px, 1.2vw, 14px)',
                  textTransform: 'uppercase',
                  letterSpacing: 2,
                  color: 'rgba(255,255,255,1)',
                  whiteSpace: 'nowrap',
                }}
              >
                {item.label}
              </span>
            )}
            <span
              style={{
                width: dotSize,
                height: dotSize,
                borderRadius: '50%',
                backgroundColor: isActive
                  ? '#ffffff'
                  : 'rgba(255,255,255,0.45)',
                boxShadow: isActive
                  ? '0 0 0 3px #d4a843'
                  : 'none',
                transition: 'all 0.4s ease',
                flexShrink: 0,
              }}
            />
          </button>
        )
      })}
    </nav>
  )
}
