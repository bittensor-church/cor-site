import { PR_STATS_DATA } from '../content'
import { useIsMobile } from '../hooks/useIsMobile'

interface OverviewOverlayProps {
  progress: number
}

const ENTER = 0.5180   // frame 1122
const EXIT = 0.6280    // frame 1360
const TOTAL = EXIT - ENTER

interface Project {
  title: string
  link: string
  tech?: string
}

interface BreakdownItem {
  name: string
  description: string
  percentage: number
  taoAmount: number
  projects: Project[]
}

const BREAKDOWN_ITEMS: BreakdownItem[] = [
  {
    name: 'Protocol Fairness & Network Safety',
    description: 'Improving incentive alignment and protecting the network from abuse',
    percentage: 50,
    taoAmount: 1084,
    projects: [
      { title: 'commit reveal', link: '#' },
      { title: 'yuma3', link: '#', tech: 'rust' },
      { title: 'liquid alpha 2.x', link: '#', tech: 'rust' },
      { title: 'superburn', link: 'https://github.com/bittensor-church/superburn' },
      { title: 'burn', link: 'https://github.com/bittensor-church/burn', tech: 'python' },
      { title: 'golden-validator', link: '#', tech: 'python' },
      { title: 'collateral smart contract', link: 'https://github.com/bittensor-church/collateral-contracts', tech: 'smart contract' },
      { title: 'DDoS shield', link: 'https://github.com/bittensor-church/bt-ddos-shield', tech: 'python' },
      { title: 'opinion discord bot', link: 'https://github.com/bittensor-church/bittensor-opinion-bot', tech: 'python' },
      { title: 'taoflow2', link: '#', tech: 'rust' },
    ],
  },
  {
    name: 'Transparency & Governance Visibility',
    description: 'Making network behavior visible and enabling community voice',
    percentage: 25,
    taoAmount: 543,
    projects: [
      { title: 'bittensor-why-burn', link: 'https://github.com/bittensor-church/bittensor-why-burn', tech: 'community' },
      { title: 'grafana', link: 'https://grafana.bittensor.church', tech: 'python' },
      { title: 'bittensor-sentinel', link: 'https://github.com/bittensor-church/sentinel', tech: 'python' },
      { title: 'discord bots', link: '#', tech: 'community' },
      { title: 'cor discord', link: 'https://discord.gg/NCherfe5HQ', tech: 'python' },
      { title: 'bits', link: 'https://github.com/bittensor-church/bits', tech: 'community' },
      { title: 'forum', link: 'https://forum.bittensor.church/', tech: 'community' },
    ],
  },
  {
    name: 'Subnet Development & Operations',
    description: 'Providing infrastructure and tooling for subnet operators',
    percentage: 25,
    taoAmount: 543,
    projects: [
      { title: 'nexus', link: 'https://github.com/bittensor-church/nexus-poc', tech: 'python' },
      { title: 'pylon', link: 'https://github.com/bittensor-church/bittensor-pylon' },
      { title: 'yuma3 simulator', link: 'https://github.com/bittensor-church/interactive-yuma-simulator' },
      { title: 'rails contract', link: 'https://github.com/bittensor-church/rail-contracts', tech: 'smart contract' },
      { title: 'treasury contract', link: 'https://github.com/bittensor-church/treasury-contract', tech: 'smart contract' },
      { title: 'alpha wrapper', link: '#', tech: 'smart contract' },
      { title: 'prometheus proxy', link: 'https://github.com/bittensor-church/bittensor-prometheus-proxy', tech: 'python' },
    ],
  },
]

const TECH_ORDER = ['rust', 'python', 'smart contract', 'community'] as const

function groupByTech(projects: Project[]): Map<string, Project[]> {
  const groups = new Map<string, Project[]>()
  for (const tech of TECH_ORDER) {
    const matching = projects.filter((p) => p.tech === tech)
    if (matching.length > 0) groups.set(tech, matching)
  }
  const other = projects.filter((p) => !p.tech)
  if (other.length > 0) groups.set('other', other)
  return groups
}

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

// ─── Grid cell ───

