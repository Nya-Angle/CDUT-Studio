/**
 * coach-tour-steps — 新用户操作指引的步骤定义（端到端沉浸式演示）
 *
 * 每步给出按优先级排列的 CSS 选择器，引擎取第一个「可见且非零尺寸」的元素作为锚点；
 * 全部找不到时气泡居中降级，不阻断流程。
 *
 * prepare：进入步骤后自动执行的业务动作（建会话 / 登录 / 建课堂 / 开实验室 / 打开资产等），
 *          并可指定 readySelector，等目标 UI 真正挂载后再允许等待或交互。
 * advanceOn：manual 手动下一步；click-anchor 用户点击高亮区；wait 等待业务状态。
 * waitFor：仅 advanceOn='wait' 时生效，支持 Agent 回合、特区登录、桌宠回合、CSLab 验密、选择器。
 * passthrough：为 true 时不铺整屏点击捕获层，允许用户聚焦输入框 / 输入密码 / 点击发送。
 * disallowSkip：禁止跳过当前步骤（强制要求完成锚点操作）。
 * interactive3D：放行 3D 视口内部的鼠标旋转、平移与缩放手势。
 */

import type { ActiveView } from '@/atoms/active-view'
import type { CdutSubViewId } from '@profer/shared'
import type { CoachTourPlacement } from './coach-tour-position'

/** 演示特区账户（仅供新手引导气泡内的「一键填入」使用，不写入任何真实业务逻辑） */
export const DEMO_CDUT_ACCOUNT = {
  username: '202520260101',
  password: 'Nya315',
} as const

/** 演示提问：常规 Agent 的图示讲解（精炼聚焦，确保20-30秒内迅速输出） */
export const PROMPT_CALCULUS = '给我讲解下微积分，并用一两张图帮我理解下'

/** 演示提问：AI 速课堂精读问答（严格控制在40秒以内快速收敛） */
export const PROMPT_HONGLOU_Q1 =
  '用100字简述《红楼梦》前五回在大局中的核心伏笔作用。'

/** 演示指令：砚小龙自主浏览百度并进入成都理工大学官网 */
export const PROMPT_YANHU = '访问百度搜索成都理工大学官网并进入'

/** 演示课堂名称（主进程按标题幂等复用） */
export const DEMO_AI_CLASS_NAME = '演示课堂 · 红楼梦精读'

/** 演示资料 ASCII 文件名 */
export const DEMO_NOVEL_FILE_NAME = 'hongloumeng-quan-shu.txt'

/** 演示实验室中的石榴石晶胞文件名 */
export const DEMO_GARNET_FILE_NAME =
  '1792573114138-6ac8d0-石榴石_Y_Al_O____YAG____Ia-3d_完整立方晶胞.cif'

/** 首次启用 CDUT Science 时由引导自动设置的演示密码 */
export const DEMO_CSLAB_PASSWORD = '123456'

export type CoachTourTrigger =
  | 'ensure-draft-session'
  | 'fill-calculus'
  | 'login-demo'
  | 'ensure-demo-ai-class'
  | 'fill-honglou-q1'
  | 'switch-tab-mindmap'
  | 'switch-tab-flashcard'
  | 'switch-tab-quiz'
  | 'prepare-pet-demo'
  | 'apply-demo-cslab-password'
  | 'open-demo-lab'
  | 'open-table-1'
  | 'open-table-2'
  | 'open-geo-dem'
  | 'open-digitizer-figure'
  | 'open-mol-gold'
  | 'open-mol-srtio3'
  | 'open-mol-garnet'
  | 'open-publication-plot'
  | 'open-science-agent-window'
  | 'open-academic-search'

export type CoachTourWait =
  | { kind: 'agent-idle'; timeoutMs?: number }
  | { kind: 'cdut-active'; timeoutMs?: number }
  | { kind: 'pet-idle'; timeoutMs?: number }
  | { kind: 'cslab-verified'; timeoutMs?: number }
  | { kind: 'selector'; selector: string; timeoutMs?: number }

