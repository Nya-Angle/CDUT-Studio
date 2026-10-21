import { describe, expect, test } from 'bun:test'
import type { CaseAggregateV2, ReviewRunV2, TemplateVersion } from '@profer/shared'
import { buildReviewWorkspaceViewModel } from './review-workspace-view-model'

const baseCase: CaseAggregateV2['caseV2'] = {
  id: 'workspace-case', templateId: 't', templateVersion: 1, title: '单案测试', objectType: 'person',
  caseFields: {}, subjects: [],
  documents: [], stage: 'reviewing', revision: 1, createdAt: '', updatedAt: '',
}
const check = {
  checkId: 'check-1', ruleId: 'rule-1', target: { scope: 'case' as const, subjectIds: [] },
  status: 'non-compliant' as const, reason: '申报等级与依据不符', sourceRefs: [], executedBy: 'deterministic' as const, executedAt: '',
}

function aggregate(overrides: Partial<CaseAggregateV2> = {}): CaseAggregateV2 {
  return { caseV2: baseCase, observations: [], evidenceLinks: [], dispositions: [], tasks: [], decisions: [], supplements: [], appeals: [], receiptLog: [], ...overrides }
}
function run(overrides: Partial<ReviewRunV2> = {}): ReviewRunV2 {
  return {
    id: 'run-1', caseId: 'workspace-case', templateId: 't', templateVersion: 1,
    inputManifest: { hash: 'hash-1', templateVersion: 1, policyVersions: [], documentVersions: [], observationIds: [], evidenceLinkIds: [] },
    status: 'completed', checkpoints: [], checks: [check], opinions: [],
    coverage: { documents: [], plannedChecks: 1, completedChecks: 1, effectiveVerdicts: 1, pendingChecks: 0 }, diagnostics: [], startedAt: '', completedAt: '',
    ...overrides,
  }
}

