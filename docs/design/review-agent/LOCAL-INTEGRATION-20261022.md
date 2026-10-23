# 审核模块本地整理（2026-10-22）

本轮仅整理本地分支，没有推送、发布或更新远端 PR。

## 基线与历史

- 上游：`https://github.com/Nya-Angle/CDUT-Studio.git`，`main`，`17a7e569f`。
- 原审核状态：`7b6cdc843`，保存在本地 `backup/review-before-cleanup-20261022`；原 `feat/review-v3-m1` 分支也保留。
- 整理分支：`clean/review-only-20261022`，直接从最新上游迁入审核增量，不合并原分支的历史提交。

## 保留范围

保留审核服务、界面、共享契约、固定测试数据，以及审核运行所需的 IPC、Pi 工具、会话隔离、文件访问和解析接线。公共文件的改动用于承接审核能力。保留现有的审核模板结构，不新增存储或执行内核。

50 套模板的目录、workspace、manifest 和关联 selection 是实际运行输入，当前仍位于 `acceptance/d4-*` 路径。加载器校验原始 Git blob，本轮保留其字节，不将它们作为历史产物删除。`C0-SCHEMA-FIXTURES` 和 `fixtures` 同样是测试输入。

未迁入旧运行回执、截图、日志、研究交接台账、旧 UI 验收驱动及其工作流；完整内容可从备份分支查阅。遗留未跟踪的 E2E 配置与生成材料已移出仓库保存。速课堂按钮、关于页、全局异常兜底、无关测试修补、文件执行权限和通用版本历史不随审核迁入。上游原有文件与发布记录保留。

保留的 P06 驱动仅供手动复验，测试凭据通过 `REVIEW_QA_USERNAME`、`REVIEW_QA_PASSWORD` 提供，不再读取历史报告中的账号表。其静态合同测试不代表执行过 Electron 或真实模型验收。

## 本轮验证

- 审核模块及变更涉及的公共接线测试：**1679 pass / 0 fail，215 个文件**。
- `bun run check:boundaries`：通过。
- `bun run typecheck`：8 个 workspace 通过；Electron 仅有上游已有的 3 处错误，位于 `src/main/lib/cslab/cslab-scientific-tools.test.ts:73、95、113`，涉及工具函数参数和提示上下文字段。
- 在独立的纯上游工作树运行同一类型检查，复现相同的 3 处错误；本轮未修改 CDUT Science 代码。

本轮未执行打包和真实模型/界面验收；此前验收结论不因本次整理而升级。详细命令、原始补丁和日志保存在仓库外的 `../audit/review-cleanup-20261022/`。
