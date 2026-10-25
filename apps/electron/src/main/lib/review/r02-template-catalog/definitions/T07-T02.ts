import type { TemplateVersion } from '@profer/shared'

/** Local R02 research implementation. Not an official CDUT template. */
export const templateVersion: TemplateVersion = {
  "templateId": "T07-T02",
  "version": 1,
  "schemaVersion": 2,
  "name": "单位一般对外合同、协议的实质内容审查与用印",
  "description": "本地研究模板 · 非校方正式模板。单位一般对外合同、协议的实质内容审查与用印的事实预审、证据缺口识别和人工复核辅助；政策证据状态为 PARTIAL，校方最终签发/批准/用印/上线等决定必须由真实有权人员在权威流程中完成。",
  "catalogKind": "builtin",
  "sourceNote": "R02_RESEARCH_TEMPLATE_NONOFFICIAL: 源研究稿为非成都理工大学官方模板；源文件 docs/design/review-agent/business-templates/R02/T07-T02.md，SHA-256 64c6d35bce9a166fc7ec674cbfec56dd81f386202ccd991030e5bef250b2c4e6。研究来源与学校现行授权并不等同；未经核实的政策与权限必须人工复核。",
  "objectType": "transaction",
  "displayName": {
    "template": "T07-T02 · {{f001}}"
  },
  "fields": [
    {
      "key": "f001",
      "label": "001 · 案卷标识",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F001；源定义：案卷标识；ID；CASE；P0 全部；SYS 受理事件标识、案卷序号；L1；U/H，非上传件"
    },
    {
      "key": "f002",
      "label": "002 · 办理情形、阶段、事件时间",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F002；源定义：办理情形、阶段、事件时间；枚举+时间；CASE；P0 全部及流转；SYS 事件序列/校方确认，事件时间戳；L1；Q/H"
    },
    {
      "key": "f003",
      "label": "003 · 校内经办人稳定身份",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F003；源定义：校内经办人稳定身份；主体 ID；ACTOR；P0，经办或代理；ORG 可信身份会话/主体记录，不信 Renderer 字段；L2；U/H"
    },
    {
      "key": "f004",
      "label": "004 · 承办单位及任职关系",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F004；源定义：承办单位及任职关系；组织+角色；ACTOR；P0；ORG 任职/部门记录及时间；L1；U/H"
    },
    {
      "key": "f005",
      "label": "005 · 经办代理权限、范围、期限",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F005；源定义：经办代理权限、范围、期限；授权引用；ACTOR；P0，代理时；ORG/校方有效委托原件签发信息；L2；N/Q/H"
    },
    {
      "key": "f006",
      "label": "006 · 拟署名合同主体和法律名义",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F006；源定义：拟署名合同主体和法律名义；主体+名称；PARTY；P0；RAW 草案抬头 + BIZ/校方允许该名义的记录；L1；Q/H/C"
    },
    {
      "key": "f007",
      "label": "007 · 相对方名称、性质、注册身份",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F007；源定义：相对方名称、性质、注册身份；结构体；PARTY；P0；RAW 抬头 + EXT 登记/身份证明位置；L2；Q/H/C"
    },
    {
      "key": "f008",
      "label": "008 · 外方签署人及有效代理",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F008；源定义：外方签署人及有效代理；结构体；PARTY；P2/P4，拟对外签时；EXT 法定代表关系/委托证据，签署页；L2；Q/H/C"
    },
    {
      "key": "f009",
      "label": "009 · 合同标题、目的、标的概述",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F009；源定义：合同标题、目的、标的概述；文本；DRAFT；P0；RAW 草案题名/标的/合作目的条款；L1/L2；Q"
    },
    {
      "key": "f010",
      "label": "010 · 科研、采购、培训等专项触发标签",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F010；源定义：科研、采购、培训等专项触发标签；集合；ROUTE；P0/P1；RAW 义务条款 + BIZ 归口意见；L1；H/C"
    },
    {
      "key": "f011",
      "label": "011 · 资金方向、是否有价款",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F011；源定义：资金方向、是否有价款；枚举；FUND；P0/P1；RAW 付款条款 + BIZ/财务核实；L2；Q/H"
    },
    {
      "key": "f012",
      "label": "012 · 金额、币种、计价结构",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F012；源定义：金额、币种、计价结构；数值+币种；FUND；P1，有款时；RAW 草案 + 财务预算事实，条号/记录号；L2；N/Q/C/H"
    },
    {
      "key": "f013",
      "label": "013 · 项目与资金来源/批次标识",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F013；源定义：项目与资金来源/批次标识；结构体；FUND；P1，有项目经费时；BIZ/财务项目和批次权威编号；L2；N/U/H"
    },
    {
      "key": "f014",
      "label": "014 · 资产、知识产权、担保、数据、涉密等风险项",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F014；源定义：资产、知识产权、担保、数据、涉密等风险项；标记+位置；DRAFT；P1/P2；RAW 条款风险候选 + BIZ/法务确认，条号；L2/L3；Q/H"
    },
    {
      "key": "f015",
      "label": "015 · 适用前置程序种类与原因",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F015；源定义：适用前置程序种类与原因；列表；PRE；P1；BIZ 依制度确认程序，业务依据/意见号；L1；H/N"
    },
    {
      "key": "f016",
      "label": "016 · 已有前置决定、签发与时间",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F016；源定义：已有前置决定、签发与时间；引用；PRE；P1，有已发生程序时；BIZ 有权会议/项目/采购记录，决定号；L1/L2；N/U/H/V"
    },
    {
      "key": "f017",
      "label": "017 · 二次划拨、基层归口授权",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F017；源定义：二次划拨、基层归口授权；范围+引用；FUND；P1，C03；BIZ/财务划拨和授权原件，批次/签发页；L2；N/Q/H"
    },
    {
      "key": "f018",
      "label": "018 · 无资金框架限制事项逐项事实",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F018；源定义：无资金框架限制事项逐项事实；三值集合；DRAFT；P1，C02；RAW 草案条款 + BIZ 对限制及权限核实；L2；N/H/Q"
    },
    {
      "key": "f019",
      "label": "019 · 当前草案版本、文件指纹、时间",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F019；源定义：当前草案版本、文件指纹、时间；结构体；DRAFT；P0，每次改稿；RAW 原文件 + 受理时的校验指纹，文件版本；L2；Q/C"
    },
    {
      "key": "f020",
      "label": "020 · 权利义务、质量、价格、违约、争议主要条款",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F020；源定义：权利义务、质量、价格、违约、争议主要条款；结构体；DRAFT；P2；RAW 原文逐条定位与人工校验，页/行/条；L2/L3；Q/H"
    },
    {
      "key": "f021",
      "label": "021 · 履行、签约、生效期限及条件",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F021；源定义：履行、签约、生效期限及条件；日期/条件；DRAFT；P2；RAW 合同期限及生效条款，页/行/条；L2；Q/H"
    },
    {
      "key": "f022",
      "label": "022 · 权威业务归口及确认范围",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F022；源定义：权威业务归口及确认范围；决定引用；ROUTE；P1/P2；BIZ 归口确认人/时间/适用事项；L1；U/H/C"
    },
    {
      "key": "f023",
      "label": "023 · 邻接 G50/S/T 专项权威决定",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F023；源定义：邻接 G50/S/T 专项权威决定；引用；ROUTE；P1/P2，C05 等；BIZ 外部模板 ID、对象、版本、签发结果；L1/L2；N/U/H/C"
    },
    {
      "key": "f024",
      "label": "024 · 正式法务意见及目标版本",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F024；源定义：正式法务意见及目标版本；引用；DECISION；P2/P3，确有该环节时；DEC 法务/法治办公室签发号、时间、目标指纹；L2/L3；N/U/H/V"
    },
    {
      "key": "f025",
      "label": "025 · 正式审批结论、人员、时间",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F025；源定义：正式审批结论、人员、时间；事件引用；DECISION；P3 之后；DEC 学校有权审批/核实的最终会议决定；L1/L2；V/U/H"
    },
    {
      "key": "f026",
      "label": "026 · 被审批的合同版本/指纹",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F026；源定义：被审批的合同版本/指纹；哈希；DECISION；P3 之后；DEC 审批附件或可信签名绑定的定稿版；L2；V/U/C/H"
    },
    {
      "key": "f027",
      "label": "027 · 拟实际签署人的可信身份",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F027；源定义：拟实际签署人的可信身份；人员 ID；SIGN；P4；ORG/AUTH 真实身份及授权名单对应人；L2；V/U/H"
    },
    {
      "key": "f028",
      "label": "028 · 授权来源、范围、生效/变更/失效",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F028；源定义：授权来源、范围、生效/变更/失效；结构体；SIGN；P4；AUTH 当期公告/变更/临时授权原文；L2；V/U/H/C"
    },
    {
      "key": "f029",
      "label": "029 · 用印申请种类、用途、份数及文本版",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F029；源定义：用印申请种类、用途、份数及文本版；结构体；SEAL；P4；经办申请 + STAMP 真实受理号/目标版；L2；V/Q/H"
    },
    {
      "key": "f030",
      "label": "030 · 有权用印审批及适用范围",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F030；源定义：有权用印审批及适用范围；决定引用；SEAL；P4，批准后；STAMP 有权审批记录/签发时间；L2；V/U/H"
    },
    {
      "key": "f031",
      "label": "031 · 实际签署合同文件及指纹",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F031；源定义：实际签署合同文件及指纹；文档+哈希；SIGN；P4，签署后；真实签署/可验证签章记录、签署页；L2/L3；V/Q/H/C"
    },
    {
      "key": "f032",
      "label": "032 · 实际用章及登记结果",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F032；源定义：实际用章及登记结果；事件引用；SEAL；P4，执行后；STAMP 真实登记或电子验签记录、用印时间；L2/L3；V/U/H/C"
    },
    {
      "key": "f033",
      "label": "033 · 旧新版关联与受影响条款",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F033；源定义：旧新版关联与受影响条款；差异链；REV；PX，改稿/续签/变更；RAW 新旧原件及可信版本事件/页码；L2；N/Q/C/H"
    },
    {
      "key": "f034",
      "label": "034 · 补件、替换证据及归属",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F034；源定义：补件、替换证据及归属；证据集合；REV；PX，补件；原持有人提交证据 + 案卷替换事件；L2/L3；N/Q/C"
    },
    {
      "key": "f035",
      "label": "035 · 撤回、异议、复核请求与理由",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F035；源定义：撤回、异议、复核请求与理由；事件；REV；PX，C10/C11；原经办人请求，ORG 认证，指向原决定；L2；N/Q/H"
    },
    {
      "key": "f036",
      "label": "036 · 有权撤回处理/复核结果",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F036；源定义：有权撤回处理/复核结果；决定引用；REV；PX，正式处理后；DEC 适格部门签发的处理事件和时间；L2；V/U/H"
    },
    {
      "key": "f037",
      "label": "037 · 最终归档索引及版次",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F037；源定义：最终归档索引及版次；引用；REV；P5；BIZ/校方归档登记、档号和最终文件指纹；L2/L3；V/U/H"
    },
    {
      "key": "f038",
      "label": "038 · 个人信息合法处理依据、最小数据范围、角色及保存约束",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F038；源定义：个人信息合法处理依据、最小数据范围、角色及保存约束；枚举+证据引用；PRIVACY；P0 起，只要处理经办/外方自然人个人信息；学校数据治理岗位批准的用途、权限策略或合法处理依据；非 Renderer 自述，关联 M025；L2/L3；U/H；无依据不得默认可任意上传或外传"
    },
    {
      "key": "f039",
      "label": "039 · 电子签署证书/签名验证状态及所绑合同 hash",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F039；源定义：电子签署证书/签名验证状态及所绑合同 hash；结构体；SIGN；P4，仅主张电子签署或电子用印时；有权验证服务的签名覆盖范围、验证时点、证书链及撤销状态；关联 M026；图片不提供此值；L2/L3；N/V/U/C/H，无法核验不得 PASS_FACT"
    }
  ],
  "materialSlots": [
    {
      "id": "m001",
      "name": "001 · 案卷受理、情形/阶段",
      "purpose": "来源研究材料槽 M001。M001；案卷受理、情形/阶段；校方案卷 Owner；可信受理/流转事件；P0 今，系统生成，不是申请人上传件；可由校方核实线下案卷编号替代；F001–F002；SRC-007/008；归属本案与事件序号；系统失联 U，不能让申请人伪填；事件损坏 H。仅按源模板的办理情形和阶段触发；权威校内记录可在授权后只读核验替代上传，不要求申请人在初次提交时预交后置材料。",
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
        "案卷受理、情形/阶段",
        "校方案卷 Owner",
        "可信受理/流转事件"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m002",
      "name": "002 · 校内经办人、单位及岗位",
      "purpose": "来源研究材料槽 M002。M002；校内经办人、单位及岗位；身份/组织主管部门；可信主体与任职关系；P0 今，正常由校方身份服务取得；无接口由有权人员人工验真；F003–F004；SRC-001/003；按人员/岗位时点；失联 U/H，无法读取 H，禁止自报当身份凭证。仅按源模板的办理情形和阶段触发；权威校内记录可在授权后只读核验替代上传，不要求申请人在初次提交时预交后置材料。",
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
        "校内经办人、单位及岗位",
        "身份/组织主管部门",
        "可信主体与任职关系"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m003",
      "name": "003 · 代理人能否代表承办单位送审",
      "purpose": "来源研究材料槽 M003。M003；代理人能否代表承办单位送审；授权单位；经办代理委托原件/签发记录；P0 条：代理才需要；可由校方可核授权事件替代扫描；F005；SRC-001/002；签发者、期限、事项、主体；缺 Q/H，不清 H，不适用 N。仅按源模板的办理情形和阶段触发；权威校内记录可在授权后只读核验替代上传，不要求申请人在初次提交时预交后置材料。",
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
        "代理人能否代表承办单位送审",
        "授权单位",
        "经办代理委托原件/签发记录"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m004",
      "name": "004 · 合同审查主目标及文本内容",
      "purpose": "来源研究材料槽 M004。M004；合同审查主目标及文本内容；承办单位持有；原生草案及可信内容解析；P0 今：必须有可辨识的拟审文本或草案；补件/撤回纯事件可引用原案；F006–F007、F009–F012、F014、F018–F021；SRC-001/012；主合同 hash/版次、条款页码；缺 Q，不可读 UNREADABLE，版本冲突 C。仅按源模板的办理情形和阶段触发；权威校内记录可在授权后只读核验替代上传，不要求申请人在初次提交时预交后置材料。",
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
        "合同审查主目标及文本内容",
        "承办单位持有",
        "原生草案及可信内容解析"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m005",
      "name": "005 · 合同相对方是谁、是否真实存在",
      "purpose": "来源研究材料槽 M005。M005；合同相对方是谁、是否真实存在；相对方/登记机关；登记、证照或身份权威核验；P1/P2 条：按相对方类型及校本政策；可信登记查询可替代上传证照；F007；SRC-012/002；同一相对方注册主体和时点；缺 Q/H、查询失联 U、不可读 H。仅按源模板的办理情形和阶段触发；权威校内记录可在授权后只读核验替代上传，不要求申请人在初次提交时预交后置材料。",
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
        "合同相对方是谁、是否真实存在",
        "相对方/登记机关",
        "登记、证照或身份权威核验"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m006",
      "name": "006 · 外方实际签署人权源",
      "purpose": "来源研究材料槽 M006。M006；外方实际签署人权源；相对方；法人代表关系、授权委托或可核签署安排；P2/P4 条：代理签署或授权不明时；可由权威电子委托验证；F008；SRC-012/002；对方主体/签约事项/有效期；缺 Q/H，模糊 H，签署后不得以旧授权覆盖新主体。仅按源模板的办理情形和阶段触发；权威校内记录可在授权后只读核验替代上传，不要求申请人在初次提交时预交后置材料。",
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
        "外方实际签署人权源",
        "相对方",
        "法人代表关系、授权委托或可核签署安排"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m007",
      "name": "007 · 经费、预算、项目、金额的外部交叉证据",
      "purpose": "来源研究材料槽 M007。M007；经费、预算、项目、金额的外部交叉证据；财务/项目归口；可核预算或项目记录；P1 条：涉及收支/项目；可信财务或项目系统结果优先，不能要求重复上传；F011–F013；SRC-001/002；经费账户、批次和当前合同金额；缺 U/H，矛盾 C，无资真实确认 N。仅按源模板的办理情形和阶段触发；权威校内记录可在授权后只读核验替代上传，不要求申请人在初次提交时预交后置材料。",
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
        "经费、预算、项目、金额的外部交叉证据",
        "财务/项目归口",
        "可核预算或项目记录"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m008",
      "name": "008 · 前置程序的真实完成状态",
      "purpose": "来源研究材料槽 M008。M008；前置程序的真实完成状态；有权业务部门；论证、项目、询比、会议/采购等决定；P1 条：对应事项适用且决定已形成；可信原签发记录替代复印件；F015–F016；SRC-001/002/010；项目、阶段、决定签发人/时间/文号；未形成 V（提示办理），已称完成但缺 U/H。仅按源模板的办理情形和阶段触发；权威校内记录可在授权后只读核验替代上传，不要求申请人在初次提交时预交后置材料。",
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
        "前置程序的真实完成状态",
        "有权业务部门",
        "论证、项目、询比、会议/采购等决定"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m009",
      "name": "009 · 二次划拨与基层归口的条件性授权",
      "purpose": "来源研究材料槽 M009。M009；二次划拨与基层归口的条件性授权；原归口/财务；划拨记录、授权文书；P1 条：C03，不能从资金到账自动推断授予审批权；可从权威内部记录取得；F017；SRC-001/002；经费批次、被授权单位、范围、期限；缺 Q/H、授权正文不清 H。仅按源模板的办理情形和阶段触发；权威校内记录可在授权后只读核验替代上传，不要求申请人在初次提交时预交后置材料。",
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
        "二次划拨与基层归口的条件性授权",
        "原归口/财务",
        "划拨记录、授权文书"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m010",
      "name": "010 · 无资金框架以单位名义签约的前置权限",
      "purpose": "来源研究材料槽 M010。M010；无资金框架以单位名义签约的前置权限；学校授权机关；限制事项核验、专项授权；P1 条：C02，不能凭声明“零金额”替代校方授权；原签发记录可替代上传；F006、F018；SRC-001/002；拟署名单位、限制事项、授权范围；缺 Q/H，全文未核 POLICY_UNCONFIRMED。仅按源模板的办理情形和阶段触发；权威校内记录可在授权后只读核验替代上传，不要求申请人在初次提交时预交后置材料。",
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
        "无资金框架以单位名义签约的前置权限",
        "学校授权机关",
        "限制事项核验、专项授权"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m011",
      "name": "011 · 合同归口结论",
      "purpose": "来源研究材料槽 M011。M011；合同归口结论；归口主管部门；专业路由/有权确认记录；P1/P2 条：归口不显明或存在交叉时；可引用有权部门可核内部决定；F010、F022；SRC-001/003；适用合同性质、部门、时点；来源不可达 U、部门争议 C/H。仅按源模板的办理情形和阶段触发；权威校内记录可在授权后只读核验替代上传，不要求申请人在初次提交时预交后置材料。",
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
        "合同归口结论",
        "归口主管部门",
        "专业路由/有权确认记录"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m012",
      "name": "012 · 专项业务已决定事实",
      "purpose": "来源研究材料槽 M012。M012；专项业务已决定事实；T03/T04/G50 对应业务 Owner；有权结论引用及必要证据定位；P1/P2 条：C05 或触发专项；不复制整包材料，可读可信决定即可；F023；SRC-001/010/011；上游模板/对象/版本/签发人；不存在 V/待专项办理，失联 U，不相符 C。仅按源模板的办理情形和阶段触发；权威校内记录可在授权后只读核验替代上传，不要求申请人在初次提交时预交后置材料。",
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
        "专项业务已决定事实",
        "T03/T04/G50 对应业务 Owner",
        "有权结论引用及必要证据定位"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m013",
      "name": "013 · 实际法务审核意见",
      "purpose": "来源研究材料槽 M013。M013；实际法务审核意见；法治工作办公室或获授权法务；签发的意见及所审文本；P2/P3 条/后：要求法务审核且意见确已产生时；可信审查系统引用替代扫描；F024；SRC-001/003/002；法务签发人、时间、被审 hash；未发生 V，称已办但无源 U/H，无法读 H。仅按源模板的办理情形和阶段触发；权威校内记录可在授权后只读核验替代上传，不要求申请人在初次提交时预交后置材料。",
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
        "实际法务审核意见",
        "法治工作办公室或获授权法务",
        "签发的意见及所审文本"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m014",
      "name": "014 · 正式有权审批及被审批版",
      "purpose": "来源研究材料槽 M014。M014；正式有权审批及被审批版；有权审批机关；真实流程事件/会议最终决议和附件；P3 后：申请首次送审时绝非必需，C08 必须核已存在记录；可用权威流程引用；F025–F026；SRC-001/002/008；审批人身份、日期、决定和合同版；无审批 V，源失联 U，版不符 C。仅按源模板的办理情形和阶段触发；权威校内记录可在授权后只读核验替代上传，不要求申请人在初次提交时预交后置材料。",
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
        "正式有权审批及被审批版",
        "有权审批机关",
        "真实流程事件/会议最终决议和附件"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m015",
      "name": "015 · 实际签约人及有效授权",
      "purpose": "来源研究材料槽 M015。M015；实际签约人及有效授权；学校授权主管部门；2026 有效名单、变更链或临时授权原件；P4 后/条：仅送签时应核，不在初审强求；由校方当期记录优先；F027–F028；SRC-004/005/006；签署时点、人员、合同类别/金额/范围；正文未得 U/H/POLICY_UNCONFIRMED，旧名单不可替代。仅按源模板的办理情形和阶段触发；权威校内记录可在授权后只读核验替代上传，不要求申请人在初次提交时预交后置材料。",
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
        "实际签约人及有效授权",
        "学校授权主管部门",
        "2026 有效名单、变更链或临时授权原件"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m016",
      "name": "016 · 用印申请内容与拟用印版本",
      "purpose": "来源研究材料槽 M016。M016；用印申请内容与拟用印版本；承办单位/用印受理岗位；校方认可用印申请；P4 后：到申请用印时才产生；学校批准的电子/实体表单或流程记录是候选替代；F029；SRC-003/009；印章类型、份数、用途、目标 hash；申请缺 Q，表单版本未知 POLICY_UNCONFIRMED。仅按源模板的办理情形和阶段触发；权威校内记录可在授权后只读核验替代上传，不要求申请人在初次提交时预交后置材料。",
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
        "用印申请内容与拟用印版本",
        "承办单位/用印受理岗位",
        "校方认可用印申请"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m017",
      "name": "017 · 有权用印批准",
      "purpose": "来源研究材料槽 M017。M017；有权用印批准；印章管理/批准岗位；真实审批记录；P4 后：审批发生后产生，不是初审必交；以校方权威审批为准；F030；SRC-003/009/002；有权人员、范围、印章/文件版；未发生 V，源失联 U，矛盾 C/H。仅按源模板的办理情形和阶段触发；权威校内记录可在授权后只读核验替代上传，不要求申请人在初次提交时预交后置材料。",
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
        "有权用印批准",
        "印章管理/批准岗位",
        "真实审批记录"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m018",
      "name": "018 · 合同已由双方实际签署",
      "purpose": "来源研究材料槽 M018。M018；合同已由双方实际签署；合法签约主体/承办单位；签署定稿、可核电子签名或正本；P4 后：签约后才产生；可验证权威合同档案代替再次上传；F031；SRC-001/012；双方签章、实际签约时间和 hash；未签 V，无法读 H，草案不一致 C。仅按源模板的办理情形和阶段触发；权威校内记录可在授权后只读核验替代上传，不要求申请人在初次提交时预交后置材料。",
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
        "合同已由双方实际签署",
        "合法签约主体/承办单位",
        "签署定稿、可核电子签名或正本"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m019",
      "name": "019 · 印章已被实际使用并登记",
      "purpose": "来源研究材料槽 M019。M019；印章已被实际使用并登记；校方印章岗位；实际用章登记/可核电子验签结果；P4/P5 后：执行后产生；印章岗位可信记录替代盖章扫描；F032；SRC-003/009；真实章种、时间、文本 hash；未执行 V、源失联 U、图像模糊 H。仅按源模板的办理情形和阶段触发；权威校内记录可在授权后只读核验替代上传，不要求申请人在初次提交时预交后置材料。",
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
        "印章已被实际使用并登记",
        "校方印章岗位",
        "实际用章登记/可核电子验签结果"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m020",
      "name": "020 · 改稿/续签的前后版本及差异",
      "purpose": "来源研究材料槽 M020。M020；改稿/续签的前后版本及差异；承办单位与版本管理者；新旧合同文本/变更对照；PX 条：C07/C12/C13；已有原文可引用本案，勿重复上传未变部分；F019、F033；SRC-001/002/012；旧 hash、新 hash、条款与归属；缺 Q、差异不明 C/H。仅按源模板的办理情形和阶段触发；权威校内记录可在授权后只读核验替代上传，不要求申请人在初次提交时预交后置材料。",
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
        "改稿/续签的前后版本及差异",
        "承办单位与版本管理者",
        "新旧合同文本/变更对照"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m021",
      "name": "021 · 补件内容与替换范围",
      "purpose": "来源研究材料槽 M021。M021；补件内容与替换范围；原材料持有人；针对缺口的新证据及旧版索引；PX 条：C06；可信来源可核的补件无需再次上传；F034；SRC-001/002；指向旧材料 ID/新版本/具体 F；缺 Q、不可读 UNREADABLE、旧结论部分失效。仅按源模板的办理情形和阶段触发；权威校内记录可在授权后只读核验替代上传，不要求申请人在初次提交时预交后置材料。",
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
        "补件内容与替换范围",
        "原材料持有人",
        "针对缺口的新证据及旧版索引"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m022",
      "name": "022 · 撤回或异议诉求",
      "purpose": "来源研究材料槽 M022。M022；撤回或异议诉求；原发起人/被授权人；申请说明及系统可验证事件；PX 条：C10/C11；本人可信办理事件可替代表格；F035；SRC-002/008；所争议决定、原因、申请人和时间；缺 Q/H，提交不等于已撤回。仅按源模板的办理情形和阶段触发；权威校内记录可在授权后只读核验替代上传，不要求申请人在初次提交时预交后置材料。",
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
        "撤回或异议诉求",
        "原发起人/被授权人",
        "申请说明及系统可验证事件"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m023",
      "name": "023 · 撤回处理与复核结果",
      "purpose": "来源研究材料槽 M023。M023；撤回处理与复核结果；适格校方决定者；正式办理记录；PX 后：校方处理后才出现，不能用自动结果冒充；F036；SRC-002/003/008；原决定与本处理决定、人员/时点/权限；未发生 V、失联 U、越权 H。仅按源模板的办理情形和阶段触发；权威校内记录可在授权后只读核验替代上传，不要求申请人在初次提交时预交后置材料。",
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
        "撤回处理与复核结果",
        "适格校方决定者",
        "正式办理记录"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m024",
      "name": "024 · 签约完成归档",
      "purpose": "来源研究材料槽 M024。M024；签约完成归档；档案/承办管理者；权威档案索引及终版留存；P5 后：不在首次审核索取，合法记录可直接引用；F037；SRC-001/002；最终合同 hash、档案归属、登记时点；未发生 V，源失联 U，版不一 C。仅按源模板的办理情形和阶段触发；权威校内记录可在授权后只读核验替代上传，不要求申请人在初次提交时预交后置材料。",
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
        "M024",
        "签约完成归档",
        "档案/承办管理者",
        "权威档案索引及终版留存"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m025",
      "name": "025 · 个人信息合法处理依据、受限字段范围、处理角色与保留规则",
      "purpose": "来源研究材料槽 M025。M025；个人信息合法处理依据、受限字段范围、处理角色与保留规则；学校数据治理/隐私管理岗位；授权用途策略或合法处理依据证明；P0–P5 条：涉及自然人个人信息才激活；通常由学校统一策略满足，不让经办人上传多余身份证复印件；F003/F007/F008/F038；SRC-013；按合同目标、数据类别和授权用途定位；处理权限未知 U/H，真实敏感件未获环境许可一律不上传。仅按源模板的办理情形和阶段触发；权威校内记录可在授权后只读核验替代上传，不要求申请人在初次提交时预交后置材料。",
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
        "M025",
        "个人信息合法处理依据、受限字段范围、处理角色与保留规则",
        "学校数据治理/隐私管理岗位",
        "授权用途策略或合法处理依据证明"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m026",
      "name": "026 · 电子签署可验真原始数据",
      "purpose": "来源研究材料槽 M026。M026；电子签署可验真原始数据；学校/签署平台/档案管理者；签名数据、证书链/吊销结果、可信签署日志、签署覆盖范围；P4/P5 后/条：主张电子签署时才核；可通过授权验签服务直接提供，不要求将私钥/签章凭据上传；F031/F032/F039；SRC-014；绑定签约原文 hash、签署人标识及验证时点；缺验签记录 U/H，不可读 UNREADABLE，证书或文本矛盾 CONFLICT；验真成功不等于校级准印。仅按源模板的办理情形和阶段触发；权威校内记录可在授权后只读核验替代上传，不要求申请人在初次提交时预交后置材料。",
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
        "M026",
        "电子签署可验真原始数据",
        "学校/签署平台/档案管理者",
        "签名数据、证书链/吊销结果、可信签署日志、签署覆盖范围"
      ],
      "allowReuseAcrossSubjects": false
    }
  ],
  "sections": [
    {
      "id": "identity-and-text",
      "name": "身份、版本与合同文本",
      "description": "按原研究稿规则章节分组；用于本地研究预审，不构成校方审批流程或正式授权。",
      "order": 0,
      "required": true,
      "criteria": [
        {
          "id": "r001",
          "title": "案卷、阶段与当前版本归属",
          "requirement": "源研究规则 R001。P0/PX；案卷、阶段与当前版本归属；真：存在一次提交/改稿/重提事件；假：并无本案事件→不适用；未知：事件序列不一致→待核；SRC-001/SRC-007/SRC-008；F001/F002/F019；M001/M004。对可信受理时间、caseId、主文 hash 与上传对象；A/B 优于 C；按事件生效时点校验；不得把历史技术 run@rev 当新审批。可 PASS_FACT/CONFLICT/SOURCE_UNAVAILABLE；下一：可信案卷管理员/承办单位。执行边界：仅形成可追溯事实预审、风险提示或待办；校内政策适用/现行性/权限未知时必须人工复核，禁止由此生成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r002",
          "title": "校内经办人与承办单位任职身份",
          "requirement": "源研究规则 R002。P0；校内经办人与承办单位任职身份；真：以校内角色提交；假：合法的外部来件仅可登记、不能代行校内送审→不适用该校内身份核验；未知：身份标识矛盾；SRC-001/SRC-003；F003/F004；M002/M001。ORG 稳定 ID、单位、任职有效日期与实际登录凭证对照；A 优先；离任/跨部门以提交时点和当前送审时点分开核；同名不等于同人。PASS_FACT/CONFLICT/SOURCE_UNAVAILABLE/NEEDS_HUMAN_DECISION；下一：学校身份管理/承办单位。执行边界：仅形成可追溯事实预审、风险提示或待办；校内政策适用/现行性/权限未知时必须人工复核，禁止由此生成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r003",
          "title": "委托代理权限",
          "requirement": "源研究规则 R003。P0；委托代理权限；真：他人代办或代签；假：经办人本人办理且无代理主张→NOT_APPLICABLE；未知：经办人与受托关系不清；SRC-001/SRC-002/SRC-006；F003/F005；M002/M003。委托签发者、受托人、事项、有效起止与签署行为逐项对比；A/B；普通经办授权不自动等于合同签署授权；临时/历史委托不得跨越期限。PASS_FACT/NEEDS_MATERIAL/CONFLICT/POLICY_UNCONFIRMED；下一：委托出具机关及承办单位。执行边界：仅形成可追溯事实预审、风险提示或待办；校内政策适用/现行性/权限未知时必须人工复核，禁止由此生成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r004",
          "title": "合同拟以何法律主体名义签订",
          "requirement": "源研究规则 R004。P0/P2；合同拟以何法律主体名义签订；真：合同拟载学校/所属单位为一方；假：确认无学校对外签约行为→NOT_APPLICABLE 并退出本模板；未知：抬头与授权名义不同；SRC-001/SRC-002/SRC-012；F006/F009；M004/M011。合同抬头、署名页、校方核准签署主体与归口结论逐处比较；C 仅作草案事实；学院名称不能无依据等同具有独立对外签约权；主体法律评价交法务。PASS_FACT/CONFLICT/POLICY_UNCONFIRMED/NEEDS_HUMAN_DECISION；下一：归口部门/法治工作办公室。执行边界：仅形成可追溯事实预审、风险提示或待办；校内政策适用/现行性/权限未知时必须人工复核，禁止由此生成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r005",
          "title": "合同相对方主体资格与同一性",
          "requirement": "源研究规则 R005。P0/P2；合同相对方主体资格与同一性；真：存在对外相对方；假：确定仅校内非合同事务→NOT_APPLICABLE；未知：名称/证照号不相符；SRC-012；F007/F009；M004/M005。草案主体名称/统一社会信用代码等与权威登记记录逐项比，主体变更记录保留；外方 A 优先；以拟签时点有效登记为准；境外主体、自然人身份核查方法由法务定。PASS_FACT/NEEDS_MATERIAL/CONFLICT/SOURCE_UNAVAILABLE；下一：经办单位核对外方／法务。执行边界：仅形成可追溯事实预审、风险提示或待办；校内政策适用/现行性/权限未知时必须人工复核，禁止由此生成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r006",
          "title": "外方实际签署代表资格",
          "requirement": "源研究规则 R006。P2/P4；外方实际签署代表资格；真：拟由代理人而非法定代表人签署或身份需证明；假：有效权威记录确认其为本人且不要求另行代理件→NOT_APPLICABLE 代理支路；未知：关系/范围不明；SRC-012；F007/F008；M005/M006。法定代表关系/委托书姓名、业务范围、期限与签署页；原签发 A/B 高于名片、邮件 C；签署时点重核；外方联系人不当然有权签字。PASS_FACT/NEEDS_MATERIAL/UNREADABLE/CONFLICT/NEEDS_HUMAN_DECISION；下一：相对方授权人/法务。执行边界：仅形成可追溯事实预审、风险提示或待办；校内政策适用/现行性/权限未知时必须人工复核，禁止由此生成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r007",
          "title": "合同文本可读取且完整",
          "requirement": "源研究规则 R007。P0/P2/P4；合同文本可读取且完整；真：有当阶段应有的草案或签署文本；假：该阶段尚无签署成品则签署文本检查延后、不报初审缺件；未知：文件损坏/页缺；SRC-001/SRC-012；F009/F019/F020/F031；M004/M018。文件可访问性、页序、附件清单、签字页、原件 hash 及 OCR 人工抽样；C 不能替代原文件；缺当前必需草案→NEEDS_MATERIAL；已提交但不可读→UNREADABLE；无后续签署文本→DEFERRED。下一：材料持有人/档案岗位。执行边界：仅形成可追溯事实预审、风险提示或待办；校内政策适用/现行性/权限未知时必须人工复核，禁止由此生成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r008",
          "title": "条款事实与稿本内部一致性",
          "requirement": "源研究规则 R008。P2；条款事实与稿本内部一致性；真：已进入条款核对；假：仅立案未达 P2→延后；未知：价款、履行、违约等关键页不清；SRC-012；F009/F012/F014/F020/F021；M004/M007。各页主体/金额/币种/履行期限/附件与结构化字段双向对照；B/C 原文优于 D 抽取；本规则仅报矛盾和未载事实，不作条款法律合理性决定；无统一校本强制条款目录时不得擅判拒绝。PASS_FACT/CONFLICT/UNREADABLE/NEEDS_HUMAN_DECISION；下一：承办单位/法务。执行边界：仅形成可追溯事实预审、风险提示或待办；校内政策适用/现行性/权限未知时必须人工复核，禁止由此生成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        }
      ]
    },
    {
      "id": "routing-and-risk-review",
      "name": "归口、风险与实质内容",
      "description": "按原研究稿规则章节分组；用于本地研究预审，不构成校方审批流程或正式授权。",
      "order": 1,
      "required": true,
      "criteria": [
        {
          "id": "r009",
          "title": "T03 科研、T04 采购、G01 个人证明、G06 成果/科研公开、T07 外函/宣传/信息公开或非学历专项触发",
          "requirement": "源研究规则 R009。P1；T03 科研、T04 采购、G01 个人证明、G06 成果/科研公开、T07 外函/宣传/信息公开或非学历专项触发；真：条款出现相应专门实质义务→专项优先；假：证实均不涉及→普通路径；未知：混合义务/用词不明；SRC-001/SRC-010/SRC-011/SRC-015/SRC-016/SRC-017；F009/F010/F022；M004/M011。按义务对象、对外受让权/资金性质、公开目的而非标题对照专项归口，A 级归口确认优先；不以 T07 取代 T03-T03/T04-T03/G01/G06/T07-T06/T07-T07 实质批准；混合合同可留本案待归口协同。PASS_FACT/NOT_APPLICABLE/CONFLICT/NEEDS_HUMAN_DECISION；下一：校方归口协调者／专项 Owner。执行边界：仅形成可追溯事实预审、风险提示或待办；校内政策适用/现行性/权限未知时必须人工复核，禁止由此生成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r010",
          "title": "合同唯一主归口和协同角色",
          "requirement": "源研究规则 R010。P1；合同唯一主归口和协同角色；真：路由有争议或需归口确认；假：已有同对象、当前有效 A 级归口决定→免重复核；未知：部门意见互斥；SRC-001/SRC-002/SRC-003；F010/F022；M011/M001。合同性质、承担主体、资金与正式归口决定同案对照；A 高于模型路由；当前归口目录/跨部门主办界限未取得 SRC-002，不能模型自行定权。PASS_FACT/CONFLICT/POLICY_UNCONFIRMED/NEEDS_HUMAN_DECISION；下一：学校合同归口协调部门。执行边界：仅形成可追溯事实预审、风险提示或待办；校内政策适用/现行性/权限未知时必须人工复核，禁止由此生成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r011",
          "title": "经费性质、金额及项目批次事实",
          "requirement": "源研究规则 R011。P1；经费性质、金额及项目批次事实；真：存在付款、收款或项目预算；假：确证无资金条款→金额分支不适用（但仍核权利义务）；未知：草案与财务记录矛盾；SRC-001/SRC-002；F011/F012/F013；M004/M007。价款/结算/币种、实际项目号及权威预算记录相互核对，A 高于 C；预算额不等于合同审批额度；无法核现行阈值只报 POLICY_UNCONFIRMED，不推断大额自动审批。下一：财务/项目归口。执行边界：仅形成可追溯事实预审、风险提示或待办；校内政策适用/现行性/权限未知时必须人工复核，禁止由此生成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r012",
          "title": "二次划拨并授权基层单位作为特定合同归口的资格事实",
          "requirement": "源研究规则 R012。P1；二次划拨并授权基层单位作为特定合同归口的资格事实；真：C03 主张再划拨及特定归口授权；假：无例外归口主张→NOT_APPLICABLE；未知：只有到账凭据；SRC-001/SRC-002；F013/F017；M007/M009。同时核对①真实二次划拨②原归口对基层审批使用及签订合同的授权③经费批次、被授权单位、合同范围、有效期和拟行为；A 级授权优先；本 R 的通过仅认定例外归口授权事实，不等于自然人有签字权，更不等于用印可执行；P4 必须另由 R020/R021/R022 核。正式第 11 条完整版未知时 POLICY_UNCONFIRMED/NEEDS_HUMAN_DECISION；下一：原归口、财务和授权机关。执行边界：仅形成可追溯事实预审、风险提示或待办；校内政策适用/现行性/权限未知时必须人工复核，禁止由此生成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r013",
          "title": "无资金框架协议的签署例外",
          "requirement": "源研究规则 R013。P1/P2；无资金框架协议的签署例外；真：C02 零金额且拟以单位名义签框架；假：普通有偿合同/非此主体→NOT_APPLICABLE；未知：隐含支付、排他、知识产权转让；SRC-001/SRC-002；F006/F011/F014/F018；M004/M010。框架实际义务、授权对象与限制性条款逐条核；B/C 与 A 级授权交叉；解读第 14 条不是零金额通行许可；未取得现行限制全文时 POLICY_UNCONFIRMED/NEEDS_HUMAN_DECISION。下一：授权机关/法务。执行边界：仅形成可追溯事实预审、风险提示或待办；校内政策适用/现行性/权限未知时必须人工复核，禁止由此生成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r014",
          "title": "事项应履行的合同前置程序",
          "requirement": "源研究规则 R014。P1/P3；事项应履行的合同前置程序；真：校方确认本合同类型须先立项/论证/专项批准等；假：有权机关确认无该前置程序→NOT_APPLICABLE；未知：规则或完成状态未核；SRC-001/SRC-002/SRC-010；F015/F016；M008/M011。适用类型、决定对象、会议/审批编号、日期及原签发者逐项核，A 优先；解读第 15 条支撑“前置先于合同”，但不据此要求所有合同同一审批表；尚未形成前置决定，P1 建待办。PASS_FACT/NEEDS_MATERIAL/SOURCE_UNAVAILABLE/POLICY_UNCONFIRMED；下一：前置事项有权部门。执行边界：仅形成可追溯事实预审、风险提示或待办；校内政策适用/现行性/权限未知时必须人工复核，禁止由此生成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r015",
          "title": "专项结论的合法复用",
          "requirement": "源研究规则 R015。P1/P2；专项结论的合法复用；真：触发 T03/T04/G50 或其他独立授权目的；假：有权确认无专项→NOT_APPLICABLE；未知：引用仅为截图/跨案结论；SRC-001/SRC-010/SRC-011/SRC-017；F010/F023；M012/M011。权威决定 ID、批准对象、约束条款、版本、签发权、撤回状态和时效作精确 join；A 优先；只引用外部结论，不在 T07 重批科研、采购、成果权利处分或个人证明；专项决定被撤回/换版应定向重新关联。PASS_FACT/NEEDS_MATERIAL/CONFLICT/SOURCE_UNAVAILABLE；下一：对应独立业务 Owner。执行边界：仅形成可追溯事实预审、风险提示或待办；校内政策适用/现行性/权限未知时必须人工复核，禁止由此生成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r016",
          "title": "重大/风险合同触发与法务意见",
          "requirement": "源研究规则 R016。P2/P3；重大/风险合同触发与法务意见；真：出现重大标识、非标责任/争议条款或校方正式要求法审；假：有权分类确认无需本项法审→不适用法审附件；未知：重大标准不明；SRC-001/SRC-002/SRC-003/SRC-012；F012/F014/F024；M004/M013。逐条风险锚点与有权法务所审版本 hash 比；法务签发 A/B；重大额度、适用范围缺正式全文，不设自动硬阈值；法律意见不是学校批准。PASS_FACT/NEEDS_MATERIAL/POLICY_UNCONFIRMED/NEEDS_HUMAN_DECISION；下一：归口/法治工作办公室。执行边界：仅形成可追溯事实预审、风险提示或待办；校内政策适用/现行性/权限未知时必须人工复核，禁止由此生成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r017",
          "title": "合法合规实质意见及其适用文本",
          "requirement": "源研究规则 R017。P2/P3；合法合规实质意见及其适用文本；真：校方流程要求法审或已主张获法审；假：有权决定可不经独立法审→该意见不适用；未知：签发人/所审文本不明；SRC-001/SRC-002/SRC-003；F019/F024；M004/M013。法务意见签发身份、意见内容、事项、被审合同 hash 对照；A/B；法务意见“建议修改”不能译为“审核通过”；改条款后意见适用性待原法务判断。PASS_FACT/CONFLICT/SOURCE_UNAVAILABLE/NEEDS_HUMAN_DECISION；下一：正式法审岗位。执行边界：仅形成可追溯事实预审、风险提示或待办；校内政策适用/现行性/权限未知时必须人工复核，禁止由此生成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        }
      ]
    },
    {
      "id": "approval-signature-archive",
      "name": "批准、签署、用印与归档",
      "description": "按原研究稿规则章节分组；用于本地研究预审，不构成校方审批流程或正式授权。",
      "order": 2,
      "required": true,
      "criteria": [
        {
          "id": "r018",
          "title": "正式校方合同批准的真实存在",
          "requirement": "源研究规则 R018。P3/P4；正式校方合同批准的真实存在；真：拟进入送签用印或声称已获批准；假：P0–P2 首次送审尚无批准→延后；未知：截屏不能确定真实签发者；SRC-001/SRC-002/SRC-008；F025/F026；M014/M001。校方权威审批事件、签发人岗位、对象、批准或退回语义与被批 hash；A；校本审批顺序/权限待核 SRC-002；“材料齐全”不产生此记录。PASS_FACT/NEEDS_MATERIAL/SOURCE_UNAVAILABLE/POLICY_UNCONFIRMED/NEEDS_HUMAN_DECISION；下一：真实校方审批岗位。执行边界：仅形成可追溯事实预审、风险提示或待办；校内政策适用/现行性/权限未知时必须人工复核，禁止由此生成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r019",
          "title": "已审批版与拟送签用印版一致",
          "requirement": "源研究规则 R019。P4；已审批版与拟送签用印版一致；真：已有正式审批并拟签/用印；假：未到 P4→延后；未知：审批仅有文号无附件/hash；SRC-001/SRC-002/SRC-012；F019/F026/F029；M004/M014/M016。审批附件与目标 PDF 的规范化 hash/页码/条款差异，字节差异可转人工语义比对；A/B；非实质格式变更能否免重新审批必须由校方核；不得模型判定可继续盖章。PASS_FACT/CONFLICT/UNREADABLE/NEEDS_HUMAN_DECISION；下一：原审批岗位/印章受理者。执行边界：仅形成可追溯事实预审、风险提示或待办；校内政策适用/现行性/权限未知时必须人工复核，禁止由此生成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r020",
          "title": "学校实际签约人员当期授权",
          "requirement": "源研究规则 R020。P4；学校实际签约人员当期授权；真：拟安排或已发生学校签字；假：P0–P3 尚无签字人→延后；未知：2026 名单/变更链不可取；SRC-001/SRC-004/SRC-005/SRC-006；F027/F028；M015/M014。人、岗位、合同种类、金额/范围、签署时点对照当期有效授权公告或临时原件；A；SRC-006 仅 2025 历史，不能作为 2026 通行授权。PASS_FACT/CONFLICT/SOURCE_UNAVAILABLE/POLICY_UNCONFIRMED/NEEDS_HUMAN_DECISION；下一：校方授权管理机关。执行边界：仅形成可追溯事实预审、风险提示或待办；校内政策适用/现行性/权限未知时必须人工复核，禁止由此生成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r021",
          "title": "真实用印请求及目标稿本",
          "requirement": "源研究规则 R021。P4；真实用印请求及目标稿本；真：经办人申请实体/电子用印；假：尚处审批前→延后；未知：申报章种或版本不明；SRC-003/SRC-009/SRC-002；F029/F026；M016/M014。印章种类/用途/份数、用印主体、目标稿 hash 与所批准稿对照；经校方认可的 A/B 流程记录优先；不把 2021 合同审批表或 2025 用印批办单推成人人必交；现行表单待核。PASS_FACT/NEEDS_MATERIAL/CONFLICT/POLICY_UNCONFIRMED；下一：用印受理岗位。执行边界：仅形成可追溯事实预审、风险提示或待办；校内政策适用/现行性/权限未知时必须人工复核，禁止由此生成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r022",
          "title": "有权人员已经批准用印",
          "requirement": "源研究规则 R022。P4；有权人员已经批准用印；真：申请已进入正式用印审批或声称已批准；假：P0–P3 未申请则延后；未知：截图“同意”不显权限与对象；SRC-002/SRC-003/SRC-009；F029/F030；M016/M017。用印批准人及其可信岗位、用章种类、被批文本版本、有效时点与正式事件；A；批准仅证明“准许执行”，不证明已盖章，未知授权不得自动放行。PASS_FACT/NEEDS_MATERIAL/SOURCE_UNAVAILABLE/POLICY_UNCONFIRMED/NEEDS_HUMAN_DECISION；下一：印信审批权人。执行边界：仅形成可追溯事实预审、风险提示或待办；校内政策适用/现行性/权限未知时必须人工复核，禁止由此生成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r023",
          "title": "双方实际签署文本与版本",
          "requirement": "源研究规则 R023。P4；双方实际签署文本与版本；真：已主张完成双方签署；假：拟签尚未执行→延后；未知：签字页缺/签名难核；SRC-001/SRC-012；F008/F027/F031；M006/M015/M018。逐方签署人、签署日期/电子验签和最终稿 hash 对照；原始签署记录 A/B；一方未签不推定合同必然无效，由法务依具体法律关系核定；PASS_FACT/NEEDS_MATERIAL/UNREADABLE/CONFLICT/NEEDS_HUMAN_DECISION；下一：经办单位/签署验证者/法务。执行边界：仅形成可追溯事实预审、风险提示或待办；校内政策适用/现行性/权限未知时必须人工复核，禁止由此生成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r024",
          "title": "印章实际执行与登记",
          "requirement": "源研究规则 R024。P4/P5；印章实际执行与登记；真：主张已盖章/加盖电子印章；假：仅批准但未执行→延后；未知：章影像有而权威登记失联；SRC-003/SRC-009；F030/F032；M017/M019。印章类别、登记时间、执行岗位、盖印文本 hash 与原记录双向比；校方印信 A 优先；章图本身不能证明授权，学校真实记录失联须 SOURCE_UNAVAILABLE。PASS_FACT/UNREADABLE/CONFLICT/NEEDS_HUMAN_DECISION；下一：印章管理岗位。执行边界：仅形成可追溯事实预审、风险提示或待办；校内政策适用/现行性/权限未知时必须人工复核，禁止由此生成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r025",
          "title": "补件材料与替换对象的准确归属",
          "requirement": "源研究规则 R025。PX；补件材料与替换对象的准确归属；真：C06 上传补件或替换；假：无新材料→NOT_APPLICABLE；未知：未标旧件 ID/覆盖范围；SRC-001/SRC-002；F019/F034；M021/M001。新旧材料 ID、受影响 F、页/条款、hash 和可信补件签发者比对；原 A 不能由新 C 覆盖；本规则只判替换事实与可读性；旧 R 保留历史标失效，不清空全部结论。PASS_FACT/NEEDS_MATERIAL/CONFLICT/UNREADABLE；下一：补件持有人/案卷版本管理员。执行边界：仅形成可追溯事实预审、风险提示或待办；校内政策适用/现行性/权限未知时必须人工复核，禁止由此生成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r026",
          "title": "改稿、续期、解除与原审批关系",
          "requirement": "源研究规则 R026。PX；改稿、续期、解除与原审批关系；真：C07/C12/C13 变更既有条款、续签或拟解除；假：同版本仅重传→NOT_APPLICABLE；未知：新旧条款无法对齐；SRC-001/SRC-002/SRC-012；F019/F021/F026/F033；M004/M014/M020。逐条 diff，识别主体/金额/期限/权利义务/责任变化及所依审批对象；B/C 文本，A 级决定；已签后按解读第 40/41 条所涉程序由法务核定；形式重排不自动认定无影响。PASS_FACT/CONFLICT/UNREADABLE/NEEDS_HUMAN_DECISION；下一：原批准者/法务/相应专项 Owner。执行边界：仅形成可追溯事实预审、风险提示或待办；校内政策适用/现行性/权限未知时必须人工复核，禁止由此生成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r027",
          "title": "撤回、重提与复核决定的有效性",
          "requirement": "源研究规则 R027。PX；撤回、重提与复核决定的有效性；真：C10/C11 有真实撤回/异议/复核请求；假：无请求→NOT_APPLICABLE；未知：代理资格、受理时点或原决定不清；SRC-001/SRC-002/SRC-008；F002/F035/F036；M022/M023/M003。请求人与可授权身份、原决定、送达/签约时点、正式答复事件及对象版本核对；A/B；提交请求不等于撤回获准；签约后不得通过按钮抹去合同；复核时限/决定者待核。PASS_FACT/NEEDS_MATERIAL/CONFLICT/POLICY_UNCONFIRMED/NEEDS_HUMAN_DECISION；下一：原经办/有权受理及复核岗位。执行边界：仅形成可追溯事实预审、风险提示或待办；校内政策适用/现行性/权限未知时必须人工复核，禁止由此生成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r028",
          "title": "签约终版归档与证据闭环",
          "requirement": "源研究规则 R028。P5；签约终版归档与证据闭环；真：声称已完成签署用印或需移交归档；假：P0–P4 尚未具备归档条件→延后；未知：档案与印章记录版本互斥；SRC-001/SRC-002/SRC-003；F031/F032/F037；M018/M019/M024。最终文件 hash、合同编号、印章登记、归档时点及归属部门交叉校对；A 优先；缺归档不能倒推原合同当然无效；保存原事件并派归档待办。PASS_FACT/NEEDS_MATERIAL/CONFLICT/SOURCE_UNAVAILABLE；下一：档案/承办部门。执行边界：仅形成可追溯事实预审、风险提示或待办；校内政策适用/现行性/权限未知时必须人工复核，禁止由此生成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        }
      ]
    },
    {
      "id": "privacy-and-electronic-signature",
      "name": "个人信息与电子签名",
      "description": "按原研究稿规则章节分组；用于本地研究预审，不构成校方审批流程或正式授权。",
      "order": 3,
      "required": true,
      "criteria": [
        {
          "id": "r029",
          "title": "本案自然人数据采集/读取是否落在必要用途与获准角色范围",
          "requirement": "源研究规则 R029。P0–P5/PX；本案自然人数据采集/读取是否落在必要用途与获准角色范围；真：读取或转交经办人、外方代理人的个人信息；假：完全没有自然人字段及个人信息处理→NOT_APPLICABLE；未知：访问目的/依据未明；SRC-013；F003/F007/F008/F038；M002/M005/M025。比对拟采集字段、法定处理基础、业务必要性、校方批准的访问角色、保留与对外传输限制；只按有权隐私管理核定策略判事实；PASS_FACT 只证明有可核处理依据和范围；不等于有权签合同。真实敏感身份材料超范围时停止向未授权环境传输，NEEDS_HUMAN_DECISION/POLICY_UNCONFIRMED/SOURCE_UNAVAILABLE/CONFLICT；下一：校方个人信息/数据治理负责人。执行边界：仅形成可追溯事实预审、风险提示或待办；校内政策适用/现行性/权限未知时必须人工复核，禁止由此生成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r030",
          "title": "已发生电子签名的原始数据、完整性与可验证证书状态",
          "requirement": "源研究规则 R030。P4/P5；已发生电子签名的原始数据、完整性与可验证证书状态；真：双方主张电子签署或校级电子用印已执行；假：仅拟用实物章、无电子签署主张→NOT_APPLICABLE；未知：只有章图片/PDF截图或签名覆盖范围不明；SRC-014/SRC-009；F031/F032/F039；M018/M019/M026。按授权验签服务核签名覆盖的字节/合同 hash、签名证书主体、验证时点和撤销状态；无私钥外传，原件 A 优先；技术验签 PASS_FACT 不推定学校签署人获授权、合同当然生效或印章已被校方批准执行；后三者分别由 R020/R023/R024/法务核。UNREADABLE/CONFLICT/SOURCE_UNAVAILABLE/NEEDS_HUMAN_DECISION；下一：电子签平台/印信管理员/法务。执行边界：仅形成可追溯事实预审、风险提示或待办；校内政策适用/现行性/权限未知时必须人工复核，禁止由此生成正式批准或拒绝。",
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
      "name": "P0/PX：本地案卷、主体与当前版本核验（非校方受理）",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "workflowOwner": "local",
      "nextStageId": "local-contract-review"
    },
    {
      "id": "local-contract-review",
      "name": "P1–P3：本地归口、实质条款与风险事实预审（不作正式合同批准）",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "workflowOwner": "local",
      "nextStageId": "local-human-gate",
      "returnToStageId": "local-intake"
    },
    {
      "id": "local-human-gate",
      "name": "P4/P5/PX：人工复核与签署、用印、归档事实交接（非正式批准）",
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
  "templateId": "T07-T02",
  "name": "单位一般对外合同、协议的实质内容审查与用印",
  "sourceDocumentPath": "docs/design/review-agent/business-templates/R02/T07-T02.md",
  "sourceDocumentSha256": "64c6d35bce9a166fc7ec674cbfec56dd81f386202ccd991030e5bef250b2c4e6",
  "sourceDocumentBytes": 131691,
  "sourceOriginalPath": "docs/design/review-agent/business-templates/R02/research-original/T07-T02.md",
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
    "SRC-016",
    "SRC-017"
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
    "F039"
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
    "M023",
    "M024",
    "M025",
    "M026"
  ],
  "criteria": [
    {
      "sectionId": "identity-and-text",
      "criterionId": "r001",
      "srcIds": [
        "SRC-001",
        "SRC-007",
        "SRC-008"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "identity-and-text",
      "criterionId": "r002",
      "srcIds": [
        "SRC-001",
        "SRC-003"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "identity-and-text",
      "criterionId": "r003",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-006"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "identity-and-text",
      "criterionId": "r004",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-012"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "identity-and-text",
      "criterionId": "r005",
      "srcIds": [
        "SRC-012"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "identity-and-text",
      "criterionId": "r006",
      "srcIds": [
        "SRC-012"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "identity-and-text",
      "criterionId": "r007",
      "srcIds": [
        "SRC-001",
        "SRC-012"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "identity-and-text",
      "criterionId": "r008",
      "srcIds": [
        "SRC-012"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "routing-and-risk-review",
      "criterionId": "r009",
      "srcIds": [
        "SRC-001",
        "SRC-010",
        "SRC-011",
        "SRC-015",
        "SRC-016",
        "SRC-017"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "routing-and-risk-review",
      "criterionId": "r010",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-003"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "routing-and-risk-review",
      "criterionId": "r011",
      "srcIds": [
        "SRC-001",
        "SRC-002"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "routing-and-risk-review",
      "criterionId": "r012",
      "srcIds": [
        "SRC-001",
        "SRC-002"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "routing-and-risk-review",
      "criterionId": "r013",
      "srcIds": [
        "SRC-001",
        "SRC-002"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "routing-and-risk-review",
      "criterionId": "r014",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-010"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "routing-and-risk-review",
      "criterionId": "r015",
      "srcIds": [
        "SRC-001",
        "SRC-010",
        "SRC-011",
        "SRC-017"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "routing-and-risk-review",
      "criterionId": "r016",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-003",
        "SRC-012"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "routing-and-risk-review",
      "criterionId": "r017",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-003"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "approval-signature-archive",
      "criterionId": "r018",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-008"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "approval-signature-archive",
      "criterionId": "r019",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-012"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "approval-signature-archive",
      "criterionId": "r020",
      "srcIds": [
        "SRC-001",
        "SRC-004",
        "SRC-005",
        "SRC-006"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "approval-signature-archive",
      "criterionId": "r021",
      "srcIds": [
        "SRC-003",
        "SRC-009",
        "SRC-002"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "approval-signature-archive",
      "criterionId": "r022",
      "srcIds": [
        "SRC-002",
        "SRC-003",
        "SRC-009"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "approval-signature-archive",
      "criterionId": "r023",
      "srcIds": [
        "SRC-001",
        "SRC-012"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "approval-signature-archive",
      "criterionId": "r024",
      "srcIds": [
        "SRC-003",
        "SRC-009"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "approval-signature-archive",
      "criterionId": "r025",
      "srcIds": [
        "SRC-001",
        "SRC-002"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "approval-signature-archive",
      "criterionId": "r026",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-012"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "approval-signature-archive",
      "criterionId": "r027",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-008"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "approval-signature-archive",
      "criterionId": "r028",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-003"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "privacy-and-electronic-signature",
      "criterionId": "r029",
      "srcIds": [
        "SRC-013"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "privacy-and-electronic-signature",
      "criterionId": "r030",
      "srcIds": [
        "SRC-014",
        "SRC-009"
      ],
      "evidenceStatus": "UNCONFIRMED"
    }
  ]
} as const
