import path from 'node:path'
import { fileURLToPath } from 'url'
import { build } from 'esbuild'
import fs from 'fs-extra'

// Xử lý __filename và __dirname trong ESM
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const buildServer = async () => {
  const result = await build({
    absWorkingDir: process.cwd(),
    entryPoints: [path.join(path.resolve(__dirname, '../../server/'), 'index.ts')],
    outfile: 'index.mjs', // Đầu ra là file ESM
    write: false,
    minify: true,
    platform: 'node',
    bundle: true,
    format: 'esm', // Định dạng ESM
    sourcemap: false,
    treeShaking: true,
    define: {
      'import.meta.url': JSON.stringify(import.meta.url), // ESM sử dụng trực tiếp import.meta.url
      'process.env.NODE_ENV': '"production"',
    },
    inject: [path.resolve(__dirname, './import.meta.url-polyfill.ts')],
    banner: {
      js: `/* eslint-disable prettier/prettier */`,
    },
    tsconfig: path.resolve(__dirname, './tsconfig.buildServer.json'),
    plugins: [
      {
        name: 'externalize-deps',
        setup(build) {
          build.onResolve({ filter: /.*/ }, (args) => {
            const id = args.path
            if (!id.startsWith('.') && !path.isAbsolute(id)) {
              return { external: true } // Đánh dấu các dependencies là external
            }
          })
        },
      },
    ],
  })

  const { text } = result.outputFiles[0]
  const filePath = path.join(path.resolve(__dirname, '../../build/'), 'index.mjs')
  if (fs.existsSync(filePath)) {
    await fs.remove(filePath)
  }
  await fs.ensureDir(path.dirname(filePath))
  await fs.writeFile(filePath, text)
}

// Gọi hàm build server
buildServer().catch(() => {
  process.exit(1)
})
