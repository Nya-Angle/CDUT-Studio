/**
 * P02: characterize the existing strict Pi profile and exercise the REAL
 * direct-case review tools/ledger. No production behavior is modified.
 *
 * Scope: registered review tool definitions, document/image evidence, partial
 * turn resume, persisted review compaction summary, Pi adapter tool assembly
 * and idle compaction. Does NOT execute a live model or Electron viewer.
 */
import { afterAll, describe, expect, test } from 'bun:test'
import { randomUUID } from 'node:crypto'
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import type { Actor, TemplateVersion } from '@profer/shared'
import { buildReviewOpsTools } from '../adapters/pi-review-ops-tools'
import { isAuthorizedDirectReviewTool, selectDirectReviewStrictTools } from './review-strict-pi-tools'
import { inspectPreview } from '../preview-inspection-service'
import { autoCompactWhenIdle, buildCurrentSessionCompactionTool } from '../adapters/pi-agent-adapter'
import { createCaseFromTemplate } from './application-service'
import { readAggregate } from './case-store-v2'
import { registerMaterial } from './material-service'
import {
  buildPiReviewCompactionSummary,
  finishPiReviewRunV2,
  preparePiReviewRunV2,
} from './pi-case-review-service'
import { getRunV2, readArtifact } from './run-store-v2'
import { publishTemplate, saveDraft } from './template-store'

const config = mkdtempSync(join(tmpdir(), 'review-p02-'))
process.env.PROFER_CONFIG_DIR = config
afterAll(() => rmSync(config, { recursive: true, force: true }))
const actor: Actor = { actorId: 'p02-operator', actorSource: 'local', role: 'reviewer' }

type CapturedTool = {
  name: string
  parameters?: unknown
  execute?: (toolCallId: string, params: unknown) => Promise<{
    content?: Array<{ type: string; text?: string; data?: string; mimeType?: string }>
    details?: Record<string, unknown>
    isError?: boolean
  }>
}
function fakeSdk() {
  const definitions: CapturedTool[] = []
  const sdk = {
    defineTool<T extends CapturedTool>(tool: T): T {
      definitions.push(tool)
      return tool
    },
  } as unknown as typeof import('@earendil-works/pi-coding-agent')
  return { sdk, definitions }
}

async function caseFixture() {
  const id = randomUUID().slice(0, 8)
  const caseId = `p02-case-${id}`
  const sessionId = `p02-session-${id}`
  const templateId = `p02-template-${id}`
  const template: TemplateVersion = {
    templateId, version: 1, schemaVersion: 2, name: 'P02 strict tool contract',
    objectType: 'person', displayName: { template: '{{title}}' },
    fields: [], sections: [{
      id: 'all', name: '核验', order: 0, required: false,
      criteria: [
        { id: 'check-1', title: '正文证据', requirement: '核对正文',
          execution: 'semantic', targetScope: 'case' },
        { id: 'check-2', title: '图像证据', requirement: '核对图片',
          execution: 'semantic', targetScope: 'case' },
      ],
    }],
    materialSlots: [], policyVersionIds: [], policyRefs: [],
    stages: [{ id: 'review', name: '审核', kind: 'manual-review', executorRole: 'reviewer' }],
    outputs: [], status: 'draft', createdAt: new Date().toISOString(),
  }
  saveDraft(template)
  publishTemplate(templateId, 1)
  const created = await createCaseFromTemplate(templateId, 1, {
    title: 'P02 证据核验', fieldValues: {}, subjects: [],
  }, actor, caseId)
  if (!created.ok) throw new Error(created.message)
  const imagePath = join(config, `p02-${id}.png`)
  writeFileSync(imagePath, Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jXioAAAAASUVORK5CYII=', 'base64',
  ))
  const textPath = join(config, `p02-${id}.txt`)
  writeFileSync(textPath, '真实材料：2026 年项目申请已经登记。')
  for (const file of [imagePath, textPath]) {
    const state = readAggregate(caseId)!
    const registered = await registerMaterial(caseId, {
      requestId: `p02-reg-${randomUUID().slice(0, 8)}`, actor,
      expectedRevision: state.caseV2.revision, payload: { sourcePath: file, role: 'evidence' },
    })
    if (!registered.ok) throw new Error(registered.message)
  }
  const documents = readAggregate(caseId)!.caseV2.documents
  const image = documents.find(d => d.fileName === `p02-${id}.png`)!
  const plain = documents.find(d => d.fileName === `p02-${id}.txt`)!
  const prepared = preparePiReviewRunV2({ caseId, sessionId, turnId: `p02-turn-${id}` })
  const binding = { caseId, sessionId, runId: prepared.runId, assignmentId: prepared.assignmentId }
  const ref = (document: typeof image, kind: 'image' | 'text') => {
    const block = document.blocks.find(b => b.kind === kind)!
    return { documentVersionId: document.versionId, blockId: block.blockId }
  }
  return {
    caseId, sessionId, prepared, binding, imageRef: ref(image, 'image'), textRef: ref(plain, 'text'),
  }
}

