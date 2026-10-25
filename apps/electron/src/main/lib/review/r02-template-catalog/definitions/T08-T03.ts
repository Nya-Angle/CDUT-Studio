import type { TemplateVersion } from '@profer/shared'

export interface R02CriterionMetadata {
  sectionId: string
  criterionId: string
  sourceIds: string[]
  evidenceStatus: 'VERIFIED' | 'PARTIAL' | 'UNCONFIRMED'
}

export interface R02Metadata {
  templateId: string
  name: string
  sourceDocumentPath: string
  researchSourcePath: string
  sourceDocumentSha256: string
  sourceDocumentBytes: number
  manifestExpectedBytes: number
  manifestExpectedSha256: string
  sourceIntegrityStatus: 'LINE_ENDING_DRIFT_ONE_LF' | 'REVIEWED_COPY_PATCHED' | 'MATCH'
  sourceIntegrityNote: string
  officialSchoolTemplate: false
  researchStatus: string
  researchEvidenceStatus: 'VERIFIED' | 'PARTIAL' | 'UNCONFIRMED'
  policyEvidenceStatus: 'VERIFIED' | 'PARTIAL' | 'UNCONFIRMED'
  sourceRecordCount: number
  sourceIds: string[]
  fieldCount: number
  materialSlotCount: number
  criterionCount: number
  criteria: R02CriterionMetadata[]
}

