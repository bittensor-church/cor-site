import { PR_STATS_DATA } from '../content'

interface OverviewOverlayProps {
  progress: number
}

const ENTER = 0.749
const EXIT = 0.94
const TOTAL = EXIT - ENTER
const FADE_OUT_START = 0.90

// Phase boundaries (local 0–1)
const SUMMARY_RANGE = 0.45
const SUMMARY_FADE_OUT_START = 0.42
const SUMMARY_FADE_OUT_END = 0.55
const STRIP_FADE_IN_START = 0.48
const GRID_PHASE_START = 0.52

const PROBLEMS = [
  'Strengthening Protocol Integrity',
  'Protecting Network Participants',
  'Increasing Network Transparency',
  'Enabling Ecosystem Coordination',
  'Lowering the Barrier to Building on Bittensor',
  'Improving Subnet Operations',
]

interface Project {
  title: string
  link?: string
}

interface ProblemSection {
  number: number
  name: string
  subtitle: string
  projects: Project[]
}

const SECTIONS: ProblemSection[] = [
  {
    number: 1,
    name: 'Strengthening Protocol Integrity',
    subtitle: 'Reducing incentive manipulation and ensuring predictable protocol behavior.',
    projects: [
      { title: 'bittensor-why-burn', link: 'https://github.com/bittensor-church/bittensor-why-burn' },
      { title: 'burn', link: 'https://github.com/bittensor-church/burn' },
      { title: 'superburn', link: 'https://github.com/bittensor-church/superburn' },
      { title: 'commit reveal' },
      { title: 'golden-validator' },
      { title: 'WeightCopier' },
    ],
  },
  {
    number: 2,
    name: 'Protecting Network Participants',
    subtitle: 'Mitigating attacks and structural disadvantages affecting miners and validators.',
    projects: [
      { title: 'yuma3' },
      { title: 'DDoS shield', link: 'https://github.com/bittensor-church/bt-ddos-shield' },
      { title: 'collateral smart contract', link: 'https://github.com/bittensor-church/collateral-contracts' },
    ],
  },
  {
    number: 3,
    name: 'Increasing Network Transparency',
    subtitle: 'Making on-chain activity observable, measurable, and easier to understand.',
    projects: [
      { title: 'grafana', link: 'https://grafana.bactensor.io' },
      { title: 'bittensor-sentinel', link: 'https://github.com/bittensor-church/sentinel' },
      { title: 'system-events' },
      { title: 'discord bots' },
      { title: 'cor discord', link: 'https://discord.gg/NCherfe5HQ' },
    ],
  },
  {
    number: 4,
    name: 'Enabling Ecosystem Coordination',
    subtitle: 'Supporting collaboration, discussion, and community governance.',
    projects: [
      { title: 'bits', link: 'https://github.com/bittensor-church/bits' },
      { title: 'forum', link: 'https://forum.bittensor.church/' },
      { title: 'github-contributors' },
    ],
  },
  {
    number: 5,
    name: 'Lowering the Barrier to Building on Bittensor',
    subtitle: 'Simplifying development and accelerating subnet creation.',
    projects: [
      { title: 'taokit' },
      { title: 'pylon', link: 'https://github.com/bittensor-church/bittensor-pylon' },
      { title: 'nexus', link: 'https://github.com/bittensor-church/nexus-poc' },
    ],
  },
  {
    number: 6,
    name: 'Improving Subnet Operations',
    subtitle: 'Providing infrastructure for reliable subnet management and long-term sustainability.',
    projects: [
      { title: 'rails contract', link: 'https://github.com/bittensor-church/rail-contracts' },
      { title: 'treasury contract' },
      { title: 'prometheus proxy' },
      { title: 'yuma3 simulator', link: 'https://github.com/bittensor-church/interactive-yuma-simulator' },
    ],
  },
]

const LEFT_COL = SECTIONS.slice(0, 3)
const RIGHT_COL = SECTIONS.slice(3, 6)

function fadeIn(local: number, start: number, duration: number = 0.04): number {
  if (local < start) return 0
  if (local > start + duration) return 1
  return (local - start) / duration
}

function truncateRepo(name: string, maxLen: number = 22): string {
  return name.length > maxLen ? name.slice(0, maxLen - 2) + '..' : name
}

