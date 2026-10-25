# 46｜P06-RECHECK-LIVE 本地独立实机验收（2026-10-14～15）

> **E05 / E03 / E04 与四项真实 I/O 子场景 PASS；完整 E06 PARTIAL。P06-S02 NOT ACCEPTED / P06 PARTIAL / LIVE-07 PARTIAL / Draft/Open/MERGE NO-GO。** 本报告记录实际 Electron Main、Preload、Renderer、Pi/provider 与内核 I/O，不将单测或标准 CI 代替实机证据。唯一正式验收台账仍为 [29 号](29-background-session-preflight-audit.md)。37/38/44 号原失败与原脚本未改写。

报告原预定45号；发布前远程推进到 `7132ca658ffc64c1f3bc44146ef9bddedae950e5`，已有45号当前写入者报告，因此本报告改用46号，并保留并发测试/workflow/文档。随后远程 `981ed3a54582c130a6d5286763925883577bfde8` 的45号CI验收记录也完整合入，未覆盖。并发代码只增加测试，生产文件与 b95 完全相同；整合后的最终标准回归与 CI 在 PR 最终评论按实际 HEAD 记录。

## 1. 基线、隔离与冻结版本

- 开工先检查原工作树，未发现未提交用户改动，重新 fetch/查询远程：`4ba61fad77b18f8fa9a25babeb25e9c08d5304fe`。PR #21 为 Draft/Open/unmerged，四套标准 CI SUCCESS，独立原风险 workflow FAILURE；原始公开 API 元数据见证据目录 baseline 文件。
- 原分支已被其他工作树占用，因此使用独立 shared clone `/home/miku/Bot/CDUTStudio/.workdir/p06-recheck-live-20261014`，只连接本测试仓库 origin、只修改 `feat/review-owned-background-sessions`。没有修改上游/main/其他工作树。
- 并发 HEAD `d39857e715d23f5e1a636e2a40f5a091ba874175` 的七个 Linux workflow self-hosted 路由变更完整保留。发布前再次核对 HEAD；普通 HTTPS push 因本机无 CLI 认证 exit128，改用已授权 GitHub connector 的 `create_tree/create_commit/update_ref(expected_sha, force=false)`。一次 GraphQL 临时错误先查询远程确认未移动，再重试；没有 force push。
- 本次最终**生产源码 SHA**：`b95b44f7a06bb1e1ae21a985b5bb4cd9f5581027`；tree `bfcb5863a4d20c2d2a5c95c0a94a25d94b38cf33`；版本 `0.15.161`。最终文档/证据提交 SHA 与其 CI 在 PR 最终验收评论中登记，避免文档提交自引用。文档提交后生产文件哈希仍与该冻结源码一致。
- 本地提交与发布提交采用相同 tree：`211285b5c047f8934b4196e266c431b1eaeb0026` → `36625a28194863f205bf607f0da4de0196870b5f`（tree `7bf992e312324655b5e815bebd706188ee208d33`）；`67a8ce4312651c29b1f47ef16c5babd915b41121` → `d24d1c2d69ae25ff47a080155041cc62620a6bf9`（tree `20c520c3299a7b0dd452aeb4af4ffa80c1afd727`）；`740fdfa1716fad79510b891314a34374327bfce5` → `b95b44f7...`（上方 tree）。本地修复前后的 command `sourceSha` 有些记录的是尚未提交补丁的基线，不把这些早期数字冒充完整干净 HEAD 结果；最终标准门禁和选定实机场景在发布源码上重跑。

### 实际环境

Ubuntu 26.04.1 LTS / Linux 7.0.0-38-generic / x86_64；Bun 1.4.0；宿主 Node v22.23.2；实际 Electron **43.7.7**，Main 内嵌 Node **24.21.0**、Chromium **150.0.7871.250**。没有照抄旧报告的 Electron 版本。开工 UTC `2026-10-14T10:49:42.727992+00:00`（CST 18:49），跨至 10-15 凌晨；每条命令独立保留 UTC 开始/结束时间。

