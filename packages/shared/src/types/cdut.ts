/**
 * CDUT 专区特区账户与认证类型定义
 *
 * 说明：本模块仅描述「特区账户」的本地状态与 IPC 契约，不包含任何业务数据抓取逻辑。
 * 凭证仅加密保存密码字段（见 token-crypto.ts），不宣称嗅探或持有 Cookie。
 */

import type { BrowserViewBounds } from './browser'

export type CdutAccountStatus = 'disconnected' | 'connecting' | 'active' | 'expired'

export interface CdutAccountProfile {
  studentId: string
  studentName: string
  /** Base64 头像数据 URL（主进程读取后离线持久化） */
  avatar?: string
  /** 学院（如：地球物理学院） */
  college?: string
  /** 专业（如：勘查技术与工程） */
  major?: string
  /** 班级编号 */
  classCode?: string
  /** 身份角色（如：学生 / 教师） */
  role?: string
  status: CdutAccountStatus
  rememberPassword?: boolean
  lastLoginAt?: number
  lastActiveAt?: number
}

export interface CdutLoginInput {
  username: string
  password: string
  rememberPassword?: boolean
}

export interface CdutLoginResult {
  success: boolean
  error?: string
  profile?: CdutAccountProfile
}

/**
 * 本地已保存的特区账户摘要，专供登录窗「一键填充」引导消费。
 * 不含 Cookie，密码仅在用户勾选「记住密码」时返回解密后的明文。
 */
export interface CdutSavedAccountSummary {
  hasSaved: boolean
  studentId?: string
  studentName?: string
  avatar?: string
  rememberPassword?: boolean
  savedPassword?: string
}

// ===== 青果教务系统 8 大业务域专用 Tools 契约 =====

/** 8 大业务域标识（对应 31 个底层端点聚合） */
export type CdutToolDomain =
  | 'profile'
  | 'schedule'
  | 'grades'
  | 'exams'
  | 'classrooms'
  | 'curriculum'
  | 'selection'
  | 'notices'

/** Tool 1：学籍与个人档案 */
export interface CdutAcademicProfileParams {
  action:
    | 'get_profile'
    | 'get_contact_info'
    | 'query_status_changes'
    | 'query_major_split'
    | 'submit_major_preference'
    | 'query_minor_signup'
    | 'apply_minor'
  payload?: {
    /** 大类分流专业代号志愿排序（如 ["01", "03", "02"]） */
    volunteerOrder?: string[]
    /** 辅修专业代码 */
    minorMajorCode?: string
    /** 联系方式更新 */
    phoneNumber?: string
  }
}

/** Tool 2：课表与作息日程 */
export interface CdutScheduleParams {
  action: 'get_my_schedule' | 'query_other_schedule'
  /** 学期代码（如 "2025-2026-1"，留空默认当前学期） */
  semester?: string
  /** 指定周次（1-20，留空返回全周课表） */
  week?: number
  /** 查询目标班级：班级名称（如 "智能2班"）或班级代码（如 "2025191101"），支持模糊匹配 */
  className?: string
  /** 查询目标班级 ID（教务系统内部 xx04id，优先于 className） */
  classId?: string
  /** 标记本次查询周次即当前周：启用「正在上课 / 下节课程预告」实时雷达判定 */
  isCurrentWeek?: boolean
}

/** Tool 3：成绩与考核评定 */
export interface CdutGradesParams {
  action:
    | 'query_grades'
    | 'query_level_exams'
    | 'query_social_exam_replace'
    | 'apply_social_exam_replace'
    | 'query_grade_review'
    | 'apply_grade_review'
  semester?: string
  courseType?: string
  reviewPayload?: {
    /** 待查卷课程代码 */
    courseId: string
    /** 申请查卷理由 */
    reason: string
  }
}

/** Tool 4：考务安排与报名 */
export interface CdutExamAffairsParams {
  action:
    | 'query_exam_schedule'
    | 'query_makeup_exams'
    | 'signup_makeup_exam'
    | 'query_retake_courses'
    | 'signup_retake_course'
    | 'query_deferral_status'
    | 'apply_exam_deferral'
  semester?: string
  payload?: {
    courseCode?: string
    examType?: 'midterm' | 'final' | 'makeup'
    deferralReason?: string
    contactTel?: string
  }
}

/** Tool 5：教室资源与自习雷达 */
export interface CdutClassroomParams {
  action: 'query_empty_classrooms' | 'query_room_occupancy'
  /** 校区：成都校区 / 宜宾校区（成都理工大学法定两校区） */
  campus: 'chengdu' | 'yibin'
  building?: string
  week?: number
  dayOfWeek?: number
  timeSlots?: number[]
  minSeats?: number
}

/** Tool 6：培养方案与毕业学分 */
export interface CdutCurriculumPlanParams {
  action:
    | 'get_training_plan'
    | 'check_graduation_requirements'
    | 'query_degree_application'
    | 'apply_degree'
    | 'query_delay_graduation'
    | 'apply_delay_graduation'
  moduleName?: string
  payload?: {
    delayReason?: string
    expectedGraduationYear?: string
  }
}

