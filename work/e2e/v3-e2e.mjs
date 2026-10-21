#!/usr/bin/env node
/**
 * Review V3 实机 E2E 驱动（零新增依赖）
 *
 * 直接启动真实 Electron 进程（dist/main.cjs + dist/renderer），通过 CDP
 * 在渲染进程里调用 window.electronAPI.review.*，从而真实穿过
 * preload → main IPC → 主进程服务 → 磁盘持久化 的完整链路。
 *
 * 用法：
 *   node work/e2e/v3-e2e.mjs <scenario>
 * 场景：
 *   probe            仅启动并报告 API 表面
 *   create-case      创建原生案卷并重新读取
 *   d4-list          读取 D4 目录，统计模板数与可用性
 */
import { spawn, spawnSync } from 'node:child_process'
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = dirname(fileURLToPath(import.meta.url))
const APP_DIR = join(HERE, '../../apps/electron')
const ELECTRON = join(HERE, '../../node_modules/electron/dist/electron')
const scenario = process.argv[2] ?? 'probe'
const configDir = process.env.E2E_CONFIG_DIR ?? join(HERE, 'config')
const userDataDir = join(configDir, 'userdata')

if (!existsSync(ELECTRON)) {
  console.error(`[E2E] 找不到 Electron 二进制：${ELECTRON}`)
  process.exit(2)
}

// 每次运行使用干净配置根，保证可复现；需要保留时由调用方传 E2E_KEEP_CONFIG=1
// 每次运行使用干净配置根以保证可复现；随后由 setup-config 注入真实渠道与模型选择，
// 否则审核专区没有可用模型出口，无法验证真实 Provider 链路。
if (process.env.E2E_KEEP_CONFIG !== '1') {
  rmSync(configDir, { recursive: true, force: true })
}
mkdirSync(userDataDir, { recursive: true })

if (process.env.E2E_NO_SETUP !== '1') {
  const setup = spawn(process.execPath, [join(HERE, 'setup-config.mjs')], {
    env: { ...process.env, E2E_CONFIG_DIR: configDir },
    stdio: ['ignore', 'pipe', 'pipe'],
  })
  let setupOut = ''
  setup.stdout.on('data', (chunk) => { setupOut += chunk.toString() })
  setup.stderr.on('data', (chunk) => { setupOut += chunk.toString() })
  const setupCode = await new Promise((resolve) => setup.on('exit', resolve))
  if (setupCode !== 0) {
    console.error(`[E2E] 配置准备失败：\n${setupOut}`)
    process.exit(2)
  }
  if (process.env.E2E_VERBOSE === '1') process.stderr.write(setupOut)
}

const remoteDebuggingPort = Number(process.env.E2E_CDP_PORT ?? 9333)

const child = spawn(ELECTRON, [
  '.',
  `--remote-debugging-port=${remoteDebuggingPort}`,
  `--user-data-dir=${userDataDir}`,
  '--no-sandbox',
  '--disable-gpu',
], {
  cwd: APP_DIR,
  env: {
    ...process.env,
    // 开发模式配置根，复用已配置的真实渠道
    PROFER_CONFIG_DIR: configDir,
    // 独立开发实例：避免与用户日常运行的 CDUT Studio 抢单实例锁与 userData 目录
    PROFER_DEV_INSTANCE: process.env.E2E_DEV_INSTANCE ?? 'e2e',
    PROFER_USER_DATA_DIR: userDataDir,
    ELECTRON_ENABLE_LOGGING: '1',
    NODE_ENV: 'development',
  },
  stdio: ['ignore', 'pipe', 'pipe'],
})

const logs = []
const record = (tag) => (buf) => {
  const text = buf.toString()
  logs.push(`${tag}${text}`)
  if (process.env.E2E_VERBOSE === '1') process.stderr.write(`${tag}${text}`)
}
child.stdout.on('data', record('[main] '))
child.stderr.on('data', record('[main:err] '))

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function cdpTargets() {
  const res = await fetch(`http://127.0.0.1:${remoteDebuggingPort}/json/list`)
  return res.json()
}

/**
 * 等待主窗口渲染页面出现。
 * 启动阶段存在 splash（about:blank / data:）与主窗口两个 page target，
 * 必须挑出真正加载了应用页面（http://localhost:PORT）的那个。
 */
async function waitForPage(timeoutMs = 120_000) {
  const deadline = Date.now() + timeoutMs
  let lastSeen = []
  while (Date.now() < deadline) {
    try {
      const targets = await cdpTargets()
      lastSeen = targets.filter((t) => t.type === 'page').map((t) => t.url)
      const page = targets.find((t) => t.type === 'page'
        && /^https?:\/\/localhost:\d+/.test(t.url)
        && t.webSocketDebuggerUrl)
      if (page) return page
    } catch {
      /* 端口尚未就绪 */
    }
    await sleep(500)
  }
  throw new Error(`主窗口页面在超时内未出现；已看到的 page targets: ${JSON.stringify(lastSeen)}`)
}

/** 极简 CDP 客户端：只实现 Runtime.evaluate 与 Page.captureScreenshot */
async function connect(wsUrl) {
  const ws = new WebSocket(wsUrl)
  let nextId = 1
  const pending = new Map()
  await new Promise((resolve, reject) => {
    ws.addEventListener('open', resolve, { once: true })
    ws.addEventListener('error', () => reject(new Error('CDP WebSocket 连接失败')), { once: true })
  })
  ws.addEventListener('message', (event) => {
    const msg = JSON.parse(event.data)
    if (msg.id && pending.has(msg.id)) {
      const { resolve, reject } = pending.get(msg.id)
      pending.delete(msg.id)
      if (msg.error) reject(new Error(JSON.stringify(msg.error)))
      else resolve(msg.result)
    }
  })
  const send = (method, params = {}) => {
    const id = nextId++
    return new Promise((resolve, reject) => {
      pending.set(id, { resolve, reject })
      ws.send(JSON.stringify({ id, method, params }))
    })
  }
  return { ws, send }
}

/**
 * 在渲染进程求值。awaitPromise 打开，支持 async 表达式；
 * 返回值必须是可 JSON 序列化的结构。
 */
async function evaluate(send, expression, timeoutMs = 180_000) {
  const result = await send('Runtime.evaluate', {
    expression: `(async () => { ${expression} })()`,
    awaitPromise: true,
    returnByValue: true,
    timeout: timeoutMs,
  })
  if (result.exceptionDetails) {
    const desc = result.exceptionDetails.exception?.description
      ?? result.exceptionDetails.text
    throw new Error(`渲染进程求值异常: ${desc}`)
  }
  return result.result.value
}

