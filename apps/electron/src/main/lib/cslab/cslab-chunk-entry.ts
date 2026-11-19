import { registerCsLabIpc } from './cslab-router'
import { grantCsLabToolTrust, revokeCsLabToolTrust } from './cslab-tool-trust'
import { closeAllLabToolWatchers } from './cslab-tool-registry'
import { closeAllVaultWatchers } from './cslab-canvas-sync'
import { closeAllCsLabVaultCaches } from './cslab-vault-cache'
import { stopAllShareWatchers } from './cslab-share-watcher'
import { closeAllShareDatabases } from './cslab-share-db'
import { stopAllHpcBridges } from './cslab-hpc'
import { closeAllHpcDatabases } from './cslab-hpc-db'
import { closeAllCsLabDatabases } from './cslab-db'
import { stopAllZoteroWatchers } from './cslab-zotero'
import { destroyCsLabAgentWindow } from './cslab-window-manager'

export { registerCsLabIpc, grantCsLabToolTrust, revokeCsLabToolTrust, destroyCsLabAgentWindow }

/** 统一释放 CSLab 相关监听器、数据库连接与独立窗口 */
export function disposeCsLabResources(): void {
  void closeAllVaultWatchers()
  void closeAllLabToolWatchers()
  void stopAllShareWatchers()
  void stopAllHpcBridges()
  closeAllCsLabVaultCaches()
  closeAllShareDatabases()
  closeAllHpcDatabases()
  void stopAllZoteroWatchers()
  closeAllCsLabDatabases()
  destroyCsLabAgentWindow()
}
