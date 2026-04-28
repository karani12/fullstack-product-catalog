import { ApiError } from '@/app/lib/client_fetch'

export async function apiFetch<T>(
  path: string,
  options: RequestInit & { revalidate?: number | false } = {}
): Promise<T> {
  const { revalidate, ...fetchOptions } = options

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${path}`, {
    ...fetchOptions,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...fetchOptions.headers,
    },
    next: { revalidate: revalidate ?? false },
  })

  let body = null
  try {
    body = await res.json()
  } catch {}

  if (!res.ok) throw new ApiError(res.status, body ?? undefined)

  return body as T
}
