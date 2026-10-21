import {describe,expect,test} from 'bun:test'
import type {RubricSpec} from '@profer/shared'
import {calculateF08Rubric,type F08RubricVote} from './review-v3-f08-rubric-calculator'

const rubric:RubricSpec={
  dimensions:[
    {id:'quality',name:'创新',min:1,max:5,weight:0.4},
    {id:'feasible',name:'可行',min:1,max:5,weight:0.6},
  ],totalPrecision:2,missingStrategy:'block',minEffectiveJudges:2,
  scaleConversion:{fromMax:5,toMax:100},
}
const vote=(id:string,a:number,b:number):F08RubricVote=>({
  voteId:id,humanConfirmed:true,scores:[
    {dimensionId:'quality',score:a,na:false},
    {dimensionId:'feasible',score:b,na:false},
  ],
})

describe('F08 量表确定性数值内核（A07/A14）',()=>{
  test('D11: 两位有效评委，第三人回避不在预期投票集合，4.10/5→82.00',()=>{
    const result=calculateF08Rubric(rubric,[vote('j1',4,5),vote('j2',3,4)],['j1','j2'])
    expect(result.status).toBe('ready')
    expect(result.total).toBe('4.10')
    expect(result.convertedTotal).toBe('82.00')
    expect(result.dimensions).toEqual([
      {dimensionId:'quality',average:'3.50',voters:2},
      {dimensionId:'feasible',average:'4.50',voters:2},
    ])
    expect(result.effectiveJudges).toBe(2)
    expect(calculateF08Rubric(rubric,[vote('j1',4,5)],['j1','j2']).total).toBeNull()
  })
  test('N/A 必须有已确认条件，排除后按剩余有效权重归一；0 分不等于缺失',()=>{
    const weighted:RubricSpec={...rubric,minEffectiveJudges:1,naStrategy:'exclude-renormalize',
      dimensions:rubric.dimensions.map(d=>({...d,min:0,...(d.id==='feasible'?{naWhen:{field:'waived',op:'eq' as const,value:true}}:{})}))}
    const user:F08RubricVote={voteId:'j1',humanConfirmed:true,scores:[
      {dimensionId:'quality',score:0,na:false},
      {dimensionId:'feasible',score:null,na:true},
    ]}
    expect(calculateF08Rubric(weighted,[user]).status).toBe('awaiting-confirmation')
    const confirmed=calculateF08Rubric(weighted,[{...user,confirmedNaDimensionIds:['feasible']}])
    expect(confirmed.total).toBe('0.00')
    expect(confirmed.perJudge[0]!.excludedDimensions).toEqual(['feasible'])
    expect(confirmed.dimensions[1]!.voters).toBe(0)
  })
  test('浮点尾差、非法维度和未确认的模型建议均不会产生正式总分',()=>{
    const precise:RubricSpec={...rubric,minEffectiveJudges:1,dimensions:[
      {id:'a',name:'A',min:0,max:1,weight:0.1},
      {id:'b',name:'B',min:0,max:1,weight:0.2},
      {id:'c',name:'C',min:0,max:1,weight:0.7},
    ]}
    const values:F08RubricVote={voteId:'x',humanConfirmed:true,scores:[
      {dimensionId:'a',score:0.1,na:false},{dimensionId:'b',score:0.2,na:false},
      {dimensionId:'c',score:0.3,na:false},
    ]}
    expect(calculateF08Rubric(precise,[values]).total).toBe('0.26')
    expect(calculateF08Rubric(precise,[{...values,humanConfirmed:false}]).total).toBeNull()
    expect(calculateF08Rubric(precise,[{...values,scores:[...values.scores,values.scores[0]!]}]).total).toBeNull()
    expect(calculateF08Rubric(precise,[values,values]).status).toBe('awaiting-confirmation')
  })
  test('单票不合法、超量程、未交评分及分歧阈值均有明确阻断',()=>{
    expect(calculateF08Rubric(rubric,[vote('j1',6,5),vote('j2',3,4)]).status).toBe('awaiting-confirmation')
    const threshold={...rubric,divergenceThreshold:0.5}
    const result=calculateF08Rubric(threshold,[vote('j1',5,5),vote('j2',2,2)])
    expect(result.blockers.join(' ')).toContain('分歧')
    expect(result.total).toBeNull()
    expect(calculateF08Rubric({...rubric,totalPrecision:7},[vote('j1',4,5),vote('j2',3,4)]).status)
      .toBe('awaiting-confirmation')
  })
})
