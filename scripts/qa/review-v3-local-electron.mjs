import {readFileSync,writeFileSync} from 'node:fs'
import {join} from 'node:path'
import {createHash} from 'node:crypto'
import {execFileSync} from 'node:child_process'
import WebSocket from 'ws'
const dir=process.env.QA_REPORT_DIR
if(!dir||!process.env.DISPLAY)throw Error('DISPLAY_AND_QA_REPORT_DIR_REQUIRED')
const file=join(dir,'real-v3-original.txt'),hash=createHash('sha256').update(readFileSync(file)).digest('hex')
const doc=readFileSync('docs/design/review-agent/16-batch-review-stage-b-local-acceptance.md','utf8')
const username=doc.match(/\|\s*账号\s*\|\s*([^|]+)\|/)?.[1]?.trim().replaceAll(String.fromCharCode(96),'')
const password=doc.match(/\|\s*密码\s*\|\s*([^|]+)\|/)?.[1]?.trim().replaceAll(String.fromCharCode(96),'')
const sleep=ms=>new Promise(r=>setTimeout(r,ms)),results=[],pending=new Map()
let ws,seq=0,caseId=''
async function call(method,params={}){
 const id=++seq
 return new Promise((resolve,reject)=>{
  const timer=setTimeout(()=>{pending.delete(id);reject(Error('CDP_TIMEOUT '+method))},30000)
  pending.set(id,{resolve,reject,timer});ws.send(JSON.stringify({id,method,params}))
 })
}
async function evalJs(expression){
 const r=await call('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true,userGesture:true})
 if(r.exceptionDetails)throw Error('RENDERER_EXCEPTION '+(r.exceptionDetails.exception?.description||r.exceptionDetails.text))
 return r.result?.value
}
async function wait(label,expression,ms=35000){
 const until=Date.now()+ms;let last
 while(Date.now()<until){try{last=await evalJs(expression);if(last)return last}catch(e){last=String(e)}await sleep(400)}
 throw Error('GUI_TIMEOUT '+label+' '+JSON.stringify(last))
}
async function click(label){
 const ok=await evalJs('(()=>{const t='+JSON.stringify(label)+';const n=[...document.querySelectorAll("button,a,[role=button],[role=tab]")].find(e=>e.getClientRects().length&&(e.textContent||"").includes(t));if(!n)return false;n.click();return true})()')
 if(!ok)throw Error('ACTION_NOT_VISIBLE '+label)
}
async function clickSelector(selector){
 const ok=await evalJs('(()=>{const n=document.querySelector('+JSON.stringify(selector)+');if(!n||!n.getClientRects().length)return false;n.click();return true})()')
 if(!ok)throw Error('ACTION_NOT_VISIBLE '+selector)
}
async function fill(label,value){
 const ok=await evalJs('(()=>{const x=document.querySelector("input[aria-label="+JSON.stringify('+JSON.stringify(label)+')+"]");if(!x)return false;Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,"value").set.call(x,'+JSON.stringify(value)+');x.dispatchEvent(new Event("input",{bubbles:true}));x.dispatchEvent(new Event("change",{bubbles:true}));return true})()')
 if(!ok)throw Error('INPUT_NOT_VISIBLE '+label)
}
async function shot(label){const x=await call('Page.captureScreenshot',{format:'png'});writeFileSync(join(dir,label+'.png'),Buffer.from(x.data,'base64'))}
async function step(label,fn){
 try{const data=await fn();results.push({label,status:'PASS',data});console.log('[PASS]',label,JSON.stringify(data));await shot('pass-'+results.length)}
 catch(e){results.push({label,status:'FAIL',error:String(e)});console.error('[FAIL]',label,e);await shot('failure-'+results.length).catch(()=>{});throw e}
 finally{writeFileSync(join(dir,'results.json'),JSON.stringify(results,null,2))}
}
async function connect(){
 let target;const until=Date.now()+90000
 while(Date.now()<until){try{
  const rows=await(await fetch('http://127.0.0.1:9222/json/list')).json()
  target=rows.find(x=>String(x.url).startsWith('http://localhost:5176'))?.webSocketDebuggerUrl
  if(target)break
 }catch{}await sleep(450)}
 if(!target)throw Error('REAL_ELECTRON_RENDERER_MISSING')
 ws=new WebSocket(target)
 await new Promise((ok,fail)=>{ws.once('open',ok);ws.once('error',fail)})
 ws.on('message',raw=>{const msg=JSON.parse(String(raw)),job=pending.get(msg.id);if(!job)return;pending.delete(msg.id);clearTimeout(job.timer);msg.error?job.reject(Error(JSON.stringify(msg.error))):job.resolve(msg.result)})
 await call('Runtime.enable');await call('Page.enable')
}
async function navigate(){
 await wait('preload','!!window.reviewAPI?.readLocalNativeProductV3',90000)
 await wait('CDUT navigation','!!document.querySelector("[data-profer-navigation-region=mode-switcher-cdut]")',90000)
 // 当前上游在首次启动展示公告与教程，先通过真实按钮关闭遮罩。
 await sleep(1000)
 for(let attempt=0;attempt<3;attempt++){
  for(const label of ['我知道了','稍后再学']){
   if(await evalJs('[...document.querySelectorAll("button")].some(x=>x.getClientRects().length&&x.textContent?.trim()==='+JSON.stringify(label)+')'))await click(label)
  }
  await sleep(250)
 }
 const target=await evalJs('(()=>{const el=document.querySelector("[data-profer-navigation-region=mode-switcher-cdut]");if(!el||!el.getClientRects().length)return null;const r=el.getBoundingClientRect();return{x:r.left+r.width/2,y:r.top+r.height/2,text:el.innerText}})()')
 console.log('CDUT zone actual pointer target',JSON.stringify(target))
 if(!target)throw Error('CDUT_ZONE_BUTTON_MISSING_IN_REAL_RENDERER')
 await call('Input.dispatchMouseEvent',{type:'mouseMoved',x:target.x,y:target.y})
 await call('Input.dispatchMouseEvent',{type:'mousePressed',x:target.x,y:target.y,button:'left',clickCount:1})
 await call('Input.dispatchMouseEvent',{type:'mouseReleased',x:target.x,y:target.y,button:'left',clickCount:1})
 await sleep(1250)
 const active=await evalJs('(()=>({zone:document.body?.innerText?.includes("特区账户"),mode:document.querySelector("[data-profer-navigation-region=mode-switcher-cdut]")?.className,body:document.body?.innerText?.slice(0,900)}))()')
 console.log('CDUT mode-switch result',JSON.stringify(active))
 if(!active.zone)throw Error('CDUT_ZONE_NOT_VISIBLE_AFTER_ACTUAL_BUTTON_CLICK '+JSON.stringify(active))
 if(await evalJs('!!document.querySelector("input[type=password]")')){
  if(!username||!password)throw Error('QA_DEMO_CREDENTIALS_NOT_DOCUMENTED')
  const ok=await evalJs('(()=>{const p=document.querySelector("input[type=password]");const u=[...document.querySelectorAll("input")].find(e=>e!==p&&e.getClientRects().length&&["text","tel",""].includes(e.type));if(!p||!u)return false;const s=Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,"value").set;for(const [el,val] of [[u,'+JSON.stringify(username)+'],[p,'+JSON.stringify(password)+']]){s.call(el,val);el.dispatchEvent(new Event("input",{bubbles:true}));el.dispatchEvent(new Event("change",{bubbles:true}))}return true})()')
  if(!ok)throw Error('LOGIN_INPUTS_NOT_AVAILABLE')
  await click('一键连接特区账户')
 }
 // 使用当前上游的专区模块卡片进入审核；不依赖已经移除的旧入口锚点。
 await wait('review entry','[...document.querySelectorAll("button")].some(x=>x.getClientRects().length&&x.textContent?.includes("材料审核"))',60000)
 if(await evalJs('[...document.querySelectorAll("button")].some(x=>x.getClientRects().length&&x.textContent?.trim()==="稍后再学")'))await click('稍后再学')
 await click('材料审核')
 await wait('review navigation','!!document.querySelector("nav[aria-label=审核工作页]")')
 if(await evalJs('!!document.querySelector("section[aria-label=审核模型就绪检查]")'))await click('跳过，稍后设置')
 await click('审核模板')
 // 候选分栏位于审核模板工作区。
 await wait('templates section','!!document.querySelector("[data-testid=review-section-templates]")',30000)
 await clickSelector('[data-testid=review-section-templates]')
 await wait('candidate tab','!!document.querySelector("[data-testid=review-section-local-candidates]")',30000)
 await clickSelector('[data-testid=review-section-local-candidates]')
 await wait('advanced options','!!document.querySelector("button[role=switch][aria-label=高级选项]")')
 if(await evalJs('document.querySelector("button[role=switch][aria-label=高级选项]")?.getAttribute("aria-checked")!=="true"'))await clickSelector('button[role=switch][aria-label=高级选项]')
 await wait('create case UI','!!document.querySelector("input[aria-label=本地案卷标题]")')
}
try{
 await connect()
 await step('E1 actual Electron window and local workspace',async()=>{await navigate();return{entry:true}})
 await step('E2 real native Case create and reopen',async()=>{
  await fill('本地案卷标题','V3 native GUI '+Date.now());await click('创建未绑定模板案卷')
  await wait('case created','document.body?.innerText?.includes("本机原生案卷已创建：")')
  caseId=await evalJs('document.querySelector('+JSON.stringify('input[aria-label="当前本机案卷 ID"]')+')?.value')
  const data=await evalJs('(async()=>{const x=await window.reviewAPI.getAggregateV2('+JSON.stringify(caseId)+');return {id:x?.caseV2?.id,stage:x?.caseV2?.stage}})()')
  if(!caseId||data.id!==caseId||data.stage!=='draft')throw Error('CASE_NOT_DURABLE '+JSON.stringify(data))
  return data
 })
 await step('E3 OS native picker, physical original and SHA',async()=>{
  await click('选择并导入申请材料');await sleep(1200)
  const xd=(...args)=>execFileSync('xdotool',args,{encoding:'utf8',timeout:10000}).trim()
  const focusedChooser=xd('getactivewindow','getwindowname')
  console.log('Focused chooser: '+focusedChooser)
  if(!/Open Files|打开/.test(focusedChooser))throw Error('NATIVE_FILE_CHOOSER_NOT_FOCUSED '+focusedChooser)
  xd('key','--clearmodifiers','ctrl+l');await sleep(300);xd('key','--clearmodifiers','ctrl+a')
  xd('type','--clearmodifiers','--delay','2',file);xd('key','Return');await sleep(850)
  if(/Open Files|打开/.test(xd('getactivewindow','getwindowname')))xd('key','--clearmodifiers','alt+o')
  await wait('material import','document.body?.innerText?.includes("成功导入 1 份")',65000)
  const docs=await evalJs('(async()=>{const x=await window.reviewAPI.getAggregateV2('+JSON.stringify(caseId)+');return x?.caseV2?.documents?.map(y=>({hash:y.byteHash,version:y.versionId,role:y.role}))})()')
  const match=docs?.filter(x=>x.hash===hash&&x.role==='application')
  if(match?.length!==1)throw Error('PHYSICAL_SOURCE_MISMATCH '+JSON.stringify(docs))
  return {hash,version:match[0].version}
 })
 await step('E4 true Main materials and bundled template routing',async()=>{
  await click('从真实原件刷新 50+1 候选工作台')
  await wait('route UI','!!document.querySelector("[data-testid=review-v3-b3-route-panel]")')
  const data=await evalJs('(async()=>{const x=await window.reviewAPI.readLocalNativeProductV3('+JSON.stringify(caseId)+');return{caseId:x.read.caseCandidateId,route:x.read.route?.status,hashes:x.read.inventory?.sources?.map(s=>s.rawSha256),published:x.read.publicationAllowed,school:x.read.schoolPolicyVerified}})()')
  if(data.caseId!==caseId||!data.hashes?.includes(hash)||data.published!==false||data.school!==false)throw Error('SOURCE_OR_SCHOOL_MISREPRESENTED '+JSON.stringify(data))
  return data
 })
 await step('E5 local manual Check anchored in real original',async()=>{
  await fill('事项名称','物理原件人工待核');await click('登记真实来源人工事项')
  await wait('human Check saved','document.body?.innerText?.includes("已通过真实原件版本登记人工声明")')
  const n=await evalJs('(async()=>{const x=await window.reviewAPI.getAggregateV2('+JSON.stringify(caseId)+');return x?.caseV2?.subjects?.length})()')
  if(!n)throw Error('HUMAN_CHECK_NOT_PERSISTED')
  return {subjects:n}
 })
 await step('E6 local Case history and no fabricated pre-run report',async()=>{
  await wait('no premature report','document.body?.innerText?.includes("本案尚无真实运行，完成审核后可在这里直接下载报告")')
  await click('列出本机历史案卷')
  await wait('local history','document.querySelector('+JSON.stringify('select[aria-label="从历史案卷重开"]')+')?.innerText?.includes('+JSON.stringify(caseId)+')')
  const stored=await evalJs('(async()=>{const x=await window.reviewAPI.getAggregateV2('+JSON.stringify(caseId)+');return{hashes:x?.caseV2?.documents?.map(y=>y.byteHash),subjects:x?.caseV2?.subjects?.length}})()')
  if(!stored.hashes?.includes(hash)||!stored.subjects)throw Error('CASE_HISTORY_LOST_EVIDENCE '+JSON.stringify(stored))
  return {noPrematureReport:true,inHistory:true,caseId,...stored}
 })
}catch(e){process.exitCode=1;console.error('GATE_E_REAL_ELECTRON_FAILURE',e)}
finally{writeFileSync(join(dir,'results.json'),JSON.stringify(results,null,2));ws?.close()}
if(results.length!==6||results.some(x=>x.status!=='PASS'))process.exitCode=1
