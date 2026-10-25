# 档案利用申请审核｜完整单模板规范 v1.5

> **文件用途**：直接供审核模板编辑器设计、模块抽取、规则实现、模拟审核及后续回归测试。该文件自身为完整纯 Markdown 文档，表格、示例与约定均内嵌，不依赖专有编辑器才能阅读。
>
> **标准模板名称（唯一）**：档案利用申请审核。
>
> **定位**：G01 师生共有领域的一套审核模板；本人、委托、单位因公、查阅、摘录、复制、出具档案证明、外借、受限档案等，均是本模板中的条件分支，**不构成新增模板**。
>
> **状态**：业务规则 **可用于模板草稿实现与模拟测试**；尚未通过该项目真实 OCR/模型/审核引擎的端到端验收，也未取得成都理工大学 2026 年三张审批表的完整原件及部分校内现行制度文本，不能声称已正式上线。
>
> **版本沿革**：继承 v1.4 的逐档案件×逐操作授权、不越权审批、规则版本及校本参数原则；结合试点 v1 的 16 件模拟申请、21 个操作预期，以及截至 2026-10-10 对 GitHub 仓库主分支的静态接口核对。
>
> **最重要的约束**：**材料符合要求 ≠ 档案馆已经批准 ≠ 档案已交付**。AI 只提出可追溯的预审意见；正式档案利用、签批、原件借出、实际复制件交付由有权部门及其可信系统处理。

---

## 0. 怎样使用本文件

### 0.1 这一份文档同时定义四种东西，但不混为一谈

| 对象 | 本文位置 | 作用 | 不是 |
|---|---|---|---|
| 完整业务模板 | 全文 | 定义一次“档案利用申请审核”的目的、范围、证据及结论 | 某所高校的现行全套管理办法 |
| 条件规则集合 | 第 6、7、8 节 | 按申请类型、档案类别、操作、状态、时间激活规则 | 若干独立模板 |
| 可复用模块候选 | 第 12 节 | 给编辑器开发者抽取稳定、跨模板可复用的配置单元 | 每个业务分支都要做一个独立微服务 |
| 系统映射及测试契约 | 第 13—15 节 | 解释如何映射到现有 V2 字段/分项/材料槽/规则/输出和测试包 | 已通过真实模型或校方接口的证明 |

### 0.2 文中的标记含义

| 标记 | 含义 | 是否能直接把“缺此材料”判为不符合 |
|---|---|---|
| `LEGAL` | 有效上位规定提出的权限或安全限制；具体适用需结合档案性质 | 仅在明确适用、且确属申请人应履行义务时；原则上不能由此推导固定材料名称 |
| `CD_VERIFIED` | 成都理工大学公开制度/指南明确出现的要求或办事路径 | 可以作为校本候选强制规则，但需确认现行适用版本、办理情形和阶段 |
| `CROSS_SCHOOL` | 其他高校官方制度、表单或 FAQ 的实际做法 | **不能**自动变成成都理工强制条件；经对应学校正式启用方可生效 |
| `UNIVERSAL_DESIGN` | 为保证审核准确性建议的数据结构、核验步骤或缺口描述 | 默认仅作提示、补录或“待核”，不产生无依据拒件 |
| `CONFIG_PENDING` | 尚未取得本校规则原文、角色授权或可信业务接口 | 不得据此否决；涉及授权时也不得自动放行 |
| `SIMULATION_ONLY` | 为隔离金标准的试点虚构高校 A 审核规则 | 仅试验中的虚构高校A；绝不对应成都理工 |

**证据来源 ≠ 规则是否生效。** `source_type` 记录来源等级；`active` 必须通过 `受理学校 + 档案类别 + 利用方式 + 申请主体 + 办理日期/渠道 + 阶段 + 规则版本` 完整匹配得到。未匹配到的外校规则不能进入成都理工拒件计算。任何事实不明保留“未知”，不可当成否定或肯定。

### 0.3 审核范围的一句话定义

**给一份申请中每个档案件的每种利用操作，核对申请资格、证据关系、档案状态和程序授权，逐项产出可复核预审结果，并把最终审批与交付留给有权部门。**

## 1. 业务边界与责任分工

### 1.1 应该由本模板办理的典型目的

- 本人申请历史学籍档案归档材料或加盖档案馆章的复制件（如服务制度规定需要核验）。
- 受托人代理申请某人归档材料，需验证受托人身份及委托范围。
- 校内/校外单位因公申请查阅特定综合档案，需查验单位资质和业务用途。
- 申请对特定档案进行摘录、复制、扫描、出具经档案馆确认的证明；对操作逐一核权限。
- 申请外借档案原件，需核验更高限制的审批、责任和交接条件。
- 混合申请：一单多档案、多种操作、部分需补、部分待授权、部分转专门权限流程。

### 1.2 必须显式分流，而不能顺便审核通过的内容

| 情形 | 去向 | 原因 |
|---|---|---|
| 已经可以从可信服务直接下载在读证明、电子成绩单 | 自助证明服务 | 无需再次构造材料审批链 |
| 人事干部档案的专门组织授权 | 独立的「人事档案利用授权审核」或授权组织部门 | 人事档案权限、经办资格、回避义务与普通查档不同 |
| 学生个人档案原卷限制性查阅 | 本模板内限制性路径或有权单位专门办理 | 不能凭“我是本人”获得原卷阅览权 |
| 档案转递/调档函处理 | 转递流程 | 借阅/复制与实际交接、归档责任不同 |
| 政审意见出具、思想品德实质鉴定 | 政审材料程序审核及有权组织 | 不能用档案利用许可代替组织意见 |
| 证书内容更正或档案原件修改 | 更正或档案管理专门流程 | 本模板仅核“利用”而非修改原始内容 |
| 解密、开放范围最终认定、电子库房 ACL 更改 | 保密/档案馆授权流程 | 必须由有权主体而不是模型作决定 |

### 1.3 角色边界（用户角色不等于法定审批资格）

| 主体角色 | 可以申请什么 | 系统能够预审什么 | 系统不能代替什么 |
|---|---|---|---|
| 申请人（本人） | 依法依规可申请的本人资料 | 身份与被查档对象关联、需求描述、材料完整性 | 判断所有涉本人档案都可调阅 |
| 被委托人 | 委托书覆盖的限定事项 | 本人与受托人的关系、委托时间和权限范围 | 扩大委托至未授权档案或操作 |
| 校内经办人 | 所属部门获准办理的因公事项 | 单位、职务、工作事由、内部授权记录 | 认定某单位天然有权查任何档案 |
| 校外单位经办人 | 受理学校明确接受的公务/法定事项 | 正式函件、身份、事项范围 | 凭单位章越过馆方许可 |
| 档案馆业务审核员 | 依校规受理、核验与签署 | 对AI事实、缺口、请求范围逐项复核 | 将AI结论视为已经签批 |
| 档案形成部门/保密部门 | 在权限范围内出具专项许可 | 本系统记录可信许可回执及具体限制 | 被一个不具名印章替代 |
| 最终授权部门/馆方执行员 | 按制度作出准入、复制或借还决定 | 读取逐项预审、办理实际交接 | 在没有正式权限时自动交档 |

---

## 2. 统一数据模型（强制区分四层对象）

### 2.1 四层关系与基数

1. **申请单 `application`**（1份）：受理学校、当时适用制度、申请人、办理阶段、递交渠道、共享证明。
2. **主体/授权关系 `party_relationships`**（0—多条）：本人、被代理人、委托人、单位授权经办人与有权审批方；代理和因公资格可以同时存在但必须分别证明。
3. **档案件 `archive_items`**（1—多件）：每件独立的档案类型、对象、归档年度、馆藏定位与公开/开放/隐私限制状态。
4. **利用操作 `operations`**（每件1—多项）：如 `item=I01 & operation=view` 与 `item=I01 & operation=copy`，分别判断范围、数量、审批和结果。

**一个 `operation_key` 必须唯一**：`case_id + item_id + operation_id`。对同一档案件的“查阅”和“复制”是两项审核对象；同时请求两种操作时不得将查阅授权自动传给复制操作。

### 2.2 业务粒度与来源粒度

- 案卷级字段可在同一申请内复用；档案件级与操作级事实必须放在自己的对象里。
- 一份附件可支持多项请求（如同一委托书），但每个绑定都应独立记录覆盖的对象和操作；不允许因附件共享而复制权限。
- 规则的 `target_scope` 应当明确为 `application | relationship | item | operation | evidence | workflow`；实现层可映射 V2 `case/subject/group`，不得丢失业务层的细分。
- OCR识别出的“看上去开放”与档案馆确认的 `access_status=open` 是不同来源层级；后者是授权门控事实。

### 2.3 推荐的标准状态与枚举

