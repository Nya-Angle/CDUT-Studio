/**
 * 材料登记与案卷提交（G01，docs/design/review-agent/复查报告断点 1：V2 无上传/提交入口）
 *
 * - registerMaterialFromFile：系统选择框 → 复制原件进 source-docs/{versionId}/ →
 *   字节 SHA-256 + DocumentVersion 条目（经聚合命令事务，revision 统一 +1）
 * - submitCase：draft → submitted，创建首阶段任务（stage-workflow.ensureInitialTask）
 * 原件不可变：同名重复上传形成新版本（versionId 递增），不覆盖
 */

import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync, mkdtempSync, rmSync, statSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { basename, extname, join } from 'node:path'
import { tmpdir } from 'node:os'
import type { Actor, DocumentVersion, ReviewCommandResult, ReviewDocumentBlock, TemplateVersion } from '@profer/shared'
import { CommandValidationError, readAggregate, submitCommand } from './case-store-v2'
import { revokeCurrentSourceValidity } from './source-current-validity-v3'
import { getTemplate, listTemplateVersions } from './template-store'
import { getConfigDir } from '../config-paths'
import { extractDocxReviewContent, extractSpreadsheetReviewContent, extractTextFromFile, type DocxReviewContent, type XlsxReviewContent } from '../document-parser'
import { extractReviewableTextFile } from './document-service'

const IMAGE_MIME_PREFIX = 'image/'
const MAX_MATERIAL_BYTES = 50 * 1024 * 1024

/** ASSET-02：把源文件冻结成一份不可变暂存副本，之后所有解析/hash/落盘只读这一份字节。 */
export interface FrozenSource {
  stagedPath: string
  byteHash: string
  sizeBytes: number
  fileName: string
  dispose(): void
}

export function freezeSourceFile(sourcePath: string): FrozenSource {
  if (!existsSync(sourcePath)) throw new CommandValidationError('VALIDATION_FAILED', `源文件不存在: ${sourcePath}`)
  const fileName = sourcePath.split(/[\\/]/).pop() ?? 'material.bin'
  const stagingDir = mkdtempSync(join(tmpdir(), 'cdut-material-freeze-'))
  const stagedPath = join(stagingDir, fileName)
  // Single read: the bytes that get hashed are the bytes that get parsed and copied.
  const bytes = readFileSync(sourcePath)
  writeFileSync(stagedPath, bytes, { flag: 'wx' })
  const byteHash = createHash('sha256').update(bytes).digest('hex')
  return {
    stagedPath,
    byteHash,
    sizeBytes: bytes.length,
    fileName,
    dispose: () => rmSync(stagingDir, { recursive: true, force: true }),
  }
}

/**
 * ASSET-02/03：从冻结副本复制原件进案卷并返回字节 hash 与相对 assetKey。
 * 复制后回读校验，任何不一致都抛错并由调用方清理本命令创建的目录，
 * 保证版本回执指向的字节与登记时 hash 完全一致。
 */
function copyAsset(caseId: string, versionId: string, frozen: FrozenSource): { byteHash: string; assetKey: string; sizeBytes: number; assetDirectory: string } {
  const dir = join(getConfigDir(), 'review-cases', caseId, 'source-docs', versionId)
  mkdirSync(dir, { recursive: true })
  const fileName = frozen.fileName
  const target = join(dir, fileName)
  const bytes = readFileSync(frozen.stagedPath)
  const byteHash = createHash('sha256').update(bytes).digest('hex')
  if (byteHash !== frozen.byteHash || bytes.length !== frozen.sizeBytes) {
    throw new CommandValidationError('VALIDATION_FAILED', '原件在冻结后发生变化，已拒绝登记')
  }
  writeFileSync(target, bytes, { flag: 'wx' })
  const persisted = readFileSync(target)
  if (createHash('sha256').update(persisted).digest('hex') !== byteHash) {
    throw new CommandValidationError('VALIDATION_FAILED', '原件落盘校验失败，已拒绝登记')
  }
  return {
    byteHash,
    assetKey: `source-docs/${versionId}/${fileName}`,
    sizeBytes: bytes.length,
    assetDirectory: dir,
  }
}

