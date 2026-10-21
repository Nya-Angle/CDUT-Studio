#!/usr/bin/env python3
import argparse,datetime,json,os,re,shutil,signal,subprocess
from pathlib import Path
p=argparse.ArgumentParser();p.add_argument('--private',required=True);a=p.parse_args();root=Path(a.private).resolve()
if 'p06-recheck-live-'not in str(root):raise SystemExit('非隔离目录')
trace=root/'io/recovery-native-strace.log';shutil.copy2(trace,root/'io-b95-final/native-final-restored.log')
s=subprocess.check_output(['ss','-ltnp','( sport = :9230 )'],text=True);pid=int(re.search(r'pid=(\d+)',s).group(1))
assert str(root/'authorized-profile').encode() in Path(f'/proc/{pid}/environ').read_bytes()
os.kill(pid,signal.SIGKILL)
volume=root/'io-volume';result=subprocess.run(['sudo','-n','umount',str(volume)],capture_output=True,text=True)
(root/'setup/final-cleanup.json').write_text(json.dumps({'at':datetime.datetime.now(datetime.timezone.utc).isoformat(),'mainPid':pid,'action':'SIGKILL isolated Main after all live tests; supervisor records expected lifecycle exit separately','unmountArgv':['sudo','-n','umount',str(volume)],'unmountExitCode':result.returncode,'unmountStdout':result.stdout,'unmountStderr':result.stderr,'systemDiskFilled':False},indent=2)+'\n')
print(json.dumps({'isolatedMainStopped':pid,'boundedTmpfsUnmountExit':result.returncode}));raise SystemExit(result.returncode)
