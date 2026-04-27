'use client'

import { useState } from 'react'
import { Switch } from '@/app/components/ui/switch/Switch'
import { ConfirmDialog } from '@/app/components/ui/dialog/confirm-dialog/ConfirmDialog'

type Props = {
  value: boolean
  onConfirmAction: (next: boolean) => Promise<void> | void
  getTitleAction?: (next: boolean) => string
  getDescriptionAction?: (next: boolean) => string
  getConfirmTextAction?: (next: boolean) => string
}

export function ConfirmToggleAction({
  value,
  onConfirmAction,
  getTitleAction,
  getDescriptionAction,
  getConfirmTextAction,
}: Props) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [next, setNext] = useState<boolean>(!!value)

  function handleToggle(v: boolean) {
    setNext(v)
    setOpen(true)
  }

  async function handleConfirm() {
    setLoading(true)
    try {
      await onConfirmAction(next)
    } finally {
      setLoading(false)
      setOpen(false)
    }
  }

  const title = getTitleAction?.(next) ?? (next ? 'Enable' : 'Disable')
  const description =
    getDescriptionAction?.(next) ?? `Are you sure you want to ${next ? 'enable' : 'disable'} this?`
  const confirmText = getConfirmTextAction?.(next) ?? 'Confirm'

  return (
    <>
      <Switch checked={value} onChange={handleToggle} />

      <ConfirmDialog
        open={open}
        onCancel={() => setOpen(false)}
        onConfirm={handleConfirm}
        loading={loading}
        title={title}
        description={description}
        confirmText={confirmText}
      />
    </>
  )
}
