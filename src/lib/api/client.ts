import Constants from 'expo-constants'
import { fetch } from 'expo/fetch'

import { useAppStore } from '@/store/app'
import { GoogleSignin } from '@react-native-google-signin/google-signin'
import { clearSession } from '../auth/session'

const getDevHost = () => {
  const hostUri = Constants.expoConfig?.hostUri
  return hostUri?.split(':')[0] ?? 'localhost'
}
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://campapp-api.onrender.com'
// const API_BASE_URL = __DEV__ ? `http://${getDevHost()}:3000` : 'https://campapp-api.onrender.com' // device
// const API_BASE_URL = Platform.OS === 'android' ? 'http://10.0.2.2:3000' : 'http://localhost:3000'  // emulator

async function getAuthHeaders(): Promise<Record<string, string>> {
  const { backendToken, setGoogleAccessToken } = useAppStore.getState()
  let googleAccessToken = useAppStore.getState().googleAccessToken

  try {
    const tokens = await GoogleSignin.getTokens()
    if (tokens?.accessToken) {
      googleAccessToken = tokens.accessToken
      setGoogleAccessToken(tokens.accessToken)
    }
  } catch (error) {
    console.warn('No se pudo refrescar el token de Google automáticamente:', error)
  }

  return {
    'Content-Type': 'application/json',
    ...(backendToken ? { Authorization: `Bearer ${backendToken}` } : {}),
    ...(googleAccessToken ? { 'x-google-access-token': googleAccessToken } : {}),
  }
}

async function assertOk(res: { ok: boolean; status: number; json(): Promise<any> }) {
  if (res.status === 401) {
    clearSession()
    throw new Error('SESSION_EXPIRED')
  }
  if (!res.ok) {
    const body = await res.json().catch(() => null)
    throw new Error(body?.message || `API error ${res.status}`)
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: { ...(await getAuthHeaders()), ...options.headers },
  })
  await assertOk(res)
  return res.json()
}

// 3. Streaming
async function stream(
  path: string,
  body: unknown,
  onChunk: (text: string) => void,
  signal?: AbortSignal
): Promise<void> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: await getAuthHeaders(),
    body: JSON.stringify(body),
    signal,
  })

  await assertOk(res)

  const bodyStream = res.body
  if (!bodyStream) throw new Error('Streaming not supported')

  const reader = bodyStream.getReader()
  const decoder = new TextDecoder()

  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      const decodedChunk = decoder.decode(value, { stream: true })
      if (decodedChunk) {
        onChunk(decodedChunk)
      }
    }
  } finally {
    reader.releaseLock()
  }
}

export const apiClient = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body: unknown) =>
    request<T>(path, { method: 'POST', body: JSON.stringify(body) }),
  stream,
}