function BreakdownCell({ item, opacity, isMobile }: {
  item: BreakdownItem
  opacity: number
  isMobile: boolean
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
        minHeight: isMobile ? 'auto' : 'clamp(40px, 4vh, 56px)',
      }}>
        {item.name}
      </div>
      <div style={{
        ...BASE_FONT,
        fontSize: 'clamp(11px, 1.3vw, 18px)',
        fontWeight: 400,
        fontStyle: 'italic',
        color: '#d4a843',
        lineHeight: 1.3,
        minHeight: isMobile ? 'auto' : 'clamp(28px, 3vh, 40px)',
      }}>
        {item.description}
      </div>
      <div style={{
        ...BASE_FONT,
        fontSize: 'clamp(13px, 1.5vw, 20px)',
        fontWeight: 500,
        color: '#d4a843',
      }}>
        {item.percentage}% &middot; {item.taoAmount.toLocaleString()} TAO
      </div>
      {!isMobile && (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'clamp(4px, 0.8vh, 10px)',
        }}>
          {Array.from(groupByTech(item.projects)).map(([tech, projects], groupIndex) => (
            <div key={tech} style={{
              marginTop: groupIndex > 0 ? 'clamp(2px, 0.3vh, 4px)' : 0,
              display: 'flex',
              flexDirection: 'column',
              gap: 'clamp(1px, 0.2vh, 3px)',
            }}>
              <div style={{
                ...BASE_FONT,
                fontSize: 'clamp(10px, 1.1vw, 14px)',
                fontWeight: 500,
                color: 'rgba(212,168,67,0.6)',
                textTransform: 'uppercase',
                letterSpacing: 2,
              }}>
                {tech}:
              </div>
              {projects.map((project) => (
                <div key={project.title} style={{
                  ...BASE_FONT,
                  fontSize: 'clamp(10px, 1.1vw, 14px)',
                  fontWeight: 400,
                  color: 'rgba(255,255,255,0.55)',
                  lineHeight: 1.3,
                  paddingLeft: 12,
                  borderLeft: '2px solid rgba(212,168,67,0.2)',
                }}>
                  <span style={{ color: '#d4a843', fontSize: '0.9em' }}>{'// '}</span>
                  {project.link !== '#' ? (
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
                    <span style={{
                      color: '#ffffff',
                      textDecoration: 'underline',
                      textDecorationColor: 'rgba(212,168,67,0.4)',
                      textUnderlineOffset: 3,
                    }}>
                      {project.title}
                    </span>
                  )}
                </div>
              ))}
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
    fontSize: 'clamp(10px, 1.2vw, 17px)',
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
    }}>
      {/* Bar */}
      <div style={{
        position: 'relative',
        borderTop: '1px solid rgba(255,255,255,0.1)',
        paddingTop: 'clamp(12px, 2vh, 24px)',
        background: 'rgba(0, 0, 0, 0.45)',
        backdropFilter: 'blur(8px)',
        borderRadius: 12,
        padding: 'clamp(16px, 3vh, 32px) clamp(24px, 4vw, 48px)',
      }}>
        {/* Description above the bar — absolutely positioned so it doesn't shift bar position */}
        {statsOpacity > 0 && (
          <div style={{
            ...BASE_FONT,
            opacity: statsOpacity,
            position: 'absolute',
            bottom: '100%',
            left: 0,
            right: 0,
            fontSize: 'clamp(9px, 1vw, 13px)',
            color: 'rgba(255,255,255,0.85)',
            textAlign: 'center',
            marginBottom: 12,
            letterSpacing: 1,
          }}>
            Beyond our own projects, we actively contribute across the Bittensor ecosystem.
          </div>
        )}
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

            {/* Verify column: repo links at number height, motto at label height */}
            <div style={{
              ...statStyle,
              pointerEvents: 'auto',
            }}>
              {/* Match bigNum height so motto aligns with labels */}
              <div style={{
                minHeight: 'clamp(24px, 5.5vw, 64px)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: '-0.4em',
                gap: 'clamp(2px, 0.4vh, 6px)',
              }}>
                {PR_STATS_DATA.verifyLinks.map((link) => (
                  <a
                    key={link.url}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      ...BASE_FONT,
                      fontSize: 'clamp(8.5px, 1.7vw, 20px)',
                      fontWeight: 500,
                      lineHeight: 1,
                      color: '#ffffff',
                      textDecoration: 'none',
                      letterSpacing: -0.5,
                      transition: 'color 0.3s',
                      whiteSpace: 'nowrap',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = '#d4a843' }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = '#ffffff' }}
                  >
                    ↗ {link.name}
                  </a>
                ))}
              </div>
              <div style={label}>
                Don't trust. Verify.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export function OverviewOverlay({ progress }: OverviewOverlayProps) {
  const isMobile = useIsMobile()

  if (progress < ENTER || progress > EXIT) return null

  const local = (progress - ENTER) / TOTAL

  // Global fade-out
  const globalFade = local > 0.92
    ? Math.max(0, 1 - (local - 0.92) / 0.08)
    : 1

  if (globalFade <= 0) return null

  // Grid + bottom strip fade-out envelope (visible until near end)
  const gridStripOp = local < 0.88 ? 1 : local > 0.92 ? 0 : 1 - (local - 0.88) / 0.04

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
            top: isMobile ? 'clamp(24px, 4vh, 60px)' : 'clamp(80px, 16vh, 160px)',
            left: '5%',
            right: '5%',
            bottom: isMobile ? 'clamp(100px, 16vh, 160px)' : 'clamp(140px, 22vh, 220px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            overflowY: 'auto' as const,
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
              marginBottom: isMobile ? 'clamp(8px, 2vh, 16px)' : 'clamp(12px, 2vh, 24px)',
            }}>
              15 people &middot; 3 teams
            </div>
            <div style={{
              ...BASE_FONT,
              opacity: fadeIn(local, 0.0),
              transform: `translateY(${(1 - fadeIn(local, 0.0)) * 10}px)`,
              fontSize: 'clamp(18px, 2.5vw, 36px)',
              fontWeight: 500,
              letterSpacing: 'clamp(3px, 0.6vw, 8px)',
              textTransform: 'uppercase',
              color: '#ffffff',
              marginBottom: isMobile ? 'clamp(8px, 2vh, 16px)' : 'clamp(12px, 2vh, 24px)',
            }}>
              Projects
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
              gap: isMobile ? 'clamp(10px, 2vw, 16px)' : 'clamp(32px, 5vw, 72px)',
              maxWidth: 'min(85vw, 1200px)',
              width: '100%',
            }}>
              {BREAKDOWN_ITEMS.map((item, i) => {
                const itemOpacity = fadeIn(local, 0.02 + i * STAGGER)
                return (
                  <BreakdownCell
                    key={item.name}
                    item={item}
                    opacity={itemOpacity}
                    isMobile={isMobile}
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
    </div>
  )
}
