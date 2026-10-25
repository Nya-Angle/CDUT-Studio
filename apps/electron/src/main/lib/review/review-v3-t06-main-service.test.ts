/**
 * T06 物理入库 Main 端口：指纹校验、幂等、部分失败不掩盖。
 * 真实 OS 选择器无法在单测里弹出，因此这里直接注入内部选择状态。
 */
import { afterAll, describe, expect, test } from 'bun:test'
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const configDir = mkdtempSync(join(tmpdir(), 't06m-'))
process.env.PROFER_CONFIG_DIR = configDir
afterAll(() => rmSync(configDir, { recursive: true, force: true }))

const { saveDraft, publishTemplate } = await import('./template-store')
const service = await import('./review-v3-t06-main-service')

const templateId = 't06-physical'
saveDraft({
  templateId, version: 1, schemaVersion: 2, name: '物理入库模板',
  objectType: 'organization', displayName: { template: 'x' }, status: 'draft', createdAt: '',
  fields: [{ key: 'applicant', label: '申请人', kind: 'text', required: false, visibility: 'public', scope: 'case' }],
  sections: [], materialSlots: [], policyVersionIds: [], policyRefs: [], outputs: [],
  stages: [{ id: 'end', name: '结束', kind: 'finalize', executorRole: 'reviewer' }],
} as never)
publishTemplate(templateId, 1)

const anotherTemplateId = 't06-other-business'
saveDraft({
  templateId: anotherTemplateId, version: 1, schemaVersion: 2, name: '另一业务模板',
  objectType: 'organization', displayName: { template: 'x' }, status: 'draft', createdAt: '',
  fields: [{ key: 'applicant', label: '申请人', kind: 'text', required: false, visibility: 'public', scope: 'case' }],
  sections: [], materialSlots: [], policyVersionIds: [], policyRefs: [], outputs: [],
  stages: [{ id: 'end', name: '结束', kind: 'finalize', executorRole: 'reviewer' }],
} as never)
publishTemplate(anotherTemplateId, 1)

/** 真实目录 → 真实枚举与指纹（不伪造 OS 弹窗，但确实读盘）。 */
function seedSelection(files: Array<{ name: string; content?: string }> = [{ name: 'a.txt' }]) {
  const root = mkdtempSync(join(tmpdir(), 't06src-'))
  for (const file of files) writeFileSync(join(root, file.name), file.content ?? '材料正文')
  const selection = service.buildT06SelectionFromPath(root, 'folder')
  return selection
}

// RUN-38/39：含必填案卷字段、必需分项与必交材料槽的真实模板。
const requiredTemplateId = 't06-required-inputs'
saveDraft({
  templateId: requiredTemplateId, version: 1, schemaVersion: 2, name: '含必填与必交槽模板',
  objectType: 'person', displayName: { template: 'x' }, status: 'draft', createdAt: '',
  fields: [{ key: 'amount', label: '申报金额', kind: 'number', required: true, visibility: 'public', scope: 'case' }],
  sections: [{
    id: 'decl', name: '申报事项', order: 0, required: true,
    criteria: [{ id: 'c1', title: '金额与材料一致', requirement: '核对申报金额与证明一致', execution: 'semantic', targetScope: 'case' }],
  }],
  materialSlots: [{
    id: 'application-form', name: '申请书', purpose: '学生申请书', acceptedKinds: ['text', 'pdf'],
    minCount: 1, maxCount: 1, requiredElements: [], allowReuseAcrossSubjects: false,
  }],
  policyVersionIds: [], policyRefs: [], outputs: [],
  stages: [{ id: 'end', name: '结束', kind: 'finalize', executorRole: 'reviewer' }],
} as never)
publishTemplate(requiredTemplateId, 1)

const { submitCaseV2 } = await import('./stage-workflow')

