# AGENTS.md

This file provides guidance to Codex, Antigravity, and other AI pair programmers when working with code in this repository.

**重要提示（不可违背的红线原则）：**
- 当功能发生变化时，请保持此文件和 `README.md` 同步更新。请更新文档以反映当前状态，但是需要经过我的允许后再修改。
- 所有的注释和日志优先采用中文，保留必要的专业术语部分。
- 所有的依赖包的安装都要先进行搜索，综合判断依赖采用的版本，而不是默认采用某个版本。
- 状态管理上我们全部采用 Jotai 来实现。
- 这是个开源项目，本地存储优先，善用配置文件优于大部分默认采用 localstorage，不采用本地数据库方案。
- 保证充分的组件化以及人类的可读性，每次完成改动后都要思考这一点，保持简单直接不过度设计的风格。
- 在 UI 设计上采用更现代的方案，UI 组件推荐采用 ShadcnUI，在合适的情况下，用卡片和阴影取代边框，用符合主题的饱满色彩，设置界面要设置背景，为未来做不同主题留下空间。
- 采用 BDD 行为驱动开发的方案。
- 完成前端与渲染进程逻辑改动后、提交或打包前，必须至少执行 `bun run typecheck`（或 `bun run --filter='@profer/electron' typecheck`），严禁在存在 TypeScript 编译错误/缺少 import 的情况下进行打包构建。

> 本文件与 `CLAUDE.md` 保持同一套项目约束；平台相关命令必须按当前宿主系统和运行时检测结果执行。

---

## 1. 项目概述与技术栈

CDUT Studio 是一个集成通用 AI Agent 的下一代桌面人工智能软件，采用 Electron 桌面应用架构。核心运行时由 **Pi Coding Agent (`@earendil-works/pi-*`) 作为唯一内核驱动**。

> **项目命名**：CDUT Studio（代码内部兼容包名前缀 `@profer/*`）。

### 核心技术栈

| 层级 | 技术选型 | 说明 |
|------|----------|------|
| **运行时** | Bun 1.2.5+ (推荐 1.4.2+) | 统一使用 Bun 代替 Node.js/pnpm 执行脚本与测试 |
| **语言** | TypeScript 5.0.0+ | 严格模式，`"moduleResolution": "bundler"` |
| **桌面框架** | Electron 43.2.0 | 主进程/Preload 由 esbuild 构建，渲染进程由 Vite 构建 |
| **前端框架** | React 18.3.1 | 现代化函数式组件 + Hooks |
| **状态管理** | Jotai 2.17.1 | 全局与局部状态原子化管理 |
| **核心内核** | Pi Agent (`@earendil-works/pi-*`) | **唯一内核**，驱动代码编写、工具调用与任务执行 |
| **UI 体系** | Tailwind CSS + Radix UI + TipTap | 现代卡片阴影设计，支持深浅主题无缝切换 |
| **分发打包** | Electron Builder 25.1.8 | 支持 Windows NSIS/Unpacked、macOS DMG 分发 |

---

## 2. Monorepo 结构与常用命令

基于 Bun workspace 的 Monorepo 结构（6 个核心包 + Electron 应用 + CLI）：

```
CDUT-Studio/
├── packages/
│   ├── shared/        # 共享类型、IPC 常量、配置与权限规则 (@profer/shared)
│   ├── agent-fabric/  # Agent 编排契约与纯函数行为 (@profer/agent-fabric)
│   ├── project-core/  # 项目级图构建、状态重放与查询 (@profer/project-core)
│   ├── session-core/  # headless session 读取/分组/搜索/渲染 (@profer/session-core)
│   ├── core/          # AI Provider 适配器、代码高亮、PDF 解析引擎 (@profer/core)
│   └── ui/            # 共享 UI 组件库 (@profer/ui)
└── apps/
    ├── electron/      # Electron 桌面应用主体 (@profer/electron)
    │   └── src/
    │       ├── main/       # 主进程 + 服务层 (main/lib/)
    │       ├── preload/    # IPC 上下文桥接
    │       └── renderer/   # React UI (Vite + Tailwind + Radix UI)
    └── cli/           # 独立命令行脚手架 (@profer/cli，bin: profer)
```

**依赖管理**：内部包使用 `workspace:*` 互相引用。优先使用 Bun 原生 API（`Bun.file` > `node:fs`）。

### 常用开发命令