/** Tool 7：选课中心与选课结果 */
export interface CdutCourseSelectionParams {
  action:
    | 'query_selection_rounds'
    | 'query_available_courses'
    | 'select_course'
    | 'drop_course'
    | 'query_selected_results'
  roundCode?: string
  courseFilter?: {
    keyword?: string
    courseCategory?: string
    onlyWithRemainingSeats?: boolean
  }
  operatePayload?: {
    /** 选/退课的教学班 ID */
    courseId: string
    /** 课程名称 */
    courseName: string
  }
}

/** Tool 8：教务通知、学业预警与系统服务 */
export interface CdutNoticesParams {
  action:
    | 'query_notices'
    | 'query_bulletins'
    | 'query_messages'
    | 'query_faq'
    | 'post_question'
    | 'query_documents'
    | 'query_academic_warnings'
    | 'get_password_policy'
    | 'change_password'
    | 'get_quick_identity'
  page?: number
  keyword?: string
  changePasswordPayload?: {
    oldPassword?: string
    newPassword?: string
  }
}

/** 8 大业务域入参联合映射 */
export interface CdutToolParamsMap {
  profile: CdutAcademicProfileParams
  schedule: CdutScheduleParams
  grades: CdutGradesParams
  exams: CdutExamAffairsParams
  classrooms: CdutClassroomParams
  curriculum: CdutCurriculumPlanParams
  selection: CdutCourseSelectionParams
  notices: CdutNoticesParams
}

/** 业务域调用统一返回（双模：精简 Markdown 表格 + 结构化 JSON） */
export interface CdutDomainToolResult {
  success: boolean
  /** 人类与模型高可读的 Markdown 视图 */
  markdown: string
  /** 结构化 JSON 关键字段 */
  json?: unknown
  error?: string
  /** 是否已由主进程实际执行写操作 */
  mutated?: boolean
  /** 是否为离线演示数据（无缝降级或离线模式标记） */
  isDemo?: boolean
}

/** 8 大业务域工具按需调用入参 */
export interface CdutToolInvokeParams<D extends CdutToolDomain = CdutToolDomain> {
  domain: D
  params: CdutToolParamsMap[D]
}

/** 写操作二次确认：主进程 -> 渲染端 */
export interface CdutMutationConfirmRequest {
  requestId: string
  /** 业务域 Tool 名称 */
  toolName: string
  /** 触发的 action 标识 */
  action: string
  /** 弹窗标题 */
  title: string
  /** 弹窗说明 */
  description: string
  /** 供展示的结构化参数 */
  payload?: unknown
}

/** 写操作二次确认：渲染端 -> 主进程结果 */
export interface CdutMutationConfirmResult {
  requestId: string
  confirmed: boolean
}

// ===== Tool 9：CDUT 逆向反代大模型接入 =====

/** CDUT 专区板块子页面标识；null 表示停留在专区首页 */
export type CdutSubViewId = 'ai-class' | 'yanhu-express' | 'material-review' | 'wqxt' | null

/** Tool 9：CDUT 逆向反代大模型调用入参（提问内容由发起 AI 自行构造） */
export interface CdutReverseProxyParams {
  /** 发起 AI 根据上下文自行生成的提问内容（必填） */
  queryPrompt: string
  /** 可选的任务上下文，供反代大模型理解背景 */
  taskContext?: string
  /** 可选的目标任务标识，用于路由到特定反代任务 */
  targetTask?: string
}

/** Tool 9 调用结果：复用双模返回结构 */
export type CdutReverseProxyResult = CdutDomainToolResult

// ===== 统一门禁拦截契约 =====

/** 统一门禁拦截通知（主进程 -> 渲染进程），触发专属门禁引导弹窗 */
export interface CdutGatekeeperNoticeEvent {
  requestId: string
  toolName: string
  toolLabel: string
}

/** 统一门禁用户决策响应（渲染进程 -> 主进程） */
export interface CdutGatekeeperDecision {
  requestId: string
  action: 'navigate_login' | 'decline'
}

// ===== AI 速课堂专属工作区与会话 IPC 契约 =====

/** 速课堂专属工作区 slug（物理隔离于 agent-workspaces 下） */
export const CDUT_AI_CLASS_WORKSPACE_SLUG = 'cdut-ai-class'

/** 速课堂专属工作区展示名（用于会话类型判定，兼容 slug 冲突场景） */
export const CDUT_AI_CLASS_WORKSPACE_NAME = 'AI速课堂'

