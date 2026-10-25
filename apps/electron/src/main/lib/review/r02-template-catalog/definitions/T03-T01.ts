import type { TemplateVersion } from '@profer/shared'

/** R02 research-only runtime projection; not a CDUT official template or policy version. */
export const templateVersion: TemplateVersion = {
  "templateId": "T03-T01",
  "version": 1,
  "schemaVersion": 2,
  "name": "纵向科研项目申报、负责人资格和推荐审核",
  "description": "本地研究模板 · 非校方正式模板。适用于“纵向科研项目申报、负责人资格和推荐审核”的材料、事实与风险核对；政策适用、校内授权及正式决定均须由有权人员确认。",
  "catalogKind": "builtin",
  "sourceNote": "R02_RESEARCH_TEMPLATE_NONOFFICIAL: 本地研究模板，非校方正式模板。来源文档 docs/design/review-agent/business-templates/R02/T03-T01.md；源文档 SHA-256 1013e8751e69cfcb11988a864616427c3b6ba0018fd07615fb2d17e1512a4ec0；政策证据状态 PARTIAL；不得将 SRC 研究来源伪装为案卷 SourceRef 或正式 PolicyVersion。",
  "objectType": "project",
  "displayName": {
    "template": "{{f002}}"
  },
  "fields": [
    {
      "key": "f001",
      "label": "资助/推荐主管机关、项目计划",
      "kind": "enum",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“资助/推荐主管机关、项目计划”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f002",
      "label": "年度、批次、项目类别",
      "kind": "enum",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“年度、批次、项目类别”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f003",
      "label": "指南/校内通知版本与效力",
      "kind": "date",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“指南/校内通知版本与效力”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f004",
      "label": "申报人、单位、推荐机关截止节点",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“申报人、单位、推荐机关截止节点”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f005",
      "label": "本案申请标识与原案引用",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“本案申请标识与原案引用”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f006",
      "label": "申请人实名认证标识",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“申请人实名认证标识”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f007",
      "label": "法定姓名、曾用名/异名引用",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“法定姓名、曾用名/异名引用”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f008",
      "label": "身份种类（在职、兼职、博士后、学生、访问等）",
      "kind": "enum",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“身份种类（在职、兼职、博士后、学生、访问等）”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f009",
      "label": "实际聘用/申报依托单位",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“实际聘用/申报依托单位”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f010",
      "label": "职称/职务（含聘用单位）",
      "kind": "enum",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“职称/职务（含聘用单位）”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f011",
      "label": "博士或其他学位事实",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“博士或其他学位事实”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f012",
      "label": "出生日期（仅年龄适用）",
      "kind": "boolean",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“出生日期（仅年龄适用）”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f013",
      "label": "全日制/在职攻读研究生状态",
      "kind": "enum",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“全日制/在职攻读研究生状态”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f014",
      "label": "在站/脱产/在职博士后",
      "kind": "enum",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“在站/脱产/在职博士后”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f015",
      "label": "申报人、PI、主要参与者、普通成员、合作人角色",
      "kind": "enum",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“申报人、PI、主要参与者、普通成员、合作人角色”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f016",
      "label": "项目题目、学科/代码、研究主题",
      "kind": "enum",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“项目题目、学科/代码、研究主题”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f017",
      "label": "申报编号/平台状态",
      "kind": "enum",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“申报编号/平台状态”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f018",
      "label": "本次申请书内容版本、生成时刻",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“本次申请书内容版本、生成时刻”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f019",
      "label": "课题组成员、所属单位和角色",
      "kind": "multi",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“课题组成员、所属单位和角色”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f020",
      "label": "参与成员知情、同意与签字状态",
      "kind": "multi",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“参与成员知情、同意与签字状态”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f021",
      "label": "联合申报/合作单位、法律身份、任务分工",
      "kind": "multi",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“联合申报/合作单位、法律身份、任务分工”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f022",
      "label": "负责人/参与者既有与同年拟申报项目",
      "kind": "multi",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“负责人/参与者既有与同年拟申报项目”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f023",
      "label": "在研、结题、终止、撤项和限制期限",
      "kind": "date",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“在研、结题、终止、撤项和限制期限”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f024",
      "label": "同题、近似研究、交叉申报披露",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“同题、近似研究、交叉申报披露”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f025",
      "label": "当前有效科研失信/禁申决定",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“当前有效科研失信/禁申决定”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f026",
      "label": "伦理审查适用性及有效意见",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“伦理审查适用性及有效意见”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f027",
      "label": "涉密/非涉密及线下办理路由",
      "kind": "enum",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“涉密/非涉密及线下办理路由”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f028",
      "label": "预算制/包干制及当期申报所需预算",
      "kind": "enum",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“预算制/包干制及当期申报所需预算”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f029",
      "label": "生成式 AI 使用及人工核验说明",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“生成式 AI 使用及人工核验说明”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f030",
      "label": "二级单位形式审查/名单结果",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“二级单位形式审查/名单结果”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f031",
      "label": "限额分配和校内评审结果",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“限额分配和校内评审结果”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f032",
      "label": "本次校级推荐/用章签发人",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“本次校级推荐/用章签发人”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f033",
      "label": "校级推荐/不推荐正式决定",
      "kind": "boolean",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“校级推荐/不推荐正式决定”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f034",
      "label": "对外报送是否完成",
      "kind": "boolean",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“对外报送是否完成”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f035",
      "label": "撤回、退回及再提交",
      "kind": "enum",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“撤回、退回及再提交”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f036",
      "label": "补件、退改通知",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“补件、退改通知”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f037",
      "label": "校内异议或外部复审记录",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“校内异议或外部复审记录”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f038",
      "label": "外部受理、初审、资助或不资助结果",
      "kind": "enum",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“外部受理、初审、资助或不资助结果”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f039",
      "label": "B/D·国自然依托单位本年度承诺书的已签署、已上传状态及官方回执",
      "kind": "enum",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“B/D·国自然依托单位本年度承诺书的已签署、已上传状态及官方回执”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f040",
      "label": "A/D·2026 国家社科纸质《申请书》上级提交义务及本校实际收件进度",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“A/D·2026 国家社科纸质《申请书》上级提交义务及本校实际收件进度”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f041",
      "label": "国自然集中批次依托单位申请清单",
      "kind": "enum",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“国自然集中批次依托单位申请清单”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    }
  ],
  "materialSlots": [
    {
      "id": "m001",
      "name": "主管资助计划、申请条件、受理窗口",
      "purpose": "；主管资助计划、申请条件、受理窗口；资助机关；当期原始公告、指南及更正；当前必需 P0，不要求申请人上传；官方法定网页/带文号 PDF 与更正链；F001–F004、F014、F028；SRC005/007/010 及当批主管机关；按年度/批次/子类别锁版本；缺/过期 POLICYUNCONFIRMED，读失败 UNREADABLE；主管资助计划、申请条件、受理窗口；资助机关；当期原始公告、指南及更正；当前必需 P0，不要求申请人上传；官方法定网页/带文号 PDF 与更正链",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      "maxCount": 50,
      "requiredElements": [
        "主管资助计划、申请条件、受理窗口",
        "主管机关",
        "版本",
        "批次"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "m002",
      "name": "学校归口、内部截止和推荐要求",
      "purpose": "；学校归口、内部截止和推荐要求；科发院/社科处；校内当期通知、附件；当前必需 P0，由学校提供；学校正式补充通知或有权经办核原件记录；F002–F004、F031；SRC004/006/008/009/011/014–017；必须记录适用批次；原站 412 为 SOURCEUNAVAILABLE/待人核，不拿外校通知代替；学校归口、内部截止和推荐要求；科发院/社科处；校内当期通知、附件；当前必需 P0，由学校提供；学校正式补充通知或有权经办核原件记录",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      "maxCount": 50,
      "requiredElements": [
        "学校归口、内部截止和推荐要求",
        "批次",
        "附件"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "m003",
      "name": "拟申报内容、申请人及类别",
      "purpose": "；拟申报内容、申请人及类别；申请人/主管系统；最新版电子申请书/平台草稿；当前必需 P1；主管系统正式导出或该批次允许的线下原件；F015–F018、F021、F027–F029；SRC005/007/010；绑定案卷、项目、申请人，hash 变动触发受影响项重审；缺 NEEDSMATERIAL，无法解读 UNREADABLE；拟申报内容、申请人及类别；申请人/主管系统；最新版电子申请书/平台草稿；当前必需 P1；主管系统正式导出或该批次允许的线下原件",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      "maxCount": 50,
      "requiredElements": [
        "拟申报内容、申请人及类别",
        "批次"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "m004",
      "name": "申请人真实身份、单位及任职状态",
      "purpose": "；申请人真实身份、单位及任职状态；学校人事/身份服务；可信主体及岗位/聘用记录；当前必需 P1–P2；非申请人必传；经授权人事部门盖章证明与核验人记录；F006–F009；SRC001/005/007/010；同人 ID+生效日、禁存明文证号；源断 SOURCEUNAVAILABLE，证书与主体不符 CONFLICT；申请人真实身份、单位及任职状态；学校人事/身份服务；可信主体及岗位/聘用记录；当前必需 P1–P2；非申请人必传；经授权人事部门盖章证明与核验人记录",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      "maxCount": 50,
      "requiredElements": [
        "申请人真实身份、单位及任职状态",
        "身份",
        "授权"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "m005",
      "name": "专业技术资格及聘任单位",
      "purpose": "；专业技术资格及聘任单位；学校人事/评聘部门；职称证明；条件必需 P2（项目类别要求职称或为例外依据）；人事权威职称台账签章导出；F010；SRC004/005/007/010；生效日须早于指南适用日；缺且确需 NEEDSMATERIAL，模糊章页 UNREADABLE；专业技术资格及聘任单位；学校人事/评聘部门；职称证明；条件必需 P2（项目类别要求职称或为例外依据）；人事权威职称台账签章导出",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      "maxCount": 50,
      "requiredElements": [
        "专业技术资格及聘任单位",
        "签章"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "m006",
      "name": "已获学位、授予日期",
      "purpose": "；已获学位、授予日期；学位授予/学位信息权威主体；学位证/核验结果；条件必需 P2（凭博士等学位申报）；经授权学位核验系统返回、学校确认公函；F011；SRC004/007/010；不能以预毕业证明冒充学位；日期冲突 CONFLICT，图像不清 UNREADABLE；已获学位、授予日期；学位授予/学位信息权威主体；学位证/核验结果；条件必需 P2（凭博士等学位申报）；经授权学位核验系统返回、学校确认公函",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      "maxCount": 50,
      "requiredElements": [
        "已获学位、授予日期",
        "日期",
        "授权"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "m007",
      "name": "年龄类别计算依据",
      "purpose": "；年龄类别计算依据；人事/身份权威来源；出生日期核验；条件必需 P2（青年等年龄限制）；有权部门核真后的出生日期派生结论；F012；SRC007/010；不留过量身份证扫描；无据不猜测年龄，源断人审；年龄类别计算依据；人事/身份权威来源；出生日期核验；条件必需 P2（青年等年龄限制）；有权部门核真后的出生日期派生结论",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      "maxCount": 50,
      "requiredElements": [
        "年龄类别计算依据",
        "身份",
        "日期"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "m008",
      "name": "全日制/在职攻读、博士后在站状态",
      "purpose": "；全日制/在职攻读、博士后在站状态；研究生院/博士后归口；状态记录；条件必需 P2；有权学籍/博士后管理证明；F008、F013、F014；SRC004/007；截止日时态；无记录 SOURCEUNAVAILABLE，状态冲突 CONFLICT；全日制/在职攻读、博士后在站状态；研究生院/博士后归口；状态记录；条件必需 P2；有权学籍/博士后管理证明",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      "maxCount": 50,
      "requiredElements": [
        "全日制/在职攻读、博士后在站状态"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "m009",
      "name": "兼职、双聘、调动、跨单位依托资格",
      "purpose": "；兼职、双聘、调动、跨单位依托资格；人事及双方单位；聘用关系、依托同意；条件必需 P2（Q11）；有权单位签发的劳动/聘用与申报同意证明；F008、F009、F021；SRC005/007/010；两单位各自文号与有效期；缺不得伪造依托关系，NEEDSHUMANDECISION；兼职、双聘、调动、跨单位依托资格；人事及双方单位；聘用关系、依托同意；条件必需 P2（Q11）；有权单位签发的劳动/聘用与申报同意证明",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      "maxCount": 50,
      "requiredElements": [
        "兼职、双聘、调动、跨单位依托资格"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "m010",
      "name": "在研、同年申报、结项/终止、项目角色",
      "purpose": "；在研、同年申报、结项/终止、项目角色；主管机关/科研台账；查询快照/正式决定；条件必需 P2，涉及限项则不可跳过；带出具机构/时间的项目清单、结项证书及查验意见；F022、F023；SRC001/004/005/007/008/010/015；每项目唯一 ID+状态生效日；源断 SOURCEUNAVAILABLE，过期不能按“零项目”通过；在研、同年申报、结项/终止、项目角色；主管机关/科研台账；查询快照/正式决定；条件必需 P2，涉及限项则不可跳过；带出具机构/时间的项目清单、结项证书及查验意见",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      "maxCount": 50,
      "requiredElements": [
        "在研、同年申报、结项/终止、项目角色",
        "主管机关",
        "时间"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "m011",
      "name": "同题、交叉申报、成员已有项目的本人披露",
      "purpose": "；同题、交叉申报、成员已有项目的本人披露；申请人；限项/重复申报声明；条件必需 P1–P2（批次要求声明）；官方申请书内同等效力承诺栏；F022–F024；SRC001/005/007/010；声明版随 M003；与 M010 不一致 CONFLICT，声明不能替代权威台账；同题、交叉申报、成员已有项目的本人披露；申请人；限项/重复申报声明；条件必需 P1–P2（批次要求声明）；官方申请书内同等效力承诺栏",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      "maxCount": 50,
      "requiredElements": [
        "同题、交叉申报、成员已有项目的本人披露",
        "成员",
        "批次"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "m012",
      "name": "有效禁申/失信处置事实",
      "purpose": "；有效禁申/失信处置事实；科研诚信有权部门；处罚/解除决定及有限查询结果；条件必需 P2（资格审查触发）；非本人上传“无处分证明”；专责部门带效力日的只读结论及引用；F023、F025；SRC001；高敏仅保存允许读的状态/效力；不接收谣言或举报定性，源断人审；有效禁申/失信处置事实；科研诚信有权部门；处罚/解除决定及有限查询结果；条件必需 P2（资格审查触发）；非本人上传“无处分证明”；专责部门带效力日的只读结论及引用",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      "maxCount": 50,
      "requiredElements": [
        "有效禁申/失信处置事实"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "m013",
      "name": "诚信承诺、真实性签署",
      "purpose": "；诚信承诺、真实性签署；申请人及按指南要求的成员；承诺页/官方系统勾选证据；条件必需 P1–P4（项目指南/学校通知要求）；官方平台可核的承诺动作/签署日志；F020、F025；SRC001/005/007；与申请书/人关联；未签 NEEDSMATERIAL，签名真假疑问交人审；诚信承诺、真实性签署；申请人及按指南要求的成员；承诺页/官方系统勾选证据；条件必需 P1–P4（项目指南/学校通知要求）；官方平台可核的承诺动作/签署日志",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      "maxCount": 50,
      "requiredElements": [
        "诚信承诺、真实性签署",
        "成员",
        "签署"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "m014",
      "name": "团队成员身份、角色与真实同意",
      "purpose": "；团队成员身份、角色与真实同意；申请人/参与者/主管系统；成员表、电子邀请或签字；条件必需 P1–P3（存在成员）；能证实本人授权的主管系统日志；F015、F019、F020；SRC005/007/010；逐成员 ID/版本签署；成员名单变更旧同意不自动覆盖，签署不清 UNREADABLE；团队成员身份、角色与真实同意；申请人/参与者/主管系统；成员表、电子邀请或签字；条件必需 P1–P3（存在成员）；能证实本人授权的主管系统日志",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      "maxCount": 50,
      "requiredElements": [
        "团队成员身份、角色与真实同意",
        "身份",
        "版本",
        "授权",
        "成员"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "m015",
      "name": "合作关系、任务分工与资助责任",
      "purpose": "；合作关系、任务分工与资助责任；合作双方；合作协议/项目联合声明；条件必需 P2–P4（合作、跨机构申报）；当期指南认可的联合申报承诺或合同权威引用；F021、F028；SRC003/005/011/016；绑定合作单位与本案版本；是否需双章按指南；合同合法性引用 T07，不由本案裁决；合作关系、任务分工与资助责任；合作双方；合作协议/项目联合声明；条件必需 P2–P4（合作、跨机构申报）；当期指南认可的联合申报承诺或合同权威引用",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      "maxCount": 50,
      "requiredElements": [
        "合作关系、任务分工与资助责任",
        "版本",
        "合同"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "m016",
      "name": "前期成果及与既有课题关联说明",
      "purpose": "；前期成果及与既有课题关联说明；申请人/成果权威平台；公开论文、专利、项目结项记录；条件必需 P1–P3（指南要求或关联审查）；DOI/专利登记/正式成果或原始论文核验；F016、F024；SRC001/005/007；保留页码、成果排序及出处；OCR 不可读 UNREADABLE，AI 相似不能自动判学术不端；前期成果及与既有课题关联说明；申请人/成果权威平台；公开论文、专利、项目结项记录；条件必需 P1–P3（指南要求或关联审查）；DOI/专利登记/正式成果或原始论文核验",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      "maxCount": 50,
      "requiredElements": [
        "前期成果及与既有课题关联说明",
        "成果"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "m017",
      "name": "敏感研究是否获得必要伦理意见",
      "purpose": "；敏感研究是否获得必要伦理意见；伦理专责机构；已签发伦理决定；条件必需 P2–P5（触发伦理审查）；有效伦理批件的签章引用及限定范围；F026；SRC005、G06 既有结论待核；核项目/研究内容版本、时间；意见过期/不匹配人审；绝不由 AI 代签；敏感研究是否获得必要伦理意见；伦理专责机构；已签发伦理决定；条件必需 P2–P5（触发伦理审查）；有效伦理批件的签章引用及限定范围",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      "maxCount": 50,
      "requiredElements": [
        "敏感研究是否获得必要伦理意见",
        "版本",
        "时间",
        "签章",
        "研究内容"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "m018",
      "name": "普通客户端是否必须退出涉密办理",
      "purpose": "；普通客户端是否必须退出涉密办理；保密归口机构；可公开的密级/线下受理元数据；条件必需 P1 起（涉及疑似涉密）；机构提供的“应走线下保密渠道”状态，不含正文；F027；SRC003；不保留涉密申报书、成果、截图；若仅能看到风险词，停止普通上传并移交；普通客户端是否必须退出涉密办理；保密归口机构；可公开的密级/线下受理元数据；条件必需 P1 起（涉及疑似涉密）；机构提供的“应走线下保密渠道”状态，不含正文",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      "maxCount": 50,
      "requiredElements": [
        "普通客户端是否必须退出涉密办理",
        "保密",
        "成果"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "m019",
      "name": "申报预算编制与经费管理方式",
      "purpose": "；申报预算编制与经费管理方式；申请人/财务支持/平台；预算表或预算说明；条件必需 P1–P4（预算制且该阶段要求）；主管系统生成预算/允许的财务审查意见；F028；SRC002/005/010；包干制或未到预算阶段为 NOTAPPLICABLE；金额一致性疑问 CONFLICT；申报预算编制与经费管理方式；申请人/财务支持/平台；预算表或预算说明；条件必需 P1–P4（预算制且该阶段要求）；主管系统生成预算/允许的财务审查意见",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      "maxCount": 50,
      "requiredElements": [
        "申报预算编制与经费管理方式",
        "金额",
        "预算"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "m020",
      "name": "国自然申报中 AI 辅助使用的如实声明与人工核验",
      "purpose": "；国自然申报中 AI 辅助使用的如实声明与人工核验；申请人；申请书声明/来源清单；条件必需 P1–P4（SRC005 适用批次及类型）；当期申报系统认可的声明/引用字段；F029；SRC005；不上传完整提示词史；缺按指南补正，AI 直接生成的申请书不得被本模板认可；国自然申报中 AI 辅助使用的如实声明与人工核验；申请人；申请书声明/来源清单；条件必需 P1–P4（SRC005 适用批次及类型）；当期申报系统认可的声明/引用字段",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      "maxCount": 50,
      "requiredElements": [
        "国自然申报中 AI 辅助使用的如实声明与人工核验",
        "批次"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "m021",
      "name": "匿名论证/评审内容",
      "purpose": "；匿名论证/评审内容；申请人；国家/省社科《课题论证活页》或教育部 B 表，同槽不同载体/收件事件；条件必需 P1–P3（社科及匿名项目）；SRC006 校内初评纸活页单列 deliveryPurpose=CDUTPRELIM；官方平台匿名电子件；2026 国社科 SRC006 校内索引称向学院另交纸质活页3份、教育部 SRC009 校内索引称向社科处另交B表3份，均须有权经办核原件/收件。上级 SRC007/010 不要求向上级提交这些纸件；F016、F018；SRC006/007/008/009/010；锁主 M003 版本、电子/纸版、收件人/交付目的；deliveryPurpose 不同不能互替；校内原件未核时纸件份数 POLICYUNCONFIRMED，身份泄露交人工复审；匿名论证/评审内容；申请人；国家/省社科《课题论证活页》或教育部 B 表，同槽不同载体/收件事件；条件必需 P1–P3（社科及匿名项目）；SRC006 校内初评纸活页单列 deliveryPurpose=CDUTPRELIM；官方平台匿名电子件；2026 国社科 SRC006 校内索引称向学院另交纸质活页3份、教育部 SRC009 校内索引称向社科处另交B表3份，均须有权经办核原件/收件。上级 SRC007/010 不要求向上级提交这些纸件",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      "maxCount": 50,
      "requiredElements": [
        "匿名论证/评审内容",
        "身份",
        "版本"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "m022",
      "name": "成都市 2026 项目规定的封面、单位承诺、负责人承诺及申报审查用章事实",
      "purpose": "；成都市 2026 项目规定的封面、单位承诺、负责人承诺及申报审查用章事实；申报单位/申请人/校级签章部门；签字盖章 PDF；条件必需 P2–P5（SRC011 批次明确要求）；当期市系统认可的正式电子签章原件及学校用章凭据；F018、F032；SRC011；绑定特定申请书版本、四类签署主体；不得把“推荐单位暂不盖章”误作缺章；成都市 2026 项目规定的封面、单位承诺、负责人承诺及申报审查用章事实；申报单位/申请人/校级签章部门；签字盖章 PDF；条件必需 P2–P5（SRC011 批次明确要求）；当期市系统认可的正式电子签章原件及学校用章凭据",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      "maxCount": 50,
      "requiredElements": [
        "成都市 2026 项目规定的封面、单位承诺、负责人承诺及申报审查用章事实",
        "负责人",
        "版本",
        "签章",
        "批次"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "m023",
      "name": "类别特殊附件（外方合作翻译、专项资格、限项佐证等）",
      "purpose": "；类别特殊附件（外方合作翻译、专项资格、限项佐证等）；申请人/外方/相关单位；条件必需 P1–P4（指南逐项触发）；受当期指南认可的原件+签章翻译/机构记录；F014、F021、F024、F028；SRC008/011/014–017；必须记录批次附件名称、来源语言、译文版本、出具人；缺/无法读取分别提示；类别特殊附件（外方合作翻译、专项资格、限项佐证等）；申请人/外方/相关单位；条件必需 P1–P4（指南逐项触发）；受当期指南认可的原件+签章翻译/机构记录",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      "maxCount": 50,
      "requiredElements": [
        "类别特殊附件（外方合作翻译、专项资格、限项佐证等）",
        "版本",
        "签章",
        "批次",
        "附件"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "m024",
      "name": "二级单位初核与名单",
      "purpose": "；二级单位初核与名单；学院/实验室/科研秘书及审核人；单位意见、盖章汇总表；后续才产生 P2，不是 P1 必交；校内有权审核人可核验的批次系统审核日志；F030；SRC003/004/009/015/017；审核人、单位公章、申请清单版本均匹配；申请人自行上传不代表单位签署；二级单位初核与名单；学院/实验室/科研秘书及审核人；单位意见、盖章汇总表；后续才产生 P2，不是 P1 必交；校内有权审核人可核验的批次系统审核日志",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      "maxCount": 50,
      "requiredElements": [
        "二级单位初核与名单",
        "版本",
        "批次",
        "签署"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "m025",
      "name": "限额名额与遴选结果",
      "purpose": "；限额名额与遴选结果；科发院/社科处、学院；配额/排名/评审签章记录；后续才产生 P3（限项才有）；有权机关分配名额文件和正式遴选记录；F031；SRC007/009/015/017；保护非公开评审数据；不出示结果不自动否决个人，转人工；限额名额与遴选结果；科发院/社科处、学院；配额/排名/评审签章记录；后续才产生 P3（限项才有）；有权机关分配名额文件和正式遴选记录",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      "maxCount": 50,
      "requiredElements": [
        "限额名额与遴选结果",
        "签章"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "m026",
      "name": "学校最终推荐、不推荐或退回",
      "purpose": "；学校最终推荐、不推荐或退回；学校授权岗位/归口机构；有权决定、用章或审批日志；后续才产生 P4；官方签章文件、可信审批系统完整审签链；F032、F033；SRC002/003/005/007/010；锁签署人及权限版本、申请书 hash；无真实授权 NEEDSHUMANDECISION；学校最终推荐、不推荐或退回；学校授权岗位/归口机构；有权决定、用章或审批日志；后续才产生 P4；官方签章文件、可信审批系统完整审签链",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      "maxCount": 50,
      "requiredElements": [
        "学校最终推荐、不推荐或退回",
        "版本",
        "签章",
        "授权",
        "签署"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "m027",
      "name": "对外报送事实",
      "purpose": "；对外报送事实；官方申报平台/校方报送经办；状态回执、上传清单；后续才产生 P5；主管机关平台电子回执/纸质收件凭证；F017、F034；SRC005/007/010/011；必须识别“已提交”“已受理”的差别；无回执留待核，不能反推立项；对外报送事实；官方申报平台/校方报送经办；状态回执、上传清单；后续才产生 P5；主管机关平台电子回执/纸质收件凭证",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      "maxCount": 50,
      "requiredElements": [
        "对外报送事实",
        "主管机关"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "m028",
      "name": "撤回/退回/再提交版本事件",
      "purpose": "；撤回/退回/再提交版本事件；有权平台或办理人；状态变更、撤回记录；后续才产生 P6（撤回或退改）；平台可验证操作日志与正式回退通知；F035；SRC011/015/016；关联新旧版本与操作者，不擦旧审查；截止后能否撤回由主管系统判定；撤回/退回/再提交版本事件；有权平台或办理人；状态变更、撤回记录；后续才产生 P6（撤回或退改）；平台可验证操作日志与正式回退通知",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      "maxCount": 50,
      "requiredElements": [
        "撤回/退回/再提交版本事件",
        "版本"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "m029",
      "name": "补正、异议或复核申请与意见",
      "purpose": "；补正、异议或复核申请与意见；申请人/单位/有权复核机关；后续才产生 P6–P7（发生事件时）；正式退回意见、受理单及签章复核结论；F036、F037；SRC004/005/011/013/018/019；问题逐项关联 F/M、时限及处理人；无权审查机关的回复不可当正式复核；补正、异议或复核申请与意见；申请人/单位/有权复核机关；后续才产生 P6–P7（发生事件时）；正式退回意见、受理单及签章复核结论",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      "maxCount": 50,
      "requiredElements": [
        "补正、异议或复核申请与意见",
        "签章"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "m030",
      "name": "外部受理/初审或正式复审结论",
      "purpose": "；外部受理/初审或正式复审结论；资助主管机关；通知、官网结果、外部系统状态；后续才产生 P7；经核实的官方通知文号/平台受理编号；F037、F038；SRC005/007/010/018/019；外部“初审通过”不是立项；来源断连保留 SOURCEUNAVAILABLE；外部受理/初审或正式复审结论；资助主管机关；通知、官网结果、外部系统状态；后续才产生 P7；经核实的官方通知文号/平台受理编号",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      "maxCount": 50,
      "requiredElements": [
        "外部受理/初审或正式复审结论",
        "主管机关"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "m031",
      "name": "最终资助/不予资助文件、获批后补交的签章页/任务书引用",
      "purpose": "；最终资助/不予资助文件、获批后补交的签章页/任务书引用；主管机关、校方有权岗位；后续才产生 P8（获批分支的签章页/任务书）；正式资助文件、获批后签署的电子/纸质页及任务书链接；F038；SRC003/005/007/010/019；资助决定与后置执行件分开归档；未获批不可要求任务书；缺不得回填初审阶段；最终资助/不予资助文件、获批后补交的签章页/任务书引用；主管机关、校方有权岗位；后续才产生 P8（获批分支的签章页/任务书）；正式资助文件、获批后签署的电子/纸质页及任务书链接",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      "maxCount": 50,
      "requiredElements": [
        "最终资助/不予资助文件、获批后补交的签章页/任务书引用",
        "主管机关",
        "签章",
        "任务书",
        "签署"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "m032",
      "name": "国家社科省初评通过后校方追加《申请书》纸质4份",
      "purpose": "；国家社科省初评通过后校方追加《申请书》纸质4份；本人准备、学院统一交社科处；初评名单与纸本签收事件；条件后置 P6，须校方/省管理端已确认“通过省初评”；学校有权机关核验的当批原件、同版纸本及收件记录；SRC013 校方官方索引指出 2026-06-24 17:00 学院报送；F018、F037、F040；SRC006/007/013；绑定省初评决定、纸本与线上指纹、签署/盖章节点；尚未到 P6 不报缺件。原页/附件未读时4份和期限仅作待核配置，POLICYUNCONFIRMED；国家社科省初评通过后校方追加《申请书》纸质4份；本人准备、学院统一交社科处；初评名单与纸本签收事件；条件后置 P6，须校方/省管理端已确认“通过省初评”；学校有权机关核验的当批原件、同版纸本及收件记录；SRC013 校方官方索引指出 2026-06-24 17:00 学院报送",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      "maxCount": 50,
      "requiredElements": [
        "国家社科省初评通过后校方追加《申请书》纸质4份",
        "期限",
        "附件",
        "签署"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "m033",
      "name": "2026 国家社科全国社科办纸质《申请书》3份的上级义务（非校内纸活页）",
      "purpose": "；2026 国家社科全国社科办纸质《申请书》3份的上级义务（非校内纸活页）；申报人/单位/省社科管理机构；可追溯转报凭证；当批网上申报同期上级义务；P1 仅提示，实际校内转报成熟阶段由社科处核定，不得硬派申请人在 P1 交7份；对应 SRC007 的线上同版纸质申报书、学校/省级有权经办的汇总/转报事实，不以纸质活页替代；F018、F040；SRC007/006/013；上级规定3份、校方省初评后4份可在不同交付链并存，关系待社科处确认；不把校方后置4份机械加总为申请人7份；校内收件不明 POLICYUNCONFIRMED；2026 国家社科全国社科办纸质《申请书》3份的上级义务（非校内纸活页）；申报人/单位/省社科管理机构；可追溯转报凭证；当批网上申报同期上级义务；P1 仅提示，实际校内转报成熟阶段由社科处核定，不得硬派申请人在 P1 交7份；对应 SRC007 的线上同版纸质申报书、学校/省级有权经办的汇总/转报事实，不以纸质活页替代",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      "maxCount": 50,
      "requiredElements": [
        "2026 国家社科全国社科办纸质《申请书》3份的上级义务（非校内纸活页）"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "m034",
      "name": "国自然 2026 依托单位年度项目申请承诺书，法定代表人亲签并盖依托单位公章，扫描上传",
      "purpose": "；国自然 2026 依托单位年度项目申请承诺书，法定代表人亲签并盖依托单位公章，扫描上传；学校法人/基金管理岗、基金委信息系统；单位条件必需 P0–P5、报送前完成，每单位当年一次，非个人申报附件；基金委官方平台已上传状态与经有权单位核验的承诺原件；F039；SRC005；年度和依托单位 ID 绑定；无权代理签发不算，失联 SOURCEUNAVAILABLE，不可在申请人 P1 缺件中列出；国自然 2026 依托单位年度项目申请承诺书，法定代表人亲签并盖依托单位公章，扫描上传；学校法人/基金管理岗、基金委信息系统；单位条件必需 P0–P5、报送前完成，每单位当年一次，非个人申报附件；基金委官方平台已上传状态与经有权单位核验的承诺原件",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      "maxCount": 50,
      "requiredElements": [
        "国自然 2026 依托单位年度项目申请承诺书，法定代表人亲签并盖依托单位公章，扫描上传",
        "附件"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "m035",
      "name": "国自然 2026 集中受理依托单位项目申请清单",
      "purpose": "；国自然 2026 集中受理依托单位项目申请清单；学校基金管理岗/基金委信息系统；后续才产生 P5；仅集中批次且在该批申请截止后24小时内报清单，非集中无此要求；基金委系统上传清单的可信回执/有权经办核验记录；F041；SRC005；与单位、批次和各申请书平台编号/版本一致；非集中 NOTAPPLICABLE，尚未截止 NOTAPPLICABLE(reason=FUTURESTAGE)；源断交系统管理岗；国自然 2026 集中受理依托单位项目申请清单；学校基金管理岗/基金委信息系统；后续才产生 P5；仅集中批次且在该批申请截止后24小时内报清单，非集中无此要求；基金委系统上传清单的可信回执/有权经办核验记录",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      "maxCount": 50,
      "requiredElements": [
        "国自然 2026 集中受理依托单位项目申请清单",
        "版本",
        "批次"
      ],
      "allowReuseAcrossSubjects": true
    }
  ],
  "sections": [
    {
      "id": "review-rules",
      "name": "原研究模板审核规则",
      "description": "逐条投影源文档 R001…规则；模板内审查标准不等同校方正式政策。来源及证据状态见 r02Metadata。",
      "order": 0,
      "required": true,
      "criteria": [
        {
          "id": "R001",
          "title": "批次规则存在、版本与有效性",
          "requirement": "T=已定位本批次正式上级申报公告；F=无需纵向申报的非本模板事项；U=仅有标题/索引、修订不明；SRC005/007/010/014；F001–F003；M001；资助机关、年度、类型、文号及更正链一起锁定；不同专项不得借用集中批次旧指南；SRC018/019 仅在 Q14 用作结果/复审依据，不能倒替初始指南；完整可核 PASSFACT；U POLICYUNCONFIRMED；科发院/社科处核当前指南，非本事项转路由",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R002",
          "title": "校内早截止、报送窗口",
          "requirement": "T=当期要求学院/校内提前交；F=可核校方确认无提前节点；U=校本网页/附件不可取得；SRC004/006/008/009/011/015/017；F002–F004；M001/M002；对比同一批次申请人、二级单位、学校与主管机关分别的截止时间和时区，保留时点快照；2025/2026 历史日期不跨年继承；证实节点 PASSFACT；校本附件失联 SOURCEUNAVAILABLE 或时效不明 POLICYUNCONFIRMED；校方科研经办核",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R003",
          "title": "项目类别、申请书与学科代码匹配",
          "requirement": "T=有当前版 M003；F=未建意向/误投横向或教改事项；U=类别无法从材料/指南确定；SRC003/005/007/010/014；F001/F002/F005/F015–F018；M001/M003；对照系统项目类别、主管机关、申请书封面和学科字段；无现行指南中的“类似名称”不能靠模型猜类别；可定位 PASSFACT；错路由转有权经办；缺草稿 NEEDSMATERIAL，版本不明 POLICYUNCONFIRMED；申请人/科研秘书",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R004",
          "title": "申请人与可信账号为同一人",
          "requirement": "T=申报书载明本案负责人；F=仅单位参与、尚无个人申报责任；U=实名账号无法核验；SRC001/005/007/010；F005–F007/F015；M003/M004；比对校方认证主体键与权威人事 ID、姓名/曾用名及申报书，不用同名或 Renderer 的 teacherId 替代；账号状态应覆盖申请提交时点；一致 PASSFACT；不同人 CONFLICT；可信身份源断 SOURCEUNAVAILABLE；人事/身份管理员，不自动合并",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R005",
          "title": "在职身份、依托单位与负责人任职关系",
          "requirement": "T=该项目要求本校作为依托/推荐单位；F=学校仅参与且无单位资格签署职责；U=依托类型或任职关系不明；SRC003/005/007/010；F008/F009/F015；M003/M004/M009；按申报截止时有效劳动/聘用关系与主管系统单位代码核，合作参与分支另转 R010/R018；独立学校人事记录优先自述；一致 PASSFACT；多重关系冲突 CONFLICT；特殊依托资格 NEEDSHUMANDECISION；人事及科研归口",
          "execution": "manual",
          "targetScope": "group"
        },
        {
          "id": "R006",
          "title": "负责人/参与者角色和本校责任界定",
          "requirement": "T=申请人承担项目负责人或明确参与角色；F=该份案卷未形成成员责任；U=申请书和团队表角色不一致；SRC003/005/007/010；F015/F019/F020；M003/M014；使用项目申请 ID+人员 ID+角色+阶段；“课题负责人”“项目负责人”“参与人”不能跨项目制度等同；获批后正式任务书另归邻接业务；角色相符 PASSFACT；自称 PI 但仅成员 CONFLICT；角色授权争议 NEEDSHUMANDECISION；申请人/学院",
          "execution": "manual",
          "targetScope": "group"
        },
        {
          "id": "R007",
          "title": "职称和学位的类别资格事实",
          "requirement": "T=该具体项目类别规定须达到职称/学位条件或允许特殊推荐；F=指南无此门槛；U=项目细则未取得；SRC004/005/007/010；F002/F010/F011；M001/M005/M006/M023；以主管机关指定的资格认定时点比对职称聘用生效日、学位授予日；不得用预计毕业冒充已获学位；无职称/学位者如有推荐人例外须核专项规定；符合事实 PASSFACT；F NOTAPPLICABLE；负事实或例外争议 NEEDSHUMANDECISION；人事与科发院/社科处",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R008",
          "title": "青年/其他年龄类别",
          "requirement": "T=所选青年等类别有年龄限制；F=普通类别不要求年龄；U=年龄口径或对应批次不确定；SRC007/010/014；F002/F012；M001/M007；按官方规定出生日期上/下限及性别等当批定义计算，使用最小必要派生值，临界出生日期交核；不得套教育部阈值至国社科；数值符合 PASSFACT；不适用 NOTAPPLICABLE；临界冲突 CONFLICT 或人审；人事/归口",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R009",
          "title": "学生、在职攻读与博士后资格例外",
          "requirement": "T=F008 指学生/在职攻读/博士后或资助指南点名例外；F=普通在职身份且无例外；U=在站/在读状态不能核；SRC004/005/007；F008/F013/F014；M001/M004/M008/M023；以申请截止日为基准核全日制、在职、博士后在站与依托要求；特定类别导师同意或推荐须原指南明列；不能普遍准许/禁止学生；状态已核 PASSFACT（仅状态事实）；例外条件未知 POLICYUNCONFIRMED；学籍/博士后和归口人审",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R010",
          "title": "多单位聘用、兼职及合作依托同意",
          "requirement": "T=存在双聘、外单位依托或我校仅合作；F=权威证明仅有一处适用单位；U=两单位关系缺证；SRC003/005/007/010；F008/F009/F021；M004/M009/M015；核申报时点双方有权单位、合作角色、签章授权及特殊申报许可；不能以本人承诺代替另一单位公函；同意链完整 PASSFACT；互斥依托 CONFLICT；是否获准 NEEDSHUMANDECISION；人事/合作单位/科发院",
          "execution": "manual",
          "targetScope": "group"
        },
        {
          "id": "R011",
          "title": "项目题目、学科方向与申报书同版",
          "requirement": "T=当批有主题/学科代码或类型范围；F=不存在该约束的开放选题分支；U=指南未核；SRC005/007/010/014/016；F002/F016/F018；M001/M003/M016；对比封面、正文、官方申请代码/选题目录与版本号；可自动检字段一致性，不对学术质量作实体评审；一致 PASSFACT；主题是否适格争议 NEEDSHUMANDECISION；申请人/学科评审归口",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R012",
          "title": "限项与在研项目、结项时态",
          "requirement": "T=当批有计项/同年申报/在研排斥规则；F=经现行指南证明该类别不限制；U=规则、例外或跨平台项目库不可核；SRC004/005/007/008/010/015/017；F002/F015/F022/F023；M001/M010；按主管机关、资助类别、身份角色、在研或结项/终止效力日组成集合比对，不能把参与者计成全部 PI 或用本人零项目申明代替机关台账；核实集合 PASSFACT（可附负面事实）；源断 SOURCEUNAVAILABLE；资格影响 NEEDSHUMANDECISION；科研项目归口",
          "execution": "semantic",
          "targetScope": "group"
        },
        {
          "id": "R013",
          "title": "同题、交叉申请、重复成果披露",
          "requirement": "T=有同题/同年/前期成果披露义务或检测线索；F=不存在需披露事项且指南不要求；U=既有课题/成果无法核；SRC001/005/007/010；F016/F022/F024；M003/M010/M011/M016；以正式项目题目、研究内容、承担人和成果文献作可追溯关联；相似度只产生提示，不能自动认定违规或重复立项；事实一致 PASSFACT；不同源相斥 CONFLICT；实质重复与否 NEEDSHUMANDECISION；学科专家/诚信归口",
          "execution": "manual",
          "targetScope": "group"
        },
        {
          "id": "R014",
          "title": "当前有效禁申/失信处分事实",
          "requirement": "T=当批主管机关存在适用的禁申条款；F=有权机关确认本案无须此查询且无相关限制；U=决定效力或查询权限未知；SRC001/005/007/010；F023/F025；M001/M012；只读专责机关正式处置、解除/生效/截止日，举报和未结调查不是有效惩戒；敏感原文不进普通案卷；许可范围内事实 PASSFACT；已有处分且效力争议 NEEDSHUMANDECISION；诚信主管部门",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R015",
          "title": "真实性、诚信承诺是否由本人完成",
          "requirement": "T=当前指南要求申请人/成员签承诺；F=该阶段不要求承诺；U=签署方式/人员范围未核；SRC001/005/007；F020/F025；M003/M013/M014；比对平台本人签署事件或官方签章，绑定当版申请人/成员/日期；文本勾选与实体本人真实性分开判断；签署事实可核 PASSFACT；应交未交 NEEDSMATERIAL；冒签风险 NEEDSHUMANDECISION；申请人/学院",
          "execution": "manual",
          "targetScope": "group"
        },
        {
          "id": "R016",
          "title": "国自然 AI 辅助使用声明",
          "requirement": "T=当批科学基金指南明确适用生成式 AI 使用声明；F=其他未要求的资助类别；U=指南版本无法确认；SRC005；F002/F018/F029；M001/M003/M020；核当批要求的申明与真实人工核验责任、引用文献出处；不要求上传完整提示词，模型无法证明研究者确已核真；明确声明 PASSFACT（仅形式事实）；缺件 NEEDSMATERIAL；真实性疑义 NEEDSHUMANDECISION；申请人/基金经办",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R017",
          "title": "团队成员身份、角色、同意",
          "requirement": "T=该案有参与成员或明确要求成员签认；F=官方允许单独申报且无成员；U=成员表/签字不一致；SRC005/007/010；F015/F019/F020；M003/M014；每名成员以可信主体/外部身份标识、组织、项目角色和有效同意对应同版 M003；新版增删成员即使旧签名存在也重核；逐人一致 PASSFACT；未得必需授权 NEEDSMATERIAL；签字真实性/旧版冲突交学院或有权平台",
          "execution": "manual",
          "targetScope": "group"
        },
        {
          "id": "R018",
          "title": "合作/联合申请及外方主体",
          "requirement": "T=存在外部合作单位、外方或联合申请类别；F=无合作要求；U=协议/单位身份不明；SRC003/005/010/016；F009/F021/F028；M003/M009/M015；核合作单位代码、任务分工和当期有效协议/同意、签署人身份及版本；合同合法性只读引用 T07 已作结论；对应事实 PASSFACT；协作矛盾 CONFLICT；签署法律效力交 T07/校方归口",
          "execution": "manual",
          "targetScope": "group"
        },
        {
          "id": "R019",
          "title": "匿名活页/教育部 B 表版本、匿名性与校内初评载体",
          "requirement": "T=国家/省社科或教育部需匿名评审件；F=所选类别无匿名件；U=校本纸电收件要求未核；SRC006/007/008/009/010；F016/F018；M001/M002/M003/M021；核 M021 电子匿名件同 M003 题目/版本，查姓名单位泄露；上级 SRC007 不要求纸活页，但校方 SRC006 索引单列 P1 学院初评活页3份，教育部 SRC010 上级免纸件但 SRC009 索引列校内 B 表3份；分别存 deliveryPurpose/receiver，不能以国家端无纸件覆盖校内初评；电子版可核 PASSFACT；匿名冲突 CONFLICT；校内纸件仅凭索引为 POLICYUNCONFIRMED，获校方核原件后按成熟节点判缺；申请人/社科处",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R020",
          "title": "预算制与包干制申报预算材料",
          "requirement": "T=该项目为预算制且本阶段要求预算件；F=当批包干制或预算后置；U=制度/项目分类不明；SRC002/005/010；F002/F028；M001/M003/M019；将预算版本、金额合计与当期表单对照；财务合规、报销、经费批复转引用 G07，不越权审定经费；字段一致 PASSFACT；F NOTAPPLICABLE；缺件 NEEDSMATERIAL；财务归口核争议",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R021",
          "title": "项目所需伦理审查结论",
          "requirement": "T=项目内容经有权程序认定属于需伦理审查；F=专责机构确认无需；U=适用性或意见效力未知；SRC005/001；F016/F026；M003/M017；仅引用伦理机构对该项目研究内容同一版本、有效期限的批件或不适用意见；不由模型判断伦理许可或替 G06 作结论；有效引用 PASSFACT；未定 NEEDSHUMANDECISION；伦理专责部门，必要时暂停报送",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R022",
          "title": "起涉密线下路由",
          "requirement": "T=有权部门确认涉密或普通系统观察到疑似涉密提示；F=有权机构证实可走普通非涉密流程；U=密级归属未确定；SRC003（限定适用重大项目）；F027；M003/M018；只保留安全路由元数据与涉密载体外部引用；疑涉密时不得继续 OCR/导出/存储正文，先行隔离而非读尽文件；需线下 NEEDSHUMANDECISION；F 才继续普通流程；保密归口负责人",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R023",
          "title": "专项附件和翻译完整性",
          "requirement": "T=当批指南明确外方原件/译文、推荐信或专项证明；F=没有此专项条件；U=附件目录/译文效力未核；SRC008/011/014–017；F002/F014/F021/F024/F028；M001/M002/M023；按指南逐项列原件、中文译本、翻译/盖章主体、语言、页码、版本；不从邻校模板借清单；齐全可读 PASSFACT；缺现阶段件 NEEDSMATERIAL；外文不可识别 UNREADABLE；项目归口",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R024",
          "title": "成都市项目分角色签字/公章和阶段",
          "requirement": "T=SRC011 的2026第二批市项目；F=其他批次；U=校方原页/附件或授权不明；SRC011；F018/F032；M002/M003/M022/M026；官方学校索引“三（二）”区分封面单位章、单位承诺章、负责人签章、申报审查页单位章+法人签署、合作单位章；推荐单位当前暂不盖章。分别核对应页与版号、签署角色/授权，不能因推荐单位暂未盖章认定缺件；可核物理签署事实 PASSFACT；附件版不明 POLICYUNCONFIRMED；真实签署权 NEEDSHUMANDECISION；校级用章岗位",
          "execution": "manual",
          "targetScope": "group"
        },
        {
          "id": "R025",
          "title": "二级单位形式初核、名单效力",
          "requirement": "T=校方当批要求院系初审/名单；F=经校本正式确认该类型直报；U=校内组织流程未知；SRC003/004/009/015/017；F005/F018/F030；M002/M003/M024；核学院与申请人组织匹配、名单页/章、审签人权限及申请书版；初核只能在 P2 形成，P1 不以其缺失阻断草稿；单位初核事实 PASSFACT；未签 NEEDSHUMANDECISION；二级单位有权岗位",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R026",
          "title": "校内限额/排序/回避事实",
          "requirement": "T=该批确有指标且有效申请多于可推荐数量或规定须遴选；F=无校内限额/无需排序；U=限额数、原始评审程序或校本通知时效未知；SRC002/007/009/015/017；F002/F004/F030/F031；M002/M024/M025；核配额版本、二级单位名单、评委回避与签发机构，不据 AI 评分替单位排序；“63项”仅是未核的 2026 校本检索值；存在可追溯结果 PASSFACT（不是推荐）；名额不明 POLICYUNCONFIRMED；排序/回避交正式评委/归口",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R027",
          "title": "校级推荐/不推荐正式决定权限",
          "requirement": "T=案卷已到正式校级推荐节点；F=P1/P2/P3 尚不需本结果；U=实际岗位委托链缺失；SRC002/003/005/007/010；F018/F032/F033；M003/M024/M025/M026；后端核签发 actor、单位、批次、委托生效日、前置意见、决策所基于的 M003 版本，保留原签章；Renderer 和 OCR 字段无授权力；仅核“正式记录存在” PASSFACT；尚待决定 NEEDSHUMANDECISION；真正有权的校级岗位签发",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R028",
          "title": "对外报送/受理分层",
          "requirement": "T=案卷已被授权进入资助平台报送；F=P1–P4 尚未对外提交；U=平台权限和回执不可核；SRC005/007/010/011；F017/F018/F033/F034；M003/M026/M027；以平台申请 ID、账号、提交时刻、回执状态和申请书 hash 对照；校方“已发送”≠资助机关“已受理”；官方报送事实 PASSFACT；无回执 SOURCEUNAVAILABLE；授权可疑 NEEDSHUMANDECISION；校内平台管理员",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R029",
          "title": "主从材料版一致、旧审核依赖失效",
          "requirement": "T=M003/F018 或任何证据件版改变；F=证据指纹和引用均未变；U=无法核新旧件属于同一申请；SRC001/005/007/010；F005/F015–F021/F028/F030–F034；M003/M013–M016/M019–M024/M026/M027/M032；比对同一案卷、成员/合作/预算/签章签署对象及 hash、审批引用版；仅使依赖它的 R 旧事实判断失效，正式决定以新事件核撤回/重签，不擦原件；受影响项待重审 NEEDSHUMANDECISION 或 CONFLICT；无变化 NOTAPPLICABLE；申请人补件、原签署人复核",
          "execution": "manual",
          "targetScope": "group"
        },
        {
          "id": "R030",
          "title": "退回/补正事项与正确责任人",
          "requirement": "T=正式通知要求针对特定 F/M 补正；F=未发生补件事件；U=退回意见来源、对象或截止日不明；SRC004/011/013；F018/F035/F036；M003/M028/M029；核退回主体、问题编号、原材料版/页、补件目标和合法期限；只向持有人索取当前应交件，不强索上级后置文件；可执行待办 PASSFACT（仅核通知事实）；模糊目标 NEEDSHUMANDECISION；申请人/学院/归口分派",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R031",
          "title": "撤回、重提交的真实主体、平台状态和时限",
          "requirement": "T=本人申请撤回、平台退回或新提交；F=未发生事件；U=是否仍可撤回或当前平台状态不明；SRC011/015/016；F005/F017/F018/F035；M003/M027/M028；SRC011 校方索引称“待申报单位审核/待推荐单位审核/待窗口审核/待业务处室审核”可由负责人按平台权限撤回；“已受理”须先联系市科技窗口回退状态，且有申报单位截止界限。逐状态只核官方事件是否发生；其他省市/基金项目另行配置，不由本案模拟撤回；有可信平台事件 PASSFACT；回执源断 SOURCEUNAVAILABLE；已受理回退/真正撤回效力交窗口和归口 NEEDSHUMANDECISION",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R032",
          "title": "国家社科省初评后校本追加申请书纸本",
          "requirement": "T=2026国家社科省初评通过且校方确认适用 SRC013 的4份转报程序；F=省初评未通过或非此批次；U=初评决定、学校原件/收件时点待核；SRC006/007/013；F018/F037/F040；M003/M029/M032/M033；依官方校方索引，2026-06-15 通知“通过省评→申请书4份同版→学院6月24日17:00前统一交社科处”。严格核省初评状态、纸本同电子版、签名与收件；因原站412，本轮不得自动按4份拒绝，更不能把此 P6 义务前置 P1 或抵销 SRC007 3份上级义务；到真实阶段且原件可核才 PASSFACT/NEEDSMATERIAL；原件/转报关系不明 POLICYUNCONFIRMED；社科处/学院",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R033",
          "title": "不予受理/不予资助复审的不同路径",
          "requirement": "T=有官方不予受理或不予资助决定且本人提出复审；F=无不利外部决定或未申请复审；U=外部状态/程序通知不明；SRC005/018/019；F006/F017/F035/F037/F038；M004/M027/M029/M030/M031；国自然 2026 不予受理复审 05-15 16:00、不予资助复审 09-15 16:00，分别核申请人本人、线上表、纸件本人签字、邮戳/平台提交；学术判断不同意见不能当成法定复审理由；仅引用主管机关审查结果；程序事实 PASSFACT；缺件 NEEDSMATERIAL；超时/实体理由由基金委 NEEDSHUMANDECISION；申请人/外部机关，校内仅协助",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R034",
          "title": "外部受理、评审资助结果与移交",
          "requirement": "T=外部主管机关已形成可核正式受理/初审/资助或不资助决定；F=仍处于校内草稿/推荐而无上级结果；U=官网结果未公布或查询不可得；SRC003/005/007/010/018/019；F017/F033/F034/F038；M026/M027/M030/M031；核发文机关、项目 ID、结果类别、名单或通知效力及资助项目清单；2026 集中评审未覆盖的类型不得推成“不资助”；任务书和执行事项仅引用并移交 T03 邻接业务；外部事实可核 PASSFACT；仅校方推荐 NOTAPPLICABLE 于外部决定核验；不可访问 SOURCEUNAVAILABLE；科研归口只读归档",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R035",
          "title": "提示、P4–P5 国家社科上级纸质《申请书》转报义务",
          "requirement": "T=SRC007 2026国家社科年度网报；F=其他资助批次；U=本校何时汇总/省社科办如何转报未核；SRC007 第十三、十五、十六项/006/013；F002/F018/F040；M001/M002/M003/M033；全国社科办规定网上申报同时须有纸质《申请书》3份且内容一致、活页不必向其报纸本，省级管理机构汇总报送；SRC006 校内先收活页3份、SRC013 初评后收申请书4份，分清收件人和目的，核学校是否以初评后4份履行上级3份转报、剩余份数如何归档，不能推导个人要交7份；真实上级义务可核 PASSFACT（要求存在）；实际校内收件/转报链未核 POLICYUNCONFIRMED，到了确认节点才按缺件分流；社科处/省管理机构",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R036",
          "title": "国自然2026依托单位年度承诺书",
          "requirement": "T=国自然2026且学校是依托单位，进入其正式申报报送前；F=其他资助机关；U=基金委平台年度上传状态/法人签章权限不可核；SRC005 第一部分（三）3；F001/F002/F039；M001/M034；官方2026依托单位承诺书由法定代表人本人签字并加盖单位公章、依托单位年度上传一次；按依托单位 ID、年度与官方回执核；不是每位申请人 P1 的个人附件，学校用章权限另外核；人审必要时检查法人委托情形官方是否接受；单位义务事实 PASSFACT；尚待有权签发 NEEDSHUMANDECISION；已上传状态源断 SOURCEUNAVAILABLE；学校基金管理岗/法人签章岗位",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R037",
          "title": "国自然2026集中批次依托单位项目申请清单",
          "requirement": "T=该年度集中受理项目且主管机关集中截止已到；F=非集中期项目或未到集中截止节点；U=平台是否要求或清单回执不可核；SRC005 第一部分（三）4；F002/F004/F017/F041；M001/M027/M035；主管机关规定集中申报截止后24小时内依托单位在线提交本单位项目申请清单；以学校官方平台有权报送账号和清单包含的申请 ID/批次版比对；非集中“确认提交电子申请书即正式提交”无需额外清单；已正式报送 PASSFACT；未到阶段或非集中 NOTAPPLICABLE；回执失联 SOURCEUNAVAILABLE；学校基金管理岗/官方平台，不向个人索件",
          "execution": "manual",
          "targetScope": "case"
        }
      ]
    }
  ],
  "policyVersionIds": [],
  "stages": [
    {
      "id": "stage-p0",
      "name": "批次依据生效",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "stage-p1",
      "workflowOwner": "local"
    },
    {
      "id": "stage-p1",
      "name": "意向及草拟",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "stage-p2",
      "workflowOwner": "local"
    },
    {
      "id": "stage-p2",
      "name": "资格与单位初核",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "stage-p3",
      "workflowOwner": "local"
    },
    {
      "id": "stage-p3",
      "name": "限项遴选",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "stage-p4",
      "workflowOwner": "local"
    },
    {
      "id": "stage-p4",
      "name": "学校推荐/报送审批",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "stage-p5",
      "workflowOwner": "local"
    },
    {
      "id": "stage-p5",
      "name": "资助平台提交",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "stage-p6",
      "workflowOwner": "local"
    },
    {
      "id": "stage-p6",
      "name": "退回、补正、撤回、复核",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "stage-p7",
      "workflowOwner": "local",
      "returnToStageId": "stage-p2"
    },
    {
      "id": "stage-p7",
      "name": "外部受理/初审/评审",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "stage-p8",
      "workflowOwner": "local"
    },
    {
      "id": "stage-p8",
      "name": "批次归档/移交",
      "kind": "manual-review",
      "executorRole": "teacher",
      "workflowOwner": "local"
    }
  ],
  "outputs": [
    {
      "id": "criterion-findings",
      "kind": "item-feedback",
      "audience": "reviewer"
    },
    {
      "id": "supplement-checklist",
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
  "templateId": "T03-T01",
  "name": "纵向科研项目申报、负责人资格和推荐审核",
  "sourceDocumentPath": "docs/design/review-agent/business-templates/R02/T03-T01.md",
  "sourceOriginalPath": "docs/design/review-agent/business-templates/R02/research-original/T03-T01.md",
  "sourceDocumentSha256": "1013e8751e69cfcb11988a864616427c3b6ba0018fd07615fb2d17e1512a4ec0",
  "sourceDocumentBytes": 165363,
  "officialSchoolTemplate": false,
  "researchEvidenceStatus": "PARTIAL",
  "policyEvidenceStatus": "PARTIAL",
  "authoringStatus": "RESEARCH_HANDOFF_READY",
  "criteria": [
    {
      "sectionId": "review-rules",
      "criterionId": "R001",
      "srcIds": [
        "SRC-005",
        "SRC-007",
        "SRC-010",
        "SRC-014",
        "SRC-018",
        "SRC-019"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R002",
      "srcIds": [
        "SRC-004",
        "SRC-006",
        "SRC-008",
        "SRC-009",
        "SRC-011",
        "SRC-015",
        "SRC-017"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R003",
      "srcIds": [
        "SRC-003",
        "SRC-005",
        "SRC-007",
        "SRC-010",
        "SRC-014"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R004",
      "srcIds": [
        "SRC-001",
        "SRC-005",
        "SRC-007",
        "SRC-010"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R005",
      "srcIds": [
        "SRC-003",
        "SRC-005",
        "SRC-007",
        "SRC-010"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R006",
      "srcIds": [
        "SRC-003",
        "SRC-005",
        "SRC-007",
        "SRC-010"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R007",
      "srcIds": [
        "SRC-004",
        "SRC-005",
        "SRC-007",
        "SRC-010"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R008",
      "srcIds": [
        "SRC-007",
        "SRC-010",
        "SRC-014"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R009",
      "srcIds": [
        "SRC-004",
        "SRC-005",
        "SRC-007"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R010",
      "srcIds": [
        "SRC-003",
        "SRC-005",
        "SRC-007",
        "SRC-010"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R011",
      "srcIds": [
        "SRC-005",
        "SRC-007",
        "SRC-010",
        "SRC-014",
        "SRC-016"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R012",
      "srcIds": [
        "SRC-004",
        "SRC-005",
        "SRC-007",
        "SRC-008",
        "SRC-010",
        "SRC-015",
        "SRC-017"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R013",
      "srcIds": [
        "SRC-001",
        "SRC-005",
        "SRC-007",
        "SRC-010"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R014",
      "srcIds": [
        "SRC-001",
        "SRC-005",
        "SRC-007",
        "SRC-010"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R015",
      "srcIds": [
        "SRC-001",
        "SRC-005",
        "SRC-007"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R016",
      "srcIds": [
        "SRC-005"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R017",
      "srcIds": [
        "SRC-005",
        "SRC-007",
        "SRC-010"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R018",
      "srcIds": [
        "SRC-003",
        "SRC-005",
        "SRC-010",
        "SRC-016"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R019",
      "srcIds": [
        "SRC-006",
        "SRC-007",
        "SRC-008",
        "SRC-009",
        "SRC-010"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R020",
      "srcIds": [
        "SRC-002",
        "SRC-005",
        "SRC-010"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R021",
      "srcIds": [
        "SRC-001",
        "SRC-005"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R022",
      "srcIds": [
        "SRC-003"
      ],
      "evidenceStatus": "VERIFIED"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R023",
      "srcIds": [
        "SRC-008",
        "SRC-011",
        "SRC-014"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R024",
      "srcIds": [
        "SRC-011"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R025",
      "srcIds": [
        "SRC-003",
        "SRC-004",
        "SRC-009",
        "SRC-015",
        "SRC-017"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R026",
      "srcIds": [
        "SRC-002",
        "SRC-007",
        "SRC-009",
        "SRC-015",
        "SRC-017"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R027",
      "srcIds": [
        "SRC-002",
        "SRC-003",
        "SRC-005",
        "SRC-007",
        "SRC-010"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R028",
      "srcIds": [
        "SRC-005",
        "SRC-007",
        "SRC-010",
        "SRC-011"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R029",
      "srcIds": [
        "SRC-001",
        "SRC-005",
        "SRC-007",
        "SRC-010"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R030",
      "srcIds": [
        "SRC-004",
        "SRC-011",
        "SRC-013"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R031",
      "srcIds": [
        "SRC-011",
        "SRC-015",
        "SRC-016"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R032",
      "srcIds": [
        "SRC-006",
        "SRC-007",
        "SRC-013"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R033",
      "srcIds": [
        "SRC-005",
        "SRC-018",
        "SRC-019"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R034",
      "srcIds": [
        "SRC-003",
        "SRC-005",
        "SRC-007",
        "SRC-010",
        "SRC-018",
        "SRC-019"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R035",
      "srcIds": [
        "SRC-006",
        "SRC-007",
        "SRC-013"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R036",
      "srcIds": [
        "SRC-005"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R037",
      "srcIds": [
        "SRC-005"
      ],
      "evidenceStatus": "PARTIAL"
    }
  ]
} as const

export { templateVersion as template }
export default templateVersion