function getSummaryOpacity(local: number): number {
  if (local < 0) return 0
  if (local < SUMMARY_FADE_OUT_START) return 1
  if (local > SUMMARY_FADE_OUT_END) return 0
  return 1 - (local - SUMMARY_FADE_OUT_START) / (SUMMARY_FADE_OUT_END - SUMMARY_FADE_OUT_START)
}

function getStripOpacity(local: number): number {
  if (local < STRIP_FADE_IN_START) return 0
  if (local < GRID_PHASE_START) {
    return (local - STRIP_FADE_IN_START) / (GRID_PHASE_START - STRIP_FADE_IN_START)
  }
  if (local < FADE_OUT_START) return 1
  if (local >= 1) return 0
  return Math.max(0, 1 - (local - FADE_OUT_START) / (1 - FADE_OUT_START))
}

function getGridOpacity(local: number): number {
  if (local < GRID_PHASE_START) return 0
  if (local < FADE_OUT_START) return 1
  if (local >= 1) return 0
  return Math.max(0, 1 - (local - FADE_OUT_START) / (1 - FADE_OUT_START))
}

function SummaryPanels({ local, opacity }: { local: number; opacity: number }) {
  const summaryLocal = local / SUMMARY_RANGE

  const font: React.CSSProperties = {
    fontFamily: "'IBM Plex Mono', monospace",
    color: '#ffffff',
  }

  // Left panel timings
  const titleOpacity = fadeIn(summaryLocal, 0.0)
  const totalOpacity = fadeIn(summaryLocal, 0.06)
  const inflowOpacity = fadeIn(summaryLocal, 0.14)
  const morphProgress = fadeIn(summaryLocal, 0.32, 0.06)
  const showDelta = morphProgress > 0
  const tableHeaderOpacity = fadeIn(summaryLocal, 0.38)

  // Right panel timings
  const prTitleOpacity = fadeIn(summaryLocal, 0.08)
  const prBigNumOpacity = fadeIn(summaryLocal, 0.14)
  const prSubStatOpacity = fadeIn(summaryLocal, 0.20)
  const prTableHeaderOpacity = fadeIn(summaryLocal, 0.44)
  const prFooterOpacity = fadeIn(summaryLocal, 0.82)

  return (
    <div style={{ opacity, position: 'absolute', inset: 0 }}>
      {/* Left panel — Token Flow */}
      <div style={{
        position: 'absolute',
        top: '12%',
        left: '5%',
        maxWidth: 'clamp(300px, 42vw, 560px)',
        ...font,
      }}>
        {/* Title */}
        <div style={{
          opacity: titleOpacity,
          transform: `translateY(${(1 - titleOpacity) * 10}px)`,
          fontSize: 'clamp(11px, 1.3vw, 15px)',
          fontWeight: 300,
          letterSpacing: 3,
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.5)',
          marginBottom: 'clamp(16px, 3vh, 32px)',
          textShadow: '0 2px 12px rgba(0,0,0,0.6)',
        }}>
          We took tokens. Here&apos;s every TAO.
        </div>

        {/* Total outflow - big number */}
        <div style={{
          opacity: totalOpacity,
          transform: `translateY(${(1 - totalOpacity) * 12}px)`,
          marginBottom: 'clamp(8px, 1.5vh, 16px)',
        }}>
          <div style={{
            fontSize: 'clamp(10px, 1.1vw, 13px)',
            fontWeight: 400,
            letterSpacing: 2,
            color: 'rgba(255,255,255,0.4)',
            textTransform: 'uppercase',
            marginBottom: 4,
            textShadow: '0 2px 12px rgba(0,0,0,0.6)',
          }}>
            Total Outflow
          </div>
          <div style={{
            fontSize: 'clamp(36px, 5vw, 64px)',
            fontWeight: 500,
            letterSpacing: -1,
            lineHeight: 1,
            textShadow: '0 2px 20px rgba(255,255,255,0.15)',
          }}>
            2,170 <span style={{ fontSize: '0.5em', fontWeight: 300, letterSpacing: 2 }}>TAO</span>
          </div>
        </div>

        {/* Inflow -> Delta morph */}
        <div style={{
          opacity: inflowOpacity,
          transform: `translateY(${(1 - inflowOpacity) * 10}px)`,
          marginBottom: 'clamp(20px, 4vh, 40px)',
          overflow: 'hidden',
        }}>
          <div style={{
            fontSize: 'clamp(10px, 1.1vw, 13px)',
            fontWeight: 400,
            letterSpacing: 2,
            color: 'rgba(255,255,255,0.4)',
            textTransform: 'uppercase',
            marginBottom: 4,
            textShadow: '0 2px 12px rgba(0,0,0,0.6)',
          }}>
            {showDelta ? 'Net' : 'Inflow'}
          </div>
          <div style={{
            fontSize: 'clamp(24px, 3.5vw, 44px)',
            fontWeight: 500,
            letterSpacing: -1,
            lineHeight: 1,
            color: showDelta ? '#ff6b6b' : '#ffffff',
            transition: 'color 0.4s ease',
          }}>
            {showDelta ? (
              <>-170 <span style={{ fontSize: '0.5em', fontWeight: 300, letterSpacing: 2 }}>TAO</span></>
            ) : (
              <>2,000 <span style={{ fontSize: '0.5em', fontWeight: 300, letterSpacing: 2 }}>TAO</span></>
            )}
          </div>
          {showDelta && (
            <div style={{
              fontSize: 'clamp(9px, 1vw, 12px)',
              color: '#ff6b6b99',
              marginTop: 4,
              opacity: morphProgress,
              letterSpacing: 1,
            }}>
              108% of inflow deployed
            </div>
          )}
        </div>

        {/* Table */}
        <div style={{
          opacity: tableHeaderOpacity,
          transform: `translateY(${(1 - tableHeaderOpacity) * 10}px)`,
        }}>
          {/* Header */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            borderBottom: '1px solid rgba(255,255,255,0.15)',
            paddingBottom: 6,
            marginBottom: 8,
            fontSize: 'clamp(8px, 0.9vw, 11px)',
            fontWeight: 400,
            letterSpacing: 2,
            color: 'rgba(255,255,255,0.35)',
            textTransform: 'uppercase',
            textShadow: '0 2px 12px rgba(0,0,0,0.6)',
          }}>
            <span>Problem</span>
            <span>Addressed</span>
          </div>

          {/* Rows */}
          {PROBLEMS.map((problem, i) => {
            const rowStart = 0.42 + i * 0.06
            const rowOpacity = fadeIn(summaryLocal, rowStart)

            return (
              <div
                key={problem}
                style={{
                  opacity: rowOpacity,
                  transform: `translateY(${(1 - rowOpacity) * 8}px)`,
                  borderBottom: '1px solid rgba(255,255,255,0.06)',
                  paddingBottom: 'clamp(6px, 1vh, 10px)',
                  marginBottom: 'clamp(6px, 1vh, 10px)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div style={{
                  fontSize: 'clamp(11px, 1.3vw, 15px)',
                  fontWeight: 500,
                  letterSpacing: 1,
                  textShadow: '0 2px 12px rgba(0,0,0,0.6)',
                  flex: 1,
                }}>
                  {problem}
                </div>
                <div style={{
                  fontSize: 'clamp(14px, 1.8vw, 20px)',
                  fontWeight: 600,
                  color: '#d4a843',
                  marginLeft: 16,
                  textShadow: '0 2px 12px rgba(0,0,0,0.6)',
                }}>
                  ✕
                </div>
              </div>
            )
          })}

          {/* Total row */}
          {(() => {
            const totalRowOpacity = fadeIn(summaryLocal, 0.76)
            return (
              <div style={{
                opacity: totalRowOpacity,
                transform: `translateY(${(1 - totalRowOpacity) * 8}px)`,
                borderTop: '1px solid rgba(255,255,255,0.25)',
                paddingTop: 'clamp(8px, 1.2vh, 12px)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
              }}>
                <span style={{
                  fontSize: 'clamp(13px, 1.5vw, 18px)',
                  fontWeight: 500,
                  letterSpacing: 2,
                  textShadow: '0 2px 12px rgba(0,0,0,0.6)',
                }}>
                  TOTAL
                </span>
                <span style={{
                  fontSize: 'clamp(16px, 2vw, 24px)',
                  fontWeight: 500,
                  textShadow: '0 2px 12px rgba(0,0,0,0.6)',
                }}>
                  2,170 TAO
                </span>
              </div>
            )
          })()}
        </div>
      </div>

      {/* Right panel — PR Stats */}
      <div style={{
        position: 'absolute',
        top: '12%',
        right: '5%',
        maxWidth: 'clamp(300px, 42vw, 560px)',
        ...font,
      }}>
        {/* Subtitle */}
        <div style={{
          opacity: prTitleOpacity,
          transform: `translateY(${(1 - prTitleOpacity) * 10}px)`,
          fontSize: 'clamp(11px, 1.3vw, 15px)',
          fontWeight: 300,
          letterSpacing: 3,
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.5)',
          marginBottom: 'clamp(16px, 3vh, 32px)',
          textShadow: '0 2px 12px rgba(0,0,0,0.6)',
        }}>
          {PR_STATS_DATA.title}
        </div>

        {/* Big number — total PRs */}
        <div style={{
          opacity: prBigNumOpacity,
          transform: `translateY(${(1 - prBigNumOpacity) * 12}px)`,
          marginBottom: 'clamp(8px, 1.5vh, 16px)',
        }}>
          <div style={{
            fontSize: 'clamp(10px, 1.1vw, 13px)',
            fontWeight: 400,
            letterSpacing: 2,
            color: 'rgba(255,255,255,0.4)',
            textTransform: 'uppercase',
            marginBottom: 4,
            textShadow: '0 2px 12px rgba(0,0,0,0.6)',
          }}>
            {PR_STATS_DATA.totalLabel}
          </div>
          <div style={{
            fontSize: 'clamp(36px, 5vw, 64px)',
            fontWeight: 500,
            letterSpacing: -1,
            lineHeight: 1,
            textShadow: '0 2px 20px rgba(255,255,255,0.15)',
          }}>
            {PR_STATS_DATA.totalPrs} <span style={{ fontSize: '0.5em', fontWeight: 300, letterSpacing: 2 }}>merged</span>
          </div>
        </div>

        {/* Sub-stat */}
        <div style={{
          opacity: prSubStatOpacity,
          transform: `translateY(${(1 - prSubStatOpacity) * 10}px)`,
          fontSize: 'clamp(9px, 1vw, 12px)',
          color: 'rgba(255,255,255,0.4)',
          letterSpacing: 1,
          marginBottom: 'clamp(20px, 4vh, 40px)',
          textShadow: '0 2px 12px rgba(0,0,0,0.6)',
        }}>
          {PR_STATS_DATA.totalRepos} repos &middot; {PR_STATS_DATA.totalContributors} contributors
        </div>

        {/* Repo table */}
        <div style={{
          opacity: prTableHeaderOpacity,
          transform: `translateY(${(1 - prTableHeaderOpacity) * 10}px)`,
        }}>
          {/* Header */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            borderBottom: '1px solid rgba(255,255,255,0.15)',
            paddingBottom: 6,
            marginBottom: 8,
            fontSize: 'clamp(8px, 0.9vw, 11px)',
            fontWeight: 400,
            letterSpacing: 2,
            color: 'rgba(255,255,255,0.35)',
            textTransform: 'uppercase',
            textShadow: '0 2px 12px rgba(0,0,0,0.6)',
          }}>
            <span>Repository</span>
            <span>PRs</span>
          </div>

          {/* Rows */}
          {PR_STATS_DATA.topRepos.map((repo, i) => {
            const rowStart = 0.48 + i * 0.05
            const rowOpacity = fadeIn(summaryLocal, rowStart)

            return (
              <div
                key={repo.name}
                style={{
                  opacity: rowOpacity,
                  transform: `translateY(${(1 - rowOpacity) * 8}px)`,
                  borderBottom: '1px solid rgba(255,255,255,0.06)',
                  paddingBottom: 'clamp(6px, 1vh, 10px)',
                  marginBottom: 'clamp(6px, 1vh, 10px)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div style={{
                  fontSize: 'clamp(11px, 1.3vw, 15px)',
                  fontWeight: 500,
                  letterSpacing: 1,
                  textShadow: '0 2px 12px rgba(0,0,0,0.6)',
                  flex: 1,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}>
                  {truncateRepo(repo.name)}
                </div>
                <div style={{
                  fontSize: 'clamp(14px, 1.8vw, 20px)',
                  fontWeight: 400,
                  color: '#d4a843',
                  marginLeft: 16,
                  textShadow: '0 2px 12px rgba(0,0,0,0.6)',
                  minWidth: 32,
                  textAlign: 'right',
                }}>
                  {repo.prs}
                </div>
              </div>
            )
          })}

          {/* Footer — remaining repos */}
          <div style={{
            opacity: prFooterOpacity,
            transform: `translateY(${(1 - prFooterOpacity) * 8}px)`,
            borderTop: '1px solid rgba(255,255,255,0.25)',
            paddingTop: 'clamp(8px, 1.2vh, 12px)',
            fontSize: 'clamp(9px, 1vw, 12px)',
            color: 'rgba(255,255,255,0.35)',
            letterSpacing: 1,
            textShadow: '0 2px 12px rgba(0,0,0,0.6)',
          }}>
            + {PR_STATS_DATA.remainingReposCount} more repos
          </div>
        </div>
      </div>
    </div>
  )
}

