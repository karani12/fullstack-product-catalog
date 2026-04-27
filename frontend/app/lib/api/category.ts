import { apiFetch } from '@/app/lib/utils'
import { ApiResponse } from '@/app/types/ApiResponse'
import { Category } from '@/src/db/schema'
import { ProductResponse } from '@/app/lib/api/products'
import { clientFetch } from '@/app/lib/client_fetch'

export type CategoryResponse = Category & {
  products?: ProductResponse[]
}

export function getCategories() {
  return apiFetch<ApiResponse<CategoryResponse[]>>('/api/v1/categories', {})
}

export function getCategory(slug: string) {
  return apiFetch<ApiResponse<CategoryResponse>>(`/api/v1/categories/${slug}`, { revalidate: 300 })
}

export function deleteCategory(slug: string) {
  return apiFetch<ApiResponse<null>>(`/api/v1/categories/${slug}`, {
    method: 'DELETE',
  })
}
//fetching client side API since I need to access cookie using browser api hence the need for two client
export function clientGetCategories() {
  return clientFetch<ApiResponse<CategoryResponse[]>>('/api/v1/categories')
}
