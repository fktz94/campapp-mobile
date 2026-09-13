import { SheetsError } from '../errors/sheets'

const ABORT_TIMEOUT_MILISECONDS = 15_000

export function col(rows: string[][], colIndex: number): string[] {
  const seen = new Map<string, string>()
  for (let i = 1; i < rows.length; i++) {
    const raw = (rows[i]?.[colIndex] ?? '').toString().trim()
    if (!raw) continue
    const key = raw.toLowerCase()
    if (!seen.has(key)) seen.set(key, raw)
  }
  return [...seen.values()]
}

export async function doFetch(url: string, options: RequestInit, token: string): Promise<Response> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), ABORT_TIMEOUT_MILISECONDS)
  try {
    return await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
  } catch (err: any) {
    if (err?.name === 'AbortError') {
      throw new SheetsError('TIMEOUT', 'Sheets request timed out after 15s')
    }
    throw new SheetsError('NETWORK', 'Network error reaching Sheets', undefined, { cause: err })
  } finally {
    clearTimeout(timeout)
  }
}
