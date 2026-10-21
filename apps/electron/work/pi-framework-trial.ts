/** 隔离试用项目当前 Pi 内核；相同材料、目标和输出格式，不走旧审核强制流程。 */
import { readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { resolve, relative, isAbsolute, join } from 'node:path'
import { Type } from 'typebox'
import { Agent } from '@earendil-works/pi-agent-core'
import { createModels, createProvider, type Model } from '@earendil-works/pi-ai'
import { deepseekProvider } from '@earendil-works/pi-ai/providers/deepseek'
import { openAICompletionsApi } from '@earendil-works/pi-ai/api/openai-completions.lazy'

const workspace = resolve(process.argv[2]!)
const systemPrompt = readFileSync(process.argv[3]!, 'utf8')
const outputPath = process.argv[4]!
const apiKey = process.env.REVIEW_TRIAL_API_KEY
if (!apiKey) throw new Error('缺少试用模型凭据')
const baseUrl = process.env.REVIEW_TRIAL_BASE_URL ?? 'https://api.deepseek.com/v1'
const model: Model<'openai-completions'> = {
  id: 'deepseek-flash', name: 'DeepSeek Flash', provider: 'deepseek', api: 'openai-completions', baseUrl,
  contextWindow: 400000, maxTokens: 32000, reasoning: false, input: ['text'],
  cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
  compat: { supportsDeveloperRole: false, supportsStore: false, maxTokensField: 'max_tokens' },
}
const models = createModels()
models.setProvider(createProvider({ id: 'deepseek', auth: deepseekProvider().auth, models: [model], api: openAICompletionsApi() }))

function localPath(path: string): string {
  const target = resolve(workspace, path.replace(/^\/+/, ''))
  const rel = relative(workspace, target)
  if (rel.startsWith('..') || isAbsolute(rel)) throw new Error('文件不在试用工作区内')
  return target
}
function walk(path: string): string[] {
  return readdirSync(path, { withFileTypes: true }).flatMap((entry) => entry.isDirectory() ? walk(join(path, entry.name)) : [join(path, entry.name)])
}
const calls: unknown[] = []
const tools = [
  {
    name: 'ls', label: '列出材料', description: '列出目录中的文件。路径相对于案卷工作区。',
    parameters: Type.Object({ path: Type.String() }),
    execute: async (_id: string, args: { path: string }) => ({ content: [{ type: 'text' as const, text: readdirSync(localPath(args.path)).join('\n') }], details: {} }),
  },
  {
    name: 'read_file', label: '读取材料', description: '读取文本文件，默认前 100 行。offset 从 0 开始，limit 是行数；返回完整行数和后续分页位置。',
    parameters: Type.Object({ file_path: Type.String(), offset: Type.Optional(Type.Number()), limit: Type.Optional(Type.Number()) }),
    execute: async (_id: string, args: { file_path: string; offset?: number; limit?: number }) => {
      const lines = readFileSync(localPath(args.file_path), 'utf8').split('\n')
      if (lines.at(-1) === '') lines.pop()
      const offset = Math.max(0, Math.floor(args.offset ?? 0))
      const limit = Math.min(200, Math.max(1, Math.floor(args.limit ?? 100)))
      const end = Math.min(lines.length, offset + limit)
      const text = JSON.stringify({ totalLines: lines.length, nextOffset: end < lines.length ? end : null }) + '\n' + lines.slice(offset, end).map((line, index) => `${offset + index + 1}: ${line}`).join('\n')
      return { content: [{ type: 'text' as const, text }], details: {} }
    },
  },
  {
    name: 'grep', label: '搜索材料', description: '在目录文件中搜索字面关键词，返回匹配文件、行号和原文。',
    parameters: Type.Object({ pattern: Type.String(), path: Type.Optional(Type.String()) }),
    execute: async (_id: string, args: { pattern: string; path?: string }) => {
      const hits = walk(localPath(args.path ?? '/materials')).flatMap((file) => readFileSync(file, 'utf8').split('\n').flatMap((line, index) => line.includes(args.pattern) ? [`/${relative(workspace, file)}:${index + 1}: ${line}`] : []))
      return { content: [{ type: 'text' as const, text: hits.join('\n') || '未命中' }], details: {} }
    },
  },
]
let apiCalls = 0
const requestSizes: unknown[] = []
const agent = new Agent({
  initialState: { systemPrompt, model, tools, thinkingLevel: 'off' },
  getApiKey: () => apiKey,
  streamFn: (selectedModel, context, options) => {
    apiCalls++
    if (apiCalls > 12) throw new Error('达到试用请求上限 12')
    return models.streamSimple(selectedModel, context, {
      ...options, apiKey, maxTokens: 32000, temperature: 0,
      onPayload: (payload) => {
        const body = payload as Record<string, unknown>
        body.thinking = { type: 'disabled' }
        requestSizes.push({ apiCall: apiCalls, toolSchemaChars: JSON.stringify(body.tools ?? []).length, messageChars: JSON.stringify(body.messages ?? []).length })
        return body
      },
    })
  },
})
agent.subscribe((event) => {
  if (event.type === 'tool_execution_start') calls.push({ tool: event.toolName, args: event.args })
})
const started = performance.now()
const timeout = setTimeout(() => agent.abort(), 180000)
let error: string | undefined
try {
  await agent.prompt('审核 /materials 中的申请与附件，完成 budget、duplicate、approval 三项检查，并返回规定的 JSON 和最终摘要。')
} catch (caught) {
  error = caught instanceof Error ? caught.message : String(caught)
} finally {
  clearTimeout(timeout)
}
const messages = agent.state.messages
const assistants = messages.filter((message) => message.role === 'assistant')
const usage = assistants.reduce((sum, message) => {
  sum.inputTokens += message.usage.input + message.usage.cacheRead + message.usage.cacheWrite
  sum.outputTokens += message.usage.output
  sum.cacheReadTokens += message.usage.cacheRead
  return sum
}, { inputTokens: 0, outputTokens: 0, cacheReadTokens: 0 })
const final = assistants.at(-1)?.content.filter((part) => part.type === 'text').map((part) => part.text).join('\n') ?? ''
writeFileSync(outputPath, JSON.stringify({ engine: 'pi-minimal', elapsedMs: performance.now() - started, apiCalls, calls, requestSizes, usage, final, error: error ?? agent.state.errorMessage, messages }, null, 2))
console.log(JSON.stringify({ engine: 'pi-minimal', apiCalls, ...usage, elapsedMs: performance.now() - started, error: error ?? agent.state.errorMessage }))
