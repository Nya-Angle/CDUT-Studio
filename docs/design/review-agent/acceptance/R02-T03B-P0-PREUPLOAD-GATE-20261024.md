# R02 T03-B｜P0 预接收/预上传门禁安全审计（2026-10-24）

## 0. 版本和权限边界

- Repo: `Fuck-GH-Admin/cdut-studio-review-agent`
- 独立分支：`fix/v3-r02/preupload-gate`；base：`feat/v3-r02-template-library`，检查时 HEAD `150acfe761cb7ad0424a2ca009fd57f12dbfddfd`。
- 已核对开放的 #246（`9ff6cc8`，路由/材料分类）、#247（`cba521d`，R02 收集候选）、#248（`4b2c5d5`，非官方模板发布保护）、#249（`59612a7`，单 Run/补件），本变更未把它们覆盖或合并。
- `C0-OWNERSHIP-MANIFEST.md`：`review-ipc.ts`、Case/Run/IPC 为 Dev-C 集成独占；B2 Source/Parser 为 Dev-B。此次属于**用户明示授权的共享安全集成任务**，在安全调用点增加拒止，不替换 B2 的候选账本，也不引入第二套 Case/Run。
- 本文件及代码不表示任何学校或有权机关已经批准本软件、部署位置、模型渠道、人员或敏感数据数字化处理。

## 1. 实际采用的拒止语义

`review-preupload-gate.ts` 位于 Main 模块。调用点必须在首次字节读取、原件复制、临时缓存、OCR、索引或模型/工具调用之前执行；异步解析与登记事务还需在提交前复核。

| 判定事实 | 允许逻辑 |
| --- | --- |
| 没有可信 Main 授权源；未知/拒绝/授权服务异常/过期 | **全部拒绝**，固定 `REVIEW_PREUPLOAD_DENIED` 静态线下说明 |
| `public/ordinary` | 须同时有 Main 证明的 `confirmed`、`local-controlled` 或 `approved-secure`、有效期限；仅本地处理放行，不自动允许联网模型 |
| `sensitive/classified` | 须有 Main 证明的 `confirmed` 和 `approved-secure`；本门禁仍禁止模型外发 |
| 模型出口 | 仅 `public/ordinary` 且独立授权了准确的 Main 配置目的地时可出站；否则拒绝 |
| Renderer 自报角色/授权/模板 criterion | 不参与信任决策，不能开闸 |

**当前生产组合没有安装任何可信授权源，所以默认所有真实 Review 案卷新建、导入与模型处理都会被阻断。** 这是在校方授权和获准环境未核实前的有意安全封锁；不应在 UI 加“我已获批准”复选框将它绕开。已有非敏感功能的正向测试由 `test/preload-electron-mock.ts` 在测试进程内安装明确标为**虚构公开材料**的假许可，生产未安装该许可。P0 负向测试则令其返回未知/抛错以验证拒止。

## 2. 已审查的敏感字节入口及门禁位置

| 入口和潜在字节动作 | 当前拦截位置（Main） | 拒止后触盘/出站事实 |
| --- | --- | --- |
| V3 Quick Intake、系统文件选择框、旧 Review 导入 | `review-ipc` 的 `CREATE_CASE`/`IMPORT_DOCUMENT`/`IMPORT_DOCUMENT_FROM_PATH`；`case-import` picker 和 path 服务 | 主进程不打开材料；没有受理案卷、source-docs、缩略图 |
| Drag/drop、直接 IPC 路径登记、开发入口 | `REGISTER_MATERIAL_PATH_V2`、`PICK_REGISTER_MATERIAL_V2`；`material-service.registerMaterial` 在 `stat/Docx/Excel/PDF` 前及 `copyAsset` 前 | 无原件复制、OCR/PDF 临时页图或 DocumentVersion 事务 |
| 文件夹 / ZIP 预览、解包、分案、重试 | `T06_PICK/COMMIT`、`buildT06SelectionFromPath`、`bytesOf`、`registerEntry`、`decodeReviewB2Zip` | 拒绝早于 hash、ZIP 解包、`/tmp/t06-*`、Case/Batch 写入 |
| B2 staged ZIP、archive vault、import ledger、恢复 | `stageReviewB2TrustedZip`、`ReviewB2StagingService.stage/read`、`ReviewB2ArchiveVault.saveAndStage/readVerified`、ledger writer、C Main 原件 picker | 无 staging Buffer 副本、归档 ZIP/checkpoint/ledger 文件或冷启动重放 |
| OCR、PDF/Office/PPTX 解析、候选预览 | `document-service.parseFileIntoSourceDocument`、`material-service`、B2 source-version parser、T02 staged OCR/preview、T02 visual OCR/PPTX reader | 拒绝早于文件读取、temp 写入、页光栅化和 OCR 引擎执行 |
| source index / 待后续 embedding 的文本 | `buildTextSourceIndex`、`buildSheetSourceIndex`、`saveSourceIndex` | 不建立 `source-index` 或其临时文件。当前 Review 模块未发现独立的 embedding 出站入口 |
| 已入库原件预览、原生候选桥接、恢复案卷 | `GET_IMAGE_PREVIEW_PATH`、`GET_WORKSPACE_DOCUMENT_PREVIEW_PATH`、`RESTORE_CASE_V3`、C11 Main local intake | 未授权不提供新的原件预览路径、不恢复业务受理状态 |
| 模型 prompt、OCR/metadata、多模态图像、Pi 审核工具 | `review-model-gateway.performChatCompletion`、`pi-review-agent-client.runPi`、`ai-review-service`、`run-async-service`、`pi-case-review-service`、后台 Pi bridge 和运行 IPC | 阻止当前 Review 专用请求/工具调用；测试中的出站 `fetch` 次数为 **0** |
| 离线 ZIP 回复 / 含附件的 IPC JSON | `T09_PREVIEW_REPLY`、`T09_IMPORT_REPLY`、附件 `registerAsset` 落盘回调 | 未授权不解析回复、不写临时附件、不视为补件受理 |

