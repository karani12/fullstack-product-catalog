import ProductCard from '@/app/components/ProductCard'
import CategoryFilter from '@/app/components/CategoryFilter'
import { getCategories } from '@/app/lib/api/category'
import { getProducts } from '@/app/lib/api/products'
import Pagination from '@/app/components/Pagination'
import { PaginationMeta } from '@/app/types/ApiResponse'

interface Props {
  searchParams: Promise<{
    category?: string
    page: number | undefined
  }>
}

export default async function Products({ searchParams }: Props) {
  const { category, page } = await searchParams

  const [productsRes, categoriesRes] = await Promise.all([
    getProducts(page, category),
    getCategories(),
  ])

  const products = productsRes.data ?? []
  const categories = categoriesRes.data ?? []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Products</h1>

        <CategoryFilter categories={categories} />
      </div>

      {products.length === 0 ? (
        <p className="text-sm">No products found.</p>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 items-stretch">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <Pagination meta={productsRes.meta as PaginationMeta} />
        </div>
      )}
    </div>
  )
}
