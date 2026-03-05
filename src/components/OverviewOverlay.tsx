import { PR_STATS_DATA } from '../content'

interface OverviewOverlayProps {
  progress: number
}

const ENTER = 0.5180   // frame 1122
const EXIT = 0.6280    // frame 1360
const TOTAL = EXIT - ENTER

interface Project {
  title: string
  link?: string
}

interface BreakdownItem {
  name: string
  percentage: number
  taoAmount: number
  projects: Project[]
}

const BREAKDOWN_ITEMS: BreakdownItem[] = [
  {
    name: 'Protocol Fairness & Network Safety',
    percentage: 50,
    taoAmount: 1084,
    projects: [
      { title: 'commit reveal' },
      { title: 'yuma3' },
      { title: 'superburn', link: 'https://github.com/bittensor-church/superburn' },
      { title: 'burn', link: 'https://github.com/bittensor-church/burn' },
      { title: 'golden-validator' },
      { title: 'collateral smart contract', link: 'https://github.com/bittensor-church/collateral-contracts' },
      { title: 'DDoS shield', link: 'https://github.com/bittensor-church/bt-ddos-shield' },
      { title: 'Opinion bot' },
    ],
  },
  {
    name: 'Transparency & Governance Visibility',
    percentage: 25,
    taoAmount: 543,
    projects: [
      { title: 'bittensor-why-burn', link: 'https://github.com/bittensor-church/bittensor-why-burn' },
      { title: 'grafana', link: 'https://grafana.bactensor.io' },
      { title: 'bittensor-sentinel', link: 'https://github.com/bittensor-church/sentinel' },
      { title: 'discord bots' },
      { title: 'cor discord', link: 'https://discord.gg/NCherfe5HQ' },
      { title: 'bits', link: 'https://github.com/bittensor-church/bits' },
      { title: 'forum', link: 'https://forum.bittensor.church/' },
    ],
  },
  {
    name: 'Subnet Development & Operations',
    percentage: 25,
    taoAmount: 543,
    projects: [
      { title: 'nexus', link: 'https://github.com/bittensor-church/nexus-poc' },
      { title: 'pylon', link: 'https://github.com/bittensor-church/bittensor-pylon' },
      { title: 'yuma3 simulator', link: 'https://github.com/bittensor-church/interactive-yuma-simulator' },
      { title: 'rails contract', link: 'https://github.com/bittensor-church/rail-contracts' },
      { title: 'treasury contract' },
      { title: 'prometheus proxy' },
    ],
  },
]

const IS_MOBILE = typeof window !== 'undefined' && window.innerWidth < 600

const SHADOW = '0 2px 12px rgba(0,0,0,0.6)'

const BASE_FONT: React.CSSProperties = {
  fontFamily: "'IBM Plex Mono', monospace",
  textShadow: SHADOW,
}

function fadeIn(local: number, start: number, duration: number = 0.04): number {
  if (local < start) return 0
  if (local > start + duration) return 1
  return (local - start) / duration
}

function phaseOpacity(
  local: number,
  fadeInStart: number,
  fadeOutStart: number,
  fadeOutEnd: number,
): number {
  if (local < fadeInStart) return 0
  const fadeInEnd = fadeInStart + 0.04
  if (local < fadeInEnd) return (local - fadeInStart) / 0.04
  if (local < fadeOutStart) return 1
  if (local >= fadeOutEnd) return 0
  return 1 - (local - fadeOutStart) / (fadeOutEnd - fadeOutStart)
}

const TEAM_SKILLS = [
  { left: 'smart contract', right: 'blockchain' },
  { left: 'yuma', right: 'consensus' },
  { left: 'python', right: null },
]

// ─── Grid cell ───

