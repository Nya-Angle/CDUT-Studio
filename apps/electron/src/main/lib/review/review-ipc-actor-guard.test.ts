import { describe, expect, test } from 'bun:test'
import { bindLocalReviewerCommand, LOCAL_REVIEWER_ACTOR, bindLocalSubmitterCommand, LOCAL_SUBMITTER_ACTOR } from './review-ipc-actor-guard'

describe('审核业务命令 IPC 操作者身份边界', () => {
  test('渲染器不得声明系统、Agent、校方或模拟来源', () => {
    for (const actorSource of ['system', 'agent', 'school', 'mock']) {
      expect(() => bindLocalReviewerCommand({ actor: { actorId: 'forged', actorSource, role: 'reviewer' }, requestId: 'test' }))
        .toThrow('本地审核 IPC')
    }
  })
  test('没有经过机构验证的 teacher/admin/student 等角色不得进入 reviewer 审批入口', () => {
    for (const role of ['teacher', 'school-admin', 'student', 'system', 'template-owner']) {
      expect(() => bindLocalReviewerCommand({ actor: { actorId: 'forged', actorSource: 'local', role } })).toThrow('本地审核 IPC')
    }
  })
  test('未知或缺失操作者不能作为审批凭据', () => {
    expect(() => bindLocalReviewerCommand({})).toThrow()
    expect(() => bindLocalReviewerCommand({ actor: null })).toThrow()
    expect(() => bindLocalReviewerCommand({ actor: 'reviewer' })).toThrow()
  })
  test('本地 reviewer 也不得由前端自行填写审计身份', () => {
    const command = { requestId: 'r1', actor: { actorId: 'some-school-official', actorSource: 'local', role: 'reviewer' }, payload: { action: 'stage-pass' } }
    const result = bindLocalReviewerCommand(command)
    expect(result.actor).toEqual(LOCAL_REVIEWER_ACTOR)
    expect(result.requestId).toBe('r1')
    expect(command.actor.actorId).toBe('some-school-official') // input immutable
  })
})

describe('补件应答本地身份边界', () => {
  test('student 角色可以补件，但审计身份必须由 Main 绑定', () => {
    const claim = { actor: { actorId: 'forged-name', actorSource: 'local', role: 'student' }, requestId: 'reply-1' }
    const result = bindLocalSubmitterCommand(claim)
    expect(result.actor).toEqual(LOCAL_SUBMITTER_ACTOR)
    expect(result.requestId).toBe('reply-1')
    expect(claim.actor.actorId).toBe('forged-name')
  })
  test('旧版本地审核员代提交路径保留，但其审计身份也来自 Main', () => {
    const bound = bindLocalSubmitterCommand({ actor: {
      role: 'reviewer', actorSource: 'local', actorId: 'claimed-admin',
    } })
    expect(bound.actor).toEqual(LOCAL_REVIEWER_ACTOR)
  })
  test('不能把校方、教师或 Agent 角色用于学生回件', () => {
    for (const role of ['teacher', 'system', 'school-admin']) {
      expect(() => bindLocalSubmitterCommand({ actor: { role, actorSource: 'local', actorId: 'claimed' } })).toThrow('本地补件应答 IPC')
    }
    for (const source of ['school', 'agent', 'mock']) {
      expect(() => bindLocalSubmitterCommand({ actor: { role: 'student', actorSource: source, actorId: 'claimed' } })).toThrow('本地补件应答 IPC')
    }
    expect(() => bindLocalSubmitterCommand({})).toThrow()
  })
})