/** V3 native draft definition; intentionally not registered/published by this batch. */
export const templateVersion: TemplateVersion = {
  "templateId": "T08-T03",
  "version": 1,
  "schemaVersion": 2,
  "name": "项目聘用人员续聘、期限、岗位和薪酬调整审核",
  "description": "项目聘用人员续聘、期限、岗位和薪酬调整审核。本地研究模板 · 非校方正式模板。政策证据状态：PARTIAL；仅用于事实提取、差异提示和人工复核，不产生学校正式决定。",
  "catalogKind": "builtin",
  "sourceNote": "R02_RESEARCH_TEMPLATE_NONOFFICIAL: 本模板由 R02 研究 Markdown 转换；非校方正式模板。SRC 仅是研究来源索引，不是案卷 SourceRef。所有校内政策、权限、法律关系或正式决定未确认时必须人工复核。",
  "objectType": "person",
  "displayName": {
    "template": "项目聘用人员续聘、期限、岗位和薪酬调整审核（本地研究案卷）"
  },
  "fields": [
    {
      "key": "F001",
      "label": "唯一案卷号（F001）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段字典摘录：F001 | ID；唯一案卷号 | Case | P0 起 | T | 案卷主记录 | L1 | N. 此为本地研究字段，不代表学校表单必填；缺失、来源失联、不可读、冲突和政策未知须分别记录，不得把未知默认为 false 或通过。"
    },
    {
      "key": "F002",
      "label": "案卷修订号及锁定快照（F002）",
      "kind": "number",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段字典摘录：F002 | 整数；案卷修订号及锁定快照 | Case | P0～P6 | T | Case 版本日志 | L1 | N. 此为本地研究字段，不代表学校表单必填；缺失、来源失联、不可读、冲突和政策未知须分别记录，不得把未知默认为 false 或通过。"
    },
    {
      "key": "F003",
      "label": "A/B/C/D/E/F/G 子情形（F003）",
      "kind": "multi",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段字典摘录：F003 | 枚举数组；A/B/C/D/E/F/G 子情形 | Case | P1 | U→T 核定 | 申请意向中子事项选择 | L1 | N；歧义 H. 此为本地研究字段，不代表学校表单必填；缺失、来源失联、不可读、冲突和政策未知须分别记录，不得把未知默认为 false 或通过。"
    },
    {
      "key": "F004",
      "label": "当前 P0～P6/PX 阶段（F004）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段字典摘录：F004 | 枚举；当前 P0～P6/PX 阶段 | Case | 全程 | T | 工作流事件序列 | L1 | N. 此为本地研究字段，不代表学校表单必填；缺失、来源失联、不可读、冲突和政策未知须分别记录，不得把未知默认为 false 或通过。"
    },
    {
      "key": "F005",
      "label": "提交者（F005）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段字典摘录：F005 | 机构唯一 ID；提交者 | Case | P1 | T 认证 | 实际登录会话与审计 | L2 | N. 此为本地研究字段，不代表学校表单必填；缺失、来源失联、不可读、冲突和政策未知须分别记录，不得把未知默认为 false 或通过。"
    },
    {
      "key": "F006",
      "label": "本人/代办/项目组提交权（F006）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段字典摘录：F006 | 类型＋授权引用；本人/代办/项目组提交权 | Case | P1～P2 | H/D，U 辅助 | 组织权限记录/代理授权 | L2 | Q/H. 此为本地研究字段，不代表学校表单必填；缺失、来源失联、不可读、冲突和政策未知须分别记录，不得把未知默认为 false 或通过。"
    },
    {
      "key": "F007",
      "label": "既有受聘人（F007）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段字典摘录：F007 | 机构人员标识；既有受聘人 | Person | P0 起 | H | 人事主档或合同主体身份 | L2 | N/S. 此为本地研究字段，不代表学校表单必填；缺失、来源失联、不可读、冲突和政策未知须分别记录，不得把未知默认为 false 或通过。"
    },
    {
      "key": "F008",
      "label": "身份号码脱敏摘要、曾用名/更名链（F008）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段字典摘录：F008 | 结构；身份号码脱敏摘要、曾用名/更名链 | Person | P0～P2 按差异 | H；W 辅助 | 原合同身份段、可信变更证明 | L3 | 条件 N/S，冲突 H. 此为本地研究字段，不代表学校表单必填；缺失、来源失联、不可读、冲突和政策未知须分别记录，不得把未知默认为 false 或通过。"
    },
    {
      "key": "F009",
      "label": "项目层面/校级/派遣/正式/博士后/不明（F009）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段字典摘录：F009 | 枚举；项目层面/校级/派遣/正式/博士后/不明 | Employment | P0～P2 | H＋原合同 | 用工类别记录、招录结果 | L2 | N/S/H. 此为本地研究字段，不代表学校表单必填；缺失、来源失联、不可读、冲突和政策未知须分别记录，不得把未知默认为 false 或通过。"
    },
    {
      "key": "F010",
      "label": "实际法定雇主/签约方（F010）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段字典摘录：F010 | 机构标识；实际法定雇主/签约方 | Employment | P0、P5 | H/D＋合同 | 原合同甲方、授权台账 | L2 | N/H. 此为本地研究字段，不代表学校表单必填；缺失、来源失联、不可读、冲突和政策未知须分别记录，不得把未知默认为 false 或通过。"
    },
    {
      "key": "F011",
      "label": "原招录/首次聘用有效结果（F011）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段字典摘录：F011 | 引用；原招录/首次聘用有效结果 | Employment | P0～P2 | H，邻接 S/T | 有效初聘决定 ID/档案 | L2 | Q/S. 此为本地研究字段，不代表学校表单必填；缺失、来源失联、不可读、冲突和政策未知须分别记录，不得把未知默认为 false 或通过。"
    },
    {
      "key": "F012",
      "label": "既有聘约/劳动合同（F012）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段字典摘录：F012 | ID；既有聘约/劳动合同 | Contract | P0 起 | H | 正本编号/备案号 | L2 | N/S. 此为本地研究字段，不代表学校表单必填；缺失、来源失联、不可读、冲突和政策未知须分别记录，不得把未知默认为 false 或通过。"
    },
    {
      "key": "F013",
      "label": "固定/无固定/任务期/协议或未知（F013）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段字典摘录：F013 | 枚举；固定/无固定/任务期/协议或未知 | Contract | P0～P2 | H＋原合同 | 合同期限及性质条款 | L2 | N/H. 此为本地研究字段，不代表学校表单必填；缺失、来源失联、不可读、冲突和政策未知须分别记录，不得把未知默认为 false 或通过。"
    },
    {
      "key": "F014",
      "label": "合同生效状态、最新有效版及签署证据（F014）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段字典摘录：F014 | 结构；合同生效状态、最新有效版及签署证据 | Contract | P0～P6 | H/D | 合同正本、补充协议链 | L2 | N/S/冲突 H. 此为本地研究字段，不代表学校表单必填；缺失、来源失联、不可读、冲突和政策未知须分别记录，不得把未知默认为 false 或通过。"
    },
    {
      "key": "F015",
      "label": "原约定起始日（F015）",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段字典摘录：F015 | date；原约定起始日 | Contract | P0～P2 | H | 原合同期限条款 | L2 | N. 此为本地研究字段，不代表学校表单必填；缺失、来源失联、不可读、冲突和政策未知须分别记录，不得把未知默认为 false 或通过。"
    },
    {
      "key": "F016",
      "label": "原约定截止日或无固定期限标志（F016）",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段字典摘录：F016 | date；原约定截止日或无固定期限标志 | Contract | P0～P2 | H | 原合同期限条款 | L2 | N；无固定期限不可伪造日期. 此为本地研究字段，不代表学校表单必填；缺失、来源失联、不可读、冲突和政策未知须分别记录，不得把未知默认为 false 或通过。"
    },
    {
      "key": "F017",
      "label": "现岗位、职责、地点、任务（F017）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段字典摘录：F017 | 结构；现岗位、职责、地点、任务 | Contract | C、E、P2 | H/P＋合同 | 岗位职责附件/现行岗位档案 | L2 | C 条件 N/S. 此为本地研究字段，不代表学校表单必填；缺失、来源失联、不可读、冲突和政策未知须分别记录，不得把未知默认为 false 或通过。"
    },
    {
      "key": "F018",
      "label": "现劳动报酬条款、周期和构成（F018）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段字典摘录：F018 | 结构；现劳动报酬条款、周期和构成 | Contract | D、E、P2 | H＋合同/C 辅 | 工资条款与可信薪酬台账 | L2 | D 条件 N/S. 此为本地研究字段，不代表学校表单必填；缺失、来源失联、不可读、冲突和政策未知须分别记录，不得把未知默认为 false 或通过。"
    },
    {
      "key": "F019",
      "label": "同一雇主历史工龄、续订次数、特殊续延线索（F019）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段字典摘录：F019 | 结构；同一雇主历史工龄、续订次数、特殊续延线索 | Contract | A/B2、P2 | H | 历次合同/劳动关系记录 | L2/L3 | 条件 Q/H；非 AI 定性. 此为本地研究字段，不代表学校表单必填；缺失、来源失联、不可读、冲突和政策未知须分别记录，不得把未知默认为 false 或通过。"
    },
    {
      "key": "F020",
      "label": "申请理由、工作必要性（F020）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段字典摘录：F020 | 文字＋佐证引用；申请理由、工作必要性 | Proposal | P1 | U/P/W | 本次申请提案/项目说明 | L1/L2 | N. 此为本地研究字段，不代表学校表单必填；缺失、来源失联、不可读、冲突和政策未知须分别记录，不得把未知默认为 false 或通过。"
    },
    {
      "key": "F021",
      "label": "拟新起始日（F021）",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段字典摘录：F021 | date/未定；拟新起始日 | Proposal | A/B/E、P1 | U/W | 变更建议条款 | L2 | 条件 N. 此为本地研究字段，不代表学校表单必填；缺失、来源失联、不可读、冲突和政策未知须分别记录，不得把未知默认为 false 或通过。"
    },
    {
      "key": "F022",
      "label": "拟新截止日（F022）",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段字典摘录：F022 | date/无限期标记；拟新截止日 | Proposal | A/B/E、P1 | U/W | 变更建议条款 | L2 | 条件 N/H. 此为本地研究字段，不代表学校表单必填；缺失、来源失联、不可读、冲突和政策未知须分别记录，不得把未知默认为 false 或通过。"
    },
    {
      "key": "F023",
      "label": "拟岗位/职责/地点与原项差异（F023）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段字典摘录：F023 | 结构；拟岗位/职责/地点与原项差异 | Proposal | C/E、P1 | U/P/W | 调岗/职责提案及比对 | L2 | 条件 N. 此为本地研究字段，不代表学校表单必填；缺失、来源失联、不可读、冲突和政策未知须分别记录，不得把未知默认为 false 或通过。"
    },
    {
      "key": "F024",
      "label": "拟薪酬条款（F024）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段字典摘录：F024 | 金额＋币种＋频次＋结构；拟薪酬条款 | Proposal | D/E、P1 | U/P/W | 调薪建议、成本草算 | L2 | 条件 N. 此为本地研究字段，不代表学校表单必填；缺失、来源失联、不可读、冲突和政策未知须分别记录，不得把未知默认为 false 或通过。"
    },
    {
      "key": "F025",
      "label": "建议条款生效日（可以与签署日不同）（F025）",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段字典摘录：F025 | date；建议条款生效日（可以与签署日不同） | Proposal | B/C/D/E、P1 | U/W，最终 D | 提案/新合同条款 | L2 | N/H；追溯人工. 此为本地研究字段，不代表学校表单必填；缺失、来源失联、不可读、冲突和政策未知须分别记录，不得把未知默认为 false 或通过。"
    },
    {
      "key": "F026",
      "label": "本人知悉/同意/反对/未表示（F026）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段字典摘录：F026 | 枚举＋时间；本人知悉/同意/反对/未表示 | Proposal | P1～P5 | W＋后续 D | 真实意思表示、签约文本 | L2 | P1 Q，P5 N/H；不同于正式签名. 此为本地研究字段，不代表学校表单必填；缺失、来源失联、不可读、冲突和政策未知须分别记录，不得把未知默认为 false 或通过。"
    },
    {
      "key": "F027",
      "label": "关联任务（F027）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段字典摘录：F027 | 项目 ID 列表；关联任务 | Project | P0～P2 | P | 项目立项/任务书及账套 | L1 | N/S；非项目人士例外 H. 此为本地研究字段，不代表学校表单必填；缺失、来源失联、不可读、冲突和政策未知须分别记录，不得把未知默认为 false 或通过。"
    },
    {
      "key": "F028",
      "label": "项目期限、执行状态、任务版本（F028）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段字典摘录：F028 | 结构；项目期限、执行状态、任务版本 | Project | A～F、P2 | P | 任务书/科研系统快照 | L1 | 条件 N/S. 此为本地研究字段，不代表学校表单必填；缺失、来源失联、不可读、冲突和政策未知须分别记录，不得把未知默认为 false 或通过。"
    },
    {
      "key": "F029",
      "label": "项目负责人（F029）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段字典摘录：F029 | ID＋有效区间；项目负责人 | Project | P2 | P | 正式项目人员表/变更记录 | L2 | 条件 N/S. 此为本地研究字段，不代表学校表单必填；缺失、来源失联、不可读、冲突和政策未知须分别记录，不得把未知默认为 false 或通过。"
    },
    {
      "key": "F030",
      "label": "纵向/横向/校级/多源/其他资金类型（F030）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段字典摘录：F030 | 枚举；纵向/横向/校级/多源/其他资金类型 | Fund | P2 | C/P | 经费管理类别/账簿 | L1 | 条件 N/S. 此为本地研究字段，不代表学校表单必填；缺失、来源失联、不可读、冲突和政策未知须分别记录，不得把未知默认为 false 或通过。"
    },
    {
      "key": "F031",
      "label": "经费号、可支出账户、预算版本（F031）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段字典摘录：F031 | 结构；经费号、可支出账户、预算版本 | Fund | P2 | C | 经费台账、项目预算快照 | L2 | 条件 N/S. 此为本地研究字段，不代表学校表单必填；缺失、来源失联、不可读、冲突和政策未知须分别记录，不得把未知默认为 false 或通过。"
    },
    {
      "key": "F032",
      "label": "拟变更成本、社保/公积金及覆盖期间（F032）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段字典摘录：F032 | 金额结构；拟变更成本、社保/公积金及覆盖期间 | Fund | A/D/E/F、P2 | C/P 复核草算 | 人员成本测算与有效底账 | L2 | 条件 N/H，算法待校本. 此为本地研究字段，不代表学校表单必填；缺失、来源失联、不可读、冲突和政策未知须分别记录，不得把未知默认为 false 或通过。"
    },
    {
      "key": "F033",
      "label": "经费可承担/审核结论（F033）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段字典摘录：F033 | 引用＋状态；经费可承担/审核结论 | Fund | P2～P4 | C/D | 真实经费审核或财务确认记录 | L2 | Q/S/H；不可代替签约. 此为本地研究字段，不代表学校表单必填；缺失、来源失联、不可读、冲突和政策未知须分别记录，不得把未知默认为 false 或通过。"
    },
    {
      "key": "F034",
      "label": "岗位、招录、项目、离岗及财务权威决定（F034）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段字典摘录：F034 | 引用集合；岗位、招录、项目、离岗及财务权威决定 | Case | P0～P4 | 相邻业务可信主体 | 他案决定 ID、版本和效力 | L1/L2 | 条件 S/H；G50/R02 待核. 此为本地研究字段，不代表学校表单必填；缺失、来源失联、不可读、冲突和政策未知须分别记录，不得把未知默认为 false 或通过。"
    },
    {
      "key": "F035",
      "label": "实际签批/签约人（F035）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段字典摘录：F035 | 权威 actorId＋角色/委托授权版本；实际签批/签约人 | Decision | P4～P5 | H/D，不能 U | 可信审批记录、授权台账 | L2 | L→N/H. 此为本地研究字段，不代表学校表单必填；缺失、来源失联、不可读、冲突和政策未知须分别记录，不得把未知默认为 false 或通过。"
    },
    {
      "key": "F036",
      "label": "正式人事决定状态、条件与范围（F036）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段字典摘录：F036 | 枚举；正式人事决定状态、条件与范围 | Decision | P4 后 | D | 经核签批及正式文书 | L2 | L→N/H；不得 AI 生成. 此为本地研究字段，不代表学校表单必填；缺失、来源失联、不可读、冲突和政策未知须分别记录，不得把未知默认为 false 或通过。"
    },
    {
      "key": "F037",
      "label": "续订或变更正式文本/修订号（F037）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段字典摘录：F037 | 引用集合；续订或变更正式文本/修订号 | Decision | P5 后 | D/H | 双方签署合同及法律有效副本 | L2 | L→N/H. 此为本地研究字段，不代表学校表单必填；缺失、来源失联、不可读、冲突和政策未知须分别记录，不得把未知默认为 false 或通过。"
    },
    {
      "key": "F038",
      "label": "批准、双方签署、法律生效时点（F038）",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段字典摘录：F038 | datetime 组；批准、双方签署、法律生效时点 | Decision | P4～P6 | D/H | 批件、签名页、合同效力条款 | L2 | L→N/H. 此为本地研究字段，不代表学校表单必填；缺失、来源失联、不可读、冲突和政策未知须分别记录，不得把未知默认为 false 或通过。"
    },
    {
      "key": "F039",
      "label": "撤回/异议/复核请求（F039）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段字典摘录：F039 | 类型＋理由＋时间；撤回/异议/复核请求 | Dispute | PX | W/T | 本次请求及本人核验记录 | L2 | 未触发 NOT_APPLICABLE；触发 N. 此为本地研究字段，不代表学校表单必填；缺失、来源失联、不可读、冲突和政策未知须分别记录，不得把未知默认为 false 或通过。"
    },
    {
      "key": "F040",
      "label": "文档 hash、来源版本、取代关系、依赖结论（F040）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段字典摘录：F040 | 证据链对象；文档 hash、来源版本、取代关系、依赖结论 | Evidence | 全程 | T/H/P/C | 证据注册簿、旧新版对照 | L1/L2 | N；冲突 H. 此为本地研究字段，不代表学校表单必填；缺失、来源失联、不可读、冲突和政策未知须分别记录，不得把未知默认为 false 或通过。"
    },
    {
      "key": "F041",
      "label": "SRC 版本、核验时间、身份（F041）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段字典摘录：F041 | SRC 版本、核验时间、身份/批次适用性、有效性结论 | Policy | P2～P4 | 已核政策＋人事确认 | 04 节来源索引/正式政策原件 | L0/L1 | Q/H；不可默认现行. 此为本地研究字段，不代表学校表单必填；缺失、来源失联、不可读、冲突和政策未知须分别记录，不得把未知默认为 false 或通过。"
    },
    {
      "key": "F042",
      "label": "缺项、负责主体、要求时间、阶段（F042）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段字典摘录：F042 | 待办对象；缺项、负责主体、要求时间、阶段 | Case | P2～PX | T＋有权经办人 | 问题与待办审计记录 | L1/L2 | N；法定期限 Q. 此为本地研究字段，不代表学校表单必填；缺失、来源失联、不可读、冲突和政策未知须分别记录，不得把未知默认为 false 或通过。"
    },
    {
      "key": "F043",
      "label": "争议、法定续延、保护性情形的待核标记（F043）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段字典摘录：F043 | 结构；争议、法定续延、保护性情形的待核标记 | Employment | A2/B2/P2 | H/法务 | 经授权人事/法务意见 M024 | L3 | 条件 H，禁止自动裁量. 此为本地研究字段，不代表学校表单必填；缺失、来源失联、不可读、冲突和政策未知须分别记录，不得把未知默认为 false 或通过。"
    },
    {
      "key": "F044",
      "label": "已执行工资的月份、金额、账户/工资表版本（F044）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段字典摘录：F044 | 结构；已执行工资的月份、金额、账户/工资表版本 | Fund | D2/P2～P6 | C/H | 历史发薪账/工资条 | L2/L3 | 条件 S/H；不得外推欠薪. 此为本地研究字段，不代表学校表单必填；缺失、来源失联、不可读、冲突和政策未知须分别记录，不得把未知默认为 false 或通过。"
    },
    {
      "key": "F045",
      "label": "正式合同文本交付、归档及实际薪酬同步回执（F045）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段字典摘录：F045 | 引用；正式合同文本交付、归档及实际薪酬同步回执 | Decision | P6 | H/C/D | 归档台账/书面交付与付款回执 | L2 | L→N/S. 此为本地研究字段，不代表学校表单必填；缺失、来源失联、不可读、冲突和政策未知须分别记录，不得把未知默认为 false 或通过。"
    },
    {
      "key": "F046",
      "label": "期满后继续实际工作起止、雇主知悉/提出异议时间与证据、有无法定续延事实线索（F046）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段字典摘录：F046 | 结构；期满后继续实际工作起止、雇主知悉/提出异议时间与证据、有无法定续延事实线索 | Employment | A2/P0～P2 条件触发 | H/P/C 正式核证，W 陈述辅助 | 期满后的排班/考勤或工作任务签认、用工管理书面沟通与核实时间线 M025 | L2/L3 | 条件 N/S；异议真伪与效力 H. 此为本地研究字段，不代表学校表单必填；缺失、来源失联、不可读、冲突和政策未知须分别记录，不得把未知默认为 false 或通过。"
    }
  ],
  "materialSlots": [
  {
    "id": "M001",
    "name": "M001 原始有效聘约",
    "purpose": "原始有效聘约；证明合法签约方、原期限、岗位和劳动报酬；H/用工主体、本人可持副本；受聘双方签署合同正本/档案核证件；当 P0；人事可信合同记录或授权保管人核验副本可替代重复上传。原件未规定业务数量上限；槽位 maxCount 使用宽松技术上限，不构成政策阈值。SRC 仅为研究索引，不作为案卷附件或 SourceRef。",
    "acceptedKinds": [
      "pdf",
      "image",
      "office",
      "sheet",
      "text"
    ],
    "minCount": 0,
    "maxCount": 2147483647,
    "requiredElements": [
      "F007",
      "F009",
      "F010",
      "F012"
    ],
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M002",
    "name": "M002 历次补充协议与合同续订链",
    "purpose": "历次补充协议与合同续订链；排除旧版覆盖、确认同一合同实际效力；H/本人；版本化协议、续订/变更合同及登记链；条（曾变更或版本冲突）；H 出具历史合同清单可替代本人逐份上载。原件未规定业务数量上限；槽位 maxCount 使用宽松技术上限，不构成政策阈值。SRC 仅为研究索引，不作为案卷附件或 SourceRef。",
    "acceptedKinds": [
      "pdf",
      "image",
      "office",
      "sheet",
      "text"
    ],
    "minCount": 0,
    "maxCount": 2147483647,
    "requiredElements": [
      "F012",
      "F040"
    ],
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M003",
    "name": "M003 在职人事身份/用工主体记录",
    "purpose": "在职人事身份/用工主体记录；同名同人、身份种类、实际雇主；H；人员主档与入职有效记录、必要的证件核验结果；当 P0；可用合同档案＋有权人事核证记录，不要求重复上传身份证扫描件。原件未规定业务数量上限；槽位 maxCount 使用宽松技术上限，不构成政策阈值。SRC 仅为研究索引，不作为案卷附件或 SourceRef。",
    "acceptedKinds": [
      "pdf",
      "image",
      "office",
      "sheet",
      "text"
    ],
    "minCount": 0,
    "maxCount": 2147483647,
    "requiredElements": [
      "F005",
      "F043"
    ],
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M004",
    "name": "M004 申请意向/条款差异稿",
    "purpose": "申请意向/条款差异稿；指定要变什么及为什么；本人/项目组提交；申请说明、拟议合同条款对照或草稿；当 P1；可信业务系统录入内容可替代表格；未找到校方 T08-T03 专用表。原件未规定业务数量上限；槽位 maxCount 使用宽松技术上限，不构成政策阈值。SRC 仅为研究索引，不作为案卷附件或 SourceRef。",
    "acceptedKinds": [
      "pdf",
      "image",
      "office",
      "sheet",
      "text"
    ],
    "minCount": 0,
    "maxCount": 2147483647,
    "requiredElements": [
      "F003",
      "F020"
    ],
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M005",
    "name": "M005 劳动者意思表示",
    "purpose": "劳动者意思表示；员工知悉提议、是否同意或反对；本人/W；可核的确认、会议记录、真实签名或协商记录；条 P2/P5：项目组代提且员工未陈述时 P2 补；正式签约用 M018/019 替代初步意向。原件未规定业务数量上限；槽位 maxCount 使用宽松技术上限，不构成政策阈值。SRC 仅为研究索引，不作为案卷附件或 SourceRef。",
    "acceptedKinds": [
      "pdf",
      "image",
      "office",
      "sheet",
      "text"
    ],
    "minCount": 0,
    "maxCount": 2147483647,
    "requiredElements": [
      "F007",
      "F026",
      "F038"
    ],
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M006",
    "name": "M006 团队继续用工/岗位调整说明",
    "purpose": "团队继续用工/岗位调整说明；说明项目任务与用工必要性；项目负责人/P；项目组业务说明、任务与工作量依据；条 A/C/E/F；已有可信项目申请/岗位职责记录可复用。原件未规定业务数量上限；槽位 maxCount 使用宽松技术上限，不构成政策阈值。SRC 仅为研究索引，不作为案卷附件或 SourceRef。",
    "acceptedKinds": [
      "pdf",
      "image",
      "office",
      "sheet",
      "text"
    ],
    "minCount": 0,
    "maxCount": 2147483647,
    "requiredElements": [
      "F020",
      "F023",
      "F027"
    ],
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M007",
    "name": "M007 项目任务书与有效状态",
    "purpose": "项目任务书与有效状态；项目身份、任务及工作期；科研管理/P；正式立项、任务书及批准变更、项目人员记录；条（项目聘用/由项目承担成本）；可信科研档案为首选，勿强迫申请人重复上传。原件未规定业务数量上限；槽位 maxCount 使用宽松技术上限，不构成政策阈值。SRC 仅为研究索引，不作为案卷附件或 SourceRef。",
    "acceptedKinds": [
      "pdf",
      "image",
      "office",
      "sheet",
      "text"
    ],
    "minCount": 0,
    "maxCount": 2147483647,
    "requiredElements": [
      "F027",
      "F034"
    ],
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M008",
    "name": "M008 经费账号/额度/准用事实",
    "purpose": "经费账号/额度/准用事实；证明具体资金来源可承担，而不是工资已生效；财务/C；经费账簿、预算/余额/用途限制的有权查询；条 A/D/E/F；财务部门核证凭证或受控记录代替个人截图。原件未规定业务数量上限；槽位 maxCount 使用宽松技术上限，不构成政策阈值。SRC 仅为研究索引，不作为案卷附件或 SourceRef。",
    "acceptedKinds": [
      "pdf",
      "image",
      "office",
      "sheet",
      "text"
    ],
    "minCount": 0,
    "maxCount": 2147483647,
    "requiredElements": [
      "F030",
      "F031",
      "F033"
    ],
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M009",
    "name": "M009 原岗位职责/现行工作安排",
    "purpose": "原岗位职责/现行工作安排；证明调岗前基线；H/P；原岗位职责书、合同附件、正式岗位任务；条 C/E；有效人事岗位记录可替代。原件未规定业务数量上限；槽位 maxCount 使用宽松技术上限，不构成政策阈值。SRC 仅为研究索引，不作为案卷附件或 SourceRef。",
    "acceptedKinds": [
      "pdf",
      "image",
      "office",
      "sheet",
      "text"
    ],
    "minCount": 0,
    "maxCount": 2147483647,
    "requiredElements": [
      "F017",
      "F023"
    ],
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M010",
    "name": "M010 原薪酬约定及工资档案",
    "purpose": "原薪酬约定及工资档案；原劳动报酬基线、区分工资与绩效/劳务费；H/C；合同报酬条款、可信薪资记录；条 D/E/D2；合同中完整报酬条款与人事薪资台账互证。原件未规定业务数量上限；槽位 maxCount 使用宽松技术上限，不构成政策阈值。SRC 仅为研究索引，不作为案卷附件或 SourceRef。",
    "acceptedKinds": [
      "pdf",
      "image",
      "office",
      "sheet",
      "text"
    ],
    "minCount": 0,
    "maxCount": 2147483647,
    "requiredElements": [
      "F018",
      "F024",
      "F044"
    ],
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M011",
    "name": "M011 调整成本与期间测算",
    "purpose": "调整成本与期间测算；对应拟工资、社保公积金、岗位期和项目期；P/C；项目成本估算和财务复核说明；条 A/D/E/F；可信财务测算/经费负责人的书面说明。原件未规定业务数量上限；槽位 maxCount 使用宽松技术上限，不构成政策阈值。SRC 仅为研究索引，不作为案卷附件或 SourceRef。",
    "acceptedKinds": [
      "pdf",
      "image",
      "office",
      "sheet",
      "text"
    ],
    "minCount": 0,
    "maxCount": 2147483647,
    "requiredElements": [
      "F024",
      "F028"
    ],
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M012",
    "name": "M012 邻接权威决定/结论",
    "purpose": "邻接权威决定/结论；引用已批准岗位、初聘、项目变更等，防重复审批；相邻 Owner；带真实 Decision ID、签发主体、效力状态与版本的归档记录；条（需要依赖相邻决定）；可信系统或有权档案部门查询替代再次上传。原件未规定业务数量上限；槽位 maxCount 使用宽松技术上限，不构成政策阈值。SRC 仅为研究索引，不作为案卷附件或 SourceRef。",
    "acceptedKinds": [
      "pdf",
      "image",
      "office",
      "sheet",
      "text"
    ],
    "minCount": 0,
    "maxCount": 2147483647,
    "requiredElements": [
      "F011",
      "F014",
      "F034"
    ],
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M013",
    "name": "M013 更名/身份差异证明",
    "purpose": "更名/身份差异证明；解释姓名、编号、曾用名不一致；本人/H；有权机关更名凭证或经人事核验的身份沿革；条（身份冲突）；由 H 的核证记录替代完整证件外传。原件未规定业务数量上限；槽位 maxCount 使用宽松技术上限，不构成政策阈值。SRC 仅为研究索引，不作为案卷附件或 SourceRef。",
    "acceptedKinds": [
      "pdf",
      "image",
      "office",
      "sheet",
      "text"
    ],
    "minCount": 0,
    "maxCount": 2147483647,
    "requiredElements": [
      "F007",
      "F008",
      "F010"
    ],
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M014",
    "name": "M014 新岗位资格/安全要求",
    "purpose": "新岗位资格/安全要求；专业资格、安全培训或岗位适配；项目/学院/H；仅当实际岗位有规定时的资格/培训/准入记录；条 C（具体岗位法定/校本要求已证实才必需）；有权机关核证替代扫描件。原件未规定业务数量上限；槽位 maxCount 使用宽松技术上限，不构成政策阈值。SRC 仅为研究索引，不作为案卷附件或 SourceRef。",
    "acceptedKinds": [
      "pdf",
      "image",
      "office",
      "sheet",
      "text"
    ],
    "minCount": 0,
    "maxCount": 2147483647,
    "requiredElements": [
      "F023",
      "F041",
      "F043"
    ],
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M015",
    "name": "M015 多项目分摊说明",
    "purpose": "多项目分摊说明；人员成本分配、各项目时段和责任边界；P/C；有权项目/财务确认的分摊依据与经费明细；条 F2/C2；正式账务记录可替代项目组 Excel 自说。原件未规定业务数量上限；槽位 maxCount 使用宽松技术上限，不构成政策阈值。SRC 仅为研究索引，不作为案卷附件或 SourceRef。",
    "acceptedKinds": [
      "pdf",
      "image",
      "office",
      "sheet",
      "text"
    ],
    "minCount": 0,
    "maxCount": 2147483647,
    "requiredElements": [
      "F027",
      "F040"
    ],
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M016",
    "name": "M016 法务/人事特殊风险核验意见",
    "purpose": "法务/人事特殊风险核验意见；合同性质、过期、缩期、追溯工资与保护情形的人工判断；H/法务；专业核验记录或正式书面意见；条 A2/B2/D2/劳动关系不明；有权机构审查可替代独立意见书。原件未规定业务数量上限；槽位 maxCount 使用宽松技术上限，不构成政策阈值。SRC 仅为研究索引，不作为案卷附件或 SourceRef。",
    "acceptedKinds": [
      "pdf",
      "image",
      "office",
      "sheet",
      "text"
    ],
    "minCount": 0,
    "maxCount": 2147483647,
    "requiredElements": [
      "F013",
      "F019",
      "F025",
      "F043",
      "F044"
    ],
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M017",
    "name": "M017 内部审批/授权记录",
    "purpose": "内部审批/授权记录；证明学校内部批准（如制度要求）及决定者权源；有权部门/D；正式审批单、经核授权决定记录；后 P4；需校本制度核其是否必要、何机构签发；不可要求 P1 已提供。原件未规定业务数量上限；槽位 maxCount 使用宽松技术上限，不构成政策阈值。SRC 仅为研究索引，不作为案卷附件或 SourceRef。",
    "acceptedKinds": [
      "pdf",
      "image",
      "office",
      "sheet",
      "text"
    ],
    "minCount": 0,
    "maxCount": 2147483647,
    "requiredElements": [
      "F035",
      "F036",
      "F038"
    ],
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M018",
    "name": "M018 已签续订合同",
    "purpose": "已签续订合同；证明续订双方签署和内容；H/劳动者；有效续订劳动合同正本/核证副本；后 P5，限 A/E 续订；等效合法双方签署合同文本，不接受单方预签草稿。原件未规定业务数量上限；槽位 maxCount 使用宽松技术上限，不构成政策阈值。SRC 仅为研究索引，不作为案卷附件或 SourceRef。",
    "acceptedKinds": [
      "pdf",
      "image",
      "office",
      "sheet",
      "text"
    ],
    "minCount": 0,
    "maxCount": 2147483647,
    "requiredElements": [
      "F021",
      "F022",
      "F026",
      "F037",
      "F038"
    ],
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M019",
    "name": "M019 已签书面变更协议",
    "purpose": "已签书面变更协议；证明期限、岗位、报酬条款变更内容与协商一致；H/双方；正式书面补充协议或合法新合同；后 P5，限 B/C/D/E；可一份合同覆盖多条款但应逐项明确。原件未规定业务数量上限；槽位 maxCount 使用宽松技术上限，不构成政策阈值。SRC 仅为研究索引，不作为案卷附件或 SourceRef。",
    "acceptedKinds": [
      "pdf",
      "image",
      "office",
      "sheet",
      "text"
    ],
    "minCount": 0,
    "maxCount": 2147483647,
    "requiredElements": [
      "F021",
      "F035"
    ],
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M020",
    "name": "M020 合同交付、归档及人员主档同步",
    "purpose": "合同交付、归档及人员主档同步；证明合同文本已正式登记并向双方提供；H/D；合同归档台账、交付签收或可核送达记录；后 P6；受控人事记录可替代另交纸件。原件未规定业务数量上限；槽位 maxCount 使用宽松技术上限，不构成政策阈值。SRC 仅为研究索引，不作为案卷附件或 SourceRef。",
    "acceptedKinds": [
      "pdf",
      "image",
      "office",
      "sheet",
      "text"
    ],
    "minCount": 0,
    "maxCount": 2147483647,
    "requiredElements": [
      "F014",
      "F038",
      "F045"
    ],
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M021",
    "name": "M021 工资/社保/经费支付执行凭证",
    "purpose": "工资/社保/经费支付执行凭证；证明某期真实执行金额与列支；C/H；工资台账、财务酬金记录及相关社保账项；后 P6；可信财务记录优先，不要求工资卡流水全量外传。原件未规定业务数量上限；槽位 maxCount 使用宽松技术上限，不构成政策阈值。SRC 仅为研究索引，不作为案卷附件或 SourceRef。",
    "acceptedKinds": [
      "pdf",
      "image",
      "office",
      "sheet",
      "text"
    ],
    "minCount": 0,
    "maxCount": 2147483647,
    "requiredElements": [
      "F044",
      "F045"
    ],
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M022",
    "name": "M022 撤回、异议或复核请求",
    "purpose": "撤回、异议或复核请求；证明已有人提起、为何提起；本人/W/T；经核身份的请求及争议事实；条 PX（有人提出后才产生）；可信系统原请求可替代扫描文书。原件未规定业务数量上限；槽位 maxCount 使用宽松技术上限，不构成政策阈值。SRC 仅为研究索引，不作为案卷附件或 SourceRef。",
    "acceptedKinds": [
      "pdf",
      "image",
      "office",
      "sheet",
      "text"
    ],
    "minCount": 0,
    "maxCount": 2147483647,
    "requiredElements": [
      "F039",
      "F040",
      "F042"
    ],
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M023",
    "name": "M023 撤回/复核的有权处理结果",
    "purpose": "撤回/复核的有权处理结果；证明是否受理、处理和效力；有权复核机关/D；真实处理通知/决定、送达记录；后 PX 决定形成后；机构权威记录优先。原件未规定业务数量上限；槽位 maxCount 使用宽松技术上限，不构成政策阈值。SRC 仅为研究索引，不作为案卷附件或 SourceRef。",
    "acceptedKinds": [
      "pdf",
      "image",
      "office",
      "sheet",
      "text"
    ],
    "minCount": 0,
    "maxCount": 2147483647,
    "requiredElements": [
      "F036",
      "F045"
    ],
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M024",
    "name": "M024 特殊劳动关系事实核验",
    "purpose": "特殊劳动关系事实核验；法定续订/续延、保护情形或解除争议所需的最小核证；H/法务；受控人事核验结论，不默认索取诊断书等高度敏感原件；条 A2/B2/其它法定争议；尽量由合法人事/法务出具是否触发及理由摘要。原件未规定业务数量上限；槽位 maxCount 使用宽松技术上限，不构成政策阈值。SRC 仅为研究索引，不作为案卷附件或 SourceRef。",
    "acceptedKinds": [
      "pdf",
      "image",
      "office",
      "sheet",
      "text"
    ],
    "minCount": 0,
    "maxCount": 2147483647,
    "requiredElements": [
      "F019",
      "F043"
    ],
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M025",
    "name": "M025 期满后持续工作与用工异议事实",
    "purpose": "期满后持续工作与用工异议事实；证明截止后实际工作时段、雇主是否/何时知情和是否提出异议；H/项目用工管理机关，劳动者可供佐证；有权机构核证的考勤/任务签收/用工沟通/书面异议记录；仅限争议时间范围；条 A2 且存在继续用工主张；可信考勤或由 H 核证的有效业务事实替代个人自制截图；不是 R009 届满前通用必交。原件未规定业务数量上限；槽位 maxCount 使用宽松技术上限，不构成政策阈值。SRC 仅为研究索引，不作为案卷附件或 SourceRef。",
    "acceptedKinds": [
      "pdf",
      "image",
      "office",
      "sheet",
      "text"
    ],
    "minCount": 0,
    "maxCount": 2147483647,
    "requiredElements": [
      "F016",
      "F019",
      "F043",
      "F044",
      "F046"
    ],
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M026",
    "name": "M026 代办权限与本人授权核证",
    "purpose": "代办权限与本人授权核证；当第三人代提案时核实其是否被本案这一事项、此合同、此期间合法授权；H/正式用工受理机关，必要时本人 W；经核的代理授权文书或可信组织授权记录、本人确认（具体校方可接受的授权形式待政策核定）；条 P1/P2 且非本人代办；受控授权台账可合法替代重复扫描件；本人亲自提交时不触发，不能因“项目负责人”头衔豁免。原件未规定业务数量上限；槽位 maxCount 使用宽松技术上限，不构成政策阈值。SRC 仅为研究索引，不作为案卷附件或 SourceRef。",
    "acceptedKinds": [
      "pdf",
      "image",
      "office",
      "sheet",
      "text"
    ],
    "minCount": 0,
    "maxCount": 2147483647,
    "requiredElements": [
      "F005",
      "F006",
      "F007",
      "F012",
      "F040"
    ],
    "allowReuseAcrossSubjects": false
  }
],
  "sections": [
    {
      "id": "R02_RESEARCH_RULES",
      "name": "逐条事实核验",
      "description": "逐条对应 T08-T03 原文 §08 的 R 规则。此分项是研究检查项，不是学校政策；SRC IDs 只保存在 r02Metadata，不得作为案卷 SourceRef。条件性阶段、例外与校本规则待确认时转人工。",
      "order": 0,
      "required": true,
      "criteria": [
        {
          "id": "R001",
          "title": "R001 · 既有关系入口 P0/P1",
          "requirement": "原文规则行： **R001 既有关系入口** P0/P1 ； 真＝提议修改既有项目聘约；假＝明确首次招聘或正式编制/博士后事项；未知＝关系无法确证 ； SRC-001/002/003/007；F001/002/004/007/009/012/040；M001/003 ； 以人事核证关系种类及原合同 ID 对应本案主体；以申请时点的有效状态为准；招聘公告只证明用工类别，不证明特定人已录用 ； 假→`NOT_APPLICABLE` 并路由相邻事项；无合同事实 `NEEDS_MATERIAL`，H 源失联 `SOURCE_UNAVAILABLE`；本人身份/性质争议 `NEEDS_HUMAN_DECISION` → H/用工机构 。执行边界：只核验本案可追溯事实与来源版本；SRC 是研究来源索引，不是案卷材料 SourceRef。若政策现行性、适用身份、签发权限、法律关系或事实真伪未证，结果必须保持待确认/人工复核；不得自动批准、拒绝、签约、解除、任命或回写学校系统。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R002",
          "title": "R002 · 个人身份及法定雇主绑定 P0/P2",
          "requirement": "原文规则行： **R002 个人身份及法定雇主绑定** P0/P2 ； 真＝合同人与人事主档、实际雇主应对应；假＝有权机构确证不存在同一关系；未知＝同名、曾用名或多个雇主 ； SRC-007/013；F005/007/008/010；M001/003/013 ； 比唯一人员号、合同甲乙方、合法更名链和聘用期间；H/签约原件高于 OCR 姓名及工资表，跨雇主须另核法律关系 ； 姓名不一但有效更名证明可 `PASS_FACT`；人号冲突 `CONFLICT`，更名证明缺 `NEEDS_MATERIAL`，多单位法律责任 `NEEDS_HUMAN_DECISION` → H/法务 。执行边界：只核验本案可追溯事实与来源版本；SRC 是研究来源索引，不是案卷材料 SourceRef。若政策现行性、适用身份、签发权限、法律关系或事实真伪未证，结果必须保持待确认/人工复核；不得自动批准、拒绝、签约、解除、任命或回写学校系统。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R003",
          "title": "R003 · 提交者/代理真实性 P1/P2",
          "requirement": "原文规则行： **R003 提交者/代理真实性** P1/P2 ； 真＝提交者以本人或代理名义操作；假＝可信记录证明不主张代办；未知＝仅有前端自填 `role` ； SRC-001/002（仅首招角色）、SRC-007、校本授权待核；F005/006/F007/F012；M003/026（**非本人代理才激活 M026**） ； 受控登录主体与机构代理授权、本人身份及本合同范围逐一绑定；R003 不得将 M012（相邻业务决定）错当代理授权 ； 本人实名提交的身份事实可核，但**是否具备校内正式发起权限仍可能 `POLICY_UNCONFIRMED`**；代理缺授权 `NEEDS_MATERIAL`、有争议 `NEEDS_HUMAN_DECISION` → H/受理经办人 。执行边界：只核验本案可追溯事实与来源版本；SRC 是研究来源索引，不是案卷材料 SourceRef。若政策现行性、适用身份、签发权限、法律关系或事实真伪未证，结果必须保持待确认/人工复核；不得自动批准、拒绝、签约、解除、任命或回写学校系统。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R004",
          "title": "R004 · 合同法律性质与签约方 P0/P2",
          "requirement": "原文规则行： **R004 合同法律性质与签约方** P0/P2 ； 真＝现有劳动合同/聘用协议需识别性质；假＝权威确认为其他独立业务；未知＝派遣、外包或协议性质不明 ； SRC-001/002/003/007/013；F009/010/011/013/034；M001/003/012 ； 核合同标题**及实质主体/管理方式**、招录决定、H 档和期间；不能只据“科研助理”四字认定劳动关系 ； 学校层面与项目层面分源；第三方签约不按学校内部批准，性质争议 `NEEDS_HUMAN_DECISION`；有效初聘决定来源断开 `SOURCE_UNAVAILABLE` → H/法务或相邻 Owner 。执行边界：只核验本案可追溯事实与来源版本；SRC 是研究来源索引，不是案卷材料 SourceRef。若政策现行性、适用身份、签发权限、法律关系或事实真伪未证，结果必须保持待确认/人工复核；不得自动批准、拒绝、签约、解除、任命或回写学校系统。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R005",
          "title": "R005 · 原合同基线与有效版本 P0/P2",
          "requirement": "原文规则行： **R005 原合同基线与有效版本** P0/P2 ； 真＝存在原合同或历次修订；假＝经正式核证不存在既有合同、转 R001；未知＝多份互斥文本 ； SRC-007/013；F012～016/F019/F040；M001/002 ； 按签署方/授权、签约时间、法律生效时间、版本前驱与后继确定拟议日有效条款；**不得按文件名或最后上传排序** ； 无固定期限不填虚假截止日；证据缺链 `NEEDS_MATERIAL`、有效版本不一致 `CONFLICT`、法律效力不明 `NEEDS_HUMAN_DECISION` → H/法务 。执行边界：只核验本案可追溯事实与来源版本；SRC 是研究来源索引，不是案卷材料 SourceRef。若政策现行性、适用身份、签发权限、法律关系或事实真伪未证，结果必须保持待确认/人工复核；不得自动批准、拒绝、签约、解除、任命或回写学校系统。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R006",
          "title": "R006 · 提案范围与原拟条款可比性 P1/P2",
          "requirement": "原文规则行： **R006 提案范围与原拟条款可比性** P1/P2 ； 真＝A/B/C/D/E 某条款被提议改变；假＝可信比对该条款未改变；未知＝拟变更内容不完整 ； SRC-007；F003/F017/018/F020～025；M004/001/009/010（后两者仅触发时） ； 以 M004 当前版对照 R005 的原合同版，逐子项比较日期、岗位职责地点、税前/税后及工资周期、拟效力日；每个子项单独 `targetId` ； 不得从备注“延一年”生成未知完整日期；缺关键原/拟值 `NEEDS_MATERIAL`，文字歧义 `NEEDS_HUMAN_DECISION` → 提议人/经办人 。执行边界：只核验本案可追溯事实与来源版本；SRC 是研究来源索引，不是案卷材料 SourceRef。若政策现行性、适用身份、签发权限、法律关系或事实真伪未证，结果必须保持待确认/人工复核；不得自动批准、拒绝、签约、解除、任命或回写学校系统。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R007",
          "title": "R007 · 劳动者真实意向事实 P2/P5",
          "requirement": "原文规则行： **R007 劳动者真实意向事实** P2/P5 ； 真＝收到本人对**本版拟议条款**的同意/拒绝表示；假＝经核本人尚未表示；未知＝代理代签/来源不明 ； SRC-007 第 16/35 条；F007/F026/F038；M004/005（P5 另核 M018/019） ； 证实身份、意见对象的提案版本和时间；P2 意见只证明协商过程，P5 有效签署另见 R024/025 ； P1 本人未表态不一概报缺件；P2 项目组代提且联系不上本人 `NEEDS_MATERIAL`，真实性异常 `NEEDS_HUMAN_DECISION`；反对不自动等于正式拒绝 → 本人/H 。执行边界：只核验本案可追溯事实与来源版本；SRC 是研究来源索引，不是案卷材料 SourceRef。若政策现行性、适用身份、签发权限、法律关系或事实真伪未证，结果必须保持待确认/人工复核；不得自动批准、拒绝、签约、解除、任命或回写学校系统。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R008",
          "title": "R008 · 适用政策/批次与现行性 P2/P4",
          "requirement": "原文规则行： **R008 适用政策/批次与现行性** P2/P4 ； 真＝拟使用某招聘批次、法律或校本条件；假＝已证实该条件与本案身份/期间无关；未知＝文件现行性或适用范围不明 ； SRC-001/002/003/004/007/009/013；F009/F013/F041；M001/003/007（岗位条件再用 M014） ； 逐条比机构、受聘类别、批次、发布日期/生效日/适用期间；国家法和校本规章分层；历史编内规定、单批次阈值不得跨用 ； SRC-002“至少六个月”、SRC-003“一年”、SRC-009“三年”**不能直接定规则**；无现行校本变更条件 `POLICY_UNCONFIRMED` → H/政策维护责任人 。执行边界：只核验本案可追溯事实与来源版本；SRC 是研究来源索引，不是案卷材料 SourceRef。若政策现行性、适用身份、签发权限、法律关系或事实真伪未证，结果必须保持待确认/人工复核；不得自动批准、拒绝、签约、解除、任命或回写学校系统。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R009",
          "title": "R009 · 续订史与法定保护线索 P2/A1/A2/B1（涉及累积延长期时）",
          "requirement": "原文规则行： **R009 续订史与法定保护线索** P2/A1/A2/B1（涉及累积延长期时） ； 真＝A1/A2 续订或 B1 延长触发历史续订/累计延长期复核；假＝现事项与续延史无关；未知＝既往记录残缺 ； SRC-007 第 14/45 条、SRC-013 第 8～10 条；F013/F015/016/F019/F021/022/F043；M001/002/016/024 ； 核同一雇主历次固定期、约定自动续延、累计延长期及拟续日；只提取风险触发，法定是否必须无固定期限由 H/法务定性 ； 不能因某批次原为一年就自动续一年；续订史缺 `NEEDS_MATERIAL`/H 源断 `SOURCE_UNAVAILABLE`，权利效果 `NEEDS_HUMAN_DECISION` → H/法务 。执行边界：只核验本案可追溯事实与来源版本；SRC 是研究来源索引，不是案卷材料 SourceRef。若政策现行性、适用身份、签发权限、法律关系或事实真伪未证，结果必须保持待确认/人工复核；不得自动批准、拒绝、签约、解除、任命或回写学校系统。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R010",
          "title": "R010 · 期满后继续实际用工 P0/P2/A2",
          "requirement": "原文规则行： **R010 期满后继续实际用工** P0/P2/A2 ； 真＝原合同期满且有关持续工作、支付、雇主异议事实；假＝有可信证据证实未继续工作；未知＝工作/异议/延期记录不全 ； SRC-007 第 10/14/44/45 条、SRC-013 第 7～11 条；F014/016/019/F043/044/F046；M001/002/003/010/016/024/025 ； 核期满日后实际工作期间及雇主有无异议，关注 SRC-013 第 11 条“超过一个月”等**司法风险判据**；司法解释第 8 条法定续延需另核 ； 不因已过期自动认定合同失效或自动批准补签；事实不足 `NEEDS_MATERIAL`，法律效果 `NEEDS_HUMAN_DECISION` → H/法务，必要时劳动争议渠道 。执行边界：只核验本案可追溯事实与来源版本；SRC 是研究来源索引，不是案卷材料 SourceRef。若政策现行性、适用身份、签发权限、法律关系或事实真伪未证，结果必须保持待确认/人工复核；不得自动批准、拒绝、签约、解除、任命或回写学校系统。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R011",
          "title": "R011 · 期限条款差异与日期可达性 P1/P2/B1",
          "requirement": "原文规则行： **R011 期限条款差异与日期可达性** P1/P2/B1 ； 真＝提议改始末日、合同期限性质；假＝未改期限；未知＝缺原日期/拟日期 ； SRC-007 第 16/35 条、SRC-013 第 10 条；F013～016/F019/F021/022/F025/F028；M001/002/004/005/007 ； 比原/拟起止、前后继关系、合同约定效力及项目任务期；识别跨期与倒置，不以项目到期自动裁断合同终止 ； 无固定期限不套数字期限；累计延长的法律影响交 R009；日期倒置 `CONFLICT`，项目期冲突需人工核定 `NEEDS_HUMAN_DECISION` → H/项目 Owner 。执行边界：只核验本案可追溯事实与来源版本；SRC 是研究来源索引，不是案卷材料 SourceRef。若政策现行性、适用身份、签发权限、法律关系或事实真伪未证，结果必须保持待确认/人工复核；不得自动批准、拒绝、签约、解除、任命或回写学校系统。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R012",
          "title": "R012 · 缩期是否实质解除/终止 P2/B2",
          "requirement": "原文规则行： **R012 缩期是否实质解除/终止** P2/B2 ； 真＝拟截止日早于原截止或提出单方停止用工；假＝仅合理延长；未知＝合同期或提议性质不清 ； SRC-007 第 36～46 条、SRC-013 第 16～18 条；F016/F019/F022/F025/F043；M001/002/004/005/016/024 ； 逐条核原法律关系、提出方、提前结束的业务事实及法定保护线索；书面提案不能当作员工同意解除 ； 不是普通“修改一个日期”自动批准；解除/补偿/保护情形 `NEEDS_HUMAN_DECISION` 并转对应 Owner；原期冲突 `CONFLICT` → H/法务 。执行边界：只核验本案可追溯事实与来源版本；SRC 是研究来源索引，不是案卷材料 SourceRef。若政策现行性、适用身份、签发权限、法律关系或事实真伪未证，结果必须保持待确认/人工复核；不得自动批准、拒绝、签约、解除、任命或回写学校系统。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R013",
          "title": "R013 · 调岗、职责和地点差异 P2/C1",
          "requirement": "原文规则行： **R013 调岗、职责和地点差异** P2/C1 ； 真＝合同工作内容或地点发生变化；假＝可信两版条款确无变化；未知＝旧职责缺失 ； SRC-001/002（招聘事实）、SRC-007 第 17/35 条；F017/F020/F023/F025/F026；M001/004/005/006/009 ； 以原聘约和有效岗位附件对照拟职责、地点、开始日期；项目负责人说明证明需求，不证明雇主有权单改 ； 岗位名相同但职责地点变仍为真；旧岗位记录缺 `NEEDS_MATERIAL`，同意或工作条件争议 `NEEDS_HUMAN_DECISION` → H/用工机构 。执行边界：只核验本案可追溯事实与来源版本；SRC 是研究来源索引，不是案卷材料 SourceRef。若政策现行性、适用身份、签发权限、法律关系或事实真伪未证，结果必须保持待确认/人工复核；不得自动批准、拒绝、签约、解除、任命或回写学校系统。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R014",
          "title": "R014 · 岗位特殊资格/安全前置 P2/C1",
          "requirement": "原文规则行： **R014 岗位特殊资格/安全前置** P2/C1 ； 真＝**已由现行有效适用规则证实**拟岗位有特定资格或安全要求；假＝权威规则确认无该要求；未知＝仅见招聘广告要求 ； SRC-001/002/007、适用校本准入制度尚缺；F023/F041/F043；M006/014 ； 核规则生效期、具体岗位 ID 与证书有效期；优先岗位主管部门核证，不要求一般调岗案重交体检心理等 ； 无校本来源不创造证书/考试分数；未知 `POLICY_UNCONFIRMED`，触发且真实记录缺 `NEEDS_MATERIAL`，资格实质决定 `NEEDS_HUMAN_DECISION` → 岗位主管/H 。执行边界：只核验本案可追溯事实与来源版本；SRC 是研究来源索引，不是案卷材料 SourceRef。若政策现行性、适用身份、签发权限、法律关系或事实真伪未证，结果必须保持待确认/人工复核；不得自动批准、拒绝、签约、解除、任命或回写学校系统。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R015",
          "title": "R015 · 跨项目、跨雇主及相邻路由 P2/C2",
          "requirement": "原文规则行： **R015 跨项目、跨雇主及相邻路由** P2/C2 ； 真＝项目/资金/实际签约方可能改变；假＝仅同一雇主同项目内调整；未知＝第三方或关联单位身份不清 ； SRC-004/007/013 第 3/10 条、SRC-010 仅技术目录已核、SRC-011/012 未核；F010/F027/029/F034；M001/003/007/012/015（仅 F2） ； 比原合同雇主和拟实施方、项目 ID、实际劳动管理关系及决定引用；**变经费账户不等于变用人单位** ； 新雇主关系或原聘约终止不由本模板再批首次录用；法律主体混同 `NEEDS_HUMAN_DECISION`，相邻 Owner 待政策 `POLICY_UNCONFIRMED` → H/法务及相邻业务 。执行边界：只核验本案可追溯事实与来源版本；SRC 是研究来源索引，不是案卷材料 SourceRef。若政策现行性、适用身份、签发权限、法律关系或事实真伪未证，结果必须保持待确认/人工复核；不得自动批准、拒绝、签约、解除、任命或回写学校系统。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R016",
          "title": "R016 · 原拟薪酬条款差异 P2/D1",
          "requirement": "原文规则行： **R016 原拟薪酬条款差异** P2/D1 ； 真＝拟修改工资、津贴、支付周期或构成；假＝确认未变；未知＝缺基数/税前税后口径 ； SRC-005/007/008；F018/F020/F024/F025/F026；M001/004/005/010 ； 只比相同币种、税前/后、期间及待遇构成；财务账单证明支付事实、合同约定由 H 正本优先 ； 不凭“+10%”直接推定基数；口径缺 `NEEDS_MATERIAL`，旧约定与工资账不一 `CONFLICT`，涨幅是否准许 `POLICY_UNCONFIRMED` → H/财务 。执行边界：只核验本案可追溯事实与来源版本；SRC 是研究来源索引，不是案卷材料 SourceRef。若政策现行性、适用身份、签发权限、法律关系或事实真伪未证，结果必须保持待确认/人工复核；不得自动批准、拒绝、签约、解除、任命或回写学校系统。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R017",
          "title": "R017 · 追溯薪酬与已履行周期 P2/D2",
          "requirement": "原文规则行： **R017 追溯薪酬与已履行周期** P2/D2 ； 真＝拟生效日早于提交/签署或跨已付工资周期；假＝可信记录表明仅未来调整；未知＝工资台账未核 ； SRC-005/007/013；F024/F025/F043/044；M004/010/011/016（P6 另 M021） ； 核拟效力日、实际工期和工资支付周期/账簿历史版本；**原付款不证明合法追溯批准** ； 不自动冲回已结账、推欠薪或造补发凭证；台账差异 `CONFLICT`，追溯权 `NEEDS_HUMAN_DECISION` → H/财务/法务 。执行边界：只核验本案可追溯事实与来源版本；SRC 是研究来源索引，不是案卷材料 SourceRef。若政策现行性、适用身份、签发权限、法律关系或事实真伪未证，结果必须保持待确认/人工复核；不得自动批准、拒绝、签约、解除、任命或回写学校系统。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R018",
          "title": "R018 · 项目身份与任务期 P2/A/C/D/F",
          "requirement": "原文规则行： **R018 项目身份与任务期** P2/A/C/D/F ； 真＝调整与一个或多个科研任务关联；假＝已核为非项目聘用、回 R001；未知＝项目号不明 ； SRC-001/002/004/008；F020/F027～029/F034；M006/007/012 ； 项目真实 ID、状态、任务书版本、负责人及拟用工期间匹配；以科研管理的正式状态高于 PI 口述 ； 项目拟延期、尚未批准不能当已延；项目记录缺 `SOURCE_UNAVAILABLE` 或 `NEEDS_MATERIAL`，期别与合同冲突 `CONFLICT` → 项目/科研管理人 。执行边界：只核验本案可追溯事实与来源版本；SRC 是研究来源索引，不是案卷材料 SourceRef。若政策现行性、适用身份、签发权限、法律关系或事实真伪未证，结果必须保持待确认/人工复核；不得自动批准、拒绝、签约、解除、任命或回写学校系统。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R019",
          "title": "R019 · 经费账号、类别与用途 P2/A/D/F",
          "requirement": "原文规则行： **R019 经费账号、类别与用途** P2/A/D/F ； 真＝拟由项目资金负担人员费用；假＝权威证实由独立用工资金渠道负担，需转其制度；未知＝经费号/类别不实 ； SRC-004 第 1～4/10～13 条、SRC-005/008；F027/F030/031/033；M007/008 ； 逐经费号核批准来源、预算账期、用途与财务可用记录；PI 需求≠财务批准 ； 未经正式核账只可见“待确认”，不能断言可支付；源失联 `SOURCE_UNAVAILABLE`、用途冲突 `CONFLICT`、是否准用 `NEEDS_HUMAN_DECISION` → C/科研管理 。执行边界：只核验本案可追溯事实与来源版本；SRC 是研究来源索引，不是案卷材料 SourceRef。若政策现行性、适用身份、签发权限、法律关系或事实真伪未证，结果必须保持待确认/人工复核；不得自动批准、拒绝、签约、解除、任命或回写学校系统。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R020",
          "title": "R020 · 人员成本与覆盖期间测算 P2/A/D/E/F",
          "requirement": "原文规则行： **R020 人员成本与覆盖期间测算** P2/A/D/E/F ； 真＝期限或工资变化导致期间人工成本；假＝证实本提议无费用影响；未知＝新工资构成或经费期间缺失 ； SRC-004/008；F021～025/F028/F030～033；M004/007/008/011 ； 以提案版×对应月份/社保公积金口径与预算快照关联，校本测算算法需财务核证；成本估算是拟支出而非真实付款 ； 不硬写人头上限、工资涨幅或经费比例；缺关键输入 `NEEDS_MATERIAL`，算法/政策未知 `POLICY_UNCONFIRMED` → PI/C 。执行边界：只核验本案可追溯事实与来源版本；SRC 是研究来源索引，不是案卷材料 SourceRef。若政策现行性、适用身份、签发权限、法律关系或事实真伪未证，结果必须保持待确认/人工复核；不得自动批准、拒绝、签约、解除、任命或回写学校系统。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R021",
          "title": "R021 · 多项目分摊与重复支出 P2/F2",
          "requirement": "原文规则行： **R021 多项目分摊与重复支出** P2/F2 ； 真＝同一工资期间由多个项目承担；假＝权威确认单项目；未知＝多个账套关联未释明 ； SRC-004/005/008；F027/F030～034/F040；M007/008/011/015 ； 按人员/账期/合同版/项目号核分摊金额、比例、用途及重复，使用各项目真实财务版本；不能默认 50:50 ； 两项目同时报同人同月全额 `CONFLICT`；分摊依据缺 `NEEDS_MATERIAL`，跨类型经费准许与否 `NEEDS_HUMAN_DECISION` → C/各 PI 。执行边界：只核验本案可追溯事实与来源版本；SRC 是研究来源索引，不是案卷材料 SourceRef。若政策现行性、适用身份、签发权限、法律关系或事实真伪未证，结果必须保持待确认/人工复核；不得自动批准、拒绝、签约、解除、任命或回写学校系统。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R022",
          "title": "R022 · 相邻 G50/S/T 权威结论引用 P0/P2/P4",
          "requirement": "原文规则行： **R022 相邻 G50/S/T 权威结论引用** P0/P2/P4 ； 真＝本事项需引用初聘、岗位、项目、离岗或预算批准；假＝该依赖未触发；未知＝Owner/有效决定无法确认 ； SRC-010 **技术目录已核、非政策**；SRC-011/012 **原件未取得**；SRC-001/004（背景）；F011/F014/F034/F040；M012 ； 仅比正式 `decisionId+issuer+authority+effectiveStatus+decisionVersion+target`，不重审相邻批准本身；`run@rev`/G50 的 OCR 通过不能充当决定 ； 没有清晰 R02 144 项 Owner 映射必须 `POLICY_UNCONFIRMED`；权威系统失联 `SOURCE_UNAVAILABLE`，跨目标误引 `CONFLICT` → 对应相邻唯一 Owner/集成审核人 。执行边界：只核验本案可追溯事实与来源版本；SRC 是研究来源索引，不是案卷材料 SourceRef。若政策现行性、适用身份、签发权限、法律关系或事实真伪未证，结果必须保持待确认/人工复核；不得自动批准、拒绝、签约、解除、任命或回写学校系统。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R023",
          "title": "R023 · 用工签批权限与正式内部决定 P4",
          "requirement": "原文规则行： **R023 用工签批权限与正式内部决定** P4 ； 真＝学校真实流程要求并已由有权者审议；假＝经适用校本制度证实某内部审批步骤不要求；未知＝变更授权链未证实 ； SRC-001/002（仅首招）、SRC-007、SRC-010（技术边界）/011/012（待核）；F010/F035/036/038/F041；M017 ； 查对本人员/聘约/变更类型/金额/期间具权的正式机关、委托书有效区间、审批事实与签批版本；系统登录态不能代表授权签章 ； P1～P3 `DEFERRED_STAGE`，P4 权限缺现行制度 `POLICY_UNCONFIRMED`；伪冒 signer `NEEDS_HUMAN_DECISION`，缺真实批件才待有权人核实 → H/合法用工主体 。执行边界：只核验本案可追溯事实与来源版本；SRC 是研究来源索引，不是案卷材料 SourceRef。若政策现行性、适用身份、签发权限、法律关系或事实真伪未证，结果必须保持待确认/人工复核；不得自动批准、拒绝、签约、解除、任命或回写学校系统。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R024",
          "title": "R024 · 续订文本的双方真实签署 P5/A1/A2/E",
          "requirement": "原文规则行： **R024 续订文本的双方真实签署** P5/A1/A2/E ； 真＝续聘进入签约；假＝只调岗/调薪且无需续订；未知＝文本/签名真伪未核 ； SRC-007 第 14/16 条、SRC-013 第 9～11 条；F007/F010/F012/F021/022/F026/F035/037/038；M001/018 ； 核续订文本与原聘约/双方人员、主体授权、条款、双方签署时间；H/D 正本优于上传的公章图 ； P1 不索 M018；缺真实签约文本 `NEEDS_MATERIAL`（仅 P5），签名效力 `NEEDS_HUMAN_DECISION`，期限权利争议转法务 → H/签约双方 。执行边界：只核验本案可追溯事实与来源版本；SRC 是研究来源索引，不是案卷材料 SourceRef。若政策现行性、适用身份、签发权限、法律关系或事实真伪未证，结果必须保持待确认/人工复核；不得自动批准、拒绝、签约、解除、任命或回写学校系统。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R025",
          "title": "R025 · 变更协议书面性与范围 P5/B/C/D/E",
          "requirement": "原文规则行： **R025 变更协议书面性与范围** P5/B/C/D/E ； 真＝期限/岗位/薪酬条款进入正式变更；假＝纯续订已有完整新合同且无独立变更；未知＝协议未齐/某子项未写入 ； SRC-007 第 16/35 条；F012/F017/018/F021～026/F035～038；M001/005/019 ； 核双方协商、书面变更文本、与本次各子项逐条对应，原约定及补充协议共同保留；M005 不能代替正式签署 ； P1 不索 M019；只签岗位而称工资也生效 `CONFLICT`，签约权源不明 `NEEDS_HUMAN_DECISION` → H/劳动者/签约人 。执行边界：只核验本案可追溯事实与来源版本；SRC 是研究来源索引，不是案卷材料 SourceRef。若政策现行性、适用身份、签发权限、法律关系或事实真伪未证，结果必须保持待确认/人工复核；不得自动批准、拒绝、签约、解除、任命或回写学校系统。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R026",
          "title": "R026 · 批准、签署、生效三时点一致性 P4～P5",
          "requirement": "原文规则行： **R026 批准、签署、生效三时点一致性** P4～P5 ； 真＝已产生正式人事决定或双方签约；假＝还停 P2 事实预审；未知＝仅扫描章、倒填时间或事件缺链 ； SRC-007/013；F014/F025/F035～038；M017（仅真实流程要求且 P4 已生成）、M018/M019（仅 P5 相应签约已形成） ； 分别记录批准事件、双方最后签字事件、拟约定生效日；比效力范围、授权版本和先后链，不凭付款/单方打印推断合同生效；P4 未签时不以 M018/M019 缺件 ； 约定生效日早于签署不自动判无效或有效；需法务审查 `NEEDS_HUMAN_DECISION`，记载互斥 `CONFLICT` → H/D/法务 。执行边界：只核验本案可追溯事实与来源版本；SRC 是研究来源索引，不是案卷材料 SourceRef。若政策现行性、适用身份、签发权限、法律关系或事实真伪未证，结果必须保持待确认/人工复核；不得自动批准、拒绝、签约、解除、任命或回写学校系统。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R027",
          "title": "R027 · 正式文本交付/人事归档 P6",
          "requirement": "原文规则行： **R027 正式文本交付/人事归档** P6 ； 真＝双方已签书面续订/变更；假＝有权决定终止本次提议且无新合同；未知＝档案未同步 ； SRC-007 第 16/35 条；F014/F037/038/045；M018/019/020 ； 追合同有效版、交付双方的事实、人事档案录入版本与时间；归档发生晚不自动倒推签署无效 ； P1～P5 未到履约节点不报 M020 缺件；P6 无归档证 `NEEDS_MATERIAL`/H 源失联 `SOURCE_UNAVAILABLE` → H/档案保管人 。执行边界：只核验本案可追溯事实与来源版本；SRC 是研究来源索引，不是案卷材料 SourceRef。若政策现行性、适用身份、签发权限、法律关系或事实真伪未证，结果必须保持待确认/人工复核；不得自动批准、拒绝、签约、解除、任命或回写学校系统。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R028",
          "title": "R028 · 履行付款和合同约定对照 P6",
          "requirement": "原文规则行： **R028 履行付款和合同约定对照** P6 ； 真＝有到期工资/经费支付记录需核；假＝未来尚未到支付周期；未知＝财务账不可得 ； SRC-004/005/007/008、SRC-013 第 19 条（社保争议）；F018/F024/F030～033/F037/F044/045；M010/011/019（如适用）/021 ； 以真实人员、合同版、账期、账户与应付口径对照已付/应付事实；付款渠道不等于合同批准；合法支付义务由专业部门定性 ； 历史未付/少付不是 AI 自动给付决定；数字不一致 `CONFLICT`、源失联 `SOURCE_UNAVAILABLE`、法律后果 `NEEDS_HUMAN_DECISION` → H/C/法务 。执行边界：只核验本案可追溯事实与来源版本；SRC 是研究来源索引，不是案卷材料 SourceRef。若政策现行性、适用身份、签发权限、法律关系或事实真伪未证，结果必须保持待确认/人工复核；不得自动批准、拒绝、签约、解除、任命或回写学校系统。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R029",
          "title": "R029 · 撤回请求与既存效力保全 PX",
          "requirement": "原文规则行： **R029 撤回请求与既存效力保全** PX ； 真＝有本人/授权人申请撤回；假＝无人提出；未知＝请求人与目标案/版本不能对应 ； SRC-007、SRC-013（合同法律边界）；F001/F004/F039/F040；M017/018/019（若已有）/022 ； 查请求真实 Actor、申请阶段与是否已双方签约、撤回对象及时间；快照保全旧决定，不删除签署文本 ； P1～P4 是否准撤校本 `POLICY_UNCONFIRMED`；已生效合同转争议/新变更，`NEEDS_HUMAN_DECISION` → 受理机关/H/法务 。执行边界：只核验本案可追溯事实与来源版本；SRC 是研究来源索引，不是案卷材料 SourceRef。若政策现行性、适用身份、签发权限、法律关系或事实真伪未证，结果必须保持待确认/人工复核；不得自动批准、拒绝、签约、解除、任命或回写学校系统。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R030",
          "title": "R030 · 复核受理、真实处理与送达 PX",
          "requirement": "原文规则行： **R030 复核受理、真实处理与送达** PX ； 真＝已提交对事实结果或正式决定的异议；假＝没有复核请求；未知＝仅自称已获复核结论 ； SRC-007、SRC-013，校本复核程序待核；F004/F036～040/F042/F045；M022/023（仅结果生成后） ； 核争议指向的 `ruleId/decisionId+version`、本人授权、处理机关和真实决定/送达；事实重读不等于重作校方批准 ； 复核时限/机关无校本证据 `POLICY_UNCONFIRMED`；M023 未产生时为后续待办；无授权结论 `NEEDS_HUMAN_DECISION` → 有权复核者/法务 。执行边界：只核验本案可追溯事实与来源版本；SRC 是研究来源索引，不是案卷材料 SourceRef。若政策现行性、适用身份、签发权限、法律关系或事实真伪未证，结果必须保持待确认/人工复核；不得自动批准、拒绝、签约、解除、任命或回写学校系统。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R031",
          "title": "R031 · 原始证据可读取性及出处 P0～PX",
          "requirement": "原文规则行： **R031 原始证据可读取性及出处** P0～PX ； 真＝该阶段已激活的材料槽到达核查；假＝槽位条件未触发；未知＝文件损坏/可信来源断开 ； SRC-001～013（各材料所依来源，**其中 SRC-010～012 只涉技术/目录，不作实体法源**）；F001/F040/F042；M001～026（仅当前激活者） ； 每份按文件哈希、来源、页码/单元格、抽取置信及核验方式核；把“扫描有页但不能读”与“本校档案库失联”分开 ； 源不可达 `SOURCE_UNAVAILABLE`，文件不可辨 `UNREADABLE`，真正未提供 `NEEDS_MATERIAL`；不能 OCR 补造签字 → 对应材料保管者/OCR 人工复核人 。执行边界：只核验本案可追溯事实与来源版本；SRC 是研究来源索引，不是案卷材料 SourceRef。若政策现行性、适用身份、签发权限、法律关系或事实真伪未证，结果必须保持待确认/人工复核；不得自动批准、拒绝、签约、解除、任命或回写学校系统。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R032",
          "title": "R032 · 证据变更后的定向事实失效 P1～PX",
          "requirement": "原文规则行： **R032 证据变更后的定向事实失效** P1～PX ； 真＝M/F 原版本被新证据取代、或相邻正式决定更新；假＝文件哈希/权威内容未变；未知＝替换归属和前驱未知 ； SRC-007（真实合同效力边界）、SRC-010（固定目录已核、仅技术）、SRC-011/012（映射未核）；F001/002/F034/F040～042；M002/004/005/007/008/010/011/012/015/018/019/021/023/026（按实际发生） ； 计算 evidence→F→R 依赖闭包，冻结案卷版，保留旧结论与 `SUPERSEDED` 原因；只重算受影响 R，正式 Decision 不随扫描件覆盖而修改 ； 前驱错/归属混乱 `CONFLICT`，权威决定更新须真 issuer 核验 `NEEDS_HUMAN_DECISION`；不受影响的 R 保留当前有效结论 → Case Owner/对应事实保管机关 。执行边界：只核验本案可追溯事实与来源版本；SRC 是研究来源索引，不是案卷材料 SourceRef。若政策现行性、适用身份、签发权限、法律关系或事实真伪未证，结果必须保持待确认/人工复核；不得自动批准、拒绝、签约、解除、任命或回写学校系统。",
          "execution": "manual",
          "targetScope": "subject"
        }
      ]
    }
  ],
  "policyVersionIds": [],
  "stages": [
    {
      "id": "p0",
      "name": "P0 原聘约定位",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "workflowOwner": "local",
      "nextStageId": "p1"
    },
    {
      "id": "p1",
      "name": "P1 意向/提案",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "workflowOwner": "local",
      "nextStageId": "p2"
    },
    {
      "id": "p2",
      "name": "P2 事实核验",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "workflowOwner": "local",
      "nextStageId": "p3"
    },
    {
      "id": "p3",
      "name": "P3 定向补件/协商",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "workflowOwner": "local",
      "nextStageId": "p4"
    },
    {
      "id": "p4",
      "name": "P4 校内有权审议",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "workflowOwner": "local",
      "nextStageId": "p5"
    },
    {
      "id": "p5",
      "name": "P5 协商签订、生效",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "workflowOwner": "local",
      "nextStageId": "p6"
    },
    {
      "id": "p6",
      "name": "P6 履行同步/归档",
      "kind": "handoff",
      "executorRole": "teacher",
      "workflowOwner": "local"
    }
  ],
  "outputs": [
    {
      "id": "fact-review-summary",
      "kind": "item-feedback",
      "audience": "reviewer"
    },
    {
      "id": "targeted-supplement-tasks",
      "kind": "supplement-list",
      "audience": "reviewer"
    }
  ],
  "autoPassPolicy": {
    "enabled": false
  },
  "status": "draft",
  "createdAt": "2026-10-24T03:10:00+08:00"
}

