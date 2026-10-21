import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { buildF12SupplementCycle, getF12ReplyDocumentCandidates } from './review-v3-f12-supplement-cycle.ts'

const request = (id, status, elements, extra = {}) => ({
  id, caseId: 'case-f12', originFindingKeys: [], requiredElements: elements, reason: '材料不足',
  responsibleRole: 'student', status, responses: [], createdAt: '2026-10-21T01:00:00Z', ...extra,
})
const aggregate = (requests, stage = 'reviewing') => ({ caseV2: { id: 'case-f12', stage, documents: [] }, supplements: requests })
const document = (id, active = true) => ({ versionId: id, fileName: `${id}.pdf`, active })

describe('F12 合并补件与再审核门控', () => {
  it('同一补正要素合并展示，独立请求和核验进度不丢失', () => {
    const cycle = buildF12SupplementCycle(aggregate([
      request('sup-1', 'satisfied', ['证明原件', '申请书']),
      request('sup-2', 'responded', [' 证明原件 ', '身份证明']),
      request('sup-3', 'insufficient', ['身份证明']),
    ]))
    assert.equal(cycle.checklist.length, 3)
    assert.deepEqual(cycle.checklist.find((item) => item.title === '证明原件'), {
      title: '证明原件', requestIds: ['sup-1', 'sup-2'], unresolvedRequestIds: ['sup-2'],
    })
    assert.equal(cycle.awaitingVerification.length, 1)
    assert.equal(cycle.awaitingReply.length, 1)
    assert.equal(cycle.readyForReview, false)
  })

  it('所有补件核结后才展示再审核指引，回复未核验不得放行', () => {
    assert.equal(buildF12SupplementCycle(aggregate([
      request('sup-1', 'satisfied', ['A']), request('sup-2', 'responded', ['B']),
    ])).readyForReview, false)
    assert.equal(buildF12SupplementCycle(aggregate([
      request('sup-1', 'satisfied', ['A']), request('sup-2', 'cancelled', ['B']),
    ])).readyForReview, true)
    assert.equal(buildF12SupplementCycle(aggregate([request('sup-1', 'cancelled', ['A'])])).readyForReview, false)
    const blocked = buildF12SupplementCycle(aggregate([request('sup-1', 'satisfied', ['A'])], 'awaiting-supplement'))
    assert.equal(blocked.readyForReview, false)
    assert.equal(blocked.stageStillAwaitingSupplement, true)
  })

  it('有请求时材料快照只展示登记后新增的有效版本', () => {
    const candidates = getF12ReplyDocumentCandidates(
      request('sup-1', 'open', ['A'], { documentVersionIdsAtRequest: ['old'] }),
      [document('old'), document('new'), document('inactive', false)],
    )
    assert.equal(candidates.verifiedAsAddedAfterRequest, true)
    assert.deepEqual(candidates.documents.map((item) => item.versionId), ['new'])
  })

  it('历史请求无基线时明确来源不确定，不能谎称当前材料属于新补交', () => {
    const candidates = getF12ReplyDocumentCandidates(request('legacy', 'open', ['A']), [document('old')])
    assert.equal(candidates.verifiedAsAddedAfterRequest, false)
    assert.deepEqual(candidates.documents.map((item) => item.versionId), ['old'])
  })
})
