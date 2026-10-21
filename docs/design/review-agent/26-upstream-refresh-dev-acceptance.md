# 26｜上游增量同步与本地 dev 复验

> 2026-10-11；目标是测试仓库 `Fuck-GH-Admin/cdut-studio-review-agent/main`。按使用者要求检查上游、合并增量、实际启动 dev，再推送并监控 CI；不向上游提交 PR。

## 1. 上游确实存在超前提交

- 同步前我方主线：`a3305d4c77ab5dddef6c6159d5d5035b1bfe9dc0`。
- 上游最新主线：`f2c7347de97465351cf3c39b8f37670336a40606`。
- `git rev-list --left-right --count mine/main...origin/main` 为 `336 / 2`：我方有自身研发历史，上游有 **2 个我方尚未包含的提交**。
- 增量为 `ed002ae7`（成理照片蒙版、Pi 空闲态压缩）及 `f2c7347d`（项目说明更新）。使用双父合并保留双方历史。

## 2. 冲突与审核策略

唯一代码冲突在 `pi-agent-adapter.ts`：我方原来开启审核专用原生自动压缩，上游改为统一关闭原生自动入口，任务完成后在空闲态按阈值执行。

整合后采用上游的新时机，保留我方已有的审核策略：

- 等待 `session.isIdle`，任务进行中不触发自动压缩。
- 审核的保留 token 数仍按约 70% 阈值计算；普通会话使用原共享阈值。
- 审核运行账本的压缩扩展保留，空闲压缩也传入审核专用摘要指令；账本扩展失败时仍可通过该指令保护案卷/规则版本、证据、已提交与未完成检查的边界。
- 压缩失败不把已完成任务转为失败；审核写事务的自动重试限制保留。
- 新增 `pi-idle-compaction.test.ts`，覆盖有效 usage 回溯、等待空闲、审核指令、阈值与失败处理四项行为。

Electron patch 升至 `0.15.153`，CHANGELOG 与锁文件元数据对齐；shared/core 本轮没有改源码或版本。README、AGENTS 与交接入口已同步。

## 3. 本地环境修复

原工作区残留了一套旧 workspace `node_modules`：根目录与 Electron 子目录分别解析到两份 Electron，导致单独 IPC 用例报 `safeStorage` 导出缺失。旧生成目录已备份到 `.workdir/dev-deps-backup-20261011`，按现有 hoisted 配置执行冻结锁文件的强制重装，未改变依赖版本。复跑后专项全部通过。

测试启动参数助手最初指向重装后尚未准备的 Electron 二进制；补齐该已锁定版本的二进制后，实际 dev 正常运行。它属于本机依赖/测试启动准备，没有通过修改业务源码或删掉断言隐藏失败。

## 4. 实际 dev 与桌面操作

在原项目目录 `/home/miku/Bot/CDUTStudio/CDUT-Studio` 实际执行 `bun run dev`，由原脚本启动 Vite、main/preload watcher 和 Electron。Linux 使用 Xvfb；配置、userData 与案卷全部隔离，仅使用文档内置演示账户和合成材料。

```bash
xvfb-run -a -s '-screen 0 1600x1000x24' env \
  PROFER_DEV=1 PROFER_DEV_INSTANCE=review-dev-refresh PROFER_VITE_PORT=5176 \
  PROFER_CONFIG_DIR=/tmp/batch-premerge-qa-dev-refresh-20261011/config \
  PROFER_USER_DATA_DIR=/tmp/batch-premerge-qa-dev-refresh-20261011/user-data \
  ELECTRON_OVERRIDE_DIST_PATH=/tmp/batch-premerge-qa-dev-refresh-20261011/electron-dist \
  bun run dev
```

临时 Electron 启动器仅为此隔离测试追加 `--no-sandbox`、`--disable-gpu` 与本机 CDP 端口；未替换应用逻辑。`ELECTRON_OVERRIDE_DIST_PATH` 是 Electron 的[开发启动路径设置](https://www.electronjs.org/docs/latest/api/environment-variables#electron_override_dist_path)。这些容器测试参数没有写入产品默认启动脚本。

| 桌面操作 | 结果 |
| --- | --- |
| 演示登录 → CDUT 专区 → 材料审核 → 批次管理 | PASS；不依赖真实 CAS，凭据未落盘 |
| 原非法 V2 caseId 请求 | PASS；被拒止，配置目录外没有测试路径 |
| 补件重新入队的当前建议与历史回执 | PASS；显示本轮待审核，旧退回独立显示为历史 |
| 未开启全局代批时启用自动通过 | PASS；拒绝原因可读，没有 IPC transport 前缀 |
| 未完成批次定稿 | PASS；明确拒绝 |
| 未配置模型渠道执行队列 | PASS；持久化真实缺模型原因，提示完成 0、失败 1、待人工 0 |
| 上游照片开关（仅合成演示头像） | PASS；默认蒙版，点击移除，再次点击恢复 |

现有审核回放 **6/6** 通过；照片开关额外 **1/1** 通过。截图已查看，dev 进程在回放期间保持运行。核验结束后关闭本轮测试进程。

## 5. 工程检查与 CI

| 检查 | 结果 |
| --- | --- |
| 全仓 `bun run typecheck` | PASS |
| 四文件专项 | **22 pass / 0 fail** |
| 全量 `bun test --isolate --timeout 30000` | **3710 pass / 5 skip / 0 fail**；422 文件 |
| `bun run check:boundaries` | PASS |
| Electron `check:skin-contract` | PASS |
| 原 `dev` 的 main/preload/resources 与 Vite 页面 | PASS |

本轮测试仍是离线合成数据，没有完成真实模型成功审读、校方角色/SchoolPort 或原生安装包验收。工程日志、六项审核 JSON、照片开关 JSON 和截图保留在 `/tmp/batch-premerge-qa-dev-refresh-20261011/artifacts`。

提交前重新核对双方主线。推送到我方 main 会触发[主线 CI](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/workflows/ci.yml)，跟踪该合并提交的类型、边界、皮肤、完整构建与全量回归；若失败继续修复并推送。历史提交成功记录不代替本次提交结果。
