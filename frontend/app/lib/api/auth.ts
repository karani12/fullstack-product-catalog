import { clientFetch } from '@/app/lib/client_fetch'

export interface AuthUser {
  id: number
  name: string
  email: string
}

const TOKEN_KEY = 'auth_token'
const MAX_AGE = 60 * 60 * 24 * 7

export function getToken(): string | null {
  if (typeof window === 'undefined') return null
  return (
    document.cookie
      .split('; ')
      .find((row) => row.startsWith(`${TOKEN_KEY}=`))
      ?.split('=')[1] ?? null
  )
}

export function setToken(token: string) {
  document.cookie = `${TOKEN_KEY}=${token}; Max-Age=${MAX_AGE}; path=/; SameSite=Strict`
}

export function removeToken() {
  document.cookie = `${TOKEN_KEY}=; Max-Age=0; path=/`
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
