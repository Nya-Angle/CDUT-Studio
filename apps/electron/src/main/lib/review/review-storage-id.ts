/**
 * Single trust boundary for V2 filesystem path segments.
 * V2 case/run/artifact IDs originate from renderer IPC, model orchestration,
 * imported records and disk scans; never treat them as relative paths.
 */
const SAFE_SEGMENT = /^[A-Za-z0-9][A-Za-z0-9._-]{0,127}$/

export function assertSafeReviewStorageId(
  value: unknown,
  kind: 'caseId' | 'runId' | 'nodeId' = 'caseId',
): asserts value is string {
  if (typeof value !== 'string' || !SAFE_SEGMENT.test(value)
    || value === '.' || value === '..' || value.includes('..')) {
    throw new Error(`非法 ${kind}：只能使用安全的字母数字、单点、下划线或连字符，不能包含路径或 ..`)
  }
}
