"use client"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { useBreadcrumb } from "@/components/breadcrumb-provider"

export function SiteHeader() {
  const { breadcrumbs } = useBreadcrumb()

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator
        orientation="vertical"
        className="mr-2 data-[orientation=vertical]:h-4"
      />
      <Breadcrumb>
        <BreadcrumbList>
          {breadcrumbs.map((breadcrumb, index) => (
            <div key={index} className="flex items-center">
              {index > 0 && (
                <BreadcrumbSeparator className="mx-2" />
              )}
              <BreadcrumbItem>
                {breadcrumb.isCurrentPage ? (
                  <BreadcrumbPage>{breadcrumb.title}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={breadcrumb.href || "#"}>
                    {breadcrumb.title}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </div>
          ))}
          {breadcrumbs.length === 0 && (
            <BreadcrumbItem>
              <BreadcrumbPage>Dashboard</BreadcrumbPage>
            </BreadcrumbItem>
          )}
        </BreadcrumbList>
      </Breadcrumb>
    </header>
  )
}
