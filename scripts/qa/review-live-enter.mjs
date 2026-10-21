import{connect,ensureReviewPage}from'./review-live-cdp.mjs'
const c=await connect();try{if(await c.evaluate('document.body.innerText.includes("预审工作台")'))await c.click('预审工作台');await ensureReviewPage(c);await c.click('预审工作台');console.log('real review page ready')}finally{c.close()}
