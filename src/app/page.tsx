'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useBreadcrumb } from '@/components/breadcrumb-provider'

export default function Home() {
  const { setBreadcrumbs } = useBreadcrumb()

  // Set breadcrumbs for this page
  useEffect(() => {
    setBreadcrumbs([
      { title: 'Dashboard', isCurrentPage: true }
    ])
  }, [setBreadcrumbs])

  return (
    <div className="flex-1 overflow-auto">
      <div className="container mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Warehouse ERP System</h1>
        <p className="text-muted-foreground">
          Unified Retail & Wholesale Warehouse Management System
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Products</CardTitle>
            <CardDescription>
              Manage your product catalog and inventory
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/products">
              <Button className="w-full">View Products</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Orders</CardTitle>
            <CardDescription>
              Track and manage all orders
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">View Orders</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Point of Sale</CardTitle>
            <CardDescription>
              Process retail transactions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">Open POS</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Inventory</CardTitle>
            <CardDescription>
              Monitor stock levels and movements
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">View Inventory</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Reports</CardTitle>
            <CardDescription>
              Analyze sales and inventory data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">View Reports</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Settings</CardTitle>
            <CardDescription>
              Configure system preferences
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">Open Settings</Button>
          </CardContent>
        </Card>
      </div>
      </div>
    </div>
  )
}
