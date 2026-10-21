/**
 * Shared utility functions for proma
 */

// Placeholder - will be expanded as needed
export function noop(): void {
  // no-op
}

export { diffCapabilities } from './capabilities-diff'
export type { CapabilityChange } from './capabilities-diff'
export { parseGoalCommand, parseGoalContractInput, parseGoalLimitsInput, getGoalBudgetExhaustedReasons, stripGoalResultBlocks, GOAL_UPDATE_TOOL_NAME, isGoalIterationMessage, isGoalUpdateToolName } from './goal-contract'
export type { GoalLimitsInput } from './goal-contract'
export {
  DEFAULT_CONTEXT_WINDOW,
  ONE_MILLION_CONTEXT_WINDOW,
  CODEX_GPT_CONTEXT_WINDOW,
  CODEX_GPT_54_MINI_CONTEXT_WINDOW,
  supports1MContext,
  supportsVerified1MContext,
  isNextGeneration1MContextModel,
  inferContextWindow,
  normalizeContextModelId,
  isDeepSeekV4Model,
  resolveAgentSdkModelId,
  strip1MContextSuffix,
  resolveOneMillionContextDecision,
  resolveAgentSdk1MSelection,
  inferAgentSdkContextWindow,
  resolveContextWindowFromModelUsage,
} from './context-window'
export type { OneMillionContextSource, OneMillionContextDecision, AgentSdk1MSelection } from './context-window'
export { calculateContextUsageRatio } from './context-usage'
export {
  THINKING_SIGNATURE_ERROR_CODE,
  THINKING_SIGNATURE_ERROR_TITLE,
  THINKING_SIGNATURE_ERROR_MESSAGE,
  isThinkingSignatureError,
  formatThinkingSignatureError,
  normalizeThinkingSignatureError,
} from './thinking-signature-error'
export { normalizePathForCompare } from './normalize-path'
export {
  DEFAULT_IMAGE_ATTACHMENT_PROMPT,
  resolveAgentAttachmentPrompt,
  isImageAttachmentMediaType,
} from './agent-image-attachment'
export type { AgentAttachmentKind } from './agent-image-attachment'
export { supportsProviderPlanQuota } from './channel-plan-quota'
export { promoteMru, removeMruId, selectMruFallbackId } from './tab-mru'
// Pi 自动压缩阈值（SWE-Compressor 32k 封顶）
export {
  PI_AUTO_COMPACTION_MAX_TOKENS,
  PI_AUTO_COMPACTION_TRIGGER_TOKENS,
  PI_AUTO_COMPACTION_THRESHOLD_RATIO,
  calculatePiAutoCompactionReserveTokens,
  calculatePiAutoCompactionThresholdTokens,
} from './pi-compaction'
// 定时任务触发时间展开（日历视图展示用，多值调度适配）
export {
  getAutomationOccurrencesByDay,
  AUTOMATION_OCCURRENCE_SAMPLES_PER_DAY,
} from './automation-schedule'
export type {
  AutomationScheduleFields,
  AutomationOccurrenceDay,
} from './automation-schedule'
export { pruneToolOutputByEntropy } from './context-entropy-pruner'
export type { EntropyPruneOptions } from './context-entropy-pruner'
// 思维导图引擎（径向整齐树布局 / 贝塞尔连线 / OPML 2.0 导出），主进程与渲染进程共用
export {
  layoutMindMap,
  estimateMindMapNodeSize,
  buildBezierPath,
  computeAnchorZoomPan,
  flattenMindMap,
  buildNodeStudyPrompt,
  mindMapToOpml,
  parseMindMapText,
  stripMermaidNodeLabel,
} from './mindmap-engine'
export type { MindMapPoint, MindMapLayoutOptions } from './mindmap-engine'
// FIM 潜伏认知能力评级映射（测验与学情展示共用）
export { describeTheta } from './fim-engine'
// CSLab 图表数字化标定与磁性吸附（主进程 / 渲染进程共用）
export {
  fitAxisScale,
  mapPixelToValue,
  projectPointOnSegment,
  snapPointToPolyline,
  polygonArea,
} from './cslab-plot'
export type {
  CsLabPoint,
  CsLabSegmentProjection,
  CsLabAxisScaleFit,
} from './cslab-plot'
// Zotero 批注四向仿射（主进程与渲染进程共用纯函数）
export {
  normalizeRotation,
  parseZoteroAnnotationPosition,
  zoteroRectToViewport,
} from './cslab-zotero'
export type {
  ZoteroAnnotationPosition,
  ZoteroRect,
  ZoteroRotation,
  ZoteroViewportRect,
} from './cslab-zotero'
// CSLab JSON Canvas 无损读写与 Vault 语法（主进程 / 渲染进程共用）
export {
  applyDagEvaluation,
  buildConflictRelPath,
  canvasTitleFromRelPath,
  canvasToDagGraph,
  createEmptyCanvasDocument,
  mergeCanvasScienceMeta,
  parseCanvasDocument,
  serializeCanvasDocument,
} from './cslab-canvas'
export type { CanvasMetaMergeResult } from './cslab-canvas'
// CSLab Prove2Me DAG 推演引擎
export {
  evaluateDag,
  findCanvasCycleIds,
  flattenCycleIds,
  topologicalOrder,
  wouldCreateCycle,
} from './cslab-dag'
// CSLab 晶体学数学（CIF 晶胞 / 晶面间距 / 倒易法向量 / 2θ 反查）
export {
  CSLAB_XRAY_WAVELENGTHS,
  assignReflections,
  buildMillerPlane,
  cartesianToFractional,
  cellBasis,
  cellCenter,
  cellMaxLength,
  cellVolume,
  dSpacing,
  enumerateReflections,
  fractionalToCartesian,
  parseCifLattice,
  periodicDistance,
  planeBasis,
  reciprocalNormal,
  twoThetaFromD,
} from './cslab-crystal'
export type {
  AssignReflectionsOptions,
  CsLabCellBasis,
  EnumerateReflectionsOptions,
} from './cslab-crystal'
// CSLab 审稿旁注一维避障排程
export { buildConnectorPath, calculateMarginaliaLayout } from './cslab-marginalia'
export type {
  CsLabCommentAnchor,
  CsLabPositionedComment,
} from './cslab-marginalia'
// CSLab 审稿建议跨块切片计划
export {
  describeSuggestionPlanFailure,
  planSuggestionApplication,
} from './cslab-track-changes'
export type {
  CsLabDocBlock,
  CsLabSuggestionPlan,
  CsLabSuggestionSlice,
} from './cslab-track-changes'
// CSLab 科学引擎：结构解析 / 对称性 / PXRD / 拟合 / 多面体 / 体数据 / 等值面
export {
  CSLAB_ATOMIC_MASSES,
  CSLAB_ATOMIC_NUMBERS,
  CSLAB_CROMER_MANN,
} from './cslab-scattering-data'
export type { CsLabCromerMann } from './cslab-scattering-data'
export {
  CSLAB_SPACE_GROUPS,
  findSpaceGroupByHm,
  findSpaceGroupByNumber,
} from './cslab-space-group-data'
export {
  analyzeCrystalStructure,
  analyzeCrystalText,
  buildStructureFromText,
  computeCrystalDensity,
  formatCrystalFormula,
  parseStructureText,
} from './cslab-analysis'
export { CsLabCifParseError, normalizeElement, parseCif, tokenizeCif } from './cslab-cif'
export { CsLabPoscarParseError, parsePoscar } from './cslab-poscar'
export { CsLabXyzParseError, parseXyz } from './cslab-xyz'
export {
  CSLAB_SPACE_GROUP_SEEDS,
  CsLabSymmetryError,
  buildCrystalStructure,
  cellSignature,
  composeOperations,
  detectSpaceGroup,
  expandAtoms,
  generateSpaceGroupOperations,
  parseSymmetryOperationXyz,
  siteSymmetryOrder,
  systematicAbsence,
} from './cslab-symmetry'
export type { ExpandAtomsOptions } from './cslab-symmetry'
export {
  atomicFormFactor,
  dFromTwoTheta,
  lorentzPolarization,
  reflectionMultiplicity,
  reflectionTwoTheta,
  simulatePxrd,
} from './cslab-pxrd'
export type { CsLabFormFactorResult } from './cslab-pxrd'
export {
  aslsBaseline,
  centroid,
  fitPeaks,
  fwhmFromCurve,
  gaussian,
  integrateTrapezoid,
  levenbergMarquardt,
  lorentzian,
  polynomialBaseline,
  profileArea,
  profileAt,
  pseudoVoigt,
  smoothSeries,
} from './cslab-fitting'
export type {
  LevenbergMarquardtOptions,
  LevenbergMarquardtResult,
} from './cslab-fitting'
export { buildNeighborList, buildPolyhedra } from './cslab-polyhedra'
export {
  CsLabVolumeParseError,
  downsampleGrid,
  gridSlice,
  parseChgcar,
  parseCube,
  parseLocpot,
  sampleGrid,
} from './cslab-volume'
export { extractIsosurfaceCpu, sampleVolume } from './cslab-isosurface'
export {
  JOURNAL_PRESETS,
  axisFraction,
  computePlotLayout,
  createPlotDocument,
  defaultAxisConfig,
  detectAxisBreakSegments,
  formatMetric,
  niceTicks,
  normalizePlotDocument,
  parseScientificText,
  scaleInverse,
  scaleValue,
} from './cslab-plot-doc'
export type { CreatePlotDocumentInput } from './cslab-plot-doc'
export {
  __axisTickValues,
  __scaleValue,
  describeAxisRange,
  hasEditableText,
  hasEmbeddedImage,
  renderPlotSvg,
  svgToDataUrl,
} from './cslab-plot-svg'