export const CDUT_AI_CLASS_IPC_CHANNELS = {
  /** 列出速课堂历史课堂简报 */
  LIST_SESSIONS: 'cdut-ai-class:list-sessions',
  /** 新建速课堂会话（自动锁定内部导师预设） */
  CREATE_SESSION: 'cdut-ai-class:create-session',
  /** 删除速课堂会话 */
  DELETE_SESSION: 'cdut-ai-class:delete-session',
  /** 按用户选定模式生成跨资料知识关联并返回图谱数据（入参 StudyGraphGenerateInput） */
  GENERATE_GRAPH_RELATIONS: 'cdut-ai-class:generate-graph-relations',
  /** 图谱推演进度事件（主进程 -> 渲染进程，实时广播批次进度） */
  GENERATE_PROGRESS: 'cdut-ai-class:generate-progress',
  /** 动态测算当前会话三种生成模式的 Token 与费用预估 */
  ESTIMATE_GRAPH_COST: 'cdut-ai-class:estimate-graph-cost',
  /** 全域跨文档高精度混合检索（入参 StudySearchKnowledgeInput） */
  SEARCH_KNOWLEDGE: 'cdut-ai-class:search-knowledge',
  /** 新手引导：确保「演示课堂 · 红楼梦精读」会话与演示资料就绪（幂等） */
  ENSURE_DEMO_SESSION: 'cdut-ai-class:ensure-demo-session',
} as const

/** 图谱推演进度事件（主进程 -> 渲染进程，驱动资料树顶部进度胶囊） */
export interface StudyGraphProgressEvent {
  sessionId: string
  /** 已完成批次 */
  current: number
  /** 总批次 */
  total: number
  /** 完成百分比（0~100） */
  percent: number
  /** 当前阶段文案（如「正在推演分层知识网络」） */
  phase: string
}

/** 全域跨文档混合检索入参（AI 导师 study_search_knowledge 工具与渲染端共用） */
export interface StudySearchKnowledgeInput {
  sessionId: string
  /** 检索查询词或学生的具体提问 */
  query: string
  /** 可选：限定在某份特定文档中检索；不传则跨全域所有文档检索 */
  targetDocumentId?: string
  /** 返回最相关的切块数量（默认 5） */
  topK?: number
}

/** 单条全域检索结果（带来源文档名与章节定位） */
export interface StudySearchResultItem {
  documentId: string
  documentFileName: string
  sectionId: string
  sectionTitle: string
  score: number
  /** 经过显著性剪枝后的高密度事实摘要 */
  matchedExcerpt: string
  /** PDF 页码范围（非 PDF 可省略） */
  pageRange?: [number, number]
}

/** 全域跨文档混合检索结果 */
export interface StudySearchKnowledgeResult {
  success: boolean
  items: StudySearchResultItem[]
  error?: string
}

// ===== CDUT 专区 · 智联万站（Yanhu Express）轻量级定制浏览器 =====
//
// 说明：智联万站内嵌于 CDUT 专区，基于 Electron 原生 WebContentsView 驱动（零额外体积，
// 不打包任何额外 Chromium 二进制）。本模块只描述「智联万站」的状态与 IPC 契约，
// 底层 CDP 采集仅为二期 AI 自动化预留高可用信道，前端不暴露任何调试 UI。

/**
 * 智联万站默认入口：砚湖易办（校内办事大厅升级版，未指定工作区时冷启动直达）。
 */
export const YANHU_DEFAULT_HOME_URL = 'https://bsdt.cdut.edu.cn/EIP/onewebsitehande/toPersonalCenterPage.htm'

/**
 * AI 问渠学堂默认入口：成都理工大学在线课程中心（未指定工作区时冷启动直达）。
 */
export const WQXT_DEFAULT_HOME_URL = 'https://classroom.wqxt.cdut.edu.cn/'

/** AI 问渠学堂课堂域名（课堂教学页 / 课堂选择页共用） */
export const WQXT_CLASSROOM_HOSTNAME = 'classroom.wqxt.cdut.edu.cn'

/** AI 问渠学堂页面业务类型：课堂教学页 / 课堂选择页 / 其他页面 */
export type WqxtPageType = 'livingroom' | 'selection' | 'other'

/** 解析问渠课堂 URL；非该域名或非法 URL 返回 null */
function parseWqxtClassroomUrl(rawUrl: string): URL | null {
  if (!rawUrl || typeof rawUrl !== 'string') return null
  try {
    const parsed = new URL(rawUrl)
    return parsed.hostname.toLowerCase() === WQXT_CLASSROOM_HOSTNAME ? parsed : null
  } catch {
    return null
  }
}

/** 取查询串：优先 search，hash 路由携带的查询参数兜底 */
function resolveWqxtQuery(parsed: URL): string {
  if (parsed.search) return parsed.search
  const queryIndex = parsed.hash.indexOf('?')
  return queryIndex === -1 ? '' : parsed.hash.slice(queryIndex)
}

/**
 * 判定 URL 是否为问渠学堂「课堂教学页面」。
 *
 * 匹配形如：
 * - `https://classroom.wqxt.cdut.edu.cn/livingroom?course_id=123_id=456`
 * - `https://classroom.wqxt.cdut.edu.cn/livingroom?course_id=123&sub_id=456&...`
 * - `https://classroom.wqxt.cdut.edu.cn/#/livingroom?course_id=123`（hash 路由）
 */
