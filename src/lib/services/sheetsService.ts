import { parseFechaToNum } from '@/lib/helpers/date'
import { computeCosechaTotals, groupLaboresIntoBloques } from '@/lib/helpers/laboresHelpers'
import { col } from '@/lib/helpers/sheetsUtils'
import { sheetsApi } from '@/lib/sheetsApi'
import { ListasData, Rotacion, SheetResponse } from '@/lib/types/sheets'

// ─── FETCHERS ──────────────────────────────────────────────

export async function fetchListas(): Promise<ListasData> {
  const res = await sheetsApi.get<SheetResponse>('Listas!A:K')
  const rows = res.values ?? []
  return {
    campanias: col(rows, 1),
    labores: col(rows, 3),
    cultivos: col(rows, 5),
    proveedores: col(rows, 6),
    responsables: col(rows, 7),
    labranzas: col(rows, 8),
  }
}

export async function fetchRotaciones(): Promise<Rotacion[]> {
  const res = await sheetsApi.get<SheetResponse>('Rotaciones!A:Z')
  const rows = res.values ?? []
  if (rows.length < 2) return []
  const header = rows[0]
  const campCols: { idx: number; camp: string }[] = []
  for (let i = 4; i < header.length; i++) {
    const camp = (header[i] || '').toString().trim()
    if (camp) campCols.push({ idx: i, camp })
  }
  return rows
    .slice(1)
    .map((row) => {
      const estab = (row[0] || '').toString().trim()
      const lote = (row[1] || '').toString().trim()
      const has = (row[2] || '').toString().trim()
      const empresa = (row[3] || '').toString().trim()
      if (!estab || !lote) return null
      const campañas: Record<string, string> = {}
      campCols.forEach(({ idx, camp }) => {
        const val = (row[idx] || '').toString().trim()
        if (val) campañas[camp] = val
      })
      return { establecimiento: estab, lote, has, empresa, campañas }
    })
    .filter(Boolean) as any[]
}

export async function fetchLaboresConsolidado() {
  const res = await sheetsApi.get<SheetResponse>('Labores Consolidado!A:Q')
  return res.values ?? []
}

export async function fetchCosecha() {
  const res = await sheetsApi.get<SheetResponse>('Cosecha!A:K')
  return res.values ?? []
}

// ─── VISUALIZER FUNCTIONS ──────────────────────────────────

export async function getDatosVisualizador(
  campania: string,
  establecimiento: string,
  lote: string
) {
  try {
    const [rotaciones, laboresRows, cosechaRows] = await Promise.all([
      fetchRotaciones(),
      fetchLaboresConsolidado(),
      fetchCosecha(),
    ])

    const rot = rotaciones.find((r) => r.establecimiento === establecimiento && r.lote === lote)
    const superficie = rot?.has || ''
    const cultivoRot = rot?.campañas?.[campania] || ''
    const campList = Object.keys(rot?.campañas || {})
    const campIndex = campList.indexOf(campania)
    let cultivoAntecesor = '',
      campañaAntecesor = ''
    if (campIndex > 0) {
      const antCamp = campList[campIndex - 1]
      campañaAntecesor = antCamp
      cultivoAntecesor = rot?.campañas?.[antCamp] || ''
    }

    const bloques = groupLaboresIntoBloques(laboresRows, campania, establecimiento, lote)

    const siembraBlock = bloques.find((b) => b.labor === 'Siembra')
    const fechaSiembra = siembraBlock?.fechaReal || null
    const fechaSiembraPlan = siembraBlock?.fecha || null

    const { cosechaKg } = computeCosechaTotals(cosechaRows, campania, establecimiento, lote)
    const supNum = parseFloat(superficie) || 0
    const rendimientoKgHa = supNum > 0 ? Math.round(cosechaKg / supNum) : null

    return {
      ok: true,
      superficie,
      cultivo: cultivoRot || '',
      cultivoAntecesor,
      campañaAntecesor,
      bloques,
      cantidadLabores: bloques.length,
      cosechaKg,
      rendimientoKgHa,
      fechaSiembra,
      fechaSiembraPlan,
    }
  } catch (e: any) {
    return { ok: false, error: e.message }
  }
}

