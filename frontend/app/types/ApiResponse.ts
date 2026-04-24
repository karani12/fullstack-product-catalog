export type ApiResponse<T> = {
  message: string
  data: T
  meta?: Record<string, any>
  links?: Record<string, any>
  errors?: Record<string, any[]>
}
