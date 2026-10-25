/**
 * Main bridge / A0 real Electron replay, over localhost CDP.
 * Uses an explicitly isolated profile and its selected real Pi model; all case data is synthetic.
 * A failed or unreachable UI is NOT-RUN/FAIL, never silently PASS.
 */
import { existsSync, mkdirSync, writeFileSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import WebSocket from 'ws'
import { createServer } from 'node:http'

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
let cases
let fixtureRequests=0
const providerFixture=createServer((_request,response)=>{fixtureRequests+=1;setTimeout(()=>{response.writeHead(500,{'Content-Type':'application/json'});response.end(JSON.stringify({error:{message:'A0 synthetic provider failure',type:'api_error'}}))},1500)})
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
    const templateId='a0-background-synthetic-20261013';
    const template={templateId,version:1,schemaVersion:2,name:'A0 合成预算检查',objectType:'person',displayName:{template:'{{title}}'},fields:[],
      sections:[{id:'all',name:'内容核验',order:0,required:false,criteria:[{id:'budget',title:'预算文本核验',requirement:'完整读取申请文本，核对其是否明确写明总预算100元。只核对文字，不判断学校授权。提交检查时必须引用本轮实际读取的原文出处。',execution:'semantic',targetScope:'case'}]}],
      materialSlots:[],policyVersionIds:[],policyRefs:[],stages:[{id:'review',name:'本地预审',kind:'manual-review',executorRole:'reviewer'}],outputs:[],status:'draft',sourceNote:'A0_SYNTHETIC_ONLY: 合成测试责任，不是校规或行政审批',createdAt:new Date().toISOString()};
    const old=await window.reviewAPI.getTemplateV2(templateId,1);
    if(!old){await window.reviewAPI.saveTemplateDraftV2(template);await window.reviewAPI.publishTemplateV2(templateId,1)}
    const found=await window.reviewAPI.listCases();const result={};
    for(const [key,title] of [['success','A0 后台真实模型'],['preflight','A0 模型预检拒绝'],['stop','A0 停止审核'],['failure','A0 受理后模型失败']]) {
      let c=found.find(x=>x.title===title);
      if(!c){c=await window.reviewAPI.createCase({title,type:'自定义审核',applicant:'合成测试甲',academicYear:'2026',reviewTemplate:{templateId,version:1}});await window.reviewAPI.importDocumentFromPath({caseId:c.id,sourcePath:${JSON.stringify(sourcePath)},role:'application'})}
      result[key]={id:c.id,title};
    }
    return result;
  })()`)
  writeFileSync(join(reportDir, 'synthetic-cases.json'), JSON.stringify(cases,null,2))
}
try {
  await connect()
  // 仅初始化明确传入的隔离实例；避免首次引导异步切换页面干扰业务回放。
  await eventually('preload bootstrap', '!!window.electronAPI?.getSettings && !!window.reviewAPI', 120000)
  const initializeGuide = await evaluate(`(async()=>{
    const {CURRENT_COACH_TOUR_VERSION}=await import('/components/onboarding/coach-tour/coach-tour-steps.ts');
    const settings=await window.electronAPI.getSettings();
    if(settings.onboardingCompleted && settings.tutorialBannerDismissed && settings.coachTourVersion===CURRENT_COACH_TOUR_VERSION) return false;
    await window.electronAPI.updateSettings({onboardingCompleted:true,tutorialBannerDismissed:true,coachTourVersion:CURRENT_COACH_TOUR_VERSION});return true;
  })()`)
  if(initializeGuide) await send('Page.reload')
  if(await evaluate('document.body.innerText.includes("欢迎使用 CDUT Studio")')) {
    await evaluate('window.electronAPI.updateSettings({onboardingCompleted:true})')
    await send('Page.reload')
  }
  await eventually('preload ready', '!!window.reviewAPI?.startBackgroundPiReviewV2', 120000)
  await seed()
  await openReview()
  await record('A0-01 model preflight rejection leaves no running ledger or hidden session', async () => {
    await chooseCase(cases.preflight.title)
    const before = readOwners().length
    await evaluate(`window.electronAPI.updateChannel(${JSON.stringify(originalSelection.channelId)},{enabled:false})`)
    if (await evaluate('[...document.querySelectorAll("button")].some(e=>e.getClientRects().length && e.textContent.trim()==="开始审核")')) await clickText('开始审核'); else await clickText('重新审核')
    await eventually('readable preflight failure', 'document.body.innerText.includes("审核渠道或模型未配置")', 30000)
    if(await evaluate('document.body.innerText.includes("Error invoking remote method")')) throw new Error('Preflight UI exposed IPC transport prefix')
    const runs = await evaluate(`window.reviewAPI.listRunsV2(${JSON.stringify(cases.preflight.id)})`)
    if (runs.some(run=>['running','queued'].includes(run.status)) || readOwners().length!==before) throw new Error('Failed preflight left a running run or owner')
    await screenshot('a0-01-preflight-rejection')
    await evaluate(`window.electronAPI.updateChannel(${JSON.stringify(originalSelection.channelId)},{enabled:true})`)
    return {caseId:cases.preflight.id,runs:runs.length,newOwners:0}
  })
  await record('A0-02 real Pi ACK, hidden owner, leave page and persist complete result', async () => {
    await chooseCase(cases.success.title)
    if (await evaluate('[...document.querySelectorAll("button")].some(e=>e.getClientRects().length && e.textContent.trim()==="开始审核")')) await clickText('开始审核'); else await clickText('重新审核')
    const ack = await waitAccepted(cases.success.id)
    if(await evaluate('document.body.innerText.includes("本次审核已停止。")')) throw new Error('Previous case stop feedback leaked into newly accepted review')
    const owner = readOwners().find(session=>session.owner.caseId===cases.success.id)
    if (!owner) throw new Error('No atomically persisted review owner')
    const ordinary = await evaluate('window.electronAPI.listAgentSessions(true)')
    const meta = await evaluate(`window.electronAPI.getAgentSessionMeta(${JSON.stringify(owner.id)})`)
    if (ordinary.some(session=>session.id===owner.id) || meta!==null) throw new Error('Hidden session leaked through ordinary API')
    await screenshot('a0-02-accepted-in-review')
    // 设置是浮层；先关闭真实审核子页，以证明原页面不再承载运行。
    await clickSelector('[aria-label="关闭返回专区首页"]')
    await eventually('review view left', '!document.body.innerText.includes("待我处理")')
    await clickSelector('[aria-label="打开设置"], button:has(svg.lucide-settings)')
    const terminal = await waitTerminal(cases.success.id)
    const run = await evaluate(`window.reviewAPI.getRunV2(${JSON.stringify(cases.success.id)},${JSON.stringify(terminal.runId)})`)
    if (run.status!=='completed' || run.coverage.completedChecks!==1 || !run.checks.some(check=>check.sourceRefs.length>0)) throw new Error('Real model did not submit complete cited result: '+JSON.stringify({status:run.status,coverage:run.coverage,error:run.error}))
    const tabs = await evaluate('(async()=>{const s=await window.electronAPI.getSettings();return s.tabState?.tabs??[]})()')
    if (tabs.some(tab=>tab.sessionId===owner.id || tab.id===owner.id)) throw new Error('Hidden owner opened an ordinary tab')
    await screenshot('a0-02-settings-after-completion')
    await openReview()
    await chooseCase(cases.success.title)
    await eventually('completed business view restored', '!document.body.innerText.includes("审核中，可切换页面")')
    await screenshot('a0-02-result-restored')
    return {caseId:cases.success.id,ack,terminal,runStatus:run.status,checks:run.coverage.completedChecks,sourceRefs:run.checks.reduce((n,c)=>n+c.sourceRefs.length,0),hiddenFromOrdinaryList:true,ordinaryMeta:null,ordinaryTabOpened:false,provider:'deepseek',model:originalSelection.modelId}
  })
  await record('A0-04 real Pi admission then controlled HTTP provider failure persists failed', async () => {
    await new Promise(resolve=>providerFixture.listen(0,'127.0.0.1',resolve))
    const port=providerFixture.address().port
    const channelId=await evaluate(`(async()=>{const c=await window.electronAPI.createChannel({name:'A0 synthetic failure fixture',provider:'custom',baseUrl:'http://127.0.0.1:${port}/v1',apiKey:'a0-fixture-only',enabled:true,agentRuntimes:['pi'],models:[{id:'a0-failure',name:'A0 synthetic model',enabled:true,contextWindow:16000,maxTokens:2000}]});return c.id})()`)
    await evaluate(`window.reviewAPI.saveModuleSettingsV2({agentModelSelection:{channelId:${JSON.stringify(channelId)},modelId:'a0-failure'}})`)
    await chooseCase(cases.failure.title)
    if (await evaluate('[...document.querySelectorAll("button")].some(e=>e.getClientRects().length && e.textContent.trim()==="开始审核")')) await clickText('开始审核'); else await clickText('重新审核')
    const ack=await waitAccepted(cases.failure.id)
    const terminal=await waitTerminal(cases.failure.id)
    if(terminal.runStatus!=='failed' || fixtureRequests===0) throw new Error('HTTP fixture did not prove post-admission runtime failure')
    await eventually('failed business state visible','document.body.innerText.includes("审核未完成")')
    await screenshot('a0-04-runtime-failure')
    await evaluate(`window.reviewAPI.saveModuleSettingsV2({agentModelSelection:${JSON.stringify(originalSelection)}})`)
    providerFixture.close()
    return {caseId:cases.failure.id,ack,terminal,fixtureRequests,provider:'controlled-loopback-http-500',realPiRuntime:true}
  })
  await record('A0-03 stop real Pi through case/run endpoint and persist cancelled', async () => {
    await chooseCase(cases.stop.title)
    if (await evaluate('[...document.querySelectorAll("button")].some(e=>e.getClientRects().length && e.textContent.trim()==="开始审核")')) await clickText('开始审核'); else await clickText('重新审核')
    const ack = await waitAccepted(cases.stop.id)
    await eventually('case stop control', 'document.body.innerText.includes("停止审核")')
    await clickText('停止审核')
    const terminal = await waitTerminal(cases.stop.id)
    if (terminal.runStatus!=='cancelled') throw new Error('Stop did not persist cancellation: '+JSON.stringify(terminal))
    await eventually('cancelled UI restored', 'document.body.innerText.includes("本次审核已停止")')
    await screenshot('a0-03-stopped')
    return {caseId:cases.stop.id,ack,terminal}
  })
  writeFileSync(join(reportDir, 'a0-summary.json'), JSON.stringify({status:'PASS',results,provider:'deepseek',model:originalSelection.modelId,scope:'real Electron/Main IPC/Pi/provider with synthetic cases; production Relay/Pocket/Feishu excluded'},null,2))
} catch (error) {
  writeFileSync(join(reportDir,'a0-summary.json'),JSON.stringify({status:'FAIL',results,error:String(error)},null,2))
  console.error(String(error))
  process.exitCode=1
} finally {
  providerFixture.close()
  if(ws?.readyState===WebSocket.OPEN) {
    await evaluate(`window.electronAPI.updateChannel(${JSON.stringify(originalSelection.channelId)},{enabled:true})`).catch(()=>{})
    await evaluate(`window.reviewAPI.saveModuleSettingsV2({agentModelSelection:${JSON.stringify(originalSelection)}})`).catch(()=>{})
    ws.close()
  }
}
