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

test('T08 报告：未取得同一 T07 冻结快照时明确声明不含评分矩阵（JDG-12）', () => {
  const aggregate = {
    caseV2: { id: 'case-score', documents: [], subjects: [] },
    decisions: [], dispositions: [], supplements: [],
  } as unknown as CaseAggregateV2
  const run = {
    id: 'run-score', caseId: 'case-score', templateId: 'tpl-score', templateVersion: 1,
    inputManifest: { hash: 'hash-score', documentVersions: [] },
    status: 'completed',
    coverage: { effectiveVerdicts: 1, plannedChecks: 1, pendingChecks: 0 },
    checks: [], opinions: [],
  } as unknown as ReviewRunV2
  const withoutSnapshot = makeT08CaseReport({ aggregate, run, audience: 'organizer', stale: false })
  expect(withoutSnapshot.markdown).toContain('未从同一 T07 冻结轮次取得评分快照')
  const frozen = makeT08CaseReport({
    aggregate, run, audience: 'organizer', stale: false,
    ratingSnapshot: {
      status: 'frozen', batchId: 'batch-1', roundId: 'round-2', revision: 7,
      frozenAt: '2026-10-02T00:00:00Z',
      rows: [{ caseId: 'case-score', total: 91.25, rank: 1, selected: true, blockers: [] }],
    },
  })
  expect(frozen.markdown).toContain('批次 batch-1 / 轮次 round-2 / revision 7')
  expect(frozen.markdown).toContain('总分 91.25；名次 1')
  expect(frozen.json).toContain('"roundId": "round-2"')
})

test('T08 报告：恢复代次与恢复前决定被标注为历史，受众未授权如实提示（ASSET-10/RUN-31）', () => {
  const aggregate = {
    caseV2: { id: 'case-restore', documents: [], subjects: [] },
    caseArchive: { previousStage: 'reviewing', archivedAt: '2026-09-01T00:00:00Z', restoredAt: '2026-09-10T00:00:00Z', archivedBy: 'local', reason: '归档' },
    caseArchiveHistory: [],
    decisions: [{ id: 'd-old', result: 'passed', reason: '恢复前决定', at: '2026-09-05T00:00:00Z', basedOnRunId: 'run-restore' }],
    dispositions: [], supplements: [],
  } as unknown as CaseAggregateV2
  const run = {
    id: 'run-restore', caseId: 'case-restore', templateId: 'tpl', templateVersion: 1,
    inputManifest: { hash: 'hash-restore', documentVersions: [] },
    status: 'completed', coverage: { effectiveVerdicts: 1, plannedChecks: 1, pendingChecks: 0 },
    checks: [], opinions: [],
  } as unknown as ReviewRunV2
  const report = makeT08CaseReport({ aggregate, run, audience: 'organizer', stale: false })
  expect(report.archiveCycle?.archiveCycle).toBe(1)
  expect(report.markdown).toContain('最近恢复于 2026-09-10T00:00:00Z')
  expect(report.markdown).toContain('恢复前决定，仅作历史展示')
  expect(report.audienceGranted).toBe(false)
  expect(report.markdown).toContain('未经 Main 授权')
})
