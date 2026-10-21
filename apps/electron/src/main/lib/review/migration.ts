/**
 * V1→V2 案卷迁移（M1，设计 03 §7 迁移 V1）
 *
 * - 保留原 V1 文件与 runs 不动；V2 写入同目录 case.v2.json（迁移可重复执行）
 * - 旧分数转字段；fixture 保留 origin；历史 run 不迁移（旧格式/覆盖未验证，导出已被 M0 守门拒绝）
 * - 未配置 domainPack、未知领域 ID、无 items、损坏文件：按映射表处理并记录迁移注记
 */

import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { join } from 'node:path'
import type { ReviewCase } from '@profer/shared'
import type { DocumentVersion, FieldValue, ReviewCaseV2, ReviewSubject, TemplateVersion } from '@profer/shared'
import { getConfigDir } from '../config-paths'

/** V1 领域包 → V2 模板映射（未知 ID 不默认综测：H14 延续到迁移层） */
const DOMAIN_TEMPLATE_MAP: Record<string, string> = {
  'comprehensive-assessment': 'comprehensive-assessment-v2',
  'activity-approval': 'activity-approval-v2',
  contract: 'document-checklist-v2',
  reimburse: 'expense-check-v2',
  custom: null as unknown as string,
}

/** V1 → V2 模板映射（未知领域返回 undefined 并记注记，不回落综测） */
export function mapDomainToTemplate(domainPackId?: string): { templateId: string; note?: string } {
  if (!domainPackId) return { templateId: 'comprehensive-assessment-v2', note: 'V1 未声明领域包：按缺省综测模板兼容迁移（V1 缺省语义即综测）' }
  const mapped = DOMAIN_TEMPLATE_MAP[domainPackId]
  if (!mapped) return { templateId: '', note: `未知领域包 ${domainPackId}：未迁移到任何模板，需人工选择映射或待配置` }
  return { templateId: mapped }
}

function fieldValue(kind: FieldValue['kind'], value: unknown): FieldValue {
  return { kind, value } as FieldValue
}

/** V1 事项字段 → V2 主体动态字段（含分数/日期等强类型） */
export function itemToSubjectFields(item: ReviewCase['items'][number]): Record<string, FieldValue> {
  const fields: Record<string, FieldValue> = {
    title: fieldValue('text', item.title),
    category: fieldValue('text', item.category),
    declaredScore: fieldValue('number', item.declaredScore),
  }
  if (item.level !== undefined) fields.level = fieldValue('text', item.level)
  if (item.activityDate !== undefined) fields.activityDate = fieldValue('date', item.activityDate)
  if (item.organizer !== undefined) fields.organizer = fieldValue('text', item.organizer)
  return fields
}

function blockHash(texts: string[]): string {
  return createHash('sha1').update(texts.join('\n'), 'utf-8').digest('hex')
}

/** V1 源文档 → V2 文档版本（versionId 稳定：docId-v1） */
export function documentToVersion(doc: ReviewCase['documents'][number]): DocumentVersion {
  const legacyAssetPath = (doc as { imageAssetPath?: string }).imageAssetPath
  return {
    documentId: doc.id,
    versionId: `${doc.id}-v1`,
    contentHash: blockHash(doc.blocks.map((block) => block.text)),
    role: doc.role,
    fileName: doc.fileName,
    mimeType: doc.mimeType,
    sizeBytes: doc.sizeBytes,
    // 上传文件统一存放在 source-docs/{docId}-{fileName}；迁移时保留原件相对路径。
    assetPath: legacyAssetPath || (doc.origin === 'upload' ? `source-docs/${doc.id}-${doc.fileName}` : ''),
    parseRevision: 1,
    parseStatus: doc.parseStatus === 'parsed' ? 'parsed' : doc.parseStatus === 'partial' ? 'partial' : doc.parseStatus === 'failed' ? 'failed' : 'pending',
    blocks: doc.blocks.map((block, index) => ({
      blockId: block.id,
      text: block.text ?? '',
      location: { kind: 'paragraph' as const, index },
      kind: block.kind === 'image' ? 'image' : block.kind === 'table-cell' ? 'table' : 'text',
      ...(block.kind === 'heading' || block.kind === 'paragraph' || block.kind === 'list-item' || block.kind === 'table-cell' ? { format: block.kind } : {}),
      ...(block.table ? { table: block.table } : {}),
      ...(block.imageAlt ? { imageAlt: block.imageAlt } : {}),
      ...(block.imageAssetPath ? { imageAssetPath: block.imageAssetPath } : {}),
    })),
    usage: doc.parseStatus === 'parsed' && doc.blocks.length > 0 ? 'read' : 'unread',
    unusedReason: doc.parseStatus === 'failed' ? 'V1 解析失败' : doc.blocks.length === 0 ? 'V1 未提取到文本' : undefined,
  }
}

