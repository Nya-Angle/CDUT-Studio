import { app } from 'electron'
import { readFileSync, writeFileSync } from 'node:fs'
import { REVIEW_VISION_SYSTEM_PROMPT } from '../src/main/lib/review/pi-review-executor'

app.whenReady().then(async () => {
  try {
    const { resolveReviewGatewayChannel, chatCompletionWithMeta, reviewPromptWithImages } = await import('../src/main/lib/review/review-model-gateway')
    const resolved = resolveReviewGatewayChannel()
    if (!resolved) throw new Error('no review channel')
    const imagePath = process.env.BENCH_IMAGE_PATH
    if (!imagePath) throw new Error('missing test image path')
    const imageData = `data:image/png;base64,${readFileSync(imagePath).toString('base64')}`
    const question = process.env.BENCH_IMAGE_QUESTION ?? '读取扫描件中清楚可辨、与审核相关的文字，优先列出合成/测试声明、奖项名称、赛事名称、获奖等级、日期、颁发单位及红色作废声明。只返回实际可见内容；看不清的字段单独标注，不要把整页判为不可读。最多 8 条。'
    const response = await chatCompletionWithMeta(resolved.channel, [{
      role: 'system',
      content: REVIEW_VISION_SYSTEM_PROMPT,
    }, {
      role: 'user',
      content: reviewPromptWithImages(question, [imageData]),
    }], { timeoutMs: 90_000, retryWithoutImages: false, maxTokens: 1_000 })
    const result = { status: response.imagesDropped ? 'fallback-without-image' : 'accepted', response: response.text.slice(0, 2_000), usage: response.usage }
    writeFileSync(process.env.BENCH_SUMMARY_PATH ?? '/tmp/deepseek-image-smoke.json', JSON.stringify(result, null, 2))
    process.stdout.write(`IMAGE_SMOKE ${JSON.stringify(result)}\n`)
    app.exit(0)
  } catch (error) {
    const result = { status: 'failed', error: error instanceof Error ? error.message : String(error) }
    writeFileSync(process.env.BENCH_SUMMARY_PATH ?? '/tmp/deepseek-image-smoke.json', JSON.stringify(result, null, 2))
    process.stderr.write(`IMAGE_SMOKE ${JSON.stringify(result)}\n`)
    app.exit(1)
  }
})