隔离 profile 与全部原始证据只在 `.../p06-recheck-live-20261014-private/`。从已有授权测试 profile **不透明复制** channels/review-module-settings/device 配置，保持原设备加密匹配；未打印、上传密钥，未复制真实案卷或 transcript。最初缺匹配 device 的启动/provider 失败保留。全部新案卷、文件、会话和模板为合成数据。

实际入口沿用 34/37 成功方法：Xvfb 1600×1000、Vite 5176、localhost Renderer CDP 9222；诊断 Main inspector 9230 仅绑定 127.0.0.1。诊断入口导入真实 Main，捕获生产 outcome、串接真实 stop completion 的显式闸门、只采集 Pi SDK 回执计数/用量；没有替换 provider、executor、IPC 返回内容。首次 CLI inspector 曾绑定全部地址，后改成代码内 localhost 并检查监听。权限故障只限隔离目录；ENOSPC 只限独立 **8 MiB tmpfs**。最终停止隔离进程并卸载该卷，exit0。

## 2. 最终实机结果与计数

| 场景 | 真实命中证据与范围 | 最终结果 | 显式断言 / 测试 exit |
| --- | --- | --- | --- |
| R2/E05 | 旧 provider 回执与真实 listRunsV2 响应先捕获；实际关页；页面外新 Main ACK accepted/running；重进后把旧响应交付到生产 Controller；Main/Jotai runId 均保持新轮，旧错误/stop feedback 不复活，新轮按钮停止正常 | **PASS** | 9 / 0 |
| R3/E03 | 真实 stopAndWait 与 Renderer stop Promise 同时 pending；显式串接真实 executor completion，busy restart 真拒绝；释放闸门后立即真实 restart，旧授权撤销、新授权与 Main V2 一致 | **PASS（可控闸门）** | 8 / 0 |
| R3/E04 | 从真正 Pi executor 输入捕获旧 Main outcome 闭包；真实 stop/restart 后实际调用旧 completed 和 failed 回调；新轮不回退，旧工具/指派拒止，新轮可停止 | **PASS（真实闭包可控复演）** | 7 / 0 |
| E06 普通 Pi create/list/meta/send | 原 37 号正例脚本原样执行，真实 provider marker 与用量回执，普通会话可见可读且无 owner | **PASS 子集** | 0 显式 assert；5 个最终布尔判词 / 0 |
| E06 Read 工具 | 真实 provider 发起 Read，读取合成文件，executor 释放 | **PASS** | 3 / 0 |
| E06 权限拒止/恢复 | permissionModeOverride=auto，真实 Write pending；拒绝后文件不存在；新请求允许后真实写入，pending 清零 | **PASS** | 4 / 0 |
| E06 普通发送中 stop | 真实发送 Promise 未完成、executor active；停止后释放 | **PASS** | 2 / 0 |
| E06 文本预览/切页 | 真实 Main 授权读取、预览 Tab、Shadow DOM 实际文本、返回审核页 | **PASS** | 3 / 0 |
| E06 真实批次队列/B/C 拒止子集 | 三案真实 Main 队列与 Pi SDK 请求/非零回执；实际检查记录；辅助模式无正式决定；过期问题组和未开全局代批都拒绝；真实批次 UI | **PASS 子集；完整 A/B/C PARTIAL** | 9 / 0 |
| E06 Office/owner 路径拒止 | 真实存在的 review owner 合成文件被普通会话拒绝；真实 DOCX Renderer 内容；provider 合成回复持久化、页面切换 | **PASS 子集** | 5 / 0 |
| E06 普通会话真实重启恢复 | 杀掉隔离 Main、启动新 PID；list/meta/SDK IPC 保留合成会话与回复；重新打开 Office 显示内容、切页 | **PASS 子集** | 5 / 0 |
| E06 扫描 PDF 预览 | 真实 PDF 准备 IPC、真实 Tab、独立 iframe target 导航与真实页面 canvas 尺寸，截图含合成扫描标记 | **PASS 预览子集** | 4 / 0 |
| FIX-03 真实 ENOSPC | 实际生产 assignment 原子 tmp 写入落在满 tmpfs，write 返回 ENOSPC；原 JSON 未截断、内存拒止；恢复后真实下一笔写盘补齐 revokedAt | **PASS** | 8 / 0 |
| 双持久化及 owner 失写 | 真实 old outcome 执行；run V2 与 assignment 都未成功落盘，owner index/journal 写也被拒绝；工具 fail-closed、executor 实际停止 | **PASS 当前进程** | 5 / 0 |
| 故障保持的真实重启 | 新 PID、真实 preload IPC；磁盘仍 running，旧工具 false、binding false，没有冒称已持久撤销 | **PASS 拒止** | 2 / 0 |
| 可写恢复的真实重启 | 还原独立目录写权限再新 PID；原 run 本体仍0400，原子 tmp+rename 将 interrupted failed 落盘，旧工具/绑定仍 false | **PASS 恢复** | 3 / 0 |