/** V1 事项 → V2 主体 */
export function itemToSubject(item: ReviewCase['items'][number]): ReviewSubject {
  return {
    id: item.id,
    type: 'item',
    title: item.title,
    fields: itemToSubjectFields(item),
    sourceRefs: [{ caseId: '', documentVersionId: `${item.anchor.documentId}-v1`, parseRevision: 1, location: { kind: 'file' } }],
    correction: item.identifiedBy === 'ai' ? 'ai-extracted' : 'user-confirmed',
    status: item.status === 'ignored' ? 'ignored' : 'identified',
  }
}

export interface MigrationResult {
  migrated: boolean
  note: string
  caseV2?: ReviewCaseV2
}

/**
 * 迁移单个 V1 案卷（可重复：case.v2.json 已存在且 revision>=1 时直接返回既有结果）。
 * 迁移产物为「可读可重审」的 V2 案卷；历史 V1 runs 不迁移（M0 导出守门已拒旧格式混版）。
 */
export function migrateCaseToV2(v1: ReviewCase): MigrationResult {
  const note0: string[] = []
  const { templateId, note } = mapDomainToTemplate(v1.domainPackId)
  if (note) note0.push(note)

  // 模板必须真实存在（builtin-templates 幂等落盘保证）；V1 迁移采用当前最高模板版本，
  // 之后模板版本固定写入 V2 案卷，后续发布不会回写已迁移案卷。
  const versionsDir = join(getConfigDir(), 'review-templates', templateId, 'versions')
  const latestVersion = existsSync(versionsDir)
    ? readdirSync(versionsDir).filter((name) => /^\d+\.json$/.test(name)).map((name) => Number(name.slice(0, -5))).filter(Number.isSafeInteger).sort((a, b) => b - a)[0]
    : undefined
  const templatePath = latestVersion === undefined ? undefined : join(versionsDir, `${latestVersion}.json`)
  let template: TemplateVersion | undefined
  if (templateId && templatePath && existsSync(templatePath)) {
    template = JSON.parse(readFileSync(templatePath, 'utf-8')) as TemplateVersion
  } else {
    note0.push(`模板 ${templateId || '(未映射)'} 不存在：V2 案卷暂不可创建，请先确保内置模板已落盘`)
  }

  const v2Path = join(getConfigDir(), 'review-cases', v1.id, 'case.v2.json')
  if (existsSync(v2Path)) {
    const existing = JSON.parse(readFileSync(v2Path, 'utf-8')) as ReviewCaseV2
    return { migrated: true, note: `已有 V2 案卷（revision=${existing.revision}）`, caseV2: existing }
  }
  if (!template) return { migrated: false, note: note0.join('；') }

  const caseV2: ReviewCaseV2 = {
    id: v1.id,
    templateId: template.templateId,
    templateVersion: template.version,
    title: v1.title,
    objectType: template.objectType,
    caseFields: {
      applicant: fieldValue('text', v1.applicant),
      academicYear: fieldValue('text', v1.academicYear),
    },
    subjects: v1.items.map((item) => ({ ...itemToSubject(item), sourceRefs: itemToSubject(item).sourceRefs.map((ref) => ({ ...ref, caseId: v1.id })) })),
    documents: v1.documents.map(documentToVersion),
    stage: 'submitted',
    revision: 1,
    createdAt: v1.createdAt,
    updatedAt: new Date().toISOString(),
  }
  mkdirSync(join(getConfigDir(), 'review-cases', v1.id), { recursive: true })
  writeFileSync(v2Path, JSON.stringify(caseV2, null, 2), 'utf-8')
  return { migrated: true, note: note0.join('；') || '迁移完成', caseV2 }
}



/** 读取 V2 案卷（不存在返回 undefined） */
export function getCaseV2(caseId: string): ReviewCaseV2 | undefined {
  const path = join(getConfigDir(), 'review-cases', caseId, 'case.v2.json')
  if (!existsSync(path)) return undefined
  return JSON.parse(readFileSync(path, 'utf-8')) as ReviewCaseV2
}
