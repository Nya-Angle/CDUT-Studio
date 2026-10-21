// 独立普通会话：真实扫描 PDF/Office Renderer、路径拒止及跨进程恢复。
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs'
import {join} from 'node:path'
import {execFileSync} from 'node:child_process'
import assert from 'node:assert/strict'
import {connect,storeAccess,ensureReviewPage} from './review-live-cdp.mjs'
const dir=process.env.QA_REPORT_DIR, profile=process.env.QA_PROFILE_ROOT, mode=process.argv[2]??'prepare'
if(!dir||!profile?.includes('p06-recheck-live-'))throw Error('需要独立 profile')
const row={id:'E06-PREVIEW-RESTORE-'+mode,sourceSha:process.env.QA_APPLICATION_SHA,status:'RUNNING',assertions:[]},q=JSON.stringify
const save=()=>writeFileSync(join(dir,'preview-restore-'+mode+'.json'),JSON.stringify(row,null,2)+'\n')
const check=(name,ok)=>{row.assertions.push({name,pass:!!ok});save();assert.ok(ok,name)}
const r=await connect();let id,workspace
const privatePath=join(dir,'preview-private-session.json')
async function open(name){return r.evaluate(`(async()=>{${storeAccess}const p=await import('/components/diff/preview-opener.ts');const a=await import('/atoms/active-view.ts');store.set(a.activeViewAtom,'conversations');return !!await p.openFilePreviewTabAuthorized(store,${q(id)},{filePath:${q(join(workspace,name))},previewOnly:true,readOnly:true})})()`)}
try{
 if(mode==='prepare'||mode==='prepare-office'){
  const m=JSON.parse(readFileSync(join(profile,'config/review-module-settings.json'))).agentModelSelection
  const s=await r.evaluate(`window.electronAPI.createAgentSession('P06 合成预览恢复',${q(m.channelId)},undefined,${q(m.modelId)})`);id=s.id;workspace=join(profile,'config/agent-workspaces/default',id);mkdirSync(workspace,{recursive:true})
  writeFileSync(privatePath,JSON.stringify({id,workspace}))
  execFileSync('python3',['-c',`from PIL import Image,ImageDraw
import zipfile,pathlib
p=pathlib.Path(${JSON.stringify(workspace)})
i=Image.new('RGB',(600,800),'white');d=ImageDraw.Draw(i);d.text((40,60),'P06_SCAN_PDF_SYNTHETIC_ONLY',fill='black');i.save(p/'scan-fixture.pdf','PDF',resolution=72)
with zipfile.ZipFile(p/'office-fixture.docx','w') as z:
 z.writestr('[Content_Types].xml','<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>')
 z.writestr('_rels/.rels','<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>')
 z.writestr('word/document.xml','<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body><w:p><w:r><w:t>P06_OFFICE_SYNTHETIC_ONLY</w:t></w:r></w:p></w:body></w:document>')
`])
  const f=JSON.parse(readFileSync(join(profile,'../io-accepted/io-private-binding.json')))
  const owned=join(profile,'config/agent-workspaces/default',f.sessionId,'p06-owned-deny.txt');writeFileSync(owned,'P06_REVIEW_OWNED_SYNTHETIC_ONLY')
  const actual=await r.evaluate(`window.electronAPI.resolveAndReadFile(${q(owned)},{sessionId:${q(id)}})`)
  check('真实审核 owner 工作区合成文件被普通会话拒止',actual===null)
  if(mode!=='prepare-office'){
  check('真实扫描 PDF 已打开授权预览 Tab',await open('scan-fixture.pdf'))
  const frameTree=await r.call('Page.getFrameTree');const frames=frameTree.frameTree.childFrames??[]
  const frame=frames.find(f=>f.frame.url.includes('pdf')||f.frame.url.includes('preview'))?.frame
  if(!frame)throw Error('真实 PDF iframe 未创建')
  const world=await r.call('Page.createIsolatedWorld',{frameId:frame.id,worldName:'p06-pdf-witness'})
  const deadline=Date.now()+60000;let pdf
  while(Date.now()<deadline){const v=await r.call('Runtime.evaluate',{contextId:world.executionContextId,expression:'(()=>{const c=document.querySelector("canvas");return {width:c?.width,height:c?.height,rendered:!!c&&c.width>0&&c.height>0}})()',returnByValue:true});pdf=v.result?.value;if(pdf?.rendered)break;await new Promise(a=>setTimeout(a,100))}
  row.pdf=pdf;check('真实 PDF iframe Renderer 已绘制页面 canvas',pdf?.rendered)
  await r.screenshot(dir,'e06-scan-pdf-cropped',{x:315,y:82,width:1270,height:780,scale:1})
  }
  check('真实 Office 已打开授权预览 Tab',await open('office-fixture.docx'))
  await r.poll('document.body.innerText.includes("P06_OFFICE_SYNTHETIC_ONLY")',60000)
  check('真实 Office Renderer 显示合成内容',await r.evaluate('document.body.innerText.includes("P06_OFFICE_SYNTHETIC_ONLY")'))
  await r.screenshot(dir,'e06-office-cropped',{x:315,y:82,width:1270,height:780,scale:1})
  await r.evaluate(`window.electronAPI.sendAgentMessage({sessionId:${q(id)},channelId:${q(m.channelId)},modelId:${q(m.modelId)},agentRuntime:'pi',triggeredBy:'user',uuid:crypto.randomUUID(),userMessage:'这是合成恢复测试，请只回复 P06_RESTORE_SYNTHETIC_OK，不使用任何工具。'})`)
  check('重启前真实 provider 会话已持久化',await r.evaluate(`window.electronAPI.getAgentSessionSDKMessages(${q(id)}).then(m=>m.some(x=>JSON.stringify(x).includes('P06_RESTORE_SYNTHETIC_OK')))`))
 }else{
  ({id,workspace}=JSON.parse(readFileSync(privatePath)))
  await r.poll('!!window.electronAPI?.listAgentSessions')
  check('真实新进程 list/meta 保留普通会话',await r.evaluate(`(async()=>{const l=await window.electronAPI.listAgentSessions(true),m=await window.electronAPI.getAgentSessionMeta(${q(id)});return l.some(s=>s.id===${q(id)})&&m?.id===${q(id)}&&!m.owner})()`))
  check('新进程 SDK IPC 恢复持久合成回复',await r.evaluate(`window.electronAPI.getAgentSessionSDKMessages(${q(id)}).then(m=>m.some(x=>JSON.stringify(x).includes('P06_RESTORE_SYNTHETIC_OK')))`))
  check('重启后 Office 授权预览仍正常',await open('office-fixture.docx'))
  await r.poll('document.body.innerText.includes("P06_OFFICE_SYNTHETIC_ONLY")',60000)
  check('重启后真实 Office Renderer 恢复内容',await r.evaluate('document.body.innerText.includes("P06_OFFICE_SYNTHETIC_ONLY")'))
 }
 await ensureReviewPage(r);check('预览后真实页面切换正常',await r.evaluate('document.body.innerText.includes("待我处理")'))
 row.status='PASS'
}catch(e){row.status='FAIL';row.error=String(e);process.exitCode=1}
finally{row.finishedAt=new Date().toISOString();save();r.close();console.log(JSON.stringify({id:row.id,status:row.status,assertions:row.assertions.length,error:row.error}))}
