#!/usr/bin/env python3
"""归档隔离验收证据；凭据/profile/transcript/私有绑定从不进入公开目录。"""
import argparse,datetime,hashlib,json,re
from pathlib import Path
p=argparse.ArgumentParser();p.add_argument('--private',required=True);p.add_argument('--out',required=True);a=p.parse_args()
private=Path(a.private).resolve();out=Path(a.out).resolve();out.mkdir(parents=True,exist_ok=True)
if 'p06-recheck-live-' not in str(private) or private==out:raise SystemExit('拒绝非隔离来源')
sha=lambda b:hashlib.sha256(b).hexdigest()
def redact(s):
 s=re.sub(r'(?i)\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b',lambda m:'SESSION_'+sha(m.group().encode())[:12],s)
 s=re.sub(r'\basg-[a-zA-Z0-9_-]+',lambda m:'ASSIGNMENT_'+sha(m.group().encode())[:12],s)
 s=re.sub(r'\b(?:sk-|ghp_|github_pat_)[a-zA-Z0-9_-]{12,}', '[REDACTED_SECRET]',s)
 return s
folders=['original-risk-integrated','gates-integrated-final','automation','original-risk-b95','gates-b95-final','live-b95-final','io-b95-final','live-final','io-final','io-accepted','io','runtime/accepted','runtime/e06-corrected','runtime/e06-initial-attempt','gates-e7323fb4','gates-final','setup']
manifest=[];raw=[]
for folder in folders:
 for f in sorted((private/folder).rglob('*')):
  if not f.is_file():continue
  rel=f.relative_to(private).as_posix()
  if 'private-binding' in f.name or 'private-session' in f.name:continue
  if f.suffix not in ['.json','.log','.png']:continue
  b=f.read_bytes();raw.append({'path':rel,'bytes':len(b),'sha256':sha(b),'privateOnly':True})
  # 只有最终截图和已经检查过的对应类别可公开；失败全屏预览可能暴露路径。
  if f.suffix=='.png':
   if '-failed-' in f.name or folder not in ['live-b95-final'] or not(f.name.startswith(('e05-','e03-','e04-','e06-real-batch')) or f.name.endswith('-cropped.png')):continue
   dest=out/'screenshots'/rel;dest.parent.mkdir(parents=True,exist_ok=True);dest.write_bytes(b);method='unmodified inspected synthetic screenshot'
  else:
   # 重复绿灯日志保留本机；最终标准门禁/正式修复反例及原风险复演完整公开脱敏输出。
   full=folder in ['automation','original-risk-b95','gates-b95-final','gates-integrated-final']
   if f.name.startswith('native') or 'strace' in f.name:
    lines=b.decode(errors='replace').splitlines();selected=[]
    for i,line in enumerate(lines):
     if any(x in line for x in ['review-agent-assignments.json.tmp','review-owner-ids.log','agent-sessions-index.json.tmp','runs-v2/']) and ('openat' in line or 'rename' in line):
      selected.extend(lines[max(0,i-1):min(len(lines),i+3)])
     elif 'ENOSPC' in line:selected.extend(lines[max(0,i-3):min(len(lines),i+2)])
    s=redact('\n'.join(dict.fromkeys(selected))+'\n');method='selected native atomic I/O witness; write data printed as pointers, never transcript'
   elif folder=='setup' and f.suffix=='.log':
    lines=b.decode(errors='replace').splitlines();selected=[line for line in lines if any(x in line for x in ['[审核V2]','[审核后台]','review-agent-assignments.json.tmp','review-owner-ids.log','EACCES','ENOSPC','DevTools listening','Debugger listening','VITE v','exited with code'])]
    s=redact('\n'.join(selected)+'\n');method='selected operational lines; full stdout/stderr private (may contain SDK transcript)'
   elif f.suffix=='.json' or full or folder not in ['gates-final','gates-e7323fb4']:
    s=redact(b.decode(errors='replace'));method='complete text with stable UUID/assignment/secret redaction'
   else:
    s=redact('\n'.join(b.decode(errors='replace').splitlines()[-35:])+'\n');method='historical command tail; raw full log retained locally'
   dest=out/'records'/rel;dest.parent.mkdir(parents=True,exist_ok=True);dest.write_text(s)
  public=dest.read_bytes();raw[-1]['privateOnly']=False
  manifest.append({'publicPath':dest.relative_to(out).as_posix(),'publicBytes':len(public),'publicSha256':sha(public),'rawPath':rel,'rawBytes':len(b),'rawSha256':sha(b),'transformation':method})
for name in ['ci-code-d24.json','ci-code-b95.json']:
 f=private/name
 if f.exists():
  b=f.read_bytes();(out/name).write_bytes(b);manifest.append({'publicPath':name,'publicSha256':sha(b),'rawSha256':sha(b),'transformation':'unmodified public GitHub API metadata'})
root=Path(__file__).resolve().parents[2]
drivers={f.relative_to(root).as_posix():sha(f.read_bytes()) for f in sorted((root/'scripts/qa').glob('review-live-*')) if f.is_file()}
(out/'driver-sha256.json').write_text(json.dumps(drivers,indent=2,ensure_ascii=False)+'\n')
(out/'raw-inventory.json').write_text(json.dumps({'privateRoot':str(private),'warning':'仅列出原始证据哈希；profile/密钥/SDK transcript/私有 binding 未上传。进程被终止的 supervisor exit 不计测试失败。','files':raw},indent=2,ensure_ascii=False)+'\n')
(out/'evidence-manifest.json').write_text(json.dumps({'archivedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'files':manifest,'warning':'rawSha256 与脱敏 publicSha256 分别记录；selected 不是完整 raw。永久原始日志留本机，可在原授权设备复核。'},indent=2,ensure_ascii=False)+'\n')
print(json.dumps({'publishedFiles':len(manifest),'rawFiles':len(raw),'manifestSha256':sha((out/'evidence-manifest.json').read_bytes())}))