function guessMime(fileName: string): string {
  const ext = fileName.toLowerCase().split('.').pop() ?? ''
  if (['png', 'jpg', 'jpeg', 'gif', 'webp', 'bmp'].includes(ext)) return `image/${ext === 'jpg' ? 'jpeg' : ext}`
  if (ext === 'pdf') return 'application/pdf'
  if (ext === 'html' || ext === 'htm') return 'text/html'
  if (ext === 'eml') return 'message/rfc822'
  if (ext === 'doc') return 'application/msword'
  if (ext === 'docx') return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  if (ext === 'docm') return 'application/vnd.ms-word.document.macroEnabled.12'
  if (ext === 'dot' || ext === 'wps' || ext === 'wpt') return 'application/msword'
  if (ext === 'dotx') return 'application/vnd.openxmlformats-officedocument.wordprocessingml.template'
  if (ext === 'dotm') return 'application/vnd.ms-word.template.macroEnabled.12'
  if (ext === 'xls') return 'application/vnd.ms-excel'
  if (ext === 'xlsx') return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  if (ext === 'xlsm') return 'application/vnd.ms-excel.sheet.macroEnabled.12'
  if (ext === 'xltx') return 'application/vnd.openxmlformats-officedocument.spreadsheetml.template'
  if (ext === 'xltm') return 'application/vnd.ms-excel.template.macroEnabled.12'
  if (['et', 'ett'].includes(ext)) return 'application/vnd.ms-works'
  if (ext === 'ppt') return 'application/vnd.ms-powerpoint'
  if (ext === 'pptx') return 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
  if (ext === 'pptm') return 'application/vnd.ms-powerpoint.presentation.macroEnabled.12'
  if (ext === 'potx') return 'application/vnd.openxmlformats-officedocument.presentationml.template'
  if (ext === 'potm') return 'application/vnd.ms-powerpoint.template.macroEnabled.12'
  if (ext === 'ppsx') return 'application/vnd.openxmlformats-officedocument.presentationml.slideshow'
  if (ext === 'ppsm') return 'application/vnd.ms-powerpoint.slideshow.macroEnabled.12'
  if (['dps', 'dpt'].includes(ext)) return 'application/vnd.ms-powerpoint'
  if (ext === 'rtf') return 'application/rtf'
  if (ext === 'odt') return 'application/vnd.oasis.opendocument.text'
  if (ext === 'ods') return 'application/vnd.oasis.opendocument.spreadsheet'
  if (ext === 'odp') return 'application/vnd.oasis.opendocument.presentation'
  if (['md', 'txt'].includes(ext)) return 'text/plain'
  if (ext === 'csv') return 'text/csv'
  return 'application/octet-stream'
}

export interface RegisterMaterialPayload {
  sourcePath: string
  role: DocumentVersion['role']
  materialSlotId?: string
  /** 重新解析案卷内存档原件时保留用户原文件名，不使用案卷存储文件名前缀。 */
  fileName?: string
  /** 重新解析失败材料时一并停用对应的旧版本或此前错误登记的副本。 */
  replacesVersionIds?: string[]
}

