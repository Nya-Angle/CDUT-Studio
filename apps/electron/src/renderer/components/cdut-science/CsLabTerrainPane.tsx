/**
 * CsLabTerrainPane — 2.5D DEM 地貌视窗
 *
 * 数据诚实红线：只表达地表高程与 D8 汇流，不虚构地下断层体。
 * GPU 红线：卸载必须 forceContextLoss + 移除 canvas，避免与 Mol* 争抢上下文。
 */

import * as React from 'react'
import * as THREE from 'three'
import { Pause, Play, RotateCcw } from 'lucide-react'
import type { CsLabGeoRasterPayload } from '@profer/shared'
import { useIsDarkTheme } from '@/hooks/use-is-dark-theme'

interface CsLabTerrainPaneProps {
  payload: CsLabGeoRasterPayload
  onToast: (kind: 'info' | 'success' | 'error', text: string) => void
}

const TARGET_SIZE = 24

function hypsometricColor(value: number): THREE.Color {
  const stops = [
    { t: 0, color: new THREE.Color('#254b5c') },
    { t: 0.35, color: new THREE.Color('#4f7a45') },
    { t: 0.68, color: new THREE.Color('#b08a54') },
    { t: 1, color: new THREE.Color('#f0e9d8') },
  ]
  const clamped = Math.max(0, Math.min(1, value))
  for (let index = 1; index < stops.length; index += 1) {
    const left = stops[index - 1]!
    const right = stops[index]!
    if (clamped <= right.t) {
      const ratio = (clamped - left.t) / Math.max(1e-6, right.t - left.t)
      return left.color.clone().lerp(right.color, ratio)
    }
  }
  return stops[stops.length - 1]!.color.clone()
}

