'use client'
import { useState } from 'react'
import { Resolver, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import { z } from 'zod'
import { toast } from 'sonner'

import { ProductResponse } from '@/app/lib/api/products'
import { clientGetCategories } from '@/app/lib/api/category'
import { useProducts } from '@/app/lib/hooks/useProduct'

import { Input } from '@/app/components/ui/input/Input'
import { Textarea } from '@/app/components/ui/textarea/TextArea'
import { Select } from '@/app/components/ui/select/Select'
import { Button } from '@/app/components/ui/button/Button'
import { applyServerErrors } from '@/app/lib/form'
import { Dialog } from '@/app/components/ui/dialog/Dialog'
import { DialogContent, DialogFooter, DialogHeader } from '@/app/components/ui/dialog/DialogParts'

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  price: z.string().min(1, 'Price is required'),
  description: z.string().optional(),
  category_id: z.coerce.number().min(1, 'Category is required'),
  stock_qty: z.coerce.number().optional(),
})

export type FormData = z.infer<typeof schema>

interface Props {
  product?: ProductResponse
  trigger?: React.ReactNode
}

export default function ProductModal({ product, trigger }: Props) {
  const [open, setOpen] = useState(false)
  const isEdit = !!product

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: () => clientGetCategories().then((res) => res?.data ?? []),
    enabled: open,
  })

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema) as Resolver<FormData>,
    values: product
      ? {
          name: product.name,
          price: product.price,
          description: product.description ?? '',
          category_id: product.category_id,
          stock_qty: product.stock_qty ?? 0,
        }
      : { name: '', price: '', description: '', category_id: 0, stock_qty: 0 },
  })

  const { mutate, isPending } = useProducts().saveProduct

  function onSubmit(data: FormData) {
    mutate(
      { slug: product?.slug, data },
      {
        onSuccess: () => {
          reset()
          setOpen(false)
        },

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onError: (err: any) => {
          if (err?.status === 422 && err?.response?.errors) {
            applyServerErrors(err.response.errors, setError, Object.keys(schema.shape))
            return
          }
          toast.error(err?.message ?? 'Something went wrong')
        },
      }
    )
  }

  return (
    <>
      <div onClick={() => setOpen(true)}>{trigger ?? <Button>New Product</Button>}</div>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold">{isEdit ? 'Edit Product' : 'New Product'}</h2>
            <button onClick={() => setOpen(false)}>✕</button>
          </div>
        </DialogHeader>

        <DialogContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input label="Name" registration={register('name')} error={errors.name?.message} />
            <Input
              label="Price"
              type="number"
              step="0.01"
              min="0"
              registration={register('price')}
              error={errors.price?.message}
            />
            <Input
              label="Stock Quantity"
              type="number"
              step="0.01"
              min="0"
              registration={register('stock_qty')}
              error={errors.stock_qty?.message}
            />
            <Textarea
              label="Description"
              rows={3}
              registration={register('description')}
              error={errors.description?.message}
            />
            <Select
              label="Category"
              registration={register('category_id', { setValueAs: Number })}
              error={errors.category_id?.message}
              options={categories.map((cat) => ({ label: cat.name, value: cat.id }))}
            />
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" loading={isPending}>
                {isEdit ? 'Update' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
