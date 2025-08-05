import { z } from 'zod'

// Product schemas
export const productSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Product name is required'),
  description: z.string().optional(),
  categoryId: z.string().optional(),
  brand: z.string().optional(),
  barcode: z.string().optional(),
  price: z.number().min(0, 'Price must be positive').optional(),
  skus: z.array(z.object({
    skuCode: z.string().min(1, 'SKU code is required'),
    barcode: z.string().optional(),
    attributes: z.record(z.string(), z.string()).optional(),
    cost: z.number().min(0, 'Cost must be positive'),
    priceList: z.object({
      retail: z.number().min(0),
      wholesaleTier1: z.number().min(0),
      wholesaleTier2: z.number().min(0),
    }),
    stockQty: z.number().min(0, 'Stock quantity must be positive'),
    status: z.enum(['ACTIVE', 'ARCHIVED']).default('ACTIVE'),
  })).default([]),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
})

// Order schemas
export const orderSchema = z.object({
  id: z.string().optional(),
  customerId: z.string().optional(),
  lines: z.array(z.object({
    skuCode: z.string(),
    qty: z.number().min(1),
    price: z.number().min(0),
  })),
  status: z.enum(['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED']),
  totals: z.object({
    subtotal: z.number(),
    tax: z.number(),
    total: z.number(),
  }),
  channel: z.enum(['POS', 'B2B']),
  createdAt: z.date().optional(),
})

// User schemas
export const userSchema = z.object({
  id: z.string().optional(),
  email: z.string().email('Invalid email address'),
  name: z.string().min(1, 'Name is required'),
  roles: z.array(z.string()).default([]),
  lastLogin: z.date().optional(),
})

// Auth schemas
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().min(1, 'Name is required'),
})

// Stock movement schemas
export const stockMovementSchema = z.object({
  productId: z.string(),
  skuCode: z.string(),
  qty: z.number(),
  type: z.enum(['IN', 'OUT', 'ADJ']),
  warehouseId: z.string(),
  refType: z.string().optional(),
  refId: z.string().optional(),
  timestamp: z.date().optional(),
})

export type Product = z.infer<typeof productSchema>
export type Order = z.infer<typeof orderSchema>
export type User = z.infer<typeof userSchema>
export type LoginData = z.infer<typeof loginSchema>
export type RegisterData = z.infer<typeof registerSchema>
export type StockMovement = z.infer<typeof stockMovementSchema>
