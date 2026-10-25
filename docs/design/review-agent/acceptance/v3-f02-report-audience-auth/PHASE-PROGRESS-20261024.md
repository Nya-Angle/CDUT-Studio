# F02｜T08/F16 报告受众访问授权｜阶段与验证报告（2026-10-24）

## 0. 基线、问题与不越权边界

- 仓库：`Fuck-GH-Admin/cdut-studio-review-agent`。
- 独立分支：`fix/v3-f02-report-audience-authorization`。
- 固定开发基线：统一集成 Draft PR #265，`integration/v3-r02-pr246-249-250-20261024@7773de6afc9c4a16934076b8b5bdb61a2e8bc9a2`。
- 最终目标：普通申请人无法修改 Renderer IPC 参数读取审核人/组织者报告；合法校方角色必须经过可信 Main 会话、明确案卷范围与受众授权；历史快照和 F16 再导出不能绕开同一门禁。
- F01 #266 是 Agent 工具指派权限专项；F06 与两条 F07 工作轨道独立。本批不改写 Case/Plan/Run/Decision 真值，不修改模板定义，不合并其他 PR。

## 1. 原来错在哪里

`review-ipc.ts` 中 T08/F16 的五个接口仅调用 `assertC0ReviewMainSender(event)`：

1. 申请人可向 `GET_T08_REPORT_PREVIEW_V3` 或 `EXPORT_T08_REPORT_V3` 发送 `audience: 'reviewer'|'organizer'`，Main 只验证枚举，直接返回内部投影。
2. `LIST_T08_REPORT_ARCHIVES_V3` 返回全部历史档案的受众、路径和其他元数据；`GET_T08_REPORT_ARCHIVE_V3` / `EXPORT_T08_REPORT_ARCHIVE_V3` 通过已知 reportId 读/导历史内部内容，不重查受众权限。
3. Agent `review_export_report` 使用本地普通指派，默认归档审核人版；普通工作台快捷导出也硬编码审核人版。
4. 本地 `local-reviewer`、Renderer 自选受众、主窗口来源都不等同于经过学校核验的审核人/组织者身份，不能被用作内部报告权限。

## 2. 修改什么、为什么这样改

新增 `review-v3-t08-report-access.ts`：在 Main 报告入口外设置可复用的只读授权门禁，不变更报告的业务真值与加密/哈希格式。

### 2.1 受众与可信身份矩阵

| 调用主体 | 申请人版 | 审核人版 | 组织者版 |
| --- | --- | --- | --- |
| 由可信主窗口派生的本机未认证会话 | 允许本机工作区中的申请人投影 | 拒绝 | 拒绝 |
| Main 验证学校身份 + 本案 `report:read:student` | 允许 | 不自动获得 | 不自动获得 |
| Main 验证学校审核人/教师身份 + 本案 `report:read:reviewer` | 依显式授权 | 允许 | 拒绝 |
| Main 验证学校管理员身份 + 本案 `report:read:organizer` | 依显式授权 | 依显式授权 | 允许 |
| Renderer 传入 role/credential、Agent 本地指派、仅有 CAS 登录状态 | 不据此增加权限 | 拒绝 | 拒绝 |

安全判断要求 `principalId + sessionId + scope.caseIds + scope.actions`；内部受众还必须有 Main 已验证的 `source:'school'`、`assurance:'verified-school'`、`credentialReference` 及匹配角色。该 Principal 仅在 Main 内部传递，永不作为新 IPC 请求字段。

**重要限制**：当前集成 HEAD 尚无可信学校审核人/组织者 SchoolPort。本 PR 不伪造学校凭据、不把本地 reviewer 当学校 reviewer，故生产本地入口只能返回 `student` 能力。未来真实校方授权接入时必须由 Main 校验活跃会话、所属案卷和制度角色，再提供上述内部 Principal；不可从 Renderer、AI 或仅有 CAS 登录成功的布尔值造凭据。

### 2.2 五个输出入口全部覆盖

- 当前预览和导出：在读取/生成前按 `caseId + audience` 授权，禁止修改下拉参数升权；导出的 `createdBy` 由 Main Principal 派生，避免申请人归档被虚写为 `local-reviewer`。
- 历史列表：先验证有本案报告读取权，再按快照受众过滤。未获授权的内部归档及其路径、元数据、错误状态不会交给申请人。
- 历史读取和重导：先验证对当前案卷存在读取权限，再读取完整性校验后的不可变快照，**按快照原有 audience** 再授权；另存对话框、外部写文件和保存回执只能发生在授权后。
- 新增 `GET_T08_REPORT_AUDIENCES_V3`：只返回 Main 当前会话有权查看的选项，Renderer 下拉框不再提供自选内部身份；即使直接篡改 IPC 仍由 Main 独立拒绝。
- 旧普通候选工作台快捷导出和 Agent `review_export_report` 改为申请人投影。Agent 只在受控指派精确绑定案卷后才可归档，任何 Agent 角色声明均不能升级到学校内部受众。

