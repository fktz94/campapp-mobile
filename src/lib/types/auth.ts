export type UserProfile = {
  email: string
  name: string
}

export interface MeResponse {
  user: UserProfile
  token: string | null
}

export type AuthResponse = {
  user: UserProfile
  backendToken: string
}
