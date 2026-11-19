type ReviewChunkModule = typeof import('./review/review-chunk-entry')

let loadedReviewModule: ReviewChunkModule | null = null
let loadingPromise: Promise<ReviewChunkModule> | null = null

export async function loadReviewChunk(): Promise<ReviewChunkModule> {
  if (loadedReviewModule) return loadedReviewModule
  if (!loadingPromise) {
    loadingPromise = import('./review/review-chunk-entry').then((mod) => {
      loadedReviewModule = mod
      return mod
    })
  }
  return loadingPromise
}
