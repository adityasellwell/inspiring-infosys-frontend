import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { FiPrinter, FiX, FiFileText, FiCalendar, FiEdit3, FiRotateCcw, FiCheck } from 'react-icons/fi';
import './OfferLetter.css';

function OfferLetter({ employee, onClose, isReadOnly = false }) {
  if (!employee) return null;

  useEffect(() => {
    return () => {
      document.body.classList.remove('letter-printing', 'offer-letter-printing');
    };
  }, []);

  const todayStr = new Date().toISOString().split('T')[0];

  const parseLocalDate = (dateString) => {
    if (!dateString) return null;
    const clean = String(dateString).split('T')[0];
    const parts = clean.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      return new Date(year, month, day);
    }
    return new Date(dateString);
  };

  const getInitialJoinDateStr = () => {
    if (employee.joinDate) {
      const d = parseLocalDate(employee.joinDate);
      if (d && !isNaN(d.getTime())) {
        return d.toISOString().split('T')[0];
      }
    }
    return todayStr;
  };

  const [joiningDate, setJoiningDate] = useState(getInitialJoinDateStr());
  const [salaryInput, setSalaryInput] = useState(String(employee.salary || 0));
  const [isEditMode, setIsEditMode] = useState(false);

  const currentDateFormatted = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).replace(/\//g, '-');

  const formatDateDisplay = (dateString) => {
    const d = parseLocalDate(dateString);
    if (!d || isNaN(d.getTime())) return dateString || '';
    return d.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).replace(/\//g, '/');
  };

  const formattedJoinDate = formatDateDisplay(joiningDate);

  const formatCurrency = (val) => {
    const num = Number(val || 0);
    return `₹${num.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
  };

  const getInitialRefNo = () => {
    const offerDate = parseLocalDate(joiningDate) || new Date();
    const yearShort = String(offerDate.getFullYear()).slice(-2);
    const nextYearShort = String(offerDate.getFullYear() + 1).slice(-2);
    const finYearStr = `${yearShort}-${nextYearShort}`;
    const monthNameStr = offerDate.toLocaleDateString('en-US', { month: 'long' });

    if (employee.empId && employee.empId.includes('/')) {
      return employee.empId;
    }
    const rawId = employee.empId || String(employee.id || 1);
    const cleanNum = rawId.replace(/\D/g, '') || String(employee.id || 1);
    const paddedNum = cleanNum.padStart(3, '0');
    return `${finYearStr}/${monthNameStr}/${paddedNum}`;
  };

  // Editable text states
  const [refNo, setRefNo] = useState(getInitialRefNo());
  const [candidateName, setCandidateName] = useState(employee.name || '');
  const [designationText, setDesignationText] = useState(employee.designation || 'Full Stack Developer');
  const [departmentText, setDepartmentText] = useState(employee.department || 'IT & Software');
  const [salaryText, setSalaryText] = useState(formatCurrency(salaryInput));
  const [subjectText, setSubjectText] = useState('Subject: Offer of Employment');

  const [para1, setPara1] = useState(
    `I am writing to you on behalf of INSPIRING INFOSYS, innovative IT & E-Commerce Company specializing in IT & E-Commerce Service Provider. We have thoroughly reviewed your qualifications and are delighted to extend a formal offer of employment to you for the position of ${designationText} at INSPIRING INFOSYS.`
  );

  const [para2, setPara2] = useState(
    `We were impressed by your skills, experience, and achievements, which align perfectly with our company's goals and values. We believe that your expertise will greatly contribute to our continued success. We are excited to have you join our team and contribute to our mission.`
  );

  const [para3, setPara3] = useState(
    `As a ${designationText}, you will be responsible for [${departmentText ? `${departmentText} Department Tasks & Core Project Execution` : 'Software Development & Technical Duties'}]. Additionally, you will have the opportunity to collaborate with a talented and motivated team, work on cutting-edge projects, and contribute to our company's growth and innovation.`
  );

  const [para4, setPara4] = useState(
    `Please note that this offer is contingent upon successful completion of background checks and any other pre-employment requirements. You will receive further instructions regarding these processes separately. You are requested to join us by ${formattedJoinDate}. In the event of you are not joining us within the aforementioned date or not requesting for an extension to that effect, this offer shall stand withdrawn automatically. The remuneration offered is as mentioned under Annexure A.`
  );

  const [probationText, setProbationText] = useState('3 months');
  const [commitmentText, setCommitmentText] = useState('1 to 2.5 years');
  const [signatoryTitle, setSignatoryTitle] = useState('Authorized Signatory/ Director');
  const [offerDetailsIntro, setOfferDetailsIntro] = useState('Here are the details of our offer:');
  const [sincerelyText, setSincerelyText] = useState('Sincerely,');
  const [teamText, setTeamText] = useState('Inspiring Infosys Team');
  const [forCompanyText, setForCompanyText] = useState('Inspiring Infosys');

  // Page 2 Annexure A states
  const [annexureTitleText, setAnnexureTitleText] = useState('Annexure A');
  const [annexureSubText, setAnnexureSubText] = useState('Particulars of remuneration & other benefits are appended here below:');
  const [thComponentsText, setThComponentsText] = useState('Components');
  const [thAmountText, setThAmountText] = useState('Amount (Rs.)');
  const [tdBasicSalaryText, setTdBasicSalaryText] = useState('Basic Salary (Per Month)');
  const [termsHeadingText, setTermsHeadingText] = useState('Compensation & Employment Terms');

  const [termBullet1, setTermBullet1] = useState(
    `Standard probation period will be ${probationText} from the date of joining.`
  );
  const [termBullet2, setTermBullet2] = useState(
    `The basic monthly salary will be ${salaryText}, payable in accordance with the company regular payroll schedule.`
  );
  const [termBullet3, setTermBullet3] = useState(
    `Salary revision and performance appraisal will be conducted periodically based on individual performance, skills, and overall contribution.`
  );

  const [termPara1, setTermPara1] = useState(
    `While there is no formal employment bond, we expect a mutual commitment from employees to remain with the company for a minimum of ${commitmentText}. This understanding helps ensure continuity and supports long-term growth for both the employee and the organization.`
  );
  const [termPara2, setTermPara2] = useState(
    `Working hours are from 10:00 AM to 7:00 PM with Sundays off and observance of national holidays. Additionally, employees are entitled to 10 paid leaves annually. For new joining they must complete one year to take benefit of annual paid leave.`
  );
  const [termPara3, setTermPara3] = useState(
    `According to company policy, it is mandatory to complete the notice period before departing. Failure to do so will result in withholding of the final month's salary and others benefits like experience letter, relieving letter until the notice period is fulfilled.`
  );
  const [termPara4, setTermPara4] = useState(
    `Please return the signed copy of this document as a token of acceptance for our records.`
  );
  const [termPara5, setTermPara5] = useState(
    `We are eagerly anticipating your positive response and look forward to welcoming you to the INSPIRING INFOSYS team. Thank you for considering this offer, and we believe that together, we will achieve great things.`
  );

  const [receivedByHeading, setReceivedByHeading] = useState('Received By');
  const [receivedBySub, setReceivedBySub] = useState('Signature of Employee with Date');

  // Page 3 Checklist & Declaration states
  const [checklistHeading, setChecklistHeading] = useState('You are required to submit the following at the time of joining:');
  const [checklistItem1, setChecklistItem1] = useState('Passport Size photographs – 1 nos.');
  const [checklistItem2, setChecklistItem2] = useState('Photocopy of your testimonials – Std 10 level onwards.');
  const [checklistItem3, setChecklistItem3] = useState('Proof of DOB, Aadhar Card, PAN Card , Voter Card.');
  const [checklistItem4, setChecklistItem4] = useState('One Cancelled Cheque of your own Bank Account.');
  const [checklistItem5, setChecklistItem5] = useState('Post Card Size Family Photo – 3 Copies (applicable only for those who are entitled for ESIC)(optional)');
  const [checklistItem6, setChecklistItem6] = useState('Fitness Certificate & Blood group Certificate provided by a Registered Medical Practitioner.(optional)');

  const [declarationPara, setDeclarationPara] = useState(
    'I hereby declare that, I have read and understood the above-mentioned terms and in agreement with them and also hereby confirm to accept the offer.'
  );
  const [receiverSigLabel, setReceiverSigLabel] = useState('Signature of Receiver');

  // Sync formatted salary when salary input changes in header
  useEffect(() => {
    setSalaryText(formatCurrency(salaryInput));
  }, [salaryInput]);

  // Dynamic scale for mobile: fit A4 (794px) within the modal body width
  const modalBodyRef = useRef(null);
  const [pageScale, setPageScale] = useState(1);
  useEffect(() => {
    const computeScale = () => {
      if (!modalBodyRef.current) return;
      const available = modalBodyRef.current.clientWidth - 32;
      const a4px = 794; // 210mm at 96dpi
      setPageScale(available >= a4px ? 1 : Math.round((available / a4px) * 100) / 100);
    };
    computeScale();
    window.addEventListener('resize', computeScale);
    return () => window.removeEventListener('resize', computeScale);
  }, []);

  // Sync paras when dates/desig change unless overridden
  useEffect(() => {
    setPara1(`I am writing to you on behalf of INSPIRING INFOSYS, innovative IT & E-Commerce Company specializing in IT & E-Commerce Service Provider. We have thoroughly reviewed your qualifications and are delighted to extend a formal offer of employment to you for the position of ${designationText} at INSPIRING INFOSYS.`);
    setPara3(`As a ${designationText}, you will be responsible for [${departmentText ? `${departmentText} Department Tasks & Core Project Execution` : 'Software Development & Technical Duties'}]. Additionally, you will have the opportunity to collaborate with a talented and motivated team, work on cutting-edge projects, and contribute to our company's growth and innovation.`);
    setPara4(`Please note that this offer is contingent upon successful completion of background checks and any other pre-employment requirements. You will receive further instructions regarding these processes separately. You are requested to join us by ${formattedJoinDate}. In the event of you are not joining us within the aforementioned date or not requesting for an extension to that effect, this offer shall stand withdrawn automatically. The remuneration offered is as mentioned under Annexure A.`);
    setTermBullet1(`Standard probation period will be ${probationText} from the date of joining.`);
    setTermBullet2(`The basic monthly salary will be ${salaryText}, payable in accordance with the company regular payroll schedule.`);
    setTermPara1(`While there is no formal employment bond, we expect a mutual commitment from employees to remain with the company for a minimum of ${commitmentText}. This understanding helps ensure continuity and supports long-term growth for both the employee and the organization.`);
  }, [joiningDate, designationText, departmentText, probationText, commitmentText, salaryText]);

  const handleResetDefaults = () => {
    setRefNo(getInitialRefNo());
    setCandidateName(employee.name || '');
    setDesignationText(employee.designation || 'Full Stack Developer');
    setDepartmentText(employee.department || 'IT & Software');
    setSalaryInput(String(employee.salary || 0));
    setSalaryText(formatCurrency(employee.salary || 0));
    setSubjectText('Subject: Offer of Employment');
    setOfferDetailsIntro('Here are the details of our offer:');
    setSincerelyText('Sincerely,');
    setTeamText('Inspiring Infosys Team');
    setForCompanyText('Inspiring Infosys');
    setSignatoryTitle('Authorized Signatory/ Director');
    setProbationText('3 months');
    setCommitmentText('1 to 2.5 years');
    setPara1(`I am writing to you on behalf of INSPIRING INFOSYS, innovative IT & E-Commerce Company specializing in IT & E-Commerce Service Provider. We have thoroughly reviewed your qualifications and are delighted to extend a formal offer of employment to you for the position of ${employee.designation || 'Full Stack Developer'} at INSPIRING INFOSYS.`);
    setPara2(`We were impressed by your skills, experience, and achievements, which align perfectly with our company's goals and values. We believe that your expertise will greatly contribute to our continued success. We are excited to have you join our team and contribute to our mission.`);
    setPara3(`As a ${employee.designation || 'Full Stack Developer'}, you will be responsible for [${employee.department ? `${employee.department} Department Tasks & Core Project Execution` : 'Software Development & Technical Duties'}]. Additionally, you will have the opportunity to collaborate with a talented and motivated team, work on cutting-edge projects, and contribute to our company's growth and innovation.`);
    setPara4(`Please note that this offer is contingent upon successful completion of background checks and any other pre-employment requirements. You will receive further instructions regarding these processes separately. You are requested to join us by ${formattedJoinDate}. In the event of you are not joining us within the aforementioned date or not requesting for an extension to that effect, this offer shall stand withdrawn automatically. The remuneration offered is as mentioned under Annexure A.`);
    setAnnexureTitleText('Annexure A');
    setAnnexureSubText('Particulars of remuneration & other benefits are appended here below:');
    setThComponentsText('Components');
    setThAmountText('Amount (Rs.)');
    setTdBasicSalaryText('Basic Salary (Per Month)');
    setTermsHeadingText('Compensation & Employment Terms');
    setTermBullet1(`Standard probation period will be 3 months from the date of joining.`);
    setTermBullet2(`The basic monthly salary will be ${formatCurrency(employee.salary || 0)}, payable in accordance with the company regular payroll schedule.`);
    setTermBullet3(`Salary revision and performance appraisal will be conducted periodically based on individual performance, skills, and overall contribution.`);
    setTermPara1(`While there is no formal employment bond, we expect a mutual commitment from employees to remain with the company for a minimum of 1 to 2.5 years. This understanding helps ensure continuity and supports long-term growth for both the employee and the organization.`);
    setTermPara2(`Working hours are from 10:00 AM to 7:00 PM with Sundays off and observance of national holidays. Additionally, employees are entitled to 10 paid leaves annually. For new joining they must complete one year to take benefit of annual paid leave.`);
    setTermPara3(`According to company policy, it is mandatory to complete the notice period before departing. Failure to do so will result in withholding of the final month's salary and others benefits like experience letter, relieving letter until the notice period is fulfilled.`);
    setTermPara4(`Please return the signed copy of this document as a token of acceptance for our records.`);
    setTermPara5(`We are eagerly anticipating your positive response and look forward to welcoming you to the INSPIRING INFOSYS team. Thank you for considering this offer, and we believe that together, we will achieve great things.`);
    setReceivedByHeading('Received By');
    setReceivedBySub('Signature of Employee with Date');
    setChecklistHeading('You are required to submit the following at the time of joining:');
    setChecklistItem1('Passport Size photographs – 1 nos.');
    setChecklistItem2('Photocopy of your testimonials – Std 10 level onwards.');
    setChecklistItem3('Proof of DOB, Aadhar Card, PAN Card , Voter Card.');
    setChecklistItem4('One Cancelled Cheque of your own Bank Account.');
    setChecklistItem5('Post Card Size Family Photo – 3 Copies (applicable only for those who are entitled for ESIC)(optional)');
    setChecklistItem6('Fitness Certificate & Blood group Certificate provided by a Registered Medical Practitioner.(optional)');
    setDeclarationPara('I hereby declare that, I have read and understood the above-mentioned terms and in agreement with them and also hereby confirm to accept the offer.');
    setReceiverSigLabel('Signature of Receiver');
  };

  const handlePrint = async () => {
    setIsEditMode(false);

    const cleanName = (candidateName || employee?.name || 'Candidate').trim().replace(/[^a-zA-Z0-9_-]/g, '_');

    // Mobile: generate actual PDF file download
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || (window.innerWidth <= 768);

    if (isMobile) {
      try {
        const html2pdf = (await import('html2pdf.js')).default;
        const pages = document.querySelectorAll('.offer-letter-page');
        if (!pages.length) return;

        // Temporarily fix scale for capture
        pages.forEach(page => {
          page.style.transform = 'none';
          page.style.marginBottom = '0';
          page.style.width = '210mm';
          page.style.minHeight = '297mm';
          page.style.height = '297mm';
          page.style.boxShadow = 'none';
        });

        await new Promise(r => setTimeout(r, 150));

        const tempContainer = document.createElement('div');
        tempContainer.style.width = '210mm';
        tempContainer.style.background = '#ffffff';
        tempContainer.style.position = 'absolute';
        tempContainer.style.left = '-9999px';
        tempContainer.style.top = '0';

        pages.forEach((page, i) => {
          const clone = page.cloneNode(true);
          clone.style.width = '210mm';
          clone.style.minHeight = '297mm';
          clone.style.height = '297mm';
          clone.style.transform = 'none';
          clone.style.marginBottom = '0';
          clone.style.boxShadow = 'none';
          clone.style.pageBreakAfter = i < pages.length - 1 ? 'always' : 'auto';
          tempContainer.appendChild(clone);
        });

        document.body.appendChild(tempContainer);

        await html2pdf().set({
          margin: 0,
          filename: `Offer_Letter_${cleanName}.pdf`,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true, allowTaint: true, logging: false, width: 794, windowWidth: 794 },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
          pagebreak: { mode: ['css', 'legacy'] }
        }).from(tempContainer).save();

        document.body.removeChild(tempContainer);

        // Restore page styles
        pages.forEach(page => {
          page.style.transform = '';
          page.style.marginBottom = '';
          page.style.width = '';
          page.style.minHeight = '';
          page.style.height = '';
          page.style.boxShadow = '';
        });
      } catch (err) {
        console.error('PDF generation failed, falling back to print:', err);
        window.print();
      }
      return;
    }

    // Desktop: use window.print()
    const originalTitle = document.title;
    document.title = `Offer_Letter_${cleanName}`;
    document.body.classList.add('letter-printing', 'offer-letter-printing');

    const cleanup = () => {
      document.title = originalTitle;
      document.body.classList.remove('letter-printing', 'offer-letter-printing');
      window.removeEventListener('afterprint', cleanup);
    };

    window.addEventListener('afterprint', cleanup);

    setTimeout(() => {
      window.print();
    }, 200);
  };

  const recipientPrefix = candidateName && (candidateName.toLowerCase().startsWith('mr.') || candidateName.toLowerCase().startsWith('ms.'))
    ? ''
    : 'Mr./Ms. ';

  const modalContent = (
    <div className="offer-letter-modal-overlay" onClick={onClose}>
      <div className="offer-letter-modal-card" onClick={(e) => e.stopPropagation()}>

        {/* Compact Header Bar */}
        <div className="offer-letter-modal-header no-print">
          <div className="header-top-row">
            <div className="modal-header-title">
              <FiFileText size={20} className="modal-icon" />
              <span>Official Offer Letter – <strong>{candidateName}</strong></span>
            </div>

            <div className="modal-header-actions">
              {!isReadOnly && (
                <button
                  type="button"
                  className={`btn-toggle-edit ${isEditMode ? 'active' : ''}`}
                  onClick={() => setIsEditMode(!isEditMode)}
                  title={isEditMode ? 'Finish Editing' : 'Click text on offer letter to edit directly'}
                >
                  {isEditMode ? <><FiCheck size={14} /> Done</> : <><FiEdit3 size={14} /> Edit</>}
                </button>
              )}

              <button
                type="button"
                className="btn-modal-print"
                onClick={handlePrint}
                title="Print or Save as PDF"
              >
                <FiPrinter size={16} /> <span>Print / Save PDF</span>
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
        </div>

        {/* Modal Scrollable Body */}
        <div className="offer-letter-modal-body" ref={modalBodyRef}>
          <div
            className="offer-letter-document-wrapper"
            style={{ '--doc-scale': pageScale }}
          >

            {isEditMode && (
              <div className="edit-banner-info no-print">
                <FiEdit3 size={14} /> <strong>Inline Edit Mode Active:</strong> Click on any text inside ANY page of the offer letter below to edit headings, terms, tables, checklist items, or signatures directly!
              </div>
            )}

            {/* ════════════════════════ PAGE 1: OFFER LETTER ════════════════════════ */}
            <div className={`offer-letter-page page-1 ${isEditMode ? 'editable-page-active' : ''}`}>
              {/* Top Curved Blue Header Banner */}
              <div className="doc-top-blue-header">
                <svg className="header-wave-svg" viewBox="0 0 1000 130" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="blueHeaderGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#004b99" />
                      <stop offset="50%" stopColor="#0077e6" />
                      <stop offset="100%" stopColor="#00a8ff" />
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
                <span className="doc-ref">
                  Ref No: <strong
                    contentEditable={isEditMode}
                    suppressContentEditableWarning={true}
                    onBlur={(e) => setRefNo(e.target.innerText)}
                    className={isEditMode ? 'editable-field' : ''}
                  >{refNo}</strong>
                </span>
                <span className="doc-date">{currentDateFormatted}</span>
              </div>

              {/* Recipient */}
              <div className="doc-recipient">
                <p className="to-label">To,</p>
                <p className="recipient-name">
                  <strong>
                    {recipientPrefix}
                    <span
                      contentEditable={isEditMode}
                      suppressContentEditableWarning={true}
                      onBlur={(e) => setCandidateName(e.target.innerText)}
                      className={isEditMode ? 'editable-field' : ''}
                    >{candidateName}</span>
                  </strong>
                </p>
              </div>

              {/* Subject */}
              <div className="doc-subject">
                <u>
                  <strong
                    contentEditable={isEditMode}
                    suppressContentEditableWarning={true}
                    onBlur={(e) => setSubjectText(e.target.innerText)}
                    className={isEditMode ? 'editable-field' : ''}
                  >{subjectText}</strong>
                </u>
              </div>

              {/* Letter Paragraphs */}
              <div className="doc-paragraphs">
                <p
                  contentEditable={isEditMode}
                  suppressContentEditableWarning={true}
                  onBlur={(e) => setPara1(e.target.innerText)}
                  className={isEditMode ? 'editable-field' : ''}
                >
                  {para1}
                </p>

                <p
                  contentEditable={isEditMode}
                  suppressContentEditableWarning={true}
                  onBlur={(e) => setPara2(e.target.innerText)}
                  className={isEditMode ? 'editable-field' : ''}
                >
                  {para2}
                </p>

                <p
                  contentEditable={isEditMode}
                  suppressContentEditableWarning={true}
                  onBlur={(e) => setPara3(e.target.innerText)}
                  className={isEditMode ? 'editable-field' : ''}
                >
                  {para3}
                </p>

                <p
                  contentEditable={isEditMode}
                  suppressContentEditableWarning={true}
                  onBlur={(e) => setOfferDetailsIntro(e.target.innerText)}
                  className={`offer-details-intro ${isEditMode ? 'editable-field' : ''}`}
                >
                  {offerDetailsIntro}
                </p>

                <div className="position-highlight-box">
                  <strong>Position: <span
                    contentEditable={isEditMode}
                    suppressContentEditableWarning={true}
                    onBlur={(e) => setDesignationText(e.target.innerText)}
                    className={isEditMode ? 'editable-field' : ''}
                  >{designationText}</span></strong>
                </div>

                <p
                  contentEditable={isEditMode}
                  suppressContentEditableWarning={true}
                  onBlur={(e) => setPara4(e.target.innerText)}
                  className={isEditMode ? 'editable-field' : ''}
                >
                  {para4}
                </p>
              </div>

              {/* Signatures for Page 1 */}
              <div className="annexure-signatures-row" style={{ marginTop: '15px', marginBottom: '10px' }}>
                <div className="annexure-sig-col">
                  <p
                    contentEditable={isEditMode}
                    suppressContentEditableWarning={true}
                    onBlur={(e) => setSincerelyText(e.target.innerText)}
                    className={`sig-heading ${isEditMode ? 'editable-field' : ''}`}
                  >
                    {sincerelyText}
                  </p>
                  <p
                    contentEditable={isEditMode}
                    suppressContentEditableWarning={true}
                    onBlur={(e) => setTeamText(e.target.innerText)}
                    className={`sig-sub ${isEditMode ? 'editable-field' : ''}`}
                  >
                    <strong>{teamText}</strong>
                  </p>
                </div>

                <div className="annexure-sig-col right-col">
                  <p
                    contentEditable={isEditMode}
                    suppressContentEditableWarning={true}
                    onBlur={(e) => setForCompanyText(e.target.innerText)}
                    className={`sig-heading ${isEditMode ? 'editable-field' : ''}`}
                  >
                    For <strong>{forCompanyText}</strong>
                  </p>
                  <div className="stamp-wrapper inline-stamp">
                    <img src="/images/company-stamp.png" alt="Inspiring Infosys Stamp & Signature" className="official-stamp-img" />
                  </div>
                  <p className="sig-sub">
                    <strong
                      contentEditable={isEditMode}
                      suppressContentEditableWarning={true}
                      onBlur={(e) => setSignatoryTitle(e.target.innerText)}
                      className={isEditMode ? 'editable-field' : ''}
                    >{signatoryTitle}</strong>
                  </p>
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

            {/* ════════════════════════ PAGE 2: ANNEXURE A ════════════════════════ */}
            <div className={`offer-letter-page page-2 ${isEditMode ? 'editable-page-active' : ''}`}>
              {/* Top Curved Blue Header Banner */}
              <div className="doc-top-blue-header">
                <svg className="header-wave-svg" viewBox="0 0 1000 130" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="blueHeaderGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#004b99" />
                      <stop offset="50%" stopColor="#0077e6" />
                      <stop offset="100%" stopColor="#00a8ff" />
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
                <span className="doc-ref">
                  Ref No: <strong
                    contentEditable={isEditMode}
                    suppressContentEditableWarning={true}
                    onBlur={(e) => setRefNo(e.target.innerText)}
                    className={isEditMode ? 'editable-field' : ''}
                  >{refNo}</strong>
                </span>
                <span className="doc-date">{currentDateFormatted}</span>
              </div>

              {/* Annexure A Title */}
              <div className="annexure-title">
                <h2
                  contentEditable={isEditMode}
                  suppressContentEditableWarning={true}
                  onBlur={(e) => setAnnexureTitleText(e.target.innerText)}
                  className={isEditMode ? 'editable-field' : ''}
                >
                  {annexureTitleText}
                </h2>
              </div>

              <p
                contentEditable={isEditMode}
                suppressContentEditableWarning={true}
                onBlur={(e) => setAnnexureSubText(e.target.innerText)}
                className={`annexure-sub ${isEditMode ? 'editable-field' : ''}`}
              >
                {annexureSubText}
              </p>

              {/* Remuneration Table */}
              <table className="remuneration-table">
                <thead>
                  <tr>
                    <th
                      contentEditable={isEditMode}
                      suppressContentEditableWarning={true}
                      onBlur={(e) => setThComponentsText(e.target.innerText)}
                      className={isEditMode ? 'editable-field' : ''}
                    >
                      {thComponentsText}
                    </th>
                    <th
                      contentEditable={isEditMode}
                      suppressContentEditableWarning={true}
                      onBlur={(e) => setThAmountText(e.target.innerText)}
                      className={isEditMode ? 'editable-field' : ''}
                    >
                      {thAmountText}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td
                      contentEditable={isEditMode}
                      suppressContentEditableWarning={true}
                      onBlur={(e) => setTdBasicSalaryText(e.target.innerText)}
                      className={isEditMode ? 'editable-field' : ''}
                    >
                      {tdBasicSalaryText}
                    </td>
                    <td>
                      <strong
                        contentEditable={isEditMode}
                        suppressContentEditableWarning={true}
                        onBlur={(e) => setSalaryText(e.target.innerText)}
                        className={isEditMode ? 'editable-field' : ''}
                      >{salaryText}</strong>
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* Compensation & Terms */}
              <div className="terms-block">
                <h3
                  contentEditable={isEditMode}
                  suppressContentEditableWarning={true}
                  onBlur={(e) => setTermsHeadingText(e.target.innerText)}
                  className={isEditMode ? 'editable-field' : ''}
                >
                  {termsHeadingText}
                </h3>
                <ul>
                  <li
                    contentEditable={isEditMode}
                    suppressContentEditableWarning={true}
                    onBlur={(e) => setTermBullet1(e.target.innerText)}
                    className={isEditMode ? 'editable-field' : ''}
                  >
                    {termBullet1}
                  </li>
                  <li
                    contentEditable={isEditMode}
                    suppressContentEditableWarning={true}
                    onBlur={(e) => setTermBullet2(e.target.innerText)}
                    className={isEditMode ? 'editable-field' : ''}
                  >
                    {termBullet2}
                  </li>
                  <li
                    contentEditable={isEditMode}
                    suppressContentEditableWarning={true}
                    onBlur={(e) => setTermBullet3(e.target.innerText)}
                    className={isEditMode ? 'editable-field' : ''}
                  >
                    {termBullet3}
                  </li>
                </ul>

                <p
                  contentEditable={isEditMode}
                  suppressContentEditableWarning={true}
                  onBlur={(e) => setTermPara1(e.target.innerText)}
                  className={isEditMode ? 'editable-field' : ''}
                >
                  {termPara1}
                </p>

                <p
                  contentEditable={isEditMode}
                  suppressContentEditableWarning={true}
                  onBlur={(e) => setTermPara2(e.target.innerText)}
                  className={isEditMode ? 'editable-field' : ''}
                >
                  {termPara2}
                </p>

                <p
                  contentEditable={isEditMode}
                  suppressContentEditableWarning={true}
                  onBlur={(e) => setTermPara3(e.target.innerText)}
                  className={isEditMode ? 'editable-field' : ''}
                >
                  {termPara3}
                </p>

                <p
                  contentEditable={isEditMode}
                  suppressContentEditableWarning={true}
                  onBlur={(e) => setTermPara4(e.target.innerText)}
                  className={isEditMode ? 'editable-field' : ''}
                >
                  {termPara4}
                </p>

                <p
                  contentEditable={isEditMode}
                  suppressContentEditableWarning={true}
                  onBlur={(e) => setTermPara5(e.target.innerText)}
                  className={isEditMode ? 'editable-field' : ''}
                >
                  {termPara5}
                </p>
              </div>

              {/* Bottom Signatures for Annexure */}
              <div className="annexure-signatures-row">
                <div className="annexure-sig-col">
                  <p
                    contentEditable={isEditMode}
                    suppressContentEditableWarning={true}
                    onBlur={(e) => setReceivedByHeading(e.target.innerText)}
                    className={`sig-heading ${isEditMode ? 'editable-field' : ''}`}
                  >
                    {receivedByHeading}
                  </p>
                  <div className="dots-line">……………………………………………</div>
                  <p
                    contentEditable={isEditMode}
                    suppressContentEditableWarning={true}
                    onBlur={(e) => setReceivedBySub(e.target.innerText)}
                    className={`sig-sub ${isEditMode ? 'editable-field' : ''}`}
                  >
                    <strong>{receivedBySub}</strong>
                  </p>
                </div>

                <div className="annexure-sig-col right-col">
                  <p
                    contentEditable={isEditMode}
                    suppressContentEditableWarning={true}
                    onBlur={(e) => setForCompanyText(e.target.innerText)}
                    className={`sig-heading ${isEditMode ? 'editable-field' : ''}`}
                  >
                    For <strong>{forCompanyText}</strong>
                  </p>
                  <div className="stamp-wrapper inline-stamp">
                    <img src="/images/company-stamp.png" alt="Inspiring Infosys Stamp & Signature" className="official-stamp-img" />
                  </div>
                  <p className="sig-sub">
                    <strong
                      contentEditable={isEditMode}
                      suppressContentEditableWarning={true}
                      onBlur={(e) => setSignatoryTitle(e.target.innerText)}
                      className={isEditMode ? 'editable-field' : ''}
                    >{signatoryTitle}</strong>
                  </p>
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
            <div className={`offer-letter-page page-3 ${isEditMode ? 'editable-page-active' : ''}`}>
              {/* Top Curved Blue Header Banner */}
              <div className="doc-top-blue-header">
                <svg className="header-wave-svg" viewBox="0 0 1000 130" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="blueHeaderGrad3" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#004b99" />
                      <stop offset="50%" stopColor="#0077e6" />
                      <stop offset="100%" stopColor="#00a8ff" />
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
                <span className="doc-ref">
                  Ref No: <strong
                    contentEditable={isEditMode}
                    suppressContentEditableWarning={true}
                    onBlur={(e) => setRefNo(e.target.innerText)}
                    className={isEditMode ? 'editable-field' : ''}
                  >{refNo}</strong>
                </span>
                <span className="doc-date">{currentDateFormatted}</span>
              </div>

              {/* Requirements Checklist */}
              <div className="joining-checklist-block">
                <p
                  contentEditable={isEditMode}
                  suppressContentEditableWarning={true}
                  onBlur={(e) => setChecklistHeading(e.target.innerText)}
                  className={`checklist-heading ${isEditMode ? 'editable-field' : ''}`}
                >
                  {checklistHeading}
                </p>

                <ul className="checklist-items">
                  <li
                    contentEditable={isEditMode}
                    suppressContentEditableWarning={true}
                    onBlur={(e) => setChecklistItem1(e.target.innerText)}
                    className={isEditMode ? 'editable-field' : ''}
                  >
                    {checklistItem1}
                  </li>
                  <li
                    contentEditable={isEditMode}
                    suppressContentEditableWarning={true}
                    onBlur={(e) => setChecklistItem2(e.target.innerText)}
                    className={isEditMode ? 'editable-field' : ''}
                  >
                    {checklistItem2}
                  </li>
                  <li
                    contentEditable={isEditMode}
                    suppressContentEditableWarning={true}
                    onBlur={(e) => setChecklistItem3(e.target.innerText)}
                    className={isEditMode ? 'editable-field' : ''}
                  >
                    {checklistItem3}
                  </li>
                  <li
                    contentEditable={isEditMode}
                    suppressContentEditableWarning={true}
                    onBlur={(e) => setChecklistItem4(e.target.innerText)}
                    className={isEditMode ? 'editable-field' : ''}
                  >
                    {checklistItem4}
                  </li>
                  <li
                    contentEditable={isEditMode}
                    suppressContentEditableWarning={true}
                    onBlur={(e) => setChecklistItem5(e.target.innerText)}
                    className={isEditMode ? 'editable-field' : ''}
                  >
                    {checklistItem5}
                  </li>
                  <li
                    contentEditable={isEditMode}
                    suppressContentEditableWarning={true}
                    onBlur={(e) => setChecklistItem6(e.target.innerText)}
                    className={isEditMode ? 'editable-field' : ''}
                  >
                    {checklistItem6}
                  </li>
                </ul>
              </div>

              {/* Signatures */}
              <div className="page-signature-section">
                <div className="company-sig-box">
                  <p
                    contentEditable={isEditMode}
                    suppressContentEditableWarning={true}
                    onBlur={(e) => setForCompanyText(e.target.innerText)}
                    className={`sig-for-company ${isEditMode ? 'editable-field' : ''}`}
                  >
                    For <strong>{forCompanyText}</strong>
                  </p>
                  <div className="stamp-wrapper">
                    <img src="/images/company-stamp.png" alt="Inspiring Infosys Stamp & Signature" className="official-stamp-img" />
                  </div>
                  <p className="sig-title">
                    <span
                      contentEditable={isEditMode}
                      suppressContentEditableWarning={true}
                      onBlur={(e) => setSignatoryTitle(e.target.innerText)}
                      className={isEditMode ? 'editable-field' : ''}
                    >{signatoryTitle}</span>
                  </p>
                </div>

                <div className="acceptance-declaration">
                  <p
                    contentEditable={isEditMode}
                    suppressContentEditableWarning={true}
                    onBlur={(e) => setDeclarationPara(e.target.innerText)}
                    className={isEditMode ? 'editable-field' : ''}
                  >
                    {declarationPara}
                  </p>
                  <div className="dots-line">……………………………………………</div>
                  <p
                    contentEditable={isEditMode}
                    suppressContentEditableWarning={true}
                    onBlur={(e) => setReceiverSigLabel(e.target.innerText)}
                    className={`receiver-sig-label ${isEditMode ? 'editable-field' : ''}`}
                  >
                    <strong>{receiverSigLabel}</strong>
                  </p>
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

  return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : modalContent;
}

export default OfferLetter;
