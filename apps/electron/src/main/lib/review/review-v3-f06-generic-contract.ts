/**
 * F06 公共兜底的固定检查合同。这里只生成本机技术初审责任，绝不生成校方政策。
 * 固定事实检查仅核对已提交材料；用户追加的业务要求和制度适用性始终待核实。
 */
import type { B1AuthorDocument, B1Obligation } from './review-template-plan-adapter-v3-b1'

export const F06_FACT_CHECKS = [
  {
    checkKey: 'f06-application-scope',
    requirement: '从已读取的申请材料识别实际申请事项、申请主体和办理目的，逐一核对是否与本机用户声明的审核对象一致。缺少真实申报事项、存在多事项混杂或无法确认归属时，列为待补件/待人工确认；仅可评价材料事实，不能推断业务资格或审批通过。',
  },
  {
    checkKey: 'f06-evidence-consistency',
    requirement: '逐份核对本案已提交材料中可定位的姓名、日期、金额、事项、有效期及相互引用。只有真实原件版本和可读取的准确出处才能支持事实一致/矛盾结论；扫描件不可读、来源不一致或信息缺失时列出具体缺口，不得按零值或默认通过处理。',
  },
  {
    checkKey: 'f06-material-gaps',
    requirement: '根据本机用户明确声明的审核目的和材料清单，核对实际提交了什么、哪些部分缺失或无法读取，形成可操作的补件建议。清单未给出或必需性无可靠依据时只提出待确认问题；不得臆造学校强制材料或因少量非关键缺件自动拒绝初审。',
  },
] as const

export const F06_POLICY_CHECK = {
  checkKey: 'f06-policy-basis',
  requirement: '识别用户提供的依据文件及其具体出处、适用主体、生效时间和版本；辨别它是用户材料、候选制度还是经校方认证的有效政策。当前通用技术初审未取得校方政策发行权，制度真实性、适用性、阈值和批准权限一律待人工核实；不得据此声称符合校规、具备资格或正式通过。',
} as const

export const F06_REQUIRED_CHECKS = [...F06_FACT_CHECKS, F06_POLICY_CHECK] as const

export function isF06FactCheck(checkKey: string, requirement: string): boolean {
  return F06_FACT_CHECKS.some(check => check.checkKey === checkKey && check.requirement === requirement)
}

export function f06AuthorityFor(checkKey: string, requirement: string): 'request-scope' | 'unverified-policy' {
  return isF06FactCheck(checkKey, requirement) ? 'request-scope' : 'unverified-policy'
}

/** Main 使用它防止不可信 Renderer 把自拟“校规”伪装成固定事实检查。 */
export function assertF06AuthorContract(author: B1AuthorDocument): void {
  const module = author.modules.find(item => item.moduleId === 'f06-generic-review')
  if (!module || author.modules.length !== 1 || author.targets.length !== 1 || !author.targets[0]?.objectKey.trim()) {
    throw new Error('F06_GENERIC_SCOPE_OR_MODULE_INVALID')
  }
  const checks = module.checks
  const sourceIds = author.sources.map(source => source.sourceId)
  const targetKey = author.targets[0]!.targetKey
  if (checks.length < F06_REQUIRED_CHECKS.length || checks.length > F06_REQUIRED_CHECKS.length + 30 ||
      new Set(checks.map(check => check.checkKey)).size !== checks.length ||
      checks.some(check => check.sourceIds.length !== sourceIds.length ||
        check.sourceIds.some(id => !sourceIds.includes(id)) ||
        check.targetKeys.length !== 1 || check.targetKeys[0] !== targetKey ||
        check.condition.kind !== 'always')) {
    throw new Error('F06_GENERIC_CHECK_BINDING_INVALID')
  }
  for (const required of F06_REQUIRED_CHECKS) {
    const actual = checks.find(check => check.checkKey === required.checkKey)
    if (!actual || actual.requirement !== required.requirement) {
      throw new Error('F06_GENERIC_REQUIRED_CHECK_TAMPERED: ' + required.checkKey)
    }
  }
  const custom = checks.filter(check => !F06_REQUIRED_CHECKS.some(fixed => fixed.checkKey === check.checkKey))
  if (custom.some((check, index) => check.checkKey !== `f06-request-${index + 1}` ||
    !check.requirement.trim() || check.requirement.length > 2000)) {
    throw new Error('F06_GENERIC_CUSTOM_CHECK_INVALID')
  }
}

/** 历史数据只读不变；Main 新装入的兜底计划必须使用 F06 合同。 */
export function assertF06InstallContract(author: B1AuthorDocument): boolean {
  const fallback = author.templateId.startsWith('fallback-')
  const f06 = author.modules.some(module => module.moduleId === 'f06-generic-review')
  if (f06 && !fallback) throw new Error('F06_FALLBACK_TEMPLATE_REQUIRED')
  if (fallback) {
    if (!f06) throw new Error('F06_GENERIC_CONTRACT_REQUIRED')
    assertF06AuthorContract(author)
  }
  return f06
}

export function makeF06Obligations(
  requests: readonly string[], sourceIds: readonly string[], targetKey: string,
): B1Obligation[] {
  const fixed = F06_REQUIRED_CHECKS.map(check => ({ ...check }))
  return [...fixed, ...requests.map((requirement, index) => ({
    checkKey: `f06-request-${index + 1}`, requirement,
  }))].map(check => ({
    ...check, sourceIds: [...sourceIds], targetKeys: [targetKey],
    condition: { kind: 'always' as const }, responsibility: '本机技术初审核验',
  }))
}
