import React from 'react';
import './Footer.css';
import logo from '../Assets/logo.png';
import Image from 'next/image';

const Footer = () => (
  <footer className="footer footer-dark">
    <div className="footer-main">
      <div className="footer-left">
        <div className="footer-logo-block">
          {/* <img src="/logo.png" alt="OasisLogo" className="footer-logo" /> */}
          <Image src={logo.src} alt="Logo" className="navbar__icon" width={125} height={50} />
          {/* <span className="footer-brand-dark">Oasis</span> */}
        </div>
        <div className="footer-contact-info">
          <div>123-456-7890</div>
          <div>info@oasis.com</div>
          <div>Coimbatore, Tamil Nadu 641035</div>
        </div>
      </div>
      <div className="footer-right">
        <div className="footer-connect-title">Connect with Us</div>
        <form className="footer-form" onSubmit={e => e.preventDefault()}>
          <label htmlFor="footer-email" className="footer-form-label">Email *</label>
          <input type="email" id="footer-email" className="footer-form-input" placeholder="Your email" required />
          <div className="footer-checkbox-row">
            <input type="checkbox" id="footer-subscribe" className="footer-checkbox" />
            <label htmlFor="footer-subscribe" className="footer-checkbox-label">Yes, subscribe me to your newsletter.</label>
          </div>
          <button type="submit" className="footer-form-btn">Submit</button>
        </form>
        <div className="footer-policy-links">
          <a href="#" className="footer-policy-link">Privacy Policy</a>
          <a href="#" className="footer-policy-link">Accessibility Statement</a>
          <a href="#" className="footer-policy-link">Terms &amp; Conditions</a>
          <a href="#" className="footer-policy-link">Refund Policy</a>
        </div>
      </div>
    </div>
    <div className="footer-bottom-dark">
      &copy; {new Date().getFullYear()} by Oasis. Powered and secured by <a href="#" className="footer-wix">Oasis</a>.
    </div>
  </footer>
);

export default Footer; 