import datetime,hashlib,json,os,subprocess,tempfile,time
from pathlib import Path
root=Path(os.environ['REVIEW_ACCEPTANCE_ROOT']);out=Path(os.environ['REVIEW_ACCEPTANCE_OUT']);out.mkdir(parents=True,exist_ok=True)
env=os.environ.copy();profile=Path(tempfile.mkdtemp(prefix='review-p01-p06-gates-'));env.update(PROFER_CONFIG_DIR=str(profile/'config'),PROFER_USER_DATA_DIR=str(profile/'user-data'),CI='true',NO_COLOR='1')
sha=subprocess.check_output(['git','rev-parse','HEAD'],cwd=root,text=True).strip()
focused=['apps/electron/src/main/lib/review/review-pi-run-bridge.main.test.ts','apps/electron/src/renderer/components/content-review/review-actions-controller.test.ts','apps/electron/src/main/lib/review/review-p06-driver-contract.test.ts']
phase=[str(p.relative_to(root)) for p in sorted((root/'apps/electron/src/main/lib/review').glob('review-*.test.ts')) if any(tag in p.name for tag in ['.p02.','.p03.','.p03-main.','.p04.','.p05.','background-reuse','pi-run-bridge','p06-driver'])]
phase+=['apps/electron/src/renderer/lib/agent-session-list.test.ts','apps/electron/src/renderer/lib/agent-tab-access.test.ts','apps/electron/src/renderer/components/content-review/review-actions-controller.test.ts']
steps=[('01-typecheck',root,['bun','run','typecheck']),('02-p06-focused',root,['bun','test','--isolate','--timeout','30000',*focused]),('03-p01-p06-focused',root,['bun','test','--isolate','--timeout','30000',*phase]),('04-full-tests',root,['bun','test','--isolate','--timeout','30000']),('05-boundaries',root,['bun','run','check:boundaries']),('06-skin-contract',root/'apps/electron',['bun','run','check:skin-contract']),('07-build-main',root/'apps/electron',['bun','run','build:main']),('08-build-preload',root/'apps/electron',['bun','run','build:preload']),('09-build-renderer',root/'apps/electron',['bun','run','build:renderer'])]
results=[]
for name,cwd,args in steps:
 start=datetime.datetime.now(datetime.timezone.utc).isoformat();clock=time.monotonic();log=out/(name+'.log')
 with log.open('wb') as stream:r=subprocess.run(args,cwd=cwd,env=env,stdout=stream,stderr=subprocess.STDOUT)
 results.append(dict(name=name,sha=sha,cwd=str(cwd),argv=args,started_at=start,finished_at=datetime.datetime.now(datetime.timezone.utc).isoformat(),seconds=round(time.monotonic()-clock,3),exit_code=r.returncode,log=log.name,log_sha256=hashlib.sha256(log.read_bytes()).hexdigest()))
 (out/'local-gates-results.json').write_text(json.dumps(dict(sha=sha,initial_code_status=subprocess.check_output(['git','status','--porcelain'],cwd=root,text=True),profile=str(profile),environment={k:env[k] for k in ['PROFER_CONFIG_DIR','PROFER_USER_DATA_DIR','CI','NO_COLOR']},results=results),ensure_ascii=False,indent=2)+'\n')
 print(name+': exit='+str(r.returncode),flush=True)
 if r.returncode:raise SystemExit(r.returncode)
