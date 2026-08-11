import React, { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowRight, FiCreditCard, FiMail, FiSearch, FiPhoneCall, FiShoppingBag } from 'react-icons/fi';
import './More Services.css';

const MORE_DATA = {
  'payment-gateway-solution': {
    name: 'Payment Gateway',
    image: '/img/Payment Gateway.jpg',
    title: 'Secure, Fast Payment Gateway Integrations',
    desc: 'Integrate reliable domestic and international payment gateways into your website or e-commerce store. We help you setup shopping carts, configure merchant accounts, and secure digital checkout interfaces.',
    details: [
      { title: 'Shopping Carts', desc: 'Seamless API integrations with WooCommerce, custom PHP, and React store checkouts.' },
      { title: 'Domestic & Global Payments', desc: 'Supports cards, netbanking, UPI, and wallets across multiple currencies.' },
      { title: 'High-Level Security', desc: 'Secure SSL communication, PCI-DSS compliance guidance, and fraud prevention.' },
    ],
  },
  'bulk-sms-services': {
    name: 'Bulk SMS Services',
    image: '/img/Bulk SMS service.jpg',
    title: 'High-Delivery Promotional and Transactional Bulk SMS',
    desc: 'Reach your audience instantly. We set up transactional SMS channels for order updates, verification OTPs, and promotional SMS gateways to distribute marketing campaigns to customers at scale.',
    details: [
      { title: 'OTP & Transactional SMS', desc: 'Instant 2-way verification codes and booking notifications.' },
      { title: 'Marketing Campaigns', desc: 'Schedule promotional broadcasts to custom mobile contact sheets.' },
      { title: 'API Gateway Integration', desc: 'Simple code integrations to trigger automated SMS alerts from your app.' },
    ],
  },
  'seo-services': {
    name: 'SEO Services',
    image: '/img/SEO Service.jpg',
    title: 'Proven Search Engine Optimization (SEO) & Marketing',
    desc: 'Drive organic consumer traffic directly to your website. We implement thorough keyword research, perform on-page SEO audits, fix code bugs, and set up tracking to help you grow sales and ranking revenue.',
    details: [
      { title: 'Keyword Optimization', desc: 'Targeting industry search queries that ready-to-buy customers are searching.' },
      { title: 'On-Page Audits', desc: 'Optimizing titles, meta descriptions, image alt texts, and internal links.' },
      { title: 'Analytics & Tracking', desc: 'Setting up Google Search Console and conversion dashboards to monitor growth.' },
    ],
  },
  'voice-call-provider': {
    name: 'Voice Call Provider',
    image: '/img/Voice Call Provider.jpg',
    title: 'Automated Voice Broadcast & Interactive Systems (IVR)',
    desc: 'Boost conversion rates with custom voice broadcast solutions. Broadcast recorded messages, reminders, or alert responses to thousands of customers simultaneously with complete delivery logs.',
    details: [
      { title: 'Voice Broadcasting', desc: 'Deliver pre-recorded product announcements or feedback surveys.' },
      { title: 'Delivery Report Sheet', desc: 'Track call status, duration, and responses from the dashboard.' },
      { title: 'Custom IVR Setup', desc: 'Interactive voice response mapping to direct customer queries.' },
    ],
  },
  'build-shopify-website': {
    name: 'Build Shopify Website',
    image: '/img/Build shopify Website.jpg',
    title: 'Sleek, Conversion-Focused Shopify Store Development',
    desc: 'Launch your online storefront with Shopify. We design customized Shopify themes, set up product inventory collections, integrate payment gateways, and configure checkout funnels so you can start selling immediately.',
    details: [
      { title: 'Custom Shopify Setup', desc: 'Complete store initialization, theme adjustments, and logo mapping.' },
      { title: 'App Integrations', desc: 'Setting up review tools, up-selling widgets, and shipping calculators.' },
      { title: 'Admin Training', desc: 'Training your team on adding products, viewing reports, and fulfilling orders.' },
    ],
  },
};

const TABS = ['payment-gateway-solution', 'bulk-sms-services', 'seo-services', 'voice-call-provider', 'build-shopify-website'];

function MoreServices() {
  const { serviceId } = useParams();
  const navigate = useNavigate();

  const activeTab = serviceId && TABS.includes(serviceId.toLowerCase()) 
    ? serviceId.toLowerCase() 
    : 'payment-gateway-solution';

  useEffect(() => {
    if (!serviceId) {
      navigate('/more-services/payment-gateway-solution', { replace: true });
    }
  }, [serviceId, navigate]);

  const activeService = MORE_DATA[activeTab];

  return (
    <div className="more-services-page">
      {/* ── Page Hero ────────────────────────────────────────────── */}
      <section className="inner-page-hero">
        <div className="inner-page-hero-overlay"></div>
        <div className="container inner-page-hero-content">
          <span className="section-badge">Growth & Marketing Tools</span>
          <h1 className="page-hero-title">More Digital Services</h1>
          <p className="page-hero-sub">
            Payment processing setup, SMS alerts, search optimization, voice broadcasting, and custom Shopify e-commerce setups.
          </p>
        </div>
      </section>

      {/* ── Navigation Tabs ──────────────────────────────────────── */}
      <section className="more-tabs-section">
        <div className="container tabs-container">
          <div className="more-tabs-bar">
            {TABS.map((tab) => (
              <button
                key={tab}
                className={`more-tab-btn ${activeTab === tab ? 'active' : ''}`}
                onClick={() => navigate(`/more-services/${tab}`)}
              >
                {tab.replace(/-/g, ' ').toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Active Service Content ───────────────────────────────── */}
      <section className="more-content-section section-padded">
        <div className="container">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="more-service-grid"
            >
              <div className="more-service-info">
                <span className="section-badge">{activeService.name}</span>
                <h2 className="more-service-title">{activeService.title}</h2>
                <p className="more-service-desc">{activeService.desc}</p>
                <div className="more-cta-box">
                  <Link to="/contact" className="btn-primary">
                    Get Started Now <FiArrowRight />
                  </Link>
                </div>
              </div>

              <div className="more-service-visual">
                <div className="more-image-card">
                  <img src={activeService.image} alt={activeService.name} className="more-visual-img" />
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ── Core Details Grid ────────────────────────────────────── */}
      <section className="more-details-section section-padded">
        <div className="container">
          <h2 className="section-title text-center">Core Service Details</h2>
          <p className="section-desc text-center mb-5">
            Everything integrated seamlessly for your digital platform:
          </p>

          <div className="more-details-grid">
            {activeService.details.map((detail, idx) => (
              <div key={idx} className="more-detail-card">
                <div className="more-detail-icon">
                  {idx === 0 && <FiCreditCard />}
                  {idx === 1 && <FiMail />}
                  {idx === 2 && <FiSearch />}
                </div>
                <h3 className="more-detail-title">{detail.title}</h3>
                <p className="more-detail-desc">{detail.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default MoreServices;
