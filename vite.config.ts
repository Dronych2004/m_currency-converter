import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        embed: resolve(import.meta.dirname, 'embed.html'),
      },
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react-dom')) {
            return 'react-vendor';
          }
          if (id.includes('node_modules/react') && !id.includes('react-dom')) {
            return 'react-vendor';
          }
        },
      },
    },
    target: 'es2020',
    reportCompressedSize: true,
    chunkSizeWarningLimit: 500,
  },
})
