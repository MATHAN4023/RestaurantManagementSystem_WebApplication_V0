'use client';
import { useState, useEffect, useCallback } from 'react';
import { Button } from "../components/ui/button";
import { FiEdit2, FiSave, FiLogOut, FiCalendar, FiUsers, FiClock, FiPhone, FiUser as FiUserIcon, FiX } from 'react-icons/fi';
import MobilePopup from '../components/MobilePopup';
import OtpPopup from '../components/OtpPopup';
import { useRouter } from 'next/navigation';

// Dummy data for users
const DUMMY_USERS = [
  {
    phone: "1234567890",
    name: "John Doe",
    gender: "male",
    dateOfBirth: "1990-05-15",
    createdAt: "2024-01-01T10:00:00Z",
    updatedAt: "2024-01-01T10:00:00Z"
  },
  {
    phone: "9876543210",
    name: "Jane Smith",
    gender: "female",
    dateOfBirth: "1992-08-20",
    createdAt: "2024-01-15T14:30:00Z",
    updatedAt: "2024-01-15T14:30:00Z"
  },
  {
    phone: "5555555555",
    name: "Mike Johnson",
    gender: "male",
    dateOfBirth: "1988-12-10",
    createdAt: "2024-02-01T09:00:00Z",
    updatedAt: "2024-02-01T09:00:00Z"
  }
];

// Dummy reservations data
const DUMMY_RESERVATIONS = [
  {
    id: "RES001",
    date: "2024-12-25T18:00:00Z",
    time: "18:00",
    guests: 4,
    status: "confirmed"
  },
  {
    id: "RES002",
    date: "2024-12-28T19:30:00Z",
    time: "19:30",
    guests: 2,
    status: "confirmed"
  },
  {
    id: "RES003",
    date: "2024-12-20T20:00:00Z",
    time: "20:00",
    guests: 6,
    status: "cancelled"
  },
  {
    id: "RES004",
    date: "2024-12-30T17:00:00Z",
    time: "17:00",
    guests: 3,
    status: "confirmed"
  }
];

// Static OTP for authentication
const STATIC_OTP = "676767";

interface UserProfile {
  name: string;
  gender: string;
  dateOfBirth: string;
  phone: string;
}

interface Reservation {
  id: string;
  date: string;
  time: string;
  guests: number;
  status: string;
}

type ReservationFilter = 'all' | 'confirmed' | 'cancelled';

