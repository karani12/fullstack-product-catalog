import ProductCard from '@/app/components/ProductCard'
import { getFeatured } from '@/app/lib/api/products'

export const dynamic = 'force-static'

export default async function Products() {
  const res = await getFeatured(1)
  const data = res.data ?? []

  return (
    <div className="min-h-screen">
      <section className="px-6 pt-24 pb-16 max-w-7xl mx-auto">
        <p className="text-xs tracking-wide uppercase mb-4">New</p>
        <h1 className="text-5xl md:text-7xl font-light leading-none tracking-tight mb-6">
          Featured
          <br />
          <span className="italic">Products</span>
        </h1>
        <div className="w-12 h-px mt-6" />
      </section>

      <section className="">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {data.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  )
}
