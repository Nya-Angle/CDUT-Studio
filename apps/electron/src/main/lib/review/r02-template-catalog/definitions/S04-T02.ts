import type { TemplateVersion } from '@profer/shared'

export type R02EvidenceStatus = 'VERIFIED' | 'PARTIAL' | 'UNCONFIRMED'
export interface R02SourceMetadata { id: string; title: string; url?: string; sourceKind: string; evidenceStatus: R02EvidenceStatus; note: string }
export interface R02CriterionMetadata { sectionId: string; criterionId: string; ruleId: string; sourceIds: string[]; evidenceStatus: R02EvidenceStatus; execution: 'semantic' | 'manual' }
export interface R02TemplateMetadata { batchId: string; templateId: string; name: string; officialSchoolTemplate: false; researchStatus: string; policyEvidenceStatus: R02EvidenceStatus; researchAsOf: string; sourceSnapshot: string; sourceDocumentPath: string; sourceDocumentSha256: string; sourceDocumentBytes: number; originalSourcePath: string; originalSourceBlobSha1: string; lineEndingNormalization: string; sources: R02SourceMetadata[]; criteria: R02CriterionMetadata[]; reviewNotes: string[] }

export const templateVersion: TemplateVersion = {
  "templateId": "S04-T02",
  "version": 1,
  "schemaVersion": 2,
  "name": "校外住宿与安全责任申请审核",
  "description": "本地研究模板 · 非校方正式模板。校外住宿与安全责任申请审核；仅核验事实、材料与分阶段流程，不产生学校正式批准/拒绝。政策证据状态：PARTIAL。",
  "catalogKind": "builtin",
  "sourceNote": "R02_RESEARCH_TEMPLATE_NONOFFICIAL: 本模板由 R02 研究原稿映射而来，非校方正式模板；SRC 为研究来源索引而非案卷 SourceRef；校规现行性、校区/学段范围、审批授权和办理系统未全部确认。正式决定必须由经学校确认的有权人员在真实校方流程中作出，本地 Agent 不得生成学校远端回写。",
  "objectType": "person",
  "displayName": {
    "template": "校外住宿与安全责任申请审核（本地案卷）"
  },
  "fields": [
    {
      "key": "F001",
      "label": "F001 · casekey（string；D）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原始字段字典：F001；casekey（string；D）；Case / L0；内：案卷唯一键和创建事件；不来自纸质申请表；P0；内部必须生成，失败停止案卷链接。缺失是否构成补件须按当前阶段与已确认政策人工核验。"
    },
    {
      "key": "F002",
      "label": "F002 · studentid（string；A）",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "原始字段字典：F002；studentid（string；A）；Person / L0；校：M001 学籍记录；申：M003/004/005 陈述作比对；P1；校缺 SU；申请表与学籍冲突 CONFLICT。缺失是否构成补件须按当前阶段与已确认政策人工核验。"
    },
    {
      "key": "F003",
      "label": "F003 · studentname（string；A）",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "原始字段字典：F003；studentname（string；A）；Person / L0–L1；校：M001；申：M003/004/005；具体表栏位待核；P1；申表缺 NM、校缺 SU；同音/拼音人工 HU。缺失是否构成补件须按当前阶段与已确认政策人工核验。"
    },
    {
      "key": "F004",
      "label": "F004 · educationlevel（enum 本科/硕士/博士/非学历/其他；A）",
      "kind": "enum",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "原始字段字典：F004；educationlevel（enum 本科/硕士/博士/非学历/其他；A）；Person / L0；校：M001；SRC-001/002 的身份适用范围；P1；校缺 SU；学生自填不独立确权。缺失是否构成补件须按当前阶段与已确认政策人工核验。",
      "options": [
        {
          "value": "本科",
          "label": "本科"
        },
        {
          "value": "硕士",
          "label": "硕士"
        },
        {
          "value": "博士",
          "label": "博士"
        },
        {
          "value": "非学历",
          "label": "非学历"
        },
        {
          "value": "其他",
          "label": "其他"
        }
      ]
    },
    {
      "key": "F005",
      "label": "F005 · studentidentitybranch（enum 国内/外国留学生/港澳台/待定；D）",
      "kind": "enum",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "原始字段字典：F005；studentidentitybranch（enum 国内/外国留学生/港澳台/待定；D）；Person / L0；校：M001、国际学生 M005/M017；SRC-002；P1；不明 PU+HU；不用姓名推断国籍。缺失是否构成补件须按当前阶段与已确认政策人工核验。",
      "options": [
        {
          "value": "国内",
          "label": "国内"
        },
        {
          "value": "外国留学生",
          "label": "外国留学生"
        },
        {
          "value": "港澳台",
          "label": "港澳台"
        },
        {
          "value": "待定",
          "label": "待定"
        }
      ]
    },
    {
      "key": "F006",
      "label": "F006 · campuscode（string/enum；U）",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "原始字段字典：F006；campuscode（string/enum；U）；Person / L0；校：M001；校区权限见 SRC-001 限制；P1；校缺 SU；宜宾等 PU。缺失是否构成补件须按当前阶段与已确认政策人工核验。"
    },
    {
      "key": "F007",
      "label": "F007 · collegeid（string；A）",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "原始字段字典：F007；collegeid（string；A）；Person / L0–L2；校：M001，院：M010/M013；P1；校缺 SU；学院变更 CONFLICT 先核有效时点。缺失是否构成补件须按当前阶段与已确认政策人工核验。"
    },
    {
      "key": "F008",
      "label": "F008 · enrollmentstatus（enum 在校/休学/退学/未确定等；D）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原始字段字典：F008；enrollmentstatus（enum 在校/休学/退学/未确定等；D）；Person / L0；校：M001，S01 权威结论；P1；SU；不可用学生声明代替。缺失是否构成补件须按当前阶段与已确认政策人工核验。"
    },
    {
      "key": "F009",
      "label": "F009 · applicationacademicyear（string；A）",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "原始字段字典：F009；applicationacademicyear（string；A）；Application / L0–L1；校本当期学年配置、M003/004/005 及 M012；SRC-001；P1；当期学年口径未知 PU，跨年旧批复不得替代。缺失是否构成补件须按当前阶段与已确认政策人工核验。"
    },
    {
      "key": "F010",
      "label": "F010 · applicationkind（enum 首次/重办/补件/变更等；D）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原始字段字典：F010；applicationkind（enum 首次/重办/补件/变更等；D）；Application / L1；申：M003/004/005；内：案卷事件；P1；不明人工分类 HU，不新立模板。缺失是否构成补件须按当前阶段与已确认政策人工核验。"
    },
    {
      "key": "F011",
      "label": "F011 · submittedat（datetime；D）",
      "kind": "date",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "原始字段字典：F011；submittedat（datetime；D）；Application / L1；内：可靠受理事件；纸质实际受理日期按 M003/004/005 另核；P1；时间无法证明则 PU/HU，不编造时限。缺失是否构成补件须按当前阶段与已确认政策人工核验。"
    },
    {
      "key": "F012",
      "label": "F012 · reasonstatement（text；A）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原始字段字典：F012；reasonstatement（text；A）；Application / L1；申：M003/004/005；附 M025 可选；SRC-001“特殊情况”；P2；申请事由空缺 NM；事由是否充分 HU。缺失是否构成补件须按当前阶段与已确认政策人工核验。"
    },
    {
      "key": "F013",
      "label": "F013 · requestedperiod（date-range；U）",
      "kind": "date",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "原始字段字典：F013；requestedperiod（date-range；U）；Application / L1；申：M003/004/005，如原表确有；SRC-001 学年有效；P1；原表不含该栏不得强制，超学年申请 PU+HU。缺失是否构成补件须按当前阶段与已确认政策人工核验。"
    },
    {
      "key": "F014",
      "label": "F014 · proposedaddress（text；U）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原始字段字典：F014；proposedaddress（text；U）；Residence / L1；申：M003/004/005 或 M008；当前表确切位置待核；P2；表单要求未证实时 PU；不能以“尚未入住”当不合格。缺失是否构成补件须按当前阶段与已确认政策人工核验。"
    },
    {
      "key": "F015",
      "label": "F015 · actualaddress（text；A/国际后续）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原始字段字典：F015；actualaddress（text；A/国际后续）；Residence / L6–L7；申：M019/M021/M022，警：M021；SRC-003/008；P2；实际未入住 NA；已入住登记冲突 CONFLICT。缺失是否构成补件须按当前阶段与已确认政策人工核验。"
    },
    {
      "key": "F016",
      "label": "F016 · housingrelationship（enum 自有/亲属/租住/其他/未知；A）",
      "kind": "enum",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原始字段字典：F016；housingrelationship（enum 自有/亲属/租住/其他/未知；A）；Residence / L1；申：M003/004、M008，房产 M009；SRC-001；P2；触发 M009 的分类待核 HU；未披露不可猜。缺失是否构成补件须按当前阶段与已确认政策人工核验。",
      "options": [
        {
          "value": "自有",
          "label": "自有"
        },
        {
          "value": "亲属",
          "label": "亲属"
        },
        {
          "value": "租住",
          "label": "租住"
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
      "key": "F017",
      "label": "F017 · houseownername（string；U）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原始字段字典：F017；houseownername（string；U）；Residence / L1；房主 M009/M008；若为国际租住则 M019；P2；无适用表栏 PU；需人工核证件对应关系。缺失是否构成补件须按当前阶段与已确认政策人工核验。"
    },
    {
      "key": "F018",
      "label": "F018 · applicantsafetyundertaking（enum 有/无/未核；A）",
      "kind": "enum",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "原始字段字典：F018；applicantsafetyundertaking（enum 有/无/未核；A）；Undertaking / 本科 L1，国际 L1；申：M006 或 M017；SRC-001/002；P1；对本科/国际对应分支 NM；签名真实性 HU。缺失是否构成补件须按当前阶段与已确认政策人工核验。",
      "options": [
        {
          "value": "有",
          "label": "有"
        },
        {
          "value": "无",
          "label": "无"
        },
        {
          "value": "未核",
          "label": "未核"
        }
      ]
    },
    {
      "key": "F019",
      "label": "F019 · housesafetyundertaking（enum 有/无/未核；A）",
      "kind": "enum",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原始字段字典：F019；housesafetyundertaking（enum 有/无/未核；A）；Undertaking / 本研 L1；申/房主：M008；SRC-001；P2；本研适用缺 NM，不能自动认证安全等级。缺失是否构成补件须按当前阶段与已确认政策人工核验。",
      "options": [
        {
          "value": "有",
          "label": "有"
        },
        {
          "value": "无",
          "label": "无"
        },
        {
          "value": "未核",
          "label": "未核"
        }
      ]
    },
    {
      "key": "F020",
      "label": "F020 · parentsignaturestate（enum 已见/缺/待验；A）",
      "kind": "enum",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原始字段字典：F020；parentsignaturestate（enum 已见/缺/待验；A）；ThirdParty / 本科 L1；申：M007；SRC-001；P2；本科缺 NM；签字归属/真伪 HU，研究生 NA。缺失是否构成补件须按当前阶段与已确认政策人工核验。",
      "options": [
        {
          "value": "已见",
          "label": "已见"
        },
        {
          "value": "缺",
          "label": "缺"
        },
        {
          "value": "待验",
          "label": "待验"
        }
      ]
    },
    {
      "key": "F021",
      "label": "F021 · parentidcopyref（document-ref；A）",
      "kind": "attachment",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原始字段字典：F021；parentidcopyref（document-ref；A）；ThirdParty / 本科 L1；申：M007；具体证件归属须取原表澄清；P2；本科缺 NM，避免存储多余身份证明字段。缺失是否构成补件须按当前阶段与已确认政策人工核验。"
    },
    {
      "key": "F022",
      "label": "F022 · emergencycontact（struct；U）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原始字段字典：F022；emergencycontact（struct；U）；ThirdParty / L1 或后续；申：只有原表/当期规则要求才从 M003/004/005 提取；P2；不作硬条件，PU；真实性与联系权限 HU。缺失是否构成补件须按当前阶段与已确认政策人工核验。"
    },
    {
      "key": "F023",
      "label": "F023 · bedassignmentstatus（enum 分配/未分配/未知；A）",
      "kind": "enum",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "原始字段字典：F023；bedassignmentstatus（enum 分配/未分配/未知；A）；Dorm / L0–L3；寓：M002；院：M010 备注作为辅证；P1；寓缺 SU；学生自报“未分配”不能直接豁免。缺失是否构成补件须按当前阶段与已确认政策人工核验。",
      "options": [
        {
          "value": "分配",
          "label": "分配"
        },
        {
          "value": "未分配",
          "label": "未分配"
        },
        {
          "value": "未知",
          "label": "未知"
        }
      ]
    },
    {
      "key": "F024",
      "label": "F024 · prioroffcampustime（date/interval；A）",
      "kind": "date",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "原始字段字典：F024；prioroffcampustime（date/interval；A）；DormHistory / L0–L2；寓：M012；院：M010 既往办理时间备注；P1；以真实历史核对；无记录 SU/HU。缺失是否构成补件须按当前阶段与已确认政策人工核验。"
    },
    {
      "key": "F025",
      "label": "F025 · dormexitstatus（enum 已退/待退/无床/未知；A）",
      "kind": "enum",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "原始字段字典：F025；dormexitstatus（enum 已退/待退/无床/未知；A）；Dorm / L3–L4；寓：M002/M011，历史 M012；P1；相关阶段缺 SU/NM；不按学生填写自行改床位。缺失是否构成补件须按当前阶段与已确认政策人工核验。",
      "options": [
        {
          "value": "已退",
          "label": "已退"
        },
        {
          "value": "待退",
          "label": "待退"
        },
        {
          "value": "无床",
          "label": "无床"
        },
        {
          "value": "未知",
          "label": "未知"
        }
      ]
    },
    {
      "key": "F026",
      "label": "F026 · dormexitslipref（document-ref；A）",
      "kind": "attachment",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "原始字段字典：F026；dormexitslipref（document-ref；A）；Dorm / L3–L4；寓：M011；SRC-001 明确例外；P1；需办退宿者 NM；已退/未分配等核实后 NA。缺失是否构成补件须按当前阶段与已确认政策人工核验。"
    },
    {
      "key": "F027",
      "label": "F027 · applicationformvariant（enum 本科/研究生/国际；A）",
      "kind": "enum",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "原始字段字典：F027；applicationformvariant（enum 本科/研究生/国际；A）；Application / L1；申：M003/004/005；表单版本/签名定位，SRC-001/004；P1；错用表 CONFLICT；国际附件未读 PU。缺失是否构成补件须按当前阶段与已确认政策人工核验。",
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
          "value": "国际",
          "label": "国际"
        }
      ]
    },
    {
      "key": "F028",
      "label": "F028 · collegedisposition（enum 批准/不批准/补正/未知；A）",
      "kind": "enum",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原始字段字典：F028；collegedisposition（enum 批准/不批准/补正/未知；A）；CollegeDecision / L2；院：M013；SRC-001/002；P1；L1 尚未产生 NA；L2 后无真决定 SU/HU。缺失是否构成补件须按当前阶段与已确认政策人工核验。",
      "options": [
        {
          "value": "批准",
          "label": "批准"
        },
        {
          "value": "不批准",
          "label": "不批准"
        },
        {
          "value": "补正",
          "label": "补正"
        },
        {
          "value": "未知",
          "label": "未知"
        }
      ]
    },
    {
      "key": "F029",
      "label": "F029 · collegeauthorizedactor（actor-ref；D）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原始字段字典：F029；collegeauthorizedactor（actor-ref；D）；CollegeDecision / L2；院：M013 与可信人员岗位授权记录；P1；仅图片姓名不可确权，缺 HU/SU。缺失是否构成补件须按当前阶段与已确认政策人工核验。"
    },
    {
      "key": "F030",
      "label": "F030 · collegedecidedat（datetime；D）",
      "kind": "date",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "原始字段字典：F030；collegedecidedat（datetime；D）；CollegeDecision / L2；院：M013 原件和正式记录；P1；未签 NA；伪造/不一致 CONFLICT。缺失是否构成补件须按当前阶段与已确认政策人工核验。"
    },
    {
      "key": "F031",
      "label": "F031 · rosterrowkey（string；D）",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "原始字段字典：F031；rosterrowkey（string；D）；CollegeRoster / L2–L3；院：M010 纸电子两份中对应序号；SRC-001；P1；漏行/错位 CONFLICT，不凭顺序误关联。缺失是否构成补件须按当前阶段与已确认政策人工核验。"
    },
    {
      "key": "F032",
      "label": "F032 · rostermediaconsistency（enum 一致/冲突/待核；D）",
      "kind": "enum",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "原始字段字典：F032；rostermediaconsistency（enum 一致/冲突/待核；D）；CollegeRoster / L3；院：M010 纸质盖章版与电子版；P1；纸电差异 CONFLICT，缺一 NM（到本阶段）。缺失是否构成补件须按当前阶段与已确认政策人工核验。",
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
      "key": "F033",
      "label": "F033 · housingcenterdisposition（enum 通过/未通过/待核；A）",
      "kind": "enum",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原始字段字典：F033；housingcenterdisposition（enum 通过/未通过/待核；A）；HousingDecision / L3；寓：M014；SRC-001；P1；L1/L2 NA；L3 无权威回执 SU。缺失是否构成补件须按当前阶段与已确认政策人工核验。",
      "options": [
        {
          "value": "通过",
          "label": "通过"
        },
        {
          "value": "未通过",
          "label": "未通过"
        },
        {
          "value": "待核",
          "label": "待核"
        }
      ]
    },
    {
      "key": "F034",
      "label": "F034 · housingcenteractortime（actor-ref+datetime；D）",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原始字段字典：F034；housingcenteractortime（actor-ref+datetime；D）；HousingDecision / L3；寓：M014 授权身份、时间与备案记录；P1；未签 NA；自报身份 HU/SU。缺失是否构成补件须按当前阶段与已确认政策人工核验。"
    },
    {
      "key": "F035",
      "label": "F035 · financerosterhandoff（ref+status；A）",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "原始字段字典：F035；financerosterhandoff（ref+status；A）；FinanceHandoff / L5；寓：M015；SRC-001；P1；L1–L3 NA，结果未达 SU。缺失是否构成补件须按当前阶段与已确认政策人工核验。"
    },
    {
      "key": "F036",
      "label": "F036 · financeadjustmentstatus（enum 已核减/未处理/异常；A）",
      "kind": "enum",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原始字段字典：F036；financeadjustmentstatus（enum 已核减/未处理/异常；A）；Finance / L5；财：M016；SRC-001；P1；不自行计算或办理，权威不可达 SU。缺失是否构成补件须按当前阶段与已确认政策人工核验。",
      "options": [
        {
          "value": "已核减",
          "label": "已核减"
        },
        {
          "value": "未处理",
          "label": "未处理"
        },
        {
          "value": "异常",
          "label": "异常"
        }
      ]
    },
    {
      "key": "F037",
      "label": "F037 · internationalofficedisposition（enum 批准/登记/未知；U）",
      "kind": "enum",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原始字段字典：F037；internationalofficedisposition（enum 批准/登记/未知；U）；IntlOffice / L2；国：M018；2025 操作指南 SRC-003；P1；与学院实际权限衔接未定 PU+HU。缺失是否构成补件须按当前阶段与已确认政策人工核验。",
      "options": [
        {
          "value": "批准",
          "label": "批准"
        },
        {
          "value": "登记",
          "label": "登记"
        },
        {
          "value": "未知",
          "label": "未知"
        }
      ]
    },
    {
      "key": "F038",
      "label": "F038 · internationalofficeactortime（actor-ref+datetime；D）",
      "kind": "date",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "原始字段字典：F038；internationalofficeactortime（actor-ref+datetime；D）；IntlOffice / L2；国：M018 真实经办信息；P1；不能凭页面角色自报，缺 SU/HU。缺失是否构成补件须按当前阶段与已确认政策人工核验。"
    },
    {
      "key": "F039",
      "label": "F039 · policeregistrationref（document-ref；A/国际后续）",
      "kind": "attachment",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原始字段字典：F039；policeregistrationref（document-ref；A/国际后续）；PoliceRegister / L6；警：M021；SRC-003/008；P2；住房尚未入住 NA；入住后材料缺 NM，真伪 HU。缺失是否构成补件须按当前阶段与已确认政策人工核验。"
    },
    {
      "key": "F040",
      "label": "F040 · policeregisteredaddressdate（address+datetime；A/国际后续）",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原始字段字典：F040；policeregisteredaddressdate（address+datetime；A/国际后续）；PoliceRegister / L6；警：M021 与 F015 实际地址交叉核对；P2；地址冲突 CONFLICT；不自动判行政违法。缺失是否构成补件须按当前阶段与已确认政策人工核验。"
    },
    {
      "key": "F041",
      "label": "F041 · internationaltenancyref（document-ref；A/2025指南）",
      "kind": "attachment",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原始字段字典：F041；internationaltenancyref（document-ref；A/2025指南）；IntlResidence / L6；申：M019 租赁合同复印件；SRC-003；P2；仅符合已入住租住情形；2026 当前口径 PU。缺失是否构成补件须按当前阶段与已确认政策人工核验。"
    },
    {
      "key": "F042",
      "label": "F042 · landlordcontact（struct；A/2025指南）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原始字段字典：F042；landlordcontact（struct；A/2025指南）；IntlResidence / L6；申/房东：M020；SRC-003；P2；2026 口径 PU；缺件与隐私交人工核定。缺失是否构成补件须按当前阶段与已确认政策人工核验。"
    },
    {
      "key": "F043",
      "label": "F043 · addresschangenotifiedat（datetime；A/2025指南）",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原始字段字典：F043；addresschangenotifiedat（datetime；A/2025指南）；IntlMaintenance / L7；国：M022 收件记录；SRC-003；P2；变更未发生 NA；已变更但没记录 SU/HU。缺失是否构成补件须按当前阶段与已确认政策人工核验。"
    },
    {
      "key": "F044",
      "label": "F044 · withdrawalrequest（ref+datetime；D）",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原始字段字典：F044；withdrawalrequest（ref+datetime；D）；CaseEvent / C13；申：M023；原部门是否接收另留决定；P1；无请求 NA；有效性 PU/HU。缺失是否构成补件须按当前阶段与已确认政策人工核验。"
    },
    {
      "key": "F045",
      "label": "F045 · reviewrequest（ref+datetime；D）",
      "kind": "date",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "原始字段字典：F045；reviewrequest（ref+datetime；D）；CaseEvent / C14；申：M024 与后续 M028；P1；无请求 NA；复核权限/期限 PU/HU。缺失是否构成补件须按当前阶段与已确认政策人工核验。"
    },
    {
      "key": "F046",
      "label": "F046 · materialrevision（version-id；D）",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "原始字段字典：F046；materialrevision（version-id；D）；Evidence / 每次变更；内：M001–M028 实际材料快照/替换链；P0；无版本禁止复用旧结果；关联错误 CONFLICT。缺失是否构成补件须按当前阶段与已确认政策人工核验。"
    },
    {
      "key": "F047",
      "label": "F047 · policysnapshotref（source-id+date；D）",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原始字段字典：F047；policysnapshotref（source-id+date；D）；Policy / L0及每次复核；内：SRC-001–009 的已核原文/状态；P0；来源过期 PU，来源不可达 SU。缺失是否构成补件须按当前阶段与已确认政策人工核验。"
    },
    {
      "key": "F048",
      "label": "F048 · caserevision（positive integer；D）",
      "kind": "number",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原始字段字典：F048；caserevision（positive integer；D）；Case / 全程；内：案卷 CAS 版本和事件日志（目标设计，非实现声明）；P0；并发冲突停止写入/人工处理。缺失是否构成补件须按当前阶段与已确认政策人工核验。"
    },
    {
      "key": "F049",
      "label": "F049 · evidencelocator（source-id+page/span/hash；D）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原始字段字典：F049；evidencelocator（source-id+page/span/hash；D）；Evidence / 所有证据；内：M 槽的源文件、页码、文本定位、指纹；P0/P2；无定位不得给可追溯 PASSFACT。缺失是否构成补件须按当前阶段与已确认政策人工核验。"
    },
    {
      "key": "F050",
      "label": "F050 · representationauthorityref（document-ref；U）",
      "kind": "attachment",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原始字段字典：F050；representationauthorityref（document-ref；U）；Representation / 有代理诉求时；申：M027；校本授权规则未取得；P2；不自动接受代理；PU+HU，不作普遍必交。缺失是否构成补件须按当前阶段与已确认政策人工核验。"
    }
  ],
  "materialSlots": [
    {
      "id": "M001",
      "name": "M001 · 核学生身份、姓名、学院、学段、注册/学籍、校区；学校学籍主管部门；权威学籍记录",
      "purpose": "来源模板材料槽：M001；核学生身份、姓名、学院、学段、注册/学籍、校区；学校学籍主管部门；权威学籍记录；E@L0，应优先学校可信读取或经办人核验；无接口不迫使学生提交截图冒充权威；F002–F008、F009；SRC-001/002/007；学号+学籍生效时间+快照版本；不可达 SOURCEUNAVAILABLE，与申请表不符 CONFLICT。policyEvidenceStatus=PARTIAL；minCount=0 用于防止未经确认的缺件自动阻断，是否需要该材料由对应 criterion 在正确阶段人工核验。",
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
        "F009"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M002",
      "name": "M002 · 核是否分配床位、现住房及退宿状态；楼寓；权威宿舍台账",
      "purpose": "来源模板材料槽：M002；核是否分配床位、现住房及退宿状态；楼寓；权威宿舍台账；E@L0/L3–L4；身份分支/是否应交退宿单的前置核验；有权线下确认可替代自动接口；F023、F025、F026；SRC-001；宿舍分配周期+官方记录版本；不可达 SOURCEUNAVAILABLE，不可读人工核查。policyEvidenceStatus=PARTIAL；minCount=0 用于防止未经确认的缺件自动阻断，是否需要该材料由对应 criterion 在正确阶段人工核验。",
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
        "F023",
        "F025",
        "F026"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M003",
      "name": "M003 · 本科生本人提出校外住宿申请及理由；学生；《本科生校外住宿申请表》双面原件",
      "purpose": "来源模板材料槽：M003；本科生本人提出校外住宿申请及理由；学生；《本科生校外住宿申请表》双面原件；C@L1 普通本科；无已确认可替代表；不得用旧学年批准表替代；F002/003/009/010/012–014/027；SRC-001；本案+本学年+表单正反面+签字页/版本；缺 NEEDSMATERIAL，背面缺/不清 UNREADABLE。policyEvidenceStatus=PARTIAL；minCount=0 用于防止未经确认的缺件自动阻断，是否需要该材料由对应 criterion 在正确阶段人工核验。",
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
        "F002"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M004",
      "name": "M004 · 研究生本人提出外住申请；研究生；《研究生外住申请表》一式三份",
      "purpose": "来源模板材料槽：M004；研究生本人提出外住申请；研究生；《研究生外住申请表》一式三份；C@L1 研究生；是否可共用同一电子文档/扫描副本待学院确认；F002/003/009/010/012–014/027；SRC-001；本案+学年+三份纸件对应关系；缺 NEEDSMATERIAL，不清 UNREADABLE。policyEvidenceStatus=PARTIAL；minCount=0 用于防止未经确认的缺件自动阻断，是否需要该材料由对应 criterion 在正确阶段人工核验。",
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
        "F002"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M005",
      "name": "M005 · 国际学生本校专用外住申请；学生；2026 官方目录列存在的表单，附件原件尚未取得",
      "purpose": "来源模板材料槽：M005；国际学生本校专用外住申请；学生；2026 官方目录列存在的表单，附件原件尚未取得；U@L1（2026 有表单目录，不证明具体强制字段/份数）；须先取得学校 2026 表格，不能拿普通本研表强制替代；F002–F005/009/010/012–014/027；SRC-002/004；本案+国际学生身份+附件版本待核；政策不足 POLICYUNCONFIRMED，实际提交无法读 UNREADABLE。policyEvidenceStatus=PARTIAL；minCount=0 用于防止未经确认的缺件自动阻断，是否需要该材料由对应 criterion 在正确阶段人工核验。",
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
        "F005"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M006",
      "name": "M006 · 本科生接受校外住宿安全要求的承诺；本科生签署；《校外住宿安全承诺书》",
      "purpose": "来源模板材料槽：M006；本科生接受校外住宿安全要求的承诺；本科生签署；《校外住宿安全承诺书》；C@L1 普通本科；未见校方认可口头承诺替代；F018；SRC-001；学生签字人与本案/学年关联；缺 NEEDSMATERIAL，签名真伪人工核、不可读 UNREADABLE。policyEvidenceStatus=PARTIAL；minCount=0 用于防止未经确认的缺件自动阻断，是否需要该材料由对应 criterion 在正确阶段人工核验。",
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
        "F018"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M007",
      "name": "M007 · 本科生家长签字确认的身份证复印件；相关家长/申请人；清单所列纸件",
      "purpose": "来源模板材料槽：M007；本科生家长签字确认的身份证复印件；相关家长/申请人；清单所列纸件；C@L1 普通本科；身份证属于谁、家长签在何处尚待原表确认，不擅自推定法定监护关系；研究生 NOTAPPLICABLE；F020/021；SRC-001；证件载体与签字页同组；隐私 P2，缺 NEEDSMATERIAL、身份及签名疑点 NEEDSHUMANDECISION。policyEvidenceStatus=PARTIAL；minCount=0 用于防止未经确认的缺件自动阻断，是否需要该材料由对应 criterion 在正确阶段人工核验。",
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
        "F020"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M008",
      "name": "M008 · 校外住所房屋安全承诺；承诺人/房主按原件；《房屋安全承诺书》",
      "purpose": "来源模板材料槽：M008；校外住所房屋安全承诺；承诺人/房主按原件；《房屋安全承诺书》；C@L1 普通本科及研究生（校方清单列明）；国际学生是否另要此件未证，不自动复用；F016–F019；SRC-001；住址+承诺人+学年/版本；缺 NEEDSMATERIAL，不清 UNREADABLE；仅承诺不构成安全验收。policyEvidenceStatus=PARTIAL；minCount=0 用于防止未经确认的缺件自动阻断，是否需要该材料由对应 criterion 在正确阶段人工核验。",
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
        "F016",
        "F019"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M009",
      "name": "M009 · 证明住自有/亲属房的房产权属、房主确认；房主签字；房产证复印件",
      "purpose": "来源模板材料槽：M009；证明住自有/亲属房的房产权属、房主确认；房主签字；房产证复印件；K@L1 当 F016 为自有/亲属房；其他住所先 NOTAPPLICABLE；产权信息核对须有权来源/人工；F016/017/019；SRC-001；房主+房产地址+签字页版本，隐私 P2；触发后缺 NEEDSMATERIAL，地址/姓名冲突 CONFLICT。policyEvidenceStatus=PARTIAL；minCount=0 用于防止未经确认的缺件自动阻断，是否需要该材料由对应 criterion 在正确阶段人工核验。",
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
        "F016"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M010",
      "name": "M010 · 学院统一申报、逐人与表编号对齐；学院；签字盖章纸质及电子版外住申请汇总表",
      "purpose": "来源模板材料槽：M010；学院统一申报、逐人与表编号对齐；学院；签字盖章纸质及电子版外住申请汇总表；P@L2–L3 普通本/研由学院形成；提交楼寓时列明，不是学生 L1 必交；须核纸电两份及序号；F002/007/009/023/024/031/032；SRC-001；学院+学年+批次+行号+两种介质版本；缺/纸电不符 NEEDSMATERIAL/CONFLICT。policyEvidenceStatus=PARTIAL；minCount=0 用于防止未经确认的缺件自动阻断，是否需要该材料由对应 criterion 在正确阶段人工核验。",
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
        "F002"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M011",
      "name": "M011 · 对原校内床位完成退宿手续；楼寓/学生办理后持有；公寓退宿单",
      "purpose": "来源模板材料槽：M011；对原校内床位完成退宿手续；楼寓/学生办理后持有；公寓退宿单；K@L3/L4 针对需办理退宿者；已退宿本科/研究生或研究生未分配宿舍可按 SRC-001 免交，仍需 M002/M012/学院备注支持；F023/025/026；SRC-001；退宿单+床位关联；应交时缺 NEEDSMATERIAL；豁免已证记 NOTAPPLICABLE，不前置 L1。policyEvidenceStatus=PARTIAL；minCount=0 用于防止未经确认的缺件自动阻断，是否需要该材料由对应 criterion 在正确阶段人工核验。",
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
        "F023"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M012",
      "name": "M012 · 历史外住办理时间或已退宿/未分配理由；楼寓/学院；官方历史记录、M010 备注",
      "purpose": "来源模板材料槽：M012；历史外住办理时间或已退宿/未分配理由；楼寓/学院；官方历史记录、M010 备注；E/K@L0/L2 触发 C03/C04/C05；学院汇总表记“未分配宿舍”或旧办理时间；无接口可由学院核对；F023/024/025；SRC-001；学生+旧学年/日期+权威版本；无记录 SOURCEUNAVAILABLE，不得把申请人自行备注当确权。policyEvidenceStatus=PARTIAL；minCount=0 用于防止未经确认的缺件自动阻断，是否需要该材料由对应 criterion 在正确阶段人工核验。",
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
        "F023"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M013",
      "name": "M013 · 学院审核批准或处理意见；学院有权人；纸质签批/官方决定记录",
      "purpose": "来源模板材料槽：M013；学院审核批准或处理意见；学院有权人；纸质签批/官方决定记录；P@L2 在学生申请后形成；无已确认自动电子批准替代；F028/029/030；SRC-001/002；签发学院+actor+时间+申请快照；L1 不存在 NOTAPPLICABLE，L2 后失联 SOURCEUNAVAILABLE。policyEvidenceStatus=PARTIAL；minCount=0 用于防止未经确认的缺件自动阻断，是否需要该材料由对应 criterion 在正确阶段人工核验。",
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
        "F028"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M014",
      "name": "M014 · 楼寓服务中心审核、备案、核准名单来源；楼寓中心；官方审批备案回执/记录",
      "purpose": "来源模板材料槽：M014；楼寓服务中心审核、备案、核准名单来源；楼寓中心；官方审批备案回执/记录；P@L3 学院批准后的后勤节点，是否有统一回执文号待核；F033/034；SRC-001；楼寓 actor+受理批次+时间+状态；未办理不可谎称通过，失联 SOURCEUNAVAILABLE。policyEvidenceStatus=PARTIAL；minCount=0 用于防止未经确认的缺件自动阻断，是否需要该材料由对应 criterion 在正确阶段人工核验。",
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
        "F033"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M015",
      "name": "M015 · 楼寓将核准名单报学校财务处；楼寓/财务；官方交接名单或回执",
      "purpose": "来源模板材料槽：M015；楼寓将核准名单报学校财务处；楼寓/财务；官方交接名单或回执；P@L5 后续才产生，不能用申请人材料替代；F035；SRC-001；核准批次+报送时间/名单版本；尚未报送 NOTAPPLICABLE，无法查 SOURCEUNAVAILABLE。policyEvidenceStatus=PARTIAL；minCount=0 用于防止未经确认的缺件自动阻断，是否需要该材料由对应 criterion 在正确阶段人工核验。",
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
        "F035"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M016",
      "name": "M016 · 财务对住宿费的实际核减状态；财务处；费用台账/官方回执",
      "purpose": "来源模板材料槽：M016；财务对住宿费的实际核减状态；财务处；费用台账/官方回执；P@L5；由财务权威信息或人工核实，学生不重复交账单作为权威；F036；SRC-001；学生+缴费学年+财务处理期；未发生 NOTAPPLICABLE，不可达 SOURCEUNAVAILABLE，本模板不核销。policyEvidenceStatus=PARTIAL；minCount=0 用于防止未经确认的缺件自动阻断，是否需要该材料由对应 criterion 在正确阶段人工核验。",
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
        "F036"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M017",
      "name": "M017 · 国际学生外住安全责任承诺；学生；2021校本试行办法所称承诺书",
      "purpose": "来源模板材料槽：M017；国际学生外住安全责任承诺；学生；2021校本试行办法所称承诺书；C?/U@L1 2021 规章明确，2022年新规有冲突处理条款，2026 现行义务、表单与格式待核；不可强制用普通本科 M006 冒充；F018；SRC-002/004/010；国际学生+本案+版本，文件缺失先 POLICYUNCONFIRMED+人工；现行确认为必需后才 NM。policyEvidenceStatus=PARTIAL；minCount=0 用于防止未经确认的缺件自动阻断，是否需要该材料由对应 criterion 在正确阶段人工核验。",
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
        "F018"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M018",
      "name": "M018 · 国际学生科接受/批准或登记外住申请；国际学生科；官方记录",
      "purpose": "来源模板材料槽：M018；国际学生科接受/批准或登记外住申请；国际学生科；官方记录；P/U@L2 2025 指南提及，学院与国际学生科审批权限衔接待核；F037/038；SRC-002/003/004；真实有权人+机构+日期+办理范围；L1 不要求；权限疑问 POLICYUNCONFIRMED。policyEvidenceStatus=PARTIAL；minCount=0 用于防止未经确认的缺件自动阻断，是否需要该材料由对应 criterion 在正确阶段人工核验。",
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
        "F037"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M019",
      "name": "M019 · 国际学生在校外租房实际租赁关系；学生/房东；租房合同复印件",
      "purpose": "来源模板材料槽：M019；国际学生在校外租房实际租赁关系；学生/房东；租房合同复印件；P@L6 按 2025 指南在外住后提交；2026 适用性待核；自有/亲属等非租房情形不直接套用；F015/041；SRC-003；合同双方+实际地址+租期/版本；已入住且当前校规要求时缺 NM；不适用 NA。policyEvidenceStatus=PARTIAL；minCount=0 用于防止未经确认的缺件自动阻断，是否需要该材料由对应 criterion 在正确阶段人工核验。",
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
        "F015"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M020",
      "name": "M020 · 国际学生房东联系方式；学生/房东；指南要求的联系资料",
      "purpose": "来源模板材料槽：M020；国际学生房东联系方式；学生/房东；指南要求的联系资料；P@L6 2025 指南，当前 2026 规则待核；无租房事实不硬判缺件；F042；SRC-003；房东/住址关系+版本，P2；不清 UNREADABLE，真实性人工核定。policyEvidenceStatus=PARTIAL；minCount=0 用于防止未经确认的缺件自动阻断，是否需要该材料由对应 criterion 在正确阶段人工核验。",
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
        "F042"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M021",
      "name": "M021 · 外国人在非旅馆住处的公安住宿登记；本人/留宿人办理，公安机关形成；《住宿登记表》/权威登记凭据",
      "purpose": "来源模板材料槽：M021；外国人在非旅馆住处的公安住宿登记；本人/留宿人办理，公安机关形成；《住宿登记表》/权威登记凭据；P@L6 入住后才产生；法定24小时义务仅对 SRC-008 适用对象；住校外国际学生是否已入住/住所性质先判；F015/039/040；SRC-002/003/008；外国人+实际地址+入住日期+公安凭据版本；入住前 NA，读不到 SU/UNREADABLE；不得自动认定违法。policyEvidenceStatus=PARTIAL；minCount=0 用于防止未经确认的缺件自动阻断，是否需要该材料由对应 criterion 在正确阶段人工核验。",
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
        "F015"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M022",
      "name": "M022 · 国际学生住址/电话变化通知；学生与国际学生科；通知及收件记录",
      "purpose": "来源模板材料槽：M022；国际学生住址/电话变化通知；学生与国际学生科；通知及收件记录；P@L7 变更发生才存在；2025 指南“及时”未规定具体日数；F015/043；SRC-003；旧/新住址+通知时间+确认人；未变更 NA，缺收件证据 SU/HU。policyEvidenceStatus=PARTIAL；minCount=0 用于防止未经确认的缺件自动阻断，是否需要该材料由对应 criterion 在正确阶段人工核验。",
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
        "F015"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M023",
      "name": "M023 · 申请人撤回意愿；学生；请求书/可信服务记录（本轮设计，不是已核校方表单）",
      "purpose": "来源模板材料槽：M023；申请人撤回意愿；学生；请求书/可信服务记录（本轮设计，不是已核校方表单）；U@C13；仅学生实际请求时使用；学校是否接受撤回仍须有权人员确认；F044；SRC-001（业务背景）；请求者+案卷版本+时间；不存在 NA；权限不明 PU/HU。policyEvidenceStatus=PARTIAL；minCount=0 用于防止未经确认的缺件自动阻断，是否需要该材料由对应 criterion 在正确阶段人工核验。",
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
        "F044"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M024",
      "name": "M024 · 异议/复核请求与新证据目录；学生；申请书/可信服务记录（形式待定）",
      "purpose": "来源模板材料槽：M024；异议/复核请求与新证据目录；学生；申请书/可信服务记录（形式待定）；U@C14；仅学生提出时存在，正式期限/受理机构未知；F045；SRC-001/005（旧处分仅供排除误用）；指向原决定版本+请求者+时间；不存在 NA；路径 PU/HU。policyEvidenceStatus=PARTIAL；minCount=0 用于防止未经确认的缺件自动阻断，是否需要该材料由对应 criterion 在正确阶段人工核验。",
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
        "F045"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M025",
      "name": "M025 · 申请事由的额外解释或证明；学生/相应第三方；自由材料",
      "purpose": "来源模板材料槽：M025；申请事由的额外解释或证明；学生/相应第三方；自由材料；U@L1；SRC-001 仅说“特殊情况”，未列统一具体证明清单；只收愿意提交的材料或经校方书面指定的补证；F012；SRC-001；原因版本+关联申请，不存在不直接判缺；是否需补由学院人工确定。policyEvidenceStatus=PARTIAL；minCount=0 用于防止未经确认的缺件自动阻断，是否需要该材料由对应 criterion 在正确阶段人工核验。",
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
        "F012"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M026",
      "name": "M026 · 替换、纠错或补充的任一既有槽位材料；原签发/提交者；新文件/权威快照",
      "purpose": "来源模板材料槽：M026；替换、纠错或补充的任一既有槽位材料；原签发/提交者；新文件/权威快照；K@C12 需要补件或修订才产生；不作为所有申请的附加常规必需件；F046/048/049，继承所替换槽的 F/SRC；replacesmaterialid + version + reason + editor；旧结论失效，无法读取 UNREADABLE。policyEvidenceStatus=PARTIAL；minCount=0 用于防止未经确认的缺件自动阻断，是否需要该材料由对应 criterion 在正确阶段人工核验。",
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
        "F046"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M027",
      "name": "M027 · 代理/监护授权或特殊情形说明；提出代理者；授权文本/权威关系记录",
      "purpose": "来源模板材料槽：M027；代理/监护授权或特殊情形说明；提出代理者；授权文本/权威关系记录；U@L1 仅有人实际代办才调查，普通本人申请无此件；校方未提供通用代理程序；F050；SRC-001/003；代理人与学生、授权范围和时间绑定；无校本授权规定 POLICYUNCONFIRMED，不得自动授权。policyEvidenceStatus=PARTIAL；minCount=0 用于防止未经确认的缺件自动阻断，是否需要该材料由对应 criterion 在正确阶段人工核验。",
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
        "F050"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M028",
      "name": "M028 · 学校有权部门处理外住异议/复核的结果；实际有权机构；官方决定（机制未证）",
      "purpose": "来源模板材料槽：M028；学校有权部门处理外住异议/复核的结果；实际有权机构；官方决定（机制未证）；P/U@C14，请求后才可能形成；不能用纪律处分复核文书代替；F045、F047/048；SRC-001/005（不得借用旧条文）；原决定+新决定+生效时间+权限；不存在 NA，真伪/权限 POLICYUNCONFIRMED。policyEvidenceStatus=PARTIAL；minCount=0 用于防止未经确认的缺件自动阻断，是否需要该材料由对应 criterion 在正确阶段人工核验。",
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
        "F045",
        "F047"
      ],
      "allowReuseAcrossSubjects": false
    }
  ],
  "sections": [
    {
      "id": "rules-08-2",
      "name": "08.2 身份、申请、安全与校内住宿事实",
      "description": "映射自原始研究模板第08节；仅供事实核验与人工复核，不代表校方授权。",
      "order": 1,
      "required": true,
      "criteria": [
        {
          "id": "r001",
          "title": "学生主体同一性",
          "requirement": "原始规则 R001（第08节）：真：提交外住申请；假：经权威记录证非学生且未提交学生外住案；未知：本人身份或案卷归属待核；SRC-001/002/010；F001–F005/F049；M001/M003/M004/M005；A1 学籍学号、当前姓名、注册身份与 A3 当前表单逐人逐年对齐，外文姓名顺序/更名保留原文；跨案哈希不能替身份；匹配 PASSFACT；身份冲突 CONFLICT，A1 不可取 SOURCEUNAVAILABLE，更名疑点 NEEDSHUMANDECISION；学籍部门→学院。仅输出可追溯事实、补件建议或待人工复核；不得自动形成学校正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r002",
          "title": "在校学籍适用",
          "requirement": "原始规则 R002（第08节）：真：当前学籍支持在校学生分支；假：A1 明确非学生；未知：休/退学状态、S01 生效时点未定；SRC-001/007/010；F004/F007/F008；M001；以 S01 主管部门的学籍状态及生效时间为 A1，不以外住申请改变学籍；旧已批外住的效力另交原批准部门；在校事实 PASSFACT；确认非学生 NOTAPPLICABLE，A1 失联 SOURCEUNAVAILABLE，未定学籍衔接 NEEDSHUMANDECISION；学籍部门/学院。仅输出可追溯事实、补件建议或待人工复核；不得自动形成学校正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r003",
          "title": "校区与适用制度",
          "requirement": "原始规则 R003（第08节）：真：校区已有可适用现行校本程序；假：已核明确另有独立非本事项业务；未知：宜宾/其他校区外住制度未取得；SRC-001/011；F006/F007/F047；M001；核校区 A1 记录及官方制度适用范围；旧“学校本部”指南不能覆盖宜宾，成都服务地址不等于跨校区授权；范围可证 PASSFACT；非本业务 NOTAPPLICABLE；范围未证 POLICYUNCONFIRMED；对应校区学生管理/后勤。仅输出可追溯事实、补件建议或待人工复核；不得自动形成学校正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r004",
          "title": "学段、国别与表型路由",
          "requirement": "原始规则 R004（第08节）：真：本科/研究生/外国留学生/港澳台身份已权威确认；假：R002 排除；未知：学段或管理路径不明；SRC-001/002/004/010；F004/F005/F027；M001/M003/M004/M005；用 A1 学籍类别选分支，不用 OCR 名字猜国别；本科不得套研表，研究生不套本科家长件；2026 国际表附件未读；普通分支匹配 PASSFACT，错表 CONFLICT，国际表/港澳台路线不明 POLICYUNCONFIRMED；学籍/国际学生科/学院。仅输出可追溯事实、补件建议或待人工复核；不得自动形成学校正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r005",
          "title": "当学年及续办效力",
          "requirement": "原始规则 R005（第08节）：真：办理新学年外住；假：本次不涉及学年更替；未知：学年归属、旧批复效力无法判；SRC-001；F009/F010/F013/F024/F047；M003/M004/M005/M012/M013；核拟办理学年与 A1 学校学年定义、旧批复时间及新申请；旧批准可作 A4 历史，不是新年度批准；起止窗口未发布不设自定日期；新年独立申请事实 PASSFACT，旧批复冒充新年 CONFLICT，学年政策不明 POLICYUNCONFIRMED；学生/学院。仅输出可追溯事实、补件建议或待人工复核；不得自动形成学校正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r006",
          "title": "分支申请文书及本人陈述",
          "requirement": "原始规则 R006（第08节）：真：已到该分支学生初次提交；假：R002 排除或尚未到 L1；未知：国际现行表型不明；SRC-001/004；F002/F003/F009–F014/F022/F027；M003/M004/M005；本科双面原件、研究生申请表及纸件份数按 SRC-001；正文、本人申请、材料归属核对；未证明原表有 F013/F014/F022 栏时不强制；纸质份数由线下学院核；普通文书可读匹配 PASSFACT，缺 NEEDSMATERIAL，双面不清 UNREADABLE，国际表格式 POLICYUNCONFIRMED；学生→学院。仅输出可追溯事实、补件建议或待人工复核；不得自动形成学校正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r007",
          "title": "申请理由与“特殊情况”裁量",
          "requirement": "原始规则 R007（第08节）：真：本科/研究生申请需说明特殊情况；假：非本分支；未知：具体证明/例外口径未公布；SRC-001；F012；M003/M004/M025；只核事由是否有可读陈述及其证据归属，不能自建疾病、距离、经济阈值或“特殊情况”白名单；M025 不默认必交；陈述存在 PASSFACT（仅陈述事实），陈述空缺 NEEDSMATERIAL，是否足以同意 NEEDSHUMANDECISION；学院有权审批者。仅输出可追溯事实、补件建议或待人工复核；不得自动形成学校正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r008",
          "title": "本科个人安全承诺",
          "requirement": "原始规则 R008（第08节）：真：普通本科外住；假：研究生或其余身份不适用本本科专件；未知：身份分支未定；SRC-001；F018/F027；M006/M003；A2 核《校外住宿安全承诺书》存在、学生签字与本案绑定，不能判实际安全或免责；签名真实性由学院核；形式一致 PASSFACT，缺 NEEDSMATERIAL，签名不清 UNREADABLE，真实性 NEEDSHUMANDECISION；学生/学院。仅输出可追溯事实、补件建议或待人工复核；不得自动形成学校正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r009",
          "title": "本科家长签字文件",
          "requirement": "原始规则 R009（第08节）：真：普通本科；假：研究生、非本科对应路径；未知：实际签字/证件归属无法判；SRC-001；F020/F021；M007；核清单所称家长签字确认的身份证复印件存在、可读、与案卷关联；证件属谁仍需原表校核，不作法定监护关系推断；严格 P2 最小展示；形式匹配 PASSFACT，缺 NEEDSMATERIAL，不可读 UNREADABLE，签署者身份 NEEDSHUMANDECISION；学生/家长→学院。仅输出可追溯事实、补件建议或待人工复核；不得自动形成学校正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r010",
          "title": "房屋安全承诺",
          "requirement": "原始规则 R010（第08节）：真：普通本科或研究生；假：其他分支无本件依据；未知：承诺人、地址绑定不明；SRC-001；F016–F019；M008；A2 核承诺文本、住址和应签主体；承诺只证明书面承诺，绝不推出房屋经安全验收；国际学生另由 R022 处理；材料事实 PASSFACT，缺 NEEDSMATERIAL，地址冲突 CONFLICT，实质安全 NEEDSHUMANDECISION；学生/房主→学院。仅输出可追溯事实、补件建议或待人工复核；不得自动形成学校正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r011",
          "title": "自有/亲属房产权属条件",
          "requirement": "原始规则 R011（第08节）：真：F016 自有或亲属房经陈述/证据触发；假：可信证据表明非此类型；未知：居住关系不明；SRC-001；F014/F016/F017；M008/M009；自有/亲属房须有房主签字的房产证复印件，与拟住址对照；租住普通本研不因此强制提交权属复印件；A3 房产图不等于登记确权；已提交对应材料 PASSFACT（形式），缺 NEEDSMATERIAL，权属/签名真伪 NEEDSHUMANDECISION；学生/房主→学院。仅输出可追溯事实、补件建议或待人工复核；不得自动形成学校正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r012",
          "title": "拟住址与实际住所关联",
          "requirement": "原始规则 R012（第08节）：真：出现同一住址的两份以上材料或变址；假：尚无地址比较要求；未知：表单是否要求地址栏尚未确定；SRC-001/003/008；F014–F017/F040；M003/M004/M005/M008/M009/M019/M021/M022；保留原地址、规范化地址及有效时点；申请拟住址不能冒充公安登记的实际住址；新地址使旧住所证据失去对新址的支持；地址一致 PASSFACT，可读冲突 CONFLICT，无明确表栏 POLICYUNCONFIRMED；学生/房主/学院/国际学生科。仅输出可追溯事实、补件建议或待人工复核；不得自动形成学校正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r013",
          "title": "是否分配校内床位",
          "requirement": "原始规则 R013（第08节）：真：需判退宿单/床位影响；假：本分支无需校内床位判断；未知：宿舍台账不可达；SRC-001；F023/F025；M002/M010；A1 楼寓现行床位台账优于申请人自报；学院汇总备注只能辅佐，不替代床位确权；先核学年及宿舍分配周期；床位事实 PASSFACT，台账失联 SOURCEUNAVAILABLE，与声明冲突 CONFLICT；楼寓中心/学院。仅输出可追溯事实、补件建议或待人工复核；不得自动形成学校正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r014",
          "title": "已退宿与未分配的豁免理由",
          "requirement": "原始规则 R014（第08节）：真：主张已退宿或研究生未分配；假：未主张免交且现有床位；未知：历史办理或台账不清；SRC-001；F023–F025；M002/M010/M012；核 A1 历史退宿时间/未分配事实，并让学院纸电汇总正确备注；两种豁免理由不可互换，旧案的学年/学生要匹配；豁免事实可核 PASSFACT，历史不可达 SOURCEUNAVAILABLE，备注错位 CONFLICT；楼寓/学院。仅输出可追溯事实、补件建议或待人工复核；不得自动形成学校正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r015",
          "title": "当前应交公寓退宿单",
          "requirement": "原始规则 R015（第08节）：真：按当前阶段有床且应办退宿；假：已核已退宿或研究生未分配等 SRC-001 例外；未知：床位/退出时序不定；SRC-001；F023/F025/F026；M002/M011/M012；不在 L1 前置；仅在楼寓办理所需节点核 A2/A1 退宿单、学生及床位；申请外住批准与实际退宿分别记；提交合规 PASSFACT，豁免 NOTAPPLICABLE，应交未交 NEEDSMATERIAL，权威状态不明 SOURCEUNAVAILABLE；楼寓/学生。仅输出可追溯事实、补件建议或待人工复核；不得自动形成学校正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r016",
          "title": "学院正式审核意见",
          "requirement": "原始规则 R016（第08节）：真：学院已进入审核并主张形成处理意见；假：仍在 L1；未知：签字人授权/真实效力未核；SRC-001/002/010；F028–F030；M013；比对当前申请快照、学年、学院 A1 签批记录与受信岗位授权；上传盖章图仅 A3，不具备 approved=true 可信性；2021 国际条款需经现行性确认；可证“学院记录存在” PASSFACT，授权缺证 NEEDSHUMANDECISION/SOURCEUNAVAILABLE，跨案冲突 CONFLICT；学院有权签发者。仅输出可追溯事实、补件建议或待人工复核；不得自动形成学校正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r017",
          "title": "学院汇总表逐人与纸电一致",
          "requirement": "原始规则 R017（第08节）：真：学院准备向楼寓报送普通本研材料；假：仅学生 L1 或国际是否需该汇总表尚未确定；未知：报送范围未定；SRC-001；F002/F007/F009/F023/F024/F031/F032；M003/M004/M010/M012；A2 纸质签章和电子汇总逐行核学号、学年、学院、单案材料编号及免交备注；行号不能代替主体一致性，份数按校方清单；对齐 PASSFACT，缺纸/电子 NEEDSMATERIAL，行错位/介质冲突 CONFLICT；学院汇总经办→楼寓。仅输出可追溯事实、补件建议或待人工复核；不得自动形成学校正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        }
      ]
    },
    {
      "id": "rules-08-3",
      "name": "08.3 楼寓、国际、事件及证据边界",
      "description": "映射自原始研究模板第08节；仅供事实核验与人工复核，不代表校方授权。",
      "order": 2,
      "required": true,
      "criteria": [
        {
          "id": "r018",
          "title": "楼寓审批备案真实状态",
          "requirement": "原始规则 R018（第08节）：真：学院正式意见后交楼寓审核；假：尚处学生/学院前阶段；未知：当前备案签发人或记录无法确认；SRC-001/011；F028/F033/F034；M013/M014；核 A1 楼寓中心受理/备案结果、授权人、时间、关联学院决定；学院“同意”不得替代楼寓“审核/备案”，未获有效回执不生成生效外住状态；记录可核 PASSFACT（记录事实），无回执 SOURCEUNAVAILABLE，未经授权 NEEDSHUMANDECISION；楼寓中心。仅输出可追溯事实、补件建议或待人工复核；不得自动形成学校正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r019",
          "title": "核准名单报送财务事实",
          "requirement": "原始规则 R019（第08节）：真：楼寓已形成核准名单并报送；假：尚未到报送节点；未知：报送状态不可查；SRC-001；F031/F033/F035；M010/M014/M015；比较 A1 楼寓核准名单批次/人员与财务接收记录，精确学号/学年/报送时间；本 R 只核交接；交接可证 PASSFACT，失联 SOURCEUNAVAILABLE，名单错位 CONFLICT；楼寓→财务。仅输出可追溯事实、补件建议或待人工复核；不得自动形成学校正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r020",
          "title": "住宿费后续核减事实",
          "requirement": "原始规则 R020（第08节）：真：已到有财务处理回执阶段；假：尚未办理；未知：财务记录不可达；SRC-001；F009/F035/F036；M015/M016；核 A1 财务实际状态及处理期间；服务页写“从次月减免”不授权 AI 计算金额、制造退费或写账；财务状态可证 PASSFACT，无权威回执 SOURCEUNAVAILABLE，名单与账务对不上 CONFLICT；财务处。仅输出可追溯事实、补件建议或待人工复核；不得自动形成学校正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r021",
          "title": "国际现行表单及规则适用",
          "requirement": "原始规则 R021（第08节）：真：外国留学生申请；假：普通本研按 R004 分支；未知：港澳台参照、非学历、2026 附件内容；SRC-002/003/004/010；F004/F005/F009/F027/F047；M001/M005；2026目录只证明表存在，2022第59/72条与2021第37条需核协调；不能凭2025指南补造2026审批栏、材料份数；表单要求得到核实后可记 PASSFACT，当前内容不足 POLICYUNCONFIRMED；国际教育学院制度负责人。仅输出可追溯事实、补件建议或待人工复核；不得自动形成学校正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r022",
          "title": "国际学生安全责任承诺",
          "requirement": "原始规则 R022（第08节）：真：国际学生且当期校规证实该承诺仍为必要件；假：非国际分支；未知：2021条款与2022/2026文件关系未明确；SRC-002/004/010；F018/F047；M017/M005；2021 依据证明曾要求承诺，但2026形式/是否独立签章未核；不得拿普通本科 M006 强制替代；当期已证且材料可读 PASSFACT，应交缺件才 NEEDSMATERIAL；目前未证先 POLICYUNCONFIRMED；国际学生科/学院。仅输出可追溯事实、补件建议或待人工复核；不得自动形成学校正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r023",
          "title": "国际学生科、学院之间签发衔接",
          "requirement": "原始规则 R023（第08节）：真：国际学生申请形成处理意见；假：仍处 L1；未知：实际有权机构和先后未确认；SRC-002/003/004/010；F028–F030/F037/F038；M013/M018；A1 当前岗位权限与双单位签批回执，明确各自决定对象；不能从2025指南推出2026有权人，不能由学生上传角色字段证明身份；授权链可证时各节点 PASSFACT，权责未证 POLICYUNCONFIRMED/NEEDSHUMANDECISION；国际学生科/所在学院。仅输出可追溯事实、补件建议或待人工复核；不得自动形成学校正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r024",
          "title": "外国人非旅馆住宿登记",
          "requirement": "原始规则 R024（第08节）：真：具适用国籍/身份、已在非旅馆住处入住；假：未入住或不属 SRC-008 对象；未知：实际入住日期/居住类型不清；SRC-002/003/008；F005/F015/F039/F040；M001/M021；核入住起始日、地址及 A1 公安登记凭据；法定24小时源于 SRC-008；未入住绝不索凭据，不能以学校预审裁定违法/罚款；凭据与地址事实一致 PASSFACT，现阶段未发生 NOTAPPLICABLE，凭据不可核 SOURCEUNAVAILABLE，地址冲突 CONFLICT；学生/留宿人→公安/国际学生科。仅输出可追溯事实、补件建议或待人工复核；不得自动形成学校正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r025",
          "title": "国际已入住租赁/房东联系资料",
          "requirement": "原始规则 R025（第08节）：真：已入住且租住房、当前学校要求提交；假：非租房或未入住；未知：2025指南在2026是否仍适用；SRC-003/004/010；F015/F041/F042；M019/M020；核合同住所、租期与房东信息关联，不将2025新生指南材料扩到普通本科生；房东联系电话真实性只由有权人校验；现行清单可证且材料齐 PASSFACT，否则优先 POLICYUNCONFIRMED，确需缺件 NEEDSMATERIAL，冲突 CONFLICT；国际学生科/学生。仅输出可追溯事实、补件建议或待人工复核；不得自动形成学校正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r026",
          "title": "国际学生地址/联系方式变更通知",
          "requirement": "原始规则 R026（第08节）：真：已发生国际外住住址或电话变更；假：经记录未变；未知：2026当前通知期限/新批程序未明；SRC-003/008/010；F014/F015/F039/F040/F043；M021/M022；比旧新住址、国际学生科收件时点及公安新址登记的适用事实；2025指南仅说“及时”，不能设学校具体天数；新公安义务依法独立判；已通知事实 PASSFACT，现行路径未证 POLICYUNCONFIRMED，地址/凭据冲突 CONFLICT；国际学生科/学生/公安。仅输出可追溯事实、补件建议或待人工复核；不得自动形成学校正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r027",
          "title": "普通本研搬迁与旧地址证据失效",
          "requirement": "原始规则 R027（第08节）：真：实际住址变更；假：住址未变；未知：是否须重新申请/再次审批的校规缺失；SRC-001；F014–F017/F019/F046/F049；M003/M004/M008/M009/M026；新旧地址分别挂来源和版本；旧房承诺/旧权属不能证明新房；强制重新签批/期限没有公开依据；旧版失去当前证明力记录 PASSFACT（技术事实），行政变更路径 POLICYUNCONFIRMED/NEEDSHUMANDECISION；学院/楼寓。仅输出可追溯事实、补件建议或待人工复核；不得自动形成学校正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r028",
          "title": "补件、纠错与定向重审／C12/任何 L",
          "requirement": "原始规则 R028（第08节）：真：存在修订 M 版本；假：无修改事件；未知：新旧材料关联/作者来源未验；SRC-001/009（流程背景和技术待核）；F046/F048/F049；M026及其被替换的 M 槽；保留旧版本、原结论、替换理由/签发者；仅将直接/间接依赖旧 sourceVersion 的 R 标陈旧，并冻结本次新源快照，不改正式学校决定；版本关联可核 PASSFACT，关联冲突 CONFLICT，新件不可读 UNREADABLE；提交者/原审核者。仅输出可追溯事实、补件建议或待人工复核；不得自动形成学校正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r029",
          "title": "撤回请求事实／C13",
          "requirement": "原始规则 R029（第08节）：真：学生提出撤回；假：无撤回请求；未知：提出人/案卷版本难以核对；SRC-001（仅事项背景，未含撤回程序）；F001/F044/F048；M023/M013/M014；只核可信请求者、所指申请/决定快照、时间与接收事实，不判撤回是否有效（另见 R034）；请求存在可证 PASSFACT，主体冲突 CONFLICT，不可读 UNREADABLE；学生→当前真实经办部门。仅输出可追溯事实、补件建议或待人工复核；不得自动形成学校正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r030",
          "title": "处理意见异议请求事实／C14",
          "requirement": "原始规则 R030（第08节）：真：学生对指定正式意见提出异议；假：无异议；未知：请求归属/原决定版本不明；SRC-001/005（处分条款排除借用）/010（一般管理，不是外住期限）；F028/F033/F045/F047/F048；M013/M014/M024/M028；只核本人异议表达、原意见版本、时间及新材料目录；不判受理权限和复核实体结论（另见 R035）；请求存在可证 PASSFACT，无原决定 SOURCEUNAVAILABLE，版本冲突 CONFLICT；学生→有权受理部门待核。仅输出可追溯事实、补件建议或待人工复核；不得自动形成学校正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r031",
          "title": "本人申请与代理授权",
          "requirement": "原始规则 R031（第08节）：真：申报、撤回或复核由他人代办；假：可信本人直接发起；未知：代理关系和学校授权条件不清；SRC-001/003；F002/F050；M003/M004/M005/M007/M023/M024/M027；本人填写原则优先；家长签字不等于代理权，外国/未成年/特殊情况代理程序未得原文；凭账号和上传授权图片不能冒充组织认可；本人发起事实 PASSFACT，本人情况 NOTAPPLICABLE 于代理审核，代办 POLICYUNCONFIRMED/NEEDSHUMANDECISION；学院/国际学生科。仅输出可追溯事实、补件建议或待人工复核；不得自动形成学校正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r032",
          "title": "证据可读性、归属和政策快照门禁／全部 L",
          "requirement": "原始规则 R032（第08节）：真：任一 R 准备引用具体证据；假：该证据未进入该 R 依赖链；未知：原件定位、版本、来源现行性缺失；SRC-001–SRC-011（逐源状态）；F001/F002/F009/F046–F049；M001–M028（仅本 R 当前依赖者）；核本案+本人+学年+槽位+源版本+页/字段定位+可读性；未核原文或历史制度不升级为可执行现行条件；不将系统设计字段当真实 IPC；全部定位可追 PASSFACT（证据链），空槽 NEEDSMATERIAL、不可读 UNREADABLE、权威失联 SOURCEUNAVAILABLE、政策疑问 POLICYUNCONFIRMED；当前审查者/源 Owner。仅输出可追溯事实、补件建议或待人工复核；不得自动形成学校正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r033",
          "title": "学院—楼寓—财务权责链不越界",
          "requirement": "原始规则 R033（第08节）：真：两项以上不同主体的决定/衍生状态已出现；假：尚只有学生陈述；未知：现行授权节点不清；SRC-001/011；F028–F036；M010/M013/M014/M015/M016；分别保存学院意见、楼寓审核备案、财务结果的 A1 签发主体/生效点；不以财务已变更反推学院批准、不以学院盖章替楼寓审批；各节点事实独立可核 PASSFACT，互相矛盾 CONFLICT，效力分界未证 NEEDSHUMANDECISION；学院/楼寓/财务各自 Owner。仅输出可追溯事实、补件建议或待人工复核；不得自动形成学校正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r034",
          "title": "撤回是否获有权部门接受及生效／C13",
          "requirement": "原始规则 R034（第08节）：真：已请求撤回且有人主张撤回生效；假：无撤回请求；未知：校本受理权限/效力点未证；SRC-001/009（仅业务背景与技术待核）；F028/F033/F044/F047/F048；M013/M014/M023；必须取得实际有权机构确认撤回的原始记录并核授权、对象、时间；无独立现行规程不自行判已撤销，尤其不逆转财务/退宿；权限或程序未证 POLICYUNCONFIRMED，实体处置 NEEDSHUMANDECISION；学院/楼寓对应原批准者。仅输出可追溯事实、补件建议或待人工复核；不得自动形成学校正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r035",
          "title": "复核受理权限及正式复核结果／C14",
          "requirement": "原始规则 R035（第08节）：真：申请人提出异议且机构拟受理/出具结果；假：无异议；未知：外住专项程序/权限/期限不明；SRC-001/005/010（均不提供外住专项复核期限）；F028/F033/F045/F047/F048；M013/M014/M024/M028；复核有权部门核是否受理、原决定及后续 M028 的真实签发/送达、时间效力；不得挪用纪律处分申诉期限；未取得机制 POLICYUNCONFIRMED，需要决定 NEEDSHUMANDECISION，真记录仅确认存在 PASSFACT；校本授权复核机关待核。仅输出可追溯事实、补件建议或待人工复核；不得自动形成学校正式批准或拒绝。",
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
      "name": "L0 受理前",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "L1",
      "workflowOwner": "local",
      "skippableReason": "按原模板适用身份/阶段触发；未触发时由人工标记不适用。政策、权限或正式决定未确认时转人工复核。"
    },
    {
      "id": "L1",
      "name": "L1 学生提交",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "L2",
      "workflowOwner": "local",
      "skippableReason": "按原模板适用身份/阶段触发；未触发时由人工标记不适用。政策、权限或正式决定未确认时转人工复核。"
    },
    {
      "id": "L2",
      "name": "L2 学院审核",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "L3",
      "workflowOwner": "local",
      "skippableReason": "按原模板适用身份/阶段触发；未触发时由人工标记不适用。政策、权限或正式决定未确认时转人工复核。"
    },
    {
      "id": "L3",
      "name": "L3 楼寓审核备案",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "L4",
      "workflowOwner": "local",
      "skippableReason": "按原模板适用身份/阶段触发；未触发时由人工标记不适用。政策、权限或正式决定未确认时转人工复核。"
    },
    {
      "id": "L4",
      "name": "L4 校内床位后续",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "L5",
      "workflowOwner": "local",
      "skippableReason": "按原模板适用身份/阶段触发；未触发时由人工标记不适用。政策、权限或正式决定未确认时转人工复核。"
    },
    {
      "id": "L5",
      "name": "L5 后续财务",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "L6",
      "workflowOwner": "local",
      "skippableReason": "按原模板适用身份/阶段触发；未触发时由人工标记不适用。政策、权限或正式决定未确认时转人工复核。"
    },
    {
      "id": "L6",
      "name": "L6 国际学生独有的入住后事项",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "L7",
      "workflowOwner": "local",
      "skippableReason": "按原模板适用身份/阶段触发；未触发时由人工标记不适用。政策、权限或正式决定未确认时转人工复核。"
    },
    {
      "id": "L7",
      "name": "L7 在住维护/次年",
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
  "templateId": "S04-T02",
  "name": "校外住宿与安全责任申请审核",
  "officialSchoolTemplate": false,
  "researchStatus": "RESEARCH_HANDOFF_READY",
  "policyEvidenceStatus": "PARTIAL",
  "researchAsOf": "2026-10-24",
  "sourceSnapshot": "2026-10-23（当前可访问的最新正式 MD）",
  "sourceDocumentPath": "docs/design/review-agent/business-templates/R02/S04-T02.md",
  "sourceDocumentSha256": "bcdb033d0cb7cab4176706c3b2b910ca5c2d45077b65158cbab5833fff9bf660",
  "sourceDocumentBytes": 135976,
  "originalSourcePath": "docs/design/review-agent/business-templates/R02/research-original/S04-T02.md",
  "originalSourceBlobSha1": "7a6231671a0a3a4d547812111cd04f0a871967cd",
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
      "id": "SRC-002",
      "title": "原稿引用 SRC-002；来源索引未解析",
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
      "id": "SRC-007",
      "title": "原稿引用 SRC-007；来源索引未解析",
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
      "id": "SRC-004",
      "title": "原稿引用 SRC-004；来源索引未解析",
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
      "id": "SRC-008",
      "title": "原稿引用 SRC-008；来源索引未解析",
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
    }
  ],
  "criteria": [
    {
      "sectionId": "rules-08-2",
      "criterionId": "r001",
      "ruleId": "R001",
      "sourceIds": [
        "SRC-001",
        "SRC-002",
        "SRC-010"
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
        "SRC-007",
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
        "SRC-011"
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
        "SRC-002",
        "SRC-004",
        "SRC-010"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "execution": "manual"
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "r005",
      "ruleId": "R005",
      "sourceIds": [
        "SRC-001"
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
        "SRC-001"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "execution": "manual"
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "r008",
      "ruleId": "R008",
      "sourceIds": [
        "SRC-001"
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
        "SRC-001",
        "SRC-003",
        "SRC-008"
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
        "SRC-001"
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
        "SRC-010"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "execution": "manual"
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "r017",
      "ruleId": "R017",
      "sourceIds": [
        "SRC-001"
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
        "SRC-011"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "execution": "manual"
    },
    {
      "sectionId": "rules-08-3",
      "criterionId": "r019",
      "ruleId": "R019",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "execution": "manual"
    },
    {
      "sectionId": "rules-08-3",
      "criterionId": "r020",
      "ruleId": "R020",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "execution": "manual"
    },
    {
      "sectionId": "rules-08-3",
      "criterionId": "r021",
      "ruleId": "R021",
      "sourceIds": [
        "SRC-002",
        "SRC-003",
        "SRC-004",
        "SRC-010"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "execution": "manual"
    },
    {
      "sectionId": "rules-08-3",
      "criterionId": "r022",
      "ruleId": "R022",
      "sourceIds": [
        "SRC-002",
        "SRC-004",
        "SRC-010"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "execution": "manual"
    },
    {
      "sectionId": "rules-08-3",
      "criterionId": "r023",
      "ruleId": "R023",
      "sourceIds": [
        "SRC-002",
        "SRC-003",
        "SRC-004",
        "SRC-010"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "execution": "manual"
    },
    {
      "sectionId": "rules-08-3",
      "criterionId": "r024",
      "ruleId": "R024",
      "sourceIds": [
        "SRC-008",
        "SRC-002",
        "SRC-003"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "execution": "manual"
    },
    {
      "sectionId": "rules-08-3",
      "criterionId": "r025",
      "ruleId": "R025",
      "sourceIds": [
        "SRC-003",
        "SRC-004",
        "SRC-010"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "execution": "manual"
    },
    {
      "sectionId": "rules-08-3",
      "criterionId": "r026",
      "ruleId": "R026",
      "sourceIds": [
        "SRC-003",
        "SRC-008",
        "SRC-010"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "execution": "manual"
    },
    {
      "sectionId": "rules-08-3",
      "criterionId": "r027",
      "ruleId": "R027",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "execution": "manual"
    },
    {
      "sectionId": "rules-08-3",
      "criterionId": "r028",
      "ruleId": "R028",
      "sourceIds": [
        "SRC-001",
        "SRC-009"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "execution": "manual"
    },
    {
      "sectionId": "rules-08-3",
      "criterionId": "r029",
      "ruleId": "R029",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "execution": "manual"
    },
    {
      "sectionId": "rules-08-3",
      "criterionId": "r030",
      "ruleId": "R030",
      "sourceIds": [
        "SRC-001",
        "SRC-005"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "execution": "manual"
    },
    {
      "sectionId": "rules-08-3",
      "criterionId": "r031",
      "ruleId": "R031",
      "sourceIds": [
        "SRC-001",
        "SRC-003"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "execution": "manual"
    },
    {
      "sectionId": "rules-08-3",
      "criterionId": "r032",
      "ruleId": "R032",
      "sourceIds": [
        "SRC-001",
        "SRC-011"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "execution": "manual"
    },
    {
      "sectionId": "rules-08-3",
      "criterionId": "r033",
      "ruleId": "R033",
      "sourceIds": [
        "SRC-001",
        "SRC-011"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "execution": "manual"
    },
    {
      "sectionId": "rules-08-3",
      "criterionId": "r034",
      "ruleId": "R034",
      "sourceIds": [
        "SRC-001",
        "SRC-009"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "execution": "manual"
    },
    {
      "sectionId": "rules-08-3",
      "criterionId": "r035",
      "ruleId": "R035",
      "sourceIds": [
        "SRC-001",
        "SRC-005",
        "SRC-010"
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
