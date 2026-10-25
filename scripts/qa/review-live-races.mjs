// E03/E04 真实 Main/Pi：显式闸门保留真实 stop Promise；复演已捕获的真实旧 outcome 闭包。
import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import assert from 'node:assert/strict'
import { connect, storeAccess, ensureReviewPage } from './review-live-cdp.mjs'
const dir = process.env.QA_REPORT_DIR
const cases = JSON.parse(readFileSync(join(dir, 'synthetic-cases.json'), 'utf8'))
const renderer = await connect(), main = await connect(9230, () => true)
const results = []
const save = () => writeFileSync(join(dir, 'races-results.json'), JSON.stringify({ sourceSha: process.env.QA_APPLICATION_SHA, scope: '真实 Electron/Main/Pi，隔离诊断入口，未替换 provider 或 executor', results }, null, 2) + '\n')
async function run(id, fn) {
  const row = { id, status: 'RUNNING', timeline: [], assertions: [], startedAt: new Date().toISOString() }
  const trace = (event, data = {}) => { row.timeline.push({ at: new Date().toISOString(), event, ...data }); save() }
  const check = (name, ok) => { row.assertions.push({ name, pass: !!ok }); assert.ok(ok, name) }
  results.push(row)
  try { await fn(row, trace, check); row.status = 'PASS' }
  catch (error) { row.status = 'FAIL'; row.error = String(error); process.exitCode = 1 }
  finally { row.finishedAt = new Date().toISOString(); save(); console.log(JSON.stringify({ id, status: row.status, assertions: row.assertions.length, failed: row.assertions.filter(a => !a.pass).length, error: row.error })) }
}
const q = JSON.stringify
const state = id => `window.reviewAPI.getBackgroundPiReviewStateV2(${q(id)})`
const start = async c => {
  await renderer.evaluate(`(async()=>{${storeAccess}await createReviewActionsController(store,window.reviewAPI).selectCase(${q(c.id)});return true})()`)
  const prior = await renderer.evaluate(state(c.id))
  await renderer.click(prior.runId ? '重新审核' : '开始审核')
  return renderer.poll(`(async()=>{const s=await ${state(c.id)};return s.phase==='accepted'?s:false})()`)
}
const ownerCheck = (caseId, runId) => `(()=>{const a=__p06Live.assignments.listAssignments().find(a=>a.caseId===${q(caseId)}&&a.activeRunId===${q(runId)});return {run:__p06Live.runs.getRunV2(${q(caseId)},${q(runId)})?.status,assignmentFound:!!a,revoked:!!a?.revokedAt,toolAllowed:a?__p06Live.assignments.checkAssignment({assignmentId:a.id,sessionId:a.sessionId,action:'submit-result',turnTriggeredBy:'user'}).ok:false}})()`
try {
  await main.poll('!!globalThis.__p06Live')
  await ensureReviewPage(renderer)
  await run('E03', async (row, trace, check) => {
    const c = cases.preflight, old = await start(c)
    trace('real-old-ACK', old)
    await main.evaluate('__p06Live.gateNextStop=true;true')
    await renderer.evaluate(`window.__p06Stop={done:false};window.__p06Stop.promise=window.reviewAPI.stopBackgroundPiReviewV2({caseId:${q(c.id)},runId:${q(old.runId)}}).then(s=>{window.__p06Stop.done=true;return s});true`)
    await main.poll('__p06Live.stopEntered && __p06Live.stopPending')
    check('真实 Main stopAndWait Promise pending', await main.evaluate('__p06Live.stopPending'))
    check('Renderer stop Promise 同时 pending', !await renderer.evaluate('window.__p06Stop.done'))
    row.pendingWitness = await main.evaluate('({stopEntered:__p06Live.stopEntered,stopPending:__p06Live.stopPending,actualExecutorFinished:__p06Live.actualStopFinished})')
    trace('real-stop-pending-window-hit', row.pendingWitness)
    const denied = await renderer.evaluate(`window.reviewAPI.startBackgroundPiReviewV2({caseId:${q(c.id)},mode:'restart'}).then(s=>({accepted:true,state:s}),e=>({accepted:false,error:String(e)}))`)
    check('pending 窗口 restart 实际 busy 拒绝', !denied.accepted && denied.error.includes('正在启动或停止'))
    trace('restart-busy-rejected', denied)
    await renderer.screenshot(dir, 'e03-stop-pending-busy')
    await main.evaluate('__p06Live.releaseStop();true')
    const stopped = await renderer.evaluate('window.__p06Stop.promise')
    trace('real-stop-released', stopped)
    check('释放 stop 后旧轮 cancelled', stopped.runStatus === 'cancelled')
    const next = await renderer.evaluate(`window.reviewAPI.startBackgroundPiReviewV2({caseId:${q(c.id)},mode:'restart'})`)
    trace('immediate-restart-accepted', next)
    check('释放后立即 restart accepted/running', next.phase === 'accepted' && next.runStatus === 'running' && next.runId !== old.runId)
    row.oldAssignment = await main.evaluate(ownerCheck(c.id, old.runId))
    row.newAssignment = await main.evaluate(ownerCheck(c.id, next.runId))
    check('旧指派撤销并拒绝工具', row.oldAssignment.revoked && !row.oldAssignment.toolAllowed)
    check('新 run 与新指派一致且允许当前工具', row.newAssignment.run === 'running' && row.newAssignment.assignmentFound && row.newAssignment.toolAllowed)
    await renderer.screenshot(dir, 'e03-restart-after-release')
    row.cleanup = await renderer.evaluate(`window.reviewAPI.stopBackgroundPiReviewV2({caseId:${q(c.id)},runId:${q(next.runId)}})`)
    check('新轮仍可正常停止', row.cleanup.runStatus === 'cancelled')
  })
  await run('E04', async (row, trace, check) => {
    const c = cases.stop, old = await start(c)
    trace('real-old-executor-ACK', old)
    const captured = await main.evaluate(`(()=>{const a=__p06Live.assignments.listAssignments().find(a=>a.caseId===${q(c.id)}&&a.activeRunId===${q(old.runId)});const saved=__p06Live.captured.get(a.sessionId);__p06Live.oldCallback=saved?.callback;return {captured:typeof saved?.callback==='function',toolAllowed:__p06Live.assignments.checkAssignment({assignmentId:a.id,sessionId:a.sessionId,action:'submit-result',turnTriggeredBy:'user'}).ok}})()`)
    check('真实 executor 输入的 Main outcome 闭包已捕获', captured.captured && captured.toolAllowed)
    trace('actual-old-outcome-closure-captured', captured)
    await renderer.evaluate(`window.reviewAPI.stopBackgroundPiReviewV2({caseId:${q(c.id)},runId:${q(old.runId)}})`)
    const next = await renderer.evaluate(`window.reviewAPI.startBackgroundPiReviewV2({caseId:${q(c.id)},mode:'restart'})`)
    check('迟到回调前新轮 accepted/running', next.phase === 'accepted' && next.runStatus === 'running')
    trace('new-executor-ACK-before-late-callback', next)
    for (const outcome of [{ status: 'completed' }, { status: 'failed', error: 'P06_SYNTHETIC_LATE_ERROR' }]) {
      const witness = await main.evaluate(`(()=>{const before=__p06Live.getBackgroundPiReviewState(${q(c.id)});__p06Live.oldCallback(${q(outcome)});__p06Live.events.push({at:new Date().toISOString(),event:'actual-old-onRunOutcome-invoked',status:${q(outcome.status)}});const after=__p06Live.getBackgroundPiReviewState(${q(c.id)});return {callbackExecuted:true,outcome:${q(outcome.status)},before,after}})()`)
      check(`旧 ${outcome.status} 回调确实调用且新状态未回退`, witness.callbackExecuted && witness.after.runId === next.runId && witness.after.phase === 'accepted' && witness.after.runStatus === 'running')
      trace('late-production-outcome-returned', witness)
    }
    const denied = await main.evaluate(ownerCheck(c.id, old.runId))
    check('迟到回调后旧指派和工具仍拒绝', denied.revoked && !denied.toolAllowed && denied.run === 'cancelled')
    row.oldAuthorization = denied
    row.newAuthorization = await main.evaluate(ownerCheck(c.id, next.runId))
    check('新指派仍有效', row.newAuthorization.run === 'running' && row.newAuthorization.toolAllowed)
    await renderer.screenshot(dir, 'e04-after-late-complete-and-error')
    row.cleanup = await renderer.evaluate(`window.reviewAPI.stopBackgroundPiReviewV2({caseId:${q(c.id)},runId:${q(next.runId)}})`)
    check('迟到回调后新轮停止仍正常', row.cleanup.runStatus === 'cancelled')
  })
  const events = await main.evaluate('__p06Live.events')
  writeFileSync(join(dir, 'main-race-events.json'), JSON.stringify(events, null, 2) + '\n')
} finally {
  await main.evaluate('__p06Live.releaseStop?.();true').catch(() => {})
  for (const c of [cases.preflight, cases.stop]) await renderer.evaluate(`(async()=>{const s=await ${state(c.id)};if(s.phase==='accepted')await window.reviewAPI.stopBackgroundPiReviewV2({caseId:${q(c.id)},runId:s.runId});return true})()`).catch(() => {})
  renderer.close(); main.close()
}
