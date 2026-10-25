import { afterEach, beforeEach, describe, expect, test } from 'bun:test'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { AGENT_PRESET_TOOL_GROUPS, type AgentPreset, type AgentPresetUpdateInput } from '@profer/shared'
import {
  __resetAgentPresetsBaseDirForTest,
  __setAgentPresetsBaseDirForTest,
  getDefaultPresetId,
  createAgentPreset,
  listAgentPresets,
} from './agent-preset-manager'
import {
  copyWorkspacePresetFromAgent,
  createWorkspacePresetFromAgent,
  diffAgentPresetCapabilities,
  evaluateAgentPresetOperationIntents,
  summarizeAgentPreset,
  switchSessionPresetFromAgent,
  proposeAgentPresetUpdateFromAgent,
  proposeAgentPresetDefaultFromAgent,
  commitPendingAgentPresetChangeFromAgent,
  clearPendingPresetChange,
  getPendingPresetChange,
  type PresetChangeOperationDependencies,
  type SwitchOperationDependencies,
} from './agent-preset-operations'

let tempDir: string

beforeEach(() => {
  tempDir = mkdtempSync(join(tmpdir(), 'agent-preset-operations-'))
  __setAgentPresetsBaseDirForTest(tempDir)
})

afterEach(() => {
  __resetAgentPresetsBaseDirForTest()
  rmSync(tempDir, { recursive: true, force: true })
})

describe('Agent preset operation intent gate', () => {
  test('Given an explicit user command When evaluated Then only the requested operation is allowed', () => {
    expect(evaluateAgentPresetOperationIntents('帮我创建一个代码审查预设')).toEqual(['create'])
    expect(evaluateAgentPresetOperationIntents('请复制极简预设，命名为快速问答')).toEqual(['copy'])
    expect(evaluateAgentPresetOperationIntents('把这套工作方式固化成 Agent preset')).toEqual(['create'])
    expect(evaluateAgentPresetOperationIntents('把当前会话切换到极简预设')).toEqual(['switch'])
    expect(evaluateAgentPresetOperationIntents('switch this session to another agent preset')).toEqual(['switch'])
  })

  test('Given discussion, negation, or unrelated text When evaluated Then no mutation is allowed', () => {
    expect(evaluateAgentPresetOperationIntents('为什么 Agent 不能创建预设？')).toEqual([])
    expect(evaluateAgentPresetOperationIntents('创建预设需要哪些字段？')).toEqual([])
    expect(evaluateAgentPresetOperationIntents('能不能支持复制预设？')).toEqual([])
    expect(evaluateAgentPresetOperationIntents('不要创建预设，只解释设计')).toEqual([])
    expect(evaluateAgentPresetOperationIntents('不要切换到极简预设')).toEqual([])
    expect(evaluateAgentPresetOperationIntents('如何切换预设？')).toEqual([])
    expect(evaluateAgentPresetOperationIntents('检查当前预设的能力')).toEqual([])
    expect(evaluateAgentPresetOperationIntents('能不能把研究模式设为默认？')).toEqual([])
    expect(evaluateAgentPresetOperationIntents('请修改研究模式预设')).toEqual(['propose_update'])
    expect(evaluateAgentPresetOperationIntents('把极简预设设为默认')).toEqual(['propose_default'])
  })
})

