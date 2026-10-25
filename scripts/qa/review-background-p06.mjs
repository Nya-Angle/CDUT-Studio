/**
 * P06-S02 real Electron/Pi double-round replay, over isolated localhost CDP.
 * Requires a NEW isolated test profile with an already-authorized Pi model; cases are synthetic.
 * A failed or unreachable UI is NOT-RUN/FAIL, never silently PASS.
 */
import { existsSync, mkdirSync, writeFileSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import WebSocket from 'ws'
import { providerWitness, roundOwnerId, verifyOwnerTransition } from './review-background-p06-contract.mjs'

const reportDir = process.env.QA_REPORT_DIR
if (!reportDir) throw new Error('QA_REPORT_DIR is required')
mkdirSync(reportDir, { recursive: true })
// 由本地环境显式提供测试凭据，不依赖历史验收报告。
const demoUser = process.env.REVIEW_QA_USERNAME
const demoPass = process.env.REVIEW_QA_PASSWORD
if (!demoUser || !demoPass) throw new Error('REVIEW_QA_USERNAME 和 REVIEW_QA_PASSWORD 为必填项')
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
      url = pages.find((x) => (x.url || '').startsWith('http://localhost:5176') && !x.url.includes('window=agent-preview'))?.webSocketDebuggerUrl
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

const profileRoot = process.env.QA_PROFILE_ROOT
const sourcePath = process.env.QA_SOURCE_PATH
if (!profileRoot || !sourcePath) throw new Error('QA_PROFILE_ROOT and QA_SOURCE_PATH are required')
const originalSelection = JSON.parse(readFileSync(join(profileRoot, 'config/review-module-settings.json'), 'utf8')).agentModelSelection
const readOwners = () => { const path=join(profileRoot,'config/agent-sessions.json'); return existsSync(path) ? JSON.parse(readFileSync(path,'utf8')).sessions.filter(session=>session.owner?.kind==='review-case') : [] }
const readAssignments = () => JSON.parse(readFileSync(join(profileRoot,'config/review-agent-assignments.json'),'utf8')).assignments
const readMessages = (id) => {
  const path=join(profileRoot,'config/agent-sessions',id+'.jsonl')
  return existsSync(path) ? readFileSync(path,'utf8').split('\n').filter(Boolean).map(line=>JSON.parse(line)) : []
}
if (readOwners().length || existsSync(join(profileRoot,'config/review-agent-assignments.json'))) {
  throw new Error('P06 回放要求全新隔离 profile；拒绝复用历史审核数据')
}
let cases
const timeline=[]
const trace=(event,caseId,runId,details={})=>{timeline.push({at:new Date().toISOString(),event,caseId,runId,...details});writeFileSync(join(reportDir,'timeline.json'),JSON.stringify(timeline,null,2))}
async function waitProvider(ownerId,offset,caseId,runId) {
  const end=deadline(120000)
  while(Date.now()<end) {
    const witness=providerWitness(readMessages(ownerId).slice(offset))
    if(witness.assistantReplies>0){trace('provider-reply-observed',caseId,runId,witness);return witness}
    const state=await evaluate(stateExpression(caseId))
    if(state.runId!==runId || state.phase!=='accepted') throw new Error('取得 provider 回执前运行已结束或发生变化')
    await delay(200)
  }
  throw new Error('未观察到本轮真实 provider 回执；不能只凭 ACK 宣称模型双轮通过')
}
async function clickSelector(selector) {
  const rect = await evaluate(`(() => { const el=document.querySelector(${JSON.stringify(selector)}); if(!el) return null; const r=el.getBoundingClientRect(); return {x:r.x+r.width/2,y:r.y+r.height/2} })()`)
  if (!rect) throw new Error('Selector not found: ' + selector)
  await send('Input.dispatchMouseEvent', {type:'mousePressed',button:'left',clickCount:1,...rect})
  await send('Input.dispatchMouseEvent', {type:'mouseReleased',button:'left',clickCount:1,...rect})
}
async function openReview() {
  await eventually('preload ready', '!!window.reviewAPI?.startBackgroundPiReviewV2', 120000)
  await eventually('React shell ready', 'document.body.innerText.trim().length > 10', 120000)
  await send('Input.dispatchKeyEvent', {type:'keyDown',key:'Escape',code:'Escape'})
  await send('Input.dispatchKeyEvent', {type:'keyUp',key:'Escape',code:'Escape'})
  if (await evaluate('document.body.innerText.includes("待我处理")')) return
  if(await evaluate(`!!document.querySelector('[aria-label="退出引导"]')`)) await clickSelector('[aria-label="退出引导"]')
  if(await evaluate('document.body.innerText.includes("稍后再学")')) await clickText('稍后再学')
  if(await evaluate(`!!document.querySelector('[aria-label="展开侧边栏"]')`)) await clickSelector('[aria-label="展开侧边栏"]')
  await eventually('CDUT navigation ready', 'document.body.innerText.includes("CDUT 专区")', 40000)
  await clickText('CDUT 专区')
  await delay(500)
  if (await evaluate('!!document.querySelector("input[type=password]")')) {
    const result = await evaluate(`(() => {
      const pass=document.querySelector('input[type=password]');
      const user=[...document.querySelectorAll('input')].find(e=>e!==pass && e.getClientRects().length && ['text','number','tel',''].includes(e.type));
      if(!user || !pass) return false;
      const setter=Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set;
      for(const [el,value] of [[user,${JSON.stringify(demoUser)}],[pass,${JSON.stringify(demoPass)}]]) {
        setter.call(el,value);el.dispatchEvent(new Event('input',{bubbles:true}));el.dispatchEvent(new Event('change',{bubbles:true}));
      }
      return true;
    })()`)
    if (!result) throw new Error('Offline demo login fields unavailable')
    await clickText('一键连接特区账户')
  }
  await eventually('material review entry', 'document.body.innerText.includes("材料审核")', 40000)
  await clickText('材料审核')
  await eventually('real workbench', 'document.body.innerText.includes("待我处理")', 40000)
}
async function chooseCase(title) {
  // 隔离 fixture 通过现有选择控制器与真实 IPC 装载；审核启动/停止仍点击产品按钮。
  const id=Object.values(cases).find(c=>c.title===title).id
  await evaluate(`(async()=>{
    const source=await(await fetch('/atoms/review-atoms.ts')).text();
    const url=source.split('from "')[1].split('"')[0];
    const {getDefaultStore}=await import(url);
    const {createReviewActionsController}=await import('/components/content-review/review-actions-controller.ts');
    await createReviewActionsController(getDefaultStore(),window.reviewAPI).selectCase(${JSON.stringify(id)});
  })()`)
  if(await evaluate(`!!document.querySelector('[aria-label="退出引导"]')`)) await clickSelector('[aria-label="退出引导"]')
  if(await evaluate('document.body.innerText.includes("稍后再学")')) await clickText('稍后再学')
  await delay(700)
}
const stateExpression = (caseId) => `window.reviewAPI.getBackgroundPiReviewStateV2(${JSON.stringify(caseId)})`
async function waitAccepted(caseId) {
  return eventually('real Main admission', `(async()=>{const s=await ${stateExpression(caseId)};return s.phase==='accepted' ? s : false})()`, 45000)
}
async function waitTerminal(caseId) {
  return eventually('persisted terminal result', `(async()=>{const s=await ${stateExpression(caseId)};return ['finished','incomplete','needs-attention'].includes(s.phase) ? s : false})()`, 240000)
}
async function seed() {
  cases = await evaluate(`(async()=>{
    const templateId='p06-double-round-synthetic-20261013';
    const template={templateId,version:1,schemaVersion:2,name:'P06 合成双轮预算检查',objectType:'person',displayName:{template:'{{title}}'},fields:[],
      sections:[{id:'all',name:'内容核验',order:0,required:false,criteria:[{id:'budget',title:'预算文本核验',requirement:'完整读取申请文本，核对其是否明确写明总预算100元。只核对文字，不判断学校授权。提交检查时必须引用本轮实际读取的原文出处。',execution:'semantic',targetScope:'case'}]}],
      materialSlots:[],policyVersionIds:[],policyRefs:[],stages:[{id:'review',name:'本地预审',kind:'manual-review',executorRole:'reviewer'}],outputs:[],status:'draft',sourceNote:'P06_SYNTHETIC_ONLY: 合成测试，不是学校政策或审批',createdAt:new Date().toISOString()};
    const old=await window.reviewAPI.getTemplateV2(templateId,1);
    if(!old){await window.reviewAPI.saveTemplateDraftV2(template);await window.reviewAPI.publishTemplateV2(templateId,1)}
    const found=await window.reviewAPI.listCases();const result={};
    for(const [key,title] of [['success','P06 同案更新测试'],['preflight','P06 辅助隔离案卷'],['stop','P06 从头重审测试'],['failure','P06 辅助失败案卷']]) {
      let c=found.find(x=>x.title===title);
      if(!c){c=await window.reviewAPI.createCase({title,type:'自定义审核',applicant:'合成测试甲',academicYear:'2026',reviewTemplate:{templateId,version:1}});await window.reviewAPI.importDocumentFromPath({caseId:c.id,sourcePath:${JSON.stringify(sourcePath)},role:'application'})}
      result[key]={id:c.id,title};
    }
    return result;
  })()`)
  writeFileSync(join(reportDir, 'synthetic-cases.json'), JSON.stringify(cases,null,2))
}

async function boot() {
  await connect()
  await eventually('preload bootstrap', '!!window.electronAPI?.getSettings && !!window.reviewAPI', 120000)
  const guide = await evaluate(`(async()=>{
    const {CURRENT_COACH_TOUR_VERSION}=await import('/components/onboarding/coach-tour/coach-tour-steps.ts');
    const s=await window.electronAPI.getSettings();
    if(s.onboardingCompleted&&s.tutorialBannerDismissed&&s.coachTourVersion===CURRENT_COACH_TOUR_VERSION)return false;
    await window.electronAPI.updateSettings({onboardingCompleted:true,tutorialBannerDismissed:true,coachTourVersion:CURRENT_COACH_TOUR_VERSION});return true
  })()`)
  if (guide) await send('Page.reload')
  await eventually('reload document ready', '!!document.body && !!window.electronAPI && !!window.reviewAPI', 120000)
  if (await evaluate('document.body?.innerText.includes("欢迎使用 CDUT Studio")')) {
    await evaluate('window.electronAPI.updateSettings({onboardingCompleted:true})')
    await send('Page.reload')
  }
  await eventually('Pi review preload', '!!window.reviewAPI?.stopBackgroundPiReviewV2', 120000)
  const localSettings=JSON.parse(readFileSync(join(profileRoot,'config/settings.json'),'utf8'))
  if(!localSettings.onboardingCompleted || !localSettings.tutorialBannerDismissed) {
    throw new Error('CDP 实例未写入指定隔离 profile；在创建案卷前拒绝继续')
  }
  await seed()
  await openReview()
}
const remoteState = (caseId) => `window.reviewAPI.getBackgroundPiReviewStateV2(${JSON.stringify(caseId)})`
async function newAcceptance(caseId, priorRunId) {
  return eventually('new round has true ACK', `(async()=>{
    const s=await ${remoteState(caseId)};
    return s.phase==='accepted' && s.runId!==${JSON.stringify(priorRunId)} ? s : false
  })()`, 60000)
}
async function queryRun(caseId, runId) {
  return evaluate(`window.reviewAPI.getRunV2(${JSON.stringify(caseId)},${JSON.stringify(runId)})`)
}
async function tryOldStop(caseId, runId) {
  return evaluate(`(async()=>{
    try {await window.reviewAPI.stopBackgroundPiReviewV2({caseId:${JSON.stringify(caseId)},runId:${JSON.stringify(runId)}});return {allowed:true}}
    catch(e){return {allowed:false,reason:String(e)}}
  })()`)
}
async function clickStop(caseId, expectedRunId) {
  await eventually('visible real stop button', 'document.body.innerText.includes("停止审核")', 30000)
  await clickText('停止审核')
  const stopped = await waitTerminal(caseId)
  if (stopped.runId !== expectedRunId || stopped.runStatus !== 'cancelled') {
    throw new Error('stop did not retire expected round: '+JSON.stringify({expectedRunId,stopped}))
  }
  trace('stopped-ledger',caseId,expectedRunId,{status:stopped.runStatus})
  await eventually('真实界面停止收尾并可重新审核', `(() => {
    const buttons=[...document.querySelectorAll('button')].filter(b=>b.getClientRects().length&&!b.disabled);
    return document.body.innerText.includes('本次审核已停止，可重新审核') && buttons.some(b=>b.textContent.trim()==='更新审核结果') && buttons.some(b=>b.textContent.trim()==='重新审核');
  })()`)
  return stopped
}
async function ensureNoPriorStopFeedback() {
  const has = await evaluate('document.body.innerText.includes("本次审核已停止。")')
  if (has) throw new Error('Old green stop receipt visible after next review ACK')
}
async function runTwice(key, mode) {
  const target=cases[key]
  await chooseCase(target.title)
  const priorOwners=readOwners().filter(x=>x.owner?.caseId===target.id).map(x=>x.id)
  await clickText('开始审核')
  const first=await waitAccepted(target.id)
  trace('accepted-first',target.id,first.runId)
  const firstOwners=readOwners().filter(x=>x.owner?.caseId===target.id)
  if(firstOwners.length===0)throw new Error('No actual atomically-persisted review owner')
  const owner1=roundOwnerId(target.id,first.runId,firstOwners,readAssignments())
  if(priorOwners.includes(owner1))throw new Error('全新 fixture 的第一轮错误使用历史 owner')
  const provider1=await waitProvider(owner1,0,target.id,first.runId)
  const stopped1=await clickStop(target.id,first.runId)
  const firstLedger=await queryRun(target.id,first.runId)
  if(mode==='update') {
    // update 必须处理本轮最新材料；替换合成版本，避免直接继承首轮读取后瞬间完成。
    const nextPath=join(profileRoot,'p06-second-version.txt')
    writeFileSync(nextPath,'P06 第二轮合成申请：读书交流活动总预算120元。此版本替换第一轮100元申请，需按当前版本核验。这是虚构测试材料。')
    await evaluate(`(async()=>{
      const a=await window.reviewAPI.getAggregateV2(${JSON.stringify(target.id)});
      const old=a.caseV2.documents.find(d=>d.active!==false&&d.role==='application');
      if(!old)throw new Error('没有可替换的合成材料');
      await window.reviewAPI.registerMaterialPathV2({caseId:${JSON.stringify(target.id)},sourcePath:${JSON.stringify(nextPath)},role:'application',fileName:old.fileName,replacesVersionIds:[old.versionId]});
    })()`)
    trace('synthetic-material-replaced',target.id,first.runId)
  }
  const messageOffset=readMessages(owner1).length
  const beforeSecond=readOwners().filter(x=>x.owner?.caseId===target.id).map(x=>x.id)
  await clickText(mode==='update'?'更新审核结果':'重新审核')
  const second=await newAcceptance(target.id,first.runId)
  trace('accepted-second',target.id,second.runId,{mode})
  const owners=readOwners().filter(x=>x.owner?.caseId===target.id)
  const owner2=roundOwnerId(target.id,second.runId,owners,readAssignments())
  verifyOwnerTransition(mode,owner1,owner2,beforeSecond,owners.map(x=>x.id))
  const rejected=await tryOldStop(target.id,first.runId)
  if(rejected.allowed || !rejected.reason.includes('运行已变化'))throw new Error('Old run stop unexpectedly accepted: '+JSON.stringify(rejected))
  const active=await queryRun(target.id,second.runId)
  const historic=await queryRun(target.id,first.runId)
  if(active?.status!=='running'||historic?.status!=='cancelled')throw new Error('旧 stop 负例没有保持所需的当前 running/历史 cancelled 窗口：'+JSON.stringify({active:active?.status,historic:historic?.status}))
  if(mode==='update'&&active.inputManifest.hash===firstLedger.inputManifest.hash)throw new Error('替换材料未进入第二轮输入快照')
  if(historic.inputManifest.hash!==firstLedger.inputManifest.hash)throw new Error('旧轮次输入快照被改写')
  trace('old-stop-denied-current-running',target.id,second.runId,{oldRunId:first.runId})
  const provider2=await waitProvider(owner2,mode==='update'?messageOffset:0,target.id,second.runId)
  await eventually('当前轮已回显在真实 UI', 'document.body.innerText.includes("审核中，可切换页面") && [...document.querySelectorAll("button")].some(b=>b.getClientRects().length&&!b.disabled&&b.textContent.trim()==="停止审核")')
  await ensureNoPriorStopFeedback()
  await screenshot('p06-'+key+'-second-accepted')
  const stopped2=await clickStop(target.id,second.runId)
  const priorAfter=await queryRun(target.id,first.runId)
  if(priorAfter?.status!=='cancelled')throw new Error('Old ledger mutated after second completion')
  await screenshot('p06-'+key+'-both-retired')
  const grants=readAssignments().filter(a=>a.caseId===target.id&&[first.runId,second.runId].includes(a.activeRunId))
  if(grants.length!==2 || grants.some(a=>!a.revokedAt))throw new Error('停止释放后两轮指派未全部撤销')
  return {caseId:target.id,mode,rounds:[{runId:first.runId,terminal:stopped1.runStatus,providerWitness:provider1},{runId:second.runId,terminal:stopped2.runStatus,providerWitness:provider2}],ownerPolicyVerified:true,bindingsVerified:true,grantsRevoked:true,materialSnapshotChanged:mode==='update',oldStopDenied:rejected.reason,oldLedgerUnchanged:true,latestAckReal:true,guiButtonsClicked:true}
}
try {
  await boot()
  await record('P06-S02-E01 same-case update reuses owner, late old stop denied', async()=>runTwice('success','update'))
  await record('P06-S02-E02 same-case restart creates new owner after stop release', async()=>runTwice('stop','restart'))
  writeFileSync(join(reportDir,'p06-summary.json'),JSON.stringify({status:'PASS',results,scope:'REAL Electron/Main IPC/Pi/provider using isolated synthetic cases. Deliberate late onRunOutcome injection, cross-process crash, Relay/Pocket/Feishu NOT-RUN.'},null,2))
} catch (error) {
  writeFileSync(join(reportDir,'p06-summary.json'),JSON.stringify({status:'FAIL',results,error:String(error)},null,2))
  console.error(String(error))
  process.exitCode=1
} finally {
  if (ws?.readyState===WebSocket.OPEN) ws.close()
}
