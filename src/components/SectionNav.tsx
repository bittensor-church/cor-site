import type { NavLabels } from '../content'

interface SectionNavProps {
  sections: readonly { id: string }[]
  currentIndex: number
  progress: number
  labels: NavLabels
}

export function SectionNav({ sections, currentIndex, progress, labels }: SectionNavProps) {
  const count = sections.length
  const trackHeight = 'clamp(180px, 40vh, 320px)'

  return (
    <div style={{
      position: 'absolute',
      right: 'clamp(16px, 3vw, 32px)',
      top: '50%',
      transform: 'translateY(-50%)',
      zIndex: 20,
      pointerEvents: 'none',
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      fontFamily: "'IBM Plex Mono', monospace",
      opacity: progress < 0.005 ? 0 : 1,
      transition: 'opacity 0.6s ease-out',
    }}>
      {/* Label */}
      <div style={{
        fontSize: 'clamp(9px, 0.9vw, 11px)',
        color: 'rgba(255,255,255,0.5)',
        letterSpacing: 2,
        textTransform: 'uppercase',
        textAlign: 'right',
        minWidth: 'clamp(60px, 8vw, 90px)',
        transition: 'color 0.3s',
      }}>
        {labels[sections[currentIndex].id] ?? sections[currentIndex].id}
      </div>

      {/* Track */}
      <div style={{
        position: 'relative',
        width: 2,
        height: trackHeight,
        background: 'rgba(255,255,255,0.1)',
        borderRadius: 1,
      }}>
        {/* Dots */}
        {sections.map((_, i) => {
          const y = count > 1 ? (i / (count - 1)) * 100 : 0
          const isActive = i === currentIndex
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: '50%',
                top: `${y}%`,
                transform: 'translate(-50%, -50%)',
                width: isActive ? 6 : 4,
                height: isActive ? 6 : 4,
                borderRadius: '50%',
                background: isActive
                  ? '#ffffff'
                  : 'rgba(255,255,255,0.25)',
                transition: 'all 0.3s ease-out',
              }}
            />
          )
        })}

        {/* Slider thumb */}
        <div style={{
          position: 'absolute',
          left: '50%',
          top: `${(progress) * 100}%`,
          transform: 'translate(-50%, -50%)',
          width: 10,
          height: 10,
          borderRadius: '50%',
          border: '1.5px solid rgba(255,255,255,0.7)',
          background: 'rgba(255,255,255,0.15)',
          backdropFilter: 'blur(4px)',
          transition: 'top 0.15s ease-out',
        }} />

        {/* Filled track */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: `${progress * 100}%`,
          background: 'rgba(255,255,255,0.25)',
          borderRadius: 1,
          transition: 'height 0.15s ease-out',
        }} />
      </div>
    </div>
  )
}