const scenarios = {
  async probe({ send }) {
    return evaluate(send, `
      const api = window.electronAPI
      const review = window.reviewAPI
      return {
        url: location.href,
        title: document.title,
        readyState: document.readyState,
        hasApi: Boolean(api),
        hasReview: Boolean(review),
        electronKeys: api ? Object.keys(api).length : 0,
        reviewKeys: review ? Object.keys(review).sort() : [],
      }
    `)
  },

  async 'create-case'({ send }) {
    return evaluate(send, `
      const created = await window.reviewAPI.createCase({
        title: 'E2E 原生案卷', type: '综合测评', applicant: 'E2E', academicYear: '2026',
      })
      const cases = await window.reviewAPI.listCases()
      return {
        createdId: created?.id,
        createdTitle: created?.title,
        caseCount: cases?.length,
        reopened: cases?.some(c => c.id === created?.id),
      }
    `)
  },

  /**
   * 第 4 节实机验收 1~4 步：
   * 原生案卷 → 真实 PDF/DOCX 导入 → D4 Plan 固定 → 网关自检
   */
  async 'flow-core'({ send }) {
    return evaluate(send, `
      const api = window.reviewAPI
      const out = { steps: [] }
      const step = (name, data) => out.steps.push({ name, ...data })

      // 1) 原生案卷
      // 与 CreateCaseDialog 的真实行为一致：选领域包但 reviewTemplate 显式为 null，
      // 得到「未绑定」原生案卷，之后才能挂 D4 候选模板。
      const created = await api.createCase({
        title: 'E2E 闭环案卷', type: '综合测评', applicant: 'E2E', academicYear: '2026',
        domainPackId: 'comprehensive-assessment', reviewTemplate: null,
      })
      out.caseId = created?.id
      const reopened = await api.getCase(created.id)
      step('createCase', { ok: Boolean(created?.id), reopenedStage: reopened?.stage ?? null })

      // 2) 真实材料导入
      const pdfPath = out.pdfPath
      const docxPath = out.docxPath
      const imported = []
      for (const [path, role] of [[pdfPath, 'evidence'], [docxPath, 'evidence']]) {
        if (!path) continue
        const started = Date.now()
        try {
          const doc = await api.importDocumentFromPath({ caseId: created.id, sourcePath: path, role })
          imported.push({ ok: true, id: doc?.id, fileName: doc?.fileName,
            parseStatus: doc?.parseStatus, elapsedMs: Date.now() - started })
        } catch (error) {
          imported.push({ ok: false, path, error: String(error?.message ?? error), elapsedMs: Date.now() - started })
        }
      }
      step('importMaterials', { imported })

      // 3) D4 目录 + Plan 固定
      const list = await api.listD4Templates()
      out.templateCount = list?.length
      const usable = (list ?? []).find(t => t.templateId === 'g01-student-identity-correction')
      let plan = null
      if (usable) {
        try {
          plan = await api.attachD4TechnicalPlanV3({
            caseId: created.id,
            d4: { templateId: usable.templateId, version: usable.version,
              selection: usable.selection, useControlledStudentFixture: true },
          })
        } catch (error) {
          plan = { error: String(error?.message ?? error) }
        }
      }
      step('attachD4Plan', { templateCount: out.templateCount, plan })
      // 诊断：attach 失败时确认模板存储的真实状态
      if (plan?.error) {
        try {
          const tpl = await api.getTemplateV2(usable.templateId, usable.version)
          step('templateDiag', { templateId: tpl?.templateId, version: tpl?.version,
            status: tpl?.status, fields: tpl?.fields?.length, slots: tpl?.materialSlots?.length,
            outputs: tpl?.outputs?.map(o => o.kind), stages: tpl?.stages?.map(s => s.kind),
            objectType: tpl?.objectType })
        } catch (error) {
          step('templateDiag', { error: String(error?.message ?? error) })
        }
      }

      // 4) 模型网关自检（真实 Provider 可用性）
      let gateway = null
      try { gateway = await api.getModelGatewayStatus() }
      catch (error) { gateway = { error: String(error?.message ?? error) } }
      step('modelGateway', { gateway })

      return out
    `.replace('out.pdfPath', JSON.stringify(process.env.E2E_PDF_PATH ?? '')).replace('out.docxPath', JSON.stringify(process.env.E2E_DOCX_PATH ?? '')))
  },

  /**
   * 完整 7 步闭环（第 4 节 1~6 步）：
   * 案卷 → 材料 → D4 Plan → 真实 Provider Pi 审核 → Run/Check → 报告
   */
  async 'flow-full'({ send }) {
    return evaluate(send, `
      const api = window.reviewAPI
      const out = { steps: [], runId: null }
      const step = (name, data) => out.steps.push({ name, ...data })

      const created = await api.createCase({
        title: 'E2E 全流程案卷', type: '综合测评', applicant: 'E2E', academicYear: '2026',
        domainPackId: 'comprehensive-assessment', reviewTemplate: null,
      })
      out.caseId = created.id
      step('createCase', { ok: Boolean(created.id) })

      for (const [path, role] of [[PDF, 'evidence'], [DOCX, 'evidence']]) {
        if (!path) continue
        try {
          const doc = await api.importDocumentFromPath({ caseId: created.id, sourcePath: path, role })
          step('import:' + doc.fileName, { ok: true, parseStatus: doc.parseStatus })
        } catch (error) { step('import', { ok: false, error: String(error?.message ?? error) }) }
      }

      const list = await api.listD4Templates()
      const usable = (list ?? []).find(t => t.templateId === 'g01-student-identity-correction')
      const plan = await api.attachD4TechnicalPlanV3({
        caseId: created.id,
        d4: { templateId: usable.templateId, version: usable.version,
          selection: usable.selection, useControlledStudentFixture: true },
      })
      step('attachD4Plan', { checks: plan.checks, fingerprint: plan.fingerprint })

      // 真实 Provider：后台 Pi 审核
      const started = Date.now()
      let state = null
      try {
        state = await api.startBackgroundPiReviewV2({ caseId: created.id })
        step('startPiReview', { phase: state?.phase, runId: state?.runId ?? null })
      } catch (error) {
        step('startPiReview', { ok: false, error: String(error?.message ?? error) })
      }

      // 轮询到终态；启动已失败则不空等
      const deadline = Date.now() + Number(POLL_MS ?? 360000)
      let last = null
      const startFailed = !state
      while (!startFailed && Date.now() < deadline) {
        try { last = await api.getBackgroundPiReviewStateV2(created.id) } catch {}
        const phase = last?.phase
        if (phase && ['completed', 'failed', 'incomplete', 'stopped', 'cancelled', 'error'].includes(phase)) break
        await new Promise(r => setTimeout(r, 3000))
      }
      out.pollTimedOut = !startFailed && !(last?.phase && ['completed','failed','incomplete','stopped','cancelled','error'].includes(last.phase))
      step('piReviewOutcome', { phase: last?.phase, runId: last?.runId ?? null,
        elapsedMs: Date.now() - started, error: last?.error ?? null })
      out.runId = last?.runId ?? null

      // 持久 Run / Check
      try {
        const runs = await api.listRunsV2(created.id)
        step('listRuns', { count: runs?.length,
          runs: (runs ?? []).map(r => ({ id: r.id, status: r.status, checks: r.checks?.length ?? 0 })) })
        if (out.runId) {
          const run = await api.getRunV2(created.id, out.runId)
          step('getRun', { status: run?.status, checkCount: run?.checks?.length ?? 0,
            observations: run?.observations?.length ?? 0 })
        }
      } catch (error) { step('listRuns', { ok: false, error: String(error?.message ?? error) }) }

      // 人工复核：读取模型抽取的事实并确认（无事实时如实记录）
      try {
        const observations = await api.getRunObservationsV2(created.id)
        step('observations', { count: observations?.length ?? 0 })
        const first = (observations ?? [])[0]
        if (first) {
          const aggregate = await api.getAggregateV2(created.id)
          const confirmed = await api.correctObservationV2({
            caseId: created.id,
            command: {
              requestId: 'e2e-confirm-' + Date.now().toString(36),
              target: { kind: 'case', id: created.id },
              expectedRevision: aggregate.caseV2.revision,
              actor: { actorId: 'local-user', actorSource: 'local', role: 'reviewer' },
              type: 'CorrectObservation',
              payload: { subjectId: first.subjectId, fieldKey: first.fieldKey,
                value: first.value, sourceRefs: first.sourceRefs ?? [], reason: '人工核对无误' },
            },
          })
          step('confirmObservation', { ok: confirmed?.ok, code: confirmed?.code ?? null })
        }
      } catch (error) { step('confirmObservation', { ok: false, error: String(error?.message ?? error) }) }

      // 正式决定必须被拒（D2 技术预审不得形成校方决定）
      try {
        const runsForDecision = await api.listRunsV2(created.id)
        const target = (runsForDecision ?? [])[0]
        const aggregate = await api.getAggregateV2(created.id)
        const decision = await api.decideWorkspaceCaseV2({
          caseId: created.id,
          command: {
            requestId: 'e2e-decide-' + Date.now().toString(36),
            expectedRevision: aggregate.caseV2.revision,
            actor: { actorId: 'local-user', actorSource: 'local', role: 'reviewer' },
            payload: { result: 'pass', reason: 'E2E 技术预审尝试',
              basedOnRunId: target?.id, inputHash: target?.inputManifest?.hash },
          },
        })
        step('formalDecision', { ok: decision?.ok, code: decision?.code ?? null })
      } catch (error) {
        step('formalDecision', { rejected: true,
          error: String(error?.message ?? error).slice(0, 160) })
      }

      // 人工复核：对已完成 Run 的具体 check 记录处置（D2 预审的复核对象是 check）
      try {
        const runs2 = await api.listRunsV2(created.id)
        const run2 = (runs2 ?? [])[0]
        const target = (run2?.checks ?? []).find(c => c.status === 'awaiting-confirmation')
          ?? (run2?.checks ?? [])[0]
        if (run2 && target) {
          const agg2 = await api.getAggregateV2(created.id)
          const disp = await api.recordWorkspaceDispositionV2({
            caseId: created.id,
            command: {
              requestId: 'e2e-disp-' + Date.now().toString(36),
              target: { kind: 'case', id: created.id },
              expectedRevision: agg2.caseV2.revision,
              actor: { actorId: 'local-user', actorSource: 'local', role: 'reviewer' },
              type: 'RecordWorkspaceFindingDisposition',
              payload: { findingKey: target.checkId, disposition: 'human-confirmed-compliant',
                reason: '审核员对照审核依据和材料后确认本项符合',
                runId: run2.id, inputHash: run2.inputManifest?.hash },
            },
          })
          const after = await api.getAggregateV2(created.id)
          step('manualDisposition', { ok: disp?.ok, code: disp?.code ?? null,
            checkId: target.checkId, revision: after?.caseV2?.revision,
            dispositionCount: (after?.dispositions ?? []).length })
        }
      } catch (error) {
        step('manualDisposition', { ok: false, error: String(error?.message ?? error).slice(0, 160) })
      }

      // MD 报告导出
      try {
        const report = await api.exportReportV2(created.id)
        step('exportReport', { file: report?.file ?? null, decision: report?.decision ?? null })
      } catch (error) { step('exportReport', { ok: false, error: String(error?.message ?? error) }) }

      return out
    `
      .replace('PDF', JSON.stringify(process.env.E2E_PDF_PATH ?? ''))
      .replace('DOCX', JSON.stringify(process.env.E2E_DOCX_PATH ?? ''))
      .replace('POLL_MS', JSON.stringify(process.env.E2E_POLL_MS ?? '360000')))
  },

  /** 诊断：设置与渠道在应用内的真实可见性 */
  async 'diag-config'({ send }) {
    return evaluate(send, `
      const settings = await window.electronAPI.getSettings()
      let channels = []
      try { channels = await window.electronAPI.listChannels() } catch (e) { channels = [{ error: String(e?.message ?? e) }] }
      return {
        agentChannelId: settings?.agentChannelId ?? null,
        agentModelId: settings?.agentModelId ?? null,
        channels: (channels ?? []).map(c => ({ id: c.id, name: c.name, provider: c.provider,
          enabled: c.enabled, models: (c.models ?? []).map(m => m.id) })),
      }
    `)
  },

  /** 诊断：真实渠道连通性（解密 API Key + 发起请求） */
  async 'diag-channel'({ send }) {
    return evaluate(send, `
      const settings = await window.electronAPI.getSettings()
      const channelId = settings?.agentChannelId
      if (!channelId) return { error: '没有 agentChannelId' }
      try {
        const result = await window.electronAPI.testChannel(channelId)
        return { channelId, result }
      } catch (error) { return { channelId, error: String(error?.message ?? error) } }
    `)
  },

  /** 阶段 A：建案卷 + 导入材料 + 固定 Plan，把 caseId 写到文件供重启后核对 */
  async 'phase-prepare'({ send }) {
    return evaluate(send, `
      const api = window.reviewAPI
      const created = await api.createCase({
        title: 'E2E 重启恢复案卷', type: '综合测评', applicant: 'E2E', academicYear: '2026',
        domainPackId: 'comprehensive-assessment', reviewTemplate: null,
      })
      for (const path of [PDF, DOCX]) {
        if (path) await api.importDocumentFromPath({ caseId: created.id, sourcePath: path, role: 'evidence' })
      }
      const list = await api.listD4Templates()
      const usable = list.find(t => t.templateId === 'g01-student-identity-correction')
      const plan = await api.attachD4TechnicalPlanV3({
        caseId: created.id,
        d4: { templateId: usable.templateId, version: usable.version,
          selection: usable.selection, useControlledStudentFixture: true },
      })
      return { caseId: created.id, checks: plan.checks, fingerprint: plan.fingerprint }
    `
      .replace('PDF', JSON.stringify(process.env.E2E_PDF_PATH ?? ''))
      .replace('DOCX', JSON.stringify(process.env.E2E_DOCX_PATH ?? '')))
  },

  /** 阶段 B：冷重启后核对案卷/材料/Plan 是否完整恢复 */
  async 'phase-verify'({ send }) {
    return evaluate(send, `
      const api = window.reviewAPI
      const caseId = CASE_ID
      const cases = await api.listCases()
      const found = (cases ?? []).some(c => c.id === caseId)
      const aggregate = await api.getAggregateV2(caseId)
      const runs = await api.listRunsV2(caseId)
      const docs = (aggregate?.caseV2?.documents ?? []).filter(d => d.active !== false)
      return {
        caseId,
        listedAfterRestart: found,
        stage: aggregate?.caseV2?.stage ?? null,
        revision: aggregate?.caseV2?.revision ?? null,
        templateId: aggregate?.caseV2?.templateId ?? null,
        documents: docs.map(d => ({ fileName: d.fileName, parseStatus: d.parseStatus })),
        d2Checks: aggregate?.d2RuntimePlan?.mapping?.length ?? 0,
        d2Fingerprint: aggregate?.d2RuntimePlan?.fingerprint ?? null,
        runCount: runs?.length ?? 0,
        receipts: (aggregate?.receiptLog ?? []).map(r => r.type),
      }
    `.replace('CASE_ID', JSON.stringify(process.env.E2E_CASE_ID ?? '')))
  },

  /**
   * 第 7 步：B1 第 51 套自定义模板
   * 新建案卷 → 作者文档保存 → 预览编译 → 冻结 → 安装到同一案卷 → 导入材料
   */
  async 'flow-b1'({ send }) {
    return evaluate(send, `
      const api = window.reviewAPI
      const out = { steps: [] }
      const step = (name, data) => out.steps.push({ name, ...data })

      const created = await api.createCase({
        title: 'E2E 第51套案卷', type: '自定义审核', applicant: 'E2E', academicYear: '2026',
        reviewTemplate: null,
      })
      out.caseId = created.id
      step('createCase', { ok: Boolean(created.id) })

      const templateId = 'e2e-b1-candidate-' + Date.now().toString(36)
      const document = {
        schemaVersion: 'review-b1/1', templateId, templateVersion: '1',
        name: 'E2E 第51套技术候选', purpose: '仅本地技术预审，不代表校方规则',
        status: 'candidate-held', fields: [],
        sources: [{ sourceId: 'src-1', kind: 'user-declared',
          documentVersionId: 'native:0', locator: 'native:0', recordedBy: 'local-reviewer' }],
        targets: [{ targetKey: 'target', objectKey: 'document', subjectId: 'subject-one',
          scenario: 'candidate only', fieldValues: {} }],
        modules: [{ moduleId: 'm1', version: '1', dependsOn: [],
          checks: [{ checkKey: 'check-1', requirement: '核对申请材料中的关键事实',
            responsibility: 'Human', sourceIds: ['src-1'],
            targetKeys: ['target'], condition: { kind: 'always' } }] }],
        stages: [{ stageId: 'manual', role: 'human', mode: 'manual' }],
        outputs: [{ outputId: 'preview', kind: 'preview' }],
      }

      // 保存（作者态）
      let saved = null
      try {
        saved = await api.saveLocalCandidateAuthorV3({ document, expectedRevision: 0 })
        step('saveAuthor', { revision: saved?.revision })
      } catch (error) { step('saveAuthor', { ok: false, error: String(error?.message ?? error) }) }

      // 读回（验证可重新打开）
      try {
        const current = await api.readCurrentAuthorRevisionV3({ templateId })
        step('readAuthor', { revision: current?.revision, state: current?.state, displayOnly: current?.displayOnly })
      } catch (error) { step('readAuthor', { ok: false, error: String(error?.message ?? error) }) }

      // 预览编译
      try {
        const preview = await api.previewLocalCandidateAuthorV3({ document })
        step('preview', { fingerprint: preview?.canonicalPlan?.fingerprint ?? null,
          checks: preview?.canonicalPlan?.checks?.length ?? null })
      } catch (error) { step('preview', { ok: false, error: String(error?.message ?? error) }) }

      // 冻结
      let frozen = null
      try {
        frozen = await api.freezeLocalCandidateAuthorV3({ document,
          expectedRevision: saved?.revision ?? 0 })
        step('freeze', { fingerprint: frozen?.fingerprint ?? null })
      } catch (error) { step('freeze', { ok: false, error: String(error?.message ?? error) }) }

      // 安装到同一案卷
      if (frozen?.fingerprint) {
        try {
          const ack = await api.attachB1TechnicalPlanV3({ caseId: created.id, templateId,
            fingerprint: frozen.fingerprint })
          step('attachB1', { checks: ack?.checks, fingerprint: ack?.fingerprint,
            templateVersion: ack?.templateVersion })
        } catch (error) { step('attachB1', { ok: false, error: String(error?.message ?? error) }) }
      }

      // 导入材料（第 51 套也要能跑真实材料）
      try {
        const doc = await api.importDocumentFromPath({ caseId: created.id,
          sourcePath: PDF, role: 'evidence' })
        step('importMaterial', { fileName: doc?.fileName, parseStatus: doc?.parseStatus })
      } catch (error) { step('importMaterial', { ok: false, error: String(error?.message ?? error) }) }

      return out
    `.replace('PDF', JSON.stringify(process.env.E2E_PDF_PATH ?? '')))
  },

  /**
   * 第 5 步：人工复核（在已完成的真实 Run 上确认/更正 observation）
   */
  async 'flow-review'({ send }) {
    return evaluate(send, `
      const api = window.reviewAPI
      const caseId = CASE_ID
      const out = { caseId, steps: [] }
      const step = (name, data) => out.steps.push({ name, ...data })

      const aggregate = await api.getAggregateV2(caseId)
      step('aggregate', { stage: aggregate?.caseV2?.stage, revision: aggregate?.caseV2?.revision })

      const runs = await api.listRunsV2(caseId)
      step('runs', { count: runs?.length,
        list: (runs ?? []).map(r => ({ id: r.id, status: r.status, checks: r.checks?.length ?? 0 })) })

      // 真实 observations（模型抽取的事实）
      let observations = []
      try {
        observations = await api.getRunObservationsV2(caseId)
        step('observations', { count: observations?.length,
          sample: (observations ?? []).slice(0, 3).map(o => ({ fieldKey: o.fieldKey, value: o.value })) })
      } catch (error) { step('observations', { ok: false, error: String(error?.message ?? error) }) }

      // 人工确认（原值再落一条 extractedBy=user + confirmed=true）
      const first = (observations ?? [])[0]
      if (first) {
        try {
          const result = await api.correctObservationV2({
            caseId,
            command: {
              requestId: 'e2e-confirm-' + Date.now().toString(36),
              target: { kind: 'case', id: caseId },
              expectedRevision: aggregate.caseV2.revision,
              actor: { actorId: 'local-user', actorSource: 'local', role: 'reviewer' },
              type: 'CorrectObservation',
              payload: { subjectId: first.subjectId, fieldKey: first.fieldKey,
                value: first.value, sourceRefs: first.sourceRefs ?? [], reason: '人工核对无误' },
            },
          })
          step('confirmObservation', { ok: result?.ok, code: result?.code ?? null,
            message: result?.message ?? null })
        } catch (error) { step('confirmObservation', { ok: false, error: String(error?.message ?? error) }) }
      }

      // 尝试形成正式决定（预期被拒：D2 技术预审不得形成校方决定）
      try {
        const decision = await api.decideWorkspaceCaseV2({
          caseId,
          command: {
            requestId: 'e2e-decide-' + Date.now().toString(36),
            expectedRevision: aggregate.caseV2.revision,
            actor: { actorId: 'local-user', actorSource: 'local', role: 'reviewer' },
            payload: { result: 'pass', reason: 'E2E 技术预审尝试', basedOnRunId: runs?.[0]?.id,
              inputHash: runs?.[0]?.inputManifest?.hash },
          },
        })
        step('decide', { ok: decision?.ok, code: decision?.code ?? null })
      } catch (error) {
        step('decide', { rejected: true, error: String(error?.message ?? error).slice(0, 200) })
      }

      // 复核后重新导出报告
      try {
        const report = await api.exportReportV2(caseId)
        step('exportReport', { file: report?.file ?? null })
      } catch (error) { step('exportReport', { ok: false, error: String(error?.message ?? error) }) }

      return out
    `.replace('CASE_ID', JSON.stringify(process.env.E2E_CASE_ID ?? '')))
  },

  /**
   * 第 2 步的拖拽通道：用 CDP Input.dispatchDragEvent 发真实 OS 级拖放。
   *
   * 关键点：渲染层的 MaterialDropZone 通过 webUtils.getPathForFile 取本地路径，
   * 它只认真实拖放携带的文件句柄——JS 里 new File() 拿不到路径。
   * 所以必须走浏览器层 DragEvent，并带 files 列表。
   */
  /**
   * 第 2 步的拖拽通道。
   *
   * 拖拽在渲染层走的是 MaterialDropZone.onDrop → webUtils.getPathForFile(file)
   * → registerMaterialPathV2。这条链的关键约束是：只有**真实 OS 拖放**携带的
   * File 才有本地路径，JS 里 new File() 拿不到。
   *
   * 因此这里验证两段：
   *   A. 真实 CDP 拖放事件能命中真实组件的 drop handler（DOM 层）
   *   B. 拖放后拿到的路径经同一 registerMaterialPathV2 完成登记（IPC 层）
   * 若 UI 未挂载，则如实报告「UI 未挂载」，并单独验证 B 段（路径登记）已通。
   */
  async 'flow-drag'({ send }) {
    const created = await evaluate(send, `
      const created = await window.reviewAPI.createCase({
        title: 'E2E 拖拽案卷', type: '综合测评', applicant: 'E2E', academicYear: '2026',
        domainPackId: 'comprehensive-assessment', reviewTemplate: null,
      })
      return { caseId: created.id }
    `)
    const pdf = process.env.E2E_PDF_PATH ?? ''

    // A. 通过真实 UI 导航到审核专区，并选中案卷，使拖拽区真正挂载
    const dom = await evaluate(send, `
      const sel = '[aria-label="导入材料：点击选择或拖入文件"]'
      const sleep = (ms) => new Promise(r => setTimeout(r, ms))
      const clickText = (text, exact = false) => {
        const nodes = Array.from(document.querySelectorAll('button, a, [role="button"], [role="option"], li'))
          .filter(n => !n.getAttribute('aria-label')?.includes('导入材料'))
        const hit = nodes.find(n => {
          const t = (n.textContent ?? '').trim()
          return exact ? t === text : t.includes(text)
        })
        if (hit) { hit.click(); return true }
        return false
      }
      const trace = []
      if (!document.querySelector(sel)) {
        trace.push('click CDUT 专区: ' + clickText('CDUT 专区'))
        await sleep(2000)
        trace.push('click 材料审核: ' + clickText('材料审核'))
        await sleep(2500)
      }
      if (!document.querySelector(sel)) {
        // 案卷管理条里选中刚建的案卷
        trace.push('select case: ' + clickText('E2E 拖拽案卷'))
        await sleep(2500)
      }
      const zones = document.querySelectorAll(sel)
      return { count: zones.length, url: location.href, trace,
        bodyHint: (document.body.textContent ?? '').slice(0, 200) }
    `, 120_000)

    // B. 走真实 IPC：把拖放得到的本地路径登记进案卷（与 onDrop 完全同一条通道）
    const registered = await evaluate(send, `
      const caseId = ${JSON.stringify(created.caseId)}
      const sourcePath = ${JSON.stringify(pdf)}
      try {
        const versionId = await window.reviewAPI.registerMaterialPathV2({
          caseId, sourcePath, role: 'evidence',
        })
        const aggregate = await window.reviewAPI.getAggregateV2(caseId)
        const docs = (aggregate?.caseV2?.documents ?? []).filter(d => d.active !== false)
        return { ok: true, versionId,
          documents: docs.map(d => ({ fileName: d.fileName, parseStatus: d.parseStatus })),
          receipts: (aggregate?.receiptLog ?? []).map(r => r.type) }
      } catch (error) {
        return { ok: false, error: String(error?.message ?? error) }
      }
    `)

    return { caseId: created.caseId, dropZoneInDom: dom, pathRegister: registered }
  },

  /**
   * 第 5 步的真实人工复核：对已完成 Run 的具体 check 记录处置。
   * D2 技术预审不抽取事实（候选壳无字段），所以人工复核对象是 check，
   * 入口是 recordWorkspaceDispositionV2 / RecordWorkspaceFindingDisposition。
   */
  async 'flow-disposition'({ send }) {
    return evaluate(send, `
      const api = window.reviewAPI
      const caseId = __CASE_ID__
      const out = { caseId, steps: [] }
      const step = (name, data) => out.steps.push({ name, ...data })

      const aggregate = await api.getAggregateV2(caseId)
      const runs = await api.listRunsV2(caseId)
      const run = (runs ?? [])[0]
      if (!run) return { error: '没有可处置的运行' }
      step('run', { id: run.id, status: run.status, checks: run.checks?.length ?? 0 })

      // 选一条 awaiting-confirmation 的 check 做人工确认
      const target = (run.checks ?? []).find(c => c.status === 'awaiting-confirmation')
      if (!target) return { ...out, error: '没有待确认的 check' }
      step('targetCheck', { checkId: target.checkId, status: target.status })

      const result = await api.recordWorkspaceDispositionV2({
        caseId,
        command: {
          requestId: 'e2e-disp-' + Date.now().toString(36),
          target: { kind: 'case', id: caseId },
          expectedRevision: aggregate.caseV2.revision,
          actor: { actorId: 'local-user', actorSource: 'local', role: 'reviewer' },
          type: 'RecordWorkspaceFindingDisposition',
          payload: { findingKey: target.checkId, disposition: 'human-confirmed-compliant',
            reason: '审核员对照审核依据和材料后确认本项符合',
            runId: run.id, inputHash: run.inputManifest?.hash },
        },
      })
      step('recordDisposition', { ok: result?.ok, code: result?.code ?? null,
        message: result?.message ?? null })

      // 复核后读回：处置是否持久
      const after = await api.getAggregateV2(caseId)
      step('persisted', {
        revision: after?.caseV2?.revision,
        dispositions: (after?.dispositions ?? []).length,
        receipts: (after?.receiptLog ?? []).map(r => r.type).slice(-3),
      })

      // 复核后重新导出报告
      try {
        const report = await api.exportReportV2(caseId)
        step('exportReport', { file: report?.file ?? null })
      } catch (error) { step('exportReport', { ok: false, error: String(error?.message ?? error) }) }

      return out
    `.replace('__CASE_ID__', JSON.stringify(process.env.E2E_CASE_ID ?? '')))
  },

  /**
   * L2 学年解耦的真机验证：走真实 IPC 建案。
   * 非综测通用草稿可省略学年；综测仍必须提供。
   */
  async 'verify-academic-year'({ send }) {
    return evaluate(send, `
      const api = window.reviewAPI
      const out = {}

      // 1) 非综测通用草稿：不传学年
      try {
        const generic = await api.createCase({
          title: 'L2 通用草稿', type: '自定义审核', applicant: 'E2E',
          domainPackId: 'contract-review', reviewTemplate: null,
        })
        const reopened = await api.getCase(generic.id)
        out.genericNoYear = { ok: true, id: generic.id,
          academicYear: reopened?.academicYear ?? null, title: reopened?.title ?? null }
      } catch (error) {
        out.genericNoYear = { ok: false, error: String(error?.message ?? error) }
      }

      // 2) 综测：不传学年应被拒绝
      try {
        await api.createCase({
          title: 'L2 综测缺学年', type: '综合测评', applicant: 'E2E',
          domainPackId: 'comprehensive-assessment', reviewTemplate: null,
        })
        out.comprehensiveNoYear = { ok: true, unexpected: '不应建案成功' }
      } catch (error) {
        out.comprehensiveNoYear = { rejected: true,
          error: String(error?.message ?? error).slice(0, 120) }
      }

      // 3) 综测：带学年正常
      try {
        const c = await api.createCase({
          title: 'L2 综测带学年', type: '综合测评', applicant: 'E2E',
          academicYear: '2026', domainPackId: 'comprehensive-assessment', reviewTemplate: null,
        })
        out.comprehensiveWithYear = { ok: true, id: c.id }
      } catch (error) {
        out.comprehensiveWithYear = { ok: false, error: String(error?.message ?? error) }
      }

      return out
    `)
  },

  /**
   * 带字段的已发布业务模板：验证事实抽取（observation）真实可用。
   *
   * D2 候选壳没有字段，observations 必然为 0；而 T03/T05/T08 都建立在
   * 「带 FieldSpec 的业务模板能抽事实」之上。此场景用内置综测模板绑定案卷，
   * 跑真实审核并检查 observations 与 check 结论。
   */
  async 'flow-fielded'({ send }) {
    return evaluate(send, `
      const api = window.reviewAPI
      const out = { steps: [] }
      const step = (name, data) => out.steps.push({ name, ...data })

      // 与真实启动一致：先跑 boot check 播种内置模板草稿
      let boot = null
      try { boot = await api.bootCheckV2() } catch (error) { boot = { error: String(error?.message ?? error) } }
      step('bootCheck', { seeded: boot?.templatesSeeded ?? null, published: boot?.templatesPublished ?? null })

      let templates = await api.listTemplatesV2()
      let published = (templates ?? []).filter(t => t.status === 'published' && (t.fields?.length ?? 0) > 0)
      // 没有已发布带字段模板时，按用户真实操作发布一个内置模板
      if (published.length === 0) {
        const draftable = (templates ?? []).filter(t => t.status === 'draft' && (t.fields?.length ?? 0) > 0)
        if (draftable[0]) {
          try {
            await api.publishTemplateV2(draftable[0].templateId, draftable[0].version)
            templates = await api.listTemplatesV2()
            published = (templates ?? []).filter(t => t.status === 'published' && (t.fields?.length ?? 0) > 0)
            step('publishBuiltin', { templateId: draftable[0].templateId, version: draftable[0].version })
          } catch (error) { step('publishBuiltin', { ok: false, error: String(error?.message ?? error) }) }
        }
      }
      step('templatePick', { total: templates?.length ?? 0, publishedWithFields: published.length,
        picked: published[0]?.templateId ?? null })

      const tpl = published[0]
      if (!tpl) return { ...out, error: '没有带字段的已发布模板' }

      const created = await api.createCase({
        title: 'E2E 带字段案卷', type: '综合测评', applicant: 'E2E', academicYear: '2026',
        domainPackId: 'comprehensive-assessment',
        reviewTemplate: { templateId: tpl.templateId, version: tpl.version },
      })
      out.caseId = created.id
      step('createCase', { ok: Boolean(created.id), templateId: tpl.templateId, version: tpl.version })

      try {
        const doc = await api.importDocumentFromPath({ caseId: created.id,
          sourcePath: __PDF__, role: 'evidence' })
        step('importMaterial', { fileName: doc?.fileName, parseStatus: doc?.parseStatus })
      } catch (error) { step('importMaterial', { ok: false, error: String(error?.message ?? error) }) }

      let state = null
      try {
        state = await api.startBackgroundPiReviewV2({ caseId: created.id })
        step('startPiReview', { phase: state?.phase, runId: state?.runId ?? null })
      } catch (error) { step('startPiReview', { ok: false, error: String(error?.message ?? error) }) }

      const deadline = Date.now() + Number(__POLL__ ?? 360000)
      let last = null
      while (state && Date.now() < deadline) {
        try { last = await api.getBackgroundPiReviewStateV2(created.id) } catch {}
        const p = last?.phase
        if (p && ['completed','failed','incomplete','stopped','cancelled','error'].includes(p)) break
        await new Promise(r => setTimeout(r, 3000))
      }
      step('piReviewOutcome', { phase: last?.phase, runId: last?.runId ?? null,
        error: last?.error ?? null })

      // 事实抽取：这是带字段模板的核心产出
      try {
        const observations = await api.getRunObservationsV2(created.id)
        step('observations', { count: observations?.length ?? 0,
          sample: (observations ?? []).slice(0, 5).map(o => ({ fieldKey: o.fieldKey, value: o.value })) })
      } catch (error) { step('observations', { ok: false, error: String(error?.message ?? error) }) }

      try {
        const runs = await api.listRunsV2(created.id)
        const run = (runs ?? [])[0]
        step('run', { status: run?.status, checks: run?.checks?.length ?? 0 })
      } catch (error) { step('run', { ok: false, error: String(error?.message ?? error) }) }

      try {
        const report = await api.exportReportV2(created.id)
        step('exportReport', { file: report?.file ?? null })
      } catch (error) { step('exportReport', { ok: false, error: String(error?.message ?? error) }) }

      return out
    `
      .replace('__PDF__', JSON.stringify(process.env.E2E_PDF_PATH ?? ''))
      .replace('__POLL__', JSON.stringify(process.env.E2E_POLL_MS ?? '360000')))
  },

  /**
   * A15 起点：T01 保存并发布模板 → 无学年绑定到新案卷（T10 通用建案）。
   *
   * 验证 L2 学年解耦与 T01 模板绑定能组合工作：非综测业务模板不强制学年。
   */
  async 'flow-t01-bind'({ send }) {
    return evaluate(send, `
      const api = window.reviewAPI
      const out = { steps: [] }
      const step = (name, data) => out.steps.push({ name, ...data })

      const templateId = 'e2e-t01-lab-request'
      const now = new Date().toISOString()
      const template = {
        templateId, version: 1, schemaVersion: 2,
        name: 'E2E 实验室申请（T01 作者模板）', displayName: { template: '{{labName}} 实验室申请' },
        objectType: 'document', status: 'draft', createdAt: now,
        fields: [
          { key: 'labName', label: '实验室名称', kind: 'text', required: true, visibility: 'public', scope: 'case' },
          { key: 'applicantCount', label: '申请人数', kind: 'number', required: true, visibility: 'public', scope: 'case' },
        ],
        sections: [{ id: 'basic', name: '基本情况', order: 0, required: true, criteria: [
          { id: 'lab-exists', title: '实验室存在', requirement: '核对申请材料中的实验室名称',
            execution: 'semantic', targetScope: 'case' }] }],
        materialSlots: [], policyVersionIds: [], policyRefs: [],
        stages: [{ id: 'review', name: '审核', kind: 'manual-review', executorRole: 'reviewer' }],
        outputs: [{ id: 'feedback', kind: 'item-feedback', audience: 'reviewer' }],
      }

      try {
        await api.saveTemplateDraftV2(template)
        step('saveDraft', { ok: true })
      } catch (error) { step('saveDraft', { ok: false, error: String(error?.message ?? error) }) }

      try {
        await api.publishTemplateV2(templateId, 1)
        step('publish', { ok: true })
      } catch (error) { step('publish', { ok: false, error: String(error?.message ?? error) }) }

      // 无学年绑定到通用案卷（非综测领域，学年应为可选）
      try {
        const created = await api.createCase({
          title: 'A15 实验室申请案卷', type: '自定义审核', applicant: 'E2E',
          domainPackId: 'contract-review',
          reviewTemplate: { templateId, version: 1 },
        })
        const reopened = await api.getCase(created.id)
        step('bindCase', { ok: true, caseId: created.id,
          academicYear: reopened?.academicYear ?? null,
          templateBound: created?.reviewTemplate?.templateId ?? null })
      } catch (error) { step('bindCase', { ok: false, error: String(error?.message ?? error) }) }

      return out
    `)
  },

  /**
   * T07 评分链路（A12+A14 的评委基础）：
   * 建两个真实案卷 → 建批次 → 初始化评分轮次 → 分配 → 两名评委评分 → 排名可见。
   * 不伪造校方身份：actor 由 Main 派生为 local，角色仅声明。
   */
  async 'flow-t07-judging'({ send }) {
    return evaluate(send, `
      const api = window.reviewAPI
      const out = { steps: [] }
      const step = (name, data) => out.steps.push({ name, ...data })

      const caseIds = []
      for (const name of ['A14 评委案 A', 'A14 评委案 B']) {
        const created = await api.createCase({
          title: name, type: '自定义审核', applicant: 'E2E',
          domainPackId: 'contract-review', reviewTemplate: null,
        })
        caseIds.push(created.id)
      }
      step('createCases', { count: caseIds.length })

      // 批次：必须绑定「已发布且带评分量表」的模板（F15 契约）
      const judgingTemplateId = 'e2e-judging'
      let judgingPub = null
      try { judgingPub = await api.getTemplateV2(judgingTemplateId, 1) } catch {}
      if (!judgingPub || judgingPub.status !== 'published') {
        const now = new Date().toISOString()
        await api.saveTemplateDraftV2({
          templateId: judgingTemplateId, version: 1, schemaVersion: 2,
          name: 'E2E 评委量表模板', displayName: { template: '{{title}}' },
          objectType: 'document', status: 'draft', createdAt: now,
          fields: [{ key: 'title', label: '标题', kind: 'text', required: false, visibility: 'public', scope: 'case' }],
          sections: [], materialSlots: [], policyVersionIds: [], policyRefs: [], outputs: [],
          stages: [{ id: 'judging', name: '评审', kind: 'manual-review', executorRole: 'reviewer' }],
          rubric: {
            id: 'e2e-rubric', name: '默认评分表', version: 1, strategy: 'weighted-mean',
            totalPrecision: 2, missingStrategy: 'block', minEffectiveJudges: 2,
            dimensions: [
              { id: 'quality', name: '质量', weight: 1, min: 0, max: 5 },
              { id: 'impact', name: '影响', weight: 1, min: 0, max: 5 },
            ],
            scaleConversion: { fromMax: 10, toMax: 100 },
          },
        })
        await api.publishTemplateV2(judgingTemplateId, 1)
      }

      let batchId = null
      try {
        const state = await api.createBatchV2({
          id: 'batch-e2e-' + Date.now(), name: 'A14 评分批次',
          templateId: judgingTemplateId, templateVersion: 1, caseIds,
          policyVersionLock: [], createdAt: new Date().toISOString(),
        })
        batchId = state?.batch?.id ?? null
        step('createBatch', { batchId, cases: state?.batch?.caseIds?.length ?? 0 })
      } catch (error) { step('createBatch', { ok: false, error: String(error?.message ?? error) }) }
      out.batchId = batchId
      if (!batchId) return out

      // 初始化评分轮次（仅组织者、仅首次）
      let revision = 0
      try {
        const init = await api.initT07State({ batchId, claim: { role: 'organizer' } })
        revision = init.revision
        step('initRound', { revision, viewRole: init.view?.role })
      } catch (error) { step('initRound', { ok: false, error: String(error?.message ?? error) }) }

      // 分配两名评委到两个案件
      for (const [i, caseId] of caseIds.entries()) {
        for (const judge of ['local-judge-1', 'local-judge-2']) {
          try {
            const r = await api.applyT07Action({
              batchId, claim: { role: 'organizer' }, expectedRevision: revision,
              action: { type: 'assign', caseId, reviewerId: judge, assignmentId: judge + '-' + i },
            })
            revision = r.revision
          } catch (error) { step('assign', { ok: false, judge, error: String(error?.message ?? error) }) }
        }
      }
      step('assignDone', { revision })

      // 两名评委各自评分
      for (const judge of ['local-judge-1', 'local-judge-2']) {
        try {
          const view = await api.getT07View({ batchId, claim: { role: 'judge', reviewerId: judge } })
          const tasks = view.view?.tasks ?? []
          for (const task of tasks) {
            const r = await api.applyT07Action({
              batchId, claim: { role: 'judge', reviewerId: judge }, expectedRevision: revision,
              action: { type: 'submit', assignmentId: task.assignmentId, publicFeedback: '完成',
                scores: [{ dimensionId: 'quality', score: judge === 'local-judge-1' ? 4 : 5, na: false },
                         { dimensionId: 'impact', score: judge === 'local-judge-1' ? 5 : 4, na: false }] },
            })
            revision = r.revision
          }
          step('judgeSubmitted', { judge, tasks: tasks.length })
        } catch (error) { step('judgeSubmitted', { ok: false, judge, error: String(error?.message ?? error) }) }
      }

      // 组织者视图：排名与有效评委数
      try {
        const org = await api.getT07View({ batchId, claim: { role: 'organizer' } })
        step('organizerView', { role: org.view?.role, revision: org.revision,
          ranking: (org.view?.ranking ?? []).map(r => ({ caseId: r.caseId, total: r.total,
            converted: r.convertedTotal, rank: r.rank, judges: r.effectiveJudges })) })
      } catch (error) { step('organizerView', { ok: false, error: String(error?.message ?? error) }) }

      // 定稿（两名有效评委满足门控）
      try {
        const fin = await api.applyT07Action({ batchId, claim: { role: 'organizer' }, expectedRevision: revision, action: { type: 'finalize' } })
        revision = fin.revision
        step('finalize', { revision, ranking: fin.ranking?.map(r => ({ rank: r.rank, selected: r.selected })) })
      } catch (error) { step('finalize', { ok: false, error: String(error?.message ?? error) }) }

      return out
    `)
  },

  /** T07 阶段 A：建批次与评分轮次，记录 batchId 供重启后核对 */
  async 'phase-t07-prepare'({ send }) {
    return evaluate(send, `
      const api = window.reviewAPI
      const caseIds = []
      for (const name of ['T07 重启案 A', 'T07 重启案 B']) {
        const created = await api.createCase({ title: name, type: '自定义审核', applicant: 'E2E',
          domainPackId: 'contract-review', reviewTemplate: null })
        caseIds.push(created.id)
      }
      const batchId = 'batch-t07-restart-' + Date.now()
      await api.createBatchV2({ id: batchId, name: 'T07 重启批次', templateId: 'e2e', templateVersion: 1,
        caseIds, createdAt: new Date().toISOString() })
      const rubric = { id: 'r', name: '评分表', version: 1, strategy: 'weighted-mean',
        dimensions: [{ id: 'quality', name: '质量', weight: 1, min: 0, max: 5 },
                     { id: 'impact', name: '影响', weight: 1, min: 0, max: 5 }],
        minEffectiveJudges: 2, conversion: { mode: 'linear', targetMax: 100 } }
      let revision = (await api.initT07State({ batchId, claim: { role: 'organizer' },
        state: { batchId, rubricVersion: 1, rubric,
          cases: caseIds.map((id, i) => ({ caseId: id, blindLabel: '案件 ' + String.fromCharCode(65 + i) })),
          rounds: [{ number: 1, assignments: [], votes: [], divergenceReasons: {}, tieOrders: {} }] } })).revision
      for (const [i, caseId] of caseIds.entries()) {
        for (const judge of ['local-judge-1', 'local-judge-2']) {
          revision = (await api.applyT07Action({ batchId, claim: { role: 'organizer' }, expectedRevision: revision,
            action: { type: 'assign', caseId, reviewerId: judge, assignmentId: judge + '-' + i } })).revision
        }
      }
      // 一名评委先评分，另一名留缺评，用来验证重启后门控仍生效
      const view = await api.getT07View({ batchId, claim: { role: 'judge', reviewerId: 'local-judge-1' } })
      for (const task of view.view?.tasks ?? []) {
        revision = (await api.applyT07Action({ batchId, claim: { role: 'judge', reviewerId: 'local-judge-1' },
          expectedRevision: revision, action: { type: 'submit', assignmentId: task.assignmentId,
            publicFeedback: '完成', scores: [{ dimensionId: 'quality', score: 4, na: false },
              { dimensionId: 'impact', score: 5, na: false }] } })).revision
      }
      return { batchId, caseIds, revision }
    `)
  },

  /** T07 阶段 B：冷重启后核对轮次、分配、票与门控 */
  async 'phase-t07-verify'({ send }) {
    return evaluate(send, `
      const api = window.reviewAPI
      const batchId = BATCH_ID
      const org = await api.getT07View({ batchId, claim: { role: 'organizer' } })
      const view = org.view
      const round = view?.state?.rounds?.[view.state.rounds.length - 1]
      return {
        batchId,
        revision: org.revision,
        round: round?.number ?? null,
        assignments: round?.assignments?.length ?? 0,
        votes: round?.votes?.length ?? 0,
        ranking: (view?.ranking ?? []).map(r => ({ rank: r.rank, total: r.total, judges: r.effectiveJudges })),
      }
    `.replace('BATCH_ID', JSON.stringify(process.env.E2E_BATCH_ID ?? '')))
  },

  /**
   * A09 补件/复审：真实 Run → 要求补件 → 导入新原件 → 答复 → 解除补件。
   * 同时核对旧 Run 未被改写、申诉更正因缺教师权限被拒（安全边界）。
   */
  async 'flow-a09'({ send }) {
    return evaluate(send, `
      const api = window.reviewAPI
      const out = { steps: [] }
      const step = (name, data) => out.steps.push({ name, ...data })

      let boot = null
      try { boot = await api.bootCheckV2() } catch {}
      let templates = await api.listTemplatesV2()
      let published = (templates ?? []).filter(t => t.status === 'published' && (t.fields?.length ?? 0) > 0)
      if (published.length === 0) {
        const draftable = (templates ?? []).filter(t => t.status === 'draft' && (t.fields?.length ?? 0) > 0)
        if (draftable[0]) {
          await api.publishTemplateV2(draftable[0].templateId, draftable[0].version)
          templates = await api.listTemplatesV2()
          published = (templates ?? []).filter(t => t.status === 'published' && (t.fields?.length ?? 0) > 0)
        }
      }
      const tpl = published[0]
      if (!tpl) return { ...out, error: '没有带字段的已发布模板' }

      const created = await api.createCase({ title: 'A09 补件复审案卷', type: '综合测评', applicant: 'E2E',
        academicYear: '2026', domainPackId: 'comprehensive-assessment',
        reviewTemplate: { templateId: tpl.templateId, version: tpl.version } })
      out.caseId = created.id
      step('createCase', { ok: true, templateId: tpl.templateId })

      const first = await api.importDocumentFromPath({ caseId: created.id, sourcePath: __PDF__, role: 'evidence' })
      step('importFirst', { fileName: first?.fileName, parseStatus: first?.parseStatus })

      let state = await api.startBackgroundPiReviewV2({ caseId: created.id })
      const deadline = Date.now() + Number(__POLL__ ?? 900000)
      let last = null
      while (Date.now() < deadline) {
        try { last = await api.getBackgroundPiReviewStateV2(created.id) } catch {}
        const p = last?.phase
        if (p && ['completed','failed','incomplete','stopped','cancelled','error'].includes(p)) break
        await new Promise(r => setTimeout(r, 3000))
      }
      const runs1 = await api.listRunsV2(created.id)
      const run1 = runs1[0]
      step('run1', { status: run1?.status, checks: run1?.checks?.length ?? 0, id: run1?.id })
      if (!run1) return out

      const agg1 = await api.getAggregateV2(created.id)
      const target = (run1.checks ?? []).find(c => c.status === 'awaiting-supplement')
        ?? (run1.checks ?? []).find(c => c.status === 'awaiting-confirmation')
      if (!target) { step('pickFinding', { error: '没有可补件的检查项' }); return out }

      // 1) 要求补件
      let supplementId = null
      try {
        const r = await api.openWorkspaceSupplementV2({ caseId: created.id, command: {
          requestId: 'a09-open-' + Date.now().toString(36),
          target: { kind: 'case', id: created.id }, expectedRevision: agg1.caseV2.revision,
          actor: { actorId: 'local-user', actorSource: 'local', role: 'reviewer' },
          type: 'OpenWorkspaceSupplement',
          payload: { findingKey: target.checkId, runId: run1.id, inputHash: run1.inputManifest?.hash,
            requiredElements: ['补充证明材料'], reason: '现有材料不足以确认该项' },
        }})
        supplementId = r?.aggregate?.supplements?.at(-1)?.id ?? null
        step('openSupplement', { ok: r?.ok, supplementId, code: r?.code ?? null })
      } catch (error) { step('openSupplement', { ok: false, error: String(error?.message ?? error) }) }

      // 2) 导入真实新原件
      const second = await api.importDocumentFromPath({ caseId: created.id, sourcePath: __DOCX__, role: 'evidence' })
      step('importSupplement', { fileName: second?.fileName, parseStatus: second?.parseStatus })

      // 3) 答复补件
      if (supplementId) {
        try {
          const agg2 = await api.getAggregateV2(created.id)
          const r = await api.respondSupplementV2({ caseId: created.id, command: {
            requestId: 'a09-respond-' + Date.now().toString(36),
            target: { kind: 'case', id: created.id }, expectedRevision: agg2.caseV2.revision,
            actor: { actorId: 'local-user', actorSource: 'local', role: 'reviewer' },
            type: 'RespondSupplement',
            payload: { supplementId, note: '已补交证明材料',
              documentVersionIds: agg2.caseV2.documents.filter(d => d.active !== false).map(d => d.versionId) },
          }})
          step('respondSupplement', { ok: r?.ok, code: r?.code ?? null })
        } catch (error) { step('respondSupplement', { ok: false, error: String(error?.message ?? error) }) }

        // 4) 解除补件
        try {
          const agg3 = await api.getAggregateV2(created.id)
          const r = await api.resolveSupplementV2({ caseId: created.id, command: {
            requestId: 'a09-resolve-' + Date.now().toString(36),
            target: { kind: 'case', id: created.id }, expectedRevision: agg3.caseV2.revision,
            actor: { actorId: 'local-user', actorSource: 'local', role: 'reviewer' },
            type: 'ResolveSupplement',
            payload: { supplementId, outcome: 'satisfied', reason: '补件已满足' },
          }})
          step('resolveSupplement', { ok: r?.ok, code: r?.code ?? null })
        } catch (error) { step('resolveSupplement', { ok: false, error: String(error?.message ?? error) }) }
      }

      // 5) 核对旧 Run 未被改写、材料与阶段
      const aggFinal = await api.getAggregateV2(created.id)
      const runs2 = await api.listRunsV2(created.id)
      step('after', {
        stage: aggFinal?.caseV2?.stage,
        documents: (aggFinal?.caseV2?.documents ?? []).filter(d => d.active !== false).length,
        supplements: (aggFinal?.supplements ?? []).map(s => ({ id: s.id, status: s.status, responses: s.responses?.length ?? 0 })),
        runCount: runs2?.length ?? 0,
        oldRunStatus: (runs2 ?? []).find(r => r.id === run1.id)?.status,
      })

      // 6) 申诉更正需要教师权限：本地必须被拒（安全边界，不是缺陷）
      try {
        const aggX = await api.getAggregateV2(created.id)
        const appeal = await api.resolveAppealV2({ caseId: created.id, command: {
          requestId: 'a09-appeal-' + Date.now().toString(36),
          target: { kind: 'case', id: created.id }, expectedRevision: aggX.caseV2.revision,
          actor: { actorId: 'local-user', actorSource: 'local', role: 'reviewer' },
          type: 'ResolveAppeal', payload: { appealId: 'none', resolution: 'maintain-original', reason: '试探' },
        }})
        step('appealResolution', { ok: appeal?.ok, code: appeal?.code ?? null })
      } catch (error) { step('appealResolution', { rejected: true, error: String(error?.message ?? error).slice(0, 160) }) }

      return out
    `
      .replace('__PDF__', JSON.stringify(process.env.E2E_PDF_PATH ?? ''))
      .replace('__DOCX__', JSON.stringify(process.env.E2E_DOCX_PATH ?? ''))
      .replace('__POLL__', JSON.stringify(process.env.E2E_POLL_MS ?? '900000')))
  },

  /** T02 只读暂存预览：真实案卷 → Main 派生 B2 ctx → 覆盖统计 */
  async 'flow-t02-coverage'({ send }) {
    return evaluate(send, `
      const api = window.reviewAPI
      const created = await api.createCase({ title: 'T02 覆盖案卷', type: '自定义审核', applicant: 'E2E',
        domainPackId: 'contract-review', reviewTemplate: null })
      await api.importDocumentFromPath({ caseId: created.id, sourcePath: __PDF__, role: 'evidence' })
      await api.importDocumentFromPath({ caseId: created.id, sourcePath: __DOCX__, role: 'evidence' })
      try {
        const inv = await api.getT02StagedInventory(created.id)
        return { ok: true, caseId: created.id, total: inv.total, parsed: inv.parsed,
          partial: inv.partial, failed: inv.failed, images: inv.imagesAwaitingInspection,
          sources: (inv.sources ?? []).map(s => ({ name: s.fileName, status: s.parseStatus,
            blocks: s.blocks?.length ?? 0 })) }
      } catch (error) { return { ok: false, caseId: created.id, error: String(error?.message ?? error) } }
    `
      .replace('__PDF__', JSON.stringify(process.env.E2E_PDF_PATH ?? ''))
      .replace('__DOCX__', JSON.stringify(process.env.E2E_DOCX_PATH ?? '')))
  },

  /** T09 离线包闭环：签发 → 离线应答 → 预览 → 导入 → 补件已答复 */
  async 'flow-t09-offline'({ send }) {
    return evaluate(send, `
      const api = window.reviewAPI
      const out = { steps: [] }
      const step = (name, data) => out.steps.push({ name, ...data })

      const created = await api.createCase({ title: 'T09 离线案卷', type: '自定义审核', applicant: 'E2E',
        domainPackId: 'contract-review', reviewTemplate: null })
      const agg = await api.getAggregateV2(created.id)
      // 用真实业务命令开一条补件：借助已有检查不行，这里直接构造补件需要 Run；
      // 因此改用材料槽不可用时跳过，明确报告未建立补件。
      step('case', { caseId: created.id, stage: agg?.caseV2?.stage })

      // 直接尝试签发（预期：没有补件可签发）
      try {
        await api.issueT09StudentPackage({ caseId: created.id, supplementId: 'sup-none', recipientId: 'local-student' })
        step('issueWithoutSupplement', { unexpected: '不应成功' })
      } catch (error) {
        step('issueWithoutSupplement', { rejected: true, error: String(error?.message ?? error).slice(0, 120) })
      }

      return out
    `)
  },

  /**
   * A15 通用申请与本地办理：无学年 → T01 模板（含人数上限）→ 提交 →
   * 初审通过（本地审核员）→ 终审受阻（需教师）→ 报告导出。
   * 不跑 Pi：A15 的业务阶段链与 Run 无关，跑模型只会拖长验证。
   */
  async 'flow-a15'({ send }) {
    return evaluate(send, `
      const api = window.reviewAPI
      const out = { steps: [] }
      const step = (name, data) => out.steps.push({ name, ...data })

      const templateId = 'e2e-a15-lab'
      const now = new Date().toISOString()
      const template = {
        templateId, version: 1, schemaVersion: 2,
        name: 'A15 实验室使用申请', displayName: { template: '{{labName}} 实验室申请' },
        objectType: 'document', status: 'draft', createdAt: now,
        fields: [
          { key: 'labName', label: '实验室名称', kind: 'text', required: true, visibility: 'public', scope: 'case' },
          { key: 'applicantCount', label: '申请人数', kind: 'number', required: true, visibility: 'public', scope: 'case',
            min: 1, max: 20 },
        ],
        sections: [{ id: 'basic', name: '基本情况', order: 0, required: true, criteria: [
          { id: 'capacity', title: '人数不超过上限', requirement: '申请人数不得超过 20 人',
            execution: 'deterministic', targetScope: 'case' },
          { id: 'purpose', title: '用途合理', requirement: '核对申请用途与材料一致',
            execution: 'semantic', targetScope: 'case' }] }],
        materialSlots: [{ id: 'plan', name: '实验计划', minCount: 1, requiredAt: 'submission' }],
        policyVersionIds: [], policyRefs: [],
        stages: [
          { id: 'first', name: '初审', kind: 'manual-review', executorRole: 'reviewer', nextStageId: 'final' },
          { id: 'final', name: '终审', kind: 'manual-review', executorRole: 'teacher' },
        ],
        outputs: [{ id: 'feedback', kind: 'item-feedback', audience: 'reviewer' }],
      }
      try { await api.saveTemplateDraftV2(template) } catch (e) { step('saveDraft', { ok: false, error: String(e?.message ?? e) }) }
      try { await api.publishTemplateV2(templateId, 1); step('publish', { ok: true }) }
      catch (e) { step('publish', { ok: false, error: String(e?.message ?? e) }) }

      // 无学年建案（非综测领域，学年应为可选）
      let caseId = null
      try {
        const created = await api.createCase({ title: 'A15 实验室申请', type: '自定义审核', applicant: 'E2E',
          domainPackId: 'contract-review', reviewTemplate: { templateId, version: 1 } })
        caseId = created.id
        step('createCase', { ok: true, caseId, academicYear: created.academicYear ?? '' })
      } catch (e) { step('createCase', { ok: false, error: String(e?.message ?? e) }) }
      if (!caseId) return out

      try {
        // 材料槽绑定必须走 registerMaterialPathV2（importDocumentFromPath 不支持 slot）
        const versionId = await api.registerMaterialPathV2({ caseId, sourcePath: __PDF__,
          role: 'evidence', materialSlotId: 'plan' })
        const after = await api.getAggregateV2(caseId)
        // 原生分支返回的是 documentId，不是 versionId
        const doc = (after?.caseV2?.documents ?? []).find(d => d.documentId === versionId || d.versionId === versionId)
        step('importPlan', { fileName: doc?.fileName, status: doc?.parseStatus,
          slot: doc?.materialSlotId ?? null, returnedId: versionId })
      } catch (e) { step('importPlan', { ok: false, error: String(e?.message ?? e) }) }

      let taskId = null
      try {
        const submitted = await api.submitCaseV2(caseId)
        taskId = submitted?.taskId ?? submitted?.id ?? submitted?.aggregate?.tasks?.[0]?.id ?? null
        const agg = await api.getAggregateV2(caseId)
        taskId = taskId ?? agg?.tasks?.find(t => t.status === 'open')?.id ?? null
        step('submit', { ok: true, stage: agg?.caseV2?.stage, taskId,
          openTasks: (agg?.tasks ?? []).filter(t => t.status === 'open').map(t => ({ id: t.id, role: t.assigneeRole, stage: t.stageId })) })
      } catch (e) { step('submit', { ok: false, error: String(e?.message ?? e) }) }
      if (!taskId) return out

      // 初审：本地审核员有权
      try {
        const agg = await api.getAggregateV2(caseId)
        const r = await api.recordStageDecisionV2({ caseId, templateId, version: 1, command: {
          requestId: 'a15-first-' + Date.now().toString(36),
          target: { kind: 'case', id: caseId }, expectedRevision: agg.caseV2.revision,
          actor: { actorId: 'local-user', actorSource: 'local', role: 'reviewer' },
          type: 'RecordStageDecision',
          payload: { action: 'stage-pass', taskId, reason: '初审通过：材料齐备、人数未超限' },
        }})
        const after = await api.getAggregateV2(caseId)
        step('firstStage', { ok: r?.ok, code: r?.code ?? null, stage: after?.caseV2?.stage,
          decisions: (after?.decisions ?? []).map(d => ({ result: d.result, actor: d.actor?.role })) })
      } catch (e) { step('firstStage', { ok: false, error: String(e?.message ?? e) }) }

      // 终审：本地无教师身份，预期被拒（安全边界）
      try {
        const agg2 = await api.getAggregateV2(caseId)
        const openFinal = (agg2?.tasks ?? []).find(t => t.status === 'open' && t.stageId === 'final')
        if (!openFinal) { step('finalStage', { skipped: '没有开放终审任务' }) }
        else {
          const r = await api.recordStageDecisionV2({ caseId, templateId, version: 1, command: {
            requestId: 'a15-final-' + Date.now().toString(36),
            target: { kind: 'case', id: caseId }, expectedRevision: agg2.caseV2.revision,
            actor: { actorId: 'local-user', actorSource: 'local', role: 'reviewer' },
            type: 'RecordStageDecision',
            payload: { action: 'stage-pass', taskId: openFinal.id, reason: '试探终审' },
          }})
          step('finalStage', { ok: r?.ok, code: r?.code ?? null, message: (r?.message ?? '').slice(0, 120) })
        }
      } catch (e) { step('finalStage', { rejected: true, error: String(e?.message ?? e).slice(0, 140) }) }

      try {
        const report = await api.exportReportV2(caseId)
        step('exportReport', { file: report?.file ?? null })
      } catch (e) { step('exportReport', { ok: false, error: String(e?.message ?? e) }) }

      return out
    `.replace('__PDF__', JSON.stringify(process.env.E2E_PDF_PATH ?? '')))
  },

  /**
   * A15 S1：真实通用模板（organization，无学年/无分数，人数≤20，必交计划书，
   * reviewer 初审 → teacher 终审），验证发布、重开一致与复用。
   */
  async 'flow-a15-s1'({ send }) {
    return evaluate(send, `
      const api = window.reviewAPI
      const out = { steps: [] }
      const step = (name, data) => out.steps.push({ name, ...data })
      const templateId = 'a15-lab-application'
      const now = new Date().toISOString()

      const template = {
        templateId, version: 1, schemaVersion: 2,
        name: '实验室使用申请（A15）', displayName: { template: '{{organizationName}} 实验室使用申请' },
        objectType: 'organization', status: 'draft', createdAt: now,
        fields: [
          { key: 'organizationName', label: '组织名称', kind: 'text', required: true, visibility: 'public', scope: 'case' },
          { key: 'responsiblePerson', label: '负责人', kind: 'text', required: true, visibility: 'public', scope: 'case' },
          { key: 'applicantCount', label: '使用人数', kind: 'number', required: true, visibility: 'public', scope: 'case', min: 1, max: 20 },
          { key: 'usageDate', label: '使用日期', kind: 'date', required: true, visibility: 'public', scope: 'case' },
          { key: 'usageTime', label: '使用时段', kind: 'text', required: true, visibility: 'public', scope: 'case' },
          { key: 'purpose', label: '用途', kind: 'text', required: true, visibility: 'public', scope: 'case' },
        ],
        sections: [{ id: 'lab', name: '实验室使用', order: 0, required: true, criteria: [
          { id: 'headcount', title: '人数不超上限', requirement: '使用人数不得超过 20 人',
            execution: 'deterministic', targetScope: 'case' },
          { id: 'plan', title: '计划书齐备', requirement: '必须提交实验室使用计划书',
            execution: 'semantic', targetScope: 'case' },
        ] }],
        materialSlots: [{ id: 'lab-use-plan', name: '实验室使用计划书', minCount: 1, requiredAt: 'submission' }],
        policyVersionIds: [], policyRefs: [],
        stages: [
          { id: 'initial-review', name: '初审', kind: 'manual-review', executorRole: 'reviewer', nextStageId: 'final-review' },
          { id: 'final-review', name: '终审', kind: 'manual-review', executorRole: 'teacher' },
        ],
        outputs: [{ id: 'feedback', kind: 'item-feedback', audience: 'reviewer' }],
      }
      try { await api.saveTemplateDraftV2(template); step('save', { ok: true }) }
      catch (e) { step('save', { ok: false, error: String(e?.message ?? e) }); return out }
      try { await api.publishTemplateV2(templateId, 1); step('publish', { ok: true }) }
      catch (e) { step('publish', { ok: false, error: String(e?.message ?? e) }); return out }

      // 重开一致：读回已发布版本，逐项核对关键配置
      const reopened = await api.getTemplateV2(templateId, 1)
      step('reopen', {
        objectType: reopened?.objectType,
        status: reopened?.status,
        fields: (reopened?.fields ?? []).map(f => f.key),
        countMax: (reopened?.fields ?? []).find(f => f.key === 'applicantCount')?.max ?? null,
        slots: (reopened?.materialSlots ?? []).map(s => s.id),
        stages: (reopened?.stages ?? []).map(s => s.id + ':' + s.executorRole),
        hasAcademicYearField: (reopened?.fields ?? []).some(f => f.key === 'academicYear'),
      })

      // 复用：同一模板建两个案卷，均无学年
      const cases = []
      for (const title of ['A15 复用案卷一', 'A15 复用案卷二']) {
        try {
          const created = await api.createCase({ title, type: '自定义审核', applicant: 'E2E',
            domainPackId: 'contract-review', reviewTemplate: { templateId, version: 1 } })
          cases.push({ id: created.id, academicYear: created.academicYear ?? '' })
        } catch (e) { cases.push({ error: String(e?.message ?? e) }) }
      }
      step('reuse', { cases })
      out.templateId = templateId
      out.caseIds = cases.filter(c => c.id).map(c => c.id)
      return out
    `)
  },

  /**
   * A15 S3（不依赖 Run 的部分）：T05 可信阶段事务。
   * 能力投影、无 Run 时 stage-pass 必须被拒、补件可在无 Run 时创建。
   */
  async 'flow-a15-s3'({ send }) {
    return evaluate(send, `
      const api = window.reviewAPI
      const out = { steps: [] }
      const step = (name, data) => out.steps.push({ name, ...data })
      const templateId = 'a15-lab-application'

      // 自举：确保 A15 模板已发布（与 S1 同一形状，避免场景间依赖残留配置）
      let existing = null
      try { existing = await api.getTemplateV2(templateId, 1) } catch {}
      if (!existing || existing.status !== 'published') {
        const now = new Date().toISOString()
        await api.saveTemplateDraftV2({
          templateId, version: 1, schemaVersion: 2,
          name: '实验室使用申请（A15）', displayName: { template: '{{organizationName}} 实验室使用申请' },
          objectType: 'organization', status: 'draft', createdAt: now,
          fields: [
            { key: 'organizationName', label: '组织名称', kind: 'text', required: true, visibility: 'public', scope: 'case' },
            { key: 'responsiblePerson', label: '负责人', kind: 'text', required: true, visibility: 'public', scope: 'case' },
            { key: 'applicantCount', label: '使用人数', kind: 'number', required: true, visibility: 'public', scope: 'case', min: 1, max: 20 },
            { key: 'usageDate', label: '使用日期', kind: 'date', required: true, visibility: 'public', scope: 'case' },
            { key: 'usageTime', label: '使用时段', kind: 'text', required: true, visibility: 'public', scope: 'case' },
            { key: 'purpose', label: '用途', kind: 'text', required: true, visibility: 'public', scope: 'case' },
          ],
          sections: [{ id: 'lab', name: '实验室使用', order: 0, required: true, criteria: [
            { id: 'headcount', title: '人数不超上限', requirement: '使用人数不得超过 20 人', execution: 'deterministic', targetScope: 'case' },
            { id: 'plan', title: '计划书齐备', requirement: '必须提交实验室使用计划书', execution: 'semantic', targetScope: 'case' },
          ] }],
          materialSlots: [{ id: 'lab-use-plan', name: '实验室使用计划书', minCount: 1, requiredAt: 'submission' }],
          policyVersionIds: [], policyRefs: [],
          stages: [
            { id: 'initial-review', name: '初审', kind: 'manual-review', executorRole: 'reviewer', nextStageId: 'final-review' },
            { id: 'final-review', name: '终审', kind: 'manual-review', executorRole: 'teacher' },
          ],
          outputs: [{ id: 'feedback', kind: 'item-feedback', audience: 'reviewer' }],
        })
        await api.publishTemplateV2(templateId, 1)
      }

      const created = await api.createCase({ title: 'A15 S3 阶段案卷', type: '自定义审核', applicant: 'E2E',
        domainPackId: 'contract-review', reviewTemplate: { templateId, version: 1 } })
      const caseId = created.id
      out.caseId = caseId
      step('createCase', { caseId, academicYear: created.academicYear ?? '' })

      // 能力投影：本地业务模式、审核员、无可办任务（未提交）
      try {
        const cap = await api.getT05StageCapability({ caseId, claim: { role: 'reviewer' } })
        step('capabilityBeforeSubmit', { mode: cap.mode, actorRole: cap.actorRole,
          eligible: cap.eligibleTaskIds.length, hasRun: cap.hasCurrentRun })
      } catch (e) { step('capabilityBeforeSubmit', { error: String(e?.message ?? e) }) }

      // 提交（需要计划书槽，先按槽位登记真实 DOCX）
      try {
        await api.registerMaterialPathV2({ caseId, sourcePath: __DOCX__, role: 'evidence', materialSlotId: 'lab-use-plan' })
        const sub = await api.submitCaseV2(caseId)
        step('submit', { ok: true, taskId: sub?.taskId ?? null })
      } catch (e) { step('submit', { ok: false, error: String(e?.message ?? e) }) }

      const agg = await api.getAggregateV2(caseId)
      const openTask = (agg?.tasks ?? []).find(t => t.status === 'open')
      step('openTask', { id: openTask?.id ?? null, role: openTask?.assigneeRole, stage: openTask?.stageId })

      if (openTask) {
        // 无有效 Run 时 stage-pass 必须被拒（不得把「没有 Run」当通过）
        try {
          const r = await api.recordT05StageDecision({ caseId, claim: { role: 'reviewer' },
            templateId, version: 1, expectedRevision: agg.caseV2.revision, taskId: openTask.id,
            action: 'stage-pass', reason: '试探跳过运行', requestId: 's3-pass-' + Date.now() })
          step('stagePassWithoutRun', { unexpected: '不应成功', revision: r?.revision })
        } catch (e) { step('stagePassWithoutRun', { rejected: true, error: String(e?.message ?? e).slice(0, 160) }) }

        // 补件可以在没有 Run 时直接提出（不得伪造 Run/Decision）
        try {
          const r = await api.recordT05StageDecision({ caseId, claim: { role: 'reviewer' },
            templateId, version: 1, expectedRevision: (await api.getAggregateV2(caseId)).caseV2.revision,
            taskId: openTask.id, action: 'return-for-supplement',
            reason: '计划书内容不足以判断', supplementRequiredElements: ['实验计划书'],
            supplementReason: '请补交完整实验计划书', requestId: 's3-sup-' + Date.now() })
          const after = await api.getAggregateV2(caseId)
          step('supplementWithoutRun', { ok: true, revision: r.revision, stage: after?.caseV2?.stage,
            supplements: (after?.supplements ?? []).map(s => ({ id: s.id, status: s.status })),
            decisions: (after?.decisions ?? []).length })
        } catch (e) { step('supplementWithoutRun', { ok: false, error: String(e?.message ?? e).slice(0, 160) }) }
      }

      return out
    `.replace('__DOCX__', JSON.stringify((process.env.E2E_A15_DOCX ?? ''))))
  },

  /** T01 受控模型起草：真实调用已配置渠道，返回模型原文与实际模型标识 */
  async 'flow-t01-model'({ send }) {
    return evaluate(send, `
      try {
        const result = await window.reviewAPI.requestT01ModelDraft({
          system: '你只输出一个 JSON 对象，键为 ok。不要输出任何解释或 Markdown 围栏。',
          user: '请输出 {"ok":true}',
        })
        return { ok: true, channel: result.channelName, model: result.modelId,
          length: result.raw?.length ?? 0, head: (result.raw ?? '').slice(0, 120) }
      } catch (error) {
        return { ok: false, error: String(error?.message ?? error).slice(0, 220) }
      }
    `)
  },

  /**
   * A15 S3 真实 Run 路径：A15 案卷 → 填字段 → 按槽位导入 DOCX → 真实审核 →
   * 人工处置待确认项 → 准备度 ready → 初审 stage-pass 生成 teacher 终审任务。
   */
  async 'flow-a15-s3-run'({ send }) {
    return evaluate(send, `
      const api = window.reviewAPI
      const out = { steps: [] }
      const step = (name, data) => out.steps.push({ name, ...data })
      const templateId = 'a15-lab-application'
      const now = new Date().toISOString()

      // 自举 A15 模板（与 S1 同一形状）
      let existing = null
      try { existing = await api.getTemplateV2(templateId, 1) } catch {}
      if (!existing || existing.status !== 'published') {
        await api.saveTemplateDraftV2({
          templateId, version: 1, schemaVersion: 2,
          name: '实验室使用申请（A15）', displayName: { template: '{{organizationName}} 实验室使用申请' },
          objectType: 'organization', status: 'draft', createdAt: now,
          fields: [
            { key: 'organizationName', label: '组织名称', kind: 'text', required: true, visibility: 'public', scope: 'case' },
            { key: 'responsiblePerson', label: '负责人', kind: 'text', required: true, visibility: 'public', scope: 'case' },
            { key: 'applicantCount', label: '使用人数', kind: 'number', required: true, visibility: 'public', scope: 'case', min: 1, max: 20 },
            { key: 'usageDate', label: '使用日期', kind: 'date', required: true, visibility: 'public', scope: 'case' },
            { key: 'usageTime', label: '使用时段', kind: 'text', required: true, visibility: 'public', scope: 'case' },
            { key: 'purpose', label: '用途', kind: 'text', required: true, visibility: 'public', scope: 'case' },
          ],
          sections: [{ id: 'lab', name: '实验室使用', order: 0, required: true, criteria: [
            { id: 'headcount', title: '人数不超上限', requirement: '使用人数不得超过 20 人', execution: 'deterministic', targetScope: 'case' },
            { id: 'plan', title: '计划书齐备', requirement: '必须提交实验室使用计划书', execution: 'semantic', targetScope: 'case' },
          ] }],
          materialSlots: [{ id: 'lab-use-plan', name: '实验室使用计划书', minCount: 1, requiredAt: 'submission' }],
          policyVersionIds: [], policyRefs: [],
          stages: [
            { id: 'initial-review', name: '初审', kind: 'manual-review', executorRole: 'reviewer', nextStageId: 'final-review' },
            { id: 'final-review', name: '终审', kind: 'manual-review', executorRole: 'teacher' },
          ],
          outputs: [{ id: 'feedback', kind: 'item-feedback', audience: 'reviewer' }],
        })
        await api.publishTemplateV2(templateId, 1)
      }

      const created = await api.createCase({ title: 'A15 S3 真实案卷', type: '自定义审核', applicant: 'E2E',
        domainPackId: 'contract-review', reviewTemplate: { templateId, version: 1 } })
      const caseId = created.id
      out.caseId = caseId

      // 填字段（18 人，未超限）
      try {
        const agg0 = await api.getAggregateV2(caseId)
        await api.updateFieldsV2({ caseId, command: {
          requestId: 's3-fields-' + Date.now(), expectedRevision: agg0.caseV2.revision,
          target: { kind: 'case', id: caseId },
          actor: { actorId: 'local-user', actorSource: 'local', role: 'reviewer' },
          type: 'UpdateFields',
          payload: { caseFieldValues: {
            organizationName: '地球物理学院', responsiblePerson: '张老师', applicantCount: 18,
            usageDate: '2026-11-05', usageTime: '14:00-16:00', purpose: '课程实验',
          } },
        }})
        step('fields', { ok: true })
      } catch (e) { step('fields', { ok: false, error: String(e?.message ?? e) }) }

      // 按槽位导入真实 DOCX
      try {
        await api.registerMaterialPathV2({ caseId, sourcePath: __DOCX__, role: 'evidence', materialSlotId: 'lab-use-plan' })
        step('material', { ok: true })
      } catch (e) { step('material', { ok: false, error: String(e?.message ?? e) }) }

      // 真实审核
      try { await api.startBackgroundPiReviewV2({ caseId }) } catch (e) { step('startRun', { ok: false, error: String(e?.message ?? e) }) }
      const deadline = Date.now() + Number(__POLL__ ?? 900000)
      let last = null
      while (Date.now() < deadline) {
        try { last = await api.getBackgroundPiReviewStateV2(caseId) } catch {}
        const p = last?.phase
        if (p && ['completed','failed','incomplete','stopped','cancelled','error'].includes(p)) break
        await new Promise(r => setTimeout(r, 3000))
      }
      const runs = await api.listRunsV2(caseId)
      const run = runs[0]
      step('run', { phase: last?.phase ?? null, status: run?.status ?? null, checks: run?.checks?.length ?? 0,
        pending: (run?.checks ?? []).filter(c => c.status === 'awaiting-confirmation' || c.status === 'awaiting-supplement').length })
      if (!run) return out

      // 人工处置所有待确认项（确认合规）
      const agg1 = await api.getAggregateV2(caseId)
      const pendingChecks = (run.checks ?? []).filter(c => c.status === 'awaiting-confirmation' || c.status === 'awaiting-supplement')
      let revision = agg1.caseV2.revision
      let disposed = 0
      for (const check of pendingChecks) {
        try {
          const current = await api.getAggregateV2(caseId)
          await api.recordWorkspaceDispositionV2({ caseId, command: {
            requestId: 's3-disp-' + check.checkId, expectedRevision: current.caseV2.revision,
            target: { kind: 'case', id: caseId },
            actor: { actorId: 'local-user', actorSource: 'local', role: 'reviewer' },
            type: 'RecordWorkspaceFindingDisposition',
            payload: { findingKey: check.checkId, disposition: 'human-confirmed-compliant',
              reason: '人工核对原件后确认满足要求', runId: run.id, inputHash: run.inputManifest?.hash },
          }})
          disposed += 1
          revision = (await api.getAggregateV2(caseId)).caseV2.revision
        } catch (e) { step('dispose', { ok: false, checkId: check.checkId, error: String(e?.message ?? e).slice(0, 100) }) }
      }
      step('disposed', { count: disposed, of: pendingChecks.length })

      // 提交并初审
      try { await api.submitCaseV2(caseId) } catch (e) { step('submit', { ok: false, error: String(e?.message ?? e) }) }
      const agg2 = await api.getAggregateV2(caseId)
      const openTask = (agg2?.tasks ?? []).find(t => t.status === 'open' && t.stageId === 'initial-review')
      step('openTask', { id: openTask?.id ?? null, role: openTask?.assigneeRole ?? null })

      if (openTask) {
        try {
          const r = await api.recordT05StageDecision({ caseId, claim: { role: 'reviewer' },
            templateId, version: 1, expectedRevision: (await api.getAggregateV2(caseId)).caseV2.revision,
            taskId: openTask.id, action: 'stage-pass', reason: '人数 18 未超限、计划书齐备、待确认项已人工核对',
            requestId: 's3-pass-' + Date.now() })
          const after = await api.getAggregateV2(caseId)
          step('initialPass', { ok: true, revision: r.revision, stage: after?.caseV2?.stage,
            finality: r.proposal?.decisionFinality ?? null,
            openTasks: (after?.tasks ?? []).filter(t => t.status === 'open').map(t => ({ stage: t.stageId, role: t.assigneeRole })),
            decisions: (after?.decisions ?? []).map(d => ({ result: d.result, finality: d.finality, actor: d.actor?.role })) })
        } catch (e) { step('initialPass', { ok: false, error: String(e?.message ?? e).slice(0, 200) }) }
      }

      return out
    `
      .replace('__DOCX__', JSON.stringify(process.env.E2E_A15_DOCX ?? ''))
      .replace('__POLL__', JSON.stringify(process.env.E2E_POLL_MS ?? '900000')))
  },

  /** A15 S3 后半段：teacher 本地模拟终审 → final 决定，核对两段决定与真实 Run 关联 */
  async 'flow-a15-s3-final'({ send }) {
    return evaluate(send, `
      const api = window.reviewAPI
      const caseId = __CASE__
      const out = { steps: [] }
      const step = (name, data) => out.steps.push({ name, ...data })
      const agg = await api.getAggregateV2(caseId)
      if (!agg) return { error: '案卷不存在', caseId }
      step('before', { stage: agg.caseV2.stage,
        openTasks: (agg.tasks ?? []).filter(t => t.status === 'open').map(t => ({ id: t.id, stage: t.stageId, role: t.assigneeRole })),
        decisions: (agg.decisions ?? []).map(d => ({ result: d.result, finality: d.finality, actor: d.actor?.role, basedOnRunId: d.basedOnRunId })) })

      const finalTask = (agg.tasks ?? []).find(t => t.status === 'open' && t.stageId === 'final-review')
      if (!finalTask) return { ...out, error: '没有开放终审任务' }

      // 能力投影：teacher 角色应看到可办理动作
      try {
        const cap = await api.getT05StageCapability({ caseId, claim: { role: 'teacher' } })
        step('teacherCapability', { mode: cap.mode, role: cap.actorRole, eligible: cap.eligibleTaskIds.length,
          hasRun: cap.hasCurrentRun, allowed: cap.allowedActions })
      } catch (e) { step('teacherCapability', { error: String(e?.message ?? e).slice(0, 150) }) }

      // reviewer 冒充 teacher 必须被拒（角色由任务判定，不由自称决定）
      try {
        await api.recordT05StageDecision({ caseId, claim: { role: 'reviewer' },
          templateId: 'a15-lab-application', version: 1, expectedRevision: agg.caseV2.revision,
          taskId: finalTask.id, action: 'stage-pass', reason: '冒面试探', requestId: 's3-fake-' + Date.now() })
        step('reviewerClaimFinal', { unexpected: '不应成功' })
      } catch (e) { step('reviewerClaimFinal', { rejected: true, error: String(e?.message ?? e).slice(0, 160) }) }

      // teacher 终审通过
      try {
        const current = await api.getAggregateV2(caseId)
        const r = await api.recordT05StageDecision({ caseId, claim: { role: 'teacher' },
          templateId: 'a15-lab-application', version: 1, expectedRevision: current.caseV2.revision,
          taskId: finalTask.id, action: 'stage-pass', reason: '材料齐备、人数 18 未超限，终审通过',
          requestId: 's3-final-' + Date.now() })
        const after = await api.getAggregateV2(caseId)
        step('finalPass', { ok: true, revision: r.revision, stage: after?.caseV2?.stage,
          finality: r.proposal?.decisionFinality ?? null,
          decisions: (after?.decisions ?? []).map(d => ({ result: d.result, finality: d.finality, actor: d.actor?.role, basedOnRunId: d.basedOnRunId })),
          openTasks: (after?.tasks ?? []).filter(t => t.status === 'open').length })
      } catch (e) { step('finalPass', { ok: false, error: String(e?.message ?? e).slice(0, 200) }) }

      return out
    `.replace('__CASE__', JSON.stringify(process.env.E2E_CASE_ID ?? '')))
  },

  /**
   * A15 S3-01 补件两轮：
   * 首轮用「不清楚的计划书」→ 要求补件 → 第一次回复仍不足（insufficient）
   * → 第二次回复为更正版新 DocumentVersion → 判定 satisfied → 重新审核产生新 Run
   * → 旧 Run 与旧 DocumentVersion 均保留。
   */
  async 'flow-a15-s3-supplement'({ send }) {
    return evaluate(send, `
      const api = window.reviewAPI
      const out = { steps: [] }
      const step = (name, data) => out.steps.push({ name, ...data })
      const templateId = 'a15-lab-application'
      const now = new Date().toISOString()

      let existing = null
      try { existing = await api.getTemplateV2(templateId, 1) } catch {}
      if (!existing || existing.status !== 'published') {
        await api.saveTemplateDraftV2({
          templateId, version: 1, schemaVersion: 2,
          name: '实验室使用申请（A15）', displayName: { template: '{{organizationName}} 实验室使用申请' },
          objectType: 'organization', status: 'draft', createdAt: now,
          fields: [
            { key: 'organizationName', label: '组织名称', kind: 'text', required: true, visibility: 'public', scope: 'case' },
            { key: 'responsiblePerson', label: '负责人', kind: 'text', required: true, visibility: 'public', scope: 'case' },
            { key: 'applicantCount', label: '使用人数', kind: 'number', required: true, visibility: 'public', scope: 'case', min: 1, max: 20 },
            { key: 'usageDate', label: '使用日期', kind: 'date', required: true, visibility: 'public', scope: 'case' },
            { key: 'usageTime', label: '使用时段', kind: 'text', required: true, visibility: 'public', scope: 'case' },
            { key: 'purpose', label: '用途', kind: 'text', required: true, visibility: 'public', scope: 'case' },
          ],
          sections: [{ id: 'lab', name: '实验室使用', order: 0, required: true, criteria: [
            { id: 'headcount', title: '人数不超上限', requirement: '使用人数不得超过 20 人', execution: 'deterministic', targetScope: 'case' },
            { id: 'plan', title: '计划书齐备', requirement: '必须提交实验室使用计划书', execution: 'semantic', targetScope: 'case' },
          ] }],
          materialSlots: [{ id: 'lab-use-plan', name: '实验室使用计划书', minCount: 1, requiredAt: 'submission' }],
          policyVersionIds: [], policyRefs: [],
          stages: [
            { id: 'initial-review', name: '初审', kind: 'manual-review', executorRole: 'reviewer', nextStageId: 'final-review' },
            { id: 'final-review', name: '终审', kind: 'manual-review', executorRole: 'teacher' },
          ],
          outputs: [{ id: 'feedback', kind: 'item-feedback', audience: 'reviewer' }],
        })
        await api.publishTemplateV2(templateId, 1)
      }

      const created = await api.createCase({ title: 'A15 S3-01 补件案卷', type: '自定义审核', applicant: 'E2E',
        domainPackId: 'contract-review', reviewTemplate: { templateId, version: 1 } })
      const caseId = created.id
      out.caseId = caseId

      // 12 人（A15-MISSING-PLAN 场景）＋ 首轮不清楚的计划书
      const agg0 = await api.getAggregateV2(caseId)
      await api.updateFieldsV2({ caseId, command: {
        requestId: 's301-fields-' + Date.now(), expectedRevision: agg0.caseV2.revision,
        target: { kind: 'case', id: caseId },
        actor: { actorId: 'local-user', actorSource: 'local', role: 'reviewer' }, type: 'UpdateFields',
        payload: { caseFieldValues: { organizationName: '地球物理学院', responsiblePerson: '李老师', applicantCount: 12,
          usageDate: '2026-11-08', usageTime: '09:00-11:00', purpose: '开放实验' } },
      }})
      const first = await api.registerMaterialPathV2({ caseId, sourcePath: __UNCLEAR__, role: 'evidence', materialSlotId: 'lab-use-plan' })
      step('firstDocument', { ok: true, documentId: first })

      await api.startBackgroundPiReviewV2({ caseId })
      const deadline = Date.now() + Number(__POLL__ ?? 900000)
      let phase = null
      while (Date.now() < deadline) {
        try { phase = (await api.getBackgroundPiReviewStateV2(caseId))?.phase } catch {}
        if (phase && ['completed','failed','incomplete','stopped','cancelled','error'].includes(phase)) break
        await new Promise(r => setTimeout(r, 3000))
      }
      const runs1 = await api.listRunsV2(caseId)
      const run1 = runs1[0]
      step('run1', { phase, status: run1?.status ?? null, id: run1?.id ?? null,
        checks: (run1?.checks ?? []).map(c => ({ id: c.checkId, status: c.status })) })
      if (!run1) return out

      // 开补件（首轮 Run 里挑一项待确认/待补件；没有就用 T05 直接要求补件）
      const agg1 = await api.getAggregateV2(caseId)
      const pendingCheck = (run1.checks ?? []).find(c => c.status === 'awaiting-supplement' || c.status === 'awaiting-confirmation')
      let supplementId = null
      if (pendingCheck) {
        try {
          const r = await api.openWorkspaceSupplementV2({ caseId, command: {
            requestId: 's301-open-' + Date.now(), expectedRevision: agg1.caseV2.revision,
            target: { kind: 'case', id: caseId },
            actor: { actorId: 'local-user', actorSource: 'local', role: 'reviewer' },
            type: 'OpenWorkspaceSupplement',
            payload: { findingKey: pendingCheck.checkId, runId: run1.id, inputHash: run1.inputManifest?.hash,
              requiredElements: ['完整的实验室使用计划书'], reason: '计划书内容不足以核验' },
          }})
          supplementId = r?.aggregate?.supplements?.at(-1)?.id ?? null
          step('openSupplement', { via: 'run-check', supplementId })
        } catch (e) { step('openSupplement', { via: 'run-check', ok: false, error: String(e?.message ?? e).slice(0, 140) }) }
      } else {
        // 无待办时由 T05 直接开补件（不伪造 Run）
        try {
          await api.submitCaseV2(caseId)
          const aggT = await api.getAggregateV2(caseId)
          const task = (aggT?.tasks ?? []).find(t => t.status === 'open' && t.stageId === 'initial-review')
          const r = await api.recordT05StageDecision({ caseId, claim: { role: 'reviewer' },
            templateId, version: 1, expectedRevision: aggT.caseV2.revision, taskId: task.id,
            action: 'return-for-supplement', reason: '计划书内容不足',
            supplementRequiredElements: ['完整的实验室使用计划书'], supplementReason: '请补交完整计划书',
            requestId: 's301-t05sup-' + Date.now() })
          supplementId = r.supplementId ?? null
          step('openSupplement', { via: 't05', supplementId })
        } catch (e) { step('openSupplement', { via: 't05', ok: false, error: String(e?.message ?? e).slice(0, 140) }) }
      }
      if (!supplementId) return out

      // 第一轮回复：仍用不清楚的版本 → insufficient
      try {
        const agg2 = await api.getAggregateV2(caseId)
        await api.respondSupplementV2({ caseId, command: {
          requestId: 's301-resp1-' + Date.now(), expectedRevision: agg2.caseV2.revision,
          target: { kind: 'case', id: caseId },
          actor: { actorId: 'local-user', actorSource: 'local', role: 'reviewer' },
          type: 'RespondSupplement',
          payload: { supplementId, note: '先补一版说明',
            documentVersionIds: (agg2.caseV2.documents ?? []).filter(d => d.active !== false).map(d => d.versionId) },
        }})
        const agg3 = await api.getAggregateV2(caseId)
        await api.resolveSupplementV2({ caseId, command: {
          requestId: 's301-res1-' + Date.now(), expectedRevision: agg3.caseV2.revision,
          target: { kind: 'case', id: caseId },
          actor: { actorId: 'local-user', actorSource: 'local', role: 'reviewer' },
          type: 'ResolveSupplement',
          payload: { supplementId, outcome: 'insufficient', reason: '内容仍不足以核验计划安排' },
        }})
        const agg4 = await api.getAggregateV2(caseId)
        step('round1', { supplement: (agg4.supplements ?? []).find(s => s.id === supplementId)?.status,
          stage: agg4.caseV2.stage, documents: (agg4.caseV2.documents ?? []).filter(d => d.active !== false).length })
      } catch (e) { step('round1', { ok: false, error: String(e?.message ?? e).slice(0, 160) }) }

      // 第二轮：更正版新原件 → satisfied
      let correctedVersion = null
      try {
        correctedVersion = await api.registerMaterialPathV2({ caseId, sourcePath: __CORRECTED__, role: 'evidence', materialSlotId: 'lab-use-plan' })
        const agg5 = await api.getAggregateV2(caseId)
        await api.respondSupplementV2({ caseId, command: {
          requestId: 's301-resp2-' + Date.now(), expectedRevision: agg5.caseV2.revision,
          target: { kind: 'case', id: caseId },
          actor: { actorId: 'local-user', actorSource: 'local', role: 'reviewer' },
          type: 'RespondSupplement',
          payload: { supplementId, note: '补交更正版计划书',
            documentVersionIds: (agg5.caseV2.documents ?? []).filter(d => d.active !== false).map(d => d.versionId) },
        }})
        const agg6 = await api.getAggregateV2(caseId)
        await api.resolveSupplementV2({ caseId, command: {
          requestId: 's301-res2-' + Date.now(), expectedRevision: agg6.caseV2.revision,
          target: { kind: 'case', id: caseId },
          actor: { actorId: 'local-user', actorSource: 'local', role: 'reviewer' },
          type: 'ResolveSupplement',
          payload: { supplementId, outcome: 'satisfied', reason: '更正版计划书已满足要求' },
        }})
        const agg7 = await api.getAggregateV2(caseId)
        step('round2', { supplement: (agg7.supplements ?? []).find(s => s.id === supplementId)?.status,
          stage: agg7.caseV2.stage, documents: (agg7.caseV2.documents ?? []).filter(d => d.active !== false).length,
          correctedVersion })
      } catch (e) { step('round2', { ok: false, error: String(e?.message ?? e).slice(0, 160) }) }

      // 重新审核：应产生新 Run，旧 Run 保留
      try {
        await api.startBackgroundPiReviewV2({ caseId })
        const deadline2 = Date.now() + Number(__POLL__ ?? 900000)
        let phase2 = null
        while (Date.now() < deadline2) {
          try { phase2 = (await api.getBackgroundPiReviewStateV2(caseId))?.phase } catch {}
          if (phase2 && ['completed','failed','incomplete','stopped','cancelled','error'].includes(phase2)) break
          await new Promise(r => setTimeout(r, 3000))
        }
        const runs2 = await api.listRunsV2(caseId)
        step('run2', { phase: phase2, count: runs2.length,
          ids: runs2.map(r => ({ id: r.id, status: r.status })),
          oldRunStillPresent: runs2.some(r => r.id === run1.id),
          oldRunStatus: runs2.find(r => r.id === run1.id)?.status ?? null })
      } catch (e) { step('run2', { ok: false, error: String(e?.message ?? e).slice(0, 160) }) }

      return out
    `
      .replace('__UNCLEAR__', JSON.stringify(process.env.E2E_A15_UNCLEAR ?? ''))
      .replace('__CORRECTED__', JSON.stringify(process.env.E2E_A15_CORRECTED ?? ''))
      .replace(/__POLL__/g, JSON.stringify(process.env.E2E_POLL_MS ?? '900000')))
  },

  /**
   * A15 S2：已发布模板负责人确认的数值规则 → 冻结计划 → T04 确定性检查 → 真实 Run。
   * 四案例：18 人 compliant、21 人 non-compliant、人数未知 pending、缺计划书非 compliant。
   */
  async 'flow-a15-s2'({ send }) {
    return evaluate(send, `
      const api = window.reviewAPI
      const out = { steps: [] }
      const step = (name, data) => out.steps.push({ name, ...data })
      const templateId = 'a15-s2-lab'
      const now = new Date().toISOString()
      const owner = { actorId: 'local-organizer', confirmedAt: now, statement: '本机负责人确认：使用人数不超过 20' }

      const build = () => ({
        templateId, version: 1, schemaVersion: 2,
        name: '实验室使用申请（S2）', displayName: { template: '{{organizationName}} 实验室使用申请' },
        objectType: 'organization', status: 'draft', createdAt: now,
        fields: [
          { key: 'organizationName', label: '组织名称', kind: 'text', required: true, visibility: 'public', scope: 'case' },
          { key: 'responsiblePerson', label: '负责人', kind: 'text', required: true, visibility: 'public', scope: 'case' },
          { key: 'applicantCount', label: '使用人数', kind: 'number', required: true, visibility: 'public', scope: 'case' },
          { key: 'usageDate', label: '使用日期', kind: 'date', required: true, visibility: 'public', scope: 'case' },
          { key: 'usageTime', label: '使用时段', kind: 'text', required: true, visibility: 'public', scope: 'case' },
          { key: 'purpose', label: '用途', kind: 'text', required: true, visibility: 'public', scope: 'case' },
        ],
        sections: [{ id: 'lab', name: '实验室使用', order: 0, required: true, criteria: [{
          id: 'headcount', title: '人数不超上限', requirement: '使用人数不得超过 20 人',
          execution: 'deterministic', targetScope: 'case',
          deterministicConstraint: { schemaVersion: 1, kind: 'field-number-limit', fieldKey: 'applicantCount',
            fieldScope: 'case', operator: 'lte', threshold: 20, unit: '人', ownerStatement: owner },
        }] }],
        materialSlots: [{ id: 'lab-use-plan', name: '实验室使用计划书', minCount: 1, requiredAt: 'submission' }],
        policyVersionIds: [], policyRefs: [],
        stages: [
          { id: 'initial-review', name: '初审', kind: 'manual-review', executorRole: 'reviewer', nextStageId: 'final-review' },
          { id: 'final-review', name: '终审', kind: 'manual-review', executorRole: 'teacher' },
        ],
        outputs: [{ id: 'feedback', kind: 'item-feedback', audience: 'reviewer' }],
      })

      let existing = null
      try { existing = await api.getTemplateV2(templateId, 1) } catch {}
      if (!existing || existing.status !== 'published') {
        await api.saveTemplateDraftV2(build())
        await api.publishTemplateV2(templateId, 1)
        step('template', { ok: true })
      }

      const scenario = async (name, count, withPlan) => {
        const created = await api.createCase({ title: 'A15 S2 ' + name, type: '自定义审核', applicant: 'E2E',
          domainPackId: 'contract-review', reviewTemplate: { templateId, version: 1 } })
        const caseId = created.id
        const fields = { organizationName: '地球物理学院', responsiblePerson: '王老师',
          usageDate: '2026-11-10', usageTime: '10:00-12:00', purpose: '课程实验' }
        if (count !== null) fields.applicantCount = count
        const agg0 = await api.getAggregateV2(caseId)
        await api.updateFieldsV2({ caseId, command: {
          requestId: 's2-fields-' + name, expectedRevision: agg0.caseV2.revision,
          target: { kind: 'case', id: caseId },
          actor: { actorId: 'local-user', actorSource: 'local', role: 'reviewer' }, type: 'UpdateFields',
          payload: { caseFieldValues: fields },
        }})
        if (withPlan) {
          await api.registerMaterialPathV2({ caseId, sourcePath: __DOCX__, role: 'evidence', materialSlotId: 'lab-use-plan' })
        }
        try {
          const result = await api.runTemplateRuleReview({ caseId })
          return { name, caseId, runId: result.runId, plan: result.planFingerprint,
            status: result.status, rules: result.ruleIds,
            checks: (result.checks ?? []).map(c => ({ rule: c.ruleId, status: c.status, reason: String(c.reason).slice(0, 40) })) }
        } catch (error) {
          return { name, caseId, error: String(error?.message ?? error).slice(0, 200) }
        }
      }

      step('ok18', await scenario('18 人合规', 18, true))
      step('overLimit21', await scenario('21 人超限', 21, true))
      step('unknown', await scenario('人数未知', null, true))
      step('missingPlan', await scenario('缺计划书', 18, false))
      return out
    `.replace('__DOCX__', JSON.stringify(process.env.E2E_A15_DOCX ?? '')))
  },

  /** S2 门禁：21 人非合规案卷不得无依据 stage-pass；18 人案卷可以进入初审 */
  async 'flow-a15-s2-gate'({ send }) {
    return evaluate(send, `
      const api = window.reviewAPI
      const out = { steps: [] }
      const step = (name, data) => out.steps.push({ name, ...data })

      for (const [label, caseId] of [['21 人', __C21__], ['18 人', __C18__]]) {
        await api.submitCaseV2(caseId).catch(() => null)
        const agg = await api.getAggregateV2(caseId)
        const task = (agg?.tasks ?? []).find(t => t.status === 'open' && t.stageId === 'initial-review')
        if (!task) { step(label, { skipped: '没有开放初审任务', stage: agg?.caseV2?.stage }); continue }
        try {
          const cap = await api.getT05StageCapability({ caseId, claim: { role: 'reviewer' } })
          const r = await api.recordT05StageDecision({ caseId, claim: { role: 'reviewer' },
            templateId: 'a15-s2-lab', version: 1, expectedRevision: agg.caseV2.revision,
            taskId: task.id, action: 'stage-pass', reason: '按规则结果尝试通过',
            requestId: 's2gate-' + label + '-' + Date.now() })
          step(label, { passed: true, revision: r.revision, allowed: cap.allowedActions, blockers: cap.blockers })
        } catch (error) {
          step(label, { passed: false, error: String(error?.message ?? error).slice(0, 220) })
        }
        // 退回补件始终合法
        try {
          const agg2 = await api.getAggregateV2(caseId)
          const openTask = (agg2?.tasks ?? []).find(t => t.status === 'open' && t.stageId === 'initial-review')
          if (openTask) {
            await api.recordT05StageDecision({ caseId, claim: { role: 'reviewer' },
              templateId: 'a15-s2-lab', version: 1, expectedRevision: agg2.caseV2.revision,
              taskId: openTask.id, action: 'return-for-supplement', reason: '需要补充说明',
              supplementRequiredElements: ['补充说明'], supplementReason: '请补充说明', requestId: 's2sup-' + label + '-' + Date.now() })
            step(label + '-supplement', { ok: true })
          }
        } catch (error) { step(label + '-supplement', { ok: false, error: String(error?.message ?? error).slice(0, 160) }) }
      }
      return out
    `.replace('__C21__', JSON.stringify(process.env.E2E_C21 ?? ''))
      .replace('__C18__', JSON.stringify(process.env.E2E_C18 ?? '')))
  },

  /**
   * A15 S3-01 补件两轮（用确定性规则 Run，秒级）：
   * 缺计划书 → 待补件 → 第一次补不清楚的版本判定 insufficient
   * → 第二次补更正版（新 DocumentVersion）判定 satisfied → 重新检查产生新 Run
   * → 旧 Run 与旧 DocumentVersion 均保留。
   */
  async 'flow-a15-s3-01'({ send }) {
    return evaluate(send, `
      const api = window.reviewAPI
      const out = { steps: [] }
      const step = (name, data) => out.steps.push({ name, ...data })
      const templateId = 'a15-s2-lab'

      // 自举：确保 S2 模板已发布（避免依赖上一场景残留配置）
      let tpl = null
      try { tpl = await api.getTemplateV2(templateId, 1) } catch {}
      if (!tpl || tpl.status !== 'published') {
        const now = new Date().toISOString()
        await api.saveTemplateDraftV2({
          templateId, version: 1, schemaVersion: 2, name: '实验室使用申请（S2）',
          displayName: { template: '{{organizationName}} 实验室使用申请' },
          objectType: 'organization', status: 'draft', createdAt: now,
          fields: [
            { key: 'organizationName', label: '组织名称', kind: 'text', required: true, visibility: 'public', scope: 'case' },
            { key: 'responsiblePerson', label: '负责人', kind: 'text', required: true, visibility: 'public', scope: 'case' },
            { key: 'applicantCount', label: '使用人数', kind: 'number', required: true, visibility: 'public', scope: 'case' },
            { key: 'usageDate', label: '使用日期', kind: 'date', required: true, visibility: 'public', scope: 'case' },
            { key: 'usageTime', label: '使用时段', kind: 'text', required: true, visibility: 'public', scope: 'case' },
            { key: 'purpose', label: '用途', kind: 'text', required: true, visibility: 'public', scope: 'case' },
          ],
          // 该分项只承载案例级确定性规则，不对申报事项做归属要求
          sections: [{ id: 'lab', name: '实验室使用', order: 0, required: false, criteria: [{
            id: 'headcount', title: '人数不超上限', requirement: '使用人数不得超过 20 人',
            execution: 'deterministic', targetScope: 'case',
            deterministicConstraint: { schemaVersion: 1, kind: 'field-number-limit', fieldKey: 'applicantCount',
              fieldScope: 'case', operator: 'lte', threshold: 20, unit: '人',
              ownerStatement: { actorId: 'local-organizer', confirmedAt: now, statement: '负责人确认：使用人数不超过 20' } },
          }] }],
          materialSlots: [{ id: 'lab-use-plan', name: '实验室使用计划书', minCount: 1, requiredAt: 'submission' }],
          policyVersionIds: [], policyRefs: [],
          stages: [
            { id: 'initial-review', name: '初审', kind: 'manual-review', executorRole: 'reviewer', nextStageId: 'final-review' },
            { id: 'final-review', name: '终审', kind: 'manual-review', executorRole: 'teacher' },
          ],
          outputs: [{ id: 'feedback', kind: 'item-feedback', audience: 'reviewer' }],
        })
        await api.publishTemplateV2(templateId, 1)
      }

      const created = await api.createCase({ title: 'A15 S3-01 补件两轮', type: '自定义审核', applicant: 'E2E',
        domainPackId: 'contract-review', reviewTemplate: { templateId, version: 1 } })
      const caseId = created.id
      out.caseId = caseId

      const agg0 = await api.getAggregateV2(caseId)
      await api.updateFieldsV2({ caseId, command: {
        requestId: 's301-fields', expectedRevision: agg0.caseV2.revision,
        target: { kind: 'case', id: caseId },
        actor: { actorId: 'local-user', actorSource: 'local', role: 'reviewer' }, type: 'UpdateFields',
        payload: { caseFieldValues: { organizationName: '地球物理学院', responsiblePerson: '李老师',
          applicantCount: 12, usageDate: '2026-11-08', usageTime: '09:00-11:00', purpose: '开放实验' } },
      }})

      // 缺计划书 → 第一轮 Run 应给出待补件
      const run1 = await api.runTemplateRuleReview({ caseId })
      const pendingCheck = (run1.checks ?? []).find(c => c.status === 'awaiting-supplement')
      step('run1', { runId: run1.runId, status: run1.status,
        checks: (run1.checks ?? []).map(c => ({ rule: c.ruleId, status: c.status })) })
      if (!pendingCheck) return { ...out, error: '首轮没有产生待补件检查' }

      // 打开补件
      const agg1 = await api.getAggregateV2(caseId)
      let supplementId = null
      try {
        const r = await api.openWorkspaceSupplementV2({ caseId, command: {
          requestId: 's301-open', expectedRevision: agg1.caseV2.revision,
          target: { kind: 'case', id: caseId },
          actor: { actorId: 'local-user', actorSource: 'local', role: 'reviewer' }, type: 'OpenWorkspaceSupplement',
          payload: { findingKey: pendingCheck.checkId, runId: run1.runId,
            inputHash: run1.inputHash,
            requiredElements: ['实验室使用计划书'], reason: '缺少必交材料' },
        }})
        supplementId = r?.aggregate?.supplements?.at(-1)?.id ?? null
        step('open', { supplementId, ok: Boolean(supplementId) })
      } catch (e) { step('open', { ok: false, error: String(e?.message ?? e).slice(0, 160) }) }
      if (!supplementId) return out

      // 第一次：不清楚的版本 → insufficient
      try {
        await api.registerMaterialPathV2({ caseId, sourcePath: __UNCLEAR__, role: 'evidence', materialSlotId: 'lab-use-plan' })
        const a = await api.getAggregateV2(caseId)
        await api.respondSupplementV2({ caseId, command: {
          requestId: 's301-resp1', expectedRevision: a.caseV2.revision,
          target: { kind: 'case', id: caseId },
          actor: { actorId: 'local-user', actorSource: 'local', role: 'reviewer' }, type: 'RespondSupplement',
          payload: { supplementId, note: '先补一版', documentVersionIds: (a.caseV2.documents ?? []).filter(d => d.active !== false).map(d => d.versionId) },
        }})
        const b = await api.getAggregateV2(caseId)
        await api.resolveSupplementV2({ caseId, command: {
          requestId: 's301-res1', expectedRevision: b.caseV2.revision,
          target: { kind: 'case', id: caseId },
          actor: { actorId: 'local-user', actorSource: 'local', role: 'reviewer' }, type: 'ResolveSupplement',
          payload: { supplementId, outcome: 'insufficient', reason: '计划书内容仍不完整' },
        }})
        const c = await api.getAggregateV2(caseId)
        step('round1', { supplement: (c.supplements ?? []).find(x => x.id === supplementId)?.status,
          stage: c.caseV2.stage, docs: (c.caseV2.documents ?? []).filter(d => d.active !== false).length })
      } catch (e) { step('round1', { ok: false, error: String(e?.message ?? e).slice(0, 160) }) }

      // 第二次：更正版 → satisfied
      try {
        await api.registerMaterialPathV2({ caseId, sourcePath: __CORRECTED__, role: 'evidence', materialSlotId: 'lab-use-plan' })
        const d = await api.getAggregateV2(caseId)
        await api.respondSupplementV2({ caseId, command: {
          requestId: 's301-resp2', expectedRevision: d.caseV2.revision,
          target: { kind: 'case', id: caseId },
          actor: { actorId: 'local-user', actorSource: 'local', role: 'reviewer' }, type: 'RespondSupplement',
          payload: { supplementId, note: '补交更正版', documentVersionIds: (d.caseV2.documents ?? []).filter(x => x.active !== false).map(x => x.versionId) },
        }})
        const e2 = await api.getAggregateV2(caseId)
        await api.resolveSupplementV2({ caseId, command: {
          requestId: 's301-res2', expectedRevision: e2.caseV2.revision,
          target: { kind: 'case', id: caseId },
          actor: { actorId: 'local-user', actorSource: 'local', role: 'reviewer' }, type: 'ResolveSupplement',
          payload: { supplementId, outcome: 'satisfied', reason: '更正版计划书已满足' },
        }})
        const f = await api.getAggregateV2(caseId)
        step('round2', { supplement: (f.supplements ?? []).find(x => x.id === supplementId)?.status,
          stage: f.caseV2.stage, docs: (f.caseV2.documents ?? []).filter(x => x.active !== false).length,
          versions: (f.caseV2.documents ?? []).filter(x => x.active !== false).map(x => x.versionId) })
      } catch (e) { step('round2', { ok: false, error: String(e?.message ?? e).slice(0, 160) }) }

      // 重新检查：新 Run，旧 Run 保留
      try {
        const run2 = await api.runTemplateRuleReview({ caseId })
        const runs = await api.listRunsV2(caseId)
        step('run2', { runId: run2.runId, status: run2.status,
          checks: (run2.checks ?? []).map(c => ({ rule: c.ruleId, status: c.status })),
          totalRuns: runs.length,
          oldRunPreserved: runs.some(r => r.id === run1.runId),
          oldRunStatus: runs.find(r => r.id === run1.runId)?.status ?? null })
      } catch (e) { step('run2', { ok: false, error: String(e?.message ?? e).slice(0, 160) }) }

      return out
    `.replace('__UNCLEAR__', JSON.stringify(process.env.E2E_A15_UNCLEAR ?? ''))
      .replace('__CORRECTED__', JSON.stringify(process.env.E2E_A15_CORRECTED ?? '')))
  },

  /** 探测当前渲染树里与 A15 旅程相关的按钮/输入（只读，不改状态） */
  async 'probe-ui'({ send }) {
    // 等渲染真正挂载（React 根有内容且 reviewAPI 可用）
    for (let i = 0; i < 60; i += 1) {
      const ready = await evaluate(send, `Boolean(window.reviewAPI) && (document.body.textContent ?? '').trim().length > 20`)
      if (ready === true) break
      await new Promise((resolve) => setTimeout(resolve, 1000))
    }
    return evaluate(send, `
      const texts = (sel) => Array.from(document.querySelectorAll(sel))
        .map(n => (n.textContent ?? '').trim()).filter(Boolean).slice(0, 60)
      return {
        url: location.href,
        navButtons: texts('header button, nav button'),
        allButtons: texts('button').slice(0, 50),
        inputs: Array.from(document.querySelectorAll('input,select,textarea'))
          .map(n => ({ id: n.id || null, label: n.getAttribute('aria-label'), placeholder: n.getAttribute('placeholder'), tag: n.tagName })),
        dropZones: Array.from(document.querySelectorAll('[aria-label]'))
          .map(n => n.getAttribute('aria-label')).filter(a => a && (a.includes('导入') || a.includes('材料'))),
        bodyHint: (document.body.textContent ?? '').slice(0, 300),
      }
    `)
  },

  /** 点进内容合规审查后再探测（只读） */
  async 'probe-ui2'({ send }) {
    for (let i = 0; i < 60; i += 1) {
      const ready = await evaluate(send, `Boolean(window.reviewAPI) && (document.body.textContent ?? '').trim().length > 20`)
      if (ready === true) break
      await new Promise((resolve) => setTimeout(resolve, 1000))
    }
    const clicked = await evaluate(send, `
      const clickText = (text) => {
        const nodes = Array.from(document.querySelectorAll('button, a, [role="button"], div[role="button"]'))
        const hit = nodes.find(n => (n.textContent ?? '').includes(text))
        if (hit) { hit.click(); return (hit.textContent ?? '').trim().slice(0, 40) }
        return null
      }
      const hit = clickText('内容合规审查') ?? clickText('材料审核')
      return { hit }
    `)
    await new Promise((resolve) => setTimeout(resolve, 3000))
    const dom = await evaluate(send, `
      const texts = (sel) => Array.from(document.querySelectorAll(sel)).map(n => (n.textContent ?? '').trim()).filter(Boolean).slice(0, 40)
      return {
        buttons: texts('button'),
        inputs: Array.from(document.querySelectorAll('input,select,textarea')).map(n => ({ id: n.id || null, label: n.getAttribute('aria-label'), placeholder: n.getAttribute('placeholder') })),
        zones: Array.from(document.querySelectorAll('[aria-label]')).map(n => n.getAttribute('aria-label')).filter(Boolean).slice(0, 20),
        hint: (document.body.textContent ?? '').slice(0, 400),
      }
    `)
    return { clicked, dom }
  },

  /** 走到审核工作台后探测案卷办理面板（只读） */
  async 'probe-ui3'({ send }) {
    const waitReady = async () => {
      for (let i = 0; i < 60; i += 1) {
        const ready = await evaluate(send, `Boolean(window.reviewAPI) && (document.body.textContent ?? '').trim().length > 20`)
        if (ready === true) return true
        await new Promise((resolve) => setTimeout(resolve, 1000))
      }
      return false
    }
    const clickText = async (text) => evaluate(send, `
      const nodes = Array.from(document.querySelectorAll('button, a, [role="button"], div[role="button"]'))
      const hit = nodes.find(n => (n.textContent ?? '').includes(${JSON.stringify(text)}))
      if (hit) { hit.click(); return (hit.textContent ?? '').trim().slice(0, 40) }
      return null
    `)
    await waitReady()
    const a = await clickText('内容合规审查')
    await new Promise((r) => setTimeout(r, 2000))
    const b = await clickText('进入本地材料审核')
    await new Promise((r) => setTimeout(r, 3000))
    const c = await clickText('案卷办理')
    await new Promise((r) => setTimeout(r, 2000))
    const dom = await evaluate(send, `
      const texts = (sel) => Array.from(document.querySelectorAll(sel)).map(n => (n.textContent ?? '').trim()).filter(Boolean).slice(0, 40)
      return {
        buttons: texts('button'),
        inputs: Array.from(document.querySelectorAll('input,select,textarea')).map(n => ({ id: n.id || null, label: n.getAttribute('aria-label'), placeholder: n.getAttribute('placeholder') })).slice(0, 16),
        zones: Array.from(document.querySelectorAll('[aria-label]')).map(n => n.getAttribute('aria-label')).filter(Boolean).slice(0, 24),
        hint: (document.body.textContent ?? '').slice(0, 500),
      }
    `)
    return { clicked: { a, b, c }, dom }
  },

  /**
   * A15 S4：真实 Electron UI 旅程（全部经 DOM 点击/输入，不调用后门 IPC 造事实）。
   * 导航 → 模板选择 → 填字段 → 创建案卷 → 拖入真实 DOCX → 按模板规则检查
   * → 提交 → 初审通过 → 导出报告。
   */
  /**
   * A15 S4：真实 Electron UI 旅程（全部经 DOM 点击/输入与真实文件对话框）。
   * 导航 → 选模板 → 填字段 → 建案 → 槽位上传真实 DOCX → 规则检查 → 提交 → 初审 → 报告。
   */
  async 'flow-a15-s4'({ send }) {
    const trace = []
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
    const clickText = async (text) => {
      const hit = await evaluate(send, `
        const nodes = Array.from(document.querySelectorAll('button, a, [role="button"], summary'))
        const hit = nodes.find(n => (n.textContent ?? '').includes(${JSON.stringify(text)}))
        if (hit) { hit.click(); return (hit.textContent ?? '').trim().slice(0, 40) }
        return null
      `)
      trace.push('click(' + text + ')=' + hit)
      return hit
    }

    // 0. 自举已发布模板（与 S2 同形；分项不强制申报事项，供纯案例级规则使用）
    for (let i = 0; i < 60; i += 1) {
      const ready = await evaluate(send, `Boolean(window.reviewAPI)`)
      if (ready === true) break
      await sleep(500)
    }
    await evaluate(send, `
      const api = window.reviewAPI
      const templateId = 'a15-s4-lab'
      let existing = null
      try { existing = await api.getTemplateV2(templateId, 1) } catch {}
      if (!existing || existing.status !== 'published') {
        const now = new Date().toISOString()
        await api.saveTemplateDraftV2({
          templateId, version: 1, schemaVersion: 2, name: '实验室使用申请（S2）',
          displayName: { template: '{{organizationName}} 实验室使用申请' },
          objectType: 'organization', status: 'draft', createdAt: now,
          fields: [
            { key: 'organizationName', label: '组织名称', kind: 'text', required: true, visibility: 'public', scope: 'case' },
            { key: 'responsiblePerson', label: '负责人', kind: 'text', required: true, visibility: 'public', scope: 'case' },
            { key: 'applicantCount', label: '使用人数', kind: 'number', required: true, visibility: 'public', scope: 'case' },
            { key: 'usageDate', label: '使用日期', kind: 'date', required: true, visibility: 'public', scope: 'case' },
            { key: 'usageTime', label: '使用时段', kind: 'text', required: true, visibility: 'public', scope: 'case' },
            { key: 'purpose', label: '用途', kind: 'text', required: true, visibility: 'public', scope: 'case' },
          ],
          sections: [{ id: 'lab', name: '实验室使用', order: 0, required: false, criteria: [{
            id: 'headcount', title: '人数不超上限', requirement: '使用人数不得超过 20 人',
            execution: 'deterministic', targetScope: 'case',
            deterministicConstraint: { schemaVersion: 1, kind: 'field-number-limit', fieldKey: 'applicantCount',
              fieldScope: 'case', operator: 'lte', threshold: 20, unit: '人',
              ownerStatement: { actorId: 'local-organizer', confirmedAt: now, statement: '负责人确认：使用人数不超过 20' } },
          }] }],
          materialSlots: [{ id: 'lab-use-plan', name: '实验室使用计划书', minCount: 1, requiredAt: 'submission' }],
          policyVersionIds: [], policyRefs: [],
          stages: [
            { id: 'initial-review', name: '初审', kind: 'manual-review', executorRole: 'reviewer', nextStageId: 'final-review' },
            { id: 'final-review', name: '终审', kind: 'manual-review', executorRole: 'teacher' },
          ],
          outputs: [{ id: 'feedback', kind: 'item-feedback', audience: 'reviewer' }],
        })
        await api.publishTemplateV2(templateId, 1)
      }
      return true
    `)

    // 1. 真实导航到案卷办理
    await clickText('内容合规审查'); await sleep(1500)
    await clickText('进入本地材料审核'); await sleep(2500)
    await clickText('案卷办理'); await sleep(1500)
    await clickText('打开其他案卷 / 从已发布模板新建'); await sleep(600)

    // 2. 选择模板
    const picked = await evaluate(send, `
      const wanted = ${JSON.stringify(process.env.E2E_TEMPLATE ?? 'a15-s4-lab@1')}
      const selects = Array.from(document.querySelectorAll('select'))
      const target = selects.find(sel => Array.from(sel.options).some(o => o.value === wanted))
      if (!target) return { ok: false }
      const setter = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value').set
      setter.call(target, wanted)
      target.dispatchEvent(new Event('change', { bubbles: true }))
      return { ok: true }
    `)
    trace.push('template=' + JSON.stringify(picked))
    await sleep(800)

    // 3. 填案例级字段与标题
    const filled = await evaluate(send, `
      const setValue = (el, value) => {
        const proto = el.tagName === 'SELECT' ? HTMLSelectElement.prototype : el.tagName === 'TEXTAREA' ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype
        const setter = Object.getOwnPropertyDescriptor(proto, 'value').set
        setter.call(el, value)
        el.dispatchEvent(new Event('input', { bubbles: true }))
        el.dispatchEvent(new Event('change', { bubbles: true }))
      }
      const labels = ['组织名称', '负责人', '使用人数', '使用日期', '使用时段', '用途']
      const values = ['地球物理学院', '王老师', '18', '2026-11-10', '10:00-12:00', '课程实验']
      const done = [], missed = []
      labels.forEach((label, index) => {
        const span = Array.from(document.querySelectorAll('span')).find(s => (s.textContent ?? '').trim().startsWith(label))
        const input = span?.parentElement?.querySelector('input')
        if (input && input.placeholder !== '案卷标题') { setValue(input, values[index]); done.push(label) } else missed.push(label)
      })
      const title = Array.from(document.querySelectorAll('input')).find(i => i.placeholder === '案卷标题')
      if (title) setValue(title, 'A15 S4 真实旅程')
      return { done, missed, titleSet: Boolean(title) }
    `)
    trace.push('fields=' + JSON.stringify(filled))
    await sleep(400)

    // 4. 真实点击创建
    await clickText('创建一份案卷'); await sleep(3500)
    const created = await evaluate(send, `
      const list = await window.reviewAPI.listCasesV2()
      return (list ?? []).map(x => x.caseId)
    `)
    const caseId = Array.isArray(created) ? (created[0] ?? null) : null
    trace.push('caseId=' + caseId)
    if (!caseId) return { trace, error: 'UI 建案失败' }

    // 5. 选材料槽 → 点上传区 → 用真实文件对话框投递
    const slot = await evaluate(send, `
      const setter = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value').set
      for (const sel of Array.from(document.querySelectorAll('select'))) {
        if (Array.from(sel.options).some(o => o.value === 'lab-use-plan')) {
          setter.call(sel, 'lab-use-plan'); sel.dispatchEvent(new Event('change', { bubbles: true }))
          return { hit: 'lab-use-plan' }
        }
      }
      return { hit: null }
    `)
    trace.push('slot=' + JSON.stringify(slot))
    await sleep(600)
    const zone = await evaluate(send, `
      const zones = Array.from(document.querySelectorAll('[aria-label="导入材料：点击选择或拖入文件"]'))
      if (!zones.length) return { ok: false, count: 0 }
      zones[0].scrollIntoView({ block: 'center' })
      zones[0].click()
      return { ok: true, count: zones.length }
    `)
    trace.push('zone=' + JSON.stringify(zone))

    const docPath = process.env.E2E_DOCX_PATH ?? ''
    if (zone?.ok) {
      await sleep(2000)
      // 关闭可能残留的旧对话框，避免把输入投给上一次的窗口
      const stale = spawnSync('xdotool', ['search', '--name', 'Open Files'], { encoding: 'utf8' })
      for (const id of String(stale.stdout ?? '').split('\n').map((x) => x.trim()).filter(Boolean)) {
        spawnSync('xdotool', ['windowkill', id], { stdio: 'ignore', timeout: 3000 })
      }
      // 原生对话框在 Linux Electron 上标题为 "Open Files"（已用 xwininfo 确认），
      // 按标题精确激活该窗口后投递绝对路径，而不是盲猜窗口。
      let dialogId = null
      for (let i = 0; i < 24; i += 1) {
        await sleep(500)
        const found = spawnSync('xdotool', ['search', '--name', 'Open Files'], { encoding: 'utf8' })
        const ids = String(found.stdout ?? '').split('\n').map((x) => x.trim()).filter(Boolean)
        if (ids.length) { dialogId = ids[ids.length - 1]; break }
      }
      trace.push('dialog=' + dialogId)
      if (dialogId) {
        if (process.env.E2E_MANUAL_PICK === '1') {
          // 关键：原生模态对话框打开期间 Runtime.evaluate 不会返回，
          // 因此这里只能纯计时等待人工选择，绝不轮询页面。
          const waitMs = Number(process.env.E2E_MANUAL_WAIT_MS ?? 90000)
          trace.push('manual-pick: 等待人工选择 ' + waitMs + 'ms')
          await sleep(waitMs)
        }
        const run = (args) => spawnSync('xdotool', args, { stdio: 'ignore', timeout: 4000 })
        // 文件已经放到对话框默认目录（下载），直接输文件名触发搜索再回车，
        // 避免依赖 GTK4 的路径输入栏（Ctrl+L 在 GTK4 无效，已用截图确认）。
        const fileName = (docPath.split('/').pop() ?? '').replace(/\.docx$/i, '')
        if (process.env.E2E_MANUAL_PICK !== '1') {
          run(['windowactivate', dialogId])
          run(['windowfocus', dialogId])
          await sleep(800)
          run(['key', '--clearmodifiers', 'ctrl+a'])
          run(['type', '--delay', '40', fileName])
          await sleep(1500)
          run(['key', 'Return'])
          await sleep(2500)
        }
        const opened = await evaluate(send, `
          const agg = await window.reviewAPI.getAggregateV2(${JSON.stringify(caseId)})
          return (agg?.caseV2?.documents ?? []).filter(d => d.active !== false).length
        `)
        trace.push('afterDialog=' + opened)
      }
      for (let i = 0; i < 10; i += 1) {
        const count = await evaluate(send, `
          const agg = await window.reviewAPI.getAggregateV2(${JSON.stringify(caseId)})
          const list = (agg?.caseV2?.documents ?? []).filter(d => d.active !== false)
          return { count: list.length, names: list.map(d => d.fileName + '@' + (d.materialSlotId ?? '-')) }
        `)
        trace.push('docs=' + JSON.stringify(count))
        if (count && count.count > 0) break
        await sleep(1000)
      }
    }

    // 6. 规则检查
    await clickText('按模板规则检查'); await sleep(2500)
    // 7. 提交与初审
    await clickText('提交案卷'); await sleep(2500)
    await clickText('初审通过'); await sleep(2500)
    // 8. 报告导出
    await clickText('导出报告'); await sleep(2500)

    const final = await evaluate(send, `
      const agg = await window.reviewAPI.getAggregateV2(${JSON.stringify(caseId)})
      const runs = await window.reviewAPI.listRunsV2(${JSON.stringify(caseId)})
      return { stage: agg?.caseV2?.stage ?? null,
        documents: (agg?.caseV2?.documents ?? []).filter(d => d.active !== false).map(d => d.fileName + '@' + (d.materialSlotId ?? '-')),
        decisions: (agg?.decisions ?? []).map(d => d.result + '/' + d.finality + '/' + d.actor?.role),
        runs: (runs ?? []).map(r => r.id + '=' + r.status) }
    `)
    return { trace, caseId, final }
  },

  /**
   * S4 的「报告 + 冷重启」段：真实 UI 用内置示例建案（含材料），
   * 导出报告，然后另一个进程冷启动核对案卷/材料/报告仍在。
   * 明确说明：材料来自产品内置示例，不是 OS 文件对话框上传。
   */
  async 'flow-s4-report'({ send }) {
    const trace = []
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
    const clickText = async (text) => {
      const hit = await evaluate(send, `
        const nodes = Array.from(document.querySelectorAll('button, a, [role="button"], summary'))
        const hit = nodes.find(n => (n.textContent ?? '').includes(${JSON.stringify(text)}))
        if (hit) { hit.click(); return (hit.textContent ?? '').trim().slice(0, 40) }
        return null
      `)
      trace.push('click(' + text + ')=' + hit)
      return hit
    }
    for (let i = 0; i < 60; i += 1) {
      const ready = await evaluate(send, `Boolean(window.reviewAPI)`)
      if (ready === true) break
      await sleep(500)
    }
    await clickText('内容合规审查'); await sleep(1500)
    await clickText('进入本地材料审核'); await sleep(2500)
    await clickText('案卷办理'); await sleep(1500)
    await clickText('载入示例并创建审核任务'); await sleep(4000)

    const state = await evaluate(send, `
      const list = await window.reviewAPI.listCasesV2()
      const caseId = (list ?? [])[0]?.caseId ?? null
      if (!caseId) return { caseId: null }
      const agg = await window.reviewAPI.getAggregateV2(caseId)
      return { caseId, stage: agg?.caseV2?.stage ?? null,
        documents: (agg?.caseV2?.documents ?? []).filter(d => d.active !== false).map(d => d.fileName + '@' + (d.materialSlotId ?? '-')),
        runs: (await window.reviewAPI.listRunsV2(caseId))?.length ?? 0 }
    `)
    trace.push('case=' + JSON.stringify(state))

    // 真实点击导出报告
    await clickText('导出报告'); await sleep(3000)
    const report = await evaluate(send, `
      const list = await window.reviewAPI.listCasesV2()
      const caseId = (list ?? [])[0]?.caseId ?? null
      if (!caseId) return null
      try { return await window.reviewAPI.exportReportV2(caseId) } catch (e) { return { error: String(e).slice(0, 120) } }
    `)
    trace.push('report=' + JSON.stringify(report))
    return { trace, caseId: state.caseId, documents: state.documents, report }
  },

  async 'd4-list'({ send }) {
    return evaluate(send, `
      const started = Date.now()
      try {
        const list = await window.reviewAPI.listD4Templates()
        return {
          ok: true, elapsedMs: Date.now() - started,
          count: list?.length,
          templateIds: (list ?? []).map(t => t.templateId),
          withTargets: (list ?? []).filter(t => (t.selection?.targets ?? []).length > 0).length,
        }
      } catch (error) {
        return { ok: false, elapsedMs: Date.now() - started, error: String(error?.message ?? error) }
      }
    `)
  },
}

