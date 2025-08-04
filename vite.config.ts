import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 9000,
    open: true
  },
  build: {
    outDir: 'build'
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    'process.env.REACT_APP_VERSION': JSON.stringify(process.env.REACT_APP_VERSION)
  }
})