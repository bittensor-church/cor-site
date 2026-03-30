import { useState, useEffect } from 'react'
import { useIsMobile } from './hooks/useIsMobile'
import { useScrollProgress } from './hooks/useScrollProgress'
import { VideoSection } from './components/VideoSection'
import { HeroOverlay } from './components/HeroOverlay'
import { ProblemsOverlay } from './components/ProblemsOverlay'
import { WindowMask } from './components/WindowMask'
import { AchievementOverlay } from './components/AchievementOverlay'
import { OverviewOverlay } from './components/OverviewOverlay'
import { BookMask } from './components/BookMask'
import { VisionOverlay } from './components/VisionOverlay'
import { NexusOverlay } from './components/NexusOverlay'
import { SupportOverlay } from './components/SupportOverlay'
import { MusicToggle } from './components/MusicToggle'
import { SideNav } from './components/SideNav'
import { LoadingScreen } from './ui/LoadingScreen'
import { SECTIONS } from './content'

const HASH_SECTIONS = [
  { hash: 'intro', target: 0.055 },
  { hash: 'problems', target: 0.313 },
  { hash: 'highlights', target: 0.483 },
  { hash: 'team', target: 0.549 },
  { hash: 'vision', target: 0.791 },
  { hash: 'nexus', target: 0.893 },
  { hash: 'support', target: 0.981 },
] as const

export function App() {
  const [loaded, setLoaded] = useState(false)
  const isMobile = useIsMobile()

  const { progress, sectionIndex, sectionProgress, setProgress } = useScrollProgress(SECTIONS.length)

  // Deep link: read hash on mount
  useEffect(() => {
    const hash = window.location.hash.slice(1).toLowerCase()
    if (!hash) return
    const match = HASH_SECTIONS.find((s) => s.hash === hash)
    if (match) setProgress(match.target)
  }, [setProgress])

  // Deep link: clear hash after initial navigation so refresh starts from top
  useEffect(() => {
    if (window.location.hash) {
      window.history.replaceState(null, '', window.location.pathname)
    }
  }, [])

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: '#0a0a0a',
      overflow: 'hidden',
    }}>
      <main style={{ position: 'absolute', inset: 0 }}>
        {SECTIONS.map((section, i) => (
          <VideoSection
            key={section.id}
            frameDir={section.frameDir}
            frameCount={section.frameCount}
            active={sectionIndex === i}
            shouldLoad={Math.abs(sectionIndex - i) <= 1}
            sectionProgress={sectionIndex === i ? sectionProgress : (sectionIndex > i ? 1 : 0)}
          />
        ))}

        <HeroOverlay progress={sectionProgress} />
        <WindowMask progress={sectionProgress} />
        <ProblemsOverlay progress={sectionProgress} />
        <AchievementOverlay progress={sectionProgress} />
        <OverviewOverlay progress={sectionProgress} />
        <BookMask progress={sectionProgress} />
        <VisionOverlay progress={sectionProgress} />
        <NexusOverlay progress={sectionProgress} />
        <SupportOverlay progress={sectionProgress} />

        {/* Scroll indicator */}
        <div style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 10,
          fontFamily: "'IBM Plex Mono', monospace",
        }}>
          <div style={{
            position: 'absolute',
            bottom: 'clamp(24px, 5vh, 48px)',
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: 'clamp(10px, 1.2vw, 14px)',
            color: 'rgba(255,255,255,0.4)',
            letterSpacing: 3,
            textTransform: 'uppercase',
            opacity: loaded && progress < 0.01 ? 1 : 0,
            transition: 'opacity 0.8s ease-out',
          }}>
            {isMobile ? 'Swipe to explore' : 'Scroll to explore'}
          </div>
        </div>
      </main>

      <SideNav progress={sectionProgress} onNavigate={setProgress} />
      <MusicToggle progress={sectionProgress} />
      <LoadingScreen visible={!loaded} onReady={() => setLoaded(true)} />
    </div>
  )
}
