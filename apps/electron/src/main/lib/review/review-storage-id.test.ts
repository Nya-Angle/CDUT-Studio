import { afterAll, describe, expect, test } from 'bun:test'
import { existsSync, rmSync } from 'node:fs'
import { dirname, join } from 'node:path'
import type { ReviewCaseV2, ReviewRunV2 } from '@profer/shared'
import { assertSafeReviewStorageId } from './review-storage-id'
import { createAggregate, readAggregate, submitCommand, writeAggregate, listAggregatesV2 } from './case-store-v2'
import { saveRunV2, getRunV2, listRunsV2, saveArtifact, readArtifact, markStaleRunsInterrupted } from './run-store-v2'
import { createBatchV2, readBatchStateV2 } from './batch-store'
import { createCaseFromTemplate } from './application-service'

const root = join(import.meta.dir, '../../../../../../work/tmp', `review-v2-id-poc-${Date.now()}`, 'configuration')
process.env.PROFER_CONFIG_DIR = root
afterAll(() => rmSync(dirname(root), { recursive: true, force: true }))

const actor = { actorSource: 'local' as const, actorId: 'qa-reviewer', role: 'reviewer' as const }
const validCase: ReviewCaseV2 = {
  id: 'safe-case-1', templateId: 'qa-template', templateVersion: 1, title: '安全路径回归',
  objectType: 'person', caseFields: {}, subjects: [], documents: [],
  stage: 'draft', revision: 0, createdAt: '2026-10-11T00:00:00Z', updatedAt: '2026-10-11T00:00:00Z',
}
const validRun: ReviewRunV2 = {
  id: 'safe-run-1', caseId: 'safe-case-1', templateId: 'qa-template', templateVersion: 1,
  inputManifest: { hash: 'test-input', templateVersion: 1, policyVersions: [], documentVersions: [],
    observationIds: [], evidenceLinkIds: [] },
  status: 'completed', startedAt: '2026-10-11T00:00:00Z', completedAt: '2026-10-11T00:00:01Z',
  checkpoints: [], checks: [], opinions: [], coverage: {
    documents: [], plannedChecks: 0, completedChecks: 0, effectiveVerdicts: 0, pendingChecks: 0,
  }, diagnostics: [],
}
const badIds = ['../../escaped', '../outside', '/tmp/traversal', 'a/b', 'a\\b',
  '.', '..', 'bad..id', '%2e%2e', '', ' leading', 'x'.repeat(129)]

