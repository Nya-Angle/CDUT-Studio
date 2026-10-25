# 内容合规审查（Review V3）—— 上游 PR 说明

**目标分支**：`Nya-Angle/CDUT-Studio:main`
**来源**：`Fuck-GH-Admin/cdut-studio-review-agent:main`
**基线**：已合并上游 `c406c2af3`（CDUT Science 首版 + Better）

---

## 一、这个 PR 带来什么

在 CDUT Studio 内新增一个**本地内容合规审查模块**，覆盖"材料进 → 规则判 → 人决定 → 出报告"的完整闭环，全部在本地完成，不依赖校园 API，也不需要学校账号即可试用。

### 1. 用户可见的功能

| 能力 | 说明 |
|---|---|
| 审核专区 | 三栏联动：材料 / 检查 / 办理，与现有 CDUT 专区风格一致 |
| 案卷办理 | 从已发布模板建案、填写字段、上传原件、逐项提交事项 |
| 按模板规则检查 | 把已发布模板编译成冻结计划，产出可解释的检查结果（符合 / 不符合 / 待补件 / 待确认 / 不适用 / 未执行 / 执行失败） |
| 两段业务决定 | 初审 → 终审，两次决定都绑定**同一个真实运行**；身份不符会被拒绝 |
| 补件周期 | 材料不足 → 开补件 → 回复 → 判定是否满足；满足后产生**新运行**，旧运行结论不变 |
| 批次与评委 | 批次工作清单、评分轮次、多评委独立评分、回避、排名、定稿 |
| 报告导出 | 从真实案卷状态生成 Markdown 报告 |
| 离线任务包 | 导出 / 导入离线往返包，供无网络环境审核 |
| 模板创作 | 模板编辑器、数值规则、示例包、可编辑草稿与发布流程 |

### 2. 架构约束（本模块刻意坚持的）

- **单一权威**：`CaseAggregateV2`（`state.v2.json` + `expectedRevision` CAS）是案卷唯一写入源；`ReviewRunV2` 是运行唯一写入源；不存在第二套 Case/Run/Plan 存储。
- **冻结计划**：模板一旦发布，其可执行计划被编译并冻结；运行记录里带 `planFingerprint`，事后可核对"这次判定用的是哪一版规则"。
- **计划 ≠ 许可证**：编译出的计划只说明"要检查什么"，不构成审批许可；业务通过必须由持有对应角色的人做出。
- **运行有效性与动作资格分离**：一个运行有效，不等于当前人可以放行；两者分别判定。
- **不虚构学校政策**：任何未确认的数值门槛都停在"待负责人确认"，不会被当成已生效规则；未匹配业务只能生成**可编辑草稿**，发布仍需负责人逐项确认。
- **角色是本地模拟**，不冒充学校正式身份；学校接入部分单独标记为待联调。

### 3. 目录结构

```text
apps/electron/src/main/lib/review/       188 个模块（Main 侧：案卷/运行/规则/阶段/批次/离线/模板）
apps/electron/src/renderer/components/content-review/   55 个界面组件
packages/shared/src/types/review*.ts     共享类型与 IPC 通道定义
docs/design/review-agent/                55 份设计与验收文档（00–11 为总纲）
```

IPC 采用固定四层：`packages/shared` 定义通道 → `main/lib/review/review-ipc.ts` 注册处理 → `preload/index.ts` 暴露 → 渲染层 `window.reviewAPI` 调用。所有处理都校验发送方，不需要新增桥接层。

---

## 二、验证情况（如实说明）

### 已通过

| 门禁 | 结果 |
|---|---|
| `bun run typecheck`（9 个 workspace） | PASS |
| `bun run check:boundaries` | PASS（无边界违规） |
| `build:main` / `build:preload` / `build:renderer` | PASS |
| `bun test --isolate` | **5011 pass / 0 fail / 5 skip**（598 文件） |

### 真机走过的旅程（Electron + 真实 Main）

- **建案到规则检查**：选已发布模板 → 填字段 → 建案 → 上传原件 → 按模板规则检查 → 真实运行记录
- **人数判定**：18 人合规 / 21 人不合规 / 人数未知待确认 / 缺材料待补件，四种结论都复现
- **业务门禁**：21 人案卷点"初审通过"被拒绝，理由为"存在未解释的非合规项"，同时"退回补件"仍可用
- **两段决定**：初审 `finality=stage` → 终审教师 `finality=final`；审核员冒充终审被拒（`T05_ACTOR_NOT_ASSIGNED_TO_STAGE`）
- **补件两轮**：不足 → 更正 → 满足，产生新运行，旧运行不变
- **评委评分**：2 案批次 → 轮次 → 双评委评分 → 排名（换算分）→ 定稿
- **冷重启**：关闭应用重开，阶段、两段决定、运行记录、报告全部保留
- **报告导出**：真实产出 Markdown，含案卷号、阶段、事项字段

### 未完成 / 边界

- **文件选择器自动化**：Linux 上 Electron 的原生 `dialog.showOpenDialog` 是独立 GTK 窗口，自动化工具无法把路径投递进去（已用 `xwininfo` 确认对话框存在）。因此"通过 OS 对话框上传原件"这一步**未自动化验收**，但同一写入路径在其余旅程中已被反复使用。需要人在桌面会话里点一次即可闭环。
- **`gte` 下限算子**：规则引擎目前只支持上限（`lte`），下限判定会落到"待确认"，不会冒充为确定性规则。
- **学校正式接口**（身份、政策批准、校园 API）：未联调，标记为待外部条件。
- **重负载**：100 案 / 500 文件批量、安装包与无开发依赖启动、跨平台样本，均未验证。

### 已知取舍

- 报告目前只输出 Markdown。
- 申诉改判需要终审教师身份，本地无法自证该身份，因此该路径只到"可由人处理后继续"为止。

---

## 三、审查建议

按这个顺序看会最快：

1. `packages/shared/src/types/review.ts` —— IPC 通道与共享类型（先看接口）
2. `apps/electron/src/main/lib/review/case-store-v2.ts` —— 案卷唯一写入源与 CAS
3. `apps/electron/src/main/lib/review/review-v3-main-template-plan-bridge.ts` —— 发布模板 → 冻结计划的编译
4. `apps/electron/src/main/lib/review/review-v3-main-template-run.ts` —— 计划 → 真实运行
5. `apps/electron/src/main/lib/review/review-v3-t05-main-service.ts` —— 动作资格与阶段决定
6. `apps/electron/src/renderer/components/content-review/V2CasePanel.tsx` —— 主界面串接

设计依据在 `docs/design/review-agent/03-architecture-and-delivery.md` 与 `07-application-and-execution-design.md`；
验收台账在 `docs/design/review-agent/acceptance/local-l01/L3-DELIVERY-LEDGER.md`。

---

## 四、合并注意事项

- **版本号**：本 PR 的来源分支版本为 `0.15.162`（上游为 `0.15.146`）。合并时建议**采用上游版本**，发版号由发版负责人统一决定，本 PR 不主张版本变更。
- **不含试验产物**：来源仓库里的 `outputs/`（14MB 试验输出）与 `work/`（本地 E2E 脚本、截图、临时配置）属于开发过程材料，**未包含在本 PR 中**。
- **无强制推、无历史改写**：本 PR 是一个完整的历史合并，包含来源仓库的全部提交与合并记录。
- **不含密钥**：所有渠道密钥只通过环境变量注入，仓库内不含任何 sponsor 中转域名或明文密钥。
