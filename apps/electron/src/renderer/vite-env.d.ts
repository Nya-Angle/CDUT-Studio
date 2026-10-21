/// <reference types="vite/client" />

// CSS 模块类型声明
declare module '*.css' {
  const content: Record<string, string>
  export default content
}

// 音频资源类型声明
declare module '*.wav' {
  const src: string
  export default src
}

declare module '*.mp3' {
  const src: string
  export default src
}

// PDF.js Worker 主线程降级模块（评审加固 11.3）
declare module 'pdfjs-dist/build/pdf.worker.min.mjs' {
  const worker: unknown
  export default worker
}

// Vite Worker 构造器导入：避免打包后 file:// 下模块 Worker 路径差异
declare module '*?worker' {
  const WorkerFactory: new () => Worker
  export default WorkerFactory
}

// WGSL 着色器原文导入
declare module '*.wgsl?raw' {
  const content: string
  export default content
}

// 附件临时 base64 缓存（用于发送前暂存数据）
interface Window {
  __pendingAttachmentData?: Map<string, string>
  __pendingAgentFileData?: Map<string, string>
}
