'use client'
import Table from '@/app/components/ui/table/table'
import ProductModal from '@/app/components/Product'
import { DeleteAction } from '@/app/components/DeleteAction'
import { ConfirmToggleAction } from '@/app/components/ConfirmToggleAction'
import { useProducts } from '@/app/lib/hooks/useProduct'
import { Spinner } from '@/app/components/ui/spinner/Spinner'
import { PencilIcon } from '@heroicons/react/24/outline'
import { Rating } from '@/app/components/ui/rating/Rating'

export default function AdminProductsPage() {
  const { getProducts, togglePublish, deleteProduct } = useProducts()
  const { data: products = [], isLoading, isError } = getProducts

  if (isLoading) return <Spinner />
  if (isError) return <p>Failed to load products</p>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Products</h1>
        <ProductModal />
      </div>
      <div className="space-y-6 min-w-0 overflow-hidden">
        <Table
          data={products}
          keyExtractor={(p) => p.id}
          columns={[
            { key: 'name', label: 'Name', sticky: true },
            { key: 'price', label: 'Price', render: (p) => `$${p.price}` },
            {
              key: 'category',
              label: 'Category',
              render: (p) => p.category?.name ?? '-',
            },
            {
              key: 'stock_qty',
              label: 'Stock',
              render: (p) => p.stock_qty ?? '-',
            },
            {
              key: 'average_rating',
              label: 'Rating',
              render: (r) => <Rating rating={r.average_rating} />,
            },
            {
              key: 'is_published',
              label: 'Status',
              render: (p) => (
                <ConfirmToggleAction
                  value={p.is_published}
                  getTitleAction={(next) => (next ? 'Publish product' : 'Unpublish product')}
                  getDescriptionAction={(next) =>
                    next
                      ? 'This product will be visible to customers.'
                      : 'This product will be hidden from the store.'
                  }
                  getConfirmTextAction={(next) => (next ? 'Publish' : 'Unpublish')}
                  onConfirmAction={(next) => togglePublish.mutate({ slug: p.slug, next })}
                />
              ),
            },
            {
              key: 'actions',
              label: '',
              actions: ({ row }) => (
                <div className="flex gap-2">
                  <ProductModal
                    product={row}
                    trigger={
                      <button>
                        <PencilIcon className="h-4 w-4" />
                      </button>
                    }
                  />
                  <DeleteAction row={row} onDelete={(r) => deleteProduct.mutate(r.slug)} />
                </div>
              ),
            },
          ]}
        />
      </div>
    </div>
  )
}
