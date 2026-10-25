import { expect, test } from 'bun:test'
import type { CaseAggregateV2, ReviewRunV2, TemplateVersion } from '@profer/shared'
import { makeT08CaseReport, t08ReportWorkbookSheets } from './review-v3-t08-case-report'

test('T08 student report renders public field key-values, not object placeholders or internal fields', () => {
  const aggregate = {
    caseV2: {
      id: 'case-report-1',
      documents: [],
      subjects: [{ id: 'subject-1', title: '事项 A', fields: {
        publicNote: { value: '申请完成' },
        internalNote: { value: '内部核验说明' },
      } }],
    },
    decisions: [],
    dispositions: [],
    supplements: [],
  } as unknown as CaseAggregateV2
  const run = {
    id: 'run-report-1',
    caseId: 'case-report-1',
    inputManifest: { hash: 'manifest-1', documentVersions: [] },
    status: 'completed',
    templateId: 'template-1',
    templateVersion: 1,
    coverage: { effectiveVerdicts: 0, plannedChecks: 0, pendingChecks: 0 },
    checks: [],
    opinions: [],
  } as unknown as ReviewRunV2
  const template = {
    templateId: 'template-1', version: 1,
    fields: [
      { key: 'publicNote', visibility: 'public' },
      { key: 'internalNote', visibility: 'internal' },
    ],
  } as unknown as TemplateVersion
  const student = makeT08CaseReport({ aggregate, run, template, audience: 'student', stale: false })
  expect(student.markdown).toContain('publicNote：申请完成')
  expect(student.markdown).not.toContain('[object Object]')
  expect(student.markdown).not.toContain('内部核验说明')
  expect(student.json).not.toContain('internalNote')
  const reviewer = makeT08CaseReport({ aggregate, run, template, audience: 'reviewer', stale: false })
  expect(reviewer.markdown).toContain('internalNote：内部核验说明')
})

test('T08 distinguishes preliminary, pending supplement, final decision and historical without claiming school issuance', () => {
  const base = {
    caseV2: { id: 'case-kind', documents: [], subjects: [] }, decisions: [], dispositions: [], supplements: [],
  } as unknown as CaseAggregateV2
  const run = {
    id: 'run-kind', caseId: 'case-kind', templateId: 't', templateVersion: 1,
    inputManifest: { hash: 'input-kind', documentVersions: [] }, status: 'completed',
    coverage: { effectiveVerdicts: 1, plannedChecks: 1, pendingChecks: 0 }, checks: [], opinions: [],
  } as unknown as ReviewRunV2
  const make = (aggregate: CaseAggregateV2, stale = false) =>
    makeT08CaseReport({ aggregate, run, audience: 'student', stale })
  expect(make(base).kind).toBe('preliminary')
  const pending = { ...base, supplements: [{ id: 's', status: 'open', reason: '缺件', requiredElements: ['附件'] }] } as CaseAggregateV2
  expect(make(pending).kind).toBe('supplement-needed')
  const decided = { ...base, decisions: [{
    id: 'final', basedOnRunId: run.id, finality: 'final', at: '2026-10-24T00:00:00Z', result: 'pass',
    reason: '符合', stageId: 'final', basedOnRevision: 1, actor: { actorId: 'local', actorSource: 'local', role: 'reviewer' },
    scope: { kind: 'case', ids: [] },
  }] } as CaseAggregateV2
  expect(make(decided).kind).toBe('decided')
  expect(make(decided).markdown).toContain('非学校签发')
  expect(make(decided, true).kind).toBe('historical')
  expect(make(pending).json).toContain('"reportKind": "supplement-needed"')
})

