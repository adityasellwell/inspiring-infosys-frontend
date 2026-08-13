import React, { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowRight, FiCheckCircle, FiCpu, FiRefreshCw, FiTruck, FiLayers, FiList } from 'react-icons/fi';
import './Api Services.css';

const SERVICES_DATA = {
  amazon: {
    name: 'Amazon SP-API',
    logo: '/img/amazon1.png',
    title: 'Accelerate Your Amazon Business with Selling Partner APIs',
    desc: 'Power your Amazon marketplace business with custom-built apps and Selling Partner API integrations. We help brands, aggregators, and sellers automate complex operations, reduce manual errors, and scale faster.',
    features: [
      { icon: <FiList />, title: 'Listings & Catalog Management', desc: 'Programmatic listing creation, variation setup, and description synchronization.' },
      { icon: <FiRefreshCw />, title: 'Inventory Sync & Control', desc: 'Real-time stock status sync to prevent stockouts and FBA shipment tracking.' },
      { icon: <FiTruck />, title: 'Fulfillment & Orders', desc: 'Automate order retrieval, FBA/Merchant fulfillment processing, and invoice generation.' },
      { icon: <FiCpu />, title: 'Sponsored Ads Automation', desc: 'Manage PPC bids, campaigns, and search term reports via Amazon Advertising API.' },
    ],
  },
  flipkart: {
    name: 'Flipkart API',
    logo: '/img/flipkart1.png',
    title: 'Automate Flipkart Operations and Order Cycles',
    desc: 'The Flipkart Marketplace Seller APIs allow your software applications to programmatically access and exchange data with the Flipkart seller dashboard. Streamline order processing, shipping labels, and invoices at scale.',
    features: [
      { icon: <FiList />, title: 'Order Management API', desc: 'Search active orders, process dispatches, and print packing sheets.' },
      { icon: <FiRefreshCw />, title: 'Listing & Stock Management', desc: 'Real-time price updating and active stock level monitoring.' },
      { icon: <FiTruck />, title: 'Label Printing API', desc: 'Print shipping labels, invoices, and handovers programmatically.' },
      { icon: <FiLayers />, title: 'Return & Refund Tracking', desc: 'Monitor customer returns, courier returns, and refund approvals.' },
    ],
  },
  jiomart: {
    name: 'JioMart API',
    logo: '/img/jiomart.png', // Fallback marketplace graphic
    title: 'JioMart Integration & Centralized Account Sync',
    desc: 'Scale your reach on India\'s fastest-growing grocery and electronics marketplace. Our JioMart API connectors help you centralize price catalog management and sync order feeds into your local ERP or POS system.',
    features: [
      { icon: <FiList />, title: 'Catalog Integration', desc: 'Publish product feeds, categories, and attributes matching JioMart requirements.' },
      { icon: <FiRefreshCw />, title: 'Inventory Real-Time Sync', desc: 'Instant stock adjustments across multiple digital channels.' },
      { icon: <FiTruck />, title: 'Order Feed Integration', desc: 'Sync customer orders, dispatches, and shipping hodos directly to your hub.' },
      { icon: <FiLayers />, title: 'POS Sync Integration', desc: 'Harmonize online sales with offline store inventory stocks.' },
    ],
  },
  myntra: {
    name: 'Myntra API',
    logo: '/img/myntra.png',
    title: 'Automated Fashion E-Commerce Operations for Myntra',
    desc: 'Manage fashion listings, catalog sheets, order dispatches, and returns programmatically. Our Myntra API integrations help fashion brands maintain high marketplace rating scores by keeping fulfillment times minimal.',
    features: [
      { icon: <FiList />, title: 'Fashion Catalog Mapping', desc: 'Auto-sync attributes, clothing size charts, colors, and design variants.' },
      { icon: <FiRefreshCw />, title: 'Inventory Control', desc: 'Avoid cancellation penalties with immediate multi-location stock synchronization.' },
      { icon: <FiTruck />, title: 'Order Dispatch Tracking', desc: 'Automate packaging list retrieval, airway bill (AWB) prints, and delivery dispatches.' },
      { icon: <FiLayers />, title: 'Returns Reconciliation', desc: 'Reconcile customer returns, damage claims, and marketplace payouts.' },
    ],
  },
  meesho: {
    name: 'Meesho API',
    logo: '/img/meesho.png',
    title: 'Meesho Automation for Social E-Commerce Sellers',
    desc: 'Scale your social e-commerce sales on Meesho with smart API automation tools. Programmatically handle high order volumes, auto-sync pricing adjustments, and retrieve Meesho payout settlement reports instantly.',
    features: [
      { icon: <FiList />, title: 'Bulk Listings Setup', desc: 'Fast listing uploads across multiple seller catalog sections.' },
      { icon: <FiRefreshCw />, title: 'Instant Stock Updates', desc: 'Update inventory counts across Meesho panels automatically.' },
      { icon: <FiTruck />, title: 'Order Fulfillment API', desc: 'Auto-fetch new orders, download shipping labels, and process tracking manifests.' },
      { icon: <FiLayers />, title: 'Payout & Claims Settlement', desc: 'Analyze Meesho payments, deduce deductions, and file return damage claims.' },
    ],
  },
};

