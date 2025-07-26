"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, MoreHorizontal, Loader2, ArrowUpDown, RefreshCw } from "lucide-react"
import { format } from "date-fns"
import { useToast } from "@/hooks/use-toast"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import { DateRange } from "react-day-picker"
import { useDebounce } from "@/hooks/use-debounce"
import { convertToCSV, downloadCSV } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Check, ChevronDown } from "lucide-react"
import reservationData from "@/lib/reservations.json";

interface User {
  _id: string
  name: string
  phone: string
}

interface Reservation {
  _id: string
  userId: User
  datetime: string
  partySize: number
  status: string
  bookingCode: string
  createdAt: string
  updatedAt: string
}

interface PaginationData {
  total: number
  page: number
  pages: number
}

interface ApiResponse {
  success: boolean
  message: string
  data: {
    reservations: Reservation[]
    pagination: PaginationData
  }
}

// Helper function to get status badge styling
function getStatusBadgeClass(status: string) {
  switch (status.toLowerCase()) {
    case "confirmed":
      return "bg-green-100 text-green-800"
    case "arrived":
      return "bg-blue-100 text-blue-800"
    case "no-show":
      return "bg-yellow-100 text-yellow-800"
    case "cancelled":
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export default function ReservationsPage() {
  const [allReservations, setAllReservations] = useState<Reservation[]>([])
  const [filteredReservations, setFilteredReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [isSearching, setIsSearching] = useState(false)
  const { toast } = useToast()
  const [sortField, setSortField] = useState<string>("datetime")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Fetch all reservations once
  const fetchReservations = async () => {
    try {
      setLoading(true);
      setIsRefreshing(true);
      setError(null);
      // Use local JSON data instead of API
      const reservations = reservationData;
      setAllReservations(reservations);
      setFilteredReservations(reservations);
      setTotalItems(reservations.length);
      setTotalPages(Math.ceil(reservations.length / itemsPerPage));
    } catch (error: unknown) {
      console.error("Error loading reservations:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to load reservations";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }

  // Initial fetch
  useEffect(() => {
    fetchReservations()
  }, [])

  // Apply filters whenever they change
  useEffect(() => {
    setIsSearching(true)

    let filtered = [...allReservations]

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(reservation => 
        reservation.bookingCode.toLowerCase().includes(query) ||
        reservation.userId.name.toLowerCase().includes(query) ||
        reservation.userId.phone.toLowerCase().includes(query)
      )
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(reservation => 
        reservation.status.toLowerCase() === statusFilter.toLowerCase()
      )
    }

    // Apply date range filter
    if (dateRange?.from || dateRange?.to) {
      filtered = filtered.filter(reservation => {
        const reservationDate = new Date(reservation.datetime)
        if (dateRange.from && dateRange.to) {
          return reservationDate >= dateRange.from && reservationDate <= dateRange.to
        } else if (dateRange.from) {
          return reservationDate >= dateRange.from
        } else if (dateRange.to) {
          return reservationDate <= dateRange.to
        }
        return true
      })
    }

    setFilteredReservations(filtered)
    setCurrentPage(1) // Reset to first page when filters change
    setIsSearching(false)
  }, [searchQuery, statusFilter, dateRange, allReservations])

  // Get current page data
  const getCurrentPageData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return filteredReservations.slice(startIndex, endIndex)
  }

  // Sort function
  const sortReservations = (reservations: Reservation[]) => {
    return [...reservations].sort((a, b) => {
      let comparison = 0
      switch (sortField) {
        case "bookingCode":
          comparison = a.bookingCode.localeCompare(b.bookingCode)
          break
        case "customerName":
          comparison = a.userId.name.localeCompare(b.userId.name)
          break
        case "phone":
          comparison = a.userId.phone.localeCompare(b.userId.phone)
          break
        case "datetime":
          comparison = new Date(a.datetime).getTime() - new Date(b.datetime).getTime()
          break
        case "partySize":
          comparison = a.partySize - b.partySize
          break
        case "status":
          comparison = a.status.localeCompare(b.status)
          break
        case "createdAt":
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          break
        default:
          comparison = 0
      }
      return sortDirection === "asc" ? comparison : -comparison
    })
  }

  // Handle sort
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  // Apply sorting to filtered reservations
  const sortedReservations = sortReservations(filteredReservations)

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    setIsSearching(true)
  }

  const handleStatusChange = (value: string) => {
    setStatusFilter(value)
  }

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range)
  }

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  // Handle items per page change
  const handleItemsPerPageChange = (value: string) => {
    const newLimit = parseInt(value)
    setItemsPerPage(newLimit)
    setCurrentPage(1)
    setTotalPages(Math.ceil(filteredReservations.length / newLimit))
  }

  const formatDateTime = (dateString: string) => {
    return format(new Date(dateString), "MMM dd, yyyy h:mm a")
  }

  const handleExportCSV = () => {
    try {
      // Format the data for CSV export
      const exportData = filteredReservations.map(reservation => ({
        bookingCode: reservation.bookingCode,
        customerName: reservation.userId.name,
        phoneNumber: reservation.userId.phone,
        dateTime: formatDateTime(reservation.datetime),
        partySize: reservation.partySize,
        status: reservation.status,
        createdAt: formatDateTime(reservation.createdAt)
      }))

      const csv = convertToCSV(exportData)
      const filename = `reservations-${format(new Date(), 'yyyy-MM-dd')}.csv`
      downloadCSV(csv, filename)

      toast({
        title: "Success",
        description: "Reservations exported successfully",
      })
    } catch (error) {
      console.error("Error exporting CSV:", error)
      toast({
        title: "Error",
        description: "Failed to export reservations",
        variant: "destructive",
      })
    }
  }

  const handleStatusUpdate = async (reservationId: string, newStatus: string) => {
    try {
      // Directly update the local state (no API call)
      setAllReservations(prev => 
        prev.map(reservation => 
          reservation._id === reservationId 
            ? { ...reservation, status: newStatus }
            : reservation
        )
      )
      setFilteredReservations(prev =>
        prev.map(reservation =>
          reservation._id === reservationId
            ? { ...reservation, status: newStatus }
            : reservation
        )
      )
      toast({
        title: "Success",
        description: "Reservation status updated successfully",
      })
    } catch (error) {
      console.error('Error updating status:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update reservation status",
        variant: "destructive",
      })
    }
  }

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = []
    const maxVisiblePages = 5

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      pages.push(1)

      let start = Math.max(2, currentPage - 1)
      let end = Math.min(totalPages - 1, currentPage + 1)

      if (currentPage <= 2) {
        end = 4
      }
      if (currentPage >= totalPages - 1) {
        start = totalPages - 3
      }

      if (start > 2) {
        pages.push('...')
      }

      for (let i = start; i <= end; i++) {
        pages.push(i)
      }

      if (end < totalPages - 1) {
        pages.push('...')
      }

      pages.push(totalPages)
    }

    return pages
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-lg font-semibold">Loading reservations...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-lg font-semibold text-red-600">{error}</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Reservations</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Manage bookings and reservation requests.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleExportCSV}
            className="w-full sm:w-auto"
          >
            Export CSV
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchReservations}
            disabled={isRefreshing}
            className="w-full sm:w-auto"
          >
            {isRefreshing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Refreshing...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              type="search" 
              placeholder="Search by booking code, name, or phone..." 
              className="pl-8"
              value={searchQuery}
              onChange={handleSearchChange}
            />
            {isSearching && (
              <Loader2 className="absolute right-2.5 top-2.5 h-4 w-4 animate-spin text-muted-foreground" />
            )}
          </div>
          <Select 
            value={statusFilter}
            onValueChange={handleStatusChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="arrived">Arrived</SelectItem>
              <SelectItem value="no-show">No Show</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          <DatePickerWithRange 
            date={dateRange}
            onDateChange={handleDateRangeChange}
          />
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDateRange(undefined)}
              disabled={!dateRange}
              className="w-full sm:w-auto"
            >
              Clear
            </Button>
            <Select
              value={itemsPerPage.toString()}
              onValueChange={handleItemsPerPageChange}
            >
              <SelectTrigger className="w-[70px]">
                <SelectValue placeholder={itemsPerPage} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="rounded-md border">
        <div className="relative">
          {/* Table View for Desktop */}
          <div className="hidden md:block overflow-x-auto">
            <div className="inline-block min-w-full align-middle">
              <Table>
                <TableHeader className="sticky top-0 bg-background z-10">
                  <TableRow>
                    <TableHead className="hidden md:table-cell">
                      <Button
                        variant="ghost"
                        onClick={() => handleSort("bookingCode")}
                        className="flex items-center gap-1"
                      >
                        Booking Code
                        <ArrowUpDown className="h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button
                        variant="ghost"
                        onClick={() => handleSort("customerName")}
                        className="flex items-center gap-1"
                      >
                        Customer
                        <ArrowUpDown className="h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead className="hidden md:table-cell">
                      <Button
                        variant="ghost"
                        onClick={() => handleSort("phone")}
                        className="flex items-center gap-1"
                      >
                        Phone
                        <ArrowUpDown className="h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button
                        variant="ghost"
                        onClick={() => handleSort("datetime")}
                        className="flex items-center gap-1"
                      >
                        Date & Time
                        <ArrowUpDown className="h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead className="hidden md:table-cell">
                      <Button
                        variant="ghost"
                        onClick={() => handleSort("partySize")}
                        className="flex items-center gap-1"
                      >
                        Party Size
                        <ArrowUpDown className="h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button
                        variant="ghost"
                        onClick={() => handleSort("status")}
                        className="flex items-center gap-1"
                      >
                        Status
                        <ArrowUpDown className="h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead className="hidden md:table-cell">
                      <Button
                        variant="ghost"
                        onClick={() => handleSort("createdAt")}
                        className="flex items-center gap-1"
                      >
                        Created At
                        <ArrowUpDown className="h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8">
                        <div className="flex items-center justify-center">
                          <Loader2 className="h-6 w-6 animate-spin" />
                          <span className="ml-2">Loading reservations...</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : error ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-red-600">
                        {error}
                      </TableCell>
                    </TableRow>
                  ) : filteredReservations.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                        No reservations found
                      </TableCell>
                    </TableRow>
                  ) : (
                    getCurrentPageData().map((reservation) => (
                      <TableRow key={reservation._id}>
                        <TableCell className="hidden md:table-cell font-medium">
                          {reservation.bookingCode}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium">{reservation.userId.name}</span>
                            <span className="text-sm text-muted-foreground md:hidden">
                              {reservation.bookingCode}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {reservation.userId.phone}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span>{formatDateTime(reservation.datetime)}</span>
                            <span className="text-sm text-muted-foreground md:hidden">
                              Party: {reservation.partySize}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {reservation.partySize}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button 
                                variant="ghost" 
                                className="h-8 w-full justify-between px-2"
                              >
                                <span
                                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusBadgeClass(
                                    reservation.status
                                  )}`}
                                >
                                  {reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}
                                </span>
                                <ChevronDown className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => handleStatusUpdate(reservation._id, 'confirmed')}
                                className="flex items-center justify-between"
                              >
                                Confirmed
                                {reservation.status === 'confirmed' && <Check className="h-4 w-4" />}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleStatusUpdate(reservation._id, 'arrived')}
                                className="flex items-center justify-between"
                              >
                                Arrived
                                {reservation.status === 'arrived' && <Check className="h-4 w-4" />}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleStatusUpdate(reservation._id, 'no-show')}
                                className="flex items-center justify-between"
                              >
                                No Show
                                {reservation.status === 'no-show' && <Check className="h-4 w-4" />}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleStatusUpdate(reservation._id, 'cancelled')}
                                className="flex items-center justify-between"
                              >
                                Cancelled
                                {reservation.status === 'cancelled' && <Check className="h-4 w-4" />}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {formatDateTime(reservation.createdAt)}
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Card View for Mobile */}
          <div className="md:hidden space-y-4 p-4">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span className="ml-2">Loading reservations...</span>
              </div>
            ) : error ? (
              <div className="text-center py-8 text-red-600">
                {error}
              </div>
            ) : filteredReservations.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No reservations found
              </div>
            ) : (
              getCurrentPageData().map((reservation) => (
                <div key={reservation._id} className="rounded-lg border bg-card p-4 shadow-sm">
                  <div className="flex flex-col space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <h3 className="font-medium">{reservation.userId.name}</h3>
                        <p className="text-sm text-muted-foreground">{reservation.bookingCode}</p>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleStatusUpdate(reservation._id, 'confirmed')}
                            className="flex items-center justify-between"
                          >
                            Confirmed
                            {reservation.status === 'confirmed' && <Check className="h-4 w-4" />}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleStatusUpdate(reservation._id, 'arrived')}
                            className="flex items-center justify-between"
                          >
                            Arrived
                            {reservation.status === 'arrived' && <Check className="h-4 w-4" />}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleStatusUpdate(reservation._id, 'no-show')}
                            className="flex items-center justify-between"
                          >
                            No Show
                            {reservation.status === 'no-show' && <Check className="h-4 w-4" />}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleStatusUpdate(reservation._id, 'cancelled')}
                            className="flex items-center justify-between"
                          >
                            Cancelled
                            {reservation.status === 'cancelled' && <Check className="h-4 w-4" />}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-muted-foreground">Phone</p>
                        <p>{reservation.userId.phone}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Party Size</p>
                        <p>{reservation.partySize}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Date & Time</p>
                        <p>{formatDateTime(reservation.datetime)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Status</p>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusBadgeClass(
                            reservation.status
                          )}`}
                        >
                          {reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {((currentPage - 1) * itemsPerPage) + 1} to{" "}
            {Math.min(currentPage * itemsPerPage, totalItems)} of{" "}
            {totalItems} reservations
          </div>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    if (currentPage > 1) handlePageChange(currentPage - 1)
                  }}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>

              {getPageNumbers().map((page, index) => (
                <PaginationItem key={index}>
                  {page === "..." ? (
                    <PaginationEllipsis />
                  ) : (
                    <PaginationLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault()
                        handlePageChange(Number(page))
                      }}
                      isActive={currentPage === page}
                    >
                      {page}
                    </PaginationLink>
                  )}
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    if (currentPage < totalPages) handlePageChange(currentPage + 1)
                  }}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  )
}
