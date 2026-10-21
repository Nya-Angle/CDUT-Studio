# 32｜P05 阶段独立验收、跨仓阻断与本地实测交接（2026-10-13）

> **2026-10-15 P06依赖更新**：根据 [47｜L02-04](47-p06-evidence-driven-followup-plan-20261015.md)，中心 `P05-RELAY-ROUTE-01` 仍**BLOCKED**，独立Pocket `P05-POCKET-FIFO-01` 仍**PATCH READY / TARGET NOT-RUN**。允许与L02-00～03的本地可执行验证并行协调，但外部未真正验收前不得把LIVE-06/08或PR合并门禁改PASS；原43/43受控结果及补丁仍为历史有效证据。


> **本地执行补录**：本手册 §4 已在 `df0c0d57` 执行九步全部通过，完整证据见 [33｜P05 本地复验](33-p05-local-automation-recheck-20261013.md)。用户随后授权补齐 Main/A0，见 [34｜P06 前置验收](34-pre-p06-main-a0-acceptance-20261013.md)。下方是原 P05 冻结批次记录；“不执行 Main”属于当时停点，现已由新授权推进。本轮依旧不合并、不解除 Draft，生产中心和独立 Pocket 状态原样保留。

> 范围：Draft PR #21 / `feat/review-owned-background-sessions`，本文件只总结 P05-S01～S06 的可核验证据与合并门禁。**受控 PASS 不等于真实 Pocket/中心 Relay/飞书/Electron LIVE PASS。** 必须同时阅读 [29 号证据台账](29-background-session-preflight-audit.md) 和 [30 号项目交接](30-background-session-handoff.md)。P04-TECHDEBT-01 的永久保留 tombstone 与性能数据以 29 号为准，不因本次 P05 批次而删除或改写。

## 1. 本批冻结事实与阶段结论

