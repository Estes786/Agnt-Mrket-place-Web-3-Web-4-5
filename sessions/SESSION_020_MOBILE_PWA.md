# 📋 SESSION #020 — MOBILE OPTIMIZATION + PWA
## GANI HYPHA — Progressive Web App
### Status: ⏳ PENDING

---

## 🎯 TUJUAN

Make GANI HYPHA installable sebagai PWA dan optimal di mobile.

---

## TODO LIST

### STEP 1: Create Service Worker

```javascript
// public/sw.js
const CACHE_NAME = 'gani-hypha-v1'
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json'
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache)
    })
  )
})

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Cache hit - return response
      if (response) return response
      return fetch(event.request)
    })
  )
})
```

### STEP 2: Register Service Worker

Di `src/main.tsx`:
```typescript
// Register service worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((reg) => console.log('SW registered:', reg.scope))
      .catch((err) => console.warn('SW registration failed:', err))
  })
}
```

### STEP 3: Create App Icons

Buat icon sizes untuk PWA:
- `public/icon-192.png` (192x192)
- `public/icon-512.png` (512x512)
- `public/apple-touch-icon.png` (180x180)

Gunakan: https://realfavicongenerator.net

### STEP 4: Mobile Touch Optimizations

Di komponen yang pakai buttons/cards:
```css
/* Add ke tailwind classes */
touch-action: manipulation;  /* Prevent zoom on double-tap */
-webkit-tap-highlight-color: transparent;  /* Remove blue highlight iOS */
```

### STEP 5: BottomNav Improvements

Check `BottomNav.tsx` sudah punya:
- Safe area insets untuk iPhone notch
- Proper touch targets (min 44x44px)
- Active state feedback

### STEP 6: Test di Mobile

```bash
# Gunakan Chrome DevTools
# Open F12 → Toggle device toolbar
# Test viewport sizes:
# - iPhone SE (375px)
# - iPhone 14 Pro (393px)  
# - Galaxy S21 (360px)
```

---

## 📊 SUCCESS CRITERIA

```
✅ PWA installable di Chrome/Safari
✅ Service worker caches assets
✅ Lighthouse PWA score > 90
✅ Works offline (basic functionality)
✅ All touch targets >= 44px
✅ No layout issues di mobile
```

---

*Session #020 | GANI HYPHA | Planned — Month 2*
