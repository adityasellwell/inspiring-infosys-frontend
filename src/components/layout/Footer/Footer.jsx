import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import './Footer.css';

function Footer() {
  const currentYear = new Date().getFullYear();
  const location = useLocation();

  return (
    <footer className="footer">
      <div className="footer-glow"></div>

      <div className="container footer-grid">
        {/* Column 1: Brand details & description */}
        <div className="footer-col brand-col">
          <Link
            to="/"
            className="footer-logo-link"
            onClick={(e) => {
              if (location.pathname === '/') {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              } else {
                window.scrollTo({ top: 0 });
              }
            }}
          >
            <div className="footer-logo-wrapper">
              <img src=" public/images/logo2.png" alt="Inspiring Infosys Logo" className="footer-logo" />

            </div>
          </Link>
          <p className="footer-desc">
            We solve your complex technical and e-commerce problems so that you can focus on marketing and scaling your business profitably.
          </p>
          <div className="social-links">
            <a href="https://facebook.com/share/1DASqPGPm7/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" className="social-icon-btn" aria-label="Facebook">
              <FaFacebookF />
            </a>


            <a href="https://instagram.com/learnsellwell" target="_blank" rel="noopener noreferrer" className="social-icon-btn" aria-label="Instagram">
              <FaInstagram />
            </a>
            <a href="https://linkedin.com/company/inspiring-infosys" target="_blank" rel="noopener noreferrer" className="social-icon-btn" aria-label="LinkedIn">
              <FaLinkedinIn />
            </a>
          </div>
        </div>

        {/* Column 2: Quick Links */}
        <div className="footer-col">
          <h4 className="footer-heading">Company</h4>
          <ul className="footer-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/why-us">Why Us</Link></li>
            <li><Link to="/portfolio">Portfolio</Link></li>
            <li><Link to="/contact">Contact Us</Link></li>
          </ul>
        </div>

        {/* Column 3: Popular Services */}
        <div className="footer-col">
          <h4 className="footer-heading">Services</h4>
          <ul className="footer-links">
            <li><Link to="/api-services/amazon">Amazon API Integration</Link></li>
            <li><Link to="/development-services/website-development">Website Development</Link></li>
            <li><Link to="/development-services/software-development">Software Development</Link></li>
            <li><Link to="/development-services/app-development">Mobile App Dev</Link></li>
            <li><Link to="/more-services/seo-services">SEO & Digital Marketing</Link></li>
          </ul>
        </div>

        {/* Column 4: Contact Info */}
        <div className="footer-col contact-col">
          <h4 className="footer-heading">Reach Out</h4>
          <ul className="footer-contact-info">
            <li>
              <FaPhoneAlt className="contact-icon" />
              <span>+91 8444040514</span>
            </li>
            <li>
              <FaEnvelope className="contact-icon" />
              <span>info@inspiringinfosys.com</span>
            </li>
            <li>
              <FaMapMarkerAlt className="contact-icon" />
              <span>Vasai, Thane, Mumbai, MH, India - 401208</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright bar */}
      <div className="footer-bottom">
        <div className="container footer-bottom-container">
          <p>&copy; {currentYear} Inspiring Infosys. All rights reserved.</p>
          <div className="footer-bottom-links">
            <Link to="/privacy-policy">Privacy Policy</Link>
            <Link to="/terms-of-service">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
