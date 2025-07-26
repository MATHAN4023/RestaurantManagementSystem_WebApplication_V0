import { useState } from 'react';
import { Button } from "./ui/button";
import { FiX } from 'react-icons/fi';

interface MobilePopupProps {
  onClose: () => void;
  onMobileSubmit: (mobile: string) => Promise<void>;
  loading: boolean;
  mobileError: string;
}

export default function MobilePopup({ onClose, onMobileSubmit, loading, mobileError }: MobilePopupProps) {
  const [mobile, setMobile] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onMobileSubmit(mobile);
  };

  return (
    <div className="fixed inset-0 z-[1300] flex items-center justify-center bg-black/40 animate-fadeInUp">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md flex flex-col gap-6 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-2xl text-[#222]"
          aria-label="Close mobile popup"
        >
          <FiX />
        </button>
        <div className="text-lg font-semibold text-[#222] mb-2">Login</div>
        <div className="text-center mb-2">
          <h2 className="text-2xl font-bold mb-2" style={{fontFamily: 'inherit'}}>Let&apos;s Fire Up the Celebration!</h2>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
          <label className="text-sm font-semibold text-[#222] text-left">Mobile Number</label>
          <div className="flex items-center border rounded-lg px-2 bg-[#fafafa] focus-within:ring-2 focus-within:ring-[#2EFFFF]">
            <select className="bg-transparent outline-none text-base font-semibold py-3 pr-2" value={'+91'} disabled>
              <option value="+91">+91</option>
            </select>
            <input
              type="tel"
              value={mobile}
              onChange={e => setMobile(e.target.value)}
              placeholder="Enter Your Number"
              className="flex-1 bg-transparent px-2 py-3 text-base font-semibold outline-none border-0"
              maxLength={10}
              autoFocus
            />
          </div>
          {mobileError && <div className="text-red-500 text-sm font-medium">{mobileError}</div>}
          <Button type="submit" className="w-full bg-[#2EFFFF] text-black font-bold rounded-lg text-lg py-3 shadow-md hover:bg-[#222] hover:text-[#000] transition-all" disabled={loading}>
            {loading ? 'Sending...' : 'Next'}
          </Button>
        </form>
      </div>
    </div>
  );
} 