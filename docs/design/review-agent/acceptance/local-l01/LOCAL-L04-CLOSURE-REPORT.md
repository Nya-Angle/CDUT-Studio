# Local-L04 十线集成收尾报告

**基线**：`main` @ `70f97c693`（开工基线 `e499d9a49`，其后 L2 修复至 `24603d875`）
**接收**：T01–T10 十条功能线，全部按固定 SHA 三方合并，保留真实 git 历史（未 squash、未强推）。

## 一、合并历史（可用 `git log --merges` 复核）

| 批次 | 线 | 接收 SHA → 合并提交 |
|---|---|---|
| B1 | T02 | `36687a952` → `1babad8e7` |
| B1 | T03 | `28528b02b` → `fae977a17` |
| B1 | T04 | `54678e8ee` → `5df23c6da` |
| B1 | T01 | `ac2947fc6` → `ecc00e66b` |
| B2 | T05 | `41c3f2fa9` → B2 合并 |
| B2 | T07 | `37c6d3212` → B2 合并 |
| B2 | T09 | `474cf5f84` → B2 合并 |
| B2 | T06 | `9ac93052f` → `5a6bcac82` |
| B3 | T08 | `d83b4be32` → B3 合并 |
| B3 | T10 | `3679cc4e3` → `d21d3474f` |

**T05 × T10 交叠文件 `V2CasePanel.tsx`**：git 自动三方合并后逐项核对双方内容均在——
T05 的 `ReviewV3T05HumanWorkflow` / `RunDecision` 在（4 处引用）、旧 `BusinessFlowSection` 已删；
T10 的 `onCaseOpened`（7 处）、「案卷办理」标题、折叠区、条件化姓名字段均在。**未整文件覆盖。**

## 二、十条线最终状态

| 线 | 状态 | 用户入口 / 消费者 |
|---|---|---|
| T01 | **JOURNEY_VERIFIED** | `TemplateWizardPanel`（条件编辑、试跑、导入导出） |
| T02 | **JOURNEY_VERIFIED** | `V2CasePanel` → 材料覆盖（只读暂存预览） |
| T03 | **WIRED** | `V2CasePanel` → 事实工作台 |
| T04 | **BLOCKED_OWNER** | 见 `T04-INTERFACE-REQUEST.md` |
| T05 | **JOURNEY_VERIFIED** | `V2CasePanel` → 人工流程 / 决定 / 补件 |
| T06 | **WIRED** | `BatchPanel` → 清单分案预览 |
| T07 | **JOURNEY_VERIFIED** | 批次区 → 评委工作台（新桥接） |
| T08 | **WIRED** | `AssistantDrawer` → 报告面板 |
| T09 | **WIRED** | `V2CasePanel` → 离线任务包（新桥接 + 新 UI） |
| T10 | **WIRED** | `ContentReviewView` → 工作台总览 |

**MERGED 10/10；WIRED 或更好 9/10；JOURNEY_VERIFIED 4/10。**

## 三、L 线新增的桥接（非 T 线业务实现）

| 提交 | 内容 | 为什么必须由 L 线做 |
|---|---|---|
| `e4e4d50f3` | T07 状态存储 + Main 服务 + 3 个 IPC + 工作台 | T07 只有纯状态机，无持久化、无入口；且不得落为第二套 CaseStore |
| `8d7cd369f` | T09 离线包 Main 服务 + 3 个 IPC | T09 issuer 无任何调用入口 |
| `47d3a4e95` | T09 产品入口（签发/复制/预览/导入） | 用户从界面点不到 |
| `49576336c` | T02 只读暂存预览 IPC + 覆盖区容器 | 复用既有 `session(event, caseId)` 派生 B2 ctx，不新建基础设施 |
| `4bf3d4404` | T03 事实工作台挂载 | 合并后组件无生产引用（孤岛） |

## 四、集成过程中修复的真实缺陷

这些都不是 T 线产物的问题，而是主线既有缺陷，被真机验证暴露：

