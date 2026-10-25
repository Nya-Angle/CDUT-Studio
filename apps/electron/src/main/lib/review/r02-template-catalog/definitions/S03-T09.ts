/**
 * R02 S03-T09 本地研究模板定义。
 * 来源：docs/design/review-agent/business-templates/R02/S03-T09.md
 * SHA-256：ab857770cd37d79c922a16a4d2a3cdedd13aca60e85d71f1f03b2f15323028a4
 * 非校方正式模板；未确认政策只可形成建议并进入人工复核。
 */
import type { TemplateVersion } from '@profer/shared'

export const template: TemplateVersion = {
  "templateId": "S03-T09",
  "version": 1,
  "schemaVersion": 2,
  "name": "勤工助学岗位申请资格审核",
  "description": "勤工助学岗位申请资格审核。本地研究模板 · 非校方正式模板。仅用于事实核验、证据对应和人工复核；不代行学校签批，不自动产生正式批准或拒绝。",
  "catalogKind": "builtin",
  "sourceNote": "R02_RESEARCH_TEMPLATE_NONOFFICIAL: 本地研究模板，非成都理工大学校方正式模板；原件 S03-T09 的字段、材料槽、规则及阶段转换为 V3 TemplateVersion；政策证据状态 PARTIAL，未确认条件只生成审阅建议/待确认事项，最终决定须由本地 reviewer/teacher 人工处理。",
  "objectType": "person",
  "displayName": {
    "template": "勤工助学岗位申请资格审核"
  },
  "fields": [
    {
      "key": "F001",
      "label": "申请人权威主体键 id · A；P1+ · 学校身份服务/有权在读证明之主体索引；申请书填写仅作匹配线索",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原研究字段 F001；申请人权威主体键 id · A；P1+ · 学校身份服务/有权在读证明之主体索引；申请书填写仅作匹配线索 · L2 · SU；自填 ID 不升级可信身份。候选字段字典不是校方现行表单转录；未确认的必需性、枚举值及权限不得推定。"
    },
    {
      "key": "F002",
      "label": "申请人姓名 str · A；P1+ · 学籍姓名栏对照 M003、申请签名或表首页 M004",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原研究字段 F002；申请人姓名 str · A；P1+ · 学籍姓名栏对照 M003、申请签名或表首页 M004 · L2 · SU/NM；异名用 CF 并查合法变更，不立即拒绝。候选字段字典不是校方现行表单转录；未确认的必需性、枚举值及权限不得推定。"
    },
    {
      "key": "F003",
      "label": "学号 str · A；P1+ · 学籍记录学号与表首页；不把学号本身当身份认证令牌",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原研究字段 F003；学号 str · A；P1+ · 学籍记录学号与表首页；不把学号本身当身份认证令牌 · L2 · SU/NM；冲突 CF。候选字段字典不是校方现行表单转录；未确认的必需性、枚举值及权限不得推定。"
    },
    {
      "key": "F004",
      "label": "申请人学段 enum · A；P1+ · 学籍学历层次／在读身份，M003；需区分本科与研究生助管路由",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原研究字段 F004；申请人学段 enum · A；P1+ · 学籍学历层次／在读身份，M003；需区分本科与研究生助管路由 · L2 · SU；非本事项路由 HD。候选字段字典不是校方现行表单转录；未确认的必需性、枚举值及权限不得推定。"
    },
    {
      "key": "F005",
      "label": "校区 enum · A；P1+ · 权威在读学籍或校区登记 M003，对照通知覆盖校区",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "原研究字段 F005；校区 enum · A；P1+ · 权威在读学籍或校区登记 M003，对照通知覆盖校区 · L2 · SU/PU；不得据 2025 成都限定否定其他校区。候选字段字典不是校方现行表单转录；未确认的必需性、枚举值及权限不得推定。"
    },
    {
      "key": "F006",
      "label": "学籍与在校状态 enum · A；P1+ · 校方有效学籍或相应签发证明 M003",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "原研究字段 F006；学籍与在校状态 enum · A；P1+ · 校方有效学籍或相应签发证明 M003 · L2 · SU；不以自报在籍判 PASS。候选字段字典不是校方现行表单转录；未确认的必需性、枚举值及权限不得推定。"
    },
    {
      "key": "F007",
      "label": "学院／专业归属 str · A；P1+ · 权威学籍所在院系 M003",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原研究字段 F007；学院／专业归属 str · A；P1+ · 权威学籍所在院系 M003 · L2 · SU；跨院申请允许性须核公告。候选字段字典不是校方现行表单转录；未确认的必需性、枚举值及权限不得推定。"
    },
    {
      "key": "F008",
      "label": "入学年份／在读年级 enum · A；P1+ · 权威学籍和当前学年计算依据 M003",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原研究字段 F008；入学年份／在读年级 enum · A；P1+ · 权威学籍和当前学年计算依据 M003 · L2 · SU/PU；通知限制年级才触发。候选字段字典不是校方现行表单转录；未确认的必需性、枚举值及权限不得推定。"
    },
    {
      "key": "F009",
      "label": "联系渠道 ref · A；P1 · 申请表／简历中本人的联系栏 M004/M005",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原研究字段 F009；联系渠道 ref · A；P1 · 申请表／简历中本人的联系栏 M004/M005 · L2 · NM/NA；仅若该招聘要求。候选字段字典不是校方现行表单转录；未确认的必需性、枚举值及权限不得推定。"
    },
    {
      "key": "F010",
      "label": "代理提交／授权引用 ref · A；P1+ · 本人可验证授权、代理身份及有权渠道 M028",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原研究字段 F010；代理提交／授权引用 ref · A；P1+ · 本人可验证授权、代理身份及有权渠道 M028 · L3 · 无代办则 NA；有代办无授权 HD，不能冒用本人意愿。候选字段字典不是校方现行表单转录；未确认的必需性、枚举值及权限不得推定。"
    },
    {
      "key": "F011",
      "label": "本人申请／选择岗位意愿 boolean+datetime · A；P1 · 经验证的提交动作／本人署名，M004 或 M005 与 M013",
      "kind": "boolean",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原研究字段 F011；本人申请／选择岗位意愿 boolean+datetime · A；P1 · 经验证的提交动作／本人署名，M004 或 M005 与 M013 · L2 · NM；未确认本人意愿停受理。候选字段字典不是校方现行表单转录；未确认的必需性、枚举值及权限不得推定。"
    },
    {
      "key": "F012",
      "label": "招聘批次唯一键 id · B；P0+ · 学校或用工单位权威公告及批次记录 M001",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原研究字段 F012；招聘批次唯一键 id · B；P0+ · 学校或用工单位权威公告及批次记录 M001 · L1 · PU；未识别批次不能套规则。候选字段字典不是校方现行表单转录；未确认的必需性、枚举值及权限不得推定。"
    },
    {
      "key": "F013",
      "label": "官方公告原始位置 ref · B；P0+ · 招聘页面的 URL、标题或有权发文归档 M001",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "原研究字段 F013；官方公告原始位置 ref · B；P0+ · 招聘页面的 URL、标题或有权发文归档 M001 · L0 · PU/SU；不接受仅截屏无来源定位。候选字段字典不是校方现行表单转录；未确认的必需性、枚举值及权限不得推定。"
    },
    {
      "key": "F014",
      "label": "公告版本与发布时间 str+datetime · B；P0+ · 有权发文记录及修订链 M001",
      "kind": "date",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "原研究字段 F014；公告版本与发布时间 str+datetime · B；P0+ · 有权发文记录及修订链 M001 · L0 · PU；历史公告不得视作现行。候选字段字典不是校方现行表单转录；未确认的必需性、枚举值及权限不得推定。"
    },
    {
      "key": "F015",
      "label": "学年学期 interval · B；P0+ · 公告适用期及学年描述 M001",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原研究字段 F015；学年学期 interval · B；P0+ · 公告适用期及学年描述 M001 · L0 · PU；不跨学年套用。候选字段字典不是校方现行表单转录；未确认的必需性、枚举值及权限不得推定。"
    },
    {
      "key": "F016",
      "label": "设岗／用工单位 id+str · B；P0+ · 公告署名和岗位明细 M001/M002",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原研究字段 F016；设岗／用工单位 id+str · B；P0+ · 公告署名和岗位明细 M001/M002 · L1 · PU；多单位同名岗不可混用。候选字段字典不是校方现行表单转录；未确认的必需性、枚举值及权限不得推定。"
    },
    {
      "key": "F017",
      "label": "岗位在该批次唯一键 id · B；P0+ · 岗位清单行键／学校核定岗位号 M002；若无官方编号应生成仅用于本案的复合定位键并标非官方",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原研究字段 F017；岗位在该批次唯一键 id · B；P0+ · 岗位清单行键／学校核定岗位号 M002；若无官方编号应生成仅用于本案的复合定位键并标非官方 · L1 · PU/NM；需单位+岗位+批次定位。候选字段字典不是校方现行表单转录；未确认的必需性、枚举值及权限不得推定。"
    },
    {
      "key": "F018",
      "label": "岗位名称 str · B；P0+ · 官方岗位明细岗位名称栏 M002",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原研究字段 F018；岗位名称 str · B；P0+ · 官方岗位明细岗位名称栏 M002 · L0 · PU；模糊标题要求确认。候选字段字典不是校方现行表单转录；未确认的必需性、枚举值及权限不得推定。"
    },
    {
      "key": "F019",
      "label": "岗位形态 enum · B；P0+ · 有权岗位公告所述固定／临时／其他类型 M001/M002",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原研究字段 F019；岗位形态 enum · B；P0+ · 有权岗位公告所述固定／临时／其他类型 M001/M002 · L0 · PU；未见校本制度不发明类型。候选字段字典不是校方现行表单转录；未确认的必需性、枚举值及权限不得推定。"
    },
    {
      "key": "F020",
      "label": "岗位资格与能力条款 list+ref · B；P0+ · 官方通知条项及岗位职责条项 M001/M002",
      "kind": "multi",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原研究字段 F020；岗位资格与能力条款 list+ref · B；P0+ · 官方通知条项及岗位职责条项 M001/M002 · L0 · PU；仅记录原文及范围，AI 不裁量胜任程度。候选字段字典不是校方现行表单转录；未确认的必需性、枚举值及权限不得推定。"
    },
    {
      "key": "F021",
      "label": "困难身份适用模式 enum · B；P0+ · 有权岗位公告相应条款 M001，值仅区分“明示必需／明示优先／未载明／冲突待核”",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原研究字段 F021；困难身份适用模式 enum · B；P0+ · 有权岗位公告相应条款 M001，值仅区分“明示必需／明示优先／未载明／冲突待核” · L1 · PU/HD；SRC-005 与 SRC-006 有差异。候选字段字典不是校方现行表单转录；未确认的必需性、枚举值及权限不得推定。"
    },
    {
      "key": "F022",
      "label": "当期报名截止 datetime · B；P0–P2 · 官方有效公告或授权补充通知 M001",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原研究字段 F022；当期报名截止 datetime · B；P0–P2 · 官方有效公告或授权补充通知 M001 · L0 · PU；日期未得不以历史过期拒绝。候选字段字典不是校方现行表单转录；未确认的必需性、枚举值及权限不得推定。"
    },
    {
      "key": "F023",
      "label": "岗位人数／名额 int · B；P0–P4 · 经核定岗位清单 M002",
      "kind": "number",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原研究字段 F023；岗位人数／名额 int · B；P0–P4 · 经核定岗位清单 M002 · L1 · SU/HD；名额不代表自动录用。候选字段字典不是校方现行表单转录；未确认的必需性、枚举值及权限不得推定。"
    },
    {
      "key": "F024",
      "label": "申请提交唯一键 id · C；P1+ · 用工单位的签收、邮件回执或可信申请案卷 M013",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原研究字段 F024；申请提交唯一键 id · C；P1+ · 用工单位的签收、邮件回执或可信申请案卷 M013 · L1 · NM/NA；纸件可能无系统号，以登记凭据替代。候选字段字典不是校方现行表单转录；未确认的必需性、枚举值及权限不得推定。"
    },
    {
      "key": "F025",
      "label": "本岗接受的申请载体 enum · C；P1+ · 当前公告要求与实际申请件 M001、M004/M005",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原研究字段 F025；本岗接受的申请载体 enum · C；P1+ · 当前公告要求与实际申请件 M001、M004/M005 · L1 · PU；本科表不能代替研究生专表。候选字段字典不是校方现行表单转录；未确认的必需性、枚举值及权限不得推定。"
    },
    {
      "key": "F026",
      "label": "申请／收件时间 datetime · C；P1+ · 用工单位签收或可信提交回执 M013；学生截图为次级证据",
      "kind": "date",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原研究字段 F026；申请／收件时间 datetime · C；P1+ · 用工单位签收或可信提交回执 M013；学生截图为次级证据 · L1 · NM/SU；逾期是否接受由有权人判定。候选字段字典不是校方现行表单转录；未确认的必需性、枚举值及权限不得推定。"
    },
    {
      "key": "F027",
      "label": "简历、经验及自述技能 list · C；P1–P3 · 申请人简历正文／附件 M005（待岗位面核）",
      "kind": "multi",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F027；简历、经验及自述技能 list · C；P1–P3 · 申请人简历正文／附件 M005（待岗位面核） · L2 · 条件 NM/NA；自述不代表技能认证。候选字段字典不是校方现行表单转录；未确认的必需性、枚举值及权限不得推定。"
    },
    {
      "key": "F028",
      "label": "课程安排／空闲课表 list+interval · C；P1–P3 · 学生课表或有权教学记录 M006；学生自述须标自报",
      "kind": "multi",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原研究字段 F028；课程安排／空闲课表 list+interval · C；P1–P3 · 学生课表或有权教学记录 M006；学生自述须标自报 · L2 · 条件 NM/SU；不直接裁量“学有余力”。候选字段字典不是校方现行表单转录；未确认的必需性、枚举值及权限不得推定。"
    },
    {
      "key": "F029",
      "label": "可工作时间计划 list+interval · C；P1–P3 · 申请人时间意愿 M007，对照岗位实际安排",
      "kind": "multi",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F029；可工作时间计划 list+interval · C；P1–P3 · 申请人时间意愿 M007，对照岗位实际安排 · L2 · 条件 NM；与课表冲突 CF。候选字段字典不是校方现行表单转录；未确认的必需性、枚举值及权限不得推定。"
    },
    {
      "key": "F030",
      "label": "辅导员／导师意见 ref · C；P1–P3 · 有权老师签注及所属批次要求 M012",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F030；辅导员／导师意见 ref · C；P1–P3 · 有权老师签注及所属批次要求 M012 · L2 · 条件 NM/HD；SRC-014 仅为岗位案例，非全校常规必填。候选字段字典不是校方现行表单转录；未确认的必需性、枚举值及权限不得推定。"
    },
    {
      "key": "F031",
      "label": "困难认定结论引用 ref · Q；P1–P4 · S03-T06 正式决定记录／有权认定结果 M008",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原研究字段 F031；困难认定结论引用 ref · Q；P1–P4 · S03-T06 正式决定记录／有权认定结果 M008 · L3 · 明示优先主张或硬门槛时 SU/HD；其他 NA。候选字段字典不是校方现行表单转录；未确认的必需性、枚举值及权限不得推定。"
    },
    {
      "key": "F032",
      "label": "困难认定覆盖学年与等级 interval+enum · Q；P1–P4 · S03-T06 决定有效期和等级字段 M008",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F032；困难认定覆盖学年与等级 interval+enum · Q；P1–P4 · S03-T06 决定有效期和等级字段 M008 · L3 · SU/PU；不得拿上一年度等级自动套新批次。候选字段字典不是校方现行表单转录；未确认的必需性、枚举值及权限不得推定。"
    },
    {
      "key": "F033",
      "label": "纪律处分状态及影响期 ref+interval · Q；P2–P3 · 有权校纪记录／正式已生效处理及其影响期 M009",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F033；纪律处分状态及影响期 ref+interval · Q；P2–P3 · 有权校纪记录／正式已生效处理及其影响期 M009 · L3 · 仅岗位明确要求时 SU/HD；自报“无处分”非权威。候选字段字典不是校方现行表单转录；未确认的必需性、枚举值及权限不得推定。"
    },
    {
      "key": "F034",
      "label": "学业负担／成绩事实 ref · Q；P2–P3 · 教务成绩、修业状态等正式记录 M009（按岗位要求最小范围）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F034；学业负担／成绩事实 ref · Q；P2–P3 · 教务成绩、修业状态等正式记录 M009（按岗位要求最小范围） · L2 · 条件 SU/HD；不擅定绩点、挂科阈值。候选字段字典不是校方现行表单转录；未确认的必需性、枚举值及权限不得推定。"
    },
    {
      "key": "F035",
      "label": "已有在岗及有效期 ref+interval · Q；P1–P4 · 学校勤工助学或用工单位在岗台账 M010",
      "kind": "date",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "原研究字段 F035；已有在岗及有效期 ref+interval · Q；P1–P4 · 学校勤工助学或用工单位在岗台账 M010 · L2 · 条件 SU/HD；不能因他人名单同名就认定一人多岗。候选字段字典不是校方现行表单转录；未确认的必需性、枚举值及权限不得推定。"
    },
    {
      "key": "F036",
      "label": "岗位特需证明／作品 ref · C；P1–P3 · 岗位公告要求的技能证明、作品或可核经验 M011",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F036；岗位特需证明／作品 ref · C；P1–P3 · 岗位公告要求的技能证明、作品或可核经验 M011 · L2 · 条件 NM/UR；面试胜任性 HD。候选字段字典不是校方现行表单转录；未确认的必需性、枚举值及权限不得推定。"
    },
    {
      "key": "F037",
      "label": "当前收件／补件检查状态 enum · C；P2+ · 受理记录、缺口明细和材料版本 M013/M027",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原研究字段 F037；当前收件／补件检查状态 enum · C；P2+ · 受理记录、缺口明细和材料版本 M013/M027 · L1 · NM/UR；材料齐备不等于录用。候选字段字典不是校方现行表单转录；未确认的必需性、枚举值及权限不得推定。"
    },
    {
      "key": "F038",
      "label": "面试事件与评价引用 ref · D；P3+ · 岗位老师有权面试记录 M014",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F038；面试事件与评价引用 ref · D；P3+ · 岗位老师有权面试记录 M014 · L2 · 未来阶段 NA；到 P3 无凭证 SU/HD。候选字段字典不是校方现行表单转录；未确认的必需性、枚举值及权限不得推定。"
    },
    {
      "key": "F039",
      "label": "拟录用名单行引用 ref · D；P3+ · 用工单位正式拟录用名单 M015",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F039；拟录用名单行引用 ref · D；P3+ · 用工单位正式拟录用名单 M015 · L2 · 未来阶段 NA；不能以口头通知代终审。候选字段字典不是校方现行表单转录；未确认的必需性、枚举值及权限不得推定。"
    },
    {
      "key": "F040",
      "label": "学院审核记录引用 ref · D；P4+ · 有权学院工作组审核文件 M016（仅该批次确有环节）",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原研究字段 F040；学院审核记录引用 ref · D；P4+ · 有权学院工作组审核文件 M016（仅该批次确有环节） · L2 · NA/HD；岗位审批链须先核。候选字段字典不是校方现行表单转录；未确认的必需性、枚举值及权限不得推定。"
    },
    {
      "key": "F041",
      "label": "公示及公示期间引用 ref+interval · D；P4+ · 正式公示页面／留档 M017",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "原研究字段 F041；公示及公示期间引用 ref+interval · D；P4+ · 正式公示页面／留档 M017 · L2 · NA/SU；公示无异议不自动等于终审。候选字段字典不是校方现行表单转录；未确认的必需性、枚举值及权限不得推定。"
    },
    {
      "key": "F042",
      "label": "公示异议引用 ref · D；P4+ · 有权受理部门异议登记与处理 M026",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原研究字段 F042；公示异议引用 ref · D；P4+ · 有权受理部门异议登记与处理 M026 · L3 · 无异议 NA；有异议但无办理记录 HD。候选字段字典不是校方现行表单转录；未确认的必需性、枚举值及权限不得推定。"
    },
    {
      "key": "F043",
      "label": "校级／有权最终决定引用 ref · D；P4+ · 有权审批系统已核记录或正式签发决定 M018",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原研究字段 F043；校级／有权最终决定引用 ref · D；P4+ · 有权审批系统已核记录或正式签发决定 M018 · L3 · 无批准时不可称“已批准”；SU/HD。候选字段字典不是校方现行表单转录；未确认的必需性、枚举值及权限不得推定。"
    },
    {
      "key": "F044",
      "label": "上岗／聘用生效期间 interval · D；P5+ · 正式聘用安排、授权上岗通知 M019",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原研究字段 F044；上岗／聘用生效期间 interval · D；P5+ · 正式聘用安排、授权上岗通知 M019 · L2 · 未来阶段 NA；不能从岗位公告聘期自动推本人入岗。候选字段字典不是校方现行表单转录；未确认的必需性、枚举值及权限不得推定。"
    },
    {
      "key": "F045",
      "label": "考核／工时所属月 interval · E；P5–P6 · 部门考勤月度台账 M020",
      "kind": "number",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原研究字段 F045；考核／工时所属月 interval · E；P5–P6 · 部门考勤月度台账 M020 · L2 · 未来阶段 NA；跨月要独立结算。候选字段字典不是校方现行表单转录；未确认的必需性、枚举值及权限不得推定。"
    },
    {
      "key": "F046",
      "label": "实际在岗工时 decimal · E；P5–P6 · 有权岗位签到、考勤审核 M020",
      "kind": "number",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原研究字段 F046；实际在岗工时 decimal · E；P5–P6 · 有权岗位签到、考勤审核 M020 · L2 · SU/HD；计划时长不可替代实际工时。候选字段字典不是校方现行表单转录；未确认的必需性、枚举值及权限不得推定。"
    },
    {
      "key": "F047",
      "label": "岗位考核结果 ref+enum · E；P5–P6 · 用工单位有权考核记录 M021",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原研究字段 F047；岗位考核结果 ref+enum · E；P5–P6 · 用工单位有权考核记录 M021 · L2 · SU/HD；不能 AI 评分生成官方考核。候选字段字典不是校方现行表单转录；未确认的必需性、枚举值及权限不得推定。"
    },
    {
      "key": "F048",
      "label": "本月核定应付金额 decimal · E；P6 · 正式考核＋计酬规则及核定单 M022",
      "kind": "number",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原研究字段 F048；本月核定应付金额 decimal · E；P6 · 正式考核＋计酬规则及核定单 M022 · L3 · NA/SU；历史 400/600 元不能自动套 2026。候选字段字典不是校方现行表单转录；未确认的必需性、枚举值及权限不得推定。"
    },
    {
      "key": "F049",
      "label": "酬金报送凭证 ref · E；P6 · 资助中心／财务收件、工资批次记录 M022",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F049；酬金报送凭证 ref · E；P6 · 资助中心／财务收件、工资批次记录 M022 · L3 · NA/SU；“已报送”不等于“已付款”。候选字段字典不是校方现行表单转录；未确认的必需性、枚举值及权限不得推定。"
    },
    {
      "key": "F050",
      "label": "实际支付／到账核对引用 ref · E；P6 · 财务支付流水／合法对账证明 M023，不默认包含全卡号",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原研究字段 F050；实际支付／到账核对引用 ref · E；P6 · 财务支付流水／合法对账证明 M023，不默认包含全卡号 · L3 · NA/SU；若只见工资表，禁止判已到账。候选字段字典不是校方现行表单转录；未确认的必需性、枚举值及权限不得推定。"
    },
    {
      "key": "F051",
      "label": "申请撤回／离岗请求 ref+datetime · V；P1–P7 · 本人可核身份的撤回／退出记录 M024",
      "kind": "date",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原研究字段 F051；申请撤回／离岗请求 ref+datetime · V；P1–P7 · 本人可核身份的撤回／退出记录 M024 · L2 · 无请求 NA；仅请求不改已批准状态。候选字段字典不是校方现行表单转录；未确认的必需性、枚举值及权限不得推定。"
    },
    {
      "key": "F052",
      "label": "换岗、续聘、替补及交接引用 ref · V；P5–P7 · 用工方正式调配／续聘、岗位交接 M025",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原研究字段 F052；换岗、续聘、替补及交接引用 ref · V；P5–P7 · 用工方正式调配／续聘、岗位交接 M025 · L2 · NA/HD；需有权人确认改变聘用状态。候选字段字典不是校方现行表单转录；未确认的必需性、枚举值及权限不得推定。"
    },
    {
      "key": "F053",
      "label": "异议／复核申请及决定引用 ref · V；P2–P7 · 有权受理部门受理／处理／最终复核记录 M026",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F053；异议／复核申请及决定引用 ref · V；P2–P7 · 有权受理部门受理／处理／最终复核记录 M026 · L3 · 无案 NA；路径或期限不明 PU/HD。候选字段字典不是校方现行表单转录；未确认的必需性、枚举值及权限不得推定。"
    },
    {
      "key": "F054",
      "label": "案卷申请及材料版本号 str · V；P1+ · 本模板案卷版本及已接受变更链 M013/M027",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原研究字段 F054；案卷申请及材料版本号 str · V；P1+ · 本模板案卷版本及已接受变更链 M013/M027 · L1 · 系统必须生成并持久保存；无可靠版本 HD。候选字段字典不是校方现行表单转录；未确认的必需性、枚举值及权限不得推定。"
    },
    {
      "key": "F055",
      "label": "每项材料来源主体／归属 id+str · V；P1+ · 上传者或学校系统签发者、申请案卷/岗位/月份归属 M001–M029",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原研究字段 F055；每项材料来源主体／归属 id+str · V；P1+ · 上传者或学校系统签发者、申请案卷/岗位/月份归属 M001–M029 · L2 · 来源不明 HD；跨案不能按文件名混附。候选字段字典不是校方现行表单转录；未确认的必需性、枚举值及权限不得推定。"
    },
    {
      "key": "F056",
      "label": "材料内容摘要与来源版本 hash+str · V；P1+ · 文件哈希、签发编号、修订时间／原件页锚 M001–M029",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "原研究字段 F056；材料内容摘要与来源版本 hash+str · V；P1+ · 文件哈希、签发编号、修订时间／原件页锚 M001–M029 · L1 · 无校验不作自动复用；新版本使依赖旧版的事实预审失效。候选字段字典不是校方现行表单转录；未确认的必需性、枚举值及权限不得推定。"
    },
    {
      "key": "F057",
      "label": "决定签发人可信身份 ref · V；P4+ · 校方已认证主体或有效签章核验结果 M016/M018/M026",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原研究字段 F057；决定签发人可信身份 ref · V；P4+ · 校方已认证主体或有效签章核验结果 M016/M018/M026 · L3 · SU/HD；Renderer 自报 actor 绝不可代替。候选字段字典不是校方现行表单转录；未确认的必需性、枚举值及权限不得推定。"
    },
    {
      "key": "F058",
      "label": "决定者在当时的权限与授权链 ref · V；P4+ · 任职/授权记录、审签路由与审批来源 M016/M018/M026",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原研究字段 F058；决定者在当时的权限与授权链 ref · V；P4+ · 任职/授权记录、审签路由与审批来源 M016/M018/M026 · L3 · SU/HD；签字姓名与有权批准是不同事实。候选字段字典不是校方现行表单转录；未确认的必需性、枚举值及权限不得推定。"
    },
    {
      "key": "F059",
      "label": "岗位具体作业风险、岗前安全教育/培训及准入事实 ref+enum · B/E；P0–P5 · 设岗安全风险说明、部门岗前培训/安全教育及真实工作任务记录 M002/M019/M029；只记录有权确认的类别及有效期",
      "kind": "date",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原研究字段 F059；岗位具体作业风险、岗前安全教育/培训及准入事实 ref+enum · B/E；P0–P5 · 设岗安全风险说明、部门岗前培训/安全教育及真实工作任务记录 M002/M019/M029；只记录有权确认的类别及有效期 · L2 · 对可能危害身心健康的工作无可靠记录则 PU/HD；未发生培训时不可伪造已培训，培训事实不代表自动准入。候选字段字典不是校方现行表单转录；未确认的必需性、枚举值及权限不得推定。"
    }
  ],
  "materialSlots": [
    {
      "id": "M001",
      "name": "招聘真实存在、适用范围与政策门槛；发文设岗单位",
      "purpose": "原研究材料槽 M001：招聘真实存在、适用范围与政策门槛；发文设岗单位；原始校方招聘公告、授权补充通知；P0；必（由校方供给）；学校正式通知档案可代不可访问网页，须证明版本真实；F012–F016、F019–F022；SRC-005、006、010、013–015；锁学年、单位、公告时间；失联 SU／时效不明 PU／截图不可读 UR",
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
      "requiredElements": [
        "招聘真实存在、适用范围与政策门槛；发文设岗单位",
        "核对主体、适用阶段、来源与版本",
        "分别记录缺失、不可读、来源不可用、政策未确认和事实冲突"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M002",
      "name": "岗位名称、类型、数量、职责及要求；设岗单位",
      "purpose": "原研究材料槽 M002：岗位名称、类型、数量、职责及要求；设岗单位；有权岗位明细表／批准岗位记录；P0；必（由校方供给）；公告正文完整岗位表可代，不能用学生简历代；F016–F020、F023；SRC-005、006、013、014；一岗位一版本、一批次一归属；缺明细 PU/SU，读不清 UR",
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
      "requiredElements": [
        "岗位名称、类型、数量、职责及要求；设岗单位",
        "核对主体、适用阶段、来源与版本",
        "分别记录缺失、不可读、来源不可用、政策未确认和事实冲突"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M003",
      "name": "主体、学段、学籍、校区和院系匹配；校方学籍机构",
      "purpose": "原研究材料槽 M003：主体、学段、学籍、校区和院系匹配；校方学籍机构；有权学籍记录／合法在读身份证明；P1；必（事实）但不强制学生上传；校方直接查询优先，受理方认可的有效学籍证明可代；F001–F008；SRC-005、006、013、014；绑定权威学生键及记录时间；源不可查 SU、证明不可读 UR，身份不符 CF",
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
      "requiredElements": [
        "主体、学段、学籍、校区和院系匹配；校方学籍机构",
        "核对主体、适用阶段、来源与版本",
        "分别记录缺失、不可读、来源不可用、政策未确认和事实冲突"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M004",
      "name": "本人自愿申请及特定岗位表单；学生／受理单位",
      "purpose": "原研究材料槽 M004：本人自愿申请及特定岗位表单；学生／受理单位；当期规定的固定岗申请表（校方格式原件暂未读到）；P1；C01/C04 等条件必，只在岗位公告要求时提交；合法官方电子表或明确认可的纸表可代，简历是否可代须该岗位许可；F002–F003、F009、F011、F017–F018、F024–F026；SRC-005、013、014、015；学生签署版与签收版分存；该岗明示必交而缺 NM，文件 UR；后期审批章不可强求当期已有",
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
      "requiredElements": [
        "本人自愿申请及特定岗位表单；学生／受理单位",
        "核对主体、适用阶段、来源与版本",
        "分别记录缺失、不可读、来源不可用、政策未确认和事实冲突"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M005",
      "name": "自述经历、技能、岗位意愿及联系；学生",
      "purpose": "原研究材料槽 M005：自述经历、技能、岗位意愿及联系；学生；简历／报名说明／相关自述文件；P1；C02 条件必；正式申请表若公告准许完整承载这些事实可代；F009、F011、F017–F018、F025、F027；SRC-006、008；学生自述层级，非资格证明；要求而缺 NM，不可读 UR",
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
      "requiredElements": [
        "自述经历、技能、岗位意愿及联系；学生",
        "核对主体、适用阶段、来源与版本",
        "分别记录缺失、不可读、来源不可用、政策未确认和事实冲突"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M006",
      "name": "课表／学习时间事实；学生或教务源",
      "purpose": "原研究材料槽 M006：课表／学习时间事实；学生或教务源；本学期课表／可信教学安排；P1–P3；条件必（具体岗位要求时）；可用受理方获授权的教务课表查询，避免重复上传；F028、F034；SRC-006、008、014；标学期与课表修订号；源失联 SU，上传件 UR，与意愿冲突 CF",
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
      "requiredElements": [
        "课表／学习时间事实；学生或教务源",
        "核对主体、适用阶段、来源与版本",
        "分别记录缺失、不可读、来源不可用、政策未确认和事实冲突"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M007",
      "name": "可承担岗位时间意愿；学生",
      "purpose": "原研究材料槽 M007：可承担岗位时间意愿；学生；可工作时段、班次计划、申报表相应栏；P1–P3；条件必（岗位要求时）；M004/M005 已有完整时间字段可免重复文件；F029、F017、F018；SRC-006、008、013；属学生意愿，不证明真实到岗；缺 NM，时间冲突 CF，读不清 UR",
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
      "requiredElements": [
        "可承担岗位时间意愿；学生",
        "核对主体、适用阶段、来源与版本",
        "分别记录缺失、不可读、来源不可用、政策未确认和事实冲突"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M008",
      "name": "困难认定有效结论，区分优先和门槛；S03-T06 有权部门",
      "purpose": "原研究材料槽 M008：困难认定有效结论，区分优先和门槛；S03-T06 有权部门；正式困难认定结果／证明的受控引用；P1–P4；条件必：C04 硬门槛或 C03 主张优先时，优先引用权威结论；不得强迫提交家庭细节材料；F021、F031–F032；SRC-005、006、011、013、014；绑定认定对象和学年版本；无权威源 SU，政策冲突 PU/HD，含敏感信息不得泛传",
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
      "requiredElements": [
        "困难认定有效结论，区分优先和门槛；S03-T06 有权部门",
        "核对主体、适用阶段、来源与版本",
        "分别记录缺失、不可读、来源不可用、政策未确认和事实冲突"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M009",
      "name": "校纪及学业要求中确需核对的具体事实；校纪／教务主管机构",
      "purpose": "原研究材料槽 M009：校纪及学业要求中确需核对的具体事实；校纪／教务主管机构；已生效处分记录、处分影响期、成绩／修业事实的最小字段；P2；条件必，须职位公告明确对应范围；正式校方结论或受理方认可证明可代，不取完整无关档案；F033–F034；SRC-005、013、014；学期及效力期，查不到 SU，证据矛盾 CF，阈值未知 PU",
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
      "requiredElements": [
        "校纪及学业要求中确需核对的具体事实；校纪／教务主管机构",
        "核对主体、适用阶段、来源与版本",
        "分别记录缺失、不可读、来源不可用、政策未确认和事实冲突"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M010",
      "name": "同期重复在岗或换岗先后顺序；资助中心／各用工单位",
      "purpose": "原研究材料槽 M010：同期重复在岗或换岗先后顺序；资助中心／各用工单位；在岗名单、实际聘用批准记录与有效期；P1–P4/P7；条件必（有单岗要求或已在岗声明时）；校方台账引用代学生自证；F035、F044、F052；SRC-005、013；按主体与岗位、时间窗核对；同名不同人不得合并；SU/CF",
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
      "requiredElements": [
        "同期重复在岗或换岗先后顺序；资助中心／各用工单位",
        "核对主体、适用阶段、来源与版本",
        "分别记录缺失、不可读、来源不可用、政策未确认和事实冲突"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M011",
      "name": "岗位专项技能或作品能力线索；学生及相关认证者",
      "purpose": "原研究材料槽 M011：岗位专项技能或作品能力线索；学生及相关认证者；作品样例、资格证明、相关工作经历核验；P1–P3；条件必（岗位公告写明）；受理方认可的面试演示或可查证认证可代，不能从 AI 简历评分代替；F027、F036；SRC-006、008、013、014；标作品作者、时间、岗位；缺 NM、不可读 UR，能力取舍 HD",
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
      "requiredElements": [
        "岗位专项技能或作品能力线索；学生及相关认证者",
        "核对主体、适用阶段、来源与版本",
        "分别记录缺失、不可读、来源不可用、政策未确认和事实冲突"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M012",
      "name": "有权辅导员／导师同意（若要求）；指导教师／院系",
      "purpose": "原研究材料槽 M012：有权辅导员／导师同意（若要求）；指导教师／院系；当期公示申请表意见栏或独立签注；P1–P3；条件必，仅明确要求岗位；可信校方批准记录等价可代，未取得原表不能预设必须盖几章；F030、F057–F058（只用于该意见签发者）；SRC-014、015；指导关系及签注日期需核；无签注 NM、身份或权限不明 HD、图片不可读 UR",
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
      "requiredElements": [
        "有权辅导员／导师同意（若要求）；指导教师／院系",
        "核对主体、适用阶段、来源与版本",
        "分别记录缺失、不可读、来源不可用、政策未确认和事实冲突"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M013",
      "name": "确认何时由谁受理何版材料；学生提交渠道、用工单位",
      "purpose": "原研究材料槽 M013：确认何时由谁受理何版材料；学生提交渠道、用工单位；收件登记／学校可信提交回执／邮件签收（区别单纯发件截图）；P1–P2；后：提交后出现；不能要求首次提交前提供回执；如纸件现场签收登记可代；F024、F026、F037、F054；SRC-005、006、008、014；对照渠道及收件人、版本；无系统回执不代表未报名，须人工问询；不可读 UR",
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
      "requiredElements": [
        "确认何时由谁受理何版材料；学生提交渠道、用工单位",
        "核对主体、适用阶段、来源与版本",
        "分别记录缺失、不可读、来源不可用、政策未确认和事实冲突"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M014",
      "name": "面试经过与岗位适配评价；岗位老师／用工单位",
      "purpose": "原研究材料槽 M014：面试经过与岗位适配评价；岗位老师／用工单位；面试记录／评分／有权结果登记；P3；后：不能要求报名即交；正式部门面试台账可代个人口述；F038、F027–F029、F036；SRC-005、006、013；关联面试日期、岗位和评委；未面试 NA，已面试无记录 SU/HD，UR",
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
      "requiredElements": [
        "面试经过与岗位适配评价；岗位老师／用工单位",
        "核对主体、适用阶段、来源与版本",
        "分别记录缺失、不可读、来源不可用、政策未确认和事实冲突"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M015",
      "name": "候选排序或拟录用而非正式批准；用工单位",
      "purpose": "原研究材料槽 M015：候选排序或拟录用而非正式批准；用工单位；拟录用名单、岗位推荐记录；P3；后；有权部门盖章/可信电子流程记录可代；微信口头通知不能作终审；F039、F017、F023；SRC-005、007、013；每行绑定主体、批次、岗位；缺记录 SU，名单同名冲突 CF",
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
      "requiredElements": [
        "候选排序或拟录用而非正式批准；用工单位",
        "核对主体、适用阶段、来源与版本",
        "分别记录缺失、不可读、来源不可用、政策未确认和事实冲突"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M016",
      "name": "学院或被授权审核组审核意见；学院资助工作组",
      "purpose": "原研究材料槽 M016：学院或被授权审核组审核意见；学院资助工作组；审核决定/会议记录/签批；P4；后／条件必（该岗位有此环节时）；校方已验证电子审核链可代扫描签字；F040、F057–F058；SRC-005、007、013、015；核真实身份与当时权限；无授权 HD，原件 UR",
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
      "requiredElements": [
        "学院或被授权审核组审核意见；学院资助工作组",
        "核对主体、适用阶段、来源与版本",
        "分别记录缺失、不可读、来源不可用、政策未确认和事实冲突"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M017",
      "name": "公示名单、期间、异议受理事实；发布单位",
      "purpose": "原研究材料槽 M017：公示名单、期间、异议受理事实；发布单位；官方公示公告／有权公示归档；P4；后／条件必；校方留存的正式公告归档可代；学生截图仅作定位线索；F041–F042；SRC-005、006、013、015；精确公开范围和起止时间；无对应阶段 NA，当前公示失联 SU",
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
      "requiredElements": [
        "公示名单、期间、异议受理事实；发布单位",
        "核对主体、适用阶段、来源与版本",
        "分别记录缺失、不可读、来源不可用、政策未确认和事实冲突"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M018",
      "name": "最终有效岗位审批或明确驳回；校级中心或有权机关",
      "purpose": "原研究材料槽 M018：最终有效岗位审批或明确驳回；校级中心或有权机关；正式岗位录用批准记录／签批及权限链；P4；后；可信有权业务系统原始决定可代纸章；拟录用名单、公示不能替代；F043、F057–F058、F044；SRC-005、007、015；签发角色与授权时间必须可核；无正式决定 HD/SU，冒充审批 CF",
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
      "requiredElements": [
        "最终有效岗位审批或明确驳回；校级中心或有权机关",
        "核对主体、适用阶段、来源与版本",
        "分别记录缺失、不可读、来源不可用、政策未确认和事实冲突"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M019",
      "name": "已获准到岗、起止期和工作安排；用工单位",
      "purpose": "原研究材料槽 M019：已获准到岗、起止期和工作安排；用工单位；实际聘用/上岗通知、岗位协议、有效安排；P5；后；获认可的正式用工记录可代，历史招聘公告聘期不可证明某人已入岗；F044、F017、F035；SRC-005、015；学生+岗位+起止；未入岗 NA，既有批准但安排不明 HD",
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
      "requiredElements": [
        "已获准到岗、起止期和工作安排；用工单位",
        "核对主体、适用阶段、来源与版本",
        "分别记录缺失、不可读、来源不可用、政策未确认和事实冲突"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M020",
      "name": "某月实际工作时长；用工单位／指导老师",
      "purpose": "原研究材料槽 M020：某月实际工作时长；用工单位／指导老师；考勤签到、班次、工作量明细；P5–P6；后；可信考勤系统记录可代纸质签到；不可拿计划课表代实际工时；F045–F046；SRC-003、005、007；一人一岗位一月份，正反签核；缺 SU/HD，不可读 UR",
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
      "requiredElements": [
        "某月实际工作时长；用工单位／指导老师",
        "核对主体、适用阶段、来源与版本",
        "分别记录缺失、不可读、来源不可用、政策未确认和事实冲突"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M021",
      "name": "某月是否考核合格及责任人；用工单位",
      "purpose": "原研究材料槽 M021：某月是否考核合格及责任人；用工单位；月度考核记录／有权主管意见；P5–P6；后；正式考核系统记录可代，AI 事实评语不替代；F047、F045；SRC-003、007、015；关联考核期和主管，缺 SU/HD，签名不清 UR",
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
      "requiredElements": [
        "某月是否考核合格及责任人；用工单位",
        "核对主体、适用阶段、来源与版本",
        "分别记录缺失、不可读、来源不可用、政策未确认和事实冲突"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M022",
      "name": "核定应付酬金及已报送财务；资助／财务／用工单位",
      "purpose": "原研究材料槽 M022：核定应付酬金及已报送财务；资助／财务／用工单位；审核后的报酬清单、工资报送记录及核定依据；P6；后；财务可信报送记录可代，不从招聘公告直接计算实际应付；F048–F049、F045–F047；SRC-003、007、009、015；按月与岗位、预算版本；缺 SU，金额争议 CF/HD，UR",
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
      "requiredElements": [
        "核定应付酬金及已报送财务；资助／财务／用工单位",
        "核对主体、适用阶段、来源与版本",
        "分别记录缺失、不可读、来源不可用、政策未确认和事实冲突"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M023",
      "name": "实际划拨与（若可得）到账，不得混为一谈；财务／依法可提供到账凭证者",
      "purpose": "原研究材料槽 M023：实际划拨与（若可得）到账，不得混为一谈；财务／依法可提供到账凭证者；财务支付流水、账户对账回执或本人可验证到账信息；P6；后；支付与到账须分别证实，无权共享完整银行卡记录时只留受控校验结果；F050、F048–F049；SRC-003、005、007；私密财务来源，主体与月份核对；无记录 SU，不能推“已到帐”，UR",
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
      "requiredElements": [
        "实际划拨与（若可得）到账，不得混为一谈；财务／依法可提供到账凭证者",
        "核对主体、适用阶段、来源与版本",
        "分别记录缺失、不可读、来源不可用、政策未确认和事实冲突"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M024",
      "name": "本人撤回申请或退出的真实意愿；学生／受理方",
      "purpose": "原研究材料槽 M024：本人撤回申请或退出的真实意愿；学生／受理方；身份可验证的撤回、退出请求及收件记录；P1–P7；条件必，仅本人请求时；经受理方认可的签名纸件／可信在线请求可代；F051、F010、F054；SRC-005、015；仅证明“已提出”，非“已批准”；缺 NM/HD，未请求 NA，UR",
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
      "requiredElements": [
        "本人撤回申请或退出的真实意愿；学生／受理方",
        "核对主体、适用阶段、来源与版本",
        "分别记录缺失、不可读、来源不可用、政策未确认和事实冲突"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M025",
      "name": "换岗、替补、续聘或已批离岗实际决定与交接；用工方／有权批准人",
      "purpose": "原研究材料槽 M025：换岗、替补、续聘或已批离岗实际决定与交接；用工方／有权批准人；正式调配/终止/交接记录；P5–P7；后／条件必，发生岗位变动才出现；有权业务台账可代个人写的交接说明；F052、F044、F035、F057–F058；SRC-005、015；原岗/新岗分别绑定，交接前后版本；审批不明 HD，不可读 UR",
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
      "requiredElements": [
        "换岗、替补、续聘或已批离岗实际决定与交接；用工方／有权批准人",
        "核对主体、适用阶段、来源与版本",
        "分别记录缺失、不可读、来源不可用、政策未确认和事实冲突"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M026",
      "name": "具体争议、异议受理和复核结果；申请人／有权受理及决定方",
      "purpose": "原研究材料槽 M026：具体争议、异议受理和复核结果；申请人／有权受理及决定方；异议请求、补充证据、受理通知、正式复核结论（分事件）；P2–P7；条件必，仅争议已提出时；可信受理系统记录或获准签署书面件可代；复核结论不要求异议初次提出时已有；F042、F053、F057–F058；SRC-005、013（仅公示依据，正式程序未知）；保留原决定及新决定版本，缺受理证明 SU/HD，渠道期限 PU",
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
      "requiredElements": [
        "具体争议、异议受理和复核结果；申请人／有权受理及决定方",
        "核对主体、适用阶段、来源与版本",
        "分别记录缺失、不可读、来源不可用、政策未确认和事实冲突"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M027",
      "name": "修改或补件后的证据版本与前后关系；申请人／受理方",
      "purpose": "原研究材料槽 M027：修改或补件后的证据版本与前后关系；申请人／受理方；补件、改正说明、新表单版本、撤销旧件链接；P2+；条件必，仅发生修改时；经受理方记录的源系统更新可代再次上传；F037、F054–F056、F026；SRC-005、006（实际补件制度待核）；新件不可覆盖旧件，列影响的 F/M；缺关联 HD，不可读 UR",
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
      "requiredElements": [
        "修改或补件后的证据版本与前后关系；申请人／受理方",
        "核对主体、适用阶段、来源与版本",
        "分别记录缺失、不可读、来源不可用、政策未确认和事实冲突"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M028",
      "name": "代提交代理权限与被代理人真实意愿；学生本人／授权机构",
      "purpose": "原研究材料槽 M028：代提交代理权限与被代理人真实意愿；学生本人／授权机构；可验证授权、代理身份与范围、撤销状态；P1+；条件必，仅实际代办时；经身份服务受控代理授权记录可代纸质授权；未经授权不能视为本人申报；F010、F011、F001、F055；SRC-001（授权程序待校方明确）；绑定主体、代理、岗位、时段；无授权 HD，材料 UR，非代办 NA",
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
      "requiredElements": [
        "代提交代理权限与被代理人真实意愿；学生本人／授权机构",
        "核对主体、适用阶段、来源与版本",
        "分别记录缺失、不可读、来源不可用、政策未确认和事实冲突"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M029",
      "name": "证明岗位是否涉不适合学生承担的危险劳动、实际安全教育是否进行；设岗单位、学校有权安全管理机构",
      "purpose": "原研究材料槽 M029：证明岗位是否涉不适合学生承担的危险劳动、实际安全教育是否进行；设岗单位、学校有权安全管理机构；岗位风险描述/评估、明确工作任务边界、岗前安全教育与培训记录（按发生阶段区分）；P0 岗位安全审查，P5 培训/派工记录；条件必：确有风险任务或上岗后学校有适用培训义务才要求相应材料；P1 不可要求尚未上岗才会形成的培训签字；可信岗位风险审批/培训系统记录可代纸件；F020/F036/F044/F059；R037；SRC-002、014；锁岗位、具体任务、学段、人员、培训时间与修订号；未公开校本风险流程 PU/HD、当期必需材料缺 NM、已交不可读 UR、源离线 SU；不把含糊岗位描述当已获安全授权",
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
      "requiredElements": [
        "证明岗位是否涉不适合学生承担的危险劳动、实际安全教育是否进行；设岗单位、学校有权安全管理机构",
        "核对主体、适用阶段、来源与版本",
        "分别记录缺失、不可读、来源不可用、政策未确认和事实冲突"
      ],
      "allowReuseAcrossSubjects": false
    }
  ],
  "sections": [
    {
      "id": "evidence-review",
      "name": "研究级事实核验与政策待确认",
      "description": "对应原件第 08 节逐条规则；SRC 为研究来源索引，不是案卷材料 SourceRef。",
      "order": 0,
      "required": true,
      "criteria": [
        {
          "id": "R001",
          "title": "核验：学生选择有校方原始公告的岗位批次，核发文主体、学年、校区、公告版本",
          "requirement": "【研究级核验标准；非校方正式规则】R001 R001 P0–P2；F012/F013/F014/F015/F016；M001；SRC-001/SRC-005/SRC-006/SRC-010/SRC-017 | T：学生选择有校方原始公告的岗位批次，核发文主体、学年、校区、公告版本；F：无实际选岗则 NA，要求学生明确意愿；U：2026 公告仅标题、正文不可取 | 同一批次原文可证 PF（仅“存在该公告”）；源离线 SU、是否仍适用不明 PU、假冒官网 CF；下一人：设岗单位/学生资助中心",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R002",
          "title": "核验：公告要求定位具体岗位，按发布岗位表确认名称、职责、人数与单位",
          "requirement": "【研究级核验标准；非校方正式规则】R002 R002 P0–P2；F016–F020/F023；M001/M002；SRC-005/SRC-006/SRC-013/SRC-014 | T：公告要求定位具体岗位，按发布岗位表确认名称、职责、人数与单位；F：不是岗位申请则 NA；U：岗位名称相同但没有对应批次键 | 对上官方岗位行 PF；岗位表缺/失联 SU、仅用学生自报岗位名不能核 PF、名额不作自动录用；下一人：PostOwner",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R003",
          "title": "核验：需据公告判断报名资格、方式和期限，逐条核是否覆盖办理当日、当人、当岗",
          "requirement": "【研究级核验标准；非校方正式规则】R003 R003 P0–P2；F014–F015/F020–F022；M001；SRC-001/SRC-002/SRC-005/SRC-006/SRC-010/SRC-017 | T：需据公告判断报名资格、方式和期限，逐条核是否覆盖办理当日、当人、当岗；F：纯历史档案核对则 NA；U：发布日期可见而现行正文/授权未得 | 同一期且有效条款可核“条款存在”PF；2025 条件冒作 2026→PU，过期后的补受理属于 HD，不凭旧日期自动驳回；下一人：岗位发布者/资助中心",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R004",
          "title": "核验：收到具体学生申请，以学籍主体键核学号和姓名，允许合法姓名变更链",
          "requirement": "【研究级核验标准；非校方正式规则】R004 R004 P1–P2；F001/F002/F003/F006；M003/M004/M005；SRC-005/SRC-006/SRC-013 | T：收到具体学生申请，以学籍主体键核学号和姓名，允许合法姓名变更链；F：尚无申请 NA；U：只有姓名截图或学籍源离线 | 主体一致 PF；权威学籍不可达 SU，学号/姓名不符 CF；下一人：校方学籍管理人，不能由 AI 猜两者为同人",
          "execution": "semantic",
          "targetScope": "subject"
        },
        {
          "id": "R005",
          "title": "核验：岗位对本/研有明确对象及独立表，核学段与表单是否同一路由",
          "requirement": "【研究级核验标准；非校方正式规则】R005 R005 P1–P2；F004/F012/F019–F020/F025；M001/M002/M003/M004；SRC-003/SRC-005/SRC-013 | T：岗位对本/研有明确对象及独立表，核学段与表单是否同一路由；F：未涉及该学段分支 NA；U：研究生“助管”与本科勤工助学名称混写 | 学段与本岗一致 PF；研究生三助转权威部门 HD/NA（本模板不做资格结论）；要求及表式不明 PU；下一人：设岗者、研究生三助主管部门",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R006",
          "title": "核验：当岗明示校区、年级或归属范围，核校方学籍值是否在公告范围",
          "requirement": "【研究级核验标准；非校方正式规则】R006 R006 P1–P2；F005/F007–F008/F015/F020；M001/M003；SRC-005/SRC-006/SRC-013 | T：当岗明示校区、年级或归属范围，核校方学籍值是否在公告范围；F：没有该限制则 NA；U：2026 或其他校区细则未核 | 范围事实一致 PF；明确不一致 CF，法律上的例外受理 HD；源断 SU、当期规则 PU；下一人：设岗单位/学籍方",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R007",
          "title": "核验：本人申报或真实代办，核意愿、申请归属和可验证代理范围",
          "requirement": "【研究级核验标准；非校方正式规则】R007 R007 P1–P2；F010–F011/F024/F055；M004/M005/M013/M028；SRC-005/SRC-006/SRC-001 | T：本人申报或真实代办，核意愿、申请归属和可验证代理范围；F：未提交时 NA；U：申请书被代填但授权来源未知 | 可证明真实意愿 PF；须提交而无本人意愿 NM，代理授权欠缺 HD，材料不可读 UR；下一人：申请人/受理单位，不以代理操作替代本人意愿",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R008",
          "title": "核验：该岗公告规定申请表、简历或其他载体，核真实材料与正式渠道",
          "requirement": "【研究级核验标准；非校方正式规则】R008 R008 P1–P2；F009/F017/F025/F027；M001/M004/M005；SRC-005/SRC-006/SRC-008/SRC-013/SRC-014/SRC-015 | T：该岗公告规定申请表、简历或其他载体，核真实材料与正式渠道；F：公告未要求某一载体则其材料 NA；U：只知历史附件但无现行附件 | 正确申请载体的提交事实 PF；当期明确要交却缺 NM，格式允许替代未明 PU/HD，文件读不清 UR；下一人：学生/岗位收件人",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R009",
          "title": "核验：已受理且有可信收件日期、适用批次截止，比较同一时区与有效公告",
          "requirement": "【研究级核验标准；非校方正式规则】R009 R009 P1–P2；F022/F024/F026；M001/M013；SRC-005/SRC-006/SRC-008/SRC-010 | T：已受理且有可信收件日期、适用批次截止，比较同一时区与有效公告；F：材料尚未递交则 NA；U：旧通知日期或收件时间无签收 | 能核提交时间事实 PF；无收件证明请受理方查登记 SU/HD，当前截止未核 PU，是否接受逾期 HD；下一人：受理岗位单位",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R010",
          "title": "核验：岗位发布具体技能/作品条件，核自述及证明是否同一申请人且在可接受时间",
          "requirement": "【研究级核验标准；非校方正式规则】R010 R010 P1–P3；F020/F027/F036；M002/M005/M011；SRC-006/SRC-008/SRC-013/SRC-014 | T：岗位发布具体技能/作品条件，核自述及证明是否同一申请人且在可接受时间；F：无特技门槛→NA；U：门槛/原件要求未核 | 仅证据归属与存在可 PF；明确应交而无作品 NM、不可读 UR、真实性冲突 CF；实际胜任性、排序 HD；下一人：岗位面试负责人",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R011",
          "title": "核验：当岗要求可工作时段，比较同学期有效课表与申请班次的时间交集",
          "requirement": "【研究级核验标准；非校方正式规则】R011 R011 P1–P3；F028–F029/F020；M001/M006/M007；SRC-006/SRC-008/SRC-013/SRC-014 | T：当岗要求可工作时段，比较同学期有效课表与申请班次的时间交集；F：岗位未要求表明时段→NA；U：课程改表或官方课表不可取 | “时段未冲突”事实 PF；有重叠 CF，改版课表须重审 R011；课表系统失联 SU、学业是否允许兼顾 HD；下一人：学生/教务/设岗方",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R012",
          "title": "核验：公告载困难要求，按具体岗位分“硬门槛/优先/未载明”",
          "requirement": "【研究级核验标准；非校方正式规则】R012 R012 P1–P2；F014/F020–F021；M001；SRC-005/SRC-006/SRC-013/SRC-014/SRC-010 | T：公告载困难要求，按具体岗位分“硬门槛/优先/未载明”；F：未载则困难材料本阶段 NA；U：公告相互冲突或当前正文未得 | 对该历史岗位的用语提取可 PF；不自动把地科院“必须”套保卫部“优先”，跨岗套用 PU；解释冲突 HD；下一人：岗位发布者/资助中心",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R013",
          "title": "核验：当岗确有困难硬门槛或申请人主张优先，读取 S03-T06 有权认定的对象、学年、状态",
          "requirement": "【研究级核验标准；非校方正式规则】R013 R013 P1–P4；F021/F031–F032；M001/M008；SRC-005/SRC-006/SRC-011 | T：当岗确有困难硬门槛或申请人主张优先，读取 S03-T06 有权认定的对象、学年、状态；F：无困难条件及主张→NA；U：结果旧年或权威源不可查 | 认定存在且覆盖岗位期的事实 PF；权限失联 SU，身份不符 CF，规则适用不明 PU；“优先”由人工择优 HD；下一人：困难认定权威部门/设岗单位",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R014",
          "title": "核验：当岗明确要求辅导员/导师意见，核签注来源、指导关系与当前权限",
          "requirement": "【研究级核验标准；非校方正式规则】R014 R014 P1–P3；F020/F030/F057–F058；M001/M012；SRC-014/SRC-015/SRC-001 | T：当岗明确要求辅导员/导师意见，核签注来源、指导关系与当前权限；F：未要求→NA；U：仅有签字图片无法核签发人 | 真实意见事实 PF，不等于正式录用；应提交但缺 NM，签章不明 HD/CF，2024 部门要求不能推广 2026→PU；下一人：辅导员/导师/岗位方",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R015",
          "title": "核验：当岗有兼岗限制或申请人声明仍有岗，按 F001+生效区间核另一有权聘用",
          "requirement": "【研究级核验标准；非校方正式规则】R015 R015 P1–P4；F020/F035/F044；M001/M010/M019；SRC-005/SRC-013 | T：当岗有兼岗限制或申请人声明仍有岗，按 F001+生效区间核另一有权聘用；F：当岗无该条件→NA；U：另一岗位状态不明 | “同区间确有/无另一岗”可核 PF；两个有效聘用冲突 CF，允许转岗/例外与禁止程度 HD/PU；源失联 SU；下一人：资助中心/原用工方",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R016",
          "title": "核验：该岗位公告明示处分及影响期要求，最小化核处分是否生效并覆盖考察节点",
          "requirement": "【研究级核验标准；非校方正式规则】R016 R016 P2–P3；F020/F033；M001/M009；SRC-005/SRC-013 | T：该岗位公告明示处分及影响期要求，最小化核处分是否生效并覆盖考察节点；F：未载明→NA；U：处分效力或当前政策尚不能确认 | 仅处分记录时效事实 PF；学生自报与权威源冲突 CF，源失联 SU，处分是否排除该岗的裁量 HD/PU；下一人：校纪主管和设岗方",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R017",
          "title": "核验：当岗明示学业与课余时间要求，只核教务可提供的最小事实",
          "requirement": "【研究级核验标准；非校方正式规则】R017 R017 P2–P3；F020/F028/F034；M001/M006/M009；SRC-005/SRC-013/SRC-014 | T：当岗明示学业与课余时间要求，只核教务可提供的最小事实；F：无相应条件→NA；U：成绩细目和门槛无现行依据 | 有效学业事实 PF；不自行制定挂科/绩点/每周最高时长阈值；来源不可达 SU、是否适岗 HD、旧数值 PU；下一人：教务与用工方",
          "execution": "semantic",
          "targetScope": "subject"
        },
        {
          "id": "R018",
          "title": "核验：当期岗位明确面试携申请表原件或当场核意见，核纸件与登记版相符",
          "requirement": "【研究级核验标准；非校方正式规则】R018 R018 P3；F025/F030/F038；M001/M004/M012/M014；SRC-013/SRC-014/SRC-015 | T：当期岗位明确面试携申请表原件或当场核意见，核纸件与登记版相符；F：没到面试或未要求原件→NA；U：扫描件与纸件法律替代未明 | 原件已由有权面试者核验的记录 PF；明示必需但到面试时无原件 NM，扫描不可读 UR，允许电子替代不明 HD；下一人：岗位面试者",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R019",
          "title": "核验：已实际面试，核有权面试事件、评委/本人/岗位/日期",
          "requirement": "【研究级核验标准；非校方正式规则】R019 R019 P3；F017/F038/F055–F056；M014；SRC-005/SRC-006/SRC-013 | T：已实际面试，核有权面试事件、评委/本人/岗位/日期；F：未面试→NA；U：仅本人转述结果 | 存在真实面试记录 PF；受理方记录失联 SU，评价材料不可读 UR；适岗评分及录用选择 HD；下一人：面试岗位负责人",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R020",
          "title": "核验：单位形成拟录用名单，核名单行绑定本学年本人及岗位",
          "requirement": "【研究级核验标准；非校方正式规则】R020 R020 P3；F023/F039；M002/M015；SRC-005/SRC-007/SRC-013 | T：单位形成拟录用名单，核名单行绑定本学年本人及岗位；F：未进入拟录用→NA；U：只看到同名或群内截图 | “拟录用名单有该人”可核 PF；同名疑似串案 CF，名单真实性 HD/SU；绝不把候选当终审；下一人：设岗单位",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R021",
          "title": "核验：当前岗位依法有学院审核环节，核是否存在该环节的签批记录和受权主体",
          "requirement": "【研究级核验标准；非校方正式规则】R021 R021 P4；F040/F057–F058；M015/M016；SRC-005/SRC-007/SRC-013/SRC-001 | T：当前岗位依法有学院审核环节，核是否存在该环节的签批记录和受权主体；F：确认无该环节→NA；U：学院决定与中心审批权限冲突 | 可证“学院审核已作记录”PF；不能确认权限 HD/PU，签发记录缺失 SU；下一人：学院/资助中心，不由本规则生成批准",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R022",
          "title": "核验：当岗进入公示或已提出公示异议，核公示出处、公告期和真实受理事件",
          "requirement": "【研究级核验标准；非校方正式规则】R022 R022 P4；F041–F042；M017/M026；SRC-005/SRC-006/SRC-013/SRC-015 | T：当岗进入公示或已提出公示异议，核公示出处、公告期和真实受理事件；F：尚未进入→NA；U：有异议但受理责任方不明 | “公示/异议已发生”事实 PF；主体或名单冲突 CF、存异议需有权处置 HD、期限不明 PU；下一人：公示发布/异议受理单位",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R023",
          "title": "核验：确有最终岗位决定，核签批链、签发者在该时点权限、单位及版本",
          "requirement": "【研究级核验标准；非校方正式规则】R023 R023 P4；F043/F057–F058；M016–M018；SRC-001/SRC-004/SRC-005/SRC-013 | T：确有最终岗位决定，核签批链、签发者在该时点权限、单位及版本；F：正式决定尚未形成→NA（不得用其他事实升格）；U：授权链无法取得 | 仅对可信原始决定存在性及真伪可 PF，正式“录用/不录用”的效力由有权机关确认；来源失联 SU、身份授权不明 HD、不同公告链 PU；下一人：资助中心或合法被授权者",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R024",
          "title": "核验：岗位决定已经产生且真实发出上岗/聘用安排，比较授权岗位、本人、起止期",
          "requirement": "【研究级核验标准；非校方正式规则】R024 R024 P5；F043–F044/F052；M018/M019/M025；SRC-005/SRC-015 | T：岗位决定已经产生且真实发出上岗/聘用安排，比较授权岗位、本人、起止期；F：尚无批准且未上岗→NA；U：仅有面试或拟录用截图 | 有权上岗通知真实存在 PF；错误岗位 CF，未得通知 SU，变更是否生效 HD；下一人：用工单位/有权批准者",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R025",
          "title": "核验：真实到岗后逐月考勤，按受控签到与工作日、考勤月份比较实际时数",
          "requirement": "【研究级核验标准；非校方正式规则】R025 R025 P5–P6；F044–F046；M019/M020；SRC-003/SRC-005 | T：真实到岗后逐月考勤，按受控签到与工作日、考勤月份比较实际时数；F：仅申请尚未上岗→NA；U：月台账尚未结算或系统失联 | 可核某月实际记录工时 PF，不据申请中预计时长替代；原始记录失联 SU，时间矛盾 CF；下一人：用工单位考勤员",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R026",
          "title": "核验：真实月考核已进入办理，核考核者身份与记录归属",
          "requirement": "【研究级核验标准；非校方正式规则】R026 R026 P5–P6；F045/F047；M020/M021；SRC-003/SRC-005/SRC-007 | T：真实月考核已进入办理，核考核者身份与记录归属；F：未到考核月→NA；U：只有学生自评 | “考核记录已签发”事实 PF；材料缺、签发者不明 SU/HD，模型不能给分/决定合格；下一人：有权考核部门",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R027",
          "title": "核验：有真实考核并要核应付金额，要求同期有效计酬标准及有权核定单，比较主体、岗位、月份",
          "requirement": "【研究级核验标准；非校方正式规则】R027 R027 P6；F045–F048；M020–M022；SRC-001/SRC-002（第二十五至二十八条）/SRC-003/SRC-005/SRC-009 | T：有真实考核并要核应付金额，要求同期有效计酬标准及有权核定单，比较主体、岗位、月份；F：尚未进入结算→NA；U：只有 2025 历史工资数 | 已核“应付核定单载某金额”可 PF；全国规范只确立计酬类别及原则，当前校本费率和算法缺失 PU、考勤冲突 CF、金额合法性 HD；不得硬写历史 400/600 元；下一人：资助/用工财务",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R028",
          "title": "核验：存在当月报酬报送事件，核受理方签收、报告批次和计酬月份",
          "requirement": "【研究级核验标准；非校方正式规则】R028 R028 P6；F045/F048–F049；M022；SRC-003/SRC-005/SRC-007 | T：存在当月报酬报送事件，核受理方签收、报告批次和计酬月份；F：未报送→NA；U：发件截图无签收 | 真实“已报送”事实 PF；官方签收不可查 SU、账表冲突 CF；不是实际支付；下一人：资助中心/财务受理人",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R029",
          "title": "核验：申请核实际划款或到账，核财务原始支付状态、对象、月份和可用的合法到账回执",
          "requirement": "【研究级核验标准；非校方正式规则】R029 R029 P6；F045/F050；M022/M023；SRC-003/SRC-005/SRC-009 | T：申请核实际划款或到账，核财务原始支付状态、对象、月份和可用的合法到账回执；F：未发起核对→NA；U：只有工资清单或银行卡栏 | 只能对已核“支付/到账记录”各自记 PF；正式支付记录失联 SU、错付疑点 CF，到账证明未知不能反推未付；下一人：财务/本人受控核对，绝不代付款",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R030",
          "title": "核验：收到可识别本人撤回/离岗请求，核本人或合法代理、请求时间与原案",
          "requirement": "【研究级核验标准；非校方正式规则】R030 R030 P1–P7；F010/F051/F054；M024/M028；SRC-001/SRC-005/SRC-015 | T：收到可识别本人撤回/离岗请求，核本人或合法代理、请求时间与原案；F：无此事件→NA；U：申请后是否允许撤回、有效节点和应由谁受理不明 | “收到撤回请求”事实 PF；授权不明 HD，渠道与撤回生效效力 PU；不自动撤销原聘用；下一人：原受理方/有权决定者",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R031",
          "title": "核验：出现调岗、补位、续聘或离岗申请，比较旧岗/新岗授权、生效和交接",
          "requirement": "【研究级核验标准；非校方正式规则】R031 R031 P5–P7；F035/F044/F052/F057–F058；M010/M019/M025；SRC-001/SRC-005/SRC-015 | T：出现调岗、补位、续聘或离岗申请，比较旧岗/新岗授权、生效和交接；F：未发生→NA；U：只有个人说“已辞职” | 有权调配记录存在 PF；原岗仍有有效聘用而新岗冲突 CF，未取得授权 SU/HD，续聘条件 PU；下一人：原/新用工单位及有权审批者",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R032",
          "title": "核验：实际提出异议、复核或对名单/决定申辩，核原决定、受理事件、主管权限",
          "requirement": "【研究级核验标准；非校方正式规则】R032 R032 P2–P7；F042/F053/F057–F058；M017/M018/M026；SRC-001/SRC-005/SRC-013 | T：实际提出异议、复核或对名单/决定申辩，核原决定、受理事件、主管权限；F：无异议→NA；U：正式复核期限、渠道尚无校本原件 | 请求已被受理的事实可 PF；是否准许受理 PU/HD、缺可信复核决定 SU、不能 AI 撤改终局；下一人：公告/原决定有权机构及复核机关",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R033",
          "title": "核验：发生补件、订正或校方源版本变更，核哈希和来源版本，按 F→R 依赖图重审",
          "requirement": "【研究级核验标准；非校方正式规则】R033 R033 P2–P7；F026/F037/F054–F056；M013/M027 及被替换 M；SRC-005/SRC-006/SRC-012 | T：发生补件、订正或校方源版本变更，核哈希和来源版本，按 F→R 依赖图重审；F：材料无变化→NA；U：旧版/新版所有者与关系不明 | 新版真实到件 PF，仅所影响的 R 旧 PF 标为 STALE 过程属性并重跑，不把 STALE 当九种结果码；归属不明 CF/HD，读取失败 UR；下一人：受理方和对应字段权威源",
          "execution": "semantic",
          "targetScope": "subject"
        },
        {
          "id": "R034",
          "title": "核验：同一事实有多份证据，按主体、批次、岗位、月份、源层级与生效时间交叉核对",
          "requirement": "【研究级核验标准；非校方正式规则】R034 R034 P0–P7；F001/F012/F017/F055–F056；M001–M029（仅实际存在者）；SRC-001/SRC-005/SRC-006/SRC-011/SRC-012 | T：同一事实有多份证据，按主体、批次、岗位、月份、源层级与生效时间交叉核对；F：仅有唯一合法来源且无争议则 NA；U：官方源断开或无法辨真伪 | 真实一致性事实 PF；矛盾 CF、无法读 UR、权威源不可用 SU、规范冲突 PU；保留冲突来源及双方版本，下一人：各签发机关/事实权威人",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R035",
          "title": "核验：关键词出现“研究生助管”“助学助管员”等近似名称，核对象是校内在读生三助、本科勤工助学，还是面向应届毕业生的人事招用",
          "requirement": "【研究级核验标准；非校方正式规则】R035 R035 P0–P2；F004/F012/F016/F018–F020；M001–M003；SRC-003/SRC-005/SRC-013/SRC-016 | T：关键词出现“研究生助管”“助学助管员”等近似名称，核对象是校内在读生三助、本科勤工助学，还是面向应届毕业生的人事招用；F：目标确是本科勤工助学则 NA；U：仅岗位名、无招聘原文 | 确认属于其他授权目的→本模板路由 NOT_APPLICABLE、生成转办建议；原文来源不明 PU/HD，不用 S03-T09 自动否决另一事项；下一人：学生资助/研究生部门或人事处",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R036",
          "title": "（计划）/P5–P6（实际）；F015/F019/F020/F028–F029/F035/F044–F046；M001/M002/M006/M007/M010/M019/M020；SRC-002 第二",
          "requirement": "【研究级核验标准；非校方正式规则】R036 R036 P0–P3（计划）/P5–P6（实际）；F015/F019/F020/F028–F029/F035/F044–F046；M001/M002/M006/M007/M010/M019/M020；SRC-002 第二十一至二十二条、SRC-005 | T：岗位或学生工作时间计划已明确，或月考勤已形成，先区分正常学期/寒暑假，按同一人在所有同类有效岗位及相同周/月窗口合计计划/实际小时，对照上位办法“原则每周≤8、每月≤40”；F：尚无排班/未入岗则实际工时分支 NA；U：缺假期调整依据、校本特殊安排或跨部门考勤 | 时数计算与有权材料一致且在一般原则范围内可 PF（仅时数事实）；超过一般原则时输出 CF/HD 并交有权学校组织核具体情形，不以 AI 直接宣布违法或拒录；校本例外/假期规则不明 PU，考勤源失联 SU；下一角色：岗位部门、学校资助管理机构。同条 20 小时用于学校总体设岗测算，绝非个人最低工时",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R037",
          "title": "（拟议工作职责）/P5（实际工作变化）；F017/F019–F020/F036/F044/F059；M001/M002/M011/M019/M029；SRC-002 第十八、二十条、SRC-014",
          "requirement": "【研究级核验标准；非校方正式规则】R037 R037 P0–P3（拟议工作职责）/P5（实际工作变化）；F017/F019–F020/F036/F044/F059；M001/M002/M011/M019/M029；SRC-002 第十八、二十条、SRC-014 | T：岗位说明/实际派工涉及实验室、高处、化学品、机械等可能影响健康的作业，核职责原文、岗位风险评估、必要培训/安全教育和有权单位准入记录；F：公告与授权岗位无相关风险工作时该专项检查 NA；U：笼统写“其他任务”、涉及危险作业但未取得岗位风险评价与任务边界 | 已证岗位职责/培训记录的存在与一致性可 PF，不等于允许学生承担高风险工作；说明或风险控制不明 PU/HD，原件不可读 UR，公告与实际派工冲突 CF；确认有毒有害、超身体承受能力或有碍身心健康的工作不得自动予以安排，立即交学校岗位主管/安全管理有权机关人工停止或变更风险任务并核实；下一角色：设岗单位、相关安全/实验室负责人、学校学生资助管理机构",
          "execution": "manual",
          "targetScope": "case"
        }
      ]
    }
  ],
  "policyVersionIds": [],
  "stages": [
    {
      "id": "local-p0",
      "name": "P0 岗位设立、公告和批次生效",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "local-p1",
      "workflowOwner": "local"
    },
    {
      "id": "local-p1",
      "name": "P1 学生自愿报名",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "local-p2",
      "workflowOwner": "local"
    },
    {
      "id": "local-p2",
      "name": "P2 受理和事实核验／补件",
      "kind": "supplement-wait",
      "executorRole": "reviewer",
      "nextStageId": "local-p3",
      "returnToStageId": "local-p1",
      "workflowOwner": "local"
    },
    {
      "id": "local-p3",
      "name": "P3 面试、推荐及拟录用",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "local-p4",
      "workflowOwner": "local"
    },
    {
      "id": "local-p4",
      "name": "P4 学院核审、公示、中心审批",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "local-p5",
      "workflowOwner": "local"
    },
    {
      "id": "local-p5",
      "name": "P5 上岗、日常管理／考核",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "local-p6",
      "workflowOwner": "local"
    },
    {
      "id": "local-p6",
      "name": "P6 酬金核算、报送与实际支付",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "local-p7",
      "workflowOwner": "local"
    },
    {
      "id": "local-p7",
      "name": "P7 退出、撤回、替换、异议复核（本地人工复核；不代表校方正式决定）",
      "kind": "manual-review",
      "executorRole": "teacher",
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
      "id": "supplement-suggestions",
      "kind": "supplement-list",
      "audience": "reviewer"
    },
    {
      "id": "human-review-summary",
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

export const r02Metadata = {
  "templateId": "S03-T09",
  "name": "勤工助学岗位申请资格审核",
  "sourceDocumentPath": "docs/design/review-agent/business-templates/R02/S03-T09.md",
  "sourceDocumentSha256": "ab857770cd37d79c922a16a4d2a3cdedd13aca60e85d71f1f03b2f15323028a4",
  "officialSchoolTemplate": false,
  "researchAsOf": "2026-10-23",
  "policyEvidenceStatus": "PARTIAL",
  "sources": [
    {
      "id": "SRC-001",
      "status": "CURRENTITY-UNKNOWN"
    },
    {
      "id": "SRC-002",
      "status": "GENERAL-RESEARCH"
    },
    {
      "id": "SRC-003",
      "status": "CURRENTITY-UNKNOWN"
    },
    {
      "id": "SRC-004",
      "status": "CURRENTITY-UNKNOWN"
    },
    {
      "id": "SRC-005",
      "status": "CDUT-VERIFIED"
    },
    {
      "id": "SRC-006",
      "status": "CDUT-VERIFIED"
    },
    {
      "id": "SRC-007",
      "status": "CURRENTITY-UNKNOWN"
    },
    {
      "id": "SRC-008",
      "status": "CURRENTITY-UNKNOWN"
    },
    {
      "id": "SRC-009",
      "status": "CURRENTITY-UNKNOWN"
    },
    {
      "id": "SRC-010",
      "status": "CURRENTITY-UNKNOWN"
    },
    {
      "id": "SRC-011",
      "status": "CURRENTITY-UNKNOWN"
    },
    {
      "id": "SRC-012",
      "status": "GENERAL-RESEARCH"
    },
    {
      "id": "SRC-013",
      "status": "CDUT-VERIFIED"
    },
    {
      "id": "SRC-014",
      "status": "CDUT-VERIFIED"
    },
    {
      "id": "SRC-015",
      "status": "CURRENTITY-UNKNOWN"
    },
    {
      "id": "SRC-016",
      "status": "CURRENTITY-UNKNOWN"
    },
    {
      "id": "SRC-017",
      "status": "CURRENTITY-UNKNOWN"
    },
    {
      "id": "SRC-018",
      "status": "UNCONFIRMED"
    }
  ],
  "criteria": [
    {
      "sectionId": "evidence-review",
      "criterionId": "R001",
      "srcIds": [
        "SRC-001",
        "SRC-005",
        "SRC-006",
        "SRC-010",
        "SRC-017"
      ],
      "fieldIds": [
        "F012",
        "F013",
        "F014",
        "F015",
        "F016"
      ],
      "materialSlotIds": [
        "M001"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R002",
      "srcIds": [
        "SRC-005",
        "SRC-006",
        "SRC-013",
        "SRC-014"
      ],
      "fieldIds": [
        "F016",
        "F017",
        "F018",
        "F019",
        "F020",
        "F023"
      ],
      "materialSlotIds": [
        "M001",
        "M002"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R003",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-005",
        "SRC-006",
        "SRC-010",
        "SRC-017"
      ],
      "fieldIds": [
        "F014",
        "F015",
        "F020",
        "F021",
        "F022"
      ],
      "materialSlotIds": [
        "M001"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R004",
      "srcIds": [
        "SRC-005",
        "SRC-006",
        "SRC-013"
      ],
      "fieldIds": [
        "F001",
        "F002",
        "F003",
        "F006"
      ],
      "materialSlotIds": [
        "M003",
        "M004",
        "M005"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R005",
      "srcIds": [
        "SRC-003",
        "SRC-005",
        "SRC-013"
      ],
      "fieldIds": [
        "F004",
        "F012",
        "F019",
        "F020",
        "F025"
      ],
      "materialSlotIds": [
        "M001",
        "M002",
        "M003",
        "M004"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R006",
      "srcIds": [
        "SRC-005",
        "SRC-006",
        "SRC-013"
      ],
      "fieldIds": [
        "F005",
        "F007",
        "F008",
        "F015",
        "F020"
      ],
      "materialSlotIds": [
        "M001",
        "M003"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R007",
      "srcIds": [
        "SRC-001",
        "SRC-005",
        "SRC-006"
      ],
      "fieldIds": [
        "F010",
        "F011",
        "F024",
        "F055"
      ],
      "materialSlotIds": [
        "M004",
        "M005",
        "M013",
        "M028"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R008",
      "srcIds": [
        "SRC-005",
        "SRC-006",
        "SRC-008",
        "SRC-013",
        "SRC-014",
        "SRC-015"
      ],
      "fieldIds": [
        "F009",
        "F017",
        "F025",
        "F027"
      ],
      "materialSlotIds": [
        "M001",
        "M004",
        "M005"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R009",
      "srcIds": [
        "SRC-005",
        "SRC-006",
        "SRC-008",
        "SRC-010"
      ],
      "fieldIds": [
        "F022",
        "F024",
        "F026"
      ],
      "materialSlotIds": [
        "M001",
        "M013"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R010",
      "srcIds": [
        "SRC-006",
        "SRC-008",
        "SRC-013",
        "SRC-014"
      ],
      "fieldIds": [
        "F020",
        "F027",
        "F036"
      ],
      "materialSlotIds": [
        "M002",
        "M005",
        "M011"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R011",
      "srcIds": [
        "SRC-006",
        "SRC-008",
        "SRC-013",
        "SRC-014"
      ],
      "fieldIds": [
        "F020",
        "F028",
        "F029"
      ],
      "materialSlotIds": [
        "M001",
        "M006",
        "M007"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R012",
      "srcIds": [
        "SRC-005",
        "SRC-006",
        "SRC-010",
        "SRC-013",
        "SRC-014"
      ],
      "fieldIds": [
        "F014",
        "F020",
        "F021"
      ],
      "materialSlotIds": [
        "M001"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R013",
      "srcIds": [
        "SRC-005",
        "SRC-006",
        "SRC-011"
      ],
      "fieldIds": [
        "F021",
        "F031",
        "F032"
      ],
      "materialSlotIds": [
        "M001",
        "M008"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R014",
      "srcIds": [
        "SRC-001",
        "SRC-014",
        "SRC-015"
      ],
      "fieldIds": [
        "F020",
        "F030",
        "F057",
        "F058"
      ],
      "materialSlotIds": [
        "M001",
        "M012"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R015",
      "srcIds": [
        "SRC-005",
        "SRC-013"
      ],
      "fieldIds": [
        "F001",
        "F020",
        "F035",
        "F044"
      ],
      "materialSlotIds": [
        "M001",
        "M010",
        "M019"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R016",
      "srcIds": [
        "SRC-005",
        "SRC-013"
      ],
      "fieldIds": [
        "F020",
        "F033"
      ],
      "materialSlotIds": [
        "M001",
        "M009"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R017",
      "srcIds": [
        "SRC-005",
        "SRC-013",
        "SRC-014"
      ],
      "fieldIds": [
        "F020",
        "F028",
        "F034"
      ],
      "materialSlotIds": [
        "M001",
        "M006",
        "M009"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R018",
      "srcIds": [
        "SRC-013",
        "SRC-014",
        "SRC-015"
      ],
      "fieldIds": [
        "F025",
        "F030",
        "F038"
      ],
      "materialSlotIds": [
        "M001",
        "M004",
        "M012",
        "M014"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R019",
      "srcIds": [
        "SRC-005",
        "SRC-006",
        "SRC-013"
      ],
      "fieldIds": [
        "F017",
        "F038",
        "F055",
        "F056"
      ],
      "materialSlotIds": [
        "M014"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R020",
      "srcIds": [
        "SRC-005",
        "SRC-007",
        "SRC-013"
      ],
      "fieldIds": [
        "F023",
        "F039"
      ],
      "materialSlotIds": [
        "M002",
        "M015"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R021",
      "srcIds": [
        "SRC-001",
        "SRC-005",
        "SRC-007",
        "SRC-013"
      ],
      "fieldIds": [
        "F040",
        "F057",
        "F058"
      ],
      "materialSlotIds": [
        "M015",
        "M016"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R022",
      "srcIds": [
        "SRC-005",
        "SRC-006",
        "SRC-013",
        "SRC-015"
      ],
      "fieldIds": [
        "F041",
        "F042"
      ],
      "materialSlotIds": [
        "M017",
        "M026"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R023",
      "srcIds": [
        "SRC-001",
        "SRC-004",
        "SRC-005",
        "SRC-013"
      ],
      "fieldIds": [
        "F043",
        "F057",
        "F058"
      ],
      "materialSlotIds": [
        "M016",
        "M017",
        "M018"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R024",
      "srcIds": [
        "SRC-005",
        "SRC-015"
      ],
      "fieldIds": [
        "F043",
        "F044",
        "F052"
      ],
      "materialSlotIds": [
        "M018",
        "M019",
        "M025"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R025",
      "srcIds": [
        "SRC-003",
        "SRC-005"
      ],
      "fieldIds": [
        "F044",
        "F045",
        "F046"
      ],
      "materialSlotIds": [
        "M019",
        "M020"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R026",
      "srcIds": [
        "SRC-003",
        "SRC-005",
        "SRC-007"
      ],
      "fieldIds": [
        "F045",
        "F047"
      ],
      "materialSlotIds": [
        "M020",
        "M021"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R027",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-003",
        "SRC-005",
        "SRC-009"
      ],
      "fieldIds": [
        "F045",
        "F046",
        "F047",
        "F048"
      ],
      "materialSlotIds": [
        "M020",
        "M021",
        "M022"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R028",
      "srcIds": [
        "SRC-003",
        "SRC-005",
        "SRC-007"
      ],
      "fieldIds": [
        "F045",
        "F048",
        "F049"
      ],
      "materialSlotIds": [
        "M022"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R029",
      "srcIds": [
        "SRC-003",
        "SRC-005",
        "SRC-009"
      ],
      "fieldIds": [
        "F045",
        "F050"
      ],
      "materialSlotIds": [
        "M022",
        "M023"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R030",
      "srcIds": [
        "SRC-001",
        "SRC-005",
        "SRC-015"
      ],
      "fieldIds": [
        "F010",
        "F051",
        "F054"
      ],
      "materialSlotIds": [
        "M024",
        "M028"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R031",
      "srcIds": [
        "SRC-001",
        "SRC-005",
        "SRC-015"
      ],
      "fieldIds": [
        "F035",
        "F044",
        "F052",
        "F057",
        "F058"
      ],
      "materialSlotIds": [
        "M010",
        "M019",
        "M025"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R032",
      "srcIds": [
        "SRC-001",
        "SRC-005",
        "SRC-013"
      ],
      "fieldIds": [
        "F042",
        "F053",
        "F057",
        "F058"
      ],
      "materialSlotIds": [
        "M017",
        "M018",
        "M026"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R033",
      "srcIds": [
        "SRC-005",
        "SRC-006",
        "SRC-012"
      ],
      "fieldIds": [
        "F026",
        "F037",
        "F054",
        "F055",
        "F056"
      ],
      "materialSlotIds": [
        "M013",
        "M027"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R034",
      "srcIds": [
        "SRC-001",
        "SRC-005",
        "SRC-006",
        "SRC-011",
        "SRC-012"
      ],
      "fieldIds": [
        "F001",
        "F012",
        "F017",
        "F055",
        "F056"
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
        "M026",
        "M027",
        "M028",
        "M029"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R035",
      "srcIds": [
        "SRC-003",
        "SRC-005",
        "SRC-013",
        "SRC-016"
      ],
      "fieldIds": [
        "F004",
        "F012",
        "F016",
        "F018",
        "F019",
        "F020"
      ],
      "materialSlotIds": [
        "M001",
        "M002",
        "M003"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R036",
      "srcIds": [
        "SRC-002",
        "SRC-005"
      ],
      "fieldIds": [
        "F015",
        "F019",
        "F020",
        "F028",
        "F029",
        "F035",
        "F044",
        "F045",
        "F046"
      ],
      "materialSlotIds": [
        "M001",
        "M002",
        "M006",
        "M007",
        "M010",
        "M019",
        "M020"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R037",
      "srcIds": [
        "SRC-002",
        "SRC-014"
      ],
      "fieldIds": [
        "F017",
        "F019",
        "F020",
        "F036",
        "F044",
        "F059"
      ],
      "materialSlotIds": [
        "M001",
        "M002",
        "M011",
        "M019",
        "M029"
      ],
      "evidenceStatus": "PARTIAL"
    }
  ]
} as const

/** R02 质量集成统一读取口；保留原批次具名导出兼容性。 */
export const templateVersion = template
