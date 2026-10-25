import type { TemplateVersion } from '@profer/shared'

export type R02EvidenceStatus = 'VERIFIED' | 'PARTIAL' | 'UNCONFIRMED'
export interface R02SourceMetadata { id: string; title: string; url?: string; sourceKind: string; evidenceStatus: R02EvidenceStatus; note: string }
export interface R02CriterionMetadata { sectionId: string; criterionId: string; ruleId: string; sourceIds: string[]; evidenceStatus: R02EvidenceStatus; execution: 'semantic' | 'manual' }
export interface R02TemplateMetadata { batchId: string; templateId: string; name: string; officialSchoolTemplate: false; researchStatus: string; policyEvidenceStatus: R02EvidenceStatus; researchAsOf: string; sourceSnapshot: string; sourceDocumentPath: string; sourceDocumentSha256: string; sourceDocumentBytes: number; originalSourcePath: string; originalSourceBlobSha1: string; lineEndingNormalization: string; sources: R02SourceMetadata[]; criteria: R02CriterionMetadata[]; reviewNotes: string[] }

export const templateVersion: TemplateVersion = {
  "templateId": "S04-T01",
  "version": 1,
  "schemaVersion": 2,
  "name": "学生请假、长短期病假、续假、销假与返校核验",
  "description": "本地研究模板 · 非校方正式模板。学生请假、长短期病假、续假、销假与返校核验；仅核验事实、材料与分阶段流程，不产生学校正式批准/拒绝。政策证据状态：PARTIAL。",
  "catalogKind": "builtin",
  "sourceNote": "R02_RESEARCH_TEMPLATE_NONOFFICIAL: 本模板由 R02 研究原稿映射而来，非校方正式模板；SRC 为研究来源索引而非案卷 SourceRef；校规现行性、校区/学段范围、审批授权和办理系统未全部确认。正式决定必须由经学校确认的有权人员在真实校方流程中作出，本地 Agent 不得生成学校远端回写。",
  "objectType": "person",
  "displayName": {
    "template": "学生请假、长短期病假、续假、销假与返校核验（本地案卷）"
  },
  "fields": [
    {
      "key": "F001",
      "label": "F001 · leavecaseid ID／LeaveCase",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原始字段字典：F001；leavecaseid ID／LeaveCase；L1 建立，后续全链；本模板案件登记记录；M002/M009/M012 的案件关联号；P1；N：创建业务实例；禁止跨案复用。缺失是否构成补件须按当前阶段与已确认政策人工核验。"
    },
    {
      "key": "F002",
      "label": "F002 · studentpersonid ID／Student",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原始字段字典：F002；studentpersonid ID／Student；L0–L7；校方可信主身份、M001 人员记录主键；P2；U：不得凭姓名合并或批准。缺失是否构成补件须按当前阶段与已确认政策人工核验。"
    },
    {
      "key": "F003",
      "label": "F003 · studentno STRING／Student",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原始字段字典：F003；studentno STRING／Student；L0–L7；M001 学号，申请文书 M002/M009/M012 的学号栏；P2；U/N：人工核对两端，不能只靠 OCR。缺失是否构成补件须按当前阶段与已确认政策人工核验。"
    },
    {
      "key": "F004",
      "label": "F004 · studentname STRING／Student",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原始字段字典：F004；studentname STRING／Student；L0–L7；M001 官方登记姓名、申请表姓名栏；P2；U/N：不因同名等同本人。缺失是否构成补件须按当前阶段与已确认政策人工核验。"
    },
    {
      "key": "F005",
      "label": "F005 · studentcategory ENUM／Student",
      "kind": "enum",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原始字段字典：F005；studentcategory ENUM／Student；L0 和规则分流；M001 学籍类别（国内本科／研究生／来华留学本科／其他）；P2；U/H：未知不得套用本科规则。缺失是否构成补件须按当前阶段与已确认政策人工核验。",
      "options": [
        {
          "value": "国内本科",
          "label": "国内本科"
        },
        {
          "value": "研究生",
          "label": "研究生"
        },
        {
          "value": "来华留学本科",
          "label": "来华留学本科"
        },
        {
          "value": "其他",
          "label": "其他"
        }
      ]
    },
    {
      "key": "F006",
      "label": "F006 · studymode ENUM／Student",
      "kind": "enum",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原始字段字典：F006；studymode ENUM／Student；L0；研究生；M001 全日制／非全日制权威记载；P2；C/U：不适用或人工核定。缺失是否构成补件须按当前阶段与已确认政策人工核验。",
      "options": [
        {
          "value": "全日制",
          "label": "全日制"
        },
        {
          "value": "非全日制",
          "label": "非全日制"
        }
      ]
    },
    {
      "key": "F007",
      "label": "F007 · enrollmentstatus ENUM／Student",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原始字段字典：F007；enrollmentstatus ENUM／Student；L0、L7；M001 有效在读／休学／保留资格等状态；M018；P2；U：转人工，不能猜测在读。缺失是否构成补件须按当前阶段与已确认政策人工核验。"
    },
    {
      "key": "F008",
      "label": "F008 · affiliatedunitid ID／Student",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原始字段字典：F008；affiliatedunitid ID／Student；L0、L4；M001 学院／培养单位，M020 岗位授权范围；P1；U：签批归属不明暂不核通过。缺失是否构成补件须按当前阶段与已确认政策人工核验。"
    },
    {
      "key": "F009",
      "label": "F009 · semesterkey ID／LeaveCase",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原始字段字典：F009；semesterkey ID／LeaveCase；L0、L2、L7；学校当期校历／学籍学期记录（M001/M017）；P1；U/H：累计阈值不能计算。缺失是否构成补件须按当前阶段与已确认政策人工核验。"
    },
    {
      "key": "F010",
      "label": "F010 · submitactorid ID／LeaveCase",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原始字段字典：F010；submitactorid ID／LeaveCase；L1、L3；可信认证会话或校方签收人 M001/M002/M022；P2；U：界面填的 actor 无效。缺失是否构成补件须按当前阶段与已确认政策人工核验。"
    },
    {
      "key": "F011",
      "label": "F011 · submitauthoritybasis ENUM/REF／LeaveCase",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原始字段字典：F011；submitauthoritybasis ENUM/REF／LeaveCase；L1；代交时；受控本人身份或学校核准委托文书 M019；P2；C/H：代交无据不可代签。缺失是否构成补件须按当前阶段与已确认政策人工核验。"
    },
    {
      "key": "F012",
      "label": "F012 · lifecyclestage ENUM／LeaveCase",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原始字段字典：F012；lifecyclestage ENUM／LeaveCase；各阶段；有版本的案件事件 M022；P1；N：待澄清事件顺序。缺失是否构成补件须按当前阶段与已确认政策人工核验。"
    },
    {
      "key": "F013",
      "label": "F013 · leavetype ENUM／LeaveEpisode",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原始字段字典：F013；leavetype ENUM／LeaveEpisode；L1；事／病等；学生申请 M002/M009/M012 对应假别栏；P2；N：明确当前事项子类型。缺失是否构成补件须按当前阶段与已确认政策人工核验。"
    },
    {
      "key": "F014",
      "label": "F014 · reasontext TEXT／LeaveEpisode",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原始字段字典：F014；reasontext TEXT／LeaveEpisode；L1、L3、L5；本人陈述 M002/M009/M012/M008 原文段落；P3；N/H：事实不足补述，合理性人工。缺失是否构成补件须按当前阶段与已确认政策人工核验。"
    },
    {
      "key": "F015",
      "label": "F015 · requestedstart DATETIME／LeaveEpisode",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原始字段字典：F015；requestedstart DATETIME／LeaveEpisode；L1／L5；申请表起始时段 M002/M009/M012/M008；P2；N：不得凭附件日期猜起点。缺失是否构成补件须按当前阶段与已确认政策人工核验。"
    },
    {
      "key": "F016",
      "label": "F016 · requestedend DATETIME／LeaveEpisode",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原始字段字典：F016；requestedend DATETIME／LeaveEpisode；L1／L5；同上终止时段与版本；P2；N：不得用返校时间代替初始申请终点。缺失是否构成补件须按当前阶段与已确认政策人工核验。"
    },
    {
      "key": "F017",
      "label": "F017 · claimedduration STRING/NUMBER／LeaveEpisode",
      "kind": "number",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "原始字段字典：F017；claimedduration STRING/NUMBER／LeaveEpisode；L1、L2；表单填报“共计天数”与 F015/016，原值保留；M002/M009；P1；H：历法换算与端点规则未知。缺失是否构成补件须按当前阶段与已确认政策人工核验。"
    },
    {
      "key": "F018",
      "label": "F018 · destinationorroute TEXT／LeaveEpisode",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原始字段字典：F018；destinationorroute TEXT／LeaveEpisode；L1；校外情形；研究生表 M009 去向／路线，其他请假表有则读取；P2；C/H：不无据设所有校内病假必填。缺失是否构成补件须按当前阶段与已确认政策人工核验。"
    },
    {
      "key": "F019",
      "label": "F019 · studentcontact STRING／LeaveEpisode",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原始字段字典：F019；studentcontact STRING／LeaveEpisode；L1；联络必要时；研究生表 M009 个人电话；可信业务联系记录；P2；C/N：条件触发、最小收集。缺失是否构成补件须按当前阶段与已确认政策人工核验。"
    },
    {
      "key": "F020",
      "label": "F020 · familyemergencycontact STRING／LeaveEpisode",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原始字段字典：F020；familyemergencycontact STRING／LeaveEpisode；L1 研究生外出／L6 返校核实；M009 家属紧急联系电话，或校方 M016 核实记录；P3；C/H：不能要求所有本科短假填写。缺失是否构成补件须按当前阶段与已确认政策人工核验。"
    },
    {
      "key": "F021",
      "label": "F021 · applicationreceivedat DATETIME／LeaveCase",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原始字段字典：F021；applicationreceivedat DATETIME／LeaveCase；L1；正式受理／签收日志、纸质接收记载 M002/M009/M012；P1；U/N：不可由图片创建时间代替。缺失是否构成补件须按当前阶段与已确认政策人工核验。"
    },
    {
      "key": "F022",
      "label": "F022 · firstoralreportat DATETIME／LeaveEpisode",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原始字段字典：F022；firstoralreportat DATETIME／LeaveEpisode；L3；不可抗力；校方接报记录／经办人证言 M004；P2；C/H：缺书面留人审，不自动否定口头报告。缺失是否构成补件须按当前阶段与已确认政策人工核验。"
    },
    {
      "key": "F023",
      "label": "F023 · forcemajeurecircumstance TEXT／LeaveEpisode",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原始字段字典：F023；forcemajeurecircumstance TEXT／LeaveEpisode；L3；不可抗力；本人事实说明及补证 M005；P3；C/H：成立与否由人裁量。缺失是否构成补件须按当前阶段与已确认政策人工核验。"
    },
    {
      "key": "F024",
      "label": "F024 · medicalevidencetype ENUM／Evidence",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原始字段字典：F024；medicalevidencetype ENUM／Evidence；L1/L3；病假条件；医院证明或相关材料 M003/M013 种类；P3；C/N/H：本科>1天有条件必需。缺失是否构成补件须按当前阶段与已确认政策人工核验。"
    },
    {
      "key": "F025",
      "label": "F025 · evidenceissuer STRING／Evidence",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原始字段字典：F025；evidenceissuer STRING／Evidence；L1/L3；M003/M013/M005 出具单位字段和原件核实；P3；C/N：不能仅凭盖章图推定真实。缺失是否构成补件须按当前阶段与已确认政策人工核验。"
    },
    {
      "key": "F026",
      "label": "F026 · evidenceissueat DATE／Evidence",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原始字段字典：F026；evidenceissueat DATE／Evidence；L1/L3；医疗／外部佐证 M003/M013 签发日期；P3；C/N：日期不明则缺证据目的。缺失是否构成补件须按当前阶段与已确认政策人工核验。"
    },
    {
      "key": "F027",
      "label": "F027 · evidencecoverperiod REF／Evidence",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原始字段字典：F027；evidencecoverperiod REF／Evidence；L1/L3/L5；M003/M013/M008 所支持的期间原文位置；P3；C/H：不要求医院写未见之固定格式。缺失是否构成补件须按当前阶段与已确认政策人工核验。"
    },
    {
      "key": "F028",
      "label": "F028 · affectedcourserefs REF[]／LeaveCase",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原始字段字典：F028；affectedcourserefs REF[]／LeaveCase；L1/L5；影响课程时；学校课程／课表（如可得）；教师报告 M007；P1；C/U：接口不可用不强制传整个课表。缺失是否构成补件须按当前阶段与已确认政策人工核验。"
    },
    {
      "key": "F029",
      "label": "F029 · submissionchannel ENUM／LeaveCase",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原始字段字典：F029；submissionchannel ENUM／LeaveCase；L1/L4；校方实际接收渠道 M002/M009/M012/M022；P1；U/H：线上或线下现行性待核。缺失是否构成补件须按当前阶段与已确认政策人工核验。"
    },
    {
      "key": "F030",
      "label": "F030 · priorapprovalref REF／ApprovalEvent",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原始字段字典：F030；priorapprovalref REF／ApprovalEvent；L5/L6/L7；学校有效 M006 事件或核签原件；P2；C/U：首次申请不能要求；续假等必要。缺失是否构成补件须按当前阶段与已确认政策人工核验。"
    },
    {
      "key": "F031",
      "label": "F031 · approvalstate ENUM／ApprovalEvent",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原始字段字典：F031；approvalstate ENUM／ApprovalEvent；L4 后；M006 权威决定结果及版本；P2；C/U：无决定不作“已批准”。缺失是否构成补件须按当前阶段与已确认政策人工核验。"
    },
    {
      "key": "F032",
      "label": "F032 · requiredapproverrole ENUM[]／ApprovalEvent",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原始字段字典：F032；requiredapproverrole ENUM[]／ApprovalEvent；L2 预分流、L4 验证；校本条款 SRC-001/003/004 与校方 M020；P1；H：非本科层级不推断。缺失是否构成补件须按当前阶段与已确认政策人工核验。"
    },
    {
      "key": "F033",
      "label": "F033 · approvalactorid ID[]／ApprovalEvent",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原始字段字典：F033；approvalactorid ID[]／ApprovalEvent；L4 后；M006 审批人员身份映射＋M020；P2；C/U：不得信申请表自行填写职务。缺失是否构成补件须按当前阶段与已确认政策人工核验。"
    },
    {
      "key": "F034",
      "label": "F034 · decisionsignedat DATETIME／ApprovalEvent",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原始字段字典：F034；decisionsignedat DATETIME／ApprovalEvent；L4 后；M006 决定签署时间／正式电子事件；P1；C/U：初审不要求有此时间。缺失是否构成补件须按当前阶段与已确认政策人工核验。"
    },
    {
      "key": "F035",
      "label": "F035 · semesterleavetotal STRING/NUMBER／Student",
      "kind": "number",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原始字段字典：F035；semesterleavetotal STRING/NUMBER／Student；L2/L7，触阈值时；校方历史批准台账 M017，保留区间与算法；不能只取本次申请；P2；U/H：原始数据失联、计法未知不得判超限。缺失是否构成补件须按当前阶段与已确认政策人工核验。"
    },
    {
      "key": "F036",
      "label": "F036 · renewalparentref REF／LeaveEpisode",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原始字段字典：F036；renewalparentref REF／LeaveEpisode；L5 续假；原有效准假 M006，新申请 M008 明示关联；P2；C/U：未获批者不能凭空续假。缺失是否构成补件须按当前阶段与已确认政策人工核验。"
    },
    {
      "key": "F037",
      "label": "F037 · renewalreason TEXT／LeaveEpisode",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原始字段字典：F037；renewalreason TEXT／LeaveEpisode；L5 续假；M008 续假说明和对应新证明；P3；C/N/H：仅续假要求。缺失是否构成补件须按当前阶段与已确认政策人工核验。"
    },
    {
      "key": "F038",
      "label": "F038 · teachernotificationat DATETIME／LeaveEpisode",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原始字段字典：F038；teachernotificationat DATETIME／LeaveEpisode；L5；课程报告；M007 校方记录／任课教师接收事实；P1；C/U：与批准分开，未报送不等于审批不存在。缺失是否构成补件须按当前阶段与已确认政策人工核验。"
    },
    {
      "key": "F039",
      "label": "F039 · departureobservedat DATETIME／ReturnEvent",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原始字段字典：F039；departureobservedat DATETIME／ReturnEvent；L5；确需校外行程；校方经授权的出校记录（若存在）、M014；P2；C/U：不能假定门禁接口存在。缺失是否构成补件须按当前阶段与已确认政策人工核验。"
    },
    {
      "key": "F040",
      "label": "F040 · studentreturnclaimedat DATETIME／ReturnEvent",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原始字段字典：F040；studentreturnclaimedat DATETIME／ReturnEvent；L6；学生返校申报 M014 所附本人声明；P2；C/N：声明不等于已核销假。缺失是否构成补件须按当前阶段与已确认政策人工核验。"
    },
    {
      "key": "F041",
      "label": "F041 · schoolreturnverifiedat DATETIME／ReturnEvent",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原始字段字典：F041；schoolreturnverifiedat DATETIME／ReturnEvent；L6；经办人核实或校方可信返校台账 M014；P2；C/U：未取到记录只能待核。缺失是否构成补件须按当前阶段与已确认政策人工核验。"
    },
    {
      "key": "F042",
      "label": "F042 · cancelleaveconfirmedat DATETIME／ReturnEvent",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原始字段字典：F042；cancelleaveconfirmedat DATETIME／ReturnEvent；L6／销假；M015 辅导员／批准人／培养单位的有效接收确认；P2；C/U：申请阶段不应有。缺失是否构成补件须按当前阶段与已确认政策人工核验。"
    },
    {
      "key": "F043",
      "label": "F043 · cancelconfirmactorid ID／ReturnEvent",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原始字段字典：F043；cancelconfirmactorid ID／ReturnEvent；L6／销假；M015 接收者＋可信 M020 岗位；P2；C/U：学生自填“已销假”不可替代。缺失是否构成补件须按当前阶段与已确认政策人工核验。"
    },
    {
      "key": "F044",
      "label": "F044 · familyverificationat DATETIME／ReturnEvent",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原始字段字典：F044；familyverificationat DATETIME／ReturnEvent；L6；2026春季晚返校；辅导员向家长核实记录 M016；P3；C/U：该场景适用，不扩张所有假别。缺失是否构成补件须按当前阶段与已确认政策人工核验。"
    },
    {
      "key": "F045",
      "label": "F045 · withdrawrequestedat DATETIME／LeaveCase",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原始字段字典：F045；withdrawrequestedat DATETIME／LeaveCase；L7；撤回；M021 本人请求＋正式受理记录；P2；C/H：接受撤回的合法性待校本核定。缺失是否构成补件须按当前阶段与已确认政策人工核验。"
    },
    {
      "key": "F046",
      "label": "F046 · reviewrequestedat DATETIME／LeaveCase",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原始字段字典：F046；reviewrequestedat DATETIME／LeaveCase；L7；异议／复核；M021 异议内容、受理节点（如存在）；P3；C/H：普通准假复核制度未核得。缺失是否构成补件须按当前阶段与已确认政策人工核验。"
    },
    {
      "key": "F047",
      "label": "F047 · evidenceversionid ID／Evidence",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "原始字段字典：F047；evidenceversionid ID／Evidence；每次首次提交及替换；原件指纹、案件附件版本 M022；P1；N：不得覆盖原件无版本。缺失是否构成补件须按当前阶段与已确认政策人工核验。"
    },
    {
      "key": "F048",
      "label": "F048 · supersedesevidenceref REF／Evidence",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "原始字段字典：F048；supersedesevidenceref REF／Evidence；补件／纠错有替换时；M022 明确旧新版本及生效时间；P1；C/N：新上传是否替换需确认。缺失是否构成补件须按当前阶段与已确认政策人工核验。"
    },
    {
      "key": "F049",
      "label": "F049 · externaldecisionref REF[]／CrossDecision",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原始字段字典：F049；externaldecisionref REF[]／CrossDecision；L0/L2/L7 有邻接事项时；原 S01/S02/G50 有权决定 M018 的来源业务／正式状态；P2；C/U：技术候选 PASSFACT 不等于准许。缺失是否构成补件须按当前阶段与已确认政策人工核验。"
    },
    {
      "key": "F050",
      "label": "F050 · policysourcerevision REF／LeaveCase",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原始字段字典：F050；policysourcerevision REF／LeaveCase；L0、各决定点；SRC 标签／制度实施时间＋M023 校方版本确认；P1；H：现行性未知须标政策待核。缺失是否构成补件须按当前阶段与已确认政策人工核验。"
    }
  ],
  "materialSlots": [
    {
      "id": "M001",
      "name": "M001 · 学生在读身份、学段、学号、学院；校方学籍／培养单位持有的正式记录",
      "purpose": "来源模板材料槽：M001；学生在读身份、学段、学号、学院；校方学籍／培养单位持有的正式记录；L0 事实必需，不等于申请人必须上传；可由校方人工核实的带签身份／学籍证明替代失联接口；F002–F009/F010；SRC-001/002/003；校方身份底账版本、查询时间、被核学生，不能用旧截图代替现时状态；来源失联 SOURCEUNAVAILABLE，人工核；图片不可读 UNREADABLE；不得推定身份不符。policyEvidenceStatus=PARTIAL；minCount=0 用于防止未经确认的缺件自动阻断，是否需要该材料由对应 criterion 在正确阶段人工核验。",
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
        "F009",
        "F010"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M002",
      "name": "M002 · 本科本人请假单／书面申请；申请人持有或校方受理系统留存",
      "purpose": "来源模板材料槽：M002；本科本人请假单／书面申请；申请人持有或校方受理系统留存；SC01–SC07 当期申请必需；受控电子申请事件或有效书面原件可等价；F001/F003/F004/F010–F017/F021/F029；SRC-001 §21；本人申请，受理版本 v1…，签收时间另记；学生尚未提交可补；OCR 不可读要求清晰件；未批准不是此材料缺失。policyEvidenceStatus=PARTIAL；minCount=0 用于防止未经确认的缺件自动阻断，是否需要该材料由对应 criterion 在正确阶段人工核验。",
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
        "F001",
        "F003",
        "F004",
        "F010",
        "F017",
        "F021",
        "F029"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M003",
      "name": "M003 · 本科病假>1天医院证明或相关材料；医院／学生持有",
      "purpose": "来源模板材料槽：M003；本科病假>1天医院证明或相关材料；医院／学生持有；SC05 L1/L3 条件必需；“或相关材料”依法由学校判断其足以证明，不强制二甲诊断、不收无关病历；F013/F024–F027；SRC-001 §21；签发机构、日期、适用期间、原件版本单独绑定本次假段；缺条件件 NEEDSMATERIAL，不可读 UNREADABLE；材料是否适格交人工。policyEvidenceStatus=PARTIAL；minCount=0 用于防止未经确认的缺件自动阻断，是否需要该材料由对应 criterion 在正确阶段人工核验。",
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
        "F013",
        "F024",
        "F027"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M004",
      "name": "M004 · 首次口头报告或联络接收记录；辅导员／经办人持有",
      "purpose": "来源模板材料槽：M004；首次口头报告或联络接收记录；辅导员／经办人持有；SC06、SC16 不可抗力才需核，第一时间口头报告可能原本无文档；合法替代为有权人员核实的接报情况；F022/F021；SRC-001/003 §21/23；经办记录：接收人、时间、渠道、相应学生；无书面不能自动判未报告；待人工取证，模糊则询接收人。policyEvidenceStatus=PARTIAL；minCount=0 用于防止未经确认的缺件自动阻断，是否需要该材料由对应 criterion 在正确阶段人工核验。",
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
        "F022",
        "F021"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M005",
      "name": "M005 · 不可抗力事由及事后证明；申请人或能出具事实者持有",
      "purpose": "来源模板材料槽：M005；不可抗力事由及事后证明；申请人或能出具事实者持有；事毕补办阶段条件必需；可提供可核的等效第三方事实证明，具体适格人工认定；F023/F025/F026/F021；SRC-001/003；事件日期、证明来源、何时取得，关联报告 M004；事毕已届期而缺件请求补正；不可抗力是否成立不可 AI 定性。policyEvidenceStatus=PARTIAL；minCount=0 用于防止未经确认的缺件自动阻断，是否需要该材料由对应 criterion 在正确阶段人工核验。",
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
        "F023",
        "F025",
        "F026",
        "F021"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M006",
      "name": "M006 · 正式准假／不准假／续假审批事件或签章单；学校有权审批端持有",
      "purpose": "来源模板材料槽：M006；正式准假／不准假／续假审批事件或签章单；学校有权审批端持有；L4 后续才产生；受控审批日志与有权限签章纸件可互证；申请开始不可索取；F030–F034/F036；SRC-001/003/004；对应假段与版本、审批人、岗位、签署时间；旧决定独立保存；L4 后无权威决定 SOURCEUNAVAILABLE 或 NEEDSHUMANDECISION；不能凭“已提交”视准假。policyEvidenceStatus=PARTIAL；minCount=0 用于防止未经确认的缺件自动阻断，是否需要该材料由对应 criterion 在正确阶段人工核验。",
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
        "F034",
        "F036"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M007",
      "name": "M007 · 向任课教师报告有效准假事实；学生／任课教师持有",
      "purpose": "来源模板材料槽：M007；向任课教师报告有效准假事实；学生／任课教师持有；L5 已准假且影响课程时条件必需；教师签收或有校方可核通知日志等效；F028/F038/F030；SRC-001/003；具体课程、教师、批准文书版本、报告时间；已准假但通知无法确认则待核，不倒置为申请缺件。policyEvidenceStatus=PARTIAL；minCount=0 用于防止未经确认的缺件自动阻断，是否需要该材料由对应 criterion 在正确阶段人工核验。",
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
        "F028",
        "F038",
        "F030"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M008",
      "name": "M008 · 续假说明＋新证明；学生持有、学校受理",
      "purpose": "来源模板材料槽：M008；续假说明＋新证明；学生持有、学校受理；SC07/SC16 L5 条件必需；新书面申请及符合制度的电子延长申请等效；不能用旧批准单当续假决定；F015–F017/F030/F036/F037/F047；SRC-001/003；新 episode、引用原批准 M006，证明只绑定新延长期间；未交新理由／应有证明补件；不因缺新审批单阻断提出续假。policyEvidenceStatus=PARTIAL；minCount=0 用于防止未经确认的缺件自动阻断，是否需要该材料由对应 criterion 在正确阶段人工核验。",
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
        "F017",
        "F030",
        "F036",
        "F037",
        "F047"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M009",
      "name": "M009 · 研究生外出（请假）申请表；本人填写，培养单位／研究生辅导员留存",
      "purpose": "来源模板材料槽：M009；研究生外出（请假）申请表；本人填写，培养单位／研究生辅导员留存；SC11/SC12 2024 线下程序有明文；2026 当前线上替代待校方核。可信电子流程或表单原件作为可核替代；F003–F005/F008/F014–F021/F029；SRC-004 附件1；2024 表列姓名、学号、电话、去向、起止、导师及意见栏；因私／因公版本各有独立角色；线上渠道未知标 POLICYUNCONFIRMED，不能一律硬要纸件；模糊字段请求清晰件。policyEvidenceStatus=PARTIAL；minCount=0 用于防止未经确认的缺件自动阻断，是否需要该材料由对应 criterion 在正确阶段人工核验。",
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
        "F005",
        "F008",
        "F014",
        "F021",
        "F029"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M010",
      "name": "M010 · 研究生因公任务派出授权／路线与带队信息；任务派出单位持有",
      "purpose": "来源模板材料槽：M010；研究生因公任务派出授权／路线与带队信息；任务派出单位持有；SC12 因公才条件必需，独立安全批准由 G05/正式学校业务承接；可引用可信任务审批 M018 而非重复上交；F013/F018/F049；SRC-004/012/016；派出任务 ID、单位意见、批准时段；与个人请假分开；外部业务未完成则转办待人工，不以个人准假替代任务批准。policyEvidenceStatus=PARTIAL；minCount=0 用于防止未经确认的缺件自动阻断，是否需要该材料由对应 criterion 在正确阶段人工核验。",
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
        "F013",
        "F018",
        "F049"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M011",
      "name": "M011 · 寒暑假研究生安全提示签字／离校告知；研究生、辅导员持有",
      "purpose": "来源模板材料槽：M011；寒暑假研究生安全提示签字／离校告知；研究生、辅导员持有；仅符合 SRC-004 寒暑假研究生外出情形时条件必需；电子签收等价性需学校确认；F013/F029/F021；SRC-004 页1、附件2；安全提示版本和本人签收，不能用一般课程病假代替；不在寒暑假 NOTAPPLICABLE；渠道／等价性未知人工核。policyEvidenceStatus=PARTIAL；minCount=0 用于防止未经确认的缺件自动阻断，是否需要该材料由对应 criterion 在正确阶段人工核验。",
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
        "F013",
        "F029",
        "F021"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M012",
      "name": "M012 · 来华留学本科生请假条／正式申请；学生、学院／留学生管理科持有",
      "purpose": "来源模板材料槽：M012；来华留学本科生请假条／正式申请；学生、学院／留学生管理科持有；SC14/SC16 第23条已明示的情形当前必需；2026 表单 M024 是否为新载体待核，不能要求双交；F003–F005/F013–F017/F021/F029；SRC-003/006；学生申请、班主任／导师、留管科、学院意见在相应阶段产生；表单载体未知 POLICYUNCONFIRMED；缺申请可补，不预收批准意见。policyEvidenceStatus=PARTIAL；minCount=0 用于防止未经确认的缺件自动阻断，是否需要该材料由对应 criterion 在正确阶段人工核验。",
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
        "F005",
        "F013",
        "F017",
        "F021",
        "F029"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M013",
      "name": "M013 · 来华留学本科生请假有关证明；学生或证明出具者持有",
      "purpose": "来源模板材料槽：M013；来华留学本科生请假有关证明；学生或证明出具者持有；SC14 第23条（≤1周）要求有关材料，SC16 续假／事后补办有证明；种类等效性待主管核定；F024–F027/F013–F017；SRC-003 §23；与本次假段相关，签发人与时间可定位；病假不统一假定二甲；未见相关证明可补；仅内容读不清 UNREADABLE。policyEvidenceStatus=PARTIAL；minCount=0 用于防止未经确认的缺件自动阻断，是否需要该材料由对应 criterion 在正确阶段人工核验。",
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
        "F024",
        "F027",
        "F013",
        "F017"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M014",
      "name": "M014 · 实际返校声明／校方观察记录；本人和辅导员／培养单位分别持有",
      "purpose": "来源模板材料槽：M014；实际返校声明／校方观察记录；本人和辅导员／培养单位分别持有；L6 才产生。学校可信签到、经办查验记录可以替代本人反复上传地理定位照片；F039–F041/F047；SRC-001/004/005；分别存“本人自述”和“校方核实”，同一时间线，不能互相覆盖；无校方核实 SOURCEUNAVAILABLE／待查；仅自拍不算校方确认。policyEvidenceStatus=PARTIAL；minCount=0 用于防止未经确认的缺件自动阻断，是否需要该材料由对应 criterion 在正确阶段人工核验。",
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
        "F039",
        "F041",
        "F047"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M015",
      "name": "M015 · 销假确认／接收回执；有权辅导员、批准人或培养单位持有",
      "purpose": "来源模板材料槽：M015；销假确认／接收回执；有权辅导员、批准人或培养单位持有；L6 校方接受销假后才产生；可信销假日志或有权纸面签收可替代；F042/F043/F030；SRC-001/004；明确对应旧假单／学生／接收人／销假时间；L1–L5 NOTAPPLICABLE；L6 无法核实转人工，不能虚构已销假。policyEvidenceStatus=PARTIAL；minCount=0 用于防止未经确认的缺件自动阻断，是否需要该材料由对应 criterion 在正确阶段人工核验。",
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
        "F042",
        "F043",
        "F030"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M016",
      "name": "M016 · 2026春季未按时返校联系和家长核实记录；辅导员、学院持有",
      "purpose": "来源模板材料槽：M016；2026春季未按时返校联系和家长核实记录；辅导员、学院持有；SC09 该通知触发时需核，其他假别非普遍必需；合法替代为经办人可核记录；F020/F040/F041/F044；SRC-005；通联对象、时间、记录者、确认的仅是未返校原因；对当期缺记录交学院补核；家长陈述不能替代批准。policyEvidenceStatus=PARTIAL；minCount=0 用于防止未经确认的缺件自动阻断，是否需要该材料由对应 criterion 在正确阶段人工核验。",
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
        "F020",
        "F040",
        "F041",
        "F044"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M017",
      "name": "M017 · 同一学期权威请假累计台账／校历；学生处、教务／培养单位持有",
      "purpose": "来源模板材料槽：M017；同一学期权威请假累计台账／校历；学生处、教务／培养单位持有；SC18 L2/L7 触阈值才必需事实；不得要求学生自行上传所有历史假单。可由校方核实逐次批准与日期；F009/F015–F017/F035；SRC-001/002/003；学期、每段原始区间、批准版本、重叠关系、核算方法；失联 SOURCEUNAVAILABLE；计数口径未知 POLICYUNCONFIRMED，不能自动下休学结论。policyEvidenceStatus=PARTIAL；minCount=0 用于防止未经确认的缺件自动阻断，是否需要该材料由对应 criterion 在正确阶段人工核验。",
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
        "F015",
        "F017",
        "F035"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M018",
      "name": "M018 · S01/S02/G50 或独立活动／出境事项的正式结论；对应业务 Owner 持有",
      "purpose": "来源模板材料槽：M018；S01/S02/G50 或独立活动／出境事项的正式结论；对应业务 Owner 持有；只有关联有效决定时复用；由权威业务链接／原件与有权签发确认等效。不可拿技术候选 PASSFACT 代替行政决定；F007/F049/F030/F050；SRC-001/002/011/016；外部案例 ID、当事人、事项、时效、签发者、状态，原业务写权独占；外部失联 SOURCEUNAVAILABLE；决定未形成只转办。policyEvidenceStatus=PARTIAL；minCount=0 用于防止未经确认的缺件自动阻断，是否需要该材料由对应 criterion 在正确阶段人工核验。",
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
        "F007",
        "F049",
        "F030",
        "F050"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M019",
      "name": "M019 · 正式委托／代理权限证明；校方授权管理者持有",
      "purpose": "来源模板材料槽：M019；正式委托／代理权限证明；校方授权管理者持有；只在代申请、委托审批等确有授权情形条件必需；2022 通用平台可设“事项委托”不等于本案获授权；F010/F011/F033；SRC-008（技术渠道）；授权人／受托人、范围、有效期、学校确认；代办无权属人工核，不自动承认教师角色文本。policyEvidenceStatus=PARTIAL；minCount=0 用于防止未经确认的缺件自动阻断，是否需要该材料由对应 criterion 在正确阶段人工核验。",
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
        "F010",
        "F011",
        "F033"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M020",
      "name": "M020 · 审批者现任岗位与所属学院授权记录；校方人事／组织岗位管理持有",
      "purpose": "来源模板材料槽：M020；审批者现任岗位与所属学院授权记录；校方人事／组织岗位管理持有；L4 验证权限必需事实；不要求学生提供人事材料；可由校方授权管理员核验岗位原始文件；F008/F032/F033/F043；SRC-001/003/004；岗位效期、学院范围、委托情况，和审批事件时间对应；失联 SOURCEUNAVAILABLE，越权不能靠字迹比较判断。policyEvidenceStatus=PARTIAL；minCount=0 用于防止未经确认的缺件自动阻断，是否需要该材料由对应 criterion 在正确阶段人工核验。",
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
        "F008",
        "F032",
        "F033",
        "F043"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M021",
      "name": "M021 · 撤回／更正／复核提出的本人请求；本人、学校接收机构持有",
      "purpose": "来源模板材料槽：M021；撤回／更正／复核提出的本人请求；本人、学校接收机构持有；SC19/SC20 L7 条件必需；可信电子请求或本人纸件可等价，受理规则未明；F045/F046/F030；校本流程缺口 SRC-008；请求版本、针对哪个申请／决定、校方签收；与原决定分别留存；不是申请时必需；提交请求不代表已成功撤销决定。policyEvidenceStatus=PARTIAL；minCount=0 用于防止未经确认的缺件自动阻断，是否需要该材料由对应 criterion 在正确阶段人工核验。",
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
        "F045",
        "F046",
        "F030"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M022",
      "name": "M022 · 证据替换、撤回、来源版本与操作日志；审核系统／校方事件主体持有",
      "purpose": "来源模板材料槽：M022；证据替换、撤回、来源版本与操作日志；审核系统／校方事件主体持有；补件、变更、决定及后续全部阶段的内部版本元数据，不由学生独立提交；F001/F010/F012/F047/F048；项目设计、SRC-008 通用待办示例；原件 hash、来源、时间、替换关系、操作者、受影响审核；系统须保留历史而非覆盖；缺日志不应伪造时间与操作人。policyEvidenceStatus=PARTIAL；minCount=0 用于防止未经确认的缺件自动阻断，是否需要该材料由对应 criterion 在正确阶段人工核验。",
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
        "F001",
        "F010",
        "F012",
        "F047",
        "F048"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M023",
      "name": "M023 · 校方政策版本解释或人工定夺记录；制度归口部门／有权审核人持有",
      "purpose": "来源模板材料槽：M023；校方政策版本解释或人工定夺记录；制度归口部门／有权审核人持有；时间算法、难例、撤回／复核权限、材料适格待决时后续才产生；不由学生初次提交；F050/F023/F035/F046；SRC-001/002/003/012/013；谁判断、引用有效原文、意见生效时间和范围，区别事实与裁量；现行性未核 POLICYUNCONFIRMED；不能用 AI 自己写解释。policyEvidenceStatus=PARTIAL；minCount=0 用于防止未经确认的缺件自动阻断，是否需要该材料由对应 criterion 在正确阶段人工核验。",
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
        "F050",
        "F023",
        "F035",
        "F046"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M024",
      "name": "M024 · 2026 国际学生请假审批表附件实体（待取）；国际教育学院／学生持有",
      "purpose": "来源模板材料槽：M024；2026 国际学生请假审批表附件实体（待取）；国际教育学院／学生持有；SRC-006 只核到网页条目，未确认是替代 M012 的现行必交件；取得附件后再据阶段判断；F013–F017/F029/F032；SRC-006/013；2026-06-09 为目录日期，附件字段与版本未知；当前不因未交 M024 拒件；附件失联 SOURCEUNAVAILABLE、政策待核。policyEvidenceStatus=PARTIAL；minCount=0 用于防止未经确认的缺件自动阻断，是否需要该材料由对应 criterion 在正确阶段人工核验。",
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
        "F013",
        "F017",
        "F029",
        "F032"
      ],
      "allowReuseAcrossSubjects": false
    }
  ],
  "sections": [
    {
      "id": "rules-08-2",
      "name": "08.2 入门、申请与本科基础事实",
      "description": "映射自原始研究模板第08节；仅供事实核验与人工复核，不代表校方授权。",
      "order": 1,
      "required": true,
      "criteria": [
        {
          "id": "r001",
          "title": "请求核在读请假",
          "requirement": "原始规则 R001（第08节）：T=请求核在读请假；F=SC21 新生或正式休学事项已路由；U=事项及学校归属不明；SRC-001/003/007/017/019–021/023；F001/F005/F007/F012/F050；M001/M018/M023；先核是否成都理工大学及学段适用；按发生日制度而非旧 PDF 标题，T3学籍／T2人核；研究生2024与国际2025新规缺正文不可直接现行化；新生转 S01/注册且本规则 N/A；学段不明→SOURCEUNAVAILABLE；新规具体效力→POLICYUNCONFIRMED／学籍与国际学生归口。仅输出可追溯事实、补件建议或待人工复核；不得自动形成学校正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r002",
          "title": "要把本案材料归属某学生",
          "requirement": "原始规则 R002（第08节）：T=要把本案材料归属某学生；F=无需学生归属的目录讨论；U=可信唯一人员标识不可取；SRC-001/003/010；F002/F003/F004/F008；M001/M002/M009/M012；学校人员键和学号优先，姓名辅证；T3 学籍 vs T1 上传／OCR；分学段、学院、当期记录；同名异号不得归并；不匹配→CONFLICT／学籍管理员；校方数据失联→SOURCEUNAVAILABLE。仅输出可追溯事实、补件建议或待人工复核；不得自动形成学校正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r003",
          "title": "身份路由须确定在读状态",
          "requirement": "原始规则 R003（第08节）：T=身份路由须确定在读状态；F=明确是报到注册例外仅路由；U=学籍状态无权威记录；SRC-001/003/017/019；F005/F006/F007/F009；M001/M018；比较审核时点与请假发生时点的学籍有效期，T3／校方人工T2；研究生2024新规影响状态解释；休学记录≠准假批准；异常交学籍 Owner；无法查询→SOURCEUNAVAILABLE，不要要求学生上传全学期后台台账。仅输出可追溯事实、补件建议或待人工复核；不得自动形成学校正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r004",
          "title": "代提交、代签／委托",
          "requirement": "原始规则 R004（第08节）：T=代提交、代签／委托；F=可信本人亲办且无委托；U=实际 actor 来源不可信；SRC-001/008（后者仅平台功能）；F010/F011/F033；M001/M019/M020/M022；受控认证身份、正式委托范围、岗位效期、学院范围比对；T3 事件或校方人工 T2；不可用 T0 Renderer Actor；同学代教师通知≠代签准假；声称 teacher/admin 无权威则NEEDSHUMANDECISION／校方权限管理员。仅输出可追溯事实、补件建议或待人工复核；不得自动形成学校正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r005",
          "title": "本期新假段有起止",
          "requirement": "原始规则 R005（第08节）：T=本期新假段有起止；F=仅撤回或政策索引；U=日期一端不明；SRC-001/003/004；F001/F012/F015/F016/F017/F047；M002/M008/M009/M012/M022；对原始申请行的起止、申请人填报天数、日期矛盾作精确值比较；T1原件+版本；校本含端点／半天口径未知；终点在起点前→CONFLICT；无法读→UNREADABLE；不能靠自设换算算法否决时长／校方主管。仅输出可追溯事实、补件建议或待人工复核；不得自动形成学校正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r006",
          "title": "新请假申请",
          "requirement": "原始规则 R006（第08节）：T=新请假申请；F=只有后阶段销假；U=假别不明；SRC-001/003/004；F013/F014/F018/F019/F020；M002/M009/M012；从本人申请原文定位事由、假别、请求期间及研究生表对外出路线／联系人实际要求；T1；不要从病历反推申请类型；事由为空→NEEDSMATERIAL；理由是否成立归人工；普通短病假不一律填出行路线／学生管理经办人。仅输出可追溯事实、补件建议或待人工复核；不得自动形成学校正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r007",
          "title": "应用程序已受理或学校收到书面件",
          "requirement": "原始规则 R007（第08节）：T=应用程序已受理或学校收到书面件；F=未提交只处准备阶段；U=受理日志不可得；SRC-001/003/004/007/008；F010/F021/F029；M002/M009/M012/M022；区别文件创建、学生上传、校方收到、正式受理四时点；T3受理事件或校方T2纸件签收；官方入口存在不证明每人已成功线上受理；失联→SOURCEUNAVAILABLE／实际收件部门。仅输出可追溯事实、补件建议或待人工复核；不得自动形成学校正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r008",
          "title": "首申阶段学生确需申请载体",
          "requirement": "原始规则 R008（第08节）：T=首申阶段学生确需申请载体；F=销假／纯转办；U=2026新版载体不明确；SRC-001/003/006/013；F003/F010–F017/F021；M002/M012/M024；普本书面请假单；留学本科按2022“请假条”，2026表是否替换只待校方解释；T1纸件或 T3可证电子事件；未有现阶段申请→NEEDSMATERIAL／学生；但不许把将来的批准单 M006 当申请必交；国际表不明→POLICYUNCONFIRMED。仅输出可追溯事实、补件建议或待人工复核；不得自动形成学校正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r009",
          "title": "国内全日制本科、拟核签批角色",
          "requirement": "原始规则 R009（第08节）：T=国内全日制本科、拟核签批角色；F=非本科或未到签批阶段；U=计日规则／现任职务未知；SRC-001 §21；F005/F008/F015–F017/F032/F033/F034；M002/M006/M019/M020；“一天以内→辅导员；>一天且≤一周→学工副书记；>一周→副书记与教学副院长联署”；当期T3人事授权与决定时点匹配；计法不自创；T仅给候选应由谁批准；有决定后越权／少一签→CONFLICT／原学院领导；日数临界算法未知→POLICYUNCONFIRMED。仅输出可追溯事实、补件建议或待人工复核；不得自动形成学校正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r010",
          "title": "国内本科病假时长按权威口径>1天",
          "requirement": "原始规则 R010（第08节）：T=国内本科病假时长按权威口径>1天；F=≤1天或非国内本科；U=跨日／时长算法不明；SRC-001 §21、SRC-009（已废止对照）；F005/F013/F017/F024–F027；M002/M003；查医院证明或相关材料是否存在、原文可读、签发人及证明目的；T1原件，真实性进一步T2；2017旧文不得替代2019；缺当期条件材料→NEEDSMATERIAL／学生；等价性有裁量→NEEDSHUMANDECISION／辅导员／学院。仅输出可追溯事实、补件建议或待人工复核；不得自动形成学校正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r011",
          "title": "疾病证明被用于支撑一段请假／续假",
          "requirement": "原始规则 R011（第08节）：T=疾病证明被用于支撑一段请假／续假；F=无病假证明目的；U=实际用途不明；SRC-001/003；F015/F016/F024–F027/F037；M003/M008/M013；逐段比较医疗支持期间和申请期间，保留签发日／页位；T1 OCR 仅初识别、T2真人核真假；不推断诊断严重程度；医嘱只支持部分期间→CONFLICT或待补该段；原件遮挡→UNREADABLE／原件签发者及学院。仅输出可追溯事实、补件建议或待人工复核；不得自动形成学校正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r012",
          "title": "本人称不可抗力无法先书面",
          "requirement": "原始规则 R012（第08节）：T=本人称不可抗力无法先书面；F=正常事前申请／续假；U=事由或口头报告时间不明；SRC-001/003 §21/23；F022/F023/F021；M004/M005；区分报告事实、接报人、事发与事毕时点；T2校方口头接报人查证，不能凭“无纸件”否定已口报；是否不可抗力属校方裁量→NEEDSHUMANDECISION；联系记录失联→SOURCEUNAVAILABLE／接报人。仅输出可追溯事实、补件建议或待人工复核；不得自动形成学校正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r013",
          "title": "事毕后书面补办",
          "requirement": "原始规则 R013（第08节）：T=事毕后书面补办；F=正常事前／事件未结束；U=障碍结束日或学校工作日历未知；SRC-001/003；F021/F022/F023/F050；M002/M005/M012/M013/M023；原文有事毕后两个工作日；需分别记录事件结束、收件时间、校方工作日历，T2/3；绝不以初次口报时间当补办完成；超期或事由争议→NEEDSHUMANDECISION／学院；工作日算法不可证→POLICYUNCONFIRMED。仅输出可追溯事实、补件建议或待人工复核；不得自动形成学校正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        }
      ]
    },
    {
      "id": "rules-08-3",
      "name": "08.3 决定、续假、返校与销假",
      "description": "映射自原始研究模板第08节；仅供事实核验与人工复核，不代表校方授权。",
      "order": 2,
      "required": true,
      "criteria": [
        {
          "id": "r014",
          "title": "学校声称已经作出准假／拒绝／退回决定",
          "requirement": "原始规则 R014（第08节）：T=学校声称已经作出准假／拒绝／退回决定；F=首次受理还在排队；U=决定记录未获；SRC-001/003/004/019；F030–F034/F050；M006/M020/M019；原决定 ID、学生、期间、岗位、签署时点、联署完整性比对；T3优先，T2手工核签；研究生现行角色未知不判真；Renderer approved=true→不能通过；无权者提交意见≠决定；缺权威记录→SOURCEUNAVAILABLE，角色不明→POLICYUNCONFIRMED／学校决定 Owner。仅输出可追溯事实、补件建议或待人工复核；不得自动形成学校正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r015",
          "title": "已获可信批准且影响课程",
          "requirement": "原始规则 R015（第08节）：T=已获可信批准且影响课程；F=未批准、无须报告的范围外情形；U=教师接收事实不可核；SRC-001/003；F028/F030/F031/F038；M006/M007；批准文书是否向受影响任课教师报告，按课程与时间核版本；T2教师确认／T3通知事件；准假≠已通知；未通知交学生补报告／任课教师核实，不由本模板自动判旷课。仅输出可追溯事实、补件建议或待人工复核；不得自动形成学校正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r016",
          "title": "续假基于可核先前已批准假段",
          "requirement": "原始规则 R016（第08节）：T=续假基于可核先前已批准假段；F=首次申请；U=原决定 ID 未取得；SRC-001/003；F001/F030/F036/F047；M006/M008/M022；同学生、前后假段、原批准有效期，T3原批准／T2人工核文；不能把原纸件视为下一次新批准；旧案对不上→CONFLICT／原批准人；原决定源失联→SOURCEUNAVAILABLE。仅输出可追溯事实、补件建议或待人工复核；不得自动形成学校正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r017",
          "title": "申请延至原有效时段之后",
          "requirement": "原始规则 R017（第08节）：T=申请延至原有效时段之后；F=无需延期；U=延长终点或新证明未读；SRC-001/003；F015–F017/F027/F037；M008/M003/M013；新起止、续假事由、新证明覆盖延长期；证据为独立新版本，按适用病假与校本证明标准 T1/T2；应有新说明缺→NEEDSMATERIAL／学生；医学合法替代不明→NEEDSHUMANDECISION／学院。仅输出可追溯事实、补件建议或待人工复核；不得自动形成学校正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r018",
          "title": "续假已送有权人并声称新有效批准",
          "requirement": "原始规则 R018（第08节）：T=续假已送有权人并声称新有效批准；F=只提交续假申请未决定；U=新审批源不可达；SRC-001/003/019；F030/F031/F032/F034/F036；M006/M008/M020；新旧两次决定必须是不同签署事件，校验新审批范围／时间及必要角色；T3；国际超范围暂停；仅因旧批准存在绝不能把新增期间标“已批”；待校方批准→NEEDSHUMANDECISION，未知角色→POLICYUNCONFIRMED。仅输出可追溯事实、补件建议或待人工复核；不得自动形成学校正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r019",
          "title": "学生称已经归校",
          "requirement": "原始规则 R019（第08节）：T=学生称已经归校；F=假期未结束且无返校核验；U=本人申报缺时间；SRC-001/004/003；F030/F040/F047；M006/M014；本人返校时点与已批准假段及后续销假区分；T1本人声明；不把照片 EXIF 当可信门禁时间；缺本人申报可请补；自述与原假段冲突→CONFLICT／学生及辅导员。仅输出可追溯事实、补件建议或待人工复核；不得自动形成学校正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r020",
          "title": "学校声称已核验实际在校／出入",
          "requirement": "原始规则 R020（第08节）：T=学校声称已核验实际在校／出入；F=不要求实体返校的阶段；U=权威返校源不可得；SRC-001/004/005；F039/F040/F041；M014/M016；同学生、地点、观察时间；本人T1、校方核查T2/T3，区别“入校”与“完成销假”；不假设存在门禁接口；本人称8日、校方记录10日→CONFLICT／辅导员核验；可信数据断联→SOURCEUNAVAILABLE。仅输出可追溯事实、补件建议或待人工复核；不得自动形成学校正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r021",
          "title": "已有有效请假且向有权者销假",
          "requirement": "原始规则 R021（第08节）：T=已有有效请假且向有权者销假；F=L1首申或尚未回校；U=销假确认与受理部门未核；SRC-001/004；F030/F042/F043；M006/M015/M020；2019本科“向辅导员或批准人销假”；2024研究生外出表“到培养单位办理销假、报告导师”；T2/3 权限时效比对；自拍与本人写“已销假”不是结论；找不到确认→SOURCEUNAVAILABLE／辅导员或培养单位。仅输出可追溯事实、补件建议或待人工复核；不得自动形成学校正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r022",
          "title": "2026春季开学确属未按时返校",
          "requirement": "原始规则 R022（第08节）：T=2026春季开学确属未按时返校；F=非该通知时段或已按时返校；U=返校统计身份／时点不可核；SRC-005；F005/F020/F040/F041/F044；M014/M016；辅导员实际联系学生、核原因并与家长核实；T2校方访谈记录，2026春时效，其他学期不可自动复用；无家长记录交学院补核／SOURCEUNAVAILABLE；家长口头答应不是请假批准；不能要求所有普通短假填家长签字。仅输出可追溯事实、补件建议或待人工复核；不得自动形成学校正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        }
      ]
    },
    {
      "id": "rules-08-4",
      "name": "08.4 不同学段、外出与相邻决定",
      "description": "映射自原始研究模板第08节；仅供事实核验与人工复核，不代表校方授权。",
      "order": 3,
      "required": true,
      "criteria": [
        {
          "id": "r023",
          "title": "研究生课堂／教学请假",
          "requirement": "原始规则 R023（第08节）：T=研究生课堂／教学请假；F=本科或纯行政外出；U=最新研究生规则未取；SRC-002（历史）／SRC-017/018/019；F005/F006/F012–F017/F032/F050；M001/M023；2025官方研究生院援引2024 29号，但正文缺；可保留申请事实，不推定审批层级、材料、时间阈值；必出 POLICYUNCONFIRMED 送培养单位与研究生院确认，2021“>6周”不许作为2026自动判定。仅输出可追溯事实、补件建议或待人工复核；不得自动形成学校正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r024",
          "title": "研究生校外外出落入2024通知表单期",
          "requirement": "原始规则 R024（第08节）：T=研究生校外外出落入2024通知表单期；F=普通校内课堂请假；U=2026是否已替换线上程序未核；SRC-004/012；F003–F005/F008/F014–F021/F029；M001/M009/M022；对照原表姓名学号学院、去向、起止、本人签字、意见栏；原表 T1/T2，2024时有效、2026渠道待核；原纸表与可信新系统可能二选一，不能要求双交；渠道未知→POLICYUNCONFIRMED／研究生辅导员。仅输出可追溯事实、补件建议或待人工复核；不得自动形成学校正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r025",
          "title": "研究生在SRC-004 所述寒暑假离校并适用2024流程",
          "requirement": "原始规则 R025（第08节）：T=研究生在SRC-004 所述寒暑假离校并适用2024流程；F=常规行课日无假期要求；U=现行假期流程未知；SRC-004 页1及附件2；F013/F018/F021/F029；M011/M009；安全提示本人签收、提交辅导员为2024规定；T1签字页、T2收件记录；后续系统替代需校方确认；不将寒暑假安全提示加到所有病假；2026流程不可确认→POLICYUNCONFIRMED／培养单位。仅输出可追溯事实、补件建议或待人工复核；不得自动形成学校正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r026",
          "title": "研究生因公任务／集体实践",
          "requirement": "原始规则 R026（第08节）：T=研究生因公任务／集体实践；F=因私请假；U=任务来源与目的不明；SRC-004/012/016；F013/F018/F049/F050；M009/M010/M018；2024因公表有任务派出者与派出单位意见、路线、带队者、保险覆盖栏，并有每3自然日主动联络承诺；只在校方外出安全 Owner 核权限后复用T2/3决定；本案不重复作团体安全准入／出国任务；SRC-012 主办法缺→POLICYUNCONFIRMED／研究生院与活动 Owner。仅输出可追溯事实、补件建议或待人工复核；不得自动形成学校正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r027",
          "title": "来华留学本科因事病缺课且已核一周以内",
          "requirement": "原始规则 R027（第08节）：T=来华留学本科因事病缺课且已核一周以内；F=非留本、该范围外；U=持续天数／适用身份未知；SRC-003 §22–23、SRC-020/021（新规正文待核）；F003–F005/F013–F017/F024–F027/F032；M001/M012/M013/M006；按2022文本核有关证明、请假条与班主任／导师、留管科、学院分阶段意见；2025工作办法与2026表是否改变路径未证；当前政策继承关系未核→POLICYUNCONFIRMED由国际学院解释；超一周/国际研究生不套链，确认2022条款在该时点仍适用后方可输出缺件。仅输出可追溯事实、补件建议或待人工复核；不得自动形成学校正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r028",
          "title": "办件引用2026国际学生新审批表",
          "requirement": "原始规则 R028（第08节）：T=办件引用2026国际学生新审批表；F=未适用或仍用正式2022请假条；U=2026附件实体未得；SRC-003/006/013/020/021/022；F005/F006/F013/F029/F032/F050；M012/M024；官方目录有2026表名称但无字段、签批及施行说明；2026数字平台公告仅采购需求，不能证实已上线；禁止强制提交双表；目前必须 POLICYUNCONFIRMED／国际教育学院取表、2025正文及现行渠道；不能因未给未见表格记 NEEDSMATERIAL。仅输出可追溯事实、补件建议或待人工复核；不得自动形成学校正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r029",
          "title": "来华留学本科不可抗力后补或有效假期续假",
          "requirement": "原始规则 R029（第08节）：T=来华留学本科不可抗力后补或有效假期续假；F=首申正常且不延期；U=分支无法分辨；SRC-003 §23／SRC-020（2025效力待核）；F022/F023/F030/F036/F037；M004/M005/M006/M008/M012/M013；按2022文本分支独立核：后补首报、事毕2工作日、相关证明；续假必须有旧批准及新证明；T1/2/3与版关联；不允许把两分支材料同时强索；2025新规是否改流程、一周以上审批权限不明→POLICYUNCONFIRMED／留管科。仅输出可追溯事实、补件建议或待人工复核；不得自动形成学校正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r030",
          "title": "来华留学本科已回校拟办理销假",
          "requirement": "原始规则 R030（第08节）：T=来华留学本科已回校拟办理销假；F=尚未返校；U=校本专门销假规则不可证；SRC-003/006/013/020/022；F030/F040–F043/F050；M014/M015/M024；可核本人申报与校方返校事实；2026数字平台采购计划≠现已上线销假功能，不能从2022续假条文推造具体销假人／时限／回执；返校事实可 PASSFACT，销假程序单独 POLICYUNCONFIRMED／国际学院。仅输出可追溯事实、补件建议或待人工复核；不得自动形成学校正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r031",
          "title": "已核国内本科同期请假累计或学校医院／二甲及以上停课诊断",
          "requirement": "原始规则 R031（第08节）：T=已核国内本科同期请假累计或学校医院／二甲及以上停课诊断；F=研究生及其他身份；U=起止及校历口径未知；SRC-001 §21、41；F005/F009/F015–F017/F024–F027/F035；M003/M017/M023；累计>6周或经指定医院诊断需停课治疗／休养>6周，是本科转 S01 事实条件；T3历史台账与T2人核，重叠区间仅计一次，端点规则待定；达阈值也只交 S01 有权休学办理，不生成休学批准；算法未知→POLICYUNCONFIRMED／教务学籍部门。仅输出可追溯事实、补件建议或待人工复核；不得自动形成学校正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r032",
          "title": "已核留学本科一学期累计假期",
          "requirement": "原始规则 R032（第08节）：T=已核留学本科一学期累计假期；F=非该学段；U=校历与区间算法未知；SRC-003 §23、SRC-020/021（新工作办法待核）；F005/F009/F015–F017/F035；M017/M018；2022文本“达6周及以上原则上应办理休学或退学”；T3历史记录，先核该文本在事件日效力，人工处理“原则上”例外；2025新规影响未明确→POLICYUNCONFIRMED；如确认旧阈值在发生时有效且算法已核，达阈值仅NEEDSHUMANDECISION／国际交流与学籍部门，不由模型二选一。仅输出可追溯事实、补件建议或待人工复核；不得自动形成学校正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r033",
          "title": "研究生拟核学期累计或病假过长",
          "requirement": "原始规则 R033（第08节）：T=研究生拟核学期累计或病假过长；F=本科或非适用；U=2024新规主文本未知；SRC-002（历史）／SRC-017–019；F005/F006/F009/F035/F050；M017/M023；可记录历史假段、去重后的原始时长；不直接使用2021版“>6周”判2026规则或决定休学；固定 POLICYUNCONFIRMED／研究生院取成理校研〔2024〕29号，再由 S01 处理；无原台账先 SOURCEUNAVAILABLE。仅输出可追溯事实、补件建议或待人工复核；不得自动形成学校正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r034",
          "title": "请求免考／缓考／成绩更改",
          "requirement": "原始规则 R034（第08节）：T=请求免考／缓考／成绩更改；F=仅请假事实；U=权威考试决定不明；SRC-001 §20、26、SRC-003 §26、SRC-014/015（目录已读，非校规）；F028/F029/F049；M007/M018；比较请假期间、课表、考试日与另案正式决定；T3 S02 Owner事件，不能把考勤建议升级为考试许可；缓考路由 S02-T01，旷课处理交教务／任课教师；不同事项目的→本案 NOTAPPLICABLE。仅输出可追溯事实、补件建议或待人工复核；不得自动形成学校正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r035",
          "title": "出现休复学、团队安全、出国任务、差旅核销、住宿决定",
          "requirement": "原始规则 R035（第08节）：T=出现休复学、团队安全、出国任务、差旅核销、住宿决定；F=纯个人请假；U=外部源断连；SRC-001/003/011/014–016；F007/F049/F050；M001/M018；只读取原业务签发人、适用人、时间、状态和决定 ID，T3；G50技术事实 PASSFACT 不等于学校决策事件；出处不明→SOURCEUNAVAILABLE，真伪或权属未核→NEEDSHUMANDECISION；绝不双写外部决定。仅输出可追溯事实、补件建议或待人工复核；不得自动形成学校正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        }
      ]
    },
    {
      "id": "rules-08-5",
      "name": "08.5 版本变更与争议入口",
      "description": "映射自原始研究模板第08节；仅供事实核验与人工复核，不代表校方授权。",
      "order": 4,
      "required": true,
      "criteria": [
        {
          "id": "r036",
          "title": "有附件替换或事实更正",
          "requirement": "原始规则 R036（第08节）：T=有附件替换或事实更正；F=未变更；U=替换关系未知；SRC-001/003/008（政策与平台参考）；F001/F012/F015/F016/F047/F048；M003/M008/M014/M022；校验原件 hash、受影响页／字段、旧新版本与案件／人／假段归属；仅重跑依赖该 M/F 的 R，原事件及审计不变，T3版本元数据；新材料不会自动撤销既有校方批准；新旧冲突→CONFLICT／业务 Owner；旧AI结论标历史失效待重审。仅输出可追溯事实、补件建议或待人工复核；不得自动形成学校正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r037",
          "title": "本人提出撤回或更正",
          "requirement": "原始规则 R037（第08节）：T=本人提出撤回或更正；F=无此请求；U=申请／决定处于哪个节点不明；SRC-008（通用平台中止并非本案制度）、SRC-001/019；F001/F012/F030/F045/F047/F048；M006/M021/M022/M023；核本人请求、原案件 ID、接受请求者及办理时点；区分决前请求、决后请求校方更正／撤销；签收T2/3；本案撤回法定权限与生效规则未核，POLICYUNCONFIRMED／原归口；不因按钮点击删除既有决定。仅输出可追溯事实、补件建议或待人工复核；不得自动形成学校正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r038",
          "title": "对个人请假处理提出异议／复核",
          "requirement": "原始规则 R038（第08节）：T=对个人请假处理提出异议／复核；F=无争议；U=应适用的程序类型不明；SRC-001/002（学籍申诉不泛化）、SRC-003第70条、SRC-008/010/019；F001/F030/F046/F050；M006/M021/M023；核申请人、原决定、理由、接收人及学校实际受理程序；T2/3原决与提交记录；重大学籍处分走各自申诉法，不与普通准假混同；缺现行普通准假复核条款→POLICYUNCONFIRMED／有权学校部门；原准假决定仍保持正式效力直至合法更正。仅输出可追溯事实、补件建议或待人工复核；不得自动形成学校正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        }
      ]
    }
  ],
  "policyVersionIds": [],
  "stages": [
    {
      "id": "L0",
      "name": "L0 可信身份与适用性",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "L1",
      "workflowOwner": "local",
      "skippableReason": "按原模板适用身份/阶段触发；未触发时由人工标记不适用。政策、权限或正式决定未确认时转人工复核。"
    },
    {
      "id": "L1",
      "name": "L1 首次申请",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "L2",
      "workflowOwner": "local",
      "skippableReason": "按原模板适用身份/阶段触发；未触发时由人工标记不适用。政策、权限或正式决定未确认时转人工复核。"
    },
    {
      "id": "L2",
      "name": "L2 事实核验",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "L3",
      "workflowOwner": "local",
      "skippableReason": "按原模板适用身份/阶段触发；未触发时由人工标记不适用。政策、权限或正式决定未确认时转人工复核。"
    },
    {
      "id": "L3",
      "name": "L3 补正与不可抗力追认",
      "kind": "supplement-wait",
      "executorRole": "reviewer",
      "nextStageId": "L4",
      "workflowOwner": "local",
      "skippableReason": "按原模板适用身份/阶段触发；未触发时由人工标记不适用。政策、权限或正式决定未确认时转人工复核。"
    },
    {
      "id": "L4",
      "name": "L4 有权人员决定（仅核验外部权威决定，不由本地模板生成）",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "L5",
      "workflowOwner": "local",
      "skippableReason": "按原模板适用身份/阶段触发；未触发时由人工标记不适用。政策、权限或正式决定未确认时转人工复核。"
    },
    {
      "id": "L5",
      "name": "L5 执行／续假",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "L6",
      "workflowOwner": "local",
      "skippableReason": "按原模板适用身份/阶段触发；未触发时由人工标记不适用。政策、权限或正式决定未确认时转人工复核。"
    },
    {
      "id": "L6",
      "name": "L6 返校、销假",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "L7",
      "workflowOwner": "local",
      "skippableReason": "按原模板适用身份/阶段触发；未触发时由人工标记不适用。政策、权限或正式决定未确认时转人工复核。"
    },
    {
      "id": "L7",
      "name": "L7 纠错／转办／争议",
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
  "templateId": "S04-T01",
  "name": "学生请假、长短期病假、续假、销假与返校核验",
  "officialSchoolTemplate": false,
  "researchStatus": "RESEARCH_HANDOFF_READY",
  "policyEvidenceStatus": "PARTIAL",
  "researchAsOf": "2026-10-24",
  "sourceSnapshot": "2026-10-23（当前可访问的最新正式 MD）",
  "sourceDocumentPath": "docs/design/review-agent/business-templates/R02/S04-T01.md",
  "sourceDocumentSha256": "ec13e4765f64fab7c67f4196e419c871b9ba07689a6d8bbd77942ed88a89197a",
  "sourceDocumentBytes": 162160,
  "originalSourcePath": "docs/design/review-agent/business-templates/R02/research-original/S04-T01.md",
  "originalSourceBlobSha1": "c0871e7b92e6fa9d953a57d3e2d0472f4e025670",
  "lineEndingNormalization": "Source snapshot had no terminal LF; one LF appended to match manifest bytes/SHA-256. No semantic text changed.",
  "sources": [
    {
      "id": "SRC-001",
      "title": "原稿引用 SRC-001；来源索引未解析",
      "sourceKind": "unconfirmed",
      "evidenceStatus": "UNCONFIRMED",
      "note": "原文规则引用该 SRC ID，但来源索引未能定位独立条目。"
    },
    {
      "id": "SRC-003",
      "title": "原稿引用 SRC-003；来源索引未解析",
      "sourceKind": "unconfirmed",
      "evidenceStatus": "UNCONFIRMED",
      "note": "原文规则引用该 SRC ID，但来源索引未能定位独立条目。"
    },
    {
      "id": "SRC-007",
      "title": "原稿引用 SRC-007；来源索引未解析",
      "sourceKind": "unconfirmed",
      "evidenceStatus": "UNCONFIRMED",
      "note": "原文规则引用该 SRC ID，但来源索引未能定位独立条目。"
    },
    {
      "id": "SRC-017",
      "title": "原稿引用 SRC-017；来源索引未解析",
      "sourceKind": "unconfirmed",
      "evidenceStatus": "UNCONFIRMED",
      "note": "原文规则引用该 SRC ID，但来源索引未能定位独立条目。"
    },
    {
      "id": "SRC-019–021",
      "title": "原稿引用 SRC-019–021；来源索引未解析",
      "sourceKind": "unconfirmed",
      "evidenceStatus": "UNCONFIRMED",
      "note": "原文规则引用该 SRC ID，但来源索引未能定位独立条目。"
    },
    {
      "id": "SRC-010",
      "title": "原稿引用 SRC-010；来源索引未解析",
      "sourceKind": "unconfirmed",
      "evidenceStatus": "UNCONFIRMED",
      "note": "原文规则引用该 SRC ID，但来源索引未能定位独立条目。"
    },
    {
      "id": "SRC-019",
      "title": "原稿引用 SRC-019；来源索引未解析",
      "sourceKind": "unconfirmed",
      "evidenceStatus": "UNCONFIRMED",
      "note": "原文规则引用该 SRC ID，但来源索引未能定位独立条目。"
    },
    {
      "id": "SRC-008",
      "title": "原稿引用 SRC-008；来源索引未解析",
      "sourceKind": "unconfirmed",
      "evidenceStatus": "UNCONFIRMED",
      "note": "原文规则引用该 SRC ID，但来源索引未能定位独立条目。"
    },
    {
      "id": "SRC-004",
      "title": "原稿引用 SRC-004；来源索引未解析",
      "sourceKind": "unconfirmed",
      "evidenceStatus": "UNCONFIRMED",
      "note": "原文规则引用该 SRC ID，但来源索引未能定位独立条目。"
    },
    {
      "id": "SRC-006",
      "title": "原稿引用 SRC-006；来源索引未解析",
      "sourceKind": "unconfirmed",
      "evidenceStatus": "UNCONFIRMED",
      "note": "原文规则引用该 SRC ID，但来源索引未能定位独立条目。"
    },
    {
      "id": "SRC-013",
      "title": "原稿引用 SRC-013；来源索引未解析",
      "sourceKind": "unconfirmed",
      "evidenceStatus": "UNCONFIRMED",
      "note": "原文规则引用该 SRC ID，但来源索引未能定位独立条目。"
    },
    {
      "id": "SRC-009",
      "title": "原稿引用 SRC-009；来源索引未解析",
      "sourceKind": "unconfirmed",
      "evidenceStatus": "UNCONFIRMED",
      "note": "原文规则引用该 SRC ID，但来源索引未能定位独立条目。"
    },
    {
      "id": "SRC-005",
      "title": "原稿引用 SRC-005；来源索引未解析",
      "sourceKind": "unconfirmed",
      "evidenceStatus": "UNCONFIRMED",
      "note": "原文规则引用该 SRC ID，但来源索引未能定位独立条目。"
    },
    {
      "id": "SRC-002",
      "title": "原稿引用 SRC-002；来源索引未解析",
      "sourceKind": "unconfirmed",
      "evidenceStatus": "UNCONFIRMED",
      "note": "原文规则引用该 SRC ID，但来源索引未能定位独立条目。"
    },
    {
      "id": "SRC-018",
      "title": "原稿引用 SRC-018；来源索引未解析",
      "sourceKind": "unconfirmed",
      "evidenceStatus": "UNCONFIRMED",
      "note": "原文规则引用该 SRC ID，但来源索引未能定位独立条目。"
    },
    {
      "id": "SRC-012",
      "title": "原稿引用 SRC-012；来源索引未解析",
      "sourceKind": "unconfirmed",
      "evidenceStatus": "UNCONFIRMED",
      "note": "原文规则引用该 SRC ID，但来源索引未能定位独立条目。"
    },
    {
      "id": "SRC-016",
      "title": "原稿引用 SRC-016；来源索引未解析",
      "sourceKind": "unconfirmed",
      "evidenceStatus": "UNCONFIRMED",
      "note": "原文规则引用该 SRC ID，但来源索引未能定位独立条目。"
    },
    {
      "id": "SRC-020",
      "title": "原稿引用 SRC-020；来源索引未解析",
      "sourceKind": "unconfirmed",
      "evidenceStatus": "UNCONFIRMED",
      "note": "原文规则引用该 SRC ID，但来源索引未能定位独立条目。"
    },
    {
      "id": "SRC-021",
      "title": "原稿引用 SRC-021；来源索引未解析",
      "sourceKind": "unconfirmed",
      "evidenceStatus": "UNCONFIRMED",
      "note": "原文规则引用该 SRC ID，但来源索引未能定位独立条目。"
    },
    {
      "id": "SRC-022",
      "title": "原稿引用 SRC-022；来源索引未解析",
      "sourceKind": "unconfirmed",
      "evidenceStatus": "UNCONFIRMED",
      "note": "原文规则引用该 SRC ID，但来源索引未能定位独立条目。"
    },
    {
      "id": "SRC-014",
      "title": "原稿引用 SRC-014；来源索引未解析",
      "sourceKind": "unconfirmed",
      "evidenceStatus": "UNCONFIRMED",
      "note": "原文规则引用该 SRC ID，但来源索引未能定位独立条目。"
    },
    {
      "id": "SRC-015",
      "title": "原稿引用 SRC-015；来源索引未解析",
      "sourceKind": "unconfirmed",
      "evidenceStatus": "UNCONFIRMED",
      "note": "原文规则引用该 SRC ID，但来源索引未能定位独立条目。"
    },
    {
      "id": "SRC-011",
      "title": "原稿引用 SRC-011；来源索引未解析",
      "sourceKind": "unconfirmed",
      "evidenceStatus": "UNCONFIRMED",
      "note": "原文规则引用该 SRC ID，但来源索引未能定位独立条目。"
    },
    {
      "id": "SRC-014–016",
      "title": "原稿引用 SRC-014–016；来源索引未解析",
      "sourceKind": "unconfirmed",
      "evidenceStatus": "UNCONFIRMED",
      "note": "原文规则引用该 SRC ID，但来源索引未能定位独立条目。"
    }
  ],
  "criteria": [
    {
      "sectionId": "rules-08-2",
      "criterionId": "r001",
      "ruleId": "R001",
      "sourceIds": [
        "SRC-001",
        "SRC-003",
        "SRC-007",
        "SRC-017",
        "SRC-019–021"
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
        "SRC-003",
        "SRC-010"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "execution": "manual"
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "r003",
      "ruleId": "R003",
      "sourceIds": [
        "SRC-001",
        "SRC-003",
        "SRC-017",
        "SRC-019"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "execution": "manual"
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "r004",
      "ruleId": "R004",
      "sourceIds": [
        "SRC-001",
        "SRC-008"
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
        "SRC-003",
        "SRC-004"
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
        "SRC-003",
        "SRC-004"
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
        "SRC-003",
        "SRC-004",
        "SRC-007",
        "SRC-008"
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
        "SRC-003",
        "SRC-006",
        "SRC-013"
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
        "SRC-001",
        "SRC-009"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "execution": "manual"
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "r011",
      "ruleId": "R011",
      "sourceIds": [
        "SRC-001",
        "SRC-003"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "execution": "manual"
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "r012",
      "ruleId": "R012",
      "sourceIds": [
        "SRC-001",
        "SRC-003"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "execution": "manual"
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "r013",
      "ruleId": "R013",
      "sourceIds": [
        "SRC-001",
        "SRC-003"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "execution": "manual"
    },
    {
      "sectionId": "rules-08-3",
      "criterionId": "r014",
      "ruleId": "R014",
      "sourceIds": [
        "SRC-001",
        "SRC-003",
        "SRC-004",
        "SRC-019"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "execution": "manual"
    },
    {
      "sectionId": "rules-08-3",
      "criterionId": "r015",
      "ruleId": "R015",
      "sourceIds": [
        "SRC-001",
        "SRC-003"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "execution": "manual"
    },
    {
      "sectionId": "rules-08-3",
      "criterionId": "r016",
      "ruleId": "R016",
      "sourceIds": [
        "SRC-001",
        "SRC-003"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "execution": "manual"
    },
    {
      "sectionId": "rules-08-3",
      "criterionId": "r017",
      "ruleId": "R017",
      "sourceIds": [
        "SRC-001",
        "SRC-003"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "execution": "manual"
    },
    {
      "sectionId": "rules-08-3",
      "criterionId": "r018",
      "ruleId": "R018",
      "sourceIds": [
        "SRC-001",
        "SRC-003",
        "SRC-019"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "execution": "manual"
    },
    {
      "sectionId": "rules-08-3",
      "criterionId": "r019",
      "ruleId": "R019",
      "sourceIds": [
        "SRC-001",
        "SRC-004",
        "SRC-003"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "execution": "manual"
    },
    {
      "sectionId": "rules-08-3",
      "criterionId": "r020",
      "ruleId": "R020",
      "sourceIds": [
        "SRC-001",
        "SRC-004",
        "SRC-005"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "execution": "manual"
    },
    {
      "sectionId": "rules-08-3",
      "criterionId": "r021",
      "ruleId": "R021",
      "sourceIds": [
        "SRC-001",
        "SRC-004"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "execution": "manual"
    },
    {
      "sectionId": "rules-08-3",
      "criterionId": "r022",
      "ruleId": "R022",
      "sourceIds": [
        "SRC-005"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "execution": "manual"
    },
    {
      "sectionId": "rules-08-4",
      "criterionId": "r023",
      "ruleId": "R023",
      "sourceIds": [
        "SRC-002",
        "SRC-017",
        "SRC-018",
        "SRC-019"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "execution": "manual"
    },
    {
      "sectionId": "rules-08-4",
      "criterionId": "r024",
      "ruleId": "R024",
      "sourceIds": [
        "SRC-004",
        "SRC-012"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "execution": "manual"
    },
    {
      "sectionId": "rules-08-4",
      "criterionId": "r025",
      "ruleId": "R025",
      "sourceIds": [
        "SRC-004"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "execution": "manual"
    },
    {
      "sectionId": "rules-08-4",
      "criterionId": "r026",
      "ruleId": "R026",
      "sourceIds": [
        "SRC-004",
        "SRC-012",
        "SRC-016"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "execution": "manual"
    },
    {
      "sectionId": "rules-08-4",
      "criterionId": "r027",
      "ruleId": "R027",
      "sourceIds": [
        "SRC-003",
        "SRC-020",
        "SRC-021"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "execution": "manual"
    },
    {
      "sectionId": "rules-08-4",
      "criterionId": "r028",
      "ruleId": "R028",
      "sourceIds": [
        "SRC-003",
        "SRC-006",
        "SRC-013",
        "SRC-020",
        "SRC-021",
        "SRC-022"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "execution": "manual"
    },
    {
      "sectionId": "rules-08-4",
      "criterionId": "r029",
      "ruleId": "R029",
      "sourceIds": [
        "SRC-003",
        "SRC-020"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "execution": "manual"
    },
    {
      "sectionId": "rules-08-4",
      "criterionId": "r030",
      "ruleId": "R030",
      "sourceIds": [
        "SRC-003",
        "SRC-006",
        "SRC-013",
        "SRC-020",
        "SRC-022"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "execution": "manual"
    },
    {
      "sectionId": "rules-08-4",
      "criterionId": "r031",
      "ruleId": "R031",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "execution": "manual"
    },
    {
      "sectionId": "rules-08-4",
      "criterionId": "r032",
      "ruleId": "R032",
      "sourceIds": [
        "SRC-003",
        "SRC-020",
        "SRC-021"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "execution": "manual"
    },
    {
      "sectionId": "rules-08-4",
      "criterionId": "r033",
      "ruleId": "R033",
      "sourceIds": [
        "SRC-002",
        "SRC-017",
        "SRC-018",
        "SRC-019"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "execution": "manual"
    },
    {
      "sectionId": "rules-08-4",
      "criterionId": "r034",
      "ruleId": "R034",
      "sourceIds": [
        "SRC-001",
        "SRC-003",
        "SRC-014",
        "SRC-015"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "execution": "manual"
    },
    {
      "sectionId": "rules-08-4",
      "criterionId": "r035",
      "ruleId": "R035",
      "sourceIds": [
        "SRC-001",
        "SRC-003",
        "SRC-011",
        "SRC-014–016"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "execution": "manual"
    },
    {
      "sectionId": "rules-08-5",
      "criterionId": "r036",
      "ruleId": "R036",
      "sourceIds": [
        "SRC-001",
        "SRC-003",
        "SRC-008"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "execution": "manual"
    },
    {
      "sectionId": "rules-08-5",
      "criterionId": "r037",
      "ruleId": "R037",
      "sourceIds": [
        "SRC-008",
        "SRC-001",
        "SRC-019"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "execution": "manual"
    },
    {
      "sectionId": "rules-08-5",
      "criterionId": "r038",
      "ruleId": "R038",
      "sourceIds": [
        "SRC-001",
        "SRC-002",
        "SRC-003",
        "SRC-008",
        "SRC-010",
        "SRC-019"
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