describe('V2 存储路径安全：第三轮 QA 阻断修复', () => {
  test('所有路径 ID 统一拒绝相对路径、分隔符、空值、编码符和超长值', () => {
    for (const bad of badIds) {
      for (const kind of ['caseId', 'runId', 'nodeId'] as const) {
        expect(() => assertSafeReviewStorageId(bad, kind)).toThrow(`非法 ${kind}`)
      }
    }
    for (const ok of ['case-1', 'run_2', 'node.auto-check']) {
      expect(() => assertSafeReviewStorageId(ok)).not.toThrow()
    }
  })

  test('CREATE_CASE_V2 的服务层即使使用发布模板也在访问模板和文件前拒绝非法 caseId', async () => {
    for (const id of badIds) {
      await expect(createCaseFromTemplate('qa-template', 1, { title: 'test', fieldValues: {}, subjects: [] },
        actor, id)).rejects.toThrow('非法 caseId')
    }
    expect(existsSync(join(dirname(root), 'escaped'))).toBeFalse()
    expect(existsSync(join(root, 'review-cases'))).toBeFalse()
  })

  test('案卷聚合读取、写入与命令事务在目录生成前校验 ID 和内容一致性', async () => {
    for (const id of badIds) {
      expect(() => readAggregate(id)).toThrow('非法 caseId')
      expect(() => writeAggregate({ caseV2: { ...validCase, id }, observations: [], evidenceLinks: [],
        dispositions: [], tasks: [], decisions: [], supplements: [], appeals: [], receiptLog: [] })).toThrow('非法 caseId')
      await expect(createAggregate(id, { ...validCase, id })).rejects.toThrow('非法 caseId')
      await expect(submitCommand(id, { requestId: 'test', actor, expectedRevision: 0, type: 'Test', payload: {} },
        () => ({ summary: '', mutate: () => {} }))).rejects.toThrow('非法 caseId')
    }
    await expect(createAggregate('safe-case-1', { ...validCase, id: 'safe-case-other' })).rejects.toThrow('不一致')
    expect(existsSync(join(dirname(root), 'escaped'))).toBeFalse()
    expect(existsSync(join(root, 'review-cases'))).toBeFalse()
    expect(listAggregatesV2()).toEqual([])
  })

  test('运行记录与节点产物的所有 ID 在读写路径调用前验证，无幽灵目录', () => {
    for (const id of badIds) {
      expect(() => getRunV2(id, 'safe-run-1')).toThrow('非法 caseId')
      expect(() => getRunV2('safe-case-1', id)).toThrow('非法 runId')
      expect(() => saveRunV2({ ...validRun, caseId: id })).toThrow('非法 caseId')
      expect(() => saveRunV2({ ...validRun, id })).toThrow('非法 runId')
      expect(() => listRunsV2(id)).toThrow('非法 caseId')
      expect(() => saveArtifact(id, 'safe-run-1', 'node-1', {})).toThrow('非法 caseId')
      expect(() => saveArtifact('safe-case-1', id, 'node-1', {})).toThrow('非法 runId')
      expect(() => saveArtifact('safe-case-1', 'safe-run-1', id, {})).toThrow('非法 nodeId')
      expect(() => readArtifact(id, 'safe-run-1', 'node-1')).toThrow('非法 caseId')
      expect(() => readArtifact('safe-case-1', id, 'node-1')).toThrow('非法 runId')
      expect(() => readArtifact('safe-case-1', 'safe-run-1', id)).toThrow('非法 nodeId')
      expect(() => markStaleRunsInterrupted(id)).toThrow('非法 caseId')
    }
    expect(getRunV2('safe-case-1', 'safe-run-1')).toBeUndefined()
    expect(listRunsV2('safe-case-1')).toEqual([])
    expect(readArtifact('safe-case-1', 'safe-run-1', 'node-1')).toBeUndefined()
    expect(existsSync(join(root, 'review-cases'))).toBeFalse()
    expect(existsSync(join(dirname(root), 'escaped'))).toBeFalse()
  })

  test('Pi 材料目录与报告导出也不能绕过 V2 caseId 路径校验', async () => {
    const { assertPiReviewDirectory } = await import('./pi-case-review-service')
    const { exportCaseReport } = await import('./report-export-v2-service')
    for (const id of badIds) {
      expect(() => assertPiReviewDirectory('/tmp', id)).toThrow('非法 caseId')
      expect(() => exportCaseReport(id)).toThrow('非法 caseId')
    }
    expect(existsSync(join(dirname(root), 'escaped'))).toBeFalse()
  })

  test('批次创建逐项核验成员 caseIds，拒绝落盘且不允许未授权重试', () => {
    for (const id of badIds) {
      expect(() => createBatchV2({ id: 'safe-batch', name: '安全批次',
        templateId: 'qa-template', templateVersion: 1, caseIds: ['safe-case-1', id],
        policyVersionLock: [], createdAt: '2026-10-11T00:00:00Z' })).toThrow('非法 caseId')
      expect(readBatchStateV2('safe-batch')).toBeUndefined()
    }
    expect(existsSync(join(root, 'review-batches', 'safe-batch'))).toBeFalse()
  })

  test('合法 ID 可正常完成 V2 聚合、运行记录与产物存取', async () => {
    await createAggregate(validCase.id, validCase)
    expect(readAggregate(validCase.id)?.caseV2.id).toBe(validCase.id)
    saveRunV2(validRun)
    expect(getRunV2(validCase.id, validRun.id)?.id).toBe(validRun.id)
    expect(listRunsV2(validCase.id)).toHaveLength(1)
    saveArtifact(validCase.id, validRun.id, 'node-auto-check-extract', { source: 'test' })
    expect(readArtifact<{ source: string }>(validCase.id, validRun.id, 'node-auto-check-extract')).toEqual({ source: 'test' })
  })
})
