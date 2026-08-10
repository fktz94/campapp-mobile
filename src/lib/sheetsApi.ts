import {
  GoogleSignin,
  isErrorWithCode,
  statusCodes,
} from '@react-native-google-signin/google-signin'

const SPREADSHEET_ID = process.env.EXPO_PUBLIC_SPREADSHEET_ID!
const BASE = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}`

async function getAccessToken(): Promise<string> {
  try {
    const { accessToken } = await GoogleSignin.getTokens()
    return accessToken
  } catch (e) {
    if (isErrorWithCode(e) && e.code === statusCodes.SIGN_IN_REQUIRED) {
      throw new Error('SIGN_IN_REQUIRED')
    }
    throw e
  }
}

async function get<T>(range: string): Promise<T> {
  const token = await getAccessToken()
  const res = await fetch(`${BASE}/values/${encodeURIComponent(range)}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) throw new Error(`Sheets API error ${res.status}: ${await res.text()}`)
  return res.json()
}

async function append(range: string, values: unknown[][]): Promise<void> {
  const token = await getAccessToken()
  const res = await fetch(
    `${BASE}/values/${encodeURIComponent(range)}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ values }),
    }
  )
  if (!res.ok) throw new Error(`Sheets API error ${res.status}: ${await res.text()}`)
}

async function update(range: string, values: unknown[][]): Promise<void> {
  const token = await getAccessToken()
  const res = await fetch(
    `${BASE}/values/${encodeURIComponent(range)}?valueInputOption=USER_ENTERED`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ values }),
    }
  )
  if (!res.ok) throw new Error(`Sheets API error ${res.status}: ${await res.text()}`)
}

export const sheetsApi = { get, append, update }
