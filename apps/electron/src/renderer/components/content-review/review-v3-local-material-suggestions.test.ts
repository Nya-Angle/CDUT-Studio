import { describe, expect, test } from 'bun:test'
import type { DocumentVersion, MaterialSlotSpec } from '@profer/shared'
import { classificationSnapshotKey, suggestLocalMaterialClassification } from './review-v3-local-material-suggestions'

const slot = (id: string, name: string, maxCount = 5): MaterialSlotSpec => ({
  id, name, purpose: '', acceptedKinds: ['pdf'], acceptedRoles: ['evidence'],
  minCount: 0, maxCount, requiredElements: [], allowReuseAcrossSubjects: false,
})
const doc = (versionId: string, fileName: string): DocumentVersion => ({
  documentId: versionId, versionId, contentHash: 'hash-' + versionId,
  role: 'attachment', fileName, mimeType: 'application/pdf', sizeBytes: 10,
  assetPath: versionId, parseRevision: 1, parseStatus: 'parsed', blocks: [], usage: 'unread',
})

describe('F04 模板驱动本机预分拣', () => {
  test('单份材料按匹配模板槽位建议，但不修改原对象', () => {
    const original = doc('v1', '成绩单.pdf')
    const proposals = suggestLocalMaterialClassification([original], [slot('grades', '成绩单')])
    expect(proposals).toMatchObject([{ documentVersionId: 'v1', role: 'evidence', materialSlotId: 'grades' }])
    expect(original.role).toBe('attachment')
    expect(original.materialSlotId).toBeUndefined()
  })

  test('两份材料各自建议槽位，五份材料超额/无对应槽位时不冒进', () => {
    const slots = [slot('grades', '成绩单', 1), slot('application', '申请书', 1)]
    slots[1]!.acceptedRoles = ['application']
    const two = suggestLocalMaterialClassification([doc('1', '成绩单.pdf'), doc('2', '申请书.pdf')], slots)
    expect(two.map((item) => item.materialSlotId)).toEqual(['grades', 'application'])
    const five = suggestLocalMaterialClassification([
      doc('1', '成绩单.pdf'), doc('2', '申请书.pdf'), doc('3', '成绩单副本.pdf'),
      doc('4', '不明文件.pdf'), doc('5', '成绩单.png'),
    ], slots)
    expect(five.filter((item) => item.materialSlotId === 'grades')).toHaveLength(1)
    expect(five.find((item) => item.documentVersionId === '4')?.materialSlotId).toBeUndefined()
    expect(five.find((item) => item.documentVersionId === '5')?.materialSlotId).toBeUndefined()
  })

  test('歧义名称不强配，模板槽位版本/分类变化使旧建议快照失效', () => {
    expect(suggestLocalMaterialClassification([doc('v1', '成绩单.pdf')], [
      slot('a', '成绩单'), slot('b', '成绩单'),
    ])[0]?.materialSlotId).toBeUndefined()
    const aggregate = (revision: number, templateVersion: number, role: DocumentVersion['role']) => ({
      caseV2: { id: 'case-A', revision, templateId: 'T01', templateVersion,
        documents: [{ versionId: 'v1', active: true, role }] },
    })
    const key = classificationSnapshotKey(aggregate(1, 1, 'attachment'))
    expect(key).not.toBe(classificationSnapshotKey(aggregate(2, 1, 'attachment')))
    expect(key).not.toBe(classificationSnapshotKey(aggregate(1, 2, 'attachment')))
    expect(key).not.toBe(classificationSnapshotKey(aggregate(1, 1, 'evidence')))
  })

  test('尊重已经绑定的人工槽位及 maxCount，不以文件名覆盖确认结果', () => {
    const manual = { ...doc('manual', '自定义文件.pdf'), role: 'evidence' as const, materialSlotId: 'grades' }
    const proposals = suggestLocalMaterialClassification([
      manual, doc('fresh', '成绩单.pdf'),
    ], [slot('grades', '成绩单', 1)])
    expect(proposals[0]).toMatchObject({ documentVersionId: 'manual', materialSlotId: 'grades' })
    expect(proposals[1]?.materialSlotId).toBeUndefined()
  })
})
