import react from '@vitejs/plugin-react'
import vike from 'vike/plugin'
import { UserConfig } from 'vite'
import path from 'path'
import obfuscatorPlugin from 'vite-plugin-javascript-obfuscator'
import { compression } from 'vite-plugin-compression2'
import { ViteMinifyPlugin } from 'vite-plugin-minify'
import svgr from 'vite-plugin-svgr'

const config: UserConfig = {
  plugins: [
    react(),
    svgr(),
    vike(),
    ViteMinifyPlugin({}),
    compression(),
    obfuscatorPlugin({
      include: [
        'src/plugins/*.ts',
        'src/config/*.ts',
        'src/utils/helper/*.ts',
        'src/hooks/**/*.ts',
        'src/stores/*.ts',
        'src/components/**/*.ts',
      ],
      exclude: [/node_modules/],
      apply: 'build',
      debugger: true,
      options: {
        compact: true,
        controlFlowFlattening: true,
        controlFlowFlatteningThreshold: 1,
        deadCodeInjection: true,
        deadCodeInjectionThreshold: 1,
        identifierNamesGenerator: 'hexadecimal',
        log: false,
        numbersToExpressions: true,
        renameGlobals: false,
        selfDefending: true,
        simplify: true,
        splitStrings: true,
        splitStringsChunkLength: 5,
        stringArray: true,
        stringArrayCallsTransform: true,
        stringArrayEncoding: ['rc4'],
        stringArrayIndexShift: true,
        stringArrayRotate: true,
        stringArrayShuffle: true,
        stringArrayWrappersCount: 5,
        stringArrayWrappersChainedCalls: true,
        stringArrayWrappersParametersMaxCount: 5,
        stringArrayWrappersType: 'function',
        stringArrayThreshold: 1,
        transformObjectKeys: true,
        unicodeEscapeSequence: false,
      },
    }),
  ],
  build: {
    outDir: './build',
  },
  html: {
    cspNonce: process.env.CSP_NONCE,
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
  define: {
    'import.meta.env.PUBLIC_ENV__META__GOOGLE_CLIENT_KEY': JSON.stringify(
      process.env.PUBLIC_ENV__META__GOOGLE_CLIENT_KEY,
    ),
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: false,
    include: ['./src/**/*.{test,spec}.{js,jsx,ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      exclude: ['node_modules/', 'src/test/'],
    },
  },
}

export default config
