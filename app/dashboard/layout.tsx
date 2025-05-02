"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/hooks/use-toast"
import DashboardSidebar from "@/components/dashboard/dashboard-sidebar"
import DashboardHeader from "@/components/dashboard/dashboard-header"
import { Loader2 } from "lucide-react"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, {
          credentials: "include",
        })

        if (!res.ok) {
          throw new Error("Not authenticated")
        }

        const data = await res.json()
        setUser(data.data)
        setLoading(false)
      } catch (error) {
        toast({
          title: "Authentication Error",
          description: "Please log in to access the dashboard",
          variant: "destructive",
        })
        router.push("/dashboard/login")
      }
    }

    // Skip auth check on login page
    if (pathname === "/dashboard/login") {
      setLoading(false)
      return
    }

    checkAuth()
  }, [pathname, router, toast])

  if (loading && pathname !== "/dashboard/login") {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading dashboard...</span>
      </div>
    )
  }

  // Don't show dashboard layout on login page
  if (pathname === "/dashboard/login") {
    return (
      <>
        {children}
        <Toaster />
      </>
    )
  }

  return (
    <div className="flex min-h-screen bg-muted/30">
      <DashboardSidebar />
      <div className="flex flex-1 flex-col">
        <DashboardHeader user={user} />
        <main className="flex-1 p-6">{children}</main>
      </div>
      <Toaster />
    </div>
  )
}
