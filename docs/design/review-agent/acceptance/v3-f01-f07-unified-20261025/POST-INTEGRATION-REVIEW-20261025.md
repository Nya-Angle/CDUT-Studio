# Review V3｜F01–F07 独立复验、剩余缺口与合并裁决（2026-10-25）

> 本文是独立于集成实施者的复核补充，采用“源码实现、定向测试、业务闭环、真实授权、实机验收”分层口径。它不改写原始阶段日志，不将技术 PASS 当成学校业务签收。

## 1. 固定对象与验证证据

- 仓库：Fuck-GH-Admin/cdut-studio-review-agent。
- 被核验源 PR：[ #272 ](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/pull/272)，Draft，base 为 integration/v3-r02-pr246-249-250-20261024（#265）。
- 本次读取并测试的功能 HEAD：16be5618e02d384ecfe2ac1dd06ab7aeb2fe327b。
- 该功能 HEAD 的 Git Tree：4bfcdb68baf2f2344f4bf3a63d166a37cf36897c。
- #272 含 #265 与 F01 #266、F02 #270、F03 #268、F04 #269、F05 #271、F06 #267、F07 #264。F07 另一条实现只吸收了独有旧决定/申诉保护，没有引入第二套权限确认。
- 独立克隆源码并使用 Bun 1.4.2、锁定依赖，选取 13 个测试文件覆盖安全工具、报告 IPC/受众、冻结 Plan 与单 Run、自动本机分类、纠错、通用兜底、T05 持久确认、F07 旧入口和打包守卫：**90 PASS / 0 FAIL，435 assertions**。
- 独立执行 Electron TypeScript typecheck：**PASS**；check:boundaries：**PASS**。
- 上述定向测试首轮有一项因测试沙箱默认配置目录只读而报 EROFS；设置独立可写 PROFER_CONFIG_DIR 后同一 13 文件全部通过。该环境问题不记为代码失败。
- GitHub 远端 #272 同一源 HEAD 的 PR CI、Review Baseline、D2 Scoped Pi、Review batch focused 均为 success；PR CI 日志：**5118 PASS / 5 SKIP / 0 FAIL，613 个测试文件**。Actions 在 #272 的测试合并引用 baf3611c9fdc2bcd59172a004d7ae722464dbab8 上执行，基线为 #265。
- 原集成日志的去重定向结果为 **227 PASS / 0 FAIL（27 文件）**，与本次独立 90 项、GitHub 全量 5118 项是不同层次的证据，**不可简单相加**。
- 相关证据：[PR CI](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/40114897642)、[Baseline](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/actions/runs/40114897638)、[原集成日志](INTEGRATION-ACCEPTANCE-LOG-20261025.md)。

> 本文提交属于文档补充。提交后分支 commit/tree SHA 会变化；上述测试结论严格绑定所列功能 HEAD 和代码内容，不自动冒充新 HEAD 的 GUI 验收。

## 2. 七个批次：已修什么，哪里还没有闭环

| 批次 | 当前可信结论 | 尚未关闭的具体边界 |
| --- | --- | --- |
| F01 Agent 工具 | PASS_SCOPED：指派案卷、执行轮次、跨案读/取消、建案 requestId 幂等已具备反例保护 | 首次使用后的轮次隔离不等于真实 SDK 用户消息身份认证；学校用户权限不由本批签收 |
| F02 报告受众 | PASS_SCOPED / SAFE_FAIL_CLOSED：Main 校验五条 T08/F16 IPC 及历史受众；本机/Agent 默认只获取申请人版 | 学校可信 Principal、案卷归属与 reviewer/organizer 正向授权未接真实服务；共享设备不等于用户身份隔离 |
| F03 冻结 Plan/Run | PASS_SCOPED：普通 Pi Run 显式绑定冻结 Plan/Check×target/sourceVersion；旧 Run 失效与政策版本保守记录有保护 | 真实校方政策发行权、正式 CanonicalPlan 发布者和多事项实样仍需验证 |
| F04 模板驱动入口 | PARTIAL：多份材料可路由，模板确定后本机自动预分拣，歧义保留人工确认，模型结果有修订快照防过期 | **本机预分拣不等于 AI 自动深入分类**；模型深分类仍须点击。D4 先冻结 D2 Plan 再分类的历史顺序仍需正向联调 |
| F05 纠错—升版—重审 | PARTIAL / FAIL_CLOSED：纠错提案 CAS 持久化、D2 撤回重建边界、旧 Run/待办/补件失效均有测试 | **正式 CanonicalPlan 的授权升版、Check 删除 ACK、新 Plan 安装与自动衔接新 Run 未闭环**；细粒度 Subject×SourceRef 纠错未全部覆盖 |
| F06 库外通用审核 | PASS_LIMITED：固定事实与政策核验合同、真实原件来源、未认证政策 pending，不能自动通过 | 已配置模型的真实库外事项、复杂语义判断、补件建议与 T08 输出尚未完成同案 LIVE 证明 |
| F07 恢复与旧隔离 | PASS_SCOPED：T05 确认使用 Case CAS/Receipt 持久化；旧 V1/V2 决定、申诉、写入对原生 V3 有反例门禁 | 真实 Main 现场确认来源尚未接入；真实 Electron 退出、冷重启、补件复审及历史报告恢复尚未验收 |

### 对原始问题的具体纠偏

1. 不再重复宣称“完全没有模板自动路由、分类、统一 Pi Run、T08 可信快照、请求幂等或旧链路隔离”；这些已有代码和专项回归。
2. 不把“技术检查已执行”“D2 技术预审”“本地 reviewer”“未认证 RuleSpec”“导出成功”解释为学校正式通过、学校身份、有效政策或外部送达。
3. F04 的“本机自动预分拣”与最初产品要求的“AI 自动先分类”有实质差异；在 #261 未形成可信出站授权前，不能为了 UI 自动化绕开门禁。
4. F05 的“错误/过期操作安全拒绝”是必要的安全结果，但不能代替用户成功纠错、合法升版、重审并得到更新报告的正向闭环。

## 3. 阻断项与退出准则

| 优先级 | 未关闭项目 | 下一次可接受的最小证明 |
| --- | --- | --- |
| P0 | [#261 预上传敏感材料门禁](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/pull/261) 尚未叠加到 #272 | 同一组合 HEAD 验证未知/拒绝/过期授权时，选择、解析、持久化、模型外发前正确拒止；正向路径使用真实可信批准来源，不能使用测试许可冒充 |
| P0（正式师生部署） | 真实学校 CAS/教师/组织者/案卷权限 | Main 可信身份端口和资源范围绑定；普通申请人无法改 IPC 参数读取内部报告；合法校方能在正确范围内正向访问 |
| P1 | 正式 CanonicalPlan 纠错升版 | 一份材料或证据绑定纠错→有权发布者处理删除 ACK→新 Plan→旧 Run 失效→新 Pi Run→新报告，历史版本不被覆盖 |
| P1 | F04 自动分类、冻结顺序、复杂模板条件 | 1/2/5 份材料，多候选 20s/切案/过期，模板槽位和关键缺件门禁；外部 AI 路径仅在授权后运行 |
| P1 | F06 真实库外事项 | 用户确认真实事项、未知政策保持待确认、有限事实/语义初审、补件和 T08 问题清单同案可追溯 |
| P1 | T05 确认与持久恢复 | 真实 Main 授权来源；Electron 关闭再开，案卷/Run/决定/补件/报告版本不丢失、不复活旧结果 |
| P1（独立轨道） | 144 项模板质量和政策来源 | 按既定十维、SRC/F/M/R 闭环和质量/证据双状态逐项审计；模板存在不等于业务可审核 |
| 实机待签收 | 完整 LIVE A/B/C、PDF/ZIP/原生保存与跨平台 | 同一案卷从拖入、路由、分类、初审、补件、重跑、决定、报告到冷重启的操作日志与截图/录像；Windows/macOS 特有保存行为单独验证 |

**未关闭状态保持 OPEN**，不得因代码 CI 全绿自动改成 PROD_READY、USER_JOURNEY_ACCEPTED、SCHOOL_AUTHORIZED 或 POLICY_VERIFIED。

## 4. 与 R07 文档分支的关系及模拟合并

- 只读比较对象：docs/source-reference-r07-20261024（提交 55de56f8277210349c4ece2f8fe4c4539a46ebd2）。
- 该分支从 7b6cdc843d26e926c0c63b8c51a451ff3925cfad 派生，明确定位为 R07 冻结文档包；其 README 将文档核验源码固定为 **05fb2565e20eb1760233696be1832f68196b37c2**，并要求 SOURCE、手册和 hash 字节关系维持封版。
- 使用 Git merge-tree 将该文档分支与 #272 功能源 HEAD 做只读三方模拟：**没有文本冲突**。这只证明 Git 结构可合，**不证明合并后文档反映 #272 新源码，也不代表合并后实机已验收**。
- 不建议直接把 #272 当成“R07 文档权威更新”。应保留 R07 为历史快照；后续若需要统一源码和文档，在新的候选分支以 #272 为代码基线，制作 R08 增量源码地图/模块文档及明确的源 SHA、hash、差异记录，再验收新的文档。
- 本次没有修改 docs/source-reference-r07-20261024、main、R02 基线或来源 F01–F07 PR，也没有执行实际 merge。

## 5. 审核裁决与建议

- **源码集成**：INTEGRATED / CODE_REVIEW_PASS_SCOPED / TARGETED_TESTS_PASS / TYPECHECK_PASS / BOUNDARIES_PASS。
- **业务能力**：F01、F03 核心技术合同已显著收敛；F02、F04、F05、F06、F07 仍存在明确的权限或正向流程限制。
- **合并建议**：#272 可作为下一阶段的固定技术集成基线，继续保留 Draft；可以创建新的候选整合分支开展 #261 和 LIVE A/B/C。**不建议直接合入 R07 文档归档分支，不授权自动合并 main/R02。**
- **正式状态**：PASS_SCOPED / NEXT_INTEGRATION_READY / LIVE_NOT_RUN / NOT_PRODUCTION_READY。

本文仅追加独立核验提醒；如后续功能 HEAD 或文档源 SHA 更新，应重新记录对应测试，不向新提交沿用旧 SHA 的验收结论。
