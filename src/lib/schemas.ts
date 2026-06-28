import { z } from 'zod'

export const DatosInicialesSchema = z.object({
  ok: z.boolean(),
  campanias: z.array(z.string()),
  establecimientos: z.array(z.string()),
  datosLotes: z.array(z.tuple([z.string(), z.string(), z.number()])),
  labores: z.array(z.string()),
  cultivos: z.array(z.string()),
  cultivosRotacion: z.array(z.string()),
  insumosAgro: z.array(z.string()),
  variedades: z.array(z.string()),
  fertilizantes: z.array(z.string()),
  unidades: z.record(z.string(), z.string()),
  unidadesVar: z.record(z.string(), z.string()),
  unidadesFert: z.record(z.string(), z.string()),
  categorias: z.record(z.string(), z.string()),
  proveedores: z.array(z.string()),
  responsables: z.array(z.string()),
  labranzas: z.array(z.string()),
})

export const ProductoLineaSchema = z.object({
  producto: z.string(),
  dosis: z.union([z.string(), z.number()]),
  unidad: z.string(),
})

export const LoteOrdenSchema = z.object({
  establecimiento: z.string(),
  lote: z.string(),
  cultivo: z.string(),
  superficie: z.union([z.string(), z.number()]),
  productos: z.array(ProductoLineaSchema),
})

export const OrdenPayloadSchema = z.object({
  campania: z.string(),
  fecha: z.string(),
  labor: z.string(),
  responsable: z.string(),
  proveedor: z.string().optional(),
  observaciones: z.string().optional(),
  lotes: z.array(LoteOrdenSchema),
})

export const CamionPayloadSchema = z.object({
  campania: z.string(),
  establecimiento: z.string(),
  lote: z.string(),
  cultivo: z.string().optional(),
  fecha: z.string(),
  patente: z.string().optional(),
  empresa: z.string().optional(),
  kgTolva: z.number(),
  kgBalanza: z.number().optional(),
})

// Inferred types — no duplication
export type DatosIniciales = z.infer<typeof DatosInicialesSchema>
export type ProductoLinea = z.infer<typeof ProductoLineaSchema>
export type LoteOrden = z.infer<typeof LoteOrdenSchema>
export type OrdenPayload = z.infer<typeof OrdenPayloadSchema>
export type CamionPayload = z.infer<typeof CamionPayloadSchema>
