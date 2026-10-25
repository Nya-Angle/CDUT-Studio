// Generated from the reviewed R02 research document. This is not a school-issued template.
import type { TemplateVersion } from '@profer/shared'

export const templateVersion: TemplateVersion = {
  "templateId": "T06-T02",
  "version": 1,
  "schemaVersion": 2,
  "name": "研究生导师招生资格审核",
  "description": "研究生导师招生资格审核。本地研究模板 · 非校方正式模板；校本政策证据为部分核实，未知条件只生成事实核验和人工复核建议。",
  "catalogKind": "builtin",
  "sourceNote": "R02_RESEARCH_TEMPLATE_NONOFFICIAL: 研究稿用于本地辅助审查，不是校方正式模板、政策版本或授权决定。当前政策证据状态 PARTIAL；不得据此自动批准或拒绝。",
  "objectType": "person",
  "displayName": {
    "template": "研究生导师招生资格审核"
  },
  "fields": [
    {
      "key": "F001",
      "label": "案卷唯一号",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "F001 案卷唯一号；ID／Case；P1所有；案卷受理记录/本系统生成；M002表头、M026映射；设计项；I；N"
    },
    {
      "key": "F002",
      "label": "招生年度",
      "kind": "number",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F002 招生年度；INT／Case；P0–P1所有；当年学院通知、受理记录；M001/M002年度；SRC-001第10条；I；P"
    },
    {
      "key": "F003",
      "label": "培养单位及其细则版本",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F003 培养单位及其细则版本；ID+REF／Unit；P0所有；培养单位正式通知或研究生院认可的细则；M001发文机关/版本；SRC-001第10条；I；P"
    },
    {
      "key": "F004",
      "label": "本年度窗口与截止节点",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F004 本年度窗口与截止节点；DATE+REF／Case；P0–P1所有；同年度同学院正式日程；M001具体页/条；未获校本细则；O；P"
    },
    {
      "key": "F005",
      "label": "导师可信身份标识",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F005 导师可信身份标识；ID／Supervisor；P1所有；学校可信人员目录/导师主数据，核持有人；M003人员键，M004聘任名单；R；N"
    },
    {
      "key": "F006",
      "label": "实际提交者与代办授权",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F006 实际提交者与代办授权；ID+REF／Case；P1、P3、P6；可信认证会话/单位授权名册；M002/M003提交人与代理链；R；N"
    },
    {
      "key": "F007",
      "label": "审核学段（硕/博）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F007 审核学段（硕/博）；ENUM／Case；P1所有；申报事项与导师资格/项目批准范围；M002/M004层次；SRC-001第2条；I；N"
    },
    {
      "key": "F008",
      "label": "已获准指导学科",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F008 已获准指导学科；STR+REF／Unit；P2所有；导师资格/聘任权威登记；M004学科、类别；SRC-001第6–10条；I；N"
    },
    {
      "key": "F009",
      "label": "拟招生一级学科",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F009 拟招生一级学科；STR+REF／Unit；P1所有；当期申报及学院学科设置对照；M002/M004学科代码；SRC-001第10条第2款；I；N"
    },
    {
      "key": "F010",
      "label": "拟招生专业学位类别",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F010 拟招生专业学位类别；STR?／Unit；P1专业学位情形；当期申报、学院授权目录；M002/M004类别；SRC-001第10条第2款；I；Q"
    },
    {
      "key": "F011",
      "label": "导师岗位资格状态",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F011 导师岗位资格状态；ENUM+REF／Supervisor；P2所有；博导增列/硕导遴选/特聘有效决定；M004决定号；SRC-001第6–9、15条；R；N"
    },
    {
      "key": "F012",
      "label": "导师岗位资格层次/起止及范围",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F012 导师岗位资格层次/起止及范围；SET+DATE／Supervisor；P2所有；同一份权威岗位资格记录；M004范围与生效日期；R；N"
    },
    {
      "key": "F013",
      "label": "现聘/调离/合同状态",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F013 现聘/调离/合同状态；ENUM+REF／Supervisor；P2所有、F重点；人事/聘任主管机构有效状态；M005聘用字段；SRC-001第9、15条；S；N"
    },
    {
      "key": "F014",
      "label": "返聘/合作合同有效区间",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F014 返聘/合作合同有效区间；DATE+REF／Supervisor；P2条件E/F；人事/合作协议的权威归档；M005/M016合同页；SRC-001第10条第4款、第15条；S；Q"
    },
    {
      "key": "F015",
      "label": "按学校有效人事口径的退休日期",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F015 按学校有效人事口径的退休日期；DATE+REF／Supervisor；P2按年度退休预核；人事处主管结论，不以身份证出生年推算；M005人事证明；SRC-001第10条第3款；S；N"
    },
    {
      "key": "F016",
      "label": "该学段/专业基本修业年限",
      "kind": "number",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F016 该学段/专业基本修业年限；INT+REF／Unit；P2退休比较；当期有效培养制度/招生章程权威记录；M006具体学制条款；SRC-001第10条第3款；I；N"
    },
    {
      "key": "F017",
      "label": "6月30日距退休时间与学制比较",
      "kind": "boolean",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F017 6月30日距退休时间与学制比较；BOOL?+REF／Case；P2退休触发判断；由 F002/F015/F016 导出并记录口径；M005/M006定位；SRC-001第10条第3款；S；P"
    },
    {
      "key": "F018",
      "label": "导师岗位年度考核结论",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F018 导师岗位年度考核结论；ENUM+REF／EligibilityEvidence；P2/P4；按当年细则；所属培养单位有权考核记录；M007结论/年度；SRC-001第17条；S；L"
    },
    {
      "key": "F019",
      "label": "培养质量/师德限招状态",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F019 培养质量/师德限招状态；ENUM+REF／EligibilityEvidence；P2所有；G重点；有权单位最终有效限制/处理状态；M008决定号/效力；SRC-001第15条；S；N"
    },
    {
      "key": "F020",
      "label": "暂停招生层次及起止时间",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F020 暂停招生层次及起止时间；SET+DATE／EligibilityEvidence；P2条件G；培养单位、研究生院等签发的正式决定；M008决定正文；SRC-001第11、15、16条、SRC-006第12条；S；Q"
    },
    {
      "key": "F021",
      "label": "是否首次取得导师岗位资格",
      "kind": "boolean",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F021 是否首次取得导师岗位资格；BOOL?／Supervisor；P2条件C；岗位新增登记、培训主管方；M004/M009首次取得时间；SRC-001第20条；R；Q"
    },
    {
      "key": "F022",
      "label": "首次上岗导师培训结论",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F022 首次上岗导师培训结论；ENUM+REF／EligibilityEvidence；P2条件C；导师培训主管部门可核签到/合格结论；M009培训记录；SRC-001第20条；R；Q"
    },
    {
      "key": "F023",
      "label": "有关口径下在籍博士生人数",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F023 有关口径下在籍博士生人数；INT+REF／EligibilityEvidence；P2条件B；研究生学籍/培养主管的截止日台账；M010统计时点/范围；SRC-001第11条第2款；S；Q"
    },
    {
      "key": "F024",
      "label": "博导暂缓招生触发事实",
      "kind": "boolean",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F024 博导暂缓招生触发事实；BOOL?／EligibilityEvidence；P2条件B；F023与第11条完整口径及批准的限制状态；M010/M008；SRC-001第11条；S；H"
    },
    {
      "key": "F025",
      "label": "跨学科成果与项目支撑",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F025 跨学科成果与项目支撑；SET+REF／SpecialApproval；P2条件D；申报佐证+科研管理机关核真；M011成果/项目定位；SRC-001第10条第2款；R；Q"
    },
    {
      "key": "F026",
      "label": "原学科分委会同意",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F026 原学科分委会同意；DECISION／SpecialApproval；P4条件D；原所在学科分委员会正式记录；M012签章/会议号；SRC-001第10条第2款；R；L"
    },
    {
      "key": "F027",
      "label": "拟跨学科分委会同意",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F027 拟跨学科分委会同意；DECISION／SpecialApproval；P4条件D；拟跨学科所属分委员会记录；M013签章/会议号；SRC-001第10条第2款；R；L"
    },
    {
      "key": "F028",
      "label": "研究生院跨学科复审",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F028 研究生院跨学科复审；DECISION／SpecialApproval；P4条件D；党委研究生工作部/研究生院正式复审；M014复审文号；SRC-001第10条第2款；R；L"
    },
    {
      "key": "F029",
      "label": "分管校领导跨学科批准",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F029 分管校领导跨学科批准；DECISION／SpecialApproval；P4–P5条件D；分管研究生教育校领导正式批准；M015批准签发；SRC-001第10条第2款；R；L"
    },
    {
      "key": "F030",
      "label": "返聘导师组联合指导安排",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F030 返聘导师组联合指导安排；REF／SpecialApproval；P2条件E；培养单位导师组方案、人员与职责核查；M016团队安排；SRC-001第10条第4款；R；Q"
    },
    {
      "key": "F031",
      "label": "退休例外项目或可支配经费事实",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F031 退休例外项目或可支配经费事实；SET+REF／SpecialApproval；P2条件E；科研管理/财务有权机关项目、经费事实；M017立项/在研/权限；SRC-001第10条第4款；S；Q"
    },
    {
      "key": "F032",
      "label": "退休例外分委会审议",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F032 退休例外分委会审议；DECISION／SpecialApproval；P4条件E；培养单位所属分委员会；M018意见；SRC-001第10条第4款；R；L"
    },
    {
      "key": "F033",
      "label": "学校研究生招生领导小组同意",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F033 学校研究生招生领导小组同意；DECISION／SpecialApproval；P4–P5条件E；学校研究生招生领导小组；M019决定；SRC-001第10条第4款；R；L"
    },
    {
      "key": "F034",
      "label": "普通/专项/硕博连读等计划种类",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F034 普通/专项/硕博连读等计划种类；ENUM+REF／DownstreamAdmission；P2条件I；学校当年研究生招生计划与专项授权；M020计划条目；SRC-001第13条、SRC-002；I；Q"
    },
    {
      "key": "F035",
      "label": "已分配个人指标引用",
      "kind": "number",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F035 已分配个人指标引用；INT?+REF／DownstreamAdmission；P5后下游引用；研招有权机关最新指标台账；M020年度/层次/学科；不是资格依据；R；Q"
    },
    {
      "key": "F036",
      "label": "同层次论文未通过/扣减年份事实",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F036 同层次论文未通过/扣减年份事实；SET+REF／EligibilityEvidence；P2条件G；研究生院/学院受控论文评阅处理台账；M021按自然年度/层次汇总；SRC-006第12条第3款；S；Q"
    },
    {
      "key": "F037",
      "label": "停招期满恢复招生本人申请",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F037 停招期满恢复招生本人申请；REF／SpecialApproval；P3/P6条件G；本人签署并经身份核验的书面申请；M022请求/原停招决定号；SRC-006第12条第3款；R；Q"
    },
    {
      "key": "F038",
      "label": "论文质量停招恢复正式审批",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F038 论文质量停招恢复正式审批；DECISION／SpecialApproval；P4–P5条件G；分委员会审核意见及研究生院审批；M023/M024链路；SRC-006第12条第3款；R；L"
    },
    {
      "key": "F039",
      "label": "当年招生资格最终结论",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F039 当年招生资格最终结论；DECISION／Case；P5所有；当期有权院/校决定凭证（签发形式待核）；M025决定号/适用范围；SRC-001第10条；R；L"
    },
    {
      "key": "F040",
      "label": "决定者可信机关及签批人",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F040 决定者可信机关及签批人；ID+REF／Case；P4–P5所有；服务端授权名册/可信签章及决定归档；M025签发节点；SRC-001第10、16条；R；P"
    },
    {
      "key": "F041",
      "label": "证据来源、定位、归属、版本",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F041 证据来源、定位、归属、版本；SET+REF／CaseEvidenceVersion；P1起所有材料；受理记录、源文件hash/版本、官方查询时点；M026源锚点；技术链路字段；R；N"
    },
    {
      "key": "F042",
      "label": "补件、撤回、更正或复核请求",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F042 补件、撤回、更正或复核请求；REF／CaseEvidenceVersion；P3/P6条件H；本人/有权代理的带身份请求与回执；M027请求时间及对象；当前制度程序未知；R；Q"
    },
    {
      "key": "F043",
      "label": "复核后新结论及原结论关联",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F043 复核后新结论及原结论关联；DECISION+REF／Case；P6条件H；原有权机关或经授权复核机关的正式新决定；M028原/新决定号、签发机关；程序待核；R；L"
    }
  ],
  "materialSlots": [
    {
      "id": "M001",
      "name": "当年度培养单位招生资格审核细则、受理窗口及生效版本",
      "purpose": "M001 当年度培养单位招生资格审核细则、受理窗口及生效版本；培养单位/研究生院；正式年度实施文件及变更通知；现/P0，作出年度结论前必核；正式校内归档原本或官网全文为替代，不能拿旧年表单当新年细则；F002–F004；SRC-001第10条（年度正文未取得）；年度×单位×学段/学科×文件号；缺→P停止自动准入判断；糊→请单位补原文",
      "requiredElements": [
        "培养单位/研究生院；正式年度实施文件及变更通知",
        "现/P0，作出年度结论前必核；正式校内归档原本或官网全文为替代，不能拿旧年表单当新年细则",
        "F002–F004；SRC-001第10条（年度正文未取得）",
        "年度×单位×学段/学科×文件号；缺→P停止自动准入判断；糊→请单位补原文"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M002",
      "name": "本案申请或单位集中启动的权威入口记录",
      "purpose": "M002 本案申请或单位集中启动的权威入口记录；导师或具权限院系经办；本人申请表、组织审核名册或可信受理条目；现/P1；如采用单位集中审核，获授权的单位名册可替代导师自填申请表；不得假设固定线上页面；F001,F002,F005–F010；SRC-001第10条（具体格式未核）；导师×年度×层次×学科×批次；缺→N先向经办确认是否应有个人申请；糊→核原件/电子记录",
      "requiredElements": [
        "导师或具权限院系经办；本人申请表、组织审核名册或可信受理条目",
        "现/P1；如采用单位集中审核，获授权的单位名册可替代导师自填申请表；不得假设固定线上页面",
        "F001,F002,F005–F010；SRC-001第10条（具体格式未核）",
        "导师×年度×层次×学科×批次；缺→N先向经办确认是否应有个人申请；糊→核原件/电子记录"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M003",
      "name": "本人及代理人可信身份和权限",
      "purpose": "M003 本人及代理人可信身份和权限；身份管理/组织人事/单位授权主管；认证记录及委托授权；现/P1；服务端可信会话＋组织授权可替代纸质身份证/委托书，不能拿 Renderer 角色字符串替代；F005,F006；设计门禁、SRC-001权责框架；操作人×授权范围×有效期×审计ID；缺→N且禁止有权动作；糊→向授权单位核真",
      "requiredElements": [
        "身份管理/组织人事/单位授权主管；认证记录及委托授权",
        "现/P1；服务端可信会话＋组织授权可替代纸质身份证/委托书，不能拿 Renderer 角色字符串替代",
        "F005,F006；设计门禁、SRC-001权责框架",
        "操作人×授权范围×有效期×审计ID；缺→N且禁止有权动作；糊→向授权单位核真"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M004",
      "name": "岗位资格、聘任范围与招生学科",
      "purpose": "M004 岗位资格、聘任范围与招生学科；学位/导师管理机关；生效的博导增列、硕导遴选或特殊聘任决定及登记；现/P2；有权导师名册含决定版本可替代重复提交聘书；岗位资格≠年审；F007–F012,F021；SRC-001第3、6–10、15条；人员键×硕/博×学科×生效区间；缺→N向导师管理机关查；糊→核正本或名册",
      "requiredElements": [
        "学位/导师管理机关；生效的博导增列、硕导遴选或特殊聘任决定及登记",
        "现/P2；有权导师名册含决定版本可替代重复提交聘书；岗位资格≠年审",
        "F007–F012,F021；SRC-001第3、6–10、15条",
        "人员键×硕/博×学科×生效区间；缺→N向导师管理机关查；糊→核正本或名册"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M005",
      "name": "在岗/调离、聘用与返聘合同、退休日期",
      "purpose": "M005 在岗/调离、聘用与返聘合同、退休日期；人事处或合作聘任控制者；人事台账、有效合同/行政状态函；现/P2；返聘/校外身份条件必需；可用人事出具的截止日结论代替展示合同私密页；F013–F015；SRC-001第9、10、15条；导师×聘期×合同版×查询时点；缺→N交人事；糊→只请求可信状态结论",
      "requiredElements": [
        "人事处或合作聘任控制者；人事台账、有效合同/行政状态函",
        "现/P2；返聘/校外身份条件必需；可用人事出具的截止日结论代替展示合同私密页",
        "F013–F015；SRC-001第9、10、15条",
        "导师×聘期×合同版×查询时点；缺→N交人事；糊→只请求可信状态结论"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M006",
      "name": "对应专业基本修业年限依据",
      "purpose": "M006 对应专业基本修业年限依据；招生/培养主管；当期培养方案或章程中有效学制条；条/P2 临近退休比较时必需；学校权威学制数据替代申请人打印件；F016,F017；SRC-001第10条第3款；年度×层次×类别×学制版本；缺→N/P无法判断退休比较；糊→索条款页",
      "requiredElements": [
        "招生/培养主管；当期培养方案或章程中有效学制条",
        "条/P2 临近退休比较时必需；学校权威学制数据替代申请人打印件",
        "F016,F017；SRC-001第10条第3款",
        "年度×层次×类别×学制版本；缺→N/P无法判断退休比较；糊→索条款页"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M007",
      "name": "导师年度岗位考核结论",
      "purpose": "M007 导师年度岗位考核结论；招生学科所在培养单位；正式考核结论、考核通过名单/决定；后/P2–P4 依单位考核形成（如已完成则可先引用）；不能 P1 要求申请人交未来考核意见；F018；SRC-001第10、17条；导师×年度×单位×考核版；未形成→L；已声称有但取不到→N；糊→单位复核",
      "requiredElements": [
        "招生学科所在培养单位；正式考核结论、考核通过名单/决定",
        "后/P2–P4 依单位考核形成（如已完成则可先引用）；不能 P1 要求申请人交未来考核意见",
        "F018；SRC-001第10、17条",
        "导师×年度×单位×考核版；未形成→L；已声称有但取不到→N；糊→单位复核"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M008",
      "name": "培养质量、停招及岗位处理的有效状态/决定",
      "purpose": "M008 培养质量、停招及岗位处理的有效状态/决定；培养单位、学位部门、人事/纪律主管；正式限制决定或最小必要状态查询；现/P2 核有无有效限制；如确有处分，原决定条件引用；控制者出具的限制状态函可替代调查底稿；F019,F020,F024；SRC-001第11、15、16条、SRC-006第12条；人员×学段×效力期×决定机关；缺→N向主管核实，不能默认无停招；糊→仅索权威效力字段，不索匿名专家身份",
      "requiredElements": [
        "培养单位、学位部门、人事/纪律主管；正式限制决定或最小必要状态查询",
        "现/P2 核有无有效限制；如确有处分，原决定条件引用；控制者出具的限制状态函可替代调查底稿",
        "F019,F020,F024；SRC-001第11、15、16条、SRC-006第12条",
        "人员×学段×效力期×决定机关；缺→N向主管核实，不能默认无停招；糊→仅索权威效力字段，不索匿名专家身份"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M009",
      "name": "首任上岗导师培训结果",
      "purpose": "M009 首任上岗导师培训结果；导师培训主管机关；培训合格记录/证书或有权名单；条/P2 首任导师；主管培训台账可替代纸证；F021,F022；SRC-001第20条；人员×首次任职时间×培训批次；缺→N或尚未产生则待办；糊→查培训主管",
      "requiredElements": [
        "导师培训主管机关；培训合格记录/证书或有权名单",
        "条/P2 首任导师；主管培训台账可替代纸证",
        "F021,F022；SRC-001第20条",
        "人员×首次任职时间×培训批次；缺→N或尚未产生则待办；糊→查培训主管"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M010",
      "name": "在籍博士生统计及触发事实",
      "purpose": "M010 在籍博士生统计及触发事实；研究生培养/学籍管理机关；带定义的在籍统计结果、正式限制决定；条/P2 博导；原始学籍台账的经授权汇总结论可替代导师截图；F023,F024；SRC-001第11条第2款；博导×统计时点×2022年起/基本修业年限口径；缺→N不能按0算；糊→请统计机关释义、复核",
      "requiredElements": [
        "研究生培养/学籍管理机关；带定义的在籍统计结果、正式限制决定",
        "条/P2 博导；原始学籍台账的经授权汇总结论可替代导师截图",
        "F023,F024；SRC-001第11条第2款",
        "博导×统计时点×2022年起/基本修业年限口径；缺→N不能按0算；糊→请统计机关释义、复核"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M011",
      "name": "跨学科新增领域学术成果及科研项目",
      "purpose": "M011 跨学科新增领域学术成果及科研项目；导师可先提供线索；科研管理/成果评价机关核真；条/P2 D情形；可引用权威科研项目库/成果认定，不强制重复传论文全文；F025；SRC-001第10条第2款；导师×拟跨学科×成果项目版；缺→N，是否“重要”→H；糊→核成果主页/主管证明",
      "requiredElements": [
        "导师可先提供线索；科研管理/成果评价机关核真",
        "条/P2 D情形；可引用权威科研项目库/成果认定，不强制重复传论文全文",
        "F025；SRC-001第10条第2款",
        "导师×拟跨学科×成果项目版；缺→N，是否“重要”→H；糊→核成果主页/主管证明"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M012",
      "name": "原学科分委员会同意",
      "purpose": "M012 原学科分委员会同意；原所在学科分委员会；会议纪要/正式意见；后/P4 D特别审核形成；可信签发记录可替代纸张；F026；SRC-001第10条第2款；申请号×原学科×会议届次；未形成→L；糊→联系原分委员会",
      "requiredElements": [
        "原所在学科分委员会；会议纪要/正式意见",
        "后/P4 D特别审核形成；可信签发记录可替代纸张",
        "F026；SRC-001第10条第2款",
        "申请号×原学科×会议届次；未形成→L；糊→联系原分委员会"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M013",
      "name": "拟跨学科分委员会同意",
      "purpose": "M013 拟跨学科分委员会同意；拟跨学科所属分委员会；会议纪要/正式意见；后/P4；签发决定引用可替代；F027；SRC-001第10条第2款；申请号×拟学科×会议届次；未形成→L；糊→拟学科分委员会核真",
      "requiredElements": [
        "拟跨学科所属分委员会；会议纪要/正式意见",
        "后/P4；签发决定引用可替代",
        "F027；SRC-001第10条第2款",
        "申请号×拟学科×会议届次；未形成→L；糊→拟学科分委员会核真"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M014",
      "name": "研究生院跨学科复审",
      "purpose": "M014 研究生院跨学科复审；党委研究生工作部、研究生院；正式复审意见；后/P4；服务端正式审批归档可替代扫描；F028；SRC-001第10条第2款；申请号×复审机关×日期；未形成→L；糊→研究生院核真",
      "requiredElements": [
        "党委研究生工作部、研究生院；正式复审意见",
        "后/P4；服务端正式审批归档可替代扫描",
        "F028；SRC-001第10条第2款",
        "申请号×复审机关×日期；未形成→L；糊→研究生院核真"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M015",
      "name": "分管研究生教育校领导跨学科批准",
      "purpose": "M015 分管研究生教育校领导跨学科批准；分管校领导签批主管部门；正式批件；后/P4–P5；电子签章经核真可替代纸批件；F029；SRC-001第10条第2款；申请号×批准主体×有效范围；未形成→L不可宣称批准；糊→机关核真",
      "requiredElements": [
        "分管校领导签批主管部门；正式批件",
        "后/P4–P5；电子签章经核真可替代纸批件",
        "F029；SRC-001第10条第2款",
        "申请号×批准主体×有效范围；未形成→L不可宣称批准；糊→机关核真"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M016",
      "name": "返聘合同内导师组联合指导方案",
      "purpose": "M016 返聘合同内导师组联合指导方案；导师/培养单位、人事；联合指导安排及返聘/合同期佐证；条/P2 E情形；如培养单位已有正式导师组方案可代个人另写；F014,F030；SRC-001第10条第4款；导师×导师组×入学年度×合同期限；缺→N；糊→学院/人事核原件",
      "requiredElements": [
        "导师/培养单位、人事；联合指导安排及返聘/合同期佐证",
        "条/P2 E情形；如培养单位已有正式导师组方案可代个人另写",
        "F014,F030；SRC-001第10条第4款",
        "导师×导师组×入学年度×合同期限；缺→N；糊→学院/人事核原件"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M017",
      "name": "特别招生科研项目/经费条件证据",
      "purpose": "M017 特别招生科研项目/经费条件证据；科研管理部门/财务资产管理；在研项目批准、经费可支配结论；条/P2 E情形；权威项目/财务查询结果可替导师上传合同或银行流水；F031；SRC-001第10条第4款各列举条件；项目号×主持人×在研时点×经费口径；缺→N；分类、经费认定仍H；糊→科研财务核真",
      "requiredElements": [
        "科研管理部门/财务资产管理；在研项目批准、经费可支配结论",
        "条/P2 E情形；权威项目/财务查询结果可替导师上传合同或银行流水",
        "F031；SRC-001第10条第4款各列举条件",
        "项目号×主持人×在研时点×经费口径；缺→N；分类、经费认定仍H；糊→科研财务核真"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M018",
      "name": "退休例外学位分委会审核",
      "purpose": "M018 退休例外学位分委会审核；培养单位所属分委员会；审议意见；后/P4 E情形；可信会议决定可替纸意见；F032；SRC-001第10条第4款；导师×年度×联合导师组×会议；未形成→L；糊→分委员会核真",
      "requiredElements": [
        "培养单位所属分委员会；审议意见",
        "后/P4 E情形；可信会议决定可替纸意见",
        "F032；SRC-001第10条第4款",
        "导师×年度×联合导师组×会议；未形成→L；糊→分委员会核真"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M019",
      "name": "退休例外学校研究生招生领导小组同意",
      "purpose": "M019 退休例外学校研究生招生领导小组同意；学校研究生招生领导小组；正式同意决定；后/P4–P5 E情形；核真的会议/审批记录可替纸件；F033；SRC-001第10条第4款；导师×年度×学段×审批版；未形成→L；糊→领导小组办事机关核真",
      "requiredElements": [
        "学校研究生招生领导小组；正式同意决定",
        "后/P4–P5 E情形；核真的会议/审批记录可替纸件",
        "F033；SRC-001第10条第4款",
        "导师×年度×学段×审批版；未形成→L；糊→领导小组办事机关核真"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M020",
      "name": "当年招生计划、专项类型及指标台账",
      "purpose": "M020 当年招生计划、专项类型及指标台账；研究生招生主管；年度计划/专项授权及指标记录；条/P2–P5 I或需区分计划类型；学校有效计划台账可替附件，不是年审批准材料；F034,F035；SRC-001第11–13条、SRC-002第三部分；年度×学段×专业×专项×指标版；缺→N于下游核，不能倒推年审不合格；糊→招生办核真",
      "requiredElements": [
        "研究生招生主管；年度计划/专项授权及指标记录",
        "条/P2–P5 I或需区分计划类型；学校有效计划台账可替附件，不是年审批准材料",
        "F034,F035；SRC-001第11–13条、SRC-002第三部分",
        "年度×学段×专业×专项×指标版；缺→N于下游核，不能倒推年审不合格；糊→招生办核真"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M021",
      "name": "同层次论文评阅未通过/扣减及停招事实",
      "purpose": "M021 同层次论文评阅未通过/扣减及停招事实；研究生院、论文评阅与导师考核主管；按年度汇总的正式处理结果；条/P2 G且有评阅处分关联；权威汇总状态可替匿名评阅意见原件；F036；SRC-006第12条第3款；导师×硕/博层次×自然年度×处理结果版；缺→N向控制者核，不能默认无扣减；糊→主管部门汇总",
      "requiredElements": [
        "研究生院、论文评阅与导师考核主管；按年度汇总的正式处理结果",
        "条/P2 G且有评阅处分关联；权威汇总状态可替匿名评阅意见原件",
        "F036；SRC-006第12条第3款",
        "导师×硕/博层次×自然年度×处理结果版；缺→N向控制者核，不能默认无扣减；糊→主管部门汇总"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M022",
      "name": "论文质量停招期满的恢复申请",
      "purpose": "M022 论文质量停招期满的恢复申请；导师本人；具有身份可验的书面恢复招生资格申请；条/P3/P6 仅停招期满后申请；不以一般年度申报表替代本人书面请求；F037；SRC-006第12条第3款；本人×相应层次×原停招决定×递交时间；缺→N不启动恢复；糊→本人补清晰签署件",
      "requiredElements": [
        "导师本人；具有身份可验的书面恢复招生资格申请",
        "条/P3/P6 仅停招期满后申请；不以一般年度申报表替代本人书面请求",
        "F037；SRC-006第12条第3款",
        "本人×相应层次×原停招决定×递交时间；缺→N不启动恢复；糊→本人补清晰签署件"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M023",
      "name": "论文质量停招恢复的分委会同意",
      "purpose": "M023 论文质量停招恢复的分委会同意；所属学位评定分委员会；正式审核意见；后/P4 仅 G 的 SRC-006恢复路径；可信会议记录可替纸件；F038；SRC-006第12条第3款；导师×相应层次×恢复申请×会议；未形成→L；糊→分委员会核真",
      "requiredElements": [
        "所属学位评定分委员会；正式审核意见",
        "后/P4 仅 G 的 SRC-006恢复路径；可信会议记录可替纸件",
        "F038；SRC-006第12条第3款",
        "导师×相应层次×恢复申请×会议；未形成→L；糊→分委员会核真"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M024",
      "name": "论文质量停招恢复的研究生院审批",
      "purpose": "M024 论文质量停招恢复的研究生院审批；党委研究生工作部/研究生院；正式审批；后/P4–P5 仅 G 的 SRC-006恢复路径；可信审批归档可替纸件；F038；SRC-006第12条第3款；导师×相应层次×恢复案×生效范围；未形成→L；糊→研究生院核真",
      "requiredElements": [
        "党委研究生工作部/研究生院；正式审批",
        "后/P4–P5 仅 G 的 SRC-006恢复路径；可信审批归档可替纸件",
        "F038；SRC-006第12条第3款",
        "导师×相应层次×恢复案×生效范围；未形成→L；糊→研究生院核真"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M025",
      "name": "当年导师招生资格正式结论",
      "purpose": "M025 当年导师招生资格正式结论；培养单位及当期细则所授权的最终形成机构；原决定、盖章名单或可信生效登记；后/P5，所有情形；可靠授权系统决定记录可替扫描；具体最终签发方式尚未核实；F039,F040；SRC-001第10、14条；导师×年度×层次×学科×签发版；未形成→L绝不可自动批准；糊→签发机关核真",
      "requiredElements": [
        "培养单位及当期细则所授权的最终形成机构；原决定、盖章名单或可信生效登记",
        "后/P5，所有情形；可靠授权系统决定记录可替扫描；具体最终签发方式尚未核实",
        "F039,F040；SRC-001第10、14条",
        "导师×年度×层次×学科×签发版；未形成→L绝不可自动批准；糊→签发机关核真"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M026",
      "name": "证据定位、归属、哈希/版本审计",
      "purpose": "M026 证据定位、归属、哈希/版本审计；本系统案卷及主管来源元数据；页码、表格单元格、记录ID、源哈希、版本时间；始/P1起；软件自动记录可代单独表单，但必须能重追来源；F001,F041；SRC-001第10条仅界定年度对象，哈希与版本是技术设计、非该条校本要求；caseId×slot×target×sourceVersion；缺→N不输出无证据定位事实；糊→重新提取并保留旧版",
      "requiredElements": [
        "本系统案卷及主管来源元数据；页码、表格单元格、记录ID、源哈希、版本时间",
        "始/P1起；软件自动记录可代单独表单，但必须能重追来源",
        "F001,F041；SRC-001第10条仅界定年度对象，哈希与版本是技术设计、非该条校本要求",
        "caseId×slot×target×sourceVersion；缺→N不输出无证据定位事实；糊→重新提取并保留旧版"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M027",
      "name": "补件/撤回/更正/复核请求和受理回执",
      "purpose": "M027 补件/撤回/更正/复核请求和受理回执；本人、授权代理及有权受理机关；请求、回执；条/P3/P6 H及发生纠错时；已核真受理系统记录可替纸件；合法受理机关/期限待证；F042；SRC-001一般框架，程序细则未取得；原案ID×提交者×诉求×原材料版；缺→N/P先确认是否可提出；糊→本人/受理机关重出",
      "requiredElements": [
        "本人、授权代理及有权受理机关；请求、回执",
        "条/P3/P6 H及发生纠错时；已核真受理系统记录可替纸件；合法受理机关/期限待证",
        "F042；SRC-001一般框架，程序细则未取得",
        "原案ID×提交者×诉求×原材料版；缺→N/P先确认是否可提出；糊→本人/受理机关重出"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M028",
      "name": "有权机关复核/更正的新正式决定",
      "purpose": "M028 有权机关复核/更正的新正式决定；原决定机关或经校本制度授权复核机关；正式新决定及旧版关联；后/P6 H；核真实体决定可替纸件；F043；SRC-001第10条仅为年度决定框架，复核程序与签发授权缺具体SRC，必须人工补证；原决定号×新决定号×机关×生效时间；未形成→L，旧决定不能擅自删除；糊→原机关核真",
      "requiredElements": [
        "原决定机关或经校本制度授权复核机关；正式新决定及旧版关联",
        "后/P6 H；核真实体决定可替纸件",
        "F043；SRC-001第10条仅为年度决定框架，复核程序与签发授权缺具体SRC，必须人工补证",
        "原决定号×新决定号×机关×生效时间；未形成→L，旧决定不能擅自删除；糊→原机关核真"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    }
  ],
  "sections": [
    {
      "id": "rules-08-2",
      "name": "8.2 按真实业务对象编排的连续核查规则（R001–R025）",
      "description": "依据 T06-T02 原件第 08 节规则表；属于本地研究审查项，不等同学校正式政策规则。",
      "order": 0,
      "required": true,
      "criteria": [
        {
          "id": "R001",
          "title": "年度依据和窗口",
          "requirement": "R001 年度依据和窗口 P0–P5；T=本案任何年度资格核验；F=无；?=年度或单位不明时仍先收集线索；SRC-001第10、21条；F002–F004；M001；逐项比招生年度、单位、学段、学科、发布机关、施行/替代关系、截止时刻；当前未取得目标单位当年细则，不能套2025考生申报日。仅现行同范围原文优先；细则可信且一致仅为 PASS_FACT（政策匹配），正文缺/时效不明 POLICY_UNCONFIRMED；学院政策管理员/研究生院确认",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R002",
          "title": "案件主体及代办链",
          "requirement": "R002 案件主体及代办链 P1/P3/P6；T=有案件启动或提交/受理动作；F=无；?=本人/代理关系不明；SRC-001第2、10条（制度框架，身份门禁为技术控制）；F001,F005,F006；M002,M003,M026；personKey、提交者、组织授权、案号与同年度对象对应；仅服务端可信人员/组织与受理台账可作权威，上传昵称、Renderer actor、同名纸件不算；匹配 PASS_FACT；同名不同键或越权 CONFLICT/ NEEDS_HUMAN_DECISION，不建有效审批；身份/院系授权管理员",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R003",
          "title": "招生层次、学科和类别路由",
          "requirement": "R003 招生层次、学科和类别路由 P1–P2；T=所有申报；F=无；?=拟报学科或类别不可确定；SRC-001第2、10条第2款；F007–F010；M002,M004；以学校正式学科代码、聘任范围比申报学段、原学科、拟学科和专业类别；原学科内相近专业类别是否适用例外应按第10条及单位归口核定，不能字符串相似判通过；范围一致 PASS_FACT；触发跨学科转 R011–R013；冲突→CONFLICT，院系导师管理经办核学科归属",
          "execution": "semantic",
          "targetScope": "group"
        },
        {
          "id": "R004",
          "title": "现有导师岗位资格",
          "requirement": "R004 现有导师岗位资格 P2；T=所有拟招生导师；F=无；?=聘任机关状态未回；SRC-001第3、6–9、15–16条；F011,F012；M004；比岗位资格生效、未被退出、学段、学科、有效期与招生年度；引用岗位遴选另案的正式结果，外校“博导”称号、旧证不独立授予成都理工大学招生权；生效范围吻合 PASS_FACT；资格未核 NEEDS_MATERIAL，已取消/越范围 NEEDS_HUMAN_DECISION；导师管理主管",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R005",
          "title": "在岗/聘用合同身份",
          "requirement": "R005 在岗/聘用合同身份 P2；T=所有；F=无；?=工作关系不明；SRC-001第8–10、15条；F013,F014；M005；比人事在岗、调离、兼职、返聘身份及合同起止，需覆盖适用年度/招生时点；特殊身份须已有聘任机关决定，不以社交名片和纸质合同推断独立资格；当前身份范围有据 PASS_FACT；无有效身份或独立招生权不明 NEEDS_HUMAN_DECISION；人事及导师聘任机关",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R006",
          "title": "年度履职能力考核",
          "requirement": "R006 年度履职能力考核 P4–P5；T=按当年细则进入年度考核；F=无；?=年度实施规则缺；SRC-001第10、17条；F018；M001,M007；只读培养单位实际形成的对应年度考核结果和规则版本；学术成绩、科研经费、师德阈值由单位制定；P1 尚未考核时标“未来产生”，不能作为申请缺件；考核已完成且结论可核 PASS_FACT（结论事实）；未通过、评分争议→NEEDS_HUMAN_DECISION；培养单位有权考核者",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R007",
          "title": "有效限招/停招和岗位处理",
          "requirement": "R007 有效限招/停招和岗位处理 P2及签批前；T=所有；F=无；?=主管台账断联；SRC-001第11、15–17条；F019,F020；M008；权威决定号、限制类型、层次、时段、是否已撤销/替代，覆盖拟招生年度；纪律调查原件不等于生效处分，限制存在不意味着岗位资格自然撤销；可验证无有效限招/停招→PASS_FACT；有效停招/范围争议→NEEDS_HUMAN_DECISION；限制决定原机关/研究生院",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R008",
          "title": "首次导师培训",
          "requirement": "R008 首次导师培训 P2/P4；T=F021=true 本校首次上岗；F=明确非首次；?=M004首任历史未知；SRC-001第20条；F021,F022；M004,M009；确认首次是否为本校正式导师，不以外校经历判非首次；比培训考核是否合格、日期与主管记录；若培训尚未举行则不得索未来合格签章；合格事实 PASS_FACT；未参加/未合格→NEEDS_HUMAN_DECISION 并提示不可上岗；培训主管/单位",
          "execution": "semantic",
          "targetScope": "subject"
        },
        {
          "id": "R009",
          "title": "博士在籍数与一年停招",
          "requirement": "R009 博士在籍数与一年停招 P2/P4；T=F007=博士且第11条口径适用；F=硕士；?=学段/统计口径不明；SRC-001第11条第2款；F023,F024；M008,M010；仅按2022年起指导、且在基本修业年限内在籍的博士生计数；当可信总数≥14时，第11条规定暂停招生一年；具体统计时点、例外和已有处理效力仍须主管核准，不把截图13与台账14平均；计数与适用性有据 PASS_FACT（统计事实）；触发条款或处分效力待确认→NEEDS_HUMAN_DECISION；研究生培养/处理机关",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R010",
          "title": "退休日和基本修业年限",
          "requirement": "R010 退休日和基本修业年限 P2；T=对所有导师计算是否触发临退；F=无；?=出生/退休决定或学制不明；SRC-001第10条第3–4款；SRC-007仅限2026博士学制；F002,F015–F017；M005,M006；以招生年度6月30日为锚点，比人事核定退休日距离与该专业基本修业年限；2026一般博士4年、直博5年见 SRC-007，硕士和其他年份须读当期培养依据；不以最长修业年限替代；计算口径可信则事实 PASS_FACT；不足年限→进入 R014–R016，不得直接自动同意/拒绝；人事及招生培养主管",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R011",
          "title": "跨学科支撑事实",
          "requirement": "R011 跨学科支撑事实 P2–P4；T=R003确认跨一级学科/需特殊审批；F=未跨且不需此审批；?=学校学科范围未核；SRC-001第10条第2款；F009,F025；M004,M011；比原/目标学科、获认定的重要成果/承担项目与拟跨学科关联；真实性先向科研主管查，是否足以支持跨学科交有权委员，不由模型定义“重要”阈值；可核成果存在 PASS_FACT（证据真实性）；重要性和准入→NEEDS_HUMAN_DECISION；原/目标学科分委员会",
          "execution": "manual",
          "targetScope": "group"
        },
        {
          "id": "R012",
          "title": "跨学科两方分委会意见",
          "requirement": "R012 跨学科两方分委会意见 P4；T=R011路径已进入两方审议；F=非跨学科；?=学科归属/组织架构不明；SRC-001第10条第2款；F026,F027；M012,M013；各核原学科及拟学科学位评定分委会合法会议意见、签发人与特定申请版本；不得将“某学院同意”复用为两方同意；P1未形成非缺件；两份可信意见的存在性 PASS_FACT；任一不同意或未决定→NEEDS_HUMAN_DECISION；各分委会经办",
          "execution": "manual",
          "targetScope": "group"
        },
        {
          "id": "R013",
          "title": "跨学科研究生院复审及校领导批准",
          "requirement": "R013 跨学科研究生院复审及校领导批准 P4–P5；T=跨学科路径且R012两方已形成意见；F=非跨学科；?=前序状态未知；SRC-001第10条第2款；F028,F029；M014,M015；依序验研究生院复审和分管研究生教育校领导批准的签发、范围、年度与已核前序意见；技术预审不能生成批准，特殊批准也不代替当年度普通考核；有权审批文件真实 PASS_FACT（批准事实）；无批准/意见冲突→NEEDS_HUMAN_DECISION；研究生院、分管校领导授权机关",
          "execution": "manual",
          "targetScope": "group"
        },
        {
          "id": "R014",
          "title": "临退联合指导/返聘安排",
          "requirement": "R014 临退联合指导/返聘安排 P2–P4；T=R010触发第10条第4款例外申请；F=未触发例外；?=退休判定不明；SRC-001第10条第4款；F014,F030；M005,M016；检导师组联合指导方案及相关合同期限、各指导成员职责；书面方案存在仅说明拟安排，必要性由分委会裁量；方案/合同事实一致 PASS_FACT，联合指导能否豁免→NEEDS_HUMAN_DECISION；培养单位分委会/人事",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R015",
          "title": "临退例外项目或经费支撑",
          "requirement": "R015 临退例外项目或经费支撑 P2–P4；T=R010触发例外申请；F=未触发；?=项目和拟录计划身份未核；SRC-001第10条第4款；F031；M017；按2024原文六类项目/经费逐类定位，含自然基金“其他”项目经费≥200万、指定部委局项目≥600万、国家艺术基金立项≥60万或可支配经费≥800万；项目主持/在研/归类及2026/2027现行效力均由科研/财务和政策主管核实。仅存“2024原文阈值”作对照，未核现行性不得将数字作为自动准入条件；项目/经费源事实可核 PASS_FACT；规则生效未知 POLICY_UNCONFIRMED；是否满足任一例外且有特殊招生必要性 NEEDS_HUMAN_DECISION；科研财务/分委会",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R016",
          "title": "临退例外双层同意",
          "requirement": "R016 临退例外双层同意 P4–P5；T=R014/R015已送特殊授权链；F=无需临退例外；?=第10条例外适用性待确认；SRC-001第10条第4款；F032,F033；M018,M019；先核培养单位所属学位评定分委会审核，后核学校研究生招生领导小组同意；二者对象、年度和联合指导方案版一致，不得拿跨学科校领导意见替代；正式同意真实 PASS_FACT（特批存在）；未形成则下一有权节点 NEEDS_HUMAN_DECISION；分委会/招生领导小组",
          "execution": "manual",
          "targetScope": "group"
        },
        {
          "id": "R017",
          "title": "论文评阅质量触发的停招事实",
          "requirement": "R017 论文评阅质量触发的停招事实 P2/P4；T=存在同层次论文评阅扣减事项或该类停招记录；F=主管证实不存在；?=质量台账不可核；SRC-006第12条第3款；F019,F020,F036；M008,M021；按原条款核同一年未通过意见数、连续两年同学段招生指标扣减、暂停一年与起止期；扣减指标≠当然永久停招，分清汇总事实和已生效处理，勿审匿名评阅人；年度汇总事实 PASS_FACT；触发暂停需主管确认正式效力→NEEDS_HUMAN_DECISION；论文评阅/限制处理机关",
          "execution": "manual",
          "targetScope": "group"
        },
        {
          "id": "R018",
          "title": "论文质量停招期满恢复请求",
          "requirement": "R018 论文质量停招期满恢复请求 P3/P6；T=明确因 SRC-006 停招、已期满且本人要求恢复；F=无该类停招或未提出恢复；?=停招原因/期满未知；SRC-006第12条第3款；F020,F037；M008,M022；核同学段原停招决定、起止时间、本人可验证的书面恢复申请；其他原因停招不能类推；期满不等于自动恢复，尚未申请时不把 P1 判缺件；本人有效请求 PASS_FACT（受理事实）；期限/资格争议 NEEDS_HUMAN_DECISION；本人及所属分委会",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R019",
          "title": "论文质量停招恢复机关审批",
          "requirement": "R019 论文质量停招恢复机关审批 P4–P5/P6；T=R018正式请求进入审批；F=其他原因/无申请；?=原处分类型和程序未知；SRC-006第12条第3款；F038；M023,M024；按“所属学位评定分委员会同意→研究生院审批”核决定原件、人员学段、恢复时点；不得用一期之后的普通年度合格结果倒推已取消原限制；审批真实 PASS_FACT；等待/不同意→NEEDS_HUMAN_DECISION；分委会、研究生院（仅此恢复类）",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R020",
          "title": "计划类别、个人指标与年度资格分离",
          "requirement": "R020 计划类别、个人指标与年度资格分离 P2/P5；T=有专项/计划数据需关联；F=本案无指标核对诉求；?=招生通道不明；SRC-001第11–13条；SRC-002限2025硕博连读；SRC-007限2026博士招生；F034,F035；M020；核计划类型、年度、导师指标记录只作下游引用；2026博士招生计划依主管发布，导师资格只作前置条件；有零名额不等于当年资格不合格，亦不能凭专项名额豁免跨学科批准；计划/指标事实可核 PASS_FACT；有无指标的行政安排仅由招生计划机关决定；缺数据不阻止年审事实预核",
          "execution": "manual",
          "targetScope": "group"
        },
        {
          "id": "R021",
          "title": "证据归属与最小合法复用",
          "requirement": "R021 证据归属与最小合法复用 P1–P6；T=任何材料、权威记录参与核验；F=无；?=主体键/版本不明；SRC-001第10、15条为业务对象框架；F001,F005,F041；M026（数据治理设计，不冒充制度条文）；核 caseId×导师键×年度×层次×学科×sourceVersion、页码/记录ID及签发机关；G50核签章/可读仅供复用技术事实；证据主从不一致或同名错认不得复用；一一归属及定位可核 PASS_FACT；主体冲突 CONFLICT；来源不可追 NEEDS_MATERIAL；案卷管理员/权威原件保管人",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R022",
          "title": "补件或换版本定向影响核查",
          "requirement": "R022 补件或换版本定向影响核查 P3/P6；T=发生补交、换版、纠错；F=无更新事件；?=新旧版本关系缺；SRC-001第10条为业务背景；F041,F042；M026,M027（软件控制，不宣称学校流程已确立）；比新旧 fileHash/sourceVersion/supersedes、目标和受影响字段，旧事实标 stale，只触发依赖该源版本的 R；若已正式签发 M025，再请原机关决定是否须撤销/更正；版本链完整 PASS_FACT（技术事实）；无合法变更权或影响现有正式决定→NEEDS_HUMAN_DECISION；经办与原决定机关",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R023",
          "title": "年度资格正式结论与授权签发",
          "requirement": "R023 年度资格正式结论与授权签发 P5；T=进入正式办结/供下游引用时；F=P1–P4尚未到最终形成阶段；?=批准机关版本/当期细则不明；SRC-001第10、14条；F002,F003,F005,F007,F009,F010,F039,F040；M001,M003,M025,M026；核当期授权机关、决定号/生效时间、人员、学段、学科、年度及是否经撤销更正；普通年审签发形式尚无样张，不能按系统人工按钮虚构批准；特殊审批单据不得充当年度总决定；仅能输出“正式决定记录核真”的 PASS_FACT 并单列其官方结论值；缺授权证据→POLICY_UNCONFIRMED；决定尚未形成→NEEDS_HUMAN_DECISION；学院/研究生院核签发权限",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R024",
          "title": "撤回请求的主体与可受理阶段",
          "requirement": "R024 撤回请求的主体与可受理阶段 P3/P6；T=本人或代理提出撤回；F=无撤回；?=请求性质不明；SRC-001第10条仅支撑年审背景，撤回程序无特定SRC；F006,F042；M003,M027；核请求指向原案/未生效申请、申请人与代理权、受理机关和时点；学校是否允许撤回、截止及办结后效果均未知，不套用考生申诉或论文评阅时限；身份与请求可核 PASS_FACT；能否有效撤回 POLICY_UNCONFIRMED/NEEDS_HUMAN_DECISION；受理机关/原决定机关",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R025",
          "title": "复核/更正及新决定承接",
          "requirement": "R025 复核/更正及新决定承接 P6；T=提出异议或有权机关签发更正；F=无复核；?=当期救济渠道未知；SRC-001第10条仅作年审背景，复核程序无特定SRC；F039,F040,F042,F043；M025,M027,M028；核申诉者主体、原决定号、受理权、答复/新决定签发权、效力日期及原版引用；SRC-007考生申诉和 SRC-006论文评阅申诉条款均不可移植；历史结论保留；新决定存在及真实 PASS_FACT，其决定值只读；程序不明 POLICY_UNCONFIRMED，复核裁量 NEEDS_HUMAN_DECISION；原机关/经核实复核机关",
          "execution": "manual",
          "targetScope": "case"
        }
      ]
    }
  ],
  "policyVersionIds": [],
  "stages": [
    {
      "id": "p0",
      "name": "P0 当年实施依据确认",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "workflowOwner": "local",
      "nextStageId": "p1"
    },
    {
      "id": "p1",
      "name": "P1 申请/批量启动",
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
      "name": "P3 补件/澄清/变更",
      "kind": "supplement-wait",
      "executorRole": "reviewer",
      "workflowOwner": "local",
      "nextStageId": "p4"
    },
    {
      "id": "p4",
      "name": "P4 培养单位考核/特别复审",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "workflowOwner": "local",
      "nextStageId": "p5"
    },
    {
      "id": "p5",
      "name": "P5 正式结论登记",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "workflowOwner": "local",
      "nextStageId": "p6"
    },
    {
      "id": "p6",
      "name": "P6 撤回、异议、复核/更正",
      "kind": "handoff",
      "executorRole": "reviewer",
      "workflowOwner": "local"
    }
  ],
  "outputs": [
    {
      "id": "item-feedback",
      "kind": "item-feedback",
      "audience": "reviewer"
    },
    {
      "id": "supplement-list",
      "kind": "supplement-list",
      "audience": "teacher"
    }
  ],
  "autoPassPolicy": {
    "enabled": false
  },
  "status": "draft",
  "createdAt": "2026-10-24T00:00:00.000Z"
}

export const r02Metadata = {
  "batchId": "T06-A",
  "templateId": "T06-T02",
  "name": "研究生导师招生资格审核",
  "sourceDocumentPath": "docs/design/review-agent/business-templates/R02/research-original/T06-T02.md",
  "sourceDocumentSha256": "eab5f589585f1854bab8918a4ebf4c6b38b7b0bd2a724392094cd30b90fc3d9e",
  "sourceDocumentBytes": 144140,
  "reviewedDocumentPath": "docs/design/review-agent/business-templates/R02/T06-T02.md",
  "reviewedDocumentPatchApplied": true,
  "reviewedDocumentPatchSummary": "SRC-006 从已废止的成理校研〔2023〕6号更新为成理校研〔2024〕41号；保留规则 ID 与人工确认门禁。",
  "officialSchoolTemplate": false,
  "researchStatus": "RESEARCH_HANDOFF_READY",
  "policyEvidenceStatus": "PARTIAL",
  "researchAsOf": "2026-10-23",
  "auditedAt": "2026-10-24",
  "criteria": [
    {
      "sectionId": "rules-08-2",
      "criterionId": "R001",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F002",
        "F003",
        "F004"
      ],
      "materialSlotIds": [
        "M001"
      ]
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R002",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "VERIFIED",
      "fieldIds": [
        "F001",
        "F005",
        "F006"
      ],
      "materialSlotIds": [
        "M002",
        "M003",
        "M026"
      ]
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R003",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "VERIFIED",
      "fieldIds": [
        "F007",
        "F008",
        "F009",
        "F010"
      ],
      "materialSlotIds": [
        "M002",
        "M004"
      ]
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R004",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F011",
        "F012"
      ],
      "materialSlotIds": [
        "M004"
      ]
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R005",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "VERIFIED",
      "fieldIds": [
        "F013",
        "F014"
      ],
      "materialSlotIds": [
        "M005"
      ]
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R006",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F018"
      ],
      "materialSlotIds": [
        "M001",
        "M007"
      ]
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R007",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "VERIFIED",
      "fieldIds": [
        "F019",
        "F020"
      ],
      "materialSlotIds": [
        "M008"
      ]
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R008",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F021",
        "F022"
      ],
      "materialSlotIds": [
        "M004",
        "M009"
      ]
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R009",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "VERIFIED",
      "fieldIds": [
        "F007",
        "F023",
        "F024"
      ],
      "materialSlotIds": [
        "M008",
        "M010"
      ]
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R010",
      "srcIds": [
        "SRC-001",
        "SRC-007"
      ],
      "evidenceStatus": "PARTIAL",
      "fieldIds": [
        "F002",
        "F015",
        "F016",
        "F017"
      ],
      "materialSlotIds": [
        "M005",
        "M006"
      ]
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R011",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F009",
        "F025"
      ],
      "materialSlotIds": [
        "M004",
        "M011"
      ]
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R012",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "PARTIAL",
      "fieldIds": [
        "F026",
        "F027"
      ],
      "materialSlotIds": [
        "M012",
        "M013"
      ]
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R013",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F028",
        "F029"
      ],
      "materialSlotIds": [
        "M014",
        "M015"
      ]
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R014",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "VERIFIED",
      "fieldIds": [
        "F014",
        "F030"
      ],
      "materialSlotIds": [
        "M005",
        "M016"
      ]
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R015",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F031"
      ],
      "materialSlotIds": [
        "M017"
      ]
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R016",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "VERIFIED",
      "fieldIds": [
        "F032",
        "F033"
      ],
      "materialSlotIds": [
        "M018",
        "M019"
      ]
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R017",
      "srcIds": [
        "SRC-006"
      ],
      "evidenceStatus": "VERIFIED",
      "fieldIds": [
        "F019",
        "F020",
        "F036"
      ],
      "materialSlotIds": [
        "M008",
        "M021"
      ]
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R018",
      "srcIds": [
        "SRC-006"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F020",
        "F037"
      ],
      "materialSlotIds": [
        "M008",
        "M022"
      ]
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R019",
      "srcIds": [
        "SRC-006"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F038"
      ],
      "materialSlotIds": [
        "M023",
        "M024"
      ]
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R020",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-007"
      ],
      "evidenceStatus": "VERIFIED",
      "fieldIds": [
        "F034",
        "F035"
      ],
      "materialSlotIds": [
        "M020"
      ]
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R021",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "VERIFIED",
      "fieldIds": [
        "F001",
        "F005",
        "F041"
      ],
      "materialSlotIds": [
        "M026"
      ]
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R022",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "VERIFIED",
      "fieldIds": [
        "F041",
        "F042"
      ],
      "materialSlotIds": [
        "M025",
        "M026",
        "M027"
      ]
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R023",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F002",
        "F003",
        "F005",
        "F007",
        "F009",
        "F010",
        "F039",
        "F040"
      ],
      "materialSlotIds": [
        "M001",
        "M003",
        "M025",
        "M026"
      ]
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R024",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F006",
        "F042"
      ],
      "materialSlotIds": [
        "M003",
        "M027"
      ]
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R025",
      "srcIds": [
        "SRC-001",
        "SRC-006",
        "SRC-007"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F039",
        "F040",
        "F042",
        "F043"
      ],
      "materialSlotIds": [
        "M025",
        "M027",
        "M028"
      ]
    }
  ],
  "sources": [
    {
      "id": "SRC-001",
      "status": "CDUT-VERIFIED",
      "title": "CDUT-VERIFIED；官方 PDF 原文 14 页可读；成都理工大学；成理校研〔2024〕23号《关于印发〈成都理工大学研究生指导教师岗位管理办法〉的通知》；[校内 PDF A](https://energy.cdut.edu.cn/__local/9/AA/99/34CEDDCF9FF86FBE66A5E632631_3B5D2F7C_44101.pdf)；[校内 PDF B](https://cnae.cdut.edu.cn/__local/9/09/32/0785",
      "url": "https://energy.cdut.edu.cn/__local/9/AA/99/34CEDDCF9FF86FBE66A5E632631_3B5D2F7C_44101.pdf",
      "scope": "SRC-001；CDUT-VERIFIED；官方 PDF 原文 14 页可读；成都理工大学；成理校研〔2024〕23号《关于印发〈成都理工大学研究生指导教师岗位管理办法〉的通知》；[校内 PDF A](https://energy.cdut.edu.cn/__local/9/AA/99/34CEDDCF9FF86FBE66A5E632631_3B5D2F7C_44101.pdf)；[校内 PDF B](https://cnae.cdut.edu.cn/__local/9/09/32/078522620118EF78C1344E0E040_EF742B3C_424F74.pdf)；PDF 第1–2页：发布及第1–3条；第5–8页：第6–14条（年度资格、跨学科、退休/返聘、限招、监督）；第8–10页：第15–17条（质量、停招、岗位退出、年度考核）；第12–14页：第20–22条（首任培训、施行与解释）。第11条第2款对2022年起指导且在基本修业年限内在籍博士生达到或超过14人规定暂停招生一年，等于14也触发。；2024-04-18 印发并施行；同日废止成理校研〔2021〕19号；未查"
    },
    {
      "id": "SRC-002",
      "status": "CDUT-VERIFIED",
      "title": "CDUT-VERIFIED；官方 PDF 原文 4 页可读；成都理工大学党委研究生工作部、研究生院；《成都理工大学2025年招收硕博连读研究生的通知》；[研究生院 PDF](https://gra.cdut.edu.cn/__local/D/88/ED/D3929F36A0ABB7D5E8DAF2365D0_D319D5B9_3C0CA.pdf)",
      "url": "https://gra.cdut.edu.cn/__local/D/88/ED/D3929F36A0ABB7D5E8DAF2365D0_D319D5B9_3C0CA.pdf",
      "scope": "SRC-002；CDUT-VERIFIED；官方 PDF 原文 4 页可读；成都理工大学党委研究生工作部、研究生院；《成都理工大学2025年招收硕博连读研究生的通知》；[研究生院 PDF](https://gra.cdut.edu.cn/__local/D/88/ED/D3929F36A0ABB7D5E8DAF2365D0_D319D5B9_3C0CA.pdf)；PDF 第3页（原文第三部分）：当年度有招生资格的博导可招收硕博连读，拟录取占当年博导招生指标；第3–4页考生申请、初审/报名流程；2025-03-03 发布，限 2025 年硕博连读招生批次；该批次时效已过，只作决策边界旁证，不作为 2026/2027 年资格审查通知。"
    },
    {
      "id": "SRC-003",
      "status": "CURRENTITY-UNKNOWN",
      "title": "CURRENTITY-UNKNOWN；检索结果命中，PDF 16MB 原文打开失败；成都理工大学管理科学与工程学位点相关自评材料（具体署名待查）；[校内报告 PDF](https://gra.cdut.edu.cn/__local/D/69/D5/7104C6BD7D9154AD3388B3A6B70_8DB688D1_F5567D.pdf)",
      "url": "https://gra.cdut.edu.cn/__local/D/69/D5/7104C6BD7D9154AD3388B3A6B70_8DB688D1_F5567D.pdf",
      "scope": "SRC-003；CURRENTITY-UNKNOWN；检索结果命中，PDF 16MB 原文打开失败；成都理工大学管理科学与工程学位点相关自评材料（具体署名待查）；[校内报告 PDF](https://gra.cdut.edu.cn/__local/D/69/D5/7104C6BD7D9154AD3388B3A6B70_8DB688D1_F5567D.pdf)；搜索索引显示第6页“制度建设”提及《成都理工大学管理科学学院研究生指导教师招生资格年度审核实施办法（试行）》；仅证明公开报告提及该名称，不等于细则条款已核实；报告描述 2024 年建设情况；文件本身准确发布时间、生效/废止及 2026/2027 年适用性均未知；仅涉及管理科学学院/学位点，不可推至全校。"
    },
    {
      "id": "SRC-004",
      "status": "CURRENTITY-UNKNOWN",
      "title": "CURRENTITY-UNKNOWN；研究生院检索页面有正文摘录，打开页面返回 412；成都理工大学研究生院；《成都理工大学2026年硕士研究生招生章程》；[招生章程页](https://gra.cdut.edu.cn/info/1074/5442.htm)",
      "url": "https://gra.cdut.edu.cn/info/1074/5442.htm",
      "scope": "SRC-004；CURRENTITY-UNKNOWN；研究生院检索页面有正文摘录，打开页面返回 412；成都理工大学研究生院；《成都理工大学2026年硕士研究生招生章程》；[招生章程页](https://gra.cdut.edu.cn/info/1074/5442.htm)；搜索结果显示有“附件3：2026年硕士研究生招生专业导师目录”；附件全文及任何导师资格证明链尚未逐页核验；研究生院索引标注 2025-09-26 发布；2026 招生批次历史事实，与导师年度资格审批不是同一事项；该章程适用学段为硕士招生，是否更新未知。"
    },
    {
      "id": "SRC-005",
      "status": "CURRENTITY-UNKNOWN",
      "title": "CURRENTITY-UNKNOWN；学院目录/文章元信息可读，附件正文尚未取得；成都理工大学能源学院学科建设与研究生管理科；《能源学院遴选硕士研究生指导教师实施办法（试行） 能源学院〔2024〕1号文件》；[学院页面](https://energy.cdut.edu.cn/info/1374/4726.htm)",
      "url": "https://energy.cdut.edu.cn/info/1374/4726.htm",
      "scope": "SRC-005；CURRENTITY-UNKNOWN；学院目录/文章元信息可读，附件正文尚未取得；成都理工大学能源学院学科建设与研究生管理科；《能源学院遴选硕士研究生指导教师实施办法（试行） 能源学院〔2024〕1号文件》；[学院页面](https://energy.cdut.edu.cn/info/1374/4726.htm)；学院页面标题及发布日期可核，未取得正文条款；此文件指向岗位遴选，不是年度招生资格审核细则；网页标注 2025-04-29，文件号标示 2024；施行/废止时间未知；适用能源学院硕导岗位遴选，不能覆盖本案年度审核。"
    },
    {
      "id": "SRC-006",
      "status": "CDUT-VERIFIED",
      "title": "CDUT-VERIFIED；官方 PDF 原文 20 页可读；成都理工大学；成理校研〔2024〕41号《关于印发〈成都理工大学研究生学位论文评阅实施办法〉的通知》；[校内 PDF](https://energy.cdut.edu.cn/__local/2/E4/72/CEA8B4F56BF6B55F199D43D6BE7_A5B0F6F4_5056D.pdf)",
      "url": "https://energy.cdut.edu.cn/__local/2/E4/72/CEA8B4F56BF6B55F199D43D6BE7_A5B0F6F4_5056D.pdf",
      "scope": "SRC-006；CDUT-VERIFIED；官方 PDF 原文 20 页可读；成都理工大学；成理校研〔2024〕41号《关于印发〈成都理工大学研究生学位论文评阅实施办法〉的通知》；[校内 PDF](https://energy.cdut.edu.cn/__local/2/E4/72/CEA8B4F56BF6B55F199D43D6BE7_A5B0F6F4_5056D.pdf)；PDF 第6–7页：第12条第（三）款第1—2项，导师指导的同一层次学位论文在同一自然年度累计3次及以上未通过意见扣减下一年度相应层次指标1个；连续两年因上述原因被扣减指标者暂停相应层次招生资格一年；期满由导师本人书面申请，经所属学位评定分委员会审核同意后报党委研究生工作部、研究生院审批。；2024-06-18 印发、2024-09-01施行，并明文废止成理校研〔2023〕6号；该来源可用于核验本条所述校本处理链，但不替代目标招生年度实施细则、导师年度资格审核或指标分配办法；后续修订及当前连续效力仍需主管部门确认。"
    },
    {
      "id": "SRC-007",
      "status": "CDUT-VERIFIED",
      "title": "CDUT-VERIFIED；学校官方 PDF 8页全文可读；成都理工大学研究生院；《成都理工大学2026年博士研究生招生章程》，[通知索引](https://gra.cdut.edu.cn/info/1075/5666.htm)、[原 PDF](https://gra.cdut.edu.cn/__local/D/86/30/8EBCC1F48BCA687D97FB8DE3B67_540D94D6_3D57C.pdf)",
      "url": "https://gra.cdut.edu.cn/info/1075/5666.htm",
      "scope": "SRC-007；CDUT-VERIFIED；学校官方 PDF 8页全文可读；成都理工大学研究生院；《成都理工大学2026年博士研究生招生章程》，[通知索引](https://gra.cdut.edu.cn/info/1075/5666.htm)、[原 PDF](https://gra.cdut.edu.cn/__local/D/86/30/8EBCC1F48BCA687D97FB8DE3B67_540D94D6_3D57C.pdf)；PDF 第1–3页：2026年博士计划由教育部下达、专项另列；博士基本修业年限4年、直博5年（最长年限不是退休核算的基本年限）；第5页考生报名流程；第7页考生申诉，不属于导师年审申诉；研究生院发布索引标注2026-01-21；限2026博士招生批次。仅可验证2026博士学制及下游招生事实，不可充作各学院2026/2027年度导师资格实施细则，不可覆盖硕士学制。"
    },
    {
      "id": "SRC-008",
      "status": "CDUT-VERIFIED",
      "title": "CDUT-VERIFIED（官方页面的可检索正文，直接打开 HTTP 412，非导师年审原件）；成都理工大学党委研究生工作部（研究生院）；[《成都理工大学2026年招收硕博连读研究生报名须知》](https://gra.cdut.edu.cn/info/1075/5753.htm)",
      "url": "https://gra.cdut.edu.cn/info/1075/5753.htm",
      "scope": "SRC-008；CDUT-VERIFIED（官方页面的可检索正文，直接打开 HTTP 412，非导师年审原件）；成都理工大学党委研究生工作部（研究生院）；[《成都理工大学2026年招收硕博连读研究生报名须知》](https://gra.cdut.edu.cn/info/1075/5753.htm)；网页“（一）网上报名”“（二）材料提交”“（三）复试考核”，明确2026年3月18–26日为通过初审的硕博连读考生网报及缴费时间，并引用另行发布的2026硕博连读通知；不含导师年审普通签批链；研究生院署名日期2026-03-17；限2026考生硕博连读报名批次。其日期/申报方式不能移植成导师年度招生资格审核窗口；截至2026-10-23仍需原发布机关核该网页是否有后修订。"
    }
  ]
} as const
