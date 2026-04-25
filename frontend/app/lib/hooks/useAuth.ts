'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getMe, getToken, AuthUser } from '@/app/lib/api/auth'

export function useAuth() {
  const router = useRouter()
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!getToken()) {
      router.replace('/login')
      return
    }

    getMe()
      .then((res) => setUser(res.data))
      .catch(() => {
        router.replace('/login')
      })
      .finally(() => setLoading(false))
  }, [router])

  return { user, loading }
}
