# 📐 DESIGN DOCUMENT
## GANI HYPHA — UI/UX & System Design v2.0
### Date: February 25, 2026 | Deep-Dive Enhanced Version

---

## 1. DESIGN PHILOSOPHY

### 1.1 Core Design Principles
```
1. DARK SOVEREIGN AESTHETIC
   - Background: Deep black (slate-950/950) — "ruang gelap alam semesta"
   - Accent: Indigo/Purple/Cyan gradients — "koneksi digital"
   - Text: White + slate-300/400 hierarchy

2. INFORMATION DENSITY
   - Banyak data = power user feel
   - Grid-based layouts untuk maximize screen real estate
   - Monospace fonts untuk numbers/code = trust factor

3. RESPONSIVE FIRST
   - Mobile: BottomNav (4-5 items max)
   - Desktop: Sidebar (full navigation tree)
   - Breakpoint: md (768px)

4. FEEDBACK-DRIVEN
   - Every action = visual feedback
   - Loading states untuk async ops
   - Success/error toasts
   - Real-time updates (simulated → real)
```

### 1.2 Color System
```
PRIMARY PALETTE:
├── Background:    #020617 (slate-950)  — Main canvas
├── Surface:       #0f172a (slate-900)  — Cards/panels
├── Border:        #1e293b (slate-800)  — Dividers
├── Text Primary:  #f8fafc (slate-50)   — Headings
└── Text Secondary: #94a3b8 (slate-400) — Body text

ACCENT GRADIENTS:
├── Brand:     from-indigo-600 to-purple-600  — Primary CTA
├── Income:    from-emerald-500 to-teal-500   — Revenue metrics
├── Warning:   from-amber-500 to-orange-500   — Caution states
├── Danger:    from-red-500 to-pink-600       — Error/risk
└── Web5:      from-cyan-400 to-blue-500      — Future/innovation

STATUS INDICATORS:
├── 🟢 Green  (#22c55e) — Active, Connected, Success
├── 🟡 Yellow (#eab308) — Warning, Pending, Syncing
├── 🔴 Red    (#ef4444) — Error, Inactive, Risk
└── 🔵 Blue   (#3b82f6) — Info, Loading, Processing
```

### 1.3 Typography Scale
```
Font Stack: system-ui, Inter, -apple-system, sans-serif
Mono Font:  'Courier New', Consolas, monospace

Heading XL:  text-3xl font-black  (32px, weight 900)
Heading L:   text-2xl font-bold   (24px, weight 700)
Heading M:   text-xl font-bold    (20px, weight 700)
Body L:      text-base            (16px)
Body M:      text-sm              (14px)
Caption:     text-xs              (12px)
Micro:       text-[10px]          (10px) — Labels, badges
Nano:        text-[8px]           (8px)  — Status indicators
```

---

## 2. LAYOUT ARCHITECTURE

### 2.1 App Shell (App.tsx)
```
┌─────────────────────────────────────────────┐
│  [Header] — Wallet + HYPHA balance + Profile│ h-14
├──────────┬──────────────────────────────────┤
│          │                                   │
│ [Sidebar]│        [Main Content]             │
│  w-64    │        flex-1                     │
│ (desktop)│                                   │
│          │                                   │
│          │                                   │
├──────────┴──────────────────────────────────┤
│  [BottomNav] — Mobile only (md:hidden)      │ h-16
└─────────────────────────────────────────────┘
```

### 2.2 Component Grid System
```
MARKETPLACE PAGE:
┌─────────────────────────────────┐
│ [Filter Bar] + [Search]         │
├─────┬─────┬─────┬─────┬─────┐  │
│Pod 1│Pod 2│Pod 3│Pod 4│Pod 5│  │ grid-cols-1 md:grid-cols-2 lg:grid-cols-3
├─────┴─────┴─────┴─────┴─────┤  │
│Pod 6│Pod 7│Pod 8│Pod 9│     │  │
└─────────────────────────────────┘

DASHBOARD PAGE:
┌─────────────────────────────────┐
│ [Stats Row — 4 metrics]         │ grid-cols-4
├─────────────────────────────────┤
│ [Live Income Stream]            │ w-full
├──────────────────┬──────────────┤
│ [Pod Grid]        │ [Staking]   │ grid-cols-2
└──────────────────┴──────────────┘

TOKENOMICS PAGE:
┌──────────────────┬──────────────┐
│ [Price Chart]    │ [Pie Chart]  │ grid-cols-2
├──────────────────┴──────────────┤
│ [Vesting Schedule Table]        │
├─────────────────────────────────┤
│ [Utility + Distribution]        │
└─────────────────────────────────┘
```

