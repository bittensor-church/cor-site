# CoR v2 — Full UX/UI/Responsiveness Audit Report

**Date:** 2026-03-06
**URL:** https://cor-v2-peach.vercel.app
**Auditor:** Claude Code (browser automation)
**Viewports tested:** 375x667 (Mobile S), 430x932 (Mobile L), 768x1024 (Tablet), 1440x900 (Desktop)

## Executive Summary

The site delivers a stunning scroll-driven cinematic experience with pre-rendered animation frames. The visual design is exceptional — cathedral imagery, golden typography, glass overlays with backdrop blur create a premium aesthetic. However, the audit reveals **3 critical**, **5 high**, and **7 medium** severity issues primarily around touch targets, breakpoint handling, and SideNav/content overlap.

---

## GIF Recordings

| Viewport | File | Size |
|----------|------|------|
| Desktop 1440x900 | `cor-audit-desktop-1440x900-scrollthrough.gif` | 8.9 MB |
| Mobile 375x667 | `cor-audit-mobile-375x667-scrollthrough.gif` | 2.1 MB |

---

## Findings

### CRITICAL

#### C1. SideNav touch targets fail WCAG 44x44px minimum (Mobile)
- **Severity:** CRITICAL
- **Viewports:** 375x667, 430x932
- **File:** `src/components/SideNav.tsx`
- **Description:** All 7 SideNav navigation buttons are far below the WCAG AA minimum touch target size of 44x44px on mobile. Measurements:
  - Intro: **16x19px**
  - Problems: **17x20px**
  - 2025 Highlights: **21x25px**
  - Team & Projects: **26x30px** (largest, still fails)
  - Vision: **21x25px**
  - Nexus: **17x20px**
  - Support Us: **16x19px**
- **Impact:** Users on mobile cannot reliably tap navigation dots. Frustrating UX, especially with no labels visible.
- **Fix:** Add `minWidth: 44, minHeight: 44` to the button wrapper, or use invisible padding to expand the tap area while keeping the visual dot small:
  ```tsx
  // In SideNav.tsx button styles
  padding: '12px',
  minWidth: '44px',
  minHeight: '44px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  ```

#### C2. 768px breakpoint gap — tablet renders desktop layout in cramped space
- **Severity:** CRITICAL
- **Viewports:** 768x1024
- **File:** `src/hooks/useIsMobile.ts`, `src/components/OverviewOverlay.tsx`
- **Description:** The `useIsMobile()` hook uses `< 768` as breakpoint, meaning exactly 768px (iPad portrait) renders as "desktop". The 3-column grid in OverviewOverlay at 768px causes:
  - Text columns too narrow, wrapping awkwardly
  - SideNav labels overlapping grid content
  - Bottom strip ("2,000 TAO / 2,170 TAO") overlapping project lists
- **Impact:** iPad users see a broken layout with overlapping elements.
- **Fix:** Change breakpoint to `<= 1024` or add a tablet breakpoint:
  ```ts
  // useIsMobile.ts — Option A: raise breakpoint
  const MOBILE_BREAKPOINT = 1024;

  // Option B: add useIsTablet hook
  export function useIsTablet() {
    return useMediaQuery('(max-width: 1024px)');
  }
  ```
  Then in OverviewOverlay, use 2-column grid for tablet:
  ```tsx
  gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)'
  ```

#### C3. SideNav labels overlapping overlay content on tablet and narrow desktop
- **Severity:** CRITICAL
- **Viewports:** 768x1024, partially on 1440x900
- **File:** `src/components/SideNav.tsx`, `src/components/OverviewOverlay.tsx`
- **Description:** SideNav labels (INTRO, PROBLEMS, 2025 HIGHLIGHTS, etc.) are positioned with `right: clamp(16px, 3vw, 32px)` and sit on top of overlay content, especially the OverviewOverlay 3-column grid. At 768px the labels directly overlap project names and descriptions.
- **Impact:** Content unreadable in Team & Projects section on tablet.
- **Fix:** Either:
  1. Add `paddingRight` to overlays that accounts for SideNav width (`clamp(120px, 15vw, 200px)`)
  2. Or hide SideNav labels on narrow viewports and show only dots
  3. Or use a lower z-index for SideNav when overlays are active

---

### HIGH

#### H1. Social icon touch targets too small (Mobile)
- **Severity:** HIGH
- **Viewports:** 375x667, 430x932
- **File:** `src/components/SupportOverlay.tsx`, `src/App.tsx` (FOLLOW US section)
- **Description:** Social media link icons (X, GitHub, Discord, Subnet) measure **30x30px** — below the 44px minimum.
- **Fix:** Increase icon wrapper size or add padding:
  ```tsx
  // Social links wrapper
  padding: '7px', // (30 + 14 = 44px total touch area)
  ```

