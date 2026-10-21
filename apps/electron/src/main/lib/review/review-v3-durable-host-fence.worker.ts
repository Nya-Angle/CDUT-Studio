/** Independent Bun OS PID verifies C Case CAS Run-wide Host fence. */
import {isC2RunDurablyFenced} from './review-v3-durable-host-fence'
import {readAggregate} from './case-store-v2'
const caseId=process.argv[2]
const a=caseId?readAggregate(caseId):undefined
if(!a?.v3TechnicalExecution?.run){console.error('NO_PERSISTED_RUN');process.exit(2)}
try{
  const denied=isC2RunDurablyFenced(a.v3TechnicalExecution.run)
  console.log(denied?'DURABLE_FENCED':'NOT_FENCED')
  process.exit(denied?0:3)
}catch(e){console.error(String(e));process.exit(4)}
