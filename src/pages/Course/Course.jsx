import React from 'react';
import { motion } from 'framer-motion';
import { FiArrowRight, FiBookOpen, FiPlayCircle, FiUsers, FiAward, FiCheck } from 'react-icons/fi';
import './Course.css';

function Course() {
  const handleRedirect = () => {
    window.location.href = 'https://sellwellacademy.com/s/store';
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
  };

  const stagger = {
    hidden: {},
    show: { transition: { staggerChildren: 0.1 } }
  };

  return (
    <div className="course-page">
      {/* ── Section 1: E-Commerce Present & Hero ── */}
      <section className="course-hero-section">
        {/* Glow blobs to match branding */}
        <div className="hero-glow-blob blob-blue" style={{ opacity: 0.08, top: '10%' }} aria-hidden="true" />
        <div className="hero-glow-blob blob-purple" style={{ opacity: 0.06, bottom: '10%' }} aria-hidden="true" />

        <div className="container">
          <motion.div
            className="course-hero-grid"
            initial="hidden"
            animate="show"
            variants={stagger}
          >
            {/* Left Content */}
            <div className="course-hero-content">
              <motion.h1 className="course-hero-title" variants={fadeUp}>
                E-COMMERCE ISN'T THE FUTURE ANYMORE <br />
                <span className="text-highlight">— IT'S THE PRESENT.</span>
              </motion.h1>

              <motion.div className="course-features-box" variants={fadeUp}>
                <p className="features-box-intro">
                  From E-Commerce to Quick Commerce — Learn, Apply & Grow Your Online Business with Sellwell.
                </p>
                <ul className="features-list">
                  <li>
                    <span className="list-bullet"><FiCheck /></span>
                    <span>Courses (Live + Recorded Sessions)</span>
                  </li>
                  <li>
                    <span className="list-bullet"><FiCheck /></span>
                    <span>Training (Hands-On Learning)</span>
                  </li>
                  <li>
                    <span className="list-bullet"><FiCheck /></span>
                    <span>E-commerce Industry Expert</span>
                  </li>
                  <li>
                    <span className="list-bullet"><FiCheck /></span>
                    <span>Practical Sessions with E-commerce Consultation</span>
                  </li>
                  <li>
                    <span className="list-bullet"><FiCheck /></span>
                    <span>Personal Mentorship</span>
                  </li>
                </ul>
              </motion.div>

              <motion.div className="course-hero-actions" variants={fadeUp}>
                <button onClick={handleRedirect} className="btn-primary hero-primary-btn">
                  Get Started
                  <FiArrowRight />
                </button>
                <button onClick={handleRedirect} className="btn-secondary course-explore-btn">
                  Explore Courses
                  <FiArrowRight />
                </button>
              </motion.div>
            </div>

            {/* Right Visual Image */}
            <motion.div
              className="course-hero-image-wrapper"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <img
                src="/images/alamsir.png"
                alt="E-Commerce training program"
                className="course-hero-img"
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Section 2: Meet Your Instructor ── */}
      <section className="course-instructor-section">
        <div className="container">
          <div className="course-instructor-grid">
            {/* Left Content */}
            <div className="instructor-content-col">
              <span className="section-badge">Lead Trainer</span>
              <h2 className="instructor-title">Meet Your Instructor</h2>

              <div className="instructor-bio">
                <p>
                  <strong>Aalam Ansari</strong> is a dynamic force in the e-commerce landscape — an entrepreneur, consultant, trainer, and marketing expert who has been empowering businesses to thrive in the digital era.
                </p>
                <p>
                  With over <strong>11 years of experience</strong> in the e-commerce industry, Aalam has helped <strong>500+ D2C brands, MSMEs, and startups</strong> scale their online presence and achieve measurable growth across major marketplaces.
                </p>
                <p>
                  His expertise bridges strategy, marketing, and operations — making him a sought-after E-commerce Consultant and Trainer for businesses aiming to build sustainable online success. Driven by a passion for growth and innovation, Aalam continues to mentor entrepreneurs and teams, simplifying the complex world of e-commerce into actionable insights that deliver real results.
                </p>
              </div>

              <div className="instructor-cta-box">
                <button onClick={handleRedirect} className="btn-primary">
                  Join Academy Now
                  <FiArrowRight />
                </button>
              </div>
            </div>

            {/* Right Visual Photo with splash art */}
            <div className="instructor-image-col">
              <div className="instructor-photo-wrapper">
                <img
                  src="/images/alamsir2.png"
                  alt="Aalam Ansari - Lead Instructor"
                  className="instructor-img"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Course;