**最终选定实机：16 场景 / 16 PASS / 0 FAIL，77 条显式断言 / 0 失败，另普通 Pi 5 个布尔判词。** 不包含 provider 库存行、NOT-RUN/BLOCKED、重复回归、修前失败或驱动前置失败；不是完整 E06 的 16/16。机器可读 [selected-result-summary](acceptance/p06-recheck-live-20261014/records/live-b95-final/selected-result-summary.json) 和 [当前状态总表](acceptance/p06-recheck-live-20261014/acceptance-status.json)。

### 竞争窗口证据

E05 JSON 有 `real-ipc-listRunsV2-issued`、`real-main-response-captured`、`old-response-delivered-to-production-controller` 三条真实时序；新 Main accepted 在页面重新进入之前发生。迟到交付前后 runId、status 完全相同。Main 使用 `phase=accepted`；Renderer 生产 atom 使用 `status=running, stage=checks, message`，**没有 phase 字段**，报告不虚构 Renderer phase。截图是辅助，JSON 才是竞争判词。

E03 `pendingWitness.stopEntered/stopPending=true`、真实 busy 异常、real-executor-completion-before-stop-gate、闸门释放、ACK、旧/新 assignment 判词都保存。它证明真实生产 stop Promise 的重叠窗口，不宣称网络自然延迟。E04 两次 `callbackExecuted=true` 及其 before/after 均保存；这是真实闭包重复调用，**不是自然 SDK 迟到网络包**，自然延迟矩阵仍可扩展。

### E06 不能扩张为完整 PASS

本轮批次三案 A/B/C 是合成预算资料，**不是原完整 A/B/C 工作流矩阵**。最终 A 为 compliant、B 为 non-compliant；C 未完整通过语义工具，诚实保留 execution-failed/技术异常，且没有自动正式审批。队列子测试通过证明执行、拒止和 UI，不能把 C 的业务检查写成通过。V2 modelUsage 当前只收图像路径记录；早期错误地要求文字记录非空的 FAIL 保留，后改用真实 Pi SDK 非零用量回执见证，不合计重复 SDK stream 回执作为费用。

普通 PDF/Office 预览和普通会话恢复不等于严格审核模型的 PDF 原件工具回执、扫描视觉核验、自动 Tab 恢复、双窗口或 fork 全量通过。e06-matrix 原执行时 umbrella 行 NOT-RUN 是历史快照，最新独立预览/恢复证据按上表与 acceptance-status 合并，完整 E06 仍 PARTIAL。

## 3. 真实故障、最小修复与首败

