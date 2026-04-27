import {
  clientDeleteProduct,
  clientGetProducts,
  clientUpdateProduct,
  clientCreateProduct,
  ProductResponse,
} from '@/app/lib/api/products'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export function useProducts() {
  const queryClient = useQueryClient()

  const getProducts = useQuery({
    queryKey: ['products'],
    queryFn: () => clientGetProducts().then((res) => res?.data ?? []),
  })

  const togglePublish = useMutation({
    mutationFn: ({ slug, next }: { slug: string; next: boolean }) =>
      clientUpdateProduct(slug, { is_published: next }),
    //this also handles the setting of data for more optimistic updates with instant feedback
    onMutate: async ({ slug, next }) => {
      await queryClient.cancelQueries({ queryKey: ['products'] })
      const previous = queryClient.getQueryData<ProductResponse[]>(['products'])
      queryClient.setQueryData<ProductResponse[]>(['products'], (prev) =>
        prev?.map((product) =>
          product.slug === slug ? { ...product, is_published: next } : product
        )
      )
      return { previous }
    },
    onSuccess: (_, { next }) => {
      toast.success(next ? 'Product published' : 'Product unpublished')
    },
    onError: (_, __, context) => {
      queryClient.setQueryData(['products'], context?.previous)
    },
  })

  const saveProduct = useMutation({
    mutationFn: ({ slug, data }: { slug?: string; data: any }) =>
      slug ? clientUpdateProduct(slug, data) : clientCreateProduct(data),
    onSuccess: (res, { slug }) => {
      //update the data for optimistic updates on success to ensure the layout maintains the same way.
      //otherwise we could invalidate the cache which may cause layout shifts
      queryClient.setQueryData<ProductResponse[]>(['products'], (prev) => {
        if (!prev || !res?.data) return prev
        if (slug) {
          return prev.map((product) => (product.slug === slug ? res.data : product))
        }
        return [res.data, ...prev]
      })
      toast.success(slug ? 'Product updated' : 'Product created')
    },
  })

  const deleteProduct = useMutation({
    mutationFn: (slug: string) => clientDeleteProduct(slug),
    //same to above mutation actions, just removes the product on the ui on success
    onSuccess: (_, slug) => {
      queryClient.setQueryData<ProductResponse[]>(['products'], (prev) =>
        prev?.filter((product) => product.slug !== slug)
      )
      toast.success('Product deleted')
    },
  })

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['products'] })

  return { getProducts, togglePublish, saveProduct, deleteProduct, invalidate }
}
