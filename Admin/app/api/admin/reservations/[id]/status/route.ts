import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { updateReservationStatus } from "@/lib/utils"

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const cookieStore = await cookies()
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

    // Update reservation status in local data
    const success = updateReservationStatus(params.id, status)

    if (!success) {
      return NextResponse.json(
        { success: false, message: "Reservation not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: "Reservation status updated successfully"
    })
  } catch (error) {
    console.error("Error updating reservation status:", error)
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    )
  }
} 