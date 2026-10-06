import { useAppStore } from '@/store/app'
import { clearSession } from '../auth/session'

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://campapp-api.onrender.com'

//  __DEV__ &&
//    Platform.OS === 'android'
//     ? 'http://10.0.2.2:3000'
//     : 'http://localhost:3000'

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const { backendToken, googleAccessToken } = useAppStore.getState()

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(backendToken ? { Authorization: `Bearer ${backendToken}` } : {}),
      ...(googleAccessToken ? { 'x-google-access-token': googleAccessToken } : {}),
      ...options.headers,
    },
  })

  if (res.status === 401) {
    clearSession()
    throw new Error('SESSION_EXPIRED')
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.message || `API error ${res.status}`)
  }

  return res.json()
}

export const apiClient = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body: unknown) =>
    request<T>(path, { method: 'POST', body: JSON.stringify(body) }),
}
