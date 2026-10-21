"""本地验收采集器：显式隔离配置，保存命令、退出码、时间及日志哈希。"""
import datetime
import hashlib
import json
import os
from pathlib import Path
import subprocess
import tempfile
import time

ROOT = Path(__file__).resolve().parents[5]
OUT = Path(__file__).resolve().parent
PROFILE = Path(tempfile.mkdtemp(prefix="review-pre-p06-local-gates-"))
ENV = os.environ.copy()
ENV.update(PROFER_CONFIG_DIR=str(PROFILE / "config"), PROFER_USER_DATA_DIR=str(PROFILE / "user-data"), CI="true", NO_COLOR="1")
STEPS = [
    ("01-typecheck", ROOT, ["bun", "run", "typecheck"]),
    ("02-main-renderer-focused", ROOT, ["bun", "test", "--isolate", "--timeout", "30000",
        "apps/electron/src/main/lib/review/review-pi-run-bridge.main.test.ts",
        "apps/electron/src/main/lib/review/review-background-state.p03-main.test.ts",
        "apps/electron/src/main/lib/review/review-background-reuse.probe.test.ts",
        "apps/electron/src/renderer/components/content-review/review-actions-controller.test.ts"]),
    ("03-full-tests", ROOT, ["bun", "test", "--isolate", "--timeout", "30000"]),
    ("04-p05-focused", ROOT, ["bun", "test", "--isolate", "--timeout", "30000", *[str(p.relative_to(ROOT)) for p in sorted((ROOT / "apps/electron/src/main/lib/review").glob("*.p05.test.ts"))]]),
    ("05-boundaries", ROOT, ["bun", "run", "check:boundaries"]),
    ("06-skin-contract", ROOT / "apps/electron", ["bun", "run", "check:skin-contract"]),
    ("07-build-main", ROOT / "apps/electron", ["bun", "run", "build:main"]),
    ("08-build-preload", ROOT / "apps/electron", ["bun", "run", "build:preload"]),
    ("09-build-renderer", ROOT / "apps/electron", ["bun", "run", "build:renderer"]),
]

def utc():
    return datetime.datetime.now(datetime.timezone.utc).isoformat()

results = []
sha = subprocess.check_output(["git", "rev-parse", "HEAD"], cwd=ROOT, text=True).strip()
for name, cwd, argv in STEPS:
    start, clock = utc(), time.monotonic()
    log = OUT / (name + ".log")
    with log.open("wb") as stream:
        completed = subprocess.run(argv, cwd=cwd, env=ENV, stdout=stream, stderr=subprocess.STDOUT)
    results.append(dict(name=name, sha=sha, cwd=str(cwd), argv=argv, started_at=start,
        finished_at=utc(), seconds=round(time.monotonic()-clock, 3), exit_code=completed.returncode,
        log=log.name, log_sha256=hashlib.sha256(log.read_bytes()).hexdigest()))
    (OUT / "local-gates-results.json").write_text(json.dumps(dict(sha=sha, profile=str(PROFILE),
        environment={k: ENV[k] for k in ["PROFER_CONFIG_DIR", "PROFER_USER_DATA_DIR", "CI", "NO_COLOR"]}, results=results), ensure_ascii=False, indent=2) + "\n")
    print(f"{name}: exit={completed.returncode}", flush=True)
    if completed.returncode:
        raise SystemExit(completed.returncode)
