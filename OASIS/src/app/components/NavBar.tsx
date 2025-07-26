'use client';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import './NavBar.css';
import logo from '../Assets/logo.png';
import BookingForm from './BookingForm';
import { FiUser } from 'react-icons/fi';
import Image from 'next/image';

const NavBar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showNav, setShowNav] = useState(true);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY < 10) {
        setShowNav(true);
        lastScrollY.current = window.scrollY;
        return;
      }
      if (window.scrollY > lastScrollY.current) {
        setShowNav(false); // scrolling down, hide
      } else {
        setShowNav(true); // scrolling up, show
      }
      lastScrollY.current = window.scrollY;
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent background scroll when booking form is open
  useEffect(() => {
    if (showBookingForm) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showBookingForm]);

  // Helper to close menu on mobile
  const handleNavClick = () => {
    setMenuOpen(false);
  };

  return (
    <>
      <nav className={`navbar${showNav ? ' navbar--visible' : ' navbar--hidden'}`}>
        <div className="navbar__logo">
          <Image src={logo.src} alt="Logo" className="navbar__icon" width={125} height={50} />
        </div>
        <div className={`navbar__links ${menuOpen ? 'open' : ''}`}> 
          <Link href="/" className="navbar__link" onClick={handleNavClick}>Home</Link>
          <Link href="/about" className="navbar__link" onClick={handleNavClick}>About</Link>
          <Link href="/menu" className="navbar__link" onClick={handleNavClick}>Menu</Link>
          <Link href="/contact" className="navbar__link" onClick={handleNavClick}>Contact</Link>
          <button
            className="navbar__book"
            onClick={() => { setShowBookingForm(true); setMenuOpen(false); }}
          >
            Reserve Table
          </button>
          <Link
            href="/profile"
            className="navbar__link profile-icon"
            onClick={handleNavClick}
            title="Profile"
          >
            <FiUser className="text-xl" />
          </Link>
        </div>
        <button className="navbar__toggle" onClick={() => setMenuOpen(!menuOpen)}>
          <span className="navbar__hamburger"></span>
          <span className="navbar__hamburger"></span>
          <span className="navbar__hamburger"></span>
        </button>
      </nav>
      {showBookingForm && (
        <BookingForm onClose={() => setShowBookingForm(false)} />
      )}
    </>
  );
};

export default NavBar;