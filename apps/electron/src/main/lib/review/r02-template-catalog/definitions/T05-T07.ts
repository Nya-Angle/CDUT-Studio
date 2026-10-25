import type { TemplateVersion } from '@profer/shared'

export const templateVersion: TemplateVersion = {
  "templateId": "T05-T07",
  "version": 1,
  "schemaVersion": 2,
  "name": "实验课程及教学实践基地建设审核",
  "description": "本地研究模板 · 非校方正式模板。成都理工大学实验课程及教学实践基地建设事项的申请资格、证据事实、办理节点与前置有权决定材料；单一模板，多情形；不代行审批。政策证据状态为 PARTIAL；仅用于本地事实预审与问题提示，不代表校方授权，不生成学校远端回写或正式批准。",
  "catalogKind": "builtin",
  "sourceNote": "R02_RESEARCH_TEMPLATE_NONOFFICIAL: T05-T07 来自 R02 research-original；非校方正式模板，校内授权和现行政策尚未全部确认；SRC IDs 仅为研究来源，不是案卷 SourceRef。",
  "objectType": "project",
  "displayName": {
    "template": "T05-T07 · 实验课程及教学实践基地建设审核"
  },
  "fields": [
    {
      "key": "F001",
      "label": "枚举分支 A0–H0 / Case",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "P0；SRC 对照+归口人工确认；案卷情形页/M001；L1；无法路由：POLICY_UNCONFIRMED"
    },
    {
      "key": "F002",
      "label": "枚举 P0–P7 / Case",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "各 P；可信工作流记录、阶段回执；案卷状态/原系统回执；L1；无回执不臆定已进入下一阶段"
    },
    {
      "key": "F003",
      "label": "年份/批次标识 / PolicyBatch",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "P0；官方当批通知 M001；通知首页、批次字段；L0；无批次：POLICY_UNCONFIRMED"
    },
    {
      "key": "F004",
      "label": "文号/效力日期 / PolicyBatch",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "P0、变更时；制度原文及发文机关；SRC/M001 条页；L0；时效未知：POLICY_UNCONFIRMED"
    },
    {
      "key": "F005",
      "label": "截止日/事件节点 / PolicyBatch",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "P0、P1、P6/7；当批通知/合同原件；M001、M016 期限条款；L1；不默认期限；请归口人工核定"
    },
    {
      "key": "F006",
      "label": "枚举本科/研究生/混合 / BuildObject",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "P0–P1；教务/研究生主管业务记录；M002/M003/M013 对象栏；L1；混合且权责不清：CONFLICT"
    },
    {
      "key": "F007",
      "label": "可信身份键/角色 / ActorGrant",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "P1、P7；校方认证身份或核验原始凭据；登录回执/授权记录，非 OCR 姓名；L2；SOURCE_UNAVAILABLE 并人工核身"
    },
    {
      "key": "F008",
      "label": "学院/单位代码 / ActorGrant",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "P1–P2；学校机构/任职目录；M002 署名、单位主数据；L1；与任职冲突：CONFLICT"
    },
    {
      "key": "F009",
      "label": "委托范围/期限 / ActorGrant",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "代报 P1、P7；有权机关委托记录；受托文书/办理回执；L2；缺授权：暂不能代办，人工核定"
    },
    {
      "key": "F010",
      "label": "项目负责人身份/任职状态 / ActorGrant",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "A1/F0 申报；人事主数据、校方核验；M013 负责人栏及校方记录；L2；资格无法核真：SOURCE_UNAVAILABLE"
    },
    {
      "key": "F011",
      "label": "项目/基地/实验室名称与唯一标识 / BuildObject",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "P1–P7；申报材料与已有业务台账；M002/M013/M015 主体栏；L1；同名不同案：CONFLICT/请确定 ID"
    },
    {
      "key": "F012",
      "label": "枚举建设子类型 / BuildObject",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "P0–P1；原始申请类型及 SRC；M002/M013 表单项目；L1；类型不明：POLICY_UNCONFIRMED"
    },
    {
      "key": "F013",
      "label": "既有对象 ID/历史有效状态 / BuildObject",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "B1/D0/E0/F1；原决定/主管台账；M015 文号、对象字段；L1；既有性未证：NEEDS_MATERIAL 或来源失联"
    },
    {
      "key": "F014",
      "label": "教育教学目标文本 / BuildObject",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "P1；学院正式方案；M002 正文目标章节；L1；候选材料待补，非自动否决"
    },
    {
      "key": "F015",
      "label": "课程/实验项目 ID 集 / BuildObject",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "P1–P3；教务有效课程/培养记录；M003 课程目录/关联编号；L1；与课程权威记录不同：CONFLICT"
    },
    {
      "key": "F016",
      "label": "规模/承载人数与单位 / BuildObject",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "P1–P3；方案+经核实设施容量；M002/M007 容量章节；L1；数值仅提示核验；无现行阈值不判失败"
    },
    {
      "key": "F017",
      "label": "人员名单及职责 / Resources",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "P1–P3；学院组织记录、任职目录；M002/M013 团队与责任页；L2；缺者提示补充，实际资质人工核"
    },
    {
      "key": "F018",
      "label": "计划起止与里程碑 / BuildObject",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "P1、P5；申报/获批计划；M002/M015/M022 时间表；L1；不自动把 2025 周期套 2026"
    },
    {
      "key": "F019",
      "label": "场地位置、面积、使用权 / Resources",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "场地触发 P1–P3；校方房屋资源权威记录/合作方凭证；M007 地点、权属、楼层；L3；校内外权属冲突 CONFLICT"
    },
    {
      "key": "F020",
      "label": "设备与配置清单 / Resources",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "配置触发 P1、P5；方案、采购与资产台账；M008/M020 设备行号；L1；规划与实有不等同；缺时待核"
    },
    {
      "key": "F021",
      "label": "资金来源、额度、支出责任 / Resources",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "经费触发 P1–P3；申报预算、财务权威记录；M008 预算表/外案编号；L1；未证阈值不比较；财务决定外置"
    },
    {
      "key": "F022",
      "label": "合作方法人/机构标识 / Resources",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "C0/D0/F0 触发；可核注册主体、原合同相对方；M009/M016 主体页；L2；名称/统一代码矛盾 CONFLICT"
    },
    {
      "key": "F023",
      "label": "合作事项与双方责任 / Resources",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "合作 P1、实施；双方拟签/已签文件；M010/M016 条款、责任页；L1；草案不可作已签义务依据"
    },
    {
      "key": "F024",
      "label": "危险源类别及风险分级依据 / Resources",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "G0 识别 P1–P3；责任教师评估、单位安全意见；M011/M012 危险源与分级页；L3；未核分级则人工安全核验"
    },
    {
      "key": "F025",
      "label": "场所技术安全/环保论证状态 / StageEvidence",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "新扩改施工前 P3；教学科研单位有权论证；M012 场所论证文书；L3；应有未有则待办，不能判可施工"
    },
    {
      "key": "F026",
      "label": "实验项目安全论证状态 / StageEvidence",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "实验项目前 P3/P5；项目负责人提交、单位核查；M012 项目论证子文书；L3；不能借场所论证代替项目论证"
    },
    {
      "key": "F027",
      "label": "教授委员会论证结论 / StageEvidence",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "B0 P2；学院正式议事记录；M004 文号/会议纪要；L1；尚在 P1 为未来材料；P3 缺则待补"
    },
    {
      "key": "F028",
      "label": "学院党政联席会决策 / StageEvidence",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "B0 P2；学院真实会议记录；M005 议决与签章；L1；不以 F027 顶替 F028"
    },
    {
      "key": "F029",
      "label": "五部门审核意见集合 / StageEvidence",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "B0 P3；各部门有权公文/签批流；M018 五项分列及版本；L1；少一项列具体缺口；名称映射人工确认"
    },
    {
      "key": "F030",
      "label": "学校/主管机关最终决定 / StageEvidence",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "P4 后；有权机关原始批复/可信回执；M019 决定编号、签批链；L1；未签发不生成“已批准”"
    },
    {
      "key": "F031",
      "label": "阶段实施进度 / StageEvidence",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "P5；项目实施人+可核工程进度；M022 里程碑/现场记录；L1；与原批准计划不同则待解释"
    },
    {
      "key": "F032",
      "label": "专家验收/年度结论 / StageEvidence",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "P6 后；有权专家/归口正式结论；M023/M024 意见/公示；L1；材料齐全不等于验收通过"
    },
    {
      "key": "F033",
      "label": "变更原因及影响范围 / Case",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "B1/D0/E0/H0 P7；责任单位的正式请求；M014 变更前后对照；L1；与原对象无法绑定 CONFLICT"
    },
    {
      "key": "F034",
      "label": "前版/替代链 ID / EvidenceLineage",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "更新、P7；案卷版本账+原件校验；M014/M015 + 版本元信息；L1；不明替代关系则禁止复用旧判断"
    },
    {
      "key": "F035",
      "label": "动作枚举补件/撤回/延期/复核 / Case",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "H0/P7；当批正式申请/回执；M025/M026 诉求栏；L1；不支持的权利标 POLICY_UNCONFIRMED"
    },
    {
      "key": "F036",
      "label": "外部权威决定链接及效力 / ExternalDecisionRef",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "条件触发 P2–P6；主管流程正式决定或台账；M020/M015/原案号；L1；外部失联 SOURCE_UNAVAILABLE，不得代批"
    },
    {
      "key": "F037",
      "label": "发文机关/实际签发人/权限凭据 / ActorGrant",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "P2–P7；校方组织授权与原始签发链；M004–M006/M018/M019/M027；L2；自报签名未验真：人工确认"
    },
    {
      "key": "F038",
      "label": "原件哈希、页码、来源、签发时间/版本 / EvidenceLineage",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "任何收件/替换；文件读取记录+签发方验真；每件 M 原件、页位、校验日志；L1；不可读 UNREADABLE；版本不明待核"
    },
    {
      "key": "F039",
      "label": "安全暂停/整改/恢复权威状态 / StageEvidence",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "G0 P5/P7；安全主管书面记录；M028 隐患及恢复文书；L3；未有恢复结论不得推定可使用"
    }
  ],
  "materialSlots": [
    {
      "id": "M001",
      "name": "当批适用资格、时限",
      "purpose": "当批适用资格、时限；归口部门/发文机关；政策、通知与附件原文；当 P0；无批次则找常设办法；官方政策库、可校验网页原件，申请人不必上传；F003–F005/F038；SRC-008/009/011/012/013/014；文号+批次+施行期+网页留痕；取不到 SOURCE_UNAVAILABLE；仅索引 POLICY_UNCONFIRMED。该材料槽按原文适用情形触发；minCount=0，不据此强制要求申请人重复上传系统/归口部门已有记录；是否必需按当批授权人工确认。",
      "requiredElements": [
        "当批适用资格、时限",
        "归口部门/发文机关",
        "政策、通知与附件原文",
        "当 P0",
        "无批次则找常设办法"
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
      "requiredAt": "decision",
      "maxCount": 9999,
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M002",
      "name": "建设目标、对象、实施计划",
      "purpose": "建设目标、对象、实施计划；学院/项目负责人；建设申请方案、项目建议书；参 P1 A0/B0/C0/E0；其他依批次；归口正式电子申请正文/已备案计划；F011/F012/F014/F016–F018；SRC-004/013；方案版号+对象+学院+当批；不可读 UNREADABLE；若该批明确必需则 NEEDS_MATERIAL。该材料槽按原文适用情形触发；minCount=0，不据此强制要求申请人重复上传系统/归口部门已有记录；是否必需按当批授权人工确认。",
      "requiredElements": [
        "建设目标、对象、实施计划",
        "学院/项目负责人",
        "建设申请方案、项目建议书",
        "参 P1 A0/B0/C0/E0",
        "其他依批次"
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
      "requiredAt": "decision",
      "maxCount": 9999,
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M003",
      "name": "教学任务和课程依据",
      "purpose": "教学任务和课程依据；教务/学院；有效课程、培养方案、教学任务关联；条 P1 涉及教学目标的分支；校方课程/培养权威记录，只引用 ID；F006/F014/F015；SRC-001/013；学段+课程版+学年+对象；来源断开 SOURCE_UNAVAILABLE；与方案冲突 CONFLICT。该材料槽按原文适用情形触发；minCount=0，不据此强制要求申请人重复上传系统/归口部门已有记录；是否必需按当批授权人工确认。",
      "requiredElements": [
        "教学任务和课程依据",
        "教务/学院",
        "有效课程、培养方案、教学任务关联",
        "条 P1 涉及教学目标的分支",
        "校方课程/培养权威记录，只引用 ID"
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
      "requiredAt": "decision",
      "maxCount": 9999,
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M004",
      "name": "B0 教授委员会已论证",
      "purpose": "B0 教授委员会已论证；学院教授委员会；正式论证纪要/意见；后 P2，B0 进入 P3 前应有；学院可验真的电子会议决定；F027/F037/F038；SRC-013 第 5 条；会议+对象+参会权限+日期；P1 不要求；P3 缺 NEEDS_MATERIAL，验真不明转人工。该材料槽按原文适用情形触发；minCount=0，不据此强制要求申请人重复上传系统/归口部门已有记录；是否必需按当批授权人工确认。",
      "requiredElements": [
        "B0 教授委员会已论证",
        "学院教授委员会",
        "正式论证纪要/意见",
        "后 P2，B0 进入 P3 前应有",
        "学院可验真的电子会议决定"
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
      "requiredAt": "decision",
      "maxCount": 9999,
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M005",
      "name": "B0 学院党政联席会决策",
      "purpose": "B0 学院党政联席会决策；学院；正式议决纪要/决定；后 P2，B0 进入 P3 前应有；可追溯学院议决系统记录；F028/F037/F038；SRC-013 第 5 条；议题+对象+决策时间+学院；不能用 M004 顶替；缺/不可读分别处理。该材料槽按原文适用情形触发；minCount=0，不据此强制要求申请人重复上传系统/归口部门已有记录；是否必需按当批授权人工确认。",
      "requiredElements": [
        "B0 学院党政联席会决策",
        "学院",
        "正式议决纪要/决定",
        "后 P2，B0 进入 P3 前应有",
        "可追溯学院议决系统记录"
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
      "requiredAt": "decision",
      "maxCount": 9999,
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M006",
      "name": "学院/学校推荐汇总",
      "purpose": "学院/学校推荐汇总；学院/归口；推荐表、正式上报名单/意见；条 P2 A1/F0/F1 等真实批次；可验证校内汇总/报送回执；F008/F010/F037；SRC-008/011/012；批次+名单+单位+时间；原批次要求存在而缺时 NEEDS_MATERIAL；旧表不代新表。该材料槽按原文适用情形触发；minCount=0，不据此强制要求申请人重复上传系统/归口部门已有记录；是否必需按当批授权人工确认。",
      "requiredElements": [
        "学院/学校推荐汇总",
        "学院/归口",
        "推荐表、正式上报名单/意见",
        "条 P2 A1/F0/F1 等真实批次",
        "可验证校内汇总/报送回执"
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
      "requiredAt": "decision",
      "maxCount": 9999,
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M007",
      "name": "场所及使用权、空间容量",
      "purpose": "场所及使用权、空间容量；学院/场所管理者/合作方；权属/使用许可、平面方案、场地记录；条 P1–P3 实体新建、迁址、合作场地；校内房屋台账/已验真的产权授权记录；F016/F019；SRC-013/014；场所 ID+地址+有效期+用途；来源失联不推定有使用权；敏感图纸限授权浏览。该材料槽按原文适用情形触发；minCount=0，不据此强制要求申请人重复上传系统/归口部门已有记录；是否必需按当批授权人工确认。",
      "requiredElements": [
        "场所及使用权、空间容量",
        "学院/场所管理者/合作方",
        "权属/使用许可、平面方案、场地记录",
        "条 P1–P3 实体新建、迁址、合作场地",
        "校内房屋台账/已验真的产权授权记录"
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
      "requiredAt": "decision",
      "maxCount": 9999,
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M008",
      "name": "设施设备经费计划",
      "purpose": "设施设备经费计划；项目组/国资财务单位；配置清单、预算/论证草案；条 P1 B0/E0、设备经费调整；已存在校方批准预算/资产清单可引用；F020/F021/F018；SRC-002/013；对象+预算版+资产项目号；缺时按当前条件补；规划不等于采购完成。该材料槽按原文适用情形触发；minCount=0，不据此强制要求申请人重复上传系统/归口部门已有记录；是否必需按当批授权人工确认。",
      "requiredElements": [
        "设施设备经费计划",
        "项目组/国资财务单位",
        "配置清单、预算/论证草案",
        "条 P1 B0/E0、设备经费调整",
        "已存在校方批准预算/资产清单可引用"
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
      "requiredAt": "decision",
      "maxCount": 9999,
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M009",
      "name": "合作方可识别及合法存续",
      "purpose": "合作方可识别及合法存续；校外单位；登记主体证明/校方既有供应商档案；条 P1 C0、变更合作方 D0、F0；可核外部登记或既有合法签约主体记录；F022/F037；SRC-006/008；法人主体键+验证日期+旧版关联；同名异主体 CONFLICT；无可信来源待人工。该材料槽按原文适用情形触发；minCount=0，不据此强制要求申请人重复上传系统/归口部门已有记录；是否必需按当批授权人工确认。",
      "requiredElements": [
        "合作方可识别及合法存续",
        "校外单位",
        "登记主体证明/校方既有供应商档案",
        "条 P1 C0、变更合作方 D0、F0",
        "可核外部登记或既有合法签约主体记录"
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
      "requiredAt": "decision",
      "maxCount": 9999,
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M010",
      "name": "合作职责、教学资源与意向",
      "purpose": "合作职责、教学资源与意向；双方/学院；合作意向书、拟签协议草案；参 P1 C0/F0；D0 变更时条；经授权的现有正式合作文件 M016；F023/F014/F019；SRC-006/008；合作方+基地对象+草案版+起止；没有签署不能标“合同已生效”；具体必交政策待核。该材料槽按原文适用情形触发；minCount=0，不据此强制要求申请人重复上传系统/归口部门已有记录；是否必需按当批授权人工确认。",
      "requiredElements": [
        "合作职责、教学资源与意向",
        "双方/学院",
        "合作意向书、拟签协议草案",
        "参 P1 C0/F0",
        "D0 变更时条"
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
      "requiredAt": "decision",
      "maxCount": 9999,
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M011",
      "name": "识别危险源与预估风险",
      "purpose": "识别危险源与预估风险；实验项目负责人；初步危险源清单/活动描述；条 P1–P3 实验场所/项目触发；单位已有最新危险源调查的授权副本；F024/F019；SRC-014 第 7–10 条；实验项目+地点+工艺/危险源版；未给不自动定为低风险；不足则安全负责人核。该材料槽按原文适用情形触发；minCount=0，不据此强制要求申请人重复上传系统/归口部门已有记录；是否必需按当批授权人工确认。",
      "requiredElements": [
        "识别危险源与预估风险",
        "实验项目负责人",
        "初步危险源清单/活动描述",
        "条 P1–P3 实验场所/项目触发",
        "单位已有最新危险源调查的授权副本"
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
      "requiredAt": "decision",
      "maxCount": 9999,
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M012",
      "name": "建设施工前技术安全环保论证及实验项目前安全论证",
      "purpose": "建设施工前技术安全环保论证及实验项目前安全论证；教学科研单位/项目负责人；两个子凭据：场所论证、实验项目论证，分别有权签发；条/后：新扩改场所在施工/建设前 P3；实验项目开展前 P3/P5；主管单位原始论证/可信审批记录；一种子凭据不替代另一种；F024–F026/F037；SRC-014 第 9–10 条；场所 ID、项目 ID、危险源版、论证日期分别绑定；施工/项目节点应有未有 NEEDS_MATERIAL，不能写可施工/可实验。该材料槽按原文适用情形触发；minCount=0，不据此强制要求申请人重复上传系统/归口部门已有记录；是否必需按当批授权人工确认。",
      "requiredElements": [
        "建设施工前技术安全环保论证及实验项目前安全论证",
        "教学科研单位/项目负责人",
        "两个子凭据：场所论证、实验项目论证，分别有权签发",
        "条/后：新扩改场所在施工/建设前 P3",
        "实验项目开展前 P3/P5"
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
      "requiredAt": "decision",
      "maxCount": 9999,
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M013",
      "name": "匹配历史项目原始表单",
      "purpose": "匹配历史项目原始表单；项目负责人；当批申报书/网上申请和附件；当 P1 A1(2025)/F0(2023)，其他批次未知；可核当批学校系统回执，不强制重复提交；F003/F010–F018/F038；SRC-008/011；批次+项目+提交号+申报版；跨批表 POLICY_UNCONFIRMED；缺/损坏需补或原系统调取。该材料槽按原文适用情形触发；minCount=0，不据此强制要求申请人重复上传系统/归口部门已有记录；是否必需按当批授权人工确认。",
      "requiredElements": [
        "匹配历史项目原始表单",
        "项目负责人",
        "当批申报书/网上申请和附件",
        "当 P1 A1(2025)/F0(2023)，其他批次未知",
        "可核当批学校系统回执，不强制重复提交"
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
      "requiredAt": "decision",
      "maxCount": 9999,
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M014",
      "name": "新旧配置差异与变更理由",
      "purpose": "新旧配置差异与变更理由；责任学院/原负责人；变更/调整申请、对照表；条 P1/P7 B1/D0/E0/H0；归口正式变更单及其业务对象引用；F033/F034/F011/F019–F023；SRC-013/004；原决定 ID+变更项+版本链；找不到有效旧对象 CONFLICT；缺理由候选待补。该材料槽按原文适用情形触发；minCount=0，不据此强制要求申请人重复上传系统/归口部门已有记录；是否必需按当批授权人工确认。",
      "requiredElements": [
        "新旧配置差异与变更理由",
        "责任学院/原负责人",
        "变更/调整申请、对照表",
        "条 P1/P7 B1/D0/E0/H0",
        "归口正式变更单及其业务对象引用"
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
      "requiredAt": "decision",
      "maxCount": 9999,
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M015",
      "name": "已存在项目/实验室/基地的有效状态",
      "purpose": "已存在项目/实验室/基地的有效状态；发文机关；历史立项、设置、验收或有效批准；条 P1 B1/D0/E0/F1；对新建案不要求；原审批系统或归口档案可信引用；F013/F030/F034/F036；SRC-013/004/008/012；原对象+文号+生效/失效+批次；原件缺与来源失联分开；不能把旧批复嫁接新对象。该材料槽按原文适用情形触发；minCount=0，不据此强制要求申请人重复上传系统/归口部门已有记录；是否必需按当批授权人工确认。",
      "requiredElements": [
        "已存在项目/实验室/基地的有效状态",
        "发文机关",
        "历史立项、设置、验收或有效批准",
        "条 P1 B1/D0/E0/F1",
        "对新建案不要求"
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
      "requiredAt": "decision",
      "maxCount": 9999,
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M016",
      "name": "既有校外基地合作法律关系",
      "purpose": "既有校外基地合作法律关系；合同双方；正式签约合同/协议、续约书；条 P1 D0；C0 首次签署时 后 P4；合同主管系统可核存档和用印信息；F022/F023/F036；SRC-006（程序未证）；双方主体+有效期+合同版本+签章；只有意向不等于已签；旧协议到期不能证明续期。该材料槽按原文适用情形触发；minCount=0，不据此强制要求申请人重复上传系统/归口部门已有记录；是否必需按当批授权人工确认。",
      "requiredElements": [
        "既有校外基地合作法律关系",
        "合同双方",
        "正式签约合同/协议、续约书",
        "条 P1 D0",
        "C0 首次签署时 后 P4"
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
      "requiredAt": "decision",
      "maxCount": 9999,
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M017",
      "name": "示范中心教育教学审议",
      "purpose": "示范中心教育教学审议；教学指导委员会/管理委员会；会议意见、专家审议记录；后 P3 E0 对应触发；范围按原细则；校方会议制度中的可核电子审议；F014/F017/F037；SRC-004/005；中心+议题+批次+成员有效期；未轮到该阶段不催；议决权不等于级别认定。该材料槽按原文适用情形触发；minCount=0，不据此强制要求申请人重复上传系统/归口部门已有记录；是否必需按当批授权人工确认。",
      "requiredElements": [
        "示范中心教育教学审议",
        "教学指导委员会/管理委员会",
        "会议意见、专家审议记录",
        "后 P3 E0 对应触发",
        "范围按原细则"
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
      "requiredAt": "decision",
      "maxCount": 9999,
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M018",
      "name": "B0 五部门各自审核",
      "purpose": "B0 五部门各自审核；各有权业务部门；5 份正式审核意见或一张含逐部门签批的可信流程记录；后 P3，B0 设置入 P4 前应有；B1 是否同链待核；经权限验证的统一会签回执；F029/F037/F038；SRC-013 第 5 条；对象+五个机关+意见时点与版本；分列缺项；不可把一个部门意见冒充五部门意见。该材料槽按原文适用情形触发；minCount=0，不据此强制要求申请人重复上传系统/归口部门已有记录；是否必需按当批授权人工确认。",
      "requiredElements": [
        "B0 五部门各自审核",
        "各有权业务部门",
        "5 份正式审核意见或一张含逐部门签批的可信流程记录",
        "后 P3，B0 设置入 P4 前应有",
        "B1 是否同链待核"
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
      "requiredAt": "decision",
      "maxCount": 9999,
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M019",
      "name": "有权机关正式设置/立项/认定决定",
      "purpose": "有权机关正式设置/立项/认定决定；学校或上级；决定书、批复、公告、可信签批；后 P4；F0 校级项目批准 ≠ 基地设立；A1 省级按原文；原机关可验签决定/正式公示；F030/F037/F038；SRC-013/004/008/011/012；决定种类+对象+签发者+日期+版本；没产生不强要；只有推荐则 NEEDS_HUMAN_DECISION。该材料槽按原文适用情形触发；minCount=0，不据此强制要求申请人重复上传系统/归口部门已有记录；是否必需按当批授权人工确认。",
      "requiredElements": [
        "有权机关正式设置/立项/认定决定",
        "学校或上级",
        "决定书、批复、公告、可信签批",
        "后 P4",
        "F0 校级项目批准 ≠ 基地设立"
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
      "requiredAt": "decision",
      "maxCount": 9999,
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M020",
      "name": "工程/采购/合同/资产/安全外部决定",
      "purpose": "工程/采购/合同/资产/安全外部决定；相应主管机关；各自有权流程的正式凭据和台账；条/后 需实施工程、采购、入账及相关节点；原业务案/有权系统只读引用，避免重复上传；F019–F021/F036/F038；SRC-002/013/014；G50 SRC-010 待比；外部案号+设备/建筑 ID+适用期+决定版；外案未决定不当作本案否决；来源失联 SOURCE_UNAVAILABLE。该材料槽按原文适用情形触发；minCount=0，不据此强制要求申请人重复上传系统/归口部门已有记录；是否必需按当批授权人工确认。",
      "requiredElements": [
        "工程/采购/合同/资产/安全外部决定",
        "相应主管机关",
        "各自有权流程的正式凭据和台账",
        "条/后 需实施工程、采购、入账及相关节点",
        "原业务案/有权系统只读引用，避免重复上传"
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
      "requiredAt": "decision",
      "maxCount": 9999,
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M021",
      "name": "开展实验前人员培训与资格落实",
      "purpose": "开展实验前人员培训与资格落实；责任教学科研单位；实验室安全培训考核/准入记录；后 P5 实验开始前，按场所及人员触发；学校可信培训平台记录，若可访问；F017/F024/F037；SRC-014 第 11 条及相关条；参加人+项目/场所+培训版+时间；P1 不要求未来学生名单；开实验前缺则安全待办。该材料槽按原文适用情形触发；minCount=0，不据此强制要求申请人重复上传系统/归口部门已有记录；是否必需按当批授权人工确认。",
      "requiredElements": [
        "开展实验前人员培训与资格落实",
        "责任教学科研单位",
        "实验室安全培训考核/准入记录",
        "后 P5 实验开始前，按场所及人员触发",
        "学校可信培训平台记录，若可访问"
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
      "requiredAt": "decision",
      "maxCount": 9999,
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M022",
      "name": "真实建设进度",
      "purpose": "真实建设进度；实施单位/项目负责人；里程碑完成、场地改造记录、中期报告；后 P5 对在建项目；F0 等依批次；项目主管系统阶段进度回执；F018/F031/F038；SRC-008/011/013；立项决定+实施版+阶段时点；不替代竣工/验收结论；差异交人工。该材料槽按原文适用情形触发；minCount=0，不据此强制要求申请人重复上传系统/归口部门已有记录；是否必需按当批授权人工确认。",
      "requiredElements": [
        "真实建设进度",
        "实施单位/项目负责人",
        "里程碑完成、场地改造记录、中期报告",
        "后 P5 对在建项目",
        "F0 等依批次"
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
      "requiredAt": "decision",
      "maxCount": 9999,
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M023",
      "name": "年度自评、结题陈述",
      "purpose": "年度自评、结题陈述；项目负责人/中心/学院；年度报告、结题报告、实验室效益报告；后 P6 E0/B0/F0/F1 按实际项目阶段；学校正式年度报表系统回执；F031/F032/F038；SRC-004/008/012/013；对象+评价年度+实施版；P1 不要求；旧报告不能做新年验收。该材料槽按原文适用情形触发；minCount=0，不据此强制要求申请人重复上传系统/归口部门已有记录；是否必需按当批授权人工确认。",
      "requiredElements": [
        "年度自评、结题陈述",
        "项目负责人/中心/学院",
        "年度报告、结题报告、实验室效益报告",
        "后 P6 E0/B0/F0/F1 按实际项目阶段",
        "学校正式年度报表系统回执"
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
      "requiredAt": "decision",
      "maxCount": 9999,
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M024",
      "name": "专家评审/结题或外部级别认定事实",
      "purpose": "专家评审/结题或外部级别认定事实；归口/专家/主管机关；评审结果、公示、验收决议、认定公告；后 P6，按 E0/A1/F1 等触发；有权主管发布的正式结果与编号；F032/F030/F037；SRC-004/008/011/012；项目批次+结论+公示期+复核标记；个人总结不可代专家结论；缺时等待真实产生。该材料槽按原文适用情形触发；minCount=0，不据此强制要求申请人重复上传系统/归口部门已有记录；是否必需按当批授权人工确认。",
      "requiredElements": [
        "专家评审/结题或外部级别认定事实",
        "归口/专家/主管机关",
        "评审结果、公示、验收决议、认定公告",
        "后 P6，按 E0/A1/F1 等触发",
        "有权主管发布的正式结果与编号"
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
      "requiredAt": "decision",
      "maxCount": 9999,
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M025",
      "name": "延期、撤项、撤回/补正要求",
      "purpose": "延期、撤项、撤回/补正要求；原负责人/权利主体；正式动作申请表/补件说明；条 P7 F1 2025 有延期/撤项表；其余权限待核；当批系统自带申请与回执；F035/F034/F007；SRC-012/008；原案+动作+提交人权限+日期；无适用权利条款 POLICY_UNCONFIRMED，不可自动通过。该材料槽按原文适用情形触发；minCount=0，不据此强制要求申请人重复上传系统/归口部门已有记录；是否必需按当批授权人工确认。",
      "requiredElements": [
        "延期、撤项、撤回/补正要求",
        "原负责人/权利主体",
        "正式动作申请表/补件说明",
        "条 P7 F1 2025 有延期/撤项表",
        "其余权限待核"
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
      "requiredAt": "decision",
      "maxCount": 9999,
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M026",
      "name": "提出异议/复核的事实及理由",
      "purpose": "提出异议/复核的事实及理由；有权请求人；异议申请、证据清单；条 P7，须先证明本批存在该渠道；当批官方异议入口/受理记录；F035/F037/F038；SRC-011/012（权利条款未证）；原决定+提出人+期限+证据版；无公开复核规定不虚构入口；人工指向归口。该材料槽按原文适用情形触发；minCount=0，不据此强制要求申请人重复上传系统/归口部门已有记录；是否必需按当批授权人工确认。",
      "requiredElements": [
        "提出异议/复核的事实及理由",
        "有权请求人",
        "异议申请、证据清单",
        "条 P7，须先证明本批存在该渠道",
        "当批官方异议入口/受理记录"
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
      "requiredAt": "decision",
      "maxCount": 9999,
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M027",
      "name": "撤回、延期或复核已处理",
      "purpose": "撤回、延期或复核已处理；原有权受理机关；受理回执、处理决定/答复；后 P7；可验电子处理记录；F030/F035/F037；SRC-012（需查附件与渠道）；原请求+处理机关+结论时间+版；未出决定不标“已同意”；来源失联单列。该材料槽按原文适用情形触发；minCount=0，不据此强制要求申请人重复上传系统/归口部门已有记录；是否必需按当批授权人工确认。",
      "requiredElements": [
        "撤回、延期或复核已处理",
        "原有权受理机关",
        "受理回执、处理决定/答复",
        "后 P7",
        "可验电子处理记录"
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
      "requiredAt": "decision",
      "maxCount": 9999,
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M028",
      "name": "停用、整改与安全复核恢复",
      "purpose": "停用、整改与安全复核恢复；安全主管/单位；隐患整改、停用/恢复通知；条/后 P5/P7 G0 存在安全隐患时；主管单位安全台账/书面复核；F039/F024/F037；SRC-014 第 20、30 条；实验室+隐患+停用/恢复时点+版本；无恢复通知不推定解除限制；敏感记录受限。该材料槽按原文适用情形触发；minCount=0，不据此强制要求申请人重复上传系统/归口部门已有记录；是否必需按当批授权人工确认。",
      "requiredElements": [
        "停用、整改与安全复核恢复",
        "安全主管/单位",
        "隐患整改、停用/恢复通知",
        "条/后 P5/P7 G0 存在安全隐患时",
        "主管单位安全台账/书面复核"
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
      "requiredAt": "decision",
      "maxCount": 9999,
      "allowReuseAcrossSubjects": true
    }
  ],
  "sections": [
    {
      "id": "rules-001-036",
      "name": "连续事实规则",
      "description": "来源章节：连续事实规则；保留原文规则编号、触发条件、证据来源和结果码。",
      "order": 0,
      "required": true,
      "criteria": [
        {
          "id": "r001",
          "title": "事项路由与学段",
          "requirement": "原文规则编号与阶段：R001 事项路由与学段 P0。触发/例外条件：T=建设/设立/改造/建设阶段核验；F=仅排课、个人培养或普通采购；U=建设对象未明；关联字段、材料与来源：SRC-001/004/006/008/013；F001/F002/F006/F011/F012；M002/M003/M013；核验方法：核申请目的、对象 ID、教育教学目标及当前阶段。F 转 T01/T05-T01/T05-T03/S02/T04，不把邻案决定纳入本案；SRC-001 仅职责线索；结果与下一办理角色：T 且对象可定位 PASS_FACT→归口；F NOT_APPLICABLE→邻案 Owner；U POLICY_UNCONFIRMED→教务/研究生归口确认。政策/权限/来源现行性未核实、证据不可访问、版本不匹配或结论涉及有权机关时，必须标记待确认并转人工复核；本项仅为本地事实预审，不得自动形成学校正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r002",
          "title": "适用政策效力",
          "requirement": "原文规则编号与阶段：R002 适用政策效力 P0。触发/例外条件：T=准备按某制度出规则；F=纯事实录入尚未判断资格；U=不知道年度/制度；关联字段、材料与来源：SRC-004/007/008/011/012/013/014；F003/F004/F006；M001；核验方法：逐件核发文机关、文号、有效日、废止与学段；新案不得使用 SRC-007（2024-01-01 已废止）、2023/2025 限批规则。原始制度 E0 优于搜索摘要；结果与下一办理角色：当前可核 PASS_FACT；适用不明 POLICY_UNCONFIRMED→归口政策管理员；已知新旧冲突 CONFLICT→发文机关。政策/权限/来源现行性未核实、证据不可访问、版本不匹配或结论涉及有权机关时，必须标记待确认并转人工复核；本项仅为本地事实预审，不得自动形成学校正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r003",
          "title": "当批申报期限",
          "requirement": "原文规则编号与阶段：R003 当批申报期限 P0/P1/P6。触发/例外条件：T=通知明确本批申报/结题窗口；F=常设制度无固定截止；U=没有当前通知；关联字段、材料与来源：SRC-008/009/011/012；F003/F005/F018；M001/M013/M023；核验方法：以批次+事项+提交回执时间和时区比较；2023-05-18、2025-04-15/10-28、2026-09-07 只检各自历史案；不假造“逾期自动驳回”处分；结果与下一办理角色：事实时点相符 PASS_FACT；时点矛盾 CONFLICT→当批收件机构；规则或例外未知 POLICY_UNCONFIRMED→归口人工。政策/权限/来源现行性未核实、证据不可访问、版本不匹配或结论涉及有权机关时，必须标记待确认并转人工复核；本项仅为本地事实预审，不得自动形成学校正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r004",
          "title": "申请人与代理权限",
          "requirement": "原文规则编号与阶段：R004 申请人与代理权限 P1/P7。触发/例外条件：T=有人提交或代报；F=纯制度查询无申请人；U=代理关系未知；关联字段、材料与来源：SRC-008/011/013；F007/F008/F009/F037；M002/M013/M025；核验方法：ActorGrant 与认证身份、学院单位、授权有效期比较；前端 Actor/签名图像只有 E3；学院申请与个人经办分开；代理许可无校本通用条款；结果与下一办理角色：身份核实 PASS_FACT；来源不可达 SOURCE_UNAVAILABLE→校方身份管理员；权限裁量 NEEDS_HUMAN_DECISION→学院/归口。政策/权限/来源现行性未核实、证据不可访问、版本不匹配或结论涉及有权机关时，必须标记待确认并转人工复核；本项仅为本地事实预审，不得自动形成学校正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r005",
          "title": "特定批次负责人资格",
          "requirement": "原文规则编号与阶段：R005 特定批次负责人资格 P1。触发/例外条件：T=A1 2025 或 F0 2023；F=其他类型；U=批次未明；关联字段、材料与来源：SRC-008/011；F003/F006/F010/F017；M001/M013；核验方法：A1 验在职教师牵头，F0 验当批研究生教育管理人员/导师/授课教师身份；以人事权限记录 E0/E1 核，不以自填“教授”判真；旧年度不用于新批次；结果与下一办理角色：匹配 PASS_FACT；不符 CONFLICT→对应学院/教务或研究生院；身份不可核 SOURCE_UNAVAILABLE→人事/归口。政策/权限/来源现行性未核实、证据不可访问、版本不匹配或结论涉及有权机关时，必须标记待确认并转人工复核；本项仅为本地事实预审，不得自动形成学校正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r006",
          "title": "建设对象与历史实体识别",
          "requirement": "原文规则编号与阶段：R006 建设对象与历史实体识别 P1。触发/例外条件：T=B1/D0/F1/E0 调整或历史对象；F=确认为新建；U=同名无标识；关联字段、材料与来源：SRC-006/008/013；F011/F012/F013/F034；M002/M014/M015；核验方法：历史有效文书的对象号、学院、类型、原签发时点与申请案 ID 三重绑定；同名不能替代唯一键；F 时不索历史批复；结果与下一办理角色：唯一且有效 PASS_FACT；原版与主张不符 CONFLICT→归口档案；旧件暂取不到 SOURCE_UNAVAILABLE→原发文机关。政策/权限/来源现行性未核实、证据不可访问、版本不匹配或结论涉及有权机关时，必须标记待确认并转人工复核；本项仅为本地事实预审，不得自动形成学校正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "r007",
          "title": "教学目标和课程依据",
          "requirement": "原文规则编号与阶段：R007 教学目标和课程依据 P1/P2。触发/例外条件：T=课程/实验项目/基地声称服务某培养任务；F=仅安全整改不改教学目标；U=培养任务未明；关联字段、材料与来源：SRC-001/004/013；F006/F014/F015；M002/M003；核验方法：把方案的课程号、实验内容、学段对照有效培养方案/课程记录 E0/E1；不得在本模板重新批准或编辑 T01/T05-T01 的决定；结果与下一办理角色：内容一致 PASS_FACT；版本/学段相冲突 CONFLICT→教务/研究生归口；权威课程源断开 SOURCE_UNAVAILABLE。政策/权限/来源现行性未核实、证据不可访问、版本不匹配或结论涉及有权机关时，必须标记待确认并转人工复核；本项仅为本地事实预审，不得自动形成学校正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "r008",
          "title": "规模、人员职责和工期事实",
          "requirement": "原文规则编号与阶段：R008 规模、人员职责和工期事实 P1。触发/例外条件：T=方案含人数、任务、实施时间；F=后续与本案无关；U=无当前具体方案；关联字段、材料与来源：SRC-004/008/011/013；F016/F017/F018；M002/M007/M013；核验方法：同表跨页对照拟承担班级、设施容量、负责人与建设期；从 E2 到实际台账 E0/E1 核事实；无校本统一人数、面积、两年工期阈值；结果与下一办理角色：自洽 PASS_FACT；内部互斥 CONFLICT→项目组；阈值/工期政策不明 POLICY_UNCONFIRMED→归口人工。政策/权限/来源现行性未核实、证据不可访问、版本不匹配或结论涉及有权机关时，必须标记待确认并转人工复核；本项仅为本地事实预审，不得自动形成学校正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "r009",
          "title": "场地坐落和使用权",
          "requirement": "原文规则编号与阶段：R009 场地坐落和使用权 P1/P3。触发/例外条件：T=B0/B1/C0 或项目实际使用固定场所；F=无物理场地建设；U=是否占用未知；关联字段、材料与来源：SRC-006/013/014；F016/F019；M002/M007/M015；核验方法：以房屋/场所 ID、使用权主体、地址、用途、日期核对 E0 房屋台账或可核 E2 合作许可；图纸属 L3，不能仅凭图片认定产权；结果与下一办理角色：匹配 PASS_FACT；地址/权属矛盾 CONFLICT→场地/国资主管；无权威源 SOURCE_UNAVAILABLE。政策/权限/来源现行性未核实、证据不可访问、版本不匹配或结论涉及有权机关时，必须标记待确认并转人工复核；本项仅为本地事实预审，不得自动形成学校正式通过或拒绝。",
          "execution": "semantic",
          "targetScope": "subject"
        },
        {
          "id": "r010",
          "title": "设备清单与现有资产",
          "requirement": "原文规则编号与阶段：R010 设备清单与现有资产 P1/P5。触发/例外条件：T=建设方案含设备；F=不涉及设备资源；U=设备清单不明；关联字段、材料与来源：SRC-002/013；F020/F036；M008/M020；核验方法：逐型号/数量/资产号比较“计划购置”与“已验收入账”，按建设方案版及外案决定时间区分；不得将设备采购作为教学建设许可；结果与下一办理角色：自洽 PASS_FACT；计划被冒作已购 CONFLICT→国资/T04；外部记录暂断 SOURCE_UNAVAILABLE。政策/权限/来源现行性未核实、证据不可访问、版本不匹配或结论涉及有权机关时，必须标记待确认并转人工复核；本项仅为本地事实预审，不得自动形成学校正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "r011",
          "title": "建设经费及资金责任",
          "requirement": "原文规则编号与阶段：R011 建设经费及资金责任 P1/P3。触发/例外条件：T=项目申请列资金来源/预算；F=无新增经费且该分支不要求预算；U=具体批次预算材料未确认；关联字段、材料与来源：SRC-002/013；F021/F036；M008/M020；核验方法：核预算版本、资金科目、承担主体和已批准预算外案；无校本可证经费上限、比例阈值，不用 AI 裁预算合理性；结果与下一办理角色：数字可核 PASS_FACT；账目矛盾 CONFLICT→财务/国资；阈值/授权未知 POLICY_UNCONFIRMED/NEEDS_HUMAN_DECISION。政策/权限/来源现行性未核实、证据不可访问、版本不匹配或结论涉及有权机关时，必须标记待确认并转人工复核；本项仅为本地事实预审，不得自动形成学校正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "r012",
          "title": "校外合作主体身份",
          "requirement": "原文规则编号与阶段：R012 校外合作主体身份 P1。触发/例外条件：T=C0、D0 合作方变更或 F0 声称共建；F=无外部合作；U=合作主体不清；关联字段、材料与来源：SRC-006/008；F022/F037；M009/M016；核验方法：以法人/机构唯一标识和签约时有效主体 E0/可核 E1、E2 比对，区分更名与新法人；SRC-006 名录只证历史存在，不是准入制度；结果与下一办理角色：主体一致 PASS_FACT；不同法人 CONFLICT→合同主管；资格准入阈值未知 POLICY_UNCONFIRMED。政策/权限/来源现行性未核实、证据不可访问、版本不匹配或结论涉及有权机关时，必须标记待确认并转人工复核；本项仅为本地事实预审，不得自动形成学校正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r013",
          "title": "合作职责及协议效力",
          "requirement": "原文规则编号与阶段：R013 合作职责及协议效力 P1/P4。触发/例外条件：T=申请声明双方教学责任或协议已签；F=纯校内建设；U=合同状态未知；关联字段、材料与来源：SRC-006/008；F023/F036；M010/M016；核验方法：逐条核教学实践、场地、安全、人员职责及合同主体/用印/有效期。拟签 M010 只能证“拟约定”；已签 M016 须由合同主管验真；校外认定另看 R023；结果与下一办理角色：草案描述自洽 PASS_FACT(拟定事实)；草案冒充生效合同 CONFLICT→合同主管；授权签约未知 NEEDS_HUMAN_DECISION。政策/权限/来源现行性未核实、证据不可访问、版本不匹配或结论涉及有权机关时，必须标记待确认并转人工复核；本项仅为本地事实预审，不得自动形成学校正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r014",
          "title": "危险源识别和风险类别",
          "requirement": "原文规则编号与阶段：R014 危险源识别和风险类别 P1/P3。触发/例外条件：T=新实验场所/实验项目含危险源；F=纯校外非实验事项且无风险触发；U=危险源调查不全；关联字段、材料与来源：SRC-014 第 7–10 条；F019/F024；M011/M012；核验方法：对照项目工艺、危险源和教学科研单位正式分类，A/B/C/D 等分类不可由模型凭关键词自定；风险等级变更要看新版论证；结果与下一办理角色：调查与有权认定相符 PASS_FACT；自评与权威冲突 CONFLICT→实验室安全主管；分级未知 NEEDS_HUMAN_DECISION。政策/权限/来源现行性未核实、证据不可访问、版本不匹配或结论涉及有权机关时，必须标记待确认并转人工复核；本项仅为本地事实预审，不得自动形成学校正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "r015",
          "title": "改扩建场所施工前论证",
          "requirement": "原文规则编号与阶段：R015 改扩建场所施工前论证 P3。触发/例外条件：T=新建/扩建/改造场所且即将施工/建设；F=不改实验场所或仍在 P1 草拟；U=施工触发事实不明；关联字段、材料与来源：SRC-014 第 9、20 条；F019/F025/F037；M007/M012；核验方法：比对场所、改造内容、正式技术安全与环保论证、拟施工时间；必须早于施工，E1 正式单位结论优于 E2 自述；结果与下一办理角色：两论证存在且时序正确 PASS_FACT；当前应有而缺 NEEDS_MATERIAL→教学科研单位/安全主管；批准可否施工仍属有权部门。政策/权限/来源现行性未核实、证据不可访问、版本不匹配或结论涉及有权机关时，必须标记待确认并转人工复核；本项仅为本地事实预审，不得自动形成学校正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "r016",
          "title": "实验项目开展前安全论证",
          "requirement": "原文规则编号与阶段：R016 实验项目开展前安全论证 P3/P5。触发/例外条件：T=拟实施具体实验项目、即将开展；F=仅建设规划尚未开展；U=实验项目或时间未明；关联字段、材料与来源：SRC-014 第 7、10 条；F024/F026；M011/M012；核验方法：核项目负责人提交的项目安全论证与单位审查、项目版、实验日期；不能拿场所建设论证子件代替；结果与下一办理角色：可核 PASS_FACT；应有未有 NEEDS_MATERIAL→项目负责人/教学科研单位；权威来源未通 SOURCE_UNAVAILABLE。政策/权限/来源现行性未核实、证据不可访问、版本不匹配或结论涉及有权机关时，必须标记待确认并转人工复核；本项仅为本地事实预审，不得自动形成学校正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "r017",
          "title": "学院教授委员会论证",
          "requirement": "原文规则编号与阶段：R017 学院教授委员会论证 P2。触发/例外条件：T=B0 设置已进入学院论证；F=其他分支或 B0 仍在 P1；U=B1 是否适用同程序未核；关联字段、材料与来源：SRC-013 第 5 条；F027/F037；M002/M004；核验方法：核 B0 对象与教授委员会正式论证、议题、时点、签发者，E1 会议记录优于 E3 签名影像；不把论证结论等同学校批准；结果与下一办理角色：记录属实 PASS_FACT；已过节点缺 NEEDS_MATERIAL→学院；主体无法验真 NEEDS_HUMAN_DECISION。政策/权限/来源现行性未核实、证据不可访问、版本不匹配或结论涉及有权机关时，必须标记待确认并转人工复核；本项仅为本地事实预审，不得自动形成学校正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "r018",
          "title": "学院党政联席会决策",
          "requirement": "原文规则编号与阶段：R018 学院党政联席会决策 P2。触发/例外条件：T=B0 设置论证后进入学院决策；F=其他类型或未到 P2；U=调整案是否同链未知；关联字段、材料与来源：SRC-013 第 5 条；F028/F037；M004/M005；核验方法：依次核真实决策组织、议题与实验室对象、日期和对教授论证的承接；M004 不可代 M005；结果与下一办理角色：记录属实 PASS_FACT；应有未有 NEEDS_MATERIAL→学院党政联席会；签发冲突 CONFLICT。政策/权限/来源现行性未核实、证据不可访问、版本不匹配或结论涉及有权机关时，必须标记待确认并转人工复核；本项仅为本地事实预审，不得自动形成学校正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "r019",
          "title": "五部门联核",
          "requirement": "原文规则编号与阶段：R019 五部门联核 P3。触发/例外条件：T=B0 设置学院决策后进入部门审核；F=非 B0 或还未送 P3；U=B1 调整是否五部门同链未明；关联字段、材料与来源：SRC-013 第 5 条；F029/F037；M005/M018；核验方法：分列教务、国资、人事、保卫、校园规划建设五部门的有权意见，按签署时机构名称与有效组织映射核；不得一个“同意”代全会签；结果与下一办理角色：五项意见事实齐 PASS_FACT；到期缺项 NEEDS_MATERIAL→对应部门；机构映射未知 NEEDS_HUMAN_DECISION。政策/权限/来源现行性未核实、证据不可访问、版本不匹配或结论涉及有权机关时，必须标记待确认并转人工复核；本项仅为本地事实预审，不得自动形成学校正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "r020",
          "title": "示范中心专业审议",
          "requirement": "原文规则编号与阶段：R020 示范中心专业审议 P3。触发/例外条件：T=E0 且 SRC-004 对应教学体系/建设重大事项需议；F=普通课程、一般校外基地；U=细则现行性或具体事项范围未定；关联字段、材料与来源：SRC-004/005；F014/F017/F037；M002/M017；核验方法：比对中心/学院、会议议题、委员任期与原细则职责；2021 委员名单非 2026 当前授权；省级认定不在此处；结果与下一办理角色：可核建议/审议 PASS_FACT→教务；当前权限未证 POLICY_UNCONFIRMED/NEEDS_HUMAN_DECISION。政策/权限/来源现行性未核实、证据不可访问、版本不匹配或结论涉及有权机关时，必须标记待确认并转人工复核；本项仅为本地事实预审，不得自动形成学校正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "r021",
          "title": "批次推荐和学院审核",
          "requirement": "原文规则编号与阶段：R021 批次推荐和学院审核 P2/P6。触发/例外条件：T=A1/F0 申报推荐或 F1 2025 结题学院审核；F=无此批次；U=当前批次通知附件不明；关联字段、材料与来源：SRC-008/011/012；F003/F008/F010/F037；M001/M006/M013/M023；核验方法：与当批学院汇总、正式推荐/审核回执和提交名单比对；推荐只证明阶段流转，不是校级/省级批准；官方索引附件未读需留待核；结果与下一办理角色：匹配 PASS_FACT；本节点明确缺件 NEEDS_MATERIAL→学院；附件不明 POLICY_UNCONFIRMED→研究生院/教务。政策/权限/来源现行性未核实、证据不可访问、版本不匹配或结论涉及有权机关时，必须标记待确认并转人工复核；本项仅为本地事实预审，不得自动形成学校正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r022",
          "title": "本科实体实验室学校设置决定",
          "requirement": "原文规则编号与阶段：R022 本科实体实验室学校设置决定 P4。触发/例外条件：T=B0 经过 P2/P3 请求校级设置决定；F=不属于该类；U=案由或审批对象未知；关联字段、材料与来源：SRC-013 第 5 条；F011/F029/F030/F037；M004/M005/M018/M019；核验方法：核学院论证、学院决策、五部门意见与分管本科教学校领导的最终签批文号、对象及版本；E0 真正签发记录优于 PDF 截图；结果与下一办理角色：真实文书存在 PASS_FACT(决定已记录)；未签发 NEEDS_HUMAN_DECISION→校领导有权流程；伪称已批 CONFLICT→教务/纪检核实。政策/权限/来源现行性未核实、证据不可访问、版本不匹配或结论涉及有权机关时，必须标记待确认并转人工复核；本项仅为本地事实预审，不得自动形成学校正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r023",
          "title": "省级创新实验与示范中心外部认定",
          "requirement": "原文规则编号与阶段：R023 省级创新实验与示范中心外部认定 P4/P6。触发/例外条件：T=A1 声称省级立项/认定或 E0 声称省/国级中心称号；F=只做校内事实审查；U=认定层级未明；关联字段、材料与来源：SRC-004/006/011；F003/F030/F032/F037；M006/M019/M024；核验方法：比对主管机关名单/公文、项目 ID、年份、级别；学校推荐、示范中心委员会意见、校外基地名录不能代主管正式认定；2025 A1 仅当批研究；结果与下一办理角色：原始决定可核 PASS_FACT(外部决定存在)；来源断 SOURCE_UNAVAILABLE→主管机关；级别推断 CONFLICT。政策/权限/来源现行性未核实、证据不可访问、版本不匹配或结论涉及有权机关时，必须标记待确认并转人工复核；本项仅为本地事实预审，不得自动形成学校正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "r024",
          "title": "研究生基地培育立项与结题结论",
          "requirement": "原文规则编号与阶段：R024 研究生基地培育立项与结题结论 P4/P6。触发/例外条件：T=F0 2023 项目立项或 F1 2025 项目验收；F=本科或不同项目；U=2026 基地是否在该批次未明确；关联字段、材料与来源：SRC-008/009/012；F003/F013/F030/F032/F037；M013/M015/M019/M023/M024；核验方法：按原批次、对象、专家/归口签批、公示和阶段分别比对；2023 “基地培育项目立项”≠独立基地设立；2025 报告≠专家验收通过；结果与下一办理角色：各阶段权威结论存在 PASS_FACT；仅有自评无验收 NEEDS_HUMAN_DECISION→研究生院；当前规则未证 POLICY_UNCONFIRMED。政策/权限/来源现行性未核实、证据不可访问、版本不匹配或结论涉及有权机关时，必须标记待确认并转人工复核；本项仅为本地事实预审，不得自动形成学校正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "r025",
          "title": "工程/合同/采购/国资等外案决定 P2–P6",
          "requirement": "原文规则编号与阶段：R025 工程/合同/采购/国资等外案决定 P2–P6。触发/例外条件：T=建设案依赖相应外部职能决定；F=本案没有该外部行动；U=依赖关系不明；关联字段、材料与来源：SRC-002/013/014，SRC-010 待核；F019–F021/F036/F037；M016/M020；核验方法：通过外案 ID、签发机关、资产/工程/合同对象、有效期、撤销状态读取 E0/E1；只读引用，不把外案复写为本 ID 批复；结果与下一办理角色：可核引用 PASS_FACT；外案源不通 SOURCE_UNAVAILABLE→相应 T04/G50 Owner；跨权责矛盾 CONFLICT。政策/权限/来源现行性未核实、证据不可访问、版本不匹配或结论涉及有权机关时，必须标记待确认并转人工复核；本项仅为本地事实预审，不得自动形成学校正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r026",
          "title": "实验开始前培训资格",
          "requirement": "原文规则编号与阶段：R026 实验开始前培训资格 P5。触发/例外条件：T=实验人员即将参加被 SRC-014 管理的实验；F=项目尚未开展、未确定实验人员；U=参与人员/开实验节点未定；关联字段、材料与来源：SRC-014 第 11 条；F017/F024/F037；M021；核验方法：核实际实验项目/人员、培训考试或安全教育有效记录及日期；不要求 P1 就交以后才招收学生的名单；结果与下一办理角色：已满足事实 PASS_FACT；已到节点缺有效记录 NEEDS_MATERIAL→实验室安全/教学单位；学校平台无访问权 SOURCE_UNAVAILABLE。政策/权限/来源现行性未核实、证据不可访问、版本不匹配或结论涉及有权机关时，必须标记待确认并转人工复核；本项仅为本地事实预审，不得自动形成学校正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r027",
          "title": "真实实施进度",
          "requirement": "原文规则编号与阶段：R027 真实实施进度 P5。触发/例外条件：T=已有项目决定进入建设期；F=尚在初申；U=历史批复效力未知；关联字段、材料与来源：SRC-008/011/013；F018/F030/F031；M015/M019/M022；核验方法：将批准计划的里程碑与真实建设记录对照，同一项目版；2025 创新实验两年期不外推他批；异常进度只作事实差异，延期需另走 R032；结果与下一办理角色：一致 PASS_FACT；矛盾 CONFLICT→项目负责人/归口；调整许可未知 NEEDS_HUMAN_DECISION。政策/权限/来源现行性未核实、证据不可访问、版本不匹配或结论涉及有权机关时，必须标记待确认并转人工复核；本项仅为本地事实预审，不得自动形成学校正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "r028",
          "title": "年度/结题报告事实",
          "requirement": "原文规则编号与阶段：R028 年度/结题报告事实 P6。触发/例外条件：T=示范中心、本科实体实验室效益评价或到期结题项目；F=尚未进入年度/结题节点；U=该基地项目报告义务未核；关联字段、材料与来源：SRC-004/008/012/013 第 30–33 条；F018/F031/F032；M015/M022/M023；核验方法：核报告年度、实施主体、建设版本、成果明细；2025 F1 仅该当批，报告不等于专家已签认可；结果与下一办理角色：报告真实可核 PASS_FACT(已报送)；应有而缺 NEEDS_MATERIAL→中心/学院/负责人；义务未知 POLICY_UNCONFIRMED。政策/权限/来源现行性未核实、证据不可访问、版本不匹配或结论涉及有权机关时，必须标记待确认并转人工复核；本项仅为本地事实预审，不得自动形成学校正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "r029",
          "title": "专家验收、年度结论和公示",
          "requirement": "原文规则编号与阶段：R029 专家验收、年度结论和公示 P6。触发/例外条件：T=该项目已进入有权验收/评价后段；F=仅上交自评材料尚未专家评审；U=评审类型和权力未明；关联字段、材料与来源：SRC-004/008/011/012/013；F030/F032/F037；M023/M024；核验方法：比对原始专家名单/有权委员会、项目、评价年度、结论形成时间与公示；E0/E1 结果不能被 E2 自评替代；结果与下一办理角色：真实结果 PASS_FACT(结果已记录)；尚待决定 NEEDS_HUMAN_DECISION→专家组/归口；无法核源 SOURCE_UNAVAILABLE。政策/权限/来源现行性未核实、证据不可访问、版本不匹配或结论涉及有权机关时，必须标记待确认并转人工复核；本项仅为本地事实预审，不得自动形成学校正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r030",
          "title": "既有对象变更理由与新旧版",
          "requirement": "原文规则编号与阶段：R030 既有对象变更理由与新旧版 P1/P7。触发/例外条件：T=B1/D0/E0 重大变更或已批方案修订；F=全新无既有决定项目；U=是否触及原审批对象未知；关联字段、材料与来源：SRC-004/013/014；F013/F019–F024/F033/F034；M014/M015/M007/M008；核验方法：逐字段 old→new 绑定原决定和资源/风险影响，变场所须新安全论证；校本虽要求相关批准，但B1 五部门同链未证；结果与下一办理角色：变化事实可核 PASS_FACT；原版错绑 CONFLICT→归口；要不要新批准 NEEDS_HUMAN_DECISION→学校相应审批机关。政策/权限/来源现行性未核实、证据不可访问、版本不匹配或结论涉及有权机关时，必须标记待确认并转人工复核；本项仅为本地事实预审，不得自动形成学校正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "r031",
          "title": "校外基地续约及效力",
          "requirement": "原文规则编号与阶段：R031 校外基地续约及效力 P1/P4。触发/例外条件：T=D0 合作期限到期/更换相对方；F=无已有基地续约；U=协议有效期或授权未知；关联字段、材料与来源：SRC-006（仅历史名单）；F013/F022/F023/F033/F034/F036；M014/M015/M016/M009/M010；核验方法：核旧协议届满、签约主体、拟续约与实际新签版本；不设“提前 30 天申请”等无校本依据期限；旧协议不自动延期；结果与下一办理角色：当前合同事实 PASS_FACT；新协议未签不得当续约完成 NEEDS_HUMAN_DECISION→合同/教务；校本续建制度未知 POLICY_UNCONFIRMED。政策/权限/来源现行性未核实、证据不可访问、版本不匹配或结论涉及有权机关时，必须标记待确认并转人工复核；本项仅为本地事实预审，不得自动形成学校正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r032",
          "title": "补件、撤回、延期、撤项的申请资格",
          "requirement": "原文规则编号与阶段：R032 补件、撤回、延期、撤项的申请资格 P7。触发/例外条件：T=H0 发起动作；F=无补正/申请动作；U=原批次/权利渠道未知；关联字段、材料与来源：SRC-008/012；F003/F007/F009/F013/F034/F035；M015/M025；核验方法：核原案、当前真实权限、动作种类、申请时点和适用批次；F1 2025 有延期/撤项表，不证明其他分支随时可撤回；原决定不能凭申请自动作废；结果与下一办理角色：申请事实 PASS_FACT(请求存在)；权利时限未知 POLICY_UNCONFIRMED→归口；是否同意 NEEDS_HUMAN_DECISION→有权受理者。政策/权限/来源现行性未核实、证据不可访问、版本不匹配或结论涉及有权机关时，必须标记待确认并转人工复核；本项仅为本地事实预审，不得自动形成学校正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r033",
          "title": "异议/复核请求合法路由",
          "requirement": "原文规则编号与阶段：R033 异议/复核请求合法路由 P7。触发/例外条件：T=当事人要求复核、异议；F=无复核请求；U=无当批复核制度或期限；关联字段、材料与来源：SRC-008/011/012（未核复核条款）；F003/F005/F007/F009/F035/F037；M015/M026；核验方法：将诉求关联被质疑的具体结论/规则/证据版，校验受理机关和期限；未找到现行校本异议途径时只记录请求，不伪造救济权；结果与下一办理角色：请求事实 PASS_FACT，权利适用 POLICY_UNCONFIRMED→归口告知；审查实体结论 NEEDS_HUMAN_DECISION→真正复核机关。政策/权限/来源现行性未核实、证据不可访问、版本不匹配或结论涉及有权机关时，必须标记待确认并转人工复核；本项仅为本地事实预审，不得自动形成学校正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r034",
          "title": "人工撤项/延期/复核答复",
          "requirement": "原文规则编号与阶段：R034 人工撤项/延期/复核答复 P7。触发/例外条件：T=相应有权机关已经办理 R032/R033；F=尚未进入处理；U=处理机关真伪/结果未核；关联字段、材料与来源：SRC-008/012；F030/F035/F037/F038；M025/M026/M027；核验方法：核处理文书原件、案号、决定者岗位权限、时点与旧版结果的关系；区分“收到请求”与“准予撤回/延期/撤项/复核改变结论”；结果与下一办理角色：可核处理存在 PASS_FACT(答复已记录)→案卷经办；未作决定 NEEDS_HUMAN_DECISION→原主管；伪回执 CONFLICT。政策/权限/来源现行性未核实、证据不可访问、版本不匹配或结论涉及有权机关时，必须标记待确认并转人工复核；本项仅为本地事实预审，不得自动形成学校正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r035",
          "title": "实验室安全停用、整改及恢复",
          "requirement": "原文规则编号与阶段：R035 实验室安全停用、整改及恢复 P5/P7。触发/例外条件：T=发生安全隐患/停用、恢复申请；F=无相关处置事件；U=是否有未闭合隐患未知；关联字段、材料与来源：SRC-014 第 20、30 条；F019/F024/F039/F037；M012/M028；核验方法：核安全主管原始停用/整改/恢复决定、对象和整改后版本；不能拿教学建设批准或项目说明替代安全恢复许可；结果与下一办理角色：状态可核 PASS_FACT(记录事实)；记录冲突 CONFLICT→安全主管；是否恢复 NEEDS_HUMAN_DECISION→有权机关。政策/权限/来源现行性未核实、证据不可访问、版本不匹配或结论涉及有权机关时，必须标记待确认并转人工复核；本项仅为本地事实预审，不得自动形成学校正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "r036",
          "title": "证据版本、可读性、来源与归属完整性（全 P）",
          "requirement": "原文规则编号与阶段：R036 证据版本、可读性、来源与归属完整性（全 P）。触发/例外条件：T=任一 R 实际引用文件/外案；F=纯不依赖材料的路由；U=附件位置或绑定目标不明；关联字段、材料与来源：SRC-004/008/012/013/014（按原 R 继承）；F011/F013/F034/F038；M001–M028；核验方法：对每个 M 查原件可读页、文书签发者、对象 ID/批次/时间、SHA-256、签发/抓取时点，保留 supersedes；来源 E3 不冒充 E0；同一材料替换需受影响 R 失效重核；结果与下一办理角色：完整可归属 PASS_FACT→当前审核人；不可读 UNREADABLE→持有人；原始来源断 SOURCE_UNAVAILABLE→数据 Owner；错案引用 CONFLICT→归口。政策/权限/来源现行性未核实、证据不可访问、版本不匹配或结论涉及有权机关时，必须标记待确认并转人工复核；本项仅为本地事实预审，不得自动形成学校正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "group"
        }
      ]
    }
  ],
  "policyVersionIds": [],
  "policyRefs": [],
  "stages": [
    {
      "id": "intake",
      "name": "P0 事项路由与适用政策识别",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "fact-review",
      "workflowOwner": "local"
    },
    {
      "id": "fact-review",
      "name": "P1–P3 建设方案、前置条件与事实核验",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "policy-review",
      "returnToStageId": "intake",
      "workflowOwner": "local"
    },
    {
      "id": "policy-review",
      "name": "P4–P7 执行、安全、验收、整改与归档事实核验",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "finalize",
      "returnToStageId": "fact-review",
      "workflowOwner": "local"
    },
    {
      "id": "finalize",
      "name": "有权人员人工复核与本地结果记录",
      "kind": "finalize",
      "executorRole": "teacher",
      "workflowOwner": "local"
    }
  ],
  "outputs": [
    {
      "id": "review-feedback",
      "kind": "item-feedback",
      "audience": "reviewer"
    },
    {
      "id": "supplement-list",
      "kind": "supplement-list",
      "audience": "reviewer"
    },
    {
      "id": "local-review-ledger",
      "kind": "roster",
      "audience": "teacher"
    }
  ],
  "autoPassPolicy": {
    "enabled": false
  },
  "status": "draft",
  "createdAt": "2026-10-24T00:00:00.000Z"
}

export const r02Metadata = {
  "templateId": "T05-T07",
  "name": "实验课程及教学实践基地建设审核",
  "sourceDocumentPath": "docs/design/review-agent/business-templates/R02/T05-T07.md",
  "sourceDocumentSha256": "0288dce07690e8e06e89069c7851eec8125d264cac47d7740e20b3660017129c",
  "sourceOriginalBlobSha1": "0c9ba1835b6d6f75aa92446c42708b72002f0e9b",
  "sourceManifestBytes": 132480,
  "sourceManifestSha256": "0288dce07690e8e06e89069c7851eec8125d264cac47d7740e20b3660017129c",
  "sourceDocumentBytes": 132480,
  "sourceDisplayedBytes": 132479,
  "sourceIntegrityStatus": "MATCHED_MANIFEST",
  "officialSchoolTemplate": false,
  "researchAsOf": "2026-10-22",
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
    "SRC-014"
  ],
  "criteria": [
    {
      "sectionId": "rules-001-036",
      "criterionId": "r001",
      "sourceIds": [
        "SRC-001",
        "SRC-004",
        "SRC-006",
        "SRC-008",
        "SRC-013"
      ],
      "evidenceStatus": "PARTIAL",
      "evidenceNote": "SRC IDs are research-source references, not case material SourceRef; this evidence status does not create a PolicyVersion or confer school authority."
    },
    {
      "sectionId": "rules-001-036",
      "criterionId": "r002",
      "sourceIds": [
        "SRC-004",
        "SRC-007",
        "SRC-008",
        "SRC-011",
        "SRC-012",
        "SRC-013",
        "SRC-014"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "evidenceNote": "SRC IDs are research-source references, not case material SourceRef; this evidence status does not create a PolicyVersion or confer school authority."
    },
    {
      "sectionId": "rules-001-036",
      "criterionId": "r003",
      "sourceIds": [
        "SRC-008",
        "SRC-009",
        "SRC-011",
        "SRC-012"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "evidenceNote": "SRC IDs are research-source references, not case material SourceRef; this evidence status does not create a PolicyVersion or confer school authority."
    },
    {
      "sectionId": "rules-001-036",
      "criterionId": "r004",
      "sourceIds": [
        "SRC-008",
        "SRC-011",
        "SRC-013"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "evidenceNote": "SRC IDs are research-source references, not case material SourceRef; this evidence status does not create a PolicyVersion or confer school authority."
    },
    {
      "sectionId": "rules-001-036",
      "criterionId": "r005",
      "sourceIds": [
        "SRC-008",
        "SRC-011"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "evidenceNote": "SRC IDs are research-source references, not case material SourceRef; this evidence status does not create a PolicyVersion or confer school authority."
    },
    {
      "sectionId": "rules-001-036",
      "criterionId": "r006",
      "sourceIds": [
        "SRC-006",
        "SRC-008",
        "SRC-013"
      ],
      "evidenceStatus": "PARTIAL",
      "evidenceNote": "SRC IDs are research-source references, not case material SourceRef; this evidence status does not create a PolicyVersion or confer school authority."
    },
    {
      "sectionId": "rules-001-036",
      "criterionId": "r007",
      "sourceIds": [
        "SRC-001",
        "SRC-004",
        "SRC-013"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "evidenceNote": "SRC IDs are research-source references, not case material SourceRef; this evidence status does not create a PolicyVersion or confer school authority."
    },
    {
      "sectionId": "rules-001-036",
      "criterionId": "r008",
      "sourceIds": [
        "SRC-004",
        "SRC-008",
        "SRC-011",
        "SRC-013"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "evidenceNote": "SRC IDs are research-source references, not case material SourceRef; this evidence status does not create a PolicyVersion or confer school authority."
    },
    {
      "sectionId": "rules-001-036",
      "criterionId": "r009",
      "sourceIds": [
        "SRC-006",
        "SRC-013",
        "SRC-014"
      ],
      "evidenceStatus": "PARTIAL",
      "evidenceNote": "SRC IDs are research-source references, not case material SourceRef; this evidence status does not create a PolicyVersion or confer school authority."
    },
    {
      "sectionId": "rules-001-036",
      "criterionId": "r010",
      "sourceIds": [
        "SRC-002",
        "SRC-013"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "evidenceNote": "SRC IDs are research-source references, not case material SourceRef; this evidence status does not create a PolicyVersion or confer school authority."
    },
    {
      "sectionId": "rules-001-036",
      "criterionId": "r011",
      "sourceIds": [
        "SRC-002",
        "SRC-013"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "evidenceNote": "SRC IDs are research-source references, not case material SourceRef; this evidence status does not create a PolicyVersion or confer school authority."
    },
    {
      "sectionId": "rules-001-036",
      "criterionId": "r012",
      "sourceIds": [
        "SRC-006",
        "SRC-008"
      ],
      "evidenceStatus": "PARTIAL",
      "evidenceNote": "SRC IDs are research-source references, not case material SourceRef; this evidence status does not create a PolicyVersion or confer school authority."
    },
    {
      "sectionId": "rules-001-036",
      "criterionId": "r013",
      "sourceIds": [
        "SRC-006",
        "SRC-008"
      ],
      "evidenceStatus": "PARTIAL",
      "evidenceNote": "SRC IDs are research-source references, not case material SourceRef; this evidence status does not create a PolicyVersion or confer school authority."
    },
    {
      "sectionId": "rules-001-036",
      "criterionId": "r014",
      "sourceIds": [
        "SRC-014"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "evidenceNote": "SRC IDs are research-source references, not case material SourceRef; this evidence status does not create a PolicyVersion or confer school authority."
    },
    {
      "sectionId": "rules-001-036",
      "criterionId": "r015",
      "sourceIds": [
        "SRC-014"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "evidenceNote": "SRC IDs are research-source references, not case material SourceRef; this evidence status does not create a PolicyVersion or confer school authority."
    },
    {
      "sectionId": "rules-001-036",
      "criterionId": "r016",
      "sourceIds": [
        "SRC-014"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "evidenceNote": "SRC IDs are research-source references, not case material SourceRef; this evidence status does not create a PolicyVersion or confer school authority."
    },
    {
      "sectionId": "rules-001-036",
      "criterionId": "r017",
      "sourceIds": [
        "SRC-013"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "evidenceNote": "SRC IDs are research-source references, not case material SourceRef; this evidence status does not create a PolicyVersion or confer school authority."
    },
    {
      "sectionId": "rules-001-036",
      "criterionId": "r018",
      "sourceIds": [
        "SRC-013"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "evidenceNote": "SRC IDs are research-source references, not case material SourceRef; this evidence status does not create a PolicyVersion or confer school authority."
    },
    {
      "sectionId": "rules-001-036",
      "criterionId": "r019",
      "sourceIds": [
        "SRC-013"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "evidenceNote": "SRC IDs are research-source references, not case material SourceRef; this evidence status does not create a PolicyVersion or confer school authority."
    },
    {
      "sectionId": "rules-001-036",
      "criterionId": "r020",
      "sourceIds": [
        "SRC-004",
        "SRC-005"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "evidenceNote": "SRC IDs are research-source references, not case material SourceRef; this evidence status does not create a PolicyVersion or confer school authority."
    },
    {
      "sectionId": "rules-001-036",
      "criterionId": "r021",
      "sourceIds": [
        "SRC-008",
        "SRC-011",
        "SRC-012"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "evidenceNote": "SRC IDs are research-source references, not case material SourceRef; this evidence status does not create a PolicyVersion or confer school authority."
    },
    {
      "sectionId": "rules-001-036",
      "criterionId": "r022",
      "sourceIds": [
        "SRC-013"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "evidenceNote": "SRC IDs are research-source references, not case material SourceRef; this evidence status does not create a PolicyVersion or confer school authority."
    },
    {
      "sectionId": "rules-001-036",
      "criterionId": "r023",
      "sourceIds": [
        "SRC-004",
        "SRC-006",
        "SRC-011"
      ],
      "evidenceStatus": "PARTIAL",
      "evidenceNote": "SRC IDs are research-source references, not case material SourceRef; this evidence status does not create a PolicyVersion or confer school authority."
    },
    {
      "sectionId": "rules-001-036",
      "criterionId": "r024",
      "sourceIds": [
        "SRC-008",
        "SRC-009",
        "SRC-012"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "evidenceNote": "SRC IDs are research-source references, not case material SourceRef; this evidence status does not create a PolicyVersion or confer school authority."
    },
    {
      "sectionId": "rules-001-036",
      "criterionId": "r025",
      "sourceIds": [
        "SRC-002",
        "SRC-010",
        "SRC-013",
        "SRC-014"
      ],
      "evidenceStatus": "PARTIAL",
      "evidenceNote": "SRC IDs are research-source references, not case material SourceRef; this evidence status does not create a PolicyVersion or confer school authority."
    },
    {
      "sectionId": "rules-001-036",
      "criterionId": "r026",
      "sourceIds": [
        "SRC-014"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "evidenceNote": "SRC IDs are research-source references, not case material SourceRef; this evidence status does not create a PolicyVersion or confer school authority."
    },
    {
      "sectionId": "rules-001-036",
      "criterionId": "r027",
      "sourceIds": [
        "SRC-008",
        "SRC-011",
        "SRC-013"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "evidenceNote": "SRC IDs are research-source references, not case material SourceRef; this evidence status does not create a PolicyVersion or confer school authority."
    },
    {
      "sectionId": "rules-001-036",
      "criterionId": "r028",
      "sourceIds": [
        "SRC-004",
        "SRC-008",
        "SRC-012",
        "SRC-013"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "evidenceNote": "SRC IDs are research-source references, not case material SourceRef; this evidence status does not create a PolicyVersion or confer school authority."
    },
    {
      "sectionId": "rules-001-036",
      "criterionId": "r029",
      "sourceIds": [
        "SRC-004",
        "SRC-008",
        "SRC-011",
        "SRC-012",
        "SRC-013"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "evidenceNote": "SRC IDs are research-source references, not case material SourceRef; this evidence status does not create a PolicyVersion or confer school authority."
    },
    {
      "sectionId": "rules-001-036",
      "criterionId": "r030",
      "sourceIds": [
        "SRC-004",
        "SRC-013",
        "SRC-014"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "evidenceNote": "SRC IDs are research-source references, not case material SourceRef; this evidence status does not create a PolicyVersion or confer school authority."
    },
    {
      "sectionId": "rules-001-036",
      "criterionId": "r031",
      "sourceIds": [
        "SRC-006"
      ],
      "evidenceStatus": "PARTIAL",
      "evidenceNote": "SRC IDs are research-source references, not case material SourceRef; this evidence status does not create a PolicyVersion or confer school authority."
    },
    {
      "sectionId": "rules-001-036",
      "criterionId": "r032",
      "sourceIds": [
        "SRC-008",
        "SRC-012"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "evidenceNote": "SRC IDs are research-source references, not case material SourceRef; this evidence status does not create a PolicyVersion or confer school authority."
    },
    {
      "sectionId": "rules-001-036",
      "criterionId": "r033",
      "sourceIds": [
        "SRC-008",
        "SRC-011",
        "SRC-012"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "evidenceNote": "SRC IDs are research-source references, not case material SourceRef; this evidence status does not create a PolicyVersion or confer school authority."
    },
    {
      "sectionId": "rules-001-036",
      "criterionId": "r034",
      "sourceIds": [
        "SRC-008",
        "SRC-012"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "evidenceNote": "SRC IDs are research-source references, not case material SourceRef; this evidence status does not create a PolicyVersion or confer school authority."
    },
    {
      "sectionId": "rules-001-036",
      "criterionId": "r035",
      "sourceIds": [
        "SRC-014"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "evidenceNote": "SRC IDs are research-source references, not case material SourceRef; this evidence status does not create a PolicyVersion or confer school authority."
    },
    {
      "sectionId": "rules-001-036",
      "criterionId": "r036",
      "sourceIds": [
        "SRC-004",
        "SRC-008",
        "SRC-012",
        "SRC-013",
        "SRC-014"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "evidenceNote": "SRC IDs are research-source references, not case material SourceRef; this evidence status does not create a PolicyVersion or confer school authority."
    }
  ]
} as const
