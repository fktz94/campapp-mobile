import { AuthResponse, MeResponse } from '../types/auth'
import { apiClient } from './client'

export async function loginWithGoogle(idToken: string): Promise<AuthResponse> {
  return apiClient.post<AuthResponse>('/auth/google', { idToken })
}

export async function fetchProfile(): Promise<MeResponse> {
  return await apiClient.get<MeResponse>('/auth/me')
}
