type CsLabChunkModule = typeof import('./cslab/cslab-chunk-entry')

let loadedCsLabModule: CsLabChunkModule | null = null
let loadingPromise: Promise<CsLabChunkModule> | null = null

export async function loadCsLabChunk(): Promise<CsLabChunkModule> {
  if (loadedCsLabModule) return loadedCsLabModule
  if (!loadingPromise) {
    loadingPromise = import('./cslab/cslab-chunk-entry').then((mod) => {
      loadedCsLabModule = mod
      return mod
    })
  }
  return loadingPromise
}

export function disposeCsLabIfLoaded(): void {
  loadedCsLabModule?.disposeCsLabResources()
}

export function destroyCsLabAgentWindowIfLoaded(): void {
  loadedCsLabModule?.destroyCsLabAgentWindow()
}

export async function grantCsLabToolTrustLazy(labId: string, toolName: string): Promise<void> {
  const mod = await loadCsLabChunk()
  return mod.grantCsLabToolTrust(labId, toolName)
}

export async function revokeCsLabToolTrustLazy(sessionId: string): Promise<void> {
  const mod = await loadCsLabChunk()
  return mod.revokeCsLabToolTrust(sessionId)
}