#### H2. Mobile SideNav — no section labels, only dots
- **Severity:** HIGH
- **Viewports:** 375x667, 430x932
- **File:** `src/components/SideNav.tsx`
- **Description:** On mobile, the SideNav hides all text labels (`!isMobile && <span>...`) and shows only small dots. Users have no way to identify which section a dot represents without tapping it, making navigation trial-and-error.
- **Impact:** Navigation context completely lost on mobile. Users must guess sections.
- **Fix:** Add abbreviated labels visible on mobile, or show label on hover/tap:
  ```tsx
  // Option: Show abbreviated labels on mobile
  {isMobile ? item.label.slice(0, 3).toUpperCase() : item.label}
  ```

#### H3. "FOLLOW US" section overlaps overlay content on mobile
- **Severity:** HIGH
- **Viewports:** 375x667, 430x932
- **File:** `src/App.tsx`
- **Description:** The "FOLLOW US" label and social icons at the bottom-right are always visible (fixed position) and overlap with overlay content, particularly on SupportOverlay and OverviewOverlay bottom strip statistics.
- **Fix:** Hide "FOLLOW US" section when an overlay is actively showing content, or move it inside the SupportOverlay only.

#### H4. SVG clamp() syntax invalid in SupportOverlay Discord CTA
- **Severity:** HIGH
- **Viewport:** All
- **File:** `src/components/SupportOverlay.tsx` (line ~185)
- **Description:** The Discord bell icon uses `width="clamp(14px, 1.5vw, 20px)"` as SVG attribute. SVG `width`/`height` attributes must be numeric values, not CSS functions. The `clamp()` string gets parsed as NaN, causing the SVG to render at default/fallback size.
- **Fix:** Use inline `style` instead:
  ```tsx
  <svg style={{ width: 'clamp(14px, 1.5vw, 20px)', height: 'clamp(14px, 1.5vw, 20px)' }}>
  ```

#### H5. SideNav labels lose contrast on bright scenes
- **Severity:** HIGH
- **Viewports:** 1440x900 (cathedral interior scenes at ~20-35% scroll)
- **File:** `src/components/SideNav.tsx`
- **Description:** During bright cathedral interior scenes (warm golden light from candles and stained glass), the white/light-colored SideNav labels become hard to read against the bright background. Labels like "2025 HIGHLIGHTS" and "TEAM & PROJECTS" nearly disappear.
- **Fix:** Add text shadow or dark backdrop to SideNav labels:
  ```tsx
  textShadow: '0 1px 4px rgba(0,0,0,0.8), 0 0 12px rgba(0,0,0,0.5)'
  ```

---

### MEDIUM

#### M1. OverviewOverlay bottom strip overlap on mobile
- **Severity:** MEDIUM
- **Viewports:** 375x667
- **File:** `src/components/OverviewOverlay.tsx`
- **Description:** The bottom strip stats ("2,000 TAO RECEIVED / 2,170 TAO DEPLOYED") are positioned absolutely and overlap with the project list above. The `bottom: clamp(40px, 10vh, 100px)` doesn't account for the dynamic height of the scrollable grid area above it.
- **Fix:** Use flexbox layout instead of absolute positioning for the bottom strip, or add `marginBottom` to the scrollable grid that accounts for strip height.

#### M2. No scroll momentum/inertia on mobile
- **Severity:** MEDIUM
- **Viewports:** 375x667, 430x932
- **File:** `src/hooks/useScrollProgress.ts`
- **Description:** The custom scroll handler immediately stops updating `targetRef` after the touch event ends. There's no "throw" behavior (inertia/momentum decay) that mobile users expect. Scrolling feels sluggish and unnatural.
- **Fix:** Implement velocity-based decay after touchend:
  ```ts
  // On touchend, continue animation with decaying velocity
  const decay = () => {
    velocity *= 0.95; // friction
    if (Math.abs(velocity) > 0.0001) {
      targetRef.current = clamp(targetRef.current + velocity, 0, 1);
      requestAnimationFrame(decay);
    }
  };
  ```

