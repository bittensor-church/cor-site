export function fadeIn(t: number, start: number, duration: number = 0.12): number {
  if (t < start) return 0
  if (t > start + duration) return 1
  return (t - start) / duration
}
