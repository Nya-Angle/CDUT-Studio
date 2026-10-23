/**
 * 可随 U 盘交接的单文件离线填写页。数据完全留在本机浏览器，不发网络请求。
 * 签发包仍由 Main 生成；表单只把真实任务转成 T09 协议规定的哈希回件。
 */
export function buildT09OfflineFormHtml(taskJson: string): string {
  const task: unknown = JSON.parse(taskJson)
  if (!task || typeof task !== 'object' ||
      (task as { type?: string }).type !== 'task' ||
      (task as { format?: string }).format !== 'cdut-review-offline/1') {
    throw new Error('签发内容不是有效的离线任务包')
  }
  // script 的 JSON 文本必须转义 <，阻止材料文本中的 </script> 跳出数据标签。
  const embedded = JSON.stringify(task).replace(/</g, '\\u003c').replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029')
  return `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>CDUT Studio · 离线任务填写</title>
<style>
*{box-sizing:border-box}body{font-family:system-ui,-apple-system,"Microsoft YaHei",sans-serif;background:#f3f7f5;color:#18312a;margin:0;padding:24px}
main{max-width:800px;margin:auto;background:white;border-radius:20px;padding:30px;box-shadow:0 12px 48px #153c2b15}
h1{margin:0 0 6px;font-size:26px}h2{margin:20px 0 8px;font-size:18px}p{line-height:1.6}
.muted{color:#5e746c}.box{border:1px solid #dce8e1;border-radius:12px;padding:14px;margin:12px 0}
label{display:block;margin:14px 0;font-weight:600}textarea,input[type=number],input[type=file]{display:block;width:100%;font:inherit;margin-top:6px;padding:10px;border:1px solid #bdcec4;border-radius:8px}
textarea{min-height:120px;resize:vertical}button{border:0;border-radius:10px;background:#08784b;color:white;padding:12px 18px;font-weight:600;cursor:pointer}
.score{display:grid;grid-template-columns:1fr 110px 80px;gap:12px;align-items:center;margin:12px 0}.score input{margin:0}
#message{min-height:22px;color:#a03f20;white-space:pre-wrap}small{color:#5e746c}
</style></head><body><main><h1>离线审核任务</h1>
<p class="muted">在本机填写，点击“保存回件文件”，再将下载的回件文件交回审核人导入。无需联网、无需编辑文件内容。</p>
<div id="summary" class="box"></div><div id="form"></div>
<p id="message" role="status"></p>
<button id="save" type="button">保存回件文件</button>
<p><small>回件内的哈希仅用于文件完整性检查，不代表签名或身份认证。请交给正确的审核人。</small></p>
</main><script type="application/json" id="task-data">${embedded}</script><script>
(() => {
  'use strict';
  const task = JSON.parse(document.getElementById('task-data').textContent);
  const summary = document.getElementById('summary');
  const form = document.getElementById('form');
  const message = document.getElementById('message');
  const heading = document.createElement('h2');
  heading.textContent = task.publicContext?.title || '审核案卷';
  summary.append(heading);
  const info = document.createElement('p');
  info.textContent = '案卷 ' + task.caseId + ' · 任务 ' + task.packageId + ' · ' + (task.recipient?.role === 'judge' ? '独立评分' : '补件应答');
  summary.append(info);
  const desc = document.createElement('p');
  desc.textContent = task.task.kind === 'student-reply' ? task.task.reason : '请根据下列量表逐项评分';
  form.append(desc);
  const make = (tag, label, type) => {
    const wrap = document.createElement('label'); wrap.textContent = label;
    const input = document.createElement(tag);
    if (type) input.type = type;
    wrap.append(input); form.append(wrap); return input;
  };
  let note, attachments, feedback, internal;
  const scores = [];
  if (task.task.kind === 'student-reply') {
    const needed = document.createElement('p');
    needed.textContent = '所需内容：' + (task.task.requiredElements || []).join('、');
    form.append(needed);
    note = make('textarea', '补件说明');
    attachments = make('input', '可选：附加证明文件', 'file');
    attachments.multiple = true;
  } else {
    for (const dim of task.task.dimensions || []) {
      const row = document.createElement('div'); row.className = 'score';
      const title = document.createElement('span'); title.textContent = dim.title + '（' + dim.min + '–' + dim.max + '）';
      const input = document.createElement('input'); input.type = 'number'; input.min = String(dim.min); input.max = String(dim.max); input.step = 'any'; input.setAttribute('aria-label', dim.title + '得分');
      const naLabel = document.createElement('label'); naLabel.style.margin = '0';
      const na = document.createElement('input'); na.type = 'checkbox'; na.disabled = !dim.allowNA;
      na.addEventListener('change', () => { input.disabled = na.checked; if (na.checked) input.value = ''; });
      naLabel.append(na, '不适用'); row.append(title, input, naLabel); form.append(row);
      scores.push({ dim, input, na });
    }
    feedback = make('textarea', '公开反馈');
    internal = make('textarea', '评委内部备注（可选）');
  }
  const canonical = value => value === null || typeof value !== 'object'
    ? (JSON.stringify(value) ?? 'null')
    : Array.isArray(value) ? '[' + value.map(canonical).join(',') + ']'
    : '{' + Object.keys(value).filter(key => value[key] !== undefined).sort().map(key => JSON.stringify(key) + ':' + canonical(value[key])).join(',') + '}';
  const sha256 = async bytes => Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', bytes)))
    .map(byte => byte.toString(16).padStart(2, '0')).join('');
  const bytesOf = str => new TextEncoder().encode(str);
  const createId = () => crypto.randomUUID?.() || ('offline-' + Date.now() + '-' + Math.random().toString(36).slice(2));
  const save = (content, name) => {
    const url = URL.createObjectURL(new Blob([content], { type: 'application/json;charset=utf-8' }));
    const a = document.createElement('a'); a.href = url; a.download = name; document.body.append(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  };
  document.getElementById('save').addEventListener('click', async () => {
    message.textContent = '';
    try {
      if (!crypto?.subtle) throw new Error('当前浏览器无法离线计算文件校验码，请使用新版 Chromium、Edge 或 Firefox 打开本文件');
      let reply;
      if (task.task.kind === 'student-reply') {
        const assets = [];
        const selected = [...(attachments.files || [])];
        if (selected.some(file => file.size > 16 * 1024 * 1024) || selected.reduce((n, file) => n + file.size, 0) > 40 * 1024 * 1024) {
          throw new Error('单个附件最大 16MB，一次补件附件合计最大 40MB');
        }
        for (const file of selected) {
          const bytes = new Uint8Array(await file.arrayBuffer());
          let binary = '';
          for (let i = 0; i < bytes.length; i += 8192) binary += String.fromCharCode(...bytes.subarray(i, i + 8192));
          assets.push({ name: file.name, mimeType: file.type || 'application/octet-stream',
            dataBase64: btoa(binary), sha256: await sha256(bytes) });
        }
        if (!note.value.trim() && !assets.length) throw new Error('请填写补件说明或选择附件');
        reply = { kind: 'student-reply', supplementId: task.task.supplementId, note: note.value.trim(), assets };
      } else {
        const values = scores.map(({ dim, input, na }) => {
          const value = Number(input.value);
          if (!na.checked && (!input.value.trim() || !Number.isFinite(value) || value < dim.min || value > dim.max)) {
            throw new Error('请为“' + dim.title + '”填写区间内的评分，或选择允许的不适用');
          }
          return { dimensionId: dim.id, score: na.checked ? null : value, na: na.checked };
        });
        reply = { kind: 'judge-rating-reply', assignmentId: task.task.assignmentId,
          rubricVersion: task.task.rubricVersion, scores: values, publicFeedback: feedback.value,
          ...(internal.value.trim() ? { internalNotes: internal.value.trim() } : {}) };
      }
      const body = { type: 'reply', format: task.format, packageId: createId(), actionId: createId(),
        caseId: task.caseId, baseRevision: task.baseRevision, lock: task.lock,
        createdAt: new Date().toISOString(), requestPackageId: task.packageId,
        requestHash: task.hash, respondent: task.recipient, reply };
      const hash = await sha256(bytesOf(canonical(body)));
      save(JSON.stringify({ ...body, hash }, null, 2), 'cdut-review-reply-' + task.caseId + '.cdutreply');
      message.textContent = '回件已生成。请把下载的文件交回审核人，不需要再编辑文件内容。';
    } catch (error) { message.textContent = error instanceof Error ? error.message : String(error); }
  });
})();
</script></body></html>`
}
