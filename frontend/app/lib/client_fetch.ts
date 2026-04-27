import { getToken } from '@/app/lib/api/auth'
import { ApiResponse } from '@/app/types/ApiResponse'

export class ApiError<T = unknown> extends Error {
  constructor(
    public status: number,
    public response?: ApiResponse<T>
  ) {
    super(response?.message || `API error (${status})`)
    this.name = 'ApiError'
  }
}

//fetching client side API since I need to access cookie using browser api hence the need for two client
export async function clientFetch<T>(path: string, options: RequestInit = {}): Promise<T | void> {
  const token = getToken()

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })

  if (res.status === 204) return

  let body: ApiResponse<T> | null = null

  try {
    body = await res.json()
  } catch {}

  if (!res.ok) {
    throw new ApiError(res.status, body ?? undefined)
  }

  return body as T
}
