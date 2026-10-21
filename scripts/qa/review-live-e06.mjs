// 普通 Pi 的真实工具/权限/停止与 Renderer 预览子矩阵；缺少的外部前置条件单独登记。
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import assert from 'node:assert/strict'
import { connect, storeAccess, ensureReviewPage } from './review-live-cdp.mjs'
const dir = process.env.QA_REPORT_DIR, profile = process.env.QA_PROFILE_ROOT
const selected = JSON.parse(readFileSync(join(profile, 'config/review-module-settings.json'), 'utf8')).agentModelSelection
const renderer = await connect(), main = await connect(9230, () => true)
const q = JSON.stringify, rows = []
const save = () => writeFileSync(join(dir, 'e06-matrix.json'), JSON.stringify({ sourceSha: process.env.QA_APPLICATION_SHA, status: 'PARTIAL', rows }, null, 2) + '\n')
async function record(id, fn) {
  const row = { id, status: 'RUNNING', assertions: [], startedAt: new Date().toISOString() }; rows.push(row); save()
  const check = (name, ok) => { row.assertions.push({ name, pass: !!ok }); assert.ok(ok, name) }
  try { await fn(row, check); row.status = 'PASS' }
  catch (error) { row.status = 'FAIL'; row.error = String(error); process.exitCode = 1 }
  finally { row.finishedAt = new Date().toISOString(); save(); console.log(JSON.stringify({ id, status: row.status, assertions: row.assertions.length, error: row.error })) }
}
const session = await renderer.evaluate(`window.electronAPI.createAgentSession('P06 普通 Pi 工具权限预览',${q(selected.channelId)},undefined,${q(selected.modelId)})`)
const workspace = join(profile, 'config/agent-workspaces/default', session.id)
mkdirSync(workspace, { recursive: true })
writeFileSync(join(workspace, 'tool-positive.txt'), 'P06_TOOL_READ_REAL_OK\n')
let permissionMode = 'bypassPermissions'
// 与真实 AgentView 相同：本轮权限选择通过 permissionModeOverride 传入。
const send = message => `window.electronAPI.sendAgentMessage({sessionId:${q(session.id)},channelId:${q(selected.channelId)},modelId:${q(selected.modelId)},agentRuntime:'pi',permissionModeOverride:${q(permissionMode)},triggeredBy:'user',uuid:crypto.randomUUID(),userMessage:${q(message)}})`
const toolNames = () => renderer.evaluate(`(async()=>{const m=await window.electronAPI.getAgentSessionSDKMessages(${q(session.id)});return m.filter(x=>x.type==='assistant').flatMap(x=>x.message?.content??[]).filter(x=>x.type==='tool_use').map(x=>x.name)})()`)
try {
  await record('E06-PI-READ-TOOL', async (row, check) => {
    const visible = await renderer.evaluate(`(async()=>{const list=await window.electronAPI.listAgentSessions(true);const meta=await window.electronAPI.getAgentSessionMeta(${q(session.id)});return {visible:list.some(s=>s.id===${q(session.id)}),readable:meta?.id===${q(session.id)},ordinary:!meta?.owner}})()`)
    check('普通 create/list/meta 正常', visible.visible && visible.readable && visible.ordinary)
    await renderer.evaluate(send('这是隔离合成验收。请实际调用 read 工具读取当前工作目录的 tool-positive.txt，然后只回复文件里的标记。不要读取其他文件，不使用其他工具。'))
    row.toolCalls = await toolNames()
    check('真实模型实际发起 read 工具', row.toolCalls.some(n => n.toLowerCase() === 'read'))
    check('普通会话工具读取后已释放', !await main.evaluate(`__p06Live.isAgentSessionActive(${q(session.id)})`))
  })
  await record('E06-PI-PERMISSION-DENY-RECOVER', async (row, check) => {
    await renderer.evaluate(`window.electronAPI.updateSessionPermissionMode(${q(session.id)},'auto')`)
    permissionMode = 'auto'
    await renderer.evaluate(`window.__e06Write={done:false};window.__e06Write.promise=${send('合成权限测试。请实际调用 write 工具创建当前工作目录下 permission-fixture.txt，内容 P06_PERMISSION_WRITE_OK。如被拒绝，只回复拒绝，不要重试或换工具。')}.then(()=>{window.__e06Write.done=true;return true});true`)
    const request = await renderer.poll(`(async()=>{const p=await window.electronAPI.getPendingRequests();const r=p.permissions.find(r=>r.sessionId===${q(session.id)});return r?{requestId:r.requestId,toolName:r.toolName}:false})()`, 60000)
    row.deniedTool = request.toolName
    check('真实 Pi 工具进入权限 pending', request.toolName.toLowerCase().includes('write'))
    await renderer.screenshot(dir, 'e06-permission-request-cropped', { x: 315, y: 82, width: 1270, height: 780, scale: 1 })
    await renderer.evaluate(`window.electronAPI.respondPermission({requestId:${q(request.requestId)},behavior:'deny',alwaysAllow:false})`)
    await renderer.evaluate('window.__e06Write.promise')
    check('拒绝后合成文件未写入', !existsSync(join(workspace, 'permission-fixture.txt')))
    await renderer.evaluate(`window.__e06Write={done:false};window.__e06Write.promise=${send('现在执行新的合成权限测试，请实际调用 write 工具创建 permission-fixture.txt，内容 P06_PERMISSION_WRITE_OK。获得允许后只回复完成，不做其他操作。')}.then(()=>{window.__e06Write.done=true;return true});true`)
    const next = await renderer.poll(`(async()=>{const p=await window.electronAPI.getPendingRequests();const r=p.permissions.find(r=>r.sessionId===${q(session.id)});return r?{requestId:r.requestId,toolName:r.toolName}:false})()`, 60000)
    await renderer.evaluate(`window.electronAPI.respondPermission({requestId:${q(next.requestId)},behavior:'allow',alwaysAllow:false})`)
    await renderer.evaluate('window.__e06Write.promise')
    check('新授权实际恢复写入', existsSync(join(workspace, 'permission-fixture.txt')) && readFileSync(join(workspace, 'permission-fixture.txt'), 'utf8').includes('P06_PERMISSION_WRITE_OK'))
    const pending = await renderer.evaluate(`window.electronAPI.getPendingRequests().then(p=>p.permissions.filter(r=>r.sessionId===${q(session.id)}).length)`)
    check('授权完成没有旧 pending 残留', pending === 0)
  })
  await record('E06-PI-STOP-IN-FLIGHT', async (row, check) => {
    await renderer.evaluate(`window.__e06Sending={done:false};window.__e06Sending.promise=${send('这是合成停止测试。请输出一段2000字的测试说明，不执行任何工具。')}.then(()=>{window.__e06Sending.done=true;return true});true`)
    await main.poll(`__p06Live.isAgentSessionActive(${q(session.id)})`)
    check('普通发送实际处于进行中', !await renderer.evaluate('window.__e06Sending.done'))
    await renderer.evaluate(`window.electronAPI.stopAgent(${q(session.id)})`)
    await renderer.evaluate('window.__e06Sending.promise')
    check('普通停止释放 executor', !await main.evaluate(`__p06Live.isAgentSessionActive(${q(session.id)})`))
  })
  await record('E06-DESKTOP-TEXT-PREVIEW', async (row, check) => {
    const path = join(workspace, 'tool-positive.txt')
    const view = await renderer.evaluate(`(async()=>{${storeAccess}const p=await import('/components/diff/preview-opener.ts');const a=await import('/atoms/active-view.ts');store.set(a.activeViewAtom,'conversations');const tab=await p.openFilePreviewTabAuthorized(store,${q(session.id)},{filePath:${q(path)},previewOnly:true,readOnly:true});const read=await window.electronAPI.resolveAndReadFile(${q(path)},{sessionId:${q(session.id)}});return {tabOpened:!!tab,fileRead:read?.content.includes('P06_TOOL_READ_REAL_OK')}})()`)
    check('真实 Main 授权读取与 Renderer 预览 Tab', view.tabOpened && view.fileRead)
    // @pierre/diffs 用 Shadow DOM；必须检查真实代码节点，body.innerText 不能见证内容。
    const visibleText = '(()=>{const visit=n=>[n.textContent??"",...[...n.querySelectorAll?.("*")??[]].filter(e=>e.shadowRoot).map(e=>visit(e.shadowRoot))].join(" ");return visit(document).includes("P06_TOOL_READ_REAL_OK")})()'
    await renderer.poll(visibleText)
    check('真实 Renderer Shadow DOM 显示合成文件内容', await renderer.evaluate(visibleText))
    const png = await renderer.call('Page.captureScreenshot', { format: 'png', clip: { x: 315, y: 82, width: 1270, height: 780, scale: 1 } })
    writeFileSync(join(dir, 'e06-text-preview-rendered-cropped.png'), Buffer.from(png.data, 'base64'))
    await ensureReviewPage(renderer)
    check('预览后审核页面切换仍可用', await renderer.evaluate('document.body.innerText.includes("待我处理")'))
  })
  const providers = await renderer.evaluate('window.electronAPI.listChannels().then(list=>list.filter(c=>c.enabled).map(c=>({provider:c.provider,modelCount:c.models.filter(m=>m.enabled!==false).length})))')
  rows.push({ id: 'E06-PROVIDER-INVENTORY', status: 'PASS', providers, scope: '只记录 provider 种类与可用模型数量，不输出渠道 ID/密钥' })
  rows.push({ id: 'E06-CLAUDE', status: 'NOT-RUN', reason: '隔离授权 profile 仅复制已有 Pi 渠道；没有 Claude runtime/provider 的授权测试配置' })
  rows.push({ id: 'E06-POCKET-RELAY', status: 'BLOCKED', reason: 'P05-RELAY-ROUTE-01 与 P05-POCKET-FIFO-01 保留；无真实多 viewer/ticket 或独立目标验收权限' })
  rows.push({ id: 'E06-WINDOWS-MACOS', status: 'NOT-RUN', reason: '当前设备为 Linux；需对应平台独立 profile 与原生构建' })
  rows.push({ id: 'E06-PDF-OFFICE-RESTORE', status: 'NOT-RUN', reason: '本次完成文本预览子集；扫描 PDF/Office/多窗口/应用恢复完整矩阵需独立原件回执证据' })
  save()
} finally {
  await renderer.evaluate(`window.electronAPI.stopAgent(${q(session.id)})`).catch(() => {})
  await main.evaluate(`__p06Live.stopAgentAndWait(${q(session.id)});true`).catch(() => {})
  renderer.close(); main.close()
}
