import { useAppStore } from '@/store/app'
import { getSheetsAccessToken } from './auth/googleAuth'

const SPREADSHEET_ID = process.env.EXPO_PUBLIC_SPREADSHEET_ID!
const BASE = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}`

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  let token = useAppStore.getState().googleAccessToken
  if (!token) {
    token = await getSheetsAccessToken()
  }
  let res = await fetch(`${BASE}${endpoint}`, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })

  if (res.status === 401) {
    token = await getSheetsAccessToken(token)
    res = await fetch(`${BASE}${endpoint}`, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
  }

  if (!res.ok) {
    const errorText = await res.text()

    if (res.status === 403 || res.status === 404) {
      throw new Error('SHEET_ACCESS_DENIED')
    }

    throw new Error(`Sheets API error ${res.status}: ${errorText}`)
  }

  return res.json()
}

async function get<T>(range: string): Promise<T> {
  return request<T>(`/values/${encodeURIComponent(range)}`)
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

export const sheetsApi = { get, append, update }
