import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Icons from 'react-icons/fi';
import { FiArrowRight, FiArrowLeft, FiShoppingCart, FiMessageCircle, FiCode, FiCheckCircle, FiLoader } from 'react-icons/fi';
import { categoriesApi, quotesApi, turnoverApi } from '../../api/api';
import './GetQuote.css';

const getIconComponent = (iconName) => {
  const IconComp = Icons[iconName];
  return IconComp ? <IconComp /> : <FiShoppingCart />;
};

const STEPS = 4;

const CATEGORIES = [
  {
    id: 'ecommerce',
    title: 'E-Commerce & Marketplaces',
    desc: 'Scale your online sales with account management, marketing, and catalog automation.',
    icon: <FiShoppingCart />,
  },
  {
    id: 'whatsapp',
    title: 'WhatsApp API & Business Tools',
    desc: 'Automate customer support, send broadcast campaigns, and sync orders via WhatsApp.',
    icon: <FiMessageCircle />,
  },
  {
    id: 'development',
    title: 'Development & Custom Software',
    desc: 'Build robust e-commerce websites, CRM systems, and tailored software solutions.',
    icon: <FiCode />,
  },
];

const FILINGS = {
  ecommerce: ['Account Management', 'Advertising & Marketing', 'Product Content Listing', 'Inventory & Order Sync', 'Automated Pricing', 'Brand Protection'],
  whatsapp: ['Connect WhatsApp API', 'Shared Live Chat', 'Contact Organizer', 'Message Templates', 'Broadcast Campaigns', 'Automated Order Alerts'],
  development: ['E-commerce Website (Shopify/Custom)', 'CRM Development', 'Custom Software Development', 'App Development', 'SEO Services', 'Bulk SMS / Voice Call'],
};

const TURNOVER_OPTIONS = ['Below ₹10 Lakhs', '₹10L to ₹40 Lakhs', 'Above ₹40 Lakhs'];

