"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  FileText,
  FolderKanban,
  MessageSquare,
  Mail,
  Users,
  Settings,
  LogOut,
  Menu,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

interface NavItemProps {
  href: string
  icon: React.ReactNode
  title: string
  isActive: boolean
  onNavigate?: () => void
}

function NavItem({ href, icon, title, isActive, onNavigate }: NavItemProps) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:text-primary",
        isActive ? "bg-muted text-primary font-medium" : "text-muted-foreground",
      )}
    >
      {icon}
      {title}
    </Link>
  )
}

export default function DashboardSidebar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const handleLogout = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`, {
        credentials: "include",
      })

      if (!res.ok) {
        throw new Error("Logout failed")
      }

      toast({
        title: "Logged Out",
        description: "You have been successfully logged out",
      })

      router.push("/dashboard/login")
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to logout",
        variant: "destructive",
      })
    }
  }

  const navItems = [
    {
      href: "/dashboard",
      icon: <LayoutDashboard className="h-4 w-4" />,
      title: "Dashboard",
    },
    {
      href: "/dashboard/blogs",
      icon: <FileText className="h-4 w-4" />,
      title: "Blogs",
    },
    {
      href: "/dashboard/projects",
      icon: <FolderKanban className="h-4 w-4" />,
      title: "Projects",
    },
    {
      href: "/dashboard/comments",
      icon: <MessageSquare className="h-4 w-4" />,
      title: "Comments",
    },
    {
      href: "/dashboard/messages",
      icon: <Mail className="h-4 w-4" />,
      title: "Messages",
    },
    {
      href: "/dashboard/subscribers",
      icon: <Users className="h-4 w-4" />,
      title: "Subscribers",
    },
    {
      href: "/dashboard/settings",
      icon: <Settings className="h-4 w-4" />,
      title: "Settings",
    },
  ]

  // Close mobile sidebar when route changes
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  return (
    <>
      {/* Mobile Sidebar */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild className="lg:hidden">
          <Button variant="outline" size="icon" className="fixed left-4 top-4 z-40">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <div className="flex h-full flex-col">
            <div className="border-b p-4">
              <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-blue-400">
                  RR
                </span>
                <span>Admin Dashboard</span>
              </Link>
            </div>
            <ScrollArea className="flex-1 p-4">
              <nav className="flex flex-col gap-1">
                {navItems.map((item) => (
                  <NavItem
                    key={item.href}
                    href={item.href}
                    icon={item.icon}
                    title={item.title}
                    isActive={pathname === item.href || pathname.startsWith(`${item.href}/`)}
                    onNavigate={() => setOpen(false)}
                  />
                ))}
              </nav>
            </ScrollArea>
            <div className="border-t p-4">
              <Button variant="ghost" className="w-full justify-start text-muted-foreground" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <div className="hidden border-r bg-background lg:block">
        <div className="flex h-full w-64 flex-col">
          <div className="border-b p-4">
            <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-blue-400">
                RR
              </span>
              <span>Admin Dashboard</span>
            </Link>
          </div>
          <ScrollArea className="flex-1 p-4">
            <nav className="flex flex-col gap-1">
              {navItems.map((item) => (
                <NavItem
                  key={item.href}
                  href={item.href}
                  icon={item.icon}
                  title={item.title}
                  isActive={pathname === item.href || pathname.startsWith(`${item.href}/`)}
                />
              ))}
            </nav>
          </ScrollArea>
          <div className="border-t p-4">
            <Button variant="ghost" className="w-full justify-start text-muted-foreground" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
