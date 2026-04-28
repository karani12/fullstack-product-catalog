import { StarIcon } from '@heroicons/react/24/solid'
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline'

export function Rating({ rating, max = 5 }: { rating: number; max?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }).map((_, i) =>
        i < rating ? (
          <StarIcon key={i} className="w-4 h-4 text-amber-400" />
        ) : (
          <StarOutlineIcon key={i} className="w-4 h-4 text-gray-200" />
        )
      )}
    </div>
  )
}
