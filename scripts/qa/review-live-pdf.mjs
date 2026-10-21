// 复用真实普通会话的合成扫描 PDF；逐步记录 Main IPC 和 iframe 页面证据。
import{readFileSync,writeFileSync}from'node:fs';import{join}from'node:path';import assert from'node:assert/strict';import{connect,storeAccess,ensureReviewPage}from'./review-live-cdp.mjs'
const dir=process.env.QA_REPORT_DIR,profile=process.env.QA_PROFILE_ROOT,r=await connect(),f=JSON.parse(readFileSync(join(dir,'office/preview-private-session.json'))),path=join(f.workspace,'scan-fixture.pdf'),q=JSON.stringify
const row={id:'E06-SCAN-PDF',sourceSha:process.env.QA_APPLICATION_SHA,status:'RUNNING',assertions:[]},save=()=>writeFileSync(join(dir,'pdf-result.json'),JSON.stringify(row,null,2)+'\n'),check=(name,ok)=>{row.assertions.push({name,pass:!!ok});save();assert.ok(ok,name)}
try{
 await r.call('Page.enable')
 const prepared=await r.evaluate(`window.electronAPI.preparePdfPreview(${q(path)},{sessionId:${q(f.id)}})`)
 check('真实 Main PDF 准备 IPC 返回受控 URL',prepared?.tmpHtmlUrl?.startsWith('cdut-file://'))
 const tab=await r.evaluate(`(async()=>{${storeAccess}const p=await import('/components/diff/preview-opener.ts');const a=await import('/atoms/active-view.ts');store.set(a.activeViewAtom,'conversations');return !!await p.openFilePreviewTabAuthorized(store,${q(f.id)},{filePath:${q(path)},previewOnly:true,readOnly:true})})()`)
 check('真实 PDF Renderer Tab 已打开',tab)
 await r.poll(`(()=>{const e=document.querySelector('iframe[title="scan-fixture.pdf"]');return e?.getAttribute('src')?.startsWith('cdut-file://')})()`,60000)
 const displayedUrl=await r.evaluate(`document.querySelector('iframe[title="scan-fixture.pdf"]').getAttribute('src')`)
 const targets=await r.call('Target.getTargets'),target=targets.targetInfos.find(t=>t.type==='iframe'&&t.url.startsWith(displayedUrl))
 check('真实 PDF iframe 导航已完成',!!target)
 const attachment=await r.call('Target.attachToTarget',{targetId:target.targetId,flatten:true})
 let proof;const end=Date.now()+60000
 while(Date.now()<end){const a=await r.call('Runtime.evaluate',{expression:'(()=>{const c=document.querySelector("canvas");return {width:c?.width,height:c?.height,rendered:!!c&&c.width>0&&c.height>0,error:document.getElementById("err")?.textContent}})()',returnByValue:true},attachment.sessionId);proof=a.result?.value;if(proof?.rendered)break;await new Promise(v=>setTimeout(v,100))}
 row.canvas=proof;check('真实 PDF 页面已绘制 canvas',proof?.rendered)
 await r.screenshot(dir,'e06-scan-pdf-cropped',{x:315,y:82,width:1270,height:780,scale:1})
 await ensureReviewPage(r);row.status='PASS'
}catch(e){row.status='FAIL';row.error=String(e);process.exitCode=1;await r.screenshot(dir,'e06-scan-pdf-failed-cropped',{x:315,y:82,width:1270,height:780,scale:1}).catch(()=>{})}
finally{row.finishedAt=new Date().toISOString();save();r.close();console.log(JSON.stringify({id:row.id,status:row.status,assertions:row.assertions.length,error:row.error}))}
