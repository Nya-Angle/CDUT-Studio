/**
 * 旧 V2 决定/申诉写入边界。原生创建回执是不可降级的所有权凭据：
 * 即使案卷投影损坏而无法通过完整 V3 结构校验，也不能退回旧 V2 决定链。
 * 本函数只阻断旧写入；真实 V3 决定仍须走 T05/F13 的独立权限校验。
 */
import type { CaseAggregateV2 } from '@profer/shared'
import { CommandValidationError } from './case-store-v2'

export function assertLegacyDecisionWritable(aggregate: CaseAggregateV2): void {
  const nativeReceipt = aggregate.receiptLog?.some(receipt =>
    receipt?.type === 'CreateNativeWorkspaceCaseV3') ?? false
  if (nativeReceipt || aggregate.v3ReviewRun || aggregate.v3TechnicalExecution) {
    throw new CommandValidationError('INVALID_TRANSITION',
      '原生 V3 案卷或已有 V3 权威 Run 的案卷必须使用 T05 可信阶段决定，不允许旧 V2 决定/申诉入口改写结论')
  }
  if (aggregate.canonicalPlan) {
    throw new CommandValidationError('INVALID_TRANSITION',
      '已有冻结 CanonicalPlan 的案卷必须使用可信 T05 决定，不得回退旧 V2 写入')
  }
  if (aggregate.d2RuntimePlan) {
    throw new CommandValidationError('AGENT_DECISION_DISABLED',
      'D2 技术预审无正式决定权，禁止旧 V2 伪 Run 决定')
  }
}