```bash
# 开发模式（推荐 - Vite HMR；Electron 只启动一次）
bun run dev

# 构建全量产物
bun run electron:build

# 类型检查（全仓库 6 包 + Electron + CLI，提交或打包前必跑）
bun run typecheck
cd apps/electron && bun run typecheck

# 单元测试
bun test

# 图标成品守卫（校验 resources/icon.png 为 1024x1024 正方形、icon.ico 为合法多图 ICO；
# 纯字节解析、零额外依赖，不需要 rsvg-convert，任意平台可运行）
cd apps/electron && bun test scripts/packaging-guards.test.ts

# 架构边界检查
bun run check:boundaries

# 依赖同步与 Pi 运行时校验（须在 apps/electron/ 下执行；verify 脚本仅 Windows）
cd apps/electron
bun run sync:runtime-deps
bun run verify:packaged-pi-runtime

# 打包分发（Windows x64 请在 Windows 主机执行）
bun run dist:fast     # 当前架构快速打包 (win-unpacked)
bun run dist:win      # Windows x64 正式安装包
bun run dist:mac      # macOS 产物打包
```

### 调试与排查技巧
当打包产物卡在加载页或出现白屏时，在终端运行带 `--enable-logging` 查看渲染和主进程输出：
```powershell
cmd.exe /c ".\apps\electron\out\win-unpacked\CDUT Studio.exe --enable-logging"
```

---

## 3. 核心架构与设计模式

### 3.1 IPC 通信模式（核心架构模式）

类型定义 → 主进程处理 → Preload 桥接 → 渲染进程调用：
1. **类型与常量**：`@profer/shared` 集中定义 IPC 通道常量及强类型请求/响应；
2. **主进程处理**：`main/ipc.ts` 集中注册 `ipcMain.handle()`，统一调度 `main/lib/` 服务；
3. **Preload 桥接**：`preload/index.ts` 通过 `contextBridge.exposeInMainWorld` 暴露安全 API（`window.electronAPI.*`）；
4. **渲染进程**：通过 Jotai Atoms 或专用 Hooks 封装通信调用，不在 UI 组件内散落原生通信。

主要通道组：`AGENT_IPC_CHANNELS`、`CHANNEL_IPC_CHANNELS`、`REVIEW_IPC_CHANNELS`、`FEISHU_IPC_CHANNELS`、`ENVIRONMENT_IPC_CHANNELS`、`PROXY_IPC_CHANNELS`、`CDUT_ZONE_IPC_CHANNELS`。

---

### 3.2 Pi Agent 运行与执行环境（关键约束）

- **内核驱动**：以 `@earendil-works/pi-coding-agent` 为唯一执行内核，内部协议通过适配器与界面事件解耦。
- **Windows 零配置开箱即用**：
  - Windows 执行环境实行**静默自动降级策略**：`Git Bash（若已装） > 内置 BusyBox Bash > WSL > 原生 PowerShell`。
  - 用户无感知、界面无切换开关，确保全新纯净 Win10/Win11 机器无需预装 Git 或配置 WSL 即可直接运行。
  - **内置 MinGit 零配置检查点**：针对无 Git 的 Windows 设备，系统优先探测本机 Git，缺失时无缝切换至应用内置的精简版 MinGit（`resources/bin/git/cmd/git.exe`），保证增量检查点毫秒级快照开箱即用。
- **沙箱隔离与全能力同构（防特权缺失与串扰）**：
  - **无工作区模式沙箱隔离**：未指定工作区时，统一使用默认工作区提供会话隔离沙箱（`~/.cdutai/agent-workspaces/default/{sessionId}`），**严禁将用户宿主个人主目录（`homedir`）或盘符根目录作为 Agent 工作空间**。
  - **独立会话能力 100% 同构**：无工作区会话在编排时自动绑定有效沙箱工作区引用（`effectiveWorkspaceId = workspaceId ?? workspace?.id`），**严禁因未指定工程工作区而关闭子智能体委派（`collaboration`）、任务图（`task-graph`）与记忆库能力**。
- **快照拒止与主进程防冻结（防卡死红线）**：
  - **快照拒止与熔断机制**：`pi-file-checkpoint.ts` 对敏感目录（主目录与盘符根目录）绝对拒止执行快照；物理复制降级引擎强制执行 `MAX_SNAPSHOT_FILE_COUNT = 500` 文件硬熔断，严禁同步复制几十万文件阻塞 Electron 主线程事件循环。
  - **非阻塞式快照回收与会话删除**：
    - 快照垃圾回收（`gcShadowRepo`）必须在独立子进程后台静默异步执行并去重，**严禁在主事件循环同步调用 `git gc` 阻塞 UI**（测试环境保持同步以防临时目录占用）；
    - 会话删除（`deleteAgentSession`）实行“索引瞬时摘除 + 物理磁盘后台异步离线清理”，保证 UI 毫秒级反馈。
