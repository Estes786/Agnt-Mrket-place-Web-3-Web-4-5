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
          input: { main: path.resolve(__dirname, 'index.html') }
        },
        chunkSizeWarningLimit: 3000,
      }
    : {
        outDir: 'dist',
        // Hono worker build — pages plugin handles this
      },

  resolve: {
    alias: { '@': path.resolve(__dirname, './src') }
  },
  server: { host: '0.0.0.0', port: 5173 }
})