| 新反例 | 修复范围 | 修前 / 修后正式用例 |
| --- | --- | --- |
| 启动恢复失写后旧工具与 Pi binding 复活 | run-store-v2 启动先加入进程 interrupted deny，再走原子 save；路径内 case/run 校验；assignment 和 binding 共用 deny；持久失败继续记录 | 1 PASS / 2 FAIL → 3 PASS，16 expect |
| Pi queryOptions 丢失已有 canUseTool | AgentOrchestrator 只补 `canUseTool,`，使普通权限与既有严格审核权限实际抵达 Adapter | 0 PASS / 2 FAIL → 2 PASS，9 expect |
| outcome 落盘失败到 Promise settle 之间旧 grant 短暂有效 | onRunOutcome catch 立即 revoke（先设内存 deny）、观察错误并 finally forget 旧 ACK；不等待后续 Promise 才隔离 | 20 PASS / 1 FAIL → 21 PASS，82 expect；新增1条同步反例 |
| 无 subject 的 case/group 语义结果被同时补 execution-failed | v2-executor-factory 一行以有效 pluginRuleIds 判全案/组结果，不依赖 subjectIds 非空；未提交仍缺结果拒止 | 1 PASS / 2 FAIL → 3 PASS，6 expect |

**四组修前正式执行共 7 条失败断言；修后四组 29 用例、113 expect 全 PASS，其中本轮新增唯一用例 9 条。** 这些是受控回归；真实首败与当前实机复测另外存放。首次全仓 e732 还因未补版本 CHANGELOG 失败，后按仓库合同补 158/159/160/161 记录；不掩盖该日志。

原 38 四项探针在 b95 **原样执行 3 PASS / 1 FAIL、exit1**。裸 store.set 的 WORKSPACE-WRITER 仍失败且非当前生产写入资格；旧 SETTLE 只 chmod 原件，不命中原子 tmp 写，不作为 I/O 证明。b95 独立 workflow 保持 FAILURE。7132 并发保留原脚本运行与真实 exit1，将可识别旧裸store失败归档、以当前四类生产写入者和证据完整性为新 workflow 门禁；本次未改写该并发流程，最终 workflow 结果须如实按最终 HEAD 记录。新版日志 LIVE_E05=NOT_RUN 只说明 CI 本身未启动 Electron，不覆盖本报告独立本地实机 PASS。原 37 的 E05 FAIL、38 的四项首败、44 的云端结果完整保留。

其他驱动/前置失败全部保留，包括加密设备不匹配、E05 未进工作台、Vite 构建重载导致 CDP target 关闭、只读目录初次错误 fixture、ENOSPC 错认 write 错误必带 path、异步 executor 清理即时检查、batch 手工 stage 未触发语义图、过期组实际应 Promise reject、PDF 查询错误主 frame/旧 token。PDF 最终通过来自实际 **iframe target** 与当前 UI token，不通过编辑截图或伪造 canvas。普通泛用文件入口允许现有用户目录，其初次“所有 workspace 外都须拒绝”的判词不是本项目合同，标为驱动 INVALID；正确 review owner 文件负例通过。

[所有 command 退出码索引](acceptance/p06-recheck-live-20261014/command-exits.json) 分开标记 setup/lifecycle。为重启故意终止 Main 后 supervisor exit1 不是测试失败；有些早期被用户消息中断的进程没有最终 command JSON，保留原始日志与这个缺口，不补造退出码。

## 4. 执行命令与复验方法

所有实际 argv/cwd/环境白名单/UTC/stdout/stderr/退出码在 records 下每条 `.command.json`，正式回归完整脱敏输出也已归档。下面是等价可复验入口；`QA_PRIVATE` 必须是**全新独立验收目录**，首次用 bootstrap 创建合成案卷。授权配置保持不透明复制、不输出内容。