/** 登记材料（命令事务）：新 DocumentVersion 进聚合；同名再登记产生新版本 */
export async function registerMaterial(caseId: string, command: { requestId: string; actor: Actor; expectedRevision: number; payload: RegisterMaterialPayload }, authorizeAtCommit?: () => void): Promise<ReviewCommandResult<DocumentVersion>> {
  if (!readAggregate(caseId)) throw new CommandValidationError('NOT_FOUND', `案卷聚合不存在: ${caseId}`)
  if (!command.payload.sourcePath || !existsSync(command.payload.sourcePath)) throw new CommandValidationError('VALIDATION_FAILED', '材料文件不存在')
  const inputSize = statSync(command.payload.sourcePath).size
  if (inputSize > MAX_MATERIAL_BYTES) throw new CommandValidationError('VALIDATION_FAILED', `材料超过 50 MB 上限（${(inputSize / 1024 / 1024).toFixed(1)} MB）`)
  // ASSET-02: freeze once, then parse/hash/copy from the same immutable bytes.
  const frozen = freezeSourceFile(command.payload.sourcePath)
  let pdfImageTempDir: string | undefined
  try {
  let parsedDocx: DocxReviewContent | undefined
  let parsedXlsx: XlsxReviewContent | undefined
  let docxParseError: string | undefined
  let xlsxParseError: string | undefined
  if (extname(command.payload.sourcePath).toLowerCase() === '.docx') {
    try {
      parsedDocx = await extractDocxReviewContent(frozen.stagedPath)
    } catch (error) {
      docxParseError = `DOCX 结构解析失败，审核时尝试纯文本回退：${error instanceof Error ? error.message : String(error)}`
    }
  }
  const xlsxExtensions = new Set(['.xls', '.xlsx', '.xlsm', '.xltx', '.xltm'])
  const incomingExtension = extname(command.payload.sourcePath).toLowerCase()
  if (xlsxExtensions.has(incomingExtension)) {
    try {
      parsedXlsx = extractSpreadsheetReviewContent(frozen.stagedPath)
    } catch (error) {
      xlsxParseError = `Excel 单元格结构解析失败，审核时尝试纯文本回退：${error instanceof Error ? error.message : String(error)}`
    }
  }
  const supportedReviewExtensions = new Set([
    '.pdf', '.doc', '.docx', '.docm', '.dot', '.dotx', '.dotm', '.wps', '.wpt',
    '.xls', '.xlsx', '.xlsm', '.xltx', '.xltm', '.et', '.ett',
    '.ppt', '.pptx', '.pptm', '.potx', '.potm', '.ppsx', '.ppsm', '.dps', '.dpt',
    '.rtf', '.odt', '.ods', '.odp', '.md', '.txt', '.csv', '.json', '.html', '.htm', '.eml', '.png', '.jpg', '.jpeg', '.gif', '.webp', '.bmp',
  ])
  let fallbackText: string | undefined
  let fallbackParseError: string | undefined
  const imageExtensions = new Set(['.png', '.jpg', '.jpeg', '.gif', '.webp', '.bmp'])
  pdfImageTempDir = incomingExtension === '.pdf' ? mkdtempSync(join(tmpdir(), 'cdut-review-pdf-images-')) : undefined
  let parsedPdfImages: ReviewDocumentBlock[] = []
  let pdfParseWarning: string | undefined
  const pdfPageWarnings: string[] = []
  if (pdfImageTempDir) {
    try {
      const { renderPdfImageBlocks } = await import('./case-import')
      const pdfImages = await renderPdfImageBlocks({ filePath: frozen.stagedPath, fileName: frozen.fileName, documentId: 'pending-review', assetDir: pdfImageTempDir })
      parsedPdfImages = pdfImages.blocks
      // 页图像被截断或中途失败时如实进入解析警告，登记状态不伪造成 parsed。
      pdfPageWarnings.push(...pdfImages.warnings)
    } catch (error) {
      pdfParseWarning = `PDF 图像页提取失败，需查看原件人工核对：${error instanceof Error ? error.message : String(error)}`
    }
  }
  if (!parsedDocx && !parsedXlsx && supportedReviewExtensions.has(incomingExtension) && !imageExtensions.has(incomingExtension)) {
    try {
      fallbackText = incomingExtension === '.html' || incomingExtension === '.htm' || incomingExtension === '.eml'
        ? await extractReviewableTextFile(frozen.stagedPath, frozen.fileName)
        : await extractTextFromFile(frozen.stagedPath)
    }
    catch (error) { fallbackParseError = error instanceof Error ? error.message : String(error) }
  }
  // ASSET-03: track physical dirs created by this command so a failed CAS commit
  // never leaves an orphan that could be mistaken for a registered material.
  const createdAssetDirs = new Set<string>()
  try {
    return await submitCommand<RegisterMaterialPayload, DocumentVersion>(caseId, { ...command, type: 'RegisterMaterial' }, (aggregate, payload) => {
    // Re-check the live Main window after parsing/Host awaits and immediately
    // inside the serialized command, before any physical asset is copied.
    authorizeAtCommit?.()
    if (aggregate.caseV2.stage === 'archived') throw new CommandValidationError('INVALID_TRANSITION', '已归档案卷不可登记材料')
    // RUN-39/OFF-05：槽位绑定必须是当前模板真实存在的槽，不能把任意字符串写进材料身份。
    if (payload.materialSlotId) {
      const template = getTemplate(aggregate.caseV2.templateId, aggregate.caseV2.templateVersion)
      // 模板声明了材料槽时，绑定必须是真实槽位；模板完全没有槽位定义时保留
      // 历史“分组标签”语义，避免把兼容数据当成非法写入。
      if (template && template.materialSlots.length > 0 && !template.materialSlots.some((slot) => slot.id === payload.materialSlotId)) {
        // 历史版本可能使用已退休的槽 ID（旧案卷/迁移材料）。只接受同一模板谱系
        // 真实出现过的槽，仍拒绝纯拼写错误或跨模板的槽。
        let knownInLineage = false
        try {
          knownInLineage = listTemplateVersions().some((candidate) => candidate.templateId === aggregate.caseV2.templateId
            && candidate.materialSlots.some((slot) => slot.id === payload.materialSlotId))
        } catch { knownInLineage = false }
        if (!knownInLineage) throw new CommandValidationError('VALIDATION_FAILED', `材料槽不存在于当前模板：${payload.materialSlotId}`)
      }
    }
    const sourcePath = payload.sourcePath
    if (!sourcePath) throw new CommandValidationError('VALIDATION_FAILED', '缺少源文件路径')
    // 版本链语义（复查 §5.9）：同槽位 + 同文件名 = 同一逻辑材料的新版本；不同槽位各自独立
    const incomingName = command.payload.fileName ?? (sourcePath.split(/[\\/]/).pop() ?? 'material.bin')
    const requestedReplacements = new Set(payload.replacesVersionIds ?? [])
    if ([...requestedReplacements].some((versionId) => !aggregate.caseV2.documents.some((doc) => doc.versionId === versionId && doc.active !== false))) {
      throw new CommandValidationError('VALIDATION_FAILED', '替换目标不存在或不再是当前材料版本')
    }
    // ASSET-04: role is part of material identity. Same file name in the same slot
    // but a different role is NOT an implicit replacement; only an explicit
    // replacesVersionIds list may retire it.
    const sameLogic = aggregate.caseV2.documents.filter((doc) => doc.fileName === incomingName && doc.materialSlotId === payload.materialSlotId && doc.role === payload.role)
    const versionSeq = sameLogic.length + 1
    const previousVersion = sameLogic.at(-1)
    const documentId = `doc-${aggregate.caseV2.documents.length + 1}-${Date.now().toString(36)}`
    const versionId = `${documentId}-v${versionSeq}`
    const { byteHash, assetKey, sizeBytes, assetDirectory } = copyAsset(caseId, versionId, frozen)
    createdAssetDirs.add(assetDirectory)
    const fileExtension = extname(incomingName).toLowerCase()
    const embeddedExt: Record<string, string> = { 'image/png': '.png', 'image/jpeg': '.jpg', 'image/gif': '.gif', 'image/webp': '.webp' }
    const blocks: DocumentVersion['blocks'] = []
    let omittedEmbeddedImage = false
    if (parsedDocx && fileExtension === '.docx') {
      for (const [index, item] of parsedDocx.blocks.entries()) {
        if (item.kind === 'image') {
          const image = item.imageIndex === undefined ? undefined : parsedDocx.images[item.imageIndex]
          const imageExtension = image ? embeddedExt[image.contentType] : undefined
          let imageAssetPath: string | undefined
          if (image && imageExtension) {
            const imageName = `${versionId}-embedded-${String(item.imageIndex! + 1).padStart(3, '0')}${imageExtension}`
            writeFileSync(join(assetDirectory, imageName), image.data)
            imageAssetPath = `source-docs/${versionId}/${imageName}`
          } else omittedEmbeddedImage = true
          blocks.push({ blockId: `${versionId}-block-${String(index + 1).padStart(3, '0')}`, text: '', location: { kind: 'paragraph', index }, kind: 'image', ...(item.imageAlt ? { imageAlt: item.imageAlt } : {}), ...(imageAssetPath ? { imageAssetPath } : {}) })
        } else {
          blocks.push({
            blockId: `${versionId}-block-${String(index + 1).padStart(3, '0')}`, text: item.text,
            location: { kind: 'paragraph', index }, kind: item.kind === 'table-cell' ? 'table' : 'text',
            format: item.kind, ...(item.table ? { table: item.table } : {}),
          })
        }
      }
    } else if (parsedXlsx && xlsxExtensions.has(fileExtension)) {
      for (const [index, cell] of parsedXlsx.blocks.entries()) {
        blocks.push({
          blockId: `${versionId}-cell-${cell.sheet.replace(/[^\p{L}\p{N}-]/gu, '-').slice(0, 24)}-${cell.row}-${cell.column}-${index + 1}`,
          text: cell.text,
          location: { kind: 'sheet-cell', sheet: cell.sheet, row: cell.row, column: cell.columnName },
          kind: 'table', format: 'table-cell', table: { row: cell.row, column: cell.column },
        })
      }
    } else if (fallbackText?.trim()) {
      const ext = fileExtension
      const lines = fallbackText.split(/\r?\n/).map((line) => line.trim()).filter(Boolean)
      blocks.push(...lines.map((text, index) => ({ blockId: `${versionId}-block-${String(index + 1).padStart(3, '0')}`, text, location: { kind: 'paragraph' as const, index }, kind: ext === '.csv' ? 'table' as const : 'text' as const })))
    } else if (imageExtensions.has(fileExtension)) {
      blocks.push({ blockId: `${versionId}-block-001`, text: '', location: { kind: 'paragraph', index: 0 }, kind: 'image', imageAssetPath: assetKey })
    }
    const parseWarnings = [...(parsedDocx?.warnings ?? []), ...(parsedXlsx?.warnings ?? []), ...pdfPageWarnings]
    if (pdfParseWarning) parseWarnings.push(pdfParseWarning)
    if (imageExtensions.has(fileExtension)) parseWarnings.push('图片原件已保存；内容由视觉模型识别（不做文本切块），无法视觉识别时需人工核对')
    if (omittedEmbeddedImage) parseWarnings.push('部分 DOCX 内嵌图片未能提取或保存，需人工查看原件')
    if (docxParseError) parseWarnings.push(docxParseError)
    if (xlsxParseError) parseWarnings.push(xlsxParseError)
    if (fallbackParseError) parseWarnings.push(`材料文本解析失败：${fallbackParseError}`)
    for (const pageBlock of parsedPdfImages) {
      const pageFileName = basename(pageBlock.imageAssetPath ?? '')
      if (!pageFileName || !pageBlock.imageAssetPath) continue
      const sourceImagePath = join(pdfImageTempDir ?? '', pageFileName)
      if (!existsSync(sourceImagePath)) continue
      const imageFileName = `${versionId}-${pageFileName.replace(/^pending-review-/, '')}`
      copyFileSync(sourceImagePath, join(assetDirectory, imageFileName))
      blocks.push({
        blockId: `${versionId}-page-${String(pageBlock.page).padStart(3, '0')}-image`,
        text: '', location: { kind: 'paragraph', index: blocks.length }, kind: 'image',
        imageAlt: pageBlock.imageAlt ?? `PDF 第 ${pageBlock.page} 页图像`,
        imageAssetPath: `source-docs/${versionId}/${imageFileName}`,
      })
    }
    const parseStatus: DocumentVersion['parseStatus'] = blocks.length === 0
      ? supportedReviewExtensions.has(fileExtension) ? 'partial' : 'failed'
      : parseWarnings.length > 0 || omittedEmbeddedImage ? 'partial' : 'parsed'
    return {
      summary: `登记材料 ${incomingName}（${versionId}）`,
      mutate: (draft) => {
        // 同槽位同名旧版本停止参与新审核（supersedes：同 slotId+name 才替换）
        const replacedVersions = new Set(payload.replacesVersionIds ?? [])
        const docs = draft.caseV2.documents.map((doc) => (
          (doc.fileName === incomingName && doc.materialSlotId === payload.materialSlotId && doc.role === payload.role) || replacedVersions.has(doc.versionId)
            ? { ...doc, active: false }
            : doc
        ))
        const doc: DocumentVersion = {
          documentId,
          versionId,
          ...(previousVersion ? { supersedesVersionId: previousVersion.versionId } : {}),
          contentHash: byteHash, // N2c 阶段解析前先以字节 hash 兼作内容指纹
          role: payload.role,
          materialSlotId: payload.materialSlotId,
          fileName: incomingName,
          mimeType: guessMime(incomingName),
          sizeBytes,
          assetPath: assetKey,
          parseRevision: blocks.length > 0 ? 1 : 0,
          parseStatus,
          ...(parseWarnings.length > 0 ? { parseError: [...new Set(parseWarnings)].join('；') } : {}),
          blocks,
          usage: 'registered',
        }
        doc.byteHash = byteHash
        doc.active = true
        draft.caseV2.documents = [...docs, doc]
        const retiredVersions = new Set(aggregate.caseV2.documents.filter((old) =>
          old.active !== false && (requestedReplacements.has(old.versionId) ||
            (old.fileName === incomingName && old.materialSlotId === payload.materialSlotId && old.role === payload.role)))
          .map((old) => old.versionId))
        revokeCurrentSourceValidity(draft, retiredVersions, 'replace')
        return doc
      },
    }
    })
  } catch (error) {
    // No aggregate receipt committed => remove the bytes this command created.
    for (const dir of createdAssetDirs) {
      try { rmSync(dir, { recursive: true, force: true }) } catch { /* keep for diagnosis */ }
    }
    throw error
  }
  } finally {
    if (pdfImageTempDir) rmSync(pdfImageTempDir, { recursive: true, force: true })
    frozen.dispose()
  }
}

