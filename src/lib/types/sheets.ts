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
