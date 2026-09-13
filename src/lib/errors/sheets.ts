export type SheetsErrorCode = 'ACCESS_DENIED' | 'RATE_LIMITED' | 'NETWORK' | 'TIMEOUT' | 'UNKNOWN'

export class SheetsError extends Error {
  constructor(
    public code: SheetsErrorCode,
    message: string,
    public status?: number,
    public meta?: Record<string, unknown>
  ) {
    super(message)
    this.name = 'SheetsError'
  }
}