/** 从聚合读材料（含 byteHash/active 扩展字段） */
export function listMaterials(caseId: string): Array<DocumentVersion & { byteHash?: string; active?: boolean }> {
  return readAggregate(caseId)?.caseV2.documents ?? []
}

/** 选择文件并登记（主进程对话框 → 命令事务）；返回登记后的版本 ID 列表 */
export async function pickAndRegisterMaterials(
  caseId: string,
  actor: Actor,
  role: DocumentVersion['role'],
  materialSlotId: string | undefined,
  dialog: { showOpenDialog(options: unknown): Promise<{ canceled: boolean; filePaths: string[] }> },
  browserWindow: unknown,
): Promise<string[]> {
  const options = {
    properties: ['openFile', 'multiSelections'],
    filters: [
      { name: '审核材料', extensions: ['pdf', 'png', 'jpg', 'jpeg', 'gif', 'webp', 'bmp', 'md', 'txt', 'csv', 'json', 'html', 'htm', 'eml', 'doc', 'docx', 'docm', 'dot', 'dotx', 'dotm', 'wps', 'wpt', 'xls', 'xlsx', 'xlsm', 'xltx', 'xltm', 'et', 'ett', 'ppt', 'pptx', 'pptm', 'potx', 'potm', 'ppsx', 'ppsm', 'dps', 'dpt', 'rtf', 'odt', 'ods', 'odp'] },
      { name: '全部文件', extensions: ['*'] },
    ],
  }
  const result = browserWindow
    ? await dialog.showOpenDialog(options)
    : await dialog.showOpenDialog(options)
  if (result.canceled || result.filePaths.length === 0) return []
  const versionIds: string[] = []
  // 逐个登记（同案串行事务天然有序）
  for (const sourcePath of result.filePaths) {
    const aggregate = readAggregate(caseId)
    if (!aggregate) throw new CommandValidationError('NOT_FOUND', `案卷聚合不存在: ${caseId}`)
    const outcome = (await registerMaterial(caseId, {
      requestId: `reg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      actor,
      expectedRevision: aggregate.caseV2.revision,
      payload: { sourcePath, role, materialSlotId },
    })) as { ok: boolean; code?: string; message?: string }
    if (!outcome.ok) throw new CommandValidationError('VALIDATION_FAILED', outcome.message ?? '登记失败')
    versionIds.push(sourcePath)
  }
  return versionIds
}

/** 提交案卷（draft → submitted；由 stage-workflow.ensureInitialTask 创建首阶段任务） */
export function canSubmit(aggregate: { caseV2: ReviewCaseAggregate }): { ok: boolean; reason?: string } {
  if (aggregate.caseV2.stage !== 'draft') return { ok: false, reason: `当前阶段 ${aggregate.caseV2.stage} 不可提交` }
  const required: string[] = []
  for (const slot of (aggregate as unknown as { template?: TemplateVersion }).template?.materialSlots ?? []) {
    if ((slot.requiredAt ?? 'submission') === 'submission' && slot.requiredWhen === undefined && aggregate.caseV2.documents.filter((doc) => doc.materialSlotId === slot.id && doc.active !== false).length < slot.minCount) {
      required.push(slot.name)
    }
  }
  if (required.length > 0) return { ok: false, reason: `缺少必需材料：${required.join('、')}` }
  if (aggregate.caseV2.documents.length === 0) return { ok: false, reason: '尚未登记任何材料' }
  return { ok: true }
}

type ReviewCaseAggregate = import('@profer/shared').ReviewCaseV2

export function materialsDirCaseId(caseId: string): string {
  return join(getConfigDir(), 'review-cases', caseId, 'source-docs')
}

export function countSourceFiles(caseId: string, versionId: string): number {
  const dir = join(getConfigDir(), 'review-cases', caseId, 'source-docs', versionId)
  if (!existsSync(dir)) return 0
  return readdirSync(dir).length
}

export const IMAGE_MIME = IMAGE_MIME_PREFIX
