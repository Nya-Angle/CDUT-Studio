import { describe, expect, test } from 'bun:test'
import { readFileSync } from 'node:fs'
import { parseCif } from './cslab-cif'
import { buildCrystalStructure, expandAtoms } from './cslab-symmetry'
import { buildPolyhedra } from './cslab-polyhedra'

const RUTILE_PATH = new URL('../../../../demo-data/cdut-science-rutile/rutile-tio2.cif', import.meta.url)

describe('配位多面体', () => {
  test('Given 金红石结构 When Ti-O 近邻搜索 Then 每个 Ti 配位数为 6', () => {
    const document = parseCif(readFileSync(RUTILE_PATH, 'utf8'))
    const structure = buildCrystalStructure({
      format: 'cif',
      cell: document.cell,
      spaceGroupHm: document.spaceGroupHm,
      spaceGroupNumber: document.spaceGroupNumber,
      symmetryOperations: document.symmetryOperations,
      atoms: document.atoms,
      warnings: document.warnings,
    })
    const atoms = expandAtoms(structure)
    const polyhedra = buildPolyhedra(atoms, structure.cell, {
      centerElement: 'Ti',
      neighborElements: ['O'],
      cutoff: 2.2,
    })
    expect(polyhedra.length).toBeGreaterThanOrEqual(2)
    for (const polyhedron of polyhedra.slice(0, 2)) {
      expect(polyhedron.coordinationNumber).toBe(6)
      expect(polyhedron.volume).toBeGreaterThan(0)
      expect(polyhedron.faces.length).toBeGreaterThanOrEqual(6)
      expect(polyhedron.meanBondLength).toBeGreaterThan(1.7)
      expect(polyhedron.meanBondLength).toBeLessThan(2.2)
    }
  })
})
