'use client'

import { useState } from 'react'
import { Button } from '@/app/components/ui/button/Button'
import { ConfirmDialog } from '@/app/components/ui/dialog/confirm-dialog/ConfirmDialog'
import { TrashIcon } from '@heroicons/react/24/outline'

type Props<T> = {
  row: T
  onDelete: (row: T) => Promise<void> | void
}

export function DeleteAction<T>({ row, onDelete }: Props<T>) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleConfirm() {
    setLoading(true)
    await onDelete(row)
    setLoading(false)
    setOpen(false)
  }

  return (
    <>
      <Button variant="ghost" size="sm" onClick={() => setOpen(true)}>
        <TrashIcon className="h-4 w-4 text-destructive" />
      </Button>

      <ConfirmDialog
        open={open}
        onCancel={() => setOpen(false)}
        onConfirm={handleConfirm}
        loading={loading}
        title="Delete item"
        description="This action cannot be undone."
        confirmText="Delete"
      />
    </>
  )
}