test('F16 student report does not disclose internal check reasons, source quotes or full run manifest', () => {
  const aggregate = {
    caseV2: {
      id: 'case-private', documents: [
        { documentId: 'doc-rule', versionId: 'v-rule', role: 'rule', fileName: '内部政策秘密.pdf', parseRevision: 1, blocks: [] },
        { documentId: 'doc-student', versionId: 'v-student', role: 'application', fileName: '申请.pdf', parseRevision: 1, blocks: [] },
      ], subjects: [{ id: 's1', title: '报名', fields: { secret: { value: '内部暗号' }, name: { value: '甲' } } }],
    }, decisions: [], dispositions: [], supplements: [],
  } as unknown as CaseAggregateV2
  const run = {
    id: 'r-private', caseId: 'case-private', templateId: 't-private', templateVersion: 1,
    inputManifest: { hash: 'hash-visible', observationIds: ['internal-observation'], evidenceLinkIds: ['private-evidence'],
      documentVersions: [{ documentId: 'doc-rule', versionId: 'v-rule', contentHash: 'h-rule' },
        { documentId: 'doc-student', versionId: 'v-student', contentHash: 'h-student' }] },
    status: 'partially-completed',
    coverage: { plannedChecks: 2, completedChecks: 1, effectiveVerdicts: 0, pendingChecks: 1, documents: [] },
    checks: [{ checkId: 'c1', ruleId: 'p1', status: 'pending', reason: '仅内部可见的审核判断',
      sourceRefs: [{ caseId: 'case-private', documentVersionId: 'v-rule', parseRevision: 1,
        location: { kind: 'file' }, quote: '内部证据原文' }], executedBy: 'pi' }],
    opinions: [{ id: 'o1', title: '秘密意见', detail: '内部模型推理', sourceRefs: [] }], diagnostics: ['内部运行诊断'],
  } as unknown as ReviewRunV2
  const template = { templateId: 't-private', version: 1, fields: [
    { key: 'name', visibility: 'public' }, { key: 'secret', visibility: 'internal' },
  ] } as unknown as TemplateVersion
  const student = makeT08CaseReport({ aggregate, run, template, audience: 'student', stale: false })
  const studentAll = student.markdown + student.json + JSON.stringify(t08ReportWorkbookSheets(student))
  for (const secret of ['内部政策秘密', '内部暗号', '内部证据原文', '仅内部可见', 'internal-observation', 'private-evidence', '秘密意见', '内部运行诊断']) {
    expect(studentAll).not.toContain(secret)
  }
  expect(studentAll).toContain('申请.pdf')
  expect(studentAll).toContain('hash-visible')
  expect(t08ReportWorkbookSheets(student).map((sheet) => sheet.name)).toContain('原件版本')

  const reviewer = makeT08CaseReport({ aggregate, run, template, audience: 'reviewer', stale: false })
  expect(reviewer.json).toContain('internal-observation')
  expect(reviewer.json).toContain('内部证据原文')
  expect(reviewer.markdown).toContain('内部暗号')
})

test('F16 historical report omits mutable current subjects and rejects a mismatched case', () => {
  const aggregate = { caseV2: { id: 'a', documents: [], subjects: [
    { id: 's1', title: '当前记录', fields: { field: { value: '新补写的数据' } } },
  ] }, decisions: [], dispositions: [], supplements: [] } as unknown as CaseAggregateV2
  const run = { id: 'old', caseId: 'a', templateId: 't', templateVersion: 2,
    inputManifest: { hash: 'old-hash', documentVersions: [] }, status: 'completed',
    coverage: { effectiveVerdicts: 0, plannedChecks: 0, pendingChecks: 0 }, checks: [], opinions: [],
  } as unknown as ReviewRunV2
  const report = makeT08CaseReport({ aggregate, run, audience: 'student', stale: true })
  expect(report.json).not.toContain('新补写的数据')
  expect(report.markdown).not.toContain('新补写的数据')
  expect(t08ReportWorkbookSheets(report).map((sheet) => sheet.name)).not.toContain('事项字段')
  expect(() => makeT08CaseReport({ aggregate, run: { ...run, caseId: 'b' }, audience: 'student', stale: true })).toThrow('不属于当前案卷')
})

test('F16 historical report never mixes later decisions, dispositions or adjudications into an old Run', () => {
  const aggregate = {
    caseV2: { id: 'case-history', title: '后来修改的标题', documents: [], subjects: [
      { id: 'subject-history', title: '后来修改的事项名', fields: { score: { kind: 'number', value: 99 } } },
    ] },
    decisions: [{ id: 'later-decision', basedOnRunId: 'old-run', result: 'pass', reason: '后来才作出的决定',
      at: '2026-10-24T00:00:00.000Z', actor: { actorSource: 'local', role: 'reviewer' }, stageId: 'decided', basedOnRevision: 8 }],
    dispositions: [{ runId: 'old-run', inputHash: 'old-hash', findingKey: 'check-1', disposition: 'waived', reason: '后来才记录的豁免' }],
    adjudications: [{ id: 'later-adjudication', subjectId: 'subject-history', outcome: 'accepted', reason: '后来认定',
      basedOnRunId: 'old-run', inputHash: 'old-hash', at: '2026-10-24T00:00:00.000Z' }],
    supplements: [{ id: 'later-supplement', reason: '后来补件', status: 'open', requiredElements: ['后来新增的字段'] }],
  } as unknown as CaseAggregateV2
  const run = { id: 'old-run', caseId: 'case-history', templateId: 'old-template', templateVersion: 1,
    inputManifest: { hash: 'old-hash', documentVersions: [] }, status: 'completed',
    coverage: { effectiveVerdicts: 0, plannedChecks: 0, pendingChecks: 0 }, checks: [], opinions: [],
  } as unknown as ReviewRunV2
  const report = makeT08CaseReport({ aggregate, run, audience: 'reviewer', stale: true })
  for (const later of ['后来修改的标题', '后来修改的事项名', '后来才作出的决定', '后来才记录的豁免', '后来认定', '后来补件', '后来新增的字段']) {
    expect(report.markdown + report.json).not.toContain(later)
  }
  expect(report.markdown).toContain('不混入这些数据')
  expect(report.json).not.toContain('later-decision')
})

