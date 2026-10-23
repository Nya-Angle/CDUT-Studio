/**
 * 应用设置类型
 *
 * 主题模式、IPC 通道等设置相关定义。
 */

import type { EnvironmentCheckResult, ThinkingConfig, AgentEffort, FeishuSessionMirrorSettings, AgentRuntime } from '@profer/shared'

/** 通知音场景类型 */
export type NotificationSoundType = 'taskComplete' | 'permissionRequest' | 'exitPlanMode' | 'planningReminder'

/** 可选通知音 ID（内置 + 自定义） */
export type NotificationSoundId = string

/** 自定义通知音元数据 */
export interface CustomNotificationSound {
  /** 唯一 ID，格式 "custom-{timestamp}-{random}" */
  id: string
  /** 用户指定的显示名称 */
  label: string
  /** 实际存储的文件名（UUID + 扩展名） */
  fileName: string
  /** 添加时间戳 */
  addedAt: number
}

/** 各场景通知音配置 */
export interface NotificationSoundSettings {
  /** 任务完成 */
  taskComplete?: NotificationSoundId
  /** 权限审批（含 AskUser） */
  permissionRequest?: NotificationSoundId
  /** 计划审批 */
  exitPlanMode?: NotificationSoundId
  /** 任务/日程提醒 */
  planningReminder?: NotificationSoundId
}

/** 语音输入供应商 */
export type VoiceDictationProvider = 'doubao'

/** 豆包 ASR 连接模式 */
export type VoiceDictationEndpointMode = 'async' | 'duplex'

/** 语音输入输出方式 */
export type VoiceDictationOutputMode = 'auto' | 'clipboard' | 'profer-input'

/** 语音输入浮窗位置 */
export interface VoiceDictationWindowPosition {
  x: number
  y: number
  /** 窗口相对于所在屏幕 workArea 的归一化水平偏移 (0~1) */
  relativeX?: number
  /** 窗口相对于所在屏幕 workArea 的归一化垂直偏移 (0~1) */
  relativeY?: number
}

/** 语音输入设置（渲染进程读取到的是解密后的值） */
export interface VoiceDictationSettings {
  /** 是否启用语音输入 */
  enabled: boolean
  /** 语音识别供应商 */
  provider: VoiceDictationProvider
  /** 豆包 APP ID，对应 X-Api-App-Key 请求头 */
  appId: string
  /** 豆包 Access Token，对应 X-Api-Access-Key 请求头 */
  accessToken: string
  /** 豆包 Resource ID */
  resourceId: string
  /** 语言，空字符串表示自动 */
  language: string
  /** WebSocket 端点模式 */
  endpointMode: VoiceDictationEndpointMode
  /** 输出方式 */
  outputMode: VoiceDictationOutputMode
  /** 自定义热词，按行或逗号分隔，启动识别时直传给豆包 ASR */
  customHotwords: string
  /** 语音输入浮窗上次拖动后的位置 */
  windowPosition?: VoiceDictationWindowPosition
}

/** 语音输入设置更新 */
export type VoiceDictationSettingsUpdate = Partial<VoiceDictationSettings>

/** 落盘配置，保留旧字段用于从 MVP 早期版本平滑迁移 */
export interface VoiceDictationPersistedSettings extends Partial<VoiceDictationSettings> {
  /** @deprecated 使用 appId */
  appKey?: string
  /** @deprecated 使用 accessToken */
  accessKey?: string
}

/** 语音输入转写事件 */
export interface VoiceDictationTranscriptEvent {
  sessionId: string
  text: string
  isFinal: boolean
}

/** 语音输入状态事件 */
export interface VoiceDictationStateEvent {
  sessionId?: string
  status: 'idle' | 'connecting' | 'recording' | 'stopping' | 'completed' | 'error'
  message?: string
}

/** 开始语音输入会话参数 */
export interface VoiceDictationStartInput {
  sessionId: string
}

