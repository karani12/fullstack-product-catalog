import Link from 'next/link'

import { ProductResponse } from '@/app/lib/api/products'
import { Rating } from '@/app/components/ui/rating/Rating'

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
        <div className="my-3">
          <Rating rating={product.average_rating} />
        </div>

        <div className="mt-auto  pt-3 border-t flex items-center justify-between">
          <span className="text-sm font-semibold">${Number(product.price).toFixed(2)}</span>

          {product.stock_qty === 0 && <span className="text-xs text-red-400">Out of stock</span>}
        </div>
      </div>
    </Link>
  )
}
