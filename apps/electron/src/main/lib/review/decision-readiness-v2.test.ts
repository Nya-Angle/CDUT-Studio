import { describe, expect, test } from 'bun:test'
import { assessDecisionReadiness } from '@profer/shared'
import type { CaseAggregateV2, ReviewRunV2, TemplateVersion } from '@profer/shared'

const subject = { id: 's1', type: 'item' as const, title: '竞赛事项', fields: {}, sourceRefs: [], correction: 'user-confirmed' as const, status: 'identified' as const }
const aggregate = (overrides: Partial<CaseAggregateV2> = {}): CaseAggregateV2 => ({
  caseV2: { id: 'c1', templateId: 't', templateVersion: 1, title: '测试案卷', objectType: 'person', caseFields: {}, subjects: [subject], documents: [], stage: 'reviewing', revision: 1, createdAt: '', updatedAt: '' },
  observations: [], evidenceLinks: [], dispositions: [], tasks: [], decisions: [], supplements: [], appeals: [], receiptLog: [], ...overrides,
})
const run = (overrides: Partial<ReviewRunV2> = {}): ReviewRunV2 => ({
  id: 'r1', caseId: 'c1', templateId: 't', templateVersion: 1,
  inputManifest: { hash: 'h1', templateVersion: 1, policyVersions: [], documentVersions: [], observationIds: [], evidenceLinkIds: [], effectiveRuleIds: ['rule-a'], effectiveRuleDependencies: [] },
  status: 'completed', checkpoints: [], checks: [{ checkId: 'check-a', ruleId: 'rule-a', target: { scope: 'subject', subjectIds: ['s1'] }, status: 'compliant', reason: '符合', sourceRefs: [], executedBy: 'deterministic', executedAt: '' }], opinions: [],
  coverage: { documents: [], plannedChecks: 1, completedChecks: 1, effectiveVerdicts: 1, pendingChecks: 0 }, diagnostics: [], startedAt: '', completedAt: '', ...overrides,
})
const accepted = { id: 'a1', subjectId: 's1', outcome: 'accepted' as const, reason: '人工核验', basedOnRunId: 'r1', inputHash: 'h1', actor: { actorId: 'reviewer', actorSource: 'local' as const, role: 'reviewer' as const }, at: '' }