/** 语音音频分片 */
export interface VoiceDictationAudioChunkInput {
  sessionId: string
  data: ArrayBuffer
}

/** 结束语音输入会话参数 */
export interface VoiceDictationStopInput {
  sessionId: string
}

/** 输出语音输入文本参数 */
export interface VoiceDictationCommitInput {
  text: string
}

/** 调整语音输入浮窗尺寸参数 */
export interface VoiceDictationResizeInput {
  height: number
}

/** 输出语音输入文本结果 */
export interface VoiceDictationCommitResult {
  mode: 'profer-input' | 'cursor' | 'clipboard'
  success: boolean
  message: string
}

/** 语音输入测试结果 */
export interface VoiceDictationTestResult {
  success: boolean
  message: string
}

/** 麦克风权限检查结果 */
export interface MicPermissionResult {
  status: 'granted' | 'denied' | 'not-determined' | 'unsupported'
  platform: NodeJS.Platform
}

/**
 * 用户自定义快捷键覆盖（持久化到 settings.json）
 *
 * 字段三态语义：
 * - `undefined`（字段缺失）→ 使用默认快捷键
 * - 非空字符串 → 使用该自定义 accelerator
 * - `null` → 用户已主动禁用此平台的快捷键，不注册任何监听
 */
export interface ShortcutOverrides {
  [shortcutId: string]: {
    mac?: string | null
    win?: string | null
  }
}

/** 主题模式 */
export type ThemeMode = 'light' | 'dark' | 'system' | 'special'

/**
 * 特殊风格值即皮肤包 id。权威来源是主进程扫描得到的皮肤注册表，
 * 不使用编译期白名单，以支持用户导入的皮肤。
 */
export type ThemeStyle = string
export type ThemeStyleId = ThemeStyle

/** 皮肤包 manifest 的安全解析结果，供主/渲染进程共享。 */
export interface SkinInfo {
  id: string
  name: string
  tone: 'light' | 'dark'
  /** Skin Surface Contract 版本；缺失视为 v1，内置皮肤 v2 起必须显式声明 2。 */
  contractVersion: number
  version?: string
  author?: string
  description?: string
  titlebar?: { color: string; symbolColor: string }
  builtin: boolean
  previewScale?: number
  previewPosition?: string
  tooltip?: string
}

/** 皮肤安装/删除的结构化结果；冲突由前端确认后以 replace 重试。 */
export interface SkinManagerResult {
  ok: boolean
  status: 'installed' | 'replaced' | 'deleted' | 'conflict' | 'cancelled' | 'error'
  skin?: SkinInfo
  message?: string
}

/** 默认主题模式 */
export const DEFAULT_THEME_MODE: ThemeMode = 'system'

/** 默认特殊风格 */
export const DEFAULT_THEME_STYLE: ThemeStyle = 'default'

/** 界面风格：经典保留旧版视觉，现代使用当前更克制的 UI */
export type InterfaceVariant = 'classic' | 'modern'

/** 默认界面风格 */
export const DEFAULT_INTERFACE_VARIANT: InterfaceVariant = 'classic'

/** Markdown 预览字号档位 */
export type MarkdownFontSize = 'small' | 'medium' | 'large'

/** 默认 Markdown 字号档位 */
export const DEFAULT_MARKDOWN_FONT_SIZE: MarkdownFontSize = 'medium'

/** 界面缩放档位（默认标准，见 atoms/ui-scale.ts） */
export type UiScale = 'standard' | 'large' | 'xlarge' | 'huge' | 'massive' | 'max'

/** 默认界面缩放档位 */
export const DEFAULT_UI_SCALE: UiScale = 'standard'

/** 默认 Agent runtime：Pi。 */
export const DEFAULT_AGENT_RUNTIME: AgentRuntime = 'pi'

/** 提升此版本可要求用户重新确认更新后的受管浏览器风险告知。 */
export const BROWSER_RISK_DISCLAIMER_VERSION = 1

