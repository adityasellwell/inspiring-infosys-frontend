import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX, FiChevronDown, FiSun, FiMoon, FiArrowRight } from 'react-icons/fi';
import './Navbar.css';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [logoHovered, setLogoHovered] = useState(false);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });
  const location = useLocation();
  const closeTimeoutRef = useRef(null);

  const handleMouseEnter = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setActiveDropdown('services');
  };

  const handleMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 120); // 120ms delay - fast exit but holds for quick slips
  };

  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  // Dark Mode toggling effect
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // Close mobile menu on page change
  useEffect(() => {
    setIsOpen(false);
    setActiveDropdown(null);
  }, [location]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle scroll detection for glassmorphism styling
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);

  const toggleDropdown = (dropdown) => {
    if (activeDropdown === dropdown) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(dropdown);
    }
  };

  const apiServices = [
    { name: 'Amazon ', path: '/api-services/amazon-api-service-provider-in-mumbai' },
    { name: 'Flipkart ', path: '/api-services/flipkart-api-service-provider-in-mumbai' },
    { name: 'Jiomart ', path: '/api-services/jiomart-api-service-provider-in-mumbai' },
    { name: 'Myntra ', path: '/api-services/myntra-api-service-provider-in-mumbai' },
    { name: 'Meesho', path: '/api-services/meesho-api-service-provider-in-mumbai' },
  ];

  const developmentServices = [
    { name: 'Software Development', path: '/development-services/software-development-service-in-mumbai' },
    { name: 'Website Development', path: '/development-services/website-development-service-in-mumbai' },
    { name: 'App Development', path: '/development-services/mobile-app-development-service-in-mumbai' },
    { name: 'Outsourcing & Consulting', path: '/development-services/outsource-consulting-service-in-mumbai' },
    { name: 'IT Business Solutions', path: '/development-services/it-business-solution-in-mumbai' },
    { name: 'ERP & CRM Solutions', path: '/development-services/erp-crm-solution-in-mumbai' },
  ];

  const moreServices = [
    { name: 'Payment Gateway', path: '/more-services/payment-gateway-solution-in-mumbai' },
    { name: 'Bulk SMS Services', path: '/more-services/bulk-sms-service-in-mumbai' },
    { name: 'SEO Services', path: '/more-services/seo-service-provider-in-mumbai' },
    { name: 'Voice Call Provider', path: '/more-services/voice-call-service-provider-in-mumbai' },
    { name: 'Shopify Website', path: '/more-services/shopify-website-build-in-mumbai' },
  ];

  const businessCardFeatures = [
    { name: 'AI Card Recognition', path: '/business-tools/business-card-scanner-in-mumbai' },
    { name: 'WhatsApp Based', path: '/business-tools/business-card-scanner-in-mumbai' },
    { name: 'Google Sheets Export', path: '/business-tools/business-card-scanner-in-mumbai' },
    { name: 'CRM Integration', path: '/business-tools/business-card-scanner-in-mumbai' },
    { name: 'Bulk Processing', path: '/business-tools/business-card-scanner-in-mumbai' },
  ];

  const whatsappApi = [
    { name: 'Connect WhatsApp', path: '/whatsapp-api/whatsapp-business-api-provider-in-mumbai' },
    { name: 'Shared Live Chat', path: '/whatsapp-api/whatsapp-shared-inbox-in-mumbai' },
    { name: 'Contact Organizer', path: '/whatsapp-api/whatsapp-contact-management-in-mumbai' },
    { name: 'Message Templates', path: '/whatsapp-api/whatsapp-message-template-service-in-mumbai' },
    { name: 'Broadcast Campaigns', path: '/whatsapp-api/whatsapp-broadcast-service-in-mumbai' },
    { name: 'Automated Order Alerts', path: '/whatsapp-api/whatsapp-order-notification-service-in-mumbai' },
  ];


  return (
    <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
      <div className="navbar-container container">

        {/* Logo Section */}
        <Link
          to="/"
          className="navbar-logo-link"
          onClick={(e) => {
            if (location.pathname === '/') {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
              window.scrollTo({ top: 0 });
            }
          }}
        >
          <div className="navbar-logo-wrapper">

            <img
              src="/images/logo2.png"
              alt="Inspiring Infosys Logo"
              className="navbar-logo"
            />

          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="navbar-links-desktop">
          <NavLink to="/" className={({ isActive }) => `nav-link-item ${isActive ? 'active' : ''}`}>
            Home
          </NavLink>

          {/* Combined Services Mega Menu Dropdown */}
          <div
            className="nav-dropdown-wrapper"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <button className="nav-dropdown-btn">
              Services <FiChevronDown className={`chevron-icon ${activeDropdown === 'services' ? 'rotate' : ''}`} />
            </button>
            <AnimatePresence>
              {activeDropdown === 'services' && (
                <motion.div
                  initial={{ opacity: 0, y: 15, x: '-50%' }}
                  animate={{ opacity: 1, y: 0, x: '-50%' }}
                  exit={{ opacity: 0, y: 15, x: '-50%' }}
                  transition={{ duration: 0.2 }}
                  className="nav-megamenu"
                >
                  <div className="megamenu-grid">
                    {/* Column 1: Business Card Scanner */}
                    <div className="megamenu-col">
                      <h4 className="megamenu-heading">Business Card Scanner</h4>
                      <div className="megamenu-links">
                        {businessCardFeatures.map((service, idx) => (
                          <Link key={idx} to={service.path} className="megamenu-link-item">
                            {service.name}
                          </Link>
                        ))}
                      </div>
                    </div>

                    {/* Column 2: WhatsApp API */}
                    <div className="megamenu-col">
                      <h4 className="megamenu-heading">WhatsApp API</h4>
                      <div className="megamenu-links">
                        {whatsappApi.map((service, idx) => (
                          <Link key={idx} to={service.path} className="megamenu-link-item">
                            {service.name}
                          </Link>
                        ))}
                      </div>
                    </div>

                    {/* Column 3: API Services */}
                    <div className="megamenu-col">
                      <h4 className="megamenu-heading">API Services</h4>
                      <div className="megamenu-links">
                        {apiServices.map((service, idx) => (
                          <Link key={idx} to={service.path} className="megamenu-link-item">
                            {service.name}
                          </Link>
                        ))}
                      </div>
                    </div>

                    {/* Column 4: Development Services */}
                    <div className="megamenu-col">
                      <h4 className="megamenu-heading">Development</h4>
                      <div className="megamenu-links">
                        {developmentServices.map((service, idx) => (
                          <Link key={idx} to={service.path} className="megamenu-link-item">
                            {service.name}
                          </Link>
                        ))}
                      </div>
                    </div>

                    {/* Column 5: More Offerings */}
                    <div className="megamenu-col">
                      <h4 className="megamenu-heading">More Offerings</h4>
                      <div className="megamenu-links">
                        {moreServices.map((service, idx) => (
                          <Link key={idx} to={service.path} className="megamenu-link-item">
                            {service.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <NavLink to="/ecommerce-services" className={({ isActive }) => `nav-link-item ${isActive ? 'active' : ''}`}>
            E-Com Automation
          </NavLink>

          <NavLink to="/why-us/it-company-in-mumbai" className={({ isActive }) => `nav-link-item ${isActive ? 'active' : ''}`}>
            Why Us
          </NavLink>

          <NavLink to="/portfolio/ecommerce-development-company-in-mumbai" className={({ isActive }) => `nav-link-item ${isActive ? 'active' : ''}`}>
            Portfolio
          </NavLink>

          <NavLink to="/course/ecommerce-courses-in-mumbai" className={({ isActive }) => `nav-link-item ${isActive ? 'active' : ''}`}>
            Course
          </NavLink>

          <NavLink to="/contact/ecommerce-management-company-in-mumbai" className={({ isActive }) => `nav-link-item ${isActive ? 'active' : ''}`}>
            Contact
          </NavLink>
        </div>

        {/* Desktop Reach Us CTA & Theme Toggle */}
        <div className="navbar-actions-desktop">
          <button
            className="theme-toggle-btn"
            onClick={toggleTheme}
            aria-label="Toggle Dark Mode"
          >
            {theme === 'light' ? <FiMoon size={20} /> : <FiSun size={20} />}
          </button>
          <Link to="/get-quote" className="btn-primary-small" style={{ background: 'linear-gradient(135deg, #0d62a9 0%, #0a8fd4 40%, #06b6d4 70%)', color: 'white', border: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
            Get a Quote <FiArrowRight />
          </Link>
        </div>

        {/* Mobile Actions (Theme Toggle & Hamburger) */}
        <div className="navbar-actions-mobile">
          <button
            className="theme-toggle-btn"
            onClick={toggleTheme}
            aria-label="Toggle Dark Mode"
          >
            {theme === 'light' ? <FiMoon size={20} /> : <FiSun size={20} />}
          </button>
          <button className="navbar-hamburger" onClick={toggleMenu} aria-label="Toggle Navigation Menu">
            {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="navbar-menu-mobile"
          >
            <div className="mobile-menu-container container">
              <NavLink to="/" className="mobile-nav-link">Home</NavLink>
              <NavLink to="/ecommerce-services" className="mobile-nav-link">E-Com Automation</NavLink>

              {/* Unified Mobile Services Accordion */}
              <div className="mobile-accordion">
                <button className="mobile-accordion-header" onClick={() => toggleDropdown('services-m')}>
                  Services <FiChevronDown className={`chevron-icon ${activeDropdown === 'services-m' ? 'rotate' : ''}`} />
                </button>
                <div className={`mobile-accordion-content ${activeDropdown === 'services-m' ? 'open' : ''}`}>

                  {/* Business Card Scanner Section */}
                  <div className="mobile-submenu-group">
                    <h5 className="mobile-submenu-title">Business Card Scanner</h5>
                    {businessCardFeatures.map((service, idx) => (
                      <Link key={idx} to={service.path} className="mobile-dropdown-link">
                        {service.name}
                      </Link>
                    ))}
                  </div>

                  {/* WhatsApp API Section */}
                  <div className="mobile-submenu-group">
                    <h5 className="mobile-submenu-title">WhatsApp API</h5>
                    {whatsappApi.map((service, idx) => (
                      <Link key={idx} to={service.path} className="mobile-dropdown-link">
                        {service.name}
                      </Link>
                    ))}
                  </div>

                  {/* API Services Section */}
                  <div className="mobile-submenu-group">
                    <h5 className="mobile-submenu-title">API Services</h5>
                    {apiServices.map((service, idx) => (
                      <Link key={idx} to={service.path} className="mobile-dropdown-link">
                        {service.name}
                      </Link>
                    ))}
                  </div>

                  {/* Development Services Section */}
                  <div className="mobile-submenu-group">
                    <h5 className="mobile-submenu-title">Development</h5>
                    {developmentServices.map((service, idx) => (
                      <Link key={idx} to={service.path} className="mobile-dropdown-link">
                        {service.name}
                      </Link>
                    ))}
                  </div>

                  {/* More Offerings Section */}
                  <div className="mobile-submenu-group">
                    <h5 className="mobile-submenu-title">More Offerings</h5>
                    {moreServices.map((service, idx) => (
                      <Link key={idx} to={service.path} className="mobile-dropdown-link">
                        {service.name}
                      </Link>
                    ))}
                  </div>

                </div>
              </div>

              <NavLink to="/why-us/it-company-in-mumbai" className="mobile-nav-link">Why Us</NavLink>
              <NavLink to="/portfolio/ecommerce-development-company-in-mumbai" className="mobile-nav-link">Portfolio</NavLink>
              <NavLink to="/course/ecommerce-courses-in-mumbai" className="mobile-nav-link">Course</NavLink>
              <NavLink to="/contact/ecommerce-management-company-in-mumbai" className="mobile-nav-link">Contact</NavLink>

              <div className="mobile-menu-cta">
                <Link 
                  to="/get-quote" 
                  className="btn-primary" 
                  style={{ background: 'linear-gradient(135deg, #0d62a9 0%, #0a8fd4 40%, #06b6d4 70%)', color: 'white', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                  onClick={() => setIsOpen(false)}
                >
                  Get a Quote <FiArrowRight />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

export default Navbar;
