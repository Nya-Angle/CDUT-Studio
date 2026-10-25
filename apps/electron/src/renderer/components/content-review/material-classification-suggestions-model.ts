/**
 * 材料分类建议的纯函数模型：不接触 DOM、IPC 或案卷写入，便于独立测试。
 * 组件只负责交互；候选来自 shared 的本地分类器和用户显式请求的只读结果。
 */
import type {
  CaseAggregateV2, DocumentVersion, MaterialAiSuggestion, MaterialClassification,
  MaterialClassificationCandidate, MaterialOcrClassification, TemplateVersion,
} from '@profer/shared'
import { classifyMaterialLocally } from '@profer/shared'

export type ConfirmableRole = 'rule' | 'application' | 'evidence'

export interface Verdict {
  role: ConfirmableRole
  slotId?: string
  slotName?: string
  reasons: string[]
  origin: 'local' | 'ocr' | 'ai'
  rationale?: string
}

export interface AssistState {
  ocr?: MaterialOcrClassification
  ai?: MaterialAiSuggestion
}

export interface MaterialSuggestionRow {
  document: DocumentVersion
  local: MaterialClassification
  verdict?: Verdict
  /** 已提出但无法应用的候选（如模型未给出可验证类别）。 */
  note?: string
  needsOcr: boolean
}

export const ROLE_LABEL: Record<string, string> = {
  rule: '审核依据', application: '申报材料', evidence: '证明材料', attachment: '待分类附件',
}

export const roleLabel = (role: string): string => ROLE_LABEL[role] ?? '待分类附件'

export const isConfirmableRole = (role: string): role is ConfirmableRole =>
  role === 'rule' || role === 'application' || role === 'evidence'

const sameTarget = (document: DocumentVersion, role: string, slotId?: string): boolean =>
  document.role === role && (document.materialSlotId ?? '') === (slotId ?? '')

type ConfirmableCorrection = { role: ConfirmableRole; materialSlotId?: string | null; at: string }

/** 人工把材料确认为“其他附件”时不进入分类建议；其余确认只用于复用，不改写机器输出。 */
const confirmableCorrection = (document: DocumentVersion): ConfirmableCorrection | undefined =>
  document.classificationCorrection && document.classificationCorrection.role !== 'attachment'
    ? { ...document.classificationCorrection, role: document.classificationCorrection.role }
    : undefined

const asVerdict = (candidate: MaterialClassificationCandidate, origin: Verdict['origin']): Verdict => ({
  role: candidate.role,
  ...(candidate.slotId ? { slotId: candidate.slotId, slotName: candidate.slotName } : {}),
  reasons: candidate.reasons,
  origin,
})

/**
 * 由真实聚合、当前模板和显式请求结果生成待确认行。
 * 人工已确认的材料不提供模型改类入口；AI/OCR 只是候选，不能静默覆盖本地结果。
 */
export function buildMaterialSuggestionRows(
  aggregate: CaseAggregateV2,
  template: TemplateVersion | null,
  assist: Readonly<Record<string, AssistState>>,
): MaterialSuggestionRow[] {
  const confirmedExamples = aggregate.caseV2.documents
    .flatMap((document) => {
      const correction = confirmableCorrection(document)
      return document.byteHash && correction
        ? [{ byteHash: document.byteHash, classificationCorrection: correction }]
        : []
    })
  return aggregate.caseV2.documents
    .filter((document) => document.active !== false && document.classificationCorrection?.role !== 'attachment')
    .map((document) => {
      const correction = confirmableCorrection(document)
      const local = classifyMaterialLocally({
        document: {
          fileName: document.fileName,
          mimeType: document.mimeType,
          ...(document.byteHash ? { byteHash: document.byteHash } : {}),
          parseStatus: document.parseStatus === 'pending' ? 'partial' : document.parseStatus,
          blocks: document.blocks,
          ...(correction ? { classificationCorrection: correction } : {}),
        },
        template: template ? { materialSlots: template.materialSlots } : null,
        confirmedExamples,
      })
      const requested = assist[document.versionId]
      const ocrState = requested?.ocr
      const ocrClassification = ocrState?.status === 'recognized' ? ocrState.classification : undefined
      const ocrTop = ocrClassification?.candidates[0]
      const ai = requested?.ai
      let verdict: Verdict | undefined
      let note: string | undefined
      if (document.classificationCorrection) {
        // 人工确认优先：即使曾经请求过 AI，也不再把机器候选呈现为待应用建议。
        verdict = local.candidates[0] ? asVerdict(local.candidates[0], 'local') : undefined
      } else if (ai?.status === 'proposed' && ai.role && isConfirmableRole(ai.role)) {
        verdict = {
          role: ai.role,
          ...(ai.materialSlotId ? { slotId: ai.materialSlotId, slotName: ai.materialSlotName } : {}),
          reasons: [], origin: 'ai', rationale: ai.rationale,
        }
      } else if (ai?.status === 'unresolved') {
        note = ai.rationale
      } else if (ocrTop) {
        verdict = asVerdict(ocrTop, 'ocr')
      } else if (local.candidates[0]) {
        verdict = asVerdict(local.candidates[0], 'local')
      }
      return {
        document,
        local,
        ...(verdict ? { verdict } : {}),
        ...(note ? { note } : {}),
        needsOcr: ocrState?.status === 'failed' || ocrState?.status === 'unavailable'
          || (!ocrClassification && (local.status === 'needs-ocr' || document.parseStatus !== 'parsed')),
      }
    })
    .filter((row) => {
      if (row.note) return true
      if (row.local.status === 'needs-ocr' && !row.verdict) return true
      // 规则/槽位都不明确时也保留一行，自动流程才有机会继续 OCR/模型并如实交代结果。
      if (!row.verdict && (row.local.status === 'ambiguous' || row.local.status === 'unknown')) return true
      return !!row.verdict && !sameTarget(row.document, row.verdict.role, row.verdict.slotId)
    })
}
