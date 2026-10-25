import { describe, expect, mock, test } from 'bun:test'
import { DOCUMENT_ANCHOR_PATTERN } from '@profer/shared'
import { mkdtempSync, rmSync } from 'node:fs'
import { homedir, tmpdir } from 'node:os'
import { join } from 'node:path'

// prompt builder 经 config-paths 间接导入 Electron；Bun 单测需提供最小主进程 mock。
mock.module('./workspace-mcp-config', () => ({
  getWorkspaceMcpConfig: () => ({
    servers: {
      allowed: { type: 'http', enabled: true, url: 'https://allowed.example.test/mcp' },
      denied: { type: 'stdio', enabled: true, command: '/private/denied-mcp', args: ['--secret'] },
      disabled: { type: 'http', enabled: false, url: 'https://disabled.example.test/mcp' },
    },
  }),
}))

mock.module('electron', () => ({
  BrowserWindow: { getAllWindows: () => [], fromWebContents: () => undefined },
  app: { getPath: () => '', getName: () => 'profer-dev', isPackaged: false },
  clipboard: { readText: () => '', writeText: () => undefined },
  dialog: {},
  nativeImage: {},
  nativeTheme: {},
  Notification: class {},
  powerMonitor: {},
  powerSaveBlocker: {},
  safeStorage: {},
  screen: {},
  shell: {},
  net: {},
  protocol: {},
  session: {},
  systemPreferences: {},
  View: class {},
  WebContentsView: class {},
}))

const { buildSystemPrompt, buildDynamicContext, appendSystemPromptSections } = await import('./agent-prompt-builder')
const { buildPiTaskPrompt } = await import('./pi-task-prompt')
const { getConfigDirName, resolveConfigDir } = await import('./config-paths')

