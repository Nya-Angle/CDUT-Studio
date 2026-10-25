import type { TemplateVersion } from '@profer/shared'

export type R02EvidenceStatus = 'VERIFIED' | 'PARTIAL' | 'UNCONFIRMED'
export interface R02SourceMetadata { id: string; title: string; url?: string; sourceKind: string; evidenceStatus: R02EvidenceStatus; note: string }
export interface R02CriterionMetadata { sectionId: string; criterionId: string; ruleId: string; sourceIds: string[]; evidenceStatus: R02EvidenceStatus; execution: 'semantic' | 'manual' }
export interface R02TemplateMetadata { batchId: string; templateId: string; name: string; officialSchoolTemplate: false; researchStatus: string; policyEvidenceStatus: R02EvidenceStatus; researchAsOf: string; sourceSnapshot: string; sourceDocumentPath: string; sourceDocumentSha256: string; sourceDocumentBytes: number; originalSourcePath: string; originalSourceBlobSha1: string; lineEndingNormalization: string; sources: R02SourceMetadata[]; criteria: R02CriterionMetadata[]; reviewNotes: string[] }

export const templateVersion: TemplateVersion = {
  "templateId": "S04-T04",
  "version": 1,
  "schemaVersion": 2,
  "name": "假期留宿与临时住宿申请审核",
  "description": "本地研究模板 · 非校方正式模板。假期留宿与临时住宿申请审核；仅核验事实、材料与分阶段流程，不产生学校正式批准/拒绝。政策证据状态：PARTIAL。",
  "catalogKind": "builtin",
  "sourceNote": "R02_RESEARCH_TEMPLATE_NONOFFICIAL: 本模板由 R02 研究原稿映射而来，非校方正式模板；SRC 为研究来源索引而非案卷 SourceRef；校规现行性、校区/学段范围、审批授权和办理系统未全部确认。正式决定必须由经学校确认的有权人员在真实校方流程中作出，本地 Agent 不得生成学校远端回写。",
  "objectType": "person",
  "displayName": {
    "template": "假期留宿与临时住宿申请审核（本地案卷）"
  },
  "fields": [
    {
      "key": "F001",
      "label": "F001 · 案卷唯一 ID（str；A）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原始字段字典：F001 案卷唯一 ID（str；A）；P1 起；系统内可信建案事务，关联 M002；设计字段；P1；无 ID 不提交/关联决定，技术待办；不得以文件名冒充。缺失是否构成补件须按当前阶段与已确认政策人工核验。"
    },
    {
      "key": "F002",
      "label": "F002 · 校方学生主体 ID（ref；I）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原始字段字典：F002 校方学生主体 ID（ref；I）；P1/P2；学校身份/学籍记录 M003；SRC-001 的“在校学生”范围；P2；SU→HD，不得仅凭手填学号赋予学生权限。缺失是否构成补件须按当前阶段与已确认政策人工核验。"
    },
    {
      "key": "F003",
      "label": "F003 · 法定/登记姓名（str；I）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原始字段字典：F003 法定/登记姓名（str；I）；P1/P2；M003 学籍姓名与 M002 申请书姓名并核；SRC-001；P2；校方记录缺 SU；申请书缺 NM；不一致 CONFLICT。缺失是否构成补件须按当前阶段与已确认政策人工核验。"
    },
    {
      "key": "F004",
      "label": "F004 · 学号或校方登记号（str；I）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原始字段字典：F004 学号或校方登记号（str；I）；P1/P2；M003 正式记录，与 M002 标识对照；SRC-001；P2；SU/NM/CONFLICT 按来源，显示时脱敏。缺失是否构成补件须按当前阶段与已确认政策人工核验。"
    },
    {
      "key": "F005",
      "label": "F005 · 学生类别/学段（enum；I）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原始字段字典：F005 学生类别/学段（enum；I）；P1/P2；M003 在校学段；SRC-001 本科/专科/研究生，SRC-006 国际学生差异线索；P2；SU→HD，不自造国际学生适用规则。缺失是否构成补件须按当前阶段与已确认政策人工核验。"
    },
    {
      "key": "F006",
      "label": "F006 · 有效在校/学籍状态（enum；I）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原始字段字典：F006 有效在校/学籍状态（enum；I）；P2；M003 学籍权威状态；SRC-001 “在校学生”；学籍业务决定只引用；P2；SU→HD，不由本模板判学籍存续。缺失是否构成补件须按当前阶段与已确认政策人工核验。"
    },
    {
      "key": "F007",
      "label": "F007 · 当期归属学院（str/ref；I）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原始字段字典：F007 当期归属学院（str/ref；I）；P1/P2/P3；M003 组织关系；M005 审批学院应一致；SRC-001；P2；SU/CONFLICT→HD；跨学院须有权更正。缺失是否构成补件须按当前阶段与已确认政策人工核验。"
    },
    {
      "key": "F008",
      "label": "F008 · 实际申请校区（enum；A/I）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原始字段字典：F008 实际申请校区（enum；A/I）；P0/P1；M002 声明、M003 校区权威事实及 M001 适用范围；SRC-001/007；P2；PC/CONFLICT→HD，成都与宜宾不混用。缺失是否构成补件须按当前阶段与已确认政策人工核验。"
    },
    {
      "key": "F009",
      "label": "F009 · 原宿舍/既有住宿状态（object；I）",
      "kind": "object",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原始字段字典：F009 原宿舍/既有住宿状态（object；I）；P2，P5；M015 学校宿舍权威记录；与 SRC-002 当期安排比对；P2；SU；不据此自动拒绝新留宿申请。缺失是否构成补件须按当前阶段与已确认政策人工核验。"
    },
    {
      "key": "F010",
      "label": "F010 · 假期类型（enum；P/A）",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "原始字段字典：F010 假期类型（enum；P/A）；P0/P1；M001 现行通知＋M002 申请；SRC-001/007；P1；短假不明 PC，不得默认适用寒暑假规则。缺失是否构成补件须按当前阶段与已确认政策人工核验。"
    },
    {
      "key": "F011",
      "label": "F011 · 假期批次/学年标识（str；P）",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原始字段字典：F011 假期批次/学年标识（str；P）；P0；M001 标题及发布主体、年度；SRC-002/003/008；P1；PC；禁止以系统日期自动推断批次。缺失是否构成补件须按当前阶段与已确认政策人工核验。"
    },
    {
      "key": "F012",
      "label": "F012 · 当期有效政策版本（ref；P）",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "原始字段字典：F012 当期有效政策版本（ref；P）；P0—P8；M001 正文来源 URL、发布/生效信息、校区范围与内容摘要；SRC-001/002/008；P0；SU 或 PC；不能执行动态阈值比较。缺失是否构成补件须按当前阶段与已确认政策人工核验。"
    },
    {
      "key": "F013",
      "label": "F013 · 本情形申请截止节点（datetime?；P）",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原始字段字典：F013 本情形申请截止节点（datetime?；P）；P0/P2；只能取 M001 当批次原文；SRC-001 仅说“通知规定时限”；P1；PC→HD；不使用历史 SRC-004 截止。缺失是否构成补件须按当前阶段与已确认政策人工核验。"
    },
    {
      "key": "F014",
      "label": "F014 · 办理情形标签（enum；A）",
      "kind": "enum",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "原始字段字典：F014 办理情形标签（enum；A）；P1 及变更时；根据 M002 陈述、M001 适用性判断为 H01—H08；§03；P1；冲突或无证据 HD，H08 不默认准入。缺失是否构成补件须按当前阶段与已确认政策人工核验。",
      "options": [
        {
          "value": "H01",
          "label": "H01"
        },
        {
          "value": "H02",
          "label": "H02"
        },
        {
          "value": "H03",
          "label": "H03"
        },
        {
          "value": "H04",
          "label": "H04"
        },
        {
          "value": "H05",
          "label": "H05"
        },
        {
          "value": "H06",
          "label": "H06"
        },
        {
          "value": "H07",
          "label": "H07"
        },
        {
          "value": "H08",
          "label": "H08"
        }
      ]
    },
    {
      "key": "F015",
      "label": "F015 · 拟住宿开始时间（datetime；A）",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原始字段字典：F015 拟住宿开始时间（datetime；A）；P1；M002 学生请求内容；表单实际栏名待取得；SRC-001；P2；未声明 NM，与通知不符 PC/HD。缺失是否构成补件须按当前阶段与已确认政策人工核验。"
    },
    {
      "key": "F016",
      "label": "F016 · 拟住宿结束时间（datetime；A）",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原始字段字典：F016 拟住宿结束时间（datetime；A）；P1；M002 学生请求内容；后续应与 M005/M006 对比；SRC-001；P2；未声明 NM；跨批次或结束早于开始 CONFLICT。缺失是否构成补件须按当前阶段与已确认政策人工核验。"
    },
    {
      "key": "F017",
      "label": "F017 · 申请理由类别（enum；A）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原始字段字典：F017 申请理由类别（enum；A）；P1/P2；M002 学生声明；SRC-001 教学/竞赛/其他特殊原因；P2；未说明 NM；分类以外 HD，不自动拒绝。缺失是否构成补件须按当前阶段与已确认政策人工核验。"
    },
    {
      "key": "F018",
      "label": "F018 · 申请事由说明（str；A）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原始字段字典：F018 申请事由说明（str；A）；P1/P2；M002 具体陈述及申请书页/段；SRC-001；P3；NM/UNREADABLE；只留必要摘要，特殊细节限制查看。缺失是否构成补件须按当前阶段与已确认政策人工核验。"
    },
    {
      "key": "F019",
      "label": "F019 · 事由权威核实引用（ref?；A）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原始字段字典：F019 事由权威核实引用（ref?；A）；P2 条件触发；M004 教学/竞赛/科研活动权威证明或主管部门结论；SRC-001 未列强制证明件；P2/P3；未被当期要求触发 NA；触发后 NM/SU/HD，不擅自设证明格式。缺失是否构成补件须按当前阶段与已确认政策人工核验。"
    },
    {
      "key": "F020",
      "label": "F020 · 申请有效接收时间（datetime；A）",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原始字段字典：F020 申请有效接收时间（datetime；A）；P1；有权受理端接收记录、纸件收讫时间或可信系统日志；M002；SRC-001；P1；SU→HD；不得用文件修改时间计算逾期。缺失是否构成补件须按当前阶段与已确认政策人工核验。"
    },
    {
      "key": "F021",
      "label": "F021 · 申请人/代理提交鉴别（ref；A）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原始字段字典：F021 申请人/代理提交鉴别（ref；A）；P1；学生可信登录/本人签名核实与 M002/M003；代办须另有 M016；P2；无真实鉴别 HD，不能从填写的角色名证明代理权。缺失是否构成补件须按当前阶段与已确认政策人工核验。"
    },
    {
      "key": "F022",
      "label": "F022 · 学院审核结论（enum；D）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原始字段字典：F022 学院审核结论（enum；D）；P3 后；M005 有权学院正式记录；SRC-001；P1；P1/P2 为 NA；P3 后缺 SU/NM→HD，不能自动判“驳回”。缺失是否构成补件须按当前阶段与已确认政策人工核验。"
    },
    {
      "key": "F023",
      "label": "F023 · 真实审核者/授权岗位（ref；D）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原始字段字典：F023 真实审核者/授权岗位（ref；D）；P3 后；M005 的校方可信签批会话/签名登记；SRC-001 只确认学院主体；P1；HD；无法验授权不接受“老师”自报角色。缺失是否构成补件须按当前阶段与已确认政策人工核验。"
    },
    {
      "key": "F024",
      "label": "F024 · 学院决定时间（datetime；D）",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原始字段字典：F024 学院决定时间（datetime；D）；P3 后；M005 可核验签批时间或归档接收时间；SRC-001；P1；不得由扫描照片 EXIF 填补；未知 HD。缺失是否构成补件须按当前阶段与已确认政策人工核验。"
    },
    {
      "key": "F025",
      "label": "F025 · 决定适用申请版本/时段（ref/object；D）",
      "kind": "object",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原始字段字典：F025 决定适用申请版本/时段（ref/object；D）；P3 后，变更时；M005 与 M002 的版本、主体、假期、时段绑定；SRC-001；P1；绑定不明 CONFLICT/HD；不得重放旧批准。缺失是否构成补件须按当前阶段与已确认政策人工核验。"
    },
    {
      "key": "F026",
      "label": "F026 · 学院汇总表对应行/批次（ref；D/X）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原始字段字典：F026 学院汇总表对应行/批次（ref；D/X）；P4 后，获批时；M006 签章纸质与电子汇总的学生对应行；SRC-001；P1；P1—P3 NA；应汇总而未汇总则 SU→HD。缺失是否构成补件须按当前阶段与已确认政策人工核验。"
    },
    {
      "key": "F027",
      "label": "F027 · 汇总签章/提交一致性（enum；D/X）",
      "kind": "enum",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原始字段字典：F027 汇总签章/提交一致性（enum；D/X）；P4 后；M006 学院签章原件与后勤收件回执；SRC-001；P1/P2；UNREADABLE/HD，电子名单与纸本不符 CONFLICT。缺失是否构成补件须按当前阶段与已确认政策人工核验。",
      "options": [
        {
          "value": "一致",
          "label": "一致"
        },
        {
          "value": "冲突",
          "label": "冲突"
        },
        {
          "value": "待核",
          "label": "待核"
        }
      ]
    },
    {
      "key": "F028",
      "label": "F028 · 集中住宿位置/有效时段（object；X）",
      "kind": "object",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原始字段字典：F028 集中住宿位置/有效时段（object；X）；P5 后；M007 学院/楼寓正式住宿安排；SRC-001/002/003；P2；P1—P4 NA；P5 后 SU→HD，不能凭旧寝室推断。缺失是否构成补件须按当前阶段与已确认政策人工核验。"
    },
    {
      "key": "F029",
      "label": "F029 · 临时返校协调记录（ref?；X）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原始字段字典：F029 临时返校协调记录（ref?；X）；H05 的 P5；M008 相关学院与楼寓/片区主管的可信联系落实记录；SRC-002；P1/P2；非 H05 NA；H05 若无可核记录 SU/HD。缺失是否构成补件须按当前阶段与已确认政策人工核验。"
    },
    {
      "key": "F030",
      "label": "F030 · 安全告知/承诺状态（enum?；X）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原始字段字典：F030 安全告知/承诺状态（enum?；X）；P5，依当期政策；M009 仅当现行批次或学院明确要求；SRC-001 安全注意、SRC-005 2024 学院实践；P2；未被要求 NA；被要求而缺 NM/HD，不推断全校强制。缺失是否构成补件须按当前阶段与已确认政策人工核验。"
    },
    {
      "key": "F031",
      "label": "F031 · 实际入住/离宿时段（object?；X）",
      "kind": "object",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原始字段字典：F031 实际入住/离宿时段（object?；X）；P6；M010 校方公寓登记/可信门禁记录；SRC-002 仅规定当期出入；P2；未入住 NA；记录失联 SU；绝不倒推批准。缺失是否构成补件须按当前阶段与已确认政策人工核验。"
    },
    {
      "key": "F032",
      "label": "F032 · 变更项目及申请新版本（object；V）",
      "kind": "object",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原始字段字典：F032 变更项目及申请新版本（object；V）；P7 触发；M011 请求与旧 M002/决定关联；本轮无专门校本流程；P2/P3；非变更 NA；变更详情缺 NM；影响正式决定 HD。缺失是否构成补件须按当前阶段与已确认政策人工核验。"
    },
    {
      "key": "F033",
      "label": "F033 · 撤回/取消请求与生效记录（object?；V）",
      "kind": "object",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原始字段字典：F033 撤回/取消请求与生效记录（object?；V）；P7 触发；M012 本人/有权主体请求及学院/后勤确认；待核授权；P2；非撤回 NA；仅有学生意愿不可写“已撤销”，标 HD。缺失是否构成补件须按当前阶段与已确认政策人工核验。"
    },
    {
      "key": "F034",
      "label": "F034 · 异议/复核申请与处理记录（object?；V）",
      "kind": "object",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原始字段字典：F034 异议/复核申请与处理记录（object?；V）；P8 触发；M013 学生提出异议、校方真实受理与复核记录；授权待核；P3；非复核 NA；无授权复核者 HD。缺失是否构成补件须按当前阶段与已确认政策人工核验。"
    },
    {
      "key": "F035",
      "label": "F035 · 前次有效决定/撤销链（ref?；V）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原始字段字典：F035 前次有效决定/撤销链（ref?；V）；P7/P8；M014 校方决定簿、原案卷版本与合法撤销记录；P1/P2；首办 NA；续办/复核缺 SU→HD，禁止复制旧批准。缺失是否构成补件须按当前阶段与已确认政策人工核验。"
    },
    {
      "key": "F036",
      "label": "F036 · 证据归属/版本指纹链（object；V）",
      "kind": "object",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原始字段字典：F036 证据归属/版本指纹链（object；V）；所有阶段；M001—M016 各件所属案、提交/签发者、时间、哈希/版本及替换链；系统可信元数据；P1/P2；无法关联主体或版本 CONFLICT/HD，不能混案复用。缺失是否构成补件须按当前阶段与已确认政策人工核验。"
    }
  ],
  "materialSlots": [
    {
      "id": "M001",
      "name": "M001 · 当期假期留宿政策与开放通知；学校/后勤或对应校区，学校公告正文/受控政策快照",
      "purpose": "来源模板材料槽：M001 当期假期留宿政策与开放通知；学校/后勤或对应校区，学校公告正文/受控政策快照；P0 当前必需；不由学生上传；经校方确认的同期正式转发或原文归档；不能以 2025/2026 已结束批次替代新批次；F008、F010—F013、F036；SRC-001/002/003/008；绑定校区、学段、年度假期、发布日期及出处；失联 SU，效力不明 PC；不可读 UNREADABLE，转校方维护。policyEvidenceStatus=PARTIAL；minCount=0 用于防止未经确认的缺件自动阻断，是否需要该材料由对应 criterion 在正确阶段人工核验。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "submission",
      "maxCount": 9007199254740991,
      "requiredElements": [
        "F008",
        "F010",
        "F013",
        "F036"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M002",
      "name": "M002 · 学生假期留校住宿申请表；学生本人，纸质书面原件/学校确认的等效线上正式申请",
      "purpose": "来源模板材料槽：M002 学生假期留校住宿申请表；学生本人，纸质书面原件/学校确认的等效线上正式申请；P1 当前必需（常规寒暑假）；H05 紧急情形表式另核；仅在学校确认电子版或校方既有正式申请记录等效时替代；历史 SRC-004 表格不自动有效；F003/004、F010、F014—F018、F020/021、F036；SRC-001/004；一人、一假期批次、一时间范围对应一版；缺 NM、字迹不可读 UNREADABLE、身份不符 CONFLICT。policyEvidenceStatus=PARTIAL；minCount=0 用于防止未经确认的缺件自动阻断，是否需要该材料由对应 criterion 在正确阶段人工核验。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "submission",
      "maxCount": 9007199254740991,
      "requiredElements": [
        "F003",
        "F010",
        "F014",
        "F018",
        "F020",
        "F036"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M003",
      "name": "M003 · 学生身份与在校状态权威快照；校方学籍/身份管理单位，受控查询结果或盖章确认",
      "purpose": "来源模板材料槽：M003 学生身份与在校状态权威快照；校方学籍/身份管理单位，受控查询结果或盖章确认；P1/P2 当前必需事实，由校方取得，非学生上传件；校方确认的有效在校证明可替代未接通的系统记录；学生卡照片或自填学号本身不足；F002—F008、F021、F036；SRC-001/006；绑定主体、查询时间、学籍生效期；访问失联 SU→HD，版本陈旧 CONFLICT/HD。policyEvidenceStatus=PARTIAL；minCount=0 用于防止未经确认的缺件自动阻断，是否需要该材料由对应 criterion 在正确阶段人工核验。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "submission",
      "maxCount": 9007199254740991,
      "requiredElements": [
        "F002",
        "F008",
        "F021",
        "F036"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M004",
      "name": "M004 · 留宿事由证明/权威结论；授课、竞赛、科研活动主管部门或学生持有其正式凭证",
      "purpose": "来源模板材料槽：M004 留宿事由证明/权威结论；授课、竞赛、科研活动主管部门或学生持有其正式凭证；P2 条件必需：当本批次通知/学院依法合规要求时；有权单位业务决定编号与可核查记录可替代上传证明；个人说明 M002 不自动等于官方活动批准；F017—F019、F036；SRC-001（仅事由类别）；绑定活动、时间及学生；不要求时 NA；被要求但缺 NM/SU，模糊 UNREADABLE；必要性由学院人审。policyEvidenceStatus=PARTIAL；minCount=0 用于防止未经确认的缺件自动阻断，是否需要该材料由对应 criterion 在正确阶段人工核验。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "submission",
      "maxCount": 9007199254740991,
      "requiredElements": [
        "F017",
        "F019",
        "F036"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M005",
      "name": "M005 · 学院正式审核意见/决定记录；学院有权签批岗位，可信审批记录/原始签章文书",
      "purpose": "来源模板材料槽：M005 学院正式审核意见/决定记录；学院有权签批岗位，可信审批记录/原始签章文书；P3 后续才产生，无论准否均保留；经学院验证的正式电子决定可替代纸质签章；OCR 抓到公章不等于鉴真；F007、F022—F025、F035、F036；SRC-001；与 M002 主体、假期、时段、版本绑定；未到 P3 NA；P3 无可核决定 SU/HD，模糊 UNREADABLE。policyEvidenceStatus=PARTIAL；minCount=0 用于防止未经确认的缺件自动阻断，是否需要该材料由对应 criterion 在正确阶段人工核验。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      "maxCount": 9007199254740991,
      "requiredElements": [
        "F007",
        "F022",
        "F025",
        "F035",
        "F036"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M006",
      "name": "M006 · 学院留校住宿申请汇总表；学院、签章纸质与电子汇总，后勤接收",
      "purpose": "来源模板材料槽：M006 学院留校住宿申请汇总表；学院、签章纸质与电子汇总，后勤接收；P4 后续才产生，对于已获准并需上报的学生；非初始必交；经学院和楼寓共同承认的可靠电子台账可作为替代；单纯 Excel 无签章/可信提交记录不能冒充；F003/004、F007、F015/016、F026/027、F036；SRC-001；每行绑定案卷、学生、批次、学院与签批版；未到 P4 NA；该报未报 SU/HD，纸电冲突 CONFLICT。policyEvidenceStatus=PARTIAL；minCount=0 用于防止未经确认的缺件自动阻断，是否需要该材料由对应 criterion 在正确阶段人工核验。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      "maxCount": 9007199254740991,
      "requiredElements": [
        "F003",
        "F007",
        "F015",
        "F026",
        "F036"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M007",
      "name": "M007 · 当批次集中住宿安置记录；学院或楼寓，可信分配通知/楼栋清单",
      "purpose": "来源模板材料槽：M007 当批次集中住宿安置记录；学院或楼寓，可信分配通知/楼栋清单；P5 后续才产生；可信公寓系统在本批次的分配结果可替代纸质通知；旧寝室信息不得替代新分配；F009、F028、F036；SRC-001/002/003；绑定批次、楼栋、床位与生效时段；未安排 NA，无记录 SU/HD，重叠分配 CONFLICT。policyEvidenceStatus=PARTIAL；minCount=0 用于防止未经确认的缺件自动阻断，是否需要该材料由对应 criterion 在正确阶段人工核验。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      "maxCount": 9007199254740991,
      "requiredElements": [
        "F009",
        "F028",
        "F036"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M008",
      "name": "M008 · 临时返校住宿协调落实凭证；相关学院和楼寓/片区主管，可信联系单/收件记录",
      "purpose": "来源模板材料槽：M008 临时返校住宿协调落实凭证；相关学院和楼寓/片区主管，可信联系单/收件记录；H05 的 P5 条件必需、后续才产生；具体凭证形态尚待校方核实；有权单位保存的电话办理登记/公寓正式落实记录在校方认可时可替代；学生微信截图不能自动替代；F014、F029、F036；SRC-002；同次返校起止及学院/后勤双方关联；H05 以外 NA；缺 SU/HD，来源不明 CONFLICT。policyEvidenceStatus=PARTIAL；minCount=0 用于防止未经确认的缺件自动阻断，是否需要该材料由对应 criterion 在正确阶段人工核验。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      "maxCount": 9007199254740991,
      "requiredElements": [
        "F014",
        "F029",
        "F036"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M009",
      "name": "M009 · 假期安全告知或承诺记录；学院/学生，签收回执或安全责任承诺书",
      "purpose": "来源模板材料槽：M009 假期安全告知或承诺记录；学院/学生，签收回执或安全责任承诺书；P5 条件必需：当期政策或具体学院要求时，不一概初始必交；经院方确认的线上安全告知确认可等效；SRC-005 的 2024 承诺书不自动适用于各院；F030、F036；SRC-001/005/007；绑定本批次、学生、承诺版本；无要求 NA；有要求缺 NM/HD，签署不可读 UNREADABLE。policyEvidenceStatus=PARTIAL；minCount=0 用于防止未经确认的缺件自动阻断，是否需要该材料由对应 criterion 在正确阶段人工核验。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      "maxCount": 9007199254740991,
      "requiredElements": [
        "F030",
        "F036"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M010",
      "name": "M010 · 公寓实际入住、离开与门禁记录；楼寓/宿管，权威登记或系统日志",
      "purpose": "来源模板材料槽：M010 公寓实际入住、离开与门禁记录；楼寓/宿管，权威登记或系统日志；P6 后续才产生，仅存在实际住宿时；宿管签认的入住/离宿台账可替代系统日志；门禁放行不替代审批；F031、F036；SRC-002；绑定房间与实际时刻；未入住 NA，校方接口失败 SU，与安置冲突 CONFLICT。policyEvidenceStatus=PARTIAL；minCount=0 用于防止未经确认的缺件自动阻断，是否需要该材料由对应 criterion 在正确阶段人工核验。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      "maxCount": 9007199254740991,
      "requiredElements": [
        "F031",
        "F036"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M011",
      "name": "M011 · 变更/缩期/续期请求；原申请人或有权代理，变更书面申请及重新核验资料",
      "purpose": "来源模板材料槽：M011 变更/缩期/续期请求；原申请人或有权代理，变更书面申请及重新核验资料；P7 条件必需，因实际申请变更才产生；学校确认的正式变更受理记录可替代纸件；旧 M002 不能覆盖新日期；F015—F019、F032、F035/036；SRC-001（原流程）、变更规定未见；新旧版本、申请主体、受理时间一一对应；未触发 NA，已提出但材料缺 NM，生效权属 HD。policyEvidenceStatus=PARTIAL；minCount=0 用于防止未经确认的缺件自动阻断，是否需要该材料由对应 criterion 在正确阶段人工核验。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      "maxCount": 9007199254740991,
      "requiredElements": [
        "F015",
        "F019",
        "F032",
        "F035"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M012",
      "name": "M012 · 撤回或取消申请记录；学生、学院或有权代理，申请/受理/正式取消记录",
      "purpose": "来源模板材料槽：M012 撤回或取消申请记录；学生、学院或有权代理，申请/受理/正式取消记录；P7 条件必需；撤回程序未证实；可信校方撤回受理/决定记录可替代上传声明；“我不住了”只表意向，不是已取消决定；F033、F035/036；SRC-001，专项撤回规则缺；绑定原案及有效决定和执行变动；未触发 NA；无授权生效记录 HD/SU。policyEvidenceStatus=PARTIAL；minCount=0 用于防止未经确认的缺件自动阻断，是否需要该材料由对应 criterion 在正确阶段人工核验。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      "maxCount": 9007199254740991,
      "requiredElements": [
        "F033",
        "F035"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M013",
      "name": "M013 · 异议、复核申请及校方结果；学生与有权复核机构，书面申请/真实受理/决定",
      "purpose": "来源模板材料槽：M013 异议、复核申请及校方结果；学生与有权复核机构，书面申请/真实受理/决定；P8 条件必需，仅提异议后产生；校方正式复核系统记录可替代纸件；AI 审核意见无决定效力；F034—F036；本事项校本复核规则未见；单独保留原决定、复核申请、复核结果及时间；非复核 NA；缺正式结果 HD，不可读 UNREADABLE。policyEvidenceStatus=PARTIAL；minCount=0 用于防止未经确认的缺件自动阻断，是否需要该材料由对应 criterion 在正确阶段人工核验。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      "maxCount": 9007199254740991,
      "requiredElements": [
        "F034",
        "F036"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M014",
      "name": "M014 · 既往申请版本与原正式决定链；校方案卷/学院归档，可信历史记录",
      "purpose": "来源模板材料槽：M014 既往申请版本与原正式决定链；校方案卷/学院归档，可信历史记录；P7/P8 条件必需，变更、撤回、复核或复用旧案时；经有权部门核实的旧纸档原件；不能复用任意旧 Run@rev 伪造新决定；F025、F032—F036；SRC-001，版本留痕为设计要求；用原案 ID、版本、签批时点、适用范围关联；首办 NA，旧案失联 SU/HD。policyEvidenceStatus=PARTIAL；minCount=0 用于防止未经确认的缺件自动阻断，是否需要该材料由对应 criterion 在正确阶段人工核验。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      "maxCount": 9007199254740991,
      "requiredElements": [
        "F025",
        "F032",
        "F036"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M015",
      "name": "M015 · 现有宿舍分配与住宿状态记录；楼寓/校方宿管，可信入住资格或原床位分配记录",
      "purpose": "来源模板材料槽：M015 现有宿舍分配与住宿状态记录；楼寓/校方宿管，可信入住资格或原床位分配记录；P2 条件核验、P5 必要执行背景；不要求学生上传；S04-T03 已获权威调寝决定可直接引用结果与版本；未经验证的寝室照片不等效；F009、F028、F036；SRC-001 同页其他住宿事项、SRC-002；绑定当前主体、校区、有效期；失联 SU；原宿舍与当前集中安排不一致不必然冲突（分时比较）。policyEvidenceStatus=PARTIAL；minCount=0 用于防止未经确认的缺件自动阻断，是否需要该材料由对应 criterion 在正确阶段人工核验。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      "maxCount": 9007199254740991,
      "requiredElements": [
        "F009",
        "F028",
        "F036"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M016",
      "name": "M016 · 代理办理资格/授权凭证；学生本人及学校确认的代理机构，可信授权记录",
      "purpose": "来源模板材料槽：M016 代理办理资格/授权凭证；学生本人及学校确认的代理机构，可信授权记录；P1 条件必需，仅非本人提交/学院代办时；校本允许范围未知；学校既有可信代办授权台账可替代重复上传；口头代办或自报“辅导员”无效；F002、F007、F021、F036；SRC-001 仅明确本人提交；代理人与被代理人、权限、期限、目标事项绑定；非代理 NA；无法验权 HD，不得直接通过。policyEvidenceStatus=PARTIAL；minCount=0 用于防止未经确认的缺件自动阻断，是否需要该材料由对应 criterion 在正确阶段人工核验。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "submission",
      "maxCount": 9007199254740991,
      "requiredElements": [
        "F002",
        "F007",
        "F021",
        "F036"
      ],
      "allowReuseAcrossSubjects": false
    }
  ],
  "sections": [
    {
      "id": "rules-08-2",
      "name": "08.2 逐条独立事实核验规则",
      "description": "映射自原始研究模板第08节；仅供事实核验与人工复核，不代表校方授权。",
      "order": 1,
      "required": true,
      "criteria": [
        {
          "id": "r001",
          "title": "事项路由",
          "requirement": "原始规则 R001（第08节）：T=校内寒暑假留宿或可核 H03—H05；F=确属外住/日常调寝→NA；U=短假/特殊住宿→PC；SRC-001/004/007；F008/F010/F014—F016；M001/M002。比校区、住校目的及假期类别，历史仅作线索；可确认属于本事项→PASSFACT（学院）；特殊办理类别→NEEDSHUMANDECISION（学院/后勤），不自动否决。仅输出可追溯事实、补件建议或待人工复核；不得自动形成学校正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r002",
          "title": "当批政策有效性",
          "requirement": "原始规则 R002（第08节）：T=启动具体批次核验；F=仅空白草稿→NA；U=批次不明→PC；SRC-001/002/003/008；F008/F010—F013/F036；M001。核公告原文、发布主体、适用校区/学段、假期年度及版本，旧批次不得外推；有适用正文→PASSFACT；仅旧通知→POLICYUNCONFIRMED；官网原文失联→SOURCEUNAVAILABLE（政策维护/后勤）；同批次冲突→CONFLICT。仅输出可追溯事实、补件建议或待人工复核；不得自动形成学校正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r003",
          "title": "受理时间与截止",
          "requirement": "原始规则 R003（第08节）：T=已有可信收件时刻且当期明示截止；F=未提交→NA；U=截止未证→PC；SRC-001（仅“按通知时限”）；F011—F013/F020；M001/M002。比正式收讫/受理日志与当批次截止，不能用文件修改时间；窗口内→PASSFACT；超时/例外→NEEDSHUMANDECISION（学院），不可自动拒；收件源缺→SOURCEUNAVAILABLE（受理人）。仅输出可追溯事实、补件建议或待人工复核；不得自动形成学校正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r004",
          "title": "本人身份一致",
          "requirement": "原始规则 R004（第08节）：T=有具体申请/变更/异议主体；F=未建案→NA；U=学校身份源失联→SU；SRC-001；F001—F004/F021/F036；M002/M003，必要时 M011—M014。校方稳定 ID、姓名和学号映射对照；曾用名须有权证实；一致→PASSFACT；异人/错号→CONFLICT（学籍部门）；扫描不可读→UNREADABLE（持有人）；不得靠 OCR 认身份。仅输出可追溯事实、补件建议或待人工复核；不得自动形成学校正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r005",
          "title": "在校状态与学段",
          "requirement": "原始规则 R005（第08节）：T=须核在校身份；F=未受理具体学生→NA；U=目标群体政策不明→PC；SRC-001/006；F002/F005/F006/F008；M001/M003。以申请/入住目标期间校方有效学籍和政策适用群体比较；真实在校且范围已证→PASSFACT；申报身份与可信记录不一致→CONFLICT（学籍单位）；接口不可用→SOURCEUNAVAILABLE。仅输出可追溯事实、补件建议或待人工复核；不得自动形成学校正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r006",
          "title": "学院/校区归口",
          "requirement": "原始规则 R006（第08节）：T=申请需归属学院；F=无申请→NA；U=宜宾/国际归口无证→HD；SRC-001/006/007；F007/F008/F023；M001/M002/M003（决定后 M005）。对比校方组织关系、校区、声明及当期主管；匹配→PASSFACT；跨院跨校区→CONFLICT（学籍/学院）；未经核实不接受界面传“学院审核人”。仅输出可追溯事实、补件建议或待人工复核；不得自动形成学校正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r007",
          "title": "学生申请表",
          "requirement": "原始规则 R007（第08节）：T=H01/H02 正式申请；F=P0 或 H05 紧急初始表式未触发→NA；U=现行 H05 表式未知→PC；SRC-001/004；F003/F004/F014—F018/F020/F021；M002。核正文是否含可识别申请人、住宿区间、原因、提交行为；附件未读不设更多硬栏；完整可读→PASSFACT；常规应交未交→NEEDSMATERIAL（学生）；缺页/糊字→UNREADABLE（学生）；可信校方等效电子申请可替代。仅输出可追溯事实、补件建议或待人工复核；不得自动形成学校正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r008",
          "title": "时段逻辑与政策区间",
          "requirement": "原始规则 R008（第08节）：T=存在新申请或改时段；F=无相应动作→NA；U=开放日期未知→PC；SRC-001/002/003；F010—F016/F032；M001/M002/M011。先比起止先后，再比同批次、同校区有效住宿窗口，不套旧冬季日期；顺序及当期窗口吻合→PASSFACT；起止倒置或同版矛盾→CONFLICT（学生）；越界例外→NEEDSHUMANDECISION（学院）。仅输出可追溯事实、补件建议或待人工复核；不得自动形成学校正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r009",
          "title": "事由声明",
          "requirement": "原始规则 R009（第08节）：T=申请需陈述原因；F=单纯后勤执行且声明已固定→NA；U=新类别准入未知→PC；SRC-001；F017/F018；M002。仅核“教学/竞赛/其他特殊原因”分类线索及有无具体陈述，不预测裁量结果；声明存在→PASSFACT；无理由→NEEDSMATERIAL（学生）；其他特殊原因可否接受→NEEDSHUMANDECISION（学院）。仅输出可追溯事实、补件建议或待人工复核；不得自动形成学校正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r010",
          "title": "条件事由证明",
          "requirement": "原始规则 R010（第08节）：T=现行通知/有权学院确要求佐证；F=不要求→NA；U=是否必须提交不明→PC；SRC-001（只证事由类别）；F017—F019/F036；M001/M004。比活动/课程正式记录的学生、日期及有效期；可引用主管单位已有决定；权威证明吻合→PASSFACT；应由学生交却缺→NEEDSMATERIAL；校方活动源失联→SOURCEUNAVAILABLE；例外由学院定。仅输出可追溯事实、补件建议或待人工复核；不得自动形成学校正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r011",
          "title": "代理提交授权",
          "requirement": "原始规则 R011（第08节）：T=非学生本人提交；F=本人已可信认证→NA；U=学校是否允许该代办未知→HD；SRC-001（本人提交依据）；F002/F007/F021/F036；M002/M003/M016。核被代理人、委托范围、有效期和特定操作；有效授权可验证→PASSFACT；自称老师或口头代办→NEEDSHUMANDECISION（学校授权岗）；主体冲突→CONFLICT。仅输出可追溯事实、补件建议或待人工复核；不得自动形成学校正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r012",
          "title": "学院决定来源真实性",
          "requirement": "原始规则 R012（第08节）：T=主张已有学院决定；F=P1/P2 尚未决定→NA；U=是否已办结无法读取→SU；SRC-001；F007/F022—F024/F036；M005。核有权学院原件/可信签批流、签发时刻、身份会话，红章 OCR 不能鉴真；可信决定“存在”→PASSFACT；签批人权限不明→NEEDSHUMANDECISION（学院授权岗）；正式文书源失联→SOURCEUNAVAILABLE。仅输出可追溯事实、补件建议或待人工复核；不得自动形成学校正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r013",
          "title": "决定覆盖本版申请",
          "requirement": "原始规则 R013（第08节）：T=M005 形成且用于本次申请；F=决定尚未形成→NA；U=决定版号不清→HD；SRC-001；F001/F002/F011/F015/F016/F022—F025/F035/F036；M002/M005/M011/M014。核主体、期间、假期批次与冻结版本；覆盖→PASSFACT；新日期套旧批准→CONFLICT（学院）；部分覆盖/批复范围含混→NEEDSHUMANDECISION，不能自动续签。仅输出可追溯事实、补件建议或待人工复核；不得自动形成学校正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r014",
          "title": "汇总上报真实性",
          "requirement": "原始规则 R014（第08节）：T=已准予且按指南应上报；F=P1—P3 或不予准予→NA；U=H05 是否另走台账→PC；SRC-001/002；F007/F022/F026/F027；M005/M006。查签章纸件、电子名单的本学生行及楼寓接收时间；行和移交可信→PASSFACT；本应有而学校源失联→SOURCEUNAVAILABLE（学院/楼寓）；红章未鉴真→NEEDSHUMANDECISION。仅输出可追溯事实、补件建议或待人工复核；不得自动形成学校正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r015",
          "title": "汇总与原决定一致",
          "requirement": "原始规则 R015（第08节）：T=该案存在 M005/M006；F=未到汇总→NA；U=行归属不可取→SU；SRC-001；F002—F004/F007/F011/F015/F016/F025—F027/F036；M002/M005/M006。逐行比较姓名/学号、学院、住宿时段、签批版本和纸电双份；一致→PASSFACT；错人/错时段/纸电不同→CONFLICT（学院制表、楼寓）；页不可读→UNREADABLE。仅输出可追溯事实、补件建议或待人工复核；不得自动形成学校正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r016",
          "title": "床位落实与原寝室",
          "requirement": "原始规则 R016（第08节）：T=需落实假期安置；F=P1—P4 未安排→NA；U=分配单位/当期规则不明→HD；SRC-001/002/003；F008/F009/F011/F028/F036；M001/M007/M015。比较目标时段、当期集中楼宇与现有分配；分段不同不当然冲突；安置可靠→PASSFACT；同一时段两项矛盾安排→CONFLICT（楼寓）；校方分配记录失联→SOURCEUNAVAILABLE。仅输出可追溯事实、补件建议或待人工复核；不得自动形成学校正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r017",
          "title": "临时返校协调；H05",
          "requirement": "原始规则 R017（第08节）：T=本次临时返校需要学院—楼寓联系；F=非 H05 或协调尚未开始→NA；U=当期是否仍按历史办理→PC；SRC-002（2026 寒假限定）；F014—F016/F022/F029/F036；M001/M005/M008。核学院联系、楼寓/片区响应、到校时间与本案归属；可信落实→PASSFACT；仅学生自称已联系→NEEDSHUMANDECISION（学院/后勤）；正式记录源失联→SOURCEUNAVAILABLE。仅输出可追溯事实、补件建议或待人工复核；不得自动形成学校正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r018",
          "title": "安全承诺条件",
          "requirement": "原始规则 R018（第08节）：T=当批次/学院明确要求签收；F=本案不要求→NA；U=只见 2024 院级案例→PC；SRC-001/005/007；F008/F011/F030/F036；M001/M009。对照适用人员与签收时间，不将历史承诺推为全校 P1 必交；真实签收→PASSFACT；确应学生签而缺→NEEDSMATERIAL；院方台账失联→SOURCEUNAVAILABLE（学院）。仅输出可追溯事实、补件建议或待人工复核；不得自动形成学校正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r019",
          "title": "入住/离宿执行一致",
          "requirement": "原始规则 R019（第08节）：T=实际发生入住或离宿；F=尚未入住→NA；U=门禁/宿管系统取不到→SU；SRC-002（历史冬季）；F015/F016/F025/F028/F031/F036；M005/M007/M010。将真实入住时段与决定/安置分层比较，门禁不具有批准效力；与有效安排相符→PASSFACT；越期或已撤销仍入住→CONFLICT（学院/楼寓安全岗）；不可据刷卡补造批准。仅输出可追溯事实、补件建议或待人工复核；不得自动形成学校正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r020",
          "title": "相邻业务权威状态引用",
          "requirement": "原始规则 R020（第08节）：T=请销假、学籍或常规调寝结果确有关；F=无关联→NA；U=来源失联→SU；SRC-001（相邻事项）、SRC-009（技术未核）；F006/F009/F014/F031/F035/F036；M003/M014/M015。只读其他业务决定的 ID、对象、有效时段；真实引用正确→PASSFACT；学生截图与权威结果相反→CONFLICT（原业务 Owner）；本模板不得重签 S04-T01/T03 等决定。仅输出可追溯事实、补件建议或待人工复核；不得自动形成学校正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r021",
          "title": "变更/续住的新旧范围",
          "requirement": "原始规则 R021（第08节）：T=主动改时段/事由/缩期；F=未改→NA；U=学校正式变更程序不明→HD；SRC-001（常规基础流程，无变更细则）；F011/F015—F019/F025/F032/F035/F036；M002/M005/M011/M014。保存差异、原决定及新请求版本；新请求事实可核→PASSFACT；该交变更请求而缺→NEEDSMATERIAL；旧决定用于新版本→CONFLICT（学院重新决定），不能自动批准续住。仅输出可追溯事实、补件建议或待人工复核；不得自动形成学校正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r022",
          "title": "撤回意愿与生效",
          "requirement": "原始规则 R022（第08节）：T=提出撤回、已批取消或已入住退宿；F=未提出→NA；U=撤回效力和时限未知→HD；SRC-001（无专项撤回条款）；F021/F031/F033/F035/F036；M005/M010/M012/M014。区分学生申请时间、学院取消决定、楼寓执行时间；仅“已提出”可核→PASSFACT；请求件确应交而缺→NEEDSMATERIAL；决定失联→SOURCEUNAVAILABLE；是否已撤销须学院有权岗位决定。仅输出可追溯事实、补件建议或待人工复核；不得自动形成学校正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r023",
          "title": "复核请求与结果关联",
          "requirement": "原始规则 R023（第08节）：T=学生提出异议/复核；F=未提出→NA；U=复核机关/期限未知→PC；SRC-001（无复核条款）；F021/F022/F024/F034—F036；M005/M013/M014。追踪原决定、异议、可信受理及后来复核决定的不同版本；“已提出”可核→PASSFACT；原决定失联→SOURCEUNAVAILABLE；复核授权/效力→NEEDSHUMANDECISION（校方真实复核岗），AI 不推翻原决定。仅输出可追溯事实、补件建议或待人工复核；不得自动形成学校正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r024",
          "title": "原决定链与生效范围",
          "requirement": "原始规则 R024（第08节）：T=需引用前次正式决定；F=首次申请→NA；U=原案不可查询→SU；SRC-001；SRC-009（仅技术待核）；F001/F011/F025/F032—F036；M005/M011—M014。查原案 ID、签批、撤销/替换事件和生效时间；链完整→PASSFACT；新旧有效决定互斥不明→CONFLICT（学院）；不以旧 Run@rev 伪装新决定。仅输出可追溯事实、补件建议或待人工复核；不得自动形成学校正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r025",
          "title": "证据归属、指纹和版本",
          "requirement": "原始规则 R025（第08节）：T=任何 R 使用一件材料；F=未使用该件→NA；U=无法认定所属学生/批次/版本→HD；SRC-001（个人表与汇总）、SRC-009（技术目录未核）；F001/F002/F011/F025/F036；M001—M016 按实际使用。比较学生、案号、页/行、来源、签发、指纹和替换链；归属版本一致→PASSFACT；串案或旧版混用→CONFLICT（对应持有人）；文件不可读→UNREADABLE；禁止静默沿用旧 R 结果。仅输出可追溯事实、补件建议或待人工复核；不得自动形成学校正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        }
      ]
    }
  ],
  "policyVersionIds": [],
  "stages": [
    {
      "id": "P0",
      "name": "P0 政策确认",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "P1",
      "workflowOwner": "local",
      "skippableReason": "按原模板适用身份/阶段触发；未触发时由人工标记不适用。政策、权限或正式决定未确认时转人工复核。"
    },
    {
      "id": "P1",
      "name": "P1 学生提交",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "P2",
      "workflowOwner": "local",
      "skippableReason": "按原模板适用身份/阶段触发；未触发时由人工标记不适用。政策、权限或正式决定未确认时转人工复核。"
    },
    {
      "id": "P2",
      "name": "P2 学院初核/补件",
      "kind": "supplement-wait",
      "executorRole": "reviewer",
      "nextStageId": "P3",
      "workflowOwner": "local",
      "skippableReason": "按原模板适用身份/阶段触发；未触发时由人工标记不适用。政策、权限或正式决定未确认时转人工复核。"
    },
    {
      "id": "P3",
      "name": "P3 学院正式意见（仅核验外部权威决定，不由本地模板生成）",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "P4",
      "workflowOwner": "local",
      "skippableReason": "按原模板适用身份/阶段触发；未触发时由人工标记不适用。政策、权限或正式决定未确认时转人工复核。"
    },
    {
      "id": "P4",
      "name": "P4 学院批量汇总/移交",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "P5",
      "workflowOwner": "local",
      "skippableReason": "按原模板适用身份/阶段触发；未触发时由人工标记不适用。政策、权限或正式决定未确认时转人工复核。"
    },
    {
      "id": "P5",
      "name": "P5 集中床位/临时落实",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "P6",
      "workflowOwner": "local",
      "skippableReason": "按原模板适用身份/阶段触发；未触发时由人工标记不适用。政策、权限或正式决定未确认时转人工复核。"
    },
    {
      "id": "P6",
      "name": "P6 实际入住/离宿",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "P7",
      "workflowOwner": "local",
      "skippableReason": "按原模板适用身份/阶段触发；未触发时由人工标记不适用。政策、权限或正式决定未确认时转人工复核。"
    },
    {
      "id": "P7",
      "name": "P7 变更/缩期/续住/撤回",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "P8",
      "workflowOwner": "local",
      "skippableReason": "按原模板适用身份/阶段触发；未触发时由人工标记不适用。政策、权限或正式决定未确认时转人工复核。"
    },
    {
      "id": "P8",
      "name": "P8 异议/复核与归档",
      "kind": "handoff",
      "executorRole": "teacher",
      "workflowOwner": "local",
      "skippableReason": "按原模板适用身份/阶段触发；未触发时由人工标记不适用。政策、权限或正式决定未确认时转人工复核。"
    }
  ],
  "outputs": [
    {
      "id": "fact-review-findings",
      "kind": "item-feedback",
      "audience": "reviewer"
    },
    {
      "id": "conditional-supplement-list",
      "kind": "supplement-list",
      "audience": "student"
    },
    {
      "id": "human-decision-handoff",
      "kind": "item-feedback",
      "audience": "teacher"
    }
  ],
  "autoPassPolicy": {
    "enabled": false
  },
  "status": "draft",
  "createdAt": "2026-10-24T00:00:00.000Z"
}

export const r02Metadata: R02TemplateMetadata = {
  "batchId": "S04-A",
  "templateId": "S04-T04",
  "name": "假期留宿与临时住宿申请审核",
  "officialSchoolTemplate": false,
  "researchStatus": "RESEARCH_HANDOFF_READY",
  "policyEvidenceStatus": "PARTIAL",
  "researchAsOf": "2026-10-24",
  "sourceSnapshot": "2026-10-23（当前可访问的最新正式 MD）",
  "sourceDocumentPath": "docs/design/review-agent/business-templates/R02/S04-T04.md",
  "sourceDocumentSha256": "3015f1f73a54b9bbe68d1ad2d61446f50a5e8742ff2be5044c304cc24488e8d9",
  "sourceDocumentBytes": 124102,
  "originalSourcePath": "docs/design/review-agent/business-templates/R02/research-original/S04-T04.md",
  "originalSourceBlobSha1": "43d8a356ecd991070b4c09ec0109b6268a3d36ae",
  "lineEndingNormalization": "Source snapshot had no terminal LF; one LF appended to match manifest bytes/SHA-256. No semantic text changed.",
  "sources": [
    {
      "id": "SRC-001",
      "title": "《楼寓服务》，其中“寒、暑假留校住宿办理”服务事项，另有“住宿调整”“外住办理”“住宿办理”等独立事项。",
      "url": "https://clhq.cdut.edu.cn/fwdt1/lyfw.htm",
      "sourceKind": "official-school",
      "evidenceStatus": "UNCONFIRMED",
      "note": "- 来源标签：CDUT-VERIFIED；机构：成都理工大学后勤保障部／楼寓服务中心。 - 原文标题：《楼寓服务》，其中“寒、暑假留校住宿办理”服务事项，另有“住宿调整”“外住办理”“住宿办理”等独立事项。 - URL：https://clhq.cdut.edu.cn/fwdt1/lyfw.htm - 位置：页面“服务事项｜寒、暑假留校住宿办理”一行及其“服务对象、办事流程、所需资料、注意事项”；"
    },
    {
      "id": "SRC-002",
      "title": "《关于2026年寒假后勤保障工作安排的通知》。",
      "url": "https://news.cdut.edu.cn/info/1005/52763.htm",
      "sourceKind": "official-school",
      "evidenceStatus": "UNCONFIRMED",
      "note": "- 来源标签：CDUT-VERIFIED；机构：成都理工大学后勤保障部，经成都理工新闻网发布。 - 原文标题：《关于2026年寒假后勤保障工作安排的通知》。 - URL：https://news.cdut.edu.cn/info/1005/52763.htm - 位置：“二、学生公寓服务保障／（一）学生公寓／1.住宿安排、2.出入管控、3.安全管控”。 - 公布：2026-01-22；适用期：20"
    },
    {
      "id": "SRC-003",
      "title": "《关于2025年寒假期间后勤服务调整的通知》。",
      "url": "https://news.cdut.edu.cn/info/1005/48575.htm",
      "sourceKind": "official-school",
      "evidenceStatus": "PARTIAL",
      "note": "- 来源标签：CDUT-VERIFIED；机构：成都理工大学后勤服务集团，经成都理工新闻网发布。 - 原文标题：《关于2025年寒假期间后勤服务调整的通知》。 - URL：https://news.cdut.edu.cn/info/1005/48575.htm - 位置：“二、楼寓服务保障／（二）学生公寓／1.寒假集中住宿安排”。 - 公布：2025-01-07；适用期：2025 年寒假指定时段；"
    },
    {
      "id": "SRC-004",
      "title": "《地球物理学院学生假期安全温馨提示》。",
      "url": "https://cog.cdut.edu.cn/info/1035/2617.htm",
      "sourceKind": "official-school",
      "evidenceStatus": "PARTIAL",
      "note": "- 来源标签：CDUT-VERIFIED；机构：成都理工大学地球物理学院学生科。 - 原文标题：《地球物理学院学生假期安全温馨提示》。 - URL：https://cog.cdut.edu.cn/info/1035/2617.htm - 位置：“二、注意住宿安全”相关段；网页末尾列《学生假期留校住宿申请表（本科生）》《学生假期留校住宿申请表（研究生）》附件。 - 公布：2020-01-03；适用期"
    },
    {
      "id": "SRC-005",
      "title": "《能源学院（页岩气现代产业学院）召开2024年本科暑期留校学生安全动员会》。",
      "url": "https://energy.cdut.edu.cn/info/1277/4291.htm",
      "sourceKind": "official-school",
      "evidenceStatus": "PARTIAL",
      "note": "- 来源标签：CDUT-VERIFIED；机构：成都理工大学能源学院（页岩气现代产业学院）。 - 原文标题：《能源学院（页岩气现代产业学院）召开2024年本科暑期留校学生安全动员会》。 - URL：https://energy.cdut.edu.cn/info/1277/4291.htm - 位置：正文“贾建军副书记……四是留校学生要签订《假期留校安全责任承诺书》”。 - 公布：2024-07-0"
    },
    {
      "id": "SRC-006",
      "title": "《校园服务》栏目；列有《成都理工大学国际学生假期去向登记表》。",
      "url": "https://cie.cdut.edu.cn/lxcl1/xyfw.htm",
      "sourceKind": "official-school",
      "evidenceStatus": "UNCONFIRMED",
      "note": "- 来源标签：CDUT-VERIFIED；机构：成都理工大学国际教育学院／牛津布鲁克斯学院。 - 原文标题：《校园服务》栏目；列有《成都理工大学国际学生假期去向登记表》。 - URL：https://cie.cdut.edu.cn/lxcl1/xyfw.htm - 位置：“2026-06-09 成都理工大学国际学生假期去向登记表”条目；同页还有国际学生校外住宿申请表、请假审批表。 - 公布：栏目条"
    },
    {
      "id": "SRC-007",
      "title": "《“五一”小长假安全温馨提示》。",
      "url": "https://yb.cdut.edu.cn/info/1098/4566.htm",
      "sourceKind": "official-school",
      "evidenceStatus": "PARTIAL",
      "note": "- 来源标签：CDUT-VERIFIED；机构：成都理工大学宜宾校区综合运行管理部（人民武装部）。 - 原文标题：《“五一”小长假安全温馨提示》。 - URL：https://yb.cdut.edu.cn/info/1098/4566.htm - 位置：“一、宿舍安全”第 1—2 点。 - 公布：2026-04-30；适用：2026 年五一假期宜宾校区学生安全提示；非寒暑假申请通知。 - 生效/废"
    },
    {
      "id": "SRC-008",
      "title": "《关于2026年暑假后勤保障工作安排的通知》。",
      "url": "https://www.cdut.edu.cn/index/tzgg.htm",
      "sourceKind": "official-school",
      "evidenceStatus": "UNCONFIRMED",
      "note": "- 来源标签：CURRENTITY-UNKNOWN；机构：成都理工大学官网通知公告栏目，正文拟为后勤保障部发布。 - 原文标题：《关于2026年暑假后勤保障工作安排的通知》。 - URL/路径：https://www.cdut.edu.cn/index/tzgg.htm （公告列表；具体文章 URL 未取得）。 - 位置：通知公告列表标示 2026-07-08；正文条/页未取得。 - 公布：列表标"
    },
    {
      "id": "SRC-009",
      "title": "docs/design/review-agent/acceptance/d4-unified-r01/catalog.json（G50 技术/业务去重参考）。",
      "url": "https://github.com/Fuck-GH-Admin/cdut-studio-review-agent`",
      "sourceKind": "other",
      "evidenceStatus": "PARTIAL",
      "note": "- 来源标签：GENERAL-RESEARCH；机构：Fuck-GH-Admin/cdut-studio-review-agent（用户指定技术仓库）。 - 原文标题/路径：docs/design/review-agent/acceptance/d4-unified-r01/catalog.json（G50 技术/业务去重参考）。 - URL/版本：https://github.com/Fuck-"
    },
    {
      "id": "SRC-010",
      "title": "《环境与土木工程学院研究生2026年暑假申请留校名单公示》。",
      "url": "https://cece.cdut.edu.cn/tzgg/xstz1.htm",
      "sourceKind": "official-school",
      "evidenceStatus": "UNCONFIRMED",
      "note": "- 来源标签：CURRENTITY-UNKNOWN（2026 年校本学院公告索引已见，具体公示附件未核）；机构：成都理工大学环境与土木工程学院。 - 原文标题：《环境与土木工程学院研究生2026年暑假申请留校名单公示》。 - URL：https://cece.cdut.edu.cn/tzgg/xstz1.htm （学院学生通知栏目；本次未解析到独立文章 URL）。 - 位置：栏目 2026/07/"
    },
    {
      "id": "SRC-011",
      "title": "《机电工程学院召开2025年暑期留校学生安全教育大会》。",
      "url": "https://mee.cdut.edu.cn/info/1050/3268.htm",
      "sourceKind": "official-school",
      "evidenceStatus": "PARTIAL",
      "note": "- 来源标签：CDUT-VERIFIED（限学院历史实践）；机构：成都理工大学机电工程学院。 - 原文标题：《机电工程学院召开2025年暑期留校学生安全教育大会》。 - URL：https://mee.cdut.edu.cn/info/1050/3268.htm - 位置：安全教育大会正文提及签订承诺书；发布于 2025 年暑期（网页索引）。 - 效力/人群：2025 年该学院本科留校学生的教育实"
    }
  ],
  "criteria": [
    {
      "sectionId": "rules-08-2",
      "criterionId": "r001",
      "ruleId": "R001",
      "sourceIds": [
        "SRC-001",
        "SRC-004",
        "SRC-007"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "execution": "manual"
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "r002",
      "ruleId": "R002",
      "sourceIds": [
        "SRC-001",
        "SRC-002",
        "SRC-003",
        "SRC-008"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "execution": "manual"
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "r003",
      "ruleId": "R003",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "execution": "manual"
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "r004",
      "ruleId": "R004",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "execution": "manual"
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "r005",
      "ruleId": "R005",
      "sourceIds": [
        "SRC-001",
        "SRC-006"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "execution": "manual"
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "r006",
      "ruleId": "R006",
      "sourceIds": [
        "SRC-001",
        "SRC-006",
        "SRC-007"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "execution": "manual"
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "r007",
      "ruleId": "R007",
      "sourceIds": [
        "SRC-001",
        "SRC-004"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "execution": "manual"
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "r008",
      "ruleId": "R008",
      "sourceIds": [
        "SRC-001",
        "SRC-002",
        "SRC-003"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "execution": "manual"
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "r009",
      "ruleId": "R009",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "execution": "manual"
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "r010",
      "ruleId": "R010",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "execution": "manual"
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "r011",
      "ruleId": "R011",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "execution": "manual"
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "r012",
      "ruleId": "R012",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "execution": "manual"
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "r013",
      "ruleId": "R013",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "execution": "manual"
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "r014",
      "ruleId": "R014",
      "sourceIds": [
        "SRC-001",
        "SRC-002"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "execution": "manual"
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "r015",
      "ruleId": "R015",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "execution": "manual"
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "r016",
      "ruleId": "R016",
      "sourceIds": [
        "SRC-001",
        "SRC-002",
        "SRC-003"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "execution": "manual"
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "r017",
      "ruleId": "R017",
      "sourceIds": [
        "SRC-002"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "execution": "manual"
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "r018",
      "ruleId": "R018",
      "sourceIds": [
        "SRC-001",
        "SRC-005",
        "SRC-007"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "execution": "manual"
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "r019",
      "ruleId": "R019",
      "sourceIds": [
        "SRC-002"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "execution": "manual"
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "r020",
      "ruleId": "R020",
      "sourceIds": [
        "SRC-001",
        "SRC-009"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "execution": "manual"
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "r021",
      "ruleId": "R021",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "execution": "manual"
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "r022",
      "ruleId": "R022",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "execution": "manual"
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "r023",
      "ruleId": "R023",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "execution": "manual"
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "r024",
      "ruleId": "R024",
      "sourceIds": [
        "SRC-001",
        "SRC-009"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "execution": "manual"
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "r025",
      "ruleId": "R025",
      "sourceIds": [
        "SRC-001",
        "SRC-009"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "execution": "manual"
    }
  ],
  "reviewNotes": [
    "SRC IDs are research metadata, not case-material SourceRef values.",
    "Criteria use semantic/manual only; unknown policy, authority and current forms never auto-pass or auto-reject.",
    "Template stays draft with empty policyVersionIds and autoPassPolicy.enabled=false; shared registration belongs to integration owner.",
    "原稿声明 ENUM 但未提供可核验的封闭选项时，runtime kind 使用 text，并在 label/extractionHint 保留原稿语义；不虚构枚举值。"
  ]
}
