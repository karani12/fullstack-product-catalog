'use client'

import { useSearchParams, usePathname, useRouter } from 'next/navigation'
import { Select } from '@/app/components/ui/select/Select'
import { CategoryResponse } from '@/app/lib/api/category'

export default function CategoryFilter({ categories }: { categories: CategoryResponse[] }) {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace } = useRouter()

  function handleChange(slug: string) {
    const params = new URLSearchParams(searchParams)
    if (slug) {
      params.set('category', slug)
    } else {
      params.delete('category')
    }
    replace(`${pathname}?${params.toString()}`)
  }

  return (
    <Select
      value={searchParams.get('category') ?? ''}
      onChange={(e) => handleChange(e.target.value)}
      options={[
        { label: 'All categories', value: '' },
        ...categories.map((cat) => ({ label: cat.name, value: cat.slug })),
      ]}
    />
  )
}