- **思考链 (Thinking) 流式体验**：
  - 支持思考的模型（如 DeepSeek/Claude）思考块必须正常渲染并支持折叠收纳；
  - 无工具调用时正文必须直接外置流式输出，**严禁将纯回复误收纳进折叠过程组**导致界面出现假死无限 Spinner。
- **权限安全体系**：`packages/shared/src/constants/permission-rules.ts` 定义只读/安全白名单与危险命令拦截。

---

### 3.3 主进程服务层 (`main/lib/`)

`main/lib/` 是体量很大的服务矩阵（400+ 文件）。核心编排与运行时：

| 服务模块 | 职责与设计要点 |
|----------|----------------|
| `agent-orchestrator.ts` | 核心编排层：并发守卫、渠道调度、环境装配、沙箱隔离、自动标题生成与流式推送 |
| `adapters/pi-*.ts` | Pi 内核适配器：绑定 Pi runtime，转换消息/工具/模型注册/MCP/Skills/提示链 |
| `pi-harness/` | Pi Harness 运行时治理：goal-controller、governor、reconciler、verification-evaluator、replay |
| `pi-file-checkpoint.ts` | 文件增量快照引擎：优先 Git 检查点，内置 MinGit 降级回退，物理复制带 500 文件安全熔断 |
| `agent-session-manager.ts` | 会话管理：消息持久化、元数据 CRUD、JSONL 存储、委派子会话 |
| `agent-collaboration-tools.ts` | 子智能体委派工具：`delegate_agent(s)` / `wait_for_delegations` / `get_delegation_results` 等 |
| `agent-prompt-builder.ts` | 系统提示词构建：动态上下文、内置 Agent、工作区上下文注入 |
| `channel-manager.ts` | 渠道管理：模型渠道 CRUD、API Key AES-256-GCM 本地加密存储与连通性测试 |
| `memory-service.ts` | 跨会话记忆存储、归档检索与 wikilink |
| `automation-manager.ts` / `automation-scheduler.ts` | 定时任务持久化调度、运行与通知 |
| `goal-*.ts` / `planning-manager.ts` | Goal 运行时与规划（Planning）管理 |
| `skill-master-manager.ts` / `skill-routing.ts` | 全局元 Skill、技能路由与策略投影 |
| `browser-controller.ts` / `browser-*.ts` | 内嵌浏览器控制、策略、截图与会话 |
| `feishu-bridge.ts` / `feishu/` | 飞书集成：消息同步、任务通知、卡片渲染、OAuth 认证 |
| `cdut/cdut-auth-manager.ts` | CDUT 专区「特区账户」认证：隐藏窗口 headless 统一身份认证（CAS）、办事大厅画像抓取（学院/专业/班级/头像）、10 分钟静默保活、OS 级加密凭据持久化 |
| `review/` | 内容审核专区服务矩阵：项目 Pi Agent 负责通用审核推理，案卷范围的材料能力库按需列出/检索/读取文档与表格、单页核验图像；受控工具校验引用、规则材料覆盖与人工确认边界，运行记录把能力调用和模型用量反馈到界面。批量审核当前分支状态、已实现范围与接手步骤见 [审核当前状态与开发者交接](docs/design/review-agent/17-current-state-and-handoff.md) |
| `runtime-init.ts` / `git-detector.ts` / `shell-env.ts` | 运行时初始化：Shell 环境注入、Bun/Git/Node 检测与自适应配置 |
| `config-paths.ts` | 配置路径管理：`~/.cdutai/` 目录结构与默认 Skills 播种 |
| `changelog-service.ts` / `github-release-service.ts` | 版本更新日志与 GitHub Release 展示（只读，不涉及自动更新） |

批量审核复验入口见 [24 号独立验收](docs/design/review-agent/24-batch-review-independent-final-acceptance.md)。队列失败提示须保留失败数量；无已完成案卷时待人工分流明确为零。Electron 回放的缺模型负例须核对持久化错误原因，不能仅检查 `failed` 状态。

