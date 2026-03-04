interface BookMaskProps {
  progress: number
}

const ENTER = 0.6925   // frame 1500
const EXIT = 0.9695    // frame 2100
const TOTAL = EXIT - ENTER
const FADE_OUT_START = 0.9

export function BookMask({ progress }: BookMaskProps) {
  if (progress < ENTER || progress > EXIT) return null

  const local = (progress - ENTER) / TOTAL

  // Fade-in the dark overlay quickly at start
  const fadeIn = Math.min(1, local / 0.05)
  // Fade-out at the end
  const fadeOut = local > FADE_OUT_START
    ? Math.max(0, 1 - (local - FADE_OUT_START) / (1 - FADE_OUT_START))
    : 1
  const globalOpacity = fadeIn * fadeOut

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      pointerEvents: 'none',
      zIndex: 3,
      opacity: globalOpacity,
      background: `radial-gradient(
        ellipse 60% 70% at 50% 50%,
        rgba(0, 0, 0, 0.0) 0%,
        rgba(0, 0, 0, 0.5) 50%,
        rgba(0, 0, 0, 0.85) 100%
      )`,
    }} />
  )
}