export async function getDatosResumen(campania: string, establecimiento: string) {
  try {
    const [rotaciones, laboresRows, cosechaRows] = await Promise.all([
      fetchRotaciones(),
      fetchLaboresConsolidado(),
      fetchCosecha(),
    ])

    const rotMap: Record<string, any> = {}
    rotaciones
      .filter((r) => r.establecimiento === establecimiento)
      .forEach((r) => {
        rotMap[r.lote] = {
          lote: r.lote,
          cultivo: r.campañas?.[campania] || '',
          superficie: r.has || '',
          campañas: r.campañas || {},
        }
      })

    const lotesData: Record<string, any> = {}
    Object.keys(rotMap).forEach((lote) => {
      lotesData[lote] = {
        lote,
        cultivo: rotMap[lote].cultivo,
        superficie: rotMap[lote].superficie,
        bloqueMap: {} as Record<string, any>,
        fechaSiembra: null,
        fechaSiembraPlan: null,
        cultivoAntecesor: '',
        campañaAntecesor: '',
      }
    })

    const laboresData = laboresRows
      .slice(1)
      .filter(
        (row) => (row[1] || '').trim() === campania && (row[2] || '').trim() === establecimiento
      )
    laboresData.forEach((row) => {
      const lote = (row[3] || '').trim()
      if (!lote || !lotesData[lote]) return
      const fecha = row[5] || ''
      const labor = row[6] || ''
      const fechaReal = row[16] || ''
      if (labor && labor.toLowerCase() !== 'servicio') {
        const key = `${fecha}||${labor}`
        if (!lotesData[lote].bloqueMap[key]) {
          lotesData[lote].bloqueMap[key] = { fecha, labor, fechaReal: fechaReal || '' }
        } else if (fechaReal && !lotesData[lote].bloqueMap[key].fechaReal) {
          lotesData[lote].bloqueMap[key].fechaReal = fechaReal
        }
        if (labor === 'Siembra') {
          if (!lotesData[lote].fechaSiembraPlan) lotesData[lote].fechaSiembraPlan = fecha
          if (fechaReal && !lotesData[lote].fechaSiembra) lotesData[lote].fechaSiembra = fechaReal
        }
      }
    })

    const campList = Object.keys(rotMap[Object.keys(rotMap)[0]]?.campañas || {})
    const idx = campList.indexOf(campania)
    if (idx > 0) {
      const antCamp = campList[idx - 1]
      Object.keys(lotesData).forEach((lote) => {
        const antCult = rotMap[lote]?.campañas?.[antCamp] || ''
        lotesData[lote].cultivoAntecesor = antCult
        lotesData[lote].campañaAntecesor = antCamp
      })
    }

    const cosechaMap: Record<string, number> = {}
    const cosechaRowsFiltered = cosechaRows
      .slice(1)
      .filter(
        (row) => (row[0] || '').trim() === campania && (row[1] || '').trim() === establecimiento
      )
    cosechaRowsFiltered.forEach((row) => {
      const lote = (row[4] || '').trim()
      if (!lote || lote.toLowerCase() === 'total') return
      const kg = parseFloat((row[7] || '0').toString().replace(',', '.')) || 0
      if (kg > 0) cosechaMap[lote] = (cosechaMap[lote] || 0) + kg
    })

    const resultLotes = Object.values(lotesData).map((l) => {
      const sup = parseFloat(l.superficie) || 0
      const bloques = Object.values(l.bloqueMap).sort(
        (a: any, b: any) => parseFechaToNum(b.fecha) - parseFechaToNum(a.fecha)
      )
      const rendimientoKgHa =
        cosechaMap[l.lote] && sup > 0 ? Math.round(cosechaMap[l.lote] / sup) : null
      return {
        lote: l.lote,
        cultivo: l.cultivo,
        superficie: l.superficie,
        cantidadAplicaciones: bloques.length,
        ultimasLabores: bloques.slice(0, 3).map((b: any) => ({
          fecha: b.fecha,
          labor: b.labor,
          fechaReal: b.fechaReal || '',
        })),
        fechaSiembra: l.fechaSiembra,
        fechaSiembraPlan: l.fechaSiembraPlan,
        rendimientoKgHa,
        cultivoAntecesor: l.cultivoAntecesor,
        campañaAntecesor: l.campañaAntecesor,
      }
    })

    const cultivoMap: Record<string, { cultivo: string; lotes: number; hectareas: number }> = {}
    resultLotes.forEach((l) => {
      const c = l.cultivo || 'Sin especificar'
      if (!cultivoMap[c]) cultivoMap[c] = { cultivo: c, lotes: 0, hectareas: 0 }
      cultivoMap[c].lotes++
      cultivoMap[c].hectareas += parseFloat(l.superficie) || 0
    })

    return {
      ok: true,
      lotes: resultLotes,
      totalHa: resultLotes.reduce((sum, l) => sum + (parseFloat(l.superficie) || 0), 0),
      cultivoResumen: Object.values(cultivoMap),
    }
  } catch (e: any) {
    return { ok: false, error: e.message }
  }
}