function CompactStrip({ opacity }: { opacity: number }) {
  return (
    <div style={{
      opacity,
      transform: `translateY(${(1 - Math.min(1, opacity * 2)) * -8}px)`,
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      padding: 'clamp(14px, 2.5vh, 24px) 5%',
      fontFamily: "'IBM Plex Mono', monospace",
      fontSize: 'clamp(10px, 1.1vw, 14px)',
      letterSpacing: 1,
      textAlign: 'center',
      color: 'rgba(255,255,255,0.6)',
      borderBottom: '1px solid rgba(255,255,255,0.08)',
      textShadow: '0 2px 12px rgba(0,0,0,0.8)',
    }}>
      <span style={{ color: '#d4a843', fontWeight: 500 }}>2,170</span>{' '}TAO deployed
      <span style={{ margin: '0 clamp(8px, 1.5vw, 20px)', color: 'rgba(255,255,255,0.2)' }}>&middot;</span>
      <span style={{ color: '#d4a843', fontWeight: 500 }}>{PR_STATS_DATA.totalPrs}</span>{' '}PRs merged
      <span style={{ margin: '0 clamp(8px, 1.5vw, 20px)', color: 'rgba(255,255,255,0.2)' }}>&middot;</span>
      <span style={{ color: '#d4a843', fontWeight: 500 }}>{PR_STATS_DATA.totalRepos}</span>{' '}repos
      <span style={{ margin: '0 clamp(8px, 1.5vw, 20px)', color: 'rgba(255,255,255,0.2)' }}>&middot;</span>
      <span style={{ color: '#d4a843', fontWeight: 500 }}>{PR_STATS_DATA.totalContributors}</span>{' '}contributors
    </div>
  )
}

