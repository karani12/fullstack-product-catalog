'use client'

import { Button } from '@/app/components/ui/button/Button'
import { PaginationMeta } from '@/app/types/ApiResponse'
import { useSearchParams, usePathname, useRouter } from 'next/navigation'

export default function Pagination({ meta }: { meta: PaginationMeta }) {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace } = useRouter()

  console.log(meta)

  function goTo(page: number) {
    const params = new URLSearchParams(searchParams)
    params.set('page', String(page))
    replace(`${pathname}?${params.toString()}`)
  }

  const hasPrev = meta.current_page > 1
  const hasNext = meta.current_page < meta.last_page

  return (
    <div className="flex items-center gap-2">
      <Button size="sm" onClick={() => goTo(meta.current_page - 1)} disabled={!hasPrev}>
        Previous
      </Button>

      <Button size="sm" onClick={() => goTo(meta.current_page + 1)} disabled={!hasNext}>
        Next
      </Button>
    </div>
  )
}
