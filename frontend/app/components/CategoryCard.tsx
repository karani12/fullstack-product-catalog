import { CategoryResponse } from '@/app/lib/api/category'
import Link from 'next/link'

interface Props {
  category: CategoryResponse
}

export default function CategoryCard({ category }: Props) {
  return (
    <Link href={`/categories/${category.slug}`} className="group block">
      <div className=" border rounded-xl p-5  transition-all duration-200">
        <h3 className="text-xl font-medium  mb-1">{category.name}</h3>

        {category.description && <p className="text-xs line-clamp-2">{category.description}</p>}

        {category.products && (
          <p className="text-xs mt-3 pt-3 border-t">{category.products.length} products</p>
        )}
      </div>
    </Link>
  )
}
