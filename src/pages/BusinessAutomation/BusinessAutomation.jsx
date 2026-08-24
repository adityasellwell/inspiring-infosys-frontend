import React, { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiArrowRight, FiSliders, FiTrendingUp, FiShoppingBag, FiLayers, FiTag, FiShield, FiCheckCircle,
  FiUpload, FiMessageSquare, FiCpu, FiFileText, FiCheck, FiDatabase, FiUsers, FiLock
} from 'react-icons/fi';
import './BusinessAutomation.css';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const AUTOMATION_DATA = {
  'account-management': {
    name: 'Account Management',
    image: '/images/sellwellbgremoved.png',
    title: 'Complete E-Commerce Account Management',
    desc: 'SellWell will manage all your seller accounts across different E-Commerce platforms. We actively monitor performance metrics, escalate guideline and policy changes, and provide solutions for account flags so your seller rating remains optimal.',
    details: [
      { title: 'Multi-Channel Operations', desc: 'Daily listing updates, catalog checks, and stock management on Amazon, Flipkart, Meesho, Myntra, and more.' },
      { title: 'Compliance & Violation Auditing', desc: 'Active policy warning checks, rapid listing dispute filing, and account health reviews.' },
      { title: 'Consultation & Growth Strategy', desc: 'Regular reviews of customer ratings, feedback logs, and strategy suggestions to double organic revenue.' },
    ],
  },
  'advertising-marketing': {
    name: 'Advertising & Marketing',
    image: '/img/ads.png',
    title: 'Revenue-Oriented PPC Ad Campaigns & Marketing',
    desc: 'Generate maximum profitability. After deep research of competitors and keywords, we suggest and implement the best PPC ad structures, optimize search-term bids daily, and configure lightning deals for a high return on investment.',
    details: [
      { title: 'PPC Bidding Optimization', desc: 'Automated and custom bidding rules to decrease ACOS and improve sponsored search exposure.' },
      { title: 'Promo & Deal Strategies', desc: 'Setting up coupons, brand discounts, buy-one-get-one deals, and seasonal sales events.' },
      { title: 'In-Depth Performance Audits', desc: 'Reporting traffic logs, conversion rates, cost-per-click statistics, and ad budget allocations.' },
    ],
  },
  'product-content-listing': {
    name: 'Product Listing & Content',
    image: '/img/catalog.png',
    title: 'High-Converting Product Content & Catalog Listings',
    desc: 'Build discoverability across marketplaces. We create rich product catalogs with search-optimized titles, comparative charts, bullet descriptions, and immersive A+ brand store graphics to convert page visits into orders.',
    details: [
      { title: 'Optimized Meta Titles', desc: 'Research-focused product headlines and attributes matching buyer search intent.' },
      { title: 'A+ Content Layouts', desc: 'Designing image banners, detailed comparison charts, and brand stories.' },
      { title: 'Seller Store Designs', desc: 'Developing multipage official brand stores on Amazon to showcase your entire catalog.' },
    ],
  },
  'inventory-order-sync': {
    name: 'Inventory & Order Sync',
    image: '/img/auto.png',
    title: 'Automated Real-Time Inventory & Order Lifecycle Management',
    desc: 'Avoid cancellation penalties and out-of-stock listings. We implement centralized tracking for incoming warehouse stock, purchase orders, client dispatches, courier handovers, and return logistics logs.',
    details: [
      { title: 'Centralized Stock Control', desc: 'Continuous catalog sync across channels to prevent stockouts and overselling.' },
      { title: 'Fast Order Fulfillment', desc: 'Syncing new customer dispatches, printing handover slips, and checking logistics sheets.' },
      { title: 'Returns Reconciliation', desc: 'Detailed tracking for courier return parcels, client returns, and catalog replacements.' },
    ],
  },
  'automated-pricing': {
    name: 'Automated Pricing Rules',
    image: '/img/autoprice.png',
    title: 'Dynamic Automated Pricing Tools & Buy Box Protection',
    desc: 'Win the Buy Box instantly. Configure smart pricing rules that respond to competitor price changes in real-time. Set customized threshold rules that protect your profit margins while keeping listings highly competitive.',
    details: [
      { title: 'Real-Time Competitor Match', desc: 'Instantly adjust listing prices to stay ahead of competing catalog offers.' },
      { title: 'Threshold Safeguards', desc: 'Configure strict minimum and maximum price bounds to prevent margins from slipping.' },
      { title: 'Defined Rule Settings', desc: 'Create tailored formulas matching product batches, shipping rules, and wholesale sheets.' },
    ],
  },
  'brand-protection': {
    name: 'Brand Protection & Reinstate Support',
    image: '/img/highjack.png',
    title: 'Brand Registry, Hijacker Removal, & Listing Restoration',
    desc: 'Protect your brand identity. We guide you through trademark registration, apply for official marketplace brand registries, file policy warnings against hijackers, and submit search & rescue listing appeals to reinstate suppressed products.',
    details: [
      { title: 'Brand Registry Setup', desc: 'Registering your brand on Amazon and Flipkart to gain access to protective tools and rich A+ layouts.' },
      { title: 'Hijacker Listing Removal', desc: 'Identify unauthorized catalog sellers and file official intellectual property violations.' },
      { title: 'Appeal & Reinstate Support', desc: 'Write POA (Plan of Action) appeals to restore blocked listings or suspended seller accounts.' },
    ],
  },
  'business-card-scanner': {
    name: 'Business Card Scanner',
    image: '/img/card.png',
    title: 'AI-Powered Business Card Scanner (Agent Tap2Read)',
    desc: 'Turn business cards into leads instantly. Send a business card image on WhatsApp and instantly capture contact information, organize it automatically, export to sheets, and sync with your CRM.',
    details: [
      { title: 'AI Card Recognition', desc: 'Automatically extract names, phone numbers, emails, and company details with 98% accuracy.' },
      { title: 'WhatsApp Based', desc: 'No app download required. Just take a photo and send it directly on WhatsApp.' },
      { title: 'CRM & Sheets Integration', desc: 'Export contact data directly to Google Sheets and sync with HubSpot or Salesforce workflows.' },
    ],
  },
};

