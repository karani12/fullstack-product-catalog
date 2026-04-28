'use client'
import { Spinner } from '@/app/components/ui/spinner/Spinner'
import { useAuth } from '@/app/lib/hooks/useAuth'
import { useEffect, useState } from 'react'

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)
  const { user, loading } = useAuth()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner className="h-6 w-6" />
      </div>
    )
  }

  return <>{children}</>
}
