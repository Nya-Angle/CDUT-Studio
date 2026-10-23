/**
 * A4-R10: version-pinned Pi SDK 0.86.1 HTTP Provider request witness.
 *
 * Actual upstream source facts:
 * - coding-agent AgentSession.agent.streamFunction is public, called by the
 *   agent loop before each model stream;
 * - openai-completions/openai-responses pass options.fetch into OpenAI SDK,
 *   use SDK maxRetries:0 and an outer retryProviderRequest(options.maxRetries);
 * - onResponse is AFTER the HTTP response, not a provider turn receipt.
 *
 * Attach ONLY to a fresh, Main-owned, review-specific AgentSession before prompt.
 * This witnesses exactly one OpenAI-compatible HTTPS/SSE transport fetch plus
 * full SDK turn_end; it is NOT a universal Pi Provider receipt capability.
 * No C business ReviewRun / IPC / Preload / Renderer entrypoint.
 */
import type {AgentSession} from '@earendil-works/pi-coding-agent'
import type {FetchFunction} from '@earendil-works/pi-ai'
import {assertC0RunEvidenceIdentity,C0ContractError} from '@profer/shared'
import type {
  V3ANativeProviderWitness,
  V3APhysicalTurnInput,
  V3ANativeSingleRequestEngine,
} from './review-v3-sdk-physical-turn-port'

type PiSession = Pick<AgentSession,'agent'|'prompt'|'subscribe'|'dispose'>
// Bun extends global fetch with .preconnect, which is not part of a plain
// request transport. Keep the injected Main fetch deliberately callable-only.
export type V3AHttpRequestTransport=(...args:Parameters<FetchFunction>)=>ReturnType<FetchFunction>

export interface V3APiHttpRequestSpec {
  /** Must be a new, non-running Pi review session, not a shared user agent. */
  session: PiSession
  /** Prompt constructed by trusted Main from frozen Case/Plan/Source. */
  prompt: string
  /** Main-approved HTTPS provider base origin; never derive from model text. */
  trustedOrigin: string
  /** Only a Main-owned audited fetch may replace native global fetch (tests only). */
  transportFetch?: V3AHttpRequestTransport
}

export interface V3APiHttpSingleRequestFactory {
  create(input: V3APhysicalTurnInput): Promise<V3APiHttpRequestSpec>
}

// A single SDK session must never be recycled for another ReviewRun/provider
// claim, even if prompt() returned or failed. The instance is Main-private.
const consumedPiAgents=new WeakSet<object>()
const fail=(reason:string):never=>{
  throw new C0ContractError('RECOVERY_REQUIRED',reason)
}
const requestId=(response:Response):string|undefined=>{
  const id=response.headers.get('x-request-id')
  return id && id.trim() && id.trim().length<=512 ? id.trim():undefined
}
function getUrl(input:RequestInfo|URL):URL{
  if(input instanceof Request)return new URL(input.url)
  return new URL(String(input))
}
/**
 * Not globally installed and does not patch pi node_modules. It binds the real
 * pi-agent-core streamFunction in one dedicated session for one invocation.
 * Other providers/transports must use a separately proven transport adapter.
 */
export class V3APiHttpSingleRequestEngine implements V3ANativeSingleRequestEngine {
  constructor(private readonly factory:V3APiHttpSingleRequestFactory){}

