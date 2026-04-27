'use client'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { login, setToken } from '@/app/lib/api/auth'
import { Input } from '@/app/components/ui/input/Input'
import { Button } from '@/app/components/ui/button/Button'
import { useAuth } from '@/app/lib/hooks/useAuth'
import { useEffect } from 'react'

const loginSchema = z.object({
  email: z.email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

type LoginFormData = z.infer<typeof loginSchema>

export default function LoginPage() {
  const router = useRouter()
  const { isAuthenticated, loading } = useAuth()

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.replace('/admin')
    }
  }, [loading, isAuthenticated, router])
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  async function onSubmit(data: LoginFormData) {
    try {
      const res = await login(data)
      if (!res?.data?.token) throw new Error()
      setToken(res?.data.token)
      router.push('/admin')
    } catch {
      setError('root', { message: 'Invalid email or password' })
    }
  }

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center space-y-3">
      <div>
        <h1 className="text-3xl font-medium">Welcome Back !</h1>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-4 border rounded-md w-1/3">
        {errors.root && <p>{errors.root.message}</p>}
        <Input label="Email" registration={register('email')} error={errors.email?.message} />
        <Input
          label="Password"
          type="password"
          registration={register('password')}
          error={errors.password?.message}
        />

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? 'Logging in...' : 'Login'}
        </Button>
      </form>
    </div>
  )
}