---

## 3. COMPONENT DESIGN SPECS

### 3.1 Blueprint Pod Card
```
Design:
┌─────────────────────────────────────┐
│ [Emoji Icon]  [Tier Badge]          │ h-auto
│ [Pod Name — text-lg font-bold]      │
│ [Description — text-sm text-slate]  │
│                                     │
│ [Stats Row: Speed | Chain | Model]  │
│ ─────────────────────────────────── │
│ [Tags: DeFi | AI | Yield]          │
│                                     │
│ [Price] ─────────── [Deploy Btn]   │
└─────────────────────────────────────┘

States:
- Default: border-slate-800/50
- Hover: border-indigo-500/50, scale-[1.01]
- Deploying: border-blue-400, loading animation
- Deployed: border-emerald-400/50, "ACTIVE" badge
```

### 3.2 Header Component
```
┌─────────────────────────────────────────────────────────────────┐
│ [Logo 🧬 GANI HYPHA] ─── [Nav Items] ─── [Wallet] [Balance]   │
└─────────────────────────────────────────────────────────────────┘

Wallet States:
NOT CONNECTED:
  [🔗 Connect Wallet] — indigo button
  
CONNECTED:
  [0x1234...abcd] [ETH: 0.42] [HYPHA: 1,500]
```

### 3.3 GANI Assistant Widget
```
Floating position: bottom-right
States:
- Collapsed: Round button (🤖) — 64px circle
- Expanded: Chat panel 400×600px

Chat UI:
├── Header: "GANI AI v5.0" + close button
├── Messages: Dark bubbles, user/AI differentiated
├── Input: textarea + send button
└── Footer: Model info (Groq llama-3.3-70b)
```

---

## 4. INTERACTION DESIGN

### 4.1 Button Hierarchy
```
PRIMARY (CTA):
  bg-gradient-to-r from-indigo-600 to-purple-600
  hover: opacity-90 + scale-105
  Example: "Deploy Pod", "Connect Wallet"

SECONDARY:
  bg-slate-800 border border-slate-700
  hover: bg-slate-700
  Example: "View Details", "Cancel"

DANGER:
  bg-red-900/20 border border-red-500/30 text-red-400
  hover: bg-red-900/40
  Example: "Unstake", "Remove Liquidity"

SUCCESS:
  bg-emerald-900/20 border border-emerald-500/30 text-emerald-400
  Example: "Stake", "Add Liquidity"
```

### 4.2 Animation Specs
```
Page Transitions: fade-in 200ms ease-out
Card Hover: transition-all duration-200
Number Updates: count-up animation 500ms
Loading Dots: pulse animation 1s infinite
Deploy Progress: progress bar fill 2s linear
Yield Increment: gentle glow pulse per tick
```

### 4.3 Form Design
```
Input Fields:
  bg-slate-800 border border-slate-700 rounded-xl
  focus: border-indigo-500 ring-2 ring-indigo-500/20
  
Select/Dropdown:
  Same as input + chevron icon
  
Toggle:
  width: 44px
  on: bg-indigo-600
  off: bg-slate-700
  
Slider:
  Track: bg-slate-700
  Thumb: bg-indigo-500 shadow-indigo-500/50
  Fill: bg-gradient indigo-to-purple
```

---

## 5. NAVIGATION DESIGN

