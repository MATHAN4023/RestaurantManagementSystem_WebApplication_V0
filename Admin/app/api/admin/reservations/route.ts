import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { searchReservations } from "@/lib/utils";

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
    const adminToken = cookieStore.get("adminToken");

    // Log token status for debugging
    console.log("Admin token status:", {
      exists: !!adminToken,
      value: adminToken ? "present" : "missing"
    });

    if (!adminToken) {
      return NextResponse.json(
        { success: false, message: "Unauthorized - No admin token found" },
        { status: 401 }
      );
    }

    // Get URL parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";
    const startDate = searchParams.get("startDate") || "";
    const endDate = searchParams.get("endDate") || "";

    // Get filtered reservations from local data
    const filteredReservations = searchReservations(search, status, startDate, endDate);
    
    // Calculate pagination
    const total = filteredReservations.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedReservations = filteredReservations.slice(startIndex, endIndex);

    console.log("Successfully fetched reservations:", {
      count: paginatedReservations.length,
      total,
      page,
      totalPages,
      filters: {
        search,
        status,
        startDate,
        endDate
      }
    });
    
    return NextResponse.json({
      success: true,
      data: {
        reservations: paginatedReservations,
        pagination: {
          total,
          page,
          pages: totalPages,
          limit
        }
      }
    });
  } catch (error: unknown) {
    console.error("Error in reservations API:", {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : 'Unknown error occurred',
      stack: error instanceof Error ? error.stack : undefined
    });

    return NextResponse.json(
      { 
        success: false, 
        message: "An unexpected error occurred. Please try again later.",
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      },
      { status: 500 }
    );
  }
} 