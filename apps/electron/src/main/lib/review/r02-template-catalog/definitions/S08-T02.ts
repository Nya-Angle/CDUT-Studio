/** R02 S08-T02: mechanical, source-traceable V3 draft; no official school authorization. */
import type { TemplateVersion } from '@profer/shared'
import { validateTemplate } from '../../template-store'

export const templateVersion: TemplateVersion = {
  templateId: "S08-T02",
  version: 1, schemaVersion: 2, name: "研究生个人培养计划变更和课程安排审核",
  description: "本地研究模板 · 非校方正式模板。研究生个人培养计划变更和课程安排审核。仅做证据关联、事实审查、风险与补件建议；政策适用和最终决定由有权人员确认。",
  catalogKind: 'builtin',
  sourceNote: "R02_RESEARCH_TEMPLATE_NONOFFICIAL: 非校方正式模板；审阅稿 docs/design/review-agent/business-templates/R02/S08-T02.md SHA-256 d4aa472bcb8dc050a8f340ae424a8ea6185f58b1eaab5538582ed10ab5289e4f；补缺源稿 ChatGPT Library S08-T02_正式业务模板_MD_v1.0.md SHA-256 d4aa472bcb8dc050a8f340ae424a8ea6185f58b1eaab5538582ed10ab5289e4f。SRC 为研究文献索引，不是案卷 SourceRef；校规及签批权待确认。",
  objectType:'person', displayName:{template:"研究生个人培养计划变更和课程安排审核"},
  fields: [
  {
    "key": "F001",
    "label": "caseid S",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F001：caseid S；申请全阶段；唯一 Case；AUTH / L / REQ；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F002",
    "label": "applicantstudentid S",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F002：applicantstudentid S；本人 ID；申请/事件阶段；AUTH 身份绑定 / H / REQ；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F003",
    "label": "actorrolesscope L",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F003：actorrolesscope L；申请人、代办人、审核人、机构范围；AUTH / H / REQ；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F004",
    "label": "academicidentity O",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F004：academicidentity O；学院、学科/专业代码、方向、学位点；AUTH / M / FETCH；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F005",
    "label": "programtrackcohort O",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F005：programtrackcohort O；入学年、硕博/直博、学术/专业、全/非全、联合培养标志；AUTH / M / FETCH；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F006",
    "label": "studentstatus E",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F006：studentstatus E；在籍、休学、复学、结业、离校等状态；AUTH / M / FETCH；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F007",
    "label": "supervisorbinding O",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F007：supervisorbinding O；现任导师/导师组、任期及可信关系版本；AUTH / M / FETCH；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F008",
    "label": "baselineplan O",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F008：baselineplan O；已确认个人计划 ID/hash/version/生效日期；AUTH/DEC / M / REQ；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F009",
    "label": "governingprogram O",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F009：governingprogram O；适用培养方案 ID、专业、年级、版本、生效范围、签发单位；AUTH/DEC / M / REQ；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F010",
    "label": "changetype E",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F010：changetype E；add/drop/replace/reschedule/reclassify/equivalence/mixed；SUB 与 diff 校验 / L / REQ；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F011",
    "label": "changereasonandeffectiveterm O",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F011：changereasonandeffectiveterm O；本次原因、拟执行学期/日期；SUB/证明 / M / REQ；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F012",
    "label": "beforecourselines L",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F012：beforecourselines L；旧计划课程代码、类别、学分、学期、状态；AUTH baseline / M / REQ；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F013",
    "label": "aftercourselines L",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F013：aftercourselines L；拟修改课程代码、类别、学分、学期、状态；SUB 草稿/校验 / M / REQ；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F014",
    "label": "coursecatalogversions L",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F014：coursecatalogversions L；课程 code、名称、级别、学分、类别、可修要求；AUTH 开课单位 / M / FETCH；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F015",
    "label": "timetableoffering L",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F015：timetableoffering L；学期、开课/停开、教学班、时段、容量信息；AUTH / M / COND；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F016",
    "label": "transcriptsnapshot L",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F016：transcriptsnapshot L；课程代码、成绩、重修记录、原始学分、结果版本；AUTH 成绩主管 / H / COND；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F017",
    "label": "recognitionmapping L",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F017：recognitionmapping L；课程等效、替代、外校学分转换、决定 ID；DEC / M / COND；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F018",
    "label": "degreerequirementbuckets L",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F018：degreerequirementbuckets L；各必修课/类别/学分约束、补修/实践要求；F009 所属方案 / M / REQ；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F019",
    "label": "gradepassequivalencepolicy O",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F019：gradepassequivalencepolicy O；当前成绩通过、等级换算、重复计分规则及版本；AUTH 校规 / M / COND；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F020",
    "label": "accumulatedcredits O",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F020：accumulatedcredits O；已修、在修、计划将修，按 F018 类别分组；派生，带 lineage / M / COND；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F021",
    "label": "milestonestaterefs L",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F021：milestonestaterefs L；开题、中期、送审等已签状态 ID，仅只读；DEC/其他 S08 / M / COND；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F022",
    "label": "externalcourseflag B",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F022：externalcourseflag B；跨院/校/学科或联合授课情形；F013/F014 + SUB / L / REQ；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F023",
    "label": "externalapprovalrecord O",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F023：externalapprovalrecord O；跨单位课程审批 ID、签发主体、状态、版本；DEC / M / COND/LATER；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F024",
    "label": "supervisordecision O",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F024：supervisordecision O；导师审核意见、签名身份、时间、计划 hash；DEC / M / LATER；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F025",
    "label": "collegedecision O",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F025：collegedecision O；学院意见/会议决定及授权记录；DEC / M / LATER；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F026",
    "label": "graduateofficedecision O",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F026：graduateofficedecision O；学校实质决定/备案、签发 scope 和事件 ID；DEC / M / LATER；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F027",
    "label": "effectiveplanversion O",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F027：effectiveplanversion O；最终生效 planId、sourceVersion、签名与生效日；AUTH/DEC / M / LATER；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F028",
    "label": "withdrawalreviewevent O",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F028：withdrawalreviewevent O；撤回/复核类型、对象、理由、发起人、时间；AUTH/SUB / M / COND；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F029",
    "label": "evidenceprovenance L",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F029：evidenceprovenance L；每附件 hash、出具方、有效期、sourceVersion；AUTH 元数据 / M / REQ；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F030",
    "label": "accessconsentscope O",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F030：accessconsentscope O；处理目的、授权主体、最小访问范围；AUTH / H / REQ；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F031",
    "label": "selectionevents L",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F031：selectionevents L；正式选课系统增退选等关联日志；AUTH / M / COND；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F032",
    "label": "stateeventclock O",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F032：stateeventclock O；实际提交、通知、签发、撤回、复核时间链；AUTH / M / REQ；枚举和复杂值待可信来源核验，不按文字猜类型。"
  }
],
  materialSlots: [
  {
    "id": "M001",
    "name": "学籍与学段身份；校方学籍服务，不以学生卡单独替代",
    "purpose": "研究稿 M001：学籍与学段身份；校方学籍服务，不以学生卡单独替代；当下/F002,F004–F006/R001,R002/SRC-010,SRC-015；失联 SOURCEUNAVAILABLE；不把离线截图当在籍签名。是否应由学生当前上传须按阶段、触发条件及授权来源人工核实；校方后置记录不是申请初期缺件。",
    "requiredElements": [
      "出具方及适用对象",
      "内容哈希、版本与生效时点",
      "可信证据来源及当前阶段"
    ],
    "acceptedKinds": [
      "pdf",
      "image",
      "office",
      "sheet",
      "text"
    ],
    "minCount": 0,
    "maxCount": 20,
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M002",
    "name": "计划变更申请及差异明细；本人结构化草稿或校方有效申请表",
    "purpose": "研究稿 M002：计划变更申请及差异明细；本人结构化草稿或校方有效申请表；当下/F010–F013/R005,R006,R007/SRC-003,SRC-004；缺 NEEDSMATERIAL；解析失败 UNREADABLE。是否应由学生当前上传须按阶段、触发条件及授权来源人工核实；校方后置记录不是申请初期缺件。",
    "requiredElements": [
      "出具方及适用对象",
      "内容哈希、版本与生效时点",
      "可信证据来源及当前阶段"
    ],
    "acceptedKinds": [
      "pdf",
      "image",
      "office",
      "sheet",
      "text"
    ],
    "minCount": 0,
    "maxCount": 20,
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M003",
    "name": "已生效旧个人计划；校方签发库/带原始签章的受权副本",
    "purpose": "研究稿 M003：已生效旧个人计划；校方签发库/带原始签章的受权副本；当下/F008,F012/R003,R005,R027/SRC-003,SRC-004；无旧计划先确认首次制定路径；不造 baseline。是否应由学生当前上传须按阶段、触发条件及授权来源人工核实；校方后置记录不是申请初期缺件。",
    "requiredElements": [
      "出具方及适用对象",
      "内容哈希、版本与生效时点",
      "可信证据来源及当前阶段"
    ],
    "acceptedKinds": [
      "pdf",
      "image",
      "office",
      "sheet",
      "text"
    ],
    "minCount": 0,
    "maxCount": 20,
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M004",
    "name": "适用培养方案及版本；研究生院/学院正式库",
    "purpose": "研究稿 M004：适用培养方案及版本；研究生院/学院正式库；当下/F009,F018/R004,R008,R009,R010/SRC-003,SRC-006；版本不可得 SOURCEUNAVAILABLE 或 POLICYUNCONFIRMED。是否应由学生当前上传须按阶段、触发条件及授权来源人工核实；校方后置记录不是申请初期缺件。",
    "requiredElements": [
      "出具方及适用对象",
      "内容哈希、版本与生效时点",
      "可信证据来源及当前阶段"
    ],
    "acceptedKinds": [
      "pdf",
      "image",
      "office",
      "sheet",
      "text"
    ],
    "minCount": 0,
    "maxCount": 20,
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M005",
    "name": "调整理由/原因支撑；本人说明、停课公文等",
    "purpose": "研究稿 M005：调整理由/原因支撑；本人说明、停课公文等；当下或条件/F011/R005,R013/SRC-003；普通理由要求未核；仅针对政策必需的佐证发待办。是否应由学生当前上传须按阶段、触发条件及授权来源人工核实；校方后置记录不是申请初期缺件。",
    "requiredElements": [
      "出具方及适用对象",
      "内容哈希、版本与生效时点",
      "可信证据来源及当前阶段"
    ],
    "acceptedKinds": [
      "pdf",
      "image",
      "office",
      "sheet",
      "text"
    ],
    "minCount": 0,
    "maxCount": 20,
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M006",
    "name": "新旧课程目录及类别学分；开课单位/课程系统",
    "purpose": "研究稿 M006：新旧课程目录及类别学分；开课单位/课程系统；当下后台/F012–F014/R007,R008,R009/SRC-006,SRC-012；未取得目录不以候选名称猜课程代码。是否应由学生当前上传须按阶段、触发条件及授权来源人工核实；校方后置记录不是申请初期缺件。",
    "requiredElements": [
      "出具方及适用对象",
      "内容哈希、版本与生效时点",
      "可信证据来源及当前阶段"
    ],
    "acceptedKinds": [
      "pdf",
      "image",
      "office",
      "sheet",
      "text"
    ],
    "minCount": 0,
    "maxCount": 20,
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M007",
    "name": "正式成绩/已修状态；成绩主管系统/官方带签成绩单",
    "purpose": "研究稿 M007：正式成绩/已修状态；成绩主管系统/官方带签成绩单；条件：已修/替代/F016,F019,F020/R010,R011,R014/SRC-010,SRC-014；系统断开为 SOURCEUNAVAILABLE；手工改分不接受。是否应由学生当前上传须按阶段、触发条件及授权来源人工核实；校方后置记录不是申请初期缺件。",
    "requiredElements": [
      "出具方及适用对象",
      "内容哈希、版本与生效时点",
      "可信证据来源及当前阶段"
    ],
    "acceptedKinds": [
      "pdf",
      "image",
      "office",
      "sheet",
      "text"
    ],
    "minCount": 0,
    "maxCount": 20,
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M008",
    "name": "开课与课表状态；校院开课管理服务、停开通知",
    "purpose": "研究稿 M008：开课与课表状态；校院开课管理服务、停开通知；条件：时间冲突/停开/F015,F031/R012,R013/SRC-007,SRC-013；搜索页面不等于该学期真实开课。是否应由学生当前上传须按阶段、触发条件及授权来源人工核实；校方后置记录不是申请初期缺件。",
    "requiredElements": [
      "出具方及适用对象",
      "内容哈希、版本与生效时点",
      "可信证据来源及当前阶段"
    ],
    "acceptedKinds": [
      "pdf",
      "image",
      "office",
      "sheet",
      "text"
    ],
    "minCount": 0,
    "maxCount": 20,
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M009",
    "name": "课程等效/学分认可决定；校方有权单位签发文件",
    "purpose": "研究稿 M009：课程等效/学分认可决定；校方有权单位签发文件；条件：替代/外校学分/F017/R014,R016/SRC-003,SRC-012；无已签认可不得计学分；只可请有权人认定。是否应由学生当前上传须按阶段、触发条件及授权来源人工核实；校方后置记录不是申请初期缺件。",
    "requiredElements": [
      "出具方及适用对象",
      "内容哈希、版本与生效时点",
      "可信证据来源及当前阶段"
    ],
    "acceptedKinds": [
      "pdf",
      "image",
      "office",
      "sheet",
      "text"
    ],
    "minCount": 0,
    "maxCount": 20,
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M010",
    "name": "跨校/跨学院/跨学科选课申请及课程介绍；本人+开课单位",
    "purpose": "研究稿 M010：跨校/跨学院/跨学科选课申请及课程介绍；本人+开课单位；条件：C04/F022,F014/R015,SRC-003,SRC-012；缺介绍才补；审批回执在后续，不先索要。是否应由学生当前上传须按阶段、触发条件及授权来源人工核实；校方后置记录不是申请初期缺件。",
    "requiredElements": [
      "出具方及适用对象",
      "内容哈希、版本与生效时点",
      "可信证据来源及当前阶段"
    ],
    "acceptedKinds": [
      "pdf",
      "image",
      "office",
      "sheet",
      "text"
    ],
    "minCount": 0,
    "maxCount": 20,
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M011",
    "name": "导师审查意见及可信审核事件；导师/受权服务",
    "purpose": "研究稿 M011：导师审查意见及可信审核事件；导师/受权服务；后续/F007,F024/R018/SRC-003；未轮到导师不报缺，伪 actor 记 CONFLICT。是否应由学生当前上传须按阶段、触发条件及授权来源人工核实；校方后置记录不是申请初期缺件。",
    "requiredElements": [
      "出具方及适用对象",
      "内容哈希、版本与生效时点",
      "可信证据来源及当前阶段"
    ],
    "acceptedKinds": [
      "pdf",
      "image",
      "office",
      "sheet",
      "text"
    ],
    "minCount": 0,
    "maxCount": 20,
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M012",
    "name": "培养单位审查/分委会意见；学院受权服务",
    "purpose": "研究稿 M012：培养单位审查/分委会意见；学院受权服务；后续/F025/R019/SRC-003；学院步骤/会议要求当期未核，策略 POLICYUNCONFIRMED。是否应由学生当前上传须按阶段、触发条件及授权来源人工核实；校方后置记录不是申请初期缺件。",
    "requiredElements": [
      "出具方及适用对象",
      "内容哈希、版本与生效时点",
      "可信证据来源及当前阶段"
    ],
    "acceptedKinds": [
      "pdf",
      "image",
      "office",
      "sheet",
      "text"
    ],
    "minCount": 0,
    "maxCount": 20,
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M013",
    "name": "研究生院或校方有权审批/备案决定",
    "purpose": "研究稿 M013：研究生院或校方有权审批/备案决定；后续/F026/R020/SRC-003；未签发保持待决定，绝不可 OCR 通过。是否应由学生当前上传须按阶段、触发条件及授权来源人工核实；校方后置记录不是申请初期缺件。",
    "requiredElements": [
      "出具方及适用对象",
      "内容哈希、版本与生效时点",
      "可信证据来源及当前阶段"
    ],
    "acceptedKinds": [
      "pdf",
      "image",
      "office",
      "sheet",
      "text"
    ],
    "minCount": 0,
    "maxCount": 20,
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M014",
    "name": "新生效个人计划/系统变更回执",
    "purpose": "研究稿 M014：新生效个人计划/系统变更回执；批准后/F027/R021,R027/SRC-003；决定已签但同步失败为待执行而非已生效。是否应由学生当前上传须按阶段、触发条件及授权来源人工核实；校方后置记录不是申请初期缺件。",
    "requiredElements": [
      "出具方及适用对象",
      "内容哈希、版本与生效时点",
      "可信证据来源及当前阶段"
    ],
    "acceptedKinds": [
      "pdf",
      "image",
      "office",
      "sheet",
      "text"
    ],
    "minCount": 0,
    "maxCount": 20,
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M015",
    "name": "正式选课事件、冲突记录；教务选课服务",
    "purpose": "研究稿 M015：正式选课事件、冲突记录；教务选课服务；条件：是否已选/普通选课路由/F031/R006,R022/SRC-003,SRC-012；无日志不能断言已选/退选。是否应由学生当前上传须按阶段、触发条件及授权来源人工核实；校方后置记录不是申请初期缺件。",
    "requiredElements": [
      "出具方及适用对象",
      "内容哈希、版本与生效时点",
      "可信证据来源及当前阶段"
    ],
    "acceptedKinds": [
      "pdf",
      "image",
      "office",
      "sheet",
      "text"
    ],
    "minCount": 0,
    "maxCount": 20,
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M016",
    "name": "上游学籍、导师、联合培养或培养层次转段决定；对应模板正式决定",
    "purpose": "研究稿 M016：上游学籍、导师、联合培养或培养层次转段决定；对应模板正式决定；条件：C05/F004,F005,F006,F007/R002,R026/SRC-001,SRC-002；无签决定不推定身份已变；路由上游。是否应由学生当前上传须按阶段、触发条件及授权来源人工核实；校方后置记录不是申请初期缺件。",
    "requiredElements": [
      "出具方及适用对象",
      "内容哈希、版本与生效时点",
      "可信证据来源及当前阶段"
    ],
    "acceptedKinds": [
      "pdf",
      "image",
      "office",
      "sheet",
      "text"
    ],
    "minCount": 0,
    "maxCount": 20,
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M017",
    "name": "里程碑签发事件（开题/中期等）；其他 S08 可信服务",
    "purpose": "研究稿 M017：里程碑签发事件（开题/中期等）；其他 S08 可信服务；条件：C07/F021/R017,R026/SRC-005；不要求学生上传阶段会尚未产生的结论。是否应由学生当前上传须按阶段、触发条件及授权来源人工核实；校方后置记录不是申请初期缺件。",
    "requiredElements": [
      "出具方及适用对象",
      "内容哈希、版本与生效时点",
      "可信证据来源及当前阶段"
    ],
    "acceptedKinds": [
      "pdf",
      "image",
      "office",
      "sheet",
      "text"
    ],
    "minCount": 0,
    "maxCount": 20,
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M018",
    "name": "撤回申请与可信身份事件；本人/有权代理",
    "purpose": "研究稿 M018：撤回申请与可信身份事件；本人/有权代理；撤回阶段/F028,F032/R023/SRC-010；待有权确认撤回；已签决定不能直接删除。是否应由学生当前上传须按阶段、触发条件及授权来源人工核实；校方后置记录不是申请初期缺件。",
    "requiredElements": [
      "出具方及适用对象",
      "内容哈希、版本与生效时点",
      "可信证据来源及当前阶段"
    ],
    "acceptedKinds": [
      "pdf",
      "image",
      "office",
      "sheet",
      "text"
    ],
    "minCount": 0,
    "maxCount": 20,
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M019",
    "name": "复核意见和针对性理由；本人/有权机构",
    "purpose": "研究稿 M019：复核意见和针对性理由；本人/有权机构；复核阶段/F028,F032/R024/SRC-005,SRC-010；对纯计划调整的正式救济期限仍待核。是否应由学生当前上传须按阶段、触发条件及授权来源人工核实；校方后置记录不是申请初期缺件。",
    "requiredElements": [
      "出具方及适用对象",
      "内容哈希、版本与生效时点",
      "可信证据来源及当前阶段"
    ],
    "acceptedKinds": [
      "pdf",
      "image",
      "office",
      "sheet",
      "text"
    ],
    "minCount": 0,
    "maxCount": 20,
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M020",
    "name": "不可抗/休复学等特殊原因文件；本人/校方对应单位",
    "purpose": "研究稿 M020：不可抗/休复学等特殊原因文件；本人/校方对应单位；条件：C05/例外/F006,F011/R002,R013/SRC-003,SRC-015；敏感材料不强制上传全文，可受权事实证明。是否应由学生当前上传须按阶段、触发条件及授权来源人工核实；校方后置记录不是申请初期缺件。",
    "requiredElements": [
      "出具方及适用对象",
      "内容哈希、版本与生效时点",
      "可信证据来源及当前阶段"
    ],
    "acceptedKinds": [
      "pdf",
      "image",
      "office",
      "sheet",
      "text"
    ],
    "minCount": 0,
    "maxCount": 20,
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M021",
    "name": "来源、版本、授权及完整性日志；可信存储与审计服务",
    "purpose": "研究稿 M021：来源、版本、授权及完整性日志；可信存储与审计服务；所有阶段/F001,F003,F029,F030,F032/R025,R027/SRC-001,SRC-010；缺来源不可直接给 PASSFACT；形成审计待办。是否应由学生当前上传须按阶段、触发条件及授权来源人工核实；校方后置记录不是申请初期缺件。",
    "requiredElements": [
      "出具方及适用对象",
      "内容哈希、版本与生效时点",
      "可信证据来源及当前阶段"
    ],
    "acceptedKinds": [
      "pdf",
      "image",
      "office",
      "sheet",
      "text"
    ],
    "minCount": 0,
    "maxCount": 20,
    "allowReuseAcrossSubjects": false
  }
],
  sections:[{id:'r02-fact-review',name:'研究稿 R 规则逐项事实核验与人工审查',description:'每条 R 均为独立检查：未知政策或签发权限须转人工；不等于正式行政决定。',order:0,required:true,criteria:[
  {
    "id": "R001",
    "title": "本人身份及申请权；提交 T在籍本人/受权代理，F冒名或非本校，U服务不通",
    "requirement": "| R001 | 本人身份及申请权；提交 T在籍本人/受权代理，F冒名或非本校，U服务不通 | F002,F003,F030 / M001,M021 / SRC-001,SRC-010；可信会话主体、学籍、代理授权交集 | T PASSFACT→C；F CONFLICT→A；U SOURCEUNAVAILABLE→A |。仅做原文所列事实、冲突、例外及来源状态检查；未核校规/权限必须提示人工确认，禁止自动正式批准、拒绝或远端写回。",
    "execution": "semantic",
    "targetScope": "case"
  },
  {
    "id": "R002",
    "title": "学籍状态允许何种变更；C05或异常身份 T已签有效状态，F非在籍或未获身份变更，U未读",
    "requirement": "| R002 | 学籍状态允许何种变更；C05或异常身份 T已签有效状态，F非在籍或未获身份变更，U未读 | F004–F006,F011 / M001,M016,M020 / SRC-003,SRC-015；检查身份决定时间与适用方案 | T事实可核→C，但办理资格未知则 POLICYUNCONFIRMED→H；F NEEDSHUMANDECISION→C；U SOURCEUNAVAILABLE→A |。仅做原文所列事实、冲突、例外及来源状态检查；未核校规/权限必须提示人工确认，禁止自动正式批准、拒绝或远端写回。",
    "execution": "semantic",
    "targetScope": "case"
  },
  {
    "id": "R003",
    "title": "唯一基线计划有效性；提交 T有签发的版本，F纯首次制定，U存储断开",
    "requirement": "| R003 | 唯一基线计划有效性；提交 T有签发的版本，F纯首次制定，U存储断开 | F008,F012 / M003 / SRC-003,SRC-004；hash/planId/学号一致 | T PASSFACT→C；F NOTAPPLICABLE 并路由首次制订；U SOURCEUNAVAILABLE→A |。仅做原文所列事实、冲突、例外及来源状态检查；未核校规/权限必须提示人工确认，禁止自动正式批准、拒绝或远端写回。",
    "execution": "semantic",
    "targetScope": "case"
  },
  {
    "id": "R004",
    "title": "当前学生与培养方案匹配；提交 T学段专业批次版本一致，F版本/对象冲突，U版本不可知",
    "requirement": "| R004 | 当前学生与培养方案匹配；提交 T学段专业批次版本一致，F版本/对象冲突，U版本不可知 | F004,F005,F009,F018 / M001,M004 / SRC-003,SRC-006；按专业+批次+学位类型 join | T PASSFACT→C；F CONFLICT→H；U POLICYUNCONFIRMED→H |。仅做原文所列事实、冲突、例外及来源状态检查；未核校规/权限必须提示人工确认，禁止自动正式批准、拒绝或远端写回。",
    "execution": "semantic",
    "targetScope": "case"
  },
  {
    "id": "R005",
    "title": "变更请求差异与原因可识别；提交 T有旧新课程及生效学期，F缺请求核心，U扫描无法识别",
    "requirement": "| R005 | 变更请求差异与原因可识别；提交 T有旧新课程及生效学期，F缺请求核心，U扫描无法识别 | F010–F013 / M002,M003,M005 / SRC-003,SRC-004；courseId/category/semester 结构化 diff | T PASSFACT→C；F NEEDSMATERIAL→S；U UNREADABLE→S |。仅做原文所列事实、冲突、例外及来源状态检查；未核校规/权限必须提示人工确认，禁止自动正式批准、拒绝或远端写回。",
    "execution": "semantic",
    "targetScope": "case"
  },
  {
    "id": "R006",
    "title": "是否实质更改个人计划；路由 T差异集非空，F仅普通选课，U基线/选课源不可得",
    "requirement": "| R006 | 是否实质更改个人计划；路由 T差异集非空，F仅普通选课，U基线/选课源不可得 | F008,F010,F012,F013,F031 / M002,M015 / SRC-001,SRC-003,SRC-012；diff 与选课日志分离 | T PASSFACT→C；F NOTAPPLICABLE→选课系统；U SOURCEUNAVAILABLE→A |。仅做原文所列事实、冲突、例外及来源状态检查；未核校规/权限必须提示人工确认，禁止自动正式批准、拒绝或远端写回。",
    "execution": "semantic",
    "targetScope": "case"
  },
  {
    "id": "R007",
    "title": "提议课程代码、学分、类别身份；提交 T代码能映射官方目录，F同名不同代码/属性冲突，U目录离线",
    "requirement": "| R007 | 提议课程代码、学分、类别身份；提交 T代码能映射官方目录，F同名不同代码/属性冲突，U目录离线 | F013,F014 / M002,M006 / SRC-003,SRC-006；按课程和版本精确键 | T PASSFACT→C；F CONFLICT→C；U SOURCEUNAVAILABLE→A |。仅做原文所列事实、冲突、例外及来源状态检查；未核校规/权限必须提示人工确认，禁止自动正式批准、拒绝或远端写回。",
    "execution": "semantic",
    "targetScope": "case"
  },
  {
    "id": "R008",
    "title": "必修及培养环节要求有无被遗漏；C02/C05 T每必修组仍有履行方案，F删掉必修无替代，U方案未核",
    "requirement": "| R008 | 必修及培养环节要求有无被遗漏；C02/C05 T每必修组仍有履行方案，F删掉必修无替代，U方案未核 | F009,F013,F018 / M004,M006 / SRC-003,SRC-004,SRC-006；按方案必修集合差额和豁免决定 | T PASSFACT→C；F NEEDSHUMANDECISION→C；U POLICYUNCONFIRMED→H |。仅做原文所列事实、冲突、例外及来源状态检查；未核校规/权限必须提示人工确认，禁止自动正式批准、拒绝或远端写回。",
    "execution": "semantic",
    "targetScope": "case"
  },
  {
    "id": "R009",
    "title": "拟修总学分及分项学分适足；C02/C05 T每类 meets 当前方案，F有缺口，U仅持旧表数字",
    "requirement": "| R009 | 拟修总学分及分项学分适足；C02/C05 T每类 meets 当前方案，F有缺口，U仅持旧表数字 | F009,F013,F018,F020 / M004,M006 / SRC-004,SRC-006；分类计算计划将修≠已获 | T PASSFACT→C；F事实不足 NEEDSHUMANDECISION→C；U POLICYUNCONFIRMED→H |。仅做原文所列事实、冲突、例外及来源状态检查；未核校规/权限必须提示人工确认，禁止自动正式批准、拒绝或远端写回。",
    "execution": "semantic",
    "targetScope": "case"
  },
  {
    "id": "R010",
    "title": "已获成绩学分与计划要求对齐；C06/C07 T按课程+成绩状态且无重复计学分，F已修与类别冲突，U成绩源缺",
    "requirement": "| R010 | 已获成绩学分与计划要求对齐；C06/C07 T按课程+成绩状态且无重复计学分，F已修与类别冲突，U成绩源缺 | F016,F018–F020 / M004,M007 / SRC-003,SRC-010,SRC-014；只计已签成绩和合规等效 | T PASSFACT→C；F CONFLICT→成绩管理/ C；U SOURCEUNAVAILABLE→A |。仅做原文所列事实、冲突、例外及来源状态检查；未核校规/权限必须提示人工确认，禁止自动正式批准、拒绝或远端写回。",
    "execution": "semantic",
    "targetScope": "case"
  },
  {
    "id": "R011",
    "title": "不及格/重修/成绩换算处理；C06 T有原始成绩和有效换算规则，F用户自改，U校本换算未取得",
    "requirement": "| R011 | 不及格/重修/成绩换算处理；C06 T有原始成绩和有效换算规则，F用户自改，U校本换算未取得 | F016,F019,F020 / M007 / SRC-010,SRC-014；按当期规则、重修标志与学段 | T事实可核→C；F CONFLICT→成绩管理；U POLICYUNCONFIRMED→H |。仅做原文所列事实、冲突、例外及来源状态检查；未核校规/权限必须提示人工确认，禁止自动正式批准、拒绝或远端写回。",
    "execution": "semantic",
    "targetScope": "case"
  },
  {
    "id": "R012",
    "title": "拟安排学期确有课程/可修；C03 T官方开课满足，F停开/时段互斥，U课表未发布",
    "requirement": "| R012 | 拟安排学期确有课程/可修；C03 T官方开课满足，F停开/时段互斥，U课表未发布 | F013–F015,F031 / M006,M008 / SRC-007,SRC-012,SRC-013；semester+class+time 对比 | T PASSFACT→C；F NEEDSHUMANDECISION→C；U SOURCEUNAVAILABLE→A；不得承诺一定有名额 |。仅做原文所列事实、冲突、例外及来源状态检查；未核校规/权限必须提示人工确认，禁止自动正式批准、拒绝或远端写回。",
    "execution": "semantic",
    "targetScope": "case"
  },
  {
    "id": "R013",
    "title": "停开/时间冲突/休学理由与更改范围一致；C03/C05 T有官方佐证，F申请与事实冲突，U无公告",
    "requirement": "| R013 | 停开/时间冲突/休学理由与更改范围一致；C03/C05 T有官方佐证，F申请与事实冲突，U无公告 | F006,F011,F015 / M005,M008,M020 / SRC-003,SRC-007；原因与影响课程逐行匹配 | T PASSFACT→D；F CONFLICT→S/C；U NEEDSMATERIAL 或 SOURCEUNAVAILABLE 按持有人→S/A |。仅做原文所列事实、冲突、例外及来源状态检查；未核校规/权限必须提示人工确认，禁止自动正式批准、拒绝或远端写回。",
    "execution": "semantic",
    "targetScope": "case"
  },
  {
    "id": "R014",
    "title": "替代/重认课程可合法等效；C02/C06 T已有受权等效决定，F仅学生主张等价，U审批标准未知",
    "requirement": "| R014 | 替代/重认课程可合法等效；C02/C06 T已有受权等效决定，F仅学生主张等价，U审批标准未知 | F013,F016,F017 / M007,M009 / SRC-003,SRC-012,SRC-013；比较已签映射的主体/课程/版本 | T PASSFACT→C；F NEEDSHUMANDECISION→C；U POLICYUNCONFIRMED→H |。仅做原文所列事实、冲突、例外及来源状态检查；未核校规/权限必须提示人工确认，禁止自动正式批准、拒绝或远端写回。",
    "execution": "semantic",
    "targetScope": "case"
  },
  {
    "id": "R015",
    "title": "跨校、跨院、跨学科课程的审批路径；C04 T有跨域标志和申请信息，F非跨域，U权限未核",
    "requirement": "| R015 | 跨校、跨院、跨学科课程的审批路径；C04 T有跨域标志和申请信息，F非跨域，U权限未核 | F013,F014,F022,F023 / M010,M011,M012,M013 / SRC-003,SRC-012；按课程归属和当期授权表 | T NEEDSHUMANDECISION→D/C/G；F NOTAPPLICABLE；U POLICYUNCONFIRMED→H；旧分委会要求不能冒充当期硬门槛 |。仅做原文所列事实、冲突、例外及来源状态检查；未核校规/权限必须提示人工确认，禁止自动正式批准、拒绝或远端写回。",
    "execution": "manual",
    "targetScope": "case"
  },
  {
    "id": "R016",
    "title": "跨校课程成绩/学分入账；C04完成后 T有正式学分认可，F仅外校截图，U成绩或转换政策失联",
    "requirement": "| R016 | 跨校课程成绩/学分入账；C04完成后 T有正式学分认可，F仅外校截图，U成绩或转换政策失联 | F016,F017,F019,F023 / M007,M009,M010 / SRC-003,SRC-010,SRC-012；签发主体与转入校方记录一致 | T PASSFACT→C；F NEEDSHUMANDECISION→G；U POLICYUNCONFIRMED 或 SOURCEUNAVAILABLE→H/A |。仅做原文所列事实、冲突、例外及来源状态检查；未核校规/权限必须提示人工确认，禁止自动正式批准、拒绝或远端写回。",
    "execution": "semantic",
    "targetScope": "case"
  },
  {
    "id": "R017",
    "title": "变更不重写已签培养里程碑；C07 T仅调整将来计划，F试图逆改已通过开题/中期历史，U结论未取",
    "requirement": "| R017 | 变更不重写已签培养里程碑；C07 T仅调整将来计划，F试图逆改已通过开题/中期历史，U结论未取 | F021,F027 / M017,M014 / SRC-005,SRC-011；里程碑版本与计划生效日序列比对 | T PASSFACT→C；F NEEDSHUMANDECISION→对应 S08 受权部门；U SOURCEUNAVAILABLE→A |。仅做原文所列事实、冲突、例外及来源状态检查；未核校规/权限必须提示人工确认，禁止自动正式批准、拒绝或远端写回。",
    "execution": "semantic",
    "targetScope": "case"
  },
  {
    "id": "R018",
    "title": "导师意见关联本次差异及真实身份；导师阶段 T已签且绑定 hash，F签字不对应本人，U尚未轮到",
    "requirement": "| R018 | 导师意见关联本次差异及真实身份；导师阶段 T已签且绑定 hash，F签字不对应本人，U尚未轮到 | F007,F024 / M011 / SRC-003；认证 actor+scope+planHash | T PASSFACT→C；F CONFLICT→C；U NEEDSHUMANDECISION→D，不在学生提交时报缺件 |。仅做原文所列事实、冲突、例外及来源状态检查；未核校规/权限必须提示人工确认，禁止自动正式批准、拒绝或远端写回。",
    "execution": "semantic",
    "targetScope": "case"
  },
  {
    "id": "R019",
    "title": "学院/分委会意见真实性；学院阶段 T有授权决定，F授权不符，U当期流程未核",
    "requirement": "| R019 | 学院/分委会意见真实性；学院阶段 T有授权决定，F授权不符，U当期流程未核 | F025 / M012 / SRC-003；校方权表、决定 ID、签名 | T PASSFACT→G；F CONFLICT→A；U POLICYUNCONFIRMED→H；未轮到不报缺件 |。仅做原文所列事实、冲突、例外及来源状态检查；未核校规/权限必须提示人工确认，禁止自动正式批准、拒绝或远端写回。",
    "execution": "semantic",
    "targetScope": "case"
  },
  {
    "id": "R020",
    "title": "最终受权决定是否真实；学校决定阶段 T正式批准/驳回/退回，F仅 AI 评语，U未签",
    "requirement": "| R020 | 最终受权决定是否真实；学校决定阶段 T正式批准/驳回/退回，F仅 AI 评语，U未签 | F026 / M013 / SRC-003,SRC-010；可信决定服务和 action scope | T PASSFACT（签发事实）→A；F NEEDSHUMANDECISION→G；U 保持 AWAITINGDECISION→G |。仅做原文所列事实、冲突、例外及来源状态检查；未核校规/权限必须提示人工确认，禁止自动正式批准、拒绝或远端写回。",
    "execution": "manual",
    "targetScope": "case"
  },
  {
    "id": "R021",
    "title": "生效计划已正确写入；批准后 T签决定对应新版本，F生效版与批准差异不一致，U同步未完成",
    "requirement": "| R021 | 生效计划已正确写入；批准后 T签决定对应新版本，F生效版与批准差异不一致，U同步未完成 | F008,F026,F027 / M003,M013,M014 / SRC-003；CAS(expectedBaselineVersion) + decisionId + planHash | T PASSFACT→C；F CONFLICT→A；U SOURCEUNAVAILABLE→A，禁止显示“已生效” |。仅做原文所列事实、冲突、例外及来源状态检查；未核校规/权限必须提示人工确认，禁止自动正式批准、拒绝或远端写回。",
    "execution": "semantic",
    "targetScope": "case"
  },
  {
    "id": "R022",
    "title": "正常选课与计划审核去重；路由 T选课事件不改变个人计划内容，F有计划差异，U日志不可读",
    "requirement": "| R022 | 正常选课与计划审核去重；路由 T选课事件不改变个人计划内容，F有计划差异，U日志不可读 | F008,F012,F013,F031 / M003,M015 / SRC-001,SRC-003；比对 plan diff 和 enrollment diff | T NOTAPPLICABLE→选课系统；F 转 R005；U SOURCEUNAVAILABLE→A |。仅做原文所列事实、冲突、例外及来源状态检查；未核校规/权限必须提示人工确认，禁止自动正式批准、拒绝或远端写回。",
    "execution": "semantic",
    "targetScope": "case"
  },
  {
    "id": "R023",
    "title": "撤回权限及是否可撤回已生效决定；撤回阶段 T申请未决且本人有权，F已生效欲直接删除，U状态不明",
    "requirement": "| R023 | 撤回权限及是否可撤回已生效决定；撤回阶段 T申请未决且本人有权，F已生效欲直接删除，U状态不明 | F002,F026,F028,F032 / M018,M013 / SRC-010,SRC-003；eventId 及状态核查 | T仅 NEEDSHUMANDECISION→G；F CONFLICT 并发起正式变更/撤销请求→G；U SOURCEUNAVAILABLE→A |。仅做原文所列事实、冲突、例外及来源状态检查；未核校规/权限必须提示人工确认，禁止自动正式批准、拒绝或远端写回。",
    "execution": "manual",
    "targetScope": "case"
  },
  {
    "id": "R024",
    "title": "复核对象/事实/决定关系；复核阶段 T针对明确问题及已有决定，F无对象，U权限或期限未核",
    "requirement": "| R024 | 复核对象/事实/决定关系；复核阶段 T针对明确问题及已有决定，F无对象，U权限或期限未核 | F026,F028,F032 / M019,M013 / SRC-005,SRC-010；关联 decisionId 和具体 R/M | T NEEDSHUMANDECISION→受权复核机关；F NEEDSMATERIAL→S；U POLICYUNCONFIRMED→H，不自动套用第41号处分申诉期限 |。仅做原文所列事实、冲突、例外及来源状态检查；未核校规/权限必须提示人工确认，禁止自动正式批准、拒绝或远端写回。",
    "execution": "manual",
    "targetScope": "case"
  },
  {
    "id": "R025",
    "title": "证据、身份、版本与最小访问授权；所有阶段 T provenance 完整，F跨学生/伪造 actor，U凭证断链",
    "requirement": "| R025 | 证据、身份、版本与最小访问授权；所有阶段 T provenance 完整，F跨学生/伪造 actor，U凭证断链 | F001–F003,F029,F030,F032 / M001,M021 / SRC-001,SRC-010；权限交集、hash、版本审计 | T PASSFACT→C；F CONFLICT→A；U SOURCEUNAVAILABLE→A |。仅做原文所列事实、冲突、例外及来源状态检查；未核校规/权限必须提示人工确认，禁止自动正式批准、拒绝或远端写回。",
    "execution": "semantic",
    "targetScope": "case"
  },
  {
    "id": "R026",
    "title": "邻项决定消费且不重复裁断；C05/C07 T上游签发且对象匹配，F冒用另一事项，U上游离线",
    "requirement": "| R026 | 邻项决定消费且不重复裁断；C05/C07 T上游签发且对象匹配，F冒用另一事项，U上游离线 | F004,F006,F007,F021 / M016,M017 / SRC-001,SRC-002,SRC-005；decision type/subject/version 校验 | T PASSFACT→C；F NOTAPPLICABLE 转专模板；U SOURCEUNAVAILABLE→A |。仅做原文所列事实、冲突、例外及来源状态检查；未核校规/权限必须提示人工确认，禁止自动正式批准、拒绝或远端写回。",
    "execution": "semantic",
    "targetScope": "case"
  },
  {
    "id": "R027",
    "title": "历史快照与重审影响集一致；版本变更后 T规则依赖均重算，F用旧 observation，U provenance 缺失",
    "requirement": "| R027 | 历史快照与重审影响集一致；版本变更后 T规则依赖均重算，F用旧 observation，U provenance 缺失 | F008,F027,F029,F032 / M003,M014,M021 / SRC-001,SRC-010；按依赖图使旧 verdict 失效 | T PASSFACT→C；F CONFLICT→A 并回滚展示；U SOURCEUNAVAILABLE→A |。仅做原文所列事实、冲突、例外及来源状态检查；未核校规/权限必须提示人工确认，禁止自动正式批准、拒绝或远端写回。",
    "execution": "semantic",
    "targetScope": "case"
  }
]}],
  policyVersionIds:[],
  stages:[
    {id:'intake',name:'登记与证据归类',kind:'auto-check',executorRole:'system',nextStageId:'fact-review',workflowOwner:'local'},
    {id:'fact-review',name:'证据与规则逐项核对',kind:'manual-review',executorRole:'reviewer',nextStageId:'human-decision',workflowOwner:'local'},
    {id:'human-decision',name:'政策、权限与最终结论人工确认',kind:'manual-review',executorRole:'teacher',workflowOwner:'local'},
  ],
  outputs:[
    {id:'r02-issue-feedback',kind:'item-feedback',audience:'reviewer'},
    {id:'r02-needed-materials',kind:'supplement-list',audience:'reviewer'},
  ],
  autoPassPolicy:{enabled:false},status:'draft',createdAt:'2026-10-24T00:00:00.000Z',
}

