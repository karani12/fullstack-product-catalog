import { clientFetch } from '@/app/lib/client_fetch'
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
    { revalidate: 60 }
  )
}

export function getFeatured(page = 1) {
  return apiFetch<ApiResponse<ProductResponse[]>>(`/api/v1/products?page=${page}`, {
    cache: 'force-cache',
  })
}

export function getProduct(slug: string) {
  return apiFetch<ApiResponse<ProductResponse>>(`/api/v1/products/${slug}`, { revalidate: 60 })
}

export function createProduct(payload: Partial<InsertProduct>) {
  return apiFetch<ApiResponse<Product>>('/api/v1/products', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

//these are client side functions similar to the ones above,
//because they use client side apis, they are called differently
//otherwise with server side, we would just have one set of functions
//
export function clientGetProducts(page = 1, category?: string | null) {
  return clientFetch<ApiResponse<ProductResponse[]>>(
    `/api/v1/admin/products?page=${page}${category ? `&category=${category}` : ''}`
  )
}

export function clientCreateProduct(payload: Partial<InsertProduct>) {
  return clientFetch<ApiResponse<Product>>('/api/v1/admin/products', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function clientUpdateProduct(slug: string, payload: Partial<InsertProduct>) {
  return clientFetch<ApiResponse<Product>>(`/api/v1/admin/products/${slug}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  })
}

export function clientDeleteProduct(slug: string) {
  return clientFetch<ApiResponse<void>>(`/api/v1/admin/products/${slug}`, {
    method: 'DELETE',
  })
}
