export type ApiResponse<T> = {
  message: string
  data: T
  meta?: PaginationMeta
  links?: Record<string, any>
  errors?: Record<string, any[]>
}

type PaginationLink = {
  url: string | null
  label: string
  page: number | null
  active: boolean
}

export type PaginationMeta = {
  current_page: number
  from: number | null
  last_page: number
  links: PaginationLink[]
  next_page_url: string | null
  prev_page_url: string | null
  path: string
  per_page: number
  to: number | null
  total: number
}