- **冻结桌面端代码**：[`ce992f90`](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/commit/ce992f90880ecde1954e925b63585692a085f621)。
- **CI 原始证据**：[PR CI #38284532497](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38284532497)、[D2 #38284532492](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38284532492)、[Review Baseline #38284532487](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38284532487)，均 SUCCESS。PR CI：**3830 pass / 5 skip / 0 fail**，3835 tests / 436 files，工作区 typecheck、包边界、Electron main/preload/renderer 构建通过。
- **P05 专项**：六份 `*.p05.test.ts` 的完整 CI 日志逐文件计数合计 **43/43 PASS / 0 fail / 0 skip**，其余全仓 5 skip 与 P05 专项不同。
- **阶段判定：P05 CODE/CONTROLLED GATES PASS；P05 END-TO-END = BLOCKED / PARTIAL；PR MERGE = NO-GO**。该冻结批次时用户本地验收尚未执行；现已补录 33 号本地证据，中心端与 Pocket 上游仍未取得真实修复/部署/测试证据。不是基于抽象“谨慎”，而是下面第 3 节具体两个外部阻断项以及项目整体 A0/LIVE 门禁没有解除。

## 2. P05-S01～S06 完整受控核验矩阵

| 批次 / 专项文件 | 本次 HEAD CI | 证据涵盖 | 没有证明 |
|---|---:|---|---|
| S01 `review-remote-indirect-access.p05.test.ts` | 5/5 | pending 三类交互、隐藏/已删 requestId 拒绝、旧预览会话上下文、迟到事件过滤 | 真实 Pocket、真实权限 UI |
| S02 `review-feishu-owner-boundary.p05.test.ts` | 7/7 | 历史群绑定恢复、模型/启动/停止、飞书镜像/事件、普通群正例 | 真正飞书群授权/双向回执 |
| S03 `review-remote-path-access.p05.test.ts` | 7/7 | 远程 Chat 附件、普通会话及共享工作区读取、symlink/目录隔离、旧版命令 | Windows/macOS 真实路径与旧版本 Pocket |
| S04 `review-remote-reconnect-search.p05.test.ts` | 8/8 | 搜索快照、tombstone、嵌套提及 ID、事件游标与窗口过期 | 真实移动端弱网/进程重启复原 |
| S05 `review-remote-websocket-relay.p05.test.ts` | 8/8 | 实际本机 TCP/WS、token、双 viewer、乱序/重连 cursor、模拟 RelayClient ticket | 中心 `profer.cn`、外网设备 |
| S06 `review-relay-multi-viewer-contract.p05.test.ts` | 8/8 | 实际本机 WS + **模拟中心**的多 viewer、相同业务 requestId、**碰撞的 viewer 本地 _cmdId**、独立中心 correlation、断线迟到回执丢弃、隐藏 ID 深层拦截 | 生产中心的源码/部署、正式票据及真正 Pocket 客户端 |
| **总计** | **43/43** | **P05 桌面仓库受控链路有可复核证据** | **跨仓与实机不自动放行** |

测试名和实际 PASS 均已在 [PR CI #38284532497](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38284532497) 的 verify 日志中逐一确认；不把测试函数存在等同于执行通过。

## 3. 两项阻断与各自真实状态

### P05-RELAY-ROUTE-01：BLOCKED（生产中心）

本仓库包含 `RemoteRelayClient`、桌面 `remote-service`，**没有发现中心 `/remote/ws` viewer→desktop→viewer 服务端实现**。S06 扩增的本地中心路由夹具为每个 viewer 的 _cmdId **重新生成仅中心内部使用的全局关联 ID**，桌面响应后由中心恢复原始 viewer ID；同时在 viewer 断线时删除路由条目、丢弃旧回执。两项新增用例（相同 _cmdId 碰撞、旧回执跨重连）均受控 PASS。

**生产服务端必须满足而尚未验证的合同**：同账户多 viewer 独立授权/连接状态；center 内部 correlation 不与 viewer ID 直接共用；pending 记录严格属于认证后的 viewer socket/connection epoch；回执仅送原 viewer；相同原始 _cmdId、超时/断线/重连/迟到/重复命令不串回；中心 ticket 绑定账户/设备角色/失效周期，并正确拒绝旧票据；异常 cursor 触发快照。还须真实环境并发双端联调。**本地 fixture 是参考合同，不是生产中心补丁**；不能凭它证明中心现状或部署成功。

### P05-POCKET-FIFO-01：PATCH READY / TARGET NOT-RUN（独立仓库）

外部 [Profer-pocket](https://github.com/Yuan-lai-ru-ci/Profer-pocket) 上游固定 SHA：[`95e79f11003006f4386b7f96540fa61f45bdd965`](https://github.com/Yuan-lai-ru-ci/Profer-pocket/commit/95e79f11003006f4386b7f96540fa61f45bdd965)。当前 GitHub 连接对此仓库 **pull=true / push=false**，因此没有直接写入上游，也没有取得上游 CI。

**提供可应用的独立补丁**：[P05-POCKET-FIFO-01-Profer-pocket.patch](patches/P05-POCKET-FIFO-01-Profer-pocket.patch)。补丁针对该冻结上游源文件和测试文件的两个 hunk 做过源代码逐行匹配验证；**尚未在上游工作区执行 `git apply --check`、Bun 单测、Typecheck 或真正 Pocket 安装包测试**，不得标 PASS。

补丁逻辑：带非空 `commandId/requestId` 的未匹配/重复/旧回复直接丢弃，禁止触碰其他 pending，也不触发 `onCommandResult` 写入 Remote Store；完全无 ID 的旧服务回复仅在**恰好一个 pending** 时允许 FIFO，并将回执的 `commandId` 归一到实际结算的 ID。附带 3 个测试：错 ID/业务 requestId 误导、多个 pending 时无 ID 禁 FIFO、错误回执仅结算原请求。需由拥有 Pocket 写权限的人在独立分支应用、执行并提交该仓库的冻结 SHA/CI；桌面 PR 不应擅自代替 Pocket 发布。

## 4. 本地第一轮自动化复验（推荐按序）

> 在隔离的开发工作区执行；不要覆盖日常个人配置。与 GitHub Actions 对齐的组合为 Bun 1.4.0、Node 22。运行前核对 `git rev-parse HEAD` 与 PR HEAD；若 HEAD 更新，以更新后的 CI 和代码重算。

~~~bash
# cd 到 cdut-studio-review-agent 的本地仓库
git fetch origin feat/review-owned-background-sessions
git switch feat/review-owned-background-sessions
git rev-parse HEAD
ELECTRON_SKIP_BINARY_DOWNLOAD=1 bun install --frozen-lockfile

# P05 六个专项文件，自动覆盖 43 项
bun test --isolate --timeout 30000 apps/electron/src/main/lib/review/*.p05.test.ts

# 与 CI 一致的全仓检查
bun run typecheck
bun run check:boundaries
(cd apps/electron && bun run check:skin-contract && bun run build:main && bun run build:preload && bun run build:renderer)
bun test --isolate --timeout 30000
~~~

期望：P05 专项 43/43，所有失败数为 0。日志应保存命令、完整 SHA、Bun/Node 版本、OS、所有失败堆栈。**本地结果不等于远程中心服务通过**。

## 5. Pocket 补丁应用和回归（单独仓库）

~~~bash
# 在 Profer-pocket 本地工作树执行，先确认文件没有未提交的冲突修改
cd /path/to/Profer-pocket
git status --short
git rev-parse HEAD
# 若不是补丁所针对的 95e79f11，先 review 差异，不能强行套 patch

git apply --check /path/to/cdut-studio-review-agent/docs/design/review-agent/patches/P05-POCKET-FIFO-01-Profer-pocket.patch
git apply /path/to/cdut-studio-review-agent/docs/design/review-agent/patches/P05-POCKET-FIFO-01-Profer-pocket.patch
bun install --frozen-lockfile
bun test src/renderer/pocket/ws-client.test.ts
bun run typecheck
bun run build
git diff --check
git diff --stat
~~~

通过后应在 Pocket 独立 PR/分支持久化（不能只在本机打补丁），检查普通响应、错误响应、掉线后旧回复、无 ID 老服务端单命令、两并发无 ID 拒绝、Remote Store 不被不匹配回执更新。测试记录需附实际新 SHA 和 CI。没有上游合并/发布证据前，此项不能 CLOSED。

## 6. 实机/真实中心与飞书验收（统一待用户或维护者执行）

- **LAN 正例及双客户端**：普通会话 A/B，查询/文件预览/授权问答/事件订阅均工作；相同 _cmdId 在不同 Pocket viewer 不串回应；不带 sessionId 的旧版 Relay 文件预览按预期拒绝，但 LAN 旧回退不误伤。
- **审核隔离负例**：live owner、已删除 owner tombstone、嵌套 sessionId 与投影/搜索/附件、权限待处理、群绑定均不显示或不允许操作；再次登录与重启后仍不暴露。使用合成案卷，不导入真实隐私数据。
- **实际中心服务（必须授权）**：同账户两台 Pocket 真正连到中心 `/remote/ws`；验证两个 viewer 发生 _cmdId 碰撞、业务 requestId 相同、请求并发、延迟、断线后旧命令、重连与 ticket 轮换，服务器日志有经脱敏的关联链。若无法控制测试回执，请在 staging 服务复现实验，不对未经授权的生产连接注入。
- **飞书真实群**：现有绑定恢复、普通群可用、审查隐藏 owner 不可见且不被镜像或群指令启动/停止；留脱敏日志。
- **真实 Electron/Pocket 与历史回归**：普通 Agent/Pi/Claude、文件预览/搜索、远程路径正例、WeakNet replay、长期运行、跨窗口/删除后的负例。Windows/macOS 路径差异如不能实测必须标平台 NOT-RUN。

建议逐项登记：测试人、OS/Bun/Pocket 与中心版本 SHA、设备数量、具体测试数据 ID（脱敏）、期望与实际、截图/日志位置、失败原因、是否重试。当前以上 **全部 NOT-RUN**。P05 不能因桌面 CI 全绿或用户口头尝试而自动 PASS。

## 7. 合并决策与下一责任人

**当前：NO-GO / 保持 Draft/Open/未合并。** 能解除 P05 的前置条件：
1. 中心服务端真正实现并证明路由合同，提供获授权生产或 staging 的同账户多 viewer、冲突 ID、迟到回执的原始证据（不能重复引用模拟中心测试）。
2. Pocket patch 在其**独立仓库**完成审查、单测/Typecheck、实际运行与版本更新，非匹配响应不会结算 pending 或污染 Remote Store。
3. 真 LAN/Pocket/飞书的普通正例、隐藏 owner/删后负例、重连结果有记录，且与冻结版本一一对应。

即便 P05 外部条件全部解除，**本项目 PR #21 合并还受 Main 最小审核业务接线、A0、P06/P07/P08、LIVE-01～08 等项目级门禁约束**，不能将“P05 阶段合格”等同“整个 PR 可合并”。

该 P05 冻结批次不合并、不解除 Draft、不执行 Main/P06/P07/P08；后续授权的 Main/A0 交付见 34 号，P06/P07/P08 尚未执行；P04-TECHDEBT-01 留存与已知容量风险的记录在 29 号完整保留。
