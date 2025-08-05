"use client"

import React, { createContext, useContext, useState, ReactNode } from 'react'

interface Breadcrumb {
  title: string
  href?: string
  isCurrentPage?: boolean
}

interface BreadcrumbContextType {
  breadcrumbs: Breadcrumb[]
  setBreadcrumbs: (breadcrumbs: Breadcrumb[]) => void
}

const BreadcrumbContext = createContext<BreadcrumbContextType | undefined>(undefined)

export function BreadcrumbProvider({ children }: { children: ReactNode }) {
  const [breadcrumbs, setBreadcrumbs] = useState<Breadcrumb[]>([])

  return (
    <BreadcrumbContext.Provider value={{ breadcrumbs, setBreadcrumbs }}>
      {children}
    </BreadcrumbContext.Provider>
  )
}

export function useBreadcrumb() {
  const context = useContext(BreadcrumbContext)
  if (context === undefined) {
    throw new Error('useBreadcrumb must be used within a BreadcrumbProvider')
  }
  return context
}