直接审核的启动恢复先隔离旧 `queued/running` 轮次授权，再原子写入中断终态。恢复 I/O 失败时，磁盘状态仍须如实记录为未确认，旧工具、binding 与 admission 不得放行；恢复写盘成功也不代表完整 LIVE 验收完成。当前实机证据与门禁以 [29 号台账](docs/design/review-agent/29-background-session-preflight-audit.md) 为准。

Pi 查询必须携带既有 `canUseTool` 回调，普通 auto/plan/bypass 与直接审核的受控工具校验都在这个 Main 回调中执行。`permissionMode` 字段本身不能代替实际工具审批；需见证真实工具与权限请求。

直接审核 outcome 的终态失写必须在回调返回前隔离原 assignment 并清除原 ACK，不能等待 executor Promise 后续收尾才拒止。失败日志和磁盘 running/未撤销事实仍须保存；隔离不会伪造持久成功。

2026-10-15 同步：本仓库 main 将整合原项目 `c179f257` 与审核分支 `60e805cf` 的完整受控源码。通用 Office 解析使用上游新引擎，文件预览使用只读侧栏；审核材料引用继续保留弹窗入口和专用 DOCX/XLSX 结构提取。同步记录见 [48 号](docs/design/review-agent/48-upstream-cloud-main-integration-20261015.md)。P06 实机结论继续限定于原冻结版本，未签收门禁不因本次 main 同步而升级；后续工作按 [47 号](docs/design/review-agent/47-p06-evidence-driven-followup-plan-20261015.md) 执行。

上游整合基线与冲突处理见 [25 号整合记录](docs/design/review-agent/25-upstream-review-integration.md)，后续同步与真实 dev 记录见 [26 号复验](docs/design/review-agent/26-upstream-refresh-dev-acceptance.md)。PDF 走上游高精解析引擎，同时保留审核的 DOCX/Excel 结构与 HTML/EML 读取。Pi 自动压缩统一在任务结束、会话空闲后执行；审核会话保留约 70% 阈值、运行账本与审核压缩指令，普通会话按共享阈值处理。

2026-10-11 使用者已授权向上游提交当前阶段成果的 Draft PR，取代此前不提交 PR 的安排。模板与解析保留项见 [28 号交付状态](docs/design/review-agent/28-review-stage-delivery-status.md)。后台会话继续在测试仓库 Draft PR #21 的 `feat/review-owned-background-sessions` 开发，按 [27 号最小规范](docs/design/review-agent/27-background-review-session-proposal.md)复用既有 Pi 和 V2。

2026-10-13 已授权补齐进入 P06 前的 Main 接线与 A0。直接案卷入口现在由 Main 创建 `owner:review-case` 会话、准备 V2/指派、调用既有 `runAgent`；只有真实 `onRunOwned` 才回复已受理。Renderer 保留材料准备与事项识别，受理后只回读业务状态，不建普通聊天或持有运行 Promise；按案卷/runId 停止并等待现有执行器释放。旧 prepare/abort/指派 IPC 排除新 owner。禁止重新造执行引擎或数据库。A0 证据、外部 Relay/Pocket 阻断、P06 后续范围和合并门禁分别登记；本轮不合并、不解除 Draft，P05 PARTIAL/LIVE 未运行项不能因接线自动关闭。 已完成的本地 Main/A0 和下一批 P06 范围见 [34 号](docs/design/review-agent/34-pre-p06-main-a0-acceptance-20261013.md)，不得重复接线或将局部通过写为生产放行。 2026-10-13 的 P06-S02 实机/累计 P01～P06-S02 风险见 [37](docs/design/review-agent/37-p06-s02-local-acceptance-20261013.md)/[38](docs/design/review-agent/38-p01-p06-s02-cumulative-risk-audit-20261013.md)：E01/E02 PASS、E05 FAIL，四项生产缺口 OPEN；已有 CI 绿灯不等于新反例通过。当前只推公开测试仓库，先修复并纳入保护断言，不推进 P07/P08 或合并。

---

### 3.4 AI Provider 适配器 (`packages/core/src/providers/`)

基于适配器模式，通过 `adapterRegistry` 统一管理，按 `providerId` 查找适配器。四种协议适配器：`AnthropicAdapter`（Messages API）、`OpenAIAdapter`（Chat Completions）、`OpenAIResponsesAdapter`（Responses API）、`GoogleAdapter`（Generative Language API）；通用 SSE 读取器 `sse-reader.ts`。

实际注册表共 **18 个 providerId**：

