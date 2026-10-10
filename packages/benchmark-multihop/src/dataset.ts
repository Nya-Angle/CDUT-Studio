/**
 * 内置离线多跳基准样例（开箱秒测）
 *
 * 说明（如实标注）：
 *   - 本样例为**合成语料**，由 18 篇虚构新闻文档与 50 条多跳查询构成，覆盖官方数据集的
 *     四大题型（inference / comparison / temporal / null query）；
 *   - 全部答案均可由语料中的文档原文直接推导，语料与查询两级均自带一致性校验，
 *     仅用于「开箱即用」地验证评测链路是否正常；
 *   - 需要与官方 2556 题全集对齐的正式结论，请通过数据集管理器一键拉取 Hugging Face
 *     官方 `yixuantt/MultiHopRAG` 全集。
 */

import type { MultiHopCorpusDoc, MultiHopDataset, MultiHopEvidence, MultiHopQuery, MultiHopQuestionType } from './types'

/** 合成语料：18 篇虚构新闻文档 */
export const EMBEDDED_CORPUS: MultiHopCorpusDoc[] = [
  {
    key: 'ha-artemis9-launch',
    title: 'Helios Aerospace Successfully Launches Artemis-9 Lunar Lander',
    author: 'Lena Ortiz',
    published_at: '2023-03-12',
    source: 'Space Daily',
    category: 'space',
    body: 'On March 12, 2023, Helios Aerospace successfully launched its Artemis-9 lunar lander from the Gulf Coast Spaceport. The lander rode to orbit aboard the Titan-VII rocket, a heavy-lift vehicle developed jointly with Orbital Dynamics. The 1.2-ton payload includes the IceCore drill supplied by the Terra Nova Institute, which will sample subsurface ice near the lunar south pole. Mission director Elena Vasquez said the launch was the most complex the company has attempted.',
  },
  {
    key: 'ha-ceo-chen',
    title: 'Helios Aerospace Names Dr. Maya Chen as Chief Executive',
    author: 'Raj Patel',
    published_at: '2022-11-05',
    source: 'Tech Chronicle',
    category: 'business',
    body: 'Helios Aerospace announced on November 5, 2022 that Dr. Maya Chen would become its chief executive. Chen joined Helios from Orbital Dynamics, where she had led the science instruments division for six years. She succeeds founder Alan Reyes, who moved to the role of executive chairman. Chen said her priority would be accelerating the company lunar landing program.',
  },
  {
    key: 'od-europa-probe',
    title: 'Orbital Dynamics Unveils Europa Clipper-II Probe',
    author: 'Nina Kowalski',
    published_at: '2023-06-08',
    source: 'Science Wire',
    category: 'space',
    body: 'Orbital Dynamics unveiled the Europa Clipper-II probe on June 8, 2023 at its Pasadena facility. The probe is designed to study the icy moon Europa and will launch aboard the Titan-VII rocket family. The mission is funded by a $480 million contract from the Global Space Agency. Project scientist Dr. Kenji Watanabe described the probe as the most capable planetary science platform the company has built.',
  },
  {
    key: 'od-contract-gsa',
    title: 'Global Space Agency Awards $480M Contract to Orbital Dynamics',
    author: 'Nina Kowalski',
    published_at: '2023-05-30',
    source: 'Science Wire',
    category: 'business',
    body: 'The Global Space Agency awarded Orbital Dynamics a $480 million contract on May 30, 2023 to build and operate the Europa Clipper-II probe. The five-year agreement covers instrument integration, launch services, and a two-year science phase. The agency said the award followed a competitive procurement involving three bidders.',
  },
  {
    key: 'ne-solar-farm',
    title: 'Northwind Energy Opens Largest Solar Farm in Nevada',
    author: 'Tom Becker',
    published_at: '2022-09-18',
    source: 'Energy Today',
    category: 'energy',
    body: 'Northwind Energy opened its largest solar farm in Nevada on September 18, 2022. The 1.6 gigawatt facility uses more than three million photovoltaic panels and is expected to power roughly 400,000 homes. The panels were supplied by Pacific Robotics under a multi-year agreement. Chief executive Dana Whitfield called the plant a milestone for the company renewable portfolio.',
  },
  {
    key: 'pr-panel-supply',
    title: 'Pacific Robotics to Supply Solar Panels for Northwind',
    author: 'Tom Becker',
    published_at: '2022-08-02',
    source: 'Energy Today',
    category: 'energy',
    body: 'Pacific Robotics signed a deal on August 2, 2022 to supply three million solar panels to Northwind Energy over four years. The panels will be manufactured at the Pacific Robotics factory in Austin, Texas. Financial terms were not disclosed. The agreement marked the company largest supply contract to date.',
  },
  {
    key: 'vl-carbon-capture',
    title: 'Verdant Labs Demonstrates Carbon Capture at 92% Efficiency',
    author: 'Sofia Mendes',
    published_at: '2023-01-22',
    source: 'Climate Report',
    category: 'climate',
    body: 'Verdant Labs demonstrated a carbon-capture unit achieving 92% CO2 removal efficiency on January 22, 2023. The pilot plant, located in Iceland, was developed with the Terra Nova Institute. The system uses a solid sorbent that can be regenerated at low temperature. Verdant Labs said the pilot captured 4,000 tons of carbon dioxide during its first six months of operation.',
  },
  {
    key: 'tni-icecore',
    title: 'Terra Nova Institute Delivers IceCore Drill for Lunar Mission',
    author: 'Sofia Mendes',
    published_at: '2023-02-15',
    source: 'Climate Report',
    category: 'space',
    body: 'The Terra Nova Institute delivered its IceCore drill to Helios Aerospace on February 15, 2023. The instrument is scheduled to fly aboard the Artemis-9 lunar lander and will extract samples from permanently shadowed regions near the lunar south pole. Institute director Dr. Priya Raman said the drill can reach a depth of two meters. It is the institute first hardware contribution to a lunar mission.',
  },
  {
    key: 'ha-revenue',
    title: 'Helios Aerospace Reports Record Revenue of $1.4 Billion',
    author: 'Raj Patel',
    published_at: '2023-07-20',
    source: 'Tech Chronicle',
    category: 'business',
    body: 'Helios Aerospace reported record revenue of $1.4 billion for its 2023 fiscal year on July 20, 2023, an increase of 38% over the prior year. The company attributed the growth to its launch services and lunar payload contracts. Chief executive Dr. Maya Chen said the company expects further expansion in 2024. Helios ended the year with 2,600 employees.',
  },
  {
    key: 'od-revenue',
    title: 'Orbital Dynamics Reports $2.1 Billion Revenue and 4,200 Employees',
    author: 'Nina Kowalski',
    published_at: '2023-07-25',
    source: 'Science Wire',
    category: 'business',
    body: 'Orbital Dynamics reported revenue of $2.1 billion for its 2023 fiscal year on July 25, 2023. The company said the results were driven by government science contracts and satellite manufacturing. Orbital Dynamics employed 4,200 people at the end of the year and operates facilities in Pasadena and Houston.',
  },
  {
    key: 'ha-employees',
    title: 'Helios Aerospace to Hire 800 Engineers, Reaching 2,600 Staff',
    author: 'Raj Patel',
    published_at: '2023-04-10',
    source: 'Tech Chronicle',
    category: 'business',
    body: 'Helios Aerospace announced on April 10, 2023 that it will hire 800 additional engineers over the next eighteen months. The expansion will bring the company total headcount to 2,600. The new roles focus on propulsion, avionics, and lunar surface systems. Chief executive Dr. Maya Chen said the hiring reflects growing demand for the Artemis program.',
  },
  {
    key: 'ne-battery',
    title: 'Northwind Energy Pilots Grid-Scale Battery in Arizona',
    author: 'Tom Becker',
    published_at: '2023-05-12',
    source: 'Energy Today',
    category: 'energy',
    body: 'Northwind Energy began piloting a grid-scale battery system in Arizona on May 12, 2023. The 300 megawatt-hour installation was supplied by Pacific Robotics and is designed to store surplus solar power. The pilot will run for two years before a decision on wider deployment. The company said the battery complements its Nevada solar farm.',
  },
  {
    key: 'pr-hq',
    title: 'Pacific Robotics Moves Headquarters from Seattle to Austin',
    author: 'Ivy Salmon',
    published_at: '2022-06-14',
    source: 'Robotics Weekly',
    category: 'business',
    body: 'Pacific Robotics moved its headquarters from Seattle to Austin, Texas on June 14, 2022. The company said the relocation places it closer to its manufacturing partners and a growing engineering talent pool. The new campus houses 1,100 employees. Chief executive Marcus Ford described the move as a strategic repositioning of the company.',
  },
  {
    key: 'vl-funding',
    title: 'Verdant Labs Raises $250 Million Series C Led by Northwind Ventures',
    author: 'Sofia Mendes',
    published_at: '2022-10-30',
    source: 'Climate Report',
    category: 'climate',
    body: 'Verdant Labs raised $250 million in a Series C funding round announced on October 30, 2022. The round was led by Northwind Ventures, the investment arm of Northwind Energy, with participation from several climate-focused funds. Verdant Labs said the proceeds would fund the scale-up of its carbon-capture technology and a second pilot plant. The company was founded in 2019.',
  },
  {
    key: 'ha-artemis9-landing',
    title: 'Artemis-9 Lander Reaches Lunar South Pole',
    author: 'Lena Ortiz',
    published_at: '2023-03-28',
    source: 'Space Daily',
    category: 'space',
    body: 'The Artemis-9 lander reached the lunar south pole on March 28, 2023, sixteen days after its launch. The spacecraft deployed the IceCore drill provided by the Terra Nova Institute and began transmitting subsurface data. Helios Aerospace confirmed that all primary mission objectives were met. The lander is expected to operate for one lunar day, roughly fourteen Earth days.',
  },
  {
    key: 'od-titan-launch-failure',
    title: 'Orbital Dynamics Delays Europa Clipper-II Launch After Engine Anomaly',
    author: 'Nina Kowalski',
    published_at: '2023-09-04',
    source: 'Science Wire',
    category: 'space',
    body: 'Orbital Dynamics announced on September 4, 2023 that it had delayed the launch of the Europa Clipper-II probe. The delay followed an engine anomaly observed during a Titan-VII static fire test. The company said no hardware was damaged and that a new launch window would be announced. The Global Space Agency, which funds the mission, said it supported the decision to prioritize safety.',
  },
  {
    key: 'gsa-budget',
    title: 'Global Space Agency Boosts 2024 Budget to $9 Billion',
    author: 'Lena Ortiz',
    published_at: '2023-08-15',
    source: 'Space Daily',
    category: 'space',
    body: 'The Global Space Agency increased its 2024 budget to $9 billion on August 15, 2023, a 15% rise over the previous year. The agency said the additional funds would support planetary science, lunar exploration, and climate monitoring. The budget includes the Europa Clipper-II contract awarded to Orbital Dynamics. Agency officials cited growing international interest in lunar resources.',
  },
  {
    key: 'ne-wind-farm',
    title: 'Northwind Energy Cancels Atlantic Offshore Wind Project',
    author: 'Tom Becker',
    published_at: '2023-02-28',
    source: 'Energy Today',
    category: 'energy',
    body: 'Northwind Energy cancelled its Atlantic offshore wind project on February 28, 2023, citing rising construction costs and supply-chain delays. The project would have added 900 megawatts of capacity. The company said it would redirect investment toward solar and battery storage. Chief executive Dana Whitfield said the decision was difficult but necessary.',
  },
]

