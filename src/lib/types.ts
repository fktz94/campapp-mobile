export interface DatosIniciales {
  ok: boolean
  campanias: string[]
  establecimientos: string[]
  datosLotes: [string, string, number][]
  labores: string[]
  cultivos: string[]
  cultivosRotacion: string[]
  insumosAgro: string[]
  variedades: string[]
  fertilizantes: string[]
  unidades: Record<string, string>
  unidadesVar: Record<string, string>
  unidadesFert: Record<string, string>
  categorias: Record<string, string>
  proveedores: string[]
  responsables: string[]
  labranzas: string[]
}

export interface ProductoLinea {
  producto: string
  dosis: string | number
  unidad: string
}

export interface LoteOrden {
  establecimiento: string
  lote: string
  cultivo: string
  superficie: string | number
  productos: ProductoLinea[]
}

export interface OrdenPayload {
  campania: string
  fecha: string // YYYY-MM-DD
  labor: string
  responsable: string
  proveedor?: string
  observaciones?: string
  lotes: LoteOrden[]
}

export interface CamionPayload {
  campania: string
  establecimiento: string
  lote: string
  cultivo?: string
  fecha: string
  patente?: string
  empresa?: string
  kgTolva: number
  kgBalanza?: number
}
