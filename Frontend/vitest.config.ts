import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['./src/**/*.{test,spec}.{js,jsx,ts,tsx}'],
    reporters: ['verbose'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      exclude: ['node_modules/', 'src/test/'],
    },
  },
  resolve: {
    alias: {
      '#components': path.join(__dirname, '/src/components'),
      '#hooks': path.join(__dirname, '/src/hooks'),
      '#pages': path.join(__dirname, '/src/pages'),
      '#locales': path.join(__dirname, '/src/locales'),
      '#assets': path.join(__dirname, '/src/assets'),
      '#layouts': path.join(__dirname, '/src/layouts'),
      '#utils': path.join(__dirname, '/src/utils'),
      '#stores': path.join(__dirname, '/src/stores'),
      '#renderer': path.join(__dirname, '/src/renderer'),
      '#src': path.join(__dirname, '/src'),
      '#server': path.join(__dirname, '/server'),
      '#plugins': path.join(__dirname, '/src/plugins'),
      '#types': path.join(__dirname, '/src/types'),
      '#root': __dirname,
    },
  },
})