| 枚举对象 | 推荐值 | 规则说明 |
|---|---|---|
| `applicant_type` | `self`, `proxy`, `internal_unit`, `external_unit` | 可有复合主体关系，不宜把代理+因公硬编码为第五个模板 |
| `archive_type` | `historical_school_record`, `student_personnel_archive`, `general_archive`, `staff_personnel_archive`, `other_special` | 类别是路由线索，不是由AI决定实际馆藏性质的权威记录 |
| `operation_type` | `view`, `excerpt`, `copy`, `certified_copy`, `borrow_original` | 同时请求按操作逐项计数；`certified_copy` 的证明效力由馆方提供 |
| `archive_location_status` | `located`, `not_located`, `unknown` | 找不到≠未存在；未知应交馆方核实 |
| `publication_state` | `published`, `not_published`, `unknown` | 已公布目录不等于已开放整个全文 |
| `access_state` | `open`, `not_open`, `restricted`, `classified`, `unknown` | 必须有可信来源；与公布状态正交 |
| `restriction_flags` | `third_party_privacy`, `technical_secret`, `business_secret`, `valuable_original`, `other` | 是可叠加的限制标志，不应覆盖开放状态 |
| `verification_state` | `verified`, `unverified`, `conflicted`, `not_available` | “用户上传”不自动成为真实授权 |
| `review_stage` | `submission`, `pre_review`, `authority_review`, `post_decision` | 未到签批阶段不可因无终审批章判申请材料缺件 |
| `authorization_state` | `approved`, `denied`, `pending`, `unknown`, `expired`, `not_applicable` | `pending`不能按`denied`处理；授权须逐操作逐范围核对 |
| `policy_status` | `active`, `out_of_scope`, `unconfirmed`, `conflict`, `expired` | 不适用与尚不知是否适用不同 |

### 2.4 主体关系的关键约束

- `applicant` 是提交动作的人；`principal` 是以谁的名义申请；`archive_subject` 是档案有关的个人或组织；`authorizing_entity` 才是正式授权机构。
- `applicant == archive_subject` 不能推出查阅权成立；`applicant != archive_subject` 也不能自动推出违规，受托或因公可能合法。
- 单位经办只证明机构委派，并不自动替代私人被代理人的委托；二者分别需要对应证据。
- 身份编号可能包含敏感信息，实际渲染与日志应支持脱敏；测试使用虚构信息。

## 3. 字段字典（编辑器可直接借此抽取字段模块）

### 3.1 字段定义的最低规范

每个字段应有：`field_id`（稳定）、中文名、作用层级、值类型、数据提供者、何时需要、证据来源/置信状态、对外可见性、能否由系统预填、默认未提供时的处理方式。特别是 `required=true` 应是**应用学校规则及办理情形后求出的结果**，不是把字段字典所有行一次性标为必填。

推荐字段层级为：`application`/`relationship`/`item`/`operation`/`evidence`/`workflow`。目前 V2 `FieldSpec.scope` 只有 case/subject，因此要把 `item+operation` 作为 subject 的稳定业务键实现，而不是伪称 V2 已有任意层级字段。

### 3.2 全字段表（50项候选语义字段）

| ID | 字段 | 所属层 | 值类型 | 默认取得方式/性质 | 何时激活 | 候选模块 | 重要边界 |
|---|---|---|---|---|---|---|---|
| F001 | 受理学校标识 | application | enum/text | 系统/路由 | 所有申请 | M01 | 不得推断档案形成学校=受理学校 |
| F002 | 受理馆/部门 | application | text | 系统/路由 | 所有申请 | M01 | 不同部门可能保管不同档案 |
| F003 | 申请单ID | application | text | 系统生成 | 所有申请 | M01 | 一单内多件多操作 |
| F004 | 提交时间 | application | datetime | 系统可信记录 | 所有申请 | M02 | 决定临时公告与制度版本 |
| F005 | 业务阶段 | application | enum | 系统可信记录 | 所有申请 | M07 | 不能把待签批当缺件 |
| F006 | 渠道 | application | enum | 用户/系统 | 所有申请 | M02 | 仅触发有效渠道规则 |
| F007 | 制度快照/版本ID | application | text | 系统规则解析 | 所有申请 | M02 | 未确认版本进入待配置 |
| F008 | 申请人姓名及身份类别 | application | object | 申报+系统核验 | 所有申请 | M03 | 法定身份证明具体格式按校规 |
| F009 | 申请人身份标识 | application | text | 用户或身份接口 | 需要建立主体关联 | M03 | 不一律要求上传证件双面 |
| F010 | 申请人单位/联系信息 | application | object | 条件推荐 | 单位因公或送达 | M03 | 允许系统预填 |
| F011 | 代理委托人 | relationship | object | 条件必要 | proxy | M04 | 不可与受托人混为一人 |
| F012 | 委托范围 | relationship | object | 条件必要 | proxy | M04 | 要覆盖档案/利用方式/时间 |
| F013 | 委托生效时间 | relationship | date-range | 条件必要 | proxy且制度要求 | M04 | 超过生效范围不得扩大权限 |
| F014 | 受托人身份 | relationship | object | 条件必要 | proxy | M04 | 需有可核的身份关联 |
| F015 | 机构授权主体 | relationship | object | 条件必要 | internal_unit/external_unit | M05 | 单位名称不等于授权主体有效 |
| F016 | 经办人单位资格 | relationship | object | 条件必要 | 单位因公 | M05 | 正式函/授权接口择一/合用依校规 |
| F017 | 因公事由 | relationship | text | 条件必要 | 单位因公 | M05 | 需与函件具体用途相匹配 |
| F018 | 人事/档案主管审批身份 | relationship | object | 人工/系统核验 | 限制性档案/操作 | M06 | 权限由有权部门认定 |
| F019 | 档案件ID | item | text | 系统生成 | 所有请求 | M08 | 与operation_id组成稳定键 |
| F020 | 档案标题/材料名称 | item | text | 用户/馆藏 | 所有请求 | M08 | 允许模糊但足以检索 |
| F021 | 档案类型 | item | enum | 申报初选+馆方确认 | 所有请求 | M08 | 不因申报的类型自动开放 |
| F022 | 档案归档年度 | item | year/range | 候选检索线索 | 已知时 | M08 | 未知档号不自动拒绝 |
| F023 | 档案形成单位/就读信息 | item | object | 候选检索线索 | 个人历史/部门档案 | M08 | 组织更名/历史更名可做替代链 |
| F024 | 档案主体 | item | object | 业务核心 | 每项材料 | M08 | 第三人隐私要区分 |
| F025 | 馆内档号 | item | text | 可选 | 用户/系统已知时 | M08 | 不强制普通用户填未知馆号 |
| F026 | 馆藏位置和状态 | item | enum | 可信接口 | 所有请求 | M09 | 未知->馆方检索，不瞎编 |
| F027 | 公布状态 | item | enum | 可信接口/人工 | 需要判断公布限制 | M09 | 独立于开放状态 |
| F028 | 档案开放状态 | item | enum | 可信接口/人工 | 所有实际访问 | M09 | 没有可信来源->unknown |
| F029 | 受限原因标志 | item | multi | 可信接口/人工 | 发现隐私/秘密/原件等 | M09 | 可并存不可互相覆盖 |
| F030 | 操作ID | operation | text | 系统生成 | 每种操作 | M10 | 稳定 operation_key |
| F031 | 操作类型 | operation | enum | 业务核心 | 每种操作 | M10 | view!=copy!=borrow_original |
| F032 | 操作范围 | operation | object | 条件必要 | 每种操作 | M10 | 页/档号/段落/材料份数的精确范围 |
| F033 | 复制件数量或借出数量 | operation | integer | 条件必要 | 数量相关操作 | M10 | 限额须对应学校规则 |
| F034 | 所需用途及接收对象 | operation | text | 申报内容 | 需要用途核验/出证 | M10 | 用途不得虚构违法 |
| F035 | 申请的交付方式 | operation | enum | 可选/条件必要 | 邮寄/电子交付 | M15 | 不邮寄不强制地址 |
| F036 | 申请人的文件权利依据 | operation | references | 推理/人工 | 涉及限制或因公 | M11 | 身份+单位函不直接等于权限 |
| F037 | 实际批准的操作集合 | operation | set | 权威审批系统 | post_decision或馆方已签批 | M11 | 只认同档案件/同操作/同范围 |
| F038 | 授权开始与终止时间 | operation | date-range | 权威审批系统 | 权限有时限时 | M11 | 过期批准不合法 |
| F039 | 馆方批准状态 | operation | enum | 权威接口 | 需最终准入时 | M11 | 待批准不是材料缺失 |
| F040 | 原件借用责任人 | operation | object | 条件必要 | borrow_original | M12 | 要有单位/责任绑定 |
| F041 | 预计借还日期 | operation | date-range | 条件推荐/按校规必需 | borrow_original | M12 | 不能套用外校借期数字 |
| F042 | 原件交接与归还记录 | operation | object | 执行后可信状态 | post_decision且borrow_original | M12 | 交付后执行记录，不是申请时必需 |
| F043 | 证明文件版本与位置 | evidence | references | 系统解析 | 任何审查依据 | M13 | 原件版本、哈希、页码/块位置 |
| F044 | 文件读取完整性 | evidence | enum | 系统事实 | 每个活跃附件 | M13 | 未读不得声称已核完 |
| F045 | 证据主体匹配状态 | evidence | enum | 提取+核验 | 每个相关证明 | M13 | OCR低置信度只能待核 |
| F046 | 签字印章是否存在 | evidence | enum | 解析与视觉检查 | 制度要求签章时 | M13 | 存在不证明真伪 |
| F047 | 签章权威核验状态 | evidence | enum | 可信系统/人工 | 需验签/审批权时 | M11 | 不能以图像生成“真实公章” |
| F048 | 规则适用证据 | workflow | references | 系统编译 | 每项检查 | M02 | 来源版本+触发条件+生效时间 |
| F049 | 人工待办与负责方 | workflow | object | 系统派发 | 存在未知/待授权/冲突时 | M14 | 明确由谁决定/补正 |
| F050 | 业务审批/执行回执 | workflow | references | 有权业务系统 | 已审批/已交付阶段 | M14 | 不凭AI建议代替馆方回执 |

