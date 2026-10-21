import { afterAll, describe, expect, test } from 'bun:test'
import { existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import type { Actor } from '@profer/shared'
import { createNativeWorkspaceCaseV3, updateNativeWorkspaceSettingsV3,
  registerNativeWorkspaceMaterialV3, removeNativeWorkspaceDocumentsV3,
  nativeWorkspaceProjectionV3, updateNativeWorkspaceReviewItemV3, createNativeReviewItemV3 } from './native-workspace-case-v3'
import { listAggregatesV2, readAggregate, writeAggregate } from './case-store-v2'
import { getCase, getReviewCasesDir, listCases, saveCase } from './case-store'
import { buildDemoCase } from './demo-fixtures/demo-case-fixture'

const root = join(import.meta.dir, '../../../../../../work/tmp', `native-workspace-c1-${Date.now()}`)
process.env.PROFER_CONFIG_DIR = root
mkdirSync(root, { recursive: true })
afterAll(() => rmSync(root, { force: true, recursive: true }))

const actor: Actor = { actorId: 'local-reviewer', actorSource: 'local', role: 'reviewer' }
const input = { title: 'Native-first authoritative case', type: '综合测评' as const,
  applicant: 'Original applicant', academicYear: '2026' }

describe('C1 native-first single Case writer and V1 read-only compatibility', () => {
  test('writes V2 aggregate + receipt only; reopens after cold read without V1 shadow', async () => {
    const result = await createNativeWorkspaceCaseV3(input, actor)
    const id = result.view.id
    expect(result.aggregate.receiptLog.map(r => r.type)).toEqual(['CreateNativeWorkspaceCaseV3'])
    expect(result.aggregate.caseV2.stage).toBe('draft')
    expect(readAggregate(id)?.caseV2.id).toBe(id)
    expect(getCase(id)).toMatchObject({ id, applicant: 'Original applicant' })
    expect(listCases().some(c => c.id === id)).toBe(true)
    expect(existsSync(join(getReviewCasesDir(), id, 'case.json'))).toBe(false)
    expect(existsSync(join(getReviewCasesDir(), id, 'case.v2.json'))).toBe(false)
    const data = readAggregate(id)!
    expect(nativeWorkspaceProjectionV3(data)?.title).toBe(input.title)
    expect(() => saveCase({ ...buildDemoCase(), id, title: 'Renderer old overwrite' }))
      .toThrow('原生审核案卷禁止')
    expect(JSON.stringify(readAggregate(id))).toBe(JSON.stringify(data))
  })

  test('Main revoked immediately before native create commit leaves no current Case', async () => {
    const before = listAggregatesV2().map(c => c.caseId)
    await expect(createNativeWorkspaceCaseV3(input, actor, () => {
      throw new Error('MAIN_REVOKED_BEFORE_CREATE_COMMIT')
    })).rejects.toThrow('MAIN_REVOKED_BEFORE_CREATE_COMMIT')
    expect(listAggregatesV2().map(c => c.caseId)).toEqual(before)
  })

  test('settings and physical material fail closed on revoked Main at durable CAS', async () => {
    const created = await createNativeWorkspaceCaseV3(input, actor)
    const id = created.view.id
    const initial = JSON.stringify(readAggregate(id))
    await expect(updateNativeWorkspaceSettingsV3(id, { caseId: id, title: 'Forged after await' },
      actor, () => { throw new Error('MAIN_REVOKED_AT_SETTINGS_COMMIT') }))
      .rejects.toThrow('MAIN_REVOKED_AT_SETTINGS_COMMIT')
    expect(JSON.stringify(readAggregate(id))).toBe(initial)

    const source = join(root, 'proof.txt')
    writeFileSync(source, 'Independent physical source with exact bytes', 'utf8')
    await expect(registerNativeWorkspaceMaterialV3(id, source, 'evidence', actor,
      () => { throw new Error('MAIN_REVOKED_AT_MATERIAL_COMMIT') }))
      .rejects.toThrow('MAIN_REVOKED_AT_MATERIAL_COMMIT')
    expect(JSON.stringify(readAggregate(id))).toBe(initial)
    const stored = await registerNativeWorkspaceMaterialV3(id, source, 'evidence', actor)
    expect(getCase(id)?.documents.map(d => d.id)).toContain(stored.id)
    const beforeRemove = JSON.stringify(readAggregate(id))
    await expect(removeNativeWorkspaceDocumentsV3(id, 'evidence', [stored.id], actor,
      () => { throw new Error('MAIN_REVOKED_AT_REMOVE_COMMIT') }))
      .rejects.toThrow('MAIN_REVOKED_AT_REMOVE_COMMIT')
    expect(JSON.stringify(readAggregate(id))).toBe(beforeRemove)
    const retired = await removeNativeWorkspaceDocumentsV3(id, 'evidence', [stored.id], actor)
    expect(retired.documents).toHaveLength(0)
    const after = readAggregate(id)!
    expect(after.sourceValidityRevocations?.some(x => x.documentVersionId ===
      after.caseV2.documents[0]?.versionId)).toBe(true)
    expect(existsSync(join(getReviewCasesDir(), id, 'case.json'))).toBe(false)
  })

  test('a candidate or custom template is never secretly published as official policy', async () => {
    const created = await createNativeWorkspaceCaseV3({
      ...input, type: '自定义审核', domainPackId: 'custom',
    }, actor)
    expect(created.aggregate.caseV2.templateId).toBe('pending-template-v3')
    expect(created.aggregate.caseV2.templateVersion).toBe(0)
    expect(created.aggregate.canonicalPlan).toBeUndefined()
    expect(created.view.reviewTemplate).toBeUndefined()
    expect(created.view.type).toBe('自定义审核')
  })
  test('manual rules and subject document IDs remain durable DRAFTS pinned to physical source versions', async () => {
    const created = await createNativeWorkspaceCaseV3(input, actor)
    const id = created.view.id
    const applicationPath = join(root, `application-${id}.txt`)
    writeFileSync(applicationPath, '申报人自己提交的待审文本，非校方政策', 'utf8')
    const source = await registerNativeWorkspaceMaterialV3(id, applicationPath, 'application', actor)
    const rules = [{ id: 'user-draft-01', title: '人工核对提醒', requirement: '比对已提交原件；不是校方已发布制度' }]
    const edit = await updateNativeWorkspaceSettingsV3(id, {
      caseId: id, manualRules: rules, subjectDocumentIds: [source.id],
    }, actor)
    const stored = readAggregate(id)!
    expect(edit.manualRules).toEqual(rules)
    expect(edit.subjectDocumentIds).toEqual([source.id])
    expect(stored.caseV2.nativeWorkspaceDraft?.manualRules).toEqual(rules)
    const registeredVersionId = stored.caseV2.documents[0]?.versionId
    expect(registeredVersionId).toBeDefined()
    expect(stored.caseV2.nativeWorkspaceDraft?.subjectDocumentVersionIds)
      .toEqual([registeredVersionId!])
    expect(stored.caseV2.reviewRules).toBeUndefined()
    expect(stored.canonicalPlan).toBeUndefined()
    expect(stored.receiptLog.map(r => r.type)).toEqual([
      'CreateNativeWorkspaceCaseV3', 'RegisterMaterial', 'UpdateNativeWorkspaceSettingsV3',
    ])
    expect(getCase(id)?.manualRules).toEqual(rules)
    expect(existsSync(join(getReviewCasesDir(), id, 'case.json'))).toBe(false)
    await expect(updateNativeWorkspaceSettingsV3(id, {
      caseId: id, subjectDocumentIds: [source.id, source.id],
    }, actor)).rejects.toThrow('重复')
    await expect(updateNativeWorkspaceSettingsV3(id, {
      caseId: id, manualRules: [...rules, { ...rules[0]!, requirement: '重复 ID' }],
    }, actor)).rejects.toThrow('无效')
    await expect(updateNativeWorkspaceSettingsV3(id, {
      caseId: id, subjectDocumentIds: ['cross-case-document'],
    }, actor)).rejects.toThrow('待审主体材料')
    expect(readAggregate(id)?.caseV2.revision).toBe(2)
    await removeNativeWorkspaceDocumentsV3(id, 'application', [source.id], actor)
    // Previously selected version is retired: projection must NOT remap to a
    // new version with the same logical documentId.
    expect(getCase(id)?.subjectDocumentIds).toEqual([])
    expect(readAggregate(id)?.caseV2.nativeWorkspaceDraft?.subjectDocumentVersionIds)
      .toEqual(stored.caseV2.nativeWorkspaceDraft?.subjectDocumentVersionIds)
  })

  test('an existing anchored V2 item is corrected by native CAS without forging OCR/score policy', async () => {
    const created = await createNativeWorkspaceCaseV3(input, actor)
    const id = created.view.id
    const sourcePath = join(root, `subject-${id}.txt`)
    writeFileSync(sourcePath, 'An authentic application paragraph, user-asserted score', 'utf8')
    const source = await registerNativeWorkspaceMaterialV3(id, sourcePath, 'application', actor)
    // Synthetic fixture injected into isolated V2 aggregate ONLY for
    // exercising an existing subject; not evidence that extraction is ready.
    const aggregate = readAggregate(id)!
    const document = aggregate.caseV2.documents.find(doc => doc.documentId === source.id)!
    aggregate.caseV2.subjects = [{
      id: 'real-source-subject', type: 'item', title: 'Initial claimed item',
      status: 'identified', correction: 'ai-extracted',
      fields: { category: { kind: 'text', value: '科研' },
        declaredScore: { kind: 'number', value: 3 } },
      sourceRefs: [{ caseId: id, documentVersionId: document.versionId,
        parseRevision: document.parseRevision,
        location: { kind: 'paragraph', index: 0 } }],
    }]
    writeAggregate(aggregate)
    expect(getCase(id)?.items.map(item => item.id)).toEqual(['real-source-subject'])
    const corrected = await updateNativeWorkspaceReviewItemV3(id, {
      caseId: id, itemId: 'real-source-subject', title: 'Applicant corrected title',
      category: '科研', declaredScore: 4, level: '省级',
    }, actor)
    expect(corrected.items[0]).toMatchObject({
      title: 'Applicant corrected title', declaredScore: 4,
      status: 'confirmed', identifiedBy: 'manual',
    })
    expect(corrected.items[0]?.anchor.documentId).toBe(document.documentId)
    expect(readAggregate(id)?.caseV2.subjects[0]?.fields.declaredScore)
      .toEqual({ kind: 'number', value: 4 })
    expect(readAggregate(id)?.receiptLog.at(-1)?.type).toBe('CorrectNativeWorkspaceReviewItemV3')
    const before = JSON.stringify(readAggregate(id))
    await expect(updateNativeWorkspaceReviewItemV3(id, {
      caseId: id, itemId: 'real-source-subject', title: 'Invalid',
      category: '科研', declaredScore: 5,
    }, actor, () => { throw new Error('MAIN_REVOKED_ON_ITEM') })).rejects.toThrow('MAIN_REVOKED_ON_ITEM')
    expect(JSON.stringify(readAggregate(id))).toBe(before)
    const invalid = readAggregate(id)!
    invalid.caseV2.subjects[0]!.sourceRefs = [{ caseId: 'wrong-case',
      documentVersionId: document.versionId, parseRevision: document.parseRevision,
      location: { kind: 'file' } }]
    writeAggregate(invalid)
    expect(getCase(id)?.items).toEqual([])
    await expect(updateNativeWorkspaceReviewItemV3(id, {
      caseId: id, itemId: 'real-source-subject', title: 'Tampered',
      category: '科研', declaredScore: 10,
    }, actor)).rejects.toThrow('未绑定当前可追溯原件')
  })

  test('malformed parseable native draft is quarantined without V1 fallback or automatic repair', async () => {
    const created = await createNativeWorkspaceCaseV3(input, actor)
    const id = created.view.id
    const damaged = readAggregate(id)!
    damaged.caseV2.nativeWorkspaceDraft = { manualRules: 'malformed-not-array' } as never
    writeAggregate(damaged)
    const raw = JSON.stringify(readAggregate(id))
    expect(getCase(id)).toBeUndefined()
    expect(listCases().some(item => item.id === id)).toBe(false)
    expect(JSON.stringify(readAggregate(id))).toBe(raw)
    expect(existsSync(join(getReviewCasesDir(), id, 'case.json'))).toBe(false)
    await expect(updateNativeWorkspaceSettingsV3(id, { caseId: id, title: 'Should not write' }, actor))
      .rejects.toThrow('不是原生工作台案卷')
    expect(JSON.stringify(readAggregate(id))).toBe(raw)
  })
  test('explicitly unknown native domain fails closed instead of silently selecting comprehensive assessment', async () => {
    const before = listAggregatesV2().map(item => item.caseId)
    await expect(createNativeWorkspaceCaseV3({ ...input, domainPackId: 'unknown-campus-authority' }, actor))
      .rejects.toThrow('未知审核领域')
    expect(listAggregatesV2().map(item => item.caseId)).toEqual(before)
  })

  test('manual Subject writes exact source block and receipt, idempotently replays and rejects spoof/stale source', async () => {
    const created = await createNativeWorkspaceCaseV3(input, actor)
    const id = created.view.id
    const originalPath = join(root, `manual-declaration-${id}.txt`)
    writeFileSync(originalPath, 'Physical original paragraph and human-declared review claim', 'utf8')
    const document = await registerNativeWorkspaceMaterialV3(id, originalPath, 'application', actor)
    const before = readAggregate(id)!
    const version = before.caseV2.documents.find(doc => doc.documentId === document.id)!
    const blockId = version.blocks[0]?.blockId
    expect(typeof blockId).toBe('string')
    const command = {
      caseId: id, requestId: 'manual-item-idempotent-01',
      expectedRevision: before.caseV2.revision,
      documentVersionId: version.versionId, sourceBlockId: blockId,
      title: 'Human declared project', category: '科研', declaredScore: 2.5,
    }
    const createdView = await createNativeReviewItemV3(command, actor)
    expect(createdView.items).toHaveLength(1)
    const item = createdView.items[0]!
    expect(item).toMatchObject({
      title: 'Human declared project', declaredScore: 2.5,
      identifiedBy: 'manual', status: 'identified',
      anchor: { documentId: version.documentId, blockId, precision: 'block' },
    })
    const after = readAggregate(id)!
    expect(after.receiptLog.at(-1)?.type).toBe('CreateNativeReviewItemV3')
    expect(after.caseV2.subjects[0]?.sourceRefs).toEqual([{
      caseId: id, documentVersionId: version.versionId,
      parseRevision: version.parseRevision,
      location: version.blocks[0]!.location ?? { kind: 'file' },
    }])
    expect(after.caseV2.subjects[0]?.status).toBe('identified')
    expect(after.observations).toHaveLength(0)
    expect(after.decisions).toHaveLength(0)
    const replay = await createNativeReviewItemV3(command, actor)
    expect(replay.items.map(value => value.id)).toEqual([item.id])
    expect(readAggregate(id)?.caseV2.revision).toBe(after.caseV2.revision)
    expect(readAggregate(id)?.receiptLog).toHaveLength(after.receiptLog.length)

    await expect(createNativeReviewItemV3({ ...command, declaredScore: 99 }, actor))
      .rejects.toThrow('已被不同载荷使用')
    await expect(createNativeReviewItemV3({
      ...command, requestId: 'manual-item-conflict-02',
      documentVersionId: 'cross-case-version',
      expectedRevision: after.caseV2.revision,
    }, actor)).rejects.toThrow('本案当前有效')
    await expect(createNativeReviewItemV3({
      ...command, requestId: 'manual-item-fakeblock-03',
      sourceBlockId: 'renderer-forged-block',
      expectedRevision: after.caseV2.revision,
    }, actor)).rejects.toThrow('解析块不属于')
    await expect(createNativeReviewItemV3({
      ...command, requestId: 'manual-item-stalerev-04',
    }, actor)).rejects.toThrow('案卷已被其他操作更新')
    await expect(createNativeReviewItemV3({
      ...command, requestId: 'manual-item-revoke-05',
      expectedRevision: after.caseV2.revision,
    }, actor, () => { throw new Error('MAIN_SESSION_REVOKED') }))
      .rejects.toThrow('MAIN_SESSION_REVOKED')
    expect(JSON.stringify(readAggregate(id))).toBe(JSON.stringify(after))
    expect(existsSync(join(getReviewCasesDir(), id, 'case.json'))).toBe(false)

    await removeNativeWorkspaceDocumentsV3(id, 'application', [version.documentId], actor)
    const retired = readAggregate(id)!
    expect(retired.caseV2.subjects[0]!.sourceRefs[0]?.documentVersionId).toBe(version.versionId)
    expect(getCase(id)?.items).toHaveLength(0) // no current source, not false approval
    await expect(createNativeReviewItemV3({
      ...command, requestId: 'manual-item-retired-06',
      expectedRevision: retired.caseV2.revision,
    }, actor)).rejects.toThrow('本案当前有效')
  })

  test('file-level manual declaration records honest file precision when no parsed block is selected', async () => {
    const created = await createNativeWorkspaceCaseV3(input, actor)
    const id = created.view.id
    const sourcePath = join(root, `file-level-${id}.txt`)
    writeFileSync(sourcePath, 'Human checks physical file without a specific parser block', 'utf8')
    const document = await registerNativeWorkspaceMaterialV3(id, sourcePath, 'application', actor)
    const aggregate = readAggregate(id)!
    const version = aggregate.caseV2.documents.find(doc => doc.documentId === document.id)!
    const view = await createNativeReviewItemV3({
      caseId: id, requestId: 'manual-file-level-07',
      expectedRevision: aggregate.caseV2.revision,
      documentVersionId: version.versionId, title: 'Whole-file claim',
      category: '待核对', declaredScore: 0,
    }, actor)
    expect(view.items[0]?.anchor).toMatchObject({
      documentId: document.id, precision: 'document',
    })
    expect(view.items[0]?.anchor.blockId).toBeUndefined()
    expect(readAggregate(id)?.caseV2.subjects[0]?.sourceRefs[0]?.location)
      .toEqual({ kind: 'file' })
  })

  test('parser-block identity survives in UI without invented paragraph/page locator', async () => {
    const created = await createNativeWorkspaceCaseV3(input, actor)
    const id = created.view.id
    const inputPath = join(root, `sparse-locator-${id}.txt`)
    writeFileSync(inputPath, 'A real source block without exact page coordinates', 'utf8')
    const source = await registerNativeWorkspaceMaterialV3(id, inputPath, 'application', actor)
    const aggregate = readAggregate(id)!
    const doc = aggregate.caseV2.documents.find(item => item.documentId === source.id)!
    const actualBlock = doc.blocks[0]!
    expect(actualBlock.blockId).toBeTruthy()
    actualBlock.location = undefined // synthetic parser variation; real bytes unchanged
    writeAggregate(aggregate)
    const result = await createNativeReviewItemV3({
      caseId: id, requestId: 'human-no-geometry-01',
      expectedRevision: aggregate.caseV2.revision,
      documentVersionId: doc.versionId, sourceBlockId: actualBlock.blockId,
      title: 'Real parser block', category: '待核验', declaredScore: 1,
    }, actor)
    expect(result.items[0]?.anchor).toMatchObject({
      documentId: doc.documentId, blockId: actualBlock.blockId, precision: 'block',
    })
    const persisted = readAggregate(id)!
    expect(persisted.caseV2.subjects[0]?.sourceRefs[0]?.location).toEqual({ kind: 'file' })
    expect(persisted.caseV2.subjects[0]?.fields.nativeSourceBlockId)
      .toEqual({ kind: 'text', value: actualBlock.blockId })
    expect(persisted.decisions).toHaveLength(0)
  })

})
