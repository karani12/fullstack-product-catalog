const API_URL = process.env.NEXT_PUBLIC_API_URL

export function getToken(): string | null {
  return localStorage.getItem('auth_token')
}

export function setToken(token: string) {
  localStorage.setItem('auth_token', token)
}

export function removeToken() {
  localStorage.removeItem('auth_token')
}

async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken()

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })

  if (!res.ok) throw new Error(`API error: ${res.status}`)
  return res.json()
}

export function login(payload: { email: string; password: string }) {
  return apiFetch<{ data: { token: string; user: AuthUser } }>('/api/v1/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function logout() {
  return apiFetch<void>('/api/v1/auth/logout', { method: 'POST' })
}

export function getMe() {
  return apiFetch<{ data: AuthUser }>('/api/v1/auth/me')
}

export interface AuthUser {
  id: number
  name: string
  email: string
}
