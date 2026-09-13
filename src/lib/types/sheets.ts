export type SheetResponse = { values?: string[][] }

export type ListasData = {
  campanias: string[]
  labores: string[]
  cultivos: string[]
  proveedores: string[]
  responsables: string[]
  labranzas: string[]
}

export type Rotacion = {
  establecimiento: string
  lote: string
  has: number
  empresa: string
  campañas: Record<string, string>
}

export type FuenteDatos = {
  rotaciones: Rotacion[]
  laboresRows: string[][]
  cosechaRows: string[][]
}

type BloqueResumen = { fecha: string; labor: string; fechaReal: string }

export type RotMapEntry = {
  lote: string
  cultivo: string
  superficie: number
  campañas: Record<string, string>
}

export type RotMapEntryPorCultivo = {
  establecimiento: string
  lote: string
  superficie: number
  campañas: Record<string, string>
}

export type LoteAcc = {
  lote: string
  cultivo: string
  superficie: number
  bloqueMap: Record<string, BloqueResumen>
  fechaSiembra: string | null
  fechaSiembraPlan: string | null
  cultivoAntecesor: string
  campañaAntecesor: string
}

export type LoteAccPorCultivo = Omit<LoteAcc, 'lote'> & {
  establecimiento: string
  lote: string
}
