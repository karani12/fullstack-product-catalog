import { clientFetch } from '@/app/lib/client_fetch'

export function getToken(): string | null {
  return localStorage.getItem('auth_token')
}

export function setToken(token: string) {
  localStorage.setItem('auth_token', token)
}

export function removeToken() {
  localStorage.removeItem('auth_token')
}

export function login(payload: { email: string; password: string }) {
  return clientFetch<{ data: { token: string; user: AuthUser } }>('/api/v1/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function logout() {
  return clientFetch<void>('/api/v1/auth/logout', { method: 'POST' })
}

export function getMe() {
  return clientFetch<{ data: AuthUser }>('/api/v1/auth/me')
}

export interface AuthUser {
  id: number
  name: string
  email: string
}
