import { describe, expect, test } from 'bun:test'
import type { B29UnmatchedAuthorDraft } from '../../../main/lib/review/review-v3-b3-unmatched-author-bootstrap'
import { assertF06AuthorContract, F06_REQUIRED_CHECKS } from '../../../main/lib/review/review-v3-f06-generic-contract'
import { executableFallbackAuthor, proposedFallbackChecks, proposedFallbackReviewMatter } from './review-v3-fallback-executable-plan'
import { draftT01FromBrief } from './review-v3-t01-brief-authoring'

const hash = 'a'.repeat(64)
const initial = {
  schemaVersion: 'review-b1/1', templateId: 'fallback-f06', templateVersion: 'draft-1',
  name: '实验室临时借用', purpose: '借用实验室',
  fields: [{ key: 'human_scope_confirmed', label: '确认事项', type: 'boolean', required: true, sourceId: 's1' }],
  sources: [{ sourceId: 's1', kind: 'user-declared', documentVersionId: 'temp-v1',
    locator: 'b2-candidate:candidate-1', recordedBy: 'local-reviewer' }],
  targets: [{ targetKey: 'target-primary', objectKey: '实验室临时借用', subjectId: 'student-a',
    scenario: '本机技术初审', fieldValues: { human_scope_confirmed: null } }],
  modules: [], stages: [], outputs: [], status: 'candidate-held',
}
const prepared = {
  schemaVersion: 'review-v3-b29-unmatched-author-draft/1',
  document: initial,
  sourceCandidates: [{ candidateId: 'candidate-1', documentVersionId: 'temp-v1', rawSha256: hash, role: 'application' }],
} as unknown as B29UnmatchedAuthorDraft

describe('F06 公共兜底方案生成', () => {
  test('真实申请事项和已验 SHA 的原件版本进入同一 B1 检查账本', () => {
    const result = executableFallbackAuthor(prepared, [], [{ versionId: 'real-v1', byteHash: hash }], '实验室临时借用')
    expect(result.targets[0]?.objectKey).toBe('实验室临时借用')
    expect(result.sources[0]?.documentVersionId).toBe('real-v1')
    expect(result.modules[0]?.checks.map(item => item.checkKey)).toEqual(F06_REQUIRED_CHECKS.map(item => item.checkKey))
    assertF06AuthorContract(result)
  })

  test('不同事项、重复或已失效原件不能偷换到当前计划', () => {
    expect(() => executableFallbackAuthor(prepared, [], [{ versionId: 'real-v1', byteHash: hash }], '当前申请事项'))
      .toThrow('真实申请事项')
    expect(() => executableFallbackAuthor(prepared, [], [{ versionId: 'real-v1', byteHash: hash }], '其他事项'))
      .toThrow('Main 原件快照不一致')
    expect(() => executableFallbackAuthor(prepared, [], [{ versionId: 'real-v1', byteHash: hash, active: false }], '实验室临时借用'))
      .toThrow('一一对应')
    expect(() => executableFallbackAuthor(prepared, [], [
      { versionId: 'real-v1', byteHash: hash }, { versionId: 'real-v2', byteHash: hash },
    ], '实验室临时借用')).toThrow('一一对应')
  })

  test('未声明额外规则时不凭空编造阈值与必交材料', () => {
    const brief = '申请事项：临时借用某设备\n用途：现场演示'
    const proposal = draftT01FromBrief(brief, 'fallback-test', '2026-10-24T00:00:00Z')
    expect(proposedFallbackReviewMatter(proposal, brief)).toBe('临时借用某设备')
    expect(proposedFallbackChecks(proposal, brief)).toEqual([])
  })
})
