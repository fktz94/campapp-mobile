import { auth } from '@/lib/firebaseAuth'
import type { CamionPayload, OrdenPayload } from './schemas'
import { DatosInicialesSchema } from './schemas'

const APPS_SCRIPT_URL = process.env.EXPO_PUBLIC_API_URL!

async function call<T>(action: string, params?: unknown): Promise<T> {
  const token = await auth.currentUser?.getIdToken()
  const res = await fetch(APPS_SCRIPT_URL, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: JSON.stringify({ action, params }),
  })
  const data = await res.json()
  console.log(`[api] ${action}`, data)
  if (!data.ok) throw new Error(data.error ?? 'Unknown error')
  return data as T
}

export const api = {
  getDatosIniciales: async () => {
    const raw = await call<unknown>('getDatosIniciales')
    return DatosInicialesSchema.parse(raw)
  },
  guardarOrden: (orden: OrdenPayload) => call('guardarOrden', orden),
  guardarCamion: (datos: CamionPayload) => call('guardarCamion', datos),
  getDatosVisualizador: (campaña: string, establecimiento: string, lote: string) =>
    call('getDatosVisualizador', [campaña, establecimiento, lote]),
  getDatosResumen: (campaña: string, establecimiento: string) =>
    call('getDatosResumen', [campaña, establecimiento]),
  getProximoNumeroOT: () => call<{ numOT: string }>('getProximoNumeroOT'),
}
