import { apiFetch } from '@/app/lib/utils'
import { ApiResponse } from '@/app/types/ApiResponse'
import { Category, InsertProduct, Product, Review } from '@/src/db/schema'

export type ProductResponse = Product & {
  category?: Category
  reviews?: Review[]
}


export function getProducts(page = 1, category?: string | null) {
  return apiFetch<ApiResponse<ProductResponse[]>>(
    `/api/v1/products?page=${page}${category ? `&category=${category}` : ''}`,
    {}
  )
}

export function getProduct(slug: string) {
  return apiFetch<ApiResponse<ProductResponse>>(
    `/api/v1/products/${slug}`
  )
}

export function createProduct(payload: Partial<InsertProduct>) {
  return apiFetch<ApiResponse<Product>>('/api/v1/products', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}
