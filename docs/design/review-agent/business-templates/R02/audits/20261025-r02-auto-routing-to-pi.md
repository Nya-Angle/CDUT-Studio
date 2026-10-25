# R02 业务模板进入自动匹配—材料分类—Pi 初审：服务级闭环实测（2026-10-25）

## 结论与边界

**结论：在本分支中，已有的 143 份 R02 业务模板可被 C11/B3 自动匹配，20 秒到期由 Main 默认选择、写入真实案卷，进入自动材料分类并启动 Pi 初审。** 本次不是只验证文档：测试实际走 Main IPC、案卷存储、模板仓库及 Pi 读取工具。143 份均逐一成功从路由目录惰性加载、校验并技术绑定。原先未交付的 `T02-T08` 仍不存在，所以是 **143/144**，不虚构第 144 份。

**模板是业务结构，不是学校审核依据。** 用户上传的 `role=rule` 材料才是审核时应优先读取的实际依据；用户提供的申请和证据共同组成案卷。系统不要求“模板代表校方”，也不需要校方授权才能匹配或使用本地业务模板。为适配旧有 Pi 的“已发布模板”接口，可信内置 R02 模板在本地登记为 `published` / `bundled-technical`，**这只是软件内部的技术可用标志，不是政策来源证明、学校发布或审批**。不会生成 `PolicyVersion`，不会打开 `autoPass`。

## 三项实际改动

### 1. 自动匹配能看见全部已交付业务模板

- 新增 `r02-template-catalog/r02-technical-catalog.ts`：143 个确定的模板 ID、版本、业务名称、部分真实材料槽位关键词及对应的惰性定义加载器。索引全部来自这次已审阅的 R02 定义，不生成虚假槽位。
- C11 `catalog()` 统一返回本地已发布模板、143 份 R02 技术索引与既有 D4 目录；已经按需安装的 R02 不重复出现。
- 原有 B3 两层匹配、文内申请事项优先、目录检索、候选排序及 20 秒 Main 倒计时保留；本地信号不足仍走**既有的短模型深匹配**。深匹配返回的 ID/版本和置信度继续经 Main 当前目录核验，不新启动一个 Pi，不盲信 Renderer 回报。
- 不预先把 143 个完整大对象写到用户配置目录，首次选择时才按 ID 加载具体定义。

### 2. 自动确认后的选择真正落入案卷

- C11 的 `LOCAL_PRODUCT_MANUAL_CHOICE_V3`（包括 20 秒 `default`）检查当前原件、会话及 Main 倒计时状态，然后只从**应用打包的可信 R02 定义**惰性取出同版本模板。
- 新增 `installBundledR02TechnicalTemplate`：严格校验 ID、来源、原始 `draft`、无政策引用、禁自动通过以及 `validateTemplate`；带版本锁幂等保存内部技术模板。既有版本内容不一致则拒绝覆写；普通 `saveDraft → publishTemplate` 的 R02 研究稿禁越权门槛仍存在。
- 继续调用项目本身的 `updateNativeWorkspaceSettingsV3`，持久绑定 `templateId + version`，随后 `reclassifyForSelectedTemplate` 依据新的模板槽位重新分拣。原件、改类痕迹、版本门槛沿用基线能力。

### 3. 不增加分类确认操作，直接衔接现有 Pi

- 只有可信 R02 技术模板绑定后的工作台进入自动分类模式：不再多出“确认分类与槽位”阻塞，保留拖动改类和槽位修正。
- 保留本地规则→已有 OCR→已有 4 秒短模型调用的分类降级方案，不启动额外分类 Pi，不更改原件读取方式。
- `preparePiReviewRunV2` 接受此类本地技术模板，建立真实 `ReviewRun`；Pi 的 `review_read_documents` 读取本案上传的申请、规则与证明。现有 `promptFor` 明确要求优先读取用户上传的 `role=rule` 审核依据，通用模板条款不能替代该依据；真实结论仍需原件出处。

## 实测证据

环境：Bun 1.4.2、仓库锁定依赖、Electron TypeScript 编译器。

| 验收项 | 结果 |
| --- | --- |
| 143 个目录项惰性加载、ID/版本核对、真实模板存储及安全标志 | **143/143**；逐项安装、877 项断言包含在两条旅程测试内 |
| 用真实文件“学生休学申请.txt”创建原生案卷，经 Main IPC C11/B3 自动命中 `S01-T01` | **通过**，未用假路由返回值 |
| Main 20 秒期满、默认候选当前性校验、真实 Case 持久绑定 | **通过**；测试使用可控时钟，不实际等待 20 秒 |
| 用户单独上传 `role=rule` 的“本次申请审核依据.txt”；不创建政策引用 | **通过**，材料与模板分离 |
| Pi 建立真实运行，读取本案的申请与审核依据两份文件 | **通过**，`acceptedCount=2` |
| 现有材料自动分类/纠错/复跑及模板仓库、R02 定义专项 | **178 pass / 0 fail，46,861 次断言**（34 文件，包含两条新增 R02 旅程） |
| Electron `typecheck` | **通过**，`NODE_OPTIONS=--max-old-space-size=6144` |
| Electron `build:main` | **通过**；仅现存 `pdfjs-dist/legacy/build/pdf.worker.mjs` `require.resolve` 打包 warning，未报错 |

复现：

```bash
bun test apps/electron/src/main/lib/review/r02-template-catalog/r02-auto-route.journey.test.ts
bun test apps/electron/src/main/lib/review/r02-template-catalog/definitions apps/electron/src/main/lib/review/template-store.test.ts apps/electron/src/main/lib/review/material-auto-classification.test.ts apps/electron/src/main/lib/review/material-auto-to-rerun.journey.test.ts
NODE_OPTIONS=--max-old-space-size=6144 bun run --filter='@profer/electron' typecheck
bun run --filter='@profer/electron' build:main
```

**范围外已知红项**：`review-v3-main-local-product-intake-model.test.ts` 中老的“C11 缓存会话读取授权重验”单测 1 项失败：它在手动删去原件之后期待抛出 `REVIEW_PREUPLOAD_DENIED`，而当前基线实际先报“物理原件无法从案卷受控目录读取并重新核验”。这不是本次 R02 匹配、绑定或 Pi 链路新增的代码路径；不要把全套无条件报告为绿。该老测试的语义与读取前置校验需要另行核对，不能为了绿灯删除测试或绕过门禁。

## 没有宣称完成的部分

- 没有 `T02-T08` 的真实定义：仅 143 份可用，缺项仍待原始模板交付。
- 精确申请事项、可靠关键词及高置信模型匹配可自动触发；模糊、冲突或无可读证据的真实材料**不保证必然选中正确模板**。应保持用户手动搜索/选择入口。
- 本轮验证是可执行服务级流程，不是已在发行版安装包或真实 Electron GUI 下手动点击，也不代表网络模型对 143 个领域的业务结论逐项验证。
- 实际审查依据来自用户文件；没有上传足够规则时，初审只能如实标注依据不足/待补件，不得冒称有规则、替学校作正式批准。

## 固定基线与提交

- 源头固定 SHA：`0a9a917646b87f8b8c2c1f58f544e1053248a0ba`。
- R02 模板定义兼容分支第一阶段 HEAD：`432a0b61982b1bc2386cfcfa97df2defcd7ccd86`。
- 本次新增的自动路由与 Pi 闭环在同一独立分支 `verify/r02-templates-0a9a917-20261025` 上增量交付，不对 `main` 直接改写。
