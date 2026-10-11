export const QUERY_KEYS = {
  catalogos: ['catalogos'] as const,
  operativo: ['operativo'] as const,
  chatMessages: (userEmail: string) => ['chatMessages', userEmail],
}
