export const normalize = (s: string) => s.trim().toLowerCase()
export const isSameText = (a: string, b: string) => normalize(a) === normalize(b)
