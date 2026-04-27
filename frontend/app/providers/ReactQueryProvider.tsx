'use client'

import { QueryCache, QueryClient, QueryClientProvider, MutationCache } from '@tanstack/react-query'
import { useState } from 'react'
import { toast } from 'sonner'
import { ApiError } from '@/app/lib/client_fetch'

function handleError(error: unknown) {
  if (!(error instanceof ApiError)) {
    toast.error('Something went wrong')
    return
  }

  switch (error.status) {
    case 401:
      toast.error('Unauthorized access')
      break
    case 500:
      toast.error('Something went wrong. Try again later')
      break
    case 404:
      toast.error('Not found')
    case 422:
      break
    default:
      toast.error('something went wrong')
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
