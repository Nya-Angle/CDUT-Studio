import { describe, expect, test } from 'bun:test'
import {
  answerT09Task, importT09Reply, issueT09Task, packT09Asset,
  previewT09Reply, readT09File, writeT09File, type T09Receipt,
  type T09State,
} from './review-v3-t09-offline-codec'

const lock = { templateId: 'lab', templateVersion: 2, policyVersionIds: ['policy-1'] }
const base = {
  caseId: 'case-t09', revision: 3, lock,
  recipient: { role: 'student' as const, actorId: 'student-1', actorSource: 'local' as const },
  publicContext: { title: '公开申请', fields: { purpose: '实验室申请' } },
}
const state = (): T09State => ({
  caseId: 'case-t09', revision: 3, lock,
  supplements: { 'sup-1': 'open' },
  assignments: { 'asg-1': { reviewerId: 'judge-1', rubricVersion: 4, status: 'assigned', recused: false } },
})

describe('T09 independent offline package', () => {
  test('student task → standalone file → attachments → reply → preview → apply; repeat is duplicate', async () => {
    const task = issueT09Task({ ...base, task: { kind: 'student-reply', supplementId: 'sup-1', reason: '补交证明', requiredElements: ['等级证明'] } })
    const separateCopy = readT09File(writeT09File(task))
    if (separateCopy.type !== 'task') throw new Error('expected task')
    const file = packT09Asset({ name: 'proof.txt', mimeType: 'text/plain', bytes: new TextEncoder().encode('real proof bytes') })
    const reply = answerT09Task(separateCopy, { kind: 'student-reply', supplementId: 'sup-1', note: '附等级证明', assets: [file] })
    const returned = readT09File(writeT09File(reply))
    if (returned.type !== 'reply') throw new Error('expected reply')
    expect(previewT09Reply(returned, task, state()).status).toBe('ready')
    const receipts = new Map<string, T09Receipt>()
    let applications = 0
    const lookup = async (actionId: string) => receipts.get(actionId)
    const apply = async () => {
      applications += 1
      const receipt: T09Receipt = { actionId: returned.actionId, hash: returned.hash, caseId: returned.caseId, status: 'accepted', newRevision: 4 }
      receipts.set(receipt.actionId, receipt)
      return receipt
    }
    expect((await importT09Reply(returned, task, state(), lookup, apply)).status).toBe('accepted')
    expect((await importT09Reply(returned, task, { ...state(), revision: 4 }, lookup, apply)).status).toBe('duplicate')
    expect(applications).toBe(1)
  })

  test('judge independent rating enforces locked assignment, finite scores and N/A', () => {
    const task = issueT09Task({
      ...base, recipient: { role: 'judge', actorId: 'judge-1', actorSource: 'local' },
      publicContext: { title: '匿名项目 #1', fields: {} },
      task: { kind: 'judge-rating-reply', assignmentId: 'asg-1', rubricVersion: 4,
        dimensions: [{ id: 'd1', title: '材料完整性', min: 0, max: 5, allowNA: false }, { id: 'd2', title: '相关性', min: 0, max: 5, allowNA: true }] },
    })
    const reply = answerT09Task(task, { kind: 'judge-rating-reply', assignmentId: 'asg-1', rubricVersion: 4,
      scores: [{ dimensionId: 'd1', score: 4, na: false }, { dimensionId: 'd2', score: null, na: true }],
      publicFeedback: '符合要求' })
    expect(previewT09Reply(reply, task, state()).status).toBe('ready')
    expect(previewT09Reply(reply, task, { ...state(), revision: 5 }).status).toBe('conflict')
    expect(previewT09Reply(reply, task, { ...state(), assignments: { 'asg-1': { ...state().assignments['asg-1']!, recused: true } } }).status).toBe('conflict')
    expect(() => answerT09Task(task, { kind: 'judge-rating-reply', assignmentId: 'asg-1', rubricVersion: 4,
      scores: [{ dimensionId: 'd1', score: Number.NaN, na: false }, { dimensionId: 'd2', score: 3, na: false }], publicFeedback: '' })).toThrow()
  })

  test('modified payload or replacement attachment is not silently imported', () => {
    const task = issueT09Task({ ...base, task: { kind: 'student-reply', supplementId: 'sup-1', reason: '补证', requiredElements: [] } })
    const reply = answerT09Task(task, { kind: 'student-reply', supplementId: 'sup-1', note: 'ok', assets: [] })
    const altered = { ...reply, reply: { kind: 'student-reply' as const, supplementId: 'sup-1', note: 'tampered', assets: [] } }
    expect(() => readT09File(JSON.stringify(altered))).toThrow()
    expect(previewT09Reply(altered, task, state()).status).toBe('rejected')
  })
})
