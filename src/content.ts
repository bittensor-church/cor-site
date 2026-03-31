// ============================================================
// CoR v2 — All content in one file for easy editing
// Change text, numbers, timings here. No need to touch components.
// ============================================================

// --- Section definitions (video + audio paths) ---

export const SECTIONS = [
  { id: 'main', frameDir: '/assets/frames', frameCount: 2166 },
] as const

// --- Navigation labels ---

export type NavLabels = Record<string, string>

export const NAV_LABELS: NavLabels = {
  'main': 'Flow SceneBuilder',
}

// --- Pillar labels (section: pillars) ---

export const PILLAR_LABELS = [
  { label: 'Consensus', enterAt: 0.02, exitAt: 0.18 },
  { label: 'Integrity', enterAt: 0.16, exitAt: 0.34 },
  { label: 'Security', enterAt: 0.32, exitAt: 0.50 },
  { label: 'Observability', enterAt: 0.48, exitAt: 0.67 },
  { label: 'Developer Experience', enterAt: 0.65, exitAt: 0.83 },
  { label: 'Adoption', enterAt: 0.81, exitAt: 0.98 },
]

// --- Token flow data (section: tokens) ---

export interface TokenCategory {
  name: string
  projects: string
}

export interface TokenFlowData {
  title: string
  totalOutflowLabel: string
  totalOutflowAmount: string
  totalOutflowUnit: string
  inflowLabel: string
  inflowAmount: string
  inflowUnit: string
  netLabel: string
  netAmount: string
  netUnit: string
  netColor: string
  netSubtext: string
  categories: TokenCategory[]
  totalLabel: string
  totalAmount: string
}

export const TOKEN_FLOW_DATA: TokenFlowData = {
  title: 'We took tokens. Here\'s every TAO.',
  totalOutflowLabel: 'Total Outflow',
  totalOutflowAmount: '2,356',
  totalOutflowUnit: 'TAO',
  inflowLabel: 'Inflow',
  inflowAmount: '2,000',
  inflowUnit: 'TAO',
  netLabel: 'Net',
  netAmount: '-356',
  netUnit: 'TAO',
  netColor: '#ff6b6b',
  netSubtext: '118% of inflow deployed',
  categories: [
    {
      name: 'Consensus Integrity',
      projects: 'commit-reveal \u00b7 Yuma3 \u00b7 WeightCopier \u00b7 yuma3 simulator \u00b7 why-burn \u00b7 burn \u00b7 superburn',
    },
    {
      name: 'Security',
      projects: 'DDoS Shield \u00b7 pylon \u00b7 collateral-contracts \u00b7 golden-validator',
    },
    {
      name: 'Observability',
      projects: 'Grafana \u00b7 prometheus proxy \u00b7 bittensor sentinel \u00b7 system-events \u00b7 reliable-subtensor',
    },
    {
      name: 'Developer Experience',
      projects: 'taokit \u00b7 taocli \u00b7 rail-contracts \u00b7 treasury contract',
    },
    {
      name: 'Adoption',
      projects: 'nexus \u00b7 bits \u00b7 forum \u00b7 Discord',
    },
  ],
  totalLabel: 'TOTAL',
  totalAmount: '2,356 TAO',
}

// --- PR Stats data (section: tokens — right panel) ---

export interface RepoStat {
  readonly name: string
  readonly prs: number
}

export interface VerifyLink {
  readonly name: string
  readonly url: string
}

export interface PrStatsData {
  readonly title: string
  readonly prsAuthored: number
  readonly prsAuthoredLabel: string
  readonly prsInvolved: number
  readonly prsInvolvedLabel: string
  readonly verifyLinks: readonly VerifyLink[]
  readonly topRepos: readonly RepoStat[]
  readonly remainingReposCount: number
}

export const PR_STATS_DATA: PrStatsData = {
  title: 'We shipped code. All of it public.',
  prsAuthored: 273,
  prsAuthoredLabel: 'PRs in bittensor-church',
  prsInvolved: 78,
  prsInvolvedLabel: 'PRs in opentensor',
  verifyLinks: [
    { name: 'PR stats', url: 'https://github.com/bittensor-church' },
  ],
  topRepos: [
    { name: 'bittensor-pylon', prs: 60 },
    { name: 'bt-ddos-shield', prs: 38 },
    { name: 'turbobt', prs: 26 },
    { name: 'yuma-simulation', prs: 25 },
    { name: 'interactive-yuma-simulator', prs: 21 },
    { name: 'collateral-contracts', prs: 19 },
    { name: 'nexus-poc', prs: 18 },
    { name: 'sentinel-tower', prs: 10 },
  ],
  remainingReposCount: 9,
}

// --- Roadmap data (section: roadmap) ---

export interface RoadmapItem {
  category: string
  projects: string
}

export interface RoadmapData {
  year1: string
  year1Items: RoadmapItem[]
  year1ToolsCount: string
  year2: string
  year2Items: RoadmapItem[]
}

export const ROADMAP_DATA: RoadmapData = {
  year1: '2025',
  year1Items: [
    { category: 'Consensus Integrity', projects: 'commit-reveal \u00b7 Yuma3 \u00b7 WeightCopier \u00b7 yuma3 simulator \u00b7 why-burn \u00b7 burn \u00b7 superburn' },
    { category: 'Security', projects: 'DDoS Shield \u00b7 collateral-contracts \u00b7 golden-validator' },
    { category: 'Observability', projects: 'Grafana \u00b7 prometheus proxy \u00b7 bittensor sentinel \u00b7 system-events \u00b7 reliable-subtensor \u00b7 github-contributors' },
    { category: 'Developer Experience', projects: 'taokit \u00b7 taocli \u00b7 rail-contracts \u00b7 treasury contract' },
    { category: 'Adoption', projects: 'bits \u00b7 forum \u00b7 Discord' },
  ],
  year1ToolsCount: '25 tools.',
  year2: '2026',
  year2Items: [
    { category: 'Adoption', projects: 'nexus \u00b7 pylon \u00b7 discord bots' },
  ],
}

// --- Dev calls data (section: dev-calls) ---

export interface DevCallLine {
  text: string
  start: number
  isTitle: boolean
}

export const DEV_CALLS_LINES: DevCallLine[] = [
  { text: '54 dev calls taught us three things.', start: 0.02, isTitle: true },
  { text: 'Listening works.', start: 0.28, isTitle: false },
  { text: "Building in silence doesn't.", start: 0.50, isTitle: false },
  { text: 'Adoption is the next problem to solve.', start: 0.72, isTitle: false },
]

// --- Story sections data ---

export const WEIGHT_WAR_STORY = {
  title: "Weight copiers lost. We're finishing the job.",
  description: "Validators were copying weights instead of doing real work — earning rewards without contributing. We shipped commit-reveal, Liquid Alpha, and Yuma3. Copying dropped. The war isn't over, but they're losing.",
  projects: 'commit-reveal · Liquid Alpha · Yuma3 · WeightCopier · yuma3 simulator · why-burn · burn · superburn',
}

export const COMMUNITY_STORY = {
  title: '54 dev calls. Every Tuesday. Open to everyone.',
  description: 'Subnet owners bring problems. We bring solutions. Validators flag vulnerabilities. We ship patches. Thousands of messages. 54 open mic sessions. The community shapes what we build.',
  projects: 'forum.bittensor.church \u00b7 Church of Rao Discord',
}
