'use client'

import { QueryCache, QueryClient, QueryClientProvider, MutationCache } from '@tanstack/react-query'
import { useState } from 'react'
import { toast } from 'sonner'

function handleError(error: unknown) {
  const anyErr = error as any

  const status = anyErr?.status
  const message = anyErr?.message

  if (!status) {
    toast.error('Something went wrong')
    return
  }

  switch (status) {
    case 401:
      toast.error('Unauthorized access')
      break

    case 500:
      toast.error('Something went wrong. Try again later')
      break

    case 404:
      toast.error('Not found')
      break

    case 422:
      break

    default:
      toast.error(message || 'Something went wrong')
  }
}

export default function ReactQueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        queryCache: new QueryCache({ onError: handleError }),
        mutationCache: new MutationCache({ onError: handleError }),
        defaultOptions: {
          queries: { retry: false },
        },
      })
  )

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
