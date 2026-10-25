# R02 研究模板迁移到 `0a9a917`：可执行兼容性复验（2026-10-25）

## 基线及变更范围

- **唯一基线**：`0a9a917646b87f8b8c2c1f58f544e1053248a0ba`，已有材料自动分类、纠错和 Pi 重跑的服务级贯通验证。
- 以该提交为 HEAD 在独立工作树中，原样重放早期 R02 候选集成的六次提交（从 `10a272e9` 至 `34aa781d`），**没有把旧的完整应用树覆盖回新基线**。R02 模板及其报告为新增目录，因此移植无文件冲突。
- 本次只额外修改 R02 相关的 `S07-A.test.ts`、跨批测试、研究候选入库测试、模板存储**候选发布识别门禁**及对应测试；不改 OCR、材料分类算法、Pi 审核实现或 GUI。

## 已发现并修好的问题

1. 旧 S07-A 测试把 `S07-T02` 文档修订前 SHA-256 写死为 `3e5d79a6…`，但此前为使首轮 F/M/R 与实际定义一致，已给研究文档增加技术映射附录，当前真实哈希为 `fb5e13f2…`。同步修正测试预期；来源变更的旧值与新值均保留在 `source-hash-differences-20261025.tsv`，不能倒改正文假装旧文件未变。
2. 基线 `template-store.ts` 尚未把 `R02_RESEARCH_TEMPLATE_NONOFFICIAL:` 以及 `S01–S08/T01–T08` 的 R02 研究 ID 识别为不可正式发布的候选；只保留 `sourceNote` 会在用户编辑时失效。增加独立于可编辑文本的保留 ID 检查，并覆盖复制来源标记、删改备注、伪造历史 regular-draft 控制记录的反例。
3. 原完整性测试仅检查研究定义及元数据：现在每一份都实际调用应用的 `validateTemplate`；新增真实作者态存储往返测试，一一执行 `saveAuthoringCandidateDraft`、`getTemplate`、`isTemplateCandidateHeld`、`publishTemplate` 的拒止断言。

## 真实测试（Bun 1.4.2；按 CI 固定版本，frozen lockfile 安装并忽略安装脚本）

| 范围 | 结果 | 证明什么 |
| --- | --- | --- |
| Node 独立来源/结构校验 | 143/143，0 issue | 143 对定义与研究文稿、R02 元数据及引用结构自洽 |
| R02 `definitions` 目录全部 Bun 测试 | **145 pass，0 fail** | 原批次断言及新增整库交叉校验通过；与项目模板校验器无已检出结构错误 |
| `template-store.test.ts` | **21 pass，0 fail** | 普通模板仍可发布，研究候选不能通过普通草稿/修改备注绕过发布门禁 |
| R02 独立真实存储回归 | 143 份成功读写；143 份正式发布均被拒 | **能用作本地作者态研究候选**，不是“可作为校方正式模板发布” |
| 基线原有 `material-auto-to-rerun.journey.test.ts` | **3 pass，0 fail，52 断言** | 此次模板候选门禁变动没有破坏既有材料分类—纠错—Pi 重跑的服务级主链 |
| Electron 应用 TypeScript 编译检查 | **0 错误** | 使用仓库锁定 TypeScript 5.9.3，`tsc --noEmit -p apps/electron/tsconfig.json` 成功；需设置 Node heap 上限为 5120 MiB（默认约 2 GiB 时 OOM） |

复现命令：

```bash
bun test apps/electron/src/main/lib/review/r02-template-catalog/definitions
bun test apps/electron/src/main/lib/review/template-store.test.ts
bun test apps/electron/src/main/lib/review/material-auto-to-rerun.journey.test.ts
node --no-warnings --experimental-strip-types docs/design/review-agent/business-templates/R02/audits/quality-source-check-20261025.mjs
NODE_OPTIONS=--max-old-space-size=5120 bun run --filter='@profer/electron' typecheck
```

## 哪些“能用”，哪些不能

- **能用**：作为未发布、非官方的 R02 研究模板候选进行保存、回读、校验、继续编辑和审阅；现有生产审核路径不受此次合入影响。
- **还不能用作 144 份正式自动审核模板**：只有 **143/144** 份（缺原件 `T02-T08`）；全部保持 `draft`、没有受信校方 `PolicyVersion`、禁止自动通过和普通发布。尚未向 UI/模板路由注册为可自动选择的正式模板，也没有逐条把所有研究自然语言条件编译成真正可执行的核验。
- **未宣称**：学校政策已授权、真实 OCR/AI 审核判断准确、每模板 A/B/C 业务情形完成、Electron GUI 实机验证。
- 研究模板中涉及敏感材料者（例如 `T03-T09`）不能因为技术结构通过就允许普通联网客户端收件。

本次结论仅是**新基线代码兼容、作者态模板可实际存取与安全门禁通过**。它是可继续开发的独立验证支线，而不是 144 份校本模板已正式上线。
