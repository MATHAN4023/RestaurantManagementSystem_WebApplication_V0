"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AdminSidebar } from "@/components/admin-sidebar"
import { useToast } from "@/hooks/use-toast"
import Cookies from 'js-cookie'

interface Admin {
  name: string
  email: string
  role: string
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { toast } = useToast()
  const [admin, setAdmin] = useState<Admin | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = () => {
      try {
        const adminData = localStorage.getItem("adminData")
        const adminToken = Cookies.get("adminToken")

        if (!adminData || !adminToken) {
          toast({
            title: "Authentication required",
            description: "Please log in to access the admin panel",
            variant: "destructive",
          })
          router.push("/")
          return
        }

        setAdmin(JSON.parse(adminData))
      } catch (error) {
        console.error("Auth check error:", error)
        toast({
          title: "Authentication error",
          description: "There was an error verifying your session",
          variant: "destructive",
        })
        router.push("/")
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [router, toast])

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  if (!admin) {
    return null // Will redirect in the useEffect
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <AdminSidebar user={admin} />
      <main className="flex-1 overflow-hidden md:ml-64">
        <div className="h-full overflow-y-auto">
          <div className="container mx-auto px-4 py-4 pt-20 md:pt-0 sm:px-6 sm:py-6">
            {children}
          </div>
        </div>
      </main>
    </div>
  )
}
