// 真实批次 Pi/provider 队列正例与 B/C 拒止子集；不签收完整学校审批矩阵。
import { writeFileSync } from 'node:fs'
import { join } from 'node:path'
import assert from 'node:assert/strict'
import { connect, ensureReviewPage } from './review-live-cdp.mjs'
const dir = process.env.QA_REPORT_DIR, profile = process.env.QA_PROFILE_ROOT
const renderer = await connect(), main = await connect(9230, () => true)
const row = { id: 'E06-BATCH-REAL-QUEUE-AND-GATES', status: 'RUNNING', sourceSha: process.env.QA_APPLICATION_SHA, assertions: [], timeline: [] }
const q = JSON.stringify
const save = () => writeFileSync(join(dir, 'batch-real-result.json'), JSON.stringify(row, null, 2) + '\n')
const check = (name, ok) => { row.assertions.push({ name, pass: !!ok }); save(); assert.ok(ok, name) }
const trace = (event, details = {}) => { row.timeline.push({ at: new Date().toISOString(), event, ...details }); save() }
try {
  await ensureReviewPage(renderer)
  const suffix = Date.now().toString(36), templateId = 'p06-batch-live-' + suffix, batchId = 'p06-batch-live-' + suffix
  const paths = []
  for (const [label, content] of [['A', '合成申请 A：读书交流活动，总预算100元。'], ['B', '合成申请 B：读书交流活动，总预算120元。'], ['C', '合成申请 C：读书交流活动，未提供预算金额。']]) {
    const path = join(profile, 'batch-' + suffix + '-' + label + '.txt')
    writeFileSync(path, content + '\n仅用于隔离验收，非学校真实材料。\n'); paths.push(path)
  }
  const cases = await renderer.evaluate(`(async()=>{const t={templateId:${q(templateId)},version:1,schemaVersion:2,name:'P06 合成真实批次',objectType:'person',displayName:{template:'{{title}}'},fields:[],sections:[{id:'all',name:'预算核验',order:0,required:false,criteria:[{id:'budget',title:'预算文字',requirement:'完整读取申请材料并核对总预算是否明确为100元。金额缺失需要补件，其他金额不符合。必须引用本轮实际读取的出处。',execution:'semantic',targetScope:'case'}]}],materialSlots:[],policyVersionIds:[],policyRefs:[],stages:[{id:'review',name:'本地核验',kind:'auto-check',executorRole:'reviewer'}],outputs:[],status:'draft',createdAt:new Date().toISOString()};await window.reviewAPI.saveTemplateDraftV2(t);await window.reviewAPI.publishTemplateV2(t.templateId,1);const result=[];for(const [i,path]of ${q(paths)}.entries()){const c=await window.reviewAPI.createCase({title:'P06 批次合成 '+['A','B','C'][i],type:'自定义审核',applicant:'合成测试甲',academicYear:'2026',reviewTemplate:{templateId:t.templateId,version:1}});await window.reviewAPI.importDocumentFromPath({caseId:c.id,sourcePath:path,role:'application'});result.push(c.id)}await window.reviewAPI.createBatchV2({id:${q(batchId)},name:'P06 真实模型三案兼容',templateId:t.templateId,templateVersion:1,policyVersionLock:[],caseIds:result,createdAt:new Date().toISOString()});return result})()`)
  check('真实 Main 创建三个合成案卷与批次', cases.length === 3)
  trace('real-batch-created', { batchId, cases })
  const eventOffset = await main.evaluate('__p06Live.events.length')
  await renderer.evaluate(`window.__p06Batch={done:false};window.__p06Batch.promise=window.reviewAPI.runBatchV2(${q(batchId)}).then(s=>{window.__p06Batch.done=true;window.__p06Batch.state=s;return s},e=>{window.__p06Batch.done=true;window.__p06Batch.error=String(e);throw e});true`)
  await renderer.poll('window.__p06Batch.done', 300000)
  const state = await renderer.evaluate('window.__p06Batch.promise')
  row.queue = { status: state.status, cases: state.cases.map(c => ({ caseId: c.caseId, status: c.status, error: c.error })) }
  check('真实队列三个案卷均 done', state.cases.length === 3 && state.cases.every(c => c.status === 'done'))
  row.runs = await renderer.evaluate(`(async()=>{const result=[];for(const caseId of ${q(cases)}){const r=(await window.reviewAPI.listRunsV2(caseId))[0];const a=await window.reviewAPI.getAggregateV2(caseId);result.push({caseId,runId:r?.id,status:r?.status,checks:r?.checks?.map(c=>({ruleId:c.ruleId,status:c.status,sourceRefCount:c.sourceRefs?.length??0})),modelUsage:r?.modelUsage?.map(u=>({purpose:u.purpose,model:u.model,protocol:u.protocol,tokens:u.tokens,inputTokens:u.inputTokens,outputTokens:u.outputTokens})),decisionCount:a?.decisions.length})}return result})()`)
  row.providerWitness = await main.evaluate(`__p06Live.events.slice(${eventOffset}).filter(e=>e.event.startsWith('real-pi-'))`)
  check('真实 Pi query 与有用量的 provider 回执已命中', row.providerWitness.filter(e=>e.event==='real-pi-query-entered').length>=3 && row.providerWitness.filter(e=>e.event==='real-pi-assistant-received' && e.inputTokens+e.outputTokens>0).length>=3)
  row.modelUsageScope = 'V2 modelUsage 当前仅收集图像路径；真实文字 Pi 用量由实际 SDK 回执单独见证。前两次错误地要求该 V2 字段非空的失败原样保留。'
  check('每案有真实检查记录', row.runs.every(r => r.checks?.length > 0))
  check('默认辅助不会自动形成正式决定', row.runs.every(r => r.decisionCount === 0))
  trace('real-model-queue-finished', row.queue)
  const preview = await renderer.evaluate(`window.reviewAPI.previewBatchGroupV2({batchId:${q(batchId)},groupKey:'synthetic-stale-group',caseIds:${q(cases)},action:'confirm-issue',reason:'合成过期问题组必须拒止'}).then(s=>({allowed:true}),e=>({allowed:false,error:String(e)}))`)
  row.staleGroupPreview = preview
  check('真实 B 路径拒绝过期问题组', !preview.allowed && preview.error.includes('问题组已失效'))
  const denial = await renderer.evaluate(`window.reviewAPI.batchActionV2({action:'configure-automation',batchId:${q(batchId)},mode:'auto-approve',confirmed:true}).then(()=>({allowed:true}),e=>({allowed:false,error:String(e)}))`)
  row.autoApprovalDenial = denial
  check('真实 C 路径拒绝未开启全局代批', !denial.allowed && denial.error.includes('全局 AI 代批授权未开启'))
  await renderer.click('批次管理')
  await renderer.poll('!!document.querySelector("select[aria-label=当前审核批次]")')
  await renderer.evaluate(`(()=>{const e=document.querySelector('select[aria-label="当前审核批次"]');Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype,'value').set.call(e,${q(batchId)});e.dispatchEvent(new Event('change',{bubbles:true}));return true})()`)
  await renderer.poll('document.body.innerText.includes("P06 真实模型三案兼容")')
  await renderer.screenshot(dir, 'e06-real-batch-three-cases')
  check('真实批次 Renderer 已回显', await renderer.evaluate('document.body.innerText.includes("P06 真实模型三案兼容")'))
  const noContradiction = row.runs.every(r=>!r.checks?.some(c=>c.status==='execution-failed') || !r.checks.some(c=>['compliant','non-compliant','awaiting-supplement'].includes(c.status)))
  row.assertions.push({name:'已提交真实语义检查没有同时产生错误的缺结果 fallback',pass:noContradiction})
  row.status = noContradiction ? 'PASS' : 'FAIL'
  if(!noContradiction){row.error='CASE_SCOPE_FALLBACK_DUPLICATE: 无 subject 的 case 级有效工具结果被同时补入 execution-failed';process.exitCode=1}
  row.scope = '真实 Pi/provider 三案队列与 B/C 拒止子集；完整人工处置/补件回流/自动通过/幂等矩阵仍 PARTIAL'
} catch (error) { row.status = 'FAIL'; row.error = String(error); process.exitCode = 1 }
finally { row.finishedAt = new Date().toISOString(); save(); renderer.close(); main.close(); console.log(JSON.stringify({ id: row.id, status: row.status, assertions: row.assertions.length, error: row.error })) }
