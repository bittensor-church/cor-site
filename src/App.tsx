import { useState } from 'react'
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

export function App() {
  const [loaded, setLoaded] = useState(false)
  const { progress, sectionIndex, sectionProgress, setProgress } = useScrollProgress(SECTIONS.length)

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: '#0a0a0a',
      overflow: 'hidden',
    }}>
      {SECTIONS.map((section, i) => (
        <VideoSection
          key={section.id}
          src={section.src}
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
      <SideNav progress={sectionProgress} onNavigate={setProgress} />

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
          fontSize: 'clamp(10px, 1.2vw, 13px)',
          color: 'rgba(255,255,255,0.4)',
          letterSpacing: 3,
          textTransform: 'uppercase',
          opacity: progress < 0.01 ? 1 : 0,
          transition: 'opacity 0.8s ease-out',
        }}>
          Scroll to explore
        </div>
      </div>

      <MusicToggle />
      <LoadingScreen visible={!loaded} onReady={() => setLoaded(true)} />
    </div>
  )
}
