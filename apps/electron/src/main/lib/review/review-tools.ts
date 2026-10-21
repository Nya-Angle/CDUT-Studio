/**
 * 审核业务工具集（M3，设计 03 §5 Agent 工具与受控执行 + §2 复用边界）
 *
 * Pi 执行器只装配"本案业务工具"（不暴露通用文件/网络工具）；全部写入经由
 * 受控函数（Observation/EvidenceLink/CheckResult 追加），不直接写盘、不触碰主进程状态。
 * 工具边界：read 前缀为只读；record / link / submit 前缀为受控写入（返回新数组，由执行器决定持久化）。
 */

import type { CheckResult, EvidenceLink, FieldSpec, FieldValue, Observation, ReviewSubject, SourceRef, DocumentVersion, RuleSpec } from '@profer/shared'
import { buildEvidenceLinks, recordObservation } from './evidence-service'
import { DocumentCapabilityLibrary, type DocumentCapabilityEvent } from './document-capability-library'

/** 工具运行上下文：受控内存态（执行器持引用，持久化在 checkpoint 完成时统一处理） */
export interface ReviewToolContext {
  caseId: string
  subjects: ReviewSubject[]
  documents: DocumentVersion[]
  rules: RuleSpec[]
  fields?: FieldSpec[]
  caseFields?: Record<string, FieldValue>
  observations: Observation[]
  evidenceLinks: EvidenceLink[]
  results: CheckResult[]
  actor: string
  caseRoot?: string
  documentCapabilities?: DocumentCapabilityLibrary
  onCapabilityEvent?: (event: DocumentCapabilityEvent) => void
  inspectDocumentImage?: (input: { documentVersionId: string; fileName: string; blockId: string; dataUrl: string; question: string }) => Promise<string>
}

export interface ReviewTool {
  name: string
  description: string
  /** 输入摘要（Prompt 可见；真实 schema 由执行器校验） */
  input: string
  execute(input: Record<string, unknown>): Promise<{ ok: true; data: unknown } | { ok: false; error: string }>
}

function findSubject(context: ReviewToolContext, subjectId: string): ReviewSubject | undefined {
  return context.subjects.find((subject) => subject.id === subjectId)
}

function numericValueOccursInQuote(value: number, quote: string): boolean {
  const normalized = (candidate: string): string => candidate.replace(/[，,\s￥¥元]/g, '').replace(/\.0+$/, '')
  const wanted = normalized(String(value))
  const candidates = quote.match(/-?\d+(?:[,.，]\d{3})*(?:\.\d+)?/g) ?? []
  return candidates.some((candidate) => normalized(candidate) === wanted)
}

function fieldPayload(value: FieldValue | undefined): unknown {
  if (value === undefined) return undefined
  return 'value' in value ? value.value : value.documentVersionId
}

function crossSectionDuplicateSubjects(context: ReviewToolContext, rule: RuleSpec, subjectIds: string[]): string[] {
  if (rule.targetScope !== 'group' || !/重复/.test(rule.requirement) || !/确认/.test(rule.requirement)) return []
  const selected = context.subjects.filter((subject) => subjectIds.includes(subject.id))
  if (selected.length === 0) return []
  const selectedSections = new Set(selected.map((subject) => subject.sectionId).filter((value): value is string => !!value))
  const identityFields = (context.fields ?? []).filter((field) =>
    /(?:成果|奖项|项目|作品|achievement|award|project|work).*(?:名称|name|title)|(?:名称|name|title).*(?:成果|奖项|项目|作品|achievement|award|project|work)/i.test(`${field.key} ${field.label}`),
  )
  if (identityFields.length === 0) return []
  const duplicateIds = new Set<string>()
  for (const field of identityFields) {
    const selectedValues = new Set(selected.map((subject) => fieldPayload(subject.fields[field.key])).filter((value): value is string => typeof value === 'string' && value.trim().length >= 3).map((value) => value.trim().toLocaleLowerCase()))
    if (selectedValues.size === 0) continue
    for (const subject of context.subjects) {
      if (subjectIds.includes(subject.id) || (subject.sectionId && selectedSections.has(subject.sectionId))) continue
      const value = fieldPayload(subject.fields[field.key])
      if (typeof value === 'string' && selectedValues.has(value.trim().toLocaleLowerCase())) duplicateIds.add(subject.id)
    }
  }
  return [...duplicateIds]
}

