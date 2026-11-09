/**
 * @profer/ui/kline-renderer — 实时行情流与零拷贝数据总线上下文 (KLineMarketContext)
 *
 * 设计目标：
 *   1. 支持大模型直接输出挂载特定股票代码的渲染块（`mode: live`, `symbol: SH600519`）；
 *   2. 预留统一的 `IKLineDataFeedAdapter` 接口，宿主可注入真实券商 WebSocket / Electron IPC /
 *      SharedArrayBuffer Worker 行情源；
 *   3. 默认内置实验室级跳跃扩散（Merton Jump-Diffusion）高频行情发生器与闪电崩盘压测源，
 *      开箱即可体验微秒级无锁环形缓冲区（LockFreeTickRingBuffer）驱动的实时 K 线与 L2 盘口跳动。
 */

import * as React from 'react'
import {
  createBuiltInMarketFeedAdapter,
  type IKLineDataFeedAdapter,
} from '@profer/shared'

const defaultAdapter = createBuiltInMarketFeedAdapter()

export const KLineMarketContext = React.createContext<IKLineDataFeedAdapter>(defaultAdapter)

export interface KLineMarketProviderProps {
  /** 自定义实时行情适配器（WebSocket / IPC / SharedArrayBuffer）；未传时使用内置高频仿真引擎 */
  adapter?: IKLineDataFeedAdapter
  children: React.ReactNode
}

export function KLineMarketProvider({
  adapter = defaultAdapter,
  children,
}: KLineMarketProviderProps): React.ReactElement {
  return (
    <KLineMarketContext.Provider value={adapter}>
      {children}
    </KLineMarketContext.Provider>
  )
}

/** 获取当前上下文挂载的 K 线实时行情适配器 */
export function useKLineMarketFeed(): IKLineDataFeedAdapter {
  return React.useContext(KLineMarketContext)
}