| 协议 | 适配器 | providerId |
|------|--------|-----------|
| Anthropic Messages | `AnthropicAdapter` | `anthropic`、`anthropic-compatible` |
| Anthropic 兼容 | `AnthropicAdapter` | `kimi-api`、`kimi-coding`、`zhipu-coding`、`minimax`、`xiaomi`、`xiaomi-token-plan` |
| OpenAI Chat Completions | `OpenAIAdapter` | `openai`、`deepseek`、`zhipu`、`ollama`、`doubao`、`qwen`、`custom` |
| OpenAI Responses | `OpenAIResponsesAdapter` | `openai-responses`、`xai` |
| Google Generative Language | `GoogleAdapter` | `google` |

- **多模态格式**：适配器自动将图片及文档 `<file>` 格式转换为 Provider 原生协议。

---

### 3.5 CDUT 专区（特区账户）认证与画像

`main/lib/cdut/cdut-auth-manager.ts` 负责「特区账户」接入：主进程在隔离分区 `persist:cdut-auth-zone` 中通过隐藏窗口完成 headless 统一身份认证（CAS），鉴权落点严格收敛至青果教务主框架（`/jsxsd/framework/xsMainV`），渲染层仅消费状态、绝不接触明文密码。对应渲染组件为 `renderer/components/cdut-zone/CdutZoneView.tsx`，状态原子为 `renderer/atoms/cdut-account-atoms.ts`（`cdutAccountAtom`），IPC 走 `CDUT_ZONE_IPC_CHANNELS`。

- **认证成功判定红线**：
  - CAS 登录页必须严格按 `new URL(url).hostname === 'cas.paas.cdut.edu.cn'` 判定；
  - 认证落点成功必须以 `url.includes('/jsxsd/framework/xsMainV')` 判定（教务主框架），**严禁在 CAS/SSO 中间重定向阶段（如 `/sso/login.jsp`）过早结算**，否则会导致票据未完成握手就发起业务请求。
- **表单注入自适应**：注入脚本对 Vant（`input.van-field__control` / `.van-button--primary`）、Element-UI（`.el-input__inner`）与原生 `input` / `button[type=submit]` 三重回退，配合「原生 value setter + `input`/`change` 事件」写入，并轮询等待前端框架渲染完成后再提交。
- **双轨画像提取与保底**：
  - 双轨之一：主框架顶栏 DOM 直取真实中文姓名（`EXTRACT_TOP_NAME_SCRIPT`，不依赖底层网络请求，先保底拿到真实姓名）；
  - 双轨之二：Chromium 窗口上下文与专属 Session 协同提取学籍完整信息与证件照。
- **静默保活**：每 10 分钟以 `redirect:'manual'` 探活 `https://jw.cdut.edu.cn/jsxsd/framework/xsMainV.htmlx`，命中 `/cas/login` 或 401/403 时置状态 `expired` 并广播，停止计时器；计时器必须 `.unref()`，避免阻塞进程退出。
- **凭据本地加密**：落盘 `~/.cdutai/cdut-account.json`（`safe-file` 原子写入），密码仅在勾选「记住密码」时经 `token-crypto`（优先 `safeStorage`，回退 AES-256-GCM `proferv1:` 格式）加密；登出三阶段清理凭据文件与分区存储。
- **如实标注**：状态 `active` 仅表示最近一次认证成功且保活心跳正常，**不代表维持内网长连接**；不嗅探内网 Cookie，失败的持久化路径不得伪造成成功。

---

### 3.6 CDUT 专属 Tools 与教务接口高可用调用规范（确保 HTTP 200）

CDUT 内网青果教务系统部署有瑞数（RuiShu）动态安全反爬 WAF，且不同模块的版式存在细微差异。为确保 CDUT 专属 Tools（课表、成绩、空教室、考务、个人档案等）稳定可用，所有接口请求必须严格遵守以下契约：

#### 1. 瑞数 WAF 动态签名机制与 HTTP 400 根除准则
- **根因诊断**：瑞数采用「服务端会话 Cookie（以 `O` 结尾，如 `sMLAeTqisZbFO`）+ 客户端页面级动态签名 Cookie（以 `P` 结尾，如 `sMLAeTqisZbFP`）」校验机制。页面加载完成后，`*P` 签名仅对前序页面有效。若直接发起新接口请求并携带了旧页面的 `*P` Cookie，网关会直接拒绝连接并返回 **`HTTP 400 Bad Request`（空响应体）**。
- **必选防御措施**：
  - 主进程底层网络请求在每次调用 `ses.fetch` 前，**必须先执行 `stripStaleRuiShuCookies(ses)`**，移除 `domain: 'jw.cdut.edu.cn'` 下所有成对出现的陈旧 `*P` 签名；
  - 网关放行后，服务端基于 `JSESSIONID` 与 `*O` 会话 Cookie 正常响应业务数据（确保 HTTP 200）；
  - 避免盲目在父页面控制台执行 `window.fetch`，如遇复杂页面应优先驱动后台 `BrowserWindow` 真实导航加载。