describe('buildSystemPrompt', () => {
  test('默认使用求实姿态并保留不可变执行底线', () => {
    const prompt = buildSystemPrompt({
      workspaceName: 'Demo',
      workspaceSlug: 'demo-workspace',
      sessionId: 'session-123',
      permissionMode: 'auto',
    })

    expect(prompt).toContain('## Epistemic Stance: Grounded')
    expect(prompt).toContain('converge on a clear recommended conclusion')
    expect(prompt).toContain('## Immutable Execution Bottom Lines')
    expect(prompt).toContain('Never fabricate tool calls')
    expect(prompt).not.toContain('## Epistemic Stance: Open')
    // 反和稀泥契约常驻，且不再保留「不假装存在唯一答案」这类回避表态许可
    expect(prompt).toContain('## Expression & Judgment')
    expect(prompt).toContain('Lead with the judgment')
    expect(prompt).toContain('No formulaic hedging')
    expect(prompt).toContain('Take a stance even when diverging')
    expect(prompt).not.toContain('pretend a unique answer exists')
  })

  test('索引模式使用 conversation_memory 并移除 transcript 路径与 grep 指引', () => {
    const prompt = buildSystemPrompt({
      workspaceName: 'Demo',
      workspaceSlug: 'demo-workspace',
      sessionId: 'session-123',
      permissionMode: 'auto',
      contextMode: 'index',
    })

    expect(prompt).toContain('<conversation_memory>')
    expect(prompt).toContain('<conversation_evidence>')
    expect(prompt).toContain('<recent_context>')
    expect(prompt).not.toContain('<conversation_transcript>')
    expect(prompt).not.toContain('Transcripts are located directly at')
    expect(prompt).not.toContain('.system_generated/logs/transcript.jsonl')
    expect(prompt).not.toContain('Search subagents by grepping')
  })

  test('经典模式保留 conversation_transcript 与原有 transcript 检索指引', () => {
    const prompt = buildSystemPrompt({
      workspaceName: 'Demo',
      workspaceSlug: 'demo-workspace',
      sessionId: 'session-123',
      permissionMode: 'auto',
      contextMode: 'classic',
    })

    expect(prompt).toContain('<conversation_transcript>')
    expect(prompt).toContain('transcript.jsonl')
    expect(prompt).not.toContain('<conversation_memory>')
  })

  test('开放认识论允许暂定与创作自由，但必须表态且不放宽执行真实性', () => {
    const prompt = buildSystemPrompt({
      workspaceName: 'Demo',
      workspaceSlug: 'demo-workspace',
      sessionId: 'session-123',
      permissionMode: 'auto',
      epistemicMode: 'open',
      isPiRuntime: true,
    })

    expect(prompt).toContain('## Epistemic Stance: Open ("Absolute Correctness" Disabled)')
    expect(prompt).toContain('Provisional is allowed, but you must take a position')
    expect(prompt).toContain('subjective, exaggerated, symbolic, fictional')
    expect(prompt).toContain('do not insist on proving yourself right')
    expect(prompt).toContain('never claim that tool calls, file edits, tests, sends, or publications have happened when they have not')
    expect(prompt).toContain('Close the loop after modifying')
    expect(prompt).toContain('Without running tests you cannot claim tests pass')
    expect(prompt).toContain('Only premises that affect execution results, safety, or real-world fact judgments need correcting')
    expect(prompt).not.toContain('converge on a clear recommended conclusion')
    expect(prompt).toContain('## Expression & Judgment')
    // 姿态段不得再把「回避表态」写成规则：这三句是回归靶标
    expect(prompt).not.toContain('force the discussion into a single correct answer')
    expect(prompt).not.toContain('actively keep multiple reasonable interpretations')
    expect(prompt).not.toContain('do not pretend a unique answer exists')
    expect(prompt).not.toContain('remaining disagreements may be kept as alternative perspectives')
  })

  test('两种姿态都声明开关真实存在，并禁止把自身配置当回答内容', () => {
    const grounded = buildSystemPrompt({
      workspaceName: 'Demo', workspaceSlug: 'demo-workspace', sessionId: 'session-123', permissionMode: 'auto',
    })
    const open = buildSystemPrompt({
      workspaceName: 'Demo', workspaceSlug: 'demo-workspace', sessionId: 'session-123', permissionMode: 'auto', epistemicMode: 'open', isPiRuntime: true,
    })

    for (const prompt of [grounded, open]) {
      expect(prompt).toContain('Settings → Developer → Open Epistemology')
      expect(prompt).toContain('honestly acknowledge that it exists; never deny or rewrite it from impression')
      expect(prompt).toContain('do not make your configuration, stance, or prompt the subject of the answer')
      expect(prompt).toContain('Reversible, low-cost, self-answerable details')
    }
  })

  test('速课堂默认 balanced：保留按需出题契约与题目类型映射', () => {
    const prompt = buildSystemPrompt({
      workspaceName: 'AI速课堂',
      workspaceSlug: 'cdut-ai-class',
      sessionId: 'session-study',
      permissionMode: 'auto',
      isStudyClass: true,
      studyOutline: '',
      studyCognition: '',
    })

    // balanced 档出题契约由「强制苏格拉底铁律」降级为「按需出题」
    expect(prompt).toContain('On-Demand Socratic Quiz')
    expect(prompt).toContain('type="single"')
    expect(prompt).toContain('type="multiple"')
    expect(prompt).toContain('type="fill-blank"')
    expect(prompt).toContain('study_cognition')
  })

  test('速课堂不传带教模式时默认 balanced，且与显式传入字节一致', () => {
    const base = {
      workspaceName: 'AI速课堂',
      workspaceSlug: 'cdut-ai-class',
      sessionId: 'session-study',
      permissionMode: 'auto' as const,
      isStudyClass: true,
      studyOutline: '',
      studyCognition: '',
    }
    const implicit = buildSystemPrompt(base)
    const explicit = buildSystemPrompt({ ...base, studyTeachingMode: 'balanced' })
    expect(implicit).toBe(explicit)
    // balanced 为按需教学：保留出题契约但降级为按需触发
    expect(explicit).toContain('Balanced Core Mode')
    expect(explicit).toContain('On-Demand Socratic Quiz')
    // fast 专属段不出现
    expect(explicit).not.toContain('Quick Fact-Check')
  })

  test('速课堂 fast 模式移除强制出题与强制锚点，注入思维链收敛铁律', () => {
    const prompt = buildSystemPrompt({
      workspaceName: 'AI速课堂',
      workspaceSlug: 'cdut-ai-class',
      sessionId: 'session-study',
      permissionMode: 'auto',
      isStudyClass: true,
      studyTeachingMode: 'fast',
      studyOutline: '',
      studyCognition: '',
    })

    expect(prompt).toContain('Quick Fact-Check')
    // 严禁弹出题目打断：苏格拉底强制出题契约整段移除
    expect(prompt).not.toContain('MUST** call `AskUserQuestion`')
    expect(prompt).not.toContain('Socratic Interactive Quiz')
    // 双轨锚点降级为可选，强制段移除
    expect(prompt).not.toContain('Mandatory Dual-Track Location Capsules')
    expect(prompt).toContain('Thought Brevity')
    // 每讲完一个概念就出题的方法论与认知档案强制回写一并移除
    expect(prompt).not.toContain('Micro-Pacing & Continuous Verification')
    expect(prompt).not.toContain('Continuous Sync')
  })

  test('速课堂 strict 模式完整保留双轨锚点与苏格拉底铁律', () => {
    const prompt = buildSystemPrompt({
      workspaceName: 'AI速课堂',
      workspaceSlug: 'cdut-ai-class',
      sessionId: 'session-study',
      permissionMode: 'auto',
      isStudyClass: true,
      studyTeachingMode: 'strict',
      studyOutline: '',
      studyCognition: '',
    })

    expect(prompt).toContain('AI Speed Class Tutoring Iron Rules')
    expect(prompt).toContain('Mandatory Dual-Track Location Capsules')
    expect(prompt).toContain('Socratic Interactive Quiz')
    expect(prompt).toContain('MUST** call `AskUserQuestion`')
    expect(prompt).toContain('study_cognition')
    expect(prompt).toContain('Micro-Pacing & Continuous Verification')
    expect(prompt).not.toContain('Quick Fact-Check')
  })

  test('普通会话提示词包含 /grill-me 交互追问协议', () => {
    const prompt = buildSystemPrompt({
      workspaceName: 'Demo',
      workspaceSlug: 'demo-workspace',
      sessionId: 'session-123',
      permissionMode: 'auto',
    })

    expect(prompt).toContain('/grill-me is an INTERACTIVE interview command')
    expect(prompt).toContain('ONE decision at a time')
  })

  test('速课堂禁用产品能力组时不渲染「当前预设已关闭的能力」段，常规会话保留', () => {
    const disabledToolGroups = ['browser', 'automation', 'collaboration', 'clipboard'] as const

    const studyPrompt = buildSystemPrompt({
      workspaceName: 'AI速课堂',
      workspaceSlug: 'cdut-ai-class',
      sessionId: 'session-123',
      permissionMode: 'auto',
      isStudyClass: true,
      disabledToolGroups: [...disabledToolGroups],
      disabledTools: ['create_skin'],
    })
    expect(studyPrompt).not.toContain('## Capabilities Disabled by the Current Preset')

    const normalPrompt = buildSystemPrompt({
      workspaceName: 'Demo',
      workspaceSlug: 'demo-workspace',
      sessionId: 'session-123',
      permissionMode: 'auto',
      disabledToolGroups: [...disabledToolGroups],
    })
    expect(normalPrompt).toContain('## Capabilities Disabled by the Current Preset')
  })

  test('Pi 按需裁剪后仍保留认识论姿态与不可变底线', () => {
    const basePrompt = buildSystemPrompt({
      workspaceName: 'Demo',
      workspaceSlug: 'demo-workspace',
      sessionId: 'session-123',
      permissionMode: 'auto',
      epistemicMode: 'open',
      isPiRuntime: true,
    })
    const prompt = buildPiTaskPrompt({
      basePrompt,
      userMessage: '写三个不同风格的产品概念。',
      toolNames: [],
    })

    expect(prompt).toContain('## Epistemic Stance: Open')
    expect(prompt).toContain('## Immutable Execution Bottom Lines')
    expect(prompt).toContain('Never fabricate tool calls')
    // Pi 按需裁剪不得丢掉反和稀泥契约（用户实测跑的就是 Pi）
    expect(prompt).toContain('## Expression & Judgment')
    expect(prompt).toContain('Lead with the judgment')
  })

  test('普通会话默认不注入 PPT 专用长门禁', () => {
    const prompt = buildSystemPrompt({
      workspaceName: 'Demo',
      workspaceSlug: 'demo-workspace',
      sessionId: 'session-123',
      permissionMode: 'auto',
      pptCapabilityActive: false,
    })
    expect(prompt).not.toContain('PPT visual delivery gate')
    expect(prompt).not.toContain('inspect_deck_sources')
    expect(prompt).not.toContain('PptxScrollViewer')
    expect(prompt).toContain('open_file_preview')
    expect(prompt).toContain('inspect_file_preview')
    expect(prompt).toContain('Never create a `Preview.html`')
  })

  test('PPT 能力激活后不注入已移除的快速生成通道或治理工作流', () => {
    const prompt = buildSystemPrompt({
      workspaceName: 'Demo', workspaceSlug: 'demo-workspace', sessionId: 'session-123', permissionMode: 'auto', pptCapabilityActive: true,
    })
    for (const forbidden of ['generate_pptx_fast', 'fast PPTX generation', 'Deck Spec', 'Deck Project', 'Deck Brief', 'inspect_deck_sources', 'create_deck_project', 'compile_deck_project', 'confirm the Deck Brief', 'assetRefs']) {
      expect(prompt).not.toContain(forbidden)
    }
  })

  test('工作区会话恢复指向 CDUT Studio workspace profile，而非用户项目指令文件', () => {
    const slug = 'demo-workspace'
    const sessionId = 'session-123'
    const prompt = buildSystemPrompt({
      workspaceName: 'Demo',
      workspaceSlug: slug,
      sessionId,
      permissionMode: 'bypassPermissions',
    })

    const workspaceRoot = join(resolveConfigDir(), 'agent-workspaces', slug)
    const workspaceProfile = join(workspaceRoot, 'workspace-profile.md')
    expect(prompt).toContain(`**CDUT Studio workspace profile**: ${workspaceProfile}`)
    expect(prompt).toContain(`③ the CDUT Studio workspace profile (\`${workspaceProfile}\``)
    expect(prompt).toContain('Legacy CDUT Studio workspace profile (compat reads only)')
    expect(prompt).toContain('`AGENTS.md` / `CLAUDE.md` in projects are user assets')
    expect(prompt).toContain('never read the relative path `CLAUDE.md` under the current cwd when it does not exist')
    expect(prompt).not.toContain('maintain CLAUDE.md at the workspace root')
    expect(prompt).toContain(join(workspaceRoot, 'workspace-files', '.context'))
    expect(prompt).toContain(join(workspaceRoot, '.cdutai', 'memory', 'MEMORY.md'))
    expect(prompt).not.toContain('CDUT Studio 脱胎于开源项目')
  })

  test('PROFER_CONFIG_DIR 覆盖时，提示中的工作区路径跟随隔离根目录', () => {
    const isolatedRoot = mkdtempSync(join(tmpdir(), 'profer-prompt-paths-'))
    const previous = process.env.PROFER_CONFIG_DIR
    process.env.PROFER_CONFIG_DIR = isolatedRoot
    try {
      const slug = 'demo-workspace'
      const prompt = buildSystemPrompt({
        workspaceName: 'Demo',
        workspaceSlug: slug,
        sessionId: 'session-123',
        permissionMode: 'bypassPermissions',
      })

      const workspaceRoot = join(isolatedRoot, 'agent-workspaces', slug)
      expect(prompt).toContain(`**CDUT Studio workspace profile**: ${join(workspaceRoot, 'workspace-profile.md')}`)
      expect(prompt).toContain(join(workspaceRoot, 'workspace-files', '.context'))
      expect(prompt).not.toContain(join(homedir(), '.cdutai-dev', 'agent-workspaces', slug))
    } finally {
      if (previous === undefined) delete process.env.PROFER_CONFIG_DIR
      else process.env.PROFER_CONFIG_DIR = previous
      rmSync(isolatedRoot, { recursive: true, force: true })
    }
  })

  test('Context 恢复先发现目录内容，不默认读取或创建 note.md', () => {
    const prompt = buildSystemPrompt({
      workspaceName: 'Demo',
      workspaceSlug: 'demo-workspace',
      sessionId: 'session-123',
      permissionMode: 'bypassPermissions',
      isPiRuntime: true,
    })

    expect(prompt).toContain('list both directories first; read only files that **actually exist and relate to the current task**')
    expect(prompt).toContain('Never create or read `note.md`/`todo.md` by default')
    expect(prompt).toContain('CDUT Studio Memory')
    expect(prompt).not.toContain('按主题命名的 Markdown — 研究与分析输出')
    expect(prompt).toContain('Retrieve and read on demand; never create or read a generic `note.md` by default')
    expect(prompt).not.toContain('会话级 `.context/`（note.md、todo.md）')
  })

  test('Pi 包含专属执行说明，Claude 不获得 Pi 专属段落', () => {
    const piPrompt = buildSystemPrompt({
      workspaceName: 'Demo',
      workspaceSlug: 'demo-workspace',
      sessionId: 'session-123',
      permissionMode: 'bypassPermissions',
      isPiRuntime: true,
    })
    const claudePrompt = buildSystemPrompt({
      workspaceName: 'Demo',
      workspaceSlug: 'demo-workspace',
      sessionId: 'session-123',
      permissionMode: 'bypassPermissions',
      isPiRuntime: false,
    })

    expect(piPrompt).toContain('minimal relevant verification')
    // 验证闭环责任由 Agent 自身承担，系统不再自动追加续轮
    expect(piPrompt).toContain('the system will not append verification rounds')
    expect(piPrompt).not.toContain('automatically append a continuation turn that only performs minimal verification')
    // 工具名按 runtime 适配：Pi 带 mcp__ 前缀，Claude 用 in-process MCP 裸名
    expect(piPrompt).toContain('mcp__task-graph__proma_task_create')
    expect(piPrompt).toContain('mcp__agent-presets__preset_list')
    expect(piPrompt).not.toContain('mcp__agent-presets__preset_create')
    expect(piPrompt).not.toContain('use `proma_task_create` to create subtasks')
    expect(claudePrompt).toContain('use `proma_task_create` to create subtasks')
    expect(claudePrompt).toContain('These write entry points are only registered for a turn when the current user message explicitly requests the corresponding operation')
    expect(claudePrompt).toContain('Update and set-as-default first return an impact summary and are committed only after the user explicitly confirms')
    expect(claudePrompt).not.toContain('mcp__agent-presets__preset_create')
    expect(piPrompt).toContain('do not wait for the SDK to persist automatically')
    expect(piPrompt).toContain('**Readable & writable**')
    expect(piPrompt).toContain('`.cdutai/memory/MEMORY.md`')
    expect(piPrompt).not.toContain('访问工作区根目录的 `CLAUDE.md`')
    expect(piPrompt).toContain('workspace-profile.md')
    expect(piPrompt).toContain('Closing write-back')
    expect(piPrompt).toContain('never write one-off weak signals, temporary processes, or unverified inferences')
    expect(piPrompt).not.toContain('不要写入长期记忆文件')
    expect(claudePrompt).not.toContain('### Pi Runtime Autonomous Execution Guidelines')
    // Claude runtime 也有专属段落，且明确要求 Agent 自行完成验证闭环
    expect(claudePrompt).toContain('## Claude Agent Runtime')
    expect(claudePrompt).toContain('the system will not append verification rounds')
    expect(claudePrompt).not.toContain('automatically append a continuation turn that only performs verification')
    expect(piPrompt).not.toContain('## Claude Agent Runtime')
  })

  test('规划 Todo 指引按 runtime 使用正确工具名并要求并发保护', () => {
    const piPrompt = buildSystemPrompt({
      workspaceName: 'Demo',
      workspaceSlug: 'demo-workspace',
      sessionId: 'session-123',
      permissionMode: 'auto',
      isPiRuntime: true,
    })
    const claudePrompt = buildSystemPrompt({
      workspaceName: 'Demo',
      workspaceSlug: 'demo-workspace',
      sessionId: 'session-123',
      permissionMode: 'auto',
      isPiRuntime: false,
    })

    expect(piPrompt).toContain('`mcp__planning__create_todo`')
    expect(piPrompt).toContain('`mcp__planning__update_todo`')
    expect(piPrompt).toContain('`mcp__planning__create_calendar_event`')
    expect(piPrompt).toContain('do not proactively ask about Google Calendar, Outlook')
    expect(claudePrompt).toContain('`create_todo`')
    expect(claudePrompt).toContain('`update_todo`')
    expect(claudePrompt).toContain('`create_calendar_event`')
    expect(claudePrompt).not.toContain('`mcp__planning__create_todo`')
    expect(piPrompt).toContain('`expectedUpdatedAt`')
    expect(piPrompt).toContain('Todo deletion is performed by the user in the Planning Center')
  })

  test('预设创建/复制提示词只描述主进程意图 gate 实际开放的入口', () => {
    const createPrompt = buildSystemPrompt({
      workspaceName: 'Demo',
      workspaceSlug: 'demo-workspace',
      sessionId: 'session-create',
      permissionMode: 'auto',
      isPiRuntime: true,
      allowedPresetOperations: ['create'],
    })
    expect(createPrompt).toContain('`mcp__agent-presets__preset_create` create a workspace preset')
    expect(createPrompt).not.toContain('`mcp__agent-presets__preset_copy` copy as a workspace preset')
    expect(createPrompt).toContain('Create or copy does not change the current session or default preset')

    const copyPrompt = buildSystemPrompt({
      workspaceName: 'Demo',
      workspaceSlug: 'demo-workspace',
      sessionId: 'session-copy',
      permissionMode: 'auto',
      isPiRuntime: false,
      allowedPresetOperations: ['copy'],
    })
    expect(copyPrompt).toContain('`preset_copy` copy as a workspace preset')
    expect(copyPrompt).not.toContain('`preset_create` create a workspace preset')
    expect(copyPrompt).not.toContain('mcp__agent-presets__preset_copy')

    const switchPrompt = buildSystemPrompt({
      workspaceName: 'Demo',
      workspaceSlug: 'demo-workspace',
      sessionId: 'session-switch',
      permissionMode: 'auto',
      isPiRuntime: true,
      allowedPresetOperations: ['switch'],
    })
    expect(switchPrompt).toContain('`mcp__agent-presets__preset_switch_session` switch the current session preset')
    expect(switchPrompt).toContain("the current turn's capability snapshot stays unchanged, taking effect the next turn")
    expect(switchPrompt).not.toContain('`mcp__agent-presets__preset_create` create a workspace preset')
  })

  test('预设 Level 2 变更先提案后确认，确认轮只提交冻结提案', () => {
    const updatePrompt = buildSystemPrompt({
      workspaceName: 'Demo', workspaceSlug: 'demo-workspace', sessionId: 'session-update', permissionMode: 'auto',
      isPiRuntime: false, allowedPresetOperations: ['propose_update'],
    })
    expect(updatePrompt).toContain('`preset_propose_update` propose a workspace preset update')
    expect(updatePrompt).not.toContain('`preset_commit_change` commit a confirmed preset change')

    const commitPrompt = buildSystemPrompt({
      workspaceName: 'Demo', workspaceSlug: 'demo-workspace', sessionId: 'session-commit', permissionMode: 'auto',
      isPiRuntime: true, allowedPresetOperations: ['commit_change'],
    })
    expect(commitPrompt).toContain('`mcp__agent-presets__preset_commit_change` commit a confirmed preset change')
    expect(commitPrompt).not.toContain('`mcp__agent-presets__preset_propose_update` propose a workspace preset update')
  })

  test('极简预设关闭全部产品能力时，Prompt 只保留基础工具规则与预设切换出口', () => {
    const disabledToolGroups = ['task-graph', 'memory', 'collaboration', 'automation', 'browser', 'clipboard', 'preview', 'image', 'web', 'ppt-materials'] as const
    const minimalPrompt = buildSystemPrompt({
      workspaceName: 'Demo',
      workspaceSlug: 'demo-workspace',
      sessionId: 'session-123',
      permissionMode: 'auto',
      presetName: '极简',
      suppressSections: ['subagents', 'memory', 'task-graph', 'automation'],
      disabledToolGroups,
      isPiRuntime: true,
    })
    // 隐藏：任务图、委派、记忆、规划及所有增强型产品能力说明。
    expect(minimalPrompt).not.toContain('proma_task_create')
    expect(minimalPrompt).not.toContain('## SubAgent Delegation Policy')
    expect(minimalPrompt).not.toContain('## CDUT Studio Knowledge Maintenance Architecture')
    expect(minimalPrompt).not.toContain('### Pi Runtime & File Memory')
    expect(minimalPrompt).not.toContain('create_todo')
    expect(minimalPrompt).not.toContain('## CDUT Studio Managed Browser')
    expect(minimalPrompt).not.toContain('`inspect_preview`')
    expect(minimalPrompt).not.toContain('`generate_image`')
    expect(minimalPrompt).not.toContain('`WebSearch`')
    // 保留：基础工具规则、预设岗位段落与切回其它预设的唯一出口。
    expect(minimalPrompt).toContain('explicitly declare an unambiguous language tag')
    expect(minimalPrompt).toContain('## Agent Preset (Role) System')
    expect(minimalPrompt).toContain('Current session preset: **极简**')
    expect(minimalPrompt).toContain('preset_list')

    const standardPrompt = buildSystemPrompt({
      workspaceName: 'Demo',
      workspaceSlug: 'demo-workspace',
      sessionId: 'session-123',
      permissionMode: 'auto',
      isPiRuntime: true,
    })
    // 标准预设无 suppress：全部段落在场
    expect(standardPrompt).toContain('proma_task_create')
    expect(standardPrompt).toContain('## SubAgent Delegation Policy')
    expect(standardPrompt).toContain('presetReference')
    expect(standardPrompt).toContain("When omitted, the sub-agent inherits the current parent session's stable preset reference")
    expect(standardPrompt).toContain('## CDUT Studio Knowledge Maintenance Architecture')
    expect(standardPrompt).toContain('### Pi Runtime & File Memory')
  })

  test('automation suppress 隐藏交互规范定时任务条目（三层一致）', () => {
    const withAutomation = buildSystemPrompt({
      workspaceName: 'Demo',
      workspaceSlug: 'demo-workspace',
      sessionId: 'session-123',
      permissionMode: 'auto',
      isPiRuntime: true,
    })
    expect(withAutomation).toContain('7. **Scheduled tasks (Automation)**')
    expect(withAutomation).toContain('Bash cron')

    const withoutAutomation = buildSystemPrompt({
      workspaceName: 'Demo',
      workspaceSlug: 'demo-workspace',
      sessionId: 'session-123',
      permissionMode: 'auto',
      suppressSections: ['automation'],
      isPiRuntime: true,
    })
    expect(withoutAutomation).not.toContain('7. **Scheduled tasks (Automation)**')
    expect(withoutAutomation).not.toContain('Bash cron')
    expect(withoutAutomation).not.toContain('create_todo')
    expect(withoutAutomation).not.toContain('create_calendar_event')
    // 其余交互规范条目不受影响
    expect(withoutAutomation).toContain('8. **Sending existing local images**')
    expect(withoutAutomation).toContain('9. **AI image generation**')
    expect(withoutAutomation).toContain('`generate_image`')
    expect(withoutAutomation).toContain('Never fake images with code, ASCII art')
    expect(withoutAutomation).toContain("path relative to the current session cwd")
    expect(withoutAutomation).toContain('skin wallpaper')
    expect(withoutAutomation).toContain('A single assets image must not exceed 4 MB')
    expect(withoutAutomation).not.toContain('10. **PPT visual delivery gate**')
    expect(withoutAutomation).toContain('send_local_image')
    expect(withoutAutomation).toContain('automatically attaches validated images to the current reply')
    expect(withoutAutomation).not.toContain('PROMA_IMAGE_ATTACHMENT')
    expect(withoutAutomation).toContain('6. **Self-check habit**')
  })

  test('Pi composer 静态裁剪：仅按工具挂载决定低频 SOP，且不随用户文本变化', () => {
    const basePrompt = buildSystemPrompt({
      workspaceName: 'Demo',
      workspaceSlug: 'demo-workspace',
      sessionId: 'session-123',
      permissionMode: 'auto',
      isPiRuntime: true,
      pptCapabilityActive: true,
    })

    // Tier 0：未挂载任何产品工具 → 低频 SOP 全部裁掉，核心规则与常驻知识治理保留。
    const tier0 = buildPiTaskPrompt({
      basePrompt,
      userMessage: '检查这个 TypeScript 项目的类型错误。',
      toolNames: [],
    })
    expect(tier0).toContain('## Way of Working')
    expect(tier0).toContain('Close the loop after modifying')
    expect(tier0).toContain('Plan Mode File Path')
    expect(tier0).toContain('## CDUT Studio Knowledge Maintenance Architecture')
    expect(tier0).not.toContain('## CDUT Studio Managed Browser')
    expect(tier0).not.toContain('7. **Scheduled tasks (Automation)**')
    expect(tier0).not.toContain('## SubAgent Delegation Policy')
    expect(tier0).not.toContain('### Pi Runtime & File Memory')
    // 同一工具集合下，不同用户文本输出必须完全一致（前缀缓存友好）。
    const tier0OtherText = buildPiTaskPrompt({
      basePrompt,
      userMessage: '完全不同的提问：打开网页并做成幻灯片。',
      toolNames: [],
    })
    expect(tier0OtherText).toBe(tier0)

    // 挂载浏览器/PPT/自动化/协作/记忆工具 → 各自 SOP 恢复；文本变化仍不改变输出。
    const toolNames = [
      'BrowserObserve',
      'plan_ppt_visuals',
      'audit_ppt_delivery',
      'open_file_preview',
      'inspect_file_preview',
      'mcp__automation__create_automation',
      'mcp__collaboration__delegate_agent',
      'mcp__memory-archive__search_memory',
    ]
    const full = buildPiTaskPrompt({
      basePrompt,
      userMessage: '检查这个 TypeScript 项目的类型错误。',
      toolNames,
      pptCapabilityActive: true,
    })
    expect(full).toContain('## CDUT Studio Managed Browser')
    expect(full).toContain('7. **Scheduled tasks (Automation)**')
    expect(full).toContain('## SubAgent Delegation Policy')
    expect(full).toContain('### Pi Runtime & File Memory')
    // PPT 任务走 PptxGenJS Skill；已移除 generate_pptx_fast 的专属提示词。
    expect(full).not.toContain('fast PPTX generation')
    expect(full).not.toContain('generate_pptx_fast')

    const fullOtherText = buildPiTaskPrompt({
      basePrompt,
      userMessage: '访问 https://example.com 并做成 pptx 幻灯片。',
      toolNames,
      pptCapabilityActive: true,
    })
    expect(fullOtherText).toBe(full)
  })

  test('禁用 memory 时团队工作区不再注入团队记忆提示词', () => {
    const prompt = buildSystemPrompt({
      workspaceName: 'Team',
      workspaceSlug: 'team-ws',
      sessionId: 'session-123',
      permissionMode: 'auto',
      isTeamWorkspace: true,
      teamMemoryAvailable: false,
      isPiRuntime: true,
    })
    expect(prompt).not.toContain('## Team Shared Knowledge Memory')
    expect(prompt).not.toContain('mcp__team-memory__list_team_memories')
  })

  test('单工具裁剪时 Prompt 不描述已关闭的具体入口，但保留同组可用能力', () => {
    const prompt = buildSystemPrompt({
      workspaceName: 'Demo',
      workspaceSlug: 'demo-workspace',
      sessionId: 'session-123',
      permissionMode: 'auto',
      disabledTools: ['generate_image', 'send_local_image', 'BrowserPreviewOpen', 'WebSearch', 'WebFetch'],
    })
    expect(prompt).not.toContain('`generate_image`')
    expect(prompt).not.toContain('`send_local_image`')
    expect(prompt).not.toContain('`BrowserPreviewOpen`')
    expect(prompt).not.toContain('`WebSearch`')
    expect(prompt).not.toContain('`WebFetch`')
    expect(prompt).toContain('## CDUT Studio Managed Browser')
    expect(prompt).toContain('BrowserObserve')
    expect(prompt).toContain('BrowserScreenshot')
  })

  test('Browser/Preview SOP 按实际可用工具精确拼装', () => {
    const browserScreenshotDisabled = buildSystemPrompt({
      workspaceName: 'Demo',
      workspaceSlug: 'demo-workspace',
      sessionId: 'session-123',
      permissionMode: 'auto',
      disabledTools: ['BrowserScreenshot'],
    })
    expect(browserScreenshotDisabled).toContain('## CDUT Studio Managed Browser')
    expect(browserScreenshotDisabled).toContain('BrowserObserve')
    expect(browserScreenshotDisabled).toContain('BrowserPreviewOpen')
    expect(browserScreenshotDisabled).not.toContain('BrowserScreenshot')
    expect(browserScreenshotDisabled).not.toContain('inspect visual results with a browser screenshot')

    const browserObserveDisabled = buildSystemPrompt({
      workspaceName: 'Demo',
      workspaceSlug: 'demo-workspace',
      sessionId: 'session-123',
      permissionMode: 'auto',
      disabledTools: ['BrowserObserve'],
    })
    expect(browserObserveDisabled).toContain('## CDUT Studio Managed Browser')
    expect(browserObserveDisabled).toContain('BrowserScreenshot')
    expect(browserObserveDisabled).not.toContain('BrowserObserve')
    expect(browserObserveDisabled).not.toContain('Call `BrowserObserve` first')

    const inspectPreviewDisabled = buildSystemPrompt({
      workspaceName: 'Demo',
      workspaceSlug: 'demo-workspace',
      sessionId: 'session-123',
      permissionMode: 'auto',
      disabledTools: ['inspect_preview'],
    })
    expect(inspectPreviewDisabled).toContain('open_file_preview')
    expect(inspectPreviewDisabled).toContain('inspect_file_preview')
    expect(inspectPreviewDisabled).not.toContain('can be done on demand via `inspect_preview`')

    const openPreviewDisabled = buildSystemPrompt({
      workspaceName: 'Demo',
      workspaceSlug: 'demo-workspace',
      sessionId: 'session-123',
      permissionMode: 'auto',
      disabledTools: ['open_file_preview'],
    })
    expect(openPreviewDisabled).toContain('inspect_preview')
    expect(openPreviewDisabled).toContain('inspect_file_preview')
    expect(openPreviewDisabled).not.toContain('first use `open_file_preview`')
    expect(openPreviewDisabled).toContain('Use `inspect_file_preview` to inspect the current user-visible official CDUT Studio PPTX preview')

    const inspectFilePreviewDisabled = buildSystemPrompt({
      workspaceName: 'Demo',
      workspaceSlug: 'demo-workspace',
      sessionId: 'session-123',
      permissionMode: 'auto',
      disabledTools: ['inspect_file_preview'],
    })
    expect(inspectFilePreviewDisabled).toContain('inspect_preview')
    expect(inspectFilePreviewDisabled).toContain('open_file_preview')
    expect(inspectFilePreviewDisabled).not.toContain('inspect_file_preview')
    expect(inspectFilePreviewDisabled).toContain('For PPTX, first use `open_file_preview` to open the official CDUT Studio file preview')

    const allPreviewDisabled = buildSystemPrompt({
      workspaceName: 'Demo',
      workspaceSlug: 'demo-workspace',
      sessionId: 'session-123',
      permissionMode: 'auto',
      disabledTools: ['inspect_preview', 'open_file_preview', 'inspect_file_preview'],
    })
    expect(allPreviewDisabled).not.toContain('File content & visual preview')
  })

  test('代码预设关闭非研发能力，但保留任务图、记忆、预览、网页检索与图片呈现', () => {
    const prompt = buildSystemPrompt({
      workspaceName: 'Demo',
      workspaceSlug: 'demo-workspace',
      sessionId: 'session-code',
      permissionMode: 'auto',
      presetName: '代码',
      disabledToolGroups: ['automation', 'browser', 'clipboard', 'ppt-materials'],
      disabledTools: ['generate_image', 'create_skin'],
      isPiRuntime: true,
    })
    expect(prompt).toContain('proma_task_create')
    expect(prompt).toContain('## SubAgent Delegation Policy')
    expect(prompt).toContain('## CDUT Studio Knowledge Maintenance Architecture')
    expect(prompt).toContain('`inspect_preview`')
    expect(prompt).toContain('`WebSearch`')
    expect(prompt).toContain('`send_local_image`')
    expect(prompt).not.toContain('create_todo')
    expect(prompt).not.toContain('## CDUT Studio Managed Browser')
    expect(prompt).not.toContain('`generate_image`')
    // create_skin 归属 image 组：代码预设声明生图关闭时，皮肤创建工具及其 SOP 也必须一并消失
    expect(prompt).not.toContain('10. **Creating CDUT Studio skins**')
  })

  test('六类能力硬禁用时 Prompt 与动态浏览器上下文不暴露对应入口', () => {
    const disabled = ['browser', 'clipboard', 'preview', 'image', 'web', 'ppt-materials'] as const
    const prompt = buildSystemPrompt({
      workspaceName: 'Demo',
      workspaceSlug: 'demo-workspace',
      sessionId: 'session-123',
      permissionMode: 'auto',
      disabledToolGroups: disabled,
    })
    expect(prompt).not.toContain('## CDUT Studio Managed Browser')
    expect(prompt).not.toContain('`inspect_preview`')
    expect(prompt).not.toContain('`generate_image`')
    expect(prompt).not.toContain('`WebSearch`')
    expect(prompt).toContain('Capabilities Disabled by the Current Preset')
    // 能力组 label 为产品 UI 术语（保留简体中文），仅分隔符改为 ASCII 括号
    expect(prompt).toContain('受管浏览器 (browser)')
    expect(prompt).toContain('PPT 交付 (ppt-materials)')

    const dynamic = buildDynamicContext({
      workspaceName: 'Demo',
      workspaceSlug: 'demo-workspace',
      userBrowserContext: { activeTabId: 'tab-1', title: 'Private', url: 'https://private.example.test', openedAt: Date.now() },
      disabledToolGroups: ['browser'],
    })
    expect(dynamic).not.toContain('<user_browser_context>')
  })

  test('平台 overlay 同时注入给 Claude/Pi，但不复制两套完整核心提示词', () => {
    const macPrompt = buildSystemPrompt({
      workspaceName: 'Demo',
      workspaceSlug: 'demo-workspace',
      sessionId: 'session-123',
      permissionMode: 'auto',
      platform: 'darwin',
      shellPath: '/bin/zsh',
      agentCwd: '/Users/mac/.cdutai/agent-workspaces/profer/session-123',
      projectCandidates: [{ rootPath: '/Users/mac/profer/profer-main', name: 'proma', type: 'git-repository' }],
      isPiRuntime: true,
      disabledToolGroups: ['clipboard'],
    })
    const winPrompt = buildSystemPrompt({
      workspaceName: 'Demo',
      workspaceSlug: 'demo-workspace',
      sessionId: 'session-123',
      permissionMode: 'auto',
      platform: 'win32',
      shellPath: 'C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe',
      agentCwd: 'C:\\Users\\alice\\session-123',
      projectCandidates: [{ rootPath: 'D:\\repo', name: 'repo', type: 'git-repository' }],
      isPiRuntime: false,
    })

    expect(macPrompt).toContain('## Current Platform & Project Paths (macOS)')
    expect(macPrompt).toContain('The current execution environment is a POSIX shell')
    expect(macPrompt).toContain('from other operating systems')
    expect(macPrompt).toContain('/Users/mac/profer/profer-main')
    expect(macPrompt).toContain('path + edits[].oldText/newText')
    expect(winPrompt).toContain('## Current Platform & Project Paths (Windows)')
    expect(winPrompt).toContain('Use only the Windows shell and path format actually provided by the runtime')
    expect(winPrompt).toContain('file_path + old_string/new_string')
    expect(winPrompt).not.toContain('## Current Platform & Project Paths (macOS)')

    // 实际拼装后的普通 Pi 任务也必须保留平台事实与禁用边界，不能随低频 SOP 裁掉。
    const taskPrompt = buildPiTaskPrompt({
      basePrompt: macPrompt,
      userMessage: '检查类型错误。',
      toolNames: [],
    })
    expect(taskPrompt).toContain('## Current Platform & Project Paths (macOS)')
    expect(taskPrompt).toContain('/bin/zsh')
    expect(taskPrompt).toContain('/Users/mac/profer/profer-main')
    expect(taskPrompt).toContain('## Capabilities Disabled by the Current Preset')
    expect(taskPrompt).toContain('clipboard')
    expect(taskPrompt).not.toContain('### Pi Runtime & File Memory')
    expect(taskPrompt).not.toContain('## CDUT Studio Managed Browser')
  })

  test('动态上下文只展示当前预设实际允许的 MCP，且不泄露命令和 URL', () => {
    const restricted = buildDynamicContext({
      workspaceName: 'Demo',
      workspaceSlug: 'demo-workspace',
      mcpServerNames: ['allowed'],
    })
    expect(restricted).toContain('- allowed (http, enabled)')
    expect(restricted).not.toContain('denied')
    expect(restricted).not.toContain('disabled')
    expect(restricted).not.toContain('https://allowed.example.test/mcp')
    expect(restricted).not.toContain('/private/denied-mcp')

    const none = buildDynamicContext({ workspaceSlug: 'demo-workspace', mcpServerNames: [] })
    expect(none).not.toContain('MCP servers:')
  })

  test('团队记忆工具名按 runtime 适配（Pi 前缀 / Claude 裸名）', () => {
    const piPrompt = buildSystemPrompt({
      workspaceName: 'Team',
      workspaceSlug: 'team-ws',
      sessionId: 'session-123',
      permissionMode: 'auto',
      isPiRuntime: true,
      isTeamWorkspace: true,
    })
    expect(piPrompt).toContain('mcp__team-memory__list_team_memories')
    expect(piPrompt).toContain('mcp__team-memory__read_team_memory')
    expect(piPrompt).not.toContain('`list_team_memories`')

    const claudePrompt = buildSystemPrompt({
      workspaceName: 'Team',
      workspaceSlug: 'team-ws',
      sessionId: 'session-123',
      permissionMode: 'auto',
      isPiRuntime: false,
      isTeamWorkspace: true,
    })
    expect(claudePrompt).toContain('`list_team_memories`')
    expect(claudePrompt).not.toContain('mcp__team-memory__list_team_memories')
  })
})

