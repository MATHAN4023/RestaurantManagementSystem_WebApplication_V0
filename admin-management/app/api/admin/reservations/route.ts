import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_BASE_URL) {
  throw new Error("NEXT_PUBLIC_API_URL environment variable is not set");
}

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
    const page = searchParams.get("page") || "1";
    const limit = searchParams.get("limit") || "10";
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";
    const startDate = searchParams.get("startDate") || "";
    const endDate = searchParams.get("endDate") || "";

    // Build API URL with parameters
    const apiUrl = new URL(`${API_BASE_URL}/reservations`);
    apiUrl.searchParams.append("page", page);
    apiUrl.searchParams.append("limit", limit);
    
    // Add search parameter if present
    if (search) {
      apiUrl.searchParams.append("search", search);
    }
    
    // Add status parameter if present and not "all"
    if (status && status !== "all") {
      apiUrl.searchParams.append("status", status);
    }
    
    // Add date range parameters if present
    if (startDate) {
      apiUrl.searchParams.append("startDate", startDate);
    }
    if (endDate) {
      apiUrl.searchParams.append("endDate", endDate);
    }

    console.log("Making request to:", apiUrl.toString());

    const response = await fetch(apiUrl.toString(), {
      method: 'GET',
      headers: {
        'x-auth-token': adminToken.value,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      cache: 'no-store',
      next: { revalidate: 0 },
    });

    // Log response status for debugging
    console.log("API Response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Error Response:", {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });
      
      return NextResponse.json(
        { 
          success: false, 
          message: `Backend API error: ${response.status} ${response.statusText}`,
          details: errorText
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log("Successfully fetched reservations:", {
      count: data.data?.reservations?.length || 0,
      filters: {
        search,
        status,
        startDate,
        endDate
      }
    });
    
    return NextResponse.json(data);
  } catch (error: unknown) {
    console.error("Detailed error in reservations API:", {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : 'Unknown error occurred',
      stack: error instanceof Error ? error.stack : undefined
    });

    // More specific error handling
    if (error instanceof Error && error.message.includes("fetch failed")) {
      return NextResponse.json(
        { 
          success: false, 
          message: "Connection to the server failed. Please check your internet connection and try again.",
          error: error.message
        },
        { status: 503 }
      );
    }

    if (error instanceof Error && (error.message.includes("certificate") || error.message.includes("SSL"))) {
      return NextResponse.json(
        { 
          success: false, 
          message: "Security error while connecting to the server. Please try again later.",
          error: error.message
        },
        { status: 503 }
      );
    }

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