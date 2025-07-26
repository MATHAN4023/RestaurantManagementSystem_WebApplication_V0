'use client';
import { useState } from "react";
import { Button } from "../components/ui/button";
import { FiUsers, FiCalendar, FiClock, FiX, FiRefreshCw } from 'react-icons/fi';
import MobilePopup from './MobilePopup';
import OtpPopup from './OtpPopup';

// Generate current date and next 6 days (total 7)
const getDates = () => {
  const arr = []
  const today = new Date()
  for (let i = 0; i < 7; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() + i)
    arr.push({
      label: d.toLocaleDateString(undefined, { weekday: "short" }),
      day: d.getDate(),
      date: d,
      full: d.toLocaleDateString()
    })
  }
  return arr
}

// Generate 24hr slots in 15-min intervals
const getTimeSlots = (amOrPm?: "AM" | "PM") => {
  const slots = []
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 15) {
      const hour12 = h % 12 === 0 ? 12 : h % 12
      const ampm = h < 12 ? "AM" : "PM"
      if (!amOrPm || ampm === amOrPm) {
        slots.push({
          label: `${hour12.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")} ${ampm}`,
          value: `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`
        })
      }
    }
  }
  return slots
}

type TimeSlot = {
  label: string;
  value: string;
};

interface BookingFormProps {
  onClose: () => void;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://tablebooking-api.onrender.com/api';

export default function BookingForm({ onClose }: BookingFormProps) {
  const dates = getDates()
  const [selectedDate, setSelectedDate] = useState(0)
  const now = new Date()
  const isToday = dates[selectedDate].date.toDateString() === now.toDateString()

  // Calculate the next 15-min interval after current time + 1 hour
  let minSlotIndex = 0;
  if (isToday) {
    const nextHour = new Date(now.getTime() + 60 * 60 * 1000);
    const roundedMinutes = Math.ceil(nextHour.getMinutes() / 15) * 15;
    if (roundedMinutes === 60) {
      nextHour.setHours(nextHour.getHours() + 1);
    }
    nextHour.setMinutes(roundedMinutes);
    nextHour.setSeconds(0);
    nextHour.setMilliseconds(0);
    const slotTimeString = `${nextHour.getHours().toString().padStart(2, "0")}:${nextHour.getMinutes().toString().padStart(2, "0")}`;
    // Find the index in slots
    const allSlots = getTimeSlots();
    minSlotIndex = allSlots.findIndex(slot => slot.value === slotTimeString);
  }

  // Slot logic
  let slots: TimeSlot[] = []
  let slotLabel = "Select Slot"
  if (isToday) {
    const allSlots = getTimeSlots();
    slots = allSlots.slice(minSlotIndex >= 0 ? minSlotIndex : 0);
    slotLabel = `Select Slot (from ${slots[0]?.label || "No slots"})`;
  } else {
    slots = getTimeSlots();
    slotLabel = "Select Slot"
  }
  const [selectedSlot, setSelectedSlot] = useState(0)
  const [personCount, setPersonCount] = useState(1)

  const [showMobilePopup, setShowMobilePopup] = useState(false);
  const [showOtpPopup, setShowOtpPopup] = useState(false);
  const [mobile, setMobile] = useState("");
  const [otpError, setOtpError] = useState("");
  const [mobileError, setMobileError] = useState("");
  const [resendTimer, setResendTimer] = useState(0);
  const [loading, setLoading] = useState(false);
  const [requestId, setRequestId] = useState("");
  const [showProfileUpdatePopup, setShowProfileUpdatePopup] = useState(false);
  const [profileName, setProfileName] = useState("");

  // Handle profile name update
  async function handleProfileUpdate() {
    if (!profileName.trim()) {
      alert("Please enter your name");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${BASE_URL}/users/profile`, {
        method: 'PATCH',
        headers: {
          'x-auth-token': token || '',
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: profileName
        })
      });

      const data = await response.json();
      if (data.success) {
        setShowProfileUpdatePopup(false);
        // Fetch updated profile before proceeding with booking
        await fetchProfile();
        // Proceed with booking after profile update
        await handleDirectBooking();
      } else {
        throw new Error(data.message || 'Failed to update profile');
      }
    } catch (err: unknown) {
      alert((err as Error).message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  }

  // Add fetchProfile function
  async function fetchProfile() {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch(`${BASE_URL}/users/profile`, {
        method: 'GET',
        headers: {
          'x-auth-token': token,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }

      const data = await response.json();
      if (data.success) {
        return data.data.user;
      }
    } catch (err) {
      console.error('Profile fetch error:', err);
      throw err;
    }
  }

  // Handle OTP submit (verify OTP)
  async function handleOtpSubmit(otpValue: string) {
    if (!otpValue || otpValue.length !== 6) {
      setOtpError("Please enter the 6-digit OTP.");
      return;
    }
    setOtpError("");
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/users/auth/verify-otp`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          phone: mobile,
          otp: otpValue,
          request_id: requestId
        }),
      });
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Invalid OTP');
      }

      // Store token and proceed with booking
      if (result.data?.token) {
        localStorage.setItem('token', result.data.token);
        setShowOtpPopup(false);
        
        // Fetch profile and check name
        const userProfile = await fetchProfile();
        if (!userProfile.name || userProfile.name === "Guest") {
          setShowProfileUpdatePopup(true);
        } else {
          // Proceed with booking after successful login
          await handleDirectBooking();
        }
      } else {
        throw new Error('No token received from server');
      }
    } catch (err: unknown) {
      setOtpError(err as string || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  }

  // Handle direct booking for logged-in users
  async function handleDirectBooking() {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/users/reservations`, {
        method: 'POST',
        headers: {
          'x-auth-token': localStorage.getItem('token') || '',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          datetime: `${dates[selectedDate].date.toISOString().split('T')[0]}T${slots[selectedSlot].value}:00`,
          partySize: personCount
        })
      });

      const result = await response.json();
      
      if (!result.success) {
        if (result.message?.includes('already have a reservation')) {
          // Show error message in a more user-friendly way
          const errorMessage = document.createElement('div');
          errorMessage.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in';
          errorMessage.innerHTML = `
            <div class="flex items-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>You already have a reservation around this time. Please choose a different time slot.</span>
            </div>
          `;
          document.body.appendChild(errorMessage);
          
          // Remove error message after 5 seconds
          setTimeout(() => {
            errorMessage.remove();
          }, 5000);
        } else {
          throw new Error(result.message || 'Failed to create reservation');
        }
        return;
      }

      // Show success message
      const successMessage = document.createElement('div');
      successMessage.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in';
      successMessage.innerHTML = `
        <div class="flex items-center gap-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          <span>Booking confirmed successfully!</span>
        </div>
      `;
      document.body.appendChild(successMessage);
      
      // Remove success message after 3 seconds
      setTimeout(() => {
        successMessage.remove();
        onClose();
      }, 3000);

    } catch (err: unknown) {
      console.error('Booking error:', err);
      if (err instanceof Error && (err.message.includes('Access denied') || err.message.includes('No token provided'))) {
        // Token is invalid, clear it and show login
        localStorage.removeItem('token');
        setShowMobilePopup(true);
      } else {
        // Show error message
        const errorMessage = document.createElement('div');
        errorMessage.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in';
        errorMessage.innerHTML = `
          <div class="flex items-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>${err instanceof Error ? err.message : 'Failed to create reservation'}</span>
          </div>
        `;
        document.body.appendChild(errorMessage);
        
        // Remove error message after 5 seconds
        setTimeout(() => {
          errorMessage.remove();
        }, 5000);
      }
    } finally {
      setLoading(false);
    }
  }

  // Handle Reserve
  async function handleReserve() {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    if (token) {
      // User is logged in, check their profile
      try {
        const userProfile = await fetchProfile();
        if (!userProfile.name || userProfile.name === "Guest") {
          // Show profile update popup
          setShowProfileUpdatePopup(true);
        } else {
          // Proceed with direct booking
          await handleDirectBooking();
        }
      } catch (err) {
        console.error('Profile fetch error:', err);
        // If there's an error, clear token and show login
        localStorage.removeItem('token');
        setShowMobilePopup(true);
      }
    } else {
      // User is not logged in, show mobile popup
      setShowMobilePopup(true);
    }
  }

  // Handle mobile submit (send OTP)
  async function handleMobileSubmit(mobileNumber: string) {
    if (!/^\d{10}$/.test(mobileNumber)) {
      setMobileError("Please enter a valid 10-digit mobile number.");
      return;
    }
    setMobileError("");
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/users/auth/initiate-login`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          phone: mobileNumber
        }),
      });
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Failed to send OTP');
      }

      if (result.data?.request_id) {
        setMobile(mobileNumber);
        setRequestId(result.data.request_id);
        setShowOtpPopup(true);
        setShowMobilePopup(false);
        setResendTimer(30);
        setOtpError("");
        
        // Start resend timer
        let timer = 30;
        const interval = setInterval(() => {
          timer--;
          setResendTimer(timer);
          if (timer <= 0) clearInterval(interval);
        }, 1000);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err: unknown) {
      setMobileError(err as string || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  }

  // Handle resend OTP
  async function handleResendOtp() {
    if (resendTimer > 0) return;
    if (!requestId || !mobile) {
      setOtpError('Session expired. Please try again.');
      return;
    }
    
    setLoading(true);
    try {
      // First, try to initiate a new login request
      const initiateResponse = await fetch(`${BASE_URL}/users/auth/initiate-login`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          phone: mobile
        }),
      });
      
      const initiateResult = await initiateResponse.json();
      
      if (!initiateResult.success) {
        throw new Error(initiateResult.message || 'Failed to send OTP');
      }

      // Update the request ID with the new one
      if (initiateResult.data?.request_id) {
        setRequestId(initiateResult.data.request_id);
        
        // Reset states on successful resend
        setResendTimer(30);
        setOtpError("");
        
        // Start resend timer
        let timer = 30;
        const interval = setInterval(() => {
          timer--;
          setResendTimer(timer);
          if (timer <= 0) clearInterval(interval);
        }, 1000);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err: unknown) {
      console.error('Resend OTP Error:', err);
      setOtpError(err as string || 'Failed to resend OTP');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[1200]">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      {/* Side Drawer Modal */}
      <div className="fixed right-0 top-0 h-full max-w-md w-full bg-white border-l border-[#e0e0e0] shadow-2xl rounded-l-2xl p-6 overflow-y-auto flex flex-col gap-7 animate-slideInRight">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-full border border-[#e0e0e0] bg-white text-[#222] hover:bg-[#2EFFFF] hover:text-black transition-colors text-xl font-bold shadow focus:outline-none focus:ring-2 focus:ring-[#2EFFFF]"
          aria-label="Close booking form"
        >
          <FiX className="text-xl text-[#222]" />
        </button>
        {/* Title */}
        <div className="mb-2">
          <h2 className="text-2xl font-serif font-bold tracking-tight text-[#222] flex items-center gap-2 mb-1">
            <FiUsers className="text-[#222] text-xl" /> DINING AT OASIS
          </h2>
          <p className="text-sm text-gray-500 font-medium">Reserve your table in seconds!</p>
        </div>
        <hr className="border-[#e0e0e0]" />
        {/* Name Section */}
        {/* <div className="flex flex-col gap-2">
          <label htmlFor="booking-name" className="text-base font-semibold text-[#222] flex items-center gap-2">
            <FiUser className="text-[#222] text-lg" /> Name
          </label>
          <input
            id="booking-name"
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-[#e0e0e0] focus:outline-none focus:ring-2 focus:ring-[#2EFFFF] text-[#222] bg-white placeholder-gray-400 font-sans text-base shadow-sm"
            autoComplete="name"
          />
        </div> */}
        {/* Persons Section */}
        <div className="flex flex-col gap-2">
          <div className="font-semibold text-[#222] text-base flex items-center gap-2">
            <FiUsers className="text-[#222] text-lg" /> Persons
          </div>
          <div className="flex items-center gap-2 bg-white rounded-lg px-3 py-2 border border-[#e0e0e0] w-fit mx-auto">
            <button
              type="button"
              aria-label="Decrease persons"
              className="w-8 h-8 flex items-center justify-center rounded-full border border-[#e0e0e0] text-xl font-bold text-[#222] hover:bg-[#2EFFFF] hover:text-black transition-colors"
              onClick={e => { e.stopPropagation(); setPersonCount((c) => Math.max(1, c - 1)); }}
            >
              –
            </button>
            <span className="w-8 text-center font-bold text-lg text-[#222]">{personCount}</span>
            <button
              type="button"
              aria-label="Increase persons"
              className="w-8 h-8 flex items-center justify-center rounded-full border border-[#e0e0e0] text-xl font-bold text-[#222] hover:bg-[#2EFFFF] hover:text-black transition-colors"
              onClick={e => { e.stopPropagation(); setPersonCount((c) => c + 1); }}
            >
              +
            </button>
          </div>
        </div>
        {/* Date Section */}
        <div className="flex flex-col gap-2">
          <div className="font-semibold mb-1 text-[#222] text-base font-serif flex items-center gap-2">
            <FiCalendar className="text-[#222] text-lg" /> Select Date
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-[#e0e0e0] [&::-webkit-scrollbar-thumb]:rounded-full">
            {dates.map((d, i) => (
              <button
                key={d.full}
                onClick={e => { e.stopPropagation(); setSelectedDate(i); }}
                className={`flex flex-col items-center px-4 py-2 rounded-lg border font-semibold min-w-[64px] shadow-sm transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#2EFFFF] ${selectedDate === i ? "bg-[#2EFFFF] text-black border-[#2EFFFF] scale-105 shadow" : "bg-white text-[#222] border-[#e0e0e0] hover:bg-[#2EFFFF]/10 hover:border-[#2EFFFF]"}`}
              >
                <span className="text-xs uppercase tracking-wide font-sans">{d.label}</span>
                <span className="text-lg font-bold font-serif">{d.day}</span>
              </button>
            ))}
          </div>
        </div>
        {/* Slot Section */}
        <div className="flex flex-col gap-2">
          <div className="font-semibold mb-1 text-[#222] text-base font-serif flex items-center gap-2">
            <FiClock className="text-[#222] text-lg" /> {slotLabel}
          </div>
          {/* Single horizontal scroll with two grid rows, grid flows horizontally */}
          <div
            className="overflow-x-auto pb-2 whitespace-nowrap [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-[#e0e0e0] [&::-webkit-scrollbar-thumb]:rounded-full"
          >
            <div className="grid grid-rows-2 grid-flow-col gap-3">
              {slots.map((slot, i) => (
                <button
                  key={slot.label + '-' + i}
                  onClick={e => { e.stopPropagation(); setSelectedSlot(i); }}
                  className={`px-4 py-2 rounded-lg border text-sm font-semibold min-w-[90px] shadow-sm transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#2EFFFF] ${
                    selectedSlot === i
                      ? 'bg-[#2EFFFF] text-black border-[#2EFFFF] scale-105 shadow'
                      : 'bg-white text-[#222] border-[#e0e0e0] hover:bg-[#2EFFFF]/10 hover:border-[#2EFFFF]'
                  }`}
                >
                  {slot.label}
                </button>
              ))}
            </div>
          </div>
        </div>
        {/* Reserve Button */}
        <div className="pt-2">
          <Button
            className="w-full text-lg py-3 rounded-lg font-bold shadow-md transition-all duration-150 bg-[#2EFFFF] hover:bg-[#222] hover:text-[#2EFFFF] text-black border border-[#2EFFFF] flex items-center justify-center gap-2"
            onClick={handleReserve}
            disabled={loading}
          >
            {loading ? (
              <>
                <FiRefreshCw className="animate-spin" /> Processing...
              </>
            ) : (
              'Reserve'
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Number Popup */}
      {showMobilePopup && (
        <MobilePopup
          onClose={() => setShowMobilePopup(false)}
          onMobileSubmit={handleMobileSubmit}
          loading={loading}
          mobileError={mobileError}
        />
      )}

      {/* OTP Popup */}
      {showOtpPopup && (
        <OtpPopup
          onClose={() => setShowOtpPopup(false)}
          onOtpSubmit={handleOtpSubmit}
          onResendOtp={handleResendOtp}
          onBackToMobile={() => {
            setShowOtpPopup(false);
            setShowMobilePopup(true);
          }}
          mobile={mobile}
          loading={loading}
          otpError={otpError}
          resendTimer={resendTimer}
        />
      )}

      {/* Profile Update Popup */}
      {showProfileUpdatePopup && (
        <div className="fixed inset-0 z-[1300] flex items-center justify-center bg-black/40 animate-fadeInUp">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md flex flex-col gap-6 relative">
            <button
              onClick={() => setShowProfileUpdatePopup(false)}
              className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-2xl text-[#222]"
              aria-label="Close profile update popup"
            >
              <FiX />
            </button>
            <div className="text-lg font-semibold text-[#222] mb-2">Update Profile</div>
            <div className="text-center mb-2">
              <h2 className="text-2xl font-bold mb-2" style={{fontFamily: 'inherit'}}>Please Update Your Name</h2>
              <p className="text-gray-600">To continue with the booking, please provide your name.</p>
            </div>
            <div className="flex flex-col gap-4 mt-2">
              <label className="text-sm font-semibold text-[#222]">Name *</label>
              <input
                type="text"
                value={profileName}
                onChange={e => setProfileName(e.target.value)}
                placeholder="Enter your name"
                className="w-full px-4 py-3 rounded-lg border border-[#e0e0e0] focus:outline-none focus:ring-2 focus:ring-[#2EFFFF] text-base font-semibold bg-[#fafafa] placeholder-gray-400 shadow-sm"
              />
              <Button
                className="w-full bg-[#2EFFFF] text-black font-bold rounded-lg text-base py-3 shadow-md hover:bg-[#222] hover:text-[#2EFFFF] transition-all"
                onClick={handleProfileUpdate}
                disabled={loading}
              >
                {loading ? 'Updating...' : 'Update & Continue'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 