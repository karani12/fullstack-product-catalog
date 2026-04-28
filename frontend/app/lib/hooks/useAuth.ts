import { getMe, getToken, removeToken } from '@/app/lib/api/auth'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useEffect, useRef } from 'react'

export function useAuth() {
  const router = useRouter()
  const redirecting = useRef(false)
  const token = getToken()

  const {
    data: user,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['me'],
    queryFn: getMe,
    enabled: !!token,
    retry: false,
  })

  useEffect(() => {
    if (redirecting.current) return
    if (!isLoading && (!token || error)) {
      redirecting.current = true
      removeToken()
      router.replace('/login')
    }
  }, [token, error, isLoading])

  return {
    user: user ?? null,
    loading: isLoading,
    isAuthenticated: !!user,
  }
}
