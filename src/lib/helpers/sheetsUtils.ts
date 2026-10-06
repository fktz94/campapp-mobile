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