## 4. 材料槽（Material Slots）定义

**槽是审核所需证据的“目的容器”，不是某张固定文件的强制上传框。** 一份来源可靠的材料可以在不同槽被引用，但引用范围由具体 `operation_key` 决定；签批回执与最终归还记录的 `required_at` 不得设置为申请提交阶段。

字段解释：`槽ID`稳定；`启用条件`必须有命中的学校/主体/操作/制度；`最早需要阶段`用于判断是否属于当前申请人缺件；`允许替代`描述结构化可信接口可代替重复附件。

| 槽ID | 槽名 | 适用层 | 启用条件 | 最早需要阶段 | 依据 | 替代/限制 | 复用模块 |
|---|---|---|---|---|---|---|---|
| S01 | 主申请表/提交确认 | application | 一个申请至少有一份可确认的申请描述（线上结构化填报可代替PDF） | submission | CD01 | 结构化表单与纸质扫描择其一；不强制重复上传 | M13 |
| S02 | 身份/在校信息凭据 | application/relationship | 身份无法从可信接口确定、或该校该场景要求查验证件 | submission | CD02/EX04 | 实名登录的可信身份可在获准场景减少附件 | M03 |
| S03 | 委托书/授权关系 | relationship | applicant_type=proxy | submission | CD03 | 要求内容覆盖代理对象、事项、使用方式和授权主体 | M04 |
| S04 | 受托人及委托人身份证明 | relationship | applicant_type=proxy且有效校规要求 | submission | CD03 | 本校历史指南出现委托人身份证复印件；是否双人原件须校核 | M04 |
| S05 | 单位介绍信/经办授权函 | relationship | internal_unit/external_unit且校规要求 | submission | CD02/EX04 | 函件证明单位/经办/用途；不当然扩大馆方权限 | M05 |
| S06 | 学生档案利用审批表 | item | CDUT学生档案利用且该现行程序适用 | submission/decision按校规 | CD01 | 2026表名已核，栏位、印章节点待取得 | M06 |
| S07 | 综合档案查阅审批表 | item | CDUT一般综合档案查阅且程序适用 | submission/decision按校规 | CD01 | 不得拿它直接办理原件外借 | M06 |
| S08 | 综合档案外借审批表 | operation | CDUT综合档案原件外借且程序适用 | submission/decision按校规 | CD01 | 归还记录属于执行后阶段 | M12 |
| S09 | 形成单位或有权馆方批准 | operation | 限制性档案/受控行为需专门批准 | decision | LAW02/SC01 | 提交阶段未签批->pending_authority而非missing_evidence | M11 |
| S10 | 馆方开放状态/馆藏确认 | item | 需要确认能否依法利用 | authority_review | LAW02 | 未知不能按“未开放”或“开放”擅自填 | M09 |
| S11 | 具体复制/摘录范围证明 | operation | copy/excerpt/certified_copy且涉及范围限制 | decision | LAW02/EX04 | 材料只支持查阅不意味着复制批准 | M10 |
| S12 | 原件保管、归还、交接记录 | operation | borrow_original | decision/post_decision | CD01/EX05 | 借用责任在申请阶段，交接/归还记录在后续阶段 | M12 |
| S13 | 合法历史更名及档案主体关联证明 | item/relationship | 申请人与历史归档名不一致 | submission | CD03 | 材料形式按具体要求，不一律附公安证明 | M03 |
| S14 | 邮寄/电子交付地址与接受方式 | operation | 选择邮寄或电子交付 | decision/post_decision | CD04 | 寒假特定邮寄/扫描要求只在公告适用时生效 | M15 |

### 4.1 必须实现的材料关系

- **证据槽是否启用**与**当前阶段是否要求已齐全**是两个不同布尔量。比如 S09 在提交阶段可能已激活，却不要求申请人带着未来批准函才能提交。
- `材料提供者`可以是申请人、馆方系统、校内可信身份服务或有权审批人；不能把馆方应提供的状态错记为申请人补件义务。
- `提交申请表`可以是纸质PDF，也可以是业务系统中有审计记录的结构化申请；格式不能作为跨校普遍强制条件。
- 扫描PDF OCR失败只产生 `unread/awaiting-confirmation`，不能产生“文件未提供”或“没有问题”。
- 同一份证明若关联多个档案件或操作，保留**每次引用时的被支持事实和权利范围**，不得只保存一个文件级“全局通过”。

## 5. 条件参数（只有这一套模板，分支在同一位置组合）

### 5.1 条件变量表

| 分支ID | 条件维度 | 字段/参数 | 适用范围 | 该维度主要决定什么 |
|---|---|---|---|---|
| B01 | 受理学校及现行规则 | receiving_school,rule_context | 所有请求 | 定位校规与版本，不引入外校强制条件 |
| B02 | 申请主体类别 | applicant_type | 所有请求 | self/proxy/internal/external，身份与权利分开 |
| B03 | 委托关系 | proxy/delegation | 仅代理办理 | 核委托双方与材料范围，不能覆盖馆方限制 |
| B04 | 单位因公授权 | internal_unit/external_unit | 因公申请 | 单位函+经办权+工作目的各自匹配 |
| B05 | 档案类别 | archive_type | 每档案件 | 学籍/综合/学生个人档案/人事干部/专项 |
| B06 | 操作类别 | operation_type | 每操作 | 查阅、摘录、复制、证明、外借分开 |
| B07 | 馆藏与开放情况 | location_status/access_state | 每档案件 | 未知由馆方查询；不得当开放 |
| B08 | 限制标志 | restriction_flags | 可能受限时 | 可与开放并存，隐私/秘密/珍贵原件额外核权 |
| B09 | 办理渠道 | channel | 所有请求 | 电子/到馆/邮寄/临时窗口不同 |
| B10 | 阶段 | review_stage | 全流程 | 提交与最终批准、执行交付完全分开 |
| B11 | 规则时间窗 | submitted_at,effectiveFrom,effectiveUntil | 临时公告/政策变更 | 过期通知不得跨期生效 |
| B12 | 操作范围和数量 | scope,count | 多操作尤其复制/外借 | 批准范围按具体档案件、操作、页码/数量比较 |
| B13 | 可信身份与权限接口 | identity/keeper/authority | 有连接时 | 接口未提供≠权限成立；输出待核 |
| B14 | 电子签章与替代材料 | signature.verification | 证书、授权电子文件 | 可信回执可以替代传统纸章，需适用制度认可 |
| B15 | 混合申请 | items[].operations[] | 多件、多操作时 | 分项可独立保留、补正、授权等待或分流 |

### 5.2 分支合成规则

**输入**：一个案卷和多个 `operation_key`。

1. 对整个案卷定位**受理学校、规则生效时间、办理渠道和审核阶段**。
2. 对该案卷识别一个或多个申请主体关系：本人、委托人/受托人、单位经办人、档案主体。身份相同并不代表授权成立。
3. 对每一个档案件单独获取类别、形成时间、馆藏状态、开放与限制状态。
4. 对每一档案件内的每一种操作，叠加：`基础身份核验 + 条件主体授权 + 档案类别限制 + 操作范围限制 + 特殊状态 + 渠道与期间规则 + 当前阶段规则`。
5. 保留所有命中规则的**适用依据、命中理由和不适用原因**；规则冲突时生成责任明确的待确认项，不能随意取更严格或最新上传的一条。
6. 没有本校有效依据的“建议附件字段”可用于补录与检索，不得产生违规拒件；但缺乏可信馆方授权同样不能直接发放档案。
7. 对多操作组合逐项输出，不把一项的无权限状态扩散到其他已能受理的事项。

#### 示例：组合而不是独立模板

> 一个校内教职工受学生正式委托，为某学生申请复制两页历史学籍档案，同时替所在部门查阅未开放的综合档案。
>
> 这是一个申请，至少包含两个 `operation_key`。对第一项需要**受托人身份+委托关系+复制范围+历史学籍档案定位**；对第二项需要**经办单位资格+因公事由+未开放档案专项审批**。即使都使用同一张身份证，也不得把第一项的委托权限用于第二项，更不得因第二项仍需审批而整体拒绝第一项。

### 5.3 可直接抽取为通用条件表达式的结构