function SectionBlock({ section, opacity, translateY }: {
  section: ProblemSection
  opacity: number
  translateY: number
}) {
  return (
    <div style={{
      opacity,
      transform: `translateY(${translateY}px)`,
      willChange: 'opacity, transform',
      marginBottom: 'clamp(14px, 2.5vh, 28px)',
    }}>
      {/* Section number + name */}
      <div style={{
        fontFamily: "'IBM Plex Mono', monospace",
        fontWeight: 600,
        fontSize: 'clamp(13px, 1.5vw, 18px)',
        color: '#d4a843',
        letterSpacing: 'clamp(1px, 0.2vw, 2px)',
        textShadow: '0 2px 12px rgba(0,0,0,0.8)',
        marginBottom: 3,
      }}>
        {section.number}. {section.name}
      </div>

      {/* Subtitle */}
      <div style={{
        fontFamily: "'IBM Plex Mono', monospace",
        fontWeight: 300,
        fontSize: 'clamp(9px, 1vw, 13px)',
        color: 'rgba(255,255,255,0.4)',
        fontStyle: 'italic',
        letterSpacing: 0.5,
        lineHeight: 1.4,
        textShadow: '0 2px 10px rgba(0,0,0,0.8)',
        marginBottom: 'clamp(6px, 1vh, 10px)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        paddingBottom: 'clamp(4px, 0.8vh, 8px)',
      }}>
        {section.subtitle}
      </div>

      {/* Projects */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'clamp(4px, 0.8vh, 8px)',
      }}>
        {section.projects.map(project => {
          const content = (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'clamp(4px, 0.5vw, 8px)',
            }}>
              <span style={{
                color: '#d4a843',
                fontSize: 'clamp(8px, 0.8vw, 10px)',
                textShadow: '0 0 4px rgba(212,168,67,0.4)',
              }}>
                {'//'}
              </span>
              <span style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontWeight: 400,
                fontSize: 'clamp(14px, 1.6vw, 20px)',
                color: project.link ? '#ffffff' : 'rgba(255,255,255,0.55)',
                textDecoration: project.link ? 'underline' : 'none',
                textDecorationColor: 'rgba(212,168,67,0.4)',
                textUnderlineOffset: 3,
                textShadow: '0 2px 10px rgba(0,0,0,0.8)',
                letterSpacing: 0.5,
              }}>
                {project.title}
              </span>
            </div>
          )

          return project.link ? (
            <a
              key={project.title}
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: 'none', pointerEvents: 'auto', cursor: 'pointer' }}
            >
              {content}
            </a>
          ) : (
            <div key={project.title}>{content}</div>
          )
        })}
      </div>
    </div>
  )
}

