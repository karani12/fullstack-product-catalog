import { Spinner } from '@/app/components/ui/spinner/Spinner'
import { useAuth } from '@/app/lib/hooks/useAuth'

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-full">
        <Spinner className="h-6 w-6" />
      </div>
    )
  }

  if (!user) return null

  return <>{children}</>
}
