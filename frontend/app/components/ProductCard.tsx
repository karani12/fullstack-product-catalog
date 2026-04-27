import Link from 'next/link'

import { StarIcon } from '@heroicons/react/24/solid'
import { ProductResponse } from '@/app/lib/api/products'
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline'

interface Props {
  product: ProductResponse
}

export default function ProductCard({ product }: Props) {
  return (
    <Link href={`/products/${product.slug}`} className="group block h-full">
      <div className="flex flex-col h-full rounded-xl border p-3">
        <div className="w-full aspect-square rounded-lg mb-3 flex items-center justify-center text-4xl" />

        {product.category && (
          <p className="text-xs uppercase tracking-wide mb-1">{product.category.name}</p>
        )}

        <h3 className="text-sm font-medium line-clamp-2">{product.name}</h3>

        <div className="flex-1">
          {product.description && (
            <p className="text-xs line-clamp-2 mt-2">{product.description}</p>
          )}
        </div>

        <div className="flex items-center gap-0.5 my-2">
          {Array.from({ length: 5 }).map((_, i) =>
            i < product.average_rating ? (
              <StarIcon key={i} className="w-4 h-4 text-amber-400" />
            ) : (
              <StarOutlineIcon key={i} className="w-4 h-4 text-gray-200" />
            )
          )}
        </div>

        <div className="mt-auto pt-3 border-t flex items-center justify-between">
          <span className="text-sm font-semibold">${Number(product.price).toFixed(2)}</span>

          {product.stock_qty === 0 && <span className="text-xs text-red-400">Out of stock</span>}
        </div>
      </div>
    </Link>
  )
}
