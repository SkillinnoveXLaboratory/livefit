import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const mediaBaseUrl = (env.VITE_API_BASE_URL || 'http://localhost:5000').replace(/\/+$/, '')

  return {
    plugins: [
      react(),
      {
        name: 'livefit-r2-media-paths',
        enforce: 'pre',
        transform(code, id) {
          if (!id.includes('/src/') || !/\.[jt]sx?$/.test(id)) return null
          return code.replace(/\/images\//g, `${mediaBaseUrl}/images/`)
        },
      },
    ],
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:5000',
          changeOrigin: true,
        },
        '/images': {
          target: 'http://localhost:5000',
          changeOrigin: true,
        },
        '/uploads': {
          target: 'http://localhost:5000',
          changeOrigin: true,
        },
      },
    },
  }
})
