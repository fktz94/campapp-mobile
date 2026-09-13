import { col } from '@/lib/helpers/sheetsUtils'
import { request } from '@/lib/sheetsApi'
import type { ListasData, Rotacion } from '@/lib/types/sheets'

type BatchGetResponse = {
  valueRanges: { range: string; values?: string[][] }[]
}

const CATALOGOS_RANGES = ['Listas!A:K', 'Cultivos!A:A', 'Rotaciones!A:Z'] as const
const OPERATIVO_RANGES = ['Labores Consolidado!A:Q', 'Cosecha!A:K'] as const

async function batchGet(ranges: readonly string[]): Promise<string[][][]> {
  const query = ranges.map((r) => `ranges=${encodeURIComponent(r)}`).join('&')
  const res = await request<BatchGetResponse>(`/values:batchGet?${query}`)
  return ranges.map((_, i) => res.valueRanges[i]?.values ?? [])
}

export type CatalogosRaw = {
  listas: string[][]
  cultivos: string[][]
  rotaciones: string[][]
}

export type OperativoRaw = {
  labores: string[][]
  cosecha: string[][]
}

export async function fetchCatalogosRaw(): Promise<CatalogosRaw> {
  const [listas, cultivos, rotaciones] = await batchGet(CATALOGOS_RANGES)
  return { listas, cultivos, rotaciones }
}

export async function fetchOperativoRaw(): Promise<OperativoRaw> {
  const [labores, cosecha] = await batchGet(OPERATIVO_RANGES)
  return { labores, cosecha }
}

export function parseListas(rows: string[][]): ListasData {
  return {
    campanias: col(rows, 1),
    labores: col(rows, 3),
    cultivos: col(rows, 5),
    proveedores: col(rows, 6),
    responsables: col(rows, 7),
    labranzas: col(rows, 8),
  }
}

export function parseRotaciones(rows: string[][]): Rotacion[] {
  if (rows.length < 2) return []

  const header = rows[0] ?? []
  const campCols: { idx: number; camp: string }[] = []
  for (let i = 4; i < header.length; i++) {
    const camp = (header[i] ?? '').toString().trim()
    if (camp) campCols.push({ idx: i, camp })
  }

  const result: Rotacion[] = []
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i] ?? []
    const establecimiento = (row[0] ?? '').toString().trim()
    const lote = (row[1] ?? '').toString().trim()
    if (!establecimiento || !lote) continue

    const hasRaw = (row[2] ?? '').toString().trim().replace(',', '.')
    const hasNum = Number(hasRaw)
    const empresa = (row[3] ?? '').toString().trim()

    const campañas: Record<string, string> = {}
    for (const { idx, camp } of campCols) {
      const val = (row[idx] ?? '').toString().trim()
      if (val) campañas[camp] = val
    }

    result.push({
      establecimiento,
      lote,
      has: Number.isFinite(hasNum) ? hasNum : 0,
      empresa,
      campañas,
    })
  }
  return result
}

export function parseCultivosRotacion(rows: string[][]): string[] {
  const seen = new Map<string, string>()
  for (let i = 1; i < rows.length; i++) {
    const raw = (rows[i]?.[0] ?? '').toString().trim()
    if (!raw) continue
    const key = raw.toLowerCase()
    if (!seen.has(key)) seen.set(key, raw)
  }
  return [...seen.values()]
}
