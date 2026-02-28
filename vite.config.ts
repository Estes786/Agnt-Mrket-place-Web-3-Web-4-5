import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import pages from '@hono/vite-cloudflare-pages'
import path from 'path'

const isClient = process.env.BUILD_MODE === 'client'

export default defineConfig({
  plugins: isClient
    ? [react()]
    : [pages()],

  build: isClient
    ? {
        outDir: 'dist',
        emptyOutDir: false,  // Don't delete _worker.js
        rollupOptions: {
          input: { main: path.resolve(__dirname, 'index.html') },
          output: {
            // ✅ ULTRA OPTIMIZED: Manual chunk splitting untuk minimal initial load
            manualChunks(id) {
              // Vendor: React ecosystem (load once, cache forever ~30KB gzip)
              if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) {
                return 'react-vendor';
              }
              // Router (~15KB gzip)
              if (id.includes('node_modules/react-router-dom') || id.includes('node_modules/react-router/')) {
                return 'router';
              }
              // Charts - heavy, load on demand (~80KB gzip)
              if (id.includes('node_modules/recharts')) {
                return 'recharts';
              }
              // Motion/animation (~30KB gzip)
              if (id.includes('node_modules/motion') || id.includes('node_modules/framer-motion')) {
                return 'motion';
              }
              // Ethers - very heavy Web3 lib (~150KB gzip)
              if (id.includes('node_modules/ethers')) {
                return 'ethers';
              }
              // Landing Nav — shared nav bar kecil, load pertama dengan landing pages
              if (id.includes('LandingNav')) {
                return 'landing-nav';
              }
              // Landing pages cluster (public marketing pages)
              if (id.includes('BDELanding') || id.includes('SovereignLegacyLanding')) {
                return 'landing-barber-legacy';
              }
              if (id.includes('SICALanding') || id.includes('SHGALanding')) {
                return 'landing-food-gift';
              }
              if (id.includes('SCALanding') || id.includes('SMALanding')) {
                return 'landing-sca-sma';
              }
              if (id.includes('HOLYYBDLanding')) {
                return 'landing-holyybd';
              }
              // Sovereign apps cluster
              if (id.includes('SovereignBarber') || id.includes('SovereignLegacy')) {
                return 'sovereign-apps';
              }
              if (id.includes('SovereignStore')) {
                return 'sovereign-store';
              }
              // Dashboard and Marketplace (main app content)
              if (id.includes('/components/Marketplace')) {
                return 'marketplace';
              }
              if (id.includes('/components/Dashboard')) {
                return 'dashboard';
              }
              // Sidebar + Header + BottomNav (layout)
              if (id.includes('/components/Sidebar') || id.includes('/components/Header') || id.includes('/components/BottomNav')) {
                return 'app-layout';
              }
              // Web3 components cluster
              if (id.includes('Web3') || id.includes('Tokenomics') || id.includes('DApps') || id.includes('DAO') || id.includes('Identity') || id.includes('Premalta') || id.includes('TokenLaunch')) {
                return 'web3-components';
              }
              // Strategy/content cluster
              if (id.includes('Strategy') || id.includes('MediaLab') || id.includes('Roadmap') || id.includes('BuildInPublic') || id.includes('AIWeb5') || id.includes('Revenue') || id.includes('Autonomous') || id.includes('Web5Command') || id.includes('Architect')) {
                return 'strategy-content';
              }
              // Agent apps cluster
              if (id.includes('/components/SCA') || id.includes('/components/SICA') || id.includes('/components/SHGA')) {
                return 'agent-apps';
              }
              // Support components
              if (id.includes('MetaMask') || id.includes('Payment') || id.includes('GaniAssistant') || id.includes('Supabase') || id.includes('MasterControl')) {
                return 'support-components';
              }
            }
          }
        },
        // ✅ More aggressive chunking warning threshold
        chunkSizeWarningLimit: 500,
        // ✅ Enable aggressive minification
        minify: 'esbuild',
        // ✅ Target modern browsers for smaller output
        target: 'es2020',
      }
    : {
        outDir: 'dist',
      },

  // ✅ Optimize dependencies pre-bundling
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
    exclude: ['ethers', 'recharts'],
  },

  resolve: {
    alias: { '@': path.resolve(__dirname, './src') }
  },
  server: { host: '0.0.0.0', port: 5173 }
})
