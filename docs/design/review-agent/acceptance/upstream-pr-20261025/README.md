# 审核模块上游 PR 验证记录（2026-10-25）

已验证的业务源码提交：`cbf14a30280f752cc2d2e038d1897ff0ff47f8fc`。目标 Nya `main`：`d20e4454ddbe839ec27f8b8c71a2454e58d6b35f`。
本记录及后续审核 CI 接线提交不改变已验证业务源码。

## 合并与改动范围

- 当前上游 `main` 是候选分支的祖先；`git merge-tree --write-tree upstream/main HEAD` 无冲突，结果与候选树 `3507eb497a1392433b021141ace20b21ae2eca31` 相同。
- 逐项核对上游最近 15 个提交与审核集成共同修改的文件。清除欢迎页无效残留、恢复普通 Agent 的上游权限参数路径后，共 12 个共享文件仍有审核接线变更；未删除上游新增的非空代码行。
- CSLab 主进程、CDUT Science 界面、`packages/core` 和 `assets` 均与上游字节一致；没有删除上游文件或改变文件类型。
- 共享 Agent、IPC、远程和飞书变更用于审核私有会话隔离、受控审核工具和读取记录；普通会话的正向行为由全量及 P05 回归覆盖。
- 依赖保留上游版本，仅增加审核解析使用的显式 `xlsx` 和 `mammoth` 声明。
- 保留已有 CHANGELOG 历史，新增与现有应用版本 `0.15.158` 一致的审核集成条目，修复版本门禁。
- 原工作区两个仅执行权限变化未纳入 PR。候选从独立工作树准备；凭据模式扫描无匹配。

## 本地 CI 复现结果

| 检查 | 结果 |
| --- | --- |
| Bun 1.4.2 冻结依赖安装 | PASS |
| workspace typecheck | PASS |
| package boundaries / skin contract | PASS |
| Electron main / preload / renderer / resources 构建 | PASS |
| 全量单元与回归 | 6161 PASS / 29 SKIP / 0 FAIL / 0 ERROR，730 文件 |
| 审核专项工作流原定 Bun 1.4.0 测试 | 304 PASS / 0 FAIL，28 文件 |
| V3 实际 Electron GUI | 6 / 6 PASS |
| 批量审核实际 Electron GUI | 6 / 6 PASS |
| workflow YAML / QA 脚本语法 / diff whitespace | PASS |

全量命令与 `.github/workflows/ci.yml` 一致：`bun install --frozen-lockfile`、`bun run typecheck`、`bun run check:boundaries`、Electron 皮肤契约与三段构建、`bun test --isolate --timeout 30000`。29 个跳过项为既有平台或外部夹具条件。材料处理提醒的旧断言按用户要求同步为“提醒但不阻断”；真实原件、活动指派、出处与读取覆盖检查继续保留。

两条 GUI 工作流使用独立合成配置、Xvfb 与真实 Electron。V3 验证真实系统文件选择器、导入字节 SHA、Main 材料目录、人工来源事项及历史案卷；没有真实运行时不会伪造报告。批量流程验证重新排队历史、越界请求拒绝、授权与定稿失败反馈，以及缺模型渠道时的真实失败状态。它们不声称完成真实模型或学校审批验证。

恢复批量 CI 引用但漏入集成的两份 QA 脚本；验收导航适配当前上游专区卡片、公告/教程和审核高级开关。仅 QA 启动采用 basic password store 并关闭 portal，避免桌面密钥环提示阻塞合成验收。

## 证据

- [结构化验证结果](verification.json)
- [V3 Electron 结果](v3-electron-results.json)
- [批量 Electron 结果](batch-electron-results.json)

托管 CI 状态以 PR 的 GitHub checks 为准；本记录描述发布前的本地工作流复现。

增量空白检查范围为本轮 CI 修复 `8e2cd9c04..HEAD`。历史冻结原件中的 Markdown 双空格换行、原始文件末尾和补丁上下文保持原样，以保留来源字节及哈希；它们不属于 PR CI 的失败项。

GitHub API 确认上游通用 `PR CI` 状态为 `disabled_manually`。审核专属 Baseline 工作流已补齐上述全量检查并固定 Bun 1.4.2，使审核 PR 在托管环境实际执行完整验证；上游通用工作流启停设置保持原状。
