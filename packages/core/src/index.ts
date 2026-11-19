// 同构边界：根入口仅运行时导出「浏览器与 Node.js 均可运行」的模块。
// `pdf-engine` / `office-engine` 依赖 Node 原生能力（node:zlib）、pdfjs-dist/legacy
// 与动态导入的 onnxruntime-node，只应由主进程通过 subpath（@profer/core/pdf-engine、
// @profer/core/office-engine）消费；这里仅做纯类型导出，编译后完全擦除，零运行时引入，
// 避免渲染进程顺藤摸瓜把 Node 专用模块打进浏览器构建。
export * from './providers/index.ts'
export type * from './highlight/index.ts'
export type * from './pdf-engine/index.ts'
export type * from './office-engine/index.ts'
