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

/**
 * Converts a date string from "dd-mmm-yyyy" to "dd/mm/yyyy"
 * Example: "13-jun-2023" → "13/06/2023"
 */
export function formatDateToDMY(dateStr: string): string {
  const parts = dateStr.split('-')
  if (parts.length !== 3) return dateStr // fallback for unexpected format

  const day = parts[0].padStart(2, '0')
  const monthAbbr = parts[1].toLowerCase()
  const year = parts[2]

  const months: Record<string, string> = {
    jan: '01',
    feb: '02',
    mar: '03',
    apr: '04',
    may: '05',
    jun: '06',
    jul: '07',
    aug: '08',
    sep: '09',
    oct: '10',
    nov: '11',
    dec: '12',
  }

  const month = months[monthAbbr]
  if (!month) return dateStr // fallback if month abbreviation is unknown

  return `${day}/${month}/${year}`
}
