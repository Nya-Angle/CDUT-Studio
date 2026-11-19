#!/usr/bin/env node
import esbuild from 'esbuild'
import { mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const appDir = resolve(__dirname, '..')
const distDir = resolve(appDir, 'dist')
const chunksDir = resolve(distDir, 'chunks')

const args = new Set(process.argv.slice(2))
const isWatch = args.has('--watch')
const isMinify = args.has('--minify')
const target = args.has('--commercial') ? 'commercial' : 'oss'

const MAIN_EXTERNALS = [
  'electron',
  '@earendil-works/pi-coding-agent',
  '@earendil-works/pi-agent-core',
  '@earendil-works/pi-ai',
  'ssh2',
  'cpu-features',
]

mkdirSync(chunksDir, { recursive: true })

/**
 * 将主进程重型子系统入口重定向为外部按需加载的 ./chunks/*.cjs，
 * 让 dist/main.cjs 在启动阶段保持极小体积，避免 V8 同步编译几十 MB 非首屏代码。
 */
function createLazyChunkRedirectPlugin() {
  const chunkMap = new Map([
    [resolve(appDir, 'src/main/lib/review/review-chunk-entry.ts').replace(/\\/g, '/'), './chunks/review-bundle.cjs'],
    [resolve(appDir, 'src/main/lib/cslab/cslab-chunk-entry.ts').replace(/\\/g, '/'), './chunks/cslab-bundle.cjs'],
  ])

  return {
    name: 'lazy-chunk-redirect',
    setup(build) {
      build.onResolve({ filter: /(?:review-chunk-entry|cslab-chunk-entry)$/ }, (args) => {
        const resolved = resolve(args.resolveDir, args.path + '.ts').replace(/\\/g, '/')
        const targetChunk = chunkMap.get(resolved)
        if (targetChunk) {
          return { path: targetChunk, external: true }
        }
        return null
      })
      build.onResolve({ filter: /^@larksuiteoapi\/node-sdk$/ }, () => {
        return { path: './chunks/lark-sdk.cjs', external: true }
      })
    },
  }
}

const commonOptions = {
  bundle: true,
  platform: 'node',
  format: 'cjs',
  external: MAIN_EXTERNALS,
  define: {
    __PROFER_BUILD_TARGET__: JSON.stringify(target),
  },
  ...(isMinify ? { minifyWhitespace: true, minifyIdentifiers: true } : {}),
}

const chunkBuilds = [
  {
    ...commonOptions,
    entryPoints: [resolve(appDir, 'src/main/lib/cslab/cslab-ooxml-worker.ts')],
    outfile: resolve(distDir, 'cslab-ooxml-worker.cjs'),
  },
  {
    ...commonOptions,
    entryPoints: [resolve(appDir, 'src/main/lib/review/review-chunk-entry.ts')],
    outfile: resolve(chunksDir, 'review-bundle.cjs'),
  },
  {
    ...commonOptions,
    entryPoints: [resolve(appDir, 'src/main/lib/cslab/cslab-chunk-entry.ts')],
    outfile: resolve(chunksDir, 'cslab-bundle.cjs'),
  },
  {
    bundle: true,
    platform: 'node',
    format: 'cjs',
    entryPoints: ['@larksuiteoapi/node-sdk'],
    outfile: resolve(chunksDir, 'lark-sdk.cjs'),
    ...(isMinify ? { minifyWhitespace: true, minifyIdentifiers: true } : {}),
  },
]

const mainOptions = {
  ...commonOptions,
  entryPoints: [resolve(appDir, 'src/main/index.ts')],
  outfile: resolve(distDir, 'main.cjs'),
  plugins: [createLazyChunkRedirectPlugin()],
}

if (isWatch) {
  await Promise.all(chunkBuilds.map((opts) => esbuild.build(opts)))
  const ctx = await esbuild.context(mainOptions)
  await ctx.watch()
  console.log(`[build-main] watching (${target})...`)
} else {
  await Promise.all([
    ...chunkBuilds.map((opts) => esbuild.build(opts)),
    esbuild.build(mainOptions),
  ])
  console.log(`[build-main] built (${target}${isMinify ? ', minified' : ''})`)
}