describe('T06 物理入库桥接', () => {
  test('来源指纹不符时拒绝提交', async () => {
    const selection = seedSelection([{ name: 'a.txt' }, { name: 'b.txt' }])
    await expect(service.commitT06PhysicalImport({
      requestId: 'r-fingerprint', selectionId: selection.selectionId,
      previewFingerprint: 'deadbeef', templateId, templateVersion: 1, batchName: '批次',
      groups: [{ groupId: 'g1', entryIds: selection.entries.map((entry) => entry.entryId), action: 'create' as const, title: '案卷', applicant: 'E2E' }],
    })).rejects.toThrow('来源内容在预览后发生变化')
  })

  test('同一 requestId 幂等：重复提交返回同一回执，不重复建案', async () => {
    const selection = seedSelection()
    const request = {
      requestId: 'r-idem', selectionId: selection.selectionId,
      previewFingerprint: selection.previewFingerprint, templateId, templateVersion: 1, batchName: '幂等批次',
      groups: [{ groupId: 'g1', entryIds: selection.entries.map((entry) => entry.entryId), action: 'create' as const, title: '幂等案卷', applicant: 'E2E' }],
    }
    const first = await service.commitT06PhysicalImport(request)
    const second = await service.commitT06PhysicalImport(request)
    expect(first).toEqual(second)
    expect(first.cases).toHaveLength(1)
    expect(first.cases[0]!.status).toBe('done')
    expect(first.batchId).toBeTruthy()
  })

  test('部分失败：案卷与已入库原件保留，但不进入批次成功成员', async () => {
    const selection = seedSelection([{ name: 'a.txt' }, { name: 'b.txt' }])
    const request = {
      requestId: 'r-partial', selectionId: selection.selectionId,
      previewFingerprint: selection.previewFingerprint, templateId, templateVersion: 1, batchName: '部分失败批次',
      groups: [
        { groupId: 'ok', entryIds: [selection.entries[0]!.entryId], action: 'create' as const, title: '成功案卷', applicant: 'E2E' },
        // 第二个条目引用不存在的 entryId，模拟单条失败
        { groupId: 'bad', entryIds: ['e-does-not-exist'], action: 'create' as const, title: '失败案卷', applicant: 'E2E' },
      ],
    }
    const receipt = await service.commitT06PhysicalImport(request)
    const bad = receipt.cases.find((item) => item.groupId === 'bad')!
    expect(bad.status).toBe('failed')
    expect(bad.error).toContain('不在本次来源中')
    // 失败案卷仍然被创建并记录，便于复核
    expect(bad.caseId).toBeTruthy()
    const ok = receipt.cases.find((item) => item.groupId === 'ok')!
    expect(ok.status).toBe('done')
    expect(ok.documents).toHaveLength(1)
  })

  test('混合模板文件夹独立分案，并按业务模板分成两个真实批次', async () => {
    const selection = seedSelection([{ name: 'first.pdf', content: 'A' }, { name: 'second.pdf', content: 'B' }])
    const result = await service.commitT06PhysicalImport({
      requestId: 'r-mixed', selectionId: selection.selectionId,
      previewFingerprint: selection.previewFingerprint, batchName: '同次导入',
      groups: [
        { groupId: 'g-first', action: 'create', entryIds: [selection.entries[0]!.entryId],
          title: '业务一', applicant: '甲', templateId, templateVersion: 1 },
        { groupId: 'g-second', action: 'create', entryIds: [selection.entries[1]!.entryId],
          title: '业务二', applicant: '乙', templateId: anotherTemplateId, templateVersion: 1 },
      ],
    })
    expect(result.cases.map(entry => entry.status)).toEqual(['done', 'done'])
    expect(result.batches).toHaveLength(2)
    expect(result.batches?.map(batch => batch.templateId)).toEqual([templateId, anotherTemplateId])
    expect(new Set(result.batches?.flatMap(batch => batch.caseIds)).size).toBe(2)
  })

  test('某案卷模板未就绪时其余案卷仍可入库并创建真实批次', async () => {
    const selection = seedSelection([{ name: 'good.pdf' }, { name: 'bad.pdf' }])
    const result = await service.commitT06PhysicalImport({
      requestId: 'r-isolation', selectionId: selection.selectionId,
      previewFingerprint: selection.previewFingerprint, batchName: '容错批量',
      groups: [
        { groupId: 'bad', action: 'create', title: '不可用模板', applicant: '甲',
          entryIds: [selection.entries[1]!.entryId], templateId: 'missing-template', templateVersion: 1 },
        { groupId: 'good', action: 'create', title: '可用模板', applicant: '乙',
          entryIds: [selection.entries[0]!.entryId], templateId, templateVersion: 1 },
      ],
    })
    expect(result.cases.map(entry => entry.status)).toEqual(['failed', 'done'])
    expect(result.batches?.map(batch => batch.templateId)).toEqual([templateId])
    expect(result.batches?.[0]?.caseIds).toHaveLength(1)
  })

  test('相同名称与大小的不同案卷原件不能共享 DocumentVersion', async () => {
    const first = seedSelection([{ name: 'proof.txt', content: '同一份证明' }])
    const second = seedSelection([{ name: 'proof.txt', content: '同一份证明' }])
    const submit = (selection: typeof first, requestId: string) => service.commitT06PhysicalImport({
      requestId, selectionId: selection.selectionId, previewFingerprint: selection.previewFingerprint,
      templateId, templateVersion: 1, batchName: requestId,
      groups: [{ groupId: 'group', action: 'create' as const, entryIds: [selection.entries[0]!.entryId],
        title: requestId, applicant: requestId }],
    })
    const a = await submit(first, 'r-person-a')
    const b = await submit(second, 'r-person-b')
    expect(a.cases[0]?.status).toBe('done')
    expect(b.cases[0]?.status).toBe('done')
    expect(a.cases[0]?.documents[0]?.documentVersionId).not.toBe(b.cases[0]?.documents[0]?.documentVersionId)
  })

  test('RUN-38/39：必填字段模板可建案但不伪装可提交，补齐字段与必交槽后才允许提交', async () => {
    const selection = seedSelection([{ name: '申请书.txt', content: '申请书正文' }])
    const result = await service.commitT06PhysicalImport({
      requestId: 'r-required-inputs', selectionId: selection.selectionId,
      previewFingerprint: selection.previewFingerprint, batchName: '必填模板批次',
      groups: [{
        groupId: 'g1', action: 'create', entryIds: [selection.entries[0]!.entryId],
        title: '待补录案卷', applicant: '甲', templateId: requiredTemplateId, templateVersion: 1,
      }],
    })
    const receipt = result.cases[0]!
    expect(receipt.status).toBe('done')
    expect(receipt.warnings?.join('；')).toContain('必交材料槽')
    expect(receipt.warnings?.join('；')).toContain('申报金额')
    const caseId = receipt.caseId!
    const aggregate = (await import('./case-store-v2')).readAggregate(caseId)!
    // 旧实现会因 applicant 不在模板中直接整组失败；现在按模板真实字段建案。
    expect(aggregate.caseV2.templateId).toBe(requiredTemplateId)
    expect(aggregate.caseV2.caseFields.amount).toBeUndefined()
    await expect(submitCaseV2(caseId)).rejects.toThrow('尚未补齐必填输入')
    // MANAGER-INTAKE-GATE #2：不能靠绕过提交按钮直接开始审核/跑批次。
    const { assembleAndRunReview } = await import('./run-async-service')
    await expect(assembleAndRunReview(caseId)).rejects.toThrow(/尚未提交审核|尚未补齐/)
  })

  test('RUN-38/39：显式字段、事项、角色与必交槽一次入库后文件名保留且可提交', async () => {
    const selection = seedSelection([{ name: '申请书.txt', content: '正式申请书' }])
    const result = await service.commitT06PhysicalImport({
      requestId: 'r-required-complete', selectionId: selection.selectionId,
      previewFingerprint: selection.previewFingerprint, batchName: '完整必填批次',
      groups: [{
        groupId: 'g1', action: 'create', entryIds: [selection.entries[0]!.entryId],
        title: '完整案卷', templateId: requiredTemplateId, templateVersion: 1,
        fieldValues: { amount: '5000' },
        subjects: [{ title: '项目一', sectionId: 'decl' }],
        entryAssignments: [{ entryId: selection.entries[0]!.entryId, role: 'application', materialSlotId: 'application-form' }],
      }],
    })
    const receipt = result.cases[0]!
    expect(receipt.status).toBe('done')
    expect(receipt.warnings ?? []).toEqual([])
    expect(receipt.documents[0]?.role).toBe('application')
    expect(receipt.documents[0]?.materialSlotId).toBe('application-form')
    const aggregate = (await import('./case-store-v2')).readAggregate(receipt.caseId!)!
    const document = aggregate.caseV2.documents[0]!
    expect(document.fileName).toBe('申请书.txt')
    expect(document.role).toBe('application')
    expect(document.materialSlotId).toBe('application-form')
    const submitted = await submitCaseV2(receipt.caseId!)
    expect(submitted.ok).toBe(true)
    expect((await import('./case-store-v2')).readAggregate(receipt.caseId!)!.caseV2.stage).toBe('submitted')
  })

  test('材料槽不在所选模板中时拒绝该组，不写伪材料身份', async () => {
    const selection = seedSelection([{ name: 'proof.txt', content: '证明' }])
    const result = await service.commitT06PhysicalImport({
      requestId: 'r-bad-slot', selectionId: selection.selectionId,
      previewFingerprint: selection.previewFingerprint, batchName: '非法槽位',
      groups: [{
        groupId: 'g1', action: 'create', entryIds: [selection.entries[0]!.entryId],
        title: '非法槽位案卷', templateId, templateVersion: 1,
        entryAssignments: [{ entryId: selection.entries[0]!.entryId, materialSlotId: 'not-in-template' }],
      }],
    })
    expect(result.cases[0]?.status).toBe('failed')
    expect(result.cases[0]?.error).toContain('材料槽不在所选模板中')
  })

  test('B1 返修：普通用户补录必填字段与必需分项后，同一入库案卷可提交且原件不丢', async () => {
    const { updateFields, upsertCaseSubject } = await import('./application-service')
    const { getTemplate } = await import('./template-store')
    const actor = { actorId: 'local-user', actorSource: 'local' as const, role: 'reviewer' as const }
    const selection = seedSelection([{ name: '申请书.txt', content: '待补录申请书' }])
    const receipt = (await service.commitT06PhysicalImport({
      requestId: 'r-intake-fill', selectionId: selection.selectionId,
      previewFingerprint: selection.previewFingerprint, batchName: '补录批次',
      groups: [{
        groupId: 'g1', action: 'create', entryIds: [selection.entries[0]!.entryId],
        title: '待补录案卷', templateId: requiredTemplateId, templateVersion: 1,
        entryAssignments: [{ entryId: selection.entries[0]!.entryId, role: 'application', materialSlotId: 'application-form' }],
      }],
    })).cases[0]!
    expect(receipt.status).toBe('done')
    expect(receipt.warnings?.join('；')).toContain('申报金额')
    expect(receipt.warnings?.join('；')).toContain('申报事项')
    const caseId = receipt.caseId!
    const before = (await import('./case-store-v2')).readAggregate(caseId)!
    const template = getTemplate(requiredTemplateId, 1)!
    const filled = await updateFields(caseId, {
      requestId: 'fill-amount', actor, expectedRevision: before.caseV2.revision,
      payload: { caseFieldValues: { amount: '5000' } },
    }, template)
    expect(filled.ok).toBe(true)
    const afterField = (await import('./case-store-v2')).readAggregate(caseId)!
    const added = await upsertCaseSubject(caseId, {
      requestId: 'add-required-subject', actor, expectedRevision: afterField.caseV2.revision,
      payload: { title: '项目一', sectionId: 'decl' },
    }, template)
    expect(added.ok).toBe(true)
    const after = (await import('./case-store-v2')).readAggregate(caseId)!
    expect(after.caseV2.subjects.map((subject) => subject.title)).toEqual(['项目一'])
    expect(after.caseV2.caseFields.amount).toEqual({ kind: 'number', value: 5000 })
    expect(after.caseV2.documents).toHaveLength(before.caseV2.documents.length)
    expect(after.caseV2.documents[0]!.fileName).toBe('申请书.txt')
    const submitted = await submitCaseV2(caseId)
    expect(submitted.ok).toBe(true)
    expect((await import('./case-store-v2')).readAggregate(caseId)!.caseV2.stage).toBe('submitted')
  })

  test('B1 返修负例：补录不能写未知分项/错误类型；T06 错误类型在入库阶段即拒绝', async () => {
    const { updateFields, upsertCaseSubject } = await import('./application-service')
    const { getTemplate } = await import('./template-store')
    const actor = { actorId: 'local-user', actorSource: 'local' as const, role: 'reviewer' as const }
    const selection = seedSelection([{ name: 'bad.txt', content: '负例原件' }])
    const receipt = (await service.commitT06PhysicalImport({
      requestId: 'r-intake-negative', selectionId: selection.selectionId,
      previewFingerprint: selection.previewFingerprint, batchName: '负例批次',
      groups: [{
        groupId: 'g1', action: 'create', entryIds: [selection.entries[0]!.entryId],
        title: '负例案卷', templateId: requiredTemplateId, templateVersion: 1,
        entryAssignments: [{ entryId: selection.entries[0]!.entryId, role: 'application', materialSlotId: 'application-form' }],
      }],
    })).cases[0]!
    const caseId = receipt.caseId!
    const template = getTemplate(requiredTemplateId, 1)!
    const current = (await import('./case-store-v2')).readAggregate(caseId)!
    const badSection = await upsertCaseSubject(caseId, {
      requestId: 'bad-section', actor, expectedRevision: current.caseV2.revision,
      payload: { title: '越界事项', sectionId: 'not-a-section' },
    }, template)
    expect(badSection.ok).toBe(false)
    expect(badSection.ok ? '' : badSection.message).toContain('审核分项不存在')
    const badType = await updateFields(caseId, {
      requestId: 'bad-type', actor, expectedRevision: current.caseV2.revision,
      payload: { caseFieldValues: { amount: { nested: true } } },
    }, template)
    expect(badType.ok).toBe(false)
    expect(badType.ok ? '' : badType.message).toContain('必须是有效数字')
    // T06 建案阶段同样拒绝不可转换的对象值，不能落成 "[object Object]"
    const wrongTypeSelection = seedSelection([{ name: 'wrong.txt', content: '错误类型' }])
    const wrongType = await service.commitT06PhysicalImport({
      requestId: 'r-intake-wrong-type', selectionId: wrongTypeSelection.selectionId,
      previewFingerprint: wrongTypeSelection.previewFingerprint, batchName: '错误类型批次',
      groups: [{
        groupId: 'g1', action: 'create', entryIds: [wrongTypeSelection.entries[0]!.entryId],
        title: '错误类型案卷', templateId: requiredTemplateId, templateVersion: 1,
        fieldValues: { amount: { nested: true } },
      }],
    })
    expect(wrongType.cases[0]?.status).toBe('failed')
    expect(wrongType.cases[0]?.error).toContain('必须是有效数字')
    expect(wrongType.cases[0]?.caseId).toBeUndefined()
  })

  test('BATCH-17：跳过/隐藏条目进入逐文件未入库清单（不是静默成功）', async () => {
    const root = mkdtempSync(join(tmpdir(), 't06-inventory-'))
    writeFileSync(join(root, 'visible.txt'), '可见原件')
    writeFileSync(join(root, '.hidden.txt'), '隐藏原件')
    const selection = service.buildT06SelectionFromPath(root, 'folder')
    expect(selection.entries.map(entry => entry.relativePath)).toEqual(['visible.txt'])
    expect(selection.excluded?.some(item => item.relativePath === '.hidden.txt' && item.reason.includes('隐藏'))).toBe(true)
  })

  test('BATCH-15：同一 requestId 并发提交只有一个执行，另一个明确 busy', async () => {
    const selection = seedSelection([{ name: 'concurrent.txt' }])
    const request = {
      requestId: 'r-concurrent', selectionId: selection.selectionId,
      previewFingerprint: selection.previewFingerprint, templateId, templateVersion: 1, batchName: '并发批次',
      groups: [{ groupId: 'g1', entryIds: selection.entries.map(entry => entry.entryId),
        action: 'create' as const, title: '并发案卷', applicant: '甲' }],
    }
    const first = service.commitT06PhysicalImport(request)
    const second = service.commitT06PhysicalImport(request)
    await expect(second).rejects.toThrow('正在本进程处理中')
    const receipt = await first
    expect(receipt.cases[0]?.status).toBe('done')
  })

  test('RUN-45/BATCH-07：模拟进程重启后按原 requestId 从持久账本恢复，不重复建案/入库', async () => {
    const selection = seedSelection([{ name: 'resume.txt', content: '恢复原件' }])
    const request = {
      requestId: 'r-resume-ledger', selectionId: selection.selectionId,
      previewFingerprint: selection.previewFingerprint, templateId, templateVersion: 1, batchName: '恢复批次',
      groups: [{ groupId: 'g1', entryIds: selection.entries.map(entry => entry.entryId),
        action: 'create' as const, title: '恢复案卷', applicant: '甲' }],
    }
    const first = await service.commitT06PhysicalImport(request)
    const caseId = first.cases[0]!.caseId!
    const before = (await import('./case-store-v2')).readAggregate(caseId)!
    service.__resetT06ProcessCachesForTest()
    const resumed = await service.commitT06PhysicalImport(request)
    expect(resumed).toEqual(first)
    const after = (await import('./case-store-v2')).readAggregate(caseId)!
    expect(after.caseV2.revision).toBe(before.caseV2.revision)
    expect(after.caseV2.documents).toHaveLength(before.caseV2.documents.length)
  })

  test('RUN-45：中断在组执行中的账本（owner 进程已死）可被接管续跑并完成', async () => {
    const selection = seedSelection([{ name: 'half.txt', content: '半成品' }])
    const request = {
      requestId: 'r-resume-half', selectionId: selection.selectionId,
      previewFingerprint: selection.previewFingerprint, templateId, templateVersion: 1, batchName: '半成品批次',
      groups: [{ groupId: 'g1', entryIds: selection.entries.map(entry => entry.entryId),
        action: 'create' as const, title: '半成品案卷', applicant: '甲' }],
    }
    const salaries = await import('node:crypto')
    const fingerprint = salaries.createHash('sha256').update(JSON.stringify(request)).digest('hex')
    const ledgerDir = join(configDir, 'review-t06-intake', 'requests')
    mkdirSync(ledgerDir, { recursive: true })
    writeFileSync(join(ledgerDir, 'r-resume-half.json'), JSON.stringify({
      schemaVersion: 1, requestId: 'r-resume-half', requestFingerprint: fingerprint,
      selectionId: selection.selectionId, previewFingerprint: selection.previewFingerprint,
      ownerPid: 2147483646, status: 'running',
      startedAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
      groups: [{ groupId: 'g1', status: 'pending', documents: [] }],
    }))
    service.__resetT06ProcessCachesForTest()
    const receipt = await service.commitT06PhysicalImport(request)
    expect(receipt.cases[0]?.status).toBe('done')
    expect(receipt.batches?.[0]?.batchId).toBeTruthy()
  })

  test('BATCH-09：产品建批入口拒绝不存在案卷/模板不符/政策锁不一致', async () => {
    const { createBatchV2Validated } = await import('./batch-store')
    const base = { name: '校验批次', templateId, templateVersion: 1, policyVersionLock: [], createdAt: new Date().toISOString() }
    expect(() => createBatchV2Validated({ ...base, id: 'b2-missing', caseIds: ['case-does-not-exist'] } as never))
      .toThrow('批次成员与模板/政策锁不一致')
    expect(() => createBatchV2Validated({ ...base, id: 'b2-lock', caseIds: ['case-does-not-exist'],
      policyVersionLock: [{ policyVersionId: 'p', version: 2 }] } as never))
      .toThrow('政策锁')
    const selection = seedSelection([{ name: 'valid.txt' }])
    const receipt = await service.commitT06PhysicalImport({
      requestId: 'r-valid-batch', selectionId: selection.selectionId,
      previewFingerprint: selection.previewFingerprint, templateId, templateVersion: 1, batchName: '合法批次',
      groups: [{ groupId: 'g1', entryIds: selection.entries.map(entry => entry.entryId),
        action: 'create' as const, title: '合法案卷', applicant: '甲' }],
    })
    const caseId = receipt.cases[0]!.caseId!
    const created = createBatchV2Validated({ ...base, id: 'b2-valid', caseIds: [caseId] } as never)
    expect(created.batch.caseIds).toEqual([caseId])
  })

  test('预览后即使字节长度未变，更换原件也必须拒绝入库', async () => {
    const root = mkdtempSync(join(tmpdir(), 't06-swapped-'))
    writeFileSync(join(root, 'proof.txt'), 'AAA')
    const selected = service.buildT06SelectionFromPath(root, 'folder')
    writeFileSync(join(root, 'proof.txt'), 'BBB')
    const result = await service.commitT06PhysicalImport({
      requestId: 'r-swapped', selectionId: selected.selectionId, previewFingerprint: selected.previewFingerprint,
      templateId, templateVersion: 1, batchName: '变更文件',
      groups: [{ groupId: 'g', action: 'create', entryIds: [selected.entries[0]!.entryId], title: '原件变更', applicant: '甲' }],
    })
    expect(result.cases[0]?.status).toBe('failed')
    expect(result.cases[0]?.error).toContain('内容已变化')
  })
})
