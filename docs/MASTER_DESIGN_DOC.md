# 🎨 DESIGN DOCUMENT
## GANI HYPHA — UI/UX Design System & Component Guide
### Version: 3.1 | Date: 2026-02-23

---

## 1. DESIGN PHILOSOPHY

### Core Principles:
1. **Dark Sovereign** — Dark theme (bg-[#020617]) menunjukkan eksklusivitas dan sophistication Web3
2. **Glassmorphism** — Translucent panels dengan backdrop blur untuk depth
3. **Neon Accents** — Indigo/violet/cyan neon untuk energy dan futurism
4. **Data-Dense** — Menampilkan banyak data tanpa overwhelming user
5. **Mobile-First** — Bottom navigation untuk mobile, sidebar untuk desktop

---

## 2. COLOR SYSTEM

### Primary Palette
```css
--bg-primary: #020617      /* bg-slate-950 — Deepest space */
--bg-secondary: #0f172a    /* bg-slate-900 — Component background */
--bg-card: rgba(15,23,42,0.8) /* Glass cards */

--accent-indigo: #6366f1   /* Primary CTA, highlights */
--accent-violet: #8b5cf6   /* Secondary accents */
--accent-cyan: #06b6d4     /* Info, Web3 elements */
--accent-emerald: #10b981  /* Success, Active status */
--accent-amber: #f59e0b    /* Warning, Pro tier */
--accent-rose: #ef4444     /* Error, Danger, Dump */

--text-primary: #e2e8f0    /* slate-200 */
--text-secondary: #94a3b8  /* slate-400 */
--text-muted: #475569      /* slate-600 */
```

### Status Colors
```css
--status-active: #10b981   /* Emerald - Active/Running */
--status-sovereign: #8b5cf6 /* Violet - Highest tier */
--status-syncing: #f59e0b  /* Amber - Loading/Syncing */
--status-hibernating: #6b7280 /* Gray - Inactive */
```

### Tier Colors
```css
--tier-free: #6b7280       /* Gray */
--tier-pro: #3b82f6        /* Blue */
--tier-enterprise: #f59e0b /* Gold */
```

---

## 3. TYPOGRAPHY

### Font Stack
```
Primary: Inter (weights: 300, 400, 500, 600, 700, 800, 900)
Monospace: JetBrains Mono (weights: 400, 500, 700)
```

### Type Scale
```
text-xs    (12px) — Labels, metadata, timestamps
text-sm    (14px) — Body text, descriptions
text-base  (16px) — Default body
text-lg    (18px) — Section headers
text-xl    (20px) — Card titles
text-2xl   (24px) — Page section headers
text-3xl   (30px) — Feature highlights
text-4xl   (36px) — Hero text
```

### Usage Patterns
```
font-mono → All crypto addresses, hashes, codes, numbers
font-bold → Headers, CTAs, important values
font-medium → Sub-headers, labels
tracking-wider → Uppercase labels, tags
```

---

## 4. COMPONENT LIBRARY

### 4.1 Cards
```tsx
// Base Card
<div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 backdrop-blur-sm">

// Highlighted Card (featured/active)
<div className="bg-indigo-900/20 border border-indigo-700/30 rounded-xl p-6">

// Glass Card (premium feel)
<div className="bg-slate-900/80 border border-slate-700/40 rounded-2xl p-6 backdrop-blur-xl shadow-2xl">
```

### 4.2 Buttons
```tsx
// Primary CTA
<button className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2 px-6 rounded-lg transition-all">

// Secondary
<button className="bg-slate-700 hover:bg-slate-600 text-slate-200 py-2 px-4 rounded-lg transition-all">

// Danger/Unstake
<button className="bg-rose-600/20 hover:bg-rose-600/30 border border-rose-500/30 text-rose-400 py-2 px-4 rounded-lg">

// Ghost/Outline
<button className="border border-indigo-500/30 hover:border-indigo-400/60 text-indigo-400 py-2 px-4 rounded-lg">
```

### 4.3 Badges/Tags
```tsx
// Status Badge
<span className="bg-emerald-500/20 text-emerald-400 text-xs px-2 py-1 rounded-full border border-emerald-500/30">
  Active
</span>

// Tier Badge
<span className="bg-amber-500/20 text-amber-400 text-xs px-2 py-1 rounded-full border border-amber-500/30">
  Enterprise
</span>

// Chain Badge
<span className="bg-blue-500/20 text-blue-400 text-xs px-2 py-1 rounded-full">
  Ethereum
</span>
```

### 4.4 Inputs
```tsx
// Text Input
<input className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-slate-200 placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500/30 transition-all w-full" />

// Textarea
<textarea className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 placeholder-slate-500 focus:border-violet-500 focus:outline-none resize-none transition-all w-full" />
```

### 4.5 Progress Bars
```tsx
// Default
<div className="h-2 bg-slate-700 rounded-full overflow-hidden">
  <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${percent}%` }} />