describe('Agent preset change proposals', () => {
  test('Given an explicit update When proposing Then no write occurs until confirmed', () => {
    const target = createAgentPreset('ws-a', { name: '研究模式', description: '原始', permissionMode: 'plan' })
    const updateCalls: AgentPresetUpdateInput[] = []
    const dependencies: PresetChangeOperationDependencies = {
      getPreset: () => target,
      getPresetSnapshot: () => target,
      getDefaultReference: () => ({ presetId: 'standard', presetScope: 'builtin-meta' }),
      updatePreset: (_workspace, _id, updates) => { updateCalls.push(updates); return { ...target, permissionMode: 'auto', updatedAt: target.updatedAt + 1 } },
      setDefault: (_workspace, reference) => reference,
      appendAudit: () => true,
      restorePreset: () => {},
    }
    const result = proposeAgentPresetUpdateFromAgent(
      { sessionId: 'proposal-update', workspaceSlug: 'ws-a', source: 'user', allowedOperations: ['propose_update'], userMessage: '请修改研究模式预设' },
      { presetId: target.id, presetScope: 'workspace' },
      { permissionMode: 'auto' },
    )
    expect(result).toMatchObject({ operation: 'propose_update', kind: 'update', impact: { requiresConfirmation: true } })
    expect(updateCalls).toEqual([])
    expect(getPendingPresetChange('proposal-update')).toMatchObject({ proposalId: result.proposalId, kind: 'update' })
    const committed = commitPendingAgentPresetChangeFromAgent(
      { sessionId: 'proposal-update', workspaceSlug: 'ws-a', source: 'user', allowedOperations: ['commit_change'], userMessage: '确认' },
      dependencies,
    )
    expect(committed).toMatchObject({ operation: 'commit_change', kind: 'update', effectiveFrom: 'next_turn' })
    expect(updateCalls).toEqual([{ permissionMode: 'auto' }])
    expect(getPendingPresetChange('proposal-update')).toBeUndefined()
  })

  test('Given a default proposal When cancelled or expired Then commit cannot happen', () => {
    const target = createAgentPreset('ws-a', { name: '默认候选', description: '' })
    const audits: unknown[] = []
    const dependencies: PresetChangeOperationDependencies = {
      getPreset: () => target,
      getPresetSnapshot: () => target,
      getDefaultReference: () => ({ presetId: 'standard', presetScope: 'builtin-meta' }),
      updatePreset: () => target,
      setDefault: () => ({ presetId: target.id, presetScope: 'workspace', workspaceSlug: 'ws-a' }),
      appendAudit: (event) => { audits.push(event); return true },
      restorePreset: () => {},
    }
    const result = proposeAgentPresetDefaultFromAgent(
      { sessionId: 'proposal-default', workspaceSlug: 'ws-a', source: 'user', allowedOperations: ['propose_default'], userMessage: '把默认候选预设设为默认' },
      { presetId: target.id, presetScope: 'workspace' },
    )
    clearPendingPresetChange('proposal-default')
    expect(() => commitPendingAgentPresetChangeFromAgent(
      { sessionId: 'proposal-default', workspaceSlug: 'ws-a', source: 'user', allowedOperations: ['commit_change'], userMessage: '确认' },
      dependencies,
    )).toThrow('没有可提交')
    expect(audits).toEqual([])
    expect(result.proposalId).toBeString()
  })

  test('Given an audit failure after update When committing Then the original snapshot is restored', () => {
    const target = createAgentPreset('ws-a', { name: '审计回滚', description: '原始' })
    let restored: AgentPreset | undefined
    let auditCount = 0
    const dependencies: PresetChangeOperationDependencies = {
      getPreset: () => target,
      getPresetSnapshot: () => target,
      getDefaultReference: () => ({ presetId: 'standard', presetScope: 'builtin-meta' }),
      updatePreset: () => ({ ...target, description: '已改', updatedAt: target.updatedAt + 1 }),
      setDefault: (_workspace, reference) => reference,
      appendAudit: () => { auditCount += 1; return auditCount < 1 },
      restorePreset: (_workspace, snapshot) => { restored = snapshot },
    }
    proposeAgentPresetUpdateFromAgent(
      { sessionId: 'proposal-audit', workspaceSlug: 'ws-a', source: 'user', allowedOperations: ['propose_update'], userMessage: '修改审计回滚预设' },
      { presetId: target.id, presetScope: 'workspace' },
      { description: '已改' },
    )
    expect(() => commitPendingAgentPresetChangeFromAgent(
      { sessionId: 'proposal-audit', workspaceSlug: 'ws-a', source: 'user', allowedOperations: ['commit_change'], userMessage: '确认' },
      dependencies,
    )).toThrow('无法记录预设变更审计')
    expect(restored).toEqual(target)
  })
})

