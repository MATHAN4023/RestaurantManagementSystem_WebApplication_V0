import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import reservationsData from './reservations.json'
import userData from './userdata.json'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Data management functions
export function getReservations() {
  return reservationsData
}

export function getUsers() {
  return userData.filter(user => user.role !== 'admin') // Exclude admin users from customer list
}

export function getAdmins() {
  return userData.filter(user => user.role === 'admin')
}

export function updateReservationStatus(reservationId: string, status: string) {
  const reservation = reservationsData.find(r => r._id === reservationId)
  if (reservation) {
    reservation.status = status
    reservation.updatedAt = new Date().toISOString()
    return true
  }
  return false
}

export function updateUser(userId: string, data: Partial<any>) {
  const user = userData.find(u => u._id === userId)
  if (user) {
    Object.assign(user, data)
    user.updatedAt = new Date().toISOString()
    return true
  }
  return false
}

export function searchReservations(query: string, status?: string, startDate?: string, endDate?: string) {
  let filtered = reservationsData

  // Search by customer name or phone
  if (query) {
    const searchTerm = query.toLowerCase()
    filtered = filtered.filter(reservation => 
      reservation.userId.name.toLowerCase().includes(searchTerm) ||
      reservation.userId.phone.includes(searchTerm) ||
      reservation.bookingCode.toLowerCase().includes(searchTerm)
    )
  }

  // Filter by status
  if (status && status !== 'all') {
    filtered = filtered.filter(reservation => reservation.status === status)
  }

  // Filter by date range
  if (startDate) {
    filtered = filtered.filter(reservation => 
      new Date(reservation.datetime) >= new Date(startDate)
    )
  }

  if (endDate) {
    filtered = filtered.filter(reservation => 
      new Date(reservation.datetime) <= new Date(endDate)
    )
  }

  return filtered
}

export function searchUsers(query: string) {
  const users = getUsers()
  if (!query) return users

  const searchTerm = query.toLowerCase()
  return users.filter(user => 
    user.name.toLowerCase().includes(searchTerm) ||
    (user.phone && user.phone.includes(searchTerm)) ||
    (user.gender && user.gender.toLowerCase().includes(searchTerm))
  )
}

export function convertToCSV(data: any[]) {
  if (data.length === 0) return ''

  // Get headers from the first object
  const headers = Object.keys(data[0])
    .filter(key => !key.includes('_id')) // Exclude ID fields
    .map(key => key.replace(/([A-Z])/g, ' $1').trim()) // Convert camelCase to spaces

  // Create CSV content
  const csvRows = [
    headers.join(','), // Header row
    ...data.map(row => {
      return headers.map(header => {
        const key = header.toLowerCase().replace(/\s+/g, '')
        const value = row[key] || ''
        // Handle nested objects (like userId)
        if (typeof value === 'object' && value !== null) {
          return `"${Object.values(value).join(' ')}"`
        }
        // Escape quotes and wrap in quotes if contains comma
        return value.toString().includes(',') ? `"${value}"` : value
      }).join(',')
    })
  ]

  return csvRows.join('\n')
}

export function downloadCSV(csv: string, filename: string) {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  
  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'
  
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
