"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function Dashboard() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to reservations page
    router.push("/dashboard/reservations")
  }, [router])

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-lg font-semibold">Redirecting to Reservations...</div>
    </div>
  )
}
