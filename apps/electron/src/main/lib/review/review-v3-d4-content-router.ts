/** D4五十套：纯函数业务意图L1分类。
 * 输入必须是调用方已核实原件身份/归属的当前案卷 DocumentVersion；不能从文件名猜。
 * 选模板前的 role 只是临时标签，一个事项可有零份或多份申请主件。
 * 每份原件独立匹配，不把不同材料的词拼成「对象+动作」。
 * 规则只输出技术候选，冲突业务声明不得自动选择。
 */
import type { DocumentVersion } from '@profer/shared'

interface Candidate {templateId:string;name:string}
export interface D4ContentRouteSuggestion {
  templateId:string
  name:string
  matchedSignals:string[]
  confidence:number
  autoEligible:boolean
  evidence:'application-declaration'|'business-content-l1'
}

type Signals=readonly [readonly string[],readonly string[]]
// 从50套冻结母版“审核目的/事项”中提取的两组独立信号。
// 同一个申请中必须同时出现业务对象与动作/目的，泛化的“申请”“审核”不计分。
// 新增/改名D4母版时先由业务作者更新这一显式表，不能靠名称模糊全匹配。
const D4_L1_SIGNALS:Readonly<Record<string,Signals>>={
  'g01-archive-utilization':[['档案','档案利用'],['利用','调阅','查档','查阅']],
  'g01-special-campus-card':[['校园卡','校卡'],['特殊资格','特殊人员','特殊身份','申领资格']],
  'g01-student-identity-correction':[['学籍','身份信息','学籍信息'],['更正','修改','纠错','变更']],
  'g01-political-procedure':[['政审','政治审查'],['材料','证明','程序','递交']],
  'g01-special-proof-seal':[['专项证明','证明用印','公章','用印'],['开具','签章','加盖','用印']],
  'g02-t01-review':[['数据共享','共享数据'],['部门','申请','授权']],
  'g02-t02-review':[['公共邮箱','部门邮箱','公用邮箱'],['开通','申请','使用']],
  'g02-t03-review':[['网络访问','专项网络','内网访问'],['权限','授权','访问']],
  'g03-t01':[['教室','公共教学教室'],['借用','临时使用','使用申请']],
  'g03-t02':[['会议室'],['预约','借用','会议用途']],
  'g03-t03':[['公共活动场地','校园活动场地','广场'],['借用','使用','场地']],
  'g03-t06':[['共享仪器','仪器平台'],['加入','账号','授权','课题组']],
  'g03-t07':[['仪器','设备'],['培训','考核','独立操作','上机资格']],
  'g03-t08':[['仪器','设备'],['机时','上机预约','自主上机']],
  'g03-t09':[['仪器','设备'],['送样','委托检测','代测']],
  'g03-t10':[['宣传品','展板','横幅','海报'],['布设','张贴','悬挂','摆放']],
  'g03-t11':[['电子屏','显示屏'],['播放','版位','上屏','内容发布']],
  'g03-t12':[['体育场馆','体育馆','运动场','球场'],['借用','预约','集体活动']],
  'd4-g04-t01':[['门禁','特定区域','通行区域'],['开通','授权','通行']],
  'd4-g04-t02':[['校外人员','访客','访客车辆'],['入校','进校','预约']],
  'd4-g04-t03':[['实验室','实验人员'],['安全准入','准入资格','安全培训']],
  'd4-g04-t04':[['实验项目','实验课题'],['安全风险评估','风险评估','风险辨识']],
  'd4-g04-t05':[['高风险实验','危险实验','特殊实验'],['专项作业','作业许可','风险作业']],
  'd4-g04-t06':[['群体活动','集体活动','大型活动'],['安全审批','安全备案','安保']],
  'd4-g04-t07':[['动火','焊接','明火作业'],['许可','安全','作业']],
  'd4-g04-t08':[['机动车','车辆'],['长期通行','长期入校','通行资格']],
  'g05-t01':[['学术会议','学术研讨会'],['资助','成果履约','参会资助']],
  'g05-t02':[['校外交流','集体交流','校外实践'],['组织','安全','实践活动']],
  'g05-t03':[['校际交流','公派研修','交换项目'],['选拔','推荐','申请']],
  'g05-t04':[['出国','出境','因公出国'],['报批','行前','任务审批']],
  'g05-t05':[['境外专家','海外专家','境外团组'],['来校','访问','接待']],
  'g05-t06':[['国际学术会议','国际会议'],['主办','承办','申报']],
  'g06-t01':[['专利','发明专利','实用新型'],['申请','权属','成果登记']],
  'g06-t02':[['软件著作权','软著'],['申请','权属','登记']],
  'g06-t03':[['科研成果','成果记录'],['首次登记','认领','新增登记']],
  'g06-t04':[['成果记录','科研成果'],['更正','去重','重复记录']],
  'g06-t05':[['学术活动','科研成果'],['保密','公开前','披露']],
  'g06-t06':[['科研成果','科技成果'],['宣传发布','新闻发布','官方宣传']],
  'g06-t07':[['涉人研究','人体研究','人类受试者'],['伦理','知情同意','伦理审查']],
  'g06-t08':[['动物实验','实验动物'],['伦理','福利','伦理审查']],
  'g06-t09':[['科技成果','专利成果','科研成果'],['转化','赋权','许可转让','权利处分']],
  'g07-t01':[['活动费用','竞赛费用','科研费用'],['报销','直接费用','核销']],
  'g07-t02':[['差旅','出差','学术交流差旅'],['核销','报销','车票']],
  'g07-t03':[['采购','物资采购','服务采购'],['事前','申请','预算']],
  'g07-t04':[['采购','委托服务'],['履约','结算','验收付款']],
  'g07-t05':[['劳务','助研','专家酬金'],['发放','支付','报酬']],
  'g07-t06':[['会议经费','培训经费','会议费用'],['结算','核销','报账']],
  'g07-t07':[['借款','预借款','项目借款'],['冲账','结清','核销']],
  'g08-t02':[['失物','遗失物','失物招领'],['领回','认领','所有权']],
  'g08-t03':[['诉求','意见建议','工单'],['受理','再办理','再次办理','反馈']],
}

