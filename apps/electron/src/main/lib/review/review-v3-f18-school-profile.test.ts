import { describe, expect, test } from 'bun:test'
import { LocalPackageAdapter, MockSchoolAdapter, type SchoolPort } from './external-ports'
import { mapExternalCase, mapExternalStatus, negotiateSchoolPort, type IntegrationProfile } from './review-v3-f18-school-profile'

const profile: IntegrationProfile = {
  id: 'example-school-profile', workflowOwner: 'school',
  fieldMapping: { score: 'ext_grade', name: 'student_name' },
  statusMapping: { pending: 'WAIT', completed: 'DONE' },
}

describe('F18 SchoolPort 协商及映射', () => {
  test('Mock 只能模拟建议回执，离线包仍须等待独立回执', () => {
    const mock = negotiateSchoolPort(new MockSchoolAdapter(), profile)
    expect(mock.mode).toBe('proposal-awaiting-receipt')
    expect(mock.canClaimSchoolIdentity).toBe(false)
    expect(mock.canVerify).toBe(true)

    const local = negotiateSchoolPort(new LocalPackageAdapter(() => 0), profile)
    expect(local.mode).toBe('offline-handoff')
    expect(local.canClaimSchoolIdentity).toBe(false)
  })

  test('学校拥有业务阶段但无可信身份/写入能力时禁止自动审批', () => {
    const school: SchoolPort = { kind: 'school', push: async () => { throw new Error('不能调用未授权写入') } }
    const plan = negotiateSchoolPort(school, profile)
    expect(plan.mode).toBe('unavailable')
    expect(plan.canFetchCase).toBe(false)
  })

  test('缺失成绩保留未知，外部不认识的状态不会自动映射成完成', () => {
    const result = mapExternalCase({ caseId: 'c1', externalId: 'e9', revision: 12,
      source: 'mock', fields: { student_name: '学生甲', another_field: 8 } }, profile, ['name', 'score', 'award'])
    expect(result.fields.name).toEqual({ state: 'available', value: '学生甲', externalKey: 'student_name' })
    expect(result.fields.score?.state).toBe('unknown')
    expect(result.fields.award?.state).toBe('unknown')
    expect(result.unmappedExternalKeys).toEqual(['another_field'])
    expect(mapExternalStatus('DONE', profile)).toEqual({ state: 'mapped', canonical: 'completed' })
    expect(mapExternalStatus('NEW_UNKNOWN', profile)).toEqual({ state: 'unknown', external: 'NEW_UNKNOWN' })
  })
})
