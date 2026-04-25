import { CategoryResponse, getCategories } from "@/app/lib/api/category"
import Link from "next/link"

export const dynamic = 'force-static'

export default async function CategoriesPage() {
  const res = await getCategories()
  const categories: CategoryResponse[] = res.data ?? []

  return (
    <div>
      <h1>Categories</h1>
      <ul>
        {categories.map((category) => (
          <li key={category.id}>
            <Link href={`/categories/${category.slug}`}>
              {category.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
