/**
 * C1 legacy compatibility boundary: the existing Renderer contract survives,
 * but never supplies authority to overwrite a native V2 Case or frozen Plan.
 */
import { afterAll, describe, expect, test } from 'bun:test'
import { rmSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { REVIEW_IPC_CHANNELS } from '@profer/shared'
import { setMainWindow } from '../main-window-state'
import { registerReviewIpc } from './review-ipc'
import { buildDemoCase } from './demo-fixtures/demo-case-fixture'
import { deleteCase, getCase, getReviewCasesDir, listCases, saveCase, updateCase } from './case-store'
import { createAggregate, listAggregatesV2, readAggregate, writeAggregate } from './case-store-v2'
import { ensureWorkspaceAggregateV2 } from './workspace-service-v2'
import { restoreReviewCaseV3 } from './case-lifecycle-v3'

const root = join(import.meta.dir, '../../../../../../work/tmp', `v3-c1-legacy-guard-${Date.now()}`)
process.env.PROFER_CONFIG_DIR = root
const handlers = (globalThis.__proferElectronTestHooks as typeof globalThis.__proferElectronTestHooks & {
  ipcMainHandlers: Map<string, (...args: unknown[]) => unknown>
}).ipcMainHandlers
const frame = { id: 1 }
const sender = { id: 207, mainFrame: frame, isDestroyed: () => false }
const event = { sender, senderFrame: frame }
const invoke = (channel: string, input: unknown, ev: unknown = event): unknown => {
  const handler = handlers.get(channel)
  if (!handler) throw new Error(`Missing handler ${channel}`)
  return handler(ev, input)
}
const legacy = (id: string) => ({ ...buildDemoCase(), id, title: 'Legacy original' })
afterAll(() => { setMainWindow(null); rmSync(root, { recursive: true, force: true }) })

/**
 * 现造一份最小但合法的多页 PDF（无第三方依赖）。
 *
 * 用途：验证「真实 PDF 材料」能经原生材料服务登记、解析出逐页文本层并读回原件字节，
 * 而不是只测 .txt。文本用 Helvetica 单字体，pdfjs 与 @profer/core 均能解析。
 */
function buildMinimalPdf(pageTexts: string[]): Uint8Array {
  const objects: string[] = []
  const pageObjNumbers = pageTexts.map((_, index) => 3 + index * 2)
  const fontObjNumber = 3 + pageTexts.length * 2
  objects[1] = '<< /Type /Catalog /Pages 2 0 R >>'
  objects[2] = `<< /Type /Pages /Kids [${pageObjNumbers.map((n) => `${n} 0 R`).join(' ')}] /Count ${pageTexts.length} >>`
  for (const [index, pageNumber] of pageObjNumbers.entries()) {
    const contentNumber = pageNumber + 1
    const stream = `BT /F1 14 Tf 60 760 Td (${pageTexts[index]!.replace(/[()\\]/g, '')}) Tj ET`
    objects[pageNumber] = `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] `
      + `/Resources << /Font << /F1 ${fontObjNumber} 0 R >> >> /Contents ${contentNumber} 0 R >>`
    objects[contentNumber] = `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`
  }
  objects[fontObjNumber] = '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>'

  let out = '%PDF-1.4\n'
  const offsets: number[] = []
  for (let number = 1; number < objects.length; number++) {
    offsets[number] = out.length
    out += `${number} 0 obj\n${objects[number]}\nendobj\n`
  }
  const xrefStart = out.length
  out += `xref\n0 ${objects.length}\n0000000000 65535 f \n`
  for (let number = 1; number < objects.length; number++) out += `${String(offsets[number]).padStart(10, '0')} 00000 n \n`
  out += `trailer\n<< /Size ${objects.length} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF\n`
  return new TextEncoder().encode(out)
}

/** 现造一份最小但合法的 DOCX（OOXML zip）：标题 + 段落 + 表格，供 mammoth 结构解析。 */
async function buildReviewDocx(): Promise<Buffer> {
  const { default: JSZip } = await import('jszip')
  const zip = new JSZip()
  zip.file('[Content_Types].xml', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
    + '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">'
    + '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>'
    + '<Default Extension="xml" ContentType="application/xml"/>'
    + '<Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>'
    + '<Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>'
    + '</Types>')
  zip.folder('_rels')!.file('.rels', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
    + '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
    + '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>'
    + '</Relationships>')
  // 定义 Heading1 样式：否则 mammoth 会告警"样式被引用但未定义"，材料只能记为 partial。
  zip.folder('word')!.file('styles.xml', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
    + '<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">'
    + '<w:style w:type="paragraph" w:styleId="Heading1"><w:name w:val="heading 1"/></w:style>'
    + '</w:styles>')
  zip.folder('word')!.folder('_rels')!.file('document.xml.rels', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
    + '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
    + '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>'
    + '</Relationships>')
  zip.folder('word')!.file('document.xml', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
    + '<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>'
    + '<w:p><w:pPr><w:pStyle w:val="Heading1"/></w:pPr><w:r><w:t>Eligibility requirements</w:t></w:r></w:p>'
    + '<w:p><w:r><w:t>Applicant must submit the certificate before the deadline.</w:t></w:r></w:p>'
    + '<w:tbl><w:tr><w:tc><w:p><w:r><w:t>Applicant</w:t></w:r></w:p></w:tc>'
    + '<w:tc><w:p><w:r><w:t>Deadline</w:t></w:r></w:p></w:tc></w:tr></w:tbl>'
    + '</w:body></w:document>')
  return zip.generateAsync({ type: 'nodebuffer' })
}

describe('C1 legacy Main command isolation and compatibility', () => {
  test('legacy CREATE_CASE rejects forged window and subframe without V1/V2 write', async () => {
    handlers.clear()
    setMainWindow({ isDestroyed: () => false, webContents: sender } as never)
    registerReviewIpc()
    const input = { title: 'Trusted new', type: '综合测评', applicant: 'Applicant', academicYear: '2026' }
    const before = getReviewCasesDir()
    await expect(Promise.resolve(invoke(REVIEW_IPC_CHANNELS.CREATE_CASE, input,
      { sender: { ...sender }, senderFrame: frame }))).rejects.toThrow('SENDER_UNTRUSTED')
    await expect(Promise.resolve(invoke(REVIEW_IPC_CHANNELS.CREATE_CASE, input,
      { sender, senderFrame: { id: 2 } }))).rejects.toThrow('SENDER_UNTRUSTED')
    const { readdirSync } = await import('node:fs')
    expect(readdirSync(before).filter(n => n.startsWith('case-'))).toEqual([])
  })

  test('existing CREATE_CASE UI channel now creates native-only durable Case + receipt before a read-only projection', async () => {
    const input = { title: 'Legal application', type: '综合测评', applicant: 'Applicant', academicYear: '2026' }
    const result = await Promise.resolve(invoke(REVIEW_IPC_CHANNELS.CREATE_CASE, input)) as { id: string; title: string }
    expect(result.title).toBe('Legal application')
    expect(getCase(result.id)?.id).toBe(result.id)
    const state = readAggregate(result.id)!
    expect(state.caseV2.id).toBe(result.id)
    expect(state.caseV2.stage).toBe('draft')
    expect(state.receiptLog).toHaveLength(1)
    expect(state.receiptLog[0]).toMatchObject({
      type: 'CreateNativeWorkspaceCaseV3', revision: 0,
      actor: { actorId: 'local-reviewer', actorSource: 'local', role: 'reviewer' },
    })
    const { existsSync } = await import('node:fs')
    expect(existsSync(join(getReviewCasesDir(), result.id, 'case.json'))).toBe(false)
    expect(existsSync(join(getReviewCasesDir(), result.id, 'case.v2.json'))).toBe(false)
    expect(listCases().some(c => c.id === result.id && c.applicant === input.applicant)).toBe(true)
    const migration = await Promise.resolve(invoke(REVIEW_IPC_CHANNELS.MIGRATE_CASE_V2, result.id)) as {
      migrated: boolean; caseV2: { id: string }
    }
    expect(migration.migrated).toBe(true)
    expect(migration.caseV2.id).toBe(result.id)
    expect(existsSync(join(getReviewCasesDir(), result.id, 'case.v2.json'))).toBe(false)
    expect((await ensureWorkspaceAggregateV2(result.id)).caseV2.revision).toBe(0)
    expect(readAggregate(result.id)?.receiptLog).toHaveLength(1)
  })

  test('native-first workbench title and type updates use one V2 CAS receipt, no V1 writer', async () => {
    const input = { title: 'Native settings', type: '综合测评', applicant: 'Case author', academicYear: '2026' }
    const created = await Promise.resolve(invoke(REVIEW_IPC_CHANNELS.CREATE_CASE, input)) as { id: string }
    const updated = await Promise.resolve(invoke(REVIEW_IPC_CHANNELS.UPDATE_CASE_SETTINGS, {
      caseId: created.id, title: 'Retitled native', type: '活动申请',
    })) as { title: string; type: string }
    expect(updated).toMatchObject({ title: 'Retitled native', type: '活动申请' })
    const state = readAggregate(created.id)!
    expect(state.caseV2.revision).toBe(1)
    expect(state.receiptLog.map(r => r.type)).toEqual([
      'CreateNativeWorkspaceCaseV3', 'UpdateNativeWorkspaceSettingsV3',
    ])
    expect(getCase(created.id)).toMatchObject({ title: 'Retitled native', type: '活动申请' })
    const { existsSync } = await import('node:fs')
    expect(existsSync(join(getReviewCasesDir(), created.id, 'case.json'))).toBe(false)
    const rules = [{ id: 'r', title: 'Local review reminder', requirement: '手写核对提醒，不代表正式校方规则' }]
    const saved = await Promise.resolve(invoke(REVIEW_IPC_CHANNELS.UPDATE_CASE_SETTINGS, {
      caseId: created.id, manualRules: rules,
    })) as { manualRules?: typeof rules }
    expect(saved.manualRules).toEqual(rules)
    expect(readAggregate(created.id)?.caseV2.nativeWorkspaceDraft?.manualRules).toEqual(rules)
    expect(readAggregate(created.id)?.canonicalPlan).toBeUndefined()
    expect(readAggregate(created.id)?.caseV2.revision).toBe(2)
    const before = JSON.stringify(readAggregate(created.id))
    await expect(Promise.resolve(invoke(REVIEW_IPC_CHANNELS.UPDATE_CASE_SETTINGS, {
      caseId: created.id, manualRules: [{ id: '../invalid', title: 'Rule', requirement: 'Rejected' }],
    }))).rejects.toThrow('手写规则无效')
    expect(JSON.stringify(readAggregate(created.id))).toBe(before)
    await Promise.resolve(invoke(REVIEW_IPC_CHANNELS.DELETE_CASE, created.id))
    expect(getCase(created.id)).toBeUndefined()
    const archived = readAggregate(created.id)!
    await Promise.resolve(invoke(REVIEW_IPC_CHANNELS.RESTORE_CASE_V3, {
      caseId: created.id, expectedRevision: archived.caseV2.revision,
      reason: '用户明确恢复原生案卷',
    }))
    expect(getCase(created.id)?.title).toBe('Retitled native')
    expect(listCases().some(c => c.id === created.id)).toBe(true)
    expect(existsSync(join(getReviewCasesDir(), created.id, 'case.json'))).toBe(false)
  })

  test('native V2 colliding with a legacy shadow is immutable through low-level V1 updateCase', async () => {
    const id = 'v3-c1-native-legacy-shadow'
    saveCase(legacy(id))
    const origin = await ensureWorkspaceAggregateV2(id)
    const nativeId = 'v3-c1-native-shadow-collision'
    saveCase(legacy(nativeId))
    await createAggregate(nativeId, { ...origin.caseV2, id: nativeId, title: 'Authoritative V2', revision: 0 }, {
      requestId: `create-${nativeId}`, type: 'CreateCaseFromTemplate',
      payloadHash: 'a'.repeat(64), revision: 0, at: new Date().toISOString(),
      summary: 'Native origin', actor: { actorId: 'local-reviewer', actorSource: 'local', role: 'reviewer' },
    })
    const shadowPath = join(getReviewCasesDir(), nativeId, 'case.json')
    const beforeV1 = readFileSync(shadowPath, 'utf8')
    const beforeV2 = JSON.stringify(readAggregate(nativeId))
    // Legacy list/read paths must not surface the stale same-ID shadow as a
    // separate current Case; native V2 list still exposes the actual Case.
    expect(getCase(nativeId)).toBeUndefined()
    expect(listCases().some(c => c.id === nativeId)).toBe(false)
    expect(listAggregatesV2().some(c => c.caseId === nativeId)).toBe(true)
    expect(invoke(REVIEW_IPC_CHANNELS.GET_CASE, nativeId)).toBeUndefined()
    expect((invoke(REVIEW_IPC_CHANNELS.LIST_CASES, undefined) as Array<{ id: string }>)
      .some(c => c.id === nativeId)).toBe(false)
    expect((invoke(REVIEW_IPC_CHANNELS.LIST_CASES_V2, undefined) as Array<{ caseId: string }>)
      .some(c => c.caseId === nativeId)).toBe(true)
    expect(() => saveCase({ ...legacy(nativeId), title: 'Direct V1 shadow overwrite' }))
      .toThrow('原生审核案卷禁止')
    expect(readFileSync(shadowPath, 'utf8')).toBe(beforeV1)
    await expect(updateCase(nativeId, current => ({ ...current, title: 'Attempted rewrite' })))
      .rejects.toThrow('原生审核案卷禁止')
    expect(readFileSync(shadowPath, 'utf8')).toBe(beforeV1)
    expect(JSON.stringify(readAggregate(nativeId))).toBe(beforeV2)

    await expect(Promise.resolve(invoke(REVIEW_IPC_CHANNELS.UPDATE_CASE_SETTINGS, {
      caseId: nativeId, title: 'IPC bypass attempt',
    }))).rejects.toThrow('原生审核案卷禁止')
    expect(readFileSync(shadowPath, 'utf8')).toBe(beforeV1)
    expect(JSON.stringify(readAggregate(nativeId))).toBe(beforeV2)
  })

  test('corrupt native aggregate does not silently fall back to writable legacy case.json', async () => {
    const id = 'v3-c1-corrupt-native'
    saveCase(legacy(id))
    const { mkdirSync } = await import('node:fs')
    mkdirSync(join(getReviewCasesDir(), id), { recursive: true })
    writeFileSync(join(getReviewCasesDir(), id, 'state.v2.json'), '{invalid-json', 'utf8')
    const shadowPath = join(getReviewCasesDir(), id, 'case.json')
    const before = readFileSync(shadowPath, 'utf8')
    expect(getCase(id)).toBeUndefined()
    expect(listCases().some(c => c.id === id)).toBe(false)
    expect(() => saveCase({ ...legacy(id), title: 'corrupt state overwritten' }))
      .toThrow('原生审核案卷禁止')
    await expect(updateCase(id, original => ({ ...original, title: 'silent downgrade' })))
      .rejects.toThrow('原生审核案卷禁止')
    expect(readFileSync(shadowPath, 'utf8')).toBe(before)
  })

  test('old DELETE_CASE soft-archives native and migrated V2 without destroying historical receipts', async () => {
    const nativeId = 'v3-c1-native-archive-from-old-ui'
    const seedId = 'v3-c1-migrated-archive-from-old-ui'
    saveCase(legacy(seedId))
    const initial = await ensureWorkspaceAggregateV2(seedId)
    await createAggregate(nativeId, {
      ...initial.caseV2, id: nativeId, title: 'Native protected from physical delete', revision: 0,
    }, {
      requestId: `create-${nativeId}`, type: 'CreateCaseFromTemplate',
      payloadHash: 'a'.repeat(64), revision: 0, at: new Date().toISOString(),
      summary: 'Durable native receipt', actor: { actorId: 'local-reviewer', actorSource: 'local', role: 'reviewer' },
    })
    const nativeBefore = readAggregate(nativeId)!
    await Promise.resolve(invoke(REVIEW_IPC_CHANNELS.DELETE_CASE, nativeId))
    const nativeAfter = readAggregate(nativeId)!
    expect(nativeAfter.caseV2.stage).toBe('archived')
    expect(nativeAfter.caseArchive?.previousStage).toBe(nativeBefore.caseV2.stage)
    expect(nativeAfter.receiptLog).toHaveLength(nativeBefore.receiptLog.length + 1)
    expect(nativeAfter.receiptLog.at(-1)?.type).toBe('ArchiveReviewCaseV3')
    expect(listAggregatesV2().some(c => c.caseId === nativeId && c.stage === 'archived')).toBe(true)
    expect(getCase(nativeId)).toBeUndefined()
    // Durable archive replays without incrementing revision or receipt count.
    const snapshot = JSON.stringify(nativeAfter)
    await Promise.resolve(invoke(REVIEW_IPC_CHANNELS.DELETE_CASE, nativeId))
    expect(JSON.stringify(readAggregate(nativeId))).toBe(snapshot)
    expect(() => deleteCase(nativeId)).toThrow('禁止通过旧版删除入口')

    const migratedBefore = readAggregate(seedId)!
    await Promise.resolve(invoke(REVIEW_IPC_CHANNELS.DELETE_CASE, seedId))
    const migratedAfter = readAggregate(seedId)!
    expect(migratedAfter.caseV2.stage).toBe('archived')
    expect(migratedAfter.receiptLog.length).toBe(migratedBefore.receiptLog.length + 1)
    expect(getCase(seedId)).toBeUndefined()
    expect(listCases().some(c => c.id === seedId)).toBe(false)
    expect(() => deleteCase(seedId)).toThrow('禁止通过旧版删除入口')

    await expect(Promise.resolve(invoke(REVIEW_IPC_CHANNELS.DELETE_CASE, nativeId,
      { sender, senderFrame: { id: 9 } }))).rejects.toThrow('SENDER_UNTRUSTED')
    expect(JSON.stringify(readAggregate(nativeId))).toBe(snapshot)
  })

  test('pure V1-only draft can still be deleted through its existing UI command', async () => {
    const id = 'v3-c1-pure-v1-removable'
    saveCase(legacy(id))
    expect(getCase(id)).toBeDefined()
    expect(readAggregate(id)).toBeUndefined()
    await Promise.resolve(invoke(REVIEW_IPC_CHANNELS.DELETE_CASE, id))
    expect(getCase(id)).toBeUndefined()
    expect(readAggregate(id)).toBeUndefined()
  })

  test('valid JSON missing V2 shape cannot expose V1 shadow, archive or remove files', async () => {
    const id = 'v3-c1-malformed-native-json'
    saveCase(legacy(id))
    const { mkdirSync } = await import('node:fs')
    mkdirSync(join(getReviewCasesDir(), id), { recursive: true })
    const state = join(getReviewCasesDir(), id, 'state.v2.json')
    const shadow = join(getReviewCasesDir(), id, 'case.json')
    writeFileSync(state, '{}', 'utf8')
    const oldShadow = readFileSync(shadow, 'utf8')
    expect(getCase(id)).toBeUndefined()
    expect(listCases().some(x => x.id === id)).toBe(false)
    await expect(Promise.resolve(invoke(REVIEW_IPC_CHANNELS.DELETE_CASE, id)))
      .rejects.toThrow('V2 状态损坏')
    expect(readFileSync(shadow, 'utf8')).toBe(oldShadow)
    expect(readFileSync(state, 'utf8')).toBe('{}')
  })

  test('frozen CanonicalPlan forbids legacy settings upgrade before either file changes', async () => {
    const id = 'v3-c1-plan-frozen-legacy'
    saveCase(legacy(id))
    const original = await ensureWorkspaceAggregateV2(id)
    writeAggregate({
      ...original, canonicalPlan: {
        schemaVersion: 'review-c0/1', planId: 'frozen-plan', fingerprint: 'frozen-fingerprint',
        templateId: original.caseV2.templateId, templateVersion: String(original.caseV2.templateVersion),
        moduleDigests: [], bindings: [],
      },
    })
    const beforeV1 = JSON.stringify(getCase(id))
    const beforeV2 = JSON.stringify(readAggregate(id))
    await expect(Promise.resolve(invoke(REVIEW_IPC_CHANNELS.UPDATE_CASE_SETTINGS, {
      caseId: id, manualRules: [{ id: 'rule-1', title: 'Silent override', requirement: 'skip frozen check' }],
    }))).rejects.toThrow('审核计划已冻结')
    expect(JSON.stringify(getCase(id))).toBe(beforeV1)
    expect(JSON.stringify(readAggregate(id))).toBe(beforeV2)
  })

  test('existing migrated legacy case can still edit ordinary title and project it to V2', async () => {
    const id = 'v3-c1-legacy-title-update'
    saveCase(legacy(id))
    const first = await ensureWorkspaceAggregateV2(id)
    expect(() => saveCase({ ...legacy(id), title: 'Direct legacy edit allowed' })).not.toThrow()
    const updated = await Promise.resolve(invoke(REVIEW_IPC_CHANNELS.UPDATE_CASE_SETTINGS, {
      caseId: id, title: 'User revised title',
    })) as { title: string }
    expect(updated.title).toBe('User revised title')
    const after = readAggregate(id)!
    expect(after.caseV2.title).toBe('User revised title')
    expect(after.caseV2.revision).toBeGreaterThan(first.caseV2.revision)
  })

  test('legacy DELETE_CASE replays only within one archive cycle; restore enables a fresh archive', async () => {
    const id = 'v3-c1-legacy-delete-two-cycles'
    saveCase(legacy(id))
    const initial = await ensureWorkspaceAggregateV2(id)
    const createRevision = initial.caseV2.revision

    await Promise.resolve(invoke(REVIEW_IPC_CHANNELS.DELETE_CASE, id))
    const first = readAggregate(id)!
    expect(first.caseV2.stage).toBe('archived')
    const firstReceipt = first.receiptLog.at(-1)!
    expect(firstReceipt.type).toBe('ArchiveReviewCaseV3')
    await Promise.resolve(invoke(REVIEW_IPC_CHANNELS.DELETE_CASE, id))
    expect(JSON.stringify(readAggregate(id))).toBe(JSON.stringify(first))

    const trustedActor = { actorId: 'local-reviewer', actorSource: 'local' as const, role: 'reviewer' as const }
    const restored = await restoreReviewCaseV3(id, {
      requestId: 'explicit-restore-after-old-remove-1',
      expectedRevision: first.caseV2.revision,
      actor: trustedActor,
      payload: { reason: '用户确认恢复后重新审核' },
    })
    expect(restored.ok).toBe(true)
    expect(readAggregate(id)?.caseV2.stage).toBe('draft')

    // A forged Renderer frame must not consume the new cycle's request or
    // advance its revision before a legitimate Main-frame removal.
    const beforeSpoof = JSON.stringify(readAggregate(id))
    await expect(Promise.resolve(invoke(REVIEW_IPC_CHANNELS.DELETE_CASE, id,
      { sender, senderFrame: { id: 99 } }))).rejects.toThrow('SENDER_UNTRUSTED')
    expect(JSON.stringify(readAggregate(id))).toBe(beforeSpoof)

    await Promise.resolve(invoke(REVIEW_IPC_CHANNELS.DELETE_CASE, id))
    const second = readAggregate(id)!
    expect(second.caseV2.stage).toBe('archived')
    expect(second.caseV2.revision).toBe(createRevision + 3)
    expect(second.receiptLog.filter(r => r.type === 'ArchiveReviewCaseV3')).toHaveLength(2)
    const secondReceipt = second.receiptLog.at(-1)!
    expect(secondReceipt.requestId).not.toBe(firstReceipt.requestId)
    expect(secondReceipt.revision).toBe(firstReceipt.revision + 2)
    expect(second.caseArchiveHistory).toHaveLength(1)
    const afterSecond = JSON.stringify(second)
    await Promise.resolve(invoke(REVIEW_IPC_CHANNELS.DELETE_CASE, id))
    expect(JSON.stringify(readAggregate(id))).toBe(afterSecond)

    const secondRestore = await restoreReviewCaseV3(id, {
      requestId: 'explicit-restore-after-old-remove-2',
      expectedRevision: second.caseV2.revision,
      actor: trustedActor,
      payload: { reason: '用户再次确认恢复重审' },
    })
    expect(secondRestore.ok).toBe(true)
    await Promise.resolve(invoke(REVIEW_IPC_CHANNELS.DELETE_CASE, id))
    const third = readAggregate(id)!
    expect(third.caseV2.stage).toBe('archived')
    expect(third.caseV2.revision).toBe(createRevision + 5)
    expect(third.receiptLog.filter(r => r.type === 'ArchiveReviewCaseV3')).toHaveLength(3)
    expect(new Set(third.receiptLog.filter(r => r.type === 'ArchiveReviewCaseV3')
      .map(r => r.requestId)).size).toBe(3)
    expect(third.caseArchiveHistory).toHaveLength(2)
  })


  test('RESTORE_CASE_V3 derives Main Actor and receipt; stale, forged and cross-cycle requests fail closed', async () => {
    const id = 'v3-c1-main-trusted-restore'
    saveCase(legacy(id))
    const initial = await ensureWorkspaceAggregateV2(id)
    writeAggregate({ ...initial, caseV2: { ...initial.caseV2, stage: 'decided' } })
    await Promise.resolve(invoke(REVIEW_IPC_CHANNELS.DELETE_CASE, id))
    const archived = readAggregate(id)!
    const input = {
      caseId: id, expectedRevision: archived.caseV2.revision,
      reason: '用户明确要求恢复案卷并重新审核',
    }
    const bytes = JSON.stringify(archived)
    await expect(Promise.resolve(invoke(REVIEW_IPC_CHANNELS.RESTORE_CASE_V3, {
      ...input, expectedRevision: initial.caseV2.revision,
    }))).rejects.toThrow('VERSION_CONFLICT')
    await expect(Promise.resolve(invoke(REVIEW_IPC_CHANNELS.RESTORE_CASE_V3, {
      ...input, actor: { actorId: 'fake-school', actorSource: 'school', role: 'teacher' },
    }))).rejects.toThrow('ACTOR_UNTRUSTED')
    await expect(Promise.resolve(invoke(REVIEW_IPC_CHANNELS.RESTORE_CASE_V3, {
      ...input, requestId: 'renderer-controls-replay',
    }))).rejects.toThrow('ACTOR_UNTRUSTED')
    await expect(Promise.resolve(invoke(REVIEW_IPC_CHANNELS.RESTORE_CASE_V3, input,
      { sender, senderFrame: { id: 11 } }))).rejects.toThrow('SENDER_UNTRUSTED')
    expect(JSON.stringify(readAggregate(id))).toBe(bytes)

    const restored = await Promise.resolve(invoke(REVIEW_IPC_CHANNELS.RESTORE_CASE_V3, input)) as {
      ok: boolean; receipt: { type: string; requestId: string; actor: { actorId: string } }
    }
    expect(restored.ok).toBe(true)
    expect(restored.receipt.type).toBe('RestoreReviewCaseV3')
    expect(restored.receipt.actor.actorId).toBe('local-reviewer')
    const after = readAggregate(id)!
    expect(after.caseV2.stage).toBe('draft')
    expect(after.caseArchive?.previousStage).toBe('decided')
    expect(after.caseV2.revision).toBe(archived.caseV2.revision + 1)
    await Promise.resolve(invoke(REVIEW_IPC_CHANNELS.RESTORE_CASE_V3, input))
    expect(JSON.stringify(readAggregate(id))).toBe(JSON.stringify(after))

    await Promise.resolve(invoke(REVIEW_IPC_CHANNELS.DELETE_CASE, id))
    const secondArchive = readAggregate(id)!
    const second = await Promise.resolve(invoke(REVIEW_IPC_CHANNELS.RESTORE_CASE_V3, {
      ...input, expectedRevision: secondArchive.caseV2.revision,
    })) as { ok: boolean; receipt: { requestId: string } }
    expect(second.ok).toBe(true)
    expect(second.receipt.requestId).not.toBe(restored.receipt.requestId)
    expect(readAggregate(id)?.receiptLog.filter(r => r.type === 'RestoreReviewCaseV3')).toHaveLength(2)
    expect(readAggregate(id)?.caseV2.stage).toBe('draft')
  })


  test('one malformed native summary cannot hide valid archived Cases or forge cross-case IDs', async () => {
    const goodId = 'v3-c1-valid-summary-survives-corrupt'
    const badId = 'v3-c1-bad-native-summary'
    const crossedId = 'v3-c1-cross-directory-summary'
    saveCase(legacy(goodId))
    const initial = await ensureWorkspaceAggregateV2(goodId)
    await Promise.resolve(invoke(REVIEW_IPC_CHANNELS.DELETE_CASE, goodId))
    const archived = readAggregate(goodId)!
    expect(archived.caseV2.stage).toBe('archived')

    const { mkdirSync } = await import('node:fs')
    mkdirSync(join(getReviewCasesDir(), badId), { recursive: true })
    mkdirSync(join(getReviewCasesDir(), crossedId), { recursive: true })
    writeFileSync(join(getReviewCasesDir(), badId, 'state.v2.json'), '{}', 'utf8')
    writeFileSync(join(getReviewCasesDir(), crossedId, 'state.v2.json'),
      JSON.stringify({ ...archived, caseV2: { ...archived.caseV2, title: 'Wrong path owner' } }), 'utf8')

    const summaries = listAggregatesV2()
    expect(summaries.find(c => c.caseId === goodId)).toMatchObject({
      stage: 'archived', revision: initial.caseV2.revision + 1,
    })
    expect(summaries.some(c => c.caseId === badId || c.caseId === crossedId)).toBe(false)
    const viaMain = invoke(REVIEW_IPC_CHANNELS.LIST_CASES_V2, undefined) as Array<{ caseId: string }>
    expect(viaMain.some(c => c.caseId === goodId)).toBe(true)
    expect(viaMain.some(c => c.caseId === badId || c.caseId === crossedId)).toBe(false)
  })


  test('native-first legacy workbench material flow commits only V2 receipts; spoofed Main cannot register', async () => {
    const sourceA = join(root, 'native-material-a.txt')
    const sourceB = join(root, 'native-material-b.txt')
    writeFileSync(sourceA, 'Evidence A physical text source', 'utf8')
    writeFileSync(sourceB, 'Evidence B physical text source', 'utf8')
    const created = await Promise.resolve(invoke(REVIEW_IPC_CHANNELS.CREATE_CASE, {
      title: 'Native material workspace', type: '综合测评', applicant: 'Applicant', academicYear: '2026',
    })) as { id: string }
    const starting = readAggregate(created.id)!
    const inputA = { caseId: created.id, sourcePath: sourceA, role: 'evidence' }
    await expect(Promise.resolve(invoke(REVIEW_IPC_CHANNELS.IMPORT_DOCUMENT_FROM_PATH, inputA,
      { sender, senderFrame: { id: 999 } }))).rejects.toThrow('SENDER_UNTRUSTED')
    expect(JSON.stringify(readAggregate(created.id))).toBe(JSON.stringify(starting))

    // 拖拽/路径导入现在由主进程原生材料服务承载（REGISTER_MATERIAL_PATH_V2 → isNativeWorkspaceCaseV3
    // → registerNativeWorkspaceMaterialV3 → registerMaterial），受信 Main 传来的纯路径字符串会被真实
    // 登记成 V2 RegisterMaterial 回执。旧断言要求 SOURCE_CAPABILITY_REQUIRED，那是该通道尚未接入
    // 原生材料服务时的行为，已过期；这里改为断言新的真实行为。
    const aVersionId = await Promise.resolve(invoke(REVIEW_IPC_CHANNELS.REGISTER_MATERIAL_PATH_V2, {
      caseId: created.id, sourcePath: sourceA, role: 'evidence',
    })) as string
    expect(typeof aVersionId).toBe('string')
    const afterPathRegister = readAggregate(created.id)!
    // ASSET-05：两条登记通道统一返回 DocumentVersion.versionId（渲染层也按 versionId 使用）。
    const registeredA = afterPathRegister.caseV2.documents.find(doc => doc.versionId === aVersionId)
    expect(registeredA).toMatchObject({ fileName: 'native-material-a.txt', role: 'evidence', active: true })
    expect(afterPathRegister.receiptLog.at(-1)).toMatchObject({ type: 'RegisterMaterial' })

    // 伪造 sender/frame 仍被拒绝，且不产生新的材料或回执（安全边界不因新路径放宽）。
    const beforeForged = JSON.stringify(readAggregate(created.id))
    await expect(Promise.resolve(invoke(REVIEW_IPC_CHANNELS.REGISTER_MATERIAL_PATH_V2, {
      caseId: created.id, sourcePath: sourceA, role: 'evidence',
    }, { sender, senderFrame: { id: 55 } }))).rejects.toThrow('SENDER_UNTRUSTED')
    expect(JSON.stringify(readAggregate(created.id))).toBe(beforeForged)

    // A 已在上面通过拖拽/路径通道真实登记，这里不再重复导入（同槽位同名会形成新版本并停用旧版本）。
    const a = { id: registeredA!.documentId, versionId: registeredA!.versionId, fileName: registeredA!.fileName, parseStatus: registeredA!.parseStatus }
    const b = await Promise.resolve(invoke(REVIEW_IPC_CHANNELS.IMPORT_DOCUMENT_FROM_PATH, {
      caseId: created.id, sourcePath: sourceB, role: 'evidence',
    })) as { id: string; fileName: string }
    expect(a.fileName).toBe('native-material-a.txt')
    expect(b.fileName).toBe('native-material-b.txt')
    const state = readAggregate(created.id)!
    expect(state.caseV2.documents.filter(doc => doc.active !== false)).toHaveLength(2)
    expect(state.receiptLog.map(receipt => receipt.type)).toEqual([
      'CreateNativeWorkspaceCaseV3', 'RegisterMaterial', 'RegisterMaterial',
    ])
    expect(getCase(created.id)?.documents.map(doc => doc.id)).toEqual([a.id, b.id])
    const { existsSync, readFileSync } = await import('node:fs')
    const first = state.caseV2.documents.find(doc => doc.documentId === a.id)!
    expect(readFileSync(join(getReviewCasesDir(), created.id, first.assetPath), 'utf8'))
      .toBe('Evidence A physical text source')
    expect(existsSync(join(getReviewCasesDir(), created.id, 'case.json'))).toBe(false)

    const ordered = await Promise.resolve(invoke(REVIEW_IPC_CHANNELS.REORDER_DOCUMENTS, {
      caseId: created.id, role: 'evidence', documentIds: [b.id, a.id],
    })) as { documents: Array<{ id: string }> }
    expect(ordered.documents.map(doc => doc.id)).toEqual([b.id, a.id])
    const retired = await Promise.resolve(invoke(REVIEW_IPC_CHANNELS.REMOVE_DOCUMENTS, {
      caseId: created.id, role: 'evidence', documentIds: [b.id],
    })) as { documents: Array<{ id: string }>; archivedDocuments?: Array<{ id: string }> }
    expect(retired.documents.map(doc => doc.id)).toEqual([a.id])
    expect(retired.archivedDocuments?.map(doc => doc.id)).toContain(b.id)
    const after = readAggregate(created.id)!
    expect(after.caseV2.revision).toBe(4)
    expect(after.receiptLog.slice(-2).map(x => x.type)).toEqual([
      'ReorderNativeWorkspaceDocumentsV3', 'ArchiveNativeWorkspaceDocumentsV3',
    ])
    expect(after.caseV2.documents.find(doc => doc.documentId === b.id)?.active).toBe(false)
    expect(after.sourceValidityRevocations?.some(x => x.documentVersionId ===
      after.caseV2.documents.find(doc => doc.documentId === b.id)?.versionId)).toBe(true)
    expect(existsSync(join(getReviewCasesDir(), created.id, 'case.json'))).toBe(false)
  })

  test('native drag-drop path import registers a real multi-page PDF and DOCX with readable originals', async () => {
    const created = await Promise.resolve(invoke(REVIEW_IPC_CHANNELS.CREATE_CASE, {
      title: 'Real physical material', type: '综合测评', applicant: 'Applicant', academicYear: '2026',
    })) as { id: string }

    // 真实多页 PDF：手写最小合法 PDF（不引入任何新依赖），三页各有独立文本层。
    const pdfSource = join(root, 'real-material.pdf')
    const pdfBytes = buildMinimalPdf(['CDUT page one evidence', 'CDUT page two evidence', 'CDUT page three evidence'])
    writeFileSync(pdfSource, pdfBytes)

    const pdfId = await Promise.resolve(invoke(REVIEW_IPC_CHANNELS.REGISTER_MATERIAL_PATH_V2, {
      caseId: created.id, sourcePath: pdfSource, role: 'evidence',
    })) as string
    expect(typeof pdfId).toBe('string')

    const afterPdf = readAggregate(created.id)!
    const pdfDoc = afterPdf.caseV2.documents.find(doc => doc.versionId === pdfId)!
    expect(pdfDoc).toMatchObject({ fileName: 'real-material.pdf', role: 'evidence', active: true })
    // 真实解析：三页文本层都进入材料块，不是空占位（引擎同时写入锚点/定位行，故按内容断言）
    const pdfText = pdfDoc.blocks.map(block => block.text).join('\n')
    expect(pdfDoc.blocks.length).toBeGreaterThanOrEqual(3)
    expect(pdfText).toContain('CDUT page one evidence')
    expect(pdfText).toContain('CDUT page two evidence')
    expect(pdfText).toContain('CDUT page three evidence')
    expect(pdfDoc.parseStatus).toBe('parsed')
    // 原件落盘：assetPath 指向案卷内副本，字节与源文件完全一致，且字节 hash 与内容指纹一致
    const { createHash } = await import('node:crypto')
    const { existsSync, readFileSync: readBytes } = await import('node:fs')
    const storedPdf = readBytes(join(getReviewCasesDir(), created.id, pdfDoc.assetPath))
    expect(Buffer.compare(storedPdf, readBytes(pdfSource))).toBe(0)
    expect(pdfDoc.byteHash).toBe(createHash('sha256').update(readBytes(pdfSource)).digest('hex'))

    // 真实 DOCX：OOXML zip（标题 + 段落 + 表格单元格），经 mammoth 结构解析登记。
    const docxSource = join(root, 'real-material.docx')
    writeFileSync(docxSource, await buildReviewDocx())
    const docxId = await Promise.resolve(invoke(REVIEW_IPC_CHANNELS.REGISTER_MATERIAL_PATH_V2, {
      caseId: created.id, sourcePath: docxSource, role: 'application',
    })) as string
    const docxDoc = readAggregate(created.id)!.caseV2.documents.find(doc => doc.versionId === docxId)!
    expect(docxDoc).toMatchObject({ fileName: 'real-material.docx', role: 'application', active: true })
    // 材料块的 kind 只有 text/table/image；DOCX 结构类型（标题/段落/单元格）记录在 format 上
    expect(docxDoc.blocks.find(block => block.format === 'heading')?.text).toBe('Eligibility requirements')
    expect(docxDoc.blocks.filter(block => block.format === 'table-cell').map(block => block.text))
      .toEqual(['Applicant', 'Deadline'])
    expect(docxDoc.parseStatus).toBe('parsed')
    expect(Buffer.compare(
      readBytes(join(getReviewCasesDir(), created.id, docxDoc.assetPath)),
      readBytes(docxSource),
    )).toBe(0)

    // 重开（重新读聚合，等价于重启后再读）两份材料与原件引用都仍在
    const reopened = readAggregate(created.id)!
    expect(reopened.caseV2.documents.filter(doc => doc.active !== false)).toHaveLength(2)
    expect(reopened.receiptLog.map(receipt => receipt.type)).toEqual([
      'CreateNativeWorkspaceCaseV3', 'RegisterMaterial', 'RegisterMaterial',
    ])
    for (const doc of reopened.caseV2.documents) {
      expect(existsSync(join(getReviewCasesDir(), created.id, doc.assetPath))).toBe(true)
    }
  })

  test('native Main old AI/rule/report hooks do not create a fake V1 success or policy', async () => {
    const created = await Promise.resolve(invoke(REVIEW_IPC_CHANNELS.CREATE_CASE, {
      title: 'Native authoritative only', type: '综合测评',
      applicant: 'Applicant', academicYear: '2026',
    })) as { id: string }
    const original = JSON.stringify(readAggregate(created.id))
    await expect(Promise.resolve(invoke(REVIEW_IPC_CHANNELS.GENERATE_RULE_OUTLINE, {
      caseId: created.id, rulePackId: 'nonexistent',
    }))).rejects.toThrow('NATIVE_OUTLINE_STAGING_REQUIRED')
    await expect(Promise.resolve(invoke(REVIEW_IPC_CHANNELS.EXTRACT_ITEMS, created.id)))
      .rejects.toThrow('NATIVE_SUBJECT_STAGING_REQUIRED')
    await expect(Promise.resolve(invoke(REVIEW_IPC_CHANNELS.UPDATE_RULE_OUTLINE, {
      caseId: created.id, rulePackId: 'fake', ruleId: 'fake', title: 'Forged rule', summary: '',
    }))).rejects.toThrow('NATIVE_RULE_OUTLINE_SOURCE_REQUIRED')
    await expect(Promise.resolve(invoke(REVIEW_IPC_CHANNELS.CONFIRM_RULE_PACK, {
      caseId: created.id, rulePackId: 'fake',
    }))).rejects.toThrow('NATIVE_RULE_CONFIRMATION_REQUIRED')
    expect(() => invoke(REVIEW_IPC_CHANNELS.RUN_REVIEW, created.id))
      .toThrow('NATIVE_C2_RUN_REQUIRED')
    expect(() => invoke(REVIEW_IPC_CHANNELS.EXPORT_REPORT, created.id))
      .toThrow('NATIVE_C2_REPORT_REQUIRED')
    expect(JSON.stringify(readAggregate(created.id))).toBe(original)
    const { existsSync } = await import('node:fs')
    expect(existsSync(join(getReviewCasesDir(), created.id, 'case.json'))).toBe(false)
  })

  test('trusted Main manual item IPC consumes real V2 source; forged identity/frame fail without a new receipt', async () => {
    const localPath = join(root, 'manual-subject-source.txt')
    writeFileSync(localPath, 'Submitted physical material, human declared review claim', 'utf8')
    const created = await Promise.resolve(invoke(REVIEW_IPC_CHANNELS.CREATE_CASE, {
      title: 'Human source-bound case', type: '综合测评',
      applicant: 'Applicant', academicYear: '2026',
    })) as { id: string }
    await Promise.resolve(invoke(REVIEW_IPC_CHANNELS.IMPORT_DOCUMENT_FROM_PATH, {
      caseId: created.id, sourcePath: localPath, role: 'application',
    }))
    const aggregate = readAggregate(created.id)!
    const doc = aggregate.caseV2.documents[0]!
    const request = {
      caseId: created.id, requestId: 'human-main-provenance-01',
      expectedRevision: aggregate.caseV2.revision, documentVersionId: doc.versionId,
      sourceBlockId: doc.blocks[0]?.blockId, title: 'Human declared claim',
      category: '科研', declaredScore: 2,
    }
    const before = JSON.stringify(aggregate)
    await expect(Promise.resolve().then(() => invoke(REVIEW_IPC_CHANNELS.CREATE_NATIVE_REVIEW_ITEM_V3, {
      ...request, actor: { actorId: 'school-teacher', actorSource: 'school', role: 'teacher' },
    }))).rejects.toThrow('ACTOR_UNTRUSTED')
    await expect(Promise.resolve().then(() => invoke(REVIEW_IPC_CHANNELS.CREATE_NATIVE_REVIEW_ITEM_V3,
      request, { sender, senderFrame: { id: 123 } }))).rejects.toThrow('SENDER_UNTRUSTED')
    await expect(Promise.resolve().then(() => invoke(REVIEW_IPC_CHANNELS.CREATE_NATIVE_REVIEW_ITEM_V3, {
      ...request, sourceIdentity: { caseId: created.id, trusted: true },
    }))).rejects.toThrow('ACTOR_UNTRUSTED')
    expect(JSON.stringify(readAggregate(created.id))).toBe(before)

    const first = await Promise.resolve(invoke(REVIEW_IPC_CHANNELS.CREATE_NATIVE_REVIEW_ITEM_V3, request)) as {
      items: Array<{ id: string; title: string; anchor: { documentId: string } }>
    }
    expect(first.items).toHaveLength(1)
    expect(first.items[0]).toMatchObject({
      title: 'Human declared claim', anchor: { documentId: doc.documentId },
    })
    const after = readAggregate(created.id)!
    expect(after.receiptLog.at(-1)).toMatchObject({
      type: 'CreateNativeReviewItemV3',
      actor: { actorId: 'local-reviewer', actorSource: 'local', role: 'reviewer' },
    })
    const twice = await Promise.resolve(invoke(REVIEW_IPC_CHANNELS.CREATE_NATIVE_REVIEW_ITEM_V3, request)) as {
      items: Array<{ id: string }>
    }
    expect(twice.items.map(item => item.id)).toEqual(first.items.map(item => item.id))
    expect(readAggregate(created.id)?.caseV2.revision).toBe(after.caseV2.revision)
    expect(readAggregate(created.id)?.receiptLog).toHaveLength(after.receiptLog.length)
    const { existsSync } = await import('node:fs')
    expect(existsSync(join(getReviewCasesDir(), created.id, 'case.json'))).toBe(false)
  })

  test('new native draft can be created without any published template; explicit null never auto-installs a mapped policy', async () => {
    const created = await Promise.resolve(invoke(REVIEW_IPC_CHANNELS.CREATE_CASE, {
      title: 'Unbound native draft',
      type: '综合测评',
      applicant: 'Human applicant',
      academicYear: '2026-2027',
      reviewTemplate: null,
    })) as { id: string; reviewTemplate?: unknown }
    const aggregate = readAggregate(created.id)!
    expect(aggregate.caseV2.templateId).toBe('pending-template-v3')
    expect(aggregate.caseV2.templateVersion).toBe(0)
    expect(aggregate.canonicalPlan).toBeUndefined()
    expect(aggregate.d2RuntimePlan).toBeUndefined()
    expect(created.reviewTemplate).toBeUndefined()
    expect(aggregate.receiptLog.map(receipt => receipt.type)).toEqual([
      'CreateNativeWorkspaceCaseV3',
    ])
    expect(getCase(created.id)?.title).toBe('Unbound native draft')
    expect(listCases().some(item => item.id === created.id)).toBe(true)
    const { existsSync } = await import('node:fs')
    expect(existsSync(join(getReviewCasesDir(), created.id, 'case.json'))).toBe(false)
  })

})