function latestObservation(context: ReviewToolContext, subjectId: string, fieldKey: string): Observation[] {
  return context.observations.filter((observation) => observation.subjectId === subjectId && observation.fieldKey === fieldKey)
}

/** 与覆盖账本相同的规则+目标键，用来判定计划检查是否确实全部提交。 */
export function reviewCheckToolKey(ruleId: string, scope: string, subjectIds: string[]): string {
  return `check:${ruleId}::${scope}::${[...subjectIds].sort().join(',')}`
}

/** 装配本案业务工具（Pi 执行器在 run 开始时调用；工具集固定，不随 Prompt 变化） */
export function buildReviewTools(context: ReviewToolContext): ReviewTool[] {
  const documentCapabilities = context.documentCapabilities ?? new DocumentCapabilityLibrary({
    caseId: context.caseId,
    caseRoot: context.caseRoot ?? '',
    documents: context.documents,
    onActivity: context.onCapabilityEvent,
  })
  const ref = (documentVersionId: string, blockId?: string, quote?: string): SourceRef | undefined => {
    const document = context.documents.find((candidate) => candidate.versionId === documentVersionId)
    if (!document) return undefined
    const block = blockId ? document.blocks.find((candidate) => candidate.blockId === blockId) : undefined
    if (blockId && !block) return undefined
    if (block?.kind === 'image' && quote) return undefined
    if (block && quote && block.text && !block.text.includes(quote)) return undefined
    return {
      caseId: context.caseId,
      documentVersionId,
      parseRevision: document.parseRevision,
      location: block?.location ?? { kind: 'file' },
      ...(quote || block?.text ? { quote: (quote || block?.text || '').slice(0, 400) } : {}),
    }
  }
  const unreadRuleDocuments = (): DocumentVersion[] => context.documents.filter((document) =>
    document.active !== false && document.role === 'rule' && !documentCapabilities.isFullyRead(document.versionId),
  )

  const tools: ReviewTool[] = [
    {
      name: 'list_review_documents',
      description: '列出当前案卷中已激活材料的版本、用途、解析状态与错误、可读材料块数、表格工作表和图像页 blockId；解析失败的材料不会提供空占位块，应查看原件并按需补充。',
      input: '{ role? }',
      async execute(input) {
        const role = typeof input.role === 'string' ? input.role : undefined
        const documents = documentCapabilities.listDocuments().filter((document) => !role || document.role === role)
        context.onCapabilityEvent?.({ capability: 'list_review_documents', summary: `列出案卷材料（${documents.length} 份）` })
        return { ok: true, data: { documents } }
      },
    },
    {
      name: 'read_document',
      description: '按材料版本读取解析块，可按 blockId、Excel 工作表和行范围定位；返回可用于引用的原文及坐标。不传 blockIds 时读取完整材料。',
      input: '{ documentVersionId, blockIds?, offset?, limit?, sheetName?, fromRow?, toRow? }',
      async execute(input) {
        try {
          const documentVersionId = String(input.documentVersionId ?? '')
          if (!documentVersionId) return { ok: false, error: 'documentVersionId 不能为空' }
          const blockIds = Array.isArray(input.blockIds) ? input.blockIds.filter((item): item is string => typeof item === 'string').slice(0, 80) : undefined
          const result = documentCapabilities.read({
            documentVersionId,
            ...(blockIds?.length ? { blockIds } : {}),
            ...(Number.isInteger(input.offset) ? { offset: Number(input.offset) } : {}),
            ...(Number.isInteger(input.limit) ? { limit: Number(input.limit) } : {}),
            ...(typeof input.sheetName === 'string' ? { sheetName: input.sheetName } : {}),
            ...(Number.isInteger(input.fromRow) ? { fromRow: Number(input.fromRow) } : {}),
            ...(Number.isInteger(input.toRow) ? { toRow: Number(input.toRow) } : {}),
          })
          return { ok: true, data: result }
        } catch (error) {
          return { ok: false, error: error instanceof Error ? error.message : String(error) }
        }
      },
    },
    {
      name: 'read_documents',
      description: '一次读取多份已选材料（最多 8 份），适合同时核对规则文件与多个相关依据；每份可指定工作表/行范围，结果分别带原文、坐标和完整度。',
      input: '{ documents: Array<{ documentVersionId, blockIds?, offset?, limit?, sheetName?, fromRow?, toRow? }> }',
      async execute(input) {
        const rawDocuments = Array.isArray(input.documents) ? input.documents : []
        const documents = rawDocuments.slice(0, 8)
        if (documents.length === 0) return { ok: false, error: 'documents 必须包含至少一份材料' }
        const read = tools.find((tool) => tool.name === 'read_document')!
        const results = await Promise.all(documents.map(async (raw) => {
          if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return { ok: false, error: '材料读取项必须是对象' }
          return read.execute(raw as Record<string, unknown>)
        }))
        const acceptedCount = results.filter((result) => result.ok).length
        return { ok: true, data: { results, submittedCount: documents.length, notProcessedCount: Math.max(0, rawDocuments.length - documents.length), acceptedCount, rejectedCount: results.length - acceptedCount } }
      },
    },
    {
      name: 'inspect_document_image',
      description: '只把指定材料版本中的一个图像 block 交给多模态模型核对；返回识别文字和图像事实，并关联原图块。',
      input: '{ documentVersionId, blockId, question }',
      async execute(input) {
        const documentVersionId = String(input.documentVersionId ?? '')
        const blockId = String(input.blockId ?? '')
        const question = String(input.question ?? '').trim().slice(0, 1000)
        if (!documentVersionId || !blockId || !question) return { ok: false, error: 'documentVersionId、blockId 和 question 均为必填项' }
        if (!context.inspectDocumentImage) return { ok: false, error: '当前审核会话未配置图像核对能力；需人工检查原图' }
        try {
          const attachment = documentCapabilities.loadImage(documentVersionId, blockId)
          const text = await context.inspectDocumentImage({ ...attachment, question })
          const document = context.documents.find((candidate) => candidate.versionId === documentVersionId)
          const imageBlock = document?.blocks.find((candidate) => candidate.blockId === blockId && candidate.kind === 'image')
          if (!document || !imageBlock) return { ok: false, error: '图像块在核对后已无法定位' }
          const visionBlockId = `vision-${blockId}`
          const previous = document.blocks.find((candidate) => candidate.blockId === visionBlockId)
          const visionBlock = {
            blockId: visionBlockId,
            kind: 'text' as const,
            format: 'vision-text' as const,
            text,
            location: imageBlock.location ?? { kind: 'file' as const },
            vision: { imageBlockId: blockId, engine: '项目 Pi 审核 Agent' },
          }
          if (previous) Object.assign(previous, visionBlock)
          else document.blocks.push(visionBlock)
          documentCapabilities.markImageRead(documentVersionId, blockId)
          documentCapabilities.read({ documentVersionId, blockIds: [visionBlockId], limit: 1 })
          return { ok: true, data: { documentVersionId, fileName: attachment.fileName, imageBlockId: blockId, textBlockId: visionBlockId, location: attachment.location ?? { kind: 'file' }, text } }
        } catch (error) {
          return { ok: false, error: error instanceof Error ? error.message : String(error) }
        }
      },
    },
    {
      name: 'read_subject_field',
      description: '读取指定主体的字段当前值（含确认态），缺失返回 unknown 而不是空串',
      input: '{ subjectId, fieldKey }',
      async execute(input) {
        const subjectId = String(input.subjectId ?? '')
        const fieldKey = String(input.fieldKey ?? '')
        const fieldSpec = context.fields?.find((candidate) => candidate.key === fieldKey)
        if (subjectId === context.caseId && fieldSpec?.scope === 'case') {
          const observations = latestObservation(context, subjectId, fieldKey)
          const value = observations.find((item) => item.extractedBy === 'user' && item.confirmed)?.value
            ?? observations.find((item) => item.extractedBy === 'user')?.value
            ?? context.caseFields?.[fieldKey]
            ?? observations.findLast((item) => item.extractedBy !== 'user')?.value
          return { ok: true, data: value === undefined ? { known: false, value: null } : { known: true, value: fieldPayload(value), kind: value.kind } }
        }
        const subject = findSubject(context, subjectId)
        if (!subject) return { ok: false, error: `主体不存在: ${subjectId}` }
        const observations = latestObservation(context, subjectId, fieldKey)
        const value = observations.find((item) => item.extractedBy === 'user' && item.confirmed)?.value
          ?? observations.find((item) => item.extractedBy === 'user')?.value
          ?? subject.fields[fieldKey]
          ?? observations.findLast((item) => item.extractedBy !== 'user')?.value
        return {
          ok: true,
          data: value === undefined ? { known: false, value: null } : { known: true, value: fieldPayload(value), kind: value.kind },
        }
      },
    },
    {
      name: 'search_document_text',
      description: '在案卷文档（依据/待审/证明）中按关键词检索文本块，返回 documentId/blockId/文本（供引用）',
      input: '{ keyword, role? }',
      async execute(input) {
        const keyword = String(input.keyword ?? '')
        const role = input.role as string | undefined
        const offset = Number.isInteger(input.offset) ? Math.max(0, Number(input.offset)) : 0
        if (!keyword) return { ok: false, error: 'keyword 不能为空' }
        const page = documentCapabilities.search({ keyword, role: role as DocumentVersion['role'] | undefined, offset, limit: 50 })
        context.onCapabilityEvent?.({ capability: 'search_document_text', summary: `检索案卷材料（命中 ${page.totalHits} 块）` })
        return { ok: true, data: { ...page, hitsReturned: page.hits.length, truncated: page.nextOffset !== null } }
      },
    },
    {
      name: 'read_rule',
      description: '读取指定审核规则的要求、执行方式、作用范围、确认状态和适用期限；不存在或未确认规则不得推断为自动通过',
      input: '{ ruleId }',
      async execute(input) {
        const rule = context.rules.find((candidate) => candidate.id === String(input.ruleId ?? ''))
        if (!rule) return { ok: false, error: `规则不存在: ${String(input.ruleId ?? '')}` }
        return { ok: true, data: { id: rule.id, title: rule.title, requirement: rule.requirement, execution: rule.execution, targetScope: rule.targetScope, sectionId: rule.sectionId ?? null, confirmation: rule.confirmation, effectiveFrom: rule.effectiveFrom ?? null, effectiveUntil: rule.effectiveUntil ?? null, onFail: rule.onFail, onUnknown: rule.onUnknown } }
      },
    },
    {
      name: 'record_observation',
      description: '记录从材料提取的事实（受控写入；人工确认值不被覆盖，生成 supersedes 链）',
      input: '{ subjectId, fieldKey, kind, value, documentVersionId }',
      async execute(input) {
        const subjectId = String(input.subjectId ?? '')
        const fieldKey = String(input.fieldKey ?? '')
        const fieldSpec = context.fields?.find((candidate) => candidate.key === fieldKey)
        if (context.fields && !fieldSpec) return { ok: false, error: `字段不在模板中: ${fieldKey}` }
        const isCaseField = fieldSpec?.scope === 'case'
        const subject = isCaseField && subjectId === context.caseId ? undefined : findSubject(context, subjectId)
        if (isCaseField ? subjectId !== context.caseId : !subject) return { ok: false, error: `事实目标不存在或字段作用域不匹配: ${subjectId}` }
        if (fieldSpec && !isCaseField && (fieldSpec.scope ?? 'subject') !== 'subject') return { ok: false, error: `字段不是事项字段: ${fieldKey}` }
        if (fieldSpec?.sectionId && fieldSpec.sectionId !== subject?.sectionId) return { ok: false, error: `字段 ${fieldKey} 不属于分项 ${subject?.sectionId ?? '(未分项)'}` }
        const kind = String(input.kind ?? fieldSpec?.kind ?? 'text') as FieldValue['kind']
        if (fieldSpec && fieldSpec.kind !== kind) return { ok: false, error: `字段 ${fieldKey} 类型不匹配: 需要 ${fieldSpec.kind}` }
        const rawValue = input.value
        const documentVersionId = String(input.documentVersionId ?? '')
        const blockId = typeof input.blockId === 'string' ? input.blockId : undefined
        const quote = typeof input.quote === 'string' ? input.quote : undefined
        const sourceRef = ref(documentVersionId, blockId, quote)
        if (!sourceRef) return { ok: false, error: `材料版本或引用块不存在，或引用内容与原文不一致: ${documentVersionId}${blockId ? `/${blockId}` : ''}` }
        if (!blockId) return { ok: false, error: '记录审核事实必须引用材料块 blockId；请先搜索材料或定位图像页' }
        if (!quote?.trim()) return { ok: false, error: '记录审核事实必须附带可核验的原文 quote' }
        let value: FieldValue
        if (kind === 'number') {
          const number = typeof rawValue === 'number' ? rawValue : Number(rawValue)
          if (!Number.isFinite(number)) return { ok: false, error: `数字字段 ${fieldKey} 的值无效` }
          if (!numericValueOccursInQuote(number, quote)) return { ok: false, error: `数字 ${number} 不在引用原文中，不能记录为材料事实` }
          value = { kind, value: number, ...(fieldSpec?.unit ? { unit: fieldSpec.unit } : {}) }
        } else if (kind === 'boolean') {
          if (typeof rawValue !== 'boolean') return { ok: false, error: `布尔字段 ${fieldKey} 必须提交 true/false` }
          value = { kind, value: rawValue }
        } else if (kind === 'multi') {
          if (!Array.isArray(rawValue) || rawValue.some((item) => typeof item !== 'string')) return { ok: false, error: `多选字段 ${fieldKey} 必须是字符串列表` }
          value = { kind, value: rawValue as string[] }
        } else if (kind === 'text' || kind === 'date' || kind === 'enum') {
          if (typeof rawValue !== 'string') return { ok: false, error: `字段 ${fieldKey} 必须提交文本` }
          value = { kind, value: rawValue }
        } else {
          return { ok: false, error: `暂不支持由 Agent 抽取 ${kind} 类型字段` }
        }
        const updated = recordObservation(context.observations, {
          subjectId: isCaseField ? context.caseId : subjectId,
          fieldKey,
          value,
          sourceRefs: [sourceRef],
          extractedBy: 'ai',
        })
        context.observations.length = 0
        context.observations.push(...updated)
        return { ok: true, data: { recorded: true, subjectId, fieldKey, sourceRef, observations: updated.length, toolKey: `observation:${subjectId}::${fieldKey}` } }
      },
    },
    {
      name: 'link_evidence',
      description: '把证明材料绑定到主体事实（candidate；人工确认走命令信封）',
      input: '{ documentVersionId, subjectIds, supportsFact }',
      async execute(input) {
        const documentVersionId = String(input.documentVersionId ?? '')
        if (!context.documents.some((document) => document.versionId === documentVersionId)) return { ok: false, error: `材料版本不存在: ${documentVersionId}` }
        const subjectIds = Array.isArray(input.subjectIds) ? (input.subjectIds as string[]) : []
        const missingSubject = subjectIds.find((subjectId) => !findSubject(context, subjectId))
        if (missingSubject) return { ok: false, error: `主体不存在: ${missingSubject}` }
        const updated = buildEvidenceLinks(context.evidenceLinks, {
          documentVersionId,
          subjectIds,
          supportsFact: String(input.supportsFact ?? ''),
          linkedBy: 'ai',
        })
        context.evidenceLinks.length = 0
        context.evidenceLinks.push(...updated)
        return { ok: true, data: { links: updated.length } }
      },
    },
    {
      name: 'submit_check',
      description: '提交确定性检查结果（组级计分走确定引擎，语义/人工检查附理由；不直接写盘）',
      input: '{ ruleId, scope, subjectIds, status, reason, detailLines? }',
      async execute(input) {
        const rule = context.rules.find((candidate) => candidate.id === String(input.ruleId ?? ''))
        if (!rule) return { ok: false, error: `规则不存在: ${String(input.ruleId)}` }
        if (rule.execution !== 'semantic') return { ok: false, error: `规则 ${rule.id} 由 ${rule.execution} 执行器处理，Agent 不得覆盖` }
        const scope = String(input.scope ?? rule.targetScope)
        if (scope !== rule.targetScope) return { ok: false, error: `规则 ${rule.id} 的目标范围必须为 ${rule.targetScope}` }
        const status = String(input.status ?? '') as CheckResult['status']
        if (!['compliant', 'non-compliant', 'awaiting-supplement', 'awaiting-confirmation', 'not-applicable'].includes(status)) {
          return { ok: false, error: `非法检查状态: ${status}` }
        }
        if (['compliant', 'non-compliant'].includes(status)) {
          const unread = unreadRuleDocuments()
          if (unread.length > 0) {
            return {
              ok: false,
              error: `确定结论前必须完整读取所有 role=rule 规则材料；尚未读完：${unread.map((document) => `${document.fileName}（${document.versionId}）`).join('、')}。请先用 read_documents/read_document 读取完整内容；图片页还需 inspect_document_image。`,
            }
          }
        }
        const subjectIds = Array.isArray(input.subjectIds) ? (input.subjectIds as string[]) : []
        if ((subjectIds.length === 0 && rule.targetScope === 'subject') || new Set(subjectIds).size !== subjectIds.length || subjectIds.some((subjectId) => !findSubject(context, subjectId))) return { ok: false, error: '检查主体列表为空、重复或包含未知事项' }
        if (rule.sectionId && subjectIds.some((subjectId) => findSubject(context, subjectId)?.sectionId !== rule.sectionId)) return { ok: false, error: `规则 ${rule.id} 不能检查其他分项的事项` }
        const duplicateSubjects = crossSectionDuplicateSubjects(context, rule, subjectIds)
        if (duplicateSubjects.length > 0 && !['awaiting-confirmation', 'awaiting-supplement'].includes(status)) {
          return { ok: false, error: `发现疑似同一成果跨分项重复申报（事项 ${duplicateSubjects.join('、')}）；该规则要求负责人确认，不能提交确定结论，请转 awaiting-confirmation。` }
        }
        const applicableIds = context.subjects.filter((subject) => !rule.sectionId || subject.sectionId === rule.sectionId).map((subject) => subject.id).sort()
        if (rule.targetScope !== 'subject' && JSON.stringify([...subjectIds].sort()) !== JSON.stringify(applicableIds)) return { ok: false, error: `规则 ${rule.id} 必须覆盖全部适用事项；期望 ${applicableIds.length} 项，收到 ${subjectIds.length} 项` }
        if (rule.targetScope === 'subject' && subjectIds.length !== 1) return { ok: false, error: '逐事项规则每次只能提交一个事项，避免部分事项被误记为完成' }
        const rawSourceRefs = Array.isArray(input.sourceRefs) ? input.sourceRefs : []
        if (['compliant', 'non-compliant'].includes(status) && rawSourceRefs.some((candidate) => !candidate || typeof candidate !== 'object' || typeof (candidate as { blockId?: unknown }).blockId !== 'string')) {
          return { ok: false, error: '符合/不符合结论必须引用具体材料块 blockId；整份文件级引用不能支撑自动结论' }
        }
        const sourceRefs = rawSourceRefs.flatMap((candidate) => {
          if (!candidate || typeof candidate !== 'object') return []
          const refValue = candidate as { documentVersionId?: unknown; blockId?: unknown; quote?: unknown }
          if (typeof refValue.documentVersionId !== 'string') return []
          const resolved = ref(refValue.documentVersionId, typeof refValue.blockId === 'string' ? refValue.blockId : undefined, typeof refValue.quote === 'string' ? refValue.quote : undefined)
          return resolved ? [resolved] : []
        })
        if (['compliant', 'non-compliant'].includes(status) && sourceRefs.length === 0) {
          return { ok: false, error: '符合/不符合结论必须引用至少一个真实材料块；否则应提交待人工确认或补件' }
        }
        if (sourceRefs.length !== rawSourceRefs.length) {
          return { ok: false, error: 'sourceRefs 含不存在的材料块或与原文不匹配的引用；请重新搜索并提交准确定位' }
        }
        if (['compliant', 'non-compliant'].includes(status) && sourceRefs.some((sourceRef) => {
          const doc = context.documents.find((candidate) => candidate.versionId === sourceRef.documentVersionId)
          const block = doc?.blocks.find((candidate) => candidate.location?.kind === sourceRef.location.kind && JSON.stringify(candidate.location) === JSON.stringify(sourceRef.location))
          return !block || (block.kind !== 'image' && (!sourceRef.quote || !block.text.includes(sourceRef.quote)))
        })) return { ok: false, error: '符合/不符合结论的引用缺少与原文匹配的短引文或图像页定位' }
        const result: CheckResult = {
          checkId: `check-${rule.id}-${rule.targetScope}-${[...subjectIds].sort().join('-') || 'case'}`,
          ruleId: rule.id,
          target: { scope: rule.targetScope, subjectIds },
          status,
          reason: String(input.reason ?? ''),
          sourceRefs,
          executedBy: 'semantic',
          executedAt: new Date().toISOString(),
        }
        const existing = context.results.findIndex((candidate) => candidate.checkId === result.checkId)
        if (existing >= 0) context.results[existing] = result
        else context.results.push(result)
        const toolKey = reviewCheckToolKey(rule.id, rule.targetScope, subjectIds)
        return { ok: true, data: { checkId: result.checkId, status: result.status, toolKey } }
      },
    },
  ]
  const byName = new Map(tools.map((tool) => [tool.name, tool]))
  const search = byName.get('search_document_text')!
  const record = byName.get('record_observation')!
  const submit = byName.get('submit_check')!
  tools.push(
    {
      name: 'search_document_text_batch',
      description: '一次按多个关键词检索材料块，返回带 documentVersionId/blockId 的命中；优先批量搜索，避免逐词重复调用。',
      input: '{ keywords: string[], role? }',
      async execute(input) {
        const rawKeywords = Array.isArray(input.keywords)
          ? [...new Set(input.keywords.filter((item): item is string => typeof item === 'string').map((item) => item.trim()).filter(Boolean))].slice(0, 32)
          : []
        const requestedCount = Array.isArray(input.keywords) ? [...new Set(input.keywords.filter((item): item is string => typeof item === 'string').map((item) => item.trim()).filter(Boolean))].length : 0
        const keywords = rawKeywords
        if (keywords.length === 0) return { ok: false, error: 'keywords 必须包含至少一个非空搜索词' }
        const role = typeof input.role === 'string' ? input.role : undefined
        const offset = Number.isInteger(input.offset) ? Math.max(0, Number(input.offset)) : 0
        const results = []
        for (const keyword of keywords) {
          const outcome = await search.execute({ keyword, role, offset })
          results.push({ keyword, ...outcome })
        }
        return { ok: true, data: { results, submittedCount: keywords.length, notProcessedCount: Math.max(0, requestedCount - keywords.length) } }
      },
    },
    {
      name: 'record_observations',
      description: '一次受控记录多条材料事实；每条都必须带真实 documentVersionId、blockId 和准确 quote。',
      input: '{ observations: Array<{ subjectId, fieldKey, kind, value, documentVersionId, blockId, quote? }> }',
      async execute(input) {
        const rawObservations = Array.isArray(input.observations) ? input.observations : []
        const observations = rawObservations.slice(0, 50)
        if (observations.length === 0) return { ok: false, error: 'observations 必须包含至少一条事实' }
        const results = []
        for (const observation of observations) {
          if (!observation || typeof observation !== 'object' || Array.isArray(observation)) {
            results.push({ ok: false, error: '事实必须是对象' })
            continue
          }
          results.push(await record.execute(observation as Record<string, unknown>))
        }
        const acceptedCount = results.filter((result) => result.ok).length
        return { ok: true, data: { results, submittedCount: observations.length, notProcessedCount: Math.max(0, rawObservations.length - observations.length), acceptedCount, rejectedCount: results.length - acceptedCount } }
      },
    },
    {
      name: 'submit_checks',
      description: '一次受控提交多条规则检查；每条语义符合/不符合结论都须附真实材料块引用。',
      input: '{ checks: Array<{ ruleId, scope?, subjectIds, status, reason, detailLines?, sourceRefs? }> }',
      async execute(input) {
        const rawChecks = Array.isArray(input.checks) ? input.checks : []
        const checks = rawChecks.slice(0, 50)
        if (checks.length === 0) return { ok: false, error: 'checks 必须包含至少一项检查' }
        const results = []
        for (const check of checks) {
          if (!check || typeof check !== 'object' || Array.isArray(check)) {
            results.push({ ok: false, error: '检查项必须是对象' })
            continue
          }
          results.push(await submit.execute(check as Record<string, unknown>))
        }
        const acceptedCount = results.filter((result) => result.ok).length
        const toolKeys = results.flatMap((result) => {
          if (!('data' in result) || !result.data || typeof result.data !== 'object') return []
          const toolKey = (result.data as { toolKey?: unknown }).toolKey
          return typeof toolKey === 'string' ? [toolKey] : []
        })
        return { ok: true, data: { results, toolKeys, submittedCount: checks.length, notProcessedCount: Math.max(0, rawChecks.length - checks.length), acceptedCount, rejectedCount: results.length - acceptedCount } }
      },
    },
  )
  return tools
}