export function isWqxtLivingRoomUrl(rawUrl: string): boolean {
  const parsed = parseWqxtClassroomUrl(rawUrl)
  if (!parsed) return false
  const normalizedPath = parsed.pathname.replace(/\/+$/, '')
  const isLivingRoomPath =
    normalizedPath === '/livingroom' || /^#\/?livingroom(?:[/?]|$)/i.test(parsed.hash)
  if (!isLivingRoomPath) return false
  return /[?&]course_id=\d+/i.test(resolveWqxtQuery(parsed))
}

/**
 * 判定 URL 是否为问渠学堂「课堂选择页面」（`https://classroom.wqxt.cdut.edu.cn` 根页面）。
 */
export function isWqxtSelectionUrl(rawUrl: string): boolean {
  const parsed = parseWqxtClassroomUrl(rawUrl)
  if (!parsed) return false
  if (isWqxtLivingRoomUrl(rawUrl)) return false
  const normalizedPath = parsed.pathname.replace(/\/+$/, '')
  if (normalizedPath !== '' && normalizedPath !== '/index.html') return false
  const normalizedHash = parsed.hash.replace(/^#\/?/, '').replace(/\/+$/, '')
  return normalizedHash === '' || normalizedHash.toLowerCase() === 'index'
}

/** 解析问渠学堂当前页面业务类型 */
export function resolveWqxtPageType(rawUrl: string): WqxtPageType {
  if (isWqxtLivingRoomUrl(rawUrl)) return 'livingroom'
  if (isWqxtSelectionUrl(rawUrl)) return 'selection'
  return 'other'
}

/**
 * 内置浏览器作用域：两套互相隔离的标签拓扑与落盘文件，共享同一 CDUT 认证分区。
 */
export type YanhuBrowserScope = 'yanhu-express' | 'wqxt'

/** 作用域入参（IPC 与渲染层共用；缺省表示保持当前激活作用域） */
export interface YanhuScopeInput {
  scope?: YanhuBrowserScope
}

/**
 * 智联万站高频校内书签（导航栏快捷胶囊，顺序即展示顺序）。
 */
export interface YanhuBookmark {
  id: string
  label: string
  url: string
}

export const YANHU_BOOKMARKS: readonly YanhuBookmark[] = [
  { id: 'bsdt', label: '砚湖易办', url: 'https://bsdt.cdut.edu.cn/EIP/onewebsitehande/toPersonalCenterPage.htm' },
  { id: 'jw', label: '教务系统', url: 'https://jw.cdut.edu.cn/jsxsd/framework/xsMainV.htmlx' },
  { id: 'library', label: '问渠学堂', url: 'https://classroom.wqxt.cdut.edu.cn/' },
  { id: 'gra', label: '学工系统', url: 'https://xgfw.cdut.edu.cn/xsfw/sys/xggzptapp/*default/index.do?min=1#/gzzm' },
] as const

/** 内置拦截页哨兵协议前缀；标签 url 命中该前缀时，渲染层改渲染 YanhuBlockedPage 卡片 */
export const YANHU_BLOCKED_URL_PREFIX = 'yanhu://blocked'

/** 构造内置拦截页哨兵 URL（携带被拦截的原始外链目标） */
export function buildYanhuBlockedUrl(targetUrl: string): string {
  return `${YANHU_BLOCKED_URL_PREFIX}?target=${encodeURIComponent(targetUrl)}`
}

/** 判定标签 url 是否为内置拦截页哨兵 */
export function isYanhuBlockedUrl(rawUrl: string): boolean {
  return typeof rawUrl === 'string' && rawUrl.startsWith(YANHU_BLOCKED_URL_PREFIX)
}

/** 从内置拦截页哨兵 URL 中解析被拦截的原始外链目标；解析失败返回 null */
export function parseYanhuBlockedTarget(rawUrl: string): string | null {
  if (!isYanhuBlockedUrl(rawUrl)) return null
  const queryIndex = rawUrl.indexOf('?')
  if (queryIndex === -1) return null
  try {
    const target = new URLSearchParams(rawUrl.slice(queryIndex + 1)).get('target')
    return target || null
  } catch {
    return null
  }
}


/** 智联万站主框架加载失败信息（成功或加载中为 null） */
export interface YanhuTabError {
  /** Chromium 网络错误码（如 -105 ERR_NAME_NOT_RESOLVED） */
  errorCode: number
  /** 可读错误描述（如 ERR_CONNECTION_TIMED_OUT） */
  errorDescription: string
  /** 触发失败的原始 URL */
  failedUrl: string
}

/**
 * 智联万站单标签元数据（拓扑持久化与 UI 渲染共用）。
 *
 * `isDormant` 为真时表示该标签仅保留元数据、底层 WebContentsView 尚未实例化；
 * 用户点击激活时才惰性唤醒加载，避免重启时的 WAF 风暴与突发卡顿。
 */
export interface YanhuTabItem {
  id: string
  title: string
  url: string
  /** 页面图标（favicon URL 或 data URL）；空串表示尚未获取 */
  favicon?: string
  createdAt: number
  lastActiveAt: number
  zoomFactor: number
  isDormant: boolean
  /** 当前是否正在加载（仅运行时态，落盘时可忽略） */
  loading?: boolean
  canGoBack?: boolean
  canGoForward?: boolean
  /** 主框架加载失败信息（成功或加载中为 null） */
  error?: YanhuTabError | null
}

/** 智联万站标签拓扑状态（主进程为唯一数据源，向渲染端广播） */
export interface YanhuTabsState {
  tabs: YanhuTabItem[]
  activeTabId: string
}

/** 智联万站原生视图布局（renderer 测得，主进程应用） */
export interface YanhuViewLayout {
  /** 当前 renderer 实例标识；刷新后旧实例晚到的布局必须全部丢弃 */
  rendererInstanceId: string
  /** 当前视口挂载来源序号；顶栏切换后旧视口的 cleanup 不能覆盖新视口 */
  layoutSourceRevision: number
  /** 同一布局来源内单调递增的布局代际；主进程忽略晚到的旧布局 IPC */
  revision: number
  visible: boolean
  /** 唯一由 renderer 测得并由主进程应用的原生视口（CSS 像素） */
  viewportBounds: BrowserViewBounds
  /** 网页在原生视口内的局部矩形（顶部为标签栏 + 导航栏，由 renderer DOM 承担） */
  pageBounds: BrowserViewBounds
}

/** 新建标签入参 */
export interface YanhuCreateTabInput {
  url?: string
  /** 是否立即激活（默认 true） */
  activate?: boolean
}

/** 单标签引用入参 */
export interface YanhuTabRefInput {
  tabId: string
}

/** 导航入参（未指定 tabId 时作用于当前激活标签） */
export interface YanhuNavigateInput {
  tabId?: string
  url: string
}

/** 标签顺序重排入参（给出期望的完整顺序） */
export interface YanhuReorderTabsInput {
  orderedTabIds: string[]
}

/** 关闭右侧标签入参（基准标签，含该标签右侧全部关闭） */
export interface YanhuCloseRightInput {
  tabId: string
}

/** 主题同步入参（主进程 -> 底层视图 + 网页媒体仿真） */
export interface YanhuSyncThemeInput {
  isDark: boolean
}

// ===== 底层静默 CDP 数据契约（为二期 AI 自动化预留） =====

/** 网络链路嗅探条目 */
export interface YanhuNetworkEntry {
  requestId: string
  url: string
  method: string
  status?: number
  requestHeaders: Record<string, string>
  responseHeaders?: Record<string, string>
  mimeType?: string
  timing?: { start: number; end?: number; durationMs?: number }
  postData?: string
}

/** 控制台日志条目 */
export interface YanhuConsoleEntry {
  type: 'log' | 'warn' | 'error' | 'info' | 'debug'
  text: string
  timestamp: number
  stackTrace?: string
}

/** 已加载资源清单条目（Sources 能力） */
export interface YanhuLoadedResource {
  url: string
  type: string
}

/** CDP 能力统一返回结构（IPC 可安全序列化） */
export interface YanhuCdpResult<T> {
  success: boolean
  data?: T
  error?: string
}

/** CDP 能力调用入参（按需携带 tabId / 过滤正则 / 脚本表达式 / DOM 深度） */
export interface YanhuCdpInput {
  /** 目标标签（缺省作用于当前激活标签） */
  tabId?: string
  /** 网络日志 URL 过滤正则（可选） */
  filterRegex?: string
  /** 在隔离环境中求值的脚本表达式（可选） */
  expression?: string
  /** DOM 树展开深度（可选，缺省使用默认深度） */
  depth?: number
}

/**
 * 工业级 CDP 环形数据总线接口（主进程实现，前端不暴露入口）。
 * 完整接口签名见规格书 4.5 节。
 */
export interface YanhuDevToolsHubContract {
  getDomTree(tabId: string, depth?: number): Promise<unknown>
  getPageSource(tabId: string): Promise<string>
  getLoadedResources(tabId: string): Promise<YanhuLoadedResource[]>
  getNetworkLogs(tabId: string, filterRegex?: string): YanhuNetworkEntry[]
  getConsoleLogs(tabId: string): YanhuConsoleEntry[]
  executeScript(tabId: string, expression: string): Promise<unknown>
}

// ===== 智联万站 · 桌宠「砚小龙」与无视感知（Vision-Less）契约 =====
//
// 说明：桌宠「砚小龙」为智联万站内嵌浏览器专属的 AI 伴侣与自动化操作精灵。
// 其运行时为完全独立的“阉割版” Pi 运行时（Chat + Memory + ToolCalling），
// 通过无视感知（Vision-Less）DOM 蒸馏与双射动态 ID（BIDs）实现确定性意图落地，
// 不挂载任何文件系统、外部终端与子会话委派特权。

/** 桌宠四态精灵动画状态 */
export type YanhuPetSpriteState = 'blinking' | 'breathing' | 'walking' | 'yawning'

/** 桌宠持久化配置 */
export interface YanhuPetConfig {
  /** 对话框相对桌宠的排布朝向 */
  dialogPosition: 'left' | 'right'
  /** 对话框是否折叠（仅显示桌宠立绘） */
  isCollapsed: boolean
  /** 上下文记忆保留条数（0 - 1000） */
  memoryLimit: number
  /** 桌宠相对视口左上角的坐标（DIP） */
  petPosition: { x: number; y: number }
  /** 智联万站专属渠道 ID（未配置时回落到全局默认激活渠道） */
  selectedChannelId?: string
  /** 智联万站专属模型 ID */
  selectedModelId?: string
  /** 是否向大模型暴露开发者级工具（默认关闭，经隐藏指令切换并持久化） */
  devToolsEnabled?: boolean
  /**
   * 是否启用视觉截图辅助感知（Screenshot Recognition，默认关闭）。
   *
   * 开启后在页面信息不足（纯 Canvas / 图形验证码 / DOM 蒸馏稀疏 / 大量 [Occluded]）时，
   * 允许「砚小龙」触发视口截图，交由支持多模态图像输入的模型渠道进行视觉认知，
   * 并经双平面平行坐标锚定引擎将视觉坐标映射回真实 DOM DIP 坐标后精确落地。
   */
  enableVision?: boolean
}

/** 桌宠工具调用（微胶囊标签消费） */
export interface YanhuPetToolInvocation {
  id: string
  toolName: string
  /** 形如「⚡ 正在读取页面」「👆 点击 [3] 成绩查询」的胶囊标签 */
  label: string
  args: Record<string, unknown>
  result?: unknown
  status: 'running' | 'success' | 'error'
}

/** 桌宠单轮对话用量统计（耗时与 Token 明细，与主视图用量语义对齐） */
export interface YanhuPetMessageUsage {
  /** 输入 Token（含系统提示词、历史与工具结果） */
  inputTokens?: number
  /** 输出 Token（正文与思考） */
  outputTokens?: number
  /** 缓存读取 Token */
  cacheReadTokens?: number
  /** 缓存写入 Token */
  cacheCreationTokens?: number
  /** 总 Token */
  totalTokens?: number
  /** 本轮总耗时（毫秒） */
  durationMs?: number
}

/** 桌宠单条会话消息 */
export interface YanhuPetMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: number
  toolInvocations?: YanhuPetToolInvocation[]
  /** 本轮对话用量（仅助手消息携带） */
  usage?: YanhuPetMessageUsage
}