```bash
# 在目标分支的独立 checkout 中；先 typecheck 再构建。
bun install --frozen-lockfile
bun run typecheck
bun run check:boundaries
cd apps/electron
bun run build:main
bun run build:preload
bun run build:renderer
cd ../..

# 完整诊断构建 argv 见 setup/24-b95-final-runtime-build.command.json。
bun node_modules/esbuild/bin/esbuild scripts/qa/review-live-main.ts \
  --bundle --platform=node --format=cjs --outfile=apps/electron/dist/live-main.cjs \
  --external:electron --external:@earendil-works/pi-coding-agent \
  --external:@earendil-works/pi-agent-core --external:@earendil-works/pi-ai \
  '--define:__PROFER_BUILD_TARGET__="oss"'

# wrapper 消费 Electron path 后启动 own dist/live-main.cjs；见实际 setup 命令和 bootstrap。
export QA_APPLICATION_SHA="$(git rev-parse HEAD)"
export QA_PROFILE_ROOT="$QA_PRIVATE/authorized-profile"
export PROFER_CONFIG_DIR="$QA_PROFILE_ROOT/config"
export PROFER_USER_DATA_DIR="$QA_PROFILE_ROOT/user-data"
export ELECTRON_OVERRIDE_DIST_PATH="$QA_PROFILE_ROOT/electron-dist"
export PROFER_DEV=1 PROFER_DEV_INSTANCE=p06-recheck-live-auth-20261014 PROFER_VITE_PORT=5176
xvfb-run -a -s '-screen 0 1600x1000x24' bun run dev
# 也可使用 scripts/qa/review-live-launch.py --private "$QA_PRIVATE" --name 独立名称。

# 另一个终端，同样环境，分项保留证据；不要与 Vite/build 并发做 UI 时序测试。
export QA_REPORT_DIR="$QA_PRIVATE/live-final"
node scripts/qa/review-live-bootstrap.mjs
node scripts/qa/review-live-enter.mjs
node scripts/qa/review-live-e05.mjs
node scripts/qa/review-live-races.mjs
node scripts/qa/review-live-e06.mjs
node scripts/qa/review-live-batch.mjs
node scripts/qa/review-live-preview-restore.mjs prepare-office
# 真正重新启动隔离 Main，再运行：
node scripts/qa/review-live-preview-restore.mjs restored
# pdf 驱动使用 office/preview-private-session.json；首次按本次目录布局运行。
node scripts/qa/review-live-pdf.mjs

# I/O 要求独立<=8MiB tmpfs，绝不能使用真实系统分区/真实 profile。
export QA_IO_VOLUME="$QA_PRIVATE/io-volume"
node scripts/qa/review-live-io.mjs enospc
node scripts/qa/review-live-io.mjs dual-fault
# 保持 config/runs-v2 0500、journal及旧run0400，真正重启 Main：
node scripts/qa/review-live-io.mjs reboot-still-faulted
# 恢复隔离目录0700、journal0600（原run可继续0400），再次真正重启：
node scripts/qa/review-live-io.mjs reboot-recovered
python3 scripts/qa/review-live-gates.py --out "$QA_PRIVATE/gates-final"
```

不能直接在仍运行的用户 provider/任务上注入。重启中的 old/new PID 和 chmod/kill 操作在 io-b95-final/restart-*.json；安全 tmpfs 初始 mount/strace 命令在 setup/io 原始记录。原子写 ENOSPC 的 native open 与 write=-28、EACCES .tmp、journal/index 路径、恢复 rename 都有独立原始 trace 哈希和公开选取记录。

## 5. 本地标准门禁与真实 GitHub CI

b95 干净生产源码的标准本地链 **22/22 命令 exit0**：冻结安装、typecheck、package boundaries、skin、Electron Main/Preload/Renderer 构建、聚焦、全仓、D2 当前 workflow 5 段、Baseline 7 段、batch 段。聚焦最初 84/84、328 expect，补纳本轮批量回归后 **87/87、334 expect、9 files**（独立23号命令）。全仓 **3892 pass / 5 skip / 0 fail，3897 tests / 445 files / 16150 expect**；batch **143/143、889 expect、13 files**。各段重叠，不相加冒充唯一测试总数。

