/**
 * 审核错误的人话化（易用性收口）。
 *
 * 普通用户不该看到 `T05_ACTOR_NOT_ASSIGNED_TO_STAGE`、`t04:[...]` 这类内部标识，
 * 也不该看到 Electron 的 `Error invoking remote method '…': Error: …` 外壳。
 * 这里只做**展示层**翻译：不改变错误语义、不放宽任何门禁，未识别的错误去掉外壳后原样透出，
 * 避免为好看而掩盖真实原因。
 */

/** Electron IPC 包装：`Error invoking remote method 'review-v3:xxx': Error: ` */
const IPC_WRAPPER = /^Error invoking remote method '[^']*':\s*(?:Error:\s*)?/i
/** 开头的大写错误码：只用于程序判断，展示时去掉。 */
const ERROR_CODE_PREFIX = /^[A-Z][A-Z0-9_]{3,}(?::\s*)/

const RULES: Array<{ match: RegExp; text: string }> = [
  { match: /T05_ACTOR_NOT_ASSIGNED_TO_STAGE/, text: '当前身份不能办理这个阶段；请切换到对应身份（初审用审核员，终审用终审教师）' },
  { match: /T05_CURRENT_REAL_RUN_REQUIRED/, text: '还没有针对当前材料的审核运行结果，请先点「按模板规则检查」' },
  { match: /无与当前原件一致的有效审核运行|没有与当前原件一致的有效审核运行/, text: '材料已变化，需要重新检查一次' },
  { match: /T05_REQUIRED_CHECKS_NOT_RESOLVED/, text: '还有检查项没有结论，不能直接通过' },
  { match: /T05_UNRESOLVED_SUPPLEMENTS/, text: '还有补件没有处理完，请先处理补件' },
  { match: /T05_DECISION_REASON_REQUIRED/, text: '请填写处理理由，便于后续追溯' },
  // 只有错误体就是光秃秃一个错误码时才翻译；带具体原因的保留原因，只去掉码。
  { match: /^AGENT_DECISION_DISABLED:?\s*$/, text: '这类审核方案只做技术检查，不能代替学校正式审批' },
  { match: /D2 模板失去受控候选资格|这套审核方案只能用于尚未绑定模板的新案卷/,
    text: '这套审核方案只能用于尚未绑定模板的新案卷；当前案卷已绑定其他模板，请新建案卷后再试' },
  { match: /LOCAL_D4_CASE_AND_SCENARIO_REQUIRED/, text: '请先选择审核方案，并确认要审核的对象和场景' },
  { match: /LOCAL_D4_NATIVE_DRAFT_CASE_REQUIRED/, text: '只有尚未开始、也未固定审核任务的草稿案卷才能套用这套方案' },
  { match: /LOCAL_D4_CANDIDATE_NOT_FOUND/, text: '这套审核方案在本机已不可用，请重新选择' },
  { match: /LOCAL_D4_EXISTING_ITEMS/, text: '当前案卷已有审核事项，请为这套方案新建一个草稿案卷' },
  { match: /LOCAL_D4_PLAN_INVALID/, text: '这套方案与当前案卷不匹配，未能安装审核任务；请换一套方案或新建案卷' },
  { match: /LOCAL_D4_STUDENT_FIXTURE_SCOPE_INVALID/, text: '只有学籍信息更正的方案可以使用演示学籍数据' },
  { match: /缺少必需材料|缺少必交材料/, text: '还缺少模板要求的材料，请先上传后再提交' },
  { match: /请先在上方「材料槽」/, text: '请先选择材料要归到哪一项要求下' },
  { match: /T07_STATE_NOT_INITIALIZED/, text: '这个批次还没有开始评分，请先点「建立评分轮次」' },
  { match: /REVISION_CONFLICT|VERSION_CONFLICT/, text: '这条记录刚被其他操作更新，请刷新后重试' },
  { match: /T04_BINDING_SET_MISMATCH|T04_CHECK_BINDING_MISSING/, text: '模板规则与本次检查范围不一致，请重新发布模板后再试' },
]

/** 把 Error 或字符串转换成面向用户的一句话；未识别时保留去掉外壳后的原文。 */
export function humanizeReviewError(error: unknown): string {
  const raw = (error instanceof Error ? error.message : String(error ?? ''))
    .replace(IPC_WRAPPER, '')
    .trim()
  if (!raw) return ''
  // 「错误码 + 具体原因」：保留 Main 已经写好的可读原因，只去掉错误码。
  if (raw.startsWith('LOCAL_D4_TEMPLATE_ALREADY_BOUND')) {
    const detail = raw.replace(/^LOCAL_D4_TEMPLATE_ALREADY_BOUND:\s*/, '')
    return detail === raw ? '当前案卷已绑定其他审核模板，请新建一个未绑定模板的案卷后再试'
      : detail
  }
  for (const rule of RULES) {
    if (rule.match.test(raw)) return rule.text
  }
  return raw.replace(ERROR_CODE_PREFIX, '').trim() || raw
}
