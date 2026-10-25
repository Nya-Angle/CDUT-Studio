# L2｜十条线的共享入口现状与缺口

**基线**：`main` @ `5fc6dd846`。preload 共暴露 **102** 个 review 通道。

## 已可直接复用的入口（按线）

| 线 | 可用入口 | 说明 |
|---|---|---|
| T01 模板作者 / 规则编排 | `LIST_TEMPLATES`、`GET_TEMPLATE_V2`、`PUBLISH`、`AUTHOR_SAVE_LOCAL_V3`、`AUTHOR_READ_LATEST_V3`、`AUTHOR_PREVIEW_LOCAL_V3`、`AUTHOR_FREEZE_LOCAL_V3` | 正式草稿（`saveDraft`/`publish`）与 B1 候选作者态（candidate-held）两条通路都在 |
| T02 解析 / OCR / 材料来源 | `IMPORT_DOCUMENT`、`IMPORT_DOCUMENT_FROM_PATH`、`IMPORT_DOCUMENT_PROGRESS`、`REGISTER_MATERIAL_PATH_V2`、`PICK_REGISTER_MATERIAL_V2`、`GET_IMAGE_PREVIEW_PATH` | 拖拽与文件选择共用原生材料服务；单页图像核验有预览路径 |
| T03 事实提取 / 多证归属 / 纠错 | `GET_RUN_OBSERVATIONS_V2`、`CORRECT_OBSERVATION_V2`、`UPDATE_FIELDS_V2` | 更正必须带 reason（A05 铁律）已在服务层强制 |
| T04 规则编译 / 评分 | `PUBLISH`、`LOCAL_D4_ATTACH_PLAN_V3`、`LOCAL_B1_ATTACH_PLAN_V3`、`UPGRADE_CANONICAL_PLAN_V3`、`CAST_RATING_V2` | 编译在 Plan 绑定内部完成；评分只到「记录评分」层 |
| T05 补件 / 决定 / 申诉 / 复审 | `OPEN_WORKSPACE_SUPPLEMENT_V2`、`RESPOND_SUPPLEMENT_V2`、`RESOLVE_SUPPLEMENT_V2`、`RECORD_STAGE_DECISION_V2`、`DECIDE_WORKSPACE_CASE_V2`、`RECORD_WORKSPACE_SUBJECT_ADJUDICATION_V2`、`RECORD_WORKSPACE_DISPOSITION_V2` | 决定路径对 D2/CanonicalPlan 案卷按设计拒绝（`AGENT_DECISION_DISABLED`），不得解除 |
| T06 批量分案 / 队列 | `CREATE_BATCH_V2`、`GET_BATCH_V2`、`LIST_BATCHES_V2`、`RUN_BATCH_V2`、`BATCH_ACTION_V2`、`BATCH_AUTO_PROCESS_V2`、`BATCH_GROUP_PREVIEW_V2`、`BATCH_GROUP_APPLY_V2` | 队列执行走 `batch-store` + `run-async-service` |
| T07 评委分配 / 评分 / 排名 | `ASSIGNMENT_CREATE_V2`、`ASSIGNMENT_LIST_V2`、`ASSIGNMENT_REVOKE_V2`、`CAST_RATING_V2` | **注意**：现有 `ASSIGNMENT_*` 是「审核操作可信指派」（写权限来源），不是评委分配；排名无入口 |
| T08 助手 / 来源导航 / 报告 | `ASSISTANT_CHAT`、`EXPORT_REPORT_V2`、`EXPORT_REPORT`、`CASE_TIMELINE_V2` | 来源导航目前只有 `GET_IMAGE_PREVIEW_PATH` + 文档预览路径，无块级跳转入口 |
| T09 离线回件 / 评分包 / 适配器 | 无 IPC | `offline-roundtrip.ts`、`review-import-checkpoint-v3-b2.ts`、`review-import-handoff-v3-b2` 均为 **Main 内部能力**，未对外暴露 |
| T10 统一工作台 / 角色页 / 导航 | 无 IPC | 纯渲染层职责；现有 `activeViewAtom` 只有 `conversations / planning / agent-skills / cdut-zone / cdut-science`，`content-review` 挂在 cdut-zone 子视图 `material-review` |

## 明确缺口（等待各线给最小签名，不提前创建）

1. **T07 评委维度**：缺「评委分配 / 评分 / 排名」实体与通道。现有 `ASSIGNMENT_*` 语义不同，不能复用。
2. **T08 来源导航**：缺「按 check → 材料块」的块级定位通道；当前只有图像预览路径。
3. **T09 离线包**：底层能力已在 Main，缺对外通道（需先定离线包格式与授权边界）。
4. **T03 事实→检查的显式绑定**：`CORRECT_OBSERVATION_V2` 有，但「多证归属」缺少把 observation 关联到具体 check 的通道。
5. **A 轨技术执行编排**：`review-v3-main-local-execution-orchestrator.ts` 无入口（见 L0），归功能线决定是否暴露。

## 原则

- 已有接口直接复用，不重复造。
- 缺口不提前实现，等对应功能线给出最小签名后由本线补桥接。
- 不新增业务语义、不改正式决定权限、不引入新的核心数据模型。
