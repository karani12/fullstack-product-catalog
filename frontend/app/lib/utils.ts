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

  if (!res.ok) throw new Error(`API error: ${res.status}`)

  return res.json()
}
