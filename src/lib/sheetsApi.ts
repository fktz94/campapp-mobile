import { SheetsError } from '@/lib/errors/sheets'
import { useAppStore } from '@/store/app'
import { getSheetsAccessToken } from './auth/googleAuth'
import { doFetch } from './helpers/sheetsUtils'

const SPREADSHEET_ID = process.env.EXPO_PUBLIC_SPREADSHEET_ID!
const BASE = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}`

let refreshing: Promise<string> | null = null

async function refreshToken(prev?: string): Promise<string> {
  if (!refreshing) {
    refreshing = getSheetsAccessToken(prev).finally(() => {
      refreshing = null
    })
  }
  return refreshing
}

export async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  let token = useAppStore.getState().googleAccessToken
  if (!token) token = await getSheetsAccessToken()

  let res = await doFetch(`${BASE}${endpoint}`, options, token)

  if (res.status === 401) {
    token = await refreshToken(token)
    res = await doFetch(`${BASE}${endpoint}`, options, token)
  }

  if (!res.ok) {
    if (res.status === 403 || res.status === 404) {
      throw new SheetsError('ACCESS_DENIED', 'SHEET_ACCESS_DENIED', res.status)
    }
    if (res.status === 429) {
      const retryAfter = Number(res.headers.get('Retry-After')) || 0
      throw new SheetsError('RATE_LIMITED', 'Quota exceeded', 429, { retryAfter })
    }
    const text = await res.text().catch(() => '')
    throw new SheetsError('UNKNOWN', `Sheets API error ${res.status}: ${text}`, res.status)
  }

  return res.json()
}

async function append(range: string, values: unknown[][]): Promise<void> {
  await request(
    `/values/${encodeURIComponent(range)}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`,
    {
      method: 'POST',
      body: JSON.stringify({ values }),
    }
  )
}

async function update(range: string, values: unknown[][]): Promise<void> {
  await request(`/values/${encodeURIComponent(range)}?valueInputOption=USER_ENTERED`, {
    method: 'PUT',
    body: JSON.stringify({ values }),
  })
}

export const sheetsApi = { append, update }
