/**
 * AI 审核服务（D6 双路径：真实模型 → 演示降级）
 *
 * 四个能力，全部先尝试真实路径（统一网关白名单出口），任何一步失败或无可用渠道时
 * 降级到确定性/静态路径，并显式标注来源：
 *
 * 1. `generateRuleOutline`：真实 → AI 从规则文档提取大纲；降级 → fixture 规则大纲（generatedBy 'fixture'）
 * 2. `extractItems`：真实 → AI 从申报表识别条目；降级 → case.items 原样返回
 * 3. `runAiReview`：AI 产出 findings；仅内置演示案卷允许回退 mock 引擎。
 * 4. `reviewAssistantChat`：真实 → 模型回答（引用材料 ID）；降级 → 静态解答 + degraded:true
 *
 * 降级是显式可观察的：每处降级都 console.warn('[审核专区] ...降级: ...')，
 * 返回值的 generatedBy / degraded 字段让 UI 与报告能标注"模拟结果"。
 *
 * 不依赖 Electron（纯 Node + FS + 网关），可在 bun test 下直接跑。
 */

import type {
  AssistantChatRequest,
  EvidenceDocument,
  FindingKind,
  FindingSeverity,
  FindingSuggestion,
  GenerateRuleOutlineRequest,
  ReviewCase,
  ReviewContentPart,
  ReviewDomainPack,
  ReviewFinding,
  ReviewItem,
  ReviewRun,
  ReviewSourceAnchor,
  RuleOutlineItem,
  SourceDocument,
} from '@profer/shared'
import {
  FALLBACK_FINDING_KIND,
  findingKindSeverity,
  isKnownFindingKind,
  isKnownDomainPack,
  resolveDomainPack,
} from '@profer/shared'
import { readFileSync, statSync } from 'node:fs'
import { isAbsolute, join } from 'node:path'
import { getCase, getReviewCasesDir, listRuns, saveCase, updateCase } from './case-store'
import { buildDemoCase } from './demo-fixtures/demo-case-fixture'
import { runMockReview } from './mock-review-engine'
import {
  REVIEW_RUN_TIMEOUT_MS,
  chatCompletion,
  chatCompletionWithMeta,
  extractJson,
  resolveReviewGatewayChannel,
  type ReviewChatMessage,
} from './review-model-gateway'

/** AI 审核引擎产物（与 runMockReview 同形，id/时间/状态由 run-service 补齐） */
export type AiReviewOutcome = Omit<
  ReviewRun,
  'id' | 'startedAt' | 'completedAt' | 'status' | 'inputVersion'
>

/** 单次模型调用最大 token（demo 场景足够，且防止无界生成） */
const MAX_TOKENS = 4096

/** 助手上下文注入的最大条目数（防 prompt 过长） */
const ASSISTANT_CONTEXT_LIMIT = 12

/** 单次送模型的图片数量上限（防止一份案卷几十张图撑爆请求体） */
const MAX_VISION_IMAGES = 8

/** 单张图片送模型的大小上限（8MB：超过则跳过并记录原因，避免请求体过大被网关拒绝） */
const MAX_VISION_IMAGE_BYTES = 8 * 1024 * 1024

// ===== 内部工具 =====

/** 从案卷取规则包（找不到 → 抛中文错误，由调用方降级） */
function requireRulePack(reviewCase: ReviewCase, rulePackId?: string): ReviewCase['rulePacks'][number] {
  const pack = rulePackId
    ? reviewCase.rulePacks.find((p) => p.id === rulePackId)
    : reviewCase.rulePacks[0]
  if (!pack) {
    throw new Error(
      rulePackId ? `规则包不存在: ${rulePackId}` : '案卷中没有规则包',
    )
  }
  return pack
}

/** 规则文档块文本（供模型阅读，带块 ID 注释便于模型回引锚点） */
function renderRuleDocument(reviewCase: ReviewCase, documentId: string): string {
  const doc = reviewCase.documents.find((d) => d.id === documentId)
  if (!doc) return ''
  return doc.blocks
    .map((block) => `[${block.id}] ${block.text}`)
    .join('\n')
}

/**
 * 取待审主体文档列表（P2/D16 多待审文件）。
 *
 * 优先用案卷显式声明的 subjectDocumentIds（按声明顺序，过滤已删除的）；
 * 未声明时回落为全部 role === 'application' 的文档；一份都没有则返回空数组。
 */
/**
 * 渲染全部依据（M0/H02）：每个规则包对应文档逐份渲染（带规则包名与 documentId），
 * 并附上该包大纲条目（供模型引用 ruleItemId）。不再用首包代表整组依据。
 */
export function renderRuleDocuments(reviewCase: ReviewCase): string {
  if (reviewCase.rulePacks.length === 0) return ''
  return reviewCase.rulePacks
    .map((pack, index) => {
      const doc = reviewCase.documents.find((d) => d.id === pack.documentId)
      const body = doc ? doc.blocks.map((block) => `[${block.id}] ${block.text}`).join('\n') : '（依据文档缺失）'
      const outline = pack.outline
        .map((item) => `  - ruleItemId=${item.id} ${item.title}`)
        .join('\n')
      return (
        `===== 依据 ${index + 1}/${reviewCase.rulePacks.length}：${pack.name}（documentId=${pack.documentId}，` +
        `${doc?.fileName ?? '文件缺失'}）=====\n${body}` +
        (outline ? `\n【本依据大纲条目】\n${outline}` : '')
      )
    })
    .join('\n\n')
}

function subjectDocuments(reviewCase: ReviewCase): SourceDocument[] {
  const declared = reviewCase.subjectDocumentIds
  if (declared && declared.length > 0) {
    const byId = new Map(reviewCase.documents.map((doc) => [doc.id, doc]))
    const ordered = declared
      .map((id) => byId.get(id))
      .filter((doc): doc is SourceDocument => doc !== undefined)
    if (ordered.length > 0) return ordered
  }
  return reviewCase.documents.filter((doc) => doc.role === 'application')
}

/**
 * 渲染全部待审文件块文本（多份时逐份加文件标题，供模型识别条目并回引锚点）。
 *
 * 每份文档的块 ID 前缀不同（案卷内唯一），因此模型回引的 blockId 天然可区分来源文件。
 */
function renderSubjectDocuments(reviewCase: ReviewCase): string {
  const docs = subjectDocuments(reviewCase)
  if (docs.length === 0) return ''
  if (docs.length === 1) {
    const doc = docs[0]!
    return doc.blocks.map((block) => `[${block.id}] ${block.text}`).join('\n')
  }
  return docs
    .map((doc) => {
      const body = doc.blocks.map((block) => `[${block.id}] ${block.text}`).join('\n')
      return `===== 待审文件：${doc.fileName}（documentId=${doc.id}）=====\n${body}`
    })
    .join('\n\n')
}

interface DroppedMaterial {
  documentId: string
  fileName: string
  reason: string
}

