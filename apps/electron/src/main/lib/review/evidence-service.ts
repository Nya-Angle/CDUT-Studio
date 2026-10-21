/**
 * 事实提取与证明绑定服务（M2，设计 03 §3 Observation/EvidenceLink）
 *
 * 原则：
 * - Observation：缺失与零值不同；新值通过 supersedes 链替代旧值，历史保留可回溯（A05）
 * - EvidenceLink：多对多——一证多事、多证一事都允许；共享证书≠重复计分（重复计分由规则判）
 * - 绑定默认 candidate（AI 产出）/user（人工指定），确认后才作为已核验依据
 */

import type { EvidenceLink, FieldValue, Observation, SourceRef } from '@profer/shared'

/** 记录观察：与同 subject/field 已有观察形成 supersedes 链（非覆盖式更新） */
export function recordObservation(
  existing: Observation[],
  input: {
    subjectId: string
    fieldKey: string
    value: FieldValue
    sourceRefs: SourceRef[]
    extractedBy: Observation['extractedBy']
    confirmed?: boolean
    now?: string
  },
): Observation[] {
  const now = input.now ?? new Date().toISOString()
  // 找同 subject+field 的当前最新观察作为被替代对象
  const previous = existing
    .filter((observation) => observation.subjectId === input.subjectId && observation.fieldKey === input.fieldKey)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0]
  const observation: Observation = {
    id: `obs-${input.subjectId}-${input.fieldKey}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    subjectId: input.subjectId,
    fieldKey: input.fieldKey,
    value: input.value,
    sourceRefs: input.sourceRefs,
    extractedBy: input.extractedBy,
    confirmed: input.confirmed ?? input.extractedBy === 'user',
    supersedesObservationId: previous?.id,
    createdAt: now,
  }
  // AI 重提取不静默覆盖人工确认值（A05：已确认值重提取不覆盖，产生候选留确认）——
  // 通过 confirmed=false + 值不同时调用方展示差异；本服务只追加不删除
  return [...existing, observation]
}

/** 当前生效观察：同 subject+field 取 createdAt 最新一条（链尾） */
export function latestObservations(observations: Observation[]): Map<string, Observation> {
  const latest = new Map<string, Observation>()
  for (const observation of [...observations].sort((a, b) => a.createdAt.localeCompare(b.createdAt))) {
    latest.set(`${observation.subjectId}::${observation.fieldKey}`, observation)
  }
  return latest
}

/** 观察值比较：当前生效值与候选值是否一致（AI 重提取差异检测） */
export function observationDiffers(candidate: { fieldKey: string; value: FieldValue }, current: Observation | undefined): boolean {
  if (!current) return true
  return JSON.stringify(candidate.value) !== JSON.stringify(current.value)
}

/** 绑定证据到主体（candidate 或 user 直确认）；同 doc+subject+fact 去重 */
export function buildEvidenceLinks(
  existing: EvidenceLink[],
  input: {
    documentVersionId: string
    subjectIds: string[]
    supportsFact: string
    blockRef?: EvidenceLink['blockRef']
    linkedBy: EvidenceLink['linkedBy']
    reuseScope?: string
    now?: string
  },
): EvidenceLink[] {
  const added: EvidenceLink[] = []
  const supportsFact = input.supportsFact.trim()
  if (!supportsFact) return existing
  // 同一条 Main 命令可提供多个目标。必须同时查已有记录和本次新增，
  // 否则 [s1, s1] 会在一个事务内产生两条相同关联。
  for (const subjectId of new Set(input.subjectIds)) {
    const duplicate = [...existing, ...added].some(
      (link) =>
        link.documentVersionId === input.documentVersionId &&
        link.subjectId === subjectId &&
        link.supportsFact === supportsFact,
    )
    if (duplicate) continue // 含已拒绝：人工否决不因 AI 重跑复活（A05）
    added.push({
      id: `evl-${input.documentVersionId}-${subjectId}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      documentVersionId: input.documentVersionId,
      blockRef: input.blockRef,
      subjectId,
      supportsFact,
      status: input.linkedBy === 'user' ? 'confirmed' : 'candidate',
      reuseScope: input.reuseScope,
      linkedBy: input.linkedBy,
    })
  }
  return [...existing, ...added]
}

/** 确认/拒绝绑定（状态迁移；rejected 保留记录供审计，去重时不再复活） */
export function transitionEvidenceLink(
  links: EvidenceLink[],
  linkId: string,
  to: 'confirmed' | 'rejected',
): EvidenceLink[] {
  return links.map((link) => (link.id === linkId ? { ...link, status: to } : link))
}

/** 覆盖核对：某主体是否已有已确认证据支撑（供"证明绑定完成度"用） */
export function subjectEvidenceCoverage(links: EvidenceLink[], subjectId: string): {
  confirmed: EvidenceLink[]
  candidate: EvidenceLink[]
} {
  const mine = links.filter((link) => link.subjectId === subjectId)
  return {
    confirmed: mine.filter((link) => link.status === 'confirmed'),
    candidate: mine.filter((link) => link.status === 'candidate'),
  }
}