#### M3. No deep linking / URL state for scroll position
- **Severity:** MEDIUM
- **Viewports:** All
- **File:** `src/hooks/useScrollProgress.ts`, `src/App.tsx`
- **Description:** Scroll progress is stored only in React state. Users cannot bookmark a section, share a direct link, or use browser back/forward to navigate sections.
- **Fix:** Sync scroll progress to URL hash:
  ```ts
  // On section change
  window.history.replaceState(null, '', `#${currentSection}`);
  // On load
  const hash = window.location.hash.slice(1);
  if (hash) jumpToSection(hash);
  ```

#### M4. MusicToggle icon non-responsive (fixed 16x16px)
- **Severity:** MEDIUM
- **Viewports:** 375x667
- **File:** `src/components/MusicToggle.tsx`
- **Description:** The music toggle SVG icon uses fixed `width="16" height="16"` regardless of viewport. On mobile, the overall button area is borderline (approximately 50x30px — height fails 44px).
- **Fix:** Make icon responsive and ensure minimum 44px button height.

#### M5. Text legibility at extremes
- **Severity:** MEDIUM
- **Viewports:** 375x667 (small text), theoretical 2560px+ (oversized)
- **File:** Various overlays
- **Description:** Some clamp() values hit problematic extremes:
  - `clamp(8px, 0.75vw, 10px)` in OverviewOverlay — 8px is below legibility threshold
  - `clamp(8.5px, 1.7vw, 20px)` for verify links — 8.5px too small on mobile
  - `clamp(36px, 6vw, 80px)` for NexusOverlay title — at 4K (2560px) = 153px unclamped but capped at 80px (OK)
- **Fix:** Raise minimum font sizes to 11px for body text, 10px absolute minimum for labels.

#### M6. Canvas doesn't recalculate on browser zoom
- **Severity:** MEDIUM
- **Viewports:** All
- **File:** `src/components/VideoSection.tsx`
- **Description:** The canvas DPR is calculated once on mount (`Math.min(devicePixelRatio, 2)`). If a user zooms the page (Ctrl+/Cmd+), the canvas doesn't recalculate, leading to blurry or misaligned rendering.
- **Fix:** Add a `resize` event listener that recalculates DPR:
  ```ts
  useEffect(() => {
    const onResize = () => setDpr(Math.min(window.devicePixelRatio, 2));
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  ```

#### M7. SideNav gap hardcoded at 28px
- **Severity:** MEDIUM
- **Viewports:** 375x667
- **File:** `src/components/SideNav.tsx`
- **Description:** The gap between SideNav items is hardcoded at `28px`. On small mobile screens (375x667), this causes the nav to stretch beyond comfortable reach. Should use `clamp()` for consistency.
- **Fix:** `gap: 'clamp(16px, 3vh, 28px)'`

---

### LOW

#### L1. LoadingScreen Play button fixed 80x80px
- **Severity:** LOW
- **File:** `src/ui/LoadingScreen.tsx`
- **Description:** Play button size is hardcoded. Should use `clamp()` for consistency.

#### L2. Audio fade uses setInterval instead of requestAnimationFrame
- **Severity:** LOW
- **File:** `src/components/VideoSection.tsx`, `src/components/MusicToggle.tsx`
- **Description:** Using `setInterval(fn, 16)` for audio volume fade. `requestAnimationFrame` is more efficient and battery-friendly.

#### L3. No aria-labels on overlay interactive elements
- **Severity:** LOW
- **File:** Various overlays
- **Description:** Project links and social icons lack `aria-label` for screen readers. SideNav buttons have text content but it's invisible on mobile.

#### L4. Vignette gradient not viewport-adaptive
- **Severity:** LOW
- **File:** `src/components/VideoSection.tsx`
- **Description:** The vignette `radial-gradient(ellipse at center, ...)` uses fixed proportions regardless of viewport aspect ratio.

---

## Positive Findings

| Area | Notes |
|------|-------|
| Scroll animation | Smooth frame-by-frame canvas rendering, proper DPR clamping |
| Typography system | Excellent use of `clamp()` throughout for fluid scaling |
| Visual design | Stunning cinematic quality, consistent gold/dark palette |
| Layout flexibility | Overlays resize well across viewports (except tablet edge case) |
| Memory management | Windowed frame loading (+-150 frames) prevents OOM |
| SideNav click navigation | Works correctly, animates to section |
| Mobile 1-col layout | OverviewOverlay correctly switches to single column |
| FilmGrain effect | Subtle, doesn't interfere with readability |
| MusicToggle | Clear ON/OFF state, accessible position |

---

## Viewport Coverage Matrix

| Section | Desktop 1440 | Tablet 768 | Mobile 430 | Mobile 375 |
|---------|:---:|:---:|:---:|:---:|
| Hero/Intro | OK | OK | OK | OK |
| Problems | OK | OK | OK | OK |
| 2025 Highlights | OK | - | - | - |
| Team & Projects | OK | **BROKEN** (C2,C3) | OK | OK (M1) |
| Vision | OK | OK | OK | OK |
| Nexus | OK | OK | OK | OK |
| Support Us | OK | OK | OK (H1) | OK (H1) |
| SideNav | OK (H5) | **BROKEN** (C3) | POOR (C1,H2) | POOR (C1,H2) |
| FOLLOW US | OK | OK | POOR (H3) | POOR (H3) |
| MusicToggle | OK | OK | OK (M4) | OK (M4) |

---

## Priority Fix Roadmap

### Sprint 1 (Immediate — launch blockers)
1. **C1** — SideNav touch targets (add padding, 2h)
2. **C2** — Raise breakpoint to 1024px or add tablet handling (4h)
3. **C3** — SideNav/content overlap (add overlay paddingRight, 2h)

### Sprint 2 (This week — polish)
4. **H1** — Social icon touch targets (1h)
5. **H2** — Mobile nav labels or tooltips (3h)
6. **H3** — Hide FOLLOW US during overlays (1h)
7. **H4** — Fix SVG clamp syntax (15min)
8. **H5** — SideNav text shadow for contrast (30min)

### Sprint 3 (Next week — UX improvements)
9. **M1** — Bottom strip layout fix (2h)
10. **M2** — Scroll inertia (3h)
11. **M3** — URL deep linking (2h)
12. **M5** — Font size minimums (1h)
13. **M7** — SideNav gap clamp (15min)

### Backlog
14. **M4, M6, L1-L4** — Various minor fixes

---

*Report generated by automated browser audit. Screenshots and GIFs saved to Downloads folder.*
