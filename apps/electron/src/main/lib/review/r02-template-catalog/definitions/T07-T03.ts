import type { TemplateVersion } from '@profer/shared'

/** Local R02 research implementation. Not an official CDUT template. */
export const templateVersion: TemplateVersion = {
  "templateId": "T07-T03",
  "version": 1,
  "schemaVersion": 2,
  "name": "单位授权函、介绍信与对外正式函件核验",
  "description": "本地研究模板 · 非校方正式模板。单位授权函、介绍信与对外正式函件核验的事实预审、证据缺口识别和人工复核辅助；政策证据状态为 PARTIAL，校方最终签发/批准/用印/上线等决定必须由真实有权人员在权威流程中完成。",
  "catalogKind": "builtin",
  "sourceNote": "R02_RESEARCH_TEMPLATE_NONOFFICIAL: 源研究稿为非成都理工大学官方模板；源文件 docs/design/review-agent/business-templates/R02/T07-T03.md，SHA-256 67cc4b482332adcb5978d0f440f1fb004f595fb78e3f0ae80a4d4e31d4c5e183。研究来源与学校现行授权并不等同；未经核实的政策与权限必须人工复核。",
  "objectType": "document",
  "displayName": {
    "template": "T07-T03 · {{f001}}"
  },
  "fields": [
    {
      "key": "f001",
      "label": "001 · caseId",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F001；源定义：caseId: string；CASE L0；CASE（内部拟定）；案卷主状态唯一标识；P1；E；不可自行构造第二案卷"
    },
    {
      "key": "f002",
      "label": "002 · caseVersion",
      "kind": "number",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F002；源定义：caseVersion: integer；CASE L0；CASE；主案卷 CAS 版本；P1；E；并发变化重取，不双写"
    },
    {
      "key": "f003",
      "label": "003 · phase",
      "kind": "enum",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F003；源定义：phase: enum L0–L5；CASE L0；CASE/HUMAN 事件；可信工作流及已发生事件；P1；E；不能由 Renderer 伪造跳阶段",
      "options": [
        {
          "value": "L0",
          "label": "L0"
        },
        {
          "value": "L1",
          "label": "L1"
        },
        {
          "value": "L2",
          "label": "L2"
        },
        {
          "value": "L3",
          "label": "L3"
        },
        {
          "value": "L4",
          "label": "L4"
        },
        {
          "value": "L5",
          "label": "L5"
        }
      ]
    },
    {
      "key": "f004",
      "label": "004 · subtype",
      "kind": "enum",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F004；源定义：subtype: enum C01–C15；CASE L0；DOC 分类建议＋归口人工核定；申请目的与拟函正文，见 03.3；P1；U；含混先路由人工",
      "options": [
        {
          "value": "C01",
          "label": "C01"
        },
        {
          "value": "C02",
          "label": "C02"
        },
        {
          "value": "C03",
          "label": "C03"
        },
        {
          "value": "C04",
          "label": "C04"
        },
        {
          "value": "C05",
          "label": "C05"
        },
        {
          "value": "C06",
          "label": "C06"
        },
        {
          "value": "C07",
          "label": "C07"
        },
        {
          "value": "C08",
          "label": "C08"
        },
        {
          "value": "C09",
          "label": "C09"
        },
        {
          "value": "C10",
          "label": "C10"
        },
        {
          "value": "C11",
          "label": "C11"
        },
        {
          "value": "C12",
          "label": "C12"
        },
        {
          "value": "C13",
          "label": "C13"
        },
        {
          "value": "C14",
          "label": "C14"
        },
        {
          "value": "C15",
          "label": "C15"
        }
      ]
    },
    {
      "key": "f005",
      "label": "005 · issuerLevel",
      "kind": "enum",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F005；源定义：issuerLevel: enum 校党委/校行政/院系/部门/独立法人/未知；LETTER L0；DOC 请求；AUTH/章程核名；拟抬头、单位印鉴名、SRC-001/004/007；P1；U/C；不能把部门推为学校",
      "options": [
        {
          "value": "校党委",
          "label": "校党委"
        },
        {
          "value": "校行政",
          "label": "校行政"
        },
        {
          "value": "院系",
          "label": "院系"
        },
        {
          "value": "部门",
          "label": "部门"
        },
        {
          "value": "独立法人",
          "label": "独立法人"
        },
        {
          "value": "未知",
          "label": "未知"
        }
      ]
    },
    {
      "key": "f006",
      "label": "006 · issuerUnitId",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F006；源定义：issuerUnitId: string；PARTY L0；AUTH（未证实接线）；权威组织树与单位全称；P1；S/C；人工核单位合法性"
    },
    {
      "key": "f007",
      "label": "007 · applicantUnitId",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F007；源定义：applicantUnitId: string；PARTY L0；AUTH（未证实接线）；经办人员可信任职/组织关系；P1；S；不同于拟出函单位"
    },
    {
      "key": "f008",
      "label": "008 · applicantActorId",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F008；源定义：applicantActorId: string；PARTY L0；AUTH/可信 Main 会话；登录主体及服务端签名/授权上下文；P2；S；Renderer 自填不生效"
    },
    {
      "key": "f009",
      "label": "009 · applicantClass",
      "kind": "enum",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F009；源定义：applicantClass: enum 教职工/本科生/硕士生/博士生/其他/未知；PARTY L0；AUTH（未证实接线）；人事/学籍身份有效期及现况；P2；S/U；仅路由，不作一刀切资格拒绝",
      "options": [
        {
          "value": "教职工",
          "label": "教职工"
        },
        {
          "value": "本科生",
          "label": "本科生"
        },
        {
          "value": "硕士生",
          "label": "硕士生"
        },
        {
          "value": "博士生",
          "label": "博士生"
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
      "key": "f010",
      "label": "010 · campus",
      "kind": "enum",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F010；源定义：campus: enum 成都/宜宾/其他/未知；PARTY L0；AUTH 或 DOC 声明待核；学校组织/学籍记录、SRC-004；P1；U；不得推不同门槛",
      "options": [
        {
          "value": "成都",
          "label": "成都"
        },
        {
          "value": "宜宾",
          "label": "宜宾"
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
      "key": "f011",
      "label": "011 · subjectPersonId",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F011；源定义：subjectPersonId: string?；PARTY L1；AUTH（未证实接线）；受介绍/授权人校内编号或人工核验的身份索引；P2；条件 N/S；无被介绍人则不适用"
    },
    {
      "key": "f012",
      "label": "012 · subjectName",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F012；源定义：subjectName: string?；PARTY L1；AUTH 核名＋DOC 草稿；函件正文、人员权威姓名；原文字面留痕；P2；条件 N/C；同名不能仅靠字符串判同一人"
    },
    {
      "key": "f013",
      "label": "013 · subjectAffiliation",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F013；源定义：subjectAffiliation: string?；PARTY L1；AUTH＋所属归口；人员当前单位/校外身份声明的核实证据；P2；S/U；校外主体不能伪造校内身份"
    },
    {
      "key": "f014",
      "label": "014 · recipientOrgName",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F014；源定义：recipientOrgName: string；LETTER L0/L1；DOC；必要时外部公函核证；受文单位完整名称及外方要求；P1；N/C；名称变化触发重审"
    },
    {
      "key": "f015",
      "label": "015 · recipientDepartment",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F015；源定义：recipientDepartment: string?；LETTER L1；DOC/外方要求；收函部门、联系人/地址（必要时）；P1/P2；条件 N；无须普遍搜集联系人个人信息"
    },
    {
      "key": "f016",
      "label": "016 · purposeStatement",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F016；源定义：purposeStatement: text；LETTER L0/L1；DOC，归口人工核实目的；申请陈述与函件目的段；P1/P3；N/U；不清楚不得自动签发"
    },
    {
      "key": "f017",
      "label": "017 · requestedAuthorityScope",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F017；源定义：requestedAuthorityScope: text；AUTHZ L1；DOC＋原业务有权决定；拟可实施行为、对象、限制条件；P3；条件 N/U；不得默认为全面代理"
    },
    {
      "key": "f018",
      "label": "018 · commitmentRisk",
      "kind": "enum",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F018；源定义：commitmentRisk: enum 一般/合同/资金资产/涉密/法律争议/未知；LETTER L0/L2；DOC 提取仅建议＋业务法务人工；正文权利义务/保密条款、SRC-001/005；P3；U/C；疑似即人工判断",
      "options": [
        {
          "value": "一般",
          "label": "一般"
        },
        {
          "value": "合同",
          "label": "合同"
        },
        {
          "value": "资金资产",
          "label": "资金资产"
        },
        {
          "value": "涉密",
          "label": "涉密"
        },
        {
          "value": "法律争议",
          "label": "法律争议"
        },
        {
          "value": "未知",
          "label": "未知"
        }
      ]
    },
    {
      "key": "f019",
      "label": "019 · proposedValidFrom",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F019；源定义：proposedValidFrom: date?；AUTHZ L1；DOC 提议；L3 有权确认；草稿日期及最终函版本；P1；条件 U；无校本统一起始日"
    },
    {
      "key": "f020",
      "label": "020 · proposedValidTo",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F020；源定义：proposedValidTo: date?；AUTHZ L1；DOC 提议；L3 有权确认；草稿期限及最终函版本；P1；条件 U；不设天数硬阈值"
    },
    {
      "key": "f021",
      "label": "021 · externalDeadline",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F021；源定义：externalDeadline: datetime?；LETTER L0/L1；外方通知 DOC（核实真伪）；外部公函/要求中的 D0；P1；条件 N/U；缺失不自动拒绝"
    },
    {
      "key": "f022",
      "label": "022 · internalDeadlineBasis",
      "kind": "object",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F022；源定义：internalDeadlineBasis: object?；AUTHZ L2；现行校本规定/OA 可信配置（未取得）；D1 原文条款/版本，SRC-002/012；P1；U；不得默认 3/5 工作日"
    },
    {
      "key": "f023",
      "label": "023 · taskBasisRef",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F023；源定义：taskBasisRef: string?；BASIS L1/L2；BIZ 或单位可信任务记录（未证实接线）；任务通知、会议决定/业务批办的可核链接；P1/P3；条件 S/N；普通介绍任务真实性仍需核"
    },
    {
      "key": "f024",
      "label": "024 · upstreamDecisionRef",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F024；源定义：upstreamDecisionRef: string?；BASIS L2；BIZ（候选只读）；原案编号、决定 ID；不得本案另作实体决定；P3；条件 S/L；决定尚未形成应等待"
    },
    {
      "key": "f025",
      "label": "025 · upstreamDecisionState",
      "kind": "enum",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F025；源定义：upstreamDecisionState: enum 待审/批准/拒绝/撤销/失效/未知；BASIS L2；BIZ 可信状态；决定正文、签发/撤销事件与当前状态；P3；条件 S/C；截图不能冒充批准",
      "options": [
        {
          "value": "待审",
          "label": "待审"
        },
        {
          "value": "批准",
          "label": "批准"
        },
        {
          "value": "拒绝",
          "label": "拒绝"
        },
        {
          "value": "撤销",
          "label": "撤销"
        },
        {
          "value": "失效",
          "label": "失效"
        },
        {
          "value": "未知",
          "label": "未知"
        }
      ]
    },
    {
      "key": "f026",
      "label": "026 · upstreamDecisionScope",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F026；源定义：upstreamDecisionScope: text?；BASIS L2；BIZ 可信决定内容；被批准对象、事项、人员、限制和条件；P3；条件 S/C；越界必须人工"
    },
    {
      "key": "f027",
      "label": "027 · upstreamDecisionVersion",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F027；源定义：upstreamDecisionVersion: string?；BASIS L2；BIZ 可信版本；来源系统版本/生效时间/内容指纹；P3；条件 S/C；旧版结论不得替新版"
    },
    {
      "key": "f028",
      "label": "028 · draftDocId",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F028；源定义：draftDocId: string；LETTER L1；CASE 材料清单；当前拟函材料 ID/M002；P1；N；无草稿只完成 L0 分流"
    },
    {
      "key": "f029",
      "label": "029 · draftVersion",
      "kind": "number",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F029；源定义：draftVersion: integer/string；LETTER L1；CASE 材料版本；M002/M016 当前版本号；P1；N/C；保持历史版本"
    },
    {
      "key": "f030",
      "label": "030 · draftFingerprint",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F030；源定义：draftFingerprint: sha256 string；LETTER L1；CASE 内容摘要；当前整份拟函字节/规范化转换关系；P1；E/C；不可仅以文件名判相同"
    },
    {
      "key": "f031",
      "label": "031 · requestedSealKind",
      "kind": "enum",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F031；源定义：requestedSealKind: enum 纸质/电子/专用/未知；ISSUE L1/L2；DOC 渠道偏好＋政策人工核；申请选择；SRC-002/009/012；P1；U；渠道选择不证明章种授权",
      "options": [
        {
          "value": "纸质",
          "label": "纸质"
        },
        {
          "value": "电子",
          "label": "电子"
        },
        {
          "value": "专用",
          "label": "专用"
        },
        {
          "value": "未知",
          "label": "未知"
        }
      ]
    },
    {
      "key": "f032",
      "label": "032 · signAuthorityBasisRef",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F032；源定义：signAuthorityBasisRef: string?；AUTHZ L2；正式校本授权/职权清单（未取得）；法定/委托依据及当期有效版本，SRC-004/012；P3；U/S；不靠职位文字自认"
    },
    {
      "key": "f033",
      "label": "033 · trustedSignerActorId",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F033；源定义：trustedSignerActorId: string?；AUTHZ L3；AUTH＋OA 真实签发事件；真正签发人身份、任职和授权时点；P3；L/S；前端签名图片无效"
    },
    {
      "key": "f034",
      "label": "034 · signDecisionId",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F034；源定义：signDecisionId: string?；ISSUE L3；OA/可信纸质签批台账（未接线）；对应拟稿指纹的正式决定号；P3；L/S；缺则不得推已签发"
    },
    {
      "key": "f035",
      "label": "035 · signDecisionState",
      "kind": "enum",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F035；源定义：signDecisionState: enum 未产生/同意/不同意/退回/撤销/未知；ISSUE L3；OA/可信纸质签批台账；审批动作、时间、签批对象版本；P3；L/S/C；事实预审 PASS 不等于同意",
      "options": [
        {
          "value": "未产生",
          "label": "未产生"
        },
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
          "value": "撤销",
          "label": "撤销"
        },
        {
          "value": "未知",
          "label": "未知"
        }
      ]
    },
    {
      "key": "f036",
      "label": "036 · finalDocFingerprint",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F036；源定义：finalDocFingerprint: sha256 string?；ISSUE L4；ARCH/可信文件输出；已出正式件全文字节指纹；P1/P3；L/S/C；不得沿用未批准稿"
    },
    {
      "key": "f037",
      "label": "037 · sealRecordId",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F037；源定义：sealRecordId: string?；ISSUE L4；SEAL/可信纸质台账（未接线）；章种、操作人与用印对象版本；P3；L/S；看见红章不等于存在记录"
    },
    {
      "key": "f038",
      "label": "038 · sealVerification",
      "kind": "enum",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F038；源定义：sealVerification: enum 未核/验签有效/无效/无法核/人工确认；ISSUE L4；SEAL/电子验签或核验人；有效电子签章元数据、印章编号，SRC-009；P3；L/S/C；章图 OCR 不构成验签",
      "options": [
        {
          "value": "未核",
          "label": "未核"
        },
        {
          "value": "验签有效",
          "label": "验签有效"
        },
        {
          "value": "无效",
          "label": "无效"
        },
        {
          "value": "无法核",
          "label": "无法核"
        },
        {
          "value": "人工确认",
          "label": "人工确认"
        }
      ]
    },
    {
      "key": "f039",
      "label": "039 · dispatchReceiptRef",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F039；源定义：dispatchReceiptRef: string?；ISSUE L4；ARCH/可信发函送达记录；交付对象、渠道、时间与回执；P2/P3；L/S；不默认已送达"
    },
    {
      "key": "f040",
      "label": "040 · changeKind",
      "kind": "enum",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F040；源定义：changeKind: enum 补件/勘误/续期/扩权/撤回/复核；FOLLOW L1/L5；CASE＋可信申请人/有权主体动作；补充说明与新旧案卷事件；P1；条件 N/U；不可覆盖历史",
      "options": [
        {
          "value": "补件",
          "label": "补件"
        },
        {
          "value": "勘误",
          "label": "勘误"
        },
        {
          "value": "续期",
          "label": "续期"
        },
        {
          "value": "扩权",
          "label": "扩权"
        },
        {
          "value": "撤回",
          "label": "撤回"
        },
        {
          "value": "复核",
          "label": "复核"
        }
      ]
    },
    {
      "key": "f041",
      "label": "041 · priorIssuedLetterRef",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F041；源定义：priorIssuedLetterRef: string?；FOLLOW L5；ARCH/可信旧函档案；旧正式件 ID、全文与当前状态；P3；条件 S/C；不能只比旧扫描件"
    },
    {
      "key": "f042",
      "label": "042 · reviewDecisionRef",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F042；源定义：reviewDecisionRef: string?；FOLLOW L5；有权复核机构/OA/档案（未接线）；复核意见及其有权人、版本、时间；P3；L/S；AI 意见不可替代"
    },
    {
      "key": "f043",
      "label": "043 · externalRevocationEffect",
      "kind": "enum",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F043；源定义：externalRevocationEffect: enum 未评价/待核/已确认/争议；FOLLOW L5；法治/原签发机构有权人；通知回执、法律评估/处置意见；P3；L/U；不得自动写“旧函失效”",
      "options": [
        {
          "value": "未评价",
          "label": "未评价"
        },
        {
          "value": "待核",
          "label": "待核"
        },
        {
          "value": "已确认",
          "label": "已确认"
        },
        {
          "value": "争议",
          "label": "争议"
        }
      ]
    },
    {
      "key": "f044",
      "label": "044 · policyVersionRef",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F044；源定义：policyVersionRef: string?；AUTHZ L2；正式规定版本及校方确认（SRC-012 待取）；政策文件号、生效/修订/废止记录；P1；U；政策时效不明阻断权限硬裁定"
    },
    {
      "key": "f045",
      "label": "045 · authoritativeSourceState",
      "kind": "enum",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F045；源定义：authoritativeSourceState: enum 可用/离线/权限不足/未接入/版本不明；CASE L0–L5；每一权威来源读取状态（设计）；来源、访问时间、请求 ID、错误类型；P1/P3；S；不要求用户造权威系统回执",
      "options": [
        {
          "value": "L0",
          "label": "L0"
        },
        {
          "value": "L1",
          "label": "L1"
        },
        {
          "value": "L2",
          "label": "L2"
        },
        {
          "value": "L3",
          "label": "L3"
        },
        {
          "value": "L4",
          "label": "L4"
        },
        {
          "value": "L5",
          "label": "L5"
        }
      ]
    },
    {
      "key": "f046",
      "label": "046 · granteeSet",
      "kind": "multi",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F046；源定义：granteeSet: list<{trustedSubjectId,capacity,subjectSourceVersion}>；AUTHZ L1/L2；DOC 拟指定名单；AUTH 有权核身份；被授权人逐人唯一 ID、角色与身份版本，非单一姓名字符串；SRC-004/015；P3；条件 N/S/C；没有自然人受托则 N/A"
    },
    {
      "key": "f047",
      "label": "047 · delegationMode",
      "kind": "enum",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F047；源定义：delegationMode: enum 单独/共同/分别/其他/未知；AUTHZ L1；DOC 拟议，L3 有权批准后才正式有效；多名被授权人是否必须共同作出行为，SRC-012/014（014 外校仅结构参照）；P3；条件 N/U；未证校本政策不能默认多人均可单独代理",
      "options": [
        {
          "value": "单独",
          "label": "单独"
        },
        {
          "value": "共同",
          "label": "共同"
        },
        {
          "value": "分别",
          "label": "分别"
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
      "key": "f048",
      "label": "048 · subDelegationRequested",
      "kind": "enum",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F048；源定义：subDelegationRequested: enum 是/否/未知；AUTHZ L1；DOC 提议，M021 有权链判定；是否提出二次转委托及新旧链关系，SRC-012；P3；条件 N/U；禁止从“授权函”四字推许复代理",
      "options": [
        {
          "value": "是",
          "label": "是"
        },
        {
          "value": "否",
          "label": "否"
        },
        {
          "value": "未知",
          "label": "未知"
        }
      ]
    },
    {
      "key": "f049",
      "label": "049 · effectiveGrantChain",
      "kind": "object",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F049；源定义：effectiveGrantChain: object?（授予主体/受托集合/范围/生效失效/撤销事件/源版本）；AUTHZ L2/L3；校本有权授权机构的可信事件（尚未接线）；M009/M021；逐人逐时点核授权源而非 OCR 印章，SRC-004/012；P3；S/U/C；无真实授权源不得认定任何新转委托合法"
    },
    {
      "key": "f050",
      "label": "050 · outboundDataClass",
      "kind": "enum",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F050；源定义：outboundDataClass: enum 普通公开/内部/个人信息/敏感个人信息/涉密疑似/未知；LETTER L1/L2；草稿仅候选分类；有权保密、数据持有者核定；拟对外透露的字段、名单、附件范围，SRC-015/016；P3；U；高风险人工分类，未核不得按公开放行",
      "options": [
        {
          "value": "普通公开",
          "label": "普通公开"
        },
        {
          "value": "内部",
          "label": "内部"
        },
        {
          "value": "个人信息",
          "label": "个人信息"
        },
        {
          "value": "敏感个人信息",
          "label": "敏感个人信息"
        },
        {
          "value": "涉密疑似",
          "label": "涉密疑似"
        },
        {
          "value": "未知",
          "label": "未知"
        }
      ]
    },
    {
      "key": "f051",
      "label": "051 · disclosureDecisionRef",
      "kind": "object",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F051；源定义：disclosureDecisionRef: object?（原业务 ID、决定/版本、对象、允许受文者与内容）；BASIS L2/L3；个人数据/科研成果/信息公开原业务 Owner 只读决定；M008/M022；G02/G06/T07-T07/T07-T06 按目的归口，SRC-013/015/016；P3；S/L/U；无需独立披露决定时须记适用依据，不能自行生成"
    },
    {
      "key": "f052",
      "label": "052 · revocationNoticeReceiptRef",
      "kind": "object",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F052；源定义：revocationNoticeReceiptRef: object?（通知事件 ID、内容指纹、收件方、回执状态）；FOLLOW L5；正式发函/送达台账及原签发机构；M015/M023；“发出通知”与“对方收悉”分别证实，SRC-001/005；P3；L/S/U；不可由用户撤回点击伪造对方确认"
    }
  ],
  "materialSlots": [
    {
      "id": "m001",
      "name": "001 · 事项申请/分流说明",
      "purpose": "来源研究材料槽 M001。M001；事项申请/分流说明；发起人持有，结构化申请或可信 OA 申请摘要，说明用途、拟出具名义、受文对象；当期 L0；合法替代为已具申请人真实身份的可信案件记录；不要求固定纸表；F001–F010、F014、F016、F018；SRC-001/002；归申请案卷当前版本；缺目的需补 N，来源不可读 U，不推定校方已有统一表单。仅按源模板的办理情形和阶段触发；权威校内记录可在授权后只读核验替代上传，不要求申请人在初次提交时预交后置材料。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "requiredAt": "submission",
      "maxCount": 9007199254740991,
      "requiredElements": [
        "M001",
        "事项申请/分流说明",
        "发起人持有，结构化申请或可信 OA 申请摘要，说明用途、拟出具名义、受文对象",
        "当期 L0"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m002",
      "name": "002 · 拟对外函件正文",
      "purpose": "来源研究材料槽 M002。M002；拟对外函件正文；申请单位起草，Word/PDF/文本草稿，带抬头、受文者及要办事项；当期 L1（范围内候选）；可由结构化文字生成可审阅草稿，不能视为正式签发稿；L0 仅分流不要求；F005、F011–F020、F028–F030；SRC-001/012；草稿每次上传保留新版本/指纹；缺则 NEEDS_MATERIAL（仅 L1），乱码/扫描不清 UNREADABLE。仅按源模板的办理情形和阶段触发；权威校内记录可在授权后只读核验替代上传，不要求申请人在初次提交时预交后置材料。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      "maxCount": 9007199254740991,
      "requiredElements": [
        "M002",
        "拟对外函件正文",
        "申请单位起草，Word/PDF/文本草稿，带抬头、受文者及要办事项",
        "当期 L1（范围内候选）"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m003",
      "name": "003 · 外部单位要求或接洽依据",
      "purpose": "来源研究材料槽 M003。M003；外部单位要求或接洽依据；受文方/发起人持有，外方邮件、公函、要求格式/截止通知；条件 L1：有外方模板、指定内容、外部截止才需；可用能核对来源的正式邮件、通知页面；F014–F015、F021；SRC-001（归口线索），具体外部原文需逐案核实；归外部源并存 URL/时点；缺非强制，无可靠通知则 D0 为未知；不可读要求原发送方澄清。仅按源模板的办理情形和阶段触发；权威校内记录可在授权后只读核验替代上传，不要求申请人在初次提交时预交后置材料。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      "maxCount": 9007199254740991,
      "requiredElements": [
        "M003",
        "外部单位要求或接洽依据",
        "受文方/发起人持有，外方邮件、公函、要求格式/截止通知",
        "条件 L1：有外方模板、指定内容、外部截止才需"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m004",
      "name": "004 · 公务任务/单位内部职责事实依据",
      "purpose": "来源研究材料槽 M004。M004；公务任务/单位内部职责事实依据；发起归口单位持有，任务通知、工作安排或业务批办；条件 L1/L2：对外称具有具体委派任务/特殊经办权时需要；可信归口系统任务记录可替代个人上传；F016–F018、F023；SRC-001/004；归任务来源；缺源 SOURCE_UNAVAILABLE，若无任何任务可证明则转人工，不捏造派遣授权。仅按源模板的办理情形和阶段触发；权威校内记录可在授权后只读核验替代上传，不要求申请人在初次提交时预交后置材料。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      "maxCount": 9007199254740991,
      "requiredElements": [
        "M004",
        "公务任务/单位内部职责事实依据",
        "发起归口单位持有，任务通知、工作安排或业务批办",
        "条件 L1/L2：对外称具有具体委派任务/特殊经办权时需要"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m005",
      "name": "005 · 申请人实名与任职/学籍状态",
      "purpose": "来源研究材料槽 M005。M005；申请人实名与任职/学籍状态；学校权威身份系统持有，可信会话/人员记录；当期 L0（系统事实），不是申请人身份证照片必交；如无接口由有权人员按最小必要核实，不能直接信前端角色；F007–F010；SRC-004/007；以身份源快照/时点关联；源失联 S，不要求重复上传敏感证件；同名冲突 C。仅按源模板的办理情形和阶段触发；权威校内记录可在授权后只读核验替代上传，不要求申请人在初次提交时预交后置材料。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      "maxCount": 9007199254740991,
      "requiredElements": [
        "M005",
        "申请人实名与任职/学籍状态",
        "学校权威身份系统持有，可信会话/人员记录",
        "当期 L0（系统事实），不是申请人身份证照片必交"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m006",
      "name": "006 · 被介绍/受托人的身份与隶属",
      "purpose": "来源研究材料槽 M006。M006；被介绍/受托人的身份与隶属；学校权威人事/学籍系统或合规外部身份核验方持有；条件 L1/L2：存在被介绍/授权自然人才需；同一可信实名目录记录可替代身份证复印件；F011–F013；SRC-004/006（仅特殊银行身份规则）；归受托主体与身份源，保留有效期；校外身份缺政策 U，读不到 S，姓名不一致 C。仅按源模板的办理情形和阶段触发；权威校内记录可在授权后只读核验替代上传，不要求申请人在初次提交时预交后置材料。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      "maxCount": 9007199254740991,
      "requiredElements": [
        "M006",
        "被介绍/受托人的身份与隶属",
        "学校权威人事/学籍系统或合规外部身份核验方持有",
        "条件 L1/L2：存在被介绍/授权自然人才需"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m007",
      "name": "007 · 出具单位与章种主管关系",
      "purpose": "来源研究材料槽 M007。M007；出具单位与章种主管关系；学校组织目录/党政办或部门管理方持有；当期 L0/L2（权威单位事实）；合法替代为有权部门确认的机构/印信登记，不是自己上传公章图片；F005–F007、F031；SRC-001/004/007/012；归单位/章种登记源；未接入 S，部门章冒作校章 C；章种制度缺失 U。仅按源模板的办理情形和阶段触发；权威校内记录可在授权后只读核验替代上传，不要求申请人在初次提交时预交后置材料。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      "maxCount": 9007199254740991,
      "requiredElements": [
        "M007",
        "出具单位与章种主管关系",
        "学校组织目录/党政办或部门管理方持有",
        "当期 L0/L2（权威单位事实）"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m008",
      "name": "008 · 原业务已形成的正式决定",
      "purpose": "来源研究材料槽 M008。M008；原业务已形成的正式决定；科研、合同、采购、财务等原业务 Owner 持有；条件 L2：只有函件内容依赖某业务批准才需要；若前置决定尚在办理，后续才产生而非 L1 缺件；只读原案为首选；F023–F027；SRC-005/006/010（技术去重）；归原案，不复制为本案批准；版本变更、撤销后旧结论失效 C；源不通 S，不能上传截图冒充。仅按源模板的办理情形和阶段触发；权威校内记录可在授权后只读核验替代上传，不要求申请人在初次提交时预交后置材料。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      "maxCount": 9007199254740991,
      "requiredElements": [
        "M008",
        "原业务已形成的正式决定",
        "科研、合同、采购、财务等原业务 Owner 持有",
        "条件 L2：只有函件内容依赖某业务批准才需要"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m009",
      "name": "009 · 签发/代理权限授权链",
      "purpose": "来源研究材料槽 M009。M009；签发/代理权限授权链；学校有权授权管理机关持有，正式任命、授权或章程职权记录；条件 L2/L3：拟以学校/部门名义形成代表权须核；合法替代只能是已确认的校本职权/授权来源；F032–F033；SRC-001/004/012；归授权管理方；该制度未取得 → POLICY_UNCONFIRMED；缺链不得推定有权，仿签不可读/存疑转人工。仅按源模板的办理情形和阶段触发；权威校内记录可在授权后只读核验替代上传，不要求申请人在初次提交时预交后置材料。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      "maxCount": 9007199254740991,
      "requiredElements": [
        "M009",
        "签发/代理权限授权链",
        "学校有权授权管理机关持有，正式任命、授权或章程职权记录",
        "条件 L2/L3：拟以学校/部门名义形成代表权须核"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m010",
      "name": "010 · 现行印章管理政策与受控章种清单",
      "purpose": "来源研究材料槽 M010。M010；现行印章管理政策与受控章种清单；党政办公室/机要科及主管部门持有，政策原件/版本；条件 L2/L4（权威政策）：查具体签发用印条件时必须获取；不作为申请人上传件；SRC-003 只证明曾审定；F022、F031–F032、F044–F045；SRC-002/003/012；归制度发布/维护单位；效力、修订、废止未知 U；政策断链 S，不能自动裁定。仅按源模板的办理情形和阶段触发；权威校内记录可在授权后只读核验替代上传，不要求申请人在初次提交时预交后置材料。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      "maxCount": 9007199254740991,
      "requiredElements": [
        "M010",
        "现行印章管理政策与受控章种清单",
        "党政办公室/机要科及主管部门持有，政策原件/版本",
        "条件 L2/L4（权威政策）：查具体签发用印条件时必须获取"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m011",
      "name": "011 · 法律、保密或专门归口审查意见",
      "purpose": "来源研究材料槽 M011。M011；法律、保密或专门归口审查意见；法治/保密/专业部门持有；条件 L2/L3：触发外部承诺、涉密、争议等才需；可信部门正式意见或人工复核可替代上传件；F018、F023–F027、F032；SRC-001/005；归意见制作机构；尚未作出时为后续 L，不是 L1 必交；未获意见保持人工决定待办。仅按源模板的办理情形和阶段触发；权威校内记录可在授权后只读核验替代上传，不要求申请人在初次提交时预交后置材料。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      "maxCount": 9007199254740991,
      "requiredElements": [
        "M011",
        "法律、保密或专门归口审查意见",
        "法治/保密/专业部门持有",
        "条件 L2/L3：触发外部承诺、涉密、争议等才需"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m012",
      "name": "012 · 有权正式签发/审批事件",
      "purpose": "来源研究材料槽 M012。M012；有权正式签发/审批事件；真实 OA 或纸质签批台账的有权管理方持有；后续 L3：不得作为 L0/L1 必交；可信签发台账/已核纸质原件可互为合法载体，不能靠章图替代；F032–F035、F044；SRC-001/002/012；归签发源和准确文稿版本；读不到 S，未产生 L，前端 approved 假值 C。仅按源模板的办理情形和阶段触发；权威校内记录可在授权后只读核验替代上传，不要求申请人在初次提交时预交后置材料。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      "maxCount": 9007199254740991,
      "requiredElements": [
        "M012",
        "有权正式签发/审批事件",
        "真实 OA 或纸质签批台账的有权管理方持有",
        "后续 L3：不得作为 L0/L1 必交"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m013",
      "name": "013 · 已定稿并正式出具的函件",
      "purpose": "来源研究材料槽 M013。M013；已定稿并正式出具的函件；正式签发/归档机构持有，可信电子原件或纸质原件核验；后续 L4；正式电子文件与有权核对的纸件是不同载体替代，不允许申请人新上传“定稿”即升级为签发件；F028–F030、F034–F036；SRC-001/009/012；归已发版本，保留与 M012 绑定的指纹；缺 L/S，文本与签发对象不一致 C。仅按源模板的办理情形和阶段触发；权威校内记录可在授权后只读核验替代上传，不要求申请人在初次提交时预交后置材料。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      "maxCount": 9007199254740991,
      "requiredElements": [
        "M013",
        "已定稿并正式出具的函件",
        "正式签发/归档机构持有，可信电子原件或纸质原件核验",
        "后续 L4"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m014",
      "name": "014 · 用印/有效电子签章记录",
      "purpose": "来源研究材料槽 M014。M014；用印/有效电子签章记录；机要科/部门印信管理方持有，章种、时间和验证证据；后续 L4（如适用）；合规电子签章验签与有权核对纸质用印登记各走本身合法路径；F031、F036–F038；SRC-001/002/009/012；归印章记录及最终文稿指纹；图像识别不构成认证；未产生 L，失联 S，伪造/失配 C。仅按源模板的办理情形和阶段触发；权威校内记录可在授权后只读核验替代上传，不要求申请人在初次提交时预交后置材料。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      "maxCount": 9007199254740991,
      "requiredElements": [
        "M014",
        "用印/有效电子签章记录",
        "机要科/部门印信管理方持有，章种、时间和验证证据",
        "后续 L4（如适用）"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m015",
      "name": "015 · 正式发送或送达回执",
      "purpose": "来源研究材料槽 M015。M015；正式发送或送达回执；发函部门/可信档案源持有，投递记录、邮寄详情或受文回执；后续 L4/L5（确有对外交付时）；可信收发台账可替代扫描件；F014–F015、F039；SRC-001/005（合同催告场景仅原合同 Owner）；归正式发函过程；未送达不得标送达；缺回执状态未知 S/L，不能推定对方已收到。仅按源模板的办理情形和阶段触发；权威校内记录可在授权后只读核验替代上传，不要求申请人在初次提交时预交后置材料。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      "maxCount": 9007199254740991,
      "requiredElements": [
        "M015",
        "正式发送或送达回执",
        "发函部门/可信档案源持有，投递记录、邮寄详情或受文回执",
        "后续 L4/L5（确有对外交付时）"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m016",
      "name": "016 · 补充材料及新版拟稿",
      "purpose": "来源研究材料槽 M016。M016；补充材料及新版拟稿；发起单位持有，差异说明、替代附件、修订文稿；条件 L1/L2：发生补件/勘误才需；字段级修正及重新提交文本可代整包重传；F014–F020、F028–F030、F040；SRC-001/012（权限条件仍未知）；新材料标 supersedesId，旧结论过期；不可读只要求受影响项补传。仅按源模板的办理情形和阶段触发；权威校内记录可在授权后只读核验替代上传，不要求申请人在初次提交时预交后置材料。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      "maxCount": 9007199254740991,
      "requiredElements": [
        "M016",
        "补充材料及新版拟稿",
        "发起单位持有，差异说明、替代附件、修订文稿",
        "条件 L1/L2：发生补件/勘误才需"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m017",
      "name": "017 · 变更/续期/扩权申请说明",
      "purpose": "来源研究材料槽 M017。M017；变更/续期/扩权申请说明；原发起单位或有权主体持有；条件 L5：续期、变更、扩权时才需；可信申请事件可替代独立纸质表；F017、F019–F020、F040–F041；SRC-001/004/012；归原函及新请求；缺说明则 N，旧函无法读取 S；不能自动延长已有授权。仅按源模板的办理情形和阶段触发；权威校内记录可在授权后只读核验替代上传，不要求申请人在初次提交时预交后置材料。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      "maxCount": 9007199254740991,
      "requiredElements": [
        "M017",
        "变更/续期/扩权申请说明",
        "原发起单位或有权主体持有",
        "条件 L5：续期、变更、扩权时才需"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m018",
      "name": "018 · 撤回、异议或复核请求",
      "purpose": "来源研究材料槽 M018。M018；撤回、异议或复核请求；有相应资格的申请人/利害关系人持有（资格待校本核）；条件 L1–L5：实际提出撤回/异议才需；系统可信办件请求可替代附件；F001、F040–F043；SRC-001/012；与原案、争议字段及旧版本关联；缺具体请求内容 N；涉及法律效力由有权人处理。仅按源模板的办理情形和阶段触发；权威校内记录可在授权后只读核验替代上传，不要求申请人在初次提交时预交后置材料。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      "maxCount": 9007199254740991,
      "requiredElements": [
        "M018",
        "撤回、异议或复核请求",
        "有相应资格的申请人/利害关系人持有（资格待校本核）",
        "条件 L1–L5：实际提出撤回/异议才需"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m019",
      "name": "019 · 旧函及既有签发/送达档案",
      "purpose": "来源研究材料槽 M019。M019；旧函及既有签发/送达档案；原归档/印信/发送机构持有；条件 L5：已发函变更/撤销/复核才需；原归档 ID/可信来源优于用户旧扫描件；F034–F039、F041；SRC-001/009/012；归历史正式文件不可覆盖；源失联 S、旧稿被篡改 C；待取得后再评价。仅按源模板的办理情形和阶段触发；权威校内记录可在授权后只读核验替代上传，不要求申请人在初次提交时预交后置材料。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      "maxCount": 9007199254740991,
      "requiredElements": [
        "M019",
        "旧函及既有签发/送达档案",
        "原归档/印信/发送机构持有",
        "条件 L5：已发函变更/撤销/复核才需"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m020",
      "name": "020 · 有权复核/撤回及对外效力处置结果",
      "purpose": "来源研究材料槽 M020。M020；有权复核/撤回及对外效力处置结果；原签发机构、复核机构或法治部门持有；后续 L5：只能在相应人工决定作出之后形成；正式决定及通知留痕可作为不同证据；F042–F043；SRC-001/004/012；归权威决定及外部通知版本；未产生 L，来源不可取 S；AI 不得生成有法律效力的撤销结论。仅按源模板的办理情形和阶段触发；权威校内记录可在授权后只读核验替代上传，不要求申请人在初次提交时预交后置材料。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      "maxCount": 9007199254740991,
      "requiredElements": [
        "M020",
        "有权复核/撤回及对外效力处置结果",
        "原签发机构、复核机构或法治部门持有",
        "后续 L5：只能在相应人工决定作出之后形成"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m021",
      "name": "021 · 多人/转委托的有效授权授予与撤销链",
      "purpose": "来源研究材料槽 M021。M021；多人/转委托的有效授权授予与撤销链；原授予机关或有权授权登记方持有；条件 L2/L3：涉及多受托人、代领、复代理、权限变更才查询；可引用可信授权事件及历史，不是申请人必传格式表；F046–F049/F032；R027；SRC-004/012/014（014 外校仅结构对照）；按授予人/受托集合/生效及撤销时点/地域目的/源版本绑定；无源 S、政策未知 U、链冲突 C；不能从普通介绍信推出转委托权。仅按源模板的办理情形和阶段触发；权威校内记录可在授权后只读核验替代上传，不要求申请人在初次提交时预交后置材料。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      "maxCount": 9007199254740991,
      "requiredElements": [
        "M021",
        "多人/转委托的有效授权授予与撤销链",
        "原授予机关或有权授权登记方持有",
        "条件 L2/L3：涉及多受托人、代领、复代理、权限变更才查询"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m022",
      "name": "022 · 拟外发名单/数据/科研内容的最小化核对与披露决定",
      "purpose": "来源研究材料槽 M022。M022；拟外发名单/数据/科研内容的最小化核对与披露决定；数据/科研/宣传/信息公开归口持有；条件 L2/L3：涉及个人数据、涉密疑似、科研未公开成果或信息公开才查；专项权威决定或有权审查记录只读替代；F016/F018/F050–F051；R028；SRC-013/015/016；归内容拥有者及拟收件机构；草稿仅风险线索，不能直接外发；失联 S、风险待判 H、政策 U。仅按源模板的办理情形和阶段触发；权威校内记录可在授权后只读核验替代上传，不要求申请人在初次提交时预交后置材料。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      "maxCount": 9007199254740991,
      "requiredElements": [
        "M022",
        "拟外发名单/数据/科研内容的最小化核对与披露决定",
        "数据/科研/宣传/信息公开归口持有",
        "条件 L2/L3：涉及个人数据、涉密疑似、科研未公开成果或信息公开才查"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m023",
      "name": "023 · 已发函撤销/更正/追回通知与相对方收悉证据",
      "purpose": "来源研究材料槽 M023。M023；已发函撤销/更正/追回通知与相对方收悉证据；原签发/发函档案机构及收件方持有；后续 L5：有正式处置决定且确需通知后才形成；发函台账、邮递证据、收件确认分别核，不由初始申请人预交；F039/F041–F043/F052；R029；SRC-001/005/012；绑定旧函 ID、通知指纹、对象、发送和收悉时点；无回执不猜“已知悉”，对外效力仍由有权机关裁定。仅按源模板的办理情形和阶段触发；权威校内记录可在授权后只读核验替代上传，不要求申请人在初次提交时预交后置材料。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      "maxCount": 9007199254740991,
      "requiredElements": [
        "M023",
        "已发函撤销/更正/追回通知与相对方收悉证据",
        "原签发/发函档案机构及收件方持有",
        "后续 L5：有正式处置决定且确需通知后才形成"
      ],
      "allowReuseAcrossSubjects": false
    }
  ],
  "sections": [
    {
      "id": "entry-identity-authority",
      "name": "入口、身份与权限事实",
      "description": "按原研究稿规则章节分组；用于本地研究预审，不构成校方审批流程或正式授权。",
      "order": 0,
      "required": true,
      "criteria": [
        {
          "id": "r001",
          "title": "案卷可信主状态",
          "requirement": "源研究规则 R001。T=执行本案核验；F=纯离线文件研究不创建运行；U=无法确证是否同一案；SRC-010/SRC-013（仅技术与总账线索）；F001–F003/F045；M001；对主状态 ID、CAS 版本、真实阶段及材料 ownerCaseId 进行一致性校验；高=唯一案卷 Owner；不信前端 caseId；并发更新重取快照；不制造 run@rev；一致 PASS_FACT；主状态/源不可用 SOURCE_UNAVAILABLE（另记工程阻断），跨案混挂 CONFLICT → 案卷 Owner。执行边界：仅形成可追溯事实预审、风险提示或待办；校内政策适用/现行性/权限未知时必须人工复核，禁止由此生成正式批准或拒绝。",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "r002",
          "title": "实质目的及路由",
          "requirement": "源研究规则 R002。T=可识别拟对外函的目的；F=既非本校出函则本模板其余规则 N/A；U=目的/类别不清；SRC-001/SRC-005/SRC-006/SRC-010/SRC-011/SRC-013；F004/F016/F018；M001/M002；读 M001 用途与（若已有）M002 真实效果，不凭标题；合同/采购/科研、公文、个人证明、财务专项优先分流；中=材料声明，高=原归口确认；明确候选事实 PASS_FACT（只说明分流），不清 NEEDS_MATERIAL/NEEDS_HUMAN_DECISION → 党政办/相邻业务归口。执行边界：仅形成可追溯事实预审、风险提示或待办；校内政策适用/现行性/权限未知时必须人工复核，禁止由此生成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r003",
          "title": "出具主体与单位名义",
          "requirement": "源研究规则 R003。T=拟以学校、党委或校内单位名义出函；F=仅接收校外来函；U=章名或独立法人身份不清；SRC-001/SRC-004/SRC-007/SRC-012；F005–F007/F031；M001/M002/M007；比对抬头、权威组织树、出具级别与章种主管关系；高=机构/印信登记，中=草稿；部门章不可升格为学校章，按拟签时点核单位存续；校本准许哪些名义仍未证实；名义一致可 PASS_FACT（不是有权出函）；不一致 CONFLICT；权限范畴未知 POLICY_UNCONFIRMED → 机构归口/党政办机要。执行边界：仅形成可追溯事实预审、风险提示或待办；校内政策适用/现行性/权限未知时必须人工复核，禁止由此生成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r004",
          "title": "申请人身份和真实委办关系",
          "requirement": "源研究规则 R004。T=本人或单位代理发起；F=非申请动作；U=身份、校区或任职关系未知；SRC-004/SRC-006/SRC-007；F007–F010/F045；M001/M005；可信 Main 登录 actor 与 AUTH 有效任职/学籍、单位、校区核对；高=实名源，低=申请表；跨校区不设不同门槛；SRC-006 的学生限制只对 C07 生效；可核身份 PASS_FACT；无可信源 SOURCE_UNAVAILABLE；自称职位冲突 CONFLICT；是否有申请权未知 POLICY_UNCONFIRMED → 身份/单位归口。执行边界：仅形成可追溯事实预审、风险提示或待办；校内政策适用/现行性/权限未知时必须人工复核，禁止由此生成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r005",
          "title": "被介绍/授权人的唯一身份与关系",
          "requirement": "源研究规则 R005。T=正文点名受介绍或受托人；F=不涉及自然人（如部分 C04）；U=是否代表某具体人不明；SRC-004/SRC-006/SRC-012；F011–F013/F009；M002/M006；以可信主体 ID、姓名变更历史、所属关系及有效期核对，不能同名匹配；校外主体用有权人核实的合法身份凭证；学生受托一般资格无全校来源；匹配 PASS_FACT；双人重名 CONFLICT；源失联 SOURCE_UNAVAILABLE；校外/学生是否可受托 POLICY_UNCONFIRMED → 人事学籍/业务归口。执行边界：仅形成可追溯事实预审、风险提示或待办；校内政策适用/现行性/权限未知时必须人工复核，禁止由此生成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r006",
          "title": "受文对象与外方要求一致性",
          "requirement": "源研究规则 R006。T=正文指明对外收件机构；F=仅 L0 分流尚未形成正文；U=组织更名/外方要求真伪不明；SRC-001/SRC-012（仅归口/政策缺口）；F014–F015/F021；M002/M003；中=可溯外方正式要求，低=自填地址，比较全称、收函部门和被指定对象；无外方 M003 且无特殊要求时不强制其上传；按外方通知时点核 D0；可证一致 PASS_FACT；名称/对象失配 CONFLICT；确需澄清时 NEEDS_MATERIAL → 经办人与收函归口。执行边界：仅形成可追溯事实预审、风险提示或待办；校内政策适用/现行性/权限未知时必须人工复核，禁止由此生成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r007",
          "title": "公务任务及事实来源",
          "requirement": "源研究规则 R007。T=以特定公务派遣、事实或职权为依据；F=单纯咨询、不宣称已授权事务；U=任务来源不清；SRC-001/SRC-004；F016/F023/F018；M001/M002/M004；核拟表述与当期任务通知/归口工作记录；高=可信任务归口，中=可核发文，低=口头自述；即使事实成立也不因此授予代表权；任务尚未分配不得臆造；事实可证 PASS_FACT；缺由发起人提供的任务说明 NEEDS_MATERIAL；可信任务源断 SOURCE_UNAVAILABLE → 业务归口。执行边界：仅形成可追溯事实预审、风险提示或待办；校内政策适用/现行性/权限未知时必须人工复核，禁止由此生成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r008",
          "title": "授权行为、权责风险与越界",
          "requirement": "源研究规则 R008。T=存在授权行为或对外承诺；F=纯事实介绍无授权行为；U=语义、外部法律效果含混；SRC-001/SRC-004/SRC-005/SRC-012；F016–F018/F026；M002/M004/M011；比较可实施行为、对象、限制和责任承担，不靠“普通介绍信”标题降级；高=原有权结论、法治审查，低=OCR 风险分类；签约、处分、担保、涉密须转原业务/法治；不设金额硬阈值；权限文本与基础决定不一致 CONFLICT；明确高风险 NEEDS_HUMAN_DECISION；校本可授权范围不明 POLICY_UNCONFIRMED → 法治/保密/原业务。执行边界：仅形成可追溯事实预审、风险提示或待办；校内政策适用/现行性/权限未知时必须人工复核，禁止由此生成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r009",
          "title": "时间、有效期和截止",
          "requirement": "源研究规则 R009。T=提出有效区间或声称 D0/D1；F=无时间主张且制度未要求；U=校本时限、起算点未知；SRC-002/SRC-003/SRC-012；F019–F022/F044；M002/M003/M010；日期顺序/外部通知 D0 可作文本事实比对；高=有权已核日期和现行校本制度，中=外方通知；D1 必须有来源原文，不设统一工作日上限；到期事实≠自动撤销外部效力；明显日期自相矛盾 CONFLICT，可证日期 PASS_FACT；D1/授权期限合法性未知 POLICY_UNCONFIRMED → 经办/制度主管/有权人。执行边界：仅形成可追溯事实预审、风险提示或待办；校内政策适用/现行性/权限未知时必须人工复核，禁止由此生成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r010",
          "title": "前置业务决定只读有效性",
          "requirement": "源研究规则 R010。T=拟函声称某项正式业务已获批准；F=未引用其他业务决定；U=原案是否形成决定未知；SRC-005/SRC-006/SRC-010/SRC-013；F023–F027/F045；M004/M008；必须比 sourceCaseId+decisionId+version+subject+scope+effectiveState+有效期间，高=原业务 Owner；申报截图不得当已批；前置尚待产生不是 L1 缺件，先等待原归口；有效且对象范围一致 PASS_FACT；撤回/不符 CONFLICT；权威查询失联 SOURCE_UNAVAILABLE；尚未决定 NEEDS_HUMAN_DECISION（等待原业务）→ 原业务 Owner。执行边界：仅形成可追溯事实预审、风险提示或待办；校内政策适用/现行性/权限未知时必须人工复核，禁止由此生成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r011",
          "title": "草稿可读、版本与全文指纹",
          "requirement": "源研究规则 R011。T=进入文本事实预审或提交新版；F=仅 L0 分流/C15 历史核对；U=草稿是否最终当前版本不明；SRC-001/SRC-002（仅业务存在，非格式硬标准）；F028–F030/F002；M002/M016；对当前 docId、version、完整文件 hash、正文抽取及扫描页归属核对；低=OCR，须回原页；同名文件不等价；补件后旧材料不可继续标当前；当前稿可读且身份版本一致 PASS_FACT；当前稿缺 NEEDS_MATERIAL；损坏/OCR 不可读 UNREADABLE；指纹与源版本冲突 CONFLICT → 经办/材料审阅员。执行边界：仅形成可追溯事实预审、风险提示或待办；校内政策适用/现行性/权限未知时必须人工复核，禁止由此生成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r012",
          "title": "纸质或电子印章渠道辨识",
          "requirement": "源研究规则 R012。T=申请明确章种/渠道或 L4 确有用印；F=仅无需用印的 L0；U=适用章种与校本登记不明；SRC-002/SRC-003/SRC-009/SRC-012；F005/F031/F044–F045；M007/M010；仅核渠道类型和可否找到对应受控章种记录；高=校印信台账，通用电子章规则只管载体真实性；“红色章图”不能推断有效签批，2025 表单标题不能当审批门槛；可证渠道对应 PASS_FACT（非准印）；章种名义失配 CONFLICT；校本规则不明 POLICY_UNCONFIRMED → 机要/部门印信。执行边界：仅形成可追溯事实预审、风险提示或待办；校内政策适用/现行性/权限未知时必须人工复核，禁止由此生成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r013",
          "title": "签发或代理授权链是否存在并覆盖事项",
          "requirement": "源研究规则 R013。T=要求以学校/有权单位名义形成代表权；F=仅分流，不进入签发；U=签发权主体与现行制度未确定；SRC-001/SRC-004/SRC-008/SRC-012；F017/F032/F044/F045；M009/M010；高=正式职权/书面授权及其期限撤销记录，按签发时点逐项比主体、事项、地域/受文者、期限、复代理；章程法人代表身份不等于任意人可代签；SRC-008 仅合同公告标题而非名单；有来源可证的授权链事实 PASS_FACT，不代表已作本次签发；链冲突 CONFLICT；无现行权限依据 POLICY_UNCONFIRMED → 授权管理机构/有权签发人。执行边界：仅形成可追溯事实预审、风险提示或待办；校内政策适用/现行性/权限未知时必须人工复核，禁止由此生成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        }
      ]
    },
    {
      "id": "specialist-review-and-formal-events",
      "name": "专项审查、签发与正式出件",
      "description": "按原研究稿规则章节分组；用于本地研究预审，不构成校方审批流程或正式授权。",
      "order": 1,
      "required": true,
      "criteria": [
        {
          "id": "r014",
          "title": "法治、保密或专项审查前置",
          "requirement": "源研究规则 R014。T=含秘密、法律承诺、重大权责争议等；F=无相应风险信号且归口确认不要求；U=风险边界未确认；SRC-001/SRC-005/SRC-012；F017–F018/F023/F026；M002/M008/M011；风险提取只是提示；高=有权专项审查结论，时点/版本必须匹配当前内容；审查意见在 L2/L3 才可能产生；不能让申请人初稿附“预批准”；风险待裁量 NEEDS_HUMAN_DECISION；专项结论与草稿冲突 CONFLICT；审查权限规则未知 POLICY_UNCONFIRMED → 法治/保密/专业归口。执行边界：仅形成可追溯事实预审、风险提示或待办；校内政策适用/现行性/权限未知时必须人工复核，禁止由此生成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r015",
          "title": "真实签发主体与正式决定",
          "requirement": "源研究规则 R015。T=进入真实送签或要证明已有签发；F=L0–L2 尚未送签；U=正式签批渠道/权限未知；SRC-001/SRC-002/SRC-004/SRC-012；F030/F032–F035/F044；M009/M012；高=可信签批事件（actor、时间、权限版本、批准稿指纹、同意/退回/撤销状态）；不接收 Renderer approved=true、签名图片、印章替代；L3 尚未作决定时属正常等待；记录事实一致可 PASS_FACT（绝非代签）；无可信签批源 SOURCE_UNAVAILABLE，不同稿/主体 CONFLICT；真需审批决定 NEEDS_HUMAN_DECISION → 有权签发人/OA Owner。执行边界：仅形成可追溯事实预审、风险提示或待办；校内政策适用/现行性/权限未知时必须人工复核，禁止由此生成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r016",
          "title": "正式函全文与被批准稿对应",
          "requirement": "源研究规则 R016。T=存在已正式出具件；F=尚无 L3 签发；U=正式版归属不明；SRC-001/SRC-009/SRC-012；F028–F030/F034–F036；M002/M012/M013；高=签发档案和正式件；全文指纹、受文方/姓名/权限及变更事件比对；纸质扫描需授权核对原件；只改错字也不能自己判为“无需再签”；一致 PASS_FACT（仅版本事实）；不一致 CONFLICT；权威正式件无从获取 SOURCE_UNAVAILABLE → 发文/归档 Owner。执行边界：仅形成可追溯事实预审、风险提示或待办；校内政策适用/现行性/权限未知时必须人工复核，禁止由此生成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r017",
          "title": "印章验证与用印记录对应",
          "requirement": "源研究规则 R017。T=称已用印或已签电子章；F=L0–L3、无用印事件；U=是否存在合法电子签名对象不明；SRC-001/SRC-002/SRC-009/SRC-012；F031/F036–F038；M010/M013/M014；高=可信印信登记及有效电子验签元数据；纸质由有权人核原件；证书、盖章时点、文稿指纹、章种均应对应；外观圆章图片为低级线索；可核“印章记录一致” PASS_FACT；签章对象不符 CONFLICT，数据不可解 UNREADABLE，管理源失联 SOURCE_UNAVAILABLE → 印信管理人。执行边界：仅形成可追溯事实预审、风险提示或待办；校内政策适用/现行性/权限未知时必须人工复核，禁止由此生成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r018",
          "title": "交付/送达事实可追溯",
          "requirement": "源研究规则 R018。T=对外声称已发/已送达；F=仍未发送；U=对方接收/实际送达不明；SRC-001/SRC-005（仅归口与合同排除）；F014–F015/F036/F039；M013/M015；高=正式收发/投递台账、受文方回执；比较发送件指纹、对象、时点及撤回通知；普通邮件“已发送”不必然证明对方收到；合同催告由原合同 Owner 判；有可证发送事实 PASS_FACT（不判法律送达）；对象/版本不符 CONFLICT；查不到台账 SOURCE_UNAVAILABLE → 发函/归档 Owner。执行边界：仅形成可追溯事实预审、风险提示或待办；校内政策适用/现行性/权限未知时必须人工复核，禁止由此生成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r019",
          "title": "未签发前的补件/换稿影响范围",
          "requirement": "源研究规则 R019。T=替换材料或更正草稿；F=内容/源版本未改变；U=两版本不可辨；SRC-001/SRC-012（不支持自动免重批）；F002/F014–F020/F028–F030/F040；M002/M016；比 materialId+version+hash+supersedesId 和字段差异，沿 11.3 的 R 依赖图只重审受影响事实；已签发版变更升级为 R016/R020；当前稿不可读不覆盖旧日志；差异与归属可核 PASS_FACT（只是重审范围已识别）；缺新稿 NEEDS_MATERIAL；版本串案 CONFLICT → 案卷 Owner/经办。执行边界：仅形成可追溯事实预审、风险提示或待办；校内政策适用/现行性/权限未知时必须人工复核，禁止由此生成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r020",
          "title": "已发函续期、扩权或换受托人",
          "requirement": "源研究规则 R020。T=旧函已出且欲扩范围/延时/变更；F=尚未出函的普通勘误；U=旧函效力/授权起止不明；SRC-001/SRC-004/SRC-012；F017/F019–F020/F040–F041/F044；M017/M019/M009；高=旧函档案及旧授权链，检查旧新受托主体、权限、期限、相对方、签发时点；旧章/签批不得复制；是否需撤销旧件由有权主体判断；旧新差异可证 PASS_FACT（非同意续期）；新权能 NEEDS_HUMAN_DECISION；旧档案失联 SOURCE_UNAVAILABLE → 原签发与授权主管。执行边界：仅形成可追溯事实预审、风险提示或待办；校内政策适用/现行性/权限未知时必须人工复核，禁止由此生成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r021",
          "title": "撤回与已发件撤销效力区分",
          "requirement": "源研究规则 R021。T=申请人或有权人请求撤回/撤销；F=无撤回动作；U=请求人资格/函是否已送达不清；SRC-001/SRC-004/SRC-012；F003/F034–F043；M018/M019/M020；核可信请求、原案阶段、旧正式件、送达及可能通知；在未签发阶段可登记请求，并不等于用户单方取得签发机关撤销决定；已发件外部效果不能自动置为无效；请求事实 PASS_FACT；未发可进入人工/可信状态确认；已发必须 NEEDS_HUMAN_DECISION；旧档案不可查 SOURCE_UNAVAILABLE → 原签发机关/法治。执行边界：仅形成可追溯事实预审、风险提示或待办；校内政策适用/现行性/权限未知时必须人工复核，禁止由此生成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r022",
          "title": "异议/复核请求与有权结果",
          "requirement": "源研究规则 R022。T=有明确事实异议/权限争议；F=无异议；U=受理主体/期限或资格不明；SRC-001/SRC-004/SRC-012；F008/F024–F027/F040/F042–F043；M016/M018/M020；对争议规则、所据材料版本、原决定 ID、申请人与争议关系建链接；有权复核意见仅后续产生，不能把 AI 二次意见写作正式复核；当前无统一期限来源；异议登记事实 PASS_FACT；证据冲突 CONFLICT；正式权限/期限 POLICY_UNCONFIRMED；裁量 NEEDS_HUMAN_DECISION → 事实原归口/有权复核机关。执行边界：仅形成可追溯事实预审、风险提示或待办；校内政策适用/现行性/权限未知时必须人工复核，禁止由此生成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r023",
          "title": "已出正式件链条反向验证",
          "requirement": "源研究规则 R023。T=发起既发件真实性/一致性核对；F=新申请未出件；U=是否正式出函不明；SRC-001/SRC-002/SRC-009/SRC-012；F034–F039/F041/F045；M012–M015/M019；由档案反查签发 actor、批准稿版本、印章登记与送达；高=各独立台账，不由单张 PDF 推出全链；已发某步记录缺失应单独待核；对外效力仍属人工；各台账一致 PASS_FACT（仅可追溯）；源缺 SOURCE_UNAVAILABLE；存在明确版本/对象不符 CONFLICT → 档案/印信/有权签发。执行边界：仅形成可追溯事实预审、风险提示或待办；校内政策适用/现行性/权限未知时必须人工复核，禁止由此生成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r024",
          "title": "G50 与邻接 S/T 的实质边界",
          "requirement": "源研究规则 R024。T=正文触及个人证明、科研公开、信息公开、宣传、公文或专项业务；F=真实普通公务介绍/特定经办；U=实质权利/对象归属不清；SRC-001/SRC-005/SRC-010/SRC-011/SRC-013；F004/F014/F016/F018；M001/M002；R02 总账已实读；技术 G50 只作候选边界，不授予审批；个人证明 G01、科研公开 G06、正式公文 T07-T01 和宣传/信息公开按实体决定目的路由，具体衔接业务数据源仍待核；可证目录分流 PASS_FACT（不重复决定）；单案实质有争议时 NEEDS_HUMAN_DECISION → 目录 Owner/原业务归口。执行边界：仅形成可追溯事实预审、风险提示或待办；校内政策适用/现行性/权限未知时必须人工复核，禁止由此生成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r025",
          "title": "银行资信专项受托人资格的防串用",
          "requirement": "源研究规则 R025。T=确定为 SRC-006 的银行资信证明委托；F=一般 C01/C03，不适用“学生不可代办”限制；U=是否该专项不清；SRC-006；F004/F009/F011/F023–F025；M001/M005/M006/M008；依据财务处专项文本，委托的受托人应为学校教职工、不得学生；身份高=学校人员记录；专项财务 OA 批准、财务取材和校办用印为专属阶段，不在本 ID 再审批；指南更新待核；可核“专项身份与路由” PASS_FACT；明知学生代办与专项规则相悖 CONFLICT 并转财务处处理；源不通 SOURCE_UNAVAILABLE → 财务专项 Owner。执行边界：仅形成可追溯事实预审、风险提示或待办；校内政策适用/现行性/权限未知时必须人工复核，禁止由此生成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r026",
          "title": "校本政策现行性与授权断链",
          "requirement": "源研究规则 R026。T=拟依据某校本制度作权限/章种/时限/撤销裁定；F=仅核可读事实而不主张合法权限；U=是否有对应制度、规则版本或废止史不明；SRC-002/SRC-003/SRC-008/SRC-012/SRC-013；F022/F032/F044–F045；M009/M010；政策原文须有发布机关、文号、条款、施行/修订/废止、适用章种/对象及核验时间；首页表单、会议通报、旧公告、其他高校文件均不能填补；高=学校制度原件及授权管理方确认；有完整现行来源才可报告“政策文本可核对” PASS_FACT（仍非批准）；现阶段主要为 POLICY_UNCONFIRMED；政策服务器不可读 SOURCE_UNAVAILABLE → 党政办制度主管/目录维护方。执行边界：仅形成可追溯事实预审、风险提示或待办；校内政策适用/现行性/权限未知时必须人工复核，禁止由此生成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        }
      ]
    },
    {
      "id": "delegation-disclosure-revocation",
      "name": "委托集合、对外披露与撤销",
      "description": "按原研究稿规则章节分组；用于本地研究预审，不构成校方审批流程或正式授权。",
      "order": 2,
      "required": true,
      "criteria": [
        {
          "id": "r027",
          "title": "受托集合、共同代理与转委托链",
          "requirement": "源研究规则 R027。T=正文涉及多人分别/共同代理、转委托或受托人变更；F=单人普通介绍无代理职权；U=是否转委托或人数/方式不明；SRC-004/SRC-012/SRC-014（外校仅变体）；F011–F013/F017/F046–F049；M002/M006/M009/M021；L1 只提取受托人集合及建议行为，L2 核原授予机关可信 grant ID、各受托人唯一身份、分别/共同范围、有效期、撤销时点和复代理条款；政策尚缺不得从单一章图推导转委托权；M021 不是 L1 必交；受托集合与真实授权链事实一致才 PASS_FACT；人/范围/版本不符 CONFLICT；权威链无法取 SOURCE_UNAVAILABLE；复代理许可制度不明 POLICY_UNCONFIRMED；权利授予仍 NEEDS_HUMAN_DECISION → 原授权管理机关/法治。执行边界：仅形成可追溯事实预审、风险提示或待办；校内政策适用/现行性/权限未知时必须人工复核，禁止由此生成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r028",
          "title": "对外披露内容与合法收件目的匹配",
          "requirement": "源研究规则 R028。T=拟函或附件向外方披露个人、敏感、科研非公开、涉密疑似或官方信息公开内容；F=无上述披露对象且有权归口确认无须专项审查；U=敏感性/用途未确定；SRC-001/SRC-013/SRC-015/SRC-016；F014/F016/F018/F050–F051；M002/M008/M011/M022；L1 标记具体段落/人员 ID/受文者；L2 查合法处理基础、最小必要字段、原科研权属/数据/信息公开决策及保密审查（只读）；若疑似涉密禁止上传公开云服务进行模型判别；G02/G06/T07-T06/T07-T07 原业务不重复批准；清楚确认不含禁止披露且内容与已有权威许可一致的事实可 PASS_FACT，仍非发函批准；超披露范围 CONFLICT；原决定源不可用 SOURCE_UNAVAILABLE；定密/合法公开判断 NEEDS_HUMAN_DECISION；校本披露流程不明 POLICY_UNCONFIRMED → 数据持有/科研/保密/信息公开归口。执行边界：仅形成可追溯事实预审、风险提示或待办；校内政策适用/现行性/权限未知时必须人工复核，禁止由此生成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r029",
          "title": "撤销/更正通知与收件回执真实性",
          "requirement": "源研究规则 R029。T=有权机关已形成要求对外通知的处置决定；F=仅在 L0–L3 撤回请求或尚无通知义务决定；U=是否已正式决定通知对象不明；SRC-001/SRC-005/SRC-012；F039/F041–F043/F052；M015/M019/M020/M023；核正式处置决定 ID、旧函 ID、新通知指纹、受文方、发出/收悉各事件及时间，不以短信截屏或申请人点击撤回替代权威回执；R029 不评判对外撤销的法律效力，交 R021/原机关；已证明通知发送/收到的对应事实 PASS_FACT 并标事实范围；通知对象或版本不符 CONFLICT；受控源失联 SOURCE_UNAVAILABLE；只有寄出证据时不能记“已收悉” NEEDS_HUMAN_DECISION（查收件方）→ 原签发/发函档案与法治。执行边界：仅形成可追溯事实预审、风险提示或待办；校内政策适用/现行性/权限未知时必须人工复核，禁止由此生成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        }
      ]
    }
  ],
  "policyVersionIds": [],
  "stages": [
    {
      "id": "local-intake",
      "name": "L0/L1：本地事项、身份和拟函版本核验（非校方受理）",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "workflowOwner": "local",
      "nextStageId": "local-authority-review"
    },
    {
      "id": "local-authority-review",
      "name": "L2/L3：本地权限链、专项意见与正式事件证据预审（不签发函件）",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "workflowOwner": "local",
      "nextStageId": "local-human-gate",
      "returnToStageId": "local-intake"
    },
    {
      "id": "local-human-gate",
      "name": "L4/L5：人工复核与签发、用印、送达或撤销事实交接（非正式决定）",
      "kind": "finalize",
      "executorRole": "teacher",
      "workflowOwner": "local"
    }
  ],
  "outputs": [
    {
      "id": "local-fact-findings",
      "kind": "item-feedback",
      "audience": "reviewer"
    },
    {
      "id": "local-supplement-todos",
      "kind": "supplement-list",
      "audience": "reviewer"
    },
    {
      "id": "local-human-handoff",
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

/** Research-source traceability only; SRC IDs are not case SourceRef values. */
export const r02Metadata = {
  "templateId": "T07-T03",
  "name": "单位授权函、介绍信与对外正式函件核验",
  "sourceDocumentPath": "docs/design/review-agent/business-templates/R02/T07-T03.md",
  "sourceDocumentSha256": "67cc4b482332adcb5978d0f440f1fb004f595fb78e3f0ae80a4d4e31d4c5e183",
  "sourceDocumentBytes": 152330,
  "sourceOriginalPath": "docs/design/review-agent/business-templates/R02/research-original/T07-T03.md",
  "officialSchoolTemplate": false,
  "researchAsOf": "2026-10-23",
  "reviewedAt": "2026-10-24",
  "researchEvidenceStatus": "PARTIAL",
  "policyEvidenceStatus": "PARTIAL",
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
    "SRC-013",
    "SRC-014",
    "SRC-015",
    "SRC-016"
  ],
  "fieldIds": [
    "F001",
    "F002",
    "F003",
    "F004",
    "F005",
    "F006",
    "F007",
    "F008",
    "F009",
    "F010",
    "F011",
    "F012",
    "F013",
    "F014",
    "F015",
    "F016",
    "F017",
    "F018",
    "F019",
    "F020",
    "F021",
    "F022",
    "F023",
    "F024",
    "F025",
    "F026",
    "F027",
    "F028",
    "F029",
    "F030",
    "F031",
    "F032",
    "F033",
    "F034",
    "F035",
    "F036",
    "F037",
    "F038",
    "F039",
    "F040",
    "F041",
    "F042",
    "F043",
    "F044",
    "F045",
    "F046",
    "F047",
    "F048",
    "F049",
    "F050",
    "F051",
    "F052"
  ],
  "materialSlotIds": [
    "M001",
    "M002",
    "M003",
    "M004",
    "M005",
    "M006",
    "M007",
    "M008",
    "M009",
    "M010",
    "M011",
    "M012",
    "M013",
    "M014",
    "M015",
    "M016",
    "M017",
    "M018",
    "M019",
    "M020",
    "M021",
    "M022",
    "M023"
  ],
  "criteria": [
    {
      "sectionId": "entry-identity-authority",
      "criterionId": "r001",
      "srcIds": [
        "SRC-010",
        "SRC-013"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "entry-identity-authority",
      "criterionId": "r002",
      "srcIds": [
        "SRC-001",
        "SRC-005",
        "SRC-006",
        "SRC-010",
        "SRC-011",
        "SRC-013"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "entry-identity-authority",
      "criterionId": "r003",
      "srcIds": [
        "SRC-001",
        "SRC-004",
        "SRC-007",
        "SRC-012"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "entry-identity-authority",
      "criterionId": "r004",
      "srcIds": [
        "SRC-004",
        "SRC-006",
        "SRC-007"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "entry-identity-authority",
      "criterionId": "r005",
      "srcIds": [
        "SRC-004",
        "SRC-006",
        "SRC-012"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "entry-identity-authority",
      "criterionId": "r006",
      "srcIds": [
        "SRC-001",
        "SRC-012"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "entry-identity-authority",
      "criterionId": "r007",
      "srcIds": [
        "SRC-001",
        "SRC-004"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "entry-identity-authority",
      "criterionId": "r008",
      "srcIds": [
        "SRC-001",
        "SRC-004",
        "SRC-005",
        "SRC-012"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "entry-identity-authority",
      "criterionId": "r009",
      "srcIds": [
        "SRC-002",
        "SRC-003",
        "SRC-012"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "entry-identity-authority",
      "criterionId": "r010",
      "srcIds": [
        "SRC-005",
        "SRC-006",
        "SRC-010",
        "SRC-013"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "entry-identity-authority",
      "criterionId": "r011",
      "srcIds": [
        "SRC-001",
        "SRC-002"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "entry-identity-authority",
      "criterionId": "r012",
      "srcIds": [
        "SRC-002",
        "SRC-003",
        "SRC-009",
        "SRC-012"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "entry-identity-authority",
      "criterionId": "r013",
      "srcIds": [
        "SRC-001",
        "SRC-004",
        "SRC-008",
        "SRC-012"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "specialist-review-and-formal-events",
      "criterionId": "r014",
      "srcIds": [
        "SRC-001",
        "SRC-005",
        "SRC-012"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "specialist-review-and-formal-events",
      "criterionId": "r015",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-004",
        "SRC-012"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "specialist-review-and-formal-events",
      "criterionId": "r016",
      "srcIds": [
        "SRC-001",
        "SRC-009",
        "SRC-012"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "specialist-review-and-formal-events",
      "criterionId": "r017",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-009",
        "SRC-012"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "specialist-review-and-formal-events",
      "criterionId": "r018",
      "srcIds": [
        "SRC-001",
        "SRC-005"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "specialist-review-and-formal-events",
      "criterionId": "r019",
      "srcIds": [
        "SRC-001",
        "SRC-012"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "specialist-review-and-formal-events",
      "criterionId": "r020",
      "srcIds": [
        "SRC-001",
        "SRC-004",
        "SRC-012"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "specialist-review-and-formal-events",
      "criterionId": "r021",
      "srcIds": [
        "SRC-001",
        "SRC-004",
        "SRC-012"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "specialist-review-and-formal-events",
      "criterionId": "r022",
      "srcIds": [
        "SRC-001",
        "SRC-004",
        "SRC-012"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "specialist-review-and-formal-events",
      "criterionId": "r023",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-009",
        "SRC-012"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "specialist-review-and-formal-events",
      "criterionId": "r024",
      "srcIds": [
        "SRC-001",
        "SRC-005",
        "SRC-010",
        "SRC-011",
        "SRC-013"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "specialist-review-and-formal-events",
      "criterionId": "r025",
      "srcIds": [
        "SRC-006"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "specialist-review-and-formal-events",
      "criterionId": "r026",
      "srcIds": [
        "SRC-002",
        "SRC-003",
        "SRC-008",
        "SRC-012",
        "SRC-013"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "delegation-disclosure-revocation",
      "criterionId": "r027",
      "srcIds": [
        "SRC-004",
        "SRC-012",
        "SRC-014"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "delegation-disclosure-revocation",
      "criterionId": "r028",
      "srcIds": [
        "SRC-001",
        "SRC-013",
        "SRC-015",
        "SRC-016"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "delegation-disclosure-revocation",
      "criterionId": "r029",
      "srcIds": [
        "SRC-001",
        "SRC-005",
        "SRC-012"
      ],
      "evidenceStatus": "UNCONFIRMED"
    }
  ]
} as const
