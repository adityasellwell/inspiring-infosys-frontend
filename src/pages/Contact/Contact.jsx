import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiPhoneCall, FiMail, FiMapPin, FiClock, FiSend, FiCheckCircle } from 'react-icons/fi';
import './Contact.css';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      alert('Please fill out all required fields.');
      return;
    }
    setLoading(true);
    // Simulate API Form Submission
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 1200);
  };

  return (
    <div className="contact-page">
      {/* ── Page Hero with Background Image Overlay ──────────────── */}
      <section className="inner-page-hero">
        <div className="inner-page-hero-overlay"></div>
        <div className="container inner-page-hero-content">
          <motion.span 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="section-badge"
          >
            Get In Touch
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="page-hero-title"
          >
            Contact Our Team
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="page-hero-sub"
          >
            Have a project in mind or need assistance with integrations? We are ready to help you scale.
          </motion.p>
        </div>
      </section>

      {/* ── Main Contact Content Section ─────────────────────────── */}
      <section className="contact-content-section section-padded">
        <div className="container contact-grid">
          
          {/* Column 1: Contact coordinates info */}
          <div className="contact-info-panel">
            <h2 className="panel-title">Let's Discuss Your Project</h2>
            <p className="panel-desc">
              We resolve complex e-commerce, cataloging, and custom programming problems so you can focus on building business profitability.
            </p>

            <div className="info-cards-list">
              <div className="info-card-item">
                <div className="info-icon-box"><FiPhoneCall /></div>
                <div>
                  <h4 className="info-card-label">Call / WhatsApp</h4>
                  <p className="info-card-text">+91 8444040514</p>
                </div>
              </div>

              <div className="info-card-item">
                <div className="info-icon-box"><FiMail /></div>
                <div>
                  <h4 className="info-card-label">Email Support</h4>
                  <p className="info-card-text">info@inspiringinfosys.com</p>
                </div>
              </div>

              <div className="info-card-item">
                <div className="info-icon-box"><FiMapPin /></div>
                <div>
                  <h4 className="info-card-label">Mumbai Headquarters</h4>
                  <p className="info-card-text">Bandra West & Vasai, Mumbai, India</p>
                </div>
              </div>

              <div className="info-card-item">
                <div className="info-icon-box"><FiClock /></div>
                <div>
                  <h4 className="info-card-label">Operational Hours</h4>
                  <p className="info-card-text">Monday – Saturday: 10:00 AM – 7:00 PM</p>
                </div>
              </div>
            </div>
          </div>

          {/* Column 2: Form input container */}
          <div className="contact-form-panel">
            {submitted ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="success-feedback"
              >
                <div className="success-icon"><FiCheckCircle /></div>
                <h3>Message Sent Successfully!</h3>
                <p>Thank you for reaching out. A consultant from Inspiring Infosys will contact you shortly.</p>
                <button className="btn-primary-small mt-3" onClick={() => setSubmitted(false)}>
                  Send Another Message
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="contact-actual-form">
                <h3 className="form-panel-title">Send Us A Message</h3>
                
                <div className="form-group-row">
                  <div className="form-input-group">
                    <label className="form-input-label">Full Name *</label>
                    <input 
                      type="text" 
                      name="name" 
                      value={formData.name} 
                      onChange={handleInputChange} 
                      placeholder="John Doe" 
                      className="form-control-input"
                      required
                    />
                  </div>

                  <div className="form-input-group">
                    <label className="form-input-label">Email Address *</label>
                    <input 
                      type="email" 
                      name="email" 
                      value={formData.email} 
                      onChange={handleInputChange} 
                      placeholder="john@example.com" 
                      className="form-control-input"
                      required
                    />
                  </div>
                </div>

                <div className="form-input-group">
                  <label className="form-input-label">Subject</label>
                  <input 
                    type="text" 
                    name="subject" 
                    value={formData.subject} 
                    onChange={handleInputChange} 
                    placeholder="E-Commerce API Integration query" 
                    className="form-control-input"
                  />
                </div>

                <div className="form-input-group">
                  <label className="form-input-label">Message / Details *</label>
                  <textarea 
                    name="message" 
                    value={formData.message} 
                    onChange={handleInputChange} 
                    placeholder="Tell us about your requirements..." 
                    className="form-control-textarea"
                    rows="5"
                    required
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  disabled={loading} 
                  className="btn-primary form-submit-btn"
                >
                  {loading ? 'Sending...' : 'Send Message'} <FiSend />
                </button>
              </form>
            )}
          </div>

        </div>
      </section>

      {/* ── Branch Office Maps ───────────────────────────────────── */}
      <section className="contact-maps-section section-padded">
        <div className="container">
          <h2 className="section-title text-center">Our Office Locations</h2>
          <p className="section-desc text-center mb-5">
            Visit us at our main branches in Bandra and Vasai:
          </p>

          <div className="maps-grid">
            <div className="map-card-wrapper">
              <h3 className="map-branch-title">Bandra Office</h3>
              <div className="map-iframe-container">
                <iframe 
                  title="Bandra Office Map"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3771.1680590228666!2d72.83602007497691!3d19.05634718214415!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c93d3c6b43d7%3A0xe1f6259363826fa6!2sINSPIRING%20INFO&#39;S!5e0!3m2!1sen!2sin!4v1727355232811!5m2!1sen!2sin" 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  className="map-iframe"
                ></iframe>
              </div>
            </div>

            <div className="map-card-wrapper">
              <h3 className="map-branch-title">Vasai Office</h3>
              <div className="map-iframe-container">
                <iframe 
                  title="Vasai Office Map"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3771.1680590228666!2d72.83602007497691!3d19.05634718214415!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c93d3c6b43d7%3A0xe1f6259363826fa6!2sINSPIRING%20INFO&#39;S!5e0!3m2!1sen!2sin!4v1727355232811!5m2!1sen!2sin" 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  className="map-iframe"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Contact;
