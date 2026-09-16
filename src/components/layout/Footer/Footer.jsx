import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import { FiUsers } from 'react-icons/fi';
import { statsApi } from '../../../api/api';
import './Footer.css';

function Footer() {
  const currentYear = new Date().getFullYear();
  const location = useLocation();

  const [visitorCount, setVisitorCount] = React.useState(50215);
  const fetchedRef = React.useRef(false);

  React.useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    // Session & Returning visit tracking keys
    const SESSION_KEY = 'inspiring_infosys_session_active';
    const LAST_VISIT_TIME_KEY = 'inspiring_infosys_last_visit_timestamp';
    const now = Date.now();
    const THIRTY_MINUTES = 30 * 60 * 1000; // 30 mins session window

    const isSessionActive = sessionStorage.getItem(SESSION_KEY);
    const lastVisitTimestamp = localStorage.getItem(LAST_VISIT_TIME_KEY);

    // If new session or returning after 30+ minutes of inactivity, count as unique visit
    const isNewUniqueVisit = !isSessionActive || !lastVisitTimestamp || (now - parseInt(lastVisitTimestamp, 10) > THIRTY_MINUTES);

    if (isNewUniqueVisit) {
      statsApi.hitVisitorCount()
        .then((res) => {
          if (res && res.success && typeof res.count === 'number') {
            setVisitorCount(res.count);
          }
          sessionStorage.setItem(SESSION_KEY, 'true');
          localStorage.setItem(LAST_VISIT_TIME_KEY, String(now));
        })
        .catch(() => {
          setVisitorCount(50215);
          sessionStorage.setItem(SESSION_KEY, 'true');
          localStorage.setItem(LAST_VISIT_TIME_KEY, String(now));
        });
    } else {
      // Same session internal navigation -> Fetch current count without incrementing
      statsApi.getVisitorCount()
        .then((res) => {
          if (res && res.success && typeof res.count === 'number') {
            setVisitorCount(res.count);
          }
          localStorage.setItem(LAST_VISIT_TIME_KEY, String(now));
        })
        .catch(() => {
          setVisitorCount(50215);
          localStorage.setItem(LAST_VISIT_TIME_KEY, String(now));
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
            <li><Link to="/api-services/amazon-api-service-provider-in-mumbai">Amazon API Integration</Link></li>
            <li><Link to="/development-services/website-development-service-in-mumbai">Website Development</Link></li>
            <li><Link to="/development-services/software-development-service-in-mumbai">Software Development</Link></li>
            <li><Link to="/development-services/mobile-app-development-service-in-mumbai">Mobile App Dev</Link></li>
            <li><Link to="/more-services/seo-and-digital-marketing-service-in-mumbai">SEO & Digital Marketing</Link></li>
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
              <span>203, Second Floor, DJ Arcade, Behind Dhuri Arcade, Near Navghar Bus Depot, Next to Rishikesh Hotel, Vasai West, Mumbai, Maharashtra - 401202</span>
            </li>
          </ul>

          <div className="social-links" style={{ marginTop: '0.5rem' }}>
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
        </div>
      </div>

      {/* Copyright bar */}
      <div className="footer-bottom">
        <div className="container footer-bottom-container">
          <p>&copy; {currentYear} Inspiring Infosys. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;