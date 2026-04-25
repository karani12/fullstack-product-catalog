import { notFound } from "next/navigation"
import Link from "next/link"
import { CategoryResponse, getCategories, getCategory } from "@/app/lib/api/category"

export const revalidate = 60

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
  } catch {
    notFound()
  }

  return (
    <div>
      <Link href="/categories">Back to Categories</Link>
      <h1>{category.name}</h1>
      {category.products && (
        <ul>
          {category.products.map((product) => (
            <li key={product.id}>
              <Link href={`/products/${product.slug}`}>
                {product.name}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
