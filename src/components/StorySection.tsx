interface StorySectionProps {
  progress: number
  title: string
  description: string
  projects: string
}

function fadeIn(progress: number, start: number, duration: number = 0.05): number {
  if (progress < start) return 0
  if (progress > start + duration) return 1
  return (progress - start) / duration
}

export function StorySection({ progress, title, description, projects }: StorySectionProps) {
  const titleOpacity = fadeIn(progress, 0.02)
  const descOpacity = fadeIn(progress, 0.25)
  const projectsOpacity = fadeIn(progress, 0.60)

  const font: React.CSSProperties = {
    fontFamily: "'IBM Plex Mono', monospace",
    color: '#ffffff',
  }

  return (
    <>
      {/* Left-side dark scrim for text readability */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(to right, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.7) 40%, rgba(0,0,0,0.4) 70%, rgba(0,0,0,0.1) 100%)',
        pointerEvents: 'none',
      }} />

      <div style={{
        position: 'absolute',
        top: '25%',
        left: '6%',
        maxWidth: 'clamp(320px, 40vw, 520px)',
        pointerEvents: 'none',
        ...font,
      }}>
      {/* Title */}
      <div style={{
        opacity: titleOpacity,
        transform: `translateY(${(1 - titleOpacity) * 12}px)`,
        fontSize: 'clamp(24px, 3.5vw, 48px)',
        fontWeight: 500,
        letterSpacing: -0.5,
        lineHeight: 1.15,
        textShadow: '0 2px 16px rgba(0,0,0,0.5)',
        marginBottom: 'clamp(20px, 4vh, 40px)',
      }}>
        {title}
      </div>

      {/* Description */}
      <div style={{
        opacity: descOpacity,
        transform: `translateY(${(1 - descOpacity) * 10}px)`,
        fontSize: 'clamp(12px, 1.4vw, 17px)',
        fontWeight: 300,
        lineHeight: 1.6,
        color: 'rgba(255,255,255,0.7)',
        letterSpacing: 0.3,
        marginBottom: 'clamp(24px, 5vh, 48px)',
      }}>
        {description}
      </div>

      {/* Projects */}
      <div style={{
        opacity: projectsOpacity,
        transform: `translateY(${(1 - projectsOpacity) * 8}px)`,
      }}>
        <div style={{
          fontSize: 'clamp(9px, 1vw, 12px)',
          fontWeight: 400,
          letterSpacing: 2,
          color: 'rgba(255,255,255,0.35)',
          textTransform: 'uppercase',
          marginBottom: 8,
        }}>
          Projects
        </div>
        <div style={{
          fontSize: 'clamp(11px, 1.2vw, 15px)',
          fontWeight: 400,
          color: 'rgba(255,255,255,0.55)',
          lineHeight: 1.8,
          letterSpacing: 0.5,
        }}>
          {projects}
        </div>
      </div>
    </div>
    </>
  )
}
