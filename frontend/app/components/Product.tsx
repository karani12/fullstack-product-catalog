import { useQuery } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useState } from 'react'

import { ProductResponse } from '@/app/lib/api/products'
import { clientGetCategories } from '@/app/lib/api/category'

import { Input } from '@/app/components/ui/input/Input'
import { Textarea } from '@/app/components/ui/textarea/TextArea'
import { Select } from '@/app/components/ui/select/Select'
import { Button } from '@/app/components/ui/button/Button'
import { Dialog } from '@/app/components/ui/dialog/Dialog'
import { DialogHeader, DialogContent, DialogFooter } from '@/app/components/ui/dialog/DialogParts'
import { useProducts } from '@/app/lib/hooks/useProduct'
import { toast } from 'sonner'

const productSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  price: z.string().min(1, 'Price is required'),
  description: z.string().nullable(),
  category_id: z.number('Category is required'),
  stock_qty: z.coerce.number().nullable(),
})

type ProductFormData = z.infer<typeof productSchema>

interface Props {
  product?: ProductResponse
  onSaved?: () => void
  trigger?: React.ReactNode
}

export default function ProductModal({ product, onSaved, trigger }: Props) {
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
  } = useForm<ProductFormData>({
    //@ts-ignore
    resolver: zodResolver(productSchema),
    values: product
      ? {
          name: product.name,
          price: product.price,
          description: product.description ?? '',
          category_id: product.category_id,
          stock_qty: product.stock_qty ?? '',
        }
      : { name: '', price: '', description: '', category_id: 0, stock_qty: 0 },
  })

  const { saveProduct } = useProducts()

  const { mutate, isPending } = saveProduct
  function onSubmit(data: ProductFormData) {
    mutate(
      { slug: product?.slug, data },
      {
        onSuccess: () => {
          reset()
          setOpen(false)
          onSaved?.()
        },
        //@ts-ignore
        onError: (err: any) => {
          if (err?.status === 422 && err?.response?.errors) {
            Object.entries(err.response.errors).forEach(([field, messages]) => {
              if (field in productSchema.shape) {
                setError(field as keyof ProductFormData, {
                  type: 'server',
                  //@ts-ignore
                  message: messages[0],
                })
              }
            })
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
