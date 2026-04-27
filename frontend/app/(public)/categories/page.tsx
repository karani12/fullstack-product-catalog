import CategoryCard from '@/app/components/CategoryCard'
import { CategoryResponse, getCategories } from '@/app/lib/api/category'

export const dynamic = 'force-static'

export default async function CategoriesPage() {
  const res = await getCategories()
  const categories: CategoryResponse[] = res.data ?? []

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Categories</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {categories.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>
    </div>
  )
}
