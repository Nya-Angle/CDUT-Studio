/**
 * S4 分步驱动：连接已经独立运行的应用（不负责启动，也不会杀掉它）。
 *
 * 背景：原生模态对话框打开期间 Runtime.evaluate 不会返回。若由同一脚本
 * 启动并持有 Electron，脚本一退出就会连带杀掉应用，导致"点开对话框后应用消失"。
 * 因此这里只附加到既有实例，按 argv 执行 prepare / finish 两段。
 */
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const PORT = Number(process.env.E2E_CDP_PORT ?? 9333)
const step = process.argv[2] ?? 'prepare'

const targets = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json()
const page = targets.find((t) => t.type === 'page' && /^https?:\/\/localhost:\d+/.test(t.url ?? ''))
if (!page) { console.error('找不到主窗口页面'); process.exit(2) }

const ws = new WebSocket(page.webSocketDebuggerUrl)
await new Promise((resolve, reject) => { ws.onopen = resolve; ws.onerror = reject })
let seq = 0
const pending = new Map()
ws.onmessage = (event) => {
  const msg = JSON.parse(event.data)
  const waiter = pending.get(msg.id)
  if (waiter) { pending.delete(msg.id); waiter(msg) }
}
const send = (method, params = {}) => new Promise((resolve) => {
  const id = ++seq
  pending.set(id, resolve)
  ws.send(JSON.stringify({ id, method, params }))
})
const evaluate = async (expression, timeoutMs = 60000) => {
  const result = await send('Runtime.evaluate', {
    expression, awaitPromise: true, returnByValue: true, userGesture: true,
  })
  if (result?.result?.exceptionDetails) {
    throw new Error(result.result.exceptionDetails.exception?.description ?? '求值异常')
  }
  return result?.result?.result?.value
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const clickText = async (text) => evaluate(`(() => {
  const nodes = Array.from(document.querySelectorAll('button, a, [role="button"], summary'))
  const hit = nodes.find(n => (n.textContent ?? '').includes(${JSON.stringify(text)}))
  if (hit) { hit.click(); return (hit.textContent ?? '').trim().slice(0, 40) }
  return null
})()`)
const out = []
const log = (label, value) => { out.push([label, value]); console.log(label, '=', typeof value === 'string' ? value : JSON.stringify(value)) }

if (step === 'prepare') {
  // 自举已发布模板（该实例配置可能是全新的）
  const boot = await evaluate(`(async () => {
    const api = window.reviewAPI
    const templateId = 'a15-s4-lab'
    let existing = null
    try { existing = await api.getTemplateV2(templateId, 1) } catch {}
    if (existing && existing.status === 'published') return 'exists'
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
    return 'published'
  })()`)
  log('templateBootstrap', boot)
  // 模板列表在面板挂载时加载一次；无论本次是否新发布，都刷新一次以拿到最新列表
  await evaluate('location.reload()').catch(() => null)
  await sleep(6000)
  await evaluate('Boolean(window.reviewAPI)').then(async (ok) => { if (!ok) { await sleep(2000) } })
  log('nav1', await clickText('内容合规审查')); await sleep(1500)
  log('nav2', await clickText('进入本地材料审核')); await sleep(2500)
  // 先到模板页再回案卷页，触发模板列表刷新（IPC 发布不会自动通知面板）
  log('nav3', await clickText('审核模板')); await sleep(1200)
  log('nav4', await clickText('案卷办理')); await sleep(1800)
  log('openDetails', await clickText('打开其他案卷 / 从已发布模板新建')); await sleep(800)
  const picked = await evaluate(`(() => {
    const wanted = ${JSON.stringify(process.env.E2E_TEMPLATE ?? 'a15-s4-lab@1')}
    const sel = Array.from(document.querySelectorAll('select')).find(s => Array.from(s.options).some(o => o.value === wanted))
    if (!sel) return false
    const setter = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value').set
    setter.call(sel, wanted); sel.dispatchEvent(new Event('change', { bubbles: true })); return true
  })()`)
  log('template', picked)
  await sleep(700)
  const filled = await evaluate(`(() => {
    const setValue = (el, v) => {
      const proto = el.tagName === 'TEXTAREA' ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype
      Object.getOwnPropertyDescriptor(proto, 'value').set.call(el, v)
      el.dispatchEvent(new Event('input', { bubbles: true })); el.dispatchEvent(new Event('change', { bubbles: true }))
    }
    const labels = ['组织名称','负责人','使用人数','使用日期','使用时段','用途']
    const values = ['地球物理学院','王老师','18','2026-11-10','10:00-12:00','课程实验']
    const done = []
    labels.forEach((label, i) => {
      const span = Array.from(document.querySelectorAll('span')).find(s => (s.textContent ?? '').trim().startsWith(label))
      const input = span?.parentElement?.querySelector('input')
      if (input && input.placeholder !== '案卷标题') { setValue(input, values[i]); done.push(label) }
    })
    const title = Array.from(document.querySelectorAll('input')).find(i => i.placeholder === '案卷标题')
    if (title) setValue(title, 'A15 S4 人工选文件')
    return done
  })()`)
  log('fields', filled)
  await clickText('创建一份案卷'); await sleep(3500)
  const caseIds = await evaluate(`(async () => (await window.reviewAPI.listCasesV2() ?? []).map(x => x.caseId))()`)
  log('caseIds', caseIds)
  const slot = await evaluate(`(() => {
    const setter = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value').set
    for (const sel of Array.from(document.querySelectorAll('select'))) {
      if (Array.from(sel.options).some(o => o.value === 'lab-use-plan')) {
        setter.call(sel, 'lab-use-plan'); sel.dispatchEvent(new Event('change', { bubbles: true })); return 'lab-use-plan'
      }
    }
    return null
  })()`)
  log('slot', slot)
  await sleep(600)
  const zone = await evaluate(`(() => {
    const zones = Array.from(document.querySelectorAll('[aria-label="导入材料：点击选择或拖入文件"]'))
    if (!zones.length) return 0
    zones[0].scrollIntoView({ block: 'center' }); zones[0].click(); return zones.length
  })()`)
  log('zoneClicked', zone)
  console.log('DIALOG_SHOULD_BE_OPEN')
} else if (step === 'finish') {
  const caseIds = await evaluate(`(async () => (await window.reviewAPI.listCasesV2() ?? []).map(x => x.caseId))()`)
  const caseId = caseIds?.[0] ?? null
  log('caseId', caseId)
  if (!caseId) process.exit(3)
  const docs = await evaluate(`(async () => {
    const agg = await window.reviewAPI.getAggregateV2(${JSON.stringify(caseId)})
    return (agg?.caseV2?.documents ?? []).filter(d => d.active !== false).map(d => d.fileName + '@' + (d.materialSlotId ?? '-'))
  })()`)
  log('documents', docs)
  await clickText('按模板规则检查'); await sleep(3000)
  const run = await evaluate(`(async () => {
    const runs = await window.reviewAPI.listRunsV2(${JSON.stringify(caseId)})
    const r = (runs ?? [])[0]
    return r ? { id: r.id, status: r.status, checks: (r.checks ?? []).map(c => c.ruleId + '=' + c.status) } : null
  })()`)
  log('run', run)
  await clickText('提交案卷'); await sleep(2500)
  await clickText('初审通过'); await sleep(2500)
  const decided = await evaluate(`(async () => {
    const agg = await window.reviewAPI.getAggregateV2(${JSON.stringify(caseId)})
    return { stage: agg?.caseV2?.stage ?? null,
      decisions: (agg?.decisions ?? []).map(d => d.result + '/' + d.finality + '/' + d.actor?.role) }
  })()`)
  log('decided', decided)
  await clickText('导出报告'); await sleep(2500)
  console.log('STEPS_DONE')
}
ws.close()
