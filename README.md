# CoR v2 — Church of Rao Website

Scroll-driven storytelling site for the Church of Rao — an independent team building critical infrastructure for the Bittensor ecosystem.

**Live:** https://cor-v2-two.vercel.app

## Tech Stack

- **React 19** + **TypeScript** + **Vite**
- Scroll-hijacked navigation (custom `useScrollProgress` hook)
- Frame-by-frame video playback synced to scroll position (2166 frames)
- No routing library — single-page with overlay-based sections
- Deployed on **Vercel**

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Video Frames

The site requires pre-rendered video frames in `public/assets/frames/`. These are not tracked in git (see `.gitignore`). Each frame is a JPEG file named sequentially (`0001.jpg`, `0002.jpg`, ... `2166.jpg`).

## Project Structure

```
src/
  App.tsx                  # Main app — section order, deep links, scroll setup
  content.ts               # ALL editable content (text, numbers, links)
  components/
    HeroOverlay.tsx        # Intro section — "Independent builders..."
    ProblemsOverlay.tsx    # Three problem categories
    WindowMask.tsx         # Visual transition mask
    AchievementOverlay.tsx # Weight copying war achievement
    OverviewOverlay.tsx    # Projects breakdown + PR stats + TAO strip
    BookMask.tsx           # Visual transition mask
    VisionOverlay.tsx      # "Next Chapter" — vision section
    NexusOverlay.tsx       # Nexus product section
    SupportOverlay.tsx     # Support CTA — wallet, socials, Discord
    SideNav.tsx            # Right-side navigation dots
    MusicToggle.tsx        # Music player + social links
    VideoSection.tsx       # Frame-by-frame video renderer
  hooks/
    useScrollProgress.ts   # Scroll/touch/keyboard → 0-1 progress
    useIsMobile.ts         # Responsive breakpoint hooks
  utils/
    animations.ts          # fadeIn helper
    styles.ts              # BASE_FONT shared style
  ui/
    LoadingScreen.tsx      # Initial loading screen
```

## How the Site Works

### Scroll-Driven Architecture

The entire site is controlled by a single `progress` value (0.0 to 1.0). Scrolling (wheel, touch swipe, keyboard) moves this value forward/backward. Each overlay component defines its own `ENTER` and `EXIT` progress thresholds — it renders only when `progress` is within that range.

```
progress:  0.0 ──────────────────────────────────── 1.0

Sections:  Hero  Problems  Achievement  Overview  Vision  Nexus  Support
           0.00  0.28      0.40         0.52      0.73    0.87   0.97
```

### Video Sync

`VideoSection` maps the current `sectionProgress` to a frame number (0–2166) and displays the corresponding JPEG. This creates a scroll-controlled video effect.

### Navigation

- **SideNav** (right side): Clickable dots that jump to sections via `setProgress(target)`
- **Deep links**: URLs like `/#nexus` work on first load (hash is cleared after navigation)
- **Keyboard**: Arrow keys, PageUp/Down, Home/End

## How to Edit Content

### Editing Text, Numbers, and Links

**All content lives in `src/content.ts`.** You do not need to touch component files to change text.

#### TAO Flow Data

```typescript
// src/content.ts — TOKEN_FLOW_DATA
export const TOKEN_FLOW_DATA: TokenFlowData = {
  title: 'We took tokens. Here\'s every TAO.',
  totalOutflowAmount: '2,170',      // Change TAO amounts here
  inflowAmount: '2,000',
  netAmount: '-170',
  categories: [                      // Add/remove/edit categories
    { name: 'Consensus Integrity', projects: 'commit-reveal · Yuma3 · ...' },
    // ...
  ],
}
```

#### PR Stats

```typescript
// src/content.ts — PR_STATS_DATA
export const PR_STATS_DATA: PrStatsData = {
  totalPrs: 413,                     // Total merged PRs
  prsAuthored: 314,                  // PRs authored by CoR
  prsInvolved: 99,                   // PRs in external repos (opentensor)
  verifyLinks: [
    { name: 'PR stats', url: 'https://github.com/bittensor-church' },
  ],
}
```