  async invoke(input:V3APhysicalTurnInput,witness:V3ANativeProviderWitness):Promise<void>{
    assertC0RunEvidenceIdentity(input.run)
    if(!input.dispatchId?.trim() ||
        !['direct','hidden','graph','batch'].includes(input.mode)){
      fail('Trusted Main SDK dispatch/Run mode required')
    }
    if(input.signal?.aborted)fail('Main aborted before Pi session creation')
    const spec=await this.factory.create(input)
    const session=spec?.session
    const rejectNewSession=(reason:string):never=>{
      try { session?.dispose?.() }
      finally { return fail(reason) }
    }
    if(!session?.agent || typeof session.prompt!=='function' ||
        typeof session.subscribe!=='function' ||
        typeof session.dispose!=='function' ||
        !spec.prompt?.trim() || !spec.trustedOrigin) {
      return rejectNewSession('Trusted dedicated Pi SDK session/prompt unavailable')
    }
    let origin:URL
    try{origin=new URL(spec.trustedOrigin)}
    catch{return rejectNewSession('Trusted Pi Provider HTTPS origin invalid')}
    if(origin.protocol!=='https:' || origin.username || origin.password ||
        origin.pathname!=='/' || origin.search || origin.hash) {
      return rejectNewSession('Only exact trusted HTTPS Provider origin is allowed')
    }
    if(input.signal?.aborted) {
      return rejectNewSession('Main aborted after Pi session creation')
    }
    // Do not cancel a session already owned by another SDK invocation.
    if(session.agent.state.isStreaming)fail('Pi SDK session already running')
    if(consumedPiAgents.has(session.agent)) {
      fail('Pi SDK review Agent session reused for another physical request')
    }
    if(typeof session.agent.streamFunction!=='function') {
      return rejectNewSession('Pi SDK stream function is unavailable')
    }
    consumedPiAgents.add(session.agent)
    const previous=session.agent.streamFunction
    let invocations=0
    let httpCalls=0
    let physicalResponseId:string|undefined
    // Observed only from bytes actually pulled through the Provider response
    // body. HTTP headers, onResponse and Pi agent_settled alone cannot attest
    // that an SSE completion marker was delivered to the SDK.
    let sseTerminated=false
    // R17: application terminal frames are not necessarily the end of HTTP.
    // Only the exact SDK-consumed response pipe's normal EOF permits receipt.
    let sseTransportEof=false
    let startedTurn=false
    let finishedTurn=false
    let agentEnded=false
    let agentSettled=false
    let corrupted=false
    const mark=():never=>{
      corrupted=true
      return fail('Pi SDK Provider request count/provenance violated')
    }
    // Exact Pi 0.86.1 lifecycle:
    // turn_start -> (single physical fetch) -> turn_end -> agent_end ->
    // agent_settled. agent_end may announce willRetry, and turn_end alone
    // does NOT mean native retry/compaction/queued work has settled.
    const unsubscribe=session.subscribe(event=>{
      switch(event.type){
        case 'turn_start':
          if(startedTurn || finishedTurn || agentEnded || agentSettled) {
            corrupted=true
          } else {
            startedTurn=true
          }
          break
        case 'turn_end':
          if(!startedTurn || finishedTurn || agentEnded || agentSettled ||
              invocations!==1 || !physicalResponseId ||
              event.message.role!=='assistant' ||
              !['stop','length','toolUse'].includes(event.message.stopReason)){
            corrupted=true
          } else {
            finishedTurn=true
          }
          break
        case 'agent_end':
          if(!finishedTurn || agentEnded || agentSettled || event.willRetry){
            corrupted=true
          } else {
            agentEnded=true
          }
          break
        case 'agent_settled':
          if(!agentEnded || agentSettled){
            corrupted=true
          } else {
            agentSettled=true
          }
          break
      }
    })
    try{
      session.agent.streamFunction=(model,context,options)=>{
        invocations++
        if(invocations!==1 || corrupted || !startedTurn || finishedTurn ||
            agentEnded || agentSettled || input.signal?.aborted ||
            !['openai-completions','openai-responses'].includes(model.api) ||
            options?.transport==='websocket' ||
            options?.transport==='websocket-cached'){
          return mark()
        }
        // A preconfigured SDK fetch may hide retries inside a wrapper. The
        // only admissible transport is Main-selected direct fetch, and this
        // wrapper must be the one the Provider actually invokes.
        if(options?.fetch)return mark()
        const upstreamFetch:V3AHttpRequestTransport=spec.transportFetch??globalThis.fetch
        const guardedFetch:FetchFunction=Object.assign(
          async (resource:Parameters<FetchFunction>[0],
            init?:Parameters<FetchFunction>[1]):Promise<Response>=>{
          httpCalls++
          if(httpCalls!==1 || corrupted || input.signal?.aborted)return mark()
          let url:URL
          try{url=getUrl(resource)}
          catch{return mark()}
          if(url.protocol!=='https:' || url.origin!==origin.origin)return mark()
          const downstreamSignal=input.signal && init?.signal
            ? AbortSignal.any([input.signal,init.signal])
            : input.signal ?? init?.signal ?? undefined
          const response=await upstreamFetch(resource,{
            ...init,
            // Redirects could escape Main-pinned provider origin even when the
            // first URL passed our check; never follow them silently.
            redirect:'error',
            ...(downstreamSignal ? {signal:downstreamSignal} : {}),
          })
          if(response.redirected ||
              (response.url && new URL(response.url).origin!==origin.origin)) {
            return mark()
          }
          if(!response.ok) return response
          physicalResponseId=requestId(response)
          if(!physicalResponseId)return mark()
          const contentType=response.headers.get('content-type')
            ?.split(';',1)[0]?.trim().toLowerCase()
          if(contentType!=='text/event-stream' || !response.body)return mark()
          // Do not clone/tee: a second reader can buffer an unbounded response
          // and might finish independently of the SDK consumer. Watch only
          // bytes that pass through the actual response body consumed by Pi.
          const decoder=new TextDecoder()
          let linePrefix=''
          let frameEvent=''
          let frameData=''
          let dataLines=0
          const api=model.api
          // A terminal field is meaningful only after the full SSE frame's
          // empty-line delimiter, not merely because a header/string appeared
          // in an incomplete or subsequently failed response.
          const finishFrame=():void=>{
            if(!frameEvent && dataLines===0)return
            if(sseTerminated){
              corrupted=true // a second physical application event after DONE
            }
            const completionsDone=api==='openai-completions' &&
              !frameEvent && dataLines===1 && frameData==='[DONE]'
            // Pi 0.86.1 / OpenAI Responses emits event: response.completed
            // paired with a data JSON whose first top-level key is "type".
            // An event header by itself or a mismatched data frame is not a
            // successful terminal receipt.
            const responsesDone=api==='openai-responses' &&
              frameEvent==='response.completed' && dataLines===1 &&
              /^\{\s*"type"\s*:\s*"response\.completed"\s*[,}]/.test(frameData)
            if(completionsDone || responsesDone) {
              sseTerminated=true
            } else if(frameEvent==='response.completed' ||
                frameData==='[DONE]') {
              corrupted=true // a malformed/mismatched completion frame
            }
            frameEvent=''
            frameData=''
            dataLines=0
          }
          const finishLine=(value:string):void=>{
            const line=value.endsWith('\r')?value.slice(0,-1):value
            if(line===''){
              finishFrame()
            } else if(line.startsWith('event:')){
              frameEvent=line.slice(6).trim()
            } else if(line.startsWith('data:')){
              dataLines++
              if(dataLines===1)frameData=line.slice(5).trimStart()
              // OpenAI terminal events are single data-line frames. Multiple
              // data lines cannot be mistaken for one terminal marker.
            }
          }
          const inspect=(chunk:Uint8Array):void=>{
            const parts=decoder.decode(chunk,{stream:true}).split('\n')
            for(let i=0;i<parts.length;i++){
              const next=(linePrefix+parts[i]!).slice(0,256)
              if(i<parts.length-1){
                finishLine(next)
                linePrefix=''
              } else {
                // Bound the retained prefix of a potentially huge JSON event.
                linePrefix=next
              }
            }
          }
          const observedBody=response.body.pipeThrough(
            new TransformStream<Uint8Array,Uint8Array>({
              transform(chunk,controller){
                inspect(chunk)
                controller.enqueue(chunk)
              },
              flush(){
                // Only a normal close of this SDK-consumed HTTP stream reaches
                // flush. A late transport error/cancel cannot mint completion.
                // Never separately drain/tee/clone an upstream response.
                sseTransportEof=true
                if(linePrefix.trim() || frameEvent || dataLines)corrupted=true
              },
            }),
          )
          // This wraps the existing single response; it does not create an
          // additional HTTP request or independently drain its body.
          const observedResponse=new Response(observedBody,{
            status:response.status,statusText:response.statusText,
            headers:response.headers,
          })
          // This is a server-issued HTTP response ID, NOT a model/assistant
          // UUID and NOT proof that the stream has finished.
          witness.requestStarted(physicalResponseId)
          return observedResponse
          },
          // Pi's fetch option follows Bun's augmented global fetch interface.
          // Never expose an unguarded DNS preconnect shortcut to the Provider.
          {preconnect:()=>mark()},
        )
        const streamSignal=input.signal && options?.signal
          ? AbortSignal.any([input.signal,options.signal])
          : input.signal ?? options?.signal
        return previous(model,context,{
          ...options,
          ...(streamSignal ? {signal:streamSignal} : {}),
          transport:'sse',
          maxRetries:0,
          fetch:guardedFetch,
        })
      }
      await session.prompt(spec.prompt)
      if(input.signal?.aborted)fail('Pi Provider aborted during model stream')
      // The ID is written by the guarded asynchronous transport callback.
      // Explicitly narrow after prompt() returns; a successful SDK prompt
      // alone is not sufficient proof the physical HTTP callback ran.
      const observedId=physicalResponseId as string|undefined
      if(corrupted || invocations!==1 || httpCalls!==1 ||
          !observedId || !sseTerminated || !sseTransportEof ||
           !startedTurn || !finishedTurn ||
          !agentEnded || !agentSettled) {
        return fail('Pi HTTP Provider request/stream completion provenance unavailable')
      }
      witness.requestFinished({
        nativeRequestId:observedId,
        nativeReceiptId:observedId,
        status:'completed',
      })
    } finally {
      // Pi 0.86.1 AgentSession.dispose() aborts the agent, native retry,
      // compaction, bash and cache warming and disconnects its listeners.
      // Restoring streamFunction alone would leave an SDK session capable
      // of later dispatch outside this single-request witness.
      try {
        session.dispose()
      } finally {
        try { unsubscribe() }
        finally { session.agent.streamFunction=previous }
      }
    }
  }
}
