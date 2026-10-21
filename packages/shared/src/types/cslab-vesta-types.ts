/**
 * CSLab 晶体学与体数据契约（VESTA 级工作台）
 *
 * 只定义数据类型，不包含运行时逻辑；主进程、渲染进程与 Worker 共用。
 */

import type { CsLabCrystalCell } from './cslab'

/** 结构文件格式（可携带原子坐标）。 */
export type CsLabStructureFormat = 'cif' | 'poscar' | 'xyz'

/** 体数据格式（三维规则网格标量场）。 */
export type CsLabVolumeFormat = 'cube' | 'chgcar' | 'locpot'

export type CsLabCrystalSystem =
  | 'triclinic'
  | 'monoclinic'
  | 'orthorhombic'
  | 'tetragonal'
  | 'trigonal'
  | 'hexagonal'
  | 'cubic'

export type CsLabLatticeCentering = 'P' | 'A' | 'B' | 'C' | 'I' | 'F' | 'R'

export type CsLabSpaceGroupSource = 'cif' | 'table' | 'assumed-p1'

/** 空间群生成元种子（数据文件条目）。 */
export interface CsLabSpaceGroupSeed {
  number: number
  /** 标准 Hall 设置下的 Hermann-Mauguin 符号（使用 `_` 表示下标）。 */
  hm: string
  crystalSystem: CsLabCrystalSystem
  centering: CsLabLatticeCentering
  /** 一般位置操作数（一般位置多重度），用于自校验。 */
  order: number
  /** 1-5 条生成元 xyz 字符串，运行时闭包展开。 */
  generators: string[]
}

/** 单条对称操作：旋转矩阵为整数，平移为 0-1 的分数。 */
export interface CsLabSymmetryOperation {
  id: string
  xyz: string
  rotation: [number, number, number][]
  translation: [number, number, number]
}

export interface CsLabSpaceGroupInfo {
  number?: number
  symbol: string
  hallSymbol?: string
  crystalSystem?: CsLabCrystalSystem
  centering?: CsLabLatticeCentering
  source: CsLabSpaceGroupSource
}

export interface CsLabCrystalAtom {
  label: string
  element: string
  /** 分数坐标。 */
  fractional: [number, number, number]
  occupancy: number
  bIso?: number
  uIso?: number
  wyckoff?: string
  siteSymmetry?: string
  multiplicity?: number
  cartesian?: [number, number, number]
}

/** CIF 解析结果（尚未做对称性展开）。 */
export interface CsLabCifDocument {
  cell: CsLabCrystalCell
  spaceGroupHm?: string
  spaceGroupNumber?: number
  hallSymbol?: string
  /** CIF 中显式给出的对称操作 xyz 字符串。 */
  symmetryOperations: string[]
  atoms: CsLabCrystalAtom[]
  warnings: string[]
}

/** POSCAR / XYZ 解析结果（与 CIF 解析结果同构的最小集合）。 */
export interface CsLabStructureParseResult {
  format?: CsLabStructureFormat
  cell: CsLabCrystalCell
  spaceGroupHm?: string
  spaceGroupNumber?: number
  symmetryOperations: string[]
  atoms: CsLabCrystalAtom[]
  warnings: string[]
}

/** 晶体结构（已完成空间群判定，原子仍是输入位点）。 */
export interface CsLabCrystalStructure {
  format: CsLabStructureFormat
  cell: CsLabCrystalCell
  spaceGroup: CsLabSpaceGroupInfo
  operations: CsLabSymmetryOperation[]
  atoms: CsLabCrystalAtom[]
  density?: number
  warnings: string[]
}

export interface CsLabWyckoffSite {
  label: string
  element: string
  wyckoff?: string
  multiplicity: number
  siteSymmetry?: string
  fractional: [number, number, number]
}

export interface CsLabCrystalAnalysis {
  structure: CsLabCrystalStructure
  atomCount: number
  expandedAtomCount: number
  formula: string
  cellVolume: number
  density?: number
  wyckoff: CsLabWyckoffSite[]
  warnings: string[]
}

export interface CsLabSupercellRequest {
  na: number
  nb: number
  nc: number
}

export interface CsLabSupercellResult {
  atoms: CsLabCrystalAtom[]
  na: number
  nb: number
  nc: number
}

export type CsLabPeakProfile = 'gaussian' | 'lorentzian' | 'pseudo_voigt'

export interface CsLabPxrdOptions {
  wavelengthAngstrom?: number
  minTwoTheta?: number
  maxTwoTheta?: number
  fwhmDeg?: number
  profile?: CsLabPeakProfile
  /** Pseudo-Voigt 洛伦兹占比，0-1，默认 0.5。 */
  eta?: number
  maxIndex?: number
  stepDeg?: number
  zeroShiftDeg?: number
}

export interface CsLabPxrdPeak {
  h: number
  k: number
  l: number
  d: number
  twoTheta: number
  multiplicity: number
  structureFactor: number
  intensity: number
  relativeIntensity: number
}

export interface CsLabPxrdPattern {
  peaks: CsLabPxrdPeak[]
  curve: { x: number[]; y: number[] }
  wavelengthAngstrom: number
  options: CsLabPxrdOptions
  warnings: string[]
}

export interface CsLabPolyhedron {
  centerIndex: number
  centerElement: string
  neighborIndices: number[]
  neighborElements: string[]
  /** 顶点笛卡尔坐标扁平数组（x,y,z × N）。 */
  vertices: number[]
  /** 三角面索引，每三个一组。 */
  faces: number[]
  coordinationNumber: number
  volume: number
  meanBondLength: number
  bondLengthVariance: number
  distortion: number
}

export interface CsLabNeighborOptions {
  centerElement: string
  neighborElements: string[]
  cutoff: number
}

export interface CsLabVolumeAsset {
  uri: string
  labId: string
  title: string
  format: CsLabVolumeFormat
  text: string
  bytes: number
}

export interface CsLabVolumeGrid {
  format: CsLabVolumeFormat
  dimensions: [number, number, number]
  origin: [number, number, number]
  /** 三个方向的体素步进矢量（Å）。 */
  voxelVectors: [number[], number[], number[]]
  /** 按 z-major（x 最快）展开的标量场。 */
  values: Float32Array
  min: number
  max: number
  atomCount: number
  warnings: string[]
}

export interface CsLabIsoMesh {
  positions: Float32Array
  normals: Float32Array
  indices: Uint32Array
  triangleCount: number
  isovalue: number
  phase: 'positive' | 'negative'
}

export interface CsLabIsosurfaceResult {
  positive?: CsLabIsoMesh
  negative?: CsLabIsoMesh
  backend: 'webgpu' | 'cpu'
  elapsedMs: number
}

/** 体数据降采样后的统一返回。 */
export interface CsLabDownsampledGrid {
  grid: CsLabVolumeGrid
  downsampled: boolean
}
