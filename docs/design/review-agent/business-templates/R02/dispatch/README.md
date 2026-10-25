# R02 GitHub 原件与派发总索引

本目录是 CDUT Studio Review R02「统一审核 + V3 实现」任务的权威资料入口。子会话只需取得自己的 `{BATCH_ID}_TASK_PROMPT.md`，即可定位所有原件和要求；**不得要求用户重新上传 ZIP**。

## 固定仓库与分支

- 仓库：`Fuck-GH-Admin/cdut-studio-review-agent`
- 资料/集成分支：`feat/v3-r02-template-library`
- 提交定位：请以 `feat/v3-r02-template-library` 的最新 HEAD 为准，不依赖固定 SHA；后续更新会继续补充提示词和派发说明。
- 实现契约：[`R02-V3-IMPLEMENTATION-CONTRACT-20261023.md`](../../../R02-V3-IMPLEMENTATION-CONTRACT-20261023.md)

## 权威资料路径

| 资料 | 仓库内路径 |
|---|---|
| 128 份原始业务模板 | `docs/design/review-agent/business-templates/R02/research-original/{TEMPLATE_ID}.md` |
| 31 份定向任务提示词 | `docs/design/review-agent/business-templates/R02/dispatch/prompts/{BATCH_ID}_TASK_PROMPT.md` |
| 统一审查标准 | `docs/design/review-agent/business-templates/R02/dispatch/00_统一审查标准.md` |
| 文件所有权与集成分工 | `docs/design/review-agent/business-templates/R02/dispatch/00_集成分工与文件所有权.md` |
| 128 项模板清单 | `docs/design/review-agent/business-templates/R02/dispatch/00_模板清单_128.tsv` |
| 本轮完整核验报告 | `docs/design/review-agent/business-templates/R02/dispatch/02_R02_原件与派发最终核验_20261024.md` |
| 未找到正式源 MD 的 16 项 | `docs/design/review-agent/business-templates/R02/dispatch/01_未纳入的16项.md` |
| 总集成会话提示词 | `docs/design/review-agent/business-templates/R02/dispatch/00_总集成会话提示词.md` |
| 派发说明 | `docs/design/review-agent/business-templates/R02/dispatch/README_派发说明.md` |
| 实现契约副本 | `docs/design/review-agent/business-templates/R02/dispatch/00_V3实现与提交契约.md` |

## 覆盖与核验

- 原始模板 Markdown：128 份，128 个唯一 `template_id`，每个文件以 ID 命名。
- 定向子会话提示词：31 份，全部加入 GitHub 原件定位段。
- 128 项清单：128 条模板数据行。
- **已确认的终端换行差异**：当前 GitHub 原件目录与清单的 128 个 ID/文件名完全匹配；但每个原件 blob 都比清单 `bytes` 少 1 字节，清单 `sha256` 对应于当前 blob 字节再追加一个 LF。115 份当前无终端 LF，13 份当前有一个终端 LF。不要改原件或清单来掩盖差异；按行尾差异记录，不阻塞审查/实现。
- **已确认的清单元数据问题（未改原件或清单）**：`S08-T04` 与 `T02-T14` 的清单 `version` 单元格为空，但原件标题及 `archive_path` 均表明版本为 `v1.0`；`T04-T06` 与 `T08-T05` 的清单 `source_snapshot` 是 `2026-10-22`，原件研究日期为 `2026-10-23`；`S02-T05` 的 `policy_status` 值在原件与清单中都带有多余反引号。分别记录为 `MANIFEST_VERSION_MISSING`、`SOURCE_SNAPSHOT_DATE_DRIFT`、`METADATA_MARKUP_TYPO`，不得为消除表面差异而覆盖原件或改写清单。
- 另有 16 项未取得正式源 Markdown：只在缺口清单登记，不生成占位模板，不阻塞已取得的 128 项。
- 原始模板是研究原件，不等于已审阅版本；审阅修订稿必须写入契约指定的 `business-templates/R02/{TEMPLATE_ID}.md`，并在审查报告中记录来源和差异。

## 子会话执行步骤

1. 打开自己批次的 `prompts/{BATCH_ID}_TASK_PROMPT.md`。
2. 先读取实现契约、统一审查标准、文件所有权和本批每个模板 ID 对应的原始 MD。
3. 若当前工作分支没有原件，读取 `feat/v3-r02-template-library` 上的指定路径；本地 Git 可用时先执行 `git fetch origin refs/heads/feat/v3-r02-template-library:refs/remotes/origin/feat/v3-r02-template-library`，再用 `git show refs/remotes/origin/feat/v3-r02-template-library:<path>`。若因远端跟踪分支分叉而失败，不得强制覆盖；改用 `git fetch origin refs/heads/feat/v3-r02-template-library`，随后以 `git show FETCH_HEAD:<path>` 读取。
4. 按提示词要求在 `feat/v3-r02/templates-{BATCH_ID}` 独立分支提交审阅后的 Markdown、V3 原生模板定义、专项测试、审查报告与问题台账。
5. 创建 PR，base 必须是 `feat/v3-r02-template-library`，不得直接合并到 `main`。
6. 校本制度/授权未确认不是停止工作的理由；未知规则标记待确认/人工复核，禁止虚构政策、签批人或自动正式决定。

## 注意

全部 31 份提示词已统一为 GitHub 自助读取流程，不再依赖 ZIP 作为输入。ZIP 仅是可选备份或交付附件；当前分支最新 HEAD 的原件和公共要求为权威来源。