/** 应用设置 */
export interface AppSettings {
  /** 主题模式 */
  themeMode: ThemeMode
  /** 特殊风格主题 */
  themeStyle?: ThemeStyle
  /** 界面风格 */
  interfaceVariant?: InterfaceVariant
  /** Agent 默认渠道 ID（仅限 Anthropic 渠道） — 当前选中的渠道 */
  agentChannelId?: string
  /** Agent 默认模型 ID */
  agentModelId?: string
  /** 新建 Agent 会话的默认 runtime；历史设置缺省时回退 Claude。 */
  agentRuntime?: AgentRuntime
  /** Agent 启用的渠道 ID 列表（多选，Switch 开关） */
  agentChannelIds?: string[]
  /** Agent 当前工作区 ID */
  agentWorkspaceId?: string
  /** 是否已完成 Onboarding 流程 */
  onboardingCompleted?: boolean
  /** 审核专区：AI 代批开关（08 设计：默认禁止；开启需 UI 风险确认；Agent 不可自行开启） */
  reviewAgentAutoApproval?: boolean
  /** AI 代批开启记录（风险确认留痕：时间+确认人） */
  reviewAgentAutoApprovalGrantedAt?: string
  reviewAgentAutoApprovalGrantedBy?: string
  /** 已看过的界面蒙层引导（CoachTour）内容版本；低于当前版本时自动重播一次。缺省视为 0 */
  coachTourVersion?: number
  /** 是否跳过了环境检测 */
  environmentCheckSkipped?: boolean
  /** 最后一次环境检测结果（缓存） */
  lastEnvironmentCheck?: EnvironmentCheckResult
  /** 是否启用桌面通知 */
  notificationsEnabled?: boolean
  /** 是否启用通知提示音（阻塞 Hook 触发时播放） */
  notificationSoundEnabled?: boolean
  /** 各场景通知音选择 */
  notificationSounds?: NotificationSoundSettings
  /** 用户添加的自定义通知音 */
  customNotificationSounds?: CustomNotificationSound[]
  /** 标签页持久化状态（重启恢复） */
  tabState?: PersistedTabSettings
  /** Agent 思考模式 */
  agentThinking?: ThinkingConfig
  /** Agent 推理深度 */
  agentEffort?: AgentEffort
  /** Agent 最大预算（美元/次） */
  agentMaxBudgetUsd?: number
  /** Agent 最大轮次（0 或 undefined = SDK 默认） */
  agentMaxTurns?: number
  /** 已确认的受管浏览器风险告知版本；低于当前版本时首次使用会再次要求确认。 */
  browserRiskDisclaimerVersion?: number
  /** Windows 可执行/脚本文件打开确认框勾选「不再提醒」后置 true；缺省视为仍需确认。 */
  executableOpenWarningDismissed?: boolean
  /** 新标签页默认首页 URL；空串/未设置 = 显示自定义起始页。 */
  browserHomeUrl?: string
  /** 教程推荐横幅是否已关闭 */
  tutorialBannerDismissed?: boolean
  /** 自动归档天数（0 = 禁用，默认 7） */
  archiveAfterDays?: number
  /** 发送消息快捷键模式：true = Cmd/Ctrl+Enter 发送，false(默认) = Enter 发送 */
  sendWithCmdEnter?: boolean
  /** 用户自定义快捷键覆盖 */
  shortcutOverrides?: ShortcutOverrides
  /** 是否显示用户消息悬浮置顶条（默认 true） */
  stickyUserMessageEnabled?: boolean
  /** 粘贴超过阈值的长文本时是否自动转为附件（默认 false） */
  longTextPasteAsAttachmentEnabled?: boolean
  /** 输入框是否渲染 Markdown 富文本格式（默认 false，关闭后为纯文本模式，仍保留 Mention 引用） */
  richTextRenderingEnabled?: boolean
  /** 窗口内高低于该值（px）时输入框进入紧凑档（默认 700；0 = 关闭，输入框高度恒定） */
  inputCompactViewportHeight?: number
  /** 紧凑档下输入框最小高度（px，默认 60；决定空内容时变矮多少，常规为 101） */
  inputCompactMinHeight?: number
  /** 紧凑档下输入框最大高度（px，默认 140；展开档为该值 2 倍且不超过 500） */
  inputCompactMaxHeight?: number
  /** Markdown 预览字号档位（默认 'medium'，对应 15px） */
  markdownFontSize?: MarkdownFontSize
  /** 界面缩放档位（默认 'standard' 100%） */
  uiScale?: UiScale
  /** Agent 预览默认展开方式（默认 'tab'） */
  previewModePreference?: 'tab' | 'split'
  /** 上次是否在 Scratch Pad 页（用于重启恢复） */
  scratchPadActive?: boolean
  /** 应用图标变体 ID（dock + window icon），'default' 或 logo 变体 id */
  appIconVariant?: string
  /** 语音输入设置（Access Token 以加密态存储，由专用服务解密后返回渲染进程） */
  voiceDictation?: VoiceDictationPersistedSettings
  /** 是否启用快速任务窗口（使用当前平台全局快捷键，默认 false，启用后预创建隐藏窗口） */
  quickTaskEnabled?: boolean
  /** 飞书 Session 镜像设置：每个 Profer Session 可创建一个仅包含用户与指定 Bot 的飞书群 */
  feishuSessionMirror?: FeishuSessionMirrorSettings
  /** 启动时自动清理临时文件（profer-preview、profer-installers），默认 true */
  autoCleanupTempOnStart?: boolean
  /** 自动清理 N 天前已归档会话的 SDK 数据（0 = 禁用，默认 0） */
  autoCleanupArchivedDays?: number
  /** 主窗口状态（大小、位置、是否最大化） */
  mainWindowState?: MainWindowState
  /** 规划中心独立窗口状态（大小、位置、是否最大化） */
  planningWindowState?: MainWindowState
  /** 科学助理独立窗口状态（大小、位置、是否最大化） */
  scienceAgentWindowState?: MainWindowState
  /** 是否开机自启动（默认 false） */
  autoLaunch?: boolean
  /** 是否已通过版本号连击解锁开发者模式。 */
  developerModeEnabled?: boolean
  /** 是否启用 Agent 开放认识论姿态；仅在开发者模式下生效。 */
  openEpistemicModeEnabled?: boolean
  /** 是否启用局域网移动模式（试验版）；启动后自动恢复。 */
  pocketModeEnabled?: boolean
  /** 移动模式服务端口（正式版默认 7788，开发模式默认 7789；0/缺省表示使用默认端口）。 */
  pocketModePort?: number
  /** Windows Shell 环境偏好：'auto'（自动检测，优先 Git Bash）| 'git-bash' | 'wsl'（默认 'auto'） */
  agentShellPreference?: 'auto' | 'git-bash' | 'wsl'
  /** 终身记忆检索引擎：'classic' 经典 FTS5 BM25 | 'hipporag' 海马体图谱多跳增强（默认 classic） */
  memoryRetrievalEngine?: 'classic' | 'hipporag'
  /** 速课堂知识检索引擎：'classic' 经典混合检索 | 'graphrag' 分层 Leiden GraphRAG（默认 classic） */
  studyRetrievalEngine?: 'classic' | 'graphrag'
  /** 全局上下文索引开关：true 时所有会话强制使用索引模式（默认 false）。 */
  agentContextIndexGlobal?: boolean
  /** 最近一次已读的系统公告 ID；与内置最新公告 ID 不一致时启动弹一次公告栏 */
  lastReadBulletinId?: string
}

