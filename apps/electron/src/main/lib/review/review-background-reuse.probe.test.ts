/**
 * PR #21 / P01 reuse probe.
 *
 * Execute the REAL existing runAgent() function body with a controlled
 * orchestrator and a synthetic WebContents. Review runs and assignments use
 * the real V2 stores in an isolated configuration directory.
 *
 * This verifies the no-Agent-tab lifecycle seam, NOT a live Pi/model E2E,
 * Electron window integration, or remote/session visibility.
 */
import { afterAll, describe, expect, test } from 'bun:test'
import { randomUUID } from 'node:crypto'
import { chmodSync, mkdirSync, mkdtempSync, readFileSync, renameSync, rmSync, rmdirSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import type { Actor, AgentSendInput, AgentStreamPayload, TemplateVersion } from '@profer/shared'
import type { SessionCallbacks } from '../agent-orchestrator'
import { createAgentRunOutcomeReporter } from '../agent-run-outcome'
import { AgentRunAlreadyActiveError } from '../agent-orchestrator-p0-guards'
import { createCaseFromTemplate } from './application-service'
import { readAggregate } from './case-store-v2'
import { registerMaterial } from './material-service'
import { finishPiReviewRunV2, preparePiReviewRunV2, recordPiReviewDocumentRead, submitPiReviewResultV2, getPiReviewBindingForSession } from './pi-case-review-service'
import { admitPreparedPiReviewTurn, isPiReviewRunAdmitted } from './review-pi-admission'
import { checkAssignment, createAssignment, findActivePiReviewAssignment, revokeAssignment } from './review-agent-assignment'
import { getRunV2 } from './run-store-v2'
import { publishTemplate, saveDraft } from './template-store'

const CONFIG_DIR = mkdtempSync(join(tmpdir(), 'cdut-review-background-p01-'))
process.env.PROFER_CONFIG_DIR = CONFIG_DIR
afterAll(() => rmSync(CONFIG_DIR, { recursive: true, force: true }))

const actor: Actor = { actorId: 'background-probe', actorSource: 'local', role: 'reviewer' }
const source = readFileSync(new URL('../agent-service.ts', import.meta.url), 'utf8').replace(/\r\n/g, '\n')
const begin = source.indexOf('export async function runAgent(')
const end = source.indexOf('/**\n * 无渲染进程', begin)
if (begin < 0 || end < 0) throw new Error('runAgent source boundary changed; revisit probe')
const compiled = new Bun.Transpiler({ loader: 'ts', target: 'bun' })
  .transformSync(source.slice(begin, end).replace(/export /g, ''))
const quietConsole = { log() {}, warn() {}, error() {}, info() {} }

type Binding = {
  assignmentId: string
  runId: string
  caseId: string
  sessionId: string
}

async function caseFixture() {
  const suffix = randomUUID().slice(0, 8)
  const templateId = `bg-probe-template-${suffix}`
  const caseId = `bg-probe-case-${suffix}`
  const sessionId = `bg-probe-session-${suffix}`
  const template: TemplateVersion = {
    templateId, version: 1, schemaVersion: 2, name: '后台执行复用验证',
    objectType: 'person', displayName: { template: '{{title}}' },
    fields: [],
    sections: [{
      id: 'all', name: '核验', order: 0, required: false,
      criteria: [{ id: 'check-1', title: '证明材料核验', requirement: '证明材料需包含有效记录',
        execution: 'semantic', targetScope: 'case' }],
    }],
    materialSlots: [], policyVersionIds: [], policyRefs: [],
    stages: [{ id: 'review', name: '审核', kind: 'manual-review', executorRole: 'reviewer' }],
    outputs: [], status: 'draft', createdAt: new Date().toISOString(),
  }
  saveDraft(template)
  publishTemplate(templateId, 1)
  const created = await createCaseFromTemplate(templateId, 1, {
    title: '后台执行探针案卷', fieldValues: {}, subjects: [],
  }, actor, caseId)
  if (!created.ok) throw new Error(created.message)
  const sourcePath = join(CONFIG_DIR, `proof-${suffix}.txt`)
  writeFileSync(sourcePath, '合法证明材料：有可验证的事实记录。')
  const initial = readAggregate(caseId)!
  const registered = await registerMaterial(caseId, {
    requestId: `material-${suffix}`, actor,
    expectedRevision: initial.caseV2.revision,
    payload: { sourcePath, role: 'evidence' },
  })
  if (!registered.ok) throw new Error(registered.message)
  const doc = readAggregate(caseId)!.caseV2.documents.find(x => x.fileName === `proof-${suffix}.txt`)!
  const textBlock = doc.blocks.find(x => x.kind !== 'image')!
  const prepared = preparePiReviewRunV2({ caseId, sessionId, turnId: `turn-${suffix}` })
  const binding: Binding = { caseId, sessionId, runId: prepared.runId, assignmentId: prepared.assignmentId }
  // RUN-46：文字引用必须来自本轮真实读取；夹具按真实工具顺序先读块再提交。
  recordPiReviewDocumentRead(binding, doc.versionId, [textBlock.blockId], readAggregate(caseId)!.caseV2.documents)
  const input: AgentSendInput = {
    sessionId, channelId: 'probe-channel', modelId: 'probe-model', userMessage: prepared.userMessage,
    agentRuntime: 'pi', triggeredBy: 'user', uuid: `turn-${suffix}`,
    onRunOutcome: outcome => finishPiReviewRunV2(binding, outcome),
  }
  return {
    binding, input,
    evidence: {
      documentVersionId: doc.versionId,
      blockId: textBlock.blockId,
      quote: '合法证明材料',
    },
  }
}

function existingRunAgentHarness(
  sendMessage: (input: AgentSendInput, callbacks: SessionCallbacks) => Promise<void>,
) {
  const events: AgentStreamPayload[] = []
  const wcSends: string[] = []
  // This fake WebContents is NOT an Agent tab. No openSession or renderer is created.
  const windowState = { destroyed: false }
  const webContents = {
    isDestroyed: () => windowState.destroyed,
    send(channel: string) { if (!windowState.destroyed) wcSends.push(channel) },
  }
  const deps = {
    orchestrator: { sendMessage, isActive: () => false },
    createAgentRunOutcomeReporter,
    registerWebContents() {},
    activeStreamEventBacklogs: new Map(),
    completedStreamEventBacklogs: new Map(),
    updateAgentSessionMeta() {},
    getAgentSessionMeta: () => undefined,
    publishAgentSessionProjection() {},
    sessionWebContents: new Map(),
    eventBus: { emit: (_id: string, payload: AgentStreamPayload) => { events.push(payload) } },
    runtimeContextStore: { clear() {} },
    preserveCompletedBacklog() {},
    AgentRunAlreadyActiveError,
    serializeErrorDetail: String,
    AGENT_IPC_CHANNELS: {},
    console: quietConsole,
  }
  const compiledFunction = new Function(
    ...Object.keys(deps),
    `${compiled}\nreturn runAgent`,
  )(...Object.values(deps)) as (input: AgentSendInput, sender: typeof webContents, draft?: undefined, onOwned?: () => void) => Promise<void>
  return {
    run: (input: AgentSendInput, onOwned?: () => void) => compiledFunction(input, webContents, undefined, onOwned),
    // Simulates the backing window disappearing after a Main-owned run starts.
    destroyWindow: () => { windowState.destroyed = true },
    events,
    wcSends,
  }
}

describe('P01 direct Pi review can reuse runAgent without navigating to a chat tab', () => {
  test('review tool writes a complete result; existing onRunOutcome does not overwrite completed V2 run', async () => {
    const { binding, input, evidence } = await caseFixture()
    const outcomes: string[] = []
    const original = input.onRunOutcome!
    input.onRunOutcome = outcome => { outcomes.push(outcome.status); original(outcome) }
    const harness = existingRunAgentHarness(async (actualInput, callbacks) => {
      expect(actualInput.sessionId).toBe(binding.sessionId)
      expect(actualInput.triggeredBy).toBe('user')
      callbacks.onRunOwned?.()
      const submission = submitPiReviewResultV2({
        binding,
        triggeredBy: 'user',
        result: {
          summary: '证明材料支持本次检查。',
          checks: [{ ruleId: 'section-all-check-1', subjectIds: [], status: 'compliant',
            reason: '原文提供明确依据。', sourceRefs: [evidence] }],
          finish: true,
        },
      })
      expect(submission).toMatchObject({ status: 'completed', rejected: [], missingChecks: [] })
      callbacks.onComplete([], { resultSubtype: 'success' })
    })
    await harness.run(input)
    expect(outcomes).toEqual(['completed'])
    expect(getRunV2(binding.caseId, binding.runId)?.status).toBe('completed')
    expect(harness.events.some(event => event.kind === 'run_complete')).toBeTrue()
  })

  test('without complete submission, an otherwise successful Agent turn remains partially-completed', async () => {
    const { binding, input } = await caseFixture()
    const harness = existingRunAgentHarness(async (_input, callbacks) => {
      callbacks.onRunOwned?.()
      callbacks.onComplete([], { resultSubtype: 'success' })
    })
    await harness.run(input)
    expect(getRunV2(binding.caseId, binding.runId)?.status).toBe('partially-completed')
  })

  test('an error cannot be reported as successful review after late SDK success', async () => {
    const { binding, input } = await caseFixture()
    const harness = existingRunAgentHarness(async (_input, callbacks) => {
      callbacks.onRunOwned?.()
      callbacks.onError('model provider unavailable')
      callbacks.onComplete([], { resultSubtype: 'success' })
    })
    await harness.run(input)
    expect(getRunV2(binding.caseId, binding.runId)).toMatchObject({
      status: 'failed', error: 'model provider unavailable',
    })
  })

  test('a user stop persists cancelled rather than completed', async () => {
    const { binding, input } = await caseFixture()
    const harness = existingRunAgentHarness(async (_input, callbacks) => {
      callbacks.onRunOwned?.()
      callbacks.onComplete([], { stoppedByUser: true, resultSubtype: 'error_during_execution' })
    })
    await harness.run(input)
    expect(getRunV2(binding.caseId, binding.runId)?.status).toBe('cancelled')
  })

  test('a busy run without ownership cannot falsely finish another run', async () => {
    const { binding, input } = await caseFixture()
    const harness = existingRunAgentHarness(async () => {
      throw new AgentRunAlreadyActiveError(false)
    })
    await expect(harness.run(input)).rejects.toBeInstanceOf(AgentRunAlreadyActiveError)
    expect(getRunV2(binding.caseId, binding.runId)?.status).toBe('running')
  })
})

describe('P03-S01 Main-owned Pi stage must not depend on review page lifetime', () => {
  test('after runtime ownership, losing its WebContents does not lose final V2 ledger state', async () => {
    const { binding, input } = await caseFixture()
    let resume!: () => void
    let accepted!: () => void
    const gate = new Promise<void>((resolve) => { resume = resolve })
    const onOwned = new Promise<void>((resolve) => { accepted = resolve })
    const harness = existingRunAgentHarness(async (_input, callbacks) => {
      callbacks.onRunOwned?.()
      accepted()
      await gate
      callbacks.onComplete([], { resultSubtype: 'success' })
    })
    const inFlight = harness.run(input)
    await onOwned
    expect(getRunV2(binding.caseId, binding.runId)?.status).toBe('running')
    // No ordinary Agent tab was created. Destroying even the whole sender
    // is stronger than unmounting only the review page, and must not change
    // the Main runner's audit outcome.
    harness.destroyWindow()
    resume()
    await inFlight
    expect(getRunV2(binding.caseId, binding.runId)?.status).toBe('partially-completed')
    expect(harness.events.some((event) => event.kind === 'run_complete')).toBeTrue()
  })

  test('V2 running alone is NOT an acceptance acknowledgement before onRunOwned', async () => {
    const { binding, input } = await caseFixture()
    let release!: () => void
    let reached!: () => void
    const gate = new Promise<void>((resolve) => { release = resolve })
    const entered = new Promise<void>((resolve) => { reached = resolve })
    let owned = false
    const harness = existingRunAgentHarness(async (_input, callbacks) => {
      reached()
      await gate
      owned = true
      callbacks.onRunOwned?.()
      callbacks.onComplete([], { resultSubtype: 'success' })
    })
    const task = harness.run(input)
    await entered
    expect(getRunV2(binding.caseId, binding.runId)?.status).toBe('running')
    expect(owned).toBeFalse()
    release()
    await task
    expect(owned).toBeTrue()
    expect(getRunV2(binding.caseId, binding.runId)?.status).toBe('partially-completed')
  })
})

describe('P03-S02 Main admission ACK and single-owner lifecycle', () => {
  test('ACK only after onRunOwned, while Main owns the subsequent long Pi turn', async () => {
    const { binding, input } = await caseFixture()
    let grant!: () => void
    let finish!: () => void
    let entered!: () => void
    const grantGate = new Promise<void>(resolve => { grant = resolve })
    const completeGate = new Promise<void>(resolve => { finish = resolve })
    const entry = new Promise<void>(resolve => { entered = resolve })
    const harness = existingRunAgentHarness(async (_input, callbacks) => {
      entered()
      await grantGate
      callbacks.onRunOwned?.()
      await completeGate
      callbacks.onComplete([], { resultSubtype: 'success' })
    })
    let admitted = false
    const receiptPromise = admitPreparedPiReviewTurn({ ...input, onRunOutcome: undefined },
      binding, harness.run).then(value => { admitted = true; return value })
    await entry
    expect(getRunV2(binding.caseId, binding.runId)?.status).toBe('running')
    expect(admitted).toBeFalse()
    expect(isPiReviewRunAdmitted(binding.caseId, binding.runId)).toBeFalse()
    grant()
    const receipt = await receiptPromise
    expect(receipt).toEqual(binding)
    expect(admitted).toBeTrue()
    expect(isPiReviewRunAdmitted(binding.caseId, binding.runId)).toBeTrue()
    expect(getRunV2(binding.caseId, binding.runId)?.status).toBe('running')
    // Even a destroyed WebContents after the ACK does not stop the Main turn.
    harness.destroyWindow()
    finish()
    // Main deliberately retains the running Promise; poll only the persisted
    // terminal state, not any renderer callback.
    for (let attempt = 0; attempt < 12 && getRunV2(binding.caseId, binding.runId)?.status === 'running'; attempt++) {
      await Promise.resolve()
    }
    expect(getRunV2(binding.caseId, binding.runId)?.status).toBe('partially-completed')
    expect(isPiReviewRunAdmitted(binding.caseId, binding.runId)).toBeFalse()
  })

  test('busy rejection before ownership closes only the newly prepared V2 run', async () => {
    const { binding, input } = await caseFixture()
    const harness = existingRunAgentHarness(async () => {
      throw new AgentRunAlreadyActiveError(false)
    })
    await expect(admitPreparedPiReviewTurn({ ...input, onRunOutcome: undefined }, binding, harness.run))
      .rejects.toBeInstanceOf(AgentRunAlreadyActiveError)
    expect(getRunV2(binding.caseId, binding.runId)?.status).toBe('failed')
    expect(findActivePiReviewAssignment(binding.sessionId)).toBeUndefined()
    expect(harness.events.some(event => event.kind === 'run_complete')).toBeFalse()
  })

  test('an early return without onRunOwned cannot emit a false ACK or orphan running', async () => {
    const { binding, input } = await caseFixture()
    const harness = existingRunAgentHarness(async () => {})
    await expect(admitPreparedPiReviewTurn({ ...input, onRunOutcome: undefined }, binding, harness.run))
      .rejects.toThrow('Agent 未获得执行权')
    expect(getRunV2(binding.caseId, binding.runId)?.status).toBe('failed')
    expect(findActivePiReviewAssignment(binding.sessionId)).toBeUndefined()
  })

  test('a duplicate admission for the same assignment is rejected without cancelling its owner', async () => {
    const { binding, input } = await caseFixture()
    let release!: () => void
    const gate = new Promise<void>(resolve => { release = resolve })
    let invoked = 0
    const harness = existingRunAgentHarness(async (_input, callbacks) => {
      invoked++
      callbacks.onRunOwned?.()
      await gate
      callbacks.onComplete([], { resultSubtype: 'success' })
    })
    const request = { ...input, onRunOutcome: undefined }
    const acknowledged = await admitPreparedPiReviewTurn(request, binding, harness.run)
    expect(acknowledged.runId).toBe(binding.runId)
    await expect(admitPreparedPiReviewTurn(request, binding, harness.run))
      .rejects.toThrow('不得重复启动')
    expect(invoked).toBe(1)
    expect(getRunV2(binding.caseId, binding.runId)?.status).toBe('running')
    release()
    for (let i = 0; i < 12 && getRunV2(binding.caseId, binding.runId)?.status === 'running'; i++) await Promise.resolve()
    expect(getRunV2(binding.caseId, binding.runId)?.status).toBe('partially-completed')
  })

  test('preflight failure after token grant preserves ACK but eventually produces failed V2 result', async () => {
    const { binding, input } = await caseFixture()
    const harness = existingRunAgentHarness(async (_input, callbacks) => {
      callbacks.onRunOwned?.()
      callbacks.onError('模型预检失败')
      callbacks.onComplete([], { resultSubtype: 'error_during_execution' })
    })
    const accepted = await admitPreparedPiReviewTurn({ ...input, onRunOutcome: undefined }, binding, harness.run)
    expect(accepted.assignmentId).toBe(binding.assignmentId)
    for (let i = 0; i < 12 && getRunV2(binding.caseId, binding.runId)?.status === 'running'; i++) await Promise.resolve()
    expect(getRunV2(binding.caseId, binding.runId)).toMatchObject({ status: 'failed', error: '模型预检失败' })
  })

  test('untrusted or stale binding cannot start even when V2 has a historical run', async () => {
    const { binding, input } = await caseFixture()
    let invoked = false
    const fakeRun = async () => { invoked = true }
    await expect(admitPreparedPiReviewTurn({ ...input, onRunOutcome: undefined, triggeredBy: 'automation' },
      binding, fakeRun)).rejects.toThrow('不一致')
    await expect(admitPreparedPiReviewTurn({ ...input, onRunOutcome: undefined, uuid: 'different-turn' },
      binding, fakeRun)).rejects.toThrow('指派已失效')
    expect(invoked).toBeFalse()
    expect(getRunV2(binding.caseId, binding.runId)?.status).toBe('running')
  })
})


describe('P06-FIX-03 durable revoke-failure containment', () => {
  test('终态和撤销同时失写时，outcome 回调返回前即拒绝旧授权，不等待 executor Promise 收尾', async () => {
    const { binding, input } = await caseFixture()
    const runPath = join(CONFIG_DIR, 'review-cases', binding.caseId, 'runs-v2', `${binding.runId}.json`)
    const assignmentPath = join(CONFIG_DIR, 'review-agent-assignments.json')
    let callback!: NonNullable<AgentSendInput['onRunOutcome']>
    let release!: () => void
    const gate = new Promise<void>(resolve => { release = resolve })
    await admitPreparedPiReviewTurn({ ...input, onRunOutcome: undefined }, binding, async (runInput, owned) => {
      callback = runInput.onRunOutcome!
      owned()
      await gate
    })
    mkdirSync(runPath + '.tmp'); mkdirSync(assignmentPath + '.tmp')
    try {
      callback({ status: 'failed', error: '合成双持久化故障' })
      expect(checkAssignment({ assignmentId: binding.assignmentId, sessionId: binding.sessionId, action: 'submit-result' }).ok).toBeFalse()
      expect(isPiReviewRunAdmitted(binding.caseId, binding.runId)).toBeFalse()
      expect(getRunV2(binding.caseId, binding.runId)?.status).toBe('running')
      const disk = JSON.parse(readFileSync(assignmentPath, 'utf8')) as { assignments: Array<{ id: string; revokedAt?: string }> }
      expect(disk.assignments.find(a => a.id === binding.assignmentId)?.revokedAt).toBeUndefined()
    } finally {
      rmdirSync(runPath + '.tmp'); rmdirSync(assignmentPath + '.tmp'); release()
      await Bun.sleep(0)
    }
  })

  test('a live direct Pi grant becomes unusable when its V2 run is already terminal, even with an unrevoked disk row', async () => {
    const { binding } = await caseFixture()
    expect(checkAssignment({ assignmentId: binding.assignmentId, sessionId: binding.sessionId, action: 'submit-result' }).ok).toBeTrue()
    finishPiReviewRunV2(binding, { status: 'failed', error: '合成终态' })
    expect(checkAssignment({ assignmentId: binding.assignmentId, sessionId: binding.sessionId, action: 'submit-result' }).code).toBe('ASSIGNMENT_REVOKED')
    // The durable assignment remains auditable until its revoke is written.
    // The Pi binding lookup is the actual live-run authorization gate.
    expect(findActivePiReviewAssignment(binding.sessionId)?.id).toBe(binding.assignmentId)
    expect(getPiReviewBindingForSession(binding.sessionId)).toBeUndefined()
  })

  test('a malformed persistent assignment file cannot be overwritten by new grants or authorize old tools', async () => {
    const { binding } = await caseFixture()
    const path = join(CONFIG_DIR, 'review-agent-assignments.json')
    const intact = readFileSync(path, 'utf8')
    try {
      writeFileSync(path, '{incomplete')
      expect(() => createAssignment({ sessionId: 'ordinary-test', turnId: 'new-turn', caseId: 'test-case', actions: ['submit-result'] })).toThrow()
      expect(readFileSync(path, 'utf8')).toBe('{incomplete')
      expect(checkAssignment({ assignmentId: binding.assignmentId, sessionId: binding.sessionId, action: 'submit-result' }).ok).toBeFalse()
    } finally {
      writeFileSync(path, intact)
    }
  })

  test('failed revoke write after true ACK is observed: no unhandled rejection, Main ACK clears, grant locally denied', async () => {
    const { binding, input } = await caseFixture()
    const path = join(CONFIG_DIR, 'review-agent-assignments.json')
    const backup = `${path}.fix03-${randomUUID()}`
    let release!: () => void
    const gate = new Promise<void>((resolve) => { release = resolve })
    const receipt = await admitPreparedPiReviewTurn({ ...input, onRunOutcome: undefined }, binding, async (runInput, owned) => {
      owned()
      await gate
      runInput.onRunOutcome?.({ status: 'failed', error: '合成执行终态' })
    })
    expect(receipt).toEqual(binding)
    expect(isPiReviewRunAdmitted(binding.caseId, binding.runId)).toBeTrue()
    let unhandled = false
    const observe = () => { unhandled = true }
    process.on('unhandledRejection', observe)
    renameSync(path, backup)
    mkdirSync(path) // deterministic EISDIR write failure on all operating systems
    try {
      release()
      await Bun.sleep(40)
      expect(isPiReviewRunAdmitted(binding.caseId, binding.runId)).toBeFalse()
      // Revocation I/O failure can prevent a trusted V2 finish: retain the
      // unconfirmed running row for recovery, but never retain the grant/ACK.
      expect(getRunV2(binding.caseId, binding.runId)?.status).toBe('running')
      expect(checkAssignment({ assignmentId: binding.assignmentId, sessionId: binding.sessionId, action: 'submit-result' }).code).toBe('ASSIGNMENT_REVOKED')
      expect(unhandled).toBeFalse()
    } finally {
      process.off('unhandledRejection', observe)
      rmdirSync(path)
      renameSync(backup, path)
    }
    const persisted = JSON.parse(readFileSync(path, 'utf8')) as { assignments: Array<{ id: string; revokedAt?: string }> }
    expect(persisted.assignments.find(x => x.id === binding.assignmentId)?.revokedAt).toBeUndefined()
    // Never confuse a process-local quarantine with a durable revokedAt.
    expect(checkAssignment({ assignmentId: binding.assignmentId, sessionId: binding.sessionId, action: 'submit-result' }).code).toBe('ASSIGNMENT_REVOKED')
    // Once disk writes resume, a subsequent unrelated legitimate grant must
    // automatically persist the quarantined revocation before it can be reused
    // by a new process. It must not silently copy the old live row unchanged.
    const independent = createAssignment({ sessionId: 'fix03-independent-' + randomUUID(),
      turnId: 'independent-turn', caseId: binding.caseId, actions: ['list'] })
    const recovered = JSON.parse(readFileSync(path, 'utf8')) as { assignments: Array<{ id: string; revokedAt?: string }> }
    expect(recovered.assignments.find(x => x.id === binding.assignmentId)?.revokedAt).toBeTruthy()
    expect(checkAssignment({ assignmentId: independent.id, sessionId: independent.sessionId, action: 'list' }).ok).toBeTrue()
  })

  test('pre-ACK executor rejection under corrupt assignment storage settles the caller and releases the duplicate fence', async () => {
    const { binding, input } = await caseFixture()
    const path = join(CONFIG_DIR, 'review-agent-assignments.json')
    const original = readFileSync(path, 'utf8')
    let entered!: () => void
    let release!: () => void
    const arrived = new Promise<void>((resolve) => { entered = resolve })
    const gate = new Promise<void>((resolve) => { release = resolve })
    const admission = admitPreparedPiReviewTurn({ ...input, onRunOutcome: undefined }, binding, async () => {
      entered()
      await gate
      throw new Error('synthetic executor pre-ACK rejection')
    })
    await arrived
    let unhandled = false
    const observe = () => { unhandled = true }
    process.on('unhandledRejection', observe)
    try {
      writeFileSync(path, '{broken authorization json')
      release()
      await expect(admission).rejects.toThrow('synthetic executor pre-ACK rejection')
      await Bun.sleep(30)
      expect(isPiReviewRunAdmitted(binding.caseId, binding.runId)).toBeFalse()
      expect(checkAssignment({ assignmentId: binding.assignmentId, sessionId: binding.sessionId, action: 'submit-result' }).ok).toBeFalse()
      expect(unhandled).toBeFalse()
    } finally {
      process.off('unhandledRejection', observe)
      writeFileSync(path, original)
    }
    expect(checkAssignment({ assignmentId: binding.assignmentId, sessionId: binding.sessionId, action: 'submit-result' }).code).toBe('ASSIGNMENT_REVOKED')
  })


  test('EACCES from a readonly grants file leaves persistent revokedAt unconfirmed and denies the local grant', async () => {
    // This reproduces the original reported POSIX EACCES condition on the
    // non-root CI runner. Under root, leave it to the deterministic EISDIR test.
    if (process.getuid?.() === 0) return
    const { binding, input } = await caseFixture()
    const path = join(CONFIG_DIR, 'review-agent-assignments.json')
    let release!: () => void
    const gate = new Promise<void>(resolve => { release = resolve })
    await admitPreparedPiReviewTurn({ ...input, onRunOutcome: undefined }, binding, async (runInput, owned) => {
      owned()
      await gate
      runInput.onRunOutcome?.({ status: 'failed', error: 'EACCES synthetic run' })
    })
    let unhandled = false
    const listener = () => { unhandled = true }
    process.on('unhandledRejection', listener)
    try {
      // Atomic replacement writes a sibling .tmp; a readonly target alone
      // can be renamed on POSIX. Deny directory writes for a true EACCES.
      chmodSync(CONFIG_DIR, 0o500)
      release()
      await Bun.sleep(50)
      expect(isPiReviewRunAdmitted(binding.caseId, binding.runId)).toBeFalse()
      expect(checkAssignment({ assignmentId: binding.assignmentId, sessionId: binding.sessionId, action: 'submit-result' }).code).toBe('ASSIGNMENT_REVOKED')
      expect(unhandled).toBeFalse()
    } finally {
      chmodSync(CONFIG_DIR, 0o700)
      process.off('unhandledRejection', listener)
    }
    const data = JSON.parse(readFileSync(path, 'utf8')) as { assignments: Array<{ id: string; revokedAt?: string }> }
    expect(data.assignments.find(x => x.id === binding.assignmentId)?.revokedAt).toBeUndefined()
  })

  test('invalid V2 final-state persistence is not accepted as terminal and cannot leave a stale ACK', async () => {
    const { binding, input } = await caseFixture()
    const path = join(CONFIG_DIR, 'review-cases', binding.caseId, 'runs-v2', `${binding.runId}.json`)
    const backup = `${path}.fix03-backup`
    let release!: () => void
    const gate = new Promise<void>(resolve => { release = resolve })
    await admitPreparedPiReviewTurn({ ...input, onRunOutcome: undefined }, binding, async (runInput, owned) => {
      owned()
      await gate
      runInput.onRunOutcome?.({ status: 'failed', error: 'simulated V2 write interruption' })
    })
    renameSync(path, backup)
    mkdirSync(path)
    try {
      release()
      await Bun.sleep(40)
      expect(isPiReviewRunAdmitted(binding.caseId, binding.runId)).toBeFalse()
      expect(checkAssignment({ assignmentId: binding.assignmentId, sessionId: binding.sessionId, action: 'submit-result' }).code).toBe('ASSIGNMENT_REVOKED')
    } finally {
      rmdirSync(path)
      renameSync(backup, path)
    }
    // The V2 record is STILL running on disk. This is an OPEN persistence
    // incident for startup recovery, not a falsely reported successful finish.
    expect(getRunV2(binding.caseId, binding.runId)?.status).toBe('running')
  })

  test('a successful durable revoke still reports revokedAt and leaves an ordinary independent grant working', async () => {
    const { binding } = await caseFixture()
    const ordinary = createAssignment({ sessionId: 'normal-' + randomUUID(), turnId: 'user-turn', caseId: binding.caseId, actions: ['list'] })
    expect(revokeAssignment(binding.assignmentId)).toBeTrue()
    expect(checkAssignment({ assignmentId: binding.assignmentId, sessionId: binding.sessionId, action: 'submit-result' }).code).toBe('ASSIGNMENT_REVOKED')
    expect(checkAssignment({ assignmentId: ordinary.id, sessionId: ordinary.sessionId, action: 'list' }).ok).toBeTrue()
    const path = join(CONFIG_DIR, 'review-agent-assignments.json')
    const entries = JSON.parse(readFileSync(path, 'utf8')) as { assignments: Array<{ id: string; revokedAt?: string }> }
    expect(entries.assignments.find(x => x.id === binding.assignmentId)?.revokedAt).toBeTruthy()
  })
})