export interface CoachTourPrepare {
  triggers?: CoachTourTrigger[]
  /** 触发完成后仍需等待该选择器出现，才认为「本步可交互」 */
  readySelector?: string
  /** 准备阶段超时，默认 60s */
  timeoutMs?: number
}

/** 气泡内的专属快捷操作 */
export type CoachTourAction = 'demo-digitize'

export interface CoachTourStep {
  key: string
  title: string
  body: string
  /** 依次尝试的 CSS 选择器；第一个可见元素作为高亮目标 */
  selectors: string[]
  /** 提供时取代 selectors：对所有命中元素取外接矩形作为锚点 */
  unionSelectors?: string[]
  /** 额外渲染呼吸光圈的锚点（如发送按钮），不参与气泡定位 */
  pulseSelectors?: string[]
  /** 气泡相对目标的偏好方位；空间不足时自动回退其他方位，auto 优先下方 */
  placement: CoachTourPlacement
  /** 进入该步前切换的主内容区视图；缺省不切 */
  view?: ActiveView
  /** 进入该步前切换的 CDUT 专区子页面；null 表示退出子页面 */
  cdutSubView?: CdutSubViewId
  /** 进入步骤后自动执行的准备动作 */
  prepare?: CoachTourPrepare
  /** manual：点气泡按钮；click-anchor：点高亮区；wait：等业务状态 */
  advanceOn?: 'manual' | 'click-anchor' | 'wait'
  waitFor?: CoachTourWait
  /** 准备完成后自动前进的停留时间（用于轮播观看） */
  autoAdvanceMs?: number
  /** click-anchor 命中后的沉降延时，默认 350ms */
  settleMs?: number
  /** 退出时是否恢复进入前视图，默认 true；收尾步骤设 false */
  restoreViewOnExit?: boolean
  /** 允许与真实 UI 交互（不铺整屏点击捕获层） */
  passthrough?: boolean
  /** 气泡内渲染的专属快捷操作 */
  action?: CoachTourAction
  /** 禁止跳过本步（强制用户完成关键动作） */
  disallowSkip?: boolean
  /** 放行 3D 视口内部的鼠标手势（旋转/平移/缩放） */
  interactive3D?: boolean
}

const SEND_BUTTON_PULSE = [
  '[data-input-mode="agent"] button[aria-label="发送消息（Enter）"]',
  '[data-tour="ai-class-chat"] button[aria-label="发送消息（Enter）"]',
]

