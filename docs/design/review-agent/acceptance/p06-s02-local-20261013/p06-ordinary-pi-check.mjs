// 普通 Pi 的局部正例：真实普通 create/list/meta/send/SDK IPC；不签收完整 E06 产品矩阵。
import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
const dir=process.env.QA_REPORT_DIR
const profile=process.env.QA_PROFILE_ROOT
if(!dir||!profile)throw new Error('必须指定隔离验收目录')
const selected=JSON.parse(readFileSync(join(profile,'config/review-module-settings.json'),'utf8')).agentModelSelection
const pages=await(await fetch('http://127.0.0.1:9222/json/list')).json()
const target=pages.find(p=>p.url.startsWith('http://localhost:5176')&&!p.url.includes('window=agent-preview'))
const ws=new WebSocket(target.webSocketDebuggerUrl);await new Promise(r=>ws.onopen=r)
let seq=0;const pending=new Map()
ws.onmessage=({data})=>{const r=JSON.parse(data);if(pending.has(r.id)){pending.get(r.id)(r);pending.delete(r.id)}}
const evaluate=expression=>new Promise((resolve,reject)=>{
 const id=++seq;const t=setTimeout(()=>reject(new Error('普通 Pi 验证超时')),120000)
 pending.set(id,r=>{clearTimeout(t);if(r.error||r.result?.exceptionDetails)reject(new Error(r.error?.message??r.result.exceptionDetails.exception?.description));else resolve(r.result.result.value)})
 ws.send(JSON.stringify({id,method:'Runtime.evaluate',params:{expression,awaitPromise:true,returnByValue:true,userGesture:true}}))
})
try {
 const result=await evaluate(`(async()=>{
  const session=await window.electronAPI.createAgentSession('P06 普通 Pi 合成正例',${JSON.stringify(selected.channelId)},undefined,${JSON.stringify(selected.modelId)});
  if(session.owner || session.agentRuntime!=='pi')throw new Error('普通 Pi 会话创建不符合预期');
  const list=await window.electronAPI.listAgentSessions(true);const meta=await window.electronAPI.getAgentSessionMeta(session.id);
  await window.electronAPI.sendAgentMessage({sessionId:session.id,channelId:${JSON.stringify(selected.channelId)},modelId:${JSON.stringify(selected.modelId)},agentRuntime:'pi',triggeredBy:'user',uuid:crypto.randomUUID(),userMessage:'这是合成验收。请只回复 P06_NORMAL_AGENT_OK，不执行任何工具或读取任何文件。'});
  const messages=await window.electronAPI.getAgentSessionSDKMessages(session.id);
  const assistants=messages.filter(m=>m.type==='assistant'&&((m.message?.usage?.input_tokens??0)+(m.message?.usage?.output_tokens??0)>0));
  const answer=assistants.flatMap(m=>m.message?.content??[]).filter(c=>c.type==='text').map(c=>c.text).join('');
  return {ordinaryVisible:list.some(s=>s.id===session.id),ordinaryMetadataAccessible:meta?.id===session.id,ownerAbsent:!meta?.owner,providerReplies:assistants.length,markerReturned:answer.includes('P06_NORMAL_AGENT_OK'),scope:'真实普通 IPC/Pi/provider 正例；完整聊天 UI、权限、工具、Claude、批量、Pocket 等尚未签收'};
 })()`)
 const pass=result.ordinaryVisible&&result.ordinaryMetadataAccessible&&result.ownerAbsent&&result.providerReplies>0&&result.markerReturned
 writeFileSync(join(dir,'ordinary-pi-positive.json'),JSON.stringify({status:pass?'PASS':'FAIL',applicationSha:process.env.QA_APPLICATION_SHA,...result},null,2)+'\n')
 console.log(JSON.stringify({status:pass?'PASS':'FAIL',...result}));if(!pass)process.exitCode=1
} finally { ws.close() }
