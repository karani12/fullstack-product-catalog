import { Review } from '@/src/db/schema'
import { StarIcon } from '@heroicons/react/24/solid'
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline'

interface Props {
  review: Review
}

export default function ReviewCard({ review }: Props) {
  return (
    <div className="bg-surface border rounded-xl p-5">
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-sm font-medium">{review.reviewer_name}</p>
        </div>
        <div className="flex items-center gap-0.5">
          {Array.from({ length: 5 }).map((_, i) =>
            i < review.rating ? (
              <StarIcon key={i} className="w-4 h-4 text-amber-400" />
            ) : (
              <StarOutlineIcon key={i} className="w-4 h-4 text-gray-200" />
            )
          )}
        </div>
      </div>

      <p className="text-sm line-clamp-3">{review.body}</p>
    </div>
  )
}
