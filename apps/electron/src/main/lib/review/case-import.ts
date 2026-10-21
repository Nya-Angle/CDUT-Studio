/**
 * 案卷文件导入（IPC IMPORT_DOCUMENT 实现）
 *
 * 流程：系统选择框（Electron dialog）→ 复制原件进案卷目录 → 解析为 SourceDocument → 写回案卷。
 *
 * 安全边界：文件读取与保存只在主进程发生；渲染进程只拿到解析结果，不接触原始路径。
 */

import type { BrowserWindow } from 'electron'
import { copyFileSync, statSync, mkdirSync, existsSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { pathToFileURL } from 'node:url'
import type { EvidenceDocument, ImportDocumentsResult, ReviewCase, ReviewDocumentBlock, ReviewImportProgressEvent, RulePack, SourceDocument } from '@profer/shared'
import { getCase, saveCase, updateCase, assertSafeId, getReviewCasesDir } from './case-store'
import { parseFileIntoSourceDocument } from './document-service'
import { invalidateDerivedReviewInputs } from './input-invalidation'
import { syncWorkspaceProjectionV2 } from './workspace-service-v2'

/** 单文件大小上限（50MB，超过直接拒绝） */
const MAX_IMPORT_BYTES = 50 * 1024 * 1024
type ImportProgressPayload = Omit<ReviewImportProgressEvent, 'requestId' | 'caseId' | 'role'>

function emitImportProgress(
  context: { requestId?: string; caseId: string; role: SourceDocument['role']; onProgress?: (event: ReviewImportProgressEvent) => void },
  payload: ImportProgressPayload,
): void {
  if (!context.requestId) return
  context.onProgress?.({ ...payload, requestId: context.requestId, caseId: context.caseId, role: context.role })
}

/**
 * 单份 PDF 最多保留多少页原件图像。
 *
 * 每一页图像都是一次隐藏 renderer 截图（真实 26 页 PDF 实测约 0.27 秒/页），
 * 与 DOCX 内嵌图片的 24 张上限对齐；超出部分如实写入解析警告，原件仍在案卷内，
 * 审核时可用单页核验继续查看指定页。
 */
const MAX_PDF_PAGE_IMAGES = 24

/** PDF raster images are retained as image blocks so the model sees embedded scans and charts. */
export async function renderPdfImageBlocks(input: {
  filePath: string
  fileName: string
  documentId: string
  assetDir: string
  assetDirectoryPrefix?: string
  onProgress?: (progress: { phase: 'scanning-pdf' | 'rendering-pdf'; page: number; totalPages: number }) => void
}): Promise<{ blocks: ReviewDocumentBlock[]; warnings: string[] }> {
  const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs') as unknown as {
    OPS: Record<string, number>
    GlobalWorkerOptions: { workerSrc: string }
    getDocument(options: Record<string, unknown>): { promise: Promise<{
      numPages: number
      getPage(pageNumber: number): Promise<{ getOperatorList(): Promise<{ fnArray: number[] }> }>
      destroy(): Promise<void> | void
    }> }
  }
  pdfjs.GlobalWorkerOptions.workerSrc = pathToFileURL(require.resolve('pdfjs-dist/legacy/build/pdf.worker.mjs')).href
  const loadingTask = pdfjs.getDocument({ data: new Uint8Array(readFileSync(input.filePath)), isEvalSupported: false, useWorkerFetch: false })
  const pdf = await loadingTask.promise
  const imageOperators = new Set([
    pdfjs.OPS.paintImageXObject,
    pdfjs.OPS.paintInlineImageXObject,
    pdfjs.OPS.paintImageMaskXObject,
    pdfjs.OPS.paintJpegXObject,
    pdfjs.OPS.paintImageXObjectRepeat,
  ].filter((operator): operator is number => typeof operator === 'number'))
  const imagePages: number[] = []
  try {
    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
      input.onProgress?.({ phase: 'scanning-pdf', page: pageNumber, totalPages: pdf.numPages })
      const page = await pdf.getPage(pageNumber)
      const operators = await page.getOperatorList()
      if (operators.fnArray.some((operator) => imageOperators.has(operator))) imagePages.push(pageNumber)
    }
  } finally {
    await pdf.destroy()
  }
  if (imagePages.length === 0) return { blocks: [], warnings: [] }

  const { renderAuthorizedPreview } = await import('../preview-inspection-service')
  const blocks: ReviewDocumentBlock[] = []
  const warnings: string[] = []
  const pagesToRender = imagePages.slice(0, MAX_PDF_PAGE_IMAGES)
  if (imagePages.length > pagesToRender.length) {
    // 如实记录被截断的页数：不伪造"已看完全部页"，也不让登记被长文档拖死。
    warnings.push(`PDF 含图像页 ${imagePages.length} 页，超过 ${MAX_PDF_PAGE_IMAGES} 页上限，仅保留前 ${pagesToRender.length} 页图像；其余页需查看原件核对`)
    console.warn(`[审核专区] PDF 页图像超出上限，仅保留前 ${pagesToRender.length}/${imagePages.length} 页`)
  }
  for (const page of pagesToRender) {
    input.onProgress?.({ phase: 'rendering-pdf', page, totalPages: pdf.numPages })
    let rendered: Awaited<ReturnType<typeof renderAuthorizedPreview>>
    try {
      rendered = await renderAuthorizedPreview({
        filePath: input.filePath,
        fileName: input.fileName,
        kind: 'pdf',
        scope: 'page',
        page,
      })
    } catch (error) {
      // 单页截图失败不再继续逐页重试：隐藏 renderer 每次失败都要等满 30 秒超时，
      // 继续循环会把登记拖成十几分钟。首帧失败即停止，并由调用方写入解析警告。
      const message = error instanceof Error ? error.message : String(error)
      warnings.push(`PDF 第 ${page} 页图像提取失败，已停止后续页图像提取，需查看原件核对：${message}`)
      console.warn(`[审核专区] PDF 第 ${page} 页截图失败，停止后续页图像提取:`, message)
      break
    }
    const image = rendered.images[0]
    if (!image) continue
    const imageFileName = `${input.documentId}-page-${String(page).padStart(3, '0')}.png`
    const imageAssetPath = `${input.assetDirectoryPrefix ?? 'source-docs'}/${imageFileName}`
    writeFileSync(join(input.assetDir, imageFileName), Buffer.from(image.data, 'base64'))
    blocks.push({
      id: `blk-${input.documentId}-page-${String(page).padStart(3, '0')}-image`,
      kind: 'image',
      text: '',
      imageAlt: `PDF 第 ${page} 页图像（供模型核对扫描内容、图表与版式）`,
      page,
      imageAssetPath,
    })
  }
  return { blocks, warnings }
}

