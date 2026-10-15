export const SEMILLAS_POR_BOLSA = {
  MAIZ: 80000,
  GIRASOL: 180000,
} as const

export function getSemillasPorBolsa(cultivo?: string): number | null {
  if (!cultivo) return null
  const norm = cultivo.toLowerCase()
  if (norm.includes('maiz') || norm.includes('maíz')) {
    return SEMILLAS_POR_BOLSA.MAIZ
  }
  if (norm.includes('girasol')) {
    return SEMILLAS_POR_BOLSA.GIRASOL
  }
  return null
}

export function calcularBolsasSiembra(
  densidadSemillasHa: number,
  superficieHa: number,
  cultivo: string
) {
  const divisor = getSemillasPorBolsa(cultivo)
  if (!divisor || densidadSemillasHa <= 0) return null

  const bolsasPorHa = densidadSemillasHa / divisor
  const bolsasTotales = bolsasPorHa * superficieHa

  return {
    bolsasPorHa: Number(bolsasPorHa.toFixed(2)),
    bolsasTotales: Math.round(bolsasTotales),
  }
}