```yaml
# 仅说明编辑器中的条件配置语义，不是目前已发布的 TemplateVersion JSON。
branch:
  id: B03
  when:
    all:
      - {field: applicant_type, op: eq, value: proxy}
      - {field: represented_principal_id, op: exists}
  activate_material_slots: [S03, S04]
  activate_checks: [R08, R09, R10]
  scope: relationship
  unknown_policy: pending_authority_or_evidence_verification
  fallback: manual-review
```

**条件的真假必须支持三态**：已证实真、已证实假、无法判定。编辑器不要把读取失败、材料不存在、管理员未批准、规则版本未知合并为一个 `false`。`not applicable` 仅表示条件已证实不匹配。

## 6. 审核规则全集（42条原子规则，统一集中管理）

> 下表是**独立核验点**，不代表都应该拆成单独的编辑器模块。`触发`指业务条件；是否成为“硬性必交”还必须在该受理学校当前有效规则中确认。`结果`列为核验事实或流程状态，不是档案馆最终准入决定。

| Rule ID | 规则名 | 目标层 | 触发条件 | 核验命题 | 输出/异常 | 候选模块 | 依据等级 |
|---|---|---|---|---|---|---|---|
| R01 | 受理规则定位 | application | school/date/channel/recordType | 取得适用规则版本并锁快照 | 规则版本确认/待核/冲突 | M02 | LEGAL,CD_VERIFIED |
| R02 | 申请是否属于模板 | application | businessPurpose | 自助服务/专门人事档案/转递分流 | in-scope/divert | M01 | UNIVERSAL_DESIGN |
| R03 | 申请主体可靠识别 | application | applicant identity | 申报人身份与可信认证或材料一致 | matched/unknown/conflict | M03 | CD_VERIFIED,CROSS_SCHOOL |
| R04 | 申请人与实际请求主体区分 | relationship | applicant/principal/archiveSubject | 本人、受托、单位经办不得混同 | matched/unknown/conflict | M03 | UNIVERSAL_DESIGN |
| R05 | 目标档案可定位 | item | archiveTitle/year/owner | 依可得线索定位或交馆方检索 | located/insufficient/keeper-pending | M08 | CROSS_SCHOOL |
| R06 | 档案类型确认 | item | archiveType | 由馆方或规则确定路线；人事干部档案独立分流 | qualified/divert/unverifiable | M08 | CD_VERIFIED |
| R07 | 本人历史身份链 | item | self + historicalRecord | 姓名变更/旧学号/就读年份可建立合理链 | matched/needs-evidence/unknown | M03 | CD_VERIFIED |
| R08 | 代理身份双方核验 | relationship | applicantType=proxy | 证明委托人与受托人身份 | matched/missing-evidence/unverifiable | M04 | CD_VERIFIED |
| R09 | 代理授权对象核验 | operation | applicantType=proxy | 委托对象/档案件/事项与申请一致 | covered/scope-mismatch/unknown | M04 | CD_VERIFIED |
| R10 | 代理期限与方式核验 | operation | proxy + time/operation | 委托是否覆盖当次操作和日期 | covered/scope-mismatch/unknown | M04 | UNIVERSAL_DESIGN |
| R11 | 因公单位真实性与资格 | relationship | applicantType in internal/external | 单位与经办人/职责任务能够关联 | verified/authority-unknown/conflict | M05 | CROSS_SCHOOL |
| R12 | 单位函用途及范围 | operation | unit authorization | 单位函的事由、档案与具体方式匹配 | covered/scope-mismatch/unknown | M05 | CROSS_SCHOOL |
| R13 | 单位授权不能代替私人委托 | relationship | unit + personal archive | 涉及个人代办时另核委托 | independent/missing-evidence | M04 | UNIVERSAL_DESIGN |
| R14 | 学生档案专用路径 | item | archiveType=student_personnel_archive | 校内校外经办及特殊档案批准按校规 | route/permission-pending | M09 | CD_VERIFIED |
| R15 | 综合查阅表适用性 | item | archiveType=general + operation=view | 成都理工综合查阅表适用且版本匹配 | applicable/version-unknown | M06 | CD_VERIFIED |
| R16 | 综合外借表适用性 | operation | archiveType=general + borrow_original | 成都理工外借审批表与借出操作匹配 | applicable/need-authorization | M12 | CD_VERIFIED |
| R17 | 馆藏位置由权威来源确定 | item | every item | 馆方事实为依据，未知只能请求查询 | located/keeper-pending | M09 | LEGAL |
| R18 | 公布与开放状态分别检查 | item | every item | published≠open，标记无可靠来源则unknown | qualified/unverifiable | M09 | LEGAL |
| R19 | 未开放或受限档案额外批准 | operation | accessState in not_open/restricted/classified | 专项权限决定/保密要求/允许范围 | authority-approved/pending/denied | M11 | LEGAL |
| R20 | 第三人隐私及技术秘密 | operation | restriction_flags present | 有权部门决定范围与必要脱敏 | privacy-review/pending | M09 | LEGAL |
| R21 | 查阅权限精确匹配 | operation | operation=view | 授权档案件+查阅范围+时点一致 | covered/not-covered/unknown | M11 | LEGAL |
| R22 | 摘录权限精确匹配 | operation | operation=excerpt | 不能从查阅自动继承摘录许可 | covered/not-covered/unknown | M11 | LEGAL |
| R23 | 复制扫描权限精确匹配 | operation | operation=copy | 授权内容页/份数与请求一致 | covered/not-covered/unknown | M11 | LEGAL |
| R24 | 档案证明出具权限 | operation | operation=certified_copy | 只能有权档案部门出具或验真 | pending/approved/unknown | M11 | LEGAL |
| R25 | 原件外借特别授权 | operation | operation=borrow_original | 确认额外审批/保管责任/可外借性 | pending/approved/denied | M12 | LEGAL |
| R26 | 外借时间和交接 | operation | borrow_original + post_decision | 借期按校规；借还回执由馆方确认 | within-limit/unknown/overdue | M12 | CD_VERIFIED,CROSS_SCHOOL |
| R27 | 签章存在与真实性区分 | evidence | evidence signature | 可核有无，真伪由可信服务/人工 | present/verified/unverifiable | M13 | UNIVERSAL_DESIGN |
| R28 | 证据冲突对齐 | evidence | multiple documents | 姓名/年份/范围/数量跨文件核对 | consistent/conflict/unknown | M13 | UNIVERSAL_DESIGN |
| R29 | 电子授权合法替代 | evidence | digitally-signed authorization | 认可且可验真时不得一律拒电子件 | accepted/verification-pending | M13 | LEGAL |
| R30 | 办理渠道材料条件 | application | channel/time | 仅生效公告范围要求专属附件 | applicable/out-of-scope | M02 | CD_VERIFIED |
| R31 | 截止和规章有效期 | application | submittedAt/effectiveWindow | 过期寒假通知不覆盖秋季申请 | active/expired/unconfirmed | M02 | CD_VERIFIED |
| R32 | 必需材料仅按条件激活 | evidence | each activated slot | 申请人应交且到达要求阶段才缺件 | missing/complete/not-due | M06 | UNIVERSAL_DESIGN |
| R33 | 待审批不等于缺件 | workflow | reviewStage != post_decision | 有权批准尚未发生，应等待而不索取未来签批 | pending-authority | M07 | UNIVERSAL_DESIGN |
| R34 | 审批结果不能被AI代写 | workflow | authority decision | 最终批准需要可信部门身份与范围 | human-required | M11 | LEGAL |
| R35 | 逐操作汇总结论 | operation | each operation_key | 保留适用/满足/冲突/权限和证据状态 | operation-result | M14 | UNIVERSAL_DESIGN |
| R36 | 整单汇总不覆盖部分处理 | application | all operation results | 输出可受理+补正+转办的并存结果 | aggregate-result | M14 | UNIVERSAL_DESIGN |
| R37 | 交付动作强制门控 | workflow | actual delivery | 仅馆方已作有权决定且有执行记录才能回写已交付 | delivery-disabled-in-precheck | M14 | LEGAL |
| R38 | 证据完整覆盖检查 | evidence | all active attachments | 未读/解析失败不得宣称检查完成 | complete/partial/failed | M13 | UNIVERSAL_DESIGN |
| R39 | 校规证据优先级 | application | multiple rule sources | 有效上位法+本校适用细则；外校不自动生效 | applicable/conflict/unknown | M02 | LEGAL,CD_VERIFIED |
| R40 | 合理替代与历史差异 | evidence | old names/IDs/unknown catalogue | 支持合法更名、委托替代、馆方检索 | accepted/manual/needs-evidence | M13 | UNIVERSAL_DESIGN |
| R41 | 公开展示结果最小化 | workflow | report generation | 申请人只见公开反馈，不暴露他人档案/内部意见 | public/internal split | M14 | UNIVERSAL_DESIGN |
| R42 | 版本变更与重审 | workflow | material/policy changed | 修改相关材料/规则后相关检查过期并重新核对 | stale/recheck | M02 | UNIVERSAL_DESIGN |

### 6.1 规则优先级（比“把所有条件 AND 在一起”更重要）