/**
 * 弹出系统多选框批量导入材料到案卷；逐份复用同一原生导入与解析服务。
 * 单份失败不会撤销已经成功登记的其他文件。
 */
export async function importDocumentsIntoCase(input: {
  caseId: string
  role: SourceDocument['role']
  parentWindow?: import('electron').BrowserWindow
  requestId?: string
  onProgress?: (event: ReviewImportProgressEvent) => void
}): Promise<ImportDocumentsResult> {
  const { dialog, BrowserWindow } = require('electron') as typeof import('electron')
  assertSafeId(input.caseId)
  const reviewCase = getCase(input.caseId)
  if (!reviewCase) throw new Error(`案卷不存在: ${input.caseId}`)

  const window = input.parentWindow && !input.parentWindow.isDestroyed()
    ? input.parentWindow
    : BrowserWindow.getFocusedWindow() ?? BrowserWindow.getAllWindows().find((candidate) => candidate.isVisible())
  const options = {
    title: `选择${input.role === 'rule' ? '审核依据' : input.role === 'application' ? '申报材料' : '证明材料'}（可多选）`,
    properties: ['openFile', 'multiSelections'] as Array<'openFile' | 'multiSelections'>,
    filters: [
      {
        name: '审核材料',
        extensions: [
          // 文本类
          'md', 'txt', 'csv', 'json', 'html', 'htm', 'eml', 'svg',
          // 文档类（document-parser 覆盖的格式）
          'pdf', 'doc', 'docx', 'docm', 'dot', 'dotx', 'dotm', 'wps', 'wpt',
          'xls', 'xlsx', 'xlsm', 'xltx', 'xltm', 'et', 'ett',
          'ppt', 'pptx', 'pptm', 'potx', 'potm', 'ppsx', 'ppsm', 'dps', 'dpt',
          // 富文本与 OpenDocument 格式由文档解析器提取；DOCX 图片进入视觉材料块
          'rtf', 'odt', 'ods', 'odp',
          // 图片类（走 Vision 识别）
          'png', 'jpg', 'jpeg', 'gif', 'webp', 'bmp',
        ],
      },
      { name: '全部文件', extensions: ['*'] },
    ],
  }
  // 无可用窗口时退化为无父窗口的对话框（showOpenDialog 静态方法两种签名都接受）
  emitImportProgress(input, { phase: 'selecting', message: '等待选择文件' })
  const result = window ? await dialog.showOpenDialog(window, options) : await dialog.showOpenDialog(options)
  if (result.canceled || result.filePaths.length === 0) {
    emitImportProgress(input, { phase: 'cancelled', message: '已取消选择' })
    return { documents: [], failures: [], canceled: true }
  }

  const documents: SourceDocument[] = []
  const failures: Array<{ fileName: string; message: string }> = []
  for (const [index, sourcePath] of result.filePaths.entries()) {
    const fileName = sourcePath.split(/[\\/]/).pop() ?? '审核材料'
    const fileIndex = index + 1
    const fileCount = result.filePaths.length
    emitImportProgress(input, { phase: 'file-start', fileName, fileIndex, fileCount, completedFiles: index, message: `准备导入 ${fileIndex}/${fileCount}` })
    try {
      documents.push(await importDocumentFromPath({
        caseId: input.caseId,
        sourcePath,
        role: input.role,
        requestId: input.requestId,
        onProgress: input.onProgress,
        fileIndex,
        fileCount,
      }))
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      failures.push({ fileName, message })
      emitImportProgress(input, { phase: 'file-failed', fileName, fileIndex, fileCount, completedFiles: index + 1, message: `第 ${fileIndex}/${fileCount} 份失败：${message}` })
    }
  }
  emitImportProgress(input, { phase: 'batch-complete', fileCount: result.filePaths.length, completedFiles: result.filePaths.length, message: `导入完成：${documents.length} 份成功，${failures.length} 份失败` })
  return { documents, failures, canceled: false }
}