describe('buildSystemPrompt 皮肤创建指引', () => {
  const base = {
    workspaceName: 'Demo',
    workspaceSlug: 'demo-workspace',
    sessionId: 'session-123',
    permissionMode: 'auto' as const,
    agentCwd: '/tmp/profer-cwd',
  }

  test('create_skin 可用时给出固定皮肤目录，并要求不要全盘扫描', () => {
    const prompt = buildSystemPrompt(base)
    const userSkinDir = `~/${getConfigDirName()}/skins/`
    expect(prompt).toContain('10. **Creating CDUT Studio skins**')
    expect(prompt).toContain(userSkinDir)
    expect(prompt).toContain('installedPath')
    // 措辞必须涵盖 Windows 侧的递归搜索命令，而不只是 macOS/Linux 的 find/ls
    expect(prompt).toContain('never locate the skin directory via recursive or full-disk file searches')
    expect(prompt).toContain('Get-ChildItem -Recurse')
    // create_skin 已内置安装校验，不应再要求模型手工做文件系统二次校验
    expect(prompt).not.toContain('perform one skin import/refresh or equivalent static validation')
  })

  test('create_skin 被禁用时不再注入皮肤创建 SOP', () => {
    const prompt = buildSystemPrompt({ ...base, disabledTools: ['create_skin'] })
    expect(prompt).not.toContain('10. **Creating CDUT Studio skins**')
  })

  test('传入 activeToolGroups 空集合时，所有未挂载的 Tier 2 能力组 SOP 均零提示词（100% 同构）', () => {
    const prompt = buildSystemPrompt({
      ...base,
      isPiRuntime: true,
      activeToolGroups: new Set(),
    })
    expect(prompt).toContain('Document Evidence & Mutual Trust')
    expect(prompt).not.toContain('mcp__task-graph__proma_task_create')
    expect(prompt).not.toContain('mcp__planning__create_todo')
    expect(prompt).not.toContain('## SubAgent Delegation Policy')
    expect(prompt).not.toContain('7. **Scheduled tasks (Automation)**')
    expect(prompt).not.toContain('9. **AI image generation**')
    expect(prompt).not.toContain('10. **Creating CDUT Studio skins**')
    expect(prompt).not.toContain('## CDUT Studio Managed Browser')
  })
})

