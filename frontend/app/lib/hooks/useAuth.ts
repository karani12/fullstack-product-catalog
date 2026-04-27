import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { getMe, getToken, AuthUser } from '@/app/lib/api/auth'

export function useAuth() {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<AuthUser | null | undefined>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = getToken()
    if (!token) {
      setLoading(false)

      if (pathname !== '/login') router.replace('/login')
      return
    }

    getMe()
      .then((res) => setUser(res?.data))
      .catch(() => {
        setUser(null)
      })
      .finally(() => setLoading(false))
  }, [router])

  const isAuthenticated = !!user

  return { user, loading, isAuthenticated }
}