describe('单案审核工作台 ViewModel', () => {
  test('未处置的问题必须进入待办且不能最终决定', () => {
    const view = buildReviewWorkspaceViewModel(aggregate(), run(), false)
    expect(view.pendingActions.map((item) => item.key)).toContain('check:check-1')
    expect(view.canDecide).toBeFalse()
    expect(view.canReject).toBeTrue()
    expect(view.status).toBe('needs-attention')
  })

  test('当前运行下已记录处置的问题进入已处理；旧输入处置不生效', () => {
    const current = { findingKey: 'check-1', disposition: 'false-positive', actor: 'reviewer', reason: '人工复核不是问题', at: '', runId: 'run-1', inputHash: 'hash-1' }
    const old = { ...current, inputHash: 'old-hash' }
    const template = { materialSlots: [] } as unknown as TemplateVersion
    const active = buildReviewWorkspaceViewModel(aggregate({ dispositions: [current] }), run(), false, [], template)
    const stale = buildReviewWorkspaceViewModel(aggregate({ dispositions: [old] }), run(), false, [], template)
    expect(active.pendingActions).toHaveLength(0)
    expect(active.resolvedActions).toHaveLength(1)
    expect(active.canDecide).toBeTrue()
    expect(active.canReject).toBeTrue()
    expect(stale.pendingActions).toHaveLength(1)
    expect(stale.canDecide).toBeFalse()
    expect(stale.canReject).toBeTrue()
  })

  test('整案驳回后关闭剩余待办，但明确保留“未逐条确认”的含义', () => {
    const rejection = {
      id: 'decision-1', actor: { actorId: 'reviewer', actorSource: 'local' as const, role: 'reviewer' as const },
      scope: { kind: 'case' as const, ids: [] }, stageId: 'reviewing', result: 'reject' as const,
      reason: '申报材料不符合要求', basedOnRunId: 'run-1', basedOnRevision: 1, at: '', finality: 'final' as const,
    }
    const input = aggregate({ caseV2: { ...baseCase, stage: 'decided' }, decisions: [rejection] })

    const view = buildReviewWorkspaceViewModel(input, run(), false)

    expect(view.pendingActions).toHaveLength(0)
    expect(view.closedActions).toContainEqual(expect.objectContaining({
      key: 'check:check-1',
      detail: expect.stringContaining('不表示该条 AI 发现或材料已被逐项确认'),
    }))
    expect(view.status).toBe('decided')
  })

  test('过期运行仍不能作出最终驳回', () => {
    const view = buildReviewWorkspaceViewModel(aggregate(), run(), true)
    expect(view.canReject).toBeFalse()
  })

  test('事实、候选证明、未读材料和补件统一显示为待处理', () => {
    const input = aggregate({
      caseV2: { ...baseCase, documents: [{ documentId: 'd', versionId: 'd-v1', contentHash: '', role: 'evidence', fileName: '证书.pdf', mimeType: 'application/pdf', sizeBytes: 1, assetPath: '', parseRevision: 1, parseStatus: 'failed', parseError: '文件不可读', blocks: [], usage: 'unread', unusedReason: '文件不可读' }] },
      evidenceLinks: [{ id: 'e1', documentVersionId: 'd-v1', subjectId: 's1', supportsFact: '等级证明', status: 'candidate', linkedBy: 'ai' }],
      supplements: [{ id: 'sup1', caseId: 'workspace-case', originFindingKeys: [], requiredElements: ['日期'], reason: '材料缺日期', responsibleRole: 'student', status: 'open', responses: [], createdAt: '' }],
    })
    const view = buildReviewWorkspaceViewModel(input, run({ checks: [] }), false, [{ subjectId: 's1', fieldKey: 'level', value: '省级', confidence: 0.4, confirmed: false }])
    expect(view.pendingActions.map((item) => item.kind)).toEqual(expect.arrayContaining(['fact', 'evidence', 'material', 'supplement']))
    expect(view.canDecide).toBeFalse()
  })

  test('材料读取状态以当前运行账本为准，不把案卷中的登记状态误报为未读', () => {
    const document = {
      documentId: 'doc-1', versionId: 'doc-1-v1', contentHash: 'hash', role: 'evidence' as const,
      fileName: '证明材料.pdf', mimeType: 'application/pdf', sizeBytes: 1, assetPath: '', parseRevision: 1,
      parseStatus: 'parsed' as const, blocks: [{ blockId: 'block-1', text: '材料内容', kind: 'text' as const }], usage: 'registered' as const,
    }
    const input = aggregate({ caseV2: { ...baseCase, documents: [document] } })
    const currentRun = run({ coverage: { documents: [{ documentVersionId: document.versionId, status: 'read' }], plannedChecks: 1, completedChecks: 1, effectiveVerdicts: 1, pendingChecks: 0 } })
    const view = buildReviewWorkspaceViewModel(input, currentRun, false)

    expect(view.pendingActions.some((item) => item.key === `material:${document.versionId}`)).toBeFalse()
  })

  test('本次运行有部分读取记录时显示部分读取，并保留运行原因', () => {
    const document = {
      documentId: 'doc-2', versionId: 'doc-2-v1', contentHash: 'hash', role: 'evidence' as const,
      fileName: '较长的申请书.docx', mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      sizeBytes: 1, assetPath: '', parseRevision: 1, parseStatus: 'parsed' as const,
      blocks: [{ blockId: 'block-1', text: '材料内容', kind: 'text' as const }], usage: 'registered' as const,
    }
    const reason = '本次审核通过材料工具读取了 1/4 个材料块'
    const currentRun = run({ coverage: { documents: [{ documentVersionId: document.versionId, status: 'partially-read', reason }], plannedChecks: 1, completedChecks: 1, effectiveVerdicts: 1, pendingChecks: 0 } })
    const view = buildReviewWorkspaceViewModel(aggregate({ caseV2: { ...baseCase, documents: [document] } }), currentRun, false)

    expect(view.pendingActions).toContainEqual(expect.objectContaining({
      key: `material:${document.versionId}`,
      title: `本次审核仅部分读取：${document.fileName}`,
      detail: expect.stringContaining(reason),
    }))
  })

  test('历史 failed 材料即使残留 usage=read 的占位块记录也仍进入待处理', () => {
    const aggregateWithFailedRead = aggregate({
      caseV2: { ...baseCase, documents: [{ documentId: 'd', versionId: 'd-v1', contentHash: '', role: 'evidence', fileName: '损坏.pdf', mimeType: 'application/pdf', sizeBytes: 1, assetPath: '', parseRevision: 1, parseStatus: 'failed', parseError: '文件损坏', blocks: [{ blockId: 'placeholder', text: '', kind: 'text' }], usage: 'read' }] },
    })
    const view = buildReviewWorkspaceViewModel(aggregateWithFailedRead, run(), false)
    expect(view.pendingActions).toContainEqual(expect.objectContaining({
      key: 'material:d-v1',
      detail: expect.stringContaining('空占位内容不能证明读过原件'),
    }))
  })

  test('无置信度字段时不把未知值显示成 0%', () => {
    const view = buildReviewWorkspaceViewModel(aggregate(), run({ checks: [] }), false, [
      { subjectId: 'case', fieldKey: 'studentName', value: '林若岚', confirmed: false, extractedBy: 'ai' },
    ])
    expect(view.pendingActions).toContainEqual(expect.objectContaining({
      kind: 'fact',
      detail: '尚未人工核对；本次提取未提供置信度',
    }))
  })

  test('审核员明确忽略的解析失败材料只显示在已处理，不重复进入待读队列', () => {
    const ignored = { documentId: 'd', versionId: 'd-v1', contentHash: '', role: 'evidence' as const, fileName: '无关附件.pdf', mimeType: 'application/pdf', sizeBytes: 1, assetPath: '', parseRevision: 1, parseStatus: 'failed' as const, blocks: [], usage: 'read' as const, unusedReason: '[审核员忽略] 与本次申报无关' }
    const view = buildReviewWorkspaceViewModel(aggregate({ caseV2: { ...baseCase, documents: [ignored] } }), run(), false)
    expect(view.pendingActions.some((item) => item.key === 'material:d-v1')).toBeFalse()
    expect(view.resolvedActions).toContainEqual(expect.objectContaining({ key: 'material:d-v1', title: '已人工忽略：无关附件.pdf' }))
  })

  test('审核员确认已核对解析失败原件后不再显示为待读材料', () => {
    const checked = { documentId: 'd', versionId: 'd-v1', contentHash: '', role: 'evidence' as const, fileName: '扫描件.pdf', mimeType: 'application/pdf', sizeBytes: 1, assetPath: '', parseRevision: 1, parseStatus: 'failed' as const, blocks: [], usage: 'read' as const, manualReadReceipt: { actorId: 'reviewer', reason: '已逐页核对', at: '' } }
    const view = buildReviewWorkspaceViewModel(aggregate({ caseV2: { ...baseCase, documents: [checked] } }), run(), false)
    expect(view.pendingActions.some((item) => item.key === 'material:d-v1')).toBeFalse()
    expect(view.resolvedActions).toContainEqual(expect.objectContaining({ key: 'material:d-v1', title: '已人工核对：扫描件.pdf', detail: '已逐页核对' }))
  })

  test('决策阶段必需的证明槽生成可持久验证的材料槽待办', () => {
    const template = { materialSlots: [{ id: 'certificates', name: '证明材料', minCount: 1, requiredAt: 'decision' }] } as unknown as TemplateVersion
    const view = buildReviewWorkspaceViewModel(aggregate(), run(), false, [], template)
    expect(view.pendingActions).toContainEqual(expect.objectContaining({ key: 'material-slot:certificates', kind: 'material-slot', materialSlotId: 'certificates' }))
    expect(view.canDecide).toBeFalse()
  })

  test('高置信度不能跳过与有效规则相关事实的人工确认，非相关事实保持安静', () => {
    const input = aggregate({ caseV2: { ...baseCase, subjects: [{ id: 's1', type: 'item', title: '竞赛事项', fields: {}, sourceRefs: [], correction: 'user-confirmed', status: 'identified' }] } })
    const extracted = [
      { subjectId: 's1', fieldKey: 'level', value: '省级', confidence: 0.99, confirmed: false, extractedBy: 'ai', sourceRefs: [{ documentVersionId: 'e-v1' }] },
      { subjectId: 's1', fieldKey: 'hobby', value: '摄影', confidence: 0.2, confirmed: false, extractedBy: 'ai', sourceRefs: [{ documentVersionId: 'e-v1' }] },
    ]
    const result = buildReviewWorkspaceViewModel(input, run({ inputManifest: { ...run().inputManifest, effectiveRuleDependencies: [{ ruleId: 'rule-1', fieldKeys: ['level'] }] } }), false, extracted)
    expect(result.pendingActions.filter((item) => item.kind === 'fact').map((item) => item.title)).toEqual(['待核实：获奖等级 省级'])
  })

  test('未最终认定的申报事项本身就是可恢复的待办', () => {
    const input = aggregate({ caseV2: { ...baseCase, subjects: [{ id: 's1', type: 'item', title: '竞赛事项', fields: {}, sourceRefs: [], correction: 'user-confirmed', status: 'identified' }] } })
    const result = buildReviewWorkspaceViewModel(input, run({ checks: [] }), false)
    expect(result.pendingActions).toContainEqual(expect.objectContaining({ key: 'adjudication:s1', kind: 'adjudication' }))
    expect(result.canDecide).toBeFalse()
  })

  test('待办只映射为三类展示任务、按业务优先级排序，并沿用共享决定准备度', () => {
    const input = aggregate({
      caseV2: {
        ...baseCase,
        subjects: [{ id: 's1', type: 'item', title: '竞赛事项', fields: {}, sourceRefs: [], correction: 'user-confirmed', status: 'identified' }],
        documents: [{ documentId: 'd', versionId: 'd-v1', contentHash: '', role: 'evidence', fileName: '证书.pdf', mimeType: 'application/pdf', sizeBytes: 1, assetPath: '', parseRevision: 1, parseStatus: 'failed', parseError: '文件不可读', blocks: [], usage: 'unread' }],
      },
      evidenceLinks: [{ id: 'link-1', documentVersionId: 'd-v1', subjectId: 's1', supportsFact: '获奖等级', status: 'candidate', linkedBy: 'ai' }],
      supplements: [{ id: 'sup1', caseId: 'workspace-case', originFindingKeys: [], requiredElements: ['日期'], reason: '材料缺日期', responsibleRole: 'student', status: 'open', responses: [], createdAt: '' }],
    })
    const currentRun = run({ checks: [{ ...check, status: 'awaiting-confirmation', reason: '等级需人工核实' }] })
    const view = buildReviewWorkspaceViewModel(input, currentRun, false, [{ subjectId: 's1', fieldKey: 'level', value: '省级二等奖', confidence: 0.5, confirmed: false }])

    expect(view.pendingActions[0]?.kind).toBe('check')
    expect(view.pendingActions[0]?.presentationGroup).toBe('verify')
    expect(new Set(view.pendingActions.map((item) => item.presentationGroup))).toEqual(new Set(['verify', 'resolve', 'adjudicate']))
    expect(view.decisionReadiness.ready).toBeFalse()
    expect(view.decisionReadiness.blockers.length).toBeGreaterThan(0)
  })
})
