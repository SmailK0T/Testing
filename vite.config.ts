import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  server: {
    fs: {
      strict: false,
    },
    proxy: {
      '/b2api': {
        target: 'https://awx.pro',
        changeOrigin: true,
        secure: false,
      },
    },
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
})