export async function getDatosPorCultivo(campania: string, cultivo: string) {
  try {
    const [rotaciones, laboresRows, cosechaRows] = await Promise.all([
      fetchRotaciones(),
      fetchLaboresConsolidado(),
      fetchCosecha(),
    ])

    const rotMap: Record<string, any> = {}
    rotaciones.forEach((r) => {
      const key = r.establecimiento + '||' + r.lote
      rotMap[key] = {
        establecimiento: r.establecimiento,
        lote: r.lote,
        superficie: r.has || '',
        campañas: r.campañas || {},
      }
    })

    const loteKeys = Object.keys(rotMap).filter((key) => rotMap[key].campañas[campania] === cultivo)
    if (loteKeys.length === 0) {
      return { ok: true, lotes: [], totalHa: 0, establecimientos: 0 }
    }

    const establecimientosSet = new Set<string>()
    const lotesData: Record<string, any> = {}
    loteKeys.forEach((key) => {
      const parts = key.split('||')
      const est = parts[0]
      const lote = parts[1]
      const rot = rotMap[key]
      establecimientosSet.add(est)
      lotesData[key] = {
        establecimiento: est,
        lote,
        cultivo: rot.campañas[campania] || '',
        superficie: rot.superficie,
        bloqueMap: {},
        fechaSiembra: null,
        fechaSiembraPlan: null,
        cultivoAntecesor: '',
        campañaAntecesor: '',
      }
    })

    const laboresData = laboresRows.slice(1).filter((row) => (row[1] || '').trim() === campania)
    laboresData.forEach((row) => {
      const est = (row[2] || '').trim()
      const lote = (row[3] || '').trim()
      const key = est + '||' + lote
      if (!lotesData[key]) return
      const fecha = row[5] || ''
      const labor = row[6] || ''
      const fechaReal = row[16] || ''
      if (labor && labor.toLowerCase() !== 'servicio') {
        const bKey = `${fecha}||${labor}`
        if (!lotesData[key].bloqueMap[bKey]) {
          lotesData[key].bloqueMap[bKey] = { fecha, labor, fechaReal: fechaReal || '' }
        } else if (fechaReal && !lotesData[key].bloqueMap[bKey].fechaReal) {
          lotesData[key].bloqueMap[bKey].fechaReal = fechaReal
        }
        if (labor === 'Siembra') {
          if (!lotesData[key].fechaSiembraPlan) lotesData[key].fechaSiembraPlan = fecha
          if (fechaReal && !lotesData[key].fechaSiembra) lotesData[key].fechaSiembra = fechaReal
        }
      }
    })

    const campList = Object.keys(rotMap[Object.keys(rotMap)[0]]?.campañas || {})
    const idx = campList.indexOf(campania)
    if (idx > 0) {
      const antCamp = campList[idx - 1]
      Object.keys(lotesData).forEach((key) => {
        const antCult = rotMap[key]?.campañas?.[antCamp] || ''
        lotesData[key].cultivoAntecesor = antCult
        lotesData[key].campañaAntecesor = antCamp
      })
    }

    const cosechaMap: Record<string, number> = {}
    cosechaRows
      .slice(1)
      .filter((row) => (row[0] || '').trim() === campania)
      .forEach((row) => {
        const est = (row[1] || '').trim()
        const lote = (row[4] || '').trim()
        const key = est + '||' + lote
        if (!lotesData[key]) return
        const kg = parseFloat((row[7] || '0').toString().replace(',', '.')) || 0
        if (kg > 0) cosechaMap[key] = (cosechaMap[key] || 0) + kg
      })

    const resultLotes = Object.keys(lotesData).map((key) => {
      const l = lotesData[key]
      const sup = parseFloat(l.superficie) || 0
      const bloques = Object.values(l.bloqueMap).sort(
        (a: any, b: any) => parseFechaToNum(b.fecha) - parseFechaToNum(a.fecha)
      )
      const rendimientoKgHa = cosechaMap[key] && sup > 0 ? Math.round(cosechaMap[key] / sup) : null
      return {
        establecimiento: l.establecimiento,
        lote: l.lote,
        cultivo: l.cultivo,
        superficie: l.superficie,
        cantidadAplicaciones: bloques.length,
        ultimasLabores: bloques.slice(0, 3).map((b: any) => ({
          fecha: b.fecha,
          labor: b.labor,
          fechaReal: b.fechaReal || '',
        })),
        fechaSiembra: l.fechaSiembra,
        fechaSiembraPlan: l.fechaSiembraPlan,
        rendimientoKgHa,
        cultivoAntecesor: l.cultivoAntecesor,
        campañaAntecesor: l.campañaAntecesor,
      }
    })

    const totalHa = resultLotes.reduce((sum, l) => sum + (parseFloat(l.superficie) || 0), 0)

    return {
      ok: true,
      lotes: resultLotes,
      totalHa,
      establecimientos: establecimientosSet.size,
    }
  } catch (e: any) {
    return { ok: false, error: e.message }
  }
}