/** 与文件选择框共用的导入链，供自动化验收和拖拽入口复用。 */
export async function importDocumentFromPath(input: {
  caseId: string
  sourcePath: string
  role: SourceDocument['role']
  requestId?: string
  onProgress?: (event: ReviewImportProgressEvent) => void
  fileIndex?: number
  fileCount?: number
}): Promise<SourceDocument> {
  assertSafeId(input.caseId)
  const reviewCase = getCase(input.caseId)
  if (!reviewCase) throw new Error(`案卷不存在: ${input.caseId}`)
  const filePath = input.sourcePath
  const fileName = filePath.split(/[\\/]/).pop() ?? '审核材料'
  const progressContext = { ...input, fileName }
  const reportProgress = (payload: ImportProgressPayload): void => emitImportProgress(progressContext, {
    ...payload,
    fileName,
    ...(input.fileIndex ? { fileIndex: input.fileIndex } : {}),
    ...(input.fileCount ? { fileCount: input.fileCount } : {}),
  })

  // 体积校验：超过上限直接拒绝（避免超大文件拖垮解析与存储）
  const sizeBytes = statSync(filePath).size
  if (sizeBytes > MAX_IMPORT_BYTES) {
    throw new Error(`文件过大（${(sizeBytes / 1024 / 1024).toFixed(1)} MB），单文件上限 ${MAX_IMPORT_BYTES / 1024 / 1024} MB`)
  }

  // 复制原件进案卷存储目录（保持"原件按案卷保存"契约）；目录必须显式创建
  const docId = `doc-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
  const assetDir = join(getReviewCasesDir(), input.caseId, 'source-docs')
  if (!existsSync(assetDir)) mkdirSync(assetDir, { recursive: true })
  const storedFileName = `${docId}-${fileName}`
  copyFileSync(filePath, join(assetDir, storedFileName))

  // 原件在案卷目录内的相对路径：统一用正斜杠，保证跨平台落盘一致。
  const assetRelativePath = `source-docs/${storedFileName}`

  // 解析（parseFileIntoSourceDocument 读取原件路径）
  reportProgress({ phase: 'extracting-text', message: `正在解析：${fileName}` })
  const document = await parseFileIntoSourceDocument(filePath, fileName, input.role, assetRelativePath, assetDir)
  const storedDocument: SourceDocument = { ...document, id: docId, origin: 'upload' }

  // 依据文件自动登记规则包：否则大纲生成与审核运行都找不到"依据包"（真机验证暴露的缺口）
  // M0/H05：只构造「新增」的包；写回时以队列内最新 rulePacks 为基底追加，不整体替换
  const newRulePack: RulePack | null =
    input.role === 'rule'
      ? {
          id: `pack-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          documentId: docId,
          // 名称取文件名去扩展名（用户可后续在 UI 改）；发布单位留空由用户补
          name: fileName.replace(/\.[^.]+$/, ''),
          publisher: '',
          academicYear: reviewCase.academicYear,
          version: 'v1',
          outline: [],
          confirmed: false,
        }
      : null

  // 写回案卷（M0/H05：逐案串行队列内读最新再定向追加，导入窗口内的其他写回不丢失；
  // 系统选择框打开期间案卷可能已变化，因此以队列内最新为基底，而不是调用前快照）
  await updateCase(
    input.caseId,
    (fresh) => ({
      ...invalidateDerivedReviewInputs(fresh, { applicationMaterialsChanged: input.role === 'application' }),
      documents: [...fresh.documents, storedDocument],
      ...(input.role === 'application' && fresh.subjectDocumentIds
        ? { subjectDocumentIds: [...new Set([...fresh.subjectDocumentIds, docId])] }
        : {}),
      rulePacks: newRulePack ? [...fresh.rulePacks, newRulePack] : fresh.rulePacks,
      // 证明材料同步登记证明卡（H01）：已收录、待识别——中栏立即可见，
      // 不再出现"导入成功但 0 份证明"；事实提取（识别）完成后更新为真实识别结果
      evidences:
        input.role === 'evidence' && !fresh.evidences.some((evidence) => evidence.documentId === docId)
          ? ([
              ...fresh.evidences,
              { documentId: docId, recognizedFacts: '', parseStatus: 'unrecognized', linkedItemIds: [] },
            ] as EvidenceDocument[])
          : fresh.evidences,
    }),
    { reason: `导入材料 ${fileName}（${storedDocument.parseStatus}）` },
  )
  await syncWorkspaceProjectionV2(input.caseId)
  reportProgress({
    phase: 'file-complete',
    completedFiles: input.fileIndex ?? 1,
    fileIndex: input.fileIndex ?? 1,
    fileCount: input.fileCount ?? 1,
    message: `已完成：${fileName}`,
  })
  console.log(
    `[审核专区] 已导入材料: ${fileName} → ${input.caseId}/${docId}（解析 ${storedDocument.parseStatus}` +
      `${input.role === 'rule' ? '，已登记规则包' : ''}）`,
  )
  return storedDocument
}

