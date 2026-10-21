/**
 * Dev-B's own no-code authoring surface, not mounted into Dev-C-owned workbench.
 * Dev-C must provide Main-authorized save/preview/freeze callbacks. This renderer
 * only edits author source; it cannot install a Case, publish policy or grant roles.
 */
import { useRef, useState, type ReactNode } from 'react'
import { B1BufferedIdentityInput } from './B1BufferedIdentityInput'
import {
  prepareB1CandidateReadPreview,assertB1CandidateReadAdoption,assertB1CandidateBackupConfirmation,
  type B1CandidateReadResponse,type B1CandidateReadPreview,
} from './review-v3-author-revision-read'
import { assertB1ResumeReadStillCurrent, isB1PristineReopenLookup } from './review-v3-author-resume'
import { diffB1AuthorDocuments, assertB1DraftRemovalAcknowledgments, assertB1CheckDeleteDialogCurrent } from './review-v3-author-diff'
import { parseB1AuthorCandidateImport,assertB1ImportReplaceSafe,B1_AUTHOR_IMPORT_MAX_BYTES } from './review-v3-author-import'
import {
  exportB1AuthorCandidate, parseB1TrialInput, prepareB1TechnicalTrial,
  type B1TrialValues,
} from './review-v3-author-trial'
import {
  b1AuthorHasUnsavedEdits, deleteB1AuthorIdentity, nextB1AuthorId, renameB1AuthorIdentity, renameB1TrialKey, renameB1AuthorCheckKey,
} from './review-v3-author-edit'
import type {
  B1AuthorDocument, B1Field, B1Obligation, B1Source, B1Target,
  ImmutablePlanDescriptorB1,
} from '../../../main/lib/review/review-template-plan-adapter-v3-b1'

export interface B1AuthorWizardProps {
  /** Main supplies verified author; never accept this identity from the UI. */
  onSaveDraft: (document: B1AuthorDocument, expectedRevision: number) => Promise<{ revision: number }>
  onPreview: (document: B1AuthorDocument) => Promise<ImmutablePlanDescriptorB1>
  onFreezeCandidate: (document: B1AuthorDocument, expectedRevision: number) => Promise<{ fingerprint: string }>
  /**
   * Optional future C-owned authorized read. It must bind Main Principal,
   * session, frame, Owner and verified revision-chain digest; the Renderer
   * does not create or authenticate any of these values.
   */
  onReadLatestCandidate?: (templateId:string,expectedRevision:number)=>Promise<B1CandidateReadResponse>
  initialDraft?: B1AuthorDocument
  initialRevision?: number
}

const sourceId = 'request'
export const emptyB1AuthorDocument = (): B1AuthorDocument => ({
  schemaVersion: 'review-b1/1', status: 'candidate-held', templateId: '',
  templateVersion: '1', name: '', purpose: '',
  sources: [{ sourceId, kind: 'user-declared', documentVersionId: 'author-user-declaration-v1',
    locator: 'author-wizard:explicit-input', recordedBy: 'local-author-unverified' }],
  fields: [], targets: [], modules: [{
    moduleId: 'core', version: '1', dependsOn: [], checks: [],
  }],
  stages: [{ stageId: 'manual-review', role: 'reviewer', mode: 'manual' }],
  outputs: [{ outputId: 'summary', kind: 'report' }],
})

