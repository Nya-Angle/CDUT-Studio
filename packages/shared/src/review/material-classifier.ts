/**
 * 材料归类的纯本地候选器。绝不发起模型请求，也不写入 Case/Run。
 *
 * 模板选择前只预测三种材料角色；选定模板后再对当前版本的槽位排序。
 * 分数是检索相关度（不是概率）；不明确时必须返回待确认。
 */
import type { MaterialSlotSpec, TemplateVersion } from '../types/review-v2'
import { reviewV3SlotAcceptsFile } from '../types/review-v3-template-routing'

// SourceDocument 属于 V1 兼容投影，此处使用结构输入以适配 V2 的原生块。
export type MaterialRole = 'rule' | 'application' | 'evidence'

export interface ClassificationDocument {
  fileName: string
  mimeType?: string
  byteHash?: string
  parseStatus?: 'pending' | 'parsed' | 'partial' | 'failed'
  blocks: ReadonlyArray<{ text: string; kind?: string; format?: string }>
  classificationCorrection?: { role: MaterialRole; materialSlotId?: string | null; at: string }
}

export interface ClassificationExample {
  byteHash?: string
  classificationCorrection?: { role: MaterialRole; materialSlotId?: string | null; at: string }
}

export interface MaterialClassificationCandidate {
  role: MaterialRole
  slotId?: string
  slotName?: string
  /** 未校准的相关度分数；不可当作概率使用。 */
  score: number
  reasons: string[]
}

export interface MaterialClassification {
  status: 'manual-confirmed' | 'high' | 'ambiguous' | 'needs-ocr' | 'unknown'
  candidates: MaterialClassificationCandidate[]
  source: 'manual' | 'same-byte-confirmation' | 'local-rules' | 'unresolved'
  /** 真实命中文本片段，供 UI 解释与后续受限 AI 兜底使用。 */
  excerpts: string[]
}

/** 用户明确触发的现有本地 OCR 分类试算；不会修改原件或案卷解析块。 */
export interface MaterialOcrClassification {
  status: 'recognized' | 'unavailable' | 'failed'
  message: string
  /** Main 读取的真实来源版本，UI 不得把旧版本的建议应用到新原件。 */
  documentVersionId?: string
  engine?: string
  recognizedChars?: number
  classification?: MaterialClassification
}

export interface MaterialClassificationInput {
  document: ClassificationDocument
  template?: Pick<TemplateVersion, 'materialSlots'> | null
  /** 只允许调用方传入同一案卷、同一业务范围的历史人工确认。 */
  confirmedExamples?: ReadonlyArray<ClassificationExample>
}

const ROLE_HINTS: Record<MaterialRole, ReadonlyArray<{ phrase: string; weight: number }>> = {
  rule: [
    { phrase: '管理办法', weight: 7 }, { phrase: '实施办法', weight: 7 },
    { phrase: '评选细则', weight: 7 }, { phrase: '审核依据', weight: 7 },
    { phrase: '实施细则', weight: 7 }, { phrase: '评审标准', weight: 6 },
    { phrase: '工作通知', weight: 5 }, { phrase: '申请条件', weight: 2 },
    { phrase: '适用范围', weight: 3 }, { phrase: '第一条', weight: 3 },
    { phrase: '申报通知', weight: 5 },
  ],
  application: [
    { phrase: '申请表', weight: 8 }, { phrase: '申报表', weight: 8 },
    { phrase: '申请书', weight: 7 }, { phrase: '申报书', weight: 7 },
    { phrase: '申报事项', weight: 6 }, { phrase: '本人申请', weight: 5 },
    { phrase: '申请人', weight: 3 }, { phrase: '申请理由', weight: 4 },
    { phrase: '申请项目', weight: 4 }, { phrase: '申请单位', weight: 3 },
  ],
  evidence: [
    { phrase: '获奖证书', weight: 9 }, { phrase: '荣誉证书', weight: 9 },
    { phrase: '成绩单', weight: 9 }, { phrase: '学籍证明', weight: 8 },
    { phrase: '竞赛证书', weight: 8 }, { phrase: '证明材料', weight: 6 },
    { phrase: '兹证明', weight: 7 }, { phrase: '特此证明', weight: 6 },
    { phrase: '获奖等级', weight: 5 }, { phrase: '颁发单位', weight: 5 },
    { phrase: '验收报告', weight: 6 }, { phrase: '检验报告', weight: 6 },
  ],
}

