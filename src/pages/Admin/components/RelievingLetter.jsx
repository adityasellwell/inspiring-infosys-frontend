import React, { useState, useEffect } from 'react';
import { FiPrinter, FiX, FiFileText, FiCalendar, FiEdit3, FiRotateCcw, FiCheck } from 'react-icons/fi';
import { formatEmpId } from './empUtils';
import './RelievingLetter.css';

function RelievingLetter({ employee, onClose }) {
  if (!employee) return null;

  const todayStr = new Date().toISOString().split('T')[0];
  
  // Default resignation date: 30 days prior to today
  const defaultResignDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  // Joining date calculation
  const getInitialJoinDate = () => {
    if (employee.joinDate) {
      const parsedIso = new Date(employee.joinDate).toISOString().split('T')[0];
      if (parsedIso !== todayStr) {
        return parsedIso;
      }
    }
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    return oneYearAgo.toISOString().split('T')[0];
  };

  const [joiningDate, setJoiningDate] = useState(getInitialJoinDate());
  const [resignationDate, setResignationDate] = useState(defaultResignDate);
  const [relievingDate, setRelievingDate] = useState(todayStr);
  const [noticePeriodStatus, setNoticePeriodStatus] = useState('Fully Served');
  const [isEditMode, setIsEditMode] = useState(false);

  // Helper to cleanly format date strings (YYYY-MM-DD)
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

  const formatDateDisplay = (dateString) => {
    const d = parseLocalDate(dateString);
    if (!d || isNaN(d.getTime())) return dateString || '';
    return d.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).replace(/\//g, '/');
  };

  const formatDateLong = (dateString) => {
    const d = parseLocalDate(dateString);
    if (!d || isNaN(d.getTime())) return dateString || '';
    return d.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formattedJoiningDate = formatDateDisplay(joiningDate);
  const formattedJoiningDateLong = formatDateLong(joiningDate);
  const formattedRelievingDate = formatDateDisplay(relievingDate);
  const formattedRelievingDateLong = formatDateLong(relievingDate);
  const formattedResignationDate = formatDateDisplay(resignationDate);
  const formattedResignationDateLong = formatDateLong(resignationDate);

  // Reference Number Format
  const getInitialRefNo = () => {
    const issueDateObj = parseLocalDate(relievingDate) || new Date();
    const yearShort = String(issueDateObj.getFullYear()).slice(-2);
    const nextYearShort = String(issueDateObj.getFullYear() + 1).slice(-2);
    const finYearStr = `${yearShort}-${nextYearShort}`;
    const monthNameStr = issueDateObj.toLocaleDateString('en-US', { month: 'long' });

    if (employee.empId && employee.empId.includes('/')) {
      return `REL/${employee.empId}`;
    }
    const rawId = formatEmpId(employee.empId, employee.id);
    const cleanNum = rawId.replace(/\D/g, '') || String(employee.id || 1);
    const paddedNum = cleanNum.padStart(3, '0');
    return `${finYearStr}/REL/${monthNameStr}/${paddedNum}`;
  };

  // Editable state fields
  const [refNo, setRefNo] = useState(getInitialRefNo());
  const [employeeName, setEmployeeName] = useState(employee.name || '');
  const [empIdText, setEmpIdText] = useState(formatEmpId(employee.empId, employee.id));
  const [designationText, setDesignationText] = useState(employee.designation || 'Software Engineer');
  const [departmentText, setDepartmentText] = useState(employee.department || 'IT & Development');
  const [addressText, setAddressText] = useState(employee.address || '');
  const [subjectText, setSubjectText] = useState('RELIEVING LETTER & FORMAL RELEASE FROM DUTIES');
  
  const [para1, setPara1] = useState(
    `This has reference to your formal resignation letter dated ${formattedResignationDateLong || formattedResignationDate}, requesting release from your employment services at INSPIRING INFOSYS.`
  );
  
  const [para2, setPara2] = useState(
    `We hereby officially confirm that your resignation has been accepted by the Management. Consequently, you stand formally relieved from your duties and responsibilities as ${designationText} in the ${departmentText} department with effect from the close of business hours on ${formattedRelievingDateLong || formattedRelievingDate}.`
  );

  const [para3, setPara3] = useState(
    `We further confirm that you have successfully completed all requisite project handovers, returned company assets, identity badges, data files, and confidential materials entrusted to you. All your final financial dues, salary accounts, and full-and-final settlement obligations have been cleared in accordance with company rules.`
  );

  const [para4, setPara4] = useState(
    `During your service period with INSPIRING INFOSYS from ${formattedJoiningDateLong} to ${formattedRelievingDateLong}, we found your professional conduct, technical skills, and commitment towards assigned tasks to be satisfactory and commendable.`
  );

  const [para5, setPara5] = useState(
    `We take this opportunity to thank you for your valuable services and contributions to INSPIRING INFOSYS and wish you all the best and continued success in your future professional career.`
  );

  const [signatoryTitle, setSignatoryTitle] = useState('Authorized Signatory / HR Director');

  // Update paragraphs dynamically when dates or design/dept change IF admin hasn't customized them manually
  useEffect(() => {
    setPara1(`This has reference to your formal resignation letter dated ${formattedResignationDateLong || formattedResignationDate}, requesting release from your employment services at INSPIRING INFOSYS.`);
    setPara2(`We hereby officially confirm that your resignation has been accepted by the Management. Consequently, you stand formally relieved from your duties and responsibilities as ${designationText} in the ${departmentText} department with effect from the close of business hours on ${formattedRelievingDateLong || formattedRelievingDate}.`);
    setPara4(`During your service period with INSPIRING INFOSYS from ${formattedJoiningDateLong} to ${formattedRelievingDateLong}, we found your professional conduct, technical skills, and commitment towards assigned tasks to be satisfactory and commendable.`);
  }, [joiningDate, resignationDate, relievingDate, designationText, departmentText]);

  const handleResetDefaults = () => {
    setRefNo(getInitialRefNo());
    setEmployeeName(employee.name || '');
    setEmpIdText(formatEmpId(employee.empId, employee.id));
    setDesignationText(employee.designation || 'Software Engineer');
    setDepartmentText(employee.department || 'IT & Development');
    setAddressText(employee.address || '');
    setSubjectText('RELIEVING LETTER & FORMAL RELEASE FROM DUTIES');
    setSignatoryTitle('Authorized Signatory / HR Director');
    setPara1(`This has reference to your formal resignation letter dated ${formattedResignationDateLong || formattedResignationDate}, requesting release from your employment services at INSPIRING INFOSYS.`);
    setPara2(`We hereby officially confirm that your resignation has been accepted by the Management. Consequently, you stand formally relieved from your duties and responsibilities as ${employee.designation || 'Software Engineer'} in the ${employee.department || 'IT & Development'} department with effect from the close of business hours on ${formattedRelievingDateLong || formattedRelievingDate}.`);
    setPara3(`We further confirm that you have successfully completed all requisite project handovers, returned company assets, identity badges, data files, and confidential materials entrusted to you. All your final financial dues, salary accounts, and full-and-final settlement obligations have been cleared in accordance with company rules.`);
    setPara4(`During your service period with INSPIRING INFOSYS from ${formattedJoiningDateLong} to ${formattedRelievingDateLong}, we found your professional conduct, technical skills, and commitment towards assigned tasks to be satisfactory and commendable.`);
    setPara5(`We take this opportunity to thank you for your valuable services and contributions to INSPIRING INFOSYS and wish you all the best and continued success in your future professional career.`);
  };

  const handlePrint = () => {
    setIsEditMode(false);
    setTimeout(() => {
      window.print();
    }, 100);
  };

  const recipientPrefix = employeeName && (employeeName.toLowerCase().startsWith('mr.') || employeeName.toLowerCase().startsWith('ms.'))
    ? ''
    : 'Mr./Ms. ';

  return (
    <div className="relieving-letter-modal-overlay" onClick={onClose}>
      <div className="relieving-letter-modal-card" onClick={(e) => e.stopPropagation()}>
        
        {/* Modal Header Bar (Hidden during Print) */}
        <div className="relieving-letter-modal-header no-print">
          <div className="header-top-row">
            <div className="modal-header-title">
              <FiFileText size={20} className="modal-icon" />
              <span>Official Relieving Letter – <strong>{employeeName}</strong></span>
            </div>

            <div className="modal-header-actions">
              <button
                type="button"
                className={`btn-toggle-edit ${isEditMode ? 'active' : ''}`}
                onClick={() => setIsEditMode(!isEditMode)}
                title={isEditMode ? 'Finish Editing' : 'Click text on letter to edit directly'}
              >
                {isEditMode ? <><FiCheck size={14} /> Done Editing</> : <><FiEdit3 size={14} /> Edit Text</>}
              </button>

              <button
                type="button"
                className="btn-modal-print"
                onClick={handlePrint}
                title="Print or Save as PDF"
              >
                <FiPrinter size={16} /> Print / Save PDF
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

          <div className="modal-header-controls">

            <div className="control-group">
              <label><FiCalendar size={12} /> Resignation Date:</label>
              <input
                type="date"
                value={resignationDate}
                onChange={(e) => setResignationDate(e.target.value)}
                className="date-picker-input"
              />
            </div>

            <div className="control-group">
              <label><FiCalendar size={12} /> Relieving Date:</label>
              <input
                type="date"
                value={relievingDate}
                onChange={(e) => setRelievingDate(e.target.value)}
                className="date-picker-input"
              />
            </div>

            <div className="control-group">
              <label>Notice Period:</label>
              <select
                value={noticePeriodStatus}
                onChange={(e) => setNoticePeriodStatus(e.target.value)}
                className="select-input"
              >
                <option value="Fully Served">Fully Served</option>
                <option value="Waived Off">Waived Off</option>
                <option value="Buyout Completed">Buyout Completed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="relieving-letter-modal-body">
          <div className="relieving-letter-document-wrapper">

            {isEditMode && (
              <div className="edit-banner-info no-print">
                <FiEdit3 size={14} /> <strong>Inline Edit Mode Active:</strong> Click on any text inside the letter below to edit names, designation, paragraphs, reference numbers, or signatory notes directly!
              </div>
            )}

            {/* ════════════════════════ PAGE 1: RELIEVING LETTER ════════════════════════ */}
            <div className={`relieving-letter-page page-1 ${isEditMode ? 'editable-page-active' : ''}`}>
              
              {/* Top Curved Blue Header Banner */}
              <div className="doc-top-blue-header">
                <svg className="header-wave-svg" viewBox="0 0 1000 100" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="relievingBlueHeaderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#08529c" />
                      <stop offset="60%" stopColor="#0b66b8" />
                      <stop offset="100%" stopColor="#0d7acc" />
                    </linearGradient>
                  </defs>
                  <path d="M 0,0 L 1000,0 L 1000,95 C 650,88 350,15 0,45 Z" fill="url(#relievingBlueHeaderGrad)" />
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
                <span className="doc-date">Date: <strong>{formattedRelievingDate}</strong></span>
              </div>

              {/* Recipient Details */}
              <div className="doc-recipient">
                <p className="to-label">To,</p>
                <p className="recipient-name">
                  <strong>
                    {recipientPrefix}
                    <span
                      contentEditable={isEditMode}
                      suppressContentEditableWarning={true}
                      onBlur={(e) => setEmployeeName(e.target.innerText)}
                      className={isEditMode ? 'editable-field' : ''}
                    >{employeeName}</span>
                  </strong>
                </p>
                
                <p className="recipient-detail">
                  <strong>Emp ID:</strong>{' '}
                  <span
                    contentEditable={isEditMode}
                    suppressContentEditableWarning={true}
                    onBlur={(e) => setEmpIdText(e.target.innerText)}
                    className={isEditMode ? 'editable-field' : ''}
                  >{empIdText}</span>
                </p>

                <p className="recipient-detail">
                  <strong>Designation:</strong>{' '}
                  <span
                    contentEditable={isEditMode}
                    suppressContentEditableWarning={true}
                    onBlur={(e) => setDesignationText(e.target.innerText)}
                    className={isEditMode ? 'editable-field' : ''}
                  >{designationText}</span>
                </p>

                <p className="recipient-detail">
                  <strong>Department:</strong>{' '}
                  <span
                    contentEditable={isEditMode}
                    suppressContentEditableWarning={true}
                    onBlur={(e) => setDepartmentText(e.target.innerText)}
                    className={isEditMode ? 'editable-field' : ''}
                  >{departmentText}</span>
                </p>

                <p className="recipient-address">
                  <span
                    contentEditable={isEditMode}
                    suppressContentEditableWarning={true}
                    onBlur={(e) => setAddressText(e.target.innerText)}
                    className={isEditMode ? 'editable-field' : ''}
                  >{addressText}</span>
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

              {/* Main Body Paragraphs */}
              <div className="doc-paragraphs">
                <p>
                  Dear <strong>{employeeName}</strong>,
                </p>

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

                <div className="relieving-highlight-box">
                  <div className="highlight-item">
                    <span>Employee Name:</span> <strong>{employeeName}</strong>
                  </div>
                  <div className="highlight-item">
                    <span>Designation:</span> <strong>{designationText}</strong>
                  </div>
                  <div className="highlight-item">
                    <span>Tenure Period:</span> <strong>{formattedJoiningDate} to {formattedRelievingDate}</strong>
                  </div>
                  <div className="highlight-item">
                    <span>Relieving Date:</span> <strong>{formattedRelievingDateLong}</strong>
                  </div>
                  <div className="highlight-item">
                    <span>Notice Status:</span> <strong>{noticePeriodStatus}</strong>
                  </div>
                </div>

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
                  onBlur={(e) => setPara4(e.target.innerText)}
                  className={isEditMode ? 'editable-field' : ''}
                >
                  {para4}
                </p>

                <p
                  contentEditable={isEditMode}
                  suppressContentEditableWarning={true}
                  onBlur={(e) => setPara5(e.target.innerText)}
                  className={isEditMode ? 'editable-field' : ''}
                >
                  {para5}
                </p>
              </div>

              {/* Signatures & Stamps */}
              <div className="relieving-signatures-row">
                <div className="relieving-sig-col">
                  <p className="sig-heading">Employee Acknowledgment</p>
                  <div className="dots-line">……………………………………………</div>
                  <p className="sig-sub"><strong>Signature of {employeeName}</strong></p>
                  <p className="sig-date">Date: {formattedRelievingDate}</p>
                </div>

                <div className="relieving-sig-col right-col">
                  <p className="sig-heading">For <strong>Inspiring Infosys</strong></p>
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

              {/* Official Page Footer */}
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

export default RelievingLetter;
