// E05：保留旧真实 IPC 响应，实际卸载/重进后交付；所有状态读取来自生产 Main/Jotai。
import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import assert from 'node:assert/strict'
import { connect, storeAccess } from './review-live-cdp.mjs'
import { providerWitness } from './review-background-p06-contract.mjs'
const dir = process.env.QA_REPORT_DIR
const cases = JSON.parse(readFileSync(join(dir, 'synthetic-cases.json'), 'utf8'))
const c = cases.failure
const cdp = await connect()
const timeline = [], assertions = []
const trace = (event, details = {}) => { timeline.push({ at: new Date().toISOString(), event, ...details }); save() }
const check = (name, condition) => { assertions.push({ name, pass: !!condition }); assert.ok(condition, name) }
const result = { id: 'E05', sourceSha: process.env.QA_APPLICATION_SHA, status: 'RUNNING', timeline, assertions }
function save() { writeFileSync(join(dir, 'e05-result.json'), JSON.stringify(result, null, 2) + '\n') }
const state = `window.reviewAPI.getBackgroundPiReviewStateV2(${JSON.stringify(c.id)})`
const snapshot = () => cdp.evaluate(`(async()=>{${storeAccess}const main=await ${state};const r=store.get(atoms.reviewWorkspaceRunsByCaseAtom)[${JSON.stringify(c.id)}];const e=store.get(atoms.reviewExecutionByCaseAtom)[${JSON.stringify(c.id)}];return {main,renderer:{runId:r?.id,runStatus:r?.status,status:e?.status,stage:e?.stage,message:e?.message,error:store.get(atoms.reviewErrorAtom)},oldStopFeedbackVisible:document.body.innerText.includes('本次审核已停止。'),buttons:[...document.querySelectorAll('button')].filter(b=>b.getClientRects().length&&!b.disabled).map(b=>b.textContent.trim())}})()`)
try {
  await cdp.evaluate(`(async()=>{${storeAccess}await createReviewActionsController(store,window.reviewAPI).selectCase(${JSON.stringify(c.id)});return true})()`)
  await cdp.poll(`document.body.innerText.includes('待我处理')`)
  const initial = await cdp.evaluate(state)
  await cdp.click(initial.runId ? '重新审核' : '开始审核')
  const old = await cdp.poll(`(async()=>{const s=await ${state};return s.phase==='accepted'?s:false})()`)
  trace('old-main-accepted', old)
  const profile = process.env.QA_PROFILE_ROOT
  if (!profile) throw new Error('必须指定隔离 profile，以核实真实 provider 回执')
  const assignment = JSON.parse(readFileSync(join(profile, 'config/review-agent-assignments.json'), 'utf8')).assignments.find(a => a.caseId === c.id && a.activeRunId === old.runId)
  const deadline = Date.now() + 60000
  let provider
  while (Date.now() < deadline) {
    try {
      provider = providerWitness(readFileSync(join(profile, 'config/agent-sessions', assignment.sessionId + '.jsonl'), 'utf8').split('\n').filter(Boolean).map(line => JSON.parse(line)))
      if (provider.assistantReplies > 0) break
    } catch {}
    await new Promise(resolve => setTimeout(resolve, 100))
  }
  check('旧轮真实 provider 回执已见证', provider?.assistantReplies > 0)
  result.providerWitness = provider
  trace('real-provider-reply-before-race', provider)
  await cdp.evaluate(`(async()=>{${storeAccess}const held={issued:false,delivered:false,events:[]};const gate=new Promise(resolve=>held.release=resolve);const api={...window.reviewAPI,listRunsV2:async id=>{held.events.push({event:'real-ipc-listRunsV2-issued',at:Date.now()});const runs=await window.reviewAPI.listRunsV2(id);held.captured=runs;held.issued=true;held.events.push({event:'real-main-response-captured',at:Date.now(),runIds:runs.map(r=>r.id)});const value=await gate;held.delivered=true;held.events.push({event:'old-response-delivered-to-production-controller',at:Date.now(),runIds:value.map(r=>r.id)});return value}};held.controller=createReviewActionsController(store,api);held.promise=held.controller.refreshBackgroundReview(${JSON.stringify(c.id)});window.__p06Held=held;return true})()`)
  const captured = await cdp.poll('window.__p06Held.issued && window.__p06Held.captured.map(r=>r.id)')
  check('旧真实 Main 回复包含旧 run', captured.includes(old.runId))
  trace('old-response-held', { runIds: captured })
  await cdp.evaluate(`document.querySelector('[aria-label="关闭返回专区首页"]').click()`)
  await cdp.poll('!document.body.innerText.includes("待我处理")')
  trace('real-review-page-unmounted')
  const stopped = await cdp.evaluate(`window.reviewAPI.stopBackgroundPiReviewV2({caseId:${JSON.stringify(c.id)},runId:${JSON.stringify(old.runId)}})`)
  check('旧轮真实停止 cancelled', stopped.runStatus === 'cancelled')
  // 页面外由可信业务 IPC 真正创建新轮，返回 Main onRunOwned 的 ACK 后才重进。
  const next = await cdp.evaluate(`window.reviewAPI.startBackgroundPiReviewV2({caseId:${JSON.stringify(c.id)},mode:'restart'})`)
  check('新轮页面外 accepted/running', next.phase === 'accepted' && next.runStatus === 'running' && next.runId !== old.runId)
  trace('new-main-accepted-before-reentry', next)
  await cdp.click('材料审核')
  await cdp.poll('document.body.innerText.includes("待我处理")')
  await cdp.evaluate(`(async()=>{${storeAccess}await createReviewActionsController(store,window.reviewAPI).selectCase(${JSON.stringify(c.id)});return true})()`)
  await cdp.poll(`(async()=>{${storeAccess}return store.get(atoms.reviewWorkspaceRunsByCaseAtom)[${JSON.stringify(c.id)}]?.id===${JSON.stringify(next.runId)}&&store.get(atoms.reviewExecutionByCaseAtom)[${JSON.stringify(c.id)}]?.status==='running'})()`)
  result.beforeDelivery = await snapshot()
  trace('real-review-page-remounted-new-state', result.beforeDelivery)
  await cdp.screenshot(dir, 'e05-before-late-delivery')
  await cdp.evaluate('(async()=>{window.__p06Held.release(window.__p06Held.captured);await window.__p06Held.promise;return true})()')
  const witness = await cdp.evaluate('({delivered:window.__p06Held.delivered,events:window.__p06Held.events})')
  result.ipcWitness = witness
  check('旧回复确实交付至真实 Controller', witness.delivered && witness.events.some(e => e.event === 'old-response-delivered-to-production-controller'))
  result.afterDelivery = await snapshot()
  trace('after-late-delivery', result.afterDelivery)
  check('Main 仍为新 run accepted/running', result.afterDelivery.main.runId === next.runId && result.afterDelivery.main.phase === 'accepted' && result.afterDelivery.main.runStatus === 'running')
  check('Renderer/Jotai 仍为新 run running', result.afterDelivery.renderer.runId === next.runId && result.afterDelivery.renderer.runStatus === 'running' && result.afterDelivery.renderer.status === 'running')
  check('旧错误和 stop feedback 没有复活', !result.afterDelivery.renderer.error && !result.afterDelivery.oldStopFeedbackVisible)
  await cdp.screenshot(dir, 'e05-after-late-delivery')
  await cdp.click('停止审核')
  const cleanup = await cdp.poll(`(async()=>{const s=await ${state};return s.runStatus==='cancelled'?s:false})()`)
  check('重进后新轮真实停止仍可用', cleanup.runId === next.runId)
  result.cleanup = cleanup
  result.status = 'PASS'
} catch (error) {
  result.status = 'FAIL'; result.error = String(error); process.exitCode = 1
  await cdp.screenshot(dir, 'e05-failure').catch(() => {})
} finally {
  await cdp.evaluate(`(async()=>{const s=await ${state};if(s.phase==='accepted')await window.reviewAPI.stopBackgroundPiReviewV2({caseId:${JSON.stringify(c.id)},runId:s.runId});delete window.__p06Held;return true})()`).catch(() => {})
  result.finishedAt = new Date().toISOString(); save(); cdp.close()
  console.log(JSON.stringify({ id: result.id, status: result.status, assertions: assertions.length, failed: assertions.filter(a => !a.pass).length, error: result.error }))
}
