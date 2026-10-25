import type { TemplateVersion } from '@profer/shared'

/** V3-native, non-official R02 research template. Policy-sensitive checks stay manual. */
export const templateVersion: TemplateVersion = {
  "templateId": "S01-T07",
  "version": 1,
  "schemaVersion": 2,
  "name": "降级、留级和年级编入变更审核",
  "description": "本地研究模板 · 非校方正式模板。将研究原件中的事实预审、材料核验和人工复核要求转为 V3 检查项；不得替代学校现行制度、授权审批或学籍写入。",
  "catalogKind": "builtin",
  "sourceNote": "R02_RESEARCH_TEMPLATE_NONOFFICIAL: S01-T07 为独立研究交接稿，非成都理工大学校方正式模板；政策证据状态为 PARTIAL，最终决定与学籍变更须由有权人员人工完成。",
  "objectType": "person",
  "displayName": {
    "template": "S01-T07 · {{f001}}"
  },
  "fields": [
    {
      "key": "f001",
      "label": "F001 · 唯一案卷号及学校业务关联号",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "F001；string；Case：唯一案卷号及学校业务关联号；P0；可信 Main/Case 生成，M016；内；取，不得以文件名代案号"
    },
    {
      "key": "f002",
      "label": "F002 · 情形 A–J、当前阶段、建立/阶段更新时间",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "F002；enum+datetime；Case：情形 A–J、当前阶段、建立/阶段更新时间；P0；业务状态事件，M016；内；取，阶段不明不得推断已获批"
    },
    {
      "key": "f003",
      "label": "F003 · 经核验的操作者身份、发起岗位及代表关系",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "F003；actor-ref；Student/Case：经核验的操作者身份、发起岗位及代表关系；P0；服务端校方认证、授权台账，M001/M016；个；取/冲，Renderer 自填不可信"
    },
    {
      "key": "f004",
      "label": "F004 · 校方唯一学号/在籍主键",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "F004；string；Student：校方唯一学号/在籍主键；P0；学籍主数据，M001；个；取/冲，禁止凭 OCR 名称合并案卷"
    },
    {
      "key": "f005",
      "label": "F005 · 学籍登记姓名及历史变更引用",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "F005；string；Student：学籍登记姓名及历史变更引用；P0；权威学生主档，M001；个；取/冲，姓名变更转 G01"
    },
    {
      "key": "f006",
      "label": "F006 · 在籍状态、学历教育学段/类型",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "F006；enum；Enrollment：在籍状态、学历教育学段/类型；P0；学籍主数据，M001/M003；SRC-001/002；个；取/策，状态未知阻断阈值分流"
    },
    {
      "key": "f007",
      "label": "F007 · 普通本科/来华留学本科/中外合作/研究生等制度身份",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "F007；enum；Student/Policy：普通本科/来华留学本科/中外合作/研究生等制度身份；P0；招生/学籍权威分类，M001/M017；SRC-001/002/009；个；取/策，不能依据国籍或自选下结论"
    },
    {
      "key": "f008",
      "label": "F008 · 所属学院、校区及业务归口",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "F008；string/ref；Enrollment：所属学院、校区及业务归口；P0；组织学籍主档，M001/M003；SRC-006；个；取/冲，校区办理不推定终审权"
    },
    {
      "key": "f009",
      "label": "F009 · 当前专业、培养方案 ID 与版本",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "F009；ref+version；AcademicSnapshot：当前专业、培养方案 ID 与版本；P0；培养方案权威发布与学籍关联，M003/M013；SRC-001 第 18 条；敏；取/冲，不可使用其他年级方案分母"
    },
    {
      "key": "f010",
      "label": "F010 · 申请/触发时正式在册年级及班级",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "F010；string/ref；Enrollment：申请/触发时正式在册年级及班级；P0；学籍版本记录，M003；个；取/冲，不由入学年直接猜定"
    },
    {
      "key": "f011",
      "label": "F011 · 考核学年、统计截点及所属批次",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "F011；academic-period；AcademicSnapshot：考核学年、统计截点及所属批次；P1；教务成绩批次、年级办理通知，M003/M004；敏；取/策，未核日期不得补造截止"
    },
    {
      "key": "f012",
      "label": "F012 · 学生降级申请/学校晋级限制/相邻决定协同/疑似留级等触发类型",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "F012；enum；Request：学生降级申请/学校晋级限制/相邻决定协同/疑似留级等触发类型；P1；可信受理事件/业务部门触发，M002/M016；内；取/策，类型不足先分流"
    },
    {
      "key": "f013",
      "label": "F013 · 申请理由、本人意思表示、提交时间",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "F013；text+datetime；Request：申请理由、本人意思表示、提交时间；P1，仅 A/D/E；可信认证提交或核实签名材料，M002；SRC-001/002；敏；适用学生申请才补；B/C/F 不要求"
    },
    {
      "key": "f014",
      "label": "F014 · 代办者及有效授权证明（如允许）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "F014；actor-ref+authorization；Request：代办者及有效授权证明（如允许）；P1 条件；校方确认的代理规则及授权，M001/M002；个；策/冲，不得默认亲属、辅导员有代理权"
    },
    {
      "key": "f015",
      "label": "F015 · 适用校本规章版本、发布/生效/废止及解释机关",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "F015；ref+validity-interval；Policy：适用校本规章版本、发布/生效/废止及解释机关；P0；正式法规库/原始文件，M006/M017，SRC-001/002/009；公；策，仅公告索引不证明现行性"
    },
    {
      "key": "f016",
      "label": "F016 · 首次入学日、学制、制度最长修业期限",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "F016；date+duration；Enrollment：首次入学日、学制、制度最长修业期限；P1；学籍与校本学制配置，M003/M007；SRC-001 第 8–9、43 条；个；取/策，不得按自然年机械推算"
    },
    {
      "key": "f017",
      "label": "F017 · 按校本口径计入修业年限的期间及余量",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "F017；duration+method-ref；Enrollment：按校本口径计入修业年限的期间及余量；P1；权威异动历史与校方计时口径，M007；个；取/策，休学/入伍期间不得自行加减"
    },
    {
      "key": "f018",
      "label": "F018 · 核验学年应获学分基数",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "F018；decimal+unit；AcademicSnapshot：核验学年应获学分基数；P1；教务统计与有效培养方案，M004/M013；SRC-001 第 43 条；敏；取/冲，须记录免修及变更口径"
    },
    {
      "key": "f019",
      "label": "F019 · 同学年实获有效学分",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "F019；decimal+unit；AcademicSnapshot：同学年实获有效学分；P1；教务成绩版本，M004；敏；取/冲，待复核成绩不得自动计入"
    },
    {
      "key": "f020",
      "label": "F020 · F019/F018 的可复核比率",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "F020；decimal+formula-version；AcademicSnapshot：F019/F018 的可复核比率；P1；仅在 F018/F019 与公式口径确定后派生，M004/M006；敏；取/策，分母 0 或缺失不计算；计算不等于审批"
    },
    {
      "key": "f021",
      "label": "F021 · 截至核验日累计合格学分",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "F021；decimal+unit；AcademicSnapshot：截至核验日累计合格学分；P1/C；教务权威累计记录，M004；SRC-001 第 43 条；敏；取/冲，跨方案重复计分需复核"
    },
    {
      "key": "f022",
      "label": "F022 · 适用毕业要求总学分",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "F022；decimal+plan-version；AcademicSnapshot：适用毕业要求总学分；P1/C；培养方案权威版本，M003/M013；敏；取/冲，转专业后应核目标方案"
    },
    {
      "key": "f023",
      "label": "F023 · F021/F022 毕业学分占比",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "F023；decimal+formula-version；AcademicSnapshot：F021/F022 毕业学分占比；P1/C；权威分子分母核验后派生，M004/M013；敏；取/策，仅为晋级事实提示"
    },
    {
      "key": "f024",
      "label": "F024 · 既有试读次数/起止及历史版本",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "F024；integer+period-list；Enrollment：既有试读次数/起止及历史版本；P1；学院/学籍处理台账，M005；SRC-001/002 相应试读条；敏；取/冲，不根据一份旧通知计数"
    },
    {
      "key": "f025",
      "label": "F025 · 学业预警、试读、拟退学/退学的正式状态",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "F025；enum+decision-ref；Enrollment：学业预警、试读、拟退学/退学的正式状态；P1；权限部门记录，M005；SRC-001 第 43–45 条；敏；取/人，不得由计算值直接生成处理状态"
    },
    {
      "key": "f026",
      "label": "F026 · 申请人意向目标年级或校方拟编入方案",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "F026；string/ref；Request：申请人意向目标年级或校方拟编入方案；P1 申请条件/P2；本人申请或有权草案，M002/M009；个；候/人，意向不等于正式编入年级"
    },
    {
      "key": "f027",
      "label": "F027 · 目标培养方案与已修课程映射草案/确认结果",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "F027；plan-map-ref+version；Enrollment：目标培养方案与已修课程映射草案/确认结果；P2 条件，P4 正式；校方教学管理记录，M009/M013；SRC-001 第 18 条；敏；候/取/人，新专业决定前不可假定结果"
    },
    {
      "key": "f028",
      "label": "F028 · 学院审核意见、签发岗位、时间及范围",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "F028；signed-opinion-ref；Decision：学院审核意见、签发岗位、时间及范围；P2；校方授权审批流与学院原件，M010；SRC-001/002；敏；P1候，P2 应有而无则取/补"
    },
    {
      "key": "f029",
      "label": "F029 · 最终审批岗位、权限期间和业务范围",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "F029；authorized-actor-ref；Decision：最终审批岗位、权限期间和业务范围；P3；校方岗位权限库/公文系统，M011；SRC-001/002；内；P1/P2候；越权冲/人"
    },
    {
      "key": "f030",
      "label": "F030 · 正式准驳文书、文号、签发/生效时间及结论",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "F030；signed-decision-ref；Decision：正式准驳文书、文号、签发/生效时间及结论；P3；教务处或国际交流与合作处权威公文，M011；SRC-001/002；敏；P1/P2候；P3 仅可信公文核实"
    },
    {
      "key": "f031",
      "label": "F031 · 生效后正式目标年级/班级及适用学年",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "F031；string/ref；Enrollment：生效后正式目标年级/班级及适用学年；P4；学籍权威更新，M012；个；P1–P3候，决策与记录不符冲"
    },
    {
      "key": "f032",
      "label": "F032 · 正式学籍记载变更号/生效流水",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "F032；version+event-ref；Enrollment：正式学籍记载变更号/生效流水；P4；权威学籍记录，M012；SRC-001 第 57 条；个；P1–P3候；P4 无对应记录取"
    },
    {
      "key": "f033",
      "label": "F033 · 复学、转专业、转学等相邻事项已生效决定引用",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "F033；decision-ref+authority；Case：复学、转专业、转学等相邻事项已生效决定引用；P1/F、E 按事件；相邻权威业务决定，M008；敏；没有此复合事项则不适用；有则取/冲"
    },
    {
      "key": "f034",
      "label": "F034 · Remedy",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "F034；enum+request-ref；Remedy：撤回请求、事实复核、正式申诉及处理状态；P5 或决定前事件；申诉/原受理系统，M014/M015；SRC-001 第 59 条，SRC-002 第 70 条；敏；无请求则候；有则需核授权及类型"
    },
    {
      "key": "f035",
      "label": "F035 · 提交、补件通知、送达、决定、异议及期限节点",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "F035；datetime-set；Remedy/Case：提交、补件通知、送达、决定、异议及期限节点；P1–P5 按事件；带签名/回执的校方流程记录，M002/M014/M015/M016；敏；取/策，无现行期限依据不倒推逾期"
    },
    {
      "key": "f036",
      "label": "F036 · 材料哈希、持有人、签发者、来源记录版本/归属案卷",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "F036；evidence-provenance-list；Evidence：材料哈希、持有人、签发者、来源记录版本/归属案卷；P0 起贯穿；可信材料库与官方来源，M016；内；取/冲，禁止跨学生/跨案误复用"
    },
    {
      "key": "f037",
      "label": "F037 · 事实冲突、旧版本失效关联和人工处置结果",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "F037；conflict-resolution-log；Evidence：事实冲突、旧版本失效关联和人工处置结果；P1 起按需；有审计证据的处理记录，M016；内；未处置冲突不得PASS_FACT"
    },
    {
      "key": "f038",
      "label": "F038 · 特殊身份/校区适用例外及现行性确认状态",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "F038；enum+policy-ref；Policy/Student：特殊身份/校区适用例外及现行性确认状态；P0；归口部门正式适用意见，M017/M006；SRC-006/007/009/010；个；策/人，特殊分支默认阻断普通本科阈值"
    }
  ],
  "materialSlots": [
    {
      "id": "m001",
      "name": "认证申请/办理人及学生身份分类",
      "purpose": "认证申请/办理人及学生身份分类；学校认证服务、学籍主管部门持有的学号、姓名、身份、学院、学段记录；有权部门核签的学籍证明可供人工核查，普通自述不替代服务端登录；F003–F008、SRC-001/002；按学号+案卷隔离、附认证时点；来源失联SOURCE_UNAVAILABLE，身份冲突CONFLICT，图像不可读UNREADABLE",
      "requiredElements": [
        "认证申请/办理人及学生身份分类；学校认证服务、学籍主管部门持有的学号、姓名、身份、学院、学段记录",
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
      "id": "m002",
      "name": "降级试读的学生本人申请意思表示",
      "purpose": "降级试读的学生本人申请意思表示；本人或经确认的合法代理持有，现用签署申请表/可信电子提交记录；若校方接受，已验证电子业务申请可替代纸质扫描；未核实允许何种代办/签名；F012–F014/F026/F035、SRC-001/002/005；绑定提交人、时间、案卷版本，申请修订保留旧版；适用但未交NEEDS_MATERIAL，模糊签名UNREADABLE，来源身份不匹配CONFLICT",
      "requiredElements": [
        "降级试读的学生本人申请意思表示；本人或经确认的合法代理持有，现用签署申请表/可信电子提交记录",
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
      "id": "m003",
      "name": "原在籍状态、专业、年级、学年与培养方案基础关联",
      "purpose": "原在籍状态、专业、年级、学年与培养方案基础关联；学校学籍/教务主档持有；校方盖章或可核验电子学籍证明可供人工核对；非个人自制成绩表；F006/F008–F011/F016、SRC-001/002；固定读取截点及主档版本；失联SOURCE_UNAVAILABLE，跨版不一CONFLICT，截图不清UNREADABLE",
      "requiredElements": [
        "原在籍状态、专业、年级、学年与培养方案基础关联；学校学籍/教务主档持有",
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
      "name": "学年应修/实获学分、累计学分及统计时点",
      "purpose": "学年应修/实获学分、累计学分及统计时点；教务部门成绩/学分权威快照；带真伪核验及版本的学校成绩单可作人工核对，但学生截图不足以覆盖权威记录；F011/F018–F023、SRC-001 第 43 条、SRC-002 第 40 条；绑定学年、方案、学分算法与成绩版本；失联SOURCE_UNAVAILABLE，扫描不清UNREADABLE，数值矛盾CONFLICT",
      "requiredElements": [
        "学年应修/实获学分、累计学分及统计时点；教务部门成绩/学分权威快照",
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
      "name": "既往试读、学业警示、拟处理状态及试读期间",
      "purpose": "既往试读、学业警示、拟处理状态及试读期间；学院/学籍主管部门所持正式决定台账；权威归档公文与有效状态台账交叉核验；不能由模型通过分数推导已有试读；F024/F025、SRC-001/002；按决定号+生效/撤销记录复核；不可得SOURCE_UNAVAILABLE，重复冲突CONFLICT，影印不清UNREADABLE",
      "requiredElements": [
        "既往试读、学业警示、拟处理状态及试读期间；学院/学籍主管部门所持正式决定台账",
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
      "name": "支撑身份分支、触发与权限的正式政策文本/现行版本",
      "purpose": "支撑身份分支、触发与权限的正式政策文本/现行版本；学校正式发文与法规管理部门持有；带签发/生效信息的官方全文、主管部门正式确认可互证；搜索摘要不可替代正文；F015/F020/F038、SRC-001/002/003/009；固定政策哈希、适用日期及失效依据；无法核时POLICY_UNCONFIRMED，网址失联兼记SOURCE_UNAVAILABLE",
      "requiredElements": [
        "支撑身份分支、触发与权限的正式政策文本/现行版本；学校正式发文与法规管理部门持有",
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
      "name": "学制、最长修业年限、异动起止及计入期间",
      "purpose": "学制、最长修业年限、异动起止及计入期间；学籍主管部门所持年限记录；经核验的校方异动时间轴可替代学生上传的历史证明，具体计时公式须校方核定；F016/F017、SRC-001 第 8–9、43 条；与 M003 同学生及时间轴版本；中断历史不全SOURCE_UNAVAILABLE，计算口径未定POLICY_UNCONFIRMED",
      "requiredElements": [
        "学制、最长修业年限、异动起止及计入期间；学籍主管部门所持年限记录",
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
      "name": "证明复学、转学、转专业、保留资格等其他授权目的的有效决定",
      "purpose": "证明复学、转学、转专业、保留资格等其他授权目的的有效决定；相邻业务 Owner/公文系统持有；可验证的原业务决定记录+状态比对；仅意向申请或待批草稿不能替代；F033、SRC-001 第 5、34–40 条及邻接业务 SRC 待补；引用原决定号、业务 Owner、有效/撤销版本，不跨案拷贝结论；缺现成决定SOURCE_UNAVAILABLE 或暂停协同，签发冲突CONFLICT",
      "requiredElements": [
        "证明复学、转学、转专业、保留资格等其他授权目的的有效决定；相邻业务 Owner/公文系统持有",
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
      "name": "目标年级/班级建议、课程衔接草案",
      "purpose": "目标年级/班级建议、课程衔接草案；学院教务/教学管理岗位形成，非学生必须预交；可由校内系统编班草案及培养方案映射替代纸质表；F026/F027、SRC-001 第 18 条、SRC-002 第 20 条；标“草案”，绑定方案版本及提议人；尚未形成候，无授权安排NEEDS_HUMAN_DECISION，冲突CONFLICT",
      "requiredElements": [
        "目标年级/班级建议、课程衔接草案；学院教务/教学管理岗位形成，非学生必须预交",
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
      "name": "学院正式核验/审核意见及签发真实性",
      "purpose": "学院正式核验/审核意见及签发真实性；学院具授权的业务人员产生；校方可信流转意见/盖章核验件，不能用学生代写意见替代；F028、SRC-001 第 43 条、SRC-002 第 40 条；按受理号、学院角色、意见签发时间/版本；P1 缺失正常，P2 未取SOURCE_UNAVAILABLE，假冒/矛盾CONFLICT",
      "requiredElements": [
        "学院正式核验/审核意见及签发真实性；学院具授权的业务人员产生",
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
      "name": "审批岗位授权及正式准驳文书",
      "purpose": "审批岗位授权及正式准驳文书；普通本科教务处或来华留学本科国际交流与合作处授权岗位/公文系统产生；可核验带文号的官方电子公文或正式纸质原件核签；AI 输出或学院意见不替代；F029/F030、SRC-001 第 43 条、SRC-002 第 40 条；绑定政策版本、签发岗、文号、生效日、撤销状态；P1/P2 缺失正常；越权CONFLICT，P3 不能核实SOURCE_UNAVAILABLE",
      "requiredElements": [
        "审批岗位授权及正式准驳文书；普通本科教务处或来华留学本科国际交流与合作处授权岗位/公文系统产生",
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
      "name": "生效后年级、班级、学籍异动实际落库记录",
      "purpose": "生效后年级、班级、学籍异动实际落库记录；学籍管理权威数据库持有；经教务处/归口部门认证的异动办理证明，可作人工对账；F031/F032、SRC-001 第 57 条；关联 M011 决定号及异动版本；决定未作出前正常空值，决定后登记不符CONFLICT，未完成标执行待办",
      "requiredElements": [
        "生效后年级、班级、学籍异动实际落库记录；学籍管理权威数据库持有",
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
      "name": "因年级/专业调整引出的培养方案变更、课程学分认定结果",
      "purpose": "因年级/专业调整引出的培养方案变更、课程学分认定结果；专业/学院及成绩主管部门持有；已授权的成绩认定决定及方案版本，不接受学生私制课程对照；F009/F022/F027、SRC-001 第 18 条、SRC-002 第 20 条；有草案与正式版两层，按原课程+新方案版本追溯；未触发则NOT_APPLICABLE，已触发未定NEEDS_HUMAN_DECISION",
      "requiredElements": [
        "因年级/专业调整引出的培养方案变更、课程学分认定结果；专业/学院及成绩主管部门持有",
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
      "name": "申请撤回、事实复核、正式申诉的真实意思表示与受理状态",
      "purpose": "申请撤回、事实复核、正式申诉的真实意思表示与受理状态；当事人与有权受理机构各存记录；校方认证电子提交/受理回执可代纸件，前提是现行程序允许；F034/F035、SRC-001 第 59 条、SRC-002 第 70 条；绑定原决定/申请与送达事件；无提出不缺；已提出无法读UNREADABLE，期限规则未知POLICY_UNCONFIRMED",
      "requiredElements": [
        "申请撤回、事实复核、正式申诉的真实意思表示与受理状态；当事人与有权受理机构各存记录",
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
      "name": "通知、送达、异议受理回执和实际通知时间",
      "purpose": "通知、送达、异议受理回执和实际通知时间；正式通知机构持有；校方公文送达系统记录、纸质签收凭证互核，不能用聊天截图断言法定送达；F034/F035、SRC-001/002；与决定号、受送达人及送达渠道绑定；无通知节点不得推定逾期，受理机构失联SOURCE_UNAVAILABLE",
      "requiredElements": [
        "通知、送达、异议受理回执和实际通知时间；正式通知机构持有",
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
      "name": "案卷、证据版本/哈希/来源、冲突处置、撤销链与审计事件",
      "purpose": "案卷、证据版本/哈希/来源、冲突处置、撤销链与审计事件；可信 Main/Case/Evidence 服务持有；不允许以客户端自由文本替代；可由可信审计事件导出供核查；F001/F002/F003/F012/F035–F037；每项材料归属单一案卷与主体、可追溯取代关系；缺关联暂停结论，异常CONFLICT，取不到SOURCE_UNAVAILABLE",
      "requiredElements": [
        "案卷、证据版本/哈希/来源、冲突处置、撤销链与审计事件；可信 Main/Case/Evidence 服务持有",
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
      "name": "证明适用特殊学段、合作办学新规、宜宾校区授权的正式政策归属与适用意见",
      "purpose": "证明适用特殊学段、合作办学新规、宜宾校区授权的正式政策归属与适用意见；主管部门/法规库持有；学校发布的专门办法全文+签发/有效期或归口部门正式书面回复；不得要求学生自行获取内部政策；F007/F015/F038、SRC-006/007/009/010；按身份、校区、时间、政策版本核对；无规章 POLICY_UNCONFIRMED，页面失联SOURCE_UNAVAILABLE，相互冲突CONFLICT",
      "requiredElements": [
        "证明适用特殊学段、合作办学新规、宜宾校区授权的正式政策归属与适用意见；主管部门/法规库持有",
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
      "id": "rule-set-03",
      "name": "08.2 连续事实规则（每行 T/F/U 表示 predicate 真/假/未知的处理）",
      "order": 0,
      "required": true,
      "criteria": [
        {
          "id": "r001",
          "title": "R001｜案卷唯一性；A–J，P0/P5",
          "requirement": "研究原件第08章的候选事实预审要求（非校方正式政策）：R001 案卷唯一性；A–J，P0/P5；T：F001/F002 对应同一异动事件；F：不同案卷/学年或重复引用；U：案卷号缺；SRC-001/002 业务范围（编号机制为设计约束）；F001/F002/F011/F036；M003/M016 L1；以实际事件日及案卷版本比对；允许同一学生不同事件有不同案卷；T PASS_FACT；F CONFLICT；U SOURCE_UNAVAILABLE；可信 Case Owner 校核/归档",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r002",
          "title": "R002｜实名/身份绑定；A–J，P0",
          "requirement": "研究原件第08章的候选事实预审要求（非校方正式政策）：R002 实名/身份绑定；A–J，P0；T：认证 Actor、学号、学籍姓名及案卷归属相符；F：不一致或身份冒用迹象；U：认证/主档不可取；SRC-001 第 53、57 条，SRC-002 第 48 条；F003–F005/F036；M001/M016 L1；有效更名通过 G01 引用，不以名称字符串为唯一键；T PASS_FACT；F CONFLICT；U SOURCE_UNAVAILABLE；身份归口/可信 Main，疑似更名转 G01",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r003",
          "title": "R003｜学段身份与归口；A–J，P0",
          "requirement": "研究原件第08章的候选事实预审要求（非校方正式政策）：R003 学段身份与归口；A–J，P0；T：主档分类明确普通本科/来华留学本科等且学院校区一致；F：案卷声明与主档不符；U：身份/在籍状态未核；SRC-001 第 2 条，SRC-002 第 3、71 条，SRC-006/007/009 仅线索；F006–F008/F038；M001/M003/M017 L1；特殊身份不能凭国籍自行判断；T PASS_FACT；F CONFLICT；U 权威源缺 SOURCE_UNAVAILABLE/适用法不明 POLICY_UNCONFIRMED；学籍/国际交流与合作处/研究生院",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r004",
          "title": "R004｜生效法源；A–J，P0及每次判断前",
          "requirement": "研究原件第08章的候选事实预审要求（非校方正式政策）：R004 生效法源；A–J，P0及每次判断前；T：有匹配身份、事项、日期的现行全文；F：给定文本明确废止/不适用；U：修订、生效日或全文不明；SRC-001 第 60–62 条，SRC-002 第 72 条，SRC-003/004/009/010；F015/F038；M006/M017 L1；会议审定不等于新规实施；T PASS_FACT；F/U POLICY_UNCONFIRMED（若明确不适用由 R005 分流）；法规归口部门/教务处/国际交流与合作处；不能自动用旧规",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r005",
          "title": "R005｜本案真实触发与分流；A–J，P1",
          "requirement": "研究原件第08章的候选事实预审要求（非校方正式政策）：R005 本案真实触发与分流；A–J，P1；T：确有独立年级变更或可申请的降级试读；F：仅同级试读/成绩复核/延期等邻接目的；U：受理事项含糊；SRC-001 第 5、18、34–45 条，SRC-002 第 31–40 条，SRC-003 第 15 条；F002/F012/F033；M002/M008/M016 L1/L2；B 仅分流，不生成独立决定；T PASS_FACT；F NOT_APPLICABLE 并准确路由；U NEEDS_HUMAN_DECISION；受理学院/归口学籍管理岗",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r006",
          "title": "R006｜本人申请及代理权；A/D/E P1，其余不适用",
          "requirement": "研究原件第08章的候选事实预审要求（非校方正式政策）：R006 本人申请及代理权；A/D/E P1，其余不适用；T：本人自愿提交的有效申请能关联 F004；F：提交者不是本人且无已确认合法授权；U：申请缺失/表单不可读/代理规则未知；SRC-001 第 43 条、SRC-002 第 40 条，SRC-005 表单待核；F003/F013/F014/F035；M001/M002 L1/L2，申请时间为准；B/C/F 不必申请；T PASS_FACT；F CONFLICT；U 按原因 NEEDS_MATERIAL/UNREADABLE/POLICY_UNCONFIRMED；本人补交或学院核代理",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r007",
          "title": "R007｜原学籍年级和方案；A/C/D/E/F，P1",
          "requirement": "研究原件第08章的候选事实预审要求（非校方正式政策）：R007 原学籍年级和方案；A/C/D/E/F，P1；T：F009/F010 与主档同一有效版本/学年；F：申请意向/旧版与学籍记录矛盾；U：原值未取；SRC-001 第 18、57 条，SRC-002 第 20 条；F009–F011；M003/M013 L1；转专业未决时不把草案当已生效方案；T PASS_FACT；F CONFLICT；U SOURCE_UNAVAILABLE；学籍/教学管理岗",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r008",
          "title": "R008｜成绩快照可比较性；A–E，P1/P2",
          "requirement": "研究原件第08章的候选事实预审要求（非校方正式政策）：R008 成绩快照可比较性；A–E，P1/P2；T：同一学年/方案/统计截点，应修与实获学分口径可追溯；F：跨版本、重复计数、截点冲突；U：教务快照无来源或无法读取；SRC-001 第 18、43 条、SRC-002 第 20、40 条；F009/F011/F018/F019/F021/F022；M003/M004/M013 L1；不能把未生效复核成绩混入；T PASS_FACT；F CONFLICT；U 权威源 SOURCE_UNAVAILABLE、无法识读 UNREADABLE；教务成绩 Owner",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r009",
          "title": "R009｜学年学分比例事实；A/B/D/E，P1/P2",
          "requirement": "研究原件第08章的候选事实预审要求（非校方正式政策）：R009 学年学分比例事实；A/B/D/E，P1/P2；T：F020 确由同源 F019/F018 按可信公式精确得出，同时记录 <1/2、<1/3 两个比较布尔值；F：比率计算与原分子分母不符；U：分母、算法、现行政策未知；SRC-001 第 43 条、SRC-002 第 40 条；F011/F015/F018–F020；M004/M006/M013 L1；先过 R004/R008，1/2 与 1/3 用精确有理数比较，不四舍五入作界点；试读期满情况另以具体期间核实；T PASS_FACT+两个明示布尔观察值；F CONFLICT；U SOURCE_UNAVAILABLE/POLICY_UNCONFIRMED；学院学业岗；绝不自动形成试读/退学决定",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r010",
          "title": "R010｜毕业年级 70% 事实；C（A/D/E 遇晋级才触发）P1",
          "requirement": "研究原件第08章的候选事实预审要求（非校方正式政策）：R010 毕业年级 70% 事实；C（A/D/E 遇晋级才触发）P1；T：F021/F022 确证 =70%；U：培养方案毕业分母、累计成绩或适用日不明；SRC-001 第 43 条、SRC-002 第 40 条；F009/F011/F015/F021–F023；M003/M004/M006/M013 L1；严格 <，等于 70% 为 F，但 F 不等于学校必须准予晋级；T/F PASS_FACT+比较值；U CONFLICT/SOURCE_UNAVAILABLE/POLICY_UNCONFIRMED；教务学籍岗核晋级事实，编入决定交有权人员",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "r011",
          "title": "R011｜既往试读/学业处理事实；A/B/D/E，P1",
          "requirement": "研究原件第08章的候选事实预审要求（非校方正式政策）：R011 既往试读/学业处理事实；A/B/D/E，P1；T：历史决定、次数、时长与当前状态一致；F：案卷声称“首次试读”但权威台账反证；U：原决定/撤销状态不明；SRC-001 第 43–45 条、SRC-002 第 40–42 条；F024/F025；M005 L1；原则上只能一次及“一年”须在现行制度和例外意见下人工解释；T PASS_FACT；F CONFLICT；U SOURCE_UNAVAILABLE；学院/原决定机关，次数例外 NEEDS_HUMAN_DECISION",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r012",
          "title": "R012｜最长修业年限事实；A/D/E，F 条件，P1",
          "requirement": "研究原件第08章的候选事实预审要求（非校方正式政策）：R012 最长修业年限事实；A/D/E，F 条件，P1；T：按有权部门确认的计时公式仍在允许年限；F：权威时间轴显示不在；U：休学/保留/入伍计入规则未知；SRC-001 第 8–9、39、43 条，SRC-002 第 35、40 条；F016/F017；M003/M007 L1；不以系统日期直接减入学日期；身份分支区别计时；T/F PASS_FACT+年限观察值，F 不代替退学决定；U POLICY_UNCONFIRMED/SOURCE_UNAVAILABLE；教务/国际交流与合作处核定",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r013",
          "title": "R013｜降级试读申请事实前提集合；A/D/E P1/P2",
          "requirement": "研究原件第08章的候选事实预审要求（非校方正式政策）：R013 降级试读申请事实前提集合；A/D/E P1/P2；T：R006/R009/R011/R012 有效且校本相应触发事实已查明；F：关键事实确证不属于该申请情形；U：任一前置事实未定；SRC-001 第 43 条、SRC-002 第 40 条；F012/F013/F017/F020/F024/F025；M002/M004/M005/M006/M007 L1/L2；“可申请”仅构成交人工审查的事实前提；T PASS_FACT（可移交）；F PASS_FACT+preconditionMet=false并由学院人工解释；U 传递前置缺口；最后始终 NEEDS_HUMAN_DECISION 待有权批准",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r014",
          "title": "R014｜无年级变更的一般试读；B P1",
          "requirement": "研究原件第08章的候选事实预审要求（非校方正式政策）：R014 无年级变更的一般试读；B P1；T：同级试读且无独立年级调整；F：另有真实降级申请/编入目的；U：试读类型混合；SRC-001 第 43 条、SRC-002 第 40 条；F010/F012/F025；M003/M005/M016 L1；本模板不生成 B 的试读批准；T NOT_APPLICABLE 并转试读 Owner；F PASS_FACT 重新归 A/D/E/F；U NEEDS_HUMAN_DECISION；学院业务路由岗",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r015",
          "title": "R015｜留级/研究生/中外合作政策门禁；G/H/J，P0/P1",
          "requirement": "研究原件第08章的候选事实预审要求（非校方正式政策）：R015 留级/研究生/中外合作政策门禁；G/H/J，P0/P1；T：已有专门有效授权、身份和程序证据；F：校方明示不适用本事项；U：只有上位授权/会议/旧规索引；SRC-003 第 15 条、SRC-007/009/010（有效实体正文未取得）；F007/F015/F038；M001/M006/M017；目前真实材料只能得 U；T 待逐条研究并人工转入对应情形（本轮不得宣称）；F NOT_APPLICABLE；U POLICY_UNCONFIRMED；教务处/研究生院/合作办学主管部门",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r016",
          "title": "R016｜相邻决定真实性；E 已有专业决定时/F，P1/P2",
          "requirement": "研究原件第08章的候选事实预审要求（非校方正式政策）：R016 相邻决定真实性；E 已有专业决定时/F，P1/P2；T：原授权业务已形成与同一主体匹配的生效决定；F：原决定被撤销、不同人或待批冒充已批；U：Owner 无法核实；SRC-001 第 5、34–40 条、SRC-002 第 31–37 条；F004/F033/F036；M008/M016 L1；不强求 E 首次申请时已有未来转专业批文；T PASS_FACT（仅引用）；F CONFLICT；U SOURCE_UNAVAILABLE，有未决申请则“等待相邻决定”非材料缺失；原 Owner/学院",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r017",
          "title": "R017｜目标年级草案真实性；A/C/D/E/F，P2 条件",
          "requirement": "研究原件第08章的候选事实预审要求（非校方正式政策）：R017 目标年级草案真实性；A/C/D/E/F，P2 条件；T：F026 是可追溯学院方案且明确“待决定”；F：把申请意向/模型推断填为权威目标；U：学校尚未提出方案或权限未知；SRC-001 第 18、43 条、SRC-002 第 20、40 条；F026/F027；M002/M009 L2 草案；P1 不要求 M009；T PASS_FACT 仅草案完整；F CONFLICT；U NEEDS_HUMAN_DECISION（P2）/P1 NOT_APPLICABLE；学院教学管理岗",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "r018",
          "title": "R018｜学院审核意见签发；A/D/E，P2",
          "requirement": "研究原件第08章的候选事实预审要求（非校方正式政策）：R018 学院审核意见签发；A/D/E，P2；T：学院具权岗位真实签发且案卷对应；F：越权、代签或跨案；U：P2 尚未核签；SRC-001 第 43 条、SRC-002 第 40 条；F028/F036；M010/M016 L1/L2；P1 一律不触发；T PASS_FACT（学院意见已形成，不代表最终批准）；F CONFLICT；U SOURCE_UNAVAILABLE；学院有权人员",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r019",
          "title": "R019｜最终审批主体权限；A/D/E，P3",
          "requirement": "研究原件第08章的候选事实预审要求（非校方正式政策）：R019 最终审批主体权限；A/D/E，P3；T：A 教务处，D/E 国际交流与合作处，且签发岗有现时权限；F：部门/岗位/时段不符；U：授权名册不可核；SRC-001 第 43 条、SRC-002 第 40 条；F007/F029/F030；M011 L1；校区受理岗不自动有签批权；T PASS_FACT（权限事实）；F CONFLICT；U SOURCE_UNAVAILABLE/NEEDS_HUMAN_DECISION；正式公文/人事权限 Owner",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r020",
          "title": "R020｜正式决定文书存在与效力；A/D/E，P3",
          "requirement": "研究原件第08章的候选事实预审要求（非校方正式政策）：R020 正式决定文书存在与效力；A/D/E，P3；T：文号、签发者、案卷、日期、效力状态在权威公文一致；F：伪造/撤销/与案卷冲突；U：无可核证公文；SRC-001 第 43 条、SRC-002 第 40 条；F030/F035/F036；M011/M016 L1；R019 先决，不能由 AI 写准驳决定；T PASS_FACT（仅确认公文事实，具体批准内容是校方决定对象）；F CONFLICT；U SOURCE_UNAVAILABLE；原审批发文机关",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r021",
          "title": "R021｜正式学籍落实对账；A/C/D/E/F 已有有效决定时 P4",
          "requirement": "研究原件第08章的候选事实预审要求（非校方正式政策）：R021 正式学籍落实对账；A/C/D/E/F 已有有效决定时 P4；T：学籍最新 F031/F032 与有效决定及人一致；F：年级/班级/生效日冲突；U：未入账/未取到变更；SRC-001 第 57 条、SRC-002 第 40 条为试读后续线索；F004/F010/F030–F032；M011/M012 L1；C/F 的独立编入授权未证，不得借 R020 写决策；T PASS_FACT（落实一致）；F CONFLICT；U SOURCE_UNAVAILABLE 或执行待办；学籍主档 Owner",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r022",
          "title": "R022｜培养方案/课程认定衔接；A/C/D/E/F 条件，P2 草案/P4 正式",
          "requirement": "研究原件第08章的候选事实预审要求（非校方正式政策）：R022 培养方案/课程认定衔接；A/C/D/E/F 条件，P2 草案/P4 正式；T：确有变更且正式认定结果与方案/课程版本一致；F：认定版错用或重复计学分；U：条件真实触发但尚未完成；SRC-001 第 18 条、SRC-002 第 20 条；F009/F022/F027；M009/M013；无方案变化时 trigger=false；T PASS_FACT；F CONFLICT；U NEEDS_HUMAN_DECISION/SOURCE_UNAVAILABLE；无变化 NOT_APPLICABLE；教务课程认定 Owner",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r023",
          "title": "R023｜正式通知/送达事实；A/D/E 有决定、B/退学仅原业务引用，P4/P5",
          "requirement": "研究原件第08章的候选事实预审要求（非校方正式政策）：R023 正式通知/送达事实；A/D/E 有决定、B/退学仅原业务引用，P4/P5；T：通知渠道、收件主体、时间与决定号可核；F：发给错人/通知与决定不符；U：送达事实无法证实；SRC-001 第 43、45 条，SRC-002 第 40、42 条；F030/F034/F035；M011/M015 L1；退学法定送达另循原决定业务，不用本案替代；T PASS_FACT；F CONFLICT；U SOURCE_UNAVAILABLE；原发文机关/送达岗",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r024",
          "title": "R024｜撤回/事实复核/正式申诉类型；I 发生事件时 P1–P5",
          "requirement": "研究原件第08章的候选事实预审要求（非校方正式政策）：R024 撤回/事实复核/正式申诉类型；I 发生事件时 P1–P5；T：申请人真实提出的救济类型与原案卷/决定相符；F：决定后把申诉当作撤回或不同主体代申诉；U：申请/受理身份未知；SRC-001 第 59 条、SRC-002 第 70 条；F003/F034/F035；M001/M014/M015 L1/L2；不假定撤回自动生效；T PASS_FACT（意思表示与路由）；F CONFLICT；U 真实提交缺 NEEDS_MATERIAL、不可读 UNREADABLE；原受理机关/申诉专门机构",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r025",
          "title": "R025｜救济期限与效力边界；I 发生事件时 P5",
          "requirement": "研究原件第08章的候选事实预审要求（非校方正式政策）：R025 救济期限与效力边界；I 发生事件时 P5；T：取得适用申诉规定、真实送达/提交时点且可计算；F：记录与实际送达冲突；U：法规/期限/送达时间不详；SRC-001 第 45、59 条引 2017 申诉办法；SRC-002 第 70 条引 2022 办法；F015/F034/F035；M006/M014/M015；两部被引规章正文均未获取；T 仅 PASS_FACT“时间数据可比较”，法定期限裁定仍须有权机关；F CONFLICT；U POLICY_UNCONFIRMED/SOURCE_UNAVAILABLE；申诉机关",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r026",
          "title": "R026｜材料归属与证据层级；A–J，任意材料入库时 P0–P5",
          "requirement": "研究原件第08章的候选事实预审要求（非校方正式政策）：R026 材料归属与证据层级；A–J，任意材料入库时 P0–P5；T：哈希/学号/案卷/学年/签发记录一致且层级标记清楚；F：跨案复用、证据身份错配或 L3 冒充 L1；U：版本来源缺；SRC-001/002 的原学籍记录授权背景（证据哈希为设计契约）；F001/F004/F011/F036/F037；M001–M017 按已触发材料，M016 内部台账；不可让学生承担内部版本记录；T PASS_FACT；F CONFLICT；U SOURCE_UNAVAILABLE；可信 Evidence/Case Owner",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r027",
          "title": "R027｜材料更新后的定向重审；I/任一有替换事件，P1–P5",
          "requirement": "研究原件第08章的候选事实预审要求（非校方正式政策）：R027 材料更新后的定向重审；I/任一有替换事件，P1–P5；T：旧材料版本与新版本差异、依赖 R、旧结论时点明确；F：新材料引用旧结论或越过独立正式决定；U：版本链不可取；SRC-001 第 43、57 条及 SRC-002 第 40 条为业务来源（定向无效化是设计契约）；F009/F011/F018–F023/F030/F036/F037；M004/M011/M013/M016；只重跑第 11 节依赖表中受影响 R；T PASS_FACT（重审链可追溯）；F CONFLICT；U SOURCE_UNAVAILABLE；Case Owner/事实来源部门，正式决定另交原机关复核",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r028",
          "title": "R028｜学校退学不利决定分流；A/D/E 中并存退学处理或 I 异议，P1–P5",
          "requirement": "研究原件第08章的候选事实预审要求（非校方正式政策）：R028 学校退学不利决定分流；A/D/E 中并存退学处理或 I 异议，P1–P5；T：已识别独立退学处理，并明确由原机关履行告知、申辩、合法性审查、会议决定和送达；F：本案 AI/学院意见冒充退学决定；U：处理状态或程序材料不明；SRC-001 第 44–45 条、SRC-002 第 41–42、66–67 条，SRC-003 第 55 条；F025/F030/F034；M005/M011/M014/M015；S01-T07 不评退学实体合法性；T PASS_FACT“已分流”；F CONFLICT；U NEEDS_HUMAN_DECISION；教务处/国际交流与合作处及原退学法定程序角色",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r029",
          "title": "R029｜当前证据可读性与阶段存在性；A–J，P0–P5",
          "requirement": "研究原件第08章的候选事实预审要求（非校方正式政策）：R029 当前证据可读性与阶段存在性；A–J，P0–P5；T：该阶段真实所需的材料有可读且有合法替代的来源；F：文件存在但 OCR/内容无法解释；U：该材料尚未产生或不可获得；SRC-005 表单版本不明、SRC-001/002 阶段依据；F002/F028–F032/F036；M001–M017 按 03.4/07.3 逐情形触发；未来阶段材料一律 trigger=false；T PASS_FACT；F UNREADABLE 并建议重新取清晰件；U 当前学生义务 NEEDS_MATERIAL、校方系统 SOURCE_UNAVAILABLE、未来阶段 NOT_APPLICABLE；对应持有人",
          "execution": "manual",
          "targetScope": "case"
        }
      ]
    }
  ],
  "policyVersionIds": [],
  "stages": [
    {
      "id": "precheck",
      "name": "受理前识别",
      "kind": "auto-check",
      "executorRole": "system",
      "nextStageId": "trigger",
      "workflowOwner": "local"
    },
    {
      "id": "trigger",
      "name": "学生申请或校内发起",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "fact-check",
      "workflowOwner": "local"
    },
    {
      "id": "fact-check",
      "name": "事实核验",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "returnToStageId": "trigger",
      "nextStageId": "unit-review",
      "workflowOwner": "local"
    },
    {
      "id": "unit-review",
      "name": "学院前置审核",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "returnToStageId": "fact-check",
      "nextStageId": "authorized-decision",
      "workflowOwner": "local"
    },
    {
      "id": "authorized-decision",
      "name": "有权人工决定",
      "kind": "manual-review",
      "executorRole": "teacher",
      "returnToStageId": "unit-review",
      "nextStageId": "effective-implementation",
      "workflowOwner": "local"
    },
    {
      "id": "effective-implementation",
      "name": "决定生效及落实",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "appeal-recheck",
      "workflowOwner": "local"
    },
    {
      "id": "appeal-recheck",
      "name": "撤回、复核、申诉与重审",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "skippableReason": "仅在撤回、复核、申诉或重审事件实际触发时进入，常规办理可跳过。",
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
  "templateId": "S01-T07",
  "name": "降级、留级和年级编入变更审核",
  "sourceDocumentPath": "docs/design/review-agent/business-templates/R02/S01-T07.md",
  "sourceDocumentSha256": "892612db7ae3650287f516ddc615ca4e454a69fda1ef5fecf0bc5faa932ec542",
  "sourceDocumentManifestBytes": 130242,
  "sourceDocumentGitBlobSha": "9cdcca509180aba2352121480780ca4688e35b82",
  "officialSchoolTemplate": false,
  "researchStatus": "RESEARCH_HANDOFF_READY",
  "policyEvidenceStatus": "PARTIAL",
  "criteria": [
    {
      "sectionId": "rule-set-03",
      "criterionId": "r001",
      "sourceRuleId": "R001",
      "srcIds": [
        "SRC-001",
        "SRC-002"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rule-set-03",
      "criterionId": "r002",
      "sourceRuleId": "R002",
      "srcIds": [
        "SRC-001",
        "SRC-002"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rule-set-03",
      "criterionId": "r003",
      "sourceRuleId": "R003",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-006",
        "SRC-007",
        "SRC-009"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rule-set-03",
      "criterionId": "r004",
      "sourceRuleId": "R004",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-003",
        "SRC-004",
        "SRC-009",
        "SRC-010"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rule-set-03",
      "criterionId": "r005",
      "sourceRuleId": "R005",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-003"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rule-set-03",
      "criterionId": "r006",
      "sourceRuleId": "R006",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-005"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rule-set-03",
      "criterionId": "r007",
      "sourceRuleId": "R007",
      "srcIds": [
        "SRC-001",
        "SRC-002"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rule-set-03",
      "criterionId": "r008",
      "sourceRuleId": "R008",
      "srcIds": [
        "SRC-001",
        "SRC-002"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rule-set-03",
      "criterionId": "r009",
      "sourceRuleId": "R009",
      "srcIds": [
        "SRC-001",
        "SRC-002"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rule-set-03",
      "criterionId": "r010",
      "sourceRuleId": "R010",
      "srcIds": [
        "SRC-001",
        "SRC-002"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rule-set-03",
      "criterionId": "r011",
      "sourceRuleId": "R011",
      "srcIds": [
        "SRC-001",
        "SRC-002"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rule-set-03",
      "criterionId": "r012",
      "sourceRuleId": "R012",
      "srcIds": [
        "SRC-001",
        "SRC-002"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rule-set-03",
      "criterionId": "r013",
      "sourceRuleId": "R013",
      "srcIds": [
        "SRC-001",
        "SRC-002"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rule-set-03",
      "criterionId": "r014",
      "sourceRuleId": "R014",
      "srcIds": [
        "SRC-001",
        "SRC-002"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rule-set-03",
      "criterionId": "r015",
      "sourceRuleId": "R015",
      "srcIds": [
        "SRC-003",
        "SRC-007",
        "SRC-009",
        "SRC-010"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rule-set-03",
      "criterionId": "r016",
      "sourceRuleId": "R016",
      "srcIds": [
        "SRC-001",
        "SRC-002"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rule-set-03",
      "criterionId": "r017",
      "sourceRuleId": "R017",
      "srcIds": [
        "SRC-001",
        "SRC-002"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rule-set-03",
      "criterionId": "r018",
      "sourceRuleId": "R018",
      "srcIds": [
        "SRC-001",
        "SRC-002"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rule-set-03",
      "criterionId": "r019",
      "sourceRuleId": "R019",
      "srcIds": [
        "SRC-001",
        "SRC-002"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rule-set-03",
      "criterionId": "r020",
      "sourceRuleId": "R020",
      "srcIds": [
        "SRC-001",
        "SRC-002"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rule-set-03",
      "criterionId": "r021",
      "sourceRuleId": "R021",
      "srcIds": [
        "SRC-001",
        "SRC-002"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rule-set-03",
      "criterionId": "r022",
      "sourceRuleId": "R022",
      "srcIds": [
        "SRC-001",
        "SRC-002"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rule-set-03",
      "criterionId": "r023",
      "sourceRuleId": "R023",
      "srcIds": [
        "SRC-001",
        "SRC-002"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rule-set-03",
      "criterionId": "r024",
      "sourceRuleId": "R024",
      "srcIds": [
        "SRC-001",
        "SRC-002"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rule-set-03",
      "criterionId": "r025",
      "sourceRuleId": "R025",
      "srcIds": [
        "SRC-001",
        "SRC-002"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rule-set-03",
      "criterionId": "r026",
      "sourceRuleId": "R026",
      "srcIds": [
        "SRC-001",
        "SRC-002"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rule-set-03",
      "criterionId": "r027",
      "sourceRuleId": "R027",
      "srcIds": [
        "SRC-001",
        "SRC-002"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rule-set-03",
      "criterionId": "r028",
      "sourceRuleId": "R028",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-003"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rule-set-03",
      "criterionId": "r029",
      "sourceRuleId": "R029",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-005"
      ],
      "evidenceStatus": "UNCONFIRMED"
    }
  ]
} as const
