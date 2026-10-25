/**
 * R22: independent Bun PID cold-read of A-only durable background spool.
 * Never opens Provider or takes over old Main task.
 */
import {createFileOwnerPersistence} from './review-pi-owner-adapter'
import {V3ABackgroundTechnicalCoordinator} from
  './review-v3-background-technical-coordinator'
import type {A22BackgroundTrustPort} from
  './review-v3-background-technical-coordinator'
const [dir,caseId]=process.argv.slice(2)
if(!dir||!caseId)throw Error('R22 cold worker requires exact root/case')
const trust:A22BackgroundTrustPort={
  storeForCase:()=>createFileOwnerPersistence(dir+'/background.json'),
  assertCurrent:()=>{throw Error('cold worker cannot authorize execution')},
  driverForCase:()=>{throw Error('cold worker cannot invoke SDK')},
}
const result=new V3ABackgroundTechnicalCoordinator(trust).inspect(caseId)
process.stdout.write('R22_COLD '+JSON.stringify({
  pid:process.pid,state:result?.state,reason:result?.reason,
  requestId:result?.requestId,caseId:result?.caseId,
})+'\n')
