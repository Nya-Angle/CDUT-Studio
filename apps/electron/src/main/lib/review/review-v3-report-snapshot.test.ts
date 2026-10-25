import { describe, expect, test } from 'bun:test'
import type { BusinessDecision, CaseAggregateV2, ReviewRunV2, SubjectAdjudication } from '@profer/shared'
import {
  isDecisionPreRestore,
  reportSnapshotDigest,
  resolveReportAdjudications,
  resolveReportAudience,
  resolveReportCaseCycle,
  resolveReportRun,
} from './review-v3-report-snapshot'

function run(id: string, startedAt: string): ReviewRunV2 {
  return { id, caseId: 'case-1', startedAt, inputManifest: { hash: 'hash-' + id } } as unknown as ReviewRunV2
}
function decision(id: string, at: string, basedOnRunId: string): BusinessDecision {
  return { id, at, basedOnRunId, result: 'passed', reason: 'r' } as unknown as BusinessDecision
}
function adjudication(id: string, subjectId: string, runId: string, supersedes?: string): SubjectAdjudication {
  return {
    id, subjectId, outcome: 'accepted', reason: 'r', basedOnRunId: runId, inputHash: 'hash-' + runId,
    at: '2026-10-01T00:00:00Z', ...(supersedes ? { supersedesAdjudicationId: supersedes } : {}),
  } as unknown as SubjectAdjudication
}

describe('报告 Run 选择（RUN-02）', () => {
  test('有最终决定时只取决定绑定的 Run，不取最新 Run', () => {
    const runs = [run('run-old', '2026-10-01T00:00:00Z'), run('run-new', '2026-10-02T00:00:00Z')]
    const selection = resolveReportRun({ runs, decisions: [decision('d1', '2026-10-01T01:00:00Z', 'run-old')] })
    expect(selection.run?.id).toBe('run-old')
    expect(selection.basis).toBe('decision')
    expect(selection.historical).toBe(false)
  })

  test('显式选择历史 Run 时标记为历史/旁证', () => {
    const runs = [run('run-old', '2026-10-01T00:00:00Z'), run('run-new', '2026-10-02T00:00:00Z')]
    const selection = resolveReportRun({
      runs, decisions: [decision('d1', '2026-10-02T01:00:00Z', 'run-new')], requestedRunId: 'run-old',
    })
    expect(selection.run?.id).toBe('run-old')
    expect(selection.historical).toBe(true)
    expect(selection.basis).toBe('explicit')
  })

  test('决定引用的 Run 已不可用时报错，不静默换用其他 Run', () => {
    const runs = [run('run-other', '2026-10-01T00:00:00Z')]
    const selection = resolveReportRun({ runs, decisions: [decision('d1', '2026-10-02T01:00:00Z', 'run-gone')] })
    expect(selection.run).toBeNull()
    expect(selection.reason).toContain('run-gone')
  })

  test('无决定时按时间+id 确定性取最新，与数组顺序无关', () => {
    const a = run('run-a', '2026-10-01T00:00:00Z')
    const b = run('run-b', '2026-10-01T00:00:00Z')
    const first = resolveReportRun({ runs: [a, b], decisions: [] })
    const second = resolveReportRun({ runs: [b, a], decisions: [] })
    expect(first.run?.id).toBe('run-b')
    expect(second.run?.id).toBe(first.run?.id)
    expect(first.basis).toBe('latest')
  })
})

