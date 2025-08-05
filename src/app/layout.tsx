import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { BreadcrumbProvider } from "@/components/breadcrumb-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Warehouse ERP System",
  description: "Unified Retail & Wholesale Warehouse Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <BreadcrumbProvider>
            <SidebarProvider>
              <AppSidebar />
              <SidebarInset>
                <SiteHeader />
                <main className="h-full flex flex-col overflow-hidden">
                  {children}
                </main>
              </SidebarInset>
            </SidebarProvider>
          </BreadcrumbProvider>
        </Providers>
      </body>
    </html>
  );
}
