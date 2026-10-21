/**
 * Real Electron renderer smoke replay for PR #1, over localhost CDP.
 * No school identity, no external SchoolPort, no model API.
 * A failed or unreachable UI is NOT-RUN/FAIL, never silently PASS.
 */
import { mkdirSync, writeFileSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import WebSocket from 'ws'

const reportDir = process.env.QA_REPORT_DIR
if (!reportDir) throw new Error('QA_REPORT_DIR is required')
mkdirSync(reportDir, { recursive: true })
const accountDoc = readFileSync('docs/design/review-agent/16-batch-review-stage-b-local-acceptance.md', 'utf8')
const demoUser = accountDoc.match(/\|\s*账号\s*\|\s*([^|]+)\|/)?.[1]?.trim().replace(/`/g, '')
const demoPass = accountDoc.match(/\|\s*密码\s*\|\s*([^|]+)\|/)?.[1]?.trim().replace(/`/g, '')
if (!demoUser || !demoPass) throw new Error('Demo login fixture not documented; refusing to guess credentials')
const results = []
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
const deadline = (ms) => Date.now() + ms
let ws
let seq = 0
const pending = new Map()

async function connect() {
  const end = deadline(120000)
  let url
  while (Date.now() < end) {
    try {
      const response = await fetch('http://127.0.0.1:9222/json/list')
      const pages = await response.json()
      url = pages.find((x) => (x.url || '').startsWith('http://localhost:5176'))?.webSocketDebuggerUrl
      if (url) break
    } catch {}
    await delay(1000)
  }
  if (!url) throw new Error('No real app renderer target on Electron debugging port')
  ws = new WebSocket(url)
  await new Promise((resolve, reject) => {
    ws.once('open', resolve)
    ws.once('error', reject)
  })
  ws.on('message', (raw) => {
    const msg = JSON.parse(String(raw))
    const waiter = pending.get(msg.id)
    if (waiter) {
      pending.delete(msg.id)
      if (msg.error) waiter.reject(new Error(JSON.stringify(msg.error)))
      else waiter.resolve(msg.result)
    }
  })
  await send('Runtime.enable')
  await send('Page.enable')
}
async function send(method, params = {}) {
  const id = ++seq
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => {
      pending.delete(id)
      reject(new Error('CDP timeout: ' + method))
    }, 30000)
    pending.set(id, { resolve: (v) => { clearTimeout(t); resolve(v) },
      reject: (e) => { clearTimeout(t); reject(e) } })
    ws.send(JSON.stringify({ id, method, params }))
  })
}
async function evaluate(expression) {
  const res = await send('Runtime.evaluate', {
    expression, awaitPromise: true, returnByValue: true, userGesture: true,
  })
  if (res.exceptionDetails) throw new Error('Renderer JS exception: ' + (res.exceptionDetails.text || '') +
    ' ' + (res.exceptionDetails.exception?.description || ''))
  return res.result?.value
}
async function eventually(name, expression, ms = 30000) {
  const end = deadline(ms)
  let last
  while (Date.now() < end) {
    try { last = await evaluate(expression); if (last) return last } catch (error) { last = String(error) }
    await delay(400)
  }
  throw new Error(name + ' timed out; last=' + JSON.stringify(last) +
    '; page=' + JSON.stringify(await evaluate('document.body?.innerText?.slice(0, 1600)')))
}
async function screenshot(name) {
  const png = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false })
  writeFileSync(join(reportDir, name + '.png'), Buffer.from(png.data, 'base64'))
}
async function record(name, fn) {
  const start = Date.now()
  try {
    const details = await fn()
    results.push({ name, status: 'PASS', durationMs: Date.now() - start, details })
    console.log('[PASS] ' + name, details ? JSON.stringify(details) : '')
  } catch (e) {
    results.push({ name, status: 'FAIL', durationMs: Date.now() - start, error: String(e) })
    console.error('[FAIL] ' + name + ': ' + e)
    await screenshot('failure-' + results.length).catch(() => {})
    throw e
  } finally {
    writeFileSync(join(reportDir, 'electron-ui-results.json'), JSON.stringify(results, null, 2))
  }
}
async function clickText(text) {
  const ok = await evaluate('(() => { const target = ' + JSON.stringify(text) + '; ' +
    'const elements = [...document.querySelectorAll("button,a,[role=button],[role=tab]")];' +
    'const el = elements.find(e => e.getClientRects().length && (e.textContent || "").trim().includes(target));' +
    'if (el) { el.click(); return true }' +
    'const any = [...document.querySelectorAll("body *")].find(e => e.children.length === 0 && (e.textContent || "").trim() === target && e.getClientRects().length);' +
    'if (any) { (any.closest("button,a,[role=button],[role=tab],.cursor-pointer") || any).click(); return true }' +
    'return false })()')
  if (!ok) throw new Error('Visible clickable text not found: ' + text +
    '; page=' + JSON.stringify(await evaluate('document.body?.innerText?.slice(0, 1800)')))
}
async function selectValue(selector, value) {
  const ok = await evaluate('(() => { const el = document.querySelector(' + JSON.stringify(selector) + ');' +
    'if (!el) return false; const setter=Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype,"value").set;' +
    'setter.call(el, ' + JSON.stringify(value) + '); el.dispatchEvent(new Event("change",{bubbles:true})); return true })()')
  if (!ok) throw new Error('Select absent: ' + selector)
}
async function loginAndOpenBatch() {
  await eventually('preload ready', '!!window.reviewAPI && !!window.reviewAPI.createCaseV2', 90000)
  if (!(await evaluate('document.body?.innerText?.includes("QA 补件历史")'))) {
    await eventually('real navigation ready', 'document.body?.innerText?.includes("CDUT 专区")', 90000)
    await clickText('CDUT 专区')
    await delay(650)
    const loginVisible = await evaluate('!!document.querySelector("input[type=password]")')
    if (loginVisible) {
      const ok = await evaluate('(() => { const pass=document.querySelector("input[type=password]");' +
        'const visible=[...document.querySelectorAll("input")].filter(e=>e.getClientRects().length);' +
        'const user=visible.find(e=>e!==pass && ["text","number","tel",""].includes(e.type));' +
        'if (!user || !pass) return false; const setter=Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,"value").set;' +
        'for(const [el,value] of [[user,' + JSON.stringify(demoUser) + '],[pass,' + JSON.stringify(demoPass) + ']]){' +
        'setter.call(el,value);el.dispatchEvent(new Event("input",{bubbles:true}));el.dispatchEvent(new Event("change",{bubbles:true}))}' +
        'return true })()')
      if (!ok) throw new Error('Demo login fields not located')
      await clickText('一键连接特区账户')
    }
    await eventually('material review entry', 'document.body?.innerText?.includes("材料审核")', 35000)
    await clickText('材料审核')
    await eventually('batch management entry', 'document.body?.innerText?.includes("批次管理")', 35000)
    await clickText('批次管理')
  }
  await eventually('real batch screen', 'document.body?.innerText?.includes("QA 补件历史") && document.body?.innerText?.includes("批量审核")', 35000)
}
try {
  await connect()
  await record('Actual Electron UI: fixture entry', async () => {
    await loginAndOpenBatch()
    await screenshot('01-batch-screen')
    return { entry: 'CDUT 专区 → 材料审核 → 批次管理', renderer: 'Electron CDP' }
  })
  await record('Actual Electron IPC: original traversal exploit rejected without files', async () => {
    const res = await evaluate('(async()=>{try{await window.reviewAPI.createCaseV2({' +
      'caseId:"../../path-poc",templateId:"qa-review-template",version:1,' +
      'payload:{title:"synthetic",fieldValues:{},subjects:[]},' +
      'actor:{actorId:"qa",actorSource:"local",role:"reviewer"}});' +
      'return {blocked:false}}catch(e){return {blocked:true,message:String(e)}}})()')
    if (!res.blocked || !res.message.includes('非法 caseId')) throw new Error('Traversal was not rejected: ' + JSON.stringify(res))
    return { rejected: true, reason: '非法 caseId', filesystemCheck: 'workflow side-effect assertion' }
  })
  await record('Actual Electron UI: historical return remains history after requeue', async () => {
    await eventually('queued historical row', 'document.body?.innerText?.includes("待本轮重新审核")', 30000)
    await eventually('historic action row', 'document.body?.innerText?.includes("上次动作：自动退回补件（历史记录）")', 30000)
    await screenshot('02-requeue-history')
    return { displayed: ['待本轮重新审核', '上次动作：自动退回补件（历史记录）'] }
  })
  await record('Actual Electron UI: authorization denial strips IPC transport prefix', async () => {
    await clickText('自动化：自动补件')
    await eventually('strategy dialog', '!!document.querySelector("[role=dialog] select")')
    await selectValue('[role=dialog] select', 'auto-approve')
    const checked = await evaluate('(() => { const el=document.querySelector("[role=dialog] input[type=checkbox]"); if(!el)return false;el.click();return el.checked })()')
    if (!checked) throw new Error('Strategy confirmation not selectable')
    await clickText('确认启用策略')
    await eventually('visible business denial', 'document.querySelector("[role=dialog] [role=alert]")?.textContent?.includes("全局 AI 代批授权未开启")', 25000)
    const txt = await evaluate('document.querySelector("[role=dialog] [role=alert]")?.textContent')
    if (txt.includes('Error invoking remote method')) throw new Error('Transport wrapper leaked: ' + txt)
    await screenshot('03-authorization-denial')
    await clickText('取消')
    return { visibleReason: txt }
  })
  await record('Actual Electron UI: finalization denial strips IPC transport prefix', async () => {
    await clickText('核验并定稿')
    await eventually('finalization denial toast', 'document.body?.innerText?.includes("批次尚不能定稿：")', 25000)
    const text = await evaluate('document.body?.innerText || ""')
    if (text.includes('Error invoking remote method')) throw new Error('Transport prefix visible in UI')
    await screenshot('04-finalization-denial')
    return { denied: true, reasonIsUserFacing: true }
  })
  await record('Actual Electron UI: failed queue never produces generic success toast', async () => {
    await selectValue('select[aria-label="当前审核批次"]', 'qa-failure-batch')
    await eventually('failure batch selected', 'document.body?.innerText?.includes("QA 队列失败")', 20000)
    await clickText('执行待审核案卷')
    await eventually('queue end or failure', 'document.body?.innerText?.includes("批次检查结束：") || document.body?.innerText?.includes("批次执行失败：")', 130000)
    const text = await evaluate('document.body?.innerText || ""')
    const state = await evaluate('window.reviewAPI.getBatchV2("qa-failure-batch")')
    if (state?.cases?.[0]?.status !== 'failed') throw new Error('Expected synthetic no-model error, actual state=' + JSON.stringify(state?.cases))
    const failureReason = state.cases[0].error || ''
    if (!failureReason.includes('未配置可用模型渠道')) throw new Error('Wrong failure branch: ' + failureReason)
    if (!text.includes('失败 1 案') && !text.includes('批次执行失败：')) throw new Error('Failure not surfaced: ' + text.slice(0, 1800))
    if (!text.includes('待人工处理 0 案')) throw new Error('All-failed batch must show zero human triage cases')
    if (text.includes('本轮审核及已启用的自动处理完成')) throw new Error('Old misleading generic success message remains')
    await screenshot('05-queue-failure')
    return { caseStatus: state.cases[0].status, failureReason, hasFailureFeedback: true, needsHuman: 0 }
  })
} catch (error) {
  process.exitCode = 1
  console.error('QA runner stopped on blocking error:', error)
} finally {
  writeFileSync(join(reportDir, 'electron-ui-results.json'), JSON.stringify(results, null, 2))
  if (ws) ws.close()
}
if (results.length !== 6 || results.some((x) => x.status !== 'PASS')) process.exitCode = 1
