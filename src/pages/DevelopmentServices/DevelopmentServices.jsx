import React, { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowRight, FiCode, FiDatabase, FiLayers, FiSmartphone, FiTerminal } from 'react-icons/fi';
import './DevelopmentServices.css';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const DEV_DATA = {
  'software-development': {
    name: 'Software Development',
    image: '/img/Soft-develop.webp',
    title: 'Bespoke Software Engineering for Enterprise Workflows',
    desc: 'Empower your daily workflows with robust custom software applications. We build feature-rich retail POS systems, inventory monitors, and school ERP dashboards designed to coordinate all departments, reduce paperwork, and improve communication.',
    details: [
      { title: 'POS Software', desc: 'Accelerated checkout, transaction receipts, and digital payment integrations.' },
      { title: 'Inventory Management', desc: 'Commission reports, FMCG batch tracing, and multi-warehouse counts.' },
      { title: 'School Portals', desc: 'Centralized fee collections, parent-teacher alerts, and academic grading sheets.' },
    ],
  },
  'website-development': {
    name: 'Website Development',
    image: '/img/webdev.webp',
    title: 'Fast, High-Converting Custom Responsive Websites',
    desc: 'Your brand website serves as the hub of your online outreach. We build beautiful, accessible websites optimized for lightning-fast page loading speeds, seamless desktop and mobile rendering, and optimal lead conversion.',
    details: [
      { title: 'Corporate Websites', desc: 'Modern landing pages representing your core services with premium aesthetics.' },
      { title: 'E-Commerce Portals', desc: 'Secure custom storefronts with seamless product sheets and smooth carts.' },
      { title: 'SEO Optimized Frameworks', desc: 'Clean semantic HTML ensuring search engine visibility out of the box.' },
    ],
  },
  'app-development': {
    name: 'App Development',
    image: '/img/appdev.webp',
    title: 'Cross-Platform Mobile Application Development',
    desc: 'Translate your app ideas into powerful user experiences. We develop accessible cross-platform mobile apps for Android and iOS using high-performance frameworks like Flutter and React Native to keep users engaged.',
    details: [
      { title: 'iOS & Android Apps', desc: 'Native-feel applications deployed cleanly on the App Store and Google Play.' },
      { title: 'Scalable Backends', desc: 'Cloud database APIs supporting quick updates and high concurrent traffic.' },
      { title: 'Intuitive UX UI', desc: 'Interactive touch layouts, transitions, and offline-first database synchronization.' },
    ],
  },
  'it-business-solution': {
    name: 'IT Business Solutions',
    image: '/img/host.webp',
    title: 'Reliable Cloud Servers, Hosting, and Tech Solutions',
    desc: 'Eliminate system downtime. We manage cloud hosting servers, setup domains, configure secure emails, and install robust firewalls so that your online services run smoothly and securely 24/7.',
    details: [
      { title: 'Domain & SSL Setup', desc: 'Official company domains configuration with secure SSL certificates.' },
      { title: 'Fast Cloud Hosting', desc: 'Deploy on scalable AWS or DigitalOcean virtual servers for speed.' },
      { title: 'Long-term Support', desc: 'Weekly data backups, version updates, and active technical monitoring.' },
    ],
  },
  'erp-crm-solution': {
    name: 'ERP & CRM',
    image: '/img/crm.webp',
    title: 'Bespoke ERP & CRM Customer Pipeline Dashboards',
    desc: 'Gain real-time business visibility. We design custom ERP and CRM dashboards tailored specifically to your company, allowing managers to track customer pipelines, follow leads, and generate performance sheets.',
    details: [
      { title: 'Lead Pipelines Tracking', desc: 'Track sales pitches, customer phone calls, and contract stages.' },
      { title: 'Financial Reports', desc: 'Auto-calculate ledger balances, outstanding balances, and gross profits.' },
      { title: 'Custom Access Roles', desc: 'Differentiate agent dashboards, accounting records, and admin privileges.' },
    ],
  },
  'outsource-consulting': {
    name: 'Outsourcing & Consulting',
    image: '/img/team.webp',
    title: 'Outsourced Technical Consulting & Dedicated Development Teams',
    desc: 'Accelerate your development cycle by outsourcing to our dedicated teams. We provide technical consulting, architecture reviews, legacy migrations, and full-time remote developer teams customized to your exact timeline and requirements.',
    details: [
      { title: 'Dedicated Developers', desc: 'Hire full-time remote engineers skilled in React, Node.js, Python, Flutter, and cloud management.' },
      { title: 'Technical Consulting', desc: 'Expert guidance on tech stack selection, system architecture, database design, and scaling solutions.' },
      { title: 'Project Management', desc: 'Experienced Agile project managers ensuring on-time delivery, weekly sprint demo updates, and transparent billing.' },
    ],
  },
};

