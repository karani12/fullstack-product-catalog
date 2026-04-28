'use client'
import { useSyncExternalStore } from 'react'
import { Spinner } from '@/app/components/ui/spinner/Spinner'
import { useAuth } from '@/app/lib/hooks/useAuth'

const subscribe = () => () => {}

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const mounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  )
  const { user, loading } = useAuth()

  if (!mounted || loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner className="h-6 w-6" />
      </div>
    )
  }

  return <>{children}</>
}
