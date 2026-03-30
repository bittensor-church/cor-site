import { useEffect, useRef, useState } from 'react'

interface SparsePreloadOptions {
  frameDir: string
  frameCount: number
  step?: number
}

interface SparsePreloadResult {
  ready: boolean
  progress: number
  sparseFramesRef: React.RefObject<Map<number, HTMLImageElement>>
}

export function useSparsePreload({
  frameDir,
  frameCount,
  step = 20,
}: SparsePreloadOptions): SparsePreloadResult {
  const sparseFramesRef = useRef(new Map<number, HTMLImageElement>())
  const [progress, setProgress] = useState(0)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const indices: number[] = []
    for (let i = 0; i < frameCount; i += step) {
      indices.push(i)
    }

    const total = indices.length
    let loaded = 0

    for (const idx of indices) {
      const img = new Image()
      img.onload = () => {
        sparseFramesRef.current.set(idx, img)
        loaded++

        // Throttle state updates — every 5 frames or when done
        if (loaded % 5 === 0 || loaded === total) {
          setProgress(loaded / total)
        }

        if (loaded === total) {
          setReady(true)
        }
      }
      img.onerror = () => {
        loaded++
        if (loaded % 5 === 0 || loaded === total) {
          setProgress(loaded / total)
        }
        if (loaded === total) {
          setReady(true)
        }
      }
      img.src = `${frameDir}/f_${String(idx + 1).padStart(4, '0')}.webp`
    }
  }, [frameDir, frameCount, step])

  return { ready, progress, sparseFramesRef }
}
