/** 仅用于 P06 本地验收；按实际 run 指派解析 owner，避免把旧记录存在当作复用证明。 */
export function roundOwnerId(caseId, runId, owners, assignments) {
  const matches = assignments.filter(a => a.caseId === caseId && a.activeRunId === runId && !a.revokedAt)
  if (matches.length !== 1) throw new Error('本轮必须有唯一有效审核指派')
  const owner = owners.find(s => s.id === matches[0].sessionId)
  if (!owner || owner.owner?.kind !== 'review-case' || owner.owner.caseId !== caseId) {
    throw new Error('本轮指派没有绑定本案审核 owner')
  }
  return owner.id
}

export function verifyOwnerTransition(mode, firstId, secondId, beforeIds, afterIds) {
  const before = new Set(beforeIds)
  const after = new Set(afterIds)
  if (!before.has(firstId) || !after.has(firstId) || !after.has(secondId)) throw new Error('审核 owner 记录缺失')
  const newIds = [...after].filter(id => !before.has(id))
  if (mode === 'update') {
    if (secondId !== firstId || newIds.length) throw new Error('update 未实际复用第一轮 owner')
  } else if (mode === 'restart') {
    if (secondId === firstId || newIds.length !== 1 || newIds[0] !== secondId) throw new Error('restart 未实际绑定唯一新 owner')
  } else throw new Error('未知审核模式')
  return true
}

/** ACK 发生在 provider 调用之前；只接受本轮实际 assistant token/工具回执作为额外运行见证。 */
export function providerWitness(messages) {
  const replies = messages.filter(m => m.type === 'assistant' && m.message
    && ((m.message.usage?.input_tokens ?? 0) + (m.message.usage?.output_tokens ?? 0) > 0))
  return { assistantReplies: replies.length,
    toolCalls: replies.flatMap(m => Array.isArray(m.message.content)
      ? m.message.content.filter(c => c.type === 'tool_use').map(c => c.name) : []) }
}
