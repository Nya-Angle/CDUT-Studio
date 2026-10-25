# CDUT Studio Review R02｜统一质量审核 + V3 原生实现派发包

本包不是“只审查并交报告”的任务包。每个批次必须审阅分配的 Markdown，修正可确定的问题，生成 V3 原生模板模块与专项测试，提交 GitHub 分支并向统一集成分支创建 PR。

## 固定仓库目标
- 仓库：`Fuck-GH-Admin/cdut-studio-review-agent`
- 当前核对基线：`main@7b6cdc843d26e926c0c63b8c51a451ff3925cfad`
- 已创建集成分支：`feat/v3-r02-template-library`
- 31 个批次分支均已预创建，子会话直接使用自己的分支提交，不要重复创建。
- 每批 PR 目标：`feat/v3-r02-template-library`
- 最终由唯一集成 Owner 创建面向 `main` 的最终 PR；批次不得直接合并 main。

## 怎么派发
1. 先将 `00_V3实现与提交契约.md` 和 `00_集成分工与文件所有权.md` 作为所有会话的共同规则。
2. 每个子会话只领取 `dispatch/prompts/{BATCH_ID}_TASK_PROMPT.md`。提示词开头包含 GitHub 原件定位；ZIP 只是可选备份，不是执行前提。
3. 任务第一步从 `feat/v3-r02-template-library` 读取实现契约、统一标准、所有权、128 项清单、缺失项清单和本批所有原始 MD。若本地分支没有这些文件，先 fetch 集成分支并按提示词中的确切路径读取；不要要求用户重新上传 ZIP。
4. 每批必须输出审查报告/问题 TSV、审阅后源 MD、运行时模块、专项测试，并提交代码 PR。
5. 集成 Owner 独占共享注册器、V3 criterion→Plan 编译、Main/IPC/UI 接线和最终集成 PR。

## 不阻塞原则
学校授权或校本制度当前性未确认，不阻止实现。所有模板都是本地研究模板、非校方正式模板；不确认规则进入待确认/人工复核，全部关闭自动通过。不得伪造政策、签批人、政策版本或学校系统写回。

## 测试策略
批次运行专项测试 + `bun run typecheck` + `bun run check:boundaries`；全量测试只在集成阶段集中运行一次。不要每批重复跑整仓大 CI。

## 统计
128 份现有模板纳入实现；16 个未取得正式 MD 的 ID 只保留缺口，不生成占位模板，不阻塞 128 项。完整批次列表见 `00_派发总表.tsv`。

## GitHub 自助取回原件（权威补充）
子会话只需定向提示词，无需用户上传 ZIP。原始模板在 `docs/design/review-agent/business-templates/R02/research-original/{TEMPLATE_ID}.md`；31 份提示词在 `docs/design/review-agent/business-templates/R02/dispatch/prompts/`；实现契约、统一标准、文件所有权、128 项目录与缺失项清单均在同一 `dispatch/` 目录或契约路径。所有原件位于 `feat/v3-r02-template-library`。若本地分支缺文件，先 fetch 集成分支并按路径读取，不得因 ZIP 不在手边停工。
