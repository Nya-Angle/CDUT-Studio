import { describe, expect, test } from 'bun:test'
import type { CaseAggregateV2, DocumentVersion, EvidenceLink, SourceRef } from '@profer/shared'
import {
  describeF06Location, f06LinkValidity, previewF06Assignment, projectF06Evidence,
} from './review-v3-f06-evidence'

const document = (id: string, contentHash = id, active = true, parseRevision = 1): DocumentVersion => ({
  documentId: id, versionId: id, contentHash, role: 'evidence', fileName: `${id}.png`,
  mimeType: 'image/png', sizeBytes: 50, assetPath: id, parseRevision,
  parseStatus: 'parsed', blocks: [], usage: 'registered', active,
})
const source = (versionId: string, parseRevision = 1): SourceRef => ({
  caseId: 'case-f06', documentVersionId: versionId, parseRevision,
  location: { kind: 'file' },
})
const link = (id: string, docId: string, subjectId: string, fact: string,
  status: EvidenceLink['status'] = 'candidate', blockRef?: SourceRef): EvidenceLink => ({
  id, documentVersionId: docId, subjectId, supportsFact: fact, status,
  linkedBy: status === 'candidate' ? 'ai' : 'user', ...(blockRef ? { blockRef } : {}),
})
function fixture(): CaseAggregateV2 {
  return {
    caseV2: {
      id: 'case-f06',
      subjects: [
        { id: 'student-101', title: '张同学' },
        { id: 'student-102', title: '张同学' },
        { id: 'student-103', title: '李同学' },
      ],
      documents: [
        ...Array.from({ length: 12 }, (_, i) => document(`photo-${i + 1}`)),
        document('notice', 'byte-shared'),
        document('notice-copy', 'byte-shared'),
        document('old-scan', 'old', false, 2),
      ],
    },
    evidenceLinks: [
      link('candidate-a', 'photo-1', 'student-101', '参加活动'),
      link('candidate-b', 'photo-1', 'student-102', '参加活动'),
      link('notice-one', 'notice', 'student-101', '获奖等级', 'confirmed'),
      link('photo-two', 'photo-2', 'student-101', '获奖等级', 'confirmed'),
      link('old-evidence', 'old-scan', 'student-101', '奖状', 'confirmed', source('old-scan', 1)),
    ],
  } as unknown as CaseAggregateV2
}

describe('F06 证明归属与多对多读模型', () => {
  test('12 张图一张不漏；未绑定文件继续显示，而非假称均已检查', () => {
    const groups = projectF06Evidence(fixture())
    expect(groups).toHaveLength(15)
    expect(groups.filter(group => group.document.fileName.startsWith('photo-'))).toHaveLength(12)
    expect(groups.find(group => group.document.versionId === 'photo-12')?.unassigned).toBe(true)
  })

  test('同名两个学生的共享合影只保留独立候选；一证多项、多证一事并存', () => {
    const groups = projectF06Evidence(fixture())
    const photo = groups.find(group => group.document.versionId === 'photo-1')!
    expect(photo.links.map(item => item.link.subjectId)).toEqual(['student-101', 'student-102'])
    expect(photo.currentConfirmedCount).toBe(0)
    expect(photo.ambiguousSubjectIds).toEqual(['student-101', 'student-102'])
    expect(groups.filter(group => group.links.some(item =>
      item.link.subjectId === 'student-101' && item.link.supportsFact === '获奖等级'))).toHaveLength(2)
  })

  test('来源当前性按原件版本和 parseRevision 检查，退役和过期关联不算已确认覆盖', () => {
    const aggregate = fixture()
    expect(f06LinkValidity(aggregate, aggregate.evidenceLinks.find(item => item.id === 'old-evidence')!)).toBe('retired')
    const stale = link('wrong-parse', 'photo-3', 'student-101', '活动时间', 'confirmed', source('photo-3', 4))
    expect(f06LinkValidity(aggregate, stale)).toBe('stale-source')
    expect(f06LinkValidity(aggregate, link('missing', 'not-exists', 'student-101', 'x'))).toBe('missing-document')
    expect(projectF06Evidence(aggregate).find(group => group.document.versionId === 'old-scan')?.currentConfirmedCount).toBe(0)
  })

  test('同内容版本给出提醒而不折叠记录、删除关联或推断重复计分', () => {
    const aggregate = fixture()
    const groups = projectF06Evidence(aggregate)
    expect(groups.find(group => group.document.versionId === 'notice')?.sameContentVersionIds).toEqual(['notice-copy'])
    expect(groups.find(group => group.document.versionId === 'notice-copy')?.sameContentVersionIds).toEqual(['notice'])
    expect(aggregate.evidenceLinks.find(item => item.id === 'notice-one')?.status).toBe('confirmed')
  })

  test('真实来源才会生成建议；跨案、旧解析版本和已拒绝候选不复活', () => {
    const aggregate = fixture()
    aggregate.evidenceLinks.push(link('rejected', 'photo-4', 'student-101', 'score', 'rejected'))
    const candidates = [
      { subjectId: 'student-103', fieldKey: 'score', sourceRefs: [source('photo-4')] },
      { subjectId: 'student-101', fieldKey: 'score', sourceRefs: [source('photo-4')] },
      { subjectId: 'student-102', fieldKey: 'date', sourceRefs: [source('photo-4', 77)] },
      { subjectId: 'student-102', fieldKey: 'date', sourceRefs: [{ ...source('photo-4'), caseId: 'another-case' }] },
    ]
    const photo = projectF06Evidence(aggregate, candidates).find(group => group.document.versionId === 'photo-4')!
    expect(photo.suggestions.map(item => item.subjectId)).toEqual(['student-103'])
    expect(photo.suggestions[0]!.sourceRef).toEqual(source('photo-4'))
    const preview = previewF06Assignment(aggregate, {
      documentVersionId: 'photo-4', subjectIds: ['student-101', 'student-103', 'student-103'], supportsFact: 'score',
    })
    expect(preview.errors).toContain('已有人工拒绝的同一绑定；须先单独复核旧记录，不可静默复活')
    expect(preview.subjectIdsToCreate).toEqual(['student-103'])
  })

  test('手动绑定同批多主体去重，旧版和陌生主体阻止写入', () => {
    const aggregate = fixture()
    const preview = previewF06Assignment(aggregate, {
      documentVersionId: 'photo-1', subjectIds: ['student-101', 'student-102', 'student-103', 'student-103'],
      supportsFact: '  参加活动  ',
    })
    expect(preview.errors).toEqual([])
    expect(preview.existing).toHaveLength(2)
    expect(preview.subjectIdsToCreate).toEqual(['student-103'])
    const invalid = previewF06Assignment(aggregate, {
      documentVersionId: 'old-scan', subjectIds: ['not-known'], supportsFact: 'score',
    })
    expect(invalid.errors).toContain('旧原件已退役，不能新增当前绑定')
    expect(invalid.errors).toContain('目标主体已变化，请重新选择')
    expect(describeF06Location(source('photo-3'))).toBe('仅文件级定位')
  })
})
