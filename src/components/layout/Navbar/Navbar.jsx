import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX, FiChevronDown, FiSun, FiMoon } from 'react-icons/fi';
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
    { name: 'Amazon ', path: '/api-services/amazon' },
    { name: 'Flipkart ', path: '/api-services/flipkart' },
    { name: 'Jiomart ', path: '/api-services/jiomart' },
    { name: 'Myntra ', path: '/api-services/myntra' },
    { name: 'Meesho', path: '/api-services/meesho' },
  ];

  const developmentServices = [
    { name: 'Software Development', path: '/development-services/software-development' },
    { name: 'Website Development', path: '/development-services/website-development' },
    { name: 'App Development', path: '/development-services/app-development' },
    { name: 'Outsourcing & Consulting', path: '/development-services/outsourcing-consulting' },
    { name: 'IT Business Solutions', path: '/development-services/it-business-solution' },
    { name: 'ERP & CRM Solutions', path: '/development-services/erp-crm-solution' },
  ];

  const moreServices = [
    { name: 'Payment Gateway', path: '/more-services/payment-gateway-solution' },
    { name: 'Bulk SMS Services', path: '/more-services/bulk-sms-services' },
    { name: 'SEO Services', path: '/more-services/seo-services' },
    { name: 'Voice Call Provider', path: '/more-services/voice-call-provider' },
    { name: 'Shopify Website', path: '/more-services/build-shopify-website' },
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
              src=" public/images/logo2.png"
              alt="Inspiring Infosys Logo"
              className="navbar-logo navbar-logo-secondary"
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
            onMouseEnter={() => setActiveDropdown('services')}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button className="nav-dropdown-btn">
              Services <FiChevronDown className={`chevron-icon ${activeDropdown === 'services' ? 'rotate' : ''}`} />
            </button>
            <AnimatePresence>
              {activeDropdown === 'services' && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 15 }}
                  transition={{ duration: 0.2 }}
                  className="nav-megamenu"
                >
                  <div className="megamenu-grid">
                    {/* Column 1: API Services */}
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

                    {/* Column 2: Development Services */}
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

                    {/* Column 3: Additional Services */}
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

          <NavLink to="/why-us" className={({ isActive }) => `nav-link-item ${isActive ? 'active' : ''}`}>
            Why Us
          </NavLink>

          <NavLink to="/portfolio" className={({ isActive }) => `nav-link-item ${isActive ? 'active' : ''}`}>
            Portfolio
          </NavLink>

          <NavLink to="/contact" className={({ isActive }) => `nav-link-item ${isActive ? 'active' : ''}`}>
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
          <Link to="/contact" className="btn-primary-small">
            Reach Us
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
              <NavLink to="/why-us" className="mobile-nav-link">Why Us</NavLink>
              <NavLink to="/portfolio" className="mobile-nav-link">Portfolio</NavLink>

              {/* Unified Mobile Services Accordion */}
              <div className="mobile-accordion">
                <button className="mobile-accordion-header" onClick={() => toggleDropdown('services-m')}>
                  Services <FiChevronDown className={`chevron-icon ${activeDropdown === 'services-m' ? 'rotate' : ''}`} />
                </button>
                <div className={`mobile-accordion-content ${activeDropdown === 'services-m' ? 'open' : ''}`}>

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

                  {/* More Services Section */}
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

              <NavLink to="/contact" className="mobile-nav-link">Contact</NavLink>

              <div className="mobile-menu-cta">
                <Link to="/contact" className="btn-primary" style={{ width: '100%' }}>
                  Reach Us
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