const TABS = ['amazon', 'flipkart', 'jiomart', 'myntra', 'meesho'];

const TAB_SLUGS = {
  amazon: 'amazon-api-service-provider-in-mumbai',
  flipkart: 'flipkart-api-service-provider-in-mumbai',
  jiomart: 'jiomart-api-service-provider-in-mumbai',
  myntra: 'myntra-api-service-provider-in-mumbai',
  meesho: 'meesho-api-service-provider-in-mumbai',
};

function ApiServices() {
  const { serviceId } = useParams();
  const navigate = useNavigate();

  const getActiveTab = () => {
    if (!serviceId) return 'amazon';
    const lowercaseId = serviceId.toLowerCase();
    if (lowercaseId.includes('amazon')) return 'amazon';
    if (lowercaseId.includes('flipkart')) return 'flipkart';
    if (lowercaseId.includes('jiomart')) return 'jiomart';
    if (lowercaseId.includes('myntra')) return 'myntra';
    if (lowercaseId.includes('meesho')) return 'meesho';
    return 'amazon';
  };

  const activeTab = getActiveTab();

  useEffect(() => {
    // If user lands on naked /api-services, replace path to default 'amazon' SEO slug
    if (!serviceId) {
      navigate(`/api-services/${TAB_SLUGS['amazon']}`, { replace: true });
    }
  }, [serviceId, navigate]);

  const activeService = SERVICES_DATA[activeTab];

  return (
    <div className="api-services-page">
      {/* ── Page Hero ────────────────────────────────────────────── */}
      <section className="inner-page-hero">
        <div className="inner-page-hero-overlay"></div>
        <div className="container inner-page-hero-content">
          <span className="section-badge">Platform Integrations</span>
          <h1 className="page-hero-title">API Integration Services</h1>
          <p className="page-hero-sub">
            Programmatic connections to major e-commerce platforms to automate listings, sync inventory, and streamline orders.
          </p>
        </div>
      </section>

      {/* ── Navigation Tabs ──────────────────────────────────────── */}
      <section className="api-tabs-section">
        <div className="container tabs-container">
          <div className="api-tabs-bar">
            {TABS.map((tab) => (
              <button
                key={tab}
                className={`api-tab-btn ${activeTab === tab ? 'active' : ''}`}
                onClick={() => navigate(`/api-services/${TAB_SLUGS[tab]}`, { state: { noScroll: true } })}
              >
                {tab.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Active Service Content ───────────────────────────────── */}
      <section className="api-content-section section-padded">
        <div className="container">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="api-service-grid"
            >
              <div className="api-service-info">
                <span className="section-badge">{activeService.name} integration</span>
                <h2 className="api-service-title">{activeService.title}</h2>
                <p className="api-service-desc">{activeService.desc}</p>
                <div className="api-cta-box">
                  <Link to="/contact" className="btn-primary">
                    Request API Integration <FiArrowRight />
                  </Link>
                </div>
              </div>

              <div className="api-service-visual">
                <div className="api-logo-card">
                  <img src={activeService.logo} alt={`${activeService.name} logo`} className="api-logo-img" />
                </div>
                <div className="api-tech-badge">
                  <FiCpu size={18} /> Marketplace Sync Active
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ── Integration Features Grid ────────────────────────────── */}
      <section className="api-features-section section-padded">
        <div className="container">
          <h2 className="section-title text-center">Core Integration Features</h2>
          <p className="section-desc text-center mb-5">
            What our custom e-commerce API applications handle for your business:
          </p>

          <div className="api-features-grid">
            {activeService.features.map((feature, idx) => (
              <div key={idx} className="api-feature-card">
                <div className="api-feature-icon">{feature.icon}</div>
                <h3 className="api-feature-title">{feature.title}</h3>
                <p className="api-feature-desc">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default ApiServices;
