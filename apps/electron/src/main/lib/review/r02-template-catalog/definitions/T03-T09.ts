import type { TemplateVersion } from '@profer/shared'

type R02EvidenceStatus = 'VERIFIED' | 'PARTIAL' | 'UNCONFIRMED'
type R02CriterionMetadata = { sectionId: string; criterionId: string; sourceRuleId: string; srcIds: string[]; evidenceStatus: R02EvidenceStatus; note: string }
type R02Metadata = { templateId: string; name: string; sourceDocumentPath: string; sourceOriginalPath: string; sourceDocumentSha256: string; sourceDocumentBytes: number; sourceBlobSha: string; sourceBranch: string; officialSchoolTemplate: false; researchStatus: string; sourcePolicyStatus: string; policyEvidenceStatus: R02EvidenceStatus; requiresPreUploadSecurityGate: true; secureIntakeEnforcedByTemplateVersion: false; requiredIntegrationGate: string; criteria: R02CriterionMetadata[] }

export const templateVersion: TemplateVersion = {
  "templateId": "T03-T09",
  "version": 1,
  "schemaVersion": 2,
  "name": "涉密科研项目的立项保密责任与定密程序审核",
  "description": "本地研究模板 · 非校方正式模板。用于涉密科研项目的立项保密责任与定密程序审核的事实与证据核对；政策证据状态为 PARTIAL，未经有权人员确认不得形成正式决定。",
  "catalogKind": "builtin",
  "sourceNote": "R02_RESEARCH_TEMPLATE_NONOFFICIAL: 本模板由研究原件 docs/design/review-agent/business-templates/R02/research-original/T03-T09.md 转换；非成都理工大学校方正式模板，不代表学校授权或正式政策。研究依据涉及国家秘密定密与涉密科研；国家法规可核验，但学校授权渠道、受控环境和校本完整程序尚未完成确认。此模块仅保留两个安全门禁状态字段和一个许可元数据槽，不用于涉密材料电子受理。 SRC 是研究来源索引，不是案卷材料 SourceRef。",
  "objectType": "project",
  "displayName": {
    "template": "涉密科研项目的立项保密责任与定密程序审核 · 本地研究核验"
  },
  "fields": [
    {
      "key": "f001",
      "label": "环境许可",
      "kind": "enum",
      "required": true,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段 F001；F001 环境许可 enum(DENIED,AUTHORIZED,UNKNOWN)；O01；所有真实办理之前；学校信息系统+保密合规责任机构正式许可；M001；L0/L1；未知/无许可直接停止数字化收件",
      "options": [
        {
          "value": "DENIED",
          "label": "DENIED"
        },
        {
          "value": "AUTHORIZED",
          "label": "AUTHORIZED"
        },
        {
          "value": "UNKNOWN",
          "label": "UNKNOWN"
        }
      ]
    },
    {
      "key": "f002",
      "label": "合法渠道",
      "kind": "enum",
      "required": true,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段 F002；F002 合法渠道 enum(SECURE_OFFLINE,APPROVED_SECURE,UNCONFIRMED)；O01；路由；M001 的允许渠道说明；L0；未知只给静态线下指引",
      "options": [
        {
          "value": "SECURE_OFFLINE",
          "label": "SECURE_OFFLINE"
        },
        {
          "value": "APPROVED_SECURE",
          "label": "APPROVED_SECURE"
        },
        {
          "value": "UNCONFIRMED",
          "label": "UNCONFIRMED"
        }
      ]
    }
  ],
  "materialSlots": [
    {
      "id": "m001",
      "name": "核实可接受信息、合法受理渠道",
      "purpose": "仅限非涉密许可/渠道状态元数据；不得附加涉密原件、密点、项目名称、人员名单或技术细节。来源说明：M001 核实可接受信息、合法受理渠道；学校保密工作办公室及信息系统权责部门；批准的系统分类/通道许可（研究拟核项，校本文件未获）；C：任何真实项目案卷收件前；替代为完全不建案的静态线下指引，不以用户承诺替代许可；F001,F002,F038；SRC-001,002,007,008；许可机关@有效版本/适用系统；缺或不明→禁止电子受理，不能称项目材料不齐；U/S→同样停用",
      "requiredElements": [
        "仅记录许可/渠道状态，不上传涉密原件",
        "授权机关与适用系统范围",
        "有效版本与确认时间"
      ],
      "acceptedKinds": [
        "text"
      ],
      "minCount": 0,
      "maxCount": 1,
      "requiredAt": "submission",
      "allowReuseAcrossSubjects": false
    }
  ],
  "sections": [
    {
      "id": "secure-intake",
      "name": "受控环境、身份与项目边界",
      "order": 0,
      "required": true,
      "criteria": [
        {
          "id": "r001",
          "title": "渠道与可留存范围",
          "requirement": "R001 渠道与可留存范围；P0；T=拟建立真实项目级记录；F=纯静态无项目指引（不执行）；U=渠道性质不明；SRC-001,002,007,008；F001,F002,F038；M001；对照 E1/E2 许可机关、许可系统、事项类别、字段披露范围、有效期与本次操作；普通网络不能以用户承诺替代许可；T 且范围有效才可在获准环境记 PASS_FACT（系统/保密主管）；无许可/不明直接拒绝数字化收件，不创建 R 结果。【涉密安全门禁】此本地模板不得接收、OCR、存储、转发或向模型发送涉密原件、密点、涉密项目名称、人员名单或技术细节。仅可在经批准的涉密环境中由有权人员核验非涉密状态/受控引用；渠道或权限未知时不得数字化收件，仅提供静态线下指引。 该项只生成事实核验提示/待确认事项，不代表学校正式通过、拒绝、验收或定密决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r002",
          "title": "发起人真实身份",
          "requirement": "R002 发起人真实身份；P1；T=真实受理；F=纯静态指引；U=申请主体不可定位；SRC-001,004,005,009；F005,F006,F034；M002；E2 人事/学籍/受控外部任命核唯一主体、类别、有效时点；同名不等人，学生/博士后类别不赋予定密权；核得本人→PASS_FACT（身份权责机构）；错配→CONFLICT；无法从权威源核验依异常选择器转身份主管。【涉密安全门禁】此本地模板不得接收、OCR、存储、转发或向模型发送涉密原件、密点、涉密项目名称、人员名单或技术细节。仅可在经批准的涉密环境中由有权人员核验非涉密状态/受控引用；渠道或权限未知时不得数字化收件，仅提供静态线下指引。 该项只生成事实核验提示/待确认事项，不代表学校正式通过、拒绝、验收或定密决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r003",
          "title": "代理权限",
          "requirement": "R003 代理权限；P1/P5/P6；T=实际代理提交/查看/撤回；F=本人亲办且身份已验；U=代理关系未明；SRC-008,009；F007,F008,F034；M002,M003；E1/E2 对比委托人、代理人、委托事项与动作、有效期；一般项目代理≠法定定密责任人；授权覆盖动作→PASS_FACT（受理方）；无权→NEEDS_HUMAN_DECISION，由原机构通知本人或合法代理办理。【涉密安全门禁】此本地模板不得接收、OCR、存储、转发或向模型发送涉密原件、密点、涉密项目名称、人员名单或技术细节。仅可在经批准的涉密环境中由有权人员核验非涉密状态/受控引用；渠道或权限未知时不得数字化收件，仅提供静态线下指引。 该项只生成事实核验提示/待确认事项，不代表学校正式通过、拒绝、验收或定密决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r004",
          "title": "项目类别和承担链",
          "requirement": "R004 项目类别和承担链；P1；T=A/B/C/I 需确定科研项目归属；F=D 的独立待定密事项且已确认无需项目归属；U=项目类型不明；SRC-001,003,010,017；F007,F009,F010,F012；M004；E1/E2 核计划/委托/校级类型、项目—课题—专题层级、校方牵头/参与身份与真实归口；合同保密字眼不证明国家秘密；归属一致→PASS_FACT（科研归口）；双源矛盾→CONFLICT（下达机关与校科研主管）。【涉密安全门禁】此本地模板不得接收、OCR、存储、转发或向模型发送涉密原件、密点、涉密项目名称、人员名单或技术细节。仅可在经批准的涉密环境中由有权人员核验非涉密状态/受控引用；渠道或权限未知时不得数字化收件，仅提供静态线下指引。 该项只生成事实核验提示/待确认事项，不代表学校正式通过、拒绝、验收或定密决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r005",
          "title": "项目业务阶段",
          "requirement": "R005 项目业务阶段；P1/P4/P7；T=主张已立项、未批或终止等项目状态；F=纯定密事项不涉项目决定；U=状态不知；SRC-001,003,017；F011,F012,F025；M004,M014；初申 E2 登记可核“拟申报”，实际立项/终止只有正式批复后查 E1 及生效日期；不能前置未来 M014；阶段属实→PASS_FACT（科研主管）；决定尚未产生→保持流程 PENDING，不报缺；声称已批却无权威源→异常选择器。【涉密安全门禁】此本地模板不得接收、OCR、存储、转发或向模型发送涉密原件、密点、涉密项目名称、人员名单或技术细节。仅可在经批准的涉密环境中由有权人员核验非涉密状态/受控引用；渠道或权限未知时不得数字化收件，仅提供静态线下指引。 该项只生成事实核验提示/待确认事项，不代表学校正式通过、拒绝、验收或定密决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r006",
          "title": "先行保密措施",
          "requirement": "R006 先行保密措施；P2；T=有权机构发现可能应保护事项；F=有权机构确认不存在该触发（不等于“可公开”）；U=性质待查；SRC-007,008,009,010；F013,F014；M005；E1/E2 仅核先行采取措施和合法提请的程序状态，不读取密点/研究内容、不猜密级；保护程序已核→PASS_FACT（保密经办）；措施未落实/实质未定→NEEDS_HUMAN_DECISION，有权机关先采取必要保护。【涉密安全门禁】此本地模板不得接收、OCR、存储、转发或向模型发送涉密原件、密点、涉密项目名称、人员名单或技术细节。仅可在经批准的涉密环境中由有权人员核验非涉密状态/受控引用；渠道或权限未知时不得数字化收件，仅提供静态线下指引。 该项只生成事实核验提示/待确认事项，不代表学校正式通过、拒绝、验收或定密决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r007",
          "title": "原始/派生/外部程序分流",
          "requirement": "R007 原始/派生/外部程序分流；P2/P3；T=已进入需辨国家秘密程序；F=权威确认属于普通保密合同等其他事项；U=法律路径不明；SRC-007,008,009,010,018；F013,F014,F030；M005,M006,M009；E1/E2 法定机关辨明 ORIGINAL/DERIVED/EXTERNAL；派生须有已定密根源，派生定密不要求本单位原始定密权，但仍须受控合法来源与派生程序；普通 NDA/关键词不作依据；路径可核→PASS_FACT（原定密机关/有权保密主管）；路径不明→NEEDS_HUMAN_DECISION。【涉密安全门禁】此本地模板不得接收、OCR、存储、转发或向模型发送涉密原件、密点、涉密项目名称、人员名单或技术细节。仅可在经批准的涉密环境中由有权人员核验非涉密状态/受控引用；渠道或权限未知时不得数字化收件，仅提供静态线下指引。 该项只生成事实核验提示/待确认事项，不代表学校正式通过、拒绝、验收或定密决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r008",
          "title": "外部原定密和知悉许可",
          "requirement": "R008 外部原定密和知悉许可；P2/P3；T=C 或 E/H/I 引用外部决定；F=有权确认纯本校原始事项且不引用外源；U=外源存在性不明；SRC-007–011；F014,F015,F016；M006；E1 原机关回核有效决定、学校承担单位及本次知悉范围、当期权限；外部截图/NDA 不够；原机关及许可均验真→PASS_FACT（原机关、校内保密经办）；无许可→NEEDS_HUMAN_DECISION 并禁止实际接触；失联→SOURCE_UNAVAILABLE。【涉密安全门禁】此本地模板不得接收、OCR、存储、转发或向模型发送涉密原件、密点、涉密项目名称、人员名单或技术细节。仅可在经批准的涉密环境中由有权人员核验非涉密状态/受控引用；渠道或权限未知时不得数字化收件，仅提供静态线下指引。 该项只生成事实核验提示/待确认事项，不代表学校正式通过、拒绝、验收或定密决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r009",
          "title": "书面定密授权范围与期限",
          "requirement": "R009 书面定密授权范围与期限；P3/P4；T=拟由受授权单位作原始定密/依法变更；F=有权原机关直接处理且学校不行使定密权；U=是否授权不明；SRC-007,008,009,010；F017,F029,F030；M007；E1 核授权机关、批准主体、事项范围、可确定密级、有效期是否覆盖拟签发日；学校教职工身份不等于授权；有效权限真实覆盖→PASS_FACT（授权机关）；无权/越权→NEEDS_HUMAN_DECISION，依法报有权机关；不明不得签发。【涉密安全门禁】此本地模板不得接收、OCR、存储、转发或向模型发送涉密原件、密点、涉密项目名称、人员名单或技术细节。仅可在经批准的涉密环境中由有权人员核验非涉密状态/受控引用；渠道或权限未知时不得数字化收件，仅提供静态线下指引。 该项只生成事实核验提示/待确认事项，不代表学校正式通过、拒绝、验收或定密决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r010",
          "title": "定密责任人身份及职责",
          "requirement": "R010 定密责任人身份及职责；P3/P4；T=本机构拟正式签批/变更（含派生）；F=仅合法转报外机关，不在本机构批准；U=签字人的法定/指定身份未明；SRC-002,008,009,018；F018,F034,F039；M002,M008,M022（派生）；E1/E2 真实负责人/指定名册、原始与派生各自法定责任角色、任命范围、有效期与签署者一致；不能把缺原始授权误作不得派生，也不能仅因可派生而免签批；人和权都已核→PASS_FACT（有权指定/任命机关）；身份错配→CONFLICT 或转 NEEDS_HUMAN_DECISION。【涉密安全门禁】此本地模板不得接收、OCR、存储、转发或向模型发送涉密原件、密点、涉密项目名称、人员名单或技术细节。仅可在经批准的涉密环境中由有权人员核验非涉密状态/受控引用；渠道或权限未知时不得数字化收件，仅提供静态线下指引。 该项只生成事实核验提示/待确认事项，不代表学校正式通过、拒绝、验收或定密决定。",
          "execution": "manual",
          "targetScope": "case"
        }
      ]
    },
    {
      "id": "authority-procedure",
      "name": "定密授权、责任链与有权决定",
      "order": 1,
      "required": true,
      "criteria": [
        {
          "id": "r011",
          "title": "承办拟定意见及送审",
          "requirement": "R011 承办拟定意见及送审；P3；T=进入原始/合法派生或变更拟议；F=仅只读外机关已发决定；U=是否开始正式程序不明；SRC-007–010,018；F019,F030,F039；M009,M022（派生）；E1/E2 查对应路径的承办意见、提交回执、程序适用依据及形成日；承办意见不是定密批复；未到送审节点不索未来 M013/M022 决定记录；已有合法签收→PASS_FACT（原受理机构）；当期应送而未送→NEEDS_MATERIAL（承办人）。【涉密安全门禁】此本地模板不得接收、OCR、存储、转发或向模型发送涉密原件、密点、涉密项目名称、人员名单或技术细节。仅可在经批准的涉密环境中由有权人员核验非涉密状态/受控引用；渠道或权限未知时不得数字化收件，仅提供静态线下指引。 该项只生成事实核验提示/待确认事项，不代表学校正式通过、拒绝、验收或定密决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r012",
          "title": "下达单位—承担单位责任书",
          "requirement": "R012 下达单位—承担单位责任书；P3；T=两方主体确定且到该层依法签署节点；F=有权确认节点未到/该结构不存在；U=实际签署时点不明；SRC-010,011；F010,F021；M004,M010；E1/E2 比真实下达/承担关系、双方签署与生效日；不得拿普通 NDA、诚信承诺书替代；不造“申请当天”阈值；已签且当期适用→PASS_FACT（双方责任主体）；应签而缺→NEEDS_MATERIAL；时序不明→POLICY_UNCONFIRMED（科研归口/保密办）。【涉密安全门禁】此本地模板不得接收、OCR、存储、转发或向模型发送涉密原件、密点、涉密项目名称、人员名单或技术细节。仅可在经批准的涉密环境中由有权人员核验非涉密状态/受控引用；渠道或权限未知时不得数字化收件，仅提供静态线下指引。 该项只生成事实核验提示/待确认事项，不代表学校正式通过、拒绝、验收或定密决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r013",
          "title": "承担单位—项目负责人责任书",
          "requirement": "R013 承担单位—项目负责人责任书；P3；T=负责人合法确定且到签署节点；F=负责人尚未确定且节点未到；U=负责人归属/时序不明；SRC-001,010；F007,F022；M004,M011；E1/E2 核承担方、PI 任命及双方责任书生效，负责人变更需新关系证据；不能以原 PI 旧签代现任；已签→PASS_FACT（承担单位/PI）；应签而缺→NEEDS_MATERIAL；时序不明→POLICY_UNCONFIRMED。【涉密安全门禁】此本地模板不得接收、OCR、存储、转发或向模型发送涉密原件、密点、涉密项目名称、人员名单或技术细节。仅可在经批准的涉密环境中由有权人员核验非涉密状态/受控引用；渠道或权限未知时不得数字化收件，仅提供静态线下指引。 该项只生成事实核验提示/待确认事项，不代表学校正式通过、拒绝、验收或定密决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r014",
          "title": "项目负责人—参研人员责任书",
          "requirement": "R014 项目负责人—参研人员责任书；P3/P5；T=某真实参研人已加入且达到签署节点；F=尚未加入且有权确认无需此时签署；U=人员及签署时点未明；SRC-005,010,011；F023,F024；M012；E2 对具体参研人和任务加入日核其与负责人双向有效责任书；涉密论文表≠项目责任书；新增一人只查该人；此人已签且关系有效→PASS_FACT（PI/保密经办）；当期应签缺件→NEEDS_MATERIAL；未来人员不报缺。【涉密安全门禁】此本地模板不得接收、OCR、存储、转发或向模型发送涉密原件、密点、涉密项目名称、人员名单或技术细节。仅可在经批准的涉密环境中由有权人员核验非涉密状态/受控引用；渠道或权限未知时不得数字化收件，仅提供静态线下指引。 该项只生成事实核验提示/待确认事项，不代表学校正式通过、拒绝、验收或定密决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r015",
          "title": "参研人员实际知悉/涉密上岗资格",
          "requirement": "R015 参研人员实际知悉/涉密上岗资格；P3/P5；T=人员拟真实接触该涉密任务；F=仅无秘密接触的一般研究活动且权威已辨；U=实际接触授权未知；SRC-005,007,010,011；F005,F016,F024；M002,M008,M012；E1/E2 核真实主体与定密原机关规定的知悉范围、本人现行涉密管理/许可，学生学段不赋资格；资格必须在实际接触之前核；所需许可真实有效→PASS_FACT（保密工作机构/原定密机关）；不具/未知→NEEDS_HUMAN_DECISION，禁止接触与在线查询秘密。【涉密安全门禁】此本地模板不得接收、OCR、存储、转发或向模型发送涉密原件、密点、涉密项目名称、人员名单或技术细节。仅可在经批准的涉密环境中由有权人员核验非涉密状态/受控引用；渠道或权限未知时不得数字化收件，仅提供静态线下指引。 该项只生成事实核验提示/待确认事项，不代表学校正式通过、拒绝、验收或定密决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r016",
          "title": "法定定密决定真实存在",
          "requirement": "R016 法定定密决定真实存在；P4/P7；T=声称已经正式原始或派生定密、或已到应查验决定阶段；F=仍在合法拟议/转报阶段且无人声称决定已产生；U=决定是否产生未知；SRC-007–010,018；F014,F017,F018,F019,F020,F029,F030,F039；M007,M008,M009,M013,M022（按分支）；E1 分支核：原始决定查 M007,M013 的权源与正式签发；派生决定查原始来源 M006、本单位派生责任人及书面记录 M022，不把原始授权 F017 当派生前置；不保存密点原文；相应有权决定存在且主体/版本对应→PASS_FACT（法定责任主体）；尚待决定只保留 PENDING；错签或来源冲突→NEEDS_HUMAN_DECISION/CONFLICT。【涉密安全门禁】此本地模板不得接收、OCR、存储、转发或向模型发送涉密原件、密点、涉密项目名称、人员名单或技术细节。仅可在经批准的涉密环境中由有权人员核验非涉密状态/受控引用；渠道或权限未知时不得数字化收件，仅提供静态线下指引。 该项只生成事实核验提示/待确认事项，不代表学校正式通过、拒绝、验收或定密决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r017",
          "title": "科研立项决定与定密分离",
          "requirement": "R017 科研立项决定与定密分离；P4/P7；T=声称获得科研立项批复、项目终止/撤销；F=尚在申报中且无已决主张；U=项目决定状态未知；SRC-001,003,017；F011,F020,F025；M004,M014,M013；E1 核实际项目下达/撤销机关和批复生效版，不用 M013 的定密状态补 M014；有项目批复不等于已定密；真实立项业务结论可核→PASS_FACT（科研立项 Owner）；未形成批复不报缺；误混两类决定→CONFLICT（科研主管/保密办分别澄清）。【涉密安全门禁】此本地模板不得接收、OCR、存储、转发或向模型发送涉密原件、密点、涉密项目名称、人员名单或技术细节。仅可在经批准的涉密环境中由有权人员核验非涉密状态/受控引用；渠道或权限未知时不得数字化收件，仅提供静态线下指引。 该项只生成事实核验提示/待确认事项，不代表学校正式通过、拒绝、验收或定密决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r018",
          "title": "定密变更触发与原决定归属",
          "requirement": "R018 定密变更触发与原决定归属；P5；T=E 中合法事项/知悉/期限/原始根源出现变更线索；F=不存在变化且有权确认不启动变更；U=是否变化未知；SRC-007–010；F020,F026,F031,F032,F033；M015,M013,M006；E1/E2 核原决定 Owner 和当前触发记录是否同一事项、变更发生时间及生效条件；T03-T05 的科研任务变更不是自动密级变更；触发可核→PASS_FACT（原定密机关/承办机构）；错案或无原机关对应→CONFLICT；实体改密→NEEDS_HUMAN_DECISION。【涉密安全门禁】此本地模板不得接收、OCR、存储、转发或向模型发送涉密原件、密点、涉密项目名称、人员名单或技术细节。仅可在经批准的涉密环境中由有权人员核验非涉密状态/受控引用；渠道或权限未知时不得数字化收件，仅提供静态线下指引。 该项只生成事实核验提示/待确认事项，不代表学校正式通过、拒绝、验收或定密决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r019",
          "title": "变更决定与现行效力",
          "requirement": "R019 变更决定与现行效力；P5/P7；T=声称变更、延长或解除的有权决定已形成；F=仅提交变更建议、未到决定阶段；U=决定是否形成未知；SRC-007–010；F020,F027,F031,F033；M013,M015,M018；E1 核原机关/有权上级新书面决定、变更范围、生效时间和旧版本承继；仅在依法允许渠道查；原已生效决定不得由模板宣布撤销；有权新决定可核→PASS_FACT（原/上级定密机关）；拟议中仍 PENDING；效力不明→NEEDS_HUMAN_DECISION，旧事实预审需失效重核。【涉密安全门禁】此本地模板不得接收、OCR、存储、转发或向模型发送涉密原件、密点、涉密项目名称、人员名单或技术细节。仅可在经批准的涉密环境中由有权人员核验非涉密状态/受控引用；渠道或权限未知时不得数字化收件，仅提供静态线下指引。 该项只生成事实核验提示/待确认事项，不代表学校正式通过、拒绝、验收或定密决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r020",
          "title": "撤回请求的真实状态",
          "requirement": "R020 撤回请求的真实状态；P6；T=G 提交撤回/中止请求；F=未提出该请求；U=是否已有撤回受理未知；SRC-007,009,017；F028,F036；M002,M003,M016；E1/E2 核原请求人或代理权限、受理机关、具体办理阶段和请求/答复时点；请求送达≠受理同意，撤回不自动解密；请求/受理状态符合来源→PASS_FACT（原受理单位）；可撤回范围不明→POLICY_UNCONFIRMED；无权撤回→NEEDS_HUMAN_DECISION。【涉密安全门禁】此本地模板不得接收、OCR、存储、转发或向模型发送涉密原件、密点、涉密项目名称、人员名单或技术细节。仅可在经批准的涉密环境中由有权人员核验非涉密状态/受控引用；渠道或权限未知时不得数字化收件，仅提供静态线下指引。 该项只生成事实核验提示/待确认事项，不代表学校正式通过、拒绝、验收或定密决定。",
          "execution": "manual",
          "targetScope": "case"
        }
      ]
    },
    {
      "id": "evidence-and-review",
      "name": "证据版本、异议、复核与政策适用",
      "order": 2,
      "required": true,
      "criteria": [
        {
          "id": "r021",
          "title": "法定定密异议受理资格与请求",
          "requirement": "R021 法定定密异议受理资格与请求；P6；T=H 已提出定密异议/权限争议；F=没有该异议、只是一般项目申诉；U=请求人法定资格或受理途径不明；SRC-008,009；F020,F027,F030；M002,M003,M013,M006,M017；E1/E2 查原决定是否存在、提出异议的有权机关/单位、送达原机关与受理状态；不能把自然人普通申诉直接套作法定机关异议；合法受理事实可核→PASS_FACT（原定密机关）；主体/管辖不明→NEEDS_HUMAN_DECISION，转有权保密机关，秘密保护不间断。【涉密安全门禁】此本地模板不得接收、OCR、存储、转发或向模型发送涉密原件、密点、涉密项目名称、人员名单或技术细节。仅可在经批准的涉密环境中由有权人员核验非涉密状态/受控引用；渠道或权限未知时不得数字化收件，仅提供静态线下指引。 该项只生成事实核验提示/待确认事项，不代表学校正式通过、拒绝、验收或定密决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r022",
          "title": "定密异议的有权复核结论",
          "requirement": "R022 定密异议的有权复核结论；P6/P7；T=对 H 已声称作出有权终局或阶段复核决定；F=异议仅在审查中；U=复核是否完成未知；SRC-008,009；F020,F027,F030,F031；M017,M018；E1 核原机关/依法有权保密行政管理部门的决定、当期生效版及受理事项范围；学校业务人员/AI不能代写复核结论；真正决定可核→PASS_FACT（原机关/有权复核机关）；未结只标 PENDING；跨机关错签→CONFLICT 或人工裁定。【涉密安全门禁】此本地模板不得接收、OCR、存储、转发或向模型发送涉密原件、密点、涉密项目名称、人员名单或技术细节。仅可在经批准的涉密环境中由有权人员核验非涉密状态/受控引用；渠道或权限未知时不得数字化收件，仅提供静态线下指引。 该项只生成事实核验提示/待确认事项，不代表学校正式通过、拒绝、验收或定密决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r023",
          "title": "补件、退回与再送审回执",
          "requirement": "R023 补件、退回与再送审回执；P5；T=F 中有真实补件通知或再送审；F=首次提交且未曾补件；U=通知/时限是否真实未知；SRC-001,009；F003,F004,F033,F036,F037；M019 + 通知所指原 M；E2 查同案同版缺口、签收日期和适用期限，只要求该节点已应有材料；不得设未证校内“3/5/7日”；当期补件/回执对应→PASS_FACT（原受理方）；缺具体当期材料→NEEDS_MATERIAL（真实持有人）；无校本限期→POLICY_UNCONFIRMED。【涉密安全门禁】此本地模板不得接收、OCR、存储、转发或向模型发送涉密原件、密点、涉密项目名称、人员名单或技术细节。仅可在经批准的涉密环境中由有权人员核验非涉密状态/受控引用；渠道或权限未知时不得数字化收件，仅提供静态线下指引。 该项只生成事实核验提示/待确认事项，不代表学校正式通过、拒绝、验收或定密决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r024",
          "title": "证据归属、当前版本和失效标记",
          "requirement": "R024 证据归属、当前版本和失效标记；P1–P7；T=有一项合法可查的 M 被首次引用或替换；F=静态无项目办理；U=材料的源版本/归属不明；SRC-001,005,007,009,016,018；F003,F031,F032,F033；M002–M022（逐槽按实际适用）；按原签发机关、事项主体、所属业务/案卷、版本和取证时点作 E1/E2 绑定；旧材料标事实预审失效，不改正式机关决定；不取秘密原文哈希；版本归属一致→PASS_FACT（证据源 Owner）；错案或双有效冲突→CONFLICT；新版本只定向重核依赖 R。【涉密安全门禁】此本地模板不得接收、OCR、存储、转发或向模型发送涉密原件、密点、涉密项目名称、人员名单或技术细节。仅可在经批准的涉密环境中由有权人员核验非涉密状态/受控引用；渠道或权限未知时不得数字化收件，仅提供静态线下指引。 该项只生成事实核验提示/待确认事项，不代表学校正式通过、拒绝、验收或定密决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r025",
          "title": "本次核验人可信身份及事实留痕",
          "requirement": "R025 本次核验人可信身份及事实留痕；P4/P7；T=准备出具核验记录/人工业务决定；F=尚无核验、仅静态指引；U=人员或授权未明；SRC-001,002,009；F003,F004,F034,F035；M002,M008,M020；E1/E2 核核验机构、操作人、当时权限、来源、核验时间和独立签发事实；M020 只能审核完成后生成，不能当发起材料；审核人与真实回执一致→PASS_FACT（实际核验机构）；前端 Actor/代签/无回执→NEEDS_HUMAN_DECISION，不写正式已批。【涉密安全门禁】此本地模板不得接收、OCR、存储、转发或向模型发送涉密原件、密点、涉密项目名称、人员名单或技术细节。仅可在经批准的涉密环境中由有权人员核验非涉密状态/受控引用；渠道或权限未知时不得数字化收件，仅提供静态线下指引。 该项只生成事实核验提示/待确认事项，不代表学校正式通过、拒绝、验收或定密决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r026",
          "title": "邻接 G50/S/T 已决结论复用",
          "requirement": "R026 邻接 G50/S/T 已决结论复用；P1/P5/P7；T=需要相邻业务的既有真实决定作为本事项前置事实；F=无相邻已决依赖；U=是否已有合法共享结果不明；SRC-004,005,016；F012,F031,F032,F035；M021；E1/E2 引用相邻唯一 Owner 的真实决定类型、时点、版本、合法可知悉范围；G50 已读但源 catalog 为未集成测试的技术候选，不能由存在 workspace 推断真实审批 Run；旧 run@rev 不冒充正式 Run；已验权威结论→PASS_FACT（原业务 Owner）；源不可达→SOURCE_UNAVAILABLE；跨目的替代→CONFLICT，不复判论文/伦理/采购。【涉密安全门禁】此本地模板不得接收、OCR、存储、转发或向模型发送涉密原件、密点、涉密项目名称、人员名单或技术细节。仅可在经批准的涉密环境中由有权人员核验非涉密状态/受控引用；渠道或权限未知时不得数字化收件，仅提供静态线下指引。 该项只生成事实核验提示/待确认事项，不代表学校正式通过、拒绝、验收或定密决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r027",
          "title": "法定/批次节点适用性",
          "requirement": "R027 法定/批次节点适用性；P1/P3/P5；T=某环节确有适用期限且需核时效；F=有权确认无本环节期限；U=校本或批次时限未知；SRC-001,008,009,010,017；F011,F029,F037；M004,M007,M019；分辨条例“不明确事项拟定后10工作日报送”、授权机关受理授权申请后的法定办结时限，与实际申请人/学校批次截止日；不可串作同一阈值；E1/E2 回执起算；期限类别及起算源可核→PASS_FACT（适用机关）；校本期限未证→POLICY_UNCONFIRMED，不自动认定迟交失格。【涉密安全门禁】此本地模板不得接收、OCR、存储、转发或向模型发送涉密原件、密点、涉密项目名称、人员名单或技术细节。仅可在经批准的涉密环境中由有权人员核验非涉密状态/受控引用；渠道或权限未知时不得数字化收件，仅提供静态线下指引。 该项只生成事实核验提示/待确认事项，不代表学校正式通过、拒绝、验收或定密决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r028",
          "title": "法规现行性与本校专门规则适用",
          "requirement": "R028 法规现行性与本校专门规则适用；P0/P2/P4；T=拟将某规范用于本次核验；F=该规范对经权威确认的事项不适用；U=政策修订/批次适用不清；SRC-001,005,007–010,012–015,017–019；F009,F014,F030；M004,M007,M009；比发布机关、实施/废止、时间适用及项目类型；SRC-015 为失效旧解读，SRC-019 仅有2025校本办法目录而未见正文，不能填审批顺序、时限和受理人；SRC-012/013 仅批次线索；E1/E2 现行校本参数由主管确认；当期适用有效条款已核→PASS_FACT（政策主管）；校本未证→POLICY_UNCONFIRMED，不得用外校/旧规补校规。【涉密安全门禁】此本地模板不得接收、OCR、存储、转发或向模型发送涉密原件、密点、涉密项目名称、人员名单或技术细节。仅可在经批准的涉密环境中由有权人员核验非涉密状态/受控引用；渠道或权限未知时不得数字化收件，仅提供静态线下指引。 该项只生成事实核验提示/待确认事项，不代表学校正式通过、拒绝、验收或定密决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r029",
          "title": "多承担单位实际主办/协办及责任归属",
          "requirement": "R029 多承担单位实际主办/协办及责任归属；P1/P3；T=I 中项目有多单位/多批次共同参与并需识别主办、协办；F=有权确认单一承担单位且无联合事项；U=联合任务链未知；SRC-009,010,011；F007,F010,F021,F022,F023；M004,M006,M010,M011,M012；E1/E2 核任务下达的牵头/协作地位、各签署人职责和共同产生事项的有权定密机关，不能以“谁上传谁决定”；后加入人员仅查该新增关系；主办协办职责来源一致→PASS_FACT（项目下达机关/各承担单位）；冲突→CONFLICT 并请主办及原定密机关，密级仍只由有权者决定。【涉密安全门禁】此本地模板不得接收、OCR、存储、转发或向模型发送涉密原件、密点、涉密项目名称、人员名单或技术细节。仅可在经批准的涉密环境中由有权人员核验非涉密状态/受控引用；渠道或权限未知时不得数字化收件，仅提供静态线下指引。 该项只生成事实核验提示/待确认事项，不代表学校正式通过、拒绝、验收或定密决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r030",
          "title": "派生定密合法来源与书面程序",
          "requirement": "R030 派生定密合法来源与书面程序；P2/P3/P4/P5；T=本单位执行/办理已定密事项且确实产生须派生定密的事项；F=有权确认不存在派生事实（纯引用现有秘密或另属原始事项）；U=根源及是否派生不明确；SRC-007–010,018；F014,F015,F016,F019,F020,F031,F032,F039；M006,M008,M022；E1/E2 逐目标对照原定密机关在许可范围内提供的受控有效来源、受理单位派生定密责任人、当阶段承办意见；决定形成后才查 M022 正式书面记录及是否与根源版本相符。不能以没有 F017 原始权直接拒绝合法派生，亦不允许推断密点；来源+适格责任人+到期应有记录均可核→PASS_FACT（本单位派生定密责任人/原定密机关各自核）；源失联→SOURCE_UNAVAILABLE；两权威版本冲突→CONFLICT；实体是否派生/更改→NEEDS_HUMAN_DECISION。【涉密安全门禁】此本地模板不得接收、OCR、存储、转发或向模型发送涉密原件、密点、涉密项目名称、人员名单或技术细节。仅可在经批准的涉密环境中由有权人员核验非涉密状态/受控引用；渠道或权限未知时不得数字化收件，仅提供静态线下指引。 该项只生成事实核验提示/待确认事项，不代表学校正式通过、拒绝、验收或定密决定。",
          "execution": "manual",
          "targetScope": "case"
        }
      ]
    }
  ],
  "policyVersionIds": [],
  "stages": [
    {
      "id": "secure-intake-gate",
      "name": "获准环境与合法渠道门禁（未确认仅静态线下指引）",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "fact-review",
      "workflowOwner": "local"
    },
    {
      "id": "fact-review",
      "name": "非涉密状态元数据事实核验",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "enterWhen": {
        "all": [
          {
            "field": "f001",
            "op": "eq",
            "value": "AUTHORIZED"
          },
          {
            "field": "f002",
            "op": "eq",
            "value": "APPROVED_SECURE"
          }
        ]
      },
      "returnToStageId": "secure-intake-gate",
      "nextStageId": "authorized-review",
      "workflowOwner": "local"
    },
    {
      "id": "authorized-review",
      "name": "有权人员人工复核（不代表本地模板授予定密权）",
      "kind": "manual-review",
      "executorRole": "teacher",
      "enterWhen": {
        "all": [
          {
            "field": "f001",
            "op": "eq",
            "value": "AUTHORIZED"
          },
          {
            "field": "f002",
            "op": "eq",
            "value": "APPROVED_SECURE"
          }
        ]
      },
      "returnToStageId": "fact-review",
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
      "id": "follow-up-tasks",
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

export const r02Metadata: R02Metadata = {
  "templateId": "T03-T09",
  "name": "涉密科研项目的立项保密责任与定密程序审核",
  "sourceDocumentPath": "docs/design/review-agent/business-templates/R02/T03-T09.md",
  "sourceOriginalPath": "docs/design/review-agent/business-templates/R02/research-original/T03-T09.md",
  "sourceDocumentSha256": "1c1c7949ee8018bac315f2e38d9ce6c82a9e0f1072f536e07102ad4df270cd70",
  "sourceDocumentBytes": 145471,
  "sourceBlobSha": "bed8d1f3450d4c212ed10a24cd8aa2894447ab94",
  "sourceBranch": "feat/v3-r02-template-library@150acfe761cb7ad0424a2ca009fd57f12dbfddfd",
  "officialSchoolTemplate": false,
  "researchStatus": "RESEARCH_HANDOFF_READY",
  "sourcePolicyStatus": "\"PARTIALLY_VERIFIED; 已核校本专项办法和校方政策目录中的通用涉密科研办法标题，后者正文与实际定密授权未获；普通联网系统禁收涉密内容\"",
  "policyEvidenceStatus": "PARTIAL",
  "requiresPreUploadSecurityGate": true,
  "secureIntakeEnforcedByTemplateVersion": false,
  "requiredIntegrationGate": "共享 Main/文件导入路径必须在文件选择、落盘、OCR/解析及模型调用前核验保密属性与获准环境；未知/拒绝时不得数字化受理。该门禁属于集成 Owner 所有权，不在本批文件内。",
  "criteria": [
    {
      "sectionId": "secure-intake",
      "criterionId": "r001",
      "sourceRuleId": "R001",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-007",
        "SRC-008"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "note": "SRC 为研究来源索引，不是案卷材料 SourceRef；来源状态不等于学校授权或政策确认。"
    },
    {
      "sectionId": "secure-intake",
      "criterionId": "r002",
      "sourceRuleId": "R002",
      "srcIds": [
        "SRC-001",
        "SRC-004",
        "SRC-005",
        "SRC-009"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "note": "SRC 为研究来源索引，不是案卷材料 SourceRef；来源状态不等于学校授权或政策确认。"
    },
    {
      "sectionId": "secure-intake",
      "criterionId": "r003",
      "sourceRuleId": "R003",
      "srcIds": [
        "SRC-008",
        "SRC-009"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "note": "SRC 为研究来源索引，不是案卷材料 SourceRef；来源状态不等于学校授权或政策确认。"
    },
    {
      "sectionId": "secure-intake",
      "criterionId": "r004",
      "sourceRuleId": "R004",
      "srcIds": [
        "SRC-001",
        "SRC-003",
        "SRC-010",
        "SRC-017"
      ],
      "evidenceStatus": "PARTIAL",
      "note": "SRC 为研究来源索引，不是案卷材料 SourceRef；来源状态不等于学校授权或政策确认。"
    },
    {
      "sectionId": "secure-intake",
      "criterionId": "r005",
      "sourceRuleId": "R005",
      "srcIds": [
        "SRC-001",
        "SRC-003",
        "SRC-017"
      ],
      "evidenceStatus": "VERIFIED",
      "note": "SRC 为研究来源索引，不是案卷材料 SourceRef；来源状态不等于学校授权或政策确认。"
    },
    {
      "sectionId": "secure-intake",
      "criterionId": "r006",
      "sourceRuleId": "R006",
      "srcIds": [
        "SRC-007",
        "SRC-008",
        "SRC-009",
        "SRC-010"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "note": "SRC 为研究来源索引，不是案卷材料 SourceRef；来源状态不等于学校授权或政策确认。"
    },
    {
      "sectionId": "secure-intake",
      "criterionId": "r007",
      "sourceRuleId": "R007",
      "srcIds": [
        "SRC-007",
        "SRC-008",
        "SRC-009",
        "SRC-010",
        "SRC-018"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "note": "SRC 为研究来源索引，不是案卷材料 SourceRef；来源状态不等于学校授权或政策确认。"
    },
    {
      "sectionId": "secure-intake",
      "criterionId": "r008",
      "sourceRuleId": "R008",
      "srcIds": [
        "SRC-007",
        "SRC-008",
        "SRC-009",
        "SRC-010",
        "SRC-011"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "note": "SRC 为研究来源索引，不是案卷材料 SourceRef；来源状态不等于学校授权或政策确认。"
    },
    {
      "sectionId": "secure-intake",
      "criterionId": "r009",
      "sourceRuleId": "R009",
      "srcIds": [
        "SRC-007",
        "SRC-008",
        "SRC-009",
        "SRC-010"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "note": "SRC 为研究来源索引，不是案卷材料 SourceRef；来源状态不等于学校授权或政策确认。"
    },
    {
      "sectionId": "secure-intake",
      "criterionId": "r010",
      "sourceRuleId": "R010",
      "srcIds": [
        "SRC-002",
        "SRC-008",
        "SRC-009",
        "SRC-018"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "note": "SRC 为研究来源索引，不是案卷材料 SourceRef；来源状态不等于学校授权或政策确认。"
    },
    {
      "sectionId": "authority-procedure",
      "criterionId": "r011",
      "sourceRuleId": "R011",
      "srcIds": [
        "SRC-007",
        "SRC-008",
        "SRC-009",
        "SRC-010"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "note": "SRC 为研究来源索引，不是案卷材料 SourceRef；来源状态不等于学校授权或政策确认。"
    },
    {
      "sectionId": "authority-procedure",
      "criterionId": "r012",
      "sourceRuleId": "R012",
      "srcIds": [
        "SRC-010",
        "SRC-011"
      ],
      "evidenceStatus": "PARTIAL",
      "note": "SRC 为研究来源索引，不是案卷材料 SourceRef；来源状态不等于学校授权或政策确认。"
    },
    {
      "sectionId": "authority-procedure",
      "criterionId": "r013",
      "sourceRuleId": "R013",
      "srcIds": [
        "SRC-001",
        "SRC-010"
      ],
      "evidenceStatus": "PARTIAL",
      "note": "SRC 为研究来源索引，不是案卷材料 SourceRef；来源状态不等于学校授权或政策确认。"
    },
    {
      "sectionId": "authority-procedure",
      "criterionId": "r014",
      "sourceRuleId": "R014",
      "srcIds": [
        "SRC-005",
        "SRC-010",
        "SRC-011"
      ],
      "evidenceStatus": "PARTIAL",
      "note": "SRC 为研究来源索引，不是案卷材料 SourceRef；来源状态不等于学校授权或政策确认。"
    },
    {
      "sectionId": "authority-procedure",
      "criterionId": "r015",
      "sourceRuleId": "R015",
      "srcIds": [
        "SRC-005",
        "SRC-007",
        "SRC-010",
        "SRC-011"
      ],
      "evidenceStatus": "PARTIAL",
      "note": "SRC 为研究来源索引，不是案卷材料 SourceRef；来源状态不等于学校授权或政策确认。"
    },
    {
      "sectionId": "authority-procedure",
      "criterionId": "r016",
      "sourceRuleId": "R016",
      "srcIds": [
        "SRC-007",
        "SRC-008",
        "SRC-009",
        "SRC-010"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "note": "SRC 为研究来源索引，不是案卷材料 SourceRef；来源状态不等于学校授权或政策确认。"
    },
    {
      "sectionId": "authority-procedure",
      "criterionId": "r017",
      "sourceRuleId": "R017",
      "srcIds": [
        "SRC-001",
        "SRC-003",
        "SRC-017"
      ],
      "evidenceStatus": "VERIFIED",
      "note": "SRC 为研究来源索引，不是案卷材料 SourceRef；来源状态不等于学校授权或政策确认。"
    },
    {
      "sectionId": "authority-procedure",
      "criterionId": "r018",
      "sourceRuleId": "R018",
      "srcIds": [
        "SRC-007",
        "SRC-008",
        "SRC-009",
        "SRC-010"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "note": "SRC 为研究来源索引，不是案卷材料 SourceRef；来源状态不等于学校授权或政策确认。"
    },
    {
      "sectionId": "authority-procedure",
      "criterionId": "r019",
      "sourceRuleId": "R019",
      "srcIds": [
        "SRC-007",
        "SRC-008",
        "SRC-009",
        "SRC-010"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "note": "SRC 为研究来源索引，不是案卷材料 SourceRef；来源状态不等于学校授权或政策确认。"
    },
    {
      "sectionId": "authority-procedure",
      "criterionId": "r020",
      "sourceRuleId": "R020",
      "srcIds": [
        "SRC-007",
        "SRC-009",
        "SRC-017"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "note": "SRC 为研究来源索引，不是案卷材料 SourceRef；来源状态不等于学校授权或政策确认。"
    },
    {
      "sectionId": "evidence-and-review",
      "criterionId": "r021",
      "sourceRuleId": "R021",
      "srcIds": [
        "SRC-008",
        "SRC-009"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "note": "SRC 为研究来源索引，不是案卷材料 SourceRef；来源状态不等于学校授权或政策确认。"
    },
    {
      "sectionId": "evidence-and-review",
      "criterionId": "r022",
      "sourceRuleId": "R022",
      "srcIds": [
        "SRC-008",
        "SRC-009"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "note": "SRC 为研究来源索引，不是案卷材料 SourceRef；来源状态不等于学校授权或政策确认。"
    },
    {
      "sectionId": "evidence-and-review",
      "criterionId": "r023",
      "sourceRuleId": "R023",
      "srcIds": [
        "SRC-001",
        "SRC-009"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "note": "SRC 为研究来源索引，不是案卷材料 SourceRef；来源状态不等于学校授权或政策确认。"
    },
    {
      "sectionId": "evidence-and-review",
      "criterionId": "r024",
      "sourceRuleId": "R024",
      "srcIds": [
        "SRC-001",
        "SRC-005",
        "SRC-007",
        "SRC-009",
        "SRC-016",
        "SRC-018"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "note": "SRC 为研究来源索引，不是案卷材料 SourceRef；来源状态不等于学校授权或政策确认。"
    },
    {
      "sectionId": "evidence-and-review",
      "criterionId": "r025",
      "sourceRuleId": "R025",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-009"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "note": "SRC 为研究来源索引，不是案卷材料 SourceRef；来源状态不等于学校授权或政策确认。"
    },
    {
      "sectionId": "evidence-and-review",
      "criterionId": "r026",
      "sourceRuleId": "R026",
      "srcIds": [
        "SRC-004",
        "SRC-005",
        "SRC-016"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "note": "SRC 为研究来源索引，不是案卷材料 SourceRef；来源状态不等于学校授权或政策确认。"
    },
    {
      "sectionId": "evidence-and-review",
      "criterionId": "r027",
      "sourceRuleId": "R027",
      "srcIds": [
        "SRC-001",
        "SRC-008",
        "SRC-009",
        "SRC-010",
        "SRC-017"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "note": "SRC 为研究来源索引，不是案卷材料 SourceRef；来源状态不等于学校授权或政策确认。"
    },
    {
      "sectionId": "evidence-and-review",
      "criterionId": "r028",
      "sourceRuleId": "R028",
      "srcIds": [
        "SRC-007",
        "SRC-008",
        "SRC-009",
        "SRC-010",
        "SRC-012",
        "SRC-013",
        "SRC-015",
        "SRC-019"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "note": "SRC 为研究来源索引，不是案卷材料 SourceRef；来源状态不等于学校授权或政策确认。"
    },
    {
      "sectionId": "evidence-and-review",
      "criterionId": "r029",
      "sourceRuleId": "R029",
      "srcIds": [
        "SRC-009",
        "SRC-010",
        "SRC-011"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "note": "SRC 为研究来源索引，不是案卷材料 SourceRef；来源状态不等于学校授权或政策确认。"
    },
    {
      "sectionId": "evidence-and-review",
      "criterionId": "r030",
      "sourceRuleId": "R030",
      "srcIds": [
        "SRC-007",
        "SRC-008",
        "SRC-009",
        "SRC-010"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "note": "SRC 为研究来源索引，不是案卷材料 SourceRef；来源状态不等于学校授权或政策确认。"
    }
  ]
}

export default templateVersion
