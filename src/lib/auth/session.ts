import { queryClient } from '@/lib/queryClient'
import { useAppStore } from '@/store/app'
import { queryPersister } from '../queryPersister'

export const clearSession = () => {
  useAppStore.getState().resetAuth()

  queryClient.cancelQueries()
  queryClient.clear()

  queryPersister.removeClient()
}
