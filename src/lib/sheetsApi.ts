import {
  GoogleSignin,
  isErrorWithCode,
  statusCodes,
} from '@react-native-google-signin/google-signin'

const SPREADSHEET_ID = process.env.EXPO_PUBLIC_SPREADSHEET_ID!
const BASE = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}`

async function getAccessToken(invalidToken?: string): Promise<string> {
  try {
    if (invalidToken) {
      await GoogleSignin.clearCachedAccessToken(invalidToken)
    }
    const { accessToken } = await GoogleSignin.getTokens()
    return accessToken
  } catch (e) {
    if (isErrorWithCode(e) && e.code === statusCodes.SIGN_IN_REQUIRED) {
      throw new Error('SIGN_IN_REQUIRED')
    }
    throw e
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  let token = await getAccessToken()

  let res = await fetch(`${BASE}${endpoint}`, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })

  if (res.status === 401) {
    token = await getAccessToken(token)
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
