/** 真正使用 Main IPC、V2 案卷存储、模板槽位分类与 Pi，而非模拟选择结果。 */
import {afterAll,expect,test} from 'bun:test'
import {mkdtempSync,rmSync,writeFileSync} from 'node:fs'
import {tmpdir} from 'node:os'
import {join} from 'node:path'
import {REVIEW_IPC_CHANNELS} from '@profer/shared'

const config=mkdtempSync(join(tmpdir(),'r02-real-route-'))
process.env.PROFER_CONFIG_DIR=config
afterAll(()=>rmSync(config,{recursive:true,force:true}))

const {createNativeWorkspaceCaseV3,registerNativeWorkspaceMaterialV3}=await import('../native-workspace-case-v3')
const {readAggregate}=await import('../case-store-v2')
const {getTemplate}=await import('../template-store')
const {installC11LocalNativeProductIntake}=await import('../review-v3-main-local-product-intake')
const {setMainWindow}=await import('../../main-window-state')
const {preparePiReviewRunV2}=await import('../pi-case-review-service')
const {getRunV2}=await import('../run-store-v2')
const {buildReviewOpsTools}=await import('../../adapters/pi-review-ops-tools')

const actor={actorId:'local-reviewer',actorSource:'local',role:'reviewer'} as const

test('143 份业务模板的路由索引均可惰性加载并绑定为本地技术模板',async()=>{
  const {R02_TECHNICAL_CATALOG,loadBundledR02Template}=await import('./r02-technical-catalog')
  const {installBundledR02TechnicalTemplate,isTemplateCandidateHeld}=await import('../template-store')
  expect(R02_TECHNICAL_CATALOG).toHaveLength(143)
  expect(R02_TECHNICAL_CATALOG.some(item=>item.templateId==='T02-T08')).toBe(false)
  for(const entry of R02_TECHNICAL_CATALOG){
    const definition=await loadBundledR02Template(entry.templateId)
    expect(definition.templateId).toBe(entry.templateId)
    expect(String(definition.version)).toBe(entry.templateVersion)
    const installed=installBundledR02TechnicalTemplate(definition)
    expect(installed.status).toBe('published')
    expect(installed.policyVersionIds).toEqual([])
    expect(installed.autoPassPolicy?.enabled).toBe(false)
    expect(isTemplateCandidateHeld(installed.templateId,installed.version)).toBe(false)
  }
})

test('上传真实申请 → 自动检索 R02 → Main 20 秒默认选择 → 持久绑定、分类、Pi 初审',async()=>{
  const created=await createNativeWorkspaceCaseV3({
    title:'休学申请初审',type:'自定义审核',applicant:'本地测试申请人',domainPackId:'custom',
  },actor)
  const caseId=created.view.id
  const file=join(config,'学生休学申请.txt')
  writeFileSync(file,'申请事项：学生休学资格与材料审核\n学生拟申请休学，随附本次审核所需的校方要求。')
  await registerNativeWorkspaceMaterialV3(caseId,file,'application',actor)

  const frame={id:1,routingId:0}
  const sender={id:507,mainFrame:frame,isDestroyed:()=>false}
  setMainWindow({isDestroyed:()=>false,webContents:sender} as never)
  const hooks=(globalThis as typeof globalThis & {
    __proferElectronTestHooks:{ipcMainHandlers:Map<string,(...args:unknown[])=>unknown>}
  }).__proferElectronTestHooks
  hooks.ipcMainHandlers.clear()
  installC11LocalNativeProductIntake()
  const invoke=(channel:string,...args:unknown[])=>{
    const handler=hooks.ipcMainHandlers.get(channel)
    if(!handler)throw new Error('Main IPC 未注册: '+channel)
    return handler({sender,senderFrame:frame},...args)
  }
  type Read={sessionKey:string;catalog:Array<{templateId:string;availability:string}>;
    routeCandidates:Array<{templateId:string;autoEligible:boolean}>;
    read:{route:{status:string;chosen?:{templateId:string;templateVersion:string}}}}
  const oldNow=Date.now
  try{
    const first=invoke(REVIEW_IPC_CHANNELS.LOCAL_PRODUCT_CURRENT_V3,caseId) as Read
    expect(first.catalog.filter(item=>/^(S0[1-8]|T0[1-8])-T\d{2}$/.test(item.templateId))).toHaveLength(143)
    expect(first.catalog.find(item=>item.templateId==='S01-T01')?.availability)
      .toBe('authorized-for-technical-selection')
    expect(first.routeCandidates.find(item=>item.templateId==='S01-T01')?.autoEligible).toBeTrue()
    expect(first.read.route.status).toBe('countdown')
    // 无需真实等待 20 秒；Main 自己持有时钟和来源证据，不接受 Renderer 冒名确认。
    const start=Date.now()
    Date.now=()=>start+21_000
    const elapsed=invoke(REVIEW_IPC_CHANNELS.LOCAL_PRODUCT_CURRENT_V3,caseId) as Read
    expect(elapsed.read.route.status).toBe('default-selected')
    expect(elapsed.read.route.chosen?.templateId).toBe('S01-T01')
    const receipt=await invoke(REVIEW_IPC_CHANNELS.LOCAL_PRODUCT_MANUAL_CHOICE_V3,{
      caseId,templateId:'S01-T01',templateVersion:'1',sessionKey:elapsed.sessionKey,
      selectionMode:'default',
    }) as {technicalChoiceRecorded:boolean;requiresPlanSetup?:boolean}
    expect(receipt.technicalChoiceRecorded).toBeTrue()
    expect(receipt.requiresPlanSetup).toBeUndefined()
  }finally{
    Date.now=oldNow
    setMainWindow(null as never)
  }

  // 用户另行上传审核依据。业务模板本身不充当校方政策，更不能生成 PolicyVersion。
  const requirementFile=join(config,'本次申请审核依据.txt')
  writeFileSync(requirementFile,'审核依据：申请人自行提供的审核规则和处理要求。')
  await registerNativeWorkspaceMaterialV3(caseId,requirementFile,'rule',actor)
  const aggregate=readAggregate(caseId)!
  expect(aggregate.caseV2.templateId).toBe('S01-T01')
  expect(aggregate.caseV2.documents).toHaveLength(2)
  expect(aggregate.caseV2.documents.some(item=>item.role==='rule')).toBe(true)
  const template=getTemplate('S01-T01',1)!
  expect(template.status).toBe('published')
  expect(template.policyVersionIds).toEqual([])
  expect(template.autoPassPolicy?.enabled).toBeFalse()
  const prepared=preparePiReviewRunV2({caseId,sessionId:'r02-pi-session',turnId:'r02-turn-1'})
  expect(getRunV2(caseId,prepared.runId)?.status).toBe('running')
  const sdk={defineTool:<T>(tool:T)=>tool}
  const tools=buildReviewOpsTools(sdk as never,{
    sessionId:'r02-pi-session',triggeredBy:'user',allowedRoots:[config],
    directReviewBinding:{caseId,sessionId:'r02-pi-session',assignmentId:prepared.assignmentId,
      runId:prepared.runId},
  }) as unknown as Array<{name:string;execute:(id:string,input:unknown)=>Promise<{
    details?:Record<string,unknown>;isError?:boolean
  }>}> 
  const reader=tools.find(tool=>tool.name==='review_read_documents')!
  const result=await reader.execute('r02-pi-read',{documents:
    aggregate.caseV2.documents.map(item=>({documentVersionId:item.versionId}))})
  expect(result.isError).not.toBe(true)
  expect(result.details?.acceptedCount).toBe(2)
})
