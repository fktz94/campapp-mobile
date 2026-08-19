export type SheetResponse = { values?: string[][] }

export type ListasData = {
  campanias: string[]
  establecimientos: string[]
  labores: string[]
  cultivos: string[]
  proveedores: string[]
  responsables: string[]
  labranzas: string[]
}

export type ProductoEnBloque = {
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
  productos: ProductoEnBloque[]
  tieneServicio: boolean
  observaciones: string
}