/** 主窗口大小、位置和最大化状态 */
export interface MainWindowState {
  width: number
  height: number
  x: number
  y: number
  isMaximized: boolean
}

/** 持久化的标签页状态 */
export interface PersistedTabSettings {
  tabs: import('../renderer/atoms/tab-atoms').TabItem[]
  activeTabId: string | null
  /** 旧版单组合布局；仅用于向后兼容读取。 */
  group?: import('../renderer/atoms/tab-group-atoms').PersistedTabGroup
  /** 可选的多个左右组合布局；缺省或空数组表示单栏。 */
  groups?: import('../renderer/atoms/tab-group-atoms').PersistedTabGroup[]
}

/** 移动模式（Pocket 远程接入）服务状态与连接信息 */
export interface PocketModeStatus {
  enabled: boolean
  running: boolean
  port: number
  /** 未显式配置时的默认端口（正式版 7788 / 开发版 7789），UI 用于显示“默认/自定义”状态 */
  defaultPort: number
  localUrl: string | null
  lanUrl: string | null
  token: string | null
  /** 最近一次启动失败原因；服务恢复后清空。 */
  error: string | null
}

export const SKIN_IPC_CHANNELS = {
  GET_SKINS: 'skins:get-list',
  GET_SKIN_CSS: 'skins:get-css',
  GET_SKIN_PREVIEW: 'skins:get-preview',
  SELECT_ZIP: 'skins:select-zip',
  SELECT_FOLDER: 'skins:select-folder',
  INSTALL_ZIP: 'skins:install-zip',
  INSTALL_FOLDER: 'skins:install-folder',
  DELETE_USER_SKIN: 'skins:delete-user',
  OPEN_USER_FOLDER: 'skins:open-user-folder',
  OPEN_TEMPLATE_FOLDER: 'skins:open-template-folder',
  REFRESH: 'skins:refresh',
  /** 皮肤安装/删除/刷新后广播给所有窗口（多窗口同步刷新） */
  ON_SKINS_CHANGED: 'skins:changed',
} as const