/**
 * 强文件名线索：只收录语义明确的具体材料名（不做“含表即申报”这类泛化）。
 * 命中仅表示该材料“角色”可判；正文事实仍需 OCR/阅读，不能据此宣称已识读内容。
 */
const FILENAME_ROLE_CUES: Record<MaterialRole, ReadonlyArray<string>> = {
  application: [
    '申请材料目录', '申请表', '申报表', '实施方案', '人员名单', '参加人员名单',
    '风险评估表', '设备使用与操作人员清单', '设备使用与操作人员', '预算明细', '活动预算',
    '采购申请', '指导教师与现场负责人说明', '现场负责人说明', '应急联系人表',
    '活动介绍演示稿', '活动介绍', '场地平面布置图', '值守排班表',
  ],
  evidence: [
    '承诺书', '培训完成情况', '场地预约确认单', '审批意见', '供应商报价单',
    '保险凭证', '意外险凭证', '安全告知书签收汇总', '签收汇总', '宣传海报', '操作培训记录',
    '变更沟通记录', '年度活动总结', '活动总结',
  ],
  rule: ['实验室准入须知', '准入须知', '管理办法', '实施细则', '评审标准', '申报通知'],
}

const ROLES: readonly MaterialRole[] = ['application', 'evidence', 'rule']

/** 标题（去扩展名/标点）中的强线索；每个线索只归属一个角色。 */
function filenameRoleCues(compactTitle: string): Array<{ role: MaterialRole; phrase: string }> {
  const matched: Array<{ role: MaterialRole; phrase: string }> = []
  for (const role of ROLES) {
    for (const phrase of FILENAME_ROLE_CUES[role]) {
      if (compactTitle.includes(compact(phrase))) matched.push({ role, phrase })
    }
  }
  return matched
}

const compact = (value: string): string => value.normalize('NFKC').toLowerCase().replace(/[\s\p{P}\p{S}]+/gu, '')

/**
 * 仅把可互换的具体材料名称当作同义词；不要泛化“证明/证书/材料”等通用词，
 * 否则会把不同业务的证明文件强行塞进同一个必需槽位。
 * 含前后缀的业务专属槽位仍交由模板 classificationHints 或后续短 AI 判断。
 */
const EXACT_SLOT_SYNONYM_GROUPS: readonly (readonly string[])[] = [
  ['荣誉证书', '获奖证书'],
]

function slotAliases(slot: MaterialSlotSpec): string[] {
  const canonicalName = compact(slot.name)
  const derived = EXACT_SLOT_SYNONYM_GROUPS.flatMap(group =>
    group.some(term => compact(term) === canonicalName)
      ? group.filter(term => compact(term) !== canonicalName) : [])
  return [...new Set([...(slot.classificationHints?.aliases ?? []), ...derived])]
}

function compatibleSlots(
  document: ClassificationDocument,
  slots: ReadonlyArray<MaterialSlotSpec>,
  role: MaterialRole,
): MaterialSlotSpec[] {
  return slots.filter(slot => reviewV3SlotAcceptsFile(slot, document.fileName)
    && (!slot.acceptedRoles?.length || slot.acceptedRoles.includes(role)))
}

/** 中文双字词 + 英数词；数值和常见单字不能单独决定材料类型。 */
function terms(raw: string): string[] {
  const text = raw.normalize('NFKC').toLowerCase()
  const output: string[] = []
  for (const part of text.match(/[\p{Script=Han}]+|[a-z][a-z0-9_-]{1,}/gu) ?? []) {
    if (/^[\p{Script=Han}]+$/u.test(part)) {
      for (let i = 0; i < part.length - 1; i += 1) output.push(part.slice(i, i + 2))
    } else output.push(part)
  }
  return output
}

function isHeading(block: ClassificationDocument['blocks'][number]): boolean {
  return block.kind === 'heading' || block.format === 'heading' || block.kind === 'table-cell' || block.format === 'table-cell'
}

