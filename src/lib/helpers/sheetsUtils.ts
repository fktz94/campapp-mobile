export function col(rows: string[][], colIndex: number): string[] {
  return [
    ...new Set(
      rows
        .slice(1)
        .map((r) => r[colIndex] ?? '')
        .filter(Boolean)
    ),
  ]
}