#### 2. 分区隔离与 HTTP 请求构造规范
- **会话分区隔离红线**：所有请求必须走 `session.fromPartition(CDUT_AUTH_PARTITION).fetch(...)`，**严禁使用全局 `net.fetch`**（`net.fetch` 恒走默认分区，不携带特区账户 Cookie，会导致 401 未授权或重定向至登录页）。
- **Referer 契约**：每次请求必须携带合法的 `Referer`（默认 `https://jw.cdut.edu.cn/jsxsd/framework/xsMainV.htmlx`，或图片/子功能所在页面的具体绝对 URL），避免中间件基于防盗链规则阻断。
- **POST 表单规范**：必须设置 `headers['Content-Type'] = 'application/x-www-form-urlencoded'`，使用 `new URLSearchParams()` 序列化参数，严禁直接拼接未经 URI 编码的字符串。

#### 3. 学生证件照/头像抓取三阶梯引擎
- **阶梯 1（浏览器内存 Canvas 直取，最优先）**：
  Chromium 导航加载学籍页后，照片已解码在渲染进程内存中。等待 `img.complete && img.naturalWidth > 0`（带 1.8s 超时防假死），直接通过 `<canvas>` 导出 Base64 DataURL（`canvas.toDataURL('image/jpeg', 0.92)`）。**零网络往返、不受 Cookie 失效与 WAF 干扰**。
- **阶梯 2（窗口上下文 fetch 转 Blob -> DataURL）**：
  在窗口上下文执行带凭证的 `fetch(photoUrl, { credentials: 'include' })`。**必须注意**：青果教务 Servlet（如 `showzp.do`、`xsxx_zp.do`）返回的图片经常是 `Content-Type: application/octet-stream`，**严禁因 MIME 非 `image/` 而丢弃**；须检查 `blob.size >= 100`，读取后规范化规整为 `data:image/jpeg;base64,...`，确保渲染端 `UserAvatar` 可正确识别显示。
- **阶梯 3（主进程专属 Session 下载兜底）**：
  若窗口内未产出 Base64，将绝对地址交由主进程 `fetchImageAsBase64`，下载二进制流并使用 `isImageBuffer` 嗅探图片魔数（JPEG `FF D8 FF`、PNG `89 50 4E 47` 等），拦截非图片并转 DataURL。
- **端点多级补漏**：优先扫描 `/jsxsd/grxx/xsxx`（学籍卡片）；若未提取到照片，自动导航至 `/jsxsd/xsxj/xjxxgl.do`（学籍信息管理）二次提取。
- **选择器集合**：覆盖 `img#xjkp`、`#xsxxPhoto img`、`img#zp`、`img#xszp`、`img[src*="zp"]`（不加斜杠以兼容 `showzp.do`）、`td[rowspan] img` 等，并用 `isPlaceholderPhoto` 正则严格排除站点图标与占位图。

#### 4. 学籍表格与非结构化数据解析健壮性防线
- **双版式自适应**：同时兼容「标签与值同格（`<td>学院：地球物理学院</td>`）」与「标签与值分列（`<td>学院</td><td>地球物理学院</td>`）」，杜绝将下一格错配为上一格值的 Bug。
- **控件优先取值**：优先读取 `<input readonly>`、`<select>`、`<textarea>` 的当前值，取不到再退回单元格文本 `textContent`。
- **冒号切分容错**：纯数字时间（如 `08:00`）绝对不拆分为标签，避免时间数据被截断丢失。
- **持久化兜底**：当次网络抖动未取得头像时，优先继承本地缓存中已保存的有效头像，防止刷新后回退为默认首字母占位。

---

## 4. 渲染进程架构与 Jotai 状态管理

状态管理全量采用 **Jotai**（`apps/electron/src/renderer/atoms/`）：

