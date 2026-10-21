#!/usr/bin/env python3
"""隔离实机验收命令采集：原始输出只写指定的私有目录。"""
import argparse
import datetime
import hashlib
import json
import os
from pathlib import Path
import subprocess
import sys

p = argparse.ArgumentParser()
p.add_argument('--out', required=True)
p.add_argument('--name', required=True)
p.add_argument('--cwd', default=os.getcwd())
p.add_argument('command', nargs=argparse.REMAINDER)
a = p.parse_args()
argv = a.command[1:] if a.command[:1] == ['--'] else a.command
out = Path(a.out)
out.mkdir(parents=True, exist_ok=True)
now = lambda: datetime.datetime.now(datetime.timezone.utc).isoformat()
sha = subprocess.check_output(['git', 'rev-parse', 'HEAD'], cwd=a.cwd, text=True).strip()
entry = dict(name=a.name, sourceSha=sha, cwd=a.cwd, argv=argv, startedAt=now(),
             environment={k: v for k, v in os.environ.items() if k in {
                 'PROFER_CONFIG_DIR', 'PROFER_USER_DATA_DIR', 'PROFER_DEV', 'PROFER_DEV_INSTANCE',
                 'PROFER_VITE_PORT', 'ELECTRON_OVERRIDE_DIST_PATH', 'QA_PROFILE_ROOT',
                 'QA_REPORT_DIR', 'QA_APPLICATION_SHA', 'QA_SOURCE_PATH', 'REVIEW_RISK_OUT',
                 'REVIEW_ACCEPTANCE_ROOT', 'CI', 'NO_COLOR'}})
entry['workingTreeDirty'] = bool(subprocess.check_output(['git','status','--porcelain'],cwd=a.cwd,text=True).strip())
entry['qaSourceSha256'] = {f.relative_to(Path(a.cwd)).as_posix():hashlib.sha256(f.read_bytes()).hexdigest() for f in (Path(a.cwd)/'scripts/qa').glob('review-live-*') if f.is_file()}
with (out / (a.name + '.stdout.log')).open('wb') as stdout, (out / (a.name + '.stderr.log')).open('wb') as stderr:
    result = subprocess.run(argv, cwd=a.cwd, stdout=stdout, stderr=stderr)
entry.update(finishedAt=now(), exitCode=result.returncode)
entry['files'] = {f.name: {'sha256': hashlib.sha256(f.read_bytes()).hexdigest(), 'bytes': f.stat().st_size}
                  for f in [out / (a.name + '.stdout.log'), out / (a.name + '.stderr.log')]}
(out / (a.name + '.command.json')).write_text(json.dumps(entry, ensure_ascii=False, indent=2) + '\n')
print(json.dumps({'name': a.name, 'exitCode': result.returncode, 'sourceSha': sha}))
sys.exit(result.returncode)
