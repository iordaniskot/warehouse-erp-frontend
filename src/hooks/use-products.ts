import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { Product, productSchema } from '@/lib/schemas'

// Product queries
export function useProducts(search?: string, limit = 50) {
  return useQuery({
    queryKey: ['products', { search, limit }],
    queryFn: () => api.get<Product[]>(`/products?search=${search || ''}&limit=${limit}`),
  })
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: ['products', id],
    queryFn: () => api.get<Product>(`/products/${id}`),
    enabled: !!id,
  })
}

// Product mutations
export function useCreateProduct() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: Omit<Product, 'id'>) => {
      const validatedData = productSchema.omit({ id: true }).parse(data)
      return api.post<Product>('/products', validatedData)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })
}

export function useUpdateProduct() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, ...data }: Product & { id: string }) => {
      const validatedData = productSchema.omit({ id: true }).parse(data)
      return api.put<Product>(`/products/${id}`, validatedData)
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      queryClient.invalidateQueries({ queryKey: ['products', id] })
    },
  })
}

export function useDeleteProduct() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id: string) => api.delete(`/products/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })
}
