import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const cookieStore = cookies()
    const adminToken = cookieStore.get("adminToken")?.value

    if (!adminToken) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { status } = body

    if (!status) {
      return NextResponse.json(
        { success: false, message: "Status is required" },
        { status: 400 }
      )
    }

    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL
    if (!API_BASE_URL) {
      throw new Error("API URL not configured")
    }

    const response = await fetch(
      `${API_BASE_URL}/reservations/${params.id}/status`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": adminToken,
        },
        body: JSON.stringify({ status }),
      }
    )

    if (!response.ok) {
      const errorData = await response.json()
      return NextResponse.json(
        { success: false, message: errorData.message || "Failed to update status" },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error updating reservation status:", error)
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    )
  }
} 