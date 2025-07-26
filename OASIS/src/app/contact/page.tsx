"use client";
import '../components/HomeScreen.css';
import Footer from '../components/Footer';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col justify-center px-4 py-12">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8 items-start">
        {/* Left: Contact Info */}
        <div className="flex-1">
        <h1 className="hero-title">Crafted with Love,</h1>
          {/* <h1 className="text-[6vw] md:text-[120px] font-bold text-gray-300 leading-none mb-8" style={{lineHeight:1}}>Contact</h1> */}
          <br /><br /><br /><br />
          <div className="space-y-10 ">
            {/* Email */}
            <div>
              <div className="flex justify-between items-center text-xs text-gray-500 tracking-widest mb-1">
                <span>[ EMAIL ]</span>
                <a
                  href="mailto:hello@sample.com"
                  className="hover:underline cursor-pointer text-gray-500"
                  aria-label="Send Email"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  [ WRITE ]
                </a>
              </div>
              <div className="border-b border-gray-400 pb-3">
                <span className="text-xl md:text-2xl font-normal text-black">hello@sample.com</span>
              </div>
            </div>
            {/* Location */}
            <div>
              <div className="flex justify-between items-center text-xs text-gray-500 tracking-widest mb-1">
                <span>[ LOCATION ]</span>
                <a
                  href="https://maps.app.goo.gl/2McPi58UjUNSvzmWA"
                  className="hover:underline cursor-pointer text-gray-500"
                  aria-label="Open Location in Google Maps"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  [ TALK ]
                </a>
              </div>
              <div className="border-b border-gray-400 pb-3">
                <span className="text-xl md:text-2xl font-normal text-black">Coimbatore, Tamil Nadu </span>
              </div>
            </div>
            {/* Social */}
            <div>
              <div className="flex justify-between items-center text-xs text-gray-500 tracking-widest mb-1">
                <span>[ SOCIAL ]</span>
                <a
                  href="https://www.instagram.com/oasisrestaurantofficial?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
                  className="hover:underline cursor-pointer text-gray-500"
                  aria-label="Open Instagram"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  [ FOLLOW ]
                </a>
              </div>
              <div className="border-b border-gray-400 pb-3">
                <span className="text-xl md:text-2xl font-normal text-black">Instagram</span>
              </div>
            </div>
          </div>
        </div>

      </div>
      <br /><br /><br /><br />
      <Footer />
    </div>
  );
} 