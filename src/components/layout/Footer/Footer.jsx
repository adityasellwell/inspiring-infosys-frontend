import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import { FiUsers } from 'react-icons/fi';
import './Footer.css';

function Footer() {
  const currentYear = new Date().getFullYear();
  const location = useLocation();

  const [visitorCount, setVisitorCount] = React.useState(0);
  const fetchedRef = React.useRef(false);

  React.useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    const hasVisited = localStorage.getItem('inspiring_infosys_visited');
    const key = 'inspiring-infosys-unique-visitors-v1';

    if (!hasVisited) {
      // New unique visitor -> Increment the count
      fetch(`https://countapi.mileshilliard.com/api/v1/hit/${key}`)
        .then((res) => res.json())
        .then((data) => {
          if (data && typeof data.value === 'number') {
            setVisitorCount(data.value + 50000); // Add 50,000 to the actual count
            localStorage.setItem('inspiring_infosys_visited', 'true');
          } else {
            setVisitorCount(50000);
          }
        })
        .catch((err) => {
          console.error('Error incrementing visitor count:', err);
          setVisitorCount(50000);
        });
    } else {
      // Returning visitor -> Just get the current count without incrementing
      fetch(`https://countapi.mileshilliard.com/api/v1/get/${key}`)
        .then((res) => res.json())
        .then((data) => {
          if (data && typeof data.value === 'number') {
            setVisitorCount(data.value + 50000); // Add 50,000 to the actual count
          } else {
            setVisitorCount(50000); // Default to 50,000
          }
        })
        .catch((err) => {
          console.error('Error fetching visitor count:', err);
          setVisitorCount(50000);
        });
    }
  }, []);

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
              <img src="/images/logo2.webp" alt="Inspiring Infosys Logo" className="footer-logo" loading="lazy" decoding="async" />
            </div>
          </Link>

          <p className="footer-desc">
            We solve your complex technical and e-commerce problems so that you can focus on marketing and scaling your business profitably.
          </p>

          <div className="social-links">
            <a
              href="https://facebook.com/share/1DASqPGPm7/?mibextid=wwXIfr"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon-btn facebook"
              aria-label="Facebook"
            >
              <FaFacebookF />
            </a>

            <a
              href="https://instagram.com/learnsellwell"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon-btn instagram"
              aria-label="Instagram"
            >
              <FaInstagram />
            </a>

            <a
              href="https://linkedin.com/company/inspiring-infosys"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon-btn linkedin"
              aria-label="LinkedIn"
            >
              <FaLinkedinIn />
            </a>
          </div>

          {/* Visitor Count Badge */}
          <div className="visitor-count-badge">
            <FiUsers className="visitor-icon" />
            <span className="visitor-text">Visitor Count:</span>
            <span className="visitor-number">{visitorCount}</span>
          </div>
        </div>

        {/* Column 2: Quick Links */}
        <div className="footer-col">
          <h4 className="footer-heading">Company</h4>
          <ul className="footer-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/why-us/it-company-in-mumbai">Why Us</Link></li>
            <li><Link to="/portfolio/ecommerce-development-company-in-mumbai">Portfolio</Link></li>
            <li><Link to="/contact/ecommerce-management-company-in-mumbai">Contact Us</Link></li>
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