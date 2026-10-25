// 真 Electron Main 的 I/O 故障与重启恢复；只允许独立 profile/8MiB tmpfs。
import { readFileSync, writeFileSync, chmodSync, symlinkSync, unlinkSync, openSync, closeSync, writeSync, statfsSync, existsSync, readlinkSync } from 'node:fs'
import { join } from 'node:path'
import assert from 'node:assert/strict'
import { connect, storeAccess, ensureReviewPage } from './review-live-cdp.mjs'
const dir = process.env.QA_REPORT_DIR, profile = process.env.QA_PROFILE_ROOT, volume = process.env.QA_IO_VOLUME
if (!dir || !profile?.includes('p06-recheck-live-') || !volume?.includes('p06-recheck-live-')) throw new Error('拒绝使用非隔离 profile/卷')
const operation = process.argv[2]
const factsPath = join(dir, 'io-private-binding.json')
const main = await connect(9230, () => true)
let renderer
const result = { id: operation, sourceSha: process.env.QA_APPLICATION_SHA, status: 'RUNNING', assertions: [], timeline: [] }
const save = () => writeFileSync(join(dir, operation + '-result.json'), JSON.stringify(result, null, 2) + '\n')
const trace = (event, details = {}) => { result.timeline.push({ at: new Date().toISOString(), event, ...details }); save() }
const check = (name, ok) => { result.assertions.push({ name, pass: !!ok }); save(); assert.ok(ok, name) }
const q = JSON.stringify
const config = join(profile, 'config'), assignmentPath = join(config, 'review-agent-assignments.json')
const permission = f => `__p06Live.assignments.checkAssignment({assignmentId:${q(f.assignmentId)},sessionId:${q(f.sessionId)},action:'submit-result',turnTriggeredBy:'user'}).ok`
try {
  if (operation === 'enospc' || operation === 'dual-fault') {
    renderer = await connect()
    await ensureReviewPage(renderer)
    const cases = JSON.parse(readFileSync(join(dir, 'synthetic-cases.json'), 'utf8'))
    const c = operation === 'enospc' ? cases.success : cases.failure
    await renderer.evaluate(`(async()=>{${storeAccess}await createReviewActionsController(store,window.reviewAPI).selectCase(${q(c.id)});return true})()`)
    const before = await renderer.evaluate(`window.reviewAPI.getBackgroundPiReviewStateV2(${q(c.id)})`)
    await renderer.click(before.runId ? '重新审核' : '开始审核')
    const accepted = await renderer.poll(`(async()=>{const s=await window.reviewAPI.getBackgroundPiReviewStateV2(${q(c.id)});return s.phase==='accepted'?s:false})()`)
    const f = await main.evaluate(`(()=>{const a=__p06Live.assignments.listAssignments().find(a=>a.caseId===${q(c.id)}&&a.activeRunId===${q(accepted.runId)});return {caseId:a.caseId,runId:a.activeRunId,assignmentId:a.id,sessionId:a.sessionId}})()`)
    writeFileSync(factsPath, JSON.stringify(f)) // 私有绑定只留本机；发布器禁止复制本文件。
    check('真实 Main 已受理且当前授权有效', accepted.phase === 'accepted' && await main.evaluate(permission(f)))
    trace('real-main-accepted', accepted)
    const original = readFileSync(assignmentPath)
    if (operation === 'enospc') {
      const fs = statfsSync(volume)
      check('故障卷为独立有界 tmpfs', Number(fs.type) === 0x01021994 && Number(fs.blocks) * Number(fs.bsize) <= 8 * 1024 * 1024)
      const target = join(volume, 'assignment-atomic.tmp'), filler = join(volume, 'filler')
      writeFileSync(target, '')
      const fd = openSync(filler, 'w'), block = Buffer.alloc(65536)
      let filled = 0, diskError
      try { while (filled <= 8 * 1024 * 1024) filled += writeSync(fd, block) } catch (error) { diskError = { code: error.code, errno: error.errno, syscall: error.syscall } } finally { closeSync(fd) }
      trace('bounded-tmpfs-full', { filled, diskError, availableBlocks: Number(statfsSync(volume).bavail) })
      check('实际内核 ENOSPC 已触发', diskError?.code === 'ENOSPC' && statfsSync(volume).bavail === 0)
      if (existsSync(assignmentPath + '.tmp')) unlinkSync(assignmentPath + '.tmp')
      symlinkSync(target, assignmentPath + '.tmp')
      const failure = await main.evaluate(`(()=>{try{__p06Live.assignments.revokeAssignment(${q(f.assignmentId)});return {threw:false}}catch(e){return {threw:true,code:e.code,errno:e.errno,syscall:e.syscall,path:e.path?.split('/').pop()}}})()`)
      trace('real-main-atomic-revoke-ENOSPC', { ...failure, atomicTemporaryPath: 'review-agent-assignments.json.tmp', targetConfirmed: readlinkSync(assignmentPath + '.tmp') === target })
      check('生产原子 tmp 写命中 ENOSPC', failure.threw && failure.code === 'ENOSPC' && failure.syscall === 'write' && readlinkSync(assignmentPath + '.tmp') === target)
      check('最后一份 assignment 原件未截断', original.equals(readFileSync(assignmentPath)))
      check('真实 Main 当前进程 fail-closed', !await main.evaluate(permission(f)))
      unlinkSync(filler); unlinkSync(assignmentPath + '.tmp')
      await main.evaluate(`__p06Live.assignments.createAssignment({sessionId:'synthetic-io-backfill',turnId:'synthetic-io-backfill',caseId:${q(f.caseId)},actions:['list']});true`)
      const persisted = JSON.parse(readFileSync(assignmentPath, 'utf8')).assignments.find(a => a.id === f.assignmentId)
      check('恢复后真实下一笔写入后补 revokedAt', !!persisted.revokedAt)
      await main.evaluate(`__p06Live.stopAgentAndWait(${q(f.sessionId)});true`)
      await main.evaluate(`__p06Live.runs.markStaleRunsInterrupted(${q(f.caseId)});true`)
      check('恢复后旧授权仍拒绝', !await main.evaluate(permission(f)))
      result.status = 'PASS'
    } else {
      const runDir = join(config, 'review-cases', f.caseId, 'runs-v2')
      chmodSync(config, 0o500); chmodSync(runDir, 0o500); chmodSync(join(config, 'review-owner-ids.log'), 0o400)
      // 真实 old outcome + executor stop 产生 V2/assignment 两条失败收尾。
      const outcome = await main.evaluate(`(()=>{const saved=__p06Live.captured.get(${q(f.sessionId)});saved.callback({status:'failed',error:'P06_SYNTHETIC_DUAL_IO_FAILURE'});return {callbackExecuted:true}})()`)
      trace('real-outcome-under-dual-I/O-fault', outcome)
      await main.evaluate(`__p06Live.stopAgentAndWait(${q(f.sessionId)});true`)
      const ownerFailure = await main.evaluate(`(()=>{let indexWriteRejected=false,journalWriteRejected=false;try{__p06Live.sessions.updateAgentSessionMeta(${q(f.sessionId)},{title:'合成 I/O 故障 owner'})}catch{indexWriteRejected=true}try{__p06Live.sessions.createReviewOwnedAgentSession({caseId:${q(f.caseId)},title:'合成故障禁止创建',channelId:'synthetic-io-channel'})}catch(e){journalWriteRejected=e.code==='EACCES'||String(e).includes('EACCES')}return {indexWriteRejected,journalWriteRejected}})()`)
      trace('actual-owner-index-and-journal-failures', ownerFailure)
      check('owner 索引与 UUID journal 写入均拒止', ownerFailure.indexWriteRejected && ownerFailure.journalWriteRejected)
      const disk = JSON.parse(readFileSync(assignmentPath, 'utf8')).assignments.find(a => a.id === f.assignmentId)
      result.persisted = { runStatus: JSON.parse(readFileSync(join(runDir, f.runId + '.json'), 'utf8')).status, revokedAtPersisted: !!disk.revokedAt }
      check('双持久状态失写事实保留', result.persisted.runStatus === 'running' && !result.persisted.revokedAtPersisted)
      check('故障中当前 Main 工具 fail-closed', !await main.evaluate(permission(f)))
      await main.poll(`!__p06Live.isAgentSessionActive(${q(f.sessionId)})`, 60000)
      trace('actual-executor-inactive-observed')
      check('executor 已真正停止', !await main.evaluate(`__p06Live.isAgentSessionActive(${q(f.sessionId)})`))
      trace('ready-for-real-process-restart-with-fault-held', result.persisted)
      result.status = 'PASS' // 只签收当前进程部分，重启由独立命令另验。
    }
    renderer.close()
  } else if (operation === 'dual-fault-held-proof') {
    const f = JSON.parse(readFileSync(factsPath, 'utf8'))
    const failure = await main.evaluate(`(()=>{let indexWriteRejected=false,journalWriteRejected=false;try{__p06Live.sessions.updateAgentSessionMeta(${q(f.sessionId)},{title:'合成 I/O 故障 owner'})}catch{indexWriteRejected=true}try{__p06Live.sessions.createReviewOwnedAgentSession({caseId:${q(f.caseId)},title:'合成故障禁止创建',channelId:'synthetic-io-channel'})}catch(e){journalWriteRejected=e.code==='EACCES'}return {indexWriteRejected,journalWriteRejected}})()`)
    trace('real-owner-index-and-journal-EACCES', failure)
    check('owner 索引和 UUID journal 实际同时失写', failure.indexWriteRejected && failure.journalWriteRejected)
    const runPath = join(config, 'review-cases', f.caseId, 'runs-v2', f.runId + '.json')
    chmodSync(runPath, 0o400) // 启动恢复旧代码直接写原文件，故障必须覆盖这个真实路径。
    result.persisted = { runStatus: JSON.parse(readFileSync(runPath, 'utf8')).status, revokedAtPersisted: !!JSON.parse(readFileSync(assignmentPath, 'utf8')).assignments.find(a => a.id === f.assignmentId)?.revokedAt }
    check('V2/assignment 失写未冒称已完成', result.persisted.runStatus === 'running' && !result.persisted.revokedAtPersisted)
    check('当前进程旧工具 fail-closed', !await main.evaluate(permission(f)))
    check('真实旧 executor 已停止', !await main.evaluate(`__p06Live.isAgentSessionActive(${q(f.sessionId)})`))
    result.status = 'PASS'
  } else if (operation === 'reboot-still-faulted' || operation === 'reboot-recovered') {
    const f = JSON.parse(readFileSync(factsPath, 'utf8'))
    renderer = await connect()
    await renderer.poll('!!window.reviewAPI?.getBackgroundPiReviewStateV2')
    result.realIpcState = await renderer.evaluate(`window.reviewAPI.getBackgroundPiReviewStateV2(${q(f.caseId)})`)
    const snapshot = await main.evaluate(`(()=>{const r=__p06Live.runs.getRunV2(${q(f.caseId)},${q(f.runId)});return {pid:process.pid,runStatus:r?.status,toolAllowed:${permission(f)},bindingReturned:!!__p06Live.binding.getPiReviewBindingForSession(${q(f.sessionId)}),main:__p06Live.getBackgroundPiReviewState(${q(f.caseId)})}})()`)
    trace('fresh-electron-main-authorization', snapshot); result.snapshot = snapshot
    check('重启后旧工具授权仍拒绝', !snapshot.toolAllowed)
    check('重启后旧 Pi binding 不复活', !snapshot.bindingReturned)
    if (operation === 'reboot-recovered') check('可写恢复后 V2 interrupted 终态已落盘', snapshot.runStatus === 'failed')
    result.status = 'PASS'
  } else throw new Error('未知操作')
} catch (error) { result.status = 'FAIL'; result.error = String(error); process.exitCode = 1 }
finally { result.finishedAt = new Date().toISOString(); save(); renderer?.close(); main.close(); console.log(JSON.stringify({ id: result.id, status: result.status, assertions: result.assertions.length, failed: result.assertions.filter(a => !a.pass).length, error: result.error })) }