1. **范围与安全权限先于材料通过**：归档原件、未开放材料、第三人隐私、借出原件的权限不能由普通身份一致性替代。
2. **有权批准状态先于AI推断**：柜台/馆藏/审批系统状态缺失时，不得猜测为已批准。
3. **适用规则版本先于必交判定**：某高校2025附件不能成为成都理工2026年不受该规则约束申请的拒件依据。
4. **申请人材料与部门应作的决定分开**：委托书没提供是可能的补件；馆方还没批准是待审批，不能写成“请申请人补一张馆长签字”。
5. **真实冲突先于表面格式**：证据证明两个不同人，不能因为表格齐全而通过；OCR单字识别差错先核原图/可信系统。
6. **按操作分开结果**：同一档案查阅满足，复制范围不符时，保留两项不同状态；其余无关事项不受污染。

### 6.2 条件触发和输出的判定表（供编辑器规则表单建模）

| 条件成立 | 检查项 | 条件不成立时 | 信息未知时 | 不合格与未批准区别 |
|---|---|---|---|---|
| `applicant_type=proxy` | R08-R10、S03-S04 | `not_applicable` | 待补证/关系待核 | 范围不符=授权范围问题；不等同馆方否决 |
| `applicant_type=internal_unit/external_unit` | R11-R13、S05 | `not_applicable` | 经办资格待核 | 无有效单位授权不自动认为个人违法 |
| `operation=view` | R21 | `not_applicable` | 不能声称获查阅权 | 材料齐全≠馆方批准阅档 |
| `operation=copy` | R23 | `not_applicable` | 待馆方确认复制权限 | 已批准查阅不能替代复制授权 |
| `operation=borrow_original` | R16、R25-R26、S08、S12 | `not_applicable` | 待特别批准 | 申请时未归还记录属正常，不是缺件 |
| `access_state=not_open/restricted/classified` | R19、必要时R20 | `not_applicable` | 权限级别待馆方确认 | 依法需批准≠自动拒绝申请受理 |
| `channel=mail`且通知期间命中 | R30、相应渠道字段 | `not_applicable` | 通知版本待核 | 暂时服务公告过期后不强制材料 |
| `request includes staff personnel archive` | R02、R06分流 | 继续本模板 | 分类不明则人工定类 | 不把干部人事档案当一般档案处理 |

---

## 7. 统一审核流水线（从收件到回执的完整行为）

以下是**同一套模板的阶段过程**，不是分支模板。任一步产生不确定性时，只暂停受影响的规则/操作；其他可以继续进行。

1. **登记申请快照**：生成案卷ID，记录接收时间、学校/部门、渠道、来源文档版本和当前阶段；保留附件版本及哈希。
2. **识别本模板办理范围**：辨别申请历史证明、常规查档、受限档案、干部人事档案、档案转递、自助证明；按档案件逐项保留或分流。
3. **解析材料并记录覆盖**：为每个活跃PDF/图片/文档记录已读、部分已读、读取失败和OCR/视觉识别质量；未读不当作无问题。
4. **建立申请主体/代表关系**：申请人、委托人、受托人、单位、经办人、涉及的档案主体；从可信身份接口或申请证明关联。
5. **列举全部档案件**：为每件建立 `item_id`，记录档案标题、形成时间、对象、类别、所在馆等，未知字段保持未知。
6. **展开全部利用操作**：将查阅、摘录、复制、证明、原件外借分别展开为独立 `operation_key`，冻结具体页数与范围。
7. **读取馆藏和开放状态**：优先官方馆藏/权限接口或有权人工确认；未知状态产生馆方核验待办。
8. **命中条件和现行规则**：使用学校、角色、档案类别、操作、限制标志、日期、渠道、阶段进行条件合成，导出每条适用规则及不适用原因。
9. **生成到期的材料要求**：只对“已命中、现阶段该申请人应履行”的材料标缺件；终审批章、外借归还等未到期条件单独等待。
10. **逐证据做事实与授权范围核验**：身份、对象、年份、委托范围、单位事由、签章形式、实际批准范围和有效日期；来源必须定位真实文档/块或官方回执。
11. **输出逐操作预审状态与人工任务**：包括当前进度、证据与规则引用、缺口、负责处理部门、候选补正材料，不输出“已交付”。
12. **整单摘要与反馈**：保留所有分项结果，说明可受理部分和需补正/待授权/转办部分；对外反馈只披露获准公开的信息。
13. **人工复核与部门批准（外部责任）**：审核员更正OCR或申请人信息，有权部门记录正式权限许可或否决；新证据更新时按依赖重审。
14. **业务执行与归还（外部责任）**：馆方完成查档、复制或借还，写入权威回执；AI预审本身不触发原件借出、解密或交付。

**重要时序不变量**：

- `submission` 阶段提交人无需提前拥有未来的馆方批准结果；不应用 `missing_evidence` 表示普通审批尚未发生。
- `pre_review` 阶段允许输出“形式材料已满足，等待档案馆确认”。
- `authority_review` 阶段按权责检查谁批准了哪件档案哪种操作，未知/未批准不能执行交付。
- `post_decision` 阶段只有权威系统真实状态才能确认批准、实际交付、归还；不得从模型答复反推已交付。

## 8. 结果状态模型、聚合规则与门禁

### 8.1 检查项状态（用于每条规则）

| 业务结果 | 含义 | 可以对外提示什么 | 不能做什么 |
|---|---|---|---|
| `satisfied` | 已证实满足该条适用核验点 | 某项材料检查已完成 | 不能表示有权部门已准许档案利用 |
| `missing_evidence` | 当前阶段有来源支持的申请人必交材料欠缺 | 补交哪种证据或提供认可替代材料 | 不得拿未来审批签字当缺件 |
| `conflict` | 两份可信来源对人、档案、用途或范围产生实质矛盾 | 请核对具体不一致处 | 不得把OCR置信度低标成证据矛盾 |
| `unverifiable` | 需要权威馆藏/开放等级/章证验真等，当前没有可信结论 | 待有权人/系统核实 | 不得默认开馆或拒档 |
| `pending_authority` | 所需有权决定尚未产生，或正在流转 | 继续送审，由有权部门决定 | 不得说成申请人缺证明 |
| `scope_mismatch` | 已证实提交的委托或批准范围不能覆盖请求 | 指出超范围的档案件和操作 | 不得将超范围结论扩散到同案其他操作 |
| `rule_version_unknown` | 当前学校/时间/渠道制度无法核实 | 规则待确认，暂停强制化 | 不得拿其他学校严格规则补上 |
| `not_applicable` | 已确认该条条件不触发 | 说明不适用原因 | 不得把未知当不适用 |
| `diverted` | 业务应转其他明确流程 | 转何种业务和负责部门 | 不得混入普通档案利用已通过清单 |
| `not_executed` / `execution_failed` | 因预算、解析、权限或执行错误没有完成检查 | 明确哪些规则/文件未读及重试方案 | 不得显示无问题通过 |

### 8.2 两轴而非一个布尔值

同一 `operation_key` 推荐至少保存：

- `evidence_readiness`：完整、可补、冲突、无法核验、未执行。
- `permission_readiness`：不适用、材料阶段尚待批准、权限待核、已确认授权范围、明确拒绝。
- `policy_readiness`：已确认适用、已知不适用、版本待核/冲突。
- `workflow_position`：已提交、预审、权限审核、决定后执行。

这几轴不能互相覆盖。**材料完整且 `permission=pending` 是正常的成功预审，不是“已批准”**。

### 8.3 逐操作预审总状态

| 状态 | 选择标准 | `delivery_allowed` |
|---|---|---|
| `complete_pending_authority` | 当前适用的申请材料全部满足，尚未到最终授权 | **false** |
| `supplementation_required` | 适用的申请人材料有明确缺件 | **false** |
| `conflict_pending_investigation` | 实质事实/委托/范围冲突 | **false** |
| `permission_pending` | 档案开放性或有权批准待确认 | **false** |
| `rule_version_unknown` | 适用学校/阶段的必要规则无有效版本 | **false** |
| `divert_to_service` | 该档案件或操作属其他流程 | **false** |
| `partially_unreviewed` | 部分必须文档尚未读完或检查失败 | **false** |

**模板自身的所有输出 `delivery_allowed=false`。** 即使在 `post_decision` 检查到馆方正式交付回执，模板只能报告外部系统声称的 `actual_delivery_status=delivered` 及其证据；真正交付动作不是该字段驱动的本模板操作。

### 8.4 整单聚合

- 单一申请允许并存：可继续流转、需补件、需馆方确认、转专门流程、规则待确认。
- `aggregate_status` 只供摘要，不覆盖每项 `operation_key` 的细节。
- 任何关键 `operation_key` 未执行或范围未知，整单不得标“全部检查完成”或“全部批准”。
- 人工批准/拒绝要具名、带时间、责任角色、操作范围和可信来源；AI建议不得冒充人工决定。

### 8.5 状态从属关系（优先不产生误导）

