/**
 * AI 速课堂（Autonomous Study Module）共享契约
 *
 * 本模块定义 CDUT 专区「AI速课堂」板块的资料大纲、章节分块与学生认知档案结构。
 * 设计要点：
 *   - 全类型文档解析后只把「轻量级大纲向导」注入模型上下文，完整原文分块缓存到本地；
 *   - 模型按需调用 `study_inspect_section` 工具查阅指定 sectionId 的原文，防止上下文爆炸；
 *   - 学生认知档案以 Markdown 形式持久化，分立「已掌握 / 待学未知 / 薄弱混淆」三维清单。
 */

/** 支持解析的学习资料类型 */
export type StudyDocumentType =
  | 'pdf'
  | 'pptx'
  | 'docx'
  | 'xlsx'
  | 'image'
  | 'text'
  | 'markdown'

/** 文档中抽取出的单个章节分块（对应大纲树的一个节点） */
export interface StudyDocumentSection {
  /** 稳定分块标识，模型查阅原文时使用 */
  sectionId: string
  /** 所属文档标识 */
  documentId: string
  title: string
  /** 层级：1 为顶层章节，数值越大越靠内 */
  level: number
  /** PDF 页码范围（含端点）；非 PDF 可省略 */
  pageRange?: [number, number]
  /** PPT 幻灯片序号（从 1 开始）；非 PPT 可省略 */
  slideIndex?: number
  /** Excel 工作表名称；非 Excel 可省略 */
  sheetName?: string
  /** 核心知识点摘要（注入大纲，通常 1-2 句） */
  summary: string
  /** 原文片段预览（用于大纲导航展示，非完整原文） */
  contentSnippet: string
  /** 该分块完整原文字符数 */
  charCount: number
}

/** 单份学习资料的结构化大纲 */
export interface StudyDocumentOutline {
  documentId: string
  fileName: string
  /** 资料原始绝对路径（本地引用） */
  sourcePath: string
  fileType: StudyDocumentType
  totalSections: number
  totalChars: number
  sections: StudyDocumentSection[]
  /** 供模型直接消费的轻量级大纲导航 Markdown（通常小于 800 字） */
  navigationMarkdown: string
  createdAt: number
  /**
   * 该资料是否处于「已激活」状态（默认 true）。
   * 未激活的资料静默排除在 RAG 检索切块与提示词大纲注入之外，仅在 UI 中淡化展示。
   */
  enabled?: boolean
}

/** 学生认知记忆档案：三维概念清单 */
export interface StudentCognitionProfile {
  /** 学科 / 课程主题 */
  subject: string
  /** 目标（如：期末考 90 分） */
  targetGoal?: string
  /** 考试日期（ISO 或自然语言） */
  examDate?: string
  /** 已掌握概念 */
  masteredConcepts: string[]
  /** 待学未知概念（先验守卫铁律：严禁用此清单术语解释新概念） */
  unlearnedConcepts: string[]
  /** 薄弱 / 易混淆概念 */
  fragileConcepts: string[]
  /** 最近更新时间戳 */
  lastUpdated: number
}

/** 模型查阅分块原文的入参（study_inspect_section） */
export interface StudyInspectSectionParams {
  documentId: string
  sectionId: string
  /** 可选查阅焦点，帮助主进程优先返回相关片段 */
  queryFocus?: string
}

/** 模型查阅分块原文的返回结构 */
export interface StudyInspectSectionResult {
  success: boolean
  documentId: string
  sectionId: string
  title: string
  pageRange?: [number, number]
  slideIndex?: number
  sheetName?: string
  /** 该分块完整原文 */
  content: string
  /** 查阅到的字符数 */
  charCount: number
  error?: string
}

// ===== 学习资料准入限制 =====

/**
 * 单个 AI 速课堂会话允许上传的资料文件数。
 * 现已全量解除上限（无限资料导入），保留常数以免破坏既有调用方。
 */
export const MAX_STUDY_DOCUMENTS_PER_SESSION = Number.POSITIVE_INFINITY
/**
 * 单个学习资料文件体积上限（字节）。
 * 现已全量解除大小限制，保留常数以免破坏既有调用方。
 */
