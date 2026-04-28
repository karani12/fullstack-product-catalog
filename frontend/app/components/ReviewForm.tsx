'use client'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { StarIcon } from '@heroicons/react/24/outline'
import { Input } from '@/app/components/ui/input/Input'
import { Textarea } from '@/app/components/ui/textarea/TextArea'
import { Button } from '@/app/components/ui/button/Button'
import { applyServerErrors } from '@/app/lib/form'
import { apiFetch } from '@/app/lib/utils'

const schema = z.object({
  reviewer_name: z.string().min(1, 'Name is required'),
  email: z.email('Valid email is required'),
  rating: z.number().min(1, 'Please select a rating').max(5),
  body: z.string().min(10, 'Review must be at least 10 characters'),
})

type FormData = z.infer<typeof schema>

export default function ReviewForm({ productId }: { productId: number }) {
  const [submitted, setSubmitted] = useState(false)
  const [hoveredStar, setHoveredStar] = useState(0)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { reviewer_name: '', email: '', body: '', rating: 0 },
  })

  const rating = watch('rating')

  async function onSubmit(data: FormData) {
    try {
      await apiFetch('/api/v1/reviews', {
        method: 'POST',
        body: JSON.stringify({ ...data, product_id: productId }),
      })
      setSubmitted(true)
      toast.success('Review submitted! It will appear after approval.')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      if (e?.status === 422 && e?.response?.errors) {
        applyServerErrors(e.response.errors, setError)
        return
      }
      toast.error(e?.message || 'Something went wrong')
    }
  }
  if (submitted) {
    return (
      <div className="text-center py-8">
        <p className="font-medium">Thanks for your review!</p>
        <p className="text-sm text-muted-foreground mt-1">It will appear after approval.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Name"
          registration={register('reviewer_name')}
          error={errors.reviewer_name?.message}
        />
        <Input
          label="Email"
          type="email"
          registration={register('email')}
          error={errors.email?.message}
        />
      </div>

      <div>
        <label className="block text-sm mb-1">Rating</label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onMouseEnter={() => setHoveredStar(star)}
              onMouseLeave={() => setHoveredStar(0)}
              onClick={() => setValue('rating', star, { shouldValidate: true })}
            >
              <StarIcon
                className={`w-6 h-6 transition-colors ${star <= (hoveredStar || rating) ? 'text-amber-400' : 'text-gray-300'}`}
              />
            </button>
          ))}
        </div>
        {errors.rating && <p className="text-xs text-red-500 mt-1">{errors.rating.message}</p>}
      </div>

      <Textarea
        label="Review"
        rows={4}
        registration={register('body')}
        error={errors.body?.message}
        placeholder="Share your experience..."
      />

      <Button type="submit" loading={isSubmitting} className="w-full">
        Submit review
      </Button>
    </form>
  )
}
