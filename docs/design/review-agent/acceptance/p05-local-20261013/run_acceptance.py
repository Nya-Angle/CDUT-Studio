import datetime as dt
import glob
import hashlib
import json
import os
from pathlib import Path
import platform
import re
import shlex
import subprocess
import time

WORKTREE = Path('/home/miku/Bot/CDUTStudio/.workdir/p05-local-acceptance-20261013')
ARTIFACTS = Path(__file__).resolve().parent
ENV = os.environ.copy()
ENV.update({
    'ELECTRON_SKIP_BINARY_DOWNLOAD': '1',
    'PROFER_CONFIG_DIR': str(ARTIFACTS / 'profile' / 'config'),
    'PROFER_USER_DATA_DIR': str(ARTIFACTS / 'profile' / 'user-data'),
    'PROFER_DEV_INSTANCE': 'p05-local-acceptance-20261013',
    'CI': 'true',
    'NO_COLOR': '1',
})
for name in ('GITHUB_TOKEN', 'GH_TOKEN', 'OPENAI_API_KEY', 'ANTHROPIC_API_KEY', 'GEMINI_API_KEY', 'DEEPSEEK_API_KEY'):
    ENV.pop(name, None)


def now():
    return dt.datetime.now(dt.timezone.utc).isoformat()


def output(args, cwd=WORKTREE):
    return subprocess.check_output(args, cwd=cwd, env=ENV, text=True).strip()


def statistics(text):
    result = {}
    for key in ('pass', 'skip', 'fail'):
        match = re.search(r'^\s*(\d+) ' + key + r'\s*$', text, re.M)
        if match:
            result[key] = int(match.group(1))
    match = re.search(r'Ran (\d+) tests? across (\d+) files?', text)
    if match:
        result.update(tests=int(match.group(1)), files=int(match.group(2)))
    return result


metadata = {
    'started_at_utc': now(),
    'worktree': str(WORKTREE),
    'artifacts': str(ARTIFACTS),
    'head_sha': output(['git', 'rev-parse', 'HEAD']),
    'frozen_code_sha': 'ce992f90880ecde1954e925b63585692a085f621',
    'branch': 'feat/review-owned-background-sessions',
    'checkout': 'detached at fetched branch HEAD',
    'initial_git_status': output(['git', 'status', '--short']),
    'os': Path('/etc/os-release').read_text(),
    'uname': output(['uname', '-a']),
    'architecture': platform.machine(),
    'bun_version': output(['bun', '--version']),
    'node_version': output(['node', '--version']),
    'bun_executable': output(['which', 'bun']),
    'node_executable': output(['which', 'node']),
    'environment_overrides': {name: ENV[name] for name in (
        'ELECTRON_SKIP_BINARY_DOWNLOAD', 'PROFER_CONFIG_DIR', 'PROFER_USER_DATA_DIR',
        'PROFER_DEV_INSTANCE', 'CI', 'NO_COLOR')},
    'pocket': 'NOT-RUN; patch not applied',
    'production_relay': 'BLOCKED / NOT-RUN',
    'live_01_to_08': 'NOT-RUN',
}
for relative in ('docs/design/review-agent/32-p05-stage-acceptance-and-local-gates.md',
                 'docs/design/review-agent/30-background-session-handoff.md',
                 'docs/design/review-agent/29-background-session-preflight-audit.md'):
    metadata.setdefault('input_documents', []).append({
        'path': relative,
        'sha256': hashlib.sha256((WORKTREE / relative).read_bytes()).hexdigest(),
    })
(ARTIFACTS / 'environment.json').write_text(json.dumps(metadata, ensure_ascii=False, indent=2))
print(json.dumps({key: metadata[key] for key in ('head_sha', 'bun_version', 'node_version', 'architecture')}, ensure_ascii=False), flush=True)

p05_files = sorted(str(Path(path).relative_to(WORKTREE)) for path in glob.glob(
    str(WORKTREE / 'apps/electron/src/main/lib/review/*.p05.test.ts')))
assert len(p05_files) == 6, p05_files
commands = [
    ('01-install', ['bun', 'install', '--frozen-lockfile'], WORKTREE),
    ('02-p05-focused', ['bun', 'test', '--isolate', '--timeout', '30000', *p05_files], WORKTREE),
    ('03-typecheck', ['bun', 'run', 'typecheck'], WORKTREE),
    ('04-boundaries', ['bun', 'run', 'check:boundaries'], WORKTREE),
    ('05-skin-contract', ['bun', 'run', 'check:skin-contract'], WORKTREE / 'apps/electron'),
    ('06-build-main', ['bun', 'run', 'build:main'], WORKTREE / 'apps/electron'),
    ('07-build-preload', ['bun', 'run', 'build:preload'], WORKTREE / 'apps/electron'),
    ('08-build-renderer', ['bun', 'run', 'build:renderer'], WORKTREE / 'apps/electron'),
    ('09-full-tests', ['bun', 'test', '--isolate', '--timeout', '30000'], WORKTREE),
]
results = []
for name, args, cwd in commands:
    log = ARTIFACTS / (name + '.log')
    started = now()
    begin = time.monotonic()
    print(f'START {name}: {shlex.join(args)}', flush=True)
    with log.open('w') as stream:
        stream.write(f'SHA: {metadata["head_sha"]}\nCWD: {cwd}\nCOMMAND: {shlex.join(args)}\nSTART UTC: {started}\n\n')
        stream.flush()
        try:
            result = subprocess.run(args, cwd=cwd, env=ENV, stdout=stream, stderr=subprocess.STDOUT, timeout=1800)
            code = result.returncode
        except subprocess.TimeoutExpired:
            code = 124
            stream.write('\nCommand timeout after 1800 seconds.\n')
    content = log.read_text(errors='replace')
    item = {
        'step': name, 'command': shlex.join(args), 'argv': args, 'cwd': str(cwd),
        'started_at_utc': started, 'finished_at_utc': now(),
        'duration_seconds': round(time.monotonic() - begin, 3), 'exit_code': code,
        'status': 'PASS' if code == 0 else 'FAIL', 'log': str(log),
        'log_sha256': hashlib.sha256(log.read_bytes()).hexdigest(),
        'statistics': statistics(content),
    }
    results.append(item)
    (ARTIFACTS / 'results.json').write_text(json.dumps(results, ensure_ascii=False, indent=2))
    print(json.dumps(item, ensure_ascii=False), flush=True)
    print('\n'.join(content.splitlines()[-(10 if code == 0 else 45):]), flush=True)
    if name == '01-install':
        # Bun 安装会为 workspace bin 生成执行位，仅还原本次隔离工作树的两个入口原模式。
        for relative in ('apps/cli/src/index.ts', 'packages/benchmark-multihop/src/server.ts'):
            entry = output(['git', 'ls-tree', 'HEAD', relative])
            mode = entry.split()[0]
            (WORKTREE / relative).chmod(0o755 if mode == '100755' else 0o644)
        (ARTIFACTS / 'post-install-git-status.txt').write_text(output(['git', 'status', '--short']) + '\n')
        if code:
            print('Dependency installation failed; remaining commands NOT-RUN.', flush=True)
            break

metadata.update(finished_at_utc=now(), final_git_status=output(['git', 'status', '--short']))
(ARTIFACTS / 'environment.json').write_text(json.dumps(metadata, ensure_ascii=False, indent=2))
print(json.dumps({'completed_steps': len(results), 'failures': sum(v['exit_code'] != 0 for v in results),
                  'final_git_status': metadata['final_git_status']}, ensure_ascii=False), flush=True)
