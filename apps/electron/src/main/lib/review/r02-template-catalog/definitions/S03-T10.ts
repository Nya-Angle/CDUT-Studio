import type { TemplateVersion } from '@profer/shared'

/** 本地研究模板；不代表学校已发布或授权。 */
export const S03T10: TemplateVersion = {
  "templateId": "S03-T10",
  "version": 1,
  "schemaVersion": 2,
  "name": "临时困难补助和应急救助申请审核",
  "description": "临时困难补助和应急救助申请审核。本地研究模板 · 非校方正式模板。仅供事实核验和人工复核建议；不得代替校本制度或正式决定。",
  "catalogKind": "builtin",
  "sourceNote": "R02_RESEARCH_TEMPLATE_NONOFFICIAL: 来源 docs/design/review-agent/business-templates/R02/research-original/S03-T10.md；非校方正式模板。政策证据 PARTIAL；当期校本授权和最终决定未确认，不创建政策版本，不作学校远端回写。",
  "objectType": "person",
  "displayName": {
    "template": "{{applicantStudentId}} · 临时困难补助和应急救助申请审核"
  },
  "fields": [
    {
      "key": "applicantStudentId",
      "label": "applicantStudentId（F001）",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case"
    },
    {
      "key": "applicantName",
      "label": "applicantName（F002）",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case"
    },
    {
      "key": "educationStage",
      "label": "educationStage（F003）",
      "kind": "enum",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "options": [
        {
          "value": "本科",
          "label": "本科"
        },
        {
          "value": "研究生",
          "label": "研究生"
        },
        {
          "value": "其他",
          "label": "其他"
        },
        {
          "value": "未知",
          "label": "未知"
        }
      ]
    },
    {
      "key": "enrollmentStatus",
      "label": "enrollmentStatus（F004）",
      "kind": "enum",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "options": [
        {
          "value": "在籍在校",
          "label": "在籍在校"
        },
        {
          "value": "异动",
          "label": "异动"
        },
        {
          "value": "其他",
          "label": "其他"
        },
        {
          "value": "未知",
          "label": "未知"
        }
      ]
    },
    {
      "key": "affiliation",
      "label": "affiliation（F005）",
      "kind": "object",
      "required": false,
      "visibility": "public",
      "scope": "case"
    },
    {
      "key": "requestActorId",
      "label": "requestActorId（F006）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case"
    },
    {
      "key": "requestCapacity",
      "label": "requestCapacity（F007）",
      "kind": "enum",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "options": [
        {
          "value": "本人",
          "label": "本人"
        },
        {
          "value": "经授权代理",
          "label": "经授权代理"
        },
        {
          "value": "工作人员代录",
          "label": "工作人员代录"
        },
        {
          "value": "未知",
          "label": "未知"
        }
      ]
    },
    {
      "key": "applicationId",
      "label": "applicationId（F008）",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case"
    },
    {
      "key": "eventType",
      "label": "eventType（F009）",
      "kind": "enum",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "options": [
        {
          "value": "灾害",
          "label": "灾害"
        },
        {
          "value": "家庭变故",
          "label": "家庭变故"
        },
        {
          "value": "本人疾病",
          "label": "本人疾病"
        },
        {
          "value": "其他",
          "label": "其他"
        },
        {
          "value": "未知",
          "label": "未知"
        }
      ]
    },
    {
      "key": "eventDate",
      "label": "eventDate（F010）",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case"
    },
    {
      "key": "eventLocation",
      "label": "eventLocation（F011）",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case"
    },
    {
      "key": "eventNarrative",
      "label": "eventNarrative（F012）",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case"
    },
    {
      "key": "affectedPersonRelation",
      "label": "affectedPersonRelation（F013）",
      "kind": "enum",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "options": [
        {
          "value": "本人",
          "label": "本人"
        },
        {
          "value": "父母",
          "label": "父母"
        },
        {
          "value": "监护人",
          "label": "监护人"
        },
        {
          "value": "其他亲属",
          "label": "其他亲属"
        },
        {
          "value": "其他",
          "label": "其他"
        },
        {
          "value": "未知",
          "label": "未知"
        }
      ]
    },
    {
      "key": "impactOnStudyLife",
      "label": "impactOnStudyLife（F014）",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case"
    },
    {
      "key": "urgencyLevel",
      "label": "urgencyLevel（F015）",
      "kind": "enum",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "options": [
        {
          "value": "安全紧急",
          "label": "安全紧急"
        },
        {
          "value": "生活急需",
          "label": "生活急需"
        },
        {
          "value": "常规",
          "label": "常规"
        },
        {
          "value": "未知",
          "label": "未知"
        }
      ]
    },
    {
      "key": "evidenceIssuer",
      "label": "evidenceIssuer（F016）",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case"
    },
    {
      "key": "lossOrHealthFact",
      "label": "lossOrHealthFact（F017）",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case"
    },
    {
      "key": "claimedFinancialBurden",
      "label": "claimedFinancialBurden（F018）",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case"
    },
    {
      "key": "insuranceProcessingStatus",
      "label": "insuranceProcessingStatus（F019）",
      "kind": "enum",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "options": [
        {
          "value": "未申请",
          "label": "未申请"
        },
        {
          "value": "办理中",
          "label": "办理中"
        },
        {
          "value": "已结算",
          "label": "已结算"
        },
        {
          "value": "不涉及",
          "label": "不涉及"
        },
        {
          "value": "未知",
          "label": "未知"
        }
      ]
    },
    {
      "key": "insurerDeterminedPayout",
      "label": "insurerDeterminedPayout（F020）",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case"
    },
    {
      "key": "hardshipRecognitionRef",
      "label": "hardshipRecognitionRef（F021）",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case"
    },
    {
      "key": "otherAidDecisionRef",
      "label": "otherAidDecisionRef（F022）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case"
    },
    {
      "key": "fundingBatchKey",
      "label": "fundingBatchKey（F023）",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case"
    },
    {
      "key": "applicablePolicyVersion",
      "label": "applicablePolicyVersion（F024）",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "case"
    },
    {
      "key": "materialSourceId",
      "label": "materialSourceId（F025）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case"
    },
    {
      "key": "evidenceLocator",
      "label": "evidenceLocator（F026）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case"
    },
    {
      "key": "reviewerActorId",
      "label": "reviewerActorId（F027）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case"
    },
    {
      "key": "reviewerOpinion",
      "label": "reviewerOpinion（F028）",
      "kind": "enum",
      "required": false,
      "visibility": "internal",
      "scope": "case"
    },
    {
      "key": "schoolDecisionId",
      "label": "schoolDecisionId（F029）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case"
    },
    {
      "key": "schoolDecisionResult",
      "label": "schoolDecisionResult（F030）",
      "kind": "enum",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "options": [
        {
          "value": "同意",
          "label": "同意"
        },
        {
          "value": "不同意",
          "label": "不同意"
        },
        {
          "value": "退回",
          "label": "退回"
        },
        {
          "value": "其他",
          "label": "其他"
        }
      ]
    },
    {
      "key": "approvedGrantAmount",
      "label": "approvedGrantAmount（F031）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case"
    },
    {
      "key": "disbursementOutcome",
      "label": "disbursementOutcome（F032）",
      "kind": "enum",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "options": [
        {
          "value": "待处理",
          "label": "待处理"
        },
        {
          "value": "成功",
          "label": "成功"
        },
        {
          "value": "失败",
          "label": "失败"
        },
        {
          "value": "未知",
          "label": "未知"
        }
      ]
    },
    {
      "key": "withdrawalIntentAt",
      "label": "withdrawalIntentAt（F033）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case"
    },
    {
      "key": "correctionOrAppealReason",
      "label": "correctionOrAppealReason（F034）",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case"
    },
    {
      "key": "precedingApplicationRef",
      "label": "precedingApplicationRef（F035）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case"
    },
    {
      "key": "sourceVersionRelation",
      "label": "sourceVersionRelation（F036）",
      "kind": "object",
      "required": false,
      "visibility": "internal",
      "scope": "case"
    },
    {
      "key": "submittedAt",
      "label": "submittedAt（F037）",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case"
    },
    {
      "key": "materialProcessingState",
      "label": "materialProcessingState（F038）",
      "kind": "enum",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "options": [
        {
          "value": "收到",
          "label": "收到"
        },
        {
          "value": "缺失",
          "label": "缺失"
        },
        {
          "value": "不可读",
          "label": "不可读"
        },
        {
          "value": "来源失联",
          "label": "来源失联"
        },
        {
          "value": "已替换",
          "label": "已替换"
        }
      ]
    },
    {
      "key": "reconsiderationDecisionRef",
      "label": "reconsiderationDecisionRef（F039）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case"
    },
    {
      "key": "urgentContactLogRef",
      "label": "urgentContactLogRef（F040）",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case"
    }
  ],
  "materialSlots": [
    {
      "id": "M001",
      "name": "证明谁在何时提出何种申请",
      "purpose": "证明谁在何时提出何种申请；学校学工系统/学生本人操作；认证提交事件和表单正文；L1 **当前核心**；C05 L0 尚未形成；有可信学工系统记录直接引用；纸质/线下是否正式等效待资助中心确认；F001、F006～F009、F012、F014、F015、F023、F037；SRC-002、SRC-015；归申请人/申请案，保存提交版本；无正式记录→待受理，表单不可读→UNREADABLE",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 1,
      "maxCount": 20,
      "requiredElements": [
        "证明谁在何时提出何种申请；学校学工系统/学生本人操作；认证提交事件和表单正文；L1 **当前核心**；C05 L0 尚未形成；有可信学工系统记录直接引用；纸质/线下是否正式等效待资助中心确认；F001、F006～F009、F012、F014、F015、F023、F037；SRC-002、SRC-015；归申请人/申请案"
      ],
      "allowReuseAcrossSubjects": false,
      "requiredAt": "submission"
    },
    {
      "id": "M002",
      "name": "核实姓名、学段、在籍状态、学院校区",
      "purpose": "核实姓名、学段、在籍状态、学院校区；学校学籍/统一身份系统权威记录；L1 **当前核心（事实）**；权威数据可取则不要求上传学生证/身份证照片；接口缺失由授权人员校内核身，不假定接口存在；F001～F005；SRC-002、SRC-005；快照按核验时间/学籍版本，失联→SOURCE_UNAVAILABLE+人工核实",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 1,
      "maxCount": 20,
      "requiredElements": [
        "核实姓名、学段、在籍状态、学院校区；学校学籍/统一身份系统权威记录；L1 **当前核心（事实）**；权威数据可取则不要求上传学生证/身份证照片；接口缺失由授权人员校内核身，不假定接口存在；F001～F005；SRC-002、SRC-005；快照按核验时间/学籍版本，失联→SOURCE_UNAVAILABLE+人工核实"
      ],
      "allowReuseAcrossSubjects": false,
      "requiredAt": "submission"
    },
    {
      "id": "M003",
      "name": "说明突发事件、发生时间地点、亲属关联、现实生活影响与所求援助",
      "purpose": "说明突发事件、发生时间地点、亲属关联、现实生活影响与所求援助；学生申请说明/系统文本；L0 摘要、L1 **当前核心**；与 M001 同一表单内容可复用，毋需复制文件；无法打字可记录待本人确认的人工访谈，不等同正式签名；F009～F015、F017、F018；SRC-003、SRC-007；归本事件及申请人，原始叙述逐版本留存；空白→NEEDS_MATERIAL",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 1,
      "maxCount": 20,
      "requiredElements": [
        "说明突发事件、发生时间地点、亲属关联、现实生活影响与所求援助；学生申请说明/系统文本；L0 摘要、L1 **当前核心**；与 M001 同一表单内容可复用，毋需复制文件；无法打字可记录待本人确认的人工访谈，不等同正式签名；F009～F015、F017、F018；SRC-003、SRC-007；归本事件及申请人，原始叙述"
      ],
      "allowReuseAcrossSubjects": false,
      "requiredAt": "submission"
    },
    {
      "id": "M004",
      "name": "自然灾害损失与家庭困难的关系",
      "purpose": "自然灾害损失与家庭困难的关系；学生持有受灾图文、房损照片、当地证明等；C01 的 L2 **条件当前（2026 灾害通知有要求）**；2026 通知明确受灾描述及相关图片 [SRC-003]，但无法现场拍摄时可提交已有其他佐证供学院人工核；是否认可替代待确认；F009～F011、F013、F016、F017、F025、F026、F036；SRC-002～SRC-004；归特定事件/受灾户而非每位家庭成员，照片含拍摄时间与来源；缺→NEEDS_MATERIAL/人工，损坏→UNREADABLE",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 20,
      "requiredElements": [
        "自然灾害损失与家庭困难的关系；学生持有受灾图文、房损照片、当地证明等；C01 的 L2 **条件当前（2026 灾害通知有要求）**；2026 通知明确受灾描述及相关图片 [SRC-003]，但无法现场拍摄时可提交已有其他佐证供学院人工核；是否认可替代待确认；F009～F011、F013、F016、F017、F025、"
      ],
      "allowReuseAcrossSubjects": false,
      "requiredAt": "submission"
    },
    {
      "id": "M005",
      "name": "校验灾害发生地点/时间背景",
      "purpose": "校验灾害发生地点/时间背景；应急管理、气象、地方政府等原发布渠道公告；L2 **可选引用**，不能单独证明该学生受损；学校可主动查询官方公告，不能要求学生重复上传公开网页；未查到不代表灾害不存在；F009～F011、F016、F025、F026；SRC-002、SRC-004（学校公告仅指向灾害背景）；按官方 URL/发布日期快照，不可访问→SOURCE_UNAVAILABLE",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 20,
      "requiredElements": [
        "校验灾害发生地点/时间背景；应急管理、气象、地方政府等原发布渠道公告；L2 **可选引用**，不能单独证明该学生受损；学校可主动查询官方公告，不能要求学生重复上传公开网页；未查到不代表灾害不存在；F009～F011、F016、F025、F026；SRC-002、SRC-004（学校公告仅指向灾害背景）；按官方 URL/"
      ],
      "allowReuseAcrossSubjects": false,
      "requiredAt": "submission"
    },
    {
      "id": "M006",
      "name": "家庭重大变故/收入中断或关联人身份",
      "purpose": "家庭重大变故/收入中断或关联人身份；家属持有的必要证明、学校调查记录；C02 的 L2 **条件当前**，细目未被 7 号办法全文确认；证明形式以当期政策和最小必要为准；可先人工访谈，但是否可替代正式证明待确认；不预设户口本、死亡证明人人必交；F010、F013、F016～F018、F025、F026；SRC-007、SRC-001；归受影响家属/事件，隐去不必要亲属数据；缺→事实未核/人工",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 20,
      "requiredElements": [
        "家庭重大变故/收入中断或关联人身份；家属持有的必要证明、学校调查记录；C02 的 L2 **条件当前**，细目未被 7 号办法全文确认；证明形式以当期政策和最小必要为准；可先人工访谈，但是否可替代正式证明待确认；不预设户口本、死亡证明人人必交；F010、F013、F016～F018、F025、F026；SRC-007、"
      ],
      "allowReuseAcrossSubjects": false,
      "requiredAt": "submission"
    },
    {
      "id": "M007",
      "name": "本人重大疾病/医疗事实",
      "purpose": "本人重大疾病/医疗事实；医院或有权医疗机构提供的诊断摘要、已形成就诊证明；C03/C10 的 L2 **条件当前**，不能要求全量病历；如学校或医院已有经授权可用记录则优先可信回查；急诊未出具文书可先人工联络，不认定合法替代已获批准；F013、F016、F017、F025、F026；SRC-007；归本人健康事件，P3，记录出具日和必要页；不可读→UNREADABLE、无件→待补/人工",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 20,
      "requiredElements": [
        "本人重大疾病/医疗事实；医院或有权医疗机构提供的诊断摘要、已形成就诊证明；C03/C10 的 L2 **条件当前**，不能要求全量病历；如学校或医院已有经授权可用记录则优先可信回查；急诊未出具文书可先人工联络，不认定合法替代已获批准；F013、F016、F017、F025、F026；SRC-007；归本人健康事件，P3"
      ],
      "allowReuseAcrossSubjects": false,
      "requiredAt": "submission"
    },
    {
      "id": "M008",
      "name": "实际费用/财产损失/近期现金压力",
      "purpose": "实际费用/财产损失/近期现金压力；本人持有发票、维修评估、支付凭证或分类说明；C02/C03/C04/C10 的 L2 **条件当前**；有真实有效单据则核费用发生事实；尚未发生的费用/未来赔付不能虚构；是否必交何类票据待校方政策；F016、F018、F025、F026；SRC-003、SRC-007；逐张按出具方、时间、原件版本归本事件；无精确金额→人工，不填 0",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 20,
      "requiredElements": [
        "实际费用/财产损失/近期现金压力；本人持有发票、维修评估、支付凭证或分类说明；C02/C03/C04/C10 的 L2 **条件当前**；有真实有效单据则核费用发生事实；尚未发生的费用/未来赔付不能虚构；是否必交何类票据待校方政策；F016、F018、F025、F026；SRC-003、SRC-007；逐张按出具方、时"
      ],
      "allowReuseAcrossSubjects": false,
      "requiredAt": "submission"
    },
    {
      "id": "M009",
      "name": "声明医保或保险是否办理/尚未赔付",
      "purpose": "声明医保或保险是否办理/尚未赔付；学生当下自述或经办回执；C10 的 L2 **可选引用**；尚未结算时陈述可标“办理中”，**不是赔付事实证明**；不要求学生承诺未来赔款数；F019；SRC-011（仅校方参保渠道边界）；归当前医疗事件/声明时间，冲突→CONFLICT+人工",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 20,
      "requiredElements": [
        "声明医保或保险是否办理/尚未赔付；学生当下自述或经办回执；C10 的 L2 **可选引用**；尚未结算时陈述可标“办理中”，**不是赔付事实证明**；不要求学生承诺未来赔款数；F019；SRC-011（仅校方参保渠道边界）；归当前医疗事件/声明时间，冲突→CONFLICT+人工"
      ],
      "allowReuseAcrossSubjects": false,
      "requiredAt": "submission"
    },
    {
      "id": "M010",
      "name": "确认第三方机构已决定保险赔付/实付金额",
      "purpose": "确认第三方机构已决定保险赔付/实付金额；医保或商业险经办机构正式结算单；**后续产生**（若申请时已有则条件引用）；可在有授权时读取医保/保险方真实回执；对未出具者不预先索要，私人估计不构成替代；F016、F020、F025、F026；SRC-011 仅界定邻接渠道，具体理赔规则未核；由外部经办机构出具，按结算版本保存；未产生→NOT_APPLICABLE",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 20,
      "requiredElements": [
        "确认第三方机构已决定保险赔付/实付金额；医保或商业险经办机构正式结算单；**后续产生**（若申请时已有则条件引用）；可在有授权时读取医保/保险方真实回执；对未出具者不预先索要，私人估计不构成替代；F016、F020、F025、F026；SRC-011 仅界定邻接渠道，具体理赔规则未核；由外部经办机构出具，按结算版本保存"
      ],
      "allowReuseAcrossSubjects": false,
      "requiredAt": "decision"
    },
    {
      "id": "M011",
      "name": "S03-T06 既有困难身份认定的可信结论",
      "purpose": "S03-T06 既有困难身份认定的可信结论；L2/L4 **可选引用**；读原认定权威决定，不因系统缺接口强迫重新走认定或上传全套家庭证明；F021；SRC-009；由认定模块/学校持有，保留决定版本、生效期；失联→SOURCE_UNAVAILABLE，但不自动排除救助",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 20,
      "requiredElements": [
        "S03-T06 既有困难身份认定的可信结论；L2/L4 **可选引用**；读原认定权威决定，不因系统缺接口强迫重新走认定或上传全套家庭证明；F021；SRC-009；由认定模块/学校持有，保留决定版本、生效期；失联→SOURCE_UNAVAILABLE，但不自动排除救助"
      ],
      "allowReuseAcrossSubjects": false,
      "requiredAt": "submission"
    },
    {
      "id": "M012",
      "name": "S03-T07/T08/T09 或其他资助项目已有的权威决定",
      "purpose": "S03-T07/T08/T09 或其他资助项目已有的权威决定；L2/L4 **可选引用**；仅复用决定事实，不复用其资格规则或代其审批；当前接口未知；F022；SRC-012；归原授权业务/决定时间，冲突→人工；不存在→NOT_APPLICABLE",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 20,
      "requiredElements": [
        "S03-T07/T08/T09 或其他资助项目已有的权威决定；L2/L4 **可选引用**；仅复用决定事实，不复用其资格规则或代其审批；当前接口未知；F022；SRC-012；归原授权业务/决定时间，冲突→人工；不存在→NOT_APPLICABLE"
      ],
      "allowReuseAcrossSubjects": false,
      "requiredAt": "submission"
    },
    {
      "id": "M013",
      "name": "当期开放窗口、适用学段/批次、政策版本及来源有效性",
      "purpose": "当期开放窗口、适用学段/批次、政策版本及来源有效性；校方通知/办法/资助中心有效答复；L1/L4 **当前核心（后台配置）**；后台从可信校方源读或由有权经办人确认，不要求学生上传政策；不得以旧通知替代现行办法；F023、F024；SRC-001～SRC-005、SRC-008、SRC-015；按通知发布/修订快照及校方身份；过期/失联→POLICY_UNCONFIRMED/SOURCE_UNAVAILABLE",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 1,
      "maxCount": 20,
      "requiredElements": [
        "当期开放窗口、适用学段/批次、政策版本及来源有效性；校方通知/办法/资助中心有效答复；L1/L4 **当前核心（后台配置）**；后台从可信校方源读或由有权经办人确认，不要求学生上传政策；不得以旧通知替代现行办法；F023、F024；SRC-001～SRC-005、SRC-008、SRC-015；按通知发布/修订快照及校"
      ],
      "allowReuseAcrossSubjects": false,
      "requiredAt": "submission"
    },
    {
      "id": "M014",
      "name": "让每条事实可回溯到精确源文件、页码/图框与旧新版",
      "purpose": "让每条事实可回溯到精确源文件、页码/图框与旧新版；V3 材料台账；L1～L6 **内部必须（存在材料时）**；自动生成可信文件指纹与位置，不要求申请人手写；无法生成时留明确缺口；F025、F026、F036、F038；关联 M003～M010/M018，SRC 继承各原始材料；按 case+event+owner+sourceVersion；解析失败→UNREADABLE",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 20,
      "requiredElements": [
        "让每条事实可回溯到精确源文件、页码/图框与旧新版；V3 材料台账；L1～L6 **内部必须（存在材料时）**；自动生成可信文件指纹与位置，不要求申请人手写；无法生成时留明确缺口；F025、F026、F036、F038；关联 M003～M010/M018，SRC 继承各原始材料；按 case+event+owner+so"
      ],
      "allowReuseAcrossSubjects": false,
      "requiredAt": "submission"
    },
    {
      "id": "M015",
      "name": "真实辅导员核实、学院在线/线下审核及集体意见、资助中心复审建议",
      "purpose": "真实辅导员核实、学院在线/线下审核及集体意见、资助中心复审建议；官方审批事件/会议记录；**后续产生 L3/L4**；从有权后台事件或经授权签章原件读取，不让学生先交“学院同意书”；2024 专项已证此类步骤；F027、F028；SRC-015、SRC-006；签批人/岗位/时间/关联源版本；未审核→未产生，伪署名→CONFLICT",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 20,
      "requiredElements": [
        "真实辅导员核实、学院在线/线下审核及集体意见、资助中心复审建议；官方审批事件/会议记录；**后续产生 L3/L4**；从有权后台事件或经授权签章原件读取，不让学生先交“学院同意书”；2024 专项已证此类步骤；F027、F028；SRC-015、SRC-006；签批人/岗位/时间/关联源版本；未审核→未产生，伪署名→C"
      ],
      "allowReuseAcrossSubjects": false,
      "requiredAt": "decision"
    },
    {
      "id": "M016",
      "name": "最终有权学校决定和批准额度",
      "purpose": "最终有权学校决定和批准额度；学校有效会议/决定记录；**后续产生 L4**；只认可信学校审批记录；扫描件可供核查但不能把 OCR 字符直接变成批准动作；F029～F031；SRC-015（2024 专项权限）、SRC-001 待全文；归正式决定及审批时证据快照，未出→NEEDS_HUMAN_DECISION",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 20,
      "requiredElements": [
        "最终有权学校决定和批准额度；学校有效会议/决定记录；**后续产生 L4**；只认可信学校审批记录；扫描件可供核查但不能把 OCR 字符直接变成批准动作；F029～F031；SRC-015（2024 专项权限）、SRC-001 待全文；归正式决定及审批时证据快照，未出→NEEDS_HUMAN_DECISION"
      ],
      "allowReuseAcrossSubjects": false,
      "requiredAt": "decision"
    },
    {
      "id": "M017",
      "name": "本事项资金执行、支付状态及通知",
      "purpose": "本事项资金执行、支付状态及通知；财务/银行或学校真实执行记录；**后续产生 L5**；不套用国家助学金一卡通流程或其他资助支付截图 [SRC-012]；F032；SRC-015 仅确认“依会议意见执行”，具体财务渠道待查；归本申请/支付批次；未支付→待生成",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 20,
      "requiredElements": [
        "本事项资金执行、支付状态及通知；财务/银行或学校真实执行记录；**后续产生 L5**；不套用国家助学金一卡通流程或其他资助支付截图 [SRC-012]；F032；SRC-015 仅确认“依会议意见执行”，具体财务渠道待查；归本申请/支付批次；未支付→待生成"
      ],
      "allowReuseAcrossSubjects": false,
      "requiredAt": "decision"
    },
    {
      "id": "M018",
      "name": "本人提交更正、撤回或复核意愿",
      "purpose": "本人提交更正、撤回或复核意愿；可信提交事件及更改理由；**条件当前 L6**，只有提出相关请求时才需要；有效代理、允许撤回阶段及期限待校方确认；聊天截图可作线索，不能代正式签署；F006、F007、F033、F034、F037；SRC-001 待原文；归旧案及请求版本；无请求→NOT_APPLICABLE",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 20,
      "requiredElements": [
        "本人提交更正、撤回或复核意愿；可信提交事件及更改理由；**条件当前 L6**，只有提出相关请求时才需要；有效代理、允许撤回阶段及期限待校方确认；聊天截图可作线索，不能代正式签署；F006、F007、F033、F034、F037；SRC-001 待原文；归旧案及请求版本；无请求→NOT_APPLICABLE"
      ],
      "allowReuseAcrossSubjects": false,
      "requiredAt": "submission"
    },
    {
      "id": "M019",
      "name": "核对前一案、之前补助决定与同因重复/新增损失",
      "purpose": "核对前一案、之前补助决定与同因重复/新增损失；学校旧案/正式决定；C07/C08 的 L1/L6 **条件当前**；学校有数据则由授权人员查，不逼学生上传既有结论截图；没有同案则不是必须；F035、F036；SRC-001 待重复申请条款；归既有案、不可改写旧结果；权威记录不可得→SOURCE_UNAVAILABLE",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 20,
      "requiredElements": [
        "核对前一案、之前补助决定与同因重复/新增损失；学校旧案/正式决定；C07/C08 的 L1/L6 **条件当前**；学校有数据则由授权人员查，不逼学生上传既有结论截图；没有同案则不是必须；F035、F036；SRC-001 待重复申请条款；归既有案、不可改写旧结果；权威记录不可得→SOURCE_UNAVAILABLE"
      ],
      "allowReuseAcrossSubjects": false,
      "requiredAt": "submission"
    },
    {
      "id": "M020",
      "name": "核代理是否经申请人/法定程序授权",
      "purpose": "核代理是否经申请人/法定程序授权；学生、家属或有权部门的代理授权原件；C05/C08 中出现代理时 **条件当前且须人工核权**；**尚未找到校方代理规定**；亲属关系不能自动替代委托，危机线索可以先受理但不能冒名签署；F006、F007、F025；SRC-001（待查）、SRC-002（未授权代申）；归申请人与代理人，保存授权范围、时间和撤销；缺→NEEDS_HUMAN_DECISION",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 20,
      "requiredElements": [
        "核代理是否经申请人/法定程序授权；学生、家属或有权部门的代理授权原件；C05/C08 中出现代理时 **条件当前且须人工核权**；**尚未找到校方代理规定**；亲属关系不能自动替代委托，危机线索可以先受理但不能冒名签署；F006、F007、F025；SRC-001（待查）、SRC-002（未授权代申）；归申请人与代理人"
      ],
      "allowReuseAcrossSubjects": false,
      "requiredAt": "submission"
    },
    {
      "id": "M021",
      "name": "紧急联络、学院摸排、学生当前安全/受灾事实",
      "purpose": "紧急联络、学院摸排、学生当前安全/受灾事实；辅导员工作记录、已核电话/面谈线索；C05 的 L0 **当前核心（联络时）**；其他情形可选；无法联系学生可记录尝试和证据级别，不得填写“本人已确认”；学校通知要求摸排但未规定日志格式 [SRC-002]；F006、F015、F040；SRC-002、SRC-003；归工作人员/学生及事件时间，联系失败→待办不冒充成功",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 20,
      "requiredElements": [
        "紧急联络、学院摸排、学生当前安全/受灾事实；辅导员工作记录、已核电话/面谈线索；C05 的 L0 **当前核心（联络时）**；其他情形可选；无法联系学生可记录尝试和证据级别，不得填写“本人已确认”；学校通知要求摸排但未规定日志格式 [SRC-002]；F006、F015、F040；SRC-002、SRC-003；归工作"
      ],
      "allowReuseAcrossSubjects": false,
      "requiredAt": "submission"
    },
    {
      "id": "M022",
      "name": "复核后正式的变更/维持决定",
      "purpose": "复核后正式的变更/维持决定；有权复核机关记录；**后续产生 L6**，校本机制未核；不能以模型二次运行结果代正式复核；若不存在此程序也不能自行创造；F039；SRC-001 待查，相关用户权利/流程未知；归复核申请与正式决定版本；未形成→NOT_APPLICABLE",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 20,
      "requiredElements": [
        "复核后正式的变更/维持决定；有权复核机关记录；**后续产生 L6**，校本机制未核；不能以模型二次运行结果代正式复核；若不存在此程序也不能自行创造；F039；SRC-001 待查，相关用户权利/流程未知；归复核申请与正式决定版本；未形成→NOT_APPLICABLE"
      ],
      "allowReuseAcrossSubjects": false,
      "requiredAt": "decision"
    }
  ],
  "sections": [
    {
      "id": "rules-08-2",
      "name": "申请建案、身份和当前政策（R001～R005）",
      "order": 0,
      "required": true,
      "criteria": [
        {
          "id": "R001",
          "title": "正式申请与提交主体",
          "requirement": "原文核验项：正式申请与提交主体。执行摘要：R001 正式申请与提交主体 | L1 或 L6 重提；T=收到正式申请记录；F=仅 L0 摸排线索；U=收到前端表单但认证来源不明 | SRC-002/015；F006/F008/F037；M001/M021 | 对学校认证会话、提交时点、申请号三者 A 层核对；2026 窗口按申请当日有效入口核，不把历史窗口永久化。线下受理是否等效属例外待人工授权 | T 且身份一致→PASS_FACT；认证冲突→CONFLICT；A 源失联→SOURCE_UNAVAILABLE；U→NEEDS_HUMAN_DECISION；辅导员/学工受理岗。政策/权限/期限未知或冲突时必须转人工复核，不得形成正式资格结论。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R002",
          "title": "申请人本人学籍及姓名归属",
          "requirement": "原文核验项：申请人本人学籍及姓名归属。执行摘要：R002 申请人本人学籍及姓名归属 | L1～L4；T=可读取可信学籍记录；F=仅紧急线索未建案；U=有号码但没有可信匹配源 | SRC-002/005；F001/F002/F004/F006；M001/M002 | A 学籍快照与 A 提交主体核同一 studentId，C 姓名仅辅助；核验时间与申请期快照并存。校方授权代理另走 R013 | 精确匹配或明确不匹配均记 PASS_FACT+factValue；学生账号/学号矛盾→CONFLICT；A 源失联→SOURCE_UNAVAILABLE；U→NEEDS_HUMAN_DECISION；学籍核验员/辅导员。政策/权限/期限未知或冲突时必须转人工复核，不得形成正式资格结论。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R003",
          "title": "本研、校区、学籍状态的项目适用性",
          "requirement": "原文核验项：本研、校区、学籍状态的项目适用性。执行摘要：R003 本研、校区、学籍状态的项目适用性 | L1/L4；T=有当前申请需校核该批次身份；F=仅 L0 线索尚未决定申请批次；U=非灾害或特殊身份尚无当期适用规定 | SRC-002/004/005/007/008；F003/F004/F005/F023；M002/M013 | A 学籍/学段与原批次通知逐项比较；不得用 2025 本科宣传对研究生判额、用 2023 新生通知覆盖 2026。休学、非全日制、留学生等为待核例外 | 明确匹配或明确不适用的身份事实→PASS_FACT（false 也非学校拒绝）；F 触发分支→NOT_APPLICABLE；U/政策范围不清→POLICY_UNCONFIRMED；学工资助政策岗。政策/权限/期限未知或冲突时必须转人工复核，不得形成正式资格结论。",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R004",
          "title": "政策版本、批次和窗口有效性",
          "requirement": "原文核验项：政策版本、批次和窗口有效性。执行摘要：R004 政策版本、批次和窗口有效性 | L1/L4、L6 重提；T=可取得当期权威通知与有效版本；F=纯 L0 非正式求助；U=版本/施行废止/受理日期不明 | SRC-001/002/003/004/008/015；F023/F024/F037；M013 | 校方 A/P0 文本按发布时间、适用期、修订关系与真实提交时点对照；2024 7 号办法正文未得，2024 台风链只对旧批次有效。原网页 412/失联保留既有快照但不提升其现行性 | 生效范围内可核事实→PASS_FACT；有文档但时效不清→POLICY_UNCONFIRMED；权威源不可取得→SOURCE_UNAVAILABLE，涉及门槛同时另记政策待办；资助中心政策岗。政策/权限/期限未知或冲突时必须转人工复核，不得形成正式资格结论。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R005",
          "title": "困难事件陈述的归属与时间",
          "requirement": "原文核验项：困难事件陈述的归属与时间。执行摘要：R005 困难事件陈述的归属与时间 | L1/L2；T=正式申请报告具体事件；F=L0 尚未陈述；U=描述含混、时间/申请主体未定 | SRC-003/007；F009/F010/F012/F014；M001/M003 | 比对申请文本版本、事件起始/持续时间、对在校生活影响，C 声明可核“已如此陈述”但不可直接核“损失已真实发生”；允许约略日期并留不确定范围 | 陈述存在且归属明确→PASS_FACT（仅陈述事实）；空白且属当期申请核心→NEEDS_MATERIAL；自述版本矛盾→CONFLICT；U→NEEDS_HUMAN_DECISION；申请人/辅导员。政策/权限/期限未知或冲突时必须转人工复核，不得形成正式资格结论。",
          "execution": "semantic",
          "targetScope": "case"
        }
      ]
    },
    {
      "id": "rules-08-3",
      "name": "困难事实、条件证据及安全联络（R006～R015）",
      "order": 1,
      "required": true,
      "criteria": [
        {
          "id": "R006",
          "title": "自然灾害与家庭实际受影响",
          "requirement": "原文核验项：自然灾害与家庭实际受影响。执行摘要：R006 自然灾害与家庭实际受影响 | C01，L2/L3；T=申报灾害；F=另类变故；U=事件类别不明 | SRC-002/003/004/005；F009/F010/F011/F013/F017；M003/M004/M005 | C 受灾图文须绑定申请人/家庭关系及具体时地；B 官方灾害通报只证事件背景，不证该户损失。比较灾害发生、拍摄和损失时间；难以拍照属人工例外 | 证据支持或否定某损失事实→PASS_FACT+factValue；有相反来源→CONFLICT；当期明确应提供的图文缺→NEEDS_MATERIAL；U→NEEDS_HUMAN_DECISION；辅导员/学院。政策/权限/期限未知或冲突时必须转人工复核，不得形成正式资格结论。",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R007",
          "title": "证明材料的受益主体与签发来源",
          "requirement": "原文核验项：证明材料的受益主体与签发来源。执行摘要：R007 证明材料的受益主体与签发来源 | C01～C04/C10，L2/L3；T=存在外部/图片证明；F=尚只有 L0 线索；U=材料无法对应人或事件 | SRC-003/007；F013/F016/F025/F026；M004/M005/M006/M007/M014 | B 机构抬头、当事人、签发日与 C 申请人叙述交叉；申请人为甲、诊断对象乙要区分本人疾病与家庭变故；同住/同姓不自动证亲属关系 | 匹配事实→PASS_FACT；主体不一致且不可解释→CONFLICT；内容读不出→UNREADABLE；U→NEEDS_HUMAN_DECISION；学院核实岗。政策/权限/期限未知或冲突时必须转人工复核，不得形成正式资格结论。",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R008",
          "title": "家庭重大变故与申请人关联",
          "requirement": "原文核验项：家庭重大变故与申请人关联。执行摘要：R008 家庭重大变故与申请人关联 | C02，L2/L3；T=主张家属变故；F=本人疾病/灾害独立事项；U=亲属关联/变故内容不明 | SRC-007/001；F009/F010/F013/F017；M003/M006 | C 自述和已产生的 B 证明核发生时间、亲属关系、收入生活影响；7 号办法未证具体必交证种，不把未盖章等同不合格 | 已核事件关联或其反证→PASS_FACT；互相矛盾→CONFLICT；政策要求哪种证明不明→POLICY_UNCONFIRMED；不足→NEEDS_HUMAN_DECISION；辅导员/中心。政策/权限/期限未知或冲突时必须转人工复核，不得形成正式资格结论。",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R009",
          "title": "本人重大疾病事实",
          "requirement": "原文核验项：本人重大疾病事实。执行摘要：R009 本人重大疾病事实 | C03/C10，L2/L3；T=主张申请人本人疾病；F=家属疾病/非医疗事件；U=健康材料主体不明 | SRC-007；F009/F013/F016/F017；M003/M007 | B 医疗证明日期与 A 学籍身份匹配，仅提取诊疗摘要和必要时点；不要求全病历，诊断真实性超出 OCR 能力。家属疾病转 R008 或人工改类 | 对本人医疗事实可核→PASS_FACT；名字/主体对不上→CONFLICT；已有证明不可读→UNREADABLE；证明细目政策未知→POLICY_UNCONFIRMED；学院人工。政策/权限/期限未知或冲突时必须转人工复核，不得形成正式资格结论。",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R010",
          "title": "当前现金压力及费用事实",
          "requirement": "原文核验项：当前现金压力及费用事实。执行摘要：R010 当前现金压力及费用事实 | C01～C04/C10，L2/L4；T=申报损失、负担或当前现金压力；F=本次只处于紧急联络而未进入经济事实核验；U=未说明当前生活影响 | SRC-004/005/007；F014/F017/F018；M003/M008 | C 当前生活影响与已出具 B 票据的主体、日期、币种/金额逐一核对；估计、拟支出与实付分列，未来费用可单独陈述，不把票据合计设为救助额；未形成账单不自动填零 | 可核某笔已发生费用→PASS_FACT；金额/主体冲突→CONFLICT；必要说明空白→NEEDS_MATERIAL；证据不全或需衡量困难程度→NEEDS_HUMAN_DECISION；学院/中心。政策/权限/期限未知或冲突时必须转人工复核，不得形成正式资格结论。",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R011",
          "title": "其他特殊困难的事实与类别",
          "requirement": "原文核验项：其他特殊困难的事实与类别。执行摘要：R011 其他特殊困难的事实与类别 | C04，L1～L4；T=申报其他特殊困难；F=已归入已知类别；U=事实归类不明确 | SRC-007/001；F009/F012/F014/F015；M003/M013 | 核实学生叙述与即时生活影响，但“其他”是否被当期办法覆盖/如何量化无法由系统自行扩张；事后校内人员形成说明也不是机器资格阈值 | 自述存在→PASS_FACT（仅自述）；决定归类/救助必要性→NEEDS_HUMAN_DECISION；适用范围不明→POLICY_UNCONFIRMED；资助中心。政策/权限/期限未知或冲突时必须转人工复核，不得形成正式资格结论。",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R012",
          "title": "紧急摸排与联系真实性",
          "requirement": "原文核验项：紧急摸排与联系真实性。执行摘要：R012 紧急摸排与联系真实性 | C05 或任何安全紧急，L0/L3；T=已收到灾情线索/安全求助；F=无紧急线索；U=学生失联或联系者身份不明 | SRC-002/003；F006/F015/F040；M021/M003 | 逐次核联系人、时间、沟通结果和来源；未接通记尝试，不造成功联系；人身风险转校方/医疗应急人员，联系不以在线申请为先决 | 已记录真实联络动作→PASS_FACT；联系记录矛盾→CONFLICT；不能联系/未核权→NEEDS_HUMAN_DECISION；学校值班/辅导员及时办理。政策/权限/期限未知或冲突时必须转人工复核，不得形成正式资格结论。",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R013",
          "title": "代理、代录与本人真实意愿",
          "requirement": "原文核验项：代理、代录与本人真实意愿。执行摘要：R013 代理、代录与本人真实意愿 | C05 的 L0/L1 或 C08 的 L6；T=他人代办/代签；F=本人认证操作；U=仅家属电话/短信自称授权 | SRC-001/002；F006/F007/F033；M001/M020/M021 | A 会话主体、代理身份与授权范围、有效期、人身紧急性分别核；成都理工大学代理制度未取，不假定家属关系即合法授权；线索联系可先做 | F 本人操作→NOT_APPLICABLE（本人认证由 R001 核）；T 代理核权仍需学校人员→NEEDS_HUMAN_DECISION；冒名冲突→CONFLICT；代理制度有效性缺口由 R004 另出 POLICY_UNCONFIRMED；辅导员/授权审查岗。政策/权限/期限未知或冲突时必须转人工复核，不得形成正式资格结论。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R014",
          "title": "附件解析与可定位性",
          "requirement": "原文核验项：附件解析与可定位性。执行摘要：R014 附件解析与可定位性 | L2～L6 只针对当前已存在的附件；T=有具体源文档版本；F=该槽未来才生成或明确不适用；U=来源对象缺失 | SRC-003/007；F025/F026/F038；M004/M006/M007/M008/M014 | 优先引用 G50 可用的文件完整性/OCR 结果，再核本案的页码、影像区域、版本和归属；图像模糊不可由缺字推零损失；源码接口并未验证 | 字段确能回溯→PASS_FACT；读不出→UNREADABLE；来源拿不到→SOURCE_UNAVAILABLE；真正应有而未交→NEEDS_MATERIAL；申请人补件/资料员。政策/权限/期限未知或冲突时必须转人工复核，不得形成正式资格结论。",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R015",
          "title": "同一事件跨材料口径冲突",
          "requirement": "原文核验项：同一事件跨材料口径冲突。执行摘要：R015 同一事件跨材料口径冲突 | C01～C04/C10，L2/L3；T=两项以上材料证明同一事实；F=只有一个可用来源；U=来源主体或时点不明 | SRC-003/007；F010/F017/F018/F036；M003/M004/M008/M014 | 比较损失发生/拍摄/维修/支付时间与原件版本；可能为真实事后变化，不能机器判造假；证据分层且同一文档 OCR 不算两份独立佐证 | 一致或时间可解释→PASS_FACT；实质矛盾→CONFLICT；无法消解→NEEDS_HUMAN_DECISION；辅导员/学院。政策/权限/期限未知或冲突时必须转人工复核，不得形成正式资格结论。",
          "execution": "semantic",
          "targetScope": "case"
        }
      ]
    },
    {
      "id": "rules-08-4",
      "name": "相邻决定、旧案和证据版本（R016～R020）",
      "order": 2,
      "required": true,
      "criteria": [
        {
          "id": "R016",
          "title": "已有家庭困难认定只读引用",
          "requirement": "原文核验项：已有家庭困难认定只读引用。执行摘要：R016 已有家庭困难认定只读引用 | L2/L4；T=本案确需查 S03-T06 已有认定或申请人声称存在；F=本案没有引用认定的事实需要；U=学校记录无法查询 | SRC-009/001；F021；M011/M013 | 仅取得原决定 A 的版本、生效范围、申请人；不重新评级，旧认定不存在不自动否定突发救助资格；是否前置待 7 号办法 | T 下已核有/无都可 PASS_FACT+factValue；F→NOT_APPLICABLE；A 源失联→SOURCE_UNAVAILABLE；如需认定作门槛却无政策→POLICY_UNCONFIRMED；资助中心。政策/权限/期限未知或冲突时必须转人工复核，不得形成正式资格结论。",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R017",
          "title": "其他资助决定只读引用",
          "requirement": "原文核验项：其他资助决定只读引用。执行摘要：R017 其他资助决定只读引用 | L2/L4；T=本案提及或校本规定须核 S03-T07/T08/T09 邻接正式决定；F=当前无引用必要；U=决定版本/权限不可确认 | SRC-012/006；F022；M012 | 引用其他业务 A 决定机构、号码、时间和有效状态；不替国家助学金、贷款、勤工岗位作新决定；不同资助可并存；G50 只作为通用事实检查 | T 下读到有效结论或可证无记录→PASS_FACT+factValue；F→NOT_APPLICABLE；无权威源→SOURCE_UNAVAILABLE；与本人截图冲突→CONFLICT；原业务 Owner/资助中心。政策/权限/期限未知或冲突时必须转人工复核，不得形成正式资格结论。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R018",
          "title": "医保办理与校内救助不混同",
          "requirement": "原文核验项：医保办理与校内救助不混同。执行摘要：R018 医保办理与校内救助不混同 | C10，L2/L4/L5；T=声明赔付状态或已有正式赔付；F=事项不涉及保险；U=办理中、尚未有结算 | SRC-011/007；F019/F020；M009/M010 | C 自述只证“曾声明办理中”；B/A 理赔机构回执才证获赔数，按回执签发日与关联医疗事件核；学校当前无已核“需等赔付再申报”的条款 | 已出真实结算→PASS_FACT；未产生 M010→NOT_APPLICABLE（就赔付结果检查）；是否影响校内补助金额→NEEDS_HUMAN_DECISION；医保机构与学校各自处理。政策/权限/期限未知或冲突时必须转人工复核，不得形成正式资格结论。",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R019",
          "title": "前案和同因新增损失",
          "requirement": "原文核验项：前案和同因新增损失。执行摘要：R019 前案和同因新增损失 | C07/C08，L1/L6；T=申报同事件补充、新损失或需核前案；F=纯首次事件且无旧案核查需求；U=前案 A 记录不可得 | SRC-001/002；F008/F010/F035/F036；M001/M003/M019 | 以学生 ID+事件时空+实际学校旧案/决定/证据指纹核，不能只凭姓名/图像相似认定骗补；累计限额及跨学期次数待 7 号办法 | T 下核到重复材料或确有新损失→PASS_FACT+factValue；F→NOT_APPLICABLE；旧新叙述冲突→CONFLICT；前案失联→SOURCE_UNAVAILABLE；是否可再救助→NEEDS_HUMAN_DECISION；中心。政策/权限/期限未知或冲突时必须转人工复核，不得形成正式资格结论。",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R020",
          "title": "材料替换后的定向失效",
          "requirement": "原文核验项：材料替换后的定向失效。执行摘要：R020 材料替换后的定向失效 | C06/C07/C08，L2～L6；T=材料新增、替换或撤销版本；F=无证据更改；U=版本关系/原件归属未知 | SRC-003/015（流程旁证，失效传播为工程规则）；F025/F026/F036/F038；M014/M019 | 按 materialSlot+owner+sourceVersion+fingerprint 比对，记录 replaces/derivedFrom；只使引用旧版的 R 结果作废，保留不受影响的事实结果与已签生效决定；不得以新 Run 倒写旧审批 | 版本链一致→PASS_FACT+定向重审任务；无法关联→CONFLICT；旧源失联→SOURCE_UNAVAILABLE；版本修复交案卷管理员，生效决定变更交学校有权人。政策/权限/期限未知或冲突时必须转人工复核，不得形成正式资格结论。",
          "execution": "semantic",
          "targetScope": "case"
        }
      ]
    },
    {
      "id": "rules-08-5",
      "name": "人工审核、正式决定、资金及争议（R021～R027）",
      "order": 3,
      "required": true,
      "criteria": [
        {
          "id": "R021",
          "title": "审核意见的真实主体和岗位",
          "requirement": "原文核验项：审核意见的真实主体和岗位。执行摘要：R021 审核意见的真实主体和岗位 | L3/L4；T=有正式教工审核事件；F=尚在 L1/L2；U=仅有图片签章/前端 actor 声明 | SRC-006/015；F027/F028；M015 | A 教工认证、组织/岗位有效期、审核范围、绑定的案卷与证据版本；C 扫描件不得自认证授权；2024 流程只作历史岗位线索 | 身份/其阶段权限属实→PASS_FACT；伪装或署名不符→CONFLICT；A 源失联→SOURCE_UNAVAILABLE；现时授权不明→POLICY_UNCONFIRMED；学校权限管理员。政策/权限/期限未知或冲突时必须转人工复核，不得形成正式资格结论。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R022",
          "title": "阶段意见和中心建议不是终审",
          "requirement": "原文核验项：阶段意见和中心建议不是终审。执行摘要：R022 阶段意见和中心建议不是终审 | L3/L4；T=实际产生辅导员/学院/中心的某阶段意见；F=该阶段未开始；U=缺现行阶段权限清单 | SRC-015/001；F027/F028/F024；M015/M013 | A 审核事件各自带岗位、意见类型、次序和来源版本；2024 台风的集体会议意见不能强制所有 2026 案件照搬；未产生意见不要求学生补交 | 实际已签意见事实→PASS_FACT；缺现行审批链配置→POLICY_UNCONFIRMED；跨角色冒签→CONFLICT；学院/中心权限审核岗。政策/权限/期限未知或冲突时必须转人工复核，不得形成正式资格结论。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R023",
          "title": "正式学校决定须独立可核",
          "requirement": "原文核验项：正式学校决定须独立可核。执行摘要：R023 正式学校决定须独立可核 | L4 后；T=学校有权系统声称已决定；F=L0～L3 尚未进入终审；U=只有建议或 OCR“通过”字样 | SRC-015/001；F029/F030/F027；M015/M016 | A 终审主体、当前授权、决定号、决定类型、生效时间、证据快照一致才接受；2024 会议批准仅证明历史专项，不能当当前普遍权限；决定不得由模型创建 | 权威决定存在→PASS_FACT（仅“存在及内容”）；无有效授权/版本矛盾→CONFLICT 或 POLICY_UNCONFIRMED；尚需校方决定→NEEDS_HUMAN_DECISION；有权学校决策人员。政策/权限/期限未知或冲突时必须转人工复核，不得形成正式资格结论。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R024",
          "title": "金额裁量独占正式决定",
          "requirement": "原文核验项：金额裁量独占正式决定。执行摘要：R024 金额裁量独占正式决定 | L4；T=已有 M016 正式金额；F=尚未进入决定阶段；U=申请书/旧宣传给出建议额度 | SRC-004/005/008/015/001；F018/F024/F031；M008/M013/M016 | 核 A 学校决定金额、币种、版本、权限、个案；2025 本科宣传数字不得作为 2026 自动比较阈值，申报负担 F018 不等于批准 F031 | 正式数额存在且有权→PASS_FACT；政策额度/分级未知→POLICY_UNCONFIRMED；待定额→NEEDS_HUMAN_DECISION；学校有权决策人。政策/权限/期限未知或冲突时必须转人工复核，不得形成正式资格结论。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R025",
          "title": "实际拨付与学校决定分开",
          "requirement": "原文核验项：实际拨付与学校决定分开。执行摘要：R025 实际拨付与学校决定分开 | L5；T=有本案支付记录；F=L4 未有决定；U=仅有其他奖助金转账/学生声称到账 | SRC-006/015/012；F029/F032；M016/M017 | A 财务/学校支付回执以本案真实决定号、支付批次、时间、收款对象核对；同名同金额也不等于本案支付；未结算为待执行而非申请缺件 | 本案已付/失败事实→PASS_FACT+factValue；错账→CONFLICT；渠道失联→SOURCE_UNAVAILABLE；执行待办→NEEDS_HUMAN_DECISION；资助中心/财务授权经办。政策/权限/期限未知或冲突时必须转人工复核，不得形成正式资格结论。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R026",
          "title": "撤回、更正与重提请求合法性",
          "requirement": "原文核验项：撤回、更正与重提请求合法性。执行摘要：R026 撤回、更正与重提请求合法性 | L6；T=已收到请求；F=当事人未提出；U=申请人/代理意愿或允许撤回节点不明 | SRC-001（未得全文）；F006/F007/F033/F034/F035；M018/M019/M020 | A 本人认证、原案、申请/决定状态、提交时间与授权范围核实；正式决定前后是否可撤、何时撤回生效未知。原决定只增附记录不可删除 | 有效请求提交事实→PASS_FACT；代理/权限不明→NEEDS_HUMAN_DECISION；程序和期限不明→POLICY_UNCONFIRMED；冒签→CONFLICT；学校受理/决定管理岗。政策/权限/期限未知或冲突时必须转人工复核，不得形成正式资格结论。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R027",
          "title": "复核意见与原决定的独立性",
          "requirement": "原文核验项：复核意见与原决定的独立性。执行摘要：R027 复核意见与原决定的独立性 | L6；T=有人提出复核且后续出现学校有权复核结论；F=无复核请求；U=已请求但尚无结论/制度未证 | SRC-001（待全文）/015（历史审批权限旁证）；F034/F035/F039；M018/M019/M022 | A 旧决定、真实异议申请、复核权人与生效决定版本三方关联；重跑模型只生成新事实意见；程序是否存在、期限、复核机构仍待正式规定 | 有权复核事实→PASS_FACT；未有 M022→NEEDS_HUMAN_DECISION（L6 待决，不是申请人缺件）；复核制度不明→POLICY_UNCONFIRMED；伪造复核截图→CONFLICT；学校有权复核机关。政策/权限/期限未知或冲突时必须转人工复核，不得形成正式资格结论。",
          "execution": "manual",
          "targetScope": "case"
        }
      ]
    }
  ],
  "policyVersionIds": [],
  "stages": [
    {
      "id": "intake",
      "name": "申请登记、身份与范围核验",
      "kind": "auto-check",
      "executorRole": "system",
      "nextStageId": "evidence-review",
      "workflowOwner": "local"
    },
    {
      "id": "evidence-review",
      "name": "材料、事实与来源核验",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "returnToStageId": "intake",
      "nextStageId": "policy-confirmation",
      "workflowOwner": "local"
    },
    {
      "id": "policy-confirmation",
      "name": "当期政策、适用范围与权限人工确认",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "returnToStageId": "evidence-review",
      "nextStageId": "final-decision",
      "workflowOwner": "local"
    },
    {
      "id": "final-decision",
      "name": "有权人员人工决定与结果记录",
      "kind": "finalize",
      "executorRole": "teacher",
      "returnToStageId": "evidence-review",
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
      "id": "supplement-list",
      "kind": "supplement-list",
      "audience": "student"
    },
    {
      "id": "human-decision-record",
      "kind": "approval",
      "audience": "teacher"
    }
  ],
  "autoPassPolicy": {
    "enabled": false
  },
  "status": "draft",
  "createdAt": "2026-10-24T00:00:00.000Z"
}

