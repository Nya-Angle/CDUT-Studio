import { app } from 'electron'
import { writeFileSync } from 'node:fs'
import { PiAgentAdapter } from '../src/main/lib/adapters/pi-agent-adapter'
import { assembleAndRunReview } from '../src/main/lib/review/run-async-service'

const caseId = process.env.BENCH_CASE_ID ?? 'deepseek-capability-benchmark-v1'
const summaryPath = process.env.BENCH_SUMMARY_PATH ?? '/tmp/deepseek-benchmark-summary.json'
const adapterProto = PiAgentAdapter.prototype as unknown as { query: (this: PiAgentAdapter, input: unknown) => AsyncIterable<any> }
const originalQuery = adapterProto.query
const metrics = { queryCount: 0, resultCount: 0, inputTokens: 0, outputTokens: 0, cacheReadInputTokens: 0, cacheCreationInputTokens: 0, costUsd: 0, uniqueToolCalls: 0 }
adapterProto.query = async function* (input: unknown): AsyncIterable<any> {
  metrics.queryCount++
  const queryToolCallIds = new Set<string>()
  for await (const message of originalQuery.call(this, input)) {
    if (message?.type === 'assistant' || message?.type === 'assistantMessage') {
      const content = message.message?.content
      if (Array.isArray(content)) for (const part of content) {
        if (part.type !== 'toolCall' && part.type !== 'tool_use' && part.type !== 'tool_call') continue
        const id = part.id ?? part.toolCallId
        if (typeof id === 'string') queryToolCallIds.add(id)
      }
    }
    if (message?.type === 'result' && message.usage) {
      metrics.resultCount++
      metrics.inputTokens += Number(message.usage.input_tokens ?? 0)
      metrics.outputTokens += Number(message.usage.output_tokens ?? 0)
      metrics.cacheReadInputTokens += Number(message.usage.cache_read_input_tokens ?? 0)
      metrics.cacheCreationInputTokens += Number(message.usage.cache_creation_input_tokens ?? 0)
      metrics.costUsd += Number(message.total_cost_usd ?? 0)
    }
    yield message
  }
  metrics.uniqueToolCalls += queryToolCallIds.size
}

app.whenReady().then(async () => {
  const startedAt = Date.now()
  try {
    const run = await assembleAndRunReview(caseId, { initiatedBy: { actorId: 'local-user', actorSource: 'local', role: 'reviewer' } })
    const elapsedMs = Date.now() - startedAt
    const output = {
      caseId, runId: run.id, status: run.status, elapsedMs,
      templateId: run.templateId, templateVersion: run.templateVersion,
      modelChannel: 'DeepSeek 官方 Flash（审核测试）', modelId: 'deepseek-flash',
      metrics,
      modelUsage: run.modelUsage ?? [],
      totalInputTokens: metrics.inputTokens + metrics.cacheReadInputTokens + metrics.cacheCreationInputTokens + (run.modelUsage ?? []).reduce((sum, item) => sum + (item.inputTokens ?? 0) + (item.cacheReadInputTokens ?? 0), 0),
      totalOutputTokens: metrics.outputTokens + (run.modelUsage ?? []).reduce((sum, item) => sum + (item.outputTokens ?? 0), 0),
      agentActivity: run.agentActivity ?? [],
      coverage: run.coverage,
      checkpointSummary: run.checkpoints.map((item) => ({ nodeId: item.nodeId, status: item.status, attempts: item.attempts, lastError: item.lastError })),
      checkSummary: run.checks.map((item) => ({ ruleId: item.ruleId, status: item.status, reason: item.reason, sourceRefCount: item.sourceRefs?.length ?? 0, executedBy: item.executedBy })),
      diagnostics: run.diagnostics,
      completedAt: run.completedAt,
    }
    writeFileSync(summaryPath, JSON.stringify(output, null, 2))
    process.stdout.write(`BENCH_RESULT ${JSON.stringify(output)}\n`)
    app.exit(run.status === 'completed' ? 0 : 2)
  } catch (error) {
    const output = { caseId, status: 'runner-error', elapsedMs: Date.now() - startedAt, metrics, error: error instanceof Error ? error.message : String(error) }
    writeFileSync(summaryPath, JSON.stringify(output, null, 2))
    process.stderr.write(`BENCH_RESULT ${JSON.stringify(output)}\n`)
    app.exit(3)
  }
})
