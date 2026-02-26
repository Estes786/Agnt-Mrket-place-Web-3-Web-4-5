# 📋 SESSION #018 — PERFORMANCE + SEO
## GANI HYPHA — Optimization & Discoverability
### Status: ⏳ PENDING

---

## 🎯 TUJUAN

Optimize bundle size, loading speed, dan SEO untuk better discoverability.

---

## TODO LIST

### STEP 1: Bundle Size Analysis
```bash
# Analyze bundle
npm run build 2>&1 | grep "kB"
# Current: 1,207.66 kB (TOO LARGE — need to reduce)

# Target: < 500 kB gzipped
```

### STEP 2: Code Splitting (Lazy Loading)

Update `src/App.tsx` untuk lazy load components:
```typescript
import { lazy, Suspense } from 'react'

// Lazy load heavy components
const Marketplace = lazy(() => import('./components/Marketplace'))
const Dashboard = lazy(() => import('./components/Dashboard'))
const Tokenomics = lazy(() => import('./components/Tokenomics'))
const DAppsHub = lazy(() => import('./components/DAppsHub'))
const DAOGovernance = lazy(() => import('./components/DAOGovernance'))
// ... semua komponen yang tidak dibutuhkan di awal

// Wrap dengan Suspense
<Suspense fallback={<div className="flex items-center justify-center h-screen">
  <div className="text-indigo-400 animate-pulse">Loading...</div>
</div>}>
  <Routes>
    <Route path="/" element={<Dashboard />} />
    <Route path="/marketplace" element={<Marketplace />} />
    {/* ... */}
  </Routes>
</Suspense>
```

### STEP 3: SEO Meta Tags

Update `index.html`:
```html
<head>
  <title>GANI HYPHA — AI Agent Marketplace Web3/Web4/Web5</title>
  <meta name="description" content="Platform marketplace AI agent pods pertama di Indonesia. Deploy autonomous AI agents, earn yield, govern dengan DAO. $PREMALTA token on Base.">
  
  <!-- Open Graph -->
  <meta property="og:title" content="GANI HYPHA — Sovereign AI Ecosystem">
  <meta property="og:description" content="Build Your Sovereign Digital Empire. Web3 → Web4 → Web5.">
  <meta property="og:image" content="https://gani-hypha-web3.pages.dev/og-image.png">
  <meta property="og:url" content="https://gani-hypha-web3.pages.dev">
  <meta property="og:type" content="website">
  
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="GANI HYPHA — AI Agent Marketplace">
  <meta name="twitter:description" content="Deploy AI agents, earn yield, govern with DAO. $PREMALTA on Base.">
  <meta name="twitter:image" content="https://gani-hypha-web3.pages.dev/og-image.png">
  
  <!-- Web3/DeFi specific -->
  <meta name="web3:contract:premalta" content="0xC0125651a46BDEea72a73A1C1A75b82e0E2C94c7">
  <meta name="web3:network" content="base">
  
  <!-- PWA -->
  <link rel="manifest" href="/manifest.json">
  <meta name="theme-color" content="#020617">
</head>
```

### STEP 4: PWA Manifest

Create `public/manifest.json`:
```json
{
  "name": "GANI HYPHA",
  "short_name": "GANI HYPHA",
  "description": "AI Agent Marketplace Web3/Web4/Web5",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#020617",
  "theme_color": "#4f46e5",
  "icons": [
    { "src": "/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

### STEP 5: Caching Headers (wrangler.jsonc)

```jsonc
{
  "name": "gani-hypha-web3",
  "compatibility_date": "2024-01-01",
  "pages_build_output_dir": "./dist",
  "compatibility_flags": ["nodejs_compat"],
  
  // Cache static assets
  "headers": [
    {
      "pattern": "/assets/*",
      "headers": {
        "Cache-Control": "public, max-age=31536000, immutable"
      }
    }
  ]
}
```

### STEP 6: Vite Optimization

Update `vite.config.ts`:
```typescript
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-charts': ['recharts'],
          'vendor-motion': ['motion'],
        }
      }
    }
  }
})
```

---

## 📊 SUCCESS CRITERIA

```
✅ Bundle size < 400 kB (gzip)
✅ Lighthouse score > 70
✅ SEO meta tags semua ada
✅ PWA installable
✅ Lazy loading implemented
```

---

*Session #018 | GANI HYPHA | Planned*