/** 桌宠对话发起入参 */
export interface YanhuPetChatInput {
  /** 用户提问正文 */
  text: string
  /** 目标标签；缺省作用于当前激活标签 */
  tabId?: string
}

/** 桌宠流式事件（主进程 -> 渲染端） */
export interface YanhuPetStreamEvent {
  /** 同一次对话请求的关联 ID */
  requestId: string
  type: 'delta' | 'reasoning' | 'tool-start' | 'tool-end' | 'done' | 'error'
  /** 正文增量（type = delta） */
  delta?: string
  /** 思考链增量（type = reasoning） */
  reasoning?: string
  /** 工具调用快照（type = tool-start / tool-end） */
  tool?: YanhuPetToolInvocation
  /** 本轮用量统计（type = done） */
  usage?: YanhuPetMessageUsage
  /** 错误说明（type = error） */
  error?: string
}

/** 桌宠窗口就绪状态与对话运行态（新手引导轮询） */
export interface YanhuPetChatStatus {
  /** 桌宠子窗口已创建且完成首次加载 */
  ready: boolean
  /** 当前是否有一轮桌宠对话在运行 */
  running: boolean
  lastStartedAt: number | null
  lastDoneAt: number | null
  lastError: string | null
}

/** 新手引导：主进程 -> 桌宠子窗口，写入输入框 */
export interface YanhuPetTourFillEvent {
  text: string
}

