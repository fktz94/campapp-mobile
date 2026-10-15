import { QueryClient } from '@tanstack/react-query'
import { SheetsError } from './errors/sheets'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 12 * 60 * 60_000,
      gcTime: 7 * 24 * 60 * 60_000,
      networkMode: 'offlineFirst',
      // staleTime: 0,
      // gcTime: 0,
      // networkMode: 'always',

      retry: (failureCount, error) => {
        if (error instanceof SheetsError) {
          if (error.code === 'ACCESS_DENIED') return false
          if (error.code === 'TIMEOUT' || error.code === 'NETWORK') {
            return failureCount < 3
          }
          if (error.code === 'RATE_LIMITED') {
            return failureCount < 5
          }
        }
        return failureCount < 3
      },
      retryDelay: (attempt, error) => {
        if (error instanceof SheetsError && error.code === 'RATE_LIMITED') {
          const retryAfter = Number(error.meta?.retryAfter) * 1000
          if (retryAfter > 0) return retryAfter
        }
        const base = Math.min(1000 * 2 ** attempt, 30_000)
        const jitter = Math.random() * 500
        return base + jitter
      },
    },
  },
})