function docZones(document: ClassificationDocument): { title: string; headings: string; body: string; excerpts: string[] } {
  const title = compact(document.fileName.replace(/\.[^.]+$/, ''))
  const meaningful = document.blocks.filter(block => typeof block.text === 'string' && block.text.trim())
  const headers = meaningful.filter(isHeading).slice(0, 20)
  // 前页/首段通常足以归类，限制文本量避免超长表格拖慢每次 UI 回读。
  const body = meaningful.slice(0, 100).map(block => block.text).join(' ').slice(0, 6000)
  return { title, headings: compact(headers.map(block => block.text).join(' ').slice(0, 2400)),
    body: compact(body), excerpts: meaningful.slice(0, 4).map(block => block.text.slice(0, 160)) }
}

function roleEvidence(zones: ReturnType<typeof docZones>): MaterialClassificationCandidate[] {
  const cues = filenameRoleCues(zones.title)
  return ROLES.map(role => {
    let score = 0
    const reasons: string[] = []
    for (const cue of cues.filter(item => item.role === role)) {
      // 强文件名线索权重高于普通词组命中，使角色可独立达到 high 阈值。
      score += 20
      reasons.push(`文件名明确为“${cue.phrase}”`)
    }
    for (const hint of ROLE_HINTS[role]) {
      const phrase = compact(hint.phrase)
      if (zones.title.includes(phrase)) {
        score += hint.weight * 2.4
        reasons.push(`文件名包含“${hint.phrase}”`)
      } else if (zones.headings.includes(phrase)) {
        score += hint.weight * 1.7
        reasons.push(`标题或表头包含“${hint.phrase}”`)
      } else if (zones.body.includes(phrase)) {
        score += hint.weight * 0.65
        reasons.push(`正文包含“${hint.phrase}”`)
      }
    }
    return { role, score: Math.round(score * 100) / 100, reasons: reasons.slice(0, 4) }
  }).sort((a, b) => b.score - a.score)
}

/** 简短材料槽作为 BM25 文档，用户材料标题与关键段落作为查询。 */
function rankSlots(document: ClassificationDocument, slots: ReadonlyArray<MaterialSlotSpec>): Array<{ slot: MaterialSlotSpec; score: number; reasons: string[] }> {
  if (slots.length === 0) return []
  const zones = docZones(document)
  const profiles = slots.map(slot => [slot.name, slot.purpose, ...slot.requiredElements,
    ...slotAliases(slot), ...(slot.classificationHints?.positiveKeywords ?? []),
    ...(slot.classificationHints?.headerKeywords ?? [])].join(' '))
  const tokens = profiles.map(profile => terms(profile))
  const lengths = tokens.map(group => group.length)
  const avg = Math.max(1, lengths.reduce((sum, value) => sum + value, 0) / lengths.length)
  const df = new Map<string, number>()
  for (const group of tokens) for (const term of new Set(group)) df.set(term, (df.get(term) ?? 0) + 1)
  const weightedQuery = new Map<string, number>()
  for (const [text, weight] of [[zones.title, 3], [zones.headings, 2], [zones.body.slice(0, 2400), 0.35]] as const) {
    for (const term of new Set(terms(text))) weightedQuery.set(term, Math.max(weightedQuery.get(term) ?? 0, weight))
  }
  return slots.map((slot, index) => {
    const frequencies = new Map<string, number>()
    for (const term of tokens[index]!) frequencies.set(term, (frequencies.get(term) ?? 0) + 1)
    let bm25 = 0
    for (const [term, queryWeight] of weightedQuery) {
      const tf = frequencies.get(term) ?? 0
      if (!tf) continue
      const idf = Math.log(1 + (slots.length - (df.get(term) ?? 0) + 0.5) / ((df.get(term) ?? 0) + 0.5))
      bm25 += queryWeight * idf * (tf * 2.2) / (tf + 1.2 * (0.25 + 0.75 * lengths[index]! / avg))
    }
    // 通用词不能靠 BM25 的零散双字词命中就形成高置信建议。
    let score = Math.min(12, bm25 * 0.45)
    const reasons: string[] = []
    for (const phrase of [slot.name, ...slotAliases(slot)]) {
      const key = compact(phrase)
      if (key.length < 3) continue
      if (zones.title.includes(key)) { score += 14; reasons.push(`文件名匹配“${phrase}”`); break }
      if (zones.headings.includes(key)) { score += 10; reasons.push(`标题匹配“${phrase}”`); break }
    }
    for (const phrase of slot.classificationHints?.positiveKeywords ?? []) {
      const key = compact(phrase)
      if (key.length >= 2 && (zones.title.includes(key) || zones.headings.includes(key))) {
        score += 4; reasons.push(`命中特征“${phrase}”`)
      }
    }
    for (const phrase of slot.classificationHints?.negativeKeywords ?? []) {
      const key = compact(phrase)
      if (key.length >= 2 && (zones.title.includes(key) || zones.headings.includes(key))) {
        score -= 10; reasons.push(`排除特征“${phrase}”`)
      }
    }
    if (bm25 > 1 && reasons.length === 0) reasons.push('槽位名称、用途或关键要素与材料文字相关')
    return { slot, score: Math.round(score * 100) / 100, reasons: reasons.slice(0, 4) }
  }).sort((a, b) => b.score - a.score)
}