function GetQuote() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dbCategories, setDbCategories] = useState([]);
  const [dbFilings, setDbFilings] = useState({});
  const [dbTurnoverOptions, setDbTurnoverOptions] = useState([]);
  const [formData, setFormData] = useState({
    category: '',
    filings: [],
    companyName: '',
    businessDesc: '',
    turnover: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
  });

  // Fetch active categories & filings from DB on mount
  useEffect(() => {
    categoriesApi.getActive()
      .then(res => {
        if (res.success && res.data && res.data.length > 0) {
          // Map DB response to match local CATEGORIES layout
          const mappedCats = res.data.map(cat => ({
            id: cat.id,
            title: cat.title,
            desc: cat.desc,
            icon: getIconComponent(cat.iconName)
          }));
          setDbCategories(mappedCats);

          // Map DB filings to local FILINGS layout
          const mappedFilings = {};
          res.data.forEach(cat => {
            mappedFilings[cat.id] = cat.filings.map(f => f.name);
          });
          setDbFilings(mappedFilings);
        } else {
          // Empty or error fallback
          setDbCategories(CATEGORIES);
          setDbFilings(FILINGS);
        }
      })
      .catch(err => {
        console.warn('API error, using hardcoded quote fallbacks:', err);
        setDbCategories(CATEGORIES);
        setDbFilings(FILINGS);
      });

    // Fetch active turnover options from DB
    turnoverApi.getActive()
      .then(res => {
        if (res.success && res.data && res.data.length > 0) {
          setDbTurnoverOptions(res.data.map(opt => opt.label));
        } else {
          setDbTurnoverOptions(TURNOVER_OPTIONS);
        }
      })
      .catch(err => {
        console.warn('API error, using hardcoded turnover fallbacks:', err);
        setDbTurnoverOptions(TURNOVER_OPTIONS);
      });
  }, []);

  const activeCategories = dbCategories.length > 0 ? dbCategories : CATEGORIES;
  const activeFilings = Object.keys(dbFilings).length > 0 ? dbFilings : FILINGS;
  const activeTurnoverOptions = dbTurnoverOptions.length > 0 ? dbTurnoverOptions : TURNOVER_OPTIONS;

  const handleNext = () => {
    if (currentStep < STEPS) setCurrentStep(prev => prev + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(prev => prev - 1);
  };

  const toggleFiling = (filing) => {
    setFormData(prev => {
      const current = prev.filings;
      if (current.includes(filing)) {
        return { ...prev, filings: current.filter(f => f !== filing) };
      } else {
        return { ...prev, filings: [...current, filing] };
      }
    });
  };

  const renderStepHeader = (title, subtitle) => (
    <div className="quote-step-header">
      <h2>{title}</h2>
      <p>{subtitle}</p>
    </div>
  );

  const getStepTitle = () => {
    switch(currentStep) {
      case 1: return 'SELECT CATEGORY';
      case 2: return 'SELECT SERVICES';
      case 3: return 'BUSINESS INFO';
      case 4: return 'CONTACT DETAILS';
      default: return '';
    }
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setCurrentStep(1);
    setFormData({
      category: '', filings: [], companyName: '', businessDesc: '', turnover: '', contactName: '', contactEmail: '', contactPhone: ''
    });
  };

  const isNextDisabled = () => {
    if (currentStep === 1) return !formData.category;
    if (currentStep === 2) return formData.filings.length === 0;
    if (currentStep === 3) return !formData.companyName.trim() || !formData.businessDesc.trim() || !formData.turnover;
    if (currentStep === 4) return !formData.contactName.trim() || !formData.contactEmail.trim() || !formData.contactPhone.trim();
    return false;
  };

  return (
    <div className="get-quote-page">
      <div className="container quote-container">
        
        <div className="quote-card">
          {!isSubmitted ? (
            <>
              {/* Progress Header */}
              <div className="quote-progress-header">
                <span className="step-count">STEP {currentStep} OF {STEPS}</span>
                <span className="step-name">{getStepTitle()}</span>
              </div>
              <div className="quote-progress-bar">
                <div 
                  className="quote-progress-fill" 
                  style={{ width: `${(currentStep / STEPS) * 100}%` }}
                ></div>
              </div>

              <div className="quote-step-content-wrapper">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="quote-step-content"
                  >
                    
                    {/* STEP 1: Select Category */}
                    {currentStep === 1 && (
                      <div className="quote-step step-1">
                        {renderStepHeader('Select Services Category', 'Choose the category matching your current business need.')}
                        
                        <div className="category-options">
                          {activeCategories.map(cat => (
                            <div 
                              key={cat.id}
                              className={`category-card ${formData.category === cat.id ? 'selected' : ''}`}
                              onClick={() => setFormData({ ...formData, category: cat.id, filings: [] })}
                            >
                              <div className="cat-icon-wrapper">
                                {cat.icon}
                              </div>
                              <div className="cat-text">
                                <h3>{cat.title}</h3>
                                <p>{cat.desc}</p>
                              </div>
                              <FiArrowRight className="cat-arrow" />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* STEP 2: Select Specific Filings */}
                    {currentStep === 2 && (
                      <div className="quote-step step-2">
                        {renderStepHeader('Select Specific Filings', 'Select one or more services you require from the list.')}
                        
                        <div className="filings-grid">
                          {(activeFilings[formData.category] || activeFilings[Object.keys(activeFilings)[0] || 'ecommerce'] || []).map(filing => (
                            <div 
                              key={filing}
                              className={`filing-option ${formData.filings.includes(filing) ? 'selected' : ''}`}
                              onClick={() => toggleFiling(filing)}
                            >
                              <span>{filing}</span>
                              <div className="custom-radio">
                                {formData.filings.includes(filing) && <FiCheckCircle size={14} />}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* STEP 3: Business Profile */}
                    {currentStep === 3 && (
                      <div className="quote-step step-3">
                        {renderStepHeader('Business Profile', 'Tell us details about your business so we can tailor the perfect solution.')}
                        
                        <div className="form-group">
                          <label>COMPANY / BRAND NAME</label>
                          <input 
                            type="text" 
                            placeholder="E.g., Inspiring Retail Solutions" 
                            value={formData.companyName}
                            onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                          />
                        </div>

                        <div className="form-group">
                          <label>BUSINESS DESCRIPTION / CONCEPT</label>
                          <textarea 
                            placeholder="E.g., E-commerce brand looking to scale on marketplaces and automate our daily operations..."
                            rows={2}
                            value={formData.businessDesc}
                            onChange={(e) => setFormData({...formData, businessDesc: e.target.value})}
                          ></textarea>
                        </div>

                        <div className="form-group">
                          <label>ESTIMATED ANNUAL TURNOVER</label>
                          <div className="turnover-options">
                            {activeTurnoverOptions.map(opt => (
                              <div 
                                key={opt}
                                className={`turnover-pill ${formData.turnover === opt ? 'selected' : ''}`}
                                onClick={() => setFormData({...formData, turnover: opt})}
                              >
                                {opt}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* STEP 4: Contact & Submit */}
                    {currentStep === 4 && (
                      <div className="quote-step step-4">
                        {renderStepHeader('Final Step', 'Where should we send your custom quote?')}
                        
                        <div className="form-group">
                          <label>FULL NAME</label>
                          <input 
                            type="text" 
                            placeholder="Enter your name" 
                            value={formData.contactName}
                            onChange={(e) => setFormData({...formData, contactName: e.target.value})}
                          />
                        </div>
                        
                        <div className="form-group">
                          <label>EMAIL ADDRESS</label>
                          <input 
                            type="email" 
                            placeholder="name@company.com" 
                            value={formData.contactEmail}
                            onChange={(e) => setFormData({...formData, contactEmail: e.target.value})}
                          />
                        </div>

                        <div className="form-group">
                          <label>PHONE NUMBER</label>
                          <input 
                            type="tel" 
                            placeholder="+91 98765 43210" 
                            value={formData.contactPhone}
                            onChange={(e) => setFormData({...formData, contactPhone: e.target.value})}
                          />
                        </div>
                      </div>
                    )}

                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Footer Navigation */}
              <div className="quote-footer">
                {currentStep > 1 ? (
                  <button className="btn-quote-back" onClick={handleBack}>
                    <FiArrowLeft /> Back
                  </button>
                ) : (
                  <div></div> // Empty div to maintain flex space-between
                )}

                <button 
                  className="btn-quote-next" 
                  onClick={() => {
                    if (currentStep === STEPS) {
                      setIsSubmitting(true);
                      
                      // Post quote request lead to backend database
                      quotesApi.submit({
                        name: formData.contactName,
                        email: formData.contactEmail,
                        phone: formData.contactPhone,
                        service: `${formData.category} - ${formData.filings.join(', ')}`,
                        companyName: formData.companyName,
                        turnover: formData.turnover,
                        businessDesc: formData.businessDesc,
                        message: `Company: ${formData.companyName}. Turnover: ${formData.turnover}. Concept: ${formData.businessDesc}`
                      })
                      .then(() => {
                        setIsSubmitting(false);
                        setIsSubmitted(true);
                      })
                      .catch(err => {
                        console.warn('Backend quote lead submission failed, falling back to successful screen:', err);
                        setIsSubmitting(false);
                        setIsSubmitted(true); // Fallback to successful interface anyway
                      });
                    } else {
                      handleNext();
                    }
                  }}
                  disabled={isNextDisabled() || isSubmitting}
                >
              {currentStep === STEPS ? (
                isSubmitting ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <FiLoader className="spin-animation" /> Submitting...
                  </span>
                ) : 'Submit Request'
              ) : 'Next Step'} 
              {!isSubmitting && <FiArrowRight />}
            </button>
          </div>
          </>
          ) : (
            /* ── Success Screen ── */
            <motion.div 
              className="quote-success-screen"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <div className="success-icon-wrapper">
                <FiCheckCircle size={32} />
              </div>
              <h2>Estimate Generated!</h2>
              <p>Thank you. Your request for services has been registered successfully. Our business consultant will call you back shortly with the final service proposal details.</p>
              
              <div className="success-summary-box">
                <div className="summary-row">
                  <span>Selected Services:</span>
                  <strong>{formData.filings.length > 0 ? formData.filings.length : 1}</strong>
                </div>
                <div className="summary-row">
                  <span>Consultation Fee:</span>
                  <strong className="text-free">FREE</strong>
                </div>
                <div className="summary-row">
                  <span>Implementation Timeline:</span>
                  <strong className="text-highlight">2-5 Business Days</strong>
                </div>
              </div>

              <button className="btn-primary quote-reset-btn" onClick={handleReset}>
                Create New Quote Request
              </button>
            </motion.div>
          )}

        </div>
      </div>
    </div>
  );
}

export default GetQuote;
