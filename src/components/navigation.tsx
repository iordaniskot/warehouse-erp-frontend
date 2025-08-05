'use client';

import { useAuth } from '@/auth/auth';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function Navigation() {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <nav className="border-b border-gray-200 bg-white shadow-sm">
      <div className="container mx-auto px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-xl font-bold text-gray-900">
              Warehouse ERP
            </Link>
            {isAuthenticated && (
              <div className="flex space-x-4">
                <Link href="/products" className="text-gray-600 hover:text-gray-900">
                  Products
                </Link>
                <Link href="/warehouses" className="text-gray-600 hover:text-gray-900">
                  Warehouses
                </Link>
                <Link href="/orders" className="text-gray-600 hover:text-gray-900">
                  Orders
                </Link>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <span className="text-sm text-gray-700">
                  {user?.firstName} {user?.lastName}
                </span>
                <Button variant="outline" size="sm" onClick={logout}>
                  Logout
                </Button>
              </>
            ) : (
              <Link href="/login">
                <Button variant="outline" size="sm">
                  Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
