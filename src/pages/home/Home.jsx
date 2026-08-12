import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import {
  FiArrowRight, FiCheck, FiChevronDown, FiChevronUp,
  FiShoppingCart, FiCode, FiSmartphone, FiTrendingUp,
  FiUsers, FiPackage, FiZap, FiShield, FiAward
} from 'react-icons/fi';
import { FaAmazon, FaReact, FaNodeJs, FaPython, FaShopify } from 'react-icons/fa';
import { SiFlutter, SiMongodb, SiMysql, SiPhp } from 'react-icons/si';
import './Home.css';

/* ─── Static Data ─────────────────────────────────────────────────── */

const EXPERTISE = [
  {
    icon: <FiShoppingCart size={24} />,
    title: 'E-Commerce Management',
    desc: 'Full account management on Amazon, Flipkart, Myntra, Meesho & Jiomart — from listings to ad campaigns.',
    link: '/api-services',
  },
  {
    icon: <FiCode size={24} />,
    title: 'Website Development',
    desc: 'Performance-first websites built for conversion — custom-coded, SEO-optimized, and mobile-ready.',
    link: '/development-services/website-development',
  },
  {
    icon: <FiSmartphone size={24} />,
    title: 'Mobile App Development',
    desc: 'Cross-platform mobile apps that are scalable, intuitive, and built to engage your users.',
    link: '/development-services/app-development',
  },
  {
    icon: <FiTrendingUp size={24} />,
    title: 'SEO & Digital Marketing',
    desc: 'Drive organic traffic, grow brand visibility, and generate quality leads with our proven SEO strategies.',
    link: '/more-services/seo-services',
  },
  {
    icon: <FiPackage size={24} />,
    title: 'Software Development',
    desc: 'Custom software solutions — from POS systems to ERP/CRM platforms tailored for your business.',
    link: '/development-services/software-development',
  },
  {
    icon: <FiZap size={24} />,
    title: 'Payment & Automation',
    desc: 'Integrate secure payment gateways, automate workflows, and streamline operations seamlessly.',
    link: '/more-services/payment-gateway-solution',
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
    title: 'More Services',
    img: '/img/more services.png',
    items: ['Payment Gateway', 'Bulk SMS', 'SEO Services', 'Voice Call', 'Shopify Store'],
    link: '/more-services',
    label: 'Growth Tools',
  },
];

const PROJECTS = [
  { title: 'SellWell', category: 'E-Commerce Automation', img: '/img/tap2cash.png', link: 'https://sellwellone.com/' },
  { title: 'Lactra B2B', category: 'Website Development', img: '/img/Lactra.jpg', link: 'https://www.lactra.in/ ' },
  { title: 'Spartan Nutrition', category: 'Website Development', img: '/img/web-spartan.png', link: 'https://spartannutrition.com/' },
  { title: 'Tap2Cash', category: 'Software Development', img: '/img/taptocash.png', link: 'https://tap2cash.in/' },
  { title: 'Ayaan Toys', category: 'E-Commerce', img: '/img/Web-ayantoys.png', link: '/portfolio' },
  { title: 'Lycot Swimwear', category: 'Website Development', img: '/img/Web-lycot.png', link: '/portfolio' },
];

