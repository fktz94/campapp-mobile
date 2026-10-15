import type { Bloque } from '../types/visualizador'
import { parseFechaToNum } from './date'
import { isSameText } from './text'

const SEMILLAS_POR_BOLSA = {
  MAIZ: 80000,
  GIRASOL: 180000,
} as const

function getSemillasPorBolsa(producto: string): number | null {
  const norm = producto.toLowerCase()
  if (norm.includes('maiz') || norm.includes('maíz')) return SEMILLAS_POR_BOLSA.MAIZ
  if (norm.includes('girasol')) return SEMILLAS_POR_BOLSA.GIRASOL
  return null
}

export function groupLaboresIntoBloques(
  laboresRows: string[][],
  campania?: string,
  establecimiento?: string,
  lote?: string
): Bloque[] {
  const filtered = laboresRows.slice(1).filter((row) => {
    if (campania && (row[1] || '').trim() !== campania) return false
    if (establecimiento && (row[2] || '').trim() !== establecimiento) return false
    if (lote && (row[3] || '').trim() !== lote) return false
    return true
  })

  const bloquesMap: Record<string, Bloque> = {}
  const order: string[] = []

  filtered.forEach((row) => {
    const fecha = row[5] || ''
    const labor = row[6] || ''
    const producto = row[7] || ''
    const categoria = row[8] || ''
    const dosis = row[9] || ''
    const unidad = row[10] || ''
    const sup = row[11] || ''
    const proveedor = row[13] || ''
    const responsable = row[14] || ''
    const estado = row[15] || ''
    const fechaReal = row[16] || ''
    const observaciones = row[18] || ''

    const key = `${fecha}||${labor}`
    if (!bloquesMap[key]) {
      bloquesMap[key] = {
        fecha,
        fechaReal: fechaReal || '',
        labor,
        proveedores: proveedor ? [proveedor] : [],
        provServicio: '',
        responsable,
        estado,
        productos: [],
        tieneServicio: false,
        observaciones: '',
      }
      order.push(key)
    }
    const block = bloquesMap[key]

    if (isSameText(producto, 'Servicio')) {
      block.tieneServicio = true
      if (proveedor && !block.provServicio) block.provServicio = proveedor
      if (observaciones && !block.observaciones) block.observaciones = observaciones
      return
    }

    if (producto) {
      let calculoBolsas = null
      if (
        isSameText(labor, 'Siembra') &&
        (unidad.toLowerCase().includes('semilla') || unidad.toLowerCase().includes('ha'))
      ) {
        const densidad = parseFloat(dosis.toString().replace(',', '.')) || 0
        const semillasPorBolsa = getSemillasPorBolsa(producto)
        const superficieHa = parseFloat(sup.toString().replace(',', '.')) || 0

        if (semillasPorBolsa && densidad > 0) {
          const bolsasPorHa = densidad / semillasPorBolsa
          const bolsasTotales = superficieHa > 0 ? bolsasPorHa * superficieHa : null

          calculoBolsas = {
            bolsasPorHa: Number(bolsasPorHa.toFixed(2)),
            bolsasTotales: bolsasTotales ? Math.round(bolsasTotales) : null,
          }
        }
      }

      block.productos.push({
        producto,
        categoria,
        dosis,
        unidad,
        superficie: sup,
        ...(calculoBolsas ? { calculoBolsas } : {}),
      })
    }

    if (proveedor && !block.proveedores.includes(proveedor)) {
      block.proveedores.push(proveedor)
    }
    if (observaciones && !block.observaciones) block.observaciones = observaciones
  })

  return order
    .map((k) => bloquesMap[k])
    .sort((a, b) => parseFechaToNum(b.fecha) - parseFechaToNum(a.fecha))
}

export function computeCosechaTotals(
  cosechaRows: string[][],
  campania: string,
  establecimiento?: string,
  lote?: string
): { cosechaKg: number; rendimientoKgHa: number | null } {
  const filtered = cosechaRows.slice(1).filter((row) => {
    if ((row[0] || '').trim() !== campania) return false
    if (establecimiento && (row[1] || '').trim() !== establecimiento) return false
    if (lote && (row[4] || '').trim() !== lote) return false
    return true
  })
  let totalKg = 0
  filtered.forEach((row) => {
    const kg = parseFloat((row[7] || '0').toString().replace(',', '.')) || 0
    totalKg += kg
  })
  return { cosechaKg: totalKg, rendimientoKgHa: null }
}
