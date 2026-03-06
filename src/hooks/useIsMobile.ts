import { useState, useEffect } from 'react'

function useMediaBreakpoint(breakpoint: number): boolean {
  const [matches, setMatches] = useState(
    () => typeof window !== 'undefined' && window.innerWidth < breakpoint
  )

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint - 1}px)`)
    setMatches(mq.matches)

    const handler = (e: MediaQueryListEvent) => setMatches(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [breakpoint])

  return matches
}

export function useIsMobile(breakpoint = 768): boolean {
  return useMediaBreakpoint(breakpoint)
}

export function useIsTablet(): boolean {
  const isMobile = useMediaBreakpoint(768)
  const isNarrow = useMediaBreakpoint(1025)
  return !isMobile && isNarrow
}

export function useIsLandscapeMobile(): boolean {
  const [matches, setMatches] = useState(
    () => typeof window !== 'undefined' && window.innerWidth >= 768 && window.innerHeight <= 500
  )

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px) and (max-height: 500px)')
    setMatches(mq.matches)

    const handler = (e: MediaQueryListEvent) => setMatches(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  return matches
}