/** SRC 为研究来源索引，不是案卷 SourceRef。 */
export const r02Metadata = {
  "templateId": "S03-T10",
  "name": "临时困难补助和应急救助申请审核",
  "version": "1.0",
  "sourceDocumentPath": "docs/design/review-agent/business-templates/R02/research-original/S03-T10.md",
  "reviewedDocumentPath": "docs/design/review-agent/business-templates/R02/S03-T10.md",
  "sourceGitBlobSha": "812084aad8ab2d21400dd47b2b99a33fff1592c9",
  "sourceDocumentSha256": "2dfb73d9e103a321fdc40a86955b3929e58e3ddf1b5ef0e1189e1c450d23987e",
  "sourceManifestBytes": 133380,
  "sourceManifestSha256": "ad3ee023cc251eea5597fffb3dd97db2f900fda66ea5b811a1112f3efcaadae0",
  "officialSchoolTemplate": false,
  "researchDate": "2026-10-24",
  "policyEvidenceStatus": "PARTIAL",
  "workflowOwner": "local",
  "sourceEvidence": [
    {
      "sourceId": "SRC-001",
      "title": "成都理工大学学生处：《关于印发〈成都理工大学学生困难补助实施办法〉的通知》（成理校学〔2024〕7号）；[校方资助政策目录](https://xsc.cdut.edu.cn/zzgl/zzzc.htm)",
      "evidenceStatus": "UNCONFIRMED",
      "url": "https://xsc.cdut.edu.cn/zzgl/zzzc.htm"
    },
    {
      "sourceId": "SRC-002",
      "title": "党委学生工作部（学生工作处、学生资助管理中心）：[《关于做好对四川宜宾受地震灾害影响学生困难情况摸排和临时困难补助工作的通知》](https://xsc.cdut.edu.cn/info/1046/4710.htm)",
      "evidenceStatus": "PARTIAL",
      "url": "https://xsc.cdut.edu.cn/info/1046/4710.htm"
    },
    {
      "sourceId": "SRC-003",
      "title": "学生资助管理中心：[《愿平安丨关于做好对广西受地震灾害影响学生困难情况摸排和临时困难补助工作的通知》](https://xsc.cdut.edu.cn/info/1046/4580.htm)",
      "evidenceStatus": "PARTIAL",
      "url": "https://xsc.cdut.edu.cn/info/1046/4580.htm"
    },
    {
      "sourceId": "SRC-004",
      "title": "学生资助管理中心：[《愿平安丨关于做好对甘肃受地震灾害影响学生困难情况摸排和临时困难补助工作的通知》](https://xsc.cdut.edu.cn/info/1046/4031.htm)",
      "evidenceStatus": "PARTIAL",
      "url": "https://xsc.cdut.edu.cn/info/1046/4031.htm"
    },
    {
      "sourceId": "SRC-005",
      "title": "学生资助管理中心：[《愿平安丨成理学子如遇突发自然灾害，可申请临时困难补助》](https://xsc.cdut.edu.cn/info/1025/2841.htm)",
      "evidenceStatus": "PARTIAL",
      "url": "https://xsc.cdut.edu.cn/info/1025/2841.htm"
    },
    {
      "sourceId": "SRC-006",
      "title": "成都理工大学党委学生工作部（处）：[《机构设置》](https://xsc.cdut.edu.cn/bmgk/jgsz.htm)",
      "evidenceStatus": "PARTIAL",
      "url": "https://xsc.cdut.edu.cn/bmgk/jgsz.htm"
    },
    {
      "sourceId": "SRC-007",
      "title": "学生处：[《致2024级家庭经济困难本科生的一封信》](https://xsc.cdut.edu.cn/info/1046/2208.htm)",
      "evidenceStatus": "PARTIAL",
      "url": "https://xsc.cdut.edu.cn/info/1046/2208.htm"
    },
    {
      "sourceId": "SRC-008",
      "title": "学生处：[《国家资助 助你飞翔——成都理工大学2025年本专科学生资助政策简介》](https://xsc.cdut.edu.cn/info/1032/3429.htm)",
      "evidenceStatus": "PARTIAL",
      "url": "https://xsc.cdut.edu.cn/info/1032/3429.htm"
    },
    {
      "sourceId": "SRC-009",
      "title": "学生处：[2024 年《成都理工大学家庭经济困难学生认定工作实施办法》（成理校学〔2024〕11号）目录条目](https://xsc.cdut.edu.cn/zzgl/zzzc.htm)",
      "evidenceStatus": "UNCONFIRMED",
      "url": "https://xsc.cdut.edu.cn/zzgl/zzzc.htm"
    },
    {
      "sourceId": "SRC-010",
      "title": "成都理工新闻网（党委学生工作部）：[《成都理工大学关于组织受灾学生申请临时困难补助的通知》](https://news.cdut.edu.cn/info/1005/46030.htm)",
      "evidenceStatus": "UNCONFIRMED",
      "url": "https://news.cdut.edu.cn/info/1005/46030.htm"
    },
    {
      "sourceId": "SRC-011",
      "title": "成都理工大学财务处：[《成都理工大学在校生2026-2027学年缴费通知》](https://jcc.cdut.edu.cn/info/1012/2724.htm)",
      "evidenceStatus": "PARTIAL",
      "url": "https://jcc.cdut.edu.cn/info/1012/2724.htm"
    },
    {
      "sourceId": "SRC-012",
      "title": "学生资助管理中心等：[《成都理工大学2024年秋季学期学生国家奖助学金发放公告（第一批）》](https://xsc.cdut.edu.cn/info/1033/2709.htm)",
      "evidenceStatus": "PARTIAL",
      "url": "https://xsc.cdut.edu.cn/info/1033/2709.htm"
    },
    {
      "sourceId": "SRC-013",
      "title": "学生处：[《愿平安｜成都理工大学开通暑期自然灾害地区受灾致家庭经济困难学生的资助通道》](https://xsc.cdut.edu.cn/info/1025/2414.htm)",
      "evidenceStatus": "PARTIAL",
      "url": "https://xsc.cdut.edu.cn/info/1025/2414.htm"
    },
    {
      "sourceId": "SRC-014",
      "title": "学生资助管理中心：[《愿平安丨关于做好近期受地震等自然灾害影响的学生困难情况摸排和临时困难补助工作的通知》](https://xsc.cdut.edu.cn/info/1033/2783.htm)",
      "evidenceStatus": "PARTIAL",
      "url": "https://xsc.cdut.edu.cn/info/1033/2783.htm"
    },
    {
      "sourceId": "SRC-015",
      "title": "成都理工大学学生资助管理中心办公室：[《关于开展海南广东等地受台风灾害影响学生专项资助工作的通知》](https://xsc.cdut.edu.cn/info/1046/2282.htm)",
      "evidenceStatus": "PARTIAL",
      "url": "https://xsc.cdut.edu.cn/info/1046/2282.htm"
    }
  ],
  "criteria": [
    {
      "sectionId": "rules-08-2",
      "criterionId": "R001",
      "sourceIds": [
        "SRC-002"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R002",
      "sourceIds": [
        "SRC-002"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R003",
      "sourceIds": [
        "SRC-002"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R004",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R005",
      "sourceIds": [
        "SRC-003"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rules-08-3",
      "criterionId": "R006",
      "sourceIds": [
        "SRC-002"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rules-08-3",
      "criterionId": "R007",
      "sourceIds": [
        "SRC-003"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rules-08-3",
      "criterionId": "R008",
      "sourceIds": [
        "SRC-007"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules-08-3",
      "criterionId": "R009",
      "sourceIds": [
        "SRC-007"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules-08-3",
      "criterionId": "R010",
      "sourceIds": [
        "SRC-004"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rules-08-3",
      "criterionId": "R011",
      "sourceIds": [
        "SRC-007"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules-08-3",
      "criterionId": "R012",
      "sourceIds": [
        "SRC-002"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules-08-3",
      "criterionId": "R013",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules-08-3",
      "criterionId": "R014",
      "sourceIds": [
        "SRC-003"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rules-08-3",
      "criterionId": "R015",
      "sourceIds": [
        "SRC-003"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rules-08-4",
      "criterionId": "R016",
      "sourceIds": [
        "SRC-009"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules-08-4",
      "criterionId": "R017",
      "sourceIds": [
        "SRC-012"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rules-08-4",
      "criterionId": "R018",
      "sourceIds": [
        "SRC-011"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rules-08-4",
      "criterionId": "R019",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules-08-4",
      "criterionId": "R020",
      "sourceIds": [
        "SRC-003"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules-08-5",
      "criterionId": "R021",
      "sourceIds": [
        "SRC-006"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules-08-5",
      "criterionId": "R022",
      "sourceIds": [
        "SRC-015"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules-08-5",
      "criterionId": "R023",
      "sourceIds": [
        "SRC-015"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules-08-5",
      "criterionId": "R024",
      "sourceIds": [
        "SRC-004"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules-08-5",
      "criterionId": "R025",
      "sourceIds": [
        "SRC-006"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rules-08-5",
      "criterionId": "R026",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules-08-5",
      "criterionId": "R027",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "UNCONFIRMED"
    }
  ],
  "limitations": [
    "SRC-* 是研究来源索引，不是案卷 SourceRef。",
    "政策/权限/当期批次未知时只转人工复核，不自动批准或拒绝。",
    "保持 draft；共享注册与 Plan/Run 接线由集成 Owner 负责。"
  ]
} as const

/** R02 质量集成统一读取口；保留原批次具名导出兼容性。 */
export const templateVersion = S03T10
