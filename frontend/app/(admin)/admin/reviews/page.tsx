'use client'
import Table from '@/app/components/ui/table/table'
import { DeleteAction } from '@/app/components/DeleteAction'
import { ConfirmToggleAction } from '@/app/components/ConfirmToggleAction'
import { useReviews } from '@/app/lib/hooks/useReviews'
import { Spinner } from '@/app/components/ui/spinner/Spinner'
import { Rating } from '@/app/components/ui/rating/Rating'

export default function AdminReviewsPage() {
  const { reviews, toggleApproval, deleteReview } = useReviews()
  const { data = [], isLoading, isError } = reviews

  if (isLoading) return <Spinner />
  if (isError) return <p>Failed to load reviews</p>

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Reviews</h1>

      <div className="space-y-6 min-w-0 overflow-hidden">
        <Table
          data={data}
          keyExtractor={(r) => r.id}
          columns={[
            { key: 'reviewer_name', label: 'Reviewer', sticky: true },
            { key: 'email', label: 'Email' },
            { key: 'rating', label: 'Rating', render: (r) => <Rating rating={r.rating} /> },
            {
              key: 'body',
              label: 'Review',
              render: (r) => <span className="line-clamp-2">{r.body}</span>,
            },
            {
              key: 'product',
              label: 'Product',
              render: (r) => <span className="line-clamp-2">{r.product?.name ?? '-'}</span>,
            },
            {
              key: 'is_approved',
              label: 'Approved',
              render: (r) => (
                <ConfirmToggleAction
                  value={r.is_approved}
                  getTitleAction={(next) => (next ? 'Approve review' : 'Reject review')}
                  getDescriptionAction={(next) =>
                    next
                      ? 'This review will become visible publicly.'
                      : 'This review will be hidden.'
                  }
                  getConfirmTextAction={(next) => (next ? 'Approve' : 'Reject')}
                  onConfirmAction={(next) => void toggleApproval.mutateAsync({ id: r.id, next })}
                />
              ),
            },
            {
              key: 'actions',
              label: '',
              actions: ({ row }) => (
                <DeleteAction row={row} onDelete={(r) => void deleteReview.mutateAsync(r.id)} />
              ),
            },
          ]}
        />
      </div>
    </div>
  )
}