function BreakdownCell({ item, opacity }: {
  item: BreakdownItem
  opacity: number
}) {
  return (
    <div style={{
      opacity,
      transform: `translateY(${(1 - opacity) * 14}px)`,
      willChange: 'opacity, transform',
      display: 'flex',
      flexDirection: 'column',
      gap: 'clamp(4px, 0.7vh, 8px)',
    }}>
      <div style={{
        ...BASE_FONT,
        fontSize: 'clamp(14px, 1.8vw, 24px)',
        fontWeight: 600,
        color: '#ffffff',
        lineHeight: 1.2,
      }}>
        {item.name}
      </div>
      <div style={{
        ...BASE_FONT,
        fontSize: 'clamp(13px, 1.5vw, 20px)',
        fontWeight: 500,
        color: '#d4a843',
      }}>
        {item.percentage}% &middot; {item.taoAmount.toLocaleString()} TAO
      </div>
      {!IS_MOBILE && (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'clamp(2px, 0.4vh, 6px)',
        }}>
          {item.projects.map((project) => (
            <div key={project.title} style={{
              ...BASE_FONT,
              fontSize: 'clamp(10px, 1.2vw, 15px)',
              fontWeight: 400,
              color: 'rgba(255,255,255,0.55)',
              lineHeight: 1.4,
            }}>
              <span style={{ color: '#d4a843', fontSize: '0.9em' }}>{'// '}</span>
              {project.link ? (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: '#ffffff',
                    textDecoration: 'underline',
                    textDecorationColor: 'rgba(212,168,67,0.4)',
                    textUnderlineOffset: 3,
                    pointerEvents: 'auto',
                    cursor: 'pointer',
                  }}
                >
                  {project.title}
                </a>
              ) : (
                <span>{project.title}</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Bottom strip: TAO inflow/outflow → morphs to PR stats ───

function BottomStrip({ local }: { local: number }) {
  const stripOpacity = fadeIn(local, 0.24)
  if (stripOpacity <= 0) return null

  // morph: 0.0 = TAO view, 1.0 = PR stats view
  const morphProgress = fadeIn(local, 0.55, 0.08)
  const taoOpacity = 1 - morphProgress
  const statsOpacity = morphProgress

  const statStyle: React.CSSProperties = {
    ...BASE_FONT,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 2,
  }

  const bigNum: React.CSSProperties = {
    fontSize: 'clamp(24px, 5.5vw, 64px)',
    fontWeight: 500,
    letterSpacing: -1,
    lineHeight: 1,
    color: '#ffffff',
  }

  const label: React.CSSProperties = {
    fontSize: 'clamp(10px, 1.2vw, 15px)',
    fontWeight: 300,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: '#d4a843',
  }

  return (
    <div style={{
      opacity: stripOpacity,
      transform: `translateY(${(1 - Math.min(1, stripOpacity)) * 10}px)`,
      position: 'absolute',
      bottom: 'clamp(40px, 10vh, 100px)',
      left: '5%',
      right: '5%',
      borderTop: '1px solid rgba(255,255,255,0.1)',
      paddingTop: 'clamp(12px, 2vh, 24px)',
      background: 'rgba(0, 0, 0, 0.45)',
      backdropFilter: 'blur(8px)',
      borderRadius: 12,
      padding: 'clamp(16px, 3vh, 32px) clamp(24px, 4vw, 48px)',
    }}>
      {/* TAO layer */}
      {taoOpacity > 0 && (
        <div style={{
          opacity: taoOpacity,
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          display: 'flex',
          justifyContent: 'center',
          gap: 'clamp(16px, 8vw, 100px)',
          flexWrap: 'wrap' as const,
        }}>
          <div style={statStyle}>
            <div style={bigNum}>2,000</div>
            <div style={label}>TAO received</div>
          </div>
          <div style={statStyle}>
            <div style={bigNum}>2,170</div>
            <div style={label}>TAO deployed</div>
          </div>
        </div>
      )}

      {/* PR stats layer */}
      {statsOpacity > 0 && (
        <div style={{
          opacity: statsOpacity,
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          display: 'flex',
          justifyContent: 'center',
          gap: 'clamp(16px, 8vw, 100px)',
          flexWrap: 'wrap' as const,
        }}>
          <div style={statStyle}>
            <div style={bigNum}>{PR_STATS_DATA.totalPrs}</div>
            <div style={label}>PRs merged</div>
          </div>
          <div style={statStyle}>
            <div style={bigNum}>{PR_STATS_DATA.totalRepos}</div>
            <div style={label}>repos</div>
          </div>
          <div style={statStyle}>
            <div style={bigNum}>{PR_STATS_DATA.totalContributors}</div>
            <div style={label}>team members</div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Team members phase ───

function TeamPhase({ local }: { local: number }) {
  const op = phaseOpacity(local, 0.68, 0.92, 1.0)
  if (op <= 0) return null

  const STAGGER = 0.04
  const base = 0.68

  return (
    <div style={{
      opacity: op,
      position: 'absolute',
      inset: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{
        background: 'rgba(0, 0, 0, 0.45)',
        backdropFilter: 'blur(8px)',
        borderRadius: 12,
        padding: 'clamp(20px, 4vh, 40px) clamp(24px, 4vw, 48px)',
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'center',
        gap: 'clamp(4px, 1vh, 12px)',
      }}>
      {/* Big number */}
      <div style={{
        ...BASE_FONT,
        opacity: fadeIn(local, base),
        transform: `translateY(${(1 - fadeIn(local, base)) * 14}px)`,
        fontSize: 'clamp(48px, 8vw, 96px)',
        fontWeight: 500,
        color: '#ffffff',
        lineHeight: 1,
      }}>
        {PR_STATS_DATA.totalContributors}
      </div>

      {/* Label */}
      <div style={{
        ...BASE_FONT,
        opacity: fadeIn(local, base + STAGGER),
        transform: `translateY(${(1 - fadeIn(local, base + STAGGER)) * 10}px)`,
        fontSize: 'clamp(10px, 1.2vw, 15px)',
        fontWeight: 300,
        letterSpacing: 2,
        textTransform: 'uppercase' as const,
        color: '#d4a843',
        marginBottom: 'clamp(16px, 3vh, 32px)',
      }}>
        team members
      </div>

      {/* Skill lines */}
      {TEAM_SKILLS.map((skill, i) => {
        const skillOp = fadeIn(local, base + STAGGER * (i + 2))
        return (
          <div key={skill.left} style={{
            ...BASE_FONT,
            opacity: skillOp,
            transform: `translateY(${(1 - skillOp) * 10}px)`,
            fontSize: 'clamp(16px, 2.2vw, 28px)',
            fontWeight: 400,
            color: '#ffffff',
            lineHeight: 1.6,
          }}>
            {skill.left}
            {skill.right && (
              <>
                <span style={{ color: '#d4a843' }}>{' / '}</span>
                {skill.right}
              </>
            )}
          </div>
        )
      })}
      </div>
    </div>
  )
}

export function OverviewOverlay({ progress }: OverviewOverlayProps) {
  if (progress < ENTER || progress > EXIT) return null

  const local = (progress - ENTER) / TOTAL

  // Global fade-out
  const globalFade = local > 0.92
    ? Math.max(0, 1 - (local - 0.92) / 0.08)
    : 1

  if (globalFade <= 0) return null

  // Grid + bottom strip fade-out envelope
  const gridStripOp = local < 0.65 ? 1 : local > 0.70 ? 0 : 1 - (local - 0.65) / 0.05

  const STAGGER = 0.04

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      pointerEvents: 'none',
      zIndex: 5,
      opacity: globalFade,
    }}>
      {/* Grid + Strip phase */}
      {gridStripOp > 0 && (
        <div style={{ opacity: gridStripOp }}>
          {/* Grid — top area */}
          <div style={{
            position: 'absolute',
            top: IS_MOBILE ? 'clamp(24px, 4vh, 60px)' : 'clamp(80px, 16vh, 160px)',
            left: '5%',
            right: '5%',
            bottom: IS_MOBILE ? 'clamp(60px, 10vh, 100px)' : 'clamp(100px, 16vh, 160px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            overflowY: IS_MOBILE ? 'auto' as const : 'visible' as const,
          }}>
            <div style={{
              background: 'rgba(0, 0, 0, 0.45)',
              backdropFilter: 'blur(8px)',
              borderRadius: 12,
              padding: 'clamp(20px, 4vh, 40px) clamp(24px, 4vw, 48px)',
              display: 'flex',
              flexDirection: 'column' as const,
              alignItems: 'center',
            }}>
            {/* Title */}
            <div style={{
              ...BASE_FONT,
              opacity: fadeIn(local, 0.0),
              transform: `translateY(${(1 - fadeIn(local, 0.0)) * 10}px)`,
              fontSize: 'clamp(24px, 3.5vw, 48px)',
              fontWeight: 600,
              letterSpacing: 'clamp(4px, 0.8vw, 10px)',
              textTransform: 'uppercase',
              color: '#d4a843',
              marginBottom: IS_MOBILE ? 'clamp(8px, 2vh, 16px)' : 'clamp(20px, 4vh, 40px)',
            }}>
              Projects in 2025
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: IS_MOBILE ? '1fr' : 'repeat(3, 1fr)',
              gap: IS_MOBILE ? 'clamp(10px, 2vw, 16px)' : 'clamp(32px, 5vw, 72px)',
              maxWidth: 'clamp(600px, 85vw, 1200px)',
              width: '100%',
            }}>
              {BREAKDOWN_ITEMS.map((item, i) => {
                const itemOpacity = fadeIn(local, 0.02 + i * STAGGER)
                return (
                  <BreakdownCell
                    key={item.name}
                    item={item}
                    opacity={itemOpacity}
                  />
                )
              })}
            </div>
            </div>
          </div>

          {/* Bottom strip — TAO → PR stats */}
          <BottomStrip local={local} />
        </div>
      )}

      {/* Team members phase */}
      <TeamPhase local={local} />
    </div>
  )
}