export default function ProfilePage() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showMobilePopup, setShowMobilePopup] = useState(false);
  const [showOtpPopup, setShowOtpPopup] = useState(false);
  const [mobile, setMobile] = useState("");
  const [otpError, setOtpError] = useState("");
  const [mobileError, setMobileError] = useState("");
  const [resendTimer, setResendTimer] = useState(0);
  const [editForm, setEditForm] = useState({
    name: "",
    gender: "",
    dateOfBirth: ""
  });
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loadingReservations, setLoadingReservations] = useState(false);
  const [reservationFilter, setReservationFilter] = useState<ReservationFilter>('all');

  // Check authentication state
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userPhone = localStorage.getItem('userPhone');
    console.log('Initial token check:', token, 'Phone:', userPhone);
    
    if (!token || !userPhone) {
      setShowMobilePopup(true);
    } else {
      fetchProfile(userPhone);
    }
  }, []);

  // Fetch user profile from dummy data
  const fetchProfile = async (phone: string) => {
    console.log('Fetching profile for phone:', phone);
    
    setLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const userData = DUMMY_USERS.find(user => user.phone === phone);
      
      if (!userData) {
        throw new Error('User not found');
      }

      const profileData = {
        name: userData.name,
        gender: userData.gender,
        dateOfBirth: userData.dateOfBirth,
        phone: userData.phone
      };

      console.log('Processed profile data:', profileData);

      setProfile(profileData);
      setEditForm({
        name: profileData.name,
        gender: profileData.gender,
        dateOfBirth: profileData.dateOfBirth
      });
      setError("");
    } catch (err: unknown) {
      console.error('Profile fetch error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
      localStorage.removeItem('token');
      localStorage.removeItem('userPhone');
      setShowMobilePopup(true);
    } finally {
      setLoading(false);
    }
  };

  // Fetch user reservations from dummy data
  const fetchReservations = useCallback(async () => {
    setLoadingReservations(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      let filteredReservations = DUMMY_RESERVATIONS;
      
      if (reservationFilter === 'confirmed') {
        filteredReservations = DUMMY_RESERVATIONS.filter(r => r.status === 'confirmed');
      } else if (reservationFilter === 'cancelled') {
        filteredReservations = DUMMY_RESERVATIONS.filter(r => r.status === 'cancelled');
      }
      
      setReservations(filteredReservations);
    } catch (err) {
      console.error('Error fetching reservations:', err);
    } finally {
      setLoadingReservations(false);
    }
  }, [reservationFilter]);

  // Fetch reservations when profile is loaded
  useEffect(() => {
    if (profile) {
      fetchReservations();
    }
  }, [profile, fetchReservations]);

  // Format date and time
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      time: date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    };
  };

  // Handle mobile submit (send OTP)
  async function handleMobileSubmit(mobileNumber: string) {
    if (!/^\d{10}$/.test(mobileNumber)) {
      setMobileError("Please enter a valid 10-digit mobile number.");
      return;
    }
    
    // Check if user exists in dummy data
    const userExists = DUMMY_USERS.some(user => user.phone === mobileNumber);
    if (!userExists) {
      setMobileError("No account found with this mobile number. Please use: 1234567890, 9876543210, or 5555555555");
      return;
    }
    
    setMobileError("");
    setLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setMobile(mobileNumber);
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
      
    } catch (err: unknown) {
      console.error('OTP initiation error:', err);
      setMobileError('Failed to send OTP');
    } finally {
      setLoading(false);
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
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (otpValue !== STATIC_OTP) {
        throw new Error('Invalid OTP. Please use: 676767');
      }

      // Store token and phone
      const token = 'dummy-token-' + Date.now();
      localStorage.setItem('token', token);
      localStorage.setItem('userPhone', mobile);
      console.log('Token stored in localStorage');
      
      // Fetch profile with the stored phone
      await fetchProfile(mobile);
      setShowOtpPopup(false);
      
    } catch (err: unknown) {
      console.error('OTP verification error:', err);
      setOtpError(err instanceof Error ? err.message : 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  }

  // Handle resend OTP
  async function handleResendOtp() {
    if (resendTimer > 0) return;
    if (!mobile) {
      setOtpError('Session expired. Please try again.');
      return;
    }
    
    setLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setResendTimer(30);
      setOtpError("");
      
      let timer = 30;
      const interval = setInterval(() => {
        timer--;
        setResendTimer(timer);
        if (timer <= 0) clearInterval(interval);
      }, 1000);
      
    } catch (err: unknown) {
      console.error('Resend OTP error:', err);
      setOtpError('Failed to resend OTP');
    } finally {
      setLoading(false);
    }
  }

  // Add a helper function for showing toasts
  function showToast(message: string, type: 'success' | 'error') {
    const toast = document.createElement('div');
    toast.className = `fixed bottom-4 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg z-50 animate-slideUp ${
      type === 'success' ? 'bg-green-500' : 'bg-red-500'
    } text-white`;
    
    toast.innerHTML = `
      <div class="flex items-center gap-2">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          ${type === 'success' 
            ? '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />'
            : '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />'
          }
        </svg>
        <span>${message}</span>
      </div>
    `;
    
    document.body.appendChild(toast);
    
    // Remove toast after 3 seconds
    setTimeout(() => {
      toast.classList.add('animate-fadeOut');
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, 3000);
  }

  // Handle profile update
  const handleUpdateProfile = async () => {
    const token = localStorage.getItem('token');
    const userPhone = localStorage.getItem('userPhone');
    
    if (!token || !userPhone) {
      setShowMobilePopup(true);
      return;
    }

    setLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update the profile state
      const updatedProfile = {
        ...profile!,
        ...editForm
      };
      
      setProfile(updatedProfile);
      setError("");
      setIsEditing(false);
      showToast('Profile updated successfully!', 'success');

    } catch (err: unknown) {
      console.error('Update profile error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Handle logout
  const handleLogout = () => {
    // Clear token and phone from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('userPhone');
    // Reset profile state
    setProfile(null);
    // Navigate to home page
    router.push('/');
  };

  // Add new function to handle reservation cancellation
  async function handleCancelReservation(reservationId: string) {
    setLoadingReservations(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update the reservation status in dummy data
      const reservationIndex = DUMMY_RESERVATIONS.findIndex(r => r.id === reservationId);
      if (reservationIndex !== -1) {
        DUMMY_RESERVATIONS[reservationIndex].status = 'cancelled';
      }
      
      showToast('Reservation cancelled successfully!', 'success');
      await fetchReservations();
    } catch (err) {
      console.error('Error cancelling reservation:', err);
      showToast('Failed to cancel reservation. Please try again.', 'error');
    } finally {
      setLoadingReservations(false);
    }
  }

  // Add function to check if reservation is expired
  function isReservationExpired(datetime: string): boolean {
    const reservationDate = new Date(datetime);
    const now = new Date();
    return reservationDate < now;
  }

  // Add CSS animations to the global styles
  const globalStyles = `
    @keyframes slideUp {
      from {
        transform: translate(-50%, 100%);
        opacity: 0;
      }
      to {
        transform: translate(-50%, 0);
        opacity: 1;
      }
    }

    @keyframes fadeOut {
      from {
        opacity: 1;
      }
      to {
        opacity: 0;
      }
    }

    .animate-slideUp {
      animation: slideUp 0.3s ease-out forwards;
    }

    .animate-fadeOut {
      animation: fadeOut 0.3s ease-out forwards;
    }
  `;

  // Add the styles to the document head
  if (typeof document !== 'undefined') {
    const styleElement = document.createElement('style');
    styleElement.textContent = globalStyles;
    document.head.appendChild(styleElement);
  }

  if (!profile && !showMobilePopup && !showOtpPopup) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] flex items-center justify-center p-4">
        <div className="bg-[#2a2a2a] p-6 sm:p-10 rounded-3xl shadow-2xl max-w-md w-full border border-[#3a3a3a]">
          <div className="text-center mb-8 sm:mb-10">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-[#2EFFFF] rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 transform hover:scale-105 transition-transform duration-300">
              <FiUserIcon className="text-4xl sm:text-5xl text-black" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2 sm:mb-3">Welcome to Oasis</h1>
            <p className="text-gray-400 text-base sm:text-lg">Sign in to manage your profile and reservations</p>
            <div className="mt-4 p-3 bg-[#1a1a1a] rounded-lg">
              <p className="text-sm text-gray-400 mb-2">Demo Accounts:</p>
              <p className="text-xs text-[#2EFFFF]">1234567890, 9876543210, 5555555555</p>
              <p className="text-xs text-[#2EFFFF] mt-1">OTP: 676767</p>
            </div>
          </div>
          <Button
            className="w-full bg-[#2EFFFF] text-black font-bold rounded-2xl text-base sm:text-lg py-3 sm:py-4 shadow-lg hover:bg-[#222] hover:text-[#2EFFFF] transition-all duration-300 transform hover:scale-[1.02]"
            onClick={() => setShowMobilePopup(true)}
          >
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a] flex flex-col lg:flex-row">
      {/* Mobile Header */}
      <div className="lg:hidden bg-[#2a2a2a] p-4 border-b border-[#3a3a3a]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#2EFFFF] rounded-full flex items-center justify-center">
              <FiUserIcon className="text-xl text-black" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">{profile?.name || 'User'}</h2>
              <p className="text-gray-400 text-sm">{profile?.phone || 'No phone number'}</p>
            </div>
          </div>
          <Button
            className="bg-red-500 text-white font-bold rounded-xl px-4 py-2 shadow-lg hover:bg-red-600 transition-all duration-300 flex items-center gap-2"
            onClick={handleLogout}
          >
            <FiLogOut /> Logout
          </Button>
        </div>
      </div>

      {/* Sidebar - Hidden on mobile */}
      <div className="hidden lg:flex lg:w-64 bg-[#2a2a2a] border-r border-[#3a3a3a] flex-col h-screen sticky top-0">
        <div className="p-6">
          <div className="mb-8">
            <div className="w-20 h-20 bg-[#2EFFFF] rounded-full flex items-center justify-center mx-auto mb-4">
              <FiUserIcon className="text-3xl text-black" />
            </div>
            <h2 className="text-xl font-bold text-white text-center">{profile?.name || 'User'}</h2>
            <p className="text-gray-400 text-center text-sm">{profile?.phone || 'No phone number'}</p>
          </div>

          <nav className="space-y-2">
            <button className="w-full text-left px-4 py-3 rounded-xl bg-[#2EFFFF] text-black font-medium flex items-center gap-3">
              <FiUserIcon /> Profile
            </button>
          </nav>
        </div>

        <div className="mt-auto p-6 border-t border-[#3a3a3a]">
          <Button
            className="w-full bg-red-500 text-white font-bold rounded-xl px-4 py-3 shadow-lg hover:bg-red-600 transition-all duration-300 flex items-center justify-center gap-2"
            onClick={handleLogout}
          >
            <FiLogOut /> Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Profile Information</h1>
            <div className="flex gap-3">
              {!isEditing ? (
                <Button
                  className="flex-1 sm:flex-none bg-[#2EFFFF] text-black font-bold rounded-xl px-4 sm:px-6 py-2 sm:py-3 shadow-lg hover:bg-[#222] hover:text-[#2EFFFF] transition-all duration-300 flex items-center gap-2"
                  onClick={() => setIsEditing(true)}
                >
                  <FiEdit2 /> Edit Profile
                </Button>
              ) : (
                <Button
                  className="flex-1 sm:flex-none bg-[#2EFFFF] text-black font-bold rounded-xl px-4 sm:px-6 py-2 sm:py-3 shadow-lg hover:bg-[#222] hover:text-[#2EFFFF] transition-all duration-300 flex items-center gap-2"
                  onClick={handleUpdateProfile}
                >
                  <FiSave /> Save Changes
                </Button>
              )}
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl mb-6">
              {error}
            </div>
          )}

          {/* Profile Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
            <div className="space-y-4 sm:space-y-6">
              <div className="bg-[#2a2a2a] p-4 sm:p-6 rounded-2xl border border-[#3a3a3a]">
                <label className="block text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
                  <FiUserIcon className="text-[#2EFFFF]" /> Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl bg-[#1a1a1a] border border-[#3a3a3a] text-white focus:ring-2 focus:ring-[#2EFFFF] focus:border-transparent transition-all duration-300"
                    placeholder="Enter your name"
                  />
                ) : (
                  <div className="text-base sm:text-lg font-semibold text-white">
                    {profile?.name || 'Not set'}
                  </div>
                )}
              </div>

              <div className="bg-[#2a2a2a] p-4 sm:p-6 rounded-2xl border border-[#3a3a3a]">
                <label className="block text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
                  <FiPhone className="text-[#2EFFFF]" /> Phone Number
                </label>
                <div className="text-base sm:text-lg font-semibold text-white">
                  {profile?.phone || 'Not set'}
                </div>
              </div>
            </div>

            <div className="space-y-4 sm:space-y-6">
              <div className="bg-[#2a2a2a] p-4 sm:p-6 rounded-2xl border border-[#3a3a3a]">
                <label className="block text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
                  <FiUserIcon className="text-[#2EFFFF]" /> Gender
                </label>
                {isEditing ? (
                  <select
                    value={editForm.gender}
                    onChange={(e) => setEditForm({...editForm, gender: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl bg-[#1a1a1a] border border-[#3a3a3a] text-white focus:ring-2 focus:ring-[#2EFFFF] focus:border-transparent transition-all duration-300"
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                ) : (
                  <div className="text-base sm:text-lg font-semibold text-white capitalize">
                    {profile?.gender || 'Not set'}
                  </div>
                )}
              </div>

              <div className="bg-[#2a2a2a] p-4 sm:p-6 rounded-2xl border border-[#3a3a3a]">
                <label className="block text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
                  <FiCalendar className="text-[#2EFFFF]" /> Date of Birth
                </label>
                {isEditing ? (
                  <input
                    type="date"
                    value={editForm.dateOfBirth}
                    onChange={(e) => setEditForm({...editForm, dateOfBirth: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl bg-[#1a1a1a] border border-[#3a3a3a] text-white focus:ring-2 focus:ring-[#2EFFFF] focus:border-transparent transition-all duration-300"
                  />
                ) : (
                  <div className="text-base sm:text-lg font-semibold text-white">
                    {profile?.dateOfBirth ? new Date(profile.dateOfBirth).toLocaleDateString() : 'Not set'}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Reservations Section */}
          <div className="mt-8 sm:mt-12">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
                <FiCalendar className="text-[#2EFFFF]" /> My Reservations
              </h2>
              
              {/* Filter Tabs */}
              <div className="flex items-center gap-2 bg-[#2a2a2a] p-1 rounded-xl border border-[#3a3a3a]">
                <button
                  onClick={() => setReservationFilter('all')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    reservationFilter === 'all'
                      ? 'bg-[#2EFFFF] text-black'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setReservationFilter('confirmed')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    reservationFilter === 'confirmed'
                      ? 'bg-green-500 text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Confirmed
                </button>
                <button
                  onClick={() => setReservationFilter('cancelled')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    reservationFilter === 'cancelled'
                      ? 'bg-red-500 text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Cancelled
                </button>
              </div>
            </div>

            {loadingReservations ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2EFFFF]"></div>
              </div>
            ) : reservations.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {reservations.map((reservation) => {
                  const { date, time } = formatDateTime(reservation.date);
                  const isExpired = isReservationExpired(reservation.date);
                  const canCancel = !isExpired && reservation.status === 'confirmed';
                  
                  return (
                    <div 
                      key={reservation.id}
                      className="bg-[#2a2a2a] border border-[#3a3a3a] rounded-2xl p-4 sm:p-6 hover:border-[#2EFFFF] transition-all duration-300"
                    >
                      <div className="flex flex-col gap-4">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                          <div className="flex items-center gap-2 text-base sm:text-lg font-semibold text-white">
                            <FiCalendar className="text-[#2EFFFF]" />
                            {date}
                          </div>
                          <span className={`px-3 sm:px-4 py-1 rounded-full text-sm font-medium ${
                            isExpired 
                              ? 'bg-gray-500/10 text-gray-400'
                              : reservation.status === 'confirmed' 
                              ? 'bg-green-500/10 text-green-400'
                              : reservation.status === 'cancelled'
                              ? 'bg-red-500/10 text-red-400'
                              : 'bg-gray-500/10 text-gray-400'
                          }`}>
                            {isExpired ? 'Expired' : reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}
                          </span>
                        </div>
                        <div className="space-y-2 sm:space-y-3">
                          <div className="flex items-center gap-2 text-gray-400">
                            <FiClock className="text-[#2EFFFF]" />
                            {time}
                          </div>
                          <div className="flex items-center gap-2 text-gray-400">
                            <FiUsers className="text-[#2EFFFF]" />
                            {reservation.guests} {reservation.guests === 1 ? 'Person' : 'People'}
                          </div>
                        </div>
                        <div className="pt-3 border-t border-[#3a3a3a] flex flex-col gap-2">
                          <span className="text-sm text-gray-400">
                            Booking Code: <span className="font-mono font-semibold text-white">{reservation.id}</span>
                          </span>
                          <span className="text-sm text-gray-400">
                            Booked on: <span className="font-semibold text-white">{new Date(reservation.date).toLocaleDateString()}</span>
                          </span>
                          {canCancel && (
                            <Button
                              className="mt-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 font-medium rounded-lg px-4 py-2 transition-all duration-300 flex items-center justify-center gap-2"
                              onClick={() => handleCancelReservation(reservation.id)}
                            >
                              <FiX className="text-lg" /> Cancel Reservation
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 sm:py-12 bg-[#2a2a2a] rounded-2xl border border-[#3a3a3a]">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-[#1a1a1a] rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiCalendar className="text-xl sm:text-2xl text-gray-400" />
                </div>
                <p className="text-gray-400 text-base sm:text-lg">
                  {reservationFilter === 'all' 
                    ? 'No reservations found'
                    : `No ${reservationFilter} reservations found`}
                </p>
              </div>
            )}
          </div>
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
    </div>
  );
} 