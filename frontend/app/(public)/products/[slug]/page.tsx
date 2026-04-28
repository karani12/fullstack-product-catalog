import { getProducts, getProduct, ProductResponse } from '@/app/lib/api/products'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import ReviewCard from '@/app/components/ReviewCard'
import ReviewForm from '@/app/components/ReviewForm'
import { Review } from '@/src/db/schema'
import { Rating } from '@/app/components/ui/rating/Rating'

type PageParams = Promise<{ slug: string }>
export async function generateStaticParams(): Promise<{ slug: string }[]> {
  try {
    const res = await getProducts(1, null)
    const products: ProductResponse[] = res.data ?? []
    return products.map((product) => ({ slug: product.slug }))
  } catch {
    return []
  }
}

export default async function ProductPage({ params }: { params: PageParams }) {
  const { slug } = await params

  let product: ProductResponse

  try {
    const res = await getProduct(slug)
    if (!res.data) notFound()
    product = res.data
  } catch {
    notFound()
  }

  return (
    <div className="mx-auto pb-10 space-y-6">
      <Link href="/products" className="inline-flex items-center gap-2 text-sm">
        <ArrowLeftIcon className="w-4 h-4" />
        Back to Products
      </Link>

      <div className="space-y-2">
        <h1 className="text-3xl font-bold">{product.name}</h1>
        <Rating rating={product.average_rating} />
        <p className="text-2xl font-light">${product.price}</p>
      </div>

      <p className="leading-relaxed">{product.description}</p>

      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <h2 className="text-sm font-medium">Reviews</h2>
          <div className="flex-1 h-px" />
        </div>

        {product?.reviews?.length ? (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {product.reviews.map((review: Review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        ) : (
          <p className="text-sm">No reviews yet.</p>
        )}
      </div>
      <div className="flex flex-col gap-3 md:w-1/3 md:pl-4">
        <h1 className="text-3xl italic underline font-light">Leave a review</h1>
        <ReviewForm productId={product.id} />
      </div>
    </div>
  )
}