如果同时发生“某个委托范围不符”和“馆方未批准”，**两个发现都保留**。展示层可以先提示范围不符需修正，但不能直接丢弃待授权事实。如果存在覆盖未知，则规则结论可为待确认，同时保留已核实的其他问题。不得用“最后一个匹配状态覆盖之前状态”的实现。

## 9. 合理例外、反误杀及越权防护用例

| 例外ID | 情形 | 触发例子 | 应如何处理 | 禁止行为 |
|---|---|---|---|---|
| E01 | 历史更名 | 旧档案姓名与现证姓名不同 | 检查曾用名/权威关系，人工复核可接受合法证明 | 机械判身份证名字不同为冒用 |
| E02 | 档号未知 | 申请人提供材料名称、年份但不知馆藏编号 | 允许馆方检索，非必须字段不拒件 | 强制档号导致误杀 |
| E03 | 合法电子委托 | 可核验电子签署及该校接受电子文件 | 按可信签章/适用学校确认 | 一律要求红色纸章 |
| E04 | 曾用身份证已收回 | 无法再提交旧证件原件 | 认可依法允许的更名/户籍关联证明 | 缺旧证一律拒件 |
| E05 | 开放目录包含第三人隐私 | 查到目录但所需全文涉个人信息 | 范围缩减/脱敏/专项批准 | 开放目录即整卷下载 |
| E06 | 单位函只授权查阅 | 同案提出查阅+复制 | 查阅与复制各自核授权 | 查阅批准自动包含复制 |
| E07 | 代理+单位经办叠加 | 单位经办持有委托人档案申请 | 分别校验私人委托与单位职责 | 用单位函替代私人委托 |
| E08 | 未到馆方签章阶段 | 申请刚提交 | 待审批而非缺件 | 要求申请人上传未来批准文件 |
| E09 | 寒假临时规则已过期 | 申请在秋季 | 仅命中本校当前生效材料要求 | 强制寒假邮箱/三日办结 |
| E10 | 馆藏开放状态未知 | 无法连接档案馆 | 待权威核实，禁止交付 | 模型猜测“已开放” |
| E11 | 不同档案状态混合 | I01开放,I02限制,I03应转人事档案 | 逐项结果并存，不整单一刀切 | 因一项受限整单拒绝 |
| E12 | 原件外借 | 必须经批准且交接责任明确 | 查阅材料不能替代外借表及批准 | 查询权限导致借出动作 |
| E13 | 电子证明合法替代 | 本人取得官方可信档案证明 | 核可用范围或分流直达服务 | 仍强迫扫描证件/重新盖章 |
| E14 | OCR无法解析扫描页 | 页面有图片但解析失败 | 标部分读取/人工复核，保留原件 | 没抽到文字就视为缺失证据 |
| E15 | 旧学院名称 | 档案形成单位曾改名 | 对照学校机构沿革或人工确认 | 文字不一致即拒件 |
| E16 | 有限复制范围 | 批准仅I1某一页 | 只许可范围内复制，其余待补批 | 按档案件整体放行全部页 |

## 10. 完整业务对象示例（供编辑器验证多层级结构）

> 下面是**纯模拟数据模型示例**，不是成都理工大学真实审批记录。YAML是用于帮助理解字段组合的说明，编辑器最终输出格式应由现有 V2 契约决定。

```yaml
application:
  id: DEMO-A001
  school: fictitious_university_a
  rule_set: SIM_ARCH_2026
  submitted_at: 2026-10-10
  stage: pre_review
  channel: official_online
  applicant:
    person_id: PERSON-01
    role: internal_unit
    department: 学校某部门
  relationships:
    - id: REL-01
      type: institution_authorization
      principal: UNIT-01
      actor: PERSON-01
      scope: {archive_items: [I01], operations: [view]}
      verification: verified
  archive_items:
    - item_id: I01
      title: 某年培训综合档案
      archive_type: general_archive
      access_state: open       # 来源：模拟馆方可信状态
      location_status: located
      operations:
        - operation_id: O01
          operation: view
          scope: {section: 第一册}
        - operation_id: O02
          operation: copy
          scope: {pages: [5, 6], copies: 1}
    - item_id: I02
      title: 某年会议档案
      archive_type: general_archive
      access_state: unknown
      operations:
        - operation_id: O03
          operation: view
  # 签批记录必须绑定到精确 item_id + operation_id + scope
  authorizations:
    - {item_id: I01, operation_id: O01, state: pending, scope: {section: 第一册}}
  result_contract:
    operations:
      - {key: DEMO-A001/I01/O01, evidence_readiness: satisfied, permission: pending_authority, delivery_allowed: false}
      - {key: DEMO-A001/I01/O02, evidence_readiness: scope_mismatch, permission: unknown, delivery_allowed: false}
      - {key: DEMO-A001/I02/O03, evidence_readiness: unverifiable, permission: unknown, delivery_allowed: false}
    aggregate: partial_or_pending
    is_final_authority_decision: false
```

请特别注意：`I01/O01` 的单位函仅包含查阅，不能跨操作支持 `I01/O02` 的复制；`I02` 的未知开放状态不能继承 `I01` 的开放状态。该示例正对应试点里的核心组合权限风险。

## 11. 模板编辑器最低应展示与支持的东西

### 11.1 建议的单模板编辑面板结构

| 区域 | 编辑的配置对象 | 普通编辑者应看到的语言 | 开发者需要保存的数据 |
|---|---|---|---|
| 模板信息 | 目的/受理对象/边界/版本 | “这套模板审什么、不审什么” | ID、标准名、适用学校、生命周期 |
| 字段与业务对象 | 案卷/主体关系/档案件/操作字段 | “这项信息从哪里获取，给谁使用” | 字段ID、类型、scope、可见性、系统源 |
| 材料清单 | 材料槽及复用关系 | “什么情形需要哪份材料” | 槽ID、触发、阶段、替代、证据位置 |
| **统一条件规则区** | 学校规则/主体/档案类型/操作/限制等触发 | “当……时，核验……，否则……” | 条件树、依据、版本、优先级、unknown分支 |
| 审核规则区 | 规则及测试说明 | “依据什么比较什么，并输出何种问题” | Rule ID、scope、executor、onFail、onUnknown |
| 办理阶段与权限 | 预审/部门签批/执行交付 | “谁在什么时候可以做什么” | stage、actor、权利范围、决策记录 |
| 审核输出 | 逐操作结果与整单摘要 | “已核实、待补、待授权、转人工” | 检查项、证据引用、human decision、coverage |
| 版本与测试 | 导入模拟材料、比对金标准 | “哪些情形跑过，出现什么差异” | 模板版本、policy hash、结果快照、差异记录 |

### 11.2 何时需要新字段/新规则/新模块

- **新字段**：只在存在独立语义、独立来源或独立作用层级时新增；不同模板都叫“姓名”时优先抽公共字段类型，不重复造解析器。
- **新规则**：确实多一个可以独立验证的判断命题才新建；同一规则只是“针对委托/单位”的条件不同，优先复用规则结构与参数。
- **新模块**：在至少两套业务模板中有稳定共性、明确输入输出、例外与错误边界，才抽为通用模块。不要因两处出现“上传公章文件”就把不同业务的签章权合并。
- **新模板**：只有新的独立审核目的、核心对象或有权决定责任，不要把另一张申请表当作另一个模板。

---

## 12. 可复用模块候选与业务专属部分

> 这张表是你开发模板编辑器最应该抽取的内容。**“高复用”并不是说立刻开发一个执行插件**；可以先实现可重用的配置片段、模块契约、可参数化规则和共享字段字典。模块组合应在模板发布或运行输入冻结前完成，不要求每次AI审核临时解释一个模块图。

