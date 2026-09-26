import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { FiPrinter, FiX, FiFileText, FiCalendar, FiEdit3, FiRotateCcw, FiCheck } from 'react-icons/fi';
import { formatEmpId } from './empUtils';
import './ExperienceLetter.css';

function ExperienceLetter({ employee, onClose, isReadOnly = false }) {
  if (!employee) return null;

  useEffect(() => {
    return () => {
      document.body.classList.remove('letter-printing', 'experience-letter-printing');
    };
  }, []);

  // Helper to cleanly format date strings
  const parseLocalDate = (dateString) => {
    if (!dateString) return null;
    if (dateString instanceof Date) return isNaN(dateString.getTime()) ? null : dateString;
    const str = String(dateString).trim();
    if (!str) return null;
    const clean = str.split('T')[0];
    const delimiter = clean.includes('/') ? '/' : clean.includes('-') ? '-' : null;
    if (delimiter) {
      const parts = clean.split(delimiter);
      if (parts.length === 3) {
        if (parts[0].length === 4) {
          const y = parseInt(parts[0], 10);
          const m = parseInt(parts[1], 10) - 1;
          const d = parseInt(parts[2], 10);
          const dateObj = new Date(y, m, d);
          if (!isNaN(dateObj.getTime())) return dateObj;
        } else if (parts[2].length === 4) {
          const d = parseInt(parts[0], 10);
          const m = parseInt(parts[1], 10) - 1;
          const y = parseInt(parts[2], 10);
          const dateObj = new Date(y, m, d);
          if (!isNaN(dateObj.getTime())) return dateObj;
        }
      }
    }
    const fallback = new Date(str);
    return isNaN(fallback.getTime()) ? null : fallback;
  };

  const getLocalDateIso = (d = new Date()) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  const todayStr = getLocalDateIso(new Date());

  const getInitialJoinDate = () => {
    if (employee && employee.joinDate) {
      const d = parseLocalDate(employee.joinDate);
      if (d && !isNaN(d.getTime())) {
        const parsedIso = getLocalDateIso(d);
        if (parsedIso !== todayStr) {
          return parsedIso;
        }
      }
    }
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    return getLocalDateIso(oneYearAgo);
  };

  const [joiningDate, setJoiningDate] = useState(getInitialJoinDate());
  const [relievingDate, setRelievingDate] = useState(todayStr);
  const [isEditMode, setIsEditMode] = useState(false);

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

  const getInitialRefNo = () => {
    const issueDateObj = parseLocalDate(relievingDate) || new Date();
    const yearShort = String(issueDateObj.getFullYear()).slice(-2);
    const nextYearShort = String(issueDateObj.getFullYear() + 1).slice(-2);
    const finYearStr = `${yearShort}-${nextYearShort}`;
    const monthNameStr = issueDateObj.toLocaleDateString('en-US', { month: 'long' });

    if (employee && employee.empId && typeof employee.empId === 'string' && employee.empId.includes('/')) {
      return `EXP/${employee.empId}`;
    }
    const rawId = formatEmpId(employee.empId, employee.id);
    const cleanNum = rawId.replace(/\D/g, '') || String(employee.id || 1);
    const paddedNum = cleanNum.padStart(3, '0');
    return `${finYearStr}/EXP/${monthNameStr}/${paddedNum}`;
  };

  // Editable state fields
  const [refNo, setRefNo] = useState(getInitialRefNo());
  const [employeeName, setEmployeeName] = useState(employee.name || '');
  const [empIdText, setEmpIdText] = useState(formatEmpId(employee.empId, employee.id));
  const [designationText, setDesignationText] = useState(employee.designation || 'Software Engineer');
  const [departmentText, setDepartmentText] = useState(employee.department || 'IT & Development');
  const [subjectText, setSubjectText] = useState('EXPERIENCE CERTIFICATE & WORK SERVICE RECORD');

  const [para1, setPara1] = useState(
    `This is to certify that ${employeeName ? `Mr./Ms. ${employeeName}` : 'the employee'} was employed with INSPIRING INFOSYS from ${formattedJoiningDateLong} to ${formattedRelievingDateLong}.`
  );

  const [para2, setPara2] = useState(
    `During the tenure of employment, ${employeeName ? `Mr./Ms. ${employeeName}` : 'the employee'} held the designation of ${designationText} in the ${departmentText} department and fulfilled assigned duties with high professionalism, responsibility, and diligence.`
  );

  const [para3, setPara3] = useState(
    `During this service period, we found ${employeeName ? `Mr./Ms. ${employeeName}` : 'the employee'} to be self-motivated, honest, hardworking, and result-oriented. Professional conduct, technical skills, and commitment towards organizational objectives were exemplary.`
  );

  const [para4, setPara4] = useState(
    `We extend our sincere gratitude for the valuable contributions made to INSPIRING INFOSYS and wish ${employeeName ? `Mr./Ms. ${employeeName}` : 'the employee'} all the best and continued success in all future professional endeavors.`
  );

  const [signatoryTitle, setSignatoryTitle] = useState('Authorized Signatory / HR Director');

  useEffect(() => {
    const prefixName = employeeName ? `Mr./Ms. ${employeeName}` : 'the employee';
    setPara1(`This is to certify that ${prefixName} was employed with INSPIRING INFOSYS from ${formattedJoiningDateLong} to ${formattedRelievingDateLong}.`);
    setPara2(`During the tenure of employment, ${prefixName} held the designation of ${designationText} in the ${departmentText} department and fulfilled assigned duties with high professionalism, responsibility, and diligence.`);
    setPara3(`During this service period, we found ${prefixName} to be self-motivated, honest, hardworking, and result-oriented. Professional conduct, technical skills, and commitment towards organizational objectives were exemplary.`);
    setPara4(`We extend our sincere gratitude for the valuable contributions made to INSPIRING INFOSYS and wish ${prefixName} all the best and continued success in all future professional endeavors.`);
  }, [joiningDate, relievingDate, designationText, departmentText, employeeName]);

  const handleResetDefaults = () => {
    const prefixName = employee.name ? `Mr./Ms. ${employee.name}` : 'the employee';
    setRefNo(getInitialRefNo());
    setEmployeeName(employee.name || '');
    setEmpIdText(formatEmpId(employee.empId, employee.id));
    setDesignationText(employee.designation || 'Software Engineer');
    setDepartmentText(employee.department || 'IT & Development');
    setSubjectText('EXPERIENCE CERTIFICATE & WORK SERVICE RECORD');
    setSignatoryTitle('Authorized Signatory / HR Director');
    setPara1(`This is to certify that ${prefixName} was employed with INSPIRING INFOSYS from ${formattedJoiningDateLong} to ${formattedRelievingDateLong}.`);
    setPara2(`During the tenure of employment, ${prefixName} held the designation of ${employee.designation || 'Software Engineer'} in the ${employee.department || 'IT & Development'} department and fulfilled assigned duties with high professionalism, responsibility, and diligence.`);
    setPara3(`During this service period, we found ${prefixName} to be self-motivated, honest, hardworking, and result-oriented. Professional conduct, technical skills, and commitment towards organizational objectives were exemplary.`);
    setPara4(`We extend our sincere gratitude for the valuable contributions made to INSPIRING INFOSYS and wish ${prefixName} all the best and continued success in all future professional endeavors.`);
  };

  // Dynamic scale for mobile: fit A4 (794px) within modal body
  const modalBodyRef = useRef(null);
  const [pageScale, setPageScale] = useState(1);
  useEffect(() => {
    const computeScale = () => {
      if (!modalBodyRef.current) return;
      const available = modalBodyRef.current.clientWidth - 24;
      const a4px = 794; // 210mm at 96dpi
      setPageScale(available >= a4px ? 1 : Math.round((available / a4px) * 1000) / 1000);
    };
    computeScale();
    window.addEventListener('resize', computeScale);
    return () => window.removeEventListener('resize', computeScale);
  }, []);

  const handlePrint = () => {
    setIsEditMode(false);
    const originalTitle = document.title;
    const cleanName = (employeeName || employee?.name || 'Employee').trim().replace(/[^a-zA-Z0-9_-]/g, '_');
    document.title = `Experience_Letter_${cleanName}`;
    document.body.classList.add('letter-printing', 'experience-letter-printing');

    const cleanup = () => {
      document.title = originalTitle;
      document.body.classList.remove('letter-printing', 'experience-letter-printing');
      window.removeEventListener('afterprint', cleanup);
    };

    window.addEventListener('afterprint', cleanup);

    setTimeout(() => {
      window.print();
    }, 200);
  };

  const modalContent = (
    <div className="experience-letter-modal-overlay" onClick={onClose}>
      <div className="experience-letter-modal-card" onClick={(e) => e.stopPropagation()}>

        {/* Modal Header Bar */}
        <div className="experience-letter-modal-header no-print">
          <div className="header-top-row">
            <div className="modal-header-title">
              <FiFileText size={20} className="modal-icon" />
              <span>Official Experience Letter – <strong>{employeeName}</strong></span>
            </div>

            <div className="modal-header-actions">
              {!isReadOnly && (
                <button
                  type="button"
                  className={`btn-toggle-edit ${isEditMode ? 'active' : ''}`}
                  onClick={() => setIsEditMode(!isEditMode)}
                  title={isEditMode ? 'Finish Editing' : 'Click text on letter to edit directly'}
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

          {!isReadOnly && (
            <div className="modal-header-controls">

              <div className="control-group">
                <label><FiCalendar size={12} /> Relieving Date:</label>
                <input
                  type="date"
                  value={relievingDate}
                  onChange={(e) => setRelievingDate(e.target.value)}
                  className="date-picker-input"
                />
              </div>
            </div>
          )}
        </div>

        {/* Modal Body */}
        <div className="experience-letter-modal-body" ref={modalBodyRef}>
          <div
            className="experience-letter-document-wrapper"
            style={{ '--doc-scale': pageScale }}
          >

            {isEditMode && (
              <div className="edit-banner-info no-print">
                <FiEdit3 size={14} /> <strong>Inline Edit Mode Active:</strong> Click on any text inside the experience letter to edit employee details, designation, paragraphs, or titles directly!
              </div>
            )}

            {/* ════════════════════════ PAGE: EXPERIENCE LETTER ════════════════════════ */}
            <div className={`experience-letter-page ${isEditMode ? 'editable-page-active' : ''}`}>

              {/* Top Blue Header Banner */}
              <div className="doc-top-blue-header">
                <svg className="header-wave-svg" viewBox="0 0 1000 100" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="expBlueHeaderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#004b99" />
                      <stop offset="50%" stopColor="#0077e6" />
                      <stop offset="100%" stopColor="#00a8ff" />
                    </linearGradient>
                  </defs>
                  <path d="M 0,0 L 1000,0 L 1000,95 C 650,88 350,15 0,45 Z" fill="url(#expBlueHeaderGrad)" />
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

              {/* Certificate Heading */}
              <div className="doc-subject" style={{ textAlign: 'center', marginTop: '15px', marginBottom: '25px' }}>
                <h2
                  contentEditable={isEditMode}
                  suppressContentEditableWarning={true}
                  onBlur={(e) => setSubjectText(e.target.innerText)}
                  className={`certificate-title ${isEditMode ? 'editable-field' : ''}`}
                >
                  {subjectText}
                </h2>
              </div>

              {/* Employee Summary Highlight Card */}
              <div className="experience-highlight-box">
                <div className="highlight-item">
                  <span>Employee Name:</span> <strong
                    contentEditable={isEditMode}
                    suppressContentEditableWarning={true}
                    onBlur={(e) => setEmployeeName(e.target.innerText)}
                    className={isEditMode ? 'editable-field' : ''}
                  >{employeeName}</strong>
                </div>
                <div className="highlight-item">
                  <span>Employee ID:</span> <strong
                    contentEditable={isEditMode}
                    suppressContentEditableWarning={true}
                    onBlur={(e) => setEmpIdText(e.target.innerText)}
                    className={isEditMode ? 'editable-field' : ''}
                  >{empIdText}</strong>
                </div>
                <div className="highlight-item">
                  <span>Designation:</span> <strong
                    contentEditable={isEditMode}
                    suppressContentEditableWarning={true}
                    onBlur={(e) => setDesignationText(e.target.innerText)}
                    className={isEditMode ? 'editable-field' : ''}
                  >{designationText}</strong>
                </div>
                <div className="highlight-item">
                  <span>Department:</span> <strong
                    contentEditable={isEditMode}
                    suppressContentEditableWarning={true}
                    onBlur={(e) => setDepartmentText(e.target.innerText)}
                    className={isEditMode ? 'editable-field' : ''}
                  >{departmentText}</strong>
                </div>
                <div className="highlight-item full-width">
                  <span>Service Period:</span> <strong>{formattedJoiningDate} to {formattedRelievingDate}</strong>
                </div>
              </div>

              {/* Body Paragraphs */}
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
                  onBlur={(e) => setPara4(e.target.innerText)}
                  className={isEditMode ? 'editable-field' : ''}
                >
                  {para4}
                </p>
              </div>

              {/* Signatures & Stamp */}
              <div className="experience-signatures-row">
                <div className="experience-sig-col">
                  <p className="sig-heading">Issued To</p>
                  <div className="dots-line">……………………………………………</div>
                  <p className="sig-sub"><strong>{employeeName}</strong></p>
                </div>

                <div className="experience-sig-col right-col">
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

  return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : modalContent;
}

export default ExperienceLetter;
