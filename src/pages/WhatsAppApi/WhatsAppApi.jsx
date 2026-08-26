import React, { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowRight, FiSmartphone, FiMessageSquare, FiUsers, FiFileText, FiSend, FiBell, FiCheckCircle } from 'react-icons/fi';
import './WhatsAppApi.css';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const WHATSAPP_DATA = {
  'connect-whatsapp': {
    name: 'Connect WhatsApp',
    image: '/img/wp.webp',
    title: 'Meta Official WhatsApp Cloud API Integration',
    desc: 'Link your official WhatsApp Business API directly with your e-commerce platform. Automate customer chats, trigger notification responses, and secure your messaging workflows through official Meta API gateways.',
    details: [
      { title: 'Official Meta APIs', desc: 'Secure connection using official green-badge WhatsApp Cloud API server pipelines.' },
      { title: 'Database Synchronization', desc: 'Direct mapping of phone cards to buyer order numbers and customer dashboard profiles.' },
      { title: 'Multi-Agent Support', desc: 'Allow multiple customer support team agents to answer queries from the same official business number.' },
    ],
  },
  'shared-live-chat': {
    name: 'Shared Live Chat',
    image: '/img/livechat.webp',
    title: 'Shared Live Chat Support Team Inbox',
    desc: 'Equip your agents with a unified team inbox. Monitor incoming client messages in real-time, allocate tickets to agents automatically, log response durations, and resolve customer issues collaboratively.',
    details: [
      { title: 'Unified Support Panel', desc: 'Central workspace displaying customer messages, transaction history, and status logs.' },
      { title: 'Smart Ticket Assign', desc: 'Auto-route queries to specific support staff based on keywords or current agent capacity.' },
      { title: 'Saved Quick Replies', desc: 'Write and store quick response templates for FAQs to speed up resolution times.' },
    ],
  },
  'contact-organizer': {
    name: 'Contact Organizer',
    image: '/img/contact.webp',
    title: 'Smart Contact Organizer & CRM Sync',
    desc: 'Automatically organize and tag your contact directories. Segment clients by order status (e.g. abandoned cart, repeat customer), sync contacts with your CRM database, and export Excel lists for targeted outreach.',
    details: [
      { title: 'Customer Tagging', desc: 'Label customer phone contacts based on shopping cart activity and order statuses.' },
      { title: 'CRM Sync Integration', desc: 'Synchronize contact data with local company databases and CRM client sheets.' },
      { title: 'List Sheet Downloads', desc: 'Filter contact lists by attributes and download directories to CSV files in seconds.' },
    ],
  },
  'message-templates': {
    name: 'Message Templates',
    image: '/img/message.webp',
    title: 'Template Builder & Interactive Buttons',
    desc: 'Build and register approved Meta templates. Personalize messaging fields with dynamic variables, add interactive call-to-action buttons (such as order tracking or support links), and track verification status.',
    details: [
      { title: 'Dynamic Variables', desc: 'Personalize broadcasts with variables like customer name, discount code, or order details.' },
      { title: 'Interactive CTA Buttons', desc: 'Embed click-to-action buttons (e.g., Track Shipping, Dial Call) into message cards.' },
      { title: 'Meta Approval Tracking', desc: 'Submit and verify template approval status directly from your dashboard.' },
    ],
  },
  'broadcast-campaigns': {
    name: 'Broadcast Campaigns',
    image: '/img/livechat.webp',
    title: 'Bulk Broadcast Campaigns & ROI Analytics',
    desc: 'Announce seasonal deals and product launches. Send WhatsApp broadcasts to thousands of opted-in customers simultaneously, and evaluate campaigns using read ratios, reply counts, and conversion metrics.',
    details: [
      { title: 'High-Delivery Broadcasts', desc: 'Transmit promotions and news alerts to custom contact lists with high read ratios.' },
      { title: 'Broadcast Analytics', desc: 'Check delivery tracking statuses, open rates, click ratios, and total sales generated.' },
      { title: 'Stop-Request Auditing', desc: 'Auto-flag opt-out request responses to protect number trust ratings and prevent blockages.' },
    ],
  },
  'automated-order-alerts': {
    name: 'Automated Order Alerts',
    image: '/img/order.webp',
    title: 'Triggered Transaction & Cart Recovery Alerts',
    desc: 'Automate checkout alerts. Trigger WhatsApp messages when a customer completes an order, when packages are marked for shipment dispatch, or to recover sales from abandoned shopping carts.',
    details: [
      { title: 'Order Confirmation Alerts', desc: 'Instantly deliver purchase verification and receipt summaries to clients.' },
      { title: 'Fulfillment & Dispatch Logs', desc: 'Auto-send live courier airway bill links and package tracking status changes.' },
      { title: 'Cart Recovery Triggers', desc: 'Deliver custom discount codes to buyers who left items in shopping carts to recapture sales.' },
    ],
  },
};

const TABS = ['connect-whatsapp', 'shared-live-chat', 'contact-organizer', 'message-templates', 'broadcast-campaigns', 'automated-order-alerts'];

const TAB_SLUGS = {
  'connect-whatsapp': 'whatsapp-business-api-provider-in-mumbai',
  'shared-live-chat': 'whatsapp-shared-inbox-in-mumbai',
  'contact-organizer': 'whatsapp-contact-management-in-mumbai',
  'message-templates': 'whatsapp-message-template-service-in-mumbai',
  'broadcast-campaigns': 'whatsapp-broadcast-service-in-mumbai',
  'automated-order-alerts': 'whatsapp-order-notification-service-in-mumbai',
};

