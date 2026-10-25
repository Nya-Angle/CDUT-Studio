import { describe, expect, test } from 'bun:test'
import type { Actor, CaseAggregateV2, TemplateVersion } from '@profer/shared'
import { applyT05LocalStageProposal, planT05LocalStageAction, planT05SupplementReentry } from './review-v3-t05-local-stage-plan'

const reviewer: Actor = { actorId: 'reviewer-1', actorSource: 'local', role: 'reviewer' }
const teacher: Actor = { actorId: 'teacher-2', actorSource: 'local', role: 'teacher' }

const template = (): TemplateVersion => ({
  templateId: 'lab-use', version: 1, status: 'published',
  stages: [
    { id: 'initial', executorRole: 'reviewer', nextStageId: 'final' },
    { id: 'final', executorRole: 'teacher', returnToStageId: 'initial' },
  ],
} as TemplateVersion)

const aggregate = (): CaseAggregateV2 => ({
  caseV2: { id: 'case-lab', templateId: 'lab-use', templateVersion: 1, stage: 'reviewing', revision: 7 },
  tasks: [
    { id: 'task-initial', stageId: 'initial', assigneeRole: 'reviewer', status: 'open', round: 1 },
  ],
  decisions: [], supplements: [],
} as unknown as CaseAggregateV2)

const run = () => ({ id: 'run-real-001', caseId: 'case-lab', status: 'completed' as const, current: true, decisionReadiness: 'ready' as const })
const act = (patch: Record<string, unknown> = {}) => ({
  aggregate: aggregate(), template: template(), actor: reviewer,
  businessMode: 'local-business' as const,
  taskId: 'task-initial', action: 'stage-pass' as const, reason: '计划审核无误',
  verifiedRun: run(), ...patch,
})

describe('T05 local-business stage planning for A15', () => {
  test('real completed Run + reviewer initial pass creates a teacher stage, not final approval', () => {
    const proposal = planT05LocalStageAction(act())
    expect(proposal).toMatchObject({
      taskId: 'task-initial',
      stageId: 'initial', decisionFinality: 'stage',
      basedOnRunId: 'run-real-001', basedOnRevision: 7,
      nextStageId: 'final', nextAssigneeRole: 'teacher',
    })
    expect(proposal.decisionFinality).not.toBe('final')
  })
  test('final teacher stage uses its own real Run, not run@rev placeholder', () => {
    const current = aggregate()
    current.tasks = [{ id: 'task-final', stageId: 'final', assigneeRole: 'teacher', status: 'open' }] as typeof current.tasks
    const result = planT05LocalStageAction(act({
      aggregate: current, actor: teacher, taskId: 'task-final', action: 'stage-pass',
    }))
    expect(result.decisionFinality).toBe('final')
    expect(result.basedOnRunId).toBe('run-real-001')
    expect(result.nextStageId).toBeUndefined()
    expect(() => planT05LocalStageAction(act({aggregate: current, taskId: 'task-final'}))).toThrow('T05_ACTOR_NOT_ASSIGNED_TO_STAGE')
  })
  test('no real current ReviewRun means no business pass or reject', () => {
    expect(() => planT05LocalStageAction(act({verifiedRun: undefined}))).toThrow('T05_CURRENT_REAL_RUN_REQUIRED')
    expect(() => planT05LocalStageAction(act({verifiedRun: {...run(),current:false}}))).toThrow('T05_CURRENT_REAL_RUN_REQUIRED')
    expect(() => planT05LocalStageAction(act({verifiedRun: {...run(),caseId:'other'}}))).toThrow('T05_CURRENT_REAL_RUN_REQUIRED')
    expect(() => planT05LocalStageAction(act({action:'final-reject',verifiedRun: undefined}))).toThrow('T05_CURRENT_REAL_RUN_REQUIRED')
  })
  test('21 people over limit or unhandled required checks cannot silently stage-pass', () => {
    expect(() => planT05LocalStageAction(act({
      verifiedRun: { ...run(), decisionReadiness: 'blocked' },
    }))).toThrow('T05_REQUIRED_CHECKS_NOT_RESOLVED')
    // A human can issue an explicit final rejection based on a genuine Run.
    expect(planT05LocalStageAction(act({
      action: 'final-reject', verifiedRun: { ...run(), decisionReadiness: 'blocked' },
    })).decisionFinality).toBe('final')
  })
  test('missing plan can request supplement without inventing a Run or decision', () => {
    const result = planT05LocalStageAction(act({
      action: 'return-for-supplement', verifiedRun: undefined,
      requiredElements: ['计划书', ' 时间安排 ', '计划书'], supplementReason: '请补齐计划书和时间',
    }))
    expect(result.supplement).toEqual({requiredElements:['计划书','时间安排'],publicReason:'请补齐计划书和时间'})
    expect(result.basedOnRunId).toBeUndefined()
    expect(result.decisionFinality).toBeUndefined()
  })
  test('role, template, unresolved supplements, and technical-only mode are enforced', () => {
    expect(() => planT05LocalStageAction(act({businessMode:'technical-pre-review'}))).toThrow('T05_TECHNICAL_PREVIEW_NOT_BUSINESS_DECISION')
    expect(() => planT05LocalStageAction(act({actor:{...reviewer,actorSource:'agent'}}))).toThrow('T05_TRUSTED_HUMAN_ACTOR_REQUIRED')
    expect(() => planT05LocalStageAction(act({template:{...template(),version:2}}))).toThrow('T05_PUBLISHED_TEMPLATE_REVISION_REQUIRED')
    const current = aggregate()
    current.supplements = [{ id:'sup-1',status:'responded' }] as typeof current.supplements
    expect(() => planT05LocalStageAction(act({aggregate: current}))).toThrow('T05_UNRESOLVED_SUPPLEMENTS')
  })
  test('final can return to initial stage as a new stage decision', () => {
    const current=aggregate()
    current.tasks=[{id:'task-final',stageId:'final',assigneeRole:'teacher',status:'open'}] as typeof current.tasks
    expect(planT05LocalStageAction(act({
      aggregate:current,actor:teacher,taskId:'task-final',action:'return-to-previous-stage',
    }))).toMatchObject({returnToStageId:'initial',nextAssigneeRole:'reviewer',decisionFinality:'stage'})
  })
})


