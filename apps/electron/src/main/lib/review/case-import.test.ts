/**
 * QA-261-INTAKE / INTAKE-LEGACY-IMPORT-PERSIST-AFTER-AWAIT
 *
 * 旧导入入口在 parse await 之后、updateCase 之前必须重新求值 persist 授权。
 * 这里用可控的慢解析端口和一个与真实 gate 语义一致的可控授权端口，验证：
 * - 解析期间授权过期、明确拒绝或授权服务异常时，不得写回案卷；
 * - 解析期间授权持续有效时，原件复制、角色投影和成功落盘行为保持不变。
 */
import { afterAll, describe, expect, mock, test } from 'bun:test'
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import type { ReviewCase, SourceDocument } from '@profer/shared'
import type {
  ReviewPreuploadDecision, ReviewPreuploadOperation, ReviewPreuploadScope,
} from './review-preupload-gate'

const root = mkdtempSync(join(tmpdir(), 'review-case-import-gate-'))
const inputDir = join(root, 'input')
mkdirSync(inputDir, { recursive: true })
process.env.PROFER_CONFIG_DIR = join(root, 'config')

type GateMode = 'valid' | 'expired' | 'denied' | 'throw'

const realGate = { ...(await import('./review-preupload-gate')) }
let gateMode: GateMode = 'valid'
let parseStarted = false
let parseEntered: () => void = () => {}
let parseEnteredPromise = Promise.resolve()
let releaseParse: () => void = () => {}
let parseReleasePromise = Promise.resolve()
const gateCalls: Array<{
  operation: ReviewPreuploadOperation
  caseId: string | undefined
  afterParseStart: boolean
}> = []

function resetParsePort(): void {
  parseStarted = false
  parseEnteredPromise = new Promise<void>((resolve) => { parseEntered = resolve })
  parseReleasePromise = new Promise<void>((resolve) => { releaseParse = resolve })
}
resetParsePort()

const realDocumentService = { ...(await import('./document-service')) }
mock.module('./document-service', () => ({
  ...realDocumentService,
  parseFileIntoSourceDocument: async (
    _filePath: string,
    fileName: string,
    role: SourceDocument['role'],
  ): Promise<SourceDocument> => {
    parseStarted = true
    parseEntered()
    await parseReleasePromise
    return {
      id: 'parser-placeholder',
      fileName,
      role,
      mimeType: 'text/plain',
      sizeBytes: 0,
      parseStatus: 'parsed',
      blocks: [{ id: 'blk-slow-parse-1', kind: 'paragraph', text: '慢解析返回的测试内容', page: 1 }],
      origin: 'upload',
      importedAt: new Date().toISOString(),
    }
  },
}))

const realCaseStore = { ...(await import('./case-store')) }
// 必须在 mock.module 改写 case-store 之前固定原函数值，wrapper 不能回读被变异的 namespace。
const realUpdateCase = realCaseStore.updateCase
const realSaveCase = realCaseStore.saveCase
let updateCaseCalls = 0
mock.module('./case-store', () => ({
  ...realCaseStore,
  updateCase: (...args: Parameters<typeof realUpdateCase>) => {
    updateCaseCalls += 1
    return realUpdateCase(...args)
  },
}))

/** 与 review-preupload-gate 相同的 fail-closed 求值顺序，仅把授权源替换为测试可控端口。 */
function evaluateTestAuthority(): ReviewPreuploadDecision | undefined {
  if (gateMode === 'throw') throw new Error('TEST_AUTHORITY_UNAVAILABLE')
  const decision: ReviewPreuploadDecision = {
    classification: 'ordinary',
    environment: 'local-controlled',
    authorization: 'confirmed',
    externalModelAuthorized: false,
    expiresAt: Date.now() + 30_000,
  }
  if (gateMode === 'expired') return { ...decision, expiresAt: Date.now() - 1 }
  if (gateMode === 'denied') return { ...decision, authorization: 'denied' }
  return decision
}

