/**
 * 审核错误的人话化（易用性收口）。
 *
 * 普通用户不该看到 `T05_ACTOR_NOT_ASSIGNED_TO_STAGE`、`t04:[...]` 这类内部标识。
 * 这里只做**展示层**翻译：不改变错误语义、不放宽任何门禁，未识别的错误原样透出，
 * 避免为好看而掩盖真实原因。
 */

const RULES: Array<{ match: RegExp; text: string }> = [
  { match: /T05_ACTOR_NOT_ASSIGNED_TO_STAGE/, text: '当前身份不能办理这个阶段；请切换到对应身份（初审用审核员，终审用终审教师）' },
  { match: /T05_CURRENT_REAL_RUN_REQUIRED/, text: '还没有针对当前材料的审核运行结果，请先点「按模板规则检查」' },
  { match: /无与当前原件一致的有效审核运行|没有与当前原件一致的有效审核运行/, text: '材料已变化，需要重新检查一次' },
  { match: /T05_REQUIRED_CHECKS_NOT_RESOLVED/, text: '还有检查项没有结论，不能直接通过' },
  { match: /T05_UNRESOLVED_SUPPLEMENTS/, text: '还有补件没有处理完，请先处理补件' },
  { match: /T05_DECISION_REASON_REQUIRED/, text: '请填写处理理由，便于后续追溯' },
  { match: /AGENT_DECISION_DISABLED/, text: '技术预审案卷不能形成正式业务决定；请改用已发布的业务模板' },
  { match: /缺少必需材料|缺少必交材料/, text: '还缺少模板要求的材料，请先上传后再提交' },
  { match: /请先在上方「材料槽」/, text: '请先选择材料要归到哪一项要求下' },
  { match: /T07_STATE_NOT_INITIALIZED/, text: '这个批次还没有开始评分，请先点「建立评分轮次」' },
  { match: /REVISION_CONFLICT|VERSION_CONFLICT/, text: '这条记录刚被其他操作更新，请刷新后重试' },
  { match: /T04_BINDING_SET_MISMATCH|T04_CHECK_BINDING_MISSING/, text: '模板规则与本次检查范围不一致，请重新发布模板后再试' },
]

/** 把 Error 或字符串转换成面向用户的一句话；未识别时保留原文。 */
export function humanizeReviewError(error: unknown): string {
  const raw = error instanceof Error ? error.message : String(error ?? '')
  for (const rule of RULES) {
    if (rule.match.test(raw)) return rule.text
  }
  return raw
}