export async function getDatosCosecha(campania: string, establecimiento: string) {
  try {
    const [rotaciones, cosechaRows] = await Promise.all([fetchRotaciones(), fetchCosecha()])

    const supMap: Record<string, number> = {}
    rotaciones
      .filter((r) => r.establecimiento === establecimiento)
      .forEach((r) => {
        supMap[r.lote] = parseFloat(r.has) || 0
      })

    const loteMap: Record<
      string,
      {
        kgTotal: number
        cultivo: string
        superficie: number
        camiones: Set<string>
      }
    > = {}

    cosechaRows
      .slice(1)
      .filter(
        (row) => (row[0] || '').trim() === campania && (row[1] || '').trim() === establecimiento
      )
      .forEach((row) => {
        const lote = (row[4] || '').trim()
        if (!lote || lote.toLowerCase() === 'total') return
        const kg = parseFloat((row[7] || '0').toString().replace(',', '.')) || 0
        if (kg === 0) return
        if (!loteMap[lote]) {
          const sup = supMap[lote] || 0
          const cult = (row[2] || '').trim() || ''
          loteMap[lote] = { kgTotal: 0, cultivo: cult, superficie: sup, camiones: new Set() }
        }
        loteMap[lote].kgTotal += kg
        const patente = (row[5] || '').trim()
        if (patente && patente !== 'DIRECTO') loteMap[lote].camiones.add(patente)
      })

    const lotes = Object.keys(loteMap).map((lote) => {
      const data = loteMap[lote]
      const kgHa = data.superficie > 0 ? Math.round(data.kgTotal / data.superficie) : null
      return {
        lote,
        cultivo: data.cultivo || '',
        superficie: data.superficie,
        kgTotal: Math.round(data.kgTotal),
        kgHa,
        camiones: data.camiones.size,
      }
    })

    const totalKg = lotes.reduce((sum, l) => sum + l.kgTotal, 0)
    const totalHa = lotes.reduce((sum, l) => sum + l.superficie, 0)
    const kgHaTotal = totalHa > 0 ? Math.round(totalKg / totalHa) : null

    return {
      ok: true,
      lotes,
      totales: { kgTotal: Math.round(totalKg), totalHa, kgHaTotal },
    }
  } catch (e: any) {
    return { ok: false, error: e.message }
  }
}
