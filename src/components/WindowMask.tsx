interface WindowMaskProps {
  progress: number
}

const ENTER = 0.3125   // frame 630
const EXIT = 0.3571    // frame 720
const TOTAL = EXIT - ENTER
const FADE_OUT_START = 0.85

// How far the "light curtain" has moved (0 = everything dark, 1 = fully revealed)
function getLightProgress(local: number): number {
  // Light reveals across 0..0.75 of local progress (synced with problem appearances)
  const t = Math.min(1, local / 0.75)
  return t
}

export function WindowMask({ progress }: WindowMaskProps) {
  if (progress < ENTER || progress > EXIT) return null

  const local = (progress - ENTER) / TOTAL

  // Fade-in the dark overlay quickly at start
  const fadeIn = Math.min(1, local / 0.05)
  // Fade-out at the end
  const fadeOut = local > FADE_OUT_START
    ? Math.max(0, 1 - (local - FADE_OUT_START) / (1 - FADE_OUT_START))
    : 1
  const globalOpacity = fadeIn * fadeOut

  // Light curtain moves from left to right
  // gradientStop: where the dark-to-transparent transition happens (% from left)
  // Starts at ~10% (everything dark), ends at ~95% (almost everything revealed)
  const light = getLightProgress(local)
  const darkEnd = 35 + light * 5       // dark area always covers text zone (35-40%)
  const transitionEnd = darkEnd + 15 + light * 45  // transition zone expands right

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      pointerEvents: 'none',
      zIndex: 3,
      opacity: globalOpacity,
      background: `linear-gradient(
        to right,
        rgba(0, 0, 0, 0.85) 0%,
        rgba(0, 0, 0, 0.82) ${darkEnd}%,
        rgba(0, 0, 0, 0.0) ${transitionEnd}%,
        rgba(0, 0, 0, 0.0) 100%
      )`,
    }} />
  )
}
