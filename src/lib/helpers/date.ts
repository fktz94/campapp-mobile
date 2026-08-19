export function parseFechaToNum(s: string): number {
  if (!s) return 0
  const parts = s.split('/')
  if (parts.length === 3) {
    const d = parseInt(parts[0])
    const m = parseInt(parts[1]) - 1
    const y = parseInt(parts[2])
    if (y < 100) return new Date(2000 + y, m, d).getTime()
    return new Date(y, m, d).getTime()
  }
  const parts2 = s.split('-')
  if (parts2.length === 3) {
    const d = parseInt(parts2[0])
    const m = parseInt(parts2[1]) - 1
    const y = parseInt(parts2[2])
    if (y < 100) return new Date(2000 + y, m, d).getTime()
    return new Date(y, m, d).getTime()
  }
  return 0
}
