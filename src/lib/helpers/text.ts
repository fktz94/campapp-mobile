export const normalize = (s: string) => s.trim().toLowerCase()
export const isSameText = (a: string, b: string) => normalize(a) === normalize(b)

export const truncate = (str: string, max: number) =>
  str.length > max ? `${str.slice(0, max - 1)}…` : str
