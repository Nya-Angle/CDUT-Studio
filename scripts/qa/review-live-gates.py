#!/usr/bin/env python3
"""按当前 workflow 执行本地标准门禁，逐步保留完整命令/输出/退出码。"""
import argparse
import json
import os
from pathlib import Path
import re
import subprocess
import tempfile

p = argparse.ArgumentParser()
p.add_argument('--out', required=True)
a = p.parse_args()
root = Path(__file__).resolve().parents[2]
out = Path(a.out)
out.mkdir(parents=True, exist_ok=True)
profile = Path(tempfile.mkdtemp(prefix='p06-live-gates-'))
env = os.environ.copy()
env.update(PROFER_CONFIG_DIR=str(profile / 'config'), PROFER_USER_DATA_DIR=str(profile / 'user-data'),
           CI='true', NO_COLOR='1', ELECTRON_SKIP_BINARY_DOWNLOAD='1')
steps = [('01-frozen-install', root, ['bun', 'install', '--frozen-lockfile']),
         ('02-typecheck', root, ['bun', 'run', 'typecheck']),
         ('03-boundaries', root, ['bun', 'run', 'check:boundaries'])]
steps += [(name, root / 'apps/electron', ['bun', 'run', command]) for name, command in [
    ('04-skin', 'check:skin-contract'), ('05-main', 'build:main'),
    ('06-preload', 'build:preload'), ('07-renderer', 'build:renderer')]]
steps += [('08-focused', root, ['bun', 'test', '--isolate', '--timeout', '30000',
    'apps/electron/src/main/lib/review/review-startup-io-recovery.p06.test.ts',
    'apps/electron/src/main/lib/review/review-batch-case-fallback.p06.test.ts',
    'apps/electron/src/main/lib/agent-orchestrator-permission-wiring.p06.test.ts',
    'apps/electron/src/main/lib/review-owner-index-recovery.p06-fix01.test.ts',
    'apps/electron/src/main/lib/review/review-background-reuse.probe.test.ts',
    'apps/electron/src/main/lib/review/review-pi-run-bridge.main.test.ts',
    'apps/electron/src/renderer/components/content-review/review-actions-controller.test.ts',
    'apps/electron/src/renderer/components/content-review/review-workspace-write-fence.p06-fix02.test.ts',
    'apps/electron/src/renderer/components/content-review/review-workspace-recheck-independent.test.ts']),
    ('09-full-regression', root, ['bun', 'test', '--isolate', '--timeout', '30000'])]
# 只提取当前版本 workflow 内的真实 bun test 命令，保留各工作流的用例边界。
for group, workflow in [('d2', 'review-d2-tests.yml'), ('baseline', 'review-ci-baseline.yml'), ('batch', 'review-batch-tests.yml')]:
    text = (root / '.github/workflows' / workflow).read_text()
    commands = re.findall(r'(?m)^\s*(?:run:\s*)?(bun test[^\n]+)$', text)
    for i, command in enumerate(commands, 1):
        steps.append((f'10-{group}-{i:02}', root, command.split()))
failed = []
for name, cwd, argv in steps:
    result = subprocess.run(['python3', str(root / 'scripts/qa/review-live-command.py'),
        '--out', str(out), '--name', name, '--cwd', str(cwd), '--', *argv], cwd=root, env=env)
    if result.returncode:
        failed.append(name)
        # 类型门禁失败时禁止继续构建，真实失败仍保留。
        if name == '02-typecheck': break
(out / 'gates-summary.json').write_text(json.dumps({'sourceSha': subprocess.check_output(
    ['git', 'rev-parse', 'HEAD'], cwd=root, text=True).strip(), 'steps': len(steps), 'failed': failed,
    'profile': str(profile)}, indent=2) + '\n')
raise SystemExit(bool(failed))