### 5.1 Sidebar Structure (Desktop)
```
GROUP: 🧠 Core Platform
├── 🏪 Marketplace        /
├── ⚡ Command Center     /dashboard
├── 🏗️ Architect v3       /architect
└── 🎛️ Master Control     /master

GROUP: ⛓️ Web3 Ecosystem
├── 🌿 Tokenomics         /tokenomics
├── 🔵 $PREMALTA          /premalta
├── 🔗 DApps Hub          /dapps
└── 🏛️ DAO Governance     /dao

GROUP: 🎨 Content & Vision
├── 🎬 Media Lab          /media-lab
└── 🗺️ Roadmap            /roadmap

GROUP: 🎯 Strategy & Analysis
├── 🧠 Strategy Center    /strategy
└── 🌐 AI Web5 Roadmap    /ai-web5

GROUP: 💸 Income Engine
├── 🌐 Autonomous Economy /economy
├── 💰 Revenue Hub        /revenue
└── 🚀 Token LaunchPad    /tokens

GROUP: 🕸️ Web5 Sovereignty
└── 🕸️ Web5 Command      /web5

FOOTER:
├── Version badge: v5.0
├── Chain status indicators
└── System health dots
```

### 5.2 Mobile BottomNav (5 items max)
```
[🏪 Market] [⚡ Pods] [🌐 Economy] [🎛️ Control] [💰 Revenue]
```

---

## 6. DATA VISUALIZATION SPECS

### 6.1 Chart Types Used
```
recharts Library:

AreaChart     — Price/yield over time (smooth gradient fill)
BarChart      — Comparison data (Competitors, Revenue streams)
PieChart      — Token distribution (6 segments)
RadarChart    — Protocol comparison (DeFi protocols)
LineChart     — Activity/transactions over time
```

### 6.2 Chart Color Palette
```
Series 1: #6366f1 (Indigo)    — Primary metric
Series 2: #8b5cf6 (Purple)    — Secondary metric
Series 3: #06b6d4 (Cyan)      — Tertiary
Series 4: #10b981 (Emerald)   — Positive/gain
Series 5: #f59e0b (Amber)     — Neutral
Series 6: #ef4444 (Red)       — Negative/loss

Gradient Fill: from-[color]/20 to-transparent
Grid Lines: stroke="#1e293b" (slate-800)
```

---

## 7. RESPONSIVE BREAKPOINTS

```
Mobile First Strategy:

xs (< 640px):   Single column, BottomNav, compact cards
sm (640-767px): Same as xs, slightly wider cards
md (768-1023px): Sidebar appears, 2-col grids
lg (1024-1279px): 3-col grids, full sidebar
xl (1280px+):   4-col grids, expanded stats

Critical Breakpoints:
- Sidebar: hidden md:flex (only shows >= 768px)
- BottomNav: flex md:hidden (only shows < 768px)
- Grid cols: grid-cols-1 sm:grid-cols-2 lg:grid-cols-3
```

---

## 8. ACCESSIBILITY NOTES

```
ARIA Labels:
- All interactive elements have aria-label
- Icons have aria-hidden="true" when decorative
- Buttons have descriptive text, not just icons

Keyboard Navigation:
- Tab order follows visual flow
- Focus rings: ring-2 ring-indigo-500 ring-offset-2

Color Contrast:
- Text on dark: 4.5:1 minimum ratio
- CTA buttons: 3:1 minimum (AAA for large text)

Screen Reader:
- Role attributes on interactive components
- Live regions for dynamic content (yield updates)
```

---

## 9. PERFORMANCE GUIDELINES

```
Bundle Size Targets:
├── Initial JS: < 300KB (gzipped)
├── Initial CSS: < 50KB (gzipped)
└── Total First Load: < 500KB

Lazy Loading:
├── All route components: React.lazy()
├── Charts (recharts): loaded on demand
└── Heavy components: Suspense + fallback

Image Optimization:
├── Use emoji/SVG for icons (no image files)
├── WebP format for any real images
└── Width/height attributes to prevent CLS

Core Web Vitals Targets:
├── LCP: < 2.5s
├── FID: < 100ms
└── CLS: < 0.1
```

---

## 10. KNOWN DESIGN DEBT

```
🔴 Critical:
- [ ] Real loading states (skeleton screens)
- [ ] Error boundary UI (not just console errors)
- [ ] Empty states for lists/tables
- [ ] Form validation feedback

🟡 High:
- [ ] Confirmation dialogs for destructive actions
- [ ] Tooltip system for complex metrics
- [ ] Keyboard shortcuts for power users
- [ ] Print/export styling

🟢 Nice to Have:
- [ ] Dark/Light mode toggle
- [ ] Font size preference
- [ ] Reduced motion support
- [ ] Custom color themes per brand
```

---

*Last Updated: February 25, 2026 | Version: 2.0 Enhanced*