describe('T05 real append-only stage mutations (Main-owned persistence)', () => {
  const ids = { decisionId:'dec-real-001', nextTaskId:'task-final-001', supplementId:'sup-real-001', at:'2026-10-21T02:00:00Z' }
  test('initial pass completes initial task, appends real Run decision, opens final teacher task', () => {
    const current = aggregate()
    const planned = planT05LocalStageAction(act({aggregate:current}))
    const result = applyT05LocalStageProposal(current,planned,reviewer,ids)
    expect(result.caseStage).toBe('reviewing')
    expect(result.addedDecision).toMatchObject({stageId:'initial',finality:'stage',basedOnRunId:'run-real-001'})
    expect(result.addedTask).toMatchObject({stageId:'final',assigneeRole:'teacher',status:'open',round:1})
    expect(result.tasks.find(x=>x.id==='task-initial')?.status).toBe('completed')
    expect(current.tasks[0]?.status).toBe('open')
    expect(current.decisions).toHaveLength(0)
  })
  test('final teacher decision is final, no new task, original decisions unchanged', () => {
    const current=aggregate()
    current.tasks=[{id:'task-final',stageId:'final',assigneeRole:'teacher',round:1,status:'open'}] as typeof current.tasks
    const planned=planT05LocalStageAction(act({aggregate:current,actor:teacher,taskId:'task-final'}))
    const result=applyT05LocalStageProposal(current,planned,teacher,ids)
    expect(result.caseStage).toBe('decided')
    expect(result.addedDecision?.finality).toBe('final')
    expect(result.addedTask).toBeUndefined()
  })
  test('missing material makes a durable supplement without a fake decision or Run', () => {
    const current=aggregate()
    const planned=planT05LocalStageAction(act({aggregate:current,action:'return-for-supplement',
      verifiedRun:undefined,requiredElements:['计划书','明确人数'],supplementReason:'补齐材料'}))
    const result=applyT05LocalStageProposal(current,planned,reviewer,ids)
    expect(result.caseStage).toBe('awaiting-supplement')
    expect(result.addedSupplement).toMatchObject({originTaskId:'task-initial',originStageId:'initial',
      responsibleRole:'student',status:'open'})
    expect(result.addedDecision).toBeUndefined()
    expect(result.addedSupplement?.documentVersionIdsAtRequest).toEqual([])
    expect(result.decisions).toHaveLength(0)
    expect(result.tasks[0]?.status).toBe('completed')
  })
  test('changed revision rejects stale prepared mutation', () => {
    const current=aggregate()
    const planned=planT05LocalStageAction(act({aggregate:current}))
    current.caseV2.revision+=1
    expect(() => applyT05LocalStageProposal(current,planned,reviewer,ids)).toThrow('T05_STAGE_REVISION_CHANGED')
  })
})

describe('T05 supplement reentry for A09 and A15', () => {
  test('first unclear reply is insufficient; second accepted reply restores original stage', () => {
    const current=aggregate()
    current.tasks=[{id:'old-task',stageId:'initial',assigneeRole:'reviewer',status:'completed'}] as typeof current.tasks
    current.supplements=[{
      id:'sup-1',status:'responded',originTaskId:'old-task',originStageId:'initial',
    }] as typeof current.supplements
    expect(planT05SupplementReentry(current,'sup-1','insufficient')).toEqual({canResume:false})
    expect(planT05SupplementReentry(current,'sup-1','satisfied')).toEqual({
      canResume:true, restoreStageId:'initial', restoreRole:'reviewer',
    })
    current.supplements[0]!.status='insufficient'
    expect(() => planT05SupplementReentry(current,'sup-1','satisfied')).toThrow('T05_REPLY_REQUIRED_BEFORE_SATISFIED')
    current.supplements[0]!.status='responded'
    current.supplements.push({id:'sup-2',status:'open'} as typeof current.supplements[number])
    expect(planT05SupplementReentry(current,'sup-1','satisfied').canResume).toBe(false)
    current.supplements[1]!.status='satisfied'
    expect(planT05SupplementReentry(current,'sup-1','satisfied').canResume).toBe(true)
  })
})