const TABS = ['account-management', 'advertising-marketing', 'product-content-listing', 'inventory-order-sync', 'automated-pricing', 'brand-protection', 'business-card-scanner'];

const TAB_SLUGS = {
  'account-management': 'account-management-service-in-mumbai',
  'advertising-marketing': 'ecommerce-advertising-marketing-in-mumbai',
  'product-content-listing': 'product-listing-service-in-mumbai',
  'inventory-order-sync': 'inventory-order-sync-service-in-mumbai',
  'automated-pricing': 'automated-pricing-service-in-mumbai',
  'brand-protection': 'ecommerce-brand-protection-in-mumbai',
  'business-card-scanner': 'business-card-scanner-in-mumbai', // This one goes under /business-tools
};

function BusinessAutomation() {
  const { serviceId } = useParams();
  const navigate = useNavigate();

  const getActiveTab = () => {
    if (!serviceId) return 'account-management';
    const lowercaseId = serviceId.toLowerCase();

    // Exact mapping from the new SEO slugs
    if (lowercaseId.includes('account-management')) return 'account-management';
    if (lowercaseId.includes('advertising-marketing')) return 'advertising-marketing';
    if (lowercaseId.includes('product-listing') || lowercaseId.includes('content')) return 'product-content-listing';
    if (lowercaseId.includes('inventory-order-sync')) return 'inventory-order-sync';
    if (lowercaseId.includes('automated-pricing')) return 'automated-pricing';
    if (lowercaseId.includes('brand-protection')) return 'brand-protection';
    if (lowercaseId.includes('business-card-scanner')) return 'business-card-scanner';

    // Fallback parsing just in case
    if (lowercaseId.includes('account')) return 'account-management';
    if (lowercaseId.includes('advertising') || lowercaseId.includes('marketing')) return 'advertising-marketing';
    if (lowercaseId.includes('listing')) return 'product-content-listing';
    if (lowercaseId.includes('inventory') || lowercaseId.includes('order')) return 'inventory-order-sync';
    if (lowercaseId.includes('pricing')) return 'automated-pricing';
    if (lowercaseId.includes('brand')) return 'brand-protection';
    if (lowercaseId.includes('card') || lowercaseId.includes('scanner')) return 'business-card-scanner';

    return 'account-management';
  };

  const activeTab = getActiveTab();

  useEffect(() => {
    // If no serviceId, or it's using the old generic route without an ID
    if (!serviceId) {
      navigate(`/ecommerce-services/${TAB_SLUGS['account-management']}`, { replace: true });
    } else if (window.location.pathname.startsWith('/business-automation')) {
      // Auto-redirect from old /business-automation/slug to new SEO routes
      const basePath = activeTab === 'business-card-scanner' ? '/business-tools' : '/ecommerce-services';
      navigate(`${basePath}/${TAB_SLUGS[activeTab]}`, { replace: true });
    }
  }, [serviceId, navigate, activeTab]);

  const handleTabChange = (tabId) => {
    const basePath = tabId === 'business-card-scanner' ? '/business-tools' : '/ecommerce-services';
    navigate(`${basePath}/${TAB_SLUGS[tabId]}`, { state: { noScroll: true } });
  };

  const activeService = AUTOMATION_DATA[activeTab];

  if (!activeService) return null;

  return (
    <div className="business-automation-page">
      {/* ── Page Hero ────────────────────────────────────────────── */}
      <section className="inner-page-hero">
        <div className="inner-page-hero-overlay"></div>
        <div className="container inner-page-hero-content">
          <motion.span
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="section-badge"
          >
            Management & Automation
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="page-hero-title"
          >
            Business Automation
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="page-hero-sub"
          >
            Automate marketplace catalog updates, track inventory and dispatches, optimize PPC ads, and protect your brand policy.
          </motion.p>
        </div>
      </section>

      {/* ── Navigation Tabs ──────────────────────────────────────── */}
      <section className="business-tabs-section">
        <div className="container tabs-container">
          <div className="business-tabs-bar">
            {TABS.map((tab) => (
              <button
                key={tab}
                className={`business-tab-btn ${activeTab === tab ? 'active' : ''}`}
                onClick={() => handleTabChange(tab)}
              >
                {tab.replace(/-/g, ' ').toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Active Service Content ───────────────────────────────── */}
      <section className="business-content-section section-padded">
        <div className="container">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="business-service-grid"
            >
              <div className="business-service-info">
                <span className="section-badge">{activeService.name}</span>
                <h2 className="business-service-title">{activeService.title}</h2>
                <p className="business-service-desc">{activeService.desc}</p>
                <div className="business-cta-box">
                  <a href="https://sellwellone.com/" target="_blank" rel="noopener noreferrer" className="btn-primary">
                    Get Started <FiArrowRight />
                  </a>
                </div>
              </div>

              <div className="business-service-visual">
                <div className="business-image-card">
                  <img src={activeService.image} alt={activeService.name} className="business-visual-img" />
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ── Core Details Grid ────────────────────────────────────── */}
      <section className="business-details-section section-padded">
        <div className="container">
          <h2 className="section-title text-center">Service Offerings</h2>
          <p className="section-desc text-center mb-5">
            Details of what we manage for your automated seller catalog:
          </p>

          <motion.div
            className="business-details-grid"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
            variants={stagger}
          >
            {activeService.details.map((detail, idx) => {
              const colors = ['card-blue', 'card-purple', 'card-green', 'card-orange', 'card-cyan', 'card-pink'];
              const cardColorClass = colors[idx % colors.length];
              return (
                <motion.div
                  key={idx}
                  className={`business-detail-card ${cardColorClass}`}
                  variants={fadeUp}
                  whileHover={{
                    y: -6,
                    scale: 1.01,
                    boxShadow: "0 12px 30px rgba(15, 23, 42, 0.08)",
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <div className="business-detail-icon">
                    {idx === 0 && <FiSliders />}
                    {idx === 1 && <FiTrendingUp />}
                    {idx === 2 && <FiCheckCircle />}
                  </div>
                  <h3 className="business-detail-title">{detail.title}</h3>
                  <p className="business-detail-desc">{detail.desc}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ── Business Card Scanner Sections (Agent Tap2Read) ── */}
      {activeTab === 'business-card-scanner' && (
        <>
          {/* Section 1: How Agent Tap2Read Works */}
          <section className="scanner-workflow-section section-padded">
            <div className="container">
              <h2 className="section-title text-center">How Agent Tap2Read Works</h2>
              <p className="section-desc text-center">
                From business card to organized contact database in seconds.
              </p>

              <div className="workflow-steps-pipeline">
                <div className="workflow-step-card">
                  <div className="step-icon-badge">
                    <FiUpload />
                  </div>
                  <h3>Upload Card</h3>
                  <p>Send business card image directly on WhatsApp</p>
                </div>

                <div className="workflow-pipeline-arrow">➔</div>

                <div className="workflow-step-card">
                  <div className="step-icon-badge whatsapp-badge">
                    <FiMessageSquare />
                  </div>
                  <h3>WhatsApp Receives</h3>
                  <p>Agent Tap2Read instantly receives the card</p>
                </div>

                <div className="workflow-pipeline-arrow">➔</div>

                <div className="workflow-step-card">
                  <div className="step-icon-badge ai-badge">
                    <FiCpu />
                  </div>
                  <h3>AI Processing</h3>
                  <p>AI extracts contact information</p>
                </div>

                <div className="workflow-pipeline-arrow">➔</div>

                <div className="workflow-step-card">
                  <div className="step-icon-badge sheets-badge">
                    <FiFileText />
                  </div>
                  <h3>Save To Sheets</h3>
                  <p>Data organized automatically</p>
                </div>

                <div className="workflow-pipeline-arrow">➔</div>

                <div className="workflow-step-card">
                  <div className="step-icon-badge crm-badge">
                    <FiCheck />
                  </div>
                  <h3>Ready To Use</h3>
                  <p>Export or push to CRM</p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 2: Features Grid */}
          <section className="scanner-features-section section-padded">
            <div className="container">
              <h2 className="section-title text-center" style={{ marginBottom: '0.5rem' }}>Core Scanner Features</h2>
              <p className="section-desc text-center mb-5">
                What our custom AI card scanner integration handles for your business:
              </p>

              <div className="scanner-features-grid">
                {[
                  { icon: <FiCpu />, title: "AI Card Recognition", desc: "Extract names, phone numbers, emails and company information automatically." },
                  { icon: <FiMessageSquare />, title: "WhatsApp Based", desc: "No additional app required. Simply send the card on WhatsApp." },
                  { icon: <FiFileText />, title: "Google Sheets Export", desc: "Automatically save contacts into Google Sheets." },
                  { icon: <FiDatabase />, title: "CRM Integration", desc: "Export contact data into your CRM workflow." },
                  { icon: <FiUsers />, title: "Bulk Processing", desc: "Process multiple business cards efficiently." },
                  { icon: <FiLock />, title: "Secure Storage", desc: "Enterprise-grade security for your business contacts." }
                ].map((feat, idx) => {
                  const cardColors = ['card-blue', 'card-purple', 'card-green', 'card-orange', 'card-cyan', 'card-pink'];
                  const cardColorClass = cardColors[idx % cardColors.length];
                  return (
                    <div key={idx} className={`scanner-feature-card ${cardColorClass}`}>
                      <div className="feature-icon api-feature-icon">{feat.icon}</div>
                      <h3>{feat.title}</h3>
                      <p>{feat.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Section 3: Pricing Plans */}
          <section className="scanner-pricing-section section-padded">
            <div className="container">
              <h2 className="section-title text-center">Choose The Right Plan</h2>
              <p className="section-desc text-center">
                Flexible plans for individuals, teams and businesses.
              </p>

              <div className="scanner-pricing-grid">
                <div className="scanner-pricing-card">
                  <span className="plan-badge">Plan Option</span>
                  <h3>Business Card Scanner - Silver</h3>
                  <p className="plan-subtitle">Complete end-to-end setup</p>

                  <div className="plan-price">
                    <span className="price-num">₹299</span>
                    <span className="price-period">/month</span>
                  </div>
                  <span className="plan-support">Support: 24/7 Priority</span>

                  <ul className="plan-limits">
                    <li><FiCheck /> No of Scan card (150)</li>
                  </ul>

                  <a href="https://sellwellone.com/business-card-scanner" target="_blank" rel="noopener noreferrer" className="btn-primary plan-btn">
                    Get Started
                  </a>
                </div>

                <div className="scanner-pricing-card popular">
                  <div className="popular-ribbon">MOST POPULAR</div>
                  <span className="plan-badge">Plan Option</span>
                  <h3>Business Card Scanner - Gold</h3>
                  <p className="plan-subtitle">Complete end-to-end setup</p>

                  <div className="plan-price">
                    <span className="price-num">₹999</span>
                    <span className="price-period">/yearly fee</span>
                  </div>
                  <span className="plan-support">Support: 24/7 Priority</span>

                  <ul className="plan-limits">
                    <li><FiCheck /> Number of Scans (1000)</li>
                  </ul>

                  <a href="https://sellwellone.com/business-card-scanner" target="_blank" rel="noopener noreferrer" className="btn-primary plan-btn">
                    Get Started
                  </a>
                </div>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}

export default BusinessAutomation;
