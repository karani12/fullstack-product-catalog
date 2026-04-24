import { getProducts } from "@/app/lib/api/products"

export default async function Products() {
  const res = await getProducts(1)

  const data = res.data ?? []
  console.log(res)

  return (
    <div>
      <h1>Products</h1>

      <ul>
        {data.map((product) => (
          <li key={product.id}>
            {product.name}
          </li>
        ))}
      </ul>
    </div>
  )
}
