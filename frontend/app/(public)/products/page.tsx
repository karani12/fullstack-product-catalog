import { getProducts } from "@/app/lib/api/products"
import Link from "next/link"

export const revalidate = 60

export default async function Products() {
  const res = await getProducts(1, null)
  const data = res.data ?? []

  return (
    <div>
      <h1>Products</h1>
      <ul>
        {data.map((product) => (
          <li key={product.id}>
            <Link href={`/products/${product.slug}`}>
              {product.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
