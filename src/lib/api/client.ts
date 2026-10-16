import Constants from 'expo-constants'
import { fetch } from 'expo/fetch'

import { useAppStore } from '@/store/app'
import { GoogleSignin } from '@react-native-google-signin/google-signin'
import { Platform } from 'react-native'
import { clearSession } from '../auth/session'

const getDevApiUrl = (): string => {
  const hostUri =
    Constants.expoConfig?.hostUri ?? Constants.manifest2?.extra?.expoGo?.developer?.extra?.hostUri
  const hostIp = hostUri?.split(':')[0]

  if (hostIp && hostIp !== 'localhost' && hostIp !== '127.0.0.1') {
    return `http://${hostIp}:3000`
  }

  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:3000'
  }

  return 'http://localhost:3000'
}
export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ?? (__DEV__ ? getDevApiUrl() : 'https://campapp-api.onrender.com')

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
  let buffer = ''

  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n\n')
      buffer = lines.pop() ?? ''

      for (const line of lines) {
        const trimmed = line.trim()
        if (trimmed.startsWith('data:')) {
          const jsonStr = trimmed.replace('data:', '').trim()
          try {
            const parsedText = JSON.parse(jsonStr)
            if (parsedText) {
              onChunk(parsedText)
            }
          } catch {
            onChunk(jsonStr)
          }
        }
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
