import React from 'react';
import { motion } from 'framer-motion';
import { FiCheck, FiAward, FiUsers, FiBriefcase, FiPhoneCall } from 'react-icons/fi';
import './WhyUs.css';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

function WhyUs() {
  return (
    <div className="why-us-page">
      {/* ── Page Hero ────────────────────────────────────────────── */}
      <section className="inner-page-hero">
        <div className="inner-page-hero-overlay"></div>
        <div className="container inner-page-hero-content">
          <motion.span
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="section-badge"
          >
            About Our Agency
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="page-hero-title"
          >
            Why Inspiring Infosys?
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="page-hero-sub"
          >
            More than just a service provider — we are a reliable growth partner for businesses looking to enter or expand in the digital marketplace.
          </motion.p>
        </div>
      </section>

      {/* ── Core Value Section ───────────────────────────────────── */}
      <section className="section-padded">
        <div className="container value-grid">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="value-img-wrap"
          >
            <img src="/img/growth.webp" alt="Growth partner illustration" className="value-img" loading="lazy" decoding="async" />
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
            variants={stagger}
            className="value-content"
          >
            <motion.span variants={fadeUp} className="section-badge">Trusted Growth Partner</motion.span>
            <motion.h2 variants={fadeUp} className="section-title">
              Simplifying E-Commerce & Tech Challenges
            </motion.h2>
            <motion.p variants={fadeUp} className="section-desc">
              Backed by over a decade of experience, we specialize in simplifying e-commerce, web, and digital challenges for sellers. Whether you're a beginner or an established brand, our tailored solutions help you save time, reduce errors, and increase sales — all under one roof.
            </motion.p>

            <motion.div variants={stagger} className="value-bullets">
              <motion.div
                variants={fadeUp}
                className="value-bullet-card card-blue"
                whileHover={{
                  y: -5,
                  scale: 1.01,
                  boxShadow: "0 12px 30px rgba(0, 124, 255, 0.1)"
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <div className="value-bullet-icon"><FiAward /></div>
                <div>
                  <h4>Award Winning Solutions</h4>
                  <p>Recognized for delivering excellence across e-commerce management and dev services.</p>
                </div>
              </motion.div>

              <motion.div
                variants={fadeUp}
                className="value-bullet-card card-purple"
                whileHover={{
                  y: -5,
                  scale: 1.01,
                  boxShadow: "0 12px 30px rgba(168, 85, 247, 0.1)"
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <div className="value-bullet-icon"><FiUsers /></div>
                <div>
                  <h4>Professional Staff</h4>
                  <p>Our qualified team possesses years of marketplace and digital media experience.</p>
                </div>
              </motion.div>

              <motion.div
                variants={fadeUp}
                className="value-bullet-card card-green"
                whileHover={{
                  y: -5,
                  scale: 1.01,
                  boxShadow: "0 12px 30px rgba(16, 185, 129, 0.1)"
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <div className="value-bullet-icon"><FiBriefcase /></div>
                <div>
                  <h4>Fair Prices</h4>
                  <p>High-quality engineering and setup services tailored to your budget constraints.</p>
                </div>
              </motion.div>

              <motion.div
                variants={fadeUp}
                className="value-bullet-card card-orange"
                whileHover={{
                  y: -5,
                  scale: 1.01,
                  boxShadow: "0 12px 30px rgba(249, 115, 22, 0.1)"
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <div className="value-bullet-icon"><FiPhoneCall /></div>
                <div>
                  <h4>24/7 Support</h4>
                  <p>We provide continuous monitoring, backups, and ongoing support for all active systems.</p>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Complete Digital Solutions Block ─────────────────────── */}
      <section className="section-padded why-solutions-block">
        <div className="container solutions-grid">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
            variants={stagger}
            className="solutions-content"
          >
            <motion.span variants={fadeUp} className="section-badge">Complete Offerings</motion.span>
            <motion.h2 variants={fadeUp} className="section-title">
              Complete Digital Solutions Backed by 10+ Years of Experience
            </motion.h2>
            <motion.p variants={fadeUp} className="section-desc">
              Delivering powerful solutions for businesses to grow online with confidence, high speed, and maximum efficiency.
            </motion.p>

            <motion.ul variants={stagger} className="solutions-list">
              <motion.li variants={fadeUp}>
                <div className="sol-check"><FiCheck /></div>
                <span>Custom website development for e-commerce and business needs</span>
              </motion.li>
              <motion.li variants={fadeUp}>
                <div className="sol-check"><FiCheck /></div>
                <span>Digital marketing services: SEO, social media, and paid ads</span>
              </motion.li>
              <motion.li variants={fadeUp}>
                <div className="sol-check"><FiCheck /></div>
                <span>E-commerce account setup, product listings, and ad campaigns</span>
              </motion.li>
              <motion.li variants={fadeUp}>
                <div className="sol-check"><FiCheck /></div>
                <span>Software and app development tailored to business workflows</span>
              </motion.li>
              <motion.li variants={fadeUp}>
                <div className="sol-check"><FiCheck /></div>
                <span>Reliable long-term support and scalable digital solutions</span>
              </motion.li>
            </motion.ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="solutions-img-wrap"
          >
            <img src="/img/offering.webp" alt="Complete digital features" className="solutions-img" loading="lazy" decoding="async" />
          </motion.div>
        </div>
      </section>
    </div>
  );
}

export default WhyUs;