export function classifyMaterialLocally(input: MaterialClassificationInput): MaterialClassification {
  const { document } = input
  const zones = docZones(document)
  if (document.classificationCorrection) {
    const confirmedSlot = input.template?.materialSlots.find(slot =>
      slot.id === document.classificationCorrection?.materialSlotId)
    const slotCandidates = confirmedSlot ? [] : rankSlots(document,
      compatibleSlots(document, input.template?.materialSlots ?? [], document.classificationCorrection.role))
    const suggested = slotCandidates[0] && slotCandidates[0].score >= 8 &&
      slotCandidates[0].score - (slotCandidates[1]?.score ?? 0) >= 4 ? slotCandidates[0] : undefined
    return {
      status: 'manual-confirmed', source: 'manual', excerpts: zones.excerpts,
      candidates: [{ role: document.classificationCorrection.role,
        ...(confirmedSlot ? { slotId: confirmedSlot.id, slotName: confirmedSlot.name } :
          suggested ? { slotId: suggested.slot.id, slotName: suggested.slot.name } : {}),
        score: suggested?.score ?? 0,
        reasons: ['已确认的角色不会被覆盖', ...(suggested?.reasons ?? [])] }],
    }
  }
  if (document.byteHash) {
    const example = input.confirmedExamples?.find(candidate => candidate.byteHash === document.byteHash && candidate.classificationCorrection)
    if (example?.classificationCorrection) return {
      status: 'high', source: 'same-byte-confirmation', excerpts: zones.excerpts,
      candidates: [{ role: example.classificationCorrection.role,
        ...(input.template?.materialSlots.some(slot => slot.id === example.classificationCorrection?.materialSlotId)
          ? { slotId: example.classificationCorrection.materialSlotId! } : {}),
        score: 0, reasons: ['同一案卷相同原件已有人工确认记录'] }],
    }
  }
  // 无正文的图片/PDF：足够明确的文件名可先定“角色”；通用名仍交 OCR/后续兜底。
  const filenameCueMatched = filenameRoleCues(zones.title).length > 0
  if (!filenameCueMatched && zones.body.length === 0 && zones.headings.length === 0 &&
      (document.mimeType?.startsWith('image/') || document.parseStatus === 'partial' || document.parseStatus === 'failed')) {
    return { status: 'needs-ocr', source: 'unresolved', candidates: [], excerpts: [] }
  }
  const roles = roleEvidence(zones)
  const top = roles[0]!
  const runnerUp = roles[1]!
  const slots = rankSlots(document, compatibleSlots(document, input.template?.materialSlots ?? [], top.role))
  const eligibleSlot = slots[0] && slots[0].score >= 8 && slots[0].score - (slots[1]?.score ?? 0) >= 4 ? slots[0] : undefined
  const strongRole = top.score >= 12 && top.score - runnerUp.score >= 6
  const candidates = roles.filter(candidate => candidate.score > 0).slice(0, 3).map(candidate => ({ ...candidate,
    ...(candidate.role === top.role && eligibleSlot ? {
      slotId: eligibleSlot.slot.id, slotName: eligibleSlot.slot.name,
      score: Math.round((candidate.score + eligibleSlot.score) * 100) / 100,
      reasons: [...candidate.reasons, ...eligibleSlot.reasons].slice(0, 5),
    } : {}),
  }))
  return {
    status: candidates.length === 0 ? 'unknown' : strongRole ? 'high' : 'ambiguous',
    source: candidates.length === 0 ? 'unresolved' : 'local-rules',
    candidates,
    excerpts: zones.excerpts,
  }
}