mock.module('./review-preupload-gate', () => ({
  ...realGate,
  assertReviewPreuploadAllowed(operation: ReviewPreuploadOperation, scope: ReviewPreuploadScope = {}): void {
    gateCalls.push({ operation, caseId: scope.caseId, afterParseStart: parseStarted })
    let decision: ReviewPreuploadDecision | undefined
    try {
      decision = evaluateTestAuthority()
    } catch {
      // 授权服务故障不降级；decision 保持 undefined，由真实纯函数统一拒绝。
    }
    if (!realGate.reviewPreuploadDecisionAllows(decision, operation, scope)) {
      throw new Error('REVIEW_PREUPLOAD_DENIED: ' + realGate.REVIEW_PREUPLOAD_OFFLINE_NOTICE)
    }
  },
}))

const { createEmptyCase } = await import('./case-creation')
const { getCase } = await import('./case-store')
const { importDocumentFromPath } = await import('./case-import')

afterAll(() => rmSync(root, { recursive: true, force: true }))

function makeCase(): ReviewCase {
  const reviewCase: ReviewCase = {
    ...createEmptyCase({
      title: '导入授权重验', type: '综合测评', applicant: '测试申请人', academicYear: '2025-2026',
    }),
    subjectDocumentIds: [],
  }
  realSaveCase(reviewCase)
  return reviewCase
}

function sourceFile(name: string, text: string): string {
  const filePath = join(inputDir, name)
  writeFileSync(filePath, text)
  return filePath
}

function startImport(caseId: string, sourcePath: string): Promise<SourceDocument> {
  gateMode = 'valid'
  gateCalls.length = 0
  updateCaseCalls = 0
  resetParsePort()
  return importDocumentFromPath({ caseId, sourcePath, role: 'application' })
}

describe('旧导入入口在慢解析后重验 persist 授权', () => {
  for (const mode of ['expired', 'denied', 'throw'] as const) {
    test(`parse await 期间授权变为 ${mode} 时拒绝且不 updateCase`, async () => {
      const reviewCase = makeCase()
      const pending = startImport(reviewCase.id, sourceFile(`slow-${mode}.txt`, `授权变化测试 ${mode}`))
      await parseEnteredPromise
      expect(parseStarted).toBeTrue()

      gateMode = mode
      const rejection = pending.then(
        () => { throw new Error('预期 persist 重验拒绝，但导入成功') },
        (error: unknown) => error,
      )
      releaseParse()
      const error = await rejection
      expect(error).toBeInstanceOf(Error)
      expect((error as Error).message).toContain('REVIEW_PREUPLOAD_DENIED')

      expect(updateCaseCalls).toBe(0)
      const after = getCase(reviewCase.id)!
      expect(after.documents).toHaveLength(0)
      expect(after.revision ?? 0).toBe(0)
      const postParseCalls = gateCalls.filter((call) => call.afterParseStart)
      expect(postParseCalls.map((call) => call.operation)).toContain('persist')
      expect(postParseCalls.every((call) => call.caseId === reviewCase.id)).toBeTrue()
    })
  }

  test('解析期间授权持续有效时保留复制原件与 role 投影的成功路径', async () => {
    const reviewCase = makeCase()
    const pending = startImport(reviewCase.id, sourceFile('slow-valid.txt', '有效授权下的慢解析内容'))
    await parseEnteredPromise
    expect(parseStarted).toBeTrue()
    expect(gateCalls.map((call) => call.operation)).toEqual(['read', 'persist'])

    releaseParse()
    const imported = await pending

    expect(imported.role).toBe('application')
    expect(imported.parseStatus).toBe('parsed')
    expect(imported.fileName).toBe('slow-valid.txt')
    expect(imported.id).toStartWith('doc-')
    expect(updateCaseCalls).toBe(1)

    const after = getCase(reviewCase.id)!
    expect(after.documents.map((document) => document.id)).toContain(imported.id)
    expect(after.subjectDocumentIds).toContain(imported.id)

    const copiedPath = join(root, 'config', 'review-cases', reviewCase.id, 'source-docs', `${imported.id}-slow-valid.txt`)
    expect(existsSync(copiedPath)).toBeTrue()
    expect(readFileSync(copiedPath, 'utf8')).toBe('有效授权下的慢解析内容')

    expect(gateCalls.map((call) => call.operation)).toEqual(['read', 'persist', 'persist'])
    expect(gateCalls.at(-1)).toMatchObject({
      operation: 'persist', caseId: reviewCase.id, afterParseStart: true,
    })
  })
})
