const NAV_ITEMS = [
  { label: 'Intro', target: 0.002 },
  { label: 'Problems', target: 0.284 },
  { label: '2025 Highlights', target: 0.462 },
  { label: 'Projects', target: 0.518 },
  { label: 'Team', target: 0.593 },
  { label: 'Nexus', target: 0.870 },
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
        gap: 36,
        alignItems: 'flex-end',
        pointerEvents: 'none',
        opacity: progress < 0.005 ? 0 : 1,
        transition: 'opacity 0.6s ease-out',
      }}
    >
      {NAV_ITEMS.map((item, i) => {
        const isActive = i === activeIndex

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
            }}
          >
            {!IS_MOBILE && (
              <span
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: 11,
                  textTransform: 'uppercase',
                  letterSpacing: 2,
                  color: isActive
                    ? 'rgba(255,255,255,1)'
                    : 'rgba(255,255,255,0.55)',
                  transition: 'color 0.4s ease',
                  whiteSpace: 'nowrap',
                }}
              >
                {item.label}
              </span>
            )}
            <span
              style={{
                width: isActive ? 10 : 7,
                height: isActive ? 10 : 7,
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
