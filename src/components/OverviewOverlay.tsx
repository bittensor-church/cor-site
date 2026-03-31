import { useState } from 'react'
import { PR_STATS_DATA } from '../content'
import { InfoTooltip } from './InfoTooltip'
import { useIsMobile, useIsTablet } from '../hooks/useIsMobile'
import { fadeIn } from '../utils/animations'
import { BASE_FONT } from '../utils/styles'

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
    percentage: 25,
    taoAmount: 589,
    projects: [
      { title: 'DDoS shield', link: 'https://github.com/bittensor-church/bt-ddos-shield', tech: 'python' },
      { title: 'burn', link: 'https://github.com/bittensor-church/burn', tech: 'python' },
      { title: 'golden-validator', link: 'https://github.com/bittensor-church/tee-guest', tech: 'python' },
      { title: 'yuma3', link: 'https://docs.learnbittensor.org/learn/yuma3-migration-guide', tech: 'rust' },
      { title: 'commit reveal', link: '#', tech: 'rust' },
      { title: 'liquid alpha 2.x', link: '#', tech: 'rust' },
{ title: 'superburn', link: 'https://github.com/bittensor-church/superburn', tech: 'smart contract' },
      { title: 'collateral smart contract', link: 'https://github.com/bittensor-church/collateral-contracts', tech: 'smart contract' },
    ],
  },
  {
    name: 'Transparency & Governance Visibility',
    description: 'Making network behavior visible and enabling community voice',
    percentage: 11,
    taoAmount: 259,
    projects: [
      { title: 'grafana', link: 'https://grafana.bittensor.church', tech: 'python' },
      { title: 'bittensor-sentinel', link: 'https://github.com/bittensor-church/sentinel-tower', tech: 'python' },
      { title: 'opinion bot', link: 'https://github.com/bittensor-church/bittensor-opinion-bot', tech: 'python' },
      { title: 'bittensor-why-burn', link: 'https://github.com/bittensor-church/bittensor-why-burn', tech: 'community' },
      { title: 'bits', link: 'https://github.com/bittensor-church/bits', tech: 'community' },
      { title: 'forum', link: 'https://forum.bittensor.church/', tech: 'community' },
      { title: 'discord bots', link: 'https://discord.gg/NCherfe5HQ', tech: 'community' },
      { title: 'cor discord', link: 'https://discord.gg/NCherfe5HQ', tech: 'community' },
    ],
  },
  {
    name: 'Subnet Development & Operations',
    description: 'Providing infrastructure and tooling for subnet operators',
    percentage: 64,
    taoAmount: 1508,
    projects: [
      { title: 'nexus', link: 'https://github.com/bittensor-church/nexus-poc', tech: 'python' },
      { title: 'pylon', link: 'https://github.com/bittensor-church/bittensor-pylon', tech: 'python' },
      { title: 'yuma3 simulator', link: 'https://github.com/bittensor-church/interactive-yuma-simulator', tech: 'python' },
      { title: 'prometheus proxy', link: 'https://github.com/bittensor-church/bittensor-prometheus-proxy', tech: 'python' },
      { title: 'alpha wrapper', link: 'https://discord.com/channels/1120750674595024897/1472254280076365835', tech: 'smart contract' },
      { title: 'rails contract', link: 'https://github.com/bittensor-church/rail-contracts', tech: 'smart contract' },
      { title: 'treasury contract', link: 'https://github.com/bittensor-church/treasury-contract', tech: 'smart contract' },
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


// ─── Mobile toggle project list ───

function MobileProjectToggle({ projects }: { projects: Project[] }) {
  const [open, setOpen] = useState(false)

  return (
    <div style={{ marginTop: 'clamp(2px, 0.4vh, 6px)' }}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        style={{
          ...BASE_FONT,
          fontSize: 'clamp(10px, 2.5vw, 13px)',
          color: '#d4a843',
          background: 'rgba(212,168,67,0.08)',
          border: '1px solid rgba(212,168,67,0.25)',
          borderRadius: 4,
          padding: '3px 10px',
          cursor: 'pointer',
          pointerEvents: 'auto',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
        }}
      >
        <span style={{
          display: 'inline-block',
          transform: open ? 'rotate(90deg)' : 'rotate(0deg)',
          transition: 'transform 0.2s ease',
          fontSize: '0.8em',
        }}>
          ▶
        </span>
        {projects.length} projects
      </button>
      {open && (
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 'clamp(4px, 1vw, 6px)',
          marginTop: 'clamp(4px, 0.5vh, 8px)',
          paddingLeft: 4,
        }}>
          {projects.map((p) => {
            const style: React.CSSProperties = {
              ...BASE_FONT,
              fontSize: 'clamp(9px, 2.2vw, 12px)',
              color: 'rgba(255,255,255,0.75)',
              padding: '2px 6px',
              border: '1px solid rgba(212,168,67,0.25)',
              borderRadius: 4,
              background: 'rgba(212,168,67,0.08)',
              lineHeight: 1.3,
              whiteSpace: 'nowrap',
            }

            return p.link !== '#' ? (
              <a key={p.title} href={p.link} target="_blank" rel="noopener noreferrer"
                 style={{
                   ...style,
                   textDecoration: 'none',
                   pointerEvents: 'auto',
                   color: '#ffffff',
                   display: 'inline-flex',
                   alignItems: 'center',
                   gap: 3,
                 }}>
                {p.title}
                <span style={{ fontSize: '0.8em', opacity: 0.6 }}>🔗</span>
              </a>
            ) : (
              <span key={p.title} style={{ ...style, color: 'rgba(255,255,255,0.5)' }}>{p.title}</span>
            )
          })}
        </div>
      )}
    </div>
  )
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
        minHeight: isMobile ? 'auto' : 'clamp(48px, 5vh, 62px)',
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
        minHeight: isMobile ? 'auto' : 'clamp(50px, 6vh, 74px)',
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
      {isMobile ? (
        <MobileProjectToggle projects={item.projects} />
      ) : (
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
                      aria-label={`${project.title} on ${project.tech || 'web'}`}
                      style={{
                        color: '#ffffff',
                        textDecoration: 'underline',
                        textDecorationColor: 'rgba(212,168,67,0.4)',
                        textUnderlineOffset: 3,
                        pointerEvents: 'auto',
                        cursor: 'pointer',
                        transition: 'color 0.2s, text-decoration-color 0.2s',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = '#5b9bf5'
                        e.currentTarget.style.textDecorationColor = 'rgba(91,155,245,0.5)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = '#ffffff'
                        e.currentTarget.style.textDecorationColor = 'rgba(212,168,67,0.4)'
                      }}
                    >
                      {project.title}
                      <span style={{ marginLeft: 4, fontSize: '0.85em', opacity: 0.6 }}>🔗</span>
                    </a>
                  ) : (
                    <span style={{ color: 'rgba(255,255,255,0.55)' }}>
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

function BottomStrip({ local, isMobile, isTablet }: { local: number; isMobile: boolean; isTablet: boolean }) {
  const stripOpacity = fadeIn(local, 0.24, 0.04)
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
      right: isMobile ? '5%' : isTablet ? '80px' : 'clamp(140px, 15vw, 220px)',
      pointerEvents: 'auto' as const,
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
            bottom: 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 'clamp(16px, 8vw, 100px)',
            flexWrap: 'wrap' as const,
          }}>
            <div style={statStyle}>
              <div style={bigNum}>2,000</div>
              <div style={label}>TAO received</div>
            </div>
            <div style={statStyle}>
              <div style={{ ...bigNum, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                2,356
                <InfoTooltip
                  items={[
                    { label: 'Main donor', amount: '2,000' },
                    { label: 'Staking rewards', amount: '170' },
                    { label: 'SN38 donation', amount: '186' },
                  ]}
                  isMobile={isMobile}
                />
              </div>
              <div style={label}>TAO deployed</div>
            </div>
            <div style={statStyle}>
              <div style={bigNum}>15</div>
              <div style={label}>Team Members</div>
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
            bottom: 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 'clamp(16px, 8vw, 100px)',
            flexWrap: 'wrap' as const,
          }}>
            <div style={statStyle}>
              <div style={bigNum}>{PR_STATS_DATA.prsAuthored}</div>
              <div style={label}>{PR_STATS_DATA.prsAuthoredLabel}</div>
            </div>
            <div style={statStyle}>
              <div style={bigNum}>{PR_STATS_DATA.prsInvolved}</div>
              <div style={label}>{PR_STATS_DATA.prsInvolvedLabel}</div>
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
                      fontSize: 'clamp(11px, 1.7vw, 20px)',
                      fontWeight: 500,
                      lineHeight: 1,
                      color: '#ffffff',
                      textDecoration: 'none',
                      letterSpacing: -0.5,
                      transition: 'color 0.3s',
                      whiteSpace: 'nowrap',
                      padding: '6px 4px',
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
  const isTablet = useIsTablet()

  if (progress < ENTER || progress > EXIT) return null

  const local = (progress - ENTER) / TOTAL

  // Global fade-out — finish before book frames appear (~frame 1340)
  const globalFade = local > 0.75
    ? Math.max(0, 1 - (local - 0.75) / 0.08)
    : 1

  if (globalFade <= 0) return null

  // Grid + bottom strip fade-out envelope
  const gridStripOp = local < 0.70 ? 1 : local > 0.75 ? 0 : 1 - (local - 0.70) / 0.05

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
            top: 0,
            left: '5%',
            right: isMobile ? '5%' : isTablet ? '80px' : 'clamp(140px, 15vw, 220px)',
            bottom: isMobile ? 'clamp(100px, 16vh, 160px)' : 'clamp(120px, 18vh, 180px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            overflowY: (isMobile || isTablet) ? 'auto' : ('visible' as const),
          }}>
            <div style={{
              background: 'rgba(0, 0, 0, 0.45)',
              backdropFilter: 'blur(8px)',
              borderRadius: 12,
              padding: 'clamp(16px, 2.5vh, 28px) clamp(20px, 3vw, 40px)',
              display: 'flex',
              flexDirection: 'column' as const,
              alignItems: 'center',
              opacity: fadeIn(local, 0.0, 0.04),
              transition: 'opacity 0.3s ease',
            }}>
            {/* Title */}
            <div style={{
              ...BASE_FONT,
              opacity: fadeIn(local, 0.0, 0.04),
              transform: `translateY(${(1 - fadeIn(local, 0.0, 0.04)) * 10}px)`,
              fontSize: 'clamp(18px, 2.5vw, 36px)',
              fontWeight: 500,
              letterSpacing: 'clamp(3px, 0.6vw, 8px)',
              textTransform: 'uppercase',
              color: '#ffffff',
              marginBottom: isMobile ? 'clamp(8px, 2vh, 16px)' : 'clamp(12px, 2vh, 24px)',
            }}>
              Projects since 2025
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile || isTablet ? '1fr' : 'repeat(3, 1fr)',
              gap: isMobile ? 'clamp(10px, 2vw, 16px)' : isTablet ? 'clamp(16px, 3vw, 32px)' : 'clamp(32px, 5vw, 72px)',
              maxWidth: 'min(85vw, 1200px)',
              width: '100%',
            }}>
              {BREAKDOWN_ITEMS.map((item, i) => {
                const itemOpacity = fadeIn(local, 0.02 + i * STAGGER, 0.04)
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
          <BottomStrip local={local} isMobile={isMobile} isTablet={isTablet} />
        </div>
      )}
    </div>
  )
}