describe('UI/服务端统一的最终决定就绪判断', () => {
  test('缺少事项认定、未确认的规则相关事实和未读材料会共同阻断', () => {
    const result = assessDecisionReadiness({
      aggregate: aggregate({ caseV2: { ...aggregate().caseV2, documents: [{ documentId: 'd1', versionId: 'd1-v1', contentHash: '', role: 'evidence', fileName: '证书.pdf', mimeType: 'application/pdf', sizeBytes: 10, assetPath: '', parseRevision: 1, parseStatus: 'parsed', blocks: [], usage: 'unread' }] } }),
      run: run({ inputManifest: { ...run().inputManifest, effectiveRuleDependencies: [{ ruleId: 'rule-a', fieldKeys: ['level'] }] } }),
      runStale: false,
      observations: [{ subjectId: 's1', fieldKey: 'level', confirmed: false, extractedBy: 'ai' }],
    })
    expect(result.blockers.map((blocker) => blocker.kind)).toEqual(expect.arrayContaining(['missing-adjudication', 'unconfirmed-fact', 'unread-material']))
    expect(result.ready).toBeFalse()
  })

  test('Agent 本次运行已完整读取的材料不再因案卷元数据仍为 registered 而阻断决定', () => {
    const document = { documentId: 'd1', versionId: 'd1-v1', contentHash: '', role: 'evidence' as const, fileName: '证书.pdf', mimeType: 'application/pdf', sizeBytes: 10, assetPath: '', parseRevision: 1, parseStatus: 'parsed' as const, blocks: [{ blockId: 'b1', text: '内容', kind: 'text' as const }], usage: 'registered' as const }
    const result = assessDecisionReadiness({
      aggregate: aggregate({ caseV2: { ...aggregate().caseV2, documents: [document] }, adjudications: [accepted] }),
      run: run({ coverage: { documents: [{ documentVersionId: document.versionId, status: 'read' }], plannedChecks: 1, completedChecks: 1, effectiveVerdicts: 1, pendingChecks: 0 } }),
      runStale: false,
      template: { materialSlots: [] } as unknown as TemplateVersion,
    })
    expect(result).toEqual({ ready: true, blockers: [] })
  })

  test('解析失败材料的历史空占位块阅读状态不能解除最终决定阻断', () => {
    const document = { documentId: 'd1', versionId: 'd1-v1', contentHash: '', role: 'evidence' as const, fileName: '损坏.pdf', mimeType: 'application/pdf', sizeBytes: 10, assetPath: '', parseRevision: 1, parseStatus: 'failed' as const, parseError: '文件损坏', blocks: [{ blockId: 'placeholder', text: '', kind: 'text' as const }], usage: 'read' as const }
    const result = assessDecisionReadiness({
      aggregate: aggregate({ caseV2: { ...aggregate().caseV2, documents: [document] }, adjudications: [accepted] }),
      run: run({ coverage: { documents: [{ documentVersionId: document.versionId, status: 'unread', reason: '自动解析失败；读取空占位块不代表读取了原件' }], plannedChecks: 1, completedChecks: 1, effectiveVerdicts: 1, pendingChecks: 0 } }),
      runStale: false,
      template: { materialSlots: [] } as unknown as TemplateVersion,
    })
    expect(result.blockers).toContainEqual(expect.objectContaining({ kind: 'unread-material', id: document.versionId }))
  })

  test('解析失败原件即使运行账本误写 read，也必须等人工核对原件', () => {
    const document = { documentId: 'd1', versionId: 'd1-v1', contentHash: '', role: 'evidence' as const, fileName: '不可读扫描件.pdf', mimeType: 'application/pdf', sizeBytes: 10, assetPath: '', parseRevision: 1, parseStatus: 'failed' as const, blocks: [], usage: 'registered' as const }
    const result = assessDecisionReadiness({
      aggregate: aggregate({ caseV2: { ...aggregate().caseV2, documents: [document] }, adjudications: [accepted] }),
      run: run({ coverage: { documents: [{ documentVersionId: document.versionId, status: 'read' }], plannedChecks: 1, completedChecks: 1, effectiveVerdicts: 1, pendingChecks: 0 } }),
      runStale: false,
      template: { materialSlots: [] } as unknown as TemplateVersion,
    })
    expect(result.blockers).toContainEqual(expect.objectContaining({ kind: 'unread-material', id: document.versionId }))
    expect(result.ready).toBeFalse()
  })

  test('检查引用其他案卷的材料不能形成最终通过决定', () => {
    const document = { documentId: 'd1', versionId: 'd1-v1', contentHash: '', role: 'evidence' as const, fileName: '成绩证明.pdf', mimeType: 'application/pdf', sizeBytes: 10, assetPath: '', parseRevision: 1, parseStatus: 'parsed' as const, blocks: [], usage: 'read' as const }
    const source = { caseId: 'another-case', documentVersionId: document.versionId, parseRevision: 1, location: { kind: 'file' as const } }
    const result = assessDecisionReadiness({
      aggregate: aggregate({ caseV2: { ...aggregate().caseV2, documents: [document] }, adjudications: [accepted] }),
      run: run({ checks: [{ ...run().checks[0]!, sourceRefs: [source] }] }),
      runStale: false,
      template: { materialSlots: [] } as unknown as TemplateVersion,
    })
    expect(result.blockers).toContainEqual(expect.objectContaining({ kind: 'unresolved-check', id: 'check-a', message: expect.stringContaining('材料引用不属于当前案卷') }))
  })

  test('已经归属另一事项的证明不能静默支持本事项通过', () => {
    const document = { documentId: 'd1', versionId: 'd1-v1', contentHash: '', role: 'evidence' as const, fileName: '其他人的证书.pdf', mimeType: 'application/pdf', sizeBytes: 10, assetPath: '', parseRevision: 1, parseStatus: 'parsed' as const, blocks: [], usage: 'read' as const }
    const source = { caseId: 'c1', documentVersionId: document.versionId, parseRevision: 1, location: { kind: 'file' as const } }
    const result = assessDecisionReadiness({
      aggregate: aggregate({
        caseV2: { ...aggregate().caseV2, documents: [document], subjects: [subject, { ...subject, id: 's2', title: '另一事项' }] },
        evidenceLinks: [{ id: 'link-s2', documentVersionId: document.versionId, subjectId: 's2', supportsFact: '竞赛获奖', status: 'confirmed', linkedBy: 'user' }],
        adjudications: [accepted],
      }),
      run: run({ checks: [{ ...run().checks[0]!, sourceRefs: [source] }] }),
      runStale: false,
      template: { materialSlots: [] } as unknown as TemplateVersion,
    })
    expect(result.blockers).toContainEqual(expect.objectContaining({ kind: 'unresolved-check', id: 'check-a', message: expect.stringContaining('归属其他事项') }))
  })

  test('审核员明确确认核对原件后，解析失败材料解除未读材料阻断', () => {
    const document = { documentId: 'd1', versionId: 'd1-v1', contentHash: '', role: 'evidence' as const, fileName: '扫描件.pdf', mimeType: 'application/pdf', sizeBytes: 10, assetPath: '', parseRevision: 1, parseStatus: 'failed' as const, blocks: [], usage: 'read' as const, manualReadReceipt: { actorId: 'reviewer', reason: '已逐页核对原件', at: '' } }
    const result = assessDecisionReadiness({
      aggregate: aggregate({ caseV2: { ...aggregate().caseV2, documents: [document] } }),
      run: run({ coverage: { documents: [{ documentVersionId: document.versionId, status: 'unread', reason: '解析失败' }], plannedChecks: 1, completedChecks: 1, effectiveVerdicts: 1, pendingChecks: 0 } }),
      runStale: false,
      template: { materialSlots: [] } as unknown as TemplateVersion,
    })
    expect(result.blockers.some((blocker) => blocker.kind === 'unread-material' && blocker.id === document.versionId)).toBeFalse()
  })

  test('审核员明确忽略的解析失败材料不再伪装成待读材料阻断', () => {
    const document = { documentId: 'd1', versionId: 'd1-v1', contentHash: '', role: 'evidence' as const, fileName: '无关附件.pdf', mimeType: 'application/pdf', sizeBytes: 10, assetPath: '', parseRevision: 1, parseStatus: 'failed' as const, blocks: [], usage: 'read' as const, unusedReason: '[审核员忽略] 与本次申报无关' }
    const result = assessDecisionReadiness({
      aggregate: aggregate({ caseV2: { ...aggregate().caseV2, documents: [document] } }),
      run: run({ coverage: { documents: [{ documentVersionId: document.versionId, status: 'unread', reason: '解析失败' }], plannedChecks: 1, completedChecks: 1, effectiveVerdicts: 1, pendingChecks: 0 } }),
      runStale: false,
      template: { materialSlots: [] } as unknown as TemplateVersion,
    })
    expect(result.blockers.some((blocker) => blocker.kind === 'unread-material' && blocker.id === document.versionId)).toBeFalse()
  })

  test('当前运行只部分读取材料时仍保留带读取范围的阻断', () => {
    const document = { documentId: 'd1', versionId: 'd1-v1', contentHash: '', role: 'evidence' as const, fileName: '申请书.docx', mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', sizeBytes: 10, assetPath: '', parseRevision: 1, parseStatus: 'parsed' as const, blocks: [{ blockId: 'b1', text: '内容', kind: 'text' as const }], usage: 'registered' as const }
    const reason = '本次审核通过材料工具读取了 1/4 个材料块'
    const result = assessDecisionReadiness({
      aggregate: aggregate({ caseV2: { ...aggregate().caseV2, documents: [document] }, adjudications: [accepted] }),
      run: run({ coverage: { documents: [{ documentVersionId: document.versionId, status: 'partially-read', reason }], plannedChecks: 1, completedChecks: 1, effectiveVerdicts: 1, pendingChecks: 0 } }),
      runStale: false,
      template: { materialSlots: [] } as unknown as TemplateVersion,
    })
    expect(result.blockers).toContainEqual(expect.objectContaining({ kind: 'unread-material', id: document.versionId, message: expect.stringContaining(reason) }))
  })

  test('非规则相关事实不阻断，当前认定和显式豁免可以完成决定就绪', () => {
    const result = assessDecisionReadiness({
      aggregate: aggregate({ adjudications: [accepted], dispositions: [{ findingKey: 'check-a', disposition: 'waived', actor: 'reviewer', reason: '保留人工豁免记录', at: '', runId: 'r1', inputHash: 'h1' }] }),
      run: run(), runStale: false, template: { materialSlots: [] } as unknown as TemplateVersion,
      observations: [{ subjectId: 's1', fieldKey: 'hobby', confirmed: false, extractedBy: 'ai' }],
    })
    expect(result).toEqual({ ready: true, blockers: [] })
  })

  test('没有有效规则时无论检查为空都不能作最终决定', () => {
    const result = assessDecisionReadiness({ aggregate: aggregate({ adjudications: [accepted] }), run: run({ checks: [], coverage: { documents: [], plannedChecks: 0, completedChecks: 0, effectiveVerdicts: 0, pendingChecks: 0 }, inputManifest: { ...run().inputManifest, effectiveRuleIds: [] } }), runStale: false, template: { materialSlots: [] } as unknown as TemplateVersion })
    expect(result.blockers.some((blocker) => blocker.kind === 'zero-effective-rules')).toBeTrue()
  })

  test('缺少 submission 阶段材料槽可以完成初审，但仍阻断最终决定', () => {
    const document = { documentId: 'd1', versionId: 'd1-v1', contentHash: '', role: 'application' as const, fileName: '申请书.txt', mimeType: 'text/plain', sizeBytes: 10, assetPath: '', parseRevision: 1, parseStatus: 'parsed' as const, blocks: [{ blockId: 'b1', text: '申请内容', kind: 'text' as const }], usage: 'read' as const }
    const slot = { id: 'plan', name: '实验计划', purpose: '计划说明', acceptedKinds: ['pdf'], minCount: 1, maxCount: 1, requiredElements: [], allowReuseAcrossSubjects: false, requiredAt: 'submission' }
    const result = assessDecisionReadiness({
      aggregate: aggregate({ caseV2: { ...aggregate().caseV2, documents: [document] }, adjudications: [accepted] }),
      run: run(), runStale: false, template: { materialSlots: [slot] } as unknown as TemplateVersion,
    })
    expect(result.blockers).toContainEqual(expect.objectContaining({ kind: 'missing-material-slot', id: 'plan' }))
    expect(result.ready).toBeFalse()
  })

  test('覆盖账本中缺少计划结果时不能只靠现有检查作决定', () => {
    const result = assessDecisionReadiness({
      aggregate: aggregate({ adjudications: [accepted] }),
      run: run({ coverage: { documents: [], plannedChecks: 2, completedChecks: 1, effectiveVerdicts: 1, pendingChecks: 0 } }),
      runStale: false,
    })
    expect(result.blockers).toContainEqual(expect.objectContaining({ kind: 'unresolved-check', id: 'coverage:missing-results' }))
    expect(result.ready).toBeFalse()
  })
})
