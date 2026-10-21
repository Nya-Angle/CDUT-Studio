// CSLab 等值面提取 Compute Shader（Marching Tetrahedra）
//
// 每个 invocation 处理一个体素，把立方体拆成 6 个四面体；
// 对每个四面体收集 0-4 个边交点，再按 3/4 顶点三角化。
// 法线由体数据梯度变换到笛卡尔坐标；三角形绕序按法线自动校正。

struct Params {
  dims: vec4<u32>,      // nx, ny, nz, pad
  iso: vec4<f32>,       // isovalue, pad, pad, pad
  origin: vec4<f32>,    // ox, oy, oz, pad
  stepA: vec4<f32>,     // ax, ay, az, pad
  stepB: vec4<f32>,     // bx, by, bz, pad
  stepC: vec4<f32>,     // cx, cy, cz, pad
  recA: vec4<f32>,      // 倒易基 a*
  recB: vec4<f32>,
  recC: vec4<f32>,
}

@group(0) @binding(0) var<storage, read> volume: array<f32>;
@group(0) @binding(1) var<uniform> params: Params;
@group(0) @binding(2) var<storage, read_write> vertices: array<f32>;
@group(0) @binding(3) var<storage, read_write> counter: array<atomic<u32>>;

const CORNERS: array<vec3<u32>, 8> = array<vec3<u32>, 8>(
  vec3<u32>(0u, 0u, 0u),
  vec3<u32>(1u, 0u, 0u),
  vec3<u32>(1u, 1u, 0u),
  vec3<u32>(0u, 1u, 0u),
  vec3<u32>(0u, 0u, 1u),
  vec3<u32>(1u, 0u, 1u),
  vec3<u32>(1u, 1u, 1u),
  vec3<u32>(0u, 1u, 1u),
);

const TETS: array<vec4<u32>, 6> = array<vec4<u32>, 6>(
  vec4<u32>(0u, 5u, 1u, 6u),
  vec4<u32>(0u, 1u, 2u, 6u),
  vec4<u32>(0u, 2u, 3u, 6u),
  vec4<u32>(0u, 3u, 7u, 6u),
  vec4<u32>(0u, 7u, 4u, 6u),
  vec4<u32>(0u, 4u, 5u, 6u),
);

const EDGES: array<vec2<u32>, 6> = array<vec2<u32>, 6>(
  vec2<u32>(0u, 1u),
  vec2<u32>(0u, 2u),
  vec2<u32>(0u, 3u),
  vec2<u32>(1u, 2u),
  vec2<u32>(1u, 3u),
  vec2<u32>(2u, 3u),
);

struct Vertex {
  position: vec3<f32>,
  normal: vec3<f32>,
}

fn gridIndex(ix: u32, iy: u32, iz: u32) -> u32 {
  return ix + params.dims.x * (iy + params.dims.y * iz);
}

fn valueAt(ix: u32, iy: u32, iz: u32) -> f32 {
  return volume[gridIndex(ix, iy, iz)];
}

fn positionAt(ix: f32, iy: f32, iz: f32) -> vec3<f32> {
  return params.origin.xyz + params.stepA.xyz * ix + params.stepB.xyz * iy + params.stepC.xyz * iz;
}

fn gradientAt(ix: u32, iy: u32, iz: u32) -> vec3<f32> {
  let nx = params.dims.x;
  let ny = params.dims.y;
  let nz = params.dims.z;
  let x0 = select(ix - 1u, 0u, ix == 0u);
  let x1 = min(ix + 1u, nx - 1u);
  let y0 = select(iy - 1u, 0u, iy == 0u);
  let y1 = min(iy + 1u, ny - 1u);
  let z0 = select(iz - 1u, 0u, iz == 0u);
  let z1 = min(iz + 1u, nz - 1u);
  let gx = (valueAt(x1, iy, iz) - valueAt(x0, iy, iz)) * 0.5;
  let gy = (valueAt(ix, y1, iz) - valueAt(ix, y0, iz)) * 0.5;
  let gz = (valueAt(ix, iy, z1) - valueAt(ix, iy, z0)) * 0.5;
  let gradient = params.recA.xyz * gx + params.recB.xyz * gy + params.recC.xyz * gz;
  let lengthValue = length(gradient);
  if (lengthValue < 1e-8) {
    return vec3<f32>(0.0, 0.0, 1.0);
  }
  return gradient / lengthValue;
}