function WhatsAppApi() {
  const { serviceId } = useParams();
  const navigate = useNavigate();

  const getActiveTab = () => {
    if (!serviceId) return 'connect-whatsapp';
    const lowercaseId = serviceId.toLowerCase();

    // Exact mapping from the new SEO slugs
    if (lowercaseId.includes('whatsapp-business-api-provider')) return 'connect-whatsapp';
    if (lowercaseId.includes('whatsapp-shared-inbox')) return 'shared-live-chat';
    if (lowercaseId.includes('whatsapp-contact-management')) return 'contact-organizer';
    if (lowercaseId.includes('whatsapp-message-template')) return 'message-templates';
    if (lowercaseId.includes('whatsapp-broadcast')) return 'broadcast-campaigns';
    if (lowercaseId.includes('whatsapp-order-notification')) return 'automated-order-alerts';

    // Fallback parsing just in case
    if (lowercaseId.includes('connect')) return 'connect-whatsapp';
    if (lowercaseId.includes('chat') || lowercaseId.includes('live') || lowercaseId.includes('inbox')) return 'shared-live-chat';
    if (lowercaseId.includes('organizer') || lowercaseId.includes('contact') || lowercaseId.includes('management')) return 'contact-organizer';
    if (lowercaseId.includes('template')) return 'message-templates';
    if (lowercaseId.includes('broadcast') || lowercaseId.includes('campaign')) return 'broadcast-campaigns';
    if (lowercaseId.includes('alert') || lowercaseId.includes('order') || lowercaseId.includes('notification')) return 'automated-order-alerts';

    return 'connect-whatsapp';
  };

  const activeTab = getActiveTab();

  useEffect(() => {
    // If no serviceId, or it's using the old generic route without an ID
    if (!serviceId) {
      navigate(`/whatsapp-api/${TAB_SLUGS['connect-whatsapp']}`, { replace: true });
    } else if (!Object.values(TAB_SLUGS).includes(serviceId)) {
      // Auto-redirect from old slugs to new SEO slugs
      navigate(`/whatsapp-api/${TAB_SLUGS[activeTab]}`, { replace: true });
    }
  }, [serviceId, navigate, activeTab]);

  const activeService = WHATSAPP_DATA[activeTab];

  if (!activeService) return null;

  return (
    <div className="whatsapp-api-page">
      {/* ── Page Hero ────────────────────────────────────────────── */}
      <section className="inner-page-hero">
        <div className="inner-page-hero-overlay"></div>
        <div className="container inner-page-hero-content">
          <motion.span
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="section-badge"
          >
            WhatsApp Business Integration
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="page-hero-title"
          >
            WhatsApp API Features
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="page-hero-sub"
          >
            Manage support chats from a shared inbox, run promotional broadcasts, organize contacts, and automate order shipping updates.
          </motion.p>
        </div>
      </section>

      {/* ── Navigation Tabs ──────────────────────────────────────── */}
      <section className="whatsapp-tabs-section">
        <div className="container tabs-container">
          <div className="whatsapp-tabs-bar">
            {TABS.map((tab) => (
              <button
                key={tab}
                className={`whatsapp-tab-btn ${activeTab === tab ? 'active' : ''}`}
                onClick={() => navigate(`/whatsapp-api/${TAB_SLUGS[tab]}`, { state: { noScroll: true } })}
              >
                {tab.replace(/-/g, ' ').toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Active Service Content ───────────────────────────────── */}
      <section className="whatsapp-content-section section-padded">
        <div className="container">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="whatsapp-service-grid"
            >
              <div className="whatsapp-service-info">
                <span className="section-badge">{activeService.name}</span>
                <h2 className="whatsapp-service-title">{activeService.title}</h2>
                <p className="whatsapp-service-desc">{activeService.desc}</p>
                <div className="whatsapp-cta-box">
                  <Link to="/contact/ecommerce-management-company-in-mumbai" className="btn-primary">
                    Get Started <FiArrowRight />
                  </Link>
                </div>
              </div>

              <div className="whatsapp-service-visual">
                <div className="whatsapp-image-card">
                  <img src={activeService.image} alt={activeService.name} className="whatsapp-visual-img" loading="lazy" decoding="async" />
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ── Core Details Grid ────────────────────────────────────── */}
      <section className="whatsapp-details-section section-padded">
        <div className="container">
          <h2 className="section-title text-center">Service Features</h2>
          <p className="section-desc text-center mb-5">
            Key tools integrated with your official business line:
          </p>

          <motion.div
            className="whatsapp-details-grid"
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
                  className={`whatsapp-detail-card ${cardColorClass}`}
                  variants={fadeUp}
                  whileHover={{
                    y: -6,
                    scale: 1.01,
                    boxShadow: "0 12px 30px rgba(15, 23, 42, 0.08)",
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <div className="whatsapp-detail-icon">
                    {idx === 0 && <FiSmartphone />}
                    {idx === 1 && <FiMessageSquare />}
                    {idx === 2 && <FiCheckCircle />}
                  </div>
                  <h3 className="whatsapp-detail-title">{detail.title}</h3>
                  <p className="whatsapp-detail-desc">{detail.desc}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>
    </div>
  );
}

export default WhatsAppApi;
