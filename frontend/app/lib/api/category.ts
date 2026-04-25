import { apiFetch } from '@/app/lib/utils'
import { ApiResponse } from '@/app/types/ApiResponse'
import { Category } from '@/src/db/schema'
import { ProductResponse } from '@/app/lib/api/products'

export type CategoryResponse = Category & {
  products?: ProductResponse[]
}

export function getCategories() {
  return apiFetch<ApiResponse<CategoryResponse[]>>('/api/v1/categories', {})
}

export function getCategory(slug: string) {
  return apiFetch<ApiResponse<CategoryResponse>>(`/api/v1/categories/${slug}`)
}

export function deleteCategory(slug: string) {
  return apiFetch<ApiResponse<null>>(`/api/v1/categories/${slug}`, {
    method: 'DELETE',
  })
}