describe('系统提示词管线模式隔离与近因', () => {
  test('CSLab 使用专属科学家身份，且不注入开发者 artifacts / slash commands', () => {
    const prompt = buildSystemPrompt({
      sessionId: 'session-cslab',
      permissionMode: 'auto',
      cslabLabBound: true,
      cslabLabInfo: {
        labId: 'lab-1',
        labName: 'Advanced Crystallography Lab',
        vaultDir: 'vault',
        structures: [],
        plots: [],
      },
    })

    expect(prompt).toContain('Principal Computational Scientist')
    expect(prompt).toContain('<cslab_science>')
    expect(prompt).not.toContain('general-purpose AI coding and desktop assistant')
    expect(prompt).not.toContain('<slash_commands>')
    expect(prompt).not.toContain('<artifacts>')
    expect(prompt).not.toContain('/grill-me')
  })

  test('速课堂不注入 artifacts / slash_commands / messaging，也不推荐开发者命令', () => {
    const prompt = buildSystemPrompt({
      workspaceName: 'AI速课堂',
      workspaceSlug: 'cdut-ai-class',
      sessionId: 'session-study',
      permissionMode: 'auto',
      isStudyClass: true,
      studyOutline: '',
      studyCognition: '',
    })

    expect(prompt).toContain('AI Speed Class')
    expect(prompt).toContain('Study Materials Store:')
    expect(prompt).toContain('Zero-Probe Rule')
    expect(prompt).toContain('Study Material Outline Guide')
    expect(prompt).not.toContain('workspace-files/.context')
    // 负向铁律允许点名 workspace-profile.md / CLAUDE.md，但绝不能注入它们的可读路径或开发块
    expect(prompt).not.toContain('CDUT Studio workspace profile')
    expect(prompt).not.toContain('Legacy CDUT Studio workspace profile')
    expect(prompt).not.toContain('Workspace root:')
    expect(prompt).not.toContain('Current session directory (cwd):')
    expect(prompt).not.toContain('.context Directory Layers')
    expect(prompt).not.toContain('Artifact Directory Path')
    expect(prompt).not.toContain('No project candidates are currently detected')
    expect(prompt).not.toContain('<artifacts>')
    expect(prompt).not.toContain('<slash_commands>')
    expect(prompt).not.toContain('<messaging>')
    expect(prompt).not.toContain('/grill-me')
    expect(prompt).not.toContain('/teamwork-preview')
    expect(prompt).not.toContain('/boost')
  })

  test('常规会话仍保留 artifacts / slash_commands / messaging', () => {
    const prompt = buildSystemPrompt({
      workspaceName: 'Demo',
      workspaceSlug: 'demo-workspace',
      sessionId: 'session-123',
      permissionMode: 'auto',
    })

    expect(prompt).toContain('<artifacts>')
    expect(prompt).toContain('<slash_commands>')
    expect(prompt).toContain('<messaging>')
  })

  test('双轨锚点契约使用 shared 文法，并禁止自定义 XML 与表格竖线', () => {
    const prompt = buildSystemPrompt({
      workspaceName: 'Demo',
      workspaceSlug: 'demo-workspace',
      sessionId: 'session-123',
      permissionMode: 'auto',
    })

    expect(prompt).toContain(DOCUMENT_ANCHOR_PATTERN)
    expect(prompt).toContain('[收入明细·B4:E10](#f3:p1-B4:E10)')
    expect(prompt).toContain('[资产负债表·核心数据](#f3:p1-tbl1)')
    expect(prompt).toContain('<positioning_bubble>')
    expect(prompt).toContain('**NEVER** use the pipe character')
    expect(prompt).not.toContain('^#f[1-9]\\d*:p[1-9]\\d*-b[1-9]\\d*$')
  })

  test('appendSystemPromptSections 保持近因提醒为最后一段，并在缺失时补齐', () => {
    const prompt = buildSystemPrompt({
      workspaceName: 'Demo',
      workspaceSlug: 'demo-workspace',
      sessionId: 'session-123',
      permissionMode: 'auto',
    })
    const appended = appendSystemPromptSections(prompt, ['<attached_directories>\nDEMO_ROOT\n</attached_directories>'])
    const lastReminder = appended.lastIndexOf('CRITICAL EXECUTION REMINDER')
    expect(lastReminder).toBeGreaterThan(appended.indexOf('DEMO_ROOT'))
    expect(appended.trimEnd().indexOf('CRITICAL EXECUTION REMINDER')).toBe(appended.trimEnd().lastIndexOf('CRITICAL EXECUTION REMINDER'))

    const fallback = appendSystemPromptSections('BASE WITHOUT REMINDER', ['## Extra\nEXTRA_SECTION'])
    expect(fallback.indexOf('EXTRA_SECTION')).toBeLessThan(fallback.lastIndexOf('CRITICAL EXECUTION REMINDER'))
    expect(fallback.split('CRITICAL EXECUTION REMINDER').length - 1).toBe(1)
  })

  test('索引模式禁止扫描 .context / agent-workspaces 找历史', () => {
    const prompt = buildSystemPrompt({
      workspaceName: 'Demo',
      workspaceSlug: 'demo-workspace',
      sessionId: 'session-123',
      permissionMode: 'auto',
      contextMode: 'index',
    })

    expect(prompt).toContain('Get-ChildItem -Recurse')
    expect(prompt).toContain('agent-workspaces/**')
    expect(prompt).toContain('<working_memory>')
  })

  test('包含 Python 制图与 Mermaid 双轨制图及 Python 优先规则', () => {
    const prompt = buildSystemPrompt({
      workspaceName: 'Demo',
      workspaceSlug: 'demo-workspace',
      sessionId: 'session-123',
      permissionMode: 'auto',
    })

    expect(prompt).toContain('Mermaid 与 Python 制图')
    expect(prompt).toContain('prioritize using Python plotting')
    expect(prompt).toContain('both **Python-based plotting**')
  })
})
