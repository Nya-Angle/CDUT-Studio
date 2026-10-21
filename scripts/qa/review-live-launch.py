#!/usr/bin/env python3
"""只启动当前仓库的独立 profile；后台监督器保留原始日志和终止退出码。"""
import argparse,json,os,subprocess
from pathlib import Path
p=argparse.ArgumentParser();p.add_argument('--private',required=True);p.add_argument('--name',required=True);a=p.parse_args()
root=Path(__file__).resolve().parents[2];private=Path(a.private).resolve();profile=private/'authorized-profile'
if 'p06-recheck-live-' not in str(private) or not (profile/'electron-dist/electron').is_file():raise SystemExit('拒绝非隔离 profile')
env=os.environ.copy();env.update(PROFER_DEV='1',PROFER_DEV_INSTANCE='p06-recheck-live-auth-20261014',PROFER_VITE_PORT='5176',QA_PROFILE_ROOT=str(profile),PROFER_CONFIG_DIR=str(profile/'config'),PROFER_USER_DATA_DIR=str(profile/'user-data'),ELECTRON_OVERRIDE_DIST_PATH=str(profile/'electron-dist'),QA_APPLICATION_SHA=subprocess.check_output(['git','rev-parse','HEAD'],cwd=root,text=True).strip())
argv=['python3','scripts/qa/review-live-command.py','--out',str(private/'setup'),'--name',a.name,'--','xvfb-run','-a','-s','-screen 0 1600x1000x24','bun','run','dev']
with (private/'setup'/f'{a.name}.supervisor.log').open('wb') as f:
 child=subprocess.Popen(argv,cwd=root,env=env,stdout=f,stderr=f,start_new_session=True)
(private/'setup/daemon-process.json').write_text(json.dumps({'pid':child.pid,'argv':argv})+'\n');print(json.dumps({'pid':child.pid,'name':a.name}))