const TECH = [
  { icon: <FaAmazon size={32} />, name: 'Amazon SP-API' },
  { icon: <FaReact size={32} />, name: 'React' },
  { icon: <FaNodeJs size={32} />, name: 'Node.js' },
  { icon: <FaPython size={32} />, name: 'Python' },
  { icon: <FaShopify size={32} />, name: 'Shopify' },
  { icon: <SiFlutter size={32} />, name: 'Flutter' },
  { icon: <SiMongodb size={32} />, name: 'MongoDB' },
  { icon: <SiMysql size={32} />, name: 'MySQL' },
  { icon: <SiPhp size={32} />, name: 'PHP' },
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
    name: 'Namrata S.',
    role: 'Amazon Seller',
    avatar: '/img/namrata.png',
    text: 'Inspiring Infosys completely transformed our Amazon store. Sales doubled within 3 months of working with them. Their knowledge of the platform is exceptional.',
  },
  {
    name: 'Rahul M.',
    role: 'E-Commerce Entrepreneur',
    avatar: '/img/team-1.jpg',
    text: 'The website they built for us is fast, beautiful and ranks well on Google. Their team was communicative and delivered exactly what we needed, on time.',
  },
  {
    name: 'Priya D.',
    role: 'Retail Brand Owner',
    avatar: '/img/team-2.jpg',
    text: 'We were managing 4 marketplaces manually. Now with their support and SellWell, everything is automated. Absolutely worth it.',
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

/* ─── Component ───────────────────────────────────────────────────── */

function Home() {
  const [openFaq, setOpenFaq] = useState(null);
  const [faqSearch, setFaqSearch] = useState('');

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
    heroMouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    heroMouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleHeroMouseLeave = () => {
    heroMouseX.set(0);
    heroMouseY.set(0);
  };

  return (
    <div className="home-page">

      {/* ── Hero ──────────────────────────────────────────────────── */}
      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section
        className="hero-section"
        onMouseMove={handleHeroMouseMove}
        onMouseLeave={handleHeroMouseLeave}
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

        <div className="container hero-content">

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
              <Link to="/contact" className="btn-primary hero-primary-btn">
                Reach Us
                <FiArrowRight />
              </Link>

              <Link
                to="/portfolio"
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
              <div className="hero-stat">
                <span className="stat-number">300+</span>
                <span className="stat-label">Happy Clients</span>
              </div>

              <div className="hero-stat-divider" />

              <div className="hero-stat">
                <span className="stat-number">800+</span>
                <span className="stat-label">Projects Done</span>
              </div>

              <div className="hero-stat-divider" />

              <div className="hero-stat">
                <span className="stat-number">10+</span>
                <span className="stat-label">Years Experience</span>
              </div>
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

            {/* Floating Card - Web Development */}
            {/* <motion.div
              className="hero-floating-card hero-floating-card-one"
              animate={{
                y: [0, -12, 0]
              }}
              transition={{
                repeat: Infinity,
                duration: 4,
                ease: "easeInOut"
              }}
            >
              <div className="floating-card-icon">
                <FiCode />
              </div>

              <div>
                <strong>Web Development</strong>
                <span>Modern & Scalable</span>
              </div>
            </motion.div>


            {/* Floating Card - E-Commerce */}
            {/* <motion.div
              className="hero-floating-card hero-floating-card-two"
              animate={{
                y: [0, 10, 0]
              }}
              transition={{
                repeat: Infinity,
                duration: 4.5,
                ease: "easeInOut",
                delay: 0.5
              }}
            >
              <div className="floating-card-icon">
                <FiShoppingCart />
              </div>

              <div>
                <strong>E-Commerce</strong>
                <span>Growth & Automation</span>
              </div>
            </motion.div> */}


            {/* Floating Card - Growth */}
            {/* <motion.div
              className="hero-floating-card hero-floating-card-three"
              animate={{
                y: [0, -8, 0]
              }}
              transition={{
                repeat: Infinity,
                duration: 5,
                ease: "easeInOut",
                delay: 1
              }}
            >
              <div className="floating-card-icon">
                <FiTrendingUp />
              </div>

              <div>
                <strong>Digital Growth</strong>
                <span>Built for Results</span>
              </div>
            </motion.div> */}


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
            className="section-header"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
            variants={stagger}
          >
            <motion.span variants={fadeUp} className="section-badge">Our Expertise</motion.span>
            <motion.h2 variants={fadeUp} className="section-title">
              Everything Your Business Needs, Under One Roof
            </motion.h2>
            <motion.p variants={fadeUp} className="section-desc">
              From e-commerce automation to custom software, we deliver end-to-end digital solutions that drive real results.
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
                className="expertise-card"
                whileHover={{
                  y: -5,
                  scale: 1.01,
                  rotateY: 4,
                  rotateX: -2,
                  boxShadow: "0 20px 40px rgba(15, 23, 42, 0.08)"
                }}
                style={{ transformStyle: "preserve-3d" }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <div className="expertise-icon">{item.icon}</div>
                <h3 className="expertise-title">{item.title}</h3>
                <p className="expertise-desc">{item.desc}</p>
                <Link to={item.link} className="expertise-link">
                  Learn more <FiArrowRight size={14} />
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
            <img src="img/images.png" alt="Why choose Inspiring Infosys" className="why-image" />
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
            <img src="public/img/imagess.png" alt="We exceed expectations" className="why-image" />
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
            <img src="public/images/image.png" alt="SellWell Digital Strategy" className="why-image" />
          </motion.div>
        </div>
      </section>

      {/* ── Services ──────────────────────────────────────────────── */}
      <section className="section-padded">
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
            <Link to="/portfolio" className="btn-secondary">
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
              <motion.div key={idx} variants={fadeUp} className="tech-chip">
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
            {PROCESS.map((step, idx) => (
              <motion.div
                key={idx}
                variants={fadeUp}
                className="process-step"
                whileHover={{ y: -6, scale: 1.01 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <div className="process-step-number">{step.step}</div>
                <h4 className="process-step-title">{step.title}</h4>
                <p className="process-step-desc">{step.desc}</p>
                {idx < PROCESS.length - 1 && <div className="process-connector" aria-hidden="true" />}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Client Testimonials ───────────────────────────────────── */}
      <section className="section-padded testimonials-section">
        <div className="container">
          <motion.div
            className="section-header"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
            variants={stagger}
          >
            <motion.span variants={fadeUp} className="section-badge">Testimonials</motion.span>
            <motion.h2 variants={fadeUp} className="section-title">What Our Clients Say</motion.h2>
          </motion.div>

          <motion.div
            className="testimonials-grid"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-60px' }}
            variants={stagger}
          >
            {TESTIMONIALS.map((t, idx) => (
              <motion.div
                key={idx}
                variants={fadeUp}
                className="testimonial-card"
                whileHover={{ y: -6, scale: 1.01, boxShadow: "0 20px 40px rgba(15, 23, 42, 0.06)" }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <div className="testimonial-stars" aria-label="5 star rating">★★★★★</div>
                <p className="testimonial-text">"{t.text}"</p>
                <div className="testimonial-author">
                  <img src={t.avatar} alt={t.name} className="testimonial-avatar" />
                  <div>
                    <strong className="testimonial-name">{t.name}</strong>
                    <span className="testimonial-role">{t.role}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
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
              <Link to="/contact" className="btn-primary">
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