function strictTools(binding: { caseId: string; sessionId: string; runId: string; assignmentId: string }, triggeredBy: 'user' | 'automation' = 'user') {
  const { sdk } = fakeSdk()
  const tools = buildReviewOpsTools(sdk, {
    sessionId: binding.sessionId, triggeredBy, allowedRoots: [config], directReviewBinding: binding,
  }) as unknown as CapturedTool[]
  const tool = (name: string): CapturedTool => {
    const selected = tools.find(t => t.name === name)
    if (!selected?.execute) throw new Error(`missing executable tool: ${name}`)
    return selected
  }
  return { tools, tool }
}

describe('P02 existing direct review tools / ledger compatibility', () => {
  test('direct binding exposes only the 3 case-scoped review tools (not approval, command or project tools)', async () => {
    const ctx = await caseFixture()
    const { tools } = strictTools(ctx.binding)
    expect(tools.map(x => x.name).sort()).toEqual([
      'review_inspect_document_image',
      'review_read_documents',
      'review_submit_result',
    ])
    for (const forbidden of ['Bash', 'Read', 'Write', 'Edit', 'AskUserQuestion', 'review_decide_stage', 'review_register_material', 'review_create_case']) {
      expect(tools.some(x => x.name === forbidden)).toBeFalse()
    }
  })

  test('real document read and image tool return evidence-bound results and record both reads in V2 ledger', async () => {
    const ctx = await caseFixture()
    const { tool } = strictTools(ctx.binding)
    const textResult = await tool('review_read_documents').execute!('read', {
      documents: [{ documentVersionId: ctx.textRef.documentVersionId }],
    })
    expect(textResult?.details?.acceptedCount).toBe(1)
    expect(JSON.stringify(textResult?.details)).toContain('2026 年项目申请')
    const imageResult = await tool('review_inspect_document_image').execute!('image', {
      ...ctx.imageRef, question: '这是一页怎样的证明？',
    })
    expect(imageResult?.isError).not.toBe(true)
    expect(imageResult?.content?.some(p => p.type === 'image' && p.mimeType === 'image/png')).toBeTrue()
    const receipt = readArtifact<{ blocks: Record<string, string[]> }>(ctx.caseId, ctx.prepared.runId, 'node-pi-read-state')
    expect(receipt?.blocks?.[ctx.textRef.documentVersionId]).toContain(ctx.textRef.blockId)
    expect(receipt?.blocks?.[ctx.imageRef.documentVersionId]).toContain(ctx.imageRef.blockId)
  })

  test('partial submit, ledger compaction and continuing the SAME run remain usable without general tools', async () => {
    const ctx = await caseFixture()
    const { tool } = strictTools(ctx.binding)
    await tool('review_read_documents').execute!('read', {
      documents: [{ documentVersionId: ctx.textRef.documentVersionId }],
    })
    const first = await tool('review_submit_result').execute!('submit-partial', {
      summary: '先提交正文检查', checks: [{
        ruleId: 'section-all-check-1', subjectIds: [], status: 'compliant',
        reason: '原文支持登记事实。',
        sourceRefs: [{ ...ctx.textRef, quote: '真实材料' }],
      }], finish: true,
    })
    expect(first?.details?.status).toBe('running')
    expect(first?.details?.missingChecks).toBeDefined()
    const summary = buildPiReviewCompactionSummary(ctx.caseId, ctx.prepared.runId)
    expect(summary).toContain(ctx.caseId)
    expect(summary).toContain('尚缺语义检查')
    expect(summary).toContain('P02')
    finishPiReviewRunV2(ctx.binding, { status: 'completed' })
    expect(getRunV2(ctx.caseId, ctx.prepared.runId)?.status).toBe('partially-completed')
    const continued = preparePiReviewRunV2({
      caseId: ctx.caseId, sessionId: ctx.sessionId,
      turnId: `next-${randomUUID().slice(0, 8)}`,
      resumeRunId: ctx.prepared.runId,
    })
    expect(continued.runId).toBe(ctx.prepared.runId)
    expect(continued.continuedRun).toBe(true)
    expect(continued.userMessage).toContain('【续审同一运行】')
    const nextBinding = { ...ctx.binding, assignmentId: continued.assignmentId }
    const next = strictTools(nextBinding)
    await next.tool('review_inspect_document_image').execute!('image', {
      ...ctx.imageRef, question: '核对图像材料',
    })
    const result = await next.tool('review_submit_result').execute!('submit-continued', {
      summary: '续交图片材料核验',
      checks: [{
        ruleId: 'section-all-check-2', subjectIds: [],
        status: 'awaiting-confirmation',
        reason: '图片没有足够细节证明申报事项，建议人工核实。',
        sourceRefs: [],
      }],
      finish: true,
    })
    expect(result?.details?.status).toBe('completed')
    expect(getRunV2(ctx.caseId, ctx.prepared.runId)?.status).toBe('completed')
    expect(getRunV2(ctx.caseId, ctx.prepared.runId)?.checks).toHaveLength(2)
  })

  test('a case-bound tool cannot read another case by supplying its documentVersionId', async () => {
    const owner = await caseFixture()
    const foreign = await caseFixture()
    const { tool } = strictTools(owner.binding)
    const textResult = await tool('review_read_documents').execute!('foreign-text', {
      documents: [{ documentVersionId: foreign.textRef.documentVersionId }],
    })
    expect(textResult?.details?.acceptedCount).toBe(0)
    expect(textResult?.details?.rejectedCount).toBe(1)
    const visualResult = await tool('review_inspect_document_image').execute!('foreign-image', {
      ...foreign.imageRef, question: '尝试跨案读取图片',
    })
    expect(visualResult?.isError).toBeTrue()
    expect(readArtifact(owner.caseId, owner.prepared.runId, 'node-pi-read-state')).toBeUndefined()
  })

  test('a stale tool closure cannot submit after its assignment is revoked by a continuing turn', async () => {
    const ctx = await caseFixture()
    const stale = strictTools(ctx.binding)
    finishPiReviewRunV2(ctx.binding, { status: 'completed' })
    expect(getRunV2(ctx.caseId, ctx.prepared.runId)?.status).toBe('partially-completed')
    const continued = preparePiReviewRunV2({
      caseId: ctx.caseId, sessionId: ctx.sessionId,
      turnId: `renewed-${randomUUID().slice(0, 8)}`,
      resumeRunId: ctx.prepared.runId,
    })
    const denied = await stale.tool('review_submit_result').execute!('stale-submit', {
      summary: '使用过期指派提交', checks: [], finish: true,
    })
    expect(denied?.isError).toBeTrue()
    expect(JSON.stringify(denied?.details)).toContain('审核授权失效')
    expect(getRunV2(ctx.caseId, continued.runId)?.status).toBe('running')
  })

  test('a non-user-triggered turn cannot write review result even if handed a binding', async () => {
    const ctx = await caseFixture()
    const { tool } = strictTools(ctx.binding, 'automation')
    const result = await tool('review_submit_result').execute!('automation-submit', {
      summary: '伪造审核提交', checks: [], finish: true,
    })
    expect(result?.isError).toBeTrue()
    expect(JSON.stringify(result?.details)).toContain('审核授权失效')
    expect(getRunV2(ctx.caseId, ctx.prepared.runId)?.status).toBe('running')
  })
})