| 提交 | 缺陷 | 影响 |
|---|---|---|
| `3aebbf991` | 原生案卷**完全不透传 `materialSlotId`** | 任何模板只要声明 `requiredAt=submission` 的材料槽就永远无法提交 |
| `e15ecb5a2` | `resolveSupplementV2` 不校验 `outcome`，非法值把补件 status 写成 `undefined` | 补件既不关闭也不参与门控，记录静默损坏 |
| `957306600` / `88566f00f` | 看门狗被响应头骗过；失败原因丢失只显示「执行出错」 | run 可无限 `running`；失败不可诊断 |
| `642ebd370` | PDF 逐页截图反复整份栅格化 | 真实 PDF 导入 35s → 0.4s |
| `30f8597ff` | 通用建案全局强制学年 | 通用技术预审被迫填无关学年 |

## 五、三条必验旅程 + 冷重启

| 旅程 | 结果 | 证据 |
|---|---|---|
| **A09 补件闭环** | **PASS** | 真实 PDF 审核 `completed/12 checks` → 要求补件 → 导入真实 DOCX → 答复 → 判定 satisfied → stage 回 `reviewing`、补件 `satisfied`、**旧 Run 仍 completed 且未被改写** |
| **A12+A14 批次评委** | **PASS** | 2 案 → 批次 → 轮次 → 4 次分配 → 双评委各 2 项评分 → 组织者排名（各 2 有效评委）→ 定稿 |
| **A15 通用申请** | **PASS（业务阶段链）** | 模板（人数上限 20 + 必需材料槽 + 初审/终审）→ 无学年建案 → 槽位登记 → 提交 → 初审通过（reviewer）→ 终审被拒（需 teacher，安全边界）→ 报告导出 |
| A15 确定性规则 | **BLOCKED_OWNER** | 缺 B1-check→RuleSpec 合同，不得用模型文本冒充 |
| A09 申诉改判 | **BLOCKED_BY_DESIGN** | 需 teacher 角色，本地无此身份 |
| **冷重启** | **PASS** | Case/材料/60 项 Plan/回执链；T07 状态 revision 7 / 4 分配 / 2 票；缺评时 `rank=null` 门控未失效 |

## 六、原有能力未回退

| 项 | 验证 |
|---|---|
| D4 50 套可读 | `listD4Templates` 50/50，全部带真实 targets |
| 60 项 Check | `attachD4TechnicalPlanV3` → checks=60，指纹 `71bfc0d6…` 与合并前一致 |
| B1 第 51 套 | 保存→读回→预览→冻结→安装 checks=1→材料导入 |
| 学年解耦 | 通用草稿无学年可建案；综测缺学年被拒 |
| 看门狗 | 26 项定向测试通过 |
| 全量测试 | **4758 pass / 0 fail / 5 skip** |

## 七、遗留与归属

1. **T04 BLOCKED_OWNER** —— 见 `T04-INTERFACE-REQUEST.md`，需 Owner 在三选一方案中定一个。
2. **T09 真机全链路未跑** —— 完整往返有单测覆盖（ready→accepted→duplicate），真机只验到「无补件时签发被拒」。要跑通需先跑一次真实审核建立补件（约 15 分钟）。
3. **T06 材料 ZIP→正式分案** —— 未实现，属 T06 Owner 范围。
4. **T07 评委包离线签发** —— `issueT09JudgeFromCase` 需要 `JudgeAssignment`，而 T07 用自有状态模型，二者未打通。

## 八、复现

```bash
cd apps/electron && bun run dev:vite          # 另开终端
cd apps/electron && bun run build:main && bun run build:preload
source work/e2e 环境变量（见 work/e2e/README.md）
xvfb-run -a node work/e2e/v3-e2e.mjs flow-a15          # A15 业务阶段链
xvfb-run -a node work/e2e/v3-e2e.mjs flow-a09          # A09 补件（需真实模型 ~15min）
xvfb-run -a node work/e2e/v3-e2e.mjs flow-t07-judging  # A12+A14 评委
xvfb-run -a node work/e2e/v3-e2e.mjs phase-t07-prepare # 冷重启 A
xvfb-run -a node work/e2e/v3-e2e.mjs phase-t07-verify  # 冷重启 B
```
