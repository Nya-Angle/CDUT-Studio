/**
 * Mol* 自定义状态层：Miller 晶面切片
 *
 * 说明：
 * - Mol* v5 的 MeshBuilder 没有 addPlane，这里用 planeBasis 自行构造两个三角形；
 * - 自定义 StateTransformer 通过 PluginSpec.actions 注册，成为状态树一等公民；
 * - 版本敏感的深路径导入全部收敛在本文件，便于升级时单点修正。
 */

import { PluginStateObject } from 'molstar/lib/mol-plugin-state/objects'
import { StateTransformer } from 'molstar/lib/mol-state'
import { ParamDefinition as PD } from 'molstar/lib/mol-util/param-definition'
import { MeshBuilder } from 'molstar/lib/mol-geo/geometry/mesh/mesh-builder'
import { Mesh } from 'molstar/lib/mol-geo/geometry/mesh/mesh'
import { Shape } from 'molstar/lib/mol-model/shape'
import { Color } from 'molstar/lib/mol-util/color'
import { Vec3 } from 'molstar/lib/mol-math/linear-algebra'
import { DefaultPluginSpec, PluginSpec } from 'molstar/lib/mol-plugin/spec'
import { planeBasis } from '@profer/shared'

export const CSLAB_PLANE_COLOR = 0x3399ff

function safeNormal(nx: number, ny: number, nz: number): [number, number, number] {
  const length = Math.hypot(nx, ny, nz)
  if (!Number.isFinite(length) || length < 1e-9) return [0, 1, 0]
  return [nx / length, ny / length, nz / length]
}

/** 半透明 Miller 晶面切片（双面三角形，避免背面剔除导致“消失”）。 */
export const DrawMillerPlane = StateTransformer.builderFactory('cdut-science')({
  name: 'draw-miller-plane',
  display: { name: 'Miller Plane Slice' },
  from: PluginStateObject.Root,
  to: PluginStateObject.Shape.Provider,
  params: {
    h: PD.Numeric(1),
    k: PD.Numeric(1),
    l: PD.Numeric(0),
    nx: PD.Numeric(1),
    ny: PD.Numeric(1),
    nz: PD.Numeric(0),
    cx: PD.Numeric(0),
    cy: PD.Numeric(0),
    cz: PD.Numeric(0),
    size: PD.Numeric(10),
  },
})({
  apply({ params }) {
    const normal = safeNormal(params.nx, params.ny, params.nz)
    const { u, v } = planeBasis(normal)
    const half = Math.max(1, params.size) / 2
    const center = Vec3.create(params.cx, params.cy, params.cz)

    const corner = (su: number, sv: number): Vec3 =>
      Vec3.create(
        center[0]! + u[0]! * half * su + v[0]! * half * sv,
        center[1]! + u[1]! * half * su + v[1]! * half * sv,
        center[2]! + u[2]! * half * su + v[2]! * half * sv,
      )

    const p1 = corner(-1, -1)
    const p2 = corner(1, -1)
    const p3 = corner(1, 1)
    const p4 = corner(-1, 1)
    const normalVec = Vec3.create(normal[0], normal[1], normal[2])

    const builder = MeshBuilder.createState(32, 32)
    builder.currentGroup = 0
    // 正反两面各画一次，透明材质下从任意侧都可见。
    MeshBuilder.addTriangleWithNormal(builder, p1, p2, p3, normalVec)
    MeshBuilder.addTriangleWithNormal(builder, p1, p3, p4, normalVec)
    MeshBuilder.addTriangleWithNormal(builder, p1, p4, p3, Vec3.create(-normal[0], -normal[1], -normal[2]))
    MeshBuilder.addTriangleWithNormal(builder, p1, p3, p2, Vec3.create(-normal[0], -normal[1], -normal[2]))

    const mesh = MeshBuilder.getMesh(builder)
    const label = `Miller Plane (${params.h}${params.k}${params.l})`
    const shape = Shape.create(
      label,
      {},
      mesh,
      () => Color(CSLAB_PLANE_COLOR),
      () => 1,
      () => label,
      undefined,
      1,
    )

    return new PluginStateObject.Shape.Provider(
      {
        label,
        data: {},
        params: Mesh.Params,
        geometryUtils: Mesh.Utils,
        getShape: () => shape,
      },
      { label },
    )
  },
})

function emptyShape(label: string, color: number) {
  const builder = MeshBuilder.createState(9, 3)
  builder.currentGroup = 0
  const mesh = MeshBuilder.getMesh(builder)
  const shape = Shape.create(label, {}, mesh, () => Color(color), () => 1, () => label)
  return new PluginStateObject.Shape.Provider(
    {
      label,
      data: {},
      params: Mesh.Params,
      geometryUtils: Mesh.Utils,
      getShape: () => shape,
    },
    { label },
  )
}

function triangleNormal(
  p0: [number, number, number],
  p1: [number, number, number],
  p2: [number, number, number],
): Vec3 {
  const ux = p1[0] - p0[0]
  const uy = p1[1] - p0[1]
  const uz = p1[2] - p0[2]
  const vx = p2[0] - p0[0]
  const vy = p2[1] - p0[1]
  const vz = p2[2] - p0[2]
  const nx = uy * vz - uz * vy
  const ny = uz * vx - ux * vz
  const nz = ux * vy - uy * vx
  const length = Math.hypot(nx, ny, nz)
  if (!(length > 1e-12)) return Vec3.create(0, 0, 1)
  return Vec3.create(nx / length, ny / length, nz / length)
}