export const COACH_TOUR_STEPS: CoachTourStep[] = [
  {
    key: 'welcome-agent',
    title: 'Agent 对话与任务',
    body: 'CDUT Studio 以 Pi Agent 为唯一内核：直接用自然语言描述目标，它会自动查资料、读文件、跑命令、上网。点一下侧栏高亮的【新建会话】开启全新任务。',
    selectors: ['[data-profer-navigation-item="new-session"]'],
    placement: 'right',
    view: 'conversations',
    advanceOn: 'click-anchor',
    disallowSkip: true,
  },
  {
    key: 'calculus',
    title: '让 Agent 用图示讲清楚',
    body: '我们先用一个有一定复杂度的问题热身。问题已填入输入框，请点击发送；发送后输入框将被蒙版锁定，模型回复生成结束后将解锁下一步。',
    selectors: ['[data-input-mode="agent"]'],
    pulseSelectors: SEND_BUTTON_PULSE,
    placement: 'top',
    view: 'conversations',
    prepare: {
      triggers: ['ensure-draft-session', 'fill-calculus'],
      readySelector: '[data-input-mode="agent"]',
    },
    advanceOn: 'manual',
    waitFor: { kind: 'agent-idle', timeoutMs: 240_000 },
  },
  {
    key: 'cdut-enter',
    title: '进入 CDUT 校园特区',
    body: '专为成理师生打造的特区：提供课表、成绩、空教室、考场等专属功能。点一下侧栏高亮的【CDUT 专区】进入。',
    selectors: [
      '[data-profer-navigation-region="mode-switcher-cdut"]',
      '[data-profer-navigation-region="mode-switcher-agent"]',
    ],
    placement: 'right',
    cdutSubView: null,
    advanceOn: 'click-anchor',
    disallowSkip: true,
  },
  {
    key: 'cdut-login',
    title: '校内专用通道',
    body: '成理师生的 4 大专用通道：今日课表、成绩与 GPA、自习空教室、期末考场。请依次点击体验全部 4 个按钮（注：自习空教室在演示模式下因无真实内网登录无法获取数据，实际登录后可正常检索）。体验完 4 个按钮后解锁下一步。',
    selectors: ['[data-tour="cdut-quickbar"]'],
    placement: 'left',
    view: 'cdut-zone',
    cdutSubView: null,
    prepare: {
      triggers: ['login-demo'],
      readySelector: '[data-tour="cdut-quickbar"]',
    },
    advanceOn: 'manual',
  },
  {
    key: 'ai-class-enter',
    title: 'AI 速课堂 · 红楼梦精读',
    body: '演示课堂已就绪，并已挂载《红楼梦》全书。右侧资料树出现《红楼梦》条目后继续，接下来检验专属导师对话与三大 AI 学习工件。',
    selectors: ['[data-tour="ai-class-chat"]'],
    placement: 'left',
    view: 'cdut-zone',
    cdutSubView: 'ai-class',
    prepare: {
      triggers: ['ensure-demo-ai-class'],
      readySelector:
        '[data-tour="ai-class-documents"] [data-document-name="hongloumeng-quan-shu.txt"]',
      timeoutMs: 120_000,
    },
  },
  {
    key: 'ai-class-q1',
    title: '精读导师问答',
    body: '演示问题已自动填入，请点击发送。观察导师如何结合挂载的《红楼梦》原著快速精准提取核心脉络。回复完成后解锁下一步。',
    selectors: ['[data-tour="ai-class-chat"]'],
    pulseSelectors: SEND_BUTTON_PULSE,
    placement: 'left',
    view: 'cdut-zone',
    cdutSubView: 'ai-class',
    prepare: {
      triggers: ['fill-honglou-q1'],
      readySelector: '[data-tour="ai-class-chat"] [data-input-mode="agent"]',
    },
    advanceOn: 'manual',
    waitFor: { kind: 'agent-idle', timeoutMs: 180_000 },
  },
  {
    key: 'ai-class-mindmap',
    title: 'AI 生成思维导图',
    body: '右侧已为你切换至「思维导图」工件：由模型自动提炼《红楼梦》前五回核心架构与神话人物脉络，支持节点缩放、折叠与一键导出 OPML。',
    selectors: ['[data-tour="ai-class-mindmap-view"]', '[data-tour="ai-class-chat"]'],
    placement: 'left',
    view: 'cdut-zone',
    cdutSubView: 'ai-class',
    prepare: { triggers: ['switch-tab-mindmap'] },
  },
  {
    key: 'ai-class-flashcard',
    title: 'FSRS-7 记忆抽认卡',
    body: '右侧已切换至「抽认卡」工件：遵循最小信息原则（MIP）提取的原子命题卡片，内置先进的 FSRS-7 艾宾浩斯复习调度算法。点击卡片可翻转查看考点答案。',
    selectors: ['[data-tour="ai-class-flashcard-view"]', '[data-tour="ai-class-chat"]'],
    placement: 'left',
    view: 'cdut-zone',
    cdutSubView: 'ai-class',
    prepare: { triggers: ['switch-tab-flashcard'] },
  },
  {
    key: 'ai-class-quiz',
    title: '一阶逻辑互斥自测试卷',
    body: '右侧已切换至「自测练习」工件：注入一阶逻辑互斥约束生成的红楼梦精选题，杜绝干扰项幻觉重叠，支持即时选择作答、判分与解析反馈。',
    selectors: ['[data-tour="ai-class-quiz-view"]', '[data-tour="ai-class-chat"]'],
    placement: 'left',
    view: 'cdut-zone',
    cdutSubView: 'ai-class',
    prepare: { triggers: ['switch-tab-quiz'] },
  },
  {
    key: 'yanhu',
    title: '智联万站 · 砚小龙',
    body: '右侧为 CDUT Studio 内置浏览器，中央浮动的是桌面伙伴「砚小龙」：演示指令已自动填入输入框，请点击砚小龙卡片里的【发送】按钮。它将自主驱动浏览器访问百度并进入成理官网（支持中途随时点击「跳过本步」进入下一模块）。',
    selectors: ['[data-tour="yanhu-express-stage"]'],
    placement: 'left',
    view: 'cdut-zone',
    cdutSubView: 'yanhu-express',
    prepare: {
      triggers: ['prepare-pet-demo'],
      readySelector: '[data-tour="yanhu-express-stage"]',
      timeoutMs: 30_000,
    },
    advanceOn: 'manual',
    waitFor: { kind: 'pet-idle', timeoutMs: 180_000 },
  },
  {
    key: 'material-review',
    title: '材料审核专区',
    body: '三栏联动的工作台：左栏是审核依据与规则大纲，中栏是待审材料，右栏是 AI 研判出的问题卡。点击问题卡会同时高亮三栏对应位置，跨文件矛盾两处同色标注。',
    selectors: [
      '[data-profer-navigation-region="content-review"]',
      '[data-tour="cdut-module-material-review"]',
    ],
    placement: 'bottom',
    view: 'cdut-zone',
    cdutSubView: 'material-review',
  },
  {
    key: 'science-enter',
    title: 'CDUT Science 科研工作台',
    body: '接下来进入科研智能工作台。首次使用需要先为本机设置访问密码；已设置过的设备将自动解锁。',
    selectors: [
      '[data-tour="cslab-auth-gate"]',
      '[data-tour="cslab-workspace"]',
      '[data-tour="cslab-demo-lab"]',
    ],
    placement: 'top',
    view: 'cdut-science',
    prepare: { readySelector: '[data-tour="cslab-auth-gate"], [data-tour="cslab-workspace"]' },
  },
  {
    key: 'science-gate',
    title: '解锁本机门禁',
    body: '密码仅保存在本机，由操作系统安全存储或本地 AES-256-GCM 加密。引导会自动填入演示密码 123456；门禁验证通过后解锁下一步。',
    selectors: ['[data-tour="cslab-auth-gate"]', '[data-tour="cslab-workspace"]'],
    placement: 'top',
    view: 'cdut-science',
    prepare: {
      triggers: ['apply-demo-cslab-password'],
      readySelector:
        '[data-tour="cslab-auth-gate"], [data-tour="cslab-workspace"], [data-tour="cslab-demo-lab"]',
    },
    advanceOn: 'wait',
    waitFor: { kind: 'cslab-verified', timeoutMs: 180_000 },
  },
  {
    key: 'demo-lab',
    title: '演示实验室 · 生物、化学主题',
    body: '正在创建并打开旗舰演示实验室：公开 PDB 结构、钙钛矿/金红石晶体、2.5D 地貌、Origin 级图版、双栏演示论文与双链笔记，首次进入会自动解析入库。',
    selectors: ['[data-tour="cslab-workspace"]'],
    placement: 'bottom',
    view: 'cdut-science',
    prepare: {
      triggers: ['open-demo-lab'],
      readySelector: '[data-tour="cslab-workspace"]',
      timeoutMs: 120_000,
    },
  },
  {
    key: 'table-1',
    title: '第 1 张数据表',
    body: '左侧「数据铁笼」里是实验仪器产出的结构化数据。这里自动打开第一张 Parquet 数据表，可查看曲线谱图与数据表格联动。查看完毕后请点击「下一步」。',
    selectors: ['[data-tour="cslab-dataset"]'],
    placement: 'bottom',
    view: 'cdut-science',
    prepare: { triggers: ['open-table-1'], readySelector: '[data-tour="cslab-dataset"]' },
  },
  {
    key: 'table-2',
    title: '第 2 张数据表',
    body: '继续打开第二张表，验证同一实验室内的多表切换与派生关系。查看完毕后请点击「下一步」。',
    selectors: ['[data-tour="cslab-dataset-table"]'],
    placement: 'bottom',
    view: 'cdut-science',
    prepare: { triggers: ['open-table-2'], readySelector: '[data-tour="cslab-dataset-table"]' },
  },
  {
    key: 'geo-dem',
    title: '地理灾害 · biogeo_basin_dem.asc',
    body: '已为你打开成理特色地貌栅格（biogeo_basin_dem.asc）：展示基于 ESRI ASCII Grid 的流域数字高程模型（DEM）与山体阴影，支持地貌分析与滑坡泥石流隐患流向模拟。查看完毕后请点击「下一步」。',
    selectors: ['[data-tour="cslab-workspace"]'],
    placement: 'bottom',
    view: 'cdut-science',
    prepare: { triggers: ['open-geo-dem'], readySelector: '[data-tour="cslab-workspace"]' },
  },
  {
    key: 'digitize-open',
    title: '科研图表 · 逆向数字化',
    body: '这是一张高对比度标准校准曲线。点击高亮的「逆向数字化」，把像素曲线还原成可计算的数据。',
    selectors: ['[data-tour="cslab-figure-digitize"]'],
    placement: 'bottom',
    view: 'cdut-science',
    prepare: {
      triggers: ['open-digitizer-figure'],
      readySelector: '[data-tour="cslab-figure-digitize"]',
    },
    advanceOn: 'click-anchor',
  },
  {
    key: 'digitize-extract',
    title: '一键标定并提取',
    body: '点击气泡里的「一键演示标定」，系统将自动标定坐标轴并过滤网格噪点，提取出标准物理校准曲线。提取完成后自动继续。',
    selectors: ['[data-tour="cslab-digitizer"]'],
    placement: 'left',
    view: 'cdut-science',
    action: 'demo-digitize',
    advanceOn: 'wait',
    waitFor: {
      kind: 'selector',
      selector: '[data-tour="cslab-digitizer"][data-series-count]:not([data-series-count="0"])',
      timeoutMs: 180_000,
    },
  },
  {
    key: 'digitize-save',
    title: '保存为图表与数据表',
    body: '点击「保存为图表与数据表」，系统会生成 PNG 图表与标准 Parquet 数据表并关闭抽屉，准备进入 3D 分子探索。',
    selectors: ['[data-tour="cslab-digitizer-save"]'],
    placement: 'left',
    view: 'cdut-science',
    advanceOn: 'click-anchor',
    settleMs: 1200,
  },
  {
    key: 'mol-gold',
    title: '亲自操作 3D 分子模型',
    body: '已呈现公开 PDB 结构 1BNA 的 B-DNA 双螺旋。你可以亲自用鼠标左键拖拽旋转、右键平移、滚轮缩放，探索大沟、小沟与碱基配对。体验完成后点击「下一步」继续。',
    selectors: ['[data-tour="cslab-3d-viewport"]'],
    placement: 'left',
    view: 'cdut-science',
    interactive3D: true,
    prepare: { triggers: ['open-mol-gold'], readySelector: '[data-tour="cslab-3d-viewport"]' },
  },
  {
    key: 'mol-srtio3',
    title: 'SrTiO₃ 钙钛矿晶胞',
    body: '切换至 SrTiO₃ 钙钛矿单胞，同样支持亲自用鼠标旋转缩放查看原子配位，可在左侧调整超胞、Miller 晶面与配位多面体。体验完成后点击「下一步」继续。',
    selectors: ['[data-tour="cslab-3d-viewport"]'],
    placement: 'left',
    view: 'cdut-science',
    interactive3D: true,
    prepare: { triggers: ['open-mol-srtio3'], readySelector: '[data-tour="cslab-3d-viewport"]' },
  },
  {
    key: 'mol-garnet',
    title: '金红石 TiO₂（2×2×3 超胞）',
    body: '第三件是金红石 TiO₂，默认预置 2×2×3 超胞与 (110) 晶面剖切。亲自交互旋转观察晶格切面后，点击「下一步」继续。',
    selectors: ['[data-tour="cslab-3d-viewport"]'],
    placement: 'left',
    view: 'cdut-science',
    interactive3D: true,
    prepare: { triggers: ['open-mol-garnet'], readySelector: '[data-tour="cslab-3d-viewport"]' },
  },
  {
    key: 'publication-plot',
    title: 'Science 双 Y 轴出版图版',
    body: '最后查看旗舰实验室预置的 Science 双 Y 轴图版：左轴合成实验 Cu Kα 衍射，右轴金红石理论 PXRD，支持期刊模板调节与高分辨率导出。体验完成后点击「下一步」继续。',
    selectors: ['[data-tour="cslab-origin-plot"]'],
    placement: 'left',
    view: 'cdut-science',
    prepare: {
      triggers: ['open-publication-plot'],
      readySelector: '[data-tour="cslab-origin-plot"]',
    },
  },
  {
    key: 'science-agent-window',
    title: '科学助理 · 桌面左半屏伴生',
    body: '已呼出科学助理独立伴生窗口：窗口默认严密占据全桌面的左半部分，与右侧工作区分屏协同。科学助理直接共享当前实验室的六维数据上下文。体验完成后点击「下一步」继续。',
    selectors: ['[data-tour="cslab-workspace"]'],
    placement: 'bottom',
    view: 'cdut-science',
    prepare: {
      triggers: ['open-science-agent-window'],
      readySelector: '[data-tour="cslab-workspace"]',
    },
  },
  {
    key: 'science-literature-search',
    title: '学术文献检索 · Attention Is All You Need',
    body: '已为你唤起跨源学术检索大弹窗，并自动检索 Google 经典开山之作《Attention Is All You Need》（Vaswani et al., 2017）。可在此速览摘要、查看多源索引并一键入库文献智脑。体验完成后点击「下一步」继续。',
    selectors: [
      '[data-tour="cslab-literature-search-modal"]',
      '[data-tour="cslab-workspace"]',
    ],
    placement: 'left',
    view: 'cdut-science',
    prepare: {
      triggers: ['open-academic-search'],
      readySelector:
        '[data-tour="cslab-literature-search-modal"], [data-tour="cslab-workspace"]',
    },
  },
  {
    key: 'new-session',
    title: '回到清爽的新会话',
    body: '演示到这里结束。点一下侧栏的「新建会话」，回到干净的 Agent 首页，开始你自己的第一个任务。',
    selectors: ['[data-profer-navigation-item="new-session"]'],
    placement: 'right',
    view: 'conversations',
    cdutSubView: null,
    advanceOn: 'click-anchor',
    disallowSkip: true,
    restoreViewOnExit: false,
  },
  {
    key: 'outro',
    title: '开始你的第一个任务',
    body: '这段引导随时可从顶栏指南针按钮或设置里重播。建议从「分析工作区里的一个文件并给出结论」开始，观察 Agent 如何自己规划和执行。',
    selectors: [],
    placement: 'auto',
    view: 'conversations',
    restoreViewOnExit: false,
  },
]

/** 引导内容版本：增删步骤/大改文案时 +1，老用户升级后自动重播一次新指引 */
export const CURRENT_COACH_TOUR_VERSION = 10