/** 查询编辑态：以语料 key 引用证据，加载时自动展开为完整证据条目 */
interface RawQuery {
  id: string
  query: string
  answer: string
  question_type: MultiHopQuestionType
  evidence: Array<{ key: string; fact: string }>
}

/** 50 条多跳查询（四大题型各 13 / 13 / 12 / 12） */
const RAW_QUERIES: RawQuery[] = [
  // ===== Temporal Query（13） =====
  { id: 'q-t01', question_type: 'temporal', query: 'Which launched first, the Artemis-9 lunar lander or the Europa Clipper-II probe?', answer: 'Artemis-9', evidence: [
    { key: 'ha-artemis9-launch', fact: 'Artemis-9 launched on March 12, 2023.' },
    { key: 'od-europa-probe', fact: 'Europa Clipper-II was unveiled on June 8, 2023.' },
  ] },
  { id: 'q-t02', question_type: 'temporal', query: 'Between the appointment of Dr. Maya Chen as Helios chief executive and the Series C funding of Verdant Labs, which happened later, and who was appointed?', answer: 'Dr. Maya Chen', evidence: [
    { key: 'ha-ceo-chen', fact: 'Dr. Maya Chen became chief executive on November 5, 2022.' },
    { key: 'vl-funding', fact: 'Verdant Labs raised its Series C round on October 30, 2022.' },
  ] },
  { id: 'q-t03', question_type: 'temporal', query: 'Which happened first, the opening of Northwind Energy Nevada solar farm or the relocation of a robotics company headquarters, and which company relocated?', answer: 'Pacific Robotics', evidence: [
    { key: 'ne-solar-farm', fact: 'The Nevada solar farm opened on September 18, 2022.' },
    { key: 'pr-hq', fact: 'Pacific Robotics moved its headquarters to Austin on June 14, 2022.' },
  ] },
  { id: 'q-t04', question_type: 'temporal', query: 'Helios Aerospace announced 800 new engineering hires in April 2023; what revenue did it report that same fiscal year?', answer: '$1.4 billion', evidence: [
    { key: 'ha-employees', fact: 'Helios announced 800 hires on April 10, 2023, reaching 2,600 staff.' },
    { key: 'ha-revenue', fact: 'Helios reported record revenue of $1.4 billion for 2023.' },
  ] },
  { id: 'q-t05', question_type: 'temporal', query: 'On what date did the Artemis-9 lander reach the lunar south pole after using a drill delivered by the Terra Nova Institute?', answer: 'March 28, 2023', evidence: [
    { key: 'tni-icecore', fact: 'The IceCore drill was delivered on February 15, 2023.' },
    { key: 'ha-artemis9-landing', fact: 'The Artemis-9 lander reached the lunar south pole on March 28, 2023.' },
  ] },
  { id: 'q-t06', question_type: 'temporal', query: 'Which occurred later, the Global Space Agency 2024 budget increase or the delay of the Europa Clipper-II launch; what was the later date?', answer: 'September 4, 2023', evidence: [
    { key: 'gsa-budget', fact: 'The GSA raised its 2024 budget on August 15, 2023.' },
    { key: 'od-titan-launch-failure', fact: 'The Europa Clipper-II launch was delayed on September 4, 2023.' },
  ] },
  { id: 'q-t07', question_type: 'temporal', query: 'Which happened earlier, Northwind Energy Arizona battery pilot or the Verdant Labs carbon-capture demonstration; what was the earlier date?', answer: 'January 22, 2023', evidence: [
    { key: 'ne-battery', fact: 'The Arizona battery pilot began on May 12, 2023.' },
    { key: 'vl-carbon-capture', fact: 'Verdant Labs demonstrated carbon capture on January 22, 2023.' },
  ] },
  { id: 'q-t08', question_type: 'temporal', query: 'Which came first, the Pacific Robotics solar panel supply deal with Northwind Energy or the opening of the Nevada solar farm; what was the earlier date?', answer: 'August 2, 2022', evidence: [
    { key: 'pr-panel-supply', fact: 'The panel supply deal was signed on August 2, 2022.' },
    { key: 'ne-solar-farm', fact: 'The Nevada solar farm opened on September 18, 2022.' },
  ] },
  { id: 'q-t09', question_type: 'temporal', query: 'On what date was Dr. Maya Chen appointed chief executive of the company that later launched the Artemis-9 lunar lander?', answer: 'November 5, 2022', evidence: [
    { key: 'ha-ceo-chen', fact: 'Dr. Maya Chen became chief executive on November 5, 2022.' },
    { key: 'ha-artemis9-launch', fact: 'Artemis-9 was launched by Helios Aerospace on March 12, 2023.' },
  ] },
  { id: 'q-t10', question_type: 'temporal', query: 'Which occurred later in 2023, the Artemis-9 lander reaching the lunar south pole or the unveiling of the Europa Clipper-II probe; what was the later date?', answer: 'June 8, 2023', evidence: [
    { key: 'ha-artemis9-landing', fact: 'The lander reached the lunar south pole on March 28, 2023.' },
    { key: 'od-europa-probe', fact: 'The Europa Clipper-II was unveiled on June 8, 2023.' },
  ] },
  { id: 'q-t11', question_type: 'temporal', query: 'Which happened earlier, the Verdant Labs Series C round or the opening of the Northwind Energy Nevada solar farm; what was the earlier date?', answer: 'September 18, 2022', evidence: [
    { key: 'vl-funding', fact: 'Verdant Labs raised its Series C round on October 30, 2022.' },
    { key: 'ne-solar-farm', fact: 'The Nevada solar farm opened on September 18, 2022.' },
  ] },
  { id: 'q-t12', question_type: 'temporal', query: 'Which came first, the cancellation of the Northwind Energy offshore wind project or its Arizona battery pilot; what was the earlier date?', answer: 'February 28, 2023', evidence: [
    { key: 'ne-wind-farm', fact: 'The offshore wind project was cancelled on February 28, 2023.' },
    { key: 'ne-battery', fact: 'The Arizona battery pilot began on May 12, 2023.' },
  ] },
  { id: 'q-t13', question_type: 'temporal', query: 'A robotics company later supplied panels for the Nevada solar farm; when had it moved its headquarters to Austin?', answer: 'June 14, 2022', evidence: [
    { key: 'ne-solar-farm', fact: 'The Nevada solar farm panels were supplied by Pacific Robotics.' },
    { key: 'pr-hq', fact: 'Pacific Robotics moved its headquarters on June 14, 2022.' },
  ] },

  // ===== Comparison Query（13） =====
  { id: 'q-c01', question_type: 'comparison', query: 'Which company reported higher revenue in its 2023 fiscal year, Helios Aerospace or Orbital Dynamics?', answer: 'Orbital Dynamics', evidence: [
    { key: 'ha-revenue', fact: 'Helios reported $1.4 billion for 2023.' },
    { key: 'od-revenue', fact: 'Orbital Dynamics reported $2.1 billion for 2023.' },
  ] },
  { id: 'q-c02', question_type: 'comparison', query: 'Which company had more employees at the end of 2023, Helios Aerospace or Orbital Dynamics?', answer: 'Orbital Dynamics', evidence: [
    { key: 'ha-employees', fact: 'Helios reached 2,600 staff.' },
    { key: 'od-revenue', fact: 'Orbital Dynamics employed 4,200 people.' },
  ] },
  { id: 'q-c03', question_type: 'comparison', query: 'Which organization funded the Europa Clipper-II probe that uses the Titan-VII rocket family?', answer: 'Global Space Agency', evidence: [
    { key: 'od-europa-probe', fact: 'The probe is funded by a $480 million contract.' },
    { key: 'od-contract-gsa', fact: 'The Global Space Agency awarded the contract.' },
  ] },
  { id: 'q-c04', question_type: 'comparison', query: 'Which company supplied the panels for the Northwind Energy 1.6 gigawatt Nevada solar farm?', answer: 'Pacific Robotics', evidence: [
    { key: 'ne-solar-farm', fact: 'The 1.6 gigawatt farm opened in Nevada.' },
    { key: 'pr-panel-supply', fact: 'Pacific Robotics supplied the panels.' },
  ] },
  { id: 'q-c05', question_type: 'comparison', query: 'Which institute supplied the drill carried by the Artemis-9 lunar lander?', answer: 'Terra Nova Institute', evidence: [
    { key: 'ha-artemis9-launch', fact: 'The lander carries the IceCore drill.' },
    { key: 'tni-icecore', fact: 'The Terra Nova Institute delivered the IceCore drill.' },
  ] },
  { id: 'q-c06', question_type: 'comparison', query: 'Between Pacific Robotics and Verdant Labs, which one supplied the Northwind Energy Arizona battery?', answer: 'Pacific Robotics', evidence: [
    { key: 'ne-battery', fact: 'The Arizona battery was supplied by Pacific Robotics.' },
    { key: 'vl-funding', fact: 'Verdant Labs raised a Series C round.' },
  ] },
  { id: 'q-c07', question_type: 'comparison', query: 'Which company launched a lunar lander in 2023, Helios Aerospace or Orbital Dynamics?', answer: 'Helios Aerospace', evidence: [
    { key: 'ha-artemis9-launch', fact: 'Helios Aerospace launched Artemis-9.' },
    { key: 'od-europa-probe', fact: 'Orbital Dynamics unveiled a probe instead.' },
  ] },
  { id: 'q-c08', question_type: 'comparison', query: 'Which company opened a 1.6 gigawatt solar farm, Northwind Energy or Verdant Labs?', answer: 'Northwind Energy', evidence: [
    { key: 'ne-solar-farm', fact: 'Northwind Energy opened a 1.6 gigawatt solar farm.' },
    { key: 'vl-carbon-capture', fact: 'Verdant Labs works on carbon capture.' },
  ] },
  { id: 'q-c09', question_type: 'comparison', query: 'Which energy company investment arm led the Verdant Labs Series C round announced on October 30, 2022?', answer: 'Northwind Energy', evidence: [
    { key: 'vl-funding', fact: 'The round was led by Northwind Ventures.' },
    { key: 'ne-battery', fact: 'Northwind Energy runs storage pilots.' },
  ] },
  { id: 'q-c10', question_type: 'comparison', query: 'Which company moved its headquarters to Austin in 2022, Pacific Robotics or Helios Aerospace?', answer: 'Pacific Robotics', evidence: [
    { key: 'pr-hq', fact: 'Pacific Robotics moved to Austin on June 14, 2022.' },
    { key: 'ha-ceo-chen', fact: 'Helios Aerospace changed chief executive in 2022.' },
  ] },
  { id: 'q-c11', question_type: 'comparison', query: 'Which institute partnered with Verdant Labs on the Iceland carbon-capture pilot?', answer: 'Terra Nova Institute', evidence: [
    { key: 'vl-carbon-capture', fact: 'The Iceland pilot was developed with a partner institute.' },
    { key: 'tni-icecore', fact: 'The Terra Nova Institute builds climate and lunar instruments.' },
  ] },
  { id: 'q-c12', question_type: 'comparison', query: 'Between the Artemis-9 and the Europa Clipper-II missions, which one was delayed in September 2023?', answer: 'Europa Clipper-II', evidence: [
    { key: 'ha-artemis9-landing', fact: 'Artemis-9 completed its landing in March 2023.' },
    { key: 'od-titan-launch-failure', fact: 'The Europa Clipper-II launch was delayed on September 4, 2023.' },
  ] },
  { id: 'q-c13', question_type: 'comparison', query: 'Which organization supported the decision to delay the Europa Clipper-II after a Titan-VII engine anomaly?', answer: 'Global Space Agency', evidence: [
    { key: 'od-titan-launch-failure', fact: 'The funding agency supported the delay.' },
    { key: 'od-contract-gsa', fact: 'The Global Space Agency funds the mission.' },
  ] },

  // ===== Inference Query（12） =====
  { id: 'q-i01', question_type: 'inference', query: 'The lander that reached the lunar south pole deployed a drill made by which institute?', answer: 'Terra Nova Institute', evidence: [
    { key: 'ha-artemis9-landing', fact: 'The lander deployed the IceCore drill near the lunar south pole.' },
    { key: 'tni-icecore', fact: 'The IceCore drill was made by the Terra Nova Institute.' },
  ] },
  { id: 'q-i02', question_type: 'inference', query: 'Which agency contract funded the mission that uses the Titan-VII rocket family?', answer: 'Global Space Agency', evidence: [
    { key: 'od-europa-probe', fact: 'The probe launches on the Titan-VII rocket family.' },
    { key: 'od-contract-gsa', fact: 'The GSA awarded the $480 million contract.' },
  ] },
  { id: 'q-i03', question_type: 'inference', query: 'Who became chief executive of the company that launched the Artemis-9 lunar lander?', answer: 'Dr. Maya Chen', evidence: [
    { key: 'ha-artemis9-launch', fact: 'Helios Aerospace launched Artemis-9.' },
    { key: 'ha-ceo-chen', fact: 'Dr. Maya Chen became Helios chief executive.' },
  ] },
  { id: 'q-i04', question_type: 'inference', query: 'Which company solar panels power both the Northwind Energy Nevada solar farm and its Arizona battery?', answer: 'Pacific Robotics', evidence: [
    { key: 'ne-solar-farm', fact: 'Pacific Robotics supplied the solar panels.' },
    { key: 'ne-battery', fact: 'Pacific Robotics supplied the battery.' },
  ] },
  { id: 'q-i05', question_type: 'inference', query: 'Which institute that delivered a lunar drill also partnered on a carbon-capture pilot in Iceland?', answer: 'Terra Nova Institute', evidence: [
    { key: 'tni-icecore', fact: 'The Terra Nova Institute delivered the IceCore drill.' },
    { key: 'vl-carbon-capture', fact: 'The Iceland pilot was developed with the Terra Nova Institute.' },
  ] },
  { id: 'q-i06', question_type: 'inference', query: 'Which company both supplied solar panels and a grid-scale battery to Northwind Energy?', answer: 'Pacific Robotics', evidence: [
    { key: 'pr-panel-supply', fact: 'Pacific Robotics supplies solar panels to Northwind.' },
    { key: 'ne-battery', fact: 'Pacific Robotics supplied the grid-scale battery.' },
  ] },
  { id: 'q-i07', question_type: 'inference', query: 'Which agency that awarded Orbital Dynamics a $480 million contract also raised its 2024 budget?', answer: 'Global Space Agency', evidence: [
    { key: 'od-contract-gsa', fact: 'The GSA awarded the $480 million contract.' },
    { key: 'gsa-budget', fact: 'The GSA raised its 2024 budget on August 15, 2023.' },
  ] },
  { id: 'q-i08', question_type: 'inference', query: 'Which company cancelled an offshore wind project while piloting a grid-scale battery?', answer: 'Northwind Energy', evidence: [
    { key: 'ne-wind-farm', fact: 'Northwind Energy cancelled its offshore wind project.' },
    { key: 'ne-battery', fact: 'Northwind Energy pilots a grid-scale battery.' },
  ] },
  { id: 'q-i09', question_type: 'inference', query: 'The Titan-VII engine anomaly that delayed the Europa Clipper-II involves the same rocket family used by which company lander?', answer: 'Helios Aerospace', evidence: [
    { key: 'od-titan-launch-failure', fact: 'A Titan-VII engine anomaly caused the delay.' },
    { key: 'ha-artemis9-launch', fact: 'Helios used the Titan-VII rocket.' },
  ] },
  { id: 'q-i10', question_type: 'inference', query: 'Which company both employed 4,200 people and developed the Europa Clipper-II probe?', answer: 'Orbital Dynamics', evidence: [
    { key: 'od-revenue', fact: 'Orbital Dynamics employed 4,200 people.' },
    { key: 'od-europa-probe', fact: 'Orbital Dynamics developed the Europa Clipper-II.' },
  ] },
  { id: 'q-i11', question_type: 'inference', query: 'Which institute hardware, delivered on February 15, 2023, reached the Moon aboard the Artemis-9?', answer: 'Terra Nova Institute', evidence: [
    { key: 'tni-icecore', fact: 'The IceCore drill was delivered on February 15, 2023.' },
    { key: 'ha-artemis9-landing', fact: 'The drill reached the Moon aboard Artemis-9.' },
  ] },
  { id: 'q-i12', question_type: 'inference', query: 'Which chief executive said the 800 new engineering hires reflect growing demand for the Artemis program?', answer: 'Dr. Maya Chen', evidence: [
    { key: 'ha-employees', fact: 'The hiring of 800 engineers reflects demand for Artemis.' },
    { key: 'ha-ceo-chen', fact: 'Dr. Maya Chen is the Helios chief executive.' },
  ] },

  // ===== Null Query（12）：答案不在语料中 =====
  { id: 'q-n01', question_type: 'null', query: 'What is the name of the Helios Aerospace submarine program?', answer: 'No', evidence: [] },
  { id: 'q-n02', question_type: 'null', query: 'How many employees does Verdant Labs have?', answer: 'No', evidence: [] },
  { id: 'q-n03', question_type: 'null', query: 'What is the stock ticker symbol of Northwind Energy?', answer: 'No', evidence: [] },
  { id: 'q-n04', question_type: 'null', query: 'What fuel does the Europa Clipper-II probe engine use?', answer: 'No', evidence: [] },
  { id: 'q-n05', question_type: 'null', query: 'Which university developed the IceCore drill?', answer: 'No', evidence: [] },
  { id: 'q-n06', question_type: 'null', query: 'Who is the chief executive officer of Orbital Dynamics?', answer: 'No', evidence: [] },
  { id: 'q-n07', question_type: 'null', query: 'How much did Helios Aerospace spend to build the Artemis-9 lunar lander?', answer: 'No', evidence: [] },
  { id: 'q-n08', question_type: 'null', query: 'Which city hosts the Global Space Agency headquarters?', answer: 'No', evidence: [] },
  { id: 'q-n09', question_type: 'null', query: 'What is the total installed wind capacity of Northwind Energy?', answer: 'No', evidence: [] },
  { id: 'q-n10', question_type: 'null', query: 'Who is the director of the Global Space Agency?', answer: 'No', evidence: [] },
  { id: 'q-n11', question_type: 'null', query: 'What is the launch mass of the Europa Clipper-II probe?', answer: 'No', evidence: [] },
  { id: 'q-n12', question_type: 'null', query: 'In which year was Orbital Dynamics founded?', answer: 'No', evidence: [] },
]

