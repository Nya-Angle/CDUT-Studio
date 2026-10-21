import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

export async function connect(port = 9222, select = p => p.url.startsWith('http://localhost:5176') && !p.url.includes('window=agent-preview')) {
  let target
  const deadline = Date.now() + 60000
  while (!target && Date.now() < deadline) {
    try { const pages = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json(); target = pages.find(select) } catch {}
    if (!target) await new Promise(resolve => setTimeout(resolve, 250))
  }
  if (!target) throw new Error('真实 CDP 目标不存在')
  const ws = new WebSocket(target.webSocketDebuggerUrl)
  await new Promise((resolve, reject) => { ws.onopen = resolve; ws.onerror = reject })
  let sequence = 0
  const pending = new Map()
  ws.onmessage = ({ data }) => {
    const r = JSON.parse(data)
    if (pending.has(r.id)) { pending.get(r.id)(r); pending.delete(r.id) }
  }
  const call = (method, params = {}, sessionId) => new Promise((resolve, reject) => {
    const id = ++sequence
    const timer = setTimeout(() => { pending.delete(id); reject(new Error(`CDP 超时 ${method}`)) }, 120000)
    pending.set(id, r => { clearTimeout(timer); r.error ? reject(new Error(r.error.message)) : resolve(r.result) })
    ws.send(JSON.stringify({ id, method, params, ...(sessionId ? {sessionId} : {}) }))
  })
  const evaluate = async expression => {
    const r = await call('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true, userGesture: true })
    if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description ?? r.exceptionDetails.text)
    return r.result.value
  }
  const poll = async (expression, ms = 45000) => {
    const end = Date.now() + ms
    while (Date.now() < end) { const r = await evaluate(expression); if (r) return r; await new Promise(r => setTimeout(r, 100)) }
    throw new Error('真实运行条件未达到：' + expression.slice(0, 180))
  }
  const click = async text => {
    const rect = await evaluate(`(() => { let b=[...document.querySelectorAll('button,a,[role=button]')].find(b=>b.getClientRects().length&&!b.disabled&&b.textContent.trim().includes(${JSON.stringify(text)}));if(!b){const leaf=[...document.querySelectorAll('body *')].find(e=>e.children.length===0&&e.getClientRects().length&&e.textContent.trim()===${JSON.stringify(text)});b=leaf?.closest('button,a,[role=button],.cursor-pointer')??leaf} if(!b)return null;const r=b.getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2} })()`)
    if (!rect) throw new Error('可用真实按钮缺失：' + text)
    await call('Input.dispatchMouseEvent', { type: 'mousePressed', button: 'left', clickCount: 1, ...rect })
    await call('Input.dispatchMouseEvent', { type: 'mouseReleased', button: 'left', clickCount: 1, ...rect })
  }
  const screenshot = async (dir, name, clip) => {
    const png = await call('Page.captureScreenshot', { format: 'png', ...(clip ? { clip } : {}) })
    writeFileSync(join(dir, name + '.png'), Buffer.from(png.data, 'base64'))
  }
  return { call, evaluate, poll, click, screenshot, close: () => ws.close() }
}

export const storeAccess = `const source=await(await fetch('/atoms/review-atoms.ts')).text();const {getDefaultStore}=await import(source.split('from "')[1].split('"')[0]);const atoms=await import('/atoms/review-atoms.ts');const store=getDefaultStore();const {createReviewActionsController}=await import('/components/content-review/review-actions-controller.ts');`

export async function ensureReviewPage(cdp) {
  await cdp.poll('!!document.body && !!window.reviewAPI')
  await cdp.poll('document.body.innerText.trim().length > 10')
  if (await cdp.evaluate(`!!document.querySelector('[aria-label="展开侧边栏"]')`)) await cdp.evaluate(`document.querySelector('[aria-label="展开侧边栏"]').click();true`)
  await cdp.poll(`document.body.innerText.includes('待我处理')||document.body.innerText.includes('材料审核')||document.body.innerText.includes('CDUT 专区')`)
  if (await cdp.evaluate('document.body.innerText.includes("待我处理")')) return
  if (!await cdp.evaluate('!!document.querySelector("input[type=password]")') && !await cdp.evaluate('document.body.innerText.includes("材料审核")')) await cdp.click('CDUT 专区')
  if (await cdp.evaluate('!!document.querySelector("input[type=password]")')) {
    const doc = readFileSync('docs/design/review-agent/16-batch-review-stage-b-local-acceptance.md', 'utf8')
    const value = label => doc.match(new RegExp('\\|\\s*' + label + '\\s*\\|\\s*([^|]+)\\|'))?.[1]?.trim().replace(/`/g, '')
    const user = value('账号'), pass = value('密码')
    if (!user || !pass) throw new Error('公开离线演示凭据未定义')
    await cdp.evaluate(`(()=>{const p=document.querySelector('input[type=password]');const u=[...document.querySelectorAll('input')].find(e=>e!==p&&e.getClientRects().length&&['text','number','tel',''].includes(e.type));const setter=Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set;for(const [el,v]of [[u,${JSON.stringify(user)}],[p,${JSON.stringify(pass)}]]){setter.call(el,v);el.dispatchEvent(new Event('input',{bubbles:true}));el.dispatchEvent(new Event('change',{bubbles:true}))}return true})()`)
    await cdp.click('一键连接特区账户')
  }
  await cdp.poll('document.body.innerText.includes("材料审核")')
  await cdp.click('材料审核')
  await cdp.poll('document.body.innerText.includes("待我处理")')
}
