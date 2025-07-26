import { useState } from 'react';
import { Button } from "./ui/button";
import { FiX } from 'react-icons/fi';

interface OtpPopupProps {
  onClose: () => void;
  onOtpSubmit: (otp: string) => Promise<void>;
  onResendOtp: () => Promise<void>;
  onBackToMobile: () => void;
  mobile: string;
  loading: boolean;
  otpError: string;
  resendTimer: number;
}

export default function OtpPopup({ 
  onClose, 
  onOtpSubmit, 
  onResendOtp, 
  onBackToMobile,
  mobile,
  loading,
  otpError,
  resendTimer 
}: OtpPopupProps) {
  const [otp, setOtp] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onOtpSubmit(otp);
  };

  return (
    <div className="fixed inset-0 z-[1300] flex items-center justify-center bg-black/40 animate-fadeInUp">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md flex flex-col gap-6 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-2xl text-[#222]"
          aria-label="Close otp popup"
        >
          <FiX />
        </button>
        <div className="text-lg font-semibold text-[#222] mb-2">Sign up</div>
        <div className="text-center mb-2">
          <h2 className="text-2xl font-bold mb-2" style={{fontFamily: 'inherit'}}>Let&apos;s Fire Up the Celebration!</h2>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-[#222]">Mobile Number *</label>
            <button type="button" className="text-[#2EFFFF] text-sm font-semibold" onClick={onBackToMobile}>Change</button>
          </div>
          <div className="flex items-center border rounded-lg px-2 bg-[#fafafa]">
            <select className="bg-transparent outline-none text-base font-semibold py-3 pr-2" value={'+91'} disabled>
              <option value="+91">+91</option>
            </select>
            <input
              type="tel"
              value={mobile}
              disabled
              className="flex-1 bg-transparent px-2 py-3 text-base font-semibold outline-none border-0"
            />
          </div>
          <label className="text-sm font-semibold text-[#222]">OTP *</label>
          <input
            type="text"
            value={otp}
            onChange={e => setOtp(e.target.value)}
            placeholder="Enter Your OTP"
            className="w-full px-4 py-3 rounded-lg border border-[#e0e0e0] focus:outline-none focus:ring-2 focus:ring-[#2EFFFF] text-base font-semibold bg-[#fafafa] placeholder-gray-400 shadow-sm"
            maxLength={6}
            autoFocus
          />
          {otpError && <div className="text-red-500 text-sm font-medium">{otpError}</div>}
          <div className="flex items-center gap-2 w-full mt-2">
            <Button
              type="button"
              className="bg-[#2EFFFF] text-black font-bold rounded-lg flex items-center gap-1 px-3 py-2 text-base shadow-md hover:bg-[#222] hover:text-[#2EFFFF] transition-all"
              onClick={onResendOtp}
              disabled={resendTimer > 0 || loading}
            >
              Resend OTP{resendTimer > 0 ? ` (${resendTimer}s)` : ""}
            </Button>
            <Button 
              type="submit" 
              className="bg-[#2EFFFF] text-black font-bold rounded-lg flex-1 text-base py-2 shadow-md hover:bg-[#222] hover:text-[#000] transition-all" 
              disabled={loading}
            >
              {loading ? 'Verifying...' : 'Verify'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
} 