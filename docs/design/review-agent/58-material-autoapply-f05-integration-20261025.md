# 58｜材料自动应用 + F05 恢复整合记录（2026-10-25）

## 来源与目标

- 目标：`integration/v3-f01-f07-local-preserve-20261025`，合并前 `474d170cb`。
- 源：`origin/integration/material-auto-apply-review-f05-20261025`，HEAD `54a203e6f91165c98b1ff488fccf532e82654007`。
- 共同基线：`2ab7f3aa32bd5481d85c8e457df2866afc16bcea`。
- 合并方式：`git merge --no-ff`（目标有独有文档提交，不能 fast-forward）；**无冲突**，合并提交 `1de8a0494`，合并树 `561438a1962ff66d77a2ac194e9e9219e4d6f9f3`，与隔离演练树逐字节一致。
- 版本：Electron `0.15.169 → 0.15.171`、shared `0.1.77 → 0.1.78`（随源分支保留，未降级、未新增依赖；`bun.lock` 仅同步 workspace 版本）。

## 合入内容

- 自动分类落案：上传先登记真实 `attachment`，C Main 本地规则高置信直接 CAS 写角色/兼容槽；难例后台限并发 2 走既有本地 OCR，仍不明确才发一次短模型请求；模板变更后重检未绑槽材料；人工改类/换版/冻结计划为不可覆盖栅栏。
- 57 槽位绑定修复：`获奖证书 ↔ 荣誉证书` 等同义词、兼容角色/格式槽预过滤、角色已定时后台短模型只补槽不改类。
- F05 恢复：D2 冻结下改类仍撤回旧计划并留历史，但可从同源受控 D4 候选重新编译、校验指纹与当前原件后重新绑定；B1/F06 与正式 CanonicalPlan 不自动恢复。
- Pi 完整读取门禁：可读文本未完整读取时同一轮次继续补读；扫描件/解析失败不要求虚构文本块。
- 证明材料事实投影：按当前 Observation/Run/SourceRef 显示“已确认/待核实”，排除撤销/跨案/旧 parseRevision/退役版本。
- 删除 Renderer `MaterialClassificationSuggestions.tsx` 与挂载；自动调度收敛到 Main，避免双重请求。模板匹配页默认收起、底部“高级选项”Switch 单入口、设置页仅模型设置、D4 checkbox 已删、旧“未提取事实”徽标已删，均保留。

## 本轮真实验证（隔离合并树 = 最终合并树）

命令与完整输出见 `R/merge-autoapply-f05-20261025/tests.log`、`typecheck-checks.log`。

| 检查 | 结果 |
| --- | --- |
| 57 指定 4 文件（classifier / material-auto-classification / material-classification-ai / material-auto-to-rerun.journey） | **29 pass / 0 fail / 133 expect** |
| F05-remediation / D4-local-plan / review-material-facts / OCR / native-case-material-slot | **25 pass / 0 fail / 164 expect** |
| shared + Electron `tsc --noEmit` | 均 exit 0 |
| `check-boundaries` / `git diff --check` | PASS |
| merge-tree / 实际 merge | 0 冲突；树 `561438a1` 一致 |

已知非本轮回归：`pi-case-review-service.test.ts` 两个 preupload 授权断言在合并前目标 `474d170cb` 与合并树上**同样失败**（测试期望 `PROFER_REVIEW_TEST_PREUPLOAD_BLOCK` 抛错，当前 gate 只提醒不抛错）。未删除 guard、未改测试凑绿；属独立授权合同待裁决。`pi-document-coverage.test.ts` 15 项全部通过。

## 未完成/边界

- 未做 GUI 自动验收：模板匹配默认收起、底部 Switch、拖动、自动分类刷新、F05 恢复提示均由用户自测。
- 未做真实模型质量、真实多页扫描件全页 OCR、真实用户材料整批验收；服务级 PASS 不等于生产放行。
- 非 D4 的 B1/F06 计划不能自动恢复；正式 CanonicalPlan 仍须有权发布者升版。
- 用户桌面未由本轮重启；Main/preload 变更需重启后生效，renderer 可走 Vite 热更新。

## 状态

- 推送：`integration/v3-f01-f07-local-preserve-20261025`（未 force、未合 main）。
- 详细门禁与 push/remote 一致性见 `R/merge-autoapply-f05-20261025/DONE.json`。

## 追补（2026-10-25）：短模型超时与强文件名线索

- 两路短模型请求（角色不确定、固定角色补槽）超时由 4 秒统一为 30 秒常量；不重试、不提高并发，失败仍保留原件当前分类，模型输出兼容槽/当前分类栅栏不变。
- 共享 `material-classifier` 增加窄范围强文件名线索，并把 `needs-ocr` 判定改为“无正文且无明确文件名线索”；仅明确名称可先定角色，正文事实仍需 OCR/阅读。
- 本机样本 25 份仅 3 份本地高置信、22 次 4 秒超时的现状见 [53](53-open-issues-and-plan-recovery-20261025.md) 追补；未做真实材料写回或 GUI 验证。

### 追补（2026-10-25）：分类重试边界

- `withSingleTransientRetry` 只包裹两处 `suggestMaterialWithAi`（角色兜底、固定角色补槽）：瞬时失败再试一次（约 1 秒），第二次失败即放弃并保留原件分类。
- 不重试 4xx/门禁/取消/无效 JSON；不改变 30 秒单次超时与并发 2；网关 429 自带重试与外层一次重试叠加仍为有限次数。
