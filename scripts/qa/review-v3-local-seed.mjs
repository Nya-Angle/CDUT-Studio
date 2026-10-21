import {mkdirSync,writeFileSync} from 'node:fs'
import {join} from 'node:path'
const root=process.env.PROFER_CONFIG_DIR,dir=process.env.QA_REPORT_DIR
if(!root||!dir||!root.includes('review-v3-gui-qa-'))throw Error('NO_ISOLATED_QA_PROFILE')
mkdirSync(root,{recursive:true});mkdirSync(dir,{recursive:true})
writeFileSync(join(root,'settings.json'),JSON.stringify({onboardingCompleted:true,coachTourVersion:9999,reviewAgentAutoApproval:false}))
writeFileSync(join(dir,'real-v3-original.txt'),'CDUT Studio V3 physical original\nReview item: local native evidence\n')
console.log('Isolated actual source: '+join(dir,'real-v3-original.txt'))