export const MAX_STUDY_DOCUMENT_SIZE_BYTES = Number.POSITIVE_INFINITY
/** 速课堂资料白名单扩展名（非白名单直接拒绝，纯文本 / 图片本地纯化） */
export const ALLOWED_STUDY_EXTENSIONS = [
  '.ppt', '.pptx', '.ppsx', '.potx',
  '.pdf',
  '.doc', '.docx',
  '.xls', '.xlsx', '.xlsm',
  '.md', '.markdown',
  '.html', '.htm',
  '.txt',
  '.png', '.jpg', '.jpeg', '.webp', '.bmp',
] as const

// ===== 资料树知识图谱生成模式与成本估算 =====

/** 图谱生成模式：本地极速 / 云端智能精炼 / 云端全量深度 */
export type KnowledgeGraphGenerationMode = 'local_fast' | 'ai_smart' | 'ai_full'

/** 单档方案的 Token 与费用估算 */
export interface StudyGraphCostTier {
  tokens: number
  costCny: number
  estimatedSeconds: number
}

/** 资料树图谱生成的动态成本估算（面向弹窗看板展示） */
export interface StudyGraphCostEstimate {
  totalDocuments: number
  totalChars: number
  totalChunks: number
  smart: StudyGraphCostTier
  full: StudyGraphCostTier
}

// ===== 渲染进程 <-> 主进程 IPC 契约 =====

/** 导入学习资料入参（渲染端把拖拽/选择的文件绝对路径交给主进程解析） */
export interface StudyIngestDocumentsInput {
  sessionId: string
  filePaths: string[]
}

/** 资料树图谱生成入参（用户在前端弹窗确认后主动触发） */
export interface StudyGraphGenerateInput {
  sessionId: string
  mode: KnowledgeGraphGenerationMode
}

/** 查询 / 移除学习资料的入参 */
export interface StudyDocumentQueryInput {
  sessionId: string
  documentId: string
}

/** 切换单份资料激活状态的入参（勾选框即时落盘） */
export interface StudyToggleDocumentActiveInput {
  sessionId: string
  documentId: string
  enabled: boolean
}

/** 批量设置资料激活状态的入参（全选 / 全不选） */
export interface StudySetDocumentsActiveInput {
  sessionId: string
  documentIds: string[]
  enabled: boolean
}

export const STUDY_IPC_CHANNELS = {
  /** 导入并解析学习资料，返回结构化大纲 */
  INGEST_DOCUMENTS: 'study:ingest-documents',
  /** 列出当前会话已索引的学习资料大纲 */
  LIST_DOCUMENTS: 'study:list-documents',
  /** 读取单份资料完整大纲 */
  GET_OUTLINE: 'study:get-outline',
  /** 移除单份资料索引 */
  REMOVE_DOCUMENT: 'study:remove-document',
  /** 切换单份资料的激活（勾选）状态并落盘 */
  TOGGLE_DOCUMENT_ACTIVE: 'study:toggle-document-active',
  /** 批量设置资料激活状态并落盘 */
  SET_DOCUMENTS_ACTIVE: 'study:set-documents-active',
} as const

// ===== 资料树（跨资料知识图谱）契约 =====

/** 资料树跨资料语义关联类型 */
export type KnowledgeRelationType = 'prerequisite' | 'exercise' | 'extension' | 'reference'

/** 资料树关联边定义（连接两份资料的两个章节节点） */
export interface KnowledgeGraphEdge {
  edgeId: string
  sourceDocId: string
  sourceSectionId: string
  targetDocId: string
  targetSectionId: string
  relationType: KnowledgeRelationType
  /** 边上的微标签（如「前置」「题型」「延伸」） */
  label: string
  description?: string
}

/** 跨资料现代节点图谱完整数据 */
export interface KnowledgeGraphData {
  documents: StudyDocumentOutline[]
  edges: KnowledgeGraphEdge[]
  updatedAt: number
}

/** AI 速课堂历史课堂简报（会话选择弹窗消费） */
export interface AiClassSessionSummary {
  sessionId: string
  courseName: string
  createdAt: number
  lastActiveAt: number
  documentCount: number
  lastTopicSnippet?: string
}