describe('裁定 supersedes 按 Run 过滤（RUN-21）', () => {
  test('后续 Run 的新裁定不会删除历史 Run 报告里的旧裁定', () => {
    const adjudications = [
      adjudication('adj-run1', 'subject-1', 'run-1'),
      adjudication('adj-run2', 'subject-1', 'run-2', 'adj-run1'),
    ]
    const history = resolveReportAdjudications({ adjudications, runId: 'run-1', inputHash: 'hash-run-1' })
    expect(history.current.map((record) => record.id)).toEqual(['adj-run1'])
    expect(history.excludedOtherRun).toBe(1)

    const current = resolveReportAdjudications({ adjudications, runId: 'run-2', inputHash: 'hash-run-2' })
    expect(current.current.map((record) => record.id)).toEqual(['adj-run2'])
    // 跨 Run 的 supersedes 不计入本 Run 的替代数：旧 Run 记录只是不参与，不是被本 Run 删除。
    expect(current.supersededInRun).toBe(0)
    expect(current.excludedOtherRun).toBe(1)
  })

  test('同一 Run 内 supersedes 仍然生效', () => {
    const adjudications = [
      adjudication('adj-old', 'subject-1', 'run-1'),
      adjudication('adj-new', 'subject-1', 'run-1', 'adj-old'),
    ]
    const selection = resolveReportAdjudications({ adjudications, runId: 'run-1', inputHash: 'hash-run-1' })
    expect(selection.current.map((record) => record.id)).toEqual(['adj-new'])
    expect(selection.supersededInRun).toBe(1)
  })

  test('输入哈希不一致的裁定不纳入该 Run 报告', () => {
    const adjudications = [adjudication('adj-stale', 'subject-1', 'run-1')]
    const selection = resolveReportAdjudications({ adjudications, runId: 'run-1', inputHash: 'hash-changed' })
    expect(selection.current).toHaveLength(0)
  })
})

describe('报告受众授权（RUN-31 / UI-15）', () => {
  test('无可信 actor 时内部受众降级为学生版', () => {
    const grant = resolveReportAudience({ requested: 'organizer' })
    expect(grant.audience).toBe('student')
    expect(grant.granted).toBe(false)
    expect(grant.reason).toContain('降级')
  })

  test('Agent 与模拟操作者不能取得内部受众', () => {
    expect(resolveReportAudience({ requested: 'reviewer', actor: { actorSource: 'agent', actorId: 'a1' } }).audience).toBe('student')
    expect(resolveReportAudience({ requested: 'reviewer', actor: { actorSource: 'mock', actorId: 'm1' } }).audience).toBe('student')
  })

  test('审核人不能取得组织者视图，组织者可取得', () => {
    const reviewerAsOrganizer = resolveReportAudience({ requested: 'organizer', actor: { actorSource: 'local', role: 'reviewer' } })
    expect(reviewerAsOrganizer.audience).toBe('student')
    expect(reviewerAsOrganizer.granted).toBe(false)
    const organizer = resolveReportAudience({ requested: 'organizer', actor: { actorSource: 'local', role: 'organizer' } })
    expect(organizer.audience).toBe('organizer')
    expect(organizer.granted).toBe(true)
  })
})

describe('归档恢复代次（ASSET-10）与快照指纹', () => {
  test('恢复过的归档计入代次，并识别恢复前的决定', () => {
    const aggregate = {
      caseV2: { stage: 'draft' },
      caseArchive: { previousStage: 'reviewing', archivedAt: '2026-09-01T00:00:00Z', restoredAt: '2026-09-10T00:00:00Z', archivedBy: 'local', reason: 'r' },
      caseArchiveHistory: [{ previousStage: 'reviewing', archivedAt: '2026-08-01T00:00:00Z', archivedBy: 'local', reason: 'r' }],
    } as unknown as CaseAggregateV2
    const cycle = resolveReportCaseCycle(aggregate)
    expect(cycle.archiveCycle).toBe(2)
    expect(cycle.restoredAt).toBe('2026-09-10T00:00:00Z')
    expect(isDecisionPreRestore({ at: '2026-09-05T00:00:00Z' }, cycle)).toBe(true)
    expect(isDecisionPreRestore({ at: '2026-09-11T00:00:00Z' }, cycle)).toBe(false)
  })

  test('快照指纹绑定案卷/运行/受众/内容，任一变化即不同', () => {
    const base = { caseId: 'c', runId: 'r', audience: 'student' as const, json: '{}' }
    expect(reportSnapshotDigest(base)).toBe(reportSnapshotDigest({ ...base }))
    expect(reportSnapshotDigest(base)).not.toBe(reportSnapshotDigest({ ...base, audience: 'organizer' }))
    expect(reportSnapshotDigest(base)).not.toBe(reportSnapshotDigest({ ...base, json: '{"a":1}' }))
  })
})