| b95 workflow | 真实结果 |
| --- | --- |
| [PR CI #38597805963](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38597805963) | SUCCESS |
| [D2 Scoped Pi #38597806005](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38597806005) | SUCCESS |
| [Review Baseline #38597805953](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38597805953) | SUCCESS |
| [Review batch focused #38597805971](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38597805971) | SUCCESS |
| [D0.5 #38597805984](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38597805984)、[D1 #38597806052](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38597806052) | SUCCESS |
| [独立原风险 #38597799385](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/38597799385) | **FAILURE，原脚本 exit1** |

最终文档提交后还须按最终 HEAD 查询 CI，结果发布到 PR 最终评论；不借 b95 绿灯替代其他 HEAD。不改变失败 workflow 或 runner 路由来变绿。

### 并发整合后的最终本地门禁

保留远程7132新增两项Controller→Hook/迟到validity正式测试及新版workflow后，本地整合提交 `9cc92bb0e6cec8d2698f5d712a71ecc8b77256e4` 重新执行全套22步，全部exit0：**3894 pass / 5 skip / 0 fail，3899 tests / 445 files / 16161 expect；聚焦89/89、345 expect、9 files**，batch仍143/143。生产文件与实测b95无差异，因此这两个数值分别对应各自冻结测试集合，不互相覆盖。原风险再跑仍3PASS/1FAIL、exit1，见 records/original-risk-integrated。最终发布HEAD的标准CI与当前gate/legacy archive workflow仍在PR最终评论核对。

## 6. 证据、脱敏、SHA-256

证据目录：[p06-recheck-live-20261014](acceptance/p06-recheck-live-20261014/)。[evidence-manifest](acceptance/p06-recheck-live-20261014/evidence-manifest.json) 同时记录每个 **raw SHA-256 与脱敏 public SHA-256**、字节数和转换方式；[raw-inventory](acceptance/p06-recheck-live-20261014/raw-inventory.json) 记录仅留本机文件；[全文件SHA256SUMS](acceptance/p06-recheck-live-20261014/SHA256SUMS)覆盖公开证据及补充索引；[driver hashes](acceptance/p06-recheck-live-20261014/driver-sha256.json) 与 [source/build hashes](acceptance/p06-recheck-live-20261014/records/live-b95-final/source-build-sha256.json) 记录代码/构建产物。

没有上传 channels/device、密钥、SDK transcript 或私有绑定。UUID 与 assignment 做稳定别名化；原始 stdout/stderr 原样留私有目录。正式测试输出完整脱敏公开；Electron dev 全日志可能包含 SDK transcript，因此只公开明确标为 selected 的操作行，绝不把 selected 称为完整 raw。strace 使用 raw write 指针格式，不记录写入正文。截图全部来自合成资料，Office/PDF/文本预览只公布已采集的裁剪图，未经篡改。

**manifest SHA-256：`c7171e1fac10c0801ff43be51d36572a512135d35e55279add995ccf1c62b35d`**。

| 最终事实文件 | public SHA-256 |
| --- | --- |
| [e05-result.json](acceptance/p06-recheck-live-20261014/records/live-b95-final/e05-result.json) | `b439524ee80560a49c62cdb85cf68825ec2725fad42270ced8f771fcd0c6da65` |
| [races-results.json](acceptance/p06-recheck-live-20261014/records/live-b95-final/races-results.json) | `feeca643f52fe4ff697989cac820eced874b1b3f6f4d37a764963fe5b537815d` |
| [enospc-result.json](acceptance/p06-recheck-live-20261014/records/io-b95-final/enospc-result.json) | `c1313c154378df09b0bdbc46a36b927daaec81624a517d680cce591e9a5e4eb0` |
| [dual-fault-result.json](acceptance/p06-recheck-live-20261014/records/io-b95-final/dual-fault-result.json) | `a00bcbcfd5e6c844771b47d77567a70915c6cbadbe60891790e80663ea367f5e` |
| [reboot-still-faulted-result.json](acceptance/p06-recheck-live-20261014/records/io-b95-final/reboot-still-faulted-result.json) | `72c6fba6d2513da10d6f8b146ea9e0828396d3a75a478c8fda5a43d9e72619c0` |
| [reboot-recovered-result.json](acceptance/p06-recheck-live-20261014/records/io-b95-final/reboot-recovered-result.json) | `0d5834c8bbbac20073cfcdbc8720c59d48b9700d22065d524d1e715a1dfaf47c` |
| [selected-result-summary.json](acceptance/p06-recheck-live-20261014/records/live-b95-final/selected-result-summary.json) | `3a09f410d7e565e2bc62f19c1b60f77e9ad16763b97189164e3c015ac59f0cdc` |

关键截图：[E05 迟到交付后](acceptance/p06-recheck-live-20261014/screenshots/live-b95-final/e05-after-late-delivery.png)、[E03 pending](acceptance/p06-recheck-live-20261014/screenshots/live-b95-final/e03-stop-pending-busy.png)、[E04 迟到双 outcome](acceptance/p06-recheck-live-20261014/screenshots/live-b95-final/e04-after-late-complete-and-error.png)、[真实批次](acceptance/p06-recheck-live-20261014/screenshots/live-b95-final/e06-real-batch-three-cases.png)、[Office](acceptance/p06-recheck-live-20261014/screenshots/live-b95-final/office/e06-office-cropped.png)、[扫描 PDF](acceptance/p06-recheck-live-20261014/screenshots/live-b95-final/pdf-oopif/e06-scan-pdf-cropped.png)。权限 pending 截图是当时审核页，仅辅助记录页面可用；权限命中由真实 IPC/文件写入事实证明，不声称该图展示权限对话框。

## 7. 修改清单与剩余门禁

生产：agent-orchestrator.ts；review/{run-store-v2,review-agent-assignment,pi-case-review-service,review-pi-admission,v2-executor-factory}.ts；版本/lock/CHANGELOG 与 README/AGENTS 同步。新增正式测试 startup-io-recovery、orchestrator-permission-wiring、batch-case-fallback；原 background-reuse 测试新增同步双失写反例。新增 review-live-* 诊断/实机/采集/启动/清理/归档脚本。29/30/31 更新，新增45和独立证据目录；旧37/38/44及原风险检测未删改。

**下一步仅 `P06-RECHECK-LIVE-02`**，仍不进入 P07/P08：

| 未签收项 | 状态 / 缺失条件与证据 |
| --- | --- |
| 完整 E06 原批量 A/B/C | PARTIAL；需在同样独立 Pi 环境完成正式人工处置、补件回流、正向自动审批授权与幂等、成功/失败队列与账本一致；本次模型 C 未完成要可复验地重试，不放宽引用/工具提交门禁 |
| Claude runtime/provider | NOT-RUN；缺独立授权配置/运行环境。提供后从真实普通 create/list/meta/send/stop、Read/权限否决恢复、预览开始，记录真实 SDK/IPC、截图/退出码和 hash，不套用 Pi PASS |
| 严格审核扫描 PDF/原件/PNG、压缩 | NOT-RUN；普通预览已通过；仍需真实受控审核工具回执、模型视觉结果、材料覆盖/提交续审/压缩，不用 canvas 代替模型读图 |
| 双窗口/fork/自动 Tab 恢复/跨平台 | NOT-RUN；当前只有单 Linux Renderer 与普通会话真实跨进程恢复子集，需各平台设备/授权独立 profile、同样原始证据 |
| P05-RELAY-ROUTE-01 | BLOCKED；真实中心多 viewer/ticket 路由条件未提供；须按29既有协议双真实 viewer 路由/断线/回执验收 |
| P05-POCKET-FIFO-01 | PATCH READY / TARGET NOT-RUN；独立目标没有本项目授权与执行证据，不应用补丁或改状态 |
| P04-TECHDEBT-01 | OPEN；永久 ID-only tombstone 与 FIX-01 UUID journal 不做无安全证明 TTL/GC；容量、冷回填与性能风险保留 |
| 其他 LIVE 门禁 | 原状态保留；本轮仅以细项证据更新 LIVE-06/07/08 子集，删除案卷、模型停用、移动端和其他门禁未验 |

本次关闭了云端无法实际验证的 E05 及 E03/E04 可控真实环境子项、FIX-03 I/O 重启子项，修复四个新反例；**没有达到 P06 正式签收条件，PR 继续 Draft/Open/MERGE NO-GO。**