describe('P02 production strict tool admission and case-scoped original preview', () => {
  test('host permissions allow only five bound tools; revoked or foreign tools are denied', async () => {
    const ctx = await caseFixture()
    for (const name of ['review_read_documents', 'review_inspect_document_image', 'review_submit_result',
      'review_inspect_original', 'CompactContext']) {
      expect(isAuthorizedDirectReviewTool(ctx.binding, name), name).toBeTrue()
    }
    for (const forbidden of ['Read', 'Write', 'Bash', 'AskUserQuestion', 'inspect_preview',
      'mcp__thirdparty__upload', 'review_decide_stage', 'discover_tools']) {
      expect(isAuthorizedDirectReviewTool(ctx.binding, forbidden), forbidden).toBeFalse()
    }
    finishPiReviewRunV2(ctx.binding, { status: 'completed' })
    const continued = preparePiReviewRunV2({
      caseId: ctx.caseId, sessionId: ctx.sessionId,
      turnId: `p02-auth-renew-${randomUUID().slice(0, 8)}`,
      resumeRunId: ctx.prepared.runId,
    })
    expect(isAuthorizedDirectReviewTool(ctx.binding, 'review_read_documents')).toBeFalse()
    expect(isAuthorizedDirectReviewTool({ ...ctx.binding, assignmentId: continued.assignmentId }, 'review_read_documents')).toBeTrue()
  })

  test('admits only the three direct operations plus case-scoped original inspection', async () => {
    const ctx = await caseFixture()
    const direct = strictTools(ctx.binding).tools
    const injected = ['Bash', 'Write', 'Read', 'AskUserQuestion', 'inspect_preview', 'mcp__external__upload', 'review_decide_stage']
      .map(name => ({ name, execute: async () => ({ details: { unsafe: true } }) }))
    const available = [...direct, ...injected]
    const allowed = selectDirectReviewStrictTools(available as never, ctx.binding)
    expect(allowed.map(t => t.name).sort()).toEqual([
      'review_read_documents', 'review_inspect_document_image', 'review_submit_result', 'review_inspect_original',
    ].sort())
    expect(() => selectDirectReviewStrictTools(
      [...available, direct.find(t => t.name === 'review_submit_result')!] as never, ctx.binding,
    )).toThrow('审核工具清单异常')
    expect(() => selectDirectReviewStrictTools(
      direct.filter(t => t.name !== 'review_read_documents') as never, ctx.binding,
    )).toThrow('审核工具清单异常')
  })

  test('preview only takes an active case version ID, delegates to the existing renderer and records V2 receipt', async () => {
    const ctx = await caseFixture()
    const foreign = await caseFixture()
    const calls: Array<{ input: Record<string, unknown>; roots: string[] }> = []
    const rendererStub = async (input: Record<string, unknown>, context: { allowedRoots: string[] }) => {
      calls.push({ input, roots: context.allowedRoots })
      return {
        content: [{ type: 'image', data: 'AA==', mimeType: 'image/png' }],
        details: {
          file: { name: 'mock.png', kind: 'image', size: 1, modifiedAt: '', revision: '' },
          visual: { scope: input.scope, images: [{ filename: 'image.png', data: 'AA==', mediaType: 'image/png', page: 1 }] },
        },
      }
    }
    const tool = selectDirectReviewStrictTools(strictTools(ctx.binding).tools as never, ctx.binding, rendererStub as never)
      .find(t => t.name === 'review_inspect_original')!
    const exec = tool.execute as (...a: unknown[]) => Promise<{ isError?: boolean }>
    const good = await exec('tool-1', {
      documentVersionId: ctx.imageRef.documentVersionId, scope: 'all', filePath: '/tmp/evil',
    })
    expect(good.isError).not.toBe(true)
    expect(calls).toHaveLength(1)
    expect(calls[0]?.input.mode).toBe('visual')
    expect(calls[0]?.input.scope).toBe('all')
    expect(String(calls[0]?.input.filePath)).toContain(ctx.caseId)
    expect(String(calls[0]?.input.filePath)).not.toContain('/tmp/evil')
    expect(calls[0]?.roots).toEqual([join(config, 'review-cases', ctx.caseId)])
    const receipt = readArtifact<{ fullyPreviewedDocumentVersionIds: string[] }>(ctx.caseId, ctx.prepared.runId, 'node-pi-read-state')
    expect(receipt?.fullyPreviewedDocumentVersionIds).toContain(ctx.imageRef.documentVersionId)
    expect((await exec('other', { documentVersionId: foreign.imageRef.documentVersionId })).isError).toBeTrue()
    expect((await exec('missing', { documentVersionId: 'missing-id' })).isError).toBeTrue()
    expect((await exec('bad-page', { documentVersionId: ctx.imageRef.documentVersionId, scope: 'page', page: 0 })).isError).toBeTrue()
    expect(calls).toHaveLength(1)
  })

  test('stale turn cannot append a preview receipt after changing the active assignment mid-render', async () => {
    const ctx = await caseFixture()
    let release!: () => void
    let started!: () => void
    const gate = new Promise<void>(r => { release = r })
    const entered = new Promise<void>(r => { started = r })
    const rendererStub = async () => {
      started()
      await gate
      return {
        content: [],
        details: {
          file: { name: 'mock.png', kind: 'image', size: 1, modifiedAt: '', revision: '' },
          visual: { scope: 'all', images: [{ filename: 'image.png', data: 'AA==', mediaType: 'image/png', page: 1 }] },
        },
      }
    }
    const tool = selectDirectReviewStrictTools(strictTools(ctx.binding).tools as never, ctx.binding, rendererStub as never)
      .find(t => t.name === 'review_inspect_original')!
    const run = (tool.execute as (...a: unknown[]) => Promise<{ isError?: boolean }>)('stale', {
      documentVersionId: ctx.imageRef.documentVersionId, scope: 'all',
    })
    await entered
    finishPiReviewRunV2(ctx.binding, { status: 'completed' })
    const next = preparePiReviewRunV2({
      caseId: ctx.caseId, sessionId: ctx.sessionId,
      turnId: `p02-rebound-${randomUUID().slice(0, 8)}`,
      resumeRunId: ctx.prepared.runId,
    })
    release()
    expect((await run).isError).toBeTrue()
    const receipt = readArtifact<{ fullyPreviewedDocumentVersionIds?: string[] }>(ctx.caseId, next.runId, 'node-pi-read-state')
    expect(receipt?.fullyPreviewedDocumentVersionIds ?? []).not.toContain(ctx.imageRef.documentVersionId)
  })

  test('existing preview authorization allows registered case assets but denies outside files', async () => {
    const ctx = await caseFixture()
    const aggregate = readAggregate(ctx.caseId)!
    const image = aggregate.caseV2.documents.find(d => d.versionId === ctx.imageRef.documentVersionId)!
    const asset = join(config, 'review-cases', ctx.caseId, image.assetPath)
    const rendererCalls: string[] = []
    const authorized = { agentCwd: '', allowedRoots: [join(config, 'review-cases', ctx.caseId)] }
    const permitted = await inspectPreview({
      filePath: asset, mode: 'visual', scope: 'all',
    }, authorized, { render: async ({ filePath }) => {
      rendererCalls.push(filePath)
      return { images: [{ filename: 'page-1.png', mediaType: 'image/png', data: 'AA==', page: 1 }] }
    } })
    expect('error' in permitted).toBe(false)
    expect(rendererCalls).toHaveLength(1)
    const blocked = await inspectPreview({ filePath: join(config, 'review-cases', 'outside-case.pdf'), mode: 'visual' },
      authorized, { render: async () => { throw new Error('must not render outside case') } })
    expect('error' in blocked).toBeTrue()
  })
})