interface VisionCollection {
  parts: ReviewContentPart[]
  /** 本次未能送入模型处理的材料（H01 账本：不只日志告警） */
  dropped: DroppedMaterial[]
}

/**
 * 收集待审文件与证明里的图片，转成 Vision 内容部件（D13）。
 *
 * 超限与读取失败不静默：返回 dropped 清单（文档 ID + 中文原因），
 * 由调用方写入运行覆盖账本（coverage.unprocessedMaterials），对应用户可见的"未处理材料"。
 */
function collectVisionImages(reviewCase: ReviewCase, warnings: string[]): VisionCollection {
  const caseDir = join(getReviewCasesDir(), reviewCase.id)
  const parts: ReviewContentPart[] = []
  const dropped: DroppedMaterial[] = []
  let skipped = 0

  for (const doc of reviewCase.documents) {
    for (const block of doc.blocks) {
      if (block.kind !== 'image' || !block.imageAssetPath) continue
      if (parts.length >= MAX_VISION_IMAGES) {
        skipped += 1
        dropped.push({
          documentId: doc.id,
          fileName: doc.fileName,
          reason: `超出单次 ${MAX_VISION_IMAGES} 张图片上限`,
        })
        continue
      }
      const assetPath = isAbsolute(block.imageAssetPath)
        ? block.imageAssetPath
        : join(caseDir, block.imageAssetPath)
      try {
        const size = statSync(assetPath).size
        if (size > MAX_VISION_IMAGE_BYTES) {
          warnings.push(`${doc.fileName} 图片过大（${(size / 1024 / 1024).toFixed(1)}MB），未纳入模型识别`)
          dropped.push({
            documentId: doc.id,
            fileName: doc.fileName,
            reason: `图片过大（${(size / 1024 / 1024).toFixed(1)}MB）`,
          })
          continue
        }
        const base64 = readFileSync(assetPath).toString('base64')
        const mime = doc.mimeType.startsWith('image/') ? doc.mimeType : 'image/png'
        parts.push({
          type: 'image_url',
          image_url: { url: `data:${mime};base64,${base64}` },
        })
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error)
        warnings.push(`${doc.fileName} 图片读取失败，未纳入模型识别: ${message}`)
        dropped.push({ documentId: doc.id, fileName: doc.fileName, reason: `图片读取失败: ${message}` })
      }
    }
  }

  return { parts, dropped }
}

/**
 * 组装领域包相关的 system prompt 片段（P1/D14）。
 *
 * 结构化指令（JSON 字段、锚点回引规则）由各任务的模板给出；
 * 此处只注入领域知识：角色、审查视角、建议类别、问题类型表。
 */
function domainPromptParts(pack: ReviewDomainPack): {
  role: string
  guideline: string
  categories: string
  kinds: string
} {
  const kinds = pack.findingKinds
    .map((spec) => `${spec.id}（${spec.label}${spec.hint ? `：${spec.hint}` : ''}）`)
    .join('；')
  return {
    role: pack.prompts.role,
    guideline: pack.prompts.guideline ? `${pack.prompts.guideline}` : '',
    categories: pack.ruleCategories.join('/'),
    kinds,
  }
}

/** 待审文件块文本中是否含图片占位（用于把"图片已随请求送出"写进 prompt） */
function countImageBlocks(reviewCase: ReviewCase): number {
  return reviewCase.documents.reduce(
    (total, doc) => total + doc.blocks.filter((block) => block.kind === 'image').length,
    0,
  )
}

/** 取条目锚点指向的申报表块文本（静态问答引用原文用） */
function findBlockText(reviewCase: ReviewCase, anchor: ReviewSourceAnchor): string | undefined {
  const doc = reviewCase.documents.find((d) => d.id === anchor.documentId)
  if (!doc) return undefined
  if (anchor.blockId) {
    const block = doc.blocks.find((b) => b.id === anchor.blockId)
    return block?.text
  }
  return doc.blocks[0]?.text
}

// ===== 1. 规则大纲 =====

/**
 * fixture 大纲（从演示案卷复制该规则包的大纲，generatedBy 已是 'fixture'）。
 *
 * 降级路径必须自身可靠：请求的 packId 不在演示案卷时回落演示案卷首个包，不抛错
 * （用户自建案卷的 packId 与演示案卷无关，抛错会让降级路径二次失败）。
 */
function fallbackOutline(reviewCase: ReviewCase, rulePackId?: string): RuleOutlineItem[] {
  const fixtureCase = buildDemoCase()
  const pack =
    fixtureCase.rulePacks.find((candidate) => candidate.id === rulePackId) ?? fixtureCase.rulePacks[0]
  if (!pack) return []
  return pack.outline
}

/** 校验 AI 返回的大纲数组（类型收窄，不满足契约直接抛 → 调用方降级） */
function parseOutline(raw: unknown): RuleOutlineItem[] {
  if (!Array.isArray(raw) || raw.length === 0) {
    throw new Error('模型输出的规则大纲为空或不是数组')
  }
  const items = raw.filter(
    (entry): entry is RuleOutlineItem =>
      !!entry &&
      typeof entry === 'object' &&
      typeof (entry as RuleOutlineItem).category === 'string' &&
      typeof (entry as RuleOutlineItem).title === 'string' &&
      Array.isArray((entry as RuleOutlineItem).anchors),
  )
  if (items.length === 0) throw new Error('模型输出的规则大纲缺少合法条目')
  // AI 产出统一标记来源；锚点已由模型引用真实块 ID（保留原样，非法锚点由 UI 容错）
  return items.map((item, index) => ({
    ...item,
    id: item.id || `outline-ai-${index + 1}`,
    generatedBy: 'ai',
    ...(item.constraint === undefined || item.constraint === null
      ? { constraint: undefined }
      : isValidRuleConstraint(item.constraint)
        ? { constraint: item.constraint }
        : (console.warn(`[审核专区] 丢弃无效规则约束：${item.title}`), { constraint: undefined })),
  }))
}