#### Roadmap

```typescript
// src/content.ts — ROADMAP_DATA
export const ROADMAP_DATA: RoadmapData = {
  year1: '2025',
  year1Items: [
    { category: 'Consensus Integrity', projects: 'commit-reveal · Yuma3 · ...' },
    // Add or edit items here
  ],
  year2: '2026',
  year2Items: [
    { category: 'Adoption', projects: 'nexus · pylon · discord bots' },
  ],
}
```

#### Dev Calls

```typescript
// src/content.ts — DEV_CALLS_LINES
export const DEV_CALLS_LINES: DevCallLine[] = [
  { text: '54 dev calls taught us three things.', start: 0.02, isTitle: true },
  { text: 'Listening works.', start: 0.28, isTitle: false },
  // ...
]
```

#### Stories (Achievement, Community)

```typescript
// src/content.ts — WEIGHT_WAR_STORY, COMMUNITY_STORY
export const WEIGHT_WAR_STORY = {
  title: "Weight copiers lost. We're finishing the job.",
  description: "Validators were copying weights...",
  projects: 'commit-reveal · Liquid Alpha · Yuma3 · ...',
}
```

### Editing Section Timing

Each overlay component has `ENTER` and `EXIT` constants at the top of the file. These control when the section appears/disappears during scroll:

```typescript
// Example from NexusOverlay.tsx
const ENTER = 0.8698   // frame 1884 — section appears
const EXIT = 0.9441    // frame 2045 — section disappears
```

To shift a section earlier/later, adjust these values. The valid range is 0.0–1.0.

### Editing Projects in the Overview Grid

The project breakdown grid in `OverviewOverlay.tsx` has its own data (`BREAKDOWN_ITEMS`) at the top of the file. Each item has:

```typescript
{
  name: 'Protocol Fairness & Network Safety',
  description: 'Improving incentive alignment...',
  percentage: 25,           // % of total TAO
  taoAmount: 543,           // TAO amount
  projects: [
    { title: 'DDoS shield', link: 'https://github.com/...', tech: 'python' },
    // Add projects here — tech: 'rust' | 'python' | 'smart contract' | 'community'
  ],
}
```

### Editing the Wallet Address

The TAO wallet address is in `SupportOverlay.tsx`, displayed as a link to the taostats explorer. Search for `5Cov` to find it.

### Editing Navigation Labels

Side navigation labels are in `SideNav.tsx`. The `HASH_SECTIONS` array in `App.tsx` maps hash names to scroll positions.

## Design System

| Role | Font Weight | Color | Example |
|------|------------|-------|---------|
| Section label (gold, uppercase) | 700 | `#d4a843` | "PROBLEMS", "NEXT CHAPTER" |
| Heading (white) | 600–700 | `#ffffff` | "Protocol Fairness & Network Safety" |
| Body text | 400 | `rgba(255,255,255,0.85)` | Descriptions, paragraphs |
| Small label (gold, uppercase) | 300 | `#d4a843` | "TAO Wallet", "PRs merged" |
| Accent / italic | 400 italic | `#d4a843` or `rgba(212,168,67,0.7)` | Problem descriptions |

**Shared tokens:**
- Background cards: `rgba(0, 0, 0, 0.45)` + `backdrop-filter: blur(8px)` + `border-radius: 12px`
- Font: IBM Plex Mono (monospace)
- Gold accent: `#d4a843`
- Text shadow: `0 2px 12px rgba(0,0,0,0.6)`

## Deployment

Vercel auto-deploy is **not connected** (Git integration issue). Deploy manually:

```bash
# 1. Build locally to verify
npm run build

# 2. Push to both remotes
git push origin master
# Switch to piotrgerke95 account for private remote
git push private master

# 3. Deploy to Vercel
npx vercel --prod
```

The site is aliased at https://cor-v2-two.vercel.app.
