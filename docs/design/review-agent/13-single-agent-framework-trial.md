# 单 Agent 优先：Deep Agents 与 Docling 源码阅读及直接试用

日期：2026-10-08。项目基线：`60c25542`。本次交付是隔离试用、可复跑脚本和实际记录；没有替换应用 Pi 内核，也没有把实验判定写入用户案卷。

## 1. 当前决定

默认继续使用项目 Pi 主 Agent 完成整案。优先改善材料读取、证据定位和最终提交。复杂材料可以按需调用 Docling；从 Deep Agents 借鉴大结果落盘和可恢复的上下文管理。增加服务或 Agent 的条件是同材料实测有明确收益。

本轮没有证据支持把整套 Deep Agents 加到审核主链路来降低成本。Docling 的结构输出有具体价值，但并不是所有格式的默认解析器。

依据：[Anthropic 的简单方案原则](https://www.anthropic.com/engineering/building-effective-agents)、[按需获取上下文的经验](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)和以下直接试用结果。框架名、调用成功和解析 `success` 都不能替代审核结果验证。

## 2. 阅读和实际采用的版本

| 对象 | 阅读内容 | 本地试用 |
| --- | --- | --- |
| Deep Agents | `graph.py`、`middleware/filesystem.py`、`middleware/summarization.py`、`backends/filesystem.py`、HarnessProfile 与测试样例 | `deepagents==0.7.23`，`langchain-openai==1.6.7` |
| Docling | `document_converter.py`、`pipeline/native_pdf_pipeline.py`、`pipeline/simple_pipeline.py`、Word/Excel backend、文档结构与安装说明 | `docling-slim==2.135.0`，Docling Core `2.101.1` |
| 项目 Pi | 当前安装的 agent-core、模型传输实现、SDK 文档 | `0.86.1`，使用项目现有依赖 |

源码检出位置在工作区上层 `references/deepagents` 和 `references/docling`；提交号与完整依赖版本保存于 [environment.json](../../../outputs/review-framework-trial-2026-10-08/environment.json)和 [requirements.lock](../../../work/review-framework-trial/requirements.lock)。源码 main 与发布包分别记录，不能把未发布接口当作已安装接口。

Python 依赖位于 Git 忽略的 `work/tmp/review-framework-trial/.venv`。最初尝试标准 Docling 安装，下载依赖较多且缓慢；随后采用官方拆分的 slim 包及 PDF/Office extras。最终原生 PDF 试用未安装/运行本地 OCR、版面或表格视觉模型。

### Deep Agents 的具体经验

- 通过 HarnessProfile 关闭默认通用子 Agent，可以真正只运行一个主 Agent。本轮显式仅暴露 `ls/read_file/grep`，无委派工具、shell 或材料写工具。
- FilesystemMiddleware 对大工具结果保存完整原文，返回短预览和文件路径。内置 `read_file` 另有分页/截断行为，不能误以为任意文件读取都会自动触发结果落盘。
- 上下文压缩会保留恢复路径。400k 上下文并不意味着每次都要填满；模型限制必须明确配置。
- 框架自带的工具说明和系统提示也占上下文。本轮相同三个能力，首次请求的工具 schema 字符数为 Pi 710、Deep Agents 4,453。两种序列化格式不同，字符数只能解释开销方向，不等于 token 数。
- 大结果阈值使用字符估算，中文场景不能直接把这个阈值当精确 token 预算。

对应参考：[定制与关闭子 Agent](https://docs.langchain.com/oss/python/deepagents/customization)、[上下文管理经验](https://www.langchain.com/blog/context-management-for-deepagents)、[文件中间件源码](https://github.com/langchain-ai/deepagents/blob/main/libs/deepagents/deepagents/middleware/filesystem.py)。

### Docling 的具体经验

- 原生 PDF 路径不调用视觉模型，保存原生文本、嵌入位图及页面位置；**不提供经过模型分析的阅读顺序、标题层级、表格或 OCR**。
- Office SimplePipeline 与 PDF 模型管线不同。Word 图片保存成功不代表截图文字已识别，也不能承诺 Word 有精确页码。
- PDF 文本具有 `page_no/bbox/charspan`，图片与表格具有结构引用。对审核引用，比只有整份 Markdown 更有价值。
- Excel backend 使用 `data_only=True`，读取公式缓存值。本项目的未计算公式警告与单元格来源不能因此删除；本轮没有验证公式重算。
- Markdown 导出不是最省上下文的默认形态。本轮预算表中的合并标题/说明在五列中重复出现；应读取需要的表格/单元格，不整份注入这些重复文本。

对应参考：[文档结构](https://github.com/docling-project/docling/blob/main/docs/concepts/docling_document.md)、[原生 PDF 实现](https://github.com/docling-project/docling/blob/main/docling/pipeline/native_pdf_pipeline.py)、[Excel 实现](https://github.com/docling-project/docling/blob/main/docling/backend/msexcel_backend.py)。

## 3. 单 Agent 同材料对照

使用已配置的官方 `deepseek-flash`，上下文 400k、输出上限 32k、关闭 thinking，temperature=0。3 个独立场景各跑 2 次，共 12 次完整运行，每次包含预算、重复票号和审批三项检查。

场景包括：金额一致；申报 1,680 元、明细 1,480 元且票号重复；金额缺失、批准记录位于第 123 行。预期结果位于 Agent 文件根之外。两边使用相同中文目标提示，运行顺序第二轮交换，检查输入文件哈希始终未变。

Pi 使用一个持续的 agent-core 会话和三个短描述文件工具；Deep Agents 直接使用发布包的主 Agent 和内置文件中间件。**这是两种配置的整体验证**，包含工具说明、结果格式与流式/非流式传输差异，不能把所有变化归因于框架内核。

| 指标 | Pi 最小单 Agent | Deep Agents 单 Agent |
| --- | ---: | ---: |
| 完整运行次数 | 6 | 6 |
| 实际模型请求数 | 29 | 26 |
| 总 input + output token，输入包含缓存命中 | 50,699 | 61,479 |
| 每次完成时间中位数 | 6.724 秒 | 6.648 秒 |
| 预算/重复检查与所需证据均正确 | 12/12 | 12/12 |
| 三项检查的来源行与引文均有效 | 18/18 | 18/18 |
| 有最终摘要 | 6/6 | 6/6 |
| 严格结果契约通过 | 5/6 | 3/6 |
| 全回复为裸 JSON | 0/6 | 0/6 |

严格契约失败均来自“尚未批准”的 `pending/conflict` 分类。提示词没有完全定义这两者在审批缺失场景的含义；两边都识别出尚未批准，不能把 5/6 与 3/6 宣称为领域准确率差距。需要在业务规则中明确状态语义。代码围栏或前言属于输出格式违约，保留记录，与事实正确性分别统计；上线接入应使用经过校验的结构化提交。

两边均处理了缺失金额，未把缺值作为 0；均找到了第 123 行的批准证据。本轮没有额外模型复核或材料 Agent。Deep Agents 请求略少，但总 token 增加 **21.3%**，时间差不足以证明稳定提速。这些材料很小，没有触发大上下文压缩，不能据此否定其在大型任务中的作用。

原始运行、评估及汇总见 [agent-results.json](../../../outputs/review-framework-trial-2026-10-08/agent-results.json)和 [summary.json](../../../outputs/review-framework-trial-2026-10-08/summary.json)。预备的 Pi pilot 另存，不混入六次正式运行，也不与旧 64k 审核基线作不等条件比较。

### 大工具结果功能验证

将 100,034 字符的工具结果交给实际 FilesystemMiddleware，模型可见内容变为 832 字符，完整原文逐字落盘。通过 backend 的分页读取重新取得末尾 `CASE-OFFLOAD-01` 证据。

这是存储、短引用和恢复的能力验证，**没有调用 LLM，不证明审核正确率或整案 token 下降**。记录见 [offload-check.json](../../../outputs/review-framework-trial-2026-10-08/offload-check.json)。

## 4. Docling 材料试用

直接运行现有 `parseFileIntoSourceDocument` 与 Docling Converter。现有 PDF 上传链路另有页图渲染；下面的现有解析器列仅针对文本/结构解析，不能把“没有图片块”理解为应用最终没有 PDF 页图。

| 样例 | 现有解析器 | Docling 原生/Office 路径 |
| --- | --- | --- |
| 竞赛申请 DOCX | 24 块，16 个表格单元格 | 18 个文本项、2 张 4×2 表格；无精确页面位置 |
| 活动预算 XLSX | 34 个单元格、保留工作表与行列 | 3 张表格；Markdown 合并标题重复，不能直接全量注入 |
| 扫描证书 PDF | 文本为空，标记 partial | 1 页图和图片位置，识别文字仍为 0；`success` 仅指结构转换 |
| 综测手册 DOCX | 25 个图片块，24 张保存成功 | 25 张图片数据保留；仍需按需视觉读取 |
| 校徽说明图文 PDF | 124 个文本块，无字符坐标 | 47 个文本项、1 个图片项，48 项带来源；有页图及文本矩形 |

综测手册 ZIP 中有 26 个 media 文件，不能将包内文件数直接当展示图片数。实际比较的是解析得到的图片引用及可用图片数据：现有 24、Docling 25。

Docling 该手册第一次/再次转换为 1,455.66/1,434.36 ms；现有解析器为 56.77 ms。图文 PDF 为 196.24/170.04 ms，现有文本解析 73.54 ms。没有拿额外结构输出的耗时冒充相同功能的速度排名。

这些计时不含进程启动、模块导入及模型下载；Docling 再次转换复用 Converter，但没有命中持久文件缓存。解析数字不是完整上传或 UI 耗时。

完整结果见 [current-parser-results.json](../../../outputs/review-framework-trial-2026-10-08/current-parser-results.json)与 [docling-parser-results.json](../../../outputs/review-framework-trial-2026-10-08/docling-parser-results.json)。原文、页图和较大的结构产物留在 Git 忽略的 `work/tmp/review-framework-trial/`，不复制用户下载原件进仓库。

### 同一主 Agent 直接看扫描件

Docling 生成扫描 PDF 第 1 页 PNG。Deep Agents 主 Agent 通过一次 `read_file` 读取图片，继续在同一会话判断，没有启动视觉子 Agent或要求材料 Agent 先总结。

官方 DeepSeek Flash 正确识别成果编号、获奖等级、三名成员、颁发日期和“非正式证书”标记，5 个字段均与人工查看原页一致。实际为 2 次模型请求、3.304 秒、2,596 总 token。单个样张说明链路可用，不能推导批量识别准确率；没有把它与旧整案用量比较。

本次使用非流式 Chat Completions。成功不代表项目 Pi 原有流式图片问题已经修复，也不能把传输修复的收益归给 Docling。记录见 [vision-result.json](../../../outputs/review-framework-trial-2026-10-08/vision-result.json)，大段二进制已从保存的消息中省略。

## 5. 给项目的最小落地顺序

1. **保留一个持续的 Pi 主会话。** 授予当前案卷的读取、搜索、分页、按页看图和结果提交能力。短材料直接提供；大材料只提供目录和定位信息。明确审批/待办状态与最终提交契约。
2. **先接好可恢复的短工具结果。** 大结果写入案卷派生文件，返回短预览和定位。分页能够到达材料末尾；使用文件哈希与解析配置缓存，失败不永久缓存。原件始终可复核。
3. **Docling 作为按需文档服务。** 图文 PDF 需要坐标时试用原生路径；复杂 Office 需要完整结构时调用。普通 XLSX 保留现有单元格解析与公式警告。截图和扫描件提供相关图片给同一主 Agent。
4. **保留来源映射。** Docling 的原件哈希、结构引用和 PDF 矩形转换到既有材料版本/块定位。Word 无页码时使用结构位置，不能伪造精确页码。Agent 默认读取简明文本/所需表格，不读取完整包含 base64 的结构 JSON。
5. **只在证据表明有收益时增加 OCR、子 Agent 或框架层。** 高难版面可以进一步试完整 Docling OCR/布局模型；独立大分项可以进一步试委派。本轮两者均未作为审核默认路径。

原生解析和相关页图已经能够支持一个主 Agent 往下完成。本阶段的优先项是让 Pi 获得这种方便、可追溯的材料体验。复跑方法见 [RUN.md](../../../work/review-framework-trial/RUN.md)。