test('T08 unarchived historical Run does not borrow renamed file metadata or re-parsed current source locations', () => {
  const aggregate = {
    caseV2: { id: 'historical-source', subjects: [], documents: [{
      documentId: 'doc-1', versionId: 'version-1', fileName: '后来重命名的秘密.pdf',
      role: 'rule', parseRevision: 2, blocks: [{ blockId: 'new-block', text: '后来重新解析的文字' }],
    }] },
    decisions: [], dispositions: [], supplements: [],
  } as unknown as CaseAggregateV2
  const ref = { caseId: 'historical-source', documentVersionId: 'version-1', parseRevision: 1,
    location: { kind: 'paragraph' as const, index: 0 } }
  const run = {
    id: 'old-source', caseId: 'historical-source', status: 'completed', templateId: 't', templateVersion: 1,
    inputManifest: { hash: 'old-hash', documentVersions: [{ documentId: 'doc-1', versionId: 'version-1', contentHash: 'old-content' }] },
    coverage: { effectiveVerdicts: 1, plannedChecks: 1, pendingChecks: 0 },
    checks: [{ checkId: 'c', ruleId: 'r', reason: '旧检查', status: 'compliant', sourceRefs: [ref] }], opinions: [],
  } as unknown as ReviewRunV2
  const report = makeT08CaseReport({ aggregate, run, audience: 'reviewer', stale: true })
  expect(report.markdown).toContain('历史来源位置未复核')
  expect(report.markdown + report.json).not.toContain('后来重命名的秘密')
  expect(report.markdown + report.json).not.toContain('后来重新解析的文字')
  expect(report.json).toContain('"resolution": "file-only"')
})

test('T08 student decision and supplement projection defaults to private; internal reviewer retains full decision evidence', () => {
  const aggregate = {
    caseV2: { id: 'case-secret-decision', documents: [], subjects: [{ id: 's-1', title: '事项', fields: {} }] },
    decisions: [{
      id: 'decision-secret', basedOnRunId: 'run-secret', result: 'partial-pass',
      reason: '内部评议记录-PRIVATE-KEY', at: '2026-10-24T00:00:00Z',
      stageId: 'internal-review', basedOnRevision: 2, finality: 'final',
      finalScores: [{ subjectId: 's-1', value: 'SECRET-SCORE-180' }],
      actor: { actorId: 'a-1', actorSource: 'local', role: 'reviewer' },
    }],
    dispositions: [], adjudications: [], supplements: [{
      reason: 'PRIVATE-SUPPLEMENT-REASON', status: 'open', requiredElements: ['需补充申请依据'],
    }],
    appeals: [{
      id: 'appeal-secret', againstDecisionId: 'decision-secret', status: 'resolved',
      resolution: 'PRIVATE-APPEAL-RESOLUTION', statement: 'PRIVATE-APPEAL-STATEMENT',
    }],
  } as unknown as CaseAggregateV2
  const run = {
    id: 'run-secret', caseId: 'case-secret-decision', templateId: 'template', templateVersion: 1,
    inputManifest: { hash: 'input-secret', documentVersions: [] }, status: 'completed',
    coverage: { effectiveVerdicts: 0, plannedChecks: 0, pendingChecks: 0 },
    checks: [], opinions: [],
  } as unknown as ReviewRunV2
  const student = makeT08CaseReport({ aggregate, run, audience: 'student', stale: false })
  const studentPayload = student.markdown + student.json + JSON.stringify(t08ReportWorkbookSheets(student))
  for (const secret of ['内部评议记录-PRIVATE-KEY', 'SECRET-SCORE-180', 'PRIVATE-SUPPLEMENT-REASON',
    'PRIVATE-APPEAL-RESOLUTION', 'PRIVATE-APPEAL-STATEMENT', 'internal-review']) {
    expect(studentPayload).not.toContain(secret)
  }
  expect(studentPayload).toContain('partial-pass')
  expect(studentPayload).toContain('需补充申请依据')
  const reviewer = makeT08CaseReport({ aggregate, run, audience: 'reviewer', stale: false })
  expect(reviewer.markdown + reviewer.json).toContain('内部评议记录-PRIVATE-KEY')
  expect(reviewer.json).toContain('SECRET-SCORE-180')
  expect(reviewer.json).toContain('PRIVATE-APPEAL-RESOLUTION')
})