| Atom 文件 | 管理职责 |
|-----------|----------|
| `agent-atoms.ts` | 会话列表、当前激活会话、流式状态 (`AgentStreamState`)、渠道/工作区映射、权限与问答请求队列 |
| `review-atoms.ts` | 内容审核专区状态：当前案卷、规则大纲、问题卡选中态、三栏联动焦点 (`reviewFocusAtom`) |
| `active-view.ts` | 主面板视图路由（`conversations` / `planning` / `agent-skills` / `content-review`） |
| `settings-tab.ts` | 设置面板标签页路由（18 个：general / usage / account / channels / appearance / about / agent / prompts / tools / bots / tutorial / shortcuts / team / openapi / data-management / developer / proxy / devices） |
| `theme.ts` | 界面主题模式（`light` / `dark` / `system`） |
| `conversation-atoms.ts` / `draft-session-atoms.ts` | 会话数据与草稿会话 |
| `tab-atoms.ts` / `tab-group-atoms.ts` / `sidebar-atoms.ts` / `panel-layout-atoms.ts` | 标签页、侧边栏与面板布局 |
| `planning-atoms.ts` / `goal-atoms.ts` / `graph-atoms.ts` | 规划、目标与项目图状态 |
| `automation-atoms.ts` | 定时任务（`automationsAtom`、`automationFormAtom`） |
| `browser-atoms.ts` / `preview-atoms.ts` | 内嵌浏览器与预览面板 |
| `feishu-atoms.ts` / `dingtalk-atoms.ts` / `wechat-atoms.ts` | 飞书/钉钉/微信集成状态 |
| `cdut-account-atoms.ts` | CDUT 专区「特区账户」状态（`cdutAccountAtom`：学号、姓名、头像、学院/专业、连接状态） |
| `system-prompt-atoms.ts` / `agent-preset-atoms.ts` | 系统提示词与 Agent 预设 |
| `ui-preferences.ts` / `ui-scale.ts` / `markdown-font-size.ts` | 界面偏好、界面缩放、Markdown 字号 |
| `user-profile.ts` / `notifications.ts` | 用户档案与通知 |

### 核心前端设计模式

1. **全局 Agent 监听器 (`useGlobalAgentListeners`)**：
   - 挂载于 `renderer/main.tsx` 根部，使用 `useStore()` 直接更新 Atoms，生命周期贯穿应用全程；
   - 保证切换设置或审核专区时后台流式回复不中断、权限确认弹窗不丢失。
2. **三栏联动与卡片设计**：
   - 遵循 ShadcnUI 风格，用优雅的卡片与立体阴影取代冷硬边框；
   - 审核专区支持通过 `reviewFocusAtom` 点击右侧问题卡直接高亮中栏违规条目与左栏规则依据。

---

## 5. 本地存储规范与精简边界

- **配置文件优先**：配置存放在 `~/.cdutai/`（正式版）/ `~/.cdutai-dev/`（开发版），可由 `PROFER_CONFIG_DIR` 覆盖。CDUT Studio 不读取也不迁移 `~/.proma` / `~/.profer` 旧数据。
- **用户 Agent 沙箱**：`~/.cdutai/agent-workspaces/{slug}/`，无工作区会话落到 `~/.cdutai/agent-workspaces/default/{sessionId}`。
- **结构化日志**：会话消息采用追加式 JSONL 存储（`agent-sessions/{sessionId}.jsonl`）。
- **特区账户凭据**：`~/.cdutai/cdut-account.json`，原子写入；密码字段仅在勾选记住时经 OS 级加密（`safeStorage` / AES-256-GCM），登出即清理。
- **坚守原则**：**绝不引入复杂重量级的本地数据库（如 SQLite）**，轻量文本配置与原子写入优于一切。
- **产品边界**：保持纯粹的 AI Agent 交互体验。历史遗留的独立服务端、多用户协同 UI 等已彻底清理，严禁引入过度设计的冗余模块。

---

## 6. 构建、测试与发版约束

1. **严格类型校验**：
   - 任何改动提交前，**必须执行 `bun run typecheck`**。严禁在存在类型报错、未导入符号的情况下打包。
2. **打包依赖闭包**：
   - 打包前必须执行 `bun run sync:runtime-deps` 与 `bun run verify:packaged-pi-runtime`，保证原生 native 模块完整内聚。
3. **资源目录规范**：
   - `resources/bin/` 仅允许存放随包 CLI 工具；
   - 内置依赖程序（如 MinGit 检查点引擎、BusyBox 等）通过 `electron-builder.yml` 明确配置 `extraResources` 并置于标准路径。