/** 将材料从当前审核输入中移出；原始文件与 V2 来源版本保留，供历史追溯。 */
export async function removeDocumentsFromCase(input: {
  caseId: string
  role: SourceDocument['role']
  documentIds?: string[]
}): Promise<ReviewCase> {
  assertSafeId(input.caseId)
  if (input.documentIds !== undefined && (!Array.isArray(input.documentIds) || input.documentIds.some((id) => typeof id !== 'string' || !id))) {
    throw new Error('参数 documentIds 非法')
  }
  const requestedIds = input.documentIds ? new Set(input.documentIds) : undefined
  if (requestedIds && requestedIds.size !== input.documentIds!.length) throw new Error('材料列表包含重复 ID')

  const updated = await updateCase(input.caseId, (fresh) => {
    const removed = fresh.documents.filter((document) => document.role === input.role && (!requestedIds || requestedIds.has(document.id)))
    if (removed.length === 0) throw new Error('当前案卷中没有可移除的对应材料')
    if (requestedIds && removed.length !== requestedIds.size) throw new Error('部分材料不存在或材料类型不匹配')

    const removedIds = new Set(removed.map((document) => document.id))
    const retainedItems = fresh.items.filter((item) => !(input.role === 'application' && removedIds.has(item.anchor.documentId)))
    const retainedItemIds = new Set(retainedItems.map((item) => item.id))
    const archivedById = new Map((fresh.archivedDocuments ?? []).map((document) => [document.id, document]))
    for (const document of removed) archivedById.set(document.id, document)

    return {
      ...invalidateDerivedReviewInputs(fresh, { applicationMaterialsChanged: input.role === 'application' }),
      documents: fresh.documents.filter((document) => !removedIds.has(document.id)),
      archivedDocuments: [...archivedById.values()],
      ...(input.role === 'rule'
        ? { rulePacks: fresh.rulePacks.filter((pack) => !removedIds.has(pack.documentId)) }
        : {}),
      ...(input.role === 'application'
        ? { subjectDocumentIds: fresh.subjectDocumentIds?.filter((documentId) => !removedIds.has(documentId)) }
        : {}),
      ...(input.role === 'evidence'
        ? {
            items: retainedItems.map((item) => ({
              ...item,
              evidenceDocumentIds: item.evidenceDocumentIds.filter((documentId) => !removedIds.has(documentId)),
            })),
            evidences: fresh.evidences.filter((evidence) => !removedIds.has(evidence.documentId)).map((evidence) => ({
              ...evidence,
              linkedItemIds: evidence.linkedItemIds.filter((itemId) => retainedItemIds.has(itemId)),
            })),
          }
        : {}),
    }
  }, { reason: `从当前审核中移除${input.role === 'rule' ? '审核依据' : input.role === 'application' ? '申报材料' : '证明材料'}` })
  await syncWorkspaceProjectionV2(input.caseId)
  return updated
}

