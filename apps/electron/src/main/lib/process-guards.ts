/**
 * 主进程全局异常兜底（稳定性收口）。
 *
 * 目标：**任何子系统（含审核）出错都不得让整个应用消失**。
 *
 * 背景：Node 默认对 `uncaughtException` 直接终止进程；Electron 主进程一旦退出，
 * 窗口与所有未保存状态一起丢失。审核模块包含后台 Pi 运行、规则计算、文件解析等
 * 大量异步链路，任何一处遗漏的 catch 都可能升级为整应用崩溃。
 *
 * 策略：
 * - `unhandledRejection`：只记录（含来源栈），不终止——Promise 遗漏本就常见；
 * - `uncaughtException`：记录并保持运行，但**同一错误指纹高频重复时**才考虑退出，
 *   避免错误循环把 CPU 打满（此处仅做节流记录，仍不退出）；
 * - 记录写入结构化日志数组，供诊断与后续上报，不在 UI 上弹模态框打断用户。
 *
 * 注意：这不是"吞掉错误"。异常必须留痕（stack + 标签），只是不升级为进程死亡。
 */

export interface ProcessGuardEntry {
  kind: 'uncaughtException' | 'unhandledRejection'
  at: string
  message: string
  stack?: string
  /** 同一指纹重复次数（用于识别错误循环） */
  repeat: number
}

/** 保留最近若干条，避免异常风暴吃内存。 */
const MAX_ENTRIES = 50
const entries: ProcessGuardEntry[] = []
const fingerprints = new Map<string, number>()

let installed = false

/** 供诊断/测试读取（只读副本）。 */
export function readProcessGuardEntries(): readonly ProcessGuardEntry[] {
  return entries.map((entry) => ({ ...entry }))
}

function fingerprintOf(kind: string, error: unknown): string {
  // 只按「类型 + 消息」去重：调用栈行号随调用点变化，若纳入指纹会
  // 把同一个错误判成不同错误，导致节流失效、日志被刷屏。
  const name = error instanceof Error ? error.name : typeof error
  const message = error instanceof Error ? error.message : String(error)
  return `${kind}::${name}::${message}`
}

/**
 * 记录一次进程级失败（供现有监听器与测试共用，便于确定性验证）。
 */
export function recordProcessFailure(kind: ProcessGuardEntry['kind'], error: unknown): ProcessGuardEntry {
  const message = error instanceof Error ? error.message : String(error)
  const fingerprint = fingerprintOf(kind, error)
  const repeat = (fingerprints.get(fingerprint) ?? 0) + 1
  fingerprints.set(fingerprint, repeat)
  const entry: ProcessGuardEntry = {
    kind,
    at: new Date().toISOString(),
    message,
    ...(error instanceof Error && error.stack ? { stack: error.stack } : {}),
    repeat,
  }
  entries.push(entry)
  if (entries.length > MAX_ENTRIES) entries.shift()
  // 首次与每 50 次记录一次日志，避免错误循环刷屏
  if (repeat === 1 || repeat % 50 === 0) {
    console.error(`[主进程兜底] ${kind}（第 ${repeat} 次）: ${message}`)
    if (entry.stack) console.error(entry.stack)
  }
  return entry
}

/**
 * 安装全局兜底。可重复调用（幂等），返回是否本次真正安装。
 */
export function installProcessGuards(): boolean {
  if (installed) return false
  installed = true
  process.on('unhandledRejection', (reason) => {
    recordProcessFailure('unhandledRejection', reason)
  })
  process.on('uncaughtException', (error) => {
    recordProcessFailure('uncaughtException', error)
    // 故意不调用 process.exit：审核等子系统的异常不应终结整个应用。
    // 真正的致命错误（如 Electron 自身崩溃）不会进入这里。
  })
  return true
}

/** 测试用：重置状态，允许重新安装。 */
export function resetProcessGuardsForTest(): void {
  entries.length = 0
  fingerprints.clear()
  installed = false
}
