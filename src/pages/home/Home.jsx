import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { statsApi, testimonialsApi } from '../../api/api';
import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import {
  FiArrowRight, FiCheck, FiChevronDown, FiChevronUp,
  FiShoppingCart, FiCode, FiSmartphone, FiTrendingUp,
  FiUsers, FiPackage, FiZap, FiShield, FiAward,
  FiGlobe, FiMessageSquare, FiHome, FiChevronLeft, FiChevronRight,
  FiDatabase, FiClock, FiCpu
} from 'react-icons/fi';
import { FaAmazon, FaReact, FaNodeJs, FaPython, FaShopify, FaPalette, FaStore, FaWhatsapp, FaIdCard } from 'react-icons/fa';
import { SiFlutter, SiMongodb, SiMysql, SiPhp } from 'react-icons/si';
import './Home.css';

function Counter({ target, duration = 1800, suffix = '+' }) {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;

    let start = 0;
    const end = parseInt(target, 10);
    if (start === end) return;

    const totalMiliseconds = duration;
    const steps = Math.min(40, end);
    const increment = Math.ceil(end / steps);
    const stepTime = duration / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        clearInterval(timer);
        setCount(end);
      } else {
        setCount(start);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [hasStarted, target, duration]);

  return <span ref={elementRef}>{count}{suffix}</span>;
}

/* ─── Static Data ─────────────────────────────────────────────────── */

const EXPERTISE = [
  {
    icon: <FiSmartphone size={24} />,
    title: 'Mobile App Development',
    desc: 'Native and cross-platform mobile applications that deliver exceptional user experiences.',
    link: '/development-services/mobile-app-development-service-in-mumbai',
    cardClass: 'card-blue',
  },
  {
    icon: <FiCode size={24} />,
    title: 'Software Development',
    desc: 'Custom software solutions built with cutting-edge technologies and best practices.',
    link: '/development-services/software-development-service-in-mumbai',
    cardClass: 'card-purple',
  },
  {
    icon: <FiGlobe size={24} />,
    title: 'Web Development',
    desc: 'Modern, responsive web applications that engage users and drive business growth.',
    link: '/development-services/website-development-service-in-mumbai',
    cardClass: 'card-green',
  },
  {
    icon: <FiMessageSquare size={24} />,
    title: 'Chatbot',
    desc: 'AI-powered conversational interfaces that enhance customer engagement and support.',
    link: '/development-services',
    cardClass: 'card-orange',
  },
  {
    icon: <FiHome size={24} />,
    title: 'Smart House',
    desc: 'IoT solutions and home automation systems for intelligent living experiences.',
    link: '/development-services',
    cardClass: 'card-cyan',
  },
  {
    icon: <FaPalette size={24} />,
    title: 'UI/UX Design',
    desc: 'User-centered design that creates intuitive and beautiful digital experiences.',
    link: '/development-services',
    cardClass: 'card-pink',
  },
  {
    icon: <FaStore size={24} />,
    title: 'E-Commerce Automation',
    desc: 'User-centered design that creates intuitive and beautiful digital experiences.',
    link: 'https://sellwell.co.in/ecommerce-services-in-mumbai.php',
    cardClass: 'card-purple',
  },
  {
    icon: <FaWhatsapp size={24} />,
    title: 'WhatsApp Feature',
    desc: 'Connect WhatsApp, manage chats, organize contacts, create templates and run campaigns — all from your SellWellOne seller dashboard.',
    link: 'https://sellwellone.com/whatsapp-features',
    cardClass: 'card-green',
  },
  {
    icon: <FaIdCard size={24} />,
    title: 'Business Card Scanner',
    desc: 'Send a business card image on WhatsApp and instantly capture contact information, organize it automatically, export to sheets and sync with your CRM.',
    link: 'https://sellwellone.com/business-card-scanner',
    cardClass: 'card-blue',
  },
];

const WHY_US = [
  { icon: <FiAward size={20} />, title: 'Responsive Web Design', desc: 'Every website we build adapts perfectly across all screen sizes and devices.' },
  { icon: <FiZap size={20} />, title: 'Speed Optimised', desc: 'Compressed assets, clean code, and optimized delivery for lightning-fast load times.' },
  { icon: <FiShield size={20} />, title: 'Social Media Integration', desc: 'Connect your brand presence across platforms seamlessly from day one.' },
  { icon: <FiTrendingUp size={20} />, title: 'Analytics & Conversion Tracking', desc: 'Goal conversion tracking with Google Analytics built into every project.' },
];

const SERVICES = [
  {
    title: 'E-Commerce Automation',
    img: '/img/sellwell2.png',
    items: ['Account Management', 'Advertising & Marketing', 'Product Listing & Content', 'Inventory & Order Sync', 'Automated Pricing'],
    link: '/business-automation',
    label: 'Automation Tools',
  },
  {
    title: 'WhatsApp API',
    img: '/img/order.png',
    items: ['Connect WhatsApp', 'Shared Live Chat', 'Broadcast Campaigns', 'Message Templates', 'Automated Order Alerts'],
    link: '/whatsapp-api',
    label: 'WhatsApp API',
  },
  {
    title: 'API Services',
    img: '/img/imageApi.png',
    items: ['Amazon', 'Flipkart', 'Jiomart', 'Myntra', 'Meesho'],
    link: '/api-services',
    label: 'E-Commerce APIs',
  },
  {
    title: 'Development Services',
    img: '/img/sdlc.png',
    items: ['Software Development', 'Website Development', 'App Development', 'IT Business Solutions', 'ERP & CRM'],
    link: '/development-services',
    label: 'Dev Solutions',
  },
  {
    title: 'Business Card Scanner',
    img: '/img/card.png',
    items: ['AI Card Recognition', 'WhatsApp Based', 'Google Sheets Export', 'CRM Integration', 'Bulk Processing'],
    link: '/business-automation/business-card-scanner',
    label: 'Agent Tap2Read',
  },
];