const TABS = ['software-development', 'website-development', 'app-development', 'it-business-solution', 'erp-crm-solution', 'outsource-consulting'];

const TAB_SLUGS = {
  'software-development': 'software-development-service-in-mumbai',
  'website-development': 'website-development-service-in-mumbai',
  'app-development': 'mobile-app-development-service-in-mumbai',
  'it-business-solution': 'it-business-solution-in-mumbai',
  'erp-crm-solution': 'erp-crm-solution-in-mumbai',
  'outsource-consulting': 'outsource-consulting-service-in-mumbai',
};

function DevelopmentServices() {
  const { serviceId } = useParams();
  const navigate = useNavigate();

  const getActiveTab = () => {
    if (!serviceId) return 'software-development';
    const lowercaseId = serviceId.toLowerCase();
    if (lowercaseId.includes('software')) return 'software-development';
    if (lowercaseId.includes('website')) return 'website-development';
    if (lowercaseId.includes('app') || lowercaseId.includes('mobile')) return 'app-development';
    if (lowercaseId.includes('business') || lowercaseId.includes('it-')) return 'it-business-solution';
    if (lowercaseId.includes('erp') || lowercaseId.includes('crm')) return 'erp-crm-solution';
    if (lowercaseId.includes('outsource') || lowercaseId.includes('consulting')) return 'outsource-consulting';
    return 'software-development';
  };

  const activeTab = getActiveTab();

  useEffect(() => {
    if (!serviceId) {
      navigate(`/development-services/${TAB_SLUGS['software-development']}`, { replace: true });
    }
  }, [serviceId, navigate]);

  const activeService = DEV_DATA[activeTab];

  return (
    <div className="dev-services-page">
      {/* ── Page Hero ────────────────────────────────────────────── */}
      <section className="inner-page-hero">
        <div className="inner-page-hero-overlay"></div>
        <div className="container inner-page-hero-content">
          <motion.span
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="section-badge"
          >
            Engineering Solutions
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="page-hero-title"
          >
            Development Services
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="page-hero-sub"
          >
            From custom business software and mobile apps to lightning-fast websites and secure ERP dashboards.
          </motion.p>
        </div>
      </section>

      {/* ── Navigation Tabs ──────────────────────────────────────── */}
      <section className="dev-tabs-section">
        <div className="container tabs-container">
          <div className="dev-tabs-bar">
            {TABS.map((tab) => (
              <button
                key={tab}
                className={`dev-tab-btn ${activeTab === tab ? 'active' : ''}`}
                onClick={() => navigate(`/development-services/${TAB_SLUGS[tab]}`, { state: { noScroll: true } })}
              >
                {tab.replace(/-/g, ' ').toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Active Service Content ───────────────────────────────── */}
      <section className="dev-content-section section-padded">
        <div className="container">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="dev-service-grid"
            >
              <div className="dev-service-info">
                <span className="section-badge">{activeService.name}</span>
                <h2 className="dev-service-title">{activeService.title}</h2>
                <p className="dev-service-desc">{activeService.desc}</p>
                <div className="dev-cta-box">
                  <Link to="/contact/ecommerce-management-company-in-mumbai" className="btn-primary">
                    Consult Our Engineers <FiArrowRight />
                  </Link>
                </div>
              </div>

              <div className="dev-service-visual">
                <div className={`dev-image-card ${activeTab === 'website-development' ? 'transparent-card' : ''}`}>
                  <img src={activeService.image} alt={activeService.name} className="dev-visual-img" loading="lazy" decoding="async" />
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ── Core Offerings Details Grid ─────────────────────────── */}
      <section className="dev-details-section section-padded">
        <div className="container">
          <h2 className="section-title text-center">Core Service Offerings</h2>
          <p className="section-desc text-center mb-5">
            Innovative features built to match your operational requirements:
          </p>

          <motion.div
            className="dev-details-grid"
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
                  className={`dev-detail-card ${cardColorClass}`}
                  variants={fadeUp}
                  whileHover={{
                    y: -6,
                    scale: 1.01,
                    boxShadow: "0 12px 30px rgba(15, 23, 42, 0.08)",
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <div className="dev-detail-icon">
                    {idx === 0 && <FiCode />}
                    {idx === 1 && <FiDatabase />}
                    {idx === 2 && <FiLayers />}
                  </div>
                  <h3 className="dev-detail-title">{detail.title}</h3>
                  <p className="dev-detail-desc">{detail.desc}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>
    </div>
  );
}

export default DevelopmentServices;
