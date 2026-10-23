/**
 * M2 事实/证据绑定单测（对应 K01/A04 绑定面：一证多事、多证一事、替代链、去重）
 */
import { describe, expect, test } from 'bun:test'
import type { SourceRef } from '@profer/shared'
import {
  buildEvidenceLinks,
  latestObservations,
  observationDiffers,
  recordObservation,
  subjectEvidenceCoverage,
  transitionEvidenceLink,
} from './evidence-service'

const ref: SourceRef = { caseId: 'c1', documentVersionId: 'doc-cert-1-v1', parseRevision: 1, location: { kind: 'file' } }
const num = (value: number) => ({ kind: 'number' as const, value })
const text = (value: string) => ({ kind: 'text' as const, value })

describe('recordObservation（替代链，A05）', () => {
  test('Given 人工确认值后 AI 重提取不同值 When 记录 Then 链保留且新旧可回溯', () => {
    let observations = recordObservation([], { subjectId: 's1', fieldKey: 'level', value: text('二等奖'), sourceRefs: [ref], extractedBy: 'ai', confirmed: true, now: '2026-01-01T00:00:00Z' })
    observations = recordObservation(observations, { subjectId: 's1', fieldKey: 'level', value: text('一等奖'), sourceRefs: [ref], extractedBy: 'ai', now: '2026-01-02T00:00:00Z' })
    const latest = latestObservations(observations).get('s1::level')!
    expect(latest.value).toEqual(text('一等奖'))
    expect(latest.supersedesObservationId).toBe(observations[0]!.id)
    // 历史仍在（原值可回溯）
    expect(observations).toHaveLength(2)
  })

  test('Given 值相同 When 检测差异 Then 不算差异（避免假变更）', () => {
    const observations = recordObservation([], { subjectId: 's1', fieldKey: 'score', value: num(6), sourceRefs: [ref], extractedBy: 'ai', now: '2026-01-01T00:00:00Z' })
    expect(observationDiffers({ fieldKey: 'score', value: num(6) }, latestObservations(observations).get('s1::score'))).toBeFalse()
    expect(observationDiffers({ fieldKey: 'score', value: num(3) }, latestObservations(observations).get('s1::score'))).toBeTrue()
  })
})

describe('buildEvidenceLinks（多对多，A04）', () => {
  test('Given 一份合影证明 When 绑定两个学生 Then 产生两条 candidate（一证多事）', () => {
    const links = buildEvidenceLinks([], { documentVersionId: 'doc-photo-v1', subjectIds: ['s1', 's2'], supportsFact: '参与 E1 活动', linkedBy: 'ai', now: '2026-01-01T00:00:00Z' })
    expect(links).toHaveLength(2)
    expect(links.every((link) => link.status === 'candidate')).toBeTrue()
    expect(links[0]!.reuseScope).toBeUndefined()
  })

  test('Given 多证一事 When 绑定 Then 同主体两条链接并存（多证一事）', () => {
    let links = buildEvidenceLinks([], { documentVersionId: 'doc-cert-v1', subjectIds: ['s1'], supportsFact: '省赛二等奖', linkedBy: 'ai', now: '2026-01-01T00:00:00Z' })
    links = buildEvidenceLinks(links, { documentVersionId: 'doc-notice-v1', subjectIds: ['s1'], supportsFact: '公示名单含该生', linkedBy: 'ai', now: '2026-01-02T00:00:00Z' })
    const coverage = subjectEvidenceCoverage(links, 's1')
    expect(coverage.candidate).toHaveLength(2)
  })

  test('Given 重复绑定（同 doc+subject+fact）When 再绑 Then 去重不重复计', () => {
    const links = buildEvidenceLinks([], { documentVersionId: 'doc-cert-v1', subjectIds: ['s1'], supportsFact: '省赛二等奖', linkedBy: 'ai', now: '2026-01-01T00:00:00Z' })
    const again = buildEvidenceLinks(links, { documentVersionId: 'doc-cert-v1', subjectIds: ['s1'], supportsFact: '省赛二等奖', linkedBy: 'ai', now: '2026-01-02T00:00:00Z' })
    expect(again).toHaveLength(1)
  })

  test('Given 单次命令重复主体 When 批量绑定 Then 只建立一个主体事实关系', () => {
    const links = buildEvidenceLinks([], {
      documentVersionId: 'doc-photo-v1', subjectIds: ['s1', 's1', 's2', 's2'],
      supportsFact: '  参与活动  ', linkedBy: 'user',
    })
    expect(links).toHaveLength(2)
    expect(links.map(link => link.subjectId)).toEqual(['s1', 's2'])
    expect(links.every(link => link.supportsFact === '参与活动')).toBeTrue()
    expect(buildEvidenceLinks(links, {
      documentVersionId: 'doc-photo-v1', subjectIds: ['s1', 's2'],
      supportsFact: '参与活动', linkedBy: 'ai',
    })).toHaveLength(2)
  })

  test('Given candidate 被拒绝 When 重复绑定同事实 Then 不复活（rejected 保留）', () => {
    let links = buildEvidenceLinks([], { documentVersionId: 'doc-x-v1', subjectIds: ['s1'], supportsFact: '事实A', linkedBy: 'ai', now: '2026-01-01T00:00:00Z' })
    links = transitionEvidenceLink(links, links[0]!.id, 'rejected')
    const again = buildEvidenceLinks(links, { documentVersionId: 'doc-x-v1', subjectIds: ['s1'], supportsFact: '事实A', linkedBy: 'ai', now: '2026-01-02T00:00:00Z' })
    expect(again).toHaveLength(1)
    expect(again[0]!.status).toBe('rejected')
  })

  test('Given 人工绑定 When 创建 Then 直接 confirmed', () => {
    const links = buildEvidenceLinks([], { documentVersionId: 'doc-cert-v1', subjectIds: ['s1'], supportsFact: '确认支持', linkedBy: 'user', now: '2026-01-01T00:00:00Z' })
    expect(links[0]!.status).toBe('confirmed')
    expect(subjectEvidenceCoverage(links, 's1').confirmed).toHaveLength(1)
  })

  test('Given 确认迁移 When transition Then 状态正确翻转', () => {
    let links = buildEvidenceLinks([], { documentVersionId: 'doc-cert-v1', subjectIds: ['s1'], supportsFact: '事实', linkedBy: 'ai', now: '2026-01-01T00:00:00Z' })
    links = transitionEvidenceLink(links, links[0]!.id, 'confirmed')
    expect(subjectEvidenceCoverage(links, 's1').confirmed).toHaveLength(1)
  })
})
