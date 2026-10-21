#!/usr/bin/env node
// A15: genuine OOXML DOCX input files and reproducible manifest; Node standard library only.
import { createHash } from 'node:crypto'
import { deflateRawSync } from 'node:zlib'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const directory = join(dirname(fileURLToPath(import.meta.url)), 'generated')
const cases = [{"id":"lab-18-complete","count":18,"owner":"模拟负责人甲","purpose":"材料科学基础教学实验：样品无害化制备与安全测量","time":"14:00–17:00","arrangements":["负责人全程监督","入场清点人员并完成安全告知","不使用危险化学品、明火或高压设备","清理台面、归还设备"]},{"id":"lab-21-over-limit","count":21,"owner":"模拟负责人乙","purpose":"材料科学基础教学实验：样品观察","time":"14:00–17:00","arrangements":["负责人全程监督","活动结束清点仪器"]},{"id":"lab-12-unclear-reply","count":12,"owner":"模拟负责人丙","purpose":"待补充：实验用途尚未具体说明","time":"待协调","arrangements":["安全措施和活动时段尚未明确，仅作为第一次补件"]},{"id":"lab-12-corrected-reply","count":12,"owner":"模拟负责人丙","purpose":"材料显微结构观察与模拟数据记录","time":"09:00–11:00","arrangements":["只使用普通光学显微镜和电脑，不使用危险试剂","指导员入场前检查设备，所有参与人员签到","活动后清点、清洁、归还钥匙","设备停用时遵照场地管理意见取消申请"]},{"id":"lab-unknown-count","count":null,"owner":"模拟负责人丁","purpose":"材料显微结构观察","time":"09:00–11:00","arrangements":["人数尚未统计完成，等待提交方确认","安全措施待核验最终人数"]}]
const xml = (s) => String(s).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
const p = (s) => '<w:p><w:r><w:rPr><w:rFonts w:eastAsia="Microsoft YaHei"/><w:sz w:val="22"/></w:rPr><w:t xml:space="preserve">' + xml(s) + '</w:t></w:r></w:p>'
const cell = (s) => '<w:tc><w:tcPr><w:tcW w:w="4700" w:type="dxa"/></w:tcPr>' + p(s) + '</w:tc>'
const pair = (a,b) => '<w:tr>' + cell(a) + cell(b) + '</w:tr>'
const contentTypes = '<?xml version="1.0" encoding="UTF-8"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>'
const relationships = '<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>'
const document = (c) => {
  const rows = [pair('申请组织','模拟青禾科创协会'),pair('负责人',c.owner),pair('参加人数',c.count === null ? '待确认' : String(c.count)+' 人'),pair('申请日期','2026-11-06'),pair('申请时段',c.time),pair('实验目的',c.purpose),pair('实验室','模拟材料表征实验室 A-203')].join('')
  const table = '<w:tbl><w:tblPr><w:tblBorders><w:top w:val="single" w:sz="4"/><w:bottom w:val="single" w:sz="4"/><w:left w:val="single" w:sz="4"/><w:right w:val="single" w:sz="4"/><w:insideH w:val="single" w:sz="4"/><w:insideV w:val="single" w:sz="4"/></w:tblBorders></w:tblPr><w:tblGrid><w:gridCol w:w="4700"/><w:gridCol w:w="4700"/></w:tblGrid>'+rows+'</w:tbl>'
  const body = p('实验室使用计划书（虚构验收材料）')+p('A15 / CDUT Studio Review V3')+p('纯虚构数据，不代表任何学校批准或真实制度')+table+p('实施与安全安排')+c.arrangements.map(x=>p('• '+x)).join('')+p('初审通过不等于获得真实学校的最终许可')
  return '<?xml version="1.0" encoding="UTF-8"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>'+body+'<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1100" w:bottom="1100" w:left="950" w:right="950"/></w:sectPr></w:body></w:document>'
}
const crcTable = Array.from({length:256},(_,n)=>{let x=n;for(let i=0;i<8;i++)x=x&1?(x>>>1)^0xEDB88320:x>>>1;return x>>>0})
const crc = (data) => {let x=0xFFFFFFFF;for(const c of data)x=(x>>>8)^crcTable[(x^c)&255];return (x^0xFFFFFFFF)>>>0}
function zip(files) {
  const local=[],central=[];let offset=0
  for (const [name,text] of Object.entries(files)) {
    const filename=Buffer.from(name),raw=Buffer.from(text),compressed=deflateRawSync(raw),hash=crc(raw)
    const h=Buffer.alloc(30);h.writeUInt32LE(0x04034b50,0);h.writeUInt16LE(20,4);h.writeUInt16LE(8,8);h.writeUInt32LE(hash,14);h.writeUInt32LE(compressed.length,18);h.writeUInt32LE(raw.length,22);h.writeUInt16LE(filename.length,26)
    local.push(h,filename,compressed)
    const ch=Buffer.alloc(46);ch.writeUInt32LE(0x02014b50,0);ch.writeUInt16LE(20,4);ch.writeUInt16LE(20,6);ch.writeUInt16LE(8,10);ch.writeUInt32LE(hash,16);ch.writeUInt32LE(compressed.length,20);ch.writeUInt32LE(raw.length,24);ch.writeUInt16LE(filename.length,28);ch.writeUInt32LE(offset,42)
    central.push(ch,filename);offset+=h.length+filename.length+compressed.length
  }
  const toc=Buffer.concat(central),end=Buffer.alloc(22);end.writeUInt32LE(0x06054b50,0);end.writeUInt16LE(Object.keys(files).length,8);end.writeUInt16LE(Object.keys(files).length,10);end.writeUInt32LE(toc.length,12);end.writeUInt32LE(offset,16)
  return Buffer.concat([...local,toc,end])
}
await mkdir(directory,{recursive:true})
const hashes={}
for(const c of cases) {
  const filename=c.id+'.docx'
  const data=zip({'[Content_Types].xml':contentTypes,'_rels/.rels':relationships,'word/document.xml':document(c)})
  await writeFile(join(directory,filename),data)
  hashes[filename]=createHash('sha256').update(data).digest('hex')
  await writeFile(join(directory,c.id+'.txt'),['申请组织: 模拟青禾科创协会','参加人数: '+(c.count??'待确认'),'申请日期: 2026-11-06','申请时段: '+c.time,'实验目的: '+c.purpose,...c.arrangements].join('\n')+'\n')
}
const scenarios=[
  {id:'A15-OK',count:18,documents:['lab-18-complete.docx'],expected:{headcount:'compliant',planSlot:'present',finalDecisionMustBeHuman:true}},
  {id:'A15-OVER-LIMIT',count:21,documents:['lab-21-over-limit.docx'],expected:{headcount:'non-compliant',planSlot:'present',automaticApprovalForbidden:true}},
  {id:'A15-MISSING-PLAN',count:12,documents:[],supplementDocumentsInOrder:['lab-12-unclear-reply.docx','lab-12-corrected-reply.docx'],expected:{planSlotBeforeReply:'missing',firstReplyMustNotAutoSatisfy:true,secondReplyRequiresHumanReview:true,oldRunImmutable:true}},
  {id:'A15-UNKNOWN-COUNT',count:null,documents:['lab-unknown-count.docx'],expected:{headcount:'awaiting-confirmation',nullNeverEqualsZero:true}}
]
const manifest={schemaVersion:1,policy:'LAB-SIM@1',objectKind:'organization',academicYearRequired:false,scoreMode:'none',fields:['organizationName','applicantCount','usageDate','usageTime','purpose'],requiredMaterialSlot:'lab-use-plan',countMaximum:20,workflow:['initial-review','final-review'],scenarios:scenarios.map(s=>({...s,sha256:Object.fromEntries([...s.documents,...(s.supplementDocumentsInOrder??[])].map(n=>[n,hashes[n]]))}))}
await writeFile(join(directory,'manifest.json'),JSON.stringify(manifest,null,2)+'\n')
for(const s of manifest.scenarios)for(const [name,expected] of Object.entries(s.sha256)){const actual=createHash('sha256').update(await readFile(join(directory,name))).digest('hex');if(actual!==expected)throw Error(name+': original data mismatch')}
console.log('A15: '+cases.length+' genuine DOCX originals, '+scenarios.length+' expected-result scenarios: '+directory)
