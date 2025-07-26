"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import Cookies from 'js-cookie'
import userData from "@/lib/userdata.json";

// Static OTP for admin authentication
const STATIC_OTP = "676767";

// Admin users with mobile numbers
const ADMIN_USERS = [
  {
    "_id": "admin1",
    "name": "Admin User",
    "email": "admin@restaurant.com",
    "phone": "1234567890",
    "password": "admin123",
    "role": "admin",
    "createdAt": "2023-01-01T10:00:00Z",
    "updatedAt": "2023-01-01T10:00:00Z"
  },
  {
    "_id": "admin2",
    "name": "Manager Admin",
    "email": "manager@restaurant.com",
    "phone": "9876543210",
    "password": "manager456",
    "role": "admin",
    "createdAt": "2023-01-15T14:30:00Z",
    "updatedAt": "2023-01-15T14:30:00Z"
  },
  {
    "_id": "admin3",
    "name": "Super Admin",
    "email": "superadmin@restaurant.com",
    "phone": "5555555555",
    "password": "super789",
    "role": "super_admin",
    "createdAt": "2024-02-01T09:00:00Z",
    "updatedAt": "2024-02-01T09:00:00Z"
  }
];

export function LoginForm() {
  const [step, setStep] = useState<'mobile' | 'otp'>('mobile')
  const [mobile, setMobile] = useState("")
  const [otp, setOtp] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [resendTimer, setResendTimer] = useState(0)
  const [currentAdmin, setCurrentAdmin] = useState<any>(null)
  const router = useRouter()
  const { toast } = useToast()

  // Handle mobile number submission
  const handleMobileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!/^\d{10}$/.test(mobile)) {
      toast({
        title: "Invalid mobile number",
        description: "Please enter a valid 10-digit mobile number",
        variant: "destructive",
      })
      return
    }

    // Check if admin exists with this mobile number
    const adminUser = ADMIN_USERS.find(user => user.phone === mobile)
    
    if (!adminUser) {
      toast({
        title: "Access denied",
        description: "No admin account found with this mobile number. Use: 1234567890, 9876543210, or 5555555555",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setCurrentAdmin(adminUser)
      setStep('otp')
      setResendTimer(30)
      
      // Start resend timer
      let timer = 30
      const interval = setInterval(() => {
        timer--
        setResendTimer(timer)
        if (timer <= 0) clearInterval(interval)
      }, 1000)
      
      toast({
        title: "OTP sent",
        description: `OTP sent to ${mobile}. Use: ${STATIC_OTP}`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send OTP. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Handle OTP submission
  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!otp || otp.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter the 6-digit OTP",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      if (otp !== STATIC_OTP) {
        throw new Error('Invalid OTP. Please use: 676767')
      }

      // Store token in both localStorage and cookies
      const token = `admin-token-${Date.now()}`
      localStorage.setItem('adminToken', token)
      Cookies.set('adminToken', token, {
        expires: 1, // 1 day
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/'
      })
      
      // Store admin data
      localStorage.setItem('adminData', JSON.stringify(currentAdmin))
      
      toast({
        title: "Login successful",
        description: `Welcome back, ${currentAdmin.name}!`,
      })
      
      window.location.href = '/dashboard'
    } catch (error) {
      console.error('Login error:', error)
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "Invalid OTP",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Handle resend OTP
  const handleResendOtp = async () => {
    if (resendTimer > 0) return
    
    setIsLoading(true)
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setResendTimer(30)
      let timer = 30
      const interval = setInterval(() => {
        timer--
        setResendTimer(timer)
        if (timer <= 0) clearInterval(interval)
      }, 1000)
      
      toast({
        title: "OTP resent",
        description: `OTP resent to ${mobile}. Use: ${STATIC_OTP}`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to resend OTP. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Handle back to mobile step
  const handleBackToMobile = () => {
    setStep('mobile')
    setOtp("")
    setCurrentAdmin(null)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {step === 'mobile' ? 'Admin Login' : 'Verify OTP'}
        </CardTitle>
        {step === 'otp' && (
          <p className="text-sm text-gray-600">
            Enter the OTP sent to {mobile}
          </p>
        )}
      </CardHeader>
      
      {step === 'mobile' ? (
        <form onSubmit={handleMobileSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="mobile">Mobile Number</Label>
              <Input
                id="mobile"
                type="tel"
                placeholder="Enter 10-digit mobile number"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                required
                maxLength={10}
              />
              <p className="text-xs text-gray-500">
                Demo accounts: 1234567890, 9876543210, 5555555555
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Sending OTP..." : "Send OTP"}
            </Button>
          </CardFooter>
        </form>
      ) : (
        <form onSubmit={handleOtpSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="otp">OTP</Label>
              <Input
                id="otp"
                type="text"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                maxLength={6}
              />
              <p className="text-xs text-gray-500">
                Static OTP: {STATIC_OTP}
              </p>
            </div>
            <div className="flex justify-between items-center">
              <Button
                type="button"
                variant="outline"
                onClick={handleBackToMobile}
                disabled={isLoading}
              >
                Back
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleResendOtp}
                disabled={isLoading || resendTimer > 0}
              >
                {resendTimer > 0 ? `Resend (${resendTimer}s)` : "Resend OTP"}
              </Button>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Verifying..." : "Verify OTP"}
            </Button>
          </CardFooter>
        </form>
      )}
    </Card>
  )
}