/** Research provenance only; never manufacture PolicyVersion or signed SourceRef. */
export const r02Metadata = {
  "templateId": "S08-T02",
  "name": "研究生个人培养计划变更和课程安排审核",
  "sourceDocumentPath": "docs/design/review-agent/business-templates/R02/S08-T02.md",
  "sourceDocumentSha256": "d4aa472bcb8dc050a8f340ae424a8ea6185f58b1eaab5538582ed10ab5289e4f",
  "originalSourceDocumentPath": "ChatGPT Library: S08-T02_正式业务模板_MD_v1.0.md",
  "originalSourceSha256": "d4aa472bcb8dc050a8f340ae424a8ea6185f58b1eaab5538582ed10ab5289e4f",
  "manifestSha256": null,
  "manifestHashCheck": false,
  "officialSchoolTemplate": false,
  "researchDate": "2026-10-24",
  "policyEvidenceStatus": "PARTIAL",
  "sourceEvidence": [
    {
      "srcId": "SRC-001",
      "evidenceStatus": "PARTIAL",
      "title": "SRC-001：参见同 ID 研究稿第 04 节，来源有效性及适用批次需逐条复核"
    },
    {
      "srcId": "SRC-002",
      "evidenceStatus": "PARTIAL",
      "title": "SRC-002：参见同 ID 研究稿第 04 节，来源有效性及适用批次需逐条复核"
    },
    {
      "srcId": "SRC-003",
      "evidenceStatus": "PARTIAL",
      "title": "SRC-003：参见同 ID 研究稿第 04 节，来源有效性及适用批次需逐条复核"
    },
    {
      "srcId": "SRC-004",
      "evidenceStatus": "PARTIAL",
      "title": "SRC-004：参见同 ID 研究稿第 04 节，来源有效性及适用批次需逐条复核"
    },
    {
      "srcId": "SRC-005",
      "evidenceStatus": "PARTIAL",
      "title": "SRC-005：参见同 ID 研究稿第 04 节，来源有效性及适用批次需逐条复核"
    },
    {
      "srcId": "SRC-006",
      "evidenceStatus": "PARTIAL",
      "title": "SRC-006：参见同 ID 研究稿第 04 节，来源有效性及适用批次需逐条复核"
    },
    {
      "srcId": "SRC-007",
      "evidenceStatus": "PARTIAL",
      "title": "SRC-007：参见同 ID 研究稿第 04 节，来源有效性及适用批次需逐条复核"
    },
    {
      "srcId": "SRC-008",
      "evidenceStatus": "PARTIAL",
      "title": "SRC-008：参见同 ID 研究稿第 04 节，来源有效性及适用批次需逐条复核"
    },
    {
      "srcId": "SRC-009",
      "evidenceStatus": "PARTIAL",
      "title": "SRC-009：参见同 ID 研究稿第 04 节，来源有效性及适用批次需逐条复核"
    },
    {
      "srcId": "SRC-010",
      "evidenceStatus": "PARTIAL",
      "title": "SRC-010：参见同 ID 研究稿第 04 节，来源有效性及适用批次需逐条复核"
    },
    {
      "srcId": "SRC-011",
      "evidenceStatus": "PARTIAL",
      "title": "SRC-011：参见同 ID 研究稿第 04 节，来源有效性及适用批次需逐条复核"
    },
    {
      "srcId": "SRC-012",
      "evidenceStatus": "PARTIAL",
      "title": "SRC-012：参见同 ID 研究稿第 04 节，来源有效性及适用批次需逐条复核"
    },
    {
      "srcId": "SRC-013",
      "evidenceStatus": "PARTIAL",
      "title": "SRC-013：参见同 ID 研究稿第 04 节，来源有效性及适用批次需逐条复核"
    },
    {
      "srcId": "SRC-014",
      "evidenceStatus": "PARTIAL",
      "title": "SRC-014：参见同 ID 研究稿第 04 节，来源有效性及适用批次需逐条复核"
    },
    {
      "srcId": "SRC-015",
      "evidenceStatus": "PARTIAL",
      "title": "SRC-015：参见同 ID 研究稿第 04 节，来源有效性及适用批次需逐条复核"
    }
  ],
  "criteria": [
    {
      "sectionId": "r02-fact-review",
      "criterionId": "R001",
      "srcIds": [
        "SRC-001",
        "SRC-010"
      ],
      "fieldIds": [
        "F002",
        "F003",
        "F030"
      ],
      "materialSlotIds": [
        "M001",
        "M021"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "r02-fact-review",
      "criterionId": "R002",
      "srcIds": [
        "SRC-003",
        "SRC-015"
      ],
      "fieldIds": [
        "F004",
        "F005",
        "F006",
        "F011"
      ],
      "materialSlotIds": [
        "M001",
        "M016",
        "M020"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "r02-fact-review",
      "criterionId": "R003",
      "srcIds": [
        "SRC-003",
        "SRC-004"
      ],
      "fieldIds": [
        "F008",
        "F012"
      ],
      "materialSlotIds": [
        "M003"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "r02-fact-review",
      "criterionId": "R004",
      "srcIds": [
        "SRC-003",
        "SRC-006"
      ],
      "fieldIds": [
        "F004",
        "F005",
        "F009",
        "F018"
      ],
      "materialSlotIds": [
        "M001",
        "M004"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "r02-fact-review",
      "criterionId": "R005",
      "srcIds": [
        "SRC-003",
        "SRC-004"
      ],
      "fieldIds": [
        "F010",
        "F011",
        "F012",
        "F013"
      ],
      "materialSlotIds": [
        "M002",
        "M003",
        "M005"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "r02-fact-review",
      "criterionId": "R006",
      "srcIds": [
        "SRC-001",
        "SRC-003",
        "SRC-012"
      ],
      "fieldIds": [
        "F008",
        "F010",
        "F012",
        "F013",
        "F031"
      ],
      "materialSlotIds": [
        "M002",
        "M015"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "r02-fact-review",
      "criterionId": "R007",
      "srcIds": [
        "SRC-003",
        "SRC-006"
      ],
      "fieldIds": [
        "F013",
        "F014"
      ],
      "materialSlotIds": [
        "M002",
        "M006"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "r02-fact-review",
      "criterionId": "R008",
      "srcIds": [
        "SRC-003",
        "SRC-004",
        "SRC-006"
      ],
      "fieldIds": [
        "F009",
        "F013",
        "F018"
      ],
      "materialSlotIds": [
        "M004",
        "M006"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "r02-fact-review",
      "criterionId": "R009",
      "srcIds": [
        "SRC-004",
        "SRC-006"
      ],
      "fieldIds": [
        "F009",
        "F013",
        "F018",
        "F020"
      ],
      "materialSlotIds": [
        "M004",
        "M006"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "r02-fact-review",
      "criterionId": "R010",
      "srcIds": [
        "SRC-003",
        "SRC-010",
        "SRC-014"
      ],
      "fieldIds": [
        "F016",
        "F018",
        "F019",
        "F020"
      ],
      "materialSlotIds": [
        "M004",
        "M007"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "r02-fact-review",
      "criterionId": "R011",
      "srcIds": [
        "SRC-010",
        "SRC-014"
      ],
      "fieldIds": [
        "F016",
        "F019",
        "F020"
      ],
      "materialSlotIds": [
        "M007"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "r02-fact-review",
      "criterionId": "R012",
      "srcIds": [
        "SRC-007",
        "SRC-012",
        "SRC-013"
      ],
      "fieldIds": [
        "F013",
        "F014",
        "F015",
        "F031"
      ],
      "materialSlotIds": [
        "M006",
        "M008"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "r02-fact-review",
      "criterionId": "R013",
      "srcIds": [
        "SRC-003",
        "SRC-007"
      ],
      "fieldIds": [
        "F006",
        "F011",
        "F015"
      ],
      "materialSlotIds": [
        "M005",
        "M008",
        "M020"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "r02-fact-review",
      "criterionId": "R014",
      "srcIds": [
        "SRC-003",
        "SRC-012",
        "SRC-013"
      ],
      "fieldIds": [
        "F013",
        "F016",
        "F017"
      ],
      "materialSlotIds": [
        "M007",
        "M009"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "r02-fact-review",
      "criterionId": "R015",
      "srcIds": [
        "SRC-003",
        "SRC-012"
      ],
      "fieldIds": [
        "F013",
        "F014",
        "F022",
        "F023"
      ],
      "materialSlotIds": [
        "M010",
        "M011",
        "M012",
        "M013"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "r02-fact-review",
      "criterionId": "R016",
      "srcIds": [
        "SRC-003",
        "SRC-010",
        "SRC-012"
      ],
      "fieldIds": [
        "F016",
        "F017",
        "F019",
        "F023"
      ],
      "materialSlotIds": [
        "M007",
        "M009",
        "M010"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "r02-fact-review",
      "criterionId": "R017",
      "srcIds": [
        "SRC-005",
        "SRC-011"
      ],
      "fieldIds": [
        "F021",
        "F027"
      ],
      "materialSlotIds": [
        "M014",
        "M017"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "r02-fact-review",
      "criterionId": "R018",
      "srcIds": [
        "SRC-003"
      ],
      "fieldIds": [
        "F007",
        "F024"
      ],
      "materialSlotIds": [
        "M011"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "r02-fact-review",
      "criterionId": "R019",
      "srcIds": [
        "SRC-003"
      ],
      "fieldIds": [
        "F025"
      ],
      "materialSlotIds": [
        "M012"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "r02-fact-review",
      "criterionId": "R020",
      "srcIds": [
        "SRC-003",
        "SRC-010"
      ],
      "fieldIds": [
        "F026"
      ],
      "materialSlotIds": [
        "M013"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "r02-fact-review",
      "criterionId": "R021",
      "srcIds": [
        "SRC-003"
      ],
      "fieldIds": [
        "F008",
        "F026",
        "F027"
      ],
      "materialSlotIds": [
        "M003",
        "M013",
        "M014"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "r02-fact-review",
      "criterionId": "R022",
      "srcIds": [
        "SRC-001",
        "SRC-003"
      ],
      "fieldIds": [
        "F008",
        "F012",
        "F013",
        "F031"
      ],
      "materialSlotIds": [
        "M003",
        "M015"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "r02-fact-review",
      "criterionId": "R023",
      "srcIds": [
        "SRC-003",
        "SRC-010"
      ],
      "fieldIds": [
        "F002",
        "F026",
        "F028",
        "F032"
      ],
      "materialSlotIds": [
        "M013",
        "M018"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "r02-fact-review",
      "criterionId": "R024",
      "srcIds": [
        "SRC-005",
        "SRC-010"
      ],
      "fieldIds": [
        "F026",
        "F028",
        "F032"
      ],
      "materialSlotIds": [
        "M013",
        "M019"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "r02-fact-review",
      "criterionId": "R025",
      "srcIds": [
        "SRC-001",
        "SRC-010"
      ],
      "fieldIds": [
        "F001",
        "F002",
        "F003",
        "F029",
        "F030",
        "F032"
      ],
      "materialSlotIds": [
        "M001",
        "M021"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "r02-fact-review",
      "criterionId": "R026",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-005"
      ],
      "fieldIds": [
        "F004",
        "F006",
        "F007",
        "F021"
      ],
      "materialSlotIds": [
        "M016",
        "M017"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "r02-fact-review",
      "criterionId": "R027",
      "srcIds": [
        "SRC-001",
        "SRC-010"
      ],
      "fieldIds": [
        "F008",
        "F027",
        "F029",
        "F032"
      ],
      "materialSlotIds": [
        "M003",
        "M014",
        "M021"
      ],
      "evidenceStatus": "PARTIAL"
    }
  ]
} as const
export const templateValidationIssues = validateTemplate(templateVersion)