/** Explicit searchable business vocabulary for the unified template catalog. */
export function getD4TemplateKeywords(templateId:string):string[] {
  const groups=D4_L1_SIGNALS[templateId]
  return groups?[...new Set(groups.flatMap(group=>[...group]))]:[]
}

const normalized=(value:string):string=>value.normalize('NFKC').toLowerCase()
  .replace(/[\s\-—_【】\[\]（）()<>《》,，。;；:：·|｜]/g,'')

function businessDeclarations(documents:readonly DocumentVersion[]):string[] {
  return documents.filter(doc=>doc.active!==false).flatMap(doc=>
    doc.blocks.filter(block=>block.kind==='text'&&block.format!=='ocr-text'&&
      block.format!=='vision-text').flatMap(block=>
      block.text.split(/\r?\n/).slice(0,100).flatMap(line=>{
        const match=line.match(/^\s*(?:申请事项|业务类型|办理事项|审核模板|模板名称|模板编号)\s*[:：]\s*(.{2,100}?)\s*$/)
        return match?.[1]?[normalized(match[1])]:[]
      })))
}

export function hasConflictingD4BusinessDeclarations(documents:readonly DocumentVersion[]):boolean {
  return new Set(businessDeclarations(documents)).size>1
}

/** 由P05物理分案后调用：每案用其自身当前DocumentVersion，禁止跨案卷串联。 */
export function classifyD4ApplicationDocuments(
  templates:readonly Candidate[],documents:readonly DocumentVersion[],
):D4ContentRouteSuggestion[] {
  const active=documents.filter(doc=>doc.active!==false)
  const applications=active.filter(doc=>doc.role==='application')
  // 未识别申请主件时仍允许基于全部当前原件检索候选，但不据此自动确认。
  const sources=applications.length?applications:active
  // 每份原件独立匹配，绝不把两份材料的词拼在一起伪造「对象+动作」同时出现。
  const readable=sources.map(doc=>({
    doc,
    blocks:doc.blocks.filter(block=>block.kind==='text'&&
      block.format!=='ocr-text'&&block.format!=='vision-text'&&block.text.trim()),
  })).filter(item=>item.blocks.length>0)
  if(!readable.length)return []
  // 自动建议只认全部申请件都已解析成功；零份申请件或任一未解析都不抢答。
  const reliable=applications.length>0&&applications.every(doc=>doc.parseStatus==='parsed')
  // 显式标签（申请事项：X）：多份材料都写同一项才算唯一声明；互相矛盾则不猜。
  const labels=businessDeclarations(sources)
  const declared=new Set(labels)
  // 即使另一个附件里的申请事项与主件冲突，也不能默默按其中一份自动决定。
  if(hasConflictingD4BusinessDeclarations(active))return []
  if(declared.size===1){
    const value=labels[0]!
    const explicit=templates.filter(item=>normalized(item.name)===value||normalized(item.templateId)===value)
    if(explicit.length===1)return [{...explicit[0]!,matchedSignals:[value],confidence:1,
      autoEligible:reliable,evidence:'application-declaration'}]
  }
  // 正文信号按原件逐一判定；同一模板可在多份原件中出现，但必须每份各自自洽。
  const byTemplate=new Map<string,{item:Candidate;signals:Set<string>}>()
  for(const {blocks} of readable){
    const text=normalized(blocks.map(block=>block.text.slice(0,6000)).join('\n').slice(0,30000))
    if(!text)continue
    for(const item of templates){
      const groups=D4_L1_SIGNALS[item.templateId]
      if(!groups)continue
      const matched=groups.map(aliases=>aliases.find(alias=>text.includes(normalized(alias))))
      if(matched.some(value=>!value))continue
      const entry=byTemplate.get(item.templateId)??{item,signals:new Set<string>()}
      for(const value of matched)if(value)entry.signals.add(value)
      byTemplate.set(item.templateId,entry)
    }
  }
  const candidates=[...byTemplate.values()].map(entry=>({
    templateId:entry.item.templateId,name:entry.item.name,
    matchedSignals:[...entry.signals],
    confidence:Math.min(0.99,0.95+Math.max(0,entry.signals.size-2)*0.01),
    autoEligible:false,evidence:'business-content-l1' as const,
  }))
  // 多项都满足对象+动作时必须由人选择；即使唯一L1建议，仍可由人覆盖。
  return candidates.map(item=>({...item,
    autoEligible:reliable&&candidates.length===1}))
}
