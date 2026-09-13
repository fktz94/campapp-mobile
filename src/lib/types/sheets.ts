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

export type Producto = {
  producto: string
  categoria: string
  dosis: string
  unidad: string
  superficie: string
}

export type Bloque = {
  fecha: string
  fechaReal: string
  labor: string
  proveedores: string[]
  provServicio: string
  responsable: string
  estado: string
  productos: Producto[]
  tieneServicio: boolean
  observaciones: string
}