/** 跨窗口同步的开发者设置快照。 */
export interface DeveloperSettingsSnapshot {
  developerModeEnabled: boolean
  openEpistemicModeEnabled: boolean
}

export const SETTINGS_IPC_CHANNELS = {
  RENDERER_READY: 'settings:renderer-ready',
  GET: 'settings:get',
  UPDATE: 'settings:update',
  /** AI 代批开关专用确认通道（08 设计：带风险确认留痕；通用 UPDATE 通道剥离此字段） */
  SET_REVIEW_AGENT_AUTO_APPROVAL: 'settings:set-review-agent-auto-approval',
  UPDATE_SYNC: 'settings:update-sync',
  GET_SYSTEM_THEME: 'settings:get-system-theme',
  ON_SYSTEM_THEME_CHANGED: 'settings:system-theme-changed',
  /** 用户手动切换主题时广播给所有窗口 */
  ON_THEME_SETTINGS_CHANGED: 'settings:theme-settings-changed',
  /** 开发者模式及 Agent 开放认识论设置变化时广播给所有窗口 */
  ON_DEVELOPER_SETTINGS_CHANGED: 'settings:developer-settings-changed',
  /** 获取/设置开机自启动状态 */
  GET_AUTO_LAUNCH: 'settings:get-auto-launch',
  SET_AUTO_LAUNCH: 'settings:set-auto-launch',
  /** 移动模式（试验版）运行时控制 */
  GET_POCKET_MODE_STATUS: 'settings:get-pocket-mode-status',
  SET_POCKET_MODE_ENABLED: 'settings:set-pocket-mode-enabled',
  /** 设置移动模式服务端口（保存并热应用；服务运行时自动重启） */
  SET_POCKET_MODE_PORT: 'settings:set-pocket-mode-port',
  /** 获取安卓版 APK 扫码下载二维码（指向官网 profer.cn 域名；始终返回） */
  GET_APK_QR: 'settings:get-apk-qr',
} as const