const PROJECTS = [
  { title: 'SellWell', category: 'E-Commerce Automation', img: '/img/portsellwellimage.png', link: 'https://sellwellone.com/' },
  { title: 'Lactra B2B', category: 'Website Development', img: '/img/Lactra.jpg', link: 'https://www.lactra.in/ ' },
  { title: 'Spartan Nutrition', category: 'Website Development', img: '/img/web-spartan.png', link: 'https://spartannutrition.com/' },
  { title: 'Tap2Cash', category: 'Software Development', img: '/img/taptocash.png', link: 'https://tap2cash.in/' },
  { title: 'Ayaan Toys', category: 'E-Commerce', img: '/img/Web-ayantoys.png', link: 'https://ayaantoys.in' },
  { title: 'Lycot Swimwear', category: 'Website Development', img: '/img/Web-lycot.png', link: 'https://www.lycot.com/password' },
];

const TECH = [
  { icon: <FaAmazon size={32} />, name: 'Amazon SP-API', color: '#ff9900' },
  { icon: <FaReact size={32} />, name: 'React', color: '#61dafb' },
  { icon: <FaNodeJs size={32} />, name: 'Node.js', color: '#339933' },
  { icon: <FaPython size={32} />, name: 'Python', color: '#3776ab' },
  { icon: <FaShopify size={32} />, name: 'Shopify', color: '#7ab55c' },
  { icon: <SiFlutter size={32} />, name: 'Flutter', color: '#02569b' },
  { icon: <SiMongodb size={32} />, name: 'MongoDB', color: '#47a248' },
  { icon: <SiMysql size={32} />, name: 'MySQL', color: '#00758f' },
  { icon: <SiPhp size={32} />, name: 'PHP', color: '#777bb4' },
];

const PROCESS = [
  { step: '01', title: 'Discovery', desc: 'We understand your business goals, target audience, and existing systems before writing a single line.' },
  { step: '02', title: 'Planning', desc: 'A clear roadmap, tech stack selection, and timeline — agreed together before execution begins.' },
  { step: '03', title: 'Design & Build', desc: 'UI/UX design followed by iterative development with regular progress check-ins.' },
  { step: '04', title: 'Test & Launch', desc: 'Rigorous QA testing across devices, then a smooth deployment to production.' },
  { step: '05', title: 'Support', desc: 'Post-launch monitoring, maintenance, and ongoing support — we stay with you after go-live.' },
];

const TESTIMONIALS = [
  {
    initials: 'SG',
    name: 'Shambhu Gupta',
    time: '4 weeks ago',
    rating: 5,
    text: 'Best learning places for e-commerce services in Mumbai ... Amazon onboarding Myntra onboarding',
    colorClass: 'badge-purple',
  },
  {
    initials: 'IM',
    name: 'Intact Media',
    time: '8 months ago',
    rating: 5,
    text: 'Great places for E-commerce solutions and websites designed and developing also helping selling on Myntra and quick commerce',
    colorClass: 'badge-blue',
  },
  {
    initials: 'MA',
    name: 'manzoor ansari',
    time: '2 years ago',
    rating: 5,
    text: 'Great place to learn and start ecommerce own business from zero. The best part is I can learn all technical skills about amazon seller,flipkart seller Centre...Highly recommended sell well services',
    colorClass: 'badge-pink',
  },
  {
    initials: 'NK',
    name: 'Neha Kapoor',
    time: '2 months ago',
    rating: 5,
    text: 'Our marketing campaigns are very easy to run now. The WhatsApp API templates and broadcasts save our marketing team a significant amount of time.',
    colorClass: 'badge-cyan',
  },
  {
    initials: 'RS',
    name: 'Ravi Sharma',
    time: '1 month ago',
    rating: 5,
    text: 'The automated WhatsApp business API solution has helped us automate purchase notifications and increase customer engagement significantly.',
    colorClass: 'badge-orange',
  },
];

const FAQS = [
  {
    q: 'What types of services does Inspiring Infosys provide?',
    a: 'We offer E-Commerce Account Management (Amazon, Flipkart, Myntra, Meesho, Jiomart), Website Design & Development, Digital Marketing (SEO, Google Ads, Social Media), Custom Software & Mobile App Development, Web Hosting, Domain Services, and Ongoing Seller Support.',
  },
  {
    q: 'What does your E-Commerce management include?',
    a: 'Product listing and catalog management, inventory and order handling, sponsored ads and promotional setup, account performance tracking, policy violation resolution, A+ Content and image editing, and reports & insights.',
  },
  {
    q: 'Do you offer multi-platform account management?',
    a: 'Yes, we manage accounts on Amazon, Flipkart, Meesho, Jiomart, Myntra, Snapdeal, and other e-commerce platforms — all from one place.',
  },
  {
    q: 'Do you build e-commerce websites?',
    a: 'Yes. We design and develop custom e-commerce websites that are mobile-friendly, SEO-optimized, and integrated with secure payment gateways.',
  },
  {
    q: 'Can I choose specific services instead of a full package?',
    a: 'Yes, all our services are modular. You can select only what you need — whether it\'s just listings, website design, ads, or marketing.',
  },
  {
    q: 'What is your pricing structure?',
    a: 'Our pricing is flexible and depends on the scope of services. We offer customized packages based on the number of accounts, platforms, and services required.',
  },
  {
    q: 'Is there a way to manage all my seller accounts from one place?',
    a: 'Yes! SellWell.tech by Inspiring Infosys offers a centralized dashboard to manage Amazon, Flipkart, Meesho, Jiomart, and more — tracking orders, inventory, performance, and policy compliance in one place.',
  },
  {
    q: 'Do you offer any training?',
    a: 'Yes, we offer online training through sellwell.graphy.com covering E-Commerce Account Management, Amazon & Flipkart selling, product listing, ad campaigns, and more.',
  },
];