以上是具体接线点，不代表进程内其他**非 Review**的通用聊天附件、浏览器剪贴板或任意 Agent 工具也已经通过同等门禁。

## 3. T03-B 四个 P0 的逐项技术判定

| issue | 模板 | 风险 | 本次技术拒止证据 | 结论 |
| --- | --- | --- | --- | --- |
| T03B-001 | T03-T06 进展报告 | 规则执行前已把涉密研究进展写盘/OCR | `picker/drop` → `registerMaterial` 前门禁；DOCX/PDF 临时页与模型独立二次门禁；P0 测试 | **未授权入口已封锁**；真实获准环境尚待核验 |
| T03B-005 | T03-T07 结题验收 | 项目标识、成果与合同材料预先落盘 | `copyAsset`、T06 ZIP、B2 Vault、T02 parser/OCR 均拒绝；无 case/source-docs | **未授权入口已封锁**；历史已存数据不在本修复清理范围 |
| T03B-009 | T03-T09 涉密科研/定密 | 普通上传通道不应数字化受理 | 未安装学校授权源时默认全拒；Main 不接受 Renderer 伪造的 `schoolApproval`/actor；无数字受理案卷 | **技术拒止成立**；不构成定密权限或系统获批证明 |
| T03B-013 | T03-T10 合同履约/交付 | 保密条款下的合同、成果及佐证误出站 | 文件选择、ZIP、IPC 离线包、模型网关和 Pi 调用口门禁； `fetch=0` 负向断言 | **未授权入口已封锁**；真实合同类别判别仍需可信来源 |

注意：本次只确认“**未知/未授权时阻断**”的四项技术反例，**未验证任何学校已许可的数据处理正向场景**。不能据此把制度证明、数据分类能力或生产上线 P0 标为 PASS。

## 4. 测试、构建与字节泄漏证据

使用测试专用字符串 `SYNTHETIC_TEST_ONLY_DO_NOT_SEND_OR_COPY`，不使用真实敏感材料。

1. `bun test --isolate apps/electron/src/main/lib/review/review-preupload-gate.p0.test.ts`：**8 pass / 0 fail**；涵盖默认未知、服务异常、拖入/选择、ZIP、伪造 IPC、B2 恢复、OCR/解析、索引、模型网络零调用和 Pi SDK/query 零执行。
2. T06、B2 checkpoint、native Case、P0 四文件联合：之前执行 **45 pass / 0 fail**（当时 P0 为 7 项，后新增 Pi 测试独立通过）。
3. Review IPC path、T02 视觉、B2 staging/source/ZIP、文档解析、模型网关、索引、Pi client 十文件联合：**77 pass / 0 fail**。
4. 核对共 **123 项不同的定向测试**（联合组的 7 项 P0 不重复计入，另加新增的第 8 项），0 fail。P0 单测断言拒止后 `review-cases`/ZIP checkpoint/index 目录不存在；伪造授权的 IPC handler 不调用选择/预览；OCR fake engine 调用 0，模型 fake `fetch` 调用 0，Pi fake SDK/query 调用 0。源测试文件是只用于生成负向输入的模拟文件，原样留在测试沙箱直至测试清理；这不等于现实中外部原件原先不存在于用户磁盘。
5. `bun build` 对 Main IPC、Pi bridge、run async、Pi model client、C11 Main intake 五入口：**成功**，368 modules bundled。
6. `bun run --filter='@profer/electron' typecheck`：**未通过/未完成**。默认 Node 堆上限发生 OOM（exit 134）；提高堆到 6144 MB 后宿主终止（exit 137）。这不是 TypeScript 报错的证据，也不能声明类型检查通过；需在内存充足的 CI/开发机复核。

## 5. 剩余风险 / 发布阻断

1. **学校授权与分类入口未接线。** 当前全部真实 Review 新建/导入/运行被拒绝；需要有权部门确认机构授权、涉密等级/类别、批准系统/处理环境、离线/外发范围、有效期，再由 Main 集成 Owner 提供不可由 Renderer 伪造的可撤销授权源，按文件/案卷上下文核验。
2. **旧存量数据**：本 PR 不删除、迁移或重新加密已有案卷、缓存、缩略图、历史日志、Pi transcript。应由部署负责人进行存量隔离和独立审计；不能把新门禁当作追溯清除证明。
3. **非 Review 通道**：通用聊天附件、通用剪贴板预览、普通 Pi 工作区文件工具并非此合同专属入口。需要应用级敏感会话隔离和 egress 管控；不能声称全 App 的所有出站都经过 Review 模型网关。
4. **授权正向案例未获得真实证据**。纯函数允许策略只是未来接线的接口，不验证校方许可真实性、机器隔离能力或源文件分类。敏感/涉密数据仍严禁通过普通联网模型。
5. **交叉 PR 集成**：#246/#249 改动了 `review-ipc.ts`、`material-service.ts` 和相关业务函数。最终集成时必须保留本门禁的所有前置断言，新增路由/重新分类路径需要补同类负向测试；本分支不合并别人的 PR。
6. **TypeScript 全量检查待补**。此次只做了可运行负向测试与 Main bundling；内存充足环境的类型检查仍是合并条件。

**发布裁决**：`P0 未授权字节阻断 = 已实现并有负向证据`；`获准环境的可用正向处理 = BLOCKED_AUTHORITY`；`生产放行 = NO`。不得将此报告理解成四项已取得校方业务授权或全部链路可用。
