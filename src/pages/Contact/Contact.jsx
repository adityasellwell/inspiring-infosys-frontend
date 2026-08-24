import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { FiPhoneCall, FiMail, FiMapPin, FiClock, FiSend, FiCheckCircle } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { consultationsApi } from '../../api/api';
import TextCaptcha from '../../components/common/TextCaptcha/TextCaptcha';
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
  const [captchaInput, setCaptchaInput] = useState('');
  const captchaRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDirections = (address) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          window.open(`https://www.google.com/maps/dir/?api=1&origin=${latitude},${longitude}&destination=${encodeURIComponent(address)}&travelmode=driving`, '_blank');
        },
        () => {
          window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`, '_blank');
        }
      );
    } else {
      window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`, '_blank');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      alert('Please fill out all required fields.');
      return;
    }
    if (!captchaInput) {
      alert('Please enter the verification code shown below.');
      return;
    }
    setLoading(true);

    try {
      const res = await consultationsApi.submit({
        name: formData.name,
        email: formData.email,
        phone: '',
        company: formData.subject || 'Contact Page Inquiry',
        message: formData.message,
        captchaToken: captchaRef.current?.token,
        captchaAnswer: captchaInput
      });

      if (res.success) {
        setLoading(false);
        setSubmitted(true);
        setFormData({ name: '', email: '', subject: '', message: '' });
        captchaRef.current?.refresh();
      } else {
        alert(res.message || 'Submission failed. Please try again.');
        setLoading(false);
        captchaRef.current?.refresh();
      }
    } catch (error) {
      alert('An error occurred. Please check your connection and try again.');
      setLoading(false);
      captchaRef.current?.refresh();
    }
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
                  <p className="info-card-text">Vasai west, Mumbai, India</p>
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

                <div className="form-input-group">
                  <label className="form-input-label">Verification Code *</label>
                  <TextCaptcha
                    ref={captchaRef}
                    fetchChallenge={consultationsApi.getCaptcha}
                    answer={captchaInput}
                    onAnswerChange={setCaptchaInput}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || !captchaInput}
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
          <p className="section-desc text-center" style={{ maxWidth: "600px", margin: "0 auto 1.5rem" }}>
            Visit us at our main branches in Vasai and Bandra:
          </p>

          <div className="branch-list">

            {/* Vasai Branch (Now First) */}
            <div className="office-branch-card branch-vasai">
              <div className="branch-info">
                <div className="branch-header">
                  <h3 className="branch-title">Vasai Office</h3>
                  <span className="branch-status-badge">Open Now</span>
                </div>
                <p className="branch-subtitle">Inspiring Infosys Operations & Development Hub</p>
                
                <div className="branch-details">
                  <div className="branch-detail-item">
                    <FiMapPin className="branch-detail-icon" />
                    <span className="branch-detail-text">
                      DJ Arcade, 203 Second Floor, Behind Dhuri Arcade, Near Navghar Bus Depot, Next to Rishikesh Hotel, Vasai West, Mumbai, Maharashtra 401202
                    </span>
                  </div>
                  <div className="branch-detail-item">
                    <FiClock className="branch-detail-icon" />
                    <span className="branch-detail-text">
                      Monday – Saturday: 10:00 AM – 7:00 PM
                    </span>
                  </div>
                  <div className="branch-detail-item">
                    <FiPhoneCall className="branch-detail-icon" />
                    <span className="branch-detail-text">
                      +91 8444040514
                    </span>
                  </div>
                </div>
                
                <div className="branch-actions">
                  <a 
                    href="https://wa.me/918444040514" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="btn-branch-whatsapp"
                  >
                    <FaWhatsapp /> WhatsApp
                  </a>
                  <button 
                    onClick={() => handleDirections("DJ Arcade, 203 Second Floor, Behind Dhuri Arcade, Near Navghar Bus Depot, Next to Rishikesh Hotel, Vasai West, Mumbai, Maharashtra 401202")}
                    className="btn-branch-directions"
                    style={{ cursor: "pointer" }}
                  >
                    <FiSend /> Directions
                  </button>
                </div>
              </div>
              
              <div className="branch-map">
                <iframe
                  title="Vasai Office Map"
                  src="https://maps.google.com/maps?q=Dhuri%20Arcade,%20Vasai%20West,%20Mumbai,%20Maharashtra%20401202&t=&z=15&ie=UTF8&iwloc=near&output=embed"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="map-iframe"
                ></iframe>
              </div>
            </div>

            {/* Bandra Branch (Now Second) */}
            <div className="office-branch-card branch-bandra">
              <div className="branch-info">
                <div className="branch-header">
                  <h3 className="branch-title">Bandra Office</h3>
                  <span className="branch-status-badge">Open Now</span>
                </div>
                <p className="branch-subtitle">Inspiring Infosys Corporate Office</p>
                
                <div className="branch-details">
                  <div className="branch-detail-item">
                    <FiMapPin className="branch-detail-icon" />
                    <span className="branch-detail-text">
                      B2, Nutan Nagar Society, Bandra West, Mumbai, Maharashtra 400050
                    </span>
                  </div>
                  <div className="branch-detail-item">
                    <FiClock className="branch-detail-icon" />
                    <span className="branch-detail-text">
                      Monday – Saturday: 10:00 AM – 7:00 PM
                    </span>
                  </div>
                  <div className="branch-detail-item">
                    <FiPhoneCall className="branch-detail-icon" />
                    <span className="branch-detail-text">
                      +91 8444040514
                    </span>
                  </div>
                </div>
                
                <div className="branch-actions">
                  <a 
                    href="https://wa.me/918444040514" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="btn-branch-whatsapp"
                  >
                    <FaWhatsapp /> WhatsApp
                  </a>
                  <button 
                    onClick={() => handleDirections("B2, Nutan Nagar Society, Bandra West, Mumbai, Maharashtra 400050")}
                    className="btn-branch-directions"
                    style={{ cursor: "pointer" }}
                  >
                    <FiSend /> Directions
                  </button>
                </div>
              </div>
              
              <div className="branch-map">
                <iframe
                  title="Bandra Office Map"
                  src="https://maps.google.com/maps?q=INSPIRING%20INFO'S,%20B2,%20Nutan%20Nagar%20Society,%20Bandra%20West,%20Mumbai,%20Maharashtra%20400050&t=&z=15&ie=UTF8&iwloc=near&output=embed"
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