</div>

// Health indicator
<div className="h-1 bg-slate-700 rounded-full">
  <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${health}%` }} />
</div>
```

### 4.6 Metrics Display
```tsx
// Stat Card
<div className="text-center">
  <div className="text-2xl font-bold text-indigo-400">2,500</div>
  <div className="text-xs text-slate-400 mt-1">HYPHA Balance</div>
</div>

// Live Metric (with animation)
<div className="flex items-center gap-2">
  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
  <span className="text-emerald-400 font-mono text-sm">847ms</span>
</div>
```

---

## 5. PAGE LAYOUTS

### 5.1 Dashboard Layout
```
┌──────────────────────────────────────────────────────────┐
│  HEADER: Logo | Credits | Active Pods | Wallet | Notif   │
├────────────────────┬─────────────────────────────────────┤
│                    │                                      │
│  SIDEBAR           │  MAIN CONTENT AREA                  │
│  (desktop only)    │  ┌────────────────────────────────┐ │
│                    │  │  PAGE COMPONENT                │ │
│  ✦ Marketplace     │  │                                │ │
│  ⚡ Dashboard      │  │  (Marketplace/Dashboard/       │ │
│  🏗️ Architect      │  │   Architect/DeFi/DAO etc.)     │ │
│  🌿 Tokenomics     │  │                                │ │
│  🔗 DApps          │  └────────────────────────────────┘ │
│  🏛️ DAO            │                                      │
│  🪪 Identity       │                                      │
│  🌐 Web3           │                                      │
│  🎬 Media Lab      │                                      │
│  🗺️ Roadmap        │                                      │
│                    │                                      │
├────────────────────┴─────────────────────────────────────┤
│  BOTTOM NAV (mobile only)                                 │
│  🏪 | ⚡ | 🏗️ | 🔗 | 🏛️                                  │
└──────────────────────────────────────────────────────────┘
│  GANI ASSISTANT (floating button, bottom-right)          │
└──────────────────────────────────────────────────────────┘
```

### 5.2 Marketplace Layout
```
┌─────────────────────────────────────────────────────────┐
│  FILTERS: All | Free | Pro | Enterprise | [Industry]    │
├─────────────────────────────────────────────────────────┤
│  GRID: Blueprint Cards (responsive 1-2-3 columns)       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ 🏠 Real      │  │ ✂️ Barber     │  │ 📸 Media     │  │
│  │ Estate Pod   │  │ Dynasty      │  │ Empire       │  │
│  │ [Free]       │  │ [Free]       │  │ [Enterprise] │  │
│  │ 1242 deployed│  │ 843 deployed │  │ 156 deployed │  │
│  │ [Deploy]     │  │ [Deploy]     │  │ [Purchase]   │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
```

---

## 6. ANIMATIONS & INTERACTIONS

### Motion Library (motion 12.0.0)
```tsx
// Fade in up
import { motion } from 'motion/react'

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.4, ease: 'easeOut' }}
>

// Stagger children
<motion.div
  variants={{ container: { staggerChildren: 0.1 } }}
  animate="container"
>
```

### CSS Animations
```css
/* Pulse for live indicators */
animate-pulse → wallet connected, active pods

/* Spin for loading */
animate-spin → deployment spinner

/* Bounce for notifications */
animate-bounce → reward notifications
```

---

## 7. MOBILE RESPONSIVENESS

### Breakpoints (TailwindCSS)
```
sm: 640px   — Small mobile landscape
md: 768px   — Tablet
lg: 1024px  — Desktop (sidebar appears)
xl: 1280px  — Large desktop
2xl: 1536px — Wide screen
```

### Mobile-Specific Rules
```tsx
// Hide on mobile, show desktop
<div className="hidden lg:flex ...">

// Show on mobile, hide desktop
<div className="lg:hidden ...">

// Bottom Nav (mobile only)
<div className="fixed bottom-0 left-0 right-0 lg:hidden ...">

// Full width on mobile, constrained on desktop
<div className="w-full lg:max-w-4xl ...">
```

---

## 8. ICONS & VISUAL LANGUAGE

### Emoji Icons (Used Throughout)
```
🏠 Real Estate    ✂️ Barber       👨‍👩‍👧‍👦 Family
📸 Media          🚢 Supply Chain  📈 Fintech
⚖️ Legal          🔗 DeFi         🏛️ DAO
😌 GANI/Gyss     🙏🏻 Respect      👑 Sovereign
🚀 Deploy/Launch  💎 Premium      🔐 Secure
⟠ ETH            ⬡ MATIC         🔵 ARB
```

### Status Indicators
```
🟢 Active/Online    ● (emerald pulse)
🟡 Syncing/Pending  ● (amber pulse)
🔵 Web3/Blockchain  ● (blue static)
⚡ Processing       ● (violet pulse)
```

---

*Design Doc GANI HYPHA v3.1 — Gyss! 😌🙏🏻*
