"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Menu, X, Calendar, Users, LogOut } from "lucide-react"
import Cookies from 'js-cookie'
import { useToast } from "@/hooks/use-toast"

interface AdminSidebarProps {
  user: {
    name: string
    email: string
    role: string
  }
}

export function AdminSidebar({ user }: AdminSidebarProps) {
  const pathname = usePathname()
  const { toast } = useToast()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navItems = [
    {
      title: "Reservations",
      href: "/dashboard/reservations",
      icon: Calendar,
    },
    {
      title: "Customers",
      href: "/dashboard/customers",
      icon: Users,
    },
  ]

  const handleLogout = () => {
    try {
      // Clear all authentication data
      localStorage.removeItem("adminToken")
      localStorage.removeItem("adminData")
      Cookies.remove("adminToken", { path: '/' })

      // Show success message
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account",
      })

      // Force a hard navigation to login page
      window.location.href = "/"
    } catch (error) {
      console.error("Logout error:", error)
      toast({
        title: "Logout failed",
        description: "There was an error logging out. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 transform bg-background transition-transform duration-200 ease-in-out md:translate-x-0",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full",
          "border-r"
        )}
      >
        <div className="flex h-full flex-col">
          {/* User Profile Section */}
          <div className="border-b p-4">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src="/placeholder.svg?height=32&width=32" alt={user.name} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="font-medium">{user.name}</span>
                <span className="text-sm text-muted-foreground">{user.email}</span>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <ScrollArea className="flex-1 px-3 py-4">
            <nav className="space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    pathname === item.href
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.title}
                </Link>
              ))}
            </nav>
          </ScrollArea>

          {/* Logout Button */}
          <div className="border-t p-4">
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 text-red-600 hover:bg-red-50 hover:text-red-600"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  )
}
