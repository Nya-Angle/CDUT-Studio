# A15 真实输入与验收用例包

**此目录的源文件为可运行脚本 + 虚构政策，不是已通过的验收结论。** 依赖 Node 自带模块，没有 Bun/Python/LibreOffice 运行时依赖；脚本生成可供 T02 真实解析的标准 OOXML DOCX（五份）与纯文本对照、按 SHA-256 锁定的 manifest.json。

运行命令：node work/e2e/a15-fixtures/generate.mjs

之后输出至 work/e2e/a15-fixtures/generated/（已 gitignore）：

- lab-18-complete.docx：18 人、计划完整，人数规则应 compliant。
- lab-21-over-limit.docx：21 人，人数规则必须 non-compliant。
- lab-12-unclear-reply.docx：初始缺件后第一次补件，时段、用途、安全安排仍不完整；回复不等于满足。
- lab-12-corrected-reply.docx：第二次补件，内容齐全；可由有权人工确认满足并重审。
- lab-unknown-count.docx：人数未知，人数规则应 awaiting-confirmation，不是 0 或通过。
- *.txt：相同输入的可读对照。**读取 TXT 成功不能冒充 DOCX 已被程序解析。**
- manifest.json：四个场景及预期状态、原件 SHA-256 与两级流程。

**测试顺序**：先发布/绑定组织模板（无学年、无评分）；再上传真实 DOCX → 真实 DocumentVersion → 已确认事实 → 冻结 RuleSpec/PlanBinding → 真实 ReviewRun/CheckResult；然后走缺件→第一次补交不足→第二次补齐→新 Run→初审→终审→可读报告和重启恢复。缺乏 Main 可信端口则记录 BLOCKED_BRIDGE，规则表达缺失则记录 BLOCKED_OWNER。

**重要纠正**：main 现有 flow-t01-bind 只证明“发布两个字段、一个人工阶段的 document 模板→无学年建案”，它没有组织对象、材料槽、人数确定规则和两级工作流。该场景只能标 S0 烟测 PASS，不能标完整 A15 通过。

本包不修改 work/e2e/v3-e2e.mjs 或任何 T01/T02/T04/T05、Main/IPC/Preload 生产文件。L 可以挑选主线接入，不需等待其他四线完成；A15 不强制先完成全格式 OCR、ZIP 物理分案或真实 PDF 导出。校方权限均为本地模拟，不冒充学校正式批准。
