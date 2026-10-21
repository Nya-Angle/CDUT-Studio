/**
 * 工具分类规则 — Agent 权限系统
 *
 * 定义安全工具白名单、安全 Bash 命令模式和危险命令列表。
 * 用于智能模式下的自动允许/询问判断。
 */

/** 返回跨 Runtime 共用的逻辑工具短名；兼容 Claude MCP 命名空间和 Pi 原生工具名。 */
export function canonicalAgentToolName(toolName: string): string {
  const trimmed = toolName.trim()
  return trimmed.split('__').at(-1) ?? trimmed
}

/** 工具名是否匹配指定逻辑工具；避免把 Claude MCP namespace 当成能力名。 */
export function isCanonicalAgentTool(toolName: string, canonicalName: string): boolean {
  return canonicalAgentToolName(toolName) === canonicalName
}

/**
 * CSLab 只读科学计算工具：纯计算/文件读取，不写文件、不改画板，免逐次确认。
 */
export const CSLAB_READ_ONLY_SCIENCE_TOOLS: readonly string[] = [
  'cslab_list_lab_tools',
  'cslab_analyze_crystal',
  'cslab_simulate_pxrd',
  'cslab_fit_peaks',
  'cslab_focus_structure',
]

/**
 * CSLab 实验室 Python 工具由 pi-cslab-tools 动态装配。
 * 执行类工具必须逐次确认；只读科学计算工具与 cslab_list_lab_tools 不在此列。
 */
export function isCsLabExecutionTool(toolName: string): boolean {
  const name = toolName.trim()
  return name.startsWith('cslab_') && !CSLAB_READ_ONLY_SCIENCE_TOOLS.includes(name)
}

/** 始终安全的工具（免询问） */
export const SAFE_TOOLS: readonly string[] = [
  'Read',            // 文件读取
  'Glob',            // 文件名搜索
  'Grep',            // 内容搜索
  'WebSearch',       // 网络搜索
  'WebFetch',        // 网页获取
  // Pi 受管浏览器：网页隔离、私网/下载/弹窗/权限已在主进程策略层拦截。
  'BrowserObserve',
  'BrowserNavigate',
  'BrowserGoBack',
  'BrowserGoForward',
  'BrowserReload',
  'BrowserScroll',
  'BrowserExtract',
  'BrowserClick',
  'BrowserFill',
  'BrowserPress',
  'BrowserScreenshot',
  'BrowserListTabs',
  'BrowserNewTab',
  'BrowserSelectTab',
  'BrowserPreviewOpen',
  'TodoRead',        // Todo 列表读取
  'TodoWrite',       // Todo 列表写入（无安全风险）
  'TaskOutput',      // 后台任务输出
  // CSLab 只读科学计算：不写文件、不改画板，免询问
  'cslab_analyze_crystal',
  'cslab_simulate_pxrd',
  'cslab_fit_peaks',
  'cslab_focus_structure',
  // 注意：AskUserQuestion 不在此列表 — 由 canUseTool 拦截并展示交互式 UI
]

/** 安全的 Bash 命令模式（只读操作） */
export const SAFE_BASH_PATTERNS: readonly RegExp[] = [
  /^git\s+(status|log|diff|show|branch|remote|tag)\b/,
  /^ls\b/,
  /^head\b/,
  /^tail\b/,
  /^grep\b/,
  /^rg\b/,
  /^which\b/,
  /^pwd$/,
  /^env$/,
  /^whoami$/,
  /^uname\b/,
  /^tree\b/,
  /^wc\b/,
  /^file\b/,
  /^stat\b/,
  /^du\b/,
  /^df\b/,
  /^node\s+--version$/,
  /^bun\s+--version$/,
  /^npm\s+(list|ls|view|info|outdated)\b/,
  /^bun\s+(pm\s+ls)\b/,
  // 注意：cat/echo/find 不在此列表中
  // - cat 可读取敏感文件（~/.ssh/id_rsa 等）
  // - echo 可通过重定向写入文件
  // - find 的 -exec/-delete 可执行任意命令/删除文件
]

/** 危险命令前缀（需特别标记⚠️） */
export const DANGEROUS_COMMANDS: readonly string[] = [
  'rm', 'rmdir',
  'sudo', 'su',
  'chmod', 'chown',
  'mv',
  'dd',
  'kill', 'killall', 'pkill',
  'git push', 'git reset', 'git rebase', 'git checkout',
  'git clean', 'git branch -D', 'git branch -d',
  'npm publish',
  'curl', 'wget',
  'ssh', 'scp',
]

/**
 * 检测 Bash 命令是否包含危险结构
 *
 * 检测管道、输出重定向、exec 子命令等危险模式。
 * MVP 阶段使用简单字符串检测，后续可升级为 shell AST 解析。
 */
export function hasDangerousStructure(command: string): boolean {
  // 管道操作
  if (/[|]/.test(command)) return true
  // 输出重定向
  if (/>{1,2}/.test(command)) return true
  // find -exec / -delete（可执行任意命令/删除文件）
  if (/\b-exec\b/.test(command) || /\b-delete\b/.test(command)) return true
  // 命令链接操作符：&& 和命令上下文中的独立分号（排除引号内字符串中的分号）
  if (/&&/.test(command) || /;\s*(?=\S)/.test(command)) return true
  // 子 shell / 命令替换（$(...) 和反引号）
  if (/\$\(/.test(command) || /`/.test(command)) return true
  return false
}

/**
 * 判断 Bash 命令是否匹配安全模式
 */
export function isSafeBashCommand(command: string): boolean {
  const trimmed = command.trim()
  if (hasDangerousStructure(trimmed)) return false
  return SAFE_BASH_PATTERNS.some((pattern) => pattern.test(trimmed))
}

/** Windows PowerShell 的自动允许必须独立于 Bash：仅覆盖不读取内容、不写入、不启动进程的简单查询。 */
export const SAFE_POWERSHELL_PATTERNS: readonly RegExp[] = [
  /^(Get-Location|pwd)$/i,
  /^Get-Date$/i,
  /^Get-ChildItem$/i,
  /^Get-Process(?:\s+-Name\s+[A-Za-z0-9_.-]+)?$/i,
  /^Get-Command\s+[A-Za-z0-9_.-]+$/i,
  /^Get-Item\s+[^|><;&`$()]+$/i,
  /^Test-Path\s+[^|><;&`$()]+$/i,
]

/** PowerShell 命令拼接、管道、重定向、脚本块和子表达式一律不自动允许。 */
export function hasDangerousPowerShellStructure(command: string): boolean {
  return /[|><;&`{}]|\$\(|\$[A-Za-z_]/.test(command)
}

export function isSafePowerShellCommand(command: string): boolean {
  const trimmed = command.trim()
  if (hasDangerousPowerShellStructure(trimmed)) return false
  return SAFE_POWERSHELL_PATTERNS.some((pattern) => pattern.test(trimmed))
}

/**
 * 判断命令是否为危险命令
 */
export function isDangerousCommand(command: string): boolean {
  const trimmed = command.trim().toLowerCase()
  return DANGEROUS_COMMANDS.some((dc) => trimmed.startsWith(dc.toLowerCase()))
}