function isIsoDate(value: unknown): value is string {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const parsed = new Date(`${value}T00:00:00.000Z`)
  return Number.isFinite(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value
}

function isValidRuleConstraint(value: unknown): value is NonNullable<RuleOutlineItem['constraint']> {
  if (!value || typeof value !== 'object') return false
  const constraint = value as Record<string, unknown>
  const finite = (candidate: unknown): candidate is number => typeof candidate === 'number' && Number.isFinite(candidate)
  switch (constraint.kind) {
    case 'score-value': {
      const condition = constraint.appliesWhen
      return finite(constraint.value) && !!condition && typeof condition === 'object' && (() => {
        const appliesWhen = condition as Record<string, unknown>
        return typeof appliesWhen.field === 'string' && /^[\p{L}_][\p{L}\p{N}_.-]*$/u.test(appliesWhen.field)
          && ((typeof appliesWhen.equals === 'string' || finite(appliesWhen.equals)) || (typeof appliesWhen.includes === 'string' && appliesWhen.includes.length > 0))
      })()
    }
    case 'level-mapping':
      return !!constraint.levels && typeof constraint.levels === 'object' && !Array.isArray(constraint.levels)
        && Object.keys(constraint.levels as Record<string, unknown>).length > 0
        && Object.values(constraint.levels as Record<string, unknown>).every(finite)
        && (constraint.levelKeywords === undefined || (!!constraint.levelKeywords && typeof constraint.levelKeywords === 'object' && !Array.isArray(constraint.levelKeywords) && Object.entries(constraint.levelKeywords as Record<string, unknown>).every(([key, item]) => key.length > 0 && typeof item === 'string' && item.length > 0)))
    case 'date-range':
      return (constraint.dateFrom === undefined || isIsoDate(constraint.dateFrom))
        && (constraint.dateTo === undefined || isIsoDate(constraint.dateTo))
        && (constraint.dateFrom !== undefined || constraint.dateTo !== undefined)
    case 'required-evidence':
      return Array.isArray(constraint.requiredEvidenceTypes) && constraint.requiredEvidenceTypes.length > 0
        && constraint.requiredEvidenceTypes.every((item) => typeof item === 'string' && item.trim().length > 0)
    case 'max-score': case 'amount-limit':
      return finite(constraint.value)
    case 'mutual-exclusion':
      return typeof constraint.exclusionGroup === 'string' && constraint.exclusionGroup.trim().length > 0
    default:
      return false
  }
}

/**
 * 生成规则大纲（左栏）。
 *
 * 真实路径：网关可用 → 模型从规则文档逐条提取类别/标题/摘要/锚点。
 * 降级：任何失败 → 返回 fixture 大纲（与演示案卷同款，锚点真实）。
 */
export async function generateRuleOutline(
  request: GenerateRuleOutlineRequest,
): Promise<RuleOutlineItem[]> {
  const reviewCase = getCase(request.caseId)
  if (!reviewCase) throw new Error(`案卷不存在: ${request.caseId}`)
  if (!isKnownDomainPack(reviewCase.domainPackId)) {
    // M0/H14：未知领域不得悄悄按综测规则执行（K14）
    throw new Error(`审核领域未配置: ${String(reviewCase.domainPackId)}（请选择有效领域包）`)
  }



  const resolved = resolveReviewGatewayChannel()
  if (!resolved) {
    // M0/H03：演示回退仅限演示案卷（isDemo 且 fixture 来源）；
    // 真实案卷不再回填演示校规——失败如实抛出，保留案卷已有大纲与人工补充入口
    if (reviewCase.isDemo) {
      const outline = fallbackOutline(reviewCase, request.rulePackId)
      console.warn(`[审核专区] 规则大纲降级: 无可用模型出口，演示案卷返回预置大纲（${outline.length} 条）`)
      return outline
    }
    throw new Error('规则大纲生成失败：无可用模型出口（未回填任何预置规则，可重试或人工补充）')
  }

  try {
    const pack = requireRulePack(reviewCase, request.rulePackId)
    const ruleText = renderRuleDocument(reviewCase, pack.documentId)
    const domain = domainPromptParts(resolveDomainPack(reviewCase.domainPackId))
    const ruleSourceCase = { ...reviewCase, documents: reviewCase.documents.filter((document) => document.id === pack.documentId) }
    const { parts: ruleImages, dropped: droppedRuleImages } = collectVisionImages(ruleSourceCase, [])
    for (const dropped of droppedRuleImages) console.warn(`[审核专区] 规则大纲: ${dropped.fileName} ${dropped.reason}`)
    const ruleImageNote = ruleImages.length > 0
      ? `\n\n【依据扫描页】另附 ${ruleImages.length} 张依据页图像；请连同提取文本核对图表、扫描内容与版式。`
      : ''
    const messages: ReviewChatMessage[] = [
      {
        role: 'system',
        content:
          `${domain.role}。${domain.guideline}` +
          '请从给定的依据文件中提取审核规则大纲，' +
          `每条给出 category（建议取值：${domain.categories}；依据文件确有其他类别的，可自定义简短中文类别）、` +
          'title、summary、constraint、anchors（对象数组，documentId 与 blockId 必须原样引用文中方括号标记的 ID）。' +
          'constraint 必须是可结构化表达的约束对象，否则为 null；不得猜测或补全原文未明确的数值、日期、等级与材料要求。' +
          '支持 constraint：score-value（必须带 appliesWhen:{field,equals 或 includes}）、level-mapping（levels 等级到数值；多等级分值必须合并为一条）、date-range（dateFrom/dateTo，YYYY-MM-DD）、required-evidence（requiredEvidenceTypes）、max-score（value）、amount-limit（value）、mutual-exclusion（exclusionGroup）。' +
          '多个“等级→分值”映射必须优先使用 level-mapping，禁止拆成多个无条件 score-value；只有原文明示某一适用类别/条件的固定分值时才用 score-value。' +
          'constraint=null 用于原则性、语义性或无法确定结构的规则。输出 JSON 数组，每条对象必须含 category,title,summary,constraint,anchors；不要输出解释文字。',
      },
      {
        role: 'user',
        content: ruleImages.length > 0
          ? [{ type: 'text', text: `规则包：${pack.name}（${pack.academicYear}，${pack.version}）\n\n规则文档：\n${ruleText}\n\n${buildSourceRegistry(reviewCase)}${ruleImageNote}` }, ...ruleImages]
          : `规则包：${pack.name}（${pack.academicYear}，${pack.version}）\n\n规则文档：\n${ruleText}\n\n${buildSourceRegistry(reviewCase)}`,
      },
    ]
    const text = await chatCompletion(resolved.channel, messages, { maxTokens: MAX_TOKENS })
    const outline = parseOutline(extractJson(text))
    console.log(`[审核专区] 规则大纲 AI 生成成功: ${outline.length} 条`)
    // 大纲回写案卷（M0/H05：进逐案串行写队列，队列内读最新再定向 patch，
    // 模型调用窗口内其他写入（导入/识别）不会被覆盖；确认态重置为未确认待人工复核）
    await updateCase(
      request.caseId,
      (fresh) => ({
        ...fresh,
        rulePacks: fresh.rulePacks.map((pack) =>
          pack.id === (request.rulePackId ?? fresh.rulePacks[0]?.id)
            ? { ...pack, outline, confirmed: false }
            : pack,
        ),
      }),
      { reason: `规则大纲写回（${outline.length} 条）` },
    )
    return outline
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    if (reviewCase.isDemo) {
      const outline = fallbackOutline(reviewCase, request.rulePackId)
      console.warn(`[审核专区] 规则大纲降级: ${message}；演示案卷返回预置大纲（${outline.length} 条）`)
      return outline
    }
    // 真实案卷：模型调用失败不伪装成大纲；已有大纲保持不动（写回仅在成功路径）
    throw new Error(`规则大纲生成失败：${message}（案卷已有大纲未改动，可重试或人工补充）`)
  }
}

// ===== 2. 条目识别 =====

/** 条目锚点（供模型回引）；documentId 缺失时降为"仅定位到文件"占位，不抛错——模型输出锚点本就不可靠，宽进严出 */
function parseAnchor(raw: unknown): ReviewSourceAnchor {
  const anchor = raw as ReviewSourceAnchor | undefined
  if (!anchor || typeof anchor !== 'object' || typeof anchor.documentId !== 'string') {
    return { documentId: '', precision: 'document' }
  }
  const precision = anchor.precision === 'block' || anchor.precision === 'page' ? anchor.precision : 'document'
  return { ...anchor, precision }
}

/** 校验 AI 返回的条目数组 */
function parseItems(raw: unknown): ReviewItem[] {
  if (!Array.isArray(raw) || raw.length === 0) {
    throw new Error('模型输出的申报条目为空或不是数组')
  }
  const items = raw.filter(
    (entry): entry is ReviewItem =>
      !!entry &&
      typeof entry === 'object' &&
      typeof (entry as ReviewItem).title === 'string' &&
      typeof (entry as ReviewItem).declaredScore === 'number',
  )
  if (items.length === 0) throw new Error('模型输出的申报条目缺少合法项')
  return items.map((item, index) => ({
    ...item,
    id: item.id || `item-ai-${index + 1}`,
    anchor: parseAnchor(item.anchor),
    category: item.category || '其他',
    evidenceDocumentIds: Array.isArray(item.evidenceDocumentIds) ? item.evidenceDocumentIds : [],
    status: item.status ?? 'identified',
    identifiedBy: 'ai',
  }))
}

/** 锚点 documentId 为空串时用兜底锚点替换 */
function withFallback(anchor: ReviewSourceAnchor, fallback: ReviewSourceAnchor | undefined): ReviewSourceAnchor {
  if (!anchor.documentId && fallback) return fallback
  return anchor
}

/** 空 documentId 的锚点兜底：指向 role 对应的第一份文档（宽进严出，AI 路径不因锚点不可靠而丢弃结论） */
function fallbackAnchor(reviewCase: ReviewCase, role: SourceDocument['role']): ReviewSourceAnchor | undefined {
  const doc = reviewCase.documents.find((d) => d.role === role && d.parseStatus !== 'failed')
  if (!doc) return undefined
  return { documentId: doc.id, precision: 'document' }
}

/**
 * 识别可审核条目（中栏）。
 *
 * 真实路径：网关可用 → 模型从申报表 CSV 逐行识别条目并回引锚点。
 * 降级：任何失败 → 返回 case.items 原样（fixture 已是识别好的演示条目）。
 */
export async function extractItems(caseId: string): Promise<ReviewItem[]> {
  const reviewCase = getCase(caseId)
  if (!reviewCase) throw new Error(`案卷不存在: ${caseId}`)
  if (!isKnownDomainPack(reviewCase.domainPackId)) {
    // M0/H14：未知领域不得悄悄按综测规则执行（K14）
    throw new Error(`审核领域未配置: ${String(reviewCase.domainPackId)}（请选择有效领域包）`)
  }


  const resolved = resolveReviewGatewayChannel()
  if (!resolved) {
    if (!reviewCase.isDemo) throw new Error('条目识别失败：无可用模型出口，尚未检查待审文件（已有条目保留）')
    console.warn(`[审核专区] 条目识别降级: 无可用模型出口，返回案卷既有条目（${reviewCase.items.length} 条）`)
    return reviewCase.items
  }

  try {
    const appText = renderSubjectDocuments(reviewCase)
    if (!appText) throw new Error('案卷中没有待审文件（可导入 role 为"待审文件"的材料，或指定 subjectDocumentIds）')
    const subjectCount = subjectDocuments(reviewCase).length
    // 条目类别：综测用固定五育类别；其他领域包用其规则类别，并允许自定义
    const domain = domainPromptParts(resolveDomainPack(reviewCase.domainPackId))
    const isComprehensive = resolveDomainPack(reviewCase.domainPackId).id === 'comprehensive-assessment'
    const categoryHint = isComprehensive
      ? 'category（德育/智育/体育/美育/劳育/其他 之一）'
      : `category（建议取自 ${domain.categories}；不确定时用"其他"）`
    const visionWarnings: string[] = []
    const { parts: images, dropped: extractDropped } = collectVisionImages(reviewCase, visionWarnings)
    for (const item of extractDropped) console.warn(`[审核专区] 条目识别: ${item.fileName} ${item.reason}`)
    const imageNote = images.length > 0
      ? `\n\n【随附图片】${images.length} 张证明材料图片已随本条消息提供，请直接阅读图片内容并据实识别。`
      : ''

    const messages: ReviewChatMessage[] = [
      {
        role: 'system',
        content:
          `${domain.role}。` +
          (subjectCount > 1
            ? `案卷中有 ${subjectCount} 份待审文件，请逐份识别其中的可审核事项（同一份文件内的多条事项分别列出）。`
            : '请从待审文件中识别每一条可审核事项。') +
          '每条给出 title、' +
          `${categoryHint}、level（可缺，原文表述的等级/档位）、declaredScore（数字；无分值概念的领域填 0）、` +
          'activityDate（可缺，ISO 格式）、organizer（可缺，出具/责任单位）、evidenceDocumentIds（字符串数组，可为空）、' +
          'anchor（对象：documentId 与 blockId 必须原样引用待审文件方括号中的 ID，precision 固定 "block"）。' +
          '只输出 JSON 数组，不要任何解释文字。',
      },
      {
        role: 'user',
        content: images.length > 0
          ? [{ type: 'text', text: `待审文件：\n${appText}\n\n${renderEvidenceDocuments(reviewCase)}\n\n${buildSourceRegistry(reviewCase)}${imageNote}` }, ...images]
          : `待审文件：\n${appText}\n\n${renderEvidenceDocuments(reviewCase)}\n\n${buildSourceRegistry(reviewCase)}`,
      },
    ]
    const result = await chatCompletionWithMeta(resolved.channel, messages, { maxTokens: MAX_TOKENS })
    if (result.imagesDropped) {
      console.warn('[审核专区] 条目识别: 模型不支持图片，已剔除图片仅按文本识别')
    }
    const items = parseItems(extractJson(result.text))
    console.log(`[审核专区] 条目识别 AI 成功: ${items.length} 条`)
    // 识别结果回写案卷（M0/H05：进逐案串行写队列，队列内读最新再定向 patch——
    // 60s 模型调用窗口内其他写入（导入/大纲）不会被本次覆盖）
    await updateCase(
      caseId,
      (fresh) => ({ ...fresh, items }),
      { reason: `条目识别写回（${items.length} 条）` },
    )
    return items
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    if (!reviewCase.isDemo) throw new Error(`条目识别失败：${message}（已有条目未改动，请重试）`)
    console.warn(`[审核专区] 条目识别降级: ${message}；返回案卷既有条目（${reviewCase.items.length} 条）`)
    return reviewCase.items
  }
}

// ===== 3. 审核运行（AI 引擎） =====

/**
 * 严重度收窄：模型给了合法值就用；否则按该领域包中该类型的默认严重度（D15）。
 *
 * 未知类型 → findingKindSeverity 回落 yellow，不制造第三种状态。
 */
function parseSeverity(raw: unknown, pack: ReviewDomainPack, kind: FindingKind): FindingSeverity {
  if (raw === 'red' || raw === 'yellow') return raw
  return findingKindSeverity(pack, kind)
}

/**
 * 问题类型收窄（D15 宽进严出）。
 *
 * 属于该领域包的类型原样保留；否则收敛到兜底类型 'other'（标签与严重度由包内 other 定义）。
 */
function parseKind(raw: unknown, pack: ReviewDomainPack): FindingKind {
  const kind = typeof raw === 'string' && raw.length > 0 ? raw : FALLBACK_FINDING_KIND
  return isKnownFindingKind(pack, kind) ? kind : FALLBACK_FINDING_KIND
}

/** 处理建议收窄（未知建议 → manual-review 兜底） */
const SUGGESTIONS: FindingSuggestion[] = [
  'fix-declaration',
  'supplement-evidence',
  'manual-review',
  'modify-score',
]
function parseSuggestion(raw: unknown): FindingSuggestion {
  return SUGGESTIONS.includes(raw as FindingSuggestion) ? (raw as FindingSuggestion) : 'manual-review'
}

/** 收窄锚点数组（非法项直接过滤：宁缺勿假坐标） */
function parseAnchors(raw: unknown): ReviewSourceAnchor[] {
  if (!Array.isArray(raw)) return []
  return raw
    .filter((entry): entry is ReviewSourceAnchor =>
      !!entry && typeof entry === 'object' && typeof (entry as ReviewSourceAnchor).documentId === 'string')
    .map((entry) => {
      const precision = entry.precision === 'block' || entry.precision === 'page' ? entry.precision : 'document'
      return { ...entry, precision }
    })
}

/** 校验 AI 返回的 findings 数组（reviewCase 用于锚点兜底，pack 用于类型/严重度回落） */
export function parseFindings(
  raw: unknown,
  reviewCase: ReviewCase,
  pack: ReviewDomainPack,
  imagesDropped: boolean,
): ReviewFinding[] {
  // M0/H04：合法空数组是"未发现问题"，不是异常——直接返回，不再触发 mock 降级
  // （零问题是否可信由覆盖账本与 run.status 表达，不靠造问题）
  if (Array.isArray(raw) && raw.length === 0) return []
  if (!Array.isArray(raw)) {
    throw new Error('模型输出的审核发现不是数组')
  }
  const knownItemIds = new Set(reviewCase.items.map((item) => item.id))
  const findings = raw.filter((entry): entry is ReviewFinding => {
    if (!entry || typeof entry !== 'object') return false
    const candidate = entry as ReviewFinding
    if (typeof candidate.itemId !== 'string' || typeof candidate.title !== 'string') return false
    // M0/H04：外案/不存在的事项 ID 不得进入有效检查（K04 foreign itemId）
    if (candidate.itemId !== 'case-level' && !knownItemIds.has(candidate.itemId)) {
      console.warn(`[审核专区] 丢弃引用未知事项的发现: itemId=${candidate.itemId} title=${candidate.title}`)
      return false
    }
    return true
  })
  if (findings.length === 0 && raw.length > 0) throw new Error('模型输出的审核发现缺少合法项')
  const subjectFallback =
    subjectDocuments(reviewCase)[0]
      ? { documentId: subjectDocuments(reviewCase)[0]!.id, precision: 'document' as const }
      : fallbackAnchor(reviewCase, 'application')

  return findings.map((finding, index) => {
    const kind = parseKind(finding.kind, pack)
    const ruleAnchors = parseAnchors(finding.ruleAnchors)
    const ruleFallback = fallbackAnchor(reviewCase, 'rule')
    const parsed: ReviewFinding = {
      ...finding,
      id: finding.id || `find-ai-${index + 1}`,
      kind,
      severity: parseSeverity(finding.severity, pack, kind),
      detail: finding.detail ?? finding.title,
      suggestion: parseSuggestion(finding.suggestion),
      suggestionText: finding.suggestionText ?? '请人工复核该项待审内容与证明材料。',
      subjectAnchor: withFallback(parseAnchor(finding.subjectAnchor), subjectFallback),
      evidenceAnchor: finding.evidenceAnchor
        ? withFallback(parseAnchor(finding.evidenceAnchor), fallbackAnchor(reviewCase, 'evidence'))
        : undefined,
      counterpartAnchor: finding.counterpartAnchor
        ? withFallback(parseAnchor(finding.counterpartAnchor), subjectFallback)
        : undefined,
      ruleAnchors: ruleAnchors.length > 0 ? ruleAnchors : ruleFallback ? [ruleFallback] : [],
      ruleItemIds: Array.isArray(finding.ruleItemIds) ? finding.ruleItemIds : [],
      generatedBy: 'ai',
    }
    // 图片被剔除而该结论可能依赖图片内容时，在说明里显式标注，避免误导
    if (imagesDropped) {
      parsed.detail = `${parsed.detail}（注：本次模型调用未包含图片内容，如图片为关键依据请人工复核）`
    }
    // 可缺字段不落 undefined 键（保持 JSON 干净）
    if (parsed.evidenceAnchor === undefined) delete parsed.evidenceAnchor
    if (parsed.counterpartAnchor === undefined) delete parsed.counterpartAnchor
    return parsed
  })
}

/**
 * 执行 AI 审核（真实路径的引擎）。
 *
 * 真实路径：网关可用 → 模型逐条比对申报/证明/规则，输出 findings。
 * 降级：仅内置演示案卷可使用 mock 引擎；真实案卷失败时明确报错。
 *
 * 注意：这里只在"网关可用但调用失败"时兜底；完全无渠道的降级由 run-service
 * 与本函数共同保证；真实案卷无渠道时不得产生模拟结论。
 */
/**
 * 渲染证明材料的原文文本（M0/H01）：文本型证明此前只出现在 EvidenceDocument 摘要里，
 * 原文从未进入审核请求；现在按文档逐块给出（带 documentId/blockId 供模型引用）。
 * 只有解析成功的文本块参与；扫描件/解析失败保持"未处理"语义，由覆盖账本表达。
 */
export function renderEvidenceDocuments(reviewCase: ReviewCase): string {
  const evidenceDocs = reviewCase.documents.filter(
    (doc) => doc.role === 'evidence' && doc.parseStatus === 'parsed' && doc.blocks.length > 0,
  )
  if (evidenceDocs.length === 0) return ''
  return evidenceDocs
    .map((doc) => {
      const body = doc.blocks
        .map((block) => (block.text ? `[${block.id}] ${block.text}` : `[${block.id}]（图片块，见随附图像）`))
        .join('\n')
      return `===== 证明原文：${doc.fileName}（documentId=${doc.id}）=====\n${body}`
    })
    .join('\n\n')
}

/**
 * 未处理材料账本（M0/H01）：已登记但本次未能纳入检查的文件及原因。
 * 覆盖：解析失败/无文本层（扫描件）、视觉路径弃用（超限/过大/读取失败）。
 * 出现在账本中的材料阻止"完整符合"结论，UI 必须可见。
 */
/**
 * 锚点存在性核验（M0/H07 后半）：对照案卷真实文档/块，修复或降级模型输出的出处。
 * - documentId 不存在 → 锚点删除（不猜测落点、不指向第一份材料）
 * - 文档存在但 blockId 不存在 → 降级为文件级定位（precision 'document'，删除假块 ID）
 * - 全部出处均不可核验的发现 → 严重度降为 yellow + suggestion 改 manual-review，
 *   detail 追加降级原因（伪引用不得以红卡交付）
 */
export function sanitizeFindingSources(finding: ReviewFinding, reviewCase: ReviewCase): ReviewFinding {
  const docIds = new Set(reviewCase.documents.map((doc) => doc.id))
  const blocksOf = (documentId: string): Set<string> | undefined =>
    reviewCase.documents.find((doc) => doc.id === documentId)?.blocks
      ? new Set(reviewCase.documents.find((doc) => doc.id === documentId)!.blocks.map((block) => block.id))
      : undefined

  const check = (anchor: ReviewSourceAnchor | undefined): ReviewSourceAnchor | undefined => {
    if (!anchor || !anchor.documentId || !docIds.has(anchor.documentId)) return undefined
    if (!anchor.blockId) return anchor
    const blocks = blocksOf(anchor.documentId)
    if (blocks?.has(anchor.blockId)) return anchor
    // 真实文件但块失效：降级文件级定位，不保留假块 ID
    return { documentId: anchor.documentId, precision: 'document' }
  }

  const ruleAnchors = (finding.ruleAnchors ?? []).map(check).filter((a): a is ReviewSourceAnchor => !!a)
  const subjectChecked = check(finding.subjectAnchor)
  const evidenceChecked = check(finding.evidenceAnchor)
  const counterpartChecked = check(finding.counterpartAnchor)
  const hasAnySource = ruleAnchors.length > 0 || !!subjectChecked || !!evidenceChecked || !!counterpartChecked

  if (!hasAnySource) {
    // 全部出处不可核验：保留原引用供排查，但结论降级为待确认（不得以红卡交付）
    return {
      ...finding,
      severity: 'yellow',
      suggestion: 'manual-review',
      suggestionText: '出处未能核验（模型引用的文件/位置不存在），已降级为待人工确认。',
      detail: `${finding.detail}\n\n[系统] 该结论的出处引用无法在案卷中核验，不能作为已核验的确定结论。`,
    }
  }
  // 部分可核验：核验通过的替换（文件级降级/真块保留）；subjectAnchor 类型必填，
  // 指向未知文档时保留原值——该锚点不会命中任何块（无高亮），卡片已注明待确认
  return {
    ...finding,
    ruleAnchors,
    ...(subjectChecked ? { subjectAnchor: subjectChecked } : {}),
    evidenceAnchor: evidenceChecked,
    counterpartAnchor: counterpartChecked,
  }
}

export function computeUnprocessedMaterials(
  reviewCase: ReviewCase,
  visionDropped: DroppedMaterial[] = [],
): Array<{ documentId: string; fileName: string; reason: string }> {
  const entries: Array<{ documentId: string; fileName: string; reason: string }> = []
  for (const doc of reviewCase.documents) {
    if (doc.parseStatus === 'failed') {
      entries.push({ documentId: doc.id, fileName: doc.fileName, reason: '解析失败' })
    } else if (doc.parseStatus === 'partial' && doc.blocks.length === 0) {
      entries.push({ documentId: doc.id, fileName: doc.fileName, reason: '未提取到文本（典型：扫描件无文本层）' })
    }
  }
  const seen = new Set(entries.map((entry) => entry.documentId))
  for (const drop of visionDropped) {
    if (seen.has(drop.documentId)) continue
    entries.push(drop)
  }
  return entries
}

/**
 * 来源注册表（M0/H07 前半）：把案卷内全部文档与其块 ID 列成模型可引用的白名单。
 * 模型输出的锚点必须来自该表（存在性核验在 parseFindings/渲染层完成）。
 */
export function buildSourceRegistry(reviewCase: ReviewCase): string {
  const roleLabels: Record<SourceDocument['role'], string> = {
    rule: '依据文件',
    application: '待审文件',
    evidence: '证明材料',
  }
  const lines = reviewCase.documents.map((doc) => {
    const blockIds = doc.blocks.map((block) => block.id)
    const range = blockIds.length > 0 ? `，块 ${blockIds[0]}..${blockIds[blockIds.length - 1]}` : '（无文本块）'
    return `- ${doc.id}（${roleLabels[doc.role]}「${doc.fileName}」${range}）`
  })
  return `【来源注册表】引用锚点（documentId/blockId）必须取自下列真实 ID，禁止编造：\n${lines.join('\n')}`
}

export async function runAiReview(reviewCase: ReviewCase): Promise<AiReviewOutcome> {
  if (!isKnownDomainPack(reviewCase.domainPackId)) {
    // M0/H14：未知领域不得悄悄按综测规则执行（K14）
    throw new Error(`审核领域未配置: ${String(reviewCase.domainPackId)}（请选择有效领域包）`)
  }
  const resolved = resolveReviewGatewayChannel()
  if (!resolved) {
    if (!reviewCase.isDemo) throw new Error('无可用模型出口，真实案卷不能使用演示模拟审核')
    const outcome = runMockReview(reviewCase)
    console.warn(
      `[审核专区] AI 审核降级: 无可用模型出口，启用确定性模拟引擎（发现 ${outcome.findings.length} 条）`,
    )
    return outcome
  }

  // M0/H04 输入校验：放在兜底 catch 之前——零依据/零待审文件必须如实失败，
  // 不能被降级 catch 吞成 mock 结论（K04：零事项要求确认对象或识别状态）
  if (reviewCase.rulePacks.length === 0) {
    throw new Error('案卷没有依据规则包，无法审核')
  }
  if (subjectDocuments(reviewCase).length === 0) {
    throw new Error('案卷没有待审文件（未识别到可审核对象），无法审核')
  }

  try {
    const domainPack = resolveDomainPack(reviewCase.domainPackId)
    const domain = domainPromptParts(domainPack)
    const ruleText = renderRuleDocuments(reviewCase)
    const appText = renderSubjectDocuments(reviewCase)
    const subjectDocs = subjectDocuments(reviewCase)
    const evidencesBrief = reviewCase.evidences
      .map((evidence) => `${evidence.documentId}: ${evidence.recognizedFacts}（状态 ${evidence.parseStatus}）`)
      .join('\n')

    const visionWarnings: string[] = []
    const { parts: images, dropped: visionDropped } = collectVisionImages(reviewCase, visionWarnings)
    for (const warning of visionWarnings) console.warn(`[审核专区] ${warning}`)
    const imageNote = images.length > 0
      ? `\n\n【随附图片】${images.length} 张图片已随本条消息提供（证明/扫描件），请直接阅读图片内容，` +
        '需要引用图片依据时，锚点用该图片所在文档的 documentId + 该 image 块的 blockId。'
      : ''
    const evidenceText = renderEvidenceDocuments(reviewCase)
    const sourceRegistry = buildSourceRegistry(reviewCase)
    const crossDocNote = subjectDocs.length > 1
      ? `\n\n【跨文件比对】本案卷有 ${subjectDocs.length} 份待审文件（${subjectDocs.map((d) => d.fileName).join('、')}）。` +
        '请额外核对文件之间是否存在互相矛盾之处；一旦发现，kind 用 cross-document-mismatch，' +
        'subjectAnchor 指向其中一处、counterpartAnchor 指向另一处。'
      : ''

    const messages: ReviewChatMessage[] = [
      {
        role: 'system',
        content:
          `${domain.role}。${domain.guideline}` +
          `本案卷共有 ${reviewCase.rulePacks.length} 份依据，请对照【全部依据文件】逐条审核待审内容，不得只审其中一份。` +
          '依据之间冲突时不得自行裁定，相关条目给 manual-review。' +
          '产出问题清单。' +
          `每条发现给出：itemId（待审条目 ID，无对应条目时用该文件首个条目 ID 或 "case-level"）、` +
          `kind（取值：${domain.kinds}）、` +
          'severity（red/yellow）、title、detail（说明为什么判，必须引用依据条款原文要点）、' +
          'suggestion（fix-declaration/supplement-evidence/manual-review/modify-score 之一）、suggestionText、' +
          'subjectAnchor（对象，documentId/blockId 引用待审文件方括号 ID）、' +
          'evidenceAnchor（可缺，证明/附件侧锚点）、counterpartAnchor（可缺，跨文件比对时的另一处位置）、' +
          'ruleAnchors（依据侧锚点数组）、ruleItemIds（引用的依据条目 ID）、' +
          'suggestedScore（可缺，数字；领域无分值概念时省略）。只输出 JSON 数组，不要任何解释文字。',
      },
      {
        role: 'user',
        content:
          images.length > 0
            ? [
                {
                  type: 'text',
                  text:
                    `【依据文件】\n${ruleText}\n\n【待审文件】\n${appText}\n\n` +
                    `【证明识别结果】\n${evidencesBrief}\n\n` +
                    (evidenceText ? `【证明原文】\n${evidenceText}\n\n` : '') +
                    sourceRegistry + '\n\n' +
                    `【待审条目】\n${JSON.stringify(reviewCase.items, null, 2)}` +
                    crossDocNote +
                    imageNote,
                },
                ...images,
              ]
            : `【依据文件】\n${ruleText}\n\n【待审文件】\n${appText}\n\n` +
              `【证明识别结果】\n${evidencesBrief}\n\n` +
              (evidenceText ? `【证明原文】\n${evidenceText}\n\n` : '') +
              `【待审条目】\n${JSON.stringify(reviewCase.items, null, 2)}\n\n` +
              sourceRegistry +
              crossDocNote,
      },
    ]
    // 审核运行是长上下文操作：用专用超时，避免推理模型在 60 秒处被误判失败而降级
    const result = await chatCompletionWithMeta(resolved.channel, messages, {
      maxTokens: MAX_TOKENS,
      timeoutMs: REVIEW_RUN_TIMEOUT_MS,
    })
    if (result.imagesDropped) {
      console.warn('[审核专区] AI 审核: 模型不支持图片，已剔除图片仅按文本审核（结论会标注）')
    }
    const parsed = parseFindings(extractJson(result.text), reviewCase, domainPack, result.imagesDropped)
    // M0/H07：出处存在性核验——伪引用降级为待确认，不伪装成已核验红卡
    const findings = parsed.map((finding) => sanitizeFindingSources(finding, reviewCase))
    console.log(`[审核专区] AI 审核成功: 发现 ${findings.length} 条`)

    // 覆盖摘要：以案卷条目为全集，AI 未提及的条目仍算"已审阅"（模型逐条过了一遍）
    const reviewedItemIds = reviewCase.items.map((item) => item.id)
    const manualReviewItemIds = findings
      .filter((finding) => finding.suggestion === 'manual-review')
      .map((finding) => finding.itemId)
    // M0/H13 分值守门：依据未确认（无确认分值映射/公式）时，模型 suggestedScore
    // 不得作为规则计算结果输出——相关发现转为待确认语义（保留 detail 说明）
    const hasConfirmedMapping = reviewCase.rulePacks.some((rulePack) => rulePack.confirmed)
    const gatedFindings = hasConfirmedMapping
      ? findings
      : findings.map((finding) => {
          if (finding.suggestedScore === undefined) return finding
          const rest: ReviewFinding = { ...finding }
          delete rest.suggestedScore
          console.warn(`[审核专区] 分值守门: 依据未确认，剥离建议分值 — ${finding.title}`)
          return rest
        })
    return {
      caseId: reviewCase.id,
      findings: gatedFindings,
      coverage: {
        reviewedItemIds,
        manualReviewItemIds: [...new Set(manualReviewItemIds)],
        // 未识别 = 解析失败，或"部分解析但一个块都没提取出来"（典型：扫描件 PDF 无文本层）
        unrecognizedDocumentIds: reviewCase.documents
          .filter(
            (doc) =>
              doc.parseStatus === 'failed' ||
              (doc.parseStatus === 'partial' && doc.blocks.length === 0),
          )
          .map((doc) => doc.id),
        // 没有问题卡不代表没有规则覆盖；仅保留模型明确给出的无适用依据项。
        ruleUncoveredItemIds: findings.filter((finding) => finding.kind === 'rule-unmatched').map((finding) => finding.itemId),
        // 未处理材料账本（H01）：超限图片/解析失败/扫描未读，UI 可见并阻止"完整符合"
        unprocessedMaterials: computeUnprocessedMaterials(reviewCase, visionDropped),
      },
      engine: 'ai',
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    if (!reviewCase.isDemo) throw new Error(`模型审核失败：${message}（未生成模拟结论，请检查模型后重试）`)
    const outcome = runMockReview(reviewCase)
    console.warn(
      `[审核专区] AI 审核降级: ${message}；启用确定性模拟引擎（发现 ${outcome.findings.length} 条）`,
    )
    return outcome
  }
}

// ===== 4. 审核助手对话 =====

/** 助手回答结构（与 preload assistantChat 返回契约一致） */
export interface ReviewAssistantReply {
  content: string
  references: string[]
  degraded: boolean
}

/**
 * 取选中问题卡（可缺）。
 *
 * 问题卡存于运行记录：从案卷最近一次运行的 findings 里按 ID 查找；
 * 找不到（运行被清理 / ID 过期）→ undefined，助手按"无焦点"作答，不伪造。
 */
function findFocusFinding(reviewCase: ReviewCase, focusFindingId?: string): ReviewFinding | undefined {
  if (!focusFindingId) return undefined
  const latest = listRuns(reviewCase.id).at(-1)
  return latest?.findings.find((finding) => finding.id === focusFindingId)
}

/**
 * 静态降级回答（无渠道 / 调用失败）。
 *
 * 基于问题卡元数据与案卷事实组装，绝不编造材料外结论（D9：无依据时明说）。
 */
function staticAssistantAnswer(
  reviewCase: ReviewCase,
  request: AssistantChatRequest,
  focusFinding: ReviewFinding | undefined,
): ReviewAssistantReply {
  const references: string[] = []
  const lines: string[] = ['（当前无可用模型出口，以下为基于案卷元数据的静态解答）']

  if (focusFinding) {
    references.push(focusFinding.id, ...focusFinding.ruleItemIds)
    lines.push(`选中问题卡：${focusFinding.title}`)
    lines.push(`判定说明：${focusFinding.detail}`)
    lines.push(`处理建议：${focusFinding.suggestionText}`)
    const subjectText = findBlockText(reviewCase, focusFinding.subjectAnchor)
    if (subjectText) {
      references.push(focusFinding.subjectAnchor.documentId)
      lines.push(`申报表原文：${subjectText}`)
    }
  } else {
    // 无选中问题卡 → 用最近一条用户问题 + 案卷概况作答
    const lastUser = [...request.history].reverse().find((message) => message.role === 'user')
    lines.push(`你的问题：${lastUser?.content ?? '（未提供）'}`)
    lines.push(
      `案卷概况：申请人 ${reviewCase.applicant}，学年 ${reviewCase.academicYear}，` +
        `申报条目 ${reviewCase.items.length} 条，证明材料 ${reviewCase.evidences.length} 份。`,
    )
    const latestRun = listRuns(reviewCase.id).at(-1)
    if (latestRun) {
      references.push(latestRun.id)
      lines.push(
        `最近一次审核：状态 ${latestRun.status === 'completed' ? '已完成' : latestRun.status === 'failed' ? '失败' : '进行中'}，` +
          `发现 ${latestRun.findings.length} 条（引擎 ${latestRun.engine === 'ai' ? 'AI' : '模拟'}）。`,
      )
    }
    // 引用规则包与条目 ID，方便 UI 联动
    for (const pack of reviewCase.rulePacks) references.push(pack.id)
    for (const item of reviewCase.items.slice(0, ASSISTANT_CONTEXT_LIMIT)) references.push(item.id)
    lines.push('模型出口恢复后可获得逐条依据引用的完整回答；本条不作材料外推断。')
  }

  return { content: lines.join('\n'), references: [...new Set(references)], degraded: true }
}

/**
 * 审核助手对话（真实 / 静态降级）。
 *
 * 真实路径：网关可用 → 模型基于案卷上下文 + 选中问题卡回答，要求引用材料 ID。
 * 降级：任何失败 → 静态解答（degraded:true）。
 */
export async function reviewAssistantChat(
  request: AssistantChatRequest,
): Promise<ReviewAssistantReply> {
  const reviewCase = getCase(request.caseId)
  if (!reviewCase) throw new Error(`案卷不存在: ${request.caseId}`)

  const focusFinding = findFocusFinding(reviewCase, request.focusFindingId)
  const resolved = resolveReviewGatewayChannel()
  if (!resolved) {
    console.warn('[审核专区] 助手回答降级: 无可用模型出口，返回静态解答')
    return staticAssistantAnswer(reviewCase, request, focusFinding)
  }

  try {
    const domainPack = resolveDomainPack(reviewCase.domainPackId)
    const contextLines: string[] = [
      `案卷：${reviewCase.title}`,
      `审核领域：${domainPack.name}（${domainPack.description}）`,
      `申请人：${reviewCase.applicant}；学年：${reviewCase.academicYear}`,
      `待审条目 ${reviewCase.items.length} 条；证明 ${reviewCase.evidences.length} 份；依据包 ${reviewCase.rulePacks.length} 个。`,
      `问题类型口径：${domainPack.findingKinds.map((k) => `${k.id}=${k.label}`).join('、')}`,
    ]
    if (focusFinding) {
      contextLines.push(
        `选中问题卡：${focusFinding.title}（${focusFinding.severity === 'red' ? '红' : '黄'}）`,
        `判定说明：${focusFinding.detail}`,
        `处理建议：${focusFinding.suggestionText}`,
      )
    }
    const rulesBrief = reviewCase.rulePacks
      .flatMap((pack) => pack.outline)
      .slice(0, ASSISTANT_CONTEXT_LIMIT)
      .map((rule) => `${rule.id}《${rule.title}》：${rule.summary}`)
      .join('\n')
    if (rulesBrief) contextLines.push(`已确认规则条目：\n${rulesBrief}`)

    const history: ReviewChatMessage[] = request.history.slice(-8).map((message) => ({
      role: message.role,
      content: message.content,
    }))
    const messages: ReviewChatMessage[] = [
      {
        role: 'system',
        content:
          `${domainPack.prompts.role}，负责解答审核员对审核结论的疑问。回答必须引用给定案卷材料（问题卡 ID / 依据条目 ID / 待审条目 ID），` +
          '没有依据时明确说明无法确定，不作材料外推断；不代替审批决定。' +
          '用中文简洁回答，直接给结论与依据。',
      },
      { role: 'user', content: contextLines.join('\n') },
      ...history,
    ]
    const content = (await chatCompletion(resolved.channel, messages, { maxTokens: 1024 })).trim()
    if (!content) throw new Error('模型返回空回答')

    const references: string[] = []
    if (focusFinding) references.push(focusFinding.id, ...focusFinding.ruleItemIds)
    // 粗引用：回答中出现的案卷实体 ID 直接收进 references（不伪造，只收集真实存在者）
    const knownIds = new Set<string>([
      ...reviewCase.items.map((item) => item.id),
      ...reviewCase.rulePacks.map((pack) => pack.id),
      ...reviewCase.rulePacks.flatMap((pack) => pack.outline.map((rule) => rule.id)),
      ...reviewCase.evidences.map((evidence) => evidence.documentId),
    ])
    for (const id of knownIds) {
      if (content.includes(id)) references.push(id)
    }

    console.log('[审核专区] 助手回答成功（真实模型路径）')
    return { content, references: [...new Set(references)], degraded: false }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.warn(`[审核专区] 助手回答降级: ${message}；返回静态解答`)
    return staticAssistantAnswer(reviewCase, request, focusFinding)
  }
}