/** 桌宠视口矩形（相对主窗口内容区左上角，CSS 像素） */
export interface YanhuPetViewport {
  x: number
  y: number
  width: number
  height: number
}

/** 桌宠紧凑包裹窗口几何（DIP，相对于智联万站视口左上角） */
export interface YanhuPetWindowGeometry {
  /** 窗口左上角在视口坐标系中的位置 */
  x: number
  y: number
  /** 紧凑包裹矩形尺寸 */
  width: number
  height: number
}

/** 桌宠启动引导数据（主进程 -> 桌宠子窗口） */
export interface YanhuPetBootstrap {
  config: YanhuPetConfig
  history: YanhuPetMessage[]
  /** 智联万站视口尺寸（DIP）；视口未知时为 null */
  viewport: { width: number; height: number } | null
  presented: boolean
}

/** 桌宠状态广播（主进程 -> 桌宠子窗口）：视口尺寸 / 呈现态 / 最新配置 */
export interface YanhuPetStateEvent {
  /** 智联万站视口尺寸（DIP）；视口未知时为 null */
  viewport: { width: number; height: number } | null
  presented: boolean
  /**
   * 配置修订号：仅在显式 `saveConfig` 时递增。
   * 渲染层据此判定“是否需要应用配置”，避免视口高频广播反复回写本地朝向（压过自适应翻转）。
   */
  configRevision: number
  /** 最新配置（渲染层仅消费影响 UI 的字段，如 isCollapsed / dialogPosition / memoryLimit） */
  config: YanhuPetConfig
}