4. **文档同步铁律**：
   - 功能与架构发生调整后，保持 `AGENTS.md` 和 `README.md` 同步更新，且修改前必须经过用户确认。

> **已知待修点**：`apps/electron/electron-builder.yml` 的 `files` 仍保留 `!node_modules/@proma/**`（过时前缀，代码待修）。

---

## 7. 默认 Skills（`apps/electron/default-skills/`）

应用启动时按 semver 比较自动同步到 `~/.cdutai/default-skills/` 与各工作区，共 **17 个**：

| Skill | 用途 |
|-------|------|
| `automation` | 内嵌定时任务 |
| `brainstorming` | 创意工作前需求探索与设计 |
| `docx` | Word 文档创建/读取/编辑 |
| `executing-plans` | 带审查检查点的实现计划执行 |
| `find-skills` | 发现并安装 Skills |
| `guizang-ppt-skill` | 横向翻页网页 PPT 生成 |
| `in-app-browser` | 内嵌浏览器操作 |
| `lark-delivery` | 飞书/Lark 交付与推送 |
| `pdf` | PDF 文档处理 |
| `pptx` | PowerPoint 演示文稿 |
| `profer-coach` | CDUT Studio 使用顾问 |
| `session-cleaner` | 会话 JSONL 清洗为 Markdown |
| `skill-creator` | Skill 创建/编辑/评估 |
| `tool-builder` | 自定义 HTTP 工具管理 |
| `user-sense` | 用户感知/人设与语气适配 |
| `writing-plans` | 多步骤任务实施计划 |
| `xlsx` | 电子表格处理 |

### 版本契约与全局元 Skill（master）

- **修改任何 `default-skills/<skill>/` 内容时必须同步递增该 `SKILL.md` frontmatter 的 `version`（patch +1）**——否则 `seedDefaultSkills` 不会用新版覆盖老用户全局库。
- `upgradeDefaultSkillsInWorkspaces` 语义为「缺失即注入」，不再对已存在工作区 skill 做基于 version 的全量覆盖。
- 全局元 Skill 库 = `~/.cdutai/default-skills/{slug}/`（唯一编辑源）；历史快照 `~/.cdutai/default-skills-history/{slug}/v{n}/`（v1 为出厂基线），索引 `index.json`。
- 保存即 bump：`saveMasterSkill` 自动 patch+1 并落盘快照；`rollbackMasterSkill` 回退保留新记录。
- 工作区同步：`syncMasterSkillToWorkspace` 覆盖到个人工作区 `skills/{slug}` 并写 `.source.json`；基于内容哈希 `detectSkillConflict` 检测冲突，非强制同步拒绝覆盖。

---

## 8. 版本管理与发版

- **版本递增**：提交代码时始终递增受影响包的 patch 版本（影响多包则逐个递增）。
- **构建目标**：`__PROFER_BUILD_TARGET__` 编译期注入 `oss` / `commercial`，互不串扰。
- **Pi 内核升级**：根 `overrides` 将四个 Pi 包统钉 `0.86.1`，`patchedDependencies` 施加补丁；升级必须四者同步并评估补丁 rebase 与 native addon 兼容性。
- **Windows 正式发版（本地唯一发布者）**：由 `scripts/push-release.cjs` 单独完成——构建签名 Windows x64 安装包、上传国内更新源、推送源码/tag、创建或补齐 GitHub Release。tag 与 `package.json`/CHANGELOG 首条版本必须一致；脚本不 rebase、不强推 tag。
- **macOS arm64 验收**：`.github/workflows/macos-package.yml` 手动触发，仅产出无签名、无公证的 arm64 验收包（Actions Artifact），需用户明确确认后方可作为测试资产加入 Pre-release，不进入 Windows 国内更新源。
- **构建验证 workflow**：`release.yml` 为仅手动触发的构建验证，绝不因 tag 自动构建或写入 GitHub Release。
- **辅助脚本/校验**：`scripts/verify-release-preflight.cjs`（发版预检）、`scripts/release-asset-contract.cjs`（资产契约）、`scripts/build-releases-json.cjs`（`release:releases-json`）、`scripts/push-mac-release.cjs`（`release:mac`）。

P06 实机批量补修：case/group 级检查不依赖非空 subjectIds 判定有效工具结果；无有效提交继续生成 execution-failed。真实验收状态仍见 docs/design/review-agent/29-background-session-preflight-audit.md。
