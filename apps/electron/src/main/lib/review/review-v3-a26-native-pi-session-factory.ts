/**
 * Dev-A A26: REAL pinned Pi SDK AgentSession construction for the C11 A25 port.
 *
 * C Main resolves the currently selected model/channel credentials and frozen
 * Case prompt. We create a new isolated Pi session, not an ordinary chat
 * session, for every A25 physical SDK dispatch.
 *
 * Only OpenAI-compatible SSE is currently observed by the existing A Pi HTTP
 * engine. Other providers require a real witness; never fake a completion.
 */
import {mkdirSync} from 'node:fs'
import {C0ContractError} from '@profer/shared'
import type {ToolDefinition} from '@earendil-works/pi-coding-agent'
import type {PiAgentQueryOptions} from '../adapters/pi-agent-adapter'
import {buildModel} from '../adapters/pi-model-registry'
import {createPromaSkillsOverride} from '../adapters/pi-skill-resources'
import {createProferAgentsFilesOverride,
  createProferManagedResourceLoaderOptions}
  from '../adapters/pi-resource-loader-overrides'
import type {
  V3APiHttpSingleRequestFactory,V3APiHttpRequestSpec,
} from './review-v3-pi-http-provider-engine'
import type {V3APhysicalTurnInput} from './review-v3-sdk-physical-turn-port'

/**
 * NO Renderer/model-generated actor or source IDs. The selected Pi provider,
 * credentials, tool handlers, prompt and directory are all owned by C Main.
 */
export interface A26MainReviewPiSelection {
  readonly options:PiAgentQueryOptions
  /** Generated from the current frozen Case/Plan/materials by C Main. */
  readonly prompt:string
  /** Privileged scoped Read/Check/Submit tools, never ordinary chat tools. */
  readonly tools:readonly ToolDefinition[]
}
export interface A26MainReviewPiSelectionPort {
  select(request:Readonly<V3APhysicalTurnInput>):
    Promise<A26MainReviewPiSelection>
}

const fail=(code:string):never=>{
  throw new C0ContractError('RECOVERY_REQUIRED','A26_PI_'+code)
}
export class A26NativeReviewPiSessionFactory
implements V3APiHttpSingleRequestFactory {
  constructor(private readonly trustedMain:A26MainReviewPiSelectionPort){
    if(typeof trustedMain?.select!=='function')fail('MAIN_MODEL_CHANNEL_NOT_INSTALLED')
  }
  async create(request:V3APhysicalTurnInput):Promise<V3APiHttpRequestSpec>{
    if(request.signal?.aborted)return fail('CANCELLED_BEFORE_PI_SESSION')
    const selected=await this.trustedMain.select(request)
    if(request.signal?.aborted)return fail('CANCELLED_DURING_MODEL_SELECTION')
    const options=selected?.options
    if(!options?.apiKey?.trim())return fail('EXTERNAL_PROVIDER_NOT_CONFIGURED')
    if(!options.model?.trim()||!selected.prompt?.trim()||
       !options.systemPrompt?.trim()||!options.piAgentDir?.trim()||
       !options.piSessionDir?.trim())return fail('MAIN_FROZEN_PI_SELECTION_MISSING')
    // The physical engine has a provable single-request witness only for
    // openai-completions / openai-responses over HTTPS SSE.
    const sdk=await import('@earendil-works/pi-coding-agent')
    const {modelRuntime,model}=await buildModel(sdk,options)
    if(!['openai-completions','openai-responses'].includes(model.api))
      return fail('PROVIDER_PROTOCOL_NOT_YET_SUPPORTED')
    let url:URL
    try{url=new URL(model.baseUrl)}
    catch{return fail('PROVIDER_URL_NOT_CONFIGURED')}
    if(url.protocol!=='https:'||url.username||url.password)
      return fail('PROVIDER_HTTPS_REQUIRED')
    if(request.signal?.aborted)return fail('CANCELLED_DURING_PI_SETUP')
    const cwd=options.cwd??process.cwd()
    mkdirSync(options.piSessionDir,{recursive:true})
    const settingsManager=sdk.SettingsManager.inMemory({
      // An upstream retry could duplicate physical Provider work.
      retry:{enabled:false},
      compaction:{enabled:false},
      transport:'sse',
    })
    const loader=new sdk.DefaultResourceLoader({
      cwd,agentDir:options.piAgentDir,settingsManager,
      additionalSkillPaths:[],
      skillsOverride:createPromaSkillsOverride([],[],sdk.loadSkillsFromDir),
      agentsFilesOverride:createProferAgentsFilesOverride(),
      ...createProferManagedResourceLoaderOptions(),
      systemPromptOverride:()=>options.systemPrompt,
    })
    await loader.reload()
    const sessionManager=sdk.SessionManager.create(cwd,options.piSessionDir)
    const {session}=await sdk.createAgentSession({
      cwd,agentDir:options.piAgentDir,modelRuntime,settingsManager,
      resourceLoader:loader,sessionManager,model,
      thinkingLevel:options.thinkingLevel??'off',
      noTools:'builtin',
      customTools:[...selected.tools],
    })
    session.agent.toolExecution='sequential'
    if(request.signal?.aborted){
      session.dispose()
      return fail('CANCELLED_AFTER_PI_SESSION_CREATION')
    }
    return {
      session,
      prompt:selected.prompt,
      // The A HTTP witness checks the ACTUAL transport URL against this
      // pinned HTTPS origin on every invocation (not against model text).
      trustedOrigin:url.origin,
    }
  }
}
