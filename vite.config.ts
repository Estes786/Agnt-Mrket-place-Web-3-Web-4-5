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
            // ✅ Optimize: Manual chunk splitting untuk faster loading
            manualChunks(id) {
              // Vendor: React ecosystem (load once, cache forever)
              if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
                return 'react-vendor';
              }
              if (id.includes('node_modules/react-router-dom') || id.includes('node_modules/react-router')) {
                return 'router';
              }
              // Charts - heavy, load on demand
              if (id.includes('node_modules/recharts')) {
                return 'recharts';
              }
              // Motion/animation
              if (id.includes('node_modules/motion') || id.includes('node_modules/framer-motion')) {
                return 'motion';
              }
              // Ethers - heavy Web3 lib
              if (id.includes('node_modules/ethers')) {
                return 'ethers';
              }
              // Landing pages cluster - group together for fast preload
              if (id.includes('LandingNav') || id.includes('SovereignNavBar') || id.includes('SovereignFooter')) {
                return 'landing-nav';
              }
            }
          }
        },
        chunkSizeWarningLimit: 1000,
        // ✅ Enable minification
        minify: 'esbuild',
      }
    : {
        outDir: 'dist',
      },

  resolve: {
    alias: { '@': path.resolve(__dirname, './src') }
  },
  server: { host: '0.0.0.0', port: 5173 }
})
