import {afterEach,describe,expect,it} from 'bun:test'
import {mkdtempSync,rmSync} from 'node:fs'
import {tmpdir} from 'node:os'
import {join} from 'node:path'
import {REVIEW_C0_SCHEMA_VERSION,type RunEvidenceIdentity} from '@profer/shared'
import type {PiAgentQueryOptions} from '../adapters/pi-agent-adapter'
import {A26NativeReviewPiSessionFactory} from './review-v3-a26-native-pi-session-factory'

const dirs:string[]=[]
afterEach(()=>{
  for(const dir of dirs.splice(0))rmSync(dir,{recursive:true,force:true})
})
const run:RunEvidenceIdentity={
  schemaVersion:REVIEW_C0_SCHEMA_VERSION,caseId:'case-a26',
  runId:'run-a26',caseRevision:1,planFingerprint:'frozen-plan',
  templateVersion:'1',inputManifestHash:'a'.repeat(64),
  sourceVersionIds:['source-a26'],checkKeys:['check-a26'],
  attemptId:'attempt-a26',ownerGeneration:1,
}
const request={run,mode:'hidden' as const,dispatchId:'dispatch-a26'}
function modelOptions(dir:string):PiAgentQueryOptions{
  return {
    sessionId:'review-hidden-a26',
    model:'gpt-4o-mini',
    provider:'openai',
    baseUrl:'https://test-provider.invalid/v1',
    apiKey:'offline-disposable-key',
    cwd:dir,
    piAgentDir:dir,
    piSessionDir:join(dir,'sessions'),
    systemPrompt:'Local unpublished candidate technical check. Never claim school approval.',
    permissionMode:'default',
    toolProfile:'review',
  } as unknown as PiAgentQueryOptions
}
describe('A26 real private Pi session setup',()=>{
  it('A26-01 builds actual Pi SDK session with selected OpenAI model, separate history',async()=>{
    const dir=mkdtempSync(join(tmpdir(),'review-a26-native-'))
    dirs.push(dir)
    const factory=new A26NativeReviewPiSessionFactory({
      select:async()=>({
        options:modelOptions(dir),
        prompt:'Read the current frozen local candidate, then request manual review.',
        tools:[],
      }),
    })
    const spec=await factory.create(request)
    expect(spec.trustedOrigin).toBe('https://test-provider.invalid')
    expect(spec.prompt).toContain('frozen local candidate')
    expect(spec.session.agent.state.model?.id).toBe('gpt-4o-mini')
    expect(spec.session.agent.state.isStreaming).toBe(false)
    spec.session.dispose()
  })
  it('A26-02 missing Provider configuration fails visibly without launching Pi',async()=>{
    const dir=mkdtempSync(join(tmpdir(),'review-a26-no-provider-'))
    dirs.push(dir)
    const factory=new A26NativeReviewPiSessionFactory({
      select:async()=>({
        options:{...modelOptions(dir),apiKey:''},
        prompt:'Local technical run',tools:[],
      }),
    })
    await expect(factory.create(request)).rejects.toThrow(
      'EXTERNAL_PROVIDER_NOT_CONFIGURED')
  })
  it('A26-03 an already cancelled request never reads Main model selection',async()=>{
    const abort=new AbortController()
    abort.abort()
    let selected=0
    const factory=new A26NativeReviewPiSessionFactory({select:async()=>{
      selected++
      throw Error('must not select')
    }})
    await expect(factory.create({...request,signal:abort.signal}))
      .rejects.toThrow('CANCELLED_BEFORE_PI_SESSION')
    expect(selected).toBe(0)
  })
})