function GridSection({ local, opacity }: { local: number; opacity: number }) {
  const gridLocal = (local - GRID_PHASE_START) / 0.25

  const headerOpacity = fadeIn(gridLocal, 0.0, 0.05)

  return (
    <div style={{
      opacity,
      position: 'absolute',
      inset: 0,
      pointerEvents: 'none',
      display: 'flex',
      flexDirection: 'column',
      padding: 'clamp(60px, 8vh, 80px) 5% clamp(20px, 4vh, 40px)',
    }}>
      {/* Header */}
      <div style={{
        opacity: headerOpacity,
        transform: `translateY(${(1 - headerOpacity) * 10}px)`,
        fontFamily: "'IBM Plex Mono', monospace",
        fontWeight: 700,
        fontSize: 'clamp(10px, 1.3vw, 15px)',
        color: '#d4a843',
        letterSpacing: 'clamp(4px, 0.8vw, 10px)',
        textTransform: 'uppercase',
        textShadow: '0 2px 12px rgba(0,0,0,0.8)',
        marginBottom: 'clamp(12px, 2.5vh, 28px)',
      }}>
        2025 Overview
      </div>

      {/* Two columns */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 'clamp(16px, 4vw, 48px)',
        flex: 1,
      }}>
        {/* Left column — sections 1-3 */}
        <div>
          {LEFT_COL.map((section, i) => {
            const sectionStart = 0.04 + i * 0.14
            const sectionOpacity = fadeIn(gridLocal, sectionStart, 0.06)
            const translateY = (1 - sectionOpacity) * 12
            return (
              <SectionBlock
                key={section.number}
                section={section}
                opacity={sectionOpacity}
                translateY={translateY}
              />
            )
          })}
        </div>

        {/* Right column — sections 4-6 */}
        <div>
          {RIGHT_COL.map((section, i) => {
            const sectionStart = 0.04 + i * 0.14
            const sectionOpacity = fadeIn(gridLocal, sectionStart, 0.06)
            const translateY = (1 - sectionOpacity) * 12
            return (
              <SectionBlock
                key={section.number}
                section={section}
                opacity={sectionOpacity}
                translateY={translateY}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}

export function OverviewOverlay({ progress }: OverviewOverlayProps) {
  if (progress < ENTER || progress > EXIT) return null

  const local = (progress - ENTER) / TOTAL

  const summaryOpacity = getSummaryOpacity(local)
  const stripOpacity = getStripOpacity(local)
  const gridOpacity = getGridOpacity(local)

  if (summaryOpacity === 0 && stripOpacity === 0 && gridOpacity === 0) return null

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      pointerEvents: 'none',
      zIndex: 5,
    }}>
      {summaryOpacity > 0 && (
        <SummaryPanels local={local} opacity={summaryOpacity} />
      )}
      {stripOpacity > 0 && (
        <CompactStrip opacity={stripOpacity} />
      )}
      {gridOpacity > 0 && (
        <GridSection local={local} opacity={gridOpacity} />
      )}
    </div>
  )
}