| 模块ID | 模块名 | 范围 | 可复用输入/输出 | 必须保留的边界 | 抽取优先级 | 其他可能复用位置 |
|---|---|---|---|---|---|---|
| M01 | 业务路由与模板边界 | 跨领域 | 申请目的识别、受理学校、是否转自助/专用流程 | 不负责最终可访问档案的权限判定 | 高 | G01/G02等 |
| M02 | 政策版本与适用范围解析 | 跨领域 | 学校/时间/人群/渠道/来源权威/优先级及冲突 | 不把外校资料自动提升本校强制规则 | 高 | 全部模板 |
| M03 | 主体身份及历史连续性 | 跨领域 | 主体识别、证件关联、更名与组织更名 | 身份匹配不能替代业务许可 | 高 | 学籍更正/档案/证明 |
| M04 | 个人委托与代理 | 跨领域 | 委托双方、范围、时间、电子形式、委托覆盖 | 不能替代档案馆/组织特殊授权 | 高 | 档案/证明/委托用印 |
| M05 | 单位与经办授权 | 跨领域 | 单位函、经办人资格、用途和范围 | 单位章存在不能证明签署者有权 | 高 | 档案/用印/部门事项 |
| M06 | 条件材料槽与分阶段必交 | 跨领域 | 字段字典、材料槽、激活触发、requiredAt、替代材料 | 不能把部门后置签批当申请人提交义务 | 高 | 全部模板 |
| M07 | 业务阶段与责任分离 | 跨领域 | 提交/预审/有权审核/执行、人工角色和权限 | 不能把AI意见写成业务决定 | 高 | 全部模板 |
| M08 | 档案对象定位 | 档案领域专用 | 馆藏档号/年份/形成单位/档案主题与种类 | 一般档案检索不赋予人事档案查阅权 | 中 | 档案相关模板 |
| M09 | 档案开放与限制判定 | 档案领域专用 | 开放/公布状态及隐私/保密等多标签 | 模型不得自行动密/审批 | 中 | 档案相关模板 |
| M10 | 逐对象×逐操作请求展开 | 跨领域 | 单申请多对象多操作稳定键及范围计数 | 不能将操作合并成案卷布尔结果 | 高 | 档案/合同/批量申请 |
| M11 | 精确权限范围与有权决定 | 跨领域 | 批准主体、对象、操作、时间、范围、可信凭据 | 只有正式决定可触发执行权 | 高 | 档案/财务/保卫业务 |
| M12 | 实物外借与交接管理 | 领域+可复用 | 原件外借理由、责任人、时限、交接归还 | 不是普通文本附件审核 | 中 | 档案/设备/资产借用 |
| M13 | 证据提取、绑定与来源覆盖 | 跨领域 | 材料版本/哈希/OCR覆盖/文档定位/冲突及签章存在 | 不能把OCR当作权限真实性证明 | 高 | 全部模板 |
| M14 | 审核结果及人工任务聚合 | 跨领域 | 逐检查项状态、部分可办、责任方、补正/转办与回执 | 整体摘要不得覆盖分项风险 | 高 | 全部模板 |
| M15 | 办理渠道与交付配置 | 跨领域 | 到馆、邮寄、电子交付、时段性服务条件 | 交付地址只在对应渠道启用 | 中 | 档案/证明/邮寄事项 |
| M16 | 规则审计与变更影响 | 跨领域 | 生效来源、版本快照、人工改动、增量重审 | 不可静默改写已定稿案卷 | 高 | 全部模板 |

### 12.1 最值得先实现的模块数据契约

建议每个模块至少记录如下元数据（可以在后端用现有 V2 字段/RuleSpec 映射存储，暂不必发明新 DSL）：

```yaml
module:
  module_id: M04
  name: 个人委托与代理
  version: 1
  reusable_across_templates: true
  inputs: [applicant, principal, delegation_document, requested_scope, requested_operations]
  outputs: [identity_relation, delegation_coverage, missing_items, required_manual_authority]
  trigger: {field: applicant_type, op: eq, value: proxy}
  unknown_behavior: awaiting-confirmation
  applies_to: [relationship, operation]
  rule_refs: [R08, R09, R10, R13]
  evidence_bindings: [documentVersionId, parseRevision, source_location]
  exceptions: [electronic_delegation, historical_name_change]
  authority_boundary: 委托核验通过不等于开放受限档案
```

**模块定义的最小不变量**：

1. 输入/输出字段带 `scope`，不能把申请单级字段强制提升为每项档案的事实；
2. 支持三态条件及 `unknown -> 人工核验/待信息`，不能默认 false；
3. 材料槽与 `required_at` 结合，不能把有权部门签字当提交人缺件；
4. 必须标记 `source_type`、制度适用范围及证据版本；
5. 共享可复用业务能力，不共享不同模板的最终审批权限；
6. 模块升级对已发布模板和历史运行产生版本隔离与影响审计。

### 12.2 本档案模板不可泛化掉的四类专属语义

- **档案件的开放/公布/敏感限制**：不能抽成单一“文件是否公开”的布尔模块。
- **`item_id + operation_id + scope` 的权限匹配**：直接关系是否错误发出原件或复制件。
- **档案馆馆藏事实与实际借还记录**：权威来源是管理系统和馆方人员，不是任意申请书。
- **档案证明真实出具及外借原件**：是具有权力效果的业务操作，绝不能由模板编辑器默认配置“自动通过即交付”。

## 13. 与现有仓库数据结构的兼容说明（静态审查，不冒充实测）

仓库：`Fuck-GH-Admin/cdut-studio-review-agent`（2026-10-10查看 GitHub `main` 相关源码）。

| 现有类型/文件 | 目前可对应的能力 | 本模板中的对应位置 | 仍需开发或谨慎映射的点 |
|---|---|---|---|
| `packages/shared/src/types/review-v2.ts` → `TemplateVersion` | 标准名、字段、材料槽、分项、阶段、输出 | 第1—4节与第11节 | 多对象×多操作的业务身份键及展示仍需实现映射 |
| `FieldSpec` | `key/kind/required/conditionRequired/visibility/scope` | 第3节字段字典 | `scope`现有 case/subject，不直接拥有 relationship/item/operation 六层枚举 |
| `MaterialSlotSpec` | 槽名称、类型、触发、数量、requiredAt | 第4节材料槽 | 需实现可靠的逐操作材料绑定与角色责任匹配 |
| `ConditionAST` | all/any/not 和有限字段或事实比较 | 第5节条件树 | 范围集合包含、权限的时序/层级推理不能假装基本条件比较即可解决 |
| `RuleSpec` | 语义/确定性/人工、触发、依据、例外和未知结果 | 第6节42规则 | 档案权限集合核对需注册专门逻辑或语义+人工门控 |
| `ReviewCaseV2.subjects` | 一个案卷内多个审核分项 | 每个 `(item, operation)` 应映射为 subject | `itemId`与 `operationId`必须保存在 subject 字段，不能只在名称中体现 |
| `CheckResult` | 状态、来源、执行方及 target.subjectIds | 第8节分项规则结果 | 业务“pending_authority/scope_mismatch”等需映射为有细分类别的当前状态/问题类型 |
| `case-import.ts` | `rule/application/evidence` 三种文件角色与多种文档导入 | 试点输入资料包 | ZIP用于分发，需解压后导入；证明扫描PDF的图像识别须实机测试 |
| `template-store.ts` | 保存草稿、结构验证、发布版本 | 模板生命周期 | 本文件不是已经被 `validateTemplate` 运行或正式发布的原生模板 |
| `pi-case-review-service.ts` | 基于真实文件的检查与来源引用 | 第7、8节审核提交 | 需要输入绑定/覆盖完整度/规则版本一致，否则不可称逐项全部审核 |

### 13.1 V2临时兼容策略

- `TemplateVersion.objectType='custom'`。整份档案利用申请作为一个 case。
- **每个 `(archiveItemId, operationId)` 映射一个 `ReviewSubject(type='custom')`**；不要一件档案只建一个 subject 然后忘记多操作授权。
- 申请主体、受理学校、规则版本、提交日期放在案卷级 `caseFields`；操作范围、馆藏类别、使用方式放在对应 subject 的 `fields`。
- 与身份/委托/单位授权相关的文档，能复用时保持同一文档版本ID，但**证据绑定粒度依旧到操作**。
- 将强依赖权威状态的规则设为 `semantic`/`manual`，并默认输出待核；**不要用虚构 `deterministic` 结果表示馆方已批准**。
- 档案申请、馆方授权和实际交付分别是案卷事实、业务决定、外部执行；即使 `CheckResult.status=compliant` 也不能推导已经放行。
- 真实发布前，需要由当前代码完成模板验证、政策版本绑定、模拟导入、运行及所有覆盖断言；Markdown自身并不能证明仓库可执行。

### 13.2 与项目模块化规范的关系

已有 `docs/design/review-agent/15-template-modules-and-runtime-boundary-spec.md` 明确区分：三级工作树负责选模板；统一模板目录按目的组织；模块负责模板制作与维护；运行时使用兼容的 `TemplateVersion` 固定快照。这里列出的 M01—M16 是**从本次档案模板中提取的候选模块契约**，不是要求修改现有模块化定稿原则。

## 14. 使用此前试点材料进行的验收契约（16件合成案卷）

之前已制作：16份模拟申请、21项利用操作、28份图像扫描证明PDF；已有输入包、隔离标准答案、评分器及离线结构测试。**这些数据不是成都理工档案馆真实申请**；前期通过的是材料完整性与评分器自测，未经过当前仓库真实 OCR/模型全链路。

| 案例ID | 模拟主题 | 必须覆盖的规则/例外 | 最危险的错误 |
|---|---|---|---|
| C01 | 本人取得历史学籍复制件 | R03、R05、R07、R24 | 凭本人身份自动允许读原档 |
| C02 | 合法代理及更名 | R07—R10、R40、E01 | 新旧名字不同被误杀 |
| C03 | 代理范围小于请求范围 | R09-R10、R23 | 将查阅委托扩张成复制授权 |
| C04 | 单位申请同档案两种操作 | R11-R12、R21、R23 | 查阅批准替代复制批准 |
| C05 | 一般档案与干部人事混合 | R02、R06、R36 | 将干部人事档案混入普通查档 |
| C06 | 两件档案开放状态不同 | R17—R19、R35 | I01的开放性错误继承到I02 |
| C07 | 公开目录内含第三人隐私 | R18、R20 | 有单位函就公布第三人资料 |
| C08 | 馆藏与开放状态未知 | R17—R18、R38 | 未知被判为开放，或未查即通过 |
| C09 | 外借尚未终审 | R25-R26、R33 | 未来终审批章缺失误判为申请人缺件 |
| C10 | 单位介绍信不能替代私人委托 | R08、R11-R13 | 企业函件直接授权私人档案 |
| C11 | 临时渠道通知已失效 | R30-R31 | 寒假规则被强加在秋季 |
| C12 | 不知道历史档号 | R05、R40、E02 | 档号缺失直接拒件 |
| C13 | 委托与申请不同人不同年度 | R08—R10、R28 | 跨附件矛盾未发现 |
| C14 | 可验电子委托 | R08、R29、E03 | 合法电子签章误判无效 |
| C15 | 一单多种办理进度 | R32-R36 | 把部分受理写成整单全部批准 |
| C16 | 外校签字规定不应强加本校 | R01、R31、R39 | 将外校字段当成都理工必交 |