/** 无视感知：单个可交互节点的 BID 标定记录 */
export interface YanhuBidNode {
  bid: number
  role: string
  name: string
  tag: string
  value?: string
  description?: string
  bounds: { x: number; y: number; width: number; height: number }
  /** 中心点被上层浮层遮挡 */
  isOccluded?: boolean
  /** 处于折叠 / 后台隐藏容器内（display:none / 零高宽 / 未激活 tab-pane 等），需先解封再操作 */
  collapsed?: boolean
  /** 所属高层语义区域（Region4Web 风格分块） */
  parentRegion?: string
  /** 框架路径（嵌套 frame/iframe 标识，如 leftFrame, mainFrame） */
  framePath?: string
  /** 下拉框选项快照 */
  options?: Array<{ value: string; text: string; selected: boolean }>
}

/** 无视感知：四级蒸馏后的极简页面摘要 */
export interface YanhuDistilledPage {
  url: string
  title: string
  /** 投递给大模型的紧凑文本（Region 分块 + BID 标定） */
  digestText: string
  /** 标定的 BID 总量 */
  bidCount: number
  nodes: YanhuBidNode[]
  /** 深层 iframe 穿透直提的结构化数据表格（Markdown），纳入多要素指纹与增量判定 */
  dataTables?: string[]
  /**
   * 全框架可见渲染文本的归一化哈希。
   *
   * 关键：URL 与网页框架常常**都不变**，只有被渲染出来的内容变了；若仅对可交互节点取指纹，
   * 这类「纯内容变化」会被误判为「页面无变化」。故把渲染文本摘要一并纳入指纹。
   */
  textDigest?: string
  /** 渲染文本摘要（有界截断），随 PageDigest 投递给模型，让内容变化「看得见」 */
  textSample?: string
  /**
   * 未被渲染的可交互元素统计（折叠菜单 / 隐藏面板 / 未激活标签页等）。
   *
   * 这些元素**不分配 BID**（未渲染的控件点击必被网页驳回），仅在摘要末尾汇总提示，
   * 引导模型先点击可见入口展开后再读取。
   */
  unrendered?: { count: number; regions: string[] }
  timestamp: number
}

