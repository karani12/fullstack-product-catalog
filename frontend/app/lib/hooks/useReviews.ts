import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ApiResponse } from '@/app/types/ApiResponse'
import { Review } from '@/src/db/schema'
import { clientFetch } from '@/app/lib/client_fetch'
import { toast } from 'sonner'
import { ProductResponse } from '@/app/lib/api/products'
export interface ReviewResponse extends Review {
  product?: ProductResponse
}
export function useReviews() {
  const queryClient = useQueryClient()

  const reviews = useQuery({
    queryKey: ['reviews'],
    queryFn: () =>
      clientFetch<ApiResponse<ReviewResponse[]>>('/api/v1/admin/reviews').then(
        (res) => res?.data ?? []
      ),
  })

  const toggleApproval = useMutation({
    mutationFn: ({ id, next }: { id: number; next: boolean }) =>
      clientFetch(`/api/v1/admin/reviews/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ is_approved: next }),
      }),
    onMutate: async ({ id, next }) => {
      await queryClient.cancelQueries({ queryKey: ['reviews'] })
      const previous = queryClient.getQueryData<Review[]>(['reviews'])
      queryClient.setQueryData<Review[]>(['reviews'], (prev) =>
        prev?.map((review) => (review.id === id ? { ...review, is_approved: next } : review))
      )
      return { previous }
    },
    onSuccess: (_, { next }) => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] })
      toast.success(next ? 'Review approved' : 'Review rejected')
    },
    onError: (_, __, context) => {
      toast.error('Something went wrong')
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] })
    },
  })

  const deleteReview = useMutation({
    mutationFn: (id: number) => clientFetch(`/api/v1/admin/reviews/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] })
    },
  })

  return { reviews, toggleApproval, deleteReview }
}