## 3. 实际可复核的最小闭环

新增 BDD 行为测试：

1. 本机申请人/Agent 企图获得审核人或组织者版本 → `REPORT_ACCESS_DENIED`。
2. 仅宣称本地 reviewer / 伪造学校 role、缺凭据、错案卷、缺具体受众动作 → 拒绝。
3. Main 已验证的审核人只读本案 reviewer，学校管理员仅依具体动作访问 organizer；不因角色名称自动放行别案。
4. 三种受众历史快照同时存在时，申请人列表只包含 student；即使获知内部 reportId，也不能读取或重导；拒绝时不打开保存对话框，不产生本地保存回执。
5. 在真实 `registerReviewIpc` 合成 Electron 主窗口测试中，六个相关 IPC 均注册；Renderer 附加伪造 principal 不能提升权限；非主窗口来源拒绝。

固定运行环境：Bun 1.4.2，仓库 `bun.lock` 冻结依赖，TypeScript 5.9.3。

- `bun test review-v3-t08-ipc-authorization.test.ts review-v3-t08-report-access.test.ts review-v3-report-service.test.ts review-c0-ipc.test.ts`：**20 PASS / 0 FAIL，116 assertions**。
- `NODE_OPTIONS=--max-old-space-size=4096 bun run --filter='@profer/electron' typecheck`：**PASS**。
- `git diff --check`：**PASS**。
- 实际 Electron GUI、真实 CAS/学校角色、多账号混用设备、F01/F07 接入后的完整 F16 存取：**未执行**，不能从本次专项单测推断生产验收完成。

## 4. 未关闭风险与统一集成门槛

1. **可信学校身份来源未接线**：未来 SchoolPort 必须提供 Main 可验证、可撤销的登录会话、案例/组织权限、角色、凭据引用与时效；当前默认拒绝内部报告，不宣称已完成真实校方角色正向实机验收。
2. **本地单用户界限**：本地申请人版允许主窗口读取本机可访问案卷，但这不是账号级案卷所有权。在同机多账号或远程服务场景，必须在 Main 增加真实主体—案卷所有权验证，不能沿用本地设备范围推导跨账号权限。
3. **服务内部调用**：`review-v3-report-service.ts` 仍是低层 Main 内部快照/格式服务；新的 Renderer 与 Agent 入口均经 F02 授权门禁。后续如果新增 IPC 或 Agent 工具调用该低层服务，必须复用授权门禁，不允许直接暴露。
4. **F01 交叉文件**：Agent 工具 `pi-review-ops-tools.ts` 与 F01 #266 同时涉及，集成者应保留 F01 的轮次/指派/幂等修复，同时合入本 F02 的报告受众限权与精确案卷绑定。
5. **两条 F07**：本次核实 #264 及 `fix/v3-f07-recovery-legacy-isolation` 两轨道；由 F07 集成负责人去重裁决，F02 不修改它们。
6. 依仓库 `AGENTS.md`，功能改动需要同步 README/AGENTS，但修改它们须用户另外授权，本 PR 暂不改写，交由集成者按授权同步说明。

## 5. 交付状态

**CODED / PASS_SCOPED / DRAFT / PENDING_SCHOOL_IDENTITY_AND_GUI_ACCEPTANCE**。

本批关闭的是“本地未认证用户可通过 T08/F16 IPC 自选内部受众或复用历史报告越权读取”的当前可复现实质缺口；真实校方身份正向授权仍依赖未来可信 SchoolPort，因此不得标记 F02 生产放行。

## 6. GitHub 连接器交付记录

- [独立 Draft PR #270](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/pull/270)，head `fix/v3-f02-report-audience-authorization`，base **仅** `integration/v3-r02-pr246-249-250-20261024`；没有修改主线或三个原来源 PR。
- 本地完整测试提交 `ea2764d3823dd67e7cb09b07e597fac3f2a074e0`（父提交为集成基线 `7773de6...`）。
- GitHub 连接器发布的功能提交 `43b0e60c35f422d71e5b7b23f183d68e0171c526`，与本地测试功能树 SHA **完全相同**：`3c6d07d6bbdcd0848b422a709a51f615648df655`。十个文件的 Blob SHA 逐一一致；远端 Git commit 不等于本地 commit 是因为连接器重建了提交元数据。
- 远端 PR 状态：Open / Draft；复查 base/head 和 changed files 为 10。禁止自动合并。
- 本第 6 节为**功能树通过测试并创建 PR 之后**的文档追记；后续若形成纯文档提交，其 Git Tree 不再与上述已测试功能树相等，但不能改变功能源码已通过测试这一事实。