export function CsLabTerrainPane({
  payload,
  onToast,
}: CsLabTerrainPaneProps): React.ReactElement {
  const containerRef = React.useRef<HTMLDivElement | null>(null)
  const toastRef = React.useRef(onToast)
  toastRef.current = onToast
  const isDark = useIsDarkTheme()
  const isDarkRef = React.useRef(isDark)
  isDarkRef.current = isDark
  const rendererRef = React.useRef<THREE.WebGLRenderer | null>(null)
  const frameRef = React.useRef<number | null>(null)
  const sceneRef = React.useRef<{
    scene: THREE.Scene
    camera: THREE.PerspectiveCamera
    group: THREE.Group
    material: THREE.ShaderMaterial
    points: THREE.Points
    pointPositions: Float32Array
    channelIndices: number[]
    clock: THREE.Clock
    azimuth: number
    elevation: number
    distance: number
    playing: boolean
  } | null>(null)
  const [playing, setPlaying] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const width = Math.max(1, container.clientWidth)
    const height = Math.max(1, container.clientHeight)

    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false })
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : 'WebGL 初始化失败'
      setError(`${message}，2.5D 地貌视窗不可用`)
      toastRef.current('error', 'WebGL 不可用，2.5D 地貌视窗已降级')
      return
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    renderer.setSize(width, height)
    container.appendChild(renderer.domElement)
    rendererRef.current = renderer

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(isDarkRef.current ? '#171614' : '#f3efe6')
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 200)
    const group = new THREE.Group()
    scene.add(group)

    const sampledWidth = payload.sampledWidth
    const sampledHeight = payload.sampledHeight
    const aspect = sampledHeight / Math.max(1, sampledWidth)
    const sizeX = TARGET_SIZE
    const sizeZ = Math.max(8, TARGET_SIZE * aspect)
    const minHeight = payload.meta.min
    const maxHeight = payload.meta.max
    const span = Math.max(1e-6, maxHeight - minHeight)
    const heightScale = 6

    const geometry = new THREE.PlaneGeometry(
      sizeX,
      sizeZ,
      Math.max(1, sampledWidth - 1),
      Math.max(1, sampledHeight - 1),
    )
    const position = geometry.attributes.position as THREE.BufferAttribute
    const colors = new Float32Array(position.count * 3)
    for (let index = 0; index < position.count; index += 1) {
      const height = payload.heights[index]
      const normalized = Number.isFinite(height) ? (height! - minHeight) / span : 0
      position.setZ(index, normalized * heightScale)
      const color = hypsometricColor(normalized)
      colors[index * 3] = color.r
      colors[index * 3 + 1] = color.g
      colors[index * 3 + 2] = color.b
    }
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    geometry.computeVertexNormals()

    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uScan: { value: 0 },
        uLight: { value: new THREE.Vector3(-0.55, 0.7, 0.45).normalize() },
      },
      vertexShader: `
        attribute vec3 color;
        varying vec3 vColor;
        varying vec3 vNormal;
        varying float vHeight;
        void main() {
          vColor = color;
          vNormal = normalize(normalMatrix * normal);
          vHeight = position.z;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform float uScan;
        uniform vec3 uLight;
        varying vec3 vColor;
        varying vec3 vNormal;
        varying float vHeight;
        void main() {
          float lighting = max(0.35, dot(normalize(vNormal), normalize(uLight)));
          vec3 base = vColor * (0.55 + lighting * 0.65);
          float band = abs(fract(vHeight * 0.38 - uTime * 0.012) - 0.5);
          float contour = 1.0 - smoothstep(0.015, 0.045, band);
          base = mix(base, vec3(0.92, 0.98, 1.0), contour * 0.45);
          float scan = 1.0 - smoothstep(0.0, 0.035, abs(vHeight - uScan));
          base = mix(base, vec3(1.0, 0.82, 0.42), scan * 0.8);
          gl_FragColor = vec4(base, 1.0);
        }
      `,
      side: THREE.DoubleSide,
    })
    const mesh = new THREE.Mesh(geometry, material)
    mesh.rotation.x = -Math.PI / 2
    group.add(mesh)

    const channelIndices: number[] = []
    for (let index = 0; index < payload.flowAccumulation.length; index += 1) {
      if (!Number.isFinite(payload.heights[index])) continue
      if (payload.flowAccumulation[index]! <= payload.channelThreshold) continue
      channelIndices.push(index)
    }
    channelIndices.sort((left, right) => payload.heights[right]! - payload.heights[left]!)
    const pointCount = Math.min(4200, Math.max(64, channelIndices.length))
    const pointPositions = new Float32Array(pointCount * 3)
    const pointGeometry = new THREE.BufferGeometry()
    pointGeometry.setAttribute('position', new THREE.BufferAttribute(pointPositions, 3))
    const points = new THREE.Points(
      pointGeometry,
      new THREE.PointsMaterial({ color: '#d98a2b', size: 0.075, transparent: true, opacity: 0.9 }),
    )
    group.add(points)

    const state = {
      scene,
      camera,
      group,
      material,
      points,
      pointPositions,
      channelIndices,
      clock: new THREE.Clock(),
      azimuth: Math.PI * 0.25,
      elevation: 0.72,
      distance: 34,
      playing: true,
    }
    sceneRef.current = state

    const updateCamera = (): void => {
      const cos = Math.cos(state.elevation)
      camera.position.set(
        state.distance * cos * Math.sin(state.azimuth),
        state.distance * Math.sin(state.elevation),
        state.distance * cos * Math.cos(state.azimuth),
      )
      camera.lookAt(0, 1.5, 0)
    }
    updateCamera()

    const grid = new THREE.GridHelper(TARGET_SIZE, 12, '#cfc7b8', '#ded7ca')
    grid.position.y = -0.01
    group.add(grid)

    const pointToPosition = (index: number): [number, number, number] => {
      const row = Math.floor(index / sampledWidth)
      const col = index % sampledWidth
      const x = (col / Math.max(1, sampledWidth - 1) - 0.5) * sizeX
      // 网格经过 -90° 旋转后，局部 y 轴映射到世界 -z 轴。
      const z = -(row / Math.max(1, sampledHeight - 1) - 0.5) * sizeZ
      const y = ((payload.heights[index]! - minHeight) / span) * heightScale
      return [x, y + 0.06, z]
    }

    let pointer: { x: number; y: number; azimuth: number; elevation: number } | null = null
    const onPointerDown = (event: PointerEvent): void => {
      pointer = {
        x: event.clientX,
        y: event.clientY,
        azimuth: state.azimuth,
        elevation: state.elevation,
      }
      container.setPointerCapture?.(event.pointerId)
    }
    const onPointerMove = (event: PointerEvent): void => {
      if (!pointer) return
      state.azimuth = pointer.azimuth - (event.clientX - pointer.x) * 0.006
      state.elevation = Math.max(0.18, Math.min(1.25, pointer.elevation + (event.clientY - pointer.y) * 0.004))
      updateCamera()
    }
    const onPointerUp = (): void => {
      pointer = null
    }
    const onWheel = (event: WheelEvent): void => {
      event.preventDefault()
      state.distance = Math.max(14, Math.min(70, state.distance + Math.sign(event.deltaY) * 1.6))
      updateCamera()
    }
    const onContextLost = (event: Event): void => {
      event.preventDefault()
      setError('3D 地貌视窗已降级：WebGL 上下文丢失')
    }
    container.addEventListener('pointerdown', onPointerDown)
    container.addEventListener('pointermove', onPointerMove)
    container.addEventListener('pointerup', onPointerUp)
    container.addEventListener('pointercancel', onPointerUp)
    container.addEventListener('wheel', onWheel, { passive: false })
    renderer.domElement.addEventListener('webglcontextlost', onContextLost)

    const resizeObserver = new ResizeObserver(() => {
      const nextWidth = Math.max(1, container.clientWidth)
      const nextHeight = Math.max(1, container.clientHeight)
      renderer.setSize(nextWidth, nextHeight)
      camera.aspect = nextWidth / nextHeight
      camera.updateProjectionMatrix()
    })
    resizeObserver.observe(container)

    const render = (): void => {
      const elapsed = state.clock.getElapsedTime()
      material.uniforms.uTime!.value = elapsed
      material.uniforms.uScan!.value = ((elapsed * 0.35) % 1) * heightScale
      if (state.playing) group.rotation.y += 0.0016
      if (channelIndices.length > 0) {
        for (let index = 0; index < pointCount; index += 1) {
          const cursor = Math.floor(elapsed * 6 + index * 3) % channelIndices.length
          const cell = channelIndices[cursor]!
          const [x, y, z] = pointToPosition(cell)
          pointPositions[index * 3] = x
          pointPositions[index * 3 + 1] = y + Math.sin(elapsed * 2 + index) * 0.05
          pointPositions[index * 3 + 2] = z
        }
        pointGeometry.attributes.position!.needsUpdate = true
      }
      renderer.render(scene, camera)
      frameRef.current = requestAnimationFrame(render)
    }
    frameRef.current = requestAnimationFrame(render)

    return () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current)
      frameRef.current = null
      resizeObserver.disconnect()
      container.removeEventListener('pointerdown', onPointerDown)
      container.removeEventListener('pointermove', onPointerMove)
      container.removeEventListener('pointerup', onPointerUp)
      container.removeEventListener('pointercancel', onPointerUp)
      container.removeEventListener('wheel', onWheel)
      renderer.domElement.removeEventListener('webglcontextlost', onContextLost)
      geometry.dispose()
      material.dispose()
      pointGeometry.dispose()
      ;(points.material as THREE.Material).dispose()
      renderer.dispose()
      renderer.forceContextLoss()
      if (renderer.domElement.parentElement === container) {
        container.removeChild(renderer.domElement)
      }
      sceneRef.current = null
      rendererRef.current = null
    }
  }, [payload])

  // ===== 主题切换：仅更新背景色，不重建 Three.js 场景 =====
  // 早期方案若将 isDark 放入上方 mount effect 依赖，会触发 geometry/material
  // dispose 与 WebGL 上下文重建，丢失环绕动画与视角。这里单独走轻量路径。
  React.useEffect(() => {
    const state = sceneRef.current
    if (!state) return
    state.scene.background = new THREE.Color(isDark ? '#171614' : '#f3efe6')
  }, [isDark])

  React.useEffect(() => {
    if (sceneRef.current) sceneRef.current.playing = playing
  }, [playing])

  const resetView = (): void => {
    const state = sceneRef.current
    if (!state) return
    state.azimuth = Math.PI * 0.25
    state.elevation = 0.72
    state.distance = 34
    state.group.rotation.y = 0
    const cos = Math.cos(state.elevation)
    state.camera.position.set(
      state.distance * cos * Math.sin(state.azimuth),
      state.distance * Math.sin(state.elevation),
      state.distance * cos * Math.cos(state.azimuth),
    )
    state.camera.lookAt(0, 1.5, 0)
  }

  return (
    <div
      data-tour="cslab-terrain"
      className="relative h-full min-h-0 w-full overflow-hidden bg-cslab-bg"
    >
      <div ref={containerRef} className="h-full w-full" />
      <div className="pointer-events-none absolute left-3 top-2.5 rounded-lg border border-cslab-border bg-cslab-elevated/85 px-2.5 py-1.5 text-[10px] leading-relaxed text-cslab-muted shadow-subtle backdrop-blur-sm">
        <p className="font-medium text-cslab-text">{payload.title}</p>
        <p className="tabular-nums">
          {payload.sampledWidth}×{payload.sampledHeight} · {payload.meta.cellsize} m · DEMO 2.5D 地表
        </p>
      </div>
      <div className="absolute right-2.5 top-2.5 flex items-center gap-1">
        <button
          type="button"
          onClick={() => setPlaying((value) => !value)}
          className="rounded-md border border-cslab-border bg-cslab-elevated/85 p-1.5 text-cslab-muted backdrop-blur-sm transition-colors hover:text-cslab-text"
          title={playing ? '暂停环绕' : '播放环绕'}
          aria-label={playing ? '暂停环绕' : '播放环绕'}
        >
          {playing ? <Pause size={12} /> : <Play size={12} />}
        </button>
        <button
          type="button"
          onClick={resetView}
          className="rounded-md border border-cslab-border bg-cslab-elevated/85 p-1.5 text-cslab-muted backdrop-blur-sm transition-colors hover:text-cslab-text"
          title="重置视角"
          aria-label="重置视角"
        >
          <RotateCcw size={12} />
        </button>
      </div>
      {error && (
        <div className="absolute inset-x-4 bottom-4 rounded-lg border border-amber-300 bg-amber-50/95 px-3 py-2 text-[11px] leading-relaxed text-amber-800">
          {error}
        </div>
      )}
      <p className="pointer-events-none absolute bottom-2 right-3 text-[9px] tracking-wide text-cslab-muted/60">
        地表 DEM · 不含地下三维断层
      </p>
    </div>
  )
}