/* ─── Animation Variants ──────────────────────────────────────────── */

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const SERVICES_SLIDES = [
  {
    badge: "✨ E-Commerce & Retail Management",
    title: "E-Commerce Business Automation",
    subheading: "Centralize your seller accounts, automate inventory sync across multiple channels, manage dynamic pricing, and protect your brand registrations.",
    primaryCta: { label: "Explore Automation", path: "https://sellwellone.com/", isExternal: true },
    secondaryCta: { label: "Contact Us", path: "/contact/ecommerce-management-company-in-mumbai" },
    bgImage: "/img/ecoms.png",
    gradient: "linear-gradient(135deg, #0d62a9 0%, #0a8fd4 40%, #06b6d4 70%, #8bc53f 100%)"
  },
  {
    badge: "💬 Official Meta API Solutions",
    title: "WhatsApp API & Marketing",
    subheading: "Connect your official WhatsApp Business line to route support chats to a shared inbox, run broadcasting campaigns, and trigger automated purchase notifications.",
    primaryCta: { label: "Discover WhatsApp API", path: "https://sellwellone.com/", isExternal: true },
    secondaryCta: { label: "Contact Us", path: "/contact/ecommerce-management-company-in-mumbai" },
    bgImage: "/img/shared_chat_inbox.jpg",
    gradient: "linear-gradient(135deg, #0d62a9 0%, #059669 40%, #10b981 70%, #8bc53f 100%)"
  },
  {
    badge: "🔄 Marketplace Integrations",
    title: "API & Marketplace Connections",
    subheading: "Integrate official APIs to sync inventory, catalog listings, order handovers, and tracking bills directly from your seller dashboard.",
    primaryCta: { label: "Learn API Services", path: "https://sellwellone.com/", isExternal: true },
    secondaryCta: { label: "Contact Us", path: "/contact/ecommerce-management-company-in-mumbai" },
    bgImage: "/img/imageApi.png",
    gradient: "linear-gradient(135deg, #0f172a 0%, #0d62a9 40%, #0284c7 70%, #06b6d4 100%)"
  },
  {
    badge: "💻 Custom IT Engineering",
    title: "Custom Software & Web Development",
    subheading: "Design and build native mobile apps, custom ERP/CRM tools, Shopify stores, and enterprise portals to streamline operations.",
    primaryCta: { label: "See Development Services", path: "/development-services", isExternal: false },
    secondaryCta: { label: "Contact Us", path: "/contact/ecommerce-management-company-in-mumbai" },
    bgImage: "/img/Soft-develop.png",
    gradient: "linear-gradient(135deg, #0d62a9 0%, #4f46e5 40%, #06b6d4 70%, #8bc53f 100%)"
  },
  {
    badge: "🔍 AI Card Scanner Integration",
    title: "Business Card Scanner",
    subheading: "Send a business card image on WhatsApp and instantly capture contact details, organize them automatically, export to sheets and sync with your CRM.",
    primaryCta: { label: "Learn Scanner Features", path: "https://sellwellone.com/", isExternal: true },
    secondaryCta: { label: "Contact Us", path: "/contact/ecommerce-management-company-in-mumbai" },
    bgImage: "/img/card.png",
    gradient: "linear-gradient(135deg, #0d62a9 0%, #0d9488 40%, #0f766e 70%, #8bc53f 100%)"
  }
];

/* ─── Service Visual Mockups ───────────────────────────────────────── */

function EcommerceMockup() {
  return (
    <div className="mockup-container ecommerce-mockup">
      <div className="mockup-header">
        <h4>E-Commerce Channel Sync</h4>
        <span className="sync-status"><FiZap className="sync-pulse" /> Live Syncing</span>
      </div>

      <div className="channel-list">
        <div className="channel-row">
          <div className="channel-name">
            <FaAmazon className="channel-icon amazon-color" />
            <span>Amazon India</span>
          </div>
          <span className="channel-stock">Stock: <strong>412</strong></span>
          <span className="status-badge check"><FiCheck /> Synced</span>
        </div>

        <div className="channel-row">
          <div className="channel-name">
            <FaShopify className="channel-icon shopify-color" />
            <span>Shopify Store</span>
          </div>
          <span className="channel-stock">Stock: <strong>412</strong></span>
          <span className="status-badge check"><FiCheck /> Synced</span>
        </div>

        <div className="channel-row">
          <div className="channel-name">
            <FaStore className="channel-icon flipkart-color" />
            <span>Flipkart Seller</span>
          </div>
          <span className="channel-stock">Stock: <strong>412</strong></span>
          <span className="status-badge check"><FiCheck /> Synced</span>
        </div>
      </div>

      <div className="sync-activity">
        <div className="activity-dot"></div>
        <p>Order #AMZ-8274 received. Synced stocks across Shopify & Flipkart in 1.8s</p>
      </div>
    </div>
  );
}

function WhatsAppMockup() {
  return (
    <div className="mockup-container whatsapp-mockup">
      <div className="mock-chat-header">
        <div className="mock-chat-avatar">
          <FaWhatsapp className="whatsapp-logo-icon" />
          <div className="active-dot"></div>
        </div>
        <div className="mock-chat-info">
          <h4>Meta WhatsApp API</h4>
          <span>Active • Official Channel</span>
        </div>
      </div>

      <div className="mock-chat-messages">
        <div className="msg msg-system">
          <span>Campaign "Festival Launch" sent to 15,200 recipients</span>
        </div>
        <div className="msg msg-received">
          <p>Hi, can I check if you have the pricing list for automation?</p>
          <span className="msg-time">12:30 PM</span>
        </div>
        <div className="msg msg-sent">
          <p>Hello! Sure, here is our digital automation catalogue. Let us know if you want to schedule a quick call!</p>
          <span className="msg-time">12:31 PM ✓✓</span>
        </div>
        <div className="msg msg-received">
          <p>Yes, please! Let's connect tomorrow at 3 PM.</p>
          <span className="msg-time">12:31 PM</span>
        </div>
      </div>

      <div className="mock-floating-panel">
        <div className="metric-item">
          <span className="metric-label">Delivered Rate</span>
          <span className="metric-val">99.8%</span>
        </div>
        <div className="metric-divider"></div>
        <div className="metric-item">
          <span className="metric-label">Avg Response</span>
          <span className="metric-val">1.4m</span>
        </div>
      </div>
    </div>
  );
}

