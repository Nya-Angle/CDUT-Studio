# Review V3 实机 E2E 驱动

真实 Electron + xvfb 虚拟屏下驱动 Review V3 全链路，零新增依赖（仅用 Node 内置
`WebSocket` 走 CDP，不装 Playwright）。

## 用法

```bash
# 1) 准备真实渠道与测试模型（默认 AMD Radeon / GLM-5.3-Flash）
node work/e2e/setup-config.mjs

# 2) 跑场景（必须用 xvfb，headless 下 Electron 渲染进程起不来）
xvfb-run -a node work/e2e/v3-e2e.mjs <scenario>
```

## 场景

| 场景 | 覆盖 handoff §4 步骤 | 说明 |
|---|---|---|
| `probe` | — | 启动并报告 preload 暴露的 API 表面 |
| `diag-config` | — | 应用内可见的渠道/模型选择 |
| `diag-channel` | — | 真实渠道连通性（解密 key + 发请求） |
| `d4-list` | 第 3 步 | D4 50 套目录可读性 |
| `flow-core` | 1~4 | 案卷 → PDF/DOCX → D4 Plan → 网关自检 |
| `flow-full` | 1~5 | 上述 + 真实 Provider Pi 审核 + Run/Check + MD 导出 |
| `flow-b1` | 第 7 步 | 第 51 套：保存→读回→预览→冻结→安装→材料 |
| `phase-prepare` / `phase-verify` | 第 6 步 | 冷重启恢复（两次独立进程） |

## 环境变量

| 变量 | 作用 |
|---|---|
| `E2E_PDF_PATH` / `E2E_DOCX_PATH` | 真实材料路径 |
| `E2E_KEEP_CONFIG=1` | 保留配置根（默认每次清空以保证可复现） |
| `E2E_CASE_ID` | `phase-verify` 要核对的案卷 |
| `E2E_POLL_MS` | `flow-full` 等待审核终态的上限（默认 360000） |
| `E2E_CHANNEL_NAME` / `E2E_MODEL_ID` | 覆盖测试渠道与模型 |
| `E2E_VERBOSE=1` | 打印主进程日志 |
| `PROFER_PI_REVIEW_FIRST_BYTE_TIMEOUT_MS` | 审核首字节看门狗阈值（默认自动取 `min(240s, Pi 传输层空闲超时-15s)`，Pi 默认 300s → 285s） |
| `PROFER_PI_REVIEW_TURN_STALL_TIMEOUT_MS` | 审核整轮无进展看门狗阈值（默认 1200000 = 20min） |

> 看门狗只对审核档案（`toolProfile='review'`）启用。压测看门狗时把首字节阈值调小
> （如 `90000`），正常回归时保持默认，避免把真实的慢审核当故障。

## 关键约束

- **必须用 xvfb**：未打包时主进程固定加载 `http://localhost:5174`（Vite dev server），
  所以跑之前要先起 `cd apps/electron && bun run dev:vite`。
- 渠道配置有两个开关层级：渠道 `enabled` 与**模型级 `enabled`**，缺一不可。
- API Key 是 `proferv1:` AES-GCM，密钥由 `device.json` 的 deviceId 派生，
  换配置根必须同时复制 `device.json`，否则解密失败。

## 测试材料

`materials/evidence.pdf`（6 页真实 PDF，含文本层）、`materials/evidence.docx`
（合法 OOXML，含标题/表格）由脚本生成，均为合成数据，不含任何真实学生信息。