const inputClass = 'w-full min-w-0 rounded border border-border bg-background px-2 py-1.5 text-sm'
const buttonClass = 'rounded border border-border px-3 py-1.5 text-sm hover:bg-muted disabled:opacity-40'
function Section({ title, children }: { title: string; children: ReactNode }): ReactNode {
  return <section className="space-y-3 rounded-lg border border-border p-4">
    <h3 className="font-semibold">{title}</h3>{children}
  </section>
}
export function ReviewV3AuthorWizard({
  onSaveDraft, onPreview, onFreezeCandidate, onReadLatestCandidate, initialDraft, initialRevision = 0,
}: B1AuthorWizardProps): ReactNode {
  const [draft, setDraft] = useState<B1AuthorDocument>(() => structuredClone(initialDraft ?? emptyB1AuthorDocument()))
  const [revision, setRevision] = useState(initialRevision)
  const [savedSnapshot, setSavedSnapshot] = useState<B1AuthorDocument|null>(()=>
    initialRevision>0 && initialDraft ? structuredClone(initialDraft) : null)
  const editEpoch = useRef(0)
  const operationInFlight = useRef(false)
  const [pendingImport,setPendingImport] = useState<{doc:B1AuthorDocument;epoch:number}|null>(null)
  const [pendingLatestRead,setPendingLatestRead] = useState<B1CandidateReadPreview|null>(null)
  const backedUpEpoch=useRef<number|null>(null)
  const [pendingBackupConfirmation,setPendingBackupConfirmation]=useState<{epoch:number;templateId:string}|null>(null)
  const isDirty = b1AuthorHasUnsavedEdits(draft,savedSnapshot)
  const [pendingCheckDeletion,setPendingCheckDeletion] = useState<{checkKey:string;epoch:number}|null>(null)
  const [pendingCheckRename,setPendingCheckRename] = useState<{from:string;to:string;epoch:number}|null>(null)
  const [confirmedCheckDeletions,setConfirmedCheckDeletions] = useState<string[]>([])
  const versionDiff = diffB1AuthorDocuments(savedSnapshot,draft)
  const outstandingCheckRemovalAck = versionDiff.deletedCheckKeys.filter(key=>!confirmedCheckDeletions.includes(key))
  const [preview, setPreview] = useState<ImmutablePlanDescriptorB1 | null>(null)
  const [trial, setTrial] = useState<B1TrialValues>({})
  const [busy, setBusy] = useState(false)
  const [notice, setNotice] = useState('')
  const [error, setError] = useState('')
  const change = (update: (doc: B1AuthorDocument) => void): void => {
    editEpoch.current += 1
    setPendingLatestRead(null)
    setPendingBackupConfirmation(null)
    setDraft((current) => { const next = structuredClone(current); update(next); return next })
    setPreview(null); setNotice(''); setError('')
  }
  const editIdentity = (
    type:'source'|'field'|'target',action:'rename'|'delete',from:string,to?:string,
  ):void => {
    try {
      const next=action==='rename'
        ? renameB1AuthorIdentity(draft,type,from,to??'')
        : deleteB1AuthorIdentity(draft,type,from)
      if(type==='field' || type==='target') {
        if(action==='rename') setTrial(current=>renameB1TrialKey(current,type,from,to??''))
        else if(type==='target') setTrial(current=>{
          const clone=structuredClone(current);delete clone[from];return clone
        })
        else setTrial(current=>{
          const clone=structuredClone(current)
          for(const values of Object.values(clone)) delete values[from]
          return clone
        })
      }
      editEpoch.current += 1
      setPendingLatestRead(null)
      setPendingBackupConfirmation(null)
      setDraft(next);setPreview(null);setNotice('');setError('')
    } catch(reason) {
      setError(reason instanceof Error ? reason.message : String(reason))
    }
  }
  const requestCheckRename=(from:string,to:string):void=>{
    if(from===to)return
    try{
      if(operationInFlight.current)throw new Error('B1_AUTHOR_RENAME_BUSY')
      // Validate before opening a confirmation and without mutating the current draft.
      renameB1AuthorCheckKey(draft,from,to)
      setPendingCheckDeletion(null)
      setPendingCheckRename({from,to,epoch:editEpoch.current})
      setError('');setNotice('')
    }catch(reason){setError(reason instanceof Error?reason.message:String(reason))}
  }
  const confirmCheckRename=():void=>{
    if(!pendingCheckRename)return
    try{
      assertB1CheckDeleteDialogCurrent(draft,pendingCheckRename.from,
        pendingCheckRename.epoch,editEpoch.current,operationInFlight.current)
      const {from,to}=pendingCheckRename
      const next=renameB1AuthorCheckKey(draft,from,to)
      editEpoch.current+=1
      setPendingLatestRead(null)
      setPendingBackupConfirmation(null)
      setDraft(next)
      setPreview(null)
      setConfirmedCheckDeletions(current=>current.includes(from)?current:[...current,from])
      setPendingCheckRename(null)
      setError('')
      setNotice('已确认旧 Check '+from+' 变更为新 ID '+to+'；仅作者草稿操作，正式升级仍须 C 的 durable ACK')
    }catch(reason){
      setPendingCheckRename(null)
      setError(reason instanceof Error?reason.message:String(reason))
    }
  }
  const requestCheckDeletion=(checkKey:string):void=>{
    if(operationInFlight.current){setError('B1_AUTHOR_DELETE_BUSY');return}
    setPendingCheckRename(null)
    setPendingCheckDeletion({checkKey,epoch:editEpoch.current})
    setError('');setNotice('')
  }
  const confirmCheckDeletion=():void=>{
    if(!pendingCheckDeletion)return
    try{
      assertB1CheckDeleteDialogCurrent(draft,pendingCheckDeletion.checkKey,
        pendingCheckDeletion.epoch,editEpoch.current,operationInFlight.current)
      const id=pendingCheckDeletion.checkKey
      change(document=>{
        for(const module of document.modules)
          module.checks=module.checks.filter(check=>check.checkKey!==id)
      })
      setConfirmedCheckDeletions(current=>current.includes(id)?current:[...current,id])
      setPendingCheckDeletion(null)
      setNotice('已确认从当前作者草稿移除 Check '+id+'；仅本地编辑确认，不是正式 Plan 升级 Receipt')
    }catch(reason){
      setPendingCheckDeletion(null)
      setError(reason instanceof Error?reason.message:String(reason))
    }
  }
  const sampleValue = (targetKey: string, fieldKey: string): string => {
    const value=trial[targetKey]?.[fieldKey]
    return value === null || value === undefined ? '' : String(value)
  }
  const setSampleValue = (targetKey: string, field: B1Field, raw: string): void => {
    try {
      const value=parseB1TrialInput(field,raw)
      editEpoch.current += 1
      setPendingLatestRead(null)
      setPendingBackupConfirmation(null)
      setTrial(current => ({
        ...current, [targetKey]: {...current[targetKey], [field.key]:value},
      }))
      setPreview(null);setNotice('');setError('')
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : String(reason))
    }
  }
  const exportCandidate = (): void => {
    try {
      const payload=exportB1AuthorCandidate(draft)
      const data=new Blob([payload],{type:'application/json;charset=utf-8'})
      const href=URL.createObjectURL(data)
      const anchor=document.createElement('a')
      anchor.href=href
      anchor.download=(draft.templateId || 'unpublished-business').replace(/[^A-Za-z0-9._-]/g,'_')+'.candidate.json'
      anchor.click()
      URL.revokeObjectURL(href)
      // Never mark as backed up until the user has actually checked the file.
      setPendingBackupConfirmation({epoch:editEpoch.current,templateId:draft.templateId})
      setNotice('浏览器已收到候选配置导出请求。请检查文件确实已保存，再在下方明确确认；否则不能舍弃未保存草稿')
    } catch (reason) {setError(reason instanceof Error ? reason.message : String(reason))}
  }
  const updateField = (index: number, key: keyof B1Field, value: unknown): void =>
    change((doc) => { (doc.fields[index] as unknown as Record<string, unknown>)[key] = value })
  const updateSource = (index: number, key: keyof B1Source, value: unknown): void =>
    change((doc) => { (doc.sources[index] as unknown as Record<string, unknown>)[key] = value })
  const updateTarget = (index: number, key: keyof B1Target, value: unknown): void =>
    change((doc) => { (doc.targets[index] as unknown as Record<string, unknown>)[key] = value })
  const updateCheck = (index: number, key: keyof B1Obligation, value: unknown): void =>
    change((doc) => { (doc.modules[0]!.checks[index] as unknown as Record<string, unknown>)[key] = value })
  const fieldForCheck = (check:B1Obligation):B1Field|undefined => {
    // Bind the discriminated union before entering find()'s callback. React
    // render closures must never assume an 'always' condition has fieldKey.
    const condition=check.condition
    if(condition.kind!=='field-equals')return undefined
    return draft.fields.find(field=>field.key===condition.fieldKey)
  }
  const defaultComparator = (fieldKey:string): string | number | boolean => {
    const field=draft.fields.find(f=>f.key===fieldKey)
    if (!field || field.type==='evidence') return 'example'
    switch(field.type) {
      case 'number': return 0
      case 'boolean': return true
      case 'enum': return field.enumValues?.[0] ?? 'example'
      case 'date': return '2026-01-01'
      default: return 'example'
    }
  }
  const updateConditionEquals = (index:number, fieldKey:string, raw:string): void => {
    try {
      const field=draft.fields.find(f=>f.key===fieldKey)
      if (!field || field.type==='evidence') throw new Error('B1_CONDITION_SOURCE_UNSUPPORTED')
      const value=parseB1TrialInput(field,raw)
      if (value===null) throw new Error('B1_CONDITION_VALUE_REQUIRED')
      updateCheck(index,'condition',{kind:'field-equals',fieldKey,equals:value})
    } catch(reason) { setError(reason instanceof Error ? reason.message : String(reason)) }
  }
  const perform = async (mode: 'save' | 'preview' | 'freeze'): Promise<void> => {
    if(operationInFlight.current){setError('B1_AUTHOR_OPERATION_BUSY');return}
    operationInFlight.current=true
    setBusy(true); setError(''); setNotice('')
    const epoch=editEpoch.current
    try {
      const copy = structuredClone(draft)
      if (mode === 'save') {
        assertB1DraftRemovalAcknowledgments(savedSnapshot,copy,confirmedCheckDeletions)
        const saved = await onSaveDraft(copy, revision)
        setRevision(saved.revision)
        setSavedSnapshot(copy)
        setPendingLatestRead(null)
        setConfirmedCheckDeletions([])
        setNotice(epoch===editEpoch.current
          ? `草稿已保存为第 ${saved.revision} 次修订（未正式发布）`
          : '保存了操作开始时的修订；期间的新编辑仍未保存，请重新保存')
      } else if (mode === 'preview') {
        const result = await onPreview(prepareB1TechnicalTrial(copy,trial))
        if(epoch===editEpoch.current) {
          setPreview(result)
          setNotice('技术规则预览已生成；不代表学校制度审核通过')
        } else {
          setNotice('预览期间作者内容或样例已改变，请重新运行')
        }
      } else {
        if(isDirty) throw new Error('B1_AUTHOR_UNSAVED_CHANGES: 请先保存当前草稿，再冻结候选')
        const frozen = await onFreezeCandidate(copy, revision)
        if(epoch===editEpoch.current)
          setNotice('不可变候选已冻结：' + frozen.fingerprint.slice(0, 24) + '…（仍未发布）')
      }
    } catch (reason) {
      const message=reason instanceof Error ? reason.message : String(reason)
      setError(message)
      if(/B1_(?:AUTHOR_REVISION_CONFLICT|MAIN_REVISION_STALE|HISTORY_BROKEN)/.test(message))
        setNotice('存储修订已变化或历史链异常：未覆盖任何内容。请先导出本地候选备份，再从 Main 可信读口重新打开最新版并人工对比；禁止自动重试覆盖。')
    } finally { operationInFlight.current=false;setBusy(false) }
  }
  const stageImport = async (file: File): Promise<void> => {
    if(operationInFlight.current){setError('B1_IMPORT_OPERATION_BUSY');return}
    if(file.size>B1_AUTHOR_IMPORT_MAX_BYTES){setError('B1_IMPORT_FILE_TOO_LARGE');return}
    operationInFlight.current=true
    setBusy(true);setError('');setNotice('')
    const epoch=editEpoch.current
    try {
      const candidate=parseB1AuthorCandidateImport(await file.text())
      if(epoch!==editEpoch.current)throw new Error('B1_IMPORT_CHANGED_DURING_READ')
      setPendingImport({doc:candidate,epoch})
      setNotice('导入预览就绪：请核对候选业务身份和字段数量，再明确确认替换当前屏幕草稿；尚未写入 Main')
    } catch(reason){
      setPendingImport(null)
      setError(reason instanceof Error?reason.message:String(reason))
    } finally{operationInFlight.current=false;setBusy(false)}
  }
  const confirmImport=():void=>{
    if(!pendingImport)return
    try{
      assertB1ImportReplaceSafe(pendingImport.epoch,editEpoch.current,operationInFlight.current)
      editEpoch.current+=1
      setDraft(structuredClone(pendingImport.doc))
      setRevision(0)
      setSavedSnapshot(null)
      setConfirmedCheckDeletions([])
      setPendingCheckDeletion(null)
      setPendingCheckRename(null)
      setTrial({})
      setPreview(null)
      setPendingImport(null)
      setPendingLatestRead(null)
      setPendingBackupConfirmation(null)
      backedUpEpoch.current=null
      setError('')
      setNotice('已替换为未保存的候选草稿。来源身份保持未验证；保存需 Main 授权及 revision CAS，重名候选不可覆盖')
    }catch(reason){setPendingImport(null);setError(reason instanceof Error?reason.message:String(reason))}
  }
  const readLatestForComparison=async():Promise<void>=>{
    if(!onReadLatestCandidate || !draft.templateId){setError('B1_AUTHOR_READ_NOT_CONNECTED');return}
    if(operationInFlight.current){setError('B1_AUTHOR_READ_BUSY');return}
    operationInFlight.current=true
    setBusy(true);setError('');setNotice('')
    const epoch=editEpoch.current,readRevision=revision
    try{
      const result=await onReadLatestCandidate(draft.templateId,revision)
      if(epoch!==editEpoch.current)throw new Error('B1_AUTHOR_READ_EDITED_WHILE_LOADING')
      const compared=prepareB1CandidateReadPreview(result,{
        templateId:draft.templateId,revision:readRevision,epoch,draft,saved:savedSnapshot,
      })
      setPendingLatestRead(compared)
      setNotice(compared.remote.revision>revision
        ? '可信读取结果已返回：先对照变更；确认前不会替换、合并或保存本地草稿'
        : '读回的修订与本次已保存快照一致；无需恢复')
    }catch(reason){
      setPendingLatestRead(null)
      setError(reason instanceof Error?reason.message:String(reason))
    }finally{operationInFlight.current=false;setBusy(false)}
  }
  const confirmBackupAfterFileCheck=():void=>{
    try{
      assertB1CandidateBackupConfirmation(pendingBackupConfirmation,{
        epoch:editEpoch.current,templateId:draft.templateId,busy:operationInFlight.current,
      })
      backedUpEpoch.current=editEpoch.current
      setPendingBackupConfirmation(null)
      setError('')
      setNotice('已记录你的本地备份文件核对确认。该确认不由操作系统验证，载入远端修订前仍由你决定是否舍弃屏幕修改')
    }catch(reason){
      setPendingBackupConfirmation(null)
      setError(reason instanceof Error?reason.message:String(reason))
    }
  }
  const adoptLatestRead=async():Promise<void>=>{
    if(!pendingLatestRead || !onReadLatestCandidate)return
    if(operationInFlight.current){setError('B1_RESUME_OPERATION_BUSY');return}
    const staged=pendingLatestRead,epoch=editEpoch.current
    const pristine=isB1PristineReopenLookup(draft,revision,savedSnapshot,emptyB1AuthorDocument())
    try {
      // Do not initiate a Main read if current screen content has no valid
      // backup/explicit discard acknowledgement.
      assertB1CandidateReadAdoption(staged,{
        templateId:draft.templateId,revision,epoch,
        busy:false,backupEpoch:backedUpEpoch.current,
        hasUnsavedEdits:isDirty && !pristine,
      })
    } catch(reason){
      setError(reason instanceof Error?reason.message:String(reason))
      return
    }
    operationInFlight.current=true
    setBusy(true);setError('');setNotice('')
    try {
      // The first Main read only informed the diff. Re-read the actual latest
      // revision right before adoption. C validates Principal/frame/Owner and
      // any async authority epoch; B compares revision, digest AND source.
      const refreshed=await onReadLatestCandidate(draft.templateId,revision)
      const latest=assertB1ResumeReadStillCurrent(staged,refreshed,{
        templateId:draft.templateId,revision,epoch:editEpoch.current,
        draft,saved:savedSnapshot,
      })
      if(epoch!==editEpoch.current)throw new Error('B1_RESUME_EDITED_DURING_CONFIRMATION')
      assertB1CandidateReadAdoption(staged,{
        templateId:draft.templateId,revision,epoch:editEpoch.current,
        busy:false,backupEpoch:backedUpEpoch.current,
        hasUnsavedEdits:isDirty && !pristine,
      })
      editEpoch.current+=1
      const current=structuredClone(latest.document)
      setDraft(current)
      setRevision(latest.revision)
      setSavedSnapshot(structuredClone(current))
      setTrial({});setPreview(null)
      setConfirmedCheckDeletions([])
      setPendingCheckDeletion(null);setPendingCheckRename(null)
      setPendingImport(null);setPendingLatestRead(null)
      setPendingBackupConfirmation(null)
      backedUpEpoch.current=null
      setError('')
      setNotice('已重新核对 Main 当前作者修订和完整候选源后载入；没有自动合并/写入或学校审批')
    }catch(reason){
      const message=reason instanceof Error?reason.message:String(reason)
      setPendingLatestRead(null)
      setError(message)
      setNotice('此次可信读回已失效；原屏幕草稿未丢弃。请重新读取 Main 最新版并对比；不会自动覆盖')
    } finally {operationInFlight.current=false;setBusy(false)}
  }
  const checks = draft.modules[0]?.checks ?? []
  return <div className="space-y-4 text-foreground" data-testid="review-v3-b1-author-wizard">
    <header className="space-y-2">
      <h2 className="text-xl font-bold">自建审核业务</h2>
      <p className="text-sm text-muted-foreground">从空白创建业务、材料字段、核验责任和工作流程。所有内容仅为作者候选；学校制度发布需另行授权。</p>
      <p className="text-xs text-muted-foreground">作者态修订 #{revision} · candidate-held · 未获政策批准 · {isDirty?'有未保存修改':'当前显示内容已保存'}</p>
    </header>
    <Section title="1. 业务定义">
      <label className="block text-sm">业务标识（英文/数字/连字符）
        <input className={inputClass} value={draft.templateId} placeholder="laboratory-use"
          onChange={(e) => change((d) => { d.templateId = e.target.value })} />
      </label>
      <label className="block text-sm">业务名称
        <input className={inputClass} value={draft.name} placeholder="实验室使用申请"
          onChange={(e) => change((d) => { d.name = e.target.value })} />
      </label>
      <label className="block text-sm">审核目的与范围
        <textarea className={inputClass} value={draft.purpose} rows={2}
          onChange={(e) => change((d) => { d.purpose = e.target.value })} />
      </label>
      <label className="block text-sm">候选版本
        <input className={inputClass} value={draft.templateVersion}
          onChange={(e) => change((d) => { d.templateVersion = e.target.value })} />
      </label>
    </Section>
    <Section title="2. 业务依据及材料来源">
      {draft.sources.map((source, i) => <div key={source.sourceId} className="grid gap-2 rounded border border-border p-2 sm:grid-cols-2">
        <label className="text-xs">来源 ID
          <B1BufferedIdentityInput className={inputClass} value={source.sourceId}
            onCommit={next=>editIdentity('source','rename',source.sourceId,next)} />
        </label>
        <label className="text-xs">来源性质
          <select className={inputClass} value={source.kind}
            onChange={(e) => updateSource(i,'kind',e.target.value)}>
            <option value="user-declared">用户明确声明</option>
            <option value="policy-candidate">制度候选（未核实）</option>
          </select>
        </label>
        <label className="text-xs">原始版本标识
          <input className={inputClass} value={source.documentVersionId}
            onChange={(e) => updateSource(i,'documentVersionId',e.target.value)} />
        </label>
        <label className="text-xs">原文定位/声明输入
          <input className={inputClass} value={source.locator}
            onChange={(e) => updateSource(i,'locator',e.target.value)} />
        </label>
        <button type="button" className={buttonClass} onClick={() => editIdentity('source','delete',source.sourceId)}>删除来源</button>
      </div>)}
      <button type="button" className={buttonClass} onClick={() => change((d) => {
        d.sources.push({sourceId:nextB1AuthorId(d.sources.map(s=>s.sourceId),'source'),kind:'user-declared',
          documentVersionId:'unverified-source-version', locator:'author-explicit-input',
          recordedBy:'local-author-unverified'})
      })}>添加来源</button>
    </Section>
    <Section title="3. 申请字段及材料要求">
      {draft.fields.map((field,i) => <div key={field.key} className="grid gap-2 rounded border border-border p-2 sm:grid-cols-2">
        <label className="text-xs">字段键
          <B1BufferedIdentityInput className={inputClass} value={field.key}
            onCommit={next=>editIdentity('field','rename',field.key,next)}/>
        </label>
        <label className="text-xs">显示名称
          <input className={inputClass} value={field.label} onChange={(e)=>updateField(i,'label',e.target.value)}/>
        </label>
        <label className="text-xs">字段类型
          <select className={inputClass} value={field.type} onChange={(e)=>change((d)=>{
            const f=d.fields[i]!
            f.type=e.target.value as B1Field['type']
            if(f.type==='enum') f.enumValues=['选项一','选项二']
            else delete f.enumValues
          })}>
            <option value="text">文本</option><option value="number">数字</option>
            <option value="date">日期</option><option value="boolean">是否</option>
            <option value="enum">枚举</option><option value="evidence">证明附件</option>
          </select>
        </label>
        <label className="text-xs">责任来源
          <select className={inputClass} value={field.sourceId}
            onChange={(e)=>updateField(i,'sourceId',e.target.value)}>
            {draft.sources.map((s)=> <option key={s.sourceId} value={s.sourceId}>{s.sourceId}</option>)}
          </select>
        </label>
        {field.type==='enum' && <label className="text-xs sm:col-span-2">选项（用逗号分隔）
          <input className={inputClass} value={field.enumValues?.join(',')??''}
            onChange={(e)=>updateField(i,'enumValues',e.target.value.split(',').map(s=>s.trim()).filter(Boolean))}/>
        </label>}
        <label className="text-sm"><input type="checkbox" checked={field.required}
          onChange={(e)=>updateField(i,'required',e.target.checked)}/> 必填字段</label>
        <button type="button" className={buttonClass} onClick={()=>editIdentity('field','delete',field.key)}>删除字段</button>
      </div>)}
      <button type="button" className={buttonClass} onClick={()=>change((d)=>{
        d.fields.push({ key:nextB1AuthorId(d.fields.map(f=>f.key),'field'),label:'新字段',type:'text',required:true,
          sourceId:d.sources[0]?.sourceId??''})
      })}>添加字段</button>
    </Section>
    <Section title="4. 对象与预览样本">
      <p className="text-xs text-muted-foreground">对象用于技术预览；正式案卷绑定必须由 Main/Dev-C 按实际 Subject 再编译。</p>
      {draft.targets.map((target,i)=><div key={target.targetKey} className="grid gap-2 rounded border border-border p-2 sm:grid-cols-2">
        {(['targetKey','objectKey','subjectId','scenario'] as const).map((key)=><label key={key} className="text-xs">{key}
          {key==='targetKey'
            ? <B1BufferedIdentityInput className={inputClass} value={target.targetKey}
                onCommit={next=>editIdentity('target','rename',target.targetKey,next)}/>
            : <input className={inputClass} value={target[key]}
                onChange={e=>updateTarget(i,key,e.target.value)}/>} 
        </label>)}
        <div className="space-y-2 sm:col-span-2">
          <p className="text-xs text-muted-foreground">试跑样例值，仅用于技术预览，不写入作者草稿或正式案卷；留空保持 unknown。</p>
          {draft.fields.map(field => <label key={field.key} className="block text-xs">{field.label}（{field.key}）
            {field.type === 'evidence' ? <p className="text-xs text-muted-foreground">证明附件需经 B2 真正原件/SourceIdentity 校验，不能以样例值代替。</p>
            : field.type === 'boolean' ? <select className={inputClass} value={sampleValue(target.targetKey,field.key)}
              onChange={e=>setSampleValue(target.targetKey,field,e.target.value)}>
              <option value="">未知 / 尚无证据</option><option value="true">是</option><option value="false">否</option>
            </select> : field.type === 'enum' ? <select className={inputClass} value={sampleValue(target.targetKey,field.key)}
              onChange={e=>setSampleValue(target.targetKey,field,e.target.value)}>
              <option value="">未知 / 尚未声明</option>
              {(field.enumValues??[]).map(v=><option key={v} value={v}>{v}</option>)}
            </select> : <input className={inputClass}
              type={field.type === 'number' ? 'number' : field.type === 'date' ? 'date' : 'text'}
              value={sampleValue(target.targetKey,field.key)}
              onChange={e=>setSampleValue(target.targetKey,field,e.target.value)}/>}
          </label>)}
        </div>
        <button type="button" className={buttonClass} onClick={()=>editIdentity('target','delete',target.targetKey)}>删除对象</button>
      </div>)}
      <button type="button" className={buttonClass} onClick={()=>change((d)=>{
        d.targets.push({
          targetKey:nextB1AuthorId(d.targets.map(t=>t.targetKey),'target'),
          objectKey:nextB1AuthorId(d.targets.map(t=>t.objectKey),'object'),
          subjectId:nextB1AuthorId(d.targets.map(t=>t.subjectId),'subject'),
          scenario:'generic-object',fieldValues:{},
        })
      })}>添加对象</button>
    </Section>
    <Section title="5. 核验责任与适用条件">
      {checks.map((check,i)=><div key={check.checkKey} className="space-y-2 rounded border border-border p-2">
        <label className="block text-xs">Check ID（重命名须确认旧身份）
          <B1BufferedIdentityInput className={inputClass} value={check.checkKey}
            onCommit={next=>requestCheckRename(check.checkKey,next)}/>
        </label>
        <label className="block text-xs">应履行的责任/核验要求
          <textarea className={inputClass} rows={2} value={check.requirement}
            onChange={(e)=>updateCheck(i,'requirement',e.target.value)}/>
        </label>
        <label className="block text-xs">责任承担者
          <input className={inputClass} value={check.responsibility}
            onChange={(e)=>updateCheck(i,'responsibility',e.target.value)}/>
        </label>
        <label className="block text-xs">规则依据
          <select className={inputClass} multiple value={check.sourceIds}
            onChange={(e)=>updateCheck(i,'sourceIds',Array.from(e.currentTarget.selectedOptions, o=>o.value))}>
            {draft.sources.map((s)=><option key={s.sourceId} value={s.sourceId}>{s.sourceId}</option>)}
          </select>
        </label>
        <div className="text-xs">适用对象（可多选）</div>
        <div className="flex flex-wrap gap-3">{draft.targets.map(t=><label key={t.targetKey} className="text-xs">
          <input type="checkbox" checked={check.targetKeys.includes(t.targetKey)} onChange={(e)=>change((d)=>{
            const keys=new Set(d.modules[0]!.checks[i]!.targetKeys)
            if(e.target.checked)keys.add(t.targetKey);else keys.delete(t.targetKey)
            d.modules[0]!.checks[i]!.targetKeys=[...keys]
          })}/> {t.targetKey}
        </label>)}</div>
        <label className="block text-xs">适用条件
          <select className={inputClass} value={check.condition.kind} onChange={(e)=>updateCheck(i,'condition',
            e.target.value==='always' ? {kind:'always'} : {
              kind:'field-equals',
              fieldKey:draft.fields.find(f=>f.type!=='evidence')?.key??'',
              equals:defaultComparator(draft.fields.find(f=>f.type!=='evidence')?.key??''),
            })}>
            <option value="always">始终适用</option><option value="field-equals">字段等于指定值</option>
          </select>
        </label>
        {check.condition.kind==='field-equals'&&<div className="grid gap-2 sm:grid-cols-2">
          <select className={inputClass} value={check.condition.fieldKey} onChange={(e)=>updateCheck(i,'condition',{
            kind:'field-equals',fieldKey:e.target.value,equals:defaultComparator(e.target.value),
          })}>{draft.fields.filter(f=>f.type!=='evidence').map(f=>
              <option key={f.key} value={f.key}>{f.label}</option>)}</select>
          {fieldForCheck(check)?.type==='boolean' ?
            <select className={inputClass} value={String(check.condition.equals)} onChange={e=>
              updateConditionEquals(i,check.condition.kind==='field-equals'?check.condition.fieldKey:'',e.target.value)}>
              <option value="true">是</option><option value="false">否</option>
            </select> :
            fieldForCheck(check)?.type==='enum' ?
            <select className={inputClass} value={String(check.condition.equals)} onChange={e=>
              updateConditionEquals(i,check.condition.kind==='field-equals'?check.condition.fieldKey:'',e.target.value)}>
              {fieldForCheck(check)?.enumValues?.map(v=>
                <option key={v} value={v}>{v}</option>)}
            </select> :
            <input className={inputClass}
              type={fieldForCheck(check)?.type==='number'?'number':
                fieldForCheck(check)?.type==='date'?'date':'text'}
              value={String(check.condition.equals)} onChange={e=>
                updateConditionEquals(i,check.condition.kind==='field-equals'?check.condition.fieldKey:'',e.target.value)}/>}
        </div>}
        <button type="button" disabled={busy} className={buttonClass}
          onClick={()=>requestCheckDeletion(check.checkKey)}>删除 Check（先显示确认）</button>
      </div>)}
      <button type="button" className={buttonClass} onClick={()=>change((d)=>{
        d.modules[0]!.checks.push({
          checkKey:nextB1AuthorId(d.modules.flatMap(m=>m.checks.map(c=>c.checkKey)),'check'),requirement:'请填写原始责任',responsibility:'reviewer',
          sourceIds:d.sources[0]?[d.sources[0].sourceId]:[],
          targetKeys:d.targets.map(t=>t.targetKey),condition:{kind:'always'},
        })
      })}>添加 Check</button>
    </Section>
    <Section title="6. 流程阶段与输出">
      {draft.stages.map((stage,i)=><div key={i} className="grid gap-2 sm:grid-cols-3">
        <label className="text-xs">阶段标识
          <input className={inputClass} value={stage.stageId}
            onChange={(e)=>change((d)=>{d.stages[i]!.stageId=e.target.value})}/>
        </label>
        <label className="text-xs">执行角色
          <input className={inputClass} value={stage.role}
            onChange={(e)=>change((d)=>{d.stages[i]!.role=e.target.value})}/>
        </label>
        <label className="text-xs">执行模式
          <select className={inputClass} value={stage.mode}
            onChange={(e)=>change((d)=>{d.stages[i]!.mode=e.target.value as 'manual'|'technical'})}>
            <option value="manual">人工流程</option><option value="technical">技术审核</option>
          </select>
        </label>
        <button type="button" className={buttonClass} onClick={()=>change((d)=>{d.stages.splice(i,1)})}>删除阶段</button>
      </div>)}
      <button type="button" className={buttonClass} onClick={()=>change((d)=>{d.stages.push({
        stageId:nextB1AuthorId(d.stages.map(s=>s.stageId),'stage'),role:'reviewer',mode:'manual',
      })})}>添加阶段</button>
      {draft.outputs.map((output,i)=><div key={i} className="grid gap-2 sm:grid-cols-2">
        <label className="text-xs">输出 ID
          <input className={inputClass} value={output.outputId}
            onChange={(e)=>change((d)=>{d.outputs[i]!.outputId=e.target.value})}/>
        </label>
        <label className="text-xs">输出类型
          <input className={inputClass} value={output.kind}
            onChange={(e)=>change((d)=>{d.outputs[i]!.kind=e.target.value})}/>
        </label>
        <button type="button" className={buttonClass} onClick={()=>change((d)=>{d.outputs.splice(i,1)})}>删除输出</button>
      </div>)}
      <button type="button" className={buttonClass} onClick={()=>change((d)=>{d.outputs.push({
        outputId:nextB1AuthorId(d.outputs.map(o=>o.outputId),'output'),kind:'report',
      })})}>添加输出</button>
    </Section>
    <div className="flex flex-wrap gap-2">
      <button type="button" disabled={busy} className={buttonClass} onClick={()=>void perform('save')}>保存修订</button>
      <button type="button" disabled={busy} className={buttonClass} onClick={()=>void perform('preview')}>技术预览 / 试跑规则</button>
      <button type="button" disabled={busy || isDirty} title={isDirty?'先保存当前修改才能冻结':'冻结已保存修订'} className={buttonClass} onClick={()=>void perform('freeze')}>冻结候选（非正式发布）</button>
      <button type="button" disabled={busy} className={buttonClass} onClick={exportCandidate}>导出候选配置</button>
      {onReadLatestCandidate && <button type="button" disabled={busy || !draft.templateId}
        className={buttonClass} onClick={()=>void readLatestForComparison()}>
        从可信 Main 读取最新候选修订（先对比）
      </button>}
      <label className={buttonClass+(busy?' opacity-40':'')} aria-label="导入尚未发布的用户声明候选">
        导入候选 JSON（先预览）
        <input type="file" className="sr-only" accept=".json,application/json" disabled={busy}
          onChange={event=>{
            const file=event.currentTarget.files?.[0]
            event.currentTarget.value=''
            if(file)void stageImport(file)
          }}/>
      </label>
    </div>
    <Section title="本地修订差异（仅作者预览）">
      <p className="text-xs">与本次打开的已保存快照比较；不是 Main 的历史版本差异报告，不具备删除 Check 的正式持久 ACK 效力。</p>
      <p className="text-xs">{versionDiff.changes.length} 处对象变化 · 新增 Check {versionDiff.addedCheckKeys.length} · 修改 Check {versionDiff.changedCheckKeys.length} · 删除 Check {versionDiff.deletedCheckKeys.length}</p>
      {outstandingCheckRemovalAck.length>0 && <p role="alert" className="text-xs text-red-500">
        存在未确认删除的历史 Check：{outstandingCheckRemovalAck.join('、')}；禁止保存修订
      </p>}
      {versionDiff.changes.length>0 && <details><summary className="cursor-pointer text-xs">展开变更明细（最多展示前 80 项）</summary>
        <ul className="text-xs space-y-1">{versionDiff.changes.slice(0,80).map(item=>
          <li key={item.area+'/'+item.kind+'/'+item.key}>{item.area} / {item.kind} / {item.key}</li>)}</ul>
      </details>}
    </Section>
    {pendingCheckRename && <Section title="危险操作：确认 Check 身份变更">
      <p role="alert" className="text-sm">旧 Check {pendingCheckRename.from} 将变更为 {pendingCheckRename.to}，这属于删除旧 Check 身份并创建新身份，而不是修改显示名称。</p>
      <p className="text-xs">作者端仅保存本地确认；正式 Plan 升级的 Check×target×source 删除 ACK、旧 Plan/Run 历史保全和持久 Receipt 仍须 Dev-C 明确授权。</p>
      <div className="flex gap-2">
        <button type="button" disabled={busy} className={buttonClass} onClick={confirmCheckRename}>我确认变更 Check 身份</button>
        <button type="button" disabled={busy} className={buttonClass} onClick={()=>setPendingCheckRename(null)}>取消</button>
      </div>
    </Section>}
    {pendingCheckDeletion && <Section title="危险操作：确认删除 Check">
      <p role="alert" className="text-sm">将从当前候选草稿删除 {pendingCheckDeletion.checkKey}。可能影响已有来源、对象、历史结果与修订解释。</p>
      <p className="text-xs">这仅记录当前作者界面的明确确认，不是 C 的正式 InstallPlan/UpgradePlan 删除 ACK。必须保留旧版 Plan 与审计 Receipt。</p>
      <div className="flex gap-2">
        <button type="button" disabled={busy} className={buttonClass} onClick={confirmCheckDeletion}>我确认移除此 Check</button>
        <button type="button" disabled={busy} className={buttonClass} onClick={()=>setPendingCheckDeletion(null)}>取消</button>
      </div>
    </Section>}
    {pendingBackupConfirmation && <Section title="备份确认（导出请求不代表文件保存成功）">
      <p role="alert" className="text-xs">
        请先在本机下载目录核实 {pendingBackupConfirmation.templateId || '未命名候选'} 的候选 JSON 文件确实存在，
        并能打开查看当前修改。仅点击“导出候选配置”不能完成备份确认。
      </p>
      <div className="flex gap-2">
        <button type="button" disabled={busy} className={buttonClass} onClick={confirmBackupAfterFileCheck}>
          我已检查备份文件存在且内容正确
        </button>
        <button type="button" disabled={busy} className={buttonClass} onClick={()=>setPendingBackupConfirmation(null)}>
          尚未完成备份
        </button>
      </div>
    </Section>}
    {pendingLatestRead && <Section title="可信读取结果对比（未执行替换）">
      <p className="text-xs">Main 回传的候选身份：{pendingLatestRead.remote.templateId}；修订 {pendingLatestRead.currentRevision} → {pendingLatestRead.remote.revision}；digest {pendingLatestRead.remote.digest.slice(0,16)}…</p>
      <p className="text-xs">与当前屏幕草稿相比 {pendingLatestRead.comparedWithCurrent.changes.length} 处变化，删除 Check {pendingLatestRead.comparedWithCurrent.deletedCheckKeys.length}。此读回不能授予出版或业务决定权限。</p>
      {pendingLatestRead.comparedWithCurrent.changes.length>0 && <details>
        <summary className="cursor-pointer text-xs">展开最新修订变更详情（最多 80 条）</summary>
        <ul className="text-xs space-y-1">{pendingLatestRead.comparedWithCurrent.changes.slice(0,80).map(x=>
          <li key={x.area+'/'+x.kind+'/'+x.key}>{x.area} / {x.kind} / {x.key}</li>)}</ul>
      </details>}
      {isDirty && !isB1PristineReopenLookup(draft,revision,savedSnapshot,emptyB1AuthorDocument())
        && <p role="alert" className="text-xs text-red-500">本地有未保存修改；先导出当前草稿并确认文件已保存，再明确选择载入最新修订。不会自动合并。</p>}
      {isB1PristineReopenLookup(draft,revision,savedSnapshot,emptyB1AuthorDocument())
        && <p className="text-xs text-muted-foreground">这是未加入其他信息的空白候选定位页，仅输入了已保存模板 ID；可显式重新打开，无需备份空白输入。确认载入前 Main 会再次读取并检验最新修订。</p>}
      <div className="flex gap-2">
        <button type="button" disabled={busy || pendingLatestRead.remote.revision<=revision}
          className={buttonClass} onClick={()=>void adoptLatestRead()}>确认后重新核验 Main 当前修订并载入（不自动覆盖）</button>
        <button type="button" disabled={busy} className={buttonClass}
          onClick={()=>{setPendingLatestRead(null);setNotice('已保留本地草稿，未载入远端修订')}}>保留本地草稿</button>
      </div>
    </Section>}
    {pendingImport && <Section title="导入预览：尚未替换、保存或发布">
      <p className="text-xs">来源：不可信用户文件；Main 身份/学校政策/Gold 均未验真。</p>
      <p className="text-sm">{pendingImport.doc.name} · {pendingImport.doc.templateId} · v{pendingImport.doc.templateVersion}</p>
      <p className="text-xs">来源 {pendingImport.doc.sources.length} · 字段 {pendingImport.doc.fields.length} · 对象 {pendingImport.doc.targets.length} · Check {pendingImport.doc.modules.reduce((n,m)=>n+m.checks.length,0)}</p>
      <p className="text-xs">确认将舍弃屏幕现有未保存修改，并把新候选设为修订 0；历史原件仍留在 Main，不能绕过已有模板 revision CAS。</p>
      <div className="flex gap-2">
        <button type="button" disabled={busy} className={buttonClass} onClick={confirmImport}>确认替换为未保存草稿</button>
        <button type="button" disabled={busy} className={buttonClass} onClick={()=>{setPendingImport(null);setNotice('已取消导入；原草稿未改动')}}>取消导入</button>
      </div>
    </Section>}
    {error && <p role="alert" className="text-sm text-red-500">未执行：{error}</p>}
    {notice && <p role="status" className="text-sm">{notice}</p>}
    {preview && <Section title="候选编译与三值适用性预览">
      <p className="text-xs">仅为样例试跑：结果随试跑字段改变，不是学校政策或正式材料符合性判断。</p>
      <p className="text-xs">fingerprint: {preview.canonicalPlan.fingerprint}</p>
      <p className="text-xs">Check × target 绑定：{preview.canonicalPlan.bindings.length} 条；unknown：
        {preview.canonicalPlan.bindings.filter(b=>b.applicability==='unknown').length} 条</p>
      <div className="space-y-1">{preview.canonicalPlan.bindings.map((b,i)=><p key={i} className="text-xs">
        {b.checkKey} → {b.targetKey} · {b.applicability} · {b.sourceVersionIds.join(', ')}
      </p>)}</div>
      <p className="text-xs">无权据此认定审批通过；真正的安装与签署由 Dev-C/授权政策门禁处理。</p>
    </Section>}
  </div>
}