describe('P02 actual Pi adapter strict profile construction (characterization, NOT full isolation)', () => {
  const text = readFileSync(new URL('../adapters/pi-agent-adapter.ts', import.meta.url), 'utf8')
  const begin = text.indexOf('      let compactContextRequested = false')
  const end = text.indexOf('\n      const settingsManager', begin)
  if (begin < 0 || end < 0) throw new Error('Adapter tool composition moved, inspect P02 scope')
  const toolAssembly = new Bun.Transpiler({ loader: 'ts', target: 'bun' })
    .transformSync(`function assemble(input: any, sdk: any, cwd: string) {\n${text.slice(begin, end)}\nreturn customTools\n}`)
  const build = (input: { toolProfile: string; customTools: CapturedTool[] }) => {
    const { sdk } = fakeSdk()
    const deps = {
      buildCurrentSessionCompactionTool,
      buildBuiltinToolDefinitions: () => [{ name: 'Read' }, { name: 'Write' }, { name: 'Bash' }],
      buildPromaProductToolDefinitions: () => [{ name: 'AskUserQuestion' }],
      wrapCustomToolDefinitions: (tools: CapturedTool[]) => tools,
    }
    const assemble = new Function(...Object.keys(deps), `${toolAssembly}\nreturn assemble`)(
      ...Object.values(deps),
    ) as (i: typeof input, s: typeof sdk, cwd: string) => CapturedTool[]
    return assemble(input, sdk, config).map(t => t.name)
  }

  test('strict profile excludes generic core/product tools while preserving explicitly supplied review tools and CompactContext', () => {
    const names = build({ toolProfile: 'review', customTools: [
      { name: 'review_read_documents' },
      { name: 'review_inspect_document_image' },
      { name: 'review_submit_result' },
    ] })
    expect(names.sort()).toEqual([
      'CompactContext', 'review_inspect_document_image', 'review_read_documents', 'review_submit_result',
    ])
    const normal = build({ toolProfile: 'general', customTools: [] })
    expect(normal).toEqual(expect.arrayContaining(['Read', 'Write', 'Bash', 'AskUserQuestion']))
  })

  test('known gap: review profile does NOT filter external customTools; host must whitelist before passing them', () => {
    const names = build({ toolProfile: 'review', customTools: [
      { name: 'review_read_documents' }, { name: 'mcp__arbitrary__write' }, { name: 'inspect_preview' },
    ] })
    // Characterization of current implementation, NOT an approved secure tool list.
    expect(names).toContain('mcp__arbitrary__write')
    expect(names).toContain('inspect_preview')
  })

  test('idle compaction reuses existing helper; never compacts when below threshold', async () => {
    const calls: string[] = []
    const fakeSession = (tokens: number) => ({
      isIdle: true,
      waitForIdle: async () => { calls.push('wait') },
      compact: async (instruction?: string) => { calls.push(instruction ?? '') },
      agent: { state: { messages: [{
        role: 'assistant', stopReason: 'end_turn',
        usage: { input: tokens, output: 0, cacheRead: 0, cacheWrite: 0, totalTokens: tokens },
      }] } },
    })
    await autoCompactWhenIdle({ session: fakeSession(600) as never,
      contextWindow: 1000, reserveTokens: 300, customInstructions: '仅按持久化账本总结' })
    expect(calls).toEqual([])
    await autoCompactWhenIdle({ session: fakeSession(750) as never,
      contextWindow: 1000, reserveTokens: 300, customInstructions: '仅按持久化账本总结' })
    expect(calls).toEqual(['仅按持久化账本总结'])
  })
})
