// P06 补测：真实 IPC stop/start 竞争；真实 Electron 关页重进后延迟投递旧 Controller 回复。
import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
const dir=process.env.QA_REPORT_DIR
if(!dir)throw new Error('QA_REPORT_DIR required')
const cases=JSON.parse(readFileSync(join(dir,'synthetic-cases.json'),'utf8'))
const pages=await(await fetch('http://127.0.0.1:9222/json/list')).json()
const page=pages.find(p=>p.url.startsWith('http://localhost:5176')&&!p.url.includes('window=agent-preview'))
const ws=new WebSocket(page.webSocketDebuggerUrl)
await new Promise((resolve,reject)=>{ws.onopen=resolve;ws.onerror=reject})
const pending=new Map();let seq=0
ws.onmessage=({data})=>{const r=JSON.parse(data);if(pending.has(r.id)){pending.get(r.id)(r);pending.delete(r.id)}}
const call=(method,params={})=>new Promise((resolve,reject)=>{
 const id=++seq;const t=setTimeout(()=>{pending.delete(id);reject(new Error('CDP timeout'))},45000)
 pending.set(id,r=>{clearTimeout(t);r.error?reject(new Error(r.error.message)):resolve(r.result)})
 ws.send(JSON.stringify({id,method,params}))
})
const evaluate=async expression=>{const r=await call('Runtime.evaluate',{expression,awaitPromise:true,returnByValue:true,userGesture:true});if(r.exceptionDetails)throw new Error(r.exceptionDetails.exception?.description??r.exceptionDetails.text);return r.result.value}
const delay=ms=>new Promise(r=>setTimeout(r,ms))
const poll=async(expression)=>{const end=Date.now()+60000;while(Date.now()<end){const r=await evaluate(expression);if(r)return r;await delay(100)}throw new Error('Actual app condition not reached')}
const storeAccess=`const source=await(await fetch('/atoms/review-atoms.ts')).text();const {getDefaultStore}=await import(source.split('from "')[1].split('"')[0]);const atoms=await import('/atoms/review-atoms.ts');const store=getDefaultStore();const {createReviewActionsController}=await import('/components/content-review/review-actions-controller.ts');`
const choose=async caseId=>{await evaluate(`(async()=>{${storeAccess}await createReviewActionsController(store,window.reviewAPI).selectCase(${JSON.stringify(caseId)});return true})()`);await delay(500)}
const click=async text=>{const rect=await evaluate(`(()=>{const b=[...document.querySelectorAll('button,a,[role=button]')].find(b=>b.getClientRects().length&&!b.disabled&&b.textContent.trim().includes(${JSON.stringify(text)}));if(!b)return null;const r=b.getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2}})()`);if(!rect)throw new Error('Actual enabled button missing: '+text);await call('Input.dispatchMouseEvent',{type:'mousePressed',button:'left',clickCount:1,...rect});await call('Input.dispatchMouseEvent',{type:'mouseReleased',button:'left',clickCount:1,...rect})}
const state=caseId=>`window.reviewAPI.getBackgroundPiReviewStateV2(${JSON.stringify(caseId)})`
const accepted=caseId=>poll(`(async()=>{const s=await ${state(caseId)};return s.phase==='accepted'?s:false})()`)
const screenshot=async name=>{const png=await call('Page.captureScreenshot',{format:'png'});writeFileSync(join(dir,name+'.png'),Buffer.from(png.data,'base64'))}
const results=[]
const save=()=>writeFileSync(join(dir,'p06-extra-results.json'),JSON.stringify({applicationSha:process.env.QA_APPLICATION_SHA,results},null,2)+'\n')
try {
 if(!await evaluate('document.body.innerText.includes("待我处理")')){await click('材料审核');await poll('document.body.innerText.includes("待我处理")')}
 await choose(cases.preflight.id)
 await click('开始审核')
 const first=await accepted(cases.preflight.id)
 const overlap=await evaluate(`(async()=>{
  const stopping=window.reviewAPI.stopBackgroundPiReviewV2({caseId:${JSON.stringify(cases.preflight.id)},runId:${JSON.stringify(first.runId)}});
  const starting=window.reviewAPI.startBackgroundPiReviewV2({caseId:${JSON.stringify(cases.preflight.id)},mode:'restart'}).then(s=>({accepted:true,state:s}),e=>({accepted:false,error:String(e)}));
  const stop=await stopping;return {stop,start:await starting};
 })()`)
 const busy=!overlap.start.accepted&&overlap.start.error.includes('正在启动或停止')
 if(overlap.start.accepted)await evaluate(`window.reviewAPI.stopBackgroundPiReviewV2({caseId:${JSON.stringify(cases.preflight.id)},runId:${JSON.stringify(overlap.start.state.runId)}})`)
 results.push({id:'P06-S02-E03',status:busy?'PASS':'NOT-RUN',caseId:cases.preflight.id,firstRunId:first.runId,stopStatus:overlap.stop.runStatus,busyObserved:busy,
  scope:busy?'真实 Pi/IPC stop 等待期间并发 restart 拒绝':'未观察到重叠停止窗口，不据此签收 E03'})
 save()

 await choose(cases.failure.id)
 await click('开始审核')
 const old=await accepted(cases.failure.id)
 await evaluate(`(async()=>{${storeAccess}
  const held={captured:null,issued:false};const gate=new Promise(resolve=>{held.release=resolve});
  const api={...window.reviewAPI,listRunsV2:async id=>{const runs=await window.reviewAPI.listRunsV2(id);held.captured=runs;held.issued=true;return gate}};
  held.controller=createReviewActionsController(store,api);held.promise=held.controller.refreshBackgroundReview(${JSON.stringify(cases.failure.id)});window.__p06Held=held;return true;
 })()`)
 await poll('window.__p06Held.issued')
 await evaluate(`document.querySelector('[aria-label="关闭返回专区首页"]').click()`)
 await poll('!document.body.innerText.includes("待我处理")')
 await evaluate(`window.reviewAPI.stopBackgroundPiReviewV2({caseId:${JSON.stringify(cases.failure.id)},runId:${JSON.stringify(old.runId)}})`)
 await click('材料审核')
 await poll('document.body.innerText.includes("待我处理")')
 await choose(cases.failure.id)
 await click('重新审核')
 const next=await accepted(cases.failure.id)
 await poll(`(async()=>{${storeAccess}return store.get(atoms.reviewWorkspaceRunsByCaseAtom)[${JSON.stringify(cases.failure.id)}]?.id===${JSON.stringify(next.runId)}&&store.get(atoms.reviewExecutionByCaseAtom)[${JSON.stringify(cases.failure.id)}]?.status==='running'})()`)
 const after=await evaluate(`(async()=>{window.__p06Held.release(window.__p06Held.captured);await window.__p06Held.promise;${storeAccess}
  const view=store.get(atoms.reviewExecutionByCaseAtom)[${JSON.stringify(cases.failure.id)}];const uiRun=store.get(atoms.reviewWorkspaceRunsByCaseAtom)[${JSON.stringify(cases.failure.id)}];const main=await ${state(cases.failure.id)};
  return {uiRunId:uiRun?.id,uiStatus:view?.status,main};
 })()`)
 await screenshot('p06-e05-old-page-response-regression')
 const stable=after.uiRunId===next.runId&&after.uiStatus==='running'
 results.push({id:'P06-S02-E05',status:stable?'PASS':'FAIL',caseId:cases.failure.id,oldRunId:old.runId,newRunId:next.runId,...after,
  scope:'实际关闭审核子页/重新进入；真实 Controller/Jotai，人工延迟真实旧 listRuns 回复；没有注入生产 SDK 回调'})
 await evaluate(`(async()=>{${storeAccess}await createReviewActionsController(store,window.reviewAPI).refreshBackgroundReview(${JSON.stringify(cases.failure.id)});return true})()`)
 const retired=await evaluate(`window.reviewAPI.stopBackgroundPiReviewV2({caseId:${JSON.stringify(cases.failure.id)},runId:${JSON.stringify(next.runId)}})`)
 results.at(-1).cleanupStatus=retired.runStatus
 delete globalThis.__p06Held
 save()
 if(!stable)process.exitCode=1
 console.log(JSON.stringify(results))
} catch(error) {
 results.push({id:'SUPPLEMENT-SETUP',status:'FAIL',error:String(error)});save();process.exitCode=1;console.error(String(error))
} finally {
 for(const c of [cases.preflight,cases.failure]){
  await evaluate(`(async()=>{const s=await ${state(c.id)};if(s.phase==='accepted')await window.reviewAPI.stopBackgroundPiReviewV2({caseId:${JSON.stringify(c.id)},runId:s.runId});delete window.__p06Held;return true})()`).catch(()=>{})
 }
 ws.close()
}
