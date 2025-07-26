import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
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
