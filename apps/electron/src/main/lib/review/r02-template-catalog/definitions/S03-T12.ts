import type { TemplateVersion } from '@profer/shared'

/** 本地研究模板；不代表学校已发布或授权。 */
export const S03T12: TemplateVersion = {
  "templateId": "S03-T12",
  "version": 1,
  "schemaVersion": 2,
  "name": "应征入伍服兵役学生学费补偿、贷款代偿与退役后学费减免审核",
  "description": "应征入伍服兵役学生学费补偿、贷款代偿与退役后学费减免审核。本地研究模板 · 非校方正式模板。仅供事实核验和人工复核建议；不得代替校本制度或正式决定。",
  "catalogKind": "builtin",
  "sourceNote": "R02_RESEARCH_TEMPLATE_NONOFFICIAL: 来源 docs/design/review-agent/business-templates/R02/research-original/S03-T12.md；非校方正式模板。政策证据 PARTIAL；当期校本授权和最终决定未确认，不创建政策版本，不作学校远端回写。",
  "objectType": "person",
  "displayName": {
    "template": "{{f001}} · 应征入伍服兵役学生学费补偿、贷款代偿与退役后学费减免审核"
  },
  "fields": [
    {
      "key": "f001",
      "label": "姓名（F001）",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case"
    },
    {
      "key": "f002",
      "label": "法定身份证件号（F002）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case"
    },
    {
      "key": "f003",
      "label": "学号/身份关联键（F003）",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case"
    },
    {
      "key": "f004",
      "label": "申请人类别（F004）",
      "kind": "enum",
      "required": false,
      "visibility": "public",
      "scope": "case"
    },
    {
      "key": "f005",
      "label": "学历层次（F005）",
      "kind": "enum",
      "required": false,
      "visibility": "public",
      "scope": "case"
    },
    {
      "key": "f006",
      "label": "本次所属学段（F006）",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case"
    },
    {
      "key": "f007",
      "label": "学校/院系/专业（F007）",
      "kind": "object",
      "required": false,
      "visibility": "public",
      "scope": "case"
    },
    {
      "key": "f008",
      "label": "学籍、毕业、保留/复学/报到状态（F008）",
      "kind": "enum",
      "required": false,
      "visibility": "public",
      "scope": "case"
    },
    {
      "key": "f009",
      "label": "本学段基本修业年限（F009）",
      "kind": "number",
      "required": false,
      "visibility": "public",
      "scope": "case"
    },
    {
      "key": "f010",
      "label": "入学/注册时间（F010）",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case"
    },
    {
      "key": "f011",
      "label": "入伍前已完成学制年限（F011）",
      "kind": "date",
      "required": false,
      "visibility": "public",
      "scope": "case"
    },
    {
      "key": "f012",
      "label": "退役后应完成剩余学制年限（F012）",
      "kind": "number",
      "required": false,
      "visibility": "public",
      "scope": "case"
    },
    {
      "key": "f013",
      "label": "本次申请路线（F013）",
      "kind": "enum",
      "required": false,
      "visibility": "public",
      "scope": "case"
    },
    {
      "key": "f014",
      "label": "业务子类（F014）",
      "kind": "enum",
      "required": false,
      "visibility": "public",
      "scope": "case"
    },
    {
      "key": "f015",
      "label": "申请填报日期（F015）",
      "kind": "date",
      "required": false,
      "visibility": "public",
      "scope": "case"
    },
    {
      "key": "f016",
      "label": "当前申报批次与截止（F016）",
      "kind": "object",
      "required": false,
      "visibility": "public",
      "scope": "case"
    },
    {
      "key": "f017",
      "label": "入伍类别（F017）",
      "kind": "enum",
      "required": false,
      "visibility": "public",
      "scope": "case"
    },
    {
      "key": "f018",
      "label": "批准入伍时间（F018）",
      "kind": "date",
      "required": false,
      "visibility": "public",
      "scope": "case"
    },
    {
      "key": "f019",
      "label": "入伍通知书号/引用键（F019）",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case"
    },
    {
      "key": "f020",
      "label": "征兵办核章/批准记录 attestationRef（F020）",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case"
    },
    {
      "key": "f021",
      "label": "退出现役时间（F021）",
      "kind": "date",
      "required": false,
      "visibility": "public",
      "scope": "case"
    },
    {
      "key": "f022",
      "label": "退役证件号（F022）",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case"
    },
    {
      "key": "f023",
      "label": "自主就业/异常退役权威状态（F023）",
      "kind": "enum",
      "required": false,
      "visibility": "public",
      "scope": "case"
    },
    {
      "key": "f024",
      "label": "实际复学/恢复入学/新考入类别与日期（F024）",
      "kind": "date",
      "required": false,
      "visibility": "public",
      "scope": "case"
    },
    {
      "key": "f025",
      "label": "收费归属学年/学期 period（F025）",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case"
    },
    {
      "key": "f026",
      "label": "应缴学费金额（F026）",
      "kind": "number",
      "required": false,
      "visibility": "public",
      "scope": "case"
    },
    {
      "key": "f027",
      "label": "已实际缴学费金额（F027）",
      "kind": "number",
      "required": false,
      "visibility": "public",
      "scope": "case"
    },
    {
      "key": "f028",
      "label": "其他减免/免除全部学费状态与属期（F028）",
      "kind": "object",
      "required": false,
      "visibility": "internal",
      "scope": "case"
    },
    {
      "key": "f029",
      "label": "国家助学贷款类型（F029）",
      "kind": "enum",
      "required": false,
      "visibility": "public",
      "scope": "case"
    },
    {
      "key": "f030",
      "label": "贷款合同号及合同关联 ref（F030）",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case"
    },
    {
      "key": "f031",
      "label": "**实际用于学费**的贷款本金（F031）",
      "kind": "number",
      "required": false,
      "visibility": "public",
      "scope": "case"
    },
    {
      "key": "f032",
      "label": "贷款利息及计算区间（F032）",
      "kind": "object",
      "required": false,
      "visibility": "public",
      "scope": "case"
    },
    {
      "key": "f033",
      "label": "已还/未结清及余额状态（F033）",
      "kind": "object",
      "required": false,
      "visibility": "public",
      "scope": "case"
    },
    {
      "key": "f034",
      "label": "本人签字偿还计划 signedRef（F034）",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case"
    },
    {
      "key": "f035",
      "label": "申请填报金额（F035）",
      "kind": "number",
      "required": false,
      "visibility": "internal",
      "scope": "case"
    },
    {
      "key": "f036",
      "label": "已享受本政策资助的历史纪录（F036）",
      "kind": "object",
      "required": false,
      "visibility": "public",
      "scope": "case"
    },
    {
      "key": "f037",
      "label": "退役后各学年拟减免表 periodAmount[]（F037）",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case"
    },
    {
      "key": "f038",
      "label": "适用政策版本及生效属期 policyRef+period（F038）",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case"
    },
    {
      "key": "f039",
      "label": "校财务审核意见和签章 attestationRef（F039）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case"
    },
    {
      "key": "f040",
      "label": "学校资助部门审核及复核意见 attestationRef（F040）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case"
    },
    {
      "key": "f041",
      "label": "实际审查人可信身份/权限 actorRef（F041）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case"
    },
    {
      "key": "f042",
      "label": "最终有效决定编号/时间/状态 decisionRef（F042）",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case"
    },
    {
      "key": "f043",
      "label": "实际代偿、补偿或减免执行流水 ledgerRef[]（F043）",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case"
    },
    {
      "key": "f044",
      "label": "来源文件 ID、版本、页/栏、hash、有效期 provenanceRef（F044）",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case"
    },
    {
      "key": "f045",
      "label": "补件/撤回/申诉/复核意愿及差异 eventRef（F045）",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case"
    },
    {
      "key": "f046",
      "label": "退兵、除名、非正常退役资格认定 attestationRef（F046）",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case"
    }
  ],
  "materialSlots": [
    {
      "id": "M001",
      "name": "本人提出入伍补偿或代偿",
      "purpose": "本人提出入伍补偿或代偿；申请人填写，系统表单由全国征兵网生成；**现 P0**：申请表 I 本人填写和签字；若只咨询不申报暂不要求。合法替代仅以有权校方认可的电子表/打印原件，不接受自行编辑伪表；F001–F003 F013–F015 F017 F029–F035；SRC-005 附 7 第 8 条/表 I，SRC-001/002；记录生成版、签字时点、学生/学历阶段、表单 URL 或页区；缺签 NM、扫描不清 UR；未到 P1 不因无征兵办章判缺件",
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
        "本人提出入伍补偿或代偿；申请人填写，系统表单由全国征兵网生成；**现 P0**：申请表 I 本人填写和签字；若只咨询不申报暂不要求。合法替代仅以有权校方认可的电子表/打印原件，不接受自行编辑伪表；F001–F003 F013–F015 F017 F029–F035；SRC-005 附 7 第 8 条/表 I，SRC-0"
      ],
      "allowReuseAcrossSubjects": false,
      "requiredAt": "submission"
    },
    {
      "id": "M002",
      "name": "退役后提出学费减免",
      "purpose": "退役后提出学费减免；本人填写、全国征兵网；**现 Q0**：表 II 本人栏，含复学/入学类型、学年学费；合法替代须学校认可且同等可核的正式表；F001–F003 F010 F012–F015 F021–F024 F035 F037；SRC-005 第 9 条/表 II；绑定此次退役后学段和申请日期；缺本人部分 NM、不可读 UR；学校/机关后签栏不属于本人当前材料",
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
        "退役后提出学费减免；本人填写、全国征兵网；**现 Q0**：表 II 本人栏，含复学/入学类型、学年学费；合法替代须学校认可且同等可核的正式表；F001–F003 F010 F012–F015 F021–F024 F035 F037；SRC-005 第 9 条/表 II；绑定此次退役后学段和申请日期；缺本人部分 NM、"
      ],
      "allowReuseAcrossSubjects": false,
      "requiredAt": "submission"
    },
    {
      "id": "M003",
      "name": "真实申请主体、证件与校内账户绑定",
      "purpose": "真实申请主体、证件与校内账户绑定；学校可信身份服务/有权核验证件机构；**现 P0/Q0**：学校可信身份核验记录优先；若尚无该机制，在有权经办下核对法定证件原件或有效认证副本。不可仅靠头像和姓名；F001–F004；SRC-005 表 I/II；SRC-003 待核；记录身份证件部分遮蔽值、核验机构与时间；取不到 SU/HU，证件破损 UR；无理由不要求重复上传完整身份证",
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
        "真实申请主体、证件与校内账户绑定；学校可信身份服务/有权核验证件机构；**现 P0/Q0**：学校可信身份核验记录优先；若尚无该机制，在有权经办下核对法定证件原件或有效认证副本。不可仅靠头像和姓名；F001–F004；SRC-005 表 I/II；SRC-003 待核；记录身份证件部分遮蔽值、核验机构与时间；取不到 S"
      ],
      "allowReuseAcrossSubjects": false,
      "requiredAt": "submission"
    },
    {
      "id": "M004",
      "name": "本校在籍/毕业/复学及所在专业",
      "purpose": "本校在籍/毕业/复学及所在专业；学校学籍管理部门；**现 P0/Q0，条 Q1**：正式学籍、毕业、复学状态记录；认可本校 S01 有权结论链接，不以申请人口述代替；F003–F008 F010–F012 F024；SRC-005 第 2、7、9 条；SRC-003 待核；绑定原就读校、学历段、状态生效日；来源不通 SU，矛盾 CONFLICT/HU；不要上传两次同一校证明",
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
        "本校在籍/毕业/复学及所在专业；学校学籍管理部门；**现 P0/Q0，条 Q1**：正式学籍、毕业、复学状态记录；认可本校 S01 有权结论链接，不以申请人口述代替；F003–F008 F010–F012 F024；SRC-005 第 2、7、9 条；SRC-003 待核；绑定原就读校、学历段、状态生效日；来源不通 S"
      ],
      "allowReuseAcrossSubjects": false,
      "requiredAt": "submission"
    },
    {
      "id": "M005",
      "name": "学段与国家规定基本修业年限",
      "purpose": "学段与国家规定基本修业年限；学校教务/研究生培养主管部门；**现 P0/Q0，条 C07**：正式培养方案学制、学籍异动/已修学制记录；学校权威接口（如有）可代纸质说明；F005 F006 F009 F011 F012；SRC-005 附 7 第 7 条；绑定入伍时适用培养方案及当前学段版本；读不到 SU；跨专业/留级争议 HU，不以年级直接折算",
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
        "学段与国家规定基本修业年限；学校教务/研究生培养主管部门；**现 P0/Q0，条 C07**：正式培养方案学制、学籍异动/已修学制记录；学校权威接口（如有）可代纸质说明；F005 F006 F009 F011 F012；SRC-005 附 7 第 7 条；绑定入伍时适用培养方案及当前学段版本；读不到 SU；跨专业/留级"
      ],
      "allowReuseAcrossSubjects": false,
      "requiredAt": "submission"
    },
    {
      "id": "M006",
      "name": "应缴/实缴学费及退役后分年收费",
      "purpose": "应缴/实缴学费及退役后分年收费；学校计划财务部门；**现 P0/Q0，条 Q1**：按学年及学习阶段的收费/退款账、核定收费标准；正式财务凭证是替代，不以截图代替权威账；F025–F027 F035 F037 F039；SRC-004/005 附表 I/II；逐笔记录学年/金额/退款/来源账键；校方接口不可达 SU，扫描票据不可读 UR；缴费尚未产生不按 0 元驳回",
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
        "应缴/实缴学费及退役后分年收费；学校计划财务部门；**现 P0/Q0，条 Q1**：按学年及学习阶段的收费/退款账、核定收费标准；正式财务凭证是替代，不以截图代替权威账；F025–F027 F035 F037 F039；SRC-004/005 附表 I/II；逐笔记录学年/金额/退款/来源账键；校方接口不可达 SU，扫"
      ],
      "allowReuseAcrossSubjects": false,
      "requiredAt": "submission"
    },
    {
      "id": "M007",
      "name": "已通过其他方式减免学费的范围、金额和年度",
      "purpose": "已通过其他方式减免学费的范围、金额和年度；校财务/资助部门；**条 C01/C02/C04/C07**：已生效免除/部分减免决定和账；若本校有权账簿可直接引用，不要求再次上传原件；F025 F028 F036；SRC-001/002/005 第 4 条，SRC-004；绑定同一费用年度与项目，完全免学费≠部分减免；权威缺 SU、口径冲突 HU",
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
        "已通过其他方式减免学费的范围、金额和年度；校财务/资助部门；**条 C01/C02/C04/C07**：已生效免除/部分减免决定和账；若本校有权账簿可直接引用，不要求再次上传原件；F025 F028 F036；SRC-001/002/005 第 4 条，SRC-004；绑定同一费用年度与项目，完全免学费≠部分减免；权威"
      ],
      "allowReuseAcrossSubjects": false,
      "requiredAt": "submission"
    },
    {
      "id": "M008",
      "name": "证明**已经批准**正式入伍",
      "purpose": "证明**已经批准**正式入伍；批准入伍地征兵机关/申请人持有；**后 P1 才必需**：《入伍通知书》或有权机关的可核验正式同等证明；P0 不要求；F017–F019；SRC-005 附 7 第 8 条，SRC-001/002；保存机关、文号、批准时间和影像页；批准未发生 NA；P1 缺 NM、字迹 UR、真伪争议 HU",
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
        "证明**已经批准**正式入伍；批准入伍地征兵机关/申请人持有；**后 P1 才必需**：《入伍通知书》或有权机关的可核验正式同等证明；P0 不要求；F017–F019；SRC-005 附 7 第 8 条，SRC-001/002；保存机关、文号、批准时间和影像页；批准未发生 NA；P1 缺 NM、字迹 UR、真伪争议 H"
      ],
      "allowReuseAcrossSubjects": false,
      "requiredAt": "submission"
    },
    {
      "id": "M009",
      "name": "表 I 上的兵役机关批准入伍及军士类别认证",
      "purpose": "表 I 上的兵役机关批准入伍及军士类别认证；县级征兵办；**后 P1**：同 M001 一份表内的征兵办认证栏或等效有权签章记录；不另要一张相同表；F017–F020；SRC-005 附 7 第 8 条/表 I；指向表 I 的具体页区与核章日期；印章 OCR 不是权威数字签名；缺 NM，疑章 HU",
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
        "表 I 上的兵役机关批准入伍及军士类别认证；县级征兵办；**后 P1**：同 M001 一份表内的征兵办认证栏或等效有权签章记录；不另要一张相同表；F017–F020；SRC-005 附 7 第 8 条/表 I；指向表 I 的具体页区与核章日期；印章 OCR 不是权威数字签名；缺 NM，疑章 HU"
      ],
      "allowReuseAcrossSubjects": false,
      "requiredAt": "submission"
    },
    {
      "id": "M010",
      "name": "证明国家助学贷款合同及贷款种类",
      "purpose": "证明国家助学贷款合同及贷款种类；本人/经办银行或生源地资助机构；**条 C02、C01 曾有贷款**：国家助学贷款借款合同或银行可核验正式电子合同；无贷款不需要；F029 F030 F032；SRC-005 附 7 第 8 条/表 I；同一合同号、借贷主体和学费属期；缺 NM、扫描不可读 UR、银行数据不符 HU",
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
        "证明国家助学贷款合同及贷款种类；本人/经办银行或生源地资助机构；**条 C02、C01 曾有贷款**：国家助学贷款借款合同或银行可核验正式电子合同；无贷款不需要；F029 F030 F032；SRC-005 附 7 第 8 条/表 I；同一合同号、借贷主体和学费属期；缺 NM、扫描不可读 UR、银行数据不符 HU"
      ],
      "allowReuseAcrossSubjects": false,
      "requiredAt": "submission"
    },
    {
      "id": "M011",
      "name": "核贷款中**用于学费**的本金、应计利息和余额",
      "purpose": "核贷款中**用于学费**的本金、应计利息和余额；银行/县级资助机构；**条 C02，条 C01 曾借款**：有权机构贷款数据或盖章回函；本人账单作线索，不能替代银行确认；F029–F033；SRC-005 主文第 5 条及附 7 第 8、10 条，SRC-004；分合同/学年/用途/利息区间，原始时间快照；来源失联 SU，不能直接用贷款总额代替学费用途",
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
        "核贷款中**用于学费**的本金、应计利息和余额；银行/县级资助机构；**条 C02，条 C01 曾借款**：有权机构贷款数据或盖章回函；本人账单作线索，不能替代银行确认；F029–F033；SRC-005 主文第 5 条及附 7 第 8、10 条，SRC-004；分合同/学年/用途/利息区间，原始时间快照；来源失联 S"
      ],
      "allowReuseAcrossSubjects": false,
      "requiredAt": "submission"
    },
    {
      "id": "M012",
      "name": "本人确认偿还贷款计划",
      "purpose": "本人确认偿还贷款计划；本人签名；**条 C02 或需要处理国家助学贷款的 C01**：本人签署的偿还计划，纸/认可电子签名；不能让学校或 AI 代签；F034；SRC-005 附 7 第 8 条；保存本人签名、合同关联、日期与版本；缺 NM，无法核签 HU",
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
        "本人确认偿还贷款计划；本人签名；**条 C02 或需要处理国家助学贷款的 C01**：本人签署的偿还计划，纸/认可电子签名；不能让学校或 AI 代签；F034；SRC-005 附 7 第 8 条；保存本人签名、合同关联、日期与版本；缺 NM，无法核签 HU"
      ],
      "allowReuseAcrossSubjects": false,
      "requiredAt": "submission"
    },
    {
      "id": "M013",
      "name": "证明已偿还贷款、是否结清及后来付款方向",
      "purpose": "证明已偿还贷款、是否结清及后来付款方向；经办银行/学生持银行凭据；**条** 往届学生申代偿时已有还款凭据；**后 P2** 实际代偿执行回单才产生；银行原始流水是可信替代；F032 F033 F043；SRC-005 附 7 第 8、10、11 条；合同、还款日期、本息、流水号；未到执行 NA，已执行但银行未返回 SU；不可读 UR",
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
        "证明已偿还贷款、是否结清及后来付款方向；经办银行/学生持银行凭据；**条** 往届学生申代偿时已有还款凭据；**后 P2** 实际代偿执行回单才产生；银行原始流水是可信替代；F032 F033 F043；SRC-005 附 7 第 8、10、11 条；合同、还款日期、本息、流水号；未到执行 NA，已执行但银行未返回 S"
      ],
      "allowReuseAcrossSubjects": false,
      "requiredAt": "submission"
    },
    {
      "id": "M014",
      "name": "退出现役及其时间",
      "purpose": "退出现役及其时间；兵役/退役机关签发、本人持有；**现 Q0**：退役证书或有权部门等效正式记录；尚未退役不属于 Q0；F021 F022 F023；SRC-005 附 7 第 9 条，SRC-001/002；证号、签发机关、入退伍日期及页区；缺 NM，不可读 UR；不自动推出自主就业",
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
        "退出现役及其时间；兵役/退役机关签发、本人持有；**现 Q0**：退役证书或有权部门等效正式记录；尚未退役不属于 Q0；F021 F022 F023；SRC-005 附 7 第 9 条，SRC-001/002；证号、签发机关、入退伍日期及页区；缺 NM，不可读 UR；不自动推出自主就业"
      ],
      "allowReuseAcrossSubjects": false,
      "requiredAt": "submission"
    },
    {
      "id": "M015",
      "name": "对表 II 上的退役事实及退役入学自主就业身份作机关认证",
      "purpose": "对表 II 上的退役事实及退役入学自主就业身份作机关认证；县级征兵办/退役军人事务部门；**条 Q0**：表 II 征兵办栏；对退役入学的自主就业栏是相应身份核验条件；同 M002 表中后填栏，具体 CDUT 校本顺序待核 M025；F021–F024；SRC-005 附表 II、第 16 条，SRC-014 未验证；按每个权威机关分别标签发日期与页区；若该机关意见尚在办理，仅待阶段完成；权威否定/冲突 HU",
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
        "对表 II 上的退役事实及退役入学自主就业身份作机关认证；县级征兵办/退役军人事务部门；**条 Q0**：表 II 征兵办栏；对退役入学的自主就业栏是相应身份核验条件；同 M002 表中后填栏，具体 CDUT 校本顺序待核 M025；F021–F024；SRC-005 附表 II、第 16 条，SRC-014 未验证；"
      ],
      "allowReuseAcrossSubjects": false,
      "requiredAt": "submission"
    },
    {
      "id": "M016",
      "name": "入伍前录取/保留入学资格、退役后恢复资格或退役新考入后报到",
      "purpose": "入伍前录取/保留入学资格、退役后恢复资格或退役新考入后报到；招生/学籍主管部门；**条 C05/C06，条 C04 状态有争议**：本校有权录取、保留/恢复入学资格、招生考试类别与报到信息；已有 S01 权威结论则引用；F004 F006 F008 F010 F024；SRC-005 附 7 第 3、9 条；原录取批次与后续报到事件分版本，不能只看申请人录取截图；未报到不能进入 Q0；来源不通 SU",
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
        "入伍前录取/保留入学资格、退役后恢复资格或退役新考入后报到；招生/学籍主管部门；**条 C05/C06，条 C04 状态有争议**：本校有权录取、保留/恢复入学资格、招生考试类别与报到信息；已有 S01 权威结论则引用；F004 F006 F008 F010 F024；SRC-005 附 7 第 3、9 条；原录取批次"
      ],
      "allowReuseAcrossSubjects": false,
      "requiredAt": "submission"
    },
    {
      "id": "M017",
      "name": "核查既往本政策及其他学费减免、贷款代偿历史，避免重叠支付",
      "purpose": "核查既往本政策及其他学费减免、贷款代偿历史，避免重叠支付；学校资助部门/校财务、必要时跨校主管单位；**条 C04/C06/C07，核重时普遍使用**：历史有权审批与资金系统记录；申请人声明只是线索；F028 F036；SRC-005 附 7 第 5、7、9 条，SRC-004；学段、项目、金额、年限、发放/减免状态逐条绑定；外校不可查 SU/HU，不能自动假设零历史",
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
        "核查既往本政策及其他学费减免、贷款代偿历史，避免重叠支付；学校资助部门/校财务、必要时跨校主管单位；**条 C04/C06/C07，核重时普遍使用**：历史有权审批与资金系统记录；申请人声明只是线索；F028 F036；SRC-005 附 7 第 5、7、9 条，SRC-004；学段、项目、金额、年限、发放/减免状态逐"
      ],
      "allowReuseAcrossSubjects": false,
      "requiredAt": "submission"
    },
    {
      "id": "M018",
      "name": "当批受理规则、政策适用时点与金额版本",
      "purpose": "当批受理规则、政策适用时点与金额版本；学校/上位主管部门；**策，当前办理必核**：当期 CDUT 通知、校本实施办法与国家有效调标文件；不是学生上传材料；F016 F038；SRC-001/002/003/005/006/007/013；存发布、生效/废止、适用入伍时间和学费年度；当期缺失 PC；2025–2026 历史文件不作 2026 秋时限",
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
        "当批受理规则、政策适用时点与金额版本；学校/上位主管部门；**策，当前办理必核**：当期 CDUT 通知、校本实施办法与国家有效调标文件；不是学生上传材料；F016 F038；SRC-001/002/003/005/006/007/013；存发布、生效/废止、适用入伍时间和学费年度；当期缺失 PC；2025–2026 "
      ],
      "allowReuseAcrossSubjects": false,
      "requiredAt": "submission"
    },
    {
      "id": "M019",
      "name": "学校财务、资助管理部门及学校复核的正式审查意见",
      "purpose": "学校财务、资助管理部门及学校复核的正式审查意见；真实岗位人员；**后 P0/P1/Q0 相关审核节点**：表 I/II 学校审核栏、学校签章/有权电子审批记录；同表 M001/M002 不重复索取；F039–F041；SRC-005 附表 I/II，SRC-003 待校本核权；每份意见绑定 actorRef、部门、签署时点、制度授权、同意范围；未轮到此节点 NA；图章影像只验“看得到”，不代可信身份",
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
        "学校财务、资助管理部门及学校复核的正式审查意见；真实岗位人员；**后 P0/P1/Q0 相关审核节点**：表 I/II 学校审核栏、学校签章/有权电子审批记录；同表 M001/M002 不重复索取；F039–F041；SRC-005 附表 I/II，SRC-003 待校本核权；每份意见绑定 actorRef、部门、签署"
      ],
      "allowReuseAcrossSubjects": false,
      "requiredAt": "submission"
    },
    {
      "id": "M020",
      "name": "正式有效的资助资格/金额/撤销/复核决定",
      "purpose": "正式有效的资助资格/金额/撤销/复核决定；有权学校或其他指定机关；**后 P2/Q1/X1**：正式决定书、审批记录、上报获认定结果；不将表中准备意见自动视作最终决定；F036 F040 F042 F046；SRC-005 第 8/9/13–16 条，SRC-003 待核；一案可有原决定/变更决定，均保留签发主体与生效时间；尚未产生 NA，已作决定却取不到 SU",
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
        "正式有效的资助资格/金额/撤销/复核决定；有权学校或其他指定机关；**后 P2/Q1/X1**：正式决定书、审批记录、上报获认定结果；不将表中准备意见自动视作最终决定；F036 F040 F042 F046；SRC-005 第 8/9/13–16 条，SRC-003 待核；一案可有原决定/变更决定，均保留签发主体与生效"
      ],
      "allowReuseAcrossSubjects": false,
      "requiredAt": "submission"
    },
    {
      "id": "M021",
      "name": "证明资助是否实际支付、贷款是否代偿、学费是否减免",
      "purpose": "证明资助是否实际支付、贷款是否代偿、学费是否减免；财务/银行正式账；**后 P2/Q1**：汇款/代偿凭据、减免账及年度执行状态；不得以“审批通过”当作已到账；F025 F033 F036 F037 F043；SRC-005 第 5、8、9、10、11、18 条；资金流水号、支付对象、学年/合同与冲销记录，按归属年度独立；未发生 NA、对账不可达 SU",
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
        "证明资助是否实际支付、贷款是否代偿、学费是否减免；财务/银行正式账；**后 P2/Q1**：汇款/代偿凭据、减免账及年度执行状态；不得以“审批通过”当作已到账；F025 F033 F036 F037 F043；SRC-005 第 5、8、9、10、11、18 条；资金流水号、支付对象、学年/合同与冲销记录，按归属年度独"
      ],
      "allowReuseAcrossSubjects": false,
      "requiredAt": "submission"
    },
    {
      "id": "M022",
      "name": "记录补件、更正、撤回意愿、异议及权利人签署",
      "purpose": "记录补件、更正、撤回意愿、异议及权利人签署；申请人/合法代理人；**条 C08/C09**：原申请引用、本人签署补件或请求、具体争点与拟替换附件；代理权须另经确认；F015 F044 F045；SRC-001/002 补正线索；复核条款 SRC-003 待核；保留原案编号和原证据版本，不把撤回申请当撤回决定；请求不清 NM、校方受理权未知 HU",
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
        "记录补件、更正、撤回意愿、异议及权利人签署；申请人/合法代理人；**条 C08/C09**：原申请引用、本人签署补件或请求、具体争点与拟替换附件；代理权须另经确认；F015 F044 F045；SRC-001/002 补正线索；复核条款 SRC-003 待核；保留原案编号和原证据版本，不把撤回申请当撤回决定；请求不清 "
      ],
      "allowReuseAcrossSubjects": false,
      "requiredAt": "submission"
    },
    {
      "id": "M023",
      "name": "兵役退回、除名、特殊提前退役、自主就业身份复核、收回资助款等的事实和有权认定",
      "purpose": "兵役退回、除名、特殊提前退役、自主就业身份复核、收回资助款等的事实和有权认定；兵役/退役军人事务/教育主管部门；**条 C09、后 X1**：有权机关通知与资格认定，批准提前退役的正式文书；不能以医疗资料自裁结果；F021 F023 F046；SRC-005 附 7 第 13–16 条；机关、决定编号、原因、批准时间和送达/生效；资料来源不通 SU、归责疑义 HU；不得 AI 生成追缴决定",
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
        "兵役退回、除名、特殊提前退役、自主就业身份复核、收回资助款等的事实和有权认定；兵役/退役军人事务/教育主管部门；**条 C09、后 X1**：有权机关通知与资格认定，批准提前退役的正式文书；不能以医疗资料自裁结果；F021 F023 F046；SRC-005 附 7 第 13–16 条；机关、决定编号、原因、批准时间和"
      ],
      "allowReuseAcrossSubjects": false,
      "requiredAt": "submission"
    },
    {
      "id": "M024",
      "name": "经办交接、受理时点、证据版本、审批身份可信记录",
      "purpose": "经办交接、受理时点、证据版本、审批身份可信记录；学院/校资助中心/学校身份系统；**策/后各办理阶段**：带可核验人员身份的收件汇总、审批工作流日志、材料版本快照；2026 春学院资助专员签章汇总属历史通知要求；F016 F041 F044 F045；SRC-001/002/003；版本链不可覆盖；真实系统未接通时仅留纸质签收/授权待核，缺失 SU/HU；日志不代表实质审批",
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
        "经办交接、受理时点、证据版本、审批身份可信记录；学院/校资助中心/学校身份系统；**策/后各办理阶段**：带可核验人员身份的收件汇总、审批工作流日志、材料版本快照；2026 春学院资助专员签章汇总属历史通知要求；F016 F041 F044 F045；SRC-001/002/003；版本链不可覆盖；真实系统未接通时仅留"
      ],
      "allowReuseAcrossSubjects": false,
      "requiredAt": "submission"
    },
    {
      "id": "M025",
      "name": "校本详细审批路线、份数、签章先后",
      "purpose": "校本详细审批路线、份数、签章先后；成都理工大学学生资助中心；**策，尚未核全文**：2026 春公告所列《大学生应征入伍服兵役国家教育资助申请审批流程.docx》或更新后的校方正式办事指南，非申请人材料；F016 F038 F039–F041；SRC-001/003/014；现为 PC；不得因附件未能访问要求申请人自己提供，也不得照搬 SRC-010 他校流程",
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
        "校本详细审批路线、份数、签章先后；成都理工大学学生资助中心；**策，尚未核全文**：2026 春公告所列《大学生应征入伍服兵役国家教育资助申请审批流程.docx》或更新后的校方正式办事指南，非申请人材料；F016 F038 F039–F041；SRC-001/003/014；现为 PC；不得因附件未能访问要求申请人自己"
      ],
      "allowReuseAcrossSubjects": false,
      "requiredAt": "submission"
    }
  ],
  "sections": [
    {
      "id": "rules-08-2",
      "name": "身份、学籍、申请、入伍阶段（R001–R008）",
      "order": 0,
      "required": true,
      "criteria": [
        {
          "id": "R001",
          "title": "P0/Q0 申请人同一性",
          "requirement": "原文核验项：P0/Q0 申请人同一性。执行摘要：R001 P0/Q0 申请人同一性 | **T** 正式接收本人材料：F001/F002/F003 与可信学籍、证件和表 I/II 主体严格绑定；**F** 尚在匿名咨询；**U** 无可核身份键或机构无法核验 | SRC-005/001/002；F001–F003 F044；M001 M002 M003 | 可信身份及学号/录取键归属一致 PASS_FACT；不同人/同名错配 CONFLICT；本人资料缺 NEEDS_MATERIAL，权威核验不可达 SOURCE_UNAVAILABLE；学院受理人转学籍/身份部门，不允许 OCR 猜证件号。政策/权限/期限未知或冲突时必须转人工复核，不得形成正式资格结论。",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R002",
          "title": "P0/Q0 学段身份",
          "requirement": "原文核验项：P0/Q0 学段身份。执行摘要：R002 P0/Q0 学段身份 | **T** 有特定学历阶段申请：比对毕业/在校/新生类型、层次、校区/专业、学籍生效时间；**F** 无正式申报；**U** 录取/学籍来源尚不可得 | SRC-005 附 7 第 2/7 条、SRC-004/016；F004–F008 F010；M004 M005 M016 | 有权学校学籍结论与表单一致 PASS_FACT；状态/学段冲突 CONFLICT；未报到与学籍未建立属阶段判断；学校教务/研究生培养或招生部门核，外校/跨校不可仅凭本校搜索未命中否认。政策/权限/期限未知或冲突时必须转人工复核，不得形成正式资格结论。",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R003",
          "title": "P0/Q0/C07 受助年限",
          "requirement": "原文核验项：P0/Q0/C07 受助年限。执行摘要：R003 P0/Q0/C07 受助年限 | **T** 有已核学段及入退伍事件：按基本修业年限、入伍前完成与退役后剩余年限分段；**F** 申请不含本学段；**U** 基本学制或异动不足以确定 | SRC-005 附 7 第 7 条；F005 F006 F009–F012；M004 M005 M016 | 年限可追溯 PASS_FACT；休学留级/专升本/本硕连读与事实冲突 NEEDS_HUMAN_DECISION；缺权威学制 SOURCE_UNAVAILABLE；教务/培养主管，不按年份相减机械推导。政策/权限/期限未知或冲突时必须转人工复核，不得形成正式资格结论。",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R004",
          "title": "P0/Q0 申请类型和本人签署",
          "requirement": "原文核验项：P0/Q0 申请类型和本人签署。执行摘要：R004 P0/Q0 申请类型和本人签署 | **T** 已到本人申请阶段：表 I 补偿/代偿二选一，表 II 复学/入学二选一，本人填报/签署日期可核；**F** 该阶段还仅咨询；**U** 有表而类型、签署或版本无法辨识 | SRC-005 附表 7-1/7-2、第 8/9 条；F013–F015 F035 F044；M001 M002 | 单一路由并与本人意愿一致 PASS_FACT；两项同勾/错表 CONFLICT；当前本人签署缺 NEEDS_MATERIAL、模糊 UNREADABLE；本人补正，资助中心不代选；表 I 与 II 跨阶段同在案不视为同笔双申。政策/权限/期限未知或冲突时必须转人工复核，不得形成正式资格结论。",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R005",
          "title": "P0/P1 兵役类别与排除候选",
          "requirement": "原文核验项：P0/P1 兵役类别与排除候选。执行摘要：R005 P0/P1 兵役类别与排除候选 | **T** 申报入伍补偿代偿：核义务兵/招收军士，另核定向、委培、国防生、部队直接招干部等排除候选；**F** Q0 仅核退役减免分支；**U** 部队招录类别或就读身份来源不明 | SRC-005 附 7 第 3/4 条、SRC-001/002；F004 F008 F017；M001 M004 M008 M009 | 合法类别由阶段性有权证据确认 PASS_FACT；排除候选为 NEEDS_HUMAN_DECISION 而非模型“最终拒绝”；P0 未获正式入伍文书不算缺件；兵役机关+学校资助中心核。政策/权限/期限未知或冲突时必须转人工复核，不得形成正式资格结论。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R006",
          "title": "所有受理阶段政策/截止",
          "requirement": "原文核验项：所有受理阶段政策/截止。执行摘要：R006 所有受理阶段政策/截止 | **T** 需判断当前批次、金额或时限：比对申请事件时间、学段、资助类型与**已确认有效**的当批通知/校本细则；**F** 不涉及期限/金额的纯材料读取；**U** 未找到 2026–2027 当期正式文件或授权配置 | SRC-001/002/003/005/006/007/013/014/015/016；F016 F038；M018 M025 | 仅历史已确定的相应批次事实可 PASS_FACT；当期缺 POLICY_UNCONFIRMED，不得以 2025-09-30/2026-03-27 关案；学生资助中心取得原文件、校本政策经办人核有效性。政策/权限/期限未知或冲突时必须转人工复核，不得形成正式资格结论。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R007",
          "title": "P0 首轮学校财务/资助审核",
          "requirement": "原文核验项：P0 首轮学校财务/资助审核。执行摘要：R007 P0 首轮学校财务/资助审核 | **T** 本人正式提交表 I 且轮到学校首审：核学校核定资格/学费、学校相应栏签章及签署主体；**F** 未提交申请或仅预咨询；**U** 首审权限/签署记录不可证实 | SRC-005 附 7 第 8 条第（二）项、SRC-003/014；F025–F027 F039 F041；M001 M006 M019 M024 | 权威记录并与账簿一致 PASS_FACT；待学校处理 NEEDS_HUMAN_DECISION，不能将未轮到的学校章记作申请人 NEEDS_MATERIAL；签署身份伪造 CONFLICT；有权财务/资助岗位核。政策/权限/期限未知或冲突时必须转人工复核，不得形成正式资格结论。",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R008",
          "title": "P1 正式批准入伍/返校复核",
          "requirement": "原文核验项：P1 正式批准入伍/返校复核。执行摘要：R008 P1 正式批准入伍/返校复核 | **T** 县征兵办已正式批准入伍：交叉比《入伍通知书》、表 I 征兵办认证与原学段，后续由原校复核；**F** P0 未批准（**本阶段不适用**）；**U** 自述已入伍但权威批准材料未回 | SRC-005 附 7 第 8 条第（三）至（五）项、SRC-001/002；F017–F020 F039–F041；M001 M008 M009 M019 | 机关证据一致 PASS_FACT；正式批准后通知书缺 NEEDS_MATERIAL，有权机构不可达 SOURCE_UNAVAILABLE，编号冲突 CONFLICT；县征兵办+原高校资助中心，各阶段分别签。政策/权限/期限未知或冲突时必须转人工复核，不得形成正式资格结论。",
          "execution": "manual",
          "targetScope": "case"
        }
      ]
    },
    {
      "id": "rules-08-3",
      "name": "财务、贷款、资助金额与历史（R009–R017）",
      "order": 1,
      "required": true,
      "criteria": [
        {
          "id": "R009",
          "title": "P0 贷款存在及合同归属",
          "requirement": "原文核验项：P0 贷款存在及合同归属。执行摘要：R009 P0 贷款存在及合同归属 | **T** 表 I 申报代偿或补偿人曾获国家助学贷款：核银行/生源地借款主体、合同、类别及相关学年；**F** 有权记录证实本学段无贷款；**U** 只有学生声明或查询失联 | SRC-005 第 8 条、SRC-004/016；F002 F006 F029 F030；M003 M010 M011 | 合同真实归属 PASS_FACT；合同与人/学段不符 CONFLICT；贷款合同本人的必需副本缺 NEEDS_MATERIAL，权威银行数据不可得 SOURCE_UNAVAILABLE；银行/县级资助机构核。政策/权限/期限未知或冲突时必须转人工复核，不得形成正式资格结论。",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R010",
          "title": "P0/P2 贷款学费用途及本息",
          "requirement": "原文核验项：P0/P2 贷款学费用途及本息。执行摘要：R010 P0/P2 贷款学费用途及本息 | **T** R009 有贷款：从银行可证贷款本金拆出**实际用于学费**数额及利息/余额，逐学年与学费账比较；**F** 无贷款；**U** 总贷款额但用途不明或银行记录不可达 | SRC-005 第 5/8/10 条、SRC-004/016；F025 F029–F033；M006 M010 M011 M013 | 逐合同用途一致 PASS_FACT；生活费/住宿费不得代入学费；账户/学年冲突 CONFLICT；银行无法确认 SOURCE_UNAVAILABLE，利率/区间不明 NEEDS_HUMAN_DECISION；财务+银行。政策/权限/期限未知或冲突时必须转人工复核，不得形成正式资格结论。",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R011",
          "title": "P0 本人贷款偿还计划",
          "requirement": "原文核验项：P0 本人贷款偿还计划。执行摘要：R011 P0 本人贷款偿还计划 | **T** 在校期间确有国家助学贷款：核本人签署计划书、贷款合同与对应账户；**F** 已有权确认无贷款；**U** 是否有贷款未核 | SRC-005 附 7 第 8 条第（一）项；F029 F030 F034；M010 M012 | 有签署且归属一致 PASS_FACT；当前应有却缺 NEEDS_MATERIAL、无法认签 NEEDS_HUMAN_DECISION；未批准入伍不妨碍先附本人计划；申请人及校资助中心。政策/权限/期限未知或冲突时必须转人工复核，不得形成正式资格结论。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R012",
          "title": "P0/Q0/Q1 学费事实",
          "requirement": "原文核验项：P0/Q0/Q1 学费事实。执行摘要：R012 P0/Q0/Q1 学费事实 | **T** 本学段特定费用年度有申请：核正式收费标准、应收/实缴/退款及未来减免年度区分；**F** 不涉及此年度；**U** 财务账缺失/学费尚未发生 | SRC-005 附 7 第 8/9 条、SRC-004/016；F025–F028 F037；M006 M007 M021 | 财务事实核对 PASS_FACT；本人收据与账冲突 CONFLICT；源不通 SOURCE_UNAVAILABLE，未来年尚无付款则 NOT_APPLICABLE 于执行子项；校财务，不从通知上限反推应缴。政策/权限/期限未知或冲突时必须转人工复核，不得形成正式资格结论。",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R013",
          "title": "P0/Q0 申报金额与法定计量对象",
          "requirement": "原文核验项：P0/Q0 申报金额与法定计量对象。执行摘要：R013 P0/Q0 申报金额与法定计量对象 | **T** 申报数值已填：分别核补偿/代偿在校学费与用于学费贷款的较高者、退役减免按实际收取学费；**F** 纯咨询未填金额；**U** 学费/贷款两类原始证据未齐或政策口径不明 | SRC-004/005/016 与摘要差异 SRC-001/002；F014 F025–F027 F031 F032 F035 F037；M001 M002 M006 M011 | 事实量纲/年度一致 PASS_FACT，不是批准金额；填报额冲突 CONFLICT；校本适用口径未核 POLICY_UNCONFIRMED，不得直接计算可拨付金额；资助中心与财务。政策/权限/期限未知或冲突时必须转人工复核，不得形成正式资格结论。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R014",
          "title": "P2 补偿款优先偿还国家助学贷款",
          "requirement": "原文核验项：P2 补偿款优先偿还国家助学贷款。执行摘要：R014 P2 补偿款优先偿还国家助学贷款 | **T** 已获补偿且有在校期贷款：核经办机构的款项优先归还与余额去向；**F** 无此贷款；**U** 校财务/银行执行证据尚未产生 | SRC-005 附 7 第 5/8 条；F014 F029 F033 F043；M010 M011 M013 M021 | 执行账支持 PASS_FACT；尚未执行不因无凭证要求学生补材料，应为办理待办；执行与账户不符 CONFLICT；学校财务/银行不能由 AI 发起转账。政策/权限/期限未知或冲突时必须转人工复核，不得形成正式资格结论。",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R015",
          "title": "P2 贷款不足/往届偿还",
          "requirement": "原文核验项：P2 贷款不足/往届偿还。执行摘要：R015 P2 贷款不足/往届偿还 | **T** 代偿数不足还清或往届毕业生已有还款：核剩余贷款重签计划、既往本人按协议还款及银行本息凭证；**F** 既非往届又无余额差额；**U** 还款流水或结清状态不明 | SRC-005 附 7 第 10/11 条；F030 F032 F033 F043；M010 M011 M012 M013 M021 | 经银行对账的余额 PASS_FACT；本息/付款人冲突 CONFLICT；已还款回执未交 NEEDS_MATERIAL、银行取不到 SOURCE_UNAVAILABLE；银行与校资助/财务核，不能自动豁免剩余本金。政策/权限/期限未知或冲突时必须转人工复核，不得形成正式资格结论。",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R016",
          "title": "C07/Q1 跨期金额上限",
          "requirement": "原文核验项：C07/Q1 跨期金额上限。执行摘要：R016 C07/Q1 跨期金额上限 | **T** 存在 2023、2024 或更早/更新收费年度、入伍时间与跨学段：逐笔选择应适用的有效上位标准及校本公布配置，核年限与费用；**F** 无跨期且有权当期口径确认；**U** 生效基准或历史校本调整尚不明 | SRC-005/006/007/015/016；F005 F006 F009–F012 F018 F025 F026 F035 F037 F038；M005 M006 M018 | 有时间效力配置才对相应年度 PASS_FACT；未确认 POLICY_UNCONFIRMED；不得以 2024 秋后本专科 2 万/研究生 2.5 万上限回算所有更早期间；校资助中心政策管理员。政策/权限/期限未知或冲突时必须转人工复核，不得形成正式资格结论。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R017",
          "title": "P0/Q0/C07 免学费/既受助核重",
          "requirement": "原文核验项：P0/Q0/C07 免学费/既受助核重。执行摘要：R017 P0/Q0/C07 免学费/既受助核重 | **T** 存在同学段同年度完全免学费或本项已补偿/代偿/减免：用正式生效决定和账簿核项目、期间、金额；**F** 权威记录证实不重叠；**U** 跨校历史查不到 | SRC-005 附 7 第 4/7/9 条、SRC-004/016；F006 F025 F028 F036；M007 M017 M020 M021 | 同一笔重复/全免的排除候选 NEEDS_HUMAN_DECISION（不生成最终驳回）；部分减免≠全免，跨学段≠天然重复；权威冲突 CONFLICT、跨校失联 SOURCE_UNAVAILABLE；校资助中心+财务。政策/权限/期限未知或冲突时必须转人工复核，不得形成正式资格结论。",
          "execution": "manual",
          "targetScope": "case"
        }
      ]
    },
    {
      "id": "rules-08-4",
      "name": "退役、学校签批、执行与后续动作（R018–R028）",
      "order": 2,
      "required": true,
      "criteria": [
        {
          "id": "R018",
          "title": "Q0 退役事实",
          "requirement": "原文核验项：Q0 退役事实。执行摘要：R018 Q0 退役事实 | **T** 已退役并申请表 II：比退役证书、服役期间及表 II 有权机关认证；**F** 尚服役/仅 P0 P1；**U** 文件未取得、退役性质不明 | SRC-005 附 7 第 9/16 条；F017 F021–F023；M002 M014 M015 | 权威确认日期匹配 PASS_FACT，证与机关意见冲突 CONFLICT，当前证缺 NEEDS_MATERIAL，机关不可达 SOURCE_UNAVAILABLE；退役机关和校资助中心，不以退役证等于自主就业。政策/权限/期限未知或冲突时必须转人工复核，不得形成正式资格结论。",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R019",
          "title": "C04 Q0 已在校退役复学",
          "requirement": "原文核验项：C04 Q0 已在校退役复学。执行摘要：R019 C04 Q0 已在校退役复学 | **T** 入伍前在校保留学籍且退役后校方批准复学：核 S01 有权结果/有效日期及学生所选“退役复学”；**F** 新考入/保留入学资格后首入；**U** 学籍批准待核 | SRC-005 第 3/7/9 条、SRC-001/003；F004 F008 F012 F024；M002 M004 M005 M014 M017 | 学籍/表 II 对应 PASS_FACT；复学未生效待 NEEDS_HUMAN_DECISION 或权威源失联 SOURCE_UNAVAILABLE；学籍主管/学院，不能由本模板批准复学。政策/权限/期限未知或冲突时必须转人工复核，不得形成正式资格结论。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R020",
          "title": "C05 Q0 保留入学资格后回校入学",
          "requirement": "原文核验项：C05 Q0 保留入学资格后回校入学。执行摘要：R020 C05 Q0 保留入学资格后回校入学 | **T** 入伍前已录取未报到、服役期间保留入学资格、退役后学校确认恢复及报到；**F** 先前已在校、或退役后重新考入；**U** 录取及恢复资格链缺 | SRC-005 第 3/7/9 条；F004 F008 F010 F024；M002 M004 M014 M016 | 录取/保留/报到三事件均对应 PASS_FACT；不可把此分支强制写作自主就业“退役入学”认证；冲突 CONFLICT、主管记录失联 SOURCE_UNAVAILABLE；招生/学籍部门。政策/权限/期限未知或冲突时必须转人工复核，不得形成正式资格结论。",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R021",
          "title": "C06 Q0 退役自主就业新考入",
          "requirement": "原文核验项：C06 Q0 退役自主就业新考入。执行摘要：R021 C06 Q0 退役自主就业新考入 | **T** 退役后依适用招生路径新考入并报到：核正式录取及退役军人事务部门自主就业认证；**F** 退役复学/恢复旧入学资格；**U** 自主就业/招生类型无法权威确认 | SRC-005 附 7 第 3/9/16 条及表 II；F004 F008 F023 F024；M002 M014 M015 M016 M017 | 两类主管意见有效 PASS_FACT；个人自述不够，机关待签则 NEEDS_HUMAN_DECISION，来源失联 SOURCE_UNAVAILABLE，相互否定 CONFLICT；招生/退役军人事务部门，不以表 II 未到签章阶段判学生缺件。政策/权限/期限未知或冲突时必须转人工复核，不得形成正式资格结论。",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R022",
          "title": "P0/P1/Q0 学校审核人真权",
          "requirement": "原文核验项：P0/P1/Q0 学校审核人真权。执行摘要：R022 P0/P1/Q0 学校审核人真权 | **T** 流程到财务、学院、学校资助意见节点：验证签字/电子审批确为该节点被授权人员，权限在审批时有效；**F** 未到此节点；**U** 未获得可信身份或校本岗位委任 | SRC-005 附表 I/II及第 8/9 条、SRC-003/014；F039–F041 F044；M019 M024 M025 | 真签署且对应授权 PASS_FACT；Renderer actorId/章图片不能代替可信权限，缺真实授权 NEEDS_HUMAN_DECISION，伪签 CONFLICT；校资助中心/身份权限 Owner，**此规则不能给前端审批能力**。政策/权限/期限未知或冲突时必须转人工复核，不得形成正式资格结论。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R023",
          "title": "P2/Q1/X1 正式有效资助决定",
          "requirement": "原文核验项：P2/Q1/X1 正式有效资助决定。执行摘要：R023 P2/Q1/X1 正式有效资助决定 | **T** 有权机构声称已完成核定：核 M020 决定编号、签署权限、生效期间与是否被后续变更；**F** 尚在事实预审；**U** 学校决定状态无权威返回 | SRC-005 第 8/9/13–16 条、SRC-003；F040–F042 F044；M019 M020 M024 | 有权决定存在 PASS_FACT **仅证明决定文书存在**，不代表本模板同意其结论；无权限 NEEDS_HUMAN_DECISION，决定冲突 CONFLICT；学校有权审核人/资助中心核，禁止系统自行发行 decisionRef。政策/权限/期限未知或冲突时必须转人工复核，不得形成正式资格结论。",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R024",
          "title": "P2/Q1 实际拨付/减免",
          "requirement": "原文核验项：P2/Q1 实际拨付/减免。执行摘要：R024 P2/Q1 实际拨付/减免 | **T** 已有有效办理决定且资金实际执行：把代偿转账、结清/余额、逐学年减免与财务/银行账联结；**F** 决定尚未执行；**U** 账簿未可用或跨年关联缺 | SRC-005 第 5/8/9/10/11 条；F025 F033 F036 F037 F042 F043；M013 M020 M021 | 有权账证 PASS_FACT；审批同意但未付款只记执行待办，不标 已到账；账与决定不符 CONFLICT、银行失联 SOURCE_UNAVAILABLE；学校财务/银行。政策/权限/期限未知或冲突时必须转人工复核，不得形成正式资格结论。",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R025",
          "title": "所有阶段材料版本有效性",
          "requirement": "原文核验项：所有阶段材料版本有效性。执行摘要：R025 所有阶段材料版本有效性 | **T** 任一 M 被补件替换、更正或权威机关更新：比较 issuer、subject、validForPeriod、签署日、sourceVersion 和受影响字段；**F** 无版本更新；**U** 旧新材料缺关联/来源失联 | SRC-005 证据目的、SRC-011 技术参考；F001 F006 F016 F029–F033 F038 F044 F045；M001 M002 M004 M011 M018 M024 | 只把依赖旧版本的 R 标 STALE_REVIEW_REQUIRED（内部失效标志**非八种主结果码**），按新源重算；失联 SOURCE_UNAVAILABLE，冲突 CONFLICT；原审核责任角色，历史决定 M020 不自动变更。政策/权限/期限未知或冲突时必须转人工复核，不得形成正式资格结论。",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R026",
          "title": "X0/X1 补件撤回复核",
          "requirement": "原文核验项：X0/X1 补件撤回复核。执行摘要：R026 X0/X1 补件撤回复核 | **T** 本人有效更正/撤回请求、重新申报或异议到达：核可信申请人、旧案/旧材料、请求及有权受理状态；**F** 无此事件；**U** 代理关系、期限或撤回生效未知 | SRC-001/002/003/013（政策时限仅历史）、SRC-005 通用程序；F015 F016 F041 F044 F045；M022 M024 M020 | 有有效请求只 PASS_FACT 确认**请求已发生**；是否允许撤回/复核 NEEDS_HUMAN_DECISION 或 POLICY_UNCONFIRMED；学生/学院提交，校资助中心有权受理，资金已执行不得一键撤销。政策/权限/期限未知或冲突时必须转人工复核，不得形成正式资格结论。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R027",
          "title": "C09 X1 退兵/特殊提前退役",
          "requirement": "原文核验项：C09 X1 退兵/特殊提前退役。执行摘要：R027 C09 X1 退兵/特殊提前退役 | **T** 有权机关报告退兵、除名、提前退役、资格异常：按实际性质映射 13–15 条，核原因、组织批准与机关分权；**F** 经权威确认正常退役、无异常；**U** 仅私人病历/平台标签或机关决定待出 | SRC-005 附 7 第 13–16 条；F017 F021 F023 F042 F046；M014 M020 M023 | 有权认定的异常事实 PASS_FACT，**仍不等于系统自行撤销/追缴**；未经组织确认 NEEDS_HUMAN_DECISION、来源失联 SOURCE_UNAVAILABLE、冲突 CONFLICT；征兵/教育主管部门和学校按第 14/15 条处理。政策/权限/期限未知或冲突时必须转人工复核，不得形成正式资格结论。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R028",
          "title": "C01–C09 跨模板权威结果复用",
          "requirement": "原文核验项：C01–C09 跨模板权威结果复用。执行摘要：R028 C01–C09 跨模板权威结果复用 | **T** 本案依赖 S01 复学/保留资格、S03-T08 贷款、S03-T11 其他减免、G50 读取/身份检测结果：核其 owner、已生效状态、证据版本与本案相同学生/学段/年度；**F** 本案无需该邻接事实；**U** 目录或邻模板真实结果未接通 | SRC-005 业务区分、SRC-011/012 仅目录线索；F003 F006 F008 F029 F036 F044；M003 M004 M010 M017 M020 M024 | 真正有权且有效结果可 PASS_FACT（仅复用对应事实），技术旧 run@rev 或假 Actor 不得冒充行政 Run；来源失联 SOURCE_UNAVAILABLE，目录边界未核 POLICY_UNCONFIRMED；原业务 Owner 与校资助中心。政策/权限/期限未知或冲突时必须转人工复核，不得形成正式资格结论。",
          "execution": "semantic",
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
  "templateId": "S03-T12",
  "name": "应征入伍服兵役学生学费补偿、贷款代偿与退役后学费减免审核",
  "version": "1.0",
  "sourceDocumentPath": "docs/design/review-agent/business-templates/R02/research-original/S03-T12.md",
  "reviewedDocumentPath": "docs/design/review-agent/business-templates/R02/S03-T12.md",
  "sourceGitBlobSha": "32c590981dd968a455f4f85ec253c08e6599e289",
  "sourceDocumentSha256": "76802e44b5302ab7aed38e8d7fbe11a956f983de06544d3047936e5f8e5a71f4",
  "sourceManifestBytes": 136300,
  "sourceManifestSha256": "d493381a83164a28793a26dd160ea57e5f2cf8db2d275f72eed097fb72c8d1a8",
  "officialSchoolTemplate": false,
  "researchDate": "2026-10-24",
  "policyEvidenceStatus": "PARTIAL",
  "workflowOwner": "local",
  "sourceEvidence": [
    {
      "sourceId": "SRC-001",
      "title": "成都理工大学学生资助管理中心：《关于开展2025-2026学年春季学期服兵役学生国家教育资助申请的通知》；<https://xsc.cdut.edu.cn/info/1025/4053.htm>",
      "evidenceStatus": "UNCONFIRMED",
      "url": "https://xsc.cdut.edu.cn/info/1025/4053.htm"
    },
    {
      "sourceId": "SRC-002",
      "title": "成都理工大学学生资助管理中心：《关于开展2025-2026学年服兵役学生国家教育资助申请的通知》；<https://xsc.cdut.edu.cn/info/1046/3585.htm>",
      "evidenceStatus": "PARTIAL",
      "url": "https://xsc.cdut.edu.cn/info/1046/3585.htm"
    },
    {
      "sourceId": "SRC-003",
      "title": "成都理工大学：《关于印发〈成都理工大学服兵役学生国家教育资助工作实施办法〉的通知》（成理校学〔2024〕8 号）；目前可定位官方政策列表 <https://xsc.cdut.edu.cn/zzgl/zzzc.htm>",
      "evidenceStatus": "UNCONFIRMED",
      "url": "https://xsc.cdut.edu.cn/zzgl/zzzc.htm"
    },
    {
      "sourceId": "SRC-004",
      "title": "成都理工大学学生处：《国家资助 助你飞翔——成都理工大学2025年本专科学生资助政策简介》；<https://xsc.cdut.edu.cn/info/1032/3429.htm>",
      "evidenceStatus": "PARTIAL",
      "url": "https://xsc.cdut.edu.cn/info/1032/3429.htm"
    },
    {
      "sourceId": "SRC-005",
      "title": "财政部等五部门：《关于印发〈学生资助资金管理办法〉的通知》（财教〔2021〕310 号）及附件 7《服兵役高等学校学生国家教育资助实施细则》；官方 <https://jkw.mof.gov.cn/zxzyzf/xszzbzjf/202202/t20220223_3789428.htm>；可查完整附件文本的政府转载 <h",
      "evidenceStatus": "PARTIAL",
      "url": "https://jkw.mof.gov.cn/zxzyzf/xszzbzjf/202202/t20220223_3789428.htm"
    },
    {
      "sourceId": "SRC-006",
      "title": "财政部、教育部、中国人民银行、金融监管总局：《关于调整完善国家助学贷款有关政策的通知》（财教〔2024〕188 号）；<https://www.moe.gov.cn/jyb_xxgk/moe_1777/moe_1779/202411/t20241104_1160686.html>",
      "evidenceStatus": "PARTIAL",
      "url": "https://www.moe.gov.cn/jyb_xxgk/moe_1777/moe_1779/202411/t20241104_1160686.html"
    },
    {
      "sourceId": "SRC-007",
      "title": "教育部等四部门：《关于调整完善助学贷款有关政策的通知》（教财〔2023〕4 号）；<https://hudong.moe.gov.cn/srcsite/A05/s7505/202309/t20230915_1080601.html>",
      "evidenceStatus": "PARTIAL",
      "url": "https://hudong.moe.gov.cn/srcsite/A05/s7505/202309/t20230915_1080601.html"
    },
    {
      "sourceId": "SRC-008",
      "title": "成都理工大学学生处：《成都理工大学学生服义务兵役国家资助工作实施办法》；<https://xsc.cdut.edu.cn/info/1032/1716.htm>",
      "evidenceStatus": "UNCONFIRMED",
      "url": "https://xsc.cdut.edu.cn/info/1032/1716.htm"
    },
    {
      "sourceId": "SRC-009",
      "title": "成都理工大学学生资助管理中心：《关于开展2024-2025学年服兵役学生国家教育资助申请的通知》；<https://xsc.cdut.edu.cn/info/1033/2356.htm>",
      "evidenceStatus": "PARTIAL",
      "url": "https://xsc.cdut.edu.cn/info/1033/2356.htm"
    },
    {
      "sourceId": "SRC-010",
      "title": "中国石油大学（华东）学生工作部门：《关于开展我校2026年度服兵役学生国家教育资助的通知》；<https://csun.upc.edu.cn/_t1756/2026/0911/c4439a499649/pagem.htm>",
      "evidenceStatus": "PARTIAL",
      "url": "https://csun.upc.edu.cn/_t1756/2026/0911/c4439a499649/pagem.htm"
    },
    {
      "sourceId": "SRC-011",
      "title": "技术仓库 Fuck-GH-Admin/cdut-studio-review-agent，固定 SHA 7b6cdc843d26e926c0c63b8c51a451ff3925cfad：docs/design/review-agent/acceptance/d4-unified-r01/catalog.json；<htt",
      "evidenceStatus": "PARTIAL",
      "url": "https://raw.githubusercontent.com/Fuck-GH-Admin/cdut-studio-review-agent/7b6cdc843d26e926c0c63b8c51a451ff3925cfad/docs/design/review-agent/acceptance/d4-unified-r01/catalog.json"
    },
    {
      "sourceId": "SRC-012",
      "title": "派单指定目录 ST-CANDIDATE-MASTER-CATALOG-R02.md、对照 ST-CATALOG-AUDIT-R02.md；**未提供实体路径/URL**，本地工作区 rg --files 未找到",
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sourceId": "SRC-013",
      "title": "2026-2027 学年秋季 CDUT 服兵役资助通知：实际检索路径为搜索 site:xsc.cdut.edu.cn \"2026-2027学年\" \"服兵役\"、site:cdut.edu.cn 2026 \"服兵役学生国家教育资助申请\"；参考学校入口 <https://xsc.cdut.edu.cn/zzgl/zzdt.h",
      "evidenceStatus": "UNCONFIRMED",
      "url": "https://xsc.cdut.edu.cn/zzgl/zzdt.htm"
    },
    {
      "sourceId": "SRC-014",
      "title": "SRC-001 页面所列附件：《大学生应征入伍服兵役国家教育资助申请审批流程.docx》；入口 <https://xsc.cdut.edu.cn/info/1025/4053.htm>；附件实际 URL/校内文件路径**未取得**",
      "evidenceStatus": "UNCONFIRMED",
      "url": "https://xsc.cdut.edu.cn/info/1025/4053.htm"
    },
    {
      "sourceId": "SRC-015",
      "title": "成都理工大学党委保卫部（保卫处、人民武装部）：《2026年上半年征兵，正在报名！》；<https://www.cdut.edu.cn/info/1064/22308.htm>",
      "evidenceStatus": "PARTIAL",
      "url": "https://www.cdut.edu.cn/info/1064/22308.htm"
    },
    {
      "sourceId": "SRC-016",
      "title": "成都理工大学署名、教育部学生服务与素质发展中心主办中国研究生招生信息网发布：《成都理工大学研究生资助政策简介》；<https://yz.chsi.com.cn/kyzx/yxzc/202507/20250710/2293394566.html>",
      "evidenceStatus": "PARTIAL",
      "url": "https://yz.chsi.com.cn/kyzx/yxzc/202507/20250710/2293394566.html"
    }
  ],
  "criteria": [
    {
      "sectionId": "rules-08-2",
      "criterionId": "R001",
      "sourceIds": [
        "SRC-005"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R002",
      "sourceIds": [
        "SRC-005",
        "SRC-004"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R003",
      "sourceIds": [
        "SRC-005"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R004",
      "sourceIds": [
        "SRC-005"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R005",
      "sourceIds": [
        "SRC-005",
        "SRC-001"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R006",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R007",
      "sourceIds": [
        "SRC-005",
        "SRC-003"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R008",
      "sourceIds": [
        "SRC-005",
        "SRC-001"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules-08-3",
      "criterionId": "R009",
      "sourceIds": [
        "SRC-005",
        "SRC-004"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rules-08-3",
      "criterionId": "R010",
      "sourceIds": [
        "SRC-005",
        "SRC-004"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rules-08-3",
      "criterionId": "R011",
      "sourceIds": [
        "SRC-005"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules-08-3",
      "criterionId": "R012",
      "sourceIds": [
        "SRC-005",
        "SRC-004"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rules-08-3",
      "criterionId": "R013",
      "sourceIds": [
        "SRC-004",
        "SRC-001"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules-08-3",
      "criterionId": "R014",
      "sourceIds": [
        "SRC-005"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rules-08-3",
      "criterionId": "R015",
      "sourceIds": [
        "SRC-005"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rules-08-3",
      "criterionId": "R016",
      "sourceIds": [
        "SRC-005"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules-08-3",
      "criterionId": "R017",
      "sourceIds": [
        "SRC-005",
        "SRC-004"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rules-08-4",
      "criterionId": "R018",
      "sourceIds": [
        "SRC-005"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rules-08-4",
      "criterionId": "R019",
      "sourceIds": [
        "SRC-005",
        "SRC-001"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules-08-4",
      "criterionId": "R020",
      "sourceIds": [
        "SRC-005"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rules-08-4",
      "criterionId": "R021",
      "sourceIds": [
        "SRC-005"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rules-08-4",
      "criterionId": "R022",
      "sourceIds": [
        "SRC-005",
        "SRC-003"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules-08-4",
      "criterionId": "R023",
      "sourceIds": [
        "SRC-005",
        "SRC-003"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules-08-4",
      "criterionId": "R024",
      "sourceIds": [
        "SRC-005"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rules-08-4",
      "criterionId": "R025",
      "sourceIds": [
        "SRC-005",
        "SRC-011"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rules-08-4",
      "criterionId": "R026",
      "sourceIds": [
        "SRC-001",
        "SRC-005"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules-08-4",
      "criterionId": "R027",
      "sourceIds": [
        "SRC-005"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rules-08-4",
      "criterionId": "R028",
      "sourceIds": [
        "SRC-005",
        "SRC-011"
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
export const templateVersion = S03T12