/** 配位多面体三角网格（半透明着色在材质层由颜色明度近似）。 */
export const DrawCrystalPolyhedra = StateTransformer.builderFactory('cdut-science')({
  name: 'draw-crystal-polyhedra',
  display: { name: 'Crystal Polyhedra' },
  from: PluginStateObject.Root,
  to: PluginStateObject.Shape.Provider,
  params: {
    vertices: PD.Value<number[]>([]),
    faces: PD.Value<number[]>([]),
    color: PD.Numeric(0x4a90d9, { min: 0, max: 0xffffff, step: 1 }),
    opacity: PD.Numeric(0.45, { min: 0, max: 1, step: 0.05 }),
  },
})({
  apply({ params }) {
    const label = 'Crystal Polyhedra'
    const vertices = params.vertices
    const faces = params.faces
    if (vertices.length < 9 || faces.length < 3) return emptyShape(label, params.color)

    const builder = MeshBuilder.createState(
      Math.max(9, Math.floor(vertices.length / 3)),
      Math.max(3, Math.floor(faces.length / 3)),
    )
    builder.currentGroup = 0
    const point = (index: number): [number, number, number] => [
      vertices[index * 3] ?? 0,
      vertices[index * 3 + 1] ?? 0,
      vertices[index * 3 + 2] ?? 0,
    ]
    for (let index = 0; index + 2 < faces.length; index += 3) {
      const a = point(faces[index]!)
      const b = point(faces[index + 1]!)
      const c = point(faces[index + 2]!)
      const normal = triangleNormal(a, b, c)
      MeshBuilder.addTriangleWithNormal(
        builder,
        Vec3.create(a[0], a[1], a[2]),
        Vec3.create(b[0], b[1], b[2]),
        Vec3.create(c[0], c[1], c[2]),
        normal,
      )
    }

    const mesh = MeshBuilder.getMesh(builder)
    const shape = Shape.create(
      label,
      {},
      mesh,
      () => Color(params.color),
      () => 1,
      () => label,
      undefined,
      1,
    )
    return new PluginStateObject.Shape.Provider(
      {
        label,
        data: {},
        params: Mesh.Params,
        geometryUtils: Mesh.Utils,
        getShape: () => shape,
      },
      { label },
    )
  },
})

/** 电荷密度等值面三角网格。 */
export const DrawIsoSurface = StateTransformer.builderFactory('cdut-science')({
  name: 'draw-isosurface',
  display: { name: 'Isosurface' },
  from: PluginStateObject.Root,
  to: PluginStateObject.Shape.Provider,
  params: {
    positions: PD.Value<number[]>([]),
    normals: PD.Value<number[]>([]),
    indices: PD.Value<number[]>([]),
    color: PD.Numeric(0xf2c94c, { min: 0, max: 0xffffff, step: 1 }),
    label: PD.Text('Isosurface'),
  },
})({
  apply({ params }) {
    const label = params.label || 'Isosurface'
    const positions = params.positions
    const indices = params.indices
    if (positions.length < 9 || indices.length < 3) return emptyShape(label, params.color)

    const builder = MeshBuilder.createState(
      Math.max(9, Math.floor(positions.length / 3)),
      Math.max(3, Math.floor(indices.length / 3)),
    )
    builder.currentGroup = 0
    const point = (index: number): [number, number, number] => [
      positions[index * 3] ?? 0,
      positions[index * 3 + 1] ?? 0,
      positions[index * 3 + 2] ?? 0,
    ]
    const pointNormal = (index: number): Vec3 | null => {
      if (params.normals.length < positions.length) return null
      const x = params.normals[index * 3] ?? 0
      const y = params.normals[index * 3 + 1] ?? 0
      const z = params.normals[index * 3 + 2] ?? 0
      if (!(Math.hypot(x, y, z) > 1e-9)) return null
      return Vec3.create(x, y, z)
    }
    for (let index = 0; index + 2 < indices.length; index += 3) {
      const ia = indices[index]!
      const ib = indices[index + 1]!
      const ic = indices[index + 2]!
      const a = point(ia)
      const b = point(ib)
      const c = point(ic)
      const normal =
        pointNormal(ia) ??
        pointNormal(ib) ??
        pointNormal(ic) ??
        triangleNormal(a, b, c)
      MeshBuilder.addTriangleWithNormal(
        builder,
        Vec3.create(a[0], a[1], a[2]),
        Vec3.create(b[0], b[1], b[2]),
        Vec3.create(c[0], c[1], c[2]),
        normal,
      )
    }

    const mesh = MeshBuilder.getMesh(builder)
    const shape = Shape.create(
      label,
      {},
      mesh,
      () => Color(params.color),
      () => 1,
      () => label,
      undefined,
      1,
    )
    return new PluginStateObject.Shape.Provider(
      {
        label,
        data: {},
        params: Mesh.Params,
        geometryUtils: Mesh.Utils,
        getShape: () => shape,
      },
      { label },
    )
  },
})

/** 只追加自定义 transformer，不改动其它默认能力。 */
export function buildPluginSpec(): ReturnType<typeof DefaultPluginSpec> {
  const spec = DefaultPluginSpec()
  spec.actions = [
    ...(spec.actions ?? []),
    PluginSpec.Action(DrawMillerPlane),
    PluginSpec.Action(DrawCrystalPolyhedra),
    PluginSpec.Action(DrawIsoSurface),
  ]
  return spec
}

export interface MillerPlaneParams {
  h: number
  k: number
  l: number
  normal: [number, number, number]
  center?: [number, number, number]
  /** 晶胞尺度下的平面边长（Å）。 */
  size: number
}
