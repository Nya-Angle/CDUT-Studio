import type { TemplateVersion } from '@profer/shared'

/** V3-native, non-official R02 research template. Policy-sensitive checks stay manual. */
export const templateVersion: TemplateVersion = {
  "templateId": "S01-T06",
  "version": 1,
  "schemaVersion": 2,
  "name": "本人申请退学及学籍退出手续核验",
  "description": "本地研究模板 · 非校方正式模板。将研究原件中的事实预审、材料核验和人工复核要求转为 V3 检查项；不得替代学校现行制度、授权审批或学籍写入。",
  "catalogKind": "builtin",
  "sourceNote": "R02_RESEARCH_TEMPLATE_NONOFFICIAL: S01-T06 为独立研究交接稿，非成都理工大学校方正式模板；政策证据状态为 PARTIAL，最终决定与学籍变更须由有权人员人工完成。",
  "objectType": "person",
  "displayName": {
    "template": "S01-T06 · {{f001}}"
  },
  "fields": [
    {
      "key": "f001",
      "label": "F001 · 案卷唯一号（字符串）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "F001 案卷唯一号（字符串）；CASE P0—P5；案卷主写者可信创建；案卷元数据，M014；I0；无则案卷不能关联；不可用上传文书自造"
    },
    {
      "key": "f002",
      "label": "F002 · 权威学生键（字符串）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "F002 权威学生键（字符串）；STU P0—P5；校方学籍主管台账；M002 记录主键；I1；失联→人工学籍核验；与旧版不一致→核人"
    },
    {
      "key": "f003",
      "label": "F003 · 提交者认证与本人对应凭据（结构）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "F003 提交者认证与本人对应凭据（结构）；APP P0/P1/P5；可信身份会话或现场核验记录；M003 认证/见证轨迹；I2；缺/失联→核人；Renderer actor 无效"
    },
    {
      "key": "f004",
      "label": "F004 · 权威学籍姓名（字符串）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "F004 权威学籍姓名（字符串）；STU P0—P5；学籍台账；M002 姓名；I1；不读时失联；与申请姓名不同→核 G01 权威结论"
    },
    {
      "key": "f005",
      "label": "F005 · 证件标识/脱敏指纹（字符串）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "F005 证件标识/脱敏指纹（字符串）；STU P0/P1；授权身份系统/人工原件比对；M003 核证结果，非默认存证件影印；I2；不采不影响有别的可信校内唯一键；冲突核人"
    },
    {
      "key": "f006",
      "label": "F006 · 申请书署名（字符串）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "F006 申请书署名（字符串）；APP P1/P5；本人提交原文，待核验；M001 署名处（非特定表格字段）；I1；当前书面申请无署名/不可辨→缺或不可读，真实性核人"
    },
    {
      "key": "f007",
      "label": "F007 · 学生分类（枚举）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "F007 学生分类（枚举）；STU P0/P1；学籍主管台账；M002 学生类别；I1；失联→不能默认本科"
    },
    {
      "key": "f008",
      "label": "F008 · 学历层次/学段（枚举）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "F008 学历层次/学段（枚举）；STU P0/P1；学籍主管台账；M002 本科/硕士/博士/非学历等；I1；未知→C04/C05/C07 人工分路"
    },
    {
      "key": "f009",
      "label": "F009 · 入学年级/学年（字符串）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "F009 入学年级/学年（字符串）；STU P0/P4；学籍台账；M002 学籍起始时间；I1；非统一硬条件；涉及证书/费用时缺→主管核人"
    },
    {
      "key": "f010",
      "label": "F010 · 培养形式（枚举）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "F010 培养形式（枚举）；STU P0/P1；研究生/教务台账；M002 全日制/非全日制；I1；未知→核研究生适用范围，不冒用普通本科"
    },
    {
      "key": "f011",
      "label": "F011 · 来华留学身份与证件核验（结构）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "F011 来华留学身份与证件核验（结构）；STU P0/P1；国际学生可信台账/有权现场核验；M002/M003 注册/证件核验结论；I2；条件缺→国际业务人工；不默认收护照复印件"
    },
    {
      "key": "f012",
      "label": "F012 · 中外合作项目属性（布尔/枚举）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "F012 中外合作项目属性（布尔/枚举）；STU P0/P1；学籍/项目主管台账；M002/M005 项目归属；I1；未定→C04 特别制度核对"
    },
    {
      "key": "f013",
      "label": "F013 · 继续教育属性（布尔/枚举）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "F013 继续教育属性（布尔/枚举）；STU P0/P1；继续教育学籍台账；M002/M005 办学形式；I1；未定→C05 手工确认制度"
    },
    {
      "key": "f014",
      "label": "F014 · 学院/培养单位及校区（结构）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "F014 学院/培养单位及校区（结构）；STU P0—P3；校方权威分配记录；M002 单位归属、M008 意见主体；I1；多版本冲突→主管确认实际归口"
    },
    {
      "key": "f015",
      "label": "F015 · 申请时及各事件时点学籍状态（时间线枚举）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "F015 申请时及各事件时点学籍状态（时间线枚举）；STU P0—P5；学籍系统有效异动；M002/M027 状态历史；I1；失联→不臆断注销/在籍；冲突人工"
    },
    {
      "key": "f016",
      "label": "F016 · 学籍状态取证时点（时间戳）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "F016 学籍状态取证时点（时间戳）；STU P0—P5；权威查询/现场核验审计；M002 查询或盖证时点；I0；无→快照不能说明申请日有效状态"
    },
    {
      "key": "f017",
      "label": "F017 · 邻接权威决定引用（结构）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "F017 邻接权威决定引用（结构）；STU P0/P5；原主管机关已生效决定；M027 原案、文号、生效态；I1；条件无可 N/A；仅申请意向不可作生效决定"
    },
    {
      "key": "f018",
      "label": "F018 · 明确本人退学意思文字（文本）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "F018 明确本人退学意思文字（文本）；APP P1；申请原文+本人确认；M001 申请正文相关表述；I3；当前不能识别自愿申请→缺/不可读/核人"
    },
    {
      "key": "f019",
      "label": "F019 · 申请签署/意思真实性验证（结构）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "F019 申请签署/意思真实性验证（结构）；APP P1；学校可验证签章/面签核验者；M001/M003 签署处与核验日志；I2；不可验证→核人；纸签/OCR 不直接等于本人"
    },
    {
      "key": "f020",
      "label": "F020 · 书面申请落款日期（日期）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "F020 书面申请落款日期（日期）；APP P1；M001 原件，待核；M001 落款位置；I1；表单强制性未知；缺→人工确认，不能虚构截止日"
    },
    {
      "key": "f021",
      "label": "F021 · 申请理由原文（文本）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "F021 申请理由原文（文本）；APP P1；申请人原文；M001 叙述部分，如存在；I3；非已核统一必填；不以 AI 评判理由“充分”"
    },
    {
      "key": "f022",
      "label": "F022 · 当前申请版次/哈希（结构）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "F022 当前申请版次/哈希（结构）；APP P1/P2/P5；案卷材料版本记录；M001/M014 哈希与先后关系；I0；必须保留旧版；不同版意见→核人"
    },
    {
      "key": "f023",
      "label": "F023 · 正式受理日期/登记号（结构）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "F023 正式受理日期/登记号（结构）；APP P1/P5；受理机关登记；M014 登记字段（若确有）；I1；系统未提供→失联/未定；不能推定受理成功"
    },
    {
      "key": "f024",
      "label": "F024 · 代递交/代理声明（布尔/文本）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "F024 代递交/代理声明（布尔/文本）；APP P1；申报者声明，待学校核实；M006 代理声明（如触发）；I2；未触发可 N/A；不得先认定代理合法"
    },
    {
      "key": "f025",
      "label": "F025 · 代理/监护权限验证（结构）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "F025 代理/监护权限验证（结构）；APP P1；授权人/监护资格原件、校方核验；M006 授权链及核验记录；I2；本校政策未定，触发则核人；不默认同意"
    },
    {
      "key": "f026",
      "label": "F026 · 研究生导师可信身份/关系（结构）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "F026 研究生导师可信身份/关系（结构）；OP P2；研究生导师管理权威记录；M007 签署者与导师关系；I1；C02 到 P2 才需；缺/变更交研院"
    },
    {
      "key": "f027",
      "label": "F027 · 导师意见与版本（结构）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "F027 导师意见与版本（结构）；OP P2；经证实导师意见；M007 意见原文及签署；I3；C02 到节点未有→缺；P1 未到→未到"
    },
    {
      "key": "f028",
      "label": "F028 · 学院/培养单位意见与版本（结构）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "F028 学院/培养单位意见与版本（结构）；OP P2；学院/培养单位有权签署者；M008 意见原文、日期；I3；相应学段在 P2 才查；主体/版次冲突核人"
    },
    {
      "key": "f029",
      "label": "F029 · 教务处意见与版本（结构）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "F029 教务处意见与版本（结构）；OP P2；教务处有权签署者；M009 本科教务意见；I3；C01 在 P2 相应环节必需；其他 C 视路径 N/A"
    },
    {
      "key": "f030",
      "label": "F030 · 研工部/研究生院意见与版本（结构）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "F030 研工部/研究生院意见与版本（结构）；OP P2；两部门相关授权记录；M010 签署意见，是否分两章待表单核；I3；C02 在 P2 查；不能用导师意见代替"
    },
    {
      "key": "f031",
      "label": "F031 · 国际交流与合作处意见与版本（结构）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "F031 国际交流与合作处意见与版本（结构）；OP P2；国际事务有权部门；M011 校本国际学生意见；I3；C03 在 P2 查；其他分支不得套用"
    },
    {
      "key": "f032",
      "label": "F032 · 最终审批人权限及身份（结构）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "F032 最终审批人权限及身份（结构）；DEC P3；校领导授权/学校组织人事及审批链；M012/M028 审批签署者；I1；无可信授权→核人，不承认 Renderer 角色"
    },
    {
      "key": "f033",
      "label": "F033 · 有权审批意见及日期（结构）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "F033 有权审批意见及日期（结构）；DEC P3；有权审批记录；M012 真正审批节点；I3；P2 结束不等于有；缺→须原机关办理"
    },
    {
      "key": "f034",
      "label": "F034 · 重大决定程序/合法性衔接结论（结构）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "F034 重大决定程序/合法性衔接结论（结构）；DEC P3；学校法务/正式授权机关；M012/M028 程序认定与依据；I3；SRC-001 第 56 条适用未定→政策未确认+核人"
    },
    {
      "key": "f035",
      "label": "F035 · 退学校文文号/签发日期（结构）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "F035 退学校文文号/签发日期（结构）；DEC P3/P4；学校发文系统/原件核验；M013 正式文号/签发信息；I1；未发文→未到或缺，不能据 P2 结果构造"
    },
    {
      "key": "f036",
      "label": "F036 · 正式校文真实性和版次（结构）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "F036 正式校文真实性和版次（结构）；DEC P3/P4；学校公文主管记录；M013 签发、版本、核验结果；I3；上传扫描件仅候选；失联/冲突核人"
    },
    {
      "key": "f037",
      "label": "F037 · 决定生效日（日期）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "F037 决定生效日（日期）；DEC P3/P4；真实校文及生效规则；M013 明定日期/学校确认；I1；不得以申请日代入；未知不算 1 周期限"
    },
    {
      "key": "f038",
      "label": "F038 · 校方另行拟/已处理事实（结构）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "F038 校方另行拟/已处理事实（结构）；DEC P0/P1/P5；学籍处理权威登记；M026/M027 校方发起文件及状态；I3；存在→C08 冲突分流，不能抹为本人申请"
    },
    {
      "key": "f039",
      "label": "F039 · 撤回请求主体/时点/原案引用（结构）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "F039 撤回请求主体/时点/原案引用（结构）；EVT P5；M015 原文+本人核验；M015 请求正文及提交记录；I3；请求不等于生效；身份冲突核人"
    },
    {
      "key": "f040",
      "label": "F040 · 撤回处理结果/权限/生效（结构）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "F040 撤回处理结果/权限/生效（结构）；EVT P5；原受理或有权决定机关；M016 权威结论；I3；未产生→未到；不能默认申请已撤销"
    },
    {
      "key": "f041",
      "label": "F041 · 异议/申诉请求与送达线索（结构）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "F041 异议/申诉请求与送达线索（结构）；EVT P5；M017 原文+有权受理记录；M017 请求、指向决定；I3；时限与适用范围未知，先人工转送"
    },
    {
      "key": "f042",
      "label": "F042 · 申诉复查结论及效力（结构）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "F042 申诉复查结论及效力（结构）；EVT P5；学校申诉委员会/法定复查机关；M018 权威处理文书；I3；未到→不能认定复核成立或原决定失效"
    },
    {
      "key": "f043",
      "label": "F043 · 学杂费及退费结算状态（结构）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "F043 学杂费及退费结算状态（结构）；EXIT P4；财务原主管记录；M019 原结算状态/票据引用；I3；不作 P1 必填；SRC-005 现行性未核，金额不自动算"
    },
    {
      "key": "f044",
      "label": "F044 · 奖助/资助清算状态（结构）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "F044 奖助/资助清算状态（结构）；EXIT P4；资助/研究生管理主管记录；M020 清算凭据；I3；条件触发；校本政策未知，人工部门核定"
    },
    {
      "key": "f045",
      "label": "F045 · 研究生离校专用单办理状态（结构）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "F045 研究生离校专用单办理状态（结构）；EXIT P4；研究生院确认及各经办部门；M021 已核签办事实；I3；C02 P4 时查；P1 不可强制提交"
    },
    {
      "key": "f046",
      "label": "F046 · 住宿退宿/资产结清状态（结构）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "F046 住宿退宿/资产结清状态（结构）；EXIT P4；宿管或资产经办机关；M022 权威办结记录；I3；按实际住宿触发；本人声称已退不能代替核验"
    },
    {
      "key": "f047",
      "label": "F047 · 档案/户口或就业衔接状态（结构）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "F047 档案/户口或就业衔接状态（结构）；EXIT P4；档案/户籍/就业主管部门；M023 接收/转出记录；I2；权限/适用性不同；不强索户口本"
    },
    {
      "key": "f048",
      "label": "F048 · 教育学籍电子异动登记状态（结构）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "F048 教育学籍电子异动登记状态（结构）；EXIT P4；学籍注册主管记录；M024 主数据变更及时间；I1；缺→由学校经办处理；绝不让 AI 写入"
    },
    {
      "key": "f049",
      "label": "F049 · 证书/写实证明办理事实（结构）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "F049 证书/写实证明办理事实（结构）；EXIT P4；学籍与证书主管；M025 实际出证记录；I1；仅符合条件时引用，不能自动签发"
    },
    {
      "key": "f050",
      "label": "F050 · 证据归属与来源版本（结构）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "F050 证据归属与来源版本（结构）；PROV P0—P5；材料登记/正式原系统凭据；每 M 的 sourceId、hash、case/student/stage、version；I1；失配→CONFLICT；旧版已核结论待重核"
    },
    {
      "key": "f051",
      "label": "F051 · 解析可读性与人工核验轨迹（结构）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "F051 解析可读性与人工核验轨迹（结构）；PROV P0—P5；原件与有权核验者记录；每 M 的 OCR 片段坐标/签认日志；I1；不可读→UNREADABLE，不可推测补字"
    },
    {
      "key": "f052",
      "label": "F052 · 适用政策及授权链版本（结构）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "F052 适用政策及授权链版本（结构）；PROV P0—P5；校方正式制度、签发/废止证明；M028 适用版、起止日、学段；I0；现行性/授权不清→POLICY_UNCONFIRMED"
    }
  ],
  "materialSlots": [
    {
      "id": "m001",
      "name": "本人书面申请、主动退学意愿",
      "purpose": "本人持申请原件；学校受理单位保存原件/经核证电子申请；P1 当；C09 补正时新版本 当，P0 仅意向不等于受理；学校确认现行有效的本科/研究生/国际表单或本人书面申请；纸电签形式待核；SRC-002/003/004/007/009；F006/F018—F022/F050/F051；案-学-版、署名/时点核证；缺→NEEDS_MATERIAL，不可读→重采，不因缺后置章拒绝 P1",
      "requiredElements": [
        "本人书面申请、主动退学意愿",
        "主体与案卷归属",
        "来源版本与证据时点"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 50,
      "requiredAt": "submission",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m002",
      "name": "教务、研究生、国际、继续教育等学籍主管记录",
      "purpose": "教务、研究生、国际、继续教育等学籍主管记录；P0/P1 当（校内取证）；P4 校验状态变化；有权部门人工查询/盖证的同一时点台账快照；不是学生自开证明；SRC-002/003/004/006；F002/F004/F007—F017/F050/F051；案-学-查询时点；来源失联→人工核，冲突不强制学生上传替代",
      "requiredElements": [
        "教务、研究生、国际、继续教育等学籍主管记录",
        "主体与案卷归属",
        "来源版本与证据时点"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 50,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m003",
      "name": "本人真实身份及署名归属核验",
      "purpose": "学校身份认证/受理人员现场核验记录；不是默认身份证复印件；P0/P1 当；C10 再核本人；有权面签、现场有效证件核验或学校认可电子签认证；方式及代理规则 待核；SRC-002/003/004；F003/F005/F019/F050/F051；案-学-认证事件；不可核→身份疑点交人工，不将客户端账号当审批身份",
      "requiredElements": [
        "本人真实身份及署名归属核验",
        "主体与案卷归属",
        "来源版本与证据时点"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 50,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m004",
      "name": "特殊学籍状态/培养归口补证",
      "purpose": "学籍部门、培养管理部门；P0/P1 条：休学/保留、导师变更、联合培养、未注册等状态不能由普通台账解释；原部门书面核验或 M027 有效异动决定；SRC-002/003/004；F010/F014—F017/F050；案-学-有效时点；失联→暂停路径判断，不让学生凭口述填补",
      "requiredElements": [
        "特殊学籍状态/培养归口补证",
        "主体与案卷归属",
        "来源版本与证据时点"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 50,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m005",
      "name": "特别学段/项目适用制度证明",
      "purpose": "中外合作、继续教育及相应主管部门保存的正式制度/归属记录；C04/C05 的 P0 条；制度效力 待核；正式校文/制度汇编及主管单位确认；不是申请人需交材料；SRC-002/013/014；F012/F013/F052/F050；制度号-学段-版本；缺→POLICY_UNCONFIRMED 而非学生缺件",
      "requiredElements": [
        "特别学段/项目适用制度证明",
        "主体与案卷归属",
        "来源版本与证据时点"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 50,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m006",
      "name": "代理/监护递交及授权核验",
      "purpose": "授权人/代理者提供合法凭据；学校受理单位审验；P1 条/待核：仅实际代办/不具备直接意思表达等触发；本人经学校认可的独立确认/合法授权或法定监护材料，具体标准未知；SRC-001/002/003/004 仅为一般背景；F024/F025/F050/F051；案-授权人-受托人-有效期；无明确校本依据不设通用强制件，异常核人",
      "requiredElements": [
        "代理/监护递交及授权核验",
        "主体与案卷归属",
        "来源版本与证据时点"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 50,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m007",
      "name": "导师意见及导师关系",
      "purpose": "研究生导师/研究生导师管理机关；C02 的 P2 后（进入导师意见节点时为 当）；原导师有权签署的同等可核记录；缺任/换导师的替代权限待校方核；SRC-003 第 31 条；F026/F027/F050/F051；案-导师-所审申请版；P1 缺→NOT_APPLICABLE，P2 缺→导师办理，扫描不可读返原签者",
      "requiredElements": [
        "导师意见及导师关系",
        "主体与案卷归属",
        "来源版本与证据时点"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 50,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m008",
      "name": "所在学院/培养单位意见",
      "purpose": "所属学院/培养单位有权签署者；C01/C02/C03 的 P2 后，到该节点 当；C04/C05 路径 待核；有权学院公文/表单真实意见；SRC-002/003/004 各相应条；F014/F028/F050/F051；案-学院-申请版-签者；缺→学院处理，主体不符→冲突",
      "requiredElements": [
        "所在学院/培养单位意见",
        "主体与案卷归属",
        "来源版本与证据时点"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 50,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m009",
      "name": "教务处意见",
      "purpose": "教务处本科管理机构；C01 的 P2 后，到教务节点 当；教务处签署或可证实的同等流程记录；SRC-002 第 46 条、SRC-006；F029/F050/F051；案-本科归口-版次；P1 不催，错角色不认",
      "requiredElements": [
        "教务处意见",
        "主体与案卷归属",
        "来源版本与证据时点"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 50,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m010",
      "name": "党委研究生工作部/研究生院意见",
      "purpose": "党委研工部、研究生院原机构；C02 的 P2 后，到对应部门 当；校本审批表或各部门权威意见；具体是联合/分签章待核；SRC-003 第 31 条；F030/F050/F051；案-授权机构-申请版；一方意见不能未经授权替代另一方，缺签转原部门",
      "requiredElements": [
        "党委研究生工作部/研究生院意见",
        "主体与案卷归属",
        "来源版本与证据时点"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 50,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m011",
      "name": "国际交流与合作处意见",
      "purpose": "国际交流与合作处有权签署者；C03 P2 后，到该节点 当；正式校内工作流意见；表单附件未读；SRC-004 第 43 条、SRC-009；F031/F050/F051；案-国际学生-申请版；P1 无此件不缺，扫描章须核真",
      "requiredElements": [
        "国际交流与合作处意见",
        "主体与案卷归属",
        "来源版本与证据时点"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 50,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m012",
      "name": "有权审批/授权与必要程序证据",
      "purpose": "分管校领导审批机关、学校法律事务/授权会议记录保管机关；P3 后，审批节点才核；第 56 条衔接 待核；真实审批记录和有权机关对授权/合法性的核验；SRC-001 第 56 条、SRC-002/003/004；F032—F034/F050/F051/F052；案-审批机关-所审版；无可信权限→人工，不让学生提交伪造“领导意见”",
      "requiredElements": [
        "有权审批/授权与必要程序证据",
        "主体与案卷归属",
        "来源版本与证据时点"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 50,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m013",
      "name": "正式退学批准学校发文",
      "purpose": "学校公文系统/公文归档部门；P3 已发文时 后 且核对 当；P4 以其权威引用为前提；真实电子公文核验或原签发机关核证校文；SRC-002/003/004；F035—F037/F050/F051；案-学-文号-公文版；失联→校办核；P1 无文不算缺件",
      "requiredElements": [
        "正式退学批准学校发文",
        "主体与案卷归属",
        "来源版本与证据时点"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 50,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m014",
      "name": "受理、补正及材料版本轨迹",
      "purpose": "受理机关登记/案卷可信事件记录；P1/P2/P5 随办理过程产生 后；实际受理方式 待核；受理机关人工登记、可验证流水（若有）；SRC-002/003/004 仅支持对应机关意见，不证明已有系统；F001/F022/F023/F050/F051；案-操作人-时间-旧新版；无接口→人工登记；不能以文件上传时间冒充正式受理",
      "requiredElements": [
        "受理、补正及材料版本轨迹",
        "主体与案卷归属",
        "来源版本与证据时点"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 50,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m015",
      "name": "学生提出撤回的请求",
      "purpose": "可信核身后的本人；受理部门；C10/P5 发起时 当，其他情形 N/A；本人可归属书面/受理机关认可方式，程序 待核；SRC-001/010/015；F003/F039/F050/F051；案-原申请版-提交时点；无则无撤回事由，不自动撤销",
      "requiredElements": [
        "学生提出撤回的请求",
        "主体与案卷归属",
        "来源版本与证据时点"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 50,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m016",
      "name": "有权机关对撤回的处理",
      "purpose": "原受理/原决定机关，准确权限待核；C10/P5 请求进入处理后 后；正式撤回受理/不予撤回处理记录；没有已证实的统一校本表单；SRC-001/010/015；F040/F050/F051；案-决定文号-版本；未产生不能以 M015 视作撤回成功",
      "requiredElements": [
        "有权机关对撤回的处理",
        "主体与案卷归属",
        "来源版本与证据时点"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 50,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m017",
      "name": "申请人/校方申诉受理机关",
      "purpose": "申请人/校方申诉受理机关；C12/P5 提出异议时 当；申诉适用性 待核；经有权机关认可的申诉书或登记；SRC-001 第 59—64 条、SRC-010/015；F041/F050/F051；案-被争议决定-提交时点；缺原决定引用→核人，不编时限",
      "requiredElements": [
        "申请人/校方申诉受理机关",
        "主体与案卷归属",
        "来源版本与证据时点"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 50,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m018",
      "name": "学校申诉委员会/有权复查机关",
      "purpose": "学校申诉委员会/有权复查机关；C12/P5 正式作出后 后；原处理机关权威结论及送达核验；SRC-001/010/015；F042/F050/F051；案-复查事项-文书版；未到不能将异议成立、决定失效写成事实",
      "requiredElements": [
        "学校申诉委员会/有权复查机关",
        "主体与案卷归属",
        "来源版本与证据时点"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 50,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m019",
      "name": "学杂费结算/退费事实",
      "purpose": "财务部门原始账户和结算登记；P4 后/条，仅结算触发时核；财务主管出具的已办状态或有效票据；SRC-005 第 10 条现行性未核；F043/F050/F051；案-学生-结算期；P1 不催，数额/退还权人工核定，系统失联转财务",
      "requiredElements": [
        "学杂费结算/退费事实",
        "主体与案卷归属",
        "来源版本与证据时点"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 50,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m020",
      "name": "奖助及资助清算事实",
      "purpose": "资助、研工等原主管机关；P4 后/条，实际领有项目才触发；有权资助管理部门确认；专项细则尚未取得，SRC-003 仅为相关学段背景；F044/F050/F051；案-资助项目-学期/版；缺归主管，不能将未领者判欠办",
      "requiredElements": [
        "奖助及资助清算事实",
        "主体与案卷归属",
        "来源版本与证据时点"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 50,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m021",
      "name": "研究生退学专用离校单状态",
      "purpose": "研究生院及表单所列各办理部门（栏位未读）；C02 P4 后/条，若现行表单仍要求时为该节点 当；经研院确认的有效离校办理记录；SRC-008 仅表单目录已核；F045/F050/F051；案-毕业/退学类型-版；P1 绝不催，栏目缺漏待原件和办理说明确认",
      "requiredElements": [
        "研究生退学专用离校单状态",
        "主体与案卷归属",
        "来源版本与证据时点"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 50,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m022",
      "name": "退宿/住宿资产结清",
      "purpose": "宿舍/资产实际主管；P4 后/条：确有住宿/借用资产；部门权威办结记录；现行校本离校细则未得，SRC-002/003/004 仅说明离校；F046/F050/F051；案-宿舍/资产-时期；无住宿 N/A，争议交原部门",
      "requiredElements": [
        "退宿/住宿资产结清",
        "主体与案卷归属",
        "来源版本与证据时点"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 50,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m023",
      "name": "档案、户籍或就业去向办理",
      "purpose": "档案、户籍、就业原主管部门；P4 后/条，具体学生身份触发；可信转接/收件回执；SRC-002 第 47、57 条、SRC-003 第 33 条；F047/F050/F051；案-去向-时间-回执版；不能让学生凭空出具尚未流转回执",
      "requiredElements": [
        "档案、户籍或就业去向办理",
        "主体与案卷归属",
        "来源版本与证据时点"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 50,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m024",
      "name": "电子学籍异动/备案记录",
      "purpose": "学籍主管部门、获授权国家学籍系统操作者；P4 后，决定后由主管机关办理；权威已变更/未变更记录；SRC-001 第 32 条、SRC-002/003/004；F048/F050/F051；案-学生-决定文号-有效日；不由 AI/Renderer 直接写回",
      "requiredElements": [
        "电子学籍异动/备案记录",
        "主体与案卷归属",
        "来源版本与证据时点"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 50,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m025",
      "name": "肄业证或写实证明事实",
      "purpose": "教务、研究生院及证书签发机关；P4 后/条：符合法定条件才考虑；已签发证书/主管机关记录；SRC-002 第 50 条、SRC-003 第 34—37 条；F049/F050/F051；案-证书类别-号码-版；未签不等于退学申请有缺件",
      "requiredElements": [
        "肄业证或写实证明事实",
        "主体与案卷归属",
        "来源版本与证据时点"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 50,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m026",
      "name": "学校依职权拟/已退学处理轨迹",
      "purpose": "教务/研究生/国际学生处理主管机关；C08 P0—P5 条；不得认作主动申请；真实校方告知、审批、会议决定与公文；SRC-001 第 55—56 条、SRC-002/003/004 的处理条款；F038/F050/F051；独立校方处理事件-学生-状态版；发现→保留并人工分流，不用 M001“洗白”",
      "requiredElements": [
        "学校依职权拟/已退学处理轨迹",
        "主体与案卷归属",
        "来源版本与证据时点"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 50,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m027",
      "name": "G50/G01/S01 相邻事项权威结论",
      "purpose": "原决定机关/原案持有人；C06/C07/C08 或身份姓名冲突时 P0/P1 条；仅原机关有效且适用的学籍、信息更正、保留资格结论；邻接具体 G50 项待总账 SRC 校准；F015/F017/F038/F050/F051；原案-原决定-生效日-版本；未决申请不替代结论",
      "requiredElements": [
        "G50/G01/S01 相邻事项权威结论",
        "主体与案卷归属",
        "来源版本与证据时点"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 50,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m028",
      "name": "学校信息公开、正式发文和业务/法务主管",
      "purpose": "学校信息公开、正式发文和业务/法务主管；P0—P5 经办方当前需核；特殊身份/第 56 条 待核；官方制度原件、修废说明、正式授权解释；SRC-001/002/003/004/010/013/014；F034/F052/F050；学段-政策编号-版本-效力日；缺→POLICY_UNCONFIRMED，不转学生补文件",
      "requiredElements": [
        "学校信息公开、正式发文和业务/法务主管",
        "主体与案卷归属",
        "来源版本与证据时点"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 50,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    }
  ],
  "sections": [
    {
      "id": "rule-set-01",
      "name": "审核规则逐条清单",
      "order": 0,
      "required": true,
      "criteria": [
        {
          "id": "r001",
          "title": "R001｜P0 全体",
          "requirement": "研究原件第08章的候选事实预审要求（非校方正式政策）：R001 P0 全体；案卷 ID、主体归属和材料版次可追溯；真均一致、假版次跨案、未知不可取。SRC-001；F001/F002/F050；M001/M002/M014；真 PASS；假 CONFLICT→案卷管理员；未知 SOURCE_UNAVAILABLE→经办人",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "r002",
          "title": "R002｜P0 全体",
          "requirement": "研究原件第08章的候选事实预审要求（非校方正式政策）：R002 P0 全体；校内可信学生身份键存在且取证时点明确；不是上传者自填。SRC-001/002/003/004；F002/F004/F016；M002；真 PASS；矛盾 CONFLICT；未获取 SOURCE_UNAVAILABLE→学籍主管",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r003",
          "title": "R003｜P0 全体",
          "requirement": "研究原件第08章的候选事实预审要求（非校方正式政策）：R003 P0 全体；实际在籍或适用学籍状态；无学籍明确为错路由，状态不明不推定。SRC-002/003/004；F007/F008/F015；M002/M027；真 PASS；明确非适用 N/A 并转招生/身份业务；冲突 CONFLICT；未知 SOURCE_UNAVAILABLE→学籍主管",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r004",
          "title": "R004｜P0 全体",
          "requirement": "研究原件第08章的候选事实预审要求（非校方正式政策）：R004 P0 全体；判断本科、研究生、国际、合作、继教适用路径；特殊政策有正式适用版。SRC-001/002/003/004/013/014；F007/F008/F010/F011/F012/F013/F052；M002/M005/M028；常规路径可信 PASS；特殊制度不明 POLICY_UNCONFIRMED→相关主管；假 N/A",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r005",
          "title": "R005｜P0/P1 休学/保留者",
          "requirement": "研究原件第08章的候选事实预审要求（非校方正式政策）：R005 P0/P1 休学/保留者；状态来自已生效邻接决定，非未结申请。SRC-002/003/004；F015/F017；M002/M027；真 PASS；无邻接事项 N/A；冲突 CONFLICT→学籍主管",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "r006",
          "title": "R006｜P0/P1 全体",
          "requirement": "研究原件第08章的候选事实预审要求（非校方正式政策）：R006 P0/P1 全体；检查学校依职权退学程序是否和自愿请求同时存在。SRC-001/002/003/004；F038/F018；M026/M001；无冲突 PASS；两条事件共存 CONFLICT/NEEDS_HUMAN_DECISION→学籍主管及法务；未知 SOURCE_UNAVAILABLE",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "r007",
          "title": "R007｜P1 自愿申请",
          "requirement": "研究原件第08章的候选事实预审要求（非校方正式政策）：R007 P1 自愿申请；当前申请是否存在可读的书面退学意思；无书面材料为缺件。SRC-001/002/003/004；F006/F018/F022；M001；真 PASS；缺 NEEDS_MATERIAL→本人；不可读 UNREADABLE→本人/受理方；仅校方处理 N/A",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "r008",
          "title": "R008｜P1 自愿申请",
          "requirement": "研究原件第08章的候选事实预审要求（非校方正式政策）：R008 P1 自愿申请；本人身份与申请意思可验证、非仅 OCR/Renderer 声明；代理/胁迫疑点不机器认定。SRC-002/003/004；F003/F006/F019；M001/M003；可信核证 PASS；不一致 CONFLICT；无法验证 NEEDS_HUMAN_DECISION→受理机关身份核验者",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r009",
          "title": "R009｜P1 代理/监护触发",
          "requirement": "研究原件第08章的候选事实预审要求（非校方正式政策）：R009 P1 代理/监护触发；权限及代递交方式获适用校本认可。SRC-002/003/004/007/009；F024/F025；M006/M003；未代办 N/A；已确认 PASS；规则未证 POLICY_UNCONFIRMED、代理资格不明 NEEDS_HUMAN_DECISION→学籍/法务",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r010",
          "title": "R010｜P1 全体",
          "requirement": "研究原件第08章的候选事实预审要求（非校方正式政策）：R010 P1 全体；申请署名/校内权威身份一致，考虑已生效 G01 更名。SRC-002/003/004；F002/F004/F006/F017；M001/M002/M027；一致 PASS；更名待证 CONFLICT→身份主管；无可信数据 SOURCE_UNAVAILABLE",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r011",
          "title": "R011｜P1 全体",
          "requirement": "研究原件第08章的候选事实预审要求（非校方正式政策）：R011 P1 全体；所用表格/电子签章是否是当期受理渠道认可的有效书面载体。SRC-002/003/004/007/009；F019/F020/F052；M001/M028；已认可 PASS；当前表单未证 POLICY_UNCONFIRMED→受理部门；不强制旧索引附件",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "r012",
          "title": "R012｜P1 全体",
          "requirement": "研究原件第08章的候选事实预审要求（非校方正式政策）：R012 P1 全体；学校是否实际登记受理（如该路线设受理记录），与学生“已提交”区分。SRC-002/003/004；F023/F022；M014；已核 PASS；未到受理 N/A；登记不可查 SOURCE_UNAVAILABLE→受理机构",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "r013",
          "title": "R013｜P2 研究生",
          "requirement": "研究原件第08章的候选事实预审要求（非校方正式政策）：R013 P2 研究生；导师是对应学生/申请版次的有效导师，签署意见真实。SRC-003 第31条；F026/F027/F022；M007/M001/M002；真 PASS；本科学段 N/A；节点到达缺机关意见 NEEDS_MATERIAL→导师/培养单位；旧版冲突 CONFLICT",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r014",
          "title": "R014｜P2 普通本科/研究生/国际",
          "requirement": "研究原件第08章的候选事实预审要求（非校方正式政策）：R014 P2 普通本科/研究生/国际；相应学院/培养单位意见由实际有权角色对本版出具。SRC-002/003/004；F014/F028/F022；M008/M001/M002；真 PASS；节点未到 N/A；缺→NEEDS_MATERIAL 给学院，不责学生；错人/旧版 CONFLICT",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "r015",
          "title": "R015｜P2 普通本科",
          "requirement": "研究原件第08章的候选事实预审要求（非校方正式政策）：R015 P2 普通本科；教务处意见由可信主管签署并关联申请版次。SRC-002 第46条/006；F029/F022；M009/M001；真 PASS；非适用 N/A；到节点缺 NEEDS_MATERIAL→教务处；签署不可验 SOURCE_UNAVAILABLE",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "r016",
          "title": "R016｜P2 研究生",
          "requirement": "研究原件第08章的候选事实预审要求（非校方正式政策）：R016 P2 研究生；党委研工部及研究生院意见有权威证据；两机构是否共用栏位不猜。SRC-003 第31条；F030/F022；M010/M001；真 PASS；非适用 N/A；到节点未完成 NEEDS_MATERIAL→原签署部门；形式不明 POLICY_UNCONFIRMED",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "r017",
          "title": "R017｜P2 来华学历生",
          "requirement": "研究原件第08章的候选事实预审要求（非校方正式政策）：R017 P2 来华学历生；国际交流与合作处的意见可验证且审对当前版。SRC-004 第43条；F031/F022；M011/M001；真 PASS；非适用 N/A；到节点缺 NEEDS_MATERIAL→国际交流与合作处；冲突 CONFLICT",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "r018",
          "title": "R018｜P2 特殊学生",
          "requirement": "研究原件第08章的候选事实预审要求（非校方正式政策）：R018 P2 特殊学生；中外合作/继续教育/非学历具体意见链是否已由专项制度确认。SRC-001/002/004/013/014；F012/F013/F052；M005/M028；未属特别类 N/A；有正式路径 PASS；无 POLICY_UNCONFIRMED→专项学籍主管",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "r019",
          "title": "R019｜P3 所有正式报批",
          "requirement": "研究原件第08章的候选事实预审要求（非校方正式政策）：R019 P3 所有正式报批；最终审批主体是否具有该事件的正式授权。SRC-001 第56条、SRC-002 第46条、SRC-003 第31条、SRC-004 第43/67条；F032/F034/F052；M012/M028；已获合法程序核验 PASS_FACT（仅权限事实）；授权解释未证 POLICY_UNCONFIRMED + NEEDS_HUMAN_DECISION→学校法务/有权会议",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r020",
          "title": "R020｜P3 所有正式报批",
          "requirement": "研究原件第08章的候选事实预审要求（非校方正式政策）：R020 P3 所有正式报批；有权审批意见存在、真实、关联正确学生和本版申请。SRC-002/003/004；F033/F002/F022；M012/M001；已证 PASS；未到节点 N/A；到节点缺 NEEDS_MATERIAL→审批承办单位；假冒 CONFLICT",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r021",
          "title": "R021｜P3/P4 已批准事件",
          "requirement": "研究原件第08章的候选事实预审要求（非校方正式政策）：R021 P3/P4 已批准事件；正式学校发文真实、所指学生/事项匹配、版本可追。SRC-002/003/004；F035/F036/F050；M013；已核 PASS；未发文 N/A（不能称已退学）；失联 SOURCE_UNAVAILABLE→公文主管；文号冲突 CONFLICT",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r022",
          "title": "R022｜P3/P4 已发文",
          "requirement": "研究原件第08章的候选事实预审要求（非校方正式政策）：R022 P3/P4 已发文；生效时间来自可信校文，不从扫描上传日/申请日猜。SRC-002/003/004；F035/F037；M013；真 PASS；无生效信息 SOURCE_UNAVAILABLE→公文主管；互斥日期 CONFLICT",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "r023",
          "title": "R023｜P4 生效后",
          "requirement": "研究原件第08章的候选事实预审要求（非校方正式政策）：R023 P4 生效后；学籍异动登记与正式决定同人同效力日期。SRC-001 第32条、SRC-002/003/004；F015/F048/F037；M024/M013；一致 PASS；未生效 N/A；到阶段待办 NEEDS_MATERIAL→学籍主管；冲突 CONFLICT",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r024",
          "title": "R024｜P4 生效后",
          "requirement": "研究原件第08章的候选事实预审要求（非校方正式政策）：R024 P4 生效后；财务结算状态可由财务确认；金额不自行计算。SRC-005（现行性未证）；F043/F037；M019/M013；已核 PASS；不适用 N/A；政策未核 POLICY_UNCONFIRMED→财务；记录失联 SOURCE_UNAVAILABLE",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r025",
          "title": "R025｜P4 有资助关系",
          "requirement": "研究原件第08章的候选事实预审要求（非校方正式政策）：R025 P4 有资助关系；资助清算由原资助主管确认。SRC-003/004/005；F044/F037；M020/M013；真 PASS；无资助 N/A；记录缺→NEEDS_MATERIAL 给资助部门；细则不明 POLICY_UNCONFIRMED",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "r026",
          "title": "R026｜P4 研究生",
          "requirement": "研究原件第08章的候选事实预审要求（非校方正式政策）：R026 P4 研究生；退学专用离校单办理事实由经办部门逐项核。SRC-003 第33条/SRC-008；F045/F037；M021/M013；已核 PASS；非研究生 N/A；实际表格版本未证 POLICY_UNCONFIRMED→研究生院；未完 NEEDS_MATERIAL→离校经办部门",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r027",
          "title": "R027｜P4 有住宿/资产",
          "requirement": "研究原件第08章的候选事实预审要求（非校方正式政策）：R027 P4 有住宿/资产；退宿资产结清由公寓/资产部门确认。SRC-002/003/004；F046；M022/M013；已核 PASS；无相关项目 N/A；未办 NEEDS_MATERIAL→原主管；查询断 SOURCE_UNAVAILABLE",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "r028",
          "title": "R028｜P4 有档案/户籍去向",
          "requirement": "研究原件第08章的候选事实预审要求（非校方正式政策）：R028 P4 有档案/户籍去向；档案转递/户籍、就业手续有主管部门记录，不由本模板签发。SRC-001 第32条、SRC-002/003/004；F047；M023/M013；已核 PASS；不适用 N/A；未办理 NEEDS_MATERIAL→档案/户籍主管；去向冲突 CONFLICT",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "r029",
          "title": "R029｜P4 出证条件触发",
          "requirement": "研究原件第08章的候选事实预审要求（非校方正式政策）：R029 P4 出证条件触发；肄业/写实证明等由学校证书机关核资格与签发。SRC-002/003；F049；M025/M013；已核 PASS；无出证请求/资格 N/A；不明 NEEDS_HUMAN_DECISION→证书主管",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r030",
          "title": "R030｜P5 更换材料",
          "requirement": "研究原件第08章的候选事实预审要求（非校方正式政策）：R030 P5 更换材料；新旧版关系、受影响既有意见是否仍覆盖本版。SRC-002/003/004；F022/F027/F028/F029/F030/F031/F050；M001/M007/M008/M009/M010/M011/M014；同版 PASS；未改 N/A；版本变更后依赖冲突 CONFLICT→原意见签署机关",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r031",
          "title": "R031｜P5 撤回请求",
          "requirement": "研究原件第08章的候选事实预审要求（非校方正式政策）：R031 P5 撤回请求；撤回请求由本人可信提交、明确原案及时间。SRC-001/002/003/004；F003/F039；M015/M001/M014；请求存在 PASS_FACT（仅收到请求）；无请求 N/A；签署无法核 NEEDS_HUMAN_DECISION→受理方",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r032",
          "title": "R032｜P5 撤回处理",
          "requirement": "研究原件第08章的候选事实预审要求（非校方正式政策）：R032 P5 撤回处理；撤回是否生效有权威处理结论，已发文情形须另作决定。SRC-001/010/015；F039/F040/F035；M015/M016/M013；有权结论 PASS_FACT；仅请求而无结论 NEEDS_HUMAN_DECISION→原审批/受理机关；政策范围不明 POLICY_UNCONFIRMED",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r033",
          "title": "R033｜P5 异议/申诉",
          "requirement": "研究原件第08章的候选事实预审要求（非校方正式政策）：R033 P5 异议/申诉；请求指向哪份决定且由本人/适格主体提交；受理范围期限校本另定。SRC-001 第59—64条/SRC-010/015；F003/F041/F035；M017/M013/M026；可核请求 PASS_FACT（非受理成立）；不适用 N/A；期限/受理规则不明 POLICY_UNCONFIRMED→申诉机关",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r034",
          "title": "R034｜P5 复查办理",
          "requirement": "研究原件第08章的候选事实预审要求（非校方正式政策）：R034 P5 复查办理；权威复查文书是否改变原决定的效力，不能从投诉正文推断。SRC-001/010/015；F042/F036；M018/M013；真 PASS_FACT；未结 NEEDS_HUMAN_DECISION→申诉复查机关；文书冲突 CONFLICT",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r035",
          "title": "R035｜P0—P5 全体",
          "requirement": "研究原件第08章的候选事实预审要求（非校方正式政策）：R035 P0—P5 全体；当前材料是否可读取，OCR 信心不替代原文/签发核证。SRC-001；F051/F050；M001—M028（按触发）；清晰 PASS；不可读 UNREADABLE→原持有者重传/人工查原件；未触发 N/A",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "r036",
          "title": "R036｜P0—P5 全体",
          "requirement": "研究原件第08章的候选事实预审要求（非校方正式政策）：R036 P0—P5 全体；每条结果是否绑定本案、本学生、目标和当前源版本。SRC-001；F001/F002/F050/F051；M001—M028（按触发）；归属一致 PASS；交叉串案 CONFLICT→案卷管理员；溯源失联 SOURCE_UNAVAILABLE",
          "execution": "manual",
          "targetScope": "case"
        }
      ]
    }
  ],
  "policyVersionIds": [],
  "stages": [
    {
      "id": "p0",
      "name": "P0 分类与学籍确认",
      "kind": "auto-check",
      "executorRole": "system",
      "nextStageId": "p1",
      "workflowOwner": "local"
    },
    {
      "id": "p1",
      "name": "P1 本人书面申请/受理",
      "kind": "manual-review",
      "executorRole": "student",
      "nextStageId": "p2",
      "workflowOwner": "local"
    },
    {
      "id": "p2",
      "name": "P2 分级签署意见与补件",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "returnToStageId": "p1",
      "nextStageId": "p3",
      "workflowOwner": "local"
    },
    {
      "id": "p3",
      "name": "P3 有权审批与正式发文",
      "kind": "manual-review",
      "executorRole": "teacher",
      "returnToStageId": "p2",
      "nextStageId": "p4",
      "workflowOwner": "local"
    },
    {
      "id": "p4",
      "name": "P4 生效后学籍退出/离校",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "p5",
      "workflowOwner": "local"
    },
    {
      "id": "p5",
      "name": "P5 横切事件：更正、补件、撤回、异议/复核",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "skippableReason": "横切事件，不是 P4 后必经第六步；仅在更正、补件、撤回、异议或复核实际触发时进入。",
      "workflowOwner": "local"
    }
  ],
  "outputs": [
    {
      "id": "review-findings",
      "kind": "item-feedback",
      "audience": "reviewer"
    },
    {
      "id": "supplement-list",
      "kind": "supplement-list",
      "audience": "student"
    }
  ],
  "autoPassPolicy": {
    "enabled": false
  },
  "status": "draft",
  "createdAt": "2026-10-24T00:00:00.000Z"
}

/** Research provenance is separate from case-material SourceRef values. */
export const r02Metadata = {
  "templateId": "S01-T06",
  "name": "本人申请退学及学籍退出手续核验",
  "sourceDocumentPath": "docs/design/review-agent/business-templates/R02/S01-T06.md",
  "sourceDocumentSha256": "1bdc2ecafa74717eb4da5f497e7d9cf2e9fcb86e88f1dd9877813569550ee01a",
  "sourceDocumentManifestBytes": 107601,
  "sourceDocumentGitBlobSha": "bf0c2e183e54c20ca93b259000bb42089149466f",
  "officialSchoolTemplate": false,
  "researchStatus": "RESEARCH_HANDOFF_READY",
  "policyEvidenceStatus": "PARTIAL",
  "criteria": [
    {
      "sectionId": "rule-set-01",
      "criterionId": "r001",
      "sourceRuleId": "R001",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rule-set-01",
      "criterionId": "r002",
      "sourceRuleId": "R002",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-003",
        "SRC-004"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rule-set-01",
      "criterionId": "r003",
      "sourceRuleId": "R003",
      "srcIds": [
        "SRC-002",
        "SRC-003",
        "SRC-004"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rule-set-01",
      "criterionId": "r004",
      "sourceRuleId": "R004",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-003",
        "SRC-004",
        "SRC-013",
        "SRC-014"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rule-set-01",
      "criterionId": "r005",
      "sourceRuleId": "R005",
      "srcIds": [
        "SRC-002",
        "SRC-003",
        "SRC-004"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rule-set-01",
      "criterionId": "r006",
      "sourceRuleId": "R006",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-003",
        "SRC-004"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rule-set-01",
      "criterionId": "r007",
      "sourceRuleId": "R007",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-003",
        "SRC-004"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rule-set-01",
      "criterionId": "r008",
      "sourceRuleId": "R008",
      "srcIds": [
        "SRC-002",
        "SRC-003",
        "SRC-004"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rule-set-01",
      "criterionId": "r009",
      "sourceRuleId": "R009",
      "srcIds": [
        "SRC-002",
        "SRC-003",
        "SRC-004",
        "SRC-007",
        "SRC-009"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rule-set-01",
      "criterionId": "r010",
      "sourceRuleId": "R010",
      "srcIds": [
        "SRC-002",
        "SRC-003",
        "SRC-004"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rule-set-01",
      "criterionId": "r011",
      "sourceRuleId": "R011",
      "srcIds": [
        "SRC-002",
        "SRC-003",
        "SRC-004",
        "SRC-007",
        "SRC-009"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rule-set-01",
      "criterionId": "r012",
      "sourceRuleId": "R012",
      "srcIds": [
        "SRC-002",
        "SRC-003",
        "SRC-004"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rule-set-01",
      "criterionId": "r013",
      "sourceRuleId": "R013",
      "srcIds": [
        "SRC-003"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rule-set-01",
      "criterionId": "r014",
      "sourceRuleId": "R014",
      "srcIds": [
        "SRC-002",
        "SRC-003",
        "SRC-004"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rule-set-01",
      "criterionId": "r015",
      "sourceRuleId": "R015",
      "srcIds": [
        "SRC-002"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rule-set-01",
      "criterionId": "r016",
      "sourceRuleId": "R016",
      "srcIds": [
        "SRC-003"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rule-set-01",
      "criterionId": "r017",
      "sourceRuleId": "R017",
      "srcIds": [
        "SRC-004"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rule-set-01",
      "criterionId": "r018",
      "sourceRuleId": "R018",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-004",
        "SRC-013",
        "SRC-014"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rule-set-01",
      "criterionId": "r019",
      "sourceRuleId": "R019",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-003",
        "SRC-004"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rule-set-01",
      "criterionId": "r020",
      "sourceRuleId": "R020",
      "srcIds": [
        "SRC-002",
        "SRC-003",
        "SRC-004"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rule-set-01",
      "criterionId": "r021",
      "sourceRuleId": "R021",
      "srcIds": [
        "SRC-002",
        "SRC-003",
        "SRC-004"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rule-set-01",
      "criterionId": "r022",
      "sourceRuleId": "R022",
      "srcIds": [
        "SRC-002",
        "SRC-003",
        "SRC-004"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rule-set-01",
      "criterionId": "r023",
      "sourceRuleId": "R023",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-003",
        "SRC-004"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rule-set-01",
      "criterionId": "r024",
      "sourceRuleId": "R024",
      "srcIds": [
        "SRC-005"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rule-set-01",
      "criterionId": "r025",
      "sourceRuleId": "R025",
      "srcIds": [
        "SRC-003",
        "SRC-004",
        "SRC-005"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rule-set-01",
      "criterionId": "r026",
      "sourceRuleId": "R026",
      "srcIds": [
        "SRC-003",
        "SRC-008"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rule-set-01",
      "criterionId": "r027",
      "sourceRuleId": "R027",
      "srcIds": [
        "SRC-002",
        "SRC-003",
        "SRC-004"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rule-set-01",
      "criterionId": "r028",
      "sourceRuleId": "R028",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-003",
        "SRC-004"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rule-set-01",
      "criterionId": "r029",
      "sourceRuleId": "R029",
      "srcIds": [
        "SRC-002",
        "SRC-003"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rule-set-01",
      "criterionId": "r030",
      "sourceRuleId": "R030",
      "srcIds": [
        "SRC-002",
        "SRC-003",
        "SRC-004"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rule-set-01",
      "criterionId": "r031",
      "sourceRuleId": "R031",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-003",
        "SRC-004"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rule-set-01",
      "criterionId": "r032",
      "sourceRuleId": "R032",
      "srcIds": [
        "SRC-001",
        "SRC-010",
        "SRC-015"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rule-set-01",
      "criterionId": "r033",
      "sourceRuleId": "R033",
      "srcIds": [
        "SRC-001",
        "SRC-010",
        "SRC-015"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rule-set-01",
      "criterionId": "r034",
      "sourceRuleId": "R034",
      "srcIds": [
        "SRC-001",
        "SRC-010",
        "SRC-015"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rule-set-01",
      "criterionId": "r035",
      "sourceRuleId": "R035",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rule-set-01",
      "criterionId": "r036",
      "sourceRuleId": "R036",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "UNCONFIRMED"
    }
  ]
} as const
