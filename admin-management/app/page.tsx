"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { LoginForm } from "@/components/login-form"

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // Check if user is already authenticated
    const token = localStorage.getItem("adminToken")
    if (token) {
      router.push("/dashboard")
    }
  }, [router])

  return (
    <div className="min-h-screen w-full bg-gray-50">
      <div className="container mx-auto flex min-h-screen flex-col items-center justify-center px-4 py-8 sm:px-6 sm:py-12">
        <div className="w-full max-w-[400px] space-y-8 rounded-lg bg-white p-6 shadow-sm sm:p-8">
          <div className="space-y-3 text-center">
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Oasis Admin</h1>
            <p className="text-sm text-gray-600 sm:text-base">Sign in to your admin account</p>
            
            {/* Demo Information */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="text-sm font-semibold text-blue-800 mb-2">Demo Accounts</h3>
              <div className="text-xs text-blue-700 space-y-1">
                <p><strong>Mobile Numbers:</strong></p>
                <ul className="list-disc list-inside space-y-1">
                  <li>1234567890 (Admin User)</li>
                  <li>9876543210 (Manager Admin)</li>
                  <li>5555555555 (Super Admin)</li>
                </ul>
                <p className="mt-2"><strong>OTP:</strong> 676767</p>
              </div>
            </div>
          </div>
          <LoginForm />
        </div>
      </div>
    </div>
  )
}