describe('Agent preset creation operations', () => {
  test('Given visible presets When summarized Then copy receives a stable scope-aware reference', () => {
    const presets = listAgentPresets('ws-a')
    const builtin = summarizeAgentPreset(presets.find((preset) => preset.id === 'minimal')!, 'standard')
    expect(builtin).toMatchObject({
      id: 'minimal',
      scope: 'builtin-meta',
      presetReference: { presetId: 'minimal', presetScope: 'builtin-meta' },
    })

    const created = createWorkspacePresetFromAgent(
      { sessionId: 'session-summary', workspaceSlug: 'ws-a', source: 'user', allowedOperations: ['create'] },
      { name: '摘要测试', description: '' },
    ).preset
    expect(summarizeAgentPreset(created, 'standard')).toMatchObject({
      id: created.id,
      scope: 'workspace',
      presetReference: { presetId: created.id, presetScope: 'workspace', workspaceSlug: 'ws-a' },
    })
  })

  test('Given an allowed interactive create When executed Then it creates without applying or changing default', () => {
    const defaultBefore = getDefaultPresetId('ws-a')
    const result = createWorkspacePresetFromAgent(
      { sessionId: 'session-create', workspaceSlug: 'ws-a', source: 'user', allowedOperations: ['create'] },
      { name: '代码审查', description: '只用于审查', skillSlugs: [], mcpServerNames: [] },
    )

    expect(result).toMatchObject({
      operation: 'create',
      scope: 'workspace',
      currentSessionChanged: false,
      defaultChanged: false,
      nextStep: 'created_not_applied',
    })
    expect(result.preset.name).toBe('代码审查')
    expect(result.preset.skillSlugs).toEqual([])
    expect(result.preset.mcpServerNames).toEqual([])
    expect(getDefaultPresetId('ws-a')).toBe(defaultBefore)
  })

  test('Given an allowed interactive copy When executed Then it preserves the source policy without applying it', () => {
    const result = copyWorkspacePresetFromAgent(
      { sessionId: 'session-copy', workspaceSlug: 'ws-a', source: 'user', allowedOperations: ['copy'] },
      { presetId: 'minimal', presetScope: 'builtin-meta' },
      '快速问答',
    )

    expect(result).toMatchObject({
      operation: 'copy',
      scope: 'workspace',
      currentSessionChanged: false,
      defaultChanged: false,
    })
    expect(result.preset.name).toBe('快速问答')
    expect(result.preset.sourcePresetId).toBe('minimal')
    expect(result.preset.sourcePresetScope).toBe('builtin-meta')
    expect(result.preset.disabledToolGroups).toEqual([...AGENT_PRESET_TOOL_GROUPS])
    expect(listAgentPresets('ws-a').some((preset) => preset.id === result.preset.id)).toBe(true)
  })

  test('Given effective presets When compared Then elevation and restriction are explicit', () => {
    const minimal = listAgentPresets('ws-a').find((preset) => preset.id === 'minimal')!
    const standard = listAgentPresets('ws-a').find((preset) => preset.id === 'standard')!
    const elevated = diffAgentPresetCapabilities(
      minimal,
      { presetId: 'minimal', presetScope: 'builtin-meta' },
      standard,
      { presetId: 'standard', presetScope: 'builtin-meta' },
    )
    expect(elevated.enabledToolGroups).toEqual([...AGENT_PRESET_TOOL_GROUPS])
    expect(elevated.elevatesCapabilities).toBe(true)
    expect(elevated.subagentsEnabled).toBe(true)

    const restricted = diffAgentPresetCapabilities(
      standard,
      { presetId: 'standard', presetScope: 'builtin-meta' },
      minimal,
      { presetId: 'minimal', presetScope: 'builtin-meta' },
    )
    expect(restricted.disabledToolGroups).toEqual([...AGENT_PRESET_TOOL_GROUPS])
    expect(restricted.enabledToolGroups).toEqual([])
    expect(restricted.elevatesCapabilities).toBe(false)
  })

  test('Given an explicit switch intent When executed Then it audits and applies only to the next turn', () => {
    let current = { presetId: 'minimal', presetScope: 'builtin-meta' as const }
    const events: Array<{ type: string; elevatesCapabilities: boolean }> = []
    const dependencies: SwitchOperationDependencies = {
      getCurrentReference: () => current,
      rebind: (_sessionId, reference) => { current = reference as typeof current },
      appendAudit: (event) => { events.push(event); return true },
    }
    const result = switchSessionPresetFromAgent(
      {
        sessionId: 'session-switch',
        workspaceSlug: 'ws-a',
        source: 'user',
        allowedOperations: ['switch'],
        currentPresetReference: current,
        userMessage: '把当前会话切换到标准预设',
      },
      { presetId: 'standard', presetScope: 'builtin-meta' },
      dependencies,
    )

    expect(result).toMatchObject({
      operation: 'switch',
      currentSessionChanged: true,
      currentTurnChanged: false,
      effectiveFrom: 'next_turn',
      authorization: 'explicit_user_intent',
      capabilityDiff: { elevatesCapabilities: true },
    })
    expect(current.presetId).toBe('standard')
    expect(events.map((event) => event.type)).toEqual(['preset_change_requested', 'preset_changed'])
    expect(events.every((event) => event.elevatesCapabilities)).toBe(true)
  })

  test('Given a stale session snapshot or failed audit When switching Then it rejects or rolls back', () => {
    expect(() => switchSessionPresetFromAgent(
      {
        sessionId: 'session-stale', workspaceSlug: 'ws-a', source: 'user', allowedOperations: ['switch'],
        currentPresetReference: { presetId: 'minimal', presetScope: 'builtin-meta' },
        userMessage: '切换到标准预设',
      },
      { presetId: 'standard', presetScope: 'builtin-meta' },
      {
        getCurrentReference: () => ({ presetId: 'code', presetScope: 'builtin-meta' }),
        rebind: () => { throw new Error('should not run') },
        appendAudit: () => true,
      },
    )).toThrow('会话预设已在当前轮期间变化')

    expect(() => switchSessionPresetFromAgent(
      {
        sessionId: 'session-target-mismatch', workspaceSlug: 'ws-a', source: 'user', allowedOperations: ['switch'],
        currentPresetReference: { presetId: 'minimal', presetScope: 'builtin-meta' },
        userMessage: '切换到代码预设',
      },
      { presetId: 'standard', presetScope: 'builtin-meta' },
      {
        getCurrentReference: () => ({ presetId: 'minimal', presetScope: 'builtin-meta' }),
        rebind: () => { throw new Error('should not run') },
        appendAudit: () => true,
      },
    )).toThrow('没有明确指定目标预设“标准”')

    let current = { presetId: 'minimal', presetScope: 'builtin-meta' as const }
    let auditCount = 0
    expect(() => switchSessionPresetFromAgent(
      {
        sessionId: 'session-rollback', workspaceSlug: 'ws-a', source: 'user', allowedOperations: ['switch'],
        currentPresetReference: current,
        userMessage: '切换到标准预设',
      },
      { presetId: 'standard', presetScope: 'builtin-meta' },
      {
        getCurrentReference: () => current,
        rebind: (_sessionId, reference) => { current = reference as typeof current },
        appendAudit: () => { auditCount += 1; return auditCount === 1 },
      },
    )).toThrow('无法记录预设切换审计')
    expect(current.presetId).toBe('minimal')
  })

  test('Given a non-user source or unmatched intent When executed Then it rejects before writing', () => {
    expect(() => createWorkspacePresetFromAgent(
      { sessionId: 'session-auto', workspaceSlug: 'ws-a', source: 'automation', allowedOperations: ['create'] },
      { name: '不应创建', description: '' },
    )).toThrow('只有用户发起的交互会话')

    expect(() => createWorkspacePresetFromAgent(
      { sessionId: 'session-no-intent', workspaceSlug: 'ws-a', source: 'user', allowedOperations: [] },
      { name: '不应创建', description: '' },
    )).toThrow('当前用户消息没有明确请求创建预设')

    expect(() => copyWorkspacePresetFromAgent(
      { sessionId: 'session-copy-mismatch', workspaceSlug: 'ws-a', source: 'user', allowedOperations: ['copy'] },
      { presetId: 'minimal', presetScope: 'workspace' },
    )).toThrow('当前工作区不可用的源预设')

    expect(listAgentPresets('ws-a')).toHaveLength(4)
  })
})
