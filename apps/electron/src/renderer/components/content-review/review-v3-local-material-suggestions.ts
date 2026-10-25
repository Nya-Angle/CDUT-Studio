import { reviewV3SlotAcceptsFile } from '@profer/shared'
import type { DocumentVersion, MaterialSlotSpec } from '@profer/shared'

export type MaterialRole = DocumentVersion['role']
export interface MaterialClassificationSuggestion {
  documentVersionId: string
  role: MaterialRole
  materialSlotId?: string
  reason: string
}

type Material = Pick<DocumentVersion, 'versionId' | 'fileName' | 'role' | 'materialSlotId' | 'blocks'>

/**
 * 模板绑定后的本机预分拣：只给建议，不改动原件或案卷，不请求外部模型。
 * 必须有明确且唯一的名称/要素证据才建议槽位；歧义和超额都留给用户确认。
 */
export function suggestLocalMaterialClassification(
  documents: readonly Material[], slots: readonly MaterialSlotSpec[],
): MaterialClassificationSuggestion[] {
  const occupied = new Map<string, number>()
  const selected = new Map<string, { slot: MaterialSlotSpec; role: MaterialRole }>()
  // 人工已确认且仍适用的槽位优先保留，不能让文件名打分挤占它的容量。
  for (const document of documents) {
    const existing = slots.find((slot) => slot.id === document.materialSlotId)
    if (!existing || !reviewV3SlotAcceptsFile(existing, document.fileName)
      || (existing.acceptedRoles?.length && !existing.acceptedRoles.includes(document.role))) continue
    selected.set(document.versionId, { slot: existing, role: document.role })
    occupied.set(existing.id, (occupied.get(existing.id) ?? 0) + 1)
  }
  const candidates = documents.map((document) => {
    if (selected.has(document.versionId)) return { document, best: undefined }
    const name = document.fileName.replace(/\.[^.]+$/, '').toLowerCase()
    const body = document.blocks.map((block) => block.kind === 'image'
      ? (block.imageAlt ?? '') : block.text).filter(Boolean).join('\n').slice(0, 4000).toLowerCase()
    const matches = slots.flatMap((slot) => {
      if (slot.maxCount < 1 || !reviewV3SlotAcceptsFile(slot, document.fileName)) return []
      const allowed = slot.acceptedRoles
      const role = allowed?.length === 1 ? allowed[0]
        : allowed?.includes(document.role) ? document.role
          : allowed?.length ? null : document.role
      if (!role) return []
      const core = slot.name.trim().toLowerCase()
      let score = core.length >= 2 && name.includes(core) ? 8 : 0
      if (core.length >= 2 && body.includes(core)) score += 4
      for (const element of slot.requiredElements) {
        const phrase = element.trim().toLowerCase()
        if (phrase.length < 3 || phrase.length > 40) continue
        if (name.includes(phrase)) score += 3
        else if (body.includes(phrase)) score += 1
      }
      return score >= 4 ? [{ slot, role, score }] : []
    }).sort((a, b) => b.score - a.score || a.slot.id.localeCompare(b.slot.id))
    // 分差过小的多个槽位不应由本机猜测成确定归属。
    const best = matches[0] && (matches.length === 1 || matches[0].score - matches[1]!.score >= 3)
      ? matches[0] : undefined
    return { document, best }
  })

  // 相同槽位多份候选优先保留证据更强的一份，其他材料保持待确认。
  for (const candidate of [...candidates].sort((a, b) =>
    (b.best?.score ?? 0) - (a.best?.score ?? 0)
      || a.document.versionId.localeCompare(b.document.versionId))) {
    if (!candidate.best) continue
    const { slot, role } = candidate.best
    if ((occupied.get(slot.id) ?? 0) >= slot.maxCount) continue
    occupied.set(slot.id, (occupied.get(slot.id) ?? 0) + 1)
    selected.set(candidate.document.versionId, { slot, role })
  }
  return documents.map((document) => {
    const match = selected.get(document.versionId)
    return match ? {
      documentVersionId: document.versionId, role: match.role,
      materialSlotId: match.slot.id,
      reason: `本机按文件名/解析要素匹配「${match.slot.name}」，请核对适用事项与原件。`,
    } : {
      documentVersionId: document.versionId, role: document.role,
      ...(document.materialSlotId ? { materialSlotId: document.materialSlotId } : {}),
      reason: '未找到唯一且未超额的模板槽位，保留当前类别，需人工核对。',
    }
  })
}

/** 建议只能用于生成时同一案卷、模板、修订号和原件版本。 */
export function classificationSnapshotKey(aggregate: Pick<{
  caseV2: { id: string; revision: number; templateId: string; templateVersion: number;
    documents: Array<Pick<DocumentVersion, 'versionId' | 'active' | 'role' | 'materialSlotId'>> }
}, 'caseV2'>): string {
  const current = aggregate.caseV2
  return JSON.stringify([
    current.id, current.revision, current.templateId, current.templateVersion,
    current.documents.filter((doc) => doc.active !== false)
      .map((doc) => [doc.versionId, doc.role, doc.materialSlotId ?? '']).sort((a, b) =>
        String(a[0]).localeCompare(String(b[0]))),
  ])
}
