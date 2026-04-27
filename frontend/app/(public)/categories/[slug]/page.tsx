import { notFound } from 'next/navigation'
import Link from 'next/link'
import { CategoryResponse, getCategories, getCategory } from '@/app/lib/api/category'
import ProductCard from '@/app/components/ProductCard'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'

type PageParams = Promise<{ slug: string }>

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  try {
    const res = await getCategories()
    const categories: CategoryResponse[] = res.data ?? []
    return categories.map((category) => ({ slug: category.slug }))
  } catch {
    return []
  }
}

export default async function CategoryPage({ params }: { params: PageParams }) {
  const { slug } = await params

  let category: CategoryResponse

  try {
    const res = await getCategory(slug)
    if (!res.data) notFound()
    category = res.data
    console.log(category)
  } catch {
    notFound()
  }

  return (
    <div className="mx-auto pb-10 space-y-6">
      <Link href="/categories" className="inline-flex items-center gap-2 text-sm">
        <ArrowLeftIcon className="w-4 h-4" />
        Back to Categories
      </Link>

      <h1 className="text-3xl font-bold">{category.name}</h1>

      <p className="leading-relaxed">{category.description}</p>

      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <h2 className="text-sm font-medium">Products</h2>
          <div className="flex-1 h-px" />
        </div>

        {category.products?.length ? (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {category.products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p className="text-sm">No products found</p>
        )}
      </div>
    </div>
  )
}
