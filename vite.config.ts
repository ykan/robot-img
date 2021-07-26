import * as path from 'path'
import { defineConfig } from 'vite'

import reactRefresh from '@vitejs/plugin-react-refresh'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [reactRefresh()],
  resolve: {
    alias: {
      '@robot-img/react-img': path.join(__dirname, './packages/react-img/src/index.ts'),
      '@robot-img/utils': path.join(__dirname, './packages/utils/src/index.ts'),
    },
  },
  base: './',
  build: {
    outDir: '_site',
  },
  server: {
    open: '/docs/',
  },
})