/** 自定义通知音 IPC 通道 */
export const NOTIFICATION_SOUND_IPC_CHANNELS = {
  /** 添加自定义音效：{ sourcePath, label } → CustomNotificationSound */
  ADD: 'notification-sound:add',
  /** 删除自定义音效：{ id } → CustomNotificationSound[] */
  REMOVE: 'notification-sound:remove',
  /** 获取自定义音效的文件 URL：{ fileName } → string */
  GET_URL: 'notification-sound:get-url',
} as const

/** 桌面通知 IPC 通道（主进程弹出原生 Notification） */
export const DESKTOP_NOTIFICATION_IPC_CHANNELS = {
  /** 渲染进程 → 主进程：请求弹出桌面通知 */
  SHOW: 'desktop-notification:show',
  /** 主进程 → 渲染进程：用户点击了通知 */
  CLICKED: 'desktop-notification:clicked',
} as const

/** Scratch Pad IPC 通道 */
export const SCRATCH_PAD_IPC_CHANNELS = {
  /** 从磁盘加载 scratch-pad.md 内容 */
  LOAD: 'scratch-pad:load',
  /** 保存内容到 scratch-pad.md */
  SAVE: 'scratch-pad:save',
  /** 同步保存（beforeunload 场景） */
  SAVE_SYNC: 'scratch-pad:save-sync',
  /** 导出为 Markdown 到指定目录 */
  EXPORT: 'scratch-pad:export',
  /** 打开保存对话框选择导出路径 */
  CHOOSE_EXPORT_PATH: 'scratch-pad:choose-export-path',
} as const

/** 应用图标 IPC 通道 */
export const APP_ICON_IPC_CHANNELS = {
  /** 设置应用图标（variant ID） */
  SET: 'app-icon:set',
} as const

/** Dock/Launcher 角标 IPC 通道 */
export const DOCK_BADGE_IPC_CHANNELS = {
  /** 设置系统应用角标数量 */
  SET_COUNT: 'dock-badge:set-count',
} as const

/** 全局快捷键 IPC 通道（快速任务窗口已移除，通道字符串保留以兼容已安装客户端） */
export const SHORTCUT_IPC_CHANNELS = {
  /** 重新注册全局快捷键（设置变更后） */
  REREGISTER_GLOBAL_SHORTCUTS: 'quick-task:reregister-global-shortcuts',
} as const

/** 菜单栏打开 Agent 会话事件 */
export interface TrayOpenAgentSessionData {
  /** Agent 会话 ID */
  sessionId: string
  /** 标签页标题 */
  title: string
}

/** 菜单栏创建会话事件 */
export interface TrayCreateSessionData {
  /** 目标模式 */
  mode: 'chat' | 'agent'
}

/** 菜单栏 IPC 事件通道 */
export const TRAY_IPC_CHANNELS = {
  /** 打开已有 Agent 会话 */
  OPEN_AGENT_SESSION: 'tray:open-agent-session',
  /** 创建新会话 */
  CREATE_SESSION: 'tray:create-session',
} as const

/** 存储管理 IPC 通道 */
export const STORAGE_IPC_CHANNELS = {
  /** 计算各目录存储统计 */
  GET_STATS: 'storage:get-stats',
  /** 按选项清理存储 */
  CLEANUP: 'storage:cleanup',
  /** 仅清理临时文件（启动时/快速清理） */
  CLEANUP_TEMP: 'storage:cleanup-temp',
  /** 预览历史会话整理：只统计可收敛的超限行与体积，不写入 */
  SESSION_COMPACTION_PREVIEW: 'storage:session-compaction-preview',
  /** 执行历史会话整理：就地收敛超限行，不删除任何会话 */
  SESSION_COMPACTION_APPLY: 'storage:session-compaction-apply',
  /** 按需取回被外部化的会话消息完整内容（用户点击时调用） */
  SESSION_RESOLVE_BLOBS: 'storage:session-resolve-blobs',
} as const
