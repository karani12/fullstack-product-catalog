import { getProducts, getProduct, ProductResponse } from "@/app/lib/api/products"
import { notFound } from "next/navigation"
import Link from "next/link"

export const revalidate = 60

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
    <div>
      <Link href="/products">Back to Products</Link>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <p>${product.price}</p>
    </div>
  )
}
