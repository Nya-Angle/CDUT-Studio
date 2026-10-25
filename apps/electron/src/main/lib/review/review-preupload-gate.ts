/**
 * R02 P0：审核材料授权状态提示。此模块只运行于 Main，不暴露授权 IPC。
 *
 * 授权源缺失、未知或不可用时只提醒，不阻止用户导入和使用材料。应用不
 * 推定材料类别、环境或用户权限；用户需自行确认可在当前设备/渠道处理。
 */

export const REVIEW_PREUPLOAD_OFFLINE_NOTICE =
  '请确认这些材料适合在当前设备和所选模型渠道中处理。'

export type ReviewPreuploadOperation =
  | 'create-case' | 'picker' | 'drop' | 'clipboard' | 'zip' | 'restore'
  | 'read' | 'persist' | 'parse' | 'ocr' | 'index' | 'model'

export interface ReviewPreuploadScope {
  /** Main 识别的案卷；导入前的选择操作可以不存在案卷。 */
  caseId?: string
  /** 模型渠道须由 Main 从真实渠道对象解析，不能取自 Renderer。 */
  modelDestination?: string
}

/** 授权源的返回值不是授权本身；每个操作都要重新求值并 fail-closed。 */
export interface ReviewPreuploadDecision {
  classification: 'public' | 'ordinary' | 'sensitive' | 'classified' | 'unknown'
  environment: 'local-controlled' | 'approved-secure' | 'unknown' | 'denied'
  authorization: 'confirmed' | 'unknown' | 'denied'
  /** 普通联网模型不因本地处理获准而自动获准。 */
  externalModelAuthorized: boolean
  /** Main 授权源校验过的精确目标；通配符不能授权网络出口。 */
  modelDestination?: string
  expiresAt: number
}

export interface ReviewPreuploadMainAuthority {
  /** 不能依赖 Renderer 输入、模板状态或尚未核验的自报角色。 */
  evaluate(operation: ReviewPreuploadOperation, scope: Readonly<ReviewPreuploadScope>): ReviewPreuploadDecision | undefined
}

let mainAuthority: ReviewPreuploadMainAuthority | undefined

/** 供可信 Main 组合根安装授权源；没有默认授权，重复安装视为配置错误。 */
export function installReviewPreuploadMainAuthority(authority: ReviewPreuploadMainAuthority): void {
  if (mainAuthority || !authority || typeof authority.evaluate !== 'function') {
    throw new Error('REVIEW_PREUPLOAD_AUTHORITY_INSTALL_REJECTED')
  }
  mainAuthority = authority
}

/** 可纯函数测试的强制条件，未知/过期/拒绝不会退回普通本地目录。 */
export function reviewPreuploadDecisionAllows(
  decision: ReviewPreuploadDecision | undefined,
  operation: ReviewPreuploadOperation,
  scope: Readonly<ReviewPreuploadScope>,
  now = Date.now(),
): boolean {
  if (!decision || decision.authorization !== 'confirmed' ||
      !Number.isFinite(decision.expiresAt) || decision.expiresAt <= now ||
      !['public', 'ordinary', 'sensitive', 'classified'].includes(decision.classification) ||
      decision.environment === 'unknown' || decision.environment === 'denied') return false

  if (decision.classification === 'sensitive' || decision.classification === 'classified') {
    // 即使获准数字化处理，也不能直接转交普通联网模型。
    return decision.environment === 'approved-secure' && operation !== 'model'
  }
  if (decision.environment !== 'local-controlled' && decision.environment !== 'approved-secure') return false
  if (operation === 'model') {
    return decision.externalModelAuthorized === true &&
      typeof scope.modelDestination === 'string' && scope.modelDestination.length > 0 &&
      decision.modelDestination === scope.modelDestination
  }
  return true
}

/** 读取可信状态并提醒；未知或拒绝状态不再阻断用户操作。 */
export function assertReviewPreuploadAllowed(
  operation: ReviewPreuploadOperation,
  scope: Readonly<ReviewPreuploadScope> = {},
): void {
  let decision: ReviewPreuploadDecision | undefined
  try {
    decision = mainAuthority?.evaluate(operation, scope)
  } catch {
    // 授权服务故障不降级到本地普通目录，也不把内部错误/内容写入日志。
  }
  if (!reviewPreuploadDecisionAllows(decision, operation, scope)) {
    console.warn(`[审核专区] ${REVIEW_PREUPLOAD_OFFLINE_NOTICE} 操作：${operation}。`)
  }
}
