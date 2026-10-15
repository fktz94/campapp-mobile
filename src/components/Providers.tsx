import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { PropsWithChildren } from 'react'

import { queryClient } from '@/lib/queryClient'
import { queryPersister } from '@/lib/queryPersister'
import { KeyboardProvider } from 'react-native-keyboard-controller'

export default function Providers({ children }: PropsWithChildren) {
  return (
    <KeyboardProvider>
      <PersistQueryClientProvider
        client={queryClient}
        persistOptions={{
          persister: queryPersister,
          maxAge: 7 * 24 * 60 * 60_000,
          buster: 'v1',
          dehydrateOptions: {
            shouldDehydrateQuery: (query) => query.state.status === 'success',
          },
        }}
      >
        {children}
      </PersistQueryClientProvider>
    </KeyboardProvider>
  )
}