/** 用语料元数据把编辑态查询展开为完整的官方同构结构 */
function expandQueries(queries: RawQuery[], corpus: MultiHopCorpusDoc[]): MultiHopQuery[] {
  const byKey = new Map(corpus.map((doc) => [doc.key, doc]))
  return queries.map((raw) => {
    const evidence_list: MultiHopEvidence[] = raw.evidence.map((item) => {
      const doc = byKey.get(item.key)
      if (!doc) throw new Error(`内置样例校验失败：查询 ${raw.id} 引用了不存在的语料 key=${item.key}`)
      return {
        fact: item.fact,
        source: doc.source,
        title: doc.title,
        published_at: doc.published_at,
        author: doc.author,
      }
    })
    return {
      id: raw.id,
      query: raw.query,
      answer: raw.answer,
      question_type: raw.question_type,
      evidence_list,
    }
  })
}

/** 内置离线样例数据集（18 篇语料 + 50 条查询） */
export const EMBEDDED_SAMPLE: MultiHopDataset = {
  origin: 'embedded-sample',
  label: '内置离线样例（合成语料 · 50 题）',
  embedded: true,
  corpus: EMBEDDED_CORPUS,
  queries: expandQueries(RAW_QUERIES, EMBEDDED_CORPUS),
}

/**
 * 校验内置样例自洽性：题量、题型分布、证据标题均可命中语料。
 * 返回校验问题列表，空数组表示完全自洽。
 */
