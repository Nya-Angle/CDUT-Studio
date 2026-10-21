// A0 截图问题的补测：停止回执只能留在原案卷；复用实际 Jotai/Controller。
import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
const dir = process.env.QA_REPORT_DIR
if (!dir) throw new Error('QA_REPORT_DIR required')
const cases = JSON.parse(readFileSync(join(dir, 'synthetic-cases.json'), 'utf8'))
const pages = await (await fetch('http://127.0.0.1:9222/json/list')).json()
const page = pages.find(p => p.type === 'page' && p.url.includes('localhost:5176') && !p.url.includes('window='))
if (!page) throw new Error('Main renderer missing')
const ws = new WebSocket(page.webSocketDebuggerUrl)
await new Promise((resolve, reject) => { ws.onopen = resolve; ws.onerror = reject })
let seq = 0
const pending = new Map()
ws.onmessage = ({ data }) => { const r = JSON.parse(data); if (pending.has(r.id)) { pending.get(r.id)(r); pending.delete(r.id) } }
const call = (method, params) => new Promise((resolve, reject) => {
  const id = ++seq
  const timer = setTimeout(() => { pending.delete(id); reject(new Error('CDP timeout')) }, 15000)
  pending.set(id, r => { clearTimeout(timer); r.error ? reject(new Error(r.error.message)) : resolve(r.result) })
  ws.send(JSON.stringify({ id, method, params }))
})
const evaluate = async expression => {
  const r = await call('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true })
  if (r.exceptionDetails) throw new Error(r.exceptionDetails.text)
  return r.result.value
}
try {
  const before = await evaluate('document.body.innerText.includes("本次审核已停止。")')
  if (!before) throw new Error('Expected actual stop feedback before switching')
  const selected = await evaluate(`(async()=>{
    const source=await(await fetch('/atoms/review-atoms.ts')).text();
    const {getDefaultStore}=await import(source.split('from "')[1].split('"')[0]);
    const atoms=await import('/atoms/review-atoms.ts');
    const {createReviewActionsController}=await import('/components/content-review/review-actions-controller.ts');
    const store=getDefaultStore();
    await createReviewActionsController(store,window.reviewAPI).selectCase(${JSON.stringify(cases.preflight.id)});
    return store.get(atoms.selectedCaseIdAtom);
  })()`)
  await new Promise(resolve => setTimeout(resolve, 500))
  const after = await evaluate('document.body.innerText.includes("本次审核已停止。")')
  if (selected !== cases.preflight.id || after) throw new Error('Stop feedback crossed case boundary')
  const png = await call('Page.captureScreenshot', { format: 'png' })
  writeFileSync(join(dir, 'a0-display-feedback-isolation.png'), Buffer.from(png.data, 'base64'))
  writeFileSync(join(dir, 'feedback-isolation-result.json'), JSON.stringify({ status: 'PASS', from: cases.stop.id,
    to: selected, beforeStopFeedback: before, afterStopFeedback: after, applicationSha: '14bc7d6c3625aaa6eec2675aa9ce4dc446475297',
    completedAt: new Date().toISOString() }, null, 2) + '\n')
  console.log('PASS: actual stop feedback cleared after case switch')
} finally { ws.close() }
