'use client'

import { useAuth } from '@/app/lib/hooks/useAuth'

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()

  if (loading) return null
  if (!user) return null

  return <>{children}</>
}