### 14.1 提交给审核模型与评测器的材料必须隔离

- **审核输入**：虚构政策版本、申请表、证明PDF/TXT和必要受理上下文；不得出现 gold、错误提示、标准答案、内部案例名称（如“权限不符”）。
- **独立 Oracle**：逐 `case_id + item_id + operation_id` 的正确预审状态、必需发现、不得推断的权限、正确适用依据与错误分流风险。
- **评测时逐项判断**：模型应找对所有请求、关联对证据、判断规则版本和阶段；并对未知或授权待办给出正确未完成状态。
- **失败分类**：未读材料误判、OCR/视觉漏识别、主体错绑、规则未激活、误套外校规则、授权范围扩大、阶段混淆、非法交付、误杀合理替代材料。
- **Oracle 不可被用于提示模型**；若出现标准答案泄漏，此次结果无效。

### 14.2 审核质量指标（指标含义，不虚构实测百分比）

| 指标 | 验证内容 | 失败示例 |
|---|---|---|
| 请求发现完整率 | 所有档案件×操作均被建立稳定审核目标 | 同案第二项复制遗漏 |
| 规则覆盖完整率 | 全部适用规则都有检查或未执行原因 | 图片没读就显示全通过 |
| 身份/委托关系准确率 | 实际权利主体及代理范围匹配 | 委托人、受托人倒置 |
| 正确缺件率 | 只在适用校规、正确阶段标缺件 | 申请时要求馆方已签批 |
| 权限越权率 | 没有授权的复制/外借/受限访问未被放行 | 查阅授权扩大成复制许可 |
| 校规污染率 | 外校专属规定没有变成本校硬规则 | 套用外校一周借期 |
| 来源引用准确率 | 结论能够定位被读的真实文件及依据 | 伪造页码、只引文件名 |
| 人工授权隔离率 | AI与馆方实际决定状态明确区分 | 预审“符合”展示为“已取档” |

**本文件完成后能够检查的是业务契约与静态一致性；不能据此宣布任何上述模型准确率达标。**

## 15. 模板静态验收清单（提交编辑器前）

- [ ] 只有一个标准模板名和一个 `template_id`；办理情形没有派生为其他模板。
- [ ] 字段有稳定ID、类型、层级、获取来源与条件必需说明。
- [ ] 材料槽记录申请人/外部机关谁负责提交及 `required_at`。
- [ ] 规则按学校、有效时间、主体、档案类别、操作、阶段组合激活。
- [ ] 每个档案件×操作有自己的稳定键、证据引用、检查状态和后续动作。
- [ ] 已公布、已开放、受限及未知分别处理，隐私限制可叠加。
- [ ] 审核材料齐全和获得正式馆方批准在数据契约里分开。
- [ ] 未知规则、未知馆藏、OCR失败、缺件、证据冲突和不适用不互相替代。
- [ ] 受限档案及原件外借不可能由模板自身自动完成交付。
- [ ] 能表达普通申请和代理/单位等条件分支，且不同授权不能相互继承。
- [ ] 模板模块化候选有明确输入、输出、依赖、例外和责任边界。
- [ ] 旧政策和临时公告不能跨学校、跨时间窗污染现行审核。
- [ ] 16个合成案例全部关联到具体规则和例外；金标准不进入审核输入。
- [ ] 校本待核要求明确展示，不假装已取得2026三张申请表原文字段。
- [ ] 实际发布前执行项目原生模板校验、OCR/模型试跑、CheckResult覆盖审计与隔离Oracle评分。

---

## 16. 证据登记与引用边界

文档沿用 v1.4 的事实范围；这部分是开发者判断哪些材料需求可激活的重要附件。**引用只支持标记的事实，不替任何学校确定未查明的具体表格字段。**

| 来源ID | 文献与校验用途 | 可确认/限制 | URL |
|---|---|---|---|
| LAW01 | 《中华人民共和国档案法》 | 档案利用、保密和权限的上位约束，不能据此推导某校固定表名 | https://www.saac.gov.cn/daj/falv/202006/79ca4f151fde470c996bec0d50601505.shtml |
| LAW02 | 《高等学校档案管理办法》 | 公开/未开放/珍贵原件/档案证明的权限差异 | https://jyj.yingkou.gov.cn/govxxgk/jyj/2024-04-16/78597aa9-35e5-4874-bc2f-2e0ea852156b.html |
| LAW03 | 《中华人民共和国档案法实施条例》 | 查阅、复制、摘录和档案复制件等规范；具体要件依适用条款 | https://www.saac.gov.cn/daj/xzfg/202401/2ebf9e8cc94a4f6cbff5a8210f25dc88.shtml |
| LAW04 | 《电子档案管理办法》 | 合法电子档案效力不能被一概否定 | https://www.saac.gov.cn/daj/xzfgk/202412/41b270e9dfc44f48a09adcc5f4fe8296.shtml |
| SC01 | 四川省《高等学校档案管理办法》实施细则 | 权限层级与限制性利用；适用版本应核实 | https://dag.cdu.edu.cn/info/1016/1109.htm |
| CD01 | 成都理工大学档案馆2026申请表目录 | 学生档案、综合查阅、综合外借三表存在，**原件字段未完整核实** | https://dag.cdut.edu.cn/xzzq/sqbg.htm |
| CD02 | 成都理工大学2026学生档案服务指南索引 | 校内校外人员办理差异；索引摘要不代表全文 | https://dag.cdut.edu.cn/cdzn.htm |
| CD03 | 成都理工大学综合类档案查借阅指南（2020） | 委托学籍查档需委托材料；当前适用程度应复核 | https://dag.cdut.edu.cn/info/1036/1493.htm |
| CD04 | 成都理工大学2026寒假档案业务通知 | **仅寒假窗口**的线上/邮寄相关条件 | https://dag.cdut.edu.cn/info/1076/2055.htm |
| CD05 | 成都理工大学2026归档工作通知 | 引用2024版档案管理规程，不等于覆盖全部利用细则 | https://dag.cdut.edu.cn/info/1076/2086.htm |
| CD06 | 成都理工档案法规目录（2017利用办法） | 公开目录出现旧办法，无法从目录断言与2024版是否冲突 | https://dag.cdut.edu.cn/dafg.htm |
| EX04 | 青岛大学2025档案查（借）阅登记表 | 外校真实字段结构，不能照搬校本借期等强制要求 | https://dag.qdu.edu.cn/info/1010/2344.htm |
| EX05 | 河北经贸大学档案查阅/借阅审批表 | 外校角色、审批和交接字段，不能强加成都理工 | https://zhda.hueb.edu.cn/info/1145/1306.htm |
| EX06 | 大连海洋大学2025档案利用通知 | 外校函件、复制和借阅要求，供通用结构借鉴 | https://dag.dlou.edu.cn/2025/0325/c2297a188194/page.htm |

### 16.1 尚待本校提供或系统接入的参数（不阻止通用模板开发）

1. 成都理工2026三张申请表完整原件（精确栏位与签章次序）。
2. 成都理工2024《档案管理规程》和2017《档案利用管理办法》的适用关系及当前完整规则。
3. 学生个人档案查阅及敏感综合档案利用的具体有权签批部门和使用范围。
4. 馆藏目录、开放状态、申请人身份、授权批准、借出与归还的可信数据接口。
5. 实际外借期限、可借出档案类型、归还/续借条件及系统状态回执。
6. 线上办理能否代替证件扫描/纸质委托、电子签章的接收范围和日志要求。

---

## 17. 最终结论

**这是一套可以进一步交给模板编辑器开发和测试的档案利用申请审核业务模板，不是一份已经在成都理工大学生产环境自动授权的审批系统。**

最优先复用的能力是：**条件字段、条件材料槽、规则版本匹配、主体/委托关系、多对象逐操作、签批阶段、证据来源覆盖、复杂结果聚合与人工门控**。对本模板而言，档案馆开放状态、特殊档案权限和原件外借是**独立于通用字段复用的专有责任边界**。

后续如果补齐本校表格，只需在同一模板的字段/材料槽/第5—6节规则中按有效来源增加条件配置；不要拆出新的本人/代理/单位查档模板，不要把未确认校规硬塞成全国通用必交条款。
