/**
 * sheetsService.ts
 * Reads and writes directly to Google Sheets using sheetsApi.
 * Replaces the old Apps Script api.ts.
 */

import type { DatosIniciales, OrdenPayload } from './schemas'
import { sheetsApi } from './sheetsApi'

type SheetResponse = { values?: string[][] }

function col(rows: string[][], colIndex: number): string[] {
  return [
    ...new Set(
      rows
        .slice(1)
        .map((r) => r[colIndex] ?? '')
        .filter(Boolean)
    ),
  ]
}

// ── READ ──────────────────────────────────────────────────────────────────────

export async function getDatosIniciales(): Promise<DatosIniciales> {
  const [listas, insumos, lotes] = await Promise.all([
    sheetsApi.get<SheetResponse>('Listas!A:K'),
    sheetsApi.get<SheetResponse>('Insumos!A:I'),
    sheetsApi.get<SheetResponse>('Lotes!A:C'),
  ])

  const listasRows = listas.values ?? []
  const insumosRows = insumos.values ?? []
  const lotesRows = lotes.values ?? []

  // Listas columns (0-indexed):
  // A=Establecimiento, B=Campaña, C=Tipo, D=Labor, E=Labor(subtipo),
  // F=Cultivos, G=Proveedores, H=Responsables, I=Labranza mecánica
  const establecimientos = col(listasRows, 0)
  const campanias = col(listasRows, 1)
  const labores = col(listasRows, 3)
  const cultivos = col(listasRows, 5)
  const proveedores = col(listasRows, 6)
  const responsables = col(listasRows, 7)
  const labranzas = col(listasRows, 8)

  // Insumos columns:
  // A=Insumo, B=Unidad, C=Categoria, D=empty, E=Variedad, F=UnidadVar, G=empty, H=Fertilizante, I=UnidadFert
  const insumosData = insumosRows.slice(1).filter((r) => r[0])
  const insumosAgro = [...new Set(insumosData.map((r) => r[0]).filter(Boolean))]
  const variedades = [...new Set(insumosData.map((r) => r[4] ?? '').filter(Boolean))]
  const fertilizantes = [...new Set(insumosData.map((r) => r[7] ?? '').filter(Boolean))]

  const unidades: Record<string, string> = {}
  const unidadesVar: Record<string, string> = {}
  const unidadesFert: Record<string, string> = {}
  const categorias: Record<string, string> = {}

  insumosData.forEach((r) => {
    if (r[0]) {
      unidades[r[0]] = r[1] ?? ''
      categorias[r[0]] = r[2] ?? ''
    }
    if (r[4]) unidadesVar[r[4]] = r[5] ?? ''
    if (r[7]) unidadesFert[r[7]] = r[8] ?? ''
  })

  // Lotes columns: A=Establecimiento, B=Lote, C=Superficie
  const datosLotes: [string, string, number][] = lotesRows
    .slice(1)
    .filter((r) => r[0] && r[1])
    .map((r) => [r[0], r[1], parseFloat(r[2]) || 0])

  return {
    ok: true,
    campanias,
    establecimientos,
    datosLotes,
    labores,
    cultivos,
    cultivosRotacion: cultivos,
    insumosAgro,
    variedades,
    fertilizantes,
    unidades,
    unidadesVar,
    unidadesFert,
    categorias,
    proveedores,
    responsables,
    labranzas,
  }
}

// ── WRITE ─────────────────────────────────────────────────────────────────────

export async function guardarOrden(orden: OrdenPayload): Promise<void> {
  const rows: string[][] = []

  orden.lotes.forEach((lote) => {
    const sup = String(lote.superficie)

    lote.productos.forEach((prod) => {
      const dosis = String(prod.dosis)
      const dosisNum = parseFloat(dosis) || 0
      const supNum = parseFloat(sup) || 0
      const total = dosisNum > 0 && supNum > 0 ? String(dosisNum * supNum) : ''

      rows.push([
        '', // A: Nº OT (left empty, Apps Script used to fill this)
        orden.campania, // B: Campaña
        lote.establecimiento, // C: Establecimiento
        lote.lote, // D: Lote
        lote.cultivo, // E: Cultivo
        orden.fecha, // F: Fecha
        orden.labor, // G: Labor
        prod.producto, // H: Producto
        '', // I: Categoría (could fill from categorias map)
        dosis, // J: Dosis (ha)
        prod.unidad, // K: Unidad
        sup, // L: Superficie (ha)
        total, // M: Total producto
        orden.proveedor ?? '', // N: Proveedor
        orden.responsable, // O: Responsable
        'Sin revisar', // P: Estado
      ])
    })
  })

  await sheetsApi.append('Labores Consolidado!A:P', rows)
}
