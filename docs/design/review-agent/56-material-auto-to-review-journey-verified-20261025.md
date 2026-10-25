# 自动分类 → 审核 → 人工改类 → 重审：合并后贯通验证（2026-10-25）

基线：`integration/material-auto-apply-review-f05-20261025`，其包含 2ab 基线自动分类、材料纠错与 F05 计划修复的统一集成。本文专门验证这些合并内容**能否连起来使用**，不代表真实模型质量评测，也不把静态检查等同于 Electron GUI 实机验收。

## 本轮结论

新增 `apps/electron/src/main/lib/review/material-auto-to-rerun.journey.test.ts`，使用真实 V2/C Main 案卷和材料登记事务、自动分类写入、模板选择、Pi 工具读取、Run 持久化、人工纠错、旧 Run 过期判定与新 Run 启动。**3 条贯通场景、52 项断言，通过 3/3。**

| 场景 | 真正执行的顺序 | 结果 |
| --- | --- | --- |
| A. 普通发布模板 | `attachment` 原件上传 → 本地高置信自动写为 `evidence` → B3 倒计时后首选模板 → Main 模板设置 → 重新绑定材料槽 → Pi `review_read_documents`、`review_submit_result` → F05 改为 `application` → 旧 Run 失效 → 新 Pi Run | **通过**；保留同一原件版本，旧 Run 不能冒充新输入 |
| B. 冻结正式计划 | 原件自动分类 → 已发布模板执行 Pi → 测试种入已冻结的 CanonicalPlan → 用户精确确认撤回并人工改类 → 旧计划存历史 → 再选模板 → Pi 新 Run | **通过**；正式计划用测试专用指纹构造，**不声称**真实服务发布了新校方计划 |
| C. 真实 D4 技术计划 | 原件自动分类 → 从仓库真实 D4 目录、workspace 与选择数据固定 D2 技术计划 → `preparePiReviewRunV2` → Pi 阅读材料 → 结束本轮 → F05 人工改类并撤销旧计划 → 从原 D4 来源重新编译 → 校验新 D2 → 启动新 Pi Run | **通过**；这是与当前合并修复最直接相关的一条 |

实际命令：

```bash
bun test apps/electron/src/main/lib/review/material-auto-to-rerun.journey.test.ts
```

结果：`3 pass, 0 fail, 52 expect()`。

入口接线复查：`review-ipc.ts` 的 `REGISTER_MATERIAL_PATH_V2` 在 `attachment` 登记后调用 `classifyNewNativeWorkspaceMaterial`；`MATERIAL_AUTO_CLASSIFIED` 事件触发 Renderer 刷新；`ReviewV3CaseTaskView` 在 Main 给出的 `default-selected` 后调用真实 `attachD4TechnicalPlanV3`；`ReviewMaterialControls` 的计划内纠错使用 F05 提案及执行 API，重建由 `review-ipc.ts` 调用 `recoverD4PlanAfterRemediation`。这些入口已核对源码；本测试仍是**主进程服务级贯通测试**，没有假称模拟了真实用户鼠标和 Electron 页面。

## 未纳入本轮、但需要准确区分的边界

1. OCR 前三页抽样只用于快速分类，本轮未修改 OCR，也未做真实多页扫描件识别的验收。不要据此推出“正式审核必然全页读完”。
2. 发现一个较小的识别边界：文件名为“获奖证书”、模板槽位名为“荣誉证书”时，机器可把角色归为 `evidence`，但**不一定自动绑定到 `award` 槽**；换成明确命中“荣誉证书”时可绑定。属于关键词/语义槽位匹配不足，不影响本轮“有明确命中时整个审核及纠错重跑是否接得上”的通过结论。
3. 此测试使用实际 Pi 工具定义执行读取与结果提交，但没有联网调用大模型，也没有 Electron GUI 实机点击；真实模型的判断正确率和 UI 交互速度不在这 52 项断言内。
4. 并行跑旧回归时，`pi-case-review-service.test.ts` 两个测试、`review-v3-main-local-product-intake-model.test.ts` 一个测试的测试授权开关断言失败；它们与本次主链执行未产生冲突，但**不能报告全仓绿灯**。后续单独归因，不在本轮扩展到用户不关心的授权机制。

## 验收判断

本轮两个高优先级操作——**人工改类后继续开展新审核**、**计划已冻结时纠错并重建审核链**——在合并代码的主进程真实存储和 Pi 工具路径下已经贯通。范围限制是 UI 实机、模型真实调用与 OCR 全页准确率尚未纳入，不应将“服务级通过”写成“上线实机完全通过”。
