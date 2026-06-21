import { CamionPayload, DatosIniciales, OrdenPayload } from './types'

const APPS_SCRIPT_URL = 'YOUR_DEPLOYMENT_URL'

async function call<T>(action: string, params?: unknown): Promise<T> {
  const res = await fetch(APPS_SCRIPT_URL, {
    method: 'POST',
    body: JSON.stringify({ action, params }),
  })
  const data = await res.json()
  if (!data.ok) throw new Error(data.error ?? 'Unknown error')
  return data as T
}

export const api = {
  getDatosIniciales: () => call<DatosIniciales>('getDatosIniciales'),
  guardarOrden: (orden: OrdenPayload) => call('guardarOrden', orden),
  guardarCamion: (datos: CamionPayload) => call('guardarCamion', datos),
  getDatosVisualizador: (campaña: string, establecimiento: string, lote: string) =>
    call('getDatosVisualizador', [campaña, establecimiento, lote]),
  getDatosResumen: (campaña: string, establecimiento: string) =>
    call('getDatosResumen', [campaña, establecimiento]),
  getProximoNumeroOT: () => call<{ numOT: string }>('getProximoNumeroOT'),
}
