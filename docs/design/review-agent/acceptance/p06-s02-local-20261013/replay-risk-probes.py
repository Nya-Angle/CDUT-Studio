"""复跑四个待修保护断言；失败返回非零，不把已知问题写成 PASS。"""
import datetime
import hashlib
import json
import os
from pathlib import Path
import shutil
import subprocess
import tempfile
import time

SOURCE = Path(__file__).resolve().parent
ROOT = Path(os.environ.get("REVIEW_ACCEPTANCE_ROOT", str(SOURCE.parents[4])))
OUT = Path(os.environ.get("REVIEW_RISK_OUT", tempfile.mkdtemp(prefix="review-risk-evidence-")))
OUT.mkdir(parents=True, exist_ok=True)
ENV = os.environ.copy()
ENV["REVIEW_ACCEPTANCE_ROOT"] = str(ROOT)
sha = subprocess.check_output(["git", "rev-parse", "HEAD"], cwd=ROOT, text=True).strip()
results = []
with tempfile.TemporaryDirectory(prefix="review-risk-probes-") as temporary:
    case = Path(temporary) / "scope-risk-audit.test.ts"
    shutil.copy2(SOURCE / "audit/scope-risk-audit.probe.ts", case)
    commands = [
        ("controlled-protection", ["bun", "test", "--isolate", "--timeout", "30000", str(case)]),
        ("settlement-standalone", ["bun", "--preload", "./test/preload-electron-mock.ts", str(SOURCE / "audit/settle-risk.probe.ts")]),
    ]
    for name, argv in commands:
        ENV["REVIEW_RISK_REPORT"] = str(OUT / (name + "-facts.json"))
        log = OUT / (name + ".log")
        begin = datetime.datetime.now(datetime.timezone.utc).isoformat()
        clock = time.monotonic()
        with log.open("wb") as stream:
            result = subprocess.run(argv, cwd=ROOT, env=ENV, stdout=stream, stderr=subprocess.STDOUT)
        results.append(dict(name=name, source_sha=sha, cwd=str(ROOT), argv=argv, started_at=begin,
            finished_at=datetime.datetime.now(datetime.timezone.utc).isoformat(), seconds=round(time.monotonic()-clock, 3),
            expected_exit_for_correct_protection=0, actual_exit=result.returncode,
            log=log.name, log_sha256=hashlib.sha256(log.read_bytes()).hexdigest()))
        print(f"{name}: 实际退出码 {result.returncode}；保护成立应为 0", flush=True)
    (OUT / "probe-commands.json").write_text(json.dumps(dict(source_sha=sha, results=results), ensure_ascii=False, indent=2) + "\n")
print("证据目录:", OUT)
raise SystemExit(1 if any(row["actual_exit"] for row in results) else 0)
