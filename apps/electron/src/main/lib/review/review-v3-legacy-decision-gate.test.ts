import { describe, expect, test } from 'bun:test'
import type { CaseAggregateV2 } from '@profer/shared'
import { CommandValidationError } from './case-store-v2'
import { assertLegacyDecisionWritable } from './review-v3-legacy-decision-gate'

const aggregate = (parts: Record<string, unknown>): CaseAggregateV2 => parts as unknown as CaseAggregateV2

describe('F07 两条实现去重后的旧决定写入边界', () => {
  test('原生创建回执即使不在首位、案卷投影已损坏也拒绝降级为 V2', () => {
    const input = aggregate({
      receiptLog: [{ type: 'OtherCommand' }, { type: 'CreateNativeWorkspaceCaseV3' }],
      caseV2: { documents: null },
    })
    expect(() => assertLegacyDecisionWritable(input)).toThrow(CommandValidationError)
  })

  test('原生 V3 技术 Run 不得走旧决定/申诉路径', () => {
    expect(() => assertLegacyDecisionWritable(aggregate({ v3TechnicalExecution: { runId: 'run-v3' } }))).toThrow()
    expect(() => assertLegacyDecisionWritable(aggregate({ v3ReviewRun: { id: 'run-pi' } }))).toThrow()
  })

  test('迁移案卷绑定 CanonicalPlan 后拒绝旧写入', () => {
    let code: string | undefined
    try {
      assertLegacyDecisionWritable(aggregate({ canonicalPlan: { planId: 'plan-v3' } }))
    } catch (error) {
      code = (error as CommandValidationError).code
    }
    expect(code).toBe('INVALID_TRANSITION')
  })

  test('D2 冻结技术预审不产生旧正式决定', () => {
    expect(() => assertLegacyDecisionWritable(aggregate({ d2RuntimePlan: { fingerprint: 'd2' } }))).toThrow()
  })

  test('没有 V3 权威身份的历史 V2 案卷仍可由旧业务规则进一步判定', () => {
    expect(() => assertLegacyDecisionWritable(aggregate({ receiptLog: [{ type: 'CreateCaseFromTemplate' }] }))).not.toThrow()
  })
})