export function validateEmbeddedSample(sample: MultiHopDataset = EMBEDDED_SAMPLE): string[] {
  const problems: string[] = []
  const titles = new Set(sample.corpus.map((doc) => doc.title.trim().toLowerCase()))
  if (sample.corpus.length === 0) problems.push('内置语料为空')
  if (sample.queries.length === 0) problems.push('内置查询为空')

  const typeCounts = new Map<string, number>()
  for (const query of sample.queries) {
    typeCounts.set(query.question_type, (typeCounts.get(query.question_type) ?? 0) + 1)
    for (const evidence of query.evidence_list) {
      if (!titles.has(evidence.title.trim().toLowerCase())) {
        problems.push(`查询 ${query.id} 的证据标题未命中语料：${evidence.title}`)
      }
    }
    if (query.question_type !== 'null' && query.evidence_list.length < 2) {
      problems.push(`查询 ${query.id} 为多跳题型但证据少于 2 条`)
    }
  }
  if (typeCounts.get('inference') === undefined) problems.push('缺少 inference 题型')
  if (typeCounts.get('comparison') === undefined) problems.push('缺少 comparison 题型')
  if (typeCounts.get('temporal') === undefined) problems.push('缺少 temporal 题型')
  if (typeCounts.get('null') === undefined) problems.push('缺少 null 题型')
  return problems
}
