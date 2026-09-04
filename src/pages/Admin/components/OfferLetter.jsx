import React from 'react';
import { FiPrinter, FiX, FiFileText } from 'react-icons/fi';
import './OfferLetter.css';

function OfferLetter({ employee, onClose }) {
  if (!employee) return null;

  const currentDateFormatted = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).replace(/\//g, '-');

  const formattedJoinDate = employee.joinDate
    ? new Date(employee.joinDate).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }).replace(/\//g, '/')
    : '05/08/2026';

  const numericSalary = Number(employee.salary || 0);
  const formattedSalary = `₹${numericSalary.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;

  // Reference Number Format: e.g., 26-27/August/001
  const offerDate = employee.joinDate ? new Date(employee.joinDate) : new Date();
  const yearShort = String(offerDate.getFullYear()).slice(-2);
  const nextYearShort = String(offerDate.getFullYear() + 1).slice(-2);
  const finYearStr = `${yearShort}-${nextYearShort}`;
  const monthNameStr = offerDate.toLocaleDateString('en-US', { month: 'long' });
  
  let refNo;
  if (employee.empId && employee.empId.includes('/')) {
    refNo = employee.empId;
  } else {
    const rawId = employee.empId || String(employee.id || 1);
    const cleanNum = rawId.replace(/\D/g, '') || String(employee.id || 1);
    const paddedNum = cleanNum.padStart(3, '0');
    refNo = `${finYearStr}/${monthNameStr}/${paddedNum}`;
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="offer-letter-modal-overlay" onClick={onClose}>
      <div className="offer-letter-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header Bar */}
        <div className="offer-letter-modal-header no-print">
          <div className="modal-header-title">
            <FiFileText size={20} className="modal-icon" />
            <span>Official Employee Offer Letter – <strong>{employee.name}</strong></span>
          </div>
          <div className="modal-header-actions">
            <button
              type="button"
              className="btn-modal-print"
              onClick={handlePrint}
              title="Print or Save as PDF"
            >
              <FiPrinter size={16} /> Print / Save as PDF
            </button>
            <button
              type="button"
              className="btn-modal-close"
              onClick={onClose}
              title="Close Modal"
            >
              <FiX size={18} />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="offer-letter-modal-body">
          <div className="offer-letter-document-wrapper">

            {/* ════════════════════════ PAGE 1: OFFER LETTER ════════════════════════ */}
            <div className="offer-letter-page page-1">
              {/* Top Curved Blue Header Banner */}
              <div className="doc-top-blue-header">
                <svg className="header-wave-svg" viewBox="0 0 1000 130" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="blueHeaderGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#08529c" />
                      <stop offset="60%" stopColor="#0b66b8" />
                      <stop offset="100%" stopColor="#0d7acc" />
                    </linearGradient>
                  </defs>
                  <path d="M 0,0 L 1000,0 L 1000,125 C 650,115 350,20 0,60 Z" fill="url(#blueHeaderGrad1)" />
                </svg>
                <div className="header-logo-container">
                  <img src="/images/logo2.webp" alt="Inspiring Infosys Logo" className="header-banner-logo" />
                </div>
              </div>

              {/* Date & Ref Row */}
              <div className="doc-meta-row">
                <span className="doc-ref">Ref No: {refNo}</span>
                <span className="doc-date">{currentDateFormatted}</span>
              </div>

              {/* Recipient */}
              <div className="doc-recipient">
                <p className="to-label">To,</p>
                <p className="recipient-name"><strong>{employee.name.startsWith('Mr.') || employee.name.startsWith('Ms.') ? employee.name : `Mr./Ms. ${employee.name}`}</strong></p>
              </div>

              {/* Subject */}
              <div className="doc-subject">
                <u><strong>Subject: Offer of Employment</strong></u>
              </div>

              {/* Letter Paragraphs */}
              <div className="doc-paragraphs">
                <p>
                  I am writing to you on behalf of <strong>INSPIRING INFOSYS</strong>, innovative IT & E-Commerce Company specializing in IT & E-Commerce Service Provider. We have thoroughly reviewed your qualifications and are delighted to extend a formal offer of employment to you for the position of <strong>{employee.designation || 'Full Stack Developer'}</strong> at <strong>INSPIRING INFOSYS</strong>.
                </p>

                <p>
                  We were impressed by your skills, experience, and achievements, which align perfectly with our company's goals and values. We believe that your expertise will greatly contribute to our continued success. We are excited to have you join our team and contribute to our mission.
                </p>

                <p>
                  As a <strong>{employee.designation || 'Full Stack Developer'}</strong>, you will be responsible for [{employee.department ? `${employee.department} Department Tasks & Core Project Execution` : 'Software Development & Technical Duties'}]. Additionally, you will have the opportunity to collaborate with a talented and motivated team, work on cutting-edge projects, and contribute to our company's growth and innovation.
                </p>

                <p className="offer-details-intro">Here are the details of our offer:</p>

                <div className="position-highlight-box">
                  <strong>Position: {employee.designation || 'Full Stack Developer'}</strong>
                </div>

                <p>
                  Please note that this offer is contingent upon successful completion of background checks and any other pre-employment requirements. You will receive further instructions regarding these processes separately. You are requested to join us by <strong>{formattedJoinDate}</strong>. In the event of you are not joining us within the aforementioned date or not requesting for an extension to that effect, this offer shall stand withdrawn automatically. The remuneration offered is as mentioned under Annexure A.
                </p>
              </div>

              {/* Official Footer */}
              <div className="official-page-footer">
                <p className="footer-address">
                  203 second floor’ DJ Arcade Behaind Dhuri Archad, near Navghar, next to Rishikesh Hotel, Vasai West, Mumbai, Maharashtra 401202 Phone: +91(022) 8444040514
                </p>
                <div className="footer-color-bar">
                  <div className="bar-left">www.inspiringinfosys.com</div>
                  <div className="bar-right">Email: info@inspiringinfosys.com</div>
                </div>
              </div>
            </div>

            {/* ════════════════════════ PAGE 2: ANNEXURE A ════════════════════════ */}
            <div className="offer-letter-page page-2">
              {/* Top Curved Blue Header Banner */}
              <div className="doc-top-blue-header">
                <svg className="header-wave-svg" viewBox="0 0 1000 130" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="blueHeaderGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#08529c" />
                      <stop offset="60%" stopColor="#0b66b8" />
                      <stop offset="100%" stopColor="#0d7acc" />
                    </linearGradient>
                  </defs>
                  <path d="M 0,0 L 1000,0 L 1000,125 C 650,115 350,20 0,60 Z" fill="url(#blueHeaderGrad2)" />
                </svg>
                <div className="header-logo-container">
                  <img src="/images/logo2.webp" alt="Inspiring Infosys Logo" className="header-banner-logo" />
                </div>
              </div>

              {/* Date & Ref Row */}
              <div className="doc-meta-row">
                <span className="doc-ref">Ref No: {refNo}</span>
                <span className="doc-date">{currentDateFormatted}</span>
              </div>

              {/* Annexure A Title */}
              <div className="annexure-title">
                <h2>Annexure A</h2>
              </div>

              <p className="annexure-sub">Particulars of remuneration & other benefits are appended here below:</p>

              {/* Remuneration Table */}
              <table className="remuneration-table">
                <thead>
                  <tr>
                    <th>Components</th>
                    <th>Amount (Rs.)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Basic Salary (Per Month)</td>
                    <td><strong>{formattedSalary}</strong></td>
                  </tr>
                </tbody>
              </table>

              {/* Compensation & Terms */}
              <div className="terms-block">
                <h3>Compensation & Employment Terms</h3>
                <ul>
                  <li>
                    Standard probation period will be <strong>3 months</strong> from the date of joining.
                  </li>
                  <li>
                    The basic monthly salary will be <strong>{formattedSalary}</strong>, payable in accordance with the company regular payroll schedule.
                  </li>
                  <li>
                    Salary revision and performance appraisal will be conducted periodically based on individual <strong>performance, skills, and overall contribution</strong>.
                  </li>
                </ul>

                <p>
                  While there is no formal employment bond, we expect a mutual commitment from employees to remain with the company for a minimum of <strong>1 to 2.5 years</strong>. This understanding helps ensure continuity and supports long-term growth for both the employee and the organization.
                </p>

                <p>
                  Working hours are from 10:00 AM to 7:00 PM with Sundays off and observance of national holidays. Additionally, employees are entitled to 10 paid leaves annually. For new joining they must complete one year to take benefit of annual paid leave.
                </p>

                <p>
                  According to company policy, it is mandatory to complete the notice period before departing. Failure to do so will result in withholding of the final month's salary and others benefits like experience letter, relieving letter until the notice period is fulfilled.
                </p>

                <p>
                  Please return the signed copy of this document as a token of acceptance for our records.
                </p>

                <p>
                  We are eagerly anticipating your positive response and look forward to welcoming you to the <strong>INSPIRING INFOSYS</strong> team. Thank you for considering this offer, and we believe that together, we will achieve great things.
                </p>
              </div>

              {/* Bottom Signatures for Annexure */}
              <div className="annexure-signatures-row">
                <div className="annexure-sig-col">
                  <p className="sig-heading">Received By</p>
                  <div className="dots-line">……………………………………………</div>
                  <p className="sig-sub"><strong>Signature of Employee with Date</strong></p>
                </div>

                <div className="annexure-sig-col right-col">
                  <p className="sig-heading">For <strong>Inspiring Infosys</strong></p>
                  <div className="stamp-wrapper inline-stamp">
                    <img src="/images/company-stamp.png" alt="Inspiring Infosys Stamp & Signature" className="official-stamp-img" />
                  </div>
                  <p className="sig-sub"><strong>Authorized Signatory/ Director</strong></p>
                </div>
              </div>

              {/* Official Footer */}
              <div className="official-page-footer">
                <p className="footer-address">
                  203 second floor’ DJ Arcade Behaind Dhuri Archad, near Navghar, next to Rishikesh Hotel, Vasai West, Mumbai, Maharashtra 401202 Phone: +91(022) 8444040514
                </p>
                <div className="footer-color-bar">
                  <div className="bar-left">www.inspiringinfosys.com</div>
                  <div className="bar-right">Email: info@inspiringinfosys.com</div>
                </div>
              </div>
            </div>

            {/* ════════════════════════ PAGE 3: CHECKLIST & DECLARATION ════════════════════════ */}
            <div className="offer-letter-page page-3">
              {/* Top Curved Blue Header Banner */}
              <div className="doc-top-blue-header">
                <svg className="header-wave-svg" viewBox="0 0 1000 130" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="blueHeaderGrad3" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#08529c" />
                      <stop offset="60%" stopColor="#0b66b8" />
                      <stop offset="100%" stopColor="#0d7acc" />
                    </linearGradient>
                  </defs>
                  <path d="M 0,0 L 1000,0 L 1000,125 C 650,115 350,20 0,60 Z" fill="url(#blueHeaderGrad3)" />
                </svg>
                <div className="header-logo-container">
                  <img src="/images/logo2.webp" alt="Inspiring Infosys Logo" className="header-banner-logo" />
                </div>
              </div>

              {/* Date & Ref Row */}
              <div className="doc-meta-row">
                <span className="doc-ref">Ref No: {refNo}</span>
                <span className="doc-date">{currentDateFormatted}</span>
              </div>

              {/* Requirements Checklist */}
              <div className="joining-checklist-block">
                <p className="checklist-heading">You are required to submit the following at the time of joining:</p>

                <ul className="checklist-items">
                  <li>Passport Size photographs – 1 nos.</li>
                  <li>Photocopy of your testimonials – Std 10 level onwards.</li>
                  <li>Proof of DOB, Aadhar Card, PAN Card , Voter Card.</li>
                  <li>One Cancelled Cheque of your own Bank Account.</li>
                  <li>Post Card Size Family Photo – 3 Copies (applicable only for those who are entitled for ESIC)(optional)</li>
                  <li>Fitness Certificate & Blood group Certificate provided by a Registered Medical Practitioner.(optional)</li>
                </ul>
              </div>

              {/* Signatures */}
              <div className="page-signature-section">
                <div className="company-sig-box">
                  <p className="sig-for-company">For <strong>Inspiring Infosys</strong></p>
                  <div className="stamp-wrapper">
                    <img src="/images/company-stamp.png" alt="Inspiring Infosys Stamp & Signature" className="official-stamp-img" />
                  </div>
                  <p className="sig-title">Director/Authorized Signatory</p>
                </div>

                <div className="acceptance-declaration">
                  <p>
                    I hereby declare that, I have read and understood the above-mentioned terms and in agreement with them and also hereby confirm to accept the offer.
                  </p>
                  <div className="dots-line">……………………………………………</div>
                  <p className="receiver-sig-label"><strong>Signature of Receiver</strong></p>
                </div>
              </div>

              {/* Official Footer */}
              <div className="official-page-footer">
                <p className="footer-address">
                  203 second floor’ DJ Arcade Behaind Dhuri Archad, near Navghar, next to Rishikesh Hotel, Vasai West, Mumbai, Maharashtra 401202 Phone: +91(022) 8444040514
                </p>
                <div className="footer-color-bar">
                  <div className="bar-left">www.inspiringinfosys.com</div>
                  <div className="bar-right">Email: info@inspiringinfosys.com</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default OfferLetter;