fn interpolateVertex(
  p0: vec3<f32>, p1: vec3<f32>,
  v0: f32, v1: f32,
  i0: vec3<u32>, i1: vec3<u32>,
) -> Vertex {
  let iso = params.iso.x;
  let denominator = v1 - v0;
  var t = 0.5;
  if (abs(denominator) > 1e-12) {
    t = clamp((iso - v0) / denominator, 0.0, 1.0);
  }
  let position = mix(p0, p1, t);
  let indexF = mix(vec3<f32>(i0), vec3<f32>(i1), t);
  let index = vec3<u32>(
    min(u32(round(indexF.x)), params.dims.x - 1u),
    min(u32(round(indexF.y)), params.dims.y - 1u),
    min(u32(round(indexF.z)), params.dims.z - 1u),
  );
  return Vertex(position, gradientAt(index.x, index.y, index.z));
}

fn emitTriangle(a: Vertex, b: Vertex, c: Vertex) {
  let faceNormal = cross(b.position - a.position, c.position - a.position);
  let averageNormal = a.normal + b.normal + c.normal;
  var v1 = b;
  var v2 = c;
  if (dot(faceNormal, averageNormal) < 0.0) {
    v1 = c;
    v2 = b;
  }

  let maxFloats = arrayLength(&vertices);
  let base = atomicAdd(&counter[0], 3u);
  if (base + 2u >= maxFloats / 6u) {
    return;
  }
  let offset = base * 6u;
  vertices[offset + 0u] = a.position.x;
  vertices[offset + 1u] = a.position.y;
  vertices[offset + 2u] = a.position.z;
  vertices[offset + 3u] = a.normal.x;
  vertices[offset + 4u] = a.normal.y;
  vertices[offset + 5u] = a.normal.z;
  vertices[offset + 6u] = v1.position.x;
  vertices[offset + 7u] = v1.position.y;
  vertices[offset + 8u] = v1.position.z;
  vertices[offset + 9u] = v1.normal.x;
  vertices[offset + 10u] = v1.normal.y;
  vertices[offset + 11u] = v1.normal.z;
  vertices[offset + 12u] = v2.position.x;
  vertices[offset + 13u] = v2.position.y;
  vertices[offset + 14u] = v2.position.z;
  vertices[offset + 15u] = v2.normal.x;
  vertices[offset + 16u] = v2.normal.y;
  vertices[offset + 17u] = v2.normal.z;
}

@compute @workgroup_size(64)
fn main(@builtin(global_invocation_id) id: vec3<u32>) {
  let nx = params.dims.x;
  let ny = params.dims.y;
  let nz = params.dims.z;
  if (id.x >= nx - 1u || id.y >= ny - 1u || id.z >= nz - 1u) {
    return;
  }

  var cornerPositions: array<vec3<f32>, 8>;
  var cornerValues: array<f32, 8>;
  var cornerIndices: array<vec3<u32>, 8>;
  for (var c = 0u; c < 8u; c = c + 1u) {
    let offset = CORNERS[c];
    let index = vec3<u32>(id.x + offset.x, id.y + offset.y, id.z + offset.z);
    cornerIndices[c] = index;
    cornerPositions[c] = positionAt(f32(index.x), f32(index.y), f32(index.z));
    cornerValues[c] = valueAt(index.x, index.y, index.z);
  }

  let iso = params.iso.x;
  for (var t = 0u; t < 6u; t = t + 1u) {
    let tet = TETS[t];
    var tetIndices = array<u32, 4>(tet.x, tet.y, tet.z, tet.w);
    var intersections: array<Vertex, 4>;
    var intersectionCount = 0u;

    for (var e = 0u; e < 6u; e = e + 1u) {
      let edge = EDGES[e];
      let localA = edge.x;
      let localB = edge.y;
      let globalA = tetIndices[localA];
      let globalB = tetIndices[localB];
      let valueA = cornerValues[globalA];
      let valueB = cornerValues[globalB];
      let insideA = valueA >= iso;
      let insideB = valueB >= iso;
      if (insideA == insideB) {
        continue;
      }
      if (intersectionCount < 4u) {
        intersections[intersectionCount] = interpolateVertex(
          cornerPositions[globalA],
          cornerPositions[globalB],
          valueA,
          valueB,
          cornerIndices[globalA],
          cornerIndices[globalB],
        );
        intersectionCount = intersectionCount + 1u;
      }
    }

    if (intersectionCount == 3u) {
      emitTriangle(intersections[0], intersections[1], intersections[2]);
    } else if (intersectionCount == 4u) {
      emitTriangle(intersections[0], intersections[1], intersections[2]);
      emitTriangle(intersections[0], intersections[2], intersections[3]);
    }
  }
}
