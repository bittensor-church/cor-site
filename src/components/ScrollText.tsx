interface ScrollTextProps {
  label: string
  progress: number
  enterAt: number
  exitAt: number
}

export function ScrollText({ label, progress, enterAt, exitAt }: ScrollTextProps) {
  const fadeInEnd = enterAt + 0.04
  const fadeOutStart = exitAt - 0.04

  let opacity = 0
  let translateY = 8

  if (progress >= enterAt && progress <= exitAt) {
    if (progress < fadeInEnd) {
      const t = (progress - enterAt) / (fadeInEnd - enterAt)
      opacity = t
      translateY = 8 * (1 - t)
    } else if (progress > fadeOutStart) {
      const t = (progress - fadeOutStart) / (exitAt - fadeOutStart)
      opacity = 1 - t
      translateY = -8 * t
    } else {
      opacity = 1
      translateY = 0
    }
  }

  return (
    <div style={{
      opacity,
      transform: `translateY(${translateY}px)`,
      fontFamily: "'IBM Plex Mono', monospace",
      fontWeight: 500,
      fontSize: 'clamp(22px, 3.2vw, 42px)',
      color: '#ffffff',
      letterSpacing: 'clamp(4px, 0.6vw, 8px)',
      textTransform: 'uppercase',
      textShadow: '0 2px 12px rgba(0,0,0,0.6)',
      willChange: 'opacity, transform',
    }}>
      {label}
    </div>
  )
}