/** 智联万站 IPC 通道契约 */
export const YANHU_EXPRESS_IPC_CHANNELS = {
  // 视图与生命周期管理
  INIT_OR_RESTORE: 'yanhu:init-or-restore',
  UPDATE_BOUNDS: 'yanhu:update-bounds',
  HIDE_VIEW: 'yanhu:hide-view',
  SHOW_VIEW: 'yanhu:show-view',
  SYNC_THEME: 'yanhu:sync-theme',

  // 标签页操作
  GET_TABS_STATE: 'yanhu:get-tabs-state',
  CREATE_TAB: 'yanhu:create-tab',
  ACTIVATE_TAB: 'yanhu:activate-tab',
  CLOSE_TAB: 'yanhu:close-tab',
  CLOSE_OTHER_TABS: 'yanhu:close-other-tabs',
  CLOSE_RIGHT_TABS: 'yanhu:close-right-tabs',
  REORDER_TABS: 'yanhu:reorder-tabs',

  // 导航与页面交互
  NAVIGATE: 'yanhu:navigate',
  GO_BACK: 'yanhu:go-back',
  GO_FORWARD: 'yanhu:go-forward',
  RELOAD: 'yanhu:reload',
  OPEN_EXTERNAL: 'yanhu:open-external',
  /** 一键自愈重试：净化陈旧动态签名后重载当前标签 */
  RETRY_WITH_CLEAN: 'yanhu:retry-with-clean',
  /** 弹出标签栏原生上下文菜单（主进程 Menu.popup，天然悬浮于网页视图之上） */
  SHOW_TAB_MENU: 'yanhu:show-tab-menu',

  // 状态广播（主进程 -> 渲染端）
  ON_TABS_CHANGED: 'yanhu:on-tabs-changed',
  ON_LOADING_CHANGED: 'yanhu:on-loading-changed',
  ON_URL_CHANGED: 'yanhu:on-url-changed',

  // 底层静默 CDP 能力标准接口（为二期 AI 预留）
  CDP_GET_DOM: 'yanhu:cdp-get-dom',
  CDP_GET_SOURCE: 'yanhu:cdp-get-source',
  CDP_GET_NETWORK_LOGS: 'yanhu:cdp-get-network-logs',
  CDP_GET_CONSOLE_LOGS: 'yanhu:cdp-get-console-logs',
  CDP_EXECUTE_SCRIPT: 'yanhu:cdp-execute-script',

  // 桌宠「砚小龙」：视口同步、窗口几何、对话与记忆、特权诊断控制台
  /** 主渲染窗口 -> 主进程：同步智联万站视口矩形（CSS 像素） */
  PET_SYNC_VIEWPORT: 'yanhu-express:pet-sync-viewport',
  /** 桌宠子窗口 -> 主进程：上报紧凑包裹窗口几何（DIP） */
  PET_UPDATE_GEOMETRY: 'yanhu-express:pet-update-geometry',
  /** 主进程 -> 桌宠子窗口：视口尺寸 / 呈现态 / 配置变更广播 */
  PET_STATE_CHANGED: 'yanhu-express:pet-state-changed',
  /** 桌宠子窗口 -> 主进程：拉取启动引导数据（配置 + 历史 + 视口） */
  PET_GET_BOOTSTRAP: 'yanhu-express:pet-get-bootstrap',
  PET_CHAT_SEND: 'yanhu-express:pet-chat-send',
  PET_CHAT_ABORT: 'yanhu-express:pet-chat-abort',
  /** 主进程 -> 桌宠子窗口：流式事件广播 */
  PET_CHAT_STREAM_CHUNK: 'yanhu-express:pet-chat-stream-chunk',
  PET_GET_CONFIG: 'yanhu-express:pet-get-config',
  PET_SAVE_CONFIG: 'yanhu-express:pet-save-config',
  PET_GET_HISTORY: 'yanhu-express:pet-get-history',
  PET_CLEAR_HISTORY: 'yanhu-express:pet-clear-history',
  /** 主进程 -> 桌宠子窗口：记忆已被清空（原生菜单触发时同步 UI） */
  PET_HISTORY_CLEARED: 'yanhu-express:pet-history-cleared',
  /** 新手引导：主进程 -> 桌宠子窗口，自动填入输入框（不代发送） */
  PET_TOUR_FILL: 'yanhu-express:pet-tour-fill',
  /** 新手引导：查询桌宠窗口就绪与对话运行态 */
  PET_GET_CHAT_STATUS: 'yanhu-express:pet-get-chat-status',
  /** 新手引导：前置桌宠窗口并展开伴随卡片 */
  PET_TOUR_PRESENT: 'yanhu-express:pet-tour-present',
  /** 新手引导：结束桌宠保活（恢复常规显隐裁决） */
  PET_TOUR_RELEASE: 'yanhu-express:pet-tour-release',
  /** 桌宠透明区域鼠标穿透：避免遮挡底层网页交互 */
  PET_SET_IGNORE_MOUSE: 'yanhu-express:pet-set-ignore-mouse',
  /** 桌宠原生上下文菜单（主进程 Menu.popup，彻底根除紧凑子窗口边界裁切） */
  PET_SHOW_CONTEXT_MENU: 'yanhu-express:pet-show-context-menu',
  /** 特权指令：唤起实时底层诊断控制台（零 Token 消耗） */
  OPEN_DIAGNOSTIC_CONSOLE: 'yanhu-express:open-diagnostic-console',
} as const

/** 主进程 -> 渲染端：标签加载态变化事件 */
export interface YanhuLoadingChangedEvent {
  tabId: string
  loading: boolean
}

/** 主进程 -> 渲染端：标签 URL / 标题 / 导航能力变化事件 */
export interface YanhuUrlChangedEvent {
  tabId: string
  url: string
  title: string
  canGoBack: boolean
  canGoForward: boolean
}

export const CDUT_ZONE_IPC_CHANNELS = {
  GET_ACCOUNT: 'cdut-zone:get-account',
  /** 查询本地已保存的特区账户元数据（供登录窗一键填充引导） */
  GET_SAVED_ACCOUNT: 'cdut-zone:get-saved-account',
  LOGIN: 'cdut-zone:login',
  LOGOUT: 'cdut-zone:logout',
  STATUS_CHANGED: 'cdut-zone:status-changed',
  /** 渲染端（或调试入口）调用 8 大业务域 Tool */
  CALL_DOMAIN_TOOL: 'cdut-zone:call-domain-tool',
  /** 渲染端回传写操作二次确认结果 */
  CONFIRM_MUTATION: 'cdut-zone:confirm-mutation',
  /** 主进程派发写操作确认请求 */
  ON_MUTATION_REQUEST: 'cdut-zone:on-mutation-request',
  /** 主进程派发统一门禁拦截通知（拉起专属门禁弹窗） */
  GATEKEEPER_BLOCKED: 'cdut-zone:gatekeeper-blocked',
  /** 渲染端回传统一门禁用户决策 */
  GATEKEEPER_RESPOND: 'cdut-zone:gatekeeper-respond',
  /** 读取业务域离线缓存（SWR 秒开渲染：schedule / grades） */
  READ_DOMAIN_CACHE: 'cdut-zone:read-domain-cache',
  /** 写入业务域离线缓存（网络成功后原子落盘） */
  WRITE_DOMAIN_CACHE: 'cdut-zone:write-domain-cache',
} as const

/** 业务域离线缓存文件标识 */
export type CdutDomainCacheName = 'schedule' | 'grades'