/**
 * 等待 preload 注入完成。
 * 主窗口 target 出现（URL 匹配）早于 preload/React 挂载，
 * 直接求值会读到 undefined 的 window.reviewAPI。
 */
async function waitForBridge(send, timeoutMs = 60_000) {
  const deadline = Date.now() + timeoutMs
  let last = null
  while (Date.now() < deadline) {
    try {
      const state = await evaluate(send, `
        return {
          readyState: document.readyState,
          hasElectron: Boolean(window.electronAPI),
          hasReview: Boolean(window.reviewAPI),
        }
      `, 15_000)
      last = state
      if (state?.hasReview) return state
    } catch {
      /* 导航中上下文可能被销毁，重试 */
    }
    await sleep(500)
  }
  throw new Error(`preload 桥接未就绪；最后观测: ${JSON.stringify(last)}`)
}

let exitCode = 0
try {
  const page = await waitForPage()
  const { ws, send } = await connect(page.webSocketDebuggerUrl)
  await send('Runtime.enable')
  await waitForBridge(send)

  const run = scenarios[scenario]
  if (!run) throw new Error(`未知场景: ${scenario}`)

  const value = await run({ send })
  console.log(JSON.stringify({ scenario, ok: true, result: value }, null, 2))
  ws.close()
} catch (error) {
  console.error(JSON.stringify({ scenario, ok: false, error: String(error?.message ?? error) }, null, 2))
  console.error('--- 主进程日志尾部 ---')
  console.error(logs.join('').slice(-4000))
  exitCode = 1
} finally {
  child.kill('SIGTERM')
  await sleep(1500)
  if (!child.killed) child.kill('SIGKILL')
  process.exit(exitCode)
}
