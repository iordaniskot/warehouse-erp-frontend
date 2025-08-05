'use client'

import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, Plus, Package, Barcode, Eye, Edit, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { useBreadcrumb } from '@/components/breadcrumb-provider'

interface SKU {
  skuCode: string
  barcode?: string
  attributes: {
    size?: string
    color?: string
    material?: string
    [key: string]: any
  }
  cost: number
  priceList: {
    retail: number
    wholesaleTier1: number
    wholesaleTier2: number
  }
  stockQty: number
  status: 'ACTIVE' | 'ARCHIVED'
  vendors?: Array<{
    name: string
    vendorSKU: string
    leadTimeDays: number
    lastCost: number
    preferred: boolean
    contactInfo: {
      email: string
      phone: string
    }
    notes: string
  }>
}

interface Product {
  _id: string
  name: string
  description?: string
  brand?: string
  skus: SKU[]
  tags: string[]
  isActive: boolean
  createdAt: string
  updatedAt: string
}

interface ProductsResponse {
  success: boolean
  data: Product[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export default function ProductsPage() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const limit = 20
  const router = useRouter()
  const queryClient = useQueryClient()
  const { setBreadcrumbs } = useBreadcrumb()

  // Set breadcrumbs for this page
  useEffect(() => {
    setBreadcrumbs([
      { title: 'Dashboard', href: '/' },
      { title: 'Products', isCurrentPage: true }
    ])
  }, [setBreadcrumbs])

  // Dialog states
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    brand: '',
    tags: [] as string[],
    skus: [{
      skuCode: '',
      barcode: '',
      attributes: {
        size: '',
        color: '',
        material: ''
      },
      cost: 0,
      priceList: {
        retail: 0,
        wholesaleTier1: 0,
        wholesaleTier2: 0
      },
      stockQty: 0,
      status: 'ACTIVE' as 'ACTIVE' | 'ARCHIVED',
      vendors: [{
        name: '',
        vendorSKU: '',
        leadTimeDays: 0,
        lastCost: 0,
        preferred: true,
        contactInfo: {
          email: '',
          phone: ''
        },
        notes: ''
      }]
    }]
  })

  // Simple authentication check
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
    }
  }, [router])

  const { data: productsData, isLoading, error } = useQuery<ProductsResponse>({
    queryKey: ['products', { search, page, limit }],
    queryFn: () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(search && { search })
      })
      return api.get(`/products?${params}`)
    }
  })

  // Mutations
  const createProductMutation = useMutation({
    mutationFn: (productData: any) => api.post('/products', productData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      setIsAddDialogOpen(false)
      resetForm()
      toast.success('Product created successfully')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create product')
    }
  })

  const updateProductMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => api.put(`/products/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      setIsEditDialogOpen(false)
      resetForm()
      toast.success('Product updated successfully')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update product')
    }
  })

  const deleteProductMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/products/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      toast.success('Product deleted successfully')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete product')
    }
  })

  // Helper functions
  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      brand: '',
      tags: [],
      skus: [{
        skuCode: '',
        barcode: '',
        attributes: {
          size: '',
          color: '',
          material: ''
        },
        cost: 0,
        priceList: {
          retail: 0,
          wholesaleTier1: 0,
          wholesaleTier2: 0
        },
        stockQty: 0,
        status: 'ACTIVE' as 'ACTIVE' | 'ARCHIVED',
        vendors: [{
          name: '',
          vendorSKU: '',
          leadTimeDays: 0,
          lastCost: 0,
          preferred: true,
          contactInfo: {
            email: '',
            phone: ''
          },
          notes: ''
        }]
      }]
    })
    setSelectedProduct(null)
  }

  const handleAddProduct = () => {
    resetForm()
    setIsAddDialogOpen(true)
  }

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product)
    setFormData({
      name: product.name,
      description: product.description || '',
      brand: product.brand || '',
      tags: product.tags || [],
      skus: product.skus.map(sku => ({
        skuCode: sku.skuCode,
        barcode: sku.barcode || '',
        attributes: {
          size: sku.attributes?.size || '',
          color: sku.attributes?.color || '',
          material: sku.attributes?.material || ''
        },
        cost: sku.cost,
        priceList: sku.priceList,
        stockQty: sku.stockQty,
        status: sku.status,
        vendors: sku.vendors || [{
          name: '',
          vendorSKU: '',
          leadTimeDays: 0,
          lastCost: 0,
          preferred: true,
          contactInfo: {
            email: '',
            phone: ''
          },
          notes: ''
        }]
      }))
    })
    setIsEditDialogOpen(true)
  }

  const handleViewProduct = (product: Product) => {
    setSelectedProduct(product)
    setIsViewDialogOpen(true)
  }

  const handleDeleteProduct = (product: Product) => {
    if (window.confirm(`Are you sure you want to delete "${product.name}"?`)) {
      deleteProductMutation.mutate(product._id)
    }
  }

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (selectedProduct) {
      // Update existing product
      updateProductMutation.mutate({
        id: selectedProduct._id,
        data: formData
      })
    } else {
      // Create new product
      createProductMutation.mutate(formData)
    }
  }

  const addNewSKU = () => {
    setFormData(prev => ({
      ...prev,
      skus: [...prev.skus, {
        skuCode: '',
        barcode: '',
        attributes: {
          size: '',
          color: '',
          material: ''
        },
        cost: 0,
        priceList: {
          retail: 0,
          wholesaleTier1: 0,
          wholesaleTier2: 0
        },
        stockQty: 0,
        status: 'ACTIVE' as 'ACTIVE' | 'ARCHIVED',
        vendors: [{
          name: '',
          vendorSKU: '',
          leadTimeDays: 0,
          lastCost: 0,
          preferred: true,
          contactInfo: {
            email: '',
            phone: ''
          },
          notes: ''
        }]
      }]
    }))
  }

  const removeSKU = (skuIndex: number) => {
    setFormData(prev => ({
      ...prev,
      skus: prev.skus.filter((_, index) => index !== skuIndex)
    }))
  }

  const updateSKU = (skuIndex: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      skus: prev.skus.map((sku, index) => 
        index === skuIndex 
          ? { ...sku, [field]: value }
          : sku
      )
    }))
  }

  const updateSKUAttribute = (skuIndex: number, attribute: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      skus: prev.skus.map((sku, index) => 
        index === skuIndex 
          ? { ...sku, attributes: { ...sku.attributes, [attribute]: value } }
          : sku
      )
    }))
  }

  const updateSKUPrice = (skuIndex: number, priceType: string, value: number) => {
    setFormData(prev => ({
      ...prev,
      skus: prev.skus.map((sku, index) => 
        index === skuIndex 
          ? { ...sku, priceList: { ...sku.priceList, [priceType]: value } }
          : sku
      )
    }))
  }

  const addVendorToSKU = (skuIndex: number) => {
    setFormData(prev => ({
      ...prev,
      skus: prev.skus.map((sku, index) => 
        index === skuIndex 
          ? { 
              ...sku, 
              vendors: [...sku.vendors, {
                name: '',
                vendorSKU: '',
                leadTimeDays: 0,
                lastCost: 0,
                preferred: false,
                contactInfo: {
                  email: '',
                  phone: ''
                },
                notes: ''
              }]
            }
          : sku
      )
    }))
  }

  const removeVendorFromSKU = (skuIndex: number, vendorIndex: number) => {
    setFormData(prev => ({
      ...prev,
      skus: prev.skus.map((sku, index) => 
        index === skuIndex 
          ? { ...sku, vendors: sku.vendors.filter((_, vIndex) => vIndex !== vendorIndex) }
          : sku
      )
    }))
  }

  const updateSKUVendor = (skuIndex: number, vendorIndex: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      skus: prev.skus.map((sku, index) => 
        index === skuIndex 
          ? { 
              ...sku, 
              vendors: sku.vendors.map((vendor, vIndex) => 
                vIndex === vendorIndex 
                  ? { ...vendor, [field]: value }
                  : vendor
              )
            }
          : sku
      )
    }))
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setPage(1) // Reset to first page when searching
  }

  if (error) {
    return (
      <div className="container mx-auto p-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-red-600">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Failed to load products. Please try again later.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-auto">
      <div className="container mx-auto p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Product Management</h1>
          <p className="text-muted-foreground">
            Manage your product catalog and inventory
          </p>
        </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <form onSubmit={handleSearch} className="flex gap-2 flex-1">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search products by name, SKU, or barcode..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button type="submit" variant="outline">
            Search
          </Button>
        </form>
        <Button onClick={handleAddProduct}>
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Products
          </CardTitle>
          <CardDescription>
            {productsData?.meta.total || 0} products found
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading products...</p>
              </div>
            </div>
          ) : productsData?.data.length === 0 ? (
            <div className="text-center py-8">
              <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No products found</h3>
              <p className="text-muted-foreground mb-4">
                {search ? 'Try adjusting your search terms' : 'Get started by adding your first product'}
              </p>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>SKUs</TableHead>
                    <TableHead>Brand</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {productsData?.data.map((product) => (
                    <TableRow key={product._id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{product.name}</div>
                          {product.description && (
                            <div className="text-sm text-muted-foreground line-clamp-1">
                              {product.description}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {product.skus.slice(0, 2).map((sku) => (
                            <div key={sku.skuCode} className="flex items-center gap-2 text-sm">
                              <code className="bg-muted px-1 py-0.5 rounded text-xs">
                                {sku.skuCode}
                              </code>
                              {sku.barcode && (
                                <Barcode className="h-3 w-3 text-muted-foreground" />
                              )}
                            </div>
                          ))}
                          {product.skus.length > 2 && (
                            <div className="text-xs text-muted-foreground">
                              +{product.skus.length - 2} more
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {product.brand && (
                          <Badge variant="outline">{product.brand}</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {product.skus.reduce((total, sku) => total + sku.stockQty, 0)} units
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={product.isActive ? 'default' : 'secondary'}>
                          {product.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleViewProduct(product)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleEditProduct(product)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDeleteProduct(product)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              {productsData && productsData.meta.totalPages > 1 && (
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Showing {(page - 1) * limit + 1} to{' '}
                    {Math.min(page * limit, productsData.meta.total)} of{' '}
                    {productsData.meta.total} products
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(page - 1)}
                      disabled={page === 1}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(page + 1)}
                      disabled={page >= productsData.meta.totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Product Dialog */}
      <Dialog open={isAddDialogOpen || isEditDialogOpen} onOpenChange={(open) => {
        if (!open) {
          setIsAddDialogOpen(false)
          setIsEditDialogOpen(false)
          resetForm()
        }
      }}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedProduct ? 'Edit Product' : 'Add New Product'}
            </DialogTitle>
            <DialogDescription>
              {selectedProduct 
                ? 'Update the product information and SKUs below.' 
                : 'Create a new product with its SKUs and vendor information.'
              }
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitForm}>
            <div className="space-y-6">
              {/* Basic Product Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Basic Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Product Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="brand">Brand</Label>
                    <Input
                      id="brand"
                      value={formData.brand}
                      onChange={(e) => setFormData(prev => ({ ...prev, brand: e.target.value }))}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>
              </div>

              {/* SKUs Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">SKUs</h3>
                  <Button type="button" variant="outline" size="sm" onClick={addNewSKU}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add SKU
                  </Button>
                </div>
                
                {formData.skus.map((sku, skuIndex) => (
                  <div key={skuIndex} className="border rounded-lg p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">SKU {skuIndex + 1}</h4>
                      {formData.skus.length > 1 && (
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm" 
                          onClick={() => removeSKU(skuIndex)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    
                    {/* SKU Basic Info */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>SKU Code *</Label>
                        <Input
                          value={sku.skuCode}
                          onChange={(e) => updateSKU(skuIndex, 'skuCode', e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label>Barcode</Label>
                        <Input
                          value={sku.barcode}
                          onChange={(e) => updateSKU(skuIndex, 'barcode', e.target.value)}
                        />
                      </div>
                    </div>

                    {/* Attributes */}
                    <div>
                      <Label className="text-sm font-medium">Attributes</Label>
                      <div className="grid grid-cols-3 gap-4 mt-2">
                        <div>
                          <Label className="text-xs">Size</Label>
                          <Input
                            value={sku.attributes.size}
                            onChange={(e) => updateSKUAttribute(skuIndex, 'size', e.target.value)}
                            placeholder="e.g., XL, 42, 500ml"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Color</Label>
                          <Input
                            value={sku.attributes.color}
                            onChange={(e) => updateSKUAttribute(skuIndex, 'color', e.target.value)}
                            placeholder="e.g., Red, Blue"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Material</Label>
                          <Input
                            value={sku.attributes.material}
                            onChange={(e) => updateSKUAttribute(skuIndex, 'material', e.target.value)}
                            placeholder="e.g., Cotton, Plastic"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Pricing and Stock */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Cost ($)</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={sku.cost}
                          onChange={(e) => updateSKU(skuIndex, 'cost', parseFloat(e.target.value) || 0)}
                        />
                      </div>
                      <div>
                        <Label>Stock Quantity</Label>
                        <Input
                          type="number"
                          value={sku.stockQty}
                          onChange={(e) => updateSKU(skuIndex, 'stockQty', parseInt(e.target.value) || 0)}
                        />
                      </div>
                    </div>

                    {/* Price List */}
                    <div>
                      <Label className="text-sm font-medium">Price List ($)</Label>
                      <div className="grid grid-cols-3 gap-4 mt-2">
                        <div>
                          <Label className="text-xs">Retail</Label>
                          <Input
                            type="number"
                            step="0.01"
                            value={sku.priceList.retail}
                            onChange={(e) => updateSKUPrice(skuIndex, 'retail', parseFloat(e.target.value) || 0)}
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Wholesale Tier 1</Label>
                          <Input
                            type="number"
                            step="0.01"
                            value={sku.priceList.wholesaleTier1}
                            onChange={(e) => updateSKUPrice(skuIndex, 'wholesaleTier1', parseFloat(e.target.value) || 0)}
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Wholesale Tier 2</Label>
                          <Input
                            type="number"
                            step="0.01"
                            value={sku.priceList.wholesaleTier2}
                            onChange={(e) => updateSKUPrice(skuIndex, 'wholesaleTier2', parseFloat(e.target.value) || 0)}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Status */}
                    <div>
                      <Label>Status</Label>
                      <Select 
                        value={sku.status} 
                        onValueChange={(value: 'ACTIVE' | 'ARCHIVED') => updateSKU(skuIndex, 'status', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ACTIVE">Active</SelectItem>
                          <SelectItem value="ARCHIVED">Archived</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Vendors */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-medium">Vendors</Label>
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm" 
                          onClick={() => addVendorToSKU(skuIndex)}
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          Add Vendor
                        </Button>
                      </div>
                      
                      {sku.vendors.map((vendor, vendorIndex) => (
                        <div key={vendorIndex} className="border rounded p-3 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Vendor {vendorIndex + 1}</span>
                            {sku.vendors.length > 1 && (
                              <Button 
                                type="button" 
                                variant="outline" 
                                size="sm" 
                                onClick={() => removeVendorFromSKU(skuIndex, vendorIndex)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            )}
                          </div>
                          
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <Label className="text-xs">Vendor Name *</Label>
                              <Input
                                value={vendor.name}
                                onChange={(e) => updateSKUVendor(skuIndex, vendorIndex, 'name', e.target.value)}
                                required
                              />
                            </div>
                            <div>
                              <Label className="text-xs">Vendor SKU</Label>
                              <Input
                                value={vendor.vendorSKU}
                                onChange={(e) => updateSKUVendor(skuIndex, vendorIndex, 'vendorSKU', e.target.value)}
                              />
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-3 gap-3">
                            <div>
                              <Label className="text-xs">Lead Time (days)</Label>
                              <Input
                                type="number"
                                value={vendor.leadTimeDays}
                                onChange={(e) => updateSKUVendor(skuIndex, vendorIndex, 'leadTimeDays', parseInt(e.target.value) || 0)}
                              />
                            </div>
                            <div>
                              <Label className="text-xs">Last Cost ($)</Label>
                              <Input
                                type="number"
                                step="0.01"
                                value={vendor.lastCost}
                                onChange={(e) => updateSKUVendor(skuIndex, vendorIndex, 'lastCost', parseFloat(e.target.value) || 0)}
                              />
                            </div>
                            <div className="flex items-center space-x-2 pt-6">
                              <input
                                type="checkbox"
                                id={`preferred-${skuIndex}-${vendorIndex}`}
                                checked={vendor.preferred}
                                onChange={(e) => updateSKUVendor(skuIndex, vendorIndex, 'preferred', e.target.checked)}
                              />
                              <Label htmlFor={`preferred-${skuIndex}-${vendorIndex}`} className="text-xs">
                                Preferred
                              </Label>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <Label className="text-xs">Email</Label>
                              <Input
                                type="email"
                                value={vendor.contactInfo.email}
                                onChange={(e) => updateSKUVendor(skuIndex, vendorIndex, 'contactInfo', {
                                  ...vendor.contactInfo,
                                  email: e.target.value
                                })}
                              />
                            </div>
                            <div>
                              <Label className="text-xs">Phone</Label>
                              <Input
                                value={vendor.contactInfo.phone}
                                onChange={(e) => updateSKUVendor(skuIndex, vendorIndex, 'contactInfo', {
                                  ...vendor.contactInfo,
                                  phone: e.target.value
                                })}
                              />
                            </div>
                          </div>
                          
                          <div>
                            <Label className="text-xs">Notes</Label>
                            <Input
                              value={vendor.notes}
                              onChange={(e) => updateSKUVendor(skuIndex, vendorIndex, 'notes', e.target.value)}
                              placeholder="Additional vendor notes"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={() => {
                setIsAddDialogOpen(false)
                setIsEditDialogOpen(false)
                resetForm()
              }}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={createProductMutation.isPending || updateProductMutation.isPending}
              >
                {createProductMutation.isPending || updateProductMutation.isPending 
                  ? 'Saving...' 
                  : (selectedProduct ? 'Update Product' : 'Create Product')
                }
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* View Product Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Product Details</DialogTitle>
            <DialogDescription>
              View detailed information about this product.
            </DialogDescription>
          </DialogHeader>
          {selectedProduct && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right font-medium">Name:</Label>
                <div className="col-span-3">{selectedProduct.name}</div>
              </div>
              {selectedProduct.description && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right font-medium">Description:</Label>
                  <div className="col-span-3">{selectedProduct.description}</div>
                </div>
              )}
              {selectedProduct.brand && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right font-medium">Brand:</Label>
                  <div className="col-span-3">
                    <Badge variant="outline">{selectedProduct.brand}</Badge>
                  </div>
                </div>
              )}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right font-medium">Status:</Label>
                <div className="col-span-3">
                  <Badge variant={selectedProduct.isActive ? 'default' : 'secondary'}>
                    {selectedProduct.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right font-medium">SKUs:</Label>
                <div className="col-span-3 space-y-2">
                  {selectedProduct.skus.map((sku) => (
                    <div key={sku.skuCode} className="p-2 border rounded">
                      <div className="flex items-center gap-2 mb-1">
                        <code className="bg-muted px-1 py-0.5 rounded text-xs">
                          {sku.skuCode}
                        </code>
                        {sku.barcode && (
                          <code className="bg-muted px-1 py-0.5 rounded text-xs">
                            {sku.barcode}
                          </code>
                        )}
                        <Badge variant={sku.status === 'ACTIVE' ? 'default' : 'secondary'}>
                          {sku.status}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Stock: {sku.stockQty} units | Cost: ${sku.cost} | Retail: ${sku.priceList.retail}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Close
            </Button>
            {selectedProduct && (
              <Button onClick={() => {
                setIsViewDialogOpen(false)
                handleEditProduct(selectedProduct)
              }}>
                Edit Product
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
      </div>
    </div>
  )
}