function ApiConnectionsMockup() {
  return (
    <div className="mockup-container api-mockup">
      <div className="mockup-header">
        <h4>API Orchestrator</h4>
        <span className="api-badge">GraphQL / REST</span>
      </div>

      <div className="api-visual-flow">
        <div className="flow-node node-left">
          <div className="node-icon"><FiGlobe /></div>
          <span>External Marketplaces</span>
        </div>

        <div className="flow-pipeline">
          <div className="pipeline-dots">
            <span className="dot dot-1"></span>
            <span className="dot dot-2"></span>
            <span className="dot dot-3"></span>
          </div>
        </div>

        <div className="flow-node node-right">
          <div className="node-icon"><FiDatabase /></div>
          <span>Internal ERP Database</span>
        </div>
      </div>

      <div className="api-endpoint-list">
        <div className="endpoint-row">
          <span className="method get">GET</span>
          <span className="endpoint">/v1/orders/handover</span>
          <span className="response-time">112ms</span>
        </div>
        <div className="endpoint-row">
          <span className="method post">POST</span>
          <span className="endpoint">/v1/inventory/bulk-update</span>
          <span className="response-time">184ms</span>
        </div>
      </div>
    </div>
  );
}

function CustomSoftwareMockup() {
  return (
    <div className="mockup-container software-mockup">
      <div className="mockup-header">
        <h4>Custom ERP Dashboard</h4>
        <span className="software-badge">Production v2.4</span>
      </div>

      <div className="software-dashboard-stats">
        <div className="stat-card">
          <span className="stat-lbl">Active Users</span>
          <span className="stat-value">12.8k</span>
          <span className="stat-change positive">+14%</span>
        </div>
        <div className="stat-card">
          <span className="stat-lbl">API Latency</span>
          <span className="stat-value">42ms</span>
          <span className="stat-change positive">Optimized</span>
        </div>
      </div>

      <div className="software-graph">
        <svg viewBox="0 0 300 80" className="mock-svg-graph">
          <defs>
            <linearGradient id="graph-gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.4" />
              <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M0 60 Q 50 30, 100 50 T 200 15 T 300 10 L 300 80 L 0 80 Z"
            fill="url(#graph-gradient)"
          />
          <path
            d="M0 60 Q 50 30, 100 50 T 200 15 T 300 10"
            fill="none"
            stroke="var(--primary)"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </div>
  );
}

function CardScannerMockup() {
  return (
    <div className="mockup-container scanner-mockup">
      <div className="mockup-header">
        <h4>WhatsApp Business Card Scanner</h4>
        <span className="scanner-badge"><FiCpu /> AI Parser</span>
      </div>

      <div className="scanner-layout">
        <div className="mock-business-card">
          <div className="card-logo-placeholder">Inspiring Infosys</div>
          <div className="card-details">
            <span className="card-name">Pankaj Shah</span>
            <span className="card-role">Managing Director</span>
            <span className="card-phone">+91 99307 23412</span>
            <span className="card-email">pankaj@inspiringinfosys.com</span>
          </div>
          <div className="laser-scanner-line"></div>
        </div>

        <div className="parsed-crm-fields">
          <div className="field-group">
            <span className="field-label">Name</span>
            <span className="field-val">Pankaj Shah</span>
          </div>
          <div className="field-group">
            <span className="field-label">Email</span>
            <span className="field-val">pankaj@inspiringinfosys.com</span>
          </div>
          <div className="field-group">
            <span className="field-label">Phone</span>
            <span className="field-val">+91 99307 23412</span>
          </div>
          <div className="field-status">
            <FiCheck className="check-icon" /> Synced to CRM & Google Sheets
          </div>
        </div>
      </div>
    </div>
  );
}

function ServiceVisualMockup({ index }) {
  switch (index) {
    case 0:
      return <EcommerceMockup />;
    case 1:
      return <WhatsAppMockup />;
    case 2:
      return <ApiConnectionsMockup />;
    case 3:
      return <CustomSoftwareMockup />;
    case 4:
      return <CardScannerMockup />;
    default:
      return null;
  }
}

const getServiceIcon = (idx) => {
  switch (idx) {
    case 0: return <FiShoppingCart size={20} />;
    case 1: return <FaWhatsapp size={20} />;
    case 2: return <FiZap size={20} />;
    case 3: return <FiCode size={20} />;
    case 4: return <FaIdCard size={20} />;
    default: return <FiPackage size={20} />;
  }
};

const getSlideGradient = (idx) => {
  return SERVICES_SLIDES[idx]?.gradient || 'linear-gradient(135deg, #0d62a9 0%, #0a8fd4 40%, #06b6d4 70%, #5db52c 100%)';
};

/* ─── Component ───────────────────────────────────────────────────── */