/** 按审核员指定顺序重排同一材料栏；每份材料只允许出现一次。 */
export async function reorderDocumentsInCase(input: {
  caseId: string
  role: SourceDocument['role']
  documentIds: string[]
}): Promise<ReviewCase> {
  assertSafeId(input.caseId)
  if (!Array.isArray(input.documentIds) || input.documentIds.some((id) => typeof id !== 'string' || !id)) {
    throw new Error('参数 documentIds 非法')
  }
  if (new Set(input.documentIds).size !== input.documentIds.length) throw new Error('材料顺序包含重复 ID')

  const updated = await updateCase(input.caseId, (fresh) => {
    const roleDocuments = fresh.documents.filter((document) => document.role === input.role)
    if (roleDocuments.length !== input.documentIds.length || roleDocuments.some((document) => !input.documentIds.includes(document.id))) {
      throw new Error('材料顺序必须包含当前栏的全部文件')
    }
    const rank = new Map(input.documentIds.map((id, index) => [id, index]))
    const orderedDocuments = input.documentIds.map((id) => roleDocuments.find((document) => document.id === id)!)
    let nextIndex = 0
    const documents = fresh.documents.map((document) => document.role === input.role ? orderedDocuments[nextIndex++]! : document)
    const orderByDocument = (left: { documentId: string }, right: { documentId: string }): number =>
      (rank.get(left.documentId) ?? Number.MAX_SAFE_INTEGER) - (rank.get(right.documentId) ?? Number.MAX_SAFE_INTEGER)

    return {
      ...fresh,
      documents,
      ...(input.role === 'rule' ? { rulePacks: [...fresh.rulePacks].sort(orderByDocument) } : {}),
      ...(input.role === 'evidence' ? { evidences: [...fresh.evidences].sort(orderByDocument) } : {}),
      ...(input.role === 'application' ? {
        items: [...fresh.items].sort((left, right) =>
          (rank.get(left.anchor.documentId) ?? Number.MAX_SAFE_INTEGER) - (rank.get(right.anchor.documentId) ?? Number.MAX_SAFE_INTEGER)),
        ...(fresh.subjectDocumentIds
          ? { subjectDocumentIds: fresh.subjectDocumentIds.slice().sort((left, right) => (rank.get(left) ?? Number.MAX_SAFE_INTEGER) - (rank.get(right) ?? Number.MAX_SAFE_INTEGER)) }
          : {}),
      } : {}),
    }
  }, { reason: `调整${input.role === 'rule' ? '审核依据' : input.role === 'application' ? '申报材料' : '证明材料'}顺序` })
  await syncWorkspaceProjectionV2(input.caseId)
  return updated
}

/** 确认审核依据包并同步工作台规则。 */
export async function confirmRulePackInCase(caseId: string, rulePackId: string): Promise<ReviewCase> {
  const reviewCase = getCase(caseId)
  if (!reviewCase) throw new Error(`案卷不存在: ${caseId}`)
  if (!reviewCase.rulePacks.some((pack) => pack.id === rulePackId)) throw new Error(`审核依据不存在: ${rulePackId}`)
  const updated = await updateCase(caseId, (fresh) => ({
    ...fresh,
    rulePacks: fresh.rulePacks.map((pack) => pack.id === rulePackId ? { ...pack, confirmed: true } : pack),
  }), { reason: `审核员确认依据 ${rulePackId}` })
  await syncWorkspaceProjectionV2(caseId)
  return updated
}
