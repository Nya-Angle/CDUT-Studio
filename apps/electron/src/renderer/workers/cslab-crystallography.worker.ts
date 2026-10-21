/**
 * CSLab 晶体学 Worker
 *
 * 只依赖 @profer/shared 纯函数，不触碰 DOM / Electron。
 */

import type {
  CsLabCrystalAtom,
  CsLabIsoMesh,
  CsLabPolyhedron,
} from '@profer/shared'
import {
  analyzeCrystalText,
  buildPolyhedra,
  buildStructureFromText,
  downsampleGrid,
  expandAtoms,
  extractIsosurfaceCpu,
  simulatePxrd,
} from '@profer/shared'
import type {
  CsLabCrystallographyRequest,
  CsLabWorkerResponse,
} from '../lib/cslab/cslab-worker-protocol'

interface WorkerScope {
  onmessage: ((event: MessageEvent<CsLabCrystallographyRequest>) => void) | null
  postMessage(message: unknown, transfer?: Transferable[]): void
}

const scope = self as unknown as WorkerScope

function expandSupercell(atoms: CsLabCrystalAtom[], na: number, nb: number, nc: number): CsLabCrystalAtom[] {
  const a = Math.max(1, Math.min(4, Math.round(na)))
  const b = Math.max(1, Math.min(4, Math.round(nb)))
  const c = Math.max(1, Math.min(4, Math.round(nc)))
  if (a === 1 && b === 1 && c === 1) return atoms
  const result: CsLabCrystalAtom[] = []
  for (let ia = 0; ia < a; ia += 1) {
    for (let ib = 0; ib < b; ib += 1) {
      for (let ic = 0; ic < c; ic += 1) {
        for (const atom of atoms) {
          result.push({
            ...atom,
            label: `${atom.label}_${ia}${ib}${ic}`,
            fractional: [
              atom.fractional[0] + ia,
              atom.fractional[1] + ib,
              atom.fractional[2] + ic,
            ],
          })
        }
      }
    }
  }
  return result
}

scope.onmessage = (event) => {
  const request = event.data
  const respond = (response: CsLabWorkerResponse, transfer?: Transferable[]): void => {
    scope.postMessage(response, transfer)
  }

  try {
    switch (request.kind) {
      case 'analyze': {
        respond({
          id: request.id,
          ok: true,
          result: analyzeCrystalText(request.text, request.format, request.tolerance),
        })
        return
      }
      case 'pxrd': {
        const structure = buildStructureFromText(request.text, request.format)
        respond({ id: request.id, ok: true, result: simulatePxrd(structure, request.options) })
        return
      }
      case 'supercell': {
        const structure = buildStructureFromText(request.text, request.format)
        const atoms = expandSupercell(expandAtoms(structure), request.na, request.nb, request.nc)
        respond({ id: request.id, ok: true, result: atoms })
        return
      }
      case 'polyhedra': {
        const structure = buildStructureFromText(request.text, request.format)
        const atoms = expandAtoms(structure)
        const polyhedra: CsLabPolyhedron[] = buildPolyhedra(atoms, structure.cell, {
          centerElement: request.centerElement,
          neighborElements: request.neighborElements,
          cutoff: request.cutoff,
        })
        respond({ id: request.id, ok: true, result: polyhedra })
        return
      }
      case 'isosurface': {
        const grid = downsampleGrid(request.grid, 256).grid
        const mesh: CsLabIsoMesh = extractIsosurfaceCpu(
          grid,
          request.isovalue,
          request.isovalue >= 0 ? 'positive' : 'negative',
        )
        respond({ id: request.id, ok: true, result: mesh }, [
          mesh.positions.buffer as ArrayBuffer,
          mesh.normals.buffer as ArrayBuffer,
          mesh.indices.buffer as ArrayBuffer,
        ])
        return
      }
    }
  } catch (error) {
    respond({
      id: request.id,
      ok: false,
      error: error instanceof Error ? error.message : String(error),
    })
  }
}