/** Backward-friendly explicit name for the definition object. */
export const template = templateVersion

/** Research provenance only. SRC IDs here are not case evidence SourceRef values. */
export const r02Metadata: R02Metadata = {
  "templateId": "T08-T03",
  "name": "项目聘用人员续聘、期限、岗位和薪酬调整审核",
  "sourceDocumentPath": "docs/design/review-agent/business-templates/R02/T08-T03.md",
  "researchSourcePath": "docs/design/review-agent/business-templates/R02/research-original/T08-T03.md",
  "sourceDocumentSha256": "2b92483e7e92d909fc7d2b60a3ce3172b0474bedb44cf9d8558deb0023899d7b",
  "sourceDocumentBytes": 132712,
  "manifestExpectedBytes": 132713,
  "manifestExpectedSha256": "fddcd21930f18284a8810d3c8cce0f0d7ff0c982b56219b62522df7acb555d39",
  "sourceIntegrityStatus": "LINE_ENDING_DRIFT_ONE_LF",
  "sourceIntegrityNote": "research-original 当前 Git blob 不含末尾 LF；审阅副本按原件正文原样复制，SHA-256/字节数记录当前实际字节。清单 SHA-256 对应原始 blob 追加一个 LF；此差异不表示正文损坏。",
  "officialSchoolTemplate": false,
  "researchStatus": "ROUND4_HANDOFF_REVISE",
  "policyEvidenceStatus": "PARTIAL",
  "sourceRecordCount": 13,
  "fieldCount": 46,
  "materialSlotCount": 26,
  "criterionCount": 32,
  "criteria": [
    {
      "sectionId": "R02_RESEARCH_RULES",
      "criterionId": "R001",
      "sourceIds": [
        "SRC-001",
        "SRC-002",
        "SRC-003",
        "SRC-007"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "R02_RESEARCH_RULES",
      "criterionId": "R002",
      "sourceIds": [
        "SRC-007",
        "SRC-013"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "R02_RESEARCH_RULES",
      "criterionId": "R003",
      "sourceIds": [
        "SRC-001",
        "SRC-002",
        "SRC-007"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "R02_RESEARCH_RULES",
      "criterionId": "R004",
      "sourceIds": [
        "SRC-001",
        "SRC-002",
        "SRC-003",
        "SRC-007",
        "SRC-013"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "R02_RESEARCH_RULES",
      "criterionId": "R005",
      "sourceIds": [
        "SRC-007",
        "SRC-013"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "R02_RESEARCH_RULES",
      "criterionId": "R006",
      "sourceIds": [
        "SRC-007"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "R02_RESEARCH_RULES",
      "criterionId": "R007",
      "sourceIds": [
        "SRC-007"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "R02_RESEARCH_RULES",
      "criterionId": "R008",
      "sourceIds": [
        "SRC-001",
        "SRC-002",
        "SRC-003",
        "SRC-004",
        "SRC-007",
        "SRC-009",
        "SRC-013"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "R02_RESEARCH_RULES",
      "criterionId": "R009",
      "sourceIds": [
        "SRC-007",
        "SRC-013"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "R02_RESEARCH_RULES",
      "criterionId": "R010",
      "sourceIds": [
        "SRC-007",
        "SRC-013"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "R02_RESEARCH_RULES",
      "criterionId": "R011",
      "sourceIds": [
        "SRC-007",
        "SRC-013"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "R02_RESEARCH_RULES",
      "criterionId": "R012",
      "sourceIds": [
        "SRC-007",
        "SRC-013"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "R02_RESEARCH_RULES",
      "criterionId": "R013",
      "sourceIds": [
        "SRC-001",
        "SRC-002",
        "SRC-007"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "R02_RESEARCH_RULES",
      "criterionId": "R014",
      "sourceIds": [
        "SRC-001",
        "SRC-002",
        "SRC-007"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "R02_RESEARCH_RULES",
      "criterionId": "R015",
      "sourceIds": [
        "SRC-004",
        "SRC-007",
        "SRC-010",
        "SRC-011",
        "SRC-012",
        "SRC-013"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "R02_RESEARCH_RULES",
      "criterionId": "R016",
      "sourceIds": [
        "SRC-005",
        "SRC-007",
        "SRC-008"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "R02_RESEARCH_RULES",
      "criterionId": "R017",
      "sourceIds": [
        "SRC-005",
        "SRC-007",
        "SRC-013"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "R02_RESEARCH_RULES",
      "criterionId": "R018",
      "sourceIds": [
        "SRC-001",
        "SRC-002",
        "SRC-004",
        "SRC-008"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "R02_RESEARCH_RULES",
      "criterionId": "R019",
      "sourceIds": [
        "SRC-004",
        "SRC-005",
        "SRC-008"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "R02_RESEARCH_RULES",
      "criterionId": "R020",
      "sourceIds": [
        "SRC-004",
        "SRC-008"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "R02_RESEARCH_RULES",
      "criterionId": "R021",
      "sourceIds": [
        "SRC-004",
        "SRC-005",
        "SRC-008"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "R02_RESEARCH_RULES",
      "criterionId": "R022",
      "sourceIds": [
        "SRC-001",
        "SRC-004",
        "SRC-010",
        "SRC-011",
        "SRC-012"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "R02_RESEARCH_RULES",
      "criterionId": "R023",
      "sourceIds": [
        "SRC-001",
        "SRC-002",
        "SRC-007",
        "SRC-010"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "R02_RESEARCH_RULES",
      "criterionId": "R024",
      "sourceIds": [
        "SRC-007",
        "SRC-013"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "R02_RESEARCH_RULES",
      "criterionId": "R025",
      "sourceIds": [
        "SRC-007"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "R02_RESEARCH_RULES",
      "criterionId": "R026",
      "sourceIds": [
        "SRC-007",
        "SRC-013"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "R02_RESEARCH_RULES",
      "criterionId": "R027",
      "sourceIds": [
        "SRC-007"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "R02_RESEARCH_RULES",
      "criterionId": "R028",
      "sourceIds": [
        "SRC-004",
        "SRC-005",
        "SRC-007",
        "SRC-008",
        "SRC-013"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "R02_RESEARCH_RULES",
      "criterionId": "R029",
      "sourceIds": [
        "SRC-007",
        "SRC-013"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "R02_RESEARCH_RULES",
      "criterionId": "R030",
      "sourceIds": [
        "SRC-007",
        "SRC-013"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "R02_RESEARCH_RULES",
      "criterionId": "R031",
      "sourceIds": [
        "SRC-001",
        "SRC-010"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "R02_RESEARCH_RULES",
      "criterionId": "R032",
      "sourceIds": [
        "SRC-007",
        "SRC-010",
        "SRC-011",
        "SRC-012"
      ],
      "evidenceStatus": "UNCONFIRMED"
    }
  ],
  "sourceIds": [
    "SRC-001",
    "SRC-002",
    "SRC-003",
    "SRC-004",
    "SRC-005",
    "SRC-006",
    "SRC-007",
    "SRC-008",
    "SRC-009",
    "SRC-010",
    "SRC-011",
    "SRC-012",
    "SRC-013"
  ],
  "researchEvidenceStatus": "PARTIAL"
}