function Home() {
  const [openFaq, setOpenFaq] = useState(null);
  const [faqSearch, setFaqSearch] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  const [currentServiceIndex, setCurrentServiceIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [dbStats, setDbStats] = useState([]);
  const [dbTestimonials, setDbTestimonials] = useState([]);

  // Fetch stats and testimonials from backend database
  useEffect(() => {
    statsApi.getAll()
      .then(res => {
        if (res.success && res.data && res.data.length > 0) {
          setDbStats(res.data);
        }
      })
      .catch(err => console.warn('Could not fetch stats, using hardcoded fallbacks:', err));

    testimonialsApi.getGoogleReviews()
      .then(res => {
        if (res.success && res.data && res.data.length > 0) {
          setDbTestimonials(res.data);
        }
      })
      .catch(err => console.warn('Could not fetch Google reviews, using hardcoded fallbacks:', err));
  }, []);

  const fallbackStats = [
    { value: "300", label: "Happy Clients", suffix: "+" },
    { value: "800", label: "Projects Completed", suffix: "+" },
    { value: "10", label: "Years Experience", suffix: "+" }
  ];

  const activeStats = dbStats.length > 0 ? dbStats : fallbackStats;
  const activeTestimonials = dbTestimonials.length > 0 ? dbTestimonials : TESTIMONIALS;

  // Auto sliding every 5 seconds (unconditional)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentServiceIndex((prev) => (prev + 1) % SERVICES_SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Auto sliding testimonials every 3 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % activeTestimonials.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [activeIndex, activeTestimonials.length]);

  const nextServiceSlide = () => {
    setCurrentServiceIndex((prev) => (prev + 1) % SERVICES_SLIDES.length);
  };

  const prevServiceSlide = () => {
    setCurrentServiceIndex((prev) => (prev - 1 + SERVICES_SLIDES.length) % SERVICES_SLIDES.length);
  };

  React.useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth < 640;
  const isTablet = windowWidth >= 640 && windowWidth < 1024;
  const visibleCards = isMobile ? 1 : isTablet ? 2 : 3;

  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % activeTestimonials.length);
  };

  const prevSlide = () => {
    setActiveIndex((prev) => (prev - 1 + activeTestimonials.length) % activeTestimonials.length);
  };

  const toggleFaq = (question) => setOpenFaq(openFaq === question ? null : question);

  const heroMouseX = useMotionValue(0);
  const heroMouseY = useMotionValue(0);

  // Interactive Parallax Rotations & Translations
  const heroRotateX = useSpring(useTransform(heroMouseY, [-0.5, 0.5], [12, -12]), { stiffness: 140, damping: 22 });
  const heroRotateY = useSpring(useTransform(heroMouseX, [-0.5, 0.5], [-12, 12]), { stiffness: 140, damping: 22 });

  const bgTranslateX = useSpring(useTransform(heroMouseX, [-0.5, 0.5], [15, -15]), { stiffness: 90, damping: 25 });
  const bgTranslateY = useSpring(useTransform(heroMouseY, [-0.5, 0.5], [15, -15]), { stiffness: 90, damping: 25 });

  const shape1TranslateX = useSpring(useTransform(heroMouseX, [-0.5, 0.5], [-30, 30]), { stiffness: 75, damping: 16 });
  const shape1TranslateY = useSpring(useTransform(heroMouseY, [-0.5, 0.5], [-30, 30]), { stiffness: 75, damping: 16 });
  const shape2TranslateX = useSpring(useTransform(heroMouseX, [-0.5, 0.5], [30, -30]), { stiffness: 80, damping: 18 });
  const shape2TranslateY = useSpring(useTransform(heroMouseY, [-0.5, 0.5], [30, -30]), { stiffness: 80, damping: 18 });

  const handleHeroMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    heroMouseX.set(x);
    heroMouseY.set(y);
  };

  const handleHeroMouseLeave = () => {
    heroMouseX.set(0);
    heroMouseY.set(0);
  };

  return (
    <div className="home-page">

      {/* ── Services Slider ── */}
      <section className="services-slider-section">
        <div
          className="services-classic-slider"
          style={{
            background: getSlideGradient(currentServiceIndex),
            transition: 'background 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentServiceIndex}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.45, ease: 'easeInOut' }}
              className="services-classic-slide"
            >
              {/* Contextual Low-Opacity Background Image Layer */}
              <div className="classic-slide-bg-wrapper">
                <img
                  src={SERVICES_SLIDES[currentServiceIndex].bgImage}
                  alt=""
                  className="classic-slide-bg-image"
                />
                <div className="classic-slide-bg-overlay"></div>
              </div>

              {/* Badge */}
              <span className="classic-slide-badge">
                {SERVICES_SLIDES[currentServiceIndex].badge}
              </span>

              {/* Title */}
              <h2 className="classic-slide-title">
                {SERVICES_SLIDES[currentServiceIndex].title}
              </h2>

              {/* Description */}
              <p className="classic-slide-desc">
                {SERVICES_SLIDES[currentServiceIndex].subheading}
              </p>

              {/* CTA Buttons */}
              <div className="classic-slide-actions">
                {SERVICES_SLIDES[currentServiceIndex].primaryCta.isExternal ? (
                  <a
                    href={SERVICES_SLIDES[currentServiceIndex].primaryCta.path}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="classic-slide-btn"
                  >
                    {SERVICES_SLIDES[currentServiceIndex].primaryCta.label} <FiArrowRight />
                  </a>
                ) : (
                  <Link
                    to={SERVICES_SLIDES[currentServiceIndex].primaryCta.path}
                    className="classic-slide-btn"
                  >
                    {SERVICES_SLIDES[currentServiceIndex].primaryCta.label} <FiArrowRight />
                  </Link>
                )}
                <Link
                  to={SERVICES_SLIDES[currentServiceIndex].secondaryCta.path}
                  className="classic-slide-sec-btn"
                >
                  Contact Us <FiArrowRight />
                </Link>
              </div>

              {/* Dot Navigation */}
              <div className="classic-slide-dots">
                {SERVICES_SLIDES.map((_, i) => (
                  <button
                    key={i}
                    className={`slide-dot ${i === currentServiceIndex ? 'active' : ''}`}
                    onClick={() => setCurrentServiceIndex(i)}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ── Hero (Moved Below) ────────────────────────────────────── */}
      <section
        className="hero-section"
        onMouseMove={handleHeroMouseMove}
        onMouseLeave={handleHeroMouseLeave}
        style={{ minHeight: 'auto', paddingTop: '2rem', paddingBottom: '1rem' }}
      >
        {/* Background */}
        <motion.div
          className="hero-bg-image"
          style={{
            backgroundImage: "url('/img/modern-3d-bg.png')",
            x: bgTranslateX,
            y: bgTranslateY
          }}
          aria-hidden="true"
        />

        <div className="hero-overlay" aria-hidden="true" />
        <div className="hero-dot-grid" aria-hidden="true" />

        {/* Background Glow */}
        <div className="hero-glow-blob blob-purple" aria-hidden="true" />
        <div className="hero-glow-blob blob-blue" aria-hidden="true" />
        <div className="hero-glow-blob blob-green" aria-hidden="true" />

        <div className="container hero-content" style={{ paddingTop: '1rem', paddingBottom: '1rem' }}>

          {/* ───────────────── LEFT CONTENT ───────────────── */}
          <motion.div
            className="hero-text"
            initial="hidden"
            animate="show"
            variants={stagger}
          >

            <motion.span
              variants={fadeUp}
              className="hero-badge"
            >
              Mumbai's Trusted IT Partner Since 2013
            </motion.span>



            <motion.h1
              variants={fadeUp}
              className="hero-heading"
            >
              Give Wings to Your{" "}
              <span className="text-gradient-purple">
                Imagination
              </span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="hero-subheading"
            >
              We solve your technical challenges so you can focus on
              marketing, scaling, and making your business thrive.
            </motion.p>

            {/* CTA */}
            <motion.div
              variants={fadeUp}
              className="hero-actions"
            >
              <Link to="/contact/ecommerce-management-company-in-mumbai" className="btn-primary hero-primary-btn">
                Reach Us
                <FiArrowRight />
              </Link>

              <Link
                to="/portfolio/ecommerce-development-company-in-mumbai"
                className="btn-secondary hero-secondary-btn"
              >
                View Our Work
                <FiArrowRight size={16} />
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              variants={fadeUp}
              className="hero-stats"
            >
              {activeStats.map((stat, idx) => (
                <React.Fragment key={stat.id || idx}>
                  <div className="hero-stat">
                    <span className="stat-number">
                      <Counter target={stat.value} suffix={stat.suffix || '+'} />
                    </span>
                    <span className="stat-label">{stat.label}</span>
                  </div>
                  {idx < activeStats.length - 1 && <div className="hero-stat-divider" />}
                </React.Fragment>
              ))}
            </motion.div>

          </motion.div>


          {/* ───────────────── RIGHT VISUAL ───────────────── */}
          <motion.div
            className="hero-image-wrapper"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.2
            }}
          >




            {/* Main Hero Image */}
            <motion.div
              className="hero-image-3d"
              style={{
                rotateX: heroRotateX,
                rotateY: heroRotateY
              }}
              animate={{
                y: [0, -12, 0]
              }}
              transition={{
                repeat: Infinity,
                duration: 5,
                ease: "easeInOut",
                delay: 0.9
              }}
            >
              <img
                src="/img/banner-three-image.png"
                alt="Inspiring Infosys — Advanced IT & E-Commerce Solutions"
                className="hero-image"
              />
            </motion.div>


            {/* Decorative Circle */}
            <motion.div
              className="hero-orbit orbit-one"
              animate={{
                rotate: 360
              }}
              transition={{
                repeat: Infinity,
                duration: 18,
                ease: "linear"
              }}
            />

            <motion.div
              className="hero-orbit orbit-two"
              animate={{
                rotate: -360
              }}
              transition={{
                repeat: Infinity,
                duration: 24,
                ease: "linear"
              }}
            />

          </motion.div>

        </div>
      </section>

      {/* ── Our Expertise ─────────────────────────────────────────── */}
      <section className="section-padded">
        <div className="container">
          <motion.div
            className="section-header text-center"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
            variants={stagger}
            style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" }}
          >
            <motion.h2 variants={fadeUp} className="section-title text-center">
              Our Expert <span className="text-gradient-blue-purple">Software Solutions</span>
            </motion.h2>
            <motion.p variants={fadeUp} className="section-desc text-center" style={{ maxWidth: "800px" }}>
              We provide comprehensive technology solutions designed to transform your business and drive sustainable growth in the digital age.
            </motion.p>
          </motion.div>

          <motion.div
            className="expertise-grid"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-60px' }}
            variants={stagger}
          >
            {EXPERTISE.map((item, idx) => (
              <motion.div
                key={idx}
                variants={fadeUp}
                whileHover={{
                  y: -5,
                  scale: 1.01,
                  rotateY: 4,
                  rotateX: -2,
                }}
                style={{ transformStyle: "preserve-3d" }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <Link to={item.link} className={`expertise-card ${item.cardClass}`}>
                  <div className="expertise-icon">{item.icon}</div>
                  <h3 className="expertise-title">{item.title}</h3>
                  <p className="expertise-desc">{item.desc}</p>
                  <span className="expertise-cta">
                    Explore <FiArrowRight size={15} />
                  </span>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Why Choose Inspiring Infosys ──────────────────────────── */}
      <section className="section-padded why-section">
        <div className="container why-grid">
          <motion.div
            className="why-content"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
            variants={stagger}
          >
            <motion.span variants={fadeUp} className="section-badge">Why Choose Us</motion.span>
            <motion.h2 variants={fadeUp} className="section-title">
              Get Maximum Benefits by Working with Our Experts
            </motion.h2>
            <motion.p variants={fadeUp} className="section-desc">
              Your website is the first point of contact between your business and your potential customers. We ensure it impresses your visitors and performs brilliantly.
            </motion.p>
            <motion.ul variants={stagger} className="why-list">
              {WHY_US.map((item, idx) => (
                <motion.li key={idx} variants={fadeUp} className="why-item">
                  <div className="why-check">{item.icon}</div>
                  <div>
                    <strong>{item.title}</strong>
                    <p>{item.desc}</p>
                  </div>
                </motion.li>
              ))}
            </motion.ul>
            <motion.div variants={fadeUp} className="why-counters">
              <div className="why-counter">
                <span className="counter-num">300+</span>
                <span className="counter-label">Happy Clients</span>
              </div>
              <div className="why-counter">
                <span className="counter-num">800+</span>
                <span className="counter-label">Projects Completed</span>
              </div>
            </motion.div>
          </motion.div>
          <motion.div
            className="why-image-col"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <img src="/img/images.png" alt="Why choose Inspiring Infosys" className="why-image" />
          </motion.div>
        </div>
      </section>

      {/* ── Feature 2: Exceeding Expectations ── */}
      <section className="section-padded why-section" style={{ background: 'var(--bg-primary)', borderTop: '1px solid var(--border-color)' }}>
        <div className="container why-grid">
          <motion.div
            className="why-image-col"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <img src="/img/imagess.png" alt="We exceed expectations" className="why-image" />
          </motion.div>

          <motion.div
            className="why-content"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
            variants={stagger}
            style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
          >
            <span className="section-badge" style={{ width: 'fit-content' }}>Tailored Solutions</span>
            <h2 className="section-title" style={{ textAlign: 'left', margin: 0 }}>We Even Give You More Than Your Expectation</h2>
            <p className="section-desc" style={{ textLeft: 'left', margin: 0 }}>
              If you have an idea for a website or software, our developers can help turn that plan into a reality. From workflow improvement apps to client databases, our team brings your vision to life.
            </p>
            <p className="section-desc" style={{ textLeft: 'left', margin: 0 }}>
              We keep you in charge of its direction, delivery, and budget. You give us your master plan and we'll develop it piece by piece — from planning to final launch.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Feature 3: SellWell Digital Strategy ── */}
      <section className="section-padded why-section" style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container why-grid">
          <motion.div
            className="why-content"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
            variants={stagger}
            style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
          >
            <span className="section-badge" style={{ width: 'fit-content' }}>E-Commerce Strategy</span>
            <h2 className="section-title" style={{ textAlign: 'left', margin: 0 }}>Our SellWell Digital Strategy to Build Online Presence</h2>
            <p className="section-desc" style={{ textLeft: 'left', margin: 0 }}>
              The future is digital commerce and there is no reason why you should not be selling globally. Our vision is to assist every seller with a combination of technology and services to drive visibility, reach, and revenue.
            </p>
            <p className="section-desc" style={{ textLeft: 'left', margin: 0 }}>
              We provide value by digging deeper into your inventory flows and product margins, helping set realistic expectations for scaling your marketplace performance.
            </p>
          </motion.div>

          <motion.div
            className="why-image-col"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <img src="/img/ecoms.png" alt="SellWell Digital Strategy" className="why-image" />
          </motion.div>
        </div>
      </section>

      {/* ── Services ──────────────────────────────────────────────── */}
      <section className="section-padded services-section">
        <div className="container">
          <motion.div
            className="section-header"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
            variants={stagger}
          >
            <motion.span variants={fadeUp} className="section-badge">Services</motion.span>
            <motion.h2 variants={fadeUp} className="section-title">
              Excellent Solutions for Every Need
            </motion.h2>
            <motion.p variants={fadeUp} className="section-desc">
              We provide best-in-class technical services that fit your budget and scale with your business.
            </motion.p>
          </motion.div>

          <motion.div
            className="services-grid"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-60px' }}
            variants={stagger}
          >
            {SERVICES.map((svc, idx) => (
              <motion.div
                key={idx}
                variants={fadeUp}
                className="service-card"
                whileHover={{
                  y: -6,
                  scale: 1.01,
                  rotateY: 3,
                  rotateX: -2,
                  boxShadow: "0 25px 50px rgba(15, 23, 42, 0.08)"
                }}
                style={{ transformStyle: "preserve-3d" }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <div className="service-card-img-wrap">
                  <img src={svc.img} alt={svc.title} className="service-card-img" />
                  <span className="service-card-label">{svc.label}</span>
                </div>
                <div className="service-card-body">
                  <h3 className="service-card-title">{svc.title}</h3>
                  <ul className="service-card-list">
                    {svc.items.map((item, i) => (
                      <li key={i}>
                        <FiCheck size={13} className="service-check-icon" /> {item}
                      </li>
                    ))}
                  </ul>
                  <Link to={svc.link} className="service-card-cta">
                    Explore <FiArrowRight size={14} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Featured Projects ─────────────────────────────────────── */}
      <section className="section-padded projects-section">
        <div className="container">
          <motion.div
            className="section-header"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
            variants={stagger}
          >
            <motion.span variants={fadeUp} className="section-badge">Featured Projects</motion.span>
            <motion.h2 variants={fadeUp} className="section-title">Work We're Proud Of</motion.h2>
            <motion.p variants={fadeUp} className="section-desc">
              A selection of projects across e-commerce, software, and web development.
            </motion.p>
          </motion.div>

          <motion.div
            className="projects-grid"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-60px' }}
            variants={stagger}
          >
            {PROJECTS.map((proj, idx) => (
              <motion.div
                key={idx}
                variants={fadeUp}
                className="project-card"
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <div className="project-img-wrap">
                  <img src={proj.img} alt={proj.title} className="project-img" />
                  <div className="project-overlay">
                    <Link to={proj.link} className="project-overlay-btn" aria-label={`View ${proj.title}`}>
                      <FiArrowRight size={20} />
                    </Link>
                  </div>
                </div>
                <div className="project-meta">
                  <span className="project-category">{proj.category}</span>
                  <h4 className="project-title">{proj.title}</h4>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className="projects-cta"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <Link to="/portfolio/ecommerce-development-company-in-mumbai" className="btn-secondary">
              View All Projects <FiArrowRight size={14} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── Technology Stack ──────────────────────────────────────── */}
      <section className="section-padded tech-section">
        <div className="container">
          <motion.div
            className="section-header"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
            variants={stagger}
          >
            <motion.span variants={fadeUp} className="section-badge">Technology</motion.span>
            <motion.h2 variants={fadeUp} className="section-title">Built with Modern Tools</motion.h2>
          </motion.div>

          <motion.div
            className="tech-grid"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-60px' }}
            variants={stagger}
          >
            {TECH.map((tech, idx) => (
              <motion.div
                key={idx}
                variants={fadeUp}
                className="tech-chip"
                style={{ '--brand-color': tech.color }}
              >
                <span className="tech-icon">{tech.icon}</span>
                <span className="tech-name">{tech.name}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Our Process ───────────────────────────────────────────── */}
      <section className="section-padded">
        <div className="container">
          <motion.div
            className="section-header"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
            variants={stagger}
          >
            <motion.span variants={fadeUp} className="section-badge">Our Process</motion.span>
            <motion.h2 variants={fadeUp} className="section-title">How We Work</motion.h2>
            <motion.p variants={fadeUp} className="section-desc">
              A transparent, structured process so you always know where your project stands.
            </motion.p>
          </motion.div>

          <motion.div
            className="process-grid"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-60px' }}
            variants={stagger}
          >
            {PROCESS.map((step, idx) => {
              const stepClasses = ['step-blue', 'step-purple', 'step-pink', 'step-green', 'step-orange'];
              const stepClass = stepClasses[idx % stepClasses.length];
              return (
                <motion.div
                  key={idx}
                  variants={fadeUp}
                  className={`process-step ${stepClass}`}
                  whileHover={{ y: -6, scale: 1.01 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <div className="process-step-number">{step.step}</div>
                  <h4 className="process-step-title">{step.title}</h4>
                  <p className="process-step-desc">{step.desc}</p>
                  {idx < PROCESS.length - 1 && <div className="process-connector" aria-hidden="true" />}
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ── Client Testimonials ───────────────────────────────────── */}
      <section className="section-padded testimonials-section">
        <div className="container">
          <motion.div
            className="section-header text-center"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
            variants={stagger}
            style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem", marginBottom: "3rem" }}
          >
            <motion.span variants={fadeUp} className="section-badge mx-auto text-center">Client Testimonials</motion.span>
            <motion.h2 variants={fadeUp} className="section-title text-center">
              Genuine <span className="text-gradient-blue-purple">Reviews</span>
            </motion.h2>
            <motion.p variants={fadeUp} className="section-desc text-center" style={{ maxWidth: "800px" }}>
              Don't just take our word for it. Here's what our clients say about working with Inspiring Infosys and the results we've delivered together.
            </motion.p>
          </motion.div>

          <div className="testimonials-slider-container">
            <button onClick={prevSlide} className="slider-arrow arrow-left" aria-label="Previous review">
              <FiChevronLeft />
            </button>

            <div className="testimonials-slider-window">
              <div
                className="testimonials-slider-track"
                style={{
                  transform: `translateX(-${activeIndex * (100 / visibleCards)}%)`
                }}
              >
                {activeTestimonials.map((t, idx) => {
                  const isHighlighted = idx === (activeIndex + (isMobile ? 0 : isTablet ? 0 : 1)) % activeTestimonials.length;
                  const timeValue = t.timeAgo || t.time || 'Just now';
                  return (
                    <div key={idx} className="testimonial-card-wrap">
                      <div className={`testimonial-card ${isHighlighted ? 'card-highlighted' : ''} ${t.colorClass || 'badge-blue'}`}>
                        {/* Top Initials Circle Badge */}
                        <div className="testimonial-initials-badge">
                          {t.initials}
                        </div>

                        <div className="testimonial-header">
                          <h4 className="testimonial-name">{t.name}</h4>
                          <span className="testimonial-time">{timeValue}</span>
                        </div>

                        <div className="testimonial-stars" aria-label="5 star rating">
                          {"★".repeat(t.rating)}
                        </div>

                        <div className="testimonial-body">
                          <span className="testimonial-quote-icon">“</span>
                          <p className="testimonial-text">{t.text}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <button onClick={nextSlide} className="slider-arrow arrow-right" aria-label="Next review">
              <FiChevronRight />
            </button>
          </div>

          {/* Dots Pagination */}
          <div className="testimonials-dots">
            {activeTestimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className={`testimonial-dot ${idx === activeIndex ? 'active' : ''}`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          {/* Button at the bottom */}
          <div className="testimonials-cta">
            <a
              href="https://www.google.com/maps/place/Inspiring+Infosys/@19.2194328,72.6696689,11z/data=!4m10!1m2!2m1!1sInspiring+Infosys!3m6!1s0x3be7a96a69ddc61b:0x69e39fa0d1f5dd03!8m2!3d19.3820173!4d72.8303777!15sChFJbnNwaXJpbmcgSW5mb3N5cyIDiAEBWhMiEWluc3BpcmluZyBpbmZvc3lzkgERZV9jb21tZXJjZV9hZ2VuY3maASRDaGREU1VoTk1HOW5TMFZKUTBGblNVUnlNell0UVhGUlJSQULgAQD6AQQIcxAn!16s%2Fg%2F11y6p568fq?entry=ttu&g_ep=EgoyMDI2MDgxMC4wIKXMDSoASAFQAw%3D%3D"
              target="_blank"
              rel="noopener noreferrer"
              className="google-reviews-btn"
            >
              More Reviews on Google
            </a>
          </div>
        </div>
      </section>

      {/* ── FAQs ──────────────────────────────────────────────────── */}
      <section className="section-padded">
        <div className="container faq-container">
          <motion.div
            className="section-header"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
            variants={stagger}
          >
            <motion.span variants={fadeUp} className="section-badge">FAQs</motion.span>
            <motion.h2 variants={fadeUp} className="section-title">Frequently Asked Questions</motion.h2>
            <motion.p variants={fadeUp} className="section-desc">
              Everything you need to know about working with us.
            </motion.p>
          </motion.div>

          {/* Interactive FAQ Search Bar */}
          <motion.div
            className="faq-search-container"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <input
              type="text"
              placeholder="Search FAQs (e-commerce, software, pricing...)"
              value={faqSearch}
              onChange={(e) => setFaqSearch(e.target.value)}
              className="faq-search-input"
            />
          </motion.div>

          <motion.div
            className="faq-list"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-60px' }}
            variants={stagger}
          >
            {FAQS.filter(faq =>
              faq.q.toLowerCase().includes(faqSearch.toLowerCase()) ||
              faq.a.toLowerCase().includes(faqSearch.toLowerCase())
            ).map((faq, idx) => (
              <motion.div key={idx} variants={fadeUp} className={`faq-item ${openFaq === faq.q ? 'open' : ''}`}>
                <button
                  className="faq-question"
                  onClick={() => toggleFaq(faq.q)}
                  aria-expanded={openFaq === faq.q}
                >
                  <span>{faq.q}</span>
                  {openFaq === faq.q ? <FiChevronUp size={18} /> : <FiChevronDown size={18} />}
                </button>
                {openFaq === faq.q && (
                  <motion.div
                    className="faq-answer"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <p>{faq.a}</p>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CTA Banner ────────────────────────────────────────────── */}
      <section className="cta-banner">
        <div className="container cta-inner">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={stagger}
          >
            <motion.h2 variants={fadeUp} className="cta-title">
              Ready to Grow Your Business?
            </motion.h2>
            <motion.p variants={fadeUp} className="cta-desc">
              Let's talk about your goals. We'll build the right solution — on time and within budget.
            </motion.p>
            <motion.div variants={fadeUp}>
              <Link to="/contact/ecommerce-management-company-in-mumbai" className="btn-primary">
                Get in Touch <FiArrowRight />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}

export default Home;
