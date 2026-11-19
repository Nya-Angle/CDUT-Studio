import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import pkg from './package.json' with { type: 'json' }
import { resolveDevVitePort } from './src/main/lib/dev-instance'

export default defineConfig({
  plugins: [react()],
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
  },
  root: resolve(__dirname, 'src/renderer'),
  base: './',
  optimizeDeps: {
    // Mol* 5.x 的 package.json 没有根入口（无 main/module/exports），
    // 直接写 'molstar' 会让 Vite 预构建报 Failed to resolve entry for package "molstar"。
    // 这里按代码实际使用的深路径声明预构建入口，避免 dev 首屏逐个请求造成长时间白屏。
    include: [
      'molstar/lib/mol-plugin/context',
      'molstar/lib/mol-plugin/commands',
      'molstar/lib/mol-plugin/spec',
      'molstar/lib/mol-plugin-state/objects',
      'molstar/lib/mol-state',
      'molstar/lib/mol-util/color',
      'molstar/lib/mol-util/assets',
      'molstar/lib/mol-util/param-definition',
      'molstar/lib/mol-math/linear-algebra',
      'molstar/lib/mol-model/structure',
      'molstar/lib/mol-model/shape',
      'molstar/lib/mol-geo/geometry/mesh/mesh-builder',
      'molstar/lib/mol-geo/geometry/mesh/mesh',
    ],
  },
  build: {
    outDir: resolve(__dirname, 'dist/renderer'),
    emptyOutDir: true,
    modulePreload: {
      // 禁止首屏预加载非首屏重型专业模块，留待用户实际打开对应功能时按需加载
      resolveDependencies: (_filename, deps) => {
        const deferredPrefixes = [
          'molstar-',
          'three-',
          'pdfjs-',
          'canvas-editor-',
          'tiptap-',
          'office-',
          'ofv-profer-theme-',
          'katex-',
        ]
        return deps.filter((dep) => !deferredPrefixes.some((prefix) => dep.includes(prefix)))
      },
    },
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/renderer/index.html'),
        // 浏览器列里的独立文件预览页（Open File Viewer 宿主）；见 src/renderer/viewer/main.ts
        viewer: resolve(__dirname, 'src/renderer/viewer.html'),
      },
      output: {
        // 将重型第三方依赖按域拆分为独立 chunk，避免拖慢主应用首屏解析。
        manualChunks(id: string) {
          if (!id.includes('node_modules')) return undefined
          const normalized = id.replace(/\\/g, '/')
          if (normalized.includes('node_modules/molstar/')) return 'molstar'
          if (normalized.includes('node_modules/three/')) return 'three'
          if (normalized.includes('node_modules/pdfjs-dist/')) return 'pdfjs'
          if (normalized.includes('node_modules/@hufe921/canvas-editor/')) return 'canvas-editor'
          if (
            normalized.includes('node_modules/@tiptap/')
            || normalized.includes('node_modules/lowlight/')
            || normalized.includes('node_modules/prosemirror-')
          ) {
            return 'tiptap'
          }
          if (normalized.includes('node_modules/katex/')) return 'katex'
          if (
            normalized.includes('node_modules/xlsx/')
            || normalized.includes('node_modules/pptxgenjs/')
            || normalized.includes('node_modules/mammoth/')
          ) {
            return 'office'
          }
          return undefined
        },
      },
    },
  },
  resolve: {
    alias: [
      // Node 专用原生 canvas：Open File Viewer（emf-converter）有一段运行期守卫的可选 import，
      // 构建期必须给出替身，否则 @napi-rs/canvas 会把浏览器构建打挂。详见 stub 文件注释。
      { find: '@napi-rs/canvas', replacement: resolve(__dirname, 'src/renderer/lib/node-canvas-stub.ts') },
      { find: 'canvas', replacement: resolve(__dirname, 'src/renderer/lib/node-canvas-stub.ts') },
      // Node 专用 node:zlib：@profer/core 的 PDF/Office 解析引擎只应由主进程通过 subpath 消费。
      // 这里给浏览器构建一个「可解析、import 期不抛错」的替身，避免未来第三方库深层引入 node:zlib
      // 时把客户端打挂（访问即抛异常的浏览器外部化 Stub 会在首屏 import 阶段直接崩溃）。详见 stub 注释。
      { find: /^node:zlib$/, replacement: resolve(__dirname, 'src/renderer/lib/node-zlib-stub.ts') },
      { find: /^zlib$/, replacement: resolve(__dirname, 'src/renderer/lib/node-zlib-stub.ts') },
      { find: '@/types', replacement: resolve(__dirname, 'src/types') },
      { find: '@', replacement: resolve(__dirname, 'src/renderer') },
      // 根目录 assets 别名：供 CDUT 专区等渲染组件干净引用校徽与校宠立绘等静态资产
      { find: '@assets', replacement: resolve(__dirname, '../../assets') },
    ],
  },
  server: {
    port: resolveDevVitePort(),
    strictPort: true, // 确保使用指定端口，如被占用则报错
    open: false,
    // 部分 macOS 环境下“基于路径的 FSEvents 流”不派发任何事件（本机实测：fsevents 原生模块、
    // fs.watch({recursive:true}) 与 chokidar 默认模式全部零事件，而 libuv 的逐目录 fs.watch 正常），
    // 于是 Vite 的文件监听会静默失效：改动不触发 HMR、dev server 一直返回旧模块、只能重启生效。
    // 默认改走 chokidar 的 fs.watch 路径；若需要恢复 FSEvents 设 PROFER_VITE_WATCH_FSEVENTS=1，
    // 若极少数环境连 fs.watch 也失效，可设 PROFER_VITE_WATCH_POLLING=1 改用轮询兜底。
    watch: {
      useFsEvents: process.env.PROFER_VITE_WATCH_FSEVENTS === '1',
      ...(process.env.PROFER_VITE_WATCH_POLLING === '1'
        ? { usePolling: true, interval: 300 }
        : {}),
    },
  },
})